import { useAuth } from "@/providers/auth-provider"
import { useUrl } from "@/providers/url-provider"
import { type TablesInsert } from "@/types/database.types"
import { useSelector } from "@xstate/react"
import { useCallback } from "react"

import { useSpaceContext } from "../space/space-context"
import { Button } from "../ui/button"
import { useWebsiteContext } from "./website-context"

type WebsiteInsert = TablesInsert<"Website">

export function WebsiteAdd() {
  const actor = useWebsiteContext()
  const { normalizedUrl } = useUrl()

  const auth = useAuth()

  const spaceActor = useSpaceContext()
  const currentSpace = useSelector(
    spaceActor,
    (state) => state.context.currentSpace
  )

  if (!currentSpace) {
    return null
  }

  if (!normalizedUrl) {
    return null
  }

  const payload: WebsiteInsert = {
    normalized_url: normalizedUrl.hostname,
    url: normalizedUrl.raw,
    theme: "LIGHT",
    space_id: currentSpace.id,
    user_id: auth.user?.id
  }

  const handleAddWebsite = useCallback(() => {
    actor.send({ type: "ADD_WEBSITE", payload })
  }, [actor, payload])

  return (
    <Button type="button" onClick={handleAddWebsite}>
      add
    </Button>
  )
}
