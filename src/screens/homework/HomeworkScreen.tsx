import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Modal,
  Animated,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PremiumDateTimePicker } from '../../components/PremiumDateTimePicker';

interface HomeworkScreenProps {
  navigation: any;
}

export const HomeworkScreen: React.FC<HomeworkScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'Today' | 'Yesterday' | 'Custom Date'>('Today');
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [customSelectedDate, setCustomSelectedDate] = useState<string>('04-08-26'); // Defaults to Aug 4
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  
  // Creation Form Modal States
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [successToastVisible, setSuccessToastVisible] = useState(false);
  
  // Fully Operational Actions States
  const [editingHomeworkId, setEditingHomeworkId] = useState<string | null>(null);
  const [viewingHomework, setViewingHomework] = useState<any | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({ '1': true });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Form Fields State matching desktop screenshot defaults exactly
  const [formClass, setFormClass] = useState(''); // Default: '--Select--'
  const [formSection, setFormSection] = useState(''); // Default: 'Nothing selected'
  const [formSubject, setFormSubject] = useState(''); // Default: '--Select--'
  const [formTitle, setFormTitle] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formDate, setFormDate] = useState(''); // Default: empty showing 'mm/dd/yyyy'
  const [formImage, setFormImage] = useState<string | null>(null);

  // Bottom picker sheet toggle
  const [activePicker, setActivePicker] = useState<'class' | 'section' | 'subject' | null>(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Pulse animation for Skeleton loaders
  const [pulseAnim] = useState(new Animated.Value(0.3));

  // Mutable Homeworks State List
  const [homeworks, setHomeworks] = useState([
    {
      id: '1',
      title: 'English Grammar Tables & Exercises',
      note: 'Learn tables 2-5. Complete page 34 in the workbook. Make sure to write down 5 sentences using action verbs in your notebooks.',
      subject: 'English',
      grade: 'GRADE-II',
      section: 'A',
      date: '06-08-26', // August 6, 2026 (Today)
      day: '06',
      month: 'AUG',
      createdAt: '6 Aug 2026 09:30 AM',
      teacher: 'Suman Iqbal',
      status: 'Pending',
      image: require('../../../assets/school_diary.jpg')
    },
    {
      id: '2',
      title: 'Mathematics Multiplication Practice',
      note: 'Solve exercises 1-10 on page 42. Draw a rectangle and calculate its area using the formula discussed in class today.',
      subject: 'Mathematics',
      grade: 'GRADE-II',
      section: 'A',
      date: '05-08-26', // August 5, 2026 (Yesterday)
      day: '05',
      month: 'AUG',
      createdAt: '5 Aug 2026 02:15 PM',
      teacher: 'Suman Iqbal',
      status: 'Graded',
      image: null
    },
    {
      id: '3',
      title: 'Science Planet Diagram Drawing',
      note: 'Draw and label the inner planets of the solar system. Use a sheet of white paper and label Mars, Earth, Venus, and Mercury clearly with colors.',
      subject: 'Science',
      grade: 'GRADE-II',
      section: 'A',
      date: '04-08-26', // Within This Week
      day: '04',
      month: 'AUG',
      createdAt: '4 Aug 2026 11:45 AM',
      teacher: 'Suman Iqbal',
      status: 'Graded',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmOCOjpQ-NAm4UCsle7VdbMwMRBRs8smooXJjsAe2QVaGY344cqyNMshfPerlGgZ16vMnYwhVK4O6u_bss7wJrMjlNrsVZL2L4r30kANf7PHcE00sHEnTWULiVGORRyYkNyoV6zwSyReb2CEHTKP3f1870DNX9zdIkOfmeMIbcpT4fitCW-pn781fJWUlv8EdUl3X0fNfr2gsRUERid1snLp-18OHrlycTaWHbk9iv8o0mYoHEhlrX6w'
    },
    {
      id: '4',
      title: 'Azadi Independence Day Speech Prep',
      note: 'Read the story of Independence Day. Prepare a short 2-minute speech on independence heroes. Submit a photo of your written speech.',
      subject: 'Social Studies',
      grade: 'GRADE-II',
      section: 'A',
      date: '31-07-26', // Custom/Older Date
      day: '31',
      month: 'JUL',
      createdAt: '31 Jul 2026 10:30 AM',
      teacher: 'Suman Iqbal',
      status: 'Graded',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP8Fes6Wf9DdkJS-k33oTvc53T3DDc43ixr_T8hwh_pr7sY__yCD2W_7u82_wSOmxr5bh8BWjPCpfyruGFXgrPxwBnxu3LTADJnrW1Pyal-Qu22X6blXtzKTJ1Qq9MSu3lKFCjAiSBqPq2uZCCOWWLFfJ_afO1UosCa0JnsAyjMZTLqPq-T2HkOCTCMpG_U0QCY9cje_vqA6rxLx33tk9UUSBSy0TQyKocGDGSGQPP-eLL9BRYsDjQTw'
    }
  ]);

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

  const handleFilterChange = (filter: 'Today' | 'Yesterday' | 'Custom Date') => {
    if (filter === 'Custom Date') {
      setCalendarModalVisible(true);
    } else {
      setLoading(true);
      setSelectedFilter(filter);
      setTimeout(() => {
        setLoading(false);
      }, 850);
    }
  };

  const handleAddHomework = () => {
    if (formClass === '' || formSection === '' || formSubject === '' || formDate === '' || formNote === '') {
      alert('Please fill out all required (*) fields.');
      return;
    }

    // Parse date (e.g. 08/06/2026 or 06-08-2026) to extract day and month abbreviation
    const delimiter = formDate.includes('/') ? '/' : '-';
    const dateParts = formDate.split(delimiter);
    // Assuming format is mm/dd/yyyy or dd-mm-yyyy, let's normalize
    const dayVal = dateParts[1] || '06';
    const monthNum = parseInt(dateParts[0] || '08', 10);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthVal = months[monthNum - 1] || 'AUG';

    // Set Title automatically based on subject and date or let it fall back
    const formattedTitle = formTitle.trim() !== '' ? formTitle : `${formSubject} Daily Homework`;

    if (editingHomeworkId) {
      // Edit mode: update existing item in list
      setHomeworks(homeworks.map(item => {
        if (item.id === editingHomeworkId) {
          return {
            ...item,
            title: formattedTitle,
            note: formNote,
            subject: formSubject,
            grade: formClass,
            section: formSection,
            day: dayVal,
            month: monthVal,
            image: formImage
          };
        }
        return item;
      }));
      setEditingHomeworkId(null);
    } else {
      // Create mode
      const newHomework = {
        id: Math.random().toString(),
        title: formattedTitle,
        note: formNote,
        subject: formSubject,
        grade: formClass,
        section: formSection,
        date: '06-08-26', // Normalize to list filter today format
        day: dayVal,
        month: monthVal,
        createdAt: 'Just now',
        teacher: 'Suman Iqbal',
        status: 'Pending',
        image: formImage
      };
      setHomeworks([newHomework, ...homeworks]);
    }

    setCreateModalVisible(false);

    // Reset Form fields
    setFormClass('');
    setFormSection('');
    setFormSubject('');
    setFormTitle('');
    setFormNote('');
    setFormDate('');
    setFormImage(null);

    // Trigger success toast
    setSuccessToastVisible(true);
    setTimeout(() => {
      setSuccessToastVisible(false);
    }, 2500);
  };

  // Mock photo selection trigger
  const handlePickMockImage = () => {
    if (formImage) {
      setFormImage(null);
    } else {
      setFormImage('https://lh3.googleusercontent.com/aida-public/AB6AXuBmOCOjpQ-NAm4UCsle7VdbMwMRBRs8smooXJjsAe2QVaGY344cqyNMshfPerlGgZ16vMnYwhVK4O6u_bss7wJrMjlNrsVZL2L4r30kANf7PHcE00sHEnTWULiVGORRyYkNyoV6zwSyReb2CEHTKP3f1870DNX9zdIkOfmeMIbcpT4fitCW-pn781fJWUlv8EdUl3X0fNfr2gsRUERid1snLp-18OHrlycTaWHbk9iv8o0mYoHEhlrX6w');
    }
  };

  // Functional Event Handlers
  const handleEditPress = (item: any) => {
    setFormClass(item.grade);
    setFormSection(item.section);
    setFormSubject(item.subject);
    setFormTitle(item.title);
    setFormNote(item.note);
    setFormDate(item.day + '/' + (item.month === 'AUG' ? '08' : '07') + '/2026');
    setFormImage(item.image);
    setEditingHomeworkId(item.id);
    setCreateModalVisible(true);
  };

  const handleDeletePress = (id: string) => {
    setHomeworks(homeworks.filter(item => item.id !== id));
  };

  const handleViewPress = (item: any) => {
    setViewingHomework(item);
    setViewModalVisible(true);
  };

  // Filter based on Search and Chip criteria
  const filteredHomework = homeworks.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(query) || 
      item.note.toLowerCase().includes(query) || 
      item.grade.toLowerCase().includes(query) || 
      item.subject.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (selectedFilter === 'Today') {
      return item.date === '06-08-26';
    }
    if (selectedFilter === 'Yesterday') {
      return item.date === '05-08-26';
    }
    if (selectedFilter === 'Custom Date') {
      return item.date === customSelectedDate;
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Graded':
        return { bg: 'rgba(76, 175, 80, 0.1)', text: '#4CAF50', border: 'rgba(76, 175, 80, 0.2)' };
      case 'Pending':
        return { bg: 'rgba(255, 179, 0, 0.1)', text: '#FFB300', border: 'rgba(255, 179, 0, 0.2)' };
      default:
        return { bg: 'rgba(108, 117, 125, 0.1)', text: '#6c757d', border: 'rgba(108, 117, 125, 0.2)' };
    }
  };

  const toggleExpandNote = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSkeletonCard = (index: number) => (
    <Animated.View key={`skeleton-${index}`} style={[styles.card, { opacity: pulseAnim }, theme.shadows.level1]}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.skeletonDateBadge} />
        <View style={{ flex: 1, gap: 6 }}>
          <View style={styles.skeletonLineShort} />
          <View style={styles.skeletonLineMedium} />
        </View>
      </View>
      <View style={styles.skeletonTextBlock} />
      <View style={styles.skeletonImagePlaceholder} />
      <View style={styles.skeletonFooterButtons} />
    </Animated.View>
  );


  // ── EARLY FULL-SCREEN RETURN: VIEW HOMEWORK DETAILS ──
  if (viewModalVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignSelf: 'center', width: '100%', maxWidth: 500 }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            {/* Header */}
            <View style={[styles.formHeader, { paddingTop: 36 }]}>
              <Text style={styles.formHeaderTitle}>Homework Details</Text>
              <TouchableOpacity onPress={() => setViewModalVisible(false)} style={styles.formCloseBtn}>
                <MaterialIcons name="close" size={20} color="#0052cc" />
              </TouchableOpacity>
            </View>

            {viewingHomework && (
              <ScrollView contentContainerStyle={styles.formScrollContent}>
                {/* Badges */}
                <View style={styles.badgeRow}>
                  <View style={styles.classBadge}>
                    <Text style={styles.classBadgeText}>{viewingHomework.grade}</Text>
                  </View>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>Sec {viewingHomework.section}</Text>
                  </View>
                  <View style={styles.subjectBadge}>
                    <Text style={styles.subjectBadgeText}>{viewingHomework.subject}</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={[styles.cardTitle, { fontSize: 18, marginTop: 8 }]}>{viewingHomework.title}</Text>

                {/* Teacher & Date info */}
                <View style={styles.creatorMetaRow}>
                  <View style={styles.creatorLeftInfo}>
                    <MaterialIcons name="person" size={15} color="#0066FF" />
                    <Text style={styles.creatorTeacherName}>{viewingHomework.teacher}</Text>
                    <Text style={styles.metaDot}>•</Text>
                    <MaterialIcons name="calendar-today" size={13} color="#64748B" />
                    <Text style={styles.creatorMetaDate}>{viewingHomework.createdAt}</Text>
                  </View>
                  <View style={[styles.statusPill, { 
                    backgroundColor: viewingHomework.status === 'Graded' ? '#D1FAE5' : '#FEF3C7'
                  }]}>
                    <MaterialIcons 
                      name={viewingHomework.status === 'Graded' ? "check-circle" : "access-time"} 
                      size={13} 
                      color={viewingHomework.status === 'Graded' ? "#059669" : "#D97706"} 
                    />
                    <Text style={[styles.statusPillText, { 
                      color: viewingHomework.status === 'Graded' ? '#059669' : '#D97706' 
                    }]}>{viewingHomework.status.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Full Instructions Note */}
                <View style={{ marginVertical: 14 }}>
                  <Text style={[styles.formLabel, { marginBottom: 6 }]}>Instructions / Notes</Text>
                  <View style={styles.noteBox}>
                    <View style={styles.noteTopRow}>
                      <View style={styles.noteIconCircle}>
                        <MaterialIcons name="description" size={15} color="#2563EB" />
                      </View>
                      <Text style={[styles.noteText, { fontSize: 13.5, color: '#334155', fontWeight: '500', lineHeight: 20 }]}>{viewingHomework.note}</Text>
                    </View>
                  </View>
                </View>

                {/* Image */}
                {viewingHomework.image ? (
                  <View>
                    <Text style={[styles.formLabel, { marginBottom: 8 }]}>Attached Photo</Text>
                    <View style={[styles.imageWrapper, { height: 220 }]}>
                      <Image 
                        source={typeof viewingHomework.image === 'string' ? { uri: viewingHomework.image } : viewingHomework.image} 
                        style={styles.homeworkImg} 
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                ) : null}

                {/* Footer Buttons */}
                <View style={[styles.formActionsRow, { marginTop: 16 }]}>
                  <TouchableOpacity 
                    style={[styles.formSubmitBtn, { flex: 1, height: 42 }]} 
                    onPress={() => {
                      setViewModalVisible(false);
                      handleEditPress(viewingHomework);
                    }}
                  >
                    <MaterialIcons name="edit" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.formSubmitText}>Edit Homework</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.formCancelBtn, { flex: 1, height: 42 }]} 
                    onPress={() => setViewModalVisible(false)}
                  >
                    <Text style={styles.formCancelText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: CREATE/POST HOMEWORK ──
  if (createModalVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignSelf: 'center', width: '100%', maxWidth: 500 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            {/* Gradient Header Bar */}
            <LinearGradient
              colors={['#003d9b', '#0052cc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createModalBand}
            >
              <View style={styles.createModalHeaderRow}>
                <View style={styles.createModalHeaderLeft}>
                  <View style={styles.createModalIconBox}>
                    <MaterialIcons name={editingHomeworkId ? "edit" : "menu-book"} size={18} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.createModalTitle} numberOfLines={1}>
                      {editingHomeworkId ? 'Edit Homework Assignment' : 'Post Daily Homework'}
                    </Text>
                    <Text style={styles.createModalSubtitle} numberOfLines={1}>
                      {editingHomeworkId ? 'Update details for this homework assignment' : 'Fill details for students and parents'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.createModalCloseBtn}
                  onPress={() => setCreateModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <MaterialIcons name="close" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView 
              contentContainerStyle={styles.formScrollContent} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Target Class Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Target Class <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={[styles.formDropdown, showClassDropdown && styles.formDropdownOpen]}
                  onPress={() => {
                    setShowClassDropdown(!showClassDropdown);
                    setShowSectionDropdown(false);
                    setShowSubjectDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[styles.formIconBadge, { backgroundColor: '#EEF2FF' }]}>
                      <MaterialIcons name="school" size={18} color="#2563EB" />
                    </View>
                    <Text style={[styles.formDropdownText, !formClass && styles.formPlaceholderText]}>
                      {formClass || 'Choose Class (e.g. GRADE-II)'}
                    </Text>
                  </View>
                  <MaterialIcons name={showClassDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={22} color="#64748B" />
                </TouchableOpacity>

                {showClassDropdown && (
                  <View style={styles.formDropdownOptions}>
                    {['GRADE-II', 'Grade-I', 'Grade-III'].map(c => {
                      const isSelected = formClass === c;
                      return (
                        <TouchableOpacity 
                          key={c} 
                          style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                          onPress={() => {
                            setFormClass(c);
                            setShowClassDropdown(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>{c}</Text>
                          {isSelected && <MaterialIcons name="check-circle" size={18} color="#2563EB" />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Section Multi-Select Dropdown */}
              <View style={styles.formGroup}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.formLabel}>
                    Section(s) <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  {formSection ? (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>
                        {formSection.split(',').filter(Boolean).length} Selected
                      </Text>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity 
                  style={[styles.formDropdown, showSectionDropdown && styles.formDropdownOpen]}
                  onPress={() => {
                    setShowSectionDropdown(!showSectionDropdown);
                    setShowClassDropdown(false);
                    setShowSubjectDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[styles.formIconBadge, { backgroundColor: '#F0FDF4' }]}>
                      <MaterialIcons name="layers" size={18} color="#059669" />
                    </View>
                    <Text style={[styles.formDropdownText, !formSection && styles.formPlaceholderText]} numberOfLines={1}>
                      {formSection ? (formSection.split(',').map(s => s.trim()).length === 3 ? 'All Sections (A, B, C)' : `Section ${formSection}`) : 'Select Section(s)'}
                    </Text>
                  </View>
                  <MaterialIcons name={showSectionDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={22} color="#64748B" />
                </TouchableOpacity>

                {showSectionDropdown && (
                  <View style={styles.formDropdownOptions}>
                    {/* Select All Option */}
                    <TouchableOpacity
                      style={[
                        styles.formDropdownItem,
                        { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' }
                      ]}
                      onPress={() => {
                        const sections = ['A', 'B', 'C'];
                        const currentList = formSection ? formSection.split(',').map(s => s.trim()).filter(Boolean) : [];
                        if (currentList.length === sections.length) {
                          setFormSection('');
                        } else {
                          setFormSection(sections.join(', '));
                        }
                      }}
                    >
                      <Text style={[styles.formDropdownItemText, { fontWeight: '800', color: '#059669' }]}>
                        {formSection && formSection.split(',').map(s => s.trim()).filter(Boolean).length === 3 ? '✕ Deselect All' : '✦ Select All Sections'}
                      </Text>
                    </TouchableOpacity>

                    {['A', 'B', 'C'].map(s => {
                      const currentList = formSection ? formSection.split(',').map(item => item.trim()).filter(Boolean) : [];
                      const isSelected = currentList.includes(s);
                      return (
                        <TouchableOpacity 
                          key={s} 
                          style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                          onPress={() => {
                            let updated: string[];
                            if (isSelected) {
                              updated = currentList.filter(item => item !== s);
                            } else {
                              updated = [...currentList, s];
                            }
                            setFormSection(updated.join(', '));
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>Section {s}</Text>
                          <MaterialIcons 
                            name={isSelected ? "check-box" : "check-box-outline-blank"} 
                            size={20} 
                            color={isSelected ? "#059669" : "#94A3B8"} 
                          />
                        </TouchableOpacity>
                      );
                    })}

                    <TouchableOpacity
                      style={styles.doneSelectingBtn}
                      onPress={() => setShowSectionDropdown(false)}
                    >
                      <Text style={styles.doneSelectingText}>Done Selecting</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Course/Subject Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Subject <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={[styles.formDropdown, showSubjectDropdown && styles.formDropdownOpen]}
                  onPress={() => {
                    setShowSubjectDropdown(!showSubjectDropdown);
                    setShowClassDropdown(false);
                    setShowSectionDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={[styles.formIconBadge, { backgroundColor: '#FAF5FF' }]}>
                      <MaterialIcons name="menu-book" size={18} color="#7C3AED" />
                    </View>
                    <Text style={[styles.formDropdownText, !formSubject && styles.formPlaceholderText]}>
                      {formSubject || 'Choose Subject (e.g. English)'}
                    </Text>
                  </View>
                  <MaterialIcons name={showSubjectDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={22} color="#64748B" />
                </TouchableOpacity>

                {showSubjectDropdown && (
                  <View style={styles.formDropdownOptions}>
                    {['English', 'Mathematics', 'Science', 'Social Studies'].map(sub => {
                      const isSelected = formSubject === sub;
                      return (
                        <TouchableOpacity 
                          key={sub} 
                          style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                          onPress={() => {
                            setFormSubject(sub);
                            setShowSubjectDropdown(false);
                          }}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>{sub}</Text>
                          {isSelected && <MaterialIcons name="check-circle" size={18} color="#7C3AED" />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Assignment Date Selector */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Assignment Date <Text style={{ color: '#EF4444' }}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.formInputWrapper}
                  onPress={() => setIsDatePickerVisible(true)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.formIconBadge, { backgroundColor: '#FEF3C7' }]}>
                    <MaterialIcons name="event" size={18} color="#D97706" />
                  </View>
                  <Text style={[styles.formDateDisplay, !formDate && styles.formPlaceholderText]}>
                    {formDate || 'Tap to select date (e.g. 06/08/2026)'}
                  </Text>
                  <View style={styles.calendarBadge}>
                    <MaterialIcons name="calendar-today" size={16} color="#D97706" />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Attach Image (Book Page Photo / Worksheet) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Attach Photo / Page (Optional)</Text>
                {formImage ? (
                  <View style={styles.imageAttachedCard}>
                    <View style={styles.imageAttachedLeft}>
                      <Image source={{ uri: formImage }} style={styles.imageThumbnail} />
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <View style={styles.attachedStatusRow}>
                          <MaterialIcons name="check-circle" size={14} color="#10B981" />
                          <Text style={styles.attachedStatusText}>Photo Attached</Text>
                        </View>
                        <Text style={styles.attachedFileName} numberOfLines={1}>
                          BookPage_Attachment.jpg
                        </Text>
                      </View>
                    </View>
                    <View style={styles.imageActionsRow}>
                      <TouchableOpacity 
                        style={styles.imageChangeBtn} 
                        onPress={handlePickMockImage}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="edit" size={14} color="#2563EB" />
                        <Text style={styles.imageChangeText}>Change</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.imageRemoveBtn} 
                        onPress={() => setFormImage(null)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="delete-outline" size={15} color="#EF4444" />
                        <Text style={styles.imageRemoveText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.uploadPhotoCard} 
                    onPress={handlePickMockImage}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.formIconBadge, { backgroundColor: '#FFE4E6', width: 36, height: 36, borderRadius: 10 }]}>
                      <MaterialIcons name="add-a-photo" size={18} color="#E11D48" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 6 }}>
                      <Text style={styles.uploadPhotoTitle}>Tap to attach photo (Book page, Diary, etc.)</Text>
                      <Text style={styles.uploadPhotoSubtitle}>Optional • Camera or Gallery</Text>
                    </View>
                    <MaterialIcons name="cloud-upload" size={20} color="#E11D48" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Homework Title (Optional) */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Homework Title (Optional)</Text>
                <View style={styles.formInputWrapper}>
                  <View style={[styles.formIconBadge, { backgroundColor: '#E0F2FE' }]}>
                    <MaterialIcons name="subtitles" size={18} color="#0284C7" />
                  </View>
                  <TextInput
                    style={styles.formInputText}
                    value={formTitle}
                    onChangeText={setFormTitle}
                    placeholder="e.g. Chapter 4 Multiplication Practice"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* Homework Instructions / Notes */}
              <View style={styles.formGroup}>
                <View style={styles.formNoteHeader}>
                  <Text style={styles.formLabel}>
                    Homework Instructions / Notes <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <Text style={styles.formCharCounter}>{formNote.length}/2000</Text>
                </View>
                <TextInput
                  style={styles.formTextArea}
                  multiline={true}
                  numberOfLines={5}
                  value={formNote}
                  onChangeText={formText => setFormNote(formText.substring(0, 2000))}
                  placeholder="Write clear homework instructions for students...&#10;e.g. Read pages 20-25 and solve exercise questions 1 to 5 in workbook."
                  placeholderTextColor="#94A3B8"
                  textAlignVertical="top"
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.formActionsRow}>
                <TouchableOpacity 
                  style={styles.formSubmitBtn}
                  onPress={handleAddHomework}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#0047CC', '#0052cc']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.formSubmitGrad}
                  >
                    <MaterialIcons name={editingHomeworkId ? "save" : "send"} size={17} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.formSubmitText}>
                      {editingHomeworkId ? 'Save Changes' : 'Post Homework'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.formCancelBtn}
                  onPress={() => setCreateModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.formCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>

        {/* Working Calendar Date Picker Modal for Homework (Date Only) */}
        <PremiumDateTimePicker
          visible={isDatePickerVisible}
          onClose={() => setIsDatePickerVisible(false)}
          value={formDate || '13 May 2026'}
          title="Select Assignment Date"
          showTime={false}
          onSelect={(newDate) => {
            setFormDate(newDate);
            setIsDatePickerVisible(false);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { alignSelf: 'center', width: '100%', maxWidth: 500 }]} edges={['top']}>
      {/* Premium AppBar */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <TouchableOpacity style={styles.appBarButton} activeOpacity={0.7} onPress={() => navigation.navigate('Home')}>
            <MaterialIcons name="arrow-back" size={20} color="#0052cc" />
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>AE</Text>
            </View>
            <View style={{ marginLeft: 2 }}>
              <Text style={styles.appBarTitle} numberOfLines={1}>Homework</Text>
              <Text style={styles.appBarSubtitle}>Daily Tasks</Text>
            </View>
          </View>
        </View>

        <View style={styles.appBarRight}>
          <TouchableOpacity style={styles.appBarIconBtn} activeOpacity={0.7}>
            <MaterialIcons name="search" size={19} color="#0052cc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.appBarIconBtn} activeOpacity={0.7}>
            <View style={styles.notificationWrapper}>
              <MaterialIcons name="notifications-none" size={20} color="#0052cc" />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
          <View style={styles.avatarBorderRing}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP8Fes6Wf9DdkJS-k33oTvc53T3DDc43ixr_T8hwh_pr7sY__yCD2W_7u82_wSOmxr5bh8BWjPCpfyruGFXgrPxwBnxu3LTADJnrW1Pyal-Qu22X6blXtzKTJ1Qq9MSu3lKFCjAiSBqPq2uZCCOWWLFfJ_afO1UosCa0JnsAyjMZTLqPq-T2HkOCTCMpG_U0QCY9cje_vqA6rxLx33tk9UUSBSy0TQyKocGDGSGQPP-eLL9BRYsDjQTw' }}
              style={styles.profileAvatar}
            />
          </View>
        </View>
      </View>

      {/* Success Toast */}
      {successToastVisible && (
        <View style={styles.toast}>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.toastText}>Homework posted successfully!</Text>
        </View>
      )}

      <ScrollView 
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Solid White High-Contrast Control Center Deck */}
        <View style={styles.controlDeck}>
          {/* Segmented Date Filter Bar */}
          <View style={styles.filterBar}>
            {(['Today', 'Yesterday', 'Custom Date'] as const).map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterBarOption,
                    isSelected ? styles.filterBarOptionActive : null
                  ]}
                  onPress={() => handleFilterChange(filter)}
                  activeOpacity={0.8}
                >
                  <View style={styles.filterBarOptionInner}>
                    {filter === 'Custom Date' ? (
                      <MaterialIcons 
                        name="calendar-month" 
                        size={20} 
                        color={isSelected ? '#0047CC' : '#475569'} 
                      />
                    ) : (
                      <Text style={[
                        styles.filterBarOptionText,
                        isSelected ? styles.filterBarOptionTextActive : null
                      ]}>
                        {filter}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* High-Contrast Search Bar */}
          <View style={styles.searchWrapper}>
            <MaterialIcons name="search" size={22} color="#0047CC" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search note, class, subject..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialIcons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.topActionsRow}>
            <TouchableOpacity style={[styles.topActionBtn, styles.exportBtn]} activeOpacity={0.8}>
              <MaterialIcons name="file-download" size={19} color="#0047CC" />
              <Text style={styles.exportBtnText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.topActionBtn, styles.createBtn]} 
              activeOpacity={0.8}
              onPress={() => setCreateModalVisible(true)}
            >
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.createBtnText}>Post Homework</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* List Content */}
        {loading ? (
          <View style={styles.listContainer}>
            {renderSkeletonCard(1)}
            {renderSkeletonCard(2)}
          </View>
        ) : filteredHomework.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="assignment-turned-in" size={56} color={theme.colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No Homework Found</Text>
            <Text style={styles.emptyDesc}>There are no homework assignments scheduled for the selected filters.</Text>
            <TouchableOpacity 
              style={styles.emptyPostButton} 
              activeOpacity={0.8}
              onPress={() => setCreateModalVisible(true)}
            >
              <Text style={styles.emptyPostButtonText}>Post Homework</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredHomework.map((homework) => {
              const statusStyle = getStatusColor(homework.status);
              const isExpanded = !!expandedNotes[homework.id];
              const shouldTruncate = homework.note.length > 90;
              const displayNote = (shouldTruncate && !isExpanded) 
                ? `${homework.note.substring(0, 90)}...` 
                : homework.note;
              const getSubjectColor = (sub: string) => {
                switch (sub) {
                  case 'English': return '#10B981';
                  case 'Mathematics': return '#7C3AED';
                  case 'Science': return '#0052cc';
                  default: return '#F59E0B';
                }
              };
              const subjectColor = getSubjectColor(homework.subject);

              return (
                <View key={homework.id} style={styles.cardContainer}>
                  {/* Clean White Diary Sheet Page */}
                  <View style={styles.card}>
                    {/* Premium Notebook Spiral Bind along the left edge */}
                    <View style={styles.spiralBinder} pointerEvents="none">
                      {Array.from({ length: 9 }).map((_, rIdx) => (
                        <View key={rIdx} style={styles.spiralRingContainer}>
                          {/* C-shaped metallic coil looping over the edge */}
                          <View style={styles.spiralLoop} />
                          {/* Punched round hole on the page */}
                          <View style={styles.spiralHole} />
                        </View>
                      ))}
                    </View>

                    {/* Top Row: Date Box + Badges & Title & Bookmark */}
                    <View style={styles.cardHeaderRow}>
                      {/* Date Badge Box */}
                      <View style={styles.dateBadgeBox}>
                        <Text style={styles.dateDayText}>{homework.day || '06'}</Text>
                        <Text style={styles.dateMonthText}>{homework.month || 'AUG'}</Text>
                        <Text style={styles.dateDayNameText}>
                          {homework.day === '06' ? 'WEDNESDAY' : homework.day === '05' ? 'TUESDAY' : homework.day === '04' ? 'MONDAY' : 'WEEKDAY'}
                        </Text>
                      </View>

                      {/* Header Right Content: Badges Row + Bookmark + Title */}
                      <View style={styles.headerRightCol}>
                        <View style={styles.badgeAndBookmarkRow}>
                          <View style={styles.badgeRow}>
                            <View style={styles.classBadge}>
                              <Text style={styles.classBadgeText}>{homework.grade}</Text>
                            </View>
                            <View style={styles.sectionBadge}>
                              <Text style={styles.sectionBadgeText}>Sec {homework.section}</Text>
                            </View>
                            <View style={[styles.subjectBadge, {
                              backgroundColor: homework.subject === 'English' ? '#F3E8FF' : homework.subject === 'Mathematics' ? '#EDE9FE' : homework.subject === 'Science' ? '#E0F2FE' : '#FEF3C7'
                            }]}>
                              <Text style={[styles.subjectBadgeText, {
                                color: homework.subject === 'English' ? '#7E22CE' : homework.subject === 'Mathematics' ? '#6D28D9' : homework.subject === 'Science' ? '#0369A1' : '#D97706'
                              }]}>{homework.subject}</Text>
                            </View>
                          </View>

                          {/* Bookmark Button */}
                          <TouchableOpacity 
                            style={styles.bookmarkBtn} 
                            onPress={() => toggleBookmark(homework.id)}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons 
                              name={bookmarkedIds[homework.id] ? "bookmark" : "bookmark-border"} 
                              size={18} 
                              color="#0066FF" 
                            />
                          </TouchableOpacity>
                        </View>

                        {/* Title */}
                        <Text style={styles.cardTitle} numberOfLines={2}>
                          {homework.title}
                        </Text>
                      </View>
                    </View>

                    {/* Metadata Row: Teacher • Date Time + Status Pill (Single Clean Row) */}
                    <View style={styles.creatorMetaRow}>
                      <View style={styles.creatorLeftInfo}>
                        <MaterialIcons name="person" size={13} color="#0066FF" />
                        <Text style={styles.creatorTeacherName} numberOfLines={1}>{homework.teacher}</Text>
                        <Text style={styles.metaDot}>•</Text>
                        <MaterialIcons name="calendar-today" size={12} color="#64748B" />
                        <Text style={styles.creatorMetaDate} numberOfLines={1}>
                          {homework.day || '6'} {homework.month ? (homework.month.charAt(0) + homework.month.slice(1).toLowerCase()) : 'Aug'}
                        </Text>
                        <MaterialIcons name="access-time" size={12} color="#64748B" />
                        <Text style={styles.creatorMetaTime} numberOfLines={1}>09:30 AM</Text>
                      </View>

                      {/* Status Pill */}
                      <View style={[styles.statusPill, {
                        backgroundColor: homework.status === 'Graded' ? '#D1FAE5' : '#FEF3C7'
                      }]}>
                        <MaterialIcons 
                          name={homework.status === 'Graded' ? "check-circle" : "access-time"} 
                          size={12} 
                          color={homework.status === 'Graded' ? "#059669" : "#D97706"} 
                        />
                        <Text style={[styles.statusPillText, {
                          color: homework.status === 'Graded' ? "#059669" : "#D97706"
                        }]}>
                          {homework.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    {/* Note Box */}
                    <View style={styles.noteBox}>
                      <View style={styles.noteTopRow}>
                        <View style={styles.noteIconCircle}>
                          <MaterialIcons name="description" size={16} color="#2563EB" />
                        </View>
                        <Text 
                          style={styles.noteText} 
                          numberOfLines={isExpanded ? undefined : 3}
                        >
                          {homework.note}
                        </Text>
                      </View>

                      {shouldTruncate && (
                        <TouchableOpacity onPress={() => toggleExpandNote(homework.id)} style={styles.readMoreBtn} activeOpacity={0.7}>
                          <Text style={styles.readMoreText}>{isExpanded ? 'Read Less' : 'Read More'}</Text>
                          <MaterialIcons 
                            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                            size={18} 
                            color="#0066FF" 
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Image Attachment (Tap to Preview) */}
                    {homework.image ? (
                      <TouchableOpacity 
                        onPress={() => setPreviewImage(homework.image)} 
                        activeOpacity={0.9}
                        style={styles.imageWrapper}
                      >
                        <Image 
                          source={typeof homework.image === 'string' ? { uri: homework.image } : homework.image} 
                          style={styles.homeworkImg} 
                          resizeMode="cover"
                        />
                        <View style={styles.tapToPreviewPill}>
                          <MaterialIcons name="aspect-ratio" size={15} color="#FFFFFF" />
                          <Text style={styles.tapToPreviewText}>Tap to preview</Text>
                        </View>
                      </TouchableOpacity>
                    ) : null}

                    {/* Action Buttons: View, Edit, Delete */}
                    <View style={styles.cardFooterActions}>
                      <TouchableOpacity style={styles.actionBtnView} activeOpacity={0.75} onPress={() => handleViewPress(homework)}>
                        <MaterialIcons name="visibility" size={18} color="#0066FF" />
                        <Text style={styles.actionBtnViewText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtnEdit} activeOpacity={0.75} onPress={() => handleEditPress(homework)}>
                        <MaterialIcons name="edit" size={16} color="#334155" />
                        <Text style={styles.actionBtnEditText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtnDelete} activeOpacity={0.75} onPress={() => handleDeletePress(homework.id)}>
                        <MaterialIcons name="delete" size={18} color="#DC2626" />
                        <Text style={styles.actionBtnDeleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Bottom Status Pill Badge */}
        {filteredHomework.length > 0 && (
          <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 28 }}>
            <View style={{
              backgroundColor: '#F8FAFC',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#475569' }}>
                All {filteredHomework.length} homework records loaded
              </Text>
            </View>
          </View>
        )}
      </ScrollView>



      {/* FULLSCREEN IMAGE MODAL */}
      <Modal
        visible={previewImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setPreviewImage(null)}>
            <MaterialIcons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          {previewImage && (
            <Image 
              source={typeof previewImage === 'string' ? { uri: previewImage } : previewImage} 
              style={styles.modalFullImage} 
              resizeMode="contain" 
            />
          )}
        </View>
      </Modal>

      {/* INTERACTIVE CALENDAR DATE PICKER MODAL */}
      <Modal
        visible={calendarModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.pickerBackdrop} 
          activeOpacity={1} 
          onPress={() => setCalendarModalVisible(false)}
        >
          <View style={styles.calendarCard} onStartShouldSetResponder={() => true}>
            {/* Header */}
            <View style={styles.calendarHeaderRow}>
              <View>
                <Text style={styles.calendarHeaderTitle}>Select Date</Text>
                <Text style={styles.calendarHeaderSub}>August 2026</Text>
              </View>
              <TouchableOpacity 
                style={styles.calendarCloseBtn} 
                onPress={() => setCalendarModalVisible(false)}
              >
                <MaterialIcons name="close" size={18} color="#0052cc" />
              </TouchableOpacity>
            </View>

            {/* Weekdays Row */}
            <View style={styles.weekdaysRow}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
                <Text key={idx} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
              {[
                null, null, null, null, null, null, // Saturday is August 1st in 2026
                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
              ].map((day, index) => {
                if (day === null) {
                  return <View key={`empty-${index}`} style={styles.dayCellEmpty} />;
                }
                const formattedDate = `${day < 10 ? '0' + day : day}-08-26`;
                const isSelected = customSelectedDate === formattedDate;
                
                // Highlight dates that actually have homework (e.g. 6th, 5th, 4th)
                const hasHomework = homeworks.some(item => item.date === formattedDate);

                return (
                  <TouchableOpacity
                    key={`day-${day}`}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                      hasHomework && !isSelected && styles.dayCellHasHomework
                    ]}
                    onPress={() => {
                      setLoading(true);
                      setCustomSelectedDate(formattedDate);
                      setSelectedFilter('Custom Date');
                      setCalendarModalVisible(false);
                      setTimeout(() => setLoading(false), 600);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      hasHomework && !isSelected && styles.dayTextHasHomework
                    ]}>
                      {day}
                    </Text>
                    {hasHomework && <View style={[styles.hasHomeworkDot, isSelected && styles.hasHomeworkDotSelected]} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* HOMEWORK VIEW DETAILS MODAL */}



































































































      {/* CREATE HOMEWORK SLIDE-UP MODAL */}








































































































































































































































      {/* Working Calendar Date Picker Modal for Filtering by Date */}
      <PremiumDateTimePicker
        visible={calendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        value={customSelectedDate ? `${customSelectedDate.split('-')[0]} Aug 2026` : '04 Aug 2026'}
        title="Filter by Date"
        showTime={false}
        onSelect={(newDate) => {
          const day = newDate.split(' ')[0] || '04';
          const formatted = `${day.padStart(2, '0')}-08-26`;
          setCustomSelectedDate(formatted);
          setSelectedFilter('Custom Date');
          setCalendarModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f9ff', // Light slate-blue premium canvas background
    position: 'relative',
  },
  // Ambient radial glows in canvas background
  bgGlow1: {
    position: 'absolute',
    top: 0,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
    zIndex: 1,
  },
  bgGlow2: {
    position: 'absolute',
    bottom: 120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
    zIndex: 1,
  },
  // ===== PREMIUM APP BAR =====
  appBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appBarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  appBarIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginLeft: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#0047CC',
    shadowColor: '#0047CC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  appBarTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    lineHeight: 18,
  },
  appBarSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 0.1,
    marginTop: -1,
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationWrapper: {
    position: 'relative',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6.5,
    height: 6.5,
    borderRadius: 3.25,
    backgroundColor: '#ef4444',
  },
  avatarBorderRing: {
    padding: 2,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginLeft: 8,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  
  // Solid Clean White Control Center Deck (Easy to understand for old teachers & children)
  controlDeck: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 10,
  },
  
  // High-Contrast Segmented Date Filter Bar
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    height: 44,
    marginBottom: 12,
  },
  filterBarOption: {
    flex: 1,
    height: 36,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBarOptionInner: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBarOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterBarOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 18,
  },
  filterBarOptionTextActive: {
    color: '#0047CC',
    fontWeight: '900',
  },

  // Main Scroll View
  scrollContent: {
    padding: 14,
    paddingBottom: 90,
    gap: 12,
    zIndex: 5,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 13.5,
    fontWeight: '700',
    ...Platform.select({ web: { outlineStyle: 'none' } as any }),
  },
  searchShortcutBadge: {
    display: 'none',
  },
  searchShortcutText: {
    display: 'none',
  },

  // Actions row (Export & Create)
  topActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  topActionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  exportBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0047CC',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  exportBtnText: {
    color: '#0047CC',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  createBtn: {
    backgroundColor: '#0047CC',
    shadowColor: '#0047CC',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  // Cards List Container
  listContainer: {
    gap: 16,
  },
  cardContainer: {
    position: 'relative',
    marginBottom: 8,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 14,
    paddingLeft: 34, // Sits tightly next to the compact spiral rings
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
  },

  // Spiral Binder on Left Edge (Slim & Compact)
  spiralBinder: {
    position: 'absolute',
    left: 0,
    top: 14,
    bottom: 14,
    width: 22,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  spiralRingContainer: {
    width: 22,
    height: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  spiralHole: {
    width: 6,
    height: 9,
    borderRadius: 3,
    backgroundColor: '#1E293B',
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: '#0F172A',
  },
  spiralLoop: {
    position: 'absolute',
    left: -2,
    width: 15,
    height: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderLeftWidth: 2.8,
    borderTopWidth: 2.8,
    borderBottomWidth: 2.8,
    borderRightWidth: 0,
    borderColor: '#94A3B8',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 1,
  },

  // Header Row
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateBadgeBox: {
    width: 58,
    height: 64,
    borderRadius: 15,
    backgroundColor: '#F0F6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dateDayText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0066FF',
    lineHeight: 25,
  },
  dateMonthText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0066FF',
    marginTop: 1,
    letterSpacing: 0.2,
  },
  dateDayNameText: {
    fontSize: 6.5,
    fontWeight: '700',
    color: '#0066FF',
    letterSpacing: 0.3,
    marginTop: 0.5,
  },
  headerRightCol: {
    flex: 1,
  },
  badgeAndBookmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    alignItems: 'center',
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 7,
    backgroundColor: '#E0EEFF',
  },
  classBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0066FF',
  },
  sectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 7,
    backgroundColor: '#F1F5F9',
  },
  sectionBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 7,
    backgroundColor: '#F3E8FF',
  },
  subjectBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#7E22CE',
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#F0F6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 21,
    marginTop: 6,
  },

  // Creator Meta Row (Single Non-Wrapping Row)
  creatorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 6,
  },
  creatorLeftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  creatorTeacherName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  metaDot: {
    fontSize: 10,
    color: '#94A3B8',
  },
  creatorMetaDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  creatorMetaTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  // Note Box
  noteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 11,
  },
  noteTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13.5, // Larger & more prominent
    color: '#0F172A', // Deep crisp color for maximum readability
    lineHeight: 20.5, // Comfortable reading line height
    fontWeight: '500', // Clean medium weight (not overly bold)
    letterSpacing: 0.1,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 8,
    marginLeft: 38,
  },
  readMoreText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0066FF',
    letterSpacing: 0.1,
  },

  // Image Wrapper & Floating Preview Pill
  imageWrapper: {
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  homeworkImg: {
    width: '100%',
    height: '100%',
  },
  tapToPreviewPill: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tapToPreviewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Action Buttons: View, Edit, Delete
  cardFooterActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  actionBtnView: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#EBF4FF',
    borderWidth: 1.2,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnViewText: {
    color: '#0066FF',
    fontSize: 13.5,
    fontWeight: '900',
  },
  actionBtnEdit: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnEditText: {
    color: '#334155',
    fontSize: 13.5,
    fontWeight: '900',
  },
  actionBtnDelete: {
    flex: 1,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    borderWidth: 1.2,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnDeleteText: {
    color: '#DC2626',
    fontSize: 13.5,
    fontWeight: '900',
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0052cc',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
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

  // Premium Empty State
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.05)',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0d1b3e',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyPostButton: {
    backgroundColor: '#0052cc',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyPostButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  // Modal Fullscreen Preview
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalFullImage: {
    width: '90%',
    height: '80%',
  },

  // Skeleton Loader Styles
  skeletonDateBadge: {
    width: 44,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  skeletonLineShort: {
    width: '40%',
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
  },
  skeletonLineMedium: {
    width: '80%',
    height: 16,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
  },
  skeletonTextBlock: {
    width: '100%',
    height: 36,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    marginTop: 12,
  },
  skeletonImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    marginTop: 12,
  },
  skeletonFooterButtons: {
    width: '100%',
    height: 34,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    marginTop: 12,
  },

  // Creation Form Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingBottom: 24,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 82, 204, 0.05)',
  },
  formHeaderTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0d1b3e',
  },
  formCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  formScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
    paddingBottom: 40,
  },
  formGroup: {
    gap: 7,
  },
  formIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  formLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.2,
  },
  selectedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  selectedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  formNoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formCharCounter: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  formDropdownOpen: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
  },
  formDropdownText: {
    fontSize: 13.5,
    color: '#1E293B',
    fontWeight: '600',
  },
  formPlaceholderText: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  formDropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  formDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formDropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  formDropdownItemText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  formDropdownItemTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  doneSelectingBtn: {
    backgroundColor: '#059669',
    margin: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneSelectingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  formInputText: {
    flex: 1,
    height: '100%',
    color: '#1E293B',
    fontSize: 13.5,
    fontWeight: '600',
  },
  formDateDisplay: {
    flex: 1,
    color: '#1E293B',
    fontSize: 13.5,
    fontWeight: '600',
  },
  calendarBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPhotoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  uploadPhotoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  uploadPhotoSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 2,
  },
  imageAttachedCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    gap: 10,
  },
  imageAttachedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  attachedStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attachedStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  attachedFileName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  imageActionsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
  },
  imageChangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
  },
  imageChangeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  imageRemoveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  imageRemoveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  formTextArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#1E293B',
    fontWeight: '500',
    minHeight: 110,
  },
  
  formActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 16,
  },
  formActionBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // CREATE FORM MODAL HEADER
  createModalBand: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  createModalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },
  createModalIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  createModalSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  createModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  formCancelBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  formCancelText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
  },
  formSubmitBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#0047CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  formSubmitGrad: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  formSubmitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  // Picker backdrop list
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '85%',
    maxWidth: 380,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#003d9b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.08)',
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0d1b3e',
    marginBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 82, 204, 0.08)',
    paddingBottom: 10,
    letterSpacing: -0.2,
  },
  pickerOptionsList: {
    gap: 6,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.04)',
  },
  pickerOptionItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: 'rgba(0, 82, 204, 0.25)',
  },
  pickerOptionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  pickerOptionTextActive: {
    color: '#0052cc',
    fontWeight: '800',
  },
  
  // Interactive Calendar Date Picker
  calendarCard: {
    width: 290,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.05)',
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 82, 204, 0.04)',
    paddingBottom: 8,
  },
  calendarHeaderTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0d1b3e',
  },
  calendarHeaderSub: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 1,
  },
  calendarCloseBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  weekdayText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },
  dayCell: {
    width: '14.28%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  dayCellEmpty: {
    width: '14.28%',
    height: 32,
  },
  dayCellSelected: {
    backgroundColor: '#0052cc',
  },
  dayCellHasHomework: {
    backgroundColor: 'rgba(0, 82, 204, 0.03)',
  },
  dayText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: '900',
  },
  dayTextHasHomework: {
    color: '#0052cc',
    fontWeight: '800',
  },
  hasHomeworkDot: {
    position: 'absolute',
    bottom: 3,
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#0052cc',
  },
  hasHomeworkDotSelected: {
    backgroundColor: '#fff',
  },
});
