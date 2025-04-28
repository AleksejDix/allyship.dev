import React from 'react'
import { List } from 'lucide-react'
import { EXTERNAL_LINKS } from '../constants/links'
import { Button } from '@workspace/ui/components/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'
import { TableOfContent } from '../components/TableOfContent'
import { TextToSpeechButton } from '@/components/accessibility/TextToSpeechButton'

export default function EAALayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="eaa-book min-h-screen">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="py-2 flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <List size={16} className="mr-2" aria-hidden="true" />
                    EAA Table of Contents
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto h-full">
                  <SheetHeader className="pb-8">
                    <SheetTitle className="text-2xl font-bold">
                      <div>European Accessibility Act</div>
                      <div>in Simple Language</div>
                    </SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                      Stop guessing what the EAA is all about.
                    </SheetDescription>
                  </SheetHeader>
                  <div>
                    <TableOfContent />
                  </div>
                </SheetContent>
              </Sheet>

              <TextToSpeechButton contentSelector="#eaa-content" />
            </div>
          </div>
        </div>
      </div>
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
