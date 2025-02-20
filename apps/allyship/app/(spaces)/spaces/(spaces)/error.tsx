'use client'

import { useEffect } from 'react'

import { Button } from '@workspace/ui/components/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-destructive">
        Failed to Load Workspaces
      </h2>
      <p className="mt-2 text-muted-foreground">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <Button onClick={reset} className="mt-4">
        Try Again
      </Button>
    </div>
  )
}
