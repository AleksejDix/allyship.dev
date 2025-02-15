import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  // Only handle requests to site.webmanifest
  if (request.nextUrl.pathname === "/site.webmanifest") {
    const response = NextResponse.next()

    // Add CORS headers
    response.headers.set(
      "Access-Control-Allow-Origin",
      request.headers.get("origin") || ""
    )
    response.headers.set("Access-Control-Allow-Methods", "GET")
    response.headers.set("Access-Control-Allow-Credentials", "true")
    response.headers.set("Content-Type", "application/manifest+json")

    return response
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/site.webmanifest",
  ],
}
