"use client";

import { useState, useTransition } from "react";
import { syncMenuItems, deleteMenu, createMenu } from "@/lib/actions/menus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, MenuItem, Page, Category } from "@prisma/client";

type PopulatedMenu = Menu & { items: MenuItem[] };

export default function MenusEditorForm({ allMenus, pages, categories }: { allMenus: PopulatedMenu[], pages: Page[], categories: Category[] }) {
    const [isPending, startTransition] = useTransition();

    // Si no hay menús, mostraremos el creador. Si hay, seleccionamos el primero por defecto.
    const [selectedMenuId, setSelectedMenuId] = useState<string>(allMenus[0]?.id || "new");
    const [newMenuName, setNewMenuName] = useState("");

    // Obtenemos el menú activo
    const activeMenu = allMenus.find(m => m.id === selectedMenuId);

    // Estado local para los items del menú activo y ubicación
    const [menuItems, setMenuItems] = useState<Partial<MenuItem>[]>(
        activeMenu ? activeMenu.items.sort((a, b) => a.order - b.order) : []
    );
    const [location, setLocation] = useState<string>(activeMenu?.location || "");

    // Estados para el acordeón izquierdo
    const [customLinkUrl, setCustomLinkUrl] = useState("http://");
    const [customLinkLabel, setCustomLinkLabel] = useState("");

    // Detectar cuando cambiamos de menú en el select superior para refrescar `menuItems`
    const handleMenuSelection = (id: string) => {
        setSelectedMenuId(id);
        if (id !== "new") {
            const menu = allMenus.find(m => m.id === id);
            if (menu) {
                setMenuItems(menu.items.sort((a, b) => a.order - b.order));
                setLocation(menu.location || "");
            }
        } else {
            setMenuItems([]);
            setLocation("");
        }
    };

    const handleCreateMenu = () => {
        if (!newMenuName.trim()) return;
        startTransition(async () => {
            const created = await createMenu(newMenuName);
            setNewMenuName("");
            handleMenuSelection(created.id);
        });
    };

    const handleDeleteMenu = () => {
        if (confirm("¿Seguro que quieres borrar este menú?")) {
            startTransition(async () => {
                await deleteMenu(selectedMenuId);
                const firstRemaining = allMenus.find(m => m.id !== selectedMenuId);
                handleMenuSelection(firstRemaining?.id || "new");
            });
        }
    };

    const handleSaveMenu = () => {
        startTransition(async () => {
            await syncMenuItems(
                selectedMenuId,
                location === "" ? null : location,
                menuItems.map(i => ({
                    label: i.label!, url: i.url || "", type: i.type!, refId: i.refId || null
                }))
            );
        });
    };

    const addCustomLink = () => {
        if (!customLinkLabel.trim()) return;
        setMenuItems([...menuItems, { label: customLinkLabel, url: customLinkUrl, type: "custom", refId: null }]);
        setCustomLinkLabel("");
        setCustomLinkUrl("http://");
    };

    return (
        <div>
            {/* Top Selector bar */}
            {allMenus.length > 0 && (
                <div className="bg-white border border-[#c3c4c7] p-3 shadow-sm mb-4 flex items-center gap-2 text-sm text-[#2c3338]">
                    <label>Elige el menú que quieras editar:</label>
                    <select
                        className="border border-[#8c8f94] rounded-sm p-1.5 focus:ring-1 focus:ring-[#2271b1] outline-none"
                        value={selectedMenuId}
                        onChange={e => handleMenuSelection(e.target.value)}
                    >
                        {allMenus.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                    <span className="text-[#c3c4c7] mx-2">o</span>
                    <button onClick={() => handleMenuSelection("new")} className="text-[#2271b1] hover:underline">
                        crear un nuevo menú
                    </button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column: Add items */}
                <div className={`w-full lg:w-[300px] flex flex-col gap-4 ${selectedMenuId === "new" ? "opacity-50 pointer-events-none" : ""}`}>

                    {/* Add Custom Links */}
                    <div className="bg-white border border-[#c3c4c7] shadow-sm">
                        <h2 className="px-4 py-2.5 font-semibold text-sm border-b border-[#c3c4c7] text-[#1d2327]">Enlaces personalizados</h2>
                        <div className="p-4 space-y-4 text-[13px] text-[#2c3338]">
                            <div>
                                <label className="block text-gray-500 mb-1">URL</label>
                                <Input value={customLinkUrl} onChange={e => setCustomLinkUrl(e.target.value)} className="h-8 border-[#c3c4c7] rounded-sm" />
                            </div>
                            <div>
                                <label className="block text-gray-500 mb-1">Texto del enlace</label>
                                <Input value={customLinkLabel} onChange={e => setCustomLinkLabel(e.target.value)} className="h-8 border-[#c3c4c7] rounded-sm" />
                            </div>
                            <div className="flex justify-end">
                                <Button variant="outline" size="sm" onClick={addCustomLink} className="border-[#2271b1] text-[#2271b1] hover:bg-[#f6f7f7]">
                                    Añadir al menú
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Pseudo add pages */}
                    <div className="bg-white border border-[#c3c4c7] shadow-sm">
                        <h2 className="px-4 py-2.5 font-semibold text-sm border-b border-[#c3c4c7] text-[#1d2327]">Páginas</h2>
                        <div className="max-h-[200px] overflow-y-auto p-2 border-b border-[#c3c4c7]">
                            <ul className="space-y-1 text-[13px]">
                                {pages.map(p => (
                                    <li key={p.id} className="flex hidden items-center gap-2 p-1 hover:bg-gray-50">
                                        <input type="checkbox" id={`page-${p.id}`} />
                                        <label htmlFor={`page-${p.id}`} className="truncate">{p.title || "(Sin título)"}</label>
                                        <button className="ml-auto text-xs border p-1" onClick={() => {
                                            setMenuItems([...menuItems, { label: p.title || "Página", url: `/${p.slug}`, type: "page", refId: p.id }]);
                                        }}>Añadir</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Column: Menu Structure */}
                <div className="flex-1 bg-white border border-[#c3c4c7] shadow-sm">
                    {selectedMenuId === "new" ? (
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <label className="font-semibold text-sm text-[#2c3338]">Nombre del menú</label>
                                <Input value={newMenuName} onChange={e => setNewMenuName(e.target.value)} className="h-8 max-w-sm rounded-sm" />
                            </div>
                            <div className="flex items-center justify-end border-t border-[#f0f0f1] pt-4">
                                <Button onClick={handleCreateMenu} disabled={isPending || !newMenuName.trim()} className="bg-[#2271b1] hover:bg-[#135e96] text-white">
                                    {isPending ? "Creando..." : "Crear menú"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="p-4 border-b border-[#f0f0f1] flex justify-between items-center bg-[#f6f7f7]">
                                <h2 className="font-semibold text-[15px] text-[#1d2327]">Estructura del menú</h2>
                                <Button onClick={handleSaveMenu} disabled={isPending} className="bg-[#2271b1] hover:bg-[#135e96] text-white h-8 text-[13px]">
                                    {isPending ? "Guardando..." : "Guardar menú"}
                                </Button>
                            </div>

                            <div className="p-4 bg-[#f0f0f1] min-h-[300px]">
                                <p className="text-gray-500 text-[13px] mb-4">Añade elementos del menú desde la columna de la izquierda.</p>

                                <div className="space-y-2 max-w-xl">
                                    {menuItems.map((item, index) => (
                                        <div key={index} className="bg-white border border-[#c3c4c7] flex justify-between items-center p-3 shadow-sm rounded-sm">
                                            <span className="font-semibold text-[#2c3338] text-[13px]">{item.label}</span>
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-400 text-xs uppercase">{item.type}</span>
                                                <button onClick={() => {
                                                    const newArr = [...menuItems];
                                                    newArr.splice(index, 1);
                                                    setMenuItems(newArr);
                                                }} className="text-[#d63638] text-xs hover:underline">Borrar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-t border-[#f0f0f1] flex flex-col gap-2 bg-white">
                                <h3 className="font-semibold text-[13px] text-[#2c3338]">Ajustes del menú</h3>
                                <div className="flex gap-4 items-center text-[13px] text-[#50575e]">
                                    <label>Dónde se verá</label>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="loc-primary" checked={location === "primary"} onChange={e => setLocation(e.target.checked ? "primary" : "")} />
                                        <label htmlFor="loc-primary">Menú principal</label>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-[#f0f0f1] flex justify-between items-center bg-[#f6f7f7]">
                                <button onClick={handleDeleteMenu} disabled={isPending} className="text-[#d63638] text-[13px] hover:underline">Borrar menú</button>
                                <Button onClick={handleSaveMenu} disabled={isPending} className="bg-[#2271b1] hover:bg-[#135e96] text-white h-8 text-[13px]">
                                    Guardar menú
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
