import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@workspace/ui/components/card'
import { createClient } from '@/lib/supabase/server'
import { WebsiteTable } from '@/features/websites/components/website-table'

type Props = {
  params: Promise<{ space_id: string }>
}

export default async function WebsitesPage(props: Props) {
  const params = await props.params
  const { space_id } = params // Note: space_id param is actually account_id now
  const supabase = await createClient()

  // Query websites by account_id (the space_id param now holds account_id)
  const { data: websites } = await supabase
    .from('Website')
    .select('*')
    .eq('account_id', space_id)

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
        <div className="space-y-4">
          <WebsiteTable websites={websites} spaceId={space_id} />
        </div>
      )}
    </div>
  )
}
