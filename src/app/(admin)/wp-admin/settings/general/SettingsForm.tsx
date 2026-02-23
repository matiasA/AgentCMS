"use client";

import { useState, useTransition } from "react";
import { updateSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsForm({ initialSettings }: { initialSettings: Record<string, string> }) {
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState({
        site_title: initialSettings.site_title || "Mi CMS",
        site_description: initialSettings.site_description || "Otro sitio web más",
        admin_email: initialSettings.admin_email || "admin@ejemplo.com",
        site_url: initialSettings.site_url || "http://localhost:3000",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (key: keyof typeof settings, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setSuccessMessage("");
        setErrorMessage("");
        startTransition(async () => {
            try {
                const settingsArray = Object.entries(settings).map(([key, value]) => ({ key, value }));
                await updateSettings(settingsArray);
                setSuccessMessage("Ajustes guardados correctamente.");
            } catch (error: any) {
                setErrorMessage(error.message || "Ocurrió un error al guardar.");
            }
        });
    };

    return (
        <div className="space-y-6 max-w-2xl bg-white p-6 border border-[#c3c4c7] shadow-sm rounded-sm text-[#2c3338] text-[13px]">
            {successMessage && <div className="border-l-4 border-[#00a32a] bg-white p-3 shadow-sm mb-4"><p className="font-semibold text-[#1d2327]">{successMessage}</p></div>}
            {errorMessage && <div className="border-l-4 border-[#d63638] bg-white p-3 shadow-sm mb-4"><p className="font-semibold text-[#1d2327]">{errorMessage}</p></div>}

            <div className="grid grid-cols-[200px_1fr] items-center gap-4">
                <label className="font-semibold" htmlFor="site_title">Título del sitio</label>
                <Input id="site_title" value={settings.site_title} onChange={(e) => handleChange("site_title", e.target.value)} className="h-8 shadow-sm focus-visible:ring-1 focus-visible:ring-[#2271b1] border-[#8c8f94] max-w-md" />
            </div>

            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                <label className="font-semibold mt-1.5" htmlFor="site_description">Descripción corta</label>
                <div>
                    <Input id="site_description" value={settings.site_description} onChange={(e) => handleChange("site_description", e.target.value)} className="h-8 shadow-sm focus-visible:ring-1 focus-visible:ring-[#2271b1] border-[#8c8f94] max-w-md" />
                    <p className="text-gray-500 mt-1 italic text-xs">En pocas palabras, explica de qué trata el sitio.</p>
                </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-center">
                <label className="font-semibold" htmlFor="site_url">Dirección de WordPress (URL)</label>
                <Input id="site_url" value={settings.site_url} onChange={(e) => handleChange("site_url", e.target.value)} className="h-8 shadow-sm focus-visible:ring-1 focus-visible:ring-[#2271b1] border-[#8c8f94] max-w-md" />
            </div>

            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
                <label className="font-semibold mt-1.5" htmlFor="admin_email">Dirección de correo electrónico</label>
                <div>
                    <Input id="admin_email" type="email" value={settings.admin_email} onChange={(e) => handleChange("admin_email", e.target.value)} className="h-8 shadow-sm focus-visible:ring-1 focus-visible:ring-[#2271b1] border-[#8c8f94] max-w-md" />
                    <p className="text-gray-500 mt-1 italic text-xs">Esta dirección se utilizará con fines de administración, como la notificación de nuevos usuarios.</p>
                </div>
            </div>

            <div className="pt-4 border-t border-[#f0f0f1]">
                <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white h-8 text-[13px] px-4 font-normal rounded-sm"
                >
                    {isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
            </div>
        </div>
    );
}
