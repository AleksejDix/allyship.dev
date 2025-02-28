import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { getAccessibleName } from "../act-test-runner"
import { formatACTResult } from "../utils/act-result-formatter"
import { getValidSelector } from "../utils/selector-utils"

/**
 * Checks if an input element has an associated label
 */
function hasAssociatedLabel(element: HTMLElement): {
  hasLabel: boolean
  method: string | null
  labelText: string | null
} {
  const result = {
    hasLabel: false,
    method: null as string | null,
    labelText: null as string | null
  }

  // Check for explicit <label> with for attribute
  if (element.id) {
    const explicitLabel = document.querySelector(`label[for="${element.id}"]`)
    if (explicitLabel) {
      result.hasLabel = true
      result.method = "explicit"
      result.labelText = explicitLabel.textContent?.trim() || null
      return result
    }
  }

  // Check for implicit label (input is a descendant of label)
  const parentLabel = element.closest("label")
  if (parentLabel) {
    result.hasLabel = true
    result.method = "implicit"
    // Get label text excluding the text of the input element itself
    const labelText = Array.from(parentLabel.childNodes)
      .filter(
        (node) =>
          (node !== element && node.nodeType === Node.TEXT_NODE) ||
          (node.nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).tagName !== element.tagName)
      )
      .map((node) => node.textContent || "")
      .join("")
      .trim()

    result.labelText = labelText || null
    return result
  }

  // Check for aria-labelledby
  const labelledby = element.getAttribute("aria-labelledby")
  if (labelledby) {
    const ids = labelledby.split(/\s+/)
    const labelTexts = ids
      .map((id) => document.getElementById(id)?.textContent?.trim() || "")
      .filter((text) => text.length > 0)

    if (labelTexts.length > 0) {
      result.hasLabel = true
      result.method = "aria-labelledby"
      result.labelText = labelTexts.join(" ")
      return result
    }
  }

  // Check for aria-label
  const ariaLabel = element.getAttribute("aria-label")
  if (ariaLabel?.trim()) {
    result.hasLabel = true
    result.method = "aria-label"
    result.labelText = ariaLabel.trim()
    return result
  }

  // Check for title (less preferred, but still provides an accessible name)
  const title = element.getAttribute("title")
  if (title?.trim()) {
    result.hasLabel = true
    result.method = "title"
    result.labelText = title.trim()
    return result
  }

  // Special case for submit, reset, and button inputs which have implicit labels
  if (
    element.tagName === "INPUT" &&
    ["submit", "reset", "button"].includes((element as HTMLInputElement).type)
  ) {
    const value = (element as HTMLInputElement).value
    if (value?.trim()) {
      result.hasLabel = true
      result.method = "value"
      result.labelText = value.trim()
      return result
    }
  }

  // Check for placeholder (not sufficient for WCAG, but we'll detect it to provide better feedback)
  const placeholder = element.getAttribute("placeholder")
  if (placeholder?.trim()) {
    result.hasLabel = false // Placeholder alone is not sufficient
    result.method = "placeholder-only"
    result.labelText = placeholder.trim()
    return result
  }

  return result
}

/**
 * Rule: Form controls must have associated labels
 */
export const formLabelAssociationRule = createACTRule(
  "form-label-association",
  "Form controls must have associated labels",
  "Each form control must have a properly associated label that describes its purpose",
  {
    accessibility_requirements: {
      ...getWCAGReference("3.3.2"),
      ...getWCAGReference("4.1.2")
    },
    categories: [ACTRuleCategory.FORMS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",

    isApplicable: () => {
      const formControls = document.querySelectorAll(
        'input:not([type="hidden"]):not([type="image"]), ' +
          "select, textarea, " +
          "button, " +
          '[role="button"], ' +
          '[role="checkbox"], ' +
          '[role="radio"], ' +
          '[role="combobox"], ' +
          '[role="listbox"], ' +
          '[role="textbox"], ' +
          '[role="searchbox"], ' +
          '[role="slider"], ' +
          '[role="spinbutton"], ' +
          '[role="switch"]'
      )
      return formControls.length > 0
    },

    execute: async () => {
      const formControls = document.querySelectorAll(
        'input:not([type="hidden"]):not([type="image"]), ' +
          "select, textarea, " +
          "button, " +
          '[role="button"], ' +
          '[role="checkbox"], ' +
          '[role="radio"], ' +
          '[role="combobox"], ' +
          '[role="listbox"], ' +
          '[role="textbox"], ' +
          '[role="searchbox"], ' +
          '[role="slider"], ' +
          '[role="spinbutton"], ' +
          '[role="switch"]'
      )

      let totalControls = 0
      let controlsWithLabels = 0

      for (const control of Array.from(formControls)) {
        const element = control as HTMLElement
        totalControls++

        // Skip hidden or disabled elements
        if (
          !element.isConnected ||
          getComputedStyle(element).display === "none" ||
          getComputedStyle(element).visibility === "hidden" ||
          element.hasAttribute("hidden") ||
          element.hasAttribute("disabled") ||
          element.getAttribute("aria-hidden") === "true"
        ) {
          continue
        }

        const labelInfo = hasAssociatedLabel(element)
        const accessibleName = getAccessibleName(element)
        const passed =
          labelInfo.hasLabel || (accessibleName && accessibleName.length > 0)

        if (passed) {
          controlsWithLabels++
        }

        let message = ""
        let remediation = ""

        if (passed) {
          message = `Form control has an associated label using ${labelInfo.method}: "${labelInfo.labelText || accessibleName}"`
        } else {
          const elementType =
            element.getAttribute("role") || element.tagName.toLowerCase()

          if (labelInfo.method === "placeholder-only") {
            message = `Form control (${elementType}) has only a placeholder and no proper label`
            remediation = `Add a proper label using one of these methods:
              1. Add a <label> element with a "for" attribute matching the id "${element.id || "[missing]"}"
              2. Wrap the input in a <label> element
              3. Add an aria-label attribute
              4. Add an aria-labelledby attribute referencing the ID of a visible text element
              Note: Placeholder text is not sufficient as a label as it disappears when the user starts typing.`
          } else {
            message = `Form control (${elementType}) has no associated label`
            remediation = `Add a label using one of these methods:
              1. Add a <label> element with a "for" attribute matching the id "${element.id || "[missing]"}"
              2. Wrap the input in a <label> element
              3. Add an aria-label attribute
              4. Add an aria-labelledby attribute referencing the ID of a visible text element`
          }
        }

        const selector = getValidSelector(element)

        actRuleRunner.addResult({
          rule: {
            id: "form-label-association",
            name: "Form controls must have associated labels"
          },
          outcome: passed ? "passed" : "failed",
          element: {
            selector,
            html: element.outerHTML.split(">")[0] + ">...",
            attributes: {
              type: element.getAttribute("type") || "",
              role: element.getAttribute("role") || "",
              name: element.getAttribute("name") || "",
              id: element.id || "",
              "aria-label": element.getAttribute("aria-label") || "",
              "aria-labelledby": element.getAttribute("aria-labelledby") || ""
            }
          },
          message,
          impact: passed ? undefined : "serious",
          wcagCriteria: ["WCAG2.1:3.3.2", "WCAG2.1:4.1.2"],
          helpUrl:
            "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",
          remediation: passed ? undefined : remediation
        })
      }

      // Add a summary result
      actRuleRunner.addResult({
        rule: {
          id: "form-label-association",
          name: "Form controls must have associated labels"
        },
        outcome: controlsWithLabels === totalControls ? "passed" : "failed",
        message: `${controlsWithLabels} out of ${totalControls} form controls have proper labels`,
        impact: controlsWithLabels === totalControls ? undefined : "serious",
        wcagCriteria: ["WCAG2.1:3.3.2", "WCAG2.1:4.1.2"],
        helpUrl:
          "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html"
      })
    }
  }
)

// Register the rule
registerACTRule(formLabelAssociationRule)
