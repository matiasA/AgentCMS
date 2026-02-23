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

import { moderateCommentWithAI } from "./ai";

export async function analyzeCommentAI(id: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    const scores = await moderateCommentWithAI(content);

    // Automatically flag as spam if high probability
    let newStatus = undefined;
    if (scores.spamScore > 0.8 || scores.toxicScore > 0.8) {
        newStatus = "SPAM";
    }

    await prisma.comment.update({
        where: { id },
        data: {
            aiSpamScore: scores.spamScore,
            aiToxicScore: scores.toxicScore,
            ...(newStatus ? { status: newStatus as any } : {})
        }
    });

    revalidatePath("/wp-admin/comments");
    return scores;
}
