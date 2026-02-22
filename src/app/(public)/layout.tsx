export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Header simple temporal */}
            <header className="bg-white border-b shadow-sm py-4 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Mi CMS (Sitio Público)</h1>
                    <a href="/wp-admin" className="text-sm font-medium hover:underline">Ir al Admin</a>
                </div>
            </header>

            <main className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto py-8 px-6">
                    {children}
                </div>
            </main>

            <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Mi CMS - Construido con Next.js + IA
            </footer>
        </div>
    );
}
