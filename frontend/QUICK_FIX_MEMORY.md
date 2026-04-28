# ⚡ Quick Fix - Gradle Memory Error

## 🎯 Problem
```
There is insufficient memory for the Java Runtime Environment to continue.
The paging file is too small for this operation to complete.
```

**Cause:** Gradle is trying to use 8GB of memory, but your system doesn't have enough.

## ✅ Fixed!

I've updated `android/gradle.properties` to use **2GB instead of 8GB**.

## 🚀 Next Steps

```powershell
cd campus-connect/frontend

# Clean build
flutter clean

# Get dependencies
flutter pub get

# Run app
flutter run
```

---

## 📝 What I Changed

**Before:**
```properties
org.gradle.jvmargs=-Xmx8G -XX:MaxMetaspaceSize=4G ...
```

**After:**
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m ...
```

**Reduced from 8GB to 2GB** - should work now! ✅

---

## 🐛 If Still Not Working

If you still get memory errors, try even lower:

Edit `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=384m ...
```

Then run `flutter clean && flutter pub get && flutter run` again.

---

**Try running `flutter run` now - it should work!** 🎉

