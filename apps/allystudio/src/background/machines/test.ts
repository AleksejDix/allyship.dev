import { assign, setup } from "xstate"

export interface TestResult {
  id: string
  type: string
  severity: "Critical" | "Warning"
  message: string
  element?: {
    xpath: string
    textContent?: string
  }
}

export type TestContext = {
  activeTests: Set<string>
  results: TestResult[]
  error: Error | null
}

type TestEvent =
  | { type: "TEST_ENABLED"; test: string }
  | { type: "TEST_DISABLED"; test: string }
  | { type: "RESULTS_RECEIVED"; results: TestResult[] }
  | { type: "error"; error: Error }

export const testMachine = setup({
  types: {} as {
    context: TestContext
    events: TestEvent
  },
  actions: {
    enableTest: assign({
      activeTests: ({ context, event }) => {
        if (event.type !== "TEST_ENABLED") return context.activeTests
        const newTests = new Set(context.activeTests)
        newTests.add(event.test)
        return newTests
      }
    }),
    disableTest: assign({
      activeTests: ({ context, event }) => {
        if (event.type !== "TEST_DISABLED") return context.activeTests
        const newTests = new Set(context.activeTests)
        newTests.delete(event.test)
        return newTests
      }
    }),
    updateResults: assign({
      results: ({ event }) =>
        event.type === "RESULTS_RECEIVED" ? event.results : []
    }),
    assignError: assign({
      error: ({ event }) => (event.type === "error" ? event.error : null)
    }),
    clearError: assign({
      error: null
    }),
    clearResults: assign({
      results: []
    })
  }
}).createMachine({
  id: "testMachine",
  initial: "idle",
  context: {
    activeTests: new Set<string>(),
    results: [],
    error: null
  },
  states: {
    idle: {
      on: {
        TEST_ENABLED: {
          target: "running",
          actions: ["enableTest", "clearError", "clearResults"]
        }
      }
    },
    running: {
      on: {
        TEST_ENABLED: {
          actions: ["enableTest", "clearError"]
        },
        TEST_DISABLED: [
          {
            guard: ({ context, event }) => {
              const newTests = new Set(context.activeTests)
              newTests.delete(event.test)
              return newTests.size === 0
            },
            target: "idle",
            actions: ["disableTest", "clearResults"]
          },
          {
            actions: "disableTest"
          }
        ],
        RESULTS_RECEIVED: {
          actions: "updateResults"
        },
        error: {
          target: "idle",
          actions: ["assignError", "clearResults"]
        }
      }
    }
  }
})
