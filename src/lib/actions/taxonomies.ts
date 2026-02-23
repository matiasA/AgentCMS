"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import slugify from "slugify";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function createCategory(name: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");
    const slug = slugify(name, { lower: true, strict: true });

    const exists = await prisma.category.findUnique({ where: { slug } });
    if (exists) return exists;

    const newCat = await prisma.category.create({ data: { name, slug } });
    revalidatePath("/wp-admin/posts/[id]", "page");
    return newCat;
}

export async function getTags() {
    return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function createTag(name: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");
    const slug = slugify(name, { lower: true, strict: true });

    const exists = await prisma.tag.findUnique({ where: { slug } });
    if (exists) return exists;

    const newTag = await prisma.tag.create({ data: { name, slug } });
    revalidatePath("/wp-admin/posts/[id]", "page");
    return newTag;
}

export async function syncTaxonomiesToPost(postId: string, categoryIds: string[], tagIds: string[]) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    await prisma.$transaction([
        prisma.postCategory.deleteMany({ where: { postId } }),
        prisma.postTag.deleteMany({ where: { postId } }),

        prisma.postCategory.createMany({
            data: categoryIds.map((categoryId) => ({ postId, categoryId }))
        }),
        prisma.postTag.createMany({
            data: tagIds.map((tagId) => ({ postId, tagId }))
        })
    ]);

    revalidatePath(`/wp-admin/posts`);
    revalidatePath(`/wp-admin/posts/${postId}`);
}
