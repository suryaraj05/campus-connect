# 🔧 Fix 500 Error on Registration

## 🔍 Problem

Registration endpoint returns **500 Internal Server Error**. This is a backend issue.

## 🐛 Common Causes

### 1. Firebase Not Initialized
- Firebase Admin SDK not properly initialized
- Missing or incorrect environment variables

### 2. Firestore Error
- User document creation fails
- Permission issues
- Network issues

### 3. Token Verification Fails
- Invalid Firebase ID token
- Token expired
- Token format incorrect

## 🔍 Debug Steps

### Step 1: Check Vercel Logs

```powershell
cd campus-connect/backend
vercel logs
```

Look for:
- `Error registering user:`
- `Firebase` initialization errors
- `Firestore` errors

### Step 2: Test Registration Endpoint Directly

```bash
# Get a real Firebase ID token from your app first
# Then test:
curl -X POST https://campus-connect-backend-wine.vercel.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "YOUR_FIREBASE_ID_TOKEN",
    "displayName": "Test User",
    "role": "citizen",
    "phoneNumber": "1234567890"
  }'
```

### Step 3: Check Environment Variables

In Vercel dashboard, verify:
- ✅ `FIREBASE_PROJECT_ID` = `chhif-database`
- ✅ `FIREBASE_PRIVATE_KEY` = (full key with BEGIN/END)
- ✅ `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-fbsvc@chhif-database.iam.gserviceaccount.com`

### Step 4: Check Firebase Service Account

1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Verify the service account exists
4. Check if the key is valid

## 🔧 Fixes

### Fix 1: Redeploy with Environment Variables

1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Verify all Firebase variables are set
4. Redeploy: `vercel --prod`

### Fix 2: Check Firebase Initialization

The backend logs should show:
```
✅ [Firebase] Firebase Admin initialized successfully
✅ [Firebase] Firestore: Ready
```

If you see errors, check:
- Private key format (should have `\n` for newlines)
- Client email (no quotes)
- Project ID (correct project)

### Fix 3: Test Locally First

```powershell
cd campus-connect/backend
npm start
```

Then test registration locally to see detailed error messages.

## 📋 Registration Flow

1. **Client:** Creates user in Firebase Auth
2. **Client:** Gets ID token
3. **Client:** Calls `/api/v1/auth/register` with token
4. **Backend:** Verifies token
5. **Backend:** Creates user document in Firestore
6. **Backend:** Returns user data

## 🎯 Expected Response

**Success (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "...",
    "email": "...",
    "displayName": "...",
    "role": "citizen"
  }
}
```

**Error (500):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🔍 Check Logs in App

The Flutter app now logs detailed error information:
- Full URL being called
- Response status code
- Error message from server

Check `adb logcat` to see:
```
❌ API Error Details:
   Status: 500
   URL: https://campus-connect-backend-wine.vercel.app/api/v1/auth/register
   Response: { "success": false, "message": "..." }
```

## ✅ Quick Test

1. **Use Debug Screen** in the app (bug icon in top right)
2. **Test Health Check** - Should work
3. **Test Config** - Should work
4. **Try Registration** - Check logs for error details

The debug screen will show you exactly what's happening with the API calls.

