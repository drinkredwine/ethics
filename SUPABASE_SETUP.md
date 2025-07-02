# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project name: `kohlberg-assessment`
5. Generate a strong database password
6. Choose your region
7. Click "Create new project"

## 2. Get Your Keys

Once your project is created:

1. Go to Settings → API
2. Copy your project URL and anon public key
3. Update your `.env` file:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Set Up Database Schema

### Option A: Using Supabase Dashboard (Recommended)
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/001_create_assessments.sql`
3. Click "Run" to execute the migration

### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Run migrations
supabase db push
```

## 4. Configure Authentication

1. Go to Authentication → Settings in your Supabase dashboard
2. Under "Auth Providers", ensure Email is enabled
3. Configure email templates if desired
4. Set up any additional providers (Google, GitHub, etc.) if needed

## 5. Test the Setup

Your database will have these tables:
- `auth.users` (managed by Supabase Auth)
- `user_profiles` (custom profile data)
- `assessments` (assessment history)

## 6. Environment Variables for Vercel

When deploying to Vercel, add these environment variables:
- `ANTHROPIC_API_KEY` (your existing key)
- `SUPABASE_URL` (from Supabase dashboard)
- `SUPABASE_ANON_KEY` (from Supabase dashboard)

## Database Schema Overview

### `user_profiles` table:
- Links to Supabase Auth users
- Stores profile information
- Tracks assessment statistics
- Auto-created when user signs up

### `assessments` table:
- Stores complete assessment data
- Links to user via `user_id`
- Includes responses, evaluation, and calculated stage
- Protected by Row Level Security (users can only see their own)

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Auto-triggered profile creation
- Secure authentication via Supabase Auth