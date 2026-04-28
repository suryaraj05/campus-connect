# 📌 API Versioning Guide

## Overview

The Campus Connect API uses **semantic versioning** to ensure backward compatibility and allow future enhancements without breaking existing clients.

## Current Version

**API Version:** `v1`  
**Version:** `1.0.0`

## Versioning Strategy

### URL Structure

All API endpoints (except system endpoints) are prefixed with `/api/v1/`:

```
/api/v1/grievances
/api/v1/ai
/api/v1/auth
/api/v1/users
/api/v1/notifications
/api/v1/location
/api/v1/config
```

### System Endpoints (No Versioning)

These endpoints are **not versioned** as they are system-level:

- `/api/health` - Health check
- `/api/version` - API version information

## Backward Compatibility

The API currently supports **backward compatibility** by maintaining both old and new routes:

- ✅ `/api/v1/grievances` (new, recommended)
- ✅ `/api/grievances` (old, deprecated but still works)

**Note:** Old routes will be removed in a future version. Always use `/api/v1/` endpoints.

## Version Info Endpoint

### GET `/api/version`

Returns information about the API version and available endpoints.

**Response:**
```json
{
  "success": true,
  "data": {
    "apiVersion": "v1",
    "version": "1.0.0",
    "supportedVersions": ["v1"],
    "latestVersion": "v1",
    "endpoints": {
      "v1": {
        "base": "/api/v1",
        "routes": [
          "/api/v1/grievances",
          "/api/v1/ai",
          "/api/v1/auth",
          "/api/v1/users",
          "/api/v1/notifications",
          "/api/v1/location",
          "/api/v1/config"
        ]
      }
    }
  }
}
```

## Future Versions

### Adding v2

When you need to add new features or breaking changes:

1. **Create new routes:**
   ```javascript
   app.use('/api/v2/grievances', grievanceRoutesV2);
   ```

2. **Update version info:**
   ```javascript
   supportedVersions: ['v1', 'v2'],
   latestVersion: 'v2'
   ```

3. **Maintain v1:**
   - Keep v1 endpoints working
   - Document deprecation timeline
   - Provide migration guide

### Version Lifecycle

1. **Active:** Current version, fully supported
2. **Deprecated:** Still works, but will be removed in future
3. **Removed:** No longer available

## Best Practices

### For Frontend Developers

1. **Always use versioned endpoints:**
   ```dart
   static const String grievances = '/api/v1/grievances';
   ```

2. **Check version on app startup:**
   ```dart
   final versionInfo = await apiService.getVersionInfo();
   if (versionInfo.data['latestVersion'] != 'v1') {
     // Show update notification
   }
   ```

3. **Handle version errors gracefully:**
   - If endpoint returns 404, check version
   - Fallback to previous version if available

### For Backend Developers

1. **Never break existing endpoints:**
   - Add new fields, don't remove old ones
   - Make breaking changes in new version

2. **Document changes:**
   - Use semantic versioning (MAJOR.MINOR.PATCH)
   - MAJOR: Breaking changes → new version
   - MINOR: New features → same version
   - PATCH: Bug fixes → same version

3. **Test backward compatibility:**
   - Ensure old clients still work
   - Test migration paths

## Migration Example

### From v1 to v2

**v1 Endpoint:**
```javascript
POST /api/v1/grievances
{
  "title": "Broken light",
  "description": "Light not working"
}
```

**v2 Endpoint (with new field):**
```javascript
POST /api/v2/grievances
{
  "title": "Broken light",
  "description": "Light not working",
  "category": "electrical", // NEW FIELD
  "tags": ["urgent", "campus"] // NEW FIELD
}
```

**Migration:**
- v1 clients continue to work
- v2 clients get new features
- Gradual migration over time

## Testing

### Test Version Endpoint

```bash
curl https://campus-connect-backend-wine.vercel.app/api/version
```

### Test Versioned Endpoints

```bash
# v1 endpoint
curl https://campus-connect-backend-wine.vercel.app/api/v1/config

# Old endpoint (backward compatibility)
curl https://campus-connect-backend-wine.vercel.app/api/config
```

## Summary

✅ **Current:** Use `/api/v1/` for all endpoints  
✅ **Future:** Add `/api/v2/` when needed  
✅ **Compatibility:** Old routes work but are deprecated  
✅ **Versioning:** Check `/api/version` for supported versions

