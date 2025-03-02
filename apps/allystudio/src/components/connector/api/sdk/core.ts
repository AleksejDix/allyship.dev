import { supabase } from "@/core/supabase"
import type { SupabaseClient } from "@supabase/supabase-js"

import { checkAuth, handleApiError } from "../connector-utils"
import type { ApiResponse } from "../connector-utils"

/**
 * Converts an array to a Record object using a specified key or key function
 */
export function toRecord<T extends Record<string, any>>(
  array: T[],
  keyField: keyof T,
  keyFn?: (item: T) => string
): Record<string, T> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn ? keyFn(item) : String(item[keyField])
      acc[key] = item
      return acc
    },
    {} as Record<string, T>
  )
}

/**
 * Options for entity-specific error handling
 */
export interface EntityErrorHandlers<T> {
  onFetchError?: (error: any, context: Record<string, any>) => Error | undefined
  onCreateError?: (
    error: any,
    data: any,
    context: Record<string, any>
  ) => Error | undefined
  onUpdateError?: (
    error: any,
    id: string,
    data: any,
    context: Record<string, any>
  ) => Error | undefined
  onDeleteError?: (
    error: any,
    id: string,
    context: Record<string, any>
  ) => Error | undefined
}

/**
 * Configuration for entity API factory
 */
export interface EntityConfig<T, TInsert> {
  /** Table name in Supabase */
  tableName: string

  /** Entity name for error messages (e.g., "website", "page") */
  entityName: string

  /** Custom error handlers for entity-specific error cases */
  errorHandlers?: EntityErrorHandlers<T>

  /** Optional transformation for fetched data */
  transformData?: (data: any) => T

  /** Custom validation for entity data */
  validateInsert?: (data: TInsert) => Error | undefined
  validateUpdate?: (data: Partial<TInsert>) => Error | undefined
}

/**
 * Creates CRUD operations for a specific entity type
 */
export function createEntityApi<T, TInsert = T>(
  config: EntityConfig<T, TInsert>,
  client: SupabaseClient = supabase
) {
  const {
    tableName,
    entityName,
    errorHandlers = {},
    transformData,
    validateInsert,
    validateUpdate
  } = config

  /**
   * Fetch all entities matching the filter criteria
   */
  async function list(
    filters: Record<string, any> = {},
    options: {
      orderBy?: { column: string; ascending?: boolean }
      limit?: number
    } = {}
  ): Promise<ApiResponse<T[]>> {
    try {
      // Check authentication
      const { user, error: authError } = await checkAuth(client)
      if (authError) throw authError

      // Build query
      let query = client.from(tableName).select("*")

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true
        })
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit)
      }

      // Execute query
      const { data, error } = await query

      // Handle standard errors
      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(
            `You don't have permission to view these ${entityName}s`
          )
        }

        // Custom error handler
        const customError = errorHandlers.onFetchError?.(error, {
          filters,
          options
        })
        if (customError) throw customError

        throw error
      }

      // Transform data if needed
      const transformedData = transformData ? data?.map(transformData) : data

      return { data: transformedData || [], error: null }
    } catch (error) {
      return handleApiError<T[]>(error, "fetching", `${entityName}s`, {
        filters,
        options
      })
    }
  }

  /**
   * Fetch a single entity by ID
   */
  async function get(id: string): Promise<ApiResponse<T>> {
    try {
      // Validate input
      if (!id) {
        throw new Error(`${entityName} ID is required`)
      }

      // Check authentication
      const { user, error: authError } = await checkAuth(client)
      if (authError) throw authError

      // Fetch data
      const { data, error } = await client
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single()

      // Handle database errors
      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(
            `You don't have permission to view this ${entityName}`
          )
        }

        // Custom error handler
        const customError = errorHandlers.onFetchError?.(error, { id })
        if (customError) throw customError

        throw error
      }

      // Transform data if needed
      const transformedData = transformData ? transformData(data) : data

      return { data: transformedData, error: null }
    } catch (error) {
      return handleApiError<T>(error, "fetching", entityName, { id })
    }
  }

  /**
   * Create a new entity
   */
  async function create(data: TInsert): Promise<ApiResponse<T>> {
    try {
      // Custom validation
      const validationError = validateInsert?.(data)
      if (validationError) throw validationError

      // Check authentication
      const { user, error: authError } = await checkAuth(client)
      if (authError) throw authError

      // Create entity
      const { data: createdData, error } = await client
        .from(tableName)
        .insert([data])
        .select()
        .single()

      // Handle database errors
      if (error) {
        if (error.code === "23505") {
          throw new Error(`This ${entityName} already exists`)
        }

        // Custom error handler
        const customError = errorHandlers.onCreateError?.(error, data, {})
        if (customError) throw customError

        throw error
      }

      // Transform data if needed
      const transformedData = transformData
        ? transformData(createdData)
        : createdData

      return { data: transformedData, error: null }
    } catch (error) {
      return handleApiError<T>(error, "creating", entityName, { data })
    }
  }

  /**
   * Update an existing entity
   */
  async function update(
    id: string,
    data: Partial<TInsert>
  ): Promise<ApiResponse<T>> {
    try {
      // Validate input
      if (!id) {
        throw new Error(`${entityName} ID is required`)
      }

      // Custom validation
      const validationError = validateUpdate?.(data)
      if (validationError) throw validationError

      if (!data || Object.keys(data).length === 0) {
        throw new Error("Update data is required")
      }

      // Check authentication
      const { user, error: authError } = await checkAuth(client)
      if (authError) throw authError

      // Update entity
      const { data: updatedData, error } = await client
        .from(tableName)
        .update(data)
        .eq("id", id)
        .select()
        .single()

      // Handle database errors
      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(
            `You don't have permission to update this ${entityName}`
          )
        }

        // Custom error handler
        const customError = errorHandlers.onUpdateError?.(error, id, data, {})
        if (customError) throw customError

        throw error
      }

      // Transform data if needed
      const transformedData = transformData
        ? transformData(updatedData)
        : updatedData

      return { data: transformedData, error: null }
    } catch (error) {
      return handleApiError<T>(error, "updating", entityName, {
        id,
        updateFields: Object.keys(data || {})
      })
    }
  }

  /**
   * Delete an entity by ID
   */
  async function remove(id: string): Promise<ApiResponse<boolean>> {
    try {
      // Validate input
      if (!id) {
        throw new Error(`${entityName} ID is required`)
      }

      // Check authentication
      const { user, error: authError } = await checkAuth(client)
      if (authError) throw authError

      // Delete entity
      const { error } = await client.from(tableName).delete().eq("id", id)

      // Handle database errors
      if (error) {
        if (error.code === "PGRST116") {
          throw new Error(
            `You don't have permission to delete this ${entityName}`
          )
        }

        // Custom error handler
        const customError = errorHandlers.onDeleteError?.(error, id, {})
        if (customError) throw customError

        throw error
      }

      return { data: true, error: null }
    } catch (error) {
      return handleApiError<boolean>(error, "deleting", entityName, { id })
    }
  }

  // Return API object with all CRUD operations
  return {
    list,
    get,
    create,
    update,
    remove,
    // Utility to expose the underlying table query for advanced operations
    query: () => client.from(tableName)
  }
}
