export interface AxeIssue {
  id: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  description: string
  help: string
  helpUrl: string
  nodes: {
    html: string
    target: string[]
    failureSummary: string
  }[]
}

export interface ToolResult {
  success: boolean
  message?: string
}

interface LogStyles {
  info: string
  success: string
  warning: string
  error: string
}

export abstract class BaseTool {
  protected isActive: boolean = false
  protected addedElements: Set<HTMLElement> = new Set()
  private observer: MutationObserver | null = null
  private themeObserver: MediaQueryList | null = null
  private navigationListener: (() => void) | null = null

  private readonly logStyles: LogStyles = {
    info: 'color: #3b82f6; font-weight: bold;', // Blue
    success: 'color: #059669; font-weight: bold;', // Green
    warning: 'color: #d97706; font-weight: bold;', // Orange
    error: 'color: #d93251; font-weight: bold;', // Red
  }

  abstract getSelector(): string
  abstract getElements(): NodeListOf<HTMLElement>
  abstract validateElement(el: HTMLElement): {
    isValid: boolean
    message?: string
  }

  protected startObserving() {
    if (this.observer) return

    const selector = this.getSelector()
    if (!selector) return

    // DOM Changes Observer
    this.observer = new MutationObserver(mutations => {
      let shouldRerun = false

      for (const mutation of mutations) {
        // Check for new/removed nodes
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes)
          const removedNodes = Array.from(mutation.removedNodes)

          const hasRelevantChanges = [...addedNodes, ...removedNodes].some(
            node => {
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
          mutation.type === 'attributes' &&
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

    // Observe DOM changes
    this.observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    })

    // Navigation listener
    this.navigationListener = () => this.revalidate()
    window.addEventListener('popstate', this.navigationListener)
    window.addEventListener('pushstate', this.navigationListener)
    window.addEventListener('replacestate', this.navigationListener)

    // Theme Change Observer
    this.themeObserver = window.matchMedia('(prefers-color-scheme: dark)')
    this.themeObserver.addEventListener('change', this.handleThemeChange)
  }

  protected stopObserving() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    if (this.navigationListener) {
      window.removeEventListener('popstate', this.navigationListener)
      window.removeEventListener('pushstate', this.navigationListener)
      window.removeEventListener('replacestate', this.navigationListener)
      this.navigationListener = null
    }

    if (this.themeObserver) {
      this.themeObserver.removeEventListener('change', this.handleThemeChange)
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
    message?: string
  ): void {
    el.setAttribute('data-ally-state', isValid ? 'valid' : 'error')
    if (message) {
      el.setAttribute('data-ally-label', message)
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

    let hasIssues = false

    elements.forEach(el => {
      const result = this.validateElement(el)
      if (!result.isValid) {
        hasIssues = true
      }
    })

    this.isActive = true
    this.startObserving()
    return {
      success: !hasIssues,
      message: hasIssues ? 'Issues found' : undefined,
    }
  }

  cleanup(): void {
    if (!this.isActive) {
      return
    }

    this.stopObserving()

    const elements = this.getElements()
    elements.forEach(element => {
      element.removeAttribute('data-a11y-highlight')
      element.removeAttribute('data-a11y-message')
    })

    this.addedElements.clear()
    this.isActive = false
  }

  run(mode: 'apply' | 'cleanup'): ToolResult | void {
    if (mode === 'cleanup') {
      this.cleanup()
      return { success: true }
    }

    const elements = this.getElements()
    let hasIssues = false

    elements.forEach(el => {
      const result = this.validateElement(el)
      if (!result.isValid) {
        hasIssues = true
      }
    })

    return {
      success: !hasIssues,
      message: hasIssues ? 'Issues found' : undefined,
    }
  }

  protected logInfo(title: string, ...messages: string[]) {
    console.group(`%c${title}`, this.logStyles.info)
    messages.forEach(msg => console.log(msg))
    console.groupEnd()
  }

  protected logSuccess(title: string, ...messages: string[]) {
    console.group(`%c${title}`, this.logStyles.success)
    messages.forEach(msg => console.log('✓', msg))
    console.groupEnd()
  }

  protected logWarning(title: string, ...messages: string[]) {
    console.group(`%c${title}`, this.logStyles.warning)
    messages.forEach(msg => console.log('⚠', msg))
    console.groupEnd()
  }

  protected logError(title: string, ...messages: string[]) {
    console.group(`%c${title}`, this.logStyles.error)
    messages.forEach(msg => console.log('✕', msg))
    console.groupEnd()
  }

  protected logAxeIssue(issue: AxeIssue) {
    const style =
      issue.impact === 'serious' ? this.logStyles.error : this.logStyles.warning

    console.group(`%cAxe Issue: ${issue.id}`, style)
    console.log('Impact:', issue.impact)
    console.log('Description:', issue.description)
    console.log('Help:', issue.help)
    console.log('Help URL:', issue.helpUrl)
    console.log('Nodes:', issue.nodes)
    console.groupEnd()
  }
}
