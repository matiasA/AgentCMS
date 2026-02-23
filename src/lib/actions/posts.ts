"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { PostStatus } from "@prisma/client";

export async function createDraftPost() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    const newPost = await prisma.post.create({
        data: {
            title: "",
            slug: `borrador-${Date.now()}`,
            content: "",
            status: PostStatus.DRAFT,
            authorId: session.user.id,
        },
    });

    revalidatePath("/wp-admin/posts");
    return newPost;
}

export async function updatePost(id: string, data: { title?: string; content?: string; status?: PostStatus }) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    let slug;
    if (data.title && data.title.trim() !== "") {
        slug = slugify(data.title, { lower: true, strict: true }) + "-" + id.slice(-4);
    }

    const updated = await prisma.post.update({
        where: { id },
        data: {
            ...data,
            ...(slug && { slug }),
        },
    });

    revalidatePath("/wp-admin/posts");
    revalidatePath(`/wp-admin/posts/${id}`);

    return updated;
}
