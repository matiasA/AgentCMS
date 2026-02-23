"use client";

import { useTransition } from "react";
import { setCommentStatus, deleteComment, analyzeCommentAI } from "@/lib/actions/comments";
import { CommentStatus } from "@prisma/client";
import { toast } from "sonner";

export default function CommentRowActions({ commentId, currentStatus, content }: { commentId: string, currentStatus: CommentStatus, content: string }) {
    const [isPending, startTransition] = useTransition();

    const handleAction = (status: "APPROVED" | "PENDING" | "SPAM" | "TRASH" | "DELETE") => {
        startTransition(async () => {
            if (status === "DELETE") {
                await deleteComment(commentId);
            } else {
                await setCommentStatus(commentId, status);
            }
        });
    };

    const handleAIAssess = () => {
        startTransition(async () => {
            try {
                const scores = await analyzeCommentAI(commentId, content);
                if (scores.spamScore > 0.8 || scores.toxicScore > 0.8) {
                    toast.error(`Comentario marcado como SPAM. (Spam: ${scores.spamScore}, Tóxico: ${scores.toxicScore})`);
                } else {
                    toast.success(`Comentario parece legítimo. (Spam: ${scores.spamScore}, Tóxico: ${scores.toxicScore})`);
                }
            } catch (e) {
                toast.error("Error analizandolo con IA");
            }
        });
    };

    return (
        <div className="invisible group-hover:visible flex flex-wrap gap-2 text-[13px] mt-1 text-[#2271b1]">
            {currentStatus !== "APPROVED" && (
                <button disabled={isPending} onClick={() => handleAction("APPROVED")} className="hover:underline text-[#007017]">Aprobar</button>
            )}
            {currentStatus === "APPROVED" && (
                <button disabled={isPending} onClick={() => handleAction("PENDING")} className="hover:underline text-[#d63638]">Rechazar</button>
            )}
            <span className="text-[#c3c4c7] opacity-50">|</span>
            <button className="hover:underline">Responder</button>
            <span className="text-[#c3c4c7] opacity-50">|</span>
            <button className="hover:underline">Edición rápida</button>
            <span className="text-[#c3c4c7] opacity-50">|</span>
            <button disabled={isPending} onClick={handleAIAssess} className="hover:underline text-[#8a24e2]">✨ IA Spam Check</button>
            <span className="text-[#c3c4c7] opacity-50">|</span>
            {currentStatus !== "SPAM" && (
                <>
                    <button disabled={isPending} onClick={() => handleAction("SPAM")} className="hover:underline text-[#d63638]">Spam</button>
                    <span className="text-[#c3c4c7] opacity-50">|</span>
                </>
            )}
            {currentStatus !== "TRASH" ? (
                <button disabled={isPending} onClick={() => handleAction("TRASH")} className="hover:underline text-[#d63638]">Papelera</button>
            ) : (
                <button disabled={isPending} onClick={() => handleAction("DELETE")} className="hover:underline text-[#d63638]">Borrar permanentemente</button>
            )}
        </div>
    );
}
