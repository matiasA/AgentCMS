import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditorForm from "@/components/admin/editor/EditorForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [post, allCategories, allTags] = await Promise.all([
        prisma.post.findUnique({
            where: { id },
            include: {
                categories: { include: { category: true } },
                tags: { include: { tag: true } }
            },
        }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.tag.findMany({ orderBy: { name: "asc" } })
    ]);

    if (!post) {
        notFound();
    }

    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-normal text-[#1d2327]">Editar la entrada</h1>
            </div>
            <EditorForm post={post} allCategories={allCategories} allTags={allTags} />
        </div>
    );
}
