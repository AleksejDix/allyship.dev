'use client'

import { Copy } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'

export function FocusTracker() {
  const bookmarkletCode = encodeURIComponent(`(function() {
    const focusedElements = [];
    let svg;

    function initializeSVGOverlay() {
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = \`\${document.documentElement.scrollHeight}px\`;
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '9999';
      overlay.style.overflow = 'hidden';
      document.body.appendChild(overlay);

      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', \`\${document.documentElement.scrollHeight}\`);
      overlay.appendChild(svg);
    }

    function handleViewportChange() {
      updateVisualization();
    }

    function updateVisualization() {
      svg.innerHTML = '';
      const linesLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const circlesLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      svg.appendChild(linesLayer);
      svg.appendChild(circlesLayer);

      for (let i = 0; i < focusedElements.length; i++) {
        const rect = focusedElements[i].getBoundingClientRect();
        const nextRect = i < focusedElements.length - 1
          ? focusedElements[i + 1].getBoundingClientRect()
          : null;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        const x = window.scrollX + rect.left + 10;
        const y = window.scrollY + rect.bottom - 10;

        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '8');
        circle.setAttribute('fill', 'yellow');
        circle.setAttribute('stroke', 'black');
        circle.setAttribute('stroke-width', '2');
        circlesLayer.appendChild(circle);

        text.setAttribute('x', x);
        text.setAttribute('y', y - 10);
        text.setAttribute('font-size', '12');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'black');
        text.setAttribute('font-weight', 'bold');
        text.textContent = i + 1;
        circlesLayer.appendChild(text);

        if (nextRect) {
          const x2 = window.scrollX + nextRect.left + 10;
          const y2 = window.scrollY + nextRect.bottom - 10;

          const backgroundLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          backgroundLine.setAttribute('x1', x);
          backgroundLine.setAttribute('y1', y);
          backgroundLine.setAttribute('x2', x2);
          backgroundLine.setAttribute('y2', y2);
          backgroundLine.setAttribute('stroke', 'black');
          backgroundLine.setAttribute('stroke-width', '8');
          backgroundLine.setAttribute('stroke-linecap', 'round');
          linesLayer.appendChild(backgroundLine);

          const foregroundLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          foregroundLine.setAttribute('x1', x);
          foregroundLine.setAttribute('y1', y);
          foregroundLine.setAttribute('x2', x2);
          foregroundLine.setAttribute('y2', y2);
          foregroundLine.setAttribute('stroke', 'yellow');
          foregroundLine.setAttribute('stroke-width', '6');
          foregroundLine.setAttribute('stroke-linecap', 'round');
          linesLayer.appendChild(foregroundLine);
        }
      }
    }

    function setupEventListeners() {
      document.addEventListener('focusin', function(event) {
        const element = event.target;
        if (!focusedElements.includes(element)) {
          focusedElements.push(element);
          updateVisualization();
        }
      });

      window.addEventListener('scroll', handleViewportChange, true);
      window.addEventListener('resize', handleViewportChange, true);
    }

    (function init() {
      initializeSVGOverlay();
      setupEventListeners();
    })();
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
          Allyship.dev Focus Tracker
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
        To install: Drag the &quot;Focus Tracker&quot; button to your bookmarks
        bar
        <br />
        Alternative method: Use the Copy button and create a new bookmark
        manually
      </p>
    </div>
  )
}
