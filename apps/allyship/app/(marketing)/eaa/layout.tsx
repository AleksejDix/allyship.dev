'use client'

import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { EXTERNAL_LINKS } from './constants/links'
import { RouterLink } from './components/RouterLink'

export default function EAALayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="eaa-book min-h-screen">
      <div className="container mx-auto  pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
          <div className="lg:col-span-2">
            <RouterLink
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to home</span>
            </RouterLink>
          </div>

          <div className="lg:col-span-6">
            <div className="prose prose-lg dark:prose-invert">{children}</div>
          </div>
        </div>
      </div>

      <footer className="mt-auto border-t py-6 ">
        <div className="container">
          <div className="flex justify-between items-center">
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
              >
                Official EAA Text
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
