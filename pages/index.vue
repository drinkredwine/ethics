<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Kohlberg Assessment</h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/login" class="text-gray-600 hover:text-gray-900">Login</NuxtLink>
            <NuxtLink to="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">
          Discover Your Moral Development Stage
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Take our AI-powered assessment based on Lawrence Kohlberg's stages of moral development
        </p>
        <NuxtLink to="/register" class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          Start Assessment
        </NuxtLink>
      </div>
    </div>

    <!-- Kohlberg's Theory Explanation -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">About Kohlberg's Theory</h3>
        
        <div class="prose max-w-none">
          <p class="text-gray-700 mb-6">
            Lawrence Kohlberg's theory of moral development describes how people progress through different stages of moral reasoning. 
            Understanding your current stage can help you develop stronger ethical decision-making skills.
          </p>

          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <!-- Preconventional Level -->
            <div class="border rounded-lg p-6">
              <h4 class="text-lg font-semibold text-indigo-600 mb-3">Preconventional</h4>
              <div class="space-y-3">
                <div class="border-l-4 border-red-400 pl-3">
                  <p class="font-medium">Stage 1: Punishment Avoidance</p>
                  <p class="text-sm text-gray-600">Right action is that which avoids punishment</p>
                </div>
                <div class="border-l-4 border-red-400 pl-3">
                  <p class="font-medium">Stage 2: Instrumental Purpose</p>
                  <p class="text-sm text-gray-600">Right action serves one's own interests</p>
                </div>
              </div>
            </div>

            <!-- Conventional Level -->
            <div class="border rounded-lg p-6">
              <h4 class="text-lg font-semibold text-blue-600 mb-3">Conventional</h4>
              <div class="space-y-3">
                <div class="border-l-4 border-blue-400 pl-3">
                  <p class="font-medium">Stage 3: Good Interpersonal Relationships</p>
                  <p class="text-sm text-gray-600">Right action pleases others and wins approval</p>
                </div>
                <div class="border-l-4 border-blue-400 pl-3">
                  <p class="font-medium">Stage 4: Maintaining Social Order</p>
                  <p class="text-sm text-gray-600">Right action upholds law and social order</p>
                </div>
              </div>
            </div>

            <!-- Postconventional Level -->
            <div class="border rounded-lg p-6">
              <h4 class="text-lg font-semibold text-green-600 mb-3">Postconventional</h4>
              <div class="space-y-3">
                <div class="border-l-4 border-green-400 pl-3">
                  <p class="font-medium">Stage 5: Social Contract</p>
                  <p class="text-sm text-gray-600">Right action follows agreed-upon rights and standards</p>
                </div>
                <div class="border-l-4 border-green-400 pl-3">
                  <p class="font-medium">Stage 6: Universal Ethical Principles</p>
                  <p class="text-sm text-gray-600">Right action follows universal ethical principles</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-indigo-50 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-indigo-800 mb-3">How Our AI Assessment Works</h4>
            <ul class="text-gray-700 space-y-2">
              <li>• Present you with moral dilemmas and scenarios</li>
              <li>• Analyze your reasoning patterns using Claude AI</li>
              <li>• Provide personalized insights into your moral development stage</li>
              <li>• Offer specific recommendations for advancing to higher stages</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 text-center">
          <NuxtLink to="/register" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Begin Your Assessment
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Kohlberg Moral Development Assessment',
  meta: [
    { name: 'description', content: 'Discover your moral development stage with our AI-powered assessment based on Lawrence Kohlberg\'s theory' }
  ]
})
</script>