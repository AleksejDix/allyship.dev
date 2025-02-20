'use client'

import { Copy } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'

export function FocusStyles() {
  const bookmarkletCode = encodeURIComponent(`(function() {
    function showAllFocusStyles() {
        const elements = document.querySelectorAll('a[href], button, select, input:not([type="hidden"]), textarea, summary, details, area, [tabindex], [contenteditable]:not([contenteditable="false"])');
        let computedStyle, styleString = '';
        console.clear();
        Array.from(elements).forEach(function(element) {
            element.style.transition = 'none';
            element.focus();
            computedStyle = getComputedStyle(element);
            styleString = '';
            for (var i = 0; i < computedStyle.length; i++) {
                const cssProperty = computedStyle[i];
                const cssValue = computedStyle.getPropertyValue(cssProperty);
                styleString += cssProperty + ':' + cssValue + ';';
            }
            element.setAttribute('style', styleString);
        });
    }
    showAllFocusStyles();
})();`)

  const bookmarkletUrl = `javascript:${bookmarkletCode}`

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
        <a
          href={bookmarkletUrl}
          className="inline-block px-4 py-2 bg-success text-white rounded hover:bg-success/80 cursor-move"
          onClick={e => e.preventDefault()}
        >
          Show Focus Styles
        </a>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(bookmarkletUrl)
            alert(
              'Bookmarklet code copied! To use:\n1. Create a new bookmark\n2. Paste this code in the URL/location field'
            )
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Bookmarklet Code
        </Button>
      </div>
      <p className="text-sm text-foreground">
        To install: Drag the &quot;Focus Style Bookmarklet&quot; button to your
        bookmarks bar
        <br />
        Alternative method: Use the Copy button and create a new bookmark
        manually
      </p>
    </div>
  )
}
