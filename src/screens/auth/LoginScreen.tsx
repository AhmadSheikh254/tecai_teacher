import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '../../context/ThemeContext';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';

      return () => {
        document.body.style.overflow = origBodyOverflow;
        document.body.style.position = origBodyPos;
        document.body.style.height = origBodyHeight;
        document.documentElement.style.overflow = origDocOverflow;
      };
    }
  }, []);

  const handleLogin = () => {
    navigation.replace('Main');
  };

  return (
    <LinearGradient
      colors={isDefaultTheme ? ['#F8FAFC', '#EEF2FF', '#E0E7FF'] : [appTheme.bg, appTheme.surface, appTheme.bg]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBg}
    >
      <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: 'transparent' }]}>
        <StatusBar style={appTheme.isDark ? 'light' : 'dark'} />
        
        {/* Glow backdrop shapes */}
        <View style={[styles.glowCircle1, !isDefaultTheme && { backgroundColor: appTheme.primary, opacity: 0.15 }]} />
        <View style={[styles.glowCircle2, !isDefaultTheme && { backgroundColor: appTheme.accent || appTheme.primary, opacity: 0.12 }]} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.fixedContentContainer}>
            
            {/* Header (Top brand) */}
            <View style={styles.header}>
              <View style={[styles.logoContainer, !isDefaultTheme && { backgroundColor: appTheme.primary, shadowColor: appTheme.primary }]}>
                <MaterialIcons name="school" size={22} color="#ffffff" />
              </View>
              <Text style={[styles.headerTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Teacher Hub</Text>
            </View>

            {/* Form Card Container */}
            <View style={[styles.card, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border, shadowColor: appTheme.primary }]}>
              <View style={styles.titleContainer}>
                <Text style={[styles.welcomeTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Sign In</Text>
              </View>

              {/* Identification ID Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, !isDefaultTheme && { color: appTheme.textSecondary }]}>Identification ID</Text>
                <View style={[styles.inputWrapper, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                  <MaterialIcons name="person" size={18} color={isDefaultTheme ? '#0284C7' : appTheme.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, !isDefaultTheme && { color: appTheme.textPrimary }]}
                    placeholder="Enter your Identification ID"
                    placeholderTextColor={isDefaultTheme ? '#94A3B8' : appTheme.textMuted}
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, !isDefaultTheme && { color: appTheme.textSecondary }]}>Password</Text>
                <View style={[styles.inputWrapper, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                  <MaterialIcons name="lock" size={18} color={isDefaultTheme ? '#0284C7' : appTheme.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingRight: 36 }, !isDefaultTheme && { color: appTheme.textPrimary }]}
                    placeholder="••••••••"
                    placeholderTextColor={isDefaultTheme ? '#94A3B8' : appTheme.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    style={styles.visibilityIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons 
                      name={showPassword ? "visibility" : "visibility-off"} 
                      size={18} 
                      color={isDefaultTheme ? '#94A3B8' : appTheme.textMuted} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Actions Row */}
              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox, 
                    !isDefaultTheme && { borderColor: appTheme.border, backgroundColor: appTheme.surface },
                    rememberMe && styles.checkboxChecked,
                    rememberMe && !isDefaultTheme && { backgroundColor: appTheme.primary, borderColor: appTheme.primary }
                  ]}>
                    {rememberMe && <MaterialIcons name="check" size={10} color="#ffffff" />}
                  </View>
                  <Text style={[styles.rememberMeText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Remember me</Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={[styles.submitBtnContainer, !isDefaultTheme && { shadowColor: appTheme.primary }]}
                onPress={handleLogin}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={isDefaultTheme ? ['#0284C7', '#0369A1'] : appTheme.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Sign In</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#ffffff" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    height: '100%',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  keyboardView: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fixedContentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  glowCircle1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#3B82F6',
    opacity: 0.12,
  },
  glowCircle2: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#818CF8',
    opacity: 0.1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    gap: 8,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  titleContainer: {
    marginBottom: 12,
    gap: 2,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 10,
    gap: 4,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#334155',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    height: 38,
    paddingHorizontal: 10,
    position: 'relative',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 12.5,
    fontWeight: '700',
  },
  visibilityIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 14,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  rememberMeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  forgotPasswordText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0284C7',
  },
  submitBtnContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButton: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  buttonIcon: {
    marginLeft: 2,
  },
});
