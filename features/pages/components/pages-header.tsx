"use client"

import { useState } from "react"
import { Domain } from "@prisma/client"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"

import { AddPageDialog } from "./add-page-dialog"
import { CrawlButton } from "./crawl-button"

interface PagesHeaderProps {
  domain: Domain
  spaceId: string
  domainId: string
}

type NotificationResult = {
  type: "success" | "error"
  message: string
}

export function PagesHeader({ domain, spaceId, domainId }: PagesHeaderProps) {
  const [notification, setNotification] = useState<NotificationResult | null>(
    null
  )

  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl">Pages</h1>
        {notification && (
          <Alert
            variant={
              notification.type === "success" ? "success" : "destructive"
            }
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
      </div>
      <div className="flex items-center gap-2">
        <CrawlButton domain={domain} onCrawlComplete={setNotification} />
        <AddPageDialog spaceId={spaceId} domainId={domainId} domain={domain} />
      </div>
    </div>
  )
}
