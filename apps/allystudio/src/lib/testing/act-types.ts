/**
 * Types for ACT (Accessibility Conformance Testing) Rules
 * Based on W3C ACT Rules Format 1.0
 */

/**
 * Outcome of an ACT Rule test
 */
export type ACTOutcome = "passed" | "failed" | "inapplicable" | "cantTell"

/**
 * Severity level for accessibility issues
 */
export type ACTSeverity = "critical" | "serious" | "moderate" | "minor"

/**
 * WCAG Level (A, AA, AAA)
 */
export type WCAGLevel = "A" | "AA" | "AAA"

/**
 * Mapping of WCAG success criteria to conformance requirements
 */
export interface AccessibilityRequirement {
  id: string
  forConformance: boolean
  failed: string
  passed: string
}

/**
 * Metadata for an ACT Rule
 */
export interface ACTRuleMetadata {
  id: string
  name: string
  description: string
  accessibility_requirements?: Record<string, AccessibilityRequirement>
  input_aspects?: string[]
  categories?: string[]
  implementation_url?: string
}

/**
 * Result of testing a single element against an ACT Rule
 */
export interface ACTRuleResult {
  rule: {
    id: string
    name: string
  }
  outcome: ACTOutcome
  element?: {
    selector: string // CSS selector to identify the element
    html: string // Snippet of HTML
    xpath?: string // XPath as alternative identifier
    attributes?: Record<string, string> // Key attributes
  }
  message: string // Human-readable explanation
  remediation?: string // Suggested fix
  impact?: ACTSeverity // How severe the issue is
  wcagCriteria?: string[] // Which WCAG criteria this relates to
  helpUrl?: string // Link to more information
}

/**
 * Summary of all test results for a page
 */
export interface ACTTestSummary {
  url: string
  timestamp: string
  rules: {
    total: number
    passed: number
    failed: number
    inapplicable: number
    cantTell: number
  }
  elements: {
    total: number
    passed: number
    failed: number
  }
  wcagCompliance: {
    A: boolean
    AA: boolean
    AAA: boolean
  }
}

/**
 * Complete ACT test report
 */
export interface ACTTestReport {
  summary: ACTTestSummary
  results: ACTRuleResult[]
  metadata: {
    toolName: string
    toolVersion: string
  }
}
