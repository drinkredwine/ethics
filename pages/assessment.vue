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
            <span class="text-gray-600">{{ $t('assessment.question') }} {{ currentQuestion + 1 }} {{ $t('assessment.of') }} {{ scenarios?.length || 0 }}</span>
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
            :style="{ width: `${scenarios?.length ? (currentQuestion / scenarios.length) * 100 : 0}%` }"
          ></div>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('assessment.complete') }}</h2>
        </div>
        
        <div v-if="evaluation" class="space-y-8">
          <!-- Results Header with Stage Indicator -->
          <div class="text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <span class="text-2xl font-bold text-indigo-600">{{ primaryStage }}</span>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('assessment.stage') }}</h3>
            <div class="prose max-w-none mx-auto" v-html="renderMarkdown(evaluation.stage)"></div>
          </div>
          
          <!-- Main Recommendations (Prominent) -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-500">
            <div class="flex items-center mb-4">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900">{{ $t('assessment.recommendations') }}</h3>
            </div>
            <div class="prose max-w-none" v-html="renderMarkdown(evaluation.recommendations)"></div>
          </div>
          
          <!-- Analysis (Collapsible) -->
          <div class="border border-gray-200 rounded-xl">
            <button 
              @click="showAnalysis = !showAnalysis"
              class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-xl transition-colors"
            >
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900">{{ $t('assessment.analysis') }}</h3>
              </div>
              <svg class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': showAnalysis }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div v-if="showAnalysis" class="px-4 pb-4">
              <div class="prose max-w-none" v-html="renderMarkdown(evaluation.analysis)"></div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <NuxtLink :to="$localePath('/assessment')" class="flex-1 bg-indigo-600 text-white text-center py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
              Vykonať nové hodnotenie
            </NuxtLink>
            <NuxtLink :to="$localePath('/history')" class="flex-1 bg-gray-100 text-gray-900 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
              Zobraziť históriu
            </NuxtLink>
          </div>
        </div>

        <!-- Enhanced Loading Animation -->
        <div v-else class="py-12">
          <div class="max-w-md mx-auto">
            <!-- Brain Animation -->
            <div class="relative mb-8">
              <div class="w-24 h-24 mx-auto relative">
                <div class="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                <div class="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-indigo-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Thinking Dots -->
              <div class="flex justify-center space-x-1 mt-4">
                <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
            
            <!-- Status Messages -->
            <div class="text-center space-y-3">
              <h3 class="text-lg font-semibold text-gray-900">{{ currentAnalysisStep }}</h3>
              <p class="text-gray-600">{{ $t('assessment.analyzing') }}</p>
              
              <!-- Progress Steps -->
              <div class="flex justify-center space-x-2 mt-6">
                <div v-for="(step, index) in analysisSteps" :key="index" 
                     class="w-3 h-3 rounded-full transition-colors"
                     :class="index <= currentStepIndex ? 'bg-indigo-500' : 'bg-gray-200'">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ scenarios[currentQuestion]?.title }}
          </h2>
          <div class="prose max-w-none text-gray-700">
            <p>{{ scenarios[currentQuestion]?.scenario }}</p>
          </div>
        </div>

        <div class="space-y-4 mb-6">
          <div
            v-for="(option, index) in scenarios[currentQuestion]?.options || []"
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
            {{ currentQuestion === (scenarios?.length - 1) ? $t('assessment.completeAssessment') : $t('assessment.next') }}
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
const showAnalysis = ref(false)
const currentStepIndex = ref(0)
const primaryStage = ref(null)

const { t } = useI18n()

// Enhanced loading animation
const analysisSteps = ref([
  'Analyzujem vaše odpovede...',
  'Identifikujem morálne vzory...',
  'Určujem štádium vývoja...',
  'Pripravujem odporúčania...',
  'Finalizujem analýzu...'
])

const currentAnalysisStep = computed(() => {
  return analysisSteps.value[currentStepIndex.value] || analysisSteps.value[0]
})

const scenarios = computed(() => {
  try {
    const heinzOptions = t('scenarios.heinz.options')
    const officerOptions = t('scenarios.officer.options') 
    const lifeboatOptions = t('scenarios.lifeboat.options')
    
    console.log('Heinz options:', heinzOptions)
    console.log('Officer options:', officerOptions)
    console.log('Lifeboat options:', lifeboatOptions)
    
    return [
      {
        title: t('scenarios.heinz.title'),
        scenario: t('scenarios.heinz.scenario'),
        options: Array.isArray(heinzOptions) ? heinzOptions.map((text, index) => ({ text, stage: index + 1 })) : [
          { text: "Heinz by nemal ukradnúť liek, pretože je to proti zákonu a mohol by byť potrestaný.", stage: 1 },
          { text: "Heinz by mal ukradnúť liek, pretože ho jeho žena potrebuje a pokúsil sa za neho zaplatiť.", stage: 2 },
          { text: "Heinz by mal ukradnúť liek, pretože spoločnosť očakáva od manžela, že sa postará o svoju ženu.", stage: 3 },
          { text: "Heinz by nemal kradnúť, pretože zákony existujú na udržanie poriadku, aj v ťažkých situáciách.", stage: 4 },
          { text: "Heinz by mal kradnúť, pretože právo na život je základnejšie ako vlastnícke práva.", stage: 5 },
          { text: "Heinz by mal kradnúť, pretože zachovanie ľudského života je v súlade s univerzálnymi etickými princípmi.", stage: 6 }
        ]
      },
      {
        title: t('scenarios.officer.title'),
        scenario: t('scenarios.officer.scenario'),
        options: Array.isArray(officerOptions) ? officerOptions.map((text, index) => ({ text, stage: index + 1 })) : [
          { text: "Joe by sa mal dostaviť na službu, aby sa vyhol trestu a právnym následkom.", stage: 1 },
          { text: "Joe by mal urobiť to, čo najlepšie slúži jeho vlastným záujmom a bezpečnosti.", stage: 2 },
          { text: "Joe by sa mal dostaviť na službu, pretože to robia dobrí občania.", stage: 3 },
          { text: "Joe by sa mal dostaviť na službu, pretože to vyžaduje zákon a zákony sa musia dodržiavať.", stage: 4 },
          { text: "Joe by mal odmietnuť, ak je jeho svedomie v konflikte s právnymi povinnosťami.", stage: 5 },
          { text: "Joe by mal nasledovať svoje morálne princípy o ľudskej dôstojnosti a spravodlivosti.", stage: 6 }
        ]
      },
      {
        title: t('scenarios.lifeboat.title'),
        scenario: t('scenarios.lifeboat.scenario'),
        options: Array.isArray(lifeboatOptions) ? lifeboatOptions.map((text, index) => ({ text, stage: index + 1 })) : [
          { text: "Odstrániť toho, kto je fyzicky najslabší, aby ostatní prežili.", stage: 1 },
          { text: "Odstrániť osobu, ktorá najmenej prispieva k mojim šanciam na prežitie.", stage: 2 },
          { text: "Odstrániť zločinca, pretože ho spoločnosť považuje za menej hodnotného.", stage: 3 },
          { text: "Nasledovať ustanovené námorné právo o tom, kto by mal byť zachránený ako prvý.", stage: 4 },
          { text: "Rozhodnúť sa demokraticky, rešpektujúc rovnaké právo každého na život.", stage: 5 },
          { text: "Táto voľba porušuje ľudskú důstojnosť - nájsť iné riešenie alebo prijať spoločný osud.", stage: 6 }
        ]
      }
    ]
  } catch (error) {
    console.error('Error loading scenarios:', error)
    return []
  }
})

const nextQuestion = async () => {
  if (selectedOption.value === null) return

  // Store response
  responses.value.push({
    question: currentQuestion.value,
    selectedOption: selectedOption.value,
    reasoning: reasoning.value,
    stage: scenarios.value[currentQuestion.value].options[selectedOption.value].stage
  })

  if (currentQuestion.value === scenarios.value.length - 1) {
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

// Markdown rendering function
const renderMarkdown = (content) => {
  if (!content) return ''
  
  // Import marked dynamically
  import('marked').then(({ marked }) => {
    return marked.parse(content)
  }).catch(() => {
    // Fallback: simple HTML formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
  })
  
  // Simple fallback formatting
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
}

const startLoadingAnimation = () => {
  currentStepIndex.value = 0
  const interval = setInterval(() => {
    if (currentStepIndex.value < analysisSteps.value.length - 1) {
      currentStepIndex.value++
    } else {
      clearInterval(interval)
    }
  }, 800)
}

const evaluateResponses = async () => {
  // Start loading animation
  startLoadingAnimation()
  
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

Poskytni analýzu, ale zameraj sa HLAVNE na praktické odporúčania na rast a rozvoj. Minimalizuj všeobecnú analýzu a sústred sa na:

1. Identifikácia primárneho štádia (krátko)
2. **HLAVNÝ DÔRAZ: Konkrétne, praktické odporúčania** na postup do vyšších štádií morálneho uvažovania
3. Špecifické cvičenia, situácie alebo myšlienkové procesy, ktoré by mali praktizovať

Formátuj odpoveď v Markdown formáte s jasne oddelenými sekciami. Odporúčania by mali byť najväčšou časťou odpovede. Píš po slovensky.`
    : `You are a moral development expert analyzing responses to Kohlberg's moral development scenarios. 

The user has completed an assessment with the following responses:
${responses.value.map((r, i) => `
Question ${i + 1}: ${scenarios.value[i].title}
Selected option: ${scenarios.value[i].options[r.selectedOption].text}
User's reasoning: ${r.reasoning}
Associated stage: ${r.stage}
`).join('\n')}

Provide analysis but focus MAINLY on practical recommendations for growth. Minimize general analysis and focus on:

1. Primary stage identification (brief)
2. **MAIN FOCUS: Specific, practical recommendations** for advancing to higher stages of moral reasoning
3. Specific exercises, situations, or thought processes they should practice

Format your response in Markdown with clear sections. Recommendations should be the largest part of the response.`

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

    // Parse the result into sections and extract primary stage
    const lines = result.split('\n')
    let stageSection = ''
    let analysisSection = ''
    let recommendationsSection = ''
    let currentSection = 'stage'
    
    for (const line of lines) {
      if (line.includes('štádium') || line.includes('Stage') || line.includes('#')) {
        if (line.includes('odporúčan') || line.includes('recommend')) {
          currentSection = 'recommendations'
        } else if (line.includes('analýz') || line.includes('analysis')) {
          currentSection = 'analysis'
        } else {
          currentSection = 'stage'
        }
      }
      
      if (currentSection === 'stage') stageSection += line + '\n'
      else if (currentSection === 'analysis') analysisSection += line + '\n'
      else if (currentSection === 'recommendations') recommendationsSection += line + '\n'
    }
    
    // Extract primary stage number
    const stageMatch = result.match(/štádium\s*(\d+)|stage\s*(\d+)/i)
    primaryStage.value = stageMatch ? (stageMatch[1] || stageMatch[2]) : calculatePrimaryStage()
    
    evaluation.value = {
      stage: stageSection || result.slice(0, 500),
      analysis: analysisSection || 'Analýza vzorcov morálneho uvažovania...',
      recommendations: recommendationsSection || result.slice(-1000)
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

const calculatePrimaryStage = () => {
  const stageFrequency = responses.value.reduce((acc, response) => {
    acc[response.stage] = (acc[response.stage] || 0) + 1
    return acc
  }, {})
  
  return Object.keys(stageFrequency).reduce((a, b) => 
    stageFrequency[a] > stageFrequency[b] ? a : b
  )
}

const saveAssessmentToDatabase = async () => {
  if (!user.value || !evaluation.value) return

  try {
    const calculatedStage = calculatePrimaryStage()

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.value.id,
        responses: responses.value,
        evaluation: evaluation.value,
        primary_stage: parseInt(calculatedStage),
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