"use client"

import { useSpaceContext } from "@/components/space/space-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useCurrentUrl } from "@/providers/url-provider"
import { useSelector } from "@xstate/react"
import { FlaskConical, FlaskConicalOffIcon, PlusCircle } from "lucide-react"
import { useCallback, useEffect, useMemo, useState, type FC } from "react"
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
  // Use a memoized selector with proper comparison
  const currentSpace = useSelector(
    spaceActor,
    (state) => state.context.currentSpace,
    (a, b) => a?.id === b?.id // Custom equality function
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
    addOptimisticWebsite,
    forceResetLoading
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
    addOptimisticPage,
    forceResetLoading: forceResetLoadingPages
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

  // Handle website change - use callback to maintain referential equality
  const handleWebsiteChange = useCallback(
    (websiteId: string) => {
      setSelectedWebsiteId(websiteId)
      setSelectedPageId(null)
    },
    [setSelectedWebsiteId, setSelectedPageId]
  )

  // Check if current domain matches any known website - memoize result
  const knownWebsite = useMemo(
    () =>
      websiteOptions.find(
        (website) => website.normalized_url === currentDomain
      ),
    [websiteOptions, currentDomain]
  )

  // Check if current path matches any known page - memoize result
  const knownPage = useMemo(
    () => pageOptions.find((page) => page.path === currentPath),
    [pageOptions, currentPath]
  )

  // Always keep form values in sync with current URL
  useEffect(() => {
    if (currentDomain) {
      setWebsiteUrl(currentDomain)
    }
    if (currentPath) {
      setPagePath(currentPath)
    }
  }, [currentDomain, currentPath, setWebsiteUrl, setPagePath])

  // Handle quick page creation - use callback for performance
  const handleQuickPageCreate = useCallback(async () => {
    if (!currentDomain || !currentPath || !spaceId) {
      toast.error("Missing URL information")
      return
    }

    if (isCreatingQuick) return // Prevent duplicate calls
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
  }, [
    currentDomain,
    currentPath,
    spaceId,
    isCreatingQuick,
    knownWebsite,
    addOptimisticPage,
    createPage,
    addOptimisticWebsite,
    createWebsiteAndPage,
    fetchWebsites,
    fetchPages
  ])

  // Compute the quick add button disabled state
  const quickAddDisabled = useMemo(
    () =>
      isCreatingQuick ||
      !spaceId ||
      !currentDomain ||
      !currentPath ||
      Boolean(knownWebsite && knownPage),
    [
      isCreatingQuick,
      spaceId,
      currentDomain,
      currentPath,
      knownWebsite,
      knownPage
    ]
  )

  return (
    <div className="p-2">
      {!isLoadingUrl && currentDomain && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {knownWebsite && knownPage ? (
              <FlaskConical size={16} aria-hidden="true" />
            ) : (
              <FlaskConicalOffIcon size={16} aria-hidden="true" />
            )}
            <div>
              <span
                className={cn(
                  knownWebsite ? "text-green-500" : "text-red-500"
                )}>
                {currentDomain}
              </span>
              {currentPath && (
                <span
                  className={cn(knownPage ? "text-green-500" : "text-red-500")}>
                  {currentPath}
                </span>
              )}
            </div>
          </div>

          {/* Quick add button */}
          <Button
            size="icon"
            className="w-8 h-8"
            onClick={handleQuickPageCreate}
            disabled={quickAddDisabled}>
            <PlusCircle size={16} aria-hidden="true" />
            <span className="sr-only">
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

      {
        // <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        //   <div className="space-y-6">
        //     <Card className="border-muted">
        //       <CardHeader>
        //         <CardTitle className="flex items-center justify-between">
        //           <span>Select Website</span>
        //           {!isLoadingUrl && currentDomain && (
        //             <span
        //               className={`text-xs px-2 py-1 rounded ${
        //                 knownWebsite
        //                   ? "bg-success/20 text-success"
        //                   : "bg-destructive/20 text-destructive"
        //               }`}>
        //               {knownWebsite ? "Known" : "Unknown"}
        //             </span>
        //           )}
        //         </CardTitle>
        //       </CardHeader>
        //       <CardContent>
        //         <WebsiteSelector
        //           websiteOptions={websiteOptions}
        //           selectedWebsiteId={selectedWebsiteId}
        //           onWebsiteChange={handleWebsiteChange}
        //           onRefresh={() => fetchWebsites(true)} // Force refresh with true parameter
        //           isLoading={isLoadingWebsites}
        //           error={websitesError}
        //           forceResetLoading={forceResetLoading}
        //           highlightStatus={
        //             !isLoadingUrl && currentDomain
        //               ? knownWebsite
        //                 ? "known"
        //                 : "unknown"
        //               : undefined
        //           }
        //           currentDomain={currentDomain}
        //           optimisticWebsite={optimisticWebsite}
        //         />
        //       </CardContent>
        //     </Card>
        //     {selectedWebsiteId && (
        //       <Card className="border-muted">
        //         <CardHeader>
        //           <CardTitle className="flex items-center justify-between">
        //             <span>Select Page</span>
        //             {!isLoadingUrl &&
        //               currentPath &&
        //               selectedWebsite?.normalized_url === currentDomain && (
        //                 <span
        //                   className={`text-xs px-2 py-1 rounded ${
        //                     knownPage
        //                       ? "bg-success/20 text-success"
        //                       : "bg-destructive/20 text-destructive"
        //                   }`}>
        //                   {knownPage ? "Known" : "Unknown"}
        //                 </span>
        //               )}
        //           </CardTitle>
        //         </CardHeader>
        //         <CardContent>
        //           <PageSelector
        //             pageOptions={pageOptions}
        //             selectedPageId={selectedPageId}
        //             onPageChange={setSelectedPageId}
        //             onRefresh={() => fetchPages(true)} // Force refresh with true parameter
        //             isLoading={isLoadingPages}
        //             error={pagesError}
        //             forceResetLoading={forceResetLoadingPages}
        //             disabled={!selectedWebsiteId}
        //             highlightStatus={
        //               !isLoadingUrl &&
        //               currentPath &&
        //               selectedWebsite?.normalized_url === currentDomain
        //                 ? knownPage
        //                   ? "known"
        //                   : "unknown"
        //                 : undefined
        //             }
        //             currentPath={currentPath}
        //             optimisticPage={optimisticPage}
        //             currentDomain={currentDomain}
        //           />
        //         </CardContent>
        //       </Card>
        //     )}
        //   </div>
        //   <div className="md:col-span-2">
        //     <Card className="border-muted">
        //       <CardHeader>
        //         <CardTitle>Selected Item Details</CardTitle>
        //       </CardHeader>
        //       <CardContent className="space-y-4">
        //         {selectedWebsite && (
        //           <div>
        //             <h3 className="font-medium">Website</h3>
        //             <Separator className="my-2" />
        //             <div className="grid grid-cols-2 gap-2">
        //               <div className="text-sm font-medium">URL:</div>
        //               <div className="text-sm">
        //                 {selectedWebsite.normalized_url}
        //               </div>
        //               <div className="text-sm font-medium">ID:</div>
        //               <div className="text-sm truncate">
        //                 {selectedWebsite.id}
        //               </div>
        //             </div>
        //           </div>
        //         )}
        //         {selectedPage && (
        //           <div>
        //             <h3 className="font-medium">Page</h3>
        //             <Separator className="my-2" />
        //             <div className="grid grid-cols-2 gap-2">
        //               <div className="text-sm font-medium">Path:</div>
        //               <div className="text-sm">{selectedPage.path}</div>
        //               <div className="text-sm font-medium">ID:</div>
        //               <div className="text-sm truncate">{selectedPage.id}</div>
        //             </div>
        //           </div>
        //         )}
        //         {!selectedWebsite && !selectedPage && (
        //           <div className="text-center py-4 text-gray-500">
        //             No items selected
        //           </div>
        //         )}
        //       </CardContent>
        //     </Card>
        //   </div>
        // </div>
      }
    </div>
  )
}
