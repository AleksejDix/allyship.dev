// Core exports
export { createEntityApi, toRecord } from "./core"

// Website API exports
export {
  fetchWebsitesForSpace,
  readWebsites,
  listWebsites,
  getWebsite,
  createWebsite,
  updateWebsite,
  deleteWebsite
} from "./website-api"

// Page API exports
export {
  fetchPagesForWebsite,
  readPages,
  listPages,
  getPage,
  createPage,
  updatePage,
  deletePage
} from "./page-api"

// Procedures - higher-level operations
export * from "./procedures"

// Batch operations
export * from "./batch"

// Type exports from connector utils
export type { ApiResponse } from "../connector-utils"

// Re-export types from our types file
export type {
  Website,
  WebsiteInsert,
  WebsiteUpdate,
  WebsiteRecord,
  Page,
  PageInsert,
  PageUpdate,
  PageRecord
} from "./types"
