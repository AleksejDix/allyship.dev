import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { eventBus } from "@/lib/events/event-bus"
import { testRegistry } from "@/lib/testing/test-registry"
import { requestTestAnalysis } from "@/lib/testing/utils/event-utils"
import { Play } from "lucide-react"
import { useEffect, useState } from "react"

interface RegistryTest {
  id: string
  name: string
  description?: string
}

export function RegistryTestList() {
  const [tests, setTests] = useState<RegistryTest[]>([])
  const [activeTestId, setActiveTestId] = useState<string | null>(null)

  // Load tests from registry
  useEffect(() => {
    const allTests = testRegistry.getAllTests()

    // Convert to RegistryTest format
    const formattedTests = Object.entries(allTests).map(([id, test]) => ({
      id,
      name: test.name || id,
      description: test.description
    }))

    setTests(formattedTests)
  }, [])

  // Listen for test completion
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "TEST_ANALYSIS_COMPLETE") {
        setActiveTestId(null)
      }
    })
    return unsubscribe
  }, [])

  const runTest = async (testId: string) => {
    setActiveTestId(testId)

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) {
      setActiveTestId(null)
      return
    }

    requestTestAnalysis(testId)
  }

  // If no registry tests are available yet
  if (tests.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Custom Tests</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Run specialized tests from the registry to check for specific
          accessibility issues.
        </p>
      </div>

      <Separator />

      <div className="space-y-2">
        {tests.map((test) => (
          <div
            key={test.id}
            className="p-3 rounded-lg border bg-card hover:bg-card/80 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-medium">{test.name}</h3>
                {test.description && (
                  <p className="text-sm text-muted-foreground">
                    {test.description}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant={activeTestId === test.id ? "destructive" : "outline"}
                onClick={() => runTest(test.id)}
                disabled={activeTestId !== null && activeTestId !== test.id}
                className={activeTestId === test.id ? "animate-pulse" : ""}>
                {activeTestId === test.id ? (
                  <svg
                    className="h-4 w-4 mr-1 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Play className="h-3 w-3 mr-1" aria-hidden="true" />
                )}
                {activeTestId === test.id ? "Running..." : "Run Test"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
