<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink :to="$localePath('/')" class="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              ← Assessment Platform
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeSwitcher />
            <LanguagePicker />
            <span v-if="user" class="text-gray-600 dark:text-gray-300 hidden md:block">{{ user.email }}</span>
            <button @click="logout" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Tree of Self-Knowledge
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Every assessment you complete adds a new leaf to your personal growth journey. 
          Watch your tree flourish as you discover more about yourself.
        </p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Leaves Grown</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ completedTestsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tests</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalAvailableTests }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Growth Progress</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ Math.round(growthPercentage) }}%</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Tree Level</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ getTreeLevel() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tree of Self-Knowledge Visualization -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12 border border-gray-200 dark:border-gray-700">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Your Tree of Self-Knowledge</h2>
        
        <div class="relative flex justify-center items-end min-h-[400px] overflow-hidden">
          <!-- Tree Background -->
          <div class="absolute inset-0 bg-gradient-to-t from-green-50 dark:from-green-900/10 to-blue-50 dark:to-blue-900/10 rounded-xl"></div>
          
          <!-- Ground -->
          <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-100 dark:from-amber-900/20 to-transparent rounded-b-xl"></div>
          
          <!-- Tree Trunk -->
          <div class="relative z-10 mb-4">
            <div class="w-16 h-32 bg-gradient-to-t from-amber-800 dark:from-amber-700 to-amber-600 dark:to-amber-500 rounded-t-3xl mx-auto shadow-lg"></div>
            
            <!-- Tree Crown Base -->
            <div class="relative -mt-8">
              <!-- Main Crown -->
              <div class="w-64 h-64 bg-gradient-to-br from-green-400 dark:from-green-500 to-green-600 dark:to-green-700 rounded-full opacity-80 shadow-xl"></div>
              
              <!-- Secondary Crowns for bigger trees -->
              <div v-if="completedTestsCount > 5" class="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-green-300 dark:from-green-400 to-green-500 dark:to-green-600 rounded-full opacity-70 shadow-lg"></div>
              <div v-if="completedTestsCount > 10" class="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-300 dark:from-green-400 to-green-500 dark:to-green-600 rounded-full opacity-60 shadow-lg"></div>
              <div v-if="completedTestsCount > 15" class="absolute -top-8 -left-24 w-32 h-32 bg-gradient-to-br from-green-400 dark:from-green-500 to-green-600 dark:to-green-700 rounded-full opacity-50 shadow-md"></div>
              
              <!-- Leaves for each completed test -->
              <div 
                v-for="(result, index) in userTestResults.slice(0, 20)" 
                :key="result.id"
                class="absolute leaf cursor-pointer transform transition-all duration-300 hover:scale-110"
                :style="getLeafPosition(index)"
                @click="showTestDetail(result)"
                :title="getTestName(result.test_type_id)"
              >
                <div 
                  class="w-8 h-8 rounded-full shadow-lg border-2 border-white dark:border-gray-700 flex items-center justify-center text-white text-xs font-bold"
                  :class="getLeafColor(result.test_type_id)"
                >
                  {{ getTestIcon(result.test_type_id) }}
                </div>
              </div>
              
              <!-- Sparkling effects for recent tests -->
              <div 
                v-for="(sparkle, index) in recentTestSparkles" 
                :key="`sparkle-${index}`"
                class="absolute animate-ping"
                :style="sparkle.style"
              >
                <div class="w-2 h-2 bg-yellow-400 rounded-full opacity-75"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tree Growth Message -->
        <div class="text-center mt-8">
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">{{ getTreeMessage() }}</p>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mx-auto max-w-md">
            <div 
              class="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
              :style="{ width: growthPercentage + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ completedTestsCount }} / {{ totalAvailableTests }} assessments completed
          </p>
        </div>
      </div>

      <!-- Assessment Categories Dashboard -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <!-- Completed Assessments -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Your Assessment Journey</h3>
            <span class="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
              {{ completedTestsCount }} Completed
            </span>
          </div>

          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div 
              v-for="result in sortedTestResults" 
              :key="result.id"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              @click="showTestDetail(result)"
            >
              <div class="flex items-center space-x-4">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  :class="getLeafColor(result.test_type_id)"
                >
                  {{ getTestIcon(result.test_type_id) }}
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ getTestName(result.test_type_id) }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(result.completed_at) }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ getResultScore(result) }}</span>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Next Steps -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">Grow Your Tree</h3>
            <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full">
              {{ remainingTestsCount }} Remaining
            </span>
          </div>

          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div 
              v-for="test in recommendedTests" 
              :key="test.id"
              class="group flex items-center justify-between p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all cursor-pointer"
              @click="startTest(test.id)"
            >
              <div class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ getTestIcon(test.id) }}
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">{{ test.name }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ test.estimated_duration_minutes }} minutes • {{ test.question_count }} questions</p>
                </div>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assessment Categories Progress -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Progress by Category</h3>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="category in categoryProgress" :key="category.name" class="text-center">
            <div class="relative w-24 h-24 mx-auto mb-4">
              <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  class="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  stroke-width="8"
                  fill="transparent"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - (category.progress / 100) * circumference"
                  :class="category.color"
                  class="transition-all duration-1000 ease-out"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-lg font-bold text-gray-900 dark:text-white">{{ Math.round(category.progress) }}%</span>
              </div>
            </div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ category.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ category.completed }}/{{ category.total }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Detail Modal -->
    <div v-if="selectedTestDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click="closeTestDetail">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" @click.stop>
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ getTestName(selectedTestDetail.test_type_id) }}</h3>
            <button @click="closeTestDetail" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span class="font-medium text-gray-900 dark:text-white">Completed:</span>
              <span class="text-gray-600 dark:text-gray-400">{{ formatDate(selectedTestDetail.completed_at) }}</span>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span class="font-medium text-gray-900 dark:text-white">Result:</span>
              <span class="text-gray-600 dark:text-gray-400">{{ getResultScore(selectedTestDetail) }}</span>
            </div>
            
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p class="text-sm text-blue-800 dark:text-blue-300">
                {{ getTestDescription(selectedTestDetail.test_type_id) }}
              </p>
            </div>
            
            <div class="flex space-x-4 pt-4">
              <button 
                @click="retakeTest(selectedTestDetail.test_type_id)"
                class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Retake Assessment
              </button>
              <button 
                @click="closeTestDetail"
                class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const selectedTestDetail = ref(null)

// Reactive data
const userTestResults = ref([])

// All available tests (from the tests-tasks.md file)
const allAvailableTests = [
  // Priority 1
  { id: 'personal_motivation', name: 'Personal Motivations Assessment', category: 'motivation', description: 'Deep dive into your fundamental motivational drivers and patterns', estimated_duration_minutes: 20, question_count: 25 },
  { id: 'change_readiness', name: 'Change Readiness Assessment', category: 'motivation', description: 'Evaluate your present life situation and readiness for transformation', estimated_duration_minutes: 15, question_count: 20 },
  { id: 'excellence_mindset', name: 'Excellence Orientation', category: 'values_mindsets', description: 'Assess your commitment to excellence and continuous improvement', estimated_duration_minutes: 20, question_count: 26 },
  { id: 'engagement_commitment', name: 'Engagement & Commitment', category: 'values_mindsets', description: 'Measure your level of engagement and commitment to causes', estimated_duration_minutes: 18, question_count: 24 },
  
  // Priority 2
  { id: 'team_leadership', name: 'Team Leadership Assessment', category: 'knowledge', description: 'Comprehensive evaluation of team leadership capabilities', estimated_duration_minutes: 30, question_count: 40 },
  { id: 'character_assessment', name: 'Character & Integrity Assessment', category: 'values_mindsets', description: 'Evaluate character development and ethical decision-making', estimated_duration_minutes: 25, question_count: 32 },
  { id: 'entrepreneurship', name: 'Entrepreneurial Mindset', category: 'values_mindsets', description: 'Assess entrepreneurial thinking and opportunity recognition', estimated_duration_minutes: 25, question_count: 30 },
  { id: 'collaboration_skills', name: 'Collaboration Excellence', category: 'skills_strengths', description: 'Evaluate teamwork and collaborative leadership skills', estimated_duration_minutes: 22, question_count: 28 },
  
  // Priority 3
  { id: 'change_management', name: 'Change Management Mastery', category: 'knowledge', description: 'Skills in leading organizational transformation', estimated_duration_minutes: 25, question_count: 35 },
  { id: 'strengths_finder', name: 'Strengths Profile Assessment', category: 'skills_strengths', description: 'Identify your top natural talents and strengths', estimated_duration_minutes: 30, question_count: 45 },
  { id: 'critical_thinking', name: 'Critical Thinking Assessment', category: 'skills_strengths', description: 'Evaluate analytical and logical reasoning abilities', estimated_duration_minutes: 35, question_count: 30 },
  { id: 'creativity_assessment', name: 'Creativity & Innovation Assessment', category: 'skills_strengths', description: 'Measure creative thinking and innovation potential', estimated_duration_minutes: 30, question_count: 25 },
  { id: 'org_culture_preference', name: 'Organizational Culture Fit', category: 'values_mindsets', description: 'Identify preferred organizational culture types', estimated_duration_minutes: 25, question_count: 35 },
  
  // Priority 4
  { id: 'via_values', name: 'Values in Action (VIA) Survey', category: 'values_mindsets', description: 'Comprehensive assessment of 24 character strengths', estimated_duration_minutes: 45, question_count: 120 },
  { id: 'kegan_stages', name: 'Adult Development Stages (Kegan)', category: 'values_mindsets', description: 'Assess stage of adult psychological development', estimated_duration_minutes: 30, question_count: 28 },
  { id: 'implicit_bias', name: 'Implicit Bias Awareness', category: 'values_mindsets', description: 'Explore unconscious biases and develop awareness', estimated_duration_minutes: 35, question_count: 40 },

  // Existing tests
  { id: 'kohlberg_moral', name: 'Kohlberg Moral Development', category: 'values_mindsets', description: 'AI-powered analysis of ethical reasoning', estimated_duration_minutes: 30, question_count: 10 },
  { id: 'big_five_personality', name: 'Big Five Personality', category: 'skills_strengths', description: 'Comprehensive personality assessment', estimated_duration_minutes: 15, question_count: 50 },
  { id: 'communication_skills', name: 'Communication Skills', category: 'skills_strengths', description: 'Scenario-based communication evaluation', estimated_duration_minutes: 20, question_count: 25 },
  { id: 'project_management', name: 'Project Management', category: 'knowledge', description: 'Competency-based management assessment', estimated_duration_minutes: 25, question_count: 30 }
]

// Computed properties
const completedTestsCount = computed(() => userTestResults.value.length)
const totalAvailableTests = computed(() => allAvailableTests.length)
const remainingTestsCount = computed(() => totalAvailableTests.value - completedTestsCount.value)
const growthPercentage = computed(() => (completedTestsCount.value / totalAvailableTests.value) * 100)

const sortedTestResults = computed(() => {
  return [...userTestResults.value].sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
})

const recommendedTests = computed(() => {
  const completedTestIds = new Set(userTestResults.value.map(r => r.test_type_id))
  return allAvailableTests.filter(test => !completedTestIds.has(test.id)).slice(0, 6)
})

const recentTestSparkles = computed(() => {
  const recent = userTestResults.value.filter(test => {
    const testDate = new Date(test.completed_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return testDate > weekAgo
  })
  
  return recent.slice(0, 3).map((_, index) => ({
    style: {
      top: Math.random() * 200 + 'px',
      left: Math.random() * 200 + 'px'
    }
  }))
})

const categoryProgress = computed(() => {
  const categories = {
    'motivation': { name: 'Motivation', color: 'text-green-500', completed: 0, total: 0 },
    'knowledge': { name: 'Knowledge', color: 'text-blue-500', completed: 0, total: 0 },
    'skills_strengths': { name: 'Skills & Strengths', color: 'text-purple-500', completed: 0, total: 0 },
    'values_mindsets': { name: 'Values & Mindsets', color: 'text-orange-500', completed: 0, total: 0 }
  }
  
  const completedTestIds = new Set(userTestResults.value.map(r => r.test_type_id))
  
  allAvailableTests.forEach(test => {
    if (categories[test.category]) {
      categories[test.category].total++
      if (completedTestIds.has(test.id)) {
        categories[test.category].completed++
      }
    }
  })
  
  return Object.values(categories).map(cat => ({
    ...cat,
    progress: cat.total > 0 ? (cat.completed / cat.total) * 100 : 0
  }))
})

const circumference = 2 * Math.PI * 40 // for progress circles

// Helper functions
const getTreeLevel = () => {
  const count = completedTestsCount.value
  if (count === 0) return 'Seedling'
  if (count < 5) return 'Sprout'
  if (count < 10) return 'Young Tree'
  if (count < 15) return 'Growing Tree'
  if (count < 20) return 'Mature Tree'
  return 'Ancient Tree'
}

const getTreeMessage = () => {
  const count = completedTestsCount.value
  if (count === 0) return 'Plant your first seed of self-knowledge'
  if (count < 5) return 'Your tree is beginning to sprout new leaves'
  if (count < 10) return 'Watch your tree grow with each new insight'
  if (count < 15) return 'Your tree is flourishing with wisdom'
  if (count < 20) return 'You have cultivated a magnificent tree of knowledge'
  return 'Your ancient tree stands as a testament to your self-discovery journey'
}

const getLeafPosition = (index) => {
  // Create organic-looking positioning for leaves
  const angles = [
    { top: '10%', left: '30%' }, { top: '15%', left: '70%' }, { top: '25%', left: '20%' },
    { top: '30%', left: '80%' }, { top: '35%', left: '15%' }, { top: '40%', left: '75%' },
    { top: '20%', left: '50%' }, { top: '45%', left: '40%' }, { top: '50%', left: '60%' },
    { top: '55%', left: '25%' }, { top: '60%', left: '70%' }, { top: '25%', left: '85%' },
    { top: '65%', left: '45%' }, { top: '70%', left: '30%' }, { top: '75%', left: '65%' },
    { top: '35%', left: '5%' }, { top: '80%', left: '50%' }, { top: '45%', left: '90%' },
    { top: '85%', left: '35%' }, { top: '90%', left: '70%' }
  ]
  
  return angles[index % angles.length]
}

const getLeafColor = (testTypeId) => {
  const colors = {
    'personal_motivation': 'bg-emerald-500',
    'change_readiness': 'bg-teal-500', 
    'excellence_mindset': 'bg-cyan-500',
    'engagement_commitment': 'bg-sky-500',
    'team_leadership': 'bg-blue-500',
    'character_assessment': 'bg-indigo-500',
    'entrepreneurship': 'bg-purple-500',
    'collaboration_skills': 'bg-violet-500',
    'change_management': 'bg-fuchsia-500',
    'strengths_finder': 'bg-pink-500',
    'critical_thinking': 'bg-rose-500',
    'creativity_assessment': 'bg-orange-500',
    'org_culture_preference': 'bg-amber-500',
    'via_values': 'bg-yellow-500',
    'kegan_stages': 'bg-lime-500',
    'implicit_bias': 'bg-green-500',
    'kohlberg_moral': 'bg-red-500',
    'big_five_personality': 'bg-slate-500',
    'communication_skills': 'bg-zinc-500',
    'project_management': 'bg-stone-500'
  }
  
  return colors[testTypeId] || 'bg-gray-500'
}

const getTestIcon = (testId) => {
  const icons = {
    'personal_motivation': '🎯',
    'change_readiness': '🔄',
    'excellence_mindset': '⭐',
    'engagement_commitment': '💪',
    'team_leadership': '👥',
    'character_assessment': '🛡️',
    'entrepreneurship': '🚀',
    'collaboration_skills': '🤝',
    'change_management': '📈',
    'strengths_finder': '💎',
    'critical_thinking': '🧠',
    'creativity_assessment': '🎨',
    'org_culture_preference': '🏢',
    'via_values': '🌟',
    'kegan_stages': '🌱',
    'implicit_bias': '👁️',
    'kohlberg_moral': '⚖️',
    'big_five_personality': '🌈',
    'communication_skills': '💬',
    'project_management': '📋'
  }
  
  return icons[testId] || '📊'
}

const getTestName = (testId) => {
  const test = allAvailableTests.find(t => t.id === testId)
  return test ? test.name : testId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getTestDescription = (testId) => {
  const test = allAvailableTests.find(t => t.id === testId)
  return test ? test.description : 'Assessment description not available'
}

const getResultScore = (result) => {
  if (result.test_type_id === 'kohlberg_moral') {
    return `Stage ${result.evaluation?.primary_stage || 'N/A'}`
  }
  if (result.evaluation?.overallScore) {
    return `${Math.round(result.evaluation.overallScore)}%`
  }
  if (result.evaluation?.primaryStage) {
    return result.evaluation.primaryStage.name || 'Completed'
  }
  if (result.evaluation?.strengthScores) {
    return `${result.evaluation.strengthScores.length} strengths identified`
  }
  if (result.evaluation?.overallLevel) {
    return result.evaluation.overallLevel
  }
  return 'Completed'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const showTestDetail = (result) => {
  selectedTestDetail.value = result
}

const closeTestDetail = () => {
  selectedTestDetail.value = null
}

const startTest = (testId) => {
  const testRoutes = {
    'personal_motivation': '/personal-motivation',
    'change_readiness': '/change-readiness',
    'excellence_mindset': '/excellence-mindset',
    'engagement_commitment': '/engagement-commitment',
    'team_leadership': '/team-leadership',
    'character_assessment': '/character-assessment',
    'entrepreneurship': '/entrepreneurship',
    'collaboration_skills': '/collaboration-skills',
    'change_management': '/change-management',
    'strengths_finder': '/strengths-profile',
    'critical_thinking': '/critical-thinking',
    'creativity_assessment': '/creativity-innovation',
    'org_culture_preference': '/culture-fit',
    'via_values': '/via-values',
    'kegan_stages': '/kegan-stages',
    'implicit_bias': '/implicit-bias',
    'kohlberg_moral': '/assessment?test=kohlberg_moral',
    'big_five_personality': '/big-five',
    'communication_skills': '/communication-skills',
    'project_management': '/project-management'
  }
  
  const route = testRoutes[testId] || `/assessment?test=${testId}`
  navigateTo(route)
}

const retakeTest = (testId) => {
  closeTestDetail()
  startTest(testId)
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

// Load user test results
const loadUserTestResults = async () => {
  if (!user.value) return
  
  try {
    const { data, error } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', user.value.id)
      .order('completed_at', { ascending: false })
    
    if (!error && data) {
      userTestResults.value = data
    }
  } catch (error) {
    console.error('Error loading user test results:', error)
  }
}

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  } else {
    loadUserTestResults()
  }
})

useHead({
  title: 'Your Tree of Self-Knowledge - Profile Dashboard',
  meta: [
    { name: 'description', content: 'Track your assessment journey and watch your tree of self-knowledge grow with every completed test.' }
  ]
})
</script>

<style scoped>
.leaf {
  animation: leafSway 3s ease-in-out infinite;
}

.leaf:nth-child(even) {
  animation-delay: -1.5s;
}

@keyframes leafSway {
  0%, 100% {
    transform: rotate(-2deg) translateY(0px);
  }
  50% {
    transform: rotate(2deg) translateY(-2px);
  }
}

/* Scrollbar styling for dark mode */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 9999px;
}

.dark .overflow-y-auto::-webkit-scrollbar-track {
  background-color: #374151;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #4b5563;
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: #6b7280;
}
</style>