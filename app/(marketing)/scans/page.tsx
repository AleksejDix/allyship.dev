import Link from "next/link"
import { ScanJobCreate } from "@/features/scans/components/scan-create"
import { ScanIndex } from "@/features/scans/components/scan-index"
import { ArrowRight } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default async function ScansPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: scans } = await supabase
    .from("Scan")
    .select("*")
    .order("created_at", { ascending: false })

  // Transform the data to match the expected type
  const transformedScans =
    scans?.map((scan) => ({
      id: scan.id,
      url: scan.url,
      user_id: scan.user_id,
      status: scan.status,
      created_at: scan.created_at ? new Date(scan.created_at) : null,
      metrics: scan.metrics || null,
      page_id: scan.page_id,
      screenshot_light: scan.screenshot_light,
      screenshot_dark: scan.screenshot_dark,
    })) || []

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">Web Accessibility Scanner</h1>
          <p className="text-xl text-muted-foreground">
            Check your website for accessibility issues and get detailed reports
            on how to fix them. Our scanner checks for WCAG 2.0, 2.1, and 2.2
            compliance.
          </p>
        </div>

        {user ? (
          <ScanJobCreate variant="marketing" />
        ) : (
          <div className="text-center space-y-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Get Started <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline">
                Login
              </Link>
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 pt-8">
          <div className="space-y-2">
            <h3 className="font-semibold">Comprehensive Testing</h3>
            <p className="text-sm text-muted-foreground">
              Our scanner tests for over 100 accessibility issues across
              multiple compliance standards.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Detailed Reports</h3>
            <p className="text-sm text-muted-foreground">
              Get actionable insights with clear explanations of issues and how
              to fix them.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Team Collaboration</h3>
            <p className="text-sm text-muted-foreground">
              Share scan results with your team and track improvements over
              time.
            </p>
          </div>
        </div>

        {user && scans && scans.length > 0 && (
          <div className="pt-16">
            <h2 className="text-2xl font-bold mb-8">Recent Scans</h2>
            <ScanIndex scans={transformedScans} />
          </div>
        )}
      </div>
    </div>
  )
}
