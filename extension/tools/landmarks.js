export interface HighlightOptions {
  borderColor: string;
  backgroundColor: string;
  label: string;
}

export interface LandmarkResult {
  count: number;
  elements: Array<{
    tag: string;
    role: string | null;
  }>;
}

export class LandmarksTool {
  private iframeDoc: Document;
  private highlighter: any; // Replace with proper Highlighter type when available

  constructor(iframeDoc: Document, highlighter: any) {
    this.iframeDoc = iframeDoc;
    this.highlighter = highlighter;
  }

  run(): LandmarkResult {
    if (!this.iframeDoc) {
      console.warn("Iframe document not available");
      return { count: 0, elements: [] };
    }

    // Find all landmark regions
    const landmarks = this.iframeDoc.querySelectorAll(
      [
        "main",
        "nav",
        "aside",
        "header",
        "footer",
        "section[aria-label]",
        "section[aria-labelledby]",
        'div[role="main"]',
        'div[role="navigation"]',
        'div[role="complementary"]',
        'div[role="banner"]',
        'div[role="contentinfo"]',
      ].join(",")
    );

    // Highlight each landmark
    landmarks.forEach((landmark: Element) => {
      this.highlighter.highlight(landmark, {
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        label:
          landmark.tagName.toLowerCase() +
          (landmark.getAttribute("role")
            ? ` [${landmark.getAttribute("role")}]`
            : ""),
      });
    });

    return {
      count: landmarks.length,
      elements: Array.from(landmarks).map((landmark: Element) => ({
        tag: landmark.tagName.toLowerCase(),
        role: landmark.getAttribute("role"),
      })),
    };
  }

  getResultsHTML(results: LandmarkResult): string {
    return `
      <div class="tool-results">
        <h3 style="margin: 0 0 8px 0; font-size: 16px;">Landmarks Found (${results.count})</h3>
        <div style="color: ${results.count === 0 ? "#ef4444" : "#22c55e"}">
          ${
            results.count === 0
              ? "No landmarks found. Consider adding semantic HTML elements or ARIA landmarks."
              : `Found ${results.count} landmarks on the page.`
          }
        </div>
        ${
          results.count > 0
            ? `
          <ul style="list-style: none; padding: 0; margin: 8px 0;">
            ${results.elements
              .map(
                (landmark) => `
              <li style="margin: 4px 0; display: flex; align-items: center; gap: 8px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6;"></span>
                ${landmark.tag}${landmark.role ? ` [role="${landmark.role}"]` : ""}
              </li>
            `
              )
              .join("")}
          </ul>
        `
            : ""
        }
      </div>
    `
  }
}
