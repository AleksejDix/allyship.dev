import { createClient } from "@supabase/supabase-js"
import { Database } from "@/database.types"

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY")
}

// Store validated env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL.trim()
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY.trim()

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.endsWith('.supabase.co')) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`)
}

// Validate key format (should be a JWT)
if (!supabaseServiceRoleKey.startsWith('eyJ')) {
  throw new Error('Invalid service role key format - should start with "eyJ"')
}

console.log('Creating Supabase client with:')
console.log('URL:', supabaseUrl)
console.log('Key length:', supabaseServiceRoleKey.length)
console.log('Key starts with:', supabaseServiceRoleKey.substring(0, 10))

export function createServerClient() {
  try {
    const client = createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Test the client
    console.log('Testing client connection...')
    return client
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw error
  }
}
