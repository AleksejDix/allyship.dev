// Audit categories and rules based on WCAG 2.1
const auditCategories = {
  perceivable: {
    name: "Perceivable",
    description:
      "Information must be presentable to users in ways they can perceive",
    rules: [
      {
        id: "alt-text",
        name: "Image Alternative Text",
        wcag: "1.1.1",
        test: (element) => {
          if (element.tagName.toLowerCase() === "img") {
            return {
              passed: !!element.alt,
              message: element.alt
                ? "Image has alt text"
                : "Image is missing alt text",
              element,
            }
          }
          return null
        },
      },
      {
        id: "color-contrast",
        name: "Color Contrast",
        wcag: "1.4.3",
        test: async (element) => {
          const style = window.getComputedStyle(element)
          const ratio = await calculateContrastRatio(
            style.color,
            style.backgroundColor
          )
          const minRatio = getFontSize(style) >= 18 ? 3 : 4.5

          return {
            passed: ratio >= minRatio,
            message: `Contrast ratio: ${ratio.toFixed(2)}:1 (minimum: ${minRatio}:1)`,
            element,
            details: { ratio, required: minRatio },
          }
        },
      },
    ],
  },
  operable: {
    name: "Operable",
    description: "Interface components must be operable",
    rules: [
      {
        id: "keyboard-access",
        name: "Keyboard Accessibility",
        wcag: "2.1.1",
        test: (element) => {
          const interactive = isInteractive(element)
          if (!interactive) return null

          const focusable =
            element.tabIndex >= 0 || isNaturallyFocusable(element)
          return {
            passed: focusable,
            message: focusable
              ? "Element is keyboard accessible"
              : "Element needs keyboard access",
            element,
          }
        },
      },
    ],
  },
  understandable: {
    name: "Understandable",
    description: "Information and operation must be understandable",
    rules: [
      {
        id: "form-labels",
        name: "Form Input Labels",
        wcag: "3.3.2",
        test: (element) => {
          if (element.tagName.toLowerCase() === "input") {
            const hasLabel = hasVisibleLabel(element)
            return {
              passed: hasLabel,
              message: hasLabel
                ? "Input has visible label"
                : "Input missing visible label",
              element,
            }
          }
          return null
        },
      },
    ],
  },
  robust: {
    name: "Robust",
    description:
      "Content must be robust enough to be interpreted by user agents",
    rules: [
      {
        id: "valid-landmarks",
        name: "ARIA Landmarks",
        wcag: "4.1.2",
        test: (element) => {
          const role = element.getAttribute("role")
          if (!role) return null

          const valid = isValidAriaRole(role)
          return {
            passed: valid,
            message: valid ? "Valid ARIA role" : `Invalid ARIA role: ${role}`,
            element,
          }
        },
      },
    ],
  },
}

// Utility functions
function isInteractive(element) {
  const interactiveTags = ["a", "button", "input", "select", "textarea"]
  return (
    interactiveTags.includes(element.tagName.toLowerCase()) ||
    element.hasAttribute("onclick") ||
    element.getAttribute("role") === "button"
  )
}

function isNaturallyFocusable(element) {
  const focusableTags = ["a", "button", "input", "select", "textarea"]
  return focusableTags.includes(element.tagName.toLowerCase())
}

function hasVisibleLabel(input) {
  // Check for associated label
  const id = input.id
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`)
    if (label && label.offsetHeight > 0) return true
  }

  // Check for aria-label
  if (input.getAttribute("aria-label")) return true

  // Check for parent label
  const parentLabel = input.closest("label")
  return parentLabel && parentLabel.offsetHeight > 0
}

async function calculateContrastRatio(color1, color2) {
  // Convert colors to luminance values
  const l1 = await getLuminance(color1)
  const l2 = await getLuminance(color2)

  // Calculate ratio
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getFontSize(style) {
  return parseInt(style.fontSize)
}

function isValidAriaRole(role) {
  const validRoles = [
    "alert",
    "alertdialog",
    "application",
    "article",
    "banner",
    "button",
    "cell",
    "checkbox",
    "columnheader",
    "combobox",
    "complementary",
    "contentinfo",
    "definition",
    "dialog",
    "directory",
    "document",
    "feed",
    "figure",
    "form",
    "grid",
    "gridcell",
    "group",
    "heading",
    "img",
    "link",
    "list",
    "listbox",
    "listitem",
    "log",
    "main",
    "marquee",
    "math",
    "menu",
    "menubar",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "navigation",
    "none",
    "note",
    "option",
    "presentation",
    "progressbar",
    "radio",
    "radiogroup",
    "region",
    "row",
    "rowgroup",
    "rowheader",
    "scrollbar",
    "search",
    "searchbox",
    "separator",
    "slider",
    "spinbutton",
    "status",
    "switch",
    "tab",
    "table",
    "tablist",
    "tabpanel",
    "term",
    "textbox",
    "timer",
    "toolbar",
    "tooltip",
    "tree",
    "treegrid",
    "treeitem",
  ]
  return validRoles.includes(role.toLowerCase())
}

// Main audit function
async function runAccessibilityAudit(element = document.body) {
  const results = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      notApplicable: 0,
    },
    categories: {},
  }

  // Run tests for each category
  for (const [categoryId, category] of Object.entries(auditCategories)) {
    results.categories[categoryId] = {
      name: category.name,
      description: category.description,
      rules: {},
    }

    // Run each rule in the category
    for (const rule of category.rules) {
      const elements = element.getElementsByTagName("*")
      const ruleResults = []

      for (const el of elements) {
        const result = await rule.test(el)
        if (result) {
          ruleResults.push(result)
          results.summary.total++
          if (result.passed) {
            results.summary.passed++
          } else {
            results.summary.failed++
          }
        }
      }

      results.categories[categoryId].rules[rule.id] = {
        name: rule.name,
        wcag: rule.wcag,
        results: ruleResults,
      }
    }
  }

  return results
}

// Export utility for highlighting issues
function highlightIssue(element, type = "error") {
  const colors = {
    error: "#ff000033",
    warning: "#ffff0033",
    success: "#00ff0033",
  }

  const overlay = document.createElement("div")
  const rect = element.getBoundingClientRect()

  Object.assign(overlay.style, {
    position: "fixed",
    top: rect.top + "px",
    left: rect.left + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    background: colors[type] || colors.error,
    border: `2px solid ${colors[type]?.replace("33", "ff") || "#ff0000"}`,
    zIndex: 999998,
    pointerEvents: "none",
  })

  document.body.appendChild(overlay)
  return overlay
}

// Make functions available globally
window.AllyAudit = {
  runAccessibilityAudit,
  highlightIssue,
  auditCategories,
}
