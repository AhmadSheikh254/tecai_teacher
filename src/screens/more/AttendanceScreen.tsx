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

export const AttendanceScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Screen States
  const [loading, setLoading] = useState(false);
  const [isMarkMode, setIsMarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successToastVisible, setSuccessToastVisible] = useState(false);

  // Filter Form States (Desktop matches)
  const [selectedClass, setSelectedClass] = useState('GRADE-II');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState('06-08-2026'); // Pre-fill with today

  // Dropdown Picker state
  const [activePicker, setActivePicker] = useState<'class' | 'section' | null>(null);

  // Student Attendance Records List
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: '1', name: 'MUHAMMAD MUSTAFA', father: 'Tahir Mustafa', grade: 'GRADE-II', section: 'A', status: 'Present', date: '06-08-2026' },
    { id: '2', name: 'HIRA TAHIR', father: 'Tahir Iqbal', grade: 'GRADE-II', section: 'A', status: 'Present', date: '06-08-2026' },
    { id: '3', name: 'ANUSHA ALAUDDIN', father: 'Alauddin Khan', grade: 'GRADE-II', section: 'A', status: 'Present', date: '06-08-2026' },
    { id: '4', name: 'FARAH FATIMA', father: 'Syed Fatima', grade: 'GRADE-II', section: 'A', status: 'Present', date: '06-08-2026' },
    { id: '5', name: 'HAREEM NAZ', father: 'Naz Ahmed', grade: 'GRADE-II', section: 'A', status: 'Absent', date: '06-08-2026' },
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

  // Save attendance batch
  const handleSaveAttendance = () => {
    setIsMarkMode(false);
    setSuccessToastVisible(true);
    setTimeout(() => {
      setSuccessToastVisible(false);
    }, 2500);
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
        return { bg: 'rgba(76, 175, 80, 0.08)', text: '#4CAF50', border: 'rgba(76, 175, 80, 0.15)' };
      case 'Absent':
        return { bg: 'rgba(239, 68, 68, 0.08)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.15)' };
      case 'Late':
      default:
        return { bg: 'rgba(255, 179, 0, 0.08)', text: '#FFB300', border: 'rgba(255, 179, 0, 0.15)' };
    }
  };

  const renderSkeletonCard = (index: number) => (
    <Animated.View key={`skeleton-${index}`} style={[styles.skeletonCard, { opacity: pulseAnim }, theme.shadows.level1]}>
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isMarkMode ? 'Mark Attendance' : 'Attendance View'}</Text>
        </View>
        <TouchableOpacity style={styles.appBarIconButton}>
          <MaterialIcons name="how-to-reg" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Success Toast */}
      {successToastVisible && (
        <View style={styles.toast}>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.toastText}>Attendance records saved successfully!</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Attendance Filters Card */}
        {!isMarkMode && (
          <View style={[styles.filterCard, theme.shadows.level1]}>
            <View style={styles.filterCardHeader}>
              <MaterialIcons name="filter-list" size={20} color={theme.colors.primary} />
              <Text style={styles.filterCardTitle}>Search Criteria</Text>
            </View>

            <View style={styles.formRow}>
              {/* Class Dropdown */}
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Class *</Text>
                <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('class')}>
                  <Text style={styles.dropdownValueText}>{selectedClass || '--Select--'}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={18} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              {/* Section Dropdown */}
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>Section *</Text>
                <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('section')}>
                  <Text style={styles.dropdownValueText}>{selectedSection || 'Select Section'}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={18} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date *</Text>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={styles.dateInputText}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  placeholder="mm/dd/yyyy"
                  placeholderTextColor={theme.colors.outline}
                />
                <MaterialIcons name="calendar-today" size={18} color={theme.colors.onSurfaceVariant} />
              </View>
            </View>

            {/* Actions Buttons Row */}
            <View style={styles.filterActionsRow}>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.filterBtn]} 
                onPress={handleApplyFilter}
                activeOpacity={0.8}
              >
                <Text style={styles.filterBtnText}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionBtn, styles.markBtn]} 
                onPress={() => setIsMarkMode(true)}
                activeOpacity={0.8}
              >
                <MaterialIcons name="edit" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.markBtnText}>Mark Attendance</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Attendance Records Header */}
        <View style={styles.recordsHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialIcons name="format-list-bulleted" size={18} color={theme.colors.onSurface} />
            <Text style={styles.recordsSectionTitle}>Attendance Records</Text>
          </View>
          {filteredRecords.length > 0 && !isMarkMode && (
            <View style={styles.exportBadgeRow}>
              <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Copied to clipboard')}>
                <MaterialIcons name="content-copy" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Exported to Excel')}>
                <MaterialIcons name="grid-on" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Exported to PDF')}>
                <MaterialIcons name="picture-as-pdf" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Search Field */}
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student or status..."
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

        {/* Student Records List */}
        {loading ? (
          <View style={styles.recordsList}>
            {renderSkeletonCard(1)}
            {renderSkeletonCard(2)}
            {renderSkeletonCard(3)}
          </View>
        ) : filteredRecords.length === 0 ? (
          <View style={[styles.emptyContainer, theme.shadows.level1]}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="people-outline" size={48} color={theme.colors.outline} />
            </View>
            <Text style={styles.emptyTitle}>No Data Available</Text>
            <Text style={styles.emptyDesc}>No student records found for the selected Class/Section. Please adjust filters.</Text>
          </View>
        ) : (
          <View style={styles.recordsList}>
            {filteredRecords.map((item) => {
              const statusStyle = getStatusColor(item.status);
              return (
                <View key={item.id} style={[styles.studentCard, { borderLeftColor: statusStyle.text }, theme.shadows.level1]}>
                  {/* Left Column info with Avatar Initials */}
                  <View style={styles.studentDetailsRow}>
                    <View style={[styles.avatarCircle, { backgroundColor: statusStyle.bg }]}>
                      <Text style={[styles.avatarText, { color: statusStyle.text }]}>
                        {getInitials(item.name)}
                      </Text>
                    </View>
                    <View style={styles.studentInfoCol}>
                      <Text style={styles.studentName}>{item.name}</Text>
                      <Text style={styles.studentFather}>Father: {item.father}</Text>
                      <View style={styles.badgeRow}>
                        <View style={styles.classBadge}>
                          <Text style={styles.classBadgeText}>{item.grade}-{item.section}</Text>
                        </View>
                        <Text style={styles.dateText}>{item.date}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Column: Toggle/Display */}
                  {isMarkMode ? (
                    <View style={styles.markOptionsContainer}>
                      {(['Present', 'Absent', 'Late'] as const).map((statusVal) => {
                        const isSelected = item.status === statusVal;
                        const labelChar = statusVal === 'Present' ? 'P' : statusVal === 'Absent' ? 'A' : 'L';
                        const optionColor = statusVal === 'Present' ? '#4CAF50' : statusVal === 'Absent' ? '#EF4444' : '#FFB300';
                        const optionBg = statusVal === 'Present' ? 'rgba(76, 175, 80, 0.04)' : statusVal === 'Absent' ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255, 179, 0, 0.04)';
                        const optionBorder = statusVal === 'Present' ? 'rgba(76, 175, 80, 0.15)' : statusVal === 'Absent' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 179, 0, 0.15)';

                        return (
                          <TouchableOpacity
                            key={statusVal}
                            style={[
                              styles.markOptionBtn,
                              { borderColor: optionBorder, backgroundColor: optionBg },
                              isSelected && { backgroundColor: optionColor, borderColor: optionColor }
                            ]}
                            onPress={() => handleToggleStatus(item.id, statusVal)}
                          >
                            <Text style={[
                              styles.markOptionText, 
                              { color: optionColor },
                              isSelected && { color: '#fff' }
                            ]}>
                              {labelChar}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Mark mode footer actions */}
        {isMarkMode && (
          <View style={styles.markModeFooter}>
            <TouchableOpacity 
              style={[styles.markFooterBtn, styles.saveAttendanceBtn]}
              onPress={handleSaveAttendance}
            >
              <MaterialIcons name="check" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>Save Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.markFooterBtn, styles.cancelAttendanceBtn]}
              onPress={() => setIsMarkMode(false)}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* FILTER OPTION BOTTOM PICKER MODAL */}
      <Modal
        visible={activePicker !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity 
          style={styles.pickerBackdrop} 
          activeOpacity={1} 
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>
              Select {activePicker === 'class' ? 'Class' : 'Section'}
            </Text>
            
            {activePicker === 'class' && (
              <View style={styles.pickerOptionsList}>
                {['GRADE-II', 'Grade-I', 'Grade-III'].map((c) => (
                  <TouchableOpacity 
                    key={c} 
                    style={styles.pickerOptionItem}
                    onPress={() => {
                      setSelectedClass(c);
                      setActivePicker(null);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{c}</Text>
                    {selectedClass === c && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activePicker === 'section' && (
              <View style={styles.pickerOptionsList}>
                {['A', 'B', 'C'].map((s) => (
                  <TouchableOpacity 
                    key={s} 
                    style={styles.pickerOptionItem}
                    onPress={() => {
                      setSelectedSection(s);
                      setActivePicker(null);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>Section {s}</Text>
                    {selectedSection === s && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
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

  // Success Toast styling
  toast: {
    position: 'absolute',
    top: 20,
    left: '10%',
    right: '10%',
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 5,
    zIndex: 9999,
  },
  toastText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Main scroll content
  scrollContent: {
    padding: theme.spacing.containerMargin,
    paddingBottom: 120,
    gap: 16,
  },

  // Filters Card panel upgraded with left border accent
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
  formRow: {
    flexDirection: 'row',
    gap: 12,
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
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
  },
  dropdownValueText: {
    fontSize: 12,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.default,
    height: 42,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
  },
  dateInputText: {
    flex: 1,
    height: '100%',
    color: theme.colors.onSurface,
    fontSize: 13,
    fontWeight: '500',
  },
  filterActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  filterBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  filterBtnText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  markBtn: {
    backgroundColor: '#2e7d32',
  },
  markBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Records section header
  recordsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  recordsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  exportBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  exportIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
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

  // Student Card Records upgraded layout
  recordsList: {
    gap: 12,
  },
  studentCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.lg,
    paddingHorizontal: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: 'rgba(0, 82, 204, 0.05)',
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
    fontSize: 12,
    fontWeight: '800',
  },
  studentInfoCol: {
    flex: 1,
    gap: 2,
  },
  studentName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  studentFather: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  classBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.rounded.sm,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  classBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  dateText: {
    fontSize: 9,
    color: theme.colors.outline,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.rounded.full,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '800',
  },

  // Interactive Checklist MARK mode styles upgraded
  markOptionsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  markOptionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markOptionText: {
    fontSize: 11.5,
    fontWeight: '800',
  },

  // Mark mode footer
  markModeFooter: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 12,
  },
  markFooterBtn: {
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  saveAttendanceBtn: {
    flex: 1.5,
    backgroundColor: '#2e7d32',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelAttendanceBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  cancelBtnText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: '700',
  },

  // Empty state container
  emptyContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.xl,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.08)',
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 16,
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

  // Skeleton elements upgraded
  skeletonCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.05)',
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainer,
    marginRight: 12,
  },
  skeletonLineShort: {
    width: '35%',
    height: 10,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 4,
  },
  skeletonLineMedium: {
    width: '65%',
    height: 14,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 4,
  },
  skeletonBadge: {
    width: 64,
    height: 24,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 12,
  },
});
