export interface ValidationResult {
  isValid: boolean
  message?: string
  severity?: "Critical" | "High" | "Medium" | "Low"
  expected?: string
}

export interface AccessibilityIssue {
  issue_id: string
  rule_id: string
  agent_id: string
  step_id: string
  url: string
  normalized_url: string
  location: {
    xpath: string
    selector: string
    element_type: string
    attribute?: string
    context: string
  }
  severity: "Critical" | "High" | "Medium" | "Low"
  confidence: number
  evidence: {
    found_value: string
    expected_value: string
    snippet: string
  }
  impact: {
    user_groups: string[]
    assistive_tech: string[]
    functionality: string[]
  }
  fix_suggestion: {
    description: string
    code_example: string
    related_resources: string[]
  }
}

export class HeadingValidator {
  private getSelector(): string {
    return "h1, h2, h3, h4, h5, h6"
  }

  private getElementXPath(element: HTMLElement): string {
    const headings = document.querySelectorAll<HTMLElement>(this.getSelector())
    let count = 0
    let found = false

    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i]
      if (heading === element) {
        found = true
        break
      }
      if (heading.tagName === element.tagName) {
        count++
      }
    }

    if (!found) return ""
    return `//${element.tagName.toLowerCase()}[${count + 1}]`
  }

  public getVisibleElements(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll<HTMLElement>(this.getSelector())
    ).filter((el) => {
      const style = window.getComputedStyle(el)
      return style.display !== "none" && style.visibility !== "hidden"
    })
  }

  public validateElement(
    el: HTMLElement,
    allHeadings: HTMLElement[]
  ): ValidationResult {
    const level = parseInt(el.tagName[1])
    const index = allHeadings.indexOf(el)
    let lastValidLevel = 0

    // Get previous valid heading level
    for (let i = 0; i < index; i++) {
      const prevLevel = parseInt(allHeadings[i].tagName[1])
      if (prevLevel <= lastValidLevel + 1) {
        lastValidLevel = prevLevel
      }
    }

    // First heading should be h1
    if (index === 0 && level !== 1) {
      return {
        isValid: false,
        message: "First heading must be H1",
        severity: "Critical",
        expected: "h1"
      }
    }

    // Check for valid heading level sequence
    const isValidSequence = level <= lastValidLevel + 1
    const isValid = index === 0 ? level === 1 : isValidSequence

    if (!isValid) {
      return {
        isValid: false,
        message: `Invalid heading sequence: H${lastValidLevel} to H${level}`,
        severity: "High",
        expected: `h${lastValidLevel + 1}`
      }
    }

    return { isValid: true }
  }

  public collectIssues(): AccessibilityIssue[] {
    const elements = this.getVisibleElements()
    const issues: AccessibilityIssue[] = []
    const url = window.location.href
    const normalized_url = url.replace(/^https?:\/\//, "").replace(/\/$/, "")

    elements.forEach((element) => {
      const result = this.validateElement(element, elements)
      if (
        !result.isValid &&
        result.message &&
        result.severity &&
        result.expected
      ) {
        const level = parseInt(element.tagName[1])
        const xpath = this.getElementXPath(element)

        const issue: AccessibilityIssue = {
          issue_id: `heading_${level}_${xpath.replace(/[^\w]/g, "_")}`,
          rule_id: "1.3.1",
          agent_id: "heading_structure_validator",
          step_id: "heading_sequence_check",
          url,
          normalized_url,
          location: {
            xpath,
            selector: `h${level}`,
            element_type: "heading",
            context: "Document structure"
          },
          severity: result.severity,
          confidence: 1.0,
          evidence: {
            found_value: `h${level}`,
            expected_value: result.expected,
            snippet: element.outerHTML
          },
          impact: {
            user_groups: [
              "Screen reader users",
              "Keyboard users",
              "Users with cognitive disabilities"
            ],
            assistive_tech: ["Screen readers", "Navigation tools"],
            functionality: [
              "Content structure",
              "Navigation",
              "Document outline"
            ]
          },
          fix_suggestion: {
            description: result.message,
            code_example: `<${result.expected}>${element.textContent}</${result.expected}>`,
            related_resources: [
              "https://www.w3.org/WAI/tutorials/page-structure/headings/",
              "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements",
              "https://webaim.org/techniques/semanticstructure/#headings"
            ]
          }
        }

        issues.push(issue)
      }
    })

    return issues
  }

  public getLabel(element: HTMLElement): string {
    const level = parseInt(element.tagName[1])
    return `H${level}`
  }
}
