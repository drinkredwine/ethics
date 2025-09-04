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
            <h1 :class="`text-xl font-bold ${themeClasses.navTextAccent}`">
              Personal Motivations Assessment
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeSwitcher />
            <LanguagePicker />
            <span :class="themeClasses.navTextSecondary"
              >Question {{ currentQuestion + 1 }} of {{ questions.length }}
            </span>
            <span v-if="user" :class="themeClasses.navTextSecondary">{{ user.email }}</span>
            <button @click="logout" :class="`${themeClasses.navTextSecondary} ${themeClasses.navTextHover}`">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div :class="`${themeClasses.progressBackground} rounded-full h-3`">
          <div
            :class="`${themeClasses.progressBar} h-3 rounded-full transition-all duration-300`"
            :style="{
              width: `${(currentQuestion / questions.length) * 100}%`,
            }"
          ></div>
        </div>
        <div :class="`flex justify-between text-sm ${themeClasses.textMuted} mt-2`">
          <span>Progress: {{ Math.round((currentQuestion / questions.length) * 100) }}%</span>
          <span>Estimated time remaining: {{ Math.ceil((questions.length - currentQuestion) * 0.8) }} minutes</span>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" :class="`${themeClasses.cardBackground} rounded-lg ${themeClasses.cardShadow} p-8`">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🎯</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">
            Assessment Complete!
          </h2>
          <div :class="`text-lg ${themeClasses.textSecondary}`">
            Your personal motivation profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Motivation Categories -->
          <div class="grid md:grid-cols-2 gap-6">
            <div 
              v-for="(category, key) in results.motivations" 
              :key="key"
              :class="`${themeClasses.featureBackground} rounded-xl p-6`"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 :class="`text-lg font-bold ${themeClasses.textPrimary}`">{{ getCategoryName(key) }}</h3>
                <div :class="`text-2xl font-bold ${themeClasses.textAccent}`">{{ category.score }}%</div>
              </div>
              
              <!-- Progress bar for this category -->
              <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-3 mb-3`">
                <div 
                  :class="`${themeClasses.progressBar} h-3 rounded-full transition-all duration-1000`"
                  :style="{ width: `${category.score}%` }"
                ></div>
              </div>
              
              <p :class="`${themeClasses.textSecondary} text-sm mb-2`">{{ category.description }}</p>
              <div :class="`text-xs ${themeClasses.textMuted}`">
                <strong>{{ category.level }}:</strong> {{ category.interpretation }}
              </div>
            </div>
          </div>

          <!-- Primary Driver -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderAccent}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Primary Motivational Driver</h3>
            <div class="prose max-w-none">
              <div :class="`text-3xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.primaryDriver.name }}</div>
              <p :class="`${themeClasses.textSecondary} leading-relaxed mb-4`">{{ results.primaryDriver.description }}</p>
              <div :class="`bg-gradient-to-r ${themeClasses.gradientBackground} p-4 rounded-lg`">
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Actionable Insights:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                  <li v-for="insight in results.primaryDriver.insights" :key="insight">{{ insight }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Overall Summary -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Motivational Profile</h3>
            <div class="prose max-w-none">
              <p :class="`${themeClasses.textSecondary} leading-relaxed`">{{ results.summary }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <NuxtLink
              :to="$localePath('/profile')"
              :class="`flex-1 ${themeClasses.buttonPrimary} text-center py-3 px-6 rounded-lg font-medium`"
            >
              View Full Profile
            </NuxtLink>
            <NuxtLink
              :to="$localePath('/')"
              :class="`flex-1 ${themeClasses.buttonSecondary} text-center py-3 px-6 rounded-lg`"
            >
              Take Another Test
            </NuxtLink>
            <button
              @click="retakeTest"
              :class="`flex-1 ${themeClasses.buttonTertiary} text-center py-3 px-6 rounded-lg`"
            >
              Retake This Test
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else class="text-center py-12">
          <div :class="`animate-spin rounded-full h-12 w-12 border-b-2 ${themeClasses.borderAccent} mx-auto mb-4`"></div>
          <p :class="themeClasses.textSecondary">Analyzing your motivations...</p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else :class="`${themeClasses.cardBackground} rounded-lg ${themeClasses.cardShadow} p-8`">
        <div class="mb-8">
          <h2 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6`">
            {{ questions[currentQuestion]?.title }}
          </h2>
          <div :class="`${themeClasses.featureBackground} p-6 rounded-lg border-l-4 ${themeClasses.borderAccent}`">
            <p :class="`text-lg ${themeClasses.textPrimary} font-medium`">
              {{ questions[currentQuestion]?.question }}
            </p>
          </div>
        </div>

        <!-- Answer Options -->
        <div class="mb-8">
          <div v-if="questions[currentQuestion]?.type === 'multiple_choice'" class="space-y-3">
            <button
              v-for="(option, index) in questions[currentQuestion]?.options"
              :key="index"
              @click="selectAnswer(option.value || index)"
              :class="{
                [`${themeClasses.buttonPrimary} border-transparent`]: selectedAnswer === (option.value || index),
                [`${themeClasses.cardBackground} ${themeClasses.textPrimary} ${themeClasses.borderSecondary}`]: selectedAnswer !== (option.value || index)
              }"
              class="w-full p-4 border-2 rounded-lg transition-all duration-200 text-left hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-500"
            >
              <div class="font-semibold mb-2">{{ option.text }}</div>
              <div v-if="option.description" :class="`text-sm ${selectedAnswer === (option.value || index) ? 'text-white opacity-90' : themeClasses.textMuted}`">
                {{ option.description }}
              </div>
            </button>
          </div>

          <div v-else-if="questions[currentQuestion]?.type === 'scale'" class="space-y-4">
            <div class="text-center">
              <div :class="`grid grid-cols-5 gap-2 max-w-md mx-auto`">
                <button
                  v-for="n in 5"
                  :key="n"
                  @click="selectAnswer(n)"
                  :class="{
                    [`${themeClasses.buttonPrimary} border-transparent`]: selectedAnswer === n,
                    [`${themeClasses.cardBackground} ${themeClasses.textPrimary} ${themeClasses.borderSecondary} hover:${themeClasses.borderAccent}`]: selectedAnswer !== n
                  }"
                  class="p-3 border-2 rounded-lg transition-all duration-200"
                >
                  {{ n }}
                </button>
              </div>
              <div :class="`flex justify-between text-sm ${themeClasses.textMuted} mt-2 max-w-md mx-auto`">
                <span>{{ questions[currentQuestion]?.scale?.low || 'Strongly Disagree' }}</span>
                <span>{{ questions[currentQuestion]?.scale?.high || 'Strongly Agree' }}</span>
              </div>
            </div>
          </div>

          <div v-else-if="questions[currentQuestion]?.type === 'text'" class="space-y-4">
            <textarea
              v-model="textAnswer"
              :placeholder="questions[currentQuestion]?.placeholder || 'Share your thoughts...'"
              :class="`w-full p-4 rounded-lg border-2 ${themeClasses.borderSecondary} ${themeClasses.cardBackground} ${themeClasses.textPrimary} focus:${themeClasses.borderAccent} focus:outline-none resize-none`"
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <button
            v-if="currentQuestion > 0"
            @click="previousQuestion"
            :class="`px-6 py-3 ${themeClasses.buttonSecondary} rounded-lg transition-colors`"
          >
            ← Previous
          </button>
          <div v-else></div>

          <button
            @click="nextQuestion"
            :disabled="!canProceed"
            :class="{
              [`${themeClasses.buttonPrimary}`]: canProceed,
              [`${themeClasses.buttonDisabled} cursor-not-allowed`]: !canProceed
            }"
            class="px-8 py-3 rounded-lg transition-colors font-medium"
          >
            {{
              currentQuestion === questions.length - 1
                ? 'Complete Assessment'
                : 'Next →'
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { getThemeClasses } = useTheme()

// Get theme classes
const themeClasses = computed(() => getThemeClasses())

// Assessment state
const currentQuestion = ref(0)
const selectedAnswer = ref(null)
const textAnswer = ref('')
const responses = ref([])
const assessmentComplete = ref(false)
const results = ref(null)

// Questions for Personal Motivations Assessment
const questions = ref([
  // Fear vs Passion Drivers
  {
    title: "Motivation Source",
    question: "When making important life decisions, what primarily drives you?",
    type: "multiple_choice",
    category: "driver_type",
    options: [
      { text: "Moving toward exciting opportunities and possibilities", value: "passion", description: "I'm energized by potential gains and new experiences" },
      { text: "Moving away from problems and negative outcomes", value: "fear", description: "I focus on avoiding risks and protecting what I have" },
      { text: "A balance of both excitement and caution", value: "balanced", description: "I consider both opportunities and risks equally" },
      { text: "External expectations and responsibilities", value: "external", description: "I'm guided by what others expect or what I should do" }
    ]
  },
  
  // Core Values
  {
    title: "Value Priority",
    question: "Which of these matters most to you in your daily life?",
    type: "multiple_choice",
    category: "values",
    options: [
      { text: "Freedom and autonomy", value: "freedom", description: "Having control over my choices and lifestyle" },
      { text: "Security and stability", value: "security", description: "Predictable income, relationships, and environment" },
      { text: "Growth and learning", value: "growth", description: "Constantly developing new skills and understanding" },
      { text: "Connection and belonging", value: "connection", description: "Deep relationships and being part of something meaningful" },
      { text: "Achievement and recognition", value: "achievement", description: "Accomplishing goals and being acknowledged for it" }
    ]
  },

  // Work Motivation
  {
    title: "Work Drive",
    question: "What motivates you most in your work or career?",
    type: "multiple_choice",
    category: "work_motivation",
    options: [
      { text: "The challenge and intellectual stimulation", value: "challenge", description: "I love solving complex problems and learning new things" },
      { text: "Making a positive impact on others", value: "impact", description: "Knowing my work helps people or improves the world" },
      { text: "Financial rewards and career advancement", value: "advancement", description: "Building wealth and climbing the career ladder" },
      { text: "Creative expression and innovation", value: "creativity", description: "Bringing new ideas to life and doing things differently" },
      { text: "Collaboration and team success", value: "collaboration", description: "Working with others to achieve shared goals" }
    ]
  },

  // Risk Tolerance
  {
    title: "Risk Approach",
    question: "How do you typically approach uncertainty and risk?",
    type: "scale",
    category: "risk_tolerance",
    scale: { low: "I avoid risks and prefer certainty", high: "I embrace risks and uncertainty" }
  },

  // Success Definition
  {
    title: "Success Meaning",
    question: "What does success mean to you personally?",
    type: "text",
    category: "success_definition",
    placeholder: "Describe what success looks like in your life..."
  },

  // Energy Source
  {
    title: "Energy Source",
    question: "When do you feel most energized and alive?",
    type: "multiple_choice",
    category: "energy_source",
    options: [
      { text: "When I'm learning something completely new", value: "learning", description: "Discovery and intellectual growth energize me" },
      { text: "When I'm helping others achieve their goals", value: "helping", description: "Supporting and empowering others gives me energy" },
      { text: "When I'm creating or building something original", value: "creating", description: "Bringing my ideas and visions into reality" },
      { text: "When I'm overcoming challenges and obstacles", value: "overcoming", description: "Conquering difficulties and proving myself" },
      { text: "When I'm connecting deeply with others", value: "connecting", description: "Meaningful relationships and emotional intimacy" }
    ]
  },

  // Fear Identification
  {
    title: "Core Fear",
    question: "What do you fear most about your future?",
    type: "multiple_choice",
    category: "core_fear",
    options: [
      { text: "Being trapped in a boring, unfulfilling life", value: "stagnation", description: "Missing out on experiences and growth" },
      { text: "Financial insecurity and instability", value: "insecurity", description: "Not having enough resources or security" },
      { text: "Being alone or disconnected from others", value: "isolation", description: "Lacking meaningful relationships and support" },
      { text: "Not reaching my full potential", value: "underachievement", description: "Wasting my talents and opportunities" },
      { text: "Losing control over my life circumstances", value: "powerlessness", description: "Being at the mercy of external forces" }
    ]
  },

  // Decision Making Style
  {
    title: "Decision Style",
    question: "When facing an important decision, you typically:",
    type: "multiple_choice",
    category: "decision_style",
    options: [
      { text: "Analyze all options thoroughly before deciding", value: "analytical", description: "I need data and logical reasoning" },
      { text: "Trust my gut feeling and intuition", value: "intuitive", description: "I rely on my instincts and emotions" },
      { text: "Seek advice from trusted friends or mentors", value: "consultative", description: "I value input from people I respect" },
      { text: "Consider how it affects others first", value: "empathetic", description: "I prioritize the impact on relationships" },
      { text: "Act quickly to seize the opportunity", value: "decisive", description: "I prefer to move fast and adapt as needed" }
    ]
  },

  // Stress Response
  {
    title: "Stress Response",
    question: "When you're under significant stress, you tend to:",
    type: "multiple_choice",
    category: "stress_response",
    options: [
      { text: "Work harder and push through", value: "persevere", description: "I believe effort and determination will solve it" },
      { text: "Seek support from others", value: "connect", description: "I reach out to friends, family, or colleagues" },
      { text: "Step back and reflect on the situation", value: "reflect", description: "I need space to think and process" },
      { text: "Look for creative alternative solutions", value: "innovate", description: "I try to find a different approach or angle" },
      { text: "Focus on what I can control", value: "control", description: "I concentrate on manageable aspects" }
    ]
  },

  // Life Satisfaction
  {
    title: "Satisfaction Source",
    question: "Rate how much each area contributes to your life satisfaction:",
    type: "scale",
    category: "satisfaction_career",
    question: "Career and professional achievement",
    scale: { low: "Not important", high: "Extremely important" }
  },

  {
    title: "Satisfaction Source",
    question: "Rate how much each area contributes to your life satisfaction:",
    type: "scale",
    category: "satisfaction_relationships",
    question: "Close relationships and family",
    scale: { low: "Not important", high: "Extremely important" }
  },

  {
    title: "Satisfaction Source", 
    question: "Rate how much each area contributes to your life satisfaction:",
    type: "scale",
    category: "satisfaction_personal_growth",
    question: "Personal growth and self-development",
    scale: { low: "Not important", high: "Extremely important" }
  },

  {
    title: "Satisfaction Source",
    question: "Rate how much each area contributes to your life satisfaction:",
    type: "scale", 
    category: "satisfaction_health",
    question: "Physical health and wellbeing",
    scale: { low: "Not important", high: "Extremely important" }
  },

  {
    title: "Satisfaction Source",
    question: "Rate how much each area contributes to your life satisfaction:",
    type: "scale",
    category: "satisfaction_contribution",
    question: "Making a positive impact on society",
    scale: { low: "Not important", high: "Extremely important" }
  },

  // Change Motivation
  {
    title: "Change Catalyst",
    question: "What typically motivates you to make significant life changes?",
    type: "multiple_choice", 
    category: "change_motivation",
    options: [
      { text: "Dissatisfaction with my current situation", value: "dissatisfaction", description: "Pain or frustration pushes me to change" },
      { text: "Exciting new opportunities or possibilities", value: "opportunity", description: "I'm drawn to attractive alternatives" },
      { text: "External pressure or circumstances", value: "pressure", description: "Life forces change upon me" },
      { text: "A clear vision of who I want to become", value: "vision", description: "I'm pulled by an inspiring future self" },
      { text: "Learning something that shifts my perspective", value: "insight", description: "New understanding changes my direction" }
    ]
  },

  // Meaning Source
  {
    title: "Life Meaning",
    question: "What gives your life the most meaning and purpose?",
    type: "text",
    category: "meaning_source", 
    placeholder: "Describe what makes your life feel meaningful and worthwhile..."
  },

  // Achievement Style
  {
    title: "Achievement Style",
    question: "How do you prefer to achieve your goals?",
    type: "multiple_choice",
    category: "achievement_style",
    options: [
      { text: "Step by step with detailed planning", value: "systematic", description: "I like structured approaches and clear milestones" },
      { text: "Through collaboration and team effort", value: "collaborative", description: "I achieve more when working with others" },
      { text: "By taking bold risks and big leaps", value: "bold", description: "I prefer ambitious moves and breakthrough moments" },
      { text: "Through persistent daily effort", value: "consistent", description: "I believe in steady progress and discipline" },
      { text: "By leveraging my natural strengths", value: "strengths_based", description: "I focus on what I do best and enjoy most" }
    ]
  },

  // Motivation Sustainability
  {
    title: "Sustained Motivation",
    question: "What keeps you motivated over the long term?",
    type: "multiple_choice",
    category: "motivation_sustainability", 
    options: [
      { text: "Seeing concrete progress and results", value: "progress", description: "I need to see that my efforts are paying off" },
      { text: "Connection to a larger purpose or cause", value: "purpose", description: "Being part of something bigger than myself" },
      { text: "Recognition and appreciation from others", value: "recognition", description: "Acknowledgment for my contributions matters" },
      { text: "Variety and new challenges", value: "variety", description: "I need novelty and stimulation to stay engaged" },
      { text: "Inner satisfaction and personal growth", value: "intrinsic", description: "The joy of learning and becoming better" }
    ]
  },

  // Procrastination Patterns
  {
    title: "Procrastination Trigger",
    question: "You're most likely to procrastinate when:",
    type: "multiple_choice",
    category: "procrastination_trigger",
    options: [
      { text: "The task feels boring or meaningless", value: "boredom", description: "I struggle with tasks that don't engage me" },
      { text: "I'm afraid of failing or not doing well", value: "fear_failure", description: "Fear of imperfection paralyzes me" },
      { text: "The task seems too overwhelming", value: "overwhelm", description: "I don't know where to start or how to break it down" },
      { text: "I don't see the immediate value or reward", value: "no_reward", description: "I need clear benefits to feel motivated" },
      { text: "I lack the skills or knowledge needed", value: "incompetence", description: "I feel unprepared or underqualified" }
    ]
  },

  // Future Orientation
  {
    title: "Future Vision",
    question: "When you think about your ideal future self, what excites you most?",
    type: "text",
    category: "future_vision",
    placeholder: "Describe the version of yourself you most want to become..."
  },

  // Motivation Obstacles
  {
    title: "Motivation Obstacles",
    question: "What most often undermines your motivation?",
    type: "multiple_choice",
    category: "motivation_obstacles",
    options: [
      { text: "Comparing myself to others", value: "comparison", description: "Seeing others' success makes me feel inadequate" },
      { text: "Perfectionism and high standards", value: "perfectionism", description: "My standards are so high nothing feels good enough" },
      { text: "Lack of clear direction or goals", value: "direction", description: "I don't know what I really want or should focus on" },
      { text: "Past failures or setbacks", value: "past_failures", description: "Previous disappointments hold me back" },
      { text: "External distractions and obligations", value: "distractions", description: "Other people's needs and daily life interrupt my focus" }
    ]
  },

  // Personal Drive Assessment
  {
    title: "Drive Assessment", 
    question: "Rate your agreement: I am primarily driven by internal satisfaction rather than external validation",
    type: "scale",
    category: "internal_drive",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Drive Assessment",
    question: "Rate your agreement: I'm more motivated by potential gains than by avoiding losses",
    type: "scale",
    category: "gain_motivation", 
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Drive Assessment",
    question: "Rate your agreement: I need variety and new challenges to stay motivated",
    type: "scale",
    category: "variety_need",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Drive Assessment",
    question: "Rate your agreement: I'm most productive when I feel a sense of urgency",
    type: "scale",
    category: "urgency_productivity",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  // Reflection Question
  {
    title: "Personal Reflection",
    question: "Looking back on your most motivated and productive periods, what patterns do you notice?",
    type: "text", 
    category: "motivation_patterns",
    placeholder: "Reflect on when you felt most driven and accomplished..."
  }
])

// Computed properties
const canProceed = computed(() => {
  const currentQ = questions.value[currentQuestion.value]
  if (!currentQ) return false
  
  if (currentQ.type === 'text') {
    return textAnswer.value.trim().length > 0
  }
  return selectedAnswer.value !== null
})

// Helper functions
const getCategoryName = (category) => {
  const names = {
    'intrinsic': 'Intrinsic Motivation',
    'extrinsic': 'Extrinsic Motivation', 
    'growth': 'Growth Orientation',
    'security': 'Security Orientation',
    'autonomy': 'Autonomy Drive',
    'achievement': 'Achievement Drive',
    'affiliation': 'Connection Drive',
    'fear_based': 'Fear-Based Patterns',
    'passion_based': 'Passion-Based Patterns'
  }
  return names[category] || category
}

const selectAnswer = (value) => {
  selectedAnswer.value = value
  if (questions.value[currentQuestion.value].type === 'text') {
    textAnswer.value = value
  }
}

const nextQuestion = async () => {
  if (!canProceed.value) return

  const currentQ = questions.value[currentQuestion.value]
  const answer = currentQ.type === 'text' ? textAnswer.value : selectedAnswer.value

  // Store response
  responses.value.push({
    question: currentQuestion.value,
    category: currentQ.category,
    question_text: currentQ.question,
    type: currentQ.type,
    answer: answer
  })

  // Complete assessment
  if (currentQuestion.value === questions.value.length - 1) {
    assessmentComplete.value = true
    await calculateResults()
    await saveAssessment()
  } else {
    // Next question
    currentQuestion.value++
    selectedAnswer.value = null
    textAnswer.value = ''
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    const previousResponse = responses.value.pop()
    if (previousResponse) {
      selectedAnswer.value = previousResponse.answer
      if (questions.value[currentQuestion.value].type === 'text') {
        textAnswer.value = previousResponse.answer
      }
    }
  }
}

const calculateResults = async () => {
  // Analyze responses to determine motivational profile
  const motivationCategories = {
    intrinsic: { score: 0, responses: [] },
    extrinsic: { score: 0, responses: [] },
    growth: { score: 0, responses: [] },
    security: { score: 0, responses: [] },
    autonomy: { score: 0, responses: [] },
    achievement: { score: 0, responses: [] },
    affiliation: { score: 0, responses: [] },
    fear_based: { score: 0, responses: [] },
    passion_based: { score: 0, responses: [] }
  }

  // Analyze each response and categorize
  responses.value.forEach(response => {
    const { category, answer, type } = response
    
    // Score based on response patterns
    if (type === 'scale') {
      const score = parseInt(answer)
      switch(category) {
        case 'internal_drive':
          motivationCategories.intrinsic.score += score
          motivationCategories.extrinsic.score += (6 - score)
          break
        case 'gain_motivation':
          motivationCategories.passion_based.score += score
          motivationCategories.fear_based.score += (6 - score)
          break
        case 'variety_need':
          motivationCategories.growth.score += score
          motivationCategories.security.score += (6 - score)
          break
        case 'urgency_productivity':
          motivationCategories.achievement.score += score
          break
        case 'satisfaction_career':
          motivationCategories.achievement.score += score
          break
        case 'satisfaction_relationships':
          motivationCategories.affiliation.score += score
          break
        case 'satisfaction_personal_growth':
          motivationCategories.growth.score += score
          break
      }
    } else if (type === 'multiple_choice') {
      // Score based on choice patterns
      switch(category) {
        case 'driver_type':
          if (answer === 'passion') {
            motivationCategories.passion_based.score += 5
            motivationCategories.intrinsic.score += 3
          } else if (answer === 'fear') {
            motivationCategories.fear_based.score += 5
            motivationCategories.security.score += 3
          } else if (answer === 'external') {
            motivationCategories.extrinsic.score += 5
          }
          break
        case 'values':
          if (answer === 'freedom') {
            motivationCategories.autonomy.score += 5
          } else if (answer === 'security') {
            motivationCategories.security.score += 5
          } else if (answer === 'growth') {
            motivationCategories.growth.score += 5
          } else if (answer === 'connection') {
            motivationCategories.affiliation.score += 5
          } else if (answer === 'achievement') {
            motivationCategories.achievement.score += 5
          }
          break
        case 'work_motivation':
          if (answer === 'impact') {
            motivationCategories.intrinsic.score += 4
            motivationCategories.affiliation.score += 3
          } else if (answer === 'advancement') {
            motivationCategories.extrinsic.score += 4
            motivationCategories.achievement.score += 3
          } else if (answer === 'challenge') {
            motivationCategories.growth.score += 4
          } else if (answer === 'creativity') {
            motivationCategories.intrinsic.score += 4
            motivationCategories.autonomy.score += 3
          }
          break
      }
    }
    
    motivationCategories[getResponseCategory(response)].responses.push(response)
  })

  // Normalize scores to percentages
  const maxPossibleScore = responses.value.length * 5 // Rough estimation
  Object.keys(motivationCategories).forEach(key => {
    const rawScore = motivationCategories[key].score
    motivationCategories[key].score = Math.min(100, Math.round((rawScore / maxPossibleScore) * 100))
    
    // Add descriptions and interpretations
    motivationCategories[key] = {
      ...motivationCategories[key],
      level: getLevel(motivationCategories[key].score),
      description: getCategoryDescription(key),
      interpretation: getCategoryInterpretation(key, motivationCategories[key].score)
    }
  })

  // Find primary driver
  const primaryDriverKey = Object.entries(motivationCategories)
    .sort(([,a], [,b]) => b.score - a.score)[0][0]
  
  const primaryDriver = {
    name: getCategoryName(primaryDriverKey),
    description: getCategoryDescription(primaryDriverKey),
    insights: getCategoryInsights(primaryDriverKey)
  }

  // Generate summary
  const summary = generateMotivationSummary(motivationCategories, primaryDriver)

  results.value = {
    motivations: motivationCategories,
    primaryDriver,
    summary,
    completedAt: new Date().toISOString()
  }
}

const getResponseCategory = (response) => {
  // Simple heuristic to categorize responses
  const patterns = response.answer || ''
  if (typeof patterns === 'string' && patterns.includes('growth')) return 'growth'
  if (typeof patterns === 'string' && patterns.includes('security')) return 'security'
  if (typeof patterns === 'string' && patterns.includes('freedom')) return 'autonomy'
  if (typeof patterns === 'string' && patterns.includes('achievement')) return 'achievement'
  if (typeof patterns === 'string' && patterns.includes('connection')) return 'affiliation'
  return 'intrinsic' // Default
}

const getLevel = (score) => {
  if (score >= 80) return 'Very High'
  if (score >= 60) return 'High'
  if (score >= 40) return 'Moderate'
  if (score >= 20) return 'Low'
  return 'Very Low'
}

const getCategoryDescription = (category) => {
  const descriptions = {
    'intrinsic': 'Motivated by internal satisfaction, personal growth, and meaningful work',
    'extrinsic': 'Motivated by external rewards, recognition, and tangible benefits',
    'growth': 'Driven by learning, development, and expanding capabilities',
    'security': 'Motivated by stability, predictability, and minimizing risk',
    'autonomy': 'Driven by independence, freedom, and self-direction',
    'achievement': 'Motivated by accomplishment, success, and reaching goals',
    'affiliation': 'Driven by connection, relationships, and helping others',
    'fear_based': 'Motivated primarily by avoiding negative outcomes',
    'passion_based': 'Driven by enthusiasm, excitement, and positive possibilities'
  }
  return descriptions[category] || 'Personal motivational driver'
}

const getCategoryInterpretation = (category, score) => {
  const interpretations = {
    'intrinsic': {
      high: 'You find deep satisfaction in meaningful work and personal growth',
      low: 'You may be more motivated by external factors and tangible rewards'
    },
    'extrinsic': {
      high: 'External recognition and rewards are important motivators for you',
      low: 'You are more driven by internal satisfaction than external validation'
    },
    'growth': {
      high: 'You thrive on learning, challenges, and expanding your capabilities',
      low: 'You may prefer stability and mastering existing skills'
    },
    'security': {
      high: 'Stability and predictability are important for your motivation',
      low: 'You are comfortable with uncertainty and may even thrive on it'
    },
    'autonomy': {
      high: 'Independence and freedom of choice are crucial for your motivation',
      low: 'You may work well within structured environments and clear direction'
    },
    'achievement': {
      high: 'Reaching goals and accomplishing objectives drives you forward',
      low: 'You may be more motivated by the process than specific outcomes'
    },
    'affiliation': {
      high: 'Connection with others and making an impact motivates you',
      low: 'You may prefer individual work and self-focused goals'
    },
    'fear_based': {
      high: 'Avoiding negative outcomes is a strong motivational force for you',
      low: 'You are more driven by positive possibilities than avoiding problems'
    },
    'passion_based': {
      high: 'Excitement and positive possibilities energize your actions',
      low: 'You may be more motivated by solving problems or meeting obligations'
    }
  }
  return interpretations[category]?.[score >= 50 ? 'high' : 'low'] || 'Influences your motivational patterns'
}

const getCategoryInsights = (category) => {
  const insights = {
    'intrinsic': [
      'Focus on work that aligns with your values and interests',
      'Seek roles that offer autonomy and creative freedom',
      'Set personal development goals alongside performance goals',
      'Find meaning in your daily activities and long-term vision'
    ],
    'extrinsic': [
      'Negotiate for clear rewards and recognition systems',
      'Set specific, measurable goals with tangible outcomes',
      'Seek feedback and acknowledgment for your contributions',
      'Consider roles with competitive compensation and advancement opportunities'
    ],
    'growth': [
      'Continuously seek new learning opportunities and challenges',
      'Set stretch goals that push your capabilities',
      'Find mentors and learning resources in your field',
      'Embrace failures as learning opportunities'
    ],
    'security': [
      'Build strong financial and professional foundations',
      'Seek stable employment with good benefits',
      'Create contingency plans and emergency funds',
      'Value predictable routines and proven methods'
    ],
    'autonomy': [
      'Negotiate for flexible work arrangements when possible',
      'Seek roles with high decision-making authority',
      'Avoid micromanagement and overly restrictive environments',
      'Develop skills that increase your independence'
    ],
    'achievement': [
      'Set clear, measurable goals with deadlines',
      'Track your progress and celebrate milestones',
      'Seek competitive environments that challenge you',
      'Focus on developing expertise in your chosen field'
    ],
    'affiliation': [
      'Prioritize team-based work and collaborative projects',
      'Seek roles where you can help and support others',
      'Build strong professional and personal networks',
      'Look for work that has a positive social impact'
    ],
    'fear_based': [
      'Identify your specific fears and address them systematically',
      'Build skills and resources to increase your confidence',
      'Practice reframing problems as opportunities',
      'Seek support from mentors or coaches to shift your perspective'
    ],
    'passion_based': [
      'Align your work with your natural interests and enthusiasms',
      'Seek variety and new experiences to maintain engagement',
      'Share your excitement with others to amplify motivation',
      'Focus on the positive possibilities in challenging situations'
    ]
  }
  return insights[category] || ['Continue exploring your motivational patterns']
}

const generateMotivationSummary = (motivations, primaryDriver) => {
  const topThree = Object.entries(motivations)
    .sort(([,a], [,b]) => b.score - a.score)
    .slice(0, 3)

  return `Your motivation profile shows ${primaryDriver.name} as your strongest driver. You are also significantly motivated by ${getCategoryName(topThree[1][0])} (${topThree[1][1].score}%) and ${getCategoryName(topThree[2][0])} (${topThree[2][1].score}%). This unique combination suggests you thrive when your work and life align with these core motivational patterns. Understanding these drivers can help you make better decisions about career choices, goal setting, and daily activities that will keep you energized and engaged over the long term.`
}

const saveAssessment = async () => {
  if (!user.value || !results.value) return

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'personal_motivation',
      test_variant_id: 'personal_motivation_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.primaryDriver.name,
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'motivation',
      completed_at: new Date().toISOString()
    })

    if (error) {
      console.error('Error saving assessment:', error)
    }
  } catch (error) {
    console.error('Failed to save assessment:', error)
  }
}

const retakeTest = () => {
  currentQuestion.value = 0
  selectedAnswer.value = null
  textAnswer.value = ''
  responses.value = []
  assessmentComplete.value = false
  results.value = null
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

useHead({
  title: 'Personal Motivations Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Discover your core motivational drivers including fears, passions, and what truly energizes you in life and work.' }
  ]
})
</script>