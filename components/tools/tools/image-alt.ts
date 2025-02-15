import { ToolResult } from "./base-tool"

let isActive = false
const originalStyles = new WeakMap<
  HTMLElement,
  {
    outline: string
  }
>()
const addedElements = new Set<HTMLElement>()

function applyImageAltCheck() {
  const images = document.querySelectorAll<HTMLImageElement>("img")
  let issues: string[] = []

  images.forEach((img) => {
    const hasAlt = img.hasAttribute("alt")
    const altText = img.getAttribute("alt")
    const isDecorative = altText === ""

    originalStyles.set(img, {
      outline: img.style.outline || "",
    })

    if (!hasAlt) {
      img.style.outline = "3px solid red"
      issues.push("Missing alt attribute")
    } else if (isDecorative) {
      img.style.outline = "3px solid blue"
    } else {
      img.style.outline = "3px solid green"
    }

    // Add visual indicator
    const label = document.createElement("div")
    label.style.cssText = `
      position: absolute;
      background: ${hasAlt ? (isDecorative ? "blue" : "green") : "red"};
      color: white;
      padding: 4px;
      font-size: 12px;
      z-index: 10000;
    `
    label.textContent = hasAlt
      ? isDecorative
        ? "Decorative"
        : altText || ""
      : "Missing alt"

    if (img.parentNode instanceof HTMLElement) {
      img.parentNode.style.position = "relative"
      img.parentNode.appendChild(label)
      addedElements.add(label)
    }
  })

  if (issues.length > 0) {
    console.warn("Image Alt Text Issues:", issues)
  }
}

function cleanupImageAltCheck() {
  const images = document.querySelectorAll<HTMLImageElement>("img")
  images.forEach((img) => {
    const styles = originalStyles.get(img)
    if (styles) {
      img.style.outline = styles.outline
    }
  })

  addedElements.forEach((element) => element.remove())
  addedElements.clear()
}

export function checkImageAlt(mode: "apply" | "cleanup" = "apply"): ToolResult {
  if (mode === "cleanup") {
    cleanupImageAltCheck()
    isActive = false
    console.log("Image alt check disabled")
    return { success: true }
  } else {
    applyImageAltCheck()
    isActive = true
    console.log("Image alt check enabled")
    return { success: true }
  }
}
