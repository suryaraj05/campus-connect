# 📝 Submit Grievance Screen - Complete Implementation

## ✅ Features Implemented

### 1. Form Fields
- ✅ **Title** - Required field with validation
- ✅ **Description** - Required field with multi-line input
- ✅ **Location** - Manual entry or GPS location
- ✅ **Contact Phone** - Optional field

### 2. Image Picker
- ✅ Multiple image selection (up to 5 images)
- ✅ Image preview with remove option
- ✅ Base64 encoding for API submission

### 3. Location Services
- ✅ GPS location button
- ✅ Location permission handling
- ✅ Manual location entry
- ✅ Current location indicator

### 4. Department Selection
- ✅ Dynamic departments from backend config
- ✅ Multi-select with filter chips
- ✅ Visual feedback for selected departments

### 5. Priority Selection
- ✅ Dynamic priorities from backend config
- ✅ Color-coded priority chips:
  - 🔴 **Urgent** - Red
  - 🟠 **High** - Orange
  - 🟡 **Medium** - Amber
  - 🟢 **Low** - Green

### 6. AI Analysis Integration
- ✅ AI analysis button in app bar
- ✅ Auto-fills title, description, departments, priority
- ✅ Confidence score display
- ✅ Works with images, text, or both

### 7. API Integration
- ✅ Complete submission to backend
- ✅ Error handling
- ✅ Success feedback
- ✅ Navigation after submission

## 🎯 How to Use

### Step 1: Fill Basic Information
1. Enter **Title** (required)
2. Enter **Description** (required)

### Step 2: Add Images (Optional)
1. Tap **"Add Images"** button
2. Select up to 5 images from gallery
3. Remove images by tapping the X button

### Step 3: Set Location
**Option A: Use GPS**
1. Tap **"GPS"** button
2. Grant location permission if prompted
3. Location will be auto-filled

**Option B: Manual Entry**
1. Type location in the text field
2. Can be address or coordinates

### Step 4: Select Departments
1. Tap on department chips to select
2. Can select multiple departments
3. At least one required

### Step 5: Select Priority
1. Tap on priority chip to select
2. Color indicates urgency level
3. One priority required

### Step 6: AI Analysis (Optional)
1. Tap **AI Analysis** icon (brain icon) in app bar
2. AI will analyze your input and images
3. Auto-fills suggestions for:
   - Title
   - Description
   - Departments
   - Priority

### Step 7: Submit
1. Tap **"Submit Grievance"** button
2. Wait for submission
3. Success message will appear
4. Automatically navigates back

## 🔧 Android Permissions

Make sure these permissions are in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.CAMERA"/>
```

For Android 13+:
```xml
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
```

## 🧪 Testing Checklist

### Basic Submission
- [ ] Fill title and description
- [ ] Select at least one department
- [ ] Select a priority
- [ ] Submit successfully
- [ ] Verify success message
- [ ] Check navigation back to home

### Image Upload
- [ ] Add 1-5 images
- [ ] Remove images
- [ ] Submit with images
- [ ] Verify images are sent to backend

### Location Services
- [ ] Test GPS location button
- [ ] Grant location permission
- [ ] Verify location is captured
- [ ] Test manual location entry
- [ ] Submit with location

### AI Analysis
- [ ] Test with text only
- [ ] Test with images only
- [ ] Test with both text and images
- [ ] Verify auto-fill suggestions
- [ ] Check confidence score

### Error Handling
- [ ] Submit without title (should show error)
- [ ] Submit without description (should show error)
- [ ] Submit without department (should show error)
- [ ] Submit without priority (should show error)
- [ ] Test with network error
- [ ] Test with invalid data

### Edge Cases
- [ ] Add 6 images (should limit to 5)
- [ ] Submit with empty location
- [ ] Submit with very long description
- [ ] Submit with special characters
- [ ] Test on different screen sizes

## 📋 API Endpoints Used

### 1. AI Analysis
```
POST /api/v1/ai/analyze
Body: {
  "title": "...",
  "description": "...",
  "images": ["base64..."]
}
```

### 2. Create Grievance
```
POST /api/v1/grievances
Body: {
  "title": "...",
  "description": "...",
  "departments": ["..."],
  "priority": "...",
  "location": "...",
  "images": ["base64..."],
  "contactPhone": "..."
}
```

## 🐛 Troubleshooting

### Images Not Picking
- Check storage permission
- Verify `image_picker` package is installed
- Check Android manifest permissions

### Location Not Working
- Check location permission
- Verify location services are enabled
- Check `geolocator` package is installed
- Verify Android manifest permissions

### AI Analysis Failing
- Check internet connection
- Verify backend is accessible
- Check API key in backend
- Review error message in snackbar

### Submission Failing
- Check authentication token
- Verify all required fields are filled
- Check network connection
- Review error message in snackbar
- Check backend logs

## ✅ Success Indicators

When everything works:
- ✅ Form validates correctly
- ✅ Images are selected and displayed
- ✅ Location is captured or entered
- ✅ Departments and priority are selected
- ✅ AI analysis provides suggestions
- ✅ Submission succeeds
- ✅ Success message appears
- ✅ Navigation works correctly

## 🎉 Ready for Testing!

The Submit Grievance screen is now fully functional and ready for end-to-end testing. All features are implemented and integrated with the backend API.

