<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="!showResults" class="space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Implicit Bias Awareness Assessment
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Exploring unconscious biases across various social dimensions
        </p>
        <div class="mb-6">
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{width: progressPercentage + '%'}"></div>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {{ currentQuestionIndex + 1 }} of {{ totalQuestions }} questions ({{ Math.round(progressPercentage) }}%)
          </p>
        </div>
      </div>

      <div v-if="showInstructions" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Assessment Instructions
        </h2>
        <div class="space-y-4 text-gray-700 dark:text-gray-300">
          <p class="text-lg font-medium">This assessment explores unconscious biases through two methods:</p>
          
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">Part 1: Reaction Time Tasks</h3>
            <p class="text-sm text-blue-700 dark:text-blue-400">
              You'll categorize words and images as quickly as possible. Your reaction times help reveal automatic associations.
              Don't overthink - respond with your first instinct.
            </p>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h3 class="font-semibold text-green-800 dark:text-green-300 mb-2">Part 2: Explicit Bias Questionnaire</h3>
            <p class="text-sm text-green-700 dark:text-green-400">
              Direct questions about your conscious attitudes and beliefs across different social groups.
            </p>
          </div>
          
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Important Notes</h4>
            <ul class="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
              <li>• Having biases is normal and universal - everyone has them</li>
              <li>• This assessment is for self-awareness, not judgment</li>
              <li>• Awareness is the first step toward reducing bias impact</li>
              <li>• Results help you understand areas for continued growth</li>
            </ul>
          </div>
        </div>
        
        <div class="flex justify-center mt-6">
          <button @click="startAssessment" 
                  class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
            Begin Assessment
          </button>
        </div>
      </div>

      <div v-if="!showInstructions && currentSection === 'reaction'" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="text-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Part 1: {{ getCurrentReactionTask().name }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ getCurrentReactionTask().instructions }}
          </p>
        </div>

        <div v-if="!taskStarted" class="text-center space-y-4">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">Task: {{ getCurrentReactionTask().name }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ getCurrentReactionTask().description }}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="bg-blue-100 dark:bg-blue-900/30 rounded p-2">
                <strong>Left Key (A):</strong> {{ getCurrentReactionTask().leftCategory }}
              </div>
              <div class="bg-green-100 dark:bg-green-900/30 rounded p-2">
                <strong>Right Key (L):</strong> {{ getCurrentReactionTask().rightCategory }}
              </div>
            </div>
          </div>
          <button @click="startReactionTask" 
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Start Task
          </button>
        </div>

        <div v-if="taskStarted && !taskCompleted" class="text-center">
          <div class="min-h-[300px] flex flex-col justify-center items-center space-y-8">
            <div class="text-6xl mb-4">{{ currentStimulus.content }}</div>
            <div class="text-lg font-medium text-gray-700 dark:text-gray-300">
              Press 'A' for {{ getCurrentReactionTask().leftCategory }} | Press 'L' for {{ getCurrentReactionTask().rightCategory }}
            </div>
            <div v-if="showFeedback" class="text-red-500 font-medium">
              {{ feedback }}
            </div>
          </div>
        </div>

        <div v-if="taskCompleted" class="text-center space-y-4">
          <div class="text-green-600 text-xl font-semibold">Task Complete!</div>
          <p class="text-gray-600 dark:text-gray-400">Average reaction time: {{ Math.round(averageReactionTime) }}ms</p>
          <button @click="nextTask" 
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {{ isLastReactionTask ? 'Continue to Questionnaire' : 'Next Task' }}
          </button>
        </div>
      </div>

      <div v-if="currentSection === 'questionnaire'" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Part 2: Explicit Bias Questionnaire
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Bias Category: {{ getCurrentBiasCategory().name }}
          </p>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ currentExplicitQuestion.text }}
          </h3>
          
          <div class="space-y-3">
            <label v-for="(option, index) in currentExplicitQuestion.options" :key="index" 
                   class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                   :class="selectedAnswer === index ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
              <input type="radio" 
                     :name="`question-${currentQuestionIndex}`" 
                     :value="index" 
                     v-model="selectedAnswer" 
                     class="mr-3 text-blue-600">
              <span class="text-gray-900 dark:text-white">{{ option }}</span>
            </label>
          </div>
        </div>

        <div class="flex justify-between mt-8">
          <button @click="previousQuestion" 
                  :disabled="currentQuestionIndex === 0"
                  class="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200">
            ← Previous
          </button>
          <button @click="nextQuestion" 
                  :disabled="selectedAnswer === null"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {{ isLastQuestion ? 'Complete Assessment' : 'Next →' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showResults" class="space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Implicit Bias Awareness Profile
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Understanding your unconscious biases and areas for growth
        </p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Overall Bias Awareness Level: {{ results.overallLevel }}
        </h2>
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">{{ results.overallDescription }}</p>
        
        <div class="grid md:grid-cols-2 gap-6 mt-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Strengths</h3>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li v-for="strength in results.strengths" :key="strength" class="flex items-start">
                <span class="mr-2 text-green-600">✓</span>{{ strength }}
              </li>
            </ul>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Growth Areas</h3>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li v-for="growth in results.growthAreas" :key="growth" class="flex items-start">
                <span class="mr-2 text-blue-600">→</span>{{ growth }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Bias Analysis by Category
        </h3>
        <div class="space-y-6">
          <div v-for="category in results.categoryResults" :key="category.name" 
               class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ category.name }}</h4>
              <div class="flex items-center space-x-4">
                <div class="text-sm text-gray-500">
                  Implicit: <span class="font-semibold" :class="getBiasLevelColor(category.implicitLevel)">
                    {{ category.implicitLevel }}
                  </span>
                </div>
                <div class="text-sm text-gray-500">
                  Explicit: <span class="font-semibold" :class="getBiasLevelColor(category.explicitLevel)">
                    {{ category.explicitLevel }}
                  </span>
                </div>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ category.description }}</p>
            
            <div class="bg-gray-50 dark:bg-gray-700 rounded p-3">
              <h5 class="font-medium text-gray-900 dark:text-white mb-2">Recommendations:</h5>
              <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li v-for="rec in category.recommendations" :key="rec" class="flex items-start">
                  <span class="mr-2">•</span>{{ rec }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Bias Reduction Strategies
        </h3>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">Awareness</h4>
            <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Regular self-reflection on decisions</li>
              <li>• Seek feedback from diverse perspectives</li>
              <li>• Notice automatic assumptions</li>
              <li>• Track patterns in your judgments</li>
            </ul>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2">Exposure</h4>
            <ul class="text-sm text-green-700 dark:text-green-400 space-y-1">
              <li>• Diversify your social networks</li>
              <li>• Consume diverse media sources</li>
              <li>• Engage with different communities</li>
              <li>• Challenge your comfort zones</li>
            </ul>
          </div>
          
          <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <h4 class="font-semibold text-purple-800 dark:text-purple-300 mb-2">Systems</h4>
            <ul class="text-sm text-purple-700 dark:text-purple-400 space-y-1">
              <li>• Use structured decision-making processes</li>
              <li>• Implement blind review when possible</li>
              <li>• Create diverse evaluation panels</li>
              <li>• Establish bias interruption protocols</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="text-center">
        <button @click="retakeAssessment" 
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4">
          Retake Assessment
        </button>
        <NuxtLink to="/profile" 
                  class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          View Profile
        </NuxtLink>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const showInstructions = ref(true)
const currentSection = ref('reaction') // 'reaction' or 'questionnaire'
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const answers = ref([])
const showResults = ref(false)
const results = ref(null)

// Reaction time task variables
const currentReactionTaskIndex = ref(0)
const taskStarted = ref(false)
const taskCompleted = ref(false)
const currentStimulusIndex = ref(0)
const reactionTimes = ref([])
const startTime = ref(0)
const showFeedback = ref(false)
const feedback = ref('')
const averageReactionTime = ref(0)

const reactionTasks = [
  {
    id: 'race',
    name: 'Racial Association Task',
    instructions: 'Categorize faces and words as quickly as possible',
    description: 'You will see faces and words. Categorize them using the keys shown below.',
    leftCategory: 'European American + Good',
    rightCategory: 'African American + Bad',
    stimuli: [
      { content: '😊', type: 'face', category: 'european', correct: 'left' },
      { content: '😐', type: 'face', category: 'african', correct: 'right' },
      { content: 'Joy', type: 'word', category: 'good', correct: 'left' },
      { content: 'Pain', type: 'word', category: 'bad', correct: 'right' },
      { content: '🙂', type: 'face', category: 'european', correct: 'left' },
      { content: '😑', type: 'face', category: 'african', correct: 'right' },
      { content: 'Love', type: 'word', category: 'good', correct: 'left' },
      { content: 'Hate', type: 'word', category: 'bad', correct: 'right' }
    ]
  },
  {
    id: 'gender',
    name: 'Gender Career Association Task',
    instructions: 'Associate names and careers as quickly as possible',
    description: 'You will see names and career words. Categorize them using the keys shown below.',
    leftCategory: 'Male + Career',
    rightCategory: 'Female + Family',
    stimuli: [
      { content: 'Michael', type: 'name', category: 'male', correct: 'left' },
      { content: 'Jennifer', type: 'name', category: 'female', correct: 'right' },
      { content: 'Executive', type: 'word', category: 'career', correct: 'left' },
      { content: 'Home', type: 'word', category: 'family', correct: 'right' },
      { content: 'David', type: 'name', category: 'male', correct: 'left' },
      { content: 'Sarah', type: 'name', category: 'female', correct: 'right' },
      { content: 'Management', type: 'word', category: 'career', correct: 'left' },
      { content: 'Children', type: 'word', category: 'family', correct: 'right' }
    ]
  },
  {
    id: 'age',
    name: 'Age Association Task',
    instructions: 'Categorize age-related words and concepts',
    description: 'You will see words related to age and abilities. Categorize them using the keys shown below.',
    leftCategory: 'Young + Strong',
    rightCategory: 'Old + Weak',
    stimuli: [
      { content: 'Energetic', type: 'word', category: 'young', correct: 'left' },
      { content: 'Frail', type: 'word', category: 'old', correct: 'right' },
      { content: 'Vigorous', type: 'word', category: 'strong', correct: 'left' },
      { content: 'Feeble', type: 'word', category: 'weak', correct: 'right' },
      { content: 'Youthful', type: 'word', category: 'young', correct: 'left' },
      { content: 'Elderly', type: 'word', category: 'old', correct: 'right' },
      { content: 'Powerful', type: 'word', category: 'strong', correct: 'left' },
      { content: 'Fragile', type: 'word', category: 'weak', correct: 'right' }
    ]
  }
]

const explicitBiasQuestions = [
  // Race bias questions
  {
    id: 1,
    category: 'race',
    text: 'How do you generally feel about people of different racial backgrounds?',
    options: [
      'I strongly prefer my own racial group',
      'I somewhat prefer my own racial group', 
      'I feel equally positive about all racial groups',
      'I am more curious about other racial groups',
      'I strongly value racial diversity'
    ]
  },
  {
    id: 2,
    category: 'race',
    text: 'When hiring for a position, how much does race factor into your evaluation?',
    options: [
      'I prefer candidates from my own racial background',
      'Race influences my perception somewhat',
      'Race is completely irrelevant to my decisions',
      'I actively consider racial diversity',
      'I strongly prioritize underrepresented groups'
    ]
  },
  {
    id: 3,
    category: 'race',
    text: 'How comfortable are you in predominantly non-white social settings?',
    options: [
      'Very uncomfortable and avoid them',
      'Somewhat uncomfortable but manageable',
      'Comfortable - race doesn\'t matter to me',
      'I enjoy diverse social settings',
      'I strongly prefer diverse environments'
    ]
  },

  // Gender bias questions  
  {
    id: 4,
    category: 'gender',
    text: 'What are your views on gender roles in the workplace?',
    options: [
      'Traditional gender roles are natural and should be maintained',
      'Some gender differences in roles make sense',
      'Gender should not determine workplace roles',
      'We should actively work to eliminate gender role assumptions',
      'I strongly advocate for gender equality in all contexts'
    ]
  },
  {
    id: 5,
    category: 'gender',
    text: 'When evaluating leadership potential, how much does gender matter?',
    options: [
      'Men are naturally better leaders',
      'Gender creates some relevant differences',
      'Gender is irrelevant to leadership ability',
      'We need more women in leadership',
      'I actively advocate for gender parity in leadership'
    ]
  },
  {
    id: 6,
    category: 'gender',
    text: 'How do you view work-life balance expectations for men vs women?',
    options: [
      'Women should prioritize family over career',
      'Different expectations for men and women make sense',
      'The same expectations should apply regardless of gender',
      'We should actively support women\'s career advancement',
      'I strongly advocate for equal parental/career support'
    ]
  },

  // Age bias questions
  {
    id: 7,
    category: 'age',
    text: 'What are your general attitudes toward older workers?',
    options: [
      'Older workers are generally less capable',
      'Age brings both advantages and limitations',
      'Age is irrelevant to work performance',
      'I value the experience older workers bring',
      'I strongly advocate for age diversity and inclusion'
    ]
  },
  {
    id: 8,
    category: 'age',
    text: 'How do you view technology adoption across different age groups?',
    options: [
      'Older people just can\'t keep up with technology',
      'Age creates natural differences in tech comfort',
      'Technology adoption varies by individual, not age',
      'I help others learn regardless of age',
      'I actively challenge age-based technology assumptions'
    ]
  },
  {
    id: 9,
    category: 'age',
    text: 'In team settings, how do you view contributions from different age groups?',
    options: [
      'Younger people bring more value and energy',
      'Different ages contribute in different ways',
      'Age doesn\'t determine the value of contributions',
      'I actively seek input from all age groups',
      'I work to ensure equal voice regardless of age'
    ]
  },

  // Socioeconomic bias questions
  {
    id: 10,
    category: 'socioeconomic',
    text: 'What are your views on socioeconomic differences?',
    options: [
      'People generally get what they deserve economically',
      'Hard work usually determines economic outcomes',
      'Economic success depends on many factors',
      'Systemic factors significantly impact economic outcomes',
      'I strongly believe economic inequality is mostly structural'
    ]
  },
  {
    id: 11,
    category: 'socioeconomic',
    text: 'How do you view people who receive government assistance?',
    options: [
      'Most people on assistance are taking advantage of the system',
      'Some people abuse assistance but most need it temporarily',
      'People use assistance for various legitimate reasons',
      'Most people need assistance due to circumstances beyond their control',
      'I strongly support robust social safety nets'
    ]
  },
  {
    id: 12,
    category: 'socioeconomic',
    text: 'When you meet someone, how much does their economic status influence your impression?',
    options: [
      'Economic status tells me a lot about someone\'s character',
      'Economic status influences my impression somewhat',
      'I try not to let economic status affect my judgment',
      'I actively work to ignore economic status indicators',
      'I strongly value people regardless of economic background'
    ]
  }
]

const biasCategories = [
  {
    name: 'Racial Bias',
    id: 'race',
    description: 'Unconscious preferences or assumptions based on racial background'
  },
  {
    name: 'Gender Bias',
    id: 'gender', 
    description: 'Unconscious assumptions about capabilities and roles based on gender'
  },
  {
    name: 'Age Bias',
    id: 'age',
    description: 'Unconscious assumptions about abilities and value based on age'
  },
  {
    name: 'Socioeconomic Bias',
    id: 'socioeconomic',
    description: 'Unconscious assumptions based on economic background and status'
  }
]

const totalQuestions = computed(() => explicitBiasQuestions.length)
const progressPercentage = computed(() => {
  if (currentSection.value === 'reaction') {
    const taskProgress = (currentReactionTaskIndex.value / reactionTasks.length) * 50
    const stimulusProgress = taskStarted.value ? (currentStimulusIndex.value / getCurrentReactionTask().stimuli.length) * (50 / reactionTasks.length) : 0
    return taskProgress + stimulusProgress
  } else {
    return 50 + ((currentQuestionIndex.value + 1) / totalQuestions.value) * 50
  }
})

const currentExplicitQuestion = computed(() => explicitBiasQuestions[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)
const isLastReactionTask = computed(() => currentReactionTaskIndex.value === reactionTasks.length - 1)
const currentStimulus = computed(() => {
  const task = getCurrentReactionTask()
  return task.stimuli[currentStimulusIndex.value]
})

const getCurrentReactionTask = () => reactionTasks[currentReactionTaskIndex.value]

const getCurrentBiasCategory = () => {
  const question = explicitBiasQuestions[currentQuestionIndex.value]
  return biasCategories.find(c => c.id === question.category)
}

const getBiasLevelColor = (level) => {
  const colors = {
    'Low': 'text-green-600',
    'Moderate': 'text-yellow-600', 
    'High': 'text-red-600',
    'Very Low': 'text-green-700',
    'Very High': 'text-red-700'
  }
  return colors[level] || 'text-gray-600'
}

const startAssessment = () => {
  showInstructions.value = false
  currentSection.value = 'reaction'
}

const startReactionTask = () => {
  taskStarted.value = true
  taskCompleted.value = false
  currentStimulusIndex.value = 0
  reactionTimes.value = []
  showNextStimulus()
}

const showNextStimulus = () => {
  if (currentStimulusIndex.value < getCurrentReactionTask().stimuli.length) {
    startTime.value = Date.now()
    showFeedback.value = false
  } else {
    completeReactionTask()
  }
}

const handleKeyPress = (event) => {
  if (!taskStarted.value || taskCompleted.value || startTime.value === 0) return
  
  const key = event.key.toLowerCase()
  if (key !== 'a' && key !== 'l') return
  
  const reactionTime = Date.now() - startTime.value
  const stimulus = currentStimulus.value
  const isCorrect = (key === 'a' && stimulus.correct === 'left') || 
                   (key === 'l' && stimulus.correct === 'right')
  
  reactionTimes.value.push({
    stimulus: stimulus.content,
    reactionTime,
    correct: isCorrect,
    taskId: getCurrentReactionTask().id
  })
  
  if (!isCorrect) {
    showFeedback.value = true
    feedback.value = 'Wrong key! Try again.'
    setTimeout(() => {
      showFeedback.value = false
      nextStimulus()
    }, 1000)
  } else {
    nextStimulus()
  }
}

const nextStimulus = () => {
  currentStimulusIndex.value++
  startTime.value = 0
  setTimeout(showNextStimulus, 500)
}

const completeReactionTask = () => {
  taskCompleted.value = true
  const taskReactionTimes = reactionTimes.value.filter(rt => rt.taskId === getCurrentReactionTask().id)
  averageReactionTime.value = taskReactionTimes.reduce((sum, rt) => sum + rt.reactionTime, 0) / taskReactionTimes.length
}

const nextTask = () => {
  if (isLastReactionTask.value) {
    currentSection.value = 'questionnaire'
  } else {
    currentReactionTaskIndex.value++
    taskStarted.value = false
    taskCompleted.value = false
  }
}

const nextQuestion = () => {
  if (selectedAnswer.value !== null) {
    answers.value[currentQuestionIndex.value] = selectedAnswer.value
    
    if (isLastQuestion.value) {
      completeAssessment()
    } else {
      currentQuestionIndex.value++
      selectedAnswer.value = answers.value[currentQuestionIndex.value] || null
    }
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    answers.value[currentQuestionIndex.value] = selectedAnswer.value
    currentQuestionIndex.value--
    selectedAnswer.value = answers.value[currentQuestionIndex.value] || null
  }
}

const calculateResults = () => {
  // Calculate implicit bias from reaction times
  const implicitBiasScores = {}
  reactionTasks.forEach(task => {
    const taskTimes = reactionTimes.value.filter(rt => rt.taskId === task.id)
    const avgTime = taskTimes.reduce((sum, rt) => sum + rt.reactionTime, 0) / taskTimes.length
    const errorRate = taskTimes.filter(rt => !rt.correct).length / taskTimes.length
    
    // Simple bias calculation - faster times indicate stronger automatic associations
    let biasScore = 0
    if (avgTime < 600) biasScore = 3 // High implicit bias
    else if (avgTime < 800) biasScore = 2 // Moderate
    else biasScore = 1 // Low
    
    // Adjust for errors
    if (errorRate > 0.2) biasScore = Math.min(biasScore + 1, 3)
    
    implicitBiasScores[task.id] = biasScore
  })
  
  // Calculate explicit bias from questionnaire responses
  const explicitBiasScores = {}
  biasCategories.forEach(category => {
    const categoryQuestions = explicitBiasQuestions.filter(q => q.category === category.id)
    const categoryAnswers = categoryQuestions.map((q, index) => {
      const questionIndex = explicitBiasQuestions.findIndex(quest => quest.id === q.id)
      return answers.value[questionIndex] || 2
    })
    
    const avgScore = categoryAnswers.reduce((sum, answer) => sum + answer, 0) / categoryAnswers.length
    explicitBiasScores[category.id] = avgScore
  })
  
  // Generate category results
  const categoryResults = biasCategories.map(category => {
    const implicitScore = implicitBiasScores[category.id] || 1
    const explicitScore = explicitBiasScores[category.id] || 2
    
    const implicitLevel = implicitScore === 1 ? 'Low' : implicitScore === 2 ? 'Moderate' : 'High'
    const explicitLevel = explicitScore <= 1 ? 'High' : explicitScore <= 2 ? 'Moderate' : explicitScore <= 3 ? 'Low' : 'Very Low'
    
    return {
      name: category.name,
      id: category.id,
      implicitLevel,
      explicitLevel,
      implicitScore,
      explicitScore,
      description: getCategoryDescription(category.id, implicitLevel, explicitLevel),
      recommendations: getCategoryRecommendations(category.id, implicitLevel, explicitLevel)
    }
  })
  
  // Overall assessment
  const avgImplicit = Object.values(implicitBiasScores).reduce((sum, score) => sum + score, 0) / Object.keys(implicitBiasScores).length
  const avgExplicit = Object.values(explicitBiasScores).reduce((sum, score) => sum + score, 0) / Object.keys(explicitBiasScores).length
  
  const overallLevel = getOverallBiasLevel(avgImplicit, avgExplicit)
  const overallDescription = getOverallDescription(overallLevel)
  const strengths = getOverallStrengths(avgImplicit, avgExplicit)
  const growthAreas = getOverallGrowthAreas(categoryResults)

  return {
    categoryResults,
    overallLevel,
    overallDescription,
    strengths,
    growthAreas,
    implicitBiasScores,
    explicitBiasScores,
    reactionTimeData: reactionTimes.value,
    completedAt: new Date().toISOString()
  }
}

const getCategoryDescription = (categoryId, implicitLevel, explicitLevel) => {
  const descriptions = {
    race: {
      'Low-Low': 'You show low implicit and explicit racial bias. You appear to have minimal automatic racial preferences.',
      'Low-Moderate': 'You have low conscious racial bias but some implicit associations. Good awareness with room for unconscious work.',
      'Low-High': 'You show some conscious racial preferences but low implicit bias. Focus on examining explicit attitudes.',
      'Moderate-Low': 'You have low conscious bias but moderate implicit associations. Your unconscious mind holds some racial preferences.',
      'Moderate-Moderate': 'You show moderate bias both implicitly and explicitly. This is common and presents opportunities for growth.',
      'High-Low': 'You have low conscious bias but high implicit associations. Your automatic responses differ from your stated beliefs.'
    },
    gender: {
      'Low-Low': 'You show minimal gender bias both implicitly and explicitly. You appear to have egalitarian gender attitudes.',
      'Moderate-Moderate': 'You show moderate gender bias in both areas. Focus on examining assumptions about gender roles and capabilities.',
      'High-High': 'You show strong gender bias both implicitly and explicitly. Consider exploring more egalitarian perspectives.'
    },
    age: {
      'Low-Low': 'You show minimal age bias. You appear to value people regardless of age.',
      'Moderate-Moderate': 'You show moderate age bias. Consider examining assumptions about age and capability.',
      'High-High': 'You show strong age bias. Focus on recognizing the value and contributions of all age groups.'
    },
    socioeconomic: {
      'Low-Low': 'You show minimal socioeconomic bias. You appear to value people regardless of economic background.',
      'Moderate-Moderate': 'You show moderate socioeconomic bias. Consider examining assumptions about class and worth.',
      'High-High': 'You show strong socioeconomic bias. Focus on understanding structural factors that impact economic outcomes.'
    }
  }
  
  const key = `${implicitLevel}-${explicitLevel}`
  return descriptions[categoryId]?.[key] || descriptions[categoryId]?.['Moderate-Moderate'] || 'Mixed bias levels present opportunities for growth and self-awareness.'
}

const getCategoryRecommendations = (categoryId, implicitLevel, explicitLevel) => {
  const baseRecs = {
    race: [
      'Actively seek diverse perspectives and relationships',
      'Examine your media consumption for racial representation',
      'Practice perspective-taking exercises',
      'Engage in cross-racial dialogue opportunities'
    ],
    gender: [
      'Question gender-based assumptions in daily interactions',
      'Support gender equality initiatives in your community',
      'Examine language and communication patterns',
      'Seek out counter-stereotypical examples'
    ],
    age: [
      'Interact with people across different age groups',
      'Challenge age-based assumptions about technology and learning',
      'Value experience and fresh perspectives equally',
      'Examine your own aging assumptions'
    ],
    socioeconomic: [
      'Learn about structural factors affecting economic outcomes',
      'Volunteer with organizations serving different socioeconomic groups',
      'Examine your assumptions about work ethic and success',
      'Practice gratitude for your economic circumstances'
    ]
  }
  
  return baseRecs[categoryId] || [
    'Increase awareness of this bias category',
    'Seek education about this social group',
    'Practice mindful interactions',
    'Consider systemic factors affecting this group'
  ]
}

const getOverallBiasLevel = (avgImplicit, avgExplicit) => {
  const total = avgImplicit + (5 - avgExplicit) // Convert explicit to same scale
  if (total <= 3) return 'Low Bias Awareness'
  if (total <= 5) return 'Moderate Bias Awareness'
  return 'High Bias Awareness'
}

const getOverallDescription = (level) => {
  const descriptions = {
    'Low Bias Awareness': 'You demonstrate strong awareness of bias and show relatively low levels across most categories. Continue developing your understanding and supporting others.',
    'Moderate Bias Awareness': 'You show moderate levels of bias, which is common. This presents excellent opportunities for growth and increased awareness.',
    'High Bias Awareness': 'You show higher levels of bias in several areas. This awareness is the first step toward positive change and growth.'
  }
  return descriptions[level] || 'Your bias profile shows areas for continued growth and self-awareness.'
}

const getOverallStrengths = (avgImplicit, avgExplicit) => {
  const strengths = []
  if (avgExplicit >= 3) strengths.push('Strong conscious commitment to equality')
  if (avgImplicit <= 2) strengths.push('Relatively low automatic bias responses')
  strengths.push('Willingness to examine your own biases')
  strengths.push('Openness to personal growth and development')
  return strengths
}

const getOverallGrowthAreas = (categoryResults) => {
  const areas = []
  const highBiasCategories = categoryResults.filter(c => c.implicitScore >= 2 || c.explicitScore <= 2)
  
  if (highBiasCategories.length > 0) {
    areas.push(`Focus on ${highBiasCategories.map(c => c.name.toLowerCase()).join(' and ')} bias reduction`)
  }
  areas.push('Continue regular self-reflection and bias awareness practices')
  areas.push('Seek diverse perspectives and experiences')
  areas.push('Practice interrupting biased thoughts when they arise')
  
  return areas
}

const completeAssessment = async () => {
  results.value = calculateResults()
  
  try {
    const { error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.value.id,
        test_type_id: 'implicit_bias',
        responses: { answers: answers.value, reactionTimes: reactionTimes.value },
        evaluation: results.value,
        completed_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving results:', error)
    }
  } catch (error) {
    console.error('Error:', error)
  }
  
  showResults.value = true
}

const retakeAssessment = () => {
  showInstructions.value = true
  currentSection.value = 'reaction'
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  answers.value = []
  showResults.value = false
  results.value = null
  
  // Reset reaction task state
  currentReactionTaskIndex.value = 0
  taskStarted.value = false
  taskCompleted.value = false
  currentStimulusIndex.value = 0
  reactionTimes.value = []
  startTime.value = 0
  showFeedback.value = false
}

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
  
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

useHead({
  title: 'Implicit Bias Awareness Assessment - Character Assessment Platform',
  meta: [
    { name: 'description', content: 'Explore your unconscious biases with this comprehensive implicit bias assessment. Understand your automatic associations and develop greater bias awareness.' }
  ]
})
</script>