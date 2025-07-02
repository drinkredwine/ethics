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
    
    console.log('🚀 Generating 50 moral dilemma scenarios...')
    
    // Check how many scenarios we already have
    const { data: existing } = await supabase
      .from('scenarios')
      .select('id')
      .eq('locale', locale)
      .eq('is_active', true)
    
    const existingCount = existing?.length || 0
    const needed = 50 - existingCount
    
    if (needed <= 0) {
      return {
        success: true,
        message: `Already have ${existingCount} scenarios. Target of 50 reached!`,
        total_scenarios: existingCount
      }
    }
    
    console.log(`📊 Have ${existingCount} scenarios, generating ${needed} more...`)
    
    const systemPrompt = `You are an expert in moral psychology and Kohlberg's stages of moral development. Generate unique moral dilemma scenarios for assessment purposes.

Each scenario must:
1. Present a clear moral conflict with no easy answer
2. Be relatable and engaging (300-500 words)
3. Allow for responses across all 6 Kohlberg stages
4. Be culturally appropriate and diverse
5. Cover different domains (medical, legal, family, business, social, etc.)

Kohlberg's 6 Stages:
Stage 1: Punishment Avoidance - Focus on avoiding negative consequences
Stage 2: Instrumental Purpose - Self-interest and exchange  
Stage 3: Good Interpersonal Relationships - Social approval and being "good"
Stage 4: Maintaining Social Order - Following rules, law, and order
Stage 5: Social Contract - Democratic principles and individual rights
Stage 6: Universal Ethical Principles - Universal moral principles

Return ONLY a valid JSON object with this structure:
{
  "scenarios": [
    {
      "title": "Brief scenario title",
      "description": "Detailed scenario description ending with a clear moral question",
      "options": [
        {"text": "Response reflecting Stage 1 thinking", "stage": 1, "reasoning": "Brief explanation"},
        {"text": "Response reflecting Stage 2 thinking", "stage": 2, "reasoning": "Brief explanation"},
        {"text": "Response reflecting Stage 3 thinking", "stage": 3, "reasoning": "Brief explanation"},
        {"text": "Response reflecting Stage 4 thinking", "stage": 4, "reasoning": "Brief explanation"},
        {"text": "Response reflecting Stage 5 thinking", "stage": 5, "reasoning": "Brief explanation"},
        {"text": "Response reflecting Stage 6 thinking", "stage": 6, "reasoning": "Brief explanation"}
      ]
    }
  ]
}`

    const batchSize = 5 // Generate 5 scenarios per API call
    const totalBatches = Math.ceil(needed / batchSize)
    let generatedCount = 0
    
    for (let batch = 0; batch < totalBatches; batch++) {
      const scenariosInBatch = Math.min(batchSize, needed - generatedCount)
      
      console.log(`🎯 Batch ${batch + 1}/${totalBatches}: Generating ${scenariosInBatch} scenarios...`)
      
      const userPrompt = `Generate ${scenariosInBatch} diverse moral dilemma scenarios in ${locale === 'sk' ? 'Slovak' : 'English'}. 

Make them cover different themes like:
- Medical ethics (life/death decisions)
- Legal/justice issues  
- Family obligations vs personal freedom
- Business ethics and corruption
- Environmental vs economic concerns
- Privacy vs security
- Individual vs collective good
- Technology and AI ethics
- Resource distribution and fairness
- Truth-telling vs protecting feelings

Each scenario should be unique and thought-provoking.`

      try {
        const response = await anthropic.messages.create({
          model: 'claude-3-5-haiku-20241022', // Use cost-effective model
          max_tokens: 4000,
          temperature: 0.9, // High creativity
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

        let batchData
        try {
          batchData = JSON.parse(content.text)
        } catch (parseError) {
          console.error('Failed to parse AI response:', content.text)
          continue // Skip this batch
        }

        if (!batchData.scenarios || !Array.isArray(batchData.scenarios)) {
          console.error('Invalid batch structure')
          continue
        }

        // Insert scenarios into database
        for (const scenario of batchData.scenarios) {
          if (!scenario.title || !scenario.description || !scenario.options) {
            console.error('Invalid scenario structure:', scenario.title)
            continue
          }

          if (!Array.isArray(scenario.options) || scenario.options.length !== 6) {
            console.error('Scenario must have exactly 6 options:', scenario.title)
            continue
          }

          try {
            const { error } = await supabase
              .from('scenarios')
              .insert({
                title: scenario.title,
                description: scenario.description,
                options: scenario.options,
                locale,
                is_active: true,
                ai_generated: true,
                generation_model: 'claude-3-5-haiku-20241022',
                usage_count: 0
              })

            if (error) {
              console.error('Error inserting scenario:', scenario.title, error.message)
            } else {
              generatedCount++
              console.log(`✅ Generated: ${scenario.title}`)
            }
          } catch (insertError) {
            console.error('Insert error:', insertError)
          }
        }

        // Small delay between batches to be respectful to API
        if (batch < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }

      } catch (apiError) {
        console.error(`Batch ${batch + 1} failed:`, apiError.message)
        continue
      }
    }

    // Get final count
    const { data: final } = await supabase
      .from('scenarios')
      .select('id')
      .eq('locale', locale)
      .eq('is_active', true)
    
    const finalCount = final?.length || 0

    return {
      success: true,
      message: `Generation complete! Generated ${generatedCount} new scenarios.`,
      scenarios_generated: generatedCount,
      total_scenarios: finalCount,
      target_reached: finalCount >= 50
    }

  } catch (error) {
    console.error('Error generating scenarios:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate scenarios'
    }
  }
})