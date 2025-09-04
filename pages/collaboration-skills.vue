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
              Collaboration Excellence Assessment
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
          <div class="text-6xl mb-4">🤝</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">
            Assessment Complete!
          </h2>
          <div :class="`text-lg ${themeClasses.textSecondary}`">
            Your collaboration profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Overall Collaboration Score -->
          <div :class="`${themeClasses.featureBackground} rounded-xl p-6 text-center`">
            <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">Your Collaboration Excellence</h3>
            <div :class="`text-5xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.overallScore }}%</div>
            <p :class="`${themeClasses.textSecondary} text-lg mb-4`">{{ results.collaborationLevel.description }}</p>
            
            <!-- Overall Progress Bar -->
            <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-6 mb-4`">
              <div 
                :class="`${getProgressBarColor(results.overallScore)} h-6 rounded-full transition-all duration-1000 flex items-center justify-center`"
                :style="{ width: `${results.overallScore}%` }"
              >
                <span class="text-white text-sm font-bold">{{ results.collaborationLevel.name }}</span>
              </div>
            </div>
          </div>

          <!-- Collaboration Dimensions -->
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

          <!-- Collaboration Style -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderAccent}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Collaboration Style</h3>
            <div :class="`bg-gradient-to-r ${themeClasses.gradientBackground} p-4 rounded-lg mb-4`">
              <div :class="`text-2xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.collaborationStyle.name }}</div>
              <p :class="`${themeClasses.textSecondary} leading-relaxed mb-4`">{{ results.collaborationStyle.description }}</p>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Key Characteristics:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                  <li v-for="characteristic in results.collaborationStyle.characteristics" :key="characteristic">{{ characteristic }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Team Effectiveness Assessment -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-blue-200`">
            <h3 :class="`text-xl font-bold text-blue-800 mb-4`">Your Team Effectiveness Impact</h3>
            <div class="grid md:grid-cols-3 gap-4 mb-4">
              <div class="text-center">
                <div :class="`text-3xl font-bold ${getScoreColor(results.teamEffectiveness.trust)}`">{{ results.teamEffectiveness.trust }}%</div>
                <div :class="`text-sm ${themeClasses.textSecondary}`">Trust Building</div>
              </div>
              <div class="text-center">
                <div :class="`text-3xl font-bold ${getScoreColor(results.teamEffectiveness.productivity)}`">{{ results.teamEffectiveness.productivity }}%</div>
                <div :class="`text-sm ${themeClasses.textSecondary}`">Team Productivity</div>
              </div>
              <div class="text-center">
                <div :class="`text-3xl font-bold ${getScoreColor(results.teamEffectiveness.innovation)}`">{{ results.teamEffectiveness.innovation }}%</div>
                <div :class="`text-sm ${themeClasses.textSecondary}`">Team Innovation</div>
              </div>
            </div>
            <p :class="`${themeClasses.textSecondary} text-sm`">{{ results.teamEffectiveness.summary }}</p>
          </div>

          <!-- Strengths & Development Areas -->
          <div class="grid md:grid-cols-2 gap-6">
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-green-200`">
              <h3 :class="`text-xl font-bold text-green-800 mb-4`">Collaboration Strengths</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="strength in results.strengths" :key="strength" class="flex items-start">
                  <span class="text-green-500 mr-2">🌟</span>
                  {{ strength }}
                </li>
              </ul>
            </div>
            
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-orange-200`">
              <h3 :class="`text-xl font-bold text-orange-800 mb-4`">Growth Opportunities</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="opportunity in results.developmentAreas" :key="opportunity" class="flex items-start">
                  <span class="text-orange-500 mr-2">📈</span>
                  {{ opportunity }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Collaboration Enhancement Plan -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Collaboration Enhancement Plan</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Immediate Actions (Next Week):</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="action in results.enhancementPlan.immediate" :key="action">{{ action }}</li>
                </ul>
              </div>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Long-term Development:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="plan in results.enhancementPlan.longTerm" :key="plan">{{ plan }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Overall Summary -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Collaboration Excellence Summary</h3>
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
          <p :class="themeClasses.textSecondary">Analyzing your collaboration skills...</p>
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
          <div v-if="questions[currentQuestion]?.type === 'behavioral'" class="space-y-3">
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
                <span>{{ questions[currentQuestion]?.scale?.low || 'Never' }}</span>
                <span>{{ questions[currentQuestion]?.scale?.high || 'Always' }}</span>
              </div>
            </div>
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

// Behavioral assessment questions for Collaboration Excellence
const questions = ref([
  // Team Communication
  {
    title: "Communication Style",
    question: "How often do you actively listen to understand others' perspectives, even when you disagree?",
    type: "scale",
    category: "communication",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Information Sharing",
    question: "When working on team projects, how do you typically approach sharing important information?",
    type: "behavioral",
    category: "communication",
    options: [
      { text: "Share all relevant information proactively with the team", value: "proactive_sharing", description: "Ensures everyone has access to information they need" },
      { text: "Share information when directly asked or when it becomes relevant", value: "responsive_sharing", description: "Provides information on a need-to-know basis" },
      { text: "Keep information until meetings or formal updates", value: "structured_sharing", description: "Uses formal channels for information distribution" },
      { text: "Share with key people who can help distribute to others", value: "hub_sharing", description: "Relies on key connectors to spread information" }
    ]
  },

  // Cooperation & Support
  {
    title: "Team Support",
    question: "How often do you offer help to teammates who are struggling, even when it's not your direct responsibility?",
    type: "scale",
    category: "cooperation",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Workload Balance",
    question: "When you finish your tasks early and notice teammates are overwhelmed, what do you typically do?",
    type: "behavioral",
    category: "cooperation",
    options: [
      { text: "Immediately offer to help with their work", value: "immediate_help", description: "Proactively supports team members in need" },
      { text: "Ask if there's anything you can do to help", value: "offer_help", description: "Makes assistance available while respecting boundaries" },
      { text: "Use the extra time to get ahead on your next tasks", value: "personal_advancement", description: "Focuses on personal productivity and future preparation" },
      { text: "Take a break and enjoy the downtime you've earned", value: "personal_time", description: "Values personal rest and work-life balance" }
    ]
  },

  // Consensus Building
  {
    title: "Decision Making",
    question: "How often do you work to ensure all team members' voices are heard before making group decisions?",
    type: "scale",
    category: "consensus_building",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Conflict Resolution",
    question: "When team members have conflicting opinions about an important decision, what's your typical approach?",
    type: "behavioral",
    category: "consensus_building",
    options: [
      { text: "Facilitate discussion to find common ground and compromise", value: "mediation", description: "Helps find solutions that work for everyone" },
      { text: "Encourage each person to fully explain their reasoning", value: "understanding_first", description: "Ensures all perspectives are fully understood" },
      { text: "Suggest voting or using data to make an objective decision", value: "objective_resolution", description: "Uses systematic approaches to resolve disagreements" },
      { text: "Let the team lead or subject matter expert make the final call", value: "defer_to_expertise", description: "Relies on authority or expertise to break deadlocks" }
    ]
  },

  // Trust Building
  {
    title: "Reliability",
    question: "How often do you follow through on commitments you make to your team, even when it becomes inconvenient?",
    type: "scale",
    category: "trust_building",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Transparency",
    question: "When you make a mistake that affects the team, what do you typically do?",
    type: "behavioral",
    category: "trust_building",
    options: [
      { text: "Immediately inform the team and take full responsibility", value: "immediate_transparency", description: "Builds trust through openness and accountability" },
      { text: "Fix the mistake if possible, then inform the team", value: "solution_first", description: "Focuses on solving problems before communicating them" },
      { text: "Discuss with your supervisor before informing the broader team", value: "hierarchical_approach", description: "Uses formal channels for error communication" },
      { text: "Only mention it if it directly impacts others' work", value: "impact_based", description: "Discloses mistakes based on their practical effects" }
    ]
  },

  // Inclusivity & Diversity
  {
    title: "Inclusion",
    question: "How often do you make an effort to include quieter or less assertive team members in discussions?",
    type: "scale",
    category: "inclusivity",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Diverse Perspectives",
    question: "When brainstorming solutions, how do you typically approach gathering different viewpoints?",
    type: "behavioral",
    category: "inclusivity",
    options: [
      { text: "Actively seek out diverse perspectives, especially from underrepresented voices", value: "diverse_seeking", description: "Intentionally includes varied viewpoints and backgrounds" },
      { text: "Create structured opportunities for everyone to contribute ideas", value: "structured_inclusion", description: "Uses processes that encourage broad participation" },
      { text: "Encourage open discussion and let ideas emerge naturally", value: "organic_discussion", description: "Allows natural dynamics to generate diverse input" },
      { text: "Focus on the most experienced or knowledgeable team members' input", value: "expertise_focus", description: "Prioritizes input from those with relevant experience" }
    ]
  },

  // Flexibility & Adaptability
  {
    title: "Adaptation",
    question: "How often do you adjust your working style to better collaborate with different types of teammates?",
    type: "scale",
    category: "flexibility",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Change Response",
    question: "When the team decides to change direction on a project you've been heavily involved in, how do you typically respond?",
    type: "behavioral",
    category: "flexibility",
    options: [
      { text: "Embrace the change and help others adapt to the new direction", value: "change_leadership", description: "Models positive response to change and helps team adaptation" },
      { text: "Express any concerns but then fully support the team decision", value: "loyal_adaptation", description: "Balances honest input with team loyalty" },
      { text: "Focus on how your existing work can fit into the new direction", value: "work_integration", description: "Seeks to preserve value while adapting to change" },
      { text: "Need time to process the change before fully engaging", value: "processing_time", description: "Requires adjustment period to mentally shift directions" }
    ]
  },

  // Emotional Intelligence
  {
    title: "Emotional Awareness",
    question: "How often do you pick up on and respond appropriately to teammates' emotional states or stress levels?",
    type: "scale",
    category: "emotional_intelligence",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Team Morale",
    question: "When team morale seems low, what's your typical response?",
    type: "behavioral",
    category: "emotional_intelligence",
    options: [
      { text: "Take initiative to organize team-building activities or discussions", value: "morale_building", description: "Actively works to improve team atmosphere" },
      { text: "Have one-on-one conversations to understand individual concerns", value: "individual_support", description: "Addresses morale issues through personal connections" },
      { text: "Maintain your own positive attitude to set a good example", value: "positive_modeling", description: "Uses personal energy to influence team mood" },
      { text: "Focus on work quality and let others handle team dynamics", value: "work_focus", description: "Maintains professional focus while others address morale" }
    ]
  },

  // Virtual Collaboration
  {
    title: "Remote Collaboration",
    question: "How often do you make extra effort to connect personally with remote or virtual team members?",
    type: "scale",
    category: "virtual_collaboration",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Digital Communication",
    question: "In virtual meetings, how do you typically ensure effective collaboration?",
    type: "behavioral",
    category: "virtual_collaboration",
    options: [
      { text: "Actively facilitate participation and use collaborative tools", value: "virtual_facilitation", description: "Uses technology and techniques to enhance virtual collaboration" },
      { text: "Encourage video use and create space for informal conversation", value: "personal_connection", description: "Focuses on maintaining human connection in virtual settings" },
      { text: "Keep meetings structured and focused on agenda items", value: "efficient_structure", description: "Maximizes virtual meeting effectiveness through organization" },
      { text: "Follow up with individual conversations after group meetings", value: "follow_up_connection", description: "Supplements group interactions with personal check-ins" }
    ]
  },

  // Knowledge Sharing
  {
    title: "Learning Exchange",
    question: "How often do you share your expertise or teach skills to help teammates develop?",
    type: "scale",
    category: "knowledge_sharing",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Feedback Culture",
    question: "How do you typically approach giving constructive feedback to teammates?",
    type: "behavioral",
    category: "knowledge_sharing",
    options: [
      { text: "Offer specific, actionable feedback focused on helping them improve", value: "developmental_feedback", description: "Provides feedback aimed at growth and improvement" },
      { text: "Share feedback privately and tactfully to avoid embarrassment", value: "private_feedback", description: "Protects dignity while providing helpful input" },
      { text: "Only give feedback when directly asked or in formal reviews", value: "requested_feedback", description: "Respects boundaries around unsolicited advice" },
      { text: "Focus on positive reinforcement rather than corrective feedback", value: "positive_focus", description: "Emphasizes strengths and encouragement over criticism" }
    ]
  },

  // Cross-Cultural Collaboration
  {
    title: "Cultural Sensitivity",
    question: "How often do you adapt your communication style when working with people from different cultural backgrounds?",
    type: "scale",
    category: "cultural_collaboration",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Global Teamwork",
    question: "When working with international teammates across time zones, how do you ensure effective collaboration?",
    type: "behavioral",
    category: "cultural_collaboration",
    options: [
      { text: "Rotate meeting times to share the inconvenience fairly", value: "equitable_scheduling", description: "Ensures fair burden-sharing across time zones" },
      { text: "Use asynchronous tools and clear documentation for handoffs", value: "async_systems", description: "Creates systems that work across different schedules" },
      { text: "Be flexible with your schedule to accommodate others when possible", value: "personal_flexibility", description: "Adapts personal schedule to support team needs" },
      { text: "Focus on overlap hours and make the most of synchronous time", value: "overlap_optimization", description: "Maximizes effectiveness during shared working hours" }
    ]
  },

  // Innovation & Creativity
  {
    title: "Creative Collaboration",
    question: "How often do you build on others' ideas to create even better solutions?",
    type: "scale",
    category: "innovation",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Idea Development",
    question: "When someone shares an idea you think could be improved, what's your typical approach?",
    type: "behavioral",
    category: "innovation",
    options: [
      { text: "Use 'Yes, and...' thinking to build upon their idea", value: "additive_thinking", description: "Builds on ideas rather than replacing them" },
      { text: "Ask questions to help them develop the idea further", value: "socratic_development", description: "Helps others strengthen their own ideas" },
      { text: "Share your perspective on how to make it even better", value: "collaborative_improvement", description: "Contributes directly to idea enhancement" },
      { text: "Appreciate their idea while also sharing alternative approaches", value: "alternative_exploration", description: "Values their contribution while offering different paths" }
    ]
  },

  // Team Leadership
  {
    title: "Shared Leadership",
    question: "How often do you step up to lead when the team needs direction, even if you're not the official leader?",
    type: "scale",
    category: "shared_leadership",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Team Advocacy",
    question: "When your team faces external pressure or criticism, how do you typically respond?",
    type: "behavioral",
    category: "shared_leadership",
    options: [
      { text: "Stand up for the team and advocate for their perspective", value: "team_advocacy", description: "Actively defends and supports team interests" },
      { text: "Help the team understand the external perspective and adapt", value: "bridge_building", description: "Facilitates understanding between team and external parties" },
      { text: "Focus on improving team performance to address concerns", value: "performance_focus", description: "Channels external feedback into internal improvement" },
      { text: "Support team members individually while they handle the situation", value: "individual_support", description: "Provides personal support while others handle external issues" }
    ]
  },

  // Celebration & Recognition
  {
    title: "Team Recognition",
    question: "How often do you celebrate or acknowledge teammates' achievements and contributions?",
    type: "scale",
    category: "recognition",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Success Sharing",
    question: "When your team achieves a major success, how do you typically handle recognition?",
    type: "behavioral",
    category: "recognition",
    options: [
      { text: "Actively highlight each person's specific contributions", value: "individual_recognition", description: "Ensures everyone gets credit for their unique contributions" },
      { text: "Emphasize the team's collective achievement", value: "team_recognition", description: "Celebrates shared success and team unity" },
      { text: "Make sure credit goes to those who did the most work", value: "merit_based", description: "Ensures recognition aligns with actual contribution levels" },
      { text: "Celebrate publicly and personally with team members", value: "comprehensive_celebration", description: "Uses multiple ways to acknowledge and celebrate success" }
    ]
  },

  // Conflict Resolution
  {
    title: "Difficult Conversations",
    question: "How often do you address team conflicts or tensions directly rather than avoiding them?",
    type: "scale",
    category: "conflict_resolution",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Mediation Approach",
    question: "When two teammates are in conflict, what's your typical role?",
    type: "behavioral",
    category: "conflict_resolution",
    options: [
      { text: "Actively mediate to help them find common ground", value: "active_mediation", description: "Takes direct role in helping resolve conflicts" },
      { text: "Listen to both sides and offer perspective when appropriate", value: "supportive_listening", description: "Provides neutral support and occasional guidance" },
      { text: "Encourage them to resolve it directly while offering support", value: "empowering_resolution", description: "Supports their ability to solve problems themselves" },
      { text: "Stay neutral and let them work it out themselves", value: "non_intervention", description: "Maintains neutrality and avoids getting involved" }
    ]
  },

  // Continuous Improvement
  {
    title: "Team Development",
    question: "How often do you suggest ways the team could work together more effectively?",
    type: "scale",
    category: "continuous_improvement",
    scale: { low: "Never", high: "Always" }
  },

  {
    title: "Learning Culture",
    question: "How do you contribute to creating a learning environment within your team?",
    type: "behavioral",
    category: "continuous_improvement",
    options: [
      { text: "Share lessons learned from mistakes and encourage others to do the same", value: "learning_culture", description: "Creates psychological safety for learning from failures" },
      { text: "Regularly suggest process improvements based on team experiences", value: "process_improvement", description: "Continuously refines how the team works together" },
      { text: "Bring in external ideas and best practices from other teams", value: "external_learning", description: "Imports knowledge and practices from outside the team" },
      { text: "Focus on personal development while supporting others' growth", value: "mutual_development", description: "Balances personal growth with helping others develop" }
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
    'communication': 'Communication Excellence',
    'cooperation': 'Cooperation & Support',
    'consensus_building': 'Consensus Building',
    'trust_building': 'Trust & Reliability',
    'inclusivity': 'Inclusivity & Diversity',
    'flexibility': 'Flexibility & Adaptability',
    'emotional_intelligence': 'Emotional Intelligence',
    'virtual_collaboration': 'Virtual Collaboration'
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
    title: currentQ.title,
    question_text: currentQ.question,
    category: currentQ.category,
    type: currentQ.type,
    answer: answer,
    selected_option: currentQ.type === 'behavioral' ? currentQ.options.find(opt => opt.value === answer) : null
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
  // Calculate collaboration dimensions
  const dimensions = {
    communication: { score: 0, count: 0 },
    cooperation: { score: 0, count: 0 },
    consensus_building: { score: 0, count: 0 },
    trust_building: { score: 0, count: 0 },
    inclusivity: { score: 0, count: 0 },
    flexibility: { score: 0, count: 0 },
    emotional_intelligence: { score: 0, count: 0 },
    virtual_collaboration: { score: 0, count: 0 }
  }

  let totalScore = 0
  let scoreCount = 0

  // Analyze each response and score based on collaboration effectiveness
  responses.value.forEach(response => {
    const { category, answer, type } = response
    let score = 0

    if (type === 'scale') {
      score = parseInt(answer)
    } else if (type === 'behavioral') {
      // Score behavioral responses based on collaboration best practices
      switch(category) {
        case 'communication':
          if (answer === 'proactive_sharing') score = 5
          else if (answer === 'responsive_sharing') score = 4
          else score = 3
          break
        case 'cooperation':
          if (answer === 'immediate_help') score = 5
          else if (answer === 'offer_help') score = 4
          else score = 2
          break
        case 'consensus_building':
          if (answer === 'mediation' || answer === 'understanding_first') score = 5
          else if (answer === 'objective_resolution') score = 4
          else score = 3
          break
        case 'trust_building':
          if (answer === 'immediate_transparency') score = 5
          else if (answer === 'solution_first') score = 4
          else score = 3
          break
        case 'inclusivity':
          if (answer === 'diverse_seeking' || answer === 'structured_inclusion') score = 5
          else if (answer === 'organic_discussion') score = 3
          else score = 2
          break
        case 'flexibility':
          if (answer === 'change_leadership') score = 5
          else if (answer === 'loyal_adaptation') score = 4
          else score = 3
          break
        case 'emotional_intelligence':
          if (answer === 'morale_building' || answer === 'individual_support') score = 5
          else if (answer === 'positive_modeling') score = 4
          else score = 2
          break
        case 'virtual_collaboration':
          if (answer === 'virtual_facilitation') score = 5
          else if (answer === 'personal_connection' || answer === 'follow_up_connection') score = 4
          else score = 3
          break
        case 'knowledge_sharing':
          if (answer === 'developmental_feedback') score = 5
          else if (answer === 'private_feedback') score = 4
          else score = 3
          // Map to communication dimension
          dimensions.communication.score += score
          dimensions.communication.count += 1
          break
        case 'cultural_collaboration':
          if (answer === 'equitable_scheduling' || answer === 'async_systems') score = 5
          else if (answer === 'personal_flexibility') score = 4
          else score = 3
          dimensions.virtual_collaboration.score += score
          dimensions.virtual_collaboration.count += 1
          break
        case 'innovation':
          if (answer === 'additive_thinking' || answer === 'socratic_development') score = 5
          else if (answer === 'collaborative_improvement') score = 4
          else score = 3
          dimensions.cooperation.score += score
          dimensions.cooperation.count += 1
          break
        case 'shared_leadership':
          if (answer === 'team_advocacy' || answer === 'bridge_building') score = 5
          else if (answer === 'performance_focus') score = 4
          else score = 3
          dimensions.consensus_building.score += score
          dimensions.consensus_building.count += 1
          break
        case 'recognition':
          if (answer === 'individual_recognition' || answer === 'comprehensive_celebration') score = 5
          else if (answer === 'team_recognition') score = 4
          else score = 3
          dimensions.emotional_intelligence.score += score
          dimensions.emotional_intelligence.count += 1
          break
        case 'conflict_resolution':
          if (answer === 'active_mediation') score = 5
          else if (answer === 'supportive_listening') score = 4
          else if (answer === 'empowering_resolution') score = 3
          else score = 2
          dimensions.consensus_building.score += score
          dimensions.consensus_building.count += 1
          break
        case 'continuous_improvement':
          if (answer === 'learning_culture' || answer === 'process_improvement') score = 5
          else if (answer === 'external_learning') score = 4
          else score = 3
          dimensions.flexibility.score += score
          dimensions.flexibility.count += 1
          break
        default:
          score = 3 // Default neutral score
      }
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
  
  // Determine collaboration level
  const collaborationLevel = getCollaborationLevel(overallScore)
  
  // Determine collaboration style
  const collaborationStyle = determineCollaborationStyle(dimensions, responses.value)
  
  // Calculate team effectiveness impact
  const teamEffectiveness = calculateTeamEffectiveness(dimensions)
  
  // Generate strengths and development areas
  const strengths = getStrengths(dimensions)
  const developmentAreas = getDevelopmentAreas(dimensions)
  
  // Generate enhancement plan
  const enhancementPlan = generateEnhancementPlan(dimensions, responses.value)
  
  // Generate summary
  const summary = generateSummary(collaborationLevel, overallScore, dimensions, collaborationStyle)

  results.value = {
    overallScore,
    collaborationLevel,
    collaborationStyle,
    dimensions,
    teamEffectiveness,
    strengths,
    developmentAreas,
    enhancementPlan,
    summary,
    completedAt: new Date().toISOString()
  }
}

const getLevel = (score) => {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Strong'
  if (score >= 50) return 'Good'
  if (score >= 35) return 'Developing'
  return 'Basic'
}

const getDimensionDescription = (dimension) => {
  const descriptions = {
    'communication': 'Ability to share information clearly and listen actively to team members',
    'cooperation': 'Willingness to support teammates and work together toward shared goals',
    'consensus_building': 'Skills in facilitating agreement and building collective decisions',
    'trust_building': 'Behaviors that create reliability, transparency, and psychological safety',
    'inclusivity': 'Commitment to ensuring all team members feel valued and included',
    'flexibility': 'Adaptability in working styles and response to changing team needs',
    'emotional_intelligence': 'Awareness of team dynamics and ability to support others emotionally',
    'virtual_collaboration': 'Effectiveness in remote and digital collaboration environments'
  }
  return descriptions[dimension] || 'Collaboration dimension'
}

const getDimensionInterpretation = (dimension, score) => {
  const interpretations = {
    'communication': {
      high: 'You excel at clear communication and active listening in teams',
      low: 'Focus on improving your team communication and listening skills'
    },
    'cooperation': {
      high: 'You consistently support teammates and contribute to collective success',
      low: 'Work on being more supportive and collaborative with team members'
    },
    'consensus_building': {
      high: 'You effectively help teams reach agreement and build collective decisions',
      low: 'Develop skills in facilitating group decisions and building consensus'
    },
    'trust_building': {
      high: 'You create trust through reliability and transparency with teammates',
      low: 'Focus on building trust through consistent and transparent behavior'
    },
    'inclusivity': {
      high: 'You actively ensure all team members feel valued and included',
      low: 'Work on creating more inclusive environments for all team members'
    },
    'flexibility': {
      high: 'You adapt well to different working styles and changing team needs',
      low: 'Develop greater flexibility in your approach to team collaboration'
    },
    'emotional_intelligence': {
      high: 'You demonstrate strong awareness of team dynamics and emotional needs',
      low: 'Build skills in reading team emotions and providing appropriate support'
    },
    'virtual_collaboration': {
      high: 'You excel at collaborating effectively in remote and digital environments',
      low: 'Strengthen your skills for virtual and remote team collaboration'
    }
  }
  return interpretations[dimension]?.[score >= 65 ? 'high' : 'low'] || 'Affects your collaboration effectiveness'
}

const getCollaborationLevel = (score) => {
  if (score >= 80) {
    return {
      name: "Collaboration Champion",
      description: "You demonstrate exceptional collaboration skills across all dimensions. You're a natural team player who consistently elevates team performance and creates positive working relationships."
    }
  } else if (score >= 65) {
    return {
      name: "Strong Collaborator",
      description: "You show solid collaboration skills with consistent team-focused behavior. You contribute positively to team dynamics and help others work together effectively."
    }
  } else if (score >= 50) {
    return {
      name: "Developing Collaborator",
      description: "You have good foundational collaboration skills with clear opportunities for growth. Focus on strengthening key areas to become more effective in team settings."
    }
  } else if (score >= 35) {
    return {
      name: "Emerging Collaborator",
      description: "You're building your collaboration capabilities and show potential for improvement. Concentrate on developing core teamwork skills and team-focused behaviors."
    }
  } else {
    return {
      name: "Early-Stage Collaborator",
      description: "You have significant opportunities to develop collaboration skills. Focus on basic team behaviors like communication, cooperation, and support for others."
    }
  }
}

const determineCollaborationStyle = (dimensions, responses) => {
  // Analyze patterns to determine collaboration archetype
  const styles = {
    facilitator: dimensions.consensus_building.score,
    supporter: dimensions.cooperation.score,
    communicator: dimensions.communication.score,
    innovator: Math.max(dimensions.flexibility.score, dimensions.emotional_intelligence.score)
  }

  const dominantStyle = Object.entries(styles).sort(([,a], [,b]) => b - a)[0][0]

  const styleProfiles = {
    facilitator: {
      name: 'The Facilitator',
      description: 'You excel at helping teams reach decisions and build consensus. You naturally guide group processes and ensure everyone\'s voice is heard.',
      characteristics: [
        'Strong skills in mediating conflicts and building agreement',
        'Natural ability to guide group discussions and decision-making',
        'Focus on inclusive processes that engage all team members',
        'Comfortable with complexity and multiple perspectives'
      ]
    },
    supporter: {
      name: 'The Supporter',
      description: 'You excel at helping teammates succeed and creating a cooperative team environment. You consistently put team needs ahead of individual interests.',
      characteristics: [
        'Proactive in offering help and support to team members',
        'Strong focus on collective success over individual achievement',
        'Natural ability to spot when others need assistance',
        'Creates positive team atmosphere through supportive behavior'
      ]
    },
    communicator: {
      name: 'The Communicator',
      description: 'You excel at facilitating clear information flow and understanding within teams. You help ensure everyone stays informed and connected.',
      characteristics: [
        'Excellent at sharing information proactively and clearly',
        'Strong active listening skills and empathy for others',
        'Natural ability to bridge communication gaps',
        'Focus on transparency and open information sharing'
      ]
    },
    innovator: {
      name: 'The Adaptive Innovator',
      description: 'You excel at helping teams adapt to change and find creative solutions together. You bring flexibility and fresh thinking to collaborative efforts.',
      characteristics: [
        'Strong adaptability to different working styles and preferences',
        'Ability to help teams navigate change and uncertainty',
        'Focus on creative problem-solving and building on ideas',
        'Natural emotional intelligence in team settings'
      ]
    }
  }

  return styleProfiles[dominantStyle]
}

const calculateTeamEffectiveness = (dimensions) => {
  const trust = Math.round((dimensions.trust_building.score + dimensions.communication.score) / 2)
  const productivity = Math.round((dimensions.cooperation.score + dimensions.consensus_building.score) / 2)
  const innovation = Math.round((dimensions.flexibility.score + dimensions.inclusivity.score) / 2)

  let summary = ""
  const average = Math.round((trust + productivity + innovation) / 3)
  
  if (average >= 75) {
    summary = "Your collaboration style significantly enhances team effectiveness across all key areas."
  } else if (average >= 60) {
    summary = "You positively contribute to team effectiveness with some areas for additional impact."
  } else if (average >= 45) {
    summary = "You have moderate impact on team effectiveness with clear opportunities for improvement."
  } else {
    summary = "Focus on developing collaboration skills to increase your positive impact on team effectiveness."
  }

  return { trust, productivity, innovation, summary }
}

const getStrengths = (dimensions) => {
  const strengths = []
  Object.entries(dimensions).forEach(([key, data]) => {
    if (data.score >= 70) {
      const strengthMap = {
        'communication': 'Excellent team communication and active listening',
        'cooperation': 'Strong supportive behavior and team-first attitude',
        'consensus_building': 'Effective facilitation and consensus-building skills',
        'trust_building': 'Builds trust through reliability and transparency',
        'inclusivity': 'Creates inclusive environments for all team members',
        'flexibility': 'Adapts well to different working styles and changes',
        'emotional_intelligence': 'Strong awareness of team dynamics and emotions',
        'virtual_collaboration': 'Excellent virtual and remote collaboration skills'
      }
      strengths.push(strengthMap[key])
    }
  })
  
  if (strengths.length === 0) {
    strengths.push('Positive attitude toward teamwork and collaboration')
  }
  
  return strengths
}

const getDevelopmentAreas = (dimensions) => {
  const areas = []
  const sorted = Object.entries(dimensions).sort(([,a], [,b]) => a.score - b.score)
  
  sorted.slice(0, 3).forEach(([key, data]) => {
    const areaMap = {
      'communication': 'Strengthen communication clarity and active listening skills',
      'cooperation': 'Increase supportive behavior and team-focused actions',
      'consensus_building': 'Develop facilitation and consensus-building capabilities',
      'trust_building': 'Build trust through more consistent and transparent behavior',
      'inclusivity': 'Create more inclusive environments for diverse team members',
      'flexibility': 'Increase adaptability to different working styles and changes',
      'emotional_intelligence': 'Develop awareness of team emotions and dynamics',
      'virtual_collaboration': 'Improve effectiveness in remote and digital collaboration'
    }
    if (data.score < 65) {
      areas.push(areaMap[key])
    }
  })
  
  return areas
}

const generateEnhancementPlan = (dimensions, responses) => {
  const immediate = []
  const longTerm = []
  
  // Find lowest scoring dimensions for targeted development
  const lowestDimensions = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 2)
  
  lowestDimensions.forEach(([key, data]) => {
    switch(key) {
      case 'communication':
        immediate.push("Practice active listening in your next team meeting")
        longTerm.push("Develop a personal communication improvement plan with feedback")
        break
      case 'cooperation':
        immediate.push("Offer help to a teammate who seems overwhelmed this week")
        longTerm.push("Build habits of proactively supporting team members")
        break
      case 'consensus_building':
        immediate.push("Facilitate one group decision using inclusive processes")
        longTerm.push("Develop mediation and facilitation skills through training")
        break
      case 'trust_building':
        immediate.push("Follow through completely on all commitments this week")
        longTerm.push("Build reputation for reliability through consistent behavior")
        break
      case 'inclusivity':
        immediate.push("Actively include quieter team members in discussions")
        longTerm.push("Learn about inclusive leadership and unconscious bias")
        break
      case 'flexibility':
        immediate.push("Adapt your communication style to one teammate's preferences")
        longTerm.push("Develop skills in change management and adaptability")
        break
      case 'emotional_intelligence':
        immediate.push("Check in with team members about how they're feeling")
        longTerm.push("Build emotional intelligence skills through practice and feedback")
        break
      case 'virtual_collaboration':
        immediate.push("Try new virtual collaboration tools in your next remote meeting")
        longTerm.push("Master virtual facilitation and remote team building skills")
        break
    }
  })
  
  // Add general collaboration enhancement recommendations
  immediate.push("Ask for feedback on your collaboration effectiveness from teammates")
  longTerm.push("Create a personal collaboration development plan with specific goals")
  
  return { immediate, longTerm }
}

const generateSummary = (collaborationLevel, overallScore, dimensions, collaborationStyle) => {
  const topDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)[0]
  
  const bottomDimension = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)[0]

  return `Your collaboration assessment reveals you as a ${collaborationLevel.name.toLowerCase()} with an overall effectiveness score of ${overallScore}%. Your collaboration style is ${collaborationStyle.name}, characterized by ${collaborationStyle.description.split('.')[0].toLowerCase()}. Your strongest dimension is ${getDimensionName(topDimension[0])} (${topDimension[1].score}%), where ${topDimension[1].interpretation.toLowerCase()}. Your greatest development opportunity lies in ${getDimensionName(bottomDimension[0])} (${bottomDimension[1].score}%), where you should ${bottomDimension[1].interpretation.toLowerCase()}. ${collaborationLevel.description} Focus on leveraging your natural collaboration strengths while systematically developing areas that will enhance your overall team effectiveness.`
}

const saveAssessment = async () => {
  if (!user.value || !results.value) return

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'collaboration_skills',
      test_variant_id: 'collaboration_skills_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.collaborationLevel.name,
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'collaboration',
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
  title: 'Collaboration Excellence Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Assess your ability to work effectively with others, facilitate cooperation, build consensus, and create synergistic team relationships.' }
  ]
})
</script>