'use client'

import React, { forwardRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@workspace/ui/lib/utils'
import { type ComponentPropsWithoutRef } from 'react'
import { LinkItem } from '../constants/navigation'

type RouterLinkBaseProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>

interface RouterLinkPropsWithHref extends RouterLinkBaseProps {
  href: ComponentPropsWithoutRef<typeof Link>['href']
  linkItem?: never
}

interface RouterLinkPropsWithLinkItem extends RouterLinkBaseProps {
  href?: ComponentPropsWithoutRef<typeof Link>['href']
  linkItem: LinkItem
}

type RouterLinkProps = {
  activeClassname?: string
  exactMatch?: boolean
  partialMatches?: string[]
} & (RouterLinkPropsWithHref | RouterLinkPropsWithLinkItem)

/**
 * Enhanced link component that adds accessibility features and active state styling
 */
export const RouterLink = forwardRef<HTMLAnchorElement, RouterLinkProps>(
  (
    {
      children,
      className = '',
      activeClassname = 'text-foreground font-medium',
      exactMatch = false,
      partialMatches = [],
      href,
      linkItem,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname()

    // Use linkItem if provided, otherwise use href directly
    const linkHref = linkItem
      ? linkItem.fullPath
      : typeof href === 'string'
        ? href
        : href?.pathname || ''

    // Use children or linkItem.label
    const content = children || (linkItem?.label ?? '')

    // Check if this link is active
    const isActive =
      // Exact match (full path matches)
      (exactMatch && pathname === linkHref) ||
      // Partial match (pathname starts with link href, but not exact)
      (!exactMatch &&
        (pathname === linkHref ||
          (linkHref !== '/' && pathname.startsWith(linkHref)))) ||
      // Additional custom partial matches
      partialMatches.some(path => pathname.startsWith(path))

    return (
      <Link
        ref={ref}
        href={linkItem ? linkItem.fullPath : href || '/'}
        className={cn(className, isActive && activeClassname)}
        aria-current={isActive ? 'page' : undefined}
        {...props}
      >
        {content}
      </Link>
    )
  }
)

RouterLink.displayName = 'RouterLink'

/**
 * Component for displaying a group of related links
 */
export interface RelatedLinksProps {
  links: LinkItem[]
  title?: string
  className?: string
}

export function RelatedLinks({
  links,
  title = 'Related Topics',
  className,
}: RelatedLinksProps) {
  if (!links || links.length === 0) return null

  return (
    <div className={cn('mt-10 border-t pt-6', className)}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {links.map(link => (
          <li key={link.fullPath}>
            <RouterLink
              linkItem={link}
              className="hover:underline block p-2 rounded-md hover:bg-muted/50 transition-colors"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RouterLink
