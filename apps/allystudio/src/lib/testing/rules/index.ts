// Import rule categories
import {
  aiLanguageCheckRule,
  registerAILanguageRules
} from "./ai-language-check"
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
import { registerImageRules } from "./image-accessible-name"
// Import language rules with their registration function
import { languageOfPageRule, registerLanguageRules } from "./language-of-page"
import {
  linkAccessibleNameRule,
  linkDescriptiveTextRule,
  linkDuplicateTextRule,
  linkTextLengthRule,
  registerLinkRules
} from "./link-rules"
import { registerRoleRules, roleValidValueRule } from "./role-valid-value"

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
  languageOfPageRule,
  linkAccessibleNameRule,
  linkDescriptiveTextRule,
  linkTextLengthRule,
  linkDuplicateTextRule,
  roleValidValueRule
}

/**
 * Register all rules
 */
export function registerAllRules(): void {
  console.log("Registering all ACT rules...")

  // Register each category of rules
  registerAILanguageRules()
  registerButtonRules()
  registerFocusRules()
  registerFormRules()
  registerHeadingRules()
  registerImageRules()
  registerLanguageRules()
  registerLinkRules()
  registerRoleRules()

  console.log("All ACT rules registered.")
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
export * from "./role-valid-value"
