import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const admin = await prisma.user.upsert({
            where: { email: 'admin@ejemplo.com' },
            update: {},
            create: {
                email: 'admin@ejemplo.com',
                name: 'Administrador',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        return NextResponse.json({ success: true, admin });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
