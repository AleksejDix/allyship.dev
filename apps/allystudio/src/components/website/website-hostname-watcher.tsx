import { useCurrentUrl } from "@/providers/url-provider"
import { useEffect } from "react"

import { useWebsiteContext } from "./website-context"

export function WebsiteHostnameWatcher() {
  const actor = useWebsiteContext()
  const { normalizedUrl } = useCurrentUrl()

  useEffect(() => {
    // Only send the event if there's a valid normalizedUrl with a hostname
    if (!normalizedUrl?.hostname) return

    console.log(
      "WebsiteHostnameWatcher sending URL_CHANGED with hostname:",
      normalizedUrl.hostname
    )
    console.log("Full normalizedUrl structure:", normalizedUrl)

    actor.send({
      type: "URL_CHANGED",
      normalizedUrl
    })
  }, [normalizedUrl, actor])

  return null // This is a non-rendering component
}
