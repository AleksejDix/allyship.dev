// import { usePageContext } from "./page-context"

// Loading state component
export function Skeleton() {
  // const context = usePageContext()
  return (
    <>
      return (
      <div className="flex h-full items-center justify-center bg-background">
        <div role="status" className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading pages...</p>
        </div>
      </div>
      )
    </>
  )
}
