export class Sidebar {
  constructor(position = "left") {
    this.element = document.createElement("div")
    this.element.className = `sidebar${position === "right" ? " right" : ""}`
    this.toolGroups = new Map()
  }

  addToolGroup(name, title) {
    const group = document.createElement("div")
    group.className = "tool-group"
    group.innerHTML = `
      <div class="tool-group-title">${title}</div>
      <div class="tool-group-content"></div>
    `
    this.element.appendChild(group)
    this.toolGroups.set(name, group.querySelector(".tool-group-content"))
    return group
  }

  addTool(groupName, { id, icon, label, onClick }) {
    const group = this.toolGroups.get(groupName)
    if (!group) return

    const button = document.createElement("button")
    button.className = "tool-btn"
    button.dataset.tool = id
    button.dataset.tooltip = label
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${icon}
      </svg>
      <span>${label}</span>
    `
    button.addEventListener("click", onClick)
    group.appendChild(button)
    return button
  }

  setContent(content) {
    this.element.innerHTML = content
  }

  appendContent(content) {
    const div = document.createElement("div")
    div.innerHTML = content
    this.element.appendChild(div)
  }

  showResults(title, content) {
    const resultsGroup =
      this.toolGroups.get("results") || this.addToolGroup("results", "Results")
    const resultsContent = resultsGroup.querySelector(".tool-group-content")
    if (resultsContent) {
      resultsContent.innerHTML = `
        <div class="results-header">
          <h3 class="text-sm font-medium">${title}</h3>
        </div>
        <div class="results-content">
          ${content}
        </div>
      `
    }
  }

  showError(message, details = []) {
    this.showResults(
      "Error",
      `
      <div class="error-message text-red-500">
        ${message}
        ${
          details.length > 0
            ? `
          <ul class="error-details mt-2 text-sm">
            ${details.map((detail) => `<li>${detail}</li>`).join("")}
          </ul>
        `
            : ""
        }
      </div>
    `
    )
  }
}
