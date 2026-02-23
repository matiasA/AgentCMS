import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function RevisionsPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            revisions: {
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!post) notFound();

    async function restoreRevision(formData: FormData) {
        "use server";
        const revId = formData.get("revId") as string;
        const rev = await prisma.postRevision.findUnique({ where: { id: revId } });
        if (!rev) return;

        // Save current as revision first
        const currentPost = await prisma.post.findUnique({ where: { id: post!.id } });
        if (currentPost && currentPost.content) {
            await prisma.postRevision.create({
                data: { postId: currentPost.id, title: currentPost.title, content: currentPost.content }
            });
        }

        // Restore
        await prisma.post.update({
            where: { id: post!.id },
            data: { content: rev.content as any, title: rev.title }
        });

        revalidatePath(`/wp-admin/posts/${post!.id}`);
        redirect(`/wp-admin/posts/${post!.id}`);
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-normal text-[#1d2327]">Revisiones: {post.title}</h1>
                <Link href={`/wp-admin/posts/${post.id}`} className="text-[#2271b1] text-sm border border-[#2271b1] px-3 py-1 rounded-sm hover:bg-[#f6f7f7]">
                    Volver al editor
                </Link>
            </div>

            <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm text-[#50575e]">
                    <thead className="bg-[#f6f7f7] border-b border-[#c3c4c7]">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-[#2c3338]">Fecha de revisión</th>
                            <th className="px-4 py-3 font-semibold text-[#2c3338]">Puntos clave</th>
                            <th className="px-4 py-3 font-semibold text-[#2c3338] text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f1]">
                        {post.revisions.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-6 text-center text-gray-500 italic">No hay revisiones anteriores para esta entrada.</td>
                            </tr>
                        ) : (
                            post.revisions.map((rev) => (
                                <tr key={rev.id} className="hover:bg-[#f9f9f9] transition-colors">
                                    <td className="px-4 py-3 font-medium text-[#1d2327]">
                                        {format(rev.createdAt, "dd/MM/yyyy HH:mm:ss", { locale: es })}
                                    </td>
                                    <td className="px-4 py-3">
                                        Título: <strong>{rev.title || "(Sin título)"}</strong>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <form action={restoreRevision}>
                                            <input type="hidden" name="revId" value={rev.id} />
                                            <button type="submit" className="text-[#2271b1] hover:underline font-medium">Restaurar esta revisión</button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {post.revisions.length > 0 && (
                <p className="text-xs text-gray-500 mt-4 italic">Al restaurar una revisión, el contenido actual formará parte de una nueva revisión para que no pierdas ningún progreso.</p>
            )}
        </div>
    );
}
