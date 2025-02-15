let isActive = false
const originalStyles = new WeakMap<
  HTMLElement,
  {
    outline: string
    backgroundColor: string
  }
>()
const addedElements = new Set<HTMLElement>()

// Define valid ARIA landmarks
const VALID_LANDMARKS = [
  "banner",
  "complementary",
  "contentinfo",
  "form",
  "main",
  "navigation",
  "region",
  "search",
] as const

function applyLandmarksCheck() {
  // Don't cleanup if already active
  if (isActive) return

  // Check elements with role attribute
  const elementsWithRole = document.querySelectorAll<HTMLElement>("[role]")
  // Check semantic elements
  const semanticElements = document.querySelectorAll<HTMLElement>(
    "header, nav, main, aside, footer, form, section[aria-label], section[aria-labelledby]"
  )

  const elements = [...elementsWithRole, ...semanticElements]
  let issues: string[] = []

  elements.forEach((el) => {
    let role = el.getAttribute("role")
    // Infer role from semantic element if not explicitly set
    if (!role) {
      switch (el.tagName.toLowerCase()) {
        case "header":
          role = "banner"
          break
        case "nav":
          role = "navigation"
          break
        case "main":
          role = "main"
          break
        case "aside":
          role = "complementary"
          break
        case "footer":
          role = "contentinfo"
          break
        case "form":
          role = "form"
          break
        case "section":
          role = "region"
          break
      }
    }

    const isValidLandmark = role && VALID_LANDMARKS.includes(role as any)

    // Store original styles only if not already stored
    if (!originalStyles.has(el)) {
      originalStyles.set(el, {
        outline: el.style.outline || "",
        backgroundColor: el.style.backgroundColor || "",
      })
    }

    // Apply visual feedback
    el.style.outline = isValidLandmark ? "3px solid green" : "3px solid red"
    el.style.backgroundColor = isValidLandmark
      ? "rgba(0,255,0,0.1)"
      : "rgba(255,0,0,0.1)"

    // Add label badge
    const badge = document.createElement("div")
    badge.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      background: ${isValidLandmark ? "green" : "red"};
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
    `
    badge.textContent = role
      ? `${role}${isValidLandmark ? "" : " (Invalid)"}`
      : "Missing landmark role"

    const wrapper = document.createElement("div")
    wrapper.style.position = "relative"
    el.parentNode?.insertBefore(wrapper, el)
    wrapper.appendChild(el)
    wrapper.appendChild(badge)

    addedElements.add(wrapper)
    addedElements.add(badge)

    if (!isValidLandmark) {
      issues.push(
        `Invalid or missing landmark role on <${el.tagName.toLowerCase()}>`
      )
    }
  })

  if (issues.length > 0) {
    console.warn("Landmark Issues:", issues)
  }

  isActive = true
}

function cleanupLandmarksCheck() {
  if (!isActive) return

  // Restore original styles
  const elements = document.querySelectorAll<HTMLElement>(
    "[role], header, nav, main, aside, footer, form, section[aria-label], section[aria-labelledby]"
  )
  elements.forEach((el) => {
    const styles = originalStyles.get(el)
    if (styles) {
      el.style.outline = styles.outline
      el.style.backgroundColor = styles.backgroundColor
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

export function checkLandmarks() {
  if (isActive) {
    cleanupLandmarksCheck()
    console.log("Landmarks check disabled")
  } else {
    applyLandmarksCheck()
    console.log("Landmarks check enabled")
  }
}
