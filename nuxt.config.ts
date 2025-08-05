// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    compatibilityDate: '2025-08-02'
  },
  modules: [
    ['@primevue/nuxt-module', {
      options: {
        unstyled: true
      },
      importPT: { from: '~/assets/presets/mypreset' },
      components: {
        include: ['Toast']
      }
    }],
    '@unocss/nuxt',
    '@nuxtjs/eslint-module'
  ],
  css: [
    'primeicons/primeicons.css',
    '~/assets/css/main.css'
  ],
  build: {
    transpile: ['primevue']
  },
  runtimeConfig: {
    // Private keys are only available on the server
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    // Public keys that are exposed to the client
    public: {
      apiBase: '/api',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  },
  app: {
    head: {
      title: 'Smilegate Vietnam - Game Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Game Management System for Smilegate Vietnam' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})
