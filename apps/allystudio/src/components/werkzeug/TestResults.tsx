import { Button } from "@/components/ui/button"
import { memo } from "react"

import ResultItem from "./ResultItem"
import ResultsLoadingPlaceholder from "./ResultsLoadingPlaceholder"
import { useTestContext } from "./TestContext"

// Helper function to get severity priority (higher number = higher priority)
const getSeverityPriority = (result: any) => {
  // First check if it passed (lowest priority)
  if (result.outcome === "passed") return 0

  // Then prioritize by severity
  switch (result.severity) {
    case "Critical":
      return 5
    case "High":
    case "serious":
      return 4
    case "Medium":
    case "moderate":
      return 3
    case "Low":
      return 2
    default:
      return 1 // Info or unknown severity
  }
}

// Helper function to get a result's category
const getResultCategory = (result: any) => {
  if (result.outcome === "passed") return "Passed"

  switch (result.severity) {
    case "Critical":
      return "Critical"
    case "High":
    case "serious":
      return "Serious"
    case "Medium":
    case "moderate":
      return "Moderate"
    case "Low":
      return "Minor"
    default:
      return "Other"
  }
}

// Test Results Component
const TestResults = memo(function TestResults() {
  const { testResults, activeTest, clearResults } = useTestContext()

  if (testResults.length === 0 && !activeTest) return null

  // Sort results by severity (most important first)
  const sortedResults = [...testResults].sort(
    (a, b) => getSeverityPriority(b) - getSeverityPriority(a)
  )

  // Group results by category
  const groupedResults = sortedResults.reduce(
    (acc, result) => {
      const category = getResultCategory(result)
      if (!acc[category]) acc[category] = []
      acc[category].push(result)
      return acc
    },
    {} as Record<string, any[]>
  )

  // Define the order in which categories should appear
  const categoryOrder = [
    "Critical",
    "Serious",
    "Moderate",
    "Minor",
    "Other",
    "Passed"
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Analysis Results</h2>
        {testResults.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearResults}
            className="text-xs">
            Clear results
          </Button>
        )}
      </div>

      {/* Display results grouped by category */}
      <div className="space-y-6">
        {testResults.length > 0 ? (
          <>
            {categoryOrder.map((category) =>
              groupedResults[category] &&
              groupedResults[category].length > 0 ? (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-medium ${
                        category === "Critical"
                          ? "text-red-500"
                          : category === "Serious"
                            ? "text-red-400"
                            : category === "Moderate"
                              ? "text-amber-400"
                              : category === "Passed"
                                ? "text-green-400"
                                : "text-muted-foreground"
                      }`}>
                      {category} Issues ({groupedResults[category].length})
                    </h3>
                    <div className="h-px flex-1 bg-border/30 mx-3"></div>
                  </div>
                  <div>
                    {groupedResults[category].map(
                      (result: any, index: number) => (
                        <ResultItem
                          key={`${category}-${index}`}
                          result={result}
                        />
                      )
                    )}
                  </div>
                </div>
              ) : null
            )}
          </>
        ) : activeTest ? (
          <ResultsLoadingPlaceholder />
        ) : null}
      </div>
    </div>
  )
})

export default TestResults
