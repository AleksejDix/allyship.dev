'use server'

import { createServerAction } from 'zsa'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@/apps/AllyShip/database.types'
import { normalizeUrl } from '@/utils/url'
import { z } from 'zod'

export const deletePageSchema = z.object({
  id: z.string(),
})

type Page = Tables<'Page'>

export const deletePage = createServerAction()
  .input(deletePageSchema)
  .handler(async ({ input }) => {
    console.log('=== Delete Page Action Start ===')
    console.log('Input:', input)

    const supabase = await createClient()

    // First verify the user has access
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Authentication error:', userError)
      return {
        success: false,
        error: {
          message: 'Not authenticated',
          code: 'AUTH_ERROR',
        },
      }
    }
    console.log('Authenticated user:', user.id)

    // Get the page to check website ownership
    console.log('Searching for page by ID:', input.id)
    const { data: page, error: pageError } = await supabase
      .from('Page')
      .select('id, website_id')
      .eq('id', input.id)
      .single()

    console.log('Page search result:', { page, error: pageError })

    if (!page) {
      console.log('Page not found')
      return {
        success: false,
        error: {
          message: 'Page not found',
          code: 'PAGE_NOT_FOUND',
        },
      }
    }

    // Verify space ownership
    console.log('Verifying space ownership for website:', page.website_id)
    const { data: space, error: spaceError } = await supabase
      .from('Website')
      .select('space:Space(owner_id)')
      .eq('id', page.website_id)
      .single()

    console.log('Space verification result:', { space, error: spaceError })

    if (spaceError || !space?.space?.owner_id) {
      console.error('Space not found:', spaceError)
      return {
        success: false,
        error: {
          message: 'Space not found',
          code: 'SPACE_NOT_FOUND',
        },
      }
    }

    if (space.space.owner_id !== user.id) {
      console.error('Authorization failed:', {
        spaceOwnerId: space.space.owner_id,
        userId: user.id,
      })
      return {
        success: false,
        error: {
          message: 'Not authorized to delete pages in this space',
          code: 'NOT_SPACE_OWNER',
        },
      }
    }

    // Perform the deletion
    console.log('Attempting to delete page:', page.id)
    const { error } = await supabase.from('Page').delete().eq('id', page.id)

    if (error) {
      console.error('Failed to delete page:', error)
      return {
        success: false,
        error: {
          message: error.message || 'Failed to delete page',
          code: error.code || 'DELETE_FAILED',
        },
      }
    }

    console.log('Page deleted successfully')
    return { success: true }
  })
