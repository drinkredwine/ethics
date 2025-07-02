<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-gray-900">Moral Development Assessment</h1>
            <div class="flex space-x-4">
              <NuxtLink to="/assessment" class="text-indigo-600 font-medium">Assessment</NuxtLink>
              <NuxtLink to="/history" class="text-gray-600 hover:text-gray-900">History</NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">Question {{ currentQuestion + 1 }} of {{ scenarios.length }}</span>
            <span v-if="user" class="text-gray-600">{{ user.email }}</span>
            <button @click="logout" class="text-gray-600 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="bg-gray-200 rounded-full h-2">
          <div 
            class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${(currentQuestion / scenarios.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>
          <p class="text-gray-600">Your responses are being analyzed by our AI system...</p>
        </div>
        
        <div v-if="evaluation" class="space-y-6">
          <div class="border-l-4 border-indigo-500 pl-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Your Moral Development Stage</h3>
            <div class="prose max-w-none" v-html="evaluation.stage"></div>
          </div>
          
          <div class="border-l-4 border-green-500 pl-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Analysis</h3>
            <div class="prose max-w-none" v-html="evaluation.analysis"></div>
          </div>
          
          <div class="border-l-4 border-blue-500 pl-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Recommendations for Growth</h3>
            <div class="prose max-w-none" v-html="evaluation.recommendations"></div>
          </div>
        </div>

        <div v-else class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ scenarios[currentQuestion].title }}
          </h2>
          <div class="prose max-w-none text-gray-700">
            <p>{{ scenarios[currentQuestion].scenario }}</p>
          </div>
        </div>

        <div class="space-y-4 mb-6">
          <div
            v-for="(option, index) in scenarios[currentQuestion].options"
            :key="index"
            class="border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50"
            :class="{ 'border-indigo-500 bg-indigo-50': selectedOption === index }"
            @click="selectedOption = index"
          >
            <div class="flex items-start">
              <input
                type="radio"
                :value="index"
                v-model="selectedOption"
                class="mt-1 mr-3"
              />
              <p class="text-gray-700">{{ option.text }}</p>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Please explain your reasoning (this helps our AI provide better analysis):
          </label>
          <textarea
            v-model="reasoning"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Why did you choose this option? What factors influenced your decision?"
          ></textarea>
        </div>

        <div class="flex justify-between">
          <button
            v-if="currentQuestion > 0"
            @click="previousQuestion"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <div v-else></div>
          
          <button
            @click="nextQuestion"
            :disabled="selectedOption === null"
            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ currentQuestion === scenarios.length - 1 ? 'Complete Assessment' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Authentication check
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Redirect to login if not authenticated
watch(user, (newUser) => {
  if (!newUser) {
    navigateTo('/login')
  }
}, { immediate: true })

const currentQuestion = ref(0)
const selectedOption = ref(null)
const reasoning = ref('')
const responses = ref([])
const assessmentComplete = ref(false)
const evaluation = ref(null)

const scenarios = [
  {
    title: "The Heinz Dilemma",
    scenario: "A woman was near death from a special kind of cancer. There was one drug that the doctors thought might save her. It was a form of radium that a druggist in the same town had recently discovered. The drug was expensive to make, but the druggist was charging ten times what the drug cost him to produce. He paid $200 for the radium and charged $2,000 for a small dose of the drug. The sick woman's husband, Heinz, went to everyone he knew to borrow the money, but he could only get together about $1,000, which is half of what it cost. He told the druggist that his wife was dying and asked him to sell it cheaper or let him pay later. But the druggist said, 'No, I discovered the drug and I'm going to make money from it.' So Heinz got desperate and broke into the man's laboratory to steal the drug for his wife.",
    options: [
      { text: "Heinz should not steal the medicine because it's against the law and he might get punished.", stage: 1 },
      { text: "Heinz should steal the medicine because his wife needs it and he tried to pay for it.", stage: 2 },
      { text: "Heinz should steal the medicine because society expects a husband to care for his wife.", stage: 3 },
      { text: "Heinz should not steal because laws exist to maintain order, even in difficult situations.", stage: 4 },
      { text: "Heinz should steal because the right to life is more fundamental than property rights.", stage: 5 },
      { text: "Heinz should steal because preserving human life aligns with universal ethical principles.", stage: 6 }
    ]
  },
  {
    title: "The Officer and the Draft",
    scenario: "During wartime, a young man named Joe was drafted into the military. However, Joe believed the war was unjust and morally wrong. He had to decide whether to report for duty as legally required or to refuse and face imprisonment.",
    options: [
      { text: "Joe should report for duty to avoid punishment and legal consequences.", stage: 1 },
      { text: "Joe should do whatever serves his own interests and safety best.", stage: 2 },
      { text: "Joe should report for duty because that's what good citizens do.", stage: 3 },
      { text: "Joe should report for duty because the law requires it and laws must be obeyed.", stage: 4 },
      { text: "Joe should refuse if his conscience conflicts with legal obligations.", stage: 5 },
      { text: "Joe should follow his moral principles about human dignity and justice.", stage: 6 }
    ]
  },
  {
    title: "The Lifeboat Dilemma",
    scenario: "A ship has sunk and there are 6 people in a lifeboat that can only safely hold 5. The boat is sinking slowly. One person must be removed or everyone will drown. The people are: a doctor, a pregnant woman, an elderly man, a child, a convicted criminal, and a college student.",
    options: [
      { text: "Remove whoever is physically weakest to ensure the others survive.", stage: 1 },
      { text: "Remove the person who contributes least to my own survival chances.", stage: 2 },
      { text: "Remove the criminal because society views them as less valuable.", stage: 3 },
      { text: "Follow established maritime law about who should be saved first.", stage: 4 },
      { text: "Make the decision democratically, respecting everyone's equal right to life.", stage: 5 },
      { text: "This choice violates human dignity - find another solution or accept shared fate.", stage: 6 }
    ]
  }
]

const nextQuestion = async () => {
  if (selectedOption.value === null) return

  // Store response
  responses.value.push({
    question: currentQuestion.value,
    selectedOption: selectedOption.value,
    reasoning: reasoning.value,
    stage: scenarios[currentQuestion.value].options[selectedOption.value].stage
  })

  if (currentQuestion.value === scenarios.length - 1) {
    // Complete assessment
    assessmentComplete.value = true
    await evaluateResponses()
    await saveAssessmentToDatabase()
  } else {
    // Next question
    currentQuestion.value++
    selectedOption.value = null
    reasoning.value = ''
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    const previousResponse = responses.value.pop()
    if (previousResponse) {
      selectedOption.value = previousResponse.selectedOption
      reasoning.value = previousResponse.reasoning
    }
  }
}

const evaluateResponses = async () => {
  const context = `You are a moral development expert analyzing responses to Kohlberg's moral development scenarios. 

The user has completed an assessment with the following responses:
${responses.value.map((r, i) => `
Question ${i + 1}: ${scenarios[i].title}
Selected option: ${scenarios[i].options[r.selectedOption].text}
User's reasoning: ${r.reasoning}
Associated stage: ${r.stage}
`).join('\n')}

Based on these responses, provide a comprehensive analysis including:
1. Their primary moral development stage (with explanation)
2. Analysis of their moral reasoning patterns
3. Specific recommendations for advancing to higher stages

Format your response in HTML with clear sections for stage, analysis, and recommendations.`

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Please analyze my moral development assessment responses.',
        context: context
      })
    })

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No reader available')

    let result = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'content') {
              result += data.content
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }

    // Parse the result into sections
    const sections = result.split(/(?=<h[123]|##|\*\*)/i)
    evaluation.value = {
      stage: sections.find(s => /stage/i.test(s)) || sections[0] || result.slice(0, 500),
      analysis: sections.find(s => /analysis|pattern/i.test(s)) || sections[1] || result.slice(500, 1000),
      recommendations: sections.find(s => /recommend|growth|advance/i.test(s)) || sections[2] || result.slice(1000)
    }
  } catch (error) {
    console.error('Evaluation error:', error)
    evaluation.value = {
      stage: 'Unable to analyze responses at this time.',
      analysis: 'Please try again later.',
      recommendations: 'Contact support if the issue persists.'
    }
  }
}

const saveAssessmentToDatabase = async () => {
  if (!user.value || !evaluation.value) return

  try {
    // Calculate primary stage based on responses
    const stageFrequency = responses.value.reduce((acc, response) => {
      acc[response.stage] = (acc[response.stage] || 0) + 1
      return acc
    }, {})
    
    const primaryStage = Object.keys(stageFrequency).reduce((a, b) => 
      stageFrequency[a] > stageFrequency[b] ? a : b
    )

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.value.id,
        responses: responses.value,
        evaluation: evaluation.value,
        primary_stage: parseInt(primaryStage),
        completed_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving assessment:', error)
    }
  } catch (error) {
    console.error('Failed to save assessment:', error)
  }
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

useHead({
  title: 'Assessment - Kohlberg Moral Development'
})
</script>