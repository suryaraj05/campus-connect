# Fix Theme Import Errors

## Issue
The build is failing with "Undefined name" errors for `AppTheme` properties like `backgroundColor`, `primaryColor`, etc.

## Root Cause
The imports are correct, but the Dart analyzer may need to be restarted or the project needs to be cleaned.

## Solution

### Step 1: Clean the project
```powershell
cd campus-connect/frontend
flutter clean
flutter pub get
```

### Step 2: Verify imports
All files should import theme like this:
```dart
import '../../config/theme.dart';
```

Then access properties like:
```dart
AppTheme.backgroundColor
AppTheme.primaryColor
AppTheme.priorityUrgent
// etc.
```

### Step 3: If still not working
Try restarting the Dart Analysis Server:
- In VS Code: `Ctrl+Shift+P` → "Dart: Restart Analysis Server"
- In Android Studio: `File` → `Invalidate Caches / Restart`

### Step 4: Build again
```powershell
flutter build apk --debug
```

## Files That Need Theme Access
- `lib/screens/home/home_screen.dart`
- `lib/screens/grievance/grievance_feed_screen.dart`

Both files should have:
```dart
import '../../config/theme.dart';
```

And use:
```dart
AppTheme.backgroundColor
AppTheme.primaryColor
AppTheme.priorityUrgent
AppTheme.priorityHigh
AppTheme.priorityMedium
AppTheme.priorityLow
AppTheme.statusSubmitted
AppTheme.statusAssigned
AppTheme.statusInProgress
AppTheme.statusResolved
AppTheme.statusClosed
AppTheme.statusRejected
```

## Verification
The `lib/config/theme.dart` file has all these properties defined as:
```dart
class AppTheme {
  static const Color backgroundColor = Color(0xFFF7F5F0);
  static const Color primaryColor = Color(0xFF2D7A5F);
  // ... etc
}
```

These should be accessible when importing the file.

