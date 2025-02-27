import type { ACTSuite } from "./act-test-suite"
import { TEST_CONFIGS } from "./test-config"

/**
 * Interface for a registered test in the system
 */
export interface RegisteredTest {
  id: string
  name: string
  suite: ACTSuite
  description?: string
}

/**
 * A registry that centralizes test management
 */
class TestRegistry {
  private tests: Map<string, RegisteredTest> = new Map()

  constructor() {
    // Initialize with existing tests from TEST_CONFIGS
    Object.entries(TEST_CONFIGS).forEach(([key, config]) => {
      this.tests.set(key, {
        id: key,
        name: config.displayName,
        suite: config.suite,
        description: `Tests ${config.statsText.itemName} for accessibility issues`
      })
    })
  }

  /**
   * Get a test by its ID
   */
  getTest(id: string): RegisteredTest | undefined {
    return this.tests.get(id)
  }

  /**
   * Get all registered tests
   */
  getAllTests(): RegisteredTest[] {
    return Array.from(this.tests.values())
  }

  /**
   * Register a new test
   */
  registerTest(test: RegisteredTest): void {
    this.tests.set(test.id, test)
  }

  /**
   * Remove a test from the registry
   */
  unregisterTest(id: string): boolean {
    return this.tests.delete(id)
  }
}

// Export a singleton instance
export const testRegistry = new TestRegistry()
