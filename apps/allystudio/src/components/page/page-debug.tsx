import { useSelector } from "@xstate/react"

import { usePageContext } from "./page-context"

export function PageDebug() {
  const actor = usePageContext()
  const state = useSelector(actor, (state) => state.value)
  const context = useSelector(actor, (state) => state.context)

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Page Machine Debug</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">
            Current State
          </h4>
          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
            {state}
          </pre>

          <div className="flex gap-2 mt-4">
            <button
              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded"
              onClick={() =>
                actor.send({
                  type: "LOAD_PAGES",
                  websiteId: context.websiteId || ""
                })
              }>
              Reload Pages
            </button>

            <button
              className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded"
              onClick={() => actor.send({ type: "RETRY" })}>
              Retry
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Context</h4>
          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
