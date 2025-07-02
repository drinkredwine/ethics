<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-gray-900">{{ $t('assessment.title') }}</h1>
            <div class="flex space-x-4">
              <NuxtLink :to="$localePath('/assessment')" class="text-indigo-600 font-medium">{{ $t('nav.assessment') }}</NuxtLink>
              <NuxtLink :to="$localePath('/history')" class="text-gray-600 hover:text-gray-900">{{ $t('nav.history') }}</NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <LanguagePicker />
            <span class="text-gray-600">{{ $t('assessment.question') }} {{ currentQuestion + 1 }} {{ $t('assessment.of') }} {{ scenarios.length }}</span>
            <span v-if="user" class="text-gray-600">{{ user.email }}</span>
            <button @click="logout" class="text-gray-600 hover:text-gray-900">{{ $t('nav.logout') }}</button>
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
          <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('assessment.complete') }}</h2>
          <p class="text-gray-600">{{ $t('assessment.analyzing') }}</p>
        </div>
        
        <div v-if="evaluation" class="space-y-6">
          <div class="border-l-4 border-indigo-500 pl-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('assessment.stage') }}</h3>
            <div class="prose max-w-none" v-html="evaluation.stage"></div>
          </div>
          
          <div class="border-l-4 border-green-500 pl-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('assessment.analysis') }}</h3>
            <div class="prose max-w-none" v-html="evaluation.analysis"></div>
          </div>
          
          <div class="border-l-4 border-blue-500 pl-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('assessment.recommendations') }}</h3>
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
            {{ $t('assessment.explainReasoning') }}
          </label>
          <textarea
            v-model="reasoning"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            :placeholder="$t('assessment.reasoningPlaceholder')"
          ></textarea>
        </div>

        <div class="flex justify-between">
          <button
            v-if="currentQuestion > 0"
            @click="previousQuestion"
            class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {{ $t('assessment.previous') }}
          </button>
          <div v-else></div>
          
          <button
            @click="nextQuestion"
            :disabled="selectedOption === null"
            class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ currentQuestion === scenarios.length - 1 ? $t('assessment.completeAssessment') : $t('assessment.next') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Get user and Supabase client
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Note: Authentication is handled by global middleware

const currentQuestion = ref(0)
const selectedOption = ref(null)
const reasoning = ref('')
const responses = ref([])
const assessmentComplete = ref(false)
const evaluation = ref(null)

const { t } = useI18n()

const scenarios = computed(() => {
  const heinzOptions = t('scenarios.heinz.options')
  const officerOptions = t('scenarios.officer.options') 
  const lifeboatOptions = t('scenarios.lifeboat.options')
  
  return [
    {
      title: t('scenarios.heinz.title'),
      scenario: t('scenarios.heinz.scenario'),
      options: Array.isArray(heinzOptions) ? heinzOptions.map((text, index) => ({ text, stage: index + 1 })) : []
    },
    {
      title: t('scenarios.officer.title'),
      scenario: t('scenarios.officer.scenario'),
      options: Array.isArray(officerOptions) ? officerOptions.map((text, index) => ({ text, stage: index + 1 })) : []
    },
    {
      title: t('scenarios.lifeboat.title'),
      scenario: t('scenarios.lifeboat.scenario'),
      options: Array.isArray(lifeboatOptions) ? lifeboatOptions.map((text, index) => ({ text, stage: index + 1 })) : []
    }
  ]
})

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
  const { locale } = useI18n()
  const currentLocale = locale.value
  const isSlovak = currentLocale === 'sk'
  
  const context = isSlovak 
    ? `Ste expert na morálny vývoj analyzujúci odpovede na scenáre morálneho vývoja podľa Kohlberga. 

Používateľ dokončil hodnotenie s nasledujúcimi odpoveďami:
${responses.value.map((r, i) => `
Otázka ${i + 1}: ${scenarios.value[i].title}
Vybraná možnosť: ${scenarios.value[i].options[r.selectedOption].text}
Uvažovanie používateľa: ${r.reasoning}
Pridružené štádium: ${r.stage}
`).join('\n')}

Na základe týchto odpovedí poskytni komplexnú analýzu vrátane:
1. Ich primárne štádium morálneho vývoja (s vysvetlením)
2. Analýza ich vzorov morálneho uvažovania
3. Konkrétne odporúčania na postup do vyšších štádií

Formátuj svoju odpoveď v HTML s jasne oddelenými sekciami pre štádium, analýzu a odporúčania. Píš po slovensky.`
    : `You are a moral development expert analyzing responses to Kohlberg's moral development scenarios. 

The user has completed an assessment with the following responses:
${responses.value.map((r, i) => `
Question ${i + 1}: ${scenarios.value[i].title}
Selected option: ${scenarios.value[i].options[r.selectedOption].text}
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
  title: t('assessment.title') + ' - Kohlberg Assessment'
})
</script>