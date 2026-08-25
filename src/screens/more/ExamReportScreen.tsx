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

type SubjectMark = {
  sr: number;
  subject: string;
  totalMarks: number;
  obtainedMarks: number;
  gradePct: string;
  gradeBadge: string;
};

export const ExamReportScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Search Filter Criteria States (from web image: Class, Student, Term)
  const [selectedClass, setSelectedClass] = useState('GRADE-V');
  const [selectedStudent, setSelectedStudent] = useState('Muhammad Atif');
  const [selectedTerm, setSelectedTerm] = useState('1st Assessment');
  const [isFiltered, setIsFiltered] = useState(true);

  // Dropdown Picker Modal States
  const [pickerModalType, setPickerModalType] = useState<'class' | 'student' | 'term' | null>(null);

  // Sample Student Report Data (Exact fields from user's web screenshot)
  const studentInfo = {
    name: 'Muhammad Atif',
    class: 'GRADE-V',
    section: 'A',
    rollNo: '3',
    campus: 'XYZ School - Karachi Campus',
  };

  const subjectMarks: SubjectMark[] = [
    { sr: 1, subject: 'English', totalMarks: 100, obtainedMarks: 88, gradePct: '88%', gradeBadge: 'A' },
    { sr: 2, subject: 'Mathematics', totalMarks: 100, obtainedMarks: 95, gradePct: '95%', gradeBadge: 'A+' },
    { sr: 3, subject: 'Science', totalMarks: 100, obtainedMarks: 84, gradePct: '84%', gradeBadge: 'A' },
    { sr: 4, subject: 'Urdu', totalMarks: 100, obtainedMarks: 78, gradePct: '78%', gradeBadge: 'B' },
    { sr: 5, subject: 'Computer Science', totalMarks: 100, obtainedMarks: 92, gradePct: '92%', gradeBadge: 'A+' },
  ];

  // Options for Dropdowns
  const classOptions = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V'];
  const studentOptions = ['Muhammad Atif', 'Febin Naeem', 'Janan Anees', 'Maaz', 'Mahira Shah'];
  const termOptions = ['1st Assessment', '2nd Assessment', 'Midterm', 'Final Exam'];

  const handlePrintReport = () => {
    alert(`Printing official Report Card for ${studentInfo.name} (${selectedTerm})...`);
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
        <Circle cx="85%" cy="12%" r="180" fill="rgba(14, 165, 233, 0.04)" />
        <Circle cx="15%" cy="88%" r="200" fill="rgba(2, 132, 199, 0.03)" />
        <Path d="M-40,240 Q160,120 380,260 T820,220" fill="none" stroke="rgba(14,165,233,0.03)" strokeWidth={1.5} />
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
            <Text style={styles.headerTitle}>Exam Report View</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="card-membership" size={28} color="#0284C7" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA CARD FORM (Class, Student, Term) */}
          <View style={styles.filterCard}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFAFA']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.topBlueStrip} />

            <Text style={styles.filterCardTitle}>Select Report Card Criteria</Text>

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

              {/* 2. Student */}
              <View style={styles.fieldCol}>
                <Text style={styles.fieldLabel}>Student <Text style={styles.reqStar}>*</Text></Text>
                <TouchableOpacity style={[styles.dropdownBtn, { borderColor: '#E9D5FF' }]} onPress={() => setPickerModalType('student')}>
                  <View style={[styles.dropdownLeftBox, { backgroundColor: '#F3E8FF' }]}>
                    <MaterialIcons name="person" size={20} color="#7E22CE" />
                  </View>
                  <Text style={styles.dropdownValue}>{selectedStudent}</Text>
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

            {/* Blue 3D Filter Button */}
            <TouchableOpacity 
              style={styles.filterButton} 
              onPress={() => setIsFiltered(true)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#0284C7', '#0369A1']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <MaterialIcons name="tune" size={20} color="#FFFFFF" />
              <Text style={styles.filterBtnText}>Filter Report</Text>
            </TouchableOpacity>

          </View>

          {/* GENERATED DIGITAL REPORT CARD */}
          {isFiltered && (
            <View style={styles.reportCardContainer}>
              <LinearGradient
                colors={['#FFFFFF', '#FAFAFA']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.topTealStrip} />

              {/* School Header Crest Banner */}
              <View style={styles.schoolHeaderBanner}>
                <LinearGradient
                  colors={['#0284C7', '#0369A1']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <MaterialIcons name="school" size={28} color="#FFFFFF" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.schoolNameText}>{studentInfo.campus}</Text>
                  <Text style={styles.reportCardSubtitle}>STUDENT OFFICIAL REPORT CARD • {selectedTerm}</Text>
                </View>
              </View>

              {/* Student Metadata Card Banner (3D Ultra-Premium) */}
              <View style={styles.studentMetaCard}>
                <View style={styles.studentMetaHeaderRow}>
                  <View style={styles.avatarTileBox}>
                    <LinearGradient
                      colors={['#EFF6FF', '#DBEAFE']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <MaterialIcons name="person" size={24} color="#0284C7" />
                  </View>

                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.studentNameText}>{selectedStudent}</Text>
                    <Text style={styles.studentSubText}>Candidate Roll #{studentInfo.rollNo}</Text>
                  </View>

                  <View style={styles.rollBadge}>
                    <Text style={styles.rollBadgeText}>ROLL NO: {studentInfo.rollNo}</Text>
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
                    <Text style={[styles.metaVal, { color: '#0284C7', fontWeight: '900' }]}>{selectedTerm}</Text>
                  </View>
                </View>
              </View>

              {/* Subject Marks Breakdown Ledger Cards */}
              <View style={styles.subjectListContainer}>
                <Text style={styles.sectionHeaderTitle}>Subject Academic Marks</Text>

                {subjectMarks.map((item) => {
                  const subjectIcons: Record<string, keyof typeof MaterialIcons.glyphMap> = {
                    'English': 'menu-book',
                    'Mathematics': 'calculate',
                    'Science': 'science',
                    'Urdu': 'create',
                    'Computer Science': 'computer',
                  };

                  return (
                    <View key={item.sr} style={styles.subjectItemCard}>
                      <LinearGradient
                        colors={['#FFFFFF', '#F8FAFC']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={styles.leftSubjectStrip} />

                      {/* Top Row: Icon + Name + Grade Badge */}
                      <View style={styles.subjectCardHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <View style={styles.subjectIconBox}>
                            <MaterialIcons name={subjectIcons[item.subject] || 'book'} size={18} color="#0284C7" />
                          </View>
                          <Text style={styles.subjectNameText}>{item.sr}. {item.subject}</Text>
                        </View>

                        <View style={[
                          styles.gradePill,
                          { 
                            backgroundColor: item.gradeBadge.startsWith('A') ? '#ECFDF5' : '#EFF6FF',
                            borderColor: item.gradeBadge.startsWith('A') ? '#6EE7B7' : '#93C5FD'
                          }
                        ]}>
                          <Text style={[
                            styles.gradePillText,
                            { color: item.gradeBadge.startsWith('A') ? '#047857' : '#1D4ED8' }
                          ]}>Grade {item.gradeBadge}</Text>
                        </View>
                      </View>

                      {/* Marks Grid */}
                      <View style={styles.subjectMarksRow}>
                        <View style={styles.subjectMarkCol}>
                          <Text style={styles.markLabel}>TOTAL</Text>
                          <View style={styles.markPillBox}>
                            <Text style={styles.markVal}>{item.totalMarks}</Text>
                          </View>
                        </View>
                        <View style={styles.subjectMarkCol}>
                          <Text style={styles.markLabel}>OBTAINED</Text>
                          <View style={[styles.markPillBox, { backgroundColor: '#EFF6FF', borderColor: '#93C5FD' }]}>
                            <Text style={[styles.markVal, { color: '#1D4ED8' }]}>{item.obtainedMarks}</Text>
                          </View>
                        </View>
                        <View style={styles.subjectMarkCol}>
                          <Text style={styles.markLabel}>GRADE %</Text>
                          <View style={[styles.markPillBox, { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' }]}>
                            <Text style={[styles.markVal, { color: '#047857' }]}>{item.gradePct}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* Overall Performance Summary Box */}
              <View style={styles.summaryBox}>
                <Text style={styles.sectionHeaderTitle}>Overall Performance Summary</Text>
                
                <View style={styles.summaryCardsGrid}>
                  <View style={[styles.summaryPillCard, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
                    <Text style={[styles.summaryPillLabel, { color: '#0369A1' }]}>Quarterly Grade %</Text>
                    <Text style={[styles.summaryPillValue, { color: '#0284C7' }]}>A (87.4%)</Text>
                  </View>

                  <View style={[styles.summaryPillCard, { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7' }]}>
                    <Text style={[styles.summaryPillLabel, { color: '#047857' }]}>Attendance Present</Text>
                    <Text style={[styles.summaryPillValue, { color: '#059669' }]}>86 / 90 Days</Text>
                  </View>
                </View>
              </View>

              {/* Teacher's Feedback Card */}
              <View style={styles.feedbackCard}>
                <Text style={styles.sectionHeaderTitle}>Teacher's Feedback</Text>
                <View style={styles.feedbackBox}>
                  <MaterialIcons name="format-quote" size={24} color="#0284C7" style={{ marginBottom: 4 }} />
                  <Text style={styles.feedbackText}>
                    "Muhammad Atif has shown outstanding academic progress in {selectedTerm}. Highly attentive and consistent in performance."
                  </Text>
                </View>

                {/* Digital Signatures Line */}
                <View style={styles.signaturesRow}>
                  <View style={styles.signatureCol}>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>Class Teacher</Text>
                  </View>
                  <View style={styles.signatureCol}>
                    <View style={styles.signatureLine} />
                    <Text style={styles.signatureLabel}>Head of School</Text>
                  </View>
                </View>
              </View>

              {/* Print / Export Report Action Button */}
              <TouchableOpacity 
                style={styles.printReportBtn} 
                onPress={handlePrintReport}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#0284C7', '#0369A1']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <MaterialIcons name="print" size={22} color="#FFFFFF" />
                <Text style={styles.printReportBtnText}>Print Official Report Card</Text>
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
                      name={
                        pickerModalType === 'class' ? 'school' : 
                        pickerModalType === 'student' ? 'person' : 'event'
                      } 
                      size={22} 
                      color="#0284C7" 
                    />
                  </View>
                  <Text style={styles.pickerModalTitle}>
                    Select {
                      pickerModalType === 'class' ? 'Class' : 
                      pickerModalType === 'student' ? 'Student' : 'Exam Term'
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
                  pickerModalType === 'student' ? studentOptions : termOptions
                ).map((opt) => {
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={styles.pickerOptionItem}
                      onPress={() => {
                        if (pickerModalType === 'class') setSelectedClass(opt);
                        if (pickerModalType === 'student') setSelectedStudent(opt);
                        if (pickerModalType === 'term') setSelectedTerm(opt);
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
    backgroundColor: 'rgba(14, 165, 233, 0.05)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -120,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(2, 132, 199, 0.04)',
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
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  topBlueStrip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 5,
    backgroundColor: '#0284C7',
  },
  filterCardTitle: {
    fontSize: 16,
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
    fontSize: 13,
    fontWeight: '900',
    color: '#475569',
  },
  reqStar: {
    color: '#EF4444',
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    gap: 8,
  },
  dropdownLeftBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownValue: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  filterButton: {
    height: 42,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginTop: 2,
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.1,
  },

  // Generated Digital Report Card
  reportCardContainer: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.95)',
    position: 'relative',
    overflow: 'hidden',
    gap: 14,
    elevation: 4,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  topTealStrip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 4,
    backgroundColor: '#0284C7',
  },
  schoolHeaderBanner: {
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
    position: 'relative',
    elevation: 2,
  },
  schoolNameText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  reportCardSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E0F2FE',
    letterSpacing: 0.2,
    marginTop: 1,
  },

  // Student Metadata Banner
  studentMetaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  studentMetaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 8,
  },
  avatarTileBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  studentNameText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  studentSubText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  rollBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#93C5FD',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  rollBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1D4ED8',
  },
  metaGridThree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  metaSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },

  // Subject Academic List
  subjectListContainer: {
    gap: 10,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  subjectItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
    gap: 10,
    elevation: 3,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  leftSubjectStrip: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: 5,
    backgroundColor: '#0284C7',
  },
  subjectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  subjectNameText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  gradePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  gradePillText: {
    fontSize: 12.5,
    fontWeight: '900',
  },
  subjectMarksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  subjectMarkCol: {
    flex: 1,
    gap: 4,
    alignItems: 'center',
  },
  markLabel: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#64748B',
  },
  markPillBox: {
    width: '100%',
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },

  // Overall Performance Summary
  summaryBox: {
    gap: 10,
  },
  summaryCardsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryPillCard: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 4,
  },
  summaryPillLabel: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  summaryPillValue: {
    fontSize: 16,
    fontWeight: '900',
  },

  // Teacher Feedback Card
  feedbackCard: {
    gap: 10,
  },
  feedbackBox: {
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369A1',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 12,
  },
  signatureCol: {
    alignItems: 'center',
    gap: 6,
    width: 130,
  },
  signatureLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#CBD5E1',
  },
  signatureLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },

  // Print Report Button
  printReportBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    marginTop: 8,
  },
  printReportBtnText: {
    color: '#FFFFFF',
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
