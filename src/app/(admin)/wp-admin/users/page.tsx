import prisma from "@/lib/prisma";
import Link from "next/link";
import UserRowActions from "./UserRowActions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { posts: true }
            }
        }
    });

    const roleNames: Record<string, string> = {
        "ADMIN": "Administrador",
        "EDITOR": "Editor",
        "AUTHOR": "Autor",
        "CONTRIBUTOR": "Colaborador",
        "SUBSCRIBER": "Suscriptor"
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-normal text-[#1d2327]">Usuarios</h1>
                <button className="border border-[#2271b1] text-[#2271b1] hover:bg-[#135e96] hover:text-white transition-colors h-7 px-3 text-sm rounded-sm">
                    Añadir nuevo
                </button>
            </div>

            <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm">
                <table className="w-full text-left text-sm text-[#50575e]">
                    <thead className="border-b border-[#c3c4c7] font-semibold text-[#2c3338]">
                        <tr>
                            <th className="px-4 py-2 font-medium">Nombre de usuario</th>
                            <th className="px-4 py-2 font-medium">Nombre</th>
                            <th className="px-4 py-2 font-medium">Correo electrónico</th>
                            <th className="px-4 py-2 font-medium">Perfil</th>
                            <th className="px-4 py-2 font-medium text-center">Entradas</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0f1]">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No se encontraron usuarios.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-[#f6f7f7] group">
                                    <td className="px-4 py-3 align-top">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>
                                            <div>
                                                <strong className="text-[#2271b1] block hover:underline cursor-pointer">{user.name || "Usuario"}</strong>
                                                <UserRowActions userId={user.id} currentRole={user.role} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 align-top">{user.name || "—"}</td>
                                    <td className="px-4 py-3 align-top text-[#2271b1] hover:underline cursor-pointer">
                                        <Link href={`mailto:${user.email}`}>{user.email}</Link>
                                    </td>
                                    <td className="px-4 py-3 align-top">{roleNames[user.role] || user.role}</td>
                                    <td className="px-4 py-3 align-top text-center">
                                        <span className="text-[#2271b1] font-bold hover:underline cursor-pointer">{user._count.posts}</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
