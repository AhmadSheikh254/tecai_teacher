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

export type SubjectMark = {
  sr: number;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  gradePct: string;
  gradeBadge: string;
};

export const ExamReportScreen = ({ navigation }: any) => {
  // Search Filter Criteria States
  const [selectedClass, setSelectedClass] = useState('GRADE-V');
  const [selectedStudent, setSelectedStudent] = useState('Muhammad Atif');
  const [selectedTerm, setSelectedTerm] = useState('1st Assessment');
  const [isFiltered, setIsFiltered] = useState(true);

  // Dropdown Picker Modal States
  const [pickerModalType, setPickerModalType] = useState<'class' | 'student' | 'term' | null>(null);

  // Editing subject modal
  const [editingSubject, setEditingSubject] = useState<SubjectMark | null>(null);
  const [viewingSubject, setViewingSubject] = useState<SubjectMark | null>(null);

  // Student Report Data
  const studentInfo = {
    name: selectedStudent,
    class: selectedClass,
    section: 'A',
    rollNo: '3',
    campus: 'Beaconhouse School System - Main Campus',
  };

  const [subjectMarks, setSubjectMarks] = useState<SubjectMark[]>([
    { sr: 1, subject: 'English', totalMarks: 100, obtainedMarks: 88, gradePct: '88%', gradeBadge: 'A' },
    { sr: 2, subject: 'Mathematics', totalMarks: 100, obtainedMarks: 95, gradePct: '95%', gradeBadge: 'A+' },
    { sr: 3, subject: 'Science', totalMarks: 100, obtainedMarks: 84, gradePct: '84%', gradeBadge: 'A' },
    { sr: 4, subject: 'Urdu', totalMarks: 100, obtainedMarks: 78, gradePct: '78%', gradeBadge: 'B' },
    { sr: 5, subject: 'Computer Science', totalMarks: 100, obtainedMarks: 92, gradePct: '92%', gradeBadge: 'A+' },
  ]);

  // Calculations
  const totalMaxMarks = subjectMarks.reduce((acc, curr) => acc + curr.totalMarks, 0);
  const totalObtMarks = subjectMarks.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
  const overallPct = totalMaxMarks > 0 ? Math.round((totalObtMarks / totalMaxMarks) * 100) : 0;
  const overallGrade = 
    overallPct >= 90 ? 'A+' :
    overallPct >= 80 ? 'A' :
    overallPct >= 70 ? 'B' :
    overallPct >= 60 ? 'C' :
    overallPct >= 50 ? 'D' : 'F';

  // Options for Dropdowns
  const classOptions = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V'];
  const studentOptions = ['Muhammad Atif', 'Febin Naeem', 'Janan Anees', 'Maaz', 'Mahira Shah'];
  const termOptions = ['1st Assessment', '2nd Assessment', 'Midterm', 'Final Exam'];

  const handlePrintReport = () => {
    alert(`Downloading official Report Card for ${selectedStudent} (${selectedTerm})...`);
  };

  const handleShareReport = () => {
    alert(`Sharing Report Card link for ${selectedStudent}`);
  };

  const handleSaveSubjectEdit = () => {
    if (!editingSubject) return;
    const obt = editingSubject.obtainedMarks;
    const max = editingSubject.totalMarks;
    const pct = max > 0 ? Math.round((obt / max) * 100) : 0;
    const grade = 
      pct >= 90 ? 'A+' :
      pct >= 80 ? 'A' :
      pct >= 70 ? 'B' :
      pct >= 60 ? 'C' :
      pct >= 50 ? 'D' : 'F';

    const updated = {
      ...editingSubject,
      gradePct: pct + '%',
      gradeBadge: grade,
    };

    setSubjectMarks(prev => prev.map(s => s.sr === editingSubject.sr ? updated : s));
    setEditingSubject(null);
  };

  const getPickerOptions = () => {
    switch (pickerModalType) {
      case 'class': return { title: 'Select Class', options: classOptions, current: selectedClass, onSelect: setSelectedClass };
      case 'student': return { title: 'Select Student', options: studentOptions, current: selectedStudent, onSelect: setSelectedStudent };
      case 'term': return { title: 'Select Exam Term', options: termOptions, current: selectedTerm, onSelect: setSelectedTerm };
      default: return null;
    }
  };

  const pickerData = getPickerOptions();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* App Bar Header */}
        <View style={styles.appBar}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Exam Report View</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} onPress={handlePrintReport} activeOpacity={0.7}>
            <MaterialIcons name="print" size={20} color="#0284C7" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA CARD FORM */}
          <View style={styles.filterCard}>
            <View style={styles.filterCardHeader}>
              <MaterialIcons name="tune" size={18} color="#0284C7" />
              <Text style={styles.filterCardTitle}>Select Report Card Criteria</Text>
            </View>

            {/* Form Fields Grid */}
            <View style={styles.formGrid}>
              {/* 1. Class */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Class <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setPickerModalType('class')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#EFF6FF' }]}>
                    <MaterialIcons name="school" size={16} color="#0284C7" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedClass}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* 2. Student */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Student <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setPickerModalType('student')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#F3E8FF' }]}>
                    <MaterialIcons name="person" size={16} color="#7E22CE" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedStudent}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* 3. Term */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Term <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setPickerModalType('term')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#ECFDF5' }]}>
                    <MaterialIcons name="event" size={16} color="#059669" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedTerm}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Button */}
            <TouchableOpacity 
              style={styles.findButton} 
              onPress={() => setIsFiltered(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="search" size={18} color="#FFFFFF" />
              <Text style={styles.findBtnText}>Generate Report Card</Text>
            </TouchableOpacity>

          </View>

          {/* GENERATED DIGITAL REPORT CARD */}
          {isFiltered && (
            <View style={styles.reportContainer}>
              {/* School Header Info */}
              <View style={styles.schoolHeaderBanner}>
                <MaterialIcons name="school" size={24} color="#0284C7" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.schoolNameText}>{studentInfo.campus}</Text>
                  <Text style={styles.reportCardSubtitle}>OFFICIAL PROGRESS REPORT • {selectedTerm}</Text>
                </View>
              </View>

              {/* Student Metadata Card Banner */}
              <View style={styles.studentMetaCard}>
                <View style={styles.studentMetaHeaderRow}>
                  <View style={styles.avatarTileBox}>
                    <MaterialIcons name="person" size={20} color="#0284C7" />
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.studentNameText}>{selectedStudent}</Text>
                    <Text style={styles.studentSubText}>Candidate Roll #{studentInfo.rollNo}</Text>
                  </View>

                  <View style={styles.rollBadge}>
                    <Text style={styles.rollBadgeText}>ROLL: {studentInfo.rollNo}</Text>
                  </View>
                </View>

                <View style={styles.metaGridThree}>
                  <View style={styles.metaSubItem}>
                    <Text style={styles.metaLabel}>Class:</Text>
                    <Text style={styles.metaVal}>{selectedClass}</Text>
                  </View>
                  <View style={styles.metaSubItem}>
                    <Text style={styles.metaLabel}>Section:</Text>
                    <Text style={styles.metaVal}>{studentInfo.section}</Text>
                  </View>
                  <View style={styles.metaSubItem}>
                    <Text style={styles.metaLabel}>Term:</Text>
                    <Text style={[styles.metaVal, { color: '#0284C7', fontWeight: '800' }]}>{selectedTerm}</Text>
                  </View>
                </View>
              </View>

              {/* Subject Academic Marks Breakdown */}
              <View style={styles.subjectListContainer}>
                <Text style={styles.sectionHeaderTitle}>Subject Academic Marks</Text>

                <View style={styles.subjectCardList}>
                  {subjectMarks.map((item) => (
                    <View key={item.sr} style={styles.subjectItemCard}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={styles.subjectSrText}>{item.sr}.</Text>
                          <Text style={styles.subjectNameText}>{item.subject}</Text>
                        </View>
                        <Text style={styles.subjectMarksText}>
                          Marks: <Text style={{ fontWeight: '800', color: '#0F172A' }}>{item.obtainedMarks}</Text> / {item.totalMarks} ({item.gradePct})
                        </Text>
                      </View>

                      {/* Grade Badge */}
                      <View style={styles.gradeBadgeContainer}>
                        <Text style={styles.gradeBadgeText}>{item.gradeBadge}</Text>
                      </View>

                      {/* Action buttons */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <TouchableOpacity 
                          style={styles.actionIconBtn} 
                          onPress={() => setViewingSubject(item)}
                          activeOpacity={0.8}
                        >
                          <MaterialIcons name="visibility" size={15} color="#0284C7" />
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={styles.actionIconBtn} 
                          onPress={() => setEditingSubject({ ...item })}
                          activeOpacity={0.8}
                        >
                          <MaterialIcons name="edit" size={15} color="#D97706" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Overall Performance Summary Card */}
              <View style={styles.summaryCard}>
                <Text style={styles.sectionHeaderTitle}>Overall Academic Performance</Text>
                
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryCol}>
                    <Text style={styles.summaryLabel}>TOTAL MARKS</Text>
                    <Text style={styles.summaryValue}>{totalObtMarks} / {totalMaxMarks}</Text>
                  </View>
                  <View style={styles.summaryCol}>
                    <Text style={styles.summaryLabel}>PERCENTAGE</Text>
                    <Text style={[styles.summaryValue, { color: '#0284C7' }]}>{overallPct}%</Text>
                  </View>
                  <View style={styles.summaryCol}>
                    <Text style={styles.summaryLabel}>FINAL GRADE</Text>
                    <Text style={[styles.summaryValue, { color: '#059669' }]}>{overallGrade}</Text>
                  </View>
                  <View style={styles.summaryCol}>
                    <Text style={styles.summaryLabel}>STATUS</Text>
                    <Text style={[styles.summaryValue, { color: '#059669' }]}>PASSED</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons: Print & Share */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                <TouchableOpacity 
                  style={[styles.reportActionBtn, { backgroundColor: '#0284C7' }]} 
                  onPress={handlePrintReport}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="download" size={18} color="#FFFFFF" />
                  <Text style={[styles.reportActionBtnText, { color: '#FFFFFF' }]}>Download PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.reportActionBtn, { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1' }]} 
                  onPress={handleShareReport}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="share" size={18} color="#475569" />
                  <Text style={[styles.reportActionBtnText, { color: '#475569' }]}>Share Report</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}

        </ScrollView>

        {/* CRITERIA PICKER MODAL */}
        <ViewportModal
          visible={pickerModalType !== null}
          onClose={() => setPickerModalType(null)}
        >
          {pickerData && (
            <View style={styles.pickerModalContainer}>
              <View style={styles.pickerModalHeader}>
                <Text style={styles.pickerModalTitle}>{pickerData.title}</Text>
                <TouchableOpacity onPress={() => setPickerModalType(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
                {pickerData.options.map((opt) => {
                  const isSelected = pickerData.current === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.pickerOptionItem, isSelected && styles.pickerOptionActive]}
                      onPress={() => {
                        pickerData.onSelect(opt);
                        setPickerModalType(null);
                      }}
                    >
                      <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextActive]}>{opt}</Text>
                      {isSelected ? (
                        <MaterialIcons name="check-circle" size={18} color="#0284C7" />
                      ) : (
                        <MaterialIcons name="radio-button-unchecked" size={18} color="#CBD5E1" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </ViewportModal>

        {/* VIEW SUBJECT DETAILS MODAL */}
        <ViewportModal
          visible={viewingSubject !== null}
          onClose={() => setViewingSubject(null)}
        >
          {viewingSubject && (
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={styles.modalIconBox}>
                    <MaterialIcons name="menu-book" size={20} color="#0284C7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{viewingSubject.subject}</Text>
                    <Text style={styles.modalSubTitle}>{selectedStudent} • {selectedTerm}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setViewingSubject(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.breakdownTable}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>SUBJECT</Text>
                  <Text style={styles.tableRowValue}>{viewingSubject.subject}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>OBTAINED MARKS</Text>
                  <Text style={[styles.tableRowValue, { color: '#0284C7', fontWeight: '800' }]}>{viewingSubject.obtainedMarks}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>TOTAL MAX MARKS</Text>
                  <Text style={styles.tableRowValue}>{viewingSubject.totalMarks}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>PERCENTAGE</Text>
                  <Text style={[styles.tableRowValue, { color: '#059669', fontWeight: '800' }]}>{viewingSubject.gradePct}</Text>
                </View>
                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.tableRowLabel}>SUBJECT GRADE</Text>
                  <Text style={[styles.tableRowValue, { color: '#D97706', fontWeight: '800' }]}>{viewingSubject.gradeBadge}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.modalCloseActionButton} 
                onPress={() => setViewingSubject(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseActionText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </ViewportModal>

        {/* EDIT SUBJECT MODAL */}
        <ViewportModal
          visible={editingSubject !== null}
          onClose={() => setEditingSubject(null)}
        >
          {editingSubject && (
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={[styles.modalIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <MaterialIcons name="edit" size={20} color="#D97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>Edit Subject Marks</Text>
                    <Text style={styles.modalSubTitle}>{editingSubject.subject}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setEditingSubject(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 12, marginVertical: 12 }}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Subject Name</Text>
                  <TextInput 
                    style={styles.modalInput} 
                    value={editingSubject.subject} 
                    onChangeText={(val) => setEditingSubject(prev => prev ? { ...prev, subject: val } : null)} 
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Obtained Marks</Text>
                    <TextInput 
                      style={styles.modalInput} 
                      value={String(editingSubject.obtainedMarks)} 
                      keyboardType="numeric"
                      onChangeText={(val) => setEditingSubject(prev => prev ? { ...prev, obtainedMarks: parseFloat(val) || 0 } : null)} 
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Max Marks</Text>
                    <TextInput 
                      style={styles.modalInput} 
                      value={String(editingSubject.totalMarks)} 
                      keyboardType="numeric"
                      onChangeText={(val) => setEditingSubject(prev => prev ? { ...prev, totalMarks: parseFloat(val) || 100 } : null)} 
                    />
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <TouchableOpacity 
                  style={[styles.modalActionBtn, { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1' }]} 
                  onPress={() => setEditingSubject(null)}
                >
                  <Text style={[styles.modalActionBtnText, { color: '#475569' }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalActionBtn, { backgroundColor: '#0284C7' }]} 
                  onPress={handleSaveSubjectEdit}
                >
                  <Text style={[styles.modalActionBtnText, { color: '#FFFFFF' }]}>Save Marks</Text>
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
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  safeArea: { flex: 1, alignSelf: 'center', width: '100%', maxWidth: 720 },

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
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    padding: 12,
    paddingBottom: 90,
    gap: 12,
  },

  // Search Filter Card Form
  filterCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  filterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterCardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  formGrid: {
    gap: 10,
  },
  fieldCol: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#475569',
  },
  reqStar: {
    color: '#EF4444',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    gap: 8,
  },
  dropdownLeftBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownValue: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  findButton: {
    height: 42,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  findBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Generated Report Card
  reportContainer: {
    gap: 12,
  },
  schoolHeaderBanner: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  schoolNameText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  reportCardSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.3,
  },

  // Student Metadata Card
  studentMetaCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  studentMetaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarTileBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentNameText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  studentSubText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  rollBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rollBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0284C7',
  },
  metaGridThree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  metaSubItem: {
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Subject Academic Marks
  subjectListContainer: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  subjectCardList: {
    gap: 8,
  },
  subjectItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  subjectSrText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  subjectNameText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  subjectMarksText: {
    fontSize: 12,
    color: '#64748B',
  },
  gradeBadgeContainer: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradeBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0284C7',
  },
  actionIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Performance Summary Card
  summaryCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  summaryCol: {
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },

  // Action Buttons
  reportActionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  reportActionBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
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

  // Criteria Picker Modal
  pickerModalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    elevation: 8,
    zIndex: 10000,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8,
  },
  pickerModalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#F8FAFC',
  },
  pickerOptionActive: {
    backgroundColor: '#EFF6FF',
  },
  pickerOptionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  pickerOptionTextActive: {
    fontWeight: '900',
    color: '#0284C7',
  },

  // Detail / Edit Modal
  modalContainer: {
    width: '100%',
    maxWidth: 460,
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
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubTitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },

  // Breakdown Table for View Modal
  breakdownTable: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginVertical: 12,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  tableRowValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseActionButton: {
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseActionText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#475569',
  },

  // Edit Modal Inputs
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  modalInput: {
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalActionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
  },
});
