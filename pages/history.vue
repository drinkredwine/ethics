<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-gray-900">Assessment History</h1>
            <div class="flex space-x-4">
              <NuxtLink to="/assessment" class="text-gray-600 hover:text-gray-900">New Assessment</NuxtLink>
              <NuxtLink to="/history" class="text-indigo-600 font-medium">History</NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span v-if="profile" class="text-gray-600">{{ profile.email }}</span>
            <button @click="logout" class="text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- User Profile Summary -->
      <div v-if="profile" class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Your Moral Development Journey</h2>
            <p class="text-gray-600 mt-1">Track your progress through Kohlberg's stages</p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-bold text-indigo-600">{{ profile.total_assessments || 0 }}</div>
            <div class="text-sm text-gray-500">Total Assessments</div>
            <div v-if="profile.current_stage" class="mt-2">
              <div class="text-lg font-semibold text-gray-700">Current Stage: {{ profile.current_stage }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assessment History -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <div v-else-if="assessments.length === 0" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="text-gray-500 mb-4">
          <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Assessments Yet</h3>
        <p class="text-gray-600 mb-6">Take your first assessment to begin your moral development journey.</p>
        <NuxtLink to="/assessment" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Start Your First Assessment
        </NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="assessment in assessments"
          :key="assessment.id"
          class="bg-white rounded-lg shadow-lg p-6"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span class="text-indigo-600 font-bold text-lg">{{ assessment.primary_stage }}</span>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Stage {{ assessment.primary_stage }} Assessment
                </h3>
                <p class="text-gray-600">{{ formatDate(assessment.completed_at) }}</p>
              </div>
            </div>
            <button
              @click="toggleDetails(assessment.id)"
              class="text-indigo-600 hover:text-indigo-500"
            >
              {{ expandedAssessments.includes(assessment.id) ? 'Hide Details' : 'View Details' }}
            </button>
          </div>

          <!-- Assessment Summary -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Primary Stage</div>
              <div class="text-2xl font-bold text-gray-900">Stage {{ assessment.primary_stage }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Responses</div>
              <div class="text-2xl font-bold text-gray-900">{{ assessment.responses?.length || 0 }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm text-gray-600">Completion</div>
              <div class="text-2xl font-bold text-green-600">100%</div>
            </div>
          </div>

          <!-- Detailed Results (Collapsible) -->
          <div v-if="expandedAssessments.includes(assessment.id)" class="border-t pt-6">
            <div class="space-y-6">
              <!-- AI Evaluation -->
              <div v-if="assessment.evaluation">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">AI Analysis</h4>
                <div class="space-y-4">
                  <div v-if="assessment.evaluation.stage" class="border-l-4 border-indigo-500 pl-4">
                    <h5 class="font-medium text-gray-900">Identified Stage</h5>
                    <div class="text-gray-700 prose max-w-none" v-html="assessment.evaluation.stage"></div>
                  </div>
                  <div v-if="assessment.evaluation.analysis" class="border-l-4 border-green-500 pl-4">
                    <h5 class="font-medium text-gray-900">Analysis</h5>
                    <div class="text-gray-700 prose max-w-none" v-html="assessment.evaluation.analysis"></div>
                  </div>
                  <div v-if="assessment.evaluation.recommendations" class="border-l-4 border-blue-500 pl-4">
                    <h5 class="font-medium text-gray-900">Recommendations</h5>
                    <div class="text-gray-700 prose max-w-none" v-html="assessment.evaluation.recommendations"></div>
                  </div>
                </div>
              </div>

              <!-- Response Details -->
              <div v-if="assessment.responses">
                <h4 class="text-lg font-semibold text-gray-900 mb-3">Your Responses</h4>
                <div class="space-y-4">
                  <div
                    v-for="(response, index) in assessment.responses"
                    :key="index"
                    class="bg-gray-50 rounded-lg p-4"
                  >
                    <div class="flex justify-between items-start mb-2">
                      <h5 class="font-medium text-gray-900">Question {{ index + 1 }}</h5>
                      <span class="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        Stage {{ response.stage }}
                      </span>
                    </div>
                    <p v-if="response.reasoning" class="text-gray-700 text-sm">
                      <strong>Your reasoning:</strong> {{ response.reasoning }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Note: Authentication is handled by global middleware

const assessments = ref([])
const profile = ref(null)
const loading = ref(true)
const expandedAssessments = ref([])

const loadAssessments = async () => {
  if (!user.value) return

  try {
    // Load user profile
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    
    profile.value = profileData

    // Load assessments
    const { data: assessmentData, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.value.id)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('Error loading assessments:', error)
      return
    }

    assessments.value = assessmentData || []
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const toggleDetails = (assessmentId) => {
  const index = expandedAssessments.value.indexOf(assessmentId)
  if (index > -1) {
    expandedAssessments.value.splice(index, 1)
  } else {
    expandedAssessments.value.push(assessmentId)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

// Load data when component mounts and user is available
watch(user, (newUser) => {
  if (newUser) {
    loadAssessments()
  }
}, { immediate: true })

useHead({
  title: 'Assessment History - Kohlberg Assessment'
})
</script>