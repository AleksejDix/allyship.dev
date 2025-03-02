import {
  createPage,
  updatePage,
  type Page,
  type PageInsert,
  type PageUpdate
} from "."
import type { ApiResponse } from "../connector-utils"

/**
 * Creates multiple pages in a batch operation
 *
 * @param pages - Array of page objects to create
 * @returns ApiResponse with created pages and error information
 */
export async function batchCreatePages(
  pages: PageInsert[]
): Promise<
  ApiResponse<{
    successful: Page[]
    failed: Array<{ data: PageInsert; error: Error }>
  }>
> {
  if (!pages.length) {
    return {
      data: { successful: [], failed: [] },
      error: null
    }
  }

  try {
    const results = await Promise.all(pages.map((page) => createPage(page)))

    const successful = results
      .filter((result) => result.data !== null)
      .map((result) => result.data as Page)

    const failed = results
      .filter((result) => result.error !== null)
      .map((result, index) => ({
        data: pages[index],
        error: result.error as Error
      }))

    return {
      data: { successful, failed },
      error: null
    }
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error during batch operation")
    }
  }
}

/**
 * Updates multiple pages in a batch operation
 *
 * @param updates - Array of page updates with ID and data
 * @returns ApiResponse with updated pages and error information
 */
export async function batchUpdatePages(
  updates: Array<{ id: string; data: PageUpdate }>
): Promise<
  ApiResponse<{
    successful: Page[]
    failed: Array<{ id: string; data: PageUpdate; error: Error }>
  }>
> {
  if (!updates.length) {
    return {
      data: { successful: [], failed: [] },
      error: null
    }
  }

  try {
    const results = await Promise.all(
      updates.map((update) => updatePage(update.id, update.data))
    )

    const successful = results
      .filter((result) => result.data !== null)
      .map((result) => result.data as Page)

    const failed = results
      .filter((result) => result.error !== null)
      .map((result, index) => ({
        id: updates[index].id,
        data: updates[index].data,
        error: result.error as Error
      }))

    return {
      data: { successful, failed },
      error: null
    }
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error during batch update operation")
    }
  }
}

/**
 * Creates or updates multiple pages based on whether they have an ID
 *
 * @param pages - Array of page objects, with or without ID
 * @returns ApiResponse with created/updated pages and error information
 */
export async function batchUpsertPages(
  pages: Array<PageInsert | (PageUpdate & { id: string })>
): Promise<
  ApiResponse<{
    successful: Page[]
    failed: Array<{ data: any; error: Error }>
  }>
> {
  if (!pages.length) {
    return {
      data: { successful: [], failed: [] },
      error: null
    }
  }

  try {
    // Split into creates and updates
    const creates = pages.filter((page) => !("id" in page)) as PageInsert[]
    const updates = pages
      .filter((page) => "id" in page)
      .map((page) => {
        // Extract id from the object and use the rest as data
        const { id, ...data } = page as PageUpdate & { id: string }
        return { id, data: data as PageUpdate }
      })

    // Run batch operations in parallel
    const [createResults, updateResults] = await Promise.all([
      creates.length
        ? batchCreatePages(creates)
        : { data: { successful: [], failed: [] }, error: null },
      updates.length
        ? batchUpdatePages(updates)
        : { data: { successful: [], failed: [] }, error: null }
    ])

    // Handle case where either operation completely failed
    if (!createResults.data || !updateResults.data) {
      return {
        data: null,
        error: createResults.error || updateResults.error
      }
    }

    // Combine results
    return {
      data: {
        successful: [
          ...createResults.data.successful,
          ...updateResults.data.successful
        ],
        failed: [...createResults.data.failed, ...updateResults.data.failed]
      },
      error: null
    }
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error("Unknown error during batch upsert operation")
    }
  }
}
