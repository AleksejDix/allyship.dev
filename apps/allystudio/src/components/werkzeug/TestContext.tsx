import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import { createContext, useContext } from "react"

// Context for test state management
export interface TestContextType {
  activeTest: TestType | null
  testResults: any[]
  isRunning: boolean
  runTest: (type: TestType) => void
  stopTest: () => void
  clearResults: () => void
}

export const TestContext = createContext<TestContextType | null>(null)

export function useTestContext() {
  const context = useContext(TestContext)
  if (!context) {
    throw new Error("useTestContext must be used within a TestProvider")
  }
  return context
}
