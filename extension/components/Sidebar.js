export class Sidebar {
  constructor(position = "left") {
    this.element = document.createElement("div")
    this.element.className = `sidebar${position === "right" ? " right" : ""}`
    this.toolGroups = new Map()
  }

  addToolGroup(name, title) {
    const group = document.createElement("div")
    group.className = "tool-group"
    group.innerHTML = `<div class="tool-group-title">${title}</div>`
    this.element.appendChild(group)
    this.toolGroups.set(name, group)
    return group
  }

  addTool(groupName, { id, icon, label, onClick }) {
    const group = this.toolGroups.get(groupName)
    if (!group) return

    const button = document.createElement("button")
    button.className = "tool-btn"
    button.dataset.tool = id
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${icon}
      </svg>
      ${label}
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
}
