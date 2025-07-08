import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getTestSuites,
  type EnhancedTestResult,
  type EnhancedTestSuite
} from "@/contents/tests/registry"
import { eventBus } from "@/lib/events/event-bus"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Play,
  Square,
  XCircle
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function Werkzeug() {
  const [testSuites, setTestSuites] = useState<EnhancedTestSuite[]>([])
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [lastRun, setLastRun] = useState<string>("")
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0
  })

  // Debouncing refs
  const eventTimeoutRef = useRef<NodeJS.Timeout | undefined>()
  const processedEventsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    loadTestSuites()

    // Listen for test results from content script with debouncing
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "TEST_ANALYSIS_COMPLETE") {
        const { testId, issues } = event.data

        // Debounce rapid events for the same test
        const eventKey = `${testId}-${event.timestamp}`
        if (processedEventsRef.current.has(eventKey)) {
          return
        }
        processedEventsRef.current.add(eventKey)

        // Clear old processed events (keep only last 10)
        if (processedEventsRef.current.size > 10) {
          const eventsArray = Array.from(processedEventsRef.current)
          processedEventsRef.current = new Set(eventsArray.slice(-5))
        }

        // Clear any existing timeout
        if (eventTimeoutRef.current) {
          clearTimeout(eventTimeoutRef.current)
        }

        // Debounce the update
        eventTimeoutRef.current = setTimeout(() => {
          console.log(
            `[werkzeug] Processing test results for ${testId}:`,
            issues
          )

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
        }, 300) // 300ms debounce
      }
    })

    return () => {
      unsubscribe()
      if (eventTimeoutRef.current) {
        clearTimeout(eventTimeoutRef.current)
      }
    }
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

    // Prevent multiple runs of the same test
    if (runningTests.has(suiteId)) {
      console.log(`[werkzeug] Test ${suiteId} already running, skipping`)
      return
    }

    // Clear progress bar when running individual tests
    setProgress({ current: 0, total: 0 })

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

      // Add timeout to prevent stuck running state
      setTimeout(() => {
        setRunningTests((prev) => {
          const newRunning = new Set(prev)
          if (newRunning.has(suiteId)) {
            console.log(
              `[werkzeug] Test ${suiteId} timed out, clearing running state`
            )
            newRunning.delete(suiteId)
          }
          return newRunning
        })
      }, 10000) // 10 second timeout
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

  const runAllTests = async () => {
    console.log("[werkzeug] Running all tests")

    // Clear any existing timeouts
    if (eventTimeoutRef.current) {
      clearTimeout(eventTimeoutRef.current)
    }

    // Reset all test statuses
    setTestSuites((prev) =>
      prev.map((suite) => ({ ...suite, status: "pending" as const }))
    )

    const allSuites = testSuites
    setProgress({ current: 0, total: allSuites.length })

    for (let i = 0; i < allSuites.length; i++) {
      const suite = allSuites[i]
      setProgress({ current: i, total: allSuites.length })
      await runSuite(suite.id)
      // Small delay between tests to prevent overwhelming
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setProgress({ current: allSuites.length, total: allSuites.length })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-emerald-500/20 border-emerald-500/30"
      case "fail":
        return "bg-red-500/20 border-red-500/30"
      case "running":
        return "bg-blue-500/20 border-blue-500/30"
      case "skip":
        return "bg-amber-500/20 border-amber-500/30"
      case "todo":
        return "bg-purple-500/20 border-purple-500/30"
      default:
        return "bg-gray-500/20 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string, isRunning: boolean = false) => {
    if (isRunning) {
      return (
        <div className="animate-spin w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full" />
      )
    }

    switch (status) {
      case "pass":
        return <CheckCircle className="w-3 h-3 text-emerald-400" />
      case "fail":
        return <XCircle className="w-3 h-3 text-red-400" />
      case "running":
        return (
          <div className="animate-spin w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full" />
        )
      case "skip":
        return <AlertCircle className="w-3 h-3 text-amber-400" />
      case "todo":
        return <Clock className="w-3 h-3 text-purple-400" />
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-500/50" />
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
        return "text-emerald-400"
      case "fail":
        return "text-red-400"
      case "running":
        return "text-blue-400 animate-pulse"
      case "skip":
        return "text-amber-400"
      case "todo":
        return "text-purple-400"
      default:
        return "text-gray-500"
    }
  }

  const getTotalStats = () => {
    const allTests = testSuites.flatMap((suite) => suite.tests)
    return {
      total: allTests.length,
      passed: allTests.filter((t) => t.status === "pass").length,
      failed: allTests.filter((t) => t.status === "fail").length,
      running: allTests.filter((t) => t.status === "running").length
    }
  }

  const stats = getTotalStats()
  const isAnyRunning = runningTests.size > 0

  return (
    <div className="p-3 space-y-3 text-sm">
      {/* Header with Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Tests</h1>
            {lastRun && (
              <p className="text-xs text-gray-500 transition-all duration-300">
                Last: {lastRun}
              </p>
            )}
          </div>
          <Button
            onClick={runAllTests}
            disabled={isAnyRunning}
            size="sm"
            className={cn(
              "h-7 px-3 transition-all duration-200 transform",
              isAnyRunning
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95",
              "text-white shadow-lg"
            )}>
            {isAnyRunning ? (
              <>
                <Square className="w-3 h-3 mr-1" aria-hidden="true" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" aria-hidden="true" />
                Run All
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar for Run All */}
        {progress.total > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                {progress.current === progress.total
                  ? "Tests completed"
                  : "Running tests..."}
              </span>
              <span>
                {progress.current}/{progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out"
                style={{
                  width: `${(progress.current / progress.total) * 100}%`
                }}
              />
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {stats.total > 0 && (
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-emerald-400">{stats.passed} passed</span>
            </div>
            {stats.failed > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-400">{stats.failed} failed</span>
              </div>
            )}
            {stats.running > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-400">{stats.running} running</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Test Suites */}
      <div className="space-y-2">
        {testSuites.map((suite, index) => {
          const isRunning = runningTests.has(suite.id)

          return (
            <div
              key={suite.id}
              className={cn(
                "border rounded-lg transition-all duration-300 transform",
                "hover:shadow-lg hover:shadow-black/20",
                getStatusColor(suite.status),
                isRunning && "animate-pulse"
              )}
              style={{
                animationDelay: `${index * 100}ms`
              }}>
              {/* Suite Header */}
              <div className="px-3 py-2 border-b border-gray-700/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(suite.status, isRunning)}
                  <span className="text-white font-medium text-sm transition-colors duration-200">
                    {suite.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs h-4 px-1 transition-all duration-200",
                      "bg-gray-700/50 text-gray-400 border-gray-600/50"
                    )}>
                    {suite.tests.length}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => runSuite(suite.id)}
                  disabled={isRunning}
                  className={cn(
                    "h-6 w-6 p-0 transition-all duration-200 transform",
                    "text-gray-400 hover:text-white hover:bg-gray-700/50",
                    "hover:scale-110 active:scale-95",
                    isRunning && "cursor-not-allowed opacity-50"
                  )}>
                  {isRunning ? (
                    <div className="animate-spin w-3 h-3 border border-gray-400 border-t-transparent rounded-full" />
                  ) : (
                    <Play className="w-3 h-3" aria-hidden="true" />
                  )}
                </Button>
              </div>

              {/* Tests List */}
              <div className="divide-y divide-gray-700/30">
                {suite.tests.map((test, testIndex) => (
                  <div
                    key={test.id}
                    className={cn(
                      "px-3 py-2 transition-all duration-200",
                      "hover:bg-gray-800/30 cursor-default"
                    )}
                    style={{
                      animationDelay: `${index * 100 + testIndex * 50}ms`
                    }}>
                    <div className="flex items-start justify-between">
                      {/* Test Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs text-gray-300 truncate transition-colors duration-200">
                            {test.name}
                          </span>
                          <span
                            className={cn(
                              "text-sm font-bold transition-all duration-300",
                              getResultColor(test.status)
                            )}>
                            {getResultText(test.status)}
                          </span>
                        </div>
                        {test.message && (
                          <div
                            className={cn(
                              "text-xs break-words whitespace-pre-wrap transition-all duration-300",
                              "animate-in slide-in-from-top-1 fade-in-0",
                              test.status === "fail"
                                ? "text-red-400"
                                : "text-amber-400"
                            )}>
                            {test.message}
                          </div>
                        )}

                        {/* WCAG Metadata */}
                        {(test.wcagLevel || test.guideline) && (
                          <div className="flex items-center space-x-2 mt-1 text-xs">
                            {test.wcagLevel && (
                              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">
                                WCAG {test.wcagLevel}
                              </span>
                            )}
                            {test.guideline && (
                              <span className="text-gray-500">
                                {test.guideline}
                              </span>
                            )}
                            {test.actRule && (
                              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-mono">
                                ACT {test.actRule}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {testSuites.length === 0 && (
        <div className="text-center py-8 text-gray-500 animate-in fade-in-0 duration-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Loading test suites...</p>
        </div>
      )}
    </div>
  )
}
