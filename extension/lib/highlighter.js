export class Highlighter {
  constructor(iframeDoc) {
    this.iframeDoc = iframeDoc
    this.highlights = new Set()
  }

  highlight(element, options = {}) {
    if (!this.iframeDoc || !element) return null

    // Add highlight class
    element.classList.add("ally-highlight")
    this.highlights.add(element)

    // Add label if specified
    if (options.label) {
      const label = document.createElement("div")
      label.className = "ally-label"
      label.textContent = options.label
      element.appendChild(label)
    }

    // Add bug report button
    const bugButton = document.createElement("button")
    bugButton.className = "ally-bug-button"
    bugButton.textContent = "🐛 Report"
    bugButton.onclick = (e) => {
      e.stopPropagation()
      this.reportIssue(element, options)
    }
    element.appendChild(bugButton)

    // Make element position relative if it isn't already
    const computedStyle = this.iframeDoc.defaultView.getComputedStyle(element)
    if (computedStyle.position === "static") {
      element.style.position = "relative"
    }

    return element
  }

  clearHighlights() {
    this.highlights.forEach((element) => {
      element.classList.remove("ally-highlight")
      const label = element.querySelector(".ally-label")
      const bugButton = element.querySelector(".ally-bug-button")
      if (label) label.remove()
      if (bugButton) bugButton.remove()
    })
    this.highlights.clear()
  }

  reportIssue(element, options) {
    const issue = {
      element: element.tagName.toLowerCase(),
      role: element.getAttribute("role"),
      label: options.label,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    }

    const resultsArea = document.getElementById("ally-results-area")
    if (resultsArea) {
      resultsArea.innerHTML = `
        <div class="tool-results">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Issue Report</h3>
          <pre style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px; overflow: auto;">
${JSON.stringify(issue, null, 2)}
          </pre>
        </div>
      `
    }
  }
}
