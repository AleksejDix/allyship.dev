// AuditPanel component
class AuditPanel {
  constructor() {
    this.container = null
    this.results = null
    this.activeCategory = null
  }

  initialize(results) {
    this.results = results
    this.render()
  }

  render() {
    if (!this.container) {
      this.container = document.createElement("div")
      this.container.className = "audit-panel"
      this.container.innerHTML = `
        <style>
          .audit-panel {
            padding: 16px;
            height: 100%;
            overflow-y: auto;
            background: #1a1a1a;
            color: #ffffff;
          }

          .audit-summary {
            margin-bottom: 24px;
            padding: 16px;
            background: #2d2d2d;
            border-radius: 8px;
          }

          .audit-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-top: 16px;
          }

          .stat-item {
            text-align: center;
            padding: 12px;
            background: #3d3d3d;
            border-radius: 6px;
          }

          .stat-number {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 14px;
            opacity: 0.8;
          }

          .category-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .category-item {
            background: #2d2d2d;
            border-radius: 8px;
            overflow: hidden;
          }

          .category-header {
            padding: 16px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .category-header:hover {
            background: #3d3d3d;
          }

          .category-content {
            padding: 16px;
            border-top: 1px solid #3d3d3d;
            display: none;
          }

          .category-content.active {
            display: block;
          }

          .rule-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .rule-item {
            background: #3d3d3d;
            border-radius: 6px;
            padding: 12px;
          }

          .rule-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .rule-name {
            font-weight: bold;
          }

          .wcag-tag {
            font-size: 12px;
            padding: 4px 8px;
            background: #4d4d4d;
            border-radius: 4px;
          }

          .issue-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .issue-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: #2d2d2d;
            border-radius: 4px;
            cursor: pointer;
          }

          .issue-item:hover {
            background: #4d4d4d;
          }

          .issue-status {
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }

          .issue-status.passed {
            background: #4caf50;
          }

          .issue-status.failed {
            background: #f44336;
          }

          .issue-message {
            flex: 1;
            font-size: 14px;
          }
        </style>

        <div class="audit-summary">
          <h2>Accessibility Audit Results</h2>
          <div class="audit-stats">
            <div class="stat-item">
              <div class="stat-number">${this.results.summary.total}</div>
              <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${this.results.summary.passed}</div>
              <div class="stat-label">Passed</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${this.results.summary.failed}</div>
              <div class="stat-label">Failed</div>
            </div>
          </div>
        </div>

        <div class="category-list">
          ${Object.entries(this.results.categories)
            .map(([id, category]) => this.renderCategory(id, category))
            .join("")}
        </div>
      `

      // Add event listeners
      this.container.addEventListener("click", (e) => {
        const categoryHeader = e.target.closest(".category-header")
        if (categoryHeader) {
          const content = categoryHeader.nextElementSibling
          const wasActive = content.classList.contains("active")

          // Close all category contents
          this.container.querySelectorAll(".category-content").forEach((el) => {
            el.classList.remove("active")
          })

          // Toggle clicked category
          if (!wasActive) {
            content.classList.add("active")
          }
        }

        const issueItem = e.target.closest(".issue-item")
        if (issueItem) {
          const elementId = issueItem.dataset.elementId
          const element = document.querySelector(
            `[data-audit-id="${elementId}"]`
          )
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        }
      })
    }

    return this.container
  }

  renderCategory(id, category) {
    const rules = Object.entries(category.rules)
    const failedRules = rules.filter(([_, rule]) =>
      rule.results.some((result) => !result.passed)
    )
    const passedRules = rules.filter(([_, rule]) =>
      rule.results.every((result) => result.passed)
    )

    return `
      <div class="category-item">
        <div class="category-header">
          <h3>${category.name}</h3>
          <span>${failedRules.length} issues</span>
        </div>
        <div class="category-content ${this.activeCategory === id ? "active" : ""}">
          <p>${category.description}</p>
          <div class="rule-list">
            ${failedRules.map(([ruleId, rule]) => this.renderRule(ruleId, rule)).join("")}
            ${passedRules.map(([ruleId, rule]) => this.renderRule(ruleId, rule)).join("")}
          </div>
        </div>
      </div>
    `
  }

  renderRule(id, rule) {
    return `
      <div class="rule-item">
        <div class="rule-header">
          <span class="rule-name">${rule.name}</span>
          <span class="wcag-tag">WCAG ${rule.wcag}</span>
        </div>
        <div class="issue-list">
          ${rule.results
            .map(
              (result) => `
            <div class="issue-item" data-element-id="${result.element.dataset.auditId}">
              <div class="issue-status ${result.passed ? "passed" : "failed"}"></div>
              <div class="issue-message">${result.message}</div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
  }

  cleanup() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container)
    }
  }
}

// Make component available globally
window.AuditPanel = AuditPanel
