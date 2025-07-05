import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getTestSuites,
  type EnhancedTestResult,
  type EnhancedTestSuite
} from "@/contents/tests/registry"
import { eventBus } from "@/lib/events/event-bus"
import { cn } from "@/lib/utils"
import { Play, Square } from "lucide-react"
import { useEffect, useState } from "react"

export default function Werkzeug() {
  const [testSuites, setTestSuites] = useState<EnhancedTestSuite[]>([])
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [lastRun, setLastRun] = useState<string>("")

  useEffect(() => {
    loadTestSuites()

    // Listen for test results from content script
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "TEST_ANALYSIS_COMPLETE") {
        const { testId, issues } = event.data
        console.log(`[werkzeug] Received test results for ${testId}:`, issues)

        // Ensure issues is an array
        const issuesList = issues || []

        // Update test suite with results
        setTestSuites((prev) =>
          prev.map((suite) =>
            suite.id === testId
              ? {
                  ...suite,
                  status: issuesList.length > 0 ? "fail" : "pass",
                  tests: suite.tests.map((test) => {
                    // For now, mark all tests in the suite as having the same status
                    // In the future, we could match individual test results
                    return {
                      ...test,
                      status: issuesList.length > 0 ? "fail" : "pass",
                      message:
                        issuesList.length > 0
                          ? issuesList[0]?.message || "Test failed"
                          : undefined
                    }
                  })
                }
              : suite
          )
        )

        // Stop running indicator
        setRunningTests((prev) => {
          const newRunning = new Set(prev)
          newRunning.delete(testId as string)
          return newRunning
        })

        setLastRun(new Date().toLocaleTimeString())
      }
    })

    return () => unsubscribe()
  }, [])

  const loadTestSuites = async () => {
    try {
      const suites = await getTestSuites()
      setTestSuites(suites)
    } catch (error) {
      console.error("Failed to load test suites:", error)
    }
  }

  const runSuite = async (suiteId: string) => {
    console.log(`[werkzeug] Running test suite: ${suiteId}`)

    // Mark as running
    setRunningTests((prev) => new Set(prev).add(suiteId))

    // Update suite status to running
    setTestSuites((prev) =>
      prev.map((suite) =>
        suite.id === suiteId ? { ...suite, status: "running" } : suite
      )
    )

    try {
      // Send request to content script to run tests
      eventBus.publish({
        type: "TEST_ANALYSIS_REQUEST",
        timestamp: Date.now(),
        data: {
          testId: suiteId
        }
      })

      console.log(`[werkzeug] Sent test request for ${suiteId}`)
    } catch (error) {
      console.error(`Failed to request test suite ${suiteId}:`, error)
      setTestSuites((prev) =>
        prev.map((suite) =>
          suite.id === suiteId ? { ...suite, status: "fail" } : suite
        )
      )

      // Stop running indicator on error
      setRunningTests((prev) => {
        const newRunning = new Set(prev)
        newRunning.delete(suiteId)
        return newRunning
      })
    }
  }

  const runAllSuites = async () => {
    for (const suite of testSuites) {
      await runSuite(suite.id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-500"
      case "fail":
        return "bg-red-500"
      case "running":
        return "bg-blue-500"
      case "skip":
        return "bg-gray-500"
      case "todo":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return (
          <div className="animate-spin w-2 h-2 border border-white border-t-transparent rounded-full" />
        )
      case "pass":
        return "✓"
      case "fail":
        return "✗"
      case "skip":
        return "⏭"
      case "todo":
        return "⏰"
      default:
        return "○"
    }
  }

  const getResultText = (status: string) => {
    switch (status) {
      case "pass":
        return "✓"
      case "fail":
        return "✗"
      case "running":
        return "..."
      case "skip":
        return "⏭"
      case "todo":
        return "⏰"
      default:
        return "○"
    }
  }

  const getResultColor = (status: string) => {
    switch (status) {
      case "pass":
        return "text-green-400"
      case "fail":
        return "text-red-400"
      case "running":
        return "text-blue-400"
      case "skip":
        return "text-gray-400"
      case "todo":
        return "text-yellow-400"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="p-3 space-y-3 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Tests</h1>
          {lastRun && <p className="text-xs text-gray-500">Last: {lastRun}</p>}
        </div>
        <Button
          onClick={runAllSuites}
          disabled={runningTests.size > 0}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-3">
          <Play className="w-3 h-3 mr-1" aria-hidden="true" />
          Run All
        </Button>
      </div>

      {/* Test Suites */}
      <div className="space-y-2">
        {testSuites.map((suite) => (
          <div
            key={suite.id}
            className="bg-gray-800/30 border border-gray-700/50 rounded">
            {/* Suite Header */}
            <div className="px-3 py-2 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    getStatusColor(suite.status)
                  )}
                />
                <span className="text-white font-medium text-sm">
                  {suite.name}
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gray-700/50 text-gray-400 text-xs h-4 px-1">
                  {suite.tests.length}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => runSuite(suite.id)}
                disabled={runningTests.has(suite.id)}
                className="text-gray-400 hover:text-white h-6 w-6 p-0">
                {runningTests.has(suite.id) ? (
                  <Square className="w-3 h-3" aria-hidden="true" />
                ) : (
                  <Play className="w-3 h-3" aria-hidden="true" />
                )}
              </Button>
            </div>

            {/* Tests List */}
            <div>
              {suite.tests.map((test) => (
                <div
                  key={test.id}
                  className="px-3 py-2 border-b border-gray-700/30 last:border-b-0 hover:bg-gray-800/20">
                  <div className="flex items-start justify-between">
                    {/* Test Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs text-gray-300 truncate">
                          {test.name}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-bold",
                            getResultColor(test.status)
                          )}>
                          {getResultText(test.status)}
                        </span>
                      </div>
                      {test.message && (
                        <p className="text-xs text-red-400 break-words whitespace-pre-wrap">
                          {test.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {testSuites.length === 0 && (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">No tests available</p>
          <Button
            onClick={loadTestSuites}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 mt-2 h-7">
            Reload
          </Button>
        </div>
      )}
    </div>
  )
}
