"use client"

import { Suspense, useState } from "react"
import { WebsiteCreate } from "@/features/websites/components/website-create"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  space_id: string
}

export function WebsiteCreateDialog({ space_id }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Website</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Website</DialogTitle>
          <DialogDescription>
            You can add a new domain to your workspace.
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <WebsiteCreate space_id={space_id} onSuccess={() => setOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}
