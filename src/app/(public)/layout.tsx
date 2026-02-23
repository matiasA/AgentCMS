import prisma from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const settingsRows = await prisma.setting.findMany();
    const settings = settingsRows.reduce((acc, current) => {
        acc[current.key] = current.value;
        return acc;
    }, {} as Record<string, string>);

    return {
        title: {
            template: `%s | ${settings["site_title"] || "Mi CMS"}`,
            default: `${settings["site_title"] || "Mi CMS"} - ${settings["site_description"] || "Otro sitio web"}`
        },
        description: settings["site_description"],
    };
}

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get general settings
    const settingsRows = await prisma.setting.findMany();
    const settings = settingsRows.reduce((acc, current) => {
        acc[current.key] = current.value;
        return acc;
    }, {} as Record<string, string>);

    // Get primary menu
    const menu = await prisma.menu.findFirst({
        where: { location: "primary" },
        include: { items: { orderBy: { order: "asc" } } }
    });

    const siteTitle = settings["site_title"] || "Mi CMS";
    const siteDesc = settings["site_description"] || "Otro sitio web más";

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white border-b shadow-sm py-4 px-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                            {siteTitle}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{siteDesc}</p>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {menu?.items.map(item => (
                            <Link key={item.id} href={item.url || "#"} className="text-[15px] font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href="/wp-admin" className="text-sm font-medium bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition shadow-sm">
                            Empezar
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 bg-gray-50/50">
                <div className="max-w-7xl mx-auto py-12 px-6">
                    {children}
                </div>
            </main>

            <footer className="bg-white py-12 text-sm text-gray-500">
                <div className="max-w-7xl mx-auto px-6 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="font-medium text-gray-600">&copy; {new Date().getFullYear()} {siteTitle} - Construido con Next.js + IA</p>
                    <div className="flex gap-6">
                        <Link href="/" className="hover:text-blue-600 transition">Inicio</Link>
                        <Link href="/wp-admin" className="hover:text-blue-600 transition">Admin Panel</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
