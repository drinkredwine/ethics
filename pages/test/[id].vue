<template>
  <div :class="themeClasses.pageBackground">
    <!-- Navigation -->
    <nav :class="themeClasses.navBackground">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink :to="$localePath('/')" :class="`text-xl font-bold ${themeClasses.navText}`">
              ← Assessment Platform
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeSwitcher />
            <LanguagePicker />
            <div v-if="user" class="flex items-center space-x-4">
              <NuxtLink :to="$localePath('/profile')" :class="`${themeClasses.navTextSecondary} ${themeClasses.navTextHover} transition-colors`">
                Profile
              </NuxtLink>
              <button @click="logout" :class="`${themeClasses.navTextSecondary} ${themeClasses.navTextHover} transition-colors`">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="test" class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Left Column - Test Info -->
        <div>
          <!-- Test Header -->
          <div class="mb-8">
            <div class="flex items-center mb-4">
              <div class="text-6xl mr-4">{{ getTestIcon(test.id) }}</div>
              <div>
                <div class="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-1">
                  {{ test.category }} Assessment
                </div>
                <h1 :class="`text-4xl font-bold ${themeClasses.textPrimary}`">{{ test.name }}</h1>
              </div>
            </div>
            
            <p :class="`text-xl ${themeClasses.textSecondary} leading-relaxed`">
              {{ test.description }}
            </p>
          </div>

          <!-- Test Details -->
          <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-6 mb-8`">
            <h3 :class="`text-lg font-bold ${themeClasses.textPrimary} mb-4`">Test Details</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <div :class="`font-semibold ${themeClasses.textPrimary}`">Duration</div>
                  <div :class="themeClasses.textSecondary">~{{ test.estimated_duration_minutes }} minutes</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div>
                  <div :class="`font-semibold ${themeClasses.textPrimary}`">Questions</div>
                  <div :class="themeClasses.textSecondary">{{ test.question_count }} questions</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <div>
                  <div :class="`font-semibold ${themeClasses.textPrimary}`">Method</div>
                  <div :class="themeClasses.textSecondary">{{ formatEvaluationMethod(test.evaluation_method) }}</div>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                <div>
                  <div :class="`font-semibold ${themeClasses.textPrimary}`">Tags</div>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span 
                      v-for="tag in test.tags" 
                      :key="tag"
                      class="bg-indigo-900 bg-opacity-50 text-indigo-300 px-2 py-1 rounded-full text-xs border border-indigo-700"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress if user has taken this test -->
          <div v-if="userResult" class="bg-green-50 rounded-xl p-6 mb-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-green-800">Your Progress</h3>
              <div class="text-green-600 font-semibold">✓ Completed</div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div class="font-semibold text-green-800">Times Taken</div>
                <div class="text-green-700">{{ userResult.assessment_count }}</div>
              </div>
              <div>
                <div class="font-semibold text-green-800">Last Taken</div>
                <div class="text-green-700">{{ formatDate(userResult.last_taken_at) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - CTA and Preview -->
        <div>
          <!-- Sample Questions Preview -->
          <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">What to Expect</h3>
            <div class="space-y-4">
              <div 
                v-for="(preview, index) in getTestPreviews(test.id)" 
                :key="index"
                class="border-l-4 border-indigo-500 pl-4 py-2"
              >
                <div class="font-medium text-gray-800 mb-1">{{ preview.title }}</div>
                <div class="text-gray-600 text-sm">{{ preview.description }}</div>
              </div>
            </div>
          </div>

          <!-- Main CTA Button -->
          <div class="text-center">
            <div v-if="!user" class="mb-6">
              <p class="text-gray-600 mb-4">Please sign up or log in to take this assessment</p>
              <div class="space-y-3">
                <NuxtLink 
                  :to="$localePath('/register')" 
                  class="block w-full bg-indigo-600 text-white py-4 px-8 rounded-xl hover:bg-indigo-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Sign Up & Start Assessment
                </NuxtLink>
                <NuxtLink 
                  :to="$localePath('/login')" 
                  class="block w-full bg-white text-indigo-600 py-3 px-6 rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
                >
                  Already have an account? Log in
                </NuxtLink>
              </div>
            </div>

            <div v-else>
              <NuxtLink 
                :to="getTestLink(test.id)" 
                class="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {{ userResult ? 'Retake Assessment' : 'Start Assessment Now' }}
                <div class="text-sm font-normal opacity-90 mt-1">
                  {{ userResult ? 'Track your progress over time' : 'Free • Takes ~' + test.estimated_duration_minutes + ' minutes' }}
                </div>
              </NuxtLink>

              <!-- Alternative test variants if available -->
              <div v-if="hasMultipleVariants(test.id)" class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-600 mb-2">Choose your preferred format:</p>
                <div class="space-y-2">
                  <NuxtLink 
                    v-for="variant in getTestVariants(test.id)" 
                    :key="variant.id"
                    :to="getVariantLink(variant)"
                    class="block w-full text-left bg-white text-gray-700 py-2 px-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div class="font-medium">{{ variant.name }}</div>
                    <div class="text-sm text-gray-500">{{ variant.description }}</div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 404 State -->
      <div v-else class="text-center py-12">
        <div class="text-6xl mb-4">🤔</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Assessment Not Found</h1>
        <p class="text-gray-600 mb-8">The assessment you're looking for doesn't exist or has been removed.</p>
        <NuxtLink 
          :to="$localePath('/')" 
          class="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Browse All Assessments
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const route = useRoute()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { getThemeClasses } = useTheme()

// Get theme classes
const themeClasses = computed(() => getThemeClasses())

// Get test ID from route params
const testId = route.params.id

// Test data (in production, this would come from API/database)
const tests = ref([
  // === EXISTING TESTS ===
  {
    id: 'kohlberg_moral',
    name: 'Kohlberg Moral Development',
    description: 'Discover your stage of moral reasoning through carefully crafted ethical dilemmas. Based on Lawrence Kohlberg\'s groundbreaking research, this assessment analyzes how you approach moral decisions and provides insights into your ethical framework.',
    category: 'Values & Mindsets',
    tags: ['morals', 'ethics', 'development'],
    question_count: 3,
    estimated_duration_minutes: 15,
    evaluation_method: 'ai_analysis'
  },
  {
    id: 'big_five_personality',
    name: 'Big Five Personality (OCEAN)',
    description: 'Explore your personality across the five major dimensions that define human character: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. Get detailed insights into your unique personality profile.',
    category: 'Values & Mindsets',
    tags: ['personality', 'traits', 'psychology'],
    question_count: 50,
    estimated_duration_minutes: 25,
    evaluation_method: 'multiple_choice'
  },
  {
    id: 'communication_skills',
    name: 'Communication Skills',
    description: 'Evaluate your communication effectiveness across different contexts including presentations, interpersonal conversations, written communication, and conflict resolution. Discover your strengths and areas for improvement.',
    category: 'Skills & Strengths',
    tags: ['communication', 'interpersonal', 'professional'],
    question_count: 30,
    estimated_duration_minutes: 20,
    evaluation_method: 'multiple_choice'
  },
  {
    id: 'project_management',
    name: 'Project Management',
    description: 'Assess your project management skills including planning, execution, leadership, risk management, and stakeholder communication. Perfect for both aspiring and experienced project managers.',
    category: 'Knowledge',
    tags: ['management', 'leadership', 'planning'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'multiple_choice'
  },

  // === NEW MOTIVATION TESTS ===
  {
    id: 'personal_motivation',
    name: 'Personal Motivations Assessment',
    description: 'Dive deep into what truly drives you - your fears, passions, and core motivational patterns. This comprehensive assessment explores both conscious and unconscious drivers that influence your decisions, helping you understand your fundamental motivational blueprint.',
    category: 'Motivation',
    tags: ['motivation', 'passion', 'fear', 'self-awareness'],
    question_count: 25,
    estimated_duration_minutes: 20,
    evaluation_method: 'mixed'
  },
  {
    id: 'change_readiness',
    name: 'Change Readiness Assessment',
    description: 'Evaluate your current life situation, identify challenges you\'re facing, and assess your readiness for meaningful transformation. This assessment helps you understand where you are and what changes might be most beneficial.',
    category: 'Motivation',
    tags: ['change', 'planning', 'readiness', 'transformation'],
    question_count: 20,
    estimated_duration_minutes: 15,
    evaluation_method: 'reflective'
  },

  // === NEW KNOWLEDGE TESTS ===
  {
    id: 'team_leadership',
    name: 'Team Leadership Assessment',
    description: 'Comprehensive evaluation of your team leadership capabilities including team motivation, delegation skills, conflict resolution, and team dynamics management. Perfect for current and aspiring team leaders.',
    category: 'Knowledge',
    tags: ['leadership', 'teams', 'management', 'delegation'],
    question_count: 40,
    estimated_duration_minutes: 30,
    evaluation_method: 'scenario_based'
  },
  {
    id: 'change_management',
    name: 'Change Management Mastery',
    description: 'Evaluate your skills in leading organizational transformation, overcoming resistance to change, and implementing successful change initiatives. Based on proven change management frameworks.',
    category: 'Knowledge',
    tags: ['change management', 'transformation', 'leadership', 'strategy'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'case_study'
  },

  // === NEW SKILLS/STRENGTHS TESTS ===
  {
    id: 'strengths_finder',
    name: 'Strengths Profile Assessment',
    description: 'Identify your top natural talents and strengths using a methodology similar to StrengthsFinder. Discover your unique combination of abilities and learn how to leverage them for peak performance.',
    category: 'Skills & Strengths',
    tags: ['strengths', 'talents', 'natural abilities', 'excellence'],
    question_count: 45,
    estimated_duration_minutes: 30,
    evaluation_method: 'forced_choice'
  },
  {
    id: 'critical_thinking',
    name: 'Critical Thinking Assessment',
    description: 'Evaluate your analytical and logical reasoning abilities including analysis, evaluation, inference, interpretation, and problem-solving skills. Essential for effective decision-making.',
    category: 'Skills & Strengths',
    tags: ['critical thinking', 'analysis', 'logic', 'reasoning'],
    question_count: 30,
    estimated_duration_minutes: 35,
    evaluation_method: 'problem_solving'
  },
  {
    id: 'creativity_assessment',
    name: 'Creativity & Innovation',
    description: 'Measure your creative thinking abilities, divergent thinking patterns, and innovation potential. Discover how you approach creative challenges and generate novel solutions.',
    category: 'Skills & Strengths',
    tags: ['creativity', 'innovation', 'divergent thinking', 'ideation'],
    question_count: 25,
    estimated_duration_minutes: 30,
    evaluation_method: 'creative_tasks'
  },
  {
    id: 'collaboration_skills',
    name: 'Collaboration Excellence',
    description: 'Assess your ability to work effectively with others, facilitate cooperation, build consensus, and create synergistic team relationships. Essential for modern workplace success.',
    category: 'Skills & Strengths',
    tags: ['collaboration', 'teamwork', 'cooperation', 'consensus'],
    question_count: 28,
    estimated_duration_minutes: 22,
    evaluation_method: 'behavioral'
  },

  // === NEW VALUES & MINDSETS TESTS ===
  {
    id: 'character_assessment',
    name: 'Character & Integrity (Charakternosť)',
    description: 'Evaluate your character development including respect, moral courage, ethical decision-making, and integrity in challenging situations. Based on timeless character principles.',
    category: 'Values & Mindsets',
    tags: ['character', 'integrity', 'moral courage', 'respect'],
    question_count: 32,
    estimated_duration_minutes: 25,
    evaluation_method: 'ethical_scenarios'
  },
  {
    id: 'excellence_mindset',
    name: 'Excellence Orientation',
    description: 'Assess your commitment to excellence, quality standards, continuous improvement, and the drive to achieve your highest potential in all areas of life.',
    category: 'Values & Mindsets',
    tags: ['excellence', 'quality', 'improvement', 'standards'],
    question_count: 26,
    estimated_duration_minutes: 20,
    evaluation_method: 'behavioral'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurial Mindset (Podnikavosť)',
    description: 'Evaluate your entrepreneurial thinking including opportunity identification, risk-taking propensity, bias for action, and innovative problem-solving approaches.',
    category: 'Values & Mindsets',
    tags: ['entrepreneurship', 'opportunity', 'risk-taking', 'action'],
    question_count: 30,
    estimated_duration_minutes: 25,
    evaluation_method: 'scenario_based'
  },
  {
    id: 'engagement_commitment',
    name: 'Engagement & Commitment (Angažovanosť)',
    description: 'Measure your level of engagement, dedication, and commitment to work, causes, and relationships that matter to you. Understand what drives your sustained involvement.',
    category: 'Values & Mindsets',
    tags: ['engagement', 'commitment', 'dedication', 'purpose'],
    question_count: 24,
    estimated_duration_minutes: 18,
    evaluation_method: 'reflective'
  },
  {
    id: 'via_values',
    name: 'Values in Action (VIA) Survey',
    description: 'Comprehensive assessment of 24 character strengths that represent your core values in action. Discover your signature strengths and learn how to apply them more effectively.',
    category: 'Values & Mindsets',
    tags: ['values', 'character strengths', 'virtues', 'VIA'],
    question_count: 120,
    estimated_duration_minutes: 45,
    evaluation_method: 'likert_scale'
  },
  {
    id: 'org_culture_preference',
    name: 'Organizational Culture Fit',
    description: 'Identify your preferred organizational culture and development stage using the Spiral Dynamics model. Understand which organizational environments bring out your best.',
    category: 'Values & Mindsets',
    tags: ['culture', 'organization', 'spiral dynamics', 'development'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'preference_ranking'
  },
  {
    id: 'kegan_stages',
    name: 'Adult Development Stages (Kegan)',
    description: 'Understand your stage of adult psychological development based on Robert Kegan\'s developmental psychology. Learn how your meaning-making system shapes your worldview.',
    category: 'Values & Mindsets',
    tags: ['development', 'psychology', 'meaning-making', 'Kegan'],
    question_count: 28,
    estimated_duration_minutes: 30,
    evaluation_method: 'developmental'
  },
  {
    id: 'implicit_bias',
    name: 'Implicit Bias Awareness',
    description: 'Explore your unconscious biases and develop greater awareness of how they might influence your decisions and interactions. Increase your cultural competence and inclusivity.',
    category: 'Values & Mindsets',
    tags: ['bias', 'unconscious', 'awareness', 'diversity'],
    question_count: 40,
    estimated_duration_minutes: 35,
    evaluation_method: 'iat_style'
  }
])

const userResult = ref(null)

// Computed properties
const test = computed(() => {
  return tests.value.find(t => t.id === testId)
})

// Helper functions
const getTestIcon = (testId) => {
  const icons = {
    'kohlberg_moral': '⚖️',
    'big_five_personality': '🧭',
    'communication_skills': '💬',
    'project_management': '🚀'
  }
  return icons[testId] || '📊'
}

const formatEvaluationMethod = (method) => {
  const methods = {
    'ai_analysis': 'AI Analysis',
    'multiple_choice': 'Multiple Choice',
    'mixed': 'Mixed Format',
    'reflective': 'Reflective Questions',
    'scenario_based': 'Scenario-Based',
    'case_study': 'Case Studies',
    'forced_choice': 'Forced Choice',
    'problem_solving': 'Problem Solving',
    'creative_tasks': 'Creative Tasks',
    'behavioral': 'Behavioral Assessment',
    'ethical_scenarios': 'Ethical Scenarios',
    'likert_scale': 'Rating Scale',
    'preference_ranking': 'Preference Ranking',
    'developmental': 'Developmental Assessment',
    'iat_style': 'Implicit Association'
  }
  return methods[method] || method
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getTestPreviews = (testId) => {
  const previews = {
    'kohlberg_moral': [
      {
        title: 'Ethical Dilemmas',
        description: 'Real-world scenarios that challenge your moral reasoning'
      },
      {
        title: 'Open-Ended Responses',
        description: 'Explain your thinking process in your own words'
      },
      {
        title: 'AI-Powered Analysis',
        description: 'Advanced analysis of your moral development stage'
      }
    ],
    'big_five_personality': [
      {
        title: 'Personality Statements',
        description: 'Rate how well statements describe you on a 5-point scale'
      },
      {
        title: 'Five Dimensions',
        description: 'Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism'
      },
      {
        title: 'Detailed Profile',
        description: 'Comprehensive breakdown of your personality traits'
      }
    ],
    'communication_skills': [
      {
        title: 'Scenario-Based Questions',
        description: 'How would you handle various communication challenges?'
      },
      {
        title: 'Multiple Contexts',
        description: 'Professional, personal, and public communication scenarios'
      },
      {
        title: 'Skill Areas',
        description: 'Listening, speaking, writing, and non-verbal communication'
      }
    ],
    'project_management': [
      {
        title: 'PM Scenarios',
        description: 'Real project challenges and decision points'
      },
      {
        title: 'Core Competencies',
        description: 'Planning, execution, leadership, and stakeholder management'
      },
      {
        title: 'Industry Standards',
        description: 'Based on PMI and other recognized frameworks'
      }
    ]
  }
  return previews[testId] || []
}

const hasMultipleVariants = (testId) => {
  return testId === 'kohlberg_moral' // Only Kohlberg has multiple variants for now
}

const getTestVariants = (testId) => {
  if (testId === 'kohlberg_moral') {
    return [
      {
        id: 'kohlberg_moral_freetext',
        name: 'Free Text Analysis (Recommended)',
        description: 'Write detailed responses for deeper analysis'
      },
      {
        id: 'kohlberg_moral_multiple',
        name: 'Multiple Choice',
        description: 'Faster completion with predefined options'
      }
    ]
  }
  return []
}

const getTestLink = (testId) => {
  // Route to dedicated test pages or assessment with test parameter
  const testRoutes = {
    // Existing implemented tests
    'kohlberg_moral': '/assessment?test=kohlberg_moral',
    'big_five_personality': '/big-five',
    'communication_skills': '/communication-skills',
    'project_management': '/project-management',
    
    // Priority 1 implemented tests - dedicated pages
    'personal_motivation': '/personal-motivation',
    'change_readiness': '/change-readiness',
    'excellence_mindset': '/excellence-mindset',
    'engagement_commitment': '/engagement-commitment',
    
    // Priority 2 implemented tests - dedicated pages
    'team_leadership': '/team-leadership',
    'character_assessment': '/character-assessment',
    'entrepreneurship': '/entrepreneurship',
    'collaboration_skills': '/collaboration-skills',
    
    // Priority 3 implemented tests - dedicated pages
    'change_management': '/change-management',
    'strengths_finder': '/strengths-profile',
    'critical_thinking': '/critical-thinking',
    'creativity_assessment': '/creativity-innovation',
    'org_culture_preference': '/culture-fit',
    
    // Other new tests - route to assessment with test parameter for now
    'via_values': '/assessment?test=via_values',
    'kegan_stages': '/assessment?test=kegan_stages',
    'implicit_bias': '/assessment?test=implicit_bias'
  }
  return testRoutes[testId] || `/assessment?test=${testId}`
}

const getVariantLink = (variant) => {
  if (variant.id === 'kohlberg_moral_multiple') {
    return '/kohlberg-multiple-choice'
  }
  return `/assessment?test=${testId}&variant=${variant.id}`
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

// Load user test results if authenticated
const loadUserResult = async () => {
  if (!user.value || !testId) return
  
  try {
    const { data, error } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', user.value.id)
      .eq('test_type_id', testId)
      .single()
    
    if (!error && data) {
      userResult.value = data
    }
  } catch (error) {
    console.error('Error loading user test result:', error)
  }
}

// Load data on component mount
onMounted(async () => {
  if (user.value) {
    await loadUserResult()
  }
  
  // Initialize theme
  const { initTheme } = useTheme()
  initTheme()
})

// Watch for auth state changes
watchEffect(() => {
  if (user.value) {
    loadUserResult()
  } else {
    userResult.value = null
  }
})

// Dynamic head management
useHead(() => ({
  title: test.value ? `${test.value.name} - Assessment Platform` : 'Assessment Not Found',
  meta: [
    { 
      name: 'description', 
      content: test.value ? test.value.description : 'Assessment not found' 
    }
  ]
}))
</script>