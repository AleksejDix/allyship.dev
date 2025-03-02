import type { Database } from "@/types/database.types"

import type { ApiResponse } from "../connector-utils"
import { createEntityApi } from "./core"

// Type definitions
export type Page = Database["public"]["Tables"]["Page"]["Row"]
export type PageInsert = Database["public"]["Tables"]["Page"]["Insert"]

// Create the page API with specific error handlers
const pageApi = createEntityApi<Page, PageInsert>({
  tableName: "Page",
  entityName: "page",
  errorHandlers: {
    onCreateError: (error) => {
      if (error.code === "23505") {
        return new Error("This page already exists for this website")
      } else if (error.code === "23503") {
        return new Error("The referenced website doesn't exist")
      }
      return undefined
    },
    onUpdateError: (error) => {
      if (error.code === "23503") {
        return new Error("The referenced website doesn't exist")
      }
      return undefined
    }
  },
  validateInsert: (data) => {
    if (!data.website_id || !data.path) {
      return new Error("Valid page data with website_id and path is required")
    }
    return undefined
  }
})

// Export individual functions for tree-shaking
export const {
  list: listPages,
  get: getPage,
  create: createPage,
  update: updatePage,
  remove: deletePage
} = pageApi

// Export the specific function to maintain existing API
export async function fetchPagesForWebsite(
  websiteId: string
): Promise<ApiResponse<Page[]>> {
  if (!websiteId) {
    throw new Error("Website ID is required")
  }

  return listPages(
    { website_id: websiteId },
    { orderBy: { column: "path", ascending: true } }
  )
}

// Legacy function for backwards compatibility
export const readPages = fetchPagesForWebsite

// Export the entire API as default export
export default pageApi
