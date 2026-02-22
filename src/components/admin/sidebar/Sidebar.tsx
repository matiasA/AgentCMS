import Link from "next/link";
import {
    LayoutDashboard,
    FileText,
    Files,
    Image as ImageIcon,
    MessageSquare,
    Paintbrush,
    Plug,
    Users,
    Wrench,
    Settings,
    Sparkles
} from "lucide-react";

const navigation = [
    { name: "Escritorio", href: "/wp-admin", icon: LayoutDashboard },
    { name: "Entradas", href: "/wp-admin/posts", icon: FileText },
    { name: "Medios", href: "/wp-admin/media", icon: ImageIcon },
    { name: "Páginas", href: "/wp-admin/pages", icon: Files },
    { name: "Comentarios", href: "/wp-admin/comments", icon: MessageSquare },
    { name: "Apariencia", href: "/wp-admin/appearance", icon: Paintbrush },
    { name: "Plugins", href: "/wp-admin/plugins", icon: Plug },
    { name: "Usuarios", href: "/wp-admin/users", icon: Users },
    { name: "Herramientas", href: "/wp-admin/tools", icon: Wrench },
    { name: "Ajustes", href: "/wp-admin/settings", icon: Settings },
    { name: "Asistente IA", href: "/wp-admin/ai-assistant", icon: Sparkles, highlight: true },
];

export function Sidebar() {
    return (
        <div className="flex h-screen w-40 flex-col bg-[#1d2327] text-[#c3c4c7]">
            <div className="flex h-12 shrink-0 items-center px-4 bg-[#1d2327] text-white hover:text-white transition-colors">
                <Link href="/wp-admin" className="font-semibold text-sm truncate flex items-center gap-2">
                    <span className="bg-[#0073aa] w-6 h-6 rounded-sm flex items-center justify-center text-xs">W</span>
                    Mi CMS
                </Link>
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-sm hover:bg-[#2c3338] hover:text-[#72aee6] transition-colors ${item.highlight ? 'text-amber-400 hover:text-amber-300' : ''
                                }`}
                        >
                            <Icon
                                className={`mr-3 h-5 w-5 flex-shrink-0 ${item.highlight ? 'text-amber-400' : 'text-[#a7aaad] group-hover:text-[#72aee6]'
                                    }`}
                                aria-hidden="true"
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            {/* Collapse button similar to WP bottom sidebar */}
            <div className="flex shrink-0 border-t border-[#2c3338] p-2">
                <button className="flex w-full items-center px-2 py-2 text-sm font-medium text-[#a7aaad] hover:text-[#72aee6]">
                    {/* Collapse icon placeholder */}
                    Ocultar menú
                </button>
            </div>
        </div>
    );
}
