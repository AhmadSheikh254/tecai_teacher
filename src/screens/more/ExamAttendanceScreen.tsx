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
  Switch,
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

export type StudentAttendanceRecord = {
  sno: string;
  name: string;
  fatherName: string;
  rollNo: string;
  isPresent: boolean;
};

export const ExamAttendanceScreen = ({ navigation }: any) => {
  const { theme: appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';

  const [selectedTerm, setSelectedTerm] = useState('1st Assessment');
  const [selectedClass, setSelectedClass] = useState('GRADE-II');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedCourse, setSelectedCourse] = useState('English');
  const [isSearched, setIsSearched] = useState(true);
  const [pickerModalType, setPickerModalType] = useState<'term' | 'class' | 'section' | 'course' | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  const [attendAll, setAttendAll] = useState(false);

  const [students, setStudents] = useState<StudentAttendanceRecord[]>([
    { sno: '8667', name: 'Hashir Ahmed', fatherName: 'Waqar Ahmed', rollNo: '101', isPresent: true },
    { sno: '8668', name: 'Umer Khan', fatherName: 'Naeem Bashir Masih', rollNo: '102', isPresent: true },
    { sno: '8669', name: 'Muhammad Atif', fatherName: 'Muhammad Ali', rollNo: '103', isPresent: true },
    { sno: '8670', name: 'Aliya Khan', fatherName: 'Muhammad Khan', rollNo: '104', isPresent: true },
  ]);

  const termOptions = ['1st Assessment', '2nd Assessment', 'Midterm', 'Final Exam'];
  const classOptions = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V'];
  const sectionOptions = ['A', 'B', 'C', 'D'];
  const courseOptions = ['English', 'Mathematics', 'Science', 'Urdu', 'Computer'];

  const setStudentStatus = (sno: string, isPresent: boolean) => {
    setStudents(prev => prev.map(item => item.sno === sno ? { ...item, isPresent } : item));
  };

  const handleAttendAllToggle = (value: boolean) => {
    setAttendAll(value);
    setStudents(prev => prev.map(item => ({ ...item, isPresent: value })));
  };

  const filteredStudents = students.filter(student => {
    const query = tableSearch.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) || 
      student.fatherName.toLowerCase().includes(query) || 
      student.sno.toLowerCase().includes(query) || 
      student.rollNo.toLowerCase().includes(query)
    );
  });

  const presentCount = students.filter(s => s.isPresent).length;
  const absentCount = students.length - presentCount;

  const handleSaveAttendance = () => {
    alert('Exam Attendance submitted successfully for ' + selectedCourse + ' (' + selectedClass + ' - ' + selectedSection + ')\nPresent: ' + presentCount + ', Absent: ' + absentCount);
  };

  const getPickerOptions = () => {
    switch (pickerModalType) {
      case 'term': return { title: 'Select Exam Term', options: termOptions, current: selectedTerm, onSelect: setSelectedTerm };
      case 'class': return { title: 'Select Class', options: classOptions, current: selectedClass, onSelect: setSelectedClass };
      case 'section': return { title: 'Select Section', options: sectionOptions, current: selectedSection, onSelect: setSelectedSection };
      case 'course': return { title: 'Select Course', options: courseOptions, current: selectedCourse, onSelect: setSelectedCourse };
      default: return null;
    }
  };

  const pickerData = getPickerOptions();

  return (
    <View style={[styles.root, !isDefaultTheme && { backgroundColor: appTheme.bg }]}>
      <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: 'transparent' }]} edges={['top']}>
        {/* App Bar */}
        <View style={[styles.appBar, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderBottomColor: appTheme.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={[styles.backButton, !isDefaultTheme && { backgroundColor: appTheme.surface }]} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color={isDefaultTheme ? "#0F172A" : appTheme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Mark Exam Attendance</Text>
          </View>
          <TouchableOpacity style={[styles.appBarIconButton, !isDefaultTheme && { backgroundColor: appTheme.surface }]} activeOpacity={0.7}>
            <MaterialIcons name="how-to-reg" size={20} color={appTheme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Criteria Filter Card */}
          <View style={[styles.filterCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
            <View style={styles.filterCardHeader}>
              <MaterialIcons name="tune" size={18} color={appTheme.primary} />
              <Text style={[styles.filterCardTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Select Exam Criteria</Text>
            </View>
            <View style={styles.formGrid}>
              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Exam Term <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => setPickerModalType('term')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: isDefaultTheme ? '#ECFDF5' : appTheme.primary + '18' }]}><MaterialIcons name="event" size={16} color={appTheme.primary} /></View>
                  <Text style={[styles.dropdownValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedTerm}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Class <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => setPickerModalType('class')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: isDefaultTheme ? '#EFF6FF' : appTheme.accent + '18' }]}><MaterialIcons name="school" size={16} color={isDefaultTheme ? "#0284C7" : appTheme.accent} /></View>
                  <Text style={[styles.dropdownValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedClass}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Section <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => setPickerModalType('section')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: isDefaultTheme ? '#F3E8FF' : appTheme.primary + '18' }]}><MaterialIcons name="grid-view" size={16} color={isDefaultTheme ? "#7E22CE" : appTheme.primary} /></View>
                  <Text style={[styles.dropdownValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedSection}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.fieldCol}>
                <Text style={[styles.fieldLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Course <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} onPress={() => setPickerModalType('course')} activeOpacity={0.75}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: isDefaultTheme ? '#FFFBEB' : appTheme.accent + '18' }]}><MaterialIcons name="menu-book" size={16} color={isDefaultTheme ? "#D97706" : appTheme.accent} /></View>
                  <Text style={[styles.dropdownValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{selectedCourse}</Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={[styles.findButton, !isDefaultTheme && { backgroundColor: appTheme.primary }]} onPress={() => setIsSearched(true)} activeOpacity={0.8}>
              <MaterialIcons name="search" size={18} color="#FFFFFF" />
              <Text style={styles.findBtnText}>Find Records</Text>
            </TouchableOpacity>
          </View>

          {isSearched && (
            <View style={[styles.ledgerCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
              <View style={[styles.portalTitleBox, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                <MaterialIcons name="fact-check" size={18} color={appTheme.primary} />
                <Text style={[styles.portalTitleText, !isDefaultTheme && { color: appTheme.textPrimary }]}>Student Attendance Sheet</Text>
              </View>

              {/* Search Row */}
              <View style={styles.searchRow}>
                <Text style={[styles.searchLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>Search:</Text>
                <View style={[styles.searchWrapper, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                  <MaterialIcons name="search" size={18} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} style={{ marginRight: 6 }} />
                  <TextInput 
                    style={[styles.searchInput, !isDefaultTheme && { color: appTheme.textPrimary }]} 
                    placeholder="Search student name, roll no..." 
                    placeholderTextColor={isDefaultTheme ? "#64748B" : appTheme.textSecondary} 
                    value={tableSearch} 
                    onChangeText={setTableSearch} 
                  />
                  {tableSearch !== '' && (
                    <TouchableOpacity onPress={() => setTableSearch('')} style={{ padding: 4 }}>
                      <MaterialIcons name="close" size={16} color={isDefaultTheme ? "#64748B" : appTheme.textSecondary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Mark All Toggle Bar */}
              <View style={[styles.attendAllBar, !isDefaultTheme && { backgroundColor: appTheme.primary + '18', borderColor: appTheme.primary + '40' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MaterialIcons name="select-all" size={18} color={appTheme.primary} />
                  <Text style={[styles.attendAllText, !isDefaultTheme && { color: appTheme.primary }]}>Mark All Students Present</Text>
                </View>
                <Switch 
                  value={attendAll} 
                  onValueChange={handleAttendAllToggle} 
                  trackColor={{ false: '#CBD5E1', true: isDefaultTheme ? '#6EE7B7' : appTheme.primary + '80' }} 
                  thumbColor={attendAll ? appTheme.primary : '#F8FAFC'} 
                />
              </View>

              {/* Student Attendance List */}
              <View style={styles.studentList}>
                {filteredStudents.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <MaterialIcons name="person-off" size={40} color={isDefaultTheme ? "#94A3B8" : appTheme.textSecondary} />
                    <Text style={[styles.emptyTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>No Students Found</Text>
                    <Text style={[styles.emptyDesc, !isDefaultTheme && { color: appTheme.textSecondary }]}>Try adjusting the filter criteria or search query.</Text>
                  </View>
                ) : (
                  filteredStudents.map((item) => (
                    <View 
                      key={item.sno} 
                      style={[styles.studentCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}
                    >
                      <View style={[styles.leftStatusStrip, { backgroundColor: item.isPresent ? (isDefaultTheme ? '#059669' : appTheme.primary) : '#DC2626' }]} />
                      
                      {/* Student Info & P / A Attendance Action Buttons */}
                      <View style={styles.studentCardHeader}>
                        <View style={{ flex: 1, gap: 3 }}>
                          <Text style={[styles.studentNameText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{item.name}</Text>
                          <Text style={[styles.fatherNameText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Father: {item.fatherName}</Text>
                        </View>

                        {/* P (Present) & A (Absent) Option Buttons */}
                        <View style={styles.markOptionsContainer}>
                          {/* Present Button (P) */}
                          <TouchableOpacity
                            style={[
                              styles.markOptionBtn,
                              item.isPresent
                                ? { backgroundColor: isDefaultTheme ? '#059669' : appTheme.primary, borderColor: isDefaultTheme ? '#059669' : appTheme.primary }
                                : { backgroundColor: isDefaultTheme ? '#ECFDF5' : appTheme.primary + '18', borderColor: isDefaultTheme ? '#A7F3D0' : appTheme.primary + '40' }
                            ]}
                            onPress={() => setStudentStatus(item.sno, true)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.markOptionText, { color: item.isPresent ? '#FFFFFF' : (isDefaultTheme ? '#047857' : appTheme.primary) }]}>
                              P
                            </Text>
                          </TouchableOpacity>

                          {/* Absent Button (A) */}
                          <TouchableOpacity
                            style={[
                              styles.markOptionBtn,
                              !item.isPresent
                                ? { backgroundColor: '#DC2626', borderColor: '#DC2626' }
                                : { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }
                            ]}
                            onPress={() => setStudentStatus(item.sno, false)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.markOptionText, { color: !item.isPresent ? '#FFFFFF' : '#DC2626' }]}>
                              A
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Meta Badges */}
                      <View style={[styles.studentMetaRow, !isDefaultTheme && { borderTopColor: appTheme.border }]}>
                        <View style={[styles.metaBadge, { backgroundColor: isDefaultTheme ? '#F8FAFC' : appTheme.surface, borderColor: isDefaultTheme ? '#E2E8F0' : appTheme.border }]}>
                          <Text style={[styles.metaLabel, !isDefaultTheme && { color: appTheme.textSecondary }]}>SNO:</Text>
                          <Text style={[styles.metaValue, !isDefaultTheme && { color: appTheme.textPrimary }]}>{item.sno}</Text>
                        </View>
                        <View style={[styles.metaBadge, { backgroundColor: isDefaultTheme ? '#EFF6FF' : appTheme.accent + '15', borderColor: isDefaultTheme ? '#BFDBFE' : appTheme.accent + '40' }]}>
                          <Text style={[styles.metaLabel, { color: isDefaultTheme ? '#1D4ED8' : appTheme.accent }]}>ROLL NO:</Text>
                          <Text style={[styles.metaValue, { color: isDefaultTheme ? '#1D4ED8' : appTheme.accent }]}>{item.rollNo}</Text>
                        </View>
                        <View style={[styles.statusSummaryBadge, { 
                          backgroundColor: item.isPresent ? (isDefaultTheme ? '#ECFDF5' : appTheme.primary + '18') : '#FEF2F2', 
                          borderColor: item.isPresent ? (isDefaultTheme ? '#A7F3D0' : appTheme.primary + '40') : '#FECACA' 
                        }]}>
                          <Text style={[styles.statusSummaryText, { color: item.isPresent ? (isDefaultTheme ? '#047857' : appTheme.primary) : '#DC2626' }]}>
                            {item.isPresent ? 'Present' : 'Absent'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Submit Action Button */}
              <TouchableOpacity style={[styles.saveAttendanceBtn, !isDefaultTheme && { backgroundColor: appTheme.primary }]} onPress={handleSaveAttendance} activeOpacity={0.8}>
                <MaterialIcons name="save" size={18} color="#FFFFFF" />
                <Text style={styles.saveAttendanceText}>Submit Attendance Sheet</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Criteria Picker Modal */}
        <ViewportModal visible={pickerModalType !== null} onClose={() => setPickerModalType(null)}>
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
                      onPress={() => { pickerData.onSelect(opt); setPickerModalType(null); }}
                    >
                      <Text style={[
                        styles.pickerOptionText, 
                        !isDefaultTheme && { color: appTheme.textPrimary },
                        isSelected && (isDefaultTheme ? styles.pickerOptionTextActive : { color: appTheme.primary, fontWeight: '900' })
                      ]}>{opt}</Text>
                      {isSelected ? <MaterialIcons name="check-circle" size={18} color={appTheme.primary} /> : <MaterialIcons name="radio-button-unchecked" size={18} color={isDefaultTheme ? "#CBD5E1" : appTheme.border} />}
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
  appBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0', zIndex: 10 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '900', color: '#0F172A', letterSpacing: -0.3 },
  appBarIconButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 12, paddingBottom: 90, gap: 12 },
  
  filterCard: { borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', gap: 12 },
  filterCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterCardTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A', letterSpacing: -0.2 },
  formGrid: { gap: 10 },
  fieldCol: { gap: 4 },
  fieldLabel: { fontSize: 12.5, fontWeight: '800', color: '#475569' },
  reqStar: { color: '#EF4444' },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#FFFFFF', paddingHorizontal: 10, gap: 8 },
  dropdownLeftBox: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  dropdownValue: { flex: 1, fontSize: 13.5, fontWeight: '800', color: '#0F172A' },
  findButton: { height: 42, borderRadius: 8, backgroundColor: '#059669', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 },
  findBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  
  ledgerCard: { borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', gap: 12 },
  portalTitleBox: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  portalTitleText: { fontSize: 15, fontWeight: '900', color: '#0F172A' },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  searchLabel: { fontSize: 13, fontWeight: '800', color: '#475569' },
  searchWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 8, height: 38, paddingHorizontal: 10, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#F8FAFC' },
  searchInput: { flex: 1, height: '100%', color: '#0F172A', fontSize: 13, fontWeight: '700' },
  
  attendAllBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  attendAllText: { fontSize: 13, fontWeight: '800', color: '#047857' },
  
  studentList: { gap: 10 },
  studentCard: { borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', position: 'relative', overflow: 'hidden', gap: 10 },
  leftStatusStrip: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 4 },
  studentCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  studentNameText: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  fatherNameText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  
  // P / A Options Container
  markOptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  markOptionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markOptionText: {
    fontSize: 14,
    fontWeight: '900',
  },
  
  studentMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  metaLabel: { fontSize: 10.5, fontWeight: '800', color: '#64748B' },
  metaValue: { fontSize: 11.5, fontWeight: '900', color: '#0F172A' },
  statusSummaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    marginLeft: 'auto',
  },
  statusSummaryText: {
    fontSize: 11,
    fontWeight: '800',
  },
  
  saveAttendanceBtn: { height: 42, borderRadius: 8, backgroundColor: '#059669', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 },
  saveAttendanceText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: '900', color: '#334155' },
  emptyDesc: { fontSize: 12.5, color: '#64748B', textAlign: 'center' },
  
  webModalOverlay: { position: 'fixed' as any, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  
  pickerModalContainer: { width: '100%', maxWidth: 420, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#CBD5E1', elevation: 8, zIndex: 10000 },
  pickerModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginBottom: 8 },
  pickerModalTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  pickerOptionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 4, backgroundColor: '#F8FAFC' },
  pickerOptionActive: { backgroundColor: '#ECFDF5' },
  pickerOptionText: { fontSize: 13.5, fontWeight: '700', color: '#334155' },
  pickerOptionTextActive: { fontWeight: '900', color: '#059669' },
  modalCloseBtn: { padding: 4 },
});
