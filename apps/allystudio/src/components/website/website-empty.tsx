import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useSelector } from "@xstate/react"
import { Globe, Plus } from "lucide-react"
import { memo, useState } from "react"

import { useWebsiteContext } from "./website-context"

// Use memo to prevent unnecessary re-renders
export const WebsiteEmpty = memo(function WebsiteEmpty() {
  const actor = useWebsiteContext()
  const [url, setUrl] = useState("")

  // Get the current state and context for debugging
  const state = useSelector(actor, (state) => state.value)
  const context = useSelector(actor, (state) => state.context)

  // Use memoized selector with Object.is comparison for better performance
  const shouldRender = useSelector(
    actor,
    (state) => state.matches("empty") as boolean,
    Object.is
  )

  console.log(
    "WebsiteEmpty - state:",
    state,
    "shouldRender:",
    shouldRender,
    "websites:",
    context.websites
  )

  // Only render when in the empty state
  if (!shouldRender) {
    return null
  }

  const handleAddWebsite = () => {
    if (url.trim()) {
      actor.send({ type: "ADD_WEBSITE", url: url.trim() })
      setUrl("")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" aria-hidden="true" />
            <span>No websites found</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first website to start analyzing accessibility issues.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button onClick={handleAddWebsite} disabled={!url.trim()}>
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Add
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => actor.send({ type: "REFRESH" })}>
            Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
})
