import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { isDisabled, isHiddenFromAT } from "../utils/accessibility-utils"
import { formatACTResult } from "../utils/act-result-formatter"
import { getValidSelector } from "../utils/selector-utils"

/**
 * Valid autocomplete values according to HTML specification
 * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
 */
const VALID_AUTOCOMPLETE_VALUES = [
  // Special values
  "off",
  "on",

  // Standard field names
  "name",
  "honorific-prefix",
  "given-name",
  "additional-name",
  "family-name",
  "honorific-suffix",
  "nickname",
  "username",
  "new-password",
  "current-password",
  "one-time-code",
  "organization-title",
  "organization",
  "street-address",
  "address-line1",
  "address-line2",
  "address-line3",
  "address-level4",
  "address-level3",
  "address-level2",
  "address-level1",
  "country",
  "country-name",
  "postal-code",
  "cc-name",
  "cc-given-name",
  "cc-additional-name",
  "cc-family-name",
  "cc-number",
  "cc-exp",
  "cc-exp-month",
  "cc-exp-year",
  "cc-csc",
  "cc-type",
  "transaction-currency",
  "transaction-amount",
  "language",
  "bday",
  "bday-day",
  "bday-month",
  "bday-year",
  "sex",
  "tel",
  "tel-country-code",
  "tel-national",
  "tel-area-code",
  "tel-local",
  "tel-extension",
  "email",
  "impp",
  "url",
  "photo",

  // Work-related tokens
  "organization-title",
  "organization",

  // Shipping/billing prefixes
  "shipping",
  "billing",

  // Contact prefixes
  "home",
  "work",
  "mobile",
  "fax",
  "pager"
]

/**
 * Tokens that can only be used as prefixes, not as standalone values
 */
const PREFIX_ONLY_TOKENS = [
  // Shipping/billing prefixes
  "shipping",
  "billing",

  // Contact prefixes
  "home",
  "work",
  "mobile",
  "fax",
  "pager"
]

/**
 * Special modifiers that can be added to autocomplete values
 */
const SPECIAL_MODIFIERS = {
  // Authentication modifiers that can be used with password fields
  webauthn: ["new-password", "current-password"],

  // Potential future modifiers can be added here
  otp: ["one-time-code"]
}

/**
 * Input types where autocomplete doesn't meaningfully apply
 */
const INAPPLICABLE_INPUT_TYPES = [
  "submit",
  "button",
  "reset",
  "image",
  "file",
  "range",
  "color",
  "checkbox",
  "radio",
  "hidden"
]

/**
 * Check if an autocomplete value is valid
 * This handles complex autocomplete values with sections like "shipping name"
 */
function isValidAutocompleteValue(value: string): boolean {
  // Empty value is not valid for autocomplete
  if (!value || value.trim() === "") {
    return false
  }

  // Special cases: on/off
  if (value === "on" || value === "off") {
    return true
  }

  // Handle complex cases with sections
  // Format: [section-*] [shipping|billing] [home|work|mobile|fax|pager] <field> [modifier]
  const tokens = value.split(/\s+/)

  // There must be at least one token
  if (tokens.length === 0) {
    return false
  }

  // Single token case - must be a valid field name that isn't a prefix-only token
  if (tokens.length === 1) {
    return (
      VALID_AUTOCOMPLETE_VALUES.includes(value) &&
      !PREFIX_ONLY_TOKENS.includes(value)
    )
  }

  // Check for special modifier at the end (e.g., "webauthn" for password fields)
  const lastToken = tokens[tokens.length - 1]
  let hasSpecialModifier = false
  let specialModifierValidFields: string[] = []

  // Check if last token is a special modifier
  if (Object.keys(SPECIAL_MODIFIERS).includes(lastToken)) {
    hasSpecialModifier = true
    specialModifierValidFields =
      SPECIAL_MODIFIERS[lastToken as keyof typeof SPECIAL_MODIFIERS]
    // Remove the modifier from tokens for standard processing
    tokens.pop()
  }

  // If no tokens left after removing modifier, it's invalid
  if (tokens.length === 0) {
    return false
  }

  // Get field name (the last token after removing any modifier)
  const fieldName = tokens[tokens.length - 1]

  // Check if field name is valid
  if (
    !VALID_AUTOCOMPLETE_VALUES.includes(fieldName) ||
    PREFIX_ONLY_TOKENS.includes(fieldName)
  ) {
    return false
  }

  // If there's a special modifier, check if it's valid with this field
  if (hasSpecialModifier && !specialModifierValidFields.includes(fieldName)) {
    return false
  }

  // Validate token combinations

  // Track which types of tokens we've seen
  let hasSection = false
  let hasContactType = false
  let hasAddressType = false

  // Process all tokens except the field name
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i]

    // Section tokens (section-*)
    if (token.startsWith("section-")) {
      // Only one section token is allowed
      if (hasSection) {
        return false
      }
      hasSection = true
      continue
    }

    // Address tokens
    if (token === "shipping" || token === "billing") {
      // Only one address type is allowed
      if (hasAddressType) {
        return false
      }

      // Address types can only be used with address-related fields
      const addressFields = [
        "name",
        "honorific-prefix",
        "given-name",
        "additional-name",
        "family-name",
        "honorific-suffix",
        "nickname",
        "organization-title",
        "organization",
        "street-address",
        "address-line1",
        "address-line2",
        "address-line3",
        "address-level4",
        "address-level3",
        "address-level2",
        "address-level1",
        "country",
        "country-name",
        "postal-code",
        "cc-name",
        "cc-given-name",
        "cc-additional-name",
        "cc-family-name",
        "cc-number",
        "cc-exp",
        "cc-exp-month",
        "cc-exp-year",
        "cc-csc",
        "cc-type",
        "transaction-currency",
        "transaction-amount"
      ]

      if (!addressFields.includes(fieldName)) {
        return false
      }

      hasAddressType = true
      continue
    }

    // Contact tokens
    if (["home", "work", "mobile", "fax", "pager"].includes(token)) {
      // Only one contact type is allowed
      if (hasContactType) {
        return false
      }

      // Contact tokens can only be used with contact-related fields
      const contactFields = [
        "tel",
        "tel-country-code",
        "tel-national",
        "tel-area-code",
        "tel-local",
        "tel-extension",
        "email",
        "impp"
      ]

      if (!contactFields.includes(fieldName)) {
        return false
      }

      hasContactType = true
      continue
    }

    // If we get here, the token is not valid in this context
    return false
  }

  return true
}

/**
 * ACT Rule: Autocomplete attribute has valid value
 *
 * This rule checks that form elements with autocomplete attributes have valid values
 * according to the HTML specification.
 * Based on WCAG 2.1 Success Criterion 1.3.5: Identify Input Purpose
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html
 * @see https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
 */
const autocompleteValidValueRule = createACTRule(
  "autocomplete-valid-value",
  "Autocomplete attribute has valid value",
  "Form elements with autocomplete attributes must use values defined in the HTML specification.",
  {
    accessibility_requirements: getWCAGReference("1.3.5"),
    categories: [ACTRuleCategory.FORMS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html",

    // Applicability: Form elements with autocomplete attribute that are not hidden from AT
    isApplicable: () => {
      try {
        // We should only consider form elements with non-empty autocomplete attributes
        // Also exclude elements where autocomplete="" (empty string)
        // and exclude input types where autocomplete doesn't apply
        const candidates = document.querySelectorAll(
          "input[autocomplete]:not([autocomplete='']), select[autocomplete]:not([autocomplete='']), textarea[autocomplete]:not([autocomplete=''])"
        )

        // Filter out elements that are hidden from AT, disabled, or have inapplicable input types
        const applicableElements = Array.from(candidates).filter((el) => {
          const isHidden = isHiddenFromAT(el)
          const disabled = isDisabled(el)

          // Check if element is an input with an inapplicable type
          let isInapplicableType = false
          if (el.tagName.toLowerCase() === "input") {
            const inputType = (el as HTMLInputElement).type.toLowerCase()
            isInapplicableType = INAPPLICABLE_INPUT_TYPES.includes(inputType)

            if (isInapplicableType) {
              console.log(
                "Element excluded from autocomplete test due to inapplicable input type:",
                el.tagName,
                "type=",
                inputType,
                "autocomplete=",
                el.getAttribute("autocomplete")
              )
            }
          }

          // For debugging
          if (isHidden) {
            console.log(
              "Element excluded from autocomplete test due to being hidden:",
              el.tagName,
              el.getAttribute("autocomplete"),
              "display:",
              window.getComputedStyle(el as HTMLElement).display,
              "inline style:",
              el.getAttribute("style")
            )
          }

          if (disabled) {
            console.log(
              "Element excluded from autocomplete test due to being disabled:",
              el.tagName,
              el.getAttribute("autocomplete"),
              "disabled:",
              el.hasAttribute("disabled"),
              "aria-disabled:",
              el.getAttribute("aria-disabled")
            )
          }

          return (
            !isHidden &&
            !disabled &&
            !isInapplicableType &&
            el.getAttribute("autocomplete")?.trim() !== ""
          )
        })

        return applicableElements.length > 0
      } catch (error) {
        console.error("Error in autocomplete rule applicability check:", error)
        return false
      }
    },

    execute: async () => {
      try {
        // Find all form elements with non-empty autocomplete attribute
        const candidates = document.querySelectorAll(
          "input[autocomplete]:not([autocomplete='']), select[autocomplete]:not([autocomplete='']), textarea[autocomplete]:not([autocomplete=''])"
        )

        // Filter out elements that are hidden from AT, disabled, or have inapplicable input types
        const elements = Array.from(candidates).filter((el) => {
          const isHidden = isHiddenFromAT(el)
          const disabled = isDisabled(el)

          // Check if element is an input with an inapplicable type
          let isInapplicableType = false
          if (el.tagName.toLowerCase() === "input") {
            const inputType = (el as HTMLInputElement).type.toLowerCase()
            isInapplicableType = INAPPLICABLE_INPUT_TYPES.includes(inputType)
          }

          return (
            !isHidden &&
            !disabled &&
            !isInapplicableType &&
            el.getAttribute("autocomplete")?.trim() !== ""
          )
        })

        elements.forEach((element) => {
          const htmlElement = element as HTMLElement
          const selector = getValidSelector(htmlElement)

          // Get autocomplete value and normalize it (lowercase, trim)
          const autocompleteValue =
            htmlElement.getAttribute("autocomplete")?.trim().toLowerCase() || ""

          // Check if the value is valid
          const isValid = isValidAutocompleteValue(autocompleteValue)

          let message = ""
          let severity = "Serious"

          if (isValid) {
            message = `Element has valid autocomplete value: "${autocompleteValue}"`
            severity = "None"
          } else {
            message = `Element has invalid autocomplete value: "${autocompleteValue}". Autocomplete values must follow the HTML specification format.`
          }

          const result = formatACTResult(
            "autocomplete-valid-value",
            "Autocomplete attribute has valid value",
            htmlElement,
            selector,
            isValid,
            message,
            severity,
            ["WCAG2.1:1.3.5"],
            "https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html"
          )

          actRuleRunner.addResult(result)
        })
      } catch (error) {
        console.error("Error in autocomplete rule execution:", error)
      }
    }
  }
)

/**
 * Register all autocomplete attribute-related rules
 */
export function registerAutocompleteRules(): void {
  console.log("[autocomplete-rules] Registering autocomplete rules")

  // Register all autocomplete rules explicitly to prevent tree-shaking
  registerACTRule(autocompleteValidValueRule)

  console.log("[autocomplete-rules] Autocomplete rules registered")
}

// Export the rules for testing
export { autocompleteValidValueRule }
