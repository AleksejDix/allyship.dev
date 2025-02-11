"use client"

import { useState } from "react"

import { AddDomainDialog } from "./add-domain-dialog"

interface HeaderActionsProps {
  spaceId: string
}

export function HeaderActions({ spaceId }: HeaderActionsProps) {
  const [open, setOpen] = useState(false)

  return (
    <AddDomainDialog spaceId={spaceId} open={open} onOpenChange={setOpen} />
  )
}
