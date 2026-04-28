# Campus Connect Backend API

Node.js + Express backend for Campus Connect, deployed on Vercel.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:
- `GEMINI_API_KEY` - Google Gemini API key for AI analysis
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_PRIVATE_KEY` - Firebase Admin SDK private key
- `FIREBASE_CLIENT_EMAIL` - Firebase Admin SDK client email
- `FRONTEND_URL` - Your Flutter app URL (for CORS)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

### 3. Get Firebase Admin SDK Credentials

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Extract:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### 4. Run Locally

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Add environment variables in Vercel dashboard:
- Go to Project Settings > Environment Variables
- Add all variables from `.env`

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Check API status

### AI Analysis
- `POST /api/ai/analyze` - Analyze images and get suggestions
  - Body: `{ title?: string, description?: string, images: string[] }`
  - Returns: AI analysis with suggested title, description, departments, priority, location

### Grievances
- `POST /api/grievances` - Create new grievance (Auth required)
- `GET /api/grievances` - List grievances with filters (Auth required)
- `GET /api/grievances/:id` - Get single grievance (Auth required)
- `PUT /api/grievances/:id` - Update grievance (Auth required)
- `PATCH /api/grievances/:id/status` - Update status/priority (Department/Admin only)
- `DELETE /api/grievances/:id` - Delete grievance (Auth required)
- `GET /api/grievances/:id/comments` - Get comments (Auth required)
- `POST /api/grievances/:id/comments` - Add comment (Auth required)

### Authentication
- `POST /api/auth/register` - Register user (creates Firestore document)
- `POST /api/auth/login` - Login (verify token)
- `GET /api/auth/me` - Get current user (Auth required)
- `PUT /api/auth/me` - Update profile (Auth required)

### Users
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Auth required)

### Notifications
- `GET /api/notifications` - Get user notifications (Auth required)
- `PUT /api/notifications/:id/read` - Mark as read (Auth required)
- `DELETE /api/notifications/:id` - Delete notification (Auth required)

### Location
- `POST /api/location/geocode` - Geocode address (Auth required)
- `GET /api/location/markers` - Get map markers (Auth required)
- `POST /api/location/route` - Get route (Auth required)

## 🔐 Authentication

All protected endpoints require Firebase ID token in Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

## 📋 Departments

- Municipal Cleanliness
- Electrical Department
- Water Department
- Roads & Infrastructure
- Health & Sanitation

## 🎯 Priority Levels

- `low` - Minor issues
- `medium` - Standard issues
- `high` - Significant issues
- `urgent` - Life-threatening situations

## 📊 Status Levels

- `submitted` - Newly submitted
- `assigned` - Assigned to department
- `in_progress` - Being worked on
- `resolved` - Issue resolved
- `closed` - Closed
- `rejected` - Rejected

## 🧪 Testing

Test endpoints using:
- Postman
- Thunder Client (VS Code extension)
- curl
- Your Flutter app

Example request:
```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "images": ["base64_image_string"],
    "title": "Test",
    "description": "Test description"
  }'
```

## 📝 Notes

- Images should be base64 encoded strings
- All timestamps are handled by Firestore serverTimestamp()
- CORS is configured for your Flutter app URL
- Error handling is centralized in middleware

## 🐛 Troubleshooting

1. **Firebase Admin Error**: Check your private key format (should include \n)
2. **CORS Error**: Update `FRONTEND_URL` in `.env`
3. **Gemini API Error**: Verify `GEMINI_API_KEY` is correct
4. **Port Already in Use**: Change `PORT` in `.env`

