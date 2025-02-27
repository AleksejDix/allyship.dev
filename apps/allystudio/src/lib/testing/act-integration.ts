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

// Import our new link rules
import { registerAllRules } from "./rules"

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
  headings: [ACTRuleCategory.HEADINGS],
  landmarks: [ACTRuleCategory.LANDMARKS],
  links: [ACTRuleCategory.LINKS],
  images: [ACTRuleCategory.IMAGES],
  alt: [ACTRuleCategory.IMAGES],
  forms: [ACTRuleCategory.FORMS],
  buttons: [ACTRuleCategory.FORMS, ACTRuleCategory.ARIA],
  interactive: [ACTRuleCategory.FORMS, ACTRuleCategory.ARIA],
  keyboard: [ACTRuleCategory.KEYBOARD, ACTRuleCategory.FOCUS],
  aria: [ACTRuleCategory.ARIA],
  color: [ACTRuleCategory.COLOR, ACTRuleCategory.CONTRAST],
  tables: [ACTRuleCategory.TABLES],
  language: [ACTRuleCategory.LANGUAGE],
  structure: [ACTRuleCategory.STRUCTURE]
}

/**
 * Run ACT rules for a specific test type
 */
export async function runACTRulesForTestType(
  testType: string,
  config: TestConfig
): Promise<void> {
  // Clear previous results
  actRuleRunner.clearResults()

  // Get categories for the test type
  const categories = testTypeToRuleCategory[testType] || []

  // Run rules for each category
  for (const category of categories) {
    await actRuleRunner.runRulesByCategory(category)
  }

  // Get the results
  const report = actRuleRunner.logResults()

  // Publish the test completion event
  publishEvent(TEST_ANALYSIS_COMPLETE, {
    testType,
    results: {
      summary: report.summary,
      details: report.results
    },
    timestamp: new Date().toISOString(),
    url: window.location.href
  })
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
