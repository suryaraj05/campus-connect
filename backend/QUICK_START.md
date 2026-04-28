# ⚡ Quick Start - .env File Setup

## 🎯 What You Need to Fill

### ✅ Easy Ones (You Already Have)

1. **FIREBASE_PROJECT_ID**
   ```
   chhif-database
   ```
   *(You already have this from your village-connect project)*

---

### 🔑 Need to Get These

#### 1. **GEMINI_API_KEY**

**Steps:**
1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

**Fill in:**
```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

#### 2. **FIREBASE_PRIVATE_KEY** & **FIREBASE_CLIENT_EMAIL**

**Steps:**
1. Go to: https://console.firebase.google.com/
2. Select project: **chhif-database**
3. Click ⚙️ **Project Settings**
4. Go to **Service Accounts** tab
5. Click **"Generate New Private Key"**
6. A JSON file downloads - **open it**

**From the JSON file, copy:**

**a) `private_key`** → Goes to `FIREBASE_PRIVATE_KEY`
- Copy the ENTIRE value (starts with `-----BEGIN PRIVATE KEY-----`)
- Keep it in quotes
- Keep all `\n` characters

**Example:**
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FIREBASE_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
```

**b) `client_email`** → Goes to `FIREBASE_CLIENT_EMAIL`
- Copy the email address

**Example:**
```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@chhif-database.iam.gserviceaccount.com
```

---

### ✅ Keep These As-Is (For Now)

```env
FRONTEND_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
```

---

## 📝 Complete Example

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
FIREBASE_PROJECT_ID=chhif-database
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FIREBASE_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@chhif-database.iam.gserviceaccount.com
FRONTEND_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
```

---

## ⚠️ Common Mistakes to Avoid

1. **FIREBASE_PRIVATE_KEY:**
   - ❌ Don't remove `\n` characters
   - ❌ Don't remove quotes
   - ✅ Keep it exactly as in JSON file

2. **Missing Values:**
   - Make sure all fields are filled
   - No empty values

3. **Spaces:**
   - No spaces around `=` sign
   - No extra spaces in values

---

## ✅ Test After Setup

```bash
cd backend
npm install
npm run dev
```

Then test:
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"ok","message":"Campus Connect API is running"}
```

---

## 📚 Need More Help?

See `ENV_SETUP_GUIDE.md` for detailed instructions.

