import { useSelector } from "@xstate/react"

import { usePageContext } from "./page-context"

export function PageList() {
  const actor = usePageContext()

  const hasPages = useSelector(actor, (state) => state.context.pages.length > 0)
  const pages = useSelector(actor, (state) => state.context.pages)

  return (
    <>
      {hasPages && (
        <ul className="space-y-4">
          {pages.map((page) => (
            <li key={page.id} className="border rounded-lg p-4">
              {page.url}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
