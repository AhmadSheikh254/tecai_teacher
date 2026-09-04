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
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* App Bar Header */}
        <View style={styles.appBar}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Exam Schedule</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="event-note" size={20} color="#0284C7" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* MAIN EXAM SCHEDULE CONTAINER */}
          <View style={styles.ledgerCard}>
            
            {/* Header Title Banner */}
            <View style={styles.portalTitleBox}>
              <MaterialIcons name="calendar-today" size={18} color="#0284C7" />
              <Text style={styles.portalTitleText}>Timetable & Exam Schedule</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchRow}>
              <Text style={styles.searchLabel}>Search:</Text>
              <View style={styles.searchWrapper}>
                <MaterialIcons name="search" size={18} color="#64748B" style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search subject, class, room..."
                  placeholderTextColor="#64748B"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                    <MaterialIcons name="close" size={16} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* RECORD CARDS */}
            <View style={styles.recordsList}>
              {filteredSchedules.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="event-busy" size={40} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>No Exam Schedules Found</Text>
                  <Text style={styles.emptyDesc}>Try searching with a different subject or room.</Text>
                </View>
              ) : (
                filteredSchedules.map((item) => (
                  <View key={item.id} style={styles.sharpRecordCard}>
                    {/* Left Accent indicator line */}
                    <View style={styles.leftBlueTag} />

                    {/* 1. Header: Course Title & Actions */}
                    <View style={styles.sharpCardHeader}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <Text style={styles.courseTitleText}>{item.course}</Text>
                          <View style={styles.classPill}>
                            <Text style={styles.classPillText}>{item.className}</Text>
                          </View>
                        </View>
                        <Text style={styles.termSubText}>{item.term} • Grading: {item.isGrade}</Text>
                      </View>

                      {/* Action Button: View Only */}
                      <View style={styles.cardActionsRow}>
                        <TouchableOpacity 
                          style={styles.actionBtnView} 
                          onPress={() => setSelectedRecord(item)}
                          activeOpacity={0.8}
                        >
                          <MaterialIcons name="visibility" size={15} color="#0284C7" />
                          <Text style={styles.actionBtnViewText}>View</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* 2. Structured Info Grid (Date, Time, Room) */}
                    <View style={styles.structuredInfoBox}>
                      <View style={styles.infoRowItem}>
                        <View style={styles.infoIconBox}>
                          <MaterialIcons name="event" size={16} color="#0284C7" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoLabel}>EXAM DATE</Text>
                          <Text style={styles.infoValueDark}>{item.examDate}</Text>
                        </View>
                      </View>

                      <View style={styles.infoRowDivider} />

                      <View style={styles.infoRowItem}>
                        <View style={styles.infoIconBox}>
                          <MaterialIcons name="schedule" size={16} color="#7E22CE" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoLabel}>TIMING</Text>
                          <Text style={styles.infoValueDark}>{item.startTime} - {item.endTime}</Text>
                        </View>
                      </View>

                      <View style={styles.infoRowDivider} />

                      <View style={styles.infoRowItem}>
                        <View style={styles.infoIconBox}>
                          <MaterialIcons name="meeting-room" size={16} color="#059669" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.infoLabel}>ROOM</Text>
                          <Text style={[styles.infoValueDark, { color: '#059669' }]}>Room {item.roomNo}</Text>
                        </View>
                      </View>
                    </View>

                    {/* 3. Clean Marks Summary Row */}
                    <View style={styles.marksSummaryStrip}>
                      <View style={styles.markCol}>
                        <Text style={styles.markColLabel}>WRITTEN</Text>
                        <Text style={[styles.markColValue, { color: '#0284C7' }]}>{item.writtenMark}</Text>
                      </View>
                      <View style={styles.markDivider} />
                      <View style={styles.markCol}>
                        <Text style={styles.markColLabel}>PRACTICAL</Text>
                        <Text style={[styles.markColValue, { color: item.practicalMark !== '-' ? '#D97706' : '#64748B' }]}>
                          {item.practicalMark}
                        </Text>
                      </View>
                      <View style={styles.markDivider} />
                      <View style={styles.markCol}>
                        <Text style={styles.markColLabel}>THEORY</Text>
                        <Text style={[styles.markColValue, { color: item.theoryMark !== '-' ? '#4F46E5' : '#64748B' }]}>
                          {item.theoryMark}
                        </Text>
                      </View>
                      <View style={styles.markDivider} />
                      <View style={styles.markCol}>
                        <Text style={styles.markColLabel}>VIVA</Text>
                        <Text style={[styles.markColValue, { color: item.vivaMark !== '-' ? '#059669' : '#64748B' }]}>
                          {item.vivaMark}
                        </Text>
                      </View>
                    </View>

                  </View>
                ))
              )}
            </View>

            {/* Pagination Controls Footer */}
            <View style={styles.paginationRow}>
              <Text style={styles.entriesText}>Showing 1 to {filteredSchedules.length} of {schedules.length} entries</Text>
              <View style={styles.paginationBtns}>
                <TouchableOpacity style={styles.pageBtnDisabled} disabled={true}>
                  <Text style={styles.pageBtnTextDisabled}>Prev</Text>
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
        <ViewportModal
          visible={selectedRecord !== null}
          onClose={() => setSelectedRecord(null)}
        >
          {selectedRecord && (
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={styles.modalIconBox}>
                    <MaterialIcons name="event-available" size={22} color="#0284C7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selectedRecord.course} Timetable</Text>
                    <Text style={styles.modalSubTitle}>{selectedRecord.className} • {selectedRecord.term}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedRecord(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.breakdownTable}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={styles.tableHeaderTitle}>Schedule Information</Text>
                  </View>
                  
                  <View style={styles.tableRow}>
                    <Text style={styles.tableRowLabel}>EXAM DATE</Text>
                    <Text style={[styles.tableRowValue, { color: '#0284C7', fontWeight: '900' }]}>{selectedRecord.examDate}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableRowLabel}>SHIFT TIMING</Text>
                    <Text style={[styles.tableRowValue, { fontWeight: '900' }]}>{selectedRecord.startTime} - {selectedRecord.endTime}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableRowLabel}>ROOM NUMBER</Text>
                    <Text style={[styles.tableRowValue, { color: '#059669', fontWeight: '900' }]}>Room {selectedRecord.roomNo}</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableRowLabel}>WRITTEN MARK</Text>
                    <Text style={[styles.tableRowValue, { fontWeight: '800' }]}>{selectedRecord.writtenMark} Marks</Text>
                  </View>

                  <View style={styles.tableRow}>
                    <Text style={styles.tableRowLabel}>PRACTICAL MARK</Text>
                    <Text style={[styles.tableRowValue, { fontWeight: '800' }]}>{selectedRecord.practicalMark}</Text>
                  </View>

                  <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                    <Text style={styles.tableRowLabel}>IS GRADE APPLICABLE</Text>
                    <Text style={[styles.tableRowValue, { fontWeight: '800' }]}>{selectedRecord.isGrade}</Text>
                  </View>
                </View>

                <Text style={styles.modalTimestampText}>Created: {selectedRecord.createdAt}</Text>
              </ScrollView>

              {/* Modal Footer Actions */}
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.modalActionEditBtn} 
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
                  style={styles.downloadBtn} 
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
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={[styles.modalIconBox, { backgroundColor: '#FFFBEB' }]}>
                    <MaterialIcons name="edit" size={20} color="#D97706" />
                  </View>
                  <Text style={styles.modalTitle}>Edit {editingRecord.course} Schedule</Text>
                </View>
                <TouchableOpacity onPress={() => setEditingRecord(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                
                {/* 1. Exam Date Picker Button (Global PremiumDateTimePicker) */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Exam Date</Text>
                  <TouchableOpacity 
                    style={styles.pickerFieldButton} 
                    onPress={() => setIsDatePickerOpen(true)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.pickerFieldLeft}>
                      <MaterialIcons name="event" size={18} color="#0284C7" />
                      <Text style={styles.pickerFieldValue}>{editingRecord.examDate}</Text>
                    </View>
                    <MaterialIcons name="calendar-today" size={18} color="#0284C7" />
                  </TouchableOpacity>
                </View>

                {/* 2. Start Time & End Time Picker Buttons (Global PremiumDateTimePicker) */}
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>Start Time</Text>
                    <TouchableOpacity 
                      style={styles.pickerFieldButton} 
                      onPress={() => setTimePickerTarget('start')}
                      activeOpacity={0.8}
                    >
                      <View style={styles.pickerFieldLeft}>
                        <MaterialIcons name="access-time" size={18} color="#7E22CE" />
                        <Text style={styles.pickerFieldValue}>{editingRecord.startTime}</Text>
                      </View>
                      <MaterialIcons name="arrow-drop-down" size={20} color="#64748B" />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Text style={styles.formLabel}>End Time</Text>
                    <TouchableOpacity 
                      style={styles.pickerFieldButton} 
                      onPress={() => setTimePickerTarget('end')}
                      activeOpacity={0.8}
                    >
                      <View style={styles.pickerFieldLeft}>
                        <MaterialIcons name="access-time" size={18} color="#7E22CE" />
                        <Text style={styles.pickerFieldValue}>{editingRecord.endTime}</Text>
                      </View>
                      <MaterialIcons name="arrow-drop-down" size={20} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 3. Room Number */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Room Number</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editingRecord.roomNo}
                    onChangeText={(val) => setEditingRecord({ ...editingRecord, roomNo: val })}
                  />
                </View>

                {/* 4. Written Marks */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Written Marks</Text>
                  <TextInput
                    style={styles.formInput}
                    keyboardType="numeric"
                    value={editingRecord.writtenMark.toString()}
                    onChangeText={(val) => setEditingRecord({ ...editingRecord, writtenMark: parseInt(val) || 0 })}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.modalCancelBtn} 
                  onPress={() => setEditingRecord(null)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalSaveBtn} 
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
            <View style={[styles.modalContainer, { maxWidth: 380 }]}>
              <View style={styles.deleteConfirmIconBox}>
                <MaterialIcons name="delete-forever" size={32} color="#EF4444" />
              </View>
              <Text style={styles.deleteConfirmTitle}>Delete Exam Schedule?</Text>
              <Text style={styles.deleteConfirmDesc}>Are you sure you want to delete this exam schedule record? This action cannot be undone.</Text>
              
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.modalCancelBtn} 
                  onPress={() => setDeleteConfirmId(null)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
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
