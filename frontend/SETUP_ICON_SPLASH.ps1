# Setup Script for App Icon and Splash Screen
# Run this script to set up the app icon and splash screen

Write-Host "🎨 Setting up App Icon and Splash Screen..." -ForegroundColor Cyan

# Step 1: Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
flutter pub get

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 2: Generate icons and splash screen
Write-Host "`n🎨 Generating app icons and splash screen..." -ForegroundColor Yellow
flutter pub run flutter_native_splash:create

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  flutter_native_splash failed. You may need to run it manually:" -ForegroundColor Yellow
    Write-Host "   flutter pub run flutter_native_splash:create" -ForegroundColor White
} else {
    Write-Host "✅ Icons and splash screen generated successfully!" -ForegroundColor Green
}

# Step 3: Clean and rebuild
Write-Host "`n🧹 Cleaning build cache..." -ForegroundColor Yellow
flutter clean

Write-Host "`n📦 Getting packages again..." -ForegroundColor Yellow
flutter pub get

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Build the app: flutter build apk --debug" -ForegroundColor White
Write-Host "2. Install on device and verify:" -ForegroundColor White
Write-Host "   - App icon shows your logo" -ForegroundColor White
Write-Host "   - App name is 'Campus Connect'" -ForegroundColor White
Write-Host "   - Splash screen appears on launch" -ForegroundColor White

