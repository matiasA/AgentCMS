import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    const tag = await prisma.tag.findUnique({
        where: { slug }
    });

    if (!tag) notFound();

    const posts = await prisma.post.findMany({
        where: {
            status: "PUBLISHED",
            tags: { some: { tagId: tag.id } }
        },
        orderBy: { createdAt: "desc" },
        include: {
            author: true,
            categories: { include: { category: true } }
        }
    });

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <span className="text-gray-500 font-bold tracking-widest text-sm uppercase mb-3 block">Etiqueta</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                    #{tag.name}
                </h1>
            </header>

            {posts.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg mb-4">No hay entradas publicadas con esta etiqueta.</p>
                    <Link href="/" className="text-blue-600 hover:underline font-medium">&larr; Volver al inicio</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                            {post.featuredImage && (
                                <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden">
                                    <img src={post.featuredImage} alt={post.title} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                                </Link>
                            )}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">
                                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 text-gray-900 transition-colors">
                                        {post.title}
                                    </Link>
                                </h3>

                                <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                                    {post.excerpt || post.seoDescription || "Haz clic para leer el artículo completo..."}
                                </p>

                                <div className="flex items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 mr-auto">
                                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                                        <Link href={`/author/${post.author.id}`} className="font-medium hover:text-blue-600 transition-colors text-gray-700">{post.author.name || "Admin"}</Link>
                                    </div>
                                    <time dateTime={post.createdAt.toISOString()}>{format(post.createdAt, "d MMM yyyy", { locale: es })}</time>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
