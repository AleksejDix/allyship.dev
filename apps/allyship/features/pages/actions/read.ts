'use server'

import { createServerAction } from 'zsa'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/apps/AllyShip/database.types'
import { getPageSchema, getPagesSchema } from '../schemas'

type Page = Tables<'Page'>

export const getPages = createServerAction()
  .input(getPagesSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()

    // First verify the user has access
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return {
        success: false,
        error: {
          message: 'Not authenticated',
          code: 'AUTH_ERROR',
        },
      }
    }

    // Verify space ownership
    const { data: space, error: spaceError } = await supabase
      .from('Website')
      .select('space:Space(owner_id)')
      .eq('id', input.website_id)
      .single()

    if (spaceError || !space?.space?.owner_id) {
      return {
        success: false,
        error: {
          message: 'Space not found',
          code: 'SPACE_NOT_FOUND',
        },
      }
    }

    if (space.space.owner_id !== user.id) {
      return {
        success: false,
        error: {
          message: 'Not authorized to view pages in this space',
          code: 'NOT_SPACE_OWNER',
        },
      }
    }

    // Get all pages for the website
    const { data: pages, error } = await supabase
      .from('Page')
      .select()
      .eq('website_id', input.website_id)
      .order('url')

    if (error) {
      return {
        success: false,
        error: {
          message: 'Failed to get pages',
          code: 'GET_FAILED',
        },
      }
    }

    return { success: true, data: pages }
  })

export const getPage = createServerAction()
  .input(getPageSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()

    // First verify the user has access
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return {
        success: false,
        error: {
          message: 'Not authenticated',
          code: 'AUTH_ERROR',
        },
      }
    }

    // Get the page and check website ownership
    const { data: page, error: pageError } = await supabase
      .from('Page')
      .select('*, website:Website(space:Space(owner_id))')
      .eq('id', input.id)
      .single()

    if (pageError || !page) {
      return {
        success: false,
        error: {
          message: 'Page not found',
          code: 'PAGE_NOT_FOUND',
        },
      }
    }

    if (page.website?.space?.owner_id !== user.id) {
      return {
        success: false,
        error: {
          message: 'Not authorized to view this page',
          code: 'NOT_SPACE_OWNER',
        },
      }
    }

    return { success: true, data: page }
  })
