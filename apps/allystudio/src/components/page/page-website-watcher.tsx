import { useEffect, useRef } from "react"

import { usePageContext } from "./page-context"

/**
 * WebsiteWatcher component to centralize website change detection
 * This is a non-rendering component that watches for website ID changes
 * and sends appropriate events to the page machine.
 */
export function WebsiteWatcher({ websiteId }: { websiteId: string | null }) {
  const pageActor = usePageContext()
  const previousWebsiteIdRef = useRef<string | null>(websiteId)

  // Send WEBSITE_CHANGED event when websiteId changes
  useEffect(() => {
    // Only send the event if the website ID has actually changed and is not null
    if (previousWebsiteIdRef.current !== websiteId && websiteId !== null) {
      console.log(
        "Website changed, sending WEBSITE_CHANGED event with ID:",
        websiteId
      )
      pageActor.send({ type: "WEBSITE_CHANGED", websiteId })
      previousWebsiteIdRef.current = websiteId
    }
  }, [websiteId, pageActor])

  return null // This is a non-rendering component
}
