import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';

interface CBTSHubScreenProps {
  navigation: any;
}

export const CBTSHubScreen: React.FC<CBTSHubScreenProps> = ({ navigation }) => {
  const { theme: appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';
  
  const recentAssessments = [
    {
      id: '1',
      title: 'Midterm: Advanced Physics',
      details: 'Completed yesterday • 32 Students',
      icon: 'quiz',
    },
    {
      id: '2',
      title: 'Quiz 3: Chemical Equations',
      details: 'Scheduled for Aug 12 • 45 Students',
      icon: 'assignment',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: appTheme.bg }]} edges={['top']}>
      {/* TopAppBar */}
      <View style={[styles.appBar, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderBottomColor: appTheme.border }]}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3_lrwcrxr8nOo2F32v2Q1Wtd9tiSCvUTb6aW89U5lNdNhBRis3CBGEYDpd139HstNbV99wMZfSgoHkuFo8kkwgyOA_K0cgUqNsaVcx5c9kWfI4T5h2lGq0yvqAnQtAnAr-TJpWhYUb9bmUf7SRcoVyqOnzePhIR_JwILYOj7_qr9NgNGw-UVW_d541_T7hc-F8KxZ7YLGekDdowSIT2q5A3eIZuHWD6_qAaHFvpgem0CtntUJSywG5A' }}
            style={[styles.profilePic, !isDefaultTheme && { borderColor: appTheme.border }]}
          />
          <Text style={[styles.headerTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Teacher Hub</Text>
        </View>
        <TouchableOpacity style={[styles.notificationButton, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
          <MaterialIcons name="notifications" size={24} color={isDefaultTheme ? theme.colors.primary : appTheme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.introContainer}>
          <Text style={[styles.introTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Computer Based Testing System</Text>
          <Text style={[styles.introSubtitle, !isDefaultTheme && { color: appTheme.textSecondary }]}>Manage and create robust assessments for your students.</Text>
        </View>

        {/* Big Actions */}
        <View style={styles.gridContainer}>
          {/* Question Bank */}
          <TouchableOpacity 
            style={[styles.bigCard, theme.shadows.level1, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('QuestionBank')}
          >
            <View style={styles.bigCardHeader}>
              <View style={[styles.iconContainer, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                <MaterialIcons name="storage" size={24} color={isDefaultTheme ? theme.colors.primary : appTheme.primary} />
              </View>
              <MaterialIcons name="storage" size={96} color={isDefaultTheme ? "rgba(0, 82, 204, 0.05)" : "rgba(255, 255, 255, 0.04)"} style={styles.bgIcon} />
            </View>
            <Text style={[styles.cardTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Question Bank</Text>
            <Text style={[styles.cardDesc, !isDefaultTheme && { color: appTheme.textSecondary }]}>
              Create, organize, and review test items. Supports multiple choice, essay, and interactive formats.
            </Text>
            <View style={styles.actionRow}>
              <Text style={[styles.actionText, !isDefaultTheme && { color: appTheme.primary }]}>Manage Repository</Text>
              <MaterialIcons name="arrow-forward" size={16} color={isDefaultTheme ? theme.colors.primary : appTheme.primary} />
            </View>
          </TouchableOpacity>

          {/* Exam */}
          <TouchableOpacity 
            style={[styles.bigCard, theme.shadows.level1, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('CBTSExam')}
          >
            <View style={styles.bigCardHeader}>
              <View style={[styles.iconContainer, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                <MaterialIcons name="description" size={24} color={isDefaultTheme ? theme.colors.primary : appTheme.primary} />
              </View>
              <MaterialIcons name="description" size={96} color={isDefaultTheme ? "rgba(0, 82, 204, 0.05)" : "rgba(255, 255, 255, 0.04)"} style={styles.bgIcon} />
            </View>
            <Text style={[styles.cardTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Exam</Text>
            <Text style={[styles.cardDesc, !isDefaultTheme && { color: appTheme.textSecondary }]}>
              Assemble exams from the bank, set grading rules, schedule sessions, and monitor live tests.
            </Text>
            <View style={styles.actionRow}>
              <Text style={[styles.actionText, !isDefaultTheme && { color: appTheme.primary }]}>Launch & Monitor</Text>
              <MaterialIcons name="arrow-forward" size={16} color={isDefaultTheme ? theme.colors.primary : appTheme.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Assessments */}
        <View style={styles.recentContainer}>
          <Text style={[styles.recentTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Recent Assessments</Text>
          <View style={[styles.recentList, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
            {recentAssessments.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.recentItem, !isDefaultTheme && { borderBottomColor: appTheme.border }]} activeOpacity={0.7}>
                <View style={[styles.recentIconWrapper, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                  <MaterialIcons name={item.icon as any} size={20} color={isDefaultTheme ? theme.colors.secondary : appTheme.accent} />
                </View>
                <View style={styles.recentTextWrapper}>
                  <Text style={[styles.recentItemTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>{item.title}</Text>
                  <Text style={[styles.recentItemDesc, !isDefaultTheme && { color: appTheme.textSecondary }]}>{item.details}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={isDefaultTheme ? theme.colors.outlineVariant : appTheme.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  appBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.containerMargin,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  headerTitle: {
    fontSize: theme.typography.headlineLgMobile.fontSize,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: theme.spacing.containerMargin,
    paddingBottom: 110,
    gap: theme.spacing.xl,
  },
  introContainer: {
    marginTop: theme.spacing.xs,
  },
  introTitle: {
    fontSize: theme.typography.headlineMd.fontSize,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  introSubtitle: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurfaceVariant,
  },
  gridContainer: {
    gap: theme.spacing.md,
  },
  bigCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainer,
    minHeight: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  bigCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.rounded.md,
    backgroundColor: theme.colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgIcon: {
    position: 'absolute',
    right: -24,
    top: -24,
    opacity: 0.8,
  },
  cardTitle: {
    fontSize: theme.typography.headlineMd.fontSize,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  cardDesc: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
  },
  actionText: {
    color: theme.colors.primary,
    fontSize: theme.typography.labelMd.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  recentContainer: {
    gap: theme.spacing.md,
  },
  recentTitle: {
    fontSize: theme.typography.headlineMd.fontSize,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  recentList: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.xl,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainer,
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainer,
  },
  recentIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  recentTextWrapper: {
    flex: 1,
  },
  recentItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  recentItemDesc: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
});
