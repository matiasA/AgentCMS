import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PostStatus } from "@prisma/client";

export default async function NewPostPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const newPost = await prisma.post.create({
        data: {
            title: "",
            slug: `borrador-${Date.now()}`,
            content: [],
            status: PostStatus.DRAFT,
            authorId: session.user.id,
        },
    });

    redirect(`/wp-admin/posts/${newPost.id}`);
}
