import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;


  if (pathname === "/api/auth/session") {
    const accept = req.headers.get("accept") || "";

    if (accept.includes("text/html")) {
      return NextResponse.json(
        { success: false, message: "Access Denied" },
        { status: 403 }
      );
    }


    return NextResponse.next();
  }

  if (pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });



  const protectedRoutes = ["/admin", "/manager", "/employee", "/profile"];

  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/login" && token) {
    const roleRedirectMap: Record<string, string> = {
      ADMIN: "/admin",
      MANAGER: "/manager",
      EMPLOYEE: "/employee",
    };

    return NextResponse.redirect(
      new URL(roleRedirectMap[token.role] ?? "/", req.url)
    );
  }


  if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/access-denied", req.url));
  }

  if (pathname.startsWith("/manager") && token?.role !== "MANAGER") {
    return NextResponse.redirect(new URL("/access-denied", req.url));
  }

  if (pathname.startsWith("/employee") && token?.role !== "EMPLOYEE") {
    return NextResponse.redirect(new URL("/access-denied", req.url));
  }
  return NextResponse.next();
}


export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/manager/:path*",
    "/employee/:path*",
    "/profile",
    "/admin/:path*",
    "/api/:path*",
  ],
};

