import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function GeneralSettingsPage() {
    const settingsRows = await prisma.setting.findMany();

    // Lo convertimos a un objeto clave/valor
    const settingsMap = settingsRows.reduce((acc, current) => {
        acc[current.key] = current.value;
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-normal text-[#1d2327] mb-6">Ajustes generales</h1>

            <SettingsForm initialSettings={settingsMap} />
        </div>
    );
}
