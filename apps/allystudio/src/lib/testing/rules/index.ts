// Export all ACT rules
import { registerFocusRules } from "./focus-rules"
import { registerHeadingRules } from "./heading-rules"
import { registerLinkRules } from "./link-rules"

/**
 * Register all rules
 */
export function registerAllRules() {
  console.log("[rules/index] Registering all ACT rules")

  // Register heading rules
  registerHeadingRules()

  // Register link rules
  registerLinkRules()

  // Register focus rules
  registerFocusRules()

  console.log("[rules/index] All ACT rules registered")
}

// Re-export all rules for direct use
export * from "./link-rules"
export * from "./heading-rules"
