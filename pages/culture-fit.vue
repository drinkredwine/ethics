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

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Assessment Header -->
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🏢</div>
        <div class="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-2">Values & Mindsets Assessment</div>
        <h1 :class="`text-4xl font-bold ${themeClasses.textPrimary} mb-4`">Organizational Culture Fit</h1>
        <p :class="`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`">
          Identify your preferred organizational culture and development stage using the Spiral Dynamics model. Understand which organizational environments bring out your best.
        </p>
      </div>

      <!-- Progress Bar -->
      <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-6 mb-8`">
        <div class="flex justify-between items-center mb-2">
          <span :class="`font-medium ${themeClasses.textPrimary}`">Progress</span>
          <span :class="`text-sm ${themeClasses.textSecondary}`">{{ currentQuestion }}/{{ questions.length }}</span>
        </div>
        <div :class="`w-full bg-gray-200 rounded-full h-2.5 ${themeClasses.borderColor} border`">
          <div 
            class="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-300" 
            :style="`width: ${(currentQuestion / questions.length) * 100}%`"
          ></div>
        </div>
      </div>

      <!-- Question Section -->
      <div v-if="!showResults" :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8 mb-8`">
        <div class="mb-6">
          <div class="text-sm text-indigo-400 uppercase tracking-wider font-medium mb-2">
            {{ questions[currentQuestion - 1].category }}
          </div>
          <h2 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">
            {{ questions[currentQuestion - 1].question }}
          </h2>
          
          <div v-if="questions[currentQuestion - 1].context" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mb-6 border-l-4 border-indigo-500`">
            <div class="font-semibold text-indigo-600 mb-2">Context:</div>
            <div :class="themeClasses.textSecondary">{{ questions[currentQuestion - 1].context }}</div>
          </div>
          
          <p v-if="questions[currentQuestion - 1].type === 'preference_ranking'" :class="`text-sm ${themeClasses.textSecondary} mb-6`">
            Rank these options from <strong>1 (most preferred)</strong> to <strong>{{ questions[currentQuestion - 1].options.length }} (least preferred)</strong>:
          </p>
        </div>

        <!-- Multiple Choice Questions -->
        <div v-if="questions[currentQuestion - 1].type === 'multiple_choice'" class="space-y-3 mb-8">
          <button
            v-for="option in questions[currentQuestion - 1].options"
            :key="option.value"
            @click="selectAnswer(option.value)"
            :class="`w-full text-left p-5 rounded-lg border-2 transition-all ${
              answers[currentQuestion - 1] === option.value
                ? `${themeClasses.borderPrimary} ${themeClasses.backgroundPrimary} transform scale-102`
                : `${themeClasses.borderColor} ${themeClasses.cardHover} hover:transform hover:scale-101`
            }`"
          >
            <div class="flex items-start space-x-4">
              <div :class="`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 ${
                answers[currentQuestion - 1] === option.value ? 'bg-indigo-500 border-indigo-500' : themeClasses.borderColor
              }`">
                <div v-if="answers[currentQuestion - 1] === option.value" class="w-full h-full rounded-full bg-white scale-50"></div>
              </div>
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div :class="`w-6 h-6 rounded-full mr-3 border-2 ${getSpiralColor(option.spiral_level)}`"></div>
                  <span :class="`font-medium ${themeClasses.textPrimary}`">{{ option.text }}</span>
                </div>
                <div :class="`text-sm ${themeClasses.textSecondary} mb-2`">{{ option.description }}</div>
                <div class="flex items-center space-x-2">
                  <span :class="`text-xs px-2 py-1 rounded-full ${getSpiralBadgeColor(option.spiral_level)} font-medium`">
                    {{ option.spiral_level }}
                  </span>
                  <span :class="`text-xs ${themeClasses.textSecondary}`">{{ option.characteristics }}</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <!-- Preference Ranking Questions -->
        <div v-if="questions[currentQuestion - 1].type === 'preference_ranking'" class="mb-8">
          <div class="space-y-4">
            <div 
              v-for="option in questions[currentQuestion - 1].options"
              :key="option.value"
              :class="`rounded-lg border-2 p-4 ${themeClasses.borderColor}`"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <div :class="`w-5 h-5 rounded-full mr-3 border-2 ${getSpiralColor(option.spiral_level)}`"></div>
                    <span :class="`font-medium ${themeClasses.textPrimary}`">{{ option.text }}</span>
                  </div>
                  <div :class="`text-sm ${themeClasses.textSecondary} mb-2`">{{ option.description }}</div>
                  <span :class="`text-xs px-2 py-1 rounded-full ${getSpiralBadgeColor(option.spiral_level)}`">
                    {{ option.spiral_level }}
                  </span>
                </div>
                <div class="ml-4">
                  <select 
                    :value="getRanking(option.value)"
                    @change="updateRanking(option.value, $event.target.value)"
                    :class="`w-16 p-2 border rounded ${themeClasses.borderColor} ${themeClasses.cardBackground}`"
                  >
                    <option value="">-</option>
                    <option v-for="rank in questions[currentQuestion - 1].options.length" :key="rank" :value="rank">
                      {{ rank }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between items-center">
          <button
            v-if="currentQuestion > 1"
            @click="previousQuestion"
            :class="`px-6 py-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors`"
          >
            Previous
          </button>
          <div v-else></div>
          
          <div class="flex items-center space-x-4">
            <div v-if="!isAnswerComplete()" :class="`text-sm ${themeClasses.textSecondary}`">
              {{ questions[currentQuestion - 1].type === 'preference_ranking' ? 'Please rank all options' : 'Please select an option' }}
            </div>
            <button
              @click="nextQuestion"
              :disabled="!isAnswerComplete()"
              :class="`px-6 py-2 rounded-lg font-medium transition-colors ${
                isAnswerComplete()
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : `${themeClasses.buttonDisabled} cursor-not-allowed`
              }`"
            >
              {{ currentQuestion === questions.length ? 'Complete Assessment' : 'Next' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="space-y-8">
        <!-- Primary Culture Match -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8 text-center`">
          <div class="text-6xl mb-4">{{ results.primary_culture.icon }}</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">{{ results.primary_culture.name }}</h2>
          <p :class="`text-xl ${themeClasses.textSecondary} mb-6`">Your Primary Culture Preference</p>
          
          <div :class="`max-w-2xl mx-auto ${themeClasses.backgroundSecondary} rounded-lg p-6 border-l-4 ${results.primary_culture.border_color}`">
            <p :class="`${themeClasses.textSecondary} mb-4`">{{ results.primary_culture.description }}</p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Values:</h4>
                <ul :class="`text-sm ${themeClasses.textSecondary} space-y-1`">
                  <li v-for="value in results.primary_culture.values" :key="value" class="flex items-start space-x-2">
                    <span class="text-green-500 mt-0.5">•</span>
                    <span>{{ value }}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Motivations:</h4>
                <ul :class="`text-sm ${themeClasses.textSecondary} space-y-1`">
                  <li v-for="motivation in results.primary_culture.motivations" :key="motivation" class="flex items-start space-x-2">
                    <span class="text-blue-500 mt-0.5">•</span>
                    <span>{{ motivation }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Spiral Dynamics Profile -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Your Cultural Development Profile</h3>
          
          <div class="space-y-4">
            <div v-for="level in results.spiral_profile" :key="level.name" class="flex items-center space-x-4">
              <div :class="`w-4 h-4 rounded-full border-2 flex-shrink-0 ${getSpiralColor(level.name)}`"></div>
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span :class="`font-medium ${themeClasses.textPrimary}`">{{ level.name }} - {{ level.label }}</span>
                  <span :class="`text-sm font-bold ${getScoreColor(level.score)}`">{{ level.score }}%</span>
                </div>
                <div :class="`w-full bg-gray-200 rounded-full h-2 ${themeClasses.borderColor} border`">
                  <div 
                    :class="`h-2 rounded-full transition-all duration-1000 ${getSpiralBarColor(level.name)}`"
                    :style="`width: ${level.score}%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mt-6`">
            <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Understanding Spiral Dynamics:</h4>
            <p :class="`text-sm ${themeClasses.textSecondary}`">
              Each level represents different values systems and worldviews. Higher scores indicate stronger resonance with that level's approaches to organization and decision-making.
            </p>
          </div>
        </div>

        <!-- Ideal Work Environment -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Your Ideal Work Environment</h3>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h4 :class="`text-lg font-semibold ${themeClasses.textPrimary} mb-4 flex items-center`">
                <span class="mr-2">✅</span> What Energizes You
              </h4>
              <ul :class="`text-sm ${themeClasses.textSecondary} space-y-2`">
                <li v-for="energizer in results.ideal_environment.energizers" :key="energizer" class="flex items-start space-x-2">
                  <span class="text-green-500 mt-1">+</span>
                  <span>{{ energizer }}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 :class="`text-lg font-semibold ${themeClasses.textPrimary} mb-4 flex items-center`">
                <span class="mr-2">⚠️</span> What Drains You
              </h4>
              <ul :class="`text-sm ${themeClasses.textSecondary} space-y-2`">
                <li v-for="drainer in results.ideal_environment.drainers" :key="drainer" class="flex items-start space-x-2">
                  <span class="text-red-500 mt-1">-</span>
                  <span>{{ drainer }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Culture Compatibility -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Organizational Compatibility Guide</h3>
          
          <div class="grid md:grid-cols-3 gap-6">
            <div v-for="compatibility in results.compatibility_guide" :key="compatibility.type" :class="`${themeClasses.backgroundSecondary} rounded-lg p-5 text-center`">
              <div class="text-3xl mb-3">{{ compatibility.icon }}</div>
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">{{ compatibility.type }}</h4>
              <div class="space-y-2">
                <div v-for="org in compatibility.organizations" :key="org" :class="`text-sm ${themeClasses.textSecondary} bg-white rounded p-2`">
                  {{ org }}
                </div>
              </div>
            </div>
          </div>
          
          <div :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mt-6`">
            <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">💡 Career Strategy Tip:</h4>
            <p :class="`text-sm ${themeClasses.textSecondary}`">{{ results.career_strategy_tip }}</p>
          </div>
        </div>

        <!-- Development Recommendations -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Cultural Development Plan</h3>
          
          <div class="space-y-6">
            <div v-for="(recommendation, index) in results.development_recommendations" :key="index" :class="`${themeClasses.backgroundSecondary} rounded-lg p-5`">
              <div class="flex items-start space-x-4">
                <div :class="`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${getRecommendationColor(index)}`">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">{{ recommendation.title }}</h4>
                  <p :class="`${themeClasses.textSecondary} text-sm mb-3`">{{ recommendation.description }}</p>
                  <div class="space-y-1">
                    <div v-for="action in recommendation.actions" :key="action" class="flex items-start space-x-2">
                      <span class="text-indigo-500 mt-1">→</span>
                      <span :class="`text-sm ${themeClasses.textSecondary}`">{{ action }}</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span v-for="focus in recommendation.focus_areas" :key="focus" class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                      {{ focus }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            @click="restartAssessment"
            :class="`px-8 py-3 rounded-lg font-medium transition-colors ${themeClasses.buttonSecondary}`"
          >
            Retake Assessment
          </button>
          <NuxtLink
            :to="$localePath('/profile')"
            class="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center"
          >
            View All Results
          </NuxtLink>
          <NuxtLink
            :to="$localePath('/')"
            :class="`px-8 py-3 rounded-lg font-medium transition-colors ${themeClasses.buttonSecondary} text-center`"
          >
            Explore More Assessments
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { getThemeClasses } = useTheme()

// Get theme classes
const themeClasses = computed(() => getThemeClasses())

// Assessment state
const currentQuestion = ref(1)
const answers = ref({})
const showResults = ref(false)
const results = ref({})

// Spiral Dynamics levels database
const spiralLevels = {
  'Beige': { label: 'Survival', color: 'bg-amber-100 border-amber-400', badge: 'bg-amber-100 text-amber-800' },
  'Purple': { label: 'Tribal', color: 'bg-purple-100 border-purple-400', badge: 'bg-purple-100 text-purple-800' },
  'Red': { label: 'Power', color: 'bg-red-100 border-red-400', badge: 'bg-red-100 text-red-800' },
  'Blue': { label: 'Order', color: 'bg-blue-100 border-blue-400', badge: 'bg-blue-100 text-blue-800' },
  'Orange': { label: 'Achievement', color: 'bg-orange-100 border-orange-400', badge: 'bg-orange-100 text-orange-800' },
  'Green': { label: 'Consensus', color: 'bg-green-100 border-green-400', badge: 'bg-green-100 text-green-800' },
  'Yellow': { label: 'Integration', color: 'bg-yellow-100 border-yellow-400', badge: 'bg-yellow-100 text-yellow-800' },
  'Turquoise': { label: 'Holistic', color: 'bg-teal-100 border-teal-400', badge: 'bg-teal-100 text-teal-800' }
}

// Questions array
const questions = ref([
  {
    type: 'multiple_choice',
    category: 'Leadership Style',
    question: 'Which leadership approach do you find most effective and appealing?',
    options: [
      {
        value: 'Blue',
        text: 'Clear Hierarchy and Structure',
        description: 'Well-defined roles, established procedures, and respect for authority',
        spiral_level: 'Blue',
        characteristics: 'Order, discipline, traditional values'
      },
      {
        value: 'Orange',
        text: 'Results-Oriented and Competitive',
        description: 'Focus on achievement, individual performance, and strategic goals',
        spiral_level: 'Orange',
        characteristics: 'Achievement, competition, efficiency'
      },
      {
        value: 'Green',
        text: 'Collaborative and Consensus-Building',
        description: 'Team input, shared decision-making, and inclusive processes',
        spiral_level: 'Green',
        characteristics: 'Harmony, equality, participation'
      },
      {
        value: 'Yellow',
        text: 'Adaptive and Systems-Thinking',
        description: 'Flexible approaches that consider complex interdependencies',
        spiral_level: 'Yellow',
        characteristics: 'Integration, flexibility, complexity'
      }
    ]
  },
  {
    type: 'preference_ranking',
    category: 'Organizational Values',
    question: 'Rank these organizational values by importance to you:',
    context: 'Consider which values would make you most engaged and productive in a workplace.',
    options: [
      {
        value: 'stability_security',
        text: 'Stability and Security',
        description: 'Job security, predictable environment, clear benefits',
        spiral_level: 'Blue'
      },
      {
        value: 'achievement_recognition',
        text: 'Achievement and Recognition',
        description: 'Individual success, merit-based rewards, competitive advancement',
        spiral_level: 'Orange'
      },
      {
        value: 'community_purpose',
        text: 'Community and Purpose',
        description: 'Social impact, team harmony, meaningful work',
        spiral_level: 'Green'
      },
      {
        value: 'innovation_growth',
        text: 'Innovation and Growth',
        description: 'Learning opportunities, creative freedom, personal development',
        spiral_level: 'Yellow'
      }
    ]
  },
  {
    type: 'multiple_choice',
    category: 'Decision Making',
    question: 'How do you prefer organizational decisions to be made?',
    options: [
      {
        value: 'Red',
        text: 'Quick and Decisive',
        description: 'Strong leaders make fast decisions with immediate action',
        spiral_level: 'Red',
        characteristics: 'Power, speed, direct action'
      },
      {
        value: 'Blue',
        text: 'Through Established Processes',
        description: 'Following proper procedures, protocols, and approval chains',
        spiral_level: 'Blue',
        characteristics: 'Order, process, compliance'
      },
      {
        value: 'Orange',
        text: 'Based on Data and Analysis',
        description: 'Using metrics, ROI analysis, and strategic planning',
        spiral_level: 'Orange',
        characteristics: 'Analysis, efficiency, results'
      },
      {
        value: 'Green',
        text: 'Through Group Consensus',
        description: 'Involving stakeholders and building agreement',
        spiral_level: 'Green',
        characteristics: 'Inclusion, harmony, participation'
      }
    ]
  },
  {
    type: 'preference_ranking',
    category: 'Work Environment',
    question: 'Rank these work environment characteristics by your preference:',
    options: [
      {
        value: 'structured_predictable',
        text: 'Structured and Predictable',
        description: 'Clear routines, defined processes, stable expectations',
        spiral_level: 'Blue'
      },
      {
        value: 'competitive_dynamic',
        text: 'Competitive and Dynamic',
        description: 'Fast-paced, performance-driven, results-focused',
        spiral_level: 'Orange'
      },
      {
        value: 'collaborative_supportive',
        text: 'Collaborative and Supportive',
        description: 'Team-oriented, inclusive, relationship-focused',
        spiral_level: 'Green'
      },
      {
        value: 'flexible_innovative',
        text: 'Flexible and Innovative',
        description: 'Adaptive, creative, experimental approaches',
        spiral_level: 'Yellow'
      }
    ]
  },
  {
    type: 'multiple_choice',
    category: 'Change Management',
    question: 'How do you prefer organizations to handle change?',
    context: 'Consider a significant organizational transformation or new initiative.',
    options: [
      {
        value: 'Blue',
        text: 'Planned and Systematic',
        description: 'Careful planning, clear communication, step-by-step implementation',
        spiral_level: 'Blue',
        characteristics: 'Order, stability, process'
      },
      {
        value: 'Orange',
        text: 'Strategic and Efficient',
        description: 'Business case driven, focused on competitive advantage',
        spiral_level: 'Orange',
        characteristics: 'Strategy, efficiency, results'
      },
      {
        value: 'Green',
        text: 'Inclusive and Participatory',
        description: 'Involving all stakeholders, addressing concerns and impacts',
        spiral_level: 'Green',
        characteristics: 'Inclusion, care, consensus'
      },
      {
        value: 'Yellow',
        text: 'Adaptive and Experimental',
        description: 'Testing approaches, learning from feedback, flexible adjustment',
        spiral_level: 'Yellow',
        characteristics: 'Adaptation, learning, complexity'
      }
    ]
  },
  {
    type: 'preference_ranking',
    category: 'Success Metrics',
    question: 'Rank what organizational success means to you:',
    options: [
      {
        value: 'financial_growth',
        text: 'Financial Performance and Growth',
        description: 'Profit, revenue growth, market share, shareholder value',
        spiral_level: 'Orange'
      },
      {
        value: 'employee_wellbeing',
        text: 'Employee Wellbeing and Satisfaction',
        description: 'Job satisfaction, work-life balance, team harmony',
        spiral_level: 'Green'
      },
      {
        value: 'stability_compliance',
        text: 'Stability and Compliance',
        description: 'Following regulations, maintaining standards, reducing risk',
        spiral_level: 'Blue'
      },
      {
        value: 'innovation_adaptability',
        text: 'Innovation and Adaptability',
        description: 'Learning capacity, creative solutions, system resilience',
        spiral_level: 'Yellow'
      }
    ]
  }
])

const selectAnswer = (value) => {
  answers.value[currentQuestion.value - 1] = value
}

const isAnswerComplete = () => {
  const question = questions.value[currentQuestion.value - 1]
  const answer = answers.value[currentQuestion.value - 1]
  
  if (question.type === 'preference_ranking') {
    if (!answer || typeof answer !== 'object') return false
    const rankings = Object.values(answer)
    const expectedCount = question.options.length
    return rankings.length === expectedCount && 
           rankings.every(r => r >= 1 && r <= expectedCount) &&
           new Set(rankings).size === expectedCount
  }
  
  return answer !== undefined && answer !== null
}

const getRanking = (optionValue) => {
  const answer = answers.value[currentQuestion.value - 1]
  return answer ? answer[optionValue] : ''
}

const updateRanking = (optionValue, rank) => {
  if (!answers.value[currentQuestion.value - 1]) {
    answers.value[currentQuestion.value - 1] = {}
  }
  
  const currentAnswer = answers.value[currentQuestion.value - 1]
  
  // Remove this rank from any other option
  Object.keys(currentAnswer).forEach(key => {
    if (currentAnswer[key] === parseInt(rank)) {
      delete currentAnswer[key]
    }
  })
  
  // Set new rank
  if (rank) {
    currentAnswer[optionValue] = parseInt(rank)
  } else {
    delete currentAnswer[optionValue]
  }
}

const nextQuestion = () => {
  if (currentQuestion.value < questions.value.length) {
    currentQuestion.value++
  } else {
    calculateResults()
    showResults.value = true
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 1) {
    currentQuestion.value--
  }
}

const calculateResults = () => {
  const spiralScores = {
    'Red': 0,
    'Blue': 0,
    'Orange': 0,
    'Green': 0,
    'Yellow': 0,
    'Turquoise': 0
  }
  
  // Calculate scores from answers
  Object.values(answers.value).forEach((answer, index) => {
    const question = questions.value[index]
    
    if (question.type === 'multiple_choice') {
      spiralScores[answer] += 5
    } else if (question.type === 'preference_ranking') {
      // Score based on ranking (1st = 5 points, 2nd = 4 points, etc.)
      Object.keys(answer).forEach(optionValue => {
        const rank = answer[optionValue]
        const option = question.options.find(o => o.value === optionValue)
        if (option) {
          const points = question.options.length - rank + 1
          spiralScores[option.spiral_level] += points
        }
      })
    }
  })
  
  // Find primary culture (highest score)
  const primaryLevel = Object.keys(spiralScores)
    .reduce((a, b) => spiralScores[a] > spiralScores[b] ? a : b)
  
  // Normalize scores to percentages
  const totalScore = Object.values(spiralScores).reduce((a, b) => a + b, 0)
  const spiralProfile = Object.keys(spiralScores).map(level => ({
    name: level,
    label: spiralLevels[level].label,
    score: totalScore > 0 ? Math.round((spiralScores[level] / totalScore) * 100) : 0
  })).sort((a, b) => b.score - a.score)
  
  results.value = {
    primary_culture: getPrimaryCulture(primaryLevel),
    spiral_profile: spiralProfile,
    ideal_environment: getIdealEnvironment(primaryLevel),
    compatibility_guide: getCompatibilityGuide(primaryLevel),
    development_recommendations: getDevelopmentRecommendations(primaryLevel, spiralProfile),
    career_strategy_tip: getCareerStrategyTip(primaryLevel)
  }
  
  // Save results to database
  saveResults()
}

const getPrimaryCulture = (level) => {
  const cultures = {
    'Blue': {
      name: 'Traditional Hierarchical',
      icon: '🏛️',
      description: 'You thrive in structured organizations with clear hierarchies, established processes, and stable environments. You value order, discipline, and working within proven systems.',
      values: ['Stability and security', 'Clear roles and responsibilities', 'Established procedures', 'Respect for authority'],
      motivations: ['Predictable work environment', 'Job security', 'Clear expectations', 'Recognized expertise'],
      border_color: 'border-blue-500'
    },
    'Orange': {
      name: 'Achievement-Oriented',
      icon: '🎯',
      description: 'You excel in competitive, results-driven environments that reward individual achievement and strategic thinking. You\'re motivated by success, recognition, and advancement opportunities.',
      values: ['Individual achievement', 'Competition and excellence', 'Strategic thinking', 'Merit-based rewards'],
      motivations: ['Career advancement', 'Financial success', 'Recognition and status', 'Professional challenges'],
      border_color: 'border-orange-500'
    },
    'Green': {
      name: 'Collaborative Community',
      icon: '🤝',
      description: 'You flourish in inclusive, people-centered organizations that prioritize team harmony, consensus building, and social impact. You value relationships and meaningful work.',
      values: ['Team collaboration', 'Inclusive decision making', 'Social responsibility', 'Work-life balance'],
      motivations: ['Meaningful work', 'Positive relationships', 'Social impact', 'Personal growth'],
      border_color: 'border-green-500'
    },
    'Yellow': {
      name: 'Adaptive Systems',
      icon: '🌀',
      description: 'You thrive in flexible, learning-oriented organizations that embrace complexity and change. You value autonomy, continuous learning, and the ability to adapt and innovate.',
      values: ['Flexibility and autonomy', 'Continuous learning', 'Systems thinking', 'Innovation and creativity'],
      motivations: ['Intellectual challenges', 'Creative freedom', 'Learning opportunities', 'Complex problem solving'],
      border_color: 'border-yellow-500'
    },
    'Red': {
      name: 'Power-Driven',
      icon: '⚡',
      description: 'You prefer dynamic, action-oriented environments where quick decisions are made and results happen fast. You value strength, directness, and the ability to influence outcomes.',
      values: ['Quick action', 'Direct communication', 'Power and influence', 'Immediate results'],
      motivations: ['Control and autonomy', 'Immediate impact', 'Challenge and excitement', 'Recognition of strength'],
      border_color: 'border-red-500'
    },
    'Turquoise': {
      name: 'Holistic Integration',
      icon: '🌍',
      description: 'You seek organizations that integrate multiple perspectives and work toward global sustainability and consciousness. You value wisdom, interconnectedness, and long-term thinking.',
      values: ['Global perspective', 'Sustainable practices', 'Integrated thinking', 'Conscious evolution'],
      motivations: ['Global impact', 'Spiritual growth', 'Wisdom development', 'Planetary wellbeing'],
      border_color: 'border-teal-500'
    }
  }
  
  return cultures[level] || cultures['Orange']
}

const getIdealEnvironment = (primaryLevel) => {
  const environments = {
    'Blue': {
      energizers: ['Clear policies and procedures', 'Stable, predictable workflow', 'Defined career paths', 'Respect for experience and expertise', 'Quality standards and compliance'],
      drainers: ['Constant change and uncertainty', 'Unclear expectations', 'Disrespect for authority', 'Chaotic, unstructured work', 'Unrealistic deadlines']
    },
    'Orange': {
      energizers: ['Performance-based rewards', 'Competitive challenges', 'Strategic decision making', 'Individual recognition', 'Growth opportunities'],
      drainers: ['Bureaucratic red tape', 'Group consensus requirements', 'Unclear success metrics', 'Limited advancement opportunities', 'Emotional decision making']
    },
    'Green': {
      energizers: ['Team collaboration', 'Inclusive decision making', 'Social impact focus', 'Supportive relationships', 'Work-life balance'],
      drainers: ['Cutthroat competition', 'Exclusionary practices', 'Pure profit focus', 'Individual blame culture', 'Neglect of people\'s needs']
    },
    'Yellow': {
      energizers: ['Complex challenges', 'Learning opportunities', 'Flexible work arrangements', 'Systems thinking projects', 'Innovation freedom'],
      drainers: ['Rigid procedures', 'Micromanagement', 'Simplistic solutions', 'Resistance to change', 'Narrow specialization']
    }
  }
  
  return environments[primaryLevel] || environments['Orange']
}

const getCompatibilityGuide = (primaryLevel) => {
  const guides = {
    'Blue': [
      { type: 'Excellent Fit', icon: '🌟', organizations: ['Government agencies', 'Healthcare systems', 'Financial institutions', 'Educational institutions'] },
      { type: 'Good Fit', icon: '👍', organizations: ['Large corporations', 'Manufacturing companies', 'Insurance companies', 'Consulting firms'] },
      { type: 'Challenging Fit', icon: '⚠️', organizations: ['Startups', 'Creative agencies', 'Social enterprises', 'Tech companies'] }
    ],
    'Orange': [
      { type: 'Excellent Fit', icon: '🌟', organizations: ['Corporate enterprises', 'Sales organizations', 'Investment firms', 'Tech companies'] },
      { type: 'Good Fit', icon: '👍', organizations: ['Consulting firms', 'Marketing agencies', 'Financial services', 'Manufacturing'] },
      { type: 'Challenging Fit', icon: '⚠️', organizations: ['Non-profits', 'Government agencies', 'Healthcare systems', 'Academic institutions'] }
    ],
    'Green': [
      { type: 'Excellent Fit', icon: '🌟', organizations: ['Non-profit organizations', 'Social enterprises', 'Healthcare systems', 'Educational institutions'] },
      { type: 'Good Fit', icon: '👍', organizations: ['B-Corp companies', 'Community organizations', 'Environmental groups', 'Cooperative businesses'] },
      { type: 'Challenging Fit', icon: '⚠️', organizations: ['Highly competitive firms', 'Investment banking', 'Sales-driven companies', 'Hierarchical corporations'] }
    ],
    'Yellow': [
      { type: 'Excellent Fit', icon: '🌟', organizations: ['Innovation labs', 'Research institutions', 'Tech startups', 'Consulting firms'] },
      { type: 'Good Fit', icon: '👍', organizations: ['Creative agencies', 'Think tanks', 'Universities', 'Social ventures'] },
      { type: 'Challenging Fit', icon: '⚠️', organizations: ['Traditional corporations', 'Government bureaucracies', 'Highly structured organizations', 'Manufacturing plants'] }
    ]
  }
  
  return guides[primaryLevel] || guides['Orange']
}

const getDevelopmentRecommendations = (primaryLevel, spiralProfile) => {
  const recommendations = [
    {
      title: 'Expand Your Cultural Intelligence',
      description: 'Develop appreciation for different organizational approaches and value systems',
      actions: [
        'Study other successful organizational models',
        'Interview people who thrive in different cultural environments',
        'Practice adapting your communication style to different audiences'
      ],
      focus_areas: ['Cultural Awareness', 'Flexibility', 'Communication']
    },
    {
      title: 'Identify Your Non-Negotiables',
      description: 'Clearly define which cultural elements are essential for your peak performance',
      actions: [
        'List your top 5 must-have organizational characteristics',
        'Identify deal-breakers that significantly impact your performance',
        'Create questions to assess cultural fit during job interviews'
      ],
      focus_areas: ['Self-Awareness', 'Career Planning', 'Values Clarification']
    },
    {
      title: 'Build Cross-Level Collaboration Skills',
      description: 'Learn to work effectively with people operating from different value systems',
      actions: [
        'Practice translating your ideas into different cultural languages',
        'Develop patience for approaches that feel unnatural to you',
        'Learn to find common ground across different worldviews'
      ],
      focus_areas: ['Collaboration', 'Communication', 'Leadership']
    }
  ]
  
  // Add specific recommendations based on secondary strengths
  const secondaryLevel = spiralProfile[1]?.name
  if (secondaryLevel && secondaryLevel !== primaryLevel) {
    recommendations.push({
      title: `Leverage Your Secondary ${spiralLevels[secondaryLevel].label} Strengths`,
      description: `Your secondary preference for ${secondaryLevel} values gives you flexibility`,
      actions: [
        `Apply ${spiralLevels[secondaryLevel].label} approaches when your primary style isn't effective`,
        'Use this flexibility to bridge different organizational cultures',
        'Develop this as a backup set of skills for challenging situations'
      ],
      focus_areas: ['Flexibility', 'Adaptability', 'Leadership']
    })
  }
  
  return recommendations
}

const getCareerStrategyTip = (primaryLevel) => {
  const tips = {
    'Blue': 'Seek organizations with clear advancement paths and value expertise. Highlight your reliability and systematic approach in interviews.',
    'Orange': 'Target results-driven organizations where individual achievement is recognized. Emphasize your track record and competitive advantages.',
    'Green': 'Look for purpose-driven organizations with collaborative cultures. Showcase your team-building and relationship skills.',
    'Yellow': 'Focus on innovative, learning-oriented environments that value adaptability. Highlight your systems thinking and complexity management skills.',
    'Red': 'Seek dynamic, action-oriented roles where you can drive immediate results. Emphasize your decisiveness and ability to handle pressure.',
    'Turquoise': 'Look for organizations working on global challenges with integrated approaches. Showcase your holistic thinking and wisdom.'
  }
  
  return tips[primaryLevel] || tips['Orange']
}

// Styling helper functions
const getSpiralColor = (level) => {
  return spiralLevels[level]?.color || 'bg-gray-100 border-gray-400'
}

const getSpiralBadgeColor = (level) => {
  return spiralLevels[level]?.badge || 'bg-gray-100 text-gray-800'
}

const getSpiralBarColor = (level) => {
  const colors = {
    'Red': 'bg-gradient-to-r from-red-400 to-red-600',
    'Blue': 'bg-gradient-to-r from-blue-400 to-blue-600',
    'Orange': 'bg-gradient-to-r from-orange-400 to-orange-600',
    'Green': 'bg-gradient-to-r from-green-400 to-green-600',
    'Yellow': 'bg-gradient-to-r from-yellow-400 to-yellow-600',
    'Turquoise': 'bg-gradient-to-r from-teal-400 to-teal-600'
  }
  return colors[level] || 'bg-gradient-to-r from-gray-400 to-gray-600'
}

const getScoreColor = (score) => {
  if (score >= 30) return 'text-green-600'
  if (score >= 20) return 'text-blue-600'
  if (score >= 10) return 'text-yellow-600'
  return 'text-gray-600'
}

const getRecommendationColor = (index) => {
  const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500']
  return colors[index] || 'bg-gray-500'
}

const saveResults = async () => {
  if (!user.value) return
  
  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: user.value.id,
          assessment_type: 'culture_fit',
          responses: answers.value,
          results: results.value,
          completed_at: new Date().toISOString()
        }
      ])
    
    if (error) throw error
  } catch (error) {
    console.error('Error saving assessment results:', error)
  }
}

const restartAssessment = () => {
  currentQuestion.value = 1
  answers.value = {}
  showResults.value = false
  results.value = {}
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

// Initialize theme
onMounted(() => {
  const { initTheme } = useTheme()
  initTheme()
})

// Dynamic head management
useHead({
  title: 'Organizational Culture Fit Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Identify your preferred organizational culture and development stage using the Spiral Dynamics model. Understand which organizational environments bring out your best.' }
  ]
})
</script>