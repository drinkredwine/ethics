import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    console.log('🔧 Setting up database...')
    
    // Skip table creation - assume it exists or will be created manually
    console.log('⚠️ Skipping table creation - please create manually in Supabase dashboard')
    
    // Insert test data
    const scenarios = [
      {
        title: 'Heinz Dilemma',
        description: 'In Europe, a woman was near death from a special kind of cancer. There was one drug that the doctors thought might save her. Should Heinz steal the drug to save his wife?',
        options: [
          {"text": "No, because he could get caught and punished for stealing", "stage": 1},
          {"text": "Yes, because he needs the drug and the druggist is being unfair", "stage": 2},
          {"text": "Yes, because a good husband should do everything to save his wife", "stage": 3},
          {"text": "No, because stealing is against the law and law must be maintained", "stage": 4},
          {"text": "Yes, because the right to life is more fundamental than property rights", "stage": 5},
          {"text": "Yes, because preserving human life is a universal moral principle", "stage": 6}
        ],
        locale: 'en',
        is_active: true
      },
      {
        title: 'Trolley Problem',
        description: 'A runaway trolley is heading toward five people tied to the tracks. You can pull a lever to divert it to another track, but there is one person tied to that track who will be killed. What should you do?',
        options: [
          {"text": "Do nothing to avoid being blamed for the death", "stage": 1},
          {"text": "Pull the lever because saving five lives is better than one", "stage": 2},
          {"text": "Pull the lever because most people would expect you to save more lives", "stage": 3},
          {"text": "Follow whatever the official emergency protocol says", "stage": 4},
          {"text": "Pull the lever as it maximizes welfare for the greatest number", "stage": 5},
          {"text": "Refuse to actively cause anyone death, regardless of consequences", "stage": 6}
        ],
        locale: 'en',
        is_active: true
      }
    ]
    
    // Insert scenarios
    const { error: insertError } = await supabase
      .from('scenarios')
      .insert(scenarios)
    
    if (insertError) {
      console.error('Insert error:', insertError)
      return { success: false, error: insertError.message }
    }
    
    console.log('✅ Scenarios inserted successfully')
    
    // Test the setup
    const { data: testData, error: testError } = await supabase
      .from('scenarios')
      .select('*')
      .limit(1)
    
    if (testError) {
      return { success: false, error: testError.message }
    }
    
    return { 
      success: true, 
      message: 'Database setup complete!',
      scenarios_count: testData?.length || 0
    }
    
  } catch (error) {
    console.error('Setup error:', error)
    return { 
      success: false, 
      error: error.message || 'Unknown error during setup' 
    }
  }
})