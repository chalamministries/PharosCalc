# Quick Configuration Guide

## 🔧 Before Building Your App

### Step 1: Edit Configuration File

Open: `/app/frontend/config.ts`

```typescript
export const APP_CONFIG = {
  // Change this to your secret unlock code
  UNLOCK_CODE: '742767',
  
  // Change this to your server URL
  TARGET_URL: 'https://yourserver.com/unlock',
};
```

### Step 2: Set Your Values

**Example for a real deployment:**

```typescript
export const APP_CONFIG = {
  UNLOCK_CODE: '999888',  // Your custom unlock code
  TARGET_URL: 'https://myserver.com/secure',  // Your actual URL
};
```

### Step 3: How It Works

```
User enters: 999888 + 1234 =
              ^^^^^^   ^^^^
           unlock code | any number
              
App opens: https://myserver.com/secure?unlock=999888+1234
```

## 📱 Building for Android

### Method 1: EAS Build (Recommended)
```bash
cd /app/frontend
npx eas-cli build --platform android
```

### Method 2: Local Build
```bash
cd /app/frontend
npx expo prebuild
cd android
./gradlew assembleRelease
# APK location: android/app/build/outputs/apk/release/
```

## 🍎 Building for iOS

Same configuration, just change the build command:
```bash
cd /app/frontend
npx eas-cli build --platform ios
```

## ✅ Testing Before Building

1. Start the development server:
   ```bash
   cd /app/frontend
   yarn start
   ```

2. Scan QR code with Expo Go app on your phone

3. Test the unlock sequence:
   - Enter your UNLOCK_CODE
   - Press +
   - Enter any number
   - Press =
   - Should navigate to WebView

## 🔒 Security Tips

1. **Change the unlock code** from the default `742767`
2. **Use HTTPS** for your TARGET_URL
3. **Implement server-side validation** to verify the unlock code
4. **Use ProGuard** to obfuscate the Android APK

## 📝 What Each File Does

- **`config.ts`** - Your configuration (MODIFY THIS)
- **`app/index.tsx`** - Calculator interface
- **`app/webview.tsx`** - Hidden WebView screen

## ⚡ Quick Edit Command

```bash
nano /app/frontend/config.ts
```

Then press `Ctrl+X`, `Y`, `Enter` to save.

---

**That's it!** Just edit `config.ts` with your values and build the app.
