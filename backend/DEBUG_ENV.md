# 🔍 Debug Environment Variables

## Problem: API Key Not Loading

If you see: `"Gemini API key is not configured"` even though it's in `.env`

## ✅ Quick Fixes

### 1. Check File Location
`.env` file MUST be here:
```
campus-connect/
└── backend/
    ├── .env          ← HERE! (same folder as package.json)
    ├── package.json
    └── api/
```

### 2. Check File Format
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

**Important:**
- ❌ No quotes: `GEMINI_API_KEY="AIzaSy..."`
- ❌ No spaces: `GEMINI_API_KEY = AIzaSy...`
- ✅ Correct: `GEMINI_API_KEY=AIzaSy...`

### 3. Check for Hidden Characters
- No BOM (Byte Order Mark)
- No trailing spaces
- No invisible characters

### 4. Restart Server
After changing `.env`:
```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

### 5. Check Terminal Output
When server starts, you should see:
```
🔍 Environment check:
  GEMINI_API_KEY: ✅ Set
```

If you see `❌ Missing`, the file isn't loading.

## 🧪 Test Environment Loading

Add this to your `.env` file temporarily:
```env
TEST_VAR=hello_world
```

Then check terminal - it should show in the environment check.

## 🐛 Common Issues

### Issue 1: File Not Found
**Symptom:** No environment variables load
**Solution:** 
- Check file is named exactly `.env` (not `.env.txt`)
- Check file is in `backend/` folder
- Check file permissions

### Issue 2: Wrong Path
**Symptom:** Variables load in one file but not another
**Solution:**
- Make sure `dotenv.config()` runs before importing routes
- Check path in `index.js` is correct

### Issue 3: Quotes in Value
**Symptom:** Key exists but value is wrong
**Solution:**
- Remove quotes from values
- `GEMINI_API_KEY=value` not `GEMINI_API_KEY="value"`

### Issue 4: Cached Values
**Symptom:** Old values still used
**Solution:**
- Completely stop server (Ctrl+C)
- Wait 2 seconds
- Restart server
- Clear Node cache if needed: `node --clear-cache`

## ✅ Verification Steps

1. **Check file exists:**
   ```bash
   cd campus-connect/backend
   ls -la .env  # or dir .env on Windows
   ```

2. **Check file content:**
   ```bash
   cat .env  # or type .env on Windows
   ```

3. **Check server output:**
   Look for environment check messages when server starts

4. **Test API:**
   ```bash
   curl http://localhost:3000/api/health
   ```

## 🔧 Manual Test

Create a test file `test-env.js`:
```javascript
import dotenv from 'dotenv';
dotenv.config();

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Missing');
console.log('Length:', process.env.GEMINI_API_KEY?.length || 0);
```

Run:
```bash
node test-env.js
```

Should show: `✅ Found`

