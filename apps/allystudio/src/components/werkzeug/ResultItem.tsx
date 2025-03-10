import { Button } from "@/components/ui/button"
import { CodeBlock } from "@/components/ui/code-block"
import { eventBus } from "@/lib/events/event-bus"
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

// Replace custom severity color function with shadcn UI variables
// const getSeverityColorClass = (severity, outcome) => { ... }

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
  const isSerious =
    result.severity === "Critical" ||
    result.severity === "High" ||
    result.severity === "serious"

  // Function to handle selector click and scroll to element
  const handleSelectorClick = (selector: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log(`[ResultItem] Requesting focus on selector: ${selector}`)

    // First, clear any existing highlights in the focus layer
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        clear: true,
        layer: "focus",
        // These fields are required by the type but not used when clear is true
        selector: "",
        message: "",
        isValid: false
      }
    })

    // Small delay to ensure clear happens before adding new highlight
    setTimeout(() => {
      // Send multiple events with different approaches to maximize chances of success

      // 1. Send a direct HIGHLIGHT event with the selector
      eventBus.publish({
        type: "HIGHLIGHT",
        timestamp: Date.now(),
        data: {
          selector,
          message: `${result.message || "Selected element"} (clicked from results)`,
          isValid: false,
          layer: "focus",
          clear: false
        }
      })

      // 2. Ensure the focus layer is visible
      eventBus.publish({
        type: "LAYER_TOGGLE_REQUEST",
        timestamp: Date.now(),
        data: {
          layer: "focus",
          visible: true
        }
      })

      // 3. Send a navigation request (which now has enhanced element finding)
      eventBus.publish({
        type: "HEADING_NAVIGATE_REQUEST",
        timestamp: Date.now(),
        data: {
          xpath: selector
        }
      })

      // 4. Also try sending the message directly to the content script via chrome runtime
      try {
        chrome.runtime
          .sendMessage({
            type: "FIND_AND_SCROLL",
            selector,
            message: `${result.message || "Selected element"} (clicked from results)`
          })
          .catch((error) => {
            console.log(
              "[ResultItem] Chrome message sending failed, falling back to event bus",
              error
            )
          })
      } catch (error) {
        console.log(
          "[ResultItem] Chrome API not available, using event bus only"
        )
      }
    }, 50)
  }

  // Update icons with appropriate Tailwind colors
  const outcomeIcon = isPassed ? (
    <CheckCircle size={16} className="text-green-500" aria-hidden="true" />
  ) : (
    <AlertTriangle
      size={16}
      className={isSerious ? "text-red-500" : "text-amber-500"}
      aria-hidden="true"
    />
  )

  return (
    <div
      className={cn(
        isPassed
          ? "bg-muted/30 hover:bg-muted/50 border-green-500/20 dark:border-green-500/30"
          : isSerious
            ? "bg-muted/30 hover:bg-muted/50 border-red-500/30"
            : "bg-muted/30 hover:bg-muted/50 border-amber-500/30"
      )}>
      {/* Header section with main details */}
      <div
        className={cn(
          "p-3  cursor-pointer",
          "hover:bg-muted/60",
          isExpanded && "border-b border-border/30"
        )}
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">{outcomeIcon}</div>

            <div className="flex items-start gap-2">
              {result.impact && (
                <div
                  className={cn(
                    "text-xs px-2 py-1 rounded-full bg-muted text-foreground/80",
                    isSerious ? "border border-red-500/30" : "border-muted/50"
                  )}>
                  {result.impact}
                </div>
              )}
              {result.severity && result.severity !== "unknown" && (
                <div
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    result.severity === "Critical"
                      ? "bg-red-500/80 text-white border border-red-500/40"
                      : result.severity === "High" ||
                          result.severity === "serious"
                        ? "bg-red-500/70 text-white border border-red-500/40"
                        : result.severity === "Medium" ||
                            result.severity === "moderate"
                          ? "bg-amber-500/70 text-amber-50 dark:text-amber-950 border border-amber-500/40"
                          : "bg-muted text-muted-foreground border border-border"
                  )}>
                  {result.severity}
                </div>
              )}
            </div>
          </div>

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
        <div className="text-sm mt-1 text-foreground break-words overflow-hidden font-medium">
          {result.message || "Issue detected"}
        </div>
      </div>

      {/* Expanded details section */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-sm bg-transparent dark:bg-background/20">
          {/* Rule information */}
          {(ruleId || ruleName) && (
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Rule
              </div>
              <div className="bg-muted/80 dark:bg-muted/20 p-3 rounded-md border border-border/50">
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
                    className="bg-blue-500/20 text-blue-600 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium border border-blue-500/30">
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
                <div
                  onClick={handleSelectorClick(result.element.selector)}
                  className="cursor-pointer group">
                  <CodeBlock
                    code={result.element.selector}
                    label="Selector"
                    maxHeight="auto"
                    className="mt-2 bg-muted/40 dark:bg-muted/10 hover:bg-blue-500/5 transition-colors"
                  />
                  <div className="flex items-center gap-1 text-xs text-blue-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Click selector to locate element on page</span>
                  </div>
                </div>
              )}

              {result.element.html && (
                <div className="mt-2">
                  <CodeBlock
                    code={result.element.html}
                    label="HTML"
                    maxHeight="200px"
                    className="bg-muted/40 dark:bg-muted/10"
                  />
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
                    ? "bg-green-500/5 dark:bg-green-500/10 border-green-500/20 text-foreground"
                    : isSerious
                      ? "bg-red-500/5 dark:bg-red-500/10 border-red-500/20 text-foreground"
                      : "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 text-foreground"
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
                className="text-xs w-full bg-background/60 dark:bg-muted/10 border-border/50"
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
