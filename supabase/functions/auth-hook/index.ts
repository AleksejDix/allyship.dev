import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

interface WebhookPayload {
  type: "LOGIN" | "SIGNUP" | "TOKEN_REFRESHED"
  event: any
  user: {
    id: string
    email: string
  }
}

interface UserStatus {
  status: "active" | "disabled" | "deleted"
  deletion_requested_at: string | null
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    const payload: WebhookPayload = await req.json()
    const clientIp =
      req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")

    // Handle all authentication events
    if (["LOGIN", "TOKEN_REFRESHED"].includes(payload.type)) {
      const { data: user, error } = await supabaseClient
        .from("User")
        .select("status, deletion_requested_at")
        .eq("id", payload.user.id)
        .single()

      if (error) {
        console.error("Error fetching user status:", error)
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      // Check user status
      if (!user || user.status !== "active") {
        // Log the blocked attempt
        await supabaseClient.rpc("log_user_action", {
          user_id: payload.user.id,
          action: "auth_blocked",
          details: {
            reason: user?.status || "not_found",
            auth_type: payload.type.toLowerCase(),
            deletion_requested: user?.deletion_requested_at ? true : false,
          },
          ip_address: clientIp,
        })

        let errorMessage = "Account access denied"
        if (user?.status === "deleted" || user?.deletion_requested_at) {
          errorMessage = "This account has been deleted"
        } else if (user?.status === "disabled") {
          errorMessage = "This account has been disabled"
        }

        return new Response(
          JSON.stringify({
            error: errorMessage,
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          }
        )
      }

      // Log successful authentication
      await supabaseClient.rpc("log_user_action", {
        user_id: payload.user.id,
        action: "auth_successful",
        details: {
          auth_type: payload.type.toLowerCase(),
        },
        ip_address: clientIp,
      })
    }

    // Allow the authentication to proceed
    return new Response(JSON.stringify({ message: "OK" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Auth hook error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
