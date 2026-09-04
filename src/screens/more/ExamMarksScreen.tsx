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

export type StudentMarkRecord = {
  rollNo: string;
  name: string;
  writtenMax: string;
  writtenObtained: string;
  totalMax: string;
  totalObtained: string;
  graceMark: string;
  examGrade: string;
  remark: string;
};

export const ExamMarksScreen = ({ navigation }: any) => {
  // Search Filter Criteria States
  const [selectedTerm, setSelectedTerm] = useState('1st Assessment');
  const [selectedClass, setSelectedClass] = useState('GRADE-V');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedCourse, setSelectedCourse] = useState('English');
  const [isSearched, setIsSearched] = useState(true);

  // Dropdown Picker Modal States
  const [pickerModalType, setPickerModalType] = useState<'term' | 'class' | 'section' | 'course' | 'grade' | 'remark' | null>(null);
  const [activeStudentRoll, setActiveStudentRoll] = useState<string | null>(null);

  // Table Search Filter
  const [tableSearch, setTableSearch] = useState('');

  // Student Marks Entry Roster (Matching Exact fields from user's screenshot)
  const [students, setStudents] = useState<StudentMarkRecord[]>([
    { 
      rollNo: '155', 
      name: 'Hassan', 
      writtenMax: '25', 
      writtenObtained: '18', 
      totalMax: '25', 
      totalObtained: '18', 
      graceMark: '0', 
      examGrade: 'B', 
      remark: 'good' 
    },
    { 
      rollNo: '156', 
      name: 'Muhammad Atif', 
      writtenMax: '25', 
      writtenObtained: '22', 
      totalMax: '25', 
      totalObtained: '22', 
      graceMark: '0', 
      examGrade: 'A', 
      remark: 'excellent' 
    },
    { 
      rollNo: '157', 
      name: 'Febin Naeem', 
      writtenMax: '25', 
      writtenObtained: '15', 
      totalMax: '25', 
      totalObtained: '15', 
      graceMark: '0', 
      examGrade: 'C', 
      remark: 'satisfactory' 
    },
    { 
      rollNo: '158', 
      name: 'Janan Anees', 
      writtenMax: '25', 
      writtenObtained: '24', 
      totalMax: '25', 
      totalObtained: '24', 
      graceMark: '0', 
      examGrade: 'A+', 
      remark: 'excellent' 
    },
    { 
      rollNo: '159', 
      name: 'Mahira Shah', 
      writtenMax: '25', 
      writtenObtained: '20', 
      totalMax: '25', 
      totalObtained: '20', 
      graceMark: '0', 
      examGrade: 'A', 
      remark: 'good' 
    },
  ]);

  // Options for Criteria Dropdowns
  const termOptions = ['1st Assessment', '2nd Assessment', 'Midterm', 'Final Exam'];
  const classOptions = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V'];
  const sectionOptions = ['A', 'B', 'C', 'D'];
  const courseOptions = ['English', 'Mathematics', 'Science', 'Urdu', 'Computer'];
  const gradeOptions = ['A+', 'A', 'B', 'C', 'D', 'F'];
  const remarkOptions = ['good', 'excellent', 'satisfactory', 'needs improvement'];

  // Handle Mark / Grace / Grade changes with auto-calculation
  const updateStudentMarks = (rollNo: string, field: 'writtenObtained' | 'graceMark' | 'examGrade' | 'remark', value: string) => {
    setStudents(prev => prev.map(s => {
      if (s.rollNo !== rollNo) return s;
      const updated = { ...s, [field]: value };
      
      const wObt = parseFloat(field === 'writtenObtained' ? value : s.writtenObtained) || 0;
      const wMax = parseFloat(s.writtenMax) || 25;
      const gMark = parseFloat(field === 'graceMark' ? value : s.graceMark) || 0;
      const totObt = wObt + gMark;
      
      updated.totalMax = wMax.toString();
      updated.totalObtained = totObt.toString();

      // Auto calculate grade suggestion
      if (field === 'writtenObtained' || field === 'graceMark') {
        const pct = wMax > 0 ? (totObt / wMax) * 100 : 0;
        if (pct >= 90) updated.examGrade = 'A+';
        else if (pct >= 80) updated.examGrade = 'A';
        else if (pct >= 70) updated.examGrade = 'B';
        else if (pct >= 60) updated.examGrade = 'C';
        else if (pct >= 50) updated.examGrade = 'D';
        else updated.examGrade = 'F';
      }

      return updated;
    }));
  };

  // Filter students by table search
  const filteredStudents = students.filter(student => {
    const query = tableSearch.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.rollNo.toLowerCase().includes(query) ||
      student.examGrade.toLowerCase().includes(query) ||
      student.remark.toLowerCase().includes(query)
    );
  });

  const handlePostMarks = () => {
    alert('Exam Marks saved and posted successfully for ' + selectedCourse + ' (' + selectedClass + ' - ' + selectedSection + ')');
  };

  const getPickerOptions = () => {
    switch (pickerModalType) {
      case 'term': return { title: 'Select Exam Term', options: termOptions, current: selectedTerm, onSelect: setSelectedTerm };
      case 'class': return { title: 'Select Class', options: classOptions, current: selectedClass, onSelect: setSelectedClass };
      case 'section': return { title: 'Select Section', options: sectionOptions, current: selectedSection, onSelect: setSelectedSection };
      case 'course': return { title: 'Select Course', options: courseOptions, current: selectedCourse, onSelect: setSelectedCourse };
      case 'grade': {
        const student = students.find(s => s.rollNo === activeStudentRoll);
        return {
          title: 'Select Exam Grade',
          options: gradeOptions,
          current: student ? student.examGrade : '',
          onSelect: (val: string) => {
            if (activeStudentRoll) {
              updateStudentMarks(activeStudentRoll, 'examGrade', val);
            }
          }
        };
      }
      case 'remark': {
        const student = students.find(s => s.rollNo === activeStudentRoll);
        return {
          title: 'Select Student Remark',
          options: remarkOptions,
          current: student ? student.remark : '',
          onSelect: (val: string) => {
            if (activeStudentRoll) {
              updateStudentMarks(activeStudentRoll, 'remark', val);
            }
          }
        };
      }
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
            <Text style={styles.headerTitle}>Exam Mark Entry</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="edit-note" size={20} color="#0284C7" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA CARD FORM */}
          <View style={styles.filterCard}>
            <View style={styles.filterCardHeader}>
              <MaterialIcons name="tune" size={18} color="#0284C7" />
              <Text style={styles.filterCardTitle}>Select Exam Mark Criteria</Text>
            </View>

            {/* Form Fields Grid */}
            <View style={styles.formGrid}>
              {/* 1. Exam Term */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Exam Term <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setPickerModalType('term')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#ECFDF5' }]}>
                    <MaterialIcons name="event" size={16} color="#059669" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedTerm}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* 2. Class */}
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

              {/* 3. Section */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Section <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setPickerModalType('section')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#F3E8FF' }]}>
                    <MaterialIcons name="grid-view" size={16} color="#7E22CE" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedSection}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* 4. Course */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Course <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={styles.dropdownBtn} onPress={() => setPickerModalType('course')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#FFFBEB' }]}>
                    <MaterialIcons name="menu-book" size={16} color="#D97706" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedCourse}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Find Button */}
            <TouchableOpacity 
              style={styles.findButton} 
              onPress={() => setIsSearched(true)}
              activeOpacity={0.8}
            >
              <MaterialIcons name="search" size={18} color="#FFFFFF" />
              <Text style={styles.findBtnText}>Find Records</Text>
            </TouchableOpacity>

          </View>

          {/* STUDENT MARKS ENTRY TABLE LEDGER CARD */}
          {isSearched && (
            <View style={styles.ledgerCard}>
              <View style={styles.portalTitleBox}>
                <MaterialIcons name="assignment" size={18} color="#0284C7" />
                <Text style={styles.portalTitleText}>Student Marks Sheet</Text>
              </View>

              {/* Search Row */}
              <View style={styles.searchRow}>
                <Text style={styles.searchLabel}>Search:</Text>
                <View style={styles.searchWrapper}>
                  <MaterialIcons name="search" size={18} color="#64748B" style={{ marginRight: 6 }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search student name, roll no..."
                    placeholderTextColor="#64748B"
                    value={tableSearch}
                    onChangeText={setTableSearch}
                  />
                  {tableSearch !== '' && (
                    <TouchableOpacity onPress={() => setTableSearch('')} style={{ padding: 4 }}>
                      <MaterialIcons name="close" size={16} color="#64748B" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Student Marks Entry Cards */}
              <View style={styles.studentList}>
                {filteredStudents.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons name="person-off" size={40} color="#94A3B8" />
                    <Text style={styles.emptyTitle}>No Students Found</Text>
                    <Text style={styles.emptyDesc}>Try adjusting the filter criteria or search query.</Text>
                  </View>
                ) : (
                  filteredStudents.map((item) => (
                    <View key={item.rollNo} style={styles.studentCard}>
                      <View style={styles.leftAccentTag} />

                      {/* Header: Student Profile & Total Marks Live Badge */}
                      <View style={styles.studentCardHeader}>
                        <View style={styles.studentProfileInfo}>
                          <View style={styles.studentAvatar}>
                            <MaterialIcons name="school" size={18} color="#0284C7" />
                          </View>
                          <View>
                            <Text style={styles.studentNameText}>{item.name}</Text>
                            <View style={styles.rollTagBox}>
                              <Text style={styles.rollTagText}>Roll No: {item.rollNo}</Text>
                            </View>
                          </View>
                        </View>

                        {/* Prominent Live Calculated Total */}
                        <View style={styles.totalBadgeBox}>
                          <Text style={styles.totalBadgeLabel}>TOTAL MARKS</Text>
                          <View style={styles.totalScoreRow}>
                            <Text style={styles.totalScoreObtained}>{item.totalObtained}</Text>
                            <Text style={styles.totalScoreSlash}>/</Text>
                            <Text style={styles.totalScoreMax}>{item.totalMax}</Text>
                          </View>
                        </View>
                      </View>

                      {/* SECTION 1: MARKS ENTRY (Written & Grace) */}
                      <View style={styles.marksEntrySection}>
                        
                        {/* 1. Written Exam Marks */}
                        <View style={styles.markInputCard}>
                          <View style={styles.markCardHeader}>
                            <Text style={styles.markSectionTitle}>WRITTEN EXAM</Text>
                            <View style={styles.lockedMaxBadge}>
                              <MaterialIcons name="lock" size={11} color="#64748B" />
                              <Text style={styles.lockedMaxText}>Max: {item.writtenMax}</Text>
                            </View>
                          </View>

                          <View style={styles.inputContainerWithUnit}>
                            <TextInput
                              style={styles.largeMarksInput}
                              value={item.writtenObtained}
                              placeholder="0"
                              placeholderTextColor="#94A3B8"
                              keyboardType="numeric"
                              onChangeText={(val) => updateStudentMarks(item.rollNo, 'writtenObtained', val)}
                            />
                            <Text style={styles.inputUnitLabel}>marks</Text>
                          </View>
                        </View>

                        {/* 2. Grace Mark */}
                        <View style={styles.markInputCard}>
                          <View style={styles.markCardHeader}>
                            <Text style={styles.markSectionTitle}>GRACE MARK</Text>
                            <Text style={styles.optionalBadgeText}>Optional</Text>
                          </View>

                          <View style={styles.inputContainerWithUnit}>
                            <TextInput
                              style={styles.largeMarksInput}
                              value={item.graceMark}
                              placeholder="0"
                              placeholderTextColor="#94A3B8"
                              keyboardType="numeric"
                              onChangeText={(val) => updateStudentMarks(item.rollNo, 'graceMark', val)}
                            />
                            <Text style={styles.inputUnitLabel}>grace</Text>
                          </View>
                        </View>

                      </View>

                      {/* SECTION 2: EXAM GRADE & REMARKS */}
                      <View style={styles.gradeRemarkSection}>
                        
                        {/* Exam Grade Selector */}
                        <View style={styles.selectorCol}>
                          <Text style={styles.fieldHeadingLabel}>EXAM GRADE</Text>
                          <TouchableOpacity 
                            style={styles.premiumDropdownBtn} 
                            onPress={() => {
                              setActiveStudentRoll(item.rollNo);
                              setPickerModalType('grade');
                            }}
                            activeOpacity={0.8}
                          >
                            <View style={styles.gradeIconWrap}>
                              <MaterialIcons name="military-tech" size={16} color="#D97706" />
                            </View>
                            <Text style={styles.premiumDropdownText}>
                              {item.examGrade || 'Select'}
                            </Text>
                            <MaterialIcons name="arrow-drop-down" size={22} color="#64748B" />
                          </TouchableOpacity>
                        </View>

                        {/* Remark Selector */}
                        <View style={styles.selectorCol}>
                          <Text style={styles.fieldHeadingLabel}>TEACHER REMARK</Text>
                          <TouchableOpacity 
                            style={styles.premiumDropdownBtn} 
                            onPress={() => {
                              setActiveStudentRoll(item.rollNo);
                              setPickerModalType('remark');
                            }}
                            activeOpacity={0.8}
                          >
                            <View style={styles.remarkIconWrap}>
                              <MaterialIcons name="rate-review" size={15} color="#0284C7" />
                            </View>
                            <Text style={styles.premiumDropdownText} numberOfLines={1}>
                              {item.remark || 'Select'}
                            </Text>
                            <MaterialIcons name="arrow-drop-down" size={22} color="#64748B" />
                          </TouchableOpacity>
                        </View>

                      </View>

                    </View>
                  ))
                )}
              </View>

              {/* POST MARKS ACTION BUTTON */}
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handlePostMarks}
                activeOpacity={0.85}
              >
                <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save & Post Exam Marks</Text>
              </TouchableOpacity>

            </View>
          )}

        </ScrollView>

        {/* CRITERIA / GRADE / REMARK PICKER MODAL */}
        <ViewportModal
          visible={pickerModalType !== null}
          onClose={() => {
            setPickerModalType(null);
            setActiveStudentRoll(null);
          }}
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
                        setActiveStudentRoll(null);
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

  // Student Marks Table Ledger Card
  ledgerCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  portalTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  portalTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    height: 38,
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

  // Student Marks List
  studentList: {
    gap: 14,
  },
  studentCard: {
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  leftAccentTag: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: 4,
    backgroundColor: '#0284C7',
  },
  studentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  studentProfileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  studentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentNameText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  rollTagBox: {
    marginTop: 2,
  },
  rollTagText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0284C7',
  },
  totalBadgeBox: {
    alignItems: 'flex-end',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  totalBadgeLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  totalScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  totalScoreObtained: {
    fontSize: 17,
    fontWeight: '900',
    color: '#15803D',
  },
  totalScoreSlash: {
    fontSize: 13,
    fontWeight: '700',
    color: '#86EFAC',
  },
  totalScoreMax: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A',
  },

  // Marks Entry Section (Written & Grace)
  marksEntrySection: {
    flexDirection: 'row',
    gap: 10,
  },
  markInputCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  markCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  markSectionTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#334155',
    letterSpacing: 0.3,
  },
  lockedMaxBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lockedMaxText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  optionalBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  inputContainerWithUnit: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 6,
  },
  largeMarksInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    padding: 0,
  },
  inputUnitLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },

  // Exam Grade & Remark Dropdowns Section
  gradeRemarkSection: {
    flexDirection: 'row',
    gap: 10,
  },
  selectorCol: {
    flex: 1,
    gap: 5,
  },
  fieldHeadingLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  premiumDropdownBtn: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
  },
  gradeIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remarkIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumDropdownText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Post Marks Action Button
  saveBtn: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.2,
  },

  // Empty State
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
  modalCloseBtn: {
    padding: 4,
  },
});
