import { type Metadata } from "next"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

type PageProps = {
  params: { domain_id: string; space_id: string; page_id: string }
}

export const metadata: Metadata = {
  title: "Page Settings",
  description: "Manage your page settings",
}

export default async function Page({ params }: PageProps) {
  const { domain_id, space_id, page_id } = params

  return (
    <div className="container py-6">
      <PageHeader
        heading="Page Settings"
        description="Manage your page settings and configuration."
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">General Settings</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Configure general settings for this page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
