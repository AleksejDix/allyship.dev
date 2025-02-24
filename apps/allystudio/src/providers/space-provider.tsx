import { spaceMachine } from "@/providers/space"
import type { Database } from "@/types/database"
import { useSelector } from "@xstate/react"
import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren
} from "react"
import { createActor } from "xstate"
import type { ActorRefFrom } from "xstate"

type Space = Database["public"]["Tables"]["Space"]["Row"]

// Create a single actor instance at the module level
const spaceActor = createActor(spaceMachine, {
  systemId: "space-machine"
}).start()

interface SpaceContextValue {
  spaces: Space[]
  currentSpace: Space | null
  selectSpace: (space: Space) => void
  state: string
  refresh: () => void
  actor: ActorRefFrom<typeof spaceMachine>
}

const SpaceContext = createContext<SpaceContextValue | undefined>(undefined)

function useSpaceContext() {
  const context = useContext(SpaceContext)
  if (!context) {
    throw new Error("Space context must be used within Spaces")
  }
  return context
}

// Root component that provides context
function Root({ children }: PropsWithChildren) {
  // Get current state and context using a single selector
  const { state, spaces, currentSpace } = useSelector(
    spaceActor,
    (snapshot) => ({
      state: snapshot.value,
      spaces: snapshot.context.spaces,
      currentSpace: snapshot.context.currentSpace
    })
  )

  // Memoize callbacks
  const selectSpace = useMemo(
    () => (space: Space) => spaceActor.send({ type: "SPACE_SELECTED", space }),
    []
  )

  const refresh = useMemo(() => () => spaceActor.send({ type: "REFRESH" }), [])

  // Memoize the context value
  const value = useMemo(
    () => ({
      spaces,
      currentSpace,
      selectSpace,
      refresh,
      state,
      actor: spaceActor
    }),
    [spaces, currentSpace, selectSpace, refresh, state]
  )

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
}

// Loading state component
function Loading() {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (
          !context ||
          (context.state !== "loading" && context.state !== "initializing")
        )
          return null

        const message =
          context.state === "initializing"
            ? "Initializing..."
            : "Loading spaces..."

        return (
          <div className="flex h-screen items-center justify-center bg-background">
            <div role="status" className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              <p className="mt-2 text-sm text-muted-foreground">{message}</p>
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
        if (
          !context ||
          context.state === "initializing" ||
          context.state === "loading" ||
          context.spaces.length > 0
        )
          return null

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
                <div className="font-medium">Fetch Spaces</div>
                <div className="text-sm text-muted-foreground">
                  Load your spaces from the dashboard
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

// List component
function List() {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (
          !context ||
          context.state === "initializing" ||
          context.state === "loading" ||
          context.spaces.length === 0 ||
          context.currentSpace
        )
          return null

        return (
          <div className="flex h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Select a Space</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose a space to start analyzing websites
                </p>
              </div>
              <div className="space-y-2">
                {context.spaces.map((space) => (
                  <button
                    key={space.id}
                    onClick={() => context.selectSpace(space)}
                    className={`w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted ${
                      context.currentSpace?.id === space.id
                        ? "border-primary"
                        : ""
                    }`}>
                    <p className="font-medium">{space.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created {new Date(space.created_at).toLocaleDateString()}
                    </p>
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

// Debug component
function Debug() {
  return (
    <SpaceContext.Consumer>
      {(context) => {
        if (!context || process.env.NODE_ENV !== "development") return null

        return (
          <div className="fixed bottom-4 right-4 z-50 rounded-lg border bg-card p-2 text-xs">
            <div className="font-medium">Space Machine: {context.state}</div>
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
        if (!context || !context.currentSpace) return null
        return children
      }}
    </SpaceContext.Consumer>
  )
}

// Export compound components
export const Spaces = {
  Root,
  Loading,
  Empty,
  List,
  Content,
  Debug
}

// Provider component for backward compatibility
export function SpaceProvider({ children }: PropsWithChildren) {
  return (
    <Spaces.Root>
      <Spaces.Loading />
      <Spaces.Empty />
      <Spaces.List />
      <Spaces.Content>{children}</Spaces.Content>
      <Spaces.Debug />
    </Spaces.Root>
  )
}
