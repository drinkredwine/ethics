<template>
  <div class="min-h-screen bg-gray-100 py-12">
    <div class="max-w-2xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow p-6">
        <h1 class="text-2xl font-bold mb-4">Environment Debug</h1>
        <div class="space-y-3">
          <div>
            <strong>Supabase URL:</strong>
            <span class="text-green-600" v-if="supabaseUrl">✓ Set</span>
            <span class="text-red-600" v-else>✗ Missing</span>
            <code class="block text-xs text-gray-600">{{ supabaseUrl || 'Not found' }}</code>
          </div>
          <div>
            <strong>Supabase Key:</strong>
            <span class="text-green-600" v-if="supabaseKey">✓ Set</span>
            <span class="text-red-600" v-else>✗ Missing</span>
            <code class="block text-xs text-gray-600">{{ supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'Not found' }}</code>
          </div>
          <div>
            <strong>Anthropic Key:</strong>
            <span class="text-green-600" v-if="anthropicKey">✓ Set</span>
            <span class="text-red-600" v-else>✗ Missing</span>
          </div>
        </div>
        <div class="mt-6">
          <button @click="testSupabase" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Test Supabase Connection
          </button>
          <div v-if="connectionResult" class="mt-3 p-3 rounded" :class="connectionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ connectionResult.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const config = useRuntimeConfig()

const supabaseUrl = ref('')
const supabaseKey = ref('')
const anthropicKey = ref('')
const connectionResult = ref(null)

onMounted(() => {
  // Get Supabase config
  supabaseUrl.value = supabase.supabaseUrl
  supabaseKey.value = supabase.supabaseKey
  
  // Get Anthropic key (server-side only)
  anthropicKey.value = config.anthropicApiKey ? 'Set' : ''
})

const testSupabase = async () => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
    
    if (error) {
      connectionResult.value = {
        success: false,
        message: `Supabase Error: ${error.message}`
      }
    } else {
      connectionResult.value = {
        success: true,
        message: 'Supabase connection successful!'
      }
    }
  } catch (err) {
    connectionResult.value = {
      success: false,
      message: `Connection failed: ${err.message}`
    }
  }
}

useHead({
  title: 'Environment Debug'
})
</script>