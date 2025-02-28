import { Button } from "@/components/ui/button"
import { memo } from "react"

import ResultItem from "./ResultItem"
import ResultsLoadingPlaceholder from "./ResultsLoadingPlaceholder"
import { useTestContext } from "./TestContext"

// Test Results Component
const TestResults = memo(function TestResults() {
  const { testResults, activeTest, clearResults } = useTestContext()

  if (testResults.length === 0 && !activeTest) return null

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

      {/* Display results in a dense list format or loading placeholder */}
      <div className="border rounded overflow-hidden">
        {testResults.length > 0 ? (
          testResults.map((result, index) => (
            <ResultItem key={index} result={result} />
          ))
        ) : activeTest ? (
          <ResultsLoadingPlaceholder />
        ) : null}
      </div>
    </div>
  )
})

export default TestResults
