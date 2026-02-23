"use server";

import OpenAI from "openai";

// Inicializamos el cliente. Si no hay API KEY, no debe fallar la inicialización en sí,
// sino cuando se haga una petición.
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function generateSEO(content: string) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY no está configurada.");

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Eres un experto en SEO. Tu tarea es analizar el siguiente texto y devolver un título SEO atractivo (max 60 caracteres) y una descripción SEO (max 160 caracteres). Devuelve ÚNICAMENTE un objeto JSON válido con las claves 'seoTitle' y 'seoDescription'." },
                { role: "user", content }
            ],
            response_format: { type: "json_object" }
        });

        const result = response.choices[0].message.content;
        if (!result) throw new Error("No response from AI");
        return JSON.parse(result) as { seoTitle: string; seoDescription: string };
    } catch (e: any) {
        console.error("AI Error:", e);
        throw new Error("No se pudo generar el SEO. Revisa tu API key y cuota.");
    }
}

export async function generateImage(prompt: string) {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY no está configurada.");

    try {
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard"
        });

        const imageUrl = response.data?.[0]?.url;
        if (!imageUrl) throw new Error("No image generated");
        return imageUrl;
    } catch (e: any) {
        console.error("AI Error:", e);
        throw new Error("No se pudo generar la imagen. Revisa tu prompt o tu API key.");
    }
}

export async function moderateCommentWithAI(content: string) {
    // Si no hay key, saltamos la moderación por defecto (0 spam)
    if (!process.env.OPENAI_API_KEY) return { spamScore: 0, toxicScore: 0 };

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Eres un moderador de comentarios estricto. Analiza el comentario y determina la probabilidad de que sea SPAM (0.0 a 1.0) y la probabilidad de que sea TÓXICO/OFENSIVO (0.0 a 1.0). Devuelve ÚNICAMENTE un JSON con las claves 'spamScore' y 'toxicScore'." },
                { role: "user", content }
            ],
            response_format: { type: "json_object" }
        });

        const result = response.choices[0].message.content;
        if (!result) return { spamScore: 0, toxicScore: 0 };
        return JSON.parse(result) as { spamScore: number; toxicScore: number };
    } catch (e: any) {
        console.error("AI Error:", e);
        return { spamScore: 0, toxicScore: 0 };
    }
}

export async function rewriteText(text: string, style: "professional" | "casual" | "expand" | "shorten") {
    if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY no está configurada.");

    let prompt = "";
    switch (style) {
        case "professional": prompt = "Reescribe el siguiente texto con un tono profesional y corporativo:"; break;
        case "casual": prompt = "Reescribe el siguiente texto con un tono casual, relajado y amigable:"; break;
        case "expand": prompt = "Expande el siguiente texto, añadiendo más detalles y contexto manteniendo la idea original:"; break;
        case "shorten": prompt = "Resume y acorta el siguiente texto, yendo directo al grano:"; break;
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Eres un asistente de escritura avanzado. Tu única tarea es reescribir/editar el texto proporcionado según las instrucciones. No añadas introducciones ni conclusiones." },
                { role: "user", content: `${prompt}\n\n${text}` }
            ],
        });

        return response.choices[0].message.content || text;
    } catch (e: any) {
        console.error("AI Error:", e);
        throw new Error("No se pudo modificar el texto.");
    }
}
