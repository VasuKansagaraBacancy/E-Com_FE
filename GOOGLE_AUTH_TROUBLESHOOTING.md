# Google Authentication Troubleshooting

## ✅ Frontend Status
The frontend is correctly:
- ✅ Sending ID token to `POST /api/auth/google-login`
- ✅ Request body format: `{ "idToken": "..." }`
- ✅ Content-Type: `application/json`
- ✅ Token is valid JWT format

## ❌ Backend Issue
Error: `"Invalid Google authentication token."`

This means the backend is receiving the request but **failing to validate** the Google ID token.

## 🔍 Backend Checklist

### 1. Verify Google Client ID Match
**Frontend** (`environment.ts`):
```typescript
googleClientId: '867848949678-4qjhet7k1vqnpeq88f29crmchds1amri.apps.googleusercontent.com'
```

**Backend** (`appsettings.json`) - MUST MATCH:
```json
{
  "GoogleOAuth": {
    "ClientId": "867848949678-4qjhet7k1vqnpeq88f29crmchds1amri.apps.googleusercontent.com"
  }
}
```

### 2. Check Backend Package
Ensure you have the Google OAuth validation package installed:
```bash
# For .NET Core
dotnet add package Google.Apis.Auth
```

### 3. Verify Backend Endpoint Implementation
Your backend endpoint should:
```csharp
[HttpPost("google-login")]
public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
{
    try
    {
        // Validate the Google ID token
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { _configuration["GoogleOAuth:ClientId"] }
        };
        
        var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
        
        // Check if user exists, create if not, etc.
        // ...
    }
    catch (Exception ex)
    {
        return BadRequest(new { success = false, message = "Invalid Google authentication token." });
    }
}
```

### 4. Common Backend Issues

#### Issue 1: Client ID Mismatch
- **Symptom**: "Invalid Google authentication token"
- **Fix**: Ensure `appsettings.json` ClientId exactly matches frontend

#### Issue 2: Missing Package
- **Symptom**: Compilation errors or runtime exceptions
- **Fix**: Install `Google.Apis.Auth` NuGet package

#### Issue 3: Token Validation Settings
- **Symptom**: Validation always fails
- **Fix**: Ensure `Audience` in validation settings matches your Client ID

#### Issue 4: Token Expired
- **Symptom**: Token was valid but expired
- **Fix**: Google tokens expire after 1 hour. User needs to sign in again.

#### Issue 5: Wrong Token Type
- **Symptom**: Backend expecting different token format
- **Fix**: Ensure backend is validating **ID token** (not access token)

### 5. Test the Token Manually

You can decode the JWT token to verify it:
- Go to https://jwt.io
- Paste your token
- Check the payload:
  - `aud` (audience) should match your Client ID
  - `iss` (issuer) should be `https://accounts.google.com`
  - `exp` (expiration) should be in the future

### 6. Backend Logging

Add logging to your backend endpoint:
```csharp
_logger.LogInformation("Received Google login request");
_logger.LogInformation("Client ID from config: {ClientId}", _configuration["GoogleOAuth:ClientId"]);
_logger.LogInformation("Token length: {Length}", request.IdToken?.Length);
```

## 🧪 Testing Steps

1. **Check Browser Console** - Look for the request being sent
2. **Check Network Tab** - Verify the request body format
3. **Check Backend Logs** - See what error backend is throwing
4. **Verify Client ID** - Compare frontend and backend Client IDs
5. **Test with Postman** - Send the same request manually to isolate frontend/backend

## 📝 Expected Request Format

**URL**: `POST https://localhost:7022/api/auth/google-login`

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

## ✅ Next Steps

1. Verify backend `appsettings.json` has correct Client ID
2. Check backend has `Google.Apis.Auth` package installed
3. Verify backend validation code matches the contract
4. Check backend logs for detailed error messages
5. Test token validation manually if possible

