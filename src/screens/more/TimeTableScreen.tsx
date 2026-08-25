import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Ellipse } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

type DayKey = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

const ROW_COLORS = [
  { accent: '#2563EB', glow: 'rgba(37,99,235,0.08)',  badge: ['#2563EB', '#1D4ED8'] as [string, string] },
  { accent: '#059669', glow: 'rgba(5,150,105,0.08)',  badge: ['#059669', '#047857'] as [string, string] },
  { accent: '#7C3AED', glow: 'rgba(124,58,237,0.08)', badge: ['#7C3AED', '#6D28D9'] as [string, string] },
  { accent: '#DC2626', glow: 'rgba(220,38,38,0.08)',  badge: ['#DC2626', '#B91C1C'] as [string, string] },
  { accent: '#D97706', glow: 'rgba(217,119,6,0.08)',  badge: ['#D97706', '#B45309'] as [string, string] },
  { accent: '#0891B2', glow: 'rgba(8,145,178,0.08)',  badge: ['#0891B2', '#0E7490'] as [string, string] },
];

export const TimeTableScreen = ({ navigation }: any) => {
  const [activeDay, setActiveDay] = useState<DayKey>('Wednesday');
  const daysList: DayKey[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const timetableSchedule: Record<DayKey, { id: string; timeStart: string; timeEnd: string; subject: string; teacher: string; classSection: string }[]> = {
    Monday: [
      { id: 'm1', timeStart: '08:30 AM', timeEnd: '09:15 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-I · A' },
      { id: 'm2', timeStart: '11:00 AM', timeEnd: '11:45 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-II · A' },
      { id: 'm3', timeStart: '12:30 PM', timeEnd: '01:15 PM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-V · B' },
    ],
    Tuesday: [
      { id: 't1', timeStart: '09:15 AM', timeEnd: '10:00 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-III · A' },
      { id: 't2', timeStart: '10:15 AM', timeEnd: '11:00 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-I · A' },
    ],
    Wednesday: [
      { id: 'w1', timeStart: '08:30 AM', timeEnd: '09:15 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-V · A' },
      { id: 'w2', timeStart: '10:00 AM', timeEnd: '10:45 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-I · A' },
      { id: 'w3', timeStart: '11:30 AM', timeEnd: '12:15 PM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-IV · B' },
    ],
    Thursday: [
      { id: 'th1', timeStart: '08:30 AM', timeEnd: '09:15 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-I · A' },
      { id: 'th2', timeStart: '11:30 AM', timeEnd: '12:15 PM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-II · B' },
    ],
    Friday: [
      { id: 'f1', timeStart: '09:00 AM', timeEnd: '09:45 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-III · C' },
      { id: 'f2', timeStart: '10:00 AM', timeEnd: '10:45 AM', subject: 'English', teacher: 'Suman Iqbal', classSection: 'GRADE-I · A' },
    ],
  };

  const activeLectures = timetableSchedule[activeDay];

  return (
    <View style={styles.root}>

      {/* ── PREMIUM LIGHT GRADIENT BG ── */}
      <LinearGradient
        colors={['#C7DCFF', '#D8E9FF', '#E8F2FF', '#F5F9FF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft radial glow orbs */}
      <View style={styles.orb1} pointerEvents="none" />
      <View style={styles.orb2} pointerEvents="none" />
      <View style={styles.orb3} pointerEvents="none" />

      {/* Decorative SVG */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Ellipse cx="115%" cy="5%"  rx="65%" ry="28%" fill="rgba(255,255,255,0.35)" />
        <Ellipse cx="-15%" cy="95%" rx="60%" ry="25%" fill="rgba(255,255,255,0.30)" />
        <Path d="M-40,260 Q160,140 380,280 T820,240" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
        <Path d="M-40,320 Q160,200 380,340 T820,300" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top']}>

        {/* ── APP BAR (glass) ── */}
        <View style={styles.appBar}>
          <LinearGradient
            colors={['rgba(255,255,255,0.72)', 'rgba(255,255,255,0.58)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color="#1E293B" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Time Table</Text>
              <View style={styles.verifiedRow}>
                <View style={styles.livePulse} />
                <Text style={styles.verifiedText}>Official · Live Schedule</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.printBtn} onPress={() => alert('Preparing print...')} activeOpacity={0.8}>
            <MaterialIcons name="print" size={14} color="#2563EB" />
            <Text style={styles.printBtnText}>Print</Text>
          </TouchableOpacity>
        </View>

        {/* ── DAY TABS (glass pills) ── */}
        <View style={styles.tabsWrapper}>
          <View style={styles.tabsContainer}>
            {daysList.map((day) => {
              const isSelected = activeDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayTab, isSelected && styles.dayTabActive]}
                  onPress={() => setActiveDay(day)}
                  activeOpacity={0.85}
                >
                  {isSelected ? (
                    <>
                      <LinearGradient
                        colors={['#2563EB', '#1D4ED8']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    </>
                  ) : (
                    <>
                      <View style={styles.inactiveTabBg} />
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.40)', 'rgba(255, 255, 255, 0.10)']}
                        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    </>
                  )}
                  <Text style={[styles.dayTabText, isSelected && styles.dayTabTextActive]}>
                    {day.slice(0, 3)}
                  </Text>
                  {isSelected && <View style={styles.activeTabIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── MAIN SCROLL ── */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Admin Banner (glass card) */}
          <View style={styles.adminBanner}>
            <LinearGradient
              colors={['rgba(255,255,255,0.78)', 'rgba(255,255,255,0.60)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.adminStripe} />
            <View style={styles.adminIconBox}>
              <LinearGradient colors={['#2563EB', '#1D4ED8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={styles.iconShine} />
              <MaterialIcons name="cloud-done" size={19} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.adminTitle}>Uploaded by School Admin</Text>
              <Text style={styles.adminSub}>Synced with your Teacher ID · Auto-updated</Text>
            </View>
            <View style={styles.liveDot} />
          </View>

          {/* ── GLASSMORPHIC TABLE CARD ── */}
          <View style={styles.tableCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.82)', 'rgba(255,255,255,0.68)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Top shine */}
            <LinearGradient
              colors={['rgba(255,255,255,0.60)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFill, { height: 60 }]}
              pointerEvents="none"
            />

            {/* ─ TABLE HEADER ─ */}
            <View style={styles.tableHeader}>
              <LinearGradient colors={['#2563EB', '#1E40AF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={['rgba(255,255,255,0.20)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill} pointerEvents="none"
              />
              <View style={styles.tableHeaderRow}>
                <MaterialIcons name="table-rows" size={15} color="rgba(255,255,255,0.9)" style={{ marginRight: 7 }} />
                <Text style={styles.tableHeaderText}>{activeDay}'s Schedule</Text>
                <View style={styles.countPill}>
                  <Text style={styles.countPillText}>{activeLectures.length} Classes</Text>
                </View>
              </View>
            </View>

            {/* ─ COLUMN HEADERS ─ */}
            <View style={styles.colHeaderRow}>
              <View style={[styles.colHeaderCell, { flex: 1.1 }]}>
                <MaterialIcons name="schedule" size={13} color="#2563EB" />
                <Text style={styles.colHeaderText}>TIME SLOT</Text>
              </View>
              <View style={styles.colDivider} />
              <View style={[styles.colHeaderCell, { flex: 1.4 }]}>
                <MaterialIcons name="book" size={13} color="#059669" />
                <Text style={styles.colHeaderText}>SUBJECT</Text>
              </View>
              <View style={styles.colDivider} />
              <View style={[styles.colHeaderCell, { flex: 1 }]}>
                <MaterialIcons name="class" size={13} color="#7C3AED" />
                <Text style={styles.colHeaderText}>CLASS</Text>
              </View>
            </View>

            {/* ─ DATA ROWS ─ */}
            {activeLectures.length === 0 ? (
              <View style={styles.emptyRow}>
                <MaterialIcons name="event-busy" size={38} color="#CBD5E1" />
                <Text style={styles.emptyText}>No classes scheduled</Text>
              </View>
            ) : (
              activeLectures.map((lecture, index) => {
                const p = ROW_COLORS[index % ROW_COLORS.length];
                const isLast = index === activeLectures.length - 1;
                return (
                  <View key={lecture.id}>
                    <View style={styles.dataRow}>
                      {/* Row subtle tint */}
                      <LinearGradient
                        colors={[p.glow, 'rgba(255,255,255,0)']}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                        style={StyleSheet.absoluteFill}
                      />
                      {/* Left accent */}
                      <View style={[styles.rowAccent, { backgroundColor: p.accent }]} />

                      {/* Slot # */}
                      <View style={[styles.slotNum, { borderColor: p.accent + '55', backgroundColor: p.glow }]}>
                        <Text style={[styles.slotNumText, { color: p.accent }]}>{index + 1}</Text>
                      </View>

                      {/* ── Time Cell ── */}
                      <View style={[styles.cell, { flex: 1.1 }]}>
                        <Text style={[styles.timeStart, { color: p.accent }]}>{lecture.timeStart}</Text>
                        <View style={[styles.timeDash, { backgroundColor: p.accent + '40' }]} />
                        <Text style={[styles.timeEnd, { color: p.accent + 'CC' }]}>{lecture.timeEnd}</Text>
                      </View>

                      <View style={styles.vLine} />

                      {/* ── Subject Cell ── */}
                      <View style={[styles.cell, { flex: 1.4 }]}>
                        <Text style={styles.subjectName}>{lecture.subject}</Text>
                        <View style={styles.teacherRow}>
                          <MaterialIcons name="person-outline" size={11} color="#94A3B8" />
                          <Text style={styles.teacherName}>{lecture.teacher}</Text>
                        </View>
                      </View>

                      <View style={styles.vLine} />

                      {/* ── Class Badge Cell ── */}
                      <View style={[styles.cell, { flex: 1, alignItems: 'center' }]}>
                        <View style={styles.gradeBadge}>
                          <LinearGradient colors={p.badge} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                          <LinearGradient
                            colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0)']}
                            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                            style={StyleSheet.absoluteFill} pointerEvents="none"
                          />
                          <Text style={styles.gradeBadgeText}>{lecture.classSection}</Text>
                        </View>
                      </View>
                    </View>

                    {!isLast && <View style={styles.rowSep} />}
                  </View>
                );
              })
            )}

            {/* Bottom gradient bar */}
            <View style={styles.bottomBar}>
              <LinearGradient colors={['#2563EB', '#7C3AED', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
            </View>
          </View>

          <Text style={styles.footerNote}>
            * Print generates an A4-compatible PDF of your weekly timetable.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },

  // ── ORBS ──
  orb1: {
    position: 'absolute', top: -180, right: -160,
    width: 460, height: 460, borderRadius: 230,
    backgroundColor: 'rgba(99,140,255,0.22)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -140,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(52,211,153,0.16)',
  },
  orb3: {
    position: 'absolute', top: '42%', right: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(167,139,250,0.16)',
  },

  // ── APP BAR ──
  appBar: {
    height: 68, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 18,
    borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.55)',
    position: 'relative', overflow: 'hidden',
    zIndex: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.70)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 },
  livePulse: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981',
  },
  verifiedText: { fontSize: 10, fontWeight: '700', color: '#059669' },
  printBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderWidth: 1, borderColor: 'rgba(37,99,235,0.25)',
    paddingHorizontal: 13, paddingVertical: 7, borderRadius: 10,
  },
  printBtnText: { fontSize: 12.5, fontWeight: '800', color: '#2563EB' },

  // ── DAY TABS ──
  tabsWrapper: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 9,
    backgroundColor: 'rgba(255,255,255,0.40)',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dayTab: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  inactiveTabBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.60)',
  },
  dayTabActive: {
    borderColor: 'transparent',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 5,
  },
  dayTabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  activeTabIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
    marginTop: 1,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },

  // ── SCROLL ──
  scrollContent: { padding: 12, paddingBottom: 90, gap: 10 },

  // ── ADMIN BANNER ──
  adminBanner: {
    borderRadius: 12, padding: 10, flexDirection: 'row',
    alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.65)',
    overflow: 'hidden', position: 'relative',
    elevation: 2, shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,
  },
  adminStripe: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 3, backgroundColor: '#2563EB',
  },
  adminIconBox: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  iconShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
    backgroundColor: 'rgba(255,255,255,0.22)', borderTopLeftRadius: 10, borderTopRightRadius: 10,
  },
  adminTitle: { fontSize: 12, fontWeight: '800', color: '#1E3A8A' },
  adminSub: { fontSize: 9.5, fontWeight: '600', color: '#3B82F6', marginTop: 1 },
  liveDot: {
    width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#10B981',
    borderWidth: 1.5, borderColor: 'rgba(16,185,129,0.25)',
  },

  // ── TABLE CARD (glassmorphism) ──
  tableCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.70)',
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },

  // Table header bar
  tableHeader: {
    paddingVertical: 10, paddingHorizontal: 14,
    position: 'relative', overflow: 'hidden',
  },
  tableHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  tableHeaderText: { fontSize: 13, fontWeight: '900', color: '#FFFFFF', flex: 1, letterSpacing: 0.1 },
  countPill: {
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12,
  },
  countPillText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF' },

  // Column header row
  colHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(248,250,255,0.88)',
    borderBottomWidth: 1, borderColor: 'rgba(226,232,240,0.60)',
    paddingVertical: 7,
  },
  colHeaderCell: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  colHeaderText: { fontSize: 9.5, fontWeight: '900', color: '#64748B', letterSpacing: 0.6 },
  colDivider: { width: 1, backgroundColor: 'rgba(226,232,240,0.70)', marginVertical: 2 },

  // Data row
  dataRow: {
    flexDirection: 'row', alignItems: 'stretch',
    minHeight: 64, position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.0)',
  },
  rowAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3 },
  slotNum: {
    position: 'absolute', top: 8, left: 6,
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  slotNumText: { fontSize: 8.5, fontWeight: '900' },

  // Cells
  cell: { justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 8 },
  vLine: { width: 1, backgroundColor: 'rgba(226,232,240,0.65)', marginVertical: 8 },

  // Time text
  timeStart: { fontSize: 12, fontWeight: '900', letterSpacing: 0.1, textAlign: 'center' },
  timeDash: { width: 18, height: 1.5, borderRadius: 1, marginVertical: 2, alignSelf: 'center' },
  timeEnd: { fontSize: 11, fontWeight: '800', letterSpacing: 0.1, textAlign: 'center' },

  // Subject
  subjectName: { fontSize: 13, fontWeight: '900', color: '#0F172A', letterSpacing: -0.2, marginBottom: 2 },
  teacherRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  teacherName: { fontSize: 11, fontWeight: '700', color: '#475569' },

  // Grade badge
  gradeBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    overflow: 'hidden', position: 'relative',
    elevation: 2, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.10, shadowRadius: 3,
  },
  gradeBadgeText: { fontSize: 10.5, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.3 },

  rowSep: { height: 1, backgroundColor: 'rgba(226,232,240,0.45)' },
  bottomBar: { height: 4, position: 'relative', overflow: 'hidden' },

  emptyRow: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 8 },
  emptyText: { fontSize: 13.5, fontWeight: '700', color: '#94A3B8' },

  footerNote: { fontSize: 10.5, fontWeight: '600', color: '#94A3B8', textAlign: 'center', lineHeight: 15 },
});
