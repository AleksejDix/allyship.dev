import { validate } from "bcp47-validate"

import { BaseTool } from "./base-tool"

export class LanguageCheckTool extends BaseTool {
  private hasIssues = false

  getSelector(): string {
    return `
      html,
      [lang],
      [xml\\:lang]
    `
      .trim()
      .replace(/\s+/g, " ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    // Reset state at start of validation
    if (el === this.getElements()[0]) {
      this.hasIssues = false
      this.logInfo("Language Check Started", "Checking language attributes...")
    }

    // Check if it's the html element
    const isHtmlElement = el.tagName.toLowerCase() === "html"

    // Get language attributes
    const lang = el.getAttribute("lang")
    const xmlLang = el.getAttribute("xml:lang")

    if (isHtmlElement) {
      // HTML element must have a valid lang attribute
      if (!lang) {
        this.hasIssues = true
        this.logAxeIssue({
          id: "html-has-lang",
          impact: "serious",
          description: "The <html> element must have a lang attribute",
          help: "Add a valid lang attribute to the <html> element",
          helpUrl: "https://dequeuniversity.com/rules/axe/4.6/html-has-lang",
          nodes: [
            {
              html: el.outerHTML,
              target: ["html"],
              failureSummary:
                "The <html> element does not have a lang attribute",
            },
          ],
        })
        this.highlightElement(el, false, "Missing lang")
        return {
          isValid: false,
          message: "HTML element missing lang attribute",
        }
      }

      // Validate the language code
      if (!this.isValidLanguageCode(lang)) {
        this.hasIssues = true
        this.logAxeIssue({
          id: "html-valid-lang",
          impact: "serious",
          description: "The <html> element must have a valid lang attribute",
          help: `The language code "${lang}" is not valid`,
          helpUrl: "https://dequeuniversity.com/rules/axe/4.6/html-valid-lang",
          nodes: [
            {
              html: el.outerHTML,
              target: ["html"],
              failureSummary: `Invalid language code: ${lang}`,
            },
          ],
        })
        this.highlightElement(el, false, `Invalid: ${lang}`)
        return {
          isValid: false,
          message: `Invalid language code: ${lang}`,
        }
      }
    } else {
      // For other elements with lang attributes
      if (lang && !this.isValidLanguageCode(lang)) {
        this.hasIssues = true
        this.logAxeIssue({
          id: "valid-lang",
          impact: "serious",
          description:
            "Elements with lang attributes must use valid language codes",
          help: `The language code "${lang}" is not valid`,
          helpUrl: "https://dequeuniversity.com/rules/axe/4.6/valid-lang",
          nodes: [
            {
              html: el.outerHTML,
              target: [this.getElementSelector(el)],
              failureSummary: `Invalid language code: ${lang}`,
            },
          ],
        })
        this.highlightElement(el, false, `Invalid: ${lang}`)
        return {
          isValid: false,
          message: `Invalid language code: ${lang}`,
        }
      }

      // Check if xml:lang matches lang when both are present
      if (lang && xmlLang && lang.toLowerCase() !== xmlLang.toLowerCase()) {
        this.hasIssues = true
        this.logAxeIssue({
          id: "xml-lang-mismatch",
          impact: "moderate",
          description: "lang and xml:lang attributes should match",
          help: "Ensure lang and xml:lang attributes have matching values",
          helpUrl:
            "https://dequeuniversity.com/rules/axe/4.6/xml-lang-mismatch",
          nodes: [
            {
              html: el.outerHTML,
              target: [this.getElementSelector(el)],
              failureSummary: `lang="${lang}" does not match xml:lang="${xmlLang}"`,
            },
          ],
        })
        this.highlightElement(el, false, `Mismatch: ${lang} ≠ ${xmlLang}`)
        return {
          isValid: false,
          message: `Language attributes don't match: ${lang} vs ${xmlLang}`,
        }
      }
    }

    // If this is the last element and no issues were found, log success
    if (
      el === this.getElements()[this.getElements().length - 1] &&
      !this.hasIssues
    ) {
      this.logSuccess(
        "Language Check Passed",
        "All language attributes are valid",
        "HTML lang attribute is present and valid",
        "No mismatched lang/xml:lang attributes"
      )
    }

    // If we get here, everything is valid
    this.highlightElement(el, true, lang || xmlLang || undefined)
    return { isValid: true }
  }

  private isValidLanguageCode(lang: string): boolean {
    try {
      return validate(lang)
    } catch {
      return false
    }
  }

  private getElementSelector(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ""
    const classes = Array.from(el.classList)
      .map((c) => `.${c}`)
      .join("")
    return `${tag}${id}${classes}`
  }
}

// Export a singleton instance
const languageCheckTool = new LanguageCheckTool()
export const checkLanguage = (mode: "apply" | "cleanup" = "apply") =>
  languageCheckTool.run(mode)
