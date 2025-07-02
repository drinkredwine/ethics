import sk from '../locales/sk.json'
import en from '../locales/en.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'sk',
  fallbackLocale: 'sk',
  messages: {
    sk,
    en
  }
}))