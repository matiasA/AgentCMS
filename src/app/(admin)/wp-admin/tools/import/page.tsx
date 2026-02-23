"use client";

import { useState } from "react";
import { importWpXml } from "@/lib/actions/import";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState<{ count?: number, message?: string } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!file) {
            toast.error("Por favor, selecciona un archivo XML primero.");
            return;
        }

        setIsImporting(true);
        setResult(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result;
                if (typeof text === "string") {
                    try {
                        const response = await importWpXml(text);
                        setResult({
                            count: response.count,
                            message: response.message
                        });
                        if (response.count > 0) {
                            toast.success(`Importados ${response.count} elementos.`);
                        } else {
                            toast.warning(response.message);
                        }
                    } catch (err: any) {
                        toast.error(err.message || "Error al procesar el XML en el servidor.");
                    } finally {
                        setIsImporting(false);
                    }
                }
            };
            reader.readAsText(file);
        } catch (e: any) {
            toast.error("Error al leer el archivo localmente.");
            setIsImporting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-normal text-[#1d2327]">Importar entradas de WordPress</h1>

            <div className="bg-white border border-[#c3c4c7] shadow-sm p-6 rounded-sm">
                <p className="text-sm text-[#50575e] mb-6 leading-relaxed">
                    Sube aquí el archivo XML de exportación que generaste en tu otro sitio WordPress (WXR).
                    Importaremos las entradas, páginas y publicaremos tu contenido crudo para que puedas ajustarlo usando tu nuevo editor BlockNote.
                </p>

                <div className="flex flex-col gap-4">
                    <input
                        type="file"
                        accept=".xml"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                    />

                    <Button
                        onClick={handleImport}
                        disabled={!file || isImporting}
                        className="w-fit bg-[#2271b1] hover:bg-[#135e96] text-white"
                    >
                        {isImporting ? "Importando (por favor espera)..." : "Subir archivo e importar"}
                    </Button>
                </div>

                {result && (
                    <div className={`mt-6 p-4 rounded-md border ${result.count && result.count > 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                        <h3 className="font-semibold mb-1">Resultado de la importación</h3>
                        <p className="text-sm">{result.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
