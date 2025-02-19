"use client"

import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeadingOrder() {
  const bookmarkletCode = encodeURIComponent(`(() => {
    function getHeadings() {
        return document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']:not([role='presentation'])");
    }

    function highlightElement(el, isError) {
        el.style.outline = isError ? "3px dashed #FF0000" : "3px dashed #00FF00";
        el.style.boxShadow = isError ? "0 0 10px rgba(255, 0, 0, 0.5)" : "0 0 10px rgba(0, 255, 0, 0.5)";

        // Add level indicator
        const level = parseInt(el.tagName.charAt(1), 10) || el.getAttribute("aria-level") || 6;
        const indicator = document.createElement("div");
        indicator.style = \`
            position: absolute;
            background: \${isError ? '#FF0000' : '#00FF00'};
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            font-family: sans-serif;
            z-index: 100000;
        \`;
        indicator.innerText = \`H\${level}\`;

        const rect = el.getBoundingClientRect();
        indicator.style.top = \`\${rect.top + window.scrollY - 20}px\`;
        indicator.style.left = \`\${rect.left + window.scrollX}px\`;
        document.body.appendChild(indicator);

    }

    function checkHeadingOrder() {
        const headings = getHeadings();
        let lastLevel = 0;
        let hasErrors = false;
        let errorMessages = [];

        headings.forEach((el, index) => {
            const level = parseInt(el.tagName.charAt(1), 10) || el.getAttribute("aria-level") || 6;
            const isError = level > lastLevel + 1;

            if (isError) {
                hasErrors = true;
                errorMessages.push(\`Found H\${level} after H\${lastLevel}. Headings should only increment by 1.\`);
            }

            highlightElement(el, isError);
            lastLevel = level;
        });
    }

    checkHeadingOrder();
})();`)

  const bookmarkletUrl = `javascript:${bookmarkletCode}`

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
        <a
          href={bookmarkletUrl}
          className="inline-block px-4 py-2 bg-success text-white rounded hover:bg-success/80 cursor-move"
          onClick={(e) => e.preventDefault()}
        >
          Allyship.dev Heading Order
        </a>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(bookmarkletUrl)
            alert(
              "Bookmarklet code copied! To use:\n1. Create a new bookmark\n2. Paste this code in the URL/location field"
            )
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Bookmarklet Code
        </Button>
      </div>
      <p className="text-sm text-foreground">
        To install: Drag the &quot;Heading Order&quot; button to your bookmarks
        bar
        <br />
        Alternative method: Use the Copy button and create a new bookmark
        manually
      </p>
    </div>
  )
}
