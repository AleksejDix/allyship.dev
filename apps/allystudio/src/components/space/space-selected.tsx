import { useSpaceContext } from "@/components/space/space-context"
import { useSelector } from "@xstate/react"
import type { PropsWithChildren } from "react"

export function SpaceSelected({ children }: PropsWithChildren) {
  const actor = useSpaceContext()

  const selection = useSelector(actor, (state) => state.context.currentSpace)

  // if (
  //   !snapshot?.matches({ loaded: { count: "one" } }) &&
  //   !snapshot?.matches({
  //     loaded: { count: "some", selection: "selected" }
  //   })
  // ) {
  //   return null
  // }

  return (
    <>
      {selection?.name}
      {children}
    </>
  )
}
