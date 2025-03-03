import type { AccessibilityRequirement, ACTRuleMetadata } from "./act-types"

/**
 * Registry of all ACT rules implemented in AllyStudio
 */
export interface ACTRule {
  /**
   * Metadata about the rule
   */
  metadata: ACTRuleMetadata

  /**
   * Function to check if the rule is applicable to the current page
   */
  isApplicable: () => boolean

  /**
   * Function to run the rule test
   */
  execute: () => Promise<void>
}

/**
 * Registry of all ACT rules
 */
class ACTRulesRegistry {
  private rules: Map<string, ACTRule> = new Map()

  /**
   * Register a new ACT rule
   */
  register(rule: ACTRule): void {
    if (this.rules.has(rule.metadata.id)) {
      console.warn(
        `ACT rule with ID ${rule.metadata.id} is already registered. Overwriting.`
      )
    }

    this.rules.set(rule.metadata.id, rule)
  }

  /**
   * Get a rule by ID
   */
  getRule(id: string): ACTRule | undefined {
    return this.rules.get(id)
  }

  /**
   * Get all registered rules
   */
  getAllRules(): ACTRule[] {
    return Array.from(this.rules.values())
  }

  /**
   * Get rules by WCAG criteria
   */
  getRulesByWCAGCriteria(criteria: string): ACTRule[] {
    return this.getAllRules().filter(
      (rule) =>
        rule.metadata.accessibility_requirements &&
        Object.keys(rule.metadata.accessibility_requirements).some((reqId) =>
          reqId.includes(criteria)
        )
    )
  }

  /**
   * Get rules by category
   */
  getRulesByCategory(category: string): ACTRule[] {
    return this.getAllRules().filter((rule) =>
      rule.metadata.categories?.includes(category)
    )
  }

  /**
   * Get applicable rules for the current page
   */
  getApplicableRules(): ACTRule[] {
    return this.getAllRules().filter((rule) => rule.isApplicable())
  }
}

// Create and export a singleton instance
export const actRulesRegistry = new ACTRulesRegistry()

/**
 * ACT Rule categories
 */
export enum ACTRuleCategory {
  ARIA = "aria",
  FORMS = "forms",
  HEADINGS = "headings",
  STRUCTURE = "structure",
  IMAGES = "images",
  LINKS = "links",
  TABLES = "tables",
  LANGUAGE = "language",
  LANDMARKS = "landmarks",
  COLOR = "color",
  CONTRAST = "contrast",
  FOCUS = "focus",
  KEYBOARD = "keyboard",
  BUTTONS = "buttons",
  INTERACTIVE = "interactive"
}

/**
 * Helper function to create a new ACT rule
 */
export function createACTRule(
  id: string,
  name: string,
  description: string,
  options: {
    accessibility_requirements?: Record<string, AccessibilityRequirement>
    input_aspects?: string[]
    categories?: string[]
    implementation_url?: string
    isApplicable?: () => boolean
    execute: () => Promise<void>
  }
): ACTRule {
  return {
    metadata: {
      id,
      name,
      description,
      accessibility_requirements: options.accessibility_requirements,
      input_aspects: options.input_aspects || ["DOM Tree"],
      categories: options.categories,
      implementation_url: options.implementation_url
    },
    isApplicable: options.isApplicable || (() => true),
    execute: options.execute
  }
}

/**
 * Helper function to register a new ACT rule
 */
export function registerACTRule(rule: ACTRule): void {
  console.log(`[act-rules-registry] Registering rule: ${rule.metadata.id}`)

  actRulesRegistry.register(rule)

  if (rule.metadata.categories) {
    console.log(
      `[act-rules-registry] Rule ${rule.metadata.id} categories:`,
      rule.metadata.categories
    )
  } else {
    console.log(
      `[act-rules-registry] Rule ${rule.metadata.id} has no categories`
    )
  }
}

/**
 * Helper function to register multiple ACT rules
 */
export function registerACTRules(rules: ACTRule[]): void {
  for (const rule of rules) {
    actRulesRegistry.register(rule)
  }
}

/**
 * Helper function to get WCAG success criteria reference
 */
export function getWCAGReference(
  criterionId: string,
  forConformance: boolean = true
): Record<string, AccessibilityRequirement> {
  const criterionMap: Record<string, string> = {
    "1.1.1": "Non-text Content",
    "1.2.1": "Audio-only and Video-only (Prerecorded)",
    "1.2.2": "Captions (Prerecorded)",
    "1.2.3": "Audio Description or Media Alternative (Prerecorded)",
    "1.2.4": "Captions (Live)",
    "1.2.5": "Audio Description (Prerecorded)",
    "1.3.1": "Info and Relationships",
    "1.3.2": "Meaningful Sequence",
    "1.3.3": "Sensory Characteristics",
    "1.3.4": "Orientation",
    "1.3.5": "Identify Input Purpose",
    "1.3.6": "Identify Purpose",
    "1.4.1": "Use of Color",
    "1.4.2": "Audio Control",
    "1.4.3": "Contrast (Minimum)",
    "1.4.4": "Resize text",
    "1.4.5": "Images of Text",
    "1.4.10": "Reflow",
    "1.4.11": "Non-text Contrast",
    "1.4.12": "Text Spacing",
    "1.4.13": "Content on Hover or Focus",
    "2.1.1": "Keyboard",
    "2.1.2": "No Keyboard Trap",
    "2.1.4": "Character Key Shortcuts",
    "2.2.1": "Timing Adjustable",
    "2.2.2": "Pause, Stop, Hide",
    "2.3.1": "Three Flashes or Below Threshold",
    "2.3.3": "Animation from Interactions",
    "2.4.1": "Bypass Blocks",
    "2.4.2": "Page Titled",
    "2.4.3": "Focus Order",
    "2.4.4": "Link Purpose (In Context)",
    "2.4.5": "Multiple Ways",
    "2.4.6": "Headings and Labels",
    "2.4.7": "Focus Visible",
    "2.5.1": "Pointer Gestures",
    "2.5.2": "Pointer Cancellation",
    "2.5.3": "Label in Name",
    "2.5.4": "Motion Actuation",
    "3.1.1": "Language of Page",
    "3.1.2": "Language of Parts",
    "3.2.1": "On Focus",
    "3.2.2": "On Input",
    "3.2.3": "Consistent Navigation",
    "3.2.4": "Consistent Identification",
    "3.3.1": "Error Identification",
    "3.3.2": "Labels or Instructions",
    "3.3.3": "Error Suggestion",
    "3.3.4": "Error Prevention (Legal, Financial, Data)",
    "4.1.1": "Parsing",
    "4.1.2": "Name, Role, Value",
    "4.1.3": "Status Messages"
  }

  const criterionName = criterionMap[criterionId] || "Unknown Criterion"
  const wcagVersion = "2.1"

  return {
    [`WCAG${wcagVersion}:${criterionId}`]: {
      id: `WCAG${wcagVersion}:${criterionId}`,
      forConformance,
      failed: `This page does not meet WCAG ${wcagVersion} Success Criterion ${criterionId} (${criterionName})`,
      passed: `This page meets WCAG ${wcagVersion} Success Criterion ${criterionId} (${criterionName})`
    }
  }
}
