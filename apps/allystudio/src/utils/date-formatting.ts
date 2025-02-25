export function formatDate(date: string | Date | null): string {
  if (!date) return "N/A"

  // Create a Date object if string is passed
  const dateObj = typeof date === "string" ? new Date(date) : date

  // Use consistent formatting options
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(dateObj)
}
