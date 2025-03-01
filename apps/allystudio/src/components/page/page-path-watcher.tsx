import { useCurrentUrl } from "@/providers/url-provider"
import { useEffect } from "react"

import { usePageContext } from "./page-context"

export function PagePathWatcher() {
  const pageActor = usePageContext()
  const { normalizedUrl } = useCurrentUrl()

  useEffect(() => {
    if (!normalizedUrl) return

    pageActor.send({
      type: "PATH_CHANGED",
      normalizedUrl
    })
  }, [normalizedUrl])

  return null // This is a non-rendering component
}
