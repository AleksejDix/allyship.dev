import { WebsiteDelete } from "@/features/websites/components/website-delete"

import { createClient } from "@/lib/supabase/server"

type Props = {
  params: Promise<{ space_id: string; website_id: string }>
}

export default async function SettingsPage(props: Props) {
  const params = await props.params
  const { space_id, website_id } = params

  const supabase = await createClient()

  const { data: website, error } = await supabase
    .from("Website")
    .select()
    .eq("id", website_id)
    .single()

  if (error || !website) {
    throw new Error("Website not found")
  }

  return (
    <div className="space-y-6">
      <WebsiteDelete website={website} spaceId={space_id} />
    </div>
  )
}
