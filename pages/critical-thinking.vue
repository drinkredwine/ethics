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
        <div class="text-6xl mb-4">🧠</div>
        <div class="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-2">Skills & Strengths Assessment</div>
        <h1 :class="`text-4xl font-bold ${themeClasses.textPrimary} mb-4`">Critical Thinking Assessment</h1>
        <p :class="`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`">
          Evaluate your analytical and logical reasoning abilities including analysis, evaluation, inference, interpretation, and problem-solving skills. Essential for effective decision-making.
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
          
          <div v-if="questions[currentQuestion - 1].scenario" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mb-6 border-l-4 border-indigo-500`">
            <div class="font-semibold text-indigo-600 mb-2">Scenario:</div>
            <div :class="themeClasses.textSecondary">{{ questions[currentQuestion - 1].scenario }}</div>
          </div>

          <div v-if="questions[currentQuestion - 1].context" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mb-6 border-l-4 border-purple-500`">
            <div class="font-semibold text-purple-600 mb-2">Context:</div>
            <div :class="themeClasses.textSecondary" v-html="questions[currentQuestion - 1].context"></div>
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
              <div class="flex-1">
                <div :class="`font-medium ${themeClasses.textPrimary}`">{{ option.text }}</div>
                <div v-if="option.explanation" :class="`text-sm ${themeClasses.textSecondary} mt-1`">{{ option.explanation }}</div>
              </div>
            </div>
          </button>
        </div>

        <!-- Logic Problems -->
        <div v-if="questions[currentQuestion - 1].type === 'logic_problem'" class="mb-8">
          <div :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mb-4`">
            <div class="font-mono text-sm" v-html="questions[currentQuestion - 1].logic_setup"></div>
          </div>
          <div class="space-y-3">
            <button
              v-for="option in questions[currentQuestion - 1].options"
              :key="option.value"
              @click="selectAnswer(option.value)"
              :class="`w-full text-left p-3 rounded-lg border-2 transition-all ${
                answers[currentQuestion - 1] === option.value
                  ? `${themeClasses.borderPrimary} ${themeClasses.backgroundPrimary}`
                  : `${themeClasses.borderColor} ${themeClasses.cardHover}`
              }`"
            >
              <div class="flex items-center space-x-3">
                <div :class="`w-4 h-4 rounded border flex-shrink-0 ${
                  answers[currentQuestion - 1] === option.value ? 'bg-indigo-500 border-indigo-500' : themeClasses.borderColor
                }`">
                  <div v-if="answers[currentQuestion - 1] === option.value" class="w-full h-full bg-white scale-75 rounded"></div>
                </div>
                <span :class="`font-medium ${themeClasses.textPrimary}`">{{ option.text }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Argument Analysis -->
        <div v-if="questions[currentQuestion - 1].type === 'argument_analysis'" class="mb-8">
          <div :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mb-4 border-l-4 border-orange-500`">
            <div class="font-semibold text-orange-600 mb-2">Argument:</div>
            <div :class="themeClasses.textSecondary" style="font-style: italic;">{{ questions[currentQuestion - 1].argument }}</div>
          </div>
          <div class="space-y-3">
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
                  <div v-if="option.rationale" :class="`text-sm ${themeClasses.textSecondary} mt-1`">{{ option.rationale }}</div>
                </div>
              </div>
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
          <div class="text-6xl mb-4">{{ getThinkingEmoji(results.overall_score) }}</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">{{ results.thinking_level }}</h2>
          <p :class="`text-xl ${themeClasses.textSecondary} mb-6`">Critical Thinking Assessment</p>
          
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

        <!-- Skill Breakdown -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Critical Thinking Skills Analysis</h3>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div v-for="skill in results.skills" :key="skill.name" class="space-y-3">
              <div class="flex justify-between items-center">
                <span :class="`font-medium ${themeClasses.textPrimary}`">{{ skill.name }}</span>
                <span :class="`text-sm font-bold ${getSkillColor(skill.score)}`">
                  {{ skill.score }}/5
                </span>
              </div>
              <div :class="`w-full bg-gray-200 rounded-full h-2 ${themeClasses.borderColor} border`">
                <div 
                  :class="`h-2 rounded-full transition-all duration-1000 ${getSkillBarColor(skill.score)}`"
                  :style="`width: ${(skill.score / 5) * 100}%`"
                ></div>
              </div>
              <p :class="`text-sm ${themeClasses.textSecondary}`">{{ skill.description }}</p>
            </div>
          </div>
        </div>

        <!-- Thinking Style Profile -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Your Thinking Style</h3>
          
          <div :class="`${themeClasses.backgroundSecondary} rounded-lg p-6 border-l-4 border-blue-500`">
            <h4 :class="`text-lg font-semibold ${themeClasses.textPrimary} mb-3`">{{ results.thinking_style.name }}</h4>
            <p :class="`${themeClasses.textSecondary} mb-4`">{{ results.thinking_style.description }}</p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h5 :class="`font-semibold ${themeClasses.textPrimary} mb-3`">Strengths:</h5>
                <ul :class="`text-sm ${themeClasses.textSecondary} space-y-2`">
                  <li v-for="strength in results.thinking_style.strengths" :key="strength" class="flex items-start space-x-2">
                    <span class="text-green-500 mt-0.5">✓</span>
                    <span>{{ strength }}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 :class="`font-semibold ${themeClasses.textPrimary} mb-3`">Development Areas:</h5>
                <ul :class="`text-sm ${themeClasses.textSecondary} space-y-2`">
                  <li v-for="area in results.thinking_style.development_areas" :key="area" class="flex items-start space-x-2">
                    <span class="text-orange-500 mt-0.5">→</span>
                    <span>{{ area }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Improvement Recommendations -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Skill Enhancement Plan</h3>
          
          <div class="space-y-6">
            <div v-for="(recommendation, index) in results.improvement_plan" :key="index" :class="`${themeClasses.backgroundSecondary} rounded-lg p-5`">
              <div class="flex items-start space-x-4">
                <div class="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">{{ recommendation.title }}</h4>
                  <p :class="`${themeClasses.textSecondary} text-sm mb-3`">{{ recommendation.description }}</p>
                  <div class="space-y-1">
                    <div v-for="activity in recommendation.activities" :key="activity" class="flex items-start space-x-2">
                      <span class="text-blue-500 mt-1">•</span>
                      <span :class="`text-sm ${themeClasses.textSecondary}`">{{ activity }}</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span v-for="skill in recommendation.target_skills" :key="skill" class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cognitive Biases Awareness -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Cognitive Bias Awareness</h3>
          <p :class="`text-center ${themeClasses.textSecondary} mb-6`">
            Be mindful of these common thinking traps that may affect your reasoning:
          </p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div v-for="bias in results.bias_awareness" :key="bias.name" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4`">
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2 flex items-center`">
                <span class="mr-2">⚠️</span>
                {{ bias.name }}
              </h4>
              <p :class="`text-sm ${themeClasses.textSecondary} mb-2`">{{ bias.description }}</p>
              <div :class="`text-xs ${themeClasses.textSecondary} italic`">{{ bias.mitigation }}</div>
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

// Questions array with different critical thinking problem types
const questions = ref([
  {
    type: 'multiple_choice',
    category: 'Analysis',
    question: 'Which of the following represents the strongest logical analysis of the given information?',
    scenario: 'A company\'s sales increased by 20% in Q1, 15% in Q2, 10% in Q3, and 5% in Q4. Marketing spend was highest in Q1 and lowest in Q4.',
    options: [
      {
        value: 'correlation_causation',
        text: 'Higher marketing spend directly caused higher sales growth',
        explanation: 'Assumes causation without considering other factors'
      },
      {
        value: 'pattern_recognition',
        text: 'There\'s a pattern of declining growth that corresponds with reduced marketing',
        explanation: 'Identifies the pattern while avoiding definitive causal claims'
      },
      {
        value: 'single_factor',
        text: 'Sales growth declined due to market saturation over time',
        explanation: 'Assumes a single alternative cause without evidence'
      },
      {
        value: 'incomplete_analysis',
        text: 'The data is insufficient to draw any meaningful conclusions',
        explanation: 'Overly conservative, ignoring observable patterns'
      }
    ]
  },
  {
    type: 'logic_problem',
    category: 'Deductive Reasoning',
    question: 'Based on the logical premises below, which conclusion is necessarily true?',
    logic_setup: '<strong>Premises:</strong><br/>1. All managers are employees<br/>2. Some employees work remotely<br/>3. No remote workers attend daily meetings<br/>4. Sarah is a manager who attends daily meetings',
    options: [
      { value: 'sarah_remote', text: 'Sarah works remotely' },
      { value: 'sarah_not_remote', text: 'Sarah does not work remotely' },
      { value: 'sarah_employee', text: 'Sarah is an employee' },
      { value: 'insufficient_info', text: 'Cannot determine from given information' }
    ]
  },
  {
    type: 'argument_analysis',
    category: 'Evaluation',
    question: 'Evaluate the strength of the following argument:',
    argument: 'We should implement a four-day work week because studies show it increases productivity. A trial at Company X resulted in 23% higher output with happier employees. Therefore, all companies would benefit from this change.',
    options: [
      {
        value: 'strong_valid',
        text: 'Strong and valid argument',
        rationale: 'Has evidence and logical structure'
      },
      {
        value: 'evidence_but_flawed',
        text: 'Has evidence but contains logical flaws',
        rationale: 'Generalizes from limited data to all companies'
      },
      {
        value: 'weak_insufficient',
        text: 'Weak due to insufficient evidence',
        rationale: 'Single study is not enough evidence'
      },
      {
        value: 'invalid_structure',
        text: 'Invalid logical structure',
        rationale: 'The conclusion doesn\'t follow from premises'
      }
    ]
  },
  {
    type: 'multiple_choice',
    category: 'Problem Solving',
    question: 'A manufacturing plant needs to reduce costs by 15% while maintaining quality and employee satisfaction. Which approach demonstrates the best problem-solving methodology?',
    context: 'Current major expenses: 40% labor, 30% materials, 20% equipment, 10% overhead. Union contract prevents wage cuts. Quality standards cannot be compromised.',
    options: [
      {
        value: 'systematic_analysis',
        text: 'Analyze each cost category systematically for optimization opportunities',
        explanation: 'Comprehensive approach considering all constraints'
      },
      {
        value: 'quick_cuts',
        text: 'Focus on overhead reduction since it\'s the most flexible area',
        explanation: 'May not achieve 15% target and ignores larger opportunities'
      },
      {
        value: 'technology_focus',
        text: 'Invest in automation to reduce long-term labor costs',
        explanation: 'May increase short-term costs and affect employee satisfaction'
      },
      {
        value: 'supplier_negotiation',
        text: 'Negotiate better rates with material suppliers',
        explanation: 'Addresses largest variable cost but may compromise quality'
      }
    ]
  },
  {
    type: 'multiple_choice',
    category: 'Inference',
    question: 'Given the following data, what is the most reasonable inference?',
    context: 'Customer satisfaction scores: Q1: 7.2, Q2: 7.8, Q3: 8.1, Q4: 7.9<br/>New product launches: Q1: 0, Q2: 1, Q3: 2, Q4: 1<br/>Customer service training completed: Q2<br/>Pricing increased by 5%: Q4',
    options: [
      {
        value: 'training_impact',
        text: 'Customer service training had the most significant positive impact',
        explanation: 'Correlates with sustained improvement starting in Q2'
      },
      {
        value: 'products_drove_satisfaction',
        text: 'New product launches drove satisfaction improvements',
        explanation: 'Peak satisfaction in Q3 coincides with highest product launches'
      },
      {
        value: 'pricing_caused_decline',
        text: 'Price increase caused the Q4 satisfaction decline',
        explanation: 'Timing aligns with the satisfaction drop'
      },
      {
        value: 'multiple_factors',
        text: 'Multiple factors contributed to satisfaction changes',
        explanation: 'Most reasonable given complex interactions between variables'
      }
    ]
  },
  {
    type: 'argument_analysis',
    category: 'Critical Evaluation',
    question: 'Identify the primary logical fallacy in this argument:',
    argument: 'Either we implement strict environmental regulations that will destroy the economy, or we allow companies to pollute freely and protect jobs. Since we can\'t afford to destroy the economy, we must allow unrestricted industrial activity.',
    options: [
      {
        value: 'false_dilemma',
        text: 'False Dilemma',
        rationale: 'Presents only two extreme options when middle ground exists'
      },
      {
        value: 'ad_hominem',
        text: 'Ad Hominem',
        rationale: 'Attacking the person rather than the argument'
      },
      {
        value: 'straw_man',
        text: 'Straw Man',
        rationale: 'Misrepresenting opponent\'s position'
      },
      {
        value: 'appeal_authority',
        text: 'Appeal to Authority',
        rationale: 'Relying on authority rather than evidence'
      }
    ]
  },
  {
    type: 'logic_problem',
    category: 'Conditional Reasoning',
    question: 'If the conditional statement is true, which conclusion follows logically?',
    logic_setup: '<strong>Given:</strong> "If a project is both urgent and important, then it should be assigned to the senior team."<br/><br/><strong>Additional Information:</strong><br/>• Project Alpha is urgent<br/>• Project Beta is important<br/>• Project Gamma is both urgent and important<br/>• Project Delta is neither urgent nor important',
    options: [
      { value: 'alpha_senior', text: 'Project Alpha should be assigned to the senior team' },
      { value: 'beta_senior', text: 'Project Beta should be assigned to the senior team' },
      { value: 'gamma_senior', text: 'Project Gamma should be assigned to the senior team' },
      { value: 'delta_not_senior', text: 'Project Delta should not be assigned to the senior team' }
    ]
  },
  {
    type: 'multiple_choice',
    category: 'Data Interpretation',
    question: 'Which interpretation of this research finding shows the best critical thinking?',
    scenario: 'A study of 500 remote workers found that those who exercised regularly (3+ times per week) reported 25% higher job satisfaction and 20% better work performance ratings.',
    options: [
      {
        value: 'causation_claim',
        text: 'Exercise directly causes better job performance and satisfaction',
        explanation: 'Claims causation without controlling for other variables'
      },
      {
        value: 'correlation_noted',
        text: 'There\'s a correlation, but causation requires further investigation',
        explanation: 'Appropriately cautious about causal claims from correlational data'
      },
      {
        value: 'reverse_causation',
        text: 'Higher job satisfaction leads people to exercise more',
        explanation: 'Considers alternative causal direction'
      },
      {
        value: 'dismiss_findings',
        text: 'The study is meaningless without a control group',
        explanation: 'Overly dismissive of valuable correlational findings'
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
  
  // Define correct answers for scoring
  const correctAnswers = {
    0: 'pattern_recognition',
    1: 'sarah_not_remote', // Sarah attends daily meetings, remote workers don't, so she can't be remote
    2: 'evidence_but_flawed',
    3: 'systematic_analysis',
    4: 'multiple_factors',
    5: 'false_dilemma',
    6: 'gamma_senior',
    7: 'correlation_noted'
  }
  
  // Calculate skill scores
  const skillScores = {
    'Analysis': 0,
    'Deductive Reasoning': 0,
    'Evaluation': 0,
    'Problem Solving': 0,
    'Inference': 0,
    'Critical Evaluation': 0
  }
  
  let totalCorrect = 0
  
  answerValues.forEach((answer, index) => {
    const isCorrect = answer === correctAnswers[index]
    if (isCorrect) totalCorrect++
    
    const question = questions.value[index]
    const skillArea = getSkillArea(question.category)
    skillScores[skillArea] += isCorrect ? 5 : Math.random() * 2 + 1 // Add some variation for wrong answers
  })
  
  // Normalize skill scores
  const skills = Object.keys(skillScores).map(skill => ({
    name: skill,
    score: Math.min(5, Math.round(skillScores[skill])),
    description: getSkillDescription(skill)
  }))
  
  const overallScore = Math.round((totalCorrect / questions.value.length) * 100)
  
  results.value = {
    overall_score: overallScore,
    thinking_level: getThinkingLevel(overallScore),
    skills: skills,
    thinking_style: getThinkingStyle(overallScore, skills),
    improvement_plan: getImprovementPlan(skills),
    bias_awareness: getBiasAwareness(overallScore)
  }
  
  // Save results to database
  saveResults()
}

const getSkillArea = (category) => {
  const mapping = {
    'Analysis': 'Analysis',
    'Deductive Reasoning': 'Deductive Reasoning', 
    'Evaluation': 'Evaluation',
    'Problem Solving': 'Problem Solving',
    'Inference': 'Inference',
    'Critical Evaluation': 'Critical Evaluation',
    'Conditional Reasoning': 'Deductive Reasoning',
    'Data Interpretation': 'Analysis'
  }
  return mapping[category] || 'Analysis'
}

const getSkillDescription = (skill) => {
  const descriptions = {
    'Analysis': 'Breaking down complex information into component parts to understand structure and relationships',
    'Deductive Reasoning': 'Drawing logical conclusions from given premises using formal logical rules',
    'Evaluation': 'Assessing the credibility, relevance, and strength of arguments and evidence',
    'Problem Solving': 'Systematically approaching challenges using logical and creative thinking methods',
    'Inference': 'Drawing reasonable conclusions from available evidence while acknowledging uncertainty',
    'Critical Evaluation': 'Identifying assumptions, biases, and logical fallacies in reasoning and arguments'
  }
  return descriptions[skill] || ''
}

const getThinkingLevel = (score) => {
  if (score >= 90) return 'Master Critical Thinker'
  if (score >= 80) return 'Advanced Analytical Thinker'
  if (score >= 70) return 'Proficient Critical Thinker'
  if (score >= 60) return 'Developing Critical Thinker'
  return 'Emerging Critical Thinker'
}

const getThinkingStyle = (overallScore, skills) => {
  const topSkills = skills.sort((a, b) => b.score - a.score).slice(0, 2)
  const topSkillNames = topSkills.map(s => s.name)
  
  if (topSkillNames.includes('Analysis') && topSkillNames.includes('Evaluation')) {
    return {
      name: 'Systematic Analyzer',
      description: 'You excel at breaking down complex problems and evaluating information systematically. You approach challenges methodically and value evidence-based reasoning.',
      strengths: ['Thorough analysis', 'Evidence-based thinking', 'Systematic approach', 'Detail-oriented evaluation'],
      development_areas: ['Speed of decision-making', 'Intuitive reasoning', 'Creative problem solving', 'Tolerating ambiguity']
    }
  } else if (topSkillNames.includes('Problem Solving') && topSkillNames.includes('Inference')) {
    return {
      name: 'Strategic Problem Solver',
      description: 'You combine logical reasoning with practical problem-solving skills. You can make reasonable inferences and develop effective solutions.',
      strengths: ['Practical thinking', 'Solution-focused', 'Good judgment', 'Strategic planning'],
      development_areas: ['Formal logic skills', 'Argument evaluation', 'Recognizing biases', 'Critical questioning']
    }
  } else if (topSkillNames.includes('Deductive Reasoning') && topSkillNames.includes('Critical Evaluation')) {
    return {
      name: 'Logical Reasoner',
      description: 'You have strong formal reasoning skills and are good at identifying flaws in arguments. You value logical consistency and clear thinking.',
      strengths: ['Logical consistency', 'Fallacy detection', 'Clear reasoning', 'Structural thinking'],
      development_areas: ['Practical application', 'Creative solutions', 'Contextual reasoning', 'Probabilistic thinking']
    }
  } else {
    return {
      name: 'Balanced Critical Thinker',
      description: 'You demonstrate well-rounded critical thinking skills across multiple areas. You can adapt your thinking style to different types of problems.',
      strengths: ['Versatile thinking', 'Adaptable approach', 'Broad skill set', 'Flexible reasoning'],
      development_areas: ['Specialized expertise', 'Advanced techniques', 'Speed and efficiency', 'Domain-specific skills']
    }
  }
}

const getImprovementPlan = (skills) => {
  const weakSkills = skills.filter(s => s.score <= 3).map(s => s.name)
  
  const recommendations = [
    {
      title: 'Enhance Analytical Skills',
      description: 'Practice breaking down complex problems into manageable components',
      activities: [
        'Use structured analysis frameworks (SWOT, root cause analysis)',
        'Practice data interpretation exercises',
        'Read case studies and analyze decision points'
      ],
      target_skills: ['Analysis', 'Problem Solving']
    },
    {
      title: 'Strengthen Logical Reasoning',
      description: 'Develop formal logic skills and deductive reasoning abilities',
      activities: [
        'Study formal logic principles and rules',
        'Practice syllogistic reasoning problems',
        'Learn to construct valid logical arguments'
      ],
      target_skills: ['Deductive Reasoning', 'Critical Evaluation']
    },
    {
      title: 'Improve Argument Evaluation',
      description: 'Learn to identify and assess the strength of arguments and evidence',
      activities: [
        'Study common logical fallacies and biases',
        'Practice evaluating news articles and opinion pieces',
        'Learn about evidence quality and source credibility'
      ],
      target_skills: ['Evaluation', 'Critical Evaluation']
    }
  ]
  
  // Add specific recommendations based on weak areas
  if (weakSkills.includes('Inference')) {
    recommendations.push({
      title: 'Develop Inferential Reasoning',
      description: 'Practice drawing reasonable conclusions from incomplete information',
      activities: [
        'Work with probabilistic reasoning problems',
        'Practice making predictions from data patterns',
        'Study statistical inference concepts'
      ],
      target_skills: ['Inference', 'Analysis']
    })
  }
  
  return recommendations.slice(0, 4)
}

const getBiasAwareness = (overallScore) => {
  return [
    {
      name: 'Confirmation Bias',
      description: 'Tendency to search for, interpret, and recall information that confirms pre-existing beliefs',
      mitigation: 'Actively seek disconfirming evidence and alternative explanations'
    },
    {
      name: 'Anchoring Bias',
      description: 'Over-relying on the first piece of information encountered when making decisions',
      mitigation: 'Consider multiple reference points and question initial assumptions'
    },
    {
      name: 'Availability Heuristic',
      description: 'Overestimating likelihood of events based on how easily examples come to mind',
      mitigation: 'Gather systematic data rather than relying on memorable examples'
    },
    {
      name: 'False Dilemma',
      description: 'Presenting only two options when more alternatives exist',
      mitigation: 'Always ask "What other options are possible?" before deciding'
    },
    {
      name: 'Correlation vs Causation',
      description: 'Assuming that correlation implies causation without proper evidence',
      mitigation: 'Look for controlled studies and consider alternative explanations'
    },
    {
      name: 'Survivorship Bias',
      description: 'Drawing conclusions from successful examples while ignoring failures',
      mitigation: 'Actively seek data on failures and unsuccessful cases'
    }
  ]
}

const getThinkingEmoji = (score) => {
  if (score >= 90) return '🎓'
  if (score >= 80) return '🧠'
  if (score >= 70) return '💭'
  if (score >= 60) return '🤔'
  return '💡'
}

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-gradient-to-r from-green-400 to-green-600'
  if (score >= 60) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  if (score >= 40) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  return 'bg-gradient-to-r from-red-400 to-red-600'
}

const getSkillColor = (score) => {
  if (score >= 4) return 'text-green-600'
  if (score >= 3) return 'text-blue-600'
  if (score >= 2) return 'text-yellow-600'
  return 'text-red-600'
}

const getSkillBarColor = (score) => {
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
          assessment_type: 'critical_thinking',
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
  title: 'Critical Thinking Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Evaluate your analytical and logical reasoning abilities including analysis, evaluation, inference, interpretation, and problem-solving skills. Essential for effective decision-making.' }
  ]
})
</script>