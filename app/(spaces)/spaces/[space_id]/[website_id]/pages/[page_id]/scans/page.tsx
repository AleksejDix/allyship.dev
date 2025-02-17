import { createClient } from "@/lib/supabase/server"

type Props = {
  params: { space_id: string; website_id: string; page_id: string }
}

export default async function ScansPage({ params }: Props) {
  const { page_id } = params
  const supabase = await createClient()

  const { data } = await supabase
    .from("Scan")
    .select("*")
    .eq("page_id", page_id)
    .order("created_at", { ascending: false })

  return (
    <>
      <div className="space-y-6 py-6">
        <div className="container space-y-6">
          {JSON.stringify(data, null, 2)}
        </div>
      </div>
    </>
  )
}
