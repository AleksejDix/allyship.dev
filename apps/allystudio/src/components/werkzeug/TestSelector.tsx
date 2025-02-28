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
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Play } from "lucide-react"
import { memo, useCallback, useEffect, useState } from "react"

import { useTestContext } from "./TestContext"

// Memoized Test Selector Component
const TestSelector = memo(function TestSelector() {
  const { runTest, stopTest, isRunning, activeTest } = useTestContext()
  const [selectedTest, setSelectedTest] = useState<TestType | "">("")
  const [open, setOpen] = useState(false)

  // Update selected test when active test changes
  useEffect(() => {
    if (activeTest) {
      setSelectedTest(activeTest)
    }
  }, [activeTest])

  const handleTestSelection = useCallback((value: string) => {
    setSelectedTest(value as TestType)
    setOpen(false)
  }, [])

  const handleRunClick = useCallback(() => {
    if (isRunning) {
      stopTest()
    } else if (selectedTest) {
      runTest(selectedTest as TestType)
    }
  }, [isRunning, stopTest, runTest, selectedTest])

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between">
                <span className="truncate">
                  {selectedTest
                    ? TEST_CONFIGS[selectedTest as TestType]?.displayName
                    : "Search tests..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search tests..." />
                <CommandList>
                  <CommandEmpty>No tests found.</CommandEmpty>
                  <CommandGroup>
                    {Object.entries(TEST_CONFIGS)
                      .sort(([, a], [, b]) =>
                        a.displayName.localeCompare(b.displayName)
                      )
                      .map(([type, config]) => (
                        <CommandItem
                          key={type}
                          value={type}
                          onSelect={handleTestSelection}
                          className="flex items-center justify-between">
                          <span>{config.displayName}</span>
                          {type === selectedTest && (
                            <Check className="h-4 w-4" aria-hidden="true" />
                          )}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={handleRunClick}
          disabled={!selectedTest && !isRunning}
          variant={isRunning ? "destructive" : "ghost"}
          size="icon"
          className={cn(isRunning ? "animate-pulse" : "")}>
          {isRunning ? (
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Play className="h-4 w-4 text-green-600" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  )
})

export default TestSelector
