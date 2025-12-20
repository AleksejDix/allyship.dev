// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  modules: ["@nuxtjs/supabase", "@nuxtjs/tailwindcss"],
  devtools: { enabled: true },
  tailwindcss: {
    exposeConfig: true,
    viewer: false,
    // and more...
  },
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
