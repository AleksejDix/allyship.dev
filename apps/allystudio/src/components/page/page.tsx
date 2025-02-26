import { useSelector } from "@xstate/react"
import { memo } from "react"
import type { PropsWithChildren } from "react"

import { useWebsiteContext } from "../website/website-context"
import { PageProvider } from "./page-context"
import { PageDebug } from "./page-debug"
import { PageError } from "./page-error"
import { PageList } from "./page-list"
import { PageListEmpty } from "./page-list-empty"
import { PageListSkeleton, Skeleton } from "./page-skeleton"

// Selector to get the current website from the website machine
const selectCurrentWebsite = (state: any) => state.context.currentWebsite

// Root component that sets up the machine and provider
// Use memo to prevent unnecessary re-renders
const Page = memo(function Page({
  children,
  debug = false
}: PropsWithChildren<{ debug?: boolean }>) {
  const websiteActor = useWebsiteContext()

  // Get the current website from the website context
  const currentWebsite = useSelector(
    websiteActor,
    selectCurrentWebsite,
    Object.is
  )

  // Only render when a website is selected
  if (!currentWebsite) {
    return null
  }

  return (
    <PageProvider websiteId={currentWebsite.id}>
      <Skeleton />
      <PageError />
      <PageList />
      <PageListEmpty />
      <PageListSkeleton />
      {children}
      {debug && <PageDebug />}
    </PageProvider>
  )
})

// Named exports for composite components
export {
  Page,
  PageDebug,
  PageError,
  PageList,
  PageListEmpty,
  Skeleton,
  PageListSkeleton
}
