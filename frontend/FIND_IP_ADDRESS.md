# 🌐 Find Your Computer's IP Address

## Why You Need This

When using a physical Android device, you can't use `localhost` or `127.0.0.1` because your phone doesn't know what "localhost" means on your computer.

You need your **computer's IP address** on your local network.

## 🔍 How to Find IP Address

### Windows (PowerShell)

```powershell
ipconfig
```

Look for:
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Use the IPv4 Address** (e.g., `192.168.1.100`)

### Windows (Command Prompt)

```cmd
ipconfig
```

Same as above - look for IPv4 Address.

### Mac/Linux

```bash
ifconfig
```

Or:
```bash
ip addr
```

Look for `inet` address (usually starts with `192.168.` or `10.0.`)

## 📝 Update API Config

Once you have your IP (e.g., `192.168.1.100`):

Edit `lib/config/api_config.dart`:

```dart
// For Physical Device (use your computer's IP)
static const String baseUrl = 'http://192.168.1.100:3000';

// For Android Emulator
// static const String baseUrl = 'http://10.0.2.2:3000';

// For iOS Simulator
// static const String baseUrl = 'http://localhost:3000';
```

## ✅ Important Notes

1. **Same Network:** Phone and computer must be on **same WiFi network**
2. **Backend Running:** Make sure backend is running (`npm run dev`)
3. **Firewall:** Windows Firewall might block connections - allow port 3000 if needed
4. **IP Changes:** If you reconnect to WiFi, IP might change - check again

## 🧪 Test Connection

1. Make sure backend is running
2. On your phone's browser, go to: `http://YOUR_IP:3000/api/health`
3. Should return: `{"status":"ok",...}`

If this works, your Flutter app will work too!

## 🔧 If Connection Fails

### Check Firewall

**Windows:**
1. Go to Windows Defender Firewall
2. Allow app through firewall
3. Or temporarily disable firewall for testing

### Check Backend is Running

```bash
# In backend folder
npm run dev
```

Should see: `🚀 Campus Connect API running on http://localhost:3000`

### Check Same Network

- Phone and computer must be on same WiFi
- Not on different networks
- Not using mobile data on phone

---

## ✅ Quick Reference

**Your IP Address:** `192.168.1.XXX` (find using `ipconfig`)

**Update:** `lib/config/api_config.dart`
```dart
static const String baseUrl = 'http://YOUR_IP:3000';
```

**Test:** Open `http://YOUR_IP:3000/api/health` on phone browser

