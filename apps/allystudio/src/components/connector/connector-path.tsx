import { cn } from "@/lib/utils"

import "@testing-library/jest-dom"

export interface PathPartProps {
  path: string
  currentPath: string
}

export function PathPart({ path, currentPath }: PathPartProps) {
  const isMatching = currentPath === path
  return (
    <span
      className={cn(
        "truncate",
        isMatching
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      )}>
      {path}
    </span>
  )
}
