-- Create scenarios table to store moral dilemma scenarios
CREATE TABLE scenarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 6 options with stage mappings
  locale VARCHAR(5) NOT NULL DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for efficient querying by locale and active status
CREATE INDEX idx_scenarios_locale_active ON scenarios(locale, is_active);

-- Insert existing scenarios from the current system
INSERT INTO scenarios (title, description, options, locale) VALUES 
(
  'Heinz Dilemma',
  'In Europe, a woman was near death from a special kind of cancer. There was one drug that the doctors thought might save her. It was a form of radium that a druggist in the same town had recently discovered. The drug was expensive to make, but the druggist was charging ten times what the drug cost him to make. He paid $200 for the radium and charged $2,000 for a small dose of the drug. The sick woman''s husband, Heinz, went to everyone he knew to borrow the money, but he could only get together about $1,000, which is half of what it cost. He told the druggist that his wife was dying and asked him to sell it cheaper or let him pay later. But the druggist said: "No, I discovered the drug and I''m going to make money from it." So Heinz got desperate and broke into the man''s store to steal the drug for his wife. Should Heinz have stolen the drug?',
  '[
    {
      "text": "No, because he could get caught and punished for stealing",
      "stage": 1,
      "reasoning": "Focus on avoiding punishment and consequences"
    },
    {
      "text": "Yes, because he needs the drug and the druggist is being unfair",
      "stage": 2,
      "reasoning": "Self-interest and instrumental exchange"
    },
    {
      "text": "Yes, because a good husband should do everything to save his wife",
      "stage": 3,
      "reasoning": "Meeting social expectations and being a good person"
    },
    {
      "text": "No, because stealing is against the law and law must be maintained",
      "stage": 4,
      "reasoning": "Maintaining social order and following rules"
    },
    {
      "text": "Yes, because the right to life is more fundamental than property rights",
      "stage": 5,
      "reasoning": "Social contract and individual rights"
    },
    {
      "text": "Yes, because preserving human life is a universal moral principle",
      "stage": 6,
      "reasoning": "Universal ethical principles"
    }
  ]'::jsonb,
  'en'
),
(
  'Officer and Draft',
  'In a country at war, a young man is drafted into the military. However, he believes the war is unjust and morally wrong. He has been offered a position as an officer, which would give him better conditions and less dangerous duties. If he refuses, he will be assigned to the front lines as a regular soldier, which could mean almost certain death. He could also try to flee the country, but this would mean leaving his family behind and never being able to return. What should he do?',
  '[
    {
      "text": "Accept the officer position to avoid the dangerous front lines",
      "stage": 1,
      "reasoning": "Avoiding physical harm and punishment"
    },
    {
      "text": "Take the officer position because it benefits him and his family",
      "stage": 2,
      "reasoning": "Personal advantage and instrumental reasoning"
    },
    {
      "text": "Accept the position because others expect him to serve his country",
      "stage": 3,
      "reasoning": "Meeting social expectations and approval"
    },
    {
      "text": "Serve as drafted because it is his legal duty as a citizen",
      "stage": 4,
      "reasoning": "Following laws and maintaining social order"
    },
    {
      "text": "Refuse to participate in an unjust war, even if it means consequences",
      "stage": 5,
      "reasoning": "Higher principles over legal obligations"
    },
    {
      "text": "Follow his conscience and universal principles against killing",
      "stage": 6,
      "reasoning": "Universal ethical principles over all other considerations"
    }
  ]'::jsonb,
  'en'
),
(
  'Lifeboat Dilemma',
  'A ship has sunk and there are survivors in a lifeboat that can only hold a limited number of people safely. The boat is overcrowded and will sink unless some people are removed. Among the survivors are an elderly person, a young child, a pregnant woman, a doctor, and several other adults. The sea is rough and anyone thrown overboard will likely die. As the person making decisions, what should you do?',
  '[
    {
      "text": "Save whoever is strongest to avoid being blamed if everyone dies",
      "stage": 1,
      "reasoning": "Fear of consequences and blame"
    },
    {
      "text": "Save those who can be most useful for survival, including yourself",
      "stage": 2,
      "reasoning": "Practical self-interest and instrumental value"
    },
    {
      "text": "Try to save those that others would expect you to save first",
      "stage": 3,
      "reasoning": "Social expectations and being seen as good"
    },
    {
      "text": "Follow established maritime law and protocols for such situations",
      "stage": 4,
      "reasoning": "Following established rules and procedures"
    },
    {
      "text": "Create a fair system that gives everyone an equal chance",
      "stage": 5,
      "reasoning": "Democratic process and social contract"
    },
    {
      "text": "Refuse to choose who lives or dies as all human life is equally valuable",
      "stage": 6,
      "reasoning": "Universal principle of human dignity"
    }
  ]'::jsonb,
  'en'
);

-- Add more diverse scenarios to expand the database
INSERT INTO scenarios (title, description, options, locale) VALUES 
(
  'The Runaway Trolley',
  'A runaway trolley is heading toward five people tied to the tracks. You can pull a lever to divert the trolley to another track, but there is one person tied to that track who will be killed. The five people will definitely die if you do nothing. What should you do?',
  '[
    {
      "text": "Do nothing to avoid being blamed for the one person''s death",
      "stage": 1,
      "reasoning": "Avoiding direct responsibility and punishment"
    },
    {
      "text": "Pull the lever because saving five lives is better than saving one",
      "stage": 2,
      "reasoning": "Calculating personal benefit and practical outcomes"
    },
    {
      "text": "Pull the lever because most people would expect you to save more lives",
      "stage": 3,
      "reasoning": "Social approval and being seen as heroic"
    },
    {
      "text": "Follow whatever the official emergency protocol says to do",
      "stage": 4,
      "reasoning": "Following established rules and procedures"
    },
    {
      "text": "Pull the lever as it maximizes welfare for the greatest number",
      "stage": 5,
      "reasoning": "Utilitarian calculation and social contract"
    },
    {
      "text": "Refuse to actively cause anyone''s death, regardless of consequences",
      "stage": 6,
      "reasoning": "Universal principle against actively killing"
    }
  ]'::jsonb,
  'en'
),
(
  'The Whistleblower',
  'Sarah works for a pharmaceutical company and discovers that her company is hiding serious side effects of a new drug that could harm patients. Reporting this would likely result in her being fired and blacklisted from the industry, affecting her family''s financial security. The company has significant influence and might not face serious consequences even if reported. What should Sarah do?',
  '[
    {
      "text": "Stay quiet to avoid losing her job and facing retaliation",
      "stage": 1,
      "reasoning": "Avoiding personal consequences and punishment"
    },
    {
      "text": "Stay quiet but look for a new job to protect her own interests",
      "stage": 2,
      "reasoning": "Self-preservation and practical considerations"
    },
    {
      "text": "Report it because good employees should be honest and trustworthy",
      "stage": 3,
      "reasoning": "Living up to social ideals of being a good person"
    },
    {
      "text": "Report through official channels as required by company policy",
      "stage": 4,
      "reasoning": "Following proper procedures and regulations"
    },
    {
      "text": "Report to authorities because public safety overrides company loyalty",
      "stage": 5,
      "reasoning": "Social contract and greater good"
    },
    {
      "text": "Report it because protecting innocent lives is a moral imperative",
      "stage": 6,
      "reasoning": "Universal principle of protecting human welfare"
    }
  ]'::jsonb,
  'en'
);

-- Enable Row Level Security
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all scenarios
CREATE POLICY "Allow read access to scenarios" ON scenarios
  FOR SELECT USING (is_active = true);