import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  useWindowDimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const TimeTableScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Active Day selector (Monday by default)
  const [activeDay, setActiveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

  // Timetable schedule matching desktop fields (Only English subject by Suman Iqbal)
  const timetableSchedule = {
    Monday: [
      { id: 'm1', timeSlot: '10:12 AM-10:12 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-I - A', color: '#0052cc', bg: 'rgba(0, 82, 204, 0.05)' },
      { id: 'm2', timeSlot: '11:00 AM-11:45 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-II - A', color: '#00bcd4', bg: 'rgba(0, 188, 210, 0.05)' },
      { id: 'm3', timeSlot: '12:30 PM-01:15 PM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-V - B', color: '#4caf50', bg: 'rgba(76, 175, 80, 0.05)' },
    ],
    Tuesday: [
      { id: 't1', timeSlot: '09:15 AM-10:00 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-III - A', color: '#9c27b0', bg: 'rgba(156, 39, 176, 0.05)' },
      { id: 't2', timeSlot: '10:15 AM-11:00 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-I - A', color: '#0052cc', bg: 'rgba(0, 82, 204, 0.05)' },
    ],
    Wednesday: [
      { id: 'w1', timeSlot: '10:00 AM-10:45 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-I - A', color: '#0052cc', bg: 'rgba(0, 82, 204, 0.05)' },
      { id: 'w2', timeSlot: '11:30 AM-12:15 PM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-IV - B', color: '#e91e63', bg: 'rgba(233, 30, 99, 0.05)' },
    ],
    Thursday: [
      { id: 'th1', timeSlot: '10:12 AM-10:12 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-I - A', color: '#0052cc', bg: 'rgba(0, 82, 204, 0.05)' },
      { id: 'th2', timeSlot: '11:30 AM-12:15 PM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-II - B', color: '#ff9800', bg: 'rgba(255, 152, 0, 0.05)' },
    ],
    Friday: [
      { id: 'f1', timeSlot: '09:00 AM-09:45 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-III - C', color: '#9c27b0', bg: 'rgba(156, 39, 176, 0.05)' },
      { id: 'f2', timeSlot: '10:00 AM-10:45 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'Grade-I - A', color: '#0052cc', bg: 'rgba(0, 82, 204, 0.05)' },
    ]
  };

  const activeLectures = timetableSchedule[activeDay];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Time Table</Text>
        </View>
        <TouchableOpacity style={styles.printHeaderBtn} onPress={() => alert('Sending schedule to print service...')}>
          <MaterialIcons name="print" size={18} color={theme.colors.primary} style={{ marginRight: 4 }} />
          <Text style={styles.printBtnText}>Print</Text>
        </TouchableOpacity>
      </View>

      {/* Day Selector Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {daysList.map((day) => {
            const isSelected = activeDay === day;
            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayTabButton,
                  isSelected && styles.dayTabButtonActive,
                  theme.shadows.level1
                ]}
                onPress={() => setActiveDay(day)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayTabText, isSelected && styles.dayTabTextActive]}>
                  {day}
                </Text>
                {isSelected && <View style={styles.activeDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Timetable Header Card */}
        <View style={[styles.infoBanner, theme.shadows.level1]}>
          <View style={styles.infoBannerText}>
            <Text style={styles.infoBannerTitle}>{activeDay} Schedule</Text>
            <Text style={styles.infoBannerDesc}>
              You have {activeLectures.length} active classes scheduled for {activeDay}.
            </Text>
          </View>
          <MaterialIcons name="calendar-today" size={32} color="rgba(0, 82, 204, 0.15)" />
        </View>

        {/* Timeline Schedule list */}
        <View style={styles.timelineContainer}>
          {/* Vertical axis line */}
          <View style={styles.timelineAxis} />

          {activeLectures.map((lecture, index) => (
            <View key={lecture.id} style={styles.timelineItemRow}>
              
              {/* Timeline Indicator dot */}
              <View style={styles.markerContainer}>
                <View style={[styles.outerMarkerCircle, { borderColor: lecture.color }]}>
                  <View style={[styles.innerMarkerDot, { backgroundColor: lecture.color }]} />
                </View>
              </View>

              {/* Lecture detail Card */}
              <View style={[styles.lectureCard, { borderLeftColor: lecture.color }, theme.shadows.level1]}>
                
                {/* Time slot row */}
                <View style={styles.timeSlotRow}>
                  <View style={styles.timeSlotBadge}>
                    <MaterialIcons name="schedule" size={12} color={lecture.color} style={{ marginRight: 4 }} />
                    <Text style={[styles.timeSlotText, { color: lecture.color }]}>{lecture.timeSlot}</Text>
                  </View>
                  <View style={styles.classBadge}>
                    <Text style={styles.classBadgeText}>{lecture.classSection}</Text>
                  </View>
                </View>

                {/* Subject & Teacher */}
                <View style={styles.subjectBlock}>
                  <Text style={styles.subjectText}>{lecture.subject}</Text>
                  <View style={styles.teacherRow}>
                    <MaterialIcons name="person" size={14} color={theme.colors.outline} style={{ marginRight: 4 }} />
                    <Text style={styles.teacherText}>{lecture.teacher}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
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
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.headlineLgMobile.fontSize,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  printHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  printBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Horizontal Day Selector
  tabsContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
  },
  tabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayTabButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.rounded.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 84,
  },
  dayTabButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  dayTabTextActive: {
    color: '#fff',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginTop: 2,
  },

  // Main Scroll content
  scrollContent: {
    padding: theme.spacing.containerMargin,
    paddingBottom: 110,
    gap: 18,
  },

  // Info Banner card
  infoBanner: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.xl,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    borderColor: 'rgba(0, 82, 204, 0.08)',
  },
  infoBannerText: {
    flex: 1,
    gap: 2,
  },
  infoBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  infoBannerDesc: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },

  // Timeline Schedule Layout
  timelineContainer: {
    position: 'relative',
    paddingLeft: 12,
  },
  timelineAxis: {
    position: 'absolute',
    left: 20,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: 'rgba(0, 82, 204, 0.1)',
  },
  timelineItemRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  markerContainer: {
    width: 20,
    alignItems: 'center',
    marginRight: 12,
    marginTop: 18,
  },
  outerMarkerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerMarkerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Lecture card styling
  lectureCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.lg,
    padding: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: 'rgba(0, 82, 204, 0.05)',
    gap: 10,
  },
  timeSlotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSlotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  timeSlotText: {
    fontSize: 10,
    fontWeight: '800',
  },
  classBadge: {
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  classBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  subjectBlock: {
    gap: 4,
  },
  subjectText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherText: {
    fontSize: 11,
    color: theme.colors.outline,
    fontWeight: '600',
  },
});
