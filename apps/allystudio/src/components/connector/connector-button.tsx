import { useCurrentUrl } from "@/providers/url-provider"
import type { PropsWithChildren } from "react"

export function ConnectorButton({ children }: PropsWithChildren) {
  const { normalizedUrl } = useCurrentUrl()

  const handleTrack = () => {
    if (!normalizedUrl) return
  }

  return (
    <button onClick={handleTrack} type="button" aria-label="Track">
      {children}
    </button>
  )
}
