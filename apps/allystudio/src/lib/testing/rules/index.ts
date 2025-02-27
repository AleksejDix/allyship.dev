// Export all ACT rules
import { registerHeadingRules } from "./heading-rules"
import { registerLinkRules } from "./link-rules"

/**
 * Register all rules
 */
export function registerAllRules() {
  console.log("[rules/index] Registering all ACT rules")

  // Register heading rules and add logging
  console.log("[rules/index] Registering heading rules")
  registerHeadingRules()

  // Register all link rules
  registerLinkRules()

  // Add more rule registrations here as they are created

  // Log confirmation after all rules are registered
  console.log("[rules/index] All ACT rules registered")
}

// Re-export all rules for direct use
export * from "./link-rules"
export * from "./heading-rules"
