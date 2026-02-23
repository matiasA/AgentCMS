import prisma from "@/lib/prisma";
import MenusEditorForm from "./MenuEditorForm";

export const dynamic = "force-dynamic";

export default async function MenusPage() {
    const menus = await prisma.menu.findMany({
        include: {
            items: { orderBy: { order: "asc" } }
        },
        orderBy: { name: "asc" }
    });

    const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-normal text-[#1d2327]">Menús</h1>
            </div>

            <MenusEditorForm allMenus={menus} pages={pages} categories={categories} />
        </div>
    );
}
