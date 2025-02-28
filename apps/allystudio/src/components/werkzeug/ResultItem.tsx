import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink
} from "lucide-react"
import { memo, useState } from "react"

import { getSeverityColorClass } from "./utils"

interface ResultItemProps {
  result: {
    id?: string
    message?: string
    severity?: string
    outcome?: string
    ruleId?: string
    rule?: {
      id?: string
      name?: string
    }
    impact?: string
    wcagCriteria?: string[]
    helpUrl?: string
    element?: {
      selector?: string
      html?: string
      xpath?: string
      attributes?: Record<string, string>
    }
    remediation?: string
  }
}

// Single Result Item Component
const ResultItem = memo(function ResultItem({ result }: ResultItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const ruleId = result.ruleId || result.rule?.id
  const ruleName = result.rule?.name
  const isPassed = result.outcome === "passed"

  const outcomeIcon = isPassed ? (
    <CheckCircle size={16} className="text-green-400" aria-hidden="true" />
  ) : (
    <AlertTriangle
      size={16}
      className={getSeverityColorClass(
        result.severity || "",
        result.outcome || ""
      )}
      aria-hidden="true"
    />
  )

  return (
    <div
      className={cn(
        "border rounded-md mb-3 transition-colors",
        isPassed
          ? "bg-blue-950/15 hover:bg-blue-950/20 border-blue-500/30"
          : "bg-red-950/15 hover:bg-red-950/20 border-red-500/30"
      )}>
      {/* Header section with main details */}
      <div
        className={cn(
          "p-3 flex items-center justify-between cursor-pointer",
          isPassed ? "hover:bg-blue-950/20" : "hover:bg-red-950/20",
          isExpanded && "border-b border-border/30"
        )}
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-shrink-0">{outcomeIcon}</div>
          <div className="text-sm text-foreground/90 break-words overflow-hidden font-medium">
            {result.message || "Issue detected"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {result.impact && (
            <div className="text-xs px-2 py-1 rounded-full bg-muted/30 text-foreground/80 border-muted/20">
              {result.impact}
            </div>
          )}
          {result.severity && result.severity !== "unknown" && (
            <div
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                result.severity === "Critical"
                  ? "bg-red-600/70 text-red-50"
                  : result.severity === "High"
                    ? "bg-red-500/60 text-red-50"
                    : result.severity === "Medium"
                      ? "bg-amber-500/70 text-amber-50"
                      : "bg-muted/30 text-foreground/80"
              )}>
              {result.severity}
            </div>
          )}
          {isExpanded ? (
            <ChevronUp
              size={16}
              className="text-muted-foreground"
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              size={16}
              className="text-muted-foreground"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* Expanded details section */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-sm bg-transparent">
          {/* Rule information */}
          {(ruleId || ruleName) && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Rule
              </div>
              <div className="bg-muted/20 p-3 rounded-md border border-muted/20">
                {ruleId && (
                  <div className="font-mono text-xs text-foreground/90">
                    {ruleId}
                  </div>
                )}
                {ruleName && (
                  <div className="text-foreground/90">{ruleName}</div>
                )}
              </div>
            </div>
          )}

          {/* WCAG criteria */}
          {result.wcagCriteria && result.wcagCriteria.length > 0 && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                WCAG Criteria
              </div>
              <div className="flex flex-wrap gap-1">
                {result.wcagCriteria.map((criteria) => (
                  <div
                    key={criteria}
                    className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs font-medium border border-blue-500/30">
                    {criteria}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Element information */}
          {result.element && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Element
              </div>
              {result.element.selector && (
                <div className="bg-muted/20 p-3 rounded-md border border-muted/20 overflow-x-auto">
                  <div className="flex items-center gap-2">
                    <Code
                      size={14}
                      className="text-muted-foreground"
                      aria-hidden="true"
                    />
                    <code className="text-xs font-mono text-foreground/90">
                      {result.element.selector}
                    </code>
                  </div>
                </div>
              )}

              {result.element.html && (
                <div className="border border-muted/30 rounded-md mt-2">
                  <div className="bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground/80 border-b border-muted/30">
                    HTML
                  </div>
                  <pre className="p-3 text-xs overflow-x-auto font-mono bg-muted/20 text-foreground/90 rounded-b-md">
                    {result.element.html}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Remediation */}
          {result.remediation && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                How to fix
              </div>
              <div
                className={cn(
                  "p-3 rounded-md border",
                  isPassed
                    ? "bg-blue-800/20 border-blue-500/30 text-blue-100"
                    : "bg-red-800/20 border-red-500/30 text-red-100"
                )}>
                {result.remediation}
              </div>
            </div>
          )}

          {/* Help link */}
          {result.helpUrl && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "text-xs w-full border-muted/30 text-foreground/90",
                  isPassed
                    ? "bg-blue-950/15 hover:bg-blue-950/25"
                    : "bg-red-950/15 hover:bg-red-950/25"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(result.helpUrl, "_blank", "noopener,noreferrer")
                }}>
                Read accessibility guidelines for this issue
                <ExternalLink
                  size={12}
                  className="ml-1 opacity-70"
                  aria-hidden="true"
                />
                <span className="sr-only">
                  Read accessibility guidelines (opens in new window)
                </span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

export default ResultItem
