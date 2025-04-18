import React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EXTERNAL_LINKS, INTRODUCTION_LINKS } from '../constants/links'
import { Button } from '@workspace/ui/components/button'

export default function EAALayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="eaa-book min-h-screen flex flex-col">
      <div className="container mx-auto py-6">{children}</div>

      <footer className="mt-auto border-t py-6">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p>European Accessibility Act (EAA) - Directive (EU) 2019/882</p>
              <p className="mt-1">
                This guide is for informational purposes only and does not
                constitute legal advice.
              </p>
            </div>
            <div>
              <a
                href={EXTERNAL_LINKS.OFFICIAL_EAA_TEXT}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                aria-labelledby="official-text-label"
              >
                <span id="official-text-label">Official EAA Text</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
