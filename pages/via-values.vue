<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
    <div v-if="!showResults" class="space-y-6">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Values in Action (VIA) Character Strengths Survey
        </h1>
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
            Character Strength: {{ getCurrentStrength().name }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ getCurrentStrength().description }}
          </p>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {{ currentQuestion.text }}
          </h3>
          
          <div class="space-y-3">
            <label v-for="(option, index) in likertOptions" :key="index" 
                   class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                   :class="selectedAnswer === index + 1 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
              <input type="radio" 
                     :name="`question-${currentQuestionIndex}`" 
                     :value="index + 1" 
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
          Your VIA Character Strengths Profile
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Discover your signature strengths and how to apply them in your daily life
        </p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Top 5 Signature Strengths
        </h2>
        <div class="grid gap-4">
          <div v-for="(strength, index) in topFiveStrengths" :key="strength.id" 
               class="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ strength.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ strength.virtue }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600">{{ strength.score }}</div>
              <div class="text-xs text-gray-500">out of 25</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Strength Application Tips
          </h3>
          <div class="space-y-4">
            <div v-for="strength in topFiveStrengths.slice(0, 3)" :key="'tip-' + strength.id" class="border-l-4 border-blue-500 pl-4">
              <h4 class="font-medium text-gray-900 dark:text-white">{{ strength.name }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ strength.applicationTip }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Virtue Distribution
          </h3>
          <div class="space-y-3">
            <div v-for="virtue in virtueScores" :key="virtue.name" class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ virtue.name }}</span>
              <div class="flex items-center">
                <div class="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                  <div class="bg-blue-600 h-2 rounded-full" :style="{width: (virtue.score / 25 * 100) + '%'}"></div>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-400 w-8">{{ virtue.score.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Complete Character Strengths Ranking
        </h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div v-for="(strength, index) in allStrengthsRanked" :key="strength.id" 
               class="flex justify-between items-center p-3 border rounded-lg"
               :class="index < 5 ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'">
            <div class="flex items-center">
              <span class="w-6 h-6 text-xs rounded-full flex items-center justify-center mr-3 font-semibold"
                    :class="index < 5 ? 'bg-blue-600 text-white' : 'bg-gray-400 text-white'">
                {{ index + 1 }}
              </span>
              <div>
                <span class="font-medium text-gray-900 dark:text-white">{{ strength.name }}</span>
                <span class="text-xs text-gray-500 ml-2">({{ strength.virtue }})</span>
              </div>
            </div>
            <span class="font-semibold text-gray-900 dark:text-white">{{ strength.score }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Development Recommendations
        </h3>
        <div class="space-y-4">
          <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 class="font-semibold text-green-800 dark:text-green-300 mb-2">Focus on Your Signature Strengths</h4>
            <p class="text-sm text-green-700 dark:text-green-400">
              Your top 5 strengths are your natural talents. Look for opportunities to use these strengths more often in your work and personal life.
            </p>
          </div>
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">Develop Supporting Strengths</h4>
            <p class="text-sm text-blue-700 dark:text-blue-400">
              Your middle-ranked strengths can be developed to support your signature strengths. Consider how they might work together.
            </p>
          </div>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 class="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">Address Lower Strengths Mindfully</h4>
            <p class="text-sm text-yellow-700 dark:text-yellow-400">
              Your lower-ranked strengths are not weaknesses, but areas where you might benefit from partnering with others or developing specific skills.
            </p>
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

const likertOptions = [
  'Very much unlike me',
  'Unlike me',
  'Neutral',
  'Like me', 
  'Very much like me'
]

const characterStrengths = [
  // Wisdom & Knowledge
  { id: 1, name: 'Creativity', virtue: 'Wisdom & Knowledge', description: 'Thinking of novel and productive ways to conceptualize and do things' },
  { id: 2, name: 'Curiosity', virtue: 'Wisdom & Knowledge', description: 'Taking an interest in ongoing experience for its own sake' },
  { id: 3, name: 'Judgment', virtue: 'Wisdom & Knowledge', description: 'Thinking things through and examining them from all sides' },
  { id: 4, name: 'Love of Learning', virtue: 'Wisdom & Knowledge', description: 'Mastering new skills, topics, and bodies of knowledge' },
  { id: 5, name: 'Perspective', virtue: 'Wisdom & Knowledge', description: 'Being able to provide wise counsel; having ways of looking at the world that make sense' },
  
  // Courage
  { id: 6, name: 'Bravery', virtue: 'Courage', description: 'Not shrinking from threat, challenge, difficulty, or pain' },
  { id: 7, name: 'Perseverance', virtue: 'Courage', description: 'Persistence in spite of fatigue, frustration, or obstacles' },
  { id: 8, name: 'Honesty', virtue: 'Courage', description: 'Speaking the truth but more broadly presenting oneself in a genuine way' },
  { id: 9, name: 'Zest', virtue: 'Courage', description: 'Approaching life with excitement and energy' },
  
  // Humanity
  { id: 10, name: 'Love', virtue: 'Humanity', description: 'Capacity for close relationships characterized by giving and receiving love' },
  { id: 11, name: 'Kindness', virtue: 'Humanity', description: 'Doing favors and good deeds for others; helping them; taking care of them' },
  { id: 12, name: 'Social Intelligence', virtue: 'Humanity', description: 'Understanding the motives and feelings of other people' },
  
  // Justice
  { id: 13, name: 'Teamwork', virtue: 'Justice', description: 'Citizenship, social responsibility, loyalty' },
  { id: 14, name: 'Fairness', virtue: 'Justice', description: 'Treating all people the same according to notions of fairness and justice' },
  { id: 15, name: 'Leadership', virtue: 'Justice', description: 'Encouraging a group to get things done while maintaining good relations' },
  
  // Temperance
  { id: 16, name: 'Forgiveness', virtue: 'Temperance', description: 'Forgiving those who have done wrong; second chances; mercy' },
  { id: 17, name: 'Humility', virtue: 'Temperance', description: 'Letting accomplishments speak for themselves; not regarding oneself as special' },
  { id: 18, name: 'Prudence', virtue: 'Temperance', description: 'Discretion in choices; not saying or doing things that might later be regretted' },
  { id: 19, name: 'Self-Regulation', virtue: 'Temperance', description: 'Regulating what one feels and does; self-control' },
  
  // Transcendence
  { id: 20, name: 'Appreciation of Beauty', virtue: 'Transcendence', description: 'Appreciating beauty, excellence, and skilled performance in various domains' },
  { id: 21, name: 'Gratitude', virtue: 'Transcendence', description: 'Being aware of and thankful for good things that happen' },
  { id: 22, name: 'Hope', virtue: 'Transcendence', description: 'Optimism, future-mindedness, future orientation' },
  { id: 23, name: 'Humor', virtue: 'Transcendence', description: 'Liking to laugh and tease; bringing smiles to other people' },
  { id: 24, name: 'Spirituality', virtue: 'Transcendence', description: 'Having coherent beliefs about the higher purpose and meaning of the universe' }
]

const questions = [
  // 5 questions per strength (120 total)
  // Creativity (1-5)
  { id: 1, strengthId: 1, text: "I think of myself as someone who comes up with new ways to do things." },
  { id: 2, strengthId: 1, text: "I am always coming up with new ways to do things." },
  { id: 3, strengthId: 1, text: "I am an original thinker." },
  { id: 4, strengthId: 1, text: "I have good creative ideas." },
  { id: 5, strengthId: 1, text: "I think of creative ways to improve things." },
  
  // Curiosity (6-10)
  { id: 6, strengthId: 2, text: "I am always asking questions about how things work." },
  { id: 7, strengthId: 2, text: "I love to learn about new topics that fascinate me." },
  { id: 8, strengthId: 2, text: "I am genuinely interested in many different things." },
  { id: 9, strengthId: 2, text: "I like to explore strange places." },
  { id: 10, strengthId: 2, text: "I have an insatiable curiosity about the world." },
  
  // Judgment (11-15)
  { id: 11, strengthId: 3, text: "I think carefully before making decisions." },
  { id: 12, strengthId: 3, text: "I always weigh the pros and cons." },
  { id: 13, strengthId: 3, text: "I am good at analyzing problems from all angles." },
  { id: 14, strengthId: 3, text: "I tend to be very deliberate about my choices." },
  { id: 15, strengthId: 3, text: "I examine all sides of an issue before making a decision." },
  
  // Love of Learning (16-20)
  { id: 16, strengthId: 4, text: "I love to learn new things." },
  { id: 17, strengthId: 4, text: "I am thrilled when I learn something new." },
  { id: 18, strengthId: 4, text: "I love reading about topics that interest me." },
  { id: 19, strengthId: 4, text: "I enjoy expanding my knowledge." },
  { id: 20, strengthId: 4, text: "I seek out opportunities to challenge myself intellectually." },
  
  // Perspective (21-25)
  { id: 21, strengthId: 5, text: "People often ask me for advice." },
  { id: 22, strengthId: 5, text: "I have a unique perspective on things." },
  { id: 23, strengthId: 5, text: "I can help others see situations from different angles." },
  { id: 24, strengthId: 5, text: "I am known for my wisdom and judgment." },
  { id: 25, strengthId: 5, text: "People come to me when they need someone to help them make sense of things." },
  
  // Bravery (26-30)
  { id: 26, strengthId: 6, text: "I never back down from a challenge." },
  { id: 27, strengthId: 6, text: "I stand up for what I believe in." },
  { id: 28, strengthId: 6, text: "I face my fears directly." },
  { id: 29, strengthId: 6, text: "I am willing to take risks to achieve my goals." },
  { id: 30, strengthId: 6, text: "I defend people who are being treated unfairly." },
  
  // Perseverance (31-35)
  { id: 31, strengthId: 7, text: "Once I make a goal, I stick to it." },
  { id: 32, strengthId: 7, text: "I finish whatever I begin." },
  { id: 33, strengthId: 7, text: "I am a hard worker." },
  { id: 34, strengthId: 7, text: "I persist even when things get difficult." },
  { id: 35, strengthId: 7, text: "I never give up." },
  
  // Honesty (36-40)
  { id: 36, strengthId: 8, text: "I always tell the truth." },
  { id: 37, strengthId: 8, text: "I am genuine and authentic in my interactions." },
  { id: 38, strengthId: 8, text: "People trust me because I am honest." },
  { id: 39, strengthId: 8, text: "I present myself in an honest way." },
  { id: 40, strengthId: 8, text: "I would never try to deceive someone." },
  
  // Zest (41-45)
  { id: 41, strengthId: 9, text: "I am full of energy and enthusiasm." },
  { id: 42, strengthId: 9, text: "I approach everything I do with excitement." },
  { id: 43, strengthId: 9, text: "I feel alive and vital." },
  { id: 44, strengthId: 9, text: "I wake up excited about the day ahead." },
  { id: 45, strengthId: 9, text: "My enthusiasm is contagious." },
  
  // Love (46-50)
  { id: 46, strengthId: 10, text: "I have warm and caring relationships with others." },
  { id: 47, strengthId: 10, text: "I am capable of loving and being loved." },
  { id: 48, strengthId: 10, text: "I form deep emotional bonds with others." },
  { id: 49, strengthId: 10, text: "I value close relationships above all else." },
  { id: 50, strengthId: 10, text: "I am someone people can count on for emotional support." },
  
  // Kindness (51-55)
  { id: 51, strengthId: 11, text: "I am kind and generous to others." },
  { id: 52, strengthId: 11, text: "I go out of my way to help others." },
  { id: 53, strengthId: 11, text: "I am always doing good deeds for people." },
  { id: 54, strengthId: 11, text: "I enjoy helping others more than helping myself." },
  { id: 55, strengthId: 11, text: "I look for ways to help others every day." },
  
  // Social Intelligence (56-60)
  { id: 56, strengthId: 12, text: "I am very aware of the motives of other people." },
  { id: 57, strengthId: 12, text: "I can sense what others are feeling." },
  { id: 58, strengthId: 12, text: "I understand why people do what they do." },
  { id: 59, strengthId: 12, text: "I am good at reading people's emotions." },
  { id: 60, strengthId: 12, text: "I can predict how others will react in different situations." },
  
  // Teamwork (61-65)
  { id: 61, strengthId: 13, text: "I am loyal to my family and friends." },
  { id: 62, strengthId: 13, text: "I work well as part of a group or team." },
  { id: 63, strengthId: 13, text: "I am a responsible citizen." },
  { id: 64, strengthId: 13, text: "I always do my share of the work." },
  { id: 65, strengthId: 13, text: "I am committed to my social groups." },
  
  // Fairness (66-70)
  { id: 66, strengthId: 14, text: "I treat all people equally." },
  { id: 67, strengthId: 14, text: "I believe everyone deserves a fair chance." },
  { id: 68, strengthId: 14, text: "I never let my personal feelings bias my decisions about other people." },
  { id: 69, strengthId: 14, text: "I judge people by their actions, not their appearance." },
  { id: 70, strengthId: 14, text: "I give everyone the benefit of the doubt." },
  
  // Leadership (71-75)
  { id: 71, strengthId: 15, text: "I am an excellent leader." },
  { id: 72, strengthId: 15, text: "I organize group activities." },
  { id: 73, strengthId: 15, text: "I am good at organizing group activities." },
  { id: 74, strengthId: 15, text: "I can motivate people to work together." },
  { id: 75, strengthId: 15, text: "People look to me for guidance." },
  
  // Forgiveness (76-80)
  { id: 76, strengthId: 16, text: "I always give people a second chance." },
  { id: 77, strengthId: 16, text: "I forgive and forget." },
  { id: 78, strengthId: 16, text: "I believe in showing mercy." },
  { id: 79, strengthId: 16, text: "I don't hold grudges." },
  { id: 80, strengthId: 16, text: "I try to give people the benefit of the doubt." },
  
  // Humility (81-85)
  { id: 81, strengthId: 17, text: "I am modest and humble." },
  { id: 82, strengthId: 17, text: "I don't like to brag about my accomplishments." },
  { id: 83, strengthId: 17, text: "I let my work speak for itself." },
  { id: 84, strengthId: 17, text: "I don't think I'm better than other people." },
  { id: 85, strengthId: 17, text: "I am humble about my achievements." },
  
  // Prudence (86-90)
  { id: 86, strengthId: 18, text: "I am careful about my choices." },
  { id: 87, strengthId: 18, text: "I think before I speak." },
  { id: 88, strengthId: 18, text: "I am very careful about what I say." },
  { id: 89, strengthId: 18, text: "I think through the consequences before acting." },
  { id: 90, strengthId: 18, text: "I am a cautious person by nature." },
  
  // Self-Regulation (91-95)
  { id: 91, strengthId: 19, text: "I have excellent self-control." },
  { id: 92, strengthId: 19, text: "I control my emotions." },
  { id: 93, strengthId: 19, text: "I am good at resisting temptation." },
  { id: 94, strengthId: 19, text: "I regulate my activities well." },
  { id: 95, strengthId: 19, text: "I can control my behavior even when I'm tempted." },
  
  // Appreciation of Beauty (96-100)
  { id: 96, strengthId: 20, text: "I appreciate beautiful things in all areas of life." },
  { id: 97, strengthId: 20, text: "I am inspired by beauty in nature." },
  { id: 98, strengthId: 20, text: "I notice and appreciate excellence wherever I encounter it." },
  { id: 99, strengthId: 20, text: "I am moved by beauty in art and nature." },
  { id: 100, strengthId: 20, text: "I seek out beautiful experiences." },
  
  // Gratitude (101-105)
  { id: 101, strengthId: 21, text: "I am grateful for what I have." },
  { id: 102, strengthId: 21, text: "I regularly express thanks." },
  { id: 103, strengthId: 21, text: "I am thankful for my good fortune." },
  { id: 104, strengthId: 21, text: "I always acknowledge those who help me." },
  { id: 105, strengthId: 21, text: "I take time to count my blessings." },
  
  // Hope (106-110)
  { id: 106, strengthId: 22, text: "I always look on the bright side." },
  { id: 107, strengthId: 22, text: "I am optimistic about my future." },
  { id: 108, strengthId: 22, text: "I expect good things to happen." },
  { id: 109, strengthId: 22, text: "I believe things will work out for the best." },
  { id: 110, strengthId: 22, text: "I maintain hope even in difficult times." },
  
  // Humor (111-115)
  { id: 111, strengthId: 23, text: "I love to make other people laugh." },
  { id: 112, strengthId: 23, text: "I am playful." },
  { id: 113, strengthId: 23, text: "I bring levity to tense situations." },
  { id: 114, strengthId: 23, text: "I have a good sense of humor." },
  { id: 115, strengthId: 23, text: "People appreciate my jokes and funny stories." },
  
  // Spirituality (116-120)
  { id: 116, strengthId: 24, text: "I have a strong sense of purpose in life." },
  { id: 117, strengthId: 24, text: "I think a lot about the meaning and purpose of life." },
  { id: 118, strengthId: 24, text: "My life serves a higher purpose." },
  { id: 119, strengthId: 24, text: "I have beliefs about the sacred aspects of life." },
  { id: 120, strengthId: 24, text: "I feel connected to something larger than myself." }
]

const totalQuestions = computed(() => questions.length)
const progressPercentage = computed(() => ((currentQuestionIndex.value + 1) / totalQuestions.value) * 100)
const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions.value - 1)

const getCurrentStrength = () => {
  const currentQ = questions[currentQuestionIndex.value]
  return characterStrengths.find(s => s.id === currentQ.strengthId)
}

const topFiveStrengths = computed(() => {
  if (!results.value) return []
  return results.value.strengthScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => ({
      ...s,
      applicationTip: getApplicationTip(s.strengthId)
    }))
})

const allStrengthsRanked = computed(() => {
  if (!results.value) return []
  return results.value.strengthScores.sort((a, b) => b.score - a.score)
})

const virtueScores = computed(() => {
  if (!results.value) return []
  const virtues = {}
  results.value.strengthScores.forEach(strength => {
    if (!virtues[strength.virtue]) {
      virtues[strength.virtue] = { scores: [], count: 0 }
    }
    virtues[strength.virtue].scores.push(strength.score)
    virtues[strength.virtue].count++
  })
  
  return Object.keys(virtues).map(virtue => ({
    name: virtue,
    score: virtues[virtue].scores.reduce((a, b) => a + b, 0) / virtues[virtue].count
  })).sort((a, b) => b.score - a.score)
})

const getApplicationTip = (strengthId) => {
  const tips = {
    1: "Use your creativity to find innovative solutions to everyday problems at work and home.",
    2: "Channel your curiosity into exploring new learning opportunities and asking meaningful questions.",
    3: "Apply your judgment skills to help others make better decisions and solve complex problems.",
    4: "Set aside dedicated time for learning new skills or diving deeper into subjects you're passionate about.",
    5: "Share your perspective by mentoring others and offering thoughtful advice when asked.",
    6: "Use your bravery to advocate for important causes and stand up for what's right.",
    7: "Apply your perseverance to long-term goals and help others stay motivated during challenges.",
    8: "Build trust through your honesty and authenticity in all your relationships.",
    9: "Share your zest and energy to motivate and inspire those around you.",
    10: "Nurture your close relationships and create deeper connections with others.",
    11: "Look for daily opportunities to help others and perform acts of kindness.",
    12: "Use your social intelligence to improve team dynamics and resolve interpersonal conflicts.",
    13: "Contribute to team success by being reliable and supporting group goals.",
    14: "Advocate for fair treatment and equal opportunities in your community.",
    15: "Take on leadership roles where you can guide others and organize meaningful initiatives.",
    16: "Practice forgiveness to release grudges and create space for healing relationships.",
    17: "Let your humility shine by celebrating others' successes and learning from everyone.",
    18: "Use your prudence to help others think through important decisions carefully.",
    19: "Model self-discipline and help others develop better self-control habits.",
    20: "Share your appreciation of beauty by creating beautiful spaces and experiences for others.",
    21: "Express gratitude regularly and help others recognize the good in their lives.",
    22: "Share your optimism to help others maintain hope during difficult times.",
    23: "Use humor appropriately to lighten mood and bring joy to others.",
    24: "Connect with your spiritual practices and help others find meaning in their experiences."
  }
  return tips[strengthId] || "Apply this strength in ways that feel authentic to you."
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
  const strengthScores = characterStrengths.map(strength => {
    const strengthQuestions = questions.filter(q => q.strengthId === strength.id)
    const strengthAnswers = strengthQuestions.map((q, index) => {
      const answerIndex = questions.findIndex(quest => quest.id === q.id)
      return answers.value[answerIndex] || 3
    })
    
    const score = strengthAnswers.reduce((sum, answer) => sum + answer, 0)
    
    return {
      strengthId: strength.id,
      name: strength.name,
      virtue: strength.virtue,
      score: score,
      description: strength.description
    }
  })

  return {
    strengthScores,
    completedAt: new Date().toISOString(),
    totalQuestions: totalQuestions.value
  }
}

const completeAssessment = async () => {
  isComplete.value = true
  results.value = calculateResults()
  
  try {
    const { error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.value.id,
        test_type_id: 'via_values',
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
  title: 'VIA Character Strengths Survey - Character Assessment Platform',
  meta: [
    { name: 'description', content: 'Discover your signature character strengths with the comprehensive Values in Action (VIA) Survey. Identify your top strengths and learn how to apply them.' }
  ]
})
</script>