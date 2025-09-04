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
              Team Leadership Assessment
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
          <div class="text-6xl mb-4">👥</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">
            Assessment Complete!
          </h2>
          <div :class="`text-lg ${themeClasses.textSecondary}`">
            Your team leadership profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Overall Leadership Score -->
          <div :class="`${themeClasses.featureBackground} rounded-xl p-6 text-center`">
            <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">Your Leadership Effectiveness</h3>
            <div :class="`text-5xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.overallScore }}%</div>
            <p :class="`${themeClasses.textSecondary} text-lg mb-4`">{{ results.leadershipLevel.description }}</p>
            
            <!-- Overall Progress Bar -->
            <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-6 mb-4`">
              <div 
                :class="`${getProgressBarColor(results.overallScore)} h-6 rounded-full transition-all duration-1000 flex items-center justify-center`"
                :style="{ width: `${results.overallScore}%` }"
              >
                <span class="text-white text-sm font-bold">{{ results.leadershipLevel.name }}</span>
              </div>
            </div>
          </div>

          <!-- Leadership Competencies -->
          <div class="grid md:grid-cols-2 gap-6">
            <div 
              v-for="(competency, key) in results.competencies" 
              :key="key"
              :class="`${themeClasses.cardBackground} rounded-xl p-6 ${themeClasses.cardShadow}`"
            >
              <div class="flex items-center justify-between mb-4">
                <h4 :class="`text-lg font-bold ${themeClasses.textPrimary}`">{{ getCompetencyName(key) }}</h4>
                <div :class="`text-xl font-bold ${getScoreColor(competency.score)}`">{{ competency.score }}%</div>
              </div>
              
              <!-- Progress bar for this competency -->
              <div :class="`w-full ${themeClasses.progressBackground} rounded-full h-3 mb-3`">
                <div 
                  :class="`${getProgressBarColor(competency.score)} h-3 rounded-full transition-all duration-1000`"
                  :style="{ width: `${competency.score}%` }"
                ></div>
              </div>
              
              <p :class="`${themeClasses.textSecondary} text-sm mb-2`">{{ competency.description }}</p>
              <div :class="`text-xs ${themeClasses.textMuted}`">
                <strong>{{ competency.level }}:</strong> {{ competency.interpretation }}
              </div>
            </div>
          </div>

          <!-- Leadership Style -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderAccent}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Leadership Style</h3>
            <div :class="`bg-gradient-to-r ${themeClasses.gradientBackground} p-4 rounded-lg mb-4`">
              <div :class="`text-2xl font-bold ${themeClasses.textAccent} mb-2`">{{ results.leadershipStyle.name }}</div>
              <p :class="`${themeClasses.textSecondary} leading-relaxed mb-4`">{{ results.leadershipStyle.description }}</p>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Key Characteristics:</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary}`">
                  <li v-for="characteristic in results.leadershipStyle.characteristics" :key="characteristic">{{ characteristic }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Strengths & Development Areas -->
          <div class="grid md:grid-cols-2 gap-6">
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-green-200`">
              <h3 :class="`text-xl font-bold text-green-800 mb-4`">Leadership Strengths</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="strength in results.strengths" :key="strength" class="flex items-start">
                  <span class="text-green-500 mr-2">⚡</span>
                  {{ strength }}
                </li>
              </ul>
            </div>
            
            <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 border-amber-200`">
              <h3 :class="`text-xl font-bold text-amber-800 mb-4`">Development Opportunities</h3>
              <ul :class="`space-y-2 ${themeClasses.textSecondary}`">
                <li v-for="opportunity in results.developmentAreas" :key="opportunity" class="flex items-start">
                  <span class="text-amber-500 mr-2">📈</span>
                  {{ opportunity }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Leadership Development Plan -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Leadership Development Plan</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Immediate Actions (Next 30 Days):</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="action in results.developmentPlan.immediate" :key="action">{{ action }}</li>
                </ul>
              </div>
              <div>
                <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Long-term Development (3-6 Months):</h4>
                <ul :class="`list-disc list-inside space-y-1 ${themeClasses.textSecondary} text-sm`">
                  <li v-for="plan in results.developmentPlan.longTerm" :key="plan">{{ plan }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Overall Summary -->
          <div :class="`${themeClasses.cardBackground} rounded-xl p-6 border-2 ${themeClasses.borderSecondary}`">
            <h3 :class="`text-xl font-bold ${themeClasses.textPrimary} mb-4`">Your Team Leadership Summary</h3>
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
          <p :class="themeClasses.textSecondary">Analyzing your team leadership capabilities...</p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else :class="`${themeClasses.cardBackground} rounded-lg ${themeClasses.cardShadow} p-8`">
        <div class="mb-8">
          <h2 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6`">
            Leadership Scenario {{ currentQuestion + 1 }}
          </h2>
          <div :class="`${themeClasses.featureBackground} p-6 rounded-lg border-l-4 ${themeClasses.borderAccent} mb-4`">
            <div :class="`font-semibold ${themeClasses.textPrimary} mb-2`">{{ questions[currentQuestion]?.scenario }}</div>
          </div>
          <div :class="`text-lg ${themeClasses.textPrimary} font-medium`">
            {{ questions[currentQuestion]?.question }}
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
              <div :class="`text-sm ${selectedAnswer === (option.value || index) ? 'text-white opacity-90' : themeClasses.textMuted}`">
                {{ option.rationale }}
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

// Scenario-based questions for Team Leadership Assessment
const questions = ref([
  // Team Motivation Scenarios
  {
    scenario: "Your team has been working on a challenging project for months. You notice motivation levels dropping and some team members seem disengaged.",
    question: "What would be your primary approach to re-energize the team?",
    category: "motivation",
    options: [
      { text: "Schedule one-on-one meetings to understand individual concerns and motivations", value: "individual_focus", rationale: "Shows care for team members as individuals and addresses root causes" },
      { text: "Organize a team celebration and remind everyone of the project's importance", value: "team_rally", rationale: "Builds collective energy and reinforces shared purpose" },
      { text: "Break down remaining work into smaller milestones with quick wins", value: "milestone_approach", rationale: "Creates momentum through achievable progress markers" },
      { text: "Bring in additional resources or negotiate timeline adjustments", value: "resource_support", rationale: "Addresses systemic issues that may be causing burnout" }
    ]
  },

  {
    scenario: "A high-performing team member consistently delivers excellent work but rarely participates in team discussions or collaborative activities.",
    question: "How would you address this situation?",
    category: "team_dynamics",
    options: [
      { text: "Have a private conversation to understand their perspective and preferences", value: "understand_style", rationale: "Respects individual working styles while gathering information" },
      { text: "Assign them specific roles in meetings to encourage participation", value: "structured_participation", rationale: "Provides clear expectations and opportunities to contribute" },
      { text: "Focus on their strong individual contributions and don't force change", value: "accept_style", rationale: "Values diverse working styles and leverages existing strengths" },
      { text: "Pair them with more outgoing team members for collaborative tasks", value: "peer_pairing", rationale: "Uses social dynamics to gradually increase engagement" }
    ]
  },

  {
    scenario: "Two experienced team members have a fundamental disagreement about the technical approach for a critical project component.",
    question: "What's your strategy for resolving this conflict?",
    category: "conflict_resolution",
    options: [
      { text: "Facilitate a structured discussion where each presents their case to the team", value: "open_discussion", rationale: "Leverages team collective wisdom and promotes transparency" },
      { text: "Research both approaches and make an executive decision based on data", value: "data_driven_decision", rationale: "Ensures objective evaluation and clear leadership direction" },
      { text: "Have them collaborate on a small prototype to test both approaches", value: "prototype_test", rationale: "Turns conflict into experimentation and shared learning" },
      { text: "Consult with external experts or senior leadership for guidance", value: "expert_consultation", rationale: "Brings in additional perspective and authority when needed" }
    ]
  },

  {
    scenario: "Your team is facing a tight deadline, and you need to decide how to allocate work among team members with varying skill levels and availability.",
    question: "How do you approach this delegation challenge?",
    category: "delegation",
    options: [
      { text: "Assign tasks based primarily on each person's strongest skills and expertise", value: "strength_based", rationale: "Maximizes efficiency and leverages existing capabilities" },
      { text: "Balance workload equally while providing extra support where needed", value: "balanced_support", rationale: "Ensures fairness while maintaining team cohesion" },
      { text: "Give challenging tasks to high performers and routine work to others", value: "performance_based", rationale: "Optimizes output by matching task complexity to capability" },
      { text: "Create mixed-skill pairs/groups to distribute knowledge and reduce risk", value: "collaborative_pairs", rationale: "Builds team capability while ensuring knowledge transfer" }
    ]
  },

  {
    scenario: "A team member consistently misses deadlines despite having the necessary skills. This is starting to impact other team members and project timelines.",
    question: "What's your approach to address this performance issue?",
    category: "performance_management",
    options: [
      { text: "Have a direct conversation about expectations and consequences", value: "direct_accountability", rationale: "Establishes clear expectations and maintains team standards" },
      { text: "Investigate underlying causes such as workload, personal issues, or unclear requirements", value: "root_cause_analysis", rationale: "Addresses systemic issues that may be contributing to the problem" },
      { text: "Provide additional training or mentoring support", value: "skill_development", rationale: "Invests in team member growth and capability building" },
      { text: "Reassign their responsibilities to more reliable team members", value: "workload_redistribution", rationale: "Protects project success while managing underperformance" }
    ]
  },

  {
    scenario: "Your organization is implementing a major change that your team is resistant to. You personally have concerns about the change but need to lead your team through it.",
    question: "How do you handle this leadership challenge?",
    category: "change_leadership",
    options: [
      { text: "Be transparent about your own concerns while emphasizing the need to adapt", value: "transparent_leadership", rationale: "Builds trust through authenticity while modeling adaptability" },
      { text: "Focus on finding positive aspects of the change and communicating those", value: "positive_framing", rationale: "Maintains team morale and focuses on opportunities" },
      { text: "Involve the team in identifying ways to make the change work better", value: "collaborative_adaptation", rationale: "Empowers the team and leverages collective problem-solving" },
      { text: "Advocate upward for your team's concerns while implementing the change", value: "advocacy_implementation", rationale: "Represents team interests while fulfilling leadership responsibilities" }
    ]
  },

  {
    scenario: "A new team member with impressive credentials is struggling to integrate with the existing team culture and work style.",
    question: "What's your strategy for helping them succeed?",
    category: "team_integration",
    options: [
      { text: "Assign them a buddy or mentor from the existing team", value: "mentorship_program", rationale: "Provides personal guidance and cultural integration support" },
      { text: "Have regular check-ins to understand their challenges and provide guidance", value: "direct_support", rationale: "Ensures ongoing communication and personalized assistance" },
      { text: "Give them time to find their own way while being available for questions", value: "organic_integration", rationale: "Respects their expertise while allowing natural adaptation" },
      { text: "Facilitate team activities that help everyone get to know each other better", value: "team_bonding", rationale: "Builds relationships and shared understanding across the team" }
    ]
  },

  {
    scenario: "Your team has achieved a major milestone ahead of schedule. The success was due to exceptional effort from everyone, but some contributed more visibly than others.",
    question: "How do you handle recognition and celebration?",
    category: "recognition",
    options: [
      { text: "Publicly recognize everyone's contribution while highlighting specific key efforts", value: "inclusive_specific_recognition", rationale: "Acknowledges all contributions while celebrating standout performance" },
      { text: "Focus recognition on the most visible contributors to incentivize high performance", value: "performance_focused", rationale: "Rewards exceptional effort and sets standards for achievement" },
      { text: "Emphasize the team's collective achievement and shared success", value: "team_celebration", rationale: "Builds team cohesion and shared ownership of success" },
      { text: "Have individual conversations to acknowledge each person's unique contribution", value: "personal_recognition", rationale: "Provides personalized appreciation that resonates with each individual" }
    ]
  },

  {
    scenario: "You discover that one of your team members has been sharing confidential project information with someone outside the organization.",
    question: "What's your immediate course of action?",
    category: "trust_management",
    options: [
      { text: "Confront them directly and privately to understand the situation", value: "direct_confrontation", rationale: "Addresses the issue immediately while maintaining confidentiality" },
      { text: "Report the breach to appropriate authorities while gathering more information", value: "formal_reporting", rationale: "Ensures proper protocols are followed and protects organizational interests" },
      { text: "Document the incident and monitor the situation before taking action", value: "careful_monitoring", rationale: "Gathers comprehensive evidence before making potentially career-impacting decisions" },
      { text: "Remove their access to sensitive information while investigating further", value: "immediate_containment", rationale: "Prevents further damage while allowing for proper investigation" }
    ]
  },

  {
    scenario: "Your team is working on multiple projects simultaneously, and team members are expressing stress about competing priorities and unclear expectations.",
    question: "How do you address this situation?",
    category: "priority_management",
    options: [
      { text: "Create a clear priority matrix with stakeholder input and communicate it to the team", value: "priority_clarity", rationale: "Provides clear direction and reduces ambiguity about what matters most" },
      { text: "Meet with each team member to understand their workload and redistribute as needed", value: "workload_balancing", rationale: "Addresses individual stress while optimizing team capacity" },
      { text: "Negotiate with stakeholders to reduce scope or extend timelines", value: "scope_negotiation", rationale: "Addresses root cause of stress by managing external expectations" },
      { text: "Implement better project management tools and processes for tracking work", value: "process_improvement", rationale: "Creates systems that prevent future confusion and stress" }
    ]
  },

  // Additional scenarios covering various leadership competencies
  {
    scenario: "A team member approaches you with an innovative idea that could significantly improve your product, but it would require substantial time and resources to implement.",
    question: "How do you evaluate and respond to this suggestion?",
    category: "innovation_leadership",
    options: [
      { text: "Have them develop a detailed proposal with costs, benefits, and timeline", value: "structured_evaluation", rationale: "Ensures thorough analysis while empowering the team member" },
      { text: "Test the idea with a small pilot or proof-of-concept first", value: "pilot_approach", rationale: "Reduces risk while validating the innovation potential" },
      { text: "Present the idea to senior leadership for strategic assessment", value: "strategic_escalation", rationale: "Ensures alignment with broader organizational priorities" },
      { text: "Encourage them to pursue it as a side project with limited resources", value: "innovation_time", rationale: "Supports innovation while managing resource constraints" }
    ]
  },

  {
    scenario: "Your team needs to adopt a new technology platform, but team members have varying levels of technical expertise and comfort with change.",
    question: "What's your approach to managing this transition?",
    category: "change_management",
    options: [
      { text: "Create differentiated training programs based on current skill levels", value: "personalized_training", rationale: "Meets people where they are and ensures everyone can succeed" },
      { text: "Identify tech-savvy team members to serve as peer mentors and champions", value: "peer_leadership", rationale: "Leverages internal expertise and builds supportive relationships" },
      { text: "Phase the transition gradually with plenty of support and feedback loops", value: "gradual_transition", rationale: "Reduces anxiety and allows for course correction during implementation" },
      { text: "Provide extensive external training and certification opportunities", value: "formal_development", rationale: "Invests in comprehensive skill building and professional development" }
    ]
  },

  {
    scenario: "Your team has been working remotely, and you notice that communication and collaboration seem to be declining over time.",
    question: "What steps do you take to improve remote team dynamics?",
    category: "remote_leadership",
    options: [
      { text: "Increase the frequency of team meetings and check-ins", value: "increased_touchpoints", rationale: "Provides more opportunities for connection and alignment" },
      { text: "Implement new collaboration tools and train the team on their use", value: "technology_solutions", rationale: "Addresses technical barriers to effective remote collaboration" },
      { text: "Create more structured opportunities for informal social interaction", value: "social_connection", rationale: "Rebuilds interpersonal relationships that support work collaboration" },
      { text: "Survey the team to understand specific challenges and preferences", value: "data_driven_approach", rationale: "Gathers insights to create targeted solutions for actual problems" }
    ]
  },

  {
    scenario: "You've been asked to lead a cross-functional team where you don't have direct authority over most team members, who report to other managers.",
    question: "How do you establish leadership and influence in this situation?",
    category: "influence_leadership",
    options: [
      { text: "Focus on building relationships and understanding each person's motivations", value: "relationship_building", rationale: "Creates foundation for influence through personal connection and trust" },
      { text: "Clearly articulate the shared vision and how each person's contribution matters", value: "vision_alignment", rationale: "Unifies the team around common purpose and individual value" },
      { text: "Demonstrate your expertise and value through early wins and helpful contributions", value: "credibility_building", rationale: "Establishes leadership through competence and useful action" },
      { text: "Work with other managers to align expectations and support structures", value: "stakeholder_alignment", rationale: "Creates systemic support for cross-functional collaboration" }
    ]
  },

  {
    scenario: "A team member consistently produces high-quality work but takes much longer than estimated, causing delays in project timelines.",
    question: "How do you address this performance pattern?",
    category: "performance_optimization",
    options: [
      { text: "Work with them to identify bottlenecks and process improvements", value: "process_optimization", rationale: "Addresses root causes while preserving quality standards" },
      { text: "Adjust project planning to account for their thorough work style", value: "planning_adaptation", rationale: "Works with their strengths while managing project expectations" },
      { text: "Provide coaching on time management and prioritization skills", value: "skill_coaching", rationale: "Develops capabilities to balance quality with efficiency" },
      { text: "Pair them with faster workers to balance speed and quality", value: "complementary_pairing", rationale: "Leverages diverse strengths within the team structure" }
    ]
  }
])

// Computed properties
const canProceed = computed(() => {
  return selectedAnswer.value !== null
})

// Helper functions
const getCompetencyName = (competency) => {
  const names = {
    'team_motivation': 'Team Motivation',
    'conflict_resolution': 'Conflict Resolution',
    'delegation': 'Delegation & Empowerment',
    'communication': 'Communication Skills',
    'change_leadership': 'Change Leadership',
    'performance_management': 'Performance Management',
    'decision_making': 'Decision Making',
    'strategic_thinking': 'Strategic Thinking'
  }
  return names[competency] || competency
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
  // Calculate leadership competencies based on scenarios
  const competencies = {
    team_motivation: { score: 0, count: 0 },
    conflict_resolution: { score: 0, count: 0 },
    delegation: { score: 0, count: 0 },
    communication: { score: 0, count: 0 },
    change_leadership: { score: 0, count: 0 },
    performance_management: { score: 0, count: 0 },
    decision_making: { score: 0, count: 0 },
    strategic_thinking: { score: 0, count: 0 }
  }

  let totalScore = 0
  let scoreCount = 0

  // Analyze each response and score based on leadership effectiveness
  responses.value.forEach(response => {
    const { category, answer } = response
    let score = 0

    // Score responses based on leadership best practices
    switch(category) {
      case 'motivation':
        if (answer === 'individual_focus') score = 5 // Best practice: individual attention
        else if (answer === 'milestone_approach') score = 4
        else if (answer === 'team_rally') score = 3
        else score = 3
        competencies.team_motivation.score += score
        competencies.team_motivation.count += 1
        break
      case 'conflict_resolution':
        if (answer === 'prototype_test') score = 5 // Best practice: collaborative problem-solving
        else if (answer === 'open_discussion') score = 4
        else if (answer === 'data_driven_decision') score = 4
        else score = 3
        competencies.conflict_resolution.score += score
        competencies.conflict_resolution.count += 1
        break
      case 'delegation':
        if (answer === 'collaborative_pairs') score = 5 // Best practice: knowledge sharing
        else if (answer === 'strength_based') score = 4
        else if (answer === 'balanced_support') score = 4
        else score = 3
        competencies.delegation.score += score
        competencies.delegation.count += 1
        break
      case 'performance_management':
        if (answer === 'root_cause_analysis') score = 5 // Best practice: understand root causes
        else if (answer === 'direct_accountability') score = 4
        else if (answer === 'skill_development') score = 4
        else score = 3
        competencies.performance_management.score += score
        competencies.performance_management.count += 1
        break
      case 'change_leadership':
        if (answer === 'transparent_leadership') score = 5 // Best practice: authentic leadership
        else if (answer === 'collaborative_adaptation') score = 4
        else if (answer === 'advocacy_implementation') score = 4
        else score = 3
        competencies.change_leadership.score += score
        competencies.change_leadership.count += 1
        break
      case 'team_dynamics':
      case 'team_integration':
        if (answer === 'understand_style' || answer === 'mentorship_program') score = 5
        else if (answer === 'structured_participation' || answer === 'direct_support') score = 4
        else score = 3
        competencies.communication.score += score
        competencies.communication.count += 1
        break
      case 'priority_management':
      case 'innovation_leadership':
        if (answer === 'priority_clarity' || answer === 'structured_evaluation') score = 5
        else if (answer === 'workload_balancing' || answer === 'pilot_approach') score = 4
        else score = 3
        competencies.decision_making.score += score
        competencies.decision_making.count += 1
        break
      case 'influence_leadership':
      case 'remote_leadership':
        if (answer === 'relationship_building' || answer === 'data_driven_approach') score = 5
        else if (answer === 'vision_alignment' || answer === 'social_connection') score = 4
        else score = 3
        competencies.strategic_thinking.score += score
        competencies.strategic_thinking.count += 1
        break
    }
    
    totalScore += score
    scoreCount += 1
  })

  // Normalize competency scores to percentages
  Object.keys(competencies).forEach(key => {
    if (competencies[key].count > 0) {
      competencies[key].score = Math.round((competencies[key].score / (competencies[key].count * 5)) * 100)
    } else {
      competencies[key].score = 50 // Default neutral score
    }
    
    competencies[key] = {
      ...competencies[key],
      level: getLevel(competencies[key].score),
      description: getCompetencyDescription(key),
      interpretation: getCompetencyInterpretation(key, competencies[key].score)
    }
  })

  // Calculate overall score
  const overallScore = Math.round((totalScore / (scoreCount * 5)) * 100)
  
  // Determine leadership level
  const leadershipLevel = getLeadershipLevel(overallScore)
  
  // Determine leadership style based on response patterns
  const leadershipStyle = determineLeadershipStyle(responses.value)
  
  // Generate strengths and development areas
  const strengths = getStrengths(competencies)
  const developmentAreas = getDevelopmentAreas(competencies)
  
  // Generate development plan
  const developmentPlan = generateDevelopmentPlan(competencies, responses.value)
  
  // Generate summary
  const summary = generateSummary(leadershipLevel, overallScore, competencies, leadershipStyle)

  results.value = {
    overallScore,
    leadershipLevel,
    leadershipStyle,
    competencies,
    strengths,
    developmentAreas,
    developmentPlan,
    summary,
    completedAt: new Date().toISOString()
  }
}

const getLevel = (score) => {
  if (score >= 85) return 'Advanced'
  if (score >= 70) return 'Proficient'
  if (score >= 55) return 'Developing'
  if (score >= 40) return 'Basic'
  return 'Needs Development'
}

const getCompetencyDescription = (competency) => {
  const descriptions = {
    'team_motivation': 'Ability to inspire, energize, and maintain team engagement and enthusiasm',
    'conflict_resolution': 'Skills in mediating disputes and turning conflicts into productive outcomes',
    'delegation': 'Effectiveness in assigning tasks, empowering others, and developing team capabilities',
    'communication': 'Clarity in conveying information, active listening, and facilitating understanding',
    'change_leadership': 'Capability to guide teams through transitions and organizational changes',
    'performance_management': 'Skills in setting expectations, providing feedback, and improving team performance',
    'decision_making': 'Quality of judgment, problem-solving approach, and strategic thinking',
    'strategic_thinking': 'Ability to see big picture, plan ahead, and align team efforts with broader goals'
  }
  return descriptions[competency] || 'Leadership competency'
}

const getCompetencyInterpretation = (competency, score) => {
  const interpretations = {
    'team_motivation': {
      high: 'You excel at inspiring and energizing your team members',
      low: 'Focus on developing skills to better motivate and engage your team'
    },
    'conflict_resolution': {
      high: 'You effectively handle conflicts and turn them into positive outcomes',
      low: 'Strengthen your skills in mediating disputes and managing team conflicts'
    },
    'delegation': {
      high: 'You delegate effectively and empower team members to grow',
      low: 'Develop better delegation skills and trust in your team\'s capabilities'
    },
    'communication': {
      high: 'You communicate clearly and facilitate good team understanding',
      low: 'Improve your communication skills and active listening abilities'
    },
    'change_leadership': {
      high: 'You guide your team effectively through changes and transitions',
      low: 'Build skills in change management and helping teams adapt'
    },
    'performance_management': {
      high: 'You excel at managing performance and developing team members',
      low: 'Strengthen your approach to performance feedback and team development'
    },
    'decision_making': {
      high: 'You make sound decisions and solve problems effectively',
      low: 'Focus on improving your decision-making process and judgment'
    },
    'strategic_thinking': {
      high: 'You think strategically and align team efforts with broader goals',
      low: 'Develop your ability to think strategically and see the bigger picture'
    }
  }
  return interpretations[competency]?.[score >= 70 ? 'high' : 'low'] || 'Affects your leadership effectiveness'
}

const getLeadershipLevel = (score) => {
  if (score >= 85) {
    return {
      name: "Exceptional Leader",
      description: "You demonstrate outstanding leadership capabilities across all key competencies. You're well-equipped to lead high-performing teams and drive significant organizational impact."
    }
  } else if (score >= 70) {
    return {
      name: "Effective Leader",
      description: "You show strong leadership skills with consistent effectiveness across most areas. You successfully guide teams and achieve results while building positive relationships."
    }
  } else if (score >= 55) {
    return {
      name: "Developing Leader",
      description: "You have solid foundational leadership skills with clear opportunities for growth. Focus on strengthening key competencies to increase your leadership impact."
    }
  } else if (score >= 40) {
    return {
      name: "Emerging Leader",
      description: "You're building your leadership capabilities and show potential for growth. Concentrate on developing core leadership skills and gaining more experience."
    }
  } else {
    return {
      name: "Early-Stage Leader",
      description: "You're beginning your leadership journey. Focus on foundational skills like communication, delegation, and team building to establish your leadership effectiveness."
    }
  }
}

const determineLeadershipStyle = (responses) => {
  // Analyze response patterns to determine dominant leadership style
  let collaborative = 0, directive = 0, supportive = 0, transformational = 0

  responses.forEach(response => {
    const answer = response.answer
    
    // Categorize responses by leadership style indicators
    if (['individual_focus', 'understand_style', 'open_discussion', 'collaborative_pairs', 'transparent_leadership', 'collaborative_adaptation', 'relationship_building', 'data_driven_approach'].includes(answer)) {
      collaborative += 1
    }
    if (['data_driven_decision', 'direct_accountability', 'performance_focused', 'formal_reporting', 'strategic_escalation'].includes(answer)) {
      directive += 1
    }
    if (['skill_development', 'mentorship_program', 'direct_support', 'personalized_training', 'process_optimization'].includes(answer)) {
      supportive += 1
    }
    if (['team_rally', 'vision_alignment', 'positive_framing', 'innovation_time', 'credibility_building'].includes(answer)) {
      transformational += 1
    }
  })

  const styles = [
    { name: 'Collaborative Leader', score: collaborative, type: 'collaborative' },
    { name: 'Directive Leader', score: directive, type: 'directive' },
    { name: 'Supportive Leader', score: supportive, type: 'supportive' },
    { name: 'Transformational Leader', score: transformational, type: 'transformational' }
  ]

  const dominantStyle = styles.sort((a, b) => b.score - a.score)[0]

  const styleDescriptions = {
    'collaborative': {
      description: 'You prefer to involve team members in decision-making and value collective input. You build consensus and leverage the diverse perspectives of your team.',
      characteristics: [
        'Seeks input from team members before making decisions',
        'Facilitates group discussions and consensus-building',
        'Values diverse perspectives and inclusive participation',
        'Builds strong team relationships and trust'
      ]
    },
    'directive': {
      description: 'You provide clear direction and make decisive choices based on data and analysis. You focus on efficiency and results while maintaining high standards.',
      characteristics: [
        'Makes quick decisions based on available information',
        'Provides clear expectations and accountability measures',
        'Focuses on results and performance outcomes',
        'Takes charge in challenging or uncertain situations'
      ]
    },
    'supportive': {
      description: 'You focus on developing your team members and providing the support they need to succeed. You prioritize individual growth and capability building.',
      characteristics: [
        'Invests time in coaching and mentoring team members',
        'Provides resources and support for skill development',
        'Shows empathy and understanding for individual challenges',
        'Creates psychologically safe environments for growth'
      ]
    },
    'transformational': {
      description: 'You inspire and motivate through compelling vision and personal example. You focus on innovation and helping others reach their full potential.',
      characteristics: [
        'Communicates inspiring vision and purpose',
        'Models the behavior and values you expect from others',
        'Encourages innovation and creative thinking',
        'Develops others to become leaders themselves'
      ]
    }
  }

  return {
    name: dominantStyle.name,
    ...styleDescriptions[dominantStyle.type]
  }
}

const getStrengths = (competencies) => {
  const strengths = []
  Object.entries(competencies).forEach(([key, data]) => {
    if (data.score >= 75) {
      const strengthMap = {
        'team_motivation': 'Exceptional ability to inspire and energize team members',
        'conflict_resolution': 'Strong skills in resolving conflicts constructively',
        'delegation': 'Effective delegation and team empowerment capabilities',
        'communication': 'Clear communication and active listening skills',
        'change_leadership': 'Excellent change management and adaptation leadership',
        'performance_management': 'Strong performance coaching and development skills',
        'decision_making': 'Sound judgment and effective problem-solving approach',
        'strategic_thinking': 'Strategic perspective and long-term planning abilities'
      }
      strengths.push(strengthMap[key])
    }
  })
  
  if (strengths.length === 0) {
    strengths.push('Commitment to team success and continuous improvement')
  }
  
  return strengths
}

const getDevelopmentAreas = (competencies) => {
  const areas = []
  const sorted = Object.entries(competencies).sort(([,a], [,b]) => a.score - b.score)
  
  sorted.slice(0, 3).forEach(([key, data]) => {
    const areaMap = {
      'team_motivation': 'Build skills in motivating and engaging team members',
      'conflict_resolution': 'Develop conflict mediation and resolution techniques',
      'delegation': 'Strengthen delegation and empowerment capabilities',
      'communication': 'Improve communication clarity and listening skills',
      'change_leadership': 'Enhance change management and adaptation leadership',
      'performance_management': 'Develop performance coaching and feedback skills',
      'decision_making': 'Strengthen decision-making and problem-solving approaches',
      'strategic_thinking': 'Build strategic thinking and long-term planning capabilities'
    }
    if (data.score < 70) {
      areas.push(areaMap[key])
    }
  })
  
  return areas
}

const generateDevelopmentPlan = (competencies, responses) => {
  const immediate = []
  const longTerm = []
  
  // Find lowest scoring competencies for targeted development
  const lowestCompetencies = Object.entries(competencies)
    .sort(([,a], [,b]) => a.score - b.score)
    .slice(0, 2)
  
  lowestCompetencies.forEach(([key, data]) => {
    switch(key) {
      case 'team_motivation':
        immediate.push("Schedule regular one-on-one meetings with each team member")
        longTerm.push("Develop a comprehensive team engagement and recognition program")
        break
      case 'conflict_resolution':
        immediate.push("Practice active listening techniques in your next team conflict")
        longTerm.push("Take a course on mediation and conflict resolution skills")
        break
      case 'delegation':
        immediate.push("Identify one task you can delegate this week and provide clear guidance")
        longTerm.push("Create a delegation framework and train your team on increased responsibilities")
        break
      case 'communication':
        immediate.push("Ask for feedback on your communication effectiveness from your team")
        longTerm.push("Develop structured communication processes and feedback systems")
        break
      case 'change_leadership':
        immediate.push("Practice transparent communication about upcoming changes")
        longTerm.push("Build expertise in change management methodologies and frameworks")
        break
      case 'performance_management':
        immediate.push("Implement regular performance check-ins and feedback sessions")
        longTerm.push("Develop coaching skills and performance development programs")
        break
      case 'decision_making':
        immediate.push("Use a structured decision-making framework for your next important choice")
        longTerm.push("Study advanced problem-solving methodologies and strategic thinking")
        break
      case 'strategic_thinking':
        immediate.push("Connect team goals to broader organizational strategy in your next team meeting")
        longTerm.push("Engage in strategic planning training and long-term vision development")
        break
    }
  })
  
  // Add general leadership development recommendations
  immediate.push("Identify one leadership skill to focus on improving this month")
  longTerm.push("Create a comprehensive leadership development plan with measurable goals")
  
  return { immediate, longTerm }
}

const generateSummary = (leadershipLevel, overallScore, competencies, leadershipStyle) => {
  const topCompetency = Object.entries(competencies)
    .sort(([,a], [,b]) => b.score - a.score)[0]
  
  const bottomCompetency = Object.entries(competencies)
    .sort(([,a], [,b]) => a.score - b.score)[0]

  return `Your team leadership assessment reveals you as an ${leadershipLevel.name.toLowerCase()} with an overall effectiveness score of ${overallScore}%. Your dominant leadership style is ${leadershipStyle.name}, characterized by ${leadershipStyle.description.split('.')[0].toLowerCase()}. Your strongest competency is ${getCompetencyName(topCompetency[0])} (${topCompetency[1].score}%), while your greatest development opportunity lies in ${getCompetencyName(bottomCompetency[0])} (${bottomCompetency[1].score}%). ${leadershipLevel.description} Focus on leveraging your natural leadership strengths while systematically developing areas that will enhance your overall team leadership effectiveness.`
}

const saveAssessment = async () => {
  if (!user.value || !results.value) return

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'team_leadership',
      test_variant_id: 'team_leadership_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.leadershipLevel.name,
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'leadership',
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
  title: 'Team Leadership Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Comprehensive evaluation of your team leadership capabilities including motivation, delegation, conflict resolution, and team dynamics management.' }
  ]
})
</script>