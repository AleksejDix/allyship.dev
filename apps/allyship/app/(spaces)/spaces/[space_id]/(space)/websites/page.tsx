import Link from 'next/link'
import { Globe } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Props = {
  params: Promise<{ space_id: string }>
}

export default async function WebsitesPage(props: Props) {
  const params = await props.params
  const { space_id } = params
  const supabase = await createClient()

  const { data: websites } = await supabase
    .from('Website')
    .select('*')
    .eq('space_id', space_id)

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
          {websites.map(website => (
            <Link
              key={website.id}
              href={`/spaces/${space_id}/${website.id}`}
              className="block transition-colors hover:bg-muted/50 rounded-lg"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size="16" aria-hidden="true" className="shrink-0" />
                    {website.url}
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
