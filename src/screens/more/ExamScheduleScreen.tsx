import React, { useState } from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PremiumDateTimePicker } from '../../components/PremiumDateTimePicker';
import { useAppTheme } from '../../context/ThemeContext';

// Universal Full-Viewport Modal for Web & Mobile
const ViewportModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ visible, onClose, children }) => {
  if (!visible) return null;

  if (Platform.OS === 'web' && typeof document !== 'undefined' && (ReactDOM as any)?.createPortal) {
    return (ReactDOM as any).createPortal(
      <View style={styles.webModalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        {children}
      </View>,
      document.body
    );
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        {children}
      </View>
    </Modal>
  );
};

export type ScheduleRecord = {
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
  const { theme: appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';

  // Search & Modal States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ScheduleRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<ScheduleRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // App's Standard Date & Time Picker Triggers
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState<'start' | 'end' | null>(null);

  // Exact Exam Schedule Data for Teacher View
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([
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

  const handleDeleteRecord = (id: string) => {
    setSchedules(prev => prev.filter(item => item.id !== id));
    setDeleteConfirmId(null);
    if (selectedRecord?.id === id) setSelectedRecord(null);
  };

  const handleSaveEdit = () => {
    if (!editingRecord) return;
    setSchedules(prev => prev.map(item => item.id === editingRecord.id ? editingRecord : item));
    if (selectedRecord?.id === editingRecord.id) {
      setSelectedRecord(editingRecord);
    }
    setEditingRecord(null);
  };

  return (
    <View style={[styles.root, !isDefaultTheme && { backgroundColor: appTheme.bg }]}>
      <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: 'transparent' }]} edges={['top']}>
        {/* App Bar Header */}
        <View style={[styles.appBar, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={[styles.backButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color={isDefaultTheme ? "#0F172A" : appTheme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Exam Schedule</Text>
          </View>
          <TouchableOpacity style={[styles.appBarIconButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} activeOpacity={0.7}>
            <MaterialIcons name="event-note" size={20} color={appTheme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* MAIN EXAM SCHEDULE CONTAINER */}
          <View style={[styles.ledgerCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
            
            {/* Header Title Banner */}
            <View style={[styles.portalTitleBox, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
              <MaterialIcons name="calendar-today" size={18} color={appTheme.primary} />
              <Text style={[styles.portalTitleText, !isDefaultTheme && { color: appTheme.textPrimary }]}>Timetable & Exam Schedule</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchRow}>
              <Text style={[styles.searchLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Search:</Text>
              <View style={[styles.searchWrapper, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                <MaterialIcons name="search" size={18} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} style={{ marginRight: 6 }} />
                <TextInput
                  style={[styles.searchInput, !isDefaultTheme && { color: appTheme.textPrimary }]}
                  placeholder="Search subject, class, room..."
                  placeholderTextColor={isDefaultTheme ? "#64748B" : appTheme.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                    <MaterialIcons name="close" size={16} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* RECORD CARDS */}
            <View style={styles.recordsList}>
              {filteredSchedules.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="event-busy" size={40} color={isDefaultTheme ? "#94A3B8" : appTheme.textSecondary} />
                  <Text style={[styles.emptyTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>No Exam Schedules Found</Text>
                  <Text style={[styles.emptyDesc, !isDefaultTheme && { color: appTheme.textSecondary }]}>Try searching with a different subject or room.</Text>
                </View>
              ) : (
                filteredSchedules.map((item) => (
                  <View key={item.id} style={[styles.sharpRecordCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
                    {/* Left Accent indicator line */}
                    <View style={[styles.leftBlueTag, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />

                    {/* 1. Header: Course Title & Actions */}
                    <View style={styles.sharpCardHeader}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <Text style={[styles.courseTitleText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{item.course}</Text>
                          <View style={[styles.classPill, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                            <Text style={[styles.classPillText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{item.className}</Text>
                          </View>
                        </View>
                        <Text style={[styles.termSubText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{item.term} • Grading: {item.isGrade}</Text>
                      </View>

                      {/* Action Button: View Only */}
                      <View style={styles.cardActionsRow}>
                        <TouchableOpacity 
                          style={[styles.actionBtnView, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                          onPress={() => setSelectedRecord(item)}
                          activeOpacity={0.8}
                        >
                          <MaterialIcons name="visibility" size={15} color={appTheme.primary} />
                          <Text style={[styles.actionBtnViewText, !isDefaultTheme && { color: appTheme.primary }]}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* 2. Structured Info Grid (Date, Time, Room) */}
                    <View style={[styles.structuredInfoBox, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                      <View style={styles.infoRowItem}>
                        <View style={[styles.infoIconBox, !isDefaultTheme && { backgroundColor: appTheme.primary + '18' }]}>
                          <MaterialIcons name="event" size={16} color={appTheme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.infoLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>EXAM DATE</Text>
                          <Text style={[styles.infoValueDark, !isDefaultTheme && { color: appTheme.textPrimary }]}>{item.examDate}</Text>
                        </View>
                      </View>

                      <View style={[styles.infoRowDivider, !isDefaultTheme && { backgroundColor: appTheme.border }]} />

                      <View style={styles.infoRowItem}>
                        <View style={[styles.infoIconBox, !isDefaultTheme && { backgroundColor: appTheme.accent + '18' }]}>
                          <MaterialIcons name="schedule" size={16} color={isDefaultTheme ? "#7E22CE" : appTheme.accent} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.infoLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>TIMING</Text>
                          <Text style={[styles.infoValueDark, !isDefaultTheme && { color: appTheme.textPrimary }]}>{item.startTime} - {item.endTime}</Text>
                        </View>
                      </View>

                      <View style={[styles.infoRowDivider, !isDefaultTheme && { backgroundColor: appTheme.border }]} />

                      <View style={styles.infoRowItem}>
                        <View style={[styles.infoIconBox, !isDefaultTheme && { backgroundColor: isDefaultTheme ? '#ECFDF5' : appTheme.primary + '18' }]}>
                          <MaterialIcons name="meeting-room" size={16} color={isDefaultTheme ? "#059669" : appTheme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.infoLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>ROOM</Text>
                          <Text style={[styles.infoValueDark, { color: isDefaultTheme ? '#059669' : appTheme.primary }]}>Room {item.roomNo}</Text>
                        </View>
                      </View>
                    </View>

                    {/* 3. Clean Marks Summary Row */}
                    <View style={[styles.marksSummaryStrip, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                      <View style={styles.markCol}>
                        <Text style={[styles.markColLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>WRITTEN</Text>
                        <Text style={[styles.markColValue, { color: isDefaultTheme ? '#0284C7' : appTheme.primary }]}>{item.writtenMark}</Text>
                      </View>
                      <View style={[styles.markDivider, !isDefaultTheme && { backgroundColor: appTheme.border }]} />
                      <View style={styles.markCol}>
                        <Text style={[styles.markColLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>PRACTICAL</Text>
                        <Text style={[styles.markColValue, { color: item.practicalMark !== '-' ? (isDefaultTheme ? '#D97706' : appTheme.accent) : (isDefaultTheme ? '#64748B' : appTheme.textSecondary) }]}>
                          {item.practicalMark}
                        </Text>
                      </View>
                      <View style={[styles.markDivider, !isDefaultTheme && { backgroundColor: appTheme.border }]} />
                      <View style={styles.markCol}>
                        <Text style={[styles.markColLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>THEORY</Text>
                        <Text style={[styles.markColValue, { color: item.theoryMark !== '-' ? (isDefaultTheme ? '#4F46E5' : appTheme.primary) : (isDefaultTheme ? '#64748B' : appTheme.textSecondary) }]}>
                          {item.theoryMark}
                        </Text>
                      </View>
                      <View style={[styles.markDivider, !isDefaultTheme && { backgroundColor: appTheme.border }]} />
                      <View style={styles.markCol}>
                        <Text style={[styles.markColLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>VIVA</Text>
                        <Text style={[styles.markColValue, { color: item.vivaMark !== '-' ? (isDefaultTheme ? '#059669' : appTheme.primary) : (isDefaultTheme ? '#64748B' : appTheme.textSecondary) }]}>
                          {item.vivaMark}
                        </Text>
                      </View>
                    </View>

                  </View>
                ))
              )}
            </View>

            {/* Pagination Controls Footer */}
            <View style={[styles.paginationRow, !isDefaultTheme && { borderTopColor: appTheme.border }]}>
              <Text style={[styles.entriesText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Showing 1 to {filteredSchedules.length} of {schedules.length} entries</Text>
              <View style={styles.paginationBtns}>
                <TouchableOpacity style={[styles.pageBtnDisabled, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} disabled={true}>
                  <Text style={[styles.pageBtnTextDisabled, !isDefaultTheme && { color: appTheme.textSecondary }]}>Prev</Text>
                </TouchableOpacity>
                <View style={[styles.pageBtnActive, !isDefaultTheme && { backgroundColor: appTheme.primary }]}>
                  <Text style={styles.pageBtnTextActive}>1</Text>
                </View>
                <TouchableOpacity style={[styles.pageBtnDisabled, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} disabled={true}>
                  <Text style={[styles.pageBtnTextDisabled, !isDefaultTheme && { color: appTheme.textSecondary }]}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>

        {/* DETAILED SCHEDULE PREVIEW MODAL */}
        <ViewportModal
          visible={selectedRecord !== null}
          onClose={() => setSelectedRecord(null)}
        >
          {selectedRecord && (
            <View style={[styles.modalContainer, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
              {/* Modal Header */}
              <View style={[styles.modalHeader, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={[styles.modalIconBox, !isDefaultTheme && { backgroundColor: appTheme.primary + '18' }]}>
                    <MaterialIcons name="event-available" size={22} color={appTheme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedRecord.course} Timetable</Text>
                    <Text style={[styles.modalSubTitle, !isDefaultTheme && { color: appTheme.textSecondary }]}>{selectedRecord.className} • {selectedRecord.term}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedRecord(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={[styles.breakdownTable, !isDefaultTheme && { borderColor: appTheme.border }]}>
                  <View style={[styles.tableHeaderRow, !isDefaultTheme && { backgroundColor: appTheme.surface, borderBottomColor: appTheme.border }]}>
                    <Text style={[styles.tableHeaderTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Schedule Information</Text>
                  </View>
                  
                  <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                    <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>EXAM DATE</Text>
                    <Text style={[styles.tableRowValue, { color: isDefaultTheme ? '#0284C7' : appTheme.primary, fontWeight: '900' }]}>{selectedRecord.examDate}</Text>
                  </View>

                  <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                    <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>SHIFT TIMING</Text>
                    <Text style={[styles.tableRowValue, !isDefaultTheme && { color: appTheme.textPrimary }, { fontWeight: '900' }]}>{selectedRecord.startTime} - {selectedRecord.endTime}</Text>
                  </View>

                  <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                    <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>ROOM NUMBER</Text>
                    <Text style={[styles.tableRowValue, { color: isDefaultTheme ? '#059669' : appTheme.primary, fontWeight: '900' }]}>Room {selectedRecord.roomNo}</Text>
                  </View>

                  <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                    <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>WRITTEN MARK</Text>
                    <Text style={[styles.tableRowValue, !isDefaultTheme && { color: appTheme.textPrimary }, { fontWeight: '800' }]}>{selectedRecord.writtenMark} Marks</Text>
                  </View>

                  <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                    <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>PRACTICAL MARK</Text>
                    <Text style={[styles.tableRowValue, !isDefaultTheme && { color: appTheme.textPrimary }, { fontWeight: '800' }]}>{selectedRecord.practicalMark}</Text>
                  </View>

                  <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                    <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>IS GRADE APPLICABLE</Text>
                    <Text style={[styles.tableRowValue, !isDefaultTheme && { color: appTheme.textPrimary }, { fontWeight: '800' }]}>{selectedRecord.isGrade}</Text>
                  </View>
                </View>

                <Text style={[styles.modalTimestampText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Created: {selectedRecord.createdAt}</Text>
              </ScrollView>

              {/* Modal Footer Actions */}
              <View style={[styles.modalFooter, !isDefaultTheme && { borderTopColor: appTheme.border }]}>
                <TouchableOpacity 
                  style={[styles.modalActionEditBtn, !isDefaultTheme && { backgroundColor: appTheme.primary }]} 
                  onPress={() => {
                    setEditingRecord({ ...selectedRecord });
                    setSelectedRecord(null);
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="edit" size={16} color="#FFFFFF" />
                  <Text style={styles.modalActionEditBtnText}>Edit Schedule</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.downloadBtn, !isDefaultTheme && { backgroundColor: isDefaultTheme ? '#059669' : appTheme.accent }]} 
                  onPress={() => {
                    alert('Exported Exam Schedule & Syllabus PDF successfully.');
                    setSelectedRecord(null);
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="file-download" size={16} color="#FFFFFF" />
                  <Text style={styles.downloadBtnText}>Export PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ViewportModal>

        {/* EDIT SCHEDULE MODAL */}
        <ViewportModal
          visible={editingRecord !== null}
          onClose={() => setEditingRecord(null)}
        >
          {editingRecord && (
            <View style={[styles.modalContainer, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
              <View style={[styles.modalHeader, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={[styles.modalIconBox, { backgroundColor: isDefaultTheme ? '#FFFBEB' : appTheme.accent + '18' }]}>
                    <MaterialIcons name="edit" size={20} color={isDefaultTheme ? "#D97706" : appTheme.accent} />
                  </View>
                  <Text style={[styles.modalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Edit {editingRecord.course} Schedule</Text>
                </View>
                <TouchableOpacity onPress={() => setEditingRecord(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                
                {/* 1. Exam Date Picker Button (Global PremiumDateTimePicker) */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Exam Date</Text>
                  <TouchableOpacity 
                    style={[styles.pickerFieldButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                    onPress={() => setIsDatePickerOpen(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.pickerFieldLeft}>
                      <MaterialIcons name="event" size={18} color={appTheme.primary} />
                      <Text style={[styles.pickerFieldValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{editingRecord.examDate}</Text>
                    </View>
                    <MaterialIcons name="calendar-today" size={18} color={appTheme.primary} />
                  </TouchableOpacity>
                </View>

                {/* 2. Start Time & End Time Picker Buttons (Global PremiumDateTimePicker) */}
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={[styles.formLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Start Time</Text>
                    <TouchableOpacity 
                      style={[styles.pickerFieldButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                      onPress={() => setTimePickerTarget('start')}
                      activeOpacity={0.8}
                    >
                      <View style={styles.pickerFieldLeft}>
                        <MaterialIcons name="access-time" size={18} color={isDefaultTheme ? "#7E22CE" : appTheme.accent} />
                        <Text style={[styles.pickerFieldValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{editingRecord.startTime}</Text>
                      </View>
                      <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={[styles.formLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>End Time</Text>
                    <TouchableOpacity 
                      style={[styles.pickerFieldButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                      onPress={() => setTimePickerTarget('end')}
                      activeOpacity={0.8}
                    >
                      <View style={styles.pickerFieldLeft}>
                        <MaterialIcons name="access-time" size={18} color={isDefaultTheme ? "#7E22CE" : appTheme.accent} />
                        <Text style={[styles.pickerFieldValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{editingRecord.endTime}</Text>
                      </View>
                      <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 3. Room Number */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Room Number</Text>
                  <TextInput
                    style={[styles.formInput, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border, color: appTheme.textPrimary }]}
                    value={editingRecord.roomNo}
                    onChangeText={(val) => setEditingRecord({ ...editingRecord, roomNo: val })}
                  />
                </View>

                {/* 4. Written Marks */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Written Marks</Text>
                  <TextInput
                    style={[styles.formInput, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border, color: appTheme.textPrimary }]}
                    keyboardType="numeric"
                    value={editingRecord.writtenMark.toString()}
                    onChangeText={(val) => setEditingRecord({ ...editingRecord, writtenMark: parseInt(val) || 0 })}
                  />
                </View>
              </ScrollView>

              <View style={[styles.modalFooter, !isDefaultTheme && { borderTopColor: appTheme.border }]}>
                <TouchableOpacity 
                  style={[styles.modalCancelBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                  onPress={() => setEditingRecord(null)}
                >
                  <Text style={[styles.modalCancelBtnText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalSaveBtn, !isDefaultTheme && { backgroundColor: appTheme.primary }]} 
                  onPress={handleSaveEdit}
                >
                  <MaterialIcons name="check" size={16} color="#FFFFFF" />
                  <Text style={styles.modalSaveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ViewportModal>

        {/* ── APP'S OFFICIAL DATE PICKER MODAL (SAME AS HOMEWORK & ACTIVITY) ── */}
        {editingRecord && (
          <PremiumDateTimePicker
            visible={isDatePickerOpen}
            onClose={() => setIsDatePickerOpen(false)}
            value={editingRecord.examDate || '28 Jun 2026'}
            title="Select Exam Date"
            showTime={false}
            mode="date"
            onSelect={(newDate) => {
              setEditingRecord({ ...editingRecord, examDate: newDate });
              setIsDatePickerOpen(false);
            }}
          />
        )}

        {/* ── APP'S OFFICIAL TIME PICKER MODAL (SAME AS HOMEWORK & ACTIVITY) ── */}
        {editingRecord && timePickerTarget !== null && (
          <PremiumDateTimePicker
            visible={timePickerTarget !== null}
            onClose={() => setTimePickerTarget(null)}
            value={timePickerTarget === 'start' ? editingRecord.startTime : editingRecord.endTime}
            title={timePickerTarget === 'start' ? 'Select Start Time' : 'Select End Time'}
            mode="time"
            onSelect={(newTime) => {
              if (timePickerTarget === 'start') {
                setEditingRecord({ ...editingRecord, startTime: newTime });
              } else {
                setEditingRecord({ ...editingRecord, endTime: newTime });
              }
              setTimePickerTarget(null);
            }}
          />
        )}

        {/* DELETE CONFIRMATION MODAL */}
        <ViewportModal
          visible={deleteConfirmId !== null}
          onClose={() => setDeleteConfirmId(null)}
        >
          {deleteConfirmId && (
            <View style={[styles.modalContainer, { maxWidth: 380 }, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
              <View style={styles.deleteConfirmIconBox}>
                <MaterialIcons name="delete-forever" size={32} color="#EF4444" />
              </View>
              <Text style={[styles.deleteConfirmTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Delete Exam Schedule?</Text>
              <Text style={[styles.deleteConfirmDesc, !isDefaultTheme && { color: appTheme.textSecondary }]}>Are you sure you want to delete this exam schedule record? This action cannot be undone.</Text>
              
              <View style={[styles.modalFooter, !isDefaultTheme && { borderTopColor: appTheme.border }]}>
                <TouchableOpacity 
                  style={[styles.modalCancelBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                  onPress={() => setDeleteConfirmId(null)}
                >
                  <Text style={[styles.modalCancelBtnText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalDeleteConfirmBtn} 
                  onPress={() => deleteConfirmId && handleDeleteRecord(deleteConfirmId)}
                >
                  <Text style={styles.modalDeleteConfirmBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ViewportModal>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 720,
  },

  // App Bar Header
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  appBarIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    padding: 12,
    paddingBottom: 90,
  },

  // Ledger Container Card
  ledgerCard: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  portalTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
  },
  portalTitleText: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },

  // Search Row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },

  // Record Card
  recordsList: {
    gap: 12,
  },
  sharpRecordCard: {
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    position: 'relative',
    overflow: 'hidden',
    gap: 12,
  },
  leftBlueTag: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#0284C7',
  },
  sharpCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 4,
    gap: 8,
  },
  courseTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  classPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  classPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0284C7',
  },
  termSubText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '700',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  actionBtnViewText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0284C7',
  },
  actionBtnEdit: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDelete: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Structured Info Box (Date, Time, Room)
  structuredInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  infoRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  infoValueDark: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },

  // Horizontal Marks Summary Strip
  marksSummaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  markCol: {
    alignItems: 'center',
    flex: 1,
  },
  markColLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.2,
  },
  markColValue: {
    fontSize: 13.5,
    fontWeight: '900',
    marginTop: 2,
  },
  markDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#CBD5E1',
  },

  // Pagination
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  entriesText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  paginationBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageBtnDisabled: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pageBtnTextDisabled: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
  pageBtnActive: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnTextActive: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#334155',
  },
  emptyDesc: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
  },

  // Modal Dialogs Overlays
  webModalOverlay: {
    position: 'fixed' as any,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  // Modal Container
  modalContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    elevation: 8,
    zIndex: 10000,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubTitle: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    maxHeight: 380,
    marginVertical: 12,
  },

  // Breakdown Table for View Modal
  breakdownTable: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  tableHeaderRow: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tableHeaderTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
  },
  tableRowValue: {
    fontSize: 13.5,
    color: '#0F172A',
  },
  modalTimestampText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },

  // Modal Footer
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  modalActionEditBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalActionEditBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  downloadBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  downloadBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Edit Modal Form
  formGroup: {
    gap: 4,
    marginBottom: 10,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  formInput: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Date / Time Picker Trigger Button
  pickerFieldButton: {
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  pickerFieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerFieldValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },

  modalCancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#475569',
  },
  modalSaveBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modalSaveBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Delete Confirm
  deleteConfirmIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  deleteConfirmTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  deleteConfirmDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  modalDeleteConfirmBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteConfirmBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});
