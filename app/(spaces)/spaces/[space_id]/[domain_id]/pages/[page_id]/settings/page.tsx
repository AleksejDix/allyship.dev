import { type Metadata } from "next"
import { PageHeader } from "@/features/domain/components/page-header"
import { PageDelete } from "@/features/pages/components/page-delete"

import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Page Settings",
  description: "Manage your page settings",
}

interface Props {
  params: {
    page_id: string
    space_id: string
    domain_id: string
  }
}

export default async function SettingsPage({ params }: Props) {
  const { page_id, space_id, domain_id } = params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from("Page")
    .select()
    .eq("id", page_id)
    .single()

  if (!page) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Delete Page</CardTitle>
            <CardDescription>
              Permanently delete this page and all of its data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PageDelete page={page} spaceId={space_id} domainId={domain_id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
