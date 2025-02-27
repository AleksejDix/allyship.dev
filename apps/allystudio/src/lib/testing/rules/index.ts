// Export all ACT rules
import { registerLinkRules } from "./link-rules"

// Function to register all rules
export function registerAllRules() {
  // Register all link rules
  registerLinkRules()

  // Add more rule registrations here as they are created
}

// Re-export all rules for direct use
export * from "./link-rules"
