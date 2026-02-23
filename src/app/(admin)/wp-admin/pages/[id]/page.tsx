import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageEditorForm from "@/components/admin/editor/PageEditorForm";

export const dynamic = "force-dynamic";

export default async function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Solo cargamos el post y las páginas posibles padre
    const [pageObj, allPages] = await Promise.all([
        prisma.page.findUnique({
            where: { id },
        }),
        prisma.page.findMany({
            select: { id: true, title: true },
            orderBy: { title: "asc" }
        })
    ]);

    if (!pageObj) {
        notFound();
    }

    // Convert potential Prisma Json values to something compatible with our component interfaces
    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-normal text-[#1d2327]">Editar página</h1>
            </div>
            {/* We cast to any for simplicity with Prisma's Json type and React component props */}
            <PageEditorForm pageObj={pageObj as any} allPages={allPages as any} />
        </div>
    );
}
