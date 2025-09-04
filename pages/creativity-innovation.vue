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
        <div class="text-6xl mb-4">💡</div>
        <div class="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-2">Skills & Strengths Assessment</div>
        <h1 :class="`text-4xl font-bold ${themeClasses.textPrimary} mb-4`">Creativity & Innovation Assessment</h1>
        <p :class="`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`">
          Measure your creative thinking abilities, divergent thinking patterns, and innovation potential. Discover how you approach creative challenges and generate novel solutions.
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
          <h2 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-4`">
            {{ questions[currentQuestion - 1].question }}
          </h2>
          
          <div v-if="questions[currentQuestion - 1].scenario" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4 mb-6 border-l-4 border-indigo-500`">
            <div class="font-semibold text-indigo-600 mb-2">Challenge:</div>
            <div :class="themeClasses.textSecondary">{{ questions[currentQuestion - 1].scenario }}</div>
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
              <div>
                <div :class="`font-medium ${themeClasses.textPrimary}`">{{ option.text }}</div>
                <div v-if="option.description" :class="`text-sm ${themeClasses.textSecondary} mt-1`">{{ option.description }}</div>
              </div>
            </div>
          </button>
        </div>

        <!-- Scale Questions -->
        <div v-if="questions[currentQuestion - 1].type === 'scale'" class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <span :class="`text-sm ${themeClasses.textSecondary}`">{{ questions[currentQuestion - 1].scaleLabels[0] }}</span>
            <span :class="`text-sm ${themeClasses.textSecondary}`">{{ questions[currentQuestion - 1].scaleLabels[1] }}</span>
          </div>
          <div class="flex justify-between space-x-2">
            <button
              v-for="value in [1, 2, 3, 4, 5]"
              :key="value"
              @click="selectAnswer(value)"
              :class="`w-12 h-12 rounded-full border-2 transition-all ${
                answers[currentQuestion - 1] === value
                  ? 'bg-indigo-500 border-indigo-500 text-white'
                  : `${themeClasses.borderColor} ${themeClasses.textSecondary} hover:border-indigo-300`
              }`"
            >
              {{ value }}
            </button>
          </div>
        </div>

        <!-- Creative Tasks (Text Input) -->
        <div v-if="questions[currentQuestion - 1].type === 'creative_task'" class="mb-8">
          <textarea
            v-model="answers[currentQuestion - 1]"
            :placeholder="questions[currentQuestion - 1].placeholder"
            :class="`w-full p-4 border-2 rounded-lg ${themeClasses.borderColor} ${themeClasses.cardBackground} ${themeClasses.textPrimary} focus:border-indigo-500 focus:outline-none`"
            rows="6"
          ></textarea>
          <p :class="`text-sm ${themeClasses.textSecondary} mt-2`">
            {{ questions[currentQuestion - 1].instruction }}
          </p>
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
            :disabled="!isAnswerValid()"
            :class="`px-6 py-2 rounded-lg font-medium transition-colors ${
              isAnswerValid()
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
          <div class="text-6xl mb-4">{{ getCreativityEmoji(results.overall_score) }}</div>
          <h2 :class="`text-3xl font-bold ${themeClasses.textPrimary} mb-2`">{{ results.creativity_level }}</h2>
          <p :class="`text-xl ${themeClasses.textSecondary} mb-6`">Creative Innovation Profile</p>
          
          <div class="max-w-2xl mx-auto">
            <div class="flex justify-between items-center mb-2">
              <span :class="`font-medium ${themeClasses.textPrimary}`">Overall Creativity Score</span>
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

        <!-- Creativity Dimensions -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Creativity Dimensions</h3>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div v-for="dimension in results.dimensions" :key="dimension.name" class="space-y-3">
              <div class="flex justify-between items-center">
                <span :class="`font-medium ${themeClasses.textPrimary}`">{{ dimension.name }}</span>
                <span :class="`text-sm font-bold ${getDimensionColor(dimension.score)}`">
                  {{ dimension.score }}/5
                </span>
              </div>
              <div :class="`w-full bg-gray-200 rounded-full h-2 ${themeClasses.borderColor} border`">
                <div 
                  :class="`h-2 rounded-full transition-all duration-1000 ${getDimensionBarColor(dimension.score)}`"
                  :style="`width: ${(dimension.score / 5) * 100}%`"
                ></div>
              </div>
              <p :class="`text-sm ${themeClasses.textSecondary}`">{{ dimension.description }}</p>
            </div>
          </div>
        </div>

        <!-- Creative Style Profile -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Your Creative Style</h3>
          
          <div :class="`${themeClasses.backgroundSecondary} rounded-lg p-6 border-l-4 border-purple-500`">
            <h4 :class="`text-lg font-semibold ${themeClasses.textPrimary} mb-2`">{{ results.creative_style.name }}</h4>
            <p :class="`${themeClasses.textSecondary} mb-4`">{{ results.creative_style.description }}</p>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <h5 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Strengths:</h5>
                <ul :class="`text-sm ${themeClasses.textSecondary} space-y-1`">
                  <li v-for="strength in results.creative_style.strengths" :key="strength" class="flex items-start space-x-2">
                    <span class="text-green-500 mt-0.5">•</span>
                    <span>{{ strength }}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 :class="`font-semibold ${themeClasses.textPrimary} mb-2`">Development Areas:</h5>
                <ul :class="`text-sm ${themeClasses.textSecondary} space-y-1`">
                  <li v-for="area in results.creative_style.development_areas" :key="area" class="flex items-start space-x-2">
                    <span class="text-orange-500 mt-0.5">•</span>
                    <span>{{ area }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Innovation Potential -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Innovation Enhancement Plan</h3>
          
          <div class="space-y-6">
            <div v-for="(strategy, index) in results.enhancement_strategies" :key="index" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4`">
              <div class="flex items-start space-x-3">
                <div class="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-1`">{{ strategy.title }}</h4>
                  <p :class="`${themeClasses.textSecondary} text-sm mb-2`">{{ strategy.description }}</p>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="technique in strategy.techniques" :key="technique" class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                      {{ technique }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Creative Exercises -->
        <div :class="`${themeClasses.cardBackground} rounded-xl ${themeClasses.cardShadow} p-8`">
          <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Recommended Creative Exercises</h3>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div v-for="exercise in results.recommended_exercises" :key="exercise.name" :class="`${themeClasses.backgroundSecondary} rounded-lg p-4`">
              <h4 :class="`font-semibold ${themeClasses.textPrimary} mb-2 flex items-center`">
                <span class="mr-2">{{ exercise.icon }}</span>
                {{ exercise.name }}
              </h4>
              <p :class="`text-sm ${themeClasses.textSecondary} mb-2`">{{ exercise.description }}</p>
              <div :class="`text-xs ${themeClasses.textSecondary} bg-indigo-50 rounded px-2 py-1 inline-block`">
                {{ exercise.frequency }}
              </div>
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

// Questions array
const questions = ref([
  {
    type: 'multiple_choice',
    category: 'Divergent Thinking',
    question: 'When brainstorming solutions, which approach do you naturally gravitate toward?',
    options: [
      {
        value: 'quantity_first',
        text: 'Generate Many Ideas Quickly',
        description: 'Focus on volume first, then filter and refine later'
      },
      {
        value: 'build_incrementally',
        text: 'Build on Each Idea',
        description: 'Develop each concept thoroughly before moving to the next'
      },
      {
        value: 'category_exploration',
        text: 'Explore Different Categories',
        description: 'Systematically explore various types of solutions'
      },
      {
        value: 'wild_combinations',
        text: 'Make Unusual Connections',
        description: 'Combine unrelated elements to create novel approaches'
      }
    ]
  },
  {
    type: 'creative_task',
    category: 'Alternative Uses',
    question: 'List as many creative uses as possible for a paper clip (beyond holding papers together):',
    placeholder: 'Example: Lock pick, zipper pull, jewelry component...',
    instruction: 'Aim for unusual, original, and diverse uses. Quality over quantity counts!'
  },
  {
    type: 'scale',
    category: 'Risk Taking',
    question: 'How comfortable are you with pursuing ideas that have a high risk of failure but potential for breakthrough innovation?',
    scaleLabels: ['Very uncomfortable', 'Very comfortable']
  },
  {
    type: 'multiple_choice',
    category: 'Problem Solving',
    question: 'You encounter a complex problem that seems impossible to solve. Your first instinct is to:',
    scenario: 'Your team needs to reduce product development time by 50% while maintaining quality and staying within budget constraints.',
    options: [
      {
        value: 'break_down_problem',
        text: 'Break It Into Smaller Parts',
        description: 'Decompose the challenge into manageable components'
      },
      {
        value: 'reframe_question',
        text: 'Question the Assumptions',
        description: 'Challenge the fundamental premises of the problem'
      },
      {
        value: 'seek_analogies',
        text: 'Look for Similar Problems',
        description: 'Find patterns and solutions from other domains'
      },
      {
        value: 'reverse_engineer',
        text: 'Start from the End Goal',
        description: 'Work backwards from the desired outcome'
      }
    ]
  },
  {
    type: 'creative_task',
    category: 'Pattern Recognition',
    question: 'Create a story that connects these three unrelated items: A lighthouse, a broken umbrella, and a recipe book.',
    placeholder: 'Write a creative narrative that meaningfully incorporates all three items...',
    instruction: 'Focus on creating unexpected but logical connections between the items.'
  },
  {
    type: 'scale',
    category: 'Openness to Experience',
    question: 'How often do you actively seek out new experiences, ideas, or perspectives that challenge your current thinking?',
    scaleLabels: ['Rarely or never', 'Constantly']
  },
  {
    type: 'multiple_choice',
    category: 'Innovation Approach',
    question: 'When tasked with improving an existing product or process, you typically:',
    options: [
      {
        value: 'incremental_improvements',
        text: 'Make Incremental Improvements',
        description: 'Focus on optimizing current features and functionality'
      },
      {
        value: 'radical_redesign',
        text: 'Reimagine from Scratch',
        description: 'Question everything and design a completely new approach'
      },
      {
        value: 'user_centered_design',
        text: 'Study User Needs Deeply',
        description: 'Research unmet needs and design solutions around them'
      },
      {
        value: 'technology_integration',
        text: 'Leverage New Technologies',
        description: 'Explore how emerging tech could transform the solution'
      }
    ]
  },
  {
    type: 'creative_task',
    category: 'Idea Development',
    question: 'Imagine a mobile app that helps people make better decisions. Describe three unique features that don\'t exist in current apps:',
    placeholder: 'Feature 1: ...\nFeature 2: ...\nFeature 3: ...',
    instruction: 'Think beyond traditional decision-making tools. Consider psychology, gamification, AI, social elements, etc.'
  },
  {
    type: 'scale',
    category: 'Ambiguity Tolerance',
    question: 'How comfortable are you working on projects where the end goal or success criteria are unclear or constantly changing?',
    scaleLabels: ['Very uncomfortable', 'Thrive in ambiguity']
  },
  {
    type: 'multiple_choice',
    category: 'Creative Collaboration',
    question: 'In a creative team setting, you are most likely to:',
    options: [
      {
        value: 'idea_generator',
        text: 'Be the Idea Generator',
        description: 'Come up with numerous creative concepts and possibilities'
      },
      {
        value: 'concept_refiner',
        text: 'Refine and Improve Ideas',
        description: 'Take good ideas and make them great through iteration'
      },
      {
        value: 'connector_synthesizer',
        text: 'Connect Different Ideas',
        description: 'See relationships and combine concepts in new ways'
      },
      {
        value: 'implementation_planner',
        text: 'Plan Implementation',
        description: 'Figure out how to turn creative ideas into reality'
      }
    ]
  },
  {
    type: 'creative_task',
    category: 'Metaphorical Thinking',
    question: 'Complete this creative analogy: "Innovation is like gardening because..."',
    placeholder: 'Innovation is like gardening because...',
    instruction: 'Create a meaningful metaphor that reveals insights about the innovation process.'
  },
  {
    type: 'scale',
    category: 'Curiosity Drive',
    question: 'How strong is your drive to understand "why" and "how" things work, even when it\'s not directly relevant to your current tasks?',
    scaleLabels: ['Weak drive', 'Insatiable curiosity']
  },
  {
    type: 'multiple_choice',
    category: 'Creative Resources',
    question: 'When you need creative inspiration, you are most likely to:',
    options: [
      {
        value: 'nature_walks',
        text: 'Take Breaks in Nature',
        description: 'Walk, hike, or spend time outdoors to clear your mind'
      },
      {
        value: 'diverse_inputs',
        text: 'Consume Diverse Content',
        description: 'Read, watch, or listen to content outside your field'
      },
      {
        value: 'creative_exercises',
        text: 'Use Structured Exercises',
        description: 'Apply specific brainstorming or creativity techniques'
      },
      {
        value: 'social_interaction',
        text: 'Discuss with Others',
        description: 'Talk through ideas with colleagues, friends, or mentors'
      }
    ]
  }
])

const selectAnswer = (value) => {
  answers.value[currentQuestion.value - 1] = value
}

const isAnswerValid = () => {
  const answer = answers.value[currentQuestion.value - 1]
  const question = questions.value[currentQuestion.value - 1]
  
  if (question.type === 'creative_task') {
    return answer && answer.trim().length >= 10
  }
  
  return answer !== undefined && answer !== null
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
  
  // Calculate dimension scores
  const dimensionScores = {
    'Divergent Thinking': 0,
    'Problem Solving': 0,
    'Originality': 0,
    'Risk Taking': 0,
    'Openness': 0,
    'Implementation': 0
  }
  
  // Score each answer
  answerValues.forEach((answer, index) => {
    const question = questions.value[index]
    let score = 0
    
    if (question.type === 'scale') {
      score = answer
    } else if (question.type === 'multiple_choice') {
      // Strategic scoring for creativity
      const creativityScores = {
        0: { 'quantity_first': 4, 'wild_combinations': 5, 'category_exploration': 4, 'build_incrementally': 3 },
        3: { 'reframe_question': 5, 'seek_analogies': 4, 'reverse_engineer': 4, 'break_down_problem': 3 },
        6: { 'radical_redesign': 5, 'user_centered_design': 4, 'technology_integration': 4, 'incremental_improvements': 3 },
        9: { 'connector_synthesizer': 5, 'idea_generator': 5, 'concept_refiner': 4, 'implementation_planner': 3 },
        12: { 'diverse_inputs': 5, 'nature_walks': 4, 'creative_exercises': 4, 'social_interaction': 4 }
      }
      score = creativityScores[index]?.[answer] || 3
    } else if (question.type === 'creative_task') {
      // Score creative tasks based on length and creativity indicators
      const length = answer.length
      const creativityKeywords = ['unique', 'unusual', 'innovative', 'creative', 'original', 'different', 'novel']
      const hasCreativeLanguage = creativityKeywords.some(word => answer.toLowerCase().includes(word))
      
      if (length > 200 && hasCreativeLanguage) score = 5
      else if (length > 100) score = 4
      else if (length > 50) score = 3
      else score = 2
    }
    
    // Assign to dimensions
    if (index <= 1) dimensionScores['Divergent Thinking'] += score
    else if (index <= 4) dimensionScores['Problem Solving'] += score
    else if (index <= 7) dimensionScores['Originality'] += score
    else if (index <= 8) dimensionScores['Risk Taking'] += score
    else if (index <= 10) dimensionScores['Openness'] += score
    else dimensionScores['Implementation'] += score
  })
  
  // Normalize scores
  const dimensions = Object.keys(dimensionScores).map(key => ({
    name: key,
    score: Math.round((dimensionScores[key] / 10) * 5),
    description: getDimensionDescription(key)
  }))
  
  const overallScore = Math.round((Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 60) * 100)
  
  results.value = {
    overall_score: overallScore,
    creativity_level: getCreativityLevel(overallScore),
    dimensions: dimensions,
    creative_style: getCreativeStyle(dimensions),
    enhancement_strategies: getEnhancementStrategies(dimensions),
    recommended_exercises: getRecommendedExercises(overallScore, dimensions)
  }
  
  // Save results to database
  saveResults()
}

const getDimensionDescription = (dimension) => {
  const descriptions = {
    'Divergent Thinking': 'Ability to generate multiple creative solutions and think outside conventional boundaries',
    'Problem Solving': 'Approaching challenges with creative and innovative methodologies',
    'Originality': 'Generating novel, unique, and uncommon ideas and solutions',
    'Risk Taking': 'Willingness to pursue uncertain paths that may lead to breakthrough innovations',
    'Openness': 'Receptiveness to new experiences, ideas, and unconventional approaches',
    'Implementation': 'Ability to turn creative ideas into practical, actionable solutions'
  }
  return descriptions[dimension] || ''
}

const getCreativityLevel = (score) => {
  if (score >= 90) return 'Exceptional Creative Innovator'
  if (score >= 80) return 'Advanced Creative Thinker'
  if (score >= 70) return 'Strong Creative Problem Solver'
  if (score >= 60) return 'Developing Creative Mind'
  return 'Emerging Creative Potential'
}

const getCreativeStyle = (dimensions) => {
  const topDimensions = dimensions
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(d => d.name)
  
  const styles = {
    'Divergent Thinking,Problem Solving': {
      name: 'The Idea Explorer',
      description: 'You excel at generating numerous creative solutions and approaching problems from multiple angles. You thrive in brainstorming and initial conceptualization phases.',
      strengths: ['Generates many unique ideas', 'Approaches problems creatively', 'Excellent at brainstorming', 'Sees multiple possibilities'],
      development_areas: ['Focus on implementation', 'Develop evaluation criteria', 'Practice iterative refinement', 'Build consensus skills']
    },
    'Originality,Risk Taking': {
      name: 'The Bold Innovator',
      description: 'You push boundaries and aren\'t afraid to pursue unconventional ideas that others might shy away from. You bring truly original thinking to challenges.',
      strengths: ['Highly original thinking', 'Comfortable with ambiguity', 'Pursues breakthrough ideas', 'Challenges conventional wisdom'],
      development_areas: ['Consider practical constraints', 'Build stakeholder support', 'Develop risk assessment skills', 'Practice incremental innovation']
    },
    'Implementation,Problem Solving': {
      name: 'The Creative Pragmatist',
      description: 'You balance creativity with practicality, focusing on solutions that are both innovative and feasible. You excel at making creative ideas work in the real world.',
      strengths: ['Practical creativity', 'Solution-focused', 'Strong execution skills', 'Balances innovation with feasibility'],
      development_areas: ['Expand ideation techniques', 'Embrace more ambiguity', 'Explore radical alternatives', 'Practice divergent thinking']
    }
  }
  
  const key = topDimensions.join(',')
  return styles[key] || {
    name: 'The Balanced Creator',
    description: 'You demonstrate well-rounded creative capabilities across multiple dimensions. You can adapt your creative approach based on the situation and requirements.',
    strengths: ['Versatile creative skills', 'Adapts to different contexts', 'Balanced approach', 'Collaborative creativity'],
    development_areas: ['Develop specialty strengths', 'Practice advanced techniques', 'Build creative confidence', 'Explore new domains']
  }
}

const getEnhancementStrategies = (dimensions) => {
  const strategies = [
    {
      title: 'Practice Divergent Thinking Exercises',
      description: 'Regularly engage in activities that expand your idea generation capabilities',
      techniques: ['Brainstorming variations', 'SCAMPER method', 'Random word association', 'Mind mapping']
    },
    {
      title: 'Develop Cross-Domain Knowledge',
      description: 'Study fields outside your expertise to create unexpected connections',
      techniques: ['Read diverse materials', 'Attend different conferences', 'Learn new skills', 'Travel and explore']
    },
    {
      title: 'Build Creative Habits',
      description: 'Establish daily practices that nurture and maintain your creative abilities',
      techniques: ['Morning pages', 'Daily sketching', 'Idea journals', 'Creative challenges']
    }
  ]
  
  // Add specific strategies based on weak dimensions
  const weakDimensions = dimensions.filter(d => d.score <= 3)
  
  weakDimensions.forEach(dim => {
    if (dim.name === 'Risk Taking') {
      strategies.push({
        title: 'Gradually Increase Creative Risk-Taking',
        description: 'Build confidence in pursuing more ambitious creative projects',
        techniques: ['Small experiments', 'Rapid prototyping', 'Failure parties', 'Safe-to-fail pilots']
      })
    }
    if (dim.name === 'Implementation') {
      strategies.push({
        title: 'Strengthen Implementation Skills',
        description: 'Learn to turn creative ideas into practical, actionable solutions',
        techniques: ['Project management', 'Prototyping skills', 'User testing', 'Iterative development']
      })
    }
  })
  
  return strategies.slice(0, 4)
}

const getRecommendedExercises = (overallScore, dimensions) => {
  const baseExercises = [
    {
      name: 'Alternative Uses Challenge',
      icon: '🔄',
      description: 'Find creative uses for everyday objects to stretch divergent thinking',
      frequency: 'Daily, 5 minutes'
    },
    {
      name: 'Random Word Inspiration',
      icon: '🎲',
      description: 'Use random words to spark new ideas for current projects',
      frequency: 'Weekly, 15 minutes'
    },
    {
      name: 'Creative Constraints',
      icon: '📐',
      description: 'Solve problems with artificial limitations to boost creativity',
      frequency: '2-3 times per week'
    },
    {
      name: 'Perspective Shifting',
      icon: '👁️',
      description: 'Approach problems from different personas or viewpoints',
      frequency: 'Weekly, 20 minutes'
    }
  ]
  
  // Add specialized exercises based on areas for development
  if (overallScore < 70) {
    baseExercises.push({
      name: 'Idea Cross-Pollination',
      icon: '🌸',
      description: 'Combine ideas from different industries or domains',
      frequency: 'Bi-weekly, 30 minutes'
    })
  }
  
  const topWeakDimension = dimensions.sort((a, b) => a.score - b.score)[0]
  if (topWeakDimension.name === 'Originality') {
    baseExercises.push({
      name: 'Unconventional Analogies',
      icon: '🔗',
      description: 'Create unusual metaphors and analogies to describe concepts',
      frequency: 'Daily, 10 minutes'
    })
  }
  
  return baseExercises.slice(0, 6)
}

const getCreativityEmoji = (score) => {
  if (score >= 90) return '🚀'
  if (score >= 80) return '💡'
  if (score >= 70) return '🎨'
  if (score >= 60) return '⚡'
  return '🌱'
}

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-gradient-to-r from-purple-400 to-pink-600'
  if (score >= 60) return 'bg-gradient-to-r from-blue-400 to-purple-600'
  if (score >= 40) return 'bg-gradient-to-r from-green-400 to-blue-600'
  return 'bg-gradient-to-r from-yellow-400 to-green-600'
}

const getDimensionColor = (score) => {
  if (score >= 4) return 'text-purple-600'
  if (score >= 3) return 'text-blue-600'
  if (score >= 2) return 'text-green-600'
  return 'text-yellow-600'
}

const getDimensionBarColor = (score) => {
  if (score >= 4) return 'bg-gradient-to-r from-purple-400 to-purple-600'
  if (score >= 3) return 'bg-gradient-to-r from-blue-400 to-blue-600'
  if (score >= 2) return 'bg-gradient-to-r from-green-400 to-green-600'
  return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
}

const saveResults = async () => {
  if (!user.value) return
  
  try {
    const { data, error } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: user.value.id,
          test_type_id: 'creativity_assessment',
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
  title: 'Creativity & Innovation Assessment - Assessment Platform',
  meta: [
    { name: 'description', content: 'Measure your creative thinking abilities, divergent thinking patterns, and innovation potential. Discover how you approach creative challenges and generate novel solutions.' }
  ]
})
</script>