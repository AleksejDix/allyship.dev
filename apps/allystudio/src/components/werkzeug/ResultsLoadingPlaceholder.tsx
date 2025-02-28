import { memo } from "react"

// Loading Placeholder for Results
const ResultsLoadingPlaceholder = memo(function ResultsLoadingPlaceholder() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`loading-${index}`}
          className="flex items-center justify-between p-3 border-b last:border-b-0 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>
          <div className="h-6 w-16 bg-muted rounded-full" />
        </div>
      ))}
    </>
  )
})

export default ResultsLoadingPlaceholder
