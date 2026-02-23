"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMenu(name: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    const newMenu = await prisma.menu.create({ data: { name } });
    revalidatePath("/wp-admin/menus");
    return newMenu;
}

export async function deleteMenu(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    await prisma.menu.delete({ where: { id } });
    revalidatePath("/wp-admin/menus");
}

export async function syncMenuItems(menuId: string, location: string | null, items: { label: string, url: string, type: string, refId: string | null }[]) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    await prisma.$transaction([
        prisma.menu.update({ where: { id: menuId }, data: { location } }),
        prisma.menuItem.deleteMany({ where: { menuId } }),
        prisma.menuItem.createMany({
            data: items.map((item, index) => ({
                menuId,
                label: item.label,
                url: item.url,
                type: item.type,
                refId: item.refId,
                order: index
            }))
        })
    ]);

    revalidatePath("/wp-admin/menus");
}
