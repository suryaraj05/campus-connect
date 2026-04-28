# ✅ Testing Checklist

Quick checklist to verify all endpoints work correctly.

## 🟢 Basic Tests (No Auth Required)

- [ ] `GET /api/health` - Returns 200 OK
- [ ] `POST /api/ai/analyze` - Returns AI suggestions

## 🔵 Authentication Tests

- [ ] `POST /api/auth/register` - Creates user (needs Firebase token)
- [ ] `POST /api/auth/login` - Returns user data (needs Firebase token)
- [ ] `GET /api/auth/me` - Returns current user (needs token in header)

## 🟡 Grievance Tests (Auth Required)

- [ ] `POST /api/grievances` - Creates grievance
- [ ] `GET /api/grievances` - Lists grievances
- [ ] `GET /api/grievances/:id` - Gets single grievance
- [ ] `PUT /api/grievances/:id` - Updates grievance
- [ ] `PATCH /api/grievances/:id/status` - Updates status
- [ ] `DELETE /api/grievances/:id` - Deletes grievance

## 🟣 Comment Tests

- [ ] `GET /api/grievances/:id/comments` - Gets comments
- [ ] `POST /api/grievances/:id/comments` - Adds comment

## 🟠 Notification Tests

- [ ] `GET /api/notifications` - Gets notifications
- [ ] `PUT /api/notifications/:id/read` - Marks as read
- [ ] `DELETE /api/notifications/:id` - Deletes notification

## 🔴 Location Tests

- [ ] `GET /api/location/markers` - Gets map markers
- [ ] `POST /api/location/geocode` - Geocodes address (placeholder)
- [ ] `POST /api/location/route` - Gets route (placeholder)

---

## 🐛 Common Errors to Check

- [ ] Firebase initialization errors (check .env file)
- [ ] CORS errors (check FRONTEND_URL)
- [ ] 401 Unauthorized (check token)
- [ ] 404 Not Found (check URL)
- [ ] 500 Internal Server Error (check server logs)

---

## 📊 Test Results

Date: ___________
Tester: ___________

| Endpoint | Status | Notes |
|----------|--------|-------|
| Health Check | ⬜ | |
| AI Analysis | ⬜ | |
| Register | ⬜ | |
| Login | ⬜ | |
| Create Grievance | ⬜ | |
| Get Grievances | ⬜ | |
| Update Status | ⬜ | |
| Add Comment | ⬜ | |
| Get Notifications | ⬜ | |

---

## ✅ Ready for Flutter Integration

Once all tests pass:
- [ ] All endpoints return expected responses
- [ ] Error handling works correctly
- [ ] Authentication flow works
- [ ] Backend deployed to Vercel
- [ ] API URL documented for Flutter team

