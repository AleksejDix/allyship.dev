import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useUrl } from "@/providers/url-provider"
import { useSelector } from "@xstate/react"
import { Check, ChevronsUpDown, FileText, SearchIcon } from "lucide-react"
import { memo, useCallback, useMemo, useState } from "react"

import { usePageContext } from "./page-context"

interface PageSearchProps {
  placeholder?: string
  className?: string
}

export const PageSearch = memo(function PageSearch({
  placeholder = "Search pages...",
  className
}: PageSearchProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const pageActor = usePageContext()
  const { normalizedUrl } = useUrl()

  // Get pages from the state machine context
  const pages = useSelector(pageActor, (state) => state.context.pages)
  const selectedPageId = useSelector(
    pageActor,
    (state) => state.context.selectedPage?.id || null
  )

  // Sort pages once when the array changes
  const sortedPages = useMemo(
    () => [...pages].sort((a, b) => a.path.localeCompare(b.path)),
    [pages]
  )

  // Then filter separately when search changes
  const filteredPages = useMemo(() => {
    if (!search) return sortedPages

    const searchLower = search.toLowerCase()
    return sortedPages.filter(
      (page) =>
        page.path.toLowerCase().includes(searchLower) ||
        page.normalized_url.toLowerCase().includes(searchLower)
    )
  }, [sortedPages, search])

  // Modified to show current URL path when no page is selected
  const displayPath = useMemo(() => {
    // If a page is selected, show its path
    if (selectedPageId) {
      return (
        pages.find((page) => page.id === selectedPageId)?.path || placeholder
      )
    }

    // Otherwise show current URL path
    return normalizedUrl?.path || placeholder
  }, [pages, selectedPageId, normalizedUrl, placeholder])

  // Simplified page selection handler
  const handleSelectPage = useCallback(
    (pageId: string) => {
      const selectedPage = pages.find((page) => page.id === pageId)
      if (!selectedPage) return

      setOpen(false)

      // Reset state if needed, then select the page
      if (pageActor.getSnapshot().matches({ success: "selected" })) {
        pageActor.send({ type: "BACK" })
      }
      pageActor.send({ type: "SELECT_PAGE", pageId })

      // Validate URL before navigation
      if (!selectedPage.url) return

      const url = selectedPage.url.startsWith("http")
        ? selectedPage.url
        : `https://${selectedPage.url}`

      // Navigate using appropriate method
      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) chrome.tabs.update(tabs[0].id, { url })
        })
      } else {
        window.location.href = url
      }
    },
    [pageActor, pages, setOpen]
  )

  return (
    <div className="px-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-8 px-2 justify-between text-xs",
              className
            )}>
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="truncate">{displayPath}</span>
            </div>
            <ChevronsUpDown
              className="h-3.5 w-3.5 opacity-70"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start">
          <Command shouldFilter={false} className="rounded-none border-0">
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={setSearch}
              className="h-7 px-2 text-xs"
            />
            <CommandList className="max-h-60">
              <CommandEmpty className="py-1 text-xs">No results</CommandEmpty>
              <CommandGroup>
                {filteredPages.map((page) => (
                  <CommandItem
                    key={page.id}
                    value={page.id}
                    onSelect={() => handleSelectPage(page.id)}
                    className="py-1 px-1.5 text-xs cursor-pointer">
                    <div className="flex items-center gap-1.5 w-full">
                      <FileText
                        className="h-3.5 w-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="truncate">{page.path}</span>
                      {selectedPageId === page.id && (
                        <Check
                          className="ml-auto h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
})
