import { cn } from "@/lib/utils"

import "@testing-library/jest-dom"

export interface HostnamePartProps {
  hostname: string
  currentHostname: string
}

/**
 * HostnamePart - The hostname part of the URL
 */
export function Hostname({ hostname, currentHostname }: HostnamePartProps) {
  const hasMatchingWebsite = currentHostname === hostname

  return (
    <span
      className={cn(
        "shrink-0",
        hasMatchingWebsite
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      )}>
      {hostname}
    </span>
  )
}
