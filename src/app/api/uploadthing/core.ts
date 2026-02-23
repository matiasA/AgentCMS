import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const session = await auth();
            if (!session?.user?.id) throw new Error("No autorizado");
            return { userId: session.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // Aquí registraríamos el archivo en nuestra de Medios (Media)
            await prisma.media.create({
                data: {
                    filename: file.key,
                    originalName: file.name,
                    mimeType: "image/unknown", // uploadthing no nos da el mimeType directamente fácilmente sin buscar la extensión
                    size: file.size,
                    url: file.url,
                    uploadedById: metadata.userId
                }
            });
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
