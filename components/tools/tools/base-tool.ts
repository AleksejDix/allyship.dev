export interface ToolResult {
  success: boolean
  issues?: string[]
}

export abstract class BaseTool {
  protected isActive: boolean = false
  protected addedElements: Set<HTMLElement> = new Set()
  private observer: MutationObserver | null = null

  abstract getElements(): NodeListOf<HTMLElement> | HTMLElement[]
  abstract validateElement(el: HTMLElement): {
    isValid: boolean
    message?: string
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

  protected startObserving() {
    if (this.observer) return

    const selector = this.getSelector()
    if (!selector) return // Don't observe if no selector is provided

    this.observer = new MutationObserver((mutations) => {
      let shouldRerun = false

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes)
          const removedNodes = Array.from(mutation.removedNodes)

          const hasRelevantChanges = [...addedNodes, ...removedNodes].some(
            (node) => {
              if (node instanceof HTMLElement) {
                // Check if the node itself matches
                if (Array.from(this.getElements()).includes(node)) {
                  return true
                }
                // Check if the node contains any matching elements
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
      }

      if (shouldRerun) {
        this.revalidate()
      }
    })

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  protected stopObserving() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
  }

  // Abstract method that each tool must implement to provide its selector
  abstract getSelector(): string

  protected revalidate() {
    // Clean up existing validations
    this.cleanup()
    // Rerun validation
    this.apply()
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
    this.startObserving() // Start observing after initial validation
    return { success: true, issues }
  }

  cleanup(): ToolResult {
    if (!this.isActive) {
      return { success: false }
    }

    this.stopObserving() // Stop observing when cleaning up

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
