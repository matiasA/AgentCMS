import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
    const mediaItems = await prisma.media.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <h1 className="text-2xl font-normal text-[#1d2327]">Biblioteca de medios</h1>
                <button className="border border-[#2271b1] text-[#2271b1] hover:bg-[#135e96] hover:text-white transition-colors h-7 px-3 text-sm rounded-sm">
                    Añadir nuevo archivo
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mediaItems.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-gray-500 bg-white border border-[#c3c4c7]">
                        No se encontraron archivos multimedia.
                    </div>
                ) : (
                    mediaItems.map((item) => (
                        <div key={item.id} className="relative group bg-white border border-[#c3c4c7] aspect-square overflow-hidden cursor-pointer hover:border-[#2271b1] shadow-sm">
                            {(item.mimeType.startsWith("image/") || item.mimeType === "image/unknown") ? (
                                <img src={item.url} alt={item.originalName} className="object-cover w-full h-full" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400">
                                    <span className="text-xs truncate max-w-full px-2">{item.mimeType}</span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
