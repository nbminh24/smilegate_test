// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    nitro: {
        compatibilityDate: '2025-08-02'
    },
    modules: [
        '@primevue/nuxt-module',
        '@unocss/nuxt'
    ],
    primevue: {
        options: {
            unstyled: true
        },
                importPT: { from: '~/assets/presets/mypreset' },
        components: {
            include: ['Toast']
        }
    },
    css: [
        'primeicons/primeicons.css',
        '~/assets/css/main.css'
    ],
    build: {
        transpile: ['primevue']
    },
    runtimeConfig: {
        // Private keys are only available on the server
        // Public keys that are exposed to the client
        public: {
            apiBase: '/api'
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