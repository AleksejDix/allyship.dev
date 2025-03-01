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
import { useSelector } from "@xstate/react"
import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { memo, useCallback, useMemo, useState } from "react"

import { useWebsiteContext } from "./website-context"

interface WebsiteSearchProps {
  placeholder?: string
  className?: string
}

export const WebsiteSearch = memo(function WebsiteSearch({
  placeholder = "Search websites...",
  className
}: WebsiteSearchProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const websiteActor = useWebsiteContext()

  // Get websites from the state machine context
  const websites = useSelector(websiteActor, (state) => state.context.websites)
  const currentWebsite = useSelector(
    websiteActor,
    (state) => state.context.currentWebsite,
    Object.is
  )

  // Sort websites once when the array changes
  const sortedWebsites = useMemo(
    () =>
      [...websites].sort((a, b) =>
        a.normalized_url.localeCompare(b.normalized_url)
      ),
    [websites]
  )

  // Then filter separately when search changes
  const filteredWebsites = useMemo(() => {
    if (!search) return sortedWebsites

    const searchLower = search.toLowerCase()
    return sortedWebsites.filter((website) =>
      website.normalized_url.toLowerCase().includes(searchLower)
    )
  }, [sortedWebsites, search])

  // Display the current website name/URL or placeholder
  const displayText = useMemo(() => {
    if (currentWebsite) {
      return currentWebsite.normalized_url
    }
    return placeholder
  }, [currentWebsite, placeholder])

  // Handle website selection
  const handleSelectWebsite = useCallback(
    (websiteId: string) => {
      const selectedWebsite = websites.find(
        (website) => website.id === websiteId
      )
      if (!selectedWebsite) return

      setOpen(false)
      websiteActor.send({
        type: "WEBSITE_SELECTED",
        website: selectedWebsite
      })

      // Navigate to the website URL if needed
      // Uncomment if you want navigation to happen on selection
      /*
      if (!selectedWebsite.url) return

      const url = selectedWebsite.url.startsWith("http")
        ? selectedWebsite.url
        : `https://${selectedWebsite.url}`

      // Navigate using appropriate method
      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) chrome.tabs.update(tabs[0].id, { url })
        })
      } else {
        window.location.href = url
      }
      */
    },
    [websiteActor, websites, setOpen]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-16 h-8"
          role="combobox"
          aria-expanded={open}>
          <div className="flex items-center gap-1 overflow-hidden">
            <Globe size={16} aria-hidden="true" />
            {/* <span className="truncate">{displayText}</span> */}
          </div>
          <ChevronsUpDown size={16} aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
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
              {filteredWebsites.map((website) => (
                <CommandItem
                  key={website.id}
                  value={website.id}
                  onSelect={() => handleSelectWebsite(website.id)}
                  className="py-1 px-1.5 text-xs cursor-pointer">
                  <div className="flex items-center gap-1.5 w-full">
                    <Globe
                      className="h-3.5 w-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="truncate">{website.normalized_url}</span>
                    {currentWebsite?.id === website.id && (
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
  )
})
