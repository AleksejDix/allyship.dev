import Link from "next/link"
import { notFound } from "next/navigation"
import { WebsiteCreateDialog } from "@/features/websites/components/website-create-dialog"
import { ExternalLink, Globe } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Props = {
  params: { space_id: string }
}

export default async function WebsitesPage({ params }: Props) {
  const { space_id } = params
  const supabase = await createClient()

  const { data: websites } = await supabase
    .from("Website")
    .select("*")
    .eq("space_id", space_id)

  return (
    <div className="container mx-auto py-6">
      {!websites || websites.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No websites found</CardTitle>
            <CardDescription>
              Get started by adding your first website
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <Link
              key={website.id}
              href={`/spaces/${space_id}/${website.id}`}
              className="block transition-colors hover:bg-muted/50 rounded-lg"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    {new URL(website.url).hostname}
                  </CardTitle>
                  <CardDescription>{website.url}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        Theme: {website.theme.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
