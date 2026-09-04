import React, { useState, useEffect } from 'react';
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
  Animated,
  useWindowDimensions,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
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

// Universal Full-Viewport BottomSheet for Web & Mobile
const ViewportBottomSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ visible, onClose, children }) => {
  if (!visible) return null;

  if (Platform.OS === 'web' && typeof document !== 'undefined' && (ReactDOM as any)?.createPortal) {
    return (ReactDOM as any).createPortal(
      <View style={styles.webBottomSheetOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        {children}
      </View>,
      document.body
    );
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide" statusBarTranslucent={true} onRequestClose={onClose}>
      <View style={styles.sheetBackdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        {children}
      </View>
    </Modal>
  );
};

type Student = {
  id: string;
  regNo: string;
  name: string;
  father: string;
  grade: string;
  section: string;
  school: string;
};

export const StudentRosterScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Screen States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('GRADE-II');
  const [classPickerVisible, setClassPickerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Roster Student Data matching desktop screenshot
  const [studentsList] = useState<Student[]>([
    { id: '1', regNo: 'HMSA_2230', name: 'MUHAMMAD MUSTAFA', father: 'MUHAMMAD Zahid', grade: 'GRADE-II', section: 'A', school: 'XYZ School - Karachi Campus' },
    { id: '2', regNo: 'HMSA_2231', name: 'HIRA TAHIR', father: 'samiullah', grade: 'GRADE-II', section: 'A', school: 'XYZ School - Karachi Campus' },
    { id: '3', regNo: 'HMSA_2232', name: 'ANUSHA SAQIB', father: 'SAQIB JAVED', grade: 'GRADE-II', section: 'A', school: 'XYZ School - Karachi Campus' },
    { id: '4', regNo: 'HMSA_2233', name: 'HOORB FATIMA', father: 'HAROON RAZA', grade: 'GRADE-II', section: 'A', school: 'XYZ School - Karachi Campus' },
    { id: '5', regNo: 'HMSA_2234', name: 'ARISHA NAZ', father: 'ASIF HUSSAIN', grade: 'GRADE-II', section: 'A', school: 'XYZ School - Karachi Campus' },
    { id: '6', regNo: 'HMSA_2235', name: 'SHAHBAKH', father: 'samiullah', grade: 'GRADE-II', section: 'C', school: 'XYZ School - Karachi Campus' },
    { id: '7', regNo: 'HMSA_1', name: 'Qamr', father: 'abc', grade: 'GRADE-II', section: 'C', school: 'XYZ School - Karachi Campus' },
    { id: '8', regNo: 'HMSA_3272025', name: 'Muhammad Sufiyan Khan', father: 'Yasir Khan Kakar', grade: 'GRADE-II', section: 'D', school: 'XYZ School - Karachi Campus' },
    { id: '9', regNo: 'HMSA_3512025', name: 'Muhammad Ibrahim', father: 'M Sarfraz', grade: 'GRADE-II', section: 'B', school: 'XYZ School - Karachi Campus' },
  ]);

  // Extract initials helper
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Pulse animation for skeleton loading
  const [pulseAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: 600,
            useNativeDriver: false
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: false
          })
        ])
      ).start();
    }
  }, [loading]);

  const handleApplyFilter = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 850);
  };

  // Filter student data
  const filteredStudents = studentsList.filter(student => {
    // 1. Class filter check
    if (student.grade !== selectedClass) return false;

    // 2. Search query check
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.father.toLowerCase().includes(query) ||
      student.regNo.toLowerCase().includes(query) ||
      student.section.toLowerCase().includes(query)
    );
  });

  const renderSkeletonCard = (index: number) => (
    <Animated.View key={`skeleton-${index}`} style={[styles.skeletonCard, { opacity: pulseAnim }]}>
      <View style={styles.skeletonAvatar} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonLineMedium} />
        <View style={styles.skeletonLineShort} />
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* App Bar */}
        <View style={styles.appBar}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Students View</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="groups" size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Solid Filter Card */}
          <View style={styles.filterCard}>
            <View style={styles.filterCardHeader}>
              <MaterialIcons name="filter-alt" size={18} color="#2563EB" />
              <Text style={styles.filterCardTitle}>Filter Roster</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Class *</Text>
              <TouchableOpacity style={styles.formDropdown} onPress={() => setClassPickerVisible(true)} activeOpacity={0.75}>
                <Text style={styles.dropdownValueText}>{selectedClass || 'Select Class'}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.filterBtn} 
              onPress={handleApplyFilter}
              activeOpacity={0.8}
            >
              <Text style={styles.filterBtnText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Student Directory Header Title */}
          <View style={styles.recordsHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="assignment-ind" size={18} color="#0F172A" />
              <Text style={styles.recordsSectionTitle}>Students Directory</Text>
            </View>
            <View style={styles.recordsCountBadge}>
              <Text style={styles.recordsCountText}>{filteredStudents.length} Students</Text>
            </View>
          </View>

          {/* Search bar input */}
          <View style={styles.searchWrapper}>
            <MaterialIcons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name, father name or reg no..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <MaterialIcons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>

          {/* Cards List rendering */}
          {loading ? (
            <View style={styles.rosterList}>
              {renderSkeletonCard(1)}
              {renderSkeletonCard(2)}
              {renderSkeletonCard(3)}
            </View>
          ) : filteredStudents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="person-search" size={44} color="#94A3B8" />
              </View>
              <Text style={styles.emptyTitle}>No Students Found</Text>
              <Text style={styles.emptyDesc}>We couldn't find any students matching your search criteria. Try modifying your filter or query.</Text>
            </View>
          ) : (
            <View style={styles.rosterList}>
              {filteredStudents.map((student, index) => {
                return (
                  <TouchableOpacity
                    key={student.id}
                    style={styles.studentCard}
                    activeOpacity={0.85}
                    onPress={() => setSelectedStudent(student)}
                  >
                    {/* Accent bar on left */}
                    <View style={styles.cardAccentBar} />

                    {/* Initials Avatar */}
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarText}>{getInitials(student.name)}</Text>
                    </View>

                    {/* Center Details Block */}
                    <View style={styles.studentInfoCol}>
                      <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
                      <Text style={styles.studentFather} numberOfLines={1}>Father: {student.father}</Text>
                      
                      <View style={styles.metaBadgeRow}>
                        <View style={styles.regNoBadge}>
                          <Text style={styles.regNoText}>{student.regNo}</Text>
                        </View>
                        <View style={styles.classBadge}>
                          <Text style={styles.classBadgeText}>{student.grade}-{student.section}</Text>
                        </View>
                      </View>

                      <View style={styles.schoolRow}>
                        <MaterialIcons name="school" size={13} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.schoolText} numberOfLines={1}>{student.school}</Text>
                      </View>
                    </View>

                    {/* View Profile Action */}
                    <TouchableOpacity 
                      style={styles.viewProfileBtn}
                      activeOpacity={0.7}
                      onPress={() => setSelectedStudent(student)}
                    >
                      <Text style={styles.viewProfileBtnText}>View</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* CLASS SELECTOR MODAL */}
        <ViewportModal
          visible={classPickerVisible}
          onClose={() => setClassPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeaderRow}>
              <Text style={styles.pickerTitle}>Select Class</Text>
              <TouchableOpacity onPress={() => setClassPickerVisible(false)} style={styles.modalCloseBtn} activeOpacity={0.7}>
                <MaterialIcons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <View style={styles.pickerOptionsList}>
              {['GRADE-II', 'Grade-I', 'Grade-III'].map((c) => {
                const isSelected = selectedClass === c;
                return (
                  <TouchableOpacity 
                    key={c} 
                    style={[styles.pickerOptionItem, isSelected && styles.pickerOptionItemSelected]}
                    onPress={() => {
                      setSelectedClass(c);
                      setClassPickerVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextSelected]}>{c}</Text>
                    {isSelected ? (
                      <MaterialIcons name="check-circle" size={20} color="#2563EB" />
                    ) : (
                      <MaterialIcons name="radio-button-unchecked" size={20} color="#94A3B8" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ViewportModal>

        {/* PROFILE SHEET MODAL */}
        <ViewportBottomSheet
          visible={selectedStudent !== null}
          onClose={() => setSelectedStudent(null)}
        >
          <View style={styles.sheetContainer}>
            {/* Sheet drag bar */}
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetHeaderTitle}>Student Profile</Text>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setSelectedStudent(null)}>
                <MaterialIcons name="close" size={20} color="#475569" />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                
                {/* Banner Profile */}
                <View style={styles.profileBanner}>
                  <View style={styles.bannerAvatarCircle}>
                    <Text style={styles.bannerAvatarText}>{getInitials(selectedStudent.name)}</Text>
                  </View>
                  <Text style={styles.bannerName}>{selectedStudent.name}</Text>
                  <Text style={styles.bannerRegNo}>{selectedStudent.regNo}</Text>
                  
                  {/* Status Badge */}
                  <View style={styles.activeStatusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.activeStatusText}>Active Student</Text>
                  </View>
                </View>

                {/* Details block */}
                <View style={styles.detailsGroup}>
                  <Text style={styles.detailsSectionTitle}>Student Information</Text>

                  {/* Reg No Card */}
                  <View style={styles.detailRowCard}>
                    <View style={styles.detailIconBox}>
                      <MaterialIcons name="badge" size={18} color="#2563EB" />
                    </View>
                    <View style={styles.detailMeta}>
                      <Text style={styles.detailLabel}>REGISTRATION NO</Text>
                      <Text style={styles.detailValue}>{selectedStudent.regNo}</Text>
                    </View>
                  </View>

                  {/* Student Name Card */}
                  <View style={styles.detailRowCard}>
                    <View style={styles.detailIconBox}>
                      <MaterialIcons name="person" size={18} color="#2563EB" />
                    </View>
                    <View style={styles.detailMeta}>
                      <Text style={styles.detailLabel}>STUDENT NAME</Text>
                      <Text style={styles.detailValue}>{selectedStudent.name}</Text>
                    </View>
                  </View>

                  {/* Father Name Card */}
                  <View style={styles.detailRowCard}>
                    <View style={styles.detailIconBox}>
                      <MaterialIcons name="people" size={18} color="#2563EB" />
                    </View>
                    <View style={styles.detailMeta}>
                      <Text style={styles.detailLabel}>FATHER NAME</Text>
                      <Text style={styles.detailValue}>{selectedStudent.father}</Text>
                    </View>
                  </View>

                  {/* Class Grade Card */}
                  <View style={styles.detailRowCard}>
                    <View style={styles.detailIconBox}>
                      <MaterialIcons name="class" size={18} color="#2563EB" />
                    </View>
                    <View style={styles.detailMeta}>
                      <Text style={styles.detailLabel}>CLASS GRADE</Text>
                      <Text style={styles.detailValue}>{selectedStudent.grade}</Text>
                    </View>
                  </View>

                  {/* Class Section Card */}
                  <View style={styles.detailRowCard}>
                    <View style={styles.detailIconBox}>
                      <MaterialIcons name="view-module" size={18} color="#2563EB" />
                    </View>
                    <View style={styles.detailMeta}>
                      <Text style={styles.detailLabel}>CLASS SECTION</Text>
                      <Text style={styles.detailValue}>{selectedStudent.section}</Text>
                    </View>
                  </View>

                  {/* School Campus Card */}
                  <View style={styles.detailRowCard}>
                    <View style={styles.detailIconBox}>
                      <MaterialIcons name="school" size={18} color="#2563EB" />
                    </View>
                    <View style={styles.detailMeta}>
                      <Text style={styles.detailLabel}>SCHOOL CAMPUS</Text>
                      <Text style={styles.detailValue}>{selectedStudent.school}</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </ViewportBottomSheet>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },

  // App Bar
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
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

  // Scroll Container
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },

  // Filters Card
  filterCard: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    elevation: 2,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  filterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  filterCardTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dropdownValueText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
  },
  filterBtn: {
    height: 42,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    elevation: 1,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Section Header
  recordsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  recordsSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordsCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  recordsCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
  },

  // Search input
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '600',
  },

  // Roster Cards List
  rosterList: {
    gap: 10,
  },
  studentCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#2563EB',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  studentInfoCol: {
    flex: 1,
    gap: 3,
  },
  studentName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.1,
  },
  studentFather: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    marginBottom: 2,
  },
  regNoBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  regNoText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  classBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolText: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '500',
  },
  viewProfileBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignSelf: 'center',
    marginLeft: 8,
  },
  viewProfileBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },

  // Picker modal
  webModalOverlay: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw' as any,
    height: '100vh' as any,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 999999,
  },
  webBottomSheetOverlay: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw' as any,
    height: '100vh' as any,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 999999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  pickerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerOptionsList: {
    gap: 8,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  pickerOptionItemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  pickerOptionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '800',
  },

  // Profile bottom sheet
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sheetHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetCloseBtn: {
    padding: 6,
  },
  sheetScroll: {
    paddingHorizontal: 16,
  },
  profileBanner: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  bannerAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  bannerAvatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bannerName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  bannerRegNo: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeStatusText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#059669',
  },
  detailsGroup: {
    gap: 8,
    paddingBottom: 20,
  },
  detailRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailsSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    paddingLeft: 2,
  },
  detailIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  detailMeta: {
    gap: 2,
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },

  // Skeleton structure
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skeletonAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  skeletonLineShort: {
    width: '30%',
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  skeletonLineMedium: {
    width: '60%',
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  emptyContainer: {
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
});
