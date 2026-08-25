import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(25)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const loaderProgress = useRef(new Animated.Value(-60)).current;

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

      const preventTouchMove = (e: TouchEvent) => {
        e.preventDefault();
      };
      window.addEventListener('touchmove', preventTouchMove, { passive: false });

      return () => {
        window.removeEventListener('touchmove', preventTouchMove);
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
    // Fade up animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: Platform.OS !== 'web',
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 15,
        friction: 5,
        useNativeDriver: Platform.OS !== 'web',
      })
    ]).start();

    // Constant premium loading sweep animation
    Animated.loop(
      Animated.timing(loaderProgress, {
        toValue: 160,
        duration: 1500,
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();

    // Auto-navigate to Login after 2.8 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const animatedContentStyle = {
    opacity: fadeAnim,
    transform: [{ translateY: translateYAnim }],
  };

  const animatedLogoStyle = {
    opacity: fadeAnim,
    transform: [{ scale: logoScale }],
  };

  const loaderTranslateX = loaderProgress.interpolate({
    inputRange: [-60, 160],
    outputRange: [-60, 160],
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Luminous Light Full-Screen Background Gradient */}
      <LinearGradient
        colors={['#F5F7FF', '#FAECF5', '#E0F2FE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Luminous Soft Pastel Mesh Glows */}
      <View style={styles.glowTopLeft} pointerEvents="none" />
      <View style={styles.glowBottomRight} pointerEvents="none" />
      <View style={styles.glowCenter} pointerEvents="none" />

      {/* Connected Blueprint Constellation Particles */}
      <View style={styles.blueprintContainer} pointerEvents="none">
        <View style={[styles.blueprintDot, { top: height * 0.15, left: width * 0.2 }]} />
        <View style={[styles.blueprintDot, { top: height * 0.25, right: width * 0.15 }]} />
        <View style={[styles.blueprintDot, { bottom: height * 0.3, left: width * 0.1 }]} />
        <View style={[styles.blueprintDot, { bottom: height * 0.2, right: width * 0.25 }]} />
      </View>

      {/* Main Content */}
      <Animated.View style={[styles.content, animatedContentStyle]}>
        {/* Logo Shield Wrapper */}
        <Animated.View style={[styles.logoOutlineOuter, animatedLogoStyle]}>
          <View style={styles.logoRingGlow} />
          <View style={styles.logoGlassShield}>
            {/* Luminous Inner Glass Gradient */}
            <LinearGradient
              colors={['#ffffff', 'rgba(255, 255, 255, 0.45)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Split Top Glass reflection sheen */}
            <View style={styles.logoGlassSheen} />
            
            {/* Logo Icon */}
            <MaterialIcons name="auto-stories" size={44} color="#0052cc" />
          </View>
        </Animated.View>

        {/* Premium Title Stack */}
        <Text style={styles.title}>Teacher Hub</Text>
        <Text style={styles.subtitle}>
          Empowering education, simplifying management.
        </Text>
      </Animated.View>

      {/* Loading area with futuristic progress sweep */}
      <Animated.View style={[styles.loadingArea, animatedContentStyle]}>
        <View style={styles.loaderBarTrack}>
          <Animated.View 
            style={[
              styles.loaderBarProgress, 
              { transform: [{ translateX: loaderTranslateX }] }
            ]} 
          />
        </View>
        <Text style={styles.loadingText}>Initializing workspace</Text>
      </Animated.View>

      {/* Footer Version Details */}
      <Text style={styles.version}>v2.5.0</Text>
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
  },
  // Soft, bright luminous glows
  glowTopLeft: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(6, 182, 212, 0.22)',
    opacity: 0.7,
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -150,
    right: -150,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(244, 63, 94, 0.16)',
    opacity: 0.6,
  },
  glowCenter: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    opacity: 0.5,
  },
  // Constellation guidelines
  blueprintContainer: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  blueprintDot: {
    position: 'absolute',
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#0052cc',
    opacity: 0.15,
  },
  // Content Stack
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // Glassmorphic Logo Shield
  logoOutlineOuter: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  logoRingGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    zIndex: -1,
  },
  logoGlassShield: {
    width: 96,
    height: 96,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  logoGlassSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0a0f2d',
    letterSpacing: -0.8,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  // Loading Area & Custom Progress Sweep
  loadingArea: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loaderBarTrack: {
    width: 140,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    overflow: 'hidden',
    marginBottom: 14,
  },
  loaderBarProgress: {
    width: 60,
    height: '100%',
    borderRadius: 1.5,
    backgroundColor: '#0052cc',
    position: 'absolute',
  },
  loadingText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    opacity: 0.9,
  },
  version: {
    position: 'absolute',
    bottom: 16,
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
  },
});
