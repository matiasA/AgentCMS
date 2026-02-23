"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { submitPublicComment } from "@/lib/actions/comments";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PublicCommentSectionProps {
    postId: string;
    comments: Array<{
        id: string;
        guestName: string | null;
        content: string;
        createdAt: Date;
        author?: { name: string | null } | null;
    }>;
}

export default function PublicCommentSection({ postId, comments }: PublicCommentSectionProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await submitPublicComment(postId, { name, email, content });
            if (res.status === "SPAM") {
                toast.error("Tu comentario ha sido marcado como inapropiado por nuestro filtro automático.");
            } else {
                toast.success("¡Comentario enviado! Está pendiente de moderación.");
            }
            setName("");
            setEmail("");
            setContent("");
        } catch (e) {
            toast.error("Hubo un error al enviar tu comentario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 pt-12 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
                {comments.length} Comentario{comments.length !== 1 ? 's' : ''}
            </h3>

            <div className="space-y-8 mb-16">
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 font-bold">
                                {(comment.author?.name || comment.guestName || "A").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <strong className="text-gray-900">{comment.author?.name || comment.guestName || "Anónimo"}</strong>
                                    <span className="text-sm text-gray-500">{format(new Date(comment.createdAt), "d MMM yyyy 'a las' HH:mm", { locale: es })}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                <h4 className="text-xl font-bold text-gray-900 mb-6">Deja una respuesta</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                            <Input required value={name} onChange={e => setName(e.target.value)} className="bg-white" placeholder="Tu nombre" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email * (No será público)</label>
                            <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white" placeholder="tu@email.com" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comentario *</label>
                        <Textarea required value={content} onChange={e => setContent(e.target.value)} className="bg-white min-h-[120px]" placeholder="Escribe tu comentario aquí..." />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                        {isSubmitting ? "Enviando..." : "Publicar comentario"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
