import { useCurrentUrl } from "@/providers/url-provider"
import { useSelector } from "@xstate/react"
import { memo } from "react"
import type { PropsWithChildren } from "react"

import {
  useWebsiteContext,
  WebsiteSearch,
  WebsiteSelectRequired
} from "../website"
import { PageAdd } from "./page-add"
import { PageProvider } from "./page-context"
import { PageDebug } from "./page-debug"
import { PageError } from "./page-error"
import { PageList } from "./page-list"
import { PageListEmpty } from "./page-list-empty"
import { PageSearch } from "./page-search"
import { PageSelected } from "./page-selected"
import { PageListSkeleton, Skeleton } from "./page-skeleton"

// Selector to get the selected website from the website machine
const selectSelectedWebsite = (state: any) => state.context.selectedWebsite

// Root component that sets up the machine and provider
// Use memo to prevent unnecessary re-renders
const Page = memo(function Page({
  children,
  debug = false
}: PropsWithChildren<{ debug?: boolean }>) {
  const { normalizedUrl } = useCurrentUrl()
  const websiteActor = useWebsiteContext()

  // Get the selected website from the website state machine
  const selectedWebsite = useSelector(
    websiteActor,
    selectSelectedWebsite,
    Object.is
  )

  if (!selectedWebsite) {
    return <WebsiteSelectRequired />
  }

  return (
    <>
      <PageProvider
        websiteId={selectedWebsite.id}
        normalizedUrl={normalizedUrl}>
        {/* <Skeleton /> */}
        {/* <PageError /> */}
        <div className="flex items-center justify-between p-2">
          <WebsiteSearch />
          <div className="grow">
            <PageSearch />
          </div>
          <PageAdd />
        </div>
        <PageSelected>{children}</PageSelected>
        <PageListSkeleton />
        {debug && <PageDebug />}
      </PageProvider>
    </>
  )
})

// Named exports for composite components
export {
  Page,
  PageDebug,
  PageError,
  PageList,
  PageListEmpty,
  PageListSkeleton,
  PageProvider
}
