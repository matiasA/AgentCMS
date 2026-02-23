import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hash = await bcrypt.hash('admin123', 10)

    const user = await prisma.user.upsert({
        where: { email: 'admin@ejemplo.com' },
        update: {
            password: hash,
            role: 'ADMIN' // Ensure role is admin
        },
        create: {
            email: 'admin@ejemplo.com',
            name: 'Administrador',
            password: hash,
            role: 'ADMIN'
        }
    })

    console.log('Usuario admin creado/actualizado correctamente:', user.email)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
