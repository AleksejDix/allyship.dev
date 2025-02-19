// app/api/auth/callback/route.ts

// OAuth callback handler for Supabase authentication flow
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const origin = url.origin

  // These params come from the Supabase redirect after OAuth provider authentication
  const code = searchParams.get("code")
  // 'next' param allows deep-linking back to the original requested page
  const next = searchParams.get("next") ?? "/"
  // Error param is set if user denies OAuth permissions
  const errorParam = searchParams.get("error")

  // Handle user-initiated cancellations gracefully to prevent error logs
  if (errorParam) {
    console.warn("User canceled the login flow:", errorParam)
    return NextResponse.redirect(`${origin}/auth/login?error=canceled`)
  }

  // This should never happen in normal flow - indicates potential security issue
  if (!code) {
    console.error("No authorization code received in callback.")
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  try {
    // Server-side client ensures proper cookie handling
    const supabase = await createClient()

    // Exchange short-lived code for long-lived session token
    const {
      error
    } = await supabase.auth.exchangeCodeForSession(code)

    // Invalid/expired codes should redirect back to login
    if (error) {
      console.error("Error exchanging code for session:", error.message)
      return NextResponse.redirect(`${origin}/login?error=session_failed`)
    }

    // Required for proper URL construction behind load balancers/proxies
    const forwardedHost = request.headers.get("x-forwarded-host")
    const isLocalEnv = process.env.NODE_ENV === "development"

    // Local dev can use origin directly since no load balancer is present
    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`)
    } else if (forwardedHost) {
      // Production must use forwarded host to handle load balancer correctly
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    } else {
      // Fallback for unexpected proxy configuration
      return NextResponse.redirect(`${origin}${next}`)
    }
  } catch (error) {
    // Catch any unexpected errors to prevent white screen
    console.error("Unexpected error during OAuth callback:", error)
    return NextResponse.redirect(`${origin}/login?error=unknown_error`)
  }
}
