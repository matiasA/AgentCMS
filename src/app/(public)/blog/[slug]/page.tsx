import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import dynamic from "next/dynamic";
import PublicCommentSection from "@/components/public/PublicCommentSection";

const PublicBlockNoteViewer = dynamic(() => import("@/components/public/PublicBlockNoteViewer"), {
    ssr: false,
    loading: () => <div className="text-gray-500 py-10 animate-pulse bg-gray-100 rounded-md h-96 w-full"></div>
});

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;
    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) {
        return {
            title: "Entrada no encontrada",
        };
    }

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt || "",
            images: post.featuredImage ? [post.featuredImage] : undefined,
            type: "article",
            publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString()
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    const post = await prisma.post.findUnique({
        where: { slug },
        include: {
            author: true,
            categories: { include: { category: true } },
            tags: { include: { tag: true } },
            comments: {
                where: { status: "APPROVED" },
                orderBy: { createdAt: "asc" },
                include: { author: true }
            }
        }
    });

    if (!post || post.status !== "PUBLISHED") {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-16">
            {post.featuredImage && (
                <div className="w-full aspect-[21/9] relative">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="p-8 md:p-12">
                <header className="mb-10 text-center">
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {post.categories.map(c => (
                            <Link key={c.categoryId} href={`/category/${c.category.slug}`} className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                                {c.category.name}
                            </Link>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 shadow-inner"></div>
                            <span className="font-medium text-gray-700">{post.author.name || "Admin"}</span>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <time dateTime={post.createdAt.toISOString()}>
                            {format(post.createdAt, "d 'de' MMMM, yyyy", { locale: es })}
                        </time>
                    </div>
                </header>

                <div className="prose prose-lg max-w-none prose-blue">
                    <PublicBlockNoteViewer content={post.content as string} />
                </div>

                {post.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                        <span className="text-sm font-semibold text-gray-500 mr-2 uppercase tracking-wide py-1">Etiquetas:</span>
                        {post.tags.map(t => (
                            <Link key={t.tagId} href={`/tag/${t.tag.slug}`} className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors">
                                #{t.tag.name}
                            </Link>
                        ))}
                    </div>
                )}

                <PublicCommentSection postId={post.id} comments={post.comments} />
            </div>
        </article>
    );
}
