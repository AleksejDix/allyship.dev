import { TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface Pass {
  id: string | number
  help: string
  description: string
  impact: "moderate" | "minor" | "critical"
}

const isCritical = (pass: Pass) => pass.impact === "critical"

export function Passes({ passes }: { passes: Pass[] }) {
  return (
    <ul className="border border-border rounded-md divide-y divide-border bg-background">
      {passes.map((pass: Pass) => (
        <li key={pass.id}>
          <Collapsible>
            <CollapsibleTrigger
              className={cn(
                "text-left w-full py-2 px-3 [&[aria-expanded=true]]:bg-muted hover:bg-muted flex items-center justify-between ",
                isCritical(pass) && "bg-destructive/10"
              )}
            >
              <div>
                <div className="font-medium text-sm">{pass.help}</div>
                <div className="text-sm text-muted-foreground">
                  {pass.description}
                </div>
              </div>

              {pass.impact && (
                <Badge
                  variant="destructive"
                  className="inline-flex items-center gap-2"
                >
                <TriangleAlert size="16" />
                  {String(pass.impact).charAt(0).toUpperCase() +
                    String(pass.impact).slice(1)}
                </Badge>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-3 border-t border-border">
              <div className="text-sm text-muted-foreground">
                <pre className="min-w-full overflow-x-auto rounded-lg border border-border bg-black p-4">
                  <code className="font-mono">
                    {JSON.stringify(pass, null, 2)}
                  </code>
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </li>
      ))}
    </ul>
  )
}
