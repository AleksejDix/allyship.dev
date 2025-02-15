import { BaseTool, ToolResult } from "./base-tool"

export class FocusOrderTool extends BaseTool {
  private counter = 1
  private lastElement: HTMLElement | null = null
  private lines = new Set<SVGSVGElement>()

  getSelector(): string {
    return `
      a[href], button, input, select, textarea,
      [tabindex]:not([tabindex="-1"])
    `
      .trim()
      .replace(/\s+/g, " ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    // Highlight current element with counter
    this.highlightElement(el, true, this.counter.toString())

    // Draw line from last element if exists
    if (this.lastElement) {
      this.drawLineBetweenElements(this.lastElement, el)
    }
    this.lastElement = el
    this.counter++

    return { isValid: true }
  }

  cleanup(): ToolResult {
    if (!this.isActive) {
      return { success: false }
    }

    this.stopObserving()
    this.lines.forEach((line) => line.remove())
    this.lines.clear()
    this.counter = 1
    this.lastElement = null
    this.isActive = false

    return { success: true }
  }

  private drawLineBetweenElements(from: HTMLElement, to: HTMLElement) {
    const fromRect = from.getBoundingClientRect()
    const toRect = to.getBoundingClientRect()

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

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    // Use top-left corner coordinates
    const fromX = fromRect.left
    const fromY = fromRect.top
    const toX = toRect.left
    const toY = toRect.top

    line.setAttribute("x1", fromX.toString())
    line.setAttribute("y1", fromY.toString())
    line.setAttribute("x2", toX.toString())
    line.setAttribute("y2", toY.toString())
    line.style.cssText = `
      stroke: #0891b2;
      stroke-width: 3;
      stroke-opacity: 0.9;
    `

    svg.appendChild(line)
    document.body.appendChild(svg)
    this.lines.add(svg)

    // Update line position on scroll/resize
    const updatePosition = () => {
      const newFromRect = from.getBoundingClientRect()
      const newToRect = to.getBoundingClientRect()
      // Use top-left corner coordinates
      const newFromX = newFromRect.left
      const newFromY = newFromRect.top
      const newToX = newToRect.left
      const newToY = newToRect.top

      line.setAttribute("x1", newFromX.toString())
      line.setAttribute("y1", newFromY.toString())
      line.setAttribute("x2", newToX.toString())
      line.setAttribute("y2", newToY.toString())
    }

    window.addEventListener("scroll", updatePosition)
    window.addEventListener("resize", updatePosition)
  }
}

// Export a singleton instance
const focusOrderTool = new FocusOrderTool()
export const checkFocusOrder = (mode: "apply" | "cleanup" = "apply") =>
  focusOrderTool.run(mode)
