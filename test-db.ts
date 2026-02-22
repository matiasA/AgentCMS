import prisma from "./prisma";

async function verifyDb() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@ejemplo.com' }
    });
    console.log("DB USER FOUND:", user);
}

verifyDb();
