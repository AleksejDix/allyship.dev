// Helper function to get severity color class based on result severity and outcome
export const getSeverityColorClass = (
  severity: string,
  outcome: string
): string => {
  if (outcome === "passed") return "bg-success"

  const normalizedSeverity = severity?.toLowerCase() || ""
  if (normalizedSeverity.includes("critical")) return "bg-destructive"
  if (normalizedSeverity.includes("high")) return "bg-destructive"
  if (
    normalizedSeverity.includes("medium") ||
    normalizedSeverity.includes("serious")
  )
    return "bg-warning"
  if (
    normalizedSeverity.includes("low") ||
    normalizedSeverity.includes("minor")
  )
    return "bg-muted"

  return "bg-muted"
}
