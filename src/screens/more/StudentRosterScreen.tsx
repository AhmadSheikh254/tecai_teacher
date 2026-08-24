import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  Animated,
  useWindowDimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const StudentRosterScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Screen States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('GRADE-II');
  const [classPickerVisible, setClassPickerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Roster Student Data matching desktop screenshot
  const [studentsList] = useState([
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
    <Animated.View key={`skeleton-${index}`} style={[styles.skeletonCard, { opacity: pulseAnim }, theme.shadows.level1]}>
      <View style={styles.skeletonAvatar} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonLineMedium} />
        <View style={styles.skeletonLineShort} />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Students View</Text>
        </View>
        <TouchableOpacity style={styles.appBarIconButton}>
          <MaterialIcons name="groups" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Class Filter Card */}
        <View style={[styles.filterCard, theme.shadows.level1]}>
          <View style={styles.filterCardHeader}>
            <MaterialIcons name="filter-alt" size={20} color={theme.colors.primary} />
            <Text style={styles.filterCardTitle}>Filter Roster</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Class *</Text>
            <TouchableOpacity style={styles.formDropdown} onPress={() => setClassPickerVisible(true)}>
              <Text style={styles.dropdownValueText}>{selectedClass || 'Select Class'}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.filterBtn, theme.shadows.level1]} 
            onPress={handleApplyFilter}
            activeOpacity={0.8}
          >
            <Text style={styles.filterBtnText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Student Records List Title */}
        <View style={styles.recordsHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialIcons name="assignment-ind" size={18} color={theme.colors.onSurface} />
            <Text style={styles.recordsSectionTitle}>Students Directory</Text>
          </View>
          <View style={styles.recordsCountBadge}>
            <Text style={styles.recordsCountText}>{filteredStudents.length} Students</Text>
          </View>
        </View>

        {/* Search input field */}
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name, father name or reg no..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={18} color={theme.colors.onSurfaceVariant} />
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
          <View style={[styles.emptyContainer, theme.shadows.level1]}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="person-search" size={48} color={theme.colors.outline} />
            </View>
            <Text style={styles.emptyTitle}>No Students Found</Text>
            <Text style={styles.emptyDesc}>We couldn't find any students matching your search criteria. Try modifying your search.</Text>
          </View>
        ) : (
          <View style={styles.rosterList}>
            {filteredStudents.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={[styles.studentCard, theme.shadows.level1]}
                activeOpacity={0.7}
                onPress={() => setSelectedStudent(student)}
              >
                {/* Left side: Avatar Circle initials */}
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>{getInitials(student.name)}</Text>
                </View>

                {/* Center details */}
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
                    <MaterialIcons name="school" size={12} color={theme.colors.outline} style={{ marginRight: 4 }} />
                    <Text style={styles.schoolText} numberOfLines={1}>{student.school}</Text>
                  </View>
                </View>

                {/* Right side: View button */}
                <TouchableOpacity 
                  style={styles.viewProfileBtn}
                  onPress={() => setSelectedStudent(student)}
                >
                  <Text style={styles.viewProfileBtnText}>View</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* CLASS FILTER DROPDOWN MODAL */}
      <Modal
        visible={classPickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClassPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.pickerBackdrop} 
          activeOpacity={1} 
          onPress={() => setClassPickerVisible(false)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>Select Class</Text>
            <View style={styles.pickerOptionsList}>
              {['GRADE-II', 'Grade-I', 'Grade-III'].map((c) => (
                <TouchableOpacity 
                  key={c} 
                  style={styles.pickerOptionItem}
                  onPress={() => {
                    setSelectedClass(c);
                    setClassPickerVisible(false);
                  }}
                >
                  <Text style={styles.pickerOptionText}>{c}</Text>
                  {selectedClass === c && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* STUDENT PROFILE SHEET MODAL */}
      <Modal
        visible={selectedStudent !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedStudent(null)}
      >
        <View style={styles.sheetBackdrop}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedStudent(null)} />
          <View style={[styles.sheetContainer, theme.shadows.level2]}>
            
            {/* Sheet Handle indicator */}
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetHeaderTitle}>Student Profile</Text>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setSelectedStudent(null)}>
                <MaterialIcons name="close" size={22} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            {selectedStudent && (
              <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
                
                {/* Profile Banner */}
                <View style={styles.profileBanner}>
                  <View style={styles.bannerAvatarCircle}>
                    <Text style={styles.bannerAvatarText}>{getInitials(selectedStudent.name)}</Text>
                  </View>
                  <Text style={styles.bannerName}>{selectedStudent.name}</Text>
                  <Text style={styles.bannerRegNo}>{selectedStudent.regNo}</Text>
                </View>

                {/* Profile Details List */}
                <View style={styles.detailsGroup}>
                  
                  {/* Student Details Card */}
                  <View style={styles.detailsSectionCard}>
                    <Text style={styles.detailsSectionTitle}>Student Information</Text>

                    <View style={styles.detailRow}>
                      <MaterialIcons name="badge" size={18} color={theme.colors.primary} />
                      <View style={styles.detailMeta}>
                        <Text style={styles.detailLabel}>Reg No</Text>
                        <Text style={styles.detailValue}>{selectedStudent.regNo}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <MaterialIcons name="person" size={18} color={theme.colors.primary} />
                      <View style={styles.detailMeta}>
                        <Text style={styles.detailLabel}>Student Name</Text>
                        <Text style={styles.detailValue}>{selectedStudent.name}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <MaterialIcons name="people" size={18} color={theme.colors.primary} />
                      <View style={styles.detailMeta}>
                        <Text style={styles.detailLabel}>Father Name</Text>
                        <Text style={styles.detailValue}>{selectedStudent.father}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <MaterialIcons name="class" size={18} color={theme.colors.primary} />
                      <View style={styles.detailMeta}>
                        <Text style={styles.detailLabel}>Class</Text>
                        <Text style={styles.detailValue}>{selectedStudent.grade}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <MaterialIcons name="view-module" size={18} color={theme.colors.primary} />
                      <View style={styles.detailMeta}>
                        <Text style={styles.detailLabel}>Section</Text>
                        <Text style={styles.detailValue}>{selectedStudent.section}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <MaterialIcons name="school" size={18} color={theme.colors.primary} />
                      <View style={styles.detailMeta}>
                        <Text style={styles.detailLabel}>School Name</Text>
                        <Text style={styles.detailValue}>{selectedStudent.school}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  appBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.containerMargin,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.headlineLgMobile.fontSize,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  appBarIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll Container
  scrollContent: {
    padding: theme.spacing.containerMargin,
    paddingBottom: 110,
    gap: 16,
  },

  // Filters Card panel
  filterCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.xl,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    borderColor: 'rgba(0, 82, 204, 0.08)',
    gap: 14,
  },
  filterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingBottom: 8,
  },
  filterCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.default,
    height: 42,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
  },
  dropdownValueText: {
    fontSize: 13,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  filterBtn: {
    backgroundColor: theme.colors.primary,
    height: 42,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  filterBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Section Header
  recordsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  recordsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  recordsCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
  },
  recordsCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Search input
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.full,
    height: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: theme.colors.onSurface,
    fontSize: 13,
    fontWeight: '500',
  },

  // Roster Cards List
  rosterList: {
    gap: 12,
  },
  studentCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.lg,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    borderColor: 'rgba(0, 82, 204, 0.05)',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  studentInfoCol: {
    flex: 1,
    gap: 3,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  studentFather: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  regNoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  regNoText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  classBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
  },
  classBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  schoolText: {
    fontSize: 9.5,
    color: theme.colors.outline,
    fontWeight: '500',
  },
  viewProfileBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.1)',
  },
  viewProfileBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Option Picker Modal Styles
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingBottom: 8,
  },
  pickerOptionsList: {
    gap: 4,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  pickerOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },

  // Profile Bottom Sheet styles
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '82%',
    paddingBottom: 30,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.outlineVariant,
    alignSelf: 'center',
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  sheetHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  sheetCloseBtn: {
    padding: 4,
  },
  sheetScroll: {
    paddingHorizontal: 20,
  },
  profileBanner: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  bannerAvatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bannerAvatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  bannerName: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  bannerRegNo: {
    fontSize: 12,
    color: theme.colors.outline,
    fontWeight: '600',
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.15)',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  activeStatusText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#4CAF50',
  },
  detailsGroup: {
    gap: 16,
  },
  detailsSectionCard: {
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  detailsSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.04)',
    paddingBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailMeta: {
    gap: 2,
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.outline,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },

  // Skeleton structure
  skeletonCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.05)',
  },
  skeletonAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceContainer,
    marginRight: 12,
  },
  skeletonLineShort: {
    width: '30%',
    height: 10,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 4,
  },
  skeletonLineMedium: {
    width: '60%',
    height: 14,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 4,
  },
  emptyContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.xl,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,82,204,0.06)',
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,82,204,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.onSurface,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 260,
  },
});
