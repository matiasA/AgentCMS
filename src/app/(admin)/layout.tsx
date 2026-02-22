import { Sidebar } from "@/components/admin/sidebar/Sidebar";
import { AdminHeader } from "@/components/admin/header/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[#f1f1f1] font-sans">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 text-[#3c434a]">
                    {children}
                </main>
            </div>
        </div>
    );
}
