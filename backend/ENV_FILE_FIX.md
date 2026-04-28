# 🔧 Fix .env File Loading Issue

## Problem
Server shows warnings even though `.env` file exists:
- ⚠️ Firebase credentials not found
- ⚠️ GEMINI_API_KEY not found

## ✅ Solution

### 1. Check File Location
`.env` file MUST be in `backend/` folder:
```
campus-connect/
└── backend/
    ├── .env          ← HERE!
    ├── package.json
    └── api/
```

### 2. Check File Format
Your `.env` file should look like this (remove quotes from FIREBASE_CLIENT_EMAIL):

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
FIREBASE_PROJECT_ID=chhif-database
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FIREBASE_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@chhif-database.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
```

**Important Changes:**
- ❌ Remove quotes from `FIREBASE_CLIENT_EMAIL`
- ✅ Keep quotes on `FIREBASE_PRIVATE_KEY` (it's correct)
- ✅ No spaces around `=`
- ✅ No trailing spaces

### 3. Restart Server
After fixing `.env` file:
```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

You should now see:
```
✅ GEMINI_API_KEY: ✅ Set
✅ FIREBASE_PROJECT_ID: chhif-database
✅ FIREBASE_CLIENT_EMAIL: ✅ Set
✅ FIREBASE_PRIVATE_KEY: ✅ Set
✅ Firebase Admin initialized successfully
```

### 4. Verify
Check terminal output when server starts. It should show:
- ✅ Environment check with all variables set
- ✅ Firebase Admin initialized successfully
- ✅ Server running message

## 🐛 Still Not Working?

### Check 1: File Encoding
Make sure `.env` file is saved as UTF-8 (not UTF-16 or other)

### Check 2: Hidden Characters
- No BOM (Byte Order Mark)
- No invisible characters
- Use a plain text editor (VS Code, Notepad++)

### Check 3: File Name
- Must be exactly `.env` (not `.env.txt` or `env`)
- Check if file is hidden (Windows: View > Show hidden files)

### Check 4: Restart
- Close terminal completely
- Reopen terminal
- Navigate to `backend/` folder
- Run `npm run dev` again

## ✅ Expected Output

When working correctly:
```
🔍 Environment check:
  GEMINI_API_KEY: ✅ Set
  FIREBASE_PROJECT_ID: chhif-database
  FIREBASE_CLIENT_EMAIL: ✅ Set
  FIREBASE_PRIVATE_KEY: ✅ Set
✅ Firebase Admin initialized successfully
🚀 Campus Connect API running on http://localhost:3000
📡 Health check: http://localhost:3000/api/health
```

