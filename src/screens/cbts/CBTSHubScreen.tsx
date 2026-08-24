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

interface CBTSHubScreenProps {
  navigation: any;
}

export const CBTSHubScreen: React.FC<CBTSHubScreenProps> = ({ navigation }) => {
  
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* TopAppBar */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3_lrwcrxr8nOo2F32v2Q1Wtd9tiSCvUTb6aW89U5lNdNhBRis3CBGEYDpd139HstNbV99wMZfSgoHkuFo8kkwgyOA_K0cgUqNsaVcx5c9kWfI4T5h2lGq0yvqAnQtAnAr-TJpWhYUb9bmUf7SRcoVyqOnzePhIR_JwILYOj7_qr9NgNGw-UVW_d541_T7hc-F8KxZ7YLGekDdowSIT2q5A3eIZuHWD6_qAaHFvpgem0CtntUJSywG5A' }}
            style={styles.profilePic}
          />
          <Text style={styles.headerTitle}>Teacher Hub</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={styles.introContainer}>
          <Text style={styles.introTitle}>Computer Based Testing System</Text>
          <Text style={styles.introSubtitle}>Manage and create robust assessments for your students.</Text>
        </View>

        {/* Big Actions */}
        <View style={styles.gridContainer}>
          {/* Question Bank */}
          <TouchableOpacity 
            style={[styles.bigCard, theme.shadows.level1]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('QuestionBank')}
          >
            <View style={styles.bigCardHeader}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="storage" size={24} color={theme.colors.primary} />
              </View>
              <MaterialIcons name="storage" size={96} color="rgba(0, 82, 204, 0.05)" style={styles.bgIcon} />
            </View>
            <Text style={styles.cardTitle}>Question Bank</Text>
            <Text style={styles.cardDesc}>
              Create, organize, and review test items. Supports multiple choice, essay, and interactive formats.
            </Text>
            <View style={styles.actionRow}>
              <Text style={styles.actionText}>Manage Repository</Text>
              <MaterialIcons name="arrow-forward" size={16} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Exam */}
          <TouchableOpacity 
            style={[styles.bigCard, theme.shadows.level1]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('CBTSExam')}
          >
            <View style={styles.bigCardHeader}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="description" size={24} color={theme.colors.primary} />
              </View>
              <MaterialIcons name="description" size={96} color="rgba(0, 82, 204, 0.05)" style={styles.bgIcon} />
            </View>
            <Text style={styles.cardTitle}>Exam</Text>
            <Text style={styles.cardDesc}>
              Assemble exams from the bank, set grading rules, schedule sessions, and monitor live tests.
            </Text>
            <View style={styles.actionRow}>
              <Text style={styles.actionText}>Launch & Monitor</Text>
              <MaterialIcons name="arrow-forward" size={16} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Assessments */}
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>Recent Assessments</Text>
          <View style={styles.recentList}>
            {recentAssessments.map((item) => (
              <TouchableOpacity key={item.id} style={styles.recentItem} activeOpacity={0.7}>
                <View style={styles.recentIconWrapper}>
                  <MaterialIcons name={item.icon as any} size={20} color={theme.colors.secondary} />
                </View>
                <View style={styles.recentTextWrapper}>
                  <Text style={styles.recentItemTitle}>{item.title}</Text>
                  <Text style={styles.recentItemDesc}>{item.details}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.outlineVariant} />
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
