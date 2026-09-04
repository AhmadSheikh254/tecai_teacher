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

type AttendanceRecord = {
  id: string;
  name: string;
  father: string;
  grade: string;
  section: string;
  status: 'Present' | 'Absent' | 'Late';
  date: string;
};

export const AttendanceScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Primary Tab state: 'view' or 'create' (Mark Attendance)
  const [activeTab, setActiveTab] = useState<'view' | 'create'>('view');

  // Screen States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successToastVisible, setSuccessToastVisible] = useState(false);

  // Filter Form States (Desktop matches)
  const [selectedClass, setSelectedClass] = useState('GRADE-II');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState('08/24/2026'); // Pre-fill with today

  // Bulk operation status dropdown value
  const [bulkStatus, setBulkStatus] = useState<'Present' | 'Absent' | 'Late'>('Present');

  // Dropdown Pickers state
  const [activePicker, setActivePicker] = useState<'class' | 'section' | 'bulkStatus' | null>(null);

  // Student Attendance Records List matching desktop inputs
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { id: '1', name: 'MUHAMMAD MUSTAFA', father: 'MUHAMMAD Zahid', grade: 'GRADE-II', section: 'A', status: 'Present', date: '08/24/2026' },
    { id: '2', name: 'HIRA TAHIR', father: 'samiullah', grade: 'GRADE-II', section: 'A', status: 'Present', date: '08/24/2026' },
    { id: '3', name: 'ANUSHA SAQIB', father: 'SAQIB JAVED', grade: 'GRADE-II', section: 'A', status: 'Present', date: '08/24/2026' },
    { id: '4', name: 'HOORB FATIMA', father: 'HAROON RAZA', grade: 'GRADE-II', section: 'A', status: 'Present', date: '08/24/2026' },
    { id: '5', name: 'ARISHA NAZ', father: 'ASIF HUSSAIN', grade: 'GRADE-II', section: 'A', status: 'Present', date: '08/24/2026' },
    { id: '6', name: 'SHAHBAKH', father: 'samiullah', grade: 'GRADE-II', section: 'C', status: 'Absent', date: '08/24/2026' },
    { id: '7', name: 'Qamr', father: 'abc', grade: 'GRADE-II', section: 'C', status: 'Absent', date: '08/24/2026' },
    { id: '8', regNo: 'HMSA_3272025', name: 'Muhammad Sufiyan Khan', father: 'Yasir Khan Kakar', grade: 'GRADE-II', section: 'D', status: 'Late', date: '08/24/2026' } as any,
    { id: '9', regNo: 'HMSA_3512025', name: 'Muhammad Ibrahim', father: 'M Sarfraz', grade: 'GRADE-II', section: 'B', status: 'Present', date: '08/24/2026' } as any,
  ]);

  // Extract initials helper for avatar badges
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Pulse animation for Skeleton loader
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
    }, 800);
  };

  // Toggle student attendance status in Mark mode
  const handleToggleStatus = (id: string, newStatus: 'Present' | 'Absent' | 'Late') => {
    setAttendanceRecords(prev => 
      prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
    );
  };

  // Apply bulk status to all loaded students in current filter
  const handleApplyBulkStatus = () => {
    setAttendanceRecords(prev => 
      prev.map(item => {
        if (item.grade === selectedClass && item.section === selectedSection) {
          return { ...item, status: bulkStatus };
        }
        return item;
      })
    );
  };

  // Submit attendance batch
  const handleSaveAttendance = () => {
    setSuccessToastVisible(true);
    setTimeout(() => {
      setSuccessToastVisible(false);
    }, 3000);
  };

  // Filter records based on search and selected filter class/section
  const filteredRecords = attendanceRecords.filter(item => {
    const matchesFilter = item.grade === selectedClass && item.section === selectedSection;
    if (!matchesFilter) return false;

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(query) || 
      item.father.toLowerCase().includes(query) || 
      item.status.toLowerCase().includes(query);

    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', activeBg: '#059669' };
      case 'Absent':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', activeBg: '#DC2626' };
      case 'Late':
      default:
        return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', activeBg: '#D97706' };
    }
  };

  const renderSkeletonCard = (index: number) => (
    <Animated.View key={`skeleton-${index}`} style={[styles.skeletonCard, { opacity: pulseAnim }]}>
      <View style={styles.skeletonAvatar} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonLineMedium} />
        <View style={styles.skeletonLineShort} />
      </View>
      <View style={styles.skeletonBadge} />
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
            <Text style={styles.headerTitle}>Attendance Portal</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="how-to-reg" size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Success Alert Banner */}
        {successToastVisible && (
          <View style={styles.alertBanner}>
            <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
            <Text style={styles.alertBannerText}>Student Attendance Marked successfully.</Text>
          </View>
        )}

        {/* Tab Buttons */}
        <View style={styles.tabsWrapper}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'view' && styles.tabButtonActive]}
              onPress={() => setActiveTab('view')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabButtonText, activeTab === 'view' && styles.tabButtonTextActive]}>View Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'create' && styles.tabButtonActive]}
              onPress={() => setActiveTab('create')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabButtonText, activeTab === 'create' && styles.tabButtonTextActive]}>Mark Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA / FILTER FORM CARD */}
          <View style={styles.filterCard}>
            <View style={styles.filterCardHeader}>
              <View style={styles.headerIconBadge}>
                <MaterialIcons name="tune" size={18} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.filterCardTitle}>Search Criteria</Text>
                <Text style={styles.filterCardSubtitle}>Filter records by Class, Section & Date</Text>
              </View>
            </View>

            <View style={styles.formRow}>
              {/* Class Dropdown */}
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Class *</Text>
                <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('class')} activeOpacity={0.75}>
                  <View style={styles.fieldLeftIconBox}>
                    <MaterialIcons name="school" size={18} color="#2563EB" />
                  </View>
                  <Text style={styles.dropdownValueText}>{selectedClass || 'Select'}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* Section Dropdown */}
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Section *</Text>
                <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('section')} activeOpacity={0.75}>
                  <View style={styles.fieldLeftIconBox}>
                    <MaterialIcons name="grid-view" size={18} color="#2563EB" />
                  </View>
                  <Text style={styles.dropdownValueText}>{selectedSection || 'Select'}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Input Box */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date *</Text>
              <View style={styles.dateInputWrapper}>
                <View style={styles.fieldLeftIconBox}>
                  <MaterialIcons name="event" size={18} color="#2563EB" />
                </View>
                <TextInput
                  style={styles.dateInputText}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  placeholder="mm/dd/yyyy"
                  placeholderTextColor="#64748B"
                />
                <TouchableOpacity activeOpacity={0.7} style={styles.fieldRightAction}>
                  <MaterialIcons name="calendar-today" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Apply Filter Action Button */}
            <TouchableOpacity 
              style={styles.filterBtn} 
              onPress={handleApplyFilter}
              activeOpacity={0.8}
            >
              <MaterialIcons name="search" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.filterBtnText}>Filter Records</Text>
            </TouchableOpacity>
          </View>

          {/* BULK ATTENDANCE TOOL (Only visible in Mark Attendance mode) */}
          {activeTab === 'create' && (
            <View style={styles.filterCard}>
              <View style={styles.filterCardHeader}>
                <MaterialIcons name="bolt" size={20} color="#D97706" />
                <Text style={styles.filterCardTitle}>Bulk Attendance Status</Text>
              </View>

              <View style={styles.formRow}>
                {/* Bulk status selection dropdown */}
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('bulkStatus')} activeOpacity={0.75}>
                    <Text style={styles.dropdownValueText}>{bulkStatus}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Apply to all button */}
                <TouchableOpacity 
                  style={styles.applyAllBtn}
                  onPress={handleApplyBulkStatus}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyAllBtnText}>Apply to All</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ATTENDANCE SECTION HEADER */}
          <View style={styles.recordsHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="format-list-bulleted" size={18} color="#0F172A" />
              <Text style={styles.recordsSectionTitle}>
                {activeTab === 'view' ? 'Attendance Records' : 'Student Attendance'}
              </Text>
            </View>
          </View>

          {/* Search bar input */}
          <View style={styles.searchWrapper}>
            <MaterialIcons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student name or status..."
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <MaterialIcons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>

          {/* Records list container */}
          {loading ? (
            <View style={styles.recordsList}>
              {renderSkeletonCard(1)}
              {renderSkeletonCard(2)}
              {renderSkeletonCard(3)}
            </View>
          ) : filteredRecords.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="people-outline" size={44} color="#2563EB" />
              </View>
              <Text style={styles.emptyTitle}>No Data Available</Text>
              <Text style={styles.emptyDesc}>No student records found for {selectedClass} - Section {selectedSection}. Please select a different class or filter.</Text>
            </View>
          ) : (
            <View style={styles.recordsList}>
              {filteredRecords.map((item) => {
                const s = getStatusColor(item.status);
                return (
                  <View key={item.id} style={styles.studentCard}>
                    {/* Left Accent indicator line */}
                    <View style={[styles.cardAccentBar, { backgroundColor: s.text }]} />

                    {/* Left block information */}
                    <View style={styles.studentDetailsRow}>
                      <View style={[styles.avatarCircle, { backgroundColor: s.bg }]}>
                        <Text style={[styles.avatarText, { color: s.text }]}>{getInitials(item.name)}</Text>
                      </View>
                      <View style={styles.studentInfoCol}>
                        <Text style={styles.studentName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.studentFather} numberOfLines={1}>Father: {item.father}</Text>
                        
                        <View style={styles.metaBadgeRow}>
                          <View style={styles.classBadge}>
                            <Text style={styles.classBadgeText}>{item.grade}-{item.section}</Text>
                          </View>
                          <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Right block interaction */}
                    {activeTab === 'create' ? (
                      <View style={styles.markOptionsContainer}>
                        {(['Present', 'Absent', 'Late'] as const).map((statusVal) => {
                          const isSelected = item.status === statusVal;
                          const labelChar = statusVal === 'Present' ? 'P' : statusVal === 'Absent' ? 'A' : 'L';
                          const optionStyle = getStatusColor(statusVal);

                          return (
                            <TouchableOpacity
                              key={statusVal}
                              style={[
                                styles.markOptionBtn,
                                { 
                                  borderColor: isSelected ? optionStyle.activeBg : optionStyle.border, 
                                  backgroundColor: isSelected ? optionStyle.activeBg : optionStyle.bg 
                                }
                              ]}
                              onPress={() => handleToggleStatus(item.id, statusVal)}
                              activeOpacity={0.7}
                            >
                              <Text style={[
                                styles.markOptionText, 
                                { color: isSelected ? '#FFFFFF' : optionStyle.text },
                              ]}>
                                {labelChar}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <View style={[styles.statusBadge, { backgroundColor: s.bg, borderColor: s.border }]}>
                        <Text style={[styles.statusText, { color: s.text }]}>{item.status}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* Submit Attendance bottom floating action button */}
          {activeTab === 'create' && filteredRecords.length > 0 && (
            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleSaveAttendance}
              activeOpacity={0.8}
            >
              <MaterialIcons name="check" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Submit Attendance Batch</Text>
            </TouchableOpacity>
          )}

        </ScrollView>

        {/* Modal Dropdown Picker */}
        <ViewportModal
          visible={activePicker !== null}
          onClose={() => setActivePicker(null)}
        >
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeaderRow}>
              <View style={styles.pickerHeaderIconBox}>
                <MaterialIcons 
                  name={activePicker === 'class' ? 'school' : activePicker === 'section' ? 'grid-view' : 'bolt'} 
                  size={20} 
                  color="#2563EB" 
                />
              </View>
              <Text style={styles.pickerTitle}>
                Select {activePicker === 'class' ? 'Class' : activePicker === 'section' ? 'Section' : 'Status'}
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)} style={styles.modalCloseBtn} activeOpacity={0.7}>
                <MaterialIcons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            {activePicker === 'class' && (
              <View style={styles.pickerOptionsList}>
                {['GRADE-II', 'Grade-I', 'Grade-III'].map((c) => {
                  const isSelected = selectedClass === c;
                  return (
                    <TouchableOpacity 
                      key={c} 
                      style={[
                        styles.pickerOptionItem,
                        isSelected && styles.pickerOptionActive
                      ]}
                      onPress={() => {
                        setSelectedClass(c);
                        setActivePicker(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextActive]}>{c}</Text>
                      {isSelected ? (
                        <MaterialIcons name="check-circle" size={20} color="#2563EB" />
                      ) : (
                        <MaterialIcons name="radio-button-unchecked" size={20} color="#94A3B8" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {activePicker === 'section' && (
              <View style={styles.pickerOptionsList}>
                {/* Select All Option */}
                <TouchableOpacity 
                  style={[
                    styles.pickerOptionItem,
                    { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' }
                  ]}
                  onPress={() => {
                    const sections = ['A', 'B', 'C'];
                    const currentList = selectedSection ? selectedSection.split(',').map(s => s.trim()).filter(Boolean) : [];
                    if (currentList.length === sections.length) {
                      setSelectedSection('A');
                    } else {
                      setSelectedSection(sections.join(', '));
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pickerOptionText, { fontWeight: '800', color: '#2563EB' }]}>
                    {selectedSection && selectedSection.split(',').map(s => s.trim()).filter(Boolean).length === 3 ? '✓ Deselect All' : '✦ All Sections'}
                  </Text>
                </TouchableOpacity>

                {['A', 'B', 'C'].map((s) => {
                  const currentList = selectedSection ? selectedSection.split(',').map(item => item.trim()).filter(Boolean) : [];
                  const isSelected = currentList.includes(s);
                  return (
                    <TouchableOpacity 
                      key={s} 
                      style={[
                        styles.pickerOptionItem,
                        isSelected && styles.pickerOptionActive
                      ]}
                      onPress={() => {
                        let updated: string[];
                        if (isSelected) {
                          updated = currentList.filter(item => item !== s);
                        } else {
                          updated = [...currentList, s];
                        }
                        setSelectedSection(updated.join(', ') || 'A');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextActive]}>Section {s}</Text>
                      <MaterialIcons 
                        name={isSelected ? "check-box" : "check-box-outline-blank"} 
                        size={20} 
                        color={isSelected ? "#2563EB" : "#94A3B8"} 
                      />
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  style={{
                    backgroundColor: '#2563EB',
                    paddingVertical: 10,
                    alignItems: 'center',
                    marginTop: 6,
                    borderRadius: 8
                  }}
                  onPress={() => setActivePicker(null)}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {activePicker === 'bulkStatus' && (
              <View style={styles.pickerOptionsList}>
                {(['Present', 'Absent', 'Late'] as const).map((st) => {
                  const isSelected = bulkStatus === st;
                  return (
                    <TouchableOpacity 
                      key={st} 
                      style={[
                        styles.pickerOptionItem,
                        isSelected && styles.pickerOptionActive
                      ]}
                      onPress={() => {
                        setBulkStatus(st);
                        setActivePicker(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextActive]}>{st}</Text>
                      {isSelected ? (
                        <MaterialIcons name="check-circle" size={20} color="#2563EB" />
                      ) : (
                        <MaterialIcons name="radio-button-unchecked" size={20} color="#94A3B8" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </ViewportModal>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 720,
  },

  // App Bar
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
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  appBarIconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Green Success Alert Banner
  alertBanner: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
    backgroundColor: '#10B981',
  },
  alertBannerText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  // Tab Switcher
  tabsWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    zIndex: 9,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  tabButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  // Scroll Container
  scrollContent: {
    padding: 12,
    paddingBottom: 90,
    gap: 12,
  },

  // Filters Card
  filterCard: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  headerIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCardTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  filterCardSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  fieldLeftIconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  fieldRightAction: {
    padding: 2,
  },
  dropdownValueText: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dateInputText: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  filterBtn: {
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    backgroundColor: '#2563EB',
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  // Bulk operation apply button
  applyAllBtn: {
    flex: 1.2,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
  },
  applyAllBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },

  // Section Header Row
  recordsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 2,
  },
  recordsSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },

  // Search input
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '600',
  },

  // Roster Cards List
  recordsList: {
    gap: 10,
  },
  studentCard: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  studentDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13.5,
    fontWeight: '900',
  },
  studentInfoCol: {
    flex: 1,
    gap: 2,
    paddingLeft: 2,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  studentFather: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  classBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  dateText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12.5,
    fontWeight: '800',
  },

  // Interactive Checklist MARK mode styles
  markOptionsContainer: {
    flexDirection: 'row',
    gap: 6,
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
    fontSize: 13.5,
    fontWeight: '900',
  },

  // Submit bottom button
  submitBtn: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    flexDirection: 'row',
    backgroundColor: '#10B981',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '900',
  },

  // Modal overlays for web & mobile
  webModalOverlay: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Picker modal
  pickerContainer: {
    width: '88%',
    maxWidth: 380,
    borderRadius: 16,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  pickerHeaderIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  modalCloseBtn: {
    padding: 6,
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
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pickerOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  pickerOptionTextActive: {
    color: '#1D4ED8',
    fontWeight: '900',
  },

  // Skeleton structure
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  skeletonLineShort: {
    width: '35%',
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  skeletonLineMedium: {
    width: '65%',
    height: 14,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  skeletonBadge: {
    width: 70,
    height: 28,
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
  },

  emptyContainer: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    fontWeight: '600',
    maxWidth: 280,
  },
});
