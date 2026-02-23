import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function PostsPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            author: true,
            categories: { include: { category: true } },
        },
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-normal text-[#1d2327]">Entradas</h1>
                <Link href="/wp-admin/posts/new">
                    <Button variant="outline" size="sm" className="border-[#2271b1] text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition-colors h-7 px-3 text-sm">
                        Añadir nueva
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
                <table className="w-full text-left text-sm text-[#50575e]">
                    <thead className="border-b border-[#c3c4c7] font-semibold text-[#2c3338]">
                        <tr>
                            <th className="px-4 py-2 font-medium">Título</th>
                            <th className="px-4 py-2 font-medium">Autor</th>
                            <th className="px-4 py-2 font-medium">Categorías</th>
                            <th className="px-4 py-2 font-medium text-center"><span title="Comentarios">💬</span></th>
                            <th className="px-4 py-2 font-medium">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f1]">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No se encontraron entradas.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-[#f6f7f7] group">
                                    <td className="px-4 py-3 align-top">
                                        <Link href={`/wp-admin/posts/${post.id}`} className="font-semibold text-[#2271b1] hover:text-[#135e96] block text-base">
                                            {post.title}
                                        </Link>
                                        <div className="invisible group-hover:visible flex gap-2 text-[13px] mt-1 text-[#2271b1]">
                                            <Link href={`/wp-admin/posts/${post.id}`} className="hover:underline">Editar</Link>
                                            <span className="text-[#c3c4c7]">|</span>
                                            <button className="text-[#d63638] hover:underline">Papelera</button>
                                            <span className="text-[#c3c4c7]">|</span>
                                            <Link href={`/p/${post.slug}`} className="hover:underline" target="_blank">Ver</Link>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <Link href={`/wp-admin/users/${post.authorId}`} className="text-[#2271b1] hover:underline">
                                            {post.author.name || post.author.email}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        {post.categories.length > 0
                                            ? post.categories.map(c => c.category.name).join(", ")
                                            : "Sin categoría"}
                                    </td>
                                    <td className="px-4 py-3 align-top text-center text-[#2271b1]">
                                        <div className="bg-[#f0f0f1] rounded-full inline-block px-2 text-xs font-semibold cursor-pointer hover:bg-[#dcdcde] hover:text-[#135e96]">
                                            0
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        {post.status === "PUBLISHED" ? "Publicada" : "Última modificación"}<br />
                                        {format(post.updatedAt, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
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
