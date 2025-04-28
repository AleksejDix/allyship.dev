import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { getNextPage, getPrevPage } from '../constants/links'

export function ChapterNavigation({
  currentPageId,
}: {
  currentPageId: string
}) {
  const prevPage = getPrevPage(currentPageId)
  const nextPage = getNextPage(currentPageId)

  return (
    <nav
      className="flex justify-between items-center mt-10 pt-4 border-t"
      aria-labelledby="chapter-navigation-heading"
    >
      <h2 id="chapter-navigation-heading" className="sr-only">
        Chapter navigation
      </h2>

      {prevPage ? (
        <Button variant="outline" asChild>
          <Link
            href={prevPage.fullPath}
            className="no-underline flex items-center gap-2"
            aria-labelledby="prev-chapter-label"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span id="prev-chapter-label">{prevPage.label}</span>
          </Link>
        </Button>
      ) : (
        <div>{/* Empty div to maintain flex spacing */}</div>
      )}

      {nextPage ? (
        <Button asChild>
          <Link
            href={nextPage.fullPath}
            className="no-underline flex items-center gap-2"
            aria-labelledby="next-chapter-label"
          >
            <span id="next-chapter-label">{nextPage.label}</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </nav>
  )
}
