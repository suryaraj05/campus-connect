# Testing Guide - Campus Connect

## How to Test Each Feature

### 1. Testing Department Registration

**Steps:**
1. **Delete existing user from Firebase** (if testing with same email):
   - Go to Firebase Console → Authentication → Users
   - Delete the test user
   - Go to Firestore → users collection
   - Delete the user document

2. **Register as Department:**
   - Open app → Register
   - Enter email, password, name, phone
   - **Select "Department" role**
   - **Select a department** (e.g., "Water Department")
   - Click Register

3. **Verify:**
   - After registration, check Profile screen
   - Should show "DEPARTMENT" badge (not "CITIZEN")
   - Should show department name
   - Logout and login again
   - Should still show "DEPARTMENT" role

**If still showing "CITIZEN":**
- Check backend logs for registration request
- Verify `role` and `department` are in the request
- Check Firestore users collection - verify `role` field is "department"

---

### 2. Testing Duplicate Prevention

**Steps:**
1. **Submit a grievance:**
   - Go to "Report an Issue"
   - Fill title: "Test Duplicate Issue"
   - Fill description, select departments, priority
   - Upload images
   - Submit

2. **Try to submit duplicate:**
   - Immediately try to submit the SAME grievance again
   - Same title, same description
   - Should be BLOCKED with error message

3. **Test AI duplicate detection:**
   - Submit grievance: "Broken water pipe in building A"
   - Try to submit: "Water pipe broken in building A" (similar)
   - Should show duplicate dialog with similarity score
   - If similarity >90%, should be blocked

**Expected Behavior:**
- Same title from same user within 5 minutes = BLOCKED
- High similarity (>90%) = BLOCKED
- Medium similarity (50-90%) = Show dialog, user can choose
- Low similarity (<50%) = Allowed

---

### 3. Testing Notifications

**Steps:**
1. **Check backend is running:**
   - Backend should be on `http://localhost:3000` or production URL
   - Check `/api/health` endpoint

2. **Open Notifications screen:**
   - Should load without 500 error
   - If error, check:
     - Backend logs for error details
     - Firebase Firestore has `notifications` collection
     - User has notifications with `userId` matching current user

3. **Create test notification:**
   - Submit a grievance
   - Should create notification automatically
   - Check notifications screen

**If 500 error persists:**
- Check backend console for error
- Verify Firebase credentials in `.env`
- Check Firestore indexes (may need to create index for `userId` + `createdAt`)

---

### 4. Testing Admin Users Screen Filters

**Steps:**
1. **Login as Admin:**
   - Must have `role: "admin"` in Firestore

2. **Go to Admin → Users:**
   - Should see "Filters" section at top
   - Should see 4 filter chips: "All", "Citizens", "Departments", "Admins"
   - Filters should be visible and clickable

3. **Test filters:**
   - Click "All" - shows all users
   - Click "Citizens" - shows only citizens
   - Click "Departments" - shows only departments
   - Click "Admins" - shows only admins

**If filters not visible:**
- Check if error state is showing (might hide filters)
- Check console for errors
- Verify users are loading correctly

---

## Debugging Tips

### Check Backend Logs
```bash
cd backend
npm start
# Watch for registration logs:
# 📝 [Auth] Registration request received
# ✅ [Auth] User created successfully
```

### Check Frontend Logs
- Open Flutter DevTools
- Check console for:
  - `✅ [Register] User role in response`
  - `✅ [Auth] User data fetched: role=...`

### Check Firestore
1. Go to Firebase Console
2. Firestore Database → users collection
3. Find your user document
4. Verify fields:
   - `role`: Should be "department" or "admin"
   - `department`: Should be set if role is "department"
   - `phoneNumber`: Should be set

### Force Refresh User Data
- Logout completely
- Clear app data (Settings → Apps → Campus Connect → Clear Data)
- Login again

---

## Common Issues & Solutions

### Issue: Role still showing as "citizen"
**Solution:**
1. Delete user from Firebase Auth and Firestore
2. Register fresh
3. Check backend logs to verify role is being saved
4. After registration, wait 2-3 seconds before checking profile

### Issue: Notifications 500 error
**Solution:**
1. Check backend is running
2. Check Firebase credentials in `.env`
3. Create Firestore index:
   - Collection: `notifications`
   - Fields: `userId` (Ascending), `createdAt` (Descending)

### Issue: Duplicates still submitting
**Solution:**
1. Check backend logs for duplicate check
2. Verify title is exactly the same
3. Check if within 5-minute window
4. Check AI duplicate detection is working (Gemini API key set)

### Issue: Filters not showing
**Solution:**
1. Check if users are loading (might be in error state)
2. Scroll up - filters are at the top
3. Check console for errors
4. Verify screen is not in loading state

---

## Quick Test Checklist

- [ ] Register as department → Check profile shows "DEPARTMENT"
- [ ] Logout → Login → Check role persists
- [ ] Submit grievance → Try duplicate → Should be blocked
- [ ] Open notifications → Should load without error
- [ ] Admin → Users → Filters should be visible and working
- [ ] Test TSP optimization → Should show routes on map

