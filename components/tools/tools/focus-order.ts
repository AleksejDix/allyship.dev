import { ToolResult } from "./base-tool"

let isActive = false
const markers = new Set<HTMLElement>()
const lines = new Set<SVGSVGElement>()
let counter = 1
let lastElement: HTMLElement | null = null

// Define accessible colors for both modes
const COLORS = {
  light: {
    marker: {
      background: "#1e40af", // Deep blue
      text: "#ffffff",
    },
    line: {
      stroke: "#3b82f6", // Bright blue
      opacity: "0.6",
    },
  },
  dark: {
    marker: {
      background: "#60a5fa", // Light blue
      text: "#000000",
    },
    line: {
      stroke: "#93c5fd", // Lighter blue
      opacity: "0.8",
    },
  },
}

function getThemeColors() {
  // Check if user prefers dark mode
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  return isDarkMode ? COLORS.dark : COLORS.light
}

function createMarker(el: HTMLElement, number: number) {
  const rect = el.getBoundingClientRect()
  const colors = getThemeColors()

  const marker = document.createElement("div")
  marker.style.cssText = `
    position: fixed;
    top: ${rect.top + window.scrollY - 20}px;
    left: ${rect.left + window.scrollX}px;
    background: ${colors.marker.background};
    color: ${colors.marker.text};
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `
  marker.textContent = number.toString()
  document.body.appendChild(marker)
  markers.add(marker)

  // Draw line from last element if exists
  if (lastElement) {
    drawLineBetweenElements(lastElement, el)
  }
  lastElement = el

  // Update marker position on scroll
  const updatePosition = () => {
    const newRect = el.getBoundingClientRect()
    marker.style.top = `${newRect.top + window.scrollY - 20}px`
    marker.style.left = `${newRect.left + window.scrollX}px`
  }
  window.addEventListener("scroll", updatePosition)
  window.addEventListener("resize", updatePosition)
}

function drawLineBetweenElements(from: HTMLElement, to: HTMLElement) {
  const fromRect = from.getBoundingClientRect()
  const toRect = to.getBoundingClientRect()
  const colors = getThemeColors()

  // Calculate line points
  const fromX = fromRect.left + fromRect.width / 2
  const fromY = fromRect.top + fromRect.height / 2
  const toX = toRect.left + toRect.width / 2
  const toY = toRect.top + toRect.height / 2

  // Create SVG line
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
  `

  const line = document.createElementNS("http://www.w3.org/2000/svg", "path")
  // Create curved path
  const dx = toX - fromX
  const dy = toY - fromY
  const controlX = fromX + dx / 2
  const controlY = fromY + dy / 2
  const path = `M ${fromX} ${fromY} Q ${controlX} ${fromY} ${controlX} ${controlY} T ${toX} ${toY}`

  line.setAttribute("d", path)
  line.style.cssText = `
    fill: none;
    stroke: ${colors.line.stroke};
    stroke-width: 2;
    stroke-opacity: ${colors.line.opacity};
    stroke-dasharray: 4;
    animation: dash 1s linear infinite;
  `

  // Add animation keyframes
  const style = document.createElement("style")
  style.textContent = `
    @keyframes dash {
      to {
        stroke-dashoffset: -8;
      }
    }
  `
  document.head.appendChild(style)

  svg.appendChild(line)
  document.body.appendChild(svg)
  lines.add(svg)

  // Update line position on scroll
  const updatePosition = () => {
    const newFromRect = from.getBoundingClientRect()
    const newToRect = to.getBoundingClientRect()
    const newFromX = newFromRect.left + newFromRect.width / 2
    const newFromY = newFromRect.top + newFromRect.height / 2
    const newToX = newToRect.left + newToRect.width / 2
    const newToY = newToRect.top + newToRect.height / 2
    const newControlX = newFromX + (newToX - newFromX) / 2
    const newControlY = newFromY + (newToY - newFromY) / 2
    const newPath = `M ${newFromX} ${newFromY} Q ${newControlX} ${newFromY} ${newControlX} ${newControlY} T ${newToX} ${newToY}`
    line.setAttribute("d", newPath)
  }
  window.addEventListener("scroll", updatePosition)
  window.addEventListener("resize", updatePosition)
}

function applyFocusOrderCheck() {
  const elements = document.querySelectorAll<HTMLElement>(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  elements.forEach((el) => {
    el.addEventListener("focus", () => {
      createMarker(el, counter++)
    })
  })
}

function cleanupFocusOrderCheck() {
  markers.forEach((marker) => marker.remove())
  lines.forEach((line) => line.remove())
  markers.clear()
  lines.clear()
  counter = 1
  lastElement = null
}

export function checkFocusOrder(
  mode: "apply" | "cleanup" = "apply"
): ToolResult {
  if (mode === "cleanup") {
    cleanupFocusOrderCheck()
    isActive = false
    console.log("Focus order check disabled")
    return { success: true }
  } else {
    applyFocusOrderCheck()
    isActive = true
    console.log("Focus order check enabled")
    return { success: true }
  }
}
