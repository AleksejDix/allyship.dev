import { redirect, notFound } from "next/navigation"
import { getAccounts } from "@/features/spaces/actions"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's accounts (workspaces)
  const result = await getAccounts()

  if (!result.success || !result.data || result.data.length === 0) {
    notFound()
  }

  const accounts = result.data

  return (
    <div className="container">
      <div className="grid gap-4">
        {accounts.map((account) => (
          <a
            key={account.account_id}
            href={`/spaces/${account.account_id}`}
            className="block border rounded-lg p-6 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{account.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {account.personal_account ? "Personal Workspace" : "Team Workspace"}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {account.account_role}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
