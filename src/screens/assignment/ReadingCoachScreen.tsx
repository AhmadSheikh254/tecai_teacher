import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Line, G, Path } from 'react-native-svg';
import { PremiumDateTimePicker } from '../../components/PremiumDateTimePicker';

const { width } = Dimensions.get('window');

// Mock Student Reading Performance Results (matching official Desktop Reading Coach Result table)
const MOCK_RESULTS = [
  { sNo: '1', studentName: 'ANUSHA SAQIB', class: 'GRADE-II A', storyName: 'beauty of Nature', accuracy: '70%', readingTime: '12 sec' },
  { sNo: '2', studentName: 'ARIBA NAZ', class: 'GRADE-II A', storyName: 'beauty of Nature', accuracy: '60%', readingTime: '16 sec' },
  { sNo: '3', studentName: 'HIRA TAHIR', class: 'GRADE-II A', storyName: 'beauty of Nature', accuracy: '77%', readingTime: '19 sec' },
  { sNo: '4', studentName: 'HOORIA FATIMA', class: 'GRADE-II A', storyName: 'beauty of Nature', accuracy: '0%', readingTime: '27 sec' },
  { sNo: '5', studentName: 'MUHAMMAD MUSTAFA', class: 'GRADE-II A', storyName: 'beauty of Nature', accuracy: '80%', readingTime: '11 sec' },
  { sNo: '6', studentName: 'Muhammad Ibrahim', class: 'GRADE-II B', storyName: 'beauty of Nature', accuracy: '3%', readingTime: '18 sec' },
  { sNo: '7', studentName: 'Muhammad Sufiyan Khan', class: 'GRADE-II B', storyName: 'beauty of Nature', accuracy: '3%', readingTime: '27 sec' },
  { sNo: '8', studentName: 'SHAHMIKH', class: 'GRADE-II C', storyName: 'beauty of Nature', accuracy: '80%', readingTime: '16 sec' }
];
const INITIAL_PASSAGES = [
  {
    sNo: '1',
    id: 'RC-001',
    title: 'Neem Treess',
    class: 'GRADE-V A',
    course: 'Science',
    category: 'Science',
    difficulty: 'Intermediate',
    wordsCount: 220,
    targetWpm: 110,
    avgAccuracy: '95%',
    teacher: 'suman',
    startDateTime: '14 May 2026, 09:05 AM',
    deadline: '15 May 2026, 09:06 AM',
    previewText: 'This involves discussing the pros and cons of each idea. Then select the most effective option. Slide 6 Steps to Solve the Problem Step 5 The Problem is Solved',
    type: 'science'
  },
  {
    sNo: '2',
    id: 'RC-002',
    title: 'lion',
    class: 'GRADE-V A',
    course: 'English',
    category: 'Stories',
    difficulty: 'Beginner',
    wordsCount: 150,
    targetWpm: 90,
    avgAccuracy: '92%',
    teacher: 'suman',
    startDateTime: '22 Jul 2026, 10:18 AM',
    deadline: '23 Jul 2026, 10:19 AM',
    previewText: 'Nature and wildlife story featuring the king of the jungle...',
    type: 'stories'
  },
  {
    sNo: '3',
    id: 'RC-003',
    title: 'beauty of Nature',
    class: 'GRADE-II A',
    course: 'English',
    category: 'Stories',
    difficulty: 'Beginner',
    wordsCount: 190,
    targetWpm: 95,
    avgAccuracy: '98%',
    teacher: 'suman',
    startDateTime: '22 Jul 2026, 11:44 AM',
    deadline: '24 Jul 2026, 05:00 PM',
    previewText: 'Nature is a beautiful gift of God, filled with colorful flowers, green trees, and peaceful landscapes. The beauty of nature refreshes our minds and makes us feel happy and calm.',
    type: 'stories'
  },
  {
    sNo: '4',
    id: 'RC-004',
    title: 'Ancient Pyramids of Giza',
    class: 'GRADE-VI B',
    course: 'History',
    category: 'History',
    difficulty: 'Intermediate',
    wordsCount: 280,
    targetWpm: 105,
    avgAccuracy: '94%',
    teacher: 'suman',
    startDateTime: '01 Aug 2026, 08:30 AM',
    deadline: '05 Aug 2026, 04:00 PM',
    previewText: 'The Great Pyramids of Giza stand as iconic monuments of ancient Egyptian history, built thousands of years ago with incredible engineering precision and architectural mastery.',
    type: 'history'
  },
  {
    sNo: '5',
    id: 'RC-005',
    title: 'Artificial Intelligence & Quantum Chips',
    class: 'GRADE-VIII A',
    course: 'Computer Science',
    category: 'Tech',
    difficulty: 'Advanced',
    wordsCount: 310,
    targetWpm: 120,
    avgAccuracy: '96%',
    teacher: 'suman',
    startDateTime: '08 Aug 2026, 09:00 AM',
    deadline: '12 Aug 2026, 06:00 PM',
    previewText: 'Quantum computing and modern artificial intelligence neural networks process billions of operations per second, unlocking new frontiers in medicine, space science, and automated robotics.',
    type: 'tech'
  }
];

export const ReadingCoachScreen = ({ navigation }: any) => {
  const [passages, setPassages] = useState(INITIAL_PASSAGES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isCoachModalVisible, setIsCoachModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [selectedPassage, setSelectedPassage] = useState<any>(null);
  const [resultSearchQuery, setResultSearchQuery] = useState('');

  // Live Practice Session state
  const [isRecording, setIsRecording] = useState(false);
  const [practiceProgress, setPracticeProgress] = useState(0);

  // Form states matching official "Reading Coach — New Assignment" screen
  const [formTitle, setFormTitle] = useState('');
  const [formClass, setFormClass] = useState('GRADE-II A');
  const [formSection, setFormSection] = useState('Section A');
  const [formCourse, setFormCourse] = useState('English');
  const [formCategory, setFormCategory] = useState('Stories');
  const [formDifficulty, setFormDifficulty] = useState('Beginner');
  const [formWpm, setFormWpm] = useState('100');
  const [formStart, setFormStart] = useState('13 Aug 2026, 09:00 AM');
  const [formDeadline, setFormDeadline] = useState('20 Aug 2026, 05:00 PM');

  // Date picker states
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'deadline' | null>(null);
  const [datePickerValue, setDatePickerValue] = useState('');
  const [datePickerTitle, setDatePickerTitle] = useState('');
  const [formImageName, setFormImageName] = useState('No file chosen');
  const [formParagraphType, setFormParagraphType] = useState('AI Generated Paragraph');
  const [formAiTopic, setFormAiTopic] = useState('');
  const [formOwnText, setFormOwnText] = useState('');

  // Dropdowns for creation
  const categoriesList = ['Stories', 'Science', 'History', 'Tech'];
  const difficultyList = ['Beginner', 'Intermediate', 'Advanced'];
  const classesList = ['GRADE-II A', 'GRADE-V A', 'GRADE-IX A'];
  const sectionsList = ['Section A', 'Section B', 'Section C'];
  const coursesList = ['English', 'Science', 'Computer', 'Social Studies'];
  const paragraphTypesList = ['AI Generated Paragraph', 'Own Paragraph'];

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showParagraphTypeDropdown, setShowParagraphTypeDropdown] = useState(false);

  const categoriesFilter = ['All', 'Stories', 'Science', 'History', 'Tech'];

  // Render dynamic SVG audio waveform equalizer bars
  const renderVoiceWaves = (color = '#ffffff') => (
    <Svg width={42} height={16} viewBox="0 0 42 16">
      <Rect x="2" y="6" width="3" height="4" rx="1.5" fill={color} opacity={0.7} />
      <Rect x="7" y="3" width="3" height="10" rx="1.5" fill={color} opacity={0.9} />
      <Rect x="12" y="1" width="3" height="14" rx="1.5" fill={color} />
      <Rect x="17" y="5" width="3" height="6" rx="1.5" fill={color} opacity={0.75} />
      <Rect x="22" y="2" width="3" height="12" rx="1.5" fill={color} opacity={0.9} />
      <Rect x="27" y="4" width="3" height="8" rx="1.5" fill={color} opacity={0.8} />
      <Rect x="32" y="1" width="3" height="14" rx="1.5" fill={color} />
      <Rect x="37" y="5" width="3" height="6" rx="1.5" fill={color} opacity={0.65} />
    </Svg>
  );

  const getCategoryColor = (category: string) => {
    if (category === 'Stories') return '#0B8A7D';    // Teal
    if (category === 'Science') return '#3B4FD8';    // Indigo
    if (category === 'History') return '#B45309';    // Warm Amber
    if (category === 'Tech') return '#0284C7';       // Sky Blue
    return '#6D28D9';
  };

  const getDifficultyBg = (diff: string) => {
    if (diff === 'Beginner') return '#DCFCE7';
    if (diff === 'Intermediate') return '#FEF3C7';
    return '#FEE2E2';
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Beginner') return '#15803D';
    if (diff === 'Intermediate') return '#B45309';
    return '#B91C1C';
  };

  // Stats calculate
  const stats = useMemo(() => {
    const total = passages.length;
    const avgWpm = Math.round(passages.reduce((acc, p) => acc + p.targetWpm, 0) / total);
    const avgAcc = '95%';
    return { total, avgWpm, avgAcc };
  }, [passages]);

  // Filtered list
  const filteredPassages = useMemo(() => {
    return passages.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        item.title.toLowerCase().includes(query) ||
        item.course.toLowerCase().includes(query) ||
        item.class.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.previewText.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [passages, selectedCategory, searchQuery]);

  const handleStartPractice = (passage: any) => {
    setSelectedPassage(passage);
    setIsRecording(false);
    setPracticeProgress(0);
    setIsCoachModalVisible(true);
  };

  const handleViewResult = (passage: any) => {
    setSelectedPassage(passage);
    setResultSearchQuery('');
    setIsResultModalVisible(true);
  };

  const handlePickImage = () => {
    setFormImageName('story_illustration_cover.png');
    Alert.alert('File Attached', 'Story image attached successfully!');
  };

  const handleGenerateAiPassage = () => {
    const topic = formAiTopic.trim() || 'Space Exploration & Solar System';
    const generated = `Deep inside the vast galaxy, astronauts discovered glowing nebulae and ancient planetary rings. Learning about ${topic} opens dynamic frontiers for human curiosity and scientific innovation.`;
    setFormOwnText(generated);
    if (!formTitle.trim()) {
      setFormTitle(`The Legend of ${topic}`);
    }
    Alert.alert('AI Generated', 'AI passage text generated successfully!');
  };

  const handleCreatePassage = () => {
    const passageContent = formOwnText.trim();
    if (!passageContent) {
      Alert.alert('Required Info', 'Please enter or generate paragraph text for the reading assignment.');
      return;
    }
    const passageTitle = formTitle.trim() || 'Reading Coach Assignment';

    const newPassage = {
      sNo: Math.floor(1000 + Math.random() * 9000).toString(),
      id: `RC-${Math.floor(100 + Math.random() * 900)}`,
      title: passageTitle,
      class: `${formClass} (${formSection})`,
      course: formCourse,
      category: formCategory,
      difficulty: formDifficulty,
      wordsCount: passageContent.split(/\s+/).length,
      targetWpm: parseInt(formWpm, 10) || 100,
      avgAccuracy: '95%',
      teacher: 'suman',
      startDateTime: formStart,
      deadline: formDeadline,
      previewText: passageContent.length > 110 ? passageContent.substring(0, 110) + '...' : passageContent,
      type: formCategory.toLowerCase()
    };

    setPassages([newPassage, ...passages]);
    setIsCreateModalVisible(false);

    // Reset Form
    setFormTitle('');
    setFormOwnText('');
    setFormAiTopic('');
    setFormImageName('No file chosen');
    Alert.alert('Success', 'Reading Coach assignment published to class!');
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setPracticeProgress(45);
      setTimeout(() => setPracticeProgress(85), 1500);
    }
  };


  // ── EARLY FULL-SCREEN RETURN: AI COACH LIVE PRACTICE ──
  if (isCoachModalVisible && selectedPassage) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignSelf: 'center', width: '100%', maxWidth: 500 }} edges={['top', 'bottom']}>
                <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
            {selectedPassage && (() => {
              const accent = getCategoryColor(selectedPassage.category);
              return (
                <>
                  <LinearGradient
                    colors={[accent, accent + 'BB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.detailBand, { borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingTop: 36 }]}
                  >
                    <View style={styles.detailBandRow}>
                      <View style={styles.detailBandLeft}>
                        <View style={styles.typePillBand}>
                          <Text style={[styles.typePillBandText, { color: accent }]}>LIVE AI COACH</Text>
                        </View>
                        <Text style={styles.detailBandTitle}>{selectedPassage.title}</Text>
                        <Text style={styles.detailBandSub}>{selectedPassage.class}  •  Target: {selectedPassage.targetWpm} WPM</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.detailCloseBtn}
                        onPress={() => setIsCoachModalVisible(false)}
                      >
                        <MaterialIcons name="close" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>

                    {/* Passage text to read */}
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionLabel}>📖  Read Aloud into Microphone</Text>
                      <Text style={styles.passageFullText}>
                        "{selectedPassage.previewText} Continued practice improves vocal clarity, pace, and natural expression across all reading formats."
                      </Text>
                    </View>

                    {/* Speech Feedback Box */}
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionLabel}>🎙  Real-Time Voice Analysis</Text>
                      <View style={styles.practiceProgressBox}>
                        <View style={styles.progressTextRow}>
                          <Text style={styles.progressLabel}>Fluency Accuracy</Text>
                          <Text style={[styles.progressVal, { color: accent }]}>{isRecording ? '96%' : 'Ready'}</Text>
                        </View>
                        <View style={styles.progressBarTrack}>
                          <View style={[styles.progressBarFill, { width: `${isRecording ? 88 : 0}%`, backgroundColor: accent }]} />
                        </View>
                      </View>

                      <View style={styles.practiceStatsGrid}>
                        <View style={styles.practiceStatBox}>
                          <Text style={styles.practiceStatNum}>{isRecording ? '118' : '--'}</Text>
                          <Text style={styles.practiceStatLabel}>WPM Speed</Text>
                        </View>
                        <View style={styles.practiceStatBox}>
                          <Text style={[styles.practiceStatNum, { color: '#059669' }]}>{isRecording ? '98%' : '--'}</Text>
                          <Text style={styles.practiceStatLabel}>Pronunciation</Text>
                        </View>
                        <View style={styles.practiceStatBox}>
                          <Text style={[styles.practiceStatNum, { color: '#3B4FD8' }]}>{isRecording ? '92%' : '--'}</Text>
                          <Text style={styles.practiceStatLabel}>Expression</Text>
                        </View>
                      </View>
                    </View>

                    {/* Record Mic Controls */}
                    <View style={styles.micControlBox}>
                      <TouchableOpacity
                        style={[styles.micButton, isRecording && styles.micButtonRecording]}
                        onPress={toggleRecording}
                        activeOpacity={0.85}
                      >
                        <MaterialIcons name={isRecording ? "stop" : "mic"} size={28} color="#fff" />
                      </TouchableOpacity>
                      <Text style={styles.micStatusText}>
                        {isRecording ? 'Listening... Read paragraph aloud' : 'Tap Mic to Start Reading Session'}
                      </Text>
                    </View>

                    <View style={{ height: 20 }} />
                  </ScrollView>
                </>
              );
            })()}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: CREATE READING PASSAGE ──
  if (isCreateModalVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignSelf: 'center', width: '100%', maxWidth: 500 }} edges={['top', 'bottom']}>
                <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: "#ffffff" }}
        >
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>

            {/* Gradient Header: Reading Coach — New Assignment */}
            <LinearGradient
              colors={['#003d9b', '#0052cc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.createModalBand, { borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingTop: 36 }]}
            >
              <View style={styles.createModalHeaderRow}>
                <View style={styles.createModalHeaderLeft}>
                  <View style={styles.createModalIconBox}>
                    <MaterialIcons name="auto-stories" size={20} color="#ffffff" />
                  </View>
                  <View>
                    <Text style={styles.createModalTitle}>Reading Coach — New Assignment</Text>
                    <Text style={styles.createModalSubtitle}>Configure target class, section & paragraph type</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.createModalCloseBtn}
                  onPress={() => setIsCreateModalVisible(false)}
                >
                  <MaterialIcons name="close" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>

              <View style={styles.formContainer}>

                {/* Academic Target: Class & Section */}
                <View style={styles.formCard}>
                  <View style={styles.formCardHeaderRow}>
                    <View style={[styles.formHeaderIconBox, { backgroundColor: '#EEF2FF' }]}>
                      <MaterialIcons name="school" size={16} color="#003d9b" />
                    </View>
                    <Text style={styles.formCardHeader}>Target Class & Section</Text>
                  </View>

                  {/* Dropdown Class */}
                  <View style={styles.formField}>
                    <View style={styles.labelRow}>
                      <Text style={styles.formLabel}>Class</Text>
                      <Text style={styles.requiredStar}>*</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.formSelectBox}
                      onPress={() => setShowClassDropdown(!showClassDropdown)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectTextRow}>
                        <MaterialIcons name="groups" size={16} color="#003d9b" style={{ marginRight: 8 }} />
                        <Text style={styles.formSelectText}>{formClass}</Text>
                      </View>
                      <MaterialIcons name={showClassDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#003d9b" />
                    </TouchableOpacity>

                    {showClassDropdown && (
                      <View style={styles.formDropdownOptions}>
                        {classesList.map(c => (
                          <TouchableOpacity
                            key={c}
                            style={[styles.formDropdownItem, formClass === c && styles.formDropdownItemActive]}
                            onPress={() => {
                              setFormClass(c);
                              setShowClassDropdown(false);
                            }}
                          >
                            <Text style={[styles.formDropdownItemText, formClass === c && styles.formDropdownItemTextActive]}>{c}</Text>
                            {formClass === c && <MaterialIcons name="check" size={16} color="#003d9b" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Dropdown Section */}
                  <View style={styles.formField}>
                    <View style={styles.labelRow}>
                      <Text style={styles.formLabel}>Section</Text>
                      <Text style={styles.requiredStar}>*</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.formSelectBox}
                      onPress={() => setShowSectionDropdown(!showSectionDropdown)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectTextRow}>
                        <MaterialIcons name="view-carousel" size={16} color="#003d9b" style={{ marginRight: 8 }} />
                        <Text style={styles.formSelectText}>{formSection}</Text>
                      </View>
                      <MaterialIcons name={showSectionDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#003d9b" />
                    </TouchableOpacity>

                    {showSectionDropdown && (
                      <View style={styles.formDropdownOptions}>
                        {sectionsList.map(sec => (
                          <TouchableOpacity
                            key={sec}
                            style={[styles.formDropdownItem, formSection === sec && styles.formDropdownItemActive]}
                            onPress={() => {
                              setFormSection(sec);
                              setShowSectionDropdown(false);
                            }}
                          >
                            <Text style={[styles.formDropdownItemText, formSection === sec && styles.formDropdownItemTextActive]}>{sec}</Text>
                            {formSection === sec && <MaterialIcons name="check" size={16} color="#003d9b" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                {/* Timeline Setup Card: Start Date & Deadline */}
                <View style={[styles.formCard, { borderLeftColor: '#B45309' }]}>
                  <View style={styles.formCardHeaderRow}>
                    <View style={[styles.formHeaderIconBox, { backgroundColor: '#FFFBEB' }]}>
                      <MaterialIcons name="event" size={16} color="#B45309" />
                    </View>
                    <Text style={[styles.formCardHeader, { color: '#B45309' }]}>Timeline Schedule</Text>
                  </View>

                  <View style={styles.formField}>
                    <View style={styles.labelRow}>
                      <Text style={styles.formLabel}>Start Date</Text>
                      <Text style={styles.requiredStar}>*</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.formSelectBox}
                      onPress={() => {
                        setDatePickerTarget('start');
                        setDatePickerValue(formStart);
                        setDatePickerTitle('Select Start Date & Time');
                        setIsDatePickerVisible(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectTextRow}>
                        <MaterialIcons name="event" size={16} color="#B45309" style={{ marginRight: 8 }} />
                        <Text style={styles.formSelectText}>{formStart}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-down" size={20} color="#B45309" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.formField}>
                    <View style={styles.labelRow}>
                      <Text style={styles.formLabel}>Deadline</Text>
                      <Text style={styles.requiredStar}>*</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.formSelectBox}
                      onPress={() => {
                        setDatePickerTarget('deadline');
                        setDatePickerValue(formDeadline);
                        setDatePickerTitle('Select Submission Deadline');
                        setIsDatePickerVisible(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectTextRow}>
                        <MaterialIcons name="event" size={16} color="#B45309" style={{ marginRight: 8 }} />
                        <Text style={styles.formSelectText}>{formDeadline}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-down" size={20} color="#B45309" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Story Image Upload Card */}
                <View style={[styles.formCard, { borderLeftColor: '#0B8A7D' }]}>
                  <View style={styles.formCardHeaderRow}>
                    <View style={[styles.formHeaderIconBox, { backgroundColor: '#F0FDF4' }]}>
                      <MaterialIcons name="image" size={16} color="#0B8A7D" />
                    </View>
                    <Text style={[styles.formCardHeader, { color: '#0B8A7D' }]}>Story Image</Text>
                  </View>

                  <View style={styles.formField}>
                    <View style={styles.labelRow}>
                      <Text style={styles.formLabel}>Cover Illustration</Text>
                      <Text style={styles.requiredStar}>*</Text>
                    </View>
                    <View style={styles.fileUploadBox}>
                      <TouchableOpacity style={styles.chooseFileBtn} onPress={handlePickImage} activeOpacity={0.8}>
                        <MaterialIcons name="cloud-upload" size={14} color="#0B8A7D" style={{ marginRight: 6 }} />
                        <Text style={styles.chooseFileText}>Choose File</Text>
                      </TouchableOpacity>
                      <Text style={styles.fileNameText} numberOfLines={1}>{formImageName}</Text>
                    </View>
                  </View>
                </View>

                {/* Paragraph Type Selector & Generator Card */}
                <View style={[styles.formCard, { borderLeftColor: '#3B4FD8' }]}>
                  <View style={styles.formCardHeaderRow}>
                    <View style={[styles.formHeaderIconBox, { backgroundColor: '#F5F3FF' }]}>
                      <MaterialIcons name="article" size={16} color="#3B4FD8" />
                    </View>
                    <Text style={[styles.formCardHeader, { color: '#3B4FD8' }]}>Paragraph Setup</Text>
                  </View>

                  {/* Paragraph Type Dropdown */}
                  <View style={styles.formField}>
                    <View style={styles.labelRow}>
                      <Text style={styles.formLabel}>Paragraph Type</Text>
                      <Text style={styles.requiredStar}>*</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.formSelectBox}
                      onPress={() => setShowParagraphTypeDropdown(!showParagraphTypeDropdown)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectTextRow}>
                        <MaterialIcons name="tune" size={16} color="#3B4FD8" style={{ marginRight: 8 }} />
                        <Text style={styles.formSelectText}>{formParagraphType}</Text>
                      </View>
                      <MaterialIcons name={showParagraphTypeDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#3B4FD8" />
                    </TouchableOpacity>

                    {showParagraphTypeDropdown && (
                      <View style={styles.formDropdownOptions}>
                        {paragraphTypesList.map(type => (
                          <TouchableOpacity
                            key={type}
                            style={[styles.formDropdownItem, formParagraphType === type && styles.formDropdownItemActive]}
                            onPress={() => {
                              setFormParagraphType(type);
                              setShowParagraphTypeDropdown(false);
                            }}
                          >
                            <Text style={[styles.formDropdownItemText, formParagraphType === type && styles.formDropdownItemTextActive]}>{type}</Text>
                            {formParagraphType === type && <MaterialIcons name="check" size={16} color="#3B4FD8" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Dynamic Fields based on Paragraph Type */}
                  {formParagraphType === 'AI Generated Paragraph' ? (
                    <View style={styles.formField}>
                      <Text style={styles.formLabel}>AI Topic / Story Prompt</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="e.g. Space Exploration & Solar Flares"
                        placeholderTextColor="#94A3B8"
                        value={formAiTopic}
                        onChangeText={setFormAiTopic}
                      />
                      <TouchableOpacity
                        style={styles.aiGenerateBtn}
                        onPress={handleGenerateAiPassage}
                        activeOpacity={0.85}
                      >
                        <MaterialIcons name="auto-awesome" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                        <Text style={styles.aiGenerateBtnText}>✨ Generate Passage with AI</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.formField}>
                      <Text style={styles.formLabel}>Passage Title</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="e.g. The Whispering Forest"
                        placeholderTextColor="#94A3B8"
                        value={formTitle}
                        onChangeText={setFormTitle}
                      />
                    </View>
                  )}

                  {/* Paragraph Content Text Area */}
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Paragraph Content</Text>
                    <TextInput
                      style={[styles.formInput, { height: 90, textAlignVertical: 'top', paddingTop: 10 }]}
                      placeholder="Paragraph content text will appear here..."
                      placeholderTextColor="#94A3B8"
                      multiline={true}
                      value={formOwnText}
                      onChangeText={setFormOwnText}
                    />
                  </View>
                </View>

                {/* Bottom Action Bar: Generate / Publish + Cancel */}
                <View style={styles.formActionsRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setIsCreateModalVisible(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelBtnText}>CANCEL</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.postButtonFlex}
                    onPress={handleCreatePassage}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#008BA3', '#0066FF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.postBtnGradient}
                    >
                      <MaterialIcons name="add" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                      <Text style={styles.postButtonText}>+ Generate Passage</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: READING COACH RESULT ──
  if (isResultModalVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignSelf: 'center', width: '100%', maxWidth: 500 }} edges={['top', 'bottom']}>
                <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <View style={{ flex: 1, backgroundColor: "#ffffff" }}>

            {/* Gradient Header Bar */}
            <LinearGradient
              colors={['#003d9b', '#0052cc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.createModalBand, { borderTopLeftRadius: 0, borderTopRightRadius: 0, paddingTop: 36 }]}
            >
              <View style={styles.createModalHeaderRow}>
                <View style={styles.createModalHeaderLeft}>
                  <View style={styles.createModalIconBox}>
                    <MaterialIcons name="assessment" size={20} color="#ffffff" />
                  </View>
                  <View>
                    <Text style={styles.createModalTitle}>Reading Coach Result</Text>
                    <Text style={styles.createModalSubtitle}>
                      {selectedPassage ? `Story: ${selectedPassage.title}` : 'Student Fluency Analytics'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.createModalCloseBtn}
                  onPress={() => setIsResultModalVisible(false)}
                >
                  <MaterialIcons name="close" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>

              {/* Export Toolbar Buttons */}
              <View style={styles.exportToolbarRow}>
                {['Copy', 'CSV', 'Excel', 'PDF', 'Print'].map(btn => (
                  <TouchableOpacity
                    key={btn}
                    style={styles.exportBtnPill}
                    onPress={() => Alert.alert('Export', `${btn} report generated!`)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.exportBtnPillText}>{btn}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Result Search Input */}
              <View style={[styles.searchBar, { marginBottom: 14, height: 44 }]}>
                <MaterialIcons name="search" size={18} color="#003d9b" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search student name..."
                  placeholderTextColor="#94A3B8"
                  value={resultSearchQuery}
                  onChangeText={setResultSearchQuery}
                />
              </View>

              {/* Student Results Table / Card List */}
              <View style={styles.resultListContainer}>
                {MOCK_RESULTS.filter(r => !resultSearchQuery.trim() || r.studentName.toLowerCase().includes(resultSearchQuery.toLowerCase().trim())).map((row) => {
                  const accNum = parseInt(row.accuracy.replace('%', ''), 10);
                  const isHigh = accNum >= 75;
                  const isMed = accNum >= 50 && accNum < 75;

                  const accBg = isHigh ? '#DCFCE7' : isMed ? '#FEF3C7' : '#FEE2E2';
                  const accText = isHigh ? '#15803D' : isMed ? '#B45309' : '#B91C1C';

                  return (
                    <View key={row.sNo} style={styles.resultCardRow}>
                      <View style={styles.resultSNoBox}>
                        <Text style={styles.resultSNoText}>#{row.sNo}</Text>
                      </View>

                      <View style={styles.resultMainInfo}>
                        <Text style={styles.resultStudentName}>{row.studentName}</Text>
                        <View style={styles.resultMetaRow}>
                          <View style={styles.resultClassPill}>
                            <Text style={styles.resultClassText}>{row.class}</Text>
                          </View>
                          <Text style={styles.resultStoryName} numberOfLines={1}>{selectedPassage?.title || row.storyName}</Text>
                        </View>
                      </View>

                      <View style={styles.resultStatsCol}>
                        <View style={[styles.accuracyBadgePill, { backgroundColor: accBg }]}>
                          <Text style={[styles.accuracyBadgeText, { color: accText }]}>{row.accuracy}</Text>
                        </View>
                        <Text style={styles.readingTimeText}>{row.readingTime}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { alignSelf: 'center', width: '100%', maxWidth: 500 }]} edges={['top']}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={20} color="#003d9b" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>AI Reading Coach</Text>
            <Text style={styles.headerSubtitle}>Pronunciation & fluency trainer</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButtonHeader}
          onPress={() => setIsCreateModalVisible(true)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#0066FF', '#003D9B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createBtnGradient}
          >
            <MaterialIcons name="add-circle" size={19} color="#ffffff" style={{ marginRight: 5 }} />
            <Text style={styles.createBtnText}>Create</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Main Scroll Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* 2. HERO SUMMARY OVERVIEW CARD */}
        <LinearGradient
          colors={['#0F172A', '#1E1B4B', '#312E81']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={[styles.bandCircle, { width: 160, height: 160, top: -60, right: -40, opacity: 0.1 }]} />
          <View style={[styles.bandCircle, { width: 90, height: 90, bottom: -30, left: -20, opacity: 0.08 }]} />

          {/* Top Label */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <MaterialIcons name="auto-stories" size={12} color="#A5B4FC" style={{ marginRight: 5 }} />
              <Text style={styles.heroBadgeText}>AI FLUENCY HUB</Text>
            </View>
            <Text style={styles.heroDate}>Aug 2026</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{stats.total}</Text>
              <Text style={styles.heroStatLabel}>Passages</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStat}>
              <Text style={[styles.heroStatNum, { color: '#6EE7B7' }]}>{stats.avgAcc}</Text>
              <Text style={styles.heroStatLabel}>Avg Accuracy</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStat}>
              <Text style={[styles.heroStatNum, { color: '#93C5FD' }]}>{stats.avgWpm}</Text>
              <Text style={styles.heroStatLabel}>Target WPM</Text>
            </View>
          </View>

          {/* Bottom Progress Bar */}
          <View style={styles.heroProgressRow}>
            <View style={[styles.heroProgressSegment, { flex: 4, backgroundColor: '#6EE7B7' }]} />
            <View style={[styles.heroProgressSegment, { flex: 3, backgroundColor: '#93C5FD' }]} />
            <View style={[styles.heroProgressSegment, { flex: 2, backgroundColor: '#FCD34D' }]} />
          </View>
        </LinearGradient>

        {/* 3. CATEGORY FILTERS */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionHeading}>Filter by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {categoriesFilter.map(cat => {
              const isSelected = selectedCategory === cat;
              const chipAccent = getCategoryColor(cat);
              const chipIcon =
                cat === 'Stories' ? '📖' :
                cat === 'Science' ? '🔬' :
                cat === 'History' ? '📜' :
                cat === 'Tech' ? '💻' : '✦';
              const chipLabel = cat === 'All' ? 'All Passages' : cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filterChip,
                    isSelected
                      ? [styles.filterChipActive, { backgroundColor: chipAccent, borderColor: chipAccent, shadowColor: chipAccent }]
                      : styles.filterChipInactive
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.filterChipText,
                    isSelected ? styles.filterChipTextActive : [styles.filterChipTextInactive, { color: chipAccent }]
                  ]}>
                    {`${chipIcon}  ${chipLabel}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. SEARCH */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconBox}>
              <MaterialIcons name="search" size={18} color="#003d9b" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by title, topic, preview text..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.searchClearBtn} onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={14} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 5. READING PASSAGE CARDS LIST */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Reading Passages</Text>
            <View style={styles.counterBadge}>
              <Text style={styles.counterBadgeText}>{filteredPassages.length} Available</Text>
            </View>
          </View>

          {filteredPassages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="auto-stories" size={44} color="#cadaff" />
              <Text style={styles.emptyText}>No reading passages match your search</Text>
            </View>
          ) : (
            filteredPassages.map(item => {
              const accent = getCategoryColor(item.category);
              return (
                <View key={item.id} style={[styles.card, { shadowColor: accent }]}>

                  {/* ── Header Band (#, Class, Title, AI Speaking Waves) ── */}
                  <LinearGradient
                    colors={[accent, accent + 'DD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardTopBand}
                  >
                    <View style={[styles.bandCircle, { width: 110, height: 110, bottom: -45, right: -15, opacity: 0.14 }]} />

                    {/* Top Pill Row */}
                    <View style={styles.cardHeaderTopPillRow}>
                      <View style={styles.aiAgentTagPill}>
                        <View style={styles.aiPulseDot} />
                        <View style={{ marginRight: 4 }}>
                          {renderVoiceWaves('#ffffff')}
                        </View>
                        <Text style={styles.aiAgentTagText}>AI SPEAKING COACH</Text>
                      </View>
                      <View style={styles.refPillBand}>
                        <Text style={styles.refTextBand}>#{item.sNo}</Text>
                      </View>
                    </View>

                    {/* Title & Grade Row */}
                    <View style={styles.bandContent}>
                      <View style={styles.bandLeft}>
                        <Text style={styles.cardTitleBand} numberOfLines={1}>{item.title}</Text>
                        <View style={styles.subtitleRow}>
                          <MaterialIcons name="school" size={11} color="rgba(255,255,255,0.85)" style={{ marginRight: 4 }} />
                          <Text style={styles.cardSubtitleBand}>{item.class}</Text>
                        </View>
                      </View>
                      <View style={styles.soundWaveIconBox}>
                        <MaterialIcons name="record-voice-over" size={20} color="rgba(255,255,255,0.95)" />
                      </View>
                    </View>
                  </LinearGradient>

                  {/* ── Body (STORY, Speech Targets, Timeline, Actions) ── */}
                  <View style={styles.cardBody}>

                    {/* STORY Content Excerpt Box with Audio Waveform Bar */}
                    <View style={[styles.storyBox, { borderLeftColor: accent }]}>
                      <View style={styles.storyBoxHeaderRow}>
                        <View style={styles.storyBoxTitleGroup}>
                          <MaterialIcons name="auto-stories" size={13} color={accent} style={{ marginRight: 5 }} />
                          <Text style={[styles.storyBoxLabel, { color: accent }]}>STORY PARAGRAPH</Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.listenSampleBtn, { backgroundColor: accent + '14', borderColor: accent + '30' }]}
                          onPress={() => Alert.alert('AI Voice Sample', `Playing AI vocal narration for "${item.title}"`)}
                          activeOpacity={0.85}
                        >
                          <MaterialIcons name="play-circle-filled" size={13} color={accent} style={{ marginRight: 4 }} />
                          <View style={{ marginRight: 4 }}>
                            {renderVoiceWaves(accent)}
                          </View>
                          <Text style={[styles.listenSampleText, { color: accent }]}>Listen AI</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.previewText} numberOfLines={3}>"{item.previewText}"</Text>
                    </View>

                    {/* Speech Target Fluency Capsules Bar */}
                    <View style={styles.speechTargetsRow}>
                      <View style={styles.speechTargetPill}>
                        <MaterialIcons name="speed" size={12} color="#0B8A7D" style={{ marginRight: 4 }} />
                        <Text style={styles.speechTargetText}>{item.targetWpm || 110} WPM Target</Text>
                      </View>
                      <View style={styles.speechTargetPill}>
                        <MaterialIcons name="verified" size={12} color="#3B4FD8" style={{ marginRight: 4 }} />
                        <Text style={styles.speechTargetText}>{item.avgAccuracy || '95%'} Goal</Text>
                      </View>
                      <View style={[styles.speechTargetPill, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                        <MaterialIcons name="graphic-eq" size={12} color="#059669" style={{ marginRight: 4 }} />
                        <Text style={[styles.speechTargetText, { color: '#059669', fontWeight: '900' }]}>Voice Active</Text>
                      </View>
                    </View>

                    {/* START DATE → END DATE Timeline Row */}
                    <View style={styles.compactDateRow}>
                      <View style={styles.dateColLeft}>
                        <View style={styles.dateHeaderRow}>
                          <View style={[styles.compactDateDot, { backgroundColor: '#10B981' }]} />
                          <Text style={styles.dateLabelMini}>START DATE</Text>
                        </View>
                        <Text style={styles.compactDateStart}>{item.startDateTime}</Text>
                      </View>

                      <View style={styles.dateArrowBox}>
                        <MaterialIcons name="trending-flat" size={16} color="#94A3B8" />
                      </View>

                      <View style={styles.dateColRight}>
                        <View style={styles.dateHeaderRowRight}>
                          <Text style={[styles.dateLabelMini, { color: '#E11D48' }]}>END DATE</Text>
                          <View style={[styles.compactDateDot, { backgroundColor: '#E11D48', marginLeft: 4 }]} />
                        </View>
                        <Text style={styles.compactDateDeadline}>{item.deadline}</Text>
                      </View>
                    </View>

                    {/* ACTION BUTTONS: Preview, Edit, Delete, View Result */}
                    <View style={styles.desktopActionsRow}>
                      <TouchableOpacity
                        style={styles.btnDesktopPreview}
                        onPress={() => handleStartPractice(item)}
                        activeOpacity={0.85}
                      >
                        <LinearGradient
                          colors={['#0284C7', '#0369A1']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.actionBtnGradient}
                        >
                          <MaterialIcons name="visibility" size={13} color="#ffffff" style={{ marginRight: 4 }} />
                          <Text style={styles.btnDesktopPreviewText}>Preview</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnDesktopEdit}
                        onPress={() => Alert.alert('Edit Assignment', `Edit configuration active for #${item.sNo}`)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="edit" size={13} color="#003d9b" style={{ marginRight: 4 }} />
                        <Text style={styles.btnDesktopEditText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnDesktopDelete}
                        onPress={() => Alert.alert('Delete', `Delete assignment #${item.sNo}?`)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="delete-outline" size={15} color="#E11D48" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnDesktopResult}
                        onPress={() => handleViewResult(item)}
                        activeOpacity={0.85}
                      >
                        <LinearGradient
                          colors={['#0066FF', '#003D9B']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.actionBtnGradient}
                        >
                          <MaterialIcons name="bar-chart" size={14} color="#ffffff" style={{ marginRight: 5 }} />
                          <Text style={styles.btnDesktopResultText}>View Result</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              );
            })
          )}
        </View>

      </ScrollView>

      {/* 6. AI COACH LIVE PRACTICE MODAL */}

































































































      {/* 7. CREATE READING PASSAGE MODAL (Reading Coach — New Assignment) */}












































































































































































































































































































































      {/* 8. READING COACH RESULT MODAL (Reading Coach Result Screen) */}












































































































      <PremiumDateTimePicker
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        value={datePickerValue}
        title={datePickerTitle}
        onSelect={(val) => {
          if (datePickerTarget === 'start') {
            setFormStart(val);
          } else if (datePickerTarget === 'deadline') {
            setFormDeadline(val);
          }
        }}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#041b3c',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 1,
  },
  createButtonHeader: {
    borderRadius: 24,
    shadowColor: '#0052CC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 6,
  },
  createBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  // HERO CARD
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  bandCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#ffffff',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#A5B4FC',
    letterSpacing: 1,
  },
  heroDate: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroStatNum: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroStatLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 3,
  },
  heroProgressRow: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  heroProgressSegment: {
    height: '100%',
    borderRadius: 3,
    opacity: 0.85,
  },
  // FILTERS
  filterSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  filterChipActive: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  filterChipInactive: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0,0,0,0.07)',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filterChipTextInactive: {
    color: '#64748B',
  },
  // SEARCH
  searchSection: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: 18,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  searchClearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // LIST CARDS
  listSection: {
    gap: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  counterBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#003d9b',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  cardTopBand: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  bandContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bandLeft: {
    flex: 1,
    marginRight: 10,
  },
  cardTitleBand: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  cardSubtitleBand: {
    fontSize: 11.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  bandRight: {
    alignItems: 'flex-end',
  },
  difficultyPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  difficultyText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 11,
    backgroundColor: '#ffffff',
  },
  previewText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  infoRowPair: {
    flexDirection: 'row',
  },
  infoCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 7,
  },
  infoCapsuleIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCapsuleText: {
    flex: 1,
  },
  infoCapsuleLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCapsuleValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  teacherRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherAvatarNew: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  teacherAvatarTextNew: {
    fontSize: 12,
    fontWeight: '900',
  },
  teacherTextNew: {
    justifyContent: 'center',
  },
  teacherLabelNew: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  teacherNameNew: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  spacer: {
    flex: 1,
  },
  deadlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deadlineChipSubLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#BE2F2F',
    textTransform: 'uppercase',
  },
  deadlineChipText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#991B1B',
  },
  cardActionsNew: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  editBtnNew: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBtnGradient: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  detailBtnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  detailBtnTextNew: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },
  // MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 27, 60, 0.55)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  detailBand: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  detailBandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailBandLeft: {
    flex: 1,
    marginRight: 10,
  },
  typePillBand: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  typePillBandText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  detailBandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.4,
    marginTop: 6,
    marginBottom: 4,
  },
  detailBandSub: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.78)',
  },
  detailCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScroll: {
    padding: 18,
  },
  detailSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  detailSectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  passageFullText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 22,
  },
  practiceProgressBox: {
    gap: 6,
    marginBottom: 12,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  progressVal: {
    fontSize: 12,
    fontWeight: '900',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  practiceStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 6,
  },
  practiceStatBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  practiceStatNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  practiceStatLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  micControlBox: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  micButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  micButtonRecording: {
    backgroundColor: '#E11D48',
    shadowColor: '#E11D48',
  },
  micStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  // CREATE FORM MODAL
  createModalBand: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
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
    gap: 12,
  },
  createModalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createModalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  createModalSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
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
  formContainer: {
    gap: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.2,
    borderLeftWidth: 4.5,
    borderColor: '#F1F5F9',
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  formCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    marginBottom: 2,
  },
  formHeaderIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCardHeader: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#003d9b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  formField: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requiredStar: {
    color: '#E11D48',
    fontSize: 13,
    fontWeight: '900',
  },
  formSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  selectTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formSelectText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  formDropdownOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  formDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formDropdownItemActive: {
    backgroundColor: '#EEF2FF',
  },
  formDropdownItemText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  formDropdownItemTextActive: {
    color: '#003d9b',
    fontWeight: '900',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  // File Upload Box & Action Bar
  fileUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 48,
    gap: 10,
  },
  chooseFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0B8A7D',
  },
  chooseFileText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B8A7D',
  },
  fileNameText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  aiGenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B4FD8',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
  },
  aiGenerateBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#ffffff',
  },
  formActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E11D48',
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#E11D48',
    letterSpacing: 0.5,
  },
  postButtonFlex: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    height: 50,
    shadowColor: '#008BA3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  postBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  // Desktop portal specific styles - AI Voice & Sound Agent Coach Design
  cardHeaderTopPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiAgentTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  aiPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 4,
  },
  aiAgentTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  soundWaveIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  storyBoxHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  storyBoxTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenSampleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  listenSampleText: {
    fontSize: 9.5,
    fontWeight: '900',
  },
  speechTargetsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  speechTargetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  speechTargetText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#334155',
  },
  storyBoxLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  refPillBand: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  refTextBand: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ffffff',
  },
  compactDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateColLeft: {
    flex: 1,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  dateColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateHeaderRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  dateArrowBox: {
    paddingHorizontal: 8,
  },
  compactDateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  dateLabelMini: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  compactDateStart: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  compactDateDeadline: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#E11D48',
  },
  desktopActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  actionBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btnDesktopPreview: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  btnDesktopPreviewText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#ffffff',
  },
  btnDesktopEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  btnDesktopEditText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#003d9b',
  },
  btnDesktopDelete: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDesktopResult: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginLeft: 'auto',
  },
  btnDesktopResultText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#ffffff',
  },
  // Result Modal Styles
  exportToolbarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  exportBtnPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportBtnPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ffffff',
  },
  resultListContainer: {
    gap: 8,
  },
  resultCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  resultSNoBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultSNoText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#003d9b',
  },
  resultMainInfo: {
    flex: 1,
  },
  resultStudentName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  resultMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  resultClassPill: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  resultClassText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0369A1',
  },
  resultStoryName: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    flex: 1,
  },
  resultStatsCol: {
    alignItems: 'flex-end',
  },
  accuracyBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accuracyBadgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  readingTimeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 3,
  },
});
