'use server'

import { createServerAction } from 'zsa'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/apps/AllyShip/database.types'
import { updatePageSchema } from '../schemas'

type Page = Tables<'Page'>

export const updatePage = createServerAction()
  .input(updatePageSchema)
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

    // Get the page to check website ownership
    const { data: page, error: pageError } = await supabase
      .from('Page')
      .select('website_id')
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

    // Verify space ownership
    const { data: space, error: spaceError } = await supabase
      .from('Website')
      .select('space:Space(owner_id)')
      .eq('id', page.website_id)
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
          message: 'Not authorized to update pages in this space',
          code: 'NOT_SPACE_OWNER',
        },
      }
    }

    // Perform the update
    const { data: updatedPage, error } = await supabase
      .from('Page')
      .update({
        ...(input.url && { url: input.url }),
        ...(input.website_id && { website_id: input.website_id }),
        ...(input.status && { status: input.status }),
        ...(input.last_scan_at && { last_scan_at: input.last_scan_at }),
        ...(input.error_message && { error_message: input.error_message }),
      })
      .eq('id', input.id)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: {
          message: 'Failed to update page',
          code: 'UPDATE_FAILED',
        },
      }
    }

    return { success: true, data: updatedPage }
  })
