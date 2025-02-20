'use client'

import { Suspense, useState } from 'react'
import { SpaceCreate } from '@/features/spaces/components/space-create'

import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'

export function SpaceCreateDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Space</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Space</DialogTitle>
          <DialogDescription>
            Create a new space to manage your websites and track their
            accessibility.
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<div>Loading...</div>}>
          <SpaceCreate onSuccess={() => setOpen(false)} />
        </Suspense>
      </DialogContent>
    </Dialog>
  )
}
