import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme, ThemeMode } from '../../context/ThemeContext';

interface ThemeOption {
  id: ThemeMode;
  name: string;
  tagline: string;
  colors: string[];
  isDark: boolean;
  icon: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    name: 'Classic Blue (Default)',
    tagline: 'Original royal blue with crisp clean background',
    colors: ['#0052CC', '#0A1F5C', '#2563EB', '#EEF2FF'],
    isDark: false,
    icon: 'wb-sunny',
  },
  {
    id: 'dark',
    name: 'Midnight Dark (Pro)',
    tagline: 'Deep obsidian slate with luminous sky blue (Ultra Eye-Friendly)',
    colors: ['#0B0F19', '#141D2F', '#38BDF8', '#818CF8'],
    isDark: true,
    icon: 'dark-mode',
  },
  {
    id: 'midnight',
    name: 'Cyber Violet (Pro)',
    tagline: 'Deep velvet violet with neon ultraviolet accents (Eye-Comfort)',
    colors: ['#090714', '#171230', '#A78BFA', '#C084FC'],
    isDark: true,
    icon: 'auto-awesome',
  },
  {
    id: 'ocean',
    name: 'Ocean Azure',
    tagline: 'Deep navy and refreshing cyan tones',
    colors: ['#0C4A6E', '#0284C7', '#06B6D4', '#E0F2FE'],
    isDark: false,
    icon: 'water',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    tagline: 'Calming mint green and jade accents',
    colors: ['#064E3B', '#059669', '#10B981', '#ECFDF5'],
    isDark: false,
    icon: 'forest',
  },
  {
    id: 'sunset',
    name: 'Sunset Warmth',
    tagline: 'Vibrant coral, amber and peach hues',
    colors: ['#7C2D12', '#EA580C', '#F97316', '#FFF7ED'],
    isDark: false,
    icon: 'wb-twilight',
  },
];

interface ThemeSettingsProps {
  navigation?: any;
}

export const ThemeSettingsScreen: React.FC<ThemeSettingsProps> = ({ navigation }) => {
  const { themeMode, theme, highContrast, backgroundStyle, setThemeMode, setHighContrast, setBackgroundStyle } = useAppTheme();
  const [showAppliedToast, setShowAppliedToast] = useState(false);

  const handleSelectTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    setShowAppliedToast(true);
    setTimeout(() => setShowAppliedToast(false), 2000);
  };

  return (
    <View style={[styles.screenWrapper, { backgroundColor: theme.bg }]}>
      <SafeAreaView style={styles.screenSafeArea} edges={['top']}>
        {/* Header Bar */}
        <View style={[styles.screenHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: theme.surfaceVariant }]}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color={theme.textPrimary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.screenHeaderTitle, { color: theme.textPrimary }]}>Theme & Appearance</Text>
            <Text style={[styles.screenHeaderSub, { color: theme.textMuted }]}>Personalize colors, dark mode & layout</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* ─── 1. Live Interactive Preview Card ─── */}
          <View style={styles.previewContainer}>
            <View style={styles.previewHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MaterialIcons name="preview" size={18} color={theme.primary} />
                <Text style={[styles.previewSectionTitle, { color: theme.textPrimary }]}>Live Theme Preview</Text>
              </View>
              <View style={[styles.activeThemeBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.activeThemeBadgeText, { color: theme.primary }]}>{theme.name}</Text>
              </View>
            </View>

            <View style={[styles.mockPhoneCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              {/* Mock Banner Header */}
              <LinearGradient
                colors={theme.bannerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mockBanner}
              >
                <View style={styles.mockBannerRow}>
                  <View style={styles.mockAvatar}>
                    <Text style={styles.mockAvatarText}>S</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.mockTeacherName}>Miss Suman Iqbal</Text>
                    <Text style={styles.mockTeacherRole}>Senior Primary Teacher</Text>
                  </View>
                  <View style={styles.mockLivePill}>
                    <View style={styles.mockLiveDot} />
                    <Text style={styles.mockLiveText}>ACTIVE</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Mock Action & Stat Chips */}
              <View style={styles.mockWidgetsRow}>
                <View style={[styles.mockWidgetCard, { backgroundColor: theme.surfaceVariant, borderColor: theme.border }]}>
                  <MaterialIcons name="verified" size={16} color={theme.primary} />
                  <Text style={[styles.mockWidgetVal, { color: theme.textPrimary }]}>94%</Text>
                  <Text style={[styles.mockWidgetLabel, { color: theme.textMuted }]}>Attendance</Text>
                </View>

                <View style={[styles.mockWidgetCard, { backgroundColor: theme.surfaceVariant, borderColor: theme.border }]}>
                  <MaterialIcons name="school" size={16} color={theme.accent} />
                  <Text style={[styles.mockWidgetVal, { color: theme.textPrimary }]}>31</Text>
                  <Text style={[styles.mockWidgetLabel, { color: theme.textMuted }]}>Students</Text>
                </View>

                <View style={[styles.mockWidgetCard, { backgroundColor: theme.surfaceVariant, borderColor: theme.border }]}>
                  <MaterialIcons name="grade" size={16} color={theme.warning} />
                  <Text style={[styles.mockWidgetVal, { color: theme.textPrimary }]}>A+</Text>
                  <Text style={[styles.mockWidgetLabel, { color: theme.textMuted }]}>Grade</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ─── 2. Choose Theme Preset ─── */}
          <View style={styles.sectionWrap}>
            <View style={styles.sectionHeaderRow}>
              <MaterialIcons name="palette" size={18} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Select Color Palette</Text>
            </View>

            <View style={styles.themeGrid}>
              {THEME_OPTIONS.map((opt) => {
                const isSelected = themeMode === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.themeCard,
                      { backgroundColor: theme.surface, borderColor: isSelected ? theme.primary : theme.border },
                      isSelected && styles.themeCardSelected,
                    ]}
                    onPress={() => handleSelectTheme(opt.id)}
                    activeOpacity={0.8}
                  >
                    {/* Top Row: Icon + Selection Radio */}
                    <View style={styles.themeCardTop}>
                      <View style={[styles.themeIconCircle, { backgroundColor: opt.colors[2] || '#EEF2FF' }]}>
                        <MaterialIcons name={opt.icon as any} size={18} color={opt.colors[0]} />
                      </View>
                      <View style={[styles.radioCircle, isSelected && { borderColor: theme.primary, backgroundColor: theme.primary }]}>
                        {isSelected && <MaterialIcons name="check" size={12} color="#ffffff" />}
                      </View>
                    </View>

                    {/* Palette Swatches Bar */}
                    <View style={styles.swatchBar}>
                      {opt.colors.map((c, i) => (
                        <View key={i} style={[styles.swatchDot, { backgroundColor: c }]} />
                      ))}
                    </View>

                    {/* Details */}
                    <Text style={[styles.themeName, { color: theme.textPrimary }]}>{opt.name}</Text>
                    <Text style={[styles.themeTagline, { color: theme.textMuted }]} numberOfLines={2}>
                      {opt.tagline}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ─── 3. Accessibility & Senior Teacher Mode ─── */}
          <View style={[styles.settingsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.settingRow}>
              <View style={[styles.settingIconBox, { backgroundColor: theme.primaryLight }]}>
                <MaterialIcons name="contrast" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>High Contrast Mode</Text>
                <Text style={[styles.settingSub, { color: theme.textMuted }]}>
                  Extra sharp borders and bold text for elder teachers
                </Text>
              </View>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                trackColor={{ false: '#CBD5E1', true: theme.primary }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={[styles.settingDivider, { backgroundColor: theme.border }]} />

            {/* Background Style Switcher */}
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={[styles.settingIconBox, { backgroundColor: theme.primaryLight }]}>
                  <MaterialIcons name="texture" size={20} color={theme.primary} />
                </View>
                <View>
                  <Text style={[styles.settingTitle, { color: theme.textPrimary }]}>Background Texture</Text>
                  <Text style={[styles.settingSub, { color: theme.textMuted }]}>Choose canvas surface design</Text>
                </View>
              </View>

              <View style={[styles.stylePillRow, { backgroundColor: theme.surfaceVariant }]}>
                {(['clean', 'gradient', 'glass'] as const).map((st) => {
                  const isCur = backgroundStyle === st;
                  const labels = { clean: 'Clean Solid', gradient: 'Mesh Glow', glass: 'Frosted Glass' };
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[styles.stylePillBtn, isCur && { backgroundColor: theme.primary }]}
                      onPress={() => setBackgroundStyle(st)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.stylePillText, isCur ? { color: '#ffffff' } : { color: theme.textMuted }]}>
                        {labels[st]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Applied Success Pill Toast */}
          {showAppliedToast && (
            <View style={styles.toastCard}>
              <MaterialIcons name="check-circle" size={18} color="#059669" />
              <Text style={styles.toastText}>Theme Applied Successfully!</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    width: '100%',
  },
  screenSafeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  screenHeaderSub: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  /* Preview Card */
  previewContainer: {
    gap: 8,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  previewSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  activeThemeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeThemeBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  mockPhoneCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  mockBanner: {
    borderRadius: 14,
    padding: 12,
  },
  mockBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mockAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockAvatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
  },
  mockTeacherName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },
  mockTeacherRole: {
    fontSize: 10.5,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  mockLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  mockLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  mockLiveText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#ffffff',
  },
  mockWidgetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mockWidgetCard: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 8,
    alignItems: 'center',
  },
  mockWidgetVal: {
    fontSize: 13.5,
    fontWeight: '900',
    marginTop: 2,
  },
  mockWidgetLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },

  /* Theme Grid */
  sectionWrap: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeCard: {
    width: '48.5%',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  themeCardSelected: {
    borderWidth: 2,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  themeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  themeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchBar: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  swatchDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  themeName: {
    fontSize: 13,
    fontWeight: '800',
  },
  themeTagline: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 14,
  },

  /* Settings Card */
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1.2,
    padding: 14,
    gap: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  settingSub: {
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 1,
  },
  settingDivider: {
    height: 1,
  },
  stylePillRow: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    gap: 4,
  },
  stylePillBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stylePillText: {
    fontSize: 11,
    fontWeight: '800',
  },

  /* Toast */
  toastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'center',
  },
  toastText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
});

export default ThemeSettingsScreen;
