"use client"

import { cn } from "@/lib/utils"
import { type Database } from "@/types/database"
import { Link2, Link2Off } from "lucide-react"

interface FileHeaderProps {
  currentFile?: string
  isConnected?: boolean
  onAddPage?: (url: string) => Promise<void>
  pageData?: Database["public"]["Tables"]["Page"]["Row"] | null
}

export function FileHeader({
  currentFile = "Untitled Page",
  isConnected = false,
  pageData
}: FileHeaderProps) {
  return (
    <div className="flex h-[32px] items-center gap-2 border-b px-3">
      {isConnected ? (
        <Link2
          className="h-4 w-4 text-green-600 dark:text-green-400"
          aria-hidden="true"
        />
      ) : (
        <Link2Off
          className="h-4 w-4 text-red-600 dark:text-red-400"
          aria-hidden="true"
        />
      )}
      <h1 className="truncate text-sm font-medium">{currentFile}</h1>
    </div>
  )
}
