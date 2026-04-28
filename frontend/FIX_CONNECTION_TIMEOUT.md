# 🔧 Fix Connection Timeout Error

## 🐛 Error
```
DioException [connection timeout]: The request connection took longer than 0:00:30.000000 and it was aborted.
```

## ✅ What This Means

Your Flutter app **cannot connect to the backend server** at `http://10.39.13.239:3000`.

---

## 🚀 Quick Fix Steps

### Step 1: Start the Backend Server

**Open a NEW terminal/PowerShell window** and run:

```powershell
# Navigate to backend folder
cd C:\Users\ssury\OneDrive\Dokumentumok\HACKATHON\campus-connect\backend

# Start the backend server
npm run dev
```

You should see:
```
Server running on http://localhost:3000
```

**Keep this terminal open!** The backend must be running.

---

### Step 2: Verify Backend is Running

**In a browser or new terminal**, test the backend:

```powershell
# Test health endpoint
curl http://localhost:3000/api/health
```

Or open in browser: `http://localhost:3000/api/health`

You should see: `{"success":true,"message":"Server is running"}`

---

### Step 3: Check Your IP Address

**Make sure your computer's IP is still `10.39.13.239`:**

```powershell
ipconfig
```

Look for **Wi-Fi adapter** → **IPv4 Address**

If it's different, update `lib/config/api_config.dart`:
```dart
static const String physicalDeviceUrl = 'http://YOUR_NEW_IP:3000';
```

---

### Step 4: Check Firewall

**Windows Firewall might be blocking the connection:**

1. Open **Windows Defender Firewall**
2. Click **Allow an app or feature through Windows Firewall**
3. Make sure **Node.js** is allowed for **Private** networks

Or temporarily disable firewall to test (not recommended for production).

---

### Step 5: Verify Network Connection

**Make sure:**
- ✅ Phone and PC are on the **same WiFi network**
- ✅ Backend is running on port **3000**
- ✅ No VPN is blocking the connection
- ✅ IP address is correct

---

### Step 6: Test Connection from Phone

**In the Flutter app:**
1. Try to login/register again
2. Check the terminal logs for connection errors
3. The timeout is now 60 seconds (increased from 30)

---

## 🔍 Debugging Steps

### Check if Backend is Running

```powershell
# Check if Node.js process is running
Get-Process -Name node -ErrorAction SilentlyContinue
```

If nothing shows, backend is **not running**.

### Check if Port 3000 is in Use

```powershell
# Check if port 3000 is listening
netstat -ano | findstr :3000
```

If you see `LISTENING`, backend is running.

### Test Connection from PC

```powershell
# Test if backend responds
Invoke-WebRequest -Uri http://localhost:3000/api/health
```

---

## 📋 Common Issues

### Issue 1: Backend Not Running
**Solution:** Start backend with `npm run dev`

### Issue 2: Wrong IP Address
**Solution:** Check IP with `ipconfig` and update `api_config.dart`

### Issue 3: Firewall Blocking
**Solution:** Allow Node.js through Windows Firewall

### Issue 4: Different WiFi Networks
**Solution:** Connect phone and PC to same WiFi

### Issue 5: Backend Running on Different Port
**Solution:** Check backend logs, update port in `api_config.dart`

---

## ✅ What I Fixed

1. **Increased timeout** from 30s to 60s (gives more time to connect)
2. **Added error logging** to help debug connection issues
3. **Better error messages** in console

---

## 🧪 Testing

1. **Start backend:**
   ```powershell
   cd campus-connect\backend
   npm run dev
   ```

2. **Verify backend:**
   - Open: `http://localhost:3000/api/health`
   - Should see: `{"success":true}`

3. **Check IP:**
   ```powershell
   ipconfig
   ```

4. **Test in app:**
   - Try login/register
   - Should connect now!

---

## 🆘 Still Not Working?

### Option 1: Use Android Emulator
Change in `api_config.dart`:
```dart
static const String baseUrl = androidEmulatorUrl; // Use emulator
```

### Option 2: Use USB Debugging with Port Forwarding
```powershell
adb reverse tcp:3000 tcp:3000
```

Then use:
```dart
static const String baseUrl = localBaseUrl; // localhost
```

### Option 3: Check Backend Logs
Look at the backend terminal for errors:
- Missing `.env` file?
- Firebase not initialized?
- Port already in use?

---

**The most common issue is: Backend is not running!** 🚀

Start it with `npm run dev` in the backend folder.

