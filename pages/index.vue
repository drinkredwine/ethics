<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Kohlberg Assessment</h1>
          </div>
          <div class="flex items-center space-x-4">
            <LanguagePicker />
            <NuxtLink :to="localePath('/login')" class="text-gray-600 hover:text-gray-900">
              {{ $t('home.login') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/register')" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              {{ $t('home.getStarted') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">
          {{ $t('home.title') }}
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          {{ $t('home.subtitle') }}
        </p>
        <NuxtLink :to="localePath('/register')" class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          {{ $t('home.startButton') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Kohlberg's Theory Explanation -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('kohlberg.title') }}</h3>
        
        <div class="prose max-w-none">
          <p class="text-gray-700 mb-6">
            {{ $t('kohlberg.description') }}
          </p>

          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <!-- Preconventional Level -->
            <div class="border rounded-lg p-6">
              <h4 class="text-lg font-semibold text-indigo-600 mb-3">{{ $t('kohlberg.preconventional') }}</h4>
              <div class="space-y-3">
                <div class="border-l-4 border-red-400 pl-3">
                  <p class="font-medium">{{ $t('kohlberg.stage1') }}</p>
                  <p class="text-sm text-gray-600">{{ $t('kohlberg.stage1Desc') }}</p>
                </div>
                <div class="border-l-4 border-red-400 pl-3">
                  <p class="font-medium">{{ $t('kohlberg.stage2') }}</p>
                  <p class="text-sm text-gray-600">{{ $t('kohlberg.stage2Desc') }}</p>
                </div>
              </div>
            </div>

            <!-- Conventional Level -->
            <div class="border rounded-lg p-6">
              <h4 class="text-lg font-semibold text-blue-600 mb-3">{{ $t('kohlberg.conventional') }}</h4>
              <div class="space-y-3">
                <div class="border-l-4 border-blue-400 pl-3">
                  <p class="font-medium">{{ $t('kohlberg.stage3') }}</p>
                  <p class="text-sm text-gray-600">{{ $t('kohlberg.stage3Desc') }}</p>
                </div>
                <div class="border-l-4 border-blue-400 pl-3">
                  <p class="font-medium">{{ $t('kohlberg.stage4') }}</p>
                  <p class="text-sm text-gray-600">{{ $t('kohlberg.stage4Desc') }}</p>
                </div>
              </div>
            </div>

            <!-- Postconventional Level -->
            <div class="border rounded-lg p-6">
              <h4 class="text-lg font-semibold text-green-600 mb-3">{{ $t('kohlberg.postconventional') }}</h4>
              <div class="space-y-3">
                <div class="border-l-4 border-green-400 pl-3">
                  <p class="font-medium">{{ $t('kohlberg.stage5') }}</p>
                  <p class="text-sm text-gray-600">{{ $t('kohlberg.stage5Desc') }}</p>
                </div>
                <div class="border-l-4 border-green-400 pl-3">
                  <p class="font-medium">{{ $t('kohlberg.stage6') }}</p>
                  <p class="text-sm text-gray-600">{{ $t('kohlberg.stage6Desc') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-indigo-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-indigo-800 mb-3">{{ $t('kohlberg.aiWorksTitle') }}</h4>
            <ul class="text-gray-700 space-y-2">
              <li>{{ $t('kohlberg.aiWorks1') }}</li>
              <li>{{ $t('kohlberg.aiWorks2') }}</li>
              <li>{{ $t('kohlberg.aiWorks3') }}</li>
              <li>{{ $t('kohlberg.aiWorks4') }}</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink :to="localePath('/register')" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            {{ $t('kohlberg.beginButton') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

useHead({
  title: t('home.title'),
  meta: [
    { name: 'description', content: t('home.subtitle') }
  ]
})
</script>