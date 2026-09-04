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
  { id: 'mcq-1', title: "Nurse's Song", docName: 'english_ch3.pdf', slosCount: 3, status: 'Published', class: 'Grade 2', course: 'English', mcqs: generateSampleMcqs("Nurse's Song", ['Identify rhyming words', 'Understand poem theme', 'Express poetic emotion']), completions: 18, total: 20 },
  { id: 'mcq-2', title: 'Organism & Life Processes', docName: 'bio_ch1.pdf', slosCount: 4, status: 'Published', class: 'Grade 5', course: 'Biology', mcqs: generateSampleMcqs("Organism & Life Processes", ['Understand cell structure', 'Classify organisms', 'Describe respiration']), completions: 14, total: 22 },
  { id: 'mcq-3', title: 'Am I Alive?', docName: 'sci_ch2.pdf', slosCount: 2, status: 'Draft', class: 'Grade 3', course: 'Science', mcqs: generateSampleMcqs("Am I Alive?", ['Differentiate living and non-living', 'Identify basic survival needs']), completions: 0, total: 25 },
  { id: 'mcq-4', title: 'States of Matter', docName: 'chem_ch4.pdf', slosCount: 5, status: 'Published', class: 'Grade 6', course: 'Chemistry', mcqs: generateSampleMcqs("States of Matter", ['Differentiate solid liquid gas', 'Explain melting and boiling', 'Analyze particle arrangement']), completions: 21, total: 30 },
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
  
  const handleDeleteMcq = (id: string, idx: number) => {
    Alert.alert(
      'Delete Question',
      `Are you sure you want to delete Question ${idx + 1}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setMcqs(prev => prev.filter(m => m.id !== id))
        }
      ]
    );
  };

  const handleDeleteSlo = (idx: number) => {
    Alert.alert(
      'Remove SLO',
      `Are you sure you want to remove Learning Outcome #${idx + 1}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setSlos(prev => prev.filter((_, j) => j !== idx))
        }
      ]
    );
  };

  const handleDeleteAssessment = (id: string, aTitle: string) => {
    Alert.alert(
      'Delete Assessment',
      `Are you sure you want to delete "${aTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setAssessments(prev => prev.filter(x => x.id !== id))
        }
      ]
    );
  };

  const handleViewAssessment = (a: Assessment) => {
    const questions = (a.mcqs && a.mcqs.length > 0)
      ? a.mcqs
      : generateSampleMcqs(a.title, ['Core Concept Understanding', 'Practical Application', 'Analysis & Reasoning']);
    setActivePlayer({ ...a, mcqs: questions });
    setPlayerIndex(0);
    setPlayerAnswers({});
  };

  const filteredAssessments = assessments.filter(a => filterTab === 'All' || a.status === filterTab);
  const bloomColor = (b: string) => b === 'EASY' ? '#10B981' : b === 'MEDIUM' ? '#F59E0B' : '#EF4444';
  const bloomBg = (b: string) => b === 'EASY' ? '#ECFDF5' : b === 'MEDIUM' ? '#FFFBEB' : '#FEF2F2';

  const steps = ['Upload Doc', 'Define SLOs', 'Review MCQs', 'Publish'];

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* Light, airy, minimal ambient background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <SvgLinearGradient id="softMintGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#10B981" stopOpacity={0.06} />
              <Stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
            </SvgLinearGradient>
            <SvgLinearGradient id="softBlueGlow" x1="100%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#6366F1" stopOpacity={0.05} />
              <Stop offset="100%" stopColor="#10B981" stopOpacity={0.01} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="15%" cy="18%" r="140" fill="url(#softMintGlow)" />
          <Circle cx="88%" cy="45%" r="180" fill="url(#softBlueGlow)" />
          <Circle cx="35%" cy="80%" r="160" fill="url(#softMintGlow)" />
        </Svg>
      </View>
      <SafeAreaView style={{ flex: 1, alignSelf: 'center', width: '100%', maxWidth: 720 }} edges={['top']}>

        {/* ── Top Header ── */}
        <View style={S.header}>
          <TouchableOpacity style={S.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={18} color="#0F172A" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
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
                        backgroundColor: '#F1F5F9', 
                        borderWidth: 1.5, 
                        borderColor: '#CBD5E1',
                        shadowOpacity: 0.03, 
                        elevation: 1 
                      }]}>
                        <MaterialIcons 
                          name={step === 1 ? "cloud-upload" : step === 2 ? "track-changes" : step === 3 ? "quiz" : "publish"} 
                          size={15} 
                          color="#64748B" 
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

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} showsVerticalScrollIndicator={false}>

          {/* ═══════════ STEP 1 ═══════════ */}
          {wizardStep === 1 && (
            <>
              {/* Hero MCQ Builder Banner Card */}
              <View style={S.heroBanner}>
                <LinearGradient colors={['#ECFDF5', '#F0FDF4', '#EFF6FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.heroGrad}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <LinearGradient colors={['#FFFFFF', '#F0FDF4']} style={S.heroIconBox}>
                      <MaterialIcons name="quiz" size={28} color="#059669" />
                    </LinearGradient>
                    <View style={S.heroTag}>
                      <View style={S.heroTagDot} />
                      <Text style={S.heroTagText}>GENERATOR</Text>
                    </View>
                  </View>

                  <Text style={S.heroTitle}>MCQ Builder</Text>
                  <Text style={S.heroSub}>Smart quiz &amp; paper generator tool</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
                    <View style={S.activeChip}>
                      <View style={S.activeDot} />
                      <Text style={S.activeText}>{assessments.length} Active Assessments</Text>
                    </View>
                  </View>

                  {/* Decorative SVG doc */}
                  <View style={{ position: 'absolute', right: 18, bottom: 14, opacity: 0.18 }}>
                    <Svg width={74} height={74} viewBox="0 0 64 64">
                      <Rect x="8" y="4" width="40" height="52" rx="7" fill="#059669" />
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
                    <MaterialIcons name="description" size={20} color="#4F46E5" />
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
                      <MaterialIcons name="school" size={18} color="#4F46E5" style={{ marginRight: 8 }} />
                      <Text style={[S.input, !cls && { color: '#64748B' }]} numberOfLines={1}>{cls || 'Select Class'}</Text>
                      <MaterialIcons name={showClassDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#64748B" />
                    </TouchableOpacity>
                    {showClassDropdown && (
                      <View style={S.dropdownContainer}>
                        {classesList.map(c => (
                          <TouchableOpacity key={c} style={[S.dropdownItem, cls === c && S.dropdownItemActive]} onPress={() => { setCls(c); setShowClassDropdown(false); }}>
                            <Text style={[S.dropdownItemText, cls === c && S.dropdownItemTextActive]}>{c}</Text>
                            {cls === c && <MaterialIcons name="check" size={16} color="#4F46E5" />}
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
                      <MaterialIcons name="people" size={18} color="#4F46E5" style={{ marginRight: 8 }} />
                      <Text style={[S.input, !section && { color: '#64748B' }]} numberOfLines={1}>{section || 'Select Section'}</Text>
                      <MaterialIcons name={showSectionDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#64748B" />
                    </TouchableOpacity>
                    {showSectionDropdown && (
                      <View style={S.dropdownContainer}>
                        {/* Select All Option */}
                        <TouchableOpacity
                          style={[
                            S.dropdownItem,
                            { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' }
                          ]}
                          onPress={() => {
                            const currentList = section ? section.split(',').map(s => s.trim()).filter(Boolean) : [];
                            if (currentList.length === sectionsList.length) {
                              setSection('');
                            } else {
                              setSection(sectionsList.join(', '));
                            }
                          }}
                        >
                          <Text style={[S.dropdownItemText, { fontWeight: '900', color: '#4F46E5' }]}>
                            {section && section.split(',').map(s => s.trim()).filter(Boolean).length === sectionsList.length ? '✓ Deselect All' : '✦ Select All Sections'}
                          </Text>
                        </TouchableOpacity>

                        {sectionsList.map(s => {
                          const currentList = section ? section.split(',').map(item => item.trim()).filter(Boolean) : [];
                          const isSelected = currentList.includes(s);
                          return (
                            <TouchableOpacity 
                              key={s} 
                              style={[S.dropdownItem, isSelected && S.dropdownItemActive]} 
                              onPress={() => {
                                let updated: string[];
                                if (isSelected) {
                                  updated = currentList.filter(item => item !== s);
                                } else {
                                  updated = [...currentList, s];
                                }
                                setSection(updated.join(', '));
                              }}
                            >
                              <Text style={[S.dropdownItemText, isSelected && S.dropdownItemTextActive]}>{s}</Text>
                              <MaterialIcons 
                                name={isSelected ? "check-box" : "check-box-outline-blank"} 
                                size={18} 
                                color={isSelected ? "#4F46E5" : "#94A3B8"} 
                              />
                            </TouchableOpacity>
                          );
                        })}

                        <TouchableOpacity
                          style={{
                            backgroundColor: '#4F46E5',
                            paddingVertical: 9,
                            alignItems: 'center',
                            marginTop: 6,
                            borderRadius: 10
                          }}
                          onPress={() => setShowSectionDropdown(false)}
                        >
                          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 13 }}>Done Selecting</Text>
                        </TouchableOpacity>
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
                  <MaterialIcons name="book" size={18} color="#4F46E5" style={{ marginRight: 8 }} />
                  <Text style={[S.input, !course && { color: '#64748B' }]}>{course || 'Select Course'}</Text>
                  <MaterialIcons name={showCourseDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#64748B" />
                </TouchableOpacity>
                {showCourseDropdown && (
                  <View style={S.dropdownContainer}>
                    {coursesList.map(c => (
                      <TouchableOpacity key={c} style={[S.dropdownItem, course === c && S.dropdownItemActive]} onPress={() => { setCourse(c); setShowCourseDropdown(false); }}>
                        <Text style={[S.dropdownItemText, course === c && S.dropdownItemTextActive]}>{c}</Text>
                        {course === c && <MaterialIcons name="check" size={16} color="#4F46E5" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={S.label}>Assessment Title <Text style={{ color: '#EF4444' }}>*</Text></Text>
                <View style={[S.inputWrap, { borderColor: title ? '#4F46E5' : '#CBD5E1' }]}>
                  <MaterialIcons name="title" size={18} color="#4F46E5" style={{ marginRight: 8 }} />
                  <TextInput 
                    style={S.input} 
                    value={title} 
                    onChangeText={setTitle} 
                    placeholder="e.g. States of Matter Quiz" 
                    placeholderTextColor="#94A3B8" 
                  />
                </View>

                {/* Upload Zone */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 6 }}>
                  <Text style={S.label}>Upload Study Material</Text>
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>PDF, JPG, PNG • Max 10MB</Text>
                </View>

                <TouchableOpacity style={S.uploadZone} onPress={handlePickDocument} activeOpacity={0.85}>
                  <LinearGradient colors={['#F8FAFC', '#F0F9FF', '#F1F5F9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={S.uploadGrad}>
                    <View style={S.uploadIconCircle}>
                      <MaterialIcons name="cloud-upload" size={32} color="#0284C7" />
                    </View>
                    {docName ? (
                      <View style={{ alignItems: 'center', gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <MaterialIcons name="insert-drive-file" size={20} color="#059669" />
                          <Text style={{ fontSize: 14, fontWeight: '800', color: '#059669' }}>{docName}</Text>
                        </View>
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
              <View style={{ marginBottom: 16, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={handleNext} activeOpacity={0.88}>
                  <LinearGradient
                    colors={['#4F46E5', '#3730A3']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingVertical: 13,
                      paddingHorizontal: 26,
                      borderRadius: 14,
                      shadowColor: '#4F46E5',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Text style={{ fontSize: 14.5, fontWeight: '900', color: '#ffffff', letterSpacing: 0.2 }}>
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
                    { label: 'TOTAL', value: assessments.length, color: '#4F46E5', bg: ['#EEF2FF', '#E0E7FF'] as [string, string] },
                    { label: 'PUBLISHED', value: assessments.filter(a => a.status === 'Published').length, color: '#059669', bg: ['#ECFDF5', '#D1FAE5'] as [string, string] },
                    { label: 'SUBMITTED', value: 3, color: '#D97706', bg: ['#FFFBEB', '#FEF3C7'] as [string, string] },
                    { label: 'AVG SCORE', value: '78%', color: '#0284C7', bg: ['#E0F2FE', '#BAE6FD'] as [string, string] },
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
                            colors={['#4F46E5', '#3730A3']} 
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
                      <MaterialIcons name="quiz" size={18} color={a.status === 'Published' ? '#059669' : '#D97706'} />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text style={S.assessTitle} numberOfLines={1}>{a.title}</Text>
                      <Text style={S.assessMeta}>{a.class} • {a.course} • {a.slosCount} SLOs</Text>
                    </View>
                    <View style={[S.statusPill, { backgroundColor: a.status === 'Published' ? '#ECFDF5' : '#FEF3C7', borderColor: a.status === 'Published' ? '#6EE7B7' : '#FDE68A' }]}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: a.status === 'Published' ? '#059669' : '#D97706', marginRight: 4 }} />
                      <Text style={[S.statusText, { color: a.status === 'Published' ? '#059669' : '#92400E' }]}>{a.status}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 6, marginLeft: 8 }}>
                      <TouchableOpacity 
                        style={S.assessAction} 
                        onPress={() => handleViewAssessment(a)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="visibility" size={17} color="#4F46E5" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[S.assessAction, { backgroundColor: '#FFF1F2', borderColor: '#FECDD3' }]} 
                        onPress={() => handleDeleteAssessment(a.id, a.title)}
                        activeOpacity={0.7}
                      >
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
                  <View style={S.sloIndex}>
                    <Text style={S.sloIndexText}>{i + 1}</Text>
                  </View>
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
                    placeholderTextColor="#94A3B8"
                  />
                  <TouchableOpacity 
                    style={S.sloDelete} 
                    onPress={() => handleDeleteSlo(i)}
                  >
                    <MaterialIcons name="close" size={17} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {slos.length < 6 && (
                <View style={S.addSloRow}>
                  <View style={[S.inputWrap, { flex: 1, borderColor: '#CBD5E1', marginBottom: 0 }]}>
                    <MaterialIcons name="add" size={18} color="#4F46E5" style={{ marginRight: 8 }} />
                    <TextInput 
                      style={S.input} 
                      value={newSloText} 
                      onChangeText={setNewSloText} 
                      placeholder="Type new SLO..." 
                      placeholderTextColor="#94A3B8" 
                      onSubmitEditing={addSlo} 
                    />
                  </View>
                  <TouchableOpacity onPress={addSlo} activeOpacity={0.8}>
                    <LinearGradient colors={['#4F46E5', '#3730A3']} style={S.addSloBtn}>
                      <MaterialIcons name="add" size={22} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* Info tip box */}
              <View style={{ borderRadius: 14, padding: 14, marginTop: 16, flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: '#EFF6FF', borderWidth: 1.2, borderColor: '#BFDBFE' }}>
                <MaterialIcons name="lightbulb" size={20} color="#2563EB" />
                <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#1E40AF', lineHeight: 20 }}>
                  Well-defined SLOs help the AI generate more targeted and relevant MCQ questions for your students.
                </Text>
              </View>
            </View>
          )}

          {/* ═══════════ STEP 3: REVIEW MCQs ═══════════ */}
          {wizardStep === 3 && (
            <View style={S.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <View style={S.cardHeader}>
                  <LinearGradient colors={['#ECFDF5', '#D1FAE5']} style={S.cardHeaderIcon}>
                    <MaterialIcons name="auto-awesome" size={20} color="#059669" />
                  </LinearGradient>
                  <View>
                    <Text style={S.cardTitle}>Review Questions</Text>
                    <Text style={S.cardSub}>{mcqs.length} MCQs generated • Edit freely</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={addMcq} activeOpacity={0.85}>
                  <LinearGradient colors={['#4F46E5', '#3730A3']} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12 }}>
                    <MaterialIcons name="add" size={16} color="#fff" />
                    <Text style={{ fontSize: 13, fontWeight: '900', color: '#fff' }}>Add MCQ</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {mcqs.map((mcq, qi) => (
                <View key={mcq.id} style={S.mcqCard}>
                  {/* MCQ Header */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <LinearGradient colors={['#4F46E5', '#3730A3']} style={S.qBadge}>
                        <Text style={S.qBadgeText}>Q{qi + 1}</Text>
                      </LinearGradient>
                      <View style={[S.bloomBadge, { backgroundColor: bloomBg(mcq.bloom), borderColor: bloomColor(mcq.bloom) + '50' }]}>
                        <Text style={[S.bloomText, { color: bloomColor(mcq.bloom) }]}>{mcq.bloom}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={S.deleteBtn} 
                      onPress={() => handleDeleteMcq(mcq.id, qi)}
                    >
                      <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  {/* Question Input */}
                  <TextInput
                    style={S.mcqQuestionInput}
                    value={mcq.question}
                    onChangeText={v => updateMcq(mcq.id, 'question', v)}
                    multiline
                    placeholder="Question text..."
                    placeholderTextColor="#94A3B8"
                  />

                  {/* Options */}
                  {mcq.options.map((opt, oi) => {
                    const isCorrect = mcq.correctAnswer === oi;
                    return (
                      <TouchableOpacity key={oi} style={[S.optionRow, isCorrect && S.optionRowCorrect]} onPress={() => updateMcq(mcq.id, 'correctAnswer', oi)} activeOpacity={0.7}>
                        <View style={[S.optionRadio, isCorrect && S.optionRadioCorrect]}>
                          {isCorrect && <View style={S.optionRadioInner} />}
                        </View>
                        <Text style={[S.optionLetter, { color: isCorrect ? '#059669' : '#4F46E5' }]}>{String.fromCharCode(65 + oi)})</Text>
                        <TextInput 
                          style={S.optionInput} 
                          value={opt} 
                          onChangeText={v => updateMcqOption(mcq.id, oi, v)} 
                          placeholder={`Option ${String.fromCharCode(65 + oi)}`} 
                          placeholderTextColor="#94A3B8" 
                        />
                        {isCorrect && <MaterialIcons name="check-circle" size={18} color="#059669" />}
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
                  { label: 'Assessment Title', value: title, icon: 'title', color: '#4F46E5' },
                  { label: 'Class', value: cls, icon: 'school', color: '#0284C7' },
                  { label: 'Section', value: section, icon: 'people', color: '#059669' },
                  { label: 'Subject', value: course, icon: 'book', color: '#D97706' },
                  { label: 'Total Questions', value: `${mcqs.length} MCQs`, icon: 'quiz', color: '#7C3AED' },
                  { label: 'Learning Outcomes', value: `${slos.filter(s => s.trim()).length} SLOs`, icon: 'flag', color: '#DB2777' },
                ].map(row => (
                  <View key={row.label} style={S.summaryItem}>
                    <View style={[S.summaryIcon, { backgroundColor: row.color + '18' }]}>
                      <MaterialIcons name={row.icon as any} size={18} color={row.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={S.summaryLabel}>{row.label}</Text>
                      <Text style={S.summaryValue} numberOfLines={1}>{row.value || '—'}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Publish Status */}
              <Text style={[S.label, { marginTop: 18, marginBottom: 8 }]}>Publish Status</Text>
              {(['Published', 'Draft'] as const).map(s => (
                <TouchableOpacity key={s} style={[S.publishOption, publishStatus === s && S.publishOptionActive]} onPress={() => setPublishStatus(s)} activeOpacity={0.8}>
                  <View style={[S.publishRadio, publishStatus === s && S.publishRadioActive]}>
                    {publishStatus === s && <View style={S.publishRadioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[S.publishLabel, publishStatus === s && { color: '#4F46E5' }]}>{s}</Text>
                    <Text style={S.publishSub}>{s === 'Published' ? 'Students can see and take the quiz now' : 'Only you can view this draft'}</Text>
                  </View>
                  {publishStatus === s && <MaterialIcons name="check-circle" size={20} color="#4F46E5" />}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Loaders ── */}
          {isAnalyzing && (
            <View style={S.loaderOverlay}>
              <View style={S.loaderCard}>
                <View style={S.loaderIconCircle}>
                  <ActivityIndicator size="large" color="#4F46E5" />
                </View>
                <Text style={S.loaderTitle}>Analyzing Document...</Text>
                <Text style={S.loaderSub}>Extracting learning objectives and key concepts from your study material</Text>
              </View>
            </View>
          )}
          {isGenerating && (
            <View style={S.loaderOverlay}>
              <View style={S.loaderCard}>
                <View style={S.loaderIconCircle}>
                  <ActivityIndicator size="large" color="#7C3AED" />
                </View>
                <Text style={S.loaderTitle}>Generating 10 MCQs...</Text>
                <Text style={S.loaderSub}>AI is crafting targeted questions based on your learning outcomes</Text>
              </View>
            </View>
          )}

          {/* ── Nav Buttons ── */}
          {wizardStep > 1 && (
            <View style={S.navRow}>
              <TouchableOpacity style={S.prevBtn} onPress={handlePrev} activeOpacity={0.8}>
                <MaterialIcons name="arrow-back" size={18} color="#475569" />
                <Text style={S.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity onPress={handleNext} activeOpacity={0.88}>
                <LinearGradient
                  colors={wizardStep === 4 ? ['#10B981', '#059669'] : ['#4F46E5', '#3730A3']}
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

      {/* ── MCQ Player Modal (Full Screen Overlay) ── */}
      {activePlayer && (
        <Modal
          visible={!!activePlayer}
          animationType="slide"
          transparent={true}
          statusBarTranslucent={true}
          onRequestClose={() => setActivePlayer(null)}
        >
          <View style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#F8FAFC',
              zIndex: 999999,
              elevation: 999999,
              ...Platform.select({
                web: {
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 999999,
                  height: '100vh',
                  width: '100vw',
                } as any
              })
            }
          ]}>
            <LinearGradient colors={['#EEF2FF', '#F0F9FF', '#F8FAFC']} style={StyleSheet.absoluteFill} />
            <SafeAreaView style={{ flex: 1, width: '100%', maxWidth: 720, alignSelf: 'center' }} edges={['top', 'bottom']}>
              <View style={S.playerHeader}>
                <TouchableOpacity style={S.backBtn} onPress={() => setActivePlayer(null)} activeOpacity={0.7}>
                  <MaterialIcons name="close" size={20} color="#0F172A" />
                </TouchableOpacity>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={S.headerTitle} numberOfLines={1}>{activePlayer.title}</Text>
                  <Text style={S.headerSub}>MCQ Interactive Quiz</Text>
                </View>
                <View style={[S.generatorBadge, { borderColor: '#BAE6FD', backgroundColor: '#E0F2FE' }]}>
                  <Text style={{ fontSize: 11.5, fontWeight: '900', color: '#0369A1' }}>
                    {Object.keys(playerAnswers).length} / {activePlayer.mcqs?.length || 0} Answered
                  </Text>
                </View>
              </View>

              <ScrollView
                contentContainerStyle={{ padding: 18, alignItems: 'center', paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              >
                {activePlayer.mcqs && activePlayer.mcqs.length > 0 ? (
                  <View style={[S.card, { width: '100%', maxWidth: 620 }]}>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#4F46E5', marginBottom: 8 }}>
                      Question {playerIndex + 1} of {activePlayer.mcqs.length}
                    </Text>

                    {/* Progress bar */}
                    <View style={{ height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', marginBottom: 16 }}>
                      <LinearGradient
                        colors={['#4F46E5', '#0284C7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 6, borderRadius: 3, width: `${((playerIndex + 1) / activePlayer.mcqs.length) * 100}%` as any }}
                      />
                    </View>

                    <Text style={{ fontSize: 16.5, fontWeight: '800', color: '#0F172A', lineHeight: 24, marginBottom: 16 }}>
                      {activePlayer.mcqs[playerIndex]?.question}
                    </Text>

                    <View style={{ gap: 8 }}>
                      {activePlayer.mcqs[playerIndex]?.options.map((opt: string, idx: number) => {
                        const isSelected = playerAnswers[playerIndex] === idx;
                        const isCorrect = activePlayer.mcqs[playerIndex].correctAnswer === idx;
                        return (
                          <TouchableOpacity
                            key={idx}
                            style={[
                              S.optionRow,
                              isSelected && (isCorrect ? S.optionRowCorrect : { borderColor: '#F43F5E', backgroundColor: '#FFF1F2' })
                            ]}
                            onPress={() => setPlayerAnswers(prev => ({ ...prev, [playerIndex]: idx }))}
                            activeOpacity={0.8}
                          >
                            <View style={[S.optionRadio, isSelected && (isCorrect ? S.optionRadioCorrect : { borderColor: '#F43F5E' })]}>
                              {isSelected && <View style={[S.optionRadioInner, { backgroundColor: isCorrect ? '#10B981' : '#F43F5E' }]} />}
                            </View>
                            <Text style={[S.optionLetter, { color: isSelected ? (isCorrect ? '#10B981' : '#F43F5E') : '#4F46E5' }]}>
                              {String.fromCharCode(65 + idx)})
                            </Text>
                            <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#0F172A' }}>{opt}</Text>
                            {isSelected && (
                              <MaterialIcons name={isCorrect ? 'check-circle' : 'cancel'} size={18} color={isCorrect ? '#10B981' : '#F43F5E'} />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <View style={[S.navRow, { marginTop: 18 }]}>
                      <TouchableOpacity
                        disabled={playerIndex === 0}
                        style={[S.prevBtn, playerIndex === 0 && { opacity: 0.4 }]}
                        onPress={() => setPlayerIndex(p => Math.max(0, p - 1))}
                        activeOpacity={0.8}
                      >
                        <MaterialIcons name="arrow-back" size={16} color="#475569" />
                        <Text style={S.prevBtnText}>Prev</Text>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        onPress={() => {
                          if (playerIndex < activePlayer.mcqs.length - 1) {
                            setPlayerIndex(p => p + 1);
                          } else {
                            Alert.alert('🎉 Quiz Complete!', `You answered ${Object.keys(playerAnswers).length} of ${activePlayer.mcqs.length} questions.`);
                            setActivePlayer(null);
                          }
                        }}
                        activeOpacity={0.88}
                      >
                        <LinearGradient colors={['#10B981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={S.nextBtn}>
                          <Text style={S.nextBtnText}>{playerIndex < activePlayer.mcqs.length - 1 ? 'Next' : 'Finish Quiz'}</Text>
                          <MaterialIcons name={playerIndex < activePlayer.mcqs.length - 1 ? 'arrow-forward' : 'check'} size={16} color="#fff" />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={[S.card, { alignItems: 'center', gap: 12, paddingVertical: 36 }]}>
                    <View style={{ width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF2FF', borderWidth: 1.5, borderColor: '#C7D2FE' }}>
                      <MaterialIcons name="quiz" size={34} color="#4F46E5" />
                    </View>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: '#0F172A' }}>No Questions Yet</Text>
                    <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 }}>Generate MCQs using the 4-step wizard first.</Text>
                    <TouchableOpacity onPress={() => setActivePlayer(null)} activeOpacity={0.88}>
                      <LinearGradient colors={['#4F46E5', '#3730A3']} style={S.nextBtn}>
                        <Text style={S.nextBtnText}>Close</Text>
                        <MaterialIcons name="close" size={16} color="#fff" />
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

// ─── Premium Modern Styles ──────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // Header
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderBottomWidth: 1.5, 
    borderBottomColor: '#E2E8F0', 
    backgroundColor: '#ffffff' 
  },
  playerHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderBottomWidth: 1.5, 
    borderBottomColor: '#E2E8F0', 
    backgroundColor: '#ffffff' 
  },
  backBtn: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#F8FAFC', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  headerTitle: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#0F172A', 
    letterSpacing: -0.2
  },
  headerSub: { 
    fontSize: 11, 
    color: '#64748B', 
    fontWeight: '600', 
    marginTop: 1
  },
  generatorBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingVertical: 3.5, 
    paddingHorizontal: 8, 
    borderRadius: 12, 
    borderWidth: 1.2, 
    borderColor: '#A7F3D0', 
    backgroundColor: '#ECFDF5' 
  },
  generatorDot: { 
    width: 5, 
    height: 5, 
    borderRadius: 2.5, 
    backgroundColor: '#059669' 
  },
  generatorBadgeText: { 
    fontSize: 9.5, 
    fontWeight: '900', 
    color: '#059669', 
    letterSpacing: 0.4 
  },

  // Progress
  progressContainer: { 
    borderBottomWidth: 1.5, 
    borderBottomColor: '#E2E8F0', 
    backgroundColor: '#ffffff',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  progressInner: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    backgroundColor: 'transparent' 
  },
  stepDot: { 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 2, 
    shadowColor: '#4F46E5', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 3, 
    elevation: 2 
  },
  stepNum: { 
    fontSize: 11.5, 
    fontWeight: '900'
  },
  stepLabel: { 
    fontSize: 10, 
    fontWeight: '700', 
    textAlign: 'center', 
    maxWidth: 70, 
    marginTop: 2, 
    lineHeight: 13,
    letterSpacing: 0.1
  },
  stepLabelActive: { color: '#4F46E5' },
  stepLabelDone: { color: '#059669' },
  stepLabelInactive: { color: '#64748B' },
  stepLine: { flex: 1, height: 2, marginTop: 13, marginHorizontal: 4, borderRadius: 1 },
  stepLineDone: { backgroundColor: '#10B981' },
  stepLineInactive: { backgroundColor: '#E2E8F0' },

  // Hero Banner
  heroBanner: { 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginBottom: 12, 
    borderWidth: 1.5, 
    borderColor: '#A7F3D0',
    shadowColor: '#059669', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 8, 
    elevation: 2 
  },
  heroGrad: { padding: 14, minHeight: 80 },
  heroIconBox: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1.2, 
    borderColor: '#A7F3D0', 
    shadowColor: '#059669', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 4, 
    elevation: 1 
  },
  heroTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingVertical: 3.5, 
    paddingHorizontal: 8, 
    borderRadius: 12, 
    borderWidth: 1.2, 
    borderColor: '#A7F3D0',
    backgroundColor: '#FFFFFF'
  },
  heroTagDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#059669' },
  heroTagText: { fontSize: 9.5, fontWeight: '900', color: '#059669', letterSpacing: 0.4 },
  heroTitle: { fontSize: 16, fontWeight: '800', color: '#064E3B', letterSpacing: -0.2, marginBottom: 2 },
  heroSub: { fontSize: 11.5, fontWeight: '600', color: '#065F46' },
  activeChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingVertical: 3.5, 
    paddingHorizontal: 8, 
    borderRadius: 12, 
    borderWidth: 1.2, 
    borderColor: '#A7F3D0',
    backgroundColor: '#FFFFFF'
  },
  activeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#059669' },
  activeText: { fontSize: 11, fontWeight: '800', color: '#047857' },

  // Card
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 14, 
    marginBottom: 12, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    shadowColor: '#0F172A', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 8, 
    elevation: 2 
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardHeaderIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 14.5, fontWeight: '800', color: '#0F172A' },
  cardSub: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 1 },

  // Form
  formRow: { flexDirection: 'row', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 4, letterSpacing: 0.1 },
  inputWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    backgroundColor: '#F8FAFC', 
    marginBottom: 8 
  },
  input: { 
    flex: 1, 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#0F172A', 
    padding: 0, 
    ...Platform.select({ web: { outlineStyle: 'none' } as any }) 
  },
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    marginTop: -4,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemActive: {
    backgroundColor: '#EEF2FF',
  },
  dropdownItemText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  dropdownItemTextActive: {
    color: '#4F46E5',
    fontWeight: '900',
  },

  // Upload
  uploadZone: { 
    borderRadius: 16, 
    overflow: 'hidden', 
    borderWidth: 1.5, 
    borderColor: '#93C5FD', 
    borderStyle: 'dashed',
    backgroundColor: '#F8FAFC' 
  },
  uploadGrad: { padding: 20, alignItems: 'center', gap: 8 },
  uploadIconCircle: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#E0F2FE',
    marginBottom: 4 
  },
  uploadTitle: { fontSize: 15, fontWeight: '800', color: '#0369A1' },
  uploadSub: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  sampleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, justifyContent: 'center' },
  sampleChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 10, 
    backgroundColor: '#EFF6FF', 
    borderWidth: 1.2, 
    borderColor: '#BFDBFE' 
  },
  sampleChipText: { fontSize: 11, fontWeight: '800', color: '#2563EB' },

  // Dashboard
  metricsRow: { flexDirection: 'row', gap: 6, marginBottom: 10 },
  metricCard: { 
    flex: 1, 
    paddingVertical: 9, 
    paddingHorizontal: 6, 
    borderRadius: 12, 
    alignItems: 'center', 
    gap: 2, 
    borderWidth: 1.2, 
    borderColor: 'rgba(0,0,0,0.06)' 
  },
  metricValue: { fontSize: 17, fontWeight: '900' },
  metricLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.3, textAlign: 'center' },
  filterTabRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  filterTabInactive: { 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 12, 
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActiveGrad: { 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  filterTabText: { 
    fontSize: 11.5, 
    fontWeight: '700', 
    color: '#64748B',
  },
  filterTabTextActive: { 
    fontSize: 11.5, 
    fontWeight: '900', 
    color: '#ffffff',
  },
  assessRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingVertical: 9, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9' 
  },
  assessIconBox: { 
    width: 34, 
    height: 34, 
    borderRadius: 9, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  assessTitle: { fontSize: 13.5, fontWeight: '800', color: '#0F172A' },
  assessMeta: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 1 },
  statusPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 3, 
    paddingHorizontal: 8, 
    borderRadius: 10, 
    borderWidth: 1.2 
  },
  statusText: { fontSize: 10, fontWeight: '800' },
  assessAction: { 
    width: 30, 
    height: 30, 
    borderRadius: 9, 
    backgroundColor: '#EEF2FF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1.2, 
    borderColor: '#C7D2FE' 
  },

  // SLOs
  sloRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  sloIndex: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#EEF2FF', 
    borderWidth: 1.5, 
    borderColor: '#C7D2FE' 
  },
  sloIndexText: { fontSize: 13, fontWeight: '900', color: '#4F46E5' },
  sloInput: { 
    flex: 1, 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#0F172A', 
    backgroundColor: '#FFFFFF', 
    minHeight: 42, 
    ...Platform.select({ web: { outlineStyle: 'none' } as any }) 
  },
  sloDelete: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: '#FFF1F2', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1.2, 
    borderColor: '#FECDD3' 
  },
  addSloRow: { flexDirection: 'row', gap: 8, marginTop: 6, alignItems: 'center' },
  addSloBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#4F46E5', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 5, 
    elevation: 3 
  },

  // MCQ Cards
  mcqCard: { 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    borderRadius: 14, 
    padding: 12, 
    marginBottom: 12, 
    backgroundColor: '#ffffff', 
    shadowColor: '#0F172A', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    elevation: 2 
  },
  qBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  qBadgeText: { fontSize: 11.5, fontWeight: '900', color: '#fff' },
  bloomBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1.2 },
  bloomText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.4 },
  deleteBtn: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    backgroundColor: '#FFF1F2', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1.2, 
    borderColor: '#FECDD3' 
  },
  mcqQuestionInput: { 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    borderRadius: 12, 
    padding: 10, 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#0F172A', 
    backgroundColor: '#F8FAFC', 
    marginBottom: 10, 
    minHeight: 46, 
    lineHeight: 20,
    ...Platform.select({ web: { outlineStyle: 'none' } as any }) 
  },
  optionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    paddingHorizontal: 12,
    paddingVertical: 8, 
    borderRadius: 12, 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    backgroundColor: '#ffffff', 
    marginBottom: 6 
  },
  optionRowCorrect: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  optionRadio: { 
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  optionRadioCorrect: { borderColor: '#10B981' },
  optionRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' },
  optionLetter: { fontSize: 13.5, fontWeight: '900', width: 22 },
  optionInput: { 
    flex: 1, 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#334155', 
    padding: 0,
    ...Platform.select({ web: { outlineStyle: 'none' } as any }) 
  },

  // Summary
  summaryItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    backgroundColor: '#F8FAFC', 
    borderRadius: 12, 
    padding: 10, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0' 
  },
  summaryIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  summaryLabel: { fontSize: 10.5, fontWeight: '700', color: '#64748B', letterSpacing: 0.2 },
  summaryValue: { fontSize: 13.5, fontWeight: '900', color: '#0F172A', marginTop: 1 },

  // Publish
  publishOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    padding: 12, 
    borderRadius: 14, 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    marginBottom: 8, 
    backgroundColor: '#F8FAFC' 
  },
  publishOptionActive: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  publishRadio: { 
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    borderWidth: 1.5, 
    borderColor: '#CBD5E1', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  publishRadioActive: { borderColor: '#4F46E5' },
  publishRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4F46E5' },
  publishLabel: { fontSize: 13.5, fontWeight: '900', color: '#0F172A' },
  publishSub: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 1 },

  // Loader
  loaderOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.45)', alignItems: 'center', justifyContent: 'center', zIndex: 99 },
  loaderCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 22, alignItems: 'center', gap: 12, width: '80%', maxWidth: 300, borderWidth: 1.5, borderColor: '#E2E8F0', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 8 },
  loaderIconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF2FF', marginBottom: 2 },
  loaderTitle: { fontSize: 16, fontWeight: '900', color: '#0F172A', textAlign: 'center' },
  loaderSub: { fontSize: 12, color: '#64748B', fontWeight: '600', textAlign: 'center', lineHeight: 17 },

  // Navigation
  navRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  prevBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 5, 
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    backgroundColor: '#F1F5F9', 
    borderWidth: 1.2, 
    borderColor: '#CBD5E1' 
  },
  prevBtnText: { fontSize: 13, fontWeight: '800', color: '#475569' },
  nextBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingVertical: 11, 
    paddingHorizontal: 20, 
    borderRadius: 12, 
    shadowColor: '#4F46E5', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 8, 
    elevation: 4 
  },
  nextBtnText: { fontSize: 13, fontWeight: '900', color: '#fff' },
});

