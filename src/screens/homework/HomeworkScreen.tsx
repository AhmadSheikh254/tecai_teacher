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
  useWindowDimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <View style={styles.cardHeader}>
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
                <Text style={[styles.cardTitle, { fontSize: 16.5, marginTop: 8 }]}>{viewingHomework.title}</Text>

                {/* Teacher & Date info */}
                <View style={[styles.creatorRow, { marginTop: 8 }]}>
                  <View style={styles.creatorInfo}>
                    <MaterialIcons name="person" size={14} color="#64748b" />
                    <Text style={styles.creatorText}>{viewingHomework.teacher} • {viewingHomework.createdAt}</Text>
                  </View>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: viewingHomework.status === 'Graded' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 179, 0, 0.1)', 
                    borderColor: viewingHomework.status === 'Graded' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 179, 0, 0.2)' 
                  }]}>
                    <Text style={[styles.statusText, { 
                      color: viewingHomework.status === 'Graded' ? '#4CAF50' : '#FFB300' 
                    }]}>{viewingHomework.status}</Text>
                  </View>
                </View>

                {/* Full Instructions Note */}
                <View style={{ marginVertical: 12 }}>
                  <Text style={[styles.formLabel, { marginBottom: 6 }]}>Instructions / Notes</Text>
                  <Text style={[styles.noteText, { fontSize: 13.5, color: '#334155', fontWeight: '500', lineHeight: 20 }]}>{viewingHomework.note}</Text>
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
                ) : (
                  <View style={[styles.placeholderImage, { height: 60 }]}>
                    <Text style={styles.placeholderImageText}>No image attached</Text>
                  </View>
                )}

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
                <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            {/* Form Header */}
            <View style={[styles.formHeader, { paddingTop: 36 }]}>
              <Text style={styles.formHeaderTitle}>Daily Homework</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)} style={styles.formCloseBtn}>
                <MaterialIcons name="close" size={24} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formScrollContent} showsVerticalScrollIndicator={false}>
              
              {/* Class Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Class <Text style={{ color: theme.colors.error }}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.formDropdown}
                  onPress={() => setActivePicker('class')}
                >
                  <Text style={[styles.formDropdownText, formClass === '' && styles.formPlaceholderText]}>
                    {formClass || '--Select--'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              {/* Section Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Section <Text style={{ color: theme.colors.error }}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.formDropdown}
                  onPress={() => setActivePicker('section')}
                >
                  <Text style={[styles.formDropdownText, formSection === '' && styles.formPlaceholderText]}>
                    {formSection || 'Nothing selected'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              {/* Course/Subject Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Course <Text style={{ color: theme.colors.error }}>*</Text>
                </Text>
                <TouchableOpacity 
                  style={styles.formDropdown}
                  onPress={() => setActivePicker('subject')}
                >
                  <Text style={[styles.formDropdownText, formSubject === '' && styles.formPlaceholderText]}>
                    {formSubject || '--Select--'}
                  </Text>
                  <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              {/* Date Input Selector */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Date <Text style={{ color: theme.colors.error }}>*</Text>
                </Text>
                <View style={styles.formInputWrapper}>
                  <TextInput
                    style={styles.formInputText}
                    value={formDate}
                    onChangeText={setFormDate}
                    placeholder="mm/dd/yyyy"
                    placeholderTextColor={theme.colors.outline}
                  />
                  <MaterialIcons name="calendar-today" size={18} color={theme.colors.onSurfaceVariant} />
                </View>
              </View>

              {/* Attach Image (Book Page Photo....) File Select */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Attach Image (Book Page Photo....)</Text>
                <View style={styles.filePickerWrapper}>
                  <TouchableOpacity style={styles.filePickerBtn} onPress={handlePickMockImage} activeOpacity={0.8}>
                    <Text style={styles.filePickerBtnText}>Choose File</Text>
                  </TouchableOpacity>
                  <Text style={styles.filePickerText} numberOfLines={1}>
                    {formImage ? 'BookPhoto_Attachment.jpg' : 'No file chosen'}
                  </Text>
                  {formImage && (
                    <TouchableOpacity onPress={() => setFormImage(null)} style={{ marginLeft: 8 }}>
                      <MaterialIcons name="cancel" size={18} color={theme.colors.error} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Optional: Homework Title field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Homework Title (Optional)</Text>
                <View style={styles.formInputWrapper}>
                  <TextInput
                    style={styles.formInputText}
                    value={formTitle}
                    onChangeText={setFormTitle}
                    placeholder="e.g. Reading Practice"
                    placeholderTextColor={theme.colors.outline}
                  />
                </View>
              </View>

              {/* Homework Note multiline textarea */}
              <View style={styles.formGroup}>
                <View style={styles.formNoteHeader}>
                  <Text style={styles.formLabel}>
                    Homework Note <Text style={{ color: theme.colors.error }}>*</Text>
                  </Text>
                  <Text style={styles.formCharCounter}>{formNote.length}/2000 characters</Text>
                </View>
                <TextInput
                  style={styles.formTextArea}
                  multiline={true}
                  numberOfLines={5}
                  value={formNote}
                  onChangeText={formText => setFormNote(formText.substring(0, 2000))}
                  placeholder="eg. Learn table 2-5. Complete page 34 in the workbook."
                  placeholderTextColor={theme.colors.outline}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Modal Bottom Actions Row */}
            <View style={styles.formActionsRow}>
              <TouchableOpacity 
                style={[styles.formSubmitBtn, theme.shadows.level1]}
                onPress={handleAddHomework}
                activeOpacity={0.8}
              >
                <MaterialIcons name="send" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.formSubmitText}>Post Homework</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.formCancelBtn}
                onPress={() => setCreateModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.formCancelText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* BOTTOM OPTION PICKER MODAL (For Class, Section, and Course) */}
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
                Select {activePicker === 'class' ? 'Class' : activePicker === 'section' ? 'Section' : 'Course'}
              </Text>
              
              {activePicker === 'class' && (
                <View style={styles.pickerOptionsList}>
                  {['GRADE-II', 'Grade-I', 'Grade-III'].map((c) => (
                    <TouchableOpacity 
                      key={c} 
                      style={styles.pickerOptionItem}
                      onPress={() => {
                        setFormClass(c);
                        setActivePicker(null);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{c}</Text>
                      {formClass === c && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
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
                        setFormSection(s);
                        setActivePicker(null);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>Section {s}</Text>
                      {formSection === s && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {activePicker === 'subject' && (
                <View style={styles.pickerOptionsList}>
                  {['English', 'Mathematics', 'Science', 'Social Studies'].map((sub) => (
                    <TouchableOpacity 
                      key={sub} 
                      style={styles.pickerOptionItem}
                      onPress={() => {
                        setFormSubject(sub);
                        setActivePicker(null);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{sub}</Text>
                      {formSubject === sub && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { alignSelf: 'center', width: '100%', maxWidth: 500 }]} edges={['top']}>
      {/* ── High-Fidelity Ambient Background Glow Particles ── */}
      <View style={styles.bgGlow1} pointerEvents="none" />
      <View style={styles.bgGlow2} pointerEvents="none" />
      <View style={styles.bgGlow3} pointerEvents="none" />

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
        {/* Unified Premium Control Center Deck */}
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
                  <Text style={[
                    styles.filterBarOptionText,
                    isSelected ? styles.filterBarOptionTextActive : null
                  ]}>
                    {filter === 'Custom Date' && customSelectedDate 
                      ? `${customSelectedDate.split('-')[0]} Aug` 
                      : filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Search Bar (contrasted light-grey background inside card) */}
          <View style={styles.searchWrapper}>
            <MaterialIcons name="search" size={20} color="#0052cc" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search note, class, subject..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={18} color="#64748b" />
              </TouchableOpacity>
            ) : (
              <View style={styles.searchShortcutBadge}>
                <Text style={styles.searchShortcutText}>⌘K</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.topActionsRow}>
            <TouchableOpacity style={[styles.topActionBtn, styles.exportBtn]} activeOpacity={0.8}>
              <MaterialIcons name="file-download" size={18} color="#0052cc" />
              <Text style={styles.exportBtnText}>Export</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.topActionBtn, styles.createBtn]} 
              activeOpacity={0.8}
              onPress={() => setCreateModalVisible(true)}
            >
              <MaterialIcons name="add" size={18} color="#fff" />
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
                  {/* Visual 3D stacked paper layers underneath */}
                  <View style={styles.cardUnderlay} />

                  {/* Active Diary Sheet Page */}
                  <View style={[styles.card, { shadowColor: subjectColor }]}>


                    {/* Faint blue ruled lines across the notebook page */}
                    <View style={styles.notebookRuleLinesContainer} pointerEvents="none">
                      {Array.from({ length: 12 }).map((_, lineIdx) => (
                        <View key={lineIdx} style={styles.notebookRuleLine} />
                      ))}
                    </View>

                    {/* Premium Notebook Spiral Bind along the left edge */}
                    <View style={styles.spiralBinder}>
                      {Array.from({ length: 8 }).map((_, rIdx) => (
                        <View key={rIdx} style={styles.spiralRingContainer}>
                          {/* C-shaped metallic coil looping over the edge */}
                          <View style={styles.spiralLoop} />
                          {/* Punched rectangular hole on the page */}
                          <View style={styles.spiralHole} />
                        </View>
                      ))}
                    </View>

                    <View style={styles.cardHeader}>
                      {/* Date Badge */}
                      <View style={styles.dateBadge}>
                        <Text style={styles.dateDayText}>{homework.day}</Text>
                        <Text style={styles.dateMonthText}>{homework.month}</Text>
                      </View>

                      {/* Metadata */}
                      <View style={styles.metaColumn}>
                        <View style={styles.badgeRow}>
                          <View style={styles.classBadge}>
                            <Text style={styles.classBadgeText}>{homework.grade}</Text>
                          </View>
                          <View style={styles.sectionBadge}>
                            <Text style={styles.sectionBadgeText}>Sec {homework.section}</Text>
                          </View>
                          <View style={styles.subjectBadge}>
                            <Text style={styles.subjectBadgeText}>{homework.subject}</Text>
                          </View>
                        </View>
                        <Text style={styles.cardTitle}>{homework.title}</Text>
                      </View>
                    </View>

                    {/* Status Block */}
                    <View style={styles.creatorRow}>
                      <View style={styles.creatorInfo}>
                        <MaterialIcons name="person" size={14} color="#64748b" />
                        <Text style={styles.creatorText}>{homework.teacher} • {homework.createdAt}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{homework.status}</Text>
                      </View>
                    </View>

                    {/* Homework Note */}
                    <View style={styles.noteContainer}>
                      <Text style={styles.noteText}>{displayNote}</Text>
                      {shouldTruncate && (
                        <TouchableOpacity onPress={() => toggleExpandNote(homework.id)} style={styles.readMoreBtn}>
                          <Text style={styles.readMoreText}>{isExpanded ? 'Read Less' : 'Read More'}</Text>
                          <MaterialIcons 
                            name={isExpanded ? 'expand-less' : 'expand-more'} 
                            size={16} 
                            color="#0052cc" 
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* Image attachment wrapper */}
                    {homework.image ? (
                      <TouchableOpacity 
                        onPress={() => setPreviewImage(homework.image)} 
                        activeOpacity={0.9}
                        style={styles.imageWrapper}
                      >
                        <Image 
                          source={typeof homework.image === 'string' ? { uri: homework.image } : homework.image} 
                          style={styles.homeworkImg} 
                        />
                        <View style={styles.imageOverlay}>
                          <MaterialIcons name="zoom-out-map" size={18} color="#fff" />
                          <Text style={styles.imageOverlayText}>Tap to preview</Text>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.placeholderImage}>
                        <MaterialIcons name="image" size={32} color="#94a3b8" />
                        <Text style={styles.placeholderImageText}>No Attachment Available</Text>
                      </View>
                    )}

                    {/* Actions */}
                    <View style={styles.cardFooterActions}>
                      <TouchableOpacity style={[styles.actionBtn, styles.viewBtn]} activeOpacity={0.7} onPress={() => handleViewPress(homework)}>
                        <MaterialIcons name="visibility" size={18} color="#083ca6" />
                        <Text style={styles.viewBtnText}>View</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.editBtn]} activeOpacity={0.7} onPress={() => handleEditPress(homework)}>
                        <MaterialIcons name="edit" size={18} color="#334155" />
                        <Text style={styles.editBtnText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} activeOpacity={0.7} onPress={() => handleDeletePress(homework.id)}>
                        <MaterialIcons name="delete" size={18} color="#dc2626" />
                        <Text style={styles.deleteBtnText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
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
  bgGlow3: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(245, 158, 11, 0.03)',
    zIndex: 1,
  },
  // ===== PREMIUM APP BAR =====
  appBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 82, 204, 0.06)',
    zIndex: 10,
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appBarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
  },
  appBarIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.08)',
    marginLeft: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#0052cc',
    shadowColor: '#0052cc',
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
    fontSize: 10.5,
    letterSpacing: 0.5,
  },
  appBarTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.4,
    lineHeight: 17,
  },
  appBarSubtitle: {
    fontSize: 9.5,
    color: '#64748b',
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
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
    marginLeft: 8,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
  },
  
  // Unified Premium Control Center Deck
  controlDeck: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5, // Stronger structural border
    borderColor: 'rgba(0, 82, 204, 0.08)',
    // Extra heavy, deep shadow for 3D page elevation
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 6,
  },
  
  // Segmented Date Filter Control Bar
  filterBar: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    padding: 3,
    height: 36,
    marginBottom: 10,
  },
  filterBarOption: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  filterBarOptionActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  filterBarOptionText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569',
  },
  filterBarOptionTextActive: {
    color: '#0d1b3e',
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
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    height: 36,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0d1b3e',
    fontSize: 12,
    fontWeight: '900',
  },
  searchShortcutBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  searchShortcutText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 0.2,
  },

  // Actions row (Export & Create)
  topActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  topActionBtn: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  exportBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.2,
    borderColor: '#0052cc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  exportBtnText: {
    color: '#0052cc',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  createBtn: {
    backgroundColor: '#0C3090',
    shadowColor: '#0C3090',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  createBtnText: {
    color: '#fff',
    fontSize: 12,
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
  cardUnderlay: {
    position: 'absolute',
    left: 4,
    right: -4,
    top: 4,
    bottom: -4,
    backgroundColor: '#D1FAE5', // Light emerald mint representing secondary stacked page
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 1.2,
    borderColor: 'rgba(16, 185, 129, 0.18)',
    zIndex: 1,
  },
  card: {
    backgroundColor: '#ECFDF5', // Super soft premium light emerald page background
    borderTopLeftRadius: 8, // Book/spiral binder inner edge curves are tighter
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 28, // Book outer edges are round and smooth
    borderBottomRightRadius: 28,
    padding: 16,
    paddingLeft: 34, // Room for spiral coils
    borderWidth: 1.2,
    borderColor: 'rgba(16, 185, 129, 0.14)', // Soft emerald outline instead of generic border
    shadowColor: '#10B981', // Emerald ambient glow shadow projection
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
  },
  notebookMarginLine: {
    position: 'absolute',
    left: 48,
    top: 0,
    bottom: 0,
    width: 1.2,
    backgroundColor: 'rgba(244, 63, 94, 0.25)', // Pink notebook margin ruler line
    zIndex: 3,
  },
  notebookRuleLinesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 20,
    zIndex: 1,
  },
  notebookRuleLine: {
    height: 1,
    backgroundColor: 'rgba(0, 82, 204, 0.025)', // Faint notebook horizontal grid rule lines
  },
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
    height: 14,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  spiralHole: {
    width: 4,
    height: 10,
    borderRadius: 1.5,
    backgroundColor: '#94a3b8', // Saturated punch hole grey
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  spiralLoop: {
    position: 'absolute',
    left: 0,
    width: 17, // Larger loop width
    height: 13, // Larger loop height
    borderRadius: 6,
    borderLeftWidth: 3.2, // Bolder coil stroke
    borderTopWidth: 3.2, // Bolder coil stroke
    borderBottomWidth: 3.2, // Bolder coil stroke
    borderRightWidth: 0,
    borderColor: '#1e293b', // Premium dark charcoal steel coil color
    backgroundColor: 'transparent',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  dateBadge: {
    width: 44,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.08)',
  },
  dateDayText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0052cc',
  },
  dateMonthText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0052cc',
    letterSpacing: 0.5,
  },
  metaColumn: {
    flex: 1,
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
  },
  classBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0052cc',
  },
  sectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    backgroundColor: 'rgba(71, 85, 105, 0.06)',
  },
  sectionBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#475569',
  },
  subjectBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.06)',
  },
  subjectBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#10B981',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0d1b3e',
    lineHeight: 16,
    marginTop: 2,
  },
  creatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 82, 204, 0.04)',
    paddingBottom: 8,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creatorText: {
    fontSize: 10.2,
    color: '#475569',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  noteContainer: {
    marginVertical: 12,
  },
  noteText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 17,
    fontWeight: '600',
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 6,
  },
  readMoreText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0052cc',
  },
  imageWrapper: {
    height: 190, // Increased image height for premium presentation
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.05)',
  },
  homeworkImg: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15,23,42,0.6)',
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  imageOverlayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  placeholderImage: {
    height: 72,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 82, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 12,
  },
  placeholderImageText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  cardFooterActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 38, // Elevated height for easy clickability
    borderRadius: 12, // Softer curves matching card corners
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    // Soft shadow elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  viewBtn: {
    backgroundColor: 'rgba(8, 60, 166, 0.06)', // Translucent premium sapphire blue
    borderColor: 'rgba(8, 60, 166, 0.18)',
  },
  viewBtnText: {
    color: '#083ca6',
    fontSize: 12.5, // Larger and bolder text size
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  editBtn: {
    backgroundColor: 'rgba(51, 65, 85, 0.06)', // Translucent premium slate charcoal
    borderColor: 'rgba(51, 65, 85, 0.18)',
  },
  editBtnText: {
    color: '#334155',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  deleteBtn: {
    backgroundColor: 'rgba(220, 38, 38, 0.06)', // Translucent premium crimson red
    borderColor: 'rgba(220, 38, 38, 0.18)',
  },
  deleteBtnText: {
    color: '#dc2626',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.3,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0d1b3e',
  },
  formNoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formCharCounter: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 82, 204, 0.06)',
  },
  formDropdownText: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  formPlaceholderText: {
    color: '#64748b',
  },
  formInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 82, 204, 0.06)',
  },
  formInputText: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '600',
  },
  formTextArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 82, 204, 0.06)',
    padding: 12,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
    minHeight: 90,
  },
  
  // Custom File Picker layout (matching desktop design style)
  filePickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 82, 204, 0.06)',
  },
  filePickerBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.12)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  filePickerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0052cc',
  },
  filePickerText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },

  formActionsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  formActionBtn: {
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  formCancelBtn: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  formCancelText: {
    color: '#ef4444',
    fontSize: 12.5,
    fontWeight: '800',
  },
  formSubmitBtn: {
    backgroundColor: '#0C3090',
    borderRadius: 8,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSubmitText: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: '800',
  },

  // Picker backdrop list
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0d1b3e',
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 82, 204, 0.05)',
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
    fontWeight: '700',
    color: '#0f172a',
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
