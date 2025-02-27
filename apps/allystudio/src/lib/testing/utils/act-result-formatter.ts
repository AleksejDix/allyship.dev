import { getAccessibleName } from "../act-test-runner"
import type {
  ACTOutcome,
  ACTRuleResult,
  ACTSeverity,
  ACTTestReport,
  ACTTestSummary
} from "../act-types"

/**
 * Maps our internal severity levels to ACT severity levels
 */
function mapSeverity(severity: string): ACTSeverity {
  const severityMap: Record<string, ACTSeverity> = {
    Critical: "critical",
    High: "serious",
    Medium: "moderate",
    Low: "minor"
  }

  return severityMap[severity] || "moderate"
}

/**
 * Creates an element representation for the ACT result
 */
function createElementRepresentation(
  element: HTMLElement,
  selector: string
): ACTRuleResult["element"] {
  // Get a simplified HTML representation (just the opening tag with attributes)
  const openingTag = element.outerHTML.split(">")[0] + ">"

  // Get key attributes
  const attributes: Record<string, string> = {}
  for (const attr of element.attributes) {
    attributes[attr.name] = attr.value
  }

  // Create XPath if needed
  let xpath = ""
  if (element.id) {
    xpath = `//*[@id="${element.id}"]`
  }

  return {
    selector,
    html: openingTag,
    xpath,
    attributes
  }
}

/**
 * Formats a single test result according to ACT Rules standard
 */
export function formatACTResult(
  ruleId: string,
  ruleName: string,
  element: HTMLElement | null,
  selector: string,
  passed: boolean,
  message: string,
  severity: string,
  wcagCriteria?: string[],
  helpUrl?: string
): ACTRuleResult {
  const outcome: ACTOutcome = passed ? "passed" : "failed"

  const result: ACTRuleResult = {
    rule: {
      id: ruleId,
      name: ruleName
    },
    outcome,
    message,
    impact: passed ? undefined : mapSeverity(severity),
    wcagCriteria,
    helpUrl
  }

  // Add element details if available
  if (element) {
    result.element = createElementRepresentation(element, selector)
  }

  // Add remediation suggestion for failures
  if (!passed) {
    // Generate a basic remediation suggestion based on the rule and element
    result.remediation = generateRemediation(ruleId, element, message)
  }

  return result
}

/**
 * Generates a remediation suggestion based on the rule and element
 */
function generateRemediation(
  ruleId: string,
  element: HTMLElement | null,
  message: string
): string {
  if (!element) return "Review the issue and implement appropriate fixes."

  // Generate specific remediation based on rule ID
  switch (ruleId) {
    case "button-has-accessible-name":
      return `Add text content, aria-label, or aria-labelledby to the ${element.tagName.toLowerCase()} element.`

    case "image-has-accessible-name":
      return `Add an alt attribute with descriptive text to the ${element.tagName.toLowerCase()} element.`

    case "link-has-accessible-name":
      return `Add descriptive text content to the link or use aria-label/aria-labelledby.`

    case "form-field-has-accessible-name":
      return `Associate a label with this form field using a <label> element, aria-label, or aria-labelledby.`

    default:
      // Extract suggestion from message if possible
      const suggestionMatch = message.match(
        /should have|should be|missing|requires|needs/i
      )
      if (suggestionMatch) {
        return `Fix the issue: ${message}`
      }
      return "Review the issue and implement appropriate fixes."
  }
}

/**
 * Creates a summary of test results
 */
export function createACTTestSummary(results: ACTRuleResult[]): ACTTestSummary {
  // Count results by outcome
  const ruleOutcomes = new Map<string, ACTOutcome>()
  const elementOutcomes = new Map<string, boolean>()
  const wcagViolations = new Set<string>()

  console.log(`[createACTTestSummary] Processing ${results.length} results`)

  // First pass: Initialize all rules as passed
  const uniqueRuleIds = new Set<string>()
  results.forEach((result) => {
    uniqueRuleIds.add(result.rule.id)
    // Set initial state as passed
    if (!ruleOutcomes.has(result.rule.id)) {
      ruleOutcomes.set(result.rule.id, "passed")
    }
  })

  // Second pass: Any failure for a rule makes the entire rule failed
  for (const result of results) {
    // If this result failed, mark the rule as failed
    // A rule is only passed if ALL instances pass
    if (result.outcome === "failed") {
      console.log(
        `[createACTTestSummary] Marking rule ${result.rule.id} as failed`
      )
      ruleOutcomes.set(result.rule.id, "failed")
    }

    // Track element outcomes (using selector as key)
    if (result.element) {
      elementOutcomes.set(
        result.element.selector,
        result.outcome === "passed" &&
          elementOutcomes.get(result.element.selector) !== false
      )
    }

    // Track WCAG violations
    if (result.outcome === "failed" && result.wcagCriteria) {
      console.log(
        `[createACTTestSummary] Found WCAG violation for criteria: ${result.wcagCriteria.join(", ")}`
      )
      for (const criteria of result.wcagCriteria) {
        wcagViolations.add(criteria)
      }
    }
  }

  // Log counts for debugging
  const passedCount = Array.from(ruleOutcomes.values()).filter(
    (o) => o === "passed"
  ).length
  const failedCount = Array.from(ruleOutcomes.values()).filter(
    (o) => o === "failed"
  ).length

  console.log(
    `[createACTTestSummary] Rule outcome counts - Total: ${ruleOutcomes.size}, Passed: ${passedCount}, Failed: ${failedCount}`
  )
  console.log(
    `[createACTTestSummary] All rule outcomes:`,
    Array.from(ruleOutcomes.entries())
  )

  // Determine WCAG compliance
  const hasLevelAViolation = Array.from(wcagViolations).some(
    (criteria) =>
      criteria.includes(":1.") ||
      criteria.includes(":2.") ||
      criteria.includes(":3.") ||
      criteria.includes(":4.")
  )

  const hasLevelAAViolation = Array.from(wcagViolations).some(
    (criteria) =>
      criteria.includes(".1.") ||
      criteria.includes(".2.") ||
      criteria.includes(".3.") ||
      criteria.includes(".4.")
  )

  const hasLevelAAAViolation = Array.from(wcagViolations).some(
    (criteria) =>
      criteria.includes(".1.") ||
      criteria.includes(".2.") ||
      criteria.includes(".3.") ||
      criteria.includes(".4.")
  )

  return {
    url: window.location.href,
    timestamp: new Date().toISOString(),
    rules: {
      total: ruleOutcomes.size,
      passed: Array.from(ruleOutcomes.values()).filter((o) => o === "passed")
        .length,
      failed: Array.from(ruleOutcomes.values()).filter((o) => o === "failed")
        .length,
      inapplicable: Array.from(ruleOutcomes.values()).filter(
        (o) => o === "inapplicable"
      ).length,
      cantTell: Array.from(ruleOutcomes.values()).filter(
        (o) => o === "cantTell"
      ).length
    },
    elements: {
      total: elementOutcomes.size,
      passed: Array.from(elementOutcomes.values()).filter(Boolean).length,
      failed: Array.from(elementOutcomes.values()).filter((v) => !v).length
    },
    wcagCompliance: {
      A: !hasLevelAViolation,
      AA: !hasLevelAViolation && !hasLevelAAViolation,
      AAA: !hasLevelAViolation && !hasLevelAAViolation && !hasLevelAAAViolation
    }
  }
}

/**
 * Creates a complete ACT test report
 */
export function createACTTestReport(results: ACTRuleResult[]): ACTTestReport {
  return {
    summary: createACTTestSummary(results),
    results,
    metadata: {
      toolName: "AllyStudio",
      toolVersion: "1.0.0" // Should be dynamically determined
    }
  }
}

/**
 * Formats console output for ACT test results
 */
export function logACTResults(report: ACTTestReport): void {
  const { summary, results } = report

  // Log summary
  console.group(
    "%c📊 ACT Test Results Summary",
    "font-weight: bold; font-size: 16px;"
  )
  console.log(
    `%cTested URL:%c ${summary.url}`,
    "font-weight: bold;",
    "font-weight: normal;"
  )
  console.log(
    `%cTimestamp:%c ${new Date(summary.timestamp).toLocaleString()}`,
    "font-weight: bold;",
    "font-weight: normal;"
  )

  // Rules summary
  console.log(
    `%cRules:%c ${summary.rules.total} total, %c${summary.rules.passed} passed%c, %c${summary.rules.failed} failed%c, ${summary.rules.inapplicable} inapplicable, ${summary.rules.cantTell} can't tell`,
    "font-weight: bold;",
    "font-weight: normal;",
    "color: green; font-weight: bold;",
    "color: inherit; font-weight: normal;",
    "color: red; font-weight: bold;",
    "color: inherit; font-weight: normal;"
  )

  // Elements summary
  console.log(
    `%cElements:%c ${summary.elements.total} total, %c${summary.elements.passed} passed%c, %c${summary.elements.failed} failed%c`,
    "font-weight: bold;",
    "font-weight: normal;",
    "color: green; font-weight: bold;",
    "color: inherit; font-weight: normal;",
    "color: red; font-weight: bold;",
    "color: inherit; font-weight: normal;"
  )

  // WCAG compliance
  console.log(
    `%cWCAG Compliance:%c Level A: %c${summary.wcagCompliance.A ? "✓" : "✗"}%c, Level AA: %c${summary.wcagCompliance.AA ? "✓" : "✗"}%c, Level AAA: %c${summary.wcagCompliance.AAA ? "✓" : "✗"}%c`,
    "font-weight: bold;",
    "font-weight: normal;",
    summary.wcagCompliance.A
      ? "color: green; font-weight: bold;"
      : "color: red; font-weight: bold;",
    "color: inherit; font-weight: normal;",
    summary.wcagCompliance.AA
      ? "color: green; font-weight: bold;"
      : "color: red; font-weight: bold;",
    "color: inherit; font-weight: normal;",
    summary.wcagCompliance.AAA
      ? "color: green; font-weight: bold;"
      : "color: red; font-weight: bold;",
    "color: inherit; font-weight: normal;"
  )

  console.groupEnd()

  // Log failures
  const failures = results.filter((r) => r.outcome === "failed")
  if (failures.length > 0) {
    console.group(
      "%c❌ Failures",
      "font-weight: bold; font-size: 14px; color: red;"
    )

    for (const failure of failures) {
      console.group(
        `%c${failure.rule.name}%c - ${failure.element?.selector || "N/A"}`,
        "font-weight: bold;",
        "font-weight: normal;"
      )

      console.log(
        `%cImpact:%c ${failure.impact}`,
        "font-weight: bold;",
        "font-weight: normal;"
      )

      console.log(
        `%cMessage:%c ${failure.message}`,
        "font-weight: bold;",
        "font-weight: normal;"
      )

      if (failure.remediation) {
        console.log(
          `%cRemediation:%c ${failure.remediation}`,
          "font-weight: bold;",
          "font-weight: normal;"
        )
      }

      if (failure.element?.html) {
        console.log(
          `%cHTML:%c ${failure.element.html}`,
          "font-weight: bold;",
          "font-weight: normal;"
        )
      }

      if (failure.wcagCriteria && failure.wcagCriteria.length > 0) {
        console.log(
          `%cWCAG Criteria:%c ${failure.wcagCriteria.join(", ")}`,
          "font-weight: bold;",
          "font-weight: normal;"
        )
      }

      if (failure.helpUrl) {
        console.log(
          `%cMore Info:%c ${failure.helpUrl}`,
          "font-weight: bold;",
          "font-weight: normal;"
        )
      }

      console.groupEnd()
    }

    console.groupEnd()
  }

  // Log passes
  const passes = results.filter((r) => r.outcome === "passed")
  if (passes.length > 0) {
    console.group(
      "%c✅ Passes",
      "font-weight: bold; font-size: 14px; color: green;"
    )

    for (const pass of passes) {
      console.log(
        `%c${pass.rule.name}%c - ${pass.element?.selector || "N/A"}: ${pass.message}`,
        "font-weight: bold;",
        "font-weight: normal;"
      )
    }

    console.groupEnd()
  }
}
