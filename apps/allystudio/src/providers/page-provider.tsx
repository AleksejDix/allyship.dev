import { pageMachine } from "@/providers/page"
import type { Database } from "@/types/database"
import type { PostgrestError } from "@supabase/supabase-js"
import { useActorRef, useSelector } from "@xstate/react"
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren
} from "react"
import type { ActorRefFrom } from "xstate"

import { useCurrentUrl } from "./url-provider"
import { useWebsite } from "./website-provider"

type Page = Database["public"]["Tables"]["Page"]["Row"]
type Website = Database["public"]["Tables"]["Website"]["Row"]

type PageWithWebsite = Page & {
  website: Website
}

interface PageContextValue {
  pages: PageWithWebsite[]
  error: PostgrestError | null
  websiteId: string | null
  currentUrl: string | null
  matchingPage: PageWithWebsite | null
  addPage: (url: string, websiteId: string) => void
  refresh: () => void
  setWebsiteId: (websiteId: string | null) => void
  actor: ActorRefFrom<typeof pageMachine>
  isLoading: boolean
}

const PageContext = createContext<PageContextValue | undefined>(undefined)

function usePageContext() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error("Page context must be used within PageProvider")
  }
  return context
}

// Helper to find a matching page for a URL
function findMatchingPage(
  url: string,
  pages: PageWithWebsite[]
): PageWithWebsite | null {
  if (!url || !pages?.length) return null
  return pages.find((page) => page.normalized_url === url) ?? null
}

function Root({ children }: PropsWithChildren) {
  const { websites } = useWebsite()
  const { normalizedUrl, isLoading: urlLoading } = useCurrentUrl()

  const actorRef = useActorRef(pageMachine)

  const pages = useSelector(actorRef, (state) => state.context.pages)
  const error = useSelector(actorRef, (state) => state.context.error)
  const websiteId = useSelector(actorRef, (state) => state.context.websiteId)

  // Find matching page for current URL
  const matchingPage = useMemo(
    () => (normalizedUrl ? findMatchingPage(normalizedUrl, pages) : null),
    [normalizedUrl, pages]
  )

  // Memoize callbacks
  const addPage = useMemo(
    () => (url: string, websiteId: string) =>
      actorRef.send({ type: "ADD_PAGE", url, websiteId }),
    [actorRef]
  )

  const refresh = useMemo(
    () => () => actorRef.send({ type: "REFRESH" }),
    [actorRef]
  )

  const setWebsiteId = useMemo(
    () => (websiteId: string | null) =>
      actorRef.send({ type: "WEBSITE_CHANGED", websiteId }),
    [actorRef]
  )

  const value = useMemo(
    () => ({
      pages,
      error,
      websiteId,
      currentUrl: normalizedUrl,
      matchingPage,
      addPage,
      refresh,
      setWebsiteId,
      actor: actorRef,
      isLoading: urlLoading
    }),
    [
      pages,
      error,
      websiteId,
      normalizedUrl,
      matchingPage,
      addPage,
      refresh,
      setWebsiteId,
      actorRef,
      urlLoading
    ]
  )

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export function PageProvider({ children }: PropsWithChildren) {
  return (
    <Root>
      <div className="flex h-full flex-col">{children}</div>
    </Root>
  )
}

export function usePage() {
  return usePageContext()
}

// Helper to find a page by URL
export function usePageByUrl(url: string) {
  const { pages } = usePage()
  return useMemo(() => findMatchingPage(url, pages), [pages, url])
}

// Helper to find a website by domain
export function useWebsiteByDomain(domain: string) {
  const { websites } = useWebsite()
  return useMemo(
    () => websites.find((website) => website.normalized_url === domain),
    [websites, domain]
  )
}
