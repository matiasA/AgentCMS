"use client";

import dynamic from "next/dynamic";

const PublicBlockNoteViewer = dynamic(() => import("./PublicBlockNoteViewer"), {
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-100 rounded-md h-[400px] w-full"></div>
});

export default function DynamicViewer({ content }: { content: string }) {
    return <PublicBlockNoteViewer content={content} />;
}
