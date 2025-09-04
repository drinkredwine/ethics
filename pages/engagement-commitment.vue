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
              Engagement & Commitment Assessment
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
          <div class="text-6xl mb-4">🔥</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">
            Assessment Complete!
          </h2>
          <div :class="`text-lg ${themeClasses.textSecondary}`">
            Your engagement and commitment profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Overall Engagement Score -->
          <div :class="`${themeClasses.featureBackground} rounded-xl p-6 text-center`">
            <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">Your Engagement Level</h3>
            <div :class="`text-5xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.overallScore }}</div>
            <p :class="`${themeClasses.textSecondary} text-lg mb-4`">{{ results.engagementLevel.description }}</p>
            
            <!-- Overall Progress Bar -->
            <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-6 mb-4`">
              <div 
                :class="`${getProgressBarColor(results.overallScore)} h-6 rounded-full transition-all duration-1000 flex items-center justify-center`"
                :style="{ width: `${results.overallScore}%` }"
              >
                <span class="text-white text-sm font-bold">{{ results.engagementLevel.name }}</span>
              </div>
            </div>
          </div>

          <!-- Engagement Dimensions -->
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

          <!-- Engagement Drivers & Barriers -->
          <div class="grid md:grid-cols-2 gap-6">
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-green-200`">
              <h3 :class="`text-xl font-bold text-green-800 mb-4`">Your Engagement Drivers</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="driver in results.engagementDrivers" :key="driver" class="flex items-start">
                  <span class="text-green-500 mr-2">⚡</span>
                  {{ driver }}
                </li>
              </ul>
            </div>
            
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-orange-200`">
              <h3 :class="`text-xl font-bold text-orange-800 mb-4`">Potential Barriers</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="barrier in results.engagementBarriers" :key="barrier" class="flex items-start">
                  <span class="text-orange-500 mr-2">⚠️</span>
                  {{ barrier }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Purpose Alignment -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderAccent}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Purpose & Values Alignment</h3>
            <div :class="`bg-gradient-to-r ${themeClasses.gradientBackground} p-4 rounded-lg mb-4`">
              <div :class="`text-2xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.purposeAlignment.score }}% Aligned</div>
              <p :class="`${themeClasses.textSecondary} leading-relaxed`">{{ results.purposeAlignment.description }}</p>
            </div>
            <div :class="`border ${themeClasses.borderSecondary} p-4 rounded-lg`">
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Alignment Recommendations:</h4>
              <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                <li v-for="rec in results.purposeAlignment.recommendations" :key="rec">{{ rec }}</li>
              </ul>
            </div>
          </div>

          <!-- Commitment Strategies -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Strategies to Enhance Your Engagement</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Short-term Actions:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="action in results.enhancementStrategies.shortTerm" :key="action">{{ action }}</li>
                </ul>
              </div>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Long-term Development:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="strategy in results.enhancementStrategies.longTerm" :key="strategy">{{ strategy }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Overall Summary -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Engagement & Commitment Summary</h3>
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
          <p :class="themeClasses.textSecondary">Analyzing your engagement and commitment...</p>
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
                    [`${themeClasses.cardBackground} ${themeClasses.textPrimary} ${themeClasses.borderSecondary}`]: selectedAnswer !== n
                  }"
                  class="p-3 border-2 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-500"
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

// Questions for Engagement & Commitment Assessment
const questions = ref([
  // Work Engagement
  {
    title: "Work Engagement",
    question: "How engaged do you feel in your current work or main activities?",
    type: "scale",
    category: "work_engagement",
    scale: { low: "Not engaged at all", high: "Extremely engaged and passionate" }
  },

  {
    title: "Energy and Enthusiasm",
    question: "Rate your agreement: I feel energized and enthusiastic about my daily activities.",
    type: "scale", 
    category: "energy_enthusiasm",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Purpose Connection",
    question: "How connected do you feel to a sense of purpose in what you do?",
    type: "scale",
    category: "purpose_connection",
    scale: { low: "No sense of purpose", high: "Strong sense of purpose and meaning" }
  },

  {
    title: "Commitment Duration",
    question: "How long do you typically stay committed to projects or goals?",
    type: "multiple_choice",
    category: "commitment_duration",
    options: [
      { text: "I see things through to completion, no matter how long it takes", value: "completion", description: "I have strong follow-through and persistence" },
      { text: "I stay committed for months to years on important things", value: "long_term", description: "I maintain commitment over extended periods" },
      { text: "I typically commit for weeks to months", value: "medium_term", description: "I have moderate-term focus and commitment" },
      { text: "I often lose interest after a few weeks", value: "short_term", description: "My commitment tends to fade relatively quickly" },
      { text: "I frequently change direction and pursue new things", value: "very_short", description: "I prefer variety and new challenges over persistence" }
    ]
  },

  {
    title: "Motivation Source",
    question: "What most sustains your engagement over time?",
    type: "multiple_choice",
    category: "motivation_source",
    options: [
      { text: "Deep personal meaning and purpose", value: "purpose", description: "Connection to something larger than myself" },
      { text: "Progress and achievement milestones", value: "progress", description: "Seeing concrete results and advancement" },
      { text: "Learning and growth opportunities", value: "learning", description: "Continuous development and new challenges" },
      { text: "Positive relationships and team dynamics", value: "relationships", description: "Connection and collaboration with others" },
      { text: "External recognition and rewards", value: "recognition", description: "Acknowledgment and tangible benefits" },
      { text: "Variety and new experiences", value: "variety", description: "Stimulation through change and novelty" }
    ]
  },

  {
    title: "Obstacle Response",
    question: "When you encounter significant obstacles or setbacks, you typically:",
    type: "multiple_choice",
    category: "obstacle_response",
    options: [
      { text: "Find new approaches and push through", value: "push_through", description: "I adapt and persist despite challenges" },
      { text: "Take a step back and reassess the situation", value: "reassess", description: "I reflect and adjust my strategy" },
      { text: "Seek help and support from others", value: "seek_help", description: "I leverage my network and resources" },
      { text: "Sometimes give up if it gets too difficult", value: "sometimes_quit", description: "My persistence depends on the situation" },
      { text: "Often lose motivation and move on", value: "lose_motivation", description: "Obstacles tend to discourage me significantly" }
    ]
  },

  {
    title: "Daily Motivation",
    question: "Rate your agreement: I wake up most days feeling motivated and excited about what I'll accomplish.",
    type: "scale",
    category: "daily_motivation",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Values Alignment",
    question: "How well do your current activities align with your personal values?",
    type: "scale",
    category: "values_alignment",
    scale: { low: "Poor alignment - conflicts with my values", high: "Excellent alignment - perfectly matches my values" }
  },

  {
    title: "Engagement Fluctuation",
    question: "How would you describe your engagement levels over time?",
    type: "multiple_choice",
    category: "engagement_pattern",
    options: [
      { text: "Consistently high - I maintain steady engagement", value: "consistently_high", description: "My engagement rarely wavers" },
      { text: "Generally high with occasional dips", value: "mostly_high", description: "I'm usually engaged with some temporary low periods" },
      { text: "Up and down - varies significantly", value: "variable", description: "My engagement fluctuates quite a bit" },
      { text: "Generally low with occasional peaks", value: "mostly_low", description: "I struggle with engagement but have good moments" },
      { text: "Consistently low - I rarely feel truly engaged", value: "consistently_low", description: "Engagement is a persistent challenge for me" }
    ]
  },

  {
    title: "Time Investment",
    question: "How much discretionary time do you invest in activities you care about?",
    type: "scale",
    category: "time_investment",
    scale: { low: "Very little - mostly obligations", high: "Most of my time - highly aligned with my interests" }
  },

  {
    title: "Impact Awareness",
    question: "Rate your agreement: I have a clear understanding of how my efforts make a difference.",
    type: "scale",
    category: "impact_awareness",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Passion Projects",
    question: "What describes your current relationship with passion projects or causes?",
    type: "multiple_choice",
    category: "passion_projects",
    options: [
      { text: "I'm deeply involved in several meaningful projects", value: "deeply_involved", description: "I have multiple passion areas with significant involvement" },
      { text: "I have one or two things I'm really passionate about", value: "focused_passion", description: "I channel my energy into a few key areas" },
      { text: "I'm exploring what I might be passionate about", value: "exploring", description: "I'm in the process of discovering my passions" },
      { text: "I used to be passionate but feel disconnected now", value: "disconnected", description: "I've lost touch with things that once excited me" },
      { text: "I haven't found anything I feel truly passionate about", value: "no_passion", description: "I'm still searching for what truly engages me" }
    ]
  },

  {
    title: "Commitment Challenges",
    question: "What most often undermines your commitment to goals or activities?",
    type: "multiple_choice",
    category: "commitment_challenges",
    options: [
      { text: "Lack of clear progress or results", value: "no_progress", description: "I need to see advancement to stay motivated" },
      { text: "Too many competing priorities", value: "competing_priorities", description: "I get pulled in different directions" },
      { text: "Boredom or loss of novelty", value: "boredom", description: "I need variety and new challenges to stay engaged" },
      { text: "Lack of support or understanding from others", value: "no_support", description: "I need encouragement and backing from people around me" },
      { text: "Self-doubt and fear of failure", value: "self_doubt", description: "Internal fears and insecurities hold me back" },
      { text: "Nothing significantly undermines my commitment", value: "strong_commitment", description: "I generally maintain commitment well" }
    ]
  },

  {
    title: "Social Engagement",
    question: "How engaged are you in your relationships and social connections?",
    type: "scale",
    category: "social_engagement",
    scale: { low: "Very disconnected from others", high: "Deeply connected and engaged with others" }
  },

  {
    title: "Future Vision",
    question: "Rate your agreement: I have a clear vision of what I want to accomplish in the next 2-3 years.",
    type: "scale",
    category: "future_vision",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Dedication Level",
    question: "When you commit to something important, how dedicated are you typically?",
    type: "multiple_choice",
    category: "dedication_level",
    options: [
      { text: "Extremely dedicated - I'll sacrifice other things if needed", value: "extremely_dedicated", description: "I prioritize commitments above almost everything else" },
      { text: "Very dedicated - I make it a high priority", value: "very_dedicated", description: "I give important commitments significant time and energy" },
      { text: "Moderately dedicated - I try to balance with other things", value: "moderately_dedicated", description: "I maintain commitments while balancing other priorities" },
      { text: "Somewhat dedicated - depends on how I'm feeling", value: "somewhat_dedicated", description: "My dedication varies based on circumstances and mood" },
      { text: "Minimally dedicated - I do what I can when convenient", value: "minimally_dedicated", description: "I contribute when it's easy but don't go out of my way" }
    ]
  },

  {
    title: "Meaning Sources",
    question: "What gives your life the most meaning and keeps you committed?",
    type: "text",
    category: "meaning_sources",
    placeholder: "Describe what provides the deepest meaning in your life..."
  },

  {
    title: "Energy Management",
    question: "How well do you manage your energy to maintain long-term engagement?",
    type: "multiple_choice",
    category: "energy_management",
    options: [
      { text: "I'm excellent at pacing myself and maintaining energy", value: "excellent", description: "I have sustainable energy management practices" },
      { text: "I'm good at it but sometimes overextend myself", value: "good", description: "I mostly manage well with occasional burnout periods" },
      { text: "I'm learning but still struggle with balance", value: "learning", description: "I'm developing better energy management skills" },
      { text: "I often burn out from overcommitment", value: "burnout_prone", description: "I tend to exhaust myself with too much intensity" },
      { text: "I struggle to find and maintain energy for commitments", value: "low_energy", description: "Energy management is a significant challenge for me" }
    ]
  },

  {
    title: "Responsibility Ownership",
    question: "Rate your agreement: I take full ownership of my commitments and follow through reliably.",
    type: "scale",
    category: "responsibility_ownership",
    scale: { low: "Strongly Disagree", high: "Strongly Agree" }
  },

  {
    title: "Engagement Renewal",
    question: "When you feel disengaged, what most helps you reconnect?",
    type: "multiple_choice",
    category: "engagement_renewal",
    options: [
      { text: "Reconnecting with my 'why' and deeper purpose", value: "purpose_reconnection", description: "Remembering what matters most to me" },
      { text: "Taking a break and returning with fresh perspective", value: "rest_renewal", description: "Rest and recovery to regain energy" },
      { text: "Finding new challenges or learning opportunities", value: "new_challenges", description: "Stimulation through variety and growth" },
      { text: "Connecting with supportive people who inspire me", value: "social_support", description: "Drawing energy from positive relationships" },
      { text: "Setting smaller, achievable milestones", value: "small_wins", description: "Building momentum through manageable progress" },
      { text: "I rarely feel disengaged", value: "rarely_disengaged", description: "Disengagement is not a significant issue for me" }
    ]
  },

  {
    title: "Long-term Perspective",
    question: "How do you maintain commitment when results take a long time to appear?",
    type: "multiple_choice",
    category: "long_term_perspective",
    options: [
      { text: "I focus on the process and trust the long-term outcome", value: "process_trust", description: "I find satisfaction in consistent effort over time" },
      { text: "I break it down into smaller milestones I can celebrate", value: "milestone_approach", description: "I create intermediate markers of progress" },
      { text: "I remind myself regularly of the end goal and its importance", value: "goal_focus", description: "I maintain vision of the ultimate objective" },
      { text: "I sometimes struggle but try to stay patient", value: "struggle_patience", description: "Long-term commitment is challenging but I work on it" },
      { text: "I often lose motivation when results aren't visible", value: "need_visible_results", description: "I need to see progress to maintain engagement" }
    ]
  },

  {
    title: "Commitment Reflection",
    question: "Looking at your life, what are you most proud of in terms of your engagement and commitment?",
    type: "text",
    category: "commitment_pride",
    placeholder: "Reflect on a commitment or engagement you're most proud of..."
  },

  {
    title: "Growth Areas",
    question: "Where do you most want to develop stronger engagement and commitment?",
    type: "multiple_choice",
    category: "growth_areas",
    options: [
      { text: "Professional career and work projects", value: "professional", description: "Building stronger career engagement" },
      { text: "Personal health and wellness habits", value: "health", description: "Committing more fully to physical and mental wellbeing" },
      { text: "Relationships and social connections", value: "relationships", description: "Investing more deeply in personal relationships" },
      { text: "Creative pursuits and hobbies", value: "creative", description: "Following through more consistently on creative interests" },
      { text: "Community involvement and social causes", value: "community", description: "Engaging more meaningfully in community or social impact" },
      { text: "Personal development and learning", value: "personal_development", description: "Maintaining commitment to growth and learning" }
    ]
  },

  {
    title: "Engagement Satisfaction",
    question: "Overall, how satisfied are you with your current level of engagement and commitment in life?",
    type: "scale",
    category: "engagement_satisfaction",
    scale: { low: "Very unsatisfied - need major changes", high: "Very satisfied - engaged and committed" }
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
    'work_engagement': 'Work & Activity Engagement',
    'purpose_meaning': 'Purpose & Meaning',
    'commitment_persistence': 'Commitment & Persistence',
    'social_engagement': 'Social & Relationship Engagement',
    'personal_growth': 'Personal Growth Commitment',
    'energy_management': 'Energy & Sustainability'
  }
  return names[dimension] || dimension
}

const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 65) return 'text-blue-600'
  if (score >= 50) return 'text-yellow-600'
  if (score >= 35) return 'text-orange-600'
  return 'text-red-600'
}

const getProgressBarColor = (score) => {
  if (score >= 80) return 'bg-green-500'
  if (score >= 65) return 'bg-blue-500'
  if (score >= 50) return 'bg-yellow-500'
  if (score >= 35) return 'bg-orange-500'
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
  // Calculate engagement dimensions
  const dimensions = {
    work_engagement: { score: 0, count: 0 },
    purpose_meaning: { score: 0, count: 0 },
    commitment_persistence: { score: 0, count: 0 },
    social_engagement: { score: 0, count: 0 },
    personal_growth: { score: 0, count: 0 },
    energy_management: { score: 0, count: 0 }
  }

  let totalScore = 0
  let scoreCount = 0

  // Analyze each response
  responses.value.forEach(response => {
    const { category, answer, type } = response
    let score = 0

    if (type === 'scale') {
      score = parseInt(answer)
      totalScore += score
      scoreCount += 1
      
      // Map to dimensions
      switch(category) {
        case 'work_engagement':
        case 'daily_motivation':
          dimensions.work_engagement.score += score
          dimensions.work_engagement.count += 1
          break
        case 'purpose_connection':
        case 'values_alignment':
        case 'impact_awareness':
          dimensions.purpose_meaning.score += score
          dimensions.purpose_meaning.count += 1
          break
        case 'future_vision':
        case 'responsibility_ownership':
          dimensions.commitment_persistence.score += score
          dimensions.commitment_persistence.count += 1
          break
        case 'social_engagement':
          dimensions.social_engagement.score += score
          dimensions.social_engagement.count += 1
          break
        case 'time_investment':
        case 'engagement_satisfaction':
          dimensions.personal_growth.score += score
          dimensions.personal_growth.count += 1
          break
        case 'energy_enthusiasm':
          dimensions.energy_management.score += score
          dimensions.energy_management.count += 1
          break
      }
    } else if (type === 'multiple_choice') {
      // Score based on choice patterns
      switch(category) {
        case 'commitment_duration':
          if (answer === 'completion') score = 5
          else if (answer === 'long_term') score = 4
          else if (answer === 'medium_term') score = 3
          else if (answer === 'short_term') score = 2
          else score = 1
          dimensions.commitment_persistence.score += score
          dimensions.commitment_persistence.count += 1
          break
        case 'engagement_pattern':
          if (answer === 'consistently_high') score = 5
          else if (answer === 'mostly_high') score = 4
          else if (answer === 'variable') score = 3
          else if (answer === 'mostly_low') score = 2
          else score = 1
          dimensions.work_engagement.score += score
          dimensions.work_engagement.count += 1
          break
        case 'dedication_level':
          if (answer === 'extremely_dedicated') score = 5
          else if (answer === 'very_dedicated') score = 4
          else if (answer === 'moderately_dedicated') score = 3
          else if (answer === 'somewhat_dedicated') score = 2
          else score = 1
          dimensions.commitment_persistence.score += score
          dimensions.commitment_persistence.count += 1
          break
        case 'energy_management':
          if (answer === 'excellent') score = 5
          else if (answer === 'good') score = 4
          else if (answer === 'learning') score = 3
          else if (answer === 'burnout_prone') score = 2
          else score = 1
          dimensions.energy_management.score += score
          dimensions.energy_management.count += 1
          break
        case 'passion_projects':
          if (answer === 'deeply_involved') score = 5
          else if (answer === 'focused_passion') score = 4
          else if (answer === 'exploring') score = 3
          else if (answer === 'disconnected') score = 2
          else score = 1
          dimensions.purpose_meaning.score += score
          dimensions.purpose_meaning.count += 1
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
  
  // Determine engagement level
  const engagementLevel = getEngagementLevel(overallScore)
  
  // Generate drivers and barriers
  const engagementDrivers = getEngagementDrivers(responses.value)
  const engagementBarriers = getEngagementBarriers(responses.value)
  
  // Calculate purpose alignment
  const purposeAlignment = calculatePurposeAlignment(dimensions, responses.value)
  
  // Generate enhancement strategies
  const enhancementStrategies = generateEnhancementStrategies(dimensions, responses.value)
  
  // Generate summary
  const summary = generateSummary(engagementLevel, overallScore, dimensions)

  results.value = {
    overallScore,
    engagementLevel,
    dimensions,
    engagementDrivers,
    engagementBarriers,
    purposeAlignment,
    enhancementStrategies,
    summary,
    completedAt: new Date().toISOString()
  }
}

const getLevel = (score) => {
  if (score >= 80) return 'High'
  if (score >= 65) return 'Good'
  if (score >= 50) return 'Moderate'
  if (score >= 35) return 'Developing'
  return 'Low'
}

const getDimensionDescription = (dimension) => {
  const descriptions = {
    'work_engagement': 'Level of enthusiasm and involvement in work and main activities',
    'purpose_meaning': 'Connection to personal meaning, values, and sense of purpose',
    'commitment_persistence': 'Ability to maintain dedication and follow-through over time',
    'social_engagement': 'Active involvement and commitment in relationships and social connections',
    'personal_growth': 'Commitment to continuous learning and self-development',
    'energy_management': 'Sustainable approach to maintaining engagement without burnout'
  }
  return descriptions[dimension] || 'Engagement dimension'
}

const getDimensionInterpretation = (dimension, score) => {
  const interpretations = {
    'work_engagement': {
      high: 'You feel energized and passionate about your work and activities',
      low: 'You may benefit from finding more engaging work or activities'
    },
    'purpose_meaning': {
      high: 'You have strong connection to meaning and purpose in what you do',
      low: 'Developing clearer purpose and values alignment could boost engagement'
    },
    'commitment_persistence': {
      high: 'You demonstrate strong follow-through and long-term dedication',
      low: 'Building persistence skills could help you achieve more of your goals'
    },
    'social_engagement': {
      high: 'You actively invest in relationships and social connections',
      low: 'Strengthening social engagement could provide additional motivation'
    },
    'personal_growth': {
      high: 'You actively commit to learning and personal development',
      low: 'Investing more in personal growth could increase overall engagement'
    },
    'energy_management': {
      high: 'You maintain sustainable energy and avoid burnout effectively',
      low: 'Developing better energy management could improve long-term engagement'
    }
  }
  return interpretations[dimension]?.[score >= 65 ? 'high' : 'low'] || 'Affects your overall engagement'
}

const getEngagementLevel = (score) => {
  if (score >= 80) {
    return {
      name: "Highly Engaged",
      description: "You demonstrate exceptional engagement and commitment across multiple life areas. You're energized by what you do and maintain strong dedication to your goals and relationships."
    }
  } else if (score >= 65) {
    return {
      name: "Well Engaged",
      description: "You show good engagement levels with consistent commitment to important areas. You generally maintain motivation and follow through on your priorities."
    }
  } else if (score >= 50) {
    return {
      name: "Moderately Engaged",
      description: "Your engagement varies across different areas. Some things energize you while others may feel routine. There's opportunity to deepen your commitment and connection."
    }
  } else if (score >= 35) {
    return {
      name: "Developing Engagement",
      description: "You're working on building stronger engagement patterns. Focus on finding what truly motivates you and developing sustainable commitment practices."
    }
  } else {
    return {
      name: "Low Engagement",
      description: "You may be experiencing disengagement in several life areas. Consider exploring what brings you meaning and energy, and perhaps seek support in reconnecting with your values."
    }
  }
}

const getEngagementDrivers = (responses) => {
  const drivers = []
  
  responses.forEach(response => {
    if (response.category === 'motivation_source') {
      const driverMap = {
        'purpose': 'Deep connection to personal meaning and purpose',
        'progress': 'Seeing concrete results and milestone achievements',
        'learning': 'Continuous growth and skill development opportunities',
        'relationships': 'Positive social connections and team collaboration',
        'recognition': 'External acknowledgment and appreciation',
        'variety': 'Stimulation through new experiences and challenges'
      }
      drivers.push(driverMap[response.answer] || 'Personal motivation factors')
    }
  })
  
  if (drivers.length === 0) {
    drivers.push('Personal values and intrinsic motivation', 'Achievement and progress', 'Meaningful relationships')
  }
  
  return drivers
}

const getEngagementBarriers = (responses) => {
  const barriers = []
  
  responses.forEach(response => {
    if (response.category === 'commitment_challenges') {
      const barrierMap = {
        'no_progress': 'Difficulty seeing clear progress or results',
        'competing_priorities': 'Too many conflicting demands on time and attention',
        'boredom': 'Need for more variety and stimulating challenges',
        'no_support': 'Lack of encouragement and backing from others',
        'self_doubt': 'Internal fears and confidence issues',
        'strong_commitment': 'Few significant barriers to commitment'
      }
      if (response.answer !== 'strong_commitment') {
        barriers.push(barrierMap[response.answer] || 'General commitment challenges')
      }
    }
  })
  
  if (barriers.length === 0) {
    barriers.push('Occasional energy fluctuations', 'Balancing multiple priorities')
  }
  
  return barriers
}

const calculatePurposeAlignment = (dimensions, responses) => {
  const purposeScore = dimensions.purpose_meaning.score
  let description = ''
  const recommendations = []
  
  if (purposeScore >= 80) {
    description = 'You have strong alignment between your daily activities and core values, creating sustained motivation and engagement.'
    recommendations.push('Continue nurturing this strong purpose connection', 'Share your sense of purpose to inspire others')
  } else if (purposeScore >= 65) {
    description = 'You have good values alignment with room to deepen the connection between your activities and what matters most to you.'
    recommendations.push('Regularly reflect on how your work connects to your values', 'Seek opportunities to increase meaningful impact')
  } else if (purposeScore >= 50) {
    description = 'Your purpose alignment is moderate. Strengthening this connection could significantly boost your engagement.'
    recommendations.push('Clarify your core values and life purpose', 'Find ways to incorporate more meaning into daily activities')
  } else {
    description = 'Limited alignment between your activities and deeper purpose may be affecting your engagement and commitment.'
    recommendations.push('Take time for deep reflection on what truly matters to you', 'Consider making changes to align activities with values', 'Seek guidance from mentors or coaches on purpose discovery')
  }
  
  return { score: purposeScore, description, recommendations }
}

const generateEnhancementStrategies = (dimensions, responses) => {
  const shortTerm = []
  const longTerm = []
  
  // Find lowest scoring dimensions for targeted recommendations
  const lowestDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 2)
  
  lowestDimensions.forEach(([key, data]) => {
    switch(key) {
      case 'work_engagement':
        shortTerm.push('Identify one aspect of your work to make more engaging this week')
        longTerm.push('Explore career changes or role modifications that align with your interests')
        break
      case 'purpose_meaning':
        shortTerm.push('Write down your core values and how they connect to your activities')
        longTerm.push('Develop a personal mission statement and life vision')
        break
      case 'commitment_persistence':
        shortTerm.push('Choose one important goal and create a specific commitment plan')
        longTerm.push('Build accountability systems and persistence habits')
        break
      case 'social_engagement':
        shortTerm.push('Schedule quality time with people who matter to you')
        longTerm.push('Invest in building deeper, more meaningful relationships')
        break
      case 'personal_growth':
        shortTerm.push('Commit to learning one new thing this month')
        longTerm.push('Create a systematic personal development plan')
        break
      case 'energy_management':
        shortTerm.push('Identify your energy patterns and plan accordingly')
        longTerm.push('Develop sustainable practices for maintaining long-term engagement')
        break
    }
  })
  
  // Add general enhancement strategies
  shortTerm.push('Practice daily reflection on what engaged you most')
  longTerm.push('Create an engagement dashboard to track your commitment levels')
  
  return { shortTerm, longTerm }
}

const generateSummary = (engagementLevel, overallScore, dimensions) => {
  const topDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)[0]
  
  const bottomDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)[0]

  return `Your engagement and commitment assessment reveals you are ${engagementLevel.name.toLowerCase()} with an overall score of ${overallScore}%. Your strongest area is ${getDimensionName(topDimension[0])} (${topDimension[1].score}%), where ${topDimension[1].interpretation.toLowerCase()}. Your greatest opportunity lies in ${getDimensionName(bottomDimension[0])} (${bottomDimension[1].score}%), where ${bottomDimension[1].interpretation.toLowerCase()}. ${engagementLevel.description} Focus on leveraging your natural engagement strengths while systematically developing areas where you can deepen your commitment and connection.`
}

const saveAssessment = async () => {
  if (!user.value || !results.value) return

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'engagement_commitment',
      test_variant_id: 'engagement_commitment_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.engagementLevel.name,
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'engagement',
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
  title: 'Engagement & Commitment Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Measure your level of engagement, dedication, and commitment to work, relationships, and causes that matter to you.' }
  ]
})
</script>