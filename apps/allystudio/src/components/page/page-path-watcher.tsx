import { useCurrentUrl } from "@/providers/url-provider"
import { useEffect } from "react"

import { usePageContext } from "./page-context"

export function PagePathWatcher() {
  const pageActor = usePageContext()
  const { normalizedUrl } = useCurrentUrl()

  // Handle URL changes from useCurrentUrl
  useEffect(() => {
    if (!normalizedUrl) return

    pageActor.send({
      type: "PATH_CHANGED",
      normalizedUrl
    })
  }, [normalizedUrl, pageActor])

  return null // This is a non-rendering component
}
