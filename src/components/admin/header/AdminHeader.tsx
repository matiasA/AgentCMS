import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function AdminHeader() {
    return (
        <header className="sticky top-0 z-40 flex h-8 shrink-0 items-center justify-between bg-[#1d2327] px-4 shadow-sm sm:px-6 lg:px-8 text-white">
            <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
                <div className="flex items-center gap-4 text-xs font-medium">
                    <Link href="/" className="hover:text-[#72aee6] flex items-center gap-2">
                        <span className="text-xl leading-none -mt-1">⌂</span> Mi CMS
                    </Link>
                    <Link href="/wp-admin/comments" className="hover:text-[#72aee6] flex items-center gap-1">
                        <span className="text-sm">💬</span> 0
                    </Link>
                    <div className="relative group cursor-pointer hover:text-[#72aee6] flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Añadir
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-x-6 text-xs mx-auto mr-10 hidden md:flex">
                <div className="bg-[#2c3338] rounded-md px-3 py-1 text-gray-400 flex items-center gap-3 border border-transparent hover:border-gray-500 cursor-text">
                    <span>Buscar (Cmd+K)</span>
                    <span className="text-[10px] font-mono border border-gray-500 rounded px-1 opacity-70">⌘K</span>
                </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
                <div className="flex items-center gap-x-4 text-xs">
                    <span className="hidden lg:flex text-[#c3c4c7] hover:text-[#72aee6] cursor-pointer">Hola, Admin</span>
                    <Avatar className="h-6 w-6">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
