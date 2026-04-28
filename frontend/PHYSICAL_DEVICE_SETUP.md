# 📱 Using Physical Android Device

## 🎯 Quick Setup

### Step 1: Enable USB Debugging on Your Phone

1. **Enable Developer Options:**
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - You'll see "You are now a developer!"

2. **Enable USB Debugging:**
   - Go to Settings > Developer Options
   - Turn on "USB Debugging"
   - Turn on "Install via USB" (if available)

### Step 2: Connect Your Phone

1. **Connect phone to computer via USB**
2. **On your phone:** Tap "Allow USB debugging" when prompted
3. **Check connection:**
   ```bash
   flutter devices
   ```
   You should see your device listed!

### Step 3: Run App on Your Phone

```bash
cd campus-connect/frontend
flutter run
```

Flutter will automatically detect and use your physical device!

---

## 🔧 Troubleshooting

### Device Not Detected

1. **Check USB connection:**
   - Try different USB cable
   - Try different USB port
   - Make sure USB debugging is enabled

2. **Install ADB drivers (Windows):**
   - Download from: https://developer.android.com/studio/run/oem-usb
   - Or use Android Studio to install drivers

3. **Check ADB:**
   ```bash
   adb devices
   ```
   Should show your device

### "Unauthorized" Device

- On your phone, tap "Allow USB debugging"
- Check "Always allow from this computer"
- Try again

### "Offline" Device

```bash
adb kill-server
adb start-server
adb devices
```

---

## 🌐 Network Setup (For API Connection)

Since you're using a physical device, you need to use your **computer's IP address** instead of `localhost`.

### Step 1: Find Your Computer's IP

**Windows:**
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```

### Step 2: Update API URL

Edit `lib/config/api_config.dart`:

```dart
// Change from:
static const String baseUrl = 'http://localhost:3000';

// To (use your computer's IP):
static const String baseUrl = 'http://192.168.1.XXX:3000';
```

**Important:**
- Phone and computer must be on **same WiFi network**
- Backend must be running on your computer
- Use your computer's IP, not `localhost`

### Step 3: Test Connection

1. Make sure backend is running: `npm run dev` in backend folder
2. On your phone, open browser and go to: `http://YOUR_IP:3000/api/health`
3. Should return: `{"status":"ok",...}`

If this works, your Flutter app will also work!

---

## ✅ Complete Setup Checklist

- [ ] USB Debugging enabled on phone
- [ ] Phone connected via USB
- [ ] `flutter devices` shows your device
- [ ] Backend is running (`npm run dev`)
- [ ] Found computer's IP address
- [ ] Updated `api_config.dart` with IP address
- [ ] Phone and computer on same WiFi
- [ ] Tested API connection from phone browser
- [ ] Run `flutter run`

---

## 🚀 Quick Commands

```bash
# Check devices
flutter devices

# Run on connected device
flutter run

# Run on specific device
flutter run -d <device-id>

# Check ADB
adb devices

# Restart ADB
adb kill-server && adb start-server
```

---

## 📝 Notes

- **USB Debugging:** Required for development
- **Same Network:** Phone and computer must be on same WiFi
- **IP Address:** Use computer's IP, not localhost
- **Backend:** Must be running and accessible from network

---

## ✅ After Setup

Once everything is connected:
1. Your phone will appear in `flutter devices`
2. Run `flutter run` - app will install and launch on your phone
3. Test all features on real device!

**You're ready to test on your physical device!** 📱

