<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink :to="$localePath('/')" class="text-xl font-bold text-gray-900">
              ← Assessment Platform
            </NuxtLink>
            <h1 class="text-xl font-bold text-green-600">
              Communication Skills Assessment
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
            class="bg-green-600 h-3 rounded-full transition-all duration-300"
            :style="{
              width: `${(currentQuestion / questions.length) * 100}%`,
            }"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span>Progress: {{ Math.round((currentQuestion / questions.length) * 100) }}%</span>
          <span>Area: {{ getCurrentSkillArea() }}</span>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">💬</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Assessment Complete!
          </h2>
          <div class="text-lg text-gray-600">
            Your communication skills profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Overall Score -->
          <div class="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
            <div class="text-4xl font-bold text-green-600 mb-2">{{ results.overallScore }}%</div>
            <div class="text-lg font-semibold text-gray-800">Overall Communication Effectiveness</div>
            <div class="text-green-700">{{ getScoreLevel(results.overallScore) }}</div>
          </div>

          <!-- Skill Areas Breakdown -->
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(area, key) in results.skillAreas" 
              :key="key"
              class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-green-800">{{ getSkillAreaName(key) }}</h3>
                <div class="text-2xl font-bold text-green-600">{{ area.score }}%</div>
              </div>
              
              <!-- Progress bar for this skill area -->
              <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  class="bg-green-600 h-3 rounded-full transition-all duration-1000"
                  :style="{ width: `${area.score}%` }"
                ></div>
              </div>
              
              <p class="text-green-700 text-sm mb-2">{{ area.description }}</p>
              <div class="text-xs text-green-600">
                <strong>{{ area.level }}:</strong> {{ area.feedback }}
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div class="bg-white rounded-xl p-6 border-2 border-green-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">💡 Your Development Plan</h3>
            <div class="space-y-4">
              <div 
                v-for="(recommendation, index) in results.recommendations" 
                :key="index"
                class="border-l-4 border-green-500 pl-4 py-2"
              >
                <div class="font-semibold text-gray-800">{{ recommendation.area }}</div>
                <div class="text-gray-600 text-sm">{{ recommendation.suggestion }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <NuxtLink
              :to="$localePath('/profile')"
              class="flex-1 bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
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
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Analyzing your communication skills...</p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
              {{ getCurrentSkillArea() }}
            </div>
            <div class="text-sm text-gray-500">
              Scenario {{ currentQuestion + 1 }} of {{ questions.length }}
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ questions[currentQuestion]?.scenario }}
          </h2>
          
          <div class="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
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
              'bg-green-600 text-white border-green-600': selectedAnswer === option,
              'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300': selectedAnswer !== option
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
              'bg-green-600 text-white hover:bg-green-700': selectedAnswer,
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

// Communication scenarios and questions
const questions = ref([
  // Verbal Communication (6 questions)
  {
    skillArea: 'verbal',
    scenario: 'You need to present a complex project update to senior executives',
    question: 'How do you structure your presentation to ensure clarity and engagement?',
    options: [
      { text: 'Start with detailed technical specifications', score: 2, reasoning: 'May overwhelm audience with unnecessary details' },
      { text: 'Begin with key outcomes, then provide supporting details', score: 5, reasoning: 'Executive-friendly approach focusing on impact first' },
      { text: 'Present chronologically from project start to finish', score: 3, reasoning: 'Logical but may lose audience attention' },
      { text: 'Jump straight to problems and solutions', score: 4, reasoning: 'Action-oriented but lacks context' }
    ]
  },
  {
    skillArea: 'verbal',
    scenario: 'A colleague interrupts you frequently during team meetings',
    question: 'What is the most professional way to address this behavior?',
    options: [
      { text: 'Interrupt them back to assert dominance', score: 1, reasoning: 'Escalates conflict and unprofessional' },
      { text: 'Speak privately with them after the meeting', score: 5, reasoning: 'Respectful approach that addresses the issue directly' },
      { text: 'Ignore it and continue speaking louder', score: 2, reasoning: 'Avoids confrontation but doesn\'t solve the problem' },
      { text: 'Ask the meeting facilitator to intervene', score: 4, reasoning: 'Appropriate but could be seen as escalating' }
    ]
  },
  {
    skillArea: 'verbal',
    scenario: 'You need to explain a technical concept to non-technical stakeholders',
    question: 'Which approach would be most effective?',
    options: [
      { text: 'Use industry jargon to sound professional', score: 1, reasoning: 'Creates barriers and confusion' },
      { text: 'Use analogies and simple language', score: 5, reasoning: 'Makes complex ideas accessible and relatable' },
      { text: 'Provide detailed technical documentation', score: 2, reasoning: 'May overwhelm non-technical audience' },
      { text: 'Ask them to research the topic first', score: 1, reasoning: 'Shifts responsibility and may seem unhelpful' }
    ]
  },
  {
    skillArea: 'verbal',
    scenario: 'During a heated discussion, emotions are running high',
    question: 'How do you help de-escalate the situation?',
    options: [
      { text: 'Raise your voice to match the energy', score: 1, reasoning: 'Escalates rather than resolves conflict' },
      { text: 'Remain calm and acknowledge everyone\'s concerns', score: 5, reasoning: 'Professional approach that validates feelings while maintaining control' },
      { text: 'Change the subject immediately', score: 3, reasoning: 'Avoids conflict but doesn\'t address underlying issues' },
      { text: 'Leave the room until things calm down', score: 2, reasoning: 'Safe but may seem unprofessional or dismissive' }
    ]
  },
  {
    skillArea: 'verbal',
    scenario: 'You\'re asked to give an impromptu speech at a company event',
    question: 'What\'s your best strategy for delivering an effective message?',
    options: [
      { text: 'Decline politely as you\'re unprepared', score: 2, reasoning: 'Safe but misses opportunity to demonstrate leadership' },
      { text: 'Wing it and hope for the best', score: 1, reasoning: 'Risky and potentially unprofessional' },
      { text: 'Take a moment to organize key points, then speak confidently', score: 5, reasoning: 'Shows composure and organizational skills under pressure' },
      { text: 'Keep it very brief to minimize mistakes', score: 3, reasoning: 'Safe approach but may seem unprepared' }
    ]
  },
  {
    skillArea: 'verbal',
    scenario: 'You need to deliver constructive feedback to an underperforming team member',
    question: 'How do you frame the conversation to be most effective?',
    options: [
      { text: 'Focus on their personal shortcomings', score: 1, reasoning: 'Attacks the person rather than addressing behaviors' },
      { text: 'Use the "feedback sandwich" approach', score: 4, reasoning: 'Structured approach but can dilute important messages' },
      { text: 'Focus on specific behaviors and their impact', score: 5, reasoning: 'Direct, actionable, and professional approach' },
      { text: 'Give feedback in front of the team', score: 1, reasoning: 'Public criticism damages relationships and morale' }
    ]
  },

  // Written Communication (6 questions)
  {
    skillArea: 'written',
    scenario: 'You need to write an important email to a client about a project delay',
    question: 'What\'s the best approach for structuring this difficult message?',
    options: [
      { text: 'Bury the bad news in the middle of a long email', score: 2, reasoning: 'Lacks transparency and may frustrate the client' },
      { text: 'Lead with the delay and immediately offer solutions', score: 5, reasoning: 'Direct, honest, and solution-focused approach' },
      { text: 'Blame external factors beyond your control', score: 1, reasoning: 'Shifts responsibility and damages credibility' },
      { text: 'Minimize the impact and downplay the delay', score: 2, reasoning: 'May lead to unrealistic expectations' }
    ]
  },
  {
    skillArea: 'written',
    scenario: 'You\'re writing a proposal that needs to persuade stakeholders',
    question: 'Which writing strategy would be most compelling?',
    options: [
      { text: 'Use complex language to sound intelligent', score: 1, reasoning: 'May confuse readers and obscure key points' },
      { text: 'Focus on features rather than benefits', score: 2, reasoning: 'Doesn\'t connect to stakeholder needs' },
      { text: 'Lead with clear benefits and supporting evidence', score: 5, reasoning: 'Connects with audience needs and builds credible case' },
      { text: 'Include every possible detail', score: 2, reasoning: 'May overwhelm readers with information' }
    ]
  },
  {
    skillArea: 'written',
    scenario: 'You receive an angry email from a customer',
    question: 'How should you respond in writing?',
    options: [
      { text: 'Match their emotional tone to show you understand', score: 2, reasoning: 'May escalate the situation rather than resolve it' },
      { text: 'Respond immediately while emotions are high', score: 1, reasoning: 'Rushed responses often lack thoughtfulness' },
      { text: 'Wait a day before responding to cool down', score: 3, reasoning: 'Gives time to think but may seem unresponsive' },
      { text: 'Acknowledge their concerns professionally and offer solutions', score: 5, reasoning: 'Professional approach that addresses issues constructively' }
    ]
  },
  {
    skillArea: 'written',
    scenario: 'You need to write documentation for a complex process',
    question: 'What\'s the most effective way to organize the information?',
    options: [
      { text: 'Write it as you think of things', score: 1, reasoning: 'Lacks structure and may confuse users' },
      { text: 'Use clear headings, bullet points, and step-by-step instructions', score: 5, reasoning: 'Organized, scannable, and user-friendly format' },
      { text: 'Write in paragraph form to provide context', score: 2, reasoning: 'May be hard to follow for procedural information' },
      { text: 'Include only the essential steps', score: 3, reasoning: 'Concise but may lack necessary detail' }
    ]
  },
  {
    skillArea: 'written',
    scenario: 'You\'re collaborating on a document with multiple team members',
    question: 'How do you ensure effective written collaboration?',
    options: [
      { text: 'Each person writes their section independently', score: 2, reasoning: 'May result in inconsistent tone and structure' },
      { text: 'Establish style guidelines and review process upfront', score: 5, reasoning: 'Ensures consistency and quality throughout' },
      { text: 'Let the most senior person review everything', score: 3, reasoning: 'Creates bottleneck and limits input' },
      { text: 'Combine all sections without review', score: 1, reasoning: 'Likely to result in inconsistent, lower-quality document' }
    ]
  },
  {
    skillArea: 'written',
    scenario: 'You need to write a status update for multiple audiences',
    question: 'How do you tailor your message effectively?',
    options: [
      { text: 'Write one version with all details for everyone', score: 2, reasoning: 'One-size-fits-all approach may not meet specific needs' },
      { text: 'Create targeted versions for different audience needs', score: 5, reasoning: 'Tailored communication is more effective and relevant' },
      { text: 'Write the most basic version possible', score: 2, reasoning: 'May lack necessary detail for some audiences' },
      { text: 'Let each audience ask questions if they need more info', score: 3, reasoning: 'Puts burden on audience rather than being proactive' }
    ]
  },

  // Listening Skills (6 questions)
  {
    skillArea: 'listening',
    scenario: 'During a one-on-one meeting, your direct report seems frustrated',
    question: 'What\'s the best way to demonstrate active listening?',
    options: [
      { text: 'Immediately offer solutions to their problems', score: 2, reasoning: 'Jumps to solutions before fully understanding the issue' },
      { text: 'Paraphrase what you heard and ask clarifying questions', score: 5, reasoning: 'Shows genuine attention and ensures understanding' },
      { text: 'Nod and say "I understand" frequently', score: 3, reasoning: 'Shows engagement but may be superficial' },
      { text: 'Share a similar experience you\'ve had', score: 2, reasoning: 'Shifts focus away from their concerns' }
    ]
  },
  {
    skillArea: 'listening',
    scenario: 'In a brainstorming session, team members are sharing creative ideas',
    question: 'How do you show you\'re actively listening to build on their ideas?',
    options: [
      { text: 'Wait for them to finish, then share your own ideas', score: 2, reasoning: 'Doesn\'t build on their contributions' },
      { text: 'Interrupt with improvements to their ideas', score: 1, reasoning: 'Disruptive and may shut down creativity' },
      { text: 'Ask questions that help them develop their ideas further', score: 5, reasoning: 'Collaborative approach that shows engagement and builds ideas' },
      { text: 'Take notes silently without responding', score: 3, reasoning: 'Shows attention but lacks engagement' }
    ]
  },
  {
    skillArea: 'listening',
    scenario: 'A colleague is explaining a complex technical issue',
    question: 'When you don\'t understand something, what\'s the best approach?',
    options: [
      { text: 'Pretend to understand to avoid seeming ignorant', score: 1, reasoning: 'Leads to miscommunication and poor decisions' },
      { text: 'Ask for clarification at specific points', score: 5, reasoning: 'Shows engagement and ensures accurate understanding' },
      { text: 'Wait until the end to ask all your questions', score: 3, reasoning: 'May lose context and make conversation less natural' },
      { text: 'Look it up later rather than interrupting', score: 2, reasoning: 'Shows respect but may miss important nuances' }
    ]
  },
  {
    skillArea: 'listening',
    scenario: 'During a client meeting, they express concerns about your team\'s work',
    question: 'How do you respond to show you\'re truly listening to their concerns?',
    options: [
      { text: 'Defend your team\'s work immediately', score: 1, reasoning: 'Defensive response that shuts down dialogue' },
      { text: 'Ask them to elaborate on their specific concerns', score: 5, reasoning: 'Shows genuine interest in understanding their perspective' },
      { text: 'Acknowledge their concerns but change the subject', score: 2, reasoning: 'Superficial acknowledgment without engagement' },
      { text: 'Promise to fix everything right away', score: 2, reasoning: 'May be premature without fully understanding the issues' }
    ]
  },
  {
    skillArea: 'listening',
    scenario: 'Your manager is giving you feedback about your performance',
    question: 'What\'s the most effective way to receive this feedback?',
    options: [
      { text: 'Take notes and ask questions for clarification', score: 5, reasoning: 'Shows respect and commitment to improvement' },
      { text: 'Explain the reasons behind your actions', score: 3, reasoning: 'Providing context is good but may seem defensive' },
      { text: 'Listen silently without responding', score: 3, reasoning: 'Shows respect but misses opportunity for dialogue' },
      { text: 'Point out what you\'ve done well', score: 2, reasoning: 'May seem defensive and detract from learning' }
    ]
  },
  {
    skillArea: 'listening',
    scenario: 'In a team meeting, there\'s disagreement between team members',
    question: 'How can you use listening skills to help resolve the conflict?',
    options: [
      { text: 'Take sides with the person you think is right', score: 1, reasoning: 'Escalates conflict rather than resolving it' },
      { text: 'Summarize each person\'s position to ensure understanding', score: 5, reasoning: 'Neutral approach that promotes understanding and resolution' },
      { text: 'Ignore the conflict and continue with the agenda', score: 1, reasoning: 'Avoids the issue but doesn\'t resolve underlying problems' },
      { text: 'Suggest they discuss it offline', score: 3, reasoning: 'Appropriate sometimes but may miss opportunity for team learning' }
    ]
  },

  // Non-verbal Communication (6 questions)
  {
    skillArea: 'nonverbal',
    scenario: 'You\'re presenting to a room full of skeptical stakeholders',
    question: 'How do you use body language to build credibility and engagement?',
    options: [
      { text: 'Keep your arms crossed to show you\'re serious', score: 1, reasoning: 'Closed body language can seem defensive or unapproachable' },
      { text: 'Stand tall, make eye contact, and use open gestures', score: 5, reasoning: 'Confident, open body language builds trust and engagement' },
      { text: 'Stay seated to appear less threatening', score: 2, reasoning: 'May reduce your presence and authority' },
      { text: 'Point frequently to emphasize key points', score: 2, reasoning: 'Pointing can seem aggressive or confrontational' }
    ]
  },
  {
    skillArea: 'nonverbal',
    scenario: 'During a difficult conversation, the other person seems upset',
    question: 'How should you adjust your non-verbal communication?',
    options: [
      { text: 'Mirror their emotional state to show empathy', score: 3, reasoning: 'Can show understanding but may escalate emotions' },
      { text: 'Maintain calm, open body language while showing concern', score: 5, reasoning: 'Provides stability while demonstrating care and attention' },
      { text: 'Lean back to give them space', score: 4, reasoning: 'Respectful but may seem disengaged' },
      { text: 'Avoid eye contact to reduce pressure', score: 2, reasoning: 'May seem disinterested or uncomfortable' }
    ]
  },
  {
    skillArea: 'nonverbal',
    scenario: 'You notice a team member seems disengaged in meetings',
    question: 'What non-verbal cues might indicate their disengagement?',
    options: [
      { text: 'They\'re taking detailed notes', score: 2, reasoning: 'Note-taking usually indicates engagement, not disengagement' },
      { text: 'They avoid eye contact and check their phone frequently', score: 5, reasoning: 'Classic signs of disengagement and distraction' },
      { text: 'They sit up straight and lean forward', score: 1, reasoning: 'These are signs of engagement and interest' },
      { text: 'They nod frequently during discussions', score: 2, reasoning: 'Nodding typically indicates attention and agreement' }
    ]
  },
  {
    skillArea: 'nonverbal',
    scenario: 'You\'re in a video conference with remote team members',
    question: 'How do you ensure effective non-verbal communication on camera?',
    options: [
      { text: 'Look at the screen to see other participants', score: 3, reasoning: 'Natural but doesn\'t create eye contact for others' },
      { text: 'Look directly at the camera when speaking to simulate eye contact', score: 5, reasoning: 'Creates connection and engagement for remote participants' },
      { text: 'Turn off your camera to avoid distractions', score: 1, reasoning: 'Eliminates important non-verbal communication entirely' },
      { text: 'Keep your video small so you can focus on others', score: 3, reasoning: 'Good for focus but may reduce your presence' }
    ]
  },
  {
    skillArea: 'nonverbal',
    scenario: 'You\'re meeting someone from a different cultural background',
    question: 'How do you adapt your non-verbal communication appropriately?',
    options: [
      { text: 'Use the same approach you use with everyone', score: 2, reasoning: 'Ignores cultural differences that may be important' },
      { text: 'Research their cultural norms and adapt accordingly', score: 5, reasoning: 'Shows respect and cultural awareness' },
      { text: 'Exaggerate your gestures to overcome language barriers', score: 1, reasoning: 'May seem patronizing or offensive' },
      { text: 'Minimize all non-verbal communication to be safe', score: 2, reasoning: 'Overly cautious and may seem cold or disengaged' }
    ]
  },
  {
    skillArea: 'nonverbal',
    scenario: 'You\'re giving feedback to someone who seems defensive',
    question: 'How can you use non-verbal cues to create a more supportive environment?',
    options: [
      { text: 'Sit across from them at a desk to maintain authority', score: 2, reasoning: 'Creates formal barrier that may increase defensiveness' },
      { text: 'Sit at an angle or side-by-side to reduce confrontation', score: 5, reasoning: 'Collaborative positioning that reduces defensive reactions' },
      { text: 'Stand while they sit to show you\'re in charge', score: 1, reasoning: 'Power imbalance that will likely increase defensiveness' },
      { text: 'Avoid looking at them directly to reduce pressure', score: 2, reasoning: 'May seem disengaged or uncomfortable with the conversation' }
    ]
  },

  // Conflict Resolution (6 questions)
  {
    skillArea: 'conflict',
    scenario: 'Two team members have a heated disagreement about project direction',
    question: 'What\'s your first step in helping resolve this conflict?',
    options: [
      { text: 'Immediately decide who is right and support them', score: 1, reasoning: 'Takes sides without understanding all perspectives' },
      { text: 'Listen to both sides separately to understand their concerns', score: 5, reasoning: 'Neutral fact-finding approach that builds understanding' },
      { text: 'Tell them to work it out themselves', score: 2, reasoning: 'Avoids involvement but may not resolve underlying issues' },
      { text: 'Implement your own solution to end the conflict', score: 2, reasoning: 'Quick but doesn\'t address root causes or buy-in' }
    ]
  },
  {
    skillArea: 'conflict',
    scenario: 'A client is upset about missed deadlines and is raising their voice',
    question: 'How do you de-escalate this situation?',
    options: [
      { text: 'Raise your voice to match their energy and take control', score: 1, reasoning: 'Escalates rather than resolves the conflict' },
      { text: 'Remain calm, acknowledge their frustration, and focus on solutions', score: 5, reasoning: 'Professional approach that validates feelings while moving toward resolution' },
      { text: 'End the meeting and reschedule when they\'ve calmed down', score: 2, reasoning: 'Avoids immediate conflict but may seem dismissive' },
      { text: 'Explain all the reasons why the delays weren\'t your fault', score: 2, reasoning: 'Defensive response that doesn\'t address their concerns' }
    ]
  },
  {
    skillArea: 'conflict',
    scenario: 'There\'s tension between two departments over resource allocation',
    question: 'What approach would be most effective for resolving this conflict?',
    options: [
      { text: 'Let senior management make the decision', score: 3, reasoning: 'Appropriate escalation but misses opportunity for collaborative solution' },
      { text: 'Facilitate a discussion to find mutually beneficial solutions', score: 5, reasoning: 'Collaborative approach that addresses both parties\' needs' },
      { text: 'Allocate resources equally between departments', score: 3, reasoning: 'Fair but may not be the most effective solution' },
      { text: 'Give resources to whoever asks first', score: 1, reasoning: 'Arbitrary decision that doesn\'t consider actual needs' }
    ]
  },
  {
    skillArea: 'conflict',
    scenario: 'You receive criticism about your work in front of the entire team',
    question: 'How do you respond to maintain professionalism and address the issue?',
    options: [
      { text: 'Defend your work immediately and publicly', score: 2, reasoning: 'May seem defensive and escalate the situation' },
      { text: 'Thank them for the feedback and suggest discussing details privately', score: 5, reasoning: 'Professional response that acknowledges feedback while managing the setting' },
      { text: 'Stay silent and address it later', score: 3, reasoning: 'Avoids escalation but may seem unresponsive' },
      { text: 'Point out their mistakes in return', score: 1, reasoning: 'Retaliatory response that will escalate conflict' }
    ]
  },
  {
    skillArea: 'conflict',
    scenario: 'You disagree with your manager\'s decision on an important project',
    question: 'What\'s the most appropriate way to handle this disagreement?',
    options: [
      { text: 'Comply without expressing your concerns', score: 2, reasoning: 'Avoids conflict but misses opportunity to share valuable perspective' },
      { text: 'Schedule a private meeting to discuss your concerns respectfully', score: 5, reasoning: 'Professional approach that respects hierarchy while advocating for your position' },
      { text: 'Express your disagreement publicly in the next team meeting', score: 1, reasoning: 'Undermines manager\'s authority and creates public conflict' },
      { text: 'Go around your manager to their supervisor', score: 1, reasoning: 'Escalates inappropriately and damages trust' }
    ]
  },
  {
    skillArea: 'conflict',
    scenario: 'A project team is stuck because of conflicting priorities from different stakeholders',
    question: 'How do you help resolve these competing demands?',
    options: [
      { text: 'Choose the priority from the most senior stakeholder', score: 3, reasoning: 'Respects hierarchy but may not be the best business decision' },
      { text: 'Organize a stakeholder meeting to align on shared objectives', score: 5, reasoning: 'Collaborative approach that seeks win-win solutions' },
      { text: 'Try to satisfy all priorities simultaneously', score: 2, reasoning: 'May result in diluted effort and poor outcomes' },
      { text: 'Let the team decide which priority to focus on', score: 3, reasoning: 'Empowers team but may not have enough context for decision' }
    ]
  }
]);

// Helper functions
const getSkillAreaName = (area) => {
  const names = {
    'verbal': 'Verbal Communication',
    'written': 'Written Communication',
    'listening': 'Active Listening',
    'nonverbal': 'Non-verbal Communication',
    'conflict': 'Conflict Resolution'
  };
  return names[area] || area;
};

const getCurrentSkillArea = () => {
  if (currentQuestion.value < questions.value.length) {
    return getSkillAreaName(questions.value[currentQuestion.value].skillArea);
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
    skillArea: questions.value[currentQuestion.value].skillArea,
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
  // Calculate scores for each skill area
  const skillAreas = {
    verbal: { total: 0, count: 0 },
    written: { total: 0, count: 0 },
    listening: { total: 0, count: 0 },
    nonverbal: { total: 0, count: 0 },
    conflict: { total: 0, count: 0 }
  };

  // Sum scores for each skill area
  responses.value.forEach(response => {
    skillAreas[response.skillArea].total += response.score;
    skillAreas[response.skillArea].count += 1;
  });

  // Calculate percentages and feedback
  const skillResults = {};
  for (const [key, data] of Object.entries(skillAreas)) {
    const average = data.total / data.count;
    const percentage = Math.round((average / 5) * 100);
    
    skillResults[key] = {
      score: percentage,
      level: getScoreLevel(percentage),
      description: getSkillAreaDescription(key),
      feedback: getSkillFeedback(key, percentage)
    };
  }

  // Calculate overall score
  const totalScore = Object.values(skillResults).reduce((sum, skill) => sum + skill.score, 0);
  const overallScore = Math.round(totalScore / Object.keys(skillResults).length);

  // Generate recommendations
  const recommendations = generateRecommendations(skillResults);

  results.value = {
    overallScore: overallScore,
    skillAreas: skillResults,
    recommendations: recommendations,
    completedAt: new Date().toISOString()
  };
};

const getScoreLevel = (percentage) => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Very Good';
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Fair';
  return 'Needs Improvement';
};

const getSkillAreaDescription = (area) => {
  const descriptions = {
    'verbal': 'Speaking clearly and persuasively in various contexts',
    'written': 'Writing effectively for different audiences and purposes',
    'listening': 'Understanding and responding appropriately to others',
    'nonverbal': 'Using body language and visual cues effectively',
    'conflict': 'Managing disagreements and finding collaborative solutions'
  };
  return descriptions[area];
};

const getSkillFeedback = (area, percentage) => {
  const feedback = {
    'verbal': {
      high: 'You communicate verbally with confidence and clarity',
      low: 'Focus on structuring your verbal communication and engaging your audience'
    },
    'written': {
      high: 'Your written communication is clear, professional, and effective',
      low: 'Work on organizing your thoughts and tailoring your writing to your audience'
    },
    'listening': {
      high: 'You demonstrate excellent active listening and engagement skills',
      low: 'Practice giving full attention and asking clarifying questions'
    },
    'nonverbal': {
      high: 'You effectively use body language to reinforce your communication',
      low: 'Be more aware of your body language and its impact on others'
    },
    'conflict': {
      high: 'You handle conflicts professionally and find collaborative solutions',
      low: 'Work on remaining calm and focusing on mutual understanding during conflicts'
    }
  };
  return feedback[area][percentage >= 70 ? 'high' : 'low'];
};

const generateRecommendations = (skillResults) => {
  // Find lowest scoring areas for targeted recommendations
  const sortedSkills = Object.entries(skillResults)
    .sort(([,a], [,b]) => a.score - b.score);

  const recommendations = [];
  
  // Add recommendations for lowest scoring areas
  for (let i = 0; i < Math.min(3, sortedSkills.length); i++) {
    const [skillArea, skillData] = sortedSkills[i];
    recommendations.push({
      area: getSkillAreaName(skillArea),
      suggestion: getRecommendation(skillArea, skillData.score)
    });
  }

  return recommendations;
};

const getRecommendation = (area, score) => {
  const recommendations = {
    'verbal': score < 70 ? 
      'Practice structuring presentations with clear opening, body, and conclusion. Record yourself to improve delivery.' :
      'Continue developing your storytelling abilities and practice handling difficult questions.',
    'written': score < 70 ?
      'Focus on writing concisely and using active voice. Practice tailoring your message to different audiences.' :
      'Develop advanced writing skills like persuasive techniques and complex document collaboration.',
    'listening': score < 70 ?
      'Practice paraphrasing what others say and asking open-ended questions to show engagement.' :
      'Develop your ability to listen for underlying emotions and unspoken concerns.',
    'nonverbal': score < 70 ?
      'Work on maintaining appropriate eye contact and using open body language in professional settings.' :
      'Refine your ability to read others\' non-verbal cues and adapt your style accordingly.',
    'conflict': score < 70 ?
      'Focus on staying calm and finding common ground. Practice separating people from problems.' :
      'Develop skills in mediating conflicts between others and facilitating difficult conversations.'
  };
  return recommendations[area];
};

const saveAssessment = async () => {
  if (!user.value || !results.value) return;

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'communication_skills',
      test_variant_id: 'communication_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: null, // Not applicable for skills tests
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'skills',
      completed_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error saving assessment:', error);
    } else {
      console.log('Communication skills assessment saved successfully');
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
  title: 'Communication Skills Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Evaluate your communication effectiveness across verbal, written, listening, non-verbal, and conflict resolution skills.' }
  ]
});
</script>