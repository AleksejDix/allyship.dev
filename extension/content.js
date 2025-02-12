// Import audit tools
import { AuditPanel } from './components/AuditPanel.js';
import { highlightIssue, runAccessibilityAudit } from './tools/audit.js';

// Initialize content script
console.log("AllyStudio content script loaded")

// Create a unique namespace for our extension
const AllyStudioExtension = {
  shadowRoot: null,
  overlayInstance: null,

  initialize() {
    // Create a container for our shadow DOM
    const container = document.createElement('div');
    container.id = 'ally-studio-container';

    // Create shadow root with closed mode for better encapsulation
    this.shadowRoot = container.attachShadow({ mode: 'closed' });

    // Add styles to shadow DOM only
    const styles = document.createElement('style');
    styles.textContent = `
      :host {
        all: initial;
        contain: style layout size;
      }

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
        background: #fff;
        overflow: hidden;
        padding: 16px;
      }

      #ally-studio-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

      .tool-btn svg {
        flex-shrink: 0;
        stroke: currentColor;
      }

      #ally-results-area {
        margin-top: 16px;
        flex: 1;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        padding: 12px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
      }

      .tool-results {
        color: rgba(255, 255, 255, 0.8);
      }

      .highlight-overlay {
        position: absolute;
        pointer-events: none;
        background: rgba(255, 0, 0, 0.2);
        border: 2px solid red;
        z-index: 999999;
      }

      .highlight-label {
        position: absolute;
        top: -25px;
        left: 0;
        background: red;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
      }
    `;
    this.shadowRoot.appendChild(styles);

    // Add container to document
    document.body.appendChild(container);
  },

  createOverlay() {
    const wrapper = document.createElement('div');
    wrapper.id = 'ally-studio-wrapper';

    // Create left sidebar
    const leftSidebar = document.createElement('div');
    leftSidebar.className = 'sidebar';

    // Create main content
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'ally-studio-iframe';
    iframe.setAttribute('title', 'Website content');
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms');
    mainContent.appendChild(iframe);

    // Create right sidebar
    const rightSidebar = document.createElement('div');
    rightSidebar.className = 'sidebar right';

    // Add all elements to wrapper
    wrapper.appendChild(leftSidebar);
    wrapper.appendChild(mainContent);
    wrapper.appendChild(rightSidebar);

    // Add wrapper to shadow root
    this.shadowRoot.appendChild(wrapper);

    // Initialize tools
    this.initializeTools(leftSidebar, rightSidebar);
    this.initializeIframe(iframe);
  },

  initializeTools(leftSidebar, rightSidebar) {
    const tools = [
      {
        name: "Run Accessibility Audit",
        action: () => this.runAudit(),
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>`
      },
      {
        name: "Show Landmarks",
        action: () => this.showLandmarks(),
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <path d="M9 9h6v6H9z"></path>
        </svg>`
      },
      {
        name: "Check Contrast",
        action: () => this.checkContrast(),
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2v20"></path>
        </svg>`
      }
    ];

    tools.forEach(tool => {
      const button = document.createElement('button');
      button.className = 'tool-btn';
      button.innerHTML = `${tool.icon}<span>${tool.name}</span>`;
      button.addEventListener('click', tool.action);
      leftSidebar.appendChild(button);
    });

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'tool-btn';
    closeBtn.style.marginTop = 'auto';
    closeBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      Close Inspector
    `;
    closeBtn.addEventListener('click', () => this.cleanup());
    leftSidebar.appendChild(closeBtn);

    // Create results area
    const resultsArea = document.createElement('div');
    resultsArea.id = 'ally-results-area';
    resultsArea.textContent = 'Select a tool to begin analysis';
    rightSidebar.appendChild(resultsArea);
  },

  initializeIframe(iframe) {
    iframe.addEventListener('load', () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        // Copy current page styles
        const styles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return sheet.href
                ? `<link rel="stylesheet" href="${sheet.href}">`
                : `<style>${Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n')}</style>`;
            } catch (e) {
              return sheet.href ? `<link rel="stylesheet" href="${sheet.href}">` : '';
            }
          })
          .join('\n');

        // Write the HTML to iframe
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base href="${window.location.href}">
              ${styles}
            </head>
            <body>
              ${document.body.innerHTML}
            </body>
          </html>
        `);
        iframeDoc.close();

      } catch (error) {
        console.error('Failed to access iframe content:', error);
        const resultsArea = this.shadowRoot.getElementById('ally-results-area');
        if (resultsArea) {
          resultsArea.innerHTML = `
            <div class="tool-results">
              Unable to analyze this website due to security restrictions.
              <br><br>
              This can happen when:
              <ul style="list-style: disc; padding-left: 20px; margin-top: 8px;">
                <li>The website blocks being loaded in iframes</li>
                <li>The website has strict security policies</li>
                <li>The website requires authentication</li>
              </ul>
            </div>
          `;
        }
      }
    });

    iframe.src = window.location.href;
  },

  cleanup() {
    if (this.shadowRoot) {
      const container = this.shadowRoot.host;
      container.remove();
      this.shadowRoot = null;
    }
  }
};

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "initializeOverlay") {
    AllyStudioExtension.initialize();
    AllyStudioExtension.createOverlay();
    sendResponse({ success: true });
  }
  return true;
});

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
    this.auditPanel = null
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
        overflow: hidden;
      }

      #ally-studio-iframe {
        width: 100%;
        height: 100%;
        border: none;
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
        top: 0;  /* Match iframe padding */
        left: 0; /* Match iframe padding */
        right: 0;
        bottom: 0;
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
    const tools = [
      {
        name: "Run Accessibility Audit",
        action: () => this.runAudit(),
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>`,
      },
      {
        name: "Show Landmarks",
        action: () => this.showLandmarks(),
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <path d="M9 9h6v6H9z"></path>
        </svg>`,
      },
      {
        name: "Check Contrast",
        action: () => this.checkContrast(),
        icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2v20"></path>
        </svg>`,
      },
    ]

    tools.forEach((tool) => {
      const button = document.createElement("button")
      button.className = "tool-btn"
      button.innerHTML = `${tool.icon}<span>${tool.name}</span>`
      button.addEventListener("click", tool.action)
      this.leftSidebar.appendChild(button)
    })

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
    this.leftSidebar.appendChild(closeBtn)
  },

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
  },

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

    if (this.auditPanel) {
      this.auditPanel.cleanup()
      this.auditPanel = null
    }
  },

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
  },

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
  },

  clearHighlights() {
    if (!this.iframeDoc) return

    this.iframeDoc.querySelectorAll(".ally-highlight").forEach((element) => {
      element.classList.remove("ally-highlight")
      const label = element.querySelector(".ally-label")
      const bugButton = element.querySelector(".ally-bug-button")
      if (label) label.remove()
      if (bugButton) bugButton.remove()
    })
  },

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
  },

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
  },

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
  },

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
  },

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
  },

  async getAISuggestions() {
    // Implementation of getAISuggestions method
  },

  async runAudit() {
    // Clear any existing highlights
    this.clearHighlights()

    // Add audit IDs to all elements
    let auditId = 0
    document.querySelectorAll("*").forEach((element) => {
      element.dataset.auditId = `audit-${auditId++}`
    })

    // Run the audit using the globally available AllyAudit object
    const results = await window.AllyAudit.runAccessibilityAudit()

    // Highlight failed elements
    Object.values(results.categories).forEach((category) => {
      Object.values(category.rules).forEach((rule) => {
        rule.results.forEach((result) => {
          if (!result.passed) {
            window.AllyAudit.highlightIssue(result.element, "error")
          }
        })
      })
    })

    // Show results panel using the globally available AuditPanel
    if (!this.auditPanel) {
      this.auditPanel = new window.AuditPanel()
    }

    const rightSidebar = document.querySelector(
      "#ally-studio-wrapper > div:last-child"
    )
    if (rightSidebar) {
      rightSidebar.innerHTML = ""
      rightSidebar.appendChild(this.auditPanel.render())
      this.auditPanel.initialize(results)
    }
  },

  initializeIframe(html) {
    // Wait for iframe to load
    this.iframe.addEventListener("load", () => {
      try {
        // Get iframe document
        this.iframeDoc =
          this.iframe.contentDocument || this.iframe.contentWindow.document

        // Copy current page styles
        const styles = Array.from(document.styleSheets)
          .map((sheet) => {
            try {
              return sheet.href
                ? `<link rel="stylesheet" href="${sheet.href}">`
                : `<style>${Array.from(sheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join("\n")}</style>`
            } catch (e) {
              return sheet.href
                ? `<link rel="stylesheet" href="${sheet.href}">`
                : ""
            }
          })
          .join("\n")

        // Write the HTML to iframe
        this.iframeDoc.open()
        this.iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base href="${window.location.href}">
              ${styles}
            </head>
            <body>
              ${document.body.innerHTML}
            </body>
          </html>
        `)
        this.iframeDoc.close()

        // Copy scripts (optional, be careful with this)
        Array.from(document.scripts).forEach((script) => {
          if (script.src) {
            const newScript = this.iframeDoc.createElement("script")
            newScript.src = script.src
            this.iframeDoc.body.appendChild(newScript)
          }
        })
      } catch (error) {
        console.error("Failed to access iframe content:", error)
      }
    })

    // Set iframe source to current page
    this.iframe.src = window.location.href
  }
}

// Function to start accessibility audit
function startAccessibilityAudit() {
  // Find all images without alt text
  const images = document.querySelectorAll("img:not([alt])")
  highlightElements(images, "Missing alt text")

  // Find all interactive elements without keyboard access
  const interactive = document.querySelectorAll(
    "a, button, input, select, textarea"
  )
  interactive.forEach((el) => {
    if (!isKeyboardAccessible(el)) {
      highlightElement(el, "Not keyboard accessible")
    }
  })
}

// Function to show landmarks
function showLandmarks() {
  const landmarks = document.querySelectorAll(
    'main, nav, header, footer, aside, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]'
  )
  highlightElements(landmarks, "Landmark")
}

// Function to check color contrast
function checkColorContrast() {
  const textElements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, p, a, span, li"
  )
  textElements.forEach((el) => {
    const style = window.getComputedStyle(el)
    const ratio = getContrastRatio(style.color, style.backgroundColor)
    if (ratio < 4.5) {
      highlightElement(el, `Low contrast: ${ratio.toFixed(2)}:1`)
    }
  })
}

// Utility functions
function highlightElements(elements, message) {
  elements.forEach((el) => highlightElement(el, message))
}

function highlightElement(element, message) {
  const overlay = document.createElement("div")
  const rect = element.getBoundingClientRect()

  Object.assign(overlay.style, {
    position: "fixed",
    top: rect.top + "px",
    left: rect.left + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    background: "rgba(255, 0, 0, 0.2)",
    border: "2px solid red",
    zIndex: "999999",
    pointerEvents: "none",
  })

  const label = document.createElement("div")
  Object.assign(label.style, {
    position: "absolute",
    top: "-25px",
    left: "0",
    background: "red",
    color: "white",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    whiteSpace: "nowrap",
  })
  label.textContent = message

  overlay.appendChild(label)
  document.body.appendChild(overlay)
}

function isKeyboardAccessible(element) {
  return (
    element.tabIndex >= 0 ||
    ["a", "button", "input", "select", "textarea"].includes(
      element.tagName.toLowerCase()
    )
  )
}

function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(parseColor(color1))
  const lum2 = getLuminance(parseColor(color2))
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  return (brightest + 0.05) / (darkest + 0.05)
}

function parseColor(color) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx.fillStyle = color
  return ctx.fillStyle
}

function getLuminance(hex) {
  const rgb = parseInt(hex.slice(1), 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}
