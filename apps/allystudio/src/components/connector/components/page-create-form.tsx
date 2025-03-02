"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircle, Link as LinkIcon } from "lucide-react"
import { useEffect, useState } from "react"

type PageCreateFormProps = {
  websiteUrl: string
  onWebsiteUrlChange: (url: string) => void
  pagePath: string
  onPagePathChange: (path: string) => void
  onSubmit: () => void
  isCreating: boolean
  error: string | null
  isDisabled?: boolean
  currentDomain?: string | null
  currentPath?: string | null
}

/**
 * Form component for creating new pages
 */
export function PageCreateForm({
  websiteUrl,
  onWebsiteUrlChange,
  pagePath,
  onPagePathChange,
  onSubmit,
  isCreating,
  error,
  isDisabled = false,
  currentDomain,
  currentPath
}: PageCreateFormProps) {
  const [showAutoFillNotice, setShowAutoFillNotice] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  // Show temporary notification when auto-filled
  useEffect(() => {
    if (currentDomain || currentPath) {
      setShowAutoFillNotice(true)
      const timer = setTimeout(() => {
        setShowAutoFillNotice(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentDomain, currentPath])

  return (
    <Card className="border-muted">
      <CardHeader>
        <CardTitle>Add New Page</CardTitle>
        <CardDescription>Create a new page for monitoring</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle aria-hidden="true" className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showAutoFillNotice && (
            <Alert
              variant="default"
              className="bg-primary/10 border-primary/20">
              <LinkIcon aria-hidden="true" className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary">
                Form automatically filled with current URL
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              type="text"
              placeholder="e.g. example.com"
              value={websiteUrl}
              onChange={(e) => onWebsiteUrlChange(e.target.value)}
              disabled={isCreating || isDisabled}
              className={cn(
                currentDomain && websiteUrl === currentDomain
                  ? "border-primary bg-primary/5"
                  : "",
                "focus-visible:ring-primary"
              )}
            />
            {currentDomain && websiteUrl !== currentDomain && (
              <div className="text-xs text-primary flex items-center gap-1 mt-1">
                <LinkIcon size={12} aria-hidden="true" />
                <span>Current domain: {currentDomain}</span>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pagePath">Page Path</Label>
            <Input
              id="pagePath"
              placeholder="e.g. /about"
              value={pagePath}
              onChange={(e) => onPagePathChange(e.target.value)}
              disabled={isCreating || isDisabled}
              className={cn(
                currentPath && pagePath === currentPath
                  ? "border-primary bg-primary/5"
                  : "",
                "focus-visible:ring-primary"
              )}
            />
            {currentPath && pagePath !== currentPath && (
              <div className="text-xs text-primary flex items-center gap-1 mt-1">
                <LinkIcon size={12} aria-hidden="true" />
                <span>Current path: {currentPath}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={isCreating || isDisabled || !pagePath.trim()}
            className="w-full">
            {isCreating ? "Creating..." : "Create Page"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
