import { BaseTool } from "./base-tool"

export class LandmarksTool extends BaseTool {
  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(
      "main, nav, header, footer, aside, [role='main'], [role='navigation'], [role='banner'], [role='contentinfo'], [role='complementary']"
    )
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    const role = el.getAttribute("role") || this.getImplicitRole(el)
    const isValid = true // Add your validation logic

    this.highlightElement(el, isValid, role)

    return {
      isValid,
      message: isValid ? undefined : `Invalid landmark role: ${role}`,
    }
  }

  private getImplicitRole(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const roleMap: Record<string, string> = {
      main: "main",
      nav: "navigation",
      header: "banner",
      footer: "contentinfo",
      aside: "complementary",
    }
    return roleMap[tag] || "unknown"
  }
}

// Export a singleton instance
const landmarksTool = new LandmarksTool()
export const checkLandmarks = (mode: "apply" | "cleanup" = "apply") =>
  landmarksTool.run(mode)
