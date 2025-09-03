<template>
  <div :class="themeClasses.pageBackground">
    <!-- Navigation -->
    <nav :class="themeClasses.navBackground">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 :class="`text-xl font-bold ${themeClasses.navText}`">Assessment Platform</h1>
          </div>
          <div class="flex items-center space-x-4">
            <ThemeSwitcher />
            <LanguagePicker />
            <NuxtLink v-if="!user" :to="$localePath('/login')" :class="`${themeClasses.navTextSecondary} ${themeClasses.navTextHover} transition-colors`">
              {{ $t('home.login') }}
            </NuxtLink>
            <NuxtLink v-if="!user" :to="$localePath('/register')" class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              {{ $t('home.getStarted') }}
            </NuxtLink>
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

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-16">
        <h2 :class="`text-5xl font-bold ${themeClasses.textPrimary} mb-6`">
          Discover Yourself Through Assessment
        </h2>
        <p :class="`text-xl ${themeClasses.textSecondary} mb-8 max-w-3xl mx-auto`">
          Explore your personality, values, and skills with our scientifically-backed assessment suite. 
          Get personalized insights and track your growth over time.
        </p>
      </div>

      <!-- Netflix-style Sections -->
      
      <!-- Most Popular Section -->
      <div class="mb-12">
        <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center`">
          🔥 Most Popular
        </h3>
        <div class="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-6">
          <div 
            v-for="test in getMostPopularTests().slice(0, 6)" 
            :key="test.id"
            class="group cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <NuxtLink :to="$localePath(`/test/${test.id}`)">
              <div :class="`relative rounded-lg overflow-hidden ${themeClasses.cardShadow} ${themeClasses.testCardBackground} group`">
                <!-- Cover Image -->
                <div class="aspect-[3/4] relative overflow-hidden">
                  <img 
                    :src="getTestImage(test.id)" 
                    :alt="test.name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black bg-opacity-60"></div>
                  
                  <!-- Category Tag -->
                  <div class="absolute top-2 left-2">
                    <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {{ getCategoryDisplayName(test.category) }}
                    </span>
                  </div>
                  
                  <!-- Completion Status -->
                  <div v-if="getUserResult(test.id)" class="absolute top-2 right-2">
                    <div class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✓
                    </div>
                  </div>
                </div>

                <!-- Always Visible Card Footer -->
                <div :class="`p-3 ${themeClasses.testCardFooter}`">
                  <h4 :class="`${themeClasses.textPrimary} font-bold text-sm mb-1 truncate`">{{ test.name }}</h4>
                  <p :class="`${themeClasses.textSecondary} text-xs mb-2 line-clamp-2`">{{ test.short_description }}</p>
                  <div :class="`flex items-center justify-between text-xs ${themeClasses.textMuted}`">
                    <span>~{{ test.estimated_duration_minutes }}min</span>
                    <span>{{ test.question_count }}Q</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Category-based Sections -->
      <div 
        v-for="category in getCategories()" 
        :key="category"
        class="mb-12"
      >
        <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 flex items-center`">
          {{ getCategoryIcon(category) }} {{ getCategoryDisplayName(category) }}
        </h3>
        <div class="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-6">
          <div 
            v-for="test in getTestsByCategory(category)" 
            :key="test.id"
            class="group cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <NuxtLink :to="$localePath(`/test/${test.id}`)">
              <div :class="`relative rounded-lg overflow-hidden ${themeClasses.cardShadow} ${themeClasses.testCardBackground} group`">
                <!-- Cover Image -->
                <div class="aspect-[3/4] relative overflow-hidden">
                  <img 
                    :src="getTestImage(test.id)" 
                    :alt="test.name"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black bg-opacity-60"></div>
                  
                  <!-- Subcategory Tag -->
                  <div class="absolute top-2 left-2">
                    <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {{ getSubcategoryDisplayName(test.subcategory) }}
                    </span>
                  </div>
                  
                  <!-- Completion Status -->
                  <div v-if="getUserResult(test.id)" class="absolute top-2 right-2">
                    <div class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ✓
                    </div>
                  </div>
                </div>

                <!-- Always Visible Card Footer -->
                <div :class="`p-3 ${themeClasses.testCardFooter}`">
                  <h4 :class="`${themeClasses.textPrimary} font-bold text-sm mb-1 truncate`">{{ test.name }}</h4>
                  <p :class="`${themeClasses.textSecondary} text-xs mb-2 line-clamp-2`">{{ test.short_description }}</p>
                  <div :class="`flex items-center justify-between text-xs ${themeClasses.textMuted}`">
                    <span>~{{ test.estimated_duration_minutes }}min</span>
                    <span>{{ test.question_count }}Q</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div :class="`${themeClasses.featureBackground} rounded-xl p-8 mb-12`">
        <h3 :class="`text-2xl font-bold ${themeClasses.textPrimary} mb-6 text-center`">Why Take Our Assessments?</h3>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-4xl mb-4">🧠</div>
            <h4 :class="`text-lg font-semibold mb-2 ${themeClasses.textPrimary}`">Science-Based</h4>
            <p :class="themeClasses.textSecondary">All assessments based on validated psychological research and established frameworks</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">📊</div>
            <h4 :class="`text-lg font-semibold mb-2 ${themeClasses.textPrimary}`">Detailed Insights</h4>
            <p :class="themeClasses.textSecondary">Get comprehensive reports with personalized recommendations for growth</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-4">📈</div>
            <h4 :class="`text-lg font-semibold mb-2 ${themeClasses.textPrimary}`">Track Progress</h4>
            <p :class="themeClasses.textSecondary">Monitor your development over time with our progress tracking system</p>
          </div>
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

// Reactive data
const tests = ref([
  // === EXISTING TESTS (keeping for compatibility) ===
  {
    id: 'kohlberg_moral',
    name: 'Kohlberg Moral Development',
    short_description: 'Discover your moral reasoning stage through ethical dilemmas',
    description: 'Assess your stage of moral reasoning based on Lawrence Kohlberg\'s theory of moral development',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['morals', 'ethics', 'development'],
    question_count: 3,
    estimated_duration_minutes: 15,
    evaluation_method: 'ai_analysis',
    popularity: 4
  },
  {
    id: 'big_five_personality',
    name: 'Big Five Personality (OCEAN)',
    short_description: 'Explore your personality across five key dimensions',
    description: 'Comprehensive personality assessment based on the five-factor model (OCEAN)',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['personality', 'traits', 'psychology'],
    question_count: 50,
    estimated_duration_minutes: 25,
    evaluation_method: 'multiple_choice',
    popularity: 5
  },
  {
    id: 'communication_skills',
    name: 'Communication Skills',
    short_description: 'Assess your communication effectiveness and style',
    description: 'Evaluate your communication effectiveness across different contexts and situations',
    category: 'skills_strengths',
    subcategory: '4cs',
    tags: ['communication', 'interpersonal', 'professional'],
    question_count: 30,
    estimated_duration_minutes: 20,
    evaluation_method: 'multiple_choice',
    popularity: 3
  },
  {
    id: 'project_management',
    name: 'Project Management',
    short_description: 'Measure your project leadership and management skills',
    description: 'Assess your project management skills and leadership capabilities',
    category: 'knowledge',
    subcategory: 'managerial',
    tags: ['management', 'leadership', 'planning'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'multiple_choice',
    popularity: 2
  },

  // === NEW MOTIVATION TESTS ===
  {
    id: 'personal_motivation',
    name: 'Personal Motivations Assessment',
    short_description: 'Discover what truly drives you: fears, passions, and core motivations',
    description: 'Deep dive into your fundamental motivational drivers, including fear-based and passion-driven behaviors',
    category: 'motivation',
    subcategory: 'personal_drivers',
    tags: ['motivation', 'passion', 'fear', 'self-awareness'],
    question_count: 25,
    estimated_duration_minutes: 20,
    evaluation_method: 'mixed',
    popularity: 4
  },
  {
    id: 'change_readiness',
    name: 'Change Readiness Assessment',
    short_description: 'Evaluate your current challenges and readiness for transformation',
    description: 'Assess your current life situation, challenges, and readiness to implement meaningful changes',
    category: 'motivation',
    subcategory: 'change_planning',
    tags: ['change', 'planning', 'readiness', 'transformation'],
    question_count: 20,
    estimated_duration_minutes: 15,
    evaluation_method: 'reflective',
    popularity: 3
  },

  // === NEW KNOWLEDGE TESTS ===
  {
    id: 'team_leadership',
    name: 'Team Leadership Assessment',
    short_description: 'Measure your effectiveness in leading and managing teams',
    description: 'Comprehensive evaluation of your team leadership skills, including motivation, delegation, and team dynamics',
    category: 'knowledge',
    subcategory: 'managerial',
    tags: ['leadership', 'teams', 'management', 'delegation'],
    question_count: 40,
    estimated_duration_minutes: 30,
    evaluation_method: 'scenario_based',
    popularity: 5
  },
  {
    id: 'change_management',
    name: 'Change Management Mastery',
    short_description: 'Assess your ability to drive and manage organizational change',
    description: 'Evaluate your skills in leading organizational transformation, overcoming resistance, and implementing change',
    category: 'knowledge',
    subcategory: 'managerial',
    tags: ['change management', 'transformation', 'leadership', 'strategy'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'case_study',
    popularity: 4
  },

  // === NEW SKILLS/STRENGTHS TESTS ===
  {
    id: 'strengths_finder',
    name: 'Strengths Profile Assessment',
    short_description: 'Identify your top strengths and natural talents',
    description: 'Discover your unique combination of talents and strengths, similar to StrengthsFinder methodology',
    category: 'skills_strengths',
    subcategory: 'strengths',
    tags: ['strengths', 'talents', 'natural abilities', 'excellence'],
    question_count: 45,
    estimated_duration_minutes: 30,
    evaluation_method: 'forced_choice',
    popularity: 5
  },
  {
    id: 'critical_thinking',
    name: 'Critical Thinking Assessment',
    short_description: 'Evaluate your analytical and logical reasoning abilities',
    description: 'Assess your critical thinking skills including analysis, evaluation, inference, and problem-solving',
    category: 'skills_strengths',
    subcategory: '4cs',
    tags: ['critical thinking', 'analysis', 'logic', 'reasoning'],
    question_count: 30,
    estimated_duration_minutes: 35,
    evaluation_method: 'problem_solving',
    popularity: 4
  },
  {
    id: 'creativity_assessment',
    name: 'Creativity & Innovation',
    short_description: 'Measure your creative thinking and innovation potential',
    description: 'Evaluate your creative problem-solving abilities, divergent thinking, and innovation mindset',
    category: 'skills_strengths',
    subcategory: '4cs',
    tags: ['creativity', 'innovation', 'divergent thinking', 'ideation'],
    question_count: 25,
    estimated_duration_minutes: 30,
    evaluation_method: 'creative_tasks',
    popularity: 3
  },
  {
    id: 'collaboration_skills',
    name: 'Collaboration Excellence',
    short_description: 'Assess your teamwork and collaborative leadership skills',
    description: 'Evaluate your ability to work effectively with others, facilitate cooperation, and build consensus',
    category: 'skills_strengths',
    subcategory: '4cs',
    tags: ['collaboration', 'teamwork', 'cooperation', 'consensus'],
    question_count: 28,
    estimated_duration_minutes: 22,
    evaluation_method: 'behavioral',
    popularity: 4
  },

  // === NEW VALUES & MINDSETS TESTS ===
  {
    id: 'character_assessment',
    name: 'Character & Integrity (Charakternosť)',
    short_description: 'Evaluate your character strength, moral courage, and integrity',
    description: 'Assess your character development including respect, moral courage, and ethical decision-making',
    category: 'values_mindsets',
    subcategory: '4es_chela',
    tags: ['character', 'integrity', 'moral courage', 'respect'],
    question_count: 32,
    estimated_duration_minutes: 25,
    evaluation_method: 'ethical_scenarios',
    popularity: 3
  },
  {
    id: 'excellence_mindset',
    name: 'Excellence Orientation',
    short_description: 'Measure your drive for excellence and continuous improvement',
    description: 'Assess your commitment to excellence, quality standards, and continuous improvement mindset',
    category: 'values_mindsets',
    subcategory: '4es_chela',
    tags: ['excellence', 'quality', 'improvement', 'standards'],
    question_count: 26,
    estimated_duration_minutes: 20,
    evaluation_method: 'behavioral',
    popularity: 4
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurial Mindset (Podnikavosť)',
    short_description: 'Assess your entrepreneurial thinking and opportunity recognition',
    description: 'Evaluate your entrepreneurial mindset including opportunity identification, risk-taking, and bias for action',
    category: 'values_mindsets',
    subcategory: '4es_chela',
    tags: ['entrepreneurship', 'opportunity', 'risk-taking', 'action'],
    question_count: 30,
    estimated_duration_minutes: 25,
    evaluation_method: 'scenario_based',
    popularity: 4
  },
  {
    id: 'engagement_commitment',
    name: 'Engagement & Commitment (Angažovanosť)',
    short_description: 'Measure your level of engagement and commitment to causes',
    description: 'Assess your dedication, commitment level, and engagement with work and causes you care about',
    category: 'values_mindsets',
    subcategory: '4es_chela',
    tags: ['engagement', 'commitment', 'dedication', 'purpose'],
    question_count: 24,
    estimated_duration_minutes: 18,
    evaluation_method: 'reflective',
    popularity: 3
  },
  {
    id: 'via_values',
    name: 'Values in Action (VIA) Survey',
    short_description: 'Discover your core character strengths and values',
    description: 'Comprehensive assessment of 24 character strengths that represent your core values in action',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['values', 'character strengths', 'virtues', 'VIA'],
    question_count: 120,
    estimated_duration_minutes: 45,
    evaluation_method: 'likert_scale',
    popularity: 5
  },

  // === MOVED TO VALUES & MINDSETS ===
  {
    id: 'org_culture_preference',
    name: 'Organizational Culture Fit',
    short_description: 'Identify your preferred organizational culture and development stage',
    description: 'Assess your preferences across organizational culture types from Red to Teal (Spiral Dynamics)',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['culture', 'organization', 'spiral dynamics', 'development'],
    question_count: 35,
    estimated_duration_minutes: 25,
    evaluation_method: 'preference_ranking',
    popularity: 3
  },
  {
    id: 'kegan_stages',
    name: 'Adult Development Stages (Kegan)',
    short_description: 'Understand your stage of adult psychological development',
    description: 'Assessment based on Robert Kegan\'s stages of adult development and meaning-making',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['development', 'psychology', 'meaning-making', 'Kegan'],
    question_count: 28,
    estimated_duration_minutes: 30,
    evaluation_method: 'developmental',
    popularity: 2
  },
  {
    id: 'implicit_bias',
    name: 'Implicit Bias Awareness',
    short_description: 'Explore your unconscious biases and develop awareness',
    description: 'Assessment to help identify and understand your implicit biases across various dimensions',
    category: 'values_mindsets',
    subcategory: 'other_values',
    tags: ['bias', 'unconscious', 'awareness', 'diversity'],
    question_count: 40,
    estimated_duration_minutes: 35,
    evaluation_method: 'iat_style',
    popularity: 4
  }
])

const userTestResults = ref([])

// Helper functions for Netflix-style sections
const getMostPopularTests = () => {
  return [...tests.value].sort((a, b) => b.popularity - a.popularity)
}

const getRecommendedTests = () => {
  const completedTests = new Set(userTestResults.value.map(r => r.test_type_id))
  // Recommend tests not yet completed, fallback to all tests
  const incomplete = tests.value.filter(test => !completedTests.has(test.id))
  return incomplete.length > 0 ? incomplete : tests.value
}

const getRecentlyAddedTests = () => {
  // Since we don't have date added, we'll just reverse the order to simulate "recently added"
  return [...tests.value].reverse()
}

const getCoverGradient = (testId) => {
  const gradients = {
    // Existing
    'kohlberg_moral': 'from-blue-600 via-blue-700 to-teal-800',
    'big_five_personality': 'from-purple-600 via-pink-600 to-purple-800',
    'communication_skills': 'from-green-600 via-emerald-700 to-teal-800',
    'project_management': 'from-orange-600 via-red-600 to-pink-800',
    
    // Motivation
    'personal_motivation': 'from-red-600 via-pink-600 to-rose-800',
    'change_readiness': 'from-amber-600 via-orange-600 to-red-700',
    
    // Knowledge
    'team_leadership': 'from-indigo-600 via-blue-600 to-cyan-700',
    'change_management': 'from-teal-600 via-green-600 to-emerald-700',
    
    // Skills/Strengths
    'strengths_finder': 'from-yellow-600 via-orange-600 to-red-600',
    'critical_thinking': 'from-slate-600 via-gray-700 to-zinc-800',
    'creativity_assessment': 'from-pink-600 via-purple-600 to-indigo-700',
    'collaboration_skills': 'from-emerald-600 via-teal-600 to-cyan-700',
    
    // Values & Mindsets
    'character_assessment': 'from-blue-800 via-indigo-800 to-purple-900',
    'excellence_mindset': 'from-gold-600 via-yellow-600 to-amber-700',
    'entrepreneurship': 'from-green-600 via-emerald-700 to-teal-800',
    'engagement_commitment': 'from-rose-600 via-pink-600 to-fuchsia-700',
    'via_values': 'from-violet-600 via-purple-700 to-indigo-800',
    
    // Other
    'org_culture_preference': 'from-cyan-600 via-blue-600 to-indigo-700',
    'kegan_stages': 'from-stone-600 via-gray-600 to-slate-700',
    'implicit_bias': 'from-neutral-700 via-zinc-800 to-gray-900'
  }
  return gradients[testId] || 'from-gray-600 to-gray-800'
}

const getCategoryDisplayName = (category) => {
  const names = {
    'motivation': 'Motivation',
    'knowledge': 'Knowledge',
    'skills_strengths': 'Skills & Strengths',
    'values_mindsets': 'Values & Mindsets',
    'other': 'Other Assessments'
  }
  return names[category] || category
}

const getSubcategoryDisplayName = (subcategory) => {
  const names = {
    'personal_drivers': 'Personal Drivers',
    'change_planning': 'Change Planning',
    'managerial': 'Leadership & Management',
    'field_specific': 'Field-Specific',
    'strengths': 'Natural Strengths',
    '4cs': '4Cs Framework',
    '4es_chela': 'ChELA Framework',
    'other_values': 'Values Assessment',
    'personality': 'Personality',
    'organizational': 'Organizational',
    'development': 'Development',
    'bias_awareness': 'Bias & Awareness'
  }
  return names[subcategory] || subcategory
}

const getTestImage = (testId) => {
  const images = {
    // Existing
    'kohlberg_moral': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=600&fit=crop&crop=center',
    'big_five_personality': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop&crop=center',
    'communication_skills': 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=600&fit=crop&crop=center',
    'project_management': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop&crop=center',
    
    // Motivation
    'personal_motivation': 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=600&fit=crop&crop=center',
    'change_readiness': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=600&fit=crop&crop=center',
    
    // Knowledge
    'team_leadership': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop&crop=center',
    'change_management': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop&crop=center',
    
    // Skills/Strengths
    'strengths_finder': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=center',
    'critical_thinking': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
    'creativity_assessment': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop&crop=center',
    'collaboration_skills': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=600&fit=crop&crop=center',
    
    // Values & Mindsets
    'character_assessment': 'https://images.unsplash.com/photo-1521790361543-f645cf042ec4?w=400&h=600&fit=crop&crop=center',
    'excellence_mindset': 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=400&h=600&fit=crop&crop=center',
    'entrepreneurship': 'https://images.unsplash.com/photo-1553028826-f4804a6dfd3f?w=400&h=600&fit=crop&crop=center',
    'engagement_commitment': 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=600&fit=crop&crop=center',
    'via_values': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=600&fit=crop&crop=center',
    'org_culture_preference': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=600&fit=crop&crop=center',
    'kegan_stages': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=600&fit=crop&crop=center',
    'implicit_bias': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop&crop=center'
  }
  return images[testId] || 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=600&fit=crop&crop=center'
}

const getUserResult = (testId) => {
  return userTestResults.value.find(result => result.test_type_id === testId)
}

const getCategories = () => {
  const uniqueCategories = [...new Set(tests.value.map(test => test.category))]
  // Order them logically
  const categoryOrder = ['motivation', 'knowledge', 'skills_strengths', 'values_mindsets']
  return categoryOrder.filter(cat => uniqueCategories.includes(cat))
}

const getTestsByCategory = (category) => {
  return tests.value.filter(test => test.category === category)
}

const getCategoryIcon = (category) => {
  const icons = {
    'motivation': '🎯',
    'knowledge': '📚',
    'skills_strengths': '💪',
    'values_mindsets': '🌟',
    'other': '🔍'
  }
  return icons[category] || '📊'
}

const logout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/')
}

// Load user test results if authenticated
const loadUserTestResults = async () => {
  if (!user.value) return
  
  try {
    const { data, error } = await supabase
      .from('user_test_results')
      .select('*')
      .eq('user_id', user.value.id)
    
    if (!error && data) {
      userTestResults.value = data
    }
  } catch (error) {
    console.error('Error loading user test results:', error)
  }
}

// Load data on component mount
onMounted(async () => {
  if (user.value) {
    await loadUserTestResults()
  }
  
  // Initialize theme
  const { initTheme } = useTheme()
  initTheme()
})

// Watch for auth state changes
watchEffect(() => {
  if (user.value) {
    loadUserTestResults()
  } else {
    userTestResults.value = []
  }
})

useHead({
  title: 'Assessment Platform - Discover Yourself',
  meta: [
    { name: 'description', content: 'Explore your personality, values, and skills with our scientifically-backed assessment suite. Get personalized insights and track your growth over time.' }
  ]
})
</script>