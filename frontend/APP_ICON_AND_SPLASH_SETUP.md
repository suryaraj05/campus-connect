# 🎨 App Icon & Splash Screen Setup Guide

## ✅ What's Been Done

1. ✅ Logo copied to `assets/images/app_icon.png`
2. ✅ App name changed to "Campus Connect" in AndroidManifest
3. ✅ Splash screen created with professional design
4. ✅ `flutter_native_splash` package added
5. ✅ Assets configured in `pubspec.yaml`

## 🚀 Next Steps

### Step 1: Install Dependencies

```powershell
cd campus-connect/frontend
flutter pub get
```

### Step 2: Generate App Icons & Splash Screen

The `flutter_native_splash` package will automatically:
- Generate app icons for all Android densities
- Generate app icons for iOS
- Generate splash screens for Android and iOS
- Generate splash screen for Android 12+

Run this command:

```powershell
flutter pub run flutter_native_splash:create
```

This will:
- ✅ Create app icons in all required sizes
- ✅ Create splash screens
- ✅ Update Android and iOS configurations

### Step 3: Verify App Name

The app name is already set to **"Campus Connect"** in:
- ✅ `android/app/src/main/AndroidManifest.xml` - `android:label="Campus Connect"`
- ✅ `lib/main.dart` - `title: 'Campus Connect'`

### Step 4: Rebuild App

After generating icons and splash:

```powershell
flutter clean
flutter pub get
flutter build apk --debug
```

## 📱 What You'll See

### App Icon
- Your logo will appear as the app icon on the home screen
- All sizes generated automatically (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- Works on all Android devices

### Splash Screen
- Professional gradient background (blue theme)
- Your logo centered with animation
- "Campus Connect" text
- "AI-Powered Grievance Management" tagline
- Smooth fade and scale animations
- Auto-navigates to home/landing after 3 seconds

## 🎨 Splash Screen Features

- **Gradient Background**: Blue to teal gradient
- **Logo Animation**: Fade in + scale up
- **Professional Design**: Clean, modern UI
- **Auto-Navigation**: Checks auth state and navigates accordingly
- **Loading Indicator**: Shows progress

## 📋 Files Modified

1. ✅ `pubspec.yaml` - Added assets and splash config
2. ✅ `android/app/src/main/AndroidManifest.xml` - Changed app name
3. ✅ `lib/routes/app_router.dart` - Added splash route
4. ✅ `lib/screens/splash/splash_screen.dart` - Created splash screen
5. ✅ `assets/images/app_icon.png` - Logo copied

## 🔧 Manual Icon Generation (If Needed)

If `flutter_native_splash` doesn't work, you can manually:

1. Use an online tool like [App Icon Generator](https://www.appicon.co/)
2. Upload your `app_icon.png`
3. Download generated icons
4. Place them in:
   - Android: `android/app/src/main/res/mipmap-*/ic_launcher.png`
   - iOS: `ios/Runner/Assets.xcassets/AppIcon.appiconset/`

## ✅ Verification Checklist

After setup:
- [ ] App icon shows your logo on home screen
- [ ] App name shows "Campus Connect" (not "campus_connect")
- [ ] Splash screen appears on app launch
- [ ] Splash screen has logo and animations
- [ ] Splash screen navigates correctly

## 🐛 Troubleshooting

### Icons Not Showing
- Run `flutter clean` and rebuild
- Verify `app_icon.png` exists in `assets/images/`
- Check `pubspec.yaml` has assets configured

### Splash Screen Not Working
- Verify `flutter_native_splash` ran successfully
- Check `lib/routes/app_router.dart` has splash route
- Verify initial location is `/splash`

### App Name Still Shows "campus_connect"
- Check `AndroidManifest.xml` has `android:label="Campus Connect"`
- Rebuild the app: `flutter clean && flutter build apk`

## 🎉 Result

After completing these steps:
- ✅ Your logo will be the app icon
- ✅ App name will be "Campus Connect"
- ✅ Professional splash screen on launch
- ✅ Easy to identify your app among others!

