import Link from "next/link";

export default function ToolsPage() {
    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-normal text-[#1d2327] mb-6">Herramientas</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-[#c3c4c7] shadow-sm p-6 rounded-sm">
                    <h2 className="text-lg font-semibold text-[#1d2327] mb-2">Importar</h2>
                    <p className="text-sm text-[#50575e] mb-4">
                        Importa entradas, páginas, comentarios, campos personalizados, categorías y etiquetas desde un archivo de exportación de WordPress (.xml).
                    </p>
                    <Link href="/wp-admin/tools/import" className="text-[#2271b1] hover:underline text-sm font-medium">Ejecutar el Importador</Link>
                </div>

                <div className="bg-white border border-[#c3c4c7] shadow-sm p-6 rounded-sm opacity-60">
                    <h2 className="text-lg font-semibold text-[#1d2327] mb-2">Exportar (Próximamente)</h2>
                    <p className="text-sm text-[#50575e] mb-4">
                        Crea un archivo XML con todo tu contenido para que puedas guardarlo o migrarlo a otro sitio.
                    </p>
                    <span className="text-gray-500 text-sm font-medium">No disponible todavía</span>
                </div>
            </div>
        </div>
    );
}
