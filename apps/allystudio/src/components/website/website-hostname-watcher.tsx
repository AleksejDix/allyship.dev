import { useCurrentUrl } from "@/providers/url-provider"
import { useEffect } from "react"

import { useWebsiteContext } from "./website-context"

export function WebsiteHostnameWatcher() {
  const actor = useWebsiteContext()
  const { normalizedUrl } = useCurrentUrl()

  useEffect(() => {
    if (!normalizedUrl) return

    actor.send({
      type: "HOSTNAME_CHANGED",
      normalizedUrl
    })
  }, [normalizedUrl])

  return null // This is a non-rendering component
}
