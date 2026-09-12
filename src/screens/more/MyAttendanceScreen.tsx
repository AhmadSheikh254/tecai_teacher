import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '../../context/ThemeContext';

export interface DayAttendance {
  day: number;
  dayName: string;
  dateStr: string;
  status: 'P' | 'L' | 'A' | '-';
  statusLabel: string;
  inTime: string;
  outTime: string;
  duration?: string;
  punchStatus?: string;
}

export interface MonthAttendanceData {
  month: string;
  year: number;
  teacherId: string;
  teacherName: string;
  designation: string;
  department: string;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  offCount: number;
  totalWorkingDays: number;
  attendancePercentage: string;
  days: DayAttendance[];
}

const ATTENDANCE_DATA_BY_MONTH: Record<string, MonthAttendanceData> = {
  'August 2026': {
    month: 'August',
    year: 2026,
    teacherId: '77',
    teacherName: 'Miss Suman',
    designation: 'Senior Primary Teacher',
    department: 'English & Computer Dept',
    presentCount: 16,
    lateCount: 5,
    absentCount: 1,
    offCount: 9,
    totalWorkingDays: 22,
    attendancePercentage: '72.73%',
    days: [
      { day: 1, dayName: 'Sat', dateStr: '01 Aug 2026', status: 'L', statusLabel: 'Late Entry', inTime: '08:14 AM', outTime: '02:20 PM', duration: '6h 06m', punchStatus: 'Late Entry (14m)' },
      { day: 2, dayName: 'Sun', dateStr: '02 Aug 2026', status: '-', statusLabel: 'Sunday Off', inTime: '--', outTime: '--', duration: '--', punchStatus: 'Sunday Off' },
      { day: 3, dayName: 'Mon', dateStr: '03 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:55 AM', outTime: '02:19 PM', duration: '6h 24m', punchStatus: 'On Time Present' },
      { day: 4, dayName: 'Tue', dateStr: '04 Aug 2026', status: '-', statusLabel: 'Gazetted Holiday', inTime: '--', outTime: '--', duration: '--', punchStatus: 'Official Holiday' },
      { day: 5, dayName: 'Wed', dateStr: '05 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:53 AM', outTime: '02:25 PM', duration: '6h 32m', punchStatus: 'On Time Present' },
      { day: 6, dayName: 'Thu', dateStr: '06 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:50 AM', outTime: '02:20 PM', duration: '6h 30m', punchStatus: 'On Time Present' },
      { day: 7, dayName: 'Fri', dateStr: '07 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:52 AM', outTime: '12:45 PM', duration: '4h 53m', punchStatus: 'Friday Half Day' },
      { day: 8, dayName: 'Sat', dateStr: '08 Aug 2026', status: 'L', statusLabel: 'Late Entry', inTime: '08:10 AM', outTime: '02:15 PM', duration: '6h 05m', punchStatus: 'Late Entry (10m)' },
      { day: 9, dayName: 'Sun', dateStr: '09 Aug 2026', status: '-', statusLabel: 'Sunday Off', inTime: '--', outTime: '--', duration: '--', punchStatus: 'Sunday Off' },
      { day: 10, dayName: 'Mon', dateStr: '10 Aug 2026', status: 'A', statusLabel: 'Absent', inTime: '--', outTime: '--', duration: '--', punchStatus: 'Absent (No Punch)' },
      { day: 11, dayName: 'Tue', dateStr: '11 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:54 AM', outTime: '02:20 PM', duration: '6h 26m', punchStatus: 'On Time Present' },
      { day: 12, dayName: 'Wed', dateStr: '12 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:51 AM', outTime: '02:22 PM', duration: '6h 31m', punchStatus: 'On Time Present' },
      { day: 13, dayName: 'Thu', dateStr: '13 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:55 AM', outTime: '02:20 PM', duration: '6h 25m', punchStatus: 'On Time Present' },
      { day: 14, dayName: 'Fri', dateStr: '14 Aug 2026', status: '-', statusLabel: 'Independence Day', inTime: '--', outTime: '--', duration: '--', punchStatus: 'National Holiday' },
      { day: 15, dayName: 'Sat', dateStr: '15 Aug 2026', status: 'L', statusLabel: 'Late Entry', inTime: '08:18 AM', outTime: '02:30 PM', duration: '6h 12m', punchStatus: 'Late Entry (18m)' },
      { day: 16, dayName: 'Sun', dateStr: '16 Aug 2026', status: '-', statusLabel: 'Sunday Off', inTime: '--', outTime: '--', duration: '--', punchStatus: 'Sunday Off' },
      { day: 17, dayName: 'Mon', dateStr: '17 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:48 AM', outTime: '02:20 PM', duration: '6h 32m', punchStatus: 'On Time Present' },
      { day: 18, dayName: 'Tue', dateStr: '18 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:50 AM', outTime: '02:25 PM', duration: '6h 35m', punchStatus: 'On Time Present' },
      { day: 19, dayName: 'Wed', dateStr: '19 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:56 AM', outTime: '02:20 PM', duration: '6h 24m', punchStatus: 'On Time Present' },
      { day: 20, dayName: 'Thu', dateStr: '20 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:52 AM', outTime: '02:18 PM', duration: '6h 26m', punchStatus: 'On Time Present' },
      { day: 21, dayName: 'Fri', dateStr: '21 Aug 2026', status: 'P', statusLabel: 'On Time', inTime: '07:49 AM', outTime: '12:50 PM', duration: '5h 01m', punchStatus: 'Friday Half Day' },
      { day: 22, dayName: 'Sat', dateStr: '22 Aug 2026', status: 'L', statusLabel: 'Late Entry', inTime: '08:08 AM', outTime: '02:22 PM', duration: '6h 14m', punchStatus: 'Late Entry (8m)' },
    ]
  },
  'September 2026': {
    month: 'September',
    year: 2026,
    teacherId: '77',
    teacherName: 'Miss Suman',
    designation: 'Senior Primary Teacher',
    department: 'English & Computer Dept',
    presentCount: 4,
    lateCount: 0,
    absentCount: 0,
    offCount: 1,
    totalWorkingDays: 5,
    attendancePercentage: '100.0%',
    days: [
      { day: 1, dayName: 'Tue', dateStr: '01 Sep 2026', status: 'P', statusLabel: 'On Time', inTime: '07:55 AM', outTime: '02:19 PM', duration: '6h 24m', punchStatus: 'On Time Present' },
      { day: 2, dayName: 'Wed', dateStr: '02 Sep 2026', status: 'P', statusLabel: 'On Time', inTime: '07:59 AM', outTime: '02:20 PM', duration: '6h 21m', punchStatus: 'On Time Present' },
      { day: 3, dayName: 'Thu', dateStr: '03 Sep 2026', status: '-', statusLabel: 'Holiday Off', inTime: '--', outTime: '--', duration: '--', punchStatus: 'Official Holiday' },
      { day: 4, dayName: 'Fri', dateStr: '04 Sep 2026', status: 'P', statusLabel: 'On Time', inTime: '07:56 AM', outTime: '12:53 PM', duration: '4h 57m', punchStatus: 'Friday Half Day' },
      { day: 5, dayName: 'Sat', dateStr: '05 Sep 2026', status: 'P', statusLabel: 'Present Today', inTime: '07:54 AM', outTime: '02:22 PM', duration: '6h 28m', punchStatus: 'Present Today' },
    ]
  }
};

const MONTH_KEYS = ['August 2026', 'September 2026'];

interface MyAttendanceProps {
  navigation?: any;
  embedded?: boolean;
}

export const MyAttendanceScreen: React.FC<MyAttendanceProps> = ({ navigation, embedded = false }) => {
  const { theme: appTheme } = useAppTheme();
  const [selectedMonth, setSelectedMonth] = useState<string>('August 2026');
  const [attendanceViewMode, setAttendanceViewMode] = useState<'dayWise' | 'monthWise'>('dayWise');
  const [selectedDay, setSelectedDay] = useState<number>(3); // Default Day 3

  const currentData = useMemo(() => {
    return ATTENDANCE_DATA_BY_MONTH[selectedMonth] || ATTENDANCE_DATA_BY_MONTH['August 2026'];
  }, [selectedMonth]);

  const selectedDayItem = useMemo(() => {
    return currentData.days.find(d => d.day === selectedDay) || currentData.days[0];
  }, [currentData, selectedDay]);

  const handleNextMonth = () => {
    const idx = MONTH_KEYS.indexOf(selectedMonth);
    if (idx < MONTH_KEYS.length - 1) {
      setSelectedMonth(MONTH_KEYS[idx + 1]);
    }
  };

  const handlePrevMonth = () => {
    const idx = MONTH_KEYS.indexOf(selectedMonth);
    if (idx > 0) {
      setSelectedMonth(MONTH_KEYS[idx - 1]);
    }
  };

  const getStatusColor = (status: 'P' | 'L' | 'A' | '-') => {
    switch (status) {
      case 'P': return { text: 'P', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Present' };
      case 'L': return { text: 'L', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Late' };
      case 'A': return { text: 'A', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Absent' };
      default: return { text: '-', color: '#64748B', bg: '#F1F5F9', border: '#E2E8F0', label: 'Off/Holiday' };
    }
  };

  const parsedPercentage = useMemo(() => {
    const num = parseFloat(currentData.attendancePercentage.replace('%', ''));
    return isNaN(num) ? 0 : Math.min(100, Math.max(0, num));
  }, [currentData]);

  const weeklyBreakdown = useMemo(() => {
    const days = currentData.days;
    const weeks: Array<{
      weekLabel: string;
      dateRange: string;
      present: number;
      late: number;
      absent: number;
      working: number;
      pct: number;
    }> = [];
    const chunkSize = 7;
    for (let i = 0; i < days.length; i += chunkSize) {
      const chunk = days.slice(i, i + chunkSize);
      const weekIdx = Math.floor(i / chunkSize) + 1;
      const working = chunk.filter(d => d.status !== '-').length;
      const present = chunk.filter(d => d.status === 'P').length;
      const late = chunk.filter(d => d.status === 'L').length;
      const absent = chunk.filter(d => d.status === 'A').length;
      const pct = working > 0 ? Math.min(100, Math.round(((present + late * 0.75) / working) * 100)) : 100;
      const firstDay = chunk[0].day;
      const lastDay = chunk[chunk.length - 1].day;
      weeks.push({
        weekLabel: `W${weekIdx}`,
        dateRange: `${firstDay}-${lastDay} ${currentData.month.slice(0, 3)}`,
        present,
        late,
        absent,
        working,
        pct,
      });
    }
    return weeks;
  }, [currentData]);

  // SVG Gauge calculations
  const ringRadius = 34;
  const ringStroke = 6.5;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (parsedPercentage / 100) * ringCircumference;

  const containerContent = (
    <View style={styles.mainContainer}>

      {/* ─── 1. Teacher Profile Banner ─── */}
      <View style={styles.bannerCard}>
        <LinearGradient
          colors={appTheme.bannerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerGradient}
        >
          {/* Top Info */}
          <View style={styles.bannerTopRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>S</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.teacherName} numberOfLines={1}>{currentData.teacherName}</Text>
                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>ID #{currentData.teacherId}</Text>
                </View>
              </View>
              <Text style={styles.teacherRole} numberOfLines={1}>{currentData.designation}</Text>
            </View>
          </View>

          {/* Month Switcher Navigator */}
          <View style={styles.monthNavRow}>
            <TouchableOpacity
              style={[styles.monthNavArrow, selectedMonth === MONTH_KEYS[0] && styles.arrowDisabled]}
              onPress={handlePrevMonth}
              disabled={selectedMonth === MONTH_KEYS[0]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="chevron-left" size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.monthTitleBox}>
              <MaterialIcons name="calendar-month" size={18} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.monthTitleText}>{selectedMonth}</Text>
            </View>

            <TouchableOpacity
              style={[styles.monthNavArrow, selectedMonth === MONTH_KEYS[MONTH_KEYS.length - 1] && styles.arrowDisabled]}
              onPress={handleNextMonth}
              disabled={selectedMonth === MONTH_KEYS[MONTH_KEYS.length - 1]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="chevron-right" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* ─── 2. Premium Attendance Performance & Trend Graph Card ─── */}
      <View style={[styles.graphCard, { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
        {/* Graph Card Header */}
        <View style={[styles.graphHeader, { borderBottomColor: appTheme.border }]}>
          <View style={styles.graphHeaderLeft}>
            <View style={[styles.graphIconBox, { backgroundColor: appTheme.accentBg }]}>
              <MaterialIcons name="insights" size={20} color={appTheme.primary} />
            </View>
            <View>
              <Text style={[styles.graphTitle, { color: appTheme.textPrimary }]}>Attendance Analytics</Text>
              <Text style={[styles.graphSubtitle, { color: appTheme.textMuted }]}>Weekly consistency & performance</Text>
            </View>
          </View>
          <View style={[
            styles.graphGradeBadge,
            { backgroundColor: parsedPercentage >= 80 ? '#ECFDF5' : '#FFFBEB', borderColor: parsedPercentage >= 80 ? '#A7F3D0' : '#FDE68A' }
          ]}>
            <MaterialIcons
              name={parsedPercentage >= 80 ? 'stars' : 'trending-up'}
              size={13}
              color={parsedPercentage >= 80 ? '#059669' : '#D97706'}
            />
            <Text style={[styles.graphGradeText, { color: parsedPercentage >= 80 ? '#059669' : '#D97706' }]}>
              {parsedPercentage >= 90 ? 'Perfect' : parsedPercentage >= 70 ? 'Consistent' : 'Need Attention'}
            </Text>
          </View>
        </View>

        {/* Visual Graph Main Area (Circular Gauge + Weekly Trend Bars) */}
        <View style={styles.graphVisualRow}>
          {/* Left: SVG Circular Gauge Ring */}
          <View style={styles.gaugeContainer}>
            <Svg width={88} height={88} viewBox="0 0 88 88">
              <Defs>
                <SvgGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={appTheme.primary} />
                  <Stop offset="100%" stopColor={appTheme.accent} />
                </SvgGradient>
              </Defs>
              <G transform="rotate(-90 44 44)">
                {/* Background Ring */}
                <Circle
                  cx="44"
                  cy="44"
                  r={ringRadius}
                  stroke={appTheme.isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}
                  strokeWidth={ringStroke}
                  fill="transparent"
                />
                {/* Foreground Progress Ring */}
                <Circle
                  cx="44"
                  cy="44"
                  r={ringRadius}
                  stroke="url(#gaugeGrad)"
                  strokeWidth={ringStroke}
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </G>
            </Svg>
            <View style={styles.gaugeInnerLabel}>
              <Text style={[styles.gaugeInnerText, { color: appTheme.primary }]}>{currentData.attendancePercentage}</Text>
              <Text style={[styles.gaugeInnerSub, { color: appTheme.textMuted }]}>RATE</Text>
            </View>
          </View>

          {/* Right: Weekly Trend Vertical Bar Chart */}
          <View style={[styles.weeklyChartBox, { backgroundColor: appTheme.surfaceVariant, borderColor: appTheme.border }]}>
            <View style={styles.weeklyBarsContainer}>
              {weeklyBreakdown.map((wb, idx) => {
                const isHigh = wb.pct >= 80;
                return (
                  <View key={idx} style={styles.weeklyBarCol}>
                    <Text style={styles.barTopVal}>{wb.pct}%</Text>
                    <View style={styles.barTrack}>
                      <LinearGradient
                        colors={isHigh ? ['#0047cc', '#3b82f6'] : ['#D97706', '#fbbf24']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={[styles.barFill, { height: `${Math.max(15, wb.pct)}%` }]}
                      />
                    </View>
                    <Text style={styles.barBottomLabel}>{wb.weekLabel}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Multi-Color Ratio Breakdown Bar */}
        <View style={styles.ratioBarWrap}>
          <View style={styles.ratioBarTrack}>
            <View
              style={[
                styles.ratioSegment,
                {
                  flex: currentData.presentCount || 1,
                  backgroundColor: '#059669',
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                }
              ]}
            />
            {currentData.lateCount > 0 && (
              <View
                style={[
                  styles.ratioSegment,
                  {
                    flex: currentData.lateCount,
                    backgroundColor: '#D97706',
                  }
                ]}
              />
            )}
            {currentData.absentCount > 0 && (
              <View
                style={[
                  styles.ratioSegment,
                  {
                    flex: currentData.absentCount,
                    backgroundColor: '#DC2626',
                  }
                ]}
              />
            )}
            <View
              style={[
                styles.ratioSegment,
                {
                  flex: currentData.offCount || 1,
                  backgroundColor: '#CBD5E1',
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                }
              ]}
            />
          </View>
        </View>

        {/* 4 Sleek Status Metric Chips */}
        <View style={styles.metricChipsRow}>
          <View style={[styles.metricChip, { backgroundColor: '#ECFDF5' }]}>
            <View style={[styles.metricDot, { backgroundColor: '#059669' }]} />
            <Text style={styles.metricChipText}>
              <Text style={[styles.metricChipBold, { color: '#059669' }]}>{currentData.presentCount}</Text> Present
            </Text>
          </View>

          <View style={[styles.metricChip, { backgroundColor: '#FFFBEB' }]}>
            <View style={[styles.metricDot, { backgroundColor: '#D97706' }]} />
            <Text style={styles.metricChipText}>
              <Text style={[styles.metricChipBold, { color: '#D97706' }]}>{currentData.lateCount}</Text> Late
            </Text>
          </View>

          <View style={[styles.metricChip, { backgroundColor: '#FEF2F2' }]}>
            <View style={[styles.metricDot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.metricChipText}>
              <Text style={[styles.metricChipBold, { color: '#DC2626' }]}>{currentData.absentCount}</Text> Absent
            </Text>
          </View>

          <View style={[styles.metricChip, { backgroundColor: '#F1F5F9' }]}>
            <View style={[styles.metricDot, { backgroundColor: '#64748B' }]} />
            <Text style={styles.metricChipText}>
              <Text style={[styles.metricChipBold, { color: '#64748B' }]}>{currentData.offCount}</Text> Off
            </Text>
          </View>
        </View>
      </View>

      {/* ─── 3. CARD 1: My Attendance Details ─── */}
      <View style={[styles.card, { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
        {/* Clean Stacked Header: Title on Top */}
        <View style={[styles.cardHeaderStack, { borderBottomColor: appTheme.border }]}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.cardIconBox, { backgroundColor: appTheme.accentBg }]}>
              <MaterialIcons name="event-available" size={22} color={appTheme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: appTheme.textPrimary }]}>My Attendance Details</Text>
              <Text style={[styles.cardSubtitle, { color: appTheme.textMuted }]}>Monthly ERP Attendance Log • {selectedMonth}</Text>
            </View>
          </View>

          {/* Full-width 2-Way Switcher (Never collides) */}
          <View style={[styles.segmentedToggleContainer, { backgroundColor: appTheme.surfaceVariant }]}>
            <TouchableOpacity
              style={[styles.segBtn, attendanceViewMode === 'dayWise' && [styles.segBtnActive, { backgroundColor: appTheme.primary }]]}
              onPress={() => setAttendanceViewMode('dayWise')}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="calendar-view-day"
                size={16}
                color={attendanceViewMode === 'dayWise' ? '#ffffff' : appTheme.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.segBtnText, { color: appTheme.textMuted }, attendanceViewMode === 'dayWise' && styles.segBtnTextActive]}>
                Day-Wise View
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segBtn, attendanceViewMode === 'monthWise' && [styles.segBtnActive, { backgroundColor: appTheme.primary }]]}
              onPress={() => setAttendanceViewMode('monthWise')}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name="pie-chart"
                size={16}
                color={attendanceViewMode === 'monthWise' ? '#ffffff' : appTheme.textMuted}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.segBtnText, { color: appTheme.textMuted }, attendanceViewMode === 'monthWise' && styles.segBtnTextActive]}>
                Month Summary
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {attendanceViewMode === 'dayWise' ? (
          /* Day-Wise Horizontal Strip & Selected Day Card */
          <View style={{ marginTop: 10 }}>
            {/* Color Legend (Wrap-friendly) */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                  <Text style={[styles.legendBadgeText, { color: '#059669' }]}>P</Text>
                </View>
                <Text style={styles.legendText}>Present</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBadge, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                  <Text style={[styles.legendBadgeText, { color: '#D97706' }]}>L</Text>
                </View>
                <Text style={styles.legendText}>Late</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBadge, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                  <Text style={[styles.legendBadgeText, { color: '#DC2626' }]}>A</Text>
                </View>
                <Text style={styles.legendText}>Absent</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBadge, { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }]}>
                  <Text style={[styles.legendBadgeText, { color: '#64748B' }]}>-</Text>
                </View>
                <Text style={styles.legendText}>Holiday/Off</Text>
              </View>
            </View>

            {/* Horizontal Days Carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.daysScrollTrack}
            >
              {currentData.days.map((item) => {
                const conf = getStatusColor(item.status);
                const isSelected = selectedDay === item.day;
                return (
                  <TouchableOpacity
                    key={item.day}
                    style={[
                      styles.dayPill,
                      isSelected && styles.dayPillSelected,
                      { borderTopColor: conf.color }
                    ]}
                    onPress={() => setSelectedDay(item.day)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.dayPillDayText}>DAY {item.day}</Text>
                    <Text style={styles.dayPillSub}>{item.dayName}</Text>
                    <View style={[styles.dayPillBadge, { backgroundColor: conf.bg, borderColor: conf.border }]}>
                      <Text style={[styles.dayPillBadgeText, { color: conf.color }]}>{conf.text}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Selected Day Large Info Card */}
            {selectedDayItem && (
              <View style={styles.dayDetailCard}>
                <View style={styles.dayDetailHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.dayDetailDateTitle}>{selectedDayItem.dateStr} ({selectedDayItem.dayName})</Text>
                    <Text style={styles.dayDetailMeta}>Daily Punch Record</Text>
                  </View>
                  <View style={[styles.statusTag, { backgroundColor: getStatusColor(selectedDayItem.status).bg, borderColor: getStatusColor(selectedDayItem.status).border }]}>
                    <Text style={[styles.statusTagText, { color: getStatusColor(selectedDayItem.status).color }]}>
                      {selectedDayItem.punchStatus || selectedDayItem.statusLabel}
                    </Text>
                  </View>
                </View>

                <View style={styles.punchTimeContainer}>
                  <View style={styles.punchTimeCol}>
                    <View style={styles.punchTimeIconBox}>
                      <MaterialIcons name="login" size={16} color="#059669" />
                    </View>
                    <Text style={styles.punchTimeLabel}>CHECK IN</Text>
                    <Text style={styles.punchTimeVal}>{selectedDayItem.inTime}</Text>
                  </View>

                  <View style={styles.punchDivider} />

                  <View style={styles.punchTimeCol}>
                    <View style={styles.punchTimeIconBox}>
                      <MaterialIcons name="logout" size={16} color="#0047cc" />
                    </View>
                    <Text style={styles.punchTimeLabel}>CHECK OUT</Text>
                    <Text style={styles.punchTimeVal}>{selectedDayItem.outTime}</Text>
                  </View>

                  <View style={styles.punchDivider} />

                  <View style={styles.punchTimeCol}>
                    <View style={styles.punchTimeIconBox}>
                      <MaterialIcons name="timelapse" size={16} color="#D97706" />
                    </View>
                    <Text style={styles.punchTimeLabel}>DURATION</Text>
                    <Text style={styles.punchTimeVal}>{selectedDayItem.duration || '--'}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : (
          /* Month-Wise Clean KPI Summary (Spacious, No Overlaps) */
          <View style={styles.monthSummaryWrapper}>
            {/* Top Overview Strip */}
            <View style={styles.monthOverviewStrip}>
              <View style={styles.overviewBadge}>
                <Text style={styles.overviewBadgeLabel}>TEACHER ID</Text>
                <Text style={styles.overviewBadgeVal}>#{currentData.teacherId}</Text>
              </View>
              <View style={styles.overviewBadge}>
                <Text style={styles.overviewBadgeLabel}>DEPARTMENT</Text>
                <Text style={styles.overviewBadgeVal} numberOfLines={1}>{currentData.department}</Text>
              </View>
            </View>

            {/* Attendance Rate Progress Box */}
            <View style={styles.progressGaugeBox}>
              <View style={styles.progressGaugeTop}>
                <View>
                  <Text style={styles.gaugeLabel}>Overall Attendance Rate</Text>
                  <Text style={styles.gaugeSub}>Based on {currentData.totalWorkingDays} official working days</Text>
                </View>
                <Text style={styles.gaugePercentVal}>{currentData.attendancePercentage}</Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: currentData.attendancePercentage as any }]} />
              </View>
            </View>

            {/* Breakdown List */}
            <View style={styles.breakdownList}>
              <View style={styles.breakdownItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.breakdownDot, { backgroundColor: '#059669' }]} />
                  <Text style={styles.breakdownLabel}>Total Present Days</Text>
                </View>
                <Text style={[styles.breakdownVal, { color: '#059669' }]}>{currentData.presentCount} Days</Text>
              </View>

              <View style={styles.breakdownItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.breakdownDot, { backgroundColor: '#D97706' }]} />
                  <Text style={styles.breakdownLabel}>Late Entries</Text>
                </View>
                <Text style={[styles.breakdownVal, { color: '#D97706' }]}>{currentData.lateCount} Days</Text>
              </View>

              <View style={styles.breakdownItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.breakdownDot, { backgroundColor: '#DC2626' }]} />
                  <Text style={styles.breakdownLabel}>Absent Days</Text>
                </View>
                <Text style={[styles.breakdownVal, { color: '#DC2626' }]}>{currentData.absentCount} Days</Text>
              </View>

              <View style={styles.breakdownItem}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={[styles.breakdownDot, { backgroundColor: '#64748B' }]} />
                  <Text style={styles.breakdownLabel}>Sundays & Gazetted Holidays</Text>
                </View>
                <Text style={[styles.breakdownVal, { color: '#64748B' }]}>{currentData.offCount} Days</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* ─── 4. CARD 2: Biometric Attendance Details ─── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderStack}>
          <View style={styles.cardTitleRow}>
            <View style={[styles.cardIconBox, { backgroundColor: '#ECFDF5' }]}>
              <MaterialIcons name="fingerprint" size={22} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                <Text style={styles.cardTitle}>Biometric Punch Logs</Text>
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={13} color="#059669" />
                  <Text style={styles.verifiedBadgeText}>Machine #1</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>Direct Fingerprint In/Out Scanner Records</Text>
            </View>
          </View>
        </View>

        {/* Clean, Readable Daily Punch Records */}
        <View style={styles.biometricList}>
          {currentData.days.map((item) => {
            const hasPunch = item.inTime !== '--';
            const isSunday = item.status === '-';
            const isLate = item.status === 'L';
            const isAbsent = item.status === 'A';

            return (
              <View key={item.day} style={[styles.bioRow, isSunday && styles.bioRowOff]}>
                {/* Left: Date */}
                <View style={styles.bioRowLeft}>
                  <Text style={styles.bioDayNum}>Day {item.day}</Text>
                  <Text style={styles.bioDayDate}>{item.dateStr.split(' ')[0]} {item.dateStr.split(' ')[1]} ({item.dayName})</Text>
                </View>

                {/* Right: In/Out Timestamps */}
                {hasPunch ? (
                  <View style={styles.bioRowRight}>
                    <View style={styles.bioTimeChip}>
                      <Text style={styles.bioTimeLabel}>IN</Text>
                      <Text style={[styles.bioTimeVal, isLate && { color: '#D97706' }]}>{item.inTime}</Text>
                    </View>
                    <View style={styles.bioTimeChip}>
                      <Text style={styles.bioTimeLabel}>OUT</Text>
                      <Text style={styles.bioTimeVal}>{item.outTime}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.bioOffBadge}>
                    <Text style={styles.bioOffText}>{isAbsent ? 'Absent (No Punch)' : item.statusLabel}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  if (embedded) {
    return containerContent;
  }

  return (
    <View style={[styles.screenWrapper, { backgroundColor: appTheme.bg }]}>
      <SafeAreaView style={styles.screenSafeArea} edges={['top']}>
        <View style={[styles.screenHeader, { backgroundColor: appTheme.surface, borderBottomColor: appTheme.border }]}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: appTheme.surfaceVariant }]}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color={appTheme.textPrimary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.screenHeaderTitle, { color: appTheme.textPrimary }]}>My Attendance</Text>
            <Text style={[styles.screenHeaderSub, { color: appTheme.textMuted }]}>Teacher Daily & Biometric Records</Text>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {containerContent}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  screenHeaderSub: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 36,
  },
  mainContainer: {
    width: '100%',
    gap: 14,
  },

  /* Banner */
  bannerCard: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0047cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerGradient: {
    padding: 16,
    borderRadius: 18,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarLetter: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  teacherName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  idBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
  },
  idBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#ffffff',
  },
  teacherRole: {
    fontSize: 12,
    fontWeight: '600',
    color: '#93c5fd',
    marginTop: 2,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  monthNavArrow: {
    padding: 4,
    borderRadius: 8,
  },
  arrowDisabled: {
    opacity: 0.4,
  },
  monthTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthTitleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.2,
  },

  /* Premium Graph Card */
  graphCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  graphHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  graphHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  graphIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  graphSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  graphGradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    borderWidth: 1,
  },
  graphGradeText: {
    fontSize: 10.5,
    fontWeight: '800',
  },

  /* Visual Graph Body */
  graphVisualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 4,
  },
  gaugeContainer: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gaugeInnerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeInnerText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0047cc',
  },
  gaugeInnerSub: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: -1,
  },

  /* Weekly Trend Bars */
  weeklyChartBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  weeklyBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 72,
  },
  weeklyBarCol: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 32,
  },
  barTopVal: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 3,
  },
  barTrack: {
    width: 14,
    height: 42,
    backgroundColor: '#E2E8F0',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barBottomLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#334155',
    marginTop: 4,
  },

  /* Multi-Color Ratio Progress Bar */
  ratioBarWrap: {
    width: '100%',
  },
  ratioBarTrack: {
    flexDirection: 'row',
    height: 7,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  ratioSegment: {
    height: '100%',
  },

  /* 4 Metric Chips */
  metricChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    flexWrap: 'wrap',
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    flexGrow: 1,
    justifyContent: 'center',
  },
  metricDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  metricChipText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  metricChipBold: {
    fontWeight: '900',
  },

  /* Main Card Containers */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderStack: {
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },

  /* Segmented Toggle */
  segmentedToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    gap: 4,
    width: '100%',
  },
  segBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  segBtnActive: {
    backgroundColor: '#0047cc',
    shadowColor: '#0047cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  segBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  segBtnTextActive: {
    color: '#ffffff',
  },

  /* Legend */
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
  },
  legendText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },

  /* Days Scroll Track */
  daysScrollTrack: {
    paddingVertical: 4,
    gap: 8,
  },
  dayPill: {
    width: 60,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderTopWidth: 3.5,
  },
  dayPillSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#0047cc',
    shadowColor: '#0047cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  dayPillDayText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
  },
  dayPillSub: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  dayPillBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillBadgeText: {
    fontSize: 12.5,
    fontWeight: '900',
  },

  /* Day Detail Card */
  dayDetailCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  dayDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  dayDetailDateTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  dayDetailMeta: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 1,
  },
  statusTag: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '800',
  },
  punchTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  punchTimeCol: {
    alignItems: 'center',
    flex: 1,
  },
  punchTimeIconBox: {
    marginBottom: 3,
  },
  punchTimeLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  punchTimeVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  punchDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#E2E8F0',
  },

  /* Month Summary KPIs (Clean View) */
  monthSummaryWrapper: {
    marginTop: 12,
    gap: 12,
  },
  monthOverviewStrip: {
    flexDirection: 'row',
    gap: 10,
  },
  overviewBadge: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  overviewBadgeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  overviewBadgeVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  progressGaugeBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.2,
    borderColor: '#C7D2FE',
  },
  progressGaugeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gaugeLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E1B4B',
  },
  gaugeSub: {
    fontSize: 10.5,
    color: '#4338CA',
    fontWeight: '600',
    marginTop: 1,
  },
  gaugePercentVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0047cc',
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 71, 204, 0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0047cc',
    borderRadius: 4,
  },
  breakdownList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  breakdownVal: {
    fontSize: 12.5,
    fontWeight: '900',
  },

  /* Biometric Card List */
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#059669',
  },
  biometricList: {
    marginTop: 12,
    gap: 8,
  },
  bioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bioRowOff: {
    opacity: 0.75,
    backgroundColor: '#f1f5f9',
  },
  bioRowLeft: {
    flex: 1,
  },
  bioDayNum: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0047cc',
    letterSpacing: 0.2,
  },
  bioDayDate: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  bioRowRight: {
    flexDirection: 'row',
    gap: 6,
  },
  bioTimeChip: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    minWidth: 68,
  },
  bioTimeLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#64748B',
  },
  bioTimeVal: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  bioOffBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bioOffText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
});

export default MyAttendanceScreen;

