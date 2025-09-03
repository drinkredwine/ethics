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
              Change Readiness Assessment
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
          <span>Estimated time remaining: {{ Math.ceil((questions.length - currentQuestion) * 0.75) }} minutes</span>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" :class="`${themeClasses.cardBackground} rounded-lg ${themeClasses.cardShadow} p-8`">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🚀</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">
            Assessment Complete!
          </h2>
          <div :class="`text-lg ${themeClasses.textSecondary}`">
            Your change readiness profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Change Readiness Stage -->
          <div :class="`${themeClasses.featureBackground} rounded-xl p-6 text-center`">
            <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">Your Change Readiness Stage</h3>
            <div :class="`text-4xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.readinessStage.name }}</div>
            <p :class="`${themeClasses.textSecondary} text-lg mb-4`">{{ results.readinessStage.description }}</p>
            
            <!-- Stage Progress Bar -->
            <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-4 mb-4`">
              <div 
                :class="`${themeClasses.progressBar} h-4 rounded-full transition-all duration-1000`"
                :style="{ width: `${results.readinessScore}%` }"
              ></div>
            </div>
            <div :class="`text-sm ${themeClasses.textMuted}`">
              Readiness Score: {{ results.readinessScore }}/100
            </div>
          </div>

          <!-- Key Areas Assessment -->
          <div class="grid md:grid-cols-2 gap-6">
            <div 
              v-for="(area, key) in results.assessmentAreas" 
              :key="key"
              :class="`${themeClasses.cardBackground} rounded-xl p-6 ${themeClasses.cardShadow}`"
            >
              <div class="flex items-center justify-between mb-4">
                <h4 :class="`text-lg font-bold ${themeClasses.textPrimary}`">{{ getAreaName(key) }}</h4>
                <div :class="`text-xl font-bold ${getScoreColor(area.score)}`">{{ area.score }}/10</div>
              </div>
              
              <!-- Progress bar for this area -->
              <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-2 mb-3`">
                <div 
                  :class="`${getProgressBarColor(area.score)} h-2 rounded-full transition-all duration-1000`"
                  :style="{ width: `${(area.score / 10) * 100}%` }"
                ></div>
              </div>
              
              <p :class="`${themeClasses.textSecondary} text-sm mb-2`">{{ area.description }}</p>
              <div :class="`text-xs ${themeClasses.textMuted}`">
                <strong>{{ area.level }}:</strong> {{ area.interpretation }}
              </div>
            </div>
          </div>

          <!-- Action Plan -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderAccent}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Personalized Action Plan</h3>
            <div :class="`bg-gradient-to-r ${themeClasses.gradientBackground} p-4 rounded-lg mb-4`">
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Immediate Next Steps:</h4>
              <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                <li v-for="step in results.actionPlan.immediateSteps" :key="step">{{ step }}</li>
              </ul>
            </div>
            <div :class="`border ${themeClasses.borderSecondary} p-4 rounded-lg`">
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Long-term Recommendations:</h4>
              <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                <li v-for="rec in results.actionPlan.longTermRecommendations" :key="rec">{{ rec }}</li>
              </ul>
            </div>
          </div>

          <!-- Overall Summary -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Change Readiness Summary</h3>
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
          <p :class="themeClasses.textSecondary">Analyzing your readiness for change...</p>
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
                [`${themeClasses.cardBackground} ${themeClasses.textPrimary} ${themeClasses.borderSecondary} ${themeClasses.hoverHighlight}`]: selectedAnswer !== (option.value || index)
              }"
              class="w-full p-4 border-2 rounded-lg transition-all duration-200 text-left"
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

// Questions for Change Readiness Assessment  
const questions = ref([
  // Current Situation Assessment
  {
    title: "Current Life Satisfaction",
    question: "How satisfied are you with your current life situation overall?",
    type: "scale",
    category: "current_satisfaction",
    scale: { low: "Very Dissatisfied", high: "Very Satisfied" }
  },

  {
    title: "Areas Needing Change",
    question: "Which area of your life needs the most attention right now?",
    type: "multiple_choice",
    category: "change_area",
    options: [
      { text: "Career and professional growth", value: "career", description: "Job, skills, professional relationships" },
      { text: "Health and physical wellness", value: "health", description: "Fitness, nutrition, medical care, energy levels" },
      { text: "Relationships and social connections", value: "relationships", description: "Family, friends, romantic relationships" },
      { text: "Financial stability and wealth building", value: "financial", description: "Income, savings, investments, debt management" },
      { text: "Personal growth and self-development", value: "personal", description: "Learning, habits, mindset, life purpose" },
      { text: "Life balance and stress management", value: "balance", description: "Work-life balance, time management, stress levels" }
    ]
  },

  {
    title: "Change Urgency",
    question: "How urgent do you feel the need for change in your life?",
    type: "scale",
    category: "change_urgency", 
    scale: { low: "No urgency - things are fine", high: "Extremely urgent - must change now" }
  },

  {
    title: "Problem Clarity",
    question: "How clearly can you identify the specific problems or challenges you're facing?",
    type: "scale",
    category: "problem_clarity",
    scale: { low: "Very unclear - just feel stuck", high: "Very clear - know exactly what's wrong" }
  },

  {
    title: "Change Vision",
    question: "Do you have a clear vision of what you want your life to look like after making changes?",
    type: "scale",
    category: "change_vision",
    scale: { low: "No clear vision at all", high: "Very clear and detailed vision" }
  },

  {
    title: "Past Change Experience",
    question: "Think about major changes you've made in the past. How successful have you typically been?",
    type: "multiple_choice",
    category: "change_history",
    options: [
      { text: "Very successful - I usually achieve what I set out to do", value: "very_successful", description: "I have a strong track record of positive changes" },
      { text: "Moderately successful - some wins and some failures", value: "moderately_successful", description: "Mixed results but generally positive" },
      { text: "Limited success - I start strong but struggle to follow through", value: "limited_success", description: "I often begin changes but don't complete them" },
      { text: "Unsuccessful - I tend to return to old patterns quickly", value: "unsuccessful", description: "I find it very difficult to make lasting changes" },
      { text: "No major change experience - this would be my first big change", value: "no_experience", description: "I haven't attempted significant changes before" }
    ]
  },

  {
    title: "Support System",
    question: "How would you rate the support you have for making significant life changes?",
    type: "scale",
    category: "support_system",
    scale: { low: "No support - I'm completely on my own", high: "Strong support from family, friends, or professionals" }
  },

  {
    title: "Resource Availability",
    question: "Do you feel you have the resources (time, money, energy) needed to make meaningful changes?",
    type: "scale", 
    category: "resources",
    scale: { low: "No resources available", high: "Abundant resources available" }
  },

  {
    title: "Commitment Level", 
    question: "How committed are you to doing whatever it takes to create positive change in your life?",
    type: "scale",
    category: "commitment_level",
    scale: { low: "Not very committed", high: "Completely committed" }
  },

  {
    title: "Fear Assessment",
    question: "What is your biggest fear about making significant changes in your life?",
    type: "multiple_choice",
    category: "change_fears",
    options: [
      { text: "Fear of failure and disappointment", value: "failure", description: "Worried about not succeeding and feeling worse" },
      { text: "Fear of losing what I currently have", value: "loss", description: "Concerned about giving up security or stability" },
      { text: "Fear of judgment from others", value: "judgment", description: "Worried about what others will think or say" },
      { text: "Fear of the unknown and uncertainty", value: "unknown", description: "Anxious about unpredictable outcomes" },
      { text: "Fear of hard work and discomfort", value: "effort", description: "Concerned about the difficulty and pain of change" },
      { text: "No significant fears - I'm ready to take risks", value: "no_fear", description: "I feel prepared to handle whatever comes" }
    ]
  },

  {
    title: "Motivation Type",
    question: "What most motivates you to consider making changes?",
    type: "multiple_choice",
    category: "motivation_type", 
    options: [
      { text: "Pain and dissatisfaction with current situation", value: "pain", description: "Moving away from what's not working" },
      { text: "Exciting vision of a better future", value: "vision", description: "Moving toward inspiring possibilities" },
      { text: "External pressure from others", value: "pressure", description: "Others are pushing me to change" },
      { text: "Logical analysis showing change is needed", value: "logic", description: "Data and reasoning indicate it's time" },
      { text: "Intuitive feeling that it's the right time", value: "intuition", description: "Gut instinct telling me to act" }
    ]
  },

  {
    title: "Change Strategy",
    question: "How do you prefer to approach major life changes?",
    type: "multiple_choice",
    category: "change_strategy",
    options: [
      { text: "Gradual, step-by-step approach", value: "gradual", description: "Small, consistent changes over time" },
      { text: "Bold, dramatic transformation", value: "dramatic", description: "Big, decisive moves and major shifts" },
      { text: "Carefully planned with detailed preparation", value: "planned", description: "Thorough research and strategic approach" },
      { text: "Experimental and flexible approach", value: "experimental", description: "Try different things and adapt as I go" },
      { text: "Get help from experts or coaches", value: "guided", description: "Work with professionals who can guide me" }
    ]
  },

  {
    title: "Obstacle Anticipation",
    question: "What do you think will be your biggest obstacle to making successful changes?",
    type: "multiple_choice", 
    category: "anticipated_obstacles",
    options: [
      { text: "Lack of time due to current responsibilities", value: "time", description: "Too busy with work, family, and obligations" },
      { text: "Limited financial resources", value: "money", description: "Don't have funds needed for change" },
      { text: "Resistance from family or friends", value: "resistance", description: "Others may not support or understand" },
      { text: "My own procrastination and lack of discipline", value: "self_discipline", description: "I tend to delay action and lose motivation" },
      { text: "Not knowing what steps to take", value: "knowledge", description: "Unclear about how to proceed effectively" },
      { text: "Fear of making the wrong choices", value: "decision_paralysis", description: "Overthinking and analysis paralysis" }
    ]
  },

  {
    title: "Success Measurement",
    question: "How will you know when you've successfully made the changes you want?",
    type: "text",
    category: "success_criteria",
    placeholder: "Describe what success will look like for you..."
  },

  {
    title: "Timeline Expectation",
    question: "What timeframe do you expect for seeing meaningful results from your changes?",
    type: "multiple_choice",
    category: "timeline_expectation",
    options: [
      { text: "1-3 months - I want quick results", value: "short", description: "I need to see progress soon to stay motivated" },
      { text: "6 months to 1 year - reasonable progress", value: "medium", description: "I can be patient for sustainable changes" },
      { text: "1-2 years - long-term transformation", value: "long", description: "I understand deep change takes time" },
      { text: "No specific timeline - as long as it takes", value: "flexible", description: "I'm focused on the outcome, not the speed" }
    ]
  },

  {
    title: "Previous Attempts",
    question: "Have you tried to make similar changes before? If so, what happened?",
    type: "text",
    category: "previous_attempts",
    placeholder: "Describe any previous change attempts and their outcomes..."
  },

  {
    title: "Energy Level",
    question: "How is your current energy level for taking on new challenges?",
    type: "scale",
    category: "energy_level",
    scale: { low: "Exhausted and depleted", high: "High energy and motivated" }
  },

  {
    title: "Stress Management",
    question: "How well do you currently handle stress and pressure?",
    type: "scale",
    category: "stress_management", 
    scale: { low: "Poorly - I get overwhelmed easily", high: "Very well - I thrive under pressure" }
  },

  {
    title: "Life Priorities",
    question: "What matters most to you as you consider making life changes?",
    type: "multiple_choice",
    category: "priorities",
    options: [
      { text: "Maintaining stability and security", value: "stability", description: "Keeping what's working while improving what isn't" },
      { text: "Maximizing personal happiness and fulfillment", value: "happiness", description: "Prioritizing joy and life satisfaction" },
      { text: "Achieving specific goals and accomplishments", value: "achievement", description: "Focusing on measurable success and progress" },
      { text: "Building better relationships and connections", value: "relationships", description: "Improving social and family bonds" },
      { text: "Creating financial security and independence", value: "financial_security", description: "Building wealth and financial freedom" },
      { text: "Making a positive impact on others", value: "impact", description: "Contributing to society and helping people" }
    ]
  },

  {
    title: "Readiness Declaration",
    question: "Complete this statement: I am _____ to make significant positive changes in my life.",
    type: "multiple_choice",
    category: "readiness_declaration",
    options: [
      { text: "Completely ready and excited", value: "completely_ready", description: "I'm fired up and ready to start immediately" },
      { text: "Ready but nervous about the process", value: "ready_nervous", description: "I want to change but feel some anxiety" },
      { text: "Somewhat ready but need more preparation", value: "somewhat_ready", description: "I need to plan more before taking action" },
      { text: "Thinking about it but not quite ready", value: "thinking", description: "I'm still in the contemplation phase" },
      { text: "Not sure if I'm ready for big changes", value: "unsure", description: "I have doubts about my readiness level" }
    ]
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
const getAreaName = (area) => {
  const names = {
    'dissatisfaction': 'Current Dissatisfaction',
    'vision_clarity': 'Vision Clarity', 
    'commitment': 'Commitment Level',
    'resources': 'Available Resources',
    'support': 'Support System',
    'confidence': 'Change Confidence',
    'past_success': 'Past Success History',
    'obstacles': 'Anticipated Obstacles'
  }
  return names[area] || area
}

const getScoreColor = (score) => {
  if (score >= 8) return 'text-green-600'
  if (score >= 6) return 'text-yellow-600' 
  if (score >= 4) return 'text-orange-600'
  return 'text-red-600'
}

const getProgressBarColor = (score) => {
  if (score >= 8) return 'bg-green-500'
  if (score >= 6) return 'bg-yellow-500'
  if (score >= 4) return 'bg-orange-500'
  return 'bg-red-500'
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
  // Calculate change readiness based on responses
  let totalReadinessScore = 0
  const assessmentAreas = {
    dissatisfaction: { score: 0, count: 0 },
    vision_clarity: { score: 0, count: 0 },
    commitment: { score: 0, count: 0 },
    resources: { score: 0, count: 0 },
    support: { score: 0, count: 0 },
    confidence: { score: 0, count: 0 },
    past_success: { score: 0, count: 0 },
    obstacles: { score: 0, count: 0 }
  }

  // Analyze responses
  responses.value.forEach(response => {
    const { category, answer, type } = response
    let score = 0

    if (type === 'scale') {
      score = parseInt(answer)
      totalReadinessScore += score
      
      // Map to assessment areas
      switch(category) {
        case 'current_satisfaction':
          // Low satisfaction = high dissatisfaction = more readiness
          assessmentAreas.dissatisfaction.score += (6 - score) * 2
          assessmentAreas.dissatisfaction.count += 1
          break
        case 'change_urgency':
          assessmentAreas.dissatisfaction.score += score * 2
          assessmentAreas.dissatisfaction.count += 1
          break
        case 'problem_clarity':
          assessmentAreas.vision_clarity.score += score * 2
          assessmentAreas.vision_clarity.count += 1
          break
        case 'change_vision':
          assessmentAreas.vision_clarity.score += score * 2
          assessmentAreas.vision_clarity.count += 1
          break
        case 'support_system':
          assessmentAreas.support.score += score * 2
          assessmentAreas.support.count += 1
          break
        case 'resources':
          assessmentAreas.resources.score += score * 2
          assessmentAreas.resources.count += 1
          break
        case 'commitment_level':
          assessmentAreas.commitment.score += score * 2
          assessmentAreas.commitment.count += 1
          break
        case 'energy_level':
          assessmentAreas.resources.score += score
          assessmentAreas.resources.count += 1
          break
        case 'stress_management':
          assessmentAreas.confidence.score += score
          assessmentAreas.confidence.count += 1
          break
      }
    } else if (type === 'multiple_choice') {
      // Score multiple choice responses
      switch(category) {
        case 'change_history':
          if (answer === 'very_successful') {
            assessmentAreas.past_success.score += 10
            assessmentAreas.confidence.score += 8
          } else if (answer === 'moderately_successful') {
            assessmentAreas.past_success.score += 7
            assessmentAreas.confidence.score += 6
          } else if (answer === 'limited_success') {
            assessmentAreas.past_success.score += 4
            assessmentAreas.confidence.score += 3
          } else if (answer === 'no_experience') {
            assessmentAreas.past_success.score += 5
            assessmentAreas.confidence.score += 5
          }
          assessmentAreas.past_success.count += 1
          assessmentAreas.confidence.count += 1
          break
        case 'readiness_declaration':
          if (answer === 'completely_ready') {
            assessmentAreas.commitment.score += 10
          } else if (answer === 'ready_nervous') {
            assessmentAreas.commitment.score += 8
          } else if (answer === 'somewhat_ready') {
            assessmentAreas.commitment.score += 6
          } else if (answer === 'thinking') {
            assessmentAreas.commitment.score += 4
          } else {
            assessmentAreas.commitment.score += 2
          }
          assessmentAreas.commitment.count += 1
          break
        case 'anticipated_obstacles':
          // Different obstacles affect readiness differently
          if (answer === 'self_discipline') {
            assessmentAreas.obstacles.score += 3
          } else if (answer === 'decision_paralysis') {
            assessmentAreas.obstacles.score += 2
          } else {
            assessmentAreas.obstacles.score += 5 // External obstacles are more manageable
          }
          assessmentAreas.obstacles.count += 1
          break
      }
      totalReadinessScore += 5 // Base score for engagement
    }
  })

  // Normalize area scores
  Object.keys(assessmentAreas).forEach(area => {
    if (assessmentAreas[area].count > 0) {
      assessmentAreas[area].score = Math.round(assessmentAreas[area].score / Math.max(assessmentAreas[area].count, 1))
      assessmentAreas[area].score = Math.min(10, assessmentAreas[area].score) // Cap at 10
    } else {
      assessmentAreas[area].score = 5 // Default neutral score
    }
    
    assessmentAreas[area] = {
      ...assessmentAreas[area],
      level: getLevel(assessmentAreas[area].score),
      description: getAreaDescription(area),
      interpretation: getAreaInterpretation(area, assessmentAreas[area].score)
    }
  })

  // Calculate overall readiness score
  const readinessScore = Math.round((totalReadinessScore / (responses.value.length * 5)) * 100)
  
  // Determine readiness stage
  const readinessStage = getReadinessStage(readinessScore, assessmentAreas)
  
  // Generate action plan
  const actionPlan = generateActionPlan(readinessScore, assessmentAreas, responses.value)
  
  // Generate summary
  const summary = generateSummary(readinessStage, readinessScore, assessmentAreas)

  results.value = {
    readinessScore,
    readinessStage,
    assessmentAreas,
    actionPlan,
    summary,
    completedAt: new Date().toISOString()
  }
}

const getLevel = (score) => {
  if (score >= 9) return 'Excellent'
  if (score >= 7) return 'Good'
  if (score >= 5) return 'Moderate'
  if (score >= 3) return 'Low'
  return 'Very Low'
}

const getAreaDescription = (area) => {
  const descriptions = {
    'dissatisfaction': 'Level of dissatisfaction with current situation driving change',
    'vision_clarity': 'Clarity about desired future state and goals',
    'commitment': 'Dedication and willingness to do what it takes',
    'resources': 'Available time, energy, and financial resources',
    'support': 'Support system from family, friends, and professionals',
    'confidence': 'Confidence in ability to successfully make changes',
    'past_success': 'Track record with previous change efforts',
    'obstacles': 'Anticipated barriers and ability to overcome them'
  }
  return descriptions[area] || 'Assessment area'
}

const getAreaInterpretation = (area, score) => {
  const interpretations = {
    'dissatisfaction': {
      high: 'Strong dissatisfaction is motivating you toward change',
      low: 'Current satisfaction may reduce urgency for change'
    },
    'vision_clarity': {
      high: 'You have a clear vision of your desired future',
      low: 'Developing a clearer vision will help guide your changes'
    },
    'commitment': {
      high: 'You show strong commitment to making changes',
      low: 'Building stronger commitment will be important for success'
    },
    'resources': {
      high: 'You have good resources available for change',
      low: 'Limited resources may require creative solutions'
    },
    'support': {
      high: 'You have strong support for your change efforts',
      low: 'Building a stronger support network will be beneficial'
    },
    'confidence': {
      high: 'You feel confident about your ability to change',
      low: 'Building confidence through small wins will help'
    },
    'past_success': {
      high: 'Your change history suggests good prospects for success',
      low: 'Learning from past experiences will improve future success'
    },
    'obstacles': {
      high: 'You feel well-prepared to handle obstacles',
      low: 'Anticipating and preparing for obstacles will be important'
    }
  }
  return interpretations[area]?.[score >= 6 ? 'high' : 'low'] || 'Affects your readiness for change'
}

const getReadinessStage = (score, areas) => {
  if (score >= 80) {
    return {
      name: "Action Stage",
      description: "You're ready to take immediate action and implement changes. Your high readiness score indicates you have the motivation, resources, and commitment needed to succeed."
    }
  } else if (score >= 65) {
    return {
      name: "Preparation Stage", 
      description: "You're almost ready for action but could benefit from some final preparations. Address any remaining obstacles and strengthen your resources before taking major steps."
    }
  } else if (score >= 45) {
    return {
      name: "Contemplation Stage",
      description: "You're seriously considering change but aren't quite ready yet. This is a good time to build motivation, clarify your vision, and gather resources."
    }
  } else if (score >= 25) {
    return {
      name: "Pre-contemplation Stage",
      description: "Change is on your radar but isn't a high priority yet. Focus on building awareness of the need for change and exploring what's possible."
    }
  } else {
    return {
      name: "Not Ready Stage", 
      description: "You're not currently ready for major changes. This is normal - sometimes we need to focus on maintaining stability before considering transformation."
    }
  }
}

const generateActionPlan = (readinessScore, areas, responses) => {
  const immediateSteps = []
  const longTermRecommendations = []
  
  // Generate recommendations based on lowest scoring areas
  const lowestAreas = Object.entries(areas)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 3)
  
  lowestAreas.forEach(([area, data]) => {
    switch(area) {
      case 'vision_clarity':
        immediateSteps.push("Spend time clarifying your vision - write down exactly what you want your life to look like")
        longTermRecommendations.push("Create a detailed vision board or life plan document")
        break
      case 'resources':
        immediateSteps.push("Assess your current resources (time, money, energy) and identify what you need")
        longTermRecommendations.push("Build up your resource base before taking on major changes")
        break
      case 'support':
        immediateSteps.push("Identify who in your network could support your change efforts")
        longTermRecommendations.push("Build a team of mentors, coaches, or supportive friends")
        break
      case 'commitment':
        immediateSteps.push("Reflect on your 'why' - get clear on what's driving this need for change")
        longTermRecommendations.push("Create accountability systems to maintain commitment over time")
        break
      case 'confidence':
        immediateSteps.push("Start with small, achievable changes to build confidence")
        longTermRecommendations.push("Work with a coach or counselor to address confidence issues")
        break
    }
  })
  
  // Add general recommendations based on readiness score
  if (readinessScore >= 65) {
    immediateSteps.push("Create a specific action plan with timelines and milestones")
  } else {
    immediateSteps.push("Focus on building readiness rather than jumping into action")
  }
  
  return { immediateSteps, longTermRecommendations }
}

const generateSummary = (stage, score, areas) => {
  const topArea = Object.entries(areas)
    .sort(([,a], [,b]) => b.score - a.score)[0]
  
  const bottomArea = Object.entries(areas)
    .sort(([,a], [,b]) => a.score - b.score)[0]

  return `Your change readiness assessment shows you're in the ${stage.name} with an overall readiness score of ${score}/100. Your strongest area is ${getAreaName(topArea[0])} (${topArea[1].score}/10), while ${getAreaName(bottomArea[0])} (${bottomArea[1].score}/10) presents the biggest opportunity for improvement. ${stage.description} Focus on strengthening your weaker areas while leveraging your existing strengths to move forward effectively.`
}

const saveAssessment = async () => {
  if (!user.value || !results.value) return

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'change_readiness',
      test_variant_id: 'change_readiness_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.readinessStage.name,
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'readiness',
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
  title: 'Change Readiness Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Evaluate your current life situation, challenges, and readiness for meaningful transformation and change.' }
  ]
})
</script>