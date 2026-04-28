# 🚀 Deploy Backend to Vercel

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free)
2. **Vercel CLI** (optional, but recommended)
3. **Git Repository** (GitHub, GitLab, or Bitbucket)

---

## 🎯 Method 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Prepare Your Code

1. **Make sure your code is in a Git repository:**
   ```powershell
   cd campus-connect/backend
   git init
   git add .
   git commit -m "Initial commit - Backend ready for Vercel"
   ```

2. **Push to GitHub/GitLab/Bitbucket:**
   - Create a new repository on GitHub
   - Push your code:
     ```powershell
     git remote add origin https://github.com/YOUR_USERNAME/campus-connect-backend.git
     git push -u origin main
     ```

### Step 2: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your Git repository** (GitHub/GitLab/Bitbucket)
4. **Configure project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend` (if repo has frontend too) or leave blank
   - **Build Command:** Leave blank (no build needed)
   - **Output Directory:** Leave blank
   - **Install Command:** `npm install`

5. **Click "Deploy"**

### Step 3: Add Environment Variables

**After deployment, add environment variables:**

1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
FIREBASE_PROJECT_ID=chhif-database
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FIREBASE_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@chhif-database.iam.gserviceaccount.com"
FRONTEND_URL=*
NODE_ENV=production
```

**Important Notes:**
- For `FIREBASE_PRIVATE_KEY`, copy the **entire key including quotes and `\n`**
- Vercel will handle the newlines automatically
- `FRONTEND_URL=*` allows all origins (or set specific URL later)

3. **Redeploy** after adding environment variables:
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**

### Step 4: Get Your Deployment URL

After deployment, you'll get a URL like:
```
https://campus-connect-backend.vercel.app
```

**Test it:**
```
https://campus-connect-backend.vercel.app/api/health
```

Should return: `{"status":"ok","message":"Campus Connect API is running"}`

---

## 🎯 Method 2: Deploy via Vercel CLI (Faster)

### Step 1: Install Vercel CLI

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

### Step 3: Deploy

```powershell
cd campus-connect/backend
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** `campus-connect-backend` (or your choice)
- **Directory?** `./` (current directory)

### Step 4: Add Environment Variables

```powershell
vercel env add GEMINI_API_KEY
# Paste: YOUR_GEMINI_API_KEY

vercel env add FIREBASE_PROJECT_ID
# Paste: chhif-database

vercel env add FIREBASE_PRIVATE_KEY
# Paste the entire private key (with quotes and \n)

vercel env add FIREBASE_CLIENT_EMAIL
# Paste: firebase-adminsdk-fbsvc@chhif-database.iam.gserviceaccount.com

vercel env add FRONTEND_URL
# Paste: *

vercel env add NODE_ENV
# Paste: production
```

### Step 5: Deploy to Production

```powershell
vercel --prod
```

---

## ✅ Verify Deployment

### Test Health Endpoint

```powershell
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Campus Connect API is running",
  "timestamp": "2024-...",
  "version": "1.0.0"
}
```

### Test AI Endpoint (Optional)

```powershell
curl -X POST https://your-app.vercel.app/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","images":[]}'
```

---

## 🔄 Update Frontend

After deployment, update `frontend/lib/config/api_config.dart`:

```dart
// Replace with your Vercel URL
static const String productionBaseUrl = 'https://your-app.vercel.app';

// Change baseUrl to production
static const String baseUrl = productionBaseUrl;
```

---

## 🐛 Troubleshooting

### Issue 1: Environment Variables Not Working

**Solution:**
- Make sure you added them in Vercel dashboard
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue 2: Firebase Not Initializing

**Solution:**
- Check `FIREBASE_PRIVATE_KEY` includes quotes and `\n`
- Verify `FIREBASE_PROJECT_ID` is correct
- Check Vercel logs for errors

### Issue 3: CORS Errors

**Solution:**
- Update `FRONTEND_URL` in Vercel env vars
- Or set to `*` for all origins (development only)

### Issue 4: Function Timeout

**Solution:**
- Vercel free tier: 10s timeout
- Pro tier: 60s timeout
- For AI analysis, might need Pro tier or optimize code

---

## 📋 Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Health endpoint working
- [ ] Frontend updated with production URL
- [ ] Tested registration/login
- [ ] Tested AI analysis (if needed)

---

## 🎉 Next Steps

1. **Update frontend** to use production URL
2. **Test all endpoints** from Flutter app
3. **Monitor Vercel logs** for any errors
4. **Set up custom domain** (optional)

---

**Your backend will be live at: `https://your-app.vercel.app`** 🚀

