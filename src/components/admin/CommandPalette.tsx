"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import "./command-palette.css"; // Basic custom CSS

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle the menu when ⌘K or Ctrl+K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSelect = (url: string) => {
        setOpen(false);
        router.push(url);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[15vh]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden command-dialog pb-2">
                <Command>
                    <div className="border-b px-4 py-3 flex items-center">
                        <span className="text-gray-500 mr-2">🔍</span>
                        <Command.Input
                            autoFocus
                            placeholder="Buscar páginas, acciones..."
                            className="flex-1 outline-none font-medium h-6 text-gray-900 placeholder:text-gray-400"
                        />
                        <button onClick={() => setOpen(false)} className="text-xs text-gray-400 font-bold px-1.5 py-0.5 rounded border border-gray-200">ESC</button>
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto p-2">
                        <Command.Empty className="py-6 text-center text-sm text-gray-500">No se encontraron resultados.</Command.Empty>

                        <Command.Group heading="Escritorio" className="command-group">
                            <Command.Item onSelect={() => handleSelect("/wp-admin")} className="command-item">Inicio del Panel</Command.Item>
                            <Command.Item onSelect={() => handleSelect("/")} className="command-item">Ver Sitio Público</Command.Item>
                        </Command.Group>

                        <Command.Group heading="Contenido" className="command-group">
                            <Command.Item onSelect={() => handleSelect("/wp-admin/posts/new")} className="command-item">📝 Crear Entrada</Command.Item>
                            <Command.Item onSelect={() => handleSelect("/wp-admin/posts")} className="command-item">Todas las Entradas</Command.Item>
                            <Command.Item onSelect={() => handleSelect("/wp-admin/pages/new")} className="command-item">📄 Crear Página</Command.Item>
                            <Command.Item onSelect={() => handleSelect("/wp-admin/pages")} className="command-item">Todas las Páginas</Command.Item>
                        </Command.Group>

                        <Command.Group heading="Medios y Redes" className="command-group">
                            <Command.Item onSelect={() => handleSelect("/wp-admin/media")} className="command-item">🖼️ Biblioteca de Medios</Command.Item>
                            <Command.Item onSelect={() => handleSelect("/wp-admin/comments")} className="command-item">💬 Comentarios</Command.Item>
                        </Command.Group>

                        <Command.Group heading="Configuración" className="command-group">
                            <Command.Item onSelect={() => handleSelect("/wp-admin/settings/general")} className="command-item">⚙️ Ajustes Generales</Command.Item>
                            <Command.Item onSelect={() => handleSelect("/wp-admin/menus")} className="command-item">Menús de Navegación</Command.Item>
                            <Command.Item onSelect={() => handleSelect("/wp-admin/users")} className="command-item">👥 Usuarios</Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}
