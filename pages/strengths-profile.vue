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
        <div class="text-6xl mb-4">💪</div>
        <div class="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-2">Skills & Strengths Assessment</div>
        <h1 :class="`text-4xl font-bold ${themeClasses.textPrimary} mb-4`">Strengths Profile Assessment</h1>
        <p :class="`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`">
          Identify your top natural talents and strengths using a methodology similar to StrengthsFinder. Discover your unique combination of abilities and learn how to leverage them for peak performance.
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
          <p :class="`text-sm ${themeClasses.textSecondary} mb-6`">
            Choose the statement that best describes you or feels most natural:
          </p>
        </div>

        <!-- Forced Choice Questions -->
        <div v-if="questions[currentQuestion - 1].type === 'forced_choice'" class="space-y-4 mb-8">
          <button
            v-for="option in questions[currentQuestion - 1].options"
            :key="option.value"
            @click="selectAnswer(option.value)"
            :class="`w-full text-left p-5 rounded-lg border-2 transition-all duration-200 ${
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
                <div :class="`font-medium ${themeClasses.textPrimary} mb-2`">{{ option.text }}</div>
                <div :class="`text-sm ${themeClasses.textSecondary}`">{{ option.description }}</div>
                <div class="flex items-center mt-2 space-x-2">
                  <span :class="`text-xs px-2 py-1 rounded-full ${getStrengthBadgeColor(option.strength)} font-medium`">
                    {{ option.strength }}
                  </span>
                  <span :class="`text-xs ${themeClasses.textSecondary}`">{{ option.domain }}</span>
                </div>
              </div>
            </div>
          </button>
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
            <div v-if="!answers[currentQuestion - 1]" :class="`text-sm ${themeClasses.textSecondary}`">
              Please select an option to continue
            </div>
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
      </div>

      <!-- Results Section -->
      <div v-if="showResults" class="space-y-8">
        <!-- Top 5 Strengths -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <div class="text-center mb-8">
            <div class="text-6xl mb-4">🏆</div>
            <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">Your Top 5 Strengths</h2>
            <p :class="`text-xl ${themeClasses.textSecondary}`">Your unique talent combination</p>
          </div>
          
          <div class="space-y-6">
            <div 
              v-for="(strength, index) in results.top_strengths" 
              :key="strength.name"
              :class="`${themeClasses.backgroundSecondary} rounded-lg p-6 border-l-4 ${getStrengthBorderColor(index)}`"
            >
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div :class="`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${getRankColor(index)}`">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 :class="`text-xl font-bold ${themeClasses.textPrimary}`">{{ strength.name }}</h3>
                    <div class="flex items-center space-x-2 mt-1">
                      <span :class="`text-sm px-2 py-1 rounded-full ${getDomainColor(strength.domain)} font-medium`">
                        {{ strength.domain }}
                      </span>
                      <span :class="`text-sm ${themeClasses.textSecondary}`">Score: {{ strength.score }}/100</span>
                    </div>
                  </div>
                </div>
              </div>
              <p :class="`${themeClasses.textSecondary} mb-4`">{{ strength.description }}</p>
              
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2 text-sm`">How to Use This Strength:</h4>
                  <ul :class="`text-sm ${themeClasses.textSecondary} space-y-1`">
                    <li v-for="application in strength.applications" :key="application" class="flex items-start space-x-2">
                      <span class="text-green-500 mt-0.5">•</span>
                      <span>{{ application }}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2 text-sm`">Potential Blind Spots:</h4>
                  <ul :class="`text-sm ${themeClasses.textSecondary} space-y-1`">
                    <li v-for="blindspot in strength.blind_spots" :key="blindspot" class="flex items-start space-x-2">
                      <span class="text-orange-500 mt-0.5">•</span>
                      <span>{{ blindspot }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Domain Analysis -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Strengths by Domain</h3>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div v-for="domain in results.domain_analysis" :key="domain.name" class="space-y-3">
              <div class="flex justify-between items-center">
                <span :class="`font-semibold ${themeClasses.textPrimary}`">{{ domain.name }}</span>
                <span :class="`text-sm font-bold ${getDomainScoreColor(domain.score)}`">
                  {{ domain.score }}/5
                </span>
              </div>
              <div :class="`w-full bg-gray-200 rounded-full h-3 ${themeClasses.borderColor} border`">
                <div 
                  :class="`h-3 rounded-full transition-all duration-1000 ${getDomainBarColor(domain.score)}`"
                  :style="`width: ${(domain.score / 5) * 100}%`"
                ></div>
              </div>
              <p :class="`text-sm ${themeClasses.textSecondary}`">{{ domain.description }}</p>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="strength in domain.strengths" 
                  :key="strength"
                  :class="`text-xs px-2 py-1 rounded ${getDomainColor(domain.name)}`"
                >
                  {{ strength }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Strengths Development Plan -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Development Action Plan</h3>
          
          <div class="space-y-6">
            <div v-for="(action, index) in results.development_plan" :key="index" :class="`${themeClasses.backgroundSecondary} rounded-lg p-5`">
              <div class="flex items-start space-x-4">
                <div class="bg-indigo-100 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">{{ action.title }}</h4>
                  <p :class="`${themeClasses.textSecondary} text-sm mb-3`">{{ action.description }}</p>
                  <div class="space-y-2">
                    <div v-for="step in action.steps" :key="step" class="flex items-start space-x-2">
                      <span class="text-indigo-500 mt-1">→</span>
                      <span :class="`text-sm ${themeClasses.textSecondary}`">{{ step }}</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-3">
                    <span v-for="tag in action.tags" :key="tag" class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Complementary Partnerships -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Ideal Team Partnerships</h3>
          <p :class="`text-center ${themeClasses.textSecondary} mb-6`">
            Look for partners who complement your strengths with these abilities:
          </p>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div v-for="complement in results.complementary_strengths" :key="complement.strength" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 text-center`">
              <div class="text-2xl mb-2">{{ complement.icon }}</div>
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-1`">{{ complement.strength }}</h4>
              <p :class="`text-sm ${themeClasses.textSecondary}`">{{ complement.reason }}</p>
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

// Comprehensive strengths database
const strengthsDatabase = {
  // Executing Domain
  'Achiever': { domain: 'Executing', description: 'A constant need for achievement and satisfaction from accomplishing tasks' },
  'Arranger': { domain: 'Executing', description: 'Ability to organize and enjoy managing complex, dynamic situations' },
  'Discipline': { domain: 'Executing', description: 'Enjoyment of routine and structure, creating systematic approaches' },
  'Focus': { domain: 'Executing', description: 'Ability to take direction and prioritize, following through on commitments' },
  'Responsibility': { domain: 'Executing', description: 'Taking psychological ownership and being utterly dependable' },
  'Restorative': { domain: 'Executing', description: 'Adept at identifying problems and resolving them' },
  
  // Influencing Domain  
  'Activator': { domain: 'Influencing', description: 'Impatience for action, catalyst for turning thoughts into action' },
  'Command': { domain: 'Influencing', description: 'Presence and ability to take charge and make decisions' },
  'Communication': { domain: 'Influencing', description: 'Enjoyment of explaining, hosting, speaking, and writing' },
  'Competition': { domain: 'Influencing', description: 'Measures progress against others and strives to win' },
  'Maximizer': { domain: 'Influencing', description: 'Focus on excellence and transforming good into great' },
  'Self-Assurance': { domain: 'Influencing', description: 'Confidence in ability to manage own life and take risks' },
  
  // Relationship Building Domain
  'Adaptability': { domain: 'Relationship Building', description: 'Ability to live in the moment and adjust to changing circumstances' },
  'Developer': { domain: 'Relationship Building', description: 'Recognizes and cultivates potential in others' },
  'Connectedness': { domain: 'Relationship Building', description: 'Faith in the links between all things and finding purpose' },
  'Empathy': { domain: 'Relationship Building', description: 'Ability to sense others\' feelings and see from their perspective' },
  'Harmony': { domain: 'Relationship Building', description: 'Seeks consensus and avoids conflict by finding common ground' },
  'Includer': { domain: 'Relationship Building', description: 'Shows awareness of those who feel left out and works to include them' },
  'Individualization': { domain: 'Relationship Building', description: 'Drawn to unique qualities of each person' },
  'Positivity': { domain: 'Relationship Building', description: 'Generous with praise and quick to smile, bringing energy to others' },
  'Relator': { domain: 'Relationship Building', description: 'Enjoys close relationships and working hard with friends' },
  
  // Strategic Thinking Domain
  'Analytical': { domain: 'Strategic Thinking', description: 'Searches for reasons and causes, thinking objectively' },
  'Context': { domain: 'Strategic Thinking', description: 'Enjoys thinking about the past to understand the present' },
  'Futuristic': { domain: 'Strategic Thinking', description: 'Inspired by the future and what could be' },
  'Ideation': { domain: 'Strategic Thinking', description: 'Fascinated by ideas and able to find connections' },
  'Input': { domain: 'Strategic Thinking', description: 'Craves information and likes to collect things' },
  'Intellection': { domain: 'Strategic Thinking', description: 'Enjoys intellectual activity and introspection' },
  'Learner': { domain: 'Strategic Thinking', description: 'Great desire to learn and continuously improve' },
  'Strategic': { domain: 'Strategic Thinking', description: 'Creates alternative ways to proceed and sees patterns' }
}

// Questions array with forced choice format
const questions = ref([
  {
    type: 'forced_choice',
    category: 'Work Approach',
    question: 'When starting a new project, which approach feels most natural to you?',
    options: [
      {
        value: 'Achiever',
        text: 'Set clear milestones and work steadily toward completion',
        description: 'I feel energized by checking items off my to-do list and seeing tangible progress',
        strength: 'Achiever',
        domain: 'Executing'
      },
      {
        value: 'Strategic',
        text: 'Step back and consider multiple approaches before deciding',
        description: 'I naturally see patterns and alternative paths to reach the goal',
        strength: 'Strategic',
        domain: 'Strategic Thinking'
      },
      {
        value: 'Activator',
        text: 'Jump in quickly and figure it out as I go',
        description: 'I believe action leads to learning, and waiting just creates delays',
        strength: 'Activator',
        domain: 'Influencing'
      },
      {
        value: 'Developer',
        text: 'Consider how this project could help team members grow',
        description: 'I see every project as an opportunity to develop people\'s talents',
        strength: 'Developer',
        domain: 'Relationship Building'
      }
    ]
  },
  {
    type: 'forced_choice',
    category: 'Problem Solving',
    question: 'When faced with a complex problem, your instinct is to:',
    options: [
      {
        value: 'Analytical',
        text: 'Break it down into logical components and analyze systematically',
        description: 'I need to understand the root causes and examine all the data',
        strength: 'Analytical',
        domain: 'Strategic Thinking'
      },
      {
        value: 'Ideation',
        text: 'Generate multiple creative solutions through brainstorming',
        description: 'I love connecting disparate ideas to find innovative approaches',
        strength: 'Ideation',
        domain: 'Strategic Thinking'
      },
      {
        value: 'Restorative',
        text: 'Identify what\'s broken and focus on fixing it efficiently',
        description: 'I\'m energized by diagnosing issues and restoring things to working order',
        strength: 'Restorative',
        domain: 'Executing'
      },
      {
        value: 'Harmony',
        text: 'Seek input from others to find a solution everyone can support',
        description: 'I believe the best solutions come from consensus and avoiding conflict',
        strength: 'Harmony',
        domain: 'Relationship Building'
      }
    ]
  },
  {
    type: 'forced_choice',
    category: 'Team Dynamics',
    question: 'In team meetings, you are most likely to:',
    options: [
      {
        value: 'Command',
        text: 'Take charge and guide the discussion toward decisions',
        description: 'I\'m comfortable stepping up when leadership is needed',
        strength: 'Command',
        domain: 'Influencing'
      },
      {
        value: 'Empathy',
        text: 'Listen carefully and help others feel heard and understood',
        description: 'I can sense what others are feeling and respond appropriately',
        strength: 'Empathy',
        domain: 'Relationship Building'
      },
      {
        value: 'Communication',
        text: 'Help explain complex ideas in ways everyone can understand',
        description: 'I enjoy finding the right words and analogies to clarify concepts',
        strength: 'Communication',
        domain: 'Influencing'
      },
      {
        value: 'Context',
        text: 'Share relevant background and historical perspective',
        description: 'I help others understand how we got here and what we can learn from the past',
        strength: 'Context',
        domain: 'Strategic Thinking'
      }
    ]
  },
  {
    type: 'forced_choice',
    category: 'Learning Style',
    question: 'When learning something new, you prefer to:',
    options: [
      {
        value: 'Learner',
        text: 'Dive deep and master the fundamentals thoroughly',
        description: 'I love the process of learning itself and becoming genuinely competent',
        strength: 'Learner',
        domain: 'Strategic Thinking'
      },
      {
        value: 'Input',
        text: 'Collect lots of information and resources from various sources',
        description: 'I\'m energized by gathering data, articles, and examples to build understanding',
        strength: 'Input',
        domain: 'Strategic Thinking'
      },
      {
        value: 'Adaptability',
        text: 'Jump in and learn through real experience and practice',
        description: 'I prefer learning by doing and adjusting as situations change',
        strength: 'Adaptability',
        domain: 'Relationship Building'
      },
      {
        value: 'Intellection',
        text: 'Think deeply about concepts and their implications',
        description: 'I need time to reflect and mentally process new information',
        strength: 'Intellection',
        domain: 'Strategic Thinking'
      }
    ]
  },
  {
    type: 'forced_choice',
    category: 'Motivation',
    question: 'What energizes you most about work?',
    options: [
      {
        value: 'Maximizer',
        text: 'Taking something good and making it excellent',
        description: 'I\'m motivated by the potential to transform quality into excellence',
        strength: 'Maximizer',
        domain: 'Influencing'
      },
      {
        value: 'Positivity',
        text: 'Creating an upbeat, encouraging environment for others',
        description: 'I love bringing enthusiasm and helping others see possibilities',
        strength: 'Positivity',
        domain: 'Relationship Building'
      },
      {
        value: 'Competition',
        text: 'Winning and being recognized for superior performance',
        description: 'I\'m driven by comparison with others and the desire to come out on top',
        strength: 'Competition',
        domain: 'Influencing'
      },
      {
        value: 'Connectedness',
        text: 'Contributing to something larger than myself',
        description: 'I find meaning in being part of a greater purpose or mission',
        strength: 'Connectedness',
        domain: 'Relationship Building'
      }
    ]
  },
  {
    type: 'forced_choice',
    category: 'Work Environment',
    question: 'You thrive in environments that are:',
    options: [
      {
        value: 'Discipline',
        text: 'Structured with clear processes and predictable routines',
        description: 'I work best when there are established systems and organized approaches',
        strength: 'Discipline',
        domain: 'Executing'
      },
      {
        value: 'Futuristic',
        text: 'Forward-looking with opportunities to envision possibilities',
        description: 'I\'m inspired by discussing what could be and planning for tomorrow',
        strength: 'Futuristic',
        domain: 'Strategic Thinking'
      },
      {
        value: 'Includer',
        text: 'Welcoming where everyone feels valued and included',
        description: 'I notice when people are left out and work to bring them into the group',
        strength: 'Includer',
        domain: 'Relationship Building'
      },
      {
        value: 'Self-Assurance',
        text: 'Autonomous where I can make independent decisions',
        description: 'I trust my judgment and prefer having the freedom to choose my path',
        strength: 'Self-Assurance',
        domain: 'Influencing'
      }
    ]
  },
  {
    type: 'forced_choice',
    category: 'Relationships',
    question: 'In your relationships with others, you naturally:',
    options: [
      {
        value: 'Relator',
        text: 'Prefer deeper connections with a smaller group of people',
        description: 'I value authentic, close relationships and working alongside friends',
        strength: 'Relator',
        domain: 'Relationship Building'
      },
      {
        value: 'Individualization',
        text: 'Notice and appreciate what makes each person unique',
        description: 'I\'m drawn to understanding individual differences and strengths',
        strength: 'Individualization',
        domain: 'Relationship Building'
      },
      {
        value: 'Arranger',
        text: 'Help coordinate and organize people for maximum effectiveness',
        description: 'I enjoy figuring out the best way to organize resources and people',
        strength: 'Arranger',
        domain: 'Executing'
      },
      {
        value: 'Focus',
        text: 'Help others stay on track and prioritize what\'s important',
        description: 'I naturally filter out distractions and maintain direction toward goals',
        strength: 'Focus',
        domain: 'Executing'
      }
    ]
  },
  {
    type: 'forced_choice',
    category: 'Decision Making',
    question: 'When making important decisions, you tend to:',
    options: [
      {
        value: 'Responsibility',
        text: 'Consider the impact on others and take ownership of outcomes',
        description: 'I feel accountable for my commitments and their consequences',
        strength: 'Responsibility',
        domain: 'Executing'
      },
      {
        value: 'Strategic',
        text: 'Consider multiple scenarios and their potential outcomes',
        description: 'I see patterns and can quickly evaluate different paths forward',
        strength: 'Strategic',
        domain: 'Strategic Thinking'
      },
      {
        value: 'Analytical',
        text: 'Gather data and analyze it objectively before choosing',
        description: 'I need logical proof and evidence to feel confident in decisions',
        strength: 'Analytical',
        domain: 'Strategic Thinking'
      },
      {
        value: 'Self-Assurance',
        text: 'Trust your instincts and move forward confidently',
        description: 'I have faith in my judgment and am comfortable taking risks',
        strength: 'Self-Assurance',
        domain: 'Influencing'
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
  // Count selections for each strength
  const strengthCounts = {}
  
  Object.values(answers.value).forEach(strength => {
    strengthCounts[strength] = (strengthCounts[strength] || 0) + 1
  })
  
  // Calculate scores (normalize to 100 scale)
  const totalQuestions = questions.value.length
  const strengthScores = {}
  
  Object.keys(strengthCounts).forEach(strength => {
    strengthScores[strength] = Math.round((strengthCounts[strength] / totalQuestions) * 100)
  })
  
  // Get top 5 strengths
  const sortedStrengths = Object.keys(strengthScores)
    .map(name => ({
      name,
      score: strengthScores[name],
      ...strengthsDatabase[name]
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(strength => ({
      ...strength,
      applications: getStrengthApplications(strength.name),
      blind_spots: getStrengthBlindSpots(strength.name)
    }))
  
  // Domain analysis
  const domainCounts = { 'Executing': 0, 'Influencing': 0, 'Relationship Building': 0, 'Strategic Thinking': 0 }
  sortedStrengths.forEach(strength => {
    domainCounts[strength.domain]++
  })
  
  const domainAnalysis = Object.keys(domainCounts).map(domain => ({
    name: domain,
    score: domainCounts[domain],
    description: getDomainDescription(domain),
    strengths: sortedStrengths.filter(s => s.domain === domain).map(s => s.name)
  }))
  
  results.value = {
    top_strengths: sortedStrengths,
    domain_analysis: domainAnalysis,
    development_plan: getDevelopmentPlan(sortedStrengths),
    complementary_strengths: getComplementaryStrengths(sortedStrengths)
  }
  
  // Save results to database
  saveResults()
}

const getDomainDescription = (domain) => {
  const descriptions = {
    'Executing': 'Getting things done with reliability, focus, and systematic approaches',
    'Influencing': 'Taking charge, speaking up, and making sure others are heard',
    'Relationship Building': 'Building strong relationships and bringing teams together',
    'Strategic Thinking': 'Analyzing information, thinking strategically, and planning for the future'
  }
  return descriptions[domain]
}

const getStrengthApplications = (strength) => {
  const applications = {
    'Achiever': ['Set ambitious but achievable goals', 'Take on challenging projects', 'Celebrate completion milestones'],
    'Strategic': ['Lead strategic planning initiatives', 'Analyze complex problems', 'Develop multiple backup plans'],
    'Activator': ['Champion new initiatives', 'Turn ideas into action quickly', 'Energize stalled projects'],
    'Developer': ['Mentor junior team members', 'Design growth opportunities', 'Provide constructive feedback'],
    'Analytical': ['Lead data-driven decision making', 'Conduct thorough research', 'Validate assumptions with evidence'],
    'Communication': ['Present to large audiences', 'Write compelling content', 'Facilitate discussions'],
    'Empathy': ['Mediate conflicts', 'Understand customer needs', 'Build rapport quickly'],
    'Learner': ['Stay current with industry trends', 'Master new technologies', 'Teach others new skills']
  }
  return applications[strength] || ['Apply this strength in leadership roles', 'Use in collaborative projects', 'Leverage in problem-solving situations']
}

const getStrengthBlindSpots = (strength) => {
  const blindSpots = {
    'Achiever': ['May push too hard on deadlines', 'Can be impatient with slower progress', 'Might neglect work-life balance'],
    'Strategic': ['May over-analyze simple decisions', 'Could seem indecisive to others', 'Might miss obvious solutions'],
    'Activator': ['May move too quickly without planning', 'Could make decisions without full information', 'Might impatient with deliberation'],
    'Developer': ['May invest too much in low performers', 'Could neglect own development', 'Might be too patient with poor performance'],
    'Analytical': ['May get stuck in analysis paralysis', 'Could slow decision-making', 'Might dismiss intuitive insights'],
    'Communication': ['May dominate conversations', 'Could over-explain simple concepts', 'Might assume others understand'],
    'Empathy': ['May take on others\' emotions too much', 'Could avoid necessary difficult conversations', 'Might prioritize feelings over facts'],
    'Learner': ['May get distracted by new learning', 'Could delay action for more study', 'Might undervalue existing knowledge']
  }
  return blindSpots[strength] || ['Monitor for overuse of this strength', 'Balance with other perspectives', 'Seek feedback on application']
}

const getDevelopmentPlan = (strengths) => {
  const topDomain = strengths[0].domain
  const plans = [
    {
      title: `Maximize Your ${strengths[0].name} Strength`,
      description: `Focus on situations where your strongest talent can have the most impact`,
      steps: [
        `Seek roles that require ${strengths[0].name.toLowerCase()} capabilities`,
        'Practice applying this strength in new contexts',
        'Share your expertise with others who could benefit'
      ],
      tags: ['Primary Strength', 'Talent Focus']
    },
    {
      title: 'Build Complementary Partnerships',
      description: 'Partner with people whose strengths complement yours',
      steps: [
        'Identify team members with complementary strengths',
        'Delegate tasks that align with others\' strengths',
        'Create partnerships for complex projects'
      ],
      tags: ['Collaboration', 'Team Building']
    },
    {
      title: 'Develop Domain Balance',
      description: `Your strength in ${topDomain} is clear - consider developing other domains`,
      steps: [
        'Identify one strength from each domain to develop',
        'Practice skills outside your comfort zone',
        'Seek feedback on less dominant areas'
      ],
      tags: ['Growth', 'Balance']
    }
  ]
  
  return plans
}

const getComplementaryStrengths = (strengths) => {
  const userDomains = [...new Set(strengths.map(s => s.domain))]
  const allDomains = ['Executing', 'Influencing', 'Relationship Building', 'Strategic Thinking']
  const missingDomains = allDomains.filter(d => !userDomains.includes(d))
  
  const complements = [
    { strength: 'Detail-Oriented', icon: '🔍', reason: 'Balances big-picture thinking with attention to specifics' },
    { strength: 'Process-Focused', icon: '⚙️', reason: 'Provides systematic approaches to complement innovation' },
    { strength: 'People-Centered', icon: '🤝', reason: 'Brings interpersonal skills to task-focused environments' },
    { strength: 'Analytical Thinker', icon: '📊', reason: 'Adds data-driven decision making to intuitive approaches' },
    { strength: 'Creative Ideator', icon: '💡', reason: 'Generates novel solutions to complement execution skills' },
    { strength: 'Change Agent', icon: '🔄', reason: 'Drives transformation to balance stability preferences' }
  ]
  
  return complements.slice(0, 6)
}

// Styling helper functions
const getStrengthBadgeColor = (strength) => {
  const domain = strengthsDatabase[strength]?.domain
  return getDomainColor(domain)
}

const getDomainColor = (domain) => {
  const colors = {
    'Executing': 'bg-green-100 text-green-800',
    'Influencing': 'bg-red-100 text-red-800',
    'Relationship Building': 'bg-blue-100 text-blue-800',
    'Strategic Thinking': 'bg-purple-100 text-purple-800'
  }
  return colors[domain] || 'bg-gray-100 text-gray-800'
}

const getStrengthBorderColor = (index) => {
  const colors = ['border-yellow-400', 'border-gray-400', 'border-orange-400', 'border-blue-400', 'border-green-400']
  return colors[index] || 'border-gray-300'
}

const getRankColor = (index) => {
  const colors = ['bg-yellow-500', 'bg-gray-500', 'bg-orange-500', 'bg-blue-500', 'bg-green-500']
  return colors[index] || 'bg-gray-400'
}

const getDomainScoreColor = (score) => {
  if (score >= 3) return 'text-green-600'
  if (score >= 2) return 'text-blue-600'
  if (score >= 1) return 'text-orange-600'
  return 'text-gray-600'
}

const getDomainBarColor = (score) => {
  if (score >= 3) return 'bg-gradient-to-r from-green-400 to-green-600'
  if (score >= 2) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  if (score >= 1) return 'bg-gradient-to-r from-orange-400 to-orange-600'
  return 'bg-gradient-to-r from-gray-400 to-gray-600'
}

const saveResults = async () => {
  if (!user.value) return
  
  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: user.value.id,
          test_type_id: 'strengths_finder',
          responses: answers.value,
          evaluation: results.value,
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
  title: 'Strengths Profile Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Identify your top natural talents and strengths using a methodology similar to StrengthsFinder. Discover your unique combination of abilities and learn how to leverage them for peak performance.' }
  ]
})
</script>