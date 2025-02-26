import { useSelector } from "@xstate/react"
import { useEffect, useRef, type PropsWithChildren } from "react"

import { useWebsiteContext } from "../website/website-context"
import { PageProvider, usePageContext } from "./page-context"
import { PageDebug } from "./page-debug"
import { PageError } from "./page-error"
import { PageList } from "./page-list"

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
      <PageContent websiteId={currentWebsite.id}>
        <PageError />
        <PageList />
        {children}
        {debug && <PageDebug />}
      </PageContent>
    </PageProvider>
  )
}

function PageContent({
  children,
  websiteId
}: {
  children: React.ReactNode
  websiteId: string
}) {
  const previousWebsiteIdRef = useRef<string | null>(null)
  const pageActor = usePageContext()

  // Send LOAD_PAGES event when the websiteId changes
  useEffect(() => {
    // Skip the first render
    if (
      previousWebsiteIdRef.current !== null &&
      previousWebsiteIdRef.current !== websiteId
    ) {
      console.log(
        "Website changed from",
        previousWebsiteIdRef.current,
        "to",
        websiteId
      )
      pageActor.send({ type: "LOAD_PAGES", websiteId })
    }

    previousWebsiteIdRef.current = websiteId
  }, [websiteId, pageActor])

  return <>{children}</>
}

// Named exports for composite components
export { PageError, PageList }
