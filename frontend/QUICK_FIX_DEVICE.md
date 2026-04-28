# ⚡ Quick Fix - Device Not Showing

## 🎯 Try These in Order (2 minutes)

### 1. Check ADB (30 sec)
```powershell
adb devices
```

**If shows device:** ✅ Done! Run `flutter devices` again.

**If shows "unauthorized":**
- Unlock phone
- Accept "Allow USB debugging?" popup
- Check ✅ "Always allow from this computer"

**If shows "offline" or nothing:**
- Continue to Step 2

### 2. Restart ADB (30 sec)
```powershell
adb kill-server
adb start-server
adb devices
```

**If shows device:** ✅ Done!

**If still nothing:**
- Continue to Step 3

### 3. Check USB Mode (30 sec)
**On phone:**
- Pull down notification panel
- Tap "USB" or "Charging"
- Select **"File Transfer"** or **"MTP"**

**Try again:**
```powershell
adb devices
```

### 4. Verify USB Debugging (30 sec)
**On phone:**
- Settings > Developer Options
- Make sure **USB Debugging** is ON
- Enable **Install via USB** (if available)

**Try again:**
```powershell
adb devices
flutter devices
```

---

## ✅ Success!

Once `adb devices` shows your device, `flutter devices` will also show it!

Then run:
```powershell
flutter run
```

---

## 🐛 Still Not Working?

1. Try different USB cable
2. Try different USB port
3. Restart phone
4. Install USB drivers (see `DEVICE_DETECTION_FIX.md`)

---

**Most issues fixed in Step 1 or 2!** 🚀

