# 🧪 Postman Testing Guide for Campus Connect API

Complete guide to test all API endpoints using Postman.

## 📋 Prerequisites

1. **Postman installed** - Download from [postman.com](https://www.postman.com/downloads/)
2. **Backend running** - `npm run dev` in backend folder
3. **Firebase credentials** - For endpoints that need authentication

---

## 🚀 Quick Setup

### 1. Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Create a new collection: **"Campus Connect API"**
4. Add the requests below

### 2. Set Environment Variables

Create a Postman Environment with these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `id_token` | (empty) | (will be set after login) |

---

## 📡 API Endpoints to Test

### 1. Health Check ✅

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/health`
- **Headers:** None

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Campus Connect API is running",
  "timestamp": "2024-12-24T...",
  "version": "1.0.0"
}
```

**✅ Test:** Should return 200 OK

---

### 2. AI Analysis (No Auth Required) 🤖

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/ai/analyze`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "Broken water pipe near hostel",
    "description": "Water is leaking from a broken pipe",
    "images": [
      "base64_encoded_image_string_here"
    ]
  }
  ```

**Note:** For testing, you can use a small base64 image or leave images empty array for now.

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "isProblemRelated": true,
    "suggestedTitle": "Broken Water Pipe Near Hostel",
    "suggestedDescription": "...",
    "suggestedDepartments": ["Water Department"],
    "suggestedPriority": "high",
    "suggestedLocation": "Near hostel area",
    "confidence": 0.95,
    "reasoning": "..."
  },
  "processingTime": 2345
}
```

**✅ Test:** Should return 200 OK with AI suggestions

---

### 3. Register User 👤

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "idToken": "firebase_id_token_here",
    "displayName": "Test User",
    "role": "citizen",
    "phoneNumber": "1234567890"
  }
  ```

**Note:** You need a Firebase ID token. For testing:
1. Use Firebase Console to create a test user
2. Or use Firebase Auth SDK to get a token
3. Or skip this for now and test other endpoints

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "uid": "...",
    "email": "...",
    "displayName": "Test User",
    "role": "citizen"
  }
}
```

---

### 4. Login 👤

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/auth/login`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "idToken": "firebase_id_token_here"
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "uid": "...",
    "email": "...",
    "displayName": "...",
    "role": "citizen"
  }
}
```

**💡 Tip:** Save the `idToken` to Postman environment variable `id_token` for other requests.

---

### 5. Get Current User 👤

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/auth/me`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "uid": "...",
    "email": "...",
    "displayName": "...",
    "role": "citizen"
  }
}
```

---

### 6. Create Grievance 📝

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/grievances`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "title": "Broken water pipe",
    "description": "Water leaking from pipe near hostel block A",
    "departments": ["Water Department"],
    "priority": "high",
    "location": "Hostel Block A, Floor 2",
    "images": [],
    "contactPhone": "1234567890"
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "grievance_id_here",
    "title": "Broken water pipe",
    "description": "...",
    "departments": ["Water Department"],
    "status": "submitted",
    "priority": "high",
    "location": "Hostel Block A, Floor 2",
    "imageUrls": [],
    "submittedBy": "user_id",
    "submittedByName": "Test User",
    "contactPhone": "1234567890",
    "contactEmail": "test@example.com",
    "assignedTo": []
  }
}
```

---

### 7. Get All Grievances 📋

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/grievances`
- **Query Params (optional):**
  - `department`: `Water Department`
  - `status`: `submitted`
  - `priority`: `high`
  - `limit`: `50`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "grievanceId": "...",
      "title": "...",
      "description": "...",
      "departments": ["Water Department"],
      "status": "submitted",
      "priority": "high",
      ...
    }
  ],
  "count": 1
}
```

---

### 8. Get Single Grievance 📄

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/grievances/:id`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  ```

**Replace `:id` with actual grievance ID from previous request.**

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "grievanceId": "...",
    "title": "...",
    "description": "...",
    ...
  }
}
```

---

### 9. Update Grievance Status (Department/Admin Only) 🔄

**Request:**
- **Method:** `PATCH`
- **URL:** `{{base_url}}/api/grievances/:id/status`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "status": "in_progress",
    "priority": "high"
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "grievanceId": "...",
    "status": "in_progress",
    "priority": "high",
    ...
  }
}
```

---

### 10. Add Comment 💬

**Request:**
- **Method:** `POST`
- **URL:** `{{base_url}}/api/grievances/:id/comments`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "comment": "We are working on this issue. Expected resolution in 2 days."
  }
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "commentId": "...",
    "grievanceId": "...",
    "userId": "...",
    "userName": "...",
    "comment": "We are working on this issue...",
    "isStatusUpdate": false,
    "createdAt": "..."
  }
}
```

---

### 11. Get Comments 💬

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/grievances/:id/comments`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "commentId": "...",
      "comment": "...",
      "userName": "...",
      "createdAt": "..."
    }
  ]
}
```

---

### 12. Get Notifications 🔔

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/notifications`
- **Query Params (optional):**
  - `limit`: `50`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Grievance Submitted",
      "message": "...",
      "type": "success",
      "read": false,
      "createdAt": "..."
    }
  ],
  "count": 1
}
```

---

### 13. Mark Notification as Read ✅

**Request:**
- **Method:** `PUT`
- **URL:** `{{base_url}}/api/notifications/:id/read`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  ```

**Expected Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### 14. Get Map Markers 🗺️

**Request:**
- **Method:** `GET`
- **URL:** `{{base_url}}/api/location/markers`
- **Query Params (optional):**
  - `status`: `submitted`
  - `department`: `Water Department`
- **Headers:**
  ```
  Authorization: Bearer {{id_token}}
  ```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "...",
      "location": "...",
      "priority": "high",
      "status": "submitted",
      "departments": ["Water Department"]
    }
  ],
  "count": 1
}
```

---

## 🧪 Testing Workflow

### Step 1: Test Health Check
1. Test `GET /api/health` - Should work without auth

### Step 2: Test AI Analysis
1. Test `POST /api/ai/analyze` - Should work without auth
2. Try with different images/descriptions

### Step 3: Test Authentication (Optional)
1. Get Firebase ID token (from Firebase Console or SDK)
2. Test `POST /api/auth/register`
3. Test `POST /api/auth/login`
4. Save token to `{{id_token}}` variable

### Step 4: Test Grievance Operations
1. Create grievance: `POST /api/grievances`
2. Get all: `GET /api/grievances`
3. Get single: `GET /api/grievances/:id`
4. Add comment: `POST /api/grievances/:id/comments`
5. Get comments: `GET /api/grievances/:id/comments`

### Step 5: Test Notifications
1. Get notifications: `GET /api/notifications`
2. Mark as read: `PUT /api/notifications/:id/read`

---

## ⚠️ Common Issues

### 1. "Firebase is not initialized"
- **Solution:** Check your `.env` file has correct Firebase credentials
- Server will still start, but Firebase endpoints won't work

### 2. "Invalid or expired token"
- **Solution:** Get a fresh Firebase ID token
- Tokens expire after 1 hour

### 3. "CORS error"
- **Solution:** Update `FRONTEND_URL` in `.env` file
- For testing, you can use `*` temporarily

### 4. "401 Unauthorized"
- **Solution:** Make sure `Authorization: Bearer {{id_token}}` header is set
- Token must be valid Firebase ID token

---

## 📝 Postman Collection JSON

Save this as `Campus_Connect_API.postman_collection.json`:

```json
{
  "info": {
    "name": "Campus Connect API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/health",
          "host": ["{{base_url}}"],
          "path": ["api", "health"]
        }
      }
    },
    {
      "name": "AI Analysis",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"\",\n  \"description\": \"\",\n  \"images\": []\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/ai/analyze",
          "host": ["{{base_url}}"],
          "path": ["api", "ai", "analyze"]
        }
      }
    }
  ]
}
```

---

## ✅ Success Criteria

After testing, you should be able to:
- ✅ Health check returns 200 OK
- ✅ AI analysis returns suggestions
- ✅ Create grievances (with auth)
- ✅ Get grievances list
- ✅ Update grievance status
- ✅ Add/get comments
- ✅ Get notifications

---

## 🎯 Next Steps

Once all endpoints are tested:
1. Deploy to Vercel
2. Update `base_url` in Postman to Vercel URL
3. Start building Flutter app
4. Integrate Flutter with these APIs

