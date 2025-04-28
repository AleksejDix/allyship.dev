import Link from 'next/link'

import { Separator } from '@workspace/ui/components/separator'
import { PAGES, type PageInfo } from '../constants/links'

function groupByChapterName(acc: Record<string, PageInfo[]>, page: PageInfo) {
  const chapterPart = page.path.split('.')[0]
  const chapter = chapterPart ? (chapterPart.split('-')[0] as string) : ''
  acc[chapter] = acc[chapter] || []
  acc[chapter].push(page)
  return acc
}

function objectToArray(obj: Record<string, PageInfo>) {
  return Object.values(obj).reduce(groupByChapterName, {})
}

export function TableOfContent() {
  const chapters = objectToArray(PAGES)

  return (
    <nav className="space-y-8">
      {Object.entries(chapters).map(([chapter, pages]) => (
        <div key={chapter}>
          <p className="text-sm font-medium tracking-widest uppercase">
            Chapter {chapter.replace('/', '')}
          </p>

          {pages.length > 0 && pages[0] && (
            <Link
              className="text-3xl font-bold font-display block mb-2"
              href={pages[0].fullPath}
            >
              {pages[0].label}
            </Link>
          )}
          <ul className="space-y-0 list-none border-l-2 border-black pl-4">
            {pages.slice(1).map((page, index) => (
              <li key={page.path} className={index === 0 ? 'mb-0' : ''}>
                <Link href={page.fullPath}>{page.label}</Link>
              </li>
            ))}
          </ul>
          <hr className="my-4 border-t border-gray-200" />
        </div>
      ))}
    </nav>
  )
}
