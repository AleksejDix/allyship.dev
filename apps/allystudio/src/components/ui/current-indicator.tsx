import { cn } from "@/lib/utils"
import { useIsCurrentPage, useIsCurrentWebsite } from "@/providers/url-provider"
import { CheckCircle2 } from "lucide-react"
import { useMemo } from "react"

interface CurrentIndicatorProps {
  isMatch: boolean
  className?: string
  showIcon?: boolean
  showHighlight?: boolean
  children: React.ReactNode
}

/**
 * A component that highlights its children when they match the current URL
 *
 * @example
 * ```tsx
 * <CurrentIndicator isMatch={isCurrentWebsite}>
 *   <div>Website: example.com</div>
 * </CurrentIndicator>
 * ```
 */
export function CurrentIndicator({
  isMatch,
  className,
  showIcon = true,
  showHighlight = true,
  children
}: CurrentIndicatorProps) {
  return (
    <div
      className={cn(
        "relative transition-colors duration-200",
        isMatch && showHighlight && "bg-primary/10 dark:bg-primary/20",
        className
      )}>
      {children}

      {isMatch && showIcon && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span className="sr-only">Current page</span>
        </div>
      )}
    </div>
  )
}

/**
 * A component that highlights its children when they match the current website
 *
 * @example
 * ```tsx
 * <CurrentWebsiteIndicator domain="example.com">
 *   <div>Website: example.com</div>
 * </CurrentWebsiteIndicator>
 * ```
 */
export function CurrentWebsiteIndicator({
  domain,
  className,
  showIcon = true,
  showHighlight = true,
  children
}: {
  domain: string | null | undefined
  className?: string
  showIcon?: boolean
  showHighlight?: boolean
  children: React.ReactNode
}) {
  const { isMatch } = useIsCurrentWebsite(domain)

  return (
    <CurrentIndicator
      isMatch={isMatch}
      className={className}
      showIcon={showIcon}
      showHighlight={showHighlight}>
      {children}
    </CurrentIndicator>
  )
}

/**
 * A component that highlights its children when they match the current page
 *
 * @example
 * ```tsx
 * <CurrentPageIndicator domain="example.com" path="/products">
 *   <div>Page: /products</div>
 * </CurrentPageIndicator>
 * ```
 */
export function CurrentPageIndicator({
  domain,
  path,
  className,
  showIcon = true,
  showHighlight = true,
  children
}: {
  domain: string | null | undefined
  path: string | null | undefined
  className?: string
  showIcon?: boolean
  showHighlight?: boolean
  children: React.ReactNode
}) {
  const { isMatch } = useIsCurrentPage(domain, path)

  return (
    <CurrentIndicator
      isMatch={isMatch}
      className={className}
      showIcon={showIcon}
      showHighlight={showHighlight}>
      {children}
    </CurrentIndicator>
  )
}

/**
 * A component that highlights its children when they are part of the current space
 * This is a simpler indicator that doesn't rely on URL matching but can be used
 * to highlight the current space based on a boolean flag
 *
 * @example
 * ```tsx
 * <CurrentSpaceIndicator isCurrentSpace={space.id === currentSpaceId}>
 *   <div>Space: {space.name}</div>
 * </CurrentSpaceIndicator>
 * ```
 */
export function CurrentSpaceIndicator({
  isCurrentSpace,
  className,
  showIcon = true,
  showHighlight = true,
  children
}: {
  isCurrentSpace: boolean
  className?: string
  showIcon?: boolean
  showHighlight?: boolean
  children: React.ReactNode
}) {
  return (
    <CurrentIndicator
      isMatch={isCurrentSpace}
      className={className}
      showIcon={showIcon}
      showHighlight={showHighlight}>
      {children}
    </CurrentIndicator>
  )
}
