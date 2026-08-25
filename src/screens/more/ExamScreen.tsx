import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  useWindowDimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

type ExamSubModule = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badge: string;
  gradient: [string, string];
  cardBgColors: [string, string];
  accentColor: string;
  targetKey: string;
};

export const ExamScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Search & Selected Submodule States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubModule, setActiveSubModule] = useState<ExamSubModule | null>(null);

  // 6 Advanced 3D Exam Management Sub-modules
  const subModules: ExamSubModule[] = [
    {
      id: 'schedule',
      title: 'Schedule',
      subtitle: 'Exam Dates & Timetables',
      description: 'View upcoming paper dates, hall numbers, shift timings & seating arrangements.',
      icon: 'event-note',
      badge: '12 Exams Scheduled',
      gradient: ['#0284C7', '#0369A1'],
      cardBgColors: ['#F0F9FF', '#E0F2FE'],
      accentColor: '#0284C7',
      targetKey: 'schedule'
    },
    {
      id: 'mark_attendance',
      title: 'Mark Attendance',
      subtitle: 'Hall & Seating Verification',
      description: 'Verify candidate roll numbers, invigilator sign-off & mark exam attendance.',
      icon: 'how-to-reg',
      badge: 'Hall 04 Active',
      gradient: ['#059669', '#047857'],
      cardBgColors: ['#F0FDF4', '#DCFCE7'],
      accentColor: '#059669',
      targetKey: 'mark_attendance'
    },
    {
      id: 'exam_marks',
      title: 'Exam Marks',
      subtitle: 'Student Marks Entry',
      description: 'Enter subject marks, practical scores, grace points & teacher evaluations.',
      icon: 'edit-note',
      badge: 'Marks Entry Open',
      gradient: ['#D97706', '#B45309'],
      cardBgColors: ['#FFFBEB', '#FEF3C7'],
      accentColor: '#D97706',
      targetKey: 'exam_marks'
    },
    {
      id: 'term_exam',
      title: 'Term Exam',
      subtitle: 'Midterm & Sessionals',
      description: 'Manage 1st & 2nd Term evaluation, internal assignments & sessional weightage.',
      icon: 'workspace-premium',
      badge: 'Term-1 Completed',
      gradient: ['#4F46E5', '#4338CA'],
      cardBgColors: ['#EEF2FF', '#E0E7FF'],
      accentColor: '#4F46E5',
      targetKey: 'term_exam'
    },
    {
      id: 'final_exam',
      title: 'Final Exam',
      subtitle: 'Annual Board Assessment',
      description: 'Final examination management, paper auditing & board result processing.',
      icon: 'school',
      badge: 'Final 2026',
      gradient: ['#E11D48', '#BE123C'],
      cardBgColors: ['#FFF1F2', '#FFE4E6'],
      accentColor: '#E11D48',
      targetKey: 'final_exam'
    },
    {
      id: 'report_card',
      title: 'Report Card',
      subtitle: 'Transcripts & Progress Cards',
      description: 'Generate digital report cards, CGPA certificates, position ranks & print PDFs.',
      icon: 'assessment',
      badge: 'PDF Generator Ready',
      gradient: ['#0D9488', '#0F766E'],
      cardBgColors: ['#F0FDFA', '#CCFBF1'],
      accentColor: '#0D9488',
      targetKey: 'report_card'
    }
  ];

  // Filter Modules by search query
  const filteredModules = subModules.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.root}>
      {/* ── CLEAN LIGHT OFF-WHITE BG WITH FAINT GLOW ── */}
      <LinearGradient
        colors={['#FAFAFA', '#F8FAFC', '#FFFFFF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Faint Ambient Background Orbs */}
      <View style={styles.orb1} pointerEvents="none" />
      <View style={styles.orb2} pointerEvents="none" />

      {/* Decorative SVG Wave Lines */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Circle cx="85%" cy="10%" r="160" fill="rgba(56, 189, 248, 0.06)" />
        <Circle cx="15%" cy="90%" r="190" fill="rgba(14, 165, 233, 0.04)" />
        <Path d="M-40,240 Q160,120 380,260 T820,220" fill="none" stroke="rgba(2,132,199,0.04)" strokeWidth={1.5} />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* App Bar Header */}
        <View style={styles.appBar}>
          <LinearGradient
            colors={['rgba(255,255,255,0.96)', 'rgba(248,250,252,0.90)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={26} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Exam Management</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="history-edu" size={28} color="#0284C7" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* EXAM OVERVIEW HERO BANNER */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#0284C7', '#0369A1']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Glass Sheen Overlay */}
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)']}
              start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />

            <View style={styles.heroHeaderRow}>
              <View style={styles.heroBadgeBox}>
                <MaterialIcons name="auto-awesome" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.heroBadgeText}>Examination Portal 2026</Text>
            </View>

            <Text style={styles.heroTitle}>Manage Examinations & Results</Text>
            <Text style={styles.heroSubtitle}>
              Select any sub-module below to manage schedules, student attendance, marks entry, term exams & report cards.
            </Text>

            {/* Quick Metrics Bar */}
            <View style={styles.heroMetricsGrid}>
              <View style={styles.heroMetricItem}>
                <Text style={styles.heroMetricValue}>6</Text>
                <Text style={styles.heroMetricLabel}>Sub-Modules</Text>
              </View>
              <View style={styles.heroMetricDivider} />
              <View style={styles.heroMetricItem}>
                <Text style={styles.heroMetricValue}>GRADE II-A</Text>
                <Text style={styles.heroMetricLabel}>Active Class</Text>
              </View>
              <View style={styles.heroMetricDivider} />
              <View style={styles.heroMetricItem}>
                <Text style={styles.heroMetricValue}>100%</Text>
                <Text style={styles.heroMetricLabel}>System Ready</Text>
              </View>
            </View>
          </View>

          {/* SEARCH BAR FOR SUB-MODULES */}
          <View style={styles.searchWrapper}>
            <MaterialIcons name="search" size={22} color="#0284C7" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exam sub-modules (Schedule, Marks, Cards)..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <MaterialIcons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>

          {/* 6 ADVANCED 3D PASTEL CARDS FOR EXAM SUB-MODULES */}
          <View style={styles.modulesGrid}>
            {filteredModules.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.moduleCard, 
                  { 
                    shadowColor: item.accentColor,
                    width: width >= 1024 ? '31.5%' : width >= 600 ? '48.5%' : '100%' 
                  }
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  if (item.id === 'schedule') {
                    navigation.navigate('ExamSchedule');
                  } else if (item.id === 'mark_attendance') {
                    navigation.navigate('ExamAttendance');
                  } else if (item.id === 'exam_marks') {
                    navigation.navigate('ExamMarks');
                  } else if (item.id === 'term_exam') {
                    navigation.navigate('ExamTermMark');
                  } else if (item.id === 'final_exam') {
                    navigation.navigate('ExamFinalMark');
                  } else if (item.id === 'report_card') {
                    navigation.navigate('ExamReport');
                  } else {
                    setActiveSubModule(item);
                  }
                }}
              >
                {/* 3D Pastel Gradient Background */}
                <LinearGradient
                  colors={item.cardBgColors}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                {/* Diagonal Glass Sheen Glare */}
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.85)', 'rgba(255, 255, 255, 0)']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                  pointerEvents="none"
                />

                {/* Left Colored Accent Bar */}
                <View style={[styles.moduleLeftStrip, { backgroundColor: item.accentColor }]} />

                {/* Watermark Background Icon Effect */}
                <View style={styles.watermarkIconBox} pointerEvents="none">
                  <MaterialIcons name={item.icon} size={84} color={`${item.accentColor}0D`} />
                </View>

                {/* Top Row: Double-Layered 3D Icon Tile + Status Badge */}
                <View style={styles.moduleTopRow}>
                  <View style={[styles.iconHaloRing, { borderColor: `${item.accentColor}35`, backgroundColor: `${item.accentColor}18` }]}>
                    <View style={[styles.iconTile, { shadowColor: item.accentColor }]}>
                      <LinearGradient
                        colors={item.gradient}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      {/* Top Glass Glare Overlay */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.55)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />
                      <MaterialIcons name={item.icon} size={24} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={[styles.badgePill, { backgroundColor: '#FFFFFF', borderColor: `${item.accentColor}35` }]}>
                    <View style={[styles.badgeDot, { backgroundColor: item.accentColor }]} />
                    <Text style={[styles.badgePillText, { color: item.accentColor }]}>{item.badge}</Text>
                  </View>
                </View>

                {/* Content Row: Title + Subtitle + 3D Halo Arrow Button */}
                <View style={styles.moduleContentRow}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.moduleTitle}>{item.title}</Text>
                    <Text style={styles.moduleSubtitle}>{item.subtitle}</Text>
                  </View>

                  <View style={[styles.arrowHaloContainer, { borderColor: `${item.accentColor}30` }]}>
                    <View style={[styles.arrowBtnPill, { shadowColor: item.accentColor }]}>
                      <LinearGradient
                        colors={item.gradient}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />
                      <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </ScrollView>

        {/* SUB-MODULE DETAIL MODAL PREVIEW */}
        <Modal
          visible={activeSubModule !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setActiveSubModule(null)}
        >
          <View style={styles.modalBackdrop}>
            {activeSubModule && (
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8FAFC']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.modalIconBox, { backgroundColor: `${activeSubModule.accentColor}18` }]}>
                      <MaterialIcons name={activeSubModule.icon} size={26} color={activeSubModule.accentColor} />
                    </View>
                    <View>
                      <Text style={styles.modalTitle}>{activeSubModule.title}</Text>
                      <Text style={styles.modalSubTitle}>{activeSubModule.subtitle}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setActiveSubModule(null)} style={styles.closeBtn}>
                    <MaterialIcons name="close" size={26} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  {/* Status Banner */}
                  <View style={[styles.modalStatusBox, { backgroundColor: `${activeSubModule.accentColor}12`, borderColor: `${activeSubModule.accentColor}30` }]}>
                    <MaterialIcons name="verified" size={20} color={activeSubModule.accentColor} />
                    <Text style={[styles.modalStatusText, { color: activeSubModule.accentColor }]}>
                      {activeSubModule.badge}
                    </Text>
                  </View>

                  <Text style={styles.sectionHeading}>Module Overview</Text>
                  <Text style={styles.modalDescText}>{activeSubModule.description}</Text>

                  <View style={styles.featureGrid}>
                    <View style={styles.featureItem}>
                      <MaterialIcons name="check-circle" size={18} color="#059669" />
                      <Text style={styles.featureItemText}>Real-Time Data Sync</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <MaterialIcons name="check-circle" size={18} color="#059669" />
                      <Text style={styles.featureItemText}>Export PDF & Excel Sheets</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <MaterialIcons name="check-circle" size={18} color="#059669" />
                      <Text style={styles.featureItemText}>Auto Grade Calculator</Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Modal Footer Action */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.launchBtn} 
                    onPress={() => {
                      alert(`Launching ${activeSubModule.title} Portal...`);
                      setActiveSubModule(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={activeSubModule.gradient}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <MaterialIcons name="launch" size={22} color="#FFFFFF" />
                    <Text style={styles.launchBtnText}>Launch {activeSubModule.title} Module</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },

  // Faint ambient background circles
  orb1: {
    position: 'absolute', top: -140, right: -120,
    width: 440, height: 440, borderRadius: 220,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -120,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },

  // App Bar Header
  appBar: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  appBarIconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 90,
    gap: 12,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },

  // Hero Card
  heroCard: {
    borderRadius: 16,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    gap: 6,
    elevation: 4,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroBadgeBox: {
    width: 18, height: 18,
    borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 14,
  },
  heroMetricsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 2,
  },
  heroMetricItem: {
    alignItems: 'center',
    gap: 1,
  },
  heroMetricValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  heroMetricLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 9.5,
    fontWeight: '800',
  },
  heroMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },

  // Search Input
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '800',
  },

  // 6 Advanced 3D Modules Grid
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    position: 'relative',
    overflow: 'hidden',
    gap: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  moduleLeftStrip: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  watermarkIconBox: {
    position: 'absolute',
    right: -12,
    bottom: -18,
  },
  moduleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconHaloRing: {
    padding: 2,
    borderRadius: 13,
    borderWidth: 1,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '900',
  },
  moduleContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 1,
  },
  moduleTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  moduleSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  arrowHaloContainer: {
    padding: 2,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  arrowBtnPill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.95)',
    elevation: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  modalIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  modalBody: {
    padding: 22,
  },
  modalStatusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  modalStatusText: {
    fontSize: 15,
    fontWeight: '900',
  },
  sectionHeading: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalDescText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#475569',
    lineHeight: 21,
    marginBottom: 16,
  },
  featureGrid: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureItemText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalFooter: {
    padding: 18,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
  },
  launchBtn: {
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  launchBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
