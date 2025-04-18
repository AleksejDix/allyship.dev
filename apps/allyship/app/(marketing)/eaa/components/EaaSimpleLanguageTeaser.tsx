import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { ArrowRight, BookOpen } from 'lucide-react'

interface EaaSimpleLanguageTeaserProps {
  className?: string
  href?: string
}

/**
 * A promotional component for the "European Accessibility Act in Simple Language"
 * designed to be placed on the landing page.
 */
export function EaaSimpleLanguageTeaser({
  className = '',
  href = '/eaa/simple-language',
}: EaaSimpleLanguageTeaserProps) {
  return (
    <Card
      className={`overflow-hidden border-2 border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20 ${className}`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Left colored accent section */}
          <div className="w-full md:w-2 bg-gradient-to-b from-blue-500 to-cyan-500 flex-shrink-0"></div>

          {/* Content section */}
          <div className="p-6 md:p-8 flex-grow">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              <h3 className="text-2xl font-bold">
                European Accessibility Act in Simple Language
              </h3>
            </div>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                We've created an easy-to-understand version of the European
                Accessibility Act that explains the requirements in clear,
                simple language.
              </p>

              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Simplified explanations of complex requirements</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Visual guides and practical examples</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  <span>Step-by-step compliance checklist</span>
                </li>
              </ul>

              <div className="pt-2">
                <Button asChild>
                  <Link href={href} className="group">
                    Read Simple Guide
                    <ArrowRight
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EaaSimpleLanguageTeaser
