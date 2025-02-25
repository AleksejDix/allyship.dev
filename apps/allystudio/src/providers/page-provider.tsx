import type { Database } from "@/types/database"
import type { NormalizedUrl } from "@/utils/url"
import { normalizeUrl } from "@/utils/url"
import type { PostgrestError } from "@supabase/supabase-js"
import { useActorRef, useSelector } from "@xstate/react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type PropsWithChildren
} from "react"
import type { ActorRefFrom, SnapshotFrom } from "xstate"

import { formatDate } from "../utils/date-formatting"
import { pageMachine } from "./page"
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
  normalizedUrl: NormalizedUrl | null
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
  url: NormalizedUrl,
  pages: PageWithWebsite[]
): PageWithWebsite | null {
  if (!url || !pages?.length) return null
  return (
    pages.find(
      (page) => page.normalized_url === `${url.hostname}${url.path}`
    ) ?? null
  )
}

function Root({ children }: PropsWithChildren) {
  const { websites } = useWebsite()
  const { normalizedUrl, currentUrl, isLoading: urlLoading } = useCurrentUrl()

  const actorRef = useActorRef(pageMachine)

  const pages = useSelector(actorRef, (state) => state.context.pages)
  const error = useSelector(actorRef, (state) => state.context.error)
  const websiteId = useSelector(actorRef, (state) => state.context.websiteId)
  const machineState = useSelector(actorRef, (state) => state.value)
  const machineNormalizedUrl = useSelector(
    actorRef,
    (state) => state.context.normalizedUrl
  )
  const machineMatchingPage = useSelector(
    actorRef,
    (state) => state.context.matchingPage
  )

  // Update URL in machine when it changes
  useEffect(() => {
    if (currentUrl) {
      actorRef.send({ type: "URL_CHANGED", url: currentUrl })
    }
  }, [currentUrl, actorRef])

  // Update website ID when normalized URL changes
  useEffect(() => {
    if (normalizedUrl?.hostname) {
      const website = websites.find(
        (site) => site.normalized_url === normalizedUrl.hostname
      )
      if (website?.id) {
        actorRef.send({ type: "WEBSITE_CHANGED", websiteId: website.id })
      }
    }
  }, [normalizedUrl?.hostname, websites, actorRef])

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
      currentUrl,
      normalizedUrl: machineNormalizedUrl,
      matchingPage: machineMatchingPage,
      addPage,
      refresh,
      setWebsiteId,
      actor: actorRef,
      isLoading:
        urlLoading || machineState === "loading" || machineState === "adding"
    }),
    [
      pages,
      error,
      websiteId,
      currentUrl,
      machineNormalizedUrl,
      machineMatchingPage,
      addPage,
      refresh,
      setWebsiteId,
      actorRef,
      urlLoading,
      machineState
    ]
  )

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

// Loading state component
function Loading() {
  return (
    <PageContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot() as SnapshotFrom<
          typeof pageMachine
        >
        if (!snapshot?.matches("loading")) return null

        return (
          <div className="flex h-full items-center justify-center bg-background">
            <div role="status" className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              <p className="mt-2 text-sm text-muted-foreground">
                Loading pages...
              </p>
            </div>
          </div>
        )
      }}
    </PageContext.Consumer>
  )
}

// Error state component
function Error() {
  return (
    <PageContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot() as SnapshotFrom<
          typeof pageMachine
        >
        if (!snapshot?.matches("error")) return null

        const errorMessage =
          context.error?.message || "Unknown error occurred while loading pages"

        return (
          <div className="flex h-full items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-4 rounded-lg border bg-destructive/10 p-6">
              <div className="space-y-2 text-center">
                <h2 className="text-lg font-semibold text-destructive">
                  Error Loading Pages
                </h2>
                <p className="text-sm text-destructive/80">{errorMessage}</p>
                <button
                  onClick={() => context.refresh()}
                  className="mt-4 inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90">
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )
      }}
    </PageContext.Consumer>
  )
}

// Empty state component
function Empty() {
  return (
    <PageContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot() as SnapshotFrom<
          typeof pageMachine
        >
        if (!snapshot?.matches("idle") || context.pages.length > 0) return null

        return (
          <div className="flex h-full flex-col items-center justify-center bg-background p-4">
            <h1 className="mb-6 text-3xl font-semibold">
              Welcome to Page Management
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              No pages found. Add a page to get started.
            </p>
            <button
              onClick={() => context.refresh()}
              className="inline-flex w-[300px] items-center justify-between rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-muted">
              <div>
                <div className="font-medium">Refresh Pages</div>
                <div className="text-sm text-muted-foreground">
                  Check for new pages
                </div>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        )
      }}
    </PageContext.Consumer>
  )
}

// Page list component
function PageList() {
  return (
    <PageContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot() as SnapshotFrom<
          typeof pageMachine
        >
        // Only hide if explicitly in a non-idle state
        if (snapshot?.matches("loading") || snapshot?.matches("error"))
          return null

        // Sort pages by creation date, newest first
        const sortedPages = [...context.pages].sort((a, b) =>
          a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0
        )

        return (
          <div className="flex flex-1 flex-col bg-background p-4">
            <div className="mx-auto w-full max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Pages</h2>
                  <p className="text-sm text-muted-foreground">
                    {sortedPages.length} pages tracked
                  </p>
                </div>
                <button
                  onClick={() => context.refresh()}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Refresh Pages
                </button>
              </div>
              <div className="space-y-4">
                {sortedPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{page.url}</div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div>Path: {page.path}</div>
                        <div>Added: {formatDate(page.created_at)}</div>
                        {page.updated_at !== page.created_at && (
                          <div>Updated: {formatDate(page.updated_at)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }}
    </PageContext.Consumer>
  )
}

// Debug component
function Debug() {
  return (
    <PageContext.Consumer>
      {(context) => {
        return <pre>{JSON.stringify(context, null, 2)}</pre>
      }}
    </PageContext.Consumer>
  )
}

// Export compound components
export const Pages = {
  Root,
  Loading,
  Error,
  Empty,
  PageList,
  Debug
}

export function PageProvider({ children }: PropsWithChildren) {
  return (
    <Pages.Root>
      <Pages.Loading />
      <Pages.Error />
      <Pages.Empty />
      <Pages.PageList />
      {children}
    </Pages.Root>
  )
}

export function usePage() {
  return usePageContext()
}

// Helper to find a page by URL
export function usePageByUrl(url: string) {
  const { pages } = usePage()
  const normalized = useMemo(() => {
    try {
      return normalizeUrl(url)
    } catch (error) {
      return null
    }
  }, [url])
  return useMemo(
    () => (normalized ? findMatchingPage(normalized, pages) : null),
    [normalized, pages]
  )
}

// Helper to find a website by domain
export function useWebsiteByDomain(domain: string) {
  const { websites } = useWebsite()
  return useMemo(
    () => websites.find((website) => website.normalized_url === domain),
    [websites, domain]
  )
}
