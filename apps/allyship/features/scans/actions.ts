'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

import {
  normalizeUrlString,
  extractDomain,
  extractPath,
} from '@allystudio/url-utils'

const urlSchema = z.object({
  url: z.string().transform((val, ctx) => {
    try {
      // First ensure we have a protocol
      const urlWithProtocol = val.trim().startsWith('http')
        ? val.trim()
        : `https://${val.trim()}`

      // Then normalize with query params
      return normalizeUrlString(urlWithProtocol, true)
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid URL format',
      })
      return z.NEVER
    }
  }),
  account_id: z.string().optional(),
})

type ScanInput = z.infer<typeof urlSchema>

const parseFormData = (
  data: FormData | { url: string; account_id?: string }
): ScanInput => {
  if (data instanceof FormData) {
    const formObject = Object.fromEntries(data)
    return {
      url: String(formObject.url || ''),
      account_id: formObject.account_id ? String(formObject.account_id) : undefined,
    }
  }
  return data
}

export async function createScan(
  formData: FormData | { url: string; account_id?: string }
) {
  console.log('[SERVER] Creating scan with form data:', formData)
  const supabase = await createClient()

  try {
    // Parse and validate input
    const input = parseFormData(formData)
    console.log('[SERVER] Parsed input:', input)
    const result = urlSchema.safeParse(input)
    console.log('[SERVER] URL schema validation result:', result)

    if (!result.success) {
      console.error('[SERVER] Validation error:', result.error.format())
      return {
        success: false,
        error: {
          message: 'Invalid URL provided',
          details: result.error.format(),
        },
      }
    }

    const { url, account_id } = result.data
    console.log('[SERVER] Validated data:', { url, account_id })

    // Check user is logged in
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error('[SERVER] Auth error:', authError)
      throw authError
    }

    console.log('[SERVER] Current user:', user?.id)

    if (!user) {
      console.warn('[SERVER] User not authenticated')
      return {
        success: false,
        error: {
          message: 'You must be logged in to scan a website',
        },
      }
    }

    // Get personal account (use provided account_id or get personal account)
    let targetAccountId = account_id
    if (!targetAccountId) {
      console.log('[SERVER] No account_id provided, looking for personal account')
      const { data: accounts, error: accountsError } = await supabase.rpc(
        'get_accounts'
      )

      console.log('[SERVER] Accounts query result:', {
        accounts,
        accountsError,
      })

      if (accountsError) {
        console.error('[SERVER] Failed to fetch accounts:', accountsError)
        throw accountsError
      }

      const personalAccount = accounts?.find((acc: any) => acc.personal_account)

      if (!personalAccount) {
        console.error('[SERVER] No personal account found')
        throw new Error('No personal account found')
      }

      targetAccountId = personalAccount.account_id
      console.log('[SERVER] Found personal account:', targetAccountId)
    }

    // Parse URL to get website URL (hostname) and page path
    console.log('[SERVER] Extracting domain and path from URL:', url)
    try {
      // Ensure URL has protocol for proper parsing
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`
      const websiteUrl = extractDomain(urlWithProtocol)
      const pagePath = extractPath(urlWithProtocol)
      console.log('[SERVER] Extracted:', { websiteUrl, pagePath })

      // Validate extracted values
      if (!websiteUrl || websiteUrl.length === 0) {
        throw new Error('Invalid domain extracted from URL')
      }

      if (!pagePath || pagePath.length === 0) {
        throw new Error('Invalid path extracted from URL')
      }

      // Validate the URL format
      try {
        // This will throw if URL is invalid
        new URL(`https://${websiteUrl}${pagePath}`)
      } catch (error) {
        throw new Error('Invalid URL format after normalization')
      }

      // 1. Create or update website
      console.log('[SERVER] Creating/updating website:', {
        websiteUrl,
        targetAccountId,
      })
      const { data: website, error: websiteError } = await supabase
        .from('Website')
        .upsert(
          {
            url: websiteUrl,
            normalized_url: websiteUrl,
            account_id: targetAccountId,
            user_id: user.id,
            theme: 'BOTH',
          },
          { onConflict: 'normalized_url,account_id' }
        )
        .select()
        .single()

      if (websiteError) {
        console.error('[SERVER] Failed to create website:', websiteError)
        throw websiteError
      }

      if (!website) {
        console.error('[SERVER] Website creation returned no data')
        throw new Error('Failed to create website')
      }
      console.log('[SERVER] Website created/updated:', website)

      // 2. Create or update page
      console.log('[SERVER] Creating/updating page:', {
        url: websiteUrl,
        pagePath,
        websiteId: website.id,
      })
      const { data: page, error: pageError } = await supabase
        .from('Page')
        .upsert(
          {
            url: websiteUrl, // Store without protocol like other entries
            normalized_url: websiteUrl, // Store without protocol
            path: pagePath,
            website_id: website.id,
          },
          { onConflict: 'website_id,path' }
        )
        .select()
        .single()

      if (pageError) {
        console.error('[SERVER] Failed to create page:', pageError)
        throw pageError
      }

      if (!page) {
        console.error('[SERVER] Page creation returned no data')
        throw new Error('Failed to create page')
      }
      console.log('[SERVER] Page created/updated:', page)

      // 3. Create scan
      console.log('[SERVER] Creating scan for page:', page.id)
      const { data: scan, error: scanError } = await supabase
        .from('Scan')
        .insert({
          page_id: page.id,
          status: 'pending',
          metrics: {},
          url: websiteUrl, // Store without protocol
          normalized_url: websiteUrl, // Store without protocol
        })
        .select()
        .single()

      if (scanError) {
        console.error('[SERVER] Failed to create scan:', scanError)
        throw scanError
      }

      if (!scan) {
        console.error('[SERVER] Scan creation returned no data')
        throw new Error('Failed to create scan')
      }
      console.log('[SERVER] Scan created:', scan)

      // Trigger the edge function
      const scanUrl = `https://${websiteUrl}` // Add protocol only for the HTTP request
      console.log('[SERVER] Triggering edge function:', {
        url: scanUrl,
        scanId: scan.id,
      })
      const { error: functionError } = await supabase.functions.invoke('scan', {
        body: {
          url: scanUrl, // Use URL with protocol for the actual scan
          id: scan.id,
        },
      })

      if (functionError) {
        console.error('[SERVER] Edge function error:', {
          error: functionError,
          scanId: scan.id,
          url: scanUrl,
        })

        // Update scan status to failed
        await supabase
          .from('Scan')
          .update({
            status: 'failed',
            metrics: {
              error: functionError.message || 'Edge function failed',
            },
          })
          .eq('id', scan.id)

        return {
          success: false,
          error: {
            message: 'Failed to start scan: ' + functionError.message,
          },
        }
      }

      // Return success with scan ID
      console.log('[SERVER] Scan process completed successfully:', scan.id)
      revalidatePath('/', 'layout')
      return {
        success: true,
        data: {
          id: scan.id,
        },
      }
    } catch (error) {
      console.error('[SERVER] Error in URL processing:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url,
      })
      throw error
    }
  } catch (error) {
    console.error('[SERVER] Unexpected error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
    }
  }
}

export async function getScan(id: string) {
  const supabase = await createClient()
  const response = await supabase.from('Scan').select().match({ id }).single()
  return response
}
