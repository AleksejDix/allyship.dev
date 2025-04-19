import React from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

type SeeAlsoLink = {
  href: string
  label: string
  description?: string
}

interface SeeAlsoProps {
  title?: string
  links: SeeAlsoLink[]
}

export function SeeAlso({ title = 'See Also', links }: SeeAlsoProps) {
  if (links.length === 0) return null

  return (
    <div className="bg-muted/50 rounded-lg p-4 mt-8">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen
          size={18}
          className="text-muted-foreground"
          aria-hidden="true"
        />
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {link.label}
            </Link>
            {link.description && (
              <span className="text-muted-foreground ml-1">
                — {link.description}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
