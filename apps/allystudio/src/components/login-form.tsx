import { cn } from "@/lib/utils"
import { useState } from "react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Get the current window
      const currentWindow = await chrome.windows.getCurrent()
      if (!currentWindow.id) throw new Error("No window ID found")

      // Send message to background script
      await chrome.runtime.sendMessage({
        type: "OPEN_SIDE_PANEL",
        windowId: currentWindow.id
      })

      // Close the popup
      window.close()
    } catch (error) {
      console.error("Failed to open sidebar:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && <div className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <div className="mr-2 h-4 w-4" />
        )}
        GitHub
      </Button>
    </div>
  )
}
