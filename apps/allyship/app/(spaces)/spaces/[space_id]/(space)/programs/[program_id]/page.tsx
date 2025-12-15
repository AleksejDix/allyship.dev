import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PageHeader } from "@/components/page-header"
import { getProgram, getProgramControls } from "@/features/programs/actions"
import { ControlsList } from "@/features/programs/components/ControlsList"
import { Badge } from "@workspace/ui/components/badge"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"

type PageProps = {
  params: Promise<{ space_id: string; program_id: string }>
}

export default async function ProgramDetailPage(props: PageProps) {
  const params = await props.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch program details
  const programResult = await getProgram(params.program_id)
  if (!programResult.success || !programResult.data) {
    notFound()
  }

  const program = programResult.data

  // Fetch program controls
  const controlsResult = await getProgramControls(params.program_id)
  const controls = controlsResult.success ? controlsResult.data : []

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/spaces/${params.space_id}/programs`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <PageHeader
            heading={program.framework.display_name}
            text={program.framework.description || "Compliance program details"}
          />
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{program.framework.shorthand_name}</Badge>
          <Badge variant="outline">{program.framework.jurisdiction}</Badge>
          <Badge variant="outline">{program.framework.compliance_type}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Program started {new Date(program.created_at).toLocaleDateString()}
        </div>
      </div>

      {!controls || controls.length === 0 ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No controls found</AlertTitle>
          <AlertDescription className="mt-2">
            This framework doesn't have any controls configured. This appears to be a data
            configuration issue. Please ensure the framework has controls mapped in the
            framework_controls table before creating programs.
          </AlertDescription>
        </Alert>
      ) : (
        <ControlsList controls={controls} />
      )}
    </div>
  )
}
