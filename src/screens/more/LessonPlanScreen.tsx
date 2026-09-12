import React, { useState } from 'react';
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
  Platform, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PremiumDateTimePicker } from '../../components/PremiumDateTimePicker';
import { useAppTheme } from '../../context/ThemeContext';

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

// Data Interfaces
export type SLOItem = {
  id: string;
  code: string;
  title: string;
  objective: string;
  month: string;
  startDate: string;
  endDate: string;
  week: string; // e.g. "W1", "W2", "W3", "W4", "W5"
  bloomTaxonomy: 'Knowledge' | 'Understanding' | 'Application';
  completed: boolean;
};

export type PlannerFile = {
  id: string;
  contentType: 'PDF' | 'Power Point' | 'Link' | string;
  title: string;
  uploadedAt: string;
};

export type Chapter = {
  id: string;
  chapterNumber: number;
  title: string;
  terms: string[];
  slos: SLOItem[];
  plannerFiles: PlannerFile[];
};

export type ClassItem = {
  id: string;
  name: string;
  courses: string[];
};

export const LessonPlanScreen = ({ navigation }: any) => {
  const { theme: appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';

  // Master Data Definitions
  const classList: ClassItem[] = [
    { id: 'c1', name: 'GRADE-II', courses: ['English', 'Urdu', 'Math', 'Science', 'Islamiat', 'GK', 'Art'] },
    { 
      id: 'c2', 
      name: 'GRADE-V', 
      courses: [
        'English', 'Urdu', 'Science', 'Math', 'Islamiat', 'Nazra', 
        'Social Studies', 'GK', 'Art', 'Information Communication Technology', 'Computer'
      ] 
    },
    { id: 'c3', name: 'GRADE-IX', courses: ['English', 'Urdu', 'Physics', 'Chemistry', 'Biology', 'Math', 'Pak Studies', 'Islamiat', 'Computer Science'] }
  ];

  const termsList = ['Mid Term', 'First Assessment'];
  const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekOptions = ['W1', 'W2', 'W3', 'W4', 'W5'];
  const bloomOptions: ('Knowledge' | 'Understanding' | 'Application')[] = ['Knowledge', 'Understanding', 'Application'];
  const contentTypeOptions = ['PDF', 'Power Point', 'Link'];

  // Step state (1: Class & Subject, 2: Term & Chapters, 3: Lesson Plan & SLOs)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Sub-tab in Step 3
  const [step3Tab, setStep3Tab] = useState<'slos' | 'planner'>('slos');

  // Selections
  const [selectedClass, setSelectedClass] = useState<string>('GRADE-V');
  const [selectedCourse, setSelectedCourse] = useState<string>('Science');
  const [selectedTerm, setSelectedTerm] = useState<string>('Mid Term');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch_1');

  // Loaders
  const [loadingClass, setLoadingClass] = useState<boolean>(false);
  const [addingChapterLoading, setAddingChapterLoading] = useState<boolean>(false);
  const [savingSloLoading, setSavingSloLoading] = useState<boolean>(false);
  const [uploadingPlannerLoading, setUploadingPlannerLoading] = useState<boolean>(false);

  // Confirmation Alert Dialog State (Image 2)
  const [confirmSloModalVisible, setConfirmSloModalVisible] = useState(false);
  const [pendingSloToToggle, setPendingSloToToggle] = useState<SLOItem | null>(null);

  // Date Pickers State
  const [datePickerTarget, setDatePickerTarget] = useState<'startDate' | 'endDate' | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Pre-seeded Chapters Repository
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 'ch_1',
      chapterNumber: 1,
      title: 'Living Things & Adaptations',
      terms: ['Mid Term'],
      slos: [
        {
          id: 'slo_1',
          code: 'SLO-01',
          title: 'Characteristics of Living Organisms',
          objective: 'Identify cellular structure and basic respiration mechanisms in living cells',
          month: 'July',
          startDate: '2026-07-29',
          endDate: '2026-07-29',
          week: 'W1',
          bloomTaxonomy: 'Knowledge',
          completed: true
        },
        {
          id: 'slo_2',
          code: 'SLO-02',
          title: 'Plant and Animal Adaptations',
          objective: 'Differentiate plant and animal adaptation strategies in arid environments',
          month: 'January',
          startDate: '2026-09-05',
          endDate: '2026-09-25',
          week: 'W1',
          bloomTaxonomy: 'Application',
          completed: false
        }
      ],
      plannerFiles: [
        {
          id: 'file_1',
          contentType: 'PDF',
          title: 'Chapter 1 Biology Master Plan.pdf',
          uploadedAt: '2026-07-29'
        }
      ]
    },
    {
      id: 'ch_2',
      chapterNumber: 2,
      title: 'Cellular Structures & Tissues',
      terms: ['Mid Term'],
      slos: [
        {
          id: 'slo_3',
          code: 'SLO-03',
          title: 'Cell Wall & Organelles Observation',
          objective: 'Observe plant cell wall and organelles under compound microscope',
          month: 'August',
          startDate: '2026-08-05',
          endDate: '2026-08-12',
          week: 'W1',
          bloomTaxonomy: 'Understanding',
          completed: false
        }
      ],
      plannerFiles: []
    },
    {
      id: 'ch_3',
      chapterNumber: 3,
      title: 'Ecosystems & Energy Flow',
      terms: ['Mid Term'],
      slos: [],
      plannerFiles: []
    },
    {
      id: 'ch_4',
      chapterNumber: 4,
      title: 'Human Body Systems',
      terms: ['Mid Term', 'First Assessment'],
      slos: [],
      plannerFiles: []
    }
  ]);

  // Add Chapter Form State
  const [showAddChapterForm, setShowAddChapterForm] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [newChapterTerms, setNewChapterTerms] = useState<string[]>(['Mid Term']);

  // Add SLO Modal States
  const [addSloModalVisible, setAddSloModalVisible] = useState(false);
  const [sloTitle, setSloTitle] = useState('');
  const [sloMonth, setSloMonth] = useState('-- Select Month --');
  const [sloObjective, setSloObjective] = useState('');
  const [sloStartDate, setSloStartDate] = useState('2026-09-05');
  const [sloEndDate, setSloEndDate] = useState('2026-09-25');
  const [sloWeek, setSloWeek] = useState('W1');
  const [sloBloom, setSloBloom] = useState<'Knowledge' | 'Understanding' | 'Application'>('Knowledge');

  // Add Planner Form States
  const [plannerContentType, setPlannerContentType] = useState<'PDF' | 'Power Point' | 'Link' | ''>('');
  const [plannerTitle, setPlannerTitle] = useState('');

  // Dropdown Picker Modal
  const [pickerModalType, setPickerModalType] = useState<'month' | 'week' | 'bloom' | 'contentType' | null>(null);

  // Filter Chapters by active term
  const termChapters = chapters.filter(ch => ch.terms.includes(selectedTerm));
  const activeChapter = chapters.find(ch => ch.id === selectedChapterId) || termChapters[0] || null;
  const currentClassCourses = classList.find(c => c.name === selectedClass)?.courses || [];

  // Helper for Theme & Distinct Color per Subject
  const getCourseTheme = (course: string) => {
    const c = course.toLowerCase();
    if (c.includes('sci')) {
      return { icon: 'biotech' as const, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', activeBg: '#F0FDF4' };
    }
    if (c.includes('eng')) {
      return { icon: 'menu-book' as const, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', activeBg: '#F0F7FF' };
    }
    if (c.includes('math')) {
      return { icon: 'calculate' as const, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', activeBg: '#FFFDF5' };
    }
    if (c.includes('urdu')) {
      return { icon: 'edit-note' as const, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', activeBg: '#FAF5FF' };
    }
    if (c.includes('islam')) {
      return { icon: 'auto-stories' as const, color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4', activeBg: '#F2FCFA' };
    }
    if (c.includes('nazra')) {
      return { icon: 'import-contacts' as const, color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', activeBg: '#F0F9FF' };
    }
    if (c.includes('soc') || c.includes('pak')) {
      return { icon: 'public' as const, color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', activeBg: '#FFF5F5' };
    }
    if (c.includes('gk')) {
      return { icon: 'lightbulb' as const, color: '#EA580C', bg: '#FFF7ED', border: '#FED7AA', activeBg: '#FFFAF5' };
    }
    if (c.includes('art')) {
      return { icon: 'palette' as const, color: '#DB2777', bg: '#FDF2F8', border: '#FBCFE8', activeBg: '#FDF4F9' };
    }
    if (c.includes('comp') || c.includes('ict') || c.includes('tech')) {
      return { icon: 'computer' as const, color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE', activeBg: '#F5F7FF' };
    }
    if (c.includes('phys')) {
      return { icon: 'bolt' as const, color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', activeBg: '#F5F7FF' };
    }
    if (c.includes('chem')) {
      return { icon: 'science' as const, color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3', activeBg: '#FFF5F5' };
    }
    if (c.includes('bio')) {
      return { icon: 'eco' as const, color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', activeBg: '#F0FDF4' };
    }
    return { icon: 'book' as const, color: '#0052cc', bg: '#EFF6FF', border: '#DBEAFE', activeBg: '#F8FAFC' };
  };

  // Helper for Class Theme
  const getClassTheme = (cls: string) => {
    if (cls.includes('II')) return { color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' };
    if (cls.includes('V')) return { color: '#2563EB', bg: '#EFF6FF', border: '#DBEAFE' };
    if (cls.includes('IX')) return { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' };
    return { color: '#0052cc', bg: '#EFF6FF', border: '#DBEAFE' };
  };

  // Select Class with Loader
  const handleSelectClass = (clsName: string) => {
    if (clsName === selectedClass) return;
    setLoadingClass(true);
    setSelectedClass(clsName);
    const targetClass = classList.find(c => c.name === clsName);
    if (targetClass && targetClass.courses.length > 0) {
      setSelectedCourse(targetClass.courses[0]);
    }
    setTimeout(() => {
      setLoadingClass(false);
      showToast(`Selected ${clsName}`);
    }, 300);
  };

  // Toggle Term Checkbox in Add Chapter Form
  const toggleNewChapterTerm = (term: string) => {
    if (newChapterTerms.includes(term)) {
      if (newChapterTerms.length > 1) {
        setNewChapterTerms(newChapterTerms.filter(t => t !== term));
      }
    } else {
      setNewChapterTerms([...newChapterTerms, term]);
    }
  };

  // Add Chapter Handler with Loader
  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) {
      alert('Please enter a Chapter Title.');
      return;
    }
    if (newChapterTerms.length === 0) {
      alert('Please select at least one term.');
      return;
    }

    setAddingChapterLoading(true);
    setTimeout(() => {
      const nextNum = newChapterNumber.trim() 
        ? parseInt(newChapterNumber.trim(), 10) || (chapters.length + 1)
        : (chapters.length + 1);

      const newId = `ch_${Date.now()}`;
      const newCh: Chapter = {
        id: newId,
        chapterNumber: nextNum,
        title: newChapterTitle.trim(),
        terms: [...newChapterTerms],
        slos: [],
        plannerFiles: []
      };

      setChapters(prev => [...prev, newCh]);
      setSelectedChapterId(newId);
      setNewChapterTitle('');
      setNewChapterNumber('');
      setShowAddChapterForm(false);
      setAddingChapterLoading(false);
      showToast(`Chapter "${newCh.title}" added!`);
    }, 400);
  };

  // Delete Chapter
  const handleDeleteChapter = (chId: string, chTitle: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete Chapter "${chTitle}"?`)) {
        setChapters(prev => prev.filter(c => c.id !== chId));
        if (selectedChapterId === chId) {
          setSelectedChapterId(chapters.find(c => c.id !== chId)?.id || '');
        }
        showToast('Chapter deleted.');
      }
    } else {
      Alert.alert(
        'Delete Chapter',
        `Are you sure you want to delete "${chTitle}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive', 
            onPress: () => {
              setChapters(prev => prev.filter(c => c.id !== chId));
              if (selectedChapterId === chId) {
                setSelectedChapterId(chapters.find(c => c.id !== chId)?.id || '');
              }
              showToast('Chapter deleted.');
            }
          }
        ]
      );
    }
  };

  // Request SLO Toggle with Confirmation Alert
  const handleRequestToggleSlo = (slo: SLOItem) => {
    setPendingSloToToggle(slo);
    setConfirmSloModalVisible(true);
  };

  // Confirm SLO Toggle Action
  const handleConfirmToggleSlo = () => {
    if (!pendingSloToToggle || !activeChapter) return;
    const targetSloId = pendingSloToToggle.id;
    setChapters(prev => prev.map(ch => {
      if (ch.id === activeChapter.id) {
        return {
          ...ch,
          slos: ch.slos.map(s => s.id === targetSloId ? { ...s, completed: !s.completed } : s)
        };
      }
      return ch;
    }));
    setConfirmSloModalVisible(false);
    setPendingSloToToggle(null);
    showToast(pendingSloToToggle.completed ? 'SLO marked as pending' : 'SLO marked as covered!');
  };

  // Delete SLO
  const handleDeleteSlo = (sloId: string, sloTitleStr: string) => {
    if (!activeChapter) return;
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete SLO "${sloTitleStr}"?`)) {
        setChapters(prev => prev.map(ch => ch.id === activeChapter.id ? { ...ch, slos: ch.slos.filter(s => s.id !== sloId) } : ch));
        showToast('SLO deleted.');
      }
    } else {
      Alert.alert('Delete SLO', `Delete SLO "${sloTitleStr}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            setChapters(prev => prev.map(ch => ch.id === activeChapter.id ? { ...ch, slos: ch.slos.filter(s => s.id !== sloId) } : ch));
            showToast('SLO deleted.');
          } 
        }
      ]);
    }
  };

  // Save New SLO from Modal with Loader
  const handleSaveSlo = () => {
    if (!activeChapter) return;
    if (!sloTitle.trim()) {
      alert("Please fill in the SLO'S standard title.");
      return;
    }

    setSavingSloLoading(true);
    setTimeout(() => {
      const newSlo: SLOItem = {
        id: `slo_${Date.now()}`,
        code: `SLO-${(activeChapter.slos.length + 1).toString().padStart(2, '0')}`,
        title: sloTitle.trim(),
        objective: sloObjective.trim() || 'Core learning objective for ' + sloTitle.trim(),
        month: sloMonth === '-- Select Month --' ? 'January' : sloMonth,
        startDate: sloStartDate,
        endDate: sloEndDate,
        week: sloWeek,
        bloomTaxonomy: sloBloom,
        completed: false
      };

      setChapters(prev => prev.map(ch => {
        if (ch.id === activeChapter.id) {
          return { ...ch, slos: [...ch.slos, newSlo] };
        }
        return ch;
      }));

      setSavingSloLoading(false);
      setAddSloModalVisible(false);
      setSloTitle('');
      setSloObjective('');
      showToast('SLO saved and objectives updated!');
    }, 450);
  };

  // Add Planner Activity with Uploading Loader
  const handleAddPlanner = () => {
    if (!activeChapter) return;
    if (!plannerContentType) {
      alert('Please select a Content Type.');
      return;
    }
    if (!plannerTitle.trim()) {
      alert('Please enter a Planner Title.');
      return;
    }

    setUploadingPlannerLoading(true);
    setTimeout(() => {
      const newFile: PlannerFile = {
        id: `file_${Date.now()}`,
        contentType: plannerContentType,
        title: plannerTitle.trim(),
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      setChapters(prev => prev.map(ch => {
        if (ch.id === activeChapter.id) {
          return { ...ch, plannerFiles: [...ch.plannerFiles, newFile] };
        }
        return ch;
      }));

      setPlannerTitle('');
      setPlannerContentType('');
      setUploadingPlannerLoading(false);
      showToast('Planner document uploaded!');
    }, 500);
  };

  // Delete Planner File
  const handleDeletePlannerFile = (fileId: string) => {
    if (!activeChapter) return;
    setChapters(prev => prev.map(ch => ch.id === activeChapter.id ? { ...ch, plannerFiles: ch.plannerFiles.filter(f => f.id !== fileId) } : ch));
    showToast('Planner file removed.');
  };

  // Stats
  const coveredSloCount = activeChapter ? activeChapter.slos.filter(s => s.completed).length : 0;
  const totalSloCount = activeChapter ? activeChapter.slos.length : 0;
  const progressPercent = totalSloCount > 0 ? Math.round((coveredSloCount / totalSloCount) * 100) : 0;

  return (
    <View style={[styles.root, !isDefaultTheme && { backgroundColor: appTheme.bg }]}>
      <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: 'transparent' }]} edges={['top']}>
        
        {/* ════════════════════════════════════════════════
            APP BAR HEADER (Sharp Compact Style)
           ════════════════════════════════════════════════ */}
        <View style={[styles.appBar, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderBottomColor: appTheme.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={[styles.backButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]} 
              onPress={() => {
                if (currentStep > 1) setCurrentStep((currentStep - 1) as any);
                else navigation.goBack();
              }} 
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={17} color={isDefaultTheme ? '#0052cc' : appTheme.primary} />
            </TouchableOpacity>
            <View style={styles.headerTitleGroup}>
              <View style={[styles.spCircleBadge, !isDefaultTheme && { backgroundColor: appTheme.primary }]}>
                <Text style={styles.spCircleText}>SP</Text>
              </View>
              <View style={{ flexShrink: 1 }}>
                <Text style={[styles.headerTitle, !isDefaultTheme && { color: appTheme.textPrimary }]} numberOfLines={1}>Syllabus & Lesson Planner</Text>
              </View>
            </View>
          </View>
          
          {/* Quick Step Indicator Badge in App Bar */}
          <View style={[styles.appBarStepPill, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
            <Text style={[styles.appBarStepPillText, !isDefaultTheme && { color: appTheme.primary }]}>Step {currentStep}/3</Text>
          </View>
        </View>

        {/* Global Toast Alert */}
        {toastMessage && (
          <View style={styles.toastBanner}>
            <MaterialIcons name="check-circle" size={14} color="#FFFFFF" />
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* ════════════════════════════════════════════════
              SLIM & ULTRA-SHARP STEPPER (No text truncation!)
             ════════════════════════════════════════════════ */}
          <LinearGradient
            colors={isDefaultTheme ? ['#0A1F5C', '#003D9B', '#0052CC'] : appTheme.bannerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBanner}
          >
            {/* 3 Step Pills (Clean, Sharp & Compact) */}
            <View style={styles.stepperContainer}>
              {[
                { step: 1, label: 'Class', icon: 'school' },
                { step: 2, label: 'Chapters', icon: 'menu-book' },
                { step: 3, label: 'SLOs & Plan', icon: 'fact-check' },
              ].map((s) => {
                const isActive = currentStep === s.step;
                const isCompleted = currentStep > s.step;
                return (
                  <TouchableOpacity 
                    key={s.step}
                    style={[styles.stepSegment, isActive && styles.stepSegmentActive]}
                    onPress={() => setCurrentStep(s.step as any)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.stepSegmentDot, 
                      isActive && styles.stepSegmentDotActive,
                      isCompleted && styles.stepSegmentDotDone
                    ]}>
                      {isCompleted ? (
                        <MaterialIcons name="check" size={10} color="#FFFFFF" />
                      ) : (
                        <Text style={[styles.stepSegmentDotText, isActive && styles.stepSegmentDotTextActive]}>
                          {s.step}
                        </Text>
                      )}
                    </View>
                    <Text 
                      style={[styles.stepSegmentText, isActive && styles.stepSegmentTextActive]}
                      numberOfLines={1}
                    >
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Breadcrumb Context Pill (Slim & Crisp) */}
            <View style={styles.heroBreadcrumbRow}>
              <View style={styles.heroSummaryPill}>
                <MaterialIcons name="navigation" size={11} color="#93C5FD" style={{ marginRight: 4 }} />
                <Text style={styles.heroSummaryText} numberOfLines={1}>
                  {selectedClass} &bull; {selectedCourse} {currentStep >= 2 ? `&bull; ${selectedTerm}` : ''} {currentStep === 3 && activeChapter ? `&bull; Ch. ${activeChapter.chapterNumber}` : ''}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* ════════════════════════════════════════════════
              STEP 1: SELECT CLASS & SUBJECT
             ════════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              
              {/* Section Header (Compact) */}
              <View style={styles.stepHeaderCard}>
                <View style={styles.stepTitleRow}>
                  <View style={[styles.stepIconBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                    <MaterialIcons name="school" size={16} color="#2563EB" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>Select Grade & Subject</Text>
                    <Text style={styles.stepDesc}>Pick a grade level and subject to manage lesson plans.</Text>
                  </View>
                </View>
              </View>

              {/* 1. Classes Selection Chips */}
              <View style={styles.cardContainer}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardSectionTitle}>1. Grade / Class Level</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{classList.length} Classes</Text>
                  </View>
                </View>

                <View style={styles.classListRow}>
                  {classList.map(c => {
                    const isSelected = selectedClass === c.name;
                    const cTheme = getClassTheme(c.name);
                    return (
                      <TouchableOpacity
                        key={c.id}
                        style={[
                          styles.classChip, 
                          isSelected ? styles.classChipActive : { backgroundColor: cTheme.bg, borderColor: cTheme.border }
                        ]}
                        onPress={() => handleSelectClass(c.name)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons 
                          name="school" 
                          size={14} 
                          color={isSelected ? "#FFFFFF" : cTheme.color} 
                          style={{ marginRight: 5 }}
                        />
                        <Text style={[styles.classChipText, isSelected ? styles.classChipTextActive : { color: '#0D1B3E' }]}>
                          {c.name}
                        </Text>
                        {isSelected && (
                          <View style={styles.activeDot} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Courses (Subjects) Grid with COLORFUL ICONS */}
              <View style={styles.cardContainer}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardSectionTitle}>2. Choose Subject for {selectedClass}</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{currentClassCourses.length} Subjects</Text>
                  </View>
                </View>

                {loadingClass ? (
                  <View style={styles.loaderBox}>
                    <ActivityIndicator size="small" color="#0052cc" />
                    <Text style={styles.loaderText}>Loading subjects for {selectedClass}...</Text>
                  </View>
                ) : (
                  <View style={styles.coursesGrid}>
                    {currentClassCourses.map(course => {
                      const isSelected = selectedCourse === course;
                      const courseTheme = getCourseTheme(course);
                      return (
                        <TouchableOpacity
                          key={course}
                          style={[
                            styles.courseGridCard, 
                            isSelected ? [styles.courseGridCardActive, { backgroundColor: courseTheme.activeBg, borderColor: courseTheme.color }] : {}
                          ]}
                          onPress={() => {
                            setSelectedCourse(course);
                            showToast(`Selected ${course}`);
                          }}
                          activeOpacity={0.8}
                        >
                          <View style={[
                            styles.courseIconCircle, 
                            { backgroundColor: courseTheme.bg, borderColor: courseTheme.border }
                          ]}>
                            <MaterialIcons name={courseTheme.icon} size={17} color={courseTheme.color} />
                          </View>
                          <Text 
                            style={[
                              styles.courseGridTitle, 
                              isSelected && { color: courseTheme.color, fontWeight: '900' }
                            ]} 
                            numberOfLines={2}
                          >
                            {course}
                          </Text>
                          {isSelected && (
                            <View style={[styles.selectedBadgeCorner, { backgroundColor: courseTheme.color }]}>
                              <MaterialIcons name="check" size={10} color="#FFFFFF" />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Next Step Button */}
              <TouchableOpacity 
                style={styles.primaryActionButton}
                onPress={() => setCurrentStep(2)}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryActionButtonText}>
                  Continue to Chapters &rsaquo;
                </Text>
                <MaterialIcons name="arrow-forward" size={15} color="#FFFFFF" />
              </TouchableOpacity>

            </View>
          )}

          {/* ════════════════════════════════════════════════
              STEP 2: TERM & CHAPTERS
             ════════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              
              {/* Section Header (Compact) */}
              <View style={styles.stepHeaderCard}>
                <View style={styles.stepTitleRow}>
                  <View style={[styles.stepIconBox, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                    <MaterialIcons name="menu-book" size={16} color="#D97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>Term & Chapters</Text>
                    <Text style={styles.stepDesc}>{selectedClass} &bull; {selectedCourse}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.stepBackMiniBtn} 
                    onPress={() => setCurrentStep(1)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="edit" size={11} color="#0052cc" style={{ marginRight: 2 }} />
                    <Text style={styles.stepBackMiniBtnText}>Change</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 1. Terms Switcher */}
              <View style={styles.cardContainer}>
                <Text style={styles.cardSectionTitle}>1. Academic Term</Text>
                <View style={styles.termsRow}>
                  {termsList.map((term, idx) => {
                    const isSelected = selectedTerm === term;
                    const count = chapters.filter(c => c.terms.includes(term)).length;
                    const termColor = idx === 0 ? '#2563EB' : '#D97706';
                    const termBg = idx === 0 ? '#EFF6FF' : '#FFFBEB';
                    return (
                      <TouchableOpacity
                        key={term}
                        style={[
                          styles.termButton, 
                          isSelected ? styles.termButtonActive : { backgroundColor: termBg, borderColor: idx === 0 ? '#DBEAFE' : '#FDE68A' }
                        ]}
                        onPress={() => setSelectedTerm(term)}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons 
                          name="calendar-view-month" 
                          size={14} 
                          color={isSelected ? "#FFFFFF" : termColor} 
                          style={{ marginRight: 5 }} 
                        />
                        <Text style={[styles.termButtonText, isSelected ? styles.termButtonTextActive : { color: '#0D1B3E' }]} numberOfLines={1}>
                          {term}
                        </Text>
                        <View style={[styles.termCountPill, isSelected && styles.termCountPillActive]}>
                          <Text style={[styles.termCountPillText, isSelected ? styles.termCountPillTextActive : { color: termColor }]}>
                            {count} Ch
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 2. Chapters List */}
              <View style={styles.cardContainer}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardSectionTitle}>2. Chapters ({termChapters.length})</Text>
                  <TouchableOpacity 
                    style={styles.addChapterToggleBtn}
                    onPress={() => setShowAddChapterForm(!showAddChapterForm)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name={showAddChapterForm ? "close" : "add"} size={14} color="#0052cc" />
                    <Text style={styles.addChapterToggleBtnText}>
                      {showAddChapterForm ? "Cancel" : "Add Chapter"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Add Chapter Form (Collapsible) */}
                {showAddChapterForm && (
                  <View style={styles.addChapterFormCard}>
                    <Text style={styles.formSectionHeader}>New Chapter Details</Text>
                    
                    <Text style={styles.inputLabel}>CHAPTER TITLE <Text style={styles.reqStar}>*</Text></Text>
                    <TextInput
                      style={styles.formTextInput}
                      placeholder="e.g. Living Things & Organisms"
                      placeholderTextColor="#94A3B8"
                      value={newChapterTitle}
                      onChangeText={setNewChapterTitle}
                    />

                    <Text style={styles.inputLabel}>
                      CHAPTER NUMBER <Text style={styles.subNote}>(optional)</Text>
                    </Text>
                    <TextInput
                      style={styles.formTextInput}
                      placeholder="e.g. 1"
                      placeholderTextColor="#94A3B8"
                      keyboardType="numeric"
                      value={newChapterNumber}
                      onChangeText={setNewChapterNumber}
                    />

                    <Text style={styles.inputLabel}>
                      ADD TO TERM(S) <Text style={styles.reqStar}>*</Text>
                    </Text>
                    <View style={styles.termsCheckboxRow}>
                      {termsList.map(t => {
                        const isChecked = newChapterTerms.includes(t);
                        return (
                          <TouchableOpacity
                            key={t}
                            style={[styles.checkboxChip, isChecked && styles.checkboxChipActive]}
                            onPress={() => toggleNewChapterTerm(t)}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons 
                              name={isChecked ? "check-box" : "check-box-outline-blank"} 
                              size={15} 
                              color={isChecked ? "#0052cc" : "#64748B"} 
                            />
                            <Text style={[styles.checkboxChipText, isChecked && styles.checkboxChipTextActive]}>{t}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <TouchableOpacity 
                      style={styles.saveChapterButton}
                      onPress={handleAddChapter}
                      disabled={addingChapterLoading}
                      activeOpacity={0.8}
                    >
                      {addingChapterLoading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <ActivityIndicator size="small" color="#FFFFFF" />
                          <Text style={styles.saveChapterButtonText}>Creating Chapter...</Text>
                        </View>
                      ) : (
                        <Text style={styles.saveChapterButtonText}>+ Save Chapter</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}

                {/* Chapter Cards */}
                {termChapters.length === 0 ? (
                  <View style={styles.emptyCardBox}>
                    <MaterialIcons name="auto-stories" size={28} color="#CBD5E1" />
                    <Text style={styles.emptyCardTitle}>No Chapters in {selectedTerm}</Text>
                    <Text style={styles.emptyCardSub}>Tap "+ Add Chapter" above to create your first chapter.</Text>
                  </View>
                ) : (
                  <View style={styles.chaptersStack}>
                    {termChapters.map(ch => {
                      const isSelected = activeChapter?.id === ch.id;
                      const covered = ch.slos.filter(s => s.completed).length;
                      const total = ch.slos.length;
                      const chPercent = total > 0 ? Math.round((covered / total) * 100) : 0;

                      return (
                        <TouchableOpacity
                          key={ch.id}
                          style={[styles.chapterListItem, isSelected && styles.chapterListItemActive]}
                          onPress={() => setSelectedChapterId(ch.id)}
                          activeOpacity={0.85}
                        >
                          <View style={styles.chapterItemTop}>
                            <View style={[
                              styles.chapterNumberBadge, 
                              isSelected ? styles.chapterNumberBadgeActive : { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }
                            ]}>
                              <Text style={[
                                styles.chapterNumberBadgeText, 
                                isSelected ? styles.chapterNumberBadgeTextActive : { color: '#0052cc' }
                              ]}>
                                Ch. {ch.chapterNumber}
                              </Text>
                            </View>
                            <View style={{ flex: 1, marginHorizontal: 7 }}>
                              <Text style={[styles.chapterItemTitle, isSelected && styles.chapterItemTitleActive]} numberOfLines={1}>
                                {ch.title}
                              </Text>
                              <Text style={styles.chapterItemMeta}>
                                <Text style={{ color: '#059669', fontWeight: '700' }}>{covered}/{total} covered</Text> ({chPercent}%) &bull; {ch.plannerFiles.length} files
                              </Text>
                            </View>

                            <TouchableOpacity 
                              onPress={(e) => {
                                e.stopPropagation?.();
                                handleDeleteChapter(ch.id, ch.title);
                              }}
                              style={styles.deleteChapterIconBtn}
                            >
                              <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
                            </TouchableOpacity>
                          </View>

                          {/* Progress Line */}
                          <View style={styles.chapterProgressTrack}>
                            <View style={[styles.chapterProgressFill, { width: `${chPercent}%`, backgroundColor: chPercent === 100 ? '#059669' : '#0052cc' }]} />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Navigation Action Buttons */}
              <View style={styles.stepNavigationRow}>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => setCurrentStep(1)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="arrow-back" size={14} color="#0052cc" />
                  <Text style={styles.secondaryButtonText}>Back to Subjects</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.primaryButton, !activeChapter && { opacity: 0.6 }]}
                  onPress={() => {
                    if (activeChapter) setCurrentStep(3);
                    else alert('Please select or create a chapter first.');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>View Lesson Plan &rsaquo;</Text>
                  <MaterialIcons name="arrow-forward" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

            </View>
          )}

          {/* ════════════════════════════════════════════════
              STEP 3: LESSON PLAN & SLOS
             ════════════════════════════════════════════════ */}
          {currentStep === 3 && activeChapter && (
            <View style={styles.stepContainer}>
              
              {/* Header Card with Progress (Compact) */}
              <View style={styles.step3HeroCard}>
                <View style={styles.step3HeaderRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.step3TagRow}>
                      <View style={[styles.step3BadgePill, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
                        <Text style={[styles.step3BadgeText, { color: '#2563EB' }]}>{selectedClass}</Text>
                      </View>
                      <View style={[styles.step3BadgePill, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                        <Text style={[styles.step3BadgeText, { color: '#059669' }]}>{selectedCourse}</Text>
                      </View>
                      <View style={[styles.step3BadgePill, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
                        <Text style={[styles.step3BadgeText, { color: '#D97706' }]}>{selectedTerm}</Text>
                      </View>
                    </View>
                    <Text style={styles.step3ChapterTitle} numberOfLines={1}>
                      Chapter {activeChapter.chapterNumber}: {activeChapter.title}
                    </Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.changeChapterBtn}
                    onPress={() => setCurrentStep(2)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="swap-horiz" size={14} color="#0052cc" />
                    <Text style={styles.changeChapterBtnText}>Chapters</Text>
                  </TouchableOpacity>
                </View>

                {/* Live Progress Bar */}
                <View style={styles.step3ProgressBox}>
                  <View style={styles.step3ProgressLabels}>
                    <Text style={styles.progressStatusText}>Curriculum Coverage</Text>
                    <Text style={styles.progressPctValue}>{coveredSloCount}/{totalSloCount} Covered ({progressPercent}%)</Text>
                  </View>
                  <View style={styles.step3ProgressBar}>
                    <View style={[styles.step3ProgressFill, { width: `${progressPercent}%` }]} />
                  </View>
                </View>

                {/* Sub Tabs */}
                <View style={styles.subTabsRow}>
                  <TouchableOpacity 
                    style={[styles.subTabButton, step3Tab === 'slos' && styles.subTabButtonActive]}
                    onPress={() => setStep3Tab('slos')}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons 
                      name="checklist" 
                      size={14} 
                      color={step3Tab === 'slos' ? "#FFFFFF" : "#059669"} 
                      style={{ marginRight: 4 }} 
                    />
                    <Text style={[styles.subTabButtonText, step3Tab === 'slos' && styles.subTabButtonTextActive]} numberOfLines={1}>
                      SLOs ({activeChapter.slos.length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.subTabButton, step3Tab === 'planner' && styles.subTabButtonActive]}
                    onPress={() => setStep3Tab('planner')}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons 
                      name="folder-shared" 
                      size={14} 
                      color={step3Tab === 'planner' ? "#FFFFFF" : "#2563EB"} 
                      style={{ marginRight: 4 }} 
                    />
                    <Text style={[styles.subTabButtonText, step3Tab === 'planner' && styles.subTabButtonTextActive]} numberOfLines={1}>
                      Planner ({activeChapter.plannerFiles.length})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ── SUB-TAB 1: SLOS & OBJECTIVES ── */}
              {step3Tab === 'slos' && (
                <View style={styles.cardContainer}>
                  
                  {/* Action Bar */}
                  <View style={styles.cardTitleRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardSectionTitle}>Learning Outcomes</Text>
                      <Text style={styles.cardSubTitle}>Check covered SLOs or add new targets.</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.addSloActionBtn}
                      onPress={() => setAddSloModalVisible(true)}
                      activeOpacity={0.8}
                    >
                      <MaterialIcons name="add" size={14} color="#FFFFFF" />
                      <Text style={styles.addSloActionBtnText}>+ Add SLO</Text>
                    </TouchableOpacity>
                  </View>

                  {/* SLOs List */}
                  {activeChapter.slos.length === 0 ? (
                    <View style={styles.emptyCardBox}>
                      <MaterialIcons name="task" size={28} color="#CBD5E1" />
                      <Text style={styles.emptyCardTitle}>No SLOs Added Yet</Text>
                      <Text style={styles.emptyCardSub}>Click "+ Add SLO" above to define objectives.</Text>
                    </View>
                  ) : (
                    <View style={styles.sloStack}>
                      {activeChapter.slos.map((slo) => {
                        const isDone = slo.completed;
                        return (
                          <View 
                            key={slo.id} 
                            style={[styles.sloCard, isDone && styles.sloCardDone]}
                          >
                            <View style={styles.sloCardHeader}>
                              
                              {/* Checkbox */}
                              <TouchableOpacity 
                                style={styles.sloCheckbox}
                                onPress={() => handleRequestToggleSlo(slo)}
                                activeOpacity={0.7}
                              >
                                <MaterialIcons 
                                  name={isDone ? "check-box" : "check-box-outline-blank"} 
                                  size={20} 
                                  color={isDone ? "#059669" : "#0052cc"} 
                                />
                              </TouchableOpacity>

                              {/* Week & Bloom Badges */}
                              <View style={styles.weekPill}>
                                <Text style={styles.weekPillText}>{slo.week}</Text>
                              </View>

                              <View style={[
                                styles.bloomBadge,
                                slo.bloomTaxonomy === 'Knowledge' && { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' },
                                slo.bloomTaxonomy === 'Understanding' && { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
                                slo.bloomTaxonomy === 'Application' && { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
                              ]}>
                                <Text style={[
                                  styles.bloomBadgeText,
                                  slo.bloomTaxonomy === 'Knowledge' && { color: '#1D4ED8' },
                                  slo.bloomTaxonomy === 'Understanding' && { color: '#047857' },
                                  slo.bloomTaxonomy === 'Application' && { color: '#B45309' },
                                ]}>
                                  {slo.bloomTaxonomy}
                                </Text>
                              </View>

                              <View style={{ flex: 1 }} />

                              {/* Actions */}
                              <TouchableOpacity 
                                onPress={() => showToast(`Editing ${slo.title}`)}
                                style={styles.iconAction}
                              >
                                <MaterialIcons name="edit" size={13} color="#64748B" />
                              </TouchableOpacity>

                              <TouchableOpacity 
                                onPress={() => handleDeleteSlo(slo.id, slo.title)}
                                style={styles.iconAction}
                              >
                                <MaterialIcons name="delete-outline" size={15} color="#EF4444" />
                              </TouchableOpacity>
                            </View>

                            {/* SLO Title & Objective */}
                            <Text style={[styles.sloTitle, isDone && styles.sloTitleDone]}>
                              {slo.title}
                            </Text>
                            <Text style={[styles.sloObjective, isDone && styles.sloObjectiveDone]}>
                              {slo.objective}
                            </Text>

                            {/* Date Range Meta */}
                            <View style={styles.sloDateRow}>
                              <MaterialIcons name="event" size={11} color="#94A3B8" />
                              <Text style={styles.sloDateText}>
                                {slo.month} &bull; {slo.startDate.split(' ')[0]} &rarr; {slo.endDate.split(' ')[0]}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {/* ── SUB-TAB 2: PLANNER & FILES ── */}
              {step3Tab === 'planner' && (
                <View style={styles.cardContainer}>
                  
                  <Text style={styles.cardSectionTitle}>Uploaded Materials</Text>
                  <Text style={styles.cardSubTitle}>Syllabus handouts and worksheets.</Text>

                  {/* Uploaded Files Stack with Thematic Badges */}
                  {activeChapter.plannerFiles.length === 0 ? (
                    <View style={styles.emptyCardBox}>
                      <MaterialIcons name="upload-file" size={28} color="#CBD5E1" />
                      <Text style={styles.emptyCardTitle}>No Files Uploaded</Text>
                      <Text style={styles.emptyCardSub}>Upload a PDF, PowerPoint, or link below.</Text>
                    </View>
                  ) : (
                    <View style={styles.filesStack}>
                      {activeChapter.plannerFiles.map(file => {
                        const isPdf = file.contentType.toLowerCase().includes('pdf');
                        const isPpt = file.contentType.toLowerCase().includes('power') || file.contentType.toLowerCase().includes('ppt');
                        const fColor = isPdf ? '#DC2626' : isPpt ? '#EA580C' : '#2563EB';
                        const fBg = isPdf ? '#FEF2F2' : isPpt ? '#FFF7ED' : '#EFF6FF';
                        const fBorder = isPdf ? '#FECACA' : isPpt ? '#FED7AA' : '#DBEAFE';
                        const fIcon: any = isPdf ? 'picture-as-pdf' : isPpt ? 'slideshow' : 'link';

                        return (
                          <View key={file.id} style={styles.fileItemRow}>
                            <View style={[styles.fileBadge, { backgroundColor: fBg, borderColor: fBorder }]}>
                              <MaterialIcons name={fIcon} size={12} color={fColor} style={{ marginRight: 3 }} />
                              <Text style={[styles.fileBadgeText, { color: fColor }]}>{file.contentType}</Text>
                            </View>
                            
                            <View style={{ flex: 1, marginHorizontal: 7 }}>
                              <Text style={styles.fileItemTitle} numberOfLines={1}>{file.title}</Text>
                              <Text style={styles.fileItemMeta}>Uploaded {file.uploadedAt}</Text>
                            </View>

                            <TouchableOpacity 
                              onPress={() => showToast(`Opening ${file.title}`)}
                              style={styles.openFileBtn}
                            >
                              <Text style={styles.openFileBtnText}>Open</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                              onPress={() => handleDeletePlannerFile(file.id)}
                              style={styles.deleteFileBtn}
                            >
                              <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* Add Planner Form */}
                  <View style={styles.addPlannerBox}>
                    <Text style={styles.formSectionHeader}>+ Upload Document</Text>
                    
                    <View style={styles.plannerInputsRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.inputLabel}>TYPE <Text style={styles.reqStar}>*</Text></Text>
                        <TouchableOpacity 
                          style={styles.formDropdown}
                          onPress={() => setPickerModalType('contentType')}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.formDropdownText, !plannerContentType && { color: '#94A3B8' }]}>
                            {plannerContentType || '-- Select --'}
                          </Text>
                          <MaterialIcons name="arrow-drop-down" size={16} color="#64748B" />
                        </TouchableOpacity>
                      </View>

                      <View style={{ flex: 1.4 }}>
                        <Text style={styles.inputLabel}>TITLE <Text style={styles.reqStar}>*</Text></Text>
                        <TextInput
                          style={styles.formTextInput}
                          placeholder="e.g. Lesson Handout"
                          placeholderTextColor="#94A3B8"
                          value={plannerTitle}
                          onChangeText={setPlannerTitle}
                        />
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={styles.uploadPlannerBtn}
                      onPress={handleAddPlanner}
                      disabled={uploadingPlannerLoading}
                      activeOpacity={0.8}
                    >
                      {uploadingPlannerLoading ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <ActivityIndicator size="small" color="#FFFFFF" />
                          <Text style={styles.uploadPlannerBtnText}>Uploading...</Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                          <MaterialIcons name="cloud-upload" size={14} color="#FFFFFF" />
                          <Text style={styles.uploadPlannerBtnText}>Add Document</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                </View>
              )}

              {/* Bottom Step Navigation */}
              <View style={styles.stepNavigationRow}>
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => setCurrentStep(2)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="arrow-back" size={14} color="#0052cc" />
                  <Text style={styles.secondaryButtonText}>Back to Chapters</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => {
                    showToast('Lesson plan saved successfully!');
                    navigation.goBack();
                  }}
                  activeOpacity={0.85}
                >
                  <MaterialIcons name="done-all" size={14} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Done & Save</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}

        </ScrollView>

        {/* ════════════════════════════════════════════════
            CONFIRMATION DIALOG MODAL (Alert)
           ════════════════════════════════════════════════ */}
        <ViewportModal
          visible={confirmSloModalVisible}
          onClose={() => setConfirmSloModalVisible(false)}
        >
          <View style={styles.alertModalCard}>
            <View style={styles.alertHeaderRow}>
              <View style={styles.alertIconCircle}>
                <MaterialIcons name="help-outline" size={16} color="#0052cc" />
              </View>
              <Text style={styles.alertDomainTitle}>Curriculum Alert</Text>
            </View>

            <Text style={styles.alertQuestionText}>
              {pendingSloToToggle?.completed 
                ? 'Unmark this SLO as covered?' 
                : 'Mark this SLO as covered?'}
            </Text>

            <View style={styles.alertButtonsRow}>
              <TouchableOpacity 
                style={styles.alertOkBtn}
                onPress={handleConfirmToggleSlo}
                activeOpacity={0.8}
              >
                <Text style={styles.alertOkBtnText}>OK</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.alertCancelBtn}
                onPress={() => setConfirmSloModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.alertCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ViewportModal>

        {/* ════════════════════════════════════════════════
            ADD SLO MODAL (Full Specs & Date Pickers)
           ════════════════════════════════════════════════ */}
        <ViewportModal
          visible={addSloModalVisible}
          onClose={() => setAddSloModalVisible(false)}
        >
          <View style={styles.addSloModalContainer}>
            <View style={styles.addSloModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.addSloModalTitle}>Add New SLO</Text>
                <Text style={styles.addSloModalSubtitle}>{activeChapter?.title || 'Active Chapter'}</Text>
              </View>
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setAddSloModalVisible(false)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="close" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollArea} showsVerticalScrollIndicator={false}>
              
              {/* SLO Standard / Title */}
              <Text style={styles.inputLabel}>SLO'S STANDARD / TITLE <Text style={styles.reqStar}>*</Text></Text>
              <TextInput
                style={styles.formTextInput}
                placeholder="e.g. Describe plant cell functions"
                placeholderTextColor="#94A3B8"
                value={sloTitle}
                onChangeText={setSloTitle}
              />

              {/* Month Dropdown */}
              <Text style={styles.inputLabel}>SELECT MONTH</Text>
              <TouchableOpacity 
                style={styles.formDropdown}
                onPress={() => setPickerModalType('month')}
                activeOpacity={0.7}
              >
                <Text style={styles.formDropdownText}>{sloMonth}</Text>
                <MaterialIcons name="arrow-drop-down" size={16} color="#64748B" />
              </TouchableOpacity>

              {/* Pedagogical Objective */}
              <Text style={styles.inputLabel}>PEDAGOGICAL OBJECTIVE</Text>
              <TextInput
                style={[styles.formTextInput, { height: 62, textAlignVertical: 'top' }]}
                placeholder="Detailed learning target..."
                placeholderTextColor="#94A3B8"
                multiline={true}
                value={sloObjective}
                onChangeText={setSloObjective}
              />

              {/* Date & End Date Row */}
              <View style={styles.datePickerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>DATE <Text style={styles.reqStar}>*</Text></Text>
                  <TouchableOpacity 
                    style={styles.datePickerButton}
                    onPress={() => setDatePickerTarget('startDate')}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="calendar-today" size={13} color="#0052cc" />
                    <Text style={styles.datePickerButtonText}>{sloStartDate}</Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>END DATE <Text style={styles.reqStar}>*</Text></Text>
                  <TouchableOpacity 
                    style={styles.datePickerButton}
                    onPress={() => setDatePickerTarget('endDate')}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="event" size={13} color="#0052cc" />
                    <Text style={styles.datePickerButtonText}>{sloEndDate}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Week Selector */}
              <Text style={styles.inputLabel}>WEEK (W1 - W5)</Text>
              <TouchableOpacity 
                style={styles.formDropdown}
                onPress={() => setPickerModalType('week')}
                activeOpacity={0.7}
              >
                <Text style={styles.formDropdownText}>{sloWeek}</Text>
                <MaterialIcons name="arrow-drop-down" size={16} color="#64748B" />
              </TouchableOpacity>

              {/* Bloom's Taxonomy Selector */}
              <Text style={styles.inputLabel}>BLOOM'S TAXONOMY <Text style={styles.reqStar}>*</Text></Text>
              <View style={styles.bloomOptionsRow}>
                {bloomOptions.map((opt) => {
                  const isSelected = sloBloom === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.bloomOptionBtn, isSelected && styles.bloomOptionBtnActive]}
                      onPress={() => setSloBloom(opt)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.bloomOptionBtnText, isSelected && styles.bloomOptionBtnTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.saveSloButton}
                onPress={handleSaveSlo}
                disabled={savingSloLoading}
                activeOpacity={0.8}
              >
                {savingSloLoading ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.saveSloButtonText}>Saving SLO...</Text>
                  </View>
                ) : (
                  <Text style={styles.saveSloButtonText}>Save SLO's</Text>
                )}
              </TouchableOpacity>

            </ScrollView>
          </View>
        </ViewportModal>

        {/* ════════════════════════════════════════════════
            GENERIC PICKER MODAL (Dropdown Selects)
           ════════════════════════════════════════════════ */}
        <ViewportModal
          visible={pickerModalType !== null}
          onClose={() => setPickerModalType(null)}
        >
          <View style={styles.pickerModalCard}>
            <Text style={styles.pickerModalTitle}>
              {pickerModalType === 'month' && 'Select Month'}
              {pickerModalType === 'week' && 'Select Week'}
              {pickerModalType === 'bloom' && "Select Bloom's Taxonomy"}
              {pickerModalType === 'contentType' && 'Select Content Type'}
            </Text>

            <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
              {pickerModalType === 'month' && monthOptions.map(m => (
                <TouchableOpacity 
                  key={m} 
                  style={styles.pickerItem} 
                  onPress={() => { setSloMonth(m); setPickerModalType(null); }}
                >
                  <Text style={[styles.pickerItemText, sloMonth === m && styles.pickerItemTextActive]}>{m}</Text>
                  {sloMonth === m && <MaterialIcons name="check" size={14} color="#0052cc" />}
                </TouchableOpacity>
              ))}

              {pickerModalType === 'week' && weekOptions.map(w => (
                <TouchableOpacity 
                  key={w} 
                  style={styles.pickerItem} 
                  onPress={() => { setSloWeek(w); setPickerModalType(null); }}
                >
                  <Text style={[styles.pickerItemText, sloWeek === w && styles.pickerItemTextActive]}>{w}</Text>
                  {sloWeek === w && <MaterialIcons name="check" size={14} color="#0052cc" />}
                </TouchableOpacity>
              ))}

              {pickerModalType === 'bloom' && bloomOptions.map(b => (
                <TouchableOpacity 
                  key={b} 
                  style={styles.pickerItem} 
                  onPress={() => { setSloBloom(b); setPickerModalType(null); }}
                >
                  <Text style={[styles.pickerItemText, sloBloom === b && styles.pickerItemTextActive]}>{b}</Text>
                  {sloBloom === b && <MaterialIcons name="check" size={14} color="#0052cc" />}
                </TouchableOpacity>
              ))}

              {pickerModalType === 'contentType' && contentTypeOptions.map(ct => (
                <TouchableOpacity 
                  key={ct} 
                  style={styles.pickerItem} 
                  onPress={() => { setPlannerContentType(ct as any); setPickerModalType(null); }}
                >
                  <Text style={[styles.pickerItemText, plannerContentType === ct && styles.pickerItemTextActive]}>{ct}</Text>
                  {plannerContentType === ct && <MaterialIcons name="check" size={14} color="#0052cc" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ViewportModal>

        {/* ════════════════════════════════════════════════
            PREMIUM DATE TIME PICKER INTEGRATION
           ════════════════════════════════════════════════ */}
        <PremiumDateTimePicker
          visible={datePickerTarget !== null}
          mode="date"
          value={datePickerTarget === 'startDate' ? sloStartDate : sloEndDate}
          title={datePickerTarget === 'startDate' ? 'Select Start Date' : 'Select End Date'}
          onSelect={(dateStr: string) => {
            if (datePickerTarget === 'startDate') setSloStartDate(dateStr);
            else if (datePickerTarget === 'endDate') setSloEndDate(dateStr);
            setDatePickerTarget(null);
          }}
          onClose={() => setDatePickerTarget(null)}
        />

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
    backgroundColor: 'transparent',
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },

  // ── APP BAR HEADER ──
  appBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  spCircleBadge: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: '#0052cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spCircleText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0D1B3E',
    letterSpacing: -0.2,
  },
  appBarStepPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  appBarStepPillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0052cc',
  },

  // Toast
  toastBanner: {
    position: 'absolute',
    top: 54,
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  toastText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 30,
  },

  // ── HERO BANNER & SLIM STEPPER ──
  heroBanner: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 8,
  },
  stepperContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 8,
    padding: 2.5,
    marginBottom: 5,
    gap: 3,
  },
  stepSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4.5,
    paddingHorizontal: 3,
    borderRadius: 6,
    gap: 4,
  },
  stepSegmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepSegmentDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSegmentDotActive: {
    backgroundColor: '#0052cc',
  },
  stepSegmentDotDone: {
    backgroundColor: '#059669',
  },
  stepSegmentDotText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  stepSegmentDotTextActive: {
    color: '#FFFFFF',
  },
  stepSegmentText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  stepSegmentTextActive: {
    color: '#0D1B3E',
    fontWeight: '800',
  },

  heroBreadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroSummaryPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroSummaryText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 1,
  },

  // ── STEP CONTAINERS ──
  stepContainer: {
    paddingHorizontal: 10,
    gap: 8,
  },
  stepHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0D1B3E',
  },
  stepDesc: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 0.5,
  },
  stepBackMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  stepBackMiniBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0052cc',
  },

  // Card Container Shell
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardSectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0D1B3E',
  },
  cardSubTitle: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 0.5,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  countBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0052cc',
  },

  // 1. Classes List
  classListRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  classChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  classChipActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  classChipText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  classChipTextActive: {
    color: '#FFFFFF',
  },
  activeDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: '#34D399',
    marginLeft: 4,
  },

  // Loader Box
  loaderBox: {
    paddingVertical: 12,
    alignItems: 'center',
    gap: 5,
  },
  loaderText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },

  // 2. Courses Grid
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  courseGridCard: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 7,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    position: 'relative',
    minHeight: 58,
    justifyContent: 'center',
  },
  courseGridCardActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  courseIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  courseGridTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0D1B3E',
    lineHeight: 13,
  },
  selectedBadgeCorner: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Action Buttons
  primaryActionButton: {
    backgroundColor: '#0052cc',
    borderRadius: 10,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionButtonText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── STEP 2: TERMS & CHAPTERS ──
  termsRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
  termButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 6.5,
    paddingHorizontal: 6,
    borderWidth: 1.2,
  },
  termButtonActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  termButtonText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  termButtonTextActive: {
    color: '#FFFFFF',
  },
  termCountPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 5,
    marginLeft: 4,
  },
  termCountPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  termCountPillText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  termCountPillTextActive: {
    color: '#FFFFFF',
  },

  addChapterToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 5,
    gap: 2,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  addChapterToggleBtnText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0052cc',
  },

  // Add Chapter Collapsible Form
  addChapterFormCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 8,
  },
  formSectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D1B3E',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 2.5,
    marginTop: 4,
  },
  reqStar: {
    color: '#EF4444',
  },
  subNote: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '500',
  },
  formTextInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 7,
    paddingHorizontal: 7,
    height: 32,
    fontSize: 11,
    color: '#0D1B3E',
  },
  termsCheckboxRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 2,
    marginBottom: 6,
  },
  checkboxChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 3,
  },
  checkboxChipActive: {
    borderColor: '#0052cc',
    backgroundColor: '#EFF6FF',
  },
  checkboxChipText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  checkboxChipTextActive: {
    color: '#0052cc',
    fontWeight: '800',
  },
  saveChapterButton: {
    backgroundColor: '#0052cc',
    borderRadius: 7,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveChapterButtonText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Chapter List Items
  chaptersStack: {
    gap: 5,
  },
  chapterListItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 7,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  chapterListItemActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0052cc',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  chapterItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chapterNumberBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
  },
  chapterNumberBadgeActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  chapterNumberBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  chapterNumberBadgeTextActive: {
    color: '#FFFFFF',
  },
  chapterItemTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D1B3E',
  },
  chapterItemTitleActive: {
    color: '#0052cc',
  },
  chapterItemMeta: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 0.5,
  },
  deleteChapterIconBtn: {
    padding: 2,
  },
  chapterProgressTrack: {
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  chapterProgressFill: {
    height: '100%',
    borderRadius: 1.5,
  },

  // Step Navigation Buttons
  stepNavigationRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 3,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    height: 36,
    gap: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  secondaryButtonText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0052cc',
  },
  primaryButton: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0052cc',
    borderRadius: 8,
    height: 36,
    gap: 4,
  },
  primaryButtonText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── STEP 3: LESSON PLAN & SLOS ──
  step3HeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  step3HeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  step3TagRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 2,
  },
  step3BadgePill: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  step3BadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  step3ChapterTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0D1B3E',
  },
  changeChapterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 5,
    gap: 2,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  changeChapterBtnText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#0052cc',
  },

  step3ProgressBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  step3ProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressStatusText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  progressPctValue: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0052cc',
  },
  step3ProgressBar: {
    height: 3.5,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  step3ProgressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 2,
  },

  subTabsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  subTabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 7,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subTabButtonActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  subTabButtonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D1B3E',
  },
  subTabButtonTextActive: {
    color: '#FFFFFF',
  },

  // SLO Action Header
  addSloActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052cc',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 5,
    gap: 2.5,
  },
  addSloActionBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // SLO Cards Stack
  sloStack: {
    gap: 6,
  },
  sloCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
  },
  sloCardDone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  sloCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  sloCheckbox: {
    padding: 1,
  },
  weekPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  weekPillText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#0052cc',
  },
  bloomBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  bloomBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  iconAction: {
    padding: 2,
  },
  sloTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D1B3E',
    marginBottom: 1.5,
  },
  sloTitleDone: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  sloObjective: {
    fontSize: 9.5,
    color: '#475569',
    lineHeight: 13,
    marginBottom: 4,
  },
  sloObjectiveDone: {
    color: '#94A3B8',
  },
  sloDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  sloDateText: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '500',
  },

  // Empty Card Shell
  emptyCardBox: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyCardTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0D1B3E',
  },
  emptyCardSub: {
    fontSize: 9.5,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 200,
  },

  // Planner Files
  filesStack: {
    gap: 5,
    marginBottom: 8,
  },
  fileItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 7,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
  },
  fileBadgeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  fileItemTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#0D1B3E',
  },
  fileItemMeta: {
    fontSize: 9,
    color: '#64748B',
  },
  openFileBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 4,
    marginRight: 3,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  openFileBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0052cc',
  },
  deleteFileBtn: {
    padding: 2,
  },

  addPlannerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  plannerInputsRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 6,
  },
  formDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 7,
    paddingHorizontal: 7,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  formDropdownText: {
    fontSize: 10,
    color: '#0D1B3E',
    fontWeight: '600',
  },
  uploadPlannerBtn: {
    backgroundColor: '#0052cc',
    borderRadius: 7,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPlannerBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // ── MODALS (Viewport & Alert) ──
  webModalOverlay: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },

  // Alert Dialog
  alertModalCard: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  alertIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertDomainTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0D1B3E',
  },
  alertQuestionText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 15,
    marginBottom: 12,
    fontWeight: '600',
  },
  alertButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 5,
  },
  alertOkBtn: {
    backgroundColor: '#0052cc',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
  },
  alertOkBtnText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  alertCancelBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  alertCancelBtnText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
  },

  // Add SLO Modal Card
  addSloModalContainer: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  addSloModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
  },
  addSloModalTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0D1B3E',
  },
  addSloModalSubtitle: {
    fontSize: 9.5,
    color: '#64748B',
    fontWeight: '600',
  },
  modalCloseBtn: {
    padding: 2,
  },
  modalScrollArea: {
    flexGrow: 0,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: 5,
  },
  datePickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 7,
    paddingHorizontal: 7,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  datePickerButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D1B3E',
  },
  bloomOptionsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
  },
  bloomOptionBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 5,
    paddingVertical: 5,
    alignItems: 'center',
  },
  bloomOptionBtnActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  bloomOptionBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  bloomOptionBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  saveSloButton: {
    backgroundColor: '#0052cc',
    borderRadius: 8,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  saveSloButtonText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Picker Modal
  pickerModalCard: {
    width: '100%',
    maxWidth: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  pickerModalTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0D1B3E',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 4,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerItemText: {
    fontSize: 10.5,
    color: '#334155',
    fontWeight: '600',
  },
  pickerItemTextActive: {
    color: '#0052cc',
    fontWeight: '800',
  },
});
