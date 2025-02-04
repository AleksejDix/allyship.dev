import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Violation = {
  id: string
  impact: "minor" | "moderate" | "serious" | "critical"
  description: string
  help: string
  helpUrl: string
  tags: string[]
  nodes: Array<{
    html: string
    target: string[]
    failureSummary: string
  }>
}

export function Violation({ violation }: { violation: Violation }) {
  return (
    <Card className="rounded-none border-none">
      <CardHeader>
        <CardTitle>{violation.help}</CardTitle>
        <CardDescription>{violation.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="font-mono">
          # {violation.id}
        </CardDescription>

        <div className="space-y-4">
          {violation.nodes.map((node: any) => (
            <div
              key={node.html}
              className="rounded-lg border border-border p-4 space-y-3"
            >
              <div className="flex items-center gap-2"></div>
              <div className="space-y-2 font-mono text-sm">
                <pre className="whitespace-pre-wrap break-all bg-background p-2 rounded-md">
                  {node.html}
                </pre>
                <pre className="whitespace-pre-wrap break-all bg-background p-2 rounded-md">
                  {node.target}
                </pre>
                <pre className="whitespace-pre-wrap break-all bg-background p-2 rounded-md">
                  {node.failureSummary}
                </pre>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Impact:</span>
          <Badge>{violation.impact}</Badge>
          <span className="text-sm text-muted-foreground">Nodes:</span>
          <Badge variant="outline">{violation.nodes.length}</Badge>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        {violation.tags.map((tag: string) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </CardFooter>
    </Card>
  )
}
