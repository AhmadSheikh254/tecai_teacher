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

type ScheduleRecord = {
  id: string;
  term: string;
  isGrade: 'Yes' | 'No';
  className: string;
  course: string;
  examDate: string;
  startTime: string;
  endTime: string;
  roomNo: string;
  writtenMark: number;
  practicalMark: number | string;
  theoryMark: number | string;
  vivaMark: number | string;
  createdAt: string;
};

export const ExamScheduleScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Search & Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ScheduleRecord | null>(null);

  // Exact Exam Schedule Data for Teacher View (matching desktop web image)
  const [schedules] = useState<ScheduleRecord[]>([
    {
      id: 'SCH-01',
      term: '1st Assessment',
      isGrade: 'Yes',
      className: 'GRADE-V',
      course: 'English',
      examDate: '28 Jun 2026',
      startTime: '01:01 PM',
      endTime: '02:30 PM',
      roomNo: '2',
      writtenMark: 100,
      practicalMark: '-',
      theoryMark: '-',
      vivaMark: '-',
      createdAt: '28 Jun 2026 10:01 AM',
    },
    {
      id: 'SCH-02',
      term: '1st Assessment',
      isGrade: 'Yes',
      className: 'GRADE-V',
      course: 'Mathematics',
      examDate: '29 Jun 2026',
      startTime: '09:00 AM',
      endTime: '11:00 AM',
      roomNo: '4',
      writtenMark: 75,
      practicalMark: 25,
      theoryMark: '-',
      vivaMark: '-',
      createdAt: '28 Jun 2026 10:05 AM',
    },
    {
      id: 'SCH-03',
      term: '1st Assessment',
      isGrade: 'Yes',
      className: 'GRADE-V',
      course: 'Science',
      examDate: '30 Jun 2026',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      roomNo: '3',
      writtenMark: 60,
      practicalMark: 30,
      theoryMark: '-',
      vivaMark: 10,
      createdAt: '28 Jun 2026 10:10 AM',
    }
  ]);

  // Filter schedules by query
  const filteredSchedules = schedules.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.term.toLowerCase().includes(query) ||
      item.className.toLowerCase().includes(query) ||
      item.course.toLowerCase().includes(query) ||
      item.examDate.toLowerCase().includes(query) ||
      item.roomNo.toString().includes(query)
    );
  });

  const handleExportAlert = (format: string) => {
    alert(`Exported Exam Schedule Sheet in ${format} format.`);
  };

  return (
    <View style={styles.root}>
      {/* ── CLEAN LIGHT BG ── */}
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
        <Circle cx="85%" cy="12%" r="180" fill="rgba(56, 189, 248, 0.06)" />
        <Circle cx="15%" cy="88%" r="200" fill="rgba(14, 165, 233, 0.04)" />
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
            <Text style={styles.headerTitle}>Exam Schedule View</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="event-note" size={28} color="#0284C7" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* MAIN EXAM SCHEDULE CONTAINER */}
          <View style={styles.ledgerCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.98)', 'rgba(240,249,255,0.92)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topBlueStrip} />

            {/* Title & Export Bar */}
            <View style={styles.portalTitleBox}>
              <LinearGradient
                colors={['#0284C7', '#0369A1']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <MaterialIcons name="event" size={22} color="#FFFFFF" />
              <Text style={styles.portalTitleText}>Exam Schedule Ledger</Text>
            </View>

            {/* Export Toolbar */}
            <View style={styles.exportToolbar}>
              <Text style={styles.exportLabel}>Export:</Text>
              <View style={styles.exportBadgeRow}>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('Copy')}>
                  <Text style={styles.exportText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('CSV')}>
                  <Text style={styles.exportText}>CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('Excel')}>
                  <Text style={styles.exportText}>Excel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('PDF')}>
                  <Text style={styles.exportText}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('Print')}>
                  <Text style={styles.exportText}>Print</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Input */}
            <View style={styles.searchRow}>
              <Text style={styles.searchLabel}>Search:</Text>
              <View style={styles.searchWrapper}>
                <MaterialIcons name="search" size={20} color="#0284C7" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search course, class, room..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                    <MaterialIcons name="close" size={18} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* SLEEK, SHARP & EASY TO READ CARDS */}
            <View style={styles.recordsList}>
              {filteredSchedules.map((item) => (
                <View key={item.id} style={styles.sharpRecordCard}>
                  <LinearGradient
                    colors={['#FFFFFF', '#F8FAFC']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.leftBlueTag} />

                  {/* 1. Header: Course Title, Class Badge & View Action Button */}
                  <View style={styles.sharpCardHeader}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Text style={styles.courseTitleText}>{item.course}</Text>
                        <View style={styles.classPill}>
                          <Text style={styles.classPillText}>{item.className}</Text>
                        </View>
                      </View>
                      <Text style={styles.termSubText}>{item.term} • Is Grade: {item.isGrade}</Text>
                    </View>

                    <TouchableOpacity 
                      style={styles.sharpViewBtn} 
                      onPress={() => setSelectedRecord(item)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#0284C7', '#0369A1']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <MaterialIcons name="visibility" size={18} color="#FFFFFF" />
                      <Text style={styles.sharpViewBtnText}>View</Text>
                    </TouchableOpacity>
                  </View>

                  {/* 2. Key Info Row: Colorful Date, Timing & Room Pills */}
                  <View style={styles.keyInfoRow}>
                    <View style={[styles.infoPill, { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' }]}>
                      <MaterialIcons name="event" size={17} color="#1D4ED8" />
                      <Text style={[styles.infoPillText, { color: '#1D4ED8' }]}>{item.examDate}</Text>
                    </View>

                    <View style={[styles.infoPill, { backgroundColor: '#F3E8FF', borderColor: '#C084FC' }]}>
                      <MaterialIcons name="schedule" size={17} color="#7E22CE" />
                      <Text style={[styles.infoPillText, { color: '#7E22CE' }]}>{item.startTime} - {item.endTime}</Text>
                    </View>

                    <View style={[styles.infoPill, { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' }]}>
                      <MaterialIcons name="meeting-room" size={17} color="#047857" />
                      <Text style={[styles.infoPillText, { color: '#047857' }]}>Room {item.roomNo}</Text>
                    </View>
                  </View>

                  {/* 3. Compact Horizontal Marks Strip with Colors */}
                  <View style={styles.marksSummaryStrip}>
                    <View style={styles.markCol}>
                      <Text style={styles.markColLabel}>WRITTEN</Text>
                      <Text style={[styles.markColValue, { color: '#0284C7' }]}>{item.writtenMark}</Text>
                    </View>
                    <View style={styles.markDivider} />
                    <View style={styles.markCol}>
                      <Text style={styles.markColLabel}>PRACTICAL</Text>
                      <Text style={[styles.markColValue, { color: item.practicalMark !== '-' ? '#D97706' : '#94A3B8' }]}>
                        {item.practicalMark}
                      </Text>
                    </View>
                    <View style={styles.markDivider} />
                    <View style={styles.markCol}>
                      <Text style={styles.markColLabel}>THEORY</Text>
                      <Text style={[styles.markColValue, { color: item.theoryMark !== '-' ? '#4F46E5' : '#94A3B8' }]}>
                        {item.theoryMark}
                      </Text>
                    </View>
                    <View style={styles.markDivider} />
                    <View style={styles.markCol}>
                      <Text style={styles.markColLabel}>VIVA</Text>
                      <Text style={[styles.markColValue, { color: item.vivaMark !== '-' ? '#059669' : '#94A3B8' }]}>
                        {item.vivaMark}
                      </Text>
                    </View>
                  </View>

                </View>
              ))}
            </View>

            {/* Pagination Controls Footer matching Desktop Image */}
            <View style={styles.paginationRow}>
              <Text style={styles.entriesText}>Showing 1 to {filteredSchedules.length} of {schedules.length} entries</Text>
              <View style={styles.paginationBtns}>
                <TouchableOpacity style={styles.pageBtnDisabled} disabled={true}>
                  <Text style={styles.pageBtnTextDisabled}>Previous</Text>
                </TouchableOpacity>
                <View style={styles.pageBtnActive}>
                  <Text style={styles.pageBtnTextActive}>1</Text>
                </View>
                <TouchableOpacity style={styles.pageBtnDisabled} disabled={true}>
                  <Text style={styles.pageBtnTextDisabled}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>

        {/* DETAILED SCHEDULE PREVIEW MODAL */}
        <Modal
          visible={selectedRecord !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedRecord(null)}
        >
          <View style={styles.modalBackdrop}>
            {selectedRecord && (
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F0F9FF']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={styles.modalIconBox}>
                      <MaterialIcons name="event" size={26} color="#0284C7" />
                    </View>
                    <View>
                      <Text style={styles.modalTitle}>{selectedRecord.course} Exam Schedule</Text>
                      <Text style={styles.modalSubTitle}>{selectedRecord.className} | {selectedRecord.term}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedRecord(null)} style={styles.closeBtn}>
                    <MaterialIcons name="close" size={26} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.modalInfoBox}>
                    <Text style={styles.modalCourseName}>{selectedRecord.course} Paper</Text>
                    <Text style={styles.modalClassText}>Class: {selectedRecord.className} ({selectedRecord.term})</Text>
                  </View>

                  <View style={styles.breakdownTable}>
                    <Text style={styles.tableTitle}>Exam Timetable & Allocation</Text>
                    
                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>EXAM DATE</Text>
                      <Text style={[styles.tableRowValue, { color: '#0284C7' }]}>{selectedRecord.examDate}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>SHIFT TIMING</Text>
                      <Text style={styles.tableRowValue}>{selectedRecord.startTime} - {selectedRecord.endTime}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>ROOM NUMBER</Text>
                      <Text style={[styles.tableRowValue, { color: '#059669' }]}>Room {selectedRecord.roomNo}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>WRITTEN MARK</Text>
                      <Text style={styles.tableRowValue}>{selectedRecord.writtenMark} Marks</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>IS GRADE APPLICABLE</Text>
                      <Text style={styles.tableRowValue}>{selectedRecord.isGrade}</Text>
                    </View>
                  </View>

                  <View style={{ marginTop: 18, gap: 6 }}>
                    <Text style={styles.modalTimestampText}>CREATED AT: {selectedRecord.createdAt}</Text>
                  </View>
                </ScrollView>

                {/* Modal Footer Download Button */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.downloadBtn} 
                    onPress={() => {
                      alert('Exported Exam Schedule & Syllabus PDF successfully.');
                      setSelectedRecord(null);
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#0284C7', '#0369A1']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <MaterialIcons name="file-download" size={24} color="#FFFFFF" />
                    <Text style={styles.downloadBtnText}>Download Timetable PDF</Text>
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

  // Glowing ambient background circles
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
    padding: 16,
    paddingBottom: 110,
  },

  // Ledger Container Card
  ledgerCard: {
    borderRadius: 26,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(186, 230, 253, 0.95)',
    position: 'relative',
    overflow: 'hidden',
    gap: 16,
    elevation: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  topBlueStrip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 5,
    backgroundColor: '#0284C7',
  },
  portalTitleBox: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  portalTitleText: {
    fontSize: 17.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Export Toolbar
  exportToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  exportLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0369A1',
  },
  exportBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  exportIconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    elevation: 2,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  exportText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0284C7',
  },

  // Search Row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchLabel: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(186, 230, 253, 0.9)',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 14.5,
    fontWeight: '700',
  },

  // SHARP & EASY TO READ CARDS
  recordsList: {
    gap: 14,
  },
  sharpRecordCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(186, 230, 253, 0.9)',
    position: 'relative',
    overflow: 'hidden',
    gap: 12,
    elevation: 4,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  leftBlueTag: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: 5,
    backgroundColor: '#0284C7',
  },
  sharpCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E0F2FE',
    paddingBottom: 10,
  },
  courseTitleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  classPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  classPillText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0284C7',
  },
  termSubText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
  },
  sharpViewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sharpViewBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  // Key Info Pills Row
  keyInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  infoPillText: {
    fontSize: 14.5,
    fontWeight: '900',
  },

  // Marks Summary Strip
  marksSummaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#E0F2FE',
  },
  markCol: {
    alignItems: 'center',
    gap: 2,
  },
  markColLabel: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#475569',
  },
  markColValue: {
    fontSize: 16.5,
    fontWeight: '900',
  },
  markDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0F2FE',
  },

  // Pagination
  paginationRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: 1.5,
    borderTopColor: '#E0F2FE',
  },
  entriesText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  paginationBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageBtnDisabled: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  pageBtnTextDisabled: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#94A3B8',
  },
  pageBtnActive: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#0284C7',
  },
  pageBtnTextActive: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
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
    borderBottomColor: '#E0F2FE',
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
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
  modalInfoBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    marginBottom: 18,
  },
  modalCourseName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalClassText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#64748B',
    marginTop: 3,
  },
  breakdownTable: {
    gap: 14,
  },
  tableTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0F2FE',
  },
  tableRowLabel: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#475569',
  },
  tableRowValue: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalTimestampText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#64748B',
  },
  modalFooter: {
    padding: 18,
    borderTopWidth: 1.5,
    borderTopColor: '#E0F2FE',
  },
  downloadBtn: {
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
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
