import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

interface Notification {
  id: string
  user_id: string
  type: string
  details: {
    email: string
    reason?: string
    reactivated_by?: string
  }
}

const emailTemplates = {
  account_reactivated: (details: Notification["details"]) => ({
    subject: "Your Account Has Been Reactivated",
    text: `Hello,\n\nYour account has been reactivated by an administrator.\nReason: ${
      details.reason || "Not specified"
    }\n\nYou can now log in to your account.`,
  }),
  gdpr_deletion_completed: (details: Notification["details"]) => ({
    subject: "Account Deletion Completed",
    text: `Hello,\n\nAs per your GDPR deletion request, we confirm that your account and all associated data have been permanently deleted from our systems.\n\nThank you for using our service.`,
  }),
  account_expired: (details: Notification["details"]) => ({
    subject: "Account Deleted Due to Inactivity",
    text: `Hello,\n\nYour account has been deleted due to extended inactivity.\nReason: ${
      details.reason || "Retention period expired"
    }\n\nIf you wish to use our service again, please create a new account.`,
  }),
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    )

    // Get pending notifications
    const { data: notifications, error: fetchError } = await supabaseClient
      .from("user_notifications")
      .select("*")
      .eq("status", "pending")
      .limit(50)

    if (fetchError) {
      console.error("Error fetching notifications:", fetchError)
      return new Response(
        JSON.stringify({ error: "Failed to fetch notifications" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const results = []

    for (const notification of notifications) {
      try {
        const template =
          emailTemplates[notification.type as keyof typeof emailTemplates]
        if (!template) {
          throw new Error(`Unknown notification type: ${notification.type}`)
        }

        const { subject, text } = template(notification.details)

        // Send email via Resend API
        const emailResponse = await fetch("https://api.resend.com/v1/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "notifications@yourdomain.com",
            to: notification.details.email,
            subject,
            text,
          }),
        })

        if (!emailResponse.ok) {
          throw new Error(
            `Failed to send email: ${emailResponse.status} ${emailResponse.statusText}`
          )
        }

        // Mark notification as sent
        await supabaseClient
          .from("user_notifications")
          .update({
            status: "sent",
            processed_at: new Date().toISOString(),
          })
          .eq("id", notification.id)

        results.push({
          id: notification.id,
          status: "sent",
        })
      } catch (error) {
        console.error(
          `Error processing notification ${notification.id}:`,
          error
        )

        // Mark notification as failed
        await supabaseClient
          .from("user_notifications")
          .update({
            status: "failed",
            processed_at: new Date().toISOString(),
            error: error.message,
          })
          .eq("id", notification.id)

        results.push({
          id: notification.id,
          status: "failed",
          error: error.message,
        })
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Process notifications error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
