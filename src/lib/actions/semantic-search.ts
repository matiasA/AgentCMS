"use server";

import prisma from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function updatePostEmbedding(postId: string, contentText: string) {
    if (!process.env.OPENAI_API_KEY) return;
    if (!contentText || contentText.trim() === "") return;

    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small", // Dimensions: 1536
            input: contentText,
        });

        const embedding = response.data[0].embedding;
        const vectorLiteral = `[${embedding.join(',')}]`;

        // Direct raw update to avoid Prisma Unsupported types mapping issues
        await prisma.$executeRawUnsafe(
            `UPDATE "posts" SET "embedding" = $1::vector WHERE id = $2`,
            vectorLiteral,
            postId
        );
    } catch (e: any) {
        console.error("Embedding generation failed:", e.message);
    }
}

export async function semanticSearch(query: string) {
    if (!process.env.OPENAI_API_KEY) throw new Error("API Key missing");

    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: query,
        });

        const queryEmbedding = response.data[0].embedding;
        const vectorLiteral = `[${queryEmbedding.join(',')}]`;

        // Nearest neighbor search using cosine distance `<=>`
        const results = await prisma.$queryRawUnsafe(`
            SELECT id, title, slug, excerpt, 
                   1 - ("embedding" <=> $1::vector) as similarity
            FROM "posts"
            WHERE "embedding" IS NOT NULL
            ORDER BY "embedding" <=> $1::vector
            LIMIT 5
        `, vectorLiteral);

        return results as Array<{ id: string, title: string, slug: string, excerpt: string, similarity: number }>;
    } catch (e: any) {
        console.error("Semantic search failed:", e);
        return [];
    }
}
