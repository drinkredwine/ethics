// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    public: {
      appName: 'Kohlberg Moral Development Assessment',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/assessment',
      exclude: ['/']
    }
  },
  ssr: true
})
