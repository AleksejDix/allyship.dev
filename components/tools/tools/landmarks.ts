import { BaseTool } from "./base-tool"

export class LandmarksTool extends BaseTool {
  getSelector(): string {
    return `
      main, nav, header, footer, aside,
      [role='main'], [role='navigation'], [role='banner'],
      [role='contentinfo'], [role='complementary'],
      section[aria-label], section[aria-labelledby],
      article[aria-label], article[aria-labelledby],
      form[aria-label], form[aria-labelledby],
      [role='region'][aria-label], [role='region'][aria-labelledby]
    `
      .trim()
      .replace(/\s+/g, " ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    const role = el.getAttribute("role") || this.getImplicitRole(el)
    const label =
      el.getAttribute("aria-label") ||
      (el.getAttribute("aria-labelledby")
        ? document.getElementById(el.getAttribute("aria-labelledby")!)
            ?.textContent
        : undefined)

    const isValid =
      role !== "unknown" && (!["region", "form"].includes(role) || !!label)

    this.highlightElement(el, isValid, `${role}${label ? `: ${label}` : ""}`)

    return {
      isValid,
      message: isValid ? undefined : `Invalid or unlabeled landmark: ${role}`,
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
