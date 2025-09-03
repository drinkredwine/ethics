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
              Excellence Orientation Assessment
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
          <div class="text-6xl mb-4">⭐</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">
            Assessment Complete!
          </h2>
          <div :class="`text-lg ${themeClasses.textSecondary}`">
            Your excellence profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Excellence Score -->
          <div :class="`${themeClasses.featureBackground} rounded-xl p-6 text-center`">
            <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">Your Excellence Orientation</h3>
            <div :class="`text-5xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.overallScore }}</div>
            <p :class="`${themeClasses.textSecondary} text-lg mb-4`">{{ results.excellenceLevel.description }}</p>
            
            <!-- Overall Progress Bar -->
            <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-6 mb-4`">
              <div 
                :class="`${getProgressBarColor(results.overallScore)} h-6 rounded-full transition-all duration-1000 flex items-center justify-center`"
                :style="{ width: `${results.overallScore}%` }"
              >
                <span class="text-white text-sm font-bold">{{ results.excellenceLevel.name }}</span>
              </div>
            </div>
          </div>

          <!-- Excellence Dimensions -->
          <div class="grid md:grid-cols-2 gap-6">
            <div 
              v-for="(dimension, key) in results.dimensions" 
              :key="key"
              :class="`${themeClasses.cardBackground} rounded-xl p-6 ${themeClasses.cardShadow}`"
            >
              <div class="flex items-center justify-between mb-4">
                <h4 :class="`text-lg font-bold ${themeClasses.textPrimary}`">{{ getDimensionName(key) }}</h4>
                <div :class="`text-xl font-bold ${getScoreColor(dimension.score)}`">{{ dimension.score }}%</div>
              </div>
              
              <!-- Progress bar for this dimension -->
              <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-3 mb-3`">
                <div 
                  :class="`${getProgressBarColor(dimension.score)} h-3 rounded-full transition-all duration-1000`"
                  :style="{ width: `${dimension.score}%` }"
                ></div>
              </div>
              
              <p :class="`${themeClasses.textSecondary} text-sm mb-2`">{{ dimension.description }}</p>
              <div :class="`text-xs ${themeClasses.textMuted}`">
                <strong>{{ dimension.level }}:</strong> {{ dimension.interpretation }}
              </div>
            </div>
          </div>

          <!-- Excellence Strengths & Growth Areas -->
          <div class="grid md:grid-cols-2 gap-6">
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-green-200`">
              <h3 :class="`text-xl font-bold text-green-800 mb-4`">Your Excellence Strengths</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="strength in results.strengths" :key="strength" class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  {{ strength }}
                </li>
              </ul>
            </div>
            
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-amber-200`">
              <h3 :class="`text-xl font-bold text-amber-800 mb-4`">Growth Opportunities</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="opportunity in results.growthOpportunities" :key="opportunity" class="flex items-start">
                  <span class="text-amber-500 mr-2">→</span>
                  {{ opportunity }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Action Plan -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderAccent}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Excellence Development Plan</h3>
            <div :class="`bg-gradient-to-r ${themeClasses.gradientBackground} p-4 rounded-lg mb-4`">
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Immediate Actions:</h4>
              <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                <li v-for="action in results.actionPlan.immediate" :key="action">{{ action }}</li>
              </ul>
            </div>
            <div :class="`border ${themeClasses.borderSecondary} p-4 rounded-lg`">
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Long-term Development:</h4>
              <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                <li v-for="plan in results.actionPlan.longTerm" :key="plan">{{ plan }}</li>
              </ul>
            </div>
          </div>

          <!-- Overall Summary -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Excellence Profile Summary</h3>
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
          <p :class="themeClasses.textSecondary">Analyzing your excellence orientation...</p>
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

// Questions for Excellence Orientation Assessment
const questions = ref([
  // Quality Standards
  {
    title: "Quality Standards",
    question: "How important is it to you that your work meets the highest possible standards?",
    type: "scale",
    category: "quality_standards",
    scale: { low: "Not important - good enough is fine", high: "Extremely important - only the best will do" }
  },

  {
    title: "Attention to Detail",
    question: "Rate your agreement: I naturally notice small errors or imperfections that others might miss.",
    type: "scale",
    category: "attention_to_detail",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Continuous Improvement",
    question: "How often do you look for ways to improve your work processes or results?",
    type: "multiple_choice",
    category: "improvement_mindset",
    options: [
      { text: "Constantly - I'm always seeking better ways", value: "constantly", description: "I continuously optimize and refine everything I do" },
      { text: "Regularly - I review and improve periodically", value: "regularly", description: "I make improvements as part of my routine" },
      { text: "Occasionally - when I see obvious problems", value: "occasionally", description: "I improve things when issues become apparent" },
      { text: "Rarely - only when required", value: "rarely", description: "I focus on getting things done rather than perfecting them" },
      { text: "Never - I prefer to stick with what works", value: "never", description: "I believe in maintaining proven methods" }
    ]
  },

  {
    title: "Personal Standards",
    question: "How do your personal standards typically compare to what others expect?",
    type: "multiple_choice",
    category: "personal_standards",
    options: [
      { text: "Much higher - I set the bar very high for myself", value: "much_higher", description: "My standards exceed most expectations" },
      { text: "Somewhat higher - I like to exceed expectations", value: "higher", description: "I aim to go above and beyond requirements" },
      { text: "About the same - I meet standard expectations", value: "same", description: "I align with typical quality expectations" },
      { text: "Somewhat lower - I focus on efficiency over perfection", value: "lower", description: "I prioritize getting things done well enough" },
      { text: "Much lower - I do the minimum required", value: "much_lower", description: "I meet basic requirements without extras" }
    ]
  },

  {
    title: "Performance Feedback",
    question: "How do you typically respond to feedback about your performance?",
    type: "multiple_choice",
    category: "feedback_response",
    options: [
      { text: "I actively seek it out and use it to improve", value: "seek_improve", description: "I view feedback as valuable growth information" },
      { text: "I appreciate it and try to implement suggestions", value: "appreciate", description: "I'm open to feedback and act on useful advice" },
      { text: "I accept it but don't always change", value: "accept", description: "I listen but may not always see the need to change" },
      { text: "I sometimes get defensive but eventually listen", value: "defensive", description: "Initial resistance but eventual consideration" },
      { text: "I often disagree and resist making changes", value: "resist", description: "I believe my way is usually best" }
    ]
  },

  {
    title: "Learning Orientation",
    question: "Rate your agreement: I'm always looking for opportunities to develop new skills or knowledge.",
    type: "scale",
    category: "learning_drive",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Mistake Handling",
    question: "When you make a mistake, what's your typical response?",
    type: "multiple_choice",
    category: "mistake_response",
    options: [
      { text: "I analyze it thoroughly to prevent recurrence", value: "analyze", description: "I use mistakes as learning opportunities" },
      { text: "I fix it quickly and move on", value: "fix_move", description: "I address the immediate issue efficiently" },
      { text: "I feel bad about it but eventually get over it", value: "feel_bad", description: "Mistakes bother me but I recover" },
      { text: "I often blame external circumstances", value: "blame_external", description: "I look for reasons outside my control" },
      { text: "I try to hide or minimize it", value: "hide", description: "I prefer others don't know about my mistakes" }
    ]
  },

  {
    title: "Work Completion",
    question: "Rate your agreement: I'm not satisfied with my work until I've reviewed and refined it multiple times.",
    type: "scale",
    category: "refinement_drive",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Excellence Examples",
    question: "Who or what inspires your pursuit of excellence?",
    type: "text",
    category: "excellence_inspiration",
    placeholder: "Describe people, examples, or experiences that inspire you to strive for excellence..."
  },

  {
    title: "Competition Motivation",
    question: "How does competition or comparison with others affect your drive for excellence?",
    type: "multiple_choice",
    category: "competition_response",
    options: [
      { text: "It motivates me to push even harder", value: "motivates", description: "Competition brings out my best performance" },
      { text: "It provides useful benchmarking", value: "benchmarking", description: "I use others' performance as a reference point" },
      { text: "It has little effect - I'm self-motivated", value: "little_effect", description: "My standards come from within" },
      { text: "It sometimes creates unhealthy pressure", value: "pressure", description: "Competition can be stressful and counterproductive" },
      { text: "I actively avoid comparisons with others", value: "avoid", description: "I prefer to focus solely on my own progress" }
    ]
  },

  {
    title: "Time vs Quality",
    question: "When faced with tight deadlines, how do you balance speed and quality?",
    type: "multiple_choice",
    category: "time_quality_balance",
    options: [
      { text: "Quality first - I'll negotiate deadlines if needed", value: "quality_first", description: "I prioritize doing things right over doing them fast" },
      { text: "I find creative ways to maintain both", value: "creative_balance", description: "I look for efficient methods that preserve quality" },
      { text: "I do the best quality possible within constraints", value: "constrained_quality", description: "I optimize quality within given limitations" },
      { text: "I prioritize meeting deadlines over perfection", value: "deadline_priority", description: "Meeting commitments is more important than perfection" },
      { text: "Speed first - quality can be improved later", value: "speed_first", description: "I focus on delivery and iterate afterward" }
    ]
  },

  {
    title: "Excellence Definition",
    question: "How do you personally define excellence?",
    type: "text",
    category: "excellence_definition",
    placeholder: "Describe what excellence means to you personally..."
  },

  {
    title: "Resource Investment",
    question: "How much of your personal time and resources do you invest in improving your skills?",
    type: "scale",
    category: "skill_investment",
    scale: { low: "Very little - I rely on work training", high: "Substantial - I invest heavily in development" }
  },

  {
    title: "Perfectionism Balance",
    question: "Rate your agreement: I sometimes struggle with perfectionism that slows me down.",
    type: "scale",
    category: "perfectionism_struggle",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Team Excellence",
    question: "How do you approach excellence when working with others?",
    type: "multiple_choice",
    category: "team_excellence",
    options: [
      { text: "I try to lift everyone's standards", value: "lift_others", description: "I encourage the whole team to excel" },
      { text: "I lead by example and hope others follow", value: "lead_example", description: "I demonstrate high standards through my work" },
      { text: "I focus on my own excellence regardless", value: "focus_self", description: "I maintain my standards independent of others" },
      { text: "I adapt my standards to match the team", value: "adapt_team", description: "I work at the team's collective level" },
      { text: "I get frustrated with lower standards", value: "frustrated", description: "Others' lower standards negatively affect me" }
    ]
  },

  {
    title: "Recognition Motivation",
    question: "How important is external recognition for your excellent work?",
    type: "scale",
    category: "recognition_importance",
    scale: { low: "Not important - internal satisfaction is enough", high: "Very important - recognition validates my efforts" }
  },

  {
    title: "Process vs Outcome",
    question: "What drives you more in pursuing excellence?",
    type: "multiple_choice",
    category: "excellence_driver",
    options: [
      { text: "The process of doing things perfectly", value: "process", description: "I find satisfaction in excellent execution" },
      { text: "Achieving outstanding results", value: "results", description: "I'm motivated by exceptional outcomes" },
      { text: "Both process and results equally", value: "both", description: "Excellence in method and outcome both matter" },
      { text: "Learning and growth from the effort", value: "learning", description: "The development I gain through striving" },
      { text: "Meeting my own high standards", value: "standards", description: "Living up to my personal expectations" }
    ]
  },

  {
    title: "Maintenance Excellence",
    question: "Rate your agreement: I maintain high standards even for routine or boring tasks.",
    type: "scale",
    category: "routine_excellence",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Excellence Challenges",
    question: "What's your biggest challenge in maintaining excellent standards?",
    type: "multiple_choice",
    category: "excellence_challenges",
    options: [
      { text: "Time constraints and competing priorities", value: "time_constraints", description: "Not enough time to do everything excellently" },
      { text: "Others' lower standards affecting my work", value: "others_standards", description: "Team or organizational limitations" },
      { text: "Perfectionism preventing completion", value: "perfectionism", description: "Getting stuck trying to make things perfect" },
      { text: "Lack of resources or support", value: "resources", description: "Not having what I need to excel" },
      { text: "Maintaining motivation over long periods", value: "motivation", description: "Sustaining high standards consistently" },
      { text: "No significant challenges", value: "no_challenges", description: "I consistently maintain excellence" }
    ]
  },

  {
    title: "Excellence Impact",
    question: "How has your pursuit of excellence most positively impacted your life?",
    type: "text",
    category: "excellence_impact",
    placeholder: "Describe the most positive outcomes from your commitment to excellence..."
  },

  {
    title: "Growth Mindset",
    question: "Rate your agreement: I believe my abilities can always be developed through dedication and hard work.",
    type: "scale", 
    category: "growth_mindset",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Excellence Consistency",
    question: "How consistently do you apply excellent standards across different areas of your life?",
    type: "multiple_choice",
    category: "consistency",
    options: [
      { text: "Very consistently across all areas", value: "very_consistent", description: "I maintain high standards everywhere" },
      { text: "Consistently in important areas", value: "important_areas", description: "I prioritize excellence where it matters most" },
      { text: "Moderately - depends on the situation", value: "situational", description: "My standards vary based on context" },
      { text: "Inconsistently - I struggle with this", value: "inconsistent", description: "I find it hard to maintain standards everywhere" },
      { text: "Only in areas I'm passionate about", value: "passion_areas", description: "Excellence is linked to my interests" }
    ]
  },

  {
    title: "Excellence Legacy",
    question: "What kind of legacy do you want your pursuit of excellence to create?",
    type: "text",
    category: "excellence_legacy",
    placeholder: "Describe the lasting impact you want your commitment to excellence to have..."
  },

  {
    title: "Improvement Tracking",
    question: "How do you typically track your progress and improvement?",
    type: "multiple_choice",
    category: "progress_tracking",
    options: [
      { text: "I keep detailed records and metrics", value: "detailed_metrics", description: "I measure and track everything systematically" },
      { text: "I set specific goals and milestones", value: "goals_milestones", description: "I use concrete objectives to gauge progress" },
      { text: "I rely on feedback from others", value: "external_feedback", description: "Others help me see my improvement" },
      { text: "I trust my intuitive sense of progress", value: "intuitive", description: "I can feel when I'm improving" },
      { text: "I don't formally track - I just keep pushing", value: "no_tracking", description: "I focus on effort rather than measurement" }
    ]
  },

  {
    title: "Excellence Satisfaction",
    question: "Rate your agreement: Achieving excellence gives me deep personal satisfaction, regardless of external recognition.",
    type: "scale",
    category: "intrinsic_satisfaction",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Future Excellence",
    question: "Where do you most want to develop your excellence in the coming year?",
    type: "text",
    category: "future_excellence",
    placeholder: "Describe the area where you most want to pursue excellence..."
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
const getDimensionName = (dimension) => {
  const names = {
    'quality_focus': 'Quality Focus',
    'improvement_drive': 'Continuous Improvement',
    'learning_orientation': 'Learning Orientation', 
    'standards_setting': 'High Standards',
    'persistence': 'Persistence & Resilience',
    'self_discipline': 'Self-Discipline'
  }
  return names[dimension] || dimension
}

const getScoreColor = (score) => {
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-blue-600'
  if (score >= 55) return 'text-yellow-600'
  if (score >= 40) return 'text-orange-600'
  return 'text-red-600'
}

const getProgressBarColor = (score) => {
  if (score >= 85) return 'bg-green-500'
  if (score >= 70) return 'bg-blue-500'
  if (score >= 55) return 'bg-yellow-500'
  if (score >= 40) return 'bg-orange-500'
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
  // Calculate excellence dimensions
  const dimensions = {
    quality_focus: { score: 0, count: 0 },
    improvement_drive: { score: 0, count: 0 },
    learning_orientation: { score: 0, count: 0 },
    standards_setting: { score: 0, count: 0 },
    persistence: { score: 0, count: 0 },
    self_discipline: { score: 0, count: 0 }
  }

  let totalScore = 0
  let scoreCount = 0

  // Analyze each response
  responses.value.forEach(response => {
    const { category, answer, type } = response
    let score = 0

    if (type === 'scale') {
      score = parseInt(answer)
      if (category === 'perfectionism_struggle') {
        score = 6 - score // Reverse scoring for perfectionism struggle
      }
      
      totalScore += score
      scoreCount += 1
      
      // Map to dimensions
      switch(category) {
        case 'quality_standards':
        case 'attention_to_detail':
        case 'routine_excellence':
          dimensions.quality_focus.score += score
          dimensions.quality_focus.count += 1
          break
        case 'learning_drive':
        case 'skill_investment':
        case 'growth_mindset':
          dimensions.learning_orientation.score += score
          dimensions.learning_orientation.count += 1
          break
        case 'refinement_drive':
        case 'intrinsic_satisfaction':
          dimensions.self_discipline.score += score
          dimensions.self_discipline.count += 1
          break
      }
    } else if (type === 'multiple_choice') {
      // Score based on choice patterns
      switch(category) {
        case 'improvement_mindset':
          if (answer === 'constantly') score = 5
          else if (answer === 'regularly') score = 4
          else if (answer === 'occasionally') score = 3
          else if (answer === 'rarely') score = 2
          else score = 1
          dimensions.improvement_drive.score += score
          dimensions.improvement_drive.count += 1
          break
        case 'personal_standards':
          if (answer === 'much_higher') score = 5
          else if (answer === 'higher') score = 4
          else if (answer === 'same') score = 3
          else if (answer === 'lower') score = 2
          else score = 1
          dimensions.standards_setting.score += score
          dimensions.standards_setting.count += 1
          break
        case 'feedback_response':
          if (answer === 'seek_improve') score = 5
          else if (answer === 'appreciate') score = 4
          else if (answer === 'accept') score = 3
          else if (answer === 'defensive') score = 2
          else score = 1
          dimensions.learning_orientation.score += score
          dimensions.learning_orientation.count += 1
          break
        case 'mistake_response':
          if (answer === 'analyze') score = 5
          else if (answer === 'fix_move') score = 4
          else if (answer === 'feel_bad') score = 3
          else if (answer === 'blame_external') score = 2
          else score = 1
          dimensions.persistence.score += score
          dimensions.persistence.count += 1
          break
        case 'time_quality_balance':
          if (answer === 'quality_first') score = 5
          else if (answer === 'creative_balance') score = 5
          else if (answer === 'constrained_quality') score = 4
          else if (answer === 'deadline_priority') score = 3
          else score = 2
          dimensions.quality_focus.score += score
          dimensions.quality_focus.count += 1
          break
        case 'consistency':
          if (answer === 'very_consistent') score = 5
          else if (answer === 'important_areas') score = 4
          else if (answer === 'situational') score = 3
          else if (answer === 'inconsistent') score = 2
          else score = 3
          dimensions.self_discipline.score += score
          dimensions.self_discipline.count += 1
          break
      }
      
      totalScore += score
      scoreCount += 1
    }
  })

  // Normalize dimension scores to percentages
  Object.keys(dimensions).forEach(key => {
    if (dimensions[key].count > 0) {
      dimensions[key].score = Math.round((dimensions[key].score / (dimensions[key].count * 5)) * 100)
    } else {
      dimensions[key].score = 50 // Default neutral score
    }
    
    dimensions[key] = {
      ...dimensions[key],
      level: getLevel(dimensions[key].score),
      description: getDimensionDescription(key),
      interpretation: getDimensionInterpretation(key, dimensions[key].score)
    }
  })

  // Calculate overall score
  const overallScore = Math.round((totalScore / (scoreCount * 5)) * 100)
  
  // Determine excellence level
  const excellenceLevel = getExcellenceLevel(overallScore)
  
  // Generate strengths and growth areas
  const strengths = getStrengths(dimensions)
  const growthOpportunities = getGrowthOpportunities(dimensions)
  
  // Generate action plan
  const actionPlan = generateActionPlan(dimensions, responses.value)
  
  // Generate summary
  const summary = generateSummary(excellenceLevel, overallScore, dimensions)

  results.value = {
    overallScore,
    excellenceLevel,
    dimensions,
    strengths,
    growthOpportunities,
    actionPlan,
    summary,
    completedAt: new Date().toISOString()
  }
}

const getLevel = (score) => {
  if (score >= 85) return 'Exceptional'
  if (score >= 70) return 'Strong'
  if (score >= 55) return 'Moderate'
  if (score >= 40) return 'Developing'
  return 'Needs Focus'
}

const getDimensionDescription = (dimension) => {
  const descriptions = {
    'quality_focus': 'Commitment to high-quality outputs and attention to detail',
    'improvement_drive': 'Motivation to continuously improve and optimize performance',
    'learning_orientation': 'Openness to learning, feedback, and skill development',
    'standards_setting': 'Setting and maintaining high personal and professional standards',
    'persistence': 'Resilience and determination in pursuing excellent outcomes',
    'self_discipline': 'Self-control and consistency in maintaining excellence'
  }
  return descriptions[dimension] || 'Excellence dimension'
}

const getDimensionInterpretation = (dimension, score) => {
  const interpretations = {
    'quality_focus': {
      high: 'You have a strong commitment to producing high-quality work',
      low: 'You may benefit from developing stronger quality standards'
    },
    'improvement_drive': {
      high: 'You actively seek ways to improve and optimize your performance',
      low: 'Consider developing a more systematic approach to improvement'
    },
    'learning_orientation': {
      high: 'You embrace learning opportunities and value feedback',
      low: 'Opening up to more learning and feedback could accelerate growth'
    },
    'standards_setting': {
      high: 'You set and maintain high standards for yourself and others',
      low: 'Developing clearer standards could improve your performance'
    },
    'persistence': {
      high: 'You show strong resilience and determination in pursuing excellence',
      low: 'Building persistence could help you achieve more consistent excellence'
    },
    'self_discipline': {
      high: 'You demonstrate strong self-discipline in maintaining excellence',
      low: 'Developing better self-discipline could improve consistency'
    }
  }
  return interpretations[dimension]?.[score >= 70 ? 'high' : 'low'] || 'Affects your excellence orientation'
}

const getExcellenceLevel = (score) => {
  if (score >= 85) {
    return {
      name: "Excellence Master",
      description: "You demonstrate exceptional commitment to excellence across all dimensions. You set the standard for high performance and continuous improvement."
    }
  } else if (score >= 70) {
    return {
      name: "Excellence Seeker",
      description: "You have strong excellence orientation with consistent high standards. You actively pursue improvement and quality in most areas."
    }
  } else if (score >= 55) {
    return {
      name: "Quality Conscious", 
      description: "You value quality and have developing excellence habits. With focus, you can strengthen your commitment to higher standards."
    }
  } else if (score >= 40) {
    return {
      name: "Standards Developing",
      description: "You're building your excellence orientation. Focus on developing stronger quality standards and improvement habits."
    }
  } else {
    return {
      name: "Excellence Opportunity",
      description: "You have significant opportunity to develop excellence habits. Start with small improvements and build consistency."
    }
  }
}

const getStrengths = (dimensions) => {
  const strengths = []
  Object.entries(dimensions).forEach(([key, data]) => {
    if (data.score >= 75) {
      const strengthMap = {
        'quality_focus': 'Strong attention to detail and quality standards',
        'improvement_drive': 'Active pursuit of continuous improvement',
        'learning_orientation': 'Openness to learning and development',
        'standards_setting': 'High personal and professional standards',
        'persistence': 'Strong resilience and determination',
        'self_discipline': 'Consistent self-discipline and focus'
      }
      strengths.push(strengthMap[key])
    }
  })
  
  if (strengths.length === 0) {
    strengths.push('Commitment to personal and professional development')
  }
  
  return strengths
}

const getGrowthOpportunities = (dimensions) => {
  const opportunities = []
  const sorted = Object.entries(dimensions).sort(([,a], [,b]) => a.score - b.score)
  
  sorted.slice(0, 3).forEach(([key, data]) => {
    const opportunityMap = {
      'quality_focus': 'Develop stronger attention to detail and quality standards',
      'improvement_drive': 'Build habits for continuous improvement and optimization',
      'learning_orientation': 'Increase openness to feedback and learning opportunities',
      'standards_setting': 'Establish higher personal and professional standards',
      'persistence': 'Strengthen resilience and determination in challenging situations',
      'self_discipline': 'Improve consistency and self-discipline in maintaining excellence'
    }
    if (data.score < 70) {
      opportunities.push(opportunityMap[key])
    }
  })
  
  return opportunities
}

const generateActionPlan = (dimensions, responses) => {
  const immediate = []
  const longTerm = []
  
  // Find lowest scoring dimensions for immediate action
  const lowestDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 2)
  
  lowestDimensions.forEach(([key, data]) => {
    switch(key) {
      case 'quality_focus':
        immediate.push("Create a personal quality checklist for your most important work")
        longTerm.push("Develop systematic quality review processes for all major projects")
        break
      case 'improvement_drive':
        immediate.push("Schedule weekly 15-minute improvement reviews of your work processes")
        longTerm.push("Implement a formal continuous improvement system with metrics")
        break
      case 'learning_orientation':
        immediate.push("Identify one new skill to develop this month and create a learning plan")
        longTerm.push("Build relationships with mentors and join professional learning communities")
        break
      case 'standards_setting':
        immediate.push("Define clear quality standards for your three most important responsibilities")
        longTerm.push("Create a personal excellence framework that guides all your decisions")
        break
      case 'persistence':
        immediate.push("Identify current challenges and create specific persistence strategies")
        longTerm.push("Build mental resilience through regular practice and mindset work")
        break
      case 'self_discipline':
        immediate.push("Create daily habits that support your commitment to excellence")
        longTerm.push("Develop strong systems and routines that make excellence automatic")
        break
    }
  })
  
  // Add general recommendations
  immediate.push("Choose one area to focus on improving over the next 30 days")
  longTerm.push("Create an excellence development plan with specific goals and timelines")
  
  return { immediate, longTerm }
}

const generateSummary = (excellenceLevel, overallScore, dimensions) => {
  const topDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)[0]
  
  const bottomDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)[0]

  return `Your excellence assessment reveals a ${excellenceLevel.name} orientation with an overall score of ${overallScore}/100. Your strongest area is ${getDimensionName(topDimension[0])} (${topDimension[1].score}%), demonstrating ${topDimension[1].interpretation.toLowerCase()}. Your greatest opportunity for growth lies in ${getDimensionName(bottomDimension[0])} (${bottomDimension[1].score}%), where ${bottomDimension[1].interpretation.toLowerCase()}. By focusing on developing your weaker areas while leveraging your strengths, you can achieve even higher levels of excellence in your personal and professional life.`
}

const saveAssessment = async () => {
  if (!user.value || !results.value) return

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'excellence_mindset',
      test_variant_id: 'excellence_mindset_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.excellenceLevel.name,
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'mindset',
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
  title: 'Excellence Orientation Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Assess your commitment to excellence, quality standards, and continuous improvement mindset across key dimensions.' }
  ]
})
</script>