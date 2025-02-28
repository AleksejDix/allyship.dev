import { cn } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import { memo } from "react"

import { getSeverityColorClass } from "./utils"

interface ResultItemProps {
  result: {
    id?: string
    message?: string
    severity?: string
    outcome?: string
    ruleId?: string
    wcagCriteria?: string[]
    helpUrl?: string
  }
}

// Single Result Item Component
const ResultItem = memo(function ResultItem({ result }: ResultItemProps) {
  return (
    <div
      className={cn(
        "p-3 border-b last:border-b-0",
        "bg-background hover:bg-muted/20 transition-colors"
      )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              getSeverityColorClass(result.severity || "", result.outcome || "")
            )}
          />
          <div className="font-medium">
            {result.message || "Issue detected"}
          </div>
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-card border">
          {result.severity || "Unknown"}
        </div>
      </div>

      {/* Additional ACT rule information */}
      {result.ruleId && (
        <div className="mt-1 text-xs text-muted-foreground pl-4">
          <div>Rule: {result.ruleId}</div>
          {result.wcagCriteria && (
            <div className="flex items-center gap-1">
              <span>WCAG: {result.wcagCriteria.join(", ")}</span>
              {result.helpUrl && (
                <a
                  href={result.helpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-foreground">
                  <ExternalLink size={12} className="ml-1" aria-hidden="true" />
                  <span className="sr-only">
                    Learn more about this rule (opens in new window)
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
})

export default ResultItem
