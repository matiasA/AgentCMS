import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    const author = await prisma.user.findUnique({
        where: { id }
    });

    if (!author) notFound();

    const posts = await prisma.post.findMany({
        where: {
            status: "PUBLISHED",
            authorId: author.id
        },
        orderBy: { createdAt: "desc" },
        include: {
            categories: { include: { category: true } }
        }
    });

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <header className="mb-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                    {author.name ? author.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="text-center md:text-left">
                    <span className="text-gray-500 font-bold tracking-widest text-sm uppercase mb-1 block">Autor</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
                        {author.name || "Usuario"}
                    </h1>
                    {author.bio && (
                        <p className="text-gray-600 max-w-2xl">{author.bio}</p>
                    )}
                </div>
            </header>

            <h2 className="text-2xl font-bold tracking-tight mb-8">Entradas de este autor</h2>

            {posts.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg mb-4">Este autor no tiene entradas publicadas aún.</p>
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
