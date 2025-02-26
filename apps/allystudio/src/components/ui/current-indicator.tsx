import { cn } from "@/lib/utils"
import { useUrl } from "@/providers/url-provider"
import { CheckCircle2 } from "lucide-react"

interface CurrentIndicatorProps {
  hostname: string | null | undefined
  className?: string
  showIcon?: boolean
  children: React.ReactNode
}

/**
 * A component that highlights its children when they match the current hostname
 */
export function CurrentIndicator({
  hostname,
  className,
  showIcon = true,
  children
}: CurrentIndicatorProps) {
  const { normalizedUrl, isLoading } = useUrl()
  const isMatch = !isLoading && normalizedUrl?.hostname === hostname

  return (
    <div
      className={cn(
        "relative transition-colors duration-200",
        isMatch && "bg-primary/10 dark:bg-primary/20",
        className
      )}>
      {children}

      {isMatch && showIcon && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span className="sr-only">Current hostname</span>
        </div>
      )}
    </div>
  )
}

interface CurrentPathIndicatorProps {
  path: string | null | undefined
  className?: string
  showIcon?: boolean
  children: React.ReactNode
}

/**
 * A component that highlights its children when they match the current path
 */
export function CurrentPathIndicator({
  path,
  className,
  showIcon = true,
  children
}: CurrentPathIndicatorProps) {
  const { normalizedUrl, isLoading } = useUrl()
  const isMatch = !isLoading && normalizedUrl?.path === path

  console.log(normalizedUrl?.path, path)

  return (
    <div
      className={cn(
        "relative transition-colors duration-200",
        isMatch && "bg-primary/10 dark:bg-primary/20",
        className
      )}>
      {children}

      {isMatch && showIcon && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span className="sr-only">Current path</span>
        </div>
      )}
    </div>
  )
}
