import { useState } from "react"

import {
  createPage,
  createPageWithWebsite,
  createWebsite,
  type Website
} from "../api/sdk"

/**
 * Custom hook for creating pages with website dependency handling
 *
 * @param spaceId - The ID of the space to create the page in
 * @param onSuccess - Callback fired after successful page creation
 * @returns Page creation state and functions
 */
export function usePageCreator(
  spaceId: string | null | undefined,
  onSuccess?: () => void
) {
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("")
  const [newPagePath, setNewPagePath] = useState("")

  /**
   * Create a new page with a website
   *
   * @param websiteToUse - Optional existing website to use instead of creating a new one
   */
  const createPage = async (websiteToUse?: Website) => {
    if (!spaceId) {
      setError("No space selected. Please select a space first.")
      return
    }

    if (!newPagePath) {
      setError("Page path is required")
      return
    }

    let websiteUrl = newWebsiteUrl

    // If no website URL is provided but an existing website is passed, use that
    if (!websiteUrl && websiteToUse) {
      websiteUrl = websiteToUse.url
    }

    if (!websiteUrl) {
      setError("Website URL is required")
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      const response = await createPageWithWebsite(
        spaceId,
        websiteUrl,
        newPagePath
      )

      if (response.error) {
        setError(response.error.message || "Failed to create page")
        return
      }

      // Reset form
      setNewWebsiteUrl("")
      setNewPagePath("")

      // Call the success callback
      if (onSuccess) {
        onSuccess()
      }

      return response.data
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      )
      return null
    } finally {
      setIsCreating(false)
    }
  }

  /**
   * Create both a website and a page in one operation
   * Used for one-click adding of new content
   */
  const createWebsiteAndPage = async (websiteUrl: string, pagePath: string) => {
    if (!spaceId) {
      setError("No space selected")
      return null
    }

    setIsCreating(true)
    setError(null)

    try {
      // Use the existing procedure function that handles both website and page creation
      const response = await createPageWithWebsite(
        spaceId,
        websiteUrl,
        pagePath
      )

      if (response.error) {
        throw new Error(
          response.error.message || "Failed to create website and page"
        )
      }

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }

      return response.data
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create website and page"
      )
      return null
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setNewWebsiteUrl("")
    setNewPagePath("")
    setError(null)
  }

  return {
    isCreating,
    error,
    setError,
    newWebsiteUrl,
    setNewWebsiteUrl,
    newPagePath,
    setNewPagePath,
    createPage,
    resetForm,
    createWebsiteAndPage
  }
}
