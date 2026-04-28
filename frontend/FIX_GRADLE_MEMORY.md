# 🔧 Fix Gradle Memory Error

## 🎯 Problem
```
There is insufficient memory for the Java Runtime Environment to continue.
The paging file is too small for this operation to complete.
```

Gradle is trying to use 8GB of memory (`-Xmx8G`), but your system doesn't have enough.

## ✅ Solution: Reduce Gradle Memory

### Step 1: Create/Edit gradle.properties

**Location:** `android/gradle.properties`

If the file doesn't exist, create it. If it exists, edit it.

### Step 2: Add Memory Settings

Add these lines to `gradle.properties`:

```properties
# Reduce Gradle memory usage
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true
```

**Explanation:**
- `-Xmx2048m` = Maximum heap size: 2GB (instead of 8GB)
- `-XX:MaxMetaspaceSize=512m` = Metaspace: 512MB
- Other settings optimize Gradle performance

### Step 3: Clean and Rebuild

```powershell
cd campus-connect/frontend

# Clean build
flutter clean

# Get dependencies again
flutter pub get

# Try building again
flutter run
```

---

## 🔧 Alternative: Increase Windows Paging File

If reducing memory doesn't work, increase Windows paging file:

### Step 1: Open System Properties

1. Press `Win + Pause/Break` (or Right-click "This PC" > Properties)
2. Click **"Advanced system settings"**
3. Click **"Settings"** under Performance
4. Go to **"Advanced"** tab
5. Click **"Change"** under Virtual memory

### Step 2: Increase Paging File

1. **Uncheck** "Automatically manage paging file size"
2. Select your main drive (usually C:)
3. Select **"Custom size"**
4. **Initial size:** 4096 MB (4GB)
5. **Maximum size:** 8192 MB (8GB)
6. Click **"Set"**
7. Click **"OK"**
8. **Restart your computer**

### Step 3: Try Again

After restart:
```powershell
flutter clean
flutter pub get
flutter run
```

---

## 🚀 Quick Fix (Recommended)

**Just add the gradle.properties file** - this usually fixes it:

1. Create/edit: `android/gradle.properties`
2. Add the memory settings above
3. Run: `flutter clean && flutter pub get && flutter run`

---

## 📝 Complete gradle.properties File

Create `android/gradle.properties` with this content:

```properties
# Memory settings (reduced from default 8GB to 2GB)
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# Performance optimizations
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true

# Android build settings
android.useAndroidX=true
android.enableJetifier=true
```

---

## ✅ After Fix

Once you've added the gradle.properties file:

```powershell
# Clean build
flutter clean

# Get dependencies
flutter pub get

# Run app
flutter run
```

Should work now! 🎉

---

## 🐛 If Still Not Working

### Option 1: Further Reduce Memory

In `gradle.properties`, change:
```properties
org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=384m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```
(1.5GB instead of 2GB)

### Option 2: Close Other Programs

- Close Android Studio
- Close other heavy programs
- Free up RAM

### Option 3: Restart Computer

Sometimes a fresh start helps.

---

## 📋 Quick Checklist

- [ ] Created/edited `android/gradle.properties`
- [ ] Added memory settings (2GB max)
- [ ] Ran `flutter clean`
- [ ] Ran `flutter pub get`
- [ ] Tried `flutter run` again

---

**Most issues are fixed by just adding the gradle.properties file!** ✅

