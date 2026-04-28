# 🔧 Fix All Gradle Issues

## 🎯 Problems Found

1. **Memory Error:** Still trying to use 8GB (gradle.properties change not taking effect)
2. **Symlink Issue:** Developer Mode not enabled (needed for Flutter plugins)
3. **Gradle Daemon Crash:** Due to memory issues

## ✅ Solution 1: Enable Developer Mode (Symlink Support)

### Step 1: Open Developer Settings

```powershell
start ms-settings:developers
```

Or manually:
1. Press `Win + I` (Settings)
2. Go to **Privacy & Security** > **For developers**
3. Turn ON **Developer Mode**

### Step 2: Restart Computer

After enabling Developer Mode, **restart your computer**.

---

## ✅ Solution 2: Fix Gradle Memory (Global Config)

The issue is that there's a **global Gradle config** overriding your project settings.

### Step 1: Find Global Gradle Config

**Location:** `C:\Users\ssury\.gradle\gradle.properties`

### Step 2: Edit Global Config

Open `C:\Users\ssury\.gradle\gradle.properties` (create if doesn't exist):

```properties
# Reduce memory usage globally
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -XX:ReservedCodeCacheSize=256m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# Performance
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true
```

**Save the file.**

### Step 3: Stop All Gradle Daemons

```powershell
cd campus-connect/frontend/android
gradlew --stop
```

Or:
```powershell
# Kill all Java processes related to Gradle
taskkill /F /IM java.exe
```

---

## ✅ Solution 3: Verify Project Config

Make sure `android/gradle.properties` has:

```properties
# Reduced memory settings
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -XX:ReservedCodeCacheSize=256m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# Performance optimizations
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true

# Android settings
android.useAndroidX=true
android.enableJetifier=true
```

---

## 🚀 Complete Fix Steps

### Step 1: Enable Developer Mode

```powershell
start ms-settings:developers
```

Turn ON **Developer Mode**, then **restart computer**.

### Step 2: Fix Global Gradle Config

1. Open: `C:\Users\ssury\.gradle\gradle.properties`
2. Add/update:
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -XX:ReservedCodeCacheSize=256m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true
```

### Step 3: Stop Gradle Daemons

```powershell
cd campus-connect/frontend/android
.\gradlew --stop
```

### Step 4: Clean and Rebuild

```powershell
cd campus-connect/frontend

# Clean
flutter clean

# Get dependencies
flutter pub get

# Run
flutter run
```

---

## 🐛 If Still Not Working

### Option 1: Further Reduce Memory

In both `C:\Users\ssury\.gradle\gradle.properties` AND `android/gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=384m -XX:ReservedCodeCacheSize=128m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

### Option 2: Disable Gradle Daemon

Temporarily disable daemon:

In `android/gradle.properties`:
```properties
org.gradle.daemon=false
```

### Option 3: Check Java Version

```powershell
java -version
```

Should show Java 17 or higher. If not, update Java.

---

## 📋 Complete Checklist

- [ ] Enabled Developer Mode (restart required)
- [ ] Fixed global Gradle config (`C:\Users\ssury\.gradle\gradle.properties`)
- [ ] Fixed project Gradle config (`android/gradle.properties`)
- [ ] Stopped all Gradle daemons (`gradlew --stop`)
- [ ] Ran `flutter clean`
- [ ] Ran `flutter pub get`
- [ ] Tried `flutter run`

---

## ⚠️ Important Notes

1. **Developer Mode:** Must be enabled for Flutter plugins (symlink support)
2. **Global Config:** This is overriding your project config - fix both!
3. **Restart:** After enabling Developer Mode, restart is required
4. **Memory:** 2GB should work, but if not, try 1.5GB

---

**Follow these steps in order. The global Gradle config is the main culprit!** 🔧


