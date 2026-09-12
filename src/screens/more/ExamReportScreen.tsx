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

export type SubjectMark = {
  sr: number;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  gradePct: string;
  gradeBadge: string;
};

export const ExamReportScreen = ({ navigation }: any) => {
  const { theme: appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';

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
    <View style={[styles.root, !isDefaultTheme && { backgroundColor: appTheme.bg }]}>
      <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: 'transparent' }]} edges={['top']}>
        {/* App Bar Header */}
        <View style={[styles.appBar, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={[styles.backButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color={isDefaultTheme ? "#0F172A" : appTheme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Exam Report View</Text>
          </View>
          <TouchableOpacity style={[styles.appBarIconButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={handlePrintReport} activeOpacity={0.7}>
            <MaterialIcons name="print" size={20} color={appTheme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA CARD FORM */}
          <View style={[styles.filterCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
            <View style={styles.filterCardHeader}>
              <MaterialIcons name="tune" size={18} color={appTheme.primary} />
              <Text style={[styles.filterCardTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Select Report Card Criteria</Text>
            </View>

            {/* Form Fields Grid */}
            <View style={styles.formGrid}>
              {/* 1. Class */}
              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Class <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => setPickerModalType('class')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: isDefaultTheme ? '#EFF6FF' : appTheme.primary + '18' }]}>
                    <MaterialIcons name="school" size={16} color={appTheme.primary} />
                  </View>
                  <Text style={[styles.dropdownValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedClass}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* 2. Student */}
              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Student <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => setPickerModalType('student')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: isDefaultTheme ? '#F3E8FF' : appTheme.accent + '18' }]}>
                    <MaterialIcons name="person" size={16} color={isDefaultTheme ? "#7E22CE" : appTheme.accent} />
                  </View>
                  <Text style={[styles.dropdownValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedStudent}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* 3. Term */}
              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Term <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => setPickerModalType('term')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: isDefaultTheme ? '#ECFDF5' : appTheme.primary + '18' }]}>
                    <MaterialIcons name="event" size={16} color={isDefaultTheme ? "#059669" : appTheme.primary} />
                  </View>
                  <Text style={[styles.dropdownValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedTerm}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Filter Button */}
            <TouchableOpacity 
              style={[styles.findButton, !isDefaultTheme && { backgroundColor: appTheme.primary }]} 
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
              <View style={[styles.schoolHeaderBanner, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
                <MaterialIcons name="school" size={24} color={appTheme.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.schoolNameText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{studentInfo.campus}</Text>
                  <Text style={[styles.reportCardSubtitle, !isDefaultTheme && { color: appTheme.textSecondary }]}>OFFICIAL PROGRESS REPORT • {selectedTerm}</Text>
                </View>
              </View>

              {/* Student Metadata Card Banner */}
              <View style={[styles.studentMetaCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
                <View style={[styles.studentMetaHeaderRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                  <View style={[styles.avatarTileBox, !isDefaultTheme && { backgroundColor: appTheme.primary + '18' }]}>
                    <MaterialIcons name="person" size={20} color={appTheme.primary} />
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={[styles.studentNameText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedStudent}</Text>
                    <Text style={[styles.studentSubText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Candidate Roll #{studentInfo.rollNo}</Text>
                  </View>

                  <View style={[styles.rollBadge, !isDefaultTheme && { backgroundColor: appTheme.primary + '18', borderColor: appTheme.primary + '40' }]}>
                    <Text style={[styles.rollBadgeText, !isDefaultTheme && { color: appTheme.primary }]}>ROLL: {studentInfo.rollNo}</Text>
                  </View>
                </View>

                <View style={styles.metaGridThree}>
                  <View style={styles.metaSubItem}>
                    <Text style={[styles.metaLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Class:</Text>
                    <Text style={[styles.metaVal, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedClass}</Text>
                  </View>
                  <View style={styles.metaSubItem}>
                    <Text style={[styles.metaLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Section:</Text>
                    <Text style={[styles.metaVal, !isDefaultTheme && { color: appTheme.textPrimary }]}>{studentInfo.section}</Text>
                  </View>
                  <View style={styles.metaSubItem}>
                    <Text style={[styles.metaLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Term:</Text>
                    <Text style={[styles.metaVal, { color: isDefaultTheme ? '#0284C7' : appTheme.primary, fontWeight: '800' }]}>{selectedTerm}</Text>
                  </View>
                </View>
              </View>

              {/* Subject Academic Marks Breakdown */}
              <View style={styles.subjectListContainer}>
                <Text style={[styles.sectionHeaderTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Subject Academic Marks</Text>

                <View style={styles.subjectCardList}>
                  {subjectMarks.map((item) => (
                    <View key={item.sr} style={[styles.subjectItemCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={[styles.subjectSrText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{item.sr}.</Text>
                          <Text style={[styles.subjectNameText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{item.subject}</Text>
                        </View>
                        <Text style={[styles.subjectMarksText, !isDefaultTheme && { color: appTheme.textSecondary }]}>
                          Marks: <Text style={[{ fontWeight: '800', color: '#0F172A' }, !isDefaultTheme && { color: appTheme.textPrimary }]}>{item.obtainedMarks}</Text> / {item.totalMarks} ({item.gradePct})
                        </Text>
                      </View>

                      {/* Grade Badge */}
                      <View style={[styles.gradeBadgeContainer, !isDefaultTheme && { backgroundColor: appTheme.primary + '18', borderColor: appTheme.primary + '40' }]}>
                        <Text style={[styles.gradeBadgeText, !isDefaultTheme && { color: appTheme.primary }]}>{item.gradeBadge}</Text>
                      </View>

                      {/* Action buttons */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <TouchableOpacity 
                          style={[styles.actionIconBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                          onPress={() => setViewingSubject(item)}
                          activeOpacity={0.8}
                        >
                          <MaterialIcons name="visibility" size={15} color={appTheme.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={[styles.actionIconBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                          onPress={() => setEditingSubject({ ...item })}
                          activeOpacity={0.8}
                        >
                          <MaterialIcons name="edit" size={15} color={isDefaultTheme ? "#D97706" : appTheme.accent} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Overall Performance Summary Card */}
              <View style={[styles.summaryCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
                <Text style={[styles.sectionHeaderTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Overall Academic Performance</Text>
                
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryCol}>
                    <Text style={[styles.summaryLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>TOTAL MARKS</Text>
                    <Text style={[styles.summaryValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{totalObtMarks} / {totalMaxMarks}</Text>
                  </View>
                  <View style={styles.summaryCol}>
                    <Text style={[styles.summaryLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>PERCENTAGE</Text>
                    <Text style={[styles.summaryValue, { color: isDefaultTheme ? '#0284C7' : appTheme.primary }]}>{overallPct}%</Text>
                  </View>
                  <View style={styles.summaryCol}>
                    <Text style={[styles.summaryLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>FINAL GRADE</Text>
                    <Text style={[styles.summaryValue, { color: isDefaultTheme ? '#059669' : appTheme.accent }]}>{overallGrade}</Text>
                  </View>
                  <View style={styles.summaryCol}>
                    <Text style={[styles.summaryLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>STATUS</Text>
                    <Text style={[styles.summaryValue, { color: isDefaultTheme ? '#059669' : appTheme.primary }]}>PASSED</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons: Print & Share */}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                <TouchableOpacity 
                  style={[styles.reportActionBtn, { backgroundColor: appTheme.primary }]} 
                  onPress={handlePrintReport}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="download" size={18} color="#FFFFFF" />
                  <Text style={[styles.reportActionBtnText, { color: '#FFFFFF' }]}>Download PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.reportActionBtn, { backgroundColor: isDefaultTheme ? '#FFFFFF' : appTheme.surface, borderWidth: 1, borderColor: isDefaultTheme ? '#CBD5E1' : appTheme.border }]} 
                  onPress={handleShareReport}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="share" size={18} color={isDefaultTheme ? "#475569" : appTheme.textSecondary} />
                  <Text style={[styles.reportActionBtnText, { color: isDefaultTheme ? '#475569' : appTheme.textSecondary }]}>Share Report</Text>
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
            <View style={[styles.pickerModalContainer, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
              <View style={[styles.pickerModalHeader, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                <Text style={[styles.pickerModalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>{pickerData.title}</Text>
                <TouchableOpacity onPress={() => setPickerModalType(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 280 }} showsVerticalScrollIndicator={false}>
                {pickerData.options.map((opt) => {
                  const isSelected = pickerData.current === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.pickerOptionItem, 
                        !isDefaultTheme && { backgroundColor: appTheme.surface },
                        isSelected && (isDefaultTheme ? styles.pickerOptionActive : { backgroundColor: appTheme.primary + '18' })
                      ]}
                      onPress={() => {
                        pickerData.onSelect(opt);
                        setPickerModalType(null);
                      }}
                    >
                      <Text style={[
                        styles.pickerOptionText, 
                        !isDefaultTheme && { color: appTheme.textPrimary },
                        isSelected && (isDefaultTheme ? styles.pickerOptionTextActive : { color: appTheme.primary, fontWeight: '900' })
                      ]}>{opt}</Text>
                      {isSelected ? (
                        <MaterialIcons name="check-circle" size={18} color={appTheme.primary} />
                      ) : (
                        <MaterialIcons name="radio-button-unchecked" size={18} color={isDefaultTheme ? "#CBD5E1" : appTheme.border} />
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
            <View style={[styles.modalContainer, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
              <View style={[styles.modalHeader, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={[styles.modalIconBox, !isDefaultTheme && { backgroundColor: appTheme.primary + '18' }]}>
                    <MaterialIcons name="menu-book" size={20} color={appTheme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>{viewingSubject.subject}</Text>
                    <Text style={[styles.modalSubTitle, !isDefaultTheme && { color: appTheme.textSecondary }]}>{selectedStudent} • {selectedTerm}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setViewingSubject(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.breakdownTable}>
                <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                  <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>SUBJECT</Text>
                  <Text style={[styles.tableRowValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{viewingSubject.subject}</Text>
                </View>
                <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                  <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>OBTAINED MARKS</Text>
                  <Text style={[styles.tableRowValue, { color: isDefaultTheme ? '#0284C7' : appTheme.primary, fontWeight: '800' }]}>{viewingSubject.obtainedMarks}</Text>
                </View>
                <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                  <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>TOTAL MAX MARKS</Text>
                  <Text style={[styles.tableRowValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{viewingSubject.totalMarks}</Text>
                </View>
                <View style={[styles.tableRow, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                  <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>PERCENTAGE</Text>
                  <Text style={[styles.tableRowValue, { color: isDefaultTheme ? '#059669' : appTheme.accent, fontWeight: '800' }]}>{viewingSubject.gradePct}</Text>
                </View>
                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                  <Text style={[styles.tableRowLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>SUBJECT GRADE</Text>
                  <Text style={[styles.tableRowValue, { color: isDefaultTheme ? '#D97706' : appTheme.primary, fontWeight: '800' }]}>{viewingSubject.gradeBadge}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.modalCloseActionButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
                onPress={() => setViewingSubject(null)}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalCloseActionText, !isDefaultTheme && { color: appTheme.textPrimary }]}>Close</Text>
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
            <View style={[styles.modalContainer, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
              <View style={[styles.modalHeader, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={[styles.modalIconBox, { backgroundColor: isDefaultTheme ? '#FEF3C7' : appTheme.accent + '18' }]}>
                    <MaterialIcons name="edit" size={20} color={isDefaultTheme ? "#D97706" : appTheme.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Edit Subject Marks</Text>
                    <Text style={[styles.modalSubTitle, !isDefaultTheme && { color: appTheme.textSecondary }]}>{editingSubject.subject}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setEditingSubject(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 12, marginVertical: 12 }}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Subject Name</Text>
                  <TextInput 
                    style={[styles.modalInput, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border, color: appTheme.textPrimary }]} 
                    value={editingSubject.subject} 
                    onChangeText={(val) => setEditingSubject(prev => prev ? { ...prev, subject: val } : null)} 
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.inputLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Obtained Marks</Text>
                    <TextInput 
                      style={[styles.modalInput, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border, color: appTheme.textPrimary }]} 
                      value={String(editingSubject.obtainedMarks)} 
                      keyboardType="numeric"
                      onChangeText={(val) => setEditingSubject(prev => prev ? { ...prev, obtainedMarks: parseFloat(val) || 0 } : null)} 
                    />
                  </View>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.inputLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Max Marks</Text>
                    <TextInput 
                      style={[styles.modalInput, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border, color: appTheme.textPrimary }]} 
                      value={String(editingSubject.totalMarks)} 
                      keyboardType="numeric"
                      onChangeText={(val) => setEditingSubject(prev => prev ? { ...prev, totalMarks: parseFloat(val) || 100 } : null)} 
                    />
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                <TouchableOpacity 
                  style={[styles.modalActionBtn, { backgroundColor: isDefaultTheme ? '#F1F5F9' : appTheme.surface, borderWidth: 1, borderColor: isDefaultTheme ? '#CBD5E1' : appTheme.border }]} 
                  onPress={() => setEditingSubject(null)}
                >
                  <Text style={[styles.modalActionBtnText, { color: isDefaultTheme ? '#475569' : appTheme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalActionBtn, { backgroundColor: appTheme.primary }]} 
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
