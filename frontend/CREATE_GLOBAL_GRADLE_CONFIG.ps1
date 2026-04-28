# PowerShell script to create/update global Gradle config
# Run this script to fix memory issues

$gradleConfigPath = "$env:USERPROFILE\.gradle\gradle.properties"

# Create .gradle directory if it doesn't exist
$gradleDir = "$env:USERPROFILE\.gradle"
if (-not (Test-Path $gradleDir)) {
    New-Item -ItemType Directory -Path $gradleDir -Force | Out-Null
}

# Create or update gradle.properties
$configContent = @"
# Reduced memory settings to fix "insufficient memory" error
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m -XX:ReservedCodeCacheSize=256m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8

# Performance optimizations
org.gradle.parallel=true
org.gradle.caching=true
org.gradle.daemon=true
"@

Set-Content -Path $gradleConfigPath -Value $configContent -Force

Write-Host "✅ Global Gradle config created/updated at: $gradleConfigPath" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Enable Developer Mode: start ms-settings:developers" -ForegroundColor Cyan
Write-Host "2. Restart your computer" -ForegroundColor Cyan
Write-Host "3. Run: cd campus-connect/frontend/android && .\gradlew --stop" -ForegroundColor Cyan
Write-Host "4. Run: flutter clean && flutter pub get && flutter run" -ForegroundColor Cyan


