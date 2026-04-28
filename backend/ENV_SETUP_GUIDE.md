# 🔧 Environment Variables Setup Guide

Complete guide on how to fill your `.env` file for the Campus Connect backend.

## 📝 Step-by-Step Instructions

### 1. Create `.env` File

In the `backend` folder, create a file named `.env` (not `.env.example`)

```bash
cd campus-connect/backend
touch .env  # or create manually
```

### 2. Copy Template

Copy the content from `.env.example` to `.env` and fill in the values below.

---

## 🔑 How to Get Each Value

### 1. **GEMINI_API_KEY**

**Where to get it:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

**Example:**
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

### 2. **FIREBASE_PROJECT_ID**

**Where to get it:**
- From your existing Firebase project: `chhif-database`
- Or check Firebase Console > Project Settings > General

**Example:**
```env
FIREBASE_PROJECT_ID=chhif-database
```

---

### 3. **FIREBASE_PRIVATE_KEY**

**Where to get it:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`chhif-database`)
3. Click the ⚙️ gear icon > **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. A JSON file will download
7. Open the JSON file and find the `private_key` field
8. Copy the ENTIRE value (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
9. Keep the `\n` characters (they represent newlines)

**Important:** 
- The private key must be in quotes
- Keep all `\n` characters
- It should look like this:

**Example:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FIREBASE_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
```

**⚠️ Common Mistakes:**
- ❌ Don't remove the `\n` characters
- ❌ Don't remove the quotes
- ❌ Don't add extra spaces
- ✅ Keep it exactly as it appears in the JSON file

---

### 4. **FIREBASE_CLIENT_EMAIL**

**Where to get it:**
- From the same JSON file you downloaded above
- Find the `client_email` field
- Copy the entire email address

**Example:**
```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@chhif-database.iam.gserviceaccount.com
```

---

### 5. **FRONTEND_URL**

**For local development:**
```env
FRONTEND_URL=http://localhost:3000
```

**For production (after Flutter app is ready):**
- Update this to your Flutter app's URL
- Or use `*` for testing (not recommended for production)

**Example:**
```env
FRONTEND_URL=http://localhost:3000
```

---

### 6. **PORT**

**For local development:**
```env
PORT=3000
```

**For Vercel:**
- Vercel automatically sets the port, so this is optional
- But keep it for local development

---

### 7. **NODE_ENV**

**For local development:**
```env
NODE_ENV=development
```

**For production (Vercel):**
- Vercel automatically sets this to `production`
- But keep it for local development

---

## 📋 Complete Example `.env` File

```env
# Google Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=chhif-database
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FIREBASE_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@chhif-database.iam.gserviceaccount.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## 🔍 Quick Checklist

Before running the server, make sure:

- [ ] `.env` file exists in `backend/` folder
- [ ] `GEMINI_API_KEY` is filled (get from Google AI Studio)
- [ ] `FIREBASE_PROJECT_ID` is filled (your project: `chhif-database`)
- [ ] `FIREBASE_PRIVATE_KEY` is filled (from Service Account JSON, keep `\n`)
- [ ] `FIREBASE_CLIENT_EMAIL` is filled (from Service Account JSON)
- [ ] `FRONTEND_URL` is set (localhost for now)
- [ ] `PORT` is set (3000 for local)
- [ ] `NODE_ENV` is set (development for local)

---

## 🚨 Troubleshooting

### Error: "Firebase Admin initialization error"
- Check that `FIREBASE_PRIVATE_KEY` has quotes and `\n` characters
- Make sure `FIREBASE_CLIENT_EMAIL` is correct
- Verify `FIREBASE_PROJECT_ID` matches your Firebase project

### Error: "Gemini API key is not configured"
- Check that `GEMINI_API_KEY` is filled
- Make sure there are no extra spaces
- Verify the API key is valid at Google AI Studio

### Error: "CORS error"
- Update `FRONTEND_URL` to match your Flutter app URL
- For testing, you can temporarily use `*` (not recommended for production)

---

## 📚 Additional Resources

- [Google AI Studio](https://aistudio.google.com/app/apikey) - Get Gemini API Key
- [Firebase Console](https://console.firebase.google.com/) - Get Firebase credentials
- [Firebase Service Accounts Docs](https://firebase.google.com/docs/admin/setup)

---

## ✅ After Setup

Once your `.env` file is ready:

```bash
cd backend
npm install
npm run dev
```

Test the API:
```bash
curl http://localhost:3000/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Campus Connect API is running",
  "timestamp": "...",
  "version": "1.0.0"
}
```

