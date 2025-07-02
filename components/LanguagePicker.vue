<template>
  <div class="relative">
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
    >
      <span class="text-sm font-medium">{{ currentLocale.name }}</span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': showDropdown }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="showDropdown"
      class="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50"
    >
      <div class="py-1">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLanguage(locale.code)"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          :class="{ 'bg-indigo-50 text-indigo-700': locale.code === $i18n.locale }"
        >
          <span class="text-lg">{{ locale.flag }}</span>
          <span>{{ locale.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n()
const localePath = useLocalePath()

const showDropdown = ref(false)

const availableLocales = computed(() => {
  return locales.value.map(loc => ({
    ...loc,
    flag: loc.code === 'sk' ? '🇸🇰' : '🇺🇸'
  }))
})

const currentLocale = computed(() => {
  return availableLocales.value.find(loc => loc.code === locale.value) || availableLocales.value[0]
})

const switchLanguage = async (newLocale) => {
  await navigateTo(switchLocalePath(newLocale))
  showDropdown.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showDropdown.value = false
    }
  })
})
</script>