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
        <div class="text-6xl mb-4">🔄</div>
        <div class="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-2">Knowledge Assessment</div>
        <h1 :class="`text-4xl font-bold ${themeClasses.textPrimary} mb-4`">Change Management Mastery</h1>
        <p :class="`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`">
          Evaluate your skills in leading organizational transformation, overcoming resistance to change, and implementing successful change initiatives. Based on proven change management frameworks.
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
          <h2 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">
            {{ questions[currentQuestion - 1].question }}
          </h2>
          
          <div v-if="questions[currentQuestion - 1].scenario" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mb-6 border-l-4 border-indigo-500`">
            <div class="font-semibold text-indigo-600 mb-2">Scenario:</div>
            <div :class="themeClasses.textSecondary">{{ questions[currentQuestion - 1].scenario }}</div>
          </div>
        </div>

        <!-- Multiple Choice Questions -->
        <div v-if="questions[currentQuestion - 1].type === 'multiple_choice'" class="space-y-3 mb-8">
          <button
            v-for="option in questions[currentQuestion - 1].options"
            :key="option.value"
            @click="selectAnswer(option.value)"
            :class="`w-full text-left p-4 rounded-lg border-2 transition-all ${
              answers[currentQuestion - 1] === option.value
                ? `${themeClasses.borderPrimary} ${themeClasses.backgroundPrimary}`
                : `${themeClasses.borderColor} ${themeClasses.cardHover}`
            }`"
          >
            <div class="flex items-start space-x-3">
              <div :class="`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                answers[currentQuestion - 1] === option.value ? 'bg-indigo-500 border-indigo-500' : themeClasses.borderColor
              }`">
                <div v-if="answers[currentQuestion - 1] === option.value" class="w-full h-full rounded-full bg-white scale-50"></div>
              </div>
              <div>
                <div :class="`font-medium ${themeClasses.textPrimary}`">{{ option.text }}</div>
                <div v-if="option.description" :class="`text-sm ${themeClasses.textSecondary} mt-1`">{{ option.description }}</div>
              </div>
            </div>
          </button>
        </div>

        <!-- Scale Questions -->
        <div v-if="questions[currentQuestion - 1].type === 'scale'" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <span :class="`text-sm ${themeClasses.textSecondary}`">{{ questions[currentQuestion - 1].scaleLabels[0] }}</span>
            <span :class="`text-sm ${themeClasses.textSecondary}`">{{ questions[currentQuestion - 1].scaleLabels[1] }}</span>
          </div>
          <div class="flex justify-between space-x-2">
            <button
              v-for="value in [1, 2, 3, 4, 5]"
              :key="value"
              @click="selectAnswer(value)"
              :class="`w-12 h-12 rounded-full border-2 transition-all ${
                answers[currentQuestion - 1] === value
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : `${themeClasses.borderColor} ${themeClasses.textSecondary} hover:border-indigo-300`
              }`"
            >
              {{ value }}
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <button
            v-if="currentQuestion > 1"
            @click="previousQuestion"
            :class="`px-6 py-2 rounded-lg ${themeClasses.buttonSecondary} transition-colors`"
          >
            Previous
          </button>
          <div v-else></div>
          
          <button
            @click="nextQuestion"
            :disabled="!answers[currentQuestion - 1]"
            :class="`px-6 py-2 rounded-lg font-medium transition-colors ${
              answers[currentQuestion - 1]
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : `${themeClasses.buttonDisabled} cursor-not-allowed`
            }`"
          >
            {{ currentQuestion === questions.length ? 'Complete Assessment' : 'Next' }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="space-y-8">
        <!-- Overall Score -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8 text-center`">
          <div class="text-6xl mb-4">{{ getScoreEmoji(results.overall_score) }}</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">{{ results.proficiency_level }}</h2>
          <p :class="`text-xl ${themeClasses.textSecondary} mb-6`">Change Management Mastery</p>
          
          <div class="max-w-2xl mx-auto">
            <div class="flex justify-between items-center mb-2">
              <span :class="`font-medium ${themeClasses.textPrimary}`">Overall Score</span>
              <span :class="`font-bold ${themeClasses.textPrimary}`">{{ results.overall_score }}/100</span>
            </div>
            <div :class="`w-full bg-gray-200 rounded-full h-3 ${themeClasses.borderColor} border`">
              <div 
                :class="`h-3 rounded-full transition-all duration-1000 delay-500 ${getScoreColor(results.overall_score)}`"
                :style="`width: ${results.overall_score}%`"
              ></div>
            </div>
          </div>
        </div>

        <!-- Competency Breakdown -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Competency Analysis</h3>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div v-for="competency in results.competencies" :key="competency.name" class="space-y-3">
              <div class="flex justify-between items-center">
                <span :class="`font-medium ${themeClasses.textPrimary}`">{{ competency.name }}</span>
                <span :class="`text-sm font-bold ${getCompetencyColor(competency.score)}`">
                  {{ competency.score }}/5
                </span>
              </div>
              <div :class="`w-full bg-gray-200 rounded-full h-2 ${themeClasses.borderColor} border`">
                <div 
                  :class="`h-2 rounded-full transition-all duration-1000 ${getCompetencyBarColor(competency.score)}`"
                  :style="`width: ${(competency.score / 5) * 100}%`"
                ></div>
              </div>
              <p :class="`text-sm ${themeClasses.textSecondary}`">{{ competency.description }}</p>
            </div>
          </div>
        </div>

        <!-- Development Plan -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Development Plan</h3>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h4 :class="`text-lg font-semibold ${themeClasses.textPrimary} mb-4 flex items-center`">
                <span class="mr-2">💪</span> Strengths to Leverage
              </h4>
              <ul class="space-y-2">
                <li v-for="strength in results.strengths" :key="strength" class="flex items-start space-x-2">
                  <span class="text-green-500 mt-1">✓</span>
                  <span :class="themeClasses.textSecondary">{{ strength }}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 :class="`text-lg font-semibold ${themeClasses.textPrimary} mb-4 flex items-center`">
                <span class="mr-2">🎯</span> Areas for Development
              </h4>
              <ul class="space-y-2">
                <li v-for="area in results.development_areas" :key="area" class="flex items-start space-x-2">
                  <span class="text-orange-500 mt-1">→</span>
                  <span :class="themeClasses.textSecondary">{{ area }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Action Plan -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Recommended Actions</h3>
          
          <div class="space-y-6">
            <div v-for="(action, index) in results.action_plan" :key="index" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4`">
              <div class="flex items-start space-x-3">
                <div class="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-1`">{{ action.title }}</h4>
                  <p :class="`${themeClasses.textSecondary} text-sm mb-2`">{{ action.description }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="tag in action.tags" :key="tag" class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                      {{ tag }}
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

// Questions array
const questions = ref([
  {
    type: 'multiple_choice',
    category: 'Change Strategy',
    question: 'A major organizational transformation requires implementation across 5,000+ employees in multiple countries. What approach would be most effective?',
    scenario: 'Your company is implementing a new digital platform that will change core business processes. Initial pilot programs showed 30% resistance rates, and leadership wants full deployment within 12 months.',
    options: [
      {
        value: 'big_bang',
        text: 'Big Bang Approach',
        description: 'Implement all changes simultaneously across all locations'
      },
      {
        value: 'phased_rollout',
        text: 'Phased Geographic Rollout',
        description: 'Deploy region by region with lessons learned integration'
      },
      {
        value: 'pilot_expansion',
        text: 'Pilot-Based Expansion',
        description: 'Start with enthusiastic early adopters, then expand gradually'
      },
      {
        value: 'parallel_systems',
        text: 'Parallel Systems',
        description: 'Run old and new systems simultaneously during transition'
      }
    ]
  },
  {
    type: 'scale',
    category: 'Stakeholder Management',
    question: 'How important is it to identify and engage "change champions" before announcing a major transformation?',
    scaleLabels: ['Not important', 'Extremely important']
  },
  {
    type: 'multiple_choice',
    category: 'Resistance Management',
    question: 'You discover that middle management is actively undermining the change initiative. What is your priority response?',
    scenario: 'Survey data shows that while senior leadership supports the change (85% approval) and front-line employees are neutral (50% approval), middle managers are actively resistant (25% approval) and are influencing their teams negatively.',
    options: [
      {
        value: 'direct_confrontation',
        text: 'Direct Confrontation',
        description: 'Address the resistance head-on in management meetings'
      },
      {
        value: 'understand_concerns',
        text: 'Deep Dive Investigation',
        description: 'Understand root causes of middle management resistance'
      },
      {
        value: 'incentive_realignment',
        text: 'Incentive Restructuring',
        description: 'Modify performance metrics to align with change objectives'
      },
      {
        value: 'coalition_building',
        text: 'Coalition Building',
        description: 'Build alliances with supportive managers to influence peers'
      }
    ]
  },
  {
    type: 'multiple_choice',
    category: 'Communication Strategy',
    question: 'During a transformation, negative rumors are spreading faster than official communications. How do you respond?',
    scenario: 'Despite regular town halls and email updates, misinformation is circulating about job cuts (which aren\'t planned) and the company being sold (which isn\'t happening). Employee anxiety is high.',
    options: [
      {
        value: 'increase_frequency',
        text: 'Increase Communication Frequency',
        description: 'Send more frequent official updates to crowd out rumors'
      },
      {
        value: 'address_directly',
        text: 'Address Rumors Directly',
        description: 'Explicitly acknowledge and counter specific false information'
      },
      {
        value: 'peer_networks',
        text: 'Activate Peer Networks',
        description: 'Empower trusted employees to share accurate information'
      },
      {
        value: 'interactive_sessions',
        text: 'Interactive Q&A Sessions',
        description: 'Host open forums where employees can voice concerns directly'
      }
    ]
  },
  {
    type: 'scale',
    category: 'Change Readiness',
    question: 'How critical is it to assess organizational change readiness before initiating a transformation?',
    scaleLabels: ['Nice to have', 'Absolutely critical']
  },
  {
    type: 'multiple_choice',
    category: 'Cultural Change',
    question: 'The transformation requires shifting from a risk-averse culture to one that embraces calculated risk-taking. What is your primary lever?',
    scenario: 'Your organization has historically rewarded playing it safe and avoiding mistakes. The new business model requires innovation, experimentation, and accepting that some initiatives will fail.',
    options: [
      {
        value: 'leadership_modeling',
        text: 'Leadership Behavior Modeling',
        description: 'Have leaders visibly take calculated risks and share learnings'
      },
      {
        value: 'reward_systems',
        text: 'Reward System Overhaul',
        description: 'Restructure incentives to reward smart risk-taking'
      },
      {
        value: 'failure_celebration',
        text: 'Failure Celebration Events',
        description: 'Create forums to share and learn from intelligent failures'
      },
      {
        value: 'training_programs',
        text: 'Risk Assessment Training',
        description: 'Train employees in structured risk evaluation methods'
      }
    ]
  },
  {
    type: 'multiple_choice',
    category: 'Implementation',
    question: 'Six months into a major transformation, progress is behind schedule but quality is good. Leadership wants to accelerate. Your recommendation?',
    scenario: 'Original timeline: 18 months. Current status: 6 months in, 25% complete (should be 33%). No major quality issues. Leadership considering adding more resources or reducing scope.',
    options: [
      {
        value: 'maintain_pace',
        text: 'Maintain Current Pace',
        description: 'Continue current approach to preserve quality and adoption'
      },
      {
        value: 'add_resources',
        text: 'Add Resources',
        description: 'Bring in additional team members to accelerate delivery'
      },
      {
        value: 'reduce_scope',
        text: 'Reduce Scope',
        description: 'Prioritize core features and defer nice-to-have elements'
      },
      {
        value: 'parallel_workstreams',
        text: 'Parallel Workstreams',
        description: 'Reorganize work to enable more concurrent activities'
      }
    ]
  },
  {
    type: 'scale',
    category: 'Measurement',
    question: 'How important is it to establish baseline metrics before implementing organizational changes?',
    scaleLabels: ['Not necessary', 'Absolutely essential']
  },
  {
    type: 'multiple_choice',
    category: 'Sustainability',
    question: 'The initial change implementation was successful, but you\'re seeing signs of regression after 6 months. What is your priority?',
    scenario: 'New processes were adopted well initially with 80% compliance, but recent metrics show compliance dropping to 60% and some teams reverting to old ways of working.',
    options: [
      {
        value: 'refresher_training',
        text: 'Refresher Training',
        description: 'Provide additional training sessions on new processes'
      },
      {
        value: 'system_constraints',
        text: 'System Constraints',
        description: 'Make it harder to revert by building new processes into systems'
      },
      {
        value: 'continuous_reinforcement',
        text: 'Continuous Reinforcement',
        description: 'Establish ongoing coaching and feedback mechanisms'
      },
      {
        value: 'investigation',
        text: 'Root Cause Investigation',
        description: 'Understand why people are reverting to old behaviors'
      }
    ]
  },
  {
    type: 'multiple_choice',
    category: 'Leadership Alignment',
    question: 'You discover that two senior leaders have conflicting visions for the transformation. How do you proceed?',
    scenario: 'The CEO wants aggressive, fast change to beat competitors. The COO prefers gradual, risk-managed implementation. Both are influential, and their teams are receiving mixed messages.',
    options: [
      {
        value: 'facilitate_alignment',
        text: 'Facilitate Alignment Session',
        description: 'Bring leaders together to resolve their strategic differences'
      },
      {
        value: 'escalate_board',
        text: 'Escalate to Board',
        description: 'Involve board or higher authority to make the decision'
      },
      {
        value: 'compromise_approach',
        text: 'Develop Compromise',
        description: 'Create a hybrid approach that addresses both concerns'
      },
      {
        value: 'data_driven',
        text: 'Data-Driven Resolution',
        description: 'Present analysis to help leaders make informed decision'
      }
    ]
  }
])

const selectAnswer = (value) => {
  answers.value[currentQuestion.value - 1] = value
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
  const answerValues = Object.values(answers.value)
  
  // Calculate competency scores
  const competencyScores = {
    'Change Strategy': 0,
    'Stakeholder Management': 0,
    'Resistance Management': 0,
    'Communication': 0,
    'Implementation': 0,
    'Sustainability': 0
  }
  
  // Score mapping for different question types
  answerValues.forEach((answer, index) => {
    const question = questions.value[index]
    let score = 0
    
    if (question.type === 'scale') {
      score = answer
    } else if (question.type === 'multiple_choice') {
      // Strategic scoring based on best practices
      const optimalChoices = {
        0: 'phased_rollout', // Strategic implementation
        2: 'understand_concerns', // Resistance management  
        3: 'peer_networks', // Communication strategy
        5: 'leadership_modeling', // Cultural change
        6: 'maintain_pace', // Implementation quality
        8: 'investigation', // Sustainability
        9: 'facilitate_alignment' // Leadership alignment
      }
      score = answer === optimalChoices[index] ? 5 : answer === 'direct_confrontation' ? 2 : 3
    }
    
    // Assign to competency categories
    if (index <= 1) competencyScores['Change Strategy'] += score
    else if (index <= 3) competencyScores['Stakeholder Management'] += score
    else if (index <= 4) competencyScores['Resistance Management'] += score
    else if (index <= 6) competencyScores['Communication'] += score
    else if (index <= 7) competencyScores['Implementation'] += score
    else competencyScores['Sustainability'] += score
  })
  
  // Normalize scores and calculate overall
  const competencies = Object.keys(competencyScores).map(key => ({
    name: key,
    score: Math.round((competencyScores[key] / 10) * 5),
    description: getCompetencyDescription(key)
  }))
  
  const overallScore = Math.round((Object.values(competencyScores).reduce((a, b) => a + b, 0) / 60) * 100)
  
  results.value = {
    overall_score: overallScore,
    proficiency_level: getProficiencyLevel(overallScore),
    competencies: competencies,
    strengths: getStrengths(competencies),
    development_areas: getDevelopmentAreas(competencies),
    action_plan: getActionPlan(overallScore, competencies)
  }
  
  // Save results to database
  saveResults()
}

const getCompetencyDescription = (competency) => {
  const descriptions = {
    'Change Strategy': 'Developing comprehensive transformation approaches and selecting optimal implementation methods',
    'Stakeholder Management': 'Identifying, engaging, and managing key stakeholders throughout the change process',
    'Resistance Management': 'Understanding and addressing resistance to change at individual and organizational levels',
    'Communication': 'Creating clear, compelling communication strategies that support change adoption',
    'Implementation': 'Managing the execution of change initiatives with appropriate pacing and resource allocation',
    'Sustainability': 'Ensuring changes stick and become embedded in organizational culture and processes'
  }
  return descriptions[competency] || ''
}

const getProficiencyLevel = (score) => {
  if (score >= 90) return 'Change Leadership Expert'
  if (score >= 80) return 'Advanced Change Manager'
  if (score >= 70) return 'Competent Change Leader'
  if (score >= 60) return 'Developing Change Agent'
  return 'Beginning Change Practitioner'
}

const getStrengths = (competencies) => {
  return competencies
    .filter(c => c.score >= 4)
    .map(c => `Strong ${c.name.toLowerCase()} capabilities`)
}

const getDevelopmentAreas = (competencies) => {
  return competencies
    .filter(c => c.score <= 3)
    .map(c => `Enhance ${c.name.toLowerCase()} skills and approaches`)
}

const getActionPlan = (overallScore, competencies) => {
  const actions = [
    {
      title: 'Study Change Management Frameworks',
      description: 'Deep dive into Kotter, ADKAR, and other proven methodologies',
      tags: ['Learning', 'Frameworks', 'Best Practices']
    },
    {
      title: 'Build Stakeholder Mapping Skills',
      description: 'Practice identifying and analyzing stakeholder influence and impact',
      tags: ['Stakeholders', 'Analysis', 'Strategy']
    },
    {
      title: 'Develop Communication Plans',
      description: 'Create multi-channel communication strategies for different audiences',
      tags: ['Communication', 'Planning', 'Messaging']
    }
  ]
  
  // Add specific actions based on weak areas
  const weakAreas = competencies.filter(c => c.score <= 3)
  weakAreas.forEach(area => {
    if (area.name === 'Resistance Management') {
      actions.push({
        title: 'Master Resistance Handling',
        description: 'Learn advanced techniques for understanding and addressing change resistance',
        tags: ['Resistance', 'Psychology', 'Intervention']
      })
    }
    if (area.name === 'Sustainability') {
      actions.push({
        title: 'Focus on Change Sustainability',
        description: 'Study methods for embedding changes and preventing regression',
        tags: ['Sustainability', 'Culture', 'Systems']
      })
    }
  })
  
  return actions.slice(0, 5)
}

const getScoreEmoji = (score) => {
  if (score >= 90) return '🏆'
  if (score >= 80) return '🌟'
  if (score >= 70) return '💪'
  if (score >= 60) return '📈'
  return '🌱'
}

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-gradient-to-r from-green-400 to-green-600'
  if (score >= 60) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  if (score >= 40) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  return 'bg-gradient-to-r from-red-400 to-red-600'
}

const getCompetencyColor = (score) => {
  if (score >= 4) return 'text-green-600'
  if (score >= 3) return 'text-blue-600'
  if (score >= 2) return 'text-yellow-600'
  return 'text-red-600'
}

const getCompetencyBarColor = (score) => {
  if (score >= 4) return 'bg-gradient-to-r from-green-400 to-green-600'
  if (score >= 3) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  if (score >= 2) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  return 'bg-gradient-to-r from-red-400 to-red-600'
}

const saveResults = async () => {
  if (!user.value) return
  
  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: user.value.id,
          assessment_type: 'change_management',
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
  title: 'Change Management Mastery Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Evaluate your skills in leading organizational transformation, overcoming resistance to change, and implementing successful change initiatives.' }
  ]
})
</script>