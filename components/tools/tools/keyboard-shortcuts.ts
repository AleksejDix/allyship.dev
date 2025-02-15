let isActive = false
const originalStyles = new WeakMap<
  HTMLElement,
  {
    outline: string
  }
>()
const addedElements = new Set<HTMLElement>()

function applyKeyboardShortcutsCheck() {
  // Check for elements with accesskey attribute
  const elementsWithAccessKey =
    document.querySelectorAll<HTMLElement>("[accesskey]")
  const shortcuts = new Map<string, HTMLElement[]>()
  let issues: string[] = []

  // Collect all shortcuts
  elementsWithAccessKey.forEach((el) => {
    const key = el.getAttribute("accesskey")?.toLowerCase()
    if (key) {
      if (!shortcuts.has(key)) {
        shortcuts.set(key, [])
      }
      shortcuts.get(key)?.push(el)
    }
  })

  // Check for conflicts and add visual indicators
  shortcuts.forEach((elements, key) => {
    const hasConflict = elements.length > 1

    elements.forEach((el) => {
      originalStyles.set(el, {
        outline: el.style.outline || "",
      })

      el.style.outline = hasConflict ? "3px solid red" : "3px solid green"

      // Add shortcut indicator
      const badge = document.createElement("div")
      badge.style.cssText = `
        position: absolute;
        top: -20px;
        left: 0;
        background: ${hasConflict ? "red" : "green"};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
      `
      badge.textContent = `⌨️ ${key.toUpperCase()}${
        hasConflict ? " (Conflict)" : ""
      }`

      const wrapper = document.createElement("div")
      wrapper.style.position = "relative"
      el.parentNode?.insertBefore(wrapper, el)
      wrapper.appendChild(el)
      wrapper.appendChild(badge)

      addedElements.add(wrapper)
      addedElements.add(badge)
    })

    if (hasConflict) {
      issues.push(
        `Keyboard shortcut conflict: "${key}" is used by ${elements.length} elements`
      )
    }
  })

  // Check for common interactive elements without keyboard access
  const interactiveElements = document.querySelectorAll<HTMLElement>(
    'div[onclick], span[onclick], img[onclick], [role="button"], [role="link"]'
  )

  interactiveElements.forEach((el) => {
    const hasKeyboardAccess =
      el.hasAttribute("tabindex") ||
      el.querySelector("button, a[href], input, select, textarea, [tabindex]")

    if (!hasKeyboardAccess) {
      originalStyles.set(el, {
        outline: el.style.outline || "",
      })

      el.style.outline = "3px solid orange"

      const badge = document.createElement("div")
      badge.style.cssText = `
        position: absolute;
        top: -20px;
        left: 0;
        background: orange;
        color: black;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
      `
      badge.textContent = "No Keyboard Access"

      const wrapper = document.createElement("div")
      wrapper.style.position = "relative"
      el.parentNode?.insertBefore(wrapper, el)
      wrapper.appendChild(el)
      wrapper.appendChild(badge)

      addedElements.add(wrapper)
      addedElements.add(badge)

      issues.push(
        `Interactive element <${el.tagName.toLowerCase()}> has no keyboard access`
      )
    }
  })

  if (issues.length > 0) {
    console.warn("Keyboard Access Issues:", issues)
  }
}

function cleanupKeyboardShortcutsCheck() {
  const elements = document.querySelectorAll<HTMLElement>(
    "[accesskey], div[onclick], span[onclick], img[onclick], [role='button'], [role='link']"
  )
  elements.forEach((el) => {
    const styles = originalStyles.get(el)
    if (styles) {
      el.style.outline = styles.outline
    }
  })

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
}

export function checkKeyboardShortcuts() {
  if (isActive) {
    cleanupKeyboardShortcutsCheck()
    isActive = false
    console.log("Keyboard shortcuts check disabled")
  } else {
    applyKeyboardShortcutsCheck()
    isActive = true
    console.log("Keyboard shortcuts check enabled")
  }
}
