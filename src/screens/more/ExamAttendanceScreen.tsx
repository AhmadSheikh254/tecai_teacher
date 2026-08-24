import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  Switch,
  useWindowDimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

type StudentAttendanceRecord = {
  sno: string;
  name: string;
  fatherName: string;
  rollNo: string;
  isPresent: boolean;
};

export const ExamAttendanceScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Search Filter Criteria States (from web image: Exam Term, Class, Section, Course)
  const [selectedTerm, setSelectedTerm] = useState('1st Assessment');
  const [selectedClass, setSelectedClass] = useState('GRADE-II');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedCourse, setSelectedCourse] = useState('English');
  const [isSearched, setIsSearched] = useState(true); // Default true to display inspiration table

  // Dropdown Picker Modal States
  const [pickerModalType, setPickerModalType] = useState<'term' | 'class' | 'section' | 'course' | null>(null);

  // Table Search Filter
  const [tableSearch, setTableSearch] = useState('');

  // Master Attend All Switch
  const [attendAll, setAttendAll] = useState(false);

  // Student Attendance Roster (Exact data from user's web screenshot)
  const [students, setStudents] = useState<StudentAttendanceRecord[]>([
    { sno: '8667', name: 'Hashir Ahmed', fatherName: 'Waqar Ahmed', rollNo: '101', isPresent: true },
    { sno: '8668', name: 'Umer Khan', fatherName: 'Naeem Bashir Masih', rollNo: '102', isPresent: true },
    { sno: '8669', name: 'Muhammad Atif', fatherName: 'Muhammad Ali', rollNo: '103', isPresent: true },
    { sno: '8670', name: 'Aliya Khan', fatherName: 'Muhammad Khan', rollNo: '104', isPresent: true },
  ]);

  // Options for Dropdowns
  const termOptions = ['1st Assessment', '2nd Assessment', 'Midterm', 'Final Exam'];
  const classOptions = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V'];
  const sectionOptions = ['A', 'B', 'C', 'D'];
  const courseOptions = ['English', 'Mathematics', 'Science', 'Urdu', 'Computer'];

  // Toggle Single Student Attendance
  const toggleAttendance = (sno: string) => {
    setStudents(prev => 
      prev.map(item => item.sno === sno ? { ...item, isPresent: !item.isPresent } : item)
    );
  };

  // Toggle Master Attend All
  const handleAttendAllToggle = (value: boolean) => {
    setAttendAll(value);
    setStudents(prev => prev.map(item => ({ ...item, isPresent: value })));
  };

  // Filter students by table search
  const filteredStudents = students.filter(student => {
    const query = tableSearch.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.fatherName.toLowerCase().includes(query) ||
      student.sno.toLowerCase().includes(query) ||
      student.rollNo.toLowerCase().includes(query)
    );
  });

  const handleSaveAttendance = () => {
    alert('Exam Attendance saved successfully for ' + selectedCourse + ' (' + selectedClass + ' - ' + selectedSection + ')');
  };

  const handleExportAlert = (format: string) => {
    alert(`Exported Exam Attendance Sheet in ${format} format.`);
  };

  return (
    <View style={styles.root}>
      {/* ── CLEAN LIGHT OFF-WHITE BG ── */}
      <LinearGradient
        colors={['#FFFFFF', '#FAFAFA', '#FFFFFF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Ultra Faint Ambient Orbs */}
      <View style={styles.orb1} pointerEvents="none" />
      <View style={styles.orb2} pointerEvents="none" />

      {/* Decorative SVG Wave Lines */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Circle cx="85%" cy="12%" r="180" fill="rgba(16, 185, 129, 0.03)" />
        <Circle cx="15%" cy="88%" r="200" fill="rgba(5, 150, 105, 0.02)" />
        <Path d="M-40,240 Q160,120 380,260 T820,220" fill="none" stroke="rgba(5,150,105,0.03)" strokeWidth={1.5} />
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
            <Text style={styles.headerTitle}>Mark EXAM ATTENDANCE</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="how-to-reg" size={28} color="#059669" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA CARD FORM */}
          <View style={styles.filterCard}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topGreenStrip} />

            <Text style={styles.filterCardTitle}>Select Exam Criteria</Text>

            {/* Form Fields Grid */}
            <View style={styles.formGrid}>
              {/* 1. Exam Term */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Exam Term <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, { borderColor: '#A7F3D0' }]} onPress={() => setPickerModalType('term')}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#ECFDF5' }]}>
                    <MaterialIcons name="event" size={20} color="#059669" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedTerm}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* 2. Class */}
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

              {/* 3. Section */}
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

              {/* 4. Course */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Course <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, { borderColor: '#FDE68A' }]} onPress={() => setPickerModalType('course')}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#FFFBEB' }]}>
                    <MaterialIcons name="menu-book" size={20} color="#D97706" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedCourse}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Green 3D Find Button (matching web screenshot) */}
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

          {/* STUDENT ATTENDANCE TABLE LEDGER CARD */}
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
                <MaterialIcons name="fact-check" size={22} color="#FFFFFF" />
                <Text style={styles.portalTitleText}>Student Attendance Sheet</Text>
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

              {/* Master ATTEND ALL Switch Bar */}
              <View style={styles.attendAllBar}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialIcons name="select-all" size={20} color="#0284C7" />
                  <Text style={styles.attendAllText}>ATTEND ALL STUDENTS</Text>
                </View>
                <Switch
                  value={attendAll}
                  onValueChange={handleAttendAllToggle}
                  trackColor={{ false: '#CBD5E1', true: '#6EE7B7' }}
                  thumbColor={attendAll ? '#059669' : '#F8FAFC'}
                />
              </View>

              {/* Student Attendance Cards */}
              <View style={styles.studentList}>
                {filteredStudents.map((item) => (
                  <View key={item.sno} style={styles.studentCard}>
                    <LinearGradient
                      colors={['#FFFFFF', '#F8FAFC']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={[styles.leftStatusStrip, { backgroundColor: item.isPresent ? '#059669' : '#EF4444' }]} />

                    {/* Top Student Header */}
                    <View style={styles.studentCardHeader}>
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text style={styles.studentNameText}>{item.name}</Text>
                        <Text style={styles.fatherNameText}>Father: {item.fatherName}</Text>
                      </View>

                      {/* Tactile Attendance Toggle Button */}
                      <TouchableOpacity 
                        style={[
                          styles.statusToggleBtn, 
                          { backgroundColor: item.isPresent ? '#ECFDF5' : '#FEF2F2', borderColor: item.isPresent ? '#6EE7B7' : '#FCA5A5' }
                        ]}
                        onPress={() => toggleAttendance(item.sno)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons 
                          name={item.isPresent ? "check-circle" : "cancel"} 
                          size={19} 
                          color={item.isPresent ? "#047857" : "#DC2626"} 
                        />
                        <Text style={[styles.statusToggleText, { color: item.isPresent ? "#047857" : "#DC2626" }]}>
                          {item.isPresent ? 'Present' : 'Absent'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Bottom Metadata Badges: Vibrant SNO (Purple) & ROLL NO (Blue) */}
                    <View style={styles.studentMetaRow}>
                      <View style={[styles.metaBadge, { backgroundColor: '#F3E8FF', borderColor: '#C084FC' }]}>
                        <Text style={[styles.metaLabel, { color: '#7E22CE' }]}>SNO:</Text>
                        <Text style={[styles.metaValue, { color: '#7E22CE' }]}>{item.sno}</Text>
                      </View>

                      <View style={[styles.metaBadge, { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' }]}>
                        <Text style={[styles.metaLabel, { color: '#1D4ED8' }]}>ROLL NO:</Text>
                        <Text style={[styles.metaValue, { color: '#1D4ED8' }]}>{item.rollNo}</Text>
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

              {/* SAVE ATTENDANCE ACTION BUTTON */}
              <TouchableOpacity 
                style={styles.saveAttendanceBtn} 
                onPress={handleSaveAttendance}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#059669', '#047857']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <MaterialIcons name="save" size={22} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save Exam Attendance</Text>
              </TouchableOpacity>

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
                      name={pickerModalType === 'term' ? 'event' : pickerModalType === 'class' ? 'school' : pickerModalType === 'section' ? 'grid-view' : 'menu-book'} 
                      size={22} 
                      color="#059669" 
                    />
                  </View>
                  <Text style={styles.pickerModalTitle}>
                    Select {pickerModalType === 'term' ? 'Exam Term' : pickerModalType === 'class' ? 'Class' : pickerModalType === 'section' ? 'Section' : 'Course'}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => setPickerModalType(null)} style={styles.pickerCloseBtn}>
                  <MaterialIcons name="close" size={22} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Options List */}
              <ScrollView style={{ padding: 18 }} showsVerticalScrollIndicator={false}>
                {(pickerModalType === 'term' ? termOptions :
                  pickerModalType === 'class' ? classOptions :
                  pickerModalType === 'section' ? sectionOptions : courseOptions
                ).map((opt) => {
                  const isSelected = 
                    (pickerModalType === 'term' && selectedTerm === opt) ||
                    (pickerModalType === 'class' && selectedClass === opt) ||
                    (pickerModalType === 'section' && selectedSection === opt) ||
                    (pickerModalType === 'course' && selectedCourse === opt);

                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[
                        styles.pickerOptionItem,
                        isSelected && styles.pickerOptionActive
                      ]}
                      onPress={() => {
                        if (pickerModalType === 'term') setSelectedTerm(opt);
                        if (pickerModalType === 'class') setSelectedClass(opt);
                        if (pickerModalType === 'section') setSelectedSection(opt);
                        if (pickerModalType === 'course') setSelectedCourse(opt);
                        setPickerModalType(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextActive]}>
                        {opt}
                      </Text>
                      {isSelected ? (
                        <MaterialIcons name="check-circle" size={22} color="#059669" />
                      ) : (
                        <MaterialIcons name="chevron-right" size={22} color="#94A3B8" />
                      )}
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
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -120,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(5, 150, 105, 0.05)',
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
    borderColor: 'rgba(167, 243, 208, 0.95)',
    position: 'relative',
    overflow: 'hidden',
    gap: 16,
    elevation: 5,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  topGreenStrip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 5,
    backgroundColor: '#059669',
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
    borderColor: '#A7F3D0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    gap: 10,
  },
  dropdownLeftBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
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

  // Student Attendance Table Ledger Card
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
  attendAllBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
  },
  attendAllText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
  },

  // Student Roster List
  studentList: {
    gap: 14,
  },
  studentCard: {
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
  leftStatusStrip: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: 5,
  },
  studentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E0F2FE',
    paddingBottom: 10,
  },
  studentNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  fatherNameText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#475569',
  },
  statusToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  statusToggleText: {
    fontSize: 14.5,
    fontWeight: '900',
  },
  studentMetaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  metaLabel: {
    fontSize: 13.5,
    fontWeight: '900',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '900',
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

  // Save Attendance Button
  saveAttendanceBtn: {
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 6,
    elevation: 5,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  // Dropdown Picker Modal Sheet
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
    backgroundColor: '#ECFDF5',
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
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
  },
  pickerOptionActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#6EE7B7',
  },
  pickerOptionText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#475569',
  },
  pickerOptionTextActive: {
    color: '#047857',
    fontWeight: '900',
  },
});
