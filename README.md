# Kohlberg Moral Development Assessment

An AI-powered web application that assesses users' moral development stage based on Lawrence Kohlberg's theory, providing personalized insights and recommendations using Claude AI.

## Features

- **Educational Landing Page**: Comprehensive explanation of Kohlberg's 6 stages of moral development
- **User Authentication**: Secure login/register system
- **Interactive Assessment**: Moral dilemma scenarios with reasoning collection
- **AI-Powered Analysis**: Claude AI analyzes responses and provides personalized insights
- **Growth Recommendations**: Specific suggestions for advancing to higher moral development stages
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Update the `.env` file with your API keys:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Supabase Database
Follow the instructions in `SUPABASE_SETUP.md` to:
- Create your Supabase project
- Run the database migrations
- Configure authentication

### 4. Run the Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## How to Use

1. **Explore the Theory**: Visit the landing page to learn about Kohlberg's moral development stages
2. **Create Account**: Register with your email and password (uses Supabase Auth)
3. **Take Assessment**: Answer moral dilemma scenarios and provide reasoning
4. **Get Analysis**: Receive AI-powered insights about your moral development stage
5. **View History**: Access your past assessments and track your progress over time
6. **Follow Recommendations**: Use personalized suggestions to advance your moral reasoning

## Technology Stack

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS
- **Backend**: Nuxt Server API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude API
- **Deployment**: Vercel
- **Styling**: Tailwind CSS

## Assessment Flow

1. Users are presented with classic moral dilemmas (Heinz Dilemma, Draft Resistance, Lifeboat Scenario)
2. Each scenario has 6 response options corresponding to Kohlberg's stages
3. Users provide reasoning for their choices
4. Claude AI analyzes the pattern of responses and reasoning
5. Personalized evaluation includes:
   - Primary moral development stage
   - Analysis of reasoning patterns  
   - Specific recommendations for growth
