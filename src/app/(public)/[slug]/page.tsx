import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const PublicBlockNoteViewer = dynamic(() => import("@/components/public/PublicBlockNoteViewer"), {
    ssr: false,
    loading: () => <div className="text-gray-500 py-10 animate-pulse bg-gray-100 rounded-md h-[600px] w-full"></div>
});

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;
    const page = await prisma.page.findUnique({ where: { slug } });

    if (!page) {
        return {
            title: "Página no encontrada",
        };
    }

    return {
        title: page.seoTitle || page.title,
        description: page.seoDescription,
        openGraph: {
            title: page.seoTitle || page.title,
            description: page.seoDescription || "",
            images: page.featuredImage ? [page.featuredImage] : undefined,
            type: "website",
        }
    };
}

export default async function DynamicPageContent({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    const page = await prisma.page.findUnique({
        where: { slug }
    });

    if (!page || page.status !== "PUBLISHED") {
        notFound();
    }

    return (
        <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-14 mt-6 mb-16">
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    {page.title}
                </h1>
            </header>

            <div className="prose prose-lg max-w-none prose-blue">
                <PublicBlockNoteViewer content={page.content as string} />
            </div>
        </article>
    );
}
