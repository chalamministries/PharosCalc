import { View, StyleSheet, ActivityIndicator, Platform, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { APP_CONFIG } from '../config';
import { useEffect } from 'react';

export default function WebViewScreen() {
  const params = useLocalSearchParams();
  const unlockCode = params.unlock as string;

  // Construct the full URL with the unlock parameter
  const url = `${APP_CONFIG.TARGET_URL}?unlock=${unlockCode}`;

  useEffect(() => {
    // On web platform, open URL in same window
    if (Platform.OS === 'web') {
      window.location.href = url;
    }
  }, [url]);

  // For web platform, show loading message while redirecting
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff9500" />
          <Text style={styles.loadingText}>Redirecting...</Text>
        </View>
      </View>
    );
  }

  // For mobile platforms (Android/iOS), use WebView
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff9500" />
          </View>
        )}
        // Security settings to keep it within the app
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // Prevent opening in external browser
        onShouldStartLoadWithRequest={(request) => {
          // Allow all requests to load within the WebView
          return true;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
});
