/**
 * THIS IS AN EXAMPLE FILE FOR DOCUMENTATION ONLY
 * It demonstrates how to use the SDK in real components
 * Note: This file won't compile directly as it uses simplified type examples
 */

"use client"

import { useEffect, useState } from "react"

// Example 1: Import specific functions (best for tree-shaking)

// Example 2: Import entire APIs when using multiple methods

// Example 3: Create custom entity API
import {
  createEntityApi,
  createPage,
  fetchWebsitesForSpace,
  PageApi,
  updatePage,
  WebsiteApi
} from "./index"
import type { Page, Website } from "./index"

// Example component with specific function imports
export function WebsitesList({ spaceId }: { spaceId: string }) {
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadWebsites() {
      try {
        setLoading(true)
        const { data, error } = await fetchWebsitesForSpace(spaceId)

        if (error) throw error
        setWebsites(data || [])
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load websites")
        )
      } finally {
        setLoading(false)
      }
    }

    loadWebsites()
  }, [spaceId])

  if (loading) return <div>Loading websites...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {websites.map((site) => (
        <li key={site.id}>{site.url}</li>
      ))}
    </ul>
  )
}

// Example component using API objects
export function PageManager({ websiteId }: { websiteId: string }) {
  const [pages, setPages] = useState<Page[]>([])
  const [newPath, setNewPath] = useState("")

  useEffect(() => {
    async function loadPages() {
      const { data } = await PageApi.list({ website_id: websiteId })
      setPages(data || [])
    }

    loadPages()
  }, [websiteId])

  const handleAddPage = async () => {
    if (!newPath) return

    const path = newPath.startsWith("/") ? newPath : `/${newPath}`

    // Note: In a real implementation, you would need to provide all required fields
    // based on the actual PageInsert type. This is just an example.
    const { data, error } = await PageApi.create({
      website_id: websiteId,
      path: path
      // url: would be required in real implementation
      // Add any other required fields from the PageInsert type
    } as any) // Using 'as any' for example purposes only

    if (data) {
      setPages((prev) => [...prev, data])
      setNewPath("")
    }
  }

  return (
    <div>
      <h2>Pages</h2>
      <ul>
        {pages.map((page) => (
          <li key={page.id}>{page.path}</li>
        ))}
      </ul>

      <div>
        <input
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="/path"
        />
        <button onClick={handleAddPage}>Add Page</button>
      </div>
    </div>
  )
}

// Example of creating a custom entity API
interface Scan {
  id: string
  page_id: string
  status: "pending" | "running" | "completed" | "failed"
  created_at: string
  error?: string
}

interface ScanInsert {
  page_id: string
  status?: "pending" | "running" | "completed" | "failed"
}

// Create a custom API for a new entity
const ScanApi = createEntityApi<Scan, ScanInsert>({
  tableName: "Scan",
  entityName: "scan",
  errorHandlers: {
    onCreateError: (error) => {
      if (error.code === "23503") {
        return new Error("The page you are trying to scan does not exist")
      }
      return undefined
    }
  },
  validateInsert: (data) => {
    if (!data.page_id) {
      return new Error("Page ID is required to create a scan")
    }
    return undefined
  }
})

// Export specific functions for tree-shaking
export const {
  list: listScans,
  create: createScan,
  update: updateScanStatus
} = ScanApi
