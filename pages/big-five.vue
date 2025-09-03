<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink :to="$localePath('/')" class="text-xl font-bold text-gray-900">
              ← Assessment Platform
            </NuxtLink>
            <h1 class="text-xl font-bold text-purple-600">
              Big Five Personality Test
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

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Progress Bar -->
      <div class="mb-8">
        <div class="bg-gray-200 rounded-full h-3">
          <div
            class="bg-purple-600 h-3 rounded-full transition-all duration-300"
            :style="{
              width: `${(currentQuestion / questions.length) * 100}%`,
            }"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span>Progress: {{ Math.round((currentQuestion / questions.length) * 100) }}%</span>
          <span>Estimated time remaining: {{ Math.ceil((questions.length - currentQuestion) * 0.5) }} minutes</span>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🧭</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Assessment Complete!
          </h2>
          <div class="text-lg text-gray-600">
            Your Big Five personality profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Personality Dimensions -->
          <div class="grid md:grid-cols-2 gap-6">
            <div 
              v-for="(dimension, key) in results.dimensions" 
              :key="key"
              class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-purple-800">{{ getDimensionName(key) }}</h3>
                <div class="text-2xl font-bold text-purple-600">{{ dimension.score }}%</div>
              </div>
              
              <!-- Progress bar for this dimension -->
              <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  class="bg-purple-600 h-3 rounded-full transition-all duration-1000"
                  :style="{ width: `${dimension.score}%` }"
                ></div>
              </div>
              
              <p class="text-purple-700 text-sm mb-2">{{ dimension.description }}</p>
              <div class="text-xs text-purple-600">
                <strong>{{ dimension.level }}:</strong> {{ dimension.interpretation }}
              </div>
            </div>
          </div>

          <!-- Overall Summary -->
          <div class="bg-white rounded-xl p-6 border-2 border-purple-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Your Personality Profile</h3>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed">{{ results.summary }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <NuxtLink
              :to="$localePath('/profile')"
              class="flex-1 bg-purple-600 text-white text-center py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
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
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Calculating your personality profile...</p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Rate how well this statement describes you:
          </h2>
          <div class="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
            <p class="text-lg text-gray-800 font-medium">
              {{ questions[currentQuestion]?.statement }}
            </p>
          </div>
        </div>

        <!-- Likert Scale Options -->
        <div class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <button
              v-for="(option, index) in likertOptions"
              :key="index"
              @click="selectAnswer(index + 1)"
              :class="{
                'bg-purple-600 text-white border-purple-600': selectedAnswer === index + 1,
                'bg-white text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-300': selectedAnswer !== index + 1
              }"
              class="p-4 border-2 rounded-lg transition-all duration-200 text-center"
            >
              <div class="font-semibold mb-2">{{ option.label }}</div>
              <div class="text-sm">{{ option.description }}</div>
            </button>
          </div>
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
              'bg-purple-600 text-white hover:bg-purple-700': selectedAnswer,
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

// Likert scale options
const likertOptions = [
  { label: 'Strongly Disagree', description: 'Not at all like me' },
  { label: 'Disagree', description: 'Mostly not like me' },
  { label: 'Neutral', description: 'Somewhat like me' },
  { label: 'Agree', description: 'Mostly like me' },
  { label: 'Strongly Agree', description: 'Very much like me' }
];

// Big Five questions (shortened version - 50 questions, 10 per dimension)
const questions = ref([
  // Openness to Experience (10 questions)
  { statement: "I have a vivid imagination", dimension: "openness", reverse: false },
  { statement: "I am interested in abstract ideas", dimension: "openness", reverse: false },
  { statement: "I enjoy hearing new ideas", dimension: "openness", reverse: false },
  { statement: "I like to solve complex problems", dimension: "openness", reverse: false },
  { statement: "I enjoy thinking about philosophical questions", dimension: "openness", reverse: false },
  { statement: "I have difficulty understanding abstract ideas", dimension: "openness", reverse: true },
  { statement: "I am not interested in abstract ideas", dimension: "openness", reverse: true },
  { statement: "I do not like art and music", dimension: "openness", reverse: true },
  { statement: "I avoid philosophical discussions", dimension: "openness", reverse: true },
  { statement: "I rarely look for deeper meaning in things", dimension: "openness", reverse: true },

  // Conscientiousness (10 questions)
  { statement: "I am always prepared for everything", dimension: "conscientiousness", reverse: false },
  { statement: "I pay attention to details", dimension: "conscientiousness", reverse: false },
  { statement: "I get chores done right away", dimension: "conscientiousness", reverse: false },
  { statement: "I follow a schedule", dimension: "conscientiousness", reverse: false },
  { statement: "I am exacting in my work", dimension: "conscientiousness", reverse: false },
  { statement: "I leave my belongings around", dimension: "conscientiousness", reverse: true },
  { statement: "I make a mess of things", dimension: "conscientiousness", reverse: true },
  { statement: "I often forget to put things back in their proper place", dimension: "conscientiousness", reverse: true },
  { statement: "I shirk my duties", dimension: "conscientiousness", reverse: true },
  { statement: "I waste my time", dimension: "conscientiousness", reverse: true },

  // Extraversion (10 questions)
  { statement: "I start conversations with strangers", dimension: "extraversion", reverse: false },
  { statement: "I talk to a lot of different people at parties", dimension: "extraversion", reverse: false },
  { statement: "I feel comfortable around people", dimension: "extraversion", reverse: false },
  { statement: "I like to be the center of attention", dimension: "extraversion", reverse: false },
  { statement: "I make friends easily", dimension: "extraversion", reverse: false },
  { statement: "I don't talk a lot", dimension: "extraversion", reverse: true },
  { statement: "I keep in the background", dimension: "extraversion", reverse: true },
  { statement: "I have little to say", dimension: "extraversion", reverse: true },
  { statement: "I don't like to draw attention to myself", dimension: "extraversion", reverse: true },
  { statement: "I am quiet around strangers", dimension: "extraversion", reverse: true },

  // Agreeableness (10 questions)  
  { statement: "I am interested in people", dimension: "agreeableness", reverse: false },
  { statement: "I sympathize with others' feelings", dimension: "agreeableness", reverse: false },
  { statement: "I have a soft heart", dimension: "agreeableness", reverse: false },
  { statement: "I take time out for others", dimension: "agreeableness", reverse: false },
  { statement: "I feel others' emotions", dimension: "agreeableness", reverse: false },
  { statement: "I am not interested in other people's problems", dimension: "agreeableness", reverse: true },
  { statement: "I insult people", dimension: "agreeableness", reverse: true },
  { statement: "I am not really interested in others", dimension: "agreeableness", reverse: true },
  { statement: "I feel little concern for others", dimension: "agreeableness", reverse: true },
  { statement: "I make people feel at ease", dimension: "agreeableness", reverse: false },

  // Neuroticism (10 questions)
  { statement: "I get stressed out easily", dimension: "neuroticism", reverse: false },
  { statement: "I worry about things", dimension: "neuroticism", reverse: false },
  { statement: "I get upset easily", dimension: "neuroticism", reverse: false },
  { statement: "I change my mood a lot", dimension: "neuroticism", reverse: false },
  { statement: "I have frequent mood swings", dimension: "neuroticism", reverse: false },
  { statement: "I am relaxed most of the time", dimension: "neuroticism", reverse: true },
  { statement: "I seldom feel blue", dimension: "neuroticism", reverse: true },
  { statement: "I am not easily bothered by things", dimension: "neuroticism", reverse: true },
  { statement: "I rarely get irritated", dimension: "neuroticism", reverse: true },
  { statement: "I remain calm under pressure", dimension: "neuroticism", reverse: true }
]);

// Helper functions
const getDimensionName = (dimension) => {
  const names = {
    'openness': 'Openness to Experience',
    'conscientiousness': 'Conscientiousness', 
    'extraversion': 'Extraversion',
    'agreeableness': 'Agreeableness',
    'neuroticism': 'Neuroticism'
  };
  return names[dimension] || dimension;
};

const selectAnswer = (value) => {
  selectedAnswer.value = value;
};

const nextQuestion = async () => {
  if (!selectedAnswer.value) return;

  // Store response
  responses.value.push({
    question: currentQuestion.value,
    statement: questions.value[currentQuestion.value].statement,
    dimension: questions.value[currentQuestion.value].dimension,
    reverse: questions.value[currentQuestion.value].reverse,
    answer: selectedAnswer.value
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
      selectedAnswer.value = previousResponse.answer;
    }
  }
};

const calculateResults = async () => {
  // Calculate scores for each dimension
  const dimensions = {
    openness: { total: 0, count: 0 },
    conscientiousness: { total: 0, count: 0 },
    extraversion: { total: 0, count: 0 },
    agreeableness: { total: 0, count: 0 },
    neuroticism: { total: 0, count: 0 }
  };

  // Sum scores for each dimension
  responses.value.forEach(response => {
    const score = response.reverse ? (6 - response.answer) : response.answer;
    dimensions[response.dimension].total += score;
    dimensions[response.dimension].count += 1;
  });

  // Calculate percentages and interpretations
  const dimensionResults = {};
  for (const [key, data] of Object.entries(dimensions)) {
    const average = data.total / data.count;
    const percentage = Math.round(((average - 1) / 4) * 100);
    
    dimensionResults[key] = {
      score: percentage,
      level: getLevel(percentage),
      description: getDimensionDescription(key),
      interpretation: getInterpretation(key, percentage)
    };
  }

  // Generate overall summary
  const summary = generateSummary(dimensionResults);

  results.value = {
    dimensions: dimensionResults,
    summary: summary,
    completedAt: new Date().toISOString()
  };
};

const getLevel = (percentage) => {
  if (percentage >= 80) return 'Very High';
  if (percentage >= 60) return 'High';
  if (percentage >= 40) return 'Moderate';
  if (percentage >= 20) return 'Low';
  return 'Very Low';
};

const getDimensionDescription = (dimension) => {
  const descriptions = {
    'openness': 'Appreciation for art, emotion, adventure, and variety of experiences',
    'conscientiousness': 'Tendency to be organized, responsible, and hardworking',
    'extraversion': 'Energy directed outward, sociability, and positive emotions',
    'agreeableness': 'Compassion and cooperation rather than suspicion and antagonism',
    'neuroticism': 'Tendency toward emotional instability and negative emotions'
  };
  return descriptions[dimension];
};

const getInterpretation = (dimension, percentage) => {
  const interpretations = {
    'openness': {
      high: 'You enjoy new experiences and thinking creatively',
      low: 'You prefer routine and traditional approaches'
    },
    'conscientiousness': {
      high: 'You are organized, disciplined, and reliable',
      low: 'You are more flexible and spontaneous'  
    },
    'extraversion': {
      high: 'You are outgoing, energetic, and social',
      low: 'You prefer quiet environments and small groups'
    },
    'agreeableness': {
      high: 'You are cooperative, trusting, and helpful',
      low: 'You are more competitive and skeptical'
    },
    'neuroticism': {
      high: 'You experience emotions intensely and may worry more',
      low: 'You are emotionally stable and resilient'
    }
  };
  return interpretations[dimension][percentage >= 50 ? 'high' : 'low'];
};

const generateSummary = (dimensions) => {
  const highest = Object.entries(dimensions)
    .sort(([,a], [,b]) => b.score - a.score)[0];
  
  const lowest = Object.entries(dimensions)
    .sort(([,a], [,b]) => a.score - b.score)[0];

  return `Your personality profile shows ${getDimensionName(highest[0])} as your strongest trait (${highest[1].score}%), indicating ${highest[1].interpretation.toLowerCase()}. Your lowest dimension is ${getDimensionName(lowest[0])} (${lowest[1].score}%), suggesting ${lowest[1].interpretation.toLowerCase()}. This unique combination shapes how you interact with the world and approach different situations.`;
};

const saveAssessment = async () => {
  if (!user.value || !results.value) return;

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'big_five_personality',
      test_variant_id: 'big_five_standard',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: null, // Not applicable for personality tests
      session_number: 1,
      questions_count: questions.value.length,
      assessment_type: 'personality',
      completed_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error saving assessment:', error);
    } else {
      console.log('Big Five assessment saved successfully');
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
  title: 'Big Five Personality Test - Assessment Platform',
  meta: [
    { name: 'description', content: 'Take the comprehensive Big Five personality assessment to discover your unique personality profile across five major dimensions.' }
  ]
});
</script>