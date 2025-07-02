import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const locale = query.locale || 'en'
    const count = parseInt(query.count as string) || 3

    // Get all active scenarios
    const { data: allScenarios, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('locale', locale)
      .eq('is_active', true)
    
    if (error) {
      throw error
    }

    if (!allScenarios || allScenarios.length === 0) {
      throw new Error('No scenarios found')
    }

    // Randomly select the requested number of scenarios
    const shuffled = allScenarios.sort(() => 0.5 - Math.random())
    const selectedScenarios = shuffled.slice(0, Math.min(count, allScenarios.length))

    // Randomize the order of options for each scenario
    const randomizedScenarios = selectedScenarios.map(scenario => ({
      ...scenario,
      options: shuffleOptionsWithMapping(scenario.options)
    }))

    return {
      success: true,
      scenarios: randomizedScenarios,
      total_available: allScenarios.length
    }
  } catch (error) {
    console.error('Error fetching random scenarios:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch scenarios'
    }
  }
})

// Helper function to shuffle options while maintaining stage mapping
function shuffleOptionsWithMapping(options: any[]) {
  const shuffled = [...options].sort(() => 0.5 - Math.random())
  
  // Create mapping from new position to original stage
  const stageMapping = shuffled.map((option, newIndex) => ({
    newIndex,
    originalStage: option.stage,
    text: option.text,
    reasoning: option.reasoning
  }))

  return {
    options: shuffled.map((option, index) => ({
      ...option,
      shuffledIndex: index
    })),
    stageMapping
  }
}