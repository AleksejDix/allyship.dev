import { notFound } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

type Props = {
  params: { space_id: string }
}

export default async function WebsitesPage({ params }: Props) {
  const { space_id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("Website")
    .select("*")
    .eq("space_id", space_id)

  if (!data || data.length === 0) {
    notFound()
  }

  return (
    <div>
      <pre>
        {JSON.stringify(data, null, 2)} {space_id}
      </pre>
    </div>
  )
}
