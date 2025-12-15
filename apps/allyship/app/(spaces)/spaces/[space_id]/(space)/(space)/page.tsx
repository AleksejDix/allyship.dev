import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { StartProgramDialog } from "@/features/programs/components/StartProgramDialog"

type PageProps = {
  params: Promise<{ space_id: string }>
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch account by ID
  const { data: accounts } = await supabase.rpc("get_accounts")
  const account = accounts?.find((acc: any) => acc.account_id === params.space_id)

  if (!account) {
    notFound()
  }

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      <PageHeader
        heading={account.name}
        text={
          account.personal_account
            ? "Your personal workspace"
            : "Team workspace"
        }
      />
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Workspace Information</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Type</dt>
            <dd className="mt-1 text-sm">
              {account.personal_account ? "Personal Workspace" : "Team Workspace"}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Your Role</dt>
            <dd className="mt-1 text-sm capitalize">{account.account_role}</dd>
          </div>
        </dl>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Compliance Programs</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Track and manage your compliance requirements
            </p>
          </div>
          <StartProgramDialog accountId={params.space_id} />
        </div>
      </div>
    </div>
  )
}
