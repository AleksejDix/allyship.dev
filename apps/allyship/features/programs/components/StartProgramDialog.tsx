"use client"

import { useState } from "react"
import { PlayCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { StartProgramForm } from "./StartProgramForm"

type StartProgramDialogProps = {
  accountId: string
}

export function StartProgramDialog({ accountId }: StartProgramDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlayCircle className="mr-2 h-4 w-4" />
          Start Compliance Program
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a compliance program</DialogTitle>
          <DialogDescription>
            Select a compliance framework to begin tracking your organization's
            compliance requirements and controls.
          </DialogDescription>
        </DialogHeader>
        <StartProgramForm accountId={accountId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
