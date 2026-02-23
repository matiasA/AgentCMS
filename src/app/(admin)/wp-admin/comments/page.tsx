import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import CommentRowActions from "./CommentRowActions";

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
    const comments = await prisma.comment.findMany({
        orderBy: { createdAt: "desc" },
        include: { post: true, author: true }
    });

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-normal text-[#1d2327] mb-6">Comentarios</h1>

            <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
                <table className="w-full text-left text-sm text-[#50575e]">
                    <thead className="border-b border-[#c3c4c7] font-semibold text-[#2c3338]">
                        <tr>
                            <th className="px-4 py-2 font-medium w-1/4">Autor</th>
                            <th className="px-4 py-2 font-medium w-1/2">Comentario</th>
                            <th className="px-4 py-2 font-medium w-1/4">En respuesta a</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f1]">
                        {comments.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                                    No se encontraron comentarios.
                                </td>
                            </tr>
                        ) : (
                            comments.map((comment) => (
                                <tr key={comment.id} className={`hover:bg-[#f6f7f7] group ${comment.status === "PENDING" ? "bg-[#fef8ee]" : ""} ${comment.status === "SPAM" ? "bg-[#fcf0f1]" : ""}`}>
                                    <td className="px-4 py-3 align-top border-l-4 border-transparent hover:border-[#2271b1]">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>
                                            <div>
                                                <strong className="text-[#2c3338] block">{comment.author ? comment.author.name : comment.guestName || "Anónimo"}</strong>
                                                {comment.guestEmail && <Link href={`mailto:${comment.guestEmail}`} className="text-[#2271b1] hover:underline block truncate max-w-[150px]">{comment.guestEmail}</Link>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <div className="text-[#50575e] text-[13px] mb-1">
                                            Enviado el <Link href={`/wp-admin/comments/${comment.id}`} className="hover:underline text-[#2271b1]">{format(comment.createdAt, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}</Link>
                                            {comment.status === "PENDING" && <span className="ml-2 font-semibold text-[#d63638]">Pendiente</span>}
                                            {comment.status === "SPAM" && <span className="ml-2 font-semibold text-[#d63638]">Spam</span>}
                                        </div>
                                        <p className="text-[#1d2327] mb-2">{comment.content}</p>
                                        <CommentRowActions commentId={comment.id} currentStatus={comment.status} />
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <Link href={`/wp-admin/posts/${comment.postId}`} className="text-[#2271b1] hover:underline font-medium block">
                                            {comment.post.title || "(Sin título)"}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
