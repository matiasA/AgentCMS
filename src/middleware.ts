import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/wp-admin");
    if (isAdminRoute && !req.auth) {
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
