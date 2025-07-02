import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const locale = body.locale || 'en'
    const existingScenarios = body.existingScenarios || []
    const userId = body.userId // Pass user ID to track history
    
    // Check if we have enough scenarios (threshold: 100)
    const { data: scenarios, error: countError } = await supabase
      .from('scenarios')
      .select('id')
      .eq('locale', locale)
      .eq('is_active', true)
    
    if (countError) {
      console.warn('Error counting scenarios:', countError)
    }
    
    const totalScenarios = scenarios?.length || 0
    
    if (totalScenarios >= 100) {
      // We have enough scenarios, try to get unused ones instead
      if (userId) {
        // Get scenarios not used by this user
        const { data: userHistory } = await supabase
          .from('user_scenario_history')
          .select('scenario_id')
          .eq('user_id', userId)
        
        const usedScenarioIds = userHistory?.map(h => h.scenario_id) || []
        
        let unusedQuery = supabase
          .from('scenarios')
          .select('*')
          .eq('locale', locale)
          .eq('is_active', true)
          .limit(1)
        
        if (usedScenarioIds.length > 0) {
          unusedQuery = unusedQuery.not('id', 'in', `(${usedScenarioIds.map(id => `'${id}'`).join(',')})`)
        }
        
        const { data: unusedScenarios } = await unusedQuery
        
        if (unusedScenarios && unusedScenarios.length > 0) {
          const scenario = unusedScenarios[0]
          return {
            success: true,
            scenario: {
              ...scenario,
              options: shuffleOptionsWithMapping(scenario.options)
            },
            from_database: true,
            total_scenarios: totalScenarios
          }
        }
      }
      
      // If no unused scenarios or no user ID, fall back to random selection
      const { data: randomScenarios } = await supabase
        .from('scenarios')
        .select('*')
        .eq('locale', locale)
        .eq('is_active', true)
        .order('usage_count', { ascending: true })
        .limit(1)
      
      if (randomScenarios && randomScenarios.length > 0) {
        const scenario = randomScenarios[0]
        return {
          success: true,
          scenario: {
            ...scenario,
            options: shuffleOptionsWithMapping(scenario.options)
          },
          from_database: true,
          total_scenarios: totalScenarios
        }
      }
    }

    const systemPrompt = `You are an expert in moral psychology and Kohlberg's stages of moral development. Generate a unique moral dilemma scenario that is different from the provided existing scenarios.

The scenario must:
1. Present a clear moral conflict with no easy answer
2. Be relatable and engaging
3. Allow for responses across all 6 Kohlberg stages
4. Be culturally sensitive and appropriate
5. Be different from existing scenarios to avoid repetition

Kohlberg's 6 Stages:
Stage 1: Punishment Avoidance (Preconventional) - Focus on avoiding negative consequences
Stage 2: Instrumental Purpose (Preconventional) - Self-interest and exchange
Stage 3: Good Interpersonal Relationships (Conventional) - Social approval and being "good"
Stage 4: Maintaining Social Order (Conventional) - Following rules, law, and order
Stage 5: Social Contract (Postconventional) - Democratic principles and individual rights
Stage 6: Universal Ethical Principles (Postconventional) - Universal moral principles

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Brief scenario title",
  "description": "Detailed scenario description ending with a clear moral question",
  "options": [
    {
      "text": "Response option reflecting Stage 1 thinking",
      "stage": 1,
      "reasoning": "Brief explanation of Stage 1 moral reasoning"
    },
    {
      "text": "Response option reflecting Stage 2 thinking", 
      "stage": 2,
      "reasoning": "Brief explanation of Stage 2 moral reasoning"
    },
    {
      "text": "Response option reflecting Stage 3 thinking",
      "stage": 3, 
      "reasoning": "Brief explanation of Stage 3 moral reasoning"
    },
    {
      "text": "Response option reflecting Stage 4 thinking",
      "stage": 4,
      "reasoning": "Brief explanation of Stage 4 moral reasoning"
    },
    {
      "text": "Response option reflecting Stage 5 thinking",
      "stage": 5,
      "reasoning": "Brief explanation of Stage 5 moral reasoning"
    },
    {
      "text": "Response option reflecting Stage 6 thinking",
      "stage": 6,
      "reasoning": "Brief explanation of Stage 6 moral reasoning"
    }
  ]
}`

    const userPrompt = `Generate a new moral dilemma scenario in ${locale === 'sk' ? 'Slovak' : 'English'}.

Existing scenarios to avoid similarity with:
${existingScenarios.map((s: any, i: number) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}

Create something completely different from these existing scenarios.`

    // Use cost-optimized model (Haiku for simple scenario generation)
    const model = totalScenarios < 50 ? 'claude-3-5-haiku-20241022' : 'claude-3-5-sonnet-20241022'
    
    const response = await anthropic.messages.create({
      model,
      max_tokens: 2000,
      temperature: 0.8, // Higher temperature for more creative scenarios
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI')
    }

    let generatedScenario
    try {
      generatedScenario = JSON.parse(content.text)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content.text)
      throw new Error('Failed to parse AI-generated scenario')
    }

    // Validate the generated scenario structure
    if (!generatedScenario.title || !generatedScenario.description || !generatedScenario.options) {
      throw new Error('Invalid scenario structure generated')
    }

    if (!Array.isArray(generatedScenario.options) || generatedScenario.options.length !== 6) {
      throw new Error('Scenario must have exactly 6 options')
    }

    // Save the generated scenario to database for future reuse
    const { data: savedScenario, error: saveError } = await supabase
      .from('scenarios')
      .insert({
        title: generatedScenario.title,
        description: generatedScenario.description,
        options: generatedScenario.options,
        locale,
        is_active: true,
        ai_generated: true,
        generation_model: model,
        usage_count: 0
      })
      .select()
      .single()

    if (saveError) {
      console.error('Warning: Failed to save generated scenario:', saveError)
      // Continue anyway with temporary scenario
    }

    // Use saved scenario if available, otherwise create temporary one
    const scenarioToUse = savedScenario || {
      id: `ai-generated-${Date.now()}`,
      title: generatedScenario.title,
      description: generatedScenario.description,
      options: generatedScenario.options,
      locale,
      is_active: true,
      created_at: new Date().toISOString(),
      ai_generated: true,
      generation_model: model,
      usage_count: 0
    }

    // Randomize the order of options
    const randomizedOptions = shuffleOptionsWithMapping(scenarioToUse.options)

    return {
      success: true,
      scenario: {
        ...scenarioToUse,
        options: randomizedOptions
      },
      from_database: false,
      model_used: model,
      total_scenarios: totalScenarios + (savedScenario ? 1 : 0)
    }
  } catch (error) {
    console.error('Error generating AI scenario:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate scenario'
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