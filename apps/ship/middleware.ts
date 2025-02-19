import type { NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/*)
     * - Next.js static files (_next/static, _next/image)
     * - Common static assets (favicon, images, webmanifest)
     */
    "/((?!api|_next/static|_next/image|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|webmanifest)$).*)",
  ],
}
