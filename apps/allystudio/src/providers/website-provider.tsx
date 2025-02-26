import { cn } from "@/lib/utils"
import { websiteMachine } from "@/providers/website"
import type { Database } from "@/types/database"
import { extractDomain } from "@/utils/url"
import type { PostgrestError } from "@supabase/supabase-js"
import { useActorRef, useSelector } from "@xstate/react"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type PropsWithChildren
} from "react"
import type { ActorRefFrom } from "xstate"

import { useAuth } from "./auth-provider"
import { useSpace } from "./space-provider"
import { useCurrentDomain, useCurrentUrl } from "./url-provider"

type Website = Database["public"]["Tables"]["Website"]["Row"]

interface WebsiteContextValue {
  state: string
  websites: Website[]
  error: PostgrestError | null
  addWebsite: (url: string) => void
  refresh: () => void
  actor: ActorRefFrom<typeof websiteMachine>
  currentUrl: string | null
  matchingWebsite: Website | null
  isLoading: boolean
}

const WebsiteContext = createContext<WebsiteContextValue | undefined>(undefined)

const WEBSITE_CONTEXT_ERROR = "Website context must be used within Websites"
const UNKNOWN_WEBSITE_ERROR = "Unknown error occurred while loading websites"

function useWebsiteContext() {
  const context = useContext(WebsiteContext)
  if (context === undefined) {
    throw WEBSITE_CONTEXT_ERROR
  }
  return context
}

// Helper to find a matching website for a domain
function findMatchingWebsite(
  domain: string,
  websites: Website[]
): Website | null {
  if (!domain || !websites?.length) return null

  try {
    // Extract just the domain part for comparison
    const normalizedDomain = extractDomain(domain)

    // Debug the matching process
    console.log("Finding matching website:", {
      inputUrl: domain,
      extractedDomain: normalizedDomain,
      availableWebsites: websites.map((w) => ({
        id: w.id,
        normalized_url: w.normalized_url, // This is already just the domain in the database
        url: w.url
      }))
    })

    // Compare the extracted domain with the normalized_url in the database
    // normalized_url in the database is already just the domain
    const match = websites.find(
      (website) => website.normalized_url === normalizedDomain
    )

    console.log("Match result:", {
      extractedDomain: normalizedDomain,
      matchedWebsite: match
        ? {
            id: match.id,
            normalized_url: match.normalized_url,
            url: match.url
          }
        : null
    })

    return match ?? null
  } catch (error) {
    console.error("Error finding matching website:", error)
    return null
  }
}

// Root component that provides context
function Root({ children }: PropsWithChildren) {
  const { session } = useAuth()
  const { currentSpace } = useSpace()
  const { normalizedUrl, currentUrl, isLoading } = useCurrentUrl()

  // Debug logs
  useEffect(() => {
    console.log("Website Provider Debug:", {
      normalizedUrl,
      currentUrl,
      isLoading,
      session: session ? "exists" : "none",
      spaceId: currentSpace?.id
    })
  }, [normalizedUrl, currentUrl, isLoading, session, currentSpace?.id])

  // Don't initialize if not authenticated or no space
  if (!session || !currentSpace?.id) {
    return null
  }

  const actorRef = useActorRef(websiteMachine, {
    input: {
      spaceId: currentSpace.id
    }
  })

  // Send URL changes to the machine
  useEffect(() => {
    if (normalizedUrl) {
      actorRef.send({ type: "URL_CHANGED", url: normalizedUrl })
    }
  }, [normalizedUrl, actorRef])

  const state = useSelector(actorRef, (state) => state.value)
  const websites = useSelector(actorRef, (state) => state.context.websites)
  const error = useSelector(actorRef, (state) => state.context.error)
  const matchingWebsite = useSelector(
    actorRef,
    (state) => state.context.matchingWebsite
  )

  // Memoize callbacks
  const addWebsite = useMemo(
    () => (url: string) => actorRef.send({ type: "ADD_WEBSITE", url }),
    [actorRef]
  )

  const refresh = useMemo(
    () => () => actorRef.send({ type: "REFRESH" }),
    [actorRef]
  )

  // Memoize the context value
  const value = useMemo(
    () => ({
      state,
      websites,
      error,
      addWebsite,
      refresh,
      actor: actorRef,
      currentUrl,
      matchingWebsite,
      isLoading
    }),
    [
      state,
      websites,
      error,
      addWebsite,
      refresh,
      actorRef,
      currentUrl,
      matchingWebsite,
      isLoading
    ]
  )

  return (
    <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>
  )
}

// Loading state component
function Loading() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (!snapshot?.matches("loading")) return null

        return (
          <div className="flex h-full items-center justify-center bg-background">
            <div role="status" className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              <p className="mt-2 text-sm text-muted-foreground">
                Loading websites...
              </p>
            </div>
          </div>
        )
      }}
    </WebsiteContext.Consumer>
  )
}

// Error state component
function Error() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (!snapshot?.matches("error")) return null

        const errorMessage = context.error?.message || UNKNOWN_WEBSITE_ERROR

        return (
          <div className="flex h-full items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-4 rounded-lg border bg-destructive/10 p-6">
              <div className="space-y-2 text-center">
                <h2 className="text-lg font-semibold text-destructive">
                  Error Loading Websites
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
    </WebsiteContext.Consumer>
  )
}

// Empty state component
function Empty() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (!snapshot?.matches("idle") || context.websites.length > 0)
          return null

        return (
          <div className="flex h-full flex-col items-center justify-center bg-background p-4">
            <h1 className="mb-6 text-3xl font-semibold">
              Welcome to Website Management
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              No websites found. Please add a website to get started.
            </p>
            <button
              onClick={() => context.refresh()}
              className="inline-flex w-[300px] items-center justify-between rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-muted">
              <div>
                <div className="font-medium">Refresh Websites</div>
                <div className="text-sm text-muted-foreground">
                  Check for new websites
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
    </WebsiteContext.Consumer>
  )
}

// Website list component
function WebsiteList() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (!snapshot?.matches("idle") || context.websites.length === 0)
          return null

        // Sort websites by creation date, newest first
        const sortedWebsites = [...context.websites].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        return (
          <div className="flex flex-1 flex-col bg-background p-4">
            <div className="mx-auto w-full max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Your Websites</h2>
                  <p className="text-sm text-muted-foreground">
                    View and manage your websites
                  </p>
                </div>
                <button
                  onClick={() => context.refresh()}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Add Website
                </button>
              </div>

              <div className="rounded-lg border bg-card">
                <div className="grid grid-cols-[1fr,auto,auto] gap-4 p-4 text-sm font-medium text-muted-foreground">
                  <div>Website</div>
                  <div>Theme</div>
                  <div>Added</div>
                </div>
                <div className="divide-y divide-border">
                  {sortedWebsites.map((website) => {
                    // Format URL for display
                    const displayUrl = website.normalized_url
                    return (
                      <div
                        key={website.id}
                        className={cn(
                          "w-full px-4 py-3 text-left",
                          "grid grid-cols-[1fr,auto,auto] gap-4 items-center"
                        )}>
                        <div>
                          <p className="font-medium">{displayUrl}</p>
                          <p className="text-xs text-muted-foreground">
                            {website.url}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-2 w-2 rounded-full bg-primary" />
                          <span className="text-sm capitalize">
                            {website.theme.toLowerCase()}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(website.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </WebsiteContext.Consumer>
  )
}

// Debug state component
function Debug() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        const snapshot = context.actor.getSnapshot()

        return (
          <div className="mt-1 text-muted-foreground">
            <pre>{JSON.stringify(snapshot, null, 2)}</pre>
          </div>
        )
      }}
    </WebsiteContext.Consumer>
  )
}

// Export compound components
export const Websites = {
  Root,
  Loading,
  Error,
  Empty,
  WebsiteList,
  Debug
}

export function WebsiteProvider({ children }: PropsWithChildren) {
  return (
    <Websites.Root>
      <div className="flex h-full flex-col">
        {/* Debug section to show all domains */}
        <WebsiteContext.Consumer>
          {(context) => {
            if (!context?.websites?.length) return null

            // Get normalized domain from current URL if it exists
            let normalizedDomain = null
            try {
              if (context.currentUrl) {
                normalizedDomain = extractDomain(context.currentUrl)
              }
            } catch (error) {
              console.error("Error normalizing URL:", error)
            }

            // Check if domain matches any known domains
            const isKnownDomain =
              normalizedDomain &&
              context.websites.some(
                (website) => website.normalized_url === normalizedDomain
              )

            return (
              <div className="border-b bg-muted/50 px-3 py-2 text-[10px]">
                <div className="font-medium text-muted-foreground">
                  Known domains:
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {context.websites.map((website) => (
                    <div
                      key={website.id}
                      className={cn(
                        "rounded bg-muted px-1.5 py-0.5",
                        website.normalized_url === normalizedDomain
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      )}
                      title={`ID: ${website.id}`}>
                      {website.normalized_url}
                    </div>
                  ))}
                </div>
                <div className="mt-1 space-y-0.5">
                  <div className="text-xs text-muted-foreground/70">
                    Raw URL: {context.currentUrl || "none"}
                  </div>
                  <div className="text-xs">
                    Normalized domain:{" "}
                    <span
                      className={cn(
                        normalizedDomain
                          ? isKnownDomain
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                          : "text-muted-foreground/70"
                      )}>
                      {normalizedDomain || "none"}
                    </span>
                  </div>
                </div>
                {context.matchingWebsite && (
                  <div className="mt-0.5 text-xs text-green-600">
                    Matched: {context.matchingWebsite.normalized_url}
                  </div>
                )}
              </div>
            )
          }}
        </WebsiteContext.Consumer>
        {children}
      </div>
    </Websites.Root>
  )
}

// Hook for accessing website context
export function useWebsite() {
  return useWebsiteContext()
}
