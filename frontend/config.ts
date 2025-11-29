// ============================================
// CONFIGURATION FILE
// Modify these values before building the app
// ============================================

export const APP_CONFIG = {
  // Unlock code to access the hidden webview
  UNLOCK_CODE: '742767',
  
  // API endpoint that validates unlock and returns URL
  // Must return 200 with {"URL": "https://..."} to open WebView
  // Return any other status code (401, 403, etc.) to show normal calculator result
  TARGET_URL: 'https://yourserver.com/api/unlock',
};
