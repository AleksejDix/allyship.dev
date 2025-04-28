import React from 'react'
import { Metadata } from 'next'
import EaaTimeline from '../components/EaaTimeline'
import { TableOfContent } from '../components/TableOfContent'
import { Button } from '@workspace/ui/components/button'
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
    <main>
      <div>
        <section className="mb-12">
          <h1 className="sr-only text-4xl font-extrabold max-w-xl tracking-tight text-pretty lg:text-7xl font-display">
            European Accessibility Act &mdash; in Plain English
          </h1>
        </section>

        <p className="text-2xl ">
          The <strong>European Accessibility Act</strong> is an important law.
          It helps make products and services easier to use for people with
          disabilities. But legal language can be hard to understand. This book
          explains the EAA in simple words, so everyone can learn what it means
          and what to do. Easy to follow and clear for all.
        </p>

        <Button>Start Reading</Button>

        <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

        <TableOfContent />
      </div>

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
    </main>
  )
}
