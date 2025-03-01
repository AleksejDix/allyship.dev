import { useEffect, useRef } from "react"

import { useWebsiteContext } from "./website-context"

/**
 * WebsiteWatcher component to centralize website change detection
 * This is a non-rendering component that watches for website ID changes
 * and sends appropriate events to the page machine.
 */
export function WebsiteSpaceWatcher({ spaceId }: { spaceId: string | null }) {
  const websiteActor = useWebsiteContext()
  const previousSpaceIdRef = useRef<string | null>(spaceId)

  // Send WEBSITE_CHANGED event when websiteId changes
  useEffect(() => {
    // Only send the event if the website ID has actually changed and is not null
    if (previousSpaceIdRef.current !== spaceId && spaceId !== null) {
      console.log(
        "Website changed, sending WEBSITE_CHANGED event with ID:",
        spaceId
      )
      websiteActor.send({ type: "SPACE_CHANGED", spaceId })
      previousSpaceIdRef.current = spaceId
    }
  }, [spaceId, websiteActor])

  return null // This is a non-rendering component
}
