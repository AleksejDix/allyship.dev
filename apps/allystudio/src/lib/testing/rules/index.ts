// Import rule categories
import { aiLanguageCheckRule, registerAILanguageRules } from "./ai-language-check"
import {
  buttonAccessibleNameRule,
  registerButtonRules
} from "./button-accessible-name"
import {
  focusOrderRule,
  focusVisibilityRule,
  registerFocusRules
} from "./focus-rules"
import { formLabelAssociationRule, registerFormRules } from "./form-rules"
import {
  firstHeadingIsH1Rule,
  headingAccessibleNameRule,
  headingOrderRule,
  registerHeadingRules
} from "./heading-rules"
import {
  imageAccessibleNameRule,
  registerImageRules
} from "./image-accessible-name"
// Import language rules with their registration function
import { languageOfPageRule, registerLanguageRules } from "./language-of-page"
import {
  linkAccessibleNameRule,
  linkDescriptiveTextRule,
  linkDuplicateTextRule,
  linkTextLengthRule,
  registerLinkRules
} from "./link-rules"

// Export all rules
export {
  aiLanguageCheckRule,
  buttonAccessibleNameRule,
  firstHeadingIsH1Rule,
  focusOrderRule,
  focusVisibilityRule,
  formLabelAssociationRule,
  headingAccessibleNameRule,
  headingOrderRule,
  imageAccessibleNameRule,
  languageOfPageRule,
  linkAccessibleNameRule,
  linkDescriptiveTextRule,
  linkTextLengthRule,
  linkDuplicateTextRule
}

/**
 * Register all rules
 */
export function registerAllRules() {
  // Explicitly register all rule types to prevent tree-shaking issues
  console.log("[rules] Registering all ACT rules")

  // Explicitly call registration functions
  registerAILanguageRules()
  registerButtonRules()
  registerFocusRules()
  registerFormRules()
  registerHeadingRules()
  registerImageRules()
  registerLanguageRules()
  registerLinkRules()

  console.log("[rules] All ACT rules registered")
}

// Re-export all rules for direct use
export * from "./ai-language-check"
export * from "./button-accessible-name"
export * from "./focus-rules"
export * from "./form-rules"
export * from "./heading-rules"
export * from "./image-accessible-name"
export * from "./language-of-page"
export * from "./link-rules"
