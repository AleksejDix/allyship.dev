import { ToolResult } from "./base-tool"

let isActive = false
const originalStyles = new WeakMap<
  HTMLElement,
  {
    outline: string
    backgroundColor: string
  }
>()
const addedElements = new Set<HTMLElement>()

function applyAriaRolesCheck() {
  const elements = document.querySelectorAll<HTMLElement>("[role]")
  let issues: string[] = []

  elements.forEach((el) => {
    const role = el.getAttribute("role")
    const hasValidRole = isValidAriaRole(el, role)

    originalStyles.set(el, {
      outline: el.style.outline || "",
      backgroundColor: el.style.backgroundColor || "",
    })

    el.style.outline = hasValidRole ? "3px solid green" : "3px solid red"
    el.style.backgroundColor = hasValidRole
      ? "rgba(0,255,0,0.1)"
      : "rgba(255,0,0,0.1)"

    // Add role indicator badge
    const badge = document.createElement("div")
    badge.style.cssText = `
      position: absolute;
      top: -20px;
      left: 0;
      background: ${hasValidRole ? "green" : "red"};
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
    `
    badge.textContent = `Role: ${role}${hasValidRole ? "" : " (Invalid)"}`

    const wrapper = document.createElement("div")
    wrapper.style.position = "relative"
    el.parentNode?.insertBefore(wrapper, el)
    wrapper.appendChild(el)
    wrapper.appendChild(badge)

    addedElements.add(wrapper)
    addedElements.add(badge)

    if (!hasValidRole) {
      issues.push(
        `Invalid ARIA role "${role}" on <${el.tagName.toLowerCase()}>`
      )
    }
  })

  if (issues.length > 0) {
    console.warn("ARIA Role Issues:", issues)
  }
}

function isValidAriaRole(element: HTMLElement, role: string | null): boolean {
  if (!role) return false

  // Common valid role mappings
  const validRoles: Record<string, string[]> = {
    button: ["button", "link", "menuitem"],
    a: ["link", "button", "menuitem"],
    input: ["textbox", "radio", "checkbox", "button"],
    select: ["listbox", "combobox"],
    ul: ["list", "menu", "tablist"],
    li: ["listitem", "menuitem", "tab"],
    // Add more mappings as needed
  }

  const tagName = element.tagName.toLowerCase()
  return validRoles[tagName]?.includes(role) ?? true
}

function cleanupAriaRolesCheck() {
  const elements = document.querySelectorAll<HTMLElement>("[role]")
  elements.forEach((el) => {
    const styles = originalStyles.get(el)
    if (styles) {
      el.style.outline = styles.outline
      el.style.backgroundColor = styles.backgroundColor
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

export function checkAriaRoles(
  mode: "apply" | "cleanup" = "apply"
): ToolResult {
  if (mode === "cleanup") {
    cleanupAriaRolesCheck()
    isActive = false
    console.log("ARIA roles check disabled")
    return { success: true }
  } else {
    applyAriaRolesCheck()
    isActive = true
    console.log("ARIA roles check enabled")
    return { success: true }
  }
}
