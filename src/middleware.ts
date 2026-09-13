import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-session";

/**
 * Gerbang pertama admin panel: tanpa sesi yang sah, semua rute /admin dialihkan
 * ke halaman login. Pemeriksaan diulang di adminDb() untuk setiap halaman dan
 * Server Action. Situs publik tidak memakai sesi, jadi tidak perlu melewati sini.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const authed = await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);

  if (!authed && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (authed && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
