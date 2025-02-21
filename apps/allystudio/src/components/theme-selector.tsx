import { cn } from "@/lib/utils"

import { useTheme } from "./theme-provider"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4">
      <h2 id="theme-selector-heading" className="text-lg font-semibold">
        Appearance
      </h2>
      <fieldset className="grid grid-cols-3 gap-4">
        <legend className="sr-only">Choose a theme</legend>

        <label
          className={cn(
            "group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-3",
            "hover:border-accent focus-within:ring-2 focus-within:ring-ring",
            theme === "light" && "border-blue-600"
          )}>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === "light"}
            onChange={(e) => e.target.checked && setTheme("light")}
            className="sr-only"
          />
          <div
            className="flex h-16 w-full items-center justify-center rounded-md border bg-[#ecedef] dark:bg-[#ecedef]"
            aria-hidden="true">
            <div className="w-8 rounded-sm bg-white/80 p-1 shadow-sm" />
          </div>
          <span className="text-sm font-medium">Light</span>
        </label>

        <label
          className={cn(
            "group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-3",
            "hover:border-accent focus-within:ring-2 focus-within:ring-ring",
            theme === "dark" && "border-blue-600"
          )}>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === "dark"}
            onChange={(e) => e.target.checked && setTheme("dark")}
            className="sr-only"
          />
          <div
            className="flex h-16 w-full items-center justify-center rounded-md border bg-[#1c1c1c] dark:bg-[#1c1c1c]"
            aria-hidden="true">
            <div className="w-8 rounded-sm bg-white/10 p-1 shadow-sm" />
          </div>
          <span className="text-sm font-medium">Dark</span>
        </label>

        <label
          className={cn(
            "group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-muted bg-popover p-3",
            "hover:border-accent focus-within:ring-2 focus-within:ring-ring",
            theme === "system" && "border-blue-600"
          )}>
          <input
            type="radio"
            name="theme"
            value="system"
            checked={theme === "system"}
            onChange={(e) => e.target.checked && setTheme("system")}
            className="sr-only"
          />
          <div
            className="flex h-16 w-full items-center justify-center rounded-md border overflow-hidden"
            aria-hidden="true">
            <div className="flex w-full h-full">
              {/* Light side */}
              <div className="w-1/2 bg-[#ecedef] flex items-center justify-center border-r">
                <div className="w-4 rounded-sm bg-white/80 p-1 shadow-sm" />
              </div>
              {/* Dark side */}
              <div className="w-1/2 bg-[#1c1c1c] flex items-center justify-center">
                <div className="w-4 rounded-sm bg-white/10 p-1 shadow-sm" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">System</span>
          </div>
        </label>
      </fieldset>
    </div>
  )
}
