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
import type { Database } from "@/types/database.types"
import { useSelector } from "@xstate/react"
import { Check, ChevronsUpDown, FileText, SearchIcon } from "lucide-react"
import { memo, useCallback, useMemo, useState } from "react"

import { usePageContext } from "./page-context"

type Page = Database["public"]["Tables"]["Page"]["Row"]

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

  // Get pages from the state machine context
  const pages = useSelector(pageActor, (state) => state.context.pages)
  const selectedPageId = useSelector(
    pageActor,
    (state) => state.context.selectedPage?.id || null
  )

  // Filter pages based on search term
  const filteredPages = useMemo(() => {
    // First sort all pages by path
    const sortedPages = [...pages].sort((a, b) => a.path.localeCompare(b.path))

    // Then filter if search term exists
    if (!search) return sortedPages

    const searchLower = search.toLowerCase()
    return sortedPages.filter(
      (page) =>
        page.path.toLowerCase().includes(searchLower) ||
        page.normalized_url.toLowerCase().includes(searchLower)
    )
  }, [pages, search])

  // Handle page selection
  const handleSelectPage = useCallback(
    (pageId: string) => {
      // Find the selected page
      const selectedPage = pages.find((page) => page.id === pageId)
      if (!selectedPage) return

      // Close the dropdown
      setOpen(false)

      console.log("Selecting page:", selectedPage.path, "with ID:", pageId)

      // Ensure proper state transition by forcing a BACK event first if already in selected state
      const currentState = pageActor.getSnapshot()
      if (currentState.matches({ success: "selected" })) {
        console.log("Already in selected state, going BACK first")
        pageActor.send({ type: "BACK" })
      }

      // Now send the SELECT_PAGE event to ensure clean transition
      pageActor.send({ type: "SELECT_PAGE", pageId })

      // Verify state transition worked by checking again after a small delay
      setTimeout(() => {
        const newState = pageActor.getSnapshot()
        console.log("New state after selection:", newState.value)
        console.log(
          "Selected page in context:",
          newState.context.selectedPage?.path
        )

        // Only navigate if state transition was successful
        if (
          newState.matches({ success: "selected" }) &&
          newState.context.selectedPage?.id === pageId &&
          selectedPage.url
        ) {
          // Format URL
          const url = selectedPage.url.startsWith("http")
            ? selectedPage.url
            : `https://${selectedPage.url}`

          console.log("Navigation confirmed - opening URL:", url)

          // Navigate using Chrome extension API
          if (typeof chrome !== "undefined" && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0] && tabs[0].id) {
                chrome.tabs.update(tabs[0].id, { url })
              }
            })
          } else {
            window.location.href = url
          }
        } else {
          console.warn(
            "State transition failed or URL missing - navigation aborted"
          )
        }
      }, 100) // Slightly longer delay to ensure state transition completes
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
              <SearchIcon
                className="h-3.5 w-3.5 opacity-70"
                aria-hidden="true"
              />
              <span className="truncate">
                {selectedPageId
                  ? pages.find((page) => page.id === selectedPageId)?.path ||
                    placeholder
                  : placeholder}
              </span>
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
                    <div
                      className="flex items-center gap-1.5 w-full"
                      onClick={() => handleSelectPage(page.id)}>
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
