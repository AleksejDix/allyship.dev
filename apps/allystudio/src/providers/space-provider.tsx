import { cn } from "@/lib/utils"
import { spaceMachine } from "@/providers/space"
import type { Database } from "@/types/database"
import { useActorRef, useSelector } from "@xstate/react"
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren
} from "react"
import type { ActorRefFrom } from "xstate"

type Space = Database["public"]["Tables"]["Space"]["Row"]

interface SpaceContextValue {
  state: string
  spaces: Space[] | never[] | readonly Space[]
  currentSpace: Space | null | never
  error: Error | null
  selectSpace: (space: Space) => void
  refresh: () => void
  actor: ActorRefFrom<typeof spaceMachine>
}

const SpaceContext = createContext<SpaceContextValue | undefined>(undefined)

const SPACE_CONTEXT_ERROR = "Space context must be used within Spaces"
const UNKNOWN_SPACE_ERROR = "Unknown error occurred while loading spaces"

function useSpaceContext() {
  const context = useContext(SpaceContext)
  if (context === undefined) {
    throw SPACE_CONTEXT_ERROR
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
    <SpaceContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (!snapshot?.matches("loading")) return null

        return (
          <div className="flex h-screen items-center justify-center bg-background">
            <div role="status" className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              <p className="mt-2 text-sm text-muted-foreground">
                Loading spaces...
              </p>
            </div>
          </div>
        )
      }}
    </SpaceContext.Consumer>
  )
}

// Error state component
function Error() {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (!snapshot?.matches("error")) return null

        const errorMessage = context.error?.message || UNKNOWN_SPACE_ERROR

        return (
          <div className="flex h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-4 rounded-lg border bg-destructive/10 p-6">
              <div className="space-y-2 text-center">
                <h2 className="text-lg font-semibold text-destructive">
                  Error Loading Spaces
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
    </SpaceContext.Consumer>
  )
}

// Empty state component
function Empty() {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (!snapshot?.matches({ loaded: { count: "none" } })) return null

        return (
          <div className="flex h-screen flex-col items-center justify-center bg-background p-4">
            <h1 className="mb-6 text-3xl font-semibold">
              Welcome to AllyStudio
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              No spaces found. Please create a space in the dashboard.
            </p>
            <button
              onClick={() => context.refresh()}
              className="inline-flex w-[300px] items-center justify-between rounded-lg border bg-card px-4 py-3 text-left transition-colors hover:bg-muted">
              <div>
                <div className="font-medium">Refresh Spaces</div>
                <div className="text-sm text-muted-foreground">
                  Check for new spaces
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
    </SpaceContext.Consumer>
  )
}

// Single space component
function Single() {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (
          !snapshot?.matches({ loaded: { count: "one" } }) ||
          !context.currentSpace
        )
          return null

        return (
          <div className="flex h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Current Space</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  You are working in your only space
                </p>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{context.currentSpace.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created{" "}
                      {new Date(
                        context.currentSpace.created_at
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
    </SpaceContext.Consumer>
  )
}

// Space selection component
function Selection() {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()
        if (
          !snapshot?.matches({
            loaded: { count: "some", selection: "unselected" }
          })
        )
          return null

        // Sort spaces by creation date, newest first
        const sortedSpaces = [...context.spaces].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        return (
          <div className="flex flex-1 flex-col bg-background p-4">
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Select a Space</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a space to start analyzing websites
                </p>
              </div>
              <div className="space-y-2">
                {sortedSpaces.map((space) => (
                  <button
                    key={space.id}
                    onClick={() => context.selectSpace(space)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-4 text-left transition-colors",
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2",
                      "focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{space.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Created{" "}
                          {new Date(space.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      }}
    </SpaceContext.Consumer>
  )
}

// Content wrapper component
function Content({ children }: PropsWithChildren) {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (!context?.actor) return null
        const snapshot = context.actor.getSnapshot()

        // Show content when we have a selected space (either in one or some.selected state)
        if (
          !snapshot?.matches({ loaded: { count: "one" } }) &&
          !snapshot?.matches({
            loaded: { count: "some", selection: "selected" }
          })
        ) {
          return null
        }

        if (!context.currentSpace) return null

        return children
      }}
    </SpaceContext.Consumer>
  )
}

// Debug component for development
function Debug() {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (!context || process.env.NODE_ENV !== "development") return null

        return (
          <div className="fixed border border-red-400 bottom-4 right-4 z-50 rounded-lg border bg-card p-2 text-xs">
            <div className="font-medium">Space Machine: {context.state}</div>

            <pre>{JSON.stringify(context, null, 2)}</pre>
            <div className="mt-1 text-muted-foreground">
              Spaces: {context.spaces.length}
              {context.currentSpace &&
                ` | Selected: ${context.currentSpace.name}`}
            </div>
          </div>
        )
      }}
    </SpaceContext.Consumer>
  )
}

// Root component that provides context
function Root({ children }: PropsWithChildren) {
  const actorRef = useActorRef(spaceMachine)

  const stateValue = useSelector(actorRef, (state) => state.value)
  const spaces = useSelector(actorRef, (state) => state.context.spaces)
  const currentSpace = useSelector(
    actorRef,
    (state) => state.context.currentSpace
  )
  const error = useSelector(actorRef, (state) => state.context.error)

  // Convert state value to string
  const state = useMemo(() => getStateString(stateValue), [stateValue])

  // Memoize callbacks
  const selectSpace = useMemo(
    () => (space: Space) => actorRef.send({ type: "SPACE_SELECTED", space }),
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
      spaces,
      currentSpace,
      error,
      selectSpace,
      refresh,
      actor: actorRef
    }),
    [state, spaces, currentSpace, error, selectSpace, refresh, actorRef]
  )

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}

// Export compound DEBUG
export const Spaces = {
  Root,
  Loading,
  Error,
  Empty,
  Single,
  Selection,
  Content,
  Debug
}

// Provider component for backward compatibility
export function SpaceProvider({ children }: PropsWithChildren) {
  return (
    <Spaces.Root>
      <div className="flex min-h-screen flex-col">
        <Spaces.Loading />
        <Spaces.Error />
        <Spaces.Empty />
        <Spaces.Single />
        <Spaces.Selection />
        <Spaces.Content>{children}</Spaces.Content>
        <Spaces.Debug />
      </div>
    </Spaces.Root>
  )
}

// Hook for accessing space context
export function useSpace() {
  return useSpaceContext()
}
