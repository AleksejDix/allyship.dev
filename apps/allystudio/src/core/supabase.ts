import { createClient, type SupportedStorage } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"

// Create a custom storage implementation that matches Supabase's requirements
const storage = new Storage({
  area: "local"
})

const customStorage: SupportedStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await storage.get(key)
      return value ?? null
    } catch (error) {
      console.error("Storage.getItem error:", error)
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await storage.set(key, value)
    } catch (error) {
      console.error("Storage.setItem error:", error)
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await storage.remove(key)
    } catch (error) {
      console.error("Storage.removeItem error:", error)
    }
  }
}

// Validate required environment variables
if (!process.env.PLASMO_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing PLASMO_PUBLIC_SUPABASE_URL environment variable")
}

if (!process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing PLASMO_PUBLIC_SUPABASE_ANON_KEY environment variable"
  )
}

// Create and export the Supabase client
export const supabase = createClient(
  process.env.PLASMO_PUBLIC_SUPABASE_URL,
  process.env.PLASMO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: customStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Log initialization in development mode
if (process.env.PLASMO_PUBLIC_DEV_MODE === "true") {
  console.log(
    "Supabase client initialized with URL:",
    process.env.PLASMO_PUBLIC_SUPABASE_URL
  )
}
