# The Code Kid - Complete Setup Guide

This guide walks you through setting up The Code Kid from scratch. Follow each step carefully.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Backend Setup](#backend-setup)
4. [Supabase Setup](#supabase-setup)
5. [Judge0 API Setup](#judge0-api-setup)
6. [Frontend Setup](#frontend-setup)
7. [Running the Application](#running-the-application)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- A **Supabase account** (free tier works) - [Sign up here](https://supabase.com)
- A **RapidAPI account** (for Judge0 compiler) - [Sign up here](https://rapidapi.com)

---

## Clone the Repository

```bash
git clone https://github.com/kavya-dev05/The-Code-Kid.git
cd The-Code-Kid
```

---

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `backend/.env` and fill in your values:
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key

   # Judge0 API Configuration
   JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
   JUDGE0_API_KEY=your_rapidapi_key_here
   JUDGE0_HOST=judge0-ce.p.rapidapi.com

   # Server Port
   PORT=3000
   ```

---

## Supabase Setup

### Step 1: Create a New Project

1. Go to [Supabase](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Project name**: The Code Kid (or your choice)
   - **Database password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** (takes 2-3 minutes)

### Step 2: Get API Keys

1. Once project is ready, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (secret!) → `SUPABASE_SERVICE_KEY`

> ⚠️ **Important**: Never commit `SUPABASE_SERVICE_KEY` to Git. It's already in `.gitignore`.

### Step 3: Deploy Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy the entire contents of `backend/db/migration.sql`
4. Paste into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)

This creates:
- `profiles` table (user data)
- `completions` table (challenge tracking)
- `user_badges` table (achievements)
- `activity_log` table (user activity)
- `daily_challenge_completions` table (daily challenges)
- All necessary indexes for performance
- Row Level Security (RLS) policies
- Triggers for auto-creating profiles

### Step 4: Verify Tables

1. Go to **Table Editor**
2. You should see all tables listed:
   - `profiles`
   - `completions`
   - `user_badges`
   - `activity_log`
   - `daily_challenge_completions`

---

## Judge0 API Setup

### Step 1: Subscribe to Judge0 API

1. Go to [Judge0 CE on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Click **"Subscribe to Test"** (free tier)
3. Complete the subscription

### Step 2: Get Your API Key

1. On the Judge0 API page, find **"X-RapidAPI-Key"** header
2. Copy your key
3. Add it to `backend/.env`:
   ```env
   JUDGE0_API_KEY=your_actual_key_here
   ```

### Step 3: Verify Configuration

After starting the backend (see below), visit:
```
http://localhost:3000/api/compiler/health
```

You should see:
```json
{
  "status": "ok",
  "judge0Configured": true,
  "judge0Url": "https://judge0-ce.p.rapidapi.com"
}
```

---

## Frontend Setup

### Step 1: Configure API URL

Open `index.html` and find the API configuration section (around line 5596):

```javascript
(function configureAPI() {
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  if (isProduction) {
    // Production: Replace with your deployed backend URL
    window.API_BASE = 'https://your-backend-url.herokuapp.com/api';
  } else {
    // Development
    window.API_BASE = 'http://localhost:3000/api';
  }
})();
```

**For local development**: Keep as `localhost:3000`

**For production**: Replace with your deployed backend URL

### Step 2: Open in Browser

Use VS Code's **Live Server** extension:
1. Right-click `index.html`
2. Select **"Open with Live Server"**

Or open `index.html` directly in your browser.

---

## Running the Application

### Terminal 1: Start Backend

```bash
cd backend
npm start
```

You should see:
```
✅ Supabase connection validated successfully

🚀 TheCodeKid backend running on http://localhost:3000
   Supabase: https://your-project.supabase.co
   Judge0: https://judge0-ce.p.rapidapi.com
```

### Terminal 2: Open Frontend

Open `index.html` with Live Server or directly in your browser.

---

## Troubleshooting

### Backend won't start

**Error: Missing environment variables**
```
❌ CRITICAL: Missing required environment variables
```
→ Check `backend/.env` exists and has all required values

**Error: Module not found**
```
Error: Cannot find module 'express'
```
→ Run `npm install` in the `backend` folder

### Supabase connection fails

**Error: Invalid API key**
→ Double-check `SUPABASE_SERVICE_KEY` (not the anon key!)
→ Ensure you copied the full key without extra spaces

**Error: Table doesn't exist**
→ Run the migration SQL in Supabase SQL Editor
→ Check Table Editor to verify tables were created

### Judge0 code execution fails

**Error: Invalid Judge0 API key**
→ Check `JUDGE0_API_KEY` in `.env`
→ Verify your RapidAPI subscription is active

**Error: Rate limit exceeded**
→ Free tier allows ~50 requests/month
→ Wait for next billing cycle or upgrade

### Frontend issues

**"Cannot connect to server"**
→ Ensure backend is running on port 3000
→ Check browser console for CORS errors
→ Verify API URL matches your backend location

**Login/Signup doesn't work**
→ Check browser console for errors
→ Verify Supabase credentials are correct
→ Check Network tab for failed requests

### Password Reset not working

**Reset email not arriving**
→ Check spam folder
→ Verify email address is correct
→ Supabase requires verified email addresses for password reset

**Reset link doesn't work**
→ The reset link redirects to `/reset-password`
→ Ensure you're running the frontend
→ Check that the reset-password page exists

### Avatar upload fails

**"Failed to upload avatar"**
→ Ensure you're logged in
→ Check backend logs for errors
→ Verify `/api/user/avatar` endpoint is accessible

### Database performance issues

**Slow leaderboard queries**
→ Verify indexes exist (check migration.sql)
→ Run `EXPLAIN ANALYZE` on slow queries in Supabase

**RLS policy too permissive**
→ Review policies in `backend/db/migration.sql`
→ Consider adding rate limiting at API level

---

## Production Deployment

### Backend (Heroku/Railway/Render)

1. Push code to your Git repository
2. Connect to your hosting provider
3. Set environment variables in hosting dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `JUDGE0_API_KEY`
   - `JUDGE0_API_URL`
   - `JUDGE0_HOST`
   - `PORT`

### Frontend (Vercel/Netlify)

1. Push code to Git
2. Connect to Vercel/Netlify
3. Update `index.html` API URL to your backend URL
4. Deploy

---

## Security Notes

- ✅ `SUPABASE_SERVICE_KEY` is in `.gitignore` - never commit it
- ✅ RLS policies protect direct database access
- ✅ Rate limiting configured in `backend/server.js`
- ⚠️ Consider adding CORS origins for production
- ⚠️ Enable HTTPS for production deployments

---

## Need Help?

- Check browser console for frontend errors
- Check backend terminal for server errors
- Review Supabase logs in dashboard → Logs
- Open an issue on GitHub with error details

---

*Built with purpose. Designed with love.*
