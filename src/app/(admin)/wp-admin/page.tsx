export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-normal text-[#1d2327]">Escritorio</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Welcome Widget */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-[#c3c4c7] shadow-sm">
                    <div className="p-4 py-8 md:p-8 flex flex-col items-center text-center">
                        <h2 className="text-2xl font-light mb-4">¡Bienvenido a Mi CMS React!</h2>
                        <p className="text-[#50575e] max-w-2xl mb-6">
                            Hemos reunido algunos enlaces para que puedas empezar:
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-[#2271b1] hover:bg-[#135e96] text-white px-4 py-1.5 rounded text-sm transition-colors">
                                Personaliza tu sitio
                            </button>
                        </div>
                    </div>
                </div>

                {/* At a Glance Widget */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm">
                    <h2 className="px-4 py-2.5 font-semibold text-sm border-b border-[#c3c4c7] text-[#1d2327]">
                        De un vistazo
                    </h2>
                    <div className="p-4 text-sm text-[#50575e]">
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="text-[#2271b1]">📝</span> 0 Entradas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[#2271b1]">📄</span> 0 Páginas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-[#2271b1]">💬</span> 0 Comentarios
                            </li>
                        </ul>
                        <p className="mt-4 pt-4 border-t border-[#c3c4c7] text-xs">
                            CMS corriendo en Next.js App Router.
                        </p>
                    </div>
                </div>

                {/* Activity Widget */}
                <div className="bg-white border border-[#c3c4c7] shadow-sm md:col-span-1 lg:col-span-2">
                    <h2 className="px-4 py-2.5 font-semibold text-sm border-b border-[#c3c4c7] text-[#1d2327]">
                        Actividad
                    </h2>
                    <div className="p-4 text-sm text-[#50575e]">
                        <h3 className="font-semibold text-xs text-[#8c8f94] uppercase tracking-wider mb-2">Publicado recientemente</h3>
                        <p className="italic">No hay publicaciones recientes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
