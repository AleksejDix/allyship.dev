import { usePageContext } from "./page-context"

export function PageDebug() {
  const actor = usePageContext()

  return (
    <pre>
      <code>{JSON.stringify(actor.getSnapshot(), null, 2)}</code>

      <button
        onClick={() => actor.send({ type: "LOAD_PAGES", websiteId: "1" })}>
        Load Pages
      </button>
    </pre>
  )
}
