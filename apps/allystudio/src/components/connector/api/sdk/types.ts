/**
 * Website database row type
 */
export interface Website {
  id: string
  space_id: string
  user_id: string | null
  url: string
  normalized_url: string
  theme: "LIGHT" | "DARK" | "BOTH"
  created_at: string
  updated_at: string
}

/**
 * Website insert type for creating new websites
 */
export type WebsiteInsert = {
  space_id: string
  url: string
  normalized_url?: string
  theme?: "LIGHT" | "DARK" | "BOTH"
  user_id?: string | null
}

/**
 * Website update type for updating existing websites
 */
export type WebsiteUpdate = Partial<WebsiteInsert>

/**
 * Website record as stored in the UI state
 */
export type WebsiteRecord = Website

/**
 * Page database row type
 */
export interface Page {
  id: string
  website_id: string
  url: string
  path: string
  normalized_url: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

/**
 * Page insert type for creating new pages
 */
export type PageInsert = {
  website_id: string
  url: string
  path: string
  normalized_url?: string
}

/**
 * Page update type for updating existing pages
 */
export type PageUpdate = Partial<PageInsert>

/**
 * Page record as stored in the UI state
 */
export type PageRecord = Page
