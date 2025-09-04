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
              Entrepreneurial Mindset Assessment
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
          <div class="text-6xl mb-4">🚀</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">
            Assessment Complete!
          </h2>
          <div :class="`text-lg ${themeClasses.textSecondary}`">
            Your entrepreneurial profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Overall Entrepreneurial Score -->
          <div :class="`${themeClasses.featureBackground} rounded-xl p-6 text-center`">
            <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">Your Entrepreneurial Potential</h3>
            <div :class="`text-5xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.overallScore }}%</div>
            <p :class="`${themeClasses.textSecondary} text-lg mb-4`">{{ results.entrepreneurialLevel.description }}</p>
            
            <!-- Overall Progress Bar -->
            <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-6 mb-4`">
              <div 
                :class="`${getProgressBarColor(results.overallScore)} h-6 rounded-full transition-all duration-1000 flex items-center justify-center`"
                :style="{ width: `${results.overallScore}%` }"
              >
                <span class="text-white text-sm font-bold">{{ results.entrepreneurialLevel.name }}</span>
              </div>
            </div>
          </div>

          <!-- Entrepreneurial Dimensions -->
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

          <!-- Entrepreneurial Profile -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderAccent}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Entrepreneurial Profile</h3>
            <div :class="`bg-gradient-to-r ${themeClasses.gradientBackground} p-4 rounded-lg mb-4`">
              <div :class="`text-2xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.entrepreneurialType.name }}</div>
              <p :class="`${themeClasses.textSecondary} leading-relaxed mb-4`">{{ results.entrepreneurialType.description }}</p>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Key Traits:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                  <li v-for="trait in results.entrepreneurialType.traits" :key="trait">{{ trait }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Strengths & Development Areas -->
          <div class="grid md:grid-cols-2 gap-6">
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-green-200`">
              <h3 :class="`text-xl font-bold text-green-800 mb-4`">Entrepreneurial Strengths</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="strength in results.strengths" :key="strength" class="flex items-start">
                  <span class="text-green-500 mr-2">💡</span>
                  {{ strength }}
                </li>
              </ul>
            </div>
            
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-orange-200`">
              <h3 :class="`text-xl font-bold text-orange-800 mb-4`">Growth Opportunities</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="opportunity in results.developmentAreas" :key="opportunity" class="flex items-start">
                  <span class="text-orange-500 mr-2">📊</span>
                  {{ opportunity }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Venture Readiness -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-blue-200`">
            <h3 :class="`text-xl font-bold text-blue-800 mb-4`">Your Venture Readiness Assessment</h3>
            <div class="grid md:grid-cols-3 gap-4 mb-4">
              <div class="text-center">
                <div :class="`text-3xl font-bold ${getScoreColor(results.ventureReadiness.idea)}`">{{ results.ventureReadiness.idea }}%</div>
                <div :class="`text-sm ${themeClasses.textSecondary}`">Idea Development</div>
              </div>
              <div class="text-center">
                <div :class="`text-3xl font-bold ${getScoreColor(results.ventureReadiness.execution)}`">{{ results.ventureReadiness.execution }}%</div>
                <div :class="`text-sm ${themeClasses.textSecondary}`">Execution Capability</div>
              </div>
              <div class="text-center">
                <div :class="`text-3xl font-bold ${getScoreColor(results.ventureReadiness.resilience)}`">{{ results.ventureReadiness.resilience }}%</div>
                <div :class="`text-sm ${themeClasses.textSecondary}`">Resilience & Persistence</div>
              </div>
            </div>
            <p :class="`${themeClasses.textSecondary} text-sm`">{{ results.ventureReadiness.assessment }}</p>
          </div>

          <!-- Action Plan -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Entrepreneurial Development Plan</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Next Steps (30 Days):</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="step in results.actionPlan.immediate" :key="step">{{ step }}</li>
                </ul>
              </div>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Long-term Development:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="plan in results.actionPlan.longTerm" :key="plan">{{ plan }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Overall Summary -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Entrepreneurial Summary</h3>
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
          <p :class="themeClasses.textSecondary">Analyzing your entrepreneurial mindset...</p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else :class="`${themeClasses.cardBackground} rounded-lg ${themeClasses.cardShadow} p-8`">
        <div class="mb-8">
          <h2 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6`">
            Business Scenario {{ currentQuestion + 1 }}
          </h2>
          <div :class="`${themeClasses.featureBackground} p-6 rounded-lg border-l-4 ${themeClasses.borderAccent} mb-4`">
            <div :class="`font-medium ${themeClasses.textPrimary} mb-3`">{{ questions[currentQuestion]?.scenario }}</div>
            <div :class="`text-lg ${themeClasses.textPrimary} font-medium`">
              {{ questions[currentQuestion]?.question }}
            </div>
          </div>
        </div>

        <!-- Answer Options -->
        <div class="mb-8">
          <div class="space-y-3">
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
              <div class="font-semibold mb-2">{{ String.fromCharCode(65 + index) }}. {{ option.text }}</div>
              <div v-if="option.reasoning" :class="`text-sm ${selectedAnswer === (option.value || index) ? 'text-white opacity-90' : themeClasses.textMuted}`">
                {{ option.reasoning }}
              </div>
            </button>
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
const responses = ref([])
const assessmentComplete = ref(false)
const results = ref(null)

// Scenario-based questions for Entrepreneurial Mindset Assessment
const questions = ref([
  // Opportunity Recognition
  {
    scenario: "You notice that many people in your neighborhood struggle with finding reliable home maintenance services, often waiting weeks for simple repairs.",
    question: "What's your first instinct?",
    category: "opportunity_recognition",
    options: [
      { text: "Research the market size and competition in home services", value: "market_research", reasoning: "Validates opportunity with data-driven approach" },
      { text: "Start connecting with skilled handypeople to build a service network", value: "network_building", reasoning: "Takes action to create solution infrastructure" },
      { text: "Create a simple app or platform prototype to test the concept", value: "prototype_creation", reasoning: "Builds minimum viable product to validate demand" },
      { text: "Keep the idea in mind but continue with your current activities", value: "passive_observation", reasoning: "Recognizes opportunity but doesn't act immediately" }
    ]
  },

  {
    scenario: "A new technology emerges that could disrupt your current industry. Early adopters are starting to experiment with it, but most companies are taking a wait-and-see approach.",
    question: "How do you respond?",
    category: "innovation_adoption",
    options: [
      { text: "Immediately start experimenting with the technology to understand its potential", value: "early_experimentation", reasoning: "Embraces innovation and first-mover advantage" },
      { text: "Study how early adopters are using it and learn from their experiences", value: "learn_from_others", reasoning: "Strategic approach to innovation adoption" },
      { text: "Wait for the technology to mature before considering adoption", value: "cautious_waiting", reasoning: "Risk-averse approach to new technology" },
      { text: "Focus on improving current methods rather than chasing new trends", value: "current_focus", reasoning: "Prioritizes optimization over innovation" }
    ]
  },

  // Risk Tolerance
  {
    scenario: "You have a stable job with good benefits, but you've identified a business opportunity that excites you. Pursuing it would require leaving your job with no guaranteed income for at least 6 months.",
    question: "What do you do?",
    category: "risk_tolerance",
    options: [
      { text: "Quit immediately and pursue the opportunity full-time", value: "full_commitment", reasoning: "High risk tolerance and commitment to opportunity" },
      { text: "Negotiate part-time work or sabbatical to test the opportunity", value: "calculated_transition", reasoning: "Balances risk with smart transition planning" },
      { text: "Develop the business idea evenings and weekends first", value: "side_hustle", reasoning: "Conservative approach to testing viability" },
      { text: "Stay in your current job and look for lower-risk opportunities", value: "maintain_stability", reasoning: "Prioritizes security over entrepreneurial opportunity" }
    ]
  },

  {
    scenario: "You've invested significant time and money into developing a product, but initial customer feedback suggests major changes are needed. Making these changes would require additional investment and delay your launch by 6 months.",
    question: "What's your decision?",
    category: "pivot_willingness",
    options: [
      { text: "Make the changes customers are asking for, even if it delays launch", value: "customer_driven_pivot", reasoning: "Prioritizes customer needs and market fit" },
      { text: "Launch as planned and iterate based on real market feedback", value: "launch_and_iterate", reasoning: "Believes in getting to market quickly and adapting" },
      { text: "Find a compromise solution that addresses some feedback quickly", value: "compromise_approach", reasoning: "Balances customer input with timeline pressures" },
      { text: "Stick with your original vision and find customers who appreciate it", value: "vision_persistence", reasoning: "Maintains original vision despite feedback" }
    ]
  },

  // Bias for Action
  {
    scenario: "You have an idea for improving a common workplace process, but you're not sure if management will be receptive. There's no formal innovation program at your company.",
    question: "What's your approach?",
    category: "bias_for_action",
    options: [
      { text: "Create a detailed proposal and present it to management", value: "formal_proposal", reasoning: "Takes structured action to advance the idea" },
      { text: "Implement a small pilot test in your own work area first", value: "pilot_implementation", reasoning: "Demonstrates value through action before seeking approval" },
      { text: "Discuss the idea with colleagues to gauge support first", value: "consensus_building", reasoning: "Builds support before taking action" },
      { text: "Research similar implementations at other companies first", value: "research_first", reasoning: "Gathers information before acting" }
    ]
  },

  {
    scenario: "A potential business partner approaches you with an interesting collaboration opportunity, but they need an answer within 48 hours due to other competing offers.",
    question: "How do you handle this situation?",
    category: "decision_speed",
    options: [
      { text: "Make a decision based on available information within the timeframe", value: "quick_decision", reasoning: "Comfortable making decisions with limited information under pressure" },
      { text: "Ask for key information and make the best decision possible in 48 hours", value: "focused_evaluation", reasoning: "Efficient decision-making process under constraints" },
      { text: "Decline the opportunity rather than make a rushed decision", value: "avoid_pressure", reasoning: "Prioritizes thorough evaluation over speed" },
      { text: "Try to negotiate for more time to properly evaluate the opportunity", value: "negotiate_timeline", reasoning: "Seeks to balance thoroughness with urgency" }
    ]
  },

  // Innovation Mindset
  {
    scenario: "Your team is facing a recurring problem that everyone has accepted as 'just the way things are.' Traditional solutions haven't worked well.",
    question: "What's your approach?",
    category: "creative_problem_solving",
    options: [
      { text: "Challenge the assumptions about why the problem exists", value: "challenge_assumptions", reasoning: "Questions fundamental premises to find new solutions" },
      { text: "Look for solutions from completely different industries or contexts", value: "cross_industry_inspiration", reasoning: "Seeks innovative approaches from outside sources" },
      { text: "Experiment with unconventional approaches to see what happens", value: "experimental_approach", reasoning: "Tests new ideas through trial and learning" },
      { text: "Focus on incremental improvements to existing solutions", value: "incremental_improvement", reasoning: "Builds on existing approaches systematically" }
    ]
  },

  {
    scenario: "You see a successful business model in another city that doesn't exist in your area. The original founders have no plans to expand to your region.",
    question: "What's your perspective?",
    category: "opportunity_creation",
    options: [
      { text: "Adapt their model to create a similar business in your area", value: "model_adaptation", reasoning: "Recognizes and acts on proven opportunity gaps" },
      { text: "Improve upon their model before bringing it to your market", value: "improved_adaptation", reasoning: "Adds innovation to proven concepts" },
      { text: "Focus on creating something completely original instead", value: "original_creation", reasoning: "Prioritizes unique innovation over adaptation" },
      { text: "Contact them about licensing or franchising opportunities", value: "partnership_approach", reasoning: "Seeks collaborative expansion opportunities" }
    ]
  },

  // Resilience & Persistence
  {
    scenario: "Your startup has been rejected by 15 investors, and your savings are running low. Friends and family are suggesting you return to traditional employment.",
    question: "What do you do?",
    category: "persistence",
    options: [
      { text: "Refine your pitch based on feedback and continue seeking investment", value: "iterative_persistence", reasoning: "Learns from setbacks and continues pursuing goals" },
      { text: "Pivot to a bootstrapped approach and grow more slowly", value: "strategic_pivot", reasoning: "Adapts strategy while maintaining entrepreneurial direction" },
      { text: "Take a part-time job to extend your runway while continuing to pitch", value: "extended_runway", reasoning: "Finds practical solutions to continue pursuing opportunity" },
      { text: "Return to employment but keep developing the idea on the side", value: "staged_retreat", reasoning: "Reduces risk while maintaining entrepreneurial aspirations" }
    ]
  },

  {
    scenario: "A major setback has destroyed six months of progress on your key project. Team morale is low, and some members are considering leaving.",
    question: "How do you respond?",
    category: "resilience_leadership",
    options: [
      { text: "Rally the team around the lessons learned and renewed vision", value: "inspirational_recovery", reasoning: "Uses setbacks as opportunities to strengthen resolve and vision" },
      { text: "Honestly assess what went wrong and create a better plan going forward", value: "analytical_recovery", reasoning: "Learns systematically from failures to improve approach" },
      { text: "Give the team time to process, then regroup with fresh perspective", value: "patient_recovery", reasoning: "Recognizes emotional impact and allows for processing time" },
      { text: "Consider if this setback indicates fundamental problems with the venture", value: "strategic_reassessment", reasoning: "Uses setbacks to evaluate overall venture viability" }
    ]
  },

  // Resource Optimization
  {
    scenario: "You need to launch a marketing campaign for your new product, but your budget is 10% of what established competitors spend on similar launches.",
    question: "What's your strategy?",
    category: "resource_optimization",
    options: [
      { text: "Focus on creative, low-cost marketing tactics that competitors can't easily copy", value: "creative_efficiency", reasoning: "Maximizes impact through innovation rather than spending" },
      { text: "Partner with complementary businesses to share marketing costs and reach", value: "partnership_leverage", reasoning: "Multiplies resources through strategic collaboration" },
      { text: "Target a very specific niche where you can dominate with limited budget", value: "focused_targeting", reasoning: "Concentrates limited resources for maximum impact" },
      { text: "Delay the launch until you can raise more marketing budget", value: "resource_accumulation", reasoning: "Waits for adequate resources before taking action" }
    ]
  },

  {
    scenario: "You have a great business idea but lack the technical skills to build the product yourself. Hiring developers would cost more than your entire budget.",
    question: "How do you proceed?",
    category: "resourcefulness",
    options: [
      { text: "Learn enough technical skills to build a basic prototype yourself", value: "skill_development", reasoning: "Invests in capabilities to overcome resource constraints" },
      { text: "Find a technical co-founder willing to work for equity", value: "equity_partnership", reasoning: "Exchanges ownership for needed capabilities" },
      { text: "Use no-code tools and platforms to create a workable version", value: "alternative_tools", reasoning: "Finds creative solutions within resource constraints" },
      { text: "Validate the market demand first, then raise funds for development", value: "validation_first", reasoning: "Proves concept before investing in development" }
    ]
  },

  // Market Understanding
  {
    scenario: "You're developing a product that you personally love and use daily, but initial market research suggests limited broader appeal.",
    question: "What's your next step?",
    category: "market_validation",
    options: [
      { text: "Find and deeply understand the specific segment that would love this product", value: "niche_focus", reasoning: "Seeks to understand and serve passionate user segments" },
      { text: "Modify the product to appeal to a broader market segment", value: "market_adaptation", reasoning: "Adapts product to better match market needs" },
      { text: "Test different positioning and messaging to see if that changes perception", value: "messaging_optimization", reasoning: "Tests whether presentation affects market appeal" },
      { text: "Trust your instincts and build for people like yourself", value: "vision_persistence", reasoning: "Believes in product vision despite market research" }
    ]
  },

  {
    scenario: "Customer feedback reveals that they're using your product in ways you never intended, and these unexpected uses are driving most of your growth.",
    question: "How do you respond?",
    category: "market_adaptation",
    options: [
      { text: "Pivot to focus entirely on these unexpected use cases", value: "full_pivot", reasoning: "Follows market demand to where value is being created" },
      { text: "Develop features specifically to support these unexpected uses", value: "use_case_support", reasoning: "Adapts product to better serve actual user behavior" },
      { text: "Create separate versions optimized for different use cases", value: "product_segmentation", reasoning: "Serves multiple markets with targeted solutions" },
      { text: "Continue with your original vision while monitoring these trends", value: "vision_monitoring", reasoning: "Maintains original direction while staying aware of trends" }
    ]
  },

  // Leadership & Vision
  {
    scenario: "Your startup is growing rapidly, but you're struggling to maintain the culture and values that made you successful initially. Some team members are pushing for more formal processes.",
    question: "What's your approach?",
    category: "scaling_leadership",
    options: [
      { text: "Codify your values and culture into formal processes and systems", value: "systematic_culture", reasoning: "Preserves culture through structural approaches as organization scales" },
      { text: "Hire people who naturally embody your values and trust them to maintain culture", value: "values_based_hiring", reasoning: "Maintains culture through careful selection and trust" },
      { text: "Balance formal processes with preserved informal culture elements", value: "hybrid_approach", reasoning: "Adapts to scaling needs while preserving core cultural elements" },
      { text: "Keep processes minimal and accept that some culture change is inevitable", value: "evolution_acceptance", reasoning: "Accepts cultural evolution as natural part of growth" }
    ]
  },

  {
    scenario: "You have the opportunity to secure a large client that would triple your revenue, but serving them would require significantly changing your product direction and potentially alienating smaller clients.",
    question: "What do you decide?",
    category: "strategic_focus",
    options: [
      { text: "Take the large client and pivot your business strategy accordingly", value: "opportunity_pivot", reasoning: "Seizes major opportunity even if it changes strategic direction" },
      { text: "Decline the opportunity to maintain your current strategic direction", value: "strategic_consistency", reasoning: "Maintains long-term vision despite short-term opportunity" },
      { text: "Try to serve both markets with different product versions", value: "market_segmentation", reasoning: "Attempts to capture opportunity without abandoning current strategy" },
      { text: "Negotiate with the large client to find a solution that works for both", value: "collaborative_solution", reasoning: "Seeks win-win solution that aligns with strategic direction" }
    ]
  },

  // Financial Acumen
  {
    scenario: "Your business is profitable but growing slowly. You could accelerate growth by taking on debt or giving up equity, but this would introduce new pressures and obligations.",
    question: "What's your preference?",
    category: "growth_financing",
    options: [
      { text: "Maintain current profitable growth rate and self-fund expansion", value: "organic_growth", reasoning: "Prioritizes independence and sustainable growth over speed" },
      { text: "Take on strategic debt to accelerate growth while maintaining control", value: "debt_acceleration", reasoning: "Uses leverage to grow faster while retaining ownership" },
      { text: "Raise equity from investors who can add value beyond just money", value: "strategic_equity", reasoning: "Exchanges ownership for capital and strategic support" },
      { text: "Explore creative financing options like revenue-based financing", value: "alternative_financing", reasoning: "Seeks growth capital through innovative financing structures" }
    ]
  },

  // Network Building
  {
    scenario: "You're at a networking event where you could meet influential people in your industry, but you're naturally introverted and find these events draining.",
    question: "How do you approach this?",
    category: "network_building",
    options: [
      { text: "Push yourself to engage actively, knowing the long-term value of relationships", value: "relationship_investment", reasoning: "Invests in networking despite personal comfort zone" },
      { text: "Focus on having a few deep conversations rather than many superficial ones", value: "quality_connections", reasoning: "Builds meaningful relationships aligned with personal style" },
      { text: "Find ways to add value to others rather than focusing on what you can get", value: "value_first_networking", reasoning: "Approaches networking through service and contribution" },
      { text: "Skip these events and focus on building relationships through your work", value: "organic_relationship_building", reasoning: "Builds professional network through natural work interactions" }
    ]
  },

  // Vision & Future Orientation
  {
    scenario: "Industry experts predict that your current business model will be obsolete within 5-7 years due to technological changes, but it's currently very profitable.",
    question: "What's your strategy?",
    category: "future_orientation",
    options: [
      { text: "Start investing heavily in R&D for next-generation solutions now", value: "proactive_innovation", reasoning: "Anticipates change and invests early in future capabilities" },
      { text: "Maximize profits from current model while gradually building new capabilities", value: "transition_strategy", reasoning: "Balances current success with future preparation" },
      { text: "Focus on the present opportunity and adapt when changes actually occur", value: "present_focus", reasoning: "Maximizes current opportunity while staying flexible" },
      { text: "Diversify into multiple business models to reduce future risk", value: "diversification_strategy", reasoning: "Spreads risk across multiple approaches and models" }
    ]
  }
])

// Computed properties
const canProceed = computed(() => {
  return selectedAnswer.value !== null
})

// Helper functions
const getDimensionName = (dimension) => {
  const names = {
    'opportunity_recognition': 'Opportunity Recognition',
    'risk_tolerance': 'Risk Tolerance',
    'innovation_mindset': 'Innovation & Creativity',
    'bias_for_action': 'Bias for Action',
    'resilience': 'Resilience & Persistence',
    'resource_optimization': 'Resource Optimization',
    'market_understanding': 'Market Awareness',
    'leadership_vision': 'Leadership & Vision'
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
}

const nextQuestion = async () => {
  if (!canProceed.value) return

  const currentQ = questions.value[currentQuestion.value]
  const answer = selectedAnswer.value

  // Store response
  responses.value.push({
    question: currentQuestion.value,
    scenario: currentQ.scenario,
    question_text: currentQ.question,
    category: currentQ.category,
    answer: answer,
    selected_option: currentQ.options.find(opt => opt.value === answer)
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
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    const previousResponse = responses.value.pop()
    if (previousResponse) {
      selectedAnswer.value = previousResponse.answer
    }
  }
}

const calculateResults = async () => {
  // Calculate entrepreneurial dimensions
  const dimensions = {
    opportunity_recognition: { score: 0, count: 0 },
    risk_tolerance: { score: 0, count: 0 },
    innovation_mindset: { score: 0, count: 0 },
    bias_for_action: { score: 0, count: 0 },
    resilience: { score: 0, count: 0 },
    resource_optimization: { score: 0, count: 0 },
    market_understanding: { score: 0, count: 0 },
    leadership_vision: { score: 0, count: 0 }
  }

  let totalScore = 0
  let scoreCount = 0

  // Analyze each response and score based on entrepreneurial thinking
  responses.value.forEach(response => {
    const { category, answer } = response
    let score = 0

    // Score responses based on entrepreneurial characteristics
    switch(category) {
      case 'opportunity_recognition':
        if (answer === 'prototype_creation' || answer === 'market_research') score = 5
        else if (answer === 'network_building') score = 4
        else score = 2
        break
      case 'innovation_adoption':
        if (answer === 'early_experimentation') score = 5
        else if (answer === 'learn_from_others') score = 4
        else if (answer === 'cautious_waiting') score = 2
        else score = 1
        break
      case 'risk_tolerance':
        if (answer === 'calculated_transition') score = 5
        else if (answer === 'full_commitment') score = 4
        else if (answer === 'side_hustle') score = 3
        else score = 2
        dimensions.risk_tolerance.score += score
        dimensions.risk_tolerance.count += 1
        break
      case 'pivot_willingness':
        if (answer === 'customer_driven_pivot') score = 5
        else if (answer === 'launch_and_iterate') score = 4
        else if (answer === 'compromise_approach') score = 3
        else score = 2
        dimensions.risk_tolerance.score += score
        dimensions.risk_tolerance.count += 1
        break
      case 'bias_for_action':
        if (answer === 'pilot_implementation') score = 5
        else if (answer === 'formal_proposal') score = 4
        else if (answer === 'consensus_building') score = 3
        else score = 2
        dimensions.bias_for_action.score += score
        dimensions.bias_for_action.count += 1
        break
      case 'decision_speed':
        if (answer === 'quick_decision' || answer === 'focused_evaluation') score = 5
        else if (answer === 'negotiate_timeline') score = 3
        else score = 2
        dimensions.bias_for_action.score += score
        dimensions.bias_for_action.count += 1
        break
      case 'creative_problem_solving':
        if (answer === 'challenge_assumptions' || answer === 'cross_industry_inspiration') score = 5
        else if (answer === 'experimental_approach') score = 4
        else score = 3
        dimensions.innovation_mindset.score += score
        dimensions.innovation_mindset.count += 1
        break
      case 'opportunity_creation':
        if (answer === 'improved_adaptation') score = 5
        else if (answer === 'model_adaptation') score = 4
        else if (answer === 'original_creation') score = 4
        else score = 3
        dimensions.innovation_mindset.score += score
        dimensions.innovation_mindset.count += 1
        break
      case 'persistence':
        if (answer === 'iterative_persistence') score = 5
        else if (answer === 'strategic_pivot' || answer === 'extended_runway') score = 4
        else score = 2
        dimensions.resilience.score += score
        dimensions.resilience.count += 1
        break
      case 'resilience_leadership':
        if (answer === 'inspirational_recovery') score = 5
        else if (answer === 'analytical_recovery') score = 4
        else if (answer === 'patient_recovery') score = 3
        else score = 2
        dimensions.resilience.score += score
        dimensions.resilience.count += 1
        break
      case 'resource_optimization':
        if (answer === 'creative_efficiency' || answer === 'partnership_leverage') score = 5
        else if (answer === 'focused_targeting') score = 4
        else score = 2
        dimensions.resource_optimization.score += score
        dimensions.resource_optimization.count += 1
        break
      case 'resourcefulness':
        if (answer === 'alternative_tools' || answer === 'skill_development') score = 5
        else if (answer === 'equity_partnership' || answer === 'validation_first') score = 4
        else score = 3
        dimensions.resource_optimization.score += score
        dimensions.resource_optimization.count += 1
        break
      case 'market_validation':
        if (answer === 'niche_focus') score = 5
        else if (answer === 'market_adaptation' || answer === 'messaging_optimization') score = 4
        else score = 2
        dimensions.market_understanding.score += score
        dimensions.market_understanding.count += 1
        break
      case 'market_adaptation':
        if (answer === 'use_case_support' || answer === 'full_pivot') score = 5
        else if (answer === 'product_segmentation') score = 4
        else score = 3
        dimensions.market_understanding.score += score
        dimensions.market_understanding.count += 1
        break
      case 'scaling_leadership':
        if (answer === 'systematic_culture' || answer === 'hybrid_approach') score = 5
        else if (answer === 'values_based_hiring') score = 4
        else score = 3
        dimensions.leadership_vision.score += score
        dimensions.leadership_vision.count += 1
        break
      case 'strategic_focus':
        if (answer === 'collaborative_solution') score = 5
        else if (answer === 'market_segmentation') score = 4
        else if (answer === 'strategic_consistency') score = 3
        else score = 4
        dimensions.leadership_vision.score += score
        dimensions.leadership_vision.count += 1
        break
    }
    
    if (category === 'opportunity_recognition' || category === 'innovation_adoption') {
      dimensions.opportunity_recognition.score += score
      dimensions.opportunity_recognition.count += 1
    }
    
    totalScore += score
    scoreCount += 1
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
  
  // Determine entrepreneurial level
  const entrepreneurialLevel = getEntrepreneurialLevel(overallScore)
  
  // Determine entrepreneurial type
  const entrepreneurialType = determineEntrepreneurialType(dimensions, responses.value)
  
  // Calculate venture readiness
  const ventureReadiness = calculateVentureReadiness(dimensions)
  
  // Generate strengths and development areas
  const strengths = getStrengths(dimensions)
  const developmentAreas = getDevelopmentAreas(dimensions)
  
  // Generate action plan
  const actionPlan = generateActionPlan(dimensions, responses.value)
  
  // Generate summary
  const summary = generateSummary(entrepreneurialLevel, overallScore, dimensions, entrepreneurialType)

  results.value = {
    overallScore,
    entrepreneurialLevel,
    entrepreneurialType,
    dimensions,
    ventureReadiness,
    strengths,
    developmentAreas,
    actionPlan,
    summary,
    completedAt: new Date().toISOString()
  }
}

const getLevel = (score) => {
  if (score >= 80) return 'Exceptional'
  if (score >= 65) return 'Strong'
  if (score >= 50) return 'Moderate'
  if (score >= 35) return 'Developing'
  return 'Basic'
}

const getDimensionDescription = (dimension) => {
  const descriptions = {
    'opportunity_recognition': 'Ability to identify and evaluate business opportunities in the environment',
    'risk_tolerance': 'Comfort with uncertainty and willingness to take calculated risks',
    'innovation_mindset': 'Creative thinking and ability to develop novel solutions',
    'bias_for_action': 'Tendency to take initiative and move quickly on opportunities',
    'resilience': 'Ability to bounce back from setbacks and persist through challenges',
    'resource_optimization': 'Skill in making the most of limited resources and finding creative solutions',
    'market_understanding': 'Awareness of customer needs and market dynamics',
    'leadership_vision': 'Ability to inspire others and maintain long-term strategic perspective'
  }
  return descriptions[dimension] || 'Entrepreneurial dimension'
}

const getDimensionInterpretation = (dimension, score) => {
  const interpretations = {
    'opportunity_recognition': {
      high: 'You excel at spotting business opportunities others miss',
      low: 'Work on developing your ability to identify market opportunities'
    },
    'risk_tolerance': {
      high: 'You are comfortable taking calculated risks for potential rewards',
      low: 'Consider building comfort with uncertainty and strategic risk-taking'
    },
    'innovation_mindset': {
      high: 'You think creatively and develop innovative solutions',
      low: 'Focus on developing creative problem-solving and innovation skills'
    },
    'bias_for_action': {
      high: 'You take initiative and act quickly on opportunities',
      low: 'Work on becoming more proactive and action-oriented'
    },
    'resilience': {
      high: 'You bounce back strongly from setbacks and persist through challenges',
      low: 'Build resilience and persistence skills for entrepreneurial challenges'
    },
    'resource_optimization': {
      high: 'You excel at doing more with less and finding creative solutions',
      low: 'Develop skills in making the most of limited resources'
    },
    'market_understanding': {
      high: 'You have strong awareness of customer needs and market dynamics',
      low: 'Strengthen your understanding of markets and customer behavior'
    },
    'leadership_vision': {
      high: 'You inspire others and maintain strong strategic perspective',
      low: 'Develop leadership skills and strategic thinking capabilities'
    }
  }
  return interpretations[dimension]?.[score >= 65 ? 'high' : 'low'] || 'Affects your entrepreneurial potential'
}

const getEntrepreneurialLevel = (score) => {
  if (score >= 80) {
    return {
      name: "High Entrepreneurial Potential",
      description: "You demonstrate exceptional entrepreneurial thinking across most dimensions. You're well-equipped to identify opportunities, take calculated risks, and build successful ventures."
    }
  } else if (score >= 65) {
    return {
      name: "Strong Entrepreneurial Mindset",
      description: "You show solid entrepreneurial characteristics with good potential for business success. Continue developing your weaker areas while leveraging your strengths."
    }
  } else if (score >= 50) {
    return {
      name: "Emerging Entrepreneur",
      description: "You have moderate entrepreneurial potential with clear areas for development. Focus on building key entrepreneurial skills and gaining more experience with business challenges."
    }
  } else if (score >= 35) {
    return {
      name: "Developing Entrepreneurial Skills",
      description: "You're building entrepreneurial capabilities but would benefit from significant development. Consider gaining experience through side projects or working with entrepreneurs."
    }
  } else {
    return {
      name: "Early-Stage Entrepreneurial Development",
      description: "You have opportunities to develop entrepreneurial thinking. Focus on building comfort with risk, opportunity recognition, and action-taking skills."
    }
  }
}

const determineEntrepreneurialType = (dimensions, responses) => {
  // Analyze response patterns to determine entrepreneurial archetype
  const types = {
    innovator: dimensions.innovation_mindset.score,
    executor: dimensions.bias_for_action.score,
    optimizer: dimensions.resource_optimization.score,
    builder: dimensions.leadership_vision.score
  }

  const dominantType = Object.entries(types).sort(([,a], [,b]) => b - a)[0][0]

  const typeProfiles = {
    innovator: {
      name: 'The Innovator',
      description: 'You excel at creative problem-solving and developing novel solutions. You see possibilities others miss and enjoy pushing boundaries.',
      traits: [
        'Strong creative and analytical thinking',
        'Comfortable with ambiguity and experimentation',
        'Naturally questions existing approaches',
        'Excited by breakthrough opportunities'
      ]
    },
    executor: {
      name: 'The Executor',
      description: 'You excel at turning ideas into action. You prefer moving quickly on opportunities and have strong implementation skills.',
      traits: [
        'Bias toward action and rapid execution',
        'Comfortable making decisions with limited information',
        'Strong project management and implementation skills',
        'Motivated by progress and tangible results'
      ]
    },
    optimizer: {
      name: 'The Optimizer',
      description: 'You excel at maximizing resources and finding efficient solutions. You thrive on doing more with less and creating value through optimization.',
      traits: [
        'Exceptional resource efficiency and creativity',
        'Strong problem-solving with constraints',
        'Focus on sustainable and scalable solutions',
        'Motivated by elegant and efficient outcomes'
      ]
    },
    builder: {
      name: 'The Builder',
      description: 'You excel at creating organizations and inspiring others toward a shared vision. You think strategically about long-term value creation.',
      traits: [
        'Strong leadership and vision communication',
        'Focus on building lasting value and impact',
        'Ability to inspire and align others',
        'Strategic thinking about market positioning'
      ]
    }
  }

  return typeProfiles[dominantType]
}

const calculateVentureReadiness = (dimensions) => {
  const idea = Math.round((dimensions.opportunity_recognition.score + dimensions.innovation_mindset.score) / 2)
  const execution = Math.round((dimensions.bias_for_action.score + dimensions.resource_optimization.score) / 2)
  const resilience = dimensions.resilience.score

  let assessment = ""
  const average = Math.round((idea + execution + resilience) / 3)
  
  if (average >= 75) {
    assessment = "You show strong readiness to launch and manage a venture successfully."
  } else if (average >= 60) {
    assessment = "You have good venture readiness with some areas to strengthen before launching."
  } else if (average >= 45) {
    assessment = "You have moderate readiness but should develop key skills before pursuing major ventures."
  } else {
    assessment = "Focus on building fundamental entrepreneurial skills before considering venture creation."
  }

  return { idea, execution, resilience, assessment }
}

const getStrengths = (dimensions) => {
  const strengths = []
  Object.entries(dimensions).forEach(([key, data]) => {
    if (data.score >= 70) {
      const strengthMap = {
        'opportunity_recognition': 'Exceptional ability to identify business opportunities',
        'risk_tolerance': 'Comfortable taking calculated risks for growth',
        'innovation_mindset': 'Strong creative thinking and problem-solving skills',
        'bias_for_action': 'Proactive approach to implementing ideas',
        'resilience': 'Strong persistence and bounce-back ability',
        'resource_optimization': 'Excellent at maximizing limited resources',
        'market_understanding': 'Good awareness of customer and market needs',
        'leadership_vision': 'Strong strategic thinking and leadership capabilities'
      }
      strengths.push(strengthMap[key])
    }
  })
  
  if (strengths.length === 0) {
    strengths.push('Emerging entrepreneurial awareness and interest')
  }
  
  return strengths
}

const getDevelopmentAreas = (dimensions) => {
  const areas = []
  const sorted = Object.entries(dimensions).sort(([,a], [,b]) => a.score - b.score)
  
  sorted.slice(0, 3).forEach(([key, data]) => {
    const areaMap = {
      'opportunity_recognition': 'Develop skills in identifying and evaluating opportunities',
      'risk_tolerance': 'Build comfort with uncertainty and calculated risk-taking',
      'innovation_mindset': 'Strengthen creative thinking and innovation capabilities',
      'bias_for_action': 'Increase proactiveness and speed of implementation',
      'resilience': 'Build persistence and bounce-back skills',
      'resource_optimization': 'Improve ability to maximize limited resources',
      'market_understanding': 'Deepen knowledge of customers and market dynamics',
      'leadership_vision': 'Develop strategic thinking and leadership skills'
    }
    if (data.score < 65) {
      areas.push(areaMap[key])
    }
  })
  
  return areas
}

const generateActionPlan = (dimensions, responses) => {
  const immediate = []
  const longTerm = []
  
  // Find lowest scoring dimensions for targeted development
  const lowestDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 2)
  
  lowestDimensions.forEach(([key, data]) => {
    switch(key) {
      case 'opportunity_recognition':
        immediate.push("Start a daily practice of identifying one potential business opportunity")
        longTerm.push("Develop systematic approach to market research and opportunity evaluation")
        break
      case 'risk_tolerance':
        immediate.push("Take one small calculated risk in your personal or professional life")
        longTerm.push("Gradually increase comfort with uncertainty through measured risk-taking")
        break
      case 'innovation_mindset':
        immediate.push("Challenge one assumption about how things work in your field")
        longTerm.push("Develop creative problem-solving skills through courses and practice")
        break
      case 'bias_for_action':
        immediate.push("Identify one idea and take one concrete action toward it this week")
        longTerm.push("Build habits of rapid prototyping and testing ideas quickly")
        break
      case 'resilience':
        immediate.push("Reflect on past setbacks and identify lessons learned")
        longTerm.push("Build resilience through challenging projects and recovery practices")
        break
      case 'resource_optimization':
        immediate.push("Find one way to accomplish more with less in your current work")
        longTerm.push("Study resource-constrained entrepreneurs and learn optimization techniques")
        break
      case 'market_understanding':
        immediate.push("Have conversations with 5 potential customers about their needs")
        longTerm.push("Develop systematic approach to market research and customer discovery")
        break
      case 'leadership_vision':
        immediate.push("Practice articulating your vision for a project or initiative")
        longTerm.push("Develop leadership skills through courses, mentorship, and practice")
        break
    }
  })
  
  // Add general entrepreneurial development recommendations
  immediate.push("Start following successful entrepreneurs and reading their insights")
  longTerm.push("Consider starting a side project to practice entrepreneurial skills")
  
  return { immediate, longTerm }
}

const generateSummary = (entrepreneurialLevel, overallScore, dimensions, entrepreneurialType) => {
  const topDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)[0]
  
  const bottomDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)[0]

  return `Your entrepreneurial assessment reveals ${entrepreneurialLevel.name.toLowerCase()} with an overall score of ${overallScore}%. Your entrepreneurial archetype is ${entrepreneurialType.name}, characterized by ${entrepreneurialType.description.split('.')[0].toLowerCase()}. Your strongest dimension is ${getDimensionName(topDimension[0])} (${topDimension[1].score}%), where ${topDimension[1].interpretation.toLowerCase()}. Your greatest development opportunity lies in ${getDimensionName(bottomDimension[0])} (${bottomDimension[1].score}%), where you should ${bottomDimension[1].interpretation.toLowerCase()}. ${entrepreneurialLevel.description} Focus on leveraging your natural entrepreneurial strengths while systematically developing areas that will enhance your overall business-building capabilities.`
}

const saveAssessment = async () => {
  if (!user.value || !results.value) return

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'entrepreneurship',
      test_variant_id: 'entrepreneurship_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.entrepreneurialLevel.name,
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
  responses.value = []
  assessmentComplete.value = false
  results.value = null
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

useHead({
  title: 'Entrepreneurial Mindset Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Evaluate your entrepreneurial thinking including opportunity identification, risk-taking, bias for action, and innovation potential.' }
  ]
})
</script>