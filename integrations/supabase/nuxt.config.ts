// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Force specific port for dev server
  devServer: {
    port: 3000
  },

  runtimeConfig: {
    // Private keys (server-only)
    supabaseClientId: process.env.SUPABASE_CLIENT_ID,
    supabaseClientSecret: process.env.SUPABASE_CLIENT_SECRET,

    // Public keys
    public: {
      supabaseOAuthUrl: 'https://api.supabase.com/v1/oauth',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  typescript: {
    strict: true,
    typeCheck: true
  }
})
