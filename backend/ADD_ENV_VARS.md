# 🔐 Add Environment Variables to Vercel

## ✅ Your Backend is Deployed!

**URLs:**
- Production: `https://campus-connect-backend-4i0f9gino-suryaraj05s-projects.vercel.app`
- Aliased: `https://campus-connect-backend-wine.vercel.app`

## 🔑 Add Environment Variables

### Method 1: Via Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/suryaraj05s-projects/campus-connect-backend
2. **Click:** Settings → Environment Variables
3. **Add these variables:**

#### 1. GEMINI_API_KEY
```
Name: GEMINI_API_KEY
Value: YOUR_GEMINI_API_KEY
Environment: Production, Preview, Development
```

#### 2. FIREBASE_PROJECT_ID
```
Name: FIREBASE_PROJECT_ID
Value: chhif-database
Environment: Production, Preview, Development
```

#### 3. FIREBASE_PRIVATE_KEY
```
Name: FIREBASE_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\nYOUR_FIREBASE_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
Environment: Production, Preview, Development
```

**Important:** Copy the ENTIRE private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` and all the `\n` characters.

#### 4. FIREBASE_CLIENT_EMAIL
```
Name: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@chhif-database.iam.gserviceaccount.com
Environment: Production, Preview, Development
```

#### 5. FRONTEND_URL
```
Name: FRONTEND_URL
Value: *
Environment: Production, Preview, Development
```

#### 6. NODE_ENV
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development
```

### Method 2: Via Vercel CLI

```powershell
cd campus-connect/backend

vercel env add GEMINI_API_KEY production
# Paste: YOUR_GEMINI_API_KEY

vercel env add FIREBASE_PROJECT_ID production
# Paste: chhif-database

vercel env add FIREBASE_PRIVATE_KEY production
# Paste the entire private key (with BEGIN/END and \n)

vercel env add FIREBASE_CLIENT_EMAIL production
# Paste: firebase-adminsdk-fbsvc@chhif-database.iam.gserviceaccount.com

vercel env add FRONTEND_URL production
# Paste: *

vercel env add NODE_ENV production
# Paste: production
```

## 🔄 Redeploy After Adding Variables

After adding environment variables, **redeploy**:

1. **Via Dashboard:**
   - Go to Deployments tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**

2. **Via CLI:**
   ```powershell
   vercel --prod
   ```

## ✅ Test Deployment

After redeploying, test:

```powershell
curl https://campus-connect-backend-wine.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Campus Connect API is running",
  "timestamp": "...",
  "version": "1.0.0"
}
```

## 🎯 Next Step: Update Frontend

After environment variables are added and redeployed, update the frontend to use the production URL!

