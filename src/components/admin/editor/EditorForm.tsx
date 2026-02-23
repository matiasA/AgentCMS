"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { updatePost } from "@/lib/actions/posts";
import { syncTaxonomiesToPost, createCategory, createTag } from "@/lib/actions/taxonomies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PostStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

// Carga asíncrona del componente principal del editor para evitar inconsistencias de Hidratación (Hydration mismatch)
// y errores de Window is not defined (SSR).
const BlockNoteEditor = dynamic(() => import("./BlockNoteEditor"), {
    ssr: false,
    loading: () => <div className="p-8 text-center text-gray-500 min-h-[500px] border border-[#c3c4c7] rounded-sm bg-white">Cargando editor...</div>
});

export default function EditorForm({ post, allCategories, allTags }: { post: any, allCategories: any[], allTags: any[] }) {
    const router = useRouter();
    const [title, setTitle] = useState(post.title || "");
    const [content, setContent] = useState(post.content || "");
    const [isSaving, setIsSaving] = useState(false);

    // Taxonomies state
    const [selectedCats, setSelectedCats] = useState<string[]>(post.categories?.map((c: any) => c.categoryId) || []);
    const [selectedTags, setSelectedTags] = useState<string[]>(post.tags?.map((t: any) => t.tagId) || []);
    const [newCatName, setNewCatName] = useState("");
    const [newTagName, setNewTagName] = useState("");
    const [showNewCatInput, setShowNewCatInput] = useState(false);

    const handleSave = useCallback(async (status: PostStatus = post.status) => {
        setIsSaving(true);
        try {
            await updatePost(post.id, { title, content, status });
            await syncTaxonomiesToPost(post.id, selectedCats, selectedTags);
        } catch (e) {
            console.error("Error al guardar:", e);
        } finally {
            setIsSaving(false);
        }
    }, [post.id, title, content, post.status, selectedCats, selectedTags]);

    // Autoguardado simple cada 5 segundos si ha habido cambios respecto a los props originales
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title !== post.title || content !== post.content) {
                handleSave(post.status);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [title, content, handleSave, post]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            {/* Columna Editor */}
            <div className="flex-1 space-y-4">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Añadir el título"
                    className="text-3xl font-medium h-14 border-[#c3c4c7] rounded-sm bg-white focus-visible:ring-1 focus-visible:ring-[#2271b1]"
                />
                <BlockNoteEditor initialContent={content} onChange={setContent} />
            </div>

            {/* Admin Sidebar WP Style */}
            <div className="w-full lg:w-[300px] flex flex-col gap-4">
                {/* Metabox: Publicar */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                    <h2 className="px-4 py-2.5 font-semibold text-sm border-b border-[#c3c4c7] text-[#1d2327]">Publicar</h2>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSave("DRAFT")}
                                disabled={isSaving}
                                className="h-8 text-[#2271b1] border-[#2271b1] hover:bg-[#2271b1] hover:text-white"
                            >
                                {isSaving ? "Guardando..." : "Sólo guardar"}
                            </Button>
                            <Button variant="outline" size="sm" className="h-8">Vista previa</Button>
                        </div>
                        <div className="text-[13px] text-[#50575e] space-y-2">
                            <p className="flex items-center gap-2">
                                <span>📌</span> Estado: <strong>{post.status === "PUBLISHED" ? "Publicada" : "Borrador"}</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>👁️</span> Visibilidad: <strong>Pública</strong>
                            </p>
                            <p className="flex items-center gap-2">
                                <span>📅</span> Publicar: <strong>Inmediatamente</strong>
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] p-3 flex justify-between items-center">
                        <button className="text-[#d63638] hover:underline text-[13px]">Mover a la papelera</button>
                        <Button
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white h-8"
                            onClick={() => {
                                handleSave("PUBLISHED").then(() => router.push("/wp-admin/posts"));
                            }}
                            disabled={isSaving}
                        >
                            Publicar
                        </Button>
                    </div>
                </div>

                {/* Metabox: Categorías */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                    <h2 className="px-4 py-2.5 font-semibold text-sm border-b border-[#c3c4c7] text-[#1d2327]">Categorías</h2>
                    <div className="p-4 text-[13px] text-[#50575e]">
                        <ul className="max-h-[200px] overflow-y-auto mb-3 space-y-2 border border-[#ddd] p-2 bg-gray-50">
                            {allCategories.length === 0 && <li className="italic text-gray-400">Sin categorías disponibles.</li>}
                            {allCategories.map(cat => (
                                <li key={cat.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`cat-${cat.id}`}
                                        checked={selectedCats.includes(cat.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) setSelectedCats([...selectedCats, cat.id]);
                                            else setSelectedCats(selectedCats.filter(id => id !== cat.id));
                                        }}
                                    />
                                    <label htmlFor={`cat-${cat.id}`} className="leading-none cursor-pointer text-[#1d2327]">
                                        {cat.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        {!showNewCatInput ? (
                            <button onClick={() => setShowNewCatInput(true)} className="text-[#2271b1] hover:underline underline-offset-2">+ Añadir nueva categoría</button>
                        ) : (
                            <div className="space-y-2 mt-2">
                                <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="h-8 text-[13px]" placeholder="Nombre de categoría" />
                                <Button size="sm" variant="outline" className="h-8" onClick={async () => {
                                    if (newCatName.trim() !== "") {
                                        await createCategory(newCatName);
                                        setNewCatName("");
                                    }
                                }}>Añadir</Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metabox: Etiquetas */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                    <h2 className="px-4 py-2.5 font-semibold text-sm border-b border-[#c3c4c7] text-[#1d2327]">Etiquetas</h2>
                    <div className="p-4 flex flex-col gap-3 text-[13px]">
                        <div className="flex gap-2">
                            <Input value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="Añadir nueva etiqueta" className="h-8 text-[13px]" />
                            <Button variant="outline" className="h-8" onClick={async () => {
                                if (newTagName.trim() !== "") {
                                    const newTag = await createTag(newTagName);
                                    if (newTag && !selectedTags.includes(newTag.id)) {
                                        setSelectedTags([...selectedTags, newTag.id]);
                                    }
                                    setNewTagName("");
                                }
                            }}>Añadir</Button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            <span className="text-[#50575e] block w-full mb-1 italic">Etiquetas seleccionadas:</span>
                            {selectedTags.length === 0 && <span className="text-gray-400">No hay etiquetas.</span>}
                            {selectedTags.map(tagId => {
                                const tagObj = allTags.find(t => t.id === tagId);
                                return tagObj ? (
                                    <span key={tagId} className="bg-[#f0f0f1] px-2 py-1 rounded-sm text-xs flex items-center gap-1">
                                        {tagObj.name}
                                        <button onClick={() => setSelectedTags(selectedTags.filter(id => id !== tagId))} className="text-gray-500 hover:text-red-500 font-bold ml-1">×</button>
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
