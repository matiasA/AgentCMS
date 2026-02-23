"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { uploadFiles } from "@/lib/uploadthing";
import { useEffect, useState } from "react";
import { rewriteText } from "@/lib/actions/ai";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface EditorProps {
    initialContent?: string;
    onChange: (content: string) => void;
}

export default function BlockNoteEditor({ initialContent, onChange }: EditorProps) {
    let parsedContent = undefined;
    if (initialContent) {
        try {
            const parsed = JSON.parse(initialContent);
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsedContent = parsed;
            }
        } catch (e) {
            console.error("Error parsing BlockNote content", e);
        }
    }

    const editor = useCreateBlockNote({
        initialContent: parsedContent,
    });

    const [isRewriting, setIsRewriting] = useState(false);

    const handleRewrite = async (style: "professional" | "casual" | "expand" | "shorten") => {
        setIsRewriting(true);
        try {
            // Unir todo el texto plano
            let fullText = "";
            for (const block of editor.document) {
                if (Array.isArray(block.content)) {
                    fullText += block.content.map((c: any) => c.text).join("") + "\n";
                }
            }

            if (!fullText.trim()) {
                toast.error("El editor está vacío.");
                setIsRewriting(false);
                return;
            }

            const newText = await rewriteText(fullText, style);
            // Reemplazar todo el documento actual por el nuevo texto de la IA (un solo bloque para mantener simpleza)
            editor.replaceBlocks(editor.document, [
                { type: "paragraph", content: newText }
            ]);
            onChange(JSON.stringify(editor.document));
            toast.success("Texto reescrito con éxito.");
        } catch (e: any) {
            toast.error(e.message || "Error al reescribir con IA.");
        } finally {
            setIsRewriting(false);
        }
    };

    return (
        <div className="border border-[#c3c4c7] rounded-sm bg-white overflow-hidden flex flex-col">
            <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] p-2 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-semibold text-[#50575e] uppercase tracking-wider mr-2">Asistente IA ✨</span>
                <Button size="sm" variant="outline" disabled={isRewriting} onClick={() => handleRewrite("professional")} className="h-7 text-xs border-[#2271b1] text-[#2271b1]">Profesional</Button>
                <Button size="sm" variant="outline" disabled={isRewriting} onClick={() => handleRewrite("casual")} className="h-7 text-xs border-[#2271b1] text-[#2271b1]">Casual</Button>
                <Button size="sm" variant="outline" disabled={isRewriting} onClick={() => handleRewrite("expand")} className="h-7 text-xs border-[#2271b1] text-[#2271b1]">Expandir</Button>
                <Button size="sm" variant="outline" disabled={isRewriting} onClick={() => handleRewrite("shorten")} className="h-7 text-xs border-[#2271b1] text-[#2271b1]">Acortar</Button>
            </div>
            <div className="min-h-[500px] flex-1">
                <BlockNoteView
                    editor={editor}
                    onChange={() => {
                        onChange(JSON.stringify(editor.document));
                    }}
                    theme="light"
                />
            </div>
        </div>
    );
}
