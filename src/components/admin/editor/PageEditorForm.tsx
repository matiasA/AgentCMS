"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { updatePage } from "@/lib/actions/pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostStatus, Page } from "@prisma/client";
import { useRouter } from "next/navigation";

const BlockNoteEditor = dynamic(() => import("./BlockNoteEditor"), {
    ssr: false,
    loading: () => <div className="p-8 text-center text-gray-500 min-h-[500px] border border-[#c3c4c7] rounded-sm bg-white">Cargando editor...</div>
});

export default function PageEditorForm({ pageObj, allPages }: { pageObj: Page, allPages: Page[] }) {
    const router = useRouter();
    const [title, setTitle] = useState(pageObj.title || "");
    const [content, setContent] = useState<string>(
        typeof pageObj.content === 'string' ? pageObj.content : JSON.stringify(pageObj.content) || ""
    );
    const [parentId, setParentId] = useState<string>(pageObj.parentId || "none");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = useCallback(async (status: PostStatus = pageObj.status) => {
        setIsSaving(true);
        try {
            await updatePage(pageObj.id, { title, content, status, parentId });
        } catch (e) {
            console.error("Error al guardar:", e);
        } finally {
            setIsSaving(false);
        }
    }, [pageObj.id, title, content, pageObj.status, parentId]);

    // Autoguardado simple
    useEffect(() => {
        const timer = setTimeout(() => {
            const contentStr = typeof pageObj.content === 'string' ? pageObj.content : JSON.stringify(pageObj.content) || "";
            if (title !== pageObj.title || content !== contentStr || parentId !== (pageObj.parentId || "none")) {
                handleSave(pageObj.status);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [title, content, handleSave, pageObj, parentId]);

    return (
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
            <div className="flex-1 space-y-4">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Añadir el título"
                    className="text-3xl font-medium h-14 border-[#c3c4c7] rounded-sm bg-white focus-visible:ring-1 focus-visible:ring-[#2271b1]"
                />
                <BlockNoteEditor initialContent={content} onChange={setContent} />
            </div>

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
                                <span>📌</span> Estado: <strong>{pageObj.status === "PUBLISHED" ? "Publicada" : "Borrador"}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#f6f7f7] border-t border-[#c3c4c7] p-3 flex justify-between items-center">
                        <button className="text-[#d63638] hover:underline text-[13px]">Mover a la papelera</button>
                        <Button
                            className="bg-[#2271b1] hover:bg-[#135e96] text-white h-8"
                            onClick={() => {
                                handleSave("PUBLISHED").then(() => router.push("/wp-admin/pages"));
                            }}
                            disabled={isSaving}
                        >
                            Publicar
                        </Button>
                    </div>
                </div>

                {/* Metabox: Atributos de página */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                    <h2 className="px-4 py-2.5 font-semibold text-sm border-b border-[#c3c4c7] text-[#1d2327]">Atributos de página</h2>
                    <div className="p-4 space-y-4 text-[13px] text-[#2c3338]">
                        <div>
                            <label className="block mb-1 font-semibold">Superior</label>
                            <select
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                className="w-full border border-[#c3c4c7] rounded-sm p-1.5 focus:ring-1 focus:ring-[#2271b1] focus:border-[#2271b1] outline-none"
                            >
                                <option value="none">(Sin superior)</option>
                                {allPages.filter(p => p.id !== pageObj.id).map(p => (
                                    <option key={p.id} value={p.id}>{p.title || "(Sin título)"}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Plantilla</label>
                            <select className="w-full border border-[#c3c4c7] rounded-sm p-1.5 focus:ring-1 focus:ring-[#2271b1] focus:border-[#2271b1] outline-none">
                                <option value="default">Plantilla por defecto</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
