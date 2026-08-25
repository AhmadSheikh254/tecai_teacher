import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useFonts } from 'expo-font';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import App from '../App';

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

    const webPerfAndIconStyles = `
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        box-sizing: border-box;
      }
      html, body, #root {
        overflow-x: hidden;
        touch-action: manipulation;
        -webkit-overflow-scrolling: touch;
      }
      /* Hardware Acceleration for smooth 60fps scrolling */
      div, [role="grid"], [data-focusable="true"] {
        transform: translateZ(0);
        will-change: transform;
      }
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

    if (!document.getElementById('expo-vector-icons-web-root')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'expo-vector-icons-web-root';
      styleEl.type = 'text/css';
      styleEl.appendChild(document.createTextNode(webPerfAndIconStyles));
      document.head.appendChild(styleEl);
    }
  } catch (e) {
    console.warn('Web font injection notice:', e);
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...MaterialIcons.font,
    ...MaterialCommunityIcons.font,
  });

  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}
