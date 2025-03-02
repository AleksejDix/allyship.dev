"use client"

import { useSpaceContext } from "@/components/space/space-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCurrentUrl } from "@/providers/url-provider"
import { useSelector } from "@xstate/react"
import { PlusCircle } from "lucide-react"
import { useEffect, useState, type FC } from "react"
import { toast } from "sonner"

import { type Page, type Website } from "./api/sdk"
import { PageSelector, WebsiteSelector } from "./components"
import { usePageCreator, usePageData, useWebsiteData } from "./hooks"

/**
 * Connector component for managing websites and pages
 * Demonstrates the usage of the SDK APIs and custom hooks
 */
export const Connector: FC = () => {
  const spaceActor = useSpaceContext()
  const currentSpace = useSelector(
    spaceActor,
    (state) => state.context.currentSpace,
    Object.is
  )
  const spaceId = currentSpace?.id

  // Track optimistic updates
  const [optimisticWebsite, setOptimisticWebsite] = useState<Website | null>(
    null
  )
  const [optimisticPage, setOptimisticPage] = useState<Page | null>(null)
  const [isCreatingQuick, setIsCreatingQuick] = useState(false)

  // Get the current URL from the Chrome extension
  const { normalizedUrl, isLoading: isLoadingUrl } = useCurrentUrl()
  const currentDomain = normalizedUrl?.hostname || null
  const currentPath = normalizedUrl?.path || null

  // Website state management with custom hook
  const {
    websiteOptions,
    selectedWebsiteId,
    selectedWebsite,
    setSelectedWebsiteId,
    isLoading: isLoadingWebsites,
    error: websitesError,
    fetchWebsites,
    addOptimisticWebsite
  } = useWebsiteData(spaceId)

  // Page state management with custom hook
  const {
    pageOptions,
    selectedPageId,
    selectedPage,
    setSelectedPageId,
    isLoading: isLoadingPages,
    error: pagesError,
    fetchPages,
    addOptimisticPage
  } = usePageData(selectedWebsite)

  // Page creation with custom hook
  const {
    newWebsiteUrl: websiteUrl,
    setNewWebsiteUrl: setWebsiteUrl,
    newPagePath: pagePath,
    setNewPagePath: setPagePath,
    error: createError,
    isCreating,
    createPage,
    resetForm: reset,
    createWebsiteAndPage
  } = usePageCreator(spaceId, () => {
    // Success callback - refresh the data
    fetchWebsites()
    if (selectedWebsite) {
      fetchPages()
    }
  })

  // Handle website change
  const handleWebsiteChange = (websiteId: string) => {
    setSelectedWebsiteId(websiteId)
    setSelectedPageId(null)
  }

  // Check if current domain matches any known website
  const knownWebsite = websiteOptions.find(
    (website) => website.normalized_url === currentDomain
  )

  // Check if current path matches any known page (if we have a selected website)
  const knownPage = pageOptions.find((page) => page.path === currentPath)

  // Note: Auto-selection is now handled in the individual selectors
  // This maintains the variables for status checks

  // Always keep form values in sync with current URL
  useEffect(() => {
    if (currentDomain) {
      setWebsiteUrl(currentDomain)
    }
    if (currentPath) {
      setPagePath(currentPath)
    }
  }, [currentDomain, currentPath, setWebsiteUrl, setPagePath])

  // Handle quick page creation
  const handleQuickPageCreate = async () => {
    if (!currentDomain || !currentPath || !spaceId) {
      toast.error("Missing URL information")
      return
    }

    setIsCreatingQuick(true)

    try {
      if (knownWebsite) {
        // Case 1: Website exists, just create the page
        // Create optimistic page update
        const optimisticPageData: Page = {
          id: `temp-${Date.now()}`,
          website_id: knownWebsite.id,
          path: currentPath,
          url: `${currentDomain}${currentPath}`,
          normalized_url: `${currentDomain}${currentPath}`,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Add optimistic page update
        addOptimisticPage(optimisticPageData)

        // Actually create the page
        await createPage(knownWebsite)

        toast.success("Page added successfully!")
      } else {
        // Case 2: Website doesn't exist, create both website and page
        // Create optimistic website update
        const tempWebsiteId = `temp-${Date.now()}`
        const optimisticWebsiteData: Website = {
          id: tempWebsiteId,
          space_id: spaceId,
          user_id: null,
          url: `https://${currentDomain}`,
          normalized_url: currentDomain,
          theme: "BOTH",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Create optimistic page update
        const optimisticPageData: Page = {
          id: `temp-page-${Date.now()}`,
          website_id: tempWebsiteId,
          path: currentPath,
          url: `${currentDomain}${currentPath}`,
          normalized_url: `${currentDomain}${currentPath}`,
          deleted_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Add optimistic updates
        addOptimisticWebsite(optimisticWebsiteData)
        setOptimisticWebsite(optimisticWebsiteData)
        setOptimisticPage(optimisticPageData)

        // Actually create website and page
        await createWebsiteAndPage(currentDomain, currentPath)

        toast.success("Website and page added successfully!")
      }
    } catch (error) {
      console.error("Error during quick page creation:", error)
      toast.error("Failed to add page. Please try again.")
    } finally {
      setIsCreatingQuick(false)

      // Clear optimistic updates after real data fetch
      fetchWebsites().then(() => {
        if (knownWebsite) {
          fetchPages()
        }
        setOptimisticWebsite(null)
        setOptimisticPage(null)
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Website & Page Connector</h1>

      {!isLoadingUrl && currentDomain && (
        <div className="p-4 bg-primary/10 text-primary rounded flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>Current URL: </span>
            <span className="font-medium">{currentDomain}</span>
            {currentPath && (
              <>
                <span className="mx-1">/</span>
                <span className="font-medium">
                  {currentPath.replace(/^\//, "")}
                </span>
              </>
            )}
          </div>

          {/* Quick add button */}
          <Button
            size="sm"
            onClick={handleQuickPageCreate}
            disabled={
              isCreatingQuick ||
              !spaceId ||
              !currentDomain ||
              !currentPath ||
              Boolean(knownWebsite && knownPage)
            }
            className="flex items-center gap-1">
            <PlusCircle size={16} />
            <span>
              {isCreatingQuick
                ? "Adding..."
                : knownPage
                  ? "Page exists"
                  : "Add Page"}
            </span>
          </Button>
        </div>
      )}

      {websitesError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded">
          Error loading websites: {websitesError}
        </div>
      )}

      {pagesError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded">
          Error loading pages: {pagesError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="border-muted">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Select Website</span>
                {!isLoadingUrl && currentDomain && (
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      knownWebsite
                        ? "bg-success/20 text-success"
                        : "bg-destructive/20 text-destructive"
                    }`}>
                    {knownWebsite ? "Known" : "Unknown"}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WebsiteSelector
                websiteOptions={websiteOptions}
                selectedWebsiteId={selectedWebsiteId}
                onWebsiteChange={handleWebsiteChange}
                onRefresh={fetchWebsites}
                isLoading={isLoadingWebsites}
                highlightStatus={
                  !isLoadingUrl && currentDomain
                    ? knownWebsite
                      ? "known"
                      : "unknown"
                    : undefined
                }
                currentDomain={currentDomain}
                optimisticWebsite={optimisticWebsite}
              />
            </CardContent>
          </Card>

          {selectedWebsiteId && (
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Select Page</span>
                  {!isLoadingUrl &&
                    currentPath &&
                    selectedWebsite?.normalized_url === currentDomain && (
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          knownPage
                            ? "bg-success/20 text-success"
                            : "bg-destructive/20 text-destructive"
                        }`}>
                        {knownPage ? "Known" : "Unknown"}
                      </span>
                    )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PageSelector
                  pageOptions={pageOptions}
                  selectedPageId={selectedPageId}
                  onPageChange={setSelectedPageId}
                  onRefresh={fetchPages}
                  isLoading={isLoadingPages}
                  disabled={!selectedWebsiteId}
                  highlightStatus={
                    !isLoadingUrl &&
                    currentPath &&
                    selectedWebsite?.normalized_url === currentDomain
                      ? knownPage
                        ? "known"
                        : "unknown"
                      : undefined
                  }
                  currentPath={currentPath}
                  optimisticPage={optimisticPage}
                  currentDomain={currentDomain}
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-2">
          <Card className="border-muted">
            <CardHeader>
              <CardTitle>Selected Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedWebsite && (
                <div>
                  <h3 className="font-medium">Website</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">URL:</div>
                    <div className="text-sm">
                      {selectedWebsite.normalized_url}
                    </div>
                    <div className="text-sm font-medium">ID:</div>
                    <div className="text-sm truncate">{selectedWebsite.id}</div>
                  </div>
                </div>
              )}

              {selectedPage && (
                <div>
                  <h3 className="font-medium">Page</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Path:</div>
                    <div className="text-sm">{selectedPage.path}</div>
                    <div className="text-sm font-medium">ID:</div>
                    <div className="text-sm truncate">{selectedPage.id}</div>
                  </div>
                </div>
              )}

              {!selectedWebsite && !selectedPage && (
                <div className="text-center py-4 text-gray-500">
                  No items selected
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
