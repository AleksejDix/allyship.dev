// Store tool state
let isActive = false
const originalStyles = new WeakMap<HTMLElement, string>()
const addedElements = new Set<HTMLElement>()

function applyHeadingsCheck() {
  // Don't reapply if already active
  if (isActive) return

  const headings = document.querySelectorAll<HTMLElement>(
    "h1, h2, h3, h4, h5, h6"
  )
  let lastLevel = 0
  let issues: string[] = []

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1])
    const skippedLevel = level - lastLevel > 1 && lastLevel !== 0

    // Store original styles
    if (!originalStyles.has(heading)) {
      originalStyles.set(heading, heading.style.outline || "")
    }

    // Visual feedback
    heading.style.outline = skippedLevel ? "3px solid red" : "3px solid green"

    // Add level indicator
    const badge = document.createElement("div")
    badge.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      background: ${skippedLevel ? "red" : "green"};
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
    `
    badge.textContent = `H${level}${skippedLevel ? " (Skipped level)" : ""}`

    const wrapper = document.createElement("div")
    wrapper.style.position = "relative"
    heading.parentNode?.insertBefore(wrapper, heading)
    wrapper.appendChild(heading)
    wrapper.appendChild(badge)

    addedElements.add(wrapper)
    addedElements.add(badge)

    if (skippedLevel) {
      issues.push(`Heading level skipped: H${lastLevel} to H${level}`)
    }

    lastLevel = level
  })

  if (issues.length > 0) {
    console.warn("Heading Issues:", issues)
  }

  isActive = true
}

function cleanupHeadingsCheck() {
  if (!isActive) return

  // Get all headings to restore their styles
  const headings = document.querySelectorAll<HTMLElement>(
    "h1, h2, h3, h4, h5, h6"
  )

  // Restore original styles
  headings.forEach((heading) => {
    const outline = originalStyles.get(heading)
    if (outline) {
      heading.style.outline = outline
    }
  })

  // Remove added elements
  addedElements.forEach((element) => {
    if (element.tagName === "DIV" && element.style.position === "relative") {
      const child = element.firstElementChild as HTMLElement
      if (child) {
        element.parentNode?.insertBefore(child, element)
      }
    }
    element.remove()
  })

  addedElements.clear()
  isActive = false
}

export function checkHeadings() {
  if (isActive) {
    cleanupHeadingsCheck()
    console.log("Headings check disabled")
  } else {
    applyHeadingsCheck()
    console.log("Headings check enabled")
  }
}
