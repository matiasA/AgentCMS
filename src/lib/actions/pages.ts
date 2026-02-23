"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { PostStatus } from "@prisma/client";

export async function createDraftPage() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    const newPage = await prisma.page.create({
        data: {
            title: "",
            slug: `borrador-pagina-${Date.now()}`,
            content: [],
            status: PostStatus.DRAFT,
            authorId: session.user.id,
        },
    });

    revalidatePath("/wp-admin/pages");
    return newPage;
}

export async function updatePage(id: string, data: { title?: string; content?: string; status?: PostStatus; parentId?: string; template?: string }) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    let slug;
    if (data.title && data.title.trim() !== "") {
        slug = slugify(data.title, { lower: true, strict: true }) + "-" + id.slice(-4);
    }

    const parentId = data.parentId === "none" ? null : data.parentId;

    // Remove parentId from data if we are overriding it locally to ensure Prisma compatibility
    const cleanData = { ...data };
    delete cleanData.parentId;

    const updated = await prisma.page.update({
        where: { id },
        data: {
            ...cleanData,
            parentId,
            ...(slug && { slug }),
        },
    });

    revalidatePath("/wp-admin/pages");
    revalidatePath(`/wp-admin/pages/${id}`);

    return updated;
}
