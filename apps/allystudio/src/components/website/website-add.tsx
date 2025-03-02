import { useAuth } from "@/providers/auth-provider"
import { useUrl } from "@/providers/url-provider"
import { type TablesInsert } from "@/types/database.types"
import { useSelector } from "@xstate/react"
import { useCallback, useId, useMemo } from "react"

import { useSpaceContext } from "../space/space-context"
import { Button } from "../ui/button"
import { useWebsiteContext } from "./website-context"

type WebsiteInsert = TablesInsert<"Website">

export function WebsiteAdd() {
  const actor = useWebsiteContext()
  const { normalizedUrl } = useUrl()
  const addWebsiteId = useId()

  const auth = useAuth()

  const spaceActor = useSpaceContext()
  const currentSpace = useSelector(
    spaceActor,
    (state) => state.context.currentSpace
  )

  const websites = useSelector(actor, (state) => state.context.websites)

  const websiteAlreadyExists = useMemo(() => {
    if (!normalizedUrl || !websites) return false
    return websites.some(
      (website) => website.normalized_url === normalizedUrl.hostname
    )
  }, [normalizedUrl, websites])

  // Create the payload early, even though we might not use it
  const payload = useMemo(() => {
    if (!normalizedUrl || !currentSpace) return null

    return {
      normalized_url: normalizedUrl.hostname,
      url: normalizedUrl.raw,
      theme: "LIGHT",
      space_id: currentSpace.id,
      user_id: auth.user?.id
    } as WebsiteInsert
  }, [normalizedUrl, currentSpace, auth.user?.id])

  // Move the useCallback to the top level
  const handleAddWebsite = useCallback(() => {
    if (!payload) return

    console.log("Adding website", payload)
    console.log("Current actor state:", actor.getSnapshot())

    actor.send({ type: "ADD_WEBSITE", payload })
  }, [actor, payload])

  if (!currentSpace) {
    return null
  }

  if (!normalizedUrl) {
    return null
  }

  // Add a log to verify the normalizedUrl structure
  console.log("WebsiteAdd normalizedUrl structure:", normalizedUrl)

  return (
    <Button
      type="button"
      onClick={handleAddWebsite}
      disabled={websiteAlreadyExists || !payload}
      aria-disabled={websiteAlreadyExists}
      title={
        websiteAlreadyExists
          ? "This website already exists"
          : "Add this website"
      }>
      <span id={addWebsiteId} className="sr-only">
        {websiteAlreadyExists ? "Website already added" : "Add this website"}
      </span>
      {websiteAlreadyExists ? "Already added" : "Add"}
    </Button>
  )
}
