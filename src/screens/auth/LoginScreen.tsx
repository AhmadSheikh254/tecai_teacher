import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { StatusBar } from 'expo-status-bar';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigation.replace('Main');
  };

  return (
    <LinearGradient
      colors={['#F8FAFC', '#EEF2FF', '#E0E7FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBg}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        
        {/* Glow backdrop shapes */}
        <View style={styles.glowCircle1} />
        <View style={styles.glowCircle2} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            
            {/* Header (Top brand) */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <MaterialIcons name="school" size={26} color="#ffffff" />
              </View>
              <Text style={styles.headerTitle}>Teacher Hub</Text>
            </View>

            {/* Form Card Container */}
            <View style={styles.card}>
              <View style={styles.titleContainer}>
                <Text style={styles.welcomeTitle}>Welcome back</Text>
                <Text style={styles.welcomeSubtitle}>Please enter your details to sign in.</Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email/Employee ID</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="person" size={20} color="#003d9b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email or ID"
                    placeholderTextColor="#94A3B8"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <MaterialIcons name="lock" size={20} color="#003d9b" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingRight: 40 }]}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
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
                      size={20} 
                      color="#94A3B8" 
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
                    rememberMe && styles.checkboxChecked
                  ]}>
                    {rememberMe && <MaterialIcons name="check" size={12} color="#ffffff" />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.submitBtnContainer}
                onPress={handleLogin}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#003d9b', '#0052cc']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Sign In</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#ffffff" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
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
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  glowCircle1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#3B82F6',
    opacity: 0.15,
  },
  glowCircle2: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#818CF8',
    opacity: 0.12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 36,
    gap: 14,
  },
  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#003d9b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003d9b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#003d9b',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#003d9b',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  titleContainer: {
    marginBottom: 26,
    gap: 6,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0A1F5C',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
    gap: 8,
  },
  label: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0A1F5C',
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 16,
    position: 'relative',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  visibilityIcon: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 26,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.8,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#003d9b',
    borderColor: '#003d9b',
  },
  rememberMeText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#475569',
  },
  forgotPasswordText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#003d9b',
  },
  submitBtnContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#003d9b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  submitButton: {
    flexDirection: 'row',
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});
