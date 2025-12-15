import { createClient } from "@/lib/supabase/server"
import { Check } from "lucide-react"

export const revalidate = 0

type Framework = {
  id: string
  display_name: string
}

type Control = {
  id: string
  name: string
  description: string | null
  is_production_ready: boolean
}

type Mapping = {
  framework_id: string
  control_id: string
}

export default async function ComplianceMatrixPage() {
  const supabase = await createClient()

  // Fetch all data
  const [
    { data: frameworks, error: frameworksError },
    { data: controls, error: controlsError },
    { data: mappings, error: mappingsError }
  ] = await Promise.all([
    supabase
      .from("frameworks")
      .select("id, display_name")
      .order("display_name")
      .limit(20), // Limit to important frameworks
    supabase
      .from("controls")
      .select("id, name, description, is_production_ready")
      .eq("is_production_ready", true)  // Only show quality-approved controls
      .order("id"),
    supabase
      .from("framework_controls")
      .select("framework_id, control_id"),
  ])

  if (frameworksError || controlsError || mappingsError) {
    return (
      <div className="container max-w-full py-10">
        <h1 className="text-3xl font-semibold mb-4">Compliance Matrix</h1>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="font-semibold text-destructive">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">
            {frameworksError?.message || controlsError?.message || mappingsError?.message}
          </p>
        </div>
      </div>
    )
  }

  if (!frameworks?.length || !controls?.length) {
    return (
      <div className="container max-w-full py-10">
        <h1 className="text-3xl font-semibold mb-4">Compliance Matrix</h1>
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Create a lookup map for quick checking
  const mappingSet = new Set(
    mappings?.map((m: Mapping) => `${m.framework_id}:${m.control_id}`) || []
  )

  return (
    <div className="w-full py-10 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Compliance Matrix</h1>
        <p className="text-muted-foreground text-sm">
          {frameworks.length} frameworks × {controls.length} production-ready controls = {mappings?.length || 0} mappings
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ✓ Showing only quality-approved controls
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-background border-r border-b p-3 text-left font-semibold text-sm min-w-[300px]">
                Control
              </th>
              {frameworks.map((framework: Framework) => (
                <th
                  key={framework.id}
                  className="border-b border-l p-0 relative h-52 min-w-[40px] align-bottom"
                >
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 origin-bottom-left -rotate-90 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-0.5">
                      <span className="text-xs font-semibold">
                        {framework.display_name}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {framework.id}
                      </span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {controls.map((control: Control) => (
              <tr key={control.id} className="hover:bg-muted/50">
                <td className="sticky left-0 z-10 bg-background border-r p-3 text-sm">
                  <div className="max-w-[300px] space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{control.id}</span>
                      <span className="font-semibold text-sm">{control.name}</span>
                    </div>
                    {control.description && (
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {control.description}
                      </div>
                    )}
                  </div>
                </td>
                {frameworks.map((framework: Framework) => {
                  const hasMapping = mappingSet.has(`${framework.id}:${control.id}`)
                  return (
                    <td
                      key={framework.id}
                      className="border-l border-t text-center p-1"
                    >
                      {hasMapping && (
                        <Check className="h-4 w-4 text-green-600 mx-auto" />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
