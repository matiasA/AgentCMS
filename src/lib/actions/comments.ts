"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function setCommentStatus(id: string, status: "APPROVED" | "PENDING" | "SPAM" | "TRASH") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    await prisma.comment.update({
        where: { id },
        data: { status }
    });

    revalidatePath("/wp-admin/comments");
}

export async function deleteComment(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    await prisma.comment.delete({ where: { id } });
    revalidatePath("/wp-admin/comments");
}
