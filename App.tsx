import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StyleSheet, Platform, View, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Web Vector Icons Font Injection for Vercel & Web Exports
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  try {
    const cdnLinks = [
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css'
    ];
    cdnLinks.forEach(url => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
      }
    });

    const iconFontStyles = `
      @font-face {
        font-family: 'MaterialIcons';
        src: url('https://fonts.gstatic.com/s/materialicons/v142/fluGr4svyA-A6H72462Uce5P7A.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Material Icons';
        src: url('https://fonts.gstatic.com/s/materialicons/v142/fluGr4svyA-A6H72462Uce5P7A.woff2') format('woff2');
      }
      @font-face {
        font-family: 'MaterialCommunityIcons';
        src: url('https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/fonts/materialdesignicons-webfont.woff2?v=7.4.47') format('woff2');
      }
      @font-face {
        font-family: 'Material Community Icons';
        src: url('https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/fonts/materialdesignicons-webfont.woff2?v=7.4.47') format('woff2');
      }
    `;

    if (!document.getElementById('expo-vector-icons-web')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'expo-vector-icons-web';
      styleEl.type = 'text/css';
      styleEl.appendChild(document.createTextNode(iconFontStyles));
      document.head.appendChild(styleEl);
    }
  } catch (e) {
    console.warn('Web font injection notice:', e);
  }
}

const initialMetrics = Platform.OS === 'web' ? {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
} : undefined;

export default function App() {
  const [fontsLoaded] = useFonts({
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font,
  });

  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
});
