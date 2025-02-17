import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-border", className)}>
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-semibold tracking-tight"
              id="page-title"
            >
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {children && (
            <div className="flex items-center gap-4">{children}</div>
          )}
        </div>
      </div>
    </div>
  )
}
