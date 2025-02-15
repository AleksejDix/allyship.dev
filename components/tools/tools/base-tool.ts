export interface ToolResult {
  success: boolean
  issues?: string[]
}

export abstract class BaseTool {
  protected isActive: boolean = false
  protected addedElements: Set<HTMLElement> = new Set()
  private observer: MutationObserver | null = null
  private themeObserver: MediaQueryList | null = null

  abstract getSelector(): string
  abstract getElements(): NodeListOf<HTMLElement> | HTMLElement[]
  abstract validateElement(el: HTMLElement): {
    isValid: boolean
    message?: string
  }

  protected startObserving() {
    if (this.observer) return

    const selector = this.getSelector()
    if (!selector) return

    // DOM Changes Observer
    this.observer = new MutationObserver((mutations) => {
      let shouldRerun = false

      for (const mutation of mutations) {
        // Check for new/removed nodes
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes)
          const removedNodes = Array.from(mutation.removedNodes)

          const hasRelevantChanges = [...addedNodes, ...removedNodes].some(
            (node) => {
              if (node instanceof HTMLElement) {
                if (Array.from(this.getElements()).includes(node)) {
                  return true
                }
                return node.querySelector(selector) !== null
              }
              return false
            }
          )

          if (hasRelevantChanges) {
            shouldRerun = true
            break
          }
        }

        // Check for attribute changes on HTML element
        if (
          mutation.type === "attributes" &&
          mutation.target instanceof HTMLHtmlElement
        ) {
          shouldRerun = true
          break
        }
      }

      if (shouldRerun) {
        this.revalidate()
      }
    })

    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    // Theme Change Observer
    this.themeObserver = window.matchMedia("(prefers-color-scheme: dark)")
    this.themeObserver.addEventListener("change", this.handleThemeChange)
  }

  protected stopObserving() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    if (this.themeObserver) {
      this.themeObserver.removeEventListener("change", this.handleThemeChange)
      this.themeObserver = null
    }
  }

  private handleThemeChange = () => {
    if (this.isActive) {
      this.revalidate()
    }
  }

  protected revalidate() {
    // Clean up existing validations
    this.cleanup()
    // Rerun validation
    this.apply()
  }

  protected highlightElement(
    el: HTMLElement,
    isValid: boolean,
    label?: string
  ) {
    this.addedElements.add(el)
    el.dataset.allyState = isValid ? "valid" : "error"
    if (label) {
      el.dataset.allyLabel = label
    }
  }

  apply(): ToolResult {
    if (this.isActive) {
      return { success: false }
    }

    const elements = this.getElements()
    if (!elements.length) {
      return { success: false }
    }

    const issues: string[] = []

    elements.forEach((el) => {
      const { isValid, message } = this.validateElement(el)
      if (!isValid && message) {
        issues.push(message)
      }
    })

    this.isActive = true
    this.startObserving()
    return { success: true, issues }
  }

  cleanup(): ToolResult {
    if (!this.isActive) {
      return { success: false }
    }

    this.stopObserving()

    this.addedElements.forEach((element) => {
      element.removeAttribute("data-ally-state")
      element.removeAttribute("data-ally-label")
    })

    this.addedElements.clear()
    this.isActive = false
    return { success: true }
  }

  run(mode: "apply" | "cleanup" = "apply"): ToolResult {
    return mode === "cleanup" ? this.cleanup() : this.apply()
  }
}
