import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SpaceDelete } from "@/features/spaces/components/SpaceDelete"
import { SpaceUpdate } from "@/features/spaces/components/SpaceUpdate"

type Props = {
  params: Promise<{ space_id: string }>
}

export default async function SettingsPage(props: Props) {
  const params = await props.params
  const { space_id } = params // Note: space_id is actually account_id
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch account by ID
  const { data: accounts } = await supabase.rpc("get_accounts")
  const account = accounts?.find((acc: any) => acc.account_id === space_id)

  if (!account) {
    notFound()
  }

  // Map account to space-like object for existing components
  const space = {
    id: account.account_id,
    name: account.name,
    created_at: account.created_at,
    updated_at: account.updated_at,
  }

  return (
    <div className="space-y-6">
      <SpaceUpdate space={space} />
      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete this workspace and all of its data.
        </p>
        <div className="mt-4">
          <SpaceDelete space={space} />
        </div>
      </div>
    </div>
  )
}
