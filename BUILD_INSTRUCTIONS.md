# Calculator App - Build Instructions

## Overview
This is a simple calculator app for Android that functions as a "hidden app". The calculator performs basic math operations, but also contains a secret unlock mechanism that opens a hidden WebView.

## Features
- ✅ Basic arithmetic operations (+, -, ×, ÷)
- ✅ Percentage and sign toggle
- ✅ Clear function
- ✅ Clean, minimal iOS-style UI
- ✅ Secret unlock code mechanism
- ✅ Hidden WebView for secure content

## Configuration

### Before Building
**IMPORTANT:** Modify the configuration file before building the app.

Location: `/app/frontend/config.ts`

```typescript
export const APP_CONFIG = {
  // Unlock code to access the hidden webview
  UNLOCK_CODE: '742767',
  
  // Target URL for the webview (will append ?unlock=EQUATION)
  TARGET_URL: 'https://yourserver.com/unlock',
};
```

### Configuration Variables

1. **UNLOCK_CODE** (default: `'742767'`)
   - The secret code that unlocks the hidden feature
   - Can be any numeric string
   - Change this before building your app

2. **TARGET_URL** (default: `'https://yourserver.com/unlock'`)
   - The URL that will be opened in the WebView
   - Replace with your actual server URL
   - The equation will be appended as a query parameter

## How the Unlock Works

1. User enters the **UNLOCK_CODE** (e.g., `742767`)
2. User presses **+**
3. User enters **secondary code** (e.g., `1234`)
4. User presses **=**
5. App calls your API: `TARGET_URL?unlock=742767+1234`
6. **If API returns HTTP 200** with `{"URL": "https://..."}` → Opens WebView with that URL
7. **If API returns any other status** (401, 403, etc.) → Shows normal math result

### Example Flow - Success
```
Calculator Input: 742767 + 1234 =
↓
API Call: https://yourserver.com/api/unlock?unlock=742767+1234
↓
API Response (200): {"URL": "https://google.com"}
↓
Opens WebView → https://google.com
```

### Example Flow - Invalid Code
```
Calculator Input: 742767 + 9999 =
↓
API Call: https://yourserver.com/api/unlock?unlock=742767+9999
↓
API Response (401): {"detail": "Unauthorized"}
↓
Shows normal calculator result: 752766
(User doesn't know there's a hidden feature!)
```

## Building the App

### For Android

1. **Modify Configuration**
   ```bash
   cd /app/frontend
   # Edit config.ts with your values
   nano config.ts
   ```

2. **Build APK**
   ```bash
   # Using EAS Build (Expo Application Services)
   npx eas-cli build --platform android --profile preview
   
   # OR using local build
   npx expo prebuild
   cd android
   ./gradlew assembleRelease
   ```

3. **Install on Device**
   ```bash
   # The APK will be available in android/app/build/outputs/apk/release/
   adb install app-release.apk
   ```

### For iOS (Similar Process)

1. Modify configuration (same as Android)
2. Build using Expo EAS or Xcode
3. Deploy via TestFlight or direct installation

## Testing

### On Web (Preview Only)
```bash
cd /app/frontend
yarn start
# Access at http://localhost:3000
```

**Note:** WebView functionality will redirect to the URL on web. Full WebView experience is only available on mobile devices.

### On Mobile Device
1. Install Expo Go app
2. Scan QR code from `yarn start`
3. Test calculator and unlock functionality

## File Structure

```
/app/frontend/
├── config.ts              # Configuration file (MODIFY THIS)
├── app/
│   ├── index.tsx         # Calculator screen
│   └── webview.tsx       # Hidden WebView screen
├── package.json
└── app.json
```

## Security Considerations

### For Production Use:

1. **Obfuscate the Code**
   - Use ProGuard (Android) or equivalent
   - Minify JavaScript code

2. **Add Additional Security**
   - Consider adding time-based tokens
   - Implement server-side validation
   - Use HTTPS only

3. **Secure the WebView**
   - Implement SSL pinning
   - Add authentication tokens
   - Validate all incoming requests on your server

## Server-Side Implementation

Your server should handle the unlock parameter:

```javascript
// Example server endpoint
app.get('/unlock', (req, res) => {
  const equation = req.query.unlock; // e.g., "742767+1234"
  
  // Extract unlock code and additional data
  const parts = equation.split('+');
  const unlockCode = parts[0]; // "742767"
  const additionalData = parts[1]; // "1234"
  
  // Validate unlock code
  if (unlockCode === '742767') {
    // Grant access, show hidden content
    res.send('Welcome! Access granted.');
  } else {
    res.status(403).send('Access denied');
  }
});
```

## Troubleshooting

### WebView shows blank screen on Android
- Ensure you have internet permission in AndroidManifest.xml
- Check if the URL is accessible
- Verify SSL certificates are valid

### Calculator not responding
- Check for JavaScript errors in Metro bundler
- Ensure all dependencies are installed
- Try clearing Metro cache: `npx expo start -c`

### Unlock code not working
- Verify UNLOCK_CODE in config.ts matches your input
- Check console logs for navigation errors
- Ensure equation format is correct (CODE + NUMBER)

## Development

### Running in Development
```bash
cd /app/frontend
yarn start
```

### Making Changes
1. Edit files in `/app/frontend/`
2. Changes will hot-reload automatically
3. Test on Expo Go app or web browser

### Adding New Features
- Calculator logic: Edit `app/index.tsx`
- WebView behavior: Edit `app/webview.tsx`
- Configuration: Edit `config.ts`

## Important Notes

- The app always starts with the calculator screen when opened
- WebView content is **not stored in device browser history**
- All browsing happens within the app's WebView
- When the app is closed and reopened, it returns to the calculator
- This design makes it appear as a normal calculator app

## Support

For iOS equivalent:
- Use the same configuration approach
- Replace platform-specific code as needed
- WebView component works identically on iOS

## License

This is a custom-built calculator app for your specific use case.
