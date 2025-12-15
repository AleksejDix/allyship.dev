"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { SpaceCreateForm } from "./SpaceCreateForm"

export function CreateSpaceDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Space
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new space</DialogTitle>
          <DialogDescription>
            Create a space to organize your websites and collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <SpaceCreateForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
