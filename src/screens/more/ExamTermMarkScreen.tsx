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

export type StudentTermMarkRecord = {
  rollNo: string;
  name: string;
  totalMarksObtained: string;
  totalMarksMax: string;
  examGrade: string;
  percentage: string;
  remark: string;
};

export const ExamTermMarkScreen = ({ navigation }: any) => {
  // Search Filter Criteria States
  const [selectedTerm, setSelectedTerm] = useState('1st Assessment');
  const [selectedClass, setSelectedClass] = useState('GRADE-V');
  const [selectedSection, setSelectedSection] = useState('A');
  const [isSearched, setIsSearched] = useState(true);

  // Dropdown Picker Modal States
  const [pickerModalType, setPickerModalType] = useState<'term' | 'class' | 'section' | 'grade' | 'remark' | null>(null);
  const [activeStudentRoll, setActiveStudentRoll] = useState<string | null>(null);

  // Selected & Editing Records
  const [selectedStudent, setSelectedStudent] = useState<StudentTermMarkRecord | null>(null);
  const [editingStudent, setEditingStudent] = useState<StudentTermMarkRecord | null>(null);
  const [deleteConfirmRoll, setDeleteConfirmRoll] = useState<string | null>(null);

  // Table Search Filter
  const [tableSearch, setTableSearch] = useState('');

  // Student Term Marks Entry Roster
  const [students, setStudents] = useState<StudentTermMarkRecord[]>([
    { rollNo: '3', name: 'Muhammad Atif', totalMarksObtained: '85', totalMarksMax: '100', examGrade: 'A', percentage: '85%', remark: 'good' },
    { rollNo: '55576', name: 'Febin Naeem', totalMarksObtained: '72', totalMarksMax: '100', examGrade: 'B', percentage: '72%', remark: 'satisfactory' },
    { rollNo: '55577', name: 'Janan Anees', totalMarksObtained: '94', totalMarksMax: '100', examGrade: 'A+', percentage: '94%', remark: 'excellent' },
    { rollNo: '55578', name: 'Maaz', totalMarksObtained: '65', totalMarksMax: '100', examGrade: 'C', percentage: '65%', remark: 'needs improvement' },
    { rollNo: '55579', name: 'Mahira Shah', totalMarksObtained: '88', totalMarksMax: '100', examGrade: 'A', percentage: '88%', remark: 'good' },
  ]);

  // Options for Criteria Dropdowns
  const termOptions = ['1st Assessment', '2nd Assessment', 'Midterm', 'Final Exam'];
  const classOptions = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V'];
  const sectionOptions = ['A', 'B', 'C', 'D'];

  // Options for Student Grade & Remarks
  const gradeOptions = ['A+', 'A', 'B', 'C', 'D', 'F'];
  const remarkOptions = ['good', 'excellent', 'satisfactory', 'needs improvement'];

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

  const handleDeleteStudent = (rollNo: string) => {
    setStudents(prev => prev.filter(item => item.rollNo !== rollNo));
    setDeleteConfirmRoll(null);
    if (selectedStudent?.rollNo === rollNo) setSelectedStudent(null);
  };

  const handleSaveStudentEdit = () => {
    if (!editingStudent) return;
    const obt = parseFloat(editingStudent.totalMarksObtained) || 0;
    const max = parseFloat(editingStudent.totalMarksMax) || 100;
    const pct = max > 0 ? Math.round((obt / max) * 100) + '%' : '0%';
    const updated = { ...editingStudent, percentage: pct };

    setStudents(prev => prev.map(item => item.rollNo === editingStudent.rollNo ? updated : item));
    if (selectedStudent?.rollNo === editingStudent.rollNo) {
      setSelectedStudent(updated);
    }
    setEditingStudent(null);
  };

  const handlePostMarks = () => {
    alert('Exam Term Marks posted successfully for ' + selectedClass + ' - ' + selectedSection + ' (' + selectedTerm + ')');
  };

  const getPickerOptions = () => {
    switch (pickerModalType) {
      case 'term': return { title: 'Select Exam Term', options: termOptions, current: selectedTerm, onSelect: setSelectedTerm };
      case 'class': return { title: 'Select Class', options: classOptions, current: selectedClass, onSelect: setSelectedClass };
      case 'section': return { title: 'Select Section', options: sectionOptions, current: selectedSection, onSelect: setSelectedSection };
      case 'grade': {
        const student = students.find(s => s.rollNo === activeStudentRoll);
        return {
          title: 'Select Exam Grade',
          options: gradeOptions,
          current: student ? student.examGrade : '',
          onSelect: (val: string) => {
            if (activeStudentRoll) {
              setStudents(prev => prev.map(s => s.rollNo === activeStudentRoll ? { ...s, examGrade: val } : s));
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
              setStudents(prev => prev.map(s => s.rollNo === activeStudentRoll ? { ...s, remark: val } : s));
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
            <Text style={styles.headerTitle}>Exam Term Marks</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="assignment-turned-in" size={20} color="#0284C7" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA CARD FORM */}
          <View style={styles.filterCard}>
            <View style={styles.filterCardHeader}>
              <MaterialIcons name="tune" size={18} color="#0284C7" />
              <Text style={styles.filterCardTitle}>Select Exam Term Criteria</Text>
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

          {/* STUDENT TERM MARKS TABLE LEDGER CARD */}
          {isSearched && (
            <View style={styles.ledgerCard}>
              <View style={styles.portalTitleBox}>
                <MaterialIcons name="assignment" size={18} color="#0284C7" />
                <Text style={styles.portalTitleText}>Student Term Marks Roster</Text>
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

              {/* Student Term Mark Entry Cards */}
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

                      {/* Header: Student Profile, Actions & Live Percentage Badge */}
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

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          {/* Live Percentage Badge */}
                          <View style={styles.totalBadgeBox}>
                            <Text style={styles.totalBadgeLabel}>PERCENTAGE</Text>
                            <Text style={styles.totalScoreObtained}>{item.percentage}</Text>
                          </View>

                          {/* Action Buttons */}
                          <View style={styles.headerActionBtns}>
                            <TouchableOpacity 
                              style={styles.actionIconBtn} 
                              onPress={() => setSelectedStudent(item)}
                              activeOpacity={0.8}
                            >
                              <MaterialIcons name="visibility" size={15} color="#0284C7" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                              style={styles.actionIconBtn} 
                              onPress={() => setEditingStudent({ ...item })}
                              activeOpacity={0.8}
                            >
                              <MaterialIcons name="edit" size={15} color="#D97706" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                              style={styles.actionIconBtn} 
                              onPress={() => setDeleteConfirmRoll(item.rollNo)}
                              activeOpacity={0.8}
                            >
                              <MaterialIcons name="delete-outline" size={15} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      {/* SECTION 1: MARKS ENTRY (Obtained & Max Marks) */}
                      <View style={styles.marksEntrySection}>
                        
                        {/* 1. Obtained Marks Input */}
                        <View style={styles.markInputCard}>
                          <View style={styles.markCardHeader}>
                            <Text style={styles.markSectionTitle}>OBTAINED MARKS</Text>
                            <View style={styles.lockedMaxBadge}>
                              <MaterialIcons name="lock" size={11} color="#64748B" />
                              <Text style={styles.lockedMaxText}>Max: {item.totalMarksMax}</Text>
                            </View>
                          </View>

                          <View style={styles.inputContainerWithUnit}>
                            <TextInput 
                              style={styles.largeMarksInput}
                              value={item.totalMarksObtained}
                              keyboardType="numeric"
                              placeholder="0"
                              placeholderTextColor="#94A3B8"
                              onChangeText={(text) => {
                                const obt = parseFloat(text) || 0;
                                const max = parseFloat(item.totalMarksMax) || 100;
                                const calcPct = max > 0 ? Math.round((obt / max) * 100) + '%' : '0%';

                                setStudents(prev => prev.map(s => s.rollNo === item.rollNo ? { 
                                  ...s, 
                                  totalMarksObtained: text,
                                  percentage: calcPct
                                } : s));
                              }}
                            />
                            <Text style={styles.inputUnitLabel}>marks</Text>
                          </View>
                        </View>

                        {/* 2. Total Result Summary Box */}
                        <View style={styles.markInputCard}>
                          <View style={styles.markCardHeader}>
                            <Text style={styles.markSectionTitle}>TOTAL SCORE</Text>
                            <Text style={styles.optionalBadgeText}>Calculated</Text>
                          </View>

                          <View style={[styles.inputContainerWithUnit, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
                            <Text style={[styles.largeMarksInput, { color: '#047857' }]}>
                              {item.totalMarksObtained || '0'} <Text style={{ fontSize: 13, color: '#64748B' }}>/ {item.totalMarksMax}</Text>
                            </Text>
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
                <Text style={styles.saveBtnText}>Save & Post Term Marks</Text>
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

        {/* VIEW STUDENT DETAILS MODAL */}
        <ViewportModal
          visible={selectedStudent !== null}
          onClose={() => setSelectedStudent(null)}
        >
          {selectedStudent && (
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={styles.modalIconBox}>
                    <MaterialIcons name="person" size={20} color="#0284C7" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>{selectedStudent.name}</Text>
                    <Text style={styles.modalSubTitle}>Roll No: {selectedStudent.rollNo}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedStudent(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <View style={styles.breakdownTable}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>STUDENT NAME</Text>
                  <Text style={styles.tableRowValue}>{selectedStudent.name}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>ROLL NUMBER</Text>
                  <Text style={styles.tableRowValue}>{selectedStudent.rollNo}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>EXAM TERM</Text>
                  <Text style={styles.tableRowValue}>{selectedTerm}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>CLASS & SECTION</Text>
                  <Text style={styles.tableRowValue}>{selectedClass} - {selectedSection}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>OBTAINED / MAX</Text>
                  <Text style={[styles.tableRowValue, { color: '#0284C7', fontWeight: '800' }]}>
                    {selectedStudent.totalMarksObtained} / {selectedStudent.totalMarksMax}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>PERCENTAGE</Text>
                  <Text style={[styles.tableRowValue, { color: '#059669', fontWeight: '800' }]}>
                    {selectedStudent.percentage}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableRowLabel}>EXAM GRADE</Text>
                  <Text style={[styles.tableRowValue, { color: '#D97706', fontWeight: '800' }]}>
                    {selectedStudent.examGrade}
                  </Text>
                </View>
                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.tableRowLabel}>REMARK</Text>
                  <Text style={styles.tableRowValue}>{selectedStudent.remark}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.modalCloseActionButton} 
                onPress={() => setSelectedStudent(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCloseActionText}>Close Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </ViewportModal>

        {/* EDIT STUDENT MODAL */}
        <ViewportModal
          visible={editingStudent !== null}
          onClose={() => setEditingStudent(null)}
        >
          {editingStudent && (
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={[styles.modalIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <MaterialIcons name="edit" size={20} color="#D97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>Edit Term Marks</Text>
                    <Text style={styles.modalSubTitle}>{editingStudent.name} (Roll #{editingStudent.rollNo})</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setEditingStudent(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
                <View style={{ gap: 12 }}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Student Name</Text>
                    <TextInput 
                      style={styles.modalInput} 
                      value={editingStudent.name} 
                      onChangeText={(val) => setEditingStudent(prev => prev ? { ...prev, name: val } : null)} 
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Obtained Marks</Text>
                      <TextInput 
                        style={styles.modalInput} 
                        value={editingStudent.totalMarksObtained} 
                        keyboardType="numeric"
                        onChangeText={(val) => setEditingStudent(prev => prev ? { ...prev, totalMarksObtained: val } : null)} 
                      />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Max Marks</Text>
                      <TextInput 
                        style={styles.modalInput} 
                        value={editingStudent.totalMarksMax} 
                        keyboardType="numeric"
                        onChangeText={(val) => setEditingStudent(prev => prev ? { ...prev, totalMarksMax: val } : null)} 
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Exam Grade</Text>
                    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                      {gradeOptions.map(g => (
                        <TouchableOpacity
                          key={g}
                          style={[
                            styles.chipOption,
                            editingStudent.examGrade === g && styles.chipOptionActive
                          ]}
                          onPress={() => setEditingStudent(prev => prev ? { ...prev, examGrade: g } : null)}
                        >
                          <Text style={[styles.chipText, editingStudent.examGrade === g && styles.chipTextActive]}>{g}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Remarks</Text>
                    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                      {remarkOptions.map(r => (
                        <TouchableOpacity
                          key={r}
                          style={[
                            styles.chipOption,
                            editingStudent.remark === r && styles.chipOptionActive
                          ]}
                          onPress={() => setEditingStudent(prev => prev ? { ...prev, remark: r } : null)}
                        >
                          <Text style={[styles.chipText, editingStudent.remark === r && styles.chipTextActive]}>{r}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>
              </ScrollView>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <TouchableOpacity 
                  style={[styles.modalActionBtn, { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1' }]} 
                  onPress={() => setEditingStudent(null)}
                >
                  <Text style={[styles.modalActionBtnText, { color: '#475569' }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalActionBtn, { backgroundColor: '#0284C7' }]} 
                  onPress={handleSaveStudentEdit}
                >
                  <Text style={[styles.modalActionBtnText, { color: '#FFFFFF' }]}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ViewportModal>

        {/* DELETE CONFIRMATION MODAL */}
        <ViewportModal
          visible={deleteConfirmRoll !== null}
          onClose={() => setDeleteConfirmRoll(null)}
        >
          {deleteConfirmRoll && (
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                  <View style={[styles.modalIconBox, { backgroundColor: '#FEE2E2' }]}>
                    <MaterialIcons name="delete" size={20} color="#EF4444" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>Delete Record</Text>
                    <Text style={styles.modalSubTitle}>Roll No: {deleteConfirmRoll}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setDeleteConfirmRoll(null)} style={styles.modalCloseBtn}>
                  <MaterialIcons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={{ fontSize: 13.5, color: '#475569', lineHeight: 20, marginVertical: 12 }}>
                Are you sure you want to delete the term marks record for Roll #{deleteConfirmRoll}? This action cannot be undone.
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                <TouchableOpacity 
                  style={[styles.modalActionBtn, { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#CBD5E1' }]} 
                  onPress={() => setDeleteConfirmRoll(null)}
                >
                  <Text style={[styles.modalActionBtnText, { color: '#475569' }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalActionBtn, { backgroundColor: '#EF4444' }]} 
                  onPress={() => handleDeleteStudent(deleteConfirmRoll)}
                >
                  <Text style={[styles.modalActionBtnText, { color: '#FFFFFF' }]}>Delete</Text>
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
  headerActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
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
  totalScoreObtained: {
    fontSize: 17,
    fontWeight: '900',
    color: '#15803D',
  },

  // Marks Entry Section (Obtained & Max Marks)
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

  // Detail / Edit / Delete Modal
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
  modalCloseBtn: {
    padding: 4,
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
  chipOption: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  chipOptionActive: {
    borderColor: '#0284C7',
    backgroundColor: '#EFF6FF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  chipTextActive: {
    fontWeight: '900',
    color: '#0284C7',
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
