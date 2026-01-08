# Google Sign-In Setup Guide

## ✅ What Has Been Implemented

### 1. Frontend Implementation
- ✅ Google Identity Services script added to `index.html`
- ✅ Google Client ID configuration in `environment.ts`
- ✅ Google Sign-In button in login page
- ✅ `googleLogin()` method in `AuthService`
- ✅ Automatic Customer role assignment for new Google users
- ✅ Role-based redirection after Google login

### 2. Files Modified/Created

#### Modified Files:
1. **`src/index.html`** - Added Google Identity Services script
2. **`src/environments/environment.ts`** - Added `googleClientId` property
3. **`src/app/core/services/auth.service.ts`** - Added `googleLogin()` method
4. **`src/app/features/auth/login/login.component.ts`** - Added Google Sign-In initialization
5. **`src/app/features/auth/login/login.component.html`** - Added Google button div
6. **`src/app/features/auth/login/login.component.scss`** - Added Google button styles

## 🔧 Configuration Required

### Step 1: Get Google Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **Google+ API** (or Google Identity Services)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - **Application type**: Web application
   - **Authorized JavaScript origins**: 
     - `http://localhost:4200` (for development)
     - Your production domain
   - **Authorized redirect URIs**: Not needed for Google Identity Services (one-tap)

### Step 2: Update Environment File
Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7022',
  // Replace with your actual Google Client ID
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com'
};
```

### Step 3: Backend Configuration
Ensure your backend has:
- `POST /api/auth/google-login` endpoint
- Google Client ID in `appsettings.json`:
  ```json
  {
    "GoogleOAuth": {
      "ClientId": "YOUR_GOOGLE_CLIENT_ID_HERE"
    }
  }
  ```

## 📋 How It Works

### Flow:
1. User clicks "Sign in with Google" button
2. Google Identity Services shows sign-in popup
3. User authenticates with Google
4. Google returns ID token (`response.credential`)
5. Frontend sends ID token to backend: `POST /api/auth/google-login`
6. Backend:
   - Validates ID token with Google
   - If user doesn't exist: Creates new user with **role = Customer**
   - If user exists: Logs them in
   - Returns JWT token and user info
7. Frontend stores JWT token and user data
8. User is redirected based on role:
   - **Customer** → `/home`
   - **Seller** → `/seller/dashboard`
   - **Admin** → `/admin/dashboard`

### Key Features:
- ✅ **New users automatically get Customer role**
- ✅ **Existing users keep their current role**
- ✅ **Same JWT token system as email/password login**
- ✅ **Role-based routing after login**

## 🧪 Testing

1. Make sure backend is running on `https://localhost:7022`
2. Make sure backend has `/api/auth/google-login` endpoint configured
3. Update `googleClientId` in `environment.ts`
4. Start Angular app: `npm start`
5. Navigate to login page
6. Click "Sign in with Google" button
7. Authenticate with Google account
8. Should redirect to appropriate dashboard based on role

## ⚠️ Important Notes

- The Google Client ID in frontend must match the one in backend `appsettings.json`
- For new Google users, backend automatically assigns **Customer** role
- The ID token is sent directly to backend - no redirect flow needed
- All subsequent API calls use the JWT token (same as email/password login)

