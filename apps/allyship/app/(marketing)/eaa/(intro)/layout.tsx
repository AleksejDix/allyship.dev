import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { EXTERNAL_LINKS } from '../constants/links'
import { RouterLink } from '../components/RouterLink'
// import { KeyDatesTimeline } from './page'
import { Button } from '@workspace/ui/components/button'

export default function EAALayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="eaa-book min-h-screen">
      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-2 text-left lg:text-right">
              <div className="py-2 flex items-center gap-2">
                <Button variant="secondary" asChild>
                  <RouterLink href="/">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    <span>Back to home</span>
                  </RouterLink>
                </Button>
              </div>

              <div
                role="presentation"
                className="aspect-[13/20] relative shadow-lg rounded-lg overflow-hidden bg-gradient-to-br from-blue-600 via-fuchsia-600 to-yellow-400"
              >
                <div className="text-[64px] leading-none text-left mb-0 font-bold font-display absolute inset-[1cm]">
                  <span className="text-white">E</span>uropean <br />
                  <span className="text-white">A</span>ccessibility <br />
                  <span className="text-white">A</span>ct
                  <div className="absolute bottom-0 right-0 text-right">
                    &mdash; in <br /> Plain English
                  </div>
                </div>
              </div>

              {/* <KeyDatesTimeline /> */}
            </div>
          </aside>

          <div className="lg:col-span-5 py-2">
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
