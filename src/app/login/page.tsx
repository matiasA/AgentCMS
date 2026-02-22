"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res && !res.error) {
            router.push("/wp-admin");
        } else {
            alert("Credenciales incorrectas"); // Simplificación para testing
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-[#f1f1f1]">
            <div className="w-full max-w-sm space-y-6 bg-white p-8 shadow-sm border border-[#c3c4c7]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Mi CMS</h1>
                    <p className="text-sm text-gray-500">
                        Inicia sesión en tu cuenta
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full bg-[#2271b1] hover:bg-[#135e96]">
                        Acceder
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <a href="/" className="text-[#2271b1] hover:underline">
                        &larr; Volver a Mi CMS
                    </a>
                </div>
            </div>
        </div>
    );
}
