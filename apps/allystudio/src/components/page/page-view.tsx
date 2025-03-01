"use client"

import { useSelector } from "@xstate/react"
import { memo } from "react"
import type { PropsWithChildren } from "react"

import { usePageContext } from "./page-context"
import { PageList } from "./page-list"
import { PageSelected } from "./page-selected"

/**
 * PageView displays either the PageList or PageSelected component
 * based on the current state of the page machine.
 * This helps ensure consistent state transitions between list and selected views.
 */
export const PageView = memo(function PageView({
  children
}: PropsWithChildren) {
  const actor = usePageContext()

  // Determine which view to show based on state
  const showSelectedView = useSelector(
    actor,
    (state) => state.matches({ success: "selected" }),
    Object.is
  )

  // Either show the selected page or the list of pages
  return showSelectedView ? (
    <PageSelected>{children}</PageSelected>
  ) : (
    <PageList />
  )
})
