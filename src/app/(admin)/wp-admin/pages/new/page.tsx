import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PostStatus } from "@prisma/client";

export default async function NewPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const newPage = await prisma.page.create({
        data: {
            title: "",
            slug: `borrador-pagina-${Date.now()}`,
            content: [],
            status: PostStatus.DRAFT,
            authorId: session.user.id,
        },
    });

    redirect(`/wp-admin/pages/${newPage.id}`);
}
