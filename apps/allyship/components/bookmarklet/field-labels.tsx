'use client'

import { Copy } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'

export function FieldLabels() {
  const bookmarkletCode = encodeURIComponent(`(function(){
    function isValidLabel(input) {
        if (!input.id && !input.parentNode.closest('label')) return false;
        const labelFor = document.querySelector('label[for="' + input.id + '"]');
        return !!labelFor || input.parentNode.closest('label');
    }

    function highlightInputs(inputs, isValid) {
        inputs.forEach(input => {
            if (isValid(input)) {
                input.style.border = '2px solid green';
            } else {
                input.style.border = '2px solid red';
            }
        });
    }

    try {
        const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
        if (inputs.length === 0) {
            console.info('No form inputs found on this page.');
            return;
        }

        let validCount = 0;
        let invalidCount = 0;

        highlightInputs(inputs, isValidLabel);

        inputs.forEach(input => {
            if (isValidLabel(input)) validCount++;
            else invalidCount++;
        });

        console.info(validCount, invalidCount);
    } catch (error) {
        console.error(error);
    }
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
          Allyship.dev Field Labels Checker
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
        To install: Drag the &quot;Field Labels Checker&quot; button to your
        bookmarks bar
        <br />
        Alternative method: Use the Copy button and create a new bookmark
        manually
      </p>
    </div>
  )
}
