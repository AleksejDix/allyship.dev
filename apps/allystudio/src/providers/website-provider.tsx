import { cn } from "@/lib/utils"
import { websiteMachine } from "@/providers/website"
import type { Database } from "@/types/database"
import { useActorRef, useSelector } from "@xstate/react"
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren
} from "react"
import type { ActorRefFrom } from "xstate"

import { useSpace } from "./space-provider"

type Website = Database["public"]["Tables"]["Website"]["Row"]

interface WebsiteContextValue {
  state: string
  websites: Website[] | never[] | readonly Website[]
  currentWebsite: Website | null | never
  error: Error | null
  selectWebsite: (website: Website) => void
  refresh: () => void
  actor: ActorRefFrom<typeof websiteMachine>
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

// Helper to convert state value to string
function getStateString(value: unknown): string {
  if (typeof value === "string") return value
  if (value && typeof value === "object") {
    if ("loaded" in value) {
      const loadedValue = value as {
        loaded: {
          count: string
          selection: string
        }
      }
      const count = loadedValue.loaded.count
      const selection = loadedValue.loaded.selection
      return `loaded.${count}.${selection}`
    }
    return Object.keys(value)[0] || "unknown"
  }
  return "unknown"
}

// Loading state component
function Loading() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (!context || context.state !== "loading") return null

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
        if (!context || context.state !== "error") return null

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
        if (!context || context.state !== "loaded.none") return null

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

// Single website component
function Single() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (
          !context ||
          !context.state.startsWith("loaded.one") ||
          !context.currentWebsite
        )
          return null

        return (
          <div className="flex h-full items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Current Website</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  You are working with your only website
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{context.currentWebsite.url}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created{" "}
                      {new Date(
                        context.currentWebsite.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )
      }}
    </WebsiteContext.Consumer>
  )
}

// Website selection component
function Selection() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (!context || !context.state.startsWith("loaded.some")) return null

        const isSelected = context.state.endsWith("selected")
        // Hide selection when a website is selected
        if (isSelected) return null

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
                    Select a website to view its accessibility status
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
                    const displayUrl = website.url.replace(/^https?:\/\//, "")

                    return (
                      <button
                        key={website.id}
                        onClick={() => context.selectWebsite(website)}
                        className={cn(
                          "w-full px-4 py-3 text-left transition-colors hover:bg-muted/50",
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
                      </button>
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

// Content wrapper component
function Content({ children }: PropsWithChildren) {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (!context) return null

        // Check if we're in any selected state
        const isSelected =
          context.state.endsWith("selected") ||
          context.state.startsWith("loaded.one")
        if (!isSelected || !context.currentWebsite) return null

        return children
      }}
    </WebsiteContext.Consumer>
  )
}

// Debug component for development
function Debug() {
  return (
    <WebsiteContext.Consumer>
      {(context) => {
        if (!context || process.env.NODE_ENV !== "development") return null

        return (
          <div className="fixed bottom-4 right-4 z-50 max-h-[300px] overflow-y-auto rounded-lg border border-red-400 bg-card p-2 text-xs">
            <div className="font-medium">Website Machine: {context.state}</div>

            <pre>{JSON.stringify(context, null, 2)}</pre>
            <div className="mt-1 text-muted-foreground">
              Websites: {context.websites.length}
              {context.currentWebsite &&
                ` | Selected: ${context.currentWebsite.url}`}
            </div>
          </div>
        )
      }}
    </WebsiteContext.Consumer>
  )
}

// Root component that provides context
function Root({ children }: PropsWithChildren) {
  const { currentSpace } = useSpace()
  console.log("currentSpace", currentSpace)
  // Don't initialize the machine if we don't have a space
  if (!currentSpace?.id) {
    return null
  }

  const actorRef = useActorRef(websiteMachine, {
    input: {
      spaceId: currentSpace.id
    }
  })

  const stateValue = useSelector(actorRef, (state) => state.value)
  const websites = useSelector(actorRef, (state) => state.context.websites)
  const currentWebsite = useSelector(
    actorRef,
    (state) => state.context.currentWebsite
  )
  const error = useSelector(actorRef, (state) => state.context.error)

  // Convert state value to string
  const state = useMemo(() => getStateString(stateValue), [stateValue])

  // Memoize callbacks
  const selectWebsite = useMemo(
    () => (website: Website) =>
      actorRef.send({ type: "WEBSITE_SELECTED", website }),
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
      currentWebsite,
      error,
      selectWebsite,
      refresh,
      actor: actorRef
    }),
    [state, websites, currentWebsite, error, selectWebsite, refresh, actorRef]
  )

  return (
    <WebsiteContext.Provider value={value}>{children}</WebsiteContext.Provider>
  )
}

// Export compound components
export const Websites = {
  Root,
  Loading,
  Error,
  Empty,
  Single,
  Selection,
  Content,
  Debug
}

export function WebsiteProvider({ children }: PropsWithChildren) {
  return (
    <Websites.Root>
      <div className="flex h-full flex-col">
        <Websites.Loading />
        <Websites.Error />
        <Websites.Empty />
        <Websites.Single />
        <Websites.Selection />
        <Websites.Content>{children}</Websites.Content>
        <Websites.Debug />
      </div>
    </Websites.Root>
  )
}

// Hook for accessing website context
export function useWebsite() {
  return useWebsiteContext()
}
