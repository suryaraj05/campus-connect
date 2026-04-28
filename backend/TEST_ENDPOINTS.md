# 🧪 Test Versioned Endpoints

After deployment, test these endpoints to verify everything works:

## ✅ System Endpoints (No Versioning)

### Health Check
```bash
curl https://campus-connect-backend-wine.vercel.app/api/health
```

Expected:
```json
{
  "status": "ok",
  "message": "Campus Connect API is running",
  "version": "1.0.0",
  "apiVersion": "v1"
}
```

### Version Info
```bash
curl https://campus-connect-backend-wine.vercel.app/api/version
```

Expected:
```json
{
  "success": true,
  "data": {
    "apiVersion": "v1",
    "version": "1.0.0",
    "supportedVersions": ["v1"],
    "latestVersion": "v1"
  }
}
```

## ✅ Versioned Endpoints (v1)

### Config
```bash
curl https://campus-connect-backend-wine.vercel.app/api/v1/config
```

### Auth Login (POST)
```bash
curl -X POST https://campus-connect-backend-wine.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"idToken": "test-token"}'
```

## ✅ Backward Compatibility (Old Routes)

### Config (Old)
```bash
curl https://campus-connect-backend-wine.vercel.app/api/config
```

### Auth Login (Old)
```bash
curl -X POST https://campus-connect-backend-wine.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"idToken": "test-token"}'
```

## 🔍 Troubleshooting

If you get 404 errors:

1. **Check deployment:** Make sure the latest code is deployed
2. **Check route:** Verify you're using `/api/v1/` prefix
3. **Check logs:** Use `vercel logs` to see server errors
4. **Test locally:** Run `npm start` and test `http://localhost:3000/api/v1/config`

