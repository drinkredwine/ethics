import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const locale = query.locale || 'en'

    // Get scenario counts
    const { data: allScenarios } = await supabase
      .from('scenarios')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
    
    const totalCount = allScenarios?.length || 0
    
    // Filter scenarios by type from the already fetched data
    const aiScenarios = allScenarios?.filter(s => s.ai_generated === true) || []
    const originalScenarios = allScenarios?.filter(s => s.ai_generated === false) || []
    
    // Sort scenarios
    aiScenarios.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    originalScenarios.sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))

    // Calculate usage statistics from all scenarios
    const totalUsage = allScenarios?.reduce((sum, scenario) => sum + (scenario.usage_count || 0), 0) || 0
    const avgUsage = allScenarios?.length ? totalUsage / allScenarios.length : 0

    // Get model usage stats
    const modelStats = aiScenarios?.reduce((acc, scenario) => {
      const model = scenario.generation_model || 'unknown'
      acc[model] = (acc[model] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    return {
      success: true,
      stats: {
        locale,
        total_scenarios: totalCount || 0,
        original_scenarios: originalScenarios?.length || 0,
        ai_generated_scenarios: aiScenarios?.length || 0,
        total_usage: totalUsage,
        average_usage: Math.round(avgUsage * 100) / 100,
        generation_threshold_reached: (totalCount || 0) >= 100,
        model_usage: modelStats,
        most_used_scenarios: originalScenarios.slice(0, 5).map(s => ({
          title: s.title,
          usage_count: s.usage_count || 0
        })),
        recent_ai_scenarios: aiScenarios.slice(0, 5).map(s => ({
          title: s.title,
          model: s.generation_model || 'unknown',
          created: s.created_at
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching scenario stats:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch scenario statistics'
    }
  }
})