import { Sidebar } from "../components/Sidebar.js"
import { baseStyles, highlightStyles, toolStyles } from "../styles/main.js"
import { LandmarksTool } from "../tools/landmarks.js"
import { Highlighter } from "./highlighter.js"

// Create custom element for overlay
class AllyStudioOverlay extends HTMLElement {
  constructor() {
    super()

    // Create shadow root for style isolation
    this.attachShadow({ mode: "open" })

    // Initialize state
    this.tools = new Map()
    this.activeTools = new Set()
    this.styles = {
      base: baseStyles,
      highlights: highlightStyles,
      tools: toolStyles,
    }

    // Create styles
    const style = document.createElement("style")
    style.textContent = `
      ${baseStyles}
      ${toolStyles}

      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999;
        display: grid;
        grid-template-areas:
          "topbar topbar topbar"
          "left main right";
        grid-template-rows: 28px 1fr;
        grid-template-columns: 56px 1fr 300px;
        background: #1a1a1a;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
      }

      .top-bar {
        grid-area: topbar;
        background: rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        padding: 0 12px;
        gap: 12px;
        -webkit-app-region: drag;
        user-select: none;
        height: 28px;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        font-size: 13px;
      }

      .circle {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: currentColor;
        opacity: 0.8;
      }

      .g-1 { color: #3b82f6; }
      .g-2 { color: #06b6d4; }

      .menu {
        display: flex;
        gap: 16px;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.8);
      }

      .menu-item {
        cursor: pointer;
        -webkit-app-region: no-drag;
      }

      .menu-item:hover {
        color: white;
      }

      .sidebar {
        background: #1e293b;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 8px;
      }

      .sidebar.left {
        grid-area: left;
      }

      .sidebar.right {
        grid-area: right;
        border-right: none;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
      }

      .main-content {
        grid-area: main;
        position: relative;
        background: transparent;
        overflow: hidden;
      }

      #ally-studio-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      }

      .tool-group {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .tool-group:last-child {
        border-bottom: none;
      }

      .tool-group-title {
        font-size: 12px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 8px;
        text-transform: uppercase;
      }

      .tool-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 8px;
        background: rgba(255, 255, 255, 0.05);
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
      }

      .tool-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .tool-btn.active {
        background: #3b82f6;
      }

      .tool-btn svg {
        width: 16px;
        height: 16px;
        opacity: 0.8;
      }

      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
    `

    // Create layout
    const layout = document.createElement("div")
    layout.innerHTML = `
      <div class="top-bar">
        <div class="logo">
          <div class="circle g-1" style="animation: pulse 2s infinite"></div>
          <div class="circle g-2" style="animation: pulse 2s infinite 0.5s"></div>
          <span style="font-weight: 600">Allyship.dev</span>
        </div>
        <div class="menu">
          <div class="menu-item">Tools</div>
          <div class="menu-item">Settings</div>
          <div class="menu-item">Help</div>
        </div>
      </div>
      <div class="sidebar left"></div>
      <div class="main-content">
        <iframe id="ally-studio-iframe" title="Website content"></iframe>
      </div>
      <div class="sidebar right"></div>
    `

    // Add to shadow DOM
    this.shadowRoot.appendChild(style)
    this.shadowRoot.appendChild(layout)

    // Store references
    this.iframe = this.shadowRoot.querySelector("#ally-studio-iframe")
    this.leftSidebar = new Sidebar("left")
    this.rightSidebar = new Sidebar("right")

    // Add sidebars to layout
    this.shadowRoot
      .querySelector(".sidebar.left")
      .appendChild(this.leftSidebar.element)
    this.shadowRoot
      .querySelector(".sidebar.right")
      .appendChild(this.rightSidebar.element)

    // Initialize tools
    this.initializeTools()
  }

  connectedCallback() {
    // Set iframe source to current page
    this.iframe.src = window.location.href
    this.iframe.setAttribute(
      "sandbox",
      "allow-same-origin allow-scripts allow-forms"
    )

    // Initialize tools
    this.initializeTools()

    // Listen for iframe load
    this.iframe.addEventListener("load", () => this.handleIframeLoad())
  }

  disconnectedCallback() {
    this.cleanup()
  }

  handleIframeLoad() {
    try {
      // Get iframe document
      this.iframeDoc =
        this.iframe.contentDocument || this.iframe.contentWindow.document

      // Initialize highlighter
      this.highlighter = new Highlighter(this.iframeDoc)

      // Add styles to iframe document
      const style = document.createElement("style")
      style.textContent = this.styles.highlights
      this.iframeDoc.head.appendChild(style)

      // Re-run active tools
      this.activeTools.forEach((toolId) => {
        const tool = this.tools.get(toolId)
        if (tool) {
          this.runTool(toolId)
        }
      })

      console.log("Iframe loaded successfully")
    } catch (error) {
      console.error("Failed to access iframe content:", error)
      this.showError(
        "Unable to analyze this website due to security restrictions.",
        [
          "The website blocks being loaded in iframes",
          "The website has strict security policies",
          "The website requires authentication",
        ]
      )
    }
  }

  initializeTools() {
    // Navigation tools
    this.addLeftSidebarTools()

    // Add close button
    const closeBtn = document.createElement("button")
    closeBtn.className = "tool-btn"
    closeBtn.style.marginTop = "auto"
    closeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      Close Inspector
    `
    closeBtn.addEventListener("click", () => this.cleanup())
    this.leftSidebar.element.appendChild(closeBtn)
  }

  addLeftSidebarTools() {
    // Navigation tools group
    const navGroup = document.createElement("div")
    navGroup.className = "tool-group"
    navGroup.innerHTML = `
      <div class="tool-group-title">Nav</div>
      <button class="tool-btn" data-tool="landmarks" data-tooltip="Landmarks">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16v16H4z"></path>
          <path d="M9 9h6v6H9z"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="headings" data-tooltip="Headings">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12h16"></path>
          <path d="M4 6h16"></path>
          <path d="M4 18h12"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="keyboard" data-tooltip="Keyboard Nav">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="M7 16h10"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="focus-order" data-tooltip="Focus Order">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12h8"></path>
          <path d="M12 4v16"></path>
          <path d="M16 12h4"></path>
        </svg>
      </button>
    `

    // Visual tools group
    const visualGroup = document.createElement("div")
    visualGroup.className = "tool-group"
    visualGroup.innerHTML = `
      <div class="tool-group-title">Visual</div>
      <button class="tool-btn" data-tool="contrast" data-tooltip="Color Contrast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2v20"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="spacing" data-tooltip="Spacing">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 6H3"></path>
          <path d="M21 12H3"></path>
          <path d="M21 18H3"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="text-zoom" data-tooltip="Text Zoom">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h6v6"></path>
          <path d="M9 21H3v-6"></path>
          <path d="M21 3l-7 7"></path>
          <path d="M3 21l7-7"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="color-blind" data-tooltip="Color Blindness">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v8"></path>
          <path d="M8 12h8"></path>
        </svg>
      </button>
    `

    // Interactive elements group
    const interactiveGroup = document.createElement("div")
    interactiveGroup.className = "tool-group"
    interactiveGroup.innerHTML = `
      <div class="tool-group-title">UI</div>
      <button class="tool-btn" data-tool="forms" data-tooltip="Form Controls">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="16" rx="2"></rect>
          <path d="M7 8h10"></path>
          <path d="M7 12h10"></path>
          <path d="M7 16h10"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="buttons" data-tooltip="Buttons">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="4" y="6" width="16" height="12" rx="2"></rect>
          <path d="M12 10v4"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="links" data-tooltip="Links">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      </button>
      <button class="tool-btn" data-tool="media" data-tooltip="Media">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="M10 8v8l6-4-6-4z"></path>
        </svg>
      </button>
    `

    // Add click listeners to all tool buttons
    ;[navGroup, visualGroup, interactiveGroup].forEach((group) => {
      group.querySelectorAll(".tool-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const tool = button.dataset.tool
          if (tool) {
            this.toggleTool(tool, button)
          }
        })
      })
      this.leftSidebar.appendChild(group)
    })

    // Add close button at the bottom
    const closeBtn = document.createElement("button")
    closeBtn.className = "tool-btn"
    closeBtn.style.marginTop = "auto"
    closeBtn.setAttribute("data-tooltip", "Close Inspector")
    closeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `
    closeBtn.addEventListener("click", () => this.cleanup())
    this.leftSidebar.appendChild(closeBtn)
  }

  addTool(id, { group, icon, label, tool }) {
    this.tools.set(id, tool)

    return this.leftSidebar.addTool(group, {
      id,
      icon,
      label,
      onClick: () => this.toggleTool(id),
    })
  }

  toggleTool(toolId) {
    const button = this.shadowRoot.querySelector(`[data-tool="${toolId}"]`)
    if (!button) return

    if (button.classList.contains("active")) {
      button.classList.remove("active")
      this.activeTools.delete(toolId)
      this.highlighter?.clearHighlights()
    } else {
      button.classList.add("active")
      this.activeTools.add(toolId)
      this.runTool(toolId)
    }
  }

  runTool(toolId) {
    const tool = this.tools.get(toolId)
    if (!tool) return

    const results = tool.run()
    if (results) {
      const resultsArea = document.getElementById("ally-results-area")
      if (resultsArea) {
        resultsArea.innerHTML = tool.getResultsHTML(results)
      }
    }
  }

  showError(message, reasons = []) {
    const resultsArea = document.getElementById("ally-results-area")
    if (resultsArea) {
      resultsArea.innerHTML = `
        <div style="color: #ef4444;">
          ${message}
          ${
            reasons.length > 0
              ? `
            <br><br>
            This can happen when:
            <ul style="list-style: disc; padding-left: 20px; margin-top: 8px;">
              ${reasons.map((reason) => `<li>${reason}</li>`).join("")}
            </ul>
          `
              : ""
          }
        </div>
      `
    }
  }

  cleanup() {
    // Clear highlights
    this.highlighter?.clearHighlights()

    // Remove iframe
    if (this.iframe) {
      this.iframe.remove()
      this.iframe = null
    }

    // Remove styles
    const style = this.shadowRoot.querySelector("style")
    if (style) {
      style.remove()
    }

    // Reset state
    this.iframeDoc = null
    this.highlighter = null
    this.tools.clear()
    this.activeTools.clear()
  }
}

// Register custom element
customElements.define("ally-studio-overlay", AllyStudioOverlay)

// Export function to create and mount overlay
export function createOverlay() {
  const overlay = document.createElement("ally-studio-overlay")
  document.body.appendChild(overlay)
  return overlay
}
