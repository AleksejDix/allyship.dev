import type { Database } from "@/types/database.types"

import type { ApiResponse } from "../connector-utils"
import { createEntityApi } from "./core"

// Type definitions
export type Website = Database["public"]["Tables"]["Website"]["Row"]
export type WebsiteInsert = Database["public"]["Tables"]["Website"]["Insert"]

// Create the website API with specific error handlers
const websiteApi = createEntityApi<Website, WebsiteInsert>({
  tableName: "Website",
  entityName: "website",
  errorHandlers: {
    onCreateError: (error) => {
      if (error.code === "23505") {
        return new Error("This website already exists in this space")
      }
      return undefined
    },
    onUpdateError: (error) => {
      if (error.code === "23503") {
        return new Error("The referenced space doesn't exist")
      }
      return undefined
    }
  },
  validateInsert: (data) => {
    if (!data.space_id || !data.url) {
      return new Error("Valid website data with space_id and url is required")
    }
    return undefined
  }
})

// Export individual functions
export const {
  list: listWebsites,
  get: getWebsite,
  create: createWebsite,
  update: updateWebsite,
  remove: deleteWebsite
} = websiteApi

// Export the specific function to maintain existing API
export async function fetchWebsitesForSpace(
  spaceId: string
): Promise<ApiResponse<Website[]>> {
  if (!spaceId) {
    throw new Error("Space ID is required")
  }

  return listWebsites(
    { space_id: spaceId },
    { orderBy: { column: "normalized_url", ascending: false } }
  )
}

// Legacy function for backwards compatibility
export const readWebsites = fetchWebsitesForSpace

// Export the entire API as default export
export default websiteApi
