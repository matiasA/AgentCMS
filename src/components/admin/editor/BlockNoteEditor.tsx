"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { uploadFiles } from "@/lib/uploadthing";
import { useEffect, useState } from "react";

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

    return (
        <div className="border border-[#c3c4c7] rounded-sm bg-white min-h-[500px] overflow-hidden">
            <BlockNoteView
                editor={editor}
                onChange={() => {
                    // Extraemos los bloques en formato JSON y los enviamos al padre
                    onChange(JSON.stringify(editor.document));
                }}
                theme="light"
            />
        </div>
    );
}
