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
              Character & Integrity Assessment
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
          <div class="text-6xl mb-4">🛡️</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">
            Assessment Complete!
          </h2>
          <div :class="`text-lg ${themeClasses.textSecondary}`">
            Your character and integrity profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Overall Character Score -->
          <div :class="`${themeClasses.featureBackground} rounded-xl p-6 text-center`">
            <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">Your Character Strength</h3>
            <div :class="`text-5xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.overallScore }}%</div>
            <p :class="`${themeClasses.textSecondary} text-lg mb-4`">{{ results.characterLevel.description }}</p>
            
            <!-- Overall Progress Bar -->
            <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-6 mb-4`">
              <div 
                :class="`${getProgressBarColor(results.overallScore)} h-6 rounded-full transition-all duration-1000 flex items-center justify-center`"
                :style="{ width: `${results.overallScore}%` }"
              >
                <span class="text-white text-sm font-bold">{{ results.characterLevel.name }}</span>
              </div>
            </div>
          </div>

          <!-- Character Dimensions -->
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

          <!-- Core Values & Principles -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderAccent}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Character Foundation</h3>
            <div :class="`bg-gradient-to-r ${themeClasses.gradientBackground} p-4 rounded-lg mb-4`">
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Core Principles:</h4>
              <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                <li v-for="principle in results.coreValues" :key="principle">{{ principle }}</li>
              </ul>
            </div>
          </div>

          <!-- Character Strengths & Growth Areas -->
          <div class="grid md:grid-cols-2 gap-6">
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-green-200`">
              <h3 :class="`text-xl font-bold text-green-800 mb-4`">Character Strengths</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="strength in results.strengths" :key="strength" class="flex items-start">
                  <span class="text-green-500 mr-2">🌟</span>
                  {{ strength }}
                </li>
              </ul>
            </div>
            
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-blue-200`">
              <h3 :class="`text-xl font-bold text-blue-800 mb-4`">Growth Opportunities</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="opportunity in results.growthAreas" :key="opportunity" class="flex items-start">
                  <span class="text-blue-500 mr-2">📈</span>
                  {{ opportunity }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Character Development Plan -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Character Development Plan</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Daily Practices:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="practice in results.developmentPlan.daily" :key="practice">{{ practice }}</li>
                </ul>
              </div>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Long-term Goals:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="goal in results.developmentPlan.longTerm" :key="goal">{{ goal }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Overall Summary -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Character & Integrity Summary</h3>
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
          <p :class="themeClasses.textSecondary">Analyzing your character and integrity...</p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else :class="`${themeClasses.cardBackground} rounded-lg ${themeClasses.cardShadow} p-8`">
        <div class="mb-8">
          <h2 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6`">
            Ethical Scenario {{ currentQuestion + 1 }}
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
                [`${themeClasses.cardBackground} ${themeClasses.textPrimary} ${themeClasses.borderSecondary} ${themeClasses.hoverHighlight}`]: selectedAnswer !== (option.value || index)
              }"
              class="w-full p-4 border-2 rounded-lg transition-all duration-200 text-left"
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

// Ethical scenario questions for Character & Integrity Assessment
const questions = ref([
  // Honesty & Truthfulness
  {
    scenario: "You're in a job interview and the interviewer asks about a skill you've listed on your resume. You exaggerated this skill significantly, though you do have basic knowledge.",
    question: "What do you do?",
    category: "honesty",
    options: [
      { text: "Admit that you overstated the skill and explain your actual level", value: "honest_admission", reasoning: "Demonstrates integrity and willingness to correct mistakes" },
      { text: "Try to navigate the conversation without directly lying but without admitting the exaggeration", value: "careful_navigation", reasoning: "Attempts to avoid both lying and damaging consequences" },
      { text: "Emphasize your ability to learn quickly and deflect from the specific skill", value: "deflection", reasoning: "Avoids the issue while highlighting other positive qualities" },
      { text: "Maintain the exaggeration and try to sound confident about the skill", value: "maintain_exaggeration", reasoning: "Prioritizes short-term success over honesty" }
    ]
  },

  {
    scenario: "Your close friend asks for your honest opinion about their new business idea, which you genuinely believe has significant flaws and is likely to fail.",
    question: "How do you respond?",
    category: "honesty",
    options: [
      { text: "Give honest, constructive feedback about the flaws you see", value: "constructive_honesty", reasoning: "Shows care through difficult but helpful truth-telling" },
      { text: "Point out some concerns while also highlighting potential positives", value: "balanced_feedback", reasoning: "Provides honest input while maintaining encouragement" },
      { text: "Ask probing questions to help them discover the issues themselves", value: "socratic_approach", reasoning: "Guides them to insights while avoiding direct criticism" },
      { text: "Express general support without sharing your specific concerns", value: "supportive_avoidance", reasoning: "Prioritizes the relationship over potentially hurtful honesty" }
    ]
  },

  // Moral Courage
  {
    scenario: "At a team meeting, your supervisor takes credit for an innovative idea that was actually yours. Several colleagues know the truth, but no one speaks up.",
    question: "What is your response?",
    category: "moral_courage",
    options: [
      { text: "Politely but clearly correct the record in front of the group", value: "public_correction", reasoning: "Demonstrates courage to stand up for truth in difficult situations" },
      { text: "Address the issue privately with your supervisor after the meeting", value: "private_discussion", reasoning: "Seeks resolution while avoiding public confrontation" },
      { text: "Document the situation and discuss it with HR", value: "formal_channels", reasoning: "Uses organizational processes to address ethical breaches" },
      { text: "Let it go this time but be more careful to document your ideas in the future", value: "strategic_withdrawal", reasoning: "Chooses battles carefully while protecting future interests" }
    ]
  },

  {
    scenario: "You witness a colleague making inappropriate comments that could be considered harassment toward another employee. The target seems uncomfortable but hasn't complained.",
    question: "What do you do?",
    category: "moral_courage",
    options: [
      { text: "Speak up immediately to address the inappropriate behavior", value: "immediate_intervention", reasoning: "Shows courage to intervene when others are being harmed" },
      { text: "Talk to the person being harassed privately to offer support", value: "victim_support", reasoning: "Focuses on helping the person being affected" },
      { text: "Report the behavior to management or HR", value: "formal_reporting", reasoning: "Uses proper channels to address serious workplace issues" },
      { text: "Document the incident and wait to see if it happens again", value: "documentation_waiting", reasoning: "Gathers evidence while avoiding premature action" }
    ]
  },

  // Respect & Dignity
  {
    scenario: "You're working on a project with someone whose working style and communication approach are very different from yours. Their methods frustrate you, but they're getting results.",
    question: "How do you handle this situation?",
    category: "respect",
    options: [
      { text: "Adapt your approach to work better with their style", value: "adaptive_collaboration", reasoning: "Shows respect for different approaches and focuses on outcomes" },
      { text: "Have an open conversation about working styles to find common ground", value: "open_dialogue", reasoning: "Seeks mutual understanding and collaborative solutions" },
      { text: "Focus on your own work and minimize interactions", value: "minimal_interaction", reasoning: "Avoids conflict while maintaining professional boundaries" },
      { text: "Try to influence them to work more like you do", value: "style_influence", reasoning: "Prioritizes familiar approaches over accommodation" }
    ]
  },

  {
    scenario: "During a heated discussion about a controversial social issue, someone expresses views that you find deeply offensive and morally wrong.",
    question: "What is your approach?",
    category: "respect",
    options: [
      { text: "Listen respectfully, then share your perspective calmly and thoughtfully", value: "respectful_dialogue", reasoning: "Maintains dignity while engaging in meaningful exchange" },
      { text: "Ask questions to understand their reasoning better", value: "understanding_questions", reasoning: "Seeks to understand before being understood" },
      { text: "Express your disagreement firmly but avoid personal attacks", value: "firm_disagreement", reasoning: "Stands for values while respecting the person" },
      { text: "Disengage from the conversation to avoid conflict", value: "conflict_avoidance", reasoning: "Prioritizes harmony over challenging offensive views" }
    ]
  },

  // Accountability & Responsibility
  {
    scenario: "You made an error in a report that went to senior leadership. The mistake led to a flawed decision, but it's possible no one will trace it back to you.",
    question: "What do you do?",
    category: "accountability",
    options: [
      { text: "Immediately report the error and take full responsibility", value: "immediate_accountability", reasoning: "Demonstrates complete integrity and responsibility" },
      { text: "Correct the error and inform your direct supervisor", value: "supervisor_notification", reasoning: "Takes responsibility through proper channels" },
      { text: "Fix the error quietly and put better checking processes in place", value: "quiet_correction", reasoning: "Addresses the problem while avoiding public embarrassment" },
      { text: "Wait to see if anyone notices, then respond if questioned", value: "reactive_approach", reasoning: "Minimizes consequences while remaining ready to admit if discovered" }
    ]
  },

  {
    scenario: "Your team missed an important deadline, and while you completed your part on time, you could have done more to help others who were struggling.",
    question: "How do you view your responsibility?",
    category: "accountability",
    options: [
      { text: "Take partial responsibility for not supporting the team more effectively", value: "shared_responsibility", reasoning: "Recognizes collective responsibility and leadership opportunities" },
      { text: "Acknowledge you could have helped more while noting you met your commitments", value: "balanced_accountability", reasoning: "Balances personal accountability with fair assessment" },
      { text: "Focus on what you can do better next time to support team success", value: "future_focused", reasoning: "Emphasizes learning and improvement over blame" },
      { text: "Clarify that you fulfilled your responsibilities as assigned", value: "role_clarity", reasoning: "Distinguishes between individual and collective responsibility" }
    ]
  },

  // Fairness & Justice
  {
    scenario: "You're part of a hiring committee and notice that qualified candidates from certain backgrounds seem to be consistently rated lower by some committee members, despite strong credentials.",
    question: "What action do you take?",
    category: "fairness",
    options: [
      { text: "Raise the pattern you've observed and advocate for fair evaluation", value: "bias_advocacy", reasoning: "Demonstrates commitment to fairness and justice" },
      { text: "Make extra effort to highlight the strengths of undervalued candidates", value: "individual_advocacy", reasoning: "Works within the system to promote fairness" },
      { text: "Suggest implementing more structured, objective evaluation criteria", value: "systematic_improvement", reasoning: "Addresses bias through process improvements" },
      { text: "Document the pattern and report it to appropriate authorities", value: "formal_documentation", reasoning: "Uses official channels to address systemic unfairness" }
    ]
  },

  {
    scenario: "Your organization is considering a policy change that would benefit the company financially but would negatively impact many employees' work-life balance and wellbeing.",
    question: "What is your position?",
    category: "fairness",
    options: [
      { text: "Advocate for employee interests and propose alternative solutions", value: "employee_advocacy", reasoning: "Prioritizes human welfare and seeks win-win solutions" },
      { text: "Support exploring ways to minimize negative impacts on employees", value: "impact_mitigation", reasoning: "Balances business needs with employee welfare" },
      { text: "Focus on ensuring the policy is implemented fairly across all employees", value: "fair_implementation", reasoning: "Emphasizes consistency and equal treatment" },
      { text: "Support the business decision while working to help employees adapt", value: "adaptation_support", reasoning: "Accepts business needs while providing employee support" }
    ]
  },

  // Integrity Under Pressure
  {
    scenario: "Your manager asks you to present data in a way that's technically accurate but misleading, to make the department look better to executives.",
    question: "How do you respond?",
    category: "integrity_under_pressure",
    options: [
      { text: "Refuse to present misleading information and explain your concerns", value: "principled_refusal", reasoning: "Maintains integrity despite potential consequences" },
      { text: "Suggest alternative ways to present the data honestly but favorably", value: "ethical_alternatives", reasoning: "Seeks solutions that maintain integrity while meeting goals" },
      { text: "Ask for clarification on why the misleading presentation is necessary", value: "clarifying_questions", reasoning: "Seeks understanding before making ethical decisions" },
      { text: "Do as asked but document the interaction for your own protection", value: "compliance_with_documentation", reasoning: "Follows orders while creating accountability trail" }
    ]
  },

  {
    scenario: "You discover that a close friend and colleague has been padding their expense reports with false claims. They confide in you about financial troubles at home.",
    question: "What do you do?",
    category: "integrity_under_pressure",
    options: [
      { text: "Urge them to stop immediately and offer to help them find other solutions", value: "supportive_intervention", reasoning: "Combines ethical standards with compassionate support" },
      { text: "Give them a deadline to self-report or you'll have to report it yourself", value: "accountability_deadline", reasoning: "Balances loyalty with responsibility" },
      { text: "Report the behavior while keeping their personal situation confidential", value: "confidential_reporting", reasoning: "Fulfills ethical obligations while protecting personal information" },
      { text: "Try to help them financially so they'll stop the false claims", value: "personal_solution", reasoning: "Addresses root cause while avoiding formal reporting" }
    ]
  },

  // Service & Contribution
  {
    scenario: "You have an opportunity to volunteer for a meaningful community project, but it would require significant time away from work and family.",
    question: "How do you make this decision?",
    category: "service",
    options: [
      { text: "Find a way to contribute that balances all your responsibilities", value: "balanced_contribution", reasoning: "Seeks to serve while honoring all commitments" },
      { text: "Commit fully to the project because of its important impact", value: "full_commitment", reasoning: "Prioritizes service and community contribution" },
      { text: "Decline this time but look for other ways to contribute", value: "alternative_service", reasoning: "Maintains service orientation while managing constraints" },
      { text: "Focus on your existing responsibilities rather than taking on more", value: "current_focus", reasoning: "Prioritizes existing commitments over additional service" }
    ]
  },

  // Wisdom & Judgment
  {
    scenario: "You're asked to give advice to a junior colleague who is considering leaving the company for what seems like a risky career move.",
    question: "What approach do you take?",
    category: "wisdom",
    options: [
      { text: "Share your perspective while emphasizing that the decision is ultimately theirs", value: "respectful_guidance", reasoning: "Provides wisdom while respecting autonomy" },
      { text: "Ask thoughtful questions to help them clarify their own thinking", value: "socratic_guidance", reasoning: "Facilitates their own decision-making process" },
      { text: "Share relevant experiences and lessons you've learned", value: "experience_sharing", reasoning: "Offers practical wisdom from lived experience" },
      { text: "Encourage them to carefully weigh all factors before deciding", value: "deliberative_approach", reasoning: "Promotes careful consideration and wise decision-making" }
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
    'honesty': 'Honesty & Authenticity',
    'moral_courage': 'Moral Courage',
    'respect': 'Respect & Dignity',
    'accountability': 'Accountability',
    'fairness': 'Fairness & Justice',
    'integrity_under_pressure': 'Integrity Under Pressure',
    'service': 'Service & Contribution',
    'wisdom': 'Wisdom & Judgment'
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
  // Calculate character dimensions based on ethical scenarios
  const dimensions = {
    honesty: { score: 0, count: 0 },
    moral_courage: { score: 0, count: 0 },
    respect: { score: 0, count: 0 },
    accountability: { score: 0, count: 0 },
    fairness: { score: 0, count: 0 },
    integrity_under_pressure: { score: 0, count: 0 },
    service: { score: 0, count: 0 },
    wisdom: { score: 0, count: 0 }
  }

  let totalScore = 0
  let scoreCount = 0

  // Analyze each response and score based on character strength
  responses.value.forEach(response => {
    const { category, answer } = response
    let score = 0

    // Score responses based on character and integrity principles
    switch(category) {
      case 'honesty':
        if (answer === 'honest_admission' || answer === 'constructive_honesty') score = 5
        else if (answer === 'balanced_feedback' || answer === 'careful_navigation') score = 4
        else if (answer === 'socratic_approach' || answer === 'deflection') score = 3
        else score = 2
        break
      case 'moral_courage':
        if (answer === 'public_correction' || answer === 'immediate_intervention') score = 5
        else if (answer === 'formal_reporting' || answer === 'victim_support') score = 4
        else if (answer === 'private_discussion' || answer === 'formal_channels') score = 4
        else score = 3
        break
      case 'respect':
        if (answer === 'adaptive_collaboration' || answer === 'respectful_dialogue') score = 5
        else if (answer === 'open_dialogue' || answer === 'understanding_questions') score = 4
        else if (answer === 'firm_disagreement') score = 3
        else score = 2
        break
      case 'accountability':
        if (answer === 'immediate_accountability' || answer === 'shared_responsibility') score = 5
        else if (answer === 'supervisor_notification' || answer === 'balanced_accountability') score = 4
        else if (answer === 'future_focused') score = 4
        else score = 2
        break
      case 'fairness':
        if (answer === 'bias_advocacy' || answer === 'employee_advocacy') score = 5
        else if (answer === 'individual_advocacy' || answer === 'systematic_improvement') score = 4
        else if (answer === 'formal_documentation' || answer === 'impact_mitigation') score = 4
        else score = 3
        break
      case 'integrity_under_pressure':
        if (answer === 'principled_refusal' || answer === 'supportive_intervention') score = 5
        else if (answer === 'ethical_alternatives' || answer === 'accountability_deadline') score = 4
        else if (answer === 'clarifying_questions' || answer === 'confidential_reporting') score = 3
        else score = 2
        break
      case 'service':
        if (answer === 'balanced_contribution') score = 5
        else if (answer === 'full_commitment' || answer === 'alternative_service') score = 4
        else score = 3
        break
      case 'wisdom':
        if (answer === 'respectful_guidance' || answer === 'socratic_guidance') score = 5
        else if (answer === 'experience_sharing' || answer === 'deliberative_approach') score = 4
        else score = 3
        break
    }
    
    dimensions[category].score += score
    dimensions[category].count += 1
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
  
  // Determine character level
  const characterLevel = getCharacterLevel(overallScore)
  
  // Generate core values and principles
  const coreValues = generateCoreValues(dimensions, responses.value)
  
  // Generate strengths and growth areas
  const strengths = getStrengths(dimensions)
  const growthAreas = getGrowthAreas(dimensions)
  
  // Generate development plan
  const developmentPlan = generateDevelopmentPlan(dimensions, responses.value)
  
  // Generate summary
  const summary = generateSummary(characterLevel, overallScore, dimensions)

  results.value = {
    overallScore,
    characterLevel,
    dimensions,
    coreValues,
    strengths,
    growthAreas,
    developmentPlan,
    summary,
    completedAt: new Date().toISOString()
  }
}

const getLevel = (score) => {
  if (score >= 85) return 'Exemplary'
  if (score >= 70) return 'Strong'
  if (score >= 55) return 'Developing'
  if (score >= 40) return 'Basic'
  return 'Needs Focus'
}

const getDimensionDescription = (dimension) => {
  const descriptions = {
    'honesty': 'Commitment to truthfulness, authenticity, and transparent communication',
    'moral_courage': 'Willingness to stand up for what is right, even in difficult circumstances',
    'respect': 'Treating all people with dignity and valuing diverse perspectives',
    'accountability': 'Taking responsibility for actions, decisions, and their consequences',
    'fairness': 'Commitment to justice, equality, and fair treatment for all',
    'integrity_under_pressure': 'Maintaining ethical standards when facing challenges or temptations',
    'service': 'Dedication to contributing to others and the greater good',
    'wisdom': 'Sound judgment, practical insight, and thoughtful decision-making'
  }
  return descriptions[dimension] || 'Character dimension'
}

const getDimensionInterpretation = (dimension, score) => {
  const interpretations = {
    'honesty': {
      high: 'You consistently choose truth and authenticity even when difficult',
      low: 'Focus on building stronger commitment to honesty in all situations'
    },
    'moral_courage': {
      high: 'You courageously stand up for what is right when it matters',
      low: 'Develop confidence to speak up for your values and others'
    },
    'respect': {
      high: 'You treat all people with dignity and value their perspectives',
      low: 'Work on appreciating differences and showing respect for all people'
    },
    'accountability': {
      high: 'You take full responsibility for your actions and decisions',
      low: 'Strengthen your willingness to own mistakes and consequences'
    },
    'fairness': {
      high: 'You actively promote justice and fair treatment for everyone',
      low: 'Develop stronger commitment to equality and justice'
    },
    'integrity_under_pressure': {
      high: 'You maintain your principles even under significant pressure',
      low: 'Build resilience to maintain ethics when facing difficulties'
    },
    'service': {
      high: 'You actively seek ways to contribute and serve others',
      low: 'Look for more opportunities to contribute to the greater good'
    },
    'wisdom': {
      high: 'You demonstrate sound judgment and thoughtful decision-making',
      low: 'Focus on developing deeper insight and practical wisdom'
    }
  }
  return interpretations[dimension]?.[score >= 70 ? 'high' : 'low'] || 'Affects your character development'
}

const getCharacterLevel = (score) => {
  if (score >= 85) {
    return {
      name: "Exemplary Character",
      description: "You demonstrate exceptional character strength across all dimensions. You're a role model for integrity, consistently making ethical choices and inspiring others through your example."
    }
  } else if (score >= 70) {
    return {
      name: "Strong Character",
      description: "You show solid character with consistent ethical behavior across most situations. You're trusted by others and generally make decisions aligned with your values."
    }
  } else if (score >= 55) {
    return {
      name: "Developing Character",
      description: "You have good foundational character with clear areas for growth. Focus on strengthening your ethical decision-making and consistency in challenging situations."
    }
  } else if (score >= 40) {
    return {
      name: "Emerging Character",
      description: "You're working on building stronger character foundations. Concentrate on developing core principles and practicing ethical behavior in daily decisions."
    }
  } else {
    return {
      name: "Character Building",
      description: "You have significant opportunities to develop your character. Focus on establishing strong ethical principles and practicing integrity in small, daily choices."
    }
  }
}

const generateCoreValues = (dimensions, responses) => {
  const values = []
  
  // Generate core values based on strongest dimensions
  Object.entries(dimensions)
    .filter(([,data]) => data.score >= 70)
    .forEach(([key]) => {
      const valueMap = {
        'honesty': 'Truth and authenticity in all communications',
        'moral_courage': 'Standing up for what is right, regardless of personal cost',
        'respect': 'Treating every person with dignity and worth',
        'accountability': 'Taking full responsibility for actions and consequences',
        'fairness': 'Promoting justice and equality for all people',
        'integrity_under_pressure': 'Maintaining principles even in difficult circumstances',
        'service': 'Contributing to the welfare of others and society',
        'wisdom': 'Making thoughtful, well-considered decisions'
      }
      values.push(valueMap[key])
    })
  
  if (values.length === 0) {
    values.push('Commitment to personal growth and ethical development')
  }
  
  return values
}

const getStrengths = (dimensions) => {
  const strengths = []
  Object.entries(dimensions).forEach(([key, data]) => {
    if (data.score >= 75) {
      const strengthMap = {
        'honesty': 'Exceptional commitment to truth and authenticity',
        'moral_courage': 'Courageous advocacy for what is right',
        'respect': 'Deep respect for human dignity and diversity',
        'accountability': 'Strong personal responsibility and ownership',
        'fairness': 'Passionate commitment to justice and equality',
        'integrity_under_pressure': 'Unwavering principles under pressure',
        'service': 'Generous spirit of service and contribution',
        'wisdom': 'Sound judgment and thoughtful decision-making'
      }
      strengths.push(strengthMap[key])
    }
  })
  
  if (strengths.length === 0) {
    strengths.push('Desire for character growth and ethical development')
  }
  
  return strengths
}

const getGrowthAreas = (dimensions) => {
  const areas = []
  const sorted = Object.entries(dimensions).sort(([,a], [,b]) => a.score - b.score)
  
  sorted.slice(0, 3).forEach(([key, data]) => {
    const areaMap = {
      'honesty': 'Build stronger commitment to truth in all situations',
      'moral_courage': 'Develop courage to speak up for your values',
      'respect': 'Strengthen appreciation for diverse perspectives',
      'accountability': 'Increase willingness to take responsibility',
      'fairness': 'Deepen commitment to justice and equality',
      'integrity_under_pressure': 'Build resilience to maintain ethics under stress',
      'service': 'Find more ways to contribute to others',
      'wisdom': 'Develop deeper insight and better judgment'
    }
    if (data.score < 70) {
      areas.push(areaMap[key])
    }
  })
  
  return areas
}

const generateDevelopmentPlan = (dimensions, responses) => {
  const daily = []
  const longTerm = []
  
  // Find lowest scoring dimensions for targeted development
  const lowestDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 2)
  
  lowestDimensions.forEach(([key, data]) => {
    switch(key) {
      case 'honesty':
        daily.push("Practice radical honesty in small, daily interactions")
        longTerm.push("Build reputation for trustworthiness and authenticity")
        break
      case 'moral_courage':
        daily.push("Speak up for your values in low-risk situations to build courage")
        longTerm.push("Develop the strength to advocate for others in difficult circumstances")
        break
      case 'respect':
        daily.push("Listen actively to understand others' perspectives")
        longTerm.push("Become known for treating everyone with dignity and respect")
        break
      case 'accountability':
        daily.push("Take immediate responsibility for mistakes without excuses")
        longTerm.push("Build a reputation for reliability and personal ownership")
        break
      case 'fairness':
        daily.push("Notice and address small instances of unfair treatment")
        longTerm.push("Become an advocate for justice and equality in your sphere of influence")
        break
      case 'integrity_under_pressure':
        daily.push("Practice maintaining your principles in small challenges")
        longTerm.push("Build the resilience to uphold ethics even in major crises")
        break
      case 'service':
        daily.push("Look for small ways to help others each day")
        longTerm.push("Find meaningful ways to contribute to causes larger than yourself")
        break
      case 'wisdom':
        daily.push("Pause to think carefully before making important decisions")
        longTerm.push("Develop deep insight through study, reflection, and experience")
        break
    }
  })
  
  // Add general character development practices
  daily.push("Reflect on your actions and decisions each evening")
  longTerm.push("Become a person others turn to for ethical guidance and example")
  
  return { daily, longTerm }
}

const generateSummary = (characterLevel, overallScore, dimensions) => {
  const topDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)[0]
  
  const bottomDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)[0]

  return `Your character and integrity assessment reveals ${characterLevel.name.toLowerCase()} with an overall strength score of ${overallScore}%. Your strongest character dimension is ${getDimensionName(topDimension[0])} (${topDimension[1].score}%), demonstrating that ${topDimension[1].interpretation.toLowerCase()}. Your greatest growth opportunity lies in ${getDimensionName(bottomDimension[0])} (${bottomDimension[1].score}%), where you can ${bottomDimension[1].interpretation.toLowerCase()}. ${characterLevel.description} Character is built through daily choices and consistent practice of ethical principles. Focus on your growth areas while continuing to strengthen your existing character foundations.`
}

const saveAssessment = async () => {
  if (!user.value || !results.value) return

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'character_assessment',
      test_variant_id: 'character_assessment_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.characterLevel.name,
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'character',
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
  title: 'Character & Integrity Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Evaluate your character development including respect, moral courage, and ethical decision-making in challenging situations.' }
  ]
})
</script>