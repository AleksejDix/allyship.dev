// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxtjs/supabase"],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/signin-password",
      callback: "/confirm",
      exclude: ["/signin-*", "/password/*", "/signout"],
    },
  },
})
