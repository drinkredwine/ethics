# Deployment Guide

## Vercel Deployment

### 1. Prerequisites
- GitHub account
- Vercel account (linked to GitHub)
- Supabase project set up with API keys

### 2. Push to GitHub
```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit - Kohlberg Assessment App"

# Create GitHub repository and push
# (Replace with your GitHub username/repo)
git remote add origin https://github.com/yourusername/kohlberg-assessment.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Nuxt.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
   - **Install Command**: `npm install`

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? N
# - Project name: kohlberg-assessment
# - Directory: ./
# - Override settings? N
```

### 4. Environment Variables

In your Vercel project dashboard, go to **Settings** → **Environment Variables** and add:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. Domain Configuration (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed

### 6. Supabase Configuration Update

In your Supabase dashboard:

1. Go to **Settings** → **API**
2. Update **Site URL** to your Vercel deployment URL
3. Add your Vercel domain to **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-custom-domain.com/auth/callback` (if using custom domain)

### 7. Test Deployment

1. Visit your deployed application
2. Test user registration/login
3. Complete an assessment
4. Check that data is saved to Supabase
5. Verify assessment history works

## Automatic Deployments

Once connected to GitHub, Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

## Monitoring and Analytics

Enable in Vercel dashboard:
- **Analytics**: Track page views and performance
- **Speed Insights**: Monitor Core Web Vitals
- **Functions**: Monitor serverless function performance

## Troubleshooting

### Build Errors
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### Authentication Issues
- Verify Supabase URL and keys
- Check Site URL and Redirect URLs in Supabase
- Ensure email confirmation is disabled in Supabase Auth settings (for development)

### Database Connection Issues
- Verify Supabase project is active
- Check Row Level Security policies
- Ensure database migrations have been run

## Local Development vs Production

### Local (.env)
```
ANTHROPIC_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

### Production (Vercel Environment Variables)
Same variables but configured in Vercel dashboard, not in files.

## Security Considerations

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Enable Row Level Security on all Supabase tables
- Regularly rotate API keys
- Monitor usage and set up billing alerts