// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxtjs/i18n'],
  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    public: {
      appName: 'Kohlberg Moral Development Assessment'
    }
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/assessment',
      exclude: ['/', '/login', '/register', '/debug']
    }
  },
  i18n: {
    locales: [
      { code: 'sk', iso: 'sk-SK', name: 'Slovenčina', file: 'sk.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' }
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'sk',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false
  },
  ssr: true
})
