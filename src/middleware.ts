import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (!req.auth && pathname.startsWith("/gestao") && pathname !== "/gestao/login") {
    const loginUrl = new URL("/gestao/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/gestao/:path*"],
};
