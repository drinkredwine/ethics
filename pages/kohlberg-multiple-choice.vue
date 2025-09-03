<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink :to="$localePath('/')" class="text-xl font-bold text-gray-900">
              ← Assessment Platform
            </NuxtLink>
            <h1 class="text-xl font-bold text-teal-600">
              Kohlberg Moral Development (Multiple Choice)
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <LanguagePicker />
            <span class="text-gray-600"
              >Question {{ currentQuestion + 1 }} of {{ scenarios.length }}
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
            class="bg-teal-600 h-3 rounded-full transition-all duration-300"
            :style="{
              width: `${(currentQuestion / scenarios.length) * 100}%`,
            }"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-600 mt-2">
          <span>Progress: {{ Math.round((currentQuestion / scenarios.length) * 100) }}%</span>
          <span>Ethical Dilemma Assessment</span>
        </div>
      </div>

      <!-- Assessment Complete -->
      <div v-if="assessmentComplete" class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">⚖️</div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Assessment Complete!
          </h2>
          <div class="text-lg text-gray-600">
            Your moral development profile is ready
          </div>
        </div>

        <div v-if="results" class="space-y-6">
          <!-- Overall Stage -->
          <div class="text-center bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 mb-8">
            <div class="text-4xl font-bold text-teal-600 mb-2">Stage {{ results.primaryStage }}</div>
            <div class="text-lg font-semibold text-gray-800">{{ getStageName(results.primaryStage) }}</div>
            <div class="text-teal-700">{{ results.confidence }} Confidence</div>
          </div>

          <!-- Stage Distribution -->
          <div class="grid md:grid-cols-3 gap-6">
            <div 
              v-for="(stage, stageNum) in results.stageDistribution" 
              :key="stageNum"
              class="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6"
              :class="{ 'ring-2 ring-teal-500': parseInt(stageNum) === results.primaryStage }"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-teal-800">Stage {{ stageNum }}</h3>
                <div class="text-2xl font-bold text-teal-600">{{ Math.round(stage.percentage) }}%</div>
              </div>
              
              <!-- Progress bar for this stage -->
              <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  class="bg-teal-600 h-3 rounded-full transition-all duration-1000"
                  :style="{ width: `${stage.percentage}%` }"
                ></div>
              </div>
              
              <p class="text-teal-700 text-sm mb-2">{{ getStageName(parseInt(stageNum)) }}</p>
              <div class="text-xs text-teal-600">
                {{ stage.responses }} response(s)
              </div>
            </div>
          </div>

          <!-- Analysis -->
          <div class="bg-white rounded-xl p-6 border-2 border-teal-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">📊 Your Moral Reasoning Profile</h3>
            <div class="prose max-w-none">
              <p class="text-gray-700 leading-relaxed mb-4">{{ results.analysis }}</p>
              <div class="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
                <div class="font-semibold text-teal-800 mb-2">Key Insights:</div>
                <ul class="list-disc list-inside text-teal-700 space-y-1">
                  <li v-for="insight in results.insights" :key="insight">{{ insight }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Growth Recommendations -->
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
            <h3 class="text-xl font-bold text-emerald-900 mb-4">🌱 Growth Recommendations</h3>
            <div class="space-y-3">
              <div 
                v-for="(recommendation, index) in results.recommendations" 
                :key="index"
                class="bg-white p-4 rounded-lg border border-emerald-200"
              >
                <div class="font-semibold text-emerald-800 mb-1">{{ recommendation.title }}</div>
                <div class="text-emerald-700 text-sm">{{ recommendation.description }}</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6">
            <NuxtLink
              :to="$localePath('/test/kohlberg_moral')"
              class="flex-1 bg-teal-100 text-teal-800 text-center py-3 px-6 rounded-lg hover:bg-teal-200 transition-colors font-medium"
            >
              Try Free Text Version
            </NuxtLink>
            <NuxtLink
              :to="$localePath('/profile')"
              class="flex-1 bg-teal-600 text-white text-center py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              View Full Profile
            </NuxtLink>
            <NuxtLink
              :to="$localePath('/')"
              class="flex-1 bg-gray-100 text-gray-900 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Take Another Test
            </NuxtLink>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Analyzing your moral reasoning patterns...</p>
        </div>
      </div>

      <!-- Current Question -->
      <div v-else-if="scenarios.length > 0" class="bg-white rounded-lg shadow-lg p-8">
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <div class="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mr-4">
              Moral Dilemma
            </div>
            <div class="text-sm text-gray-500">
              Scenario {{ currentQuestion + 1 }} of {{ scenarios.length }}
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ scenarios[currentQuestion]?.title }}
          </h2>
          
          <div class="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500 mb-6">
            <p class="text-lg text-gray-800 leading-relaxed">
              {{ scenarios[currentQuestion]?.scenario }}
            </p>
          </div>

          <div class="text-lg font-semibold text-gray-900 mb-4">
            What would you do and why?
          </div>
        </div>

        <!-- Multiple Choice Options -->
        <div class="mb-8 space-y-3">
          <button
            v-for="(option, index) in scenarios[currentQuestion]?.options"
            :key="index"
            @click="selectAnswer(option)"
            :class="{
              'bg-teal-600 text-white border-teal-600': selectedAnswer === option,
              'bg-white text-gray-700 border-gray-300 hover:bg-teal-50 hover:border-teal-300': selectedAnswer !== option
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
              'bg-teal-600 text-white hover:bg-teal-700': selectedAnswer,
              'bg-gray-300 text-gray-500 cursor-not-allowed': !selectedAnswer
            }"
            class="px-8 py-3 rounded-lg transition-colors font-medium"
          >
            {{
              currentQuestion === scenarios.length - 1
                ? 'Complete Assessment'
                : 'Next →'
            }}
          </button>
        </div>
      </div>

      <!-- Loading scenarios -->
      <div v-else class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading moral dilemmas...</p>
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

// Import scenarios from the data file
const { getRandomScenarios } = await import('~/data/scenarios');
const scenarios = ref([]);

// Helper functions
const getStageName = (stage) => {
  const names = {
    1: 'Punishment Avoidance',
    2: 'Self-Interest',
    3: 'Social Approval',
    4: 'Law and Order',
    5: 'Social Contract',
    6: 'Universal Principles'
  };
  return names[stage] || `Stage ${stage}`;
};

const selectAnswer = (option) => {
  selectedAnswer.value = option;
};

const nextQuestion = async () => {
  if (!selectedAnswer.value) return;

  // Store response
  responses.value.push({
    question: currentQuestion.value,
    scenarioId: scenarios.value[currentQuestion.value].id,
    scenarioTitle: scenarios.value[currentQuestion.value].title,
    selectedOption: selectedAnswer.value,
    stage: selectedAnswer.value.stage
  });

  // Complete assessment
  if (currentQuestion.value === scenarios.value.length - 1) {
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
  // Count responses by stage
  const stageCounts = {};
  responses.value.forEach(response => {
    const stage = response.stage;
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
  });

  // Calculate stage distribution
  const stageDistribution = {};
  const totalResponses = responses.value.length;
  
  for (let stage = 1; stage <= 6; stage++) {
    const count = stageCounts[stage] || 0;
    stageDistribution[stage] = {
      responses: count,
      percentage: (count / totalResponses) * 100
    };
  }

  // Find primary stage (most frequent)
  const primaryStage = Object.entries(stageCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || '1';

  // Calculate confidence based on distribution
  const maxCount = Math.max(...Object.values(stageCounts));
  const confidencePercent = (maxCount / totalResponses) * 100;
  const confidence = confidencePercent >= 60 ? 'High' : 
                    confidencePercent >= 40 ? 'Medium' : 'Low';

  // Generate analysis
  const analysis = generateAnalysis(parseInt(primaryStage), stageDistribution, responses.value);
  const insights = generateInsights(stageDistribution, responses.value);
  const recommendations = generateRecommendations(parseInt(primaryStage));

  results.value = {
    primaryStage: parseInt(primaryStage),
    confidence: confidence,
    stageDistribution: stageDistribution,
    analysis: analysis,
    insights: insights,
    recommendations: recommendations,
    completedAt: new Date().toISOString()
  };
};

const generateAnalysis = (primaryStage, distribution, responses) => {
  const stageDescriptions = {
    1: 'Your moral reasoning primarily focuses on avoiding punishment and consequences. This represents a basic but important foundation of moral thinking.',
    2: 'You tend to make moral decisions based on personal benefit and reciprocity. Your reasoning shows awareness of self-interest in ethical choices.',
    3: 'Your moral reasoning emphasizes being viewed positively by others and maintaining good relationships. Social approval plays a significant role in your decisions.',
    4: 'You strongly value rules, laws, and social order in your moral reasoning. Maintaining societal systems is important to your ethical framework.',
    5: 'Your moral reasoning considers social contracts and individual rights. You balance societal needs with personal freedoms in ethical decisions.',
    6: 'Your moral reasoning is guided by universal ethical principles that transcend specific situations. You demonstrate the highest level of moral development.'
  };

  const diversityComment = Object.values(distribution).filter(d => d.percentage > 0).length > 3 
    ? ' Your responses show diversity across multiple stages, indicating a nuanced approach to moral reasoning.'
    : ' Your responses are relatively consistent, showing a clear moral reasoning pattern.';

  return stageDescriptions[primaryStage] + diversityComment;
};

const generateInsights = (distribution, responses) => {
  const insights = [];
  
  // Distribution insights
  const activeStages = Object.entries(distribution)
    .filter(([stage, data]) => data.percentage > 0)
    .map(([stage, data]) => ({ stage: parseInt(stage), ...data }));

  if (activeStages.length === 1) {
    insights.push('You showed consistent moral reasoning across all dilemmas');
  } else if (activeStages.length > 4) {
    insights.push('You demonstrated flexible thinking across multiple moral frameworks');
  }

  // Stage-specific insights
  const highestStage = Math.max(...activeStages.map(s => s.stage));
  const lowestStage = Math.min(...activeStages.map(s => s.stage));

  if (highestStage >= 5) {
    insights.push('You demonstrate advanced moral reasoning with consideration of universal principles');
  }

  if (distribution[3]?.percentage >= 30) {
    insights.push('Relationships and social harmony are important factors in your moral decisions');
  }

  if (distribution[4]?.percentage >= 30) {
    insights.push('You value law, order, and institutional frameworks in ethical reasoning');
  }

  return insights;
};

const generateRecommendations = (primaryStage) => {
  const recommendations = [];

  if (primaryStage <= 2) {
    recommendations.push({
      title: 'Expand Perspective',
      description: 'Consider how your actions affect others and broader communities, not just yourself'
    });
    recommendations.push({
      title: 'Explore Social Responsibility',
      description: 'Reflect on your role and responsibilities within your communities'
    });
  } else if (primaryStage <= 4) {
    recommendations.push({
      title: 'Question Authority',
      description: 'Sometimes consider whether rules and laws truly serve justice and fairness'
    });
    recommendations.push({
      title: 'Think Beyond Groups',
      description: 'Consider universal human rights and values that transcend specific communities'
    });
  } else {
    recommendations.push({
      title: 'Apply Your Principles',
      description: 'Use your advanced moral reasoning to help others develop their ethical thinking'
    });
    recommendations.push({
      title: 'Stay Consistent',
      description: 'Continue applying your principled approach even when it\'s difficult or unpopular'
    });
  }

  recommendations.push({
    title: 'Continue Learning',
    description: 'Engage with diverse ethical perspectives through books, discussions, and real-world scenarios'
  });

  return recommendations;
};

const saveAssessment = async () => {
  if (!user.value || !results.value) return;

  try {
    const { error } = await supabase.from('assessments').insert({
      user_id: user.value.id,
      test_type_id: 'kohlberg_moral',
      test_variant_id: 'kohlberg_moral_multiple',
      responses: responses.value,
      evaluation: results.value,
      primary_stage: results.value.primaryStage,
      session_number: 1,
      questions_count: scenarios.value.length,
      assessment_type: 'values',
      completed_at: new Date().toISOString()
    });

    if (error) {
      console.error('Error saving assessment:', error);
    } else {
      console.log('Kohlberg multiple choice assessment saved successfully');
    }
  } catch (error) {
    console.error('Failed to save assessment:', error);
  }
};

const logout = async () => {
  await supabase.auth.signOut();
  await navigateTo('/');
};

// Load scenarios on component mount
onMounted(() => {
  scenarios.value = getRandomScenarios(5); // Get 5 random scenarios
});

useHead({
  title: 'Kohlberg Moral Development (Multiple Choice) - Assessment Platform',
  meta: [
    { name: 'description', content: 'Assess your moral reasoning stage through multiple choice responses to ethical dilemmas, based on Lawrence Kohlberg\'s theory of moral development.' }
  ]
});
</script>