# 🔄 Reset USB Debugging - Complete Guide

## 🎯 Problem
Your Android device is not being detected by your laptop, or you want to reset the USB debugging connection.

## ✅ Solution: Complete Reset

### Step 1: Revoke USB Debugging Authorizations on Phone

1. **On your Android phone:**
   - Go to **Settings**
   - Scroll down to **Developer Options**
   - Look for **"Revoke USB debugging authorizations"** or **"Revoke USB debugging keys"**
   - Tap it
   - Confirm by tapping **"OK"** or **"Revoke"**

   **Note:** This will remove all previously authorized computers.

### Step 2: Disconnect Phone

- **Unplug the USB cable** from your phone

### Step 3: Reset ADB on Computer

**Open PowerShell/Command Prompt:**

```powershell
# Kill ADB server
adb kill-server

# Wait 2 seconds, then start again
adb start-server
```

### Step 4: Reconnect Phone

1. **Plug USB cable back** into your phone
2. **On your phone:**
   - Unlock your phone
   - You should see a popup: **"Allow USB debugging?"**
   - Check ✅ **"Always allow from this computer"**
   - Tap **"Allow"**

### Step 5: Verify Connection

```powershell
# Check if device is detected
adb devices
```

**Expected output:**
```
List of devices attached
ABC123XYZ    device
```

If you see `unauthorized`, repeat Step 4 (accept the popup on phone).

### Step 6: Check Flutter

```powershell
flutter devices
```

Should now show your Android device!

---

## 🔧 Alternative: Complete Reset (If Above Doesn't Work)

### Method 1: Reset Developer Options

**On your phone:**

1. **Settings** > **Developer Options**
2. **Turn OFF** "Developer Options"
3. **Turn ON** "Developer Options" again
4. **Enable** "USB Debugging"
5. **Enable** "Install via USB" (if available)
6. Unplug and replug USB cable
7. Accept "Allow USB debugging?" popup

### Method 2: Clear ADB Keys (Computer)

**Windows:**

1. **Close all terminals/command prompts**
2. **Delete ADB keys:**
   ```powershell
   # Navigate to user folder
   cd $env:USERPROFILE\.android
   
   # Delete adbkey files (if they exist)
   Remove-Item adbkey -ErrorAction SilentlyContinue
   Remove-Item adbkey.pub -ErrorAction SilentlyContinue
   ```

3. **Restart ADB:**
   ```powershell
   adb kill-server
   adb start-server
   ```

4. **Reconnect phone** and accept popup

### Method 3: Change USB Connection Mode

**On your phone:**

1. When connected, **pull down notification panel**
2. Tap **"USB"** or **"Charging this device"**
3. Select **"File Transfer"** or **"MTP"** (not "Charging only")
4. Try again:
   ```powershell
   adb devices
   ```

---

## 🐛 Troubleshooting

### Device Still Shows "unauthorized"

1. **On phone:**
   - Settings > Developer Options
   - Turn OFF "USB Debugging"
   - Turn ON "USB Debugging" again
   - Unplug and replug USB
   - Accept popup

### Device Shows "offline"

```powershell
adb kill-server
adb start-server
adb devices
```

### No Popup Appears on Phone

1. **Check USB Debugging is enabled:**
   - Settings > Developer Options > USB Debugging (ON)

2. **Try different USB cable**
3. **Try different USB port**
4. **Restart phone**

### ADB Command Not Found

**Install Android SDK Platform Tools:**

1. Download from: https://developer.android.com/studio/releases/platform-tools
2. Extract to a folder (e.g., `C:\platform-tools`)
3. Add to PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" variable
   - Add: `C:\platform-tools`
   - Restart terminal

**Or use Android Studio:**
- Android Studio includes ADB
- Usually at: `C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools`

---

## ✅ Complete Reset Checklist

- [ ] Revoked USB debugging authorizations on phone
- [ ] Disconnected USB cable
- [ ] Ran `adb kill-server` and `adb start-server`
- [ ] Reconnected USB cable
- [ ] Accepted "Allow USB debugging?" popup on phone
- [ ] Checked ✅ "Always allow from this computer"
- [ ] Verified: `adb devices` shows device
- [ ] Verified: `flutter devices` shows device

---

## 🚀 After Reset

Once `adb devices` shows your device:

```powershell
# Run Flutter app
flutter run
```

Select your Android device when prompted!

---

## 📝 Quick Commands Reference

```powershell
# Kill and restart ADB
adb kill-server
adb start-server

# Check devices
adb devices

# Check Flutter devices
flutter devices

# Run on specific device
flutter run -d <device-id>
```

---

## ⚠️ Important Notes

- **Always allow from this computer:** Check this box to avoid popups every time
- **USB Cable:** Use a data cable, not just charging cable
- **USB Port:** Try different ports if one doesn't work
- **Developer Options:** Must be enabled for USB debugging to work

---

**Follow these steps in order. Most issues are resolved by Step 4!** 🔄

