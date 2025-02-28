import { eventBus } from "@/lib/events/event-bus"
import type { EventType } from "@/lib/events/types"

import { actRuleRunner } from "./act-rule-runner"
import { ACTRuleCategory, actRulesRegistry } from "./act-rules-registry"
import type { TestConfig } from "./test-config"
// Import all rule implementations
// This will register them with the registry
import "./rules/button-accessible-name"
import "./rules/image-accessible-name"
import "./rules/language-of-page"

// Import our new link rules and heading rules
import { registerAllRules } from "./rules"
// First, make sure we import publishTestComplete if it's not already imported
import { publishTestComplete } from "./utils/event-utils"

// Add more rule imports here as they are implemented

// Initialize all rules
registerAllRules()

// Define the event type constant
export const TEST_ANALYSIS_COMPLETE: EventType = "TEST_ANALYSIS_COMPLETE"

/**
 * Helper function to publish events
 */
function publishEvent(type: EventType, data: any) {
  eventBus.publish({
    type,
    timestamp: Date.now(),
    data
  })
}

/**
 * Map of test types to ACT rule categories
 */
const testTypeToRuleCategory: Record<string, ACTRuleCategory[]> = {
  headings: [ACTRuleCategory.HEADINGS, ACTRuleCategory.STRUCTURE],
  links: [ACTRuleCategory.LINKS],
  alt: [ACTRuleCategory.IMAGES],
  interactive: [ACTRuleCategory.FORMS, ACTRuleCategory.ARIA],
  buttons: [ACTRuleCategory.FORMS, ACTRuleCategory.ARIA],
  forms: [ACTRuleCategory.FORMS],
  landmarks: [ACTRuleCategory.LANDMARKS],
  aria: [ACTRuleCategory.ARIA],
  color: [ACTRuleCategory.COLOR, ACTRuleCategory.CONTRAST],
  tables: [ACTRuleCategory.TABLES],
  language: [ACTRuleCategory.LANGUAGE],
  structure: [ACTRuleCategory.STRUCTURE],
  focus: [ACTRuleCategory.FOCUS]
}

/**
 * Run ACT rules for a specific test type
 */
export async function runACTRulesForTestType(
  testType: string,
  config: TestConfig
): Promise<void> {
  console.log(`[act-integration] Running ACT rules for test type: ${testType}`)

  // Clear previous results
  actRuleRunner.clearResults()

  // Clear previous highlights for this test type
  publishEvent("HIGHLIGHT", {
    clear: true,
    layer: config.layerName
  })

  // Get the categories for this test type
  const categories = getCategoriesForTestType(testType)
  console.log(`[act-integration] Categories for ${testType}:`, categories)

  // Run all rules for each category
  for (const category of categories) {
    const rules = actRulesRegistry.getRulesByCategory(category)
    console.log(
      `[act-integration] Found ${rules.length} rules for category: ${category}`
    )

    // Log rule information
    rules.forEach((rule) => {
      console.log(
        `[act-integration] Rule ID: ${rule.metadata.id}, Category: ${category}`
      )
    })

    // Run rules for this category
    await actRuleRunner.runRulesByCategory(category)
  }

  // Get the results
  const results = actRuleRunner.getResults()
  console.log(
    `[act-integration] Got ${results.length} results from rule runner`
  )

  // Generate highlight events for failed results
  results.forEach((result) => {
    console.log(
      `[act-integration] Processing result for rule: ${result.rule.id}, outcome: ${result.outcome}, layer: ${config.layerName}`
    )

    // Special debug for ARIA tests
    if (config.layerName === "aria") {
      console.log(
        `[ARIA DEBUG] Processing result for rule: ${result.rule.id}`,
        {
          outcome: result.outcome,
          hasSelector: !!result.element?.selector,
          selector: result.element?.selector,
          message: result.message
        }
      )
    }

    if (result.outcome === "failed" && result.element?.selector) {
      console.log(
        `[act-integration] Creating highlight for failed result: ${result.element.selector}`
      )

      // Special debug for ARIA tests
      if (config.layerName === "aria") {
        console.log(
          `[ARIA DEBUG] Creating highlight event for selector: ${result.element.selector}`
        )
      }

      publishEvent("HIGHLIGHT", {
        selector: result.element.selector,
        message: result.message,
        isValid: false,
        layer: config.layerName,
        styles: {
          border: "#ef4444", // Red border for failed elements
          background: "rgba(239, 68, 68, 0.1)", // Light red background
          messageBackground: "#ef4444"
        }
      })
    }
  })

  // Log each result outcome
  results.forEach((result, index) => {
    console.log(
      `[act-integration] Result ${index + 1}: Rule: ${result.rule.id}, Outcome: ${result.outcome}`
    )
  })

  const report = actRuleRunner.logResults()
  console.log(
    `[act-integration] Test ${testType} completed with ${report.results.length} results`
  )
  console.log(
    `[act-integration] Summary: Total: ${report.summary.rules.total}, Passed: ${report.summary.rules.passed}, Failed: ${report.summary.rules.failed}`
  )

  // Publish test completion
  publishEvent(TEST_ANALYSIS_COMPLETE, {
    testId: testType,
    results: {
      summary: report.summary,
      details: report.results
    },
    timestamp: new Date().toISOString(),
    url: window.location.href
  })
}

// Let's also check the mapping from test types to categories to make sure headings is properly mapped
function getCategoriesForTestType(testType: string): ACTRuleCategory[] {
  // Find the section that maps test types to categories and add logging
  console.log(
    `[act-integration] Looking up categories for test type: ${testType}`
  )

  const categories = testTypeToRuleCategory[testType] || []

  // If it's a headings test but no categories found, something is wrong
  if (testType === "headings" && categories.length === 0) {
    console.warn(
      `[act-integration] WARNING: No categories found for headings test!`
    )
    // Force headings test to use structure category if not mapped
    return [ACTRuleCategory.STRUCTURE]
  }

  return categories
}

/**
 * Run ACT rules for WCAG criteria
 */
export async function runACTRulesForWCAGCriteria(
  criteria: string,
  config: TestConfig
): Promise<void> {
  // Clear previous results
  actRuleRunner.clearResults()

  // Run rules for the criteria
  await actRuleRunner.runRulesByWCAGCriteria(criteria)

  // Get the results
  const report = actRuleRunner.logResults()

  // Publish the test completion event
  publishEvent(TEST_ANALYSIS_COMPLETE, {
    testType: `wcag-${criteria}`,
    results: {
      summary: report.summary,
      details: report.results
    },
    timestamp: new Date().toISOString(),
    url: window.location.href
  })
}

/**
 * Run all applicable ACT rules
 */
export async function runAllACTRules(config: TestConfig): Promise<void> {
  // Clear previous results
  actRuleRunner.clearResults()

  // Run all applicable rules
  await actRuleRunner.runAllApplicableRules()

  // Get the results
  const report = actRuleRunner.logResults()

  // Publish the test completion event
  publishEvent(TEST_ANALYSIS_COMPLETE, {
    testType: "all-act-rules",
    results: {
      summary: report.summary,
      details: report.results
    },
    timestamp: new Date().toISOString(),
    url: window.location.href
  })
}

/**
 * Get all registered ACT rules
 */
export function getAllACTRules() {
  return actRulesRegistry.getAllRules()
}

/**
 * Get ACT rules by category
 */
export function getACTRulesByCategory(category: string) {
  return actRulesRegistry.getRulesByCategory(category)
}

/**
 * Get ACT rules by WCAG criteria
 */
export function getACTRulesByWCAGCriteria(criteria: string) {
  return actRulesRegistry.getRulesByWCAGCriteria(criteria)
}
