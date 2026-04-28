# 🔧 Fix Postman Variable Issue

## Problem
Postman shows: `Error: getaddrinfo ENOTFOUND {{base_url}}`

This means Postman is not resolving the `{{base_url}}` variable.

## ✅ Solution 1: Use Direct URL (Quick Fix)

Instead of `{{base_url}}/api/health`, use:
```
http://localhost:3000/api/health
```

## ✅ Solution 2: Set Up Environment Variable (Recommended)

### Step 1: Create Environment
1. In Postman, click **"Environments"** in left sidebar
2. Click **"+"** or **"Create Environment"**
3. Name it: **"Local Development"**

### Step 2: Add Variables
Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `id_token` | (empty) | (empty) |

### Step 3: Select Environment
1. In top right, click **"No environment"** dropdown
2. Select **"Local Development"**
3. Now `{{base_url}}` will work!

## ✅ Solution 3: Use Collection Variables

1. Right-click **"Campus Connect"** collection
2. Click **"Edit"**
3. Go to **"Variables"** tab
4. Make sure `base_url` is set to `http://localhost:3000`
5. Save

## 🧪 Test

After setting up, try:
- **Method:** `GET`
- **URL:** `{{base_url}}/api/health`
- **Or:** `http://localhost:3000/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "Campus Connect API is running",
  "timestamp": "...",
  "version": "1.0.0"
}
```

## ⚠️ Common Issues

1. **Variable not resolving:**
   - Make sure environment is selected (top right)
   - Check variable name matches exactly: `base_url`
   - No spaces in variable name

2. **Server not running:**
   - Make sure backend is running: `npm run dev`
   - Check terminal for errors

3. **Connection refused:**
   - Server might be on different port
   - Check `PORT` in `.env` file
   - Try: `http://localhost:3000` directly

