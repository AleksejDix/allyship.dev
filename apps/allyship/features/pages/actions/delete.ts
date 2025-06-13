'use server'

import { createServerAction } from 'zsa'
import { createClient } from '@/lib/supabase/server'
import { deletePageSchema } from '../schemas'

export const deletePage = createServerAction()
  .input(deletePageSchema)
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

    // Delete the page - RLS policies will handle permissions
    const { error } = await supabase.from('Page').delete().eq('id', input.id)

    if (error) {
      console.error('Delete failed:', error)
      return {
        success: false,
        error: {
          message: error.message || 'Failed to delete page',
          code: error.code || 'DELETE_FAILED',
        },
      }
    }

    return { success: true }
  })
