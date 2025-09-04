<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-black bg-opacity-90 backdrop-blur-md border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-white">
              {{ $t("assessment.title") }}
            </h1>
            <div class="flex space-x-4">
              <NuxtLink
                :to="$localePath('/assessment')"
                class="text-indigo-400 font-medium"
                >{{ $t("nav.assessment") }}</NuxtLink
              >
              <NuxtLink
                :to="$localePath('/history')"
                class="text-gray-300 hover:text-white transition-colors"
                >{{ $t("nav.history") }}</NuxtLink
              >
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeSwitcher />
            <LanguagePicker />
            <span class="text-gray-300"
              >{{ $t("assessment.question") }} {{ currentQuestion + 1 }}
              {{ $t("assessment.of") }} 3
              <span class="ml-2 text-indigo-400 font-medium">
                • Session {{ sessionNumber }}
              </span>
            </span>
            <span v-if="user" class="text-gray-300">{{ user.email }}</span>
            <button @click="logout" class="text-gray-300 hover:text-white transition-colors">
              {{ $t("nav.logout") }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="bg-gray-200 rounded-full h-2">
          <div
            class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            :style="{
              width: `${
                scenarios?.length
                  ? (currentQuestion / scenarios.length) * 100
                  : 0
              }%`,
            }"
          ></div>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            {{ $t("assessment.complete") }}
          </h2>
          <div class="text-lg text-gray-600">
            {{ $t("assessment.session") }} {{ sessionNumber }} •
            {{ totalQuestionsAnswered }} {{ $t("assessment.questionsTotal") }}
          </div>
        </div>

        <div v-if="evaluation" class="space-y-6">
          <!-- Enhanced Results Header with Celebration -->
          <div
            class="text-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 relative overflow-hidden"
          >
            <!-- Celebration particles -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                v-for="i in 8"
                :key="i"
                class="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-ping"
                :style="{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '3s',
                }"
              ></div>
            </div>

            <!-- Animated stage badge -->
            <div class="relative mb-6">
              <div
                class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mb-4 shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <span class="text-3xl font-bold text-white">{{
                  primaryStage
                }}</span>
              </div>

              <!-- Pulsing ring around badge -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-24 h-24 border-2 border-indigo-300 rounded-full animate-ping opacity-50"
                ></div>
              </div>
            </div>

            <!-- Achievement notification -->
            <div
              class="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-2 rounded-full inline-block mb-4 shadow-lg"
            >
              <div class="flex items-center space-x-2">
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span class="font-semibold">Assessment Complete!</span>
              </div>
            </div>

            <h3 class="text-3xl font-bold text-gray-900 mb-4">
              {{ $t("assessment.stage") }}
            </h3>
            <div
              class="prose max-w-none mx-auto text-lg"
              v-html="renderMarkdown(evaluation.stage)"
            ></div>
          </div>

          <!-- Analysis Section (Always Visible First) -->
          <div
            class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500"
          >
            <div class="flex items-center mb-4">
              <div
                class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ $t("assessment.analysis") }}
              </h3>
            </div>
            <div
              class="prose max-w-none"
              v-html="renderMarkdown(evaluation.analysis)"
            ></div>
          </div>

          <!-- Progress Section (if available) -->
          <div
            v-if="previousAssessments.length > 0"
            class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-l-4 border-amber-500"
          >
            <div class="flex items-center mb-4">
              <div
                class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ $t("assessment.progress") || "Your Progress" }}
              </h3>
            </div>

            <!-- Progress Comparison -->
            <div class="mb-4">
              <div
                class="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200"
              >
                <div class="flex items-center space-x-4">
                  <div class="text-center">
                    <div class="text-sm text-gray-600">
                      {{ locale === "sk" ? "Predchádzajúce" : "Previous" }}
                    </div>
                    <div class="text-2xl font-bold text-gray-700">
                      {{ lastStage }}
                    </div>
                  </div>

                  <div class="flex flex-col items-center">
                    <div class="flex items-center space-x-2">
                      <svg
                        v-if="stageChange > 0"
                        class="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        ></path>
                      </svg>
                      <svg
                        v-else-if="stageChange < 0"
                        class="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17 13l-5 5m0 0l-5-5m5 5V6"
                        ></path>
                      </svg>
                      <svg
                        v-else
                        class="w-6 h-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 12h14"
                        ></path>
                      </svg>
                    </div>
                    <div
                      class="text-sm font-medium"
                      :class="{
                        'text-green-600': stageChange > 0,
                        'text-red-600': stageChange < 0,
                        'text-gray-500': stageChange === 0,
                      }"
                    >
                      {{
                        stageChange > 0
                          ? `+${stageChange}`
                          : stageChange === 0
                          ? "0"
                          : stageChange
                      }}
                    </div>
                  </div>

                  <div class="text-center">
                    <div class="text-sm text-gray-600">
                      {{ locale === "sk" ? "Súčasné" : "Current" }}
                    </div>
                    <div class="text-2xl font-bold text-indigo-600">
                      {{ primaryStage }}
                    </div>
                  </div>
                </div>

                <div class="text-right">
                  <div class="text-sm text-gray-600">
                    {{
                      locale === "sk" ? "Posledná analýza" : "Last assessment"
                    }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ lastAssessmentDate }}
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="evaluation.progress"
              class="prose max-w-none"
              v-html="renderMarkdown(evaluation.progress)"
            ></div>
          </div>

          <!-- Basic Recommendations -->
          <div
            class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500"
          >
            <div class="flex items-center mb-4">
              <div
                class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{
                  locale === "sk"
                    ? "Odporúčania na rast"
                    : "Growth Recommendations"
                }}
              </h3>
            </div>
            <div
              class="prose max-w-none"
              v-html="renderMarkdown(evaluation.recommendations)"
            ></div>
          </div>

          <!-- Premium Upgrade Offer -->
          <div
            class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 relative overflow-hidden"
          >
            <!-- Premium badge -->
            <div class="absolute top-4 right-4">
              <span
                class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ locale === "sk" ? "PRÉMIUM" : "PREMIUM" }}
              </span>
            </div>

            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <svg
                  class="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>

              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{
                    locale === "sk"
                      ? "Detailný plán osobného rozvoja"
                      : "Detailed Personal Development Plan"
                  }}
                </h3>
                <p class="text-gray-700 mb-4">
                  {{
                    locale === "sk"
                      ? "Získajte kompletnú analýzu s personalizovanými cvičeniami, dlhodobým plánom rozvoja a konkrétnymi krokmi pre pokrok do vyšších štádií morálneho vývoja."
                      : "Get a comprehensive analysis with personalized exercises, long-term development plan, and concrete steps for advancing to higher stages of moral development."
                  }}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span class="text-sm text-gray-700">
                      {{
                        locale === "sk"
                          ? "5-10 stránkový detailný report"
                          : "5-10 page detailed report"
                      }}
                    </span>
                  </div>

                  <div class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span class="text-sm text-gray-700">
                      {{
                        locale === "sk"
                          ? "Personalizované cvičenia"
                          : "Personalized exercises"
                      }}
                    </span>
                  </div>

                  <div class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span class="text-sm text-gray-700">
                      {{
                        locale === "sk"
                          ? "90-dňový plán rozvoja"
                          : "90-day development plan"
                      }}
                    </span>
                  </div>

                  <div class="flex items-start space-x-2">
                    <svg
                      class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span class="text-sm text-gray-700">
                      {{
                        locale === "sk"
                          ? "Konkrétne scenáre na precvičenie"
                          : "Specific practice scenarios"
                      }}
                    </span>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-2xl font-bold text-purple-600">$10</div>
                    <div class="text-sm text-gray-500">
                      {{
                        locale === "sk"
                          ? "jednorazová platba"
                          : "one-time payment"
                      }}
                    </div>
                  </div>

                  <button
                    @click="upgradeToPremium"
                    class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {{
                      locale === "sk"
                        ? "Získať prémium report"
                        : "Get Premium Report"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              v-if="canContinue"
              @click="continueAssessment"
              class="flex-1 bg-indigo-600 text-white text-center py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              {{
                $t("assessment.continue3More") ||
                "Continue with 3 More Questions"
              }}
            </button>
            <div
              v-else-if="showContinueOption && !canContinue"
              class="flex-1 bg-gray-100 text-gray-500 text-center py-3 px-6 rounded-lg border border-gray-300"
            >
              <div class="text-sm">
                {{
                  locale === "sk"
                    ? 'Vyčerpali ste všetky dostupné scenáre. Použite "Začať nové hodnotenie" pre opätovné testovanie.'
                    : 'You have completed all available scenarios. Use "Start New Assessment" to retake all scenarios.'
                }}
              </div>
            </div>
            <NuxtLink
              :to="$localePath('/history')"
              class="flex-1 bg-gray-100 text-gray-900 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {{ $t("assessment.viewHistory") || "View History" }}
            </NuxtLink>
            <button
              @click="startNewAssessment"
              class="flex-1 bg-amber-100 text-amber-800 text-center py-3 px-6 rounded-lg hover:bg-amber-200 transition-colors"
            >
              {{ $t("assessment.startNew") || "Start New Assessment" }}
            </button>
          </div>
        </div>

        <!-- Enhanced Loading Animation -->
        <div v-else class="py-12">
          <div class="max-w-md mx-auto">
            <!-- Advanced Brain Animation with Particles -->
            <div class="relative mb-8">
              <!-- Floating Particles -->
              <div class="absolute inset-0 overflow-hidden">
                <div
                  v-for="i in 6"
                  :key="i"
                  class="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-ping"
                  :style="{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: '2s',
                  }"
                ></div>
              </div>

              <!-- Central Brain -->
              <div class="w-28 h-28 mx-auto relative">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full animate-pulse"
                ></div>
                <div
                  class="absolute inset-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-12 h-12 text-indigo-600 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    ></path>
                  </svg>
                </div>

                <!-- Pulsing Rings -->
                <div
                  class="absolute inset-0 rounded-full border-2 border-indigo-300 animate-ping"
                  style="animation-duration: 1.5s"
                ></div>
                <div
                  class="absolute inset-2 rounded-full border-2 border-purple-300 animate-ping"
                  style="animation-duration: 2s; animation-delay: 0.3s"
                ></div>
              </div>

              <!-- Enhanced Thinking Dots -->
              <div class="flex justify-center space-x-2 mt-6">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-bounce shadow-lg"
                  :style="{
                    animationDelay: `${i * 150}ms`,
                    animationDuration: '1s',
                  }"
                ></div>
              </div>
            </div>

            <!-- Status Messages with Real Streaming Content -->
            <div class="text-center space-y-4">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ currentAffirmation }}
              </h3>

              <!-- Live Streaming Insights (Updated from API) -->
              <div
                class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-l-4 border-green-500 mb-4"
              >
                <div class="flex items-start space-x-3">
                  <div
                    class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  >
                    <svg
                      class="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-left">
                    <div class="font-semibold text-green-800 mb-1">
                      {{ streamingInsight.title }}
                    </div>
                    <div class="text-green-700 text-sm">
                      {{ streamingInsight.content }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Simple Progress Indicator -->
              <div class="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                <div class="text-sm font-medium text-gray-700 mb-3">
                  {{ $t("assessment.analyzing") }}
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-indigo-600 h-2 rounded-full animate-pulse"
                    style="width: 60%"
                  ></div>
                </div>
              </div>

              <!-- Time Indicator -->
              <div class="text-sm text-gray-600">
                {{
                  locale === "sk"
                    ? "Analýza môže trvať 30-60 sekúnd..."
                    : "Analysis may take 30-60 seconds..."
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Scenarios -->
      <div
        v-else-if="scenariosLoading"
        class="bg-white rounded-lg shadow-lg p-8"
      >
        <div class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4">
            <div
              class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"
            ></div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ $t("assessment.loadingScenarios") || "Načítavam scenáre..." }}
          </h3>
          <p class="text-gray-600">
            {{
              $t("assessment.preparingAssessment") ||
              "Pripravujem hodnotenie pre vás..."
            }}
          </p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ scenarios[currentQuestion]?.title }}
          </h2>
          <div class="prose max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg">
            <p class="text-base leading-relaxed">
              {{
                scenarios[currentQuestion]?.scenario ||
                scenarios[currentQuestion]?.description
              }}
            </p>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ $t("assessment.explainReasoning") }}
          </label>
          <textarea
            v-model="reasoning"
            rows="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            :placeholder="$t('assessment.reasoningPlaceholder')"
            required
          ></textarea>
          <div class="flex justify-between items-center mt-2">
            <div class="text-sm">
              <span class="text-gray-500">
                {{ responseStats.characters }} characters,
                {{ responseStats.words }} words
              </span>
              <span v-if="validationMessage" class="ml-2 text-amber-600">
                • {{ validationMessage }}
              </span>
            </div>
            <div
              v-if="isResponseValid"
              class="text-sm text-green-600 font-medium"
            >
              ✓ Good response length
            </div>
          </div>
        </div>

        <div class="flex justify-between">
          <button
            v-if="currentQuestion > 0"
            @click="previousQuestion"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {{ $t("assessment.previous") }}
          </button>
          <div v-else></div>

          <button
            @click="nextQuestion"
            :disabled="!isResponseValid"
            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{
              currentQuestion === scenarios?.length - 1
                ? $t("assessment.completeAssessment")
                : $t("assessment.next")
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get user and Supabase client
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const route = useRoute();

// Note: Authentication is handled by global middleware

// Get test configuration from query params
const testId = route.query.test || 'kohlberg_moral';
const variantId = route.query.variant || null;

// Test configuration
const testConfig = ref(null);
const currentTest = ref(null);

const currentQuestion = ref(0);
const reasoning = ref("");
const responses = ref([]);
const assessmentComplete = ref(false);
const evaluation = ref(null);
const currentStepIndex = ref(0);
const primaryStage = ref(null);

// New: Session and continuation tracking
const sessionNumber = ref(1);
const totalQuestionsAnswered = ref(0);
const canContinue = ref(false);
const showContinueOption = ref(false);
const previousAssessments = ref([]);
const usedScenarioIds = ref([]); // Track used scenarios to ensure uniqueness

const { t, locale } = useI18n();

// Validation for open-ended responses
const isResponseValid = computed(() => {
  const text = reasoning.value?.trim() || "";
  return text.length >= 50 && text.split(" ").length >= 10; // At least 50 chars and 10 words
});

const validationMessage = computed(() => {
  const text = reasoning.value?.trim() || "";
  const charCount = text.length;
  const wordCount = text.split(" ").filter((w) => w.length > 0).length;

  if (charCount === 0) {
    return "Please provide a response to continue.";
  } else if (charCount < 50) {
    return `Please provide at least ${
      50 - charCount
    } more characters for a detailed response.`;
  } else if (wordCount < 10) {
    return `Please provide at least ${
      10 - wordCount
    } more words for a meaningful analysis.`;
  }
  return "";
});

const responseStats = computed(() => {
  const text = reasoning.value?.trim() || "";
  return {
    characters: text.length,
    words: text.split(" ").filter((w) => w.length > 0).length,
  };
});

// Progress comparison computed properties
const lastStage = computed(() => {
  if (previousAssessments.value.length === 0) return null;
  return previousAssessments.value[0]?.primary_stage || "N/A";
});

const stageChange = computed(() => {
  if (previousAssessments.value.length === 0 || !primaryStage.value) return 0;
  const current = parseInt(primaryStage.value) || 0;
  const previous = parseInt(previousAssessments.value[0]?.primary_stage) || 0;
  return current - previous;
});

const lastAssessmentDate = computed(() => {
  if (previousAssessments.value.length === 0) return null;
  const date = new Date(previousAssessments.value[0]?.completed_at);
  return date.toLocaleDateString(locale.value === "sk" ? "sk-SK" : "en-US");
});

// Real-time streaming insights from API
const streamingInsight = ref({
  title: "Analyzujem vaše odpovede",
  content: "Vaše premyslené odpovede sa starostlivo analyzujú...",
});

const currentAffirmation = ref("Analyzujem morálne uvažovanie...");

const scenarios = ref([]);
const scenariosLoading = ref(true);

// Load previous assessments for progress tracking
const loadPreviousAssessments = async () => {
  if (!user.value) return;

  try {
    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", user.value.id)
      .order("completed_at", { ascending: false })
      .limit(5); // Last 5 assessments for progress tracking

    if (!error && data) {
      previousAssessments.value = data;
      console.log(
        `📊 Loaded ${data.length} previous assessments for progress tracking`
      );
    }
  } catch (error) {
    console.error("Error loading previous assessments:", error);
  }
};

// Load scenarios - now only 3 at a time
const loadScenarios = async () => {
  try {
    console.log("🔍 Current locale:", locale.value);

    // Test basic scenario access
    console.log("🔧 Testing basic scenario access:");
    console.log("  cheating.title:", t("scenarios.cheating.title"));
    console.log("  party.title:", t("scenarios.party.title"));
    console.log("  roommate.title:", t("scenarios.roommate.title"));

    // Get all scenario keys from the expanded library (24 scenarios including Kohlberg originals)
    const allScenarioKeys = [
      "cheating",
      "party",
      "roommate",
      "whistleblower",
      "medical_consent",
      "autonomous_vehicle",
      "refugee_crisis",
      "environmental_job",
      "ai_surveillance",
      "genetic_testing",
      "social_media_content",
      "clinical_trial",
      "drone_strike",
      "corporate_layoffs",
      "elderly_care",
      "student_plagiarism",
      "organ_donation",
      "data_privacy",
      "animal_testing",
      "minimum_wage",
      // Kohlberg's original research dilemmas
      "heinz_drug",
      "stolen_money",
      "joe_camp_money",
      "judy_louise_sisters",
    ];

    // Select 3 unique scenarios that haven't been used before
    const availableKeys = allScenarioKeys.filter(
      (key) => !usedScenarioIds.value.includes(key)
    );

    // If we've used most scenarios, reset to allow retaking
    if (availableKeys.length < 3) {
      console.log(
        "🔄 Resetting used scenarios - user can retake all assessments"
      );
      usedScenarioIds.value = [];
      availableKeys.push(...allScenarioKeys);
    }

    const selectedKeys = availableKeys
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Mark these scenarios as used
    usedScenarioIds.value.push(...selectedKeys);

    console.log(
      `🎯 Selected 3 scenarios for session ${sessionNumber.value}:`,
      selectedKeys
    );
    console.log(`📝 Used scenarios so far:`, usedScenarioIds.value);
    console.log(`🎲 Available scenarios remaining:`, availableKeys.length - 3);

    // Load scenarios from i18n store
    const loadedScenarios = [];

    console.log(`🔧 Attempting to load scenarios for locale: ${locale.value}`);
    console.log(`🔧 Selected keys:`, selectedKeys);

    for (const key of selectedKeys) {
      try {
        const title = t(`scenarios.${key}.title`);
        const scenario = t(`scenarios.${key}.scenario`);

        console.log(`🔧 Testing scenario ${key}:`);
        console.log(`   Title: "${title}"`);
        console.log(`   Scenario: "${scenario?.substring(0, 50)}..."`);
        console.log(
          `   Title starts with scenarios.: ${title.startsWith("scenarios.")}`
        );
        console.log(
          `   Scenario starts with scenarios.: ${scenario.startsWith(
            "scenarios."
          )}`
        );

        // Check if the translation exists
        if (
          title &&
          scenario &&
          !title.startsWith("scenarios.") &&
          !scenario.startsWith("scenarios.")
        ) {
          console.log(`✅ Loading scenario ${key}:`, title);

          loadedScenarios.push({
            id: key,
            title: title,
            scenario: scenario,
          });
        } else {
          console.warn(
            `⚠️ Scenario ${key} not found in locale translations, skipping`
          );
          console.warn(`   Title: "${title}"`);
          console.warn(`   Scenario: "${scenario?.substring(0, 100)}..."`);
        }
      } catch (error) {
        console.error(`Error loading scenario ${key}:`, error);
      }
    }

    // If we don't have enough scenarios, try again with different ones
    if (loadedScenarios.length < 3) {
      console.warn(
        `Only loaded ${loadedScenarios.length} scenarios, trying fallback method`
      );

      // Try the basic scenarios that we know exist
      const basicKeys = ["cheating", "party", "roommate"];

      for (const key of basicKeys) {
        if (loadedScenarios.find((s) => s.id === key)) continue; // Skip if already loaded

        try {
          const title = t(`scenarios.${key}.title`);
          const scenario = t(`scenarios.${key}.scenario`);

          if (
            title &&
            scenario &&
            !title.startsWith("scenarios.") &&
            !scenario.startsWith("scenarios.")
          ) {
            loadedScenarios.push({
              id: key,
              title: title,
              scenario: scenario,
            });

            if (loadedScenarios.length >= 3) break;
          }
        } catch (error) {
          console.error(`Error loading basic scenario ${key}:`, error);
        }
      }
    }

    scenarios.value = loadedScenarios;

    console.log(
      `✅ Loaded ${scenarios.value.length} scenarios for session ${sessionNumber.value}`
    );
    console.log(
      "🔍 Session scenarios:",
      scenarios.value.map((s) => s.title)
    );
  } catch (error) {
    console.error("💥 Error loading scenarios from locales:", error);
    scenarios.value = await loadFallbackScenarios();
  } finally {
    scenariosLoading.value = false;
  }
};

// Simple fallback scenarios function
const loadFallbackScenarios = async () => {
  console.warn("Using emergency fallback scenarios");
  return [
    {
      id: "fallback",
      title: "Assessment temporarily unavailable",
      scenario: "Please refresh the page to try again.",
    },
  ];
};

const nextQuestion = async () => {
  if (!isResponseValid.value) return;

  // Store response (now only open-ended text)
  responses.value.push({
    question: currentQuestion.value,
    scenarioId: scenarios.value[currentQuestion.value].id,
    scenarioTitle: scenarios.value[currentQuestion.value].title,
    reasoning: reasoning.value.trim(),
  });

  totalQuestionsAnswered.value++;

  // Complete assessment after 3 questions
  if (
    currentQuestion.value === 2 ||
    currentQuestion.value === scenarios.value.length - 1
  ) {
    // Complete this mini-assessment
    assessmentComplete.value = true;
    await evaluateResponses();
    await saveAssessmentToDatabase();

    // Show continue option after assessment only if there are more unique scenarios
    const allScenarioKeys = [
      "cheating",
      "party",
      "roommate",
      "whistleblower",
      "medical_consent",
      "autonomous_vehicle",
      "refugee_crisis",
      "environmental_job",
      "ai_surveillance",
      "genetic_testing",
      "social_media_content",
      "clinical_trial",
      "drone_strike",
      "corporate_layoffs",
      "elderly_care",
      "student_plagiarism",
      "organ_donation",
      "data_privacy",
      "animal_testing",
      "minimum_wage",
      // Kohlberg's original research dilemmas
      "heinz_drug",
      "stolen_money",
      "joe_camp_money",
      "judy_louise_sisters",
    ];
    const availableForNext = allScenarioKeys.filter(
      (key) => !usedScenarioIds.value.includes(key)
    );

    showContinueOption.value = true;
    canContinue.value = availableForNext.length >= 3;
  } else {
    // Next question
    currentQuestion.value++;
    reasoning.value = "";
  }
};

const continueAssessment = async () => {
  // Reset for next session
  sessionNumber.value++;
  currentQuestion.value = 0;
  reasoning.value = "";
  assessmentComplete.value = false;
  evaluation.value = null;
  showContinueOption.value = false;
  canContinue.value = false;
  responses.value = []; // Reset responses for new session

  // Load new scenarios (will automatically select unique ones)
  scenariosLoading.value = true;
  await loadScenarios();
};

const startNewAssessment = () => {
  // Complete reset for brand new assessment
  sessionNumber.value = 1;
  totalQuestionsAnswered.value = 0;
  currentQuestion.value = 0;
  reasoning.value = "";
  responses.value = [];
  assessmentComplete.value = false;
  evaluation.value = null;
  showContinueOption.value = false;
  canContinue.value = false;
  usedScenarioIds.value = []; // Reset used scenarios

  // Reload page to start fresh
  window.location.reload();
};

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--;
    const previousResponse = responses.value.pop();
    if (previousResponse) {
      reasoning.value = previousResponse.reasoning;
    }
  }
};

// Enhanced markdown rendering function
const renderMarkdown = (content) => {
  if (!content) return "";

  let formatted = content
    // Headers
    .replace(
      /^## (.*$)/gm,
      '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>'
    )
    .replace(
      /^### (.*$)/gm,
      '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>'
    )
    // Bold headers and text
    .replace(
      /\*\*(.*?):\*\*/g,
      '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">$1</h3>'
    )
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-gray-900">$1</strong>'
    )
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^- (.*$)/gm, '<li class="ml-2 mb-1 text-sm">• $1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, "<br>");

  // Wrap in paragraph if not already wrapped
  if (!formatted.startsWith("<h") && !formatted.startsWith("<li")) {
    formatted = `<p class="mb-3">${formatted}</p>`;
  }

  // Wrap lists in ul tags
  formatted = formatted.replace(
    /(<li class="ml-2 mb-1 text-sm">.*?<\/li>)/g,
    '<ul class="list-none mb-3 space-y-1">$1</ul>'
  );

  return formatted;
};

const startLoadingAnimation = () => {
  // Reset to initial state
  streamingInsight.value = {
    title:
      locale.value === "sk"
        ? "Analyzujem vaše odpovede"
        : "Analyzing Your Responses",
    content:
      locale.value === "sk"
        ? "Vaše premyslené odpovede sa starostlivo analyzujú..."
        : "Your thoughtful responses are being carefully analyzed...",
  };

  // Update affirmation
  currentAffirmation.value =
    locale.value === "sk"
      ? "Analyzujem morálne uvažovanie..."
      : "Analyzing your moral reasoning...";
};

const evaluateResponses = async () => {
  // Start loading animation
  startLoadingAnimation();

  const currentLocale = locale.value;
  const isSlovak = currentLocale === "sk";

  // Prepare previous assessments context for progress tracking
  const progressContext =
    previousAssessments.value.length > 0
      ? `\n\nPrevious assessments for progress comparison:
${previousAssessments.value
  .slice(0, 3)
  .map(
    (assessment, index) => `
Previous Assessment ${index + 1} (${new Date(
      assessment.completed_at
    ).toLocaleDateString()}):
Primary Stage: ${assessment.primary_stage}
Evaluation: ${assessment.evaluation?.stage || "Not available"}
`
  )
  .join("\n")}`
      : "\n\nThis is the user's first assessment - no previous data for comparison.";

  const context = isSlovak
    ? `Ste expert na morálny vývoj analyzujúci KRÁTKE hodnotenie (3 otázky) podľa Kohlberga.

SÚČASNÉ ODPOVEDE (Relácia ${sessionNumber.value}):
${responses.value
  .map(
    (r, i) => `
Scenár ${i + 1}: "${r.scenarioTitle}"
Odpoveď používateľa: "${r.reasoning}"
`
  )
  .join("\n")}

${progressContext}

POKYNY PRE ANALÝZU:
1. **PRIMÁRNE ŠTÁDIUM**: Analyzujte 3 odpovede a identifikujte dominantné štádium (1-6)
2. **DÔVERA**: Nízka/Stredná/Vysoká (len 3 otázky, takže obvykle Nízka/Stredná)
3. **POKROK**: Ak existujú predchádzajúce hodnotenia, komentujte pokrok alebo zmeny
4. **POVZBUDENIE**: Pozitívne a konštruktívne hodnotenie s konkrétnymi radami

ŠTÁDIÁ KOHLBERGA:
- Štádium 1: Vyhýbanie sa trestu (strach z následkov)
- Štádium 2: Vlastný záujem (čo z toho mám?)
- Štádium 3: Sociálne schválenie (čo si budú myslieť ostatní?)
- Štádium 4: Zákon a poriadok (pravidlá sú pravidlá)
- Štádium 5: Spoločenská zmluva (demokratické hodnoty, práva)
- Štádium 6: Univerzálne princípy (vyššie morálne zákony)

Formátujte odpoveď v slovenčine ako:
**Primárne štádium:** [číslo]

**Analýza:**
[krátka analýza 3 odpovedí bez opakovania nadpisu]

**Pokrok:**
[komentár o pokroku alebo prvé hodnotenie]

**Odporúčania:**
[povzbudivé a konkrétne rady bez opakovania nadpisu]

NEPOUŽÍVAJTE duplicitné nadpisy ako "Analýza:" v texte analýzy alebo "Odporúčania:" v texte odporúčaní.`
    : `You are a moral development expert analyzing a SHORT assessment (3 questions) based on Kohlberg's theory.

CURRENT RESPONSES (Session ${sessionNumber.value}):
${responses.value
  .map(
    (r, i) => `
Scenario ${i + 1}: "${r.scenarioTitle}"
User's response: "${r.reasoning}"
`
  )
  .join("\n")}

${progressContext}

ANALYSIS INSTRUCTIONS:
1. **PRIMARY STAGE**: Analyze the 3 responses and identify the dominant stage (1-6)
2. **CONFIDENCE**: Low/Medium/High (only 3 questions, so usually Low/Medium)
3. **PROGRESS**: If previous assessments exist, comment on progress or changes
4. **ENCOURAGEMENT**: Positive and constructive evaluation with specific advice

KOHLBERG'S STAGES:
- Stage 1: Punishment Avoidance (fear of consequences)
- Stage 2: Self-Interest (what's in it for me?)
- Stage 3: Social Approval (what will others think?)
- Stage 4: Law and Order (rules are rules)
- Stage 5: Social Contract (democratic values, rights)
- Stage 6: Universal Principles (higher moral laws)

Format as:
**Primary Stage:** [number]

**Analysis:**
[brief analysis of the 3 responses without repeating the header]

**Progress:**
[comment on progress or first assessment]

**Recommendations:**
[encouraging and specific advice without repeating the header]

DO NOT use duplicate headers like "Analysis:" in the analysis text or "Recommendations:" in the recommendations text.`;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Please analyze my 3-question moral development assessment.",
        context: context,
      }),
    });

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "content") {
              result += data.content;
            } else if (data.type === "insight") {
              // Update streaming insights in real-time
              streamingInsight.value = {
                title: data.title,
                content: data.content,
              };

              // Update affirmation with positive feedback
              currentAffirmation.value = data.title;
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }

    // Parse the result into sections and extract primary stage
    const lines = result.split("\n");
    let stageSection = "";
    let analysisSection = "";
    let recommendationsSection = "";
    let progressSection = "";
    let currentSection = "stage";

    for (const line of lines) {
      // Look for both ## and ** headers
      if (line.includes("**") || line.includes("#")) {
        if (
          line.toLowerCase().includes("progress") ||
          line.toLowerCase().includes("pokrok")
        ) {
          currentSection = "progress";
          continue; // Skip the header line
        } else if (
          line.toLowerCase().includes("recommend") ||
          line.toLowerCase().includes("odporúčan")
        ) {
          currentSection = "recommendations";
          continue; // Skip the header line
        } else if (
          line.toLowerCase().includes("analysis") ||
          line.toLowerCase().includes("analýz")
        ) {
          currentSection = "analysis";
          continue; // Skip the header line
        } else if (
          line.toLowerCase().includes("stage") ||
          line.toLowerCase().includes("štádium")
        ) {
          currentSection = "stage";
          // Include stage line as it contains the stage number
        }
      }

      // Skip lines that are just repetitive headers in content
      if (
        line.trim().toLowerCase() === "analýza:" ||
        line.trim().toLowerCase() === "analysis:" ||
        line.trim().toLowerCase() === "odporúčania:" ||
        line.trim().toLowerCase() === "recommendations:" ||
        line.trim().toLowerCase() === "pokrok:" ||
        line.trim().toLowerCase() === "progress:"
      ) {
        continue;
      }

      if (currentSection === "stage") stageSection += line + "\n";
      else if (currentSection === "progress") progressSection += line + "\n";
      else if (currentSection === "analysis") analysisSection += line + "\n";
      else if (currentSection === "recommendations")
        recommendationsSection += line + "\n";
    }

    // Extract primary stage number
    const stageMatch = result.match(/(?:štádium|stage):\s*(\d+)/i);
    primaryStage.value = stageMatch ? stageMatch[1] : "Unknown";

    evaluation.value = {
      stage: stageSection || result.slice(0, 500),
      analysis:
        analysisSection.trim() || "Analysis of moral reasoning patterns...",
      recommendations: recommendationsSection.trim() || result.slice(-1000),
      progress: progressSection.trim(),
      sessionNumber: sessionNumber.value,
      totalQuestions: totalQuestionsAnswered.value,
    };
  } catch (error) {
    console.error("Evaluation error:", error);
    evaluation.value = {
      stage: "Unable to analyze responses at this time.",
      analysis: "Please try again later.",
      recommendations: "Contact support if the issue persists.",
      progress: "No progress data available.",
      sessionNumber: sessionNumber.value,
      totalQuestions: totalQuestionsAnswered.value,
    };
  }
};

const saveAssessmentToDatabase = async () => {
  if (!user.value || !evaluation.value) return;

  try {
    const { error } = await supabase.from("assessments").insert({
      user_id: user.value.id,
      test_type_id: 'kohlberg_moral',
      responses: responses.value,
      evaluation: evaluation.value,
      primary_stage: parseInt(primaryStage.value) || 0,
      session_number: sessionNumber.value,
      questions_count: responses.value.length,
      assessment_type: "mini",
      completed_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving assessment:", error);
    } else {
      console.log(
        `✅ Saved mini-assessment session ${sessionNumber.value} with ${responses.value.length} questions`
      );
    }
  } catch (error) {
    console.error("Failed to save assessment:", error);
  }
};

const upgradeToPremium = () => {
  // For now, just show an alert. In production, this would integrate with Stripe
  alert(
    locale.value === "sk"
      ? "Prémium funkcia bude dostupná čoskoro! Zatiaľ pokračujte s ďalšími hodnoteniami pre lepšie výsledky."
      : "Premium feature coming soon! Continue with more assessments for better results in the meantime."
  );
};

const logout = async () => {
  await supabase.auth.signOut();
  await navigateTo("/");
};

// Initialize scenarios on component mount
onMounted(async () => {
  await loadPreviousAssessments();
  await loadScenarios();
});

useHead({
  title: t("assessment.title") + " - Kohlberg Assessment",
});
</script>
