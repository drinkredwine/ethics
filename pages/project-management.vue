<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink :to="$localePath('/')" class="text-xl font-bold text-gray-900">
              ← Assessment Platform
            </NuxtLink>
            <h1 class="text-xl font-bold text-orange-600">
              Project Management Assessment
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <LanguagePicker />
            <span class="text-gray-600"
              >Question {{ currentQuestion + 1 }} of {{ questions.length }}
            </span>
            <span v-if="user" class="text-gray-600">{{ user.email }}</span>
            <button @click="logout" class="text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="bg-gray-200 rounded-full h-3">
          <div
            class="bg-orange-600 h-3 rounded-full transition-all duration-300"
            :style="{
              width: `${(currentQuestion / questions.length) * 100}%`,
            }"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span>Progress: {{ Math.round((currentQuestion / questions.length) * 100) }}%</span>
          <span>Area: {{ getCurrentCompetencyArea() }}</span>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🚀</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Assessment Complete!
          </h2>
          <div class="text-lg text-gray-600">
            Your project management competency profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Overall Score -->
          <div class="text-center bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 mb-8">
            <div class="text-4xl font-bold text-orange-600 mb-2">{{ results.overallScore }}%</div>
            <div class="text-lg font-semibold text-gray-800">Overall PM Competency</div>
            <div class="text-orange-700">{{ getCompetencyLevel(results.overallScore) }}</div>
          </div>

          <!-- Competency Areas Breakdown -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(area, key) in results.competencyAreas" 
              :key="key"
              class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-orange-800">{{ getCompetencyName(key) }}</h3>
                <div class="text-2xl font-bold text-orange-600">{{ area.score }}%</div>
              </div>
              
              <!-- Progress bar for this competency area -->
              <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  class="bg-orange-600 h-3 rounded-full transition-all duration-1000"
                  :style="{ width: `${area.score}%` }"
                ></div>
              </div>
              
              <p class="text-orange-700 text-sm mb-2">{{ area.description }}</p>
              <div class="text-xs text-orange-600">
                <strong>{{ area.level }}:</strong> {{ area.feedback }}
              </div>
            </div>
          </div>

          <!-- Career Recommendations -->
          <div class="bg-white rounded-xl p-6 border-2 border-orange-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">🎯 Career Development Plan</h3>
            <div class="space-y-4">
              <div 
                v-for="(recommendation, index) in results.recommendations" 
                :key="index"
                class="border-l-4 border-orange-500 pl-4 py-2"
              >
                <div class="font-semibold text-gray-800">{{ recommendation.area }}</div>
                <div class="text-gray-600 text-sm">{{ recommendation.suggestion }}</div>
              </div>
            </div>
          </div>

          <!-- Certification Suggestions -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h3 class="text-xl font-bold text-indigo-900 mb-4">📜 Recommended Certifications</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div 
                v-for="cert in results.certifications" 
                :key="cert.name"
                class="bg-white p-4 rounded-lg border border-indigo-200"
              >
                <div class="font-semibold text-indigo-800">{{ cert.name }}</div>
                <div class="text-sm text-indigo-600 mb-2">{{ cert.provider }}</div>
                <div class="text-xs text-gray-600">{{ cert.reason }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <NuxtLink
              :to="$localePath('/profile')"
              class="flex-1 bg-orange-600 text-white text-center py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              View Full Profile
            </NuxtLink>
            <NuxtLink
              :to="$localePath('/')"
              class="flex-1 bg-gray-100 text-gray-900 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Take Another Test
            </NuxtLink>
            <button
              @click="retakeTest"
              class="flex-1 bg-amber-100 text-amber-800 text-center py-3 px-6 rounded-lg hover:bg-amber-200 transition-colors"
            >
              Retake This Test
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Analyzing your project management competencies...</p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <div class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
              {{ getCurrentCompetencyArea() }}
            </div>
            <div class="text-sm text-gray-500">
              Scenario {{ currentQuestion + 1 }} of {{ questions.length }}
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ questions[currentQuestion]?.scenario }}
          </h2>
          
          <div class="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
            <p class="text-lg text-gray-800">
              {{ questions[currentQuestion]?.question }}
            </p>
          </div>
        </div>

        <!-- Multiple Choice Options -->
        <div class="mb-8 space-y-3">
          <button
            v-for="(option, index) in questions[currentQuestion]?.options"
            :key="index"
            @click="selectAnswer(option)"
            :class="{
              'bg-orange-600 text-white border-orange-600': selectedAnswer === option,
              'bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-300': selectedAnswer !== option
            }"
            class="w-full p-4 border-2 rounded-lg transition-all duration-200 text-left"
          >
            <div class="font-medium mb-2">{{ option.text }}</div>
            <div class="text-sm opacity-75">{{ option.reasoning }}</div>
          </button>
        </div>

        <!-- Navigation -->
        <div class="flex justify-between">
          <button
            v-if="currentQuestion > 0"
            @click="previousQuestion"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
          <div v-else></div>

          <button
            @click="nextQuestion"
            :disabled="!selectedAnswer"
            :class="{
              'bg-orange-600 text-white hover:bg-orange-700': selectedAnswer,
              'bg-gray-300 text-gray-500 cursor-not-allowed': !selectedAnswer
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
const user = useSupabaseUser();
const supabase = useSupabaseClient();

// Assessment state
const currentQuestion = ref(0);
const selectedAnswer = ref(null);
const responses = ref([]);
const assessmentComplete = ref(false);
const results = ref(null);

// Project Management scenarios and questions
const questions = ref([
  // Project Planning (7 questions)
  {
    competencyArea: 'planning',
    scenario: 'You\'re tasked with planning a new software product launch',
    question: 'What\'s your first step in creating the project plan?',
    options: [
      { text: 'Start writing detailed task lists immediately', score: 2, reasoning: 'Premature without understanding scope and objectives' },
      { text: 'Define project objectives and success criteria', score: 5, reasoning: 'Essential foundation for all subsequent planning' },
      { text: 'Estimate timeline and budget first', score: 3, reasoning: 'Important but needs objectives to be meaningful' },
      { text: 'Assemble the project team', score: 3, reasoning: 'Team is important but objectives should be clear first' }
    ]
  },
  {
    competencyArea: 'planning',
    scenario: 'Stakeholders are requesting additional features mid-project',
    question: 'How do you handle scope change requests?',
    options: [
      { text: 'Automatically reject to stay on track', score: 2, reasoning: 'Inflexible approach that may miss valuable opportunities' },
      { text: 'Accept all requests to keep stakeholders happy', score: 1, reasoning: 'Leads to scope creep and project failure' },
      { text: 'Evaluate impact on timeline, budget, and quality', score: 5, reasoning: 'Structured approach to change management' },
      { text: 'Defer all decisions to the sponsor', score: 3, reasoning: 'Avoids ownership of change management process' }
    ]
  },
  {
    competencyArea: 'planning',
    scenario: 'You need to estimate project duration with limited historical data',
    question: 'What estimation technique would be most effective?',
    options: [
      { text: 'Use your best guess based on experience', score: 2, reasoning: 'Subjective and potentially inaccurate' },
      { text: 'Apply three-point estimation (optimistic, pessimistic, most likely)', score: 5, reasoning: 'Accounts for uncertainty and provides realistic ranges' },
      { text: 'Take similar project duration and add 20%', score: 3, reasoning: 'Simple but may not account for unique factors' },
      { text: 'Ask team members for individual estimates', score: 4, reasoning: 'Good input but needs structured approach' }
    ]
  },
  {
    competencyArea: 'planning',
    scenario: 'Your project has critical dependencies on external vendors',
    question: 'How do you incorporate these dependencies into your planning?',
    options: [
      { text: 'Plan as if everything will go smoothly', score: 1, reasoning: 'Ignores risk and likely to cause delays' },
      { text: 'Add buffer time to all vendor-dependent activities', score: 4, reasoning: 'Good risk mitigation but may not be optimal' },
      { text: 'Create detailed dependency maps and contingency plans', score: 5, reasoning: 'Comprehensive approach to dependency management' },
      { text: 'Focus on internal activities and deal with vendors later', score: 2, reasoning: 'Reactive approach that may cause integration issues' }
    ]
  },
  {
    competencyArea: 'planning',
    scenario: 'You\'re planning a project with multiple parallel workstreams',
    question: 'What\'s the best approach to coordinate these workstreams?',
    options: [
      { text: 'Let each workstream operate independently', score: 2, reasoning: 'May lead to integration issues and misalignment' },
      { text: 'Create integrated project schedule with clear milestones', score: 5, reasoning: 'Ensures coordination and identifies integration points' },
      { text: 'Have weekly meetings with all workstream leads', score: 4, reasoning: 'Good communication but needs structured planning' },
      { text: 'Focus on the most critical workstream first', score: 3, reasoning: 'Prioritization is good but parallel work may be more efficient' }
    ]
  },
  {
    competencyArea: 'planning',
    scenario: 'Senior management wants an aggressive timeline that seems unrealistic',
    question: 'How do you respond to this pressure?',
    options: [
      { text: 'Agree to the timeline to avoid conflict', score: 1, reasoning: 'Sets project up for failure and damages credibility' },
      { text: 'Present data-driven analysis of realistic timeline', score: 5, reasoning: 'Professional approach using evidence to support position' },
      { text: 'Propose reducing scope to meet timeline', score: 4, reasoning: 'Good alternative but should be combined with timeline analysis' },
      { text: 'Escalate to higher management', score: 2, reasoning: 'May be seen as inability to handle pressure' }
    ]
  },
  {
    competencyArea: 'planning',
    scenario: 'You discover a major planning oversight that affects the critical path',
    question: 'What\'s your immediate response?',
    options: [
      { text: 'Try to fix it quietly without alerting stakeholders', score: 2, reasoning: 'Lack of transparency may lead to bigger issues later' },
      { text: 'Immediately communicate the issue and propose solutions', score: 5, reasoning: 'Transparent approach that maintains trust' },
      { text: 'Wait to see if it becomes a real problem', score: 1, reasoning: 'Reactive approach that may make things worse' },
      { text: 'Blame the oversight on unclear requirements', score: 1, reasoning: 'Defensive response that doesn\'t solve the problem' }
    ]
  },

  // Team Leadership (7 questions)
  {
    competencyArea: 'leadership',
    scenario: 'A key team member is consistently missing deadlines',
    question: 'How do you address this performance issue?',
    options: [
      { text: 'Reassign their work to more reliable team members', score: 3, reasoning: 'Quick fix but doesn\'t address root cause' },
      { text: 'Have a private conversation to understand obstacles', score: 5, reasoning: 'Supportive approach that may uncover and solve underlying issues' },
      { text: 'Document the issues and involve HR', score: 2, reasoning: 'Formal approach but may be premature' },
      { text: 'Set stricter deadlines with penalties', score: 2, reasoning: 'Punitive approach that may damage motivation' }
    ]
  },
  {
    competencyArea: 'leadership',
    scenario: 'Your team is demoralized after a major setback',
    question: 'What\'s your approach to rebuilding team morale?',
    options: [
      { text: 'Focus on the positives and ignore the setback', score: 2, reasoning: 'May seem out of touch with team\'s reality' },
      { text: 'Acknowledge the setback and refocus on path forward', score: 5, reasoning: 'Honest approach that validates feelings while providing direction' },
      { text: 'Give the team time off to recover', score: 3, reasoning: 'May help but doesn\'t address underlying issues' },
      { text: 'Push harder to make up for lost time', score: 1, reasoning: 'Likely to further demoralize an already struggling team' }
    ]
  },
  {
    competencyArea: 'leadership',
    scenario: 'You have team members with conflicting work styles',
    question: 'How do you manage these different approaches?',
    options: [
      { text: 'Let them figure it out themselves', score: 2, reasoning: 'Avoids leadership responsibility and may lead to conflict' },
      { text: 'Impose a single standard work style on everyone', score: 2, reasoning: 'Ignores individual strengths and may reduce effectiveness' },
      { text: 'Facilitate discussion to establish team working agreements', score: 5, reasoning: 'Collaborative approach that leverages diverse strengths' },
      { text: 'Separate conflicting team members into different workstreams', score: 3, reasoning: 'May work but misses opportunity for synergy' }
    ]
  },
  {
    competencyArea: 'leadership',
    scenario: 'A team member challenges your decisions in front of the group',
    question: 'How do you handle this situation?',
    options: [
      { text: 'Assert authority and shut down the challenge', score: 2, reasoning: 'May damage team dynamics and discourage valuable input' },
      { text: 'Welcome the discussion and explore their concerns', score: 5, reasoning: 'Shows confidence and openness to different perspectives' },
      { text: 'Take the discussion offline immediately', score: 4, reasoning: 'Appropriate but may seem defensive' },
      { text: 'Ignore the challenge and continue as planned', score: 1, reasoning: 'Avoids the issue and may seem dismissive' }
    ]
  },
  {
    competencyArea: 'leadership',
    scenario: 'Your team needs to work overtime to meet a critical deadline',
    question: 'How do you approach this request?',
    options: [
      { text: 'Mandate overtime and expect compliance', score: 2, reasoning: 'Authoritarian approach that may damage long-term relationships' },
      { text: 'Explain the situation and ask for voluntary commitment', score: 5, reasoning: 'Transparent approach that respects team autonomy' },
      { text: 'Hire contractors to avoid burdening the team', score: 3, reasoning: 'Considerate but may not be feasible or cost-effective' },
      { text: 'Negotiate for deadline extension instead', score: 4, reasoning: 'Good alternative but may not always be possible' }
    ]
  },
  {
    competencyArea: 'leadership',
    scenario: 'You need to deliver negative feedback to a sensitive team member',
    question: 'What\'s the best approach for this conversation?',
    options: [
      { text: 'Be direct and blunt to avoid confusion', score: 2, reasoning: 'May be too harsh for sensitive individuals' },
      { text: 'Focus on specific behaviors and their impact', score: 5, reasoning: 'Constructive approach that addresses issues without attacking the person' },
      { text: 'Soften the message with lots of positive feedback', score: 3, reasoning: 'May dilute important message' },
      { text: 'Have someone else deliver the feedback', score: 1, reasoning: 'Avoids leadership responsibility' }
    ]
  },
  {
    competencyArea: 'leadership',
    scenario: 'Your team is struggling with a complex technical challenge',
    question: 'How do you provide leadership in this situation?',
    options: [
      { text: 'Find external experts to solve the problem', score: 3, reasoning: 'May be necessary but could undermine team confidence' },
      { text: 'Break down the problem and facilitate collaborative problem-solving', score: 5, reasoning: 'Develops team capabilities while addressing the challenge' },
      { text: 'Let the most technical person take the lead', score: 3, reasoning: 'Leverages expertise but may abdicate leadership role' },
      { text: 'Escalate to senior management for direction', score: 2, reasoning: 'Avoids taking ownership of the challenge' }
    ]
  },

  // Risk Management (7 questions)
  {
    competencyArea: 'risk',
    scenario: 'You\'re starting a new project with several unknown factors',
    question: 'How do you approach risk identification?',
    options: [
      { text: 'Focus only on risks you can control', score: 2, reasoning: 'Ignores external risks that could impact project' },
      { text: 'Conduct structured risk brainstorming with stakeholders', score: 5, reasoning: 'Comprehensive approach leveraging diverse perspectives' },
      { text: 'Use risks from similar past projects', score: 3, reasoning: 'Good starting point but may miss project-specific risks' },
      { text: 'Wait until risks materialize before addressing them', score: 1, reasoning: 'Reactive approach that misses prevention opportunities' }
    ]
  },
  {
    competencyArea: 'risk',
    scenario: 'A identified risk has a low probability but catastrophic impact',
    question: 'How do you handle this type of risk?',
    options: [
      { text: 'Ignore it due to low probability', score: 1, reasoning: 'High impact risks should never be ignored' },
      { text: 'Develop contingency plans despite low probability', score: 5, reasoning: 'Appropriate response to high-impact risks' },
      { text: 'Monitor it but take no action', score: 3, reasoning: 'Partial approach that may not be sufficient' },
      { text: 'Transfer the risk through insurance or contracts', score: 4, reasoning: 'Good strategy when feasible' }
    ]
  },
  {
    competencyArea: 'risk',
    scenario: 'Your project depends on a new technology that hasn\'t been proven at scale',
    question: 'What risk mitigation strategy do you employ?',
    options: [
      { text: 'Proceed with confidence in the technology', score: 1, reasoning: 'Ignores significant technical risk' },
      { text: 'Create proof of concept and backup alternatives', score: 5, reasoning: 'Reduces risk through testing and contingency planning' },
      { text: 'Choose a more proven technology instead', score: 4, reasoning: 'Conservative approach that avoids risk but may miss innovation' },
      { text: 'Delay the project until technology matures', score: 2, reasoning: 'May miss market opportunities' }
    ]
  },
  {
    competencyArea: 'risk',
    scenario: 'Multiple risks are starting to materialize simultaneously',
    question: 'How do you prioritize your risk response?',
    options: [
      { text: 'Address all risks with equal effort', score: 2, reasoning: 'Resource intensive and may not be optimal' },
      { text: 'Focus on risks with highest impact to project objectives', score: 5, reasoning: 'Strategic approach that maximizes risk mitigation effectiveness' },
      { text: 'Handle the easiest risks first', score: 2, reasoning: 'May not address the most critical issues' },
      { text: 'Escalate all risks to senior management', score: 1, reasoning: 'Avoids responsibility for risk management' }
    ]
  },
  {
    competencyArea: 'risk',
    scenario: 'A team member raises a potential risk you hadn\'t considered',
    question: 'How do you respond to this new risk information?',
    options: [
      { text: 'Thank them and add it to the risk register immediately', score: 5, reasoning: 'Shows appreciation and takes appropriate action' },
      { text: 'Assess whether it\'s really a significant risk first', score: 4, reasoning: 'Reasonable but should acknowledge their input' },
      { text: 'Explain why it\'s not a real concern', score: 2, reasoning: 'May discourage future risk reporting' },
      { text: 'Note it but continue with current plans', score: 2, reasoning: 'Doesn\'t give proper consideration to new information' }
    ]
  },
  {
    competencyArea: 'risk',
    scenario: 'Your risk mitigation plan has failed and the risk has occurred',
    question: 'What\'s your immediate response?',
    options: [
      { text: 'Implement the prepared contingency plan', score: 5, reasoning: 'Prepared response that minimizes impact' },
      { text: 'Hold a meeting to discuss what went wrong', score: 3, reasoning: 'Important but not the immediate priority' },
      { text: 'Try to hide the impact from stakeholders', score: 1, reasoning: 'Damages trust and prevents appropriate response' },
      { text: 'Escalate to senior management for direction', score: 3, reasoning: 'May be appropriate but project manager should take initial action' }
    ]
  },
  {
    competencyArea: 'risk',
    scenario: 'Stakeholders are pushing to cut the risk management activities to save time',
    question: 'How do you respond to this pressure?',
    options: [
      { text: 'Comply to maintain good stakeholder relationships', score: 1, reasoning: 'Compromises project success for short-term harmony' },
      { text: 'Explain the potential consequences of inadequate risk management', score: 5, reasoning: 'Educational approach that helps stakeholders make informed decisions' },
      { text: 'Reduce risk activities but keep the most critical ones', score: 4, reasoning: 'Compromise approach that maintains some protection' },
      { text: 'Continue risk activities without informing stakeholders', score: 2, reasoning: 'Lacks transparency and may damage trust' }
    ]
  },

  // Stakeholder Management (7 questions)
  {
    competencyArea: 'stakeholder',
    scenario: 'You have stakeholders with conflicting requirements',
    question: 'How do you resolve these conflicts?',
    options: [
      { text: 'Support the most senior stakeholder\'s position', score: 3, reasoning: 'Simple but may not be the best business decision' },
      { text: 'Facilitate workshops to find win-win solutions', score: 5, reasoning: 'Collaborative approach that seeks mutually beneficial outcomes' },
      { text: 'Try to satisfy everyone partially', score: 2, reasoning: 'May result in solution that satisfies no one fully' },
      { text: 'Let stakeholders work it out themselves', score: 1, reasoning: 'Avoids project manager responsibility' }
    ]
  },
  {
    competencyArea: 'stakeholder',
    scenario: 'A key stakeholder is disengaged and rarely responds to communications',
    question: 'What\'s your approach to re-engage them?',
    options: [
      { text: 'Continue with standard communication and document non-response', score: 2, reasoning: 'Covers bases but doesn\'t solve engagement problem' },
      { text: 'Understand their preferred communication style and adapt', score: 5, reasoning: 'Tailored approach that addresses their needs' },
      { text: 'Escalate their lack of engagement to their manager', score: 3, reasoning: 'May be necessary but could damage relationship' },
      { text: 'Exclude them from future communications', score: 1, reasoning: 'May create bigger problems later' }
    ]
  },
  {
    competencyArea: 'stakeholder',
    scenario: 'Stakeholders are requesting frequent status updates that consume significant time',
    question: 'How do you balance transparency with efficiency?',
    options: [
      { text: 'Provide all requested updates to keep everyone happy', score: 2, reasoning: 'Time-intensive and may not be sustainable' },
      { text: 'Create standardized dashboards with self-service access', score: 5, reasoning: 'Efficient solution that provides transparency' },
      { text: 'Reduce update frequency and hope they don\'t notice', score: 1, reasoning: 'May damage trust and stakeholder satisfaction' },
      { text: 'Assign updates to team members', score: 3, reasoning: 'Delegation is good but may lack strategic perspective' }
    ]
  },
  {
    competencyArea: 'stakeholder',
    scenario: 'A stakeholder is undermining your project in other forums',
    question: 'How do you address this challenge?',
    options: [
      { text: 'Confront them publicly about their behavior', score: 2, reasoning: 'May escalate conflict and damage relationships' },
      { text: 'Have a private conversation to understand their concerns', score: 5, reasoning: 'Direct approach that may resolve underlying issues' },
      { text: 'Build stronger alliances with other stakeholders', score: 4, reasoning: 'Strategic but doesn\'t address root cause' },
      { text: 'Ignore it and focus on project delivery', score: 1, reasoning: 'May allow problem to grow worse' }
    ]
  },
  {
    competencyArea: 'stakeholder',
    scenario: 'You need to communicate bad news about project delays',
    question: 'What\'s the most effective communication approach?',
    options: [
      { text: 'Deliver the news quickly in an email', score: 2, reasoning: 'Efficient but may seem impersonal for important news' },
      { text: 'Present the delay along with recovery plans and options', score: 5, reasoning: 'Complete communication that focuses on solutions' },
      { text: 'Wait until you have a firm recovery plan', score: 3, reasoning: 'May build confidence but delays important communication' },
      { text: 'Have the sponsor deliver the news', score: 2, reasoning: 'Avoids accountability and may seem like poor leadership' }
    ]
  },
  {
    competencyArea: 'stakeholder',
    scenario: 'New stakeholders join the project mid-way with different expectations',
    question: 'How do you manage this situation?',
    options: [
      { text: 'Expect them to catch up by reading project documentation', score: 2, reasoning: 'May lead to misunderstandings and misaligned expectations' },
      { text: 'Conduct formal onboarding sessions to align expectations', score: 5, reasoning: 'Proactive approach that prevents future issues' },
      { text: 'Modify the project to meet their expectations', score: 2, reasoning: 'May derail project without proper change management' },
      { text: 'Let existing stakeholders explain the situation', score: 3, reasoning: 'Delegation is good but PM should ensure consistency' }
    ]
  },
  {
    competencyArea: 'stakeholder',
    scenario: 'Your project sponsor is replaced mid-project',
    question: 'What\'s your priority in managing this transition?',
    options: [
      { text: 'Continue with the project as originally planned', score: 2, reasoning: 'Ignores potential changes in priorities and support' },
      { text: 'Build relationship and confirm continued support and priorities', score: 5, reasoning: 'Essential for project continuity and success' },
      { text: 'Wait for the new sponsor to contact you', score: 1, reasoning: 'Passive approach that may delay important alignment' },
      { text: 'Focus on delivering quick wins to impress them', score: 3, reasoning: 'May be helpful but understanding their priorities is more important' }
    ]
  },

  // Communication & Quality (7 questions)
  {
    competencyArea: 'communication',
    scenario: 'You need to present project status to executives with limited time',
    question: 'How do you structure your communication?',
    options: [
      { text: 'Provide comprehensive details so they have all information', score: 2, reasoning: 'Too detailed for executive audience with time constraints' },
      { text: 'Lead with key decisions needed and critical issues', score: 5, reasoning: 'Executive-focused approach that respects their time' },
      { text: 'Focus on positive achievements to build confidence', score: 3, reasoning: 'May miss important issues that need executive attention' },
      { text: 'Let them ask questions about what interests them', score: 2, reasoning: 'Reactive approach that may miss critical information' }
    ]
  },
  {
    competencyArea: 'communication',
    scenario: 'Team members are interpreting requirements differently',
    question: 'How do you ensure consistent understanding?',
    options: [
      { text: 'Send detailed written clarifications to everyone', score: 4, reasoning: 'Good documentation but may not ensure understanding' },
      { text: 'Hold collaborative sessions to review and align on requirements', score: 5, reasoning: 'Interactive approach that builds shared understanding' },
      { text: 'Have the most senior person explain to others', score: 3, reasoning: 'Leverages expertise but may not address all perspectives' },
      { text: 'Let each team member proceed with their interpretation', score: 1, reasoning: 'Will likely lead to inconsistent deliverables' }
    ]
  },
  {
    competencyArea: 'communication',
    scenario: 'You receive conflicting information from different sources',
    question: 'How do you handle this communication challenge?',
    options: [
      { text: 'Go with information from the most reliable source', score: 3, reasoning: 'Reasonable but may miss important perspectives' },
      { text: 'Bring sources together to resolve discrepancies', score: 5, reasoning: 'Collaborative approach that seeks truth and alignment' },
      { text: 'Escalate to higher authority for resolution', score: 3, reasoning: 'May be necessary but should try direct resolution first' },
      { text: 'Use your best judgment to decide', score: 2, reasoning: 'May lead to decisions based on incomplete information' }
    ]
  },
  {
    competencyArea: 'communication',
    scenario: 'Your project involves team members across different time zones',
    question: 'How do you ensure effective communication?',
    options: [
      { text: 'Schedule all meetings in your local time zone', score: 1, reasoning: 'Unfair burden on remote team members' },
      { text: 'Rotate meeting times to share the inconvenience', score: 4, reasoning: 'Fair approach but may not be most efficient' },
      { text: 'Use asynchronous communication tools and documentation', score: 5, reasoning: 'Inclusive approach that works across time zones' },
      { text: 'Have separate meetings for each time zone', score: 3, reasoning: 'May work but could create information silos' }
    ]
  },
  {
    competencyArea: 'communication',
    scenario: 'A team member consistently misses important information in communications',
    question: 'How do you address this issue?',
    options: [
      { text: 'Send them separate, simplified messages', score: 3, reasoning: 'Accommodating but may not address root cause' },
      { text: 'Understand their communication preferences and adapt', score: 5, reasoning: 'Tailored approach that addresses individual needs' },
      { text: 'CC their manager on important communications', score: 2, reasoning: 'May solve immediate problem but could damage trust' },
      { text: 'Document that they received the information', score: 2, reasoning: 'Covers liability but doesn\'t ensure understanding' }
    ]
  },
  {
    competencyArea: 'communication',
    scenario: 'You need to explain technical concepts to non-technical stakeholders',
    question: 'What\'s your communication strategy?',
    options: [
      { text: 'Use industry standard technical terminology', score: 1, reasoning: 'May confuse or alienate non-technical audience' },
      { text: 'Use analogies and visual aids to simplify concepts', score: 5, reasoning: 'Effective approach that makes complex ideas accessible' },
      { text: 'Have technical team members explain directly', score: 3, reasoning: 'Leverages expertise but they may not be good communicators' },
      { text: 'Provide written technical documentation', score: 2, reasoning: 'May be too complex for non-technical stakeholders' }
    ]
  },
  {
    competencyArea: 'communication',
    scenario: 'Your project communication is generating too many emails and causing confusion',
    question: 'How do you improve communication effectiveness?',
    options: [
      { text: 'Reduce frequency of communications', score: 2, reasoning: 'May solve volume but could miss important information' },
      { text: 'Establish communication protocols and use collaboration tools', score: 5, reasoning: 'Systematic approach that improves quality and reduces noise' },
      { text: 'Ask people to only send essential emails', score: 3, reasoning: 'May help but lacks structure for what\'s essential' },
      { text: 'Switch to verbal communication only', score: 2, reasoning: 'May improve clarity but loses documentation benefits' }
    ]
  }
]);

// Helper functions
const getCompetencyName = (area) => {
  const names = {
    'planning': 'Project Planning',
    'leadership': 'Team Leadership',
    'risk': 'Risk Management',
    'stakeholder': 'Stakeholder Management',
    'communication': 'Communication & Quality'
  };
  return names[area] || area;
};

const getCurrentCompetencyArea = () => {
  if (currentQuestion.value < questions.value.length) {
    return getCompetencyName(questions.value[currentQuestion.value].competencyArea);
  }
  return '';
};

const selectAnswer = (option) => {
  selectedAnswer.value = option;
};

const nextQuestion = async () => {
  if (!selectedAnswer.value) return;

  // Store response
  responses.value.push({
    question: currentQuestion.value,
    scenario: questions.value[currentQuestion.value].scenario,
    competencyArea: questions.value[currentQuestion.value].competencyArea,
    selectedOption: selectedAnswer.value,
    score: selectedAnswer.value.score
  });

  // Complete assessment
  if (currentQuestion.value === questions.value.length - 1) {
    assessmentComplete.value = true;
    await calculateResults();
    await saveAssessment();
  } else {
    // Next question
    currentQuestion.value++;
    selectedAnswer.value = null;
  }
};

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--;
    const previousResponse = responses.value.pop();
    if (previousResponse) {
      selectedAnswer.value = previousResponse.selectedOption;
    }
  }
};

const calculateResults = async () => {
  // Calculate scores for each competency area
  const competencyAreas = {
    planning: { total: 0, count: 0 },
    leadership: { total: 0, count: 0 },
    risk: { total: 0, count: 0 },
    stakeholder: { total: 0, count: 0 },
    communication: { total: 0, count: 0 }
  };

  // Sum scores for each competency area
  responses.value.forEach(response => {
    competencyAreas[response.competencyArea].total += response.score;
    competencyAreas[response.competencyArea].count += 1;
  });

  // Calculate percentages and feedback
  const competencyResults = {};
  for (const [key, data] of Object.entries(competencyAreas)) {
    const average = data.total / data.count;
    const percentage = Math.round((average / 5) * 100);
    
    competencyResults[key] = {
      score: percentage,
      level: getCompetencyLevel(percentage),
      description: getCompetencyDescription(key),
      feedback: getCompetencyFeedback(key, percentage)
    };
  }

  // Calculate overall score
  const totalScore = Object.values(competencyResults).reduce((sum, competency) => sum + competency.score, 0);
  const overallScore = Math.round(totalScore / Object.keys(competencyResults).length);

  // Generate recommendations and certifications
  const recommendations = generateRecommendations(competencyResults);
  const certifications = getCertificationSuggestions(overallScore, competencyResults);

  results.value = {
    overallScore: overallScore,
    competencyAreas: competencyResults,
    recommendations: recommendations,
    certifications: certifications,
    completedAt: new Date().toISOString()
  };
};

const getCompetencyLevel = (percentage) => {
  if (percentage >= 90) return 'Expert';
  if (percentage >= 80) return 'Advanced';
  if (percentage >= 70) return 'Proficient';
  if (percentage >= 60) return 'Developing';
  return 'Novice';
};

const getCompetencyDescription = (area) => {
  const descriptions = {
    'planning': 'Creating comprehensive project plans and managing scope',
    'leadership': 'Leading teams and managing performance effectively',
    'risk': 'Identifying, assessing, and mitigating project risks',
    'stakeholder': 'Managing relationships and communication with stakeholders',
    'communication': 'Ensuring clear, effective project communication'
  };
  return descriptions[area];
};

const getCompetencyFeedback = (area, percentage) => {
  const feedback = {
    'planning': {
      high: 'You excel at strategic planning and scope management',
      low: 'Focus on developing structured planning and change control processes'
    },
    'leadership': {
      high: 'You demonstrate strong leadership and team management skills',
      low: 'Work on building trust, motivation, and conflict resolution skills'
    },
    'risk': {
      high: 'You effectively identify and manage project risks',
      low: 'Develop systematic approaches to risk identification and mitigation'
    },
    'stakeholder': {
      high: 'You manage stakeholder relationships and expectations well',
      low: 'Focus on stakeholder analysis and tailored communication strategies'
    },
    'communication': {
      high: 'You communicate clearly and manage information effectively',
      low: 'Work on adapting communication style to different audiences'
    }
  };
  return feedback[area][percentage >= 70 ? 'high' : 'low'];
};

const generateRecommendations = (competencyResults) => {
  // Find lowest scoring areas for targeted recommendations
  const sortedCompetencies = Object.entries(competencyResults)
    .sort(([,a], [,b]) => a.score - b.score);

  const recommendations = [];
  
  // Add recommendations for lowest scoring areas
  for (let i = 0; i < Math.min(3, sortedCompetencies.length); i++) {
    const [competencyArea, competencyData] = sortedCompetencies[i];
    recommendations.push({
      area: getCompetencyName(competencyArea),
      suggestion: getRecommendation(competencyArea, competencyData.score)
    });
  }

  return recommendations;
};

const getRecommendation = (area, score) => {
  const recommendations = {
    'planning': score < 70 ? 
      'Study PMI PMBOK Guide and practice creating detailed project plans with risk assessments' :
      'Explore advanced planning techniques like critical chain and agile hybrid approaches',
    'leadership': score < 70 ?
      'Take leadership courses and practice giving constructive feedback and motivating teams' :
      'Develop executive presence and strategic leadership capabilities',
    'risk': score < 70 ?
      'Learn structured risk management frameworks and practice risk assessment techniques' :
      'Study enterprise risk management and develop risk management expertise',
    'stakeholder': score < 70 ?
      'Practice stakeholder mapping and develop tailored communication strategies' :
      'Focus on advanced negotiation and influence techniques',
    'communication': score < 70 ?
      'Work on adapting communication style and using visual aids for complex information' :
      'Develop executive communication and presentation skills'
  };
  return recommendations[area];
};

const getCertificationSuggestions = (overallScore, competencyResults) => {
  const certifications = [];
  
  if (overallScore >= 70) {
    certifications.push({
      name: 'PMP (Project Management Professional)',
      provider: 'PMI',
      reason: 'Your strong overall competency makes you a good candidate for PMP certification'
    });
  } else {
    certifications.push({
      name: 'CAPM (Certified Associate in Project Management)',
      provider: 'PMI', 
      reason: 'Build foundational PM knowledge before pursuing advanced certifications'
    });
  }

  if (competencyResults.risk?.score >= 75) {
    certifications.push({
      name: 'PMI-RMP (Risk Management Professional)',
      provider: 'PMI',
      reason: 'Your strong risk management skills align well with this specialization'
    });
  }

  if (competencyResults.leadership?.score >= 75) {
    certifications.push({
      name: 'Certified ScrumMaster (CSM)',
      provider: 'Scrum Alliance',
      reason: 'Your leadership skills would benefit agile project management'
    });
  }

  if (overallScore >= 85) {
    certifications.push({
      name: 'PgMP (Program Management Professional)',
      provider: 'PMI',
      reason: 'Your advanced skills suggest readiness for program-level management'
    });
  }

  return certifications;
};

const saveAssessment = async () => {
  if (!user.value || !results.value) return;

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'project_management',
      test_variant_id: 'project_management_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: null, // Not applicable for competency tests
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'skills',
      completed_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error saving assessment:', error);
    } else {
      console.log('Project management assessment saved successfully');
    }
  } catch (error) {
    console.error('Failed to save assessment:', error);
  }
};

const retakeTest = () => {
  currentQuestion.value = 0;
  selectedAnswer.value = null;
  responses.value = [];
  assessmentComplete.value = false;
  results.value = null;
};

const logout = async () => {
  await supabase.auth.signOut();
  await navigateTo('/');
};

// Shuffle questions to avoid order effects
onMounted(() => {
  questions.value = questions.value.sort(() => Math.random() - 0.5);
});

useHead({
  title: 'Project Management Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Assess your project management competencies across planning, leadership, risk management, stakeholder management, and communication.' }
  ]
});
</script>