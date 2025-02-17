"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log to error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mt-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>
          {error.message || "An unexpected error occurred"}
        </AlertDescription>
        <Button variant="outline" onClick={reset} className="mt-4">
          Try again
        </Button>
      </Alert>
    </div>
  )
}
