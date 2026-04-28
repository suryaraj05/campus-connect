# ⚡ Quick Test Guide

## 🧪 Test AI Analysis (No Images Required!)

### Step 1: Test Without Images

**Request:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/ai/analyze`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Broken water pipe near hostel block A",
  "description": "Water is leaking from a broken pipe. It's creating a puddle and might cause damage.",
  "images": []
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "isProblemRelated": true,
    "suggestedTitle": "Broken Water Pipe Near Hostel Block A",
    "suggestedDescription": "...",
    "suggestedDepartments": ["Water Department"],
    "suggestedPriority": "high",
    "suggestedLocation": "Hostel Block A",
    "confidence": 0.9,
    "reasoning": "..."
  }
}
```

✅ **This should work immediately!** No images needed.

---

## 🔧 Fix Firebase Issue

The error "Firebase Auth is not initialized" means Firebase credentials aren't loading.

### Quick Fix:

1. **Check .env file location:**
   - Must be in: `campus-connect/backend/.env`
   - NOT in: `campus-connect/.env`

2. **Remove quotes from FIREBASE_CLIENT_EMAIL:**
   ```env
   # ❌ Wrong
   FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@chhif-database.iam.gserviceaccount.com"
   
   # ✅ Correct
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@chhif-database.iam.gserviceaccount.com
   ```

3. **Restart server:**
   ```bash
   # Stop (Ctrl+C)
   cd campus-connect/backend
   npm run dev
   ```

4. **Check terminal output:**
   Should see:
   ```
   🔍 Environment check:
     GEMINI_API_KEY: ✅ Set
     FIREBASE_PROJECT_ID: chhif-database
     FIREBASE_CLIENT_EMAIL: ✅ Set
     FIREBASE_PRIVATE_KEY: ✅ Set
   ✅ Firebase Admin initialized successfully
   ```

---

## 📸 Test With Images (Optional)

### Step 1: Get Base64 Image

**Easy Method:**
1. Go to: https://www.base64-image.de/
2. Upload any image
3. Copy the base64 string
4. Use in Postman

### Step 2: Test in Postman

```json
{
  "title": "Broken pipe",
  "description": "Water leaking",
  "images": [
    "data:image/jpeg;base64,YOUR_BASE64_STRING_HERE"
  ]
}
```

---

## ✅ Test Checklist

- [ ] Health check works: `GET http://localhost:3000/api/health`
- [ ] AI analysis works without images
- [ ] AI analysis works with images (optional)
- [ ] Firebase initialized (check terminal)
- [ ] No errors in terminal

---

## 🐛 Still Having Issues?

### Firebase Not Initializing:
1. Check `.env` file is in `backend/` folder
2. Remove quotes from `FIREBASE_CLIENT_EMAIL`
3. Restart server
4. Check terminal for error messages

### AI Analysis Not Working:
1. Check `GEMINI_API_KEY` is set in `.env`
2. Check terminal shows "✅ Set" for GEMINI_API_KEY
3. Try without images first
4. Check internet connection (needs to call Gemini API)

### Postman Not Working:
1. Use direct URL: `http://localhost:3000/api/ai/analyze`
2. Make sure server is running
3. Check `Content-Type: application/json` header

