import { type Metadata } from "next"
import { PageHeader } from "@/features/domain/components/page-header"
import { PageNavigation } from "@/features/pages/components/page-navigation"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Page Settings",
  description: "Manage your page settings",
}

type Params = {
  page_id: string
  space_id: string
  domain_id: string
}

export default async function Page({ params }: { params: Params }) {
  const { page_id, space_id, domain_id } = params

  return (
    <>
      <PageNavigation
        space_id={space_id}
        domain_id={domain_id}
        page_id={page_id}
      />
      <PageHeader title="Settings" description={`Manage settings`} />
      <div className="container py-6">
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
    </>
  )
}
