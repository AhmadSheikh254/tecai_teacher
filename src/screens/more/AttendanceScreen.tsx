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
        return { bg: 'rgba(16, 185, 129, 0.08)', text: '#10B981', border: 'rgba(16, 185, 129, 0.2)' };
      case 'Absent':
        return { bg: 'rgba(239, 68, 68, 0.08)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.2)' };
      case 'Late':
      default:
        return { bg: 'rgba(245, 158, 11, 0.08)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.2)' };
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
      {/* ── PREMIUM LIGHT BG GRADIENT ── */}
      <LinearGradient
        colors={['#BFD7FF', '#D2E3FF', '#E4EFFF', '#F4F8FF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Background glowing ambient orbs */}
      <View style={styles.orb1} pointerEvents="none" />
      <View style={styles.orb2} pointerEvents="none" />
      <View style={styles.orb3} pointerEvents="none" />

      {/* Decorative curves */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Ellipse cx="115%" cy="5%" rx="65%" ry="28%" fill="rgba(255,255,255,0.4)" />
        <Ellipse cx="-15%" cy="95%" rx="60%" ry="25%" fill="rgba(255,255,255,0.35)" />
        <Path d="M-40,260 Q160,140 380,280 T820,240" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} />
        <Path d="M-40,320 Q160,200 380,340 T820,300" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* App Bar */}
        <View style={styles.appBar}>
          <LinearGradient
            colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.70)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Attendance Portal</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="how-to-reg" size={24} color="#1D4ED8" />
          </TouchableOpacity>
        </View>

        {/* Success Alert Banner */}
        {successToastVisible && (
          <View style={styles.alertBanner}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <MaterialIcons name="check-circle" size={22} color="#FFFFFF" />
            <Text style={styles.alertBannerText}>Student Attendance Marked successfully.</Text>
          </View>
        )}

        {/* Tab Buttons (frosted capsule selector) */}
        <View style={styles.tabsWrapper}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'view' && styles.tabButtonActive]}
              onPress={() => setActiveTab('view')}
              activeOpacity={0.8}
            >
              {activeTab === 'view' && (
                <LinearGradient
                  colors={['#1D4ED8', '#1E40AF']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={[styles.tabButtonText, activeTab === 'view' && styles.tabButtonTextActive]}>View Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'create' && styles.tabButtonActive]}
              onPress={() => setActiveTab('create')}
              activeOpacity={0.8}
            >
              {activeTab === 'create' && (
                <LinearGradient
                  colors={['#1D4ED8', '#1E40AF']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={[styles.tabButtonText, activeTab === 'create' && styles.tabButtonTextActive]}>Mark Attendance</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* SEARCH CRITERIA / FILTER FORM CARD */}
          <View style={styles.filterCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.96)', 'rgba(248,250,252,0.88)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Top Accent Strip */}
            <View style={styles.cardHeaderAccentStrip} />

            <View style={styles.filterCardHeader}>
              <View style={styles.headerIconBadge}>
                <LinearGradient
                  colors={['#2563EB', '#1D4ED8']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <MaterialIcons name="tune" size={18} color="#FFFFFF" />
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
                  <MaterialIcons name="keyboard-arrow-down" size={22} color="#475569" />
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
                  <MaterialIcons name="keyboard-arrow-down" size={22} color="#475569" />
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
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity activeOpacity={0.7} style={styles.fieldRightAction}>
                  <MaterialIcons name="calendar-today" size={18} color="#475569" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Apply Filter Action Button */}
            <TouchableOpacity 
              style={styles.filterBtn} 
              onPress={handleApplyFilter}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2563EB', '#1E40AF']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)']}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <MaterialIcons name="search" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.filterBtnText}>Filter Records</Text>
            </TouchableOpacity>
          </View>

          {/* BULK ATTENDANCE TOOL (Only visible in Mark Attendance mode) */}
          {activeTab === 'create' && (
            <View style={styles.filterCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.80)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.filterCardHeader}>
                <MaterialIcons name="bolt" size={20} color="#D97706" />
                <Text style={styles.filterCardTitle}>Bulk Attendance Status</Text>
              </View>

              <View style={styles.formRow}>
                {/* Bulk status selection dropdown */}
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('bulkStatus')} activeOpacity={0.75}>
                    <Text style={styles.dropdownValueText}>{bulkStatus}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={22} color="#475569" />
                  </TouchableOpacity>
                </View>

                {/* Apply to all button */}
                <TouchableOpacity 
                  style={styles.applyAllBtn}
                  onPress={handleApplyBulkStatus}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={styles.applyAllBtnText}>Apply to All</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ATTENDANCE SECTION HEADER */}
          <View style={styles.recordsHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MaterialIcons name="format-list-bulleted" size={20} color="#0F172A" />
              <Text style={styles.recordsSectionTitle}>
                {activeTab === 'view' ? 'Attendance Records' : 'Student Attendance'}
              </Text>
            </View>
            {filteredRecords.length > 0 && activeTab === 'view' && (
              <View style={styles.exportBadgeRow}>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Copied to clipboard')}>
                  <Text style={styles.exportText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Exported to CSV')}>
                  <Text style={styles.exportText}>CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Exported to Excel')}>
                  <Text style={styles.exportText}>Excel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Exported to PDF')}>
                  <Text style={styles.exportText}>PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Search bar input (glass design) */}
          <View style={styles.searchWrapper}>
            <LinearGradient
              colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.75)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <MaterialIcons name="search" size={22} color="#475569" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student name or status..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                <MaterialIcons name="close" size={20} color="#475569" />
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
              <LinearGradient
                colors={['rgba(255,255,255,0.90)', 'rgba(255,255,255,0.75)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.emptyIconCircle}>
                <MaterialIcons name="people-outline" size={48} color="#2563EB" />
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
                    {/* Glass background */}
                    <LinearGradient
                      colors={['rgba(255,255,255,0.92)', 'rgba(255,255,255,0.78)']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />

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

                    {/* Right block interaction: Status Pill (View Mode) or Tactile Selector Buttons (Mark Mode) */}
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
                                { borderColor: optionStyle.border, backgroundColor: optionStyle.bg },
                                isSelected && { backgroundColor: optionStyle.text, borderColor: optionStyle.text }
                              ]}
                              onPress={() => handleToggleStatus(item.id, statusVal)}
                              activeOpacity={0.7}
                            >
                              <Text style={[
                                styles.markOptionText, 
                                { color: optionStyle.text },
                                isSelected && { color: '#FFFFFF' }
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

          {/* Submit Attendance bottom floating action button (Only in creation mode) */}
          {activeTab === 'create' && filteredRecords.length > 0 && (
            <TouchableOpacity 
              style={styles.submitBtn} 
              onPress={handleSaveAttendance}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <MaterialIcons name="check" size={22} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.submitBtnText}>Submit Attendance Batch</Text>
            </TouchableOpacity>
          )}

        </ScrollView>

        {/* Modal Dropdown Picker */}
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
              <LinearGradient
                colors={['#FFFFFF', '#F1F5F9']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
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
                        {isSelected && <MaterialIcons name="check-circle" size={22} color="#2563EB" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {activePicker === 'section' && (
                <View style={styles.pickerOptionsList}>
                  {['A', 'B', 'C'].map((s) => {
                    const isSelected = selectedSection === s;
                    return (
                      <TouchableOpacity 
                        key={s} 
                        style={[
                          styles.pickerOptionItem,
                          isSelected && styles.pickerOptionActive
                        ]}
                        onPress={() => {
                          setSelectedSection(s);
                          setActivePicker(null);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextActive]}>Section {s}</Text>
                        {isSelected && <MaterialIcons name="check-circle" size={22} color="#2563EB" />}
                      </TouchableOpacity>
                    );
                  })}
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
                        {isSelected && <MaterialIcons name="check-circle" size={22} color="#2563EB" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(59,130,246,0.25)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -130,
    width: 380, height: 380, borderRadius: 190,
    backgroundColor: 'rgba(16,185,129,0.20)',
  },
  orb3: {
    position: 'absolute', top: '38%', right: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: 'rgba(139,92,246,0.20)',
  },

  // App Bar
  appBar: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
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
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  appBarIconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Green Success Alert Banner
  alertBanner: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 10,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  alertBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  // Tab Switcher
  tabsWrapper: {
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(255,255,255,0.45)',
    zIndex: 9,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 14,
  },
  tabButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.70)',
  },
  tabButtonActive: {
    borderColor: 'transparent',
    elevation: 6,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  tabButtonText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#334155',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  // Scroll Container
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
    gap: 18,
  },

  // Filters Card
  filterCard: {
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.90)',
    overflow: 'hidden',
    position: 'relative',
    gap: 16,
    elevation: 6,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  cardHeaderAccentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#2563EB',
  },
  filterCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(226, 232, 240, 0.9)',
    paddingBottom: 12,
  },
  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  filterCardTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  filterCardSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 14,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 0.3,
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(203, 213, 225, 0.9)',
    elevation: 2,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  fieldLeftIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  fieldRightAction: {
    padding: 4,
  },
  dropdownValueText: {
    flex: 1,
    fontSize: 15.5,
    color: '#0F172A',
    fontWeight: '900',
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(203, 213, 225, 0.9)',
    elevation: 2,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  dateInputText: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 15.5,
    fontWeight: '900',
  },
  filterBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  filterBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Bulk operation apply button
  applyAllBtn: {
    flex: 1.2,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  applyAllBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
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
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  exportBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  exportIconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  exportText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#1D4ED8',
  },

  // Search input
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '700',
  },

  // Roster Cards List
  recordsList: {
    gap: 14,
  },
  studentCard: {
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  studentDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
  },
  studentInfoCol: {
    flex: 1,
    gap: 5,
    paddingLeft: 2,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  studentFather: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '700',
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  classBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  classBadgeText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#334155',
  },
  dateText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 22,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '900',
  },

  // Interactive Checklist MARK mode styles
  markOptionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  markOptionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  markOptionText: {
    fontSize: 15,
    fontWeight: '900',
  },

  // Submit bottom button
  submitBtn: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    elevation: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Picker modal
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '85%',
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
    elevation: 12,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  pickerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(226,232,240,0.9)',
    paddingBottom: 12,
  },
  pickerHeaderIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerTitle: {
    fontSize: 17.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  pickerOptionsList: {
    gap: 8,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.9)',
  },
  pickerOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  pickerOptionText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#334155',
  },
  pickerOptionTextActive: {
    color: '#1D4ED8',
    fontWeight: '900',
  },

  // Skeleton structure
  skeletonCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
  },
  skeletonAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#CBD5E1',
    marginRight: 14,
  },
  skeletonLineShort: {
    width: '35%',
    height: 12,
    backgroundColor: '#CBD5E1',
    borderRadius: 5,
  },
  skeletonLineMedium: {
    width: '65%',
    height: 16,
    backgroundColor: '#CBD5E1',
    borderRadius: 5,
  },
  skeletonBadge: {
    width: 78,
    height: 32,
    backgroundColor: '#CBD5E1',
    borderRadius: 16,
  },

  emptyContainer: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 21,
    fontWeight: '600',
    maxWidth: 280,
  },
});
