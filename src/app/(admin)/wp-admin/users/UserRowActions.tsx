"use client";

import { useTransition } from "react";
import { updateUserRole, deleteUser } from "@/lib/actions/users";
import { UserRole } from "@prisma/client";

export default function UserRowActions({ userId, currentRole }: { userId: string, currentRole: UserRole }) {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = (role: UserRole) => {
        startTransition(async () => {
            await updateUserRole(userId, role);
        });
    };

    const handleDelete = () => {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            startTransition(async () => {
                await deleteUser(userId);
            });
        }
    };

    return (
        <div className="invisible group-hover:visible flex flex-wrap gap-2 text-[13px] mt-1 text-[#2271b1]">
            <button className="hover:underline">Editar</button>
            <span className="text-[#c3c4c7] opacity-50">|</span>
            <select
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                disabled={isPending}
                className="text-[11px] p-0 h-auto cursor-pointer border-none bg-transparent hover:underline text-[#2271b1] focus:ring-0 outline-none"
            >
                <option value="ADMIN">Hacer Admin</option>
                <option value="EDITOR">Hacer Editor</option>
                <option value="AUTHOR">Hacer Autor</option>
                <option value="CONTRIBUTOR">Hacer Colaborador</option>
                <option value="SUBSCRIBER">Hacer Suscriptor</option>
            </select>
            <span className="text-[#c3c4c7] opacity-50">|</span>
            <button disabled={isPending} onClick={handleDelete} className="hover:underline text-[#d63638]">Eliminar</button>
        </div>
    );
}
