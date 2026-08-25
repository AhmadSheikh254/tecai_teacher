import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Platform, Alert, Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Path, Line, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

interface MCQItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  bloom: 'EASY' | 'MEDIUM' | 'HARD';
  sloTag: string;
  explanation: string;
}
interface Assessment {
  id: string;
  title: string;
  docName: string;
  slosCount: number;
  status: 'Published' | 'Draft';
  class: string;
  course: string;
  mcqs: MCQItem[];
  completions: number;
  total: number;
}

function generateSampleMcqs(title: string, slos: string[]): MCQItem[] {
  const blooms: Array<'EASY' | 'MEDIUM' | 'HARD'> = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD', 'EASY', 'MEDIUM', 'HARD'];
  const questions = [
    { q: `What is the main topic of "${title}"?`, opts: ['Solute & Solvent', 'Temperature Effects', 'Pressure Changes', 'Mass & Volume'], correct: 0 },
    { q: 'Which of the following is a solvent?', opts: ['Salt', 'Sugar', 'Water', 'Sand'], correct: 2 },
    { q: 'What does SLO stand for in education?', opts: ['Student Learning Outcome', 'Standard Lesson Object', 'Subject Learning Option', 'School Level Order'], correct: 0 },
    { q: 'Which factor increases solubility of a gas in liquid?', opts: ['Increase temperature', 'Decrease pressure', 'Increase pressure', 'Decrease volume'], correct: 2 },
    { q: 'A solution where no more solute can dissolve is?', opts: ['Unsaturated', 'Saturated', 'Dilute', 'Concentrated'], correct: 1 },
    { q: 'Differentiate between solute and solvent:', opts: ['Solute dissolves; solvent is dissolved', 'Solute is the liquid; solvent is the solid', 'Solute is dissolved; solvent dissolves', 'Both are the same'], correct: 2 },
    { q: 'Which of these is an example of a solution?', opts: ['Sand in water', 'Oil in water', 'Salt water', 'Mud in water'], correct: 2 },
    { q: 'What is dissolving of a solid in a liquid called?', opts: ['Evaporation', 'Dissolution', 'Condensation', 'Filtration'], correct: 1 },
    { q: 'At higher temperatures, solubility of most solids:', opts: ['Decreases', 'Stays same', 'Increases', 'Becomes zero'], correct: 2 },
    { q: `Based on "${title}", which statement is INCORRECT?`, opts: ['Solubility depends on temperature', 'All liquids are solvents', 'Water is a universal solvent', 'Solute is added to solvent'], correct: 1 },
  ];
  return questions.map((q, i) => ({
    id: `mcq-${Date.now()}-${i}`,
    question: q.q,
    options: q.opts,
    correctAnswer: q.correct,
    bloom: blooms[i],
    sloTag: slos[i % Math.max(slos.length, 1)]?.substring(0, 32) + '…' || `SLO ${(i % slos.length) + 1}`,
    explanation: `Tests ${blooms[i]} level understanding of ${title}.`,
  }));
}

const INITIAL_ASSESSMENTS: Assessment[] = [
  { id: 'mcq-1', title: "Nurse's Song", docName: 'english_ch3.pdf', slosCount: 3, status: 'Published', class: 'Grade 2', course: 'English', mcqs: [], completions: 18, total: 20 },
  { id: 'mcq-2', title: 'Organism & Life Processes', docName: 'bio_ch1.pdf', slosCount: 4, status: 'Published', class: 'Grade 5', course: 'Biology', mcqs: [], completions: 14, total: 22 },
  { id: 'mcq-3', title: 'Am I Alive?', docName: 'sci_ch2.pdf', slosCount: 2, status: 'Draft', class: 'Grade 3', course: 'Science', mcqs: [], completions: 0, total: 25 },
  { id: 'mcq-4', title: 'States of Matter', docName: 'chem_ch4.pdf', slosCount: 5, status: 'Published', class: 'Grade 6', course: 'Chemistry', mcqs: [], completions: 21, total: 30 },
];

export const MCQBuilderScreen = ({ navigation }: any) => {
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [cls, setCls] = useState('GRADE-II');
  const [section, setSection] = useState('Section A');
  const [course, setCourse] = useState('English');
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);

  const classesList = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V', 'GRADE-VI', 'GRADE-VII', 'GRADE-VIII', 'GRADE-IX', 'GRADE-X'];
  const sectionsList = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E'];
  const coursesList = ['Computer', 'English', 'Mathematics', 'Science', 'Social Studies', 'Urdu', 'Islamiat'];

  const [title, setTitle] = useState('');
  const [docName, setDocName] = useState('');

  const handlePickDocument = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Sorry, we need library permissions to upload study material!'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const name = file.fileName || `upload_${Date.now().toString().substring(6)}.png`;
        setDocName(name);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [slos, setSlos] = useState<string[]>(['', '']);
  const [newSloText, setNewSloText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mcqs, setMcqs] = useState<MCQItem[]>([]);
  const [publishStatus, setPublishStatus] = useState<'Published' | 'Draft'>('Published');
  const [assessments, setAssessments] = useState<Assessment[]>(INITIAL_ASSESSMENTS);
  const [filterTab, setFilterTab] = useState<'All' | 'Published' | 'Draft'>('All');
  const [activePlayer, setActivePlayer] = useState<Assessment | null>(null);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState<Record<number, number>>({});

  const handleNext = () => {
    if (wizardStep === 1) {
      if (!title.trim()) { Alert.alert('Required', 'Please enter an Assessment Title.'); return; }
      setIsAnalyzing(true);
      setTimeout(() => { setIsAnalyzing(false); setWizardStep(2); }, 1800);
    } else if (wizardStep === 2) {
      if (slos.filter(s => s.trim()).length === 0) { Alert.alert('Required', 'Add at least one SLO.'); return; }
      setIsGenerating(true);
      setTimeout(() => {
        setMcqs(generateSampleMcqs(title, slos.filter(s => s.trim())));
        setIsGenerating(false);
        setWizardStep(3);
      }, 1500);
    } else if (wizardStep === 3) {
      if (mcqs.length === 0) { Alert.alert('No MCQs', 'Please keep at least 1 question.'); return; }
      setWizardStep(4);
    } else {
      const newA: Assessment = {
        id: `mcq-${Date.now()}`,
        title: title.trim(),
        docName: docName || 'study_material.pdf',
        slosCount: slos.filter(s => s.trim()).length,
        status: publishStatus,
        class: cls, course, mcqs, completions: 0, total: 30,
      };
      setAssessments(prev => [newA, ...prev]);
      setTitle(''); setDocName(''); setCls('GRADE-II'); setSection('Section A'); setCourse('English');
      setSlos(['', '']);
      setMcqs([]); setWizardStep(1);
      Alert.alert('🎉 Success!', `"${newA.title}" has been ${publishStatus === 'Published' ? 'published' : 'saved as draft'} successfully.`);
    }
  };

  const handlePrev = () => { if (wizardStep > 1) setWizardStep((wizardStep - 1) as any); };
  const addSlo = () => { if (newSloText.trim()) { setSlos(prev => [...prev, newSloText.trim()]); setNewSloText(''); } };
  const addMcq = () => setMcqs(prev => [...prev, { id: `mcq-m-${Date.now()}`, question: 'New Question?', options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: 0, bloom: 'EASY', sloTag: 'SLO 1', explanation: '' }]);
  const updateMcq = (id: string, field: string, value: any) => setMcqs(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  const updateMcqOption = (id: string, idx: number, value: string) => setMcqs(prev => prev.map(m => { if (m.id !== id) return m; const opts = [...m.options]; opts[idx] = value; return { ...m, options: opts }; }));
  const deleteMcq = (id: string) => setMcqs(prev => prev.filter(m => m.id !== id));
  const filteredAssessments = assessments.filter(a => filterTab === 'All' || a.status === filterTab);
  const bloomColor = (b: string) => b === 'EASY' ? '#10B981' : b === 'MEDIUM' ? '#F59E0B' : '#EF4444';
  const bloomBg = (b: string) => b === 'EASY' ? '#ECFDF5' : b === 'MEDIUM' ? '#FFFBEB' : '#FEF2F2';

  const steps = ['Upload Doc', 'Define SLOs', 'Review MCQs', 'Publish'];

  return (
    <View style={{ flex: 1, backgroundColor: '#EAF5EC' }}>
      {/* Premium green/mint background design with glowing spheres & mesh waves */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id="greenGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#10B981" stopOpacity={0.24} />
              <Stop offset="50%" stopColor="#34D399" stopOpacity={0.16} />
              <Stop offset="100%" stopColor="#059669" stopOpacity={0.03} />
            </SvgLinearGradient>
            <SvgLinearGradient id="greenGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#6EE7B7" stopOpacity={0.22} />
              <Stop offset="100%" stopColor="#10B981" stopOpacity={0.01} />
            </SvgLinearGradient>
            <SvgLinearGradient id="greenSphereGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#34D399" stopOpacity={0.35} />
              <Stop offset="100%" stopColor="#10B981" stopOpacity={0.1} />
            </SvgLinearGradient>
            <SvgLinearGradient id="softMintSphere" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#A7F3D0" stopOpacity={0.3} />
              <Stop offset="100%" stopColor="#34D399" stopOpacity={0.05} />
            </SvgLinearGradient>
          </Defs>
          {/* Glowing Premium Spheres */}
          <Circle cx="15%" cy="18%" r="130" fill="url(#greenGlow1)" />
          <Circle cx="88%" cy="45%" r="180" fill="url(#greenGlow2)" />
          <Circle cx="35%" cy="75%" r="160" fill="url(#greenGlow1)" />
          
          {/* Floating kid-friendly glass spheres */}
          <Circle cx="82%" cy="15%" r="48" fill="url(#greenSphereGrad)" />
          <Circle cx="12%" cy="52%" r="64" fill="url(#softMintSphere)" />
          <Circle cx="85%" cy="82%" r="55" fill="url(#greenSphereGrad)" />
          <Circle cx="45%" cy="30%" r="30" fill="url(#greenSphereGrad)" />

          {/* Elegant flowing wave vectors */}
          <Path d="M -20,150 Q 80,100 160,220 T 360,180 T 560,220" stroke="#10B981" strokeWidth={1.8} fill="none" opacity={0.22} />
          <Path d="M -40,165 Q 60,115 140,235 T 340,195 T 540,235" stroke="#34D399" strokeWidth={1.2} fill="none" opacity={0.18} />
          <Path d="M 60,320 Q 210,280 230,440 T 430,340" stroke="#6EE7B7" strokeWidth={1.5} fill="none" opacity={0.2} />
          <Path d="M 40,335 Q 190,295 210,455 T 410,355" stroke="#A7F3D0" strokeWidth={1.2} fill="none" opacity={0.16} />
        </Svg>
      </View>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* ── Top Header ── */}
        <View style={S.header}>
          <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={S.headerTitle}>MCQ Builder</Text>
            <Text style={S.headerSub}>AI-powered smart quiz generator</Text>
          </View>
          <View style={S.generatorBadge}>
            <View style={S.generatorDot} />
            <Text style={S.generatorBadgeText}>GENERATOR</Text>
          </View>
        </View>

        {/* ── Progress Tracker (Identical to Image Design) ── */}
        <View style={S.progressContainer}>
          <View style={S.progressInner}>
            {steps.map((s, i) => {
              const step = i + 1;
              const isActive = step === wizardStep;
              const isDone = step < wizardStep;
              return (
                <React.Fragment key={step}>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    {isDone ? (
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={[S.stepDot, { borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.4)' }]}
                      >
                        <MaterialIcons name="check" size={16} color="#fff" />
                      </LinearGradient>
                    ) : isActive ? (
                      <LinearGradient
                        colors={['#4F46E5', '#4338CA']}
                        style={[S.stepDot, { borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.5)' }]}
                      >
                        <MaterialIcons 
                          name={step === 1 ? "cloud-upload" : step === 2 ? "track-changes" : step === 3 ? "quiz" : "publish"} 
                          size={15} 
                          color="#ffffff" 
                        />
                      </LinearGradient>
                    ) : (
                      <View style={[S.stepDot, { 
                        backgroundColor: 'rgba(241, 245, 249, 0.75)', 
                        borderWidth: 1.5, 
                        borderColor: 'rgba(226, 232, 240, 0.8)',
                        shadowOpacity: 0.05, 
                        elevation: 1 
                      }]}>
                        <MaterialIcons 
                          name={step === 1 ? "cloud-upload" : step === 2 ? "track-changes" : step === 3 ? "quiz" : "publish"} 
                          size={15} 
                          color="#94A3B8" 
                        />
                      </View>
                    )}
                    <Text style={[
                      S.stepLabel, 
                      isDone ? S.stepLabelDone : isActive ? S.stepLabelActive : S.stepLabelInactive
                    ]}>
                      {s}
                    </Text>
                  </View>
                  {i < steps.length - 1 && (
                    <View style={[S.stepLine, isDone ? S.stepLineDone : S.stepLineInactive]} />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

          {/* ═══════════ STEP 1 ═══════════ */}
          {wizardStep === 1 && (
            <>
              {/* Hero MCQ Builder Banner Card */}
              <View style={S.heroBanner}>
                <LinearGradient colors={['#D1FAE5', '#A7F3D0', '#BAE6FD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.heroGrad}>
                  {/* BG decorative circles */}
                  <View style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(16,185,129,0.12)' }} />
                  <View style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(14,165,233,0.1)' }} />

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <LinearGradient colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.75)']} style={S.heroIconBox}>
                      <MaterialIcons name="quiz" size={32} color="#0EA5E9" />
                    </LinearGradient>
                    <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']} style={S.heroTag}>
                      <View style={S.heroTagDot} />
                      <Text style={S.heroTagText}>GENERATOR</Text>
                    </LinearGradient>
                  </View>

                  <Text style={S.heroTitle}>MCQ Builder</Text>
                  <Text style={S.heroSub}>Smart quiz &amp; paper generator tool</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}>
                    <LinearGradient colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']} style={S.activeChip}>
                      <View style={S.activeDot} />
                      <Text style={S.activeText}>{assessments.length} Active Assessments</Text>
                    </LinearGradient>
                  </View>

                  {/* Decorative SVG doc */}
                  <View style={{ position: 'absolute', right: 18, bottom: 14, opacity: 0.2 }}>
                    <Svg width={80} height={80} viewBox="0 0 64 64">
                      <Rect x="8" y="4" width="40" height="52" rx="7" fill="#10B981" />
                      <Rect x="14" y="14" width="28" height="4" rx="2" fill="white" />
                      <Rect x="14" y="24" width="22" height="4" rx="2" fill="white" />
                      <Rect x="14" y="34" width="26" height="4" rx="2" fill="white" />
                      <Rect x="14" y="44" width="18" height="4" rx="2" fill="white" />
                    </Svg>
                  </View>
                </LinearGradient>
              </View>

              {/* ── Upload Form Card ── */}
              <View style={S.card}>
                <View style={S.cardHeader}>
                  <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={S.cardHeaderIcon}>
                    <MaterialIcons name="description" size={20} color="#6366F1" />
                  </LinearGradient>
                  <View>
                    <Text style={S.cardTitle}>Study Material Info</Text>
                    <Text style={S.cardSub}>Fill in the details below</Text>
                  </View>
                </View>

                <View style={S.formRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={S.label}>Class</Text>
                    <TouchableOpacity 
                      style={S.inputWrap} 
                      onPress={() => {
                        setShowClassDropdown(!showClassDropdown);
                        setShowSectionDropdown(false);
                        setShowCourseDropdown(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <MaterialIcons name="school" size={17} color="#6366F1" style={{ marginRight: 8 }} />
                      <Text style={[S.input, !cls && { color: '#CBD5E1' }]}>{cls || 'Select Class'}</Text>
                      <MaterialIcons name={showClassDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#6366F1" />
                    </TouchableOpacity>
                    {showClassDropdown && (
                      <View style={S.dropdownContainer}>
                        {classesList.map(c => (
                          <TouchableOpacity key={c} style={[S.dropdownItem, cls === c && S.dropdownItemActive]} onPress={() => { setCls(c); setShowClassDropdown(false); }}>
                            <Text style={[S.dropdownItemText, cls === c && S.dropdownItemTextActive]}>{c}</Text>
                            {cls === c && <MaterialIcons name="check" size={16} color="#6366F1" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={S.label}>Section</Text>
                    <TouchableOpacity 
                      style={S.inputWrap} 
                      onPress={() => {
                        setShowSectionDropdown(!showSectionDropdown);
                        setShowClassDropdown(false);
                        setShowCourseDropdown(false);
                      }}
                      activeOpacity={0.8}
                    >
                      <MaterialIcons name="people" size={17} color="#6366F1" style={{ marginRight: 8 }} />
                      <Text style={[S.input, !section && { color: '#CBD5E1' }]}>{section || 'Select Section'}</Text>
                      <MaterialIcons name={showSectionDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#6366F1" />
                    </TouchableOpacity>
                    {showSectionDropdown && (
                      <View style={S.dropdownContainer}>
                        {sectionsList.map(s => (
                          <TouchableOpacity key={s} style={[S.dropdownItem, section === s && S.dropdownItemActive]} onPress={() => { setSection(s); setShowSectionDropdown(false); }}>
                            <Text style={[S.dropdownItemText, section === s && S.dropdownItemTextActive]}>{s}</Text>
                            {section === s && <MaterialIcons name="check" size={16} color="#6366F1" />}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>

                <Text style={S.label}>Subject / Course</Text>
                <TouchableOpacity 
                  style={S.inputWrap} 
                  onPress={() => {
                    setShowCourseDropdown(!showCourseDropdown);
                    setShowClassDropdown(false);
                    setShowSectionDropdown(false);
                  }}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="book" size={17} color="#6366F1" style={{ marginRight: 8 }} />
                  <Text style={[S.input, !course && { color: '#CBD5E1' }]}>{course || 'Select Course'}</Text>
                  <MaterialIcons name={showCourseDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#6366F1" />
                </TouchableOpacity>
                {showCourseDropdown && (
                  <View style={S.dropdownContainer}>
                    {coursesList.map(c => (
                      <TouchableOpacity key={c} style={[S.dropdownItem, course === c && S.dropdownItemActive]} onPress={() => { setCourse(c); setShowCourseDropdown(false); }}>
                        <Text style={[S.dropdownItemText, course === c && S.dropdownItemTextActive]}>{c}</Text>
                        {course === c && <MaterialIcons name="check" size={16} color="#6366F1" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={S.label}>Assessment Title <Text style={{ color: '#EF4444' }}>*</Text></Text>
                <View style={[S.inputWrap, { borderColor: title ? '#6366F1' : '#E2E8F0' }]}>
                  <MaterialIcons name="title" size={17} color="#6366F1" style={{ marginRight: 8 }} />
                  <TextInput style={S.input} value={title} onChangeText={setTitle} placeholder="e.g. States of Matter Quiz" placeholderTextColor="#CBD5E1" />
                </View>

                {/* Upload Zone */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 8 }}>
                  <Text style={S.label}>Upload Study Material</Text>
                  <Text style={{ fontSize: 11, color: '#94A3B8', fontWeight: '600' }}>PDF, JPG, PNG • Max 10MB</Text>
                </View>

                <TouchableOpacity style={S.uploadZone} onPress={handlePickDocument} activeOpacity={0.85}>
                  <LinearGradient colors={['#EFF6FF', '#F0FDFA', '#F0F9FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.uploadGrad}>
                    <LinearGradient colors={['#DBEAFE', '#E0F2FE']} style={S.uploadIconCircle}>
                      <MaterialIcons name="cloud-upload" size={30} color="#0EA5E9" />
                    </LinearGradient>
                    {docName ? (
                      <View style={{ alignItems: 'center', gap: 6 }}>
                        <MaterialIcons name="insert-drive-file" size={22} color="#10B981" />
                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#059669' }}>{docName}</Text>
                        <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600' }}>Tap to change file</Text>
                      </View>
                    ) : (
                      <>
                        <Text style={S.uploadTitle}>Tap to Upload Document</Text>
                        <Text style={S.uploadSub}>or choose from sample files below</Text>
                        <View style={S.sampleRow}>
                          {['class 2 study material.pdf', 'mateerr.PNG'].map(f => (
                            <TouchableOpacity key={f} style={S.sampleChip} onPress={() => setDocName(f)}>
                              <MaterialIcons name="insert-drive-file" size={13} color="#2563EB" />
                              <Text style={S.sampleChipText}>{f}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Premium Analyze Document Button */}
              <View style={{ marginBottom: 20, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={handleNext} activeOpacity={0.88}>
                  <LinearGradient
                    colors={['#4F46E5', '#4338CA']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 14,
                      paddingHorizontal: 28,
                      borderRadius: 16,
                      shadowColor: '#4F46E5',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.25,
                      shadowRadius: 10,
                      elevation: 5,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '900', color: '#ffffff', fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-bold' }}>
                      Analyze Document
                    </Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* ── Assessments Dashboard ── */}
              <View style={S.card}>
                <View style={S.cardHeader}>
                  <LinearGradient colors={['#FEF3C7', '#FDE68A']} style={S.cardHeaderIcon}>
                    <MaterialIcons name="bar-chart" size={20} color="#D97706" />
                  </LinearGradient>
                  <View>
                    <Text style={S.cardTitle}>Assessments Dashboard</Text>
                    <Text style={S.cardSub}>All your generated MCQ assessments</Text>
                  </View>
                </View>

                {/* Metric Cards */}
                <View style={S.metricsRow}>
                  {[
                    { label: 'TOTAL', value: assessments.length, color: '#6366F1', bg: ['#EEF2FF', '#E0E7FF'] as [string, string] },
                    { label: 'PUBLISHED', value: assessments.filter(a => a.status === 'Published').length, color: '#10B981', bg: ['#ECFDF5', '#D1FAE5'] as [string, string] },
                    { label: 'SUBMITTED', value: 3, color: '#F59E0B', bg: ['#FFFBEB', '#FEF3C7'] as [string, string] },
                    { label: 'AVG SCORE', value: '78%', color: '#0EA5E9', bg: ['#E0F2FE', '#BAE6FD'] as [string, string] },
                  ].map(m => (
                    <LinearGradient key={m.label} colors={m.bg} style={S.metricCard}>
                      <Text style={[S.metricValue, { color: m.color }]}>{m.value}</Text>
                      <Text style={[S.metricLabel, { color: m.color }]}>{m.label}</Text>
                    </LinearGradient>
                  ))}
                </View>

                {/* Filter Tabs */}
                <View style={S.filterTabRow}>
                  {(['All', 'Published', 'Draft'] as const).map(t => {
                    const isActive = filterTab === t;
                    if (isActive) {
                      return (
                        <TouchableOpacity key={t} onPress={() => setFilterTab(t)} activeOpacity={0.9}>
                          <LinearGradient 
                            colors={['#4F46E5', '#4338CA']} 
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={S.filterTabActiveGrad}
                          >
                            <Text style={S.filterTabTextActive}>{t}</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    }
                    return (
                      <TouchableOpacity key={t} onPress={() => setFilterTab(t)} style={S.filterTabInactive} activeOpacity={0.8}>
                        <Text style={S.filterTabText}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Assessment Rows */}
                {filteredAssessments.map((a, idx) => (
                  <View key={a.id} style={[S.assessRow, idx === 0 && { borderTopWidth: 0 }]}>
                    <LinearGradient colors={a.status === 'Published' ? ['#ECFDF5', '#D1FAE5'] : ['#FFFBEB', '#FEF3C7']} style={S.assessIconBox}>
                      <MaterialIcons name="quiz" size={18} color={a.status === 'Published' ? '#10B981' : '#F59E0B'} />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text style={S.assessTitle} numberOfLines={1}>{a.title}</Text>
                      <Text style={S.assessMeta}>{a.class} • {a.course} • {a.slosCount} SLOs</Text>
                    </View>
                    <View style={[S.statusPill, { backgroundColor: a.status === 'Published' ? '#ECFDF5' : '#FEF3C7', borderColor: a.status === 'Published' ? '#6EE7B7' : '#FDE68A' }]}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: a.status === 'Published' ? '#10B981' : '#F59E0B', marginRight: 4 }} />
                      <Text style={[S.statusText, { color: a.status === 'Published' ? '#059669' : '#92400E' }]}>{a.status}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6, marginLeft: 8 }}>
                      <TouchableOpacity style={S.assessAction} onPress={() => { setActivePlayer(a); setPlayerIndex(0); setPlayerAnswers({}); }}>
                        <MaterialIcons name="visibility" size={17} color="#6366F1" />
                      </TouchableOpacity>
                      <TouchableOpacity style={[S.assessAction, { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }]} onPress={() => setAssessments(prev => prev.filter(x => x.id !== a.id))}>
                        <MaterialIcons name="delete-outline" size={17} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ═══════════ STEP 2: SLOs ═══════════ */}
          {wizardStep === 2 && (
            <View style={S.card}>
              <View style={S.cardHeader}>
                <LinearGradient colors={['#EDE9FE', '#DDD6FE']} style={S.cardHeaderIcon}>
                  <MaterialIcons name="flag" size={20} color="#7C3AED" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={S.cardTitle}>Student Learning Outcomes</Text>
                  <Text style={S.cardSub}>Define 2–6 objectives. AI targets MCQs to these.</Text>
                </View>
              </View>

              {slos.map((slo, i) => (
                <View key={i} style={S.sloRow}>
                  <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={S.sloIndex}>
                    <Text style={S.sloIndexText}>{i + 1}</Text>
                  </LinearGradient>
                  <TextInput
                    style={S.sloInput}
                    value={slo}
                    onChangeText={v => setSlos(prev => { const c = [...prev]; c[i] = v; return c; })}
                    multiline
                    placeholder={
                      i === 0 
                        ? "e.g. Differentiate between solute, solvent and solution"
                        : i === 1 
                          ? "e.g. Explain solubility and factors affecting it"
                          : "Enter learning outcome..."
                    }
                    placeholderTextColor="#CBD5E1"
                  />
                  <TouchableOpacity style={S.sloDelete} onPress={() => setSlos(prev => prev.filter((_, j) => j !== i))}>
                    <MaterialIcons name="close" size={17} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {slos.length < 6 && (
                <View style={S.addSloRow}>
                  <View style={[S.inputWrap, { flex: 1, borderColor: '#C7D2FE', marginBottom: 0 }]}>
                    <MaterialIcons name="add" size={17} color="#6366F1" style={{ marginRight: 8 }} />
                    <TextInput style={S.input} value={newSloText} onChangeText={setNewSloText} placeholder="Type new SLO..." placeholderTextColor="#CBD5E1" onSubmitEditing={addSlo} />
                  </View>
                  <TouchableOpacity onPress={addSlo}>
                    <LinearGradient colors={['#6366F1', '#4F46E5']} style={S.addSloBtn}>
                      <MaterialIcons name="add" size={22} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* Info tip box */}
              <LinearGradient colors={['#EFF6FF', '#F0F9FF']} style={{ borderRadius: 14, padding: 14, marginTop: 16, flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderWidth: 1, borderColor: '#BFDBFE' }}>
                <MaterialIcons name="lightbulb" size={18} color="#2563EB" />
                <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#1E40AF', lineHeight: 20 }}>
                  Well-defined SLOs help the AI generate more targeted and relevant MCQ questions for your students.
                </Text>
              </LinearGradient>
            </View>
          )}

          {/* ═══════════ STEP 3: REVIEW MCQs ═══════════ */}
          {wizardStep === 3 && (
            <View style={S.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <View style={S.cardHeader}>
                  <LinearGradient colors={['#ECFDF5', '#D1FAE5']} style={S.cardHeaderIcon}>
                    <MaterialIcons name="auto-awesome" size={20} color="#10B981" />
                  </LinearGradient>
                  <View>
                    <Text style={S.cardTitle}>Review Questions</Text>
                    <Text style={S.cardSub}>{mcqs.length} MCQs generated • Edit freely</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={addMcq}>
                  <LinearGradient colors={['#6366F1', '#4F46E5']} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 14 }}>
                    <MaterialIcons name="add" size={15} color="#fff" />
                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#fff' }}>Add MCQ</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {mcqs.map((mcq, qi) => (
                <View key={mcq.id} style={S.mcqCard}>
                  {/* MCQ Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <LinearGradient colors={['#6366F1', '#4F46E5']} style={S.qBadge}>
                        <Text style={S.qBadgeText}>Q{qi + 1}</Text>
                      </LinearGradient>
                      <View style={[S.bloomBadge, { backgroundColor: bloomBg(mcq.bloom), borderColor: bloomColor(mcq.bloom) + '50' }]}>
                        <Text style={[S.bloomText, { color: bloomColor(mcq.bloom) }]}>{mcq.bloom}</Text>
                      </View>
                    </View>
                    <TouchableOpacity style={S.deleteBtn} onPress={() => deleteMcq(mcq.id)}>
                      <MaterialIcons name="delete-outline" size={17} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Question Input */}
                  <TextInput
                    style={S.mcqQuestionInput}
                    value={mcq.question}
                    onChangeText={v => updateMcq(mcq.id, 'question', v)}
                    multiline
                    placeholder="Question text..."
                    placeholderTextColor="#CBD5E1"
                  />

                  {/* Options */}
                  {mcq.options.map((opt, oi) => {
                    const isCorrect = mcq.correctAnswer === oi;
                    return (
                      <TouchableOpacity key={oi} style={[S.optionRow, isCorrect && S.optionRowCorrect]} onPress={() => updateMcq(mcq.id, 'correctAnswer', oi)} activeOpacity={0.7}>
                        <View style={[S.optionRadio, isCorrect && S.optionRadioCorrect]}>
                          {isCorrect && <View style={S.optionRadioInner} />}
                        </View>
                        <Text style={[S.optionLetter, { color: isCorrect ? '#10B981' : '#6366F1' }]}>{String.fromCharCode(65 + oi)})</Text>
                        <TextInput style={S.optionInput} value={opt} onChangeText={v => updateMcqOption(mcq.id, oi, v)} placeholder={`Option ${String.fromCharCode(65 + oi)}`} placeholderTextColor="#CBD5E1" />
                        {isCorrect && <MaterialIcons name="check-circle" size={18} color="#10B981" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          )}

          {/* ═══════════ STEP 4: SAVE & PUBLISH ═══════════ */}
          {wizardStep === 4 && (
            <View style={S.card}>
              <View style={S.cardHeader}>
                <LinearGradient colors={['#ECFDF5', '#D1FAE5']} style={S.cardHeaderIcon}>
                  <MaterialIcons name="publish" size={20} color="#059669" />
                </LinearGradient>
                <View>
                  <Text style={S.cardTitle}>Save &amp; Publish</Text>
                  <Text style={S.cardSub}>Review details before publishing</Text>
                </View>
              </View>

              {/* Summary Grid */}
              <View style={{ gap: 10 }}>
                {[
                  { label: 'Assessment Title', value: title, icon: 'title', color: '#6366F1' },
                  { label: 'Class', value: cls, icon: 'school', color: '#0EA5E9' },
                  { label: 'Section', value: section, icon: 'people', color: '#10B981' },
                  { label: 'Subject', value: course, icon: 'book', color: '#F59E0B' },
                  { label: 'Total Questions', value: `${mcqs.length} MCQs`, icon: 'quiz', color: '#8B5CF6' },
                  { label: 'Learning Outcomes', value: `${slos.filter(s => s.trim()).length} SLOs`, icon: 'flag', color: '#EC4899' },
                ].map(row => (
                  <View key={row.label} style={S.summaryItem}>
                    <LinearGradient colors={[row.color + '22', row.color + '11']} style={S.summaryIcon}>
                      <MaterialIcons name={row.icon as any} size={18} color={row.color} />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text style={S.summaryLabel}>{row.label}</Text>
                      <Text style={S.summaryValue} numberOfLines={1}>{row.value || '—'}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Publish Status */}
              <Text style={[S.label, { marginTop: 20, marginBottom: 10 }]}>Publish Status</Text>
              {(['Published', 'Draft'] as const).map(s => (
                <TouchableOpacity key={s} style={[S.publishOption, publishStatus === s && S.publishOptionActive]} onPress={() => setPublishStatus(s)}>
                  <View style={[S.publishRadio, publishStatus === s && S.publishRadioActive]}>
                    {publishStatus === s && <View style={S.publishRadioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[S.publishLabel, publishStatus === s && { color: '#6366F1' }]}>{s}</Text>
                    <Text style={S.publishSub}>{s === 'Published' ? 'Students can see and take the quiz now' : 'Only you can view this draft'}</Text>
                  </View>
                  {publishStatus === s && <MaterialIcons name="check-circle" size={20} color="#6366F1" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Loaders ── */}
          {isAnalyzing && (
            <View style={S.loaderOverlay}>
              <View style={S.loaderCard}>
                <LinearGradient 
                  colors={['#EEF2FF', '#E0E7FF']} 
                  style={S.loaderIconCircle}
                >
                  <ActivityIndicator size="large" color="#4F46E5" style={{ transform: [{ scale: 1.1 }] }} />
                </LinearGradient>
                <Text style={S.loaderTitle}>Analyzing Document...</Text>
                <Text style={S.loaderSub}>Extracting learning objectives and key concepts from your study material</Text>
              </View>
            </View>
          )}
          {isGenerating && (
            <View style={S.loaderOverlay}>
              <View style={S.loaderCard}>
                <LinearGradient 
                  colors={['#F5F3FF', '#EDE9FE']} 
                  style={S.loaderIconCircle}
                >
                  <ActivityIndicator size="large" color="#7C3AED" style={{ transform: [{ scale: 1.1 }] }} />
                </LinearGradient>
                <Text style={S.loaderTitle}>Generating 10 MCQs...</Text>
                <Text style={S.loaderSub}>AI is crafting targeted questions based on your learning outcomes</Text>
              </View>
            </View>
          )}

          {/* ── Nav Buttons ── */}
          {wizardStep > 1 && (
            <View style={S.navRow}>
              <TouchableOpacity style={S.prevBtn} onPress={handlePrev}>
                <MaterialIcons name="arrow-back" size={18} color="#475569" />
                <Text style={S.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={handleNext} activeOpacity={0.88}>
                <LinearGradient
                  colors={wizardStep === 4 ? ['#10B981', '#059669'] : ['#6366F1', '#4F46E5']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={S.nextBtn}
                >
                  <Text style={S.nextBtnText}>
                    {wizardStep === 2 ? 'Generate MCQs' : wizardStep === 3 ? 'Review & Publish' : '✓  Save Assessment'}
                  </Text>
                  <MaterialIcons name={wizardStep === 4 ? 'check' : 'arrow-forward'} size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </SafeAreaView>

      {/* ── MCQ Player Modal ── */}
      {activePlayer && (
        <Modal visible animationType="slide" transparent={false} onRequestClose={() => setActivePlayer(null)}>
          <View style={{ flex: 1 }}>
            <LinearGradient colors={['#EEF2FF', '#F0F9FF', '#F0FDF4']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
              <LinearGradient colors={['#ffffff', '#F8FAFF']} style={S.playerHeader}>
                <TouchableOpacity style={S.backBtn} onPress={() => setActivePlayer(null)}>
                  <MaterialIcons name="close" size={22} color="#0F172A" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={S.headerTitle} numberOfLines={1}>{activePlayer.title}</Text>
                  <Text style={S.headerSub}>MCQ Interactive Quiz</Text>
                </View>
                <LinearGradient colors={['#E0F2FE', '#BAE6FD']} style={S.generatorBadge}>
                  <Text style={{ fontSize: 13, fontWeight: '900', color: '#0369A1' }}>{Object.keys(playerAnswers).length} Answered</Text>
                </LinearGradient>
              </LinearGradient>

              <ScrollView contentContainerStyle={{ padding: 20, alignItems: 'center' }}>
                {activePlayer.mcqs && activePlayer.mcqs.length > 0 ? (
                  <View style={[S.card, { width: '100%', maxWidth: 620 }]}>
                    <Text style={{ fontSize: 14, fontWeight: '800', color: '#6366F1', marginBottom: 10 }}>
                      Question {playerIndex + 1} of {activePlayer.mcqs.length}
                    </Text>

                    {/* Progress bar */}
                    <View style={{ height: 5, borderRadius: 3, backgroundColor: '#E2E8F0', marginBottom: 20 }}>
                      <LinearGradient colors={['#6366F1', '#0EA5E9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={{ height: 5, borderRadius: 3, width: `${((playerIndex + 1) / activePlayer.mcqs.length) * 100}%` as any }} />
                    </View>

                    <Text style={{ fontSize: 18, fontWeight: '900', color: '#0F172A', lineHeight: 28, marginBottom: 18 }}>
                      {activePlayer.mcqs[playerIndex]?.question}
                    </Text>

                    <View style={{ gap: 10 }}>
                      {activePlayer.mcqs[playerIndex]?.options.map((opt: string, idx: number) => {
                        const isSelected = playerAnswers[playerIndex] === idx;
                        const isCorrect = activePlayer.mcqs[playerIndex].correctAnswer === idx;
                        return (
                          <TouchableOpacity key={idx}
                            style={[S.optionRow, isSelected && (isCorrect ? S.optionRowCorrect : { borderColor: '#F43F5E', backgroundColor: '#FFF1F2' })]}
                            onPress={() => setPlayerAnswers(prev => ({ ...prev, [playerIndex]: idx }))}
                          >
                            <View style={[S.optionRadio, isSelected && (isCorrect ? S.optionRadioCorrect : { borderColor: '#F43F5E' })]}>
                              {isSelected && <View style={[S.optionRadioInner, { backgroundColor: isCorrect ? '#10B981' : '#F43F5E' }]} />}
                            </View>
                            <Text style={[S.optionLetter, { color: isSelected ? (isCorrect ? '#10B981' : '#F43F5E') : '#6366F1' }]}>{String.fromCharCode(65 + idx)})</Text>
                            <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: '#0F172A' }}>{opt}</Text>
                            {isSelected && <MaterialIcons name={isCorrect ? 'check-circle' : 'cancel'} size={20} color={isCorrect ? '#10B981' : '#F43F5E'} />}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={[S.navRow, { marginTop: 20 }]}>
                      <TouchableOpacity disabled={playerIndex === 0}
                        style={[S.prevBtn, playerIndex === 0 && { opacity: 0.4 }]}
                        onPress={() => setPlayerIndex(p => Math.max(0, p - 1))}>
                        <MaterialIcons name="arrow-back" size={18} color="#475569" />
                        <Text style={S.prevBtnText}>Prev</Text>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity onPress={() => {
                        if (playerIndex < activePlayer.mcqs.length - 1) setPlayerIndex(p => p + 1);
                        else { Alert.alert('🎉 Quiz Complete!', `You answered ${Object.keys(playerAnswers).length} of ${activePlayer.mcqs.length} questions.`); setActivePlayer(null); }
                      }}>
                        <LinearGradient colors={['#10B981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={S.nextBtn}>
                          <Text style={S.nextBtnText}>{playerIndex < activePlayer.mcqs.length - 1 ? 'Next' : 'Finish Quiz'}</Text>
                          <MaterialIcons name={playerIndex < activePlayer.mcqs.length - 1 ? 'arrow-forward' : 'check'} size={18} color="#fff" />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={[S.card, { alignItems: 'center', gap: 14, paddingVertical: 40 }]}>
                    <LinearGradient colors={['#EEF2FF', '#E0E7FF']} style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialIcons name="quiz" size={40} color="#6366F1" />
                    </LinearGradient>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#0F172A' }}>No Questions Yet</Text>
                    <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 }}>Generate MCQs using the 4-step wizard first.</Text>
                    <TouchableOpacity onPress={() => setActivePlayer(null)}>
                      <LinearGradient colors={['#6366F1', '#4F46E5']} style={S.nextBtn}>
                        <Text style={S.nextBtnText}>Close</Text>
                        <MaterialIcons name="close" size={18} color="#fff" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      )}
    </View>
  );
};

// ─── Premium Styles ──────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1.5, borderBottomColor: '#F1F5F9', backgroundColor: '#ffffff' },
  playerHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16, borderBottomWidth: 1.5, borderBottomColor: '#F1F5F9', backgroundColor: '#ffffff' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#E2E8F0' },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#0F172A', 
    letterSpacing: -0.5,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-bold'
  },
  headerSub: { 
    fontSize: 13, 
    color: '#64748B', 
    fontWeight: '600', 
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif'
  },
  generatorBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: 13, borderRadius: 20, borderWidth: 1.5, borderColor: '#A7F3D0', backgroundColor: '#ffffff' },
  generatorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  generatorBadgeText: { fontSize: 12, fontWeight: '900', color: '#059669', letterSpacing: 0.5, fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium' },

  // Progress
  progressContainer: { 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(226, 232, 240, 0.6)', 
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  progressInner: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    backgroundColor: 'transparent' 
  },
  stepDot: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 4, 
    shadowColor: '#4F46E5', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 2 
  },
  stepNum: { 
    fontSize: 14, 
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-bold'
  },
  stepLabel: { 
    fontSize: 12, 
    fontWeight: '800', 
    textAlign: 'center', 
    maxWidth: 80, 
    marginTop: 5, 
    lineHeight: 15,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    letterSpacing: 0.2
  },
  stepLabelActive: { color: '#4F46E5' },
  stepLabelDone: { color: '#10B981' },
  stepLabelInactive: { color: '#94A3B8' },
  stepLine: { flex: 1, height: 2, marginTop: 15, marginHorizontal: 6, borderRadius: 1 },
  stepLineDone: { backgroundColor: '#10B981' },
  stepLineInactive: { backgroundColor: '#E2E8F0' },

  // Hero Banner
  heroBanner: { borderRadius: 16, overflow: 'hidden', marginBottom: 12, shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  heroGrad: { padding: 12, minHeight: 100 },
  heroIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)', shadowColor: '#10B981', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 2 },
  heroTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)' },
  heroTagDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  heroTagText: { fontSize: 10, fontWeight: '900', color: '#059669', letterSpacing: 0.5 },
  heroTitle: { fontSize: 18, fontWeight: '900', color: '#064E3B', letterSpacing: -0.4, marginBottom: 2 },
  heroSub: { fontSize: 11.5, fontWeight: '600', color: '#065F46', opacity: 0.8 },
  activeChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)' },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  activeText: { fontSize: 11.5, fontWeight: '800', color: '#047857' },

  // Card
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 14, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    shadowColor: '#4F46E5', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 10, 
    elevation: 3 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardHeaderIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '900', color: '#0F172A' },
  cardSub: { fontSize: 11.5, color: '#64748B', fontWeight: '600', marginTop: 1 },

  // Form
  formRow: { flexDirection: 'row', marginBottom: 10 },
  label: { fontSize: 12, fontWeight: '800', color: '#374151', marginBottom: 4, letterSpacing: 0.1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#F8FAFC', marginBottom: 10 },
  input: { flex: 1, fontSize: 12.5, fontWeight: '700', color: '#0F172A', padding: 0, ...Platform.select({ web: { outlineStyle: 'none' } as any }) },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: -8,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemActive: {
    backgroundColor: '#EEF2FF',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  dropdownItemTextActive: {
    color: '#4F46E5',
    fontWeight: '900',
  },

  // Upload
  uploadZone: { borderRadius: 18, overflow: 'hidden', borderWidth: 1.5, borderColor: '#BAE6FD', borderStyle: 'dashed' },
  uploadGrad: { padding: 26, alignItems: 'center', gap: 10 },
  uploadIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  uploadTitle: { fontSize: 17, fontWeight: '900', color: '#0369A1' },
  uploadSub: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  sampleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10, justifyContent: 'center' },
  sampleChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#EFF6FF', borderWidth: 1.2, borderColor: '#BFDBFE' },
  sampleChipText: { fontSize: 11, fontWeight: '800', color: '#2563EB' },

  // Dashboard
  metricsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  metricCard: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 16, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  metricValue: { fontSize: 22, fontWeight: '900' },
  metricLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.4, textAlign: 'center' },
  filterTabRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  filterTabInactive: { 
    paddingVertical: 10, 
    paddingHorizontal: 22, 
    borderRadius: 20, 
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActiveGrad: { 
    paddingVertical: 10, 
    paddingHorizontal: 22, 
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  filterTabText: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
  },
  filterTabTextActive: { 
    fontSize: 13, 
    fontWeight: '900', 
    color: '#ffffff',
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-bold',
  },
  assessRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  assessIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  assessTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  assessMeta: { fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1.2 },
  statusText: { fontSize: 11, fontWeight: '800' },
  assessAction: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1.2, borderColor: '#C7D2FE' },

  // SLOs
  sloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  sloIndex: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF2FF', borderWidth: 1.5, borderColor: '#C7D2FE' },
  sloIndexText: { fontSize: 15, fontWeight: '900', color: '#4F46E5' },
  sloInput: { flex: 1, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, fontWeight: '700', color: '#0F172A', backgroundColor: '#F8FAFC', minHeight: 52, ...Platform.select({ web: { outlineStyle: 'none' } as any }) },
  sloDelete: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FECDD3', shadowColor: '#EF4444', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 1 },
  addSloRow: { flexDirection: 'row', gap: 12, marginTop: 10, alignItems: 'center' },
  addSloBtn: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },

  // MCQ Cards
  mcqCard: { 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    borderRadius: 24, 
    padding: 22, 
    marginBottom: 16, 
    backgroundColor: '#ffffff', 
    shadowColor: '#4F46E5', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 16, 
    elevation: 3 
  },
  qBadge: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14 },
  qBadgeText: { fontSize: 13, fontWeight: '900', color: '#fff', fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-bold' },
  bloomBadge: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5 },
  bloomText: { fontSize: 11, fontWeight: '900', letterSpacing: 0.5, fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium' },
  deleteBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FECDD3' },
  mcqQuestionInput: { 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    borderRadius: 14, 
    padding: 16, 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#0F172A', 
    backgroundColor: '#F8FAFC', 
    marginBottom: 16, 
    minHeight: 64, 
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Heavy' : 'sans-serif-medium',
    ...Platform.select({ web: { outlineStyle: 'none' } as any }) 
  },
  optionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    paddingHorizontal: 16,
    paddingVertical: 14, 
    borderRadius: 14, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    backgroundColor: '#ffffff', 
    marginBottom: 10 
  },
  optionRowCorrect: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  optionRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  optionRadioCorrect: { borderColor: '#10B981' },
  optionRadioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981' },
  optionLetter: { fontSize: 16, fontWeight: '900', width: 28 },
  optionInput: { 
    flex: 1, 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#334155', 
    padding: 0, 
    fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif',
    ...Platform.select({ web: { outlineStyle: 'none' } as any }) 
  },

  // Summary
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F8FAFC', borderRadius: 16, padding: 15, borderWidth: 1.2, borderColor: '#E2E8F0' },
  summaryIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.4 },
  summaryValue: { fontSize: 16, fontWeight: '900', color: '#0F172A', marginTop: 1 },

  // Publish
  publishOption: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18, borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 12, backgroundColor: '#F8FAFC' },
  publishOptionActive: { borderColor: '#6366F1', backgroundColor: '#EEF2FF' },
  publishRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  publishRadioActive: { borderColor: '#6366F1' },
  publishRadioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#6366F1' },
  publishLabel: { fontSize: 16, fontWeight: '900', color: '#0F172A' },
  publishSub: { fontSize: 12, color: '#64748B', fontWeight: '600', marginTop: 2 },

  // Loader
  loaderOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', alignItems: 'center', justifyContent: 'center', zIndex: 99 },
  loaderCard: { backgroundColor: '#ffffff', borderRadius: 28, padding: 32, alignItems: 'center', gap: 16, width: '82%', maxWidth: 340, borderWidth: 1.5, borderColor: '#E2E8F0', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 10 },
  loaderIconCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  loaderTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', textAlign: 'center', fontFamily: Platform.OS === 'ios' ? 'Avenir-Black' : 'sans-serif-bold' },
  loaderSub: { fontSize: 13, color: '#64748B', fontWeight: '600', textAlign: 'center', lineHeight: 20, fontFamily: Platform.OS === 'ios' ? 'Avenir-Medium' : 'sans-serif' },

  // Navigation
  navRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  prevBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, backgroundColor: '#F1F5F9', borderWidth: 1.5, borderColor: '#E2E8F0' },
  prevBtnText: { fontSize: 15, fontWeight: '800', color: '#475569' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 15, paddingHorizontal: 26, borderRadius: 16, shadowColor: '#6366F1', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  nextBtnText: { fontSize: 15, fontWeight: '900', color: '#fff' },
});
