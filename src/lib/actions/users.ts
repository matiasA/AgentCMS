"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

export async function updateUserRole(id: string, role: UserRole) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    await prisma.user.update({
        where: { id },
        data: { role }
    });

    revalidatePath("/wp-admin/users");
}

export async function deleteUser(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    // Check if user is deleting themselves
    if (session.user.id === id) throw new Error("No puedes eliminarte a ti mismo");

    await prisma.user.delete({ where: { id } });
    revalidatePath("/wp-admin/users");
}
