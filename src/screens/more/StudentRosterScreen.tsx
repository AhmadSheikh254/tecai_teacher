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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Ellipse } from 'react-native-svg';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

type Student = {
  id: string;
  regNo: string;
  name: string;
  father: string;
  grade: string;
  section: string;
  school: string;
};

// Uniform premium theme for all cards to look identical and clean
const CARD_THEME = {
  accent: '#2563EB',
  glow: 'rgba(37,99,235,0.05)',
  avatarBg: 'rgba(37,99,235,0.09)',
  badge: ['#2563EB', '#1D4ED8'] as [string, string]
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
      {/* ── PREMIUM LIGHT BG GRADIENT ── */}
      <LinearGradient
        colors={['#C7DCFF', '#D8E9FF', '#E8F2FF', '#F5F9FF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Radial glows */}
      <View style={styles.orb1} pointerEvents="none" />
      <View style={styles.orb2} pointerEvents="none" />
      <View style={styles.orb3} pointerEvents="none" />

      {/* Decorative curves */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Ellipse cx="115%" cy="5%" rx="65%" ry="28%" fill="rgba(255,255,255,0.35)" />
        <Ellipse cx="-15%" cy="95%" rx="60%" ry="25%" fill="rgba(255,255,255,0.3)" />
        <Path d="M-40,260 Q160,140 380,280 T820,240" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
        <Path d="M-40,320 Q160,200 380,340 T820,300" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* App Bar (glass) */}
        <View style={styles.appBar}>
          <LinearGradient
            colors={['rgba(255,255,255,0.75)', 'rgba(255,255,255,0.60)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={20} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Students View</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="groups" size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Glassmorphic Filter Card */}
          <View style={styles.filterCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.70)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
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
              <LinearGradient
                colors={['#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0)']}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <Text style={styles.filterBtnText}>Filter</Text>
            </TouchableOpacity>
          </View>

          {/* Student Directory Header Title */}
          <View style={styles.recordsHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="assignment-ind" size={18} color="#1E293B" />
              <Text style={styles.recordsSectionTitle}>Students Directory</Text>
            </View>
            <View style={styles.recordsCountBadge}>
              <Text style={styles.recordsCountText}>{filteredStudents.length} Students</Text>
            </View>
          </View>

          {/* Search bar input (glass design) */}
          <View style={styles.searchWrapper}>
            <LinearGradient
              colors={['rgba(255,255,255,0.80)', 'rgba(255,255,255,0.60)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
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
              <LinearGradient
                colors={['rgba(255,255,255,0.80)', 'rgba(255,255,255,0.60)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
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
                    activeOpacity={0.8}
                    onPress={() => setSelectedStudent(student)}
                  >
                    {/* Glass background */}
                    <LinearGradient
                      colors={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.72)']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />

                    {/* Accent bar - Uniform Royal Blue theme */}
                    <View style={[styles.cardAccentBar, { backgroundColor: CARD_THEME.accent }]} />

                    {/* Initials Avatar - Uniform Royal Blue theme */}
                    <View style={[styles.avatarCircle, { backgroundColor: CARD_THEME.avatarBg }]}>
                      <Text style={[styles.avatarText, { color: CARD_THEME.accent }]}>{getInitials(student.name)}</Text>
                    </View>

                    {/* Center Details Block */}
                    <View style={styles.studentInfoCol}>
                      <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
                      <Text style={styles.studentFather} numberOfLines={1}>Father: {student.father}</Text>
                      
                      <View style={styles.metaBadgeRow}>
                        <View style={styles.regNoBadge}>
                          <Text style={styles.regNoText}>{student.regNo}</Text>
                        </View>
                        <View style={[styles.classBadge, { backgroundColor: CARD_THEME.avatarBg }]}>
                          <Text style={[styles.classBadgeText, { color: CARD_THEME.accent }]}>{student.grade}-{student.section}</Text>
                        </View>
                      </View>

                      <View style={styles.schoolRow}>
                        <MaterialIcons name="school" size={12} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={styles.schoolText} numberOfLines={1}>{student.school}</Text>
                      </View>
                    </View>

                    {/* View Profile Action - Uniform Royal Blue theme */}
                    <TouchableOpacity 
                      style={styles.viewProfileBtn}
                      activeOpacity={0.7}
                      onPress={() => setSelectedStudent(student)}
                    >
                      <LinearGradient
                        colors={[CARD_THEME.accent + '22', CARD_THEME.accent + '0B']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <Text style={[styles.viewProfileBtnText, { color: CARD_THEME.accent }]}>View</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* CLASS SELECTOR MODAL (frosted glass option list) */}
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
              <LinearGradient
                colors={['rgba(255,255,255,0.98)', 'rgba(245,249,255,0.95)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
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
                    activeOpacity={0.7}
                  >
                    <Text style={styles.pickerOptionText}>{c}</Text>
                    {selectedClass === c && <MaterialIcons name="check-circle" size={19} color="#2563EB" />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* PROFILE SHEET MODAL (bottom-sheet glass) */}
        <Modal
          visible={selectedStudent !== null}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedStudent(null)}
        >
          <View style={styles.sheetBackdrop}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setSelectedStudent(null)} />
            <View style={styles.sheetContainer}>
              <LinearGradient
                colors={['rgba(255,255,255,0.96)', 'rgba(240,248,255,0.92)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
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
                      <LinearGradient
                        colors={['#2563EB', '#1D4ED8']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
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
                      <LinearGradient
                        colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.72)']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
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
                      <LinearGradient
                        colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.72)']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
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
                      <LinearGradient
                        colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.72)']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
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
                      <LinearGradient
                        colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.72)']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
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
                      <LinearGradient
                        colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.72)']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
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
                      <LinearGradient
                        colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.72)']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
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
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },

  // Orbs
  orb1: {
    position: 'absolute', top: -160, right: -140,
    width: 440, height: 440, borderRadius: 220,
    backgroundColor: 'rgba(99,140,255,0.22)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -130,
    width: 380, height: 380, borderRadius: 190,
    backgroundColor: 'rgba(52,211,153,0.16)',
  },
  orb3: {
    position: 'absolute', top: '38%', right: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(167,139,250,0.16)',
  },

  // App Bar
  appBar: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.70)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  appBarIconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.70)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll Container
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
  },

  // Filters Card
  filterCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.70)',
    overflow: 'hidden',
    position: 'relative',
    gap: 14,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  filterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(226, 232, 240, 0.8)',
    paddingBottom: 10,
  },
  filterCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.2,
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.90)',
  },
  dropdownValueText: {
    fontSize: 13.5,
    color: '#1E293B',
    fontWeight: '700',
  },
  filterBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Section Header
  recordsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  recordsSectionTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  recordsCountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  recordsCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },

  // Search input
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    overflow: 'hidden',
    position: 'relative',
    elevation: 2,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },

  // Roster Cards List
  rosterList: {
    gap: 10,
  },
  studentCard: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.70)',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '800',
  },
  studentInfoCol: {
    flex: 1,
    gap: 2,
    paddingLeft: 2,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  studentFather: {
    fontSize: 10.5,
    color: '#475569',
    fontWeight: '700',
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  regNoBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  regNoText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  classBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  schoolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  schoolText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  viewProfileBtn: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.60)',
    overflow: 'hidden',
    position: 'relative',
    alignSelf: 'center',
  },
  viewProfileBtnText: {
    fontSize: 12,
    fontWeight: '900',
  },

  // Picker modal
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '82%',
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 10,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  pickerTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(226,232,240,0.8)',
    paddingBottom: 10,
    letterSpacing: -0.1,
  },
  pickerOptionsList: {
    gap: 6,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  pickerOptionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },

  // Profile bottom sheet
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '84%',
    paddingBottom: 30,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
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
    paddingVertical: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(226,232,240,0.8)',
  },
  sheetHeaderTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0F172A',
  },
  sheetCloseBtn: {
    padding: 4,
  },
  sheetScroll: {
    paddingHorizontal: 20,
  },
  profileBanner: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 6,
  },
  bannerAvatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  bannerAvatarText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  bannerName: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0F172A',
  },
  bannerRegNo: {
    fontSize: 14.5,
    color: '#64748B',
    fontWeight: '700',
  },
  activeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    fontWeight: '800',
    color: '#059669',
  },
  detailsGroup: {
    gap: 10,
    paddingBottom: 20,
  },
  detailRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  detailsSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 1.0,
    marginBottom: 8,
    paddingLeft: 4,
  },
  detailIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  detailMeta: {
    gap: 3,
    flex: 1,
  },
  detailLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  detailValue: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#1E293B',
  },

  // Skeleton structure
  skeletonCard: {
    backgroundColor: 'rgba(255,255,255,0.80)',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.70)',
  },
  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 10,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
  },
  emptyTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#1E293B',
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
