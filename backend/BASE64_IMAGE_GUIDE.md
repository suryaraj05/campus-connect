# 📸 How to Convert Images to Base64 for API Testing

## 🎯 Quick Methods

### Method 1: Online Tool (Easiest)

1. Go to: https://www.base64-image.de/
2. Upload your image
3. Click "Convert"
4. Copy the base64 string
5. Use it in Postman

### Method 2: Using JavaScript (Browser Console)

1. Open browser console (F12)
2. Paste this code:

```javascript
// Function to convert image to base64
function imageToBase64(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
}

// For file input
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const file = e.target.files[0];
  const base64 = await imageToBase64(file);
  console.log(base64); // Copy this
};
input.click();
```

### Method 3: Using Node.js

```javascript
const fs = require('fs');
const path = require('path');

// Read image file
const imagePath = './test-image.jpg';
const imageBuffer = fs.readFileSync(imagePath);
const base64String = imageBuffer.toString('base64');

// With data URL prefix
const dataUrl = `data:image/jpeg;base64,${base64String}`;
console.log(dataUrl);
```

### Method 4: Using Python

```python
import base64

# Read image
with open('test-image.jpg', 'rb') as image_file:
    image_data = image_file.read()
    base64_string = base64.b64encode(image_data).decode('utf-8')
    
# With data URL prefix
data_url = f"data:image/jpeg;base64,{base64_string}"
print(data_url)
```

### Method 5: Using PowerShell (Windows)

```powershell
# Read image file
$imagePath = "C:\path\to\image.jpg"
$imageBytes = [System.IO.File]::ReadAllBytes($imagePath)
$base64String = [System.Convert]::ToBase64String($imageBytes)

# With data URL prefix
$dataUrl = "data:image/jpeg;base64,$base64String"
Write-Host $dataUrl
```

---

## 📝 Postman Request Format

### Without Images (Title & Description Only)

```json
{
  "title": "Broken water pipe near hostel",
  "description": "Water is leaking from a broken pipe near hostel block A",
  "images": []
}
```

### With One Image

```json
{
  "title": "Broken water pipe",
  "description": "Water leaking",
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
  ]
}
```

### With Multiple Images

```json
{
  "title": "Multiple issues",
  "description": "Several problems found",
  "images": [
    "data:image/jpeg;base64,...",
    "data:image/jpeg;base64,...",
    "data:image/jpeg;base64,..."
  ]
}
```

---

## 🔍 Base64 Format

### Full Format (with prefix):
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...
```

### Base64 Only (without prefix):
```
/9j/4AAQSkZJRgABAQEAYABgAAD...
```

**Note:** Our API accepts both formats. If you include the `data:image/jpeg;base64,` prefix, we'll automatically remove it.

---

## 🧪 Test Images

### Option 1: Use a Small Test Image
- Take a photo with your phone
- Convert to base64 using any method above
- Use in Postman

### Option 2: Generate Test Base64
Use this tiny 1x1 pixel image (for testing only):

```json
{
  "title": "Test grievance",
  "description": "Testing AI analysis",
  "images": [
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  ]
}
```

### Option 3: Download Test Image
1. Download any image from the internet
2. Convert to base64
3. Use in API

---

## ✅ Testing Steps

1. **Test without images first:**
   ```json
   {
     "title": "Broken pipe",
     "description": "Water leaking",
     "images": []
   }
   ```
   Should work! ✅

2. **Test with one image:**
   - Convert an image to base64
   - Add to `images` array
   - Send request

3. **Test with multiple images:**
   - Convert multiple images
   - Add all to `images` array
   - Send request

---

## 🐛 Common Issues

### Issue: "Invalid image format"
**Solution:** Make sure base64 string is valid. Use online tool to verify.

### Issue: "Image too large"
**Solution:** 
- Compress image before converting
- Use smaller images for testing
- API accepts up to 10MB total

### Issue: "Base64 string has spaces"
**Solution:** Remove all spaces and newlines from base64 string.

---

## 🎯 Quick Test in Postman

1. **Method:** `POST`
2. **URL:** `http://localhost:3000/api/ai/analyze`
3. **Body (raw JSON):**
   ```json
   {
     "title": "Test without image",
     "description": "This should work without images",
     "images": []
   }
   ```
4. **Send** - Should return AI analysis! ✅

Then try with an image:
```json
{
  "title": "Test with image",
  "description": "Testing with base64 image",
  "images": [
    "data:image/jpeg;base64,YOUR_BASE64_STRING_HERE"
  ]
}
```

---

## 📚 Resources

- Online Base64 Encoder: https://www.base64-image.de/
- Base64 Image Decoder: https://codebeautify.org/base64-to-image-converter
- Image Compressor: https://tinypng.com/ (compress before converting)

