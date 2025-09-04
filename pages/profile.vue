<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink :to="$localePath('/')" class="text-xl font-bold text-gray-900">
              Assessment Platform
            </NuxtLink>
            <h1 class="text-xl font-bold text-indigo-600">
              My Profile
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeSwitcher />
            <LanguagePicker />
            <span v-if="user" class="text-gray-300">{{ user.email }}</span>
            <button @click="logout" class="text-gray-300 hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-6">
              <div class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {{ getUserInitials() }}
              </div>
              <div>
                <h1 class="text-3xl font-bold text-gray-900">Your Assessment Profile</h1>
                <p class="text-gray-600 mt-1">
                  Member since {{ formatDate(user?.created_at) }}
                </p>
                <div class="flex items-center space-x-4 mt-2">
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ totalAssessments }} assessments completed
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    {{ completionRate }}% profile completion
                  </div>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500 mb-1">Profile Score</div>
              <div class="text-4xl font-bold text-indigo-600">{{ profileScore }}</div>
              <div class="text-sm text-indigo-500">out of 100</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assessment Results Grid -->
      <div class="grid lg:grid-cols-2 gap-8 mb-8">
        <!-- Values Assessment -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                ⚖️
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Values & Ethics</h3>
                <p class="text-gray-600 text-sm">Your moral reasoning profile</p>
              </div>
            </div>
            <div v-if="kohlbergResult" class="text-right">
              <div class="text-2xl font-bold text-blue-600">Stage {{ kohlbergResult.primary_stage }}</div>
              <div class="text-sm text-gray-500">{{ formatDate(kohlbergResult.completed_at) }}</div>
            </div>
          </div>

          <div v-if="kohlbergResult" class="space-y-4">
            <!-- Kohlberg Stage Progress -->
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-blue-800">{{ getStageName(kohlbergResult.primary_stage) }}</span>
                <span class="text-sm text-blue-600">{{ kohlbergResult.assessment_count }} assessment(s)</span>
              </div>
              <div class="w-full bg-blue-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  :style="{ width: `${(kohlbergResult.primary_stage / 6) * 100}%` }"
                ></div>
              </div>
            </div>

            <div class="text-sm text-gray-600">
              {{ getStageDescription(kohlbergResult.primary_stage) }}
            </div>

            <NuxtLink 
              :to="$localePath('/test/kohlberg_moral')" 
              class="block w-full text-center bg-blue-100 text-blue-800 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              Retake Assessment
            </NuxtLink>
          </div>

          <div v-else class="text-center py-8">
            <div class="text-4xl mb-4 opacity-50">⚖️</div>
            <p class="text-gray-500 mb-4">No values assessment completed yet</p>
            <NuxtLink 
              :to="$localePath('/test/kohlberg_moral')" 
              class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Take Assessment
            </NuxtLink>
          </div>
        </div>

        <!-- Personality Assessment -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                🧭
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Personality</h3>
                <p class="text-gray-600 text-sm">Your Big Five personality profile</p>
              </div>
            </div>
            <div v-if="bigFiveResult" class="text-right">
              <div class="text-2xl font-bold text-purple-600">{{ getOverallPersonalityScore() }}%</div>
              <div class="text-sm text-gray-500">{{ formatDate(bigFiveResult.completed_at) }}</div>
            </div>
          </div>

          <div v-if="bigFiveResult" class="space-y-4">
            <!-- Big Five Dimensions -->
            <div class="space-y-3">
              <div 
                v-for="(dimension, key) in getPersonalityDimensions()"
                :key="key"
                class="bg-purple-50 rounded-lg p-3"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-purple-800">{{ dimension.name }}</span>
                  <span class="text-sm text-purple-600">{{ dimension.score }}%</span>
                </div>
                <div class="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    class="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: `${dimension.score}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <NuxtLink 
              :to="$localePath('/big-five')" 
              class="block w-full text-center bg-purple-100 text-purple-800 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
            >
              Retake Assessment
            </NuxtLink>
          </div>

          <div v-else class="text-center py-8">
            <div class="text-4xl mb-4 opacity-50">🧭</div>
            <p class="text-gray-500 mb-4">No personality assessment completed yet</p>
            <NuxtLink 
              :to="$localePath('/big-five')" 
              class="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Take Assessment
            </NuxtLink>
          </div>
        </div>

        <!-- Communication Skills -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                💬
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Communication Skills</h3>
                <p class="text-gray-600 text-sm">Professional communication abilities</p>
              </div>
            </div>
            <div v-if="communicationResult" class="text-right">
              <div class="text-2xl font-bold text-green-600">{{ getCommunicationScore() }}%</div>
              <div class="text-sm text-gray-500">{{ formatDate(communicationResult.completed_at) }}</div>
            </div>
          </div>

          <div v-if="communicationResult" class="space-y-4">
            <!-- Communication Skill Areas -->
            <div class="space-y-3">
              <div 
                v-for="(skill, key) in getCommunicationSkills()"
                :key="key"
                class="bg-green-50 rounded-lg p-3"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-green-800">{{ skill.name }}</span>
                  <span class="text-sm text-green-600">{{ skill.score }}%</span>
                </div>
                <div class="w-full bg-green-200 rounded-full h-2">
                  <div 
                    class="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: `${skill.score}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <NuxtLink 
              :to="$localePath('/communication-skills')" 
              class="block w-full text-center bg-green-100 text-green-800 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
            >
              Retake Assessment
            </NuxtLink>
          </div>

          <div v-else class="text-center py-8">
            <div class="text-4xl mb-4 opacity-50">💬</div>
            <p class="text-gray-500 mb-4">No communication skills assessment completed yet</p>
            <NuxtLink 
              :to="$localePath('/communication-skills')" 
              class="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Take Assessment
            </NuxtLink>
          </div>
        </div>

        <!-- Project Management Skills -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                🚀
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Project Management</h3>
                <p class="text-gray-600 text-sm">Leadership and management competencies</p>
              </div>
            </div>
            <div v-if="projectManagementResult" class="text-right">
              <div class="text-2xl font-bold text-orange-600">{{ getProjectManagementScore() }}%</div>
              <div class="text-sm text-gray-500">{{ formatDate(projectManagementResult.completed_at) }}</div>
            </div>
          </div>

          <div v-if="projectManagementResult" class="space-y-4">
            <!-- PM Competency Areas -->
            <div class="space-y-3">
              <div 
                v-for="(competency, key) in getProjectManagementCompetencies()"
                :key="key"
                class="bg-orange-50 rounded-lg p-3"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-orange-800">{{ competency.name }}</span>
                  <span class="text-sm text-orange-600">{{ competency.score }}%</span>
                </div>
                <div class="w-full bg-orange-200 rounded-full h-2">
                  <div 
                    class="bg-orange-600 h-2 rounded-full transition-all duration-1000"
                    :style="{ width: `${competency.score}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <NuxtLink 
              :to="$localePath('/project-management')" 
              class="block w-full text-center bg-orange-100 text-orange-800 py-2 px-4 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
            >
              Retake Assessment
            </NuxtLink>
          </div>

          <div v-else class="text-center py-8">
            <div class="text-4xl mb-4 opacity-50">🚀</div>
            <p class="text-gray-500 mb-4">No project management assessment completed yet</p>
            <NuxtLink 
              :to="$localePath('/project-management')" 
              class="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Take Assessment
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Assessment Platform Overview -->
      <div class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-6">📊 Assessment Platform Overview</h3>
        
        <div class="grid md:grid-cols-5 gap-4 mb-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-400">{{ testStatistics.total }}</div>
            <div class="text-gray-300 text-sm">Total Tests</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-400">{{ testStatistics.implemented }}</div>
            <div class="text-gray-300 text-sm">Implemented</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-400">{{ testStatistics.completed }}</div>
            <div class="text-gray-300 text-sm">Completed</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-400">{{ testStatistics.available }}</div>
            <div class="text-gray-300 text-sm">Available</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-400">{{ testStatistics.nonImplemented }}</div>
            <div class="text-gray-300 text-sm">Coming Soon</div>
          </div>
        </div>

        <!-- Completion Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-300 mb-1">
            <span>Progress</span>
            <span>{{ Math.round((testStatistics.completed / testStatistics.implemented) * 100) }}% of implemented tests</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(testStatistics.completed / testStatistics.implemented) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- All Completed Tests -->
      <div v-if="completedTestsData.length > 0" class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-6">✅ Your Completed Assessments</h3>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div 
            v-for="test in completedTestsData" 
            :key="test.id"
            class="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <div class="text-2xl mr-3">{{ getTestIcon(test.id) }}</div>
                <div>
                  <div class="font-medium text-white">{{ test.name }}</div>
                  <div class="text-xs text-gray-400">{{ getCategoryDisplayName(test.category) }}</div>
                </div>
              </div>
              <div class="text-green-400 font-semibold">
                {{ getAssessmentScore(getUserResult(test.id)) }}
              </div>
            </div>
            <div class="text-sm text-gray-300 mb-2">{{ test.short_description }}</div>
            <div class="flex justify-between items-center text-xs text-gray-400">
              <span>{{ formatDate(getUserResult(test.id)?.last_taken_at) }}</span>
              <NuxtLink 
                :to="$localePath(`/test/${test.id}`)"
                class="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View Details
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Over Time -->
      <div v-if="totalAssessments > 0" class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
        <h3 class="text-xl font-bold text-white mb-6">📈 Recent Activity</h3>
        
        <div class="space-y-3">
          <div 
            v-for="assessment in recentAssessments" 
            :key="assessment.id"
            class="flex items-center justify-between p-3 bg-gray-700 bg-opacity-50 rounded-lg"
          >
            <div class="flex items-center">
              <div class="text-2xl mr-3">{{ getTestIcon(assessment.test_type_id) }}</div>
              <div>
                <div class="font-medium text-white">{{ getTestName(assessment.test_type_id) }}</div>
                <div class="text-sm text-gray-400">{{ formatDate(assessment.completed_at) }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold text-indigo-400">{{ getAssessmentScore(assessment) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommended Next Steps -->
      <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg text-white p-6">
        <h3 class="text-2xl font-bold mb-6 text-white">🎯 Recommended Next Steps</h3>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-lg font-semibold mb-4 text-white">📋 Tests to Take</h4>
            <div class="space-y-3">
              <div 
                v-for="recommendation in getTestRecommendations()"
                :key="recommendation.testId"
                class="bg-black bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="text-2xl mr-3">{{ recommendation.icon }}</div>
                    <div>
                      <div class="font-medium text-white">{{ recommendation.name }}</div>
                      <div class="text-sm text-white text-opacity-90">{{ recommendation.reason }}</div>
                    </div>
                  </div>
                  <NuxtLink 
                    :to="$localePath(`/test/${recommendation.testId}`)"
                    class="bg-white text-indigo-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    Start
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="text-lg font-semibold mb-4 text-white">🔄 Tests to Retake</h4>
            <div class="space-y-3">
              <div 
                v-for="retake in getRetakeRecommendations()"
                :key="retake.testId"
                class="bg-black bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-lg p-4 hover:bg-opacity-20 transition-all duration-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="text-2xl mr-3">{{ retake.icon }}</div>
                    <div>
                      <div class="font-medium text-white">{{ retake.name }}</div>
                      <div class="text-sm text-white text-opacity-90">{{ retake.reason }}</div>
                    </div>
                  </div>
                  <NuxtLink 
                    :to="retake.link"
                    class="bg-white text-indigo-700 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    Retake
                  </NuxtLink>
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

// Reactive data
const userTestResults = ref([])
const allAssessments = ref([])
const loading = ref(true)

// All available tests (synced with landing page)
const allTests = ref([
  // === EXISTING TESTS (keeping for compatibility) ===
  {
    id: 'kohlberg_moral',
    name: 'Kohlberg Moral Development',
    short_description: 'Discover your moral reasoning stage through ethical dilemmas',
    description: 'Assess your stage of moral reasoning based on Lawrence Kohlberg\'s theory of moral development',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['morals', 'ethics', 'development'],
    question_count: 3,
    estimated_duration_minutes: 15,
    evaluation_method: 'ai_analysis',
    popularity: 4,
    implemented: true
  },
  {
    id: 'big_five_personality',
    name: 'Big Five Personality (OCEAN)',
    short_description: 'Explore your personality across five key dimensions',
    description: 'Comprehensive personality assessment based on the five-factor model (OCEAN)',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['personality', 'traits', 'psychology'],
    question_count: 50,
    estimated_duration_minutes: 25,
    evaluation_method: 'multiple_choice',
    popularity: 5,
    implemented: true
  },
  {
    id: 'communication_skills',
    name: 'Communication Skills',
    short_description: 'Assess your communication effectiveness and style',
    description: 'Evaluate your communication effectiveness across different contexts and situations',
    category: 'skills_strengths',
    subcategory: '4cs',
    tags: ['communication', 'interpersonal', 'professional'],
    question_count: 30,
    estimated_duration_minutes: 20,
    evaluation_method: 'multiple_choice',
    popularity: 3,
    implemented: true
  },
  {
    id: 'project_management',
    name: 'Project Management',
    short_description: 'Measure your project leadership and management skills',
    description: 'Assess your project management skills and leadership capabilities',
    category: 'knowledge',
    subcategory: 'managerial',
    tags: ['management', 'leadership', 'planning'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'multiple_choice',
    popularity: 2,
    implemented: true
  },

  // === NEW MOTIVATION TESTS ===
  {
    id: 'personal_motivation',
    name: 'Personal Motivations Assessment',
    short_description: 'Discover what truly drives you: fears, passions, and core motivations',
    description: 'Deep dive into your fundamental motivational drivers, including fear-based and passion-driven behaviors',
    category: 'motivation',
    subcategory: 'personal_drivers',
    tags: ['motivation', 'passion', 'fear', 'self-awareness'],
    question_count: 25,
    estimated_duration_minutes: 20,
    evaluation_method: 'mixed',
    popularity: 4,
    implemented: false
  },
  {
    id: 'change_readiness',
    name: 'Change Readiness Assessment',
    short_description: 'Evaluate your current challenges and readiness for transformation',
    description: 'Assess your current life situation, challenges, and readiness to implement meaningful changes',
    category: 'motivation',
    subcategory: 'change_planning',
    tags: ['change', 'planning', 'readiness', 'transformation'],
    question_count: 20,
    estimated_duration_minutes: 15,
    evaluation_method: 'reflective',
    popularity: 3,
    implemented: false
  },

  // === NEW KNOWLEDGE TESTS ===
  {
    id: 'team_leadership',
    name: 'Team Leadership Assessment',
    short_description: 'Measure your effectiveness in leading and managing teams',
    description: 'Comprehensive evaluation of your team leadership skills, including motivation, delegation, and team dynamics',
    category: 'knowledge',
    subcategory: 'managerial',
    tags: ['leadership', 'teams', 'management', 'delegation'],
    question_count: 40,
    estimated_duration_minutes: 30,
    evaluation_method: 'scenario_based',
    popularity: 5,
    implemented: false
  },
  {
    id: 'change_management',
    name: 'Change Management Mastery',
    short_description: 'Assess your ability to drive and manage organizational change',
    description: 'Evaluate your skills in leading organizational transformation, overcoming resistance, and implementing change',
    category: 'knowledge',
    subcategory: 'managerial',
    tags: ['change management', 'transformation', 'leadership', 'strategy'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'case_study',
    popularity: 4,
    implemented: false
  },

  // === NEW SKILLS/STRENGTHS TESTS ===
  {
    id: 'strengths_finder',
    name: 'Strengths Profile Assessment',
    short_description: 'Identify your top strengths and natural talents',
    description: 'Discover your unique combination of talents and strengths, similar to StrengthsFinder methodology',
    category: 'skills_strengths',
    subcategory: 'strengths',
    tags: ['strengths', 'talents', 'natural abilities', 'excellence'],
    question_count: 45,
    estimated_duration_minutes: 30,
    evaluation_method: 'forced_choice',
    popularity: 5,
    implemented: false
  },
  {
    id: 'critical_thinking',
    name: 'Critical Thinking Assessment',
    short_description: 'Evaluate your analytical and logical reasoning abilities',
    description: 'Assess your critical thinking skills including analysis, evaluation, inference, and problem-solving',
    category: 'skills_strengths',
    subcategory: '4cs',
    tags: ['critical thinking', 'analysis', 'logic', 'reasoning'],
    question_count: 30,
    estimated_duration_minutes: 35,
    evaluation_method: 'problem_solving',
    popularity: 4,
    implemented: false
  },
  {
    id: 'creativity_assessment',
    name: 'Creativity & Innovation',
    short_description: 'Measure your creative thinking and innovation potential',
    description: 'Evaluate your creative problem-solving abilities, divergent thinking, and innovation mindset',
    category: 'skills_strengths',
    subcategory: '4cs',
    tags: ['creativity', 'innovation', 'divergent thinking', 'ideation'],
    question_count: 25,
    estimated_duration_minutes: 30,
    evaluation_method: 'creative_tasks',
    popularity: 3,
    implemented: false
  },
  {
    id: 'collaboration_skills',
    name: 'Collaboration Excellence',
    short_description: 'Assess your teamwork and collaborative leadership skills',
    description: 'Evaluate your ability to work effectively with others, facilitate cooperation, and build consensus',
    category: 'skills_strengths',
    subcategory: '4cs',
    tags: ['collaboration', 'teamwork', 'cooperation', 'consensus'],
    question_count: 28,
    estimated_duration_minutes: 22,
    evaluation_method: 'behavioral',
    popularity: 4,
    implemented: false
  },

  // === NEW VALUES & MINDSETS TESTS ===
  {
    id: 'character_assessment',
    name: 'Character & Integrity (Charakternosť)',
    short_description: 'Evaluate your character strength, moral courage, and integrity',
    description: 'Assess your character development including respect, moral courage, and ethical decision-making',
    category: 'values_mindsets',
    subcategory: '4es_chela',
    tags: ['character', 'integrity', 'moral courage', 'respect'],
    question_count: 32,
    estimated_duration_minutes: 25,
    evaluation_method: 'ethical_scenarios',
    popularity: 3,
    implemented: false
  },
  {
    id: 'excellence_mindset',
    name: 'Excellence Orientation',
    short_description: 'Measure your drive for excellence and continuous improvement',
    description: 'Assess your commitment to excellence, quality standards, and continuous improvement mindset',
    category: 'values_mindsets',
    subcategory: '4es_chela',
    tags: ['excellence', 'quality', 'improvement', 'standards'],
    question_count: 26,
    estimated_duration_minutes: 20,
    evaluation_method: 'behavioral',
    popularity: 4,
    implemented: false
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurial Mindset (Podnikavosť)',
    short_description: 'Assess your entrepreneurial thinking and opportunity recognition',
    description: 'Evaluate your entrepreneurial mindset including opportunity identification, risk-taking, and bias for action',
    category: 'values_mindsets',
    subcategory: '4es_chela',
    tags: ['entrepreneurship', 'opportunity', 'risk-taking', 'action'],
    question_count: 30,
    estimated_duration_minutes: 25,
    evaluation_method: 'scenario_based',
    popularity: 4,
    implemented: false
  },
  {
    id: 'engagement_commitment',
    name: 'Engagement & Commitment (Angažovanosť)',
    short_description: 'Measure your level of engagement and commitment to causes',
    description: 'Assess your dedication, commitment level, and engagement with work and causes you care about',
    category: 'values_mindsets',
    subcategory: '4es_chela',
    tags: ['engagement', 'commitment', 'dedication', 'purpose'],
    question_count: 24,
    estimated_duration_minutes: 18,
    evaluation_method: 'reflective',
    popularity: 3,
    implemented: false
  },
  {
    id: 'via_values',
    name: 'Values in Action (VIA) Survey',
    short_description: 'Discover your core character strengths and values',
    description: 'Comprehensive assessment of 24 character strengths that represent your core values in action',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['values', 'character strengths', 'virtues', 'VIA'],
    question_count: 120,
    estimated_duration_minutes: 45,
    evaluation_method: 'likert_scale',
    popularity: 5,
    implemented: false
  },
  {
    id: 'org_culture_preference',
    name: 'Organizational Culture Fit',
    short_description: 'Identify your preferred organizational culture and development stage',
    description: 'Assess your preferences across organizational culture types from Red to Teal (Spiral Dynamics)',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['culture', 'organization', 'spiral dynamics', 'development'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'preference_ranking',
    popularity: 3,
    implemented: false
  },
  {
    id: 'kegan_stages',
    name: 'Adult Development Stages (Kegan)',
    short_description: 'Understand your stage of adult psychological development',
    description: 'Assessment based on Robert Kegan\'s stages of adult development and meaning-making',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['development', 'psychology', 'meaning-making', 'Kegan'],
    question_count: 28,
    estimated_duration_minutes: 30,
    evaluation_method: 'developmental',
    popularity: 2,
    implemented: false
  },
  {
    id: 'implicit_bias',
    name: 'Implicit Bias Awareness',
    short_description: 'Explore your unconscious biases and develop awareness',
    description: 'Assessment to help identify and understand your implicit biases across various dimensions',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['bias', 'unconscious', 'awareness', 'diversity'],
    question_count: 40,
    estimated_duration_minutes: 35,
    evaluation_method: 'iat_style',
    popularity: 4,
    implemented: false
  }
])

// Computed properties for individual test results
const kohlbergResult = computed(() => 
  userTestResults.value.find(result => result.test_type_id === 'kohlberg_moral')
)

const bigFiveResult = computed(() => 
  userTestResults.value.find(result => result.test_type_id === 'big_five_personality')
)

const communicationResult = computed(() => 
  userTestResults.value.find(result => result.test_type_id === 'communication_skills')
)

const projectManagementResult = computed(() => 
  userTestResults.value.find(result => result.test_type_id === 'project_management')
)

// Overall profile metrics
const totalAssessments = computed(() => allAssessments.value.length)

const completionRate = computed(() => {
  const totalPossibleTests = 4 // Kohlberg, Big Five, Communication, PM
  const completedTests = userTestResults.value.length
  return Math.round((completedTests / totalPossibleTests) * 100)
})

const profileScore = computed(() => {
  if (userTestResults.value.length === 0) return 0
  
  let totalScore = 0
  let count = 0
  
  // Calculate average score across all tests
  userTestResults.value.forEach(result => {
    if (result.test_type_id === 'kohlberg_moral' && result.primary_stage) {
      totalScore += (result.primary_stage / 6) * 100
      count++
    } else if (result.latest_score) {
      // For other tests that have overall scores
      if (result.latest_score.overallScore) {
        totalScore += result.latest_score.overallScore
        count++
      } else if (result.latest_score.dimensions) {
        // Big Five average
        const scores = Object.values(result.latest_score.dimensions).map(d => d.score)
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
        totalScore += average
        count++
      }
    }
  })
  
  return count > 0 ? Math.round(totalScore / count) : 0
})

const recentAssessments = computed(() => 
  allAssessments.value
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    .slice(0, 5)
)

// Helper functions
const getUserInitials = () => {
  if (!user.value?.email) return 'U'
  const email = user.value.email
  return email.charAt(0).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStageName = (stage) => {
  const names = {
    1: 'Punishment Avoidance',
    2: 'Self-Interest',
    3: 'Social Approval',
    4: 'Law and Order',
    5: 'Social Contract', 
    6: 'Universal Principles'
  }
  return names[stage] || `Stage ${stage}`
}

const getStageDescription = (stage) => {
  const descriptions = {
    1: 'Moral reasoning based on avoiding punishment and consequences',
    2: 'Decisions based on personal benefit and reciprocity',
    3: 'Focus on social approval and maintaining relationships',
    4: 'Emphasis on rules, laws, and maintaining social order',
    5: 'Consideration of social contracts and individual rights',
    6: 'Universal ethical principles that transcend specific situations'
  }
  return descriptions[stage] || 'Moral reasoning assessment'
}

const getPersonalityDimensions = () => {
  if (!bigFiveResult.value?.latest_score?.dimensions) return []
  
  const dimensionNames = {
    openness: 'Openness to Experience',
    conscientiousness: 'Conscientiousness',
    extraversion: 'Extraversion',
    agreeableness: 'Agreeableness',
    neuroticism: 'Neuroticism'
  }
  
  return Object.entries(bigFiveResult.value.latest_score.dimensions).map(([key, data]) => ({
    name: dimensionNames[key] || key,
    score: data.score
  }))
}

const getOverallPersonalityScore = () => {
  const dimensions = getPersonalityDimensions()
  if (dimensions.length === 0) return 0
  
  const average = dimensions.reduce((sum, dim) => sum + dim.score, 0) / dimensions.length
  return Math.round(average)
}

const getCommunicationSkills = () => {
  if (!communicationResult.value?.latest_score?.skillAreas) return []
  
  const skillNames = {
    verbal: 'Verbal Communication',
    written: 'Written Communication',
    listening: 'Active Listening',
    nonverbal: 'Non-verbal Communication',
    conflict: 'Conflict Resolution'
  }
  
  return Object.entries(communicationResult.value.latest_score.skillAreas).map(([key, data]) => ({
    name: skillNames[key] || key,
    score: data.score
  }))
}

const getCommunicationScore = () => {
  return communicationResult.value?.latest_score?.overallScore || 0
}

const getProjectManagementCompetencies = () => {
  if (!projectManagementResult.value?.latest_score?.competencyAreas) return []
  
  const competencyNames = {
    planning: 'Project Planning',
    leadership: 'Team Leadership',
    risk: 'Risk Management',
    stakeholder: 'Stakeholder Management',
    communication: 'Communication & Quality'
  }
  
  return Object.entries(projectManagementResult.value.latest_score.competencyAreas).map(([key, data]) => ({
    name: competencyNames[key] || key,
    score: data.score
  }))
}

const getProjectManagementScore = () => {
  return projectManagementResult.value?.latest_score?.overallScore || 0
}

const getUniqueTestsCount = () => {
  const uniqueTests = new Set(userTestResults.value.map(result => result.test_type_id))
  return uniqueTests.size
}

const getAverageScore = () => {
  return profileScore.value
}

const getTestIcon = (testId) => {
  const icons = {
    'kohlberg_moral': '⚖️',
    'big_five_personality': '🧭',
    'communication_skills': '💬',
    'project_management': '🚀'
  }
  return icons[testId] || '📊'
}

const getCategoryDisplayName = (category) => {
  const names = {
    motivation: "Motivation",
    knowledge: "Knowledge",
    skills_strengths: "Skills & Strengths",
    values_mindsets: "Values & Mindsets",
    other: "Other Assessments",
  };
  return names[category] || category;
};

const getTestName = (testId) => {
  const names = {
    'kohlberg_moral': 'Kohlberg Moral Development',
    'big_five_personality': 'Big Five Personality',
    'communication_skills': 'Communication Skills',
    'project_management': 'Project Management'
  }
  return names[testId] || testId
}

const getAssessmentScore = (assessment) => {
  if (assessment.test_type_id === 'kohlberg_moral') {
    return `Stage ${assessment.primary_stage || 'N/A'}`
  }
  if (assessment.evaluation?.overallScore) {
    return `${assessment.evaluation.overallScore}%`
  }
  return 'Complete'
}

const getTestRecommendations = () => {
  const completedTests = new Set(userTestResults.value.map(r => r.test_type_id))
  const availableTests = allTests.value.filter(test => 
    !completedTests.has(test.id) && test.implemented
  )
  
  // If no implemented tests available, return empty
  if (availableTests.length === 0) {
    return []
  }
  
  // Randomly shuffle and return up to 3 recommendations
  const shuffled = [...availableTests].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3).map(test => ({
    testId: test.id,
    name: test.name,
    icon: getTestIcon(test.id),
    reason: test.short_description,
    category: getCategoryDisplayName(test.category),
    duration: test.estimated_duration_minutes,
    questionCount: test.question_count
  }))
}

// Computed properties for test analytics
const implementedTests = computed(() => 
  allTests.value.filter(test => test.implemented)
)

const nonImplementedTests = computed(() => 
  allTests.value.filter(test => !test.implemented)
)

const completedTestsData = computed(() => {
  const completedIds = new Set(userTestResults.value.map(r => r.test_type_id))
  return allTests.value.filter(test => completedIds.has(test.id))
})

const testStatistics = computed(() => {
  return {
    total: allTests.value.length,
    implemented: implementedTests.value.length,
    nonImplemented: nonImplementedTests.value.length,
    completed: completedTestsData.value.length,
    available: implementedTests.value.filter(test => 
      !userTestResults.value.find(r => r.test_type_id === test.id)
    ).length
  }
})

const getRetakeRecommendations = () => {
  const recommendations = []
  const now = new Date()
  
  userTestResults.value.forEach(result => {
    const lastTaken = new Date(result.last_taken_at)
    const daysSince = Math.floor((now - lastTaken) / (1000 * 60 * 60 * 24))
    
    // Recommend retaking if it's been more than 90 days
    if (daysSince > 90) {
      const testInfo = {
        'kohlberg_moral': { name: 'Moral Development', icon: '⚖️', link: '/test/kohlberg_moral' },
        'big_five_personality': { name: 'Big Five Personality', icon: '🧭', link: '/big-five' },
        'communication_skills': { name: 'Communication Skills', icon: '💬', link: '/communication-skills' },
        'project_management': { name: 'Project Management', icon: '🚀', link: '/project-management' }
      }
      
      const info = testInfo[result.test_type_id]
      if (info) {
        recommendations.push({
          testId: result.test_type_id,
          name: info.name,
          icon: info.icon,
          link: info.link,
          reason: `Last taken ${daysSince} days ago - track your progress`
        })
      }
    }
  })
  
  // If no retakes needed, suggest improvements
  if (recommendations.length === 0 && userTestResults.value.length > 0) {
    // Find lowest scoring test
    const lowestResult = userTestResults.value.reduce((lowest, current) => {
      const currentScore = getResultScore(current)
      const lowestScore = getResultScore(lowest)
      return currentScore < lowestScore ? current : lowest
    })
    
    const testInfo = {
      'kohlberg_moral': { name: 'Moral Development', icon: '⚖️', link: '/test/kohlberg_moral' },
      'big_five_personality': { name: 'Big Five Personality', icon: '🧭', link: '/big-five' },
      'communication_skills': { name: 'Communication Skills', icon: '💬', link: '/communication-skills' },
      'project_management': { name: 'Project Management', icon: '🚀', link: '/project-management' }
    }
    
    const info = testInfo[lowestResult.test_type_id]
    if (info) {
      recommendations.push({
        testId: lowestResult.test_type_id,
        name: info.name,
        icon: info.icon,
        link: info.link,
        reason: 'Room for improvement - see your progress'
      })
    }
  }
  
  return recommendations
}

const getResultScore = (result) => {
  if (result.test_type_id === 'kohlberg_moral') {
    return (result.primary_stage || 1) * 16.67 // Convert stage to percentage
  }
  return result.latest_score?.overallScore || 0
}

// Data loading functions
const loadUserData = async () => {
  if (!user.value) return
  
  loading.value = true
  
  try {
    // Load test results summary
    const { data: testResults, error: testError } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', user.value.id)
    
    if (!testError && testResults) {
      userTestResults.value = testResults
    }
    
    // Load all assessments for timeline
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.value.id)
      .order('completed_at', { ascending: false })
    
    if (!assessmentError && assessments) {
      allAssessments.value = assessments
    }
    
  } catch (error) {
    console.error('Error loading user data:', error)
  } finally {
    loading.value = false
  }
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

// Initialize data
onMounted(async () => {
  if (user.value) {
    await loadUserData()
  }
})

// Watch for auth changes
watchEffect(() => {
  if (user.value) {
    loadUserData()
  }
})

useHead({
  title: 'My Profile - Assessment Platform',
  meta: [
    { name: 'description', content: 'View your comprehensive assessment profile and track your personal development across personality, values, and skills.' }
  ]
})
</script>