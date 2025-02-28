// Import rule categories
import { buttonAccessibleNameRule } from "./button-accessible-name"
import { focusOrderRule, focusVisibilityRule } from "./focus-rules"
import { formLabelAssociationRule } from "./form-rules"
import {
  firstHeadingIsH1Rule,
  headingAccessibleNameRule,
  headingOrderRule
} from "./heading-rules"
import { imageAccessibleNameRule } from "./image-accessible-name"
// Note: Due to how this module is structured, we're not exporting languageOfPageRule directly
// The rule will still be registered when the module is imported
import "./language-of-page"

import {
  linkAccessibleNameRule,
  linkDescriptiveTextRule,
  linkDuplicateTextRule,
  linkTextLengthRule
} from "./link-rules"

// Export all rules
export {
  buttonAccessibleNameRule,
  firstHeadingIsH1Rule,
  focusOrderRule,
  focusVisibilityRule,
  formLabelAssociationRule,
  headingAccessibleNameRule,
  headingOrderRule,
  imageAccessibleNameRule,
  // languageOfPageRule is not exported directly, but registered when imported
  linkAccessibleNameRule,
  linkDescriptiveTextRule,
  linkTextLengthRule,
  linkDuplicateTextRule
}

/**
 * Register all rules
 */
export function registerAllRules() {
  // All rules self-register when imported
  // This function just ensures the imports are not tree-shaken
}

// Re-export all rules for direct use
export * from "./link-rules"
export * from "./heading-rules"
