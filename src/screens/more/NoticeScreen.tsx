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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

interface StudentItem {
  id: string;
  name: string;
  rollNo: string;
  grade: string;
  section: string;
  parentName: string;
  avatarColor: string;
}

interface NoticeItem {
  id: string;
  title: string;
  category: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  targetGrade: string;
  targetSection: string;
  recipientCount: number;
  date: string;
  content: string;
  attachmentName?: string;
  attachmentType?: 'pdf' | 'image' | 'link';
  attachmentSize?: string;
  deliveryRate: string;
  readRate: string;
}

const GRADE_OPTIONS = [
  { label: 'All Classes (Whole School)', value: 'All Classes', icon: 'domain' },
  { label: 'GRADE-II', value: 'GRADE-II', icon: 'school' },
  { label: 'GRADE-V', value: 'GRADE-V', icon: 'school' },
  { label: 'GRADE-IX', value: 'GRADE-IX', icon: 'school' },
  { label: 'HHSQ (Senior Secondary)', value: 'HHSQ', icon: 'school' },
];

const SECTIONS_LIST = ['Section A', 'Section B', 'Section C', 'Section D'];

const CATEGORY_OPTIONS = [
  { label: 'General Notice', value: 'General Notice', icon: 'campaign', color: '#ea580c' },
  { label: 'Urgent Alert', value: 'Urgent Alert', icon: 'warning', color: '#e11d48' },
  { label: 'Holiday Announcement', value: 'Holiday Announcement', icon: 'event-available', color: '#059669' },
  { label: 'Exam Circular', value: 'Exam Circular', icon: 'assignment', color: '#0052cc' },
  { label: 'Fee Reminder', value: 'Fee Reminder', icon: 'account-balance-wallet', color: '#d97706' },
  { label: 'School Event / Meeting', value: 'School Event / Meeting', icon: 'celebration', color: '#7c3aed' },
];

const SAMPLE_STUDENTS: StudentItem[] = [
  { id: 'st-1', name: 'Ahmed Raza', rollNo: 'Roll #101', grade: 'GRADE-V', section: 'A', parentName: 'Father: Raza Ali', avatarColor: '#0052cc' },
  { id: 'st-2', name: 'Fatima Khan', rollNo: 'Roll #102', grade: 'GRADE-V', section: 'A', parentName: 'Father: Tariq Khan', avatarColor: '#ea580c' },
  { id: 'st-3', name: 'Zayan Malik', rollNo: 'Roll #103', grade: 'GRADE-V', section: 'A', parentName: 'Father: Kamran Malik', avatarColor: '#059669' },
  { id: 'st-4', name: 'Ayesha Siddiqui', rollNo: 'Roll #104', grade: 'GRADE-V', section: 'A', parentName: 'Father: Farhan Siddiqui', avatarColor: '#d97706' },
  { id: 'st-5', name: 'Muhammad Bilal', rollNo: 'Roll #105', grade: 'GRADE-V', section: 'B', parentName: 'Father: Bilal Ahmed', avatarColor: '#e11d48' },
  { id: 'st-6', name: 'Hania Amir', rollNo: 'Roll #106', grade: 'GRADE-V', section: 'B', parentName: 'Father: Amir Sohail', avatarColor: '#06b6d4' },
  { id: 'st-7', name: 'Hamza Farooq', rollNo: 'Roll #107', grade: 'GRADE-II', section: 'A', parentName: 'Father: Farooq Azam', avatarColor: '#8b5cf6' },
  { id: 'st-8', name: 'Zoya Noor', rollNo: 'Roll #108', grade: 'GRADE-II', section: 'A', parentName: 'Father: Noor Alam', avatarColor: '#10b981' },
  { id: 'st-9', name: 'Daniyal Qureshi', rollNo: 'Roll #109', grade: 'GRADE-IX', section: 'A', parentName: 'Father: Qureshi Sahib', avatarColor: '#f59e0b' },
  { id: 'st-10', name: 'Eshaal Fatima', rollNo: 'Roll #110', grade: 'GRADE-IX', section: 'A', parentName: 'Father: Mansoor Ali', avatarColor: '#ec4899' },
];

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 'n-1',
    title: 'Mid-Term Exam Datesheet & Time Table',
    category: 'Exam Circular',
    priority: 'Urgent',
    targetGrade: 'All Classes',
    targetSection: 'All Sections',
    recipientCount: 240,
    date: 'Today, 09:30 AM',
    content: 'Dear Parents and Students, The Mid-Term Examinations will begin from next Monday. Please download the attached timetable and make sure students arrive on time in full uniform.',
    attachmentName: 'MidTerm_Datesheet_2026.pdf',
    attachmentType: 'pdf',
    attachmentSize: '1.2 MB',
    deliveryRate: '100%',
    readRate: '92%',
  },
  {
    id: 'n-2',
    title: 'Eid-ul-Fitr Holidays Announcement',
    category: 'Holiday Announcement',
    priority: 'Important',
    targetGrade: 'All Classes',
    targetSection: 'All Sections',
    recipientCount: 380,
    date: '02 Sep 2026',
    content: 'School campus will remain closed on Friday and Saturday on account of Eid holidays. Classes will resume as normal on Monday morning.',
    attachmentName: 'Eid_Holiday_Circular.pdf',
    attachmentType: 'pdf',
    attachmentSize: '850 KB',
    deliveryRate: '100%',
    readRate: '98%',
  },
  {
    id: 'n-3',
    title: 'Monthly Fee Submission Reminder',
    category: 'Fee Reminder',
    priority: 'Normal',
    targetGrade: 'GRADE-V',
    targetSection: 'All Sections',
    recipientCount: 56,
    date: '28 Aug 2026',
    content: 'Respected Parents, Kindly submit the pending tuition fee for the current month by the 10th of this month to avoid late fee surcharge.',
    deliveryRate: '98%',
    readRate: '86%',
  }
];

export const NoticeScreen = ({ navigation }: any) => {
  const { theme: appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';

  // Active Screen Tab: 'compose' or 'history'
  const [activeTab, setActiveTab] = useState<'compose' | 'history'>('compose');

  // Step 1: Dropdown Selection & Recipients
  const [selectedGrade, setSelectedGrade] = useState<string>('GRADE-V');
  const [selectedSections, setSelectedSections] = useState<string[]>(['Section A', 'Section B', 'Section C', 'Section D']);
  const [sendToAllInClass, setSendToAllInClass] = useState<boolean>(true);
  const [selectedStudents, setSelectedStudents] = useState<string[]>(['st-1', 'st-2', 'st-3', 'st-4', 'st-5', 'st-6']);
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Dropdown Accordion States (Matching ActivityScreen.tsx)
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Step 2: Notice Details
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState('General Notice');
  const [noticePriority] = useState<'Normal' | 'Important' | 'Urgent'>('Normal');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [publishDate, setPublishDate] = useState('Today, 10:00 AM');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  // Step 3: Attachments
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: 'pdf' | 'image' } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Sending State & Feedback
  const [isSending, setIsSending] = useState(false);
  const [sendStepText, setSendStepText] = useState('');
  const [successToast, setSuccessToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  // History & Preview
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [selectedNoticePreview, setSelectedNoticePreview] = useState<NoticeItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter students for picker
  const filteredStudents = SAMPLE_STUDENTS.filter(st => {
    const matchesGrade = selectedGrade === 'All Classes' || st.grade === selectedGrade;
    const sectionLetters = selectedSections.map(s => s.replace('Section ', '').trim());
    const matchesSection = selectedSections.length === 0 || sectionLetters.includes(st.section);
    const matchesSearch = st.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || st.rollNo.toLowerCase().includes(studentSearchQuery.toLowerCase());
    return matchesGrade && matchesSection && matchesSearch;
  });

  const handleToggleStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(s => s !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleSelectAllStudents = () => {
    const ids = filteredStudents.map(s => s.id);
    const allSelected = ids.every(id => selectedStudents.includes(id));
    if (allSelected) {
      setSelectedStudents(selectedStudents.filter(id => !ids.includes(id)));
    } else {
      setSelectedStudents(Array.from(new Set([...selectedStudents, ...ids])));
    }
  };

  // Mock File Attach
  const handleAttachFile = (type: 'pdf' | 'image') => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      if (type === 'pdf') {
        setAttachedFile({ name: 'School_Circular_Document.pdf', size: '1.2 MB', type: 'pdf' });
      } else {
        setAttachedFile({ name: 'Notice_Photo_Flyer.jpg', size: '2.4 MB', type: 'image' });
      }
    }, 600);
  };

  // Send Notice
  const handleSendNotice = () => {
    if (!noticeTitle.trim()) {
      alert('Please write the Notice Title.');
      return;
    }
    if (!noticeMessage.trim()) {
      alert('Please write your Notice Message.');
      return;
    }
    if (selectedSections.length === 0) {
      alert('Please select at least one Section.');
      return;
    }

    setIsSending(true);
    setSendStepText('Preparing notice for Parents & Students...');

    setTimeout(() => {
      setSendStepText(`Sending instant alert to ${sendToAllInClass ? 'All Students & Parents' : `${selectedStudents.length} selected students`}...`);
    }, 700);

    setTimeout(() => {
      setSendStepText('Notice delivered successfully!');
    }, 1400);

    setTimeout(() => {
      setIsSending(false);

      const count = sendToAllInClass ? (selectedGrade === 'All Classes' ? 240 : 48) : selectedStudents.length;
      const sectionText = selectedSections.length === SECTIONS_LIST.length 
        ? 'All Sections' 
        : selectedSections.map(s => s.replace('Section ', 'Sec ')).join(', ');

      const newNotice: NoticeItem = {
        id: `n-${Date.now()}`,
        title: noticeTitle,
        category: noticeCategory,
        priority: noticePriority,
        targetGrade: selectedGrade,
        targetSection: sectionText,
        recipientCount: count,
        date: 'Just now',
        content: noticeMessage,
        attachmentName: attachedFile?.name,
        attachmentType: attachedFile?.type,
        attachmentSize: attachedFile?.size,
        deliveryRate: '100%',
        readRate: '10%',
      };

      setNotices([newNotice, ...notices]);
      setNoticeTitle('');
      setNoticeMessage('');
      setAttachedFile(null);
      setActiveTab('history');

      setSuccessToast({
        visible: true,
        message: `Notice sent to ${count} Parents & Students!`
      });
      setTimeout(() => {
        setSuccessToast({ visible: false, message: '' });
      }, 3500);
    }, 1900);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter(n => n.id !== id));
    setDeleteId(null);
    if (selectedNoticePreview?.id === id) {
      setSelectedNoticePreview(null);
    }
  };

  const getCatColor = (cat: string) => {
    if (cat.includes('Urgent')) return '#e11d48';
    if (cat.includes('Holiday')) return '#059669';
    if (cat.includes('Exam')) return '#0052cc';
    if (cat.includes('Fee')) return '#d97706';
    if (cat.includes('Event')) return '#7c3aed';
    return '#ea580c';
  };

  const getGradeDisplayLabel = () => {
    const found = GRADE_OPTIONS.find(g => g.value === selectedGrade);
    return found ? found.label : selectedGrade;
  };

  return (
    <View style={[styles.container, !isDefaultTheme && { backgroundColor: appTheme.bg }]}>
      <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: 'transparent' }]} edges={['top']}>
        
        {/* ─── Top Header Bar ─── */}
        <View style={[styles.header, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderBottomColor: appTheme.border }]}>
          <TouchableOpacity 
            style={[styles.backButton, !isDefaultTheme && { backgroundColor: appTheme.surface }]} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back-ios" size={18} color={isDefaultTheme ? "#0f172a" : appTheme.textPrimary} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.headerTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Notice Board</Text>
            <Text style={[styles.headerSubtitle, !isDefaultTheme && { color: appTheme.textSecondary }]}>Send Circulars & Alerts to Parents & Students</Text>
          </View>
        </View>

        {/* ─── Simple 2-Tab Navigation ─── */}
        <View style={[styles.tabBar, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'compose' && styles.tabItemActive]}
            onPress={() => setActiveTab('compose')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="campaign"
              size={20}
              color={activeTab === 'compose' ? '#ffffff' : '#64748b'}
            />
            <Text style={[styles.tabItemText, activeTab === 'compose' && styles.tabItemTextActive]}>
              Write Notice
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'history' && styles.tabItemActive]}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name="history"
              size={20}
              color={activeTab === 'history' ? '#ffffff' : '#64748b'}
            />
            <Text style={[styles.tabItemText, activeTab === 'history' && styles.tabItemTextActive]}>
              Sent Notices ({notices.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Main Content Scroll ─── */}
        <ScrollView 
          style={styles.scroll} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'compose' ? (
            /* ═══════════════ WRITE NOTICE TAB ═══════════════ */
            <View style={styles.composeContainer}>

              {/* STEP 1 CARD: Select Class & Section (Activity Style Multi-Select Dropdowns) */}
              <View style={styles.formCard}>
                <View style={styles.formCardHeaderRow}>
                  <View style={[styles.formHeaderIconBox, { backgroundColor: '#FFEDD5' }]}>
                    <MaterialIcons name="school" size={18} color="#ea580c" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.formCardHeader}>Target Class & Section</Text>
                    <Text style={styles.formCardSub}>Select recipients for this notice</Text>
                  </View>
                </View>

                {/* Dropdown Class */}
                <View style={styles.formField}>
                  <View style={styles.labelRow}>
                    <Text style={styles.formLabel}>Target Class / Grade</Text>
                    <Text style={styles.requiredStar}>*</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.formSelectBox, showClassDropdown && styles.formSelectBoxActive]}
                    onPress={() => {
                      setShowClassDropdown(!showClassDropdown);
                      setShowSectionDropdown(false);
                      setShowCategoryDropdown(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.selectTextRow}>
                      <MaterialIcons name="groups" size={18} color="#ea580c" style={{ marginRight: 10 }} />
                      <Text style={styles.formSelectText}>
                        {getGradeDisplayLabel()}
                      </Text>
                    </View>
                    <MaterialIcons 
                      name={showClassDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={22} 
                      color="#ea580c" 
                    />
                  </TouchableOpacity>

                  {showClassDropdown && (
                    <View style={styles.formDropdownOptions}>
                      {GRADE_OPTIONS.map(c => {
                        const isSelected = selectedGrade === c.value;
                        return (
                          <TouchableOpacity 
                            key={c.value} 
                            style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                            onPress={() => {
                              setSelectedGrade(c.value);
                              setShowClassDropdown(false);
                            }}
                            activeOpacity={0.7}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                              <MaterialIcons name={c.icon as any} size={18} color={isSelected ? '#ea580c' : '#64748b'} />
                              <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>
                                {c.label}
                              </Text>
                            </View>
                            {isSelected && <MaterialIcons name="check" size={18} color="#ea580c" />}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                {/* Dropdown Section (Multi-Select matching ActivityScreen.tsx) */}
                <View style={styles.formField}>
                  <View style={styles.labelRow}>
                    <Text style={styles.formLabel}>Target Section(s)</Text>
                    <Text style={styles.requiredStar}>*</Text>
                    {selectedSections.length > 0 && (
                      <Text style={{ fontSize: 11, color: '#ea580c', fontWeight: '800', marginLeft: 'auto' }}>
                        {selectedSections.length === SECTIONS_LIST.length ? 'All Selected' : `${selectedSections.length} Selected`}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity 
                    style={[styles.formSelectBox, showSectionDropdown && styles.formSelectBoxActive]}
                    onPress={() => {
                      setShowSectionDropdown(!showSectionDropdown);
                      setShowClassDropdown(false);
                      setShowCategoryDropdown(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.selectTextRow}>
                      <MaterialIcons name="grid-view" size={18} color="#ea580c" style={{ marginRight: 10 }} />
                      <Text style={[styles.formSelectText, selectedSections.length === 0 && styles.formSelectPlaceholder]} numberOfLines={1}>
                        {selectedSections.length === SECTIONS_LIST.length 
                          ? 'All Sections (A, B, C, D)'
                          : selectedSections.length > 0 
                          ? selectedSections.join(', ')
                          : 'Select section(s)...'}
                      </Text>
                    </View>
                    <MaterialIcons 
                      name={showSectionDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={22} 
                      color="#ea580c" 
                    />
                  </TouchableOpacity>

                  {showSectionDropdown && (
                    <View style={styles.formDropdownOptions}>
                      {/* Select All / Deselect All Option */}
                      <TouchableOpacity
                        style={[
                          styles.formDropdownItem,
                          { borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0', backgroundColor: '#FFF7ED' }
                        ]}
                        onPress={() => {
                          if (selectedSections.length === SECTIONS_LIST.length) {
                            setSelectedSections([]);
                          } else {
                            setSelectedSections([...SECTIONS_LIST]);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.formDropdownItemText, { fontWeight: '900', color: '#ea580c' }]}>
                          {selectedSections.length === SECTIONS_LIST.length ? '✓ Deselect All' : '✦ Select All Sections'}
                        </Text>
                        <MaterialIcons 
                          name={selectedSections.length === SECTIONS_LIST.length ? "check-box" : "check-box-outline-blank"} 
                          size={20} 
                          color="#ea580c" 
                        />
                      </TouchableOpacity>

                      {/* Individual Sections */}
                      {SECTIONS_LIST.map(sec => {
                        const isSelected = selectedSections.includes(sec);
                        return (
                          <TouchableOpacity 
                            key={sec} 
                            style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                            onPress={() => {
                              if (isSelected) {
                                setSelectedSections(selectedSections.filter(s => s !== sec));
                              } else {
                                setSelectedSections([...selectedSections, sec]);
                              }
                            }}
                            activeOpacity={0.7}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                              <MaterialIcons name="bookmark" size={17} color={isSelected ? '#ea580c' : '#94a3b8'} />
                              <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>
                                {sec}
                              </Text>
                            </View>
                            <MaterialIcons 
                              name={isSelected ? "check-box" : "check-box-outline-blank"} 
                              size={20} 
                              color={isSelected ? "#ea580c" : "#94A3B8"} 
                            />
                          </TouchableOpacity>
                        );
                      })}

                      {/* Done Action Button */}
                      <View style={{ padding: 8, backgroundColor: '#ffffff' }}>
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#ea580c',
                            paddingVertical: 9,
                            alignItems: 'center',
                            borderRadius: 10
                          }}
                          onPress={() => setShowSectionDropdown(false)}
                          activeOpacity={0.85}
                        >
                          <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 13 }}>
                            Done ({selectedSections.length} Selected)
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* Send Option: All Students vs Specific Students */}
                <View style={styles.recipientOptionBox}>
                  <TouchableOpacity
                    style={[styles.radioOption, sendToAllInClass && styles.radioOptionSelected]}
                    onPress={() => setSendToAllInClass(true)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioDot, sendToAllInClass && styles.radioDotSelected]}>
                      {sendToAllInClass && <View style={styles.radioDotInner} />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.radioTitle}>Send to All Students & Parents</Text>
                      <Text style={styles.radioSub}>Everyone in {selectedGrade} ({selectedSections.length === SECTIONS_LIST.length ? 'All Sections' : selectedSections.join(', ')}) will receive this</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.radioOption, !sendToAllInClass && styles.radioOptionSelected]}
                    onPress={() => {
                      setSendToAllInClass(false);
                      setIsStudentPickerOpen(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.radioDot, !sendToAllInClass && styles.radioDotSelected]}>
                      {!sendToAllInClass && <View style={styles.radioDotInner} />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.radioTitle}>Choose Specific Students Only</Text>
                      <Text style={styles.radioSub}>
                        {!sendToAllInClass ? `${selectedStudents.length} Students Selected (Click to change)` : 'Filter and pick only specific students'}
                      </Text>
                    </View>
                    {!sendToAllInClass && (
                      <View style={styles.editFilterChip}>
                        <MaterialIcons name="edit" size={14} color="#ea580c" />
                        <Text style={styles.editFilterText}>Change</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* STEP 2 CARD: Write Notice Message (Activity Style Layout) */}
              <View style={styles.formCard}>
                <View style={styles.formCardHeaderRow}>
                  <View style={[styles.formHeaderIconBox, { backgroundColor: '#FFEDD5' }]}>
                    <MaterialIcons name="edit-note" size={18} color="#ea580c" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.formCardHeader}>Notice Details & Content</Text>
                    <Text style={styles.formCardSub}>Write clear announcement for parents</Text>
                  </View>
                </View>

                {/* Notice Title */}
                <View style={styles.formField}>
                  <View style={styles.labelRow}>
                    <Text style={styles.formLabel}>Notice Title</Text>
                    <Text style={styles.requiredStar}>*</Text>
                  </View>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g. Mid-Term Datesheet & Time Table"
                    placeholderTextColor="#94a3b8"
                    value={noticeTitle}
                    onChangeText={setNoticeTitle}
                  />
                </View>

                {/* Notice Category Dropdown */}
                <View style={styles.formField}>
                  <View style={styles.labelRow}>
                    <Text style={styles.formLabel}>Notice Format / Category</Text>
                    <Text style={styles.requiredStar}>*</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.formSelectBox, showCategoryDropdown && styles.formSelectBoxActive]}
                    onPress={() => {
                      setShowCategoryDropdown(!showCategoryDropdown);
                      setShowClassDropdown(false);
                      setShowSectionDropdown(false);
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.selectTextRow}>
                      <MaterialIcons name="label" size={18} color={getCatColor(noticeCategory)} style={{ marginRight: 10 }} />
                      <Text style={styles.formSelectText}>
                        {noticeCategory}
                      </Text>
                    </View>
                    <MaterialIcons 
                      name={showCategoryDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={22} 
                      color={getCatColor(noticeCategory)} 
                    />
                  </TouchableOpacity>

                  {showCategoryDropdown && (
                    <View style={styles.formDropdownOptions}>
                      {CATEGORY_OPTIONS.map(cat => {
                        const isSelected = noticeCategory === cat.value;
                        return (
                          <TouchableOpacity 
                            key={cat.value} 
                            style={[styles.formDropdownItem, isSelected && { backgroundColor: '#FAF8F0' }]}
                            onPress={() => {
                              setNoticeCategory(cat.value);
                              setShowCategoryDropdown(false);
                            }}
                            activeOpacity={0.7}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                              <MaterialIcons name={cat.icon as any} size={18} color={cat.color} />
                              <Text style={[styles.formDropdownItemText, isSelected && { color: cat.color, fontWeight: '900' }]}>
                                {cat.label}
                              </Text>
                            </View>
                            {isSelected && <MaterialIcons name="check" size={18} color={cat.color} />}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}
                </View>

                {/* Message Body */}
                <View style={styles.formField}>
                  <View style={styles.labelRow}>
                    <Text style={styles.formLabel}>Notice Message for Parents</Text>
                    <Text style={styles.requiredStar}>*</Text>
                  </View>
                  <TextInput
                    style={styles.formTextarea}
                    placeholder="Type your notice or announcement here in simple words for parents and students..."
                    placeholderTextColor="#94a3b8"
                    value={noticeMessage}
                    onChangeText={setNoticeMessage}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Publish Date & Time */}
                <View style={styles.formField}>
                  <View style={styles.labelRow}>
                    <Text style={styles.formLabel}>Publish Date & Time</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.formSelectBox}
                    onPress={() => setIsDatePickerVisible(true)}
                    activeOpacity={0.75}
                  >
                    <View style={styles.selectTextRow}>
                      <MaterialIcons name="event" size={18} color="#ea580c" style={{ marginRight: 10 }} />
                      <Text style={styles.formSelectText}>{publishDate}</Text>
                    </View>
                    <MaterialIcons name="arrow-drop-down" size={22} color="#64748b" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* STEP 3 CARD: Attach Circular (Optional) */}
              <View style={styles.formCard}>
                <View style={styles.formCardHeaderRow}>
                  <View style={[styles.formHeaderIconBox, { backgroundColor: '#FEF3C7' }]}>
                    <MaterialIcons name="attach-file" size={18} color="#d97706" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.formCardHeader}>Attachment (Optional)</Text>
                    <Text style={styles.formCardSub}>Attach PDF circular or photo flyer</Text>
                  </View>
                </View>

                {attachedFile ? (
                  <View style={styles.attachedFileItem}>
                    <MaterialIcons
                      name={attachedFile.type === 'pdf' ? 'picture-as-pdf' : 'image'}
                      size={24}
                      color={attachedFile.type === 'pdf' ? '#e11d48' : '#059669'}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.attachedFileName}>{attachedFile.name}</Text>
                      <Text style={styles.attachedFileSize}>{attachedFile.size} • Attached</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeFileBtn}
                      onPress={() => setAttachedFile(null)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="delete" size={18} color="#e11d48" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.attachBtnRow}>
                    {isUploading ? (
                      <View style={styles.uploadingBox}>
                        <ActivityIndicator size="small" color="#ea580c" />
                        <Text style={styles.uploadingText}>Attaching file...</Text>
                      </View>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.attachOption}
                          onPress={() => handleAttachFile('pdf')}
                          activeOpacity={0.7}
                        >
                          <MaterialIcons name="picture-as-pdf" size={20} color="#e11d48" />
                          <Text style={styles.attachOptionText}>Attach PDF Circular</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.attachOption}
                          onPress={() => handleAttachFile('image')}
                          activeOpacity={0.7}
                        >
                          <MaterialIcons name="image" size={20} color="#059669" />
                          <Text style={styles.attachOptionText}>Attach Photo / Flyer</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
              </View>

              {/* Big Send Notice Button (Activity Style Gradient/Button) */}
              <TouchableOpacity
                style={styles.sendNoticeBtn}
                onPress={handleSendNotice}
                activeOpacity={0.85}
              >
                <MaterialIcons name="send" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={styles.sendNoticeBtnText}>
                  Send Notice to Parents & Students
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ═══════════════ SENT NOTICES HISTORY TAB ═══════════════ */
            <View style={styles.historyContainer}>
              <Text style={styles.historyHeaderTitle}>All Sent Notices ({notices.length})</Text>

              {notices.map(item => {
                const color = getCatColor(item.category);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyCard}
                    onPress={() => setSelectedNoticePreview(item)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.historyColorBar, { backgroundColor: color }]} />
                    <View style={styles.historyCardBody}>
                      <View style={styles.historyCardTop}>
                        <View style={[styles.historyCatBadge, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
                          <Text style={[styles.historyCatBadgeText, { color: color }]}>{item.category}</Text>
                        </View>
                        <Text style={styles.historyDate}>{item.date}</Text>
                      </View>

                      <Text style={styles.historyTitle}>{item.title}</Text>
                      <Text style={styles.historySnippet} numberOfLines={2}>{item.content}</Text>

                      {item.attachmentName && (
                        <View style={styles.historyAttachmentChip}>
                          <MaterialIcons name="attachment" size={14} color="#ea580c" />
                          <Text style={styles.historyAttachmentText}>{item.attachmentName}</Text>
                        </View>
                      )}

                      <View style={styles.historyFooter}>
                        <View style={styles.historyFooterLeft}>
                          <MaterialIcons name="people" size={16} color="#64748b" />
                          <Text style={styles.historyRecipientText}>
                            {item.targetGrade} • {item.targetSection} • {item.recipientCount} Recipients
                          </Text>
                        </View>

                        <View style={styles.readStatusBadge}>
                          <MaterialIcons name="check-circle" size={14} color="#059669" />
                          <Text style={styles.readStatusText}>{item.readRate} Seen</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* ─── MODAL 1: Individual Student Picker ─── */}
        <ViewportModal
          visible={isStudentPickerOpen}
          onClose={() => setIsStudentPickerOpen(false)}
        >
          <View style={styles.pickerModal}>
            <View style={styles.pickerHeader}>
              <View>
                <Text style={styles.pickerTitle}>Select Specific Students</Text>
                <Text style={styles.pickerSub}>{selectedGrade} • {selectedStudents.length} Selected</Text>
              </View>
              <TouchableOpacity
                style={styles.closeIconBtn}
                onPress={() => setIsStudentPickerOpen(false)}
              >
                <MaterialIcons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Search Box */}
            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={20} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search student name or roll number..."
                placeholderTextColor="#94a3b8"
                value={studentSearchQuery}
                onChangeText={setStudentSearchQuery}
              />
            </View>

            {/* Quick Select All Toggle */}
            <View style={styles.pickerActionsRow}>
              <Text style={styles.pickerCountText}>{filteredStudents.length} Students in list</Text>
              <TouchableOpacity
                style={styles.selectAllBtn}
                onPress={handleSelectAllStudents}
              >
                <Text style={styles.selectAllBtnText}>
                  {filteredStudents.every(s => selectedStudents.includes(s.id)) ? 'Deselect All' : 'Select All'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView style={styles.studentList}>
              {filteredStudents.map(st => {
                const isSelected = selectedStudents.includes(st.id);
                return (
                  <TouchableOpacity
                    key={st.id}
                    style={[styles.studentCard, isSelected && styles.studentCardSelected]}
                    onPress={() => handleToggleStudent(st.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.studentAvatar, { backgroundColor: st.avatarColor }]}>
                      <Text style={styles.studentAvatarLetter}>{st.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.studentName}>{st.name}</Text>
                      <Text style={styles.studentDetails}>{st.rollNo} • Sec {st.section} • {st.parentName}</Text>
                    </View>
                    <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
                      {isSelected && <MaterialIcons name="check" size={14} color="#ffffff" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.confirmPickerBtn}
              onPress={() => setIsStudentPickerOpen(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmPickerBtnText}>
                Confirm Selection ({selectedStudents.length} Students)
              </Text>
            </TouchableOpacity>
          </View>
        </ViewportModal>

        {/* ─── MODAL 2: Notice Full Preview ─── */}
        <ViewportModal
          visible={!!selectedNoticePreview}
          onClose={() => setSelectedNoticePreview(null)}
        >
          {selectedNoticePreview && (
            <View style={styles.previewModal}>
              <View style={styles.previewHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.previewNoticeTitle}>{selectedNoticePreview.title}</Text>
                  <Text style={styles.previewDateText}>Sent: {selectedNoticePreview.date}</Text>
                </View>
                <TouchableOpacity
                  style={styles.closeIconBtn}
                  onPress={() => setSelectedNoticePreview(null)}
                >
                  <MaterialIcons name="close" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.previewScroll}>
                <View style={styles.previewAudienceBox}>
                  <Text style={styles.previewAudienceLabel}>SENT TO:</Text>
                  <Text style={styles.previewAudienceValue}>
                    {selectedNoticePreview.targetGrade} ({selectedNoticePreview.targetSection}) • {selectedNoticePreview.recipientCount} Parents & Students
                  </Text>
                </View>

                <Text style={styles.previewMessageLabel}>Notice Content:</Text>
                <Text style={styles.previewMessageText}>{selectedNoticePreview.content}</Text>

                {selectedNoticePreview.attachmentName && (
                  <View style={styles.previewAttachCard}>
                    <MaterialIcons name="picture-as-pdf" size={22} color="#e11d48" />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.previewAttachName}>{selectedNoticePreview.attachmentName}</Text>
                      <Text style={styles.previewAttachSize}>{selectedNoticePreview.attachmentSize}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.previewDownloadBtn}
                      onPress={() => alert(`Downloading circular ${selectedNoticePreview.attachmentName}...`)}
                    >
                      <MaterialIcons name="file-download" size={20} color="#ea580c" />
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>

              <View style={styles.previewFooterActions}>
                <TouchableOpacity
                  style={styles.previewDeleteBtn}
                  onPress={() => setDeleteId(selectedNoticePreview.id)}
                >
                  <MaterialIcons name="delete-outline" size={18} color="#e11d48" />
                  <Text style={styles.previewDeleteBtnText}>Delete Notice</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ViewportModal>

        {/* ─── MODAL 3: Delete Confirmation ─── */}
        <ViewportModal
          visible={!!deleteId}
          onClose={() => setDeleteId(null)}
        >
          <View style={styles.confirmBox}>
            <MaterialIcons name="delete-forever" size={38} color="#e11d48" />
            <Text style={styles.confirmBoxTitle}>Delete this Notice?</Text>
            <Text style={styles.confirmBoxSub}>This notice will be removed from all parent and student apps.</Text>
            <View style={styles.confirmBoxActions}>
              <TouchableOpacity
                style={styles.cancelBoxBtn}
                onPress={() => setDeleteId(null)}
              >
                <Text style={styles.cancelBoxBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBoxBtn}
                onPress={() => deleteId && handleDeleteNotice(deleteId)}
              >
                <Text style={styles.deleteBoxBtnText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ViewportModal>

        {/* ─── MODAL 4: Sending Animation ─── */}
        <ViewportModal
          visible={isSending}
          onClose={() => {}}
        >
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#ea580c" />
            <Text style={styles.loaderTitle}>Sending Notice...</Text>
            <Text style={styles.loaderSub}>{sendStepText}</Text>
          </View>
        </ViewportModal>

        {/* ─── Toast Notification ─── */}
        {successToast.visible && (
          <View style={styles.toast}>
            <MaterialIcons name="check-circle" size={22} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.toastText}>{successToast.message}</Text>
          </View>
        )}

        {/* ─── Date Picker ─── */}
        <PremiumDateTimePicker
          visible={isDatePickerVisible}
          value={publishDate}
          onSelect={(newVal) => {
            setPublishDate(newVal);
            setIsDatePickerVisible(false);
          }}
          onClose={() => setIsDatePickerVisible(false)}
          mode="datetime"
          title="Choose Notice Date & Time"
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    width: '100%',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 1,
  },

  /* 2-Tab Navigation */
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: '#ea580c',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  tabItemText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#64748b',
  },
  tabItemTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },

  /* Scroll Content */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
  composeContainer: {
    width: '100%',
    gap: 14,
  },

  /* Form Cards (Matching ActivityScreen formCard style) */
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 18,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  formCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 2,
  },
  formHeaderIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCardHeader: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  formCardSub: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 1,
  },

  /* Form Field & Labels (Matching ActivityScreen) */
  formField: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requiredStar: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '900',
  },

  /* Dropdown Select Box (Matching ActivityScreen formSelectBox) */
  formSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  formSelectBoxActive: {
    borderColor: '#ea580c',
    backgroundColor: '#FFF7ED',
  },
  selectTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  formSelectText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  formSelectPlaceholder: {
    color: '#94a3b8',
    fontWeight: '600',
  },

  /* Dropdown Options List (Matching ActivityScreen formDropdownOptions) */
  formDropdownOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  formDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formDropdownItemActive: {
    backgroundColor: '#FFF7ED',
  },
  formDropdownItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  formDropdownItemTextActive: {
    color: '#ea580c',
    fontWeight: '900',
  },

  /* Text Inputs (Matching ActivityScreen formInput) */
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  formTextarea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    minHeight: 90,
  },

  /* Recipient Radio Options */
  recipientOptionBox: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  radioOptionSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotSelected: {
    borderColor: '#ea580c',
  },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ea580c',
  },
  radioTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  radioSub: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 1,
  },
  editFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  editFilterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
  },

  /* Attachments */
  attachBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  attachOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    gap: 6,
  },
  attachOptionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  uploadingBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    gap: 8,
  },
  uploadingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea580c',
  },
  attachedFileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
  },
  attachedFileName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  attachedFileSize: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  removeFileBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },

  /* Send Button */
  sendNoticeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ea580c',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 2,
  },
  sendNoticeBtnText: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.2,
  },

  /* History Tab */
  historyContainer: {
    width: '100%',
  },
  historyHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 10,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  historyColorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },
  historyCardBody: {
    padding: 14,
    paddingLeft: 16,
  },
  historyCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historyCatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  historyCatBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  historyDate: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
  },
  historyTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 4,
  },
  historySnippet: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 17,
    fontWeight: '500',
    marginBottom: 8,
  },
  historyAttachmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyAttachmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  historyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  historyFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyRecipientText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  readStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  readStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },

  /* Student Picker Modal */
  pickerModal: {
    width: '92%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    maxHeight: '85%',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  pickerSub: {
    fontSize: 11.5,
    color: '#64748b',
    fontWeight: '600',
  },
  closeIconBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    padding: 0,
  },
  pickerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  pickerCountText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748b',
  },
  selectAllBtn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  selectAllBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
  },
  studentList: {
    maxHeight: 280,
    marginBottom: 14,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1.2,
    borderColor: '#f1f5f9',
    marginBottom: 6,
  },
  studentCardSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
  },
  studentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentAvatarLetter: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
  },
  studentName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  studentDetails: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '500',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  confirmPickerBtn: {
    backgroundColor: '#ea580c',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmPickerBtnText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#ffffff',
  },

  /* Preview Modal */
  previewModal: {
    width: '92%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    maxHeight: '85%',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  previewNoticeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  previewDateText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  previewScroll: {
    maxHeight: 300,
    marginBottom: 12,
  },
  previewAudienceBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewAudienceLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  previewAudienceValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  previewMessageLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
  },
  previewMessageText: {
    fontSize: 13,
    color: '#1e293b',
    lineHeight: 19,
    fontWeight: '500',
    marginBottom: 12,
  },
  previewAttachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewAttachName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  previewAttachSize: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  previewDownloadBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FFEDD5',
  },
  previewFooterActions: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  previewDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  previewDeleteBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#e11d48',
  },

  /* Delete Confirm Box */
  confirmBox: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  confirmBoxTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 8,
  },
  confirmBoxSub: {
    fontSize: 11.5,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  confirmBoxActions: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  cancelBoxBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelBoxBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#475569',
  },
  deleteBoxBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e11d48',
    alignItems: 'center',
  },
  deleteBoxBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#ffffff',
  },

  /* Loader Box */
  loaderBox: {
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  loaderTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0f172a',
  },
  loaderSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
  },

  /* Toast */
  toast: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    maxWidth: 460,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 99999,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    flex: 1,
  },
});

export default NoticeScreen;
