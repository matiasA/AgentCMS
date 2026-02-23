"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateSettings(settingsData: { key: string; value: string }[]) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });

    // Requerimos que solo los ADMIN puedan cambiar ajustes globales
    if (!dbUser || dbUser.role !== "ADMIN") {
        throw new Error("No tienes permisos suficientes para modificar los ajustes. Se requiere rol de Administrador.");
    }

    /* Como prisma upsert() puede ser costoso llamarlo en bucle sin bulk, 
     * lo hacemos en una transacción. Prisma aún no soporta upsertMany,
     * pero podemos hacer map de promises. */
    await prisma.$transaction(
        settingsData.map((setting) =>
            prisma.setting.upsert({
                where: { key: setting.key },
                update: { value: setting.value },
                create: { key: setting.key, value: setting.value }
            })
        )
    );

    revalidatePath("/wp-admin/settings/general");
}
