"use client"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { DomainsCreate } from "./domains-create"

interface AddDomainDialogProps {
  spaceId: string
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddDomainDialog({
  spaceId,
  trigger,
  open,
  onOpenChange,
}: AddDomainDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Domain</DialogTitle>
          <DialogDescription>
            Add a new domain to your space. You can add multiple domains to
            manage them all in one place.
          </DialogDescription>
        </DialogHeader>
        <DomainsCreate
          spaceId={spaceId}
          onSuccess={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
