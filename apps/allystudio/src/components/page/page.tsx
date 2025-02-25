import type { PropsWithChildren } from "react"

import { PageProvider } from "./page-context"
import { PageDebug } from "./page-debug"
import { PageError } from "./page-error"
import { PageList } from "./page-list"

// Root component that sets up the machine and provider
function Page({
  children,
  debug = false
}: PropsWithChildren<{ debug?: boolean }>) {
  return (
    <PageProvider>
      <div className="border-4 border-green-400">
        {children}
        {debug && <PageDebug />}
      </div>
    </PageProvider>
  )
}

// Named exports for composite components
export { Page, PageList, PageError, PageDebug }
