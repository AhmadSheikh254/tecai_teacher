import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const origBodyOverflow = document.body.style.overflow;
      const origBodyPos = document.body.style.position;
      const origBodyHeight = document.body.style.height;
      const origDocOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      (document.body.style as any).touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
      (document.documentElement.style as any).touchAction = 'none';

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.body.style.position = origBodyPos;
        document.body.style.height = origBodyHeight;
        (document.body.style as any).touchAction = '';
        document.documentElement.style.overflow = origDocOverflow;
        (document.documentElement.style as any).touchAction = '';
      };
    }
  }, []);

  useEffect(() => {
    // Fade up entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 20,
        friction: 6,
        useNativeDriver: Platform.OS !== 'web',
      })
    ]).start();

    // Continuous smooth spinning for outer loader ring
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();

    // Continuous pulse for inner logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 1000,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();

    // Auto-navigate to Login screen
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Light Aesthetic Pastel Canvas Gradient */}
      <LinearGradient
        colors={['#F8FAFC', '#EFF6FF', '#E0F2FE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft Ambient Light Glow Orbs */}
      <View style={styles.glowOrbTop} pointerEvents="none" />
      <View style={styles.glowOrbBottom} pointerEvents="none" />

      {/* Main Glassmorphic Card Container */}
      <Animated.View 
        style={[
          styles.content, 
          { 
            opacity: fadeAnim, 
            transform: [{ translateY: translateYAnim }] 
          }
        ]}
      >
        {/* Animated Glass Logo Shield */}
        <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoScale }] }]}>
          {/* Animated Glowing Outer Ring */}
          <Animated.View style={[styles.glowingRing, { transform: [{ rotate: spin }] }]}>
            <LinearGradient
              colors={['#0284C7', 'transparent', '#0052cc', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          <View style={styles.logoGlassContainer}>
            <LinearGradient
              colors={['#ffffff', '#f0f7ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <MaterialIcons name="school" size={48} color="#0284C7" />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Clean Typography */}
        <Text style={styles.title}>Teacher Hub</Text>
        <Text style={styles.subtitle}>Smart Academic Management</Text>
      </Animated.View>

      {/* Premium Loader Ring */}
      <Animated.View style={[styles.loaderContainer, { opacity: fadeAnim }]}>
        <View style={styles.loaderTrack}>
          <Animated.View style={[styles.loaderSpinner, { transform: [{ rotate: spin }] }]}>
            <LinearGradient
              colors={['#0284C7', '#0052cc', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  glowOrbTop: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
  },
  glowOrbBottom: {
    position: 'absolute',
    bottom: -120,
    right: -80,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: 'rgba(99, 102, 241, 0.14)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoWrapper: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  glowingRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 2,
    overflow: 'hidden',
  },
  logoGlassContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loaderTrack: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  loaderSpinner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
