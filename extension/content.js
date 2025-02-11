// Create and inject the editor wrapper
function createEditorWrapper() {
  // Save original body content
  const originalContent = document.body.innerHTML

  // Create wrapper elements
  const editorWrapper = document.createElement("div")
  editorWrapper.id = "ally-studio-wrapper"

  // Create toolbar
  const toolbar = document.createElement("div")
  toolbar.id = "ally-studio-toolbar"

  // Create content container
  const contentContainer = document.createElement("div")
  contentContainer.id = "ally-studio-content"
  contentContainer.innerHTML = originalContent

  // Add elements to wrapper
  editorWrapper.appendChild(toolbar)
  editorWrapper.appendChild(contentContainer)

  // Replace body content with our wrapper
  document.body.innerHTML = ""
  document.body.appendChild(editorWrapper)
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "activateEditor") {
    createEditorWrapper()
    sendResponse({ success: true })
  }
  return true
})

// Add styles for the wrapper UI
const styles = `
  #ally-studio-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: 240px 1fr 300px;
    background: #1a1a1a;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
    z-index: 999999;
  }

  .sidebar {
    background: #1e293b;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }

  .sidebar.right {
    border-right: none;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }

  .main-content {
    position: relative;
    background: transparent;
    padding: 16px;
    overflow: hidden;
  }

  #ally-studio-iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 8px;
    background: transparent;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  }

  .tool-btn {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    cursor: pointer;
    color: white;
    font-size: 14px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    text-align: left;
  }

  .tool-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .tool-btn.active {
    background: #2563eb;
    border-color: #3b82f6;
  }

  .tool-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tool-group-title {
    font-size: 12px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 4px;
    padding: 0 4px;
  }

  .highlight-container {
    position: absolute;
    top: 16px;  /* Match iframe padding */
    left: 16px; /* Match iframe padding */
    right: 16px;
    bottom: 16px;
    pointer-events: none;
    z-index: 1000;
    border-radius: 8px; /* Match iframe border-radius */
    overflow: hidden;
  }

  .highlight {
    position: absolute;
    pointer-events: none;
    transition: all 0.2s ease;
  }

  .highlight-label {
    position: absolute;
    top: -24px;
    left: 0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    color: white;
  }
`

const styleSheet = document.createElement("style")
styleSheet.textContent = styles
document.head.appendChild(styleSheet)

// Initialize content script
console.log("AllyStudio content script loaded")

// Keep track of overlay instance
let overlayInstance = null

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request.action)

  if (request.action === "initializeOverlay") {
    try {
      // Remove existing overlay if it exists
      if (overlayInstance) {
        overlayInstance.cleanup()
      }

      // Create new overlay instance
      overlayInstance = new AccessibilityOverlay()
      overlayInstance.initialize()

      sendResponse({ success: true })
    } catch (error) {
      console.error("Failed to initialize overlay:", error)
      sendResponse({ success: false, error: error.message })
    }
    return true
  }
})

// AllyStudio Content Script
class AccessibilityOverlay {
  constructor() {
    this.wrapper = null
    this.leftSidebar = null
    this.rightSidebar = null
    this.iframe = null
    this.iframeDoc = null
    this.highlights = []
    this.cleanupFunctions = []
    this.activeTools = new Set()
  }

  initialize() {
    console.log("Initializing overlay...")

    // Create wrapper
    this.wrapper = document.createElement("div")
    this.wrapper.id = "ally-studio-wrapper"

    // Add styles
    const style = document.createElement("style")
    style.id = "ally-studio-styles"
    style.textContent = `
      #ally-studio-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: grid;
        grid-template-columns: 240px 1fr 300px;
        background: #1a1a1a;
        color: white;
        font-family: system-ui, -apple-system, sans-serif;
        z-index: 999999;
      }

      .sidebar {
        background: #1e293b;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
      }

      .sidebar.right {
        border-right: none;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
      }

      .main-content {
        position: relative;
        background: transparent;
        padding: 16px;
        overflow: hidden;
      }

      #ally-studio-iframe {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 8px;
        background: transparent;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      }

      .tool-btn {
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        cursor: pointer;
        color: white;
        font-size: 14px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        text-align: left;
      }

      .tool-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .tool-btn.active {
        background: #2563eb;
        border-color: #3b82f6;
      }

      .tool-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .tool-group-title {
        font-size: 12px;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 4px;
        padding: 0 4px;
      }

      .highlight-container {
        position: absolute;
        top: 16px;  /* Match iframe padding */
        left: 16px; /* Match iframe padding */
        right: 16px;
        bottom: 16px;
        pointer-events: none;
        z-index: 1000;
        border-radius: 8px; /* Match iframe border-radius */
        overflow: hidden;
      }

      .highlight {
        position: absolute;
        pointer-events: none;
        transition: all 0.2s ease;
      }

      .highlight-label {
        position: absolute;
        top: -24px;
        left: 0;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        color: white;
      }
    `
    document.head.appendChild(style)

    // Create left sidebar
    this.leftSidebar = document.createElement("div")
    this.leftSidebar.className = "sidebar"

    // Create main content area
    const mainContent = document.createElement("div")
    mainContent.className = "main-content"

    // Create iframe with sandbox permissions
    this.iframe = document.createElement("iframe")
    this.iframe.id = "ally-studio-iframe"
    this.iframe.src = window.location.href
    this.iframe.setAttribute("title", "Website content")
    this.iframe.setAttribute(
      "sandbox",
      "allow-same-origin allow-scripts allow-forms"
    )

    // Wait for iframe to load
    this.iframe.addEventListener("load", () => {
      try {
        // Get iframe document
        this.iframeDoc =
          this.iframe.contentDocument || this.iframe.contentWindow.document

        // Add styles to iframe document
        const style = document.createElement("style")
        style.textContent = `
          .ally-highlight {
            position: relative !important;
            outline: 2px solid #06b6d4 !important;
            outline-offset: 2px !important;
            background-color: rgba(6, 182, 212, 0.15) !important;
          }

          .ally-label {
            position: absolute !important;
            top: -24px !important;
            left: 0 !important;
            background: #0891b2 !important;
            color: white !important;
            padding: 2px 8px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            z-index: 999999 !important;
            pointer-events: none !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }

          .ally-bug-button {
            position: absolute !important;
            top: -24px !important;
            right: 0 !important;
            background: #dc2626 !important;
            color: white !important;
            padding: 2px 8px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            cursor: pointer !important;
            border: none !important;
            z-index: 999999 !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }

          .ally-bug-button:hover {
            background: #b91c1c !important;
          }
        `
        this.iframeDoc.head.appendChild(style)

        // Re-run active tools
        this.activeTools.forEach((tool) => {
          const button = this.wrapper.querySelector(`[data-tool="${tool}"]`)
          if (button) {
            this.runTool(tool)
          }
        })

        console.log("Iframe loaded successfully")
      } catch (error) {
        console.error("Failed to access iframe content:", error)
        // Show error in results area
        const resultsArea = document.getElementById("ally-results-area")
        if (resultsArea) {
          resultsArea.innerHTML = `
            <div style="color: #ef4444;">
              Unable to analyze this website due to security restrictions.
              <br><br>
              This can happen when:
              <ul style="list-style: disc; padding-left: 20px; margin-top: 8px;">
                <li>The website blocks being loaded in iframes</li>
                <li>The website has strict security policies</li>
                <li>The website requires authentication</li>
              </ul>
            </div>
          `
        }
      }
    })

    // Create highlight container for overlays
    const highlightContainer = document.createElement("div")
    highlightContainer.className = "highlight-container"
    highlightContainer.style.cssText = `
      position: absolute;
      top: 16px;  /* Match iframe padding */
      left: 16px; /* Match iframe padding */
      right: 16px;
      bottom: 16px;
      pointer-events: none;
      z-index: 1000;
      border-radius: 8px; /* Match iframe border-radius */
      overflow: hidden;
    `
    mainContent.appendChild(highlightContainer)

    // Add iframe and highlight container to main content
    mainContent.appendChild(this.iframe)

    // Create right sidebar
    this.rightSidebar = document.createElement("div")
    this.rightSidebar.className = "sidebar right"

    // Add everything to wrapper
    this.wrapper.appendChild(this.leftSidebar)
    this.wrapper.appendChild(mainContent)
    this.wrapper.appendChild(this.rightSidebar)

    // Add wrapper to body
    document.body.appendChild(this.wrapper)

    // Add tools to sidebars
    this.addLeftSidebarTools()
    this.addRightSidebarTools()

    console.log("Overlay initialized")
  }

  addLeftSidebarTools() {
    // Navigation tools group
    const navGroup = document.createElement("div")
    navGroup.className = "tool-group"
    navGroup.innerHTML = `
      <div class="tool-group-title">Navigation</div>
      <button class="tool-btn" data-tool="landmarks">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16v16H4z"></path>
          <path d="M9 9h6v6H9z"></path>
        </svg>
        Landmarks
      </button>
      <button class="tool-btn" data-tool="headings">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12h16"></path>
          <path d="M4 6h16"></path>
          <path d="M4 18h12"></path>
        </svg>
        Headings
      </button>
      <button class="tool-btn" data-tool="keyboard">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"></path>
        </svg>
        Keyboard Nav
      </button>
    `

    // Add click listeners to all tool buttons
    navGroup.querySelectorAll(".tool-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const tool = button.dataset.tool
        if (tool) {
          this.toggleTool(tool, button)
        }
      })
    })

    this.leftSidebar.appendChild(navGroup)

    // Visual tools group
    const visualGroup = document.createElement("div")
    visualGroup.className = "tool-group"
    visualGroup.innerHTML = `
      <div class="tool-group-title">Visual</div>
      <button class="tool-btn" data-tool="contrast">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2v20"></path>
        </svg>
        Contrast
      </button>
      <button class="tool-btn" data-tool="spacing">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 6H3M21 12H3M21 18H3"></path>
        </svg>
        Spacing
      </button>
    `

    // Add click listeners to visual tool buttons
    visualGroup.querySelectorAll(".tool-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const tool = button.dataset.tool
        if (tool) {
          this.toggleTool(tool, button)
        }
      })
    })

    this.leftSidebar.appendChild(visualGroup)

    // Add close button at the bottom
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
    this.leftSidebar.appendChild(closeBtn)
  }

  addRightSidebarTools() {
    // AI tools group
    const aiGroup = document.createElement("div")
    aiGroup.className = "tool-group"
    aiGroup.innerHTML = `
      <div class="tool-group-title">AI Tools</div>
      <button class="tool-btn" data-tool="ai-suggest">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
        AI Suggestions
      </button>
      <button class="tool-btn" data-tool="alt-text">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        Generate Alt Text
      </button>
    `
    this.rightSidebar.appendChild(aiGroup)

    // Results area for AI tools
    const resultsArea = document.createElement("div")
    resultsArea.id = "ally-results-area"
    resultsArea.style.cssText = `
      margin-top: 16px;
      flex: 1;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      padding: 12px;
      font-size: 14px;
    `
    resultsArea.textContent = "Select a tool to begin analysis"
    this.rightSidebar.appendChild(resultsArea)
  }

  cleanup() {
    // Run all cleanup functions
    this.cleanupFunctions.forEach((cleanup) => cleanup())
    this.cleanupFunctions = []

    // Remove all highlights
    this.clearHighlights()

    // Remove wrapper
    if (this.wrapper) {
      this.wrapper.remove()
      this.wrapper = null
    }

    // Remove any added styles
    const style = document.getElementById("ally-studio-styles")
    if (style) {
      style.remove()
    }
  }

  toggleTool(tool, button) {
    if (button.classList.contains("active")) {
      button.classList.remove("active")
      this.activeTools.delete(tool)
      this.clearHighlights()
    } else {
      button.classList.add("active")
      this.activeTools.add(tool)
      this.runTool(tool)
    }
  }

  runTool(tool) {
    if (!this.iframeDoc) {
      console.warn("Iframe document not available")
      return
    }

    switch (tool) {
      case "landmarks":
        this.highlightLandmarks()
        break
      case "contrast":
        this.checkContrast()
        break
      case "keyboard":
        this.testKeyboardNav()
        break
      case "headings":
        this.analyzeHeadings()
        break
      case "ai-suggest":
        this.getAISuggestions()
        break
    }
  }

  clearHighlights() {
    if (!this.iframeDoc) return

    this.iframeDoc.querySelectorAll(".ally-highlight").forEach((element) => {
      element.classList.remove("ally-highlight")
      const label = element.querySelector(".ally-label")
      const bugButton = element.querySelector(".ally-bug-button")
      if (label) label.remove()
      if (bugButton) bugButton.remove()
    })
  }

  highlightElement(element, options = {}) {
    if (!this.iframeDoc || !element) return null

    // Add highlight class
    element.classList.add("ally-highlight")

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
    element.appendChild(bugButton)

    // Make element position relative if it isn't already
    const computedStyle = this.iframe.contentWindow.getComputedStyle(element)
    if (computedStyle.position === "static") {
      element.style.position = "relative"
    }

    return element
  }

  highlightLandmarks() {
    if (!this.iframeDoc) {
      console.warn("Iframe document not available")
      return
    }

    // Clear existing highlights
    this.clearHighlights()

    // Find all landmark regions
    const landmarks = this.iframeDoc.querySelectorAll(
      [
        "main",
        "nav",
        "aside",
        "header",
        "footer",
        "section[aria-label]",
        "section[aria-labelledby]",
        'div[role="main"]',
        'div[role="navigation"]',
        'div[role="complementary"]',
        'div[role="banner"]',
        'div[role="contentinfo"]',
      ].join(",")
    )

    // Update results area
    const resultsArea = document.getElementById("ally-results-area")
    if (resultsArea) {
      resultsArea.innerHTML = `
        <div class="tool-results">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Landmarks Found (${landmarks.length})</h3>
          <div style="color: ${landmarks.length === 0 ? "#ef4444" : "#22c55e"}">
            ${
              landmarks.length === 0
                ? "No landmarks found. Consider adding semantic HTML elements or ARIA landmarks."
                : `Found ${landmarks.length} landmarks on the page.`
            }
          </div>
          ${
            landmarks.length > 0
              ? `
            <ul style="list-style: none; padding: 0; margin: 8px 0;">
              ${Array.from(landmarks)
                .map(
                  (landmark) => `
                <li style="margin: 4px 0; display: flex; align-items: center; gap: 8px;">
                  <span style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6;"></span>
                  ${landmark.tagName.toLowerCase()}${landmark.getAttribute("role") ? ` [role="${landmark.getAttribute("role")}"]` : ""}
                </li>
              `
                )
                .join("")}
            </ul>
          `
              : ""
          }
        </div>
      `
    }

    // Highlight each landmark
    landmarks.forEach((landmark) => {
      this.highlightElement(landmark, {
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        label:
          landmark.tagName.toLowerCase() +
          (landmark.getAttribute("role")
            ? ` [${landmark.getAttribute("role")}]`
            : ""),
      })
    })
  }

  analyzeHeadings() {
    if (!this.iframeDoc) {
      console.warn("Iframe document not available")
      return
    }

    // Clear existing highlights
    this.clearHighlights()

    // Find all headings
    const headings = this.iframeDoc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const headingLevels = Array.from(headings).map((h) => ({
      level: parseInt(h.tagName[1]),
      text: h.textContent.trim(),
      element: h,
    }))

    // Check for heading structure issues
    const issues = []
    let previousLevel = 0

    headingLevels.forEach((heading) => {
      if (heading.level - previousLevel > 1) {
        issues.push(
          `Skipped heading level: Found h${heading.level} after h${previousLevel}`
        )
      }
      previousLevel = heading.level
    })

    // Check if there's exactly one h1
    const h1Count = headingLevels.filter((h) => h.level === 1).length
    if (h1Count === 0) {
      issues.push("No main heading (h1) found on the page")
    } else if (h1Count > 1) {
      issues.push(`Multiple main headings (h1) found: ${h1Count}`)
    }

    // Update results area
    const resultsArea = document.getElementById("ally-results-area")
    if (resultsArea) {
      resultsArea.innerHTML = `
        <div class="tool-results">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Heading Structure Analysis</h3>
          <div style="color: ${issues.length === 0 ? "#22c55e" : "#ef4444"}">
            ${
              issues.length === 0
                ? "Heading structure looks good!"
                : `Found ${issues.length} issue${issues.length === 1 ? "" : "s"} with heading structure`
            }
          </div>
          ${
            issues.length > 0
              ? `
            <ul style="list-style: disc; padding-left: 20px; margin: 8px 0; color: #ef4444">
              ${issues.map((issue) => `<li>${issue}</li>`).join("")}
            </ul>
          `
              : ""
          }
          <div style="margin-top: 12px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px;">Heading Outline:</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${headingLevels
                .map(
                  (h) => `
                <li style="margin: 4px 0; padding-left: ${(h.level - 1) * 16}px; display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 12px; color: #64748b">h${h.level}</span>
                  ${h.text}
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
    }

    // Highlight each heading
    headingLevels.forEach(({ element: heading, level }) => {
      const colors = {
        1: "#ef4444", // red
        2: "#f97316", // orange
        3: "#eab308", // yellow
        4: "#22c55e", // green
        5: "#3b82f6", // blue
        6: "#8b5cf6", // purple
      }

      this.highlightElement(heading, {
        borderColor: colors[level],
        backgroundColor: `${colors[level]}1a`, // 10% opacity
        label: `h${level}`,
      })
    })
  }

  checkContrast() {
    if (!this.iframeDoc) {
      console.warn("Iframe document not available")
      return
    }

    // Clear existing highlights
    this.clearHighlights()

    // Function to get computed color and background color
    const getColors = (element) => {
      const style = this.iframe.contentWindow.getComputedStyle(element)
      return {
        color: style.color,
        backgroundColor: style.backgroundColor,
      }
    }

    // Function to parse RGB/RGBA color
    const parseColor = (color) => {
      const match = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/
      )
      if (!match) return null
      return {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: match[4] ? parseFloat(match[4]) : 1,
      }
    }

    // Function to calculate relative luminance
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    // Function to calculate contrast ratio
    const getContrastRatio = (l1, l2) => {
      const lighter = Math.max(l1, l2)
      const darker = Math.min(l1, l2)
      return (lighter + 0.05) / (darker + 0.05)
    }

    // Find all text elements
    const textElements = this.iframeDoc.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, a, span, li, td, th, dt, dd"
    )
    const contrastIssues = []

    textElements.forEach((element) => {
      const { color, backgroundColor } = getColors(element)
      const textColor = parseColor(color)
      const bgColor = parseColor(backgroundColor)

      if (!textColor || !bgColor) return

      const textLuminance = getLuminance(textColor.r, textColor.g, textColor.b)
      const bgLuminance = getLuminance(bgColor.r, bgColor.g, bgColor.b)
      const ratio = getContrastRatio(textLuminance, bgLuminance)

      const fontSize = parseFloat(
        this.iframe.contentWindow.getComputedStyle(element).fontSize
      )
      const isLargeText =
        fontSize >= 18 ||
        (fontSize >= 14 &&
          this.iframe.contentWindow.getComputedStyle(element).fontWeight >= 700)
      const requiredRatio = isLargeText ? 3 : 4.5

      if (ratio < requiredRatio) {
        contrastIssues.push({
          element,
          ratio,
          required: requiredRatio,
          text:
            element.textContent.trim().slice(0, 50) +
            (element.textContent.length > 50 ? "..." : ""),
        })

        this.highlightElement(element, {
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          label: `Contrast: ${ratio.toFixed(2)}:1`,
        })
      }
    })

    // Update results area
    const resultsArea = document.getElementById("ally-results-area")
    if (resultsArea) {
      resultsArea.innerHTML = `
        <div class="tool-results">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Contrast Analysis</h3>
          <div style="color: ${contrastIssues.length === 0 ? "#22c55e" : "#ef4444"}">
            ${
              contrastIssues.length === 0
                ? "All text elements have sufficient contrast!"
                : `Found ${contrastIssues.length} contrast issue${contrastIssues.length === 1 ? "" : "s"}`
            }
          </div>
          ${
            contrastIssues.length > 0
              ? `
            <ul style="list-style: none; padding: 0; margin: 8px 0;">
              ${contrastIssues
                .map(
                  (issue) => `
                <li style="margin: 8px 0; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                  <div style="color: #ef4444">
                    Ratio: ${issue.ratio.toFixed(2)}:1 (Required: ${issue.required}:1)
                  </div>
                  <div style="margin-top: 4px; font-size: 12px;">
                    "${issue.text}"
                  </div>
                </li>
              `
                )
                .join("")}
            </ul>
          `
              : ""
          }
        </div>
      `
    }
  }

  testKeyboardNav() {
    if (!this.iframeDoc) {
      console.warn("Iframe document not available")
      return
    }

    // Clear existing highlights
    this.clearHighlights()

    // Find all focusable elements
    const focusableElements = this.iframeDoc.querySelectorAll(`
      a[href],
      button,
      input,
      select,
      textarea,
      [tabindex],
      [onclick]
    `)

    const issues = []
    focusableElements.forEach((element) => {
      // Check for proper focus indicators
      const style = this.iframe.contentWindow.getComputedStyle(element)
      const hasOutline = style.outline !== "none" && style.outline !== "0"
      const hasOtherFocusStyles =
        style.getPropertyValue("--focus-visible") ||
        element.matches(":focus-visible") ||
        element.hasAttribute("data-focus-visible-added")

      if (!hasOutline && !hasOtherFocusStyles) {
        issues.push({
          element,
          type: "focus",
          message: "Missing visible focus indicator",
        })
      }

      // Check for proper ARIA labels
      if (
        !element.hasAttribute("aria-label") &&
        !element.hasAttribute("aria-labelledby") &&
        !element.hasAttribute("title") &&
        element.textContent.trim() === ""
      ) {
        issues.push({
          element,
          type: "label",
          message: "Missing accessible label",
        })
      }

      // Highlight the element
      this.highlightElement(element, {
        borderColor: issues.length > 0 ? "#ef4444" : "#22c55e",
        backgroundColor:
          issues.length > 0
            ? "rgba(239, 68, 68, 0.1)"
            : "rgba(34, 197, 94, 0.1)",
        label:
          element.tagName.toLowerCase() +
          (element.getAttribute("role")
            ? ` [${element.getAttribute("role")}]`
            : ""),
      })
    })

    // Update results area
    const resultsArea = document.getElementById("ally-results-area")
    if (resultsArea) {
      resultsArea.innerHTML = `
        <div class="tool-results">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Keyboard Navigation Analysis</h3>
          <div style="margin-bottom: 8px;">
            Found ${focusableElements.length} focusable elements
          </div>
          <div style="color: ${issues.length === 0 ? "#22c55e" : "#ef4444"}">
            ${
              issues.length === 0
                ? "All focusable elements have proper indicators and labels!"
                : `Found ${issues.length} issue${issues.length === 1 ? "" : "s"}`
            }
          </div>
          ${
            issues.length > 0
              ? `
            <ul style="list-style: none; padding: 0; margin: 8px 0;">
              ${issues
                .map(
                  (issue) => `
                <li style="margin: 8px 0; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 4px;">
                  <div style="color: #ef4444">
                    ${issue.message}
                  </div>
                  <div style="margin-top: 4px; font-size: 12px;">
                    ${issue.element.outerHTML.slice(0, 100)}${issue.element.outerHTML.length > 100 ? "..." : ""}
                  </div>
                </li>
              `
                )
                .join("")}
            </ul>
          `
              : ""
          }
        </div>
      `
    }
  }

  async getAISuggestions() {
    // Implementation of getAISuggestions method
  }
}
