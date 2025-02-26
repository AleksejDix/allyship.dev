import { useSelector } from "@xstate/react"
import type { PropsWithChildren } from "react"

import { useWebsiteContext } from "../website/website-context"
import { PageProvider } from "./page-context"
import { PageDebug } from "./page-debug"
import { PageError } from "./page-error"
import { PageList } from "./page-list"
import { PageListEmpty } from "./page-list-empty"
import { pageMachine, type PageMachineActorRef } from "./page-machine"
import { PageListSkeleton, Skeleton } from "./page-skeleton"

// Selector to get the current website from the website machine
const selectCurrentWebsite = (state: any) => state.context.currentWebsite

// Root component that sets up the machine and provider
export function Page({
  children,
  debug = false
}: PropsWithChildren<{ debug?: boolean }>) {
  const websiteActor = useWebsiteContext()
  const currentWebsite = useSelector(websiteActor, selectCurrentWebsite)

  // Only render the PageProvider if we have a selected website
  if (!currentWebsite) {
    return null
  }

  return (
    <PageProvider websiteId={currentWebsite.id}>
      {/* Each component manages its own visibility based on state */}
      <Skeleton />
      <PageError />
      <PageList />
      {children}
      {debug && <PageDebug />}
    </PageProvider>
  )
}

// Export all components and types from this file
export {
  // Components
  PageProvider,
  PageDebug,
  PageError,
  PageList,
  PageListEmpty,
  Skeleton,
  PageListSkeleton,

  // Types
  pageMachine,
  type PageMachineActorRef
}
