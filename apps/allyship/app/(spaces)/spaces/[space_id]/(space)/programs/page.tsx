import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { getPrograms } from "@/features/programs/actions"
import { StartProgramDialog } from "@/features/programs/components/StartProgramDialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import Link from "next/link"

type PageProps = {
  params: Promise<{ space_id: string }>
}

export default async function ProgramsPage(props: PageProps) {
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

  // Fetch programs for this account
  const result = await getPrograms(params.space_id)
  const programs = result.success ? result.data : []

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          heading="Compliance Programs"
          text="Track and manage your compliance requirements"
        />
        <StartProgramDialog accountId={params.space_id} />
      </div>

      {!programs || programs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No programs found</CardTitle>
            <CardDescription>
              Get started by creating your first compliance program
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <Link
              key={program.id}
              href={`/spaces/${params.space_id}/programs/${program.id}`}
              className="transition-opacity hover:opacity-80"
            >
              <Card className="h-full cursor-pointer hover:border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {program.framework.display_name}
                      </CardTitle>
                      <CardDescription>
                        {program.framework.shorthand_name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{program.framework.jurisdiction}</Badge>
                    <Badge variant="outline">{program.framework.compliance_type}</Badge>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Started {new Date(program.created_at).toLocaleDateString()}
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
