import { readFileSync } from 'fs'
import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: {
    https: {
      key: readFileSync(resolve(__dirname, '.cert/key.pem'), 'utf-8'),
      cert: readFileSync(resolve(__dirname, '.cert/cert.pem'), 'utf-8')
    },
    port: 3001
  },

  runtimeConfig: {
    slackClientId: process.env.SLACK_CLIENT_ID,
    slackClientSecret: process.env.SLACK_CLIENT_SECRET,
    public: {
      appUrl: process.env.APP_URL || 'https://localhost:3001'
    }
  }
})
