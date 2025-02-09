// app/api/auth/callback/route.ts

import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const origin = url.origin

  // Extract query parameters
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/" // Default redirect after login
  const errorParam = searchParams.get("error") // Check for error (e.g., access_denied)

  // If the user cancels the login flow
  if (errorParam) {
    console.warn("User canceled the login flow:", errorParam)
    return NextResponse.redirect(`${origin}/auth/login?error=canceled`)
  }

  // If no code is provided (unexpected case)
  if (!code) {
    console.error("No authorization code received in callback.")
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  try {
    // Initialize Supabase client
    const supabase = await createClient()

    // Exchange the authorization code for a session
    const {
      error,
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("Error exchanging code for session:", error.message)
      return NextResponse.redirect(`${origin}/login?error=session_failed`)
    }

    if (user) {
      // Upsert the user into the database (optional step)
      const { error: upsertError } = await supabase.from("users").upsert(
        {
          id: user.id,
          email: user.email,
        },
        { onConflict: "id" }
      )

      if (upsertError) {
        console.error("Error upserting user:", upsertError.message)
      }
    }

    // Determine the redirect URL
    const forwardedHost = request.headers.get("x-forwarded-host") // Original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === "development"

    if (isLocalEnv) {
      // In development, use the current origin
      return NextResponse.redirect(`${origin}${next}`)
    } else if (forwardedHost) {
      // In production, use the forwarded host
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    } else {
      // Fallback to the current origin
      return NextResponse.redirect(`${origin}${next}`)
    }
  } catch (error) {
    console.error("Unexpected error during OAuth callback:", error)
    return NextResponse.redirect(`${origin}/login?error=unknown_error`)
  }
}
