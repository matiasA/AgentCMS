"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { XMLParser } from "fast-xml-parser";
import { PostStatus } from "@prisma/client";

export async function importWpXml(xmlContent: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    const userId = session.user.id;
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        cdataPropName: "__cdata",
        parseTagValue: false,
    });

    let jObj;
    try {
        jObj = parser.parse(xmlContent);
    } catch (e) {
        throw new Error("El archivo no es un XML válido.");
    }

    const channel = jObj?.rss?.channel;
    if (!channel) throw new Error("No se encontró el canal RSS de WordPress.");

    const items = Array.isArray(channel.item) ? channel.item : [channel.item].filter(Boolean);
    if (!items.length) {
        return { success: true, count: 0, message: "No se encontraron posts en el archivo." };
    }

    let count = 0;
    for (const item of items) {
        const title = item.title?.["__cdata"] || item.title || "Sin título";
        const contentRaw = item["content:encoded"]?.["__cdata"] || item["content:encoded"] || "";
        const slug = item["wp:post_name"]?.__cdata || item["wp:post_name"] || `importado-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const statusRaw = item["wp:status"] || "draft";
        const postType = item["wp:post_type"] || "post";

        // Skip non-posts for now, or insert them as pages later
        if (postType !== "post" && postType !== "page") continue;

        let status: PostStatus = PostStatus.DRAFT;
        if (statusRaw === "publish") status = PostStatus.PUBLISHED;
        else if (statusRaw === "pending") status = PostStatus.PENDING;
        else if (statusRaw === "private") status = PostStatus.PRIVATE;
        else if (statusRaw === "trash") status = PostStatus.TRASH;

        // Basic BlockNote transformation
        // Since we can't reliably convert HTML to BlockNote JSON server-side without an editor instance,
        // we'll store the content in a simple paragraph block to prevent the editor from breaking.
        // The user will see their HTML text temporarily, or we could just inject it into text.
        // Actually, BlockNote can parse raw HTML if we use a specific API, but for simplicity:
        const blocknoteContent = [
            {
                type: "paragraph",
                content: [{ type: "text", text: "--- Contenido Importado (HTML Raw) ---\n" + contentRaw.substring(0, 50000) }]
            }
        ];

        try {
            if (postType === "post") {
                await prisma.post.create({
                    data: {
                        title: typeof title === "string" ? title : String(title),
                        slug: String(slug).substring(0, 100),
                        content: blocknoteContent as any,
                        status,
                        authorId: userId,
                    }
                });
            } else if (postType === "page") {
                await prisma.page.create({
                    data: {
                        title: typeof title === "string" ? title : String(title),
                        slug: String(slug).substring(0, 100),
                        content: blocknoteContent as any,
                        status,
                        authorId: userId,
                    }
                });
            }
            count++;
        } catch (e) {
            console.error("Failed to import item:", title, e);
            // Ignore unique slug errors and continue
        }
    }

    return { success: true, count, message: `Se importaron ${count} entradas/páginas correctamente.` };
}
