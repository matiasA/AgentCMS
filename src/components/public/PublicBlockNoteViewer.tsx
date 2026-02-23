"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "./public-viewer.css"; // We will create this for hiding toolbars and adjusting padding

interface ViewerProps {
    content: string;
}

export default function PublicBlockNoteViewer({ content }: ViewerProps) {
    let parsedContent = undefined;
    if (content) {
        try {
            const parsed = JSON.parse(content);
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
        <div className="public-content-viewer -mx-10 md:mx-0">
            <BlockNoteView
                editor={editor}
                editable={false}
                theme="light"
            />
        </div>
    );
}
