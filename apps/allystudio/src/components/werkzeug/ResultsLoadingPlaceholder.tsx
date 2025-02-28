import { Progress } from "@/components/ui/progress"
import { memo, useEffect, useState } from "react"

// Loading Placeholder with animated Progress bar only
const ResultsLoadingPlaceholder = memo(function ResultsLoadingPlaceholder() {
  const [progress, setProgress] = useState(0)

  // Animate progress value
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((oldProgress) => {
        // Reset to 0 when reaching 100
        if (oldProgress >= 100) return 0
        // Otherwise increase by random amount between 5-15
        return Math.min(oldProgress + Math.random() * 10 + 5, 100)
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Analyzing accessibility issues...</span>
        <span className="text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2 w-full" />
    </div>
  )
})

export default ResultsLoadingPlaceholder
