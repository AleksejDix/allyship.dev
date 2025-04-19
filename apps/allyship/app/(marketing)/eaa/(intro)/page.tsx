import React from 'react'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import EaaTimeline from '../components/EaaTimeline'
import { EXTERNAL_LINKS } from '../constants/links'
import { TableOfContent } from '../components/TableOfContent'
export const metadata: Metadata = {
  title: 'European Accessibility Act | Complete Guide',
  description:
    'Comprehensive guide to understanding and implementing the European Accessibility Act (EAA) requirements for accessible products and services.',
}

// Timeline component to be displayed in the left sidebar
export function KeyDatesTimeline() {
  return (
    <div className="mb-8 mt-12">
      <h4 className="text-lg font-medium mb-4">Key Implementation Dates</h4>
      <EaaTimeline />
    </div>
  )
}

export default function EaaIndexPage() {
  return (
    <div>
      {/* Book-style chapter structure */}
      <div>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Foreword</h2>
          <p className="mb-4">
            The European Accessibility Act (EAA), formally Directive (EU)
            2019/882, establishes harmonized accessibility requirements for
            products and services across the European Union, eliminating
            barriers for persons with disabilities and improving the functioning
            of the internal market.
          </p>
        </section>

        <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

        <TableOfContent />
      </div>

      <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

      <section className="mb-8">
        <div className="border-l-4 border-blue-500 pl-4 py-2">
          <h2 className="text-xl font-semibold mb-4">Need More Information?</h2>
          <p className="mb-4">
            For the official text of the European Accessibility Act and
            additional resources:
          </p>
          <ul className="space-y-2 list-none">
            <li>
              <a
                href={EXTERNAL_LINKS.OFFICIAL_EAA_TEXT}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                aria-labelledby="official-directive-link"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span id="official-directive-link">
                  Official Directive (EU) 2019/882 text
                  <span className="sr-only">(opens in new window)</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://ec.europa.eu/social/main.jsp?catId=1202"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
                aria-labelledby="ec-resource-link"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span id="ec-resource-link">
                  European Commission EAA resource page
                  <span className="sr-only">(opens in new window)</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="text-sm text-muted-foreground border-t pt-4">
        <p>
          Source: Directive (EU) 2019/882 of the European Parliament and of the
          Council of 17 April 2019 on the accessibility requirements for
          products and services.
        </p>
        <p className="mt-1">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  )
}
