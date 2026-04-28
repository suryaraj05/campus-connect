# ⚠️ Web Compatibility Issue

## Problem

Firebase packages have compatibility issues with Flutter web. The errors you're seeing (`PromiseJsImpl not found`, `handleThenable not found`) are due to Firebase web SDK version mismatches.

## ✅ Solution: Run on Android Device Instead

**Don't run on Chrome/Web** - Firebase web has compatibility issues. Use your **Android device** instead.

### Steps:

1. **Make sure your Android device is connected:**
   ```powershell
   adb devices
   ```
   Should show your device.

2. **Check Flutter devices:**
   ```powershell
   flutter devices
   ```
   Should show your Android device.

3. **Run on Android device:**
   ```powershell
   flutter run -d <device-id>
   ```
   Or just:
   ```powershell
   flutter run
   ```
   Then select your Android device (not Chrome/Edge).

## 🔧 If You Must Use Web

If you really need web support, you'll need to:

1. **Update Firebase packages** to compatible versions
2. **Add web-specific dependencies**
3. **Configure Firebase for web**

But for now, **use Android device** - it's easier and works perfectly!

---

## ✅ Fixed Issues

I've fixed:
- ✅ `CardTheme` → `CardThemeData` (Flutter compatibility)
- ✅ `ApiConfig.config` → `/api/config` (correct endpoint)

Now try running on your **Android device** instead of Chrome! 📱

