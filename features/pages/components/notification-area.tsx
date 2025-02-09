"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"

type NotificationResult = {
  type: "success" | "error"
  message: string
}

interface NotificationAreaProps {
  children?: React.ReactElement
}

export function NotificationArea({ children }: NotificationAreaProps) {
  const [notification, setNotification] = useState<NotificationResult | null>(
    null
  )

  useEffect(() => {
    const handleNotification = (e: CustomEvent<NotificationResult>) => {
      setNotification(e.detail)
    }

    // TypeScript requires type assertion for CustomEvent
    document.addEventListener(
      "showNotification",
      handleNotification as EventListener
    )

    return () => {
      document.removeEventListener(
        "showNotification",
        handleNotification as EventListener
      )
    }
  }, [])

  return (
    <>
      {children}
      {notification && (
        <Alert
          variant={notification.type === "success" ? "success" : "destructive"}
          role="status"
          aria-live="polite"
          className="inline-flex"
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
          )}
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
    </>
  )
}
