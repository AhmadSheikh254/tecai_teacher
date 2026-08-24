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

type StudentFinalMarkRecord = {
  rollNo: string;
  name: string;
  termName: string;
  termMarksObtained: string;
  termMarksMax: string;
  finalMarksObtained: string;
  finalMarksMax: string;
  examGrade: string;
  percentage: string;
  remark: string;
};

export const ExamFinalMarkScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Search Filter Criteria States (from web image: Class, Section, Term)
  const [selectedClass, setSelectedClass] = useState('GRADE-V');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedTerm, setSelectedTerm] = useState('1st Assessment');
  const [isSearched, setIsSearched] = useState(true);

  // Dropdown Picker Modal States
  const [pickerModalType, setPickerModalType] = useState<'class' | 'section' | 'term' | 'grade' | 'remark' | null>(null);
  const [activeStudentRoll, setActiveStudentRoll] = useState<string | null>(null);

  // Table Search Filter
  const [tableSearch, setTableSearch] = useState('');

  // Student Final Marks Entry Roster (Exact data from user's web screenshot)
  const [students, setStudents] = useState<StudentFinalMarkRecord[]>([
    { 
      rollNo: '3', 
      name: 'Muhammad Atif', 
      termName: '1st Assessment',
      termMarksObtained: '85', 
      termMarksMax: '100', 
      finalMarksObtained: '90', 
      finalMarksMax: '100', 
      examGrade: 'A', 
      percentage: '88%', 
      remark: 'good' 
    },
    { 
      rollNo: '55576', 
      name: 'Febin Naeem', 
      termName: '1st Assessment',
      termMarksObtained: '70', 
      termMarksMax: '100', 
      finalMarksObtained: '74', 
      finalMarksMax: '100', 
      examGrade: 'B', 
      percentage: '72%', 
      remark: 'select' 
    },
  ]);

  // Options for Criteria Dropdowns
  const classOptions = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V'];
  const sectionOptions = ['A', 'B', 'C', 'D'];
  const termOptions = ['1st Assessment', '2nd Assessment', 'Midterm', 'Final Exam'];

  // Options for Student Grade & Remarks
  const gradeOptions = ['A+', 'A', 'B', 'C', 'D', 'F'];
  const remarkOptions = ['good', 'excellent', 'satisfactory', 'needs improvement'];

  // Filter students by table search
  const filteredStudents = students.filter(student => {
    const query = tableSearch.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.rollNo.toLowerCase().includes(query) ||
      student.termName.toLowerCase().includes(query) ||
      student.examGrade.toLowerCase().includes(query) ||
      student.remark.toLowerCase().includes(query)
    );
  });

  const handlePostMarks = () => {
    alert('Final Exam Marks posted successfully for ' + selectedClass + ' - ' + selectedSection + ' (' + selectedTerm + ')');
  };

  const handleExportAlert = (format: string) => {
    alert(`Exported Final Exam Marks Sheet in ${format} format.`);
  };

  return (
    <View style={styles.root}>
      {/* ── UNIFIED PURE OFF-WHITE LIGHT BG ── */}
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA', '#FFFFFF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Faint Ambient Orbs */}
      <View style={styles.orb1} pointerEvents="none" />
      <View style={styles.orb2} pointerEvents="none" />

      {/* Decorative SVG Wave Lines */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Circle cx="85%" cy="12%" r="180" fill="rgba(225, 29, 72, 0.04)" />
        <Circle cx="15%" cy="88%" r="200" fill="rgba(2, 132, 199, 0.03)" />
        <Path d="M-40,240 Q160,120 380,260 T820,220" fill="none" stroke="rgba(225,29,72,0.03)" strokeWidth={1.5} />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* App Bar Header */}
        <View style={styles.appBar}>
          <LinearGradient
            colors={['rgba(255,255,255,0.98)', 'rgba(248,250,252,0.95)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={26} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Final Exam Portal</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="auto-awesome" size={28} color="#E11D48" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA CARD FORM (Class, Section, Term) */}
          <View style={styles.filterCard}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topRoseStrip} />

            <Text style={styles.filterCardTitle}>Select Final Exam Criteria</Text>

            {/* Form Fields Grid */}
            <View style={styles.formGrid}>
              {/* 1. Class */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Class <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, { borderColor: '#BAE6FD' }]} onPress={() => setPickerModalType('class')}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#EFF6FF' }]}>
                    <MaterialIcons name="school" size={20} color="#0284C7" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedClass}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* 2. Section */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Section <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, { borderColor: '#E9D5FF' }]} onPress={() => setPickerModalType('section')}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#F3E8FF' }]}>
                    <MaterialIcons name="grid-view" size={20} color="#7E22CE" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedSection}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* 3. Term */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Term <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, { borderColor: '#A7F3D0' }]} onPress={() => setPickerModalType('term')}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#ECFDF5' }]}>
                    <MaterialIcons name="event" size={20} color="#059669" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedTerm}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Green 3D Find Button */}
            <TouchableOpacity 
              style={styles.findButton} 
              onPress={() => setIsSearched(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#059669', '#047857']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <MaterialIcons name="search" size={20} color="#FFFFFF" />
              <Text style={styles.findBtnText}>Find</Text>
            </TouchableOpacity>

          </View>

          {/* STUDENT FINAL MARKS TABLE LEDGER CARD */}
          {isSearched && (
            <View style={styles.ledgerCard}>
              <LinearGradient
                colors={['#FFFFFF', '#FAFAFA']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.topBlueStrip} />

              {/* Portal Header Title Banner */}
              <View style={styles.portalTitleBox}>
                <LinearGradient
                  colors={['#0284C7', '#0369A1']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <MaterialIcons name="assessment" size={22} color="#FFFFFF" />
                <Text style={styles.portalTitleText}>Student Final Exam Roster</Text>
              </View>

              {/* Toolbar & Search */}
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

              {/* Search Row */}
              <View style={styles.searchRow}>
                <Text style={styles.searchLabel}>Search:</Text>
                <View style={styles.searchWrapper}>
                  <MaterialIcons name="search" size={20} color="#0284C7" style={{ marginRight: 6 }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search student name, roll no..."
                    placeholderTextColor="#94A3B8"
                    value={tableSearch}
                    onChangeText={setTableSearch}
                  />
                  {tableSearch !== '' && (
                    <TouchableOpacity onPress={() => setTableSearch('')} style={{ padding: 4 }}>
                      <MaterialIcons name="close" size={18} color="#64748B" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Student Final Exam Roster Cards */}
              <View style={styles.studentList}>
                {filteredStudents.map((item) => (
                  <View key={item.rollNo} style={styles.studentCard}>
                    <LinearGradient
                      colors={['#FFFFFF', '#F8FAFC']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.leftBlueTag} />

                    {/* Top Header: Student Name, Term Pill & Roll No Badge */}
                    <View style={styles.studentCardHeader}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <Text style={styles.studentNameText}>{item.name}</Text>
                        <View style={styles.termPill}>
                          <MaterialIcons name="event" size={13} color="#E11D48" />
                          <Text style={styles.termPillText}>{item.termName}</Text>
                        </View>
                      </View>

                      <View style={styles.rollBadge}>
                        <Text style={styles.rollBadgeText}>ROLL NO: {item.rollNo}</Text>
                      </View>
                    </View>

                    {/* Term 1 & Final Exam Marks Dual Grid */}
                    <View style={styles.dualMarksGrid}>
                      {/* Term 1 Marks Box */}
                      <View style={styles.marksCol}>
                        <Text style={styles.entryLabel}>TERM 1 MARKS (OBT / MAX)</Text>
                        <View style={styles.dualInputRow}>
                          <TextInput 
                            style={[styles.markInputText, { color: '#0284C7', backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}
                            value={item.termMarksObtained}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setStudents(prev => prev.map(s => s.rollNo === item.rollNo ? { ...s, termMarksObtained: text } : s));
                            }}
                          />
                          <Text style={styles.slashDivider}>/</Text>
                          <TextInput 
                            style={[styles.markInputText, { color: '#475569', backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            value={item.termMarksMax}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setStudents(prev => prev.map(s => s.rollNo === item.rollNo ? { ...s, termMarksMax: text } : s));
                            }}
                          />
                        </View>
                      </View>

                      {/* Final Exam Marks Box */}
                      <View style={styles.marksCol}>
                        <Text style={styles.entryLabel}>FINAL MARKS (OBT / MAX)</Text>
                        <View style={styles.dualInputRow}>
                          <TextInput 
                            style={[styles.markInputText, { color: '#E11D48', backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }]}
                            value={item.finalMarksObtained}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              const fObt = parseFloat(text) || 0;
                              const fMax = parseFloat(item.finalMarksMax) || 100;
                              const tObt = parseFloat(item.termMarksObtained) || 0;
                              const tMax = parseFloat(item.termMarksMax) || 100;

                              const totObt = fObt + tObt;
                              const totMax = fMax + tMax;
                              const calcPct = totMax > 0 ? Math.round((totObt / totMax) * 100) + '%' : '0%';

                              setStudents(prev => prev.map(s => s.rollNo === item.rollNo ? { 
                                ...s, 
                                finalMarksObtained: text,
                                percentage: calcPct
                              } : s));
                            }}
                          />
                          <Text style={styles.slashDivider}>/</Text>
                          <TextInput 
                            style={[styles.markInputText, { color: '#475569', backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}
                            value={item.finalMarksMax}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                              setStudents(prev => prev.map(s => s.rollNo === item.rollNo ? { ...s, finalMarksMax: text } : s));
                            }}
                          />
                        </View>
                      </View>
                    </View>

                    {/* Percentage & Interactive Entry Fields Grid */}
                    <View style={styles.entryFieldsGrid}>
                      {/* PERCENTAGE BADGE */}
                      <View style={styles.percentageCol}>
                        <Text style={styles.entryLabel}>OVERALL %</Text>
                        <View style={styles.percentBadge}>
                          <Text style={styles.percentBadgeText}>{item.percentage}</Text>
                        </View>
                      </View>

                      {/* EXAM GRADE SELECTOR */}
                      <View style={styles.entryCol}>
                        <Text style={styles.entryLabel}>EXAM GRADE</Text>
                        {(() => {
                          const gStyle = 
                            item.examGrade === 'A+' || item.examGrade === 'A' ? { bg: '#ECFDF5', border: '#6EE7B7', text: '#047857', iconBg: '#D1FAE5' } :
                            item.examGrade === 'B' ? { bg: '#EFF6FF', border: '#93C5FD', text: '#1D4ED8', iconBg: '#DBEAFE' } :
                            item.examGrade === 'C' ? { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', iconBg: '#FEF3C7' } :
                            item.examGrade === 'D' || item.examGrade === 'F' ? { bg: '#FEF2F2', border: '#FCA5A5', text: '#DC2626', iconBg: '#FEE2E2' } :
                            { bg: '#FFFFFF', border: '#E2E8F0', text: '#64748B', iconBg: '#F1F5F9' };

                          return (
                            <TouchableOpacity 
                              style={[
                                styles.entrySelectBtn, 
                                { backgroundColor: gStyle.bg, borderColor: gStyle.border }
                              ]}
                              onPress={() => {
                                setActiveStudentRoll(item.rollNo);
                                setPickerModalType('grade');
                              }}
                              activeOpacity={0.8}
                            >
                              <View style={[styles.selectLeftIconBox, { backgroundColor: gStyle.iconBg }]}>
                                <MaterialIcons name="grade" size={16} color={gStyle.text} />
                              </View>
                              <Text style={[styles.entrySelectText, { color: gStyle.text, fontWeight: item.examGrade !== 'select' ? '900' : '800' }]}>
                                {item.examGrade === 'select' ? '--Select--' : `Grade ${item.examGrade}`}
                              </Text>
                              <MaterialIcons name="arrow-drop-down" size={22} color={gStyle.text} />
                            </TouchableOpacity>
                          );
                        })()}
                      </View>

                      {/* REMARK SELECTOR */}
                      <View style={styles.entryCol}>
                        <Text style={styles.entryLabel}>REMARK</Text>
                        {(() => {
                          const rStyle = 
                            item.remark === 'excellent' ? { bg: '#F3E8FF', border: '#C084FC', text: '#7E22CE', iconBg: '#E9D5FF' } :
                            item.remark === 'good' ? { bg: '#ECFDF5', border: '#6EE7B7', text: '#047857', iconBg: '#D1FAE5' } :
                            item.remark === 'satisfactory' ? { bg: '#EFF6FF', border: '#93C5FD', text: '#1D4ED8', iconBg: '#DBEAFE' } :
                            item.remark === 'needs improvement' ? { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', iconBg: '#FEF3C7' } :
                            { bg: '#FFFFFF', border: '#E2E8F0', text: '#64748B', iconBg: '#F1F5F9' };

                          return (
                            <TouchableOpacity 
                              style={[
                                styles.entrySelectBtn, 
                                { backgroundColor: rStyle.bg, borderColor: rStyle.border }
                              ]}
                              onPress={() => {
                                setActiveStudentRoll(item.rollNo);
                                setPickerModalType('remark');
                              }}
                              activeOpacity={0.8}
                            >
                              <View style={[styles.selectLeftIconBox, { backgroundColor: rStyle.iconBg }]}>
                                <MaterialIcons name="comment" size={16} color={rStyle.text} />
                              </View>
                              <Text style={[styles.entrySelectText, { color: rStyle.text, fontWeight: item.remark !== 'select' ? '900' : '800' }]}>
                                {item.remark === 'select' ? '--Select--' : item.remark}
                              </Text>
                              <MaterialIcons name="arrow-drop-down" size={22} color={rStyle.text} />
                            </TouchableOpacity>
                          );
                        })()}
                      </View>
                    </View>

                  </View>
                ))}
              </View>

              {/* Pagination Controls */}
              <View style={styles.paginationRow}>
                <Text style={styles.entriesText}>Showing 1 to {filteredStudents.length} of {students.length} entries</Text>
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

              {/* BOTTOM ACTION BUTTONS */}
              <View style={styles.bottomActionRow}>
                <TouchableOpacity 
                  style={styles.postMarksBtn} 
                  onPress={handlePostMarks}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#059669', '#047857']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.postMarksBtnText}>Post Marks</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelBtn} 
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="cancel" size={20} color="#64748B" />
                  <Text style={styles.cancelBtnText}>CANCEL</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}

        </ScrollView>

        {/* DROPDOWN PICKER MODAL SHEET */}
        <Modal
          visible={pickerModalType !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setPickerModalType(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.pickerModalContainer}>
              {/* Modal Header */}
              <View style={styles.pickerModalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={styles.pickerTitleIconBox}>
                    <MaterialIcons 
                      name={
                        pickerModalType === 'class' ? 'school' : 
                        pickerModalType === 'section' ? 'grid-view' : 
                        pickerModalType === 'term' ? 'event' : 
                        pickerModalType === 'grade' ? 'grade' : 'comment'
                      } 
                      size={22} 
                      color="#0284C7" 
                    />
                  </View>
                  <Text style={styles.pickerModalTitle}>
                    Select {
                      pickerModalType === 'class' ? 'Class' : 
                      pickerModalType === 'section' ? 'Section' : 
                      pickerModalType === 'term' ? 'Exam Term' : 
                      pickerModalType === 'grade' ? 'Exam Grade' : 'Remark'
                    }
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setPickerModalType(null)} style={styles.pickerCloseBtn}>
                  <MaterialIcons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Options List */}
              <ScrollView style={{ padding: 18 }} showsVerticalScrollIndicator={false}>
                {(
                  pickerModalType === 'class' ? classOptions :
                  pickerModalType === 'section' ? sectionOptions : 
                  pickerModalType === 'term' ? termOptions : 
                  pickerModalType === 'grade' ? gradeOptions : remarkOptions
                ).map((opt) => {
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={styles.pickerOptionItem}
                      onPress={() => {
                        if (pickerModalType === 'class') setSelectedClass(opt);
                        if (pickerModalType === 'section') setSelectedSection(opt);
                        if (pickerModalType === 'term') setSelectedTerm(opt);

                        if (pickerModalType === 'grade' && activeStudentRoll) {
                          setStudents(prev => prev.map(s => s.rollNo === activeStudentRoll ? { ...s, examGrade: opt } : s));
                        }
                        if (pickerModalType === 'remark' && activeStudentRoll) {
                          setStudents(prev => prev.map(s => s.rollNo === activeStudentRoll ? { ...s, remark: opt } : s));
                        }
                        setPickerModalType(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.pickerOptionText}>{opt}</Text>
                      <MaterialIcons name="chevron-right" size={22} color="#94A3B8" />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },

  // Ambient Orbs
  orb1: {
    position: 'absolute', top: -140, right: -120,
    width: 440, height: 440, borderRadius: 220,
    backgroundColor: 'rgba(225, 29, 72, 0.04)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -120,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(2, 132, 199, 0.03)',
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
    fontSize: 22,
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
    gap: 18,
  },

  // Search Filter Card Form
  filterCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.95)',
    position: 'relative',
    overflow: 'hidden',
    gap: 16,
    elevation: 5,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  topRoseStrip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 5,
    backgroundColor: '#E11D48',
  },
  filterCardTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  formGrid: {
    gap: 12,
  },
  fieldCol: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#475569',
  },
  reqStar: {
    color: '#EF4444',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    gap: 10,
  },
  dropdownLeftBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  findButton: {
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    marginTop: 4,
  },
  findBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  // Student Marks Table Ledger Card
  ledgerCard: {
    borderRadius: 26,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.95)',
    position: 'relative',
    overflow: 'hidden',
    gap: 16,
    elevation: 6,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
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
    borderColor: 'rgba(226, 232, 240, 0.9)',
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

  // Student Marks List
  studentList: {
    gap: 14,
  },
  studentCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    position: 'relative',
    overflow: 'hidden',
    gap: 14,
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  leftBlueTag: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: 5,
    backgroundColor: '#0284C7',
  },
  studentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 10,
  },
  studentNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  termPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  termPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  rollBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  rollBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1D4ED8',
  },

  // Term 1 & Final Dual Grid
  dualMarksGrid: {
    gap: 10,
  },
  marksCol: {
    gap: 6,
  },
  dualInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markInputText: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
  },
  slashDivider: {
    fontSize: 20,
    fontWeight: '900',
    color: '#94A3B8',
  },

  entryFieldsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  percentageCol: {
    width: 90,
    gap: 6,
  },
  percentBadge: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadgeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#047857',
  },
  entryCol: {
    flex: 1,
    gap: 6,
  },
  entryLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
  },
  entrySelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    gap: 4,
  },
  selectLeftIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entrySelectText: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '800',
    color: '#64748B',
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

  // Bottom Action Row
  bottomActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  postMarksBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
  postMarksBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    elevation: 2,
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  // Modal Sheet
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  pickerModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '60%',
    paddingBottom: 24,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  pickerTitleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  pickerCloseBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  pickerOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  pickerOptionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
});
