import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static /shop — rewrite query-string visits to the dynamic browse route.
  if (pathname === "/shop" && request.nextUrl.search) {
    const url = request.nextUrl.clone();
    url.pathname = "/shop/browse";
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    });
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/shop", "/admin/((?!login).*)"],
};
