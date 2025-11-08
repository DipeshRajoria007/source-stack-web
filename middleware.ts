import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Protect /app routes - redirect to login if not authenticated
  if (pathname.startsWith("/app") && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    // Add the original URL as a callback so we can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
});

// Configure which routes should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, icon.svg, etc. (favicon files)
     * - public files (images, etc.)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

