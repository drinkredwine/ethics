<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="!showResults" class="space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Adult Development Stages Assessment
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Based on Robert Kegan's theory of adult psychological development
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

      <div v-if="!isComplete" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Development Area: {{ getCurrentDomain().name }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ getCurrentDomain().description }}
          </p>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ currentQuestion.text }}
          </h3>
          
          <div class="space-y-3">
            <label v-for="(option, index) in currentQuestion.options" :key="index" 
                   class="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                   :class="selectedAnswer === index ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
              <input type="radio" 
                     :name="`question-${currentQuestionIndex}`" 
                     :value="index" 
                     v-model="selectedAnswer" 
                     class="mr-3 mt-1 text-blue-600 flex-shrink-0">
              <div>
                <div class="text-gray-900 dark:text-white font-medium mb-1">{{ option.text }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">{{ option.explanation }}</div>
              </div>
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
          Your Adult Development Profile
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Understanding your current stage of psychological development
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Primary Development Stage: {{ results.primaryStage.name }}
        </h2>
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-4">{{ results.primaryStage.description }}</p>
        
        <div class="grid md:grid-cols-2 gap-6 mt-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Key Characteristics</h3>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li v-for="characteristic in results.primaryStage.characteristics" :key="characteristic" 
                  class="flex items-start">
                <span class="mr-2 text-blue-600">•</span>
                {{ characteristic }}
              </li>
            </ul>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">Growth Opportunities</h3>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li v-for="opportunity in results.primaryStage.growthOpportunities" :key="opportunity" 
                  class="flex items-start">
                <span class="mr-2 text-green-600">+</span>
                {{ opportunity }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="stage in developmentStages" :key="stage.id" 
             class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border-2"
             :class="stage.id === results.primaryStage.id ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ stage.name }}</h3>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600">{{ results.stageScores[stage.id] }}%</div>
              <div class="text-xs text-gray-500">alignment</div>
            </div>
          </div>
          
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div class="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                 :style="{width: results.stageScores[stage.id] + '%'}"></div>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ stage.shortDescription }}</p>
          
          <div v-if="stage.id === results.primaryStage.id" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">Your Primary Stage</div>
            <div class="text-xs text-blue-700 dark:text-blue-400">This represents your predominant way of making meaning</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Development Domain Analysis
        </h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="domain in domainResults" :key="domain.name" class="space-y-3">
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ domain.name }}</h4>
              <span class="text-sm font-semibold text-gray-600 dark:text-gray-400">
                {{ domain.dominantStage }}
              </span>
            </div>
            <div class="space-y-2">
              <div v-for="stage in developmentStages" :key="stage.id" class="flex items-center space-x-2">
                <span class="text-xs w-20 text-gray-500">{{ stage.name }}</span>
                <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                       :style="{width: domain.stageScores[stage.id] + '%'}"></div>
                </div>
                <span class="text-xs text-gray-500 w-8 text-right">{{ domain.stageScores[stage.id] }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Development Pathway & Recommendations
        </h3>
        
        <div class="space-y-6">
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2">Current Strengths</h4>
            <ul class="text-sm text-green-700 dark:text-green-400 space-y-1">
              <li v-for="strength in results.currentStrengths" :key="strength" class="flex items-start">
                <span class="mr-2">✓</span>{{ strength }}
              </li>
            </ul>
          </div>
          
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">Next Development Edge</h4>
            <p class="text-sm text-blue-700 dark:text-blue-400 mb-3">{{ results.developmentEdge }}</p>
            <ul class="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li v-for="practice in results.developmentPractices" :key="practice" class="flex items-start">
                <span class="mr-2">→</span>{{ practice }}
              </li>
            </ul>
          </div>
          
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Areas for Awareness</h4>
            <ul class="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
              <li v-for="awareness in results.awarenessAreas" :key="awareness" class="flex items-start">
                <span class="mr-2">!</span>{{ awareness }}
              </li>
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
import { ref, computed, onMounted } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)
const answers = ref([])
const showResults = ref(false)
const isComplete = ref(false)
const results = ref(null)

const developmentStages = [
  {
    id: 2,
    name: 'Socialized Mind',
    shortDescription: 'Shaped by the expectations and demands of our environment',
    description: 'At this stage, you are primarily oriented by the expectations and demands of your environment. Your sense of self is largely derived from your roles, relationships, and the approval of others.',
    characteristics: [
      'Strong sense of loyalty to groups and institutions',
      'Identity tied to roles and relationships',
      'Seeks approval and validation from others',
      'Values harmony and belonging',
      'May struggle with conflicting loyalties'
    ],
    growthOpportunities: [
      'Develop personal values independent of others',
      'Practice making decisions based on inner compass',
      'Explore personal identity beyond roles',
      'Learn to manage conflicting expectations'
    ]
  },
  {
    id: 3,
    name: 'Self-Authoring Mind',
    shortDescription: 'Driven by own internal compass, values, and standards',
    description: 'You have developed your own internal system for making meaning. You can step back from the expectations of your environment and make decisions based on your own values, beliefs, and long-term vision.',
    characteristics: [
      'Clear personal values and principles',
      'Ability to prioritize long-term goals',
      'Self-directed and autonomous',
      'Can manage competing demands effectively',
      'Strong sense of personal responsibility'
    ],
    growthOpportunities: [
      'Remain open to changing your mind when presented with new evidence',
      'Develop greater appreciation for different perspectives',
      'Balance self-direction with collaboration',
      'Explore the limits of your current worldview'
    ]
  },
  {
    id: 4,
    name: 'Self-Transforming Mind',
    shortDescription: 'Comfortable with paradox, multiple perspectives, and continuous change',
    description: 'You can hold multiple systems of thinking simultaneously and are comfortable with paradox and contradiction. You see your own worldview as one of many possible ways of making sense of reality.',
    characteristics: [
      'Comfortable with contradiction and paradox',
      'Sees multiple valid perspectives simultaneously',
      'Embraces continuous learning and change',
      'Integration of opposing viewpoints',
      'Humble about the limitations of any single perspective'
    ],
    growthOpportunities: [
      'Continue exploring the edges of human understanding',
      'Help others develop more complex meaning-making',
      'Balance multiple perspectives with decisive action',
      'Remain grounded while embracing complexity'
    ]
  }
]

const domains = [
  {
    name: 'Self-Identity',
    description: 'How you understand yourself and your place in the world',
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  {
    name: 'Relationships',
    description: 'How you navigate interpersonal connections and intimacy',
    questions: [10, 11, 12, 13, 14, 15, 16, 17, 18]
  },
  {
    name: 'Authority & Leadership',
    description: 'Your relationship with power, authority, and leadership',
    questions: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
  }
]

const questions = [
  // Self-Identity Domain (1-9)
  {
    id: 1,
    domain: 'Self-Identity',
    text: 'When you think about who you are, what feels most true?',
    options: [
      {
        text: 'I am defined by my relationships and the roles I play',
        explanation: 'My identity comes from being a good friend, employee, parent, etc.',
        stage: 2, weight: 3
      },
      {
        text: 'I have a clear sense of my values and goals that guide me',
        explanation: 'I know what I stand for and where I want to go',
        stage: 3, weight: 3
      },
      {
        text: 'I am constantly evolving and see myself as a work in progress',
        explanation: 'My identity is fluid and I embrace different aspects of myself',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 2,
    domain: 'Self-Identity',
    text: 'How do you typically make important life decisions?',
    options: [
      {
        text: 'I consider what important people in my life expect or would approve of',
        explanation: 'I value the input and approval of family, friends, and mentors',
        stage: 2, weight: 3
      },
      {
        text: 'I weigh the options against my personal values and long-term goals',
        explanation: 'I have clear criteria and stick to my principles',
        stage: 3, weight: 3
      },
      {
        text: 'I hold multiple perspectives simultaneously and stay open to paradox',
        explanation: 'I can see validity in conflicting approaches and remain flexible',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 3,
    domain: 'Self-Identity',
    text: 'When your beliefs are challenged, how do you typically respond?',
    options: [
      {
        text: 'I look to trusted authorities or groups to help me understand',
        explanation: 'I seek guidance from people or institutions I respect',
        stage: 2, weight: 2
      },
      {
        text: 'I defend my position based on my reasoning and principles',
        explanation: 'I stand firm in what I believe and can articulate why',
        stage: 3, weight: 2
      },
      {
        text: 'I get curious and explore how both perspectives might be true',
        explanation: 'I see challenges as opportunities to expand my understanding',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 4,
    domain: 'Self-Identity',
    text: 'What motivates you most in your personal growth?',
    options: [
      {
        text: 'Becoming the person others need me to be',
        explanation: 'I want to fulfill my roles and meet expectations well',
        stage: 2, weight: 2
      },
      {
        text: 'Achieving my personal vision and staying true to my values',
        explanation: 'I have clear goals for who I want to become',
        stage: 3, weight: 2
      },
      {
        text: 'Embracing the complexity and mystery of being human',
        explanation: 'I am fascinated by the ongoing journey of development',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 5,
    domain: 'Self-Identity',
    text: 'How do you view your past mistakes or failures?',
    options: [
      {
        text: 'I worry about disappointing others and try to make amends',
        explanation: 'I focus on repairing relationships and meeting expectations',
        stage: 2, weight: 2
      },
      {
        text: 'I learn from them and adjust my approach going forward',
        explanation: 'I see them as data points that help me improve',
        stage: 3, weight: 2
      },
      {
        text: 'I see them as inevitable parts of a complex journey',
        explanation: 'I hold compassion for myself and the complexity of life',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 6,
    domain: 'Self-Identity',
    text: 'When you face moral dilemmas, what guides your decisions?',
    options: [
      {
        text: 'What my community or culture considers right and wrong',
        explanation: 'I follow established moral codes and social expectations',
        stage: 2, weight: 3
      },
      {
        text: 'My personal ethical framework and principles',
        explanation: 'I have developed my own moral compass through reflection',
        stage: 3, weight: 3
      },
      {
        text: 'Multiple ethical frameworks while staying open to complexity',
        explanation: 'I can hold different moral perspectives simultaneously',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 7,
    domain: 'Self-Identity',
    text: 'How do you understand your life purpose?',
    options: [
      {
        text: 'Fulfilling my responsibilities to family, community, and work',
        explanation: 'My purpose is defined by the roles I play',
        stage: 2, weight: 2
      },
      {
        text: 'Achieving specific goals that align with my values',
        explanation: 'I have a clear mission I am working toward',
        stage: 3, weight: 2
      },
      {
        text: 'Contributing to the larger web of life in ways that emerge',
        explanation: 'My purpose evolves as I grow and circumstances change',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 8,
    domain: 'Self-Identity',
    text: 'When you receive feedback about yourself, how do you process it?',
    options: [
      {
        text: 'I focus on whether I am meeting others\' expectations',
        explanation: 'I use feedback to adjust so others will approve of me',
        stage: 2, weight: 2
      },
      {
        text: 'I evaluate it against my own standards and self-knowledge',
        explanation: 'I consider whether it aligns with my self-assessment',
        stage: 3, weight: 2
      },
      {
        text: 'I hold it as one perspective among many possible truths',
        explanation: 'I appreciate the insight while recognizing its limitations',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 9,
    domain: 'Self-Identity',
    text: 'What does "being authentic" mean to you?',
    options: [
      {
        text: 'Being true to the person my loved ones know me to be',
        explanation: 'Authenticity means consistency with how others see me',
        stage: 2, weight: 2
      },
      {
        text: 'Living according to my deeply held values and beliefs',
        explanation: 'Authenticity means being true to my inner compass',
        stage: 3, weight: 2
      },
      {
        text: 'Embracing all parts of myself, even contradictory ones',
        explanation: 'Authenticity includes my complexity and paradoxes',
        stage: 4, weight: 2
      }
    ]
  },

  // Relationships Domain (10-18)
  {
    id: 10,
    domain: 'Relationships',
    text: 'In intimate relationships, what do you value most?',
    options: [
      {
        text: 'Mutual care, support, and shared values',
        explanation: 'I want harmony and emotional connection',
        stage: 2, weight: 3
      },
      {
        text: 'Mutual respect for each other\'s autonomy and goals',
        explanation: 'I value independence within partnership',
        stage: 3, weight: 3
      },
      {
        text: 'The capacity to grow and transform together',
        explanation: 'I see relationship as a vehicle for mutual development',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 11,
    domain: 'Relationships',
    text: 'When conflicts arise with people you care about, how do you approach them?',
    options: [
      {
        text: 'I try to restore harmony and meet everyone\'s needs',
        explanation: 'I focus on maintaining peace and connection',
        stage: 2, weight: 3
      },
      {
        text: 'I advocate for my position while respecting theirs',
        explanation: 'I stand up for myself while being fair to others',
        stage: 3, weight: 3
      },
      {
        text: 'I explore how our different perspectives might both be valid',
        explanation: 'I look for the truth that emerges from the tension',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 12,
    domain: 'Relationships',
    text: 'How do you handle it when someone important to you disapproves of your choices?',
    options: [
      {
        text: 'I seriously reconsider my choice and may change course',
        explanation: 'Their opinion carries significant weight in my decisions',
        stage: 2, weight: 3
      },
      {
        text: 'I explain my reasoning while standing firm in my decision',
        explanation: 'I value their input but trust my own judgment',
        stage: 3, weight: 3
      },
      {
        text: 'I appreciate their concern while holding space for different views',
        explanation: 'I can disagree while maintaining love and respect',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 13,
    domain: 'Relationships',
    text: 'What does loyalty mean to you in relationships?',
    options: [
      {
        text: 'Standing by people no matter what, through thick and thin',
        explanation: 'Loyalty means unwavering support and commitment',
        stage: 2, weight: 2
      },
      {
        text: 'Being honest and supportive while maintaining my principles',
        explanation: 'Loyalty includes speaking truth even when difficult',
        stage: 3, weight: 2
      },
      {
        text: 'Holding space for both connection and individual growth',
        explanation: 'Loyalty means supporting each other\'s evolution',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 14,
    domain: 'Relationships',
    text: 'How do you decide whether to commit to a relationship?',
    options: [
      {
        text: 'Based on how well we fit together and what others think',
        explanation: 'I consider compatibility and social approval',
        stage: 2, weight: 2
      },
      {
        text: 'Based on whether it aligns with my life goals and values',
        explanation: 'I evaluate it against my vision for my life',
        stage: 3, weight: 2
      },
      {
        text: 'Based on our capacity for mutual growth and evolution',
        explanation: 'I consider our potential for ongoing development together',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 15,
    domain: 'Relationships',
    text: 'When you hurt someone you care about, how do you handle it?',
    options: [
      {
        text: 'I focus on making it right and restoring the relationship',
        explanation: 'I do whatever it takes to repair the connection',
        stage: 2, weight: 2
      },
      {
        text: 'I take responsibility and make amends according to my principles',
        explanation: 'I own my actions and repair appropriately',
        stage: 3, weight: 2
      },
      {
        text: 'I explore what the hurt reveals about our relationship dynamics',
        explanation: 'I see it as information about how we relate',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 16,
    domain: 'Relationships',
    text: 'How do you view the boundaries in your relationships?',
    options: [
      {
        text: 'They should be flexible based on what the relationship needs',
        explanation: 'I adjust boundaries to maintain harmony and connection',
        stage: 2, weight: 2
      },
      {
        text: 'They should be clear and consistent with my values',
        explanation: 'I maintain boundaries that protect my well-being',
        stage: 3, weight: 2
      },
      {
        text: 'They are part of an ongoing conversation about how we relate',
        explanation: 'I see boundaries as dynamic and co-created',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 17,
    domain: 'Relationships',
    text: 'What role does vulnerability play in your close relationships?',
    options: [
      {
        text: 'I share what will bring us closer and strengthen our bond',
        explanation: 'I am vulnerable in ways that enhance connection',
        stage: 2, weight: 2
      },
      {
        text: 'I share authentically while maintaining my sense of self',
        explanation: 'I am open while staying grounded in my identity',
        stage: 3, weight: 2
      },
      {
        text: 'I embrace vulnerability as a path to mutual growth',
        explanation: 'I see vulnerability as essential for development',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 18,
    domain: 'Relationships',
    text: 'How do you handle differences in values with people you care about?',
    options: [
      {
        text: 'I try to find common ground and minimize differences',
        explanation: 'I focus on what unites us rather than divides us',
        stage: 2, weight: 2
      },
      {
        text: 'I respect their values while staying true to my own',
        explanation: 'I can disagree while maintaining mutual respect',
        stage: 3, weight: 2
      },
      {
        text: 'I explore how our different values might each serve important purposes',
        explanation: 'I am curious about the wisdom in different approaches',
        stage: 4, weight: 2
      }
    ]
  },

  // Authority & Leadership Domain (19-28)
  {
    id: 19,
    domain: 'Authority & Leadership',
    text: 'How do you view authority figures in your life?',
    options: [
      {
        text: 'As sources of guidance and wisdom I generally respect',
        explanation: 'I look to authorities for direction and support',
        stage: 2, weight: 3
      },
      {
        text: 'As people I evaluate based on their competence and integrity',
        explanation: 'I decide case-by-case whether to follow their lead',
        stage: 3, weight: 3
      },
      {
        text: 'As fellow humans navigating complexity with their own limitations',
        explanation: 'I see authority as contextual and constructed',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 20,
    domain: 'Authority & Leadership',
    text: 'When you are in a leadership role, what guides your decisions?',
    options: [
      {
        text: 'What will best serve my team and organization',
        explanation: 'I focus on meeting the needs of those I serve',
        stage: 2, weight: 3
      },
      {
        text: 'My vision and principles applied to the situation',
        explanation: 'I lead according to my clear values and goals',
        stage: 3, weight: 3
      },
      {
        text: 'Holding multiple perspectives while staying open to emergence',
        explanation: 'I lead from a place of not-knowing and curiosity',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 21,
    domain: 'Authority & Leadership',
    text: 'How do you handle situations where you disagree with higher authority?',
    options: [
      {
        text: 'I express my concerns respectfully and usually comply',
        explanation: 'I trust that authority figures have good reasons',
        stage: 2, weight: 3
      },
      {
        text: 'I advocate for my position based on principles and evidence',
        explanation: 'I stand up for what I believe is right',
        stage: 3, weight: 3
      },
      {
        text: 'I explore the systemic factors that created the disagreement',
        explanation: 'I look at the larger context and multiple perspectives',
        stage: 4, weight: 3
      }
    ]
  },
  {
    id: 22,
    domain: 'Authority & Leadership',
    text: 'What does being a good follower mean to you?',
    options: [
      {
        text: 'Supporting the leader and contributing to team harmony',
        explanation: 'I help the leader succeed and maintain group cohesion',
        stage: 2, weight: 2
      },
      {
        text: 'Bringing my best thinking and honest feedback to the work',
        explanation: 'I contribute my expertise while respecting leadership',
        stage: 3, weight: 2
      },
      {
        text: 'Co-creating with the leader to serve the larger purpose',
        explanation: 'I see leadership and followership as complementary roles',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 23,
    domain: 'Authority & Leadership',
    text: 'How do you approach organizational rules and policies?',
    options: [
      {
        text: 'I generally follow them as they exist for good reasons',
        explanation: 'I trust that rules serve important organizational purposes',
        stage: 2, weight: 2
      },
      {
        text: 'I follow those that make sense and question those that don\'t',
        explanation: 'I apply my judgment to evaluate rules and policies',
        stage: 3, weight: 2
      },
      {
        text: 'I see them as tools that may need updating as context changes',
        explanation: 'I view rules as evolutionary and contextual',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 24,
    domain: 'Authority & Leadership',
    text: 'When leading change initiatives, what is your primary focus?',
    options: [
      {
        text: 'Bringing people together and maintaining morale',
        explanation: 'I focus on keeping the team united and motivated',
        stage: 2, weight: 2
      },
      {
        text: 'Achieving the vision while managing resistance effectively',
        explanation: 'I drive toward clear goals while addressing obstacles',
        stage: 3, weight: 2
      },
      {
        text: 'Creating conditions for the system to evolve naturally',
        explanation: 'I facilitate emergence rather than controlling outcomes',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 25,
    domain: 'Authority & Leadership',
    text: 'How do you view power in organizations?',
    options: [
      {
        text: 'As a responsibility to serve others and the organization',
        explanation: 'Power should be used to benefit the collective',
        stage: 2, weight: 2
      },
      {
        text: 'As a tool to implement vision and create positive change',
        explanation: 'Power should be used strategically to achieve goals',
        stage: 3, weight: 2
      },
      {
        text: 'As a dynamic that emerges from relationships and context',
        explanation: 'Power is fluid and co-created in social systems',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 26,
    domain: 'Authority & Leadership',
    text: 'When you make mistakes as a leader, how do you handle it?',
    options: [
      {
        text: 'I apologize and work to repair any damage to relationships',
        explanation: 'I focus on maintaining trust and team cohesion',
        stage: 2, weight: 2
      },
      {
        text: 'I take responsibility and adjust my approach going forward',
        explanation: 'I own my mistakes and learn from them systematically',
        stage: 3, weight: 2
      },
      {
        text: 'I explore what the mistake reveals about the system and context',
        explanation: 'I use mistakes as information about larger dynamics',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 27,
    domain: 'Authority & Leadership',
    text: 'How do you develop other people\'s leadership capabilities?',
    options: [
      {
        text: 'I mentor them and help them learn the ropes',
        explanation: 'I share what has worked and guide their development',
        stage: 2, weight: 2
      },
      {
        text: 'I challenge them to develop their own leadership philosophy',
        explanation: 'I help them find their authentic leadership style',
        stage: 3, weight: 2
      },
      {
        text: 'I create developmental experiences that stretch their capacity',
        explanation: 'I design challenges that promote developmental growth',
        stage: 4, weight: 2
      }
    ]
  },
  {
    id: 28,
    domain: 'Authority & Leadership',
    text: 'What is your relationship to feedback about your leadership?',
    options: [
      {
        text: 'I take it seriously and adjust to meet expectations',
        explanation: 'I want to be the leader others need me to be',
        stage: 2, weight: 2
      },
      {
        text: 'I consider it against my leadership principles and goals',
        explanation: 'I integrate feedback that aligns with my development',
        stage: 3, weight: 2
      },
      {
        text: 'I hold it as one perspective on my complex impact',
        explanation: 'I see feedback as partial information about my leadership',
        stage: 4, weight: 2
      }
    ]
  }
]

const totalQuestions = computed(() => questions.length)
const progressPercentage = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)

const getCurrentDomain = () => {
  const currentQ = questions[currentQuestionIndex.value]
  return domains.find(d => d.name === currentQ.domain)
}

const domainResults = computed(() => {
  if (!results.value) return []
  
  return domains.map(domain => {
    const domainQuestions = questions.filter(q => q.domain === domain.name)
    const stageScores = { 2: 0, 3: 0, 4: 0 }
    
    domainQuestions.forEach((q, index) => {
      const questionIndex = questions.findIndex(quest => quest.id === q.id)
      const answerIndex = answers.value[questionIndex]
      if (answerIndex !== undefined && answerIndex !== null) {
        const option = q.options[answerIndex]
        stageScores[option.stage] += option.weight
      }
    })
    
    const total = stageScores[2] + stageScores[3] + stageScores[4]
    const percentages = {
      2: total ? Math.round((stageScores[2] / total) * 100) : 0,
      3: total ? Math.round((stageScores[3] / total) * 100) : 0,
      4: total ? Math.round((stageScores[4] / total) * 100) : 0
    }
    
    const dominantStage = Object.keys(percentages).reduce((a, b) => percentages[a] > percentages[b] ? a : b)
    const stageName = developmentStages.find(s => s.id == dominantStage)?.name || 'Unknown'
    
    return {
      name: domain.name,
      stageScores: percentages,
      dominantStage: stageName
    }
  })
})

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
  const stageScores = { 2: 0, 3: 0, 4: 0 }
  
  questions.forEach((question, index) => {
    const answerIndex = answers.value[index]
    if (answerIndex !== undefined && answerIndex !== null) {
      const option = question.options[answerIndex]
      stageScores[option.stage] += option.weight
    }
  })
  
  const total = stageScores[2] + stageScores[3] + stageScores[4]
  const percentages = {
    2: total ? Math.round((stageScores[2] / total) * 100) : 0,
    3: total ? Math.round((stageScores[3] / total) * 100) : 0,
    4: total ? Math.round((stageScores[4] / total) * 100) : 0
  }
  
  const primaryStageId = Object.keys(percentages).reduce((a, b) => percentages[a] > percentages[b] ? a : b)
  const primaryStage = developmentStages.find(s => s.id == primaryStageId)
  
  const currentStrengths = getCurrentStrengths(primaryStageId)
  const developmentEdge = getDevelopmentEdge(primaryStageId)
  const developmentPractices = getDevelopmentPractices(primaryStageId)
  const awarenessAreas = getAwarenessAreas(primaryStageId)

  return {
    primaryStage,
    stageScores: percentages,
    currentStrengths,
    developmentEdge,
    developmentPractices,
    awarenessAreas,
    completedAt: new Date().toISOString(),
    totalQuestions: totalQuestions.value
  }
}

const getCurrentStrengths = (stageId) => {
  const strengths = {
    2: [
      'Strong loyalty and commitment to relationships and groups',
      'Ability to collaborate and maintain harmony',
      'Sensitivity to others\' needs and expectations',
      'Dedication to fulfilling roles and responsibilities'
    ],
    3: [
      'Clear personal values and authentic self-expression',
      'Strong goal-setting and achievement orientation',
      'Ability to make independent decisions',
      'Leadership through personal vision and principles'
    ],
    4: [
      'Comfort with paradox and multiple perspectives',
      'Capacity for systems thinking and complexity',
      'Openness to continuous learning and growth',
      'Ability to hold space for others\' development'
    ]
  }
  return strengths[stageId] || []
}

const getDevelopmentEdge = (stageId) => {
  const edges = {
    2: 'Developing greater independence and self-authorship while maintaining your capacity for connection.',
    3: 'Learning to hold multiple perspectives simultaneously and embracing the limits of your current worldview.',
    4: 'Integrating transcendence with practical action and helping others develop greater complexity.'
  }
  return edges[stageId] || ''
}

const getDevelopmentPractices = (stageId) => {
  const practices = {
    2: [
      'Practice making decisions based on your own values, not just others\' expectations',
      'Develop a personal mission statement or vision for your life',
      'Notice when you defer to others and experiment with asserting your own perspective',
      'Explore what you truly want independent of social approval'
    ],
    3: [
      'Seek out perspectives that challenge your worldview',
      'Practice holding paradox - situations where both/and is true rather than either/or',
      'Develop curiosity about the limitations of your own thinking',
      'Experiment with changing your mind when presented with compelling alternatives'
    ],
    4: [
      'Focus on translating insight into sustainable action',
      'Practice helping others develop without imposing your complexity',
      'Balance multiple perspectives with decisive leadership when needed',
      'Stay grounded in practical concerns while exploring transcendent possibilities'
    ]
  }
  return practices[stageId] || []
}

const getAwarenessAreas = (stageId) => {
  const awareness = {
    2: [
      'You may lose yourself in relationships or roles',
      'Difficulty making decisions when authorities conflict',
      'May avoid necessary conflicts to maintain harmony',
      'Identity may be fragile when roles or relationships change'
    ],
    3: [
      'You may be overly attached to being right',
      'Could dismiss others\' perspectives too quickly',
      'May struggle with situations requiring collaboration on others\' terms',
      'Tendency to see complexity as problems to be solved rather than paradoxes to be held'
    ],
    4: [
      'You may struggle with decisive action in complex situations',
      'Could overwhelm others with too much complexity',
      'May have difficulty with simple, straightforward approaches',
      'Tendency to see problems everywhere due to systems awareness'
    ]
  }
  return awareness[stageId] || []
}

const completeAssessment = async () => {
  isComplete.value = true
  results.value = calculateResults()
  
  try {
    const { error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.value.id,
        test_type_id: 'kegan_stages',
        responses: answers.value,
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
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  answers.value = []
  showResults.value = false
  isComplete.value = false
  results.value = null
}

onMounted(() => {
  if (!user.value) {
    navigateTo('/login')
  }
})

useHead({
  title: 'Adult Development Stages Assessment - Character Assessment Platform',
  meta: [
    { name: 'description', content: 'Discover your stage of adult psychological development based on Robert Kegan\'s meaning-making theory. Understand your current developmental capacity and growth opportunities.' }
  ]
})
</script>