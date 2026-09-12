import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Platform,
  Pressable,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useAppTheme } from '../../context/ThemeContext';

interface WorksheetScreenProps {
  navigation: any;
}

export interface WorksheetData {
  id: string;
  topic: string;
  language: string;
  level: string;
  color: string;
  date: string;
  instructions: string;
  wordBank: string[];
  fillBlanks: { id: number; question: string; answer: string }[];
  mcqs: { id: number; question: string; options: string[]; answerIndex: number }[];
  shortAnswers: { id: number; question: string; lines: number }[];
}

export const WorksheetScreen: React.FC<WorksheetScreenProps> = ({ navigation }) => {
  const { theme: appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';

  // Input Form States
  const [requestInput, setRequestInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('Level 4');
  const [fileName, setFileName] = useState('');

  // Picker Modal States
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  // Generation Loading States
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Analyzing request topic...');

  // Active View Plan Modal State
  const [activeWorksheet, setActiveWorksheet] = useState<WorksheetData | null>(null);

  // Worksheets State
  const [, setWorksheets] = useState<WorksheetData[]>([]);

  // Mock File Selector Action
  const handleToggleMockFile = () => {
    if (fileName) {
      setFileName('');
    } else {
      setFileName('Chapter_Diagram_Source.pdf');
    }
  };

  // Generate Action Simulation
  const handleGenerateWorksheet = () => {
    if (generating) return;

    const topicText = requestInput.trim() || 'States of Matter';
    setGenerating(true);
    setProgress(0);
    setProgressStatus('Analyzing worksheet requirements...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next === 20) setProgressStatus('Synthesizing Fill in the Blanks & Word Bank...');
        if (next === 50) setProgressStatus('Formulating Multiple Choice Questions...');
        if (next === 75) setProgressStatus('Structuring Short Answer Prompts...');
        if (next === 90) setProgressStatus('Finalizing Print-Ready PDF Schema...');
        if (next >= 100) {
          clearInterval(interval);
          setGenerating(false);

          // Add generated worksheet
          const newWorksheet: WorksheetData = {
            id: `ws-${Date.now()}`,
            topic: topicText,
            language: language,
            level: level,
            color: '#0D9488',
            date: 'Just now',
            instructions: 'Read each section carefully. Complete the fill-in-the-blanks using the word bank provided, answer all multiple-choice questions, and write your responses clearly in the space provided.',
            wordBank: ['Concept A', 'Concept B', 'Process', 'System', 'Variable', 'Energy', 'Output', 'Structure'],
            fillBlanks: [
              { id: 1, question: `In studying ${topicText}, the primary component is known as ________.`, answer: 'Concept A' },
              { id: 2, question: 'The rate of transformation depends directly on the system ________.', answer: 'Variable' },
              { id: 3, question: 'Energy is conserved throughout the entire ________.', answer: 'Process' }
            ],
            mcqs: [
              {
                id: 1,
                question: `Which statement accurately describes the core principle of ${topicText}?`,
                options: [
                  'It operates independently without external energy input.',
                  'It represents a structured system driven by key variables.',
                  'It only occurs under laboratory conditions.'
                ],
                answerIndex: 1
              },
              {
                id: 2,
                question: 'What is the expected outcome when key input parameters are doubled?',
                options: [
                  'The overall output increases proportionally.',
                  'The process stops immediately.',
                  'No observable change occurs.'
                ],
                answerIndex: 0
              }
            ],
            shortAnswers: [
              { id: 1, question: `Explain why ${topicText} is essential in everyday applications.`, lines: 2 },
              { id: 2, question: 'Summarize the primary relationship between input energy and system response.', lines: 2 }
            ]
          };

          setWorksheets((prev) => [newWorksheet, ...prev]);
          setActiveWorksheet(newWorksheet);
          setRequestInput('');
          return 100;
        }
        return next;
      });
    }, 110);
  };

  if (activeWorksheet) {
    return (
      <View style={[styles.fullScreenModalWrapper, !isDefaultTheme && { backgroundColor: appTheme.bg }]}>
        <SafeAreaView style={[styles.sheetSafeArea, !isDefaultTheme && { backgroundColor: appTheme.bg }]} edges={['top', 'bottom']}>
          {/* Viewer Navigation Bar */}
          <View style={[styles.sheetNavBar, { maxWidth: 768, width: '100%', alignSelf: 'center' }, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderBottomColor: appTheme.border }]}>
            <TouchableOpacity style={[styles.sheetCloseBtn, !isDefaultTheme && { backgroundColor: appTheme.surface }]} onPress={() => setActiveWorksheet(null)} activeOpacity={0.8}>
              <MaterialIcons name="arrow-back" size={20} color={isDefaultTheme ? "#0E7490" : appTheme.primary} />
            </TouchableOpacity>

            <Text style={[styles.sheetNavTitle, !isDefaultTheme && { color: appTheme.textPrimary }]} numberOfLines={1}>{activeWorksheet.topic}</Text>

            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <TouchableOpacity
                style={[styles.sheetDownloadBtn, !isDefaultTheme && { backgroundColor: appTheme.primary }]}
                onPress={() => Alert.alert('Download PDF', 'Worksheet PDF downloaded to your device.')}
                activeOpacity={0.8}
              >
                <MaterialIcons name="file-download" size={15} color="#fff" style={{ marginRight: 3 }} />
                <Text style={styles.sheetDownloadText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sheetPrintBtn, !isDefaultTheme && { backgroundColor: appTheme.accent }]}
                onPress={() => Alert.alert('Print Worksheet', 'Worksheet sent to print queue as PDF.')}
                activeOpacity={0.8}
              >
                <MaterialIcons name="print" size={15} color="#fff" style={{ marginRight: 3 }} />
                <Text style={styles.sheetPrintText}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Paper Sheet Container */}
          <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={[styles.sheetScrollContainer, { maxWidth: 768, width: '100%', alignSelf: 'center' }]} showsVerticalScrollIndicator={false}>
            <View style={[styles.paperSheetCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
              
              {/* Paper Top Title Header */}
              <View style={[styles.paperHeader, !isDefaultTheme && { borderBottomColor: appTheme.primary }]}>
                <Text style={[styles.paperMainTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>{activeWorksheet.topic}</Text>
                <View style={styles.paperBadgeRow}>
                  <View style={[styles.paperMetaBadge, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.paperMetaBadgeText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{activeWorksheet.language}</Text>
                  </View>
                  <View style={[styles.paperMetaBadge, { backgroundColor: '#ECFEFF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.paperMetaBadgeText, { color: '#0E7490' }, !isDefaultTheme && { color: appTheme.primary }]}>{activeWorksheet.level}</Text>
                  </View>
                </View>

                {/* Fillable Student Info Line */}
                <View style={styles.studentInfoBox}>
                  <Text style={[styles.studentInfoText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Name: <Text style={[styles.studentInfoLine, !isDefaultTheme && { color: appTheme.border }]}>___________________________</Text></Text>
                  <Text style={[styles.studentInfoText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Date: <Text style={[styles.studentInfoLine, !isDefaultTheme && { color: appTheme.border }]}>____________</Text></Text>
                  <Text style={[styles.studentInfoText, !isDefaultTheme && { color: appTheme.textSecondary }]}>Score: <Text style={[styles.studentInfoLine, !isDefaultTheme && { color: appTheme.border }]}>______</Text></Text>
                </View>
              </View>

              {/* Instructions Box */}
              <View style={[styles.instructionsContainer, !isDefaultTheme && { backgroundColor: appTheme.surface, borderLeftColor: appTheme.primary }]}>
                <Text style={[styles.instructionsHeading, !isDefaultTheme && { color: appTheme.primary }]}>Instructions:</Text>
                <Text style={[styles.instructionsBody, !isDefaultTheme && { color: appTheme.textSecondary }]}>{activeWorksheet.instructions}</Text>
              </View>

              {/* PART 1: FILL IN THE BLANKS */}
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, !isDefaultTheme && { color: appTheme.primary, borderBottomColor: appTheme.border }]}>Part 1: Fill in the Blanks</Text>
                
                {/* Word Bank Box */}
                <View style={[styles.wordBankCard, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                  <Text style={[styles.wordBankTitle, !isDefaultTheme && { color: appTheme.primary }]}>Word Bank:</Text>
                  <Text style={[styles.wordBankWords, !isDefaultTheme && { color: appTheme.textSecondary }]}>{activeWorksheet.wordBank.join(', ')}</Text>
                </View>

                {/* Questions */}
                {activeWorksheet.fillBlanks.map((q) => (
                  <View key={q.id} style={styles.questionItem}>
                    <Text style={[styles.questionText, !isDefaultTheme && { color: appTheme.textPrimary }]}>
                      <Text style={{ fontWeight: '800' }}>{q.id}. </Text>
                      {q.question}
                    </Text>
                  </View>
                ))}
              </View>

              {/* PART 2: MULTIPLE CHOICE QUESTIONS */}
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, !isDefaultTheme && { color: appTheme.primary, borderBottomColor: appTheme.border }]}>Part 2: Multiple Choice Questions</Text>
                
                {activeWorksheet.mcqs.map((mcq) => (
                  <View key={mcq.id} style={styles.mcqBlock}>
                    <Text style={[styles.questionText, !isDefaultTheme && { color: appTheme.textPrimary }]}>
                      <Text style={{ fontWeight: '800' }}>{mcq.id}. </Text>
                      {mcq.question}
                    </Text>

                    <View style={styles.mcqOptionsList}>
                      {mcq.options.map((opt, idx) => {
                        const letter = String.fromCharCode(65 + idx);
                        return (
                          <View key={idx} style={styles.mcqOptionRow}>
                            <Text style={[styles.mcqOptionLetter, !isDefaultTheme && { color: appTheme.primary }]}>•  {letter}) </Text>
                            <Text style={[styles.mcqOptionText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{opt}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>

              {/* PART 3: SHORT ANSWER QUESTIONS */}
              <View style={styles.sectionBlock}>
                <Text style={[styles.sectionHeading, !isDefaultTheme && { color: appTheme.primary, borderBottomColor: appTheme.border }]}>Part 3: Short Answer Questions</Text>

                {activeWorksheet.shortAnswers.map((sa) => (
                  <View key={sa.id} style={styles.shortAnsBlock}>
                    <Text style={[styles.questionText, !isDefaultTheme && { color: appTheme.textPrimary }]}>
                      <Text style={{ fontWeight: '800' }}>{sa.id}. </Text>
                      {sa.question}
                    </Text>

                    <View style={styles.answerLinesContainer}>
                      <View style={[styles.writeLine, !isDefaultTheme && { backgroundColor: appTheme.border }]} />
                      <View style={[styles.writeLine, !isDefaultTheme && { backgroundColor: appTheme.border }]} />
                    </View>
                  </View>
                ))}
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: appTheme.bg }]} edges={['top']}>

      {/* ── Ambient Mesh Backdrop ── */}
      {isDefaultTheme && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
          <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Circle cx="105%" cy="-5%" r="320" fill="#06B6D4" opacity={0.07} />
            <Circle cx="-10%" cy="50%" r="300" fill="#0891B2" opacity={0.06} />
            <Circle cx="80%" cy="95%" r="340" fill="#22D3EE" opacity={0.06} />
          </Svg>
        </View>
      )}

      {/* ── HEADER BANNER ── */}
      <LinearGradient colors={isDefaultTheme ? ['#0E7490', '#06B6D4'] : appTheme.bannerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={{ position: 'absolute', right: -35, top: -50, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(34, 211, 238, 0.2)' }} />
        <View style={{ position: 'absolute', left: -25, bottom: -45, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(6, 182, 212, 0.16)' }} />

        <View style={[styles.headerContent, { maxWidth: 720, width: '100%', alignSelf: 'center' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.08)']} style={styles.headerIconBox}>
              <MaterialIcons name="description" size={22} color="#fff" />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>AI Worksheet Generator</Text>
              <Text style={styles.headerSubtitle}>Print-ready practice sheets · Word banks · MCQs & Q&A</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      {/* Cyan Accent Line */}
      <LinearGradient colors={isDefaultTheme ? ['#22D3EE', '#67E8F9'] : [appTheme.primary, appTheme.accent, appTheme.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerBarGlow} />

      <ScrollView contentContainerStyle={[styles.scrollContainer, { maxWidth: 720, width: '100%', alignSelf: 'center' }]} showsVerticalScrollIndicator={false}>

        {/* ── FORM CARD ── */}
        <View style={[styles.card, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>

          {/* YOUR REQUEST */}
          <View style={styles.fieldHeader}>
            <View style={[styles.fieldDot, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />
            <Text style={[styles.sectionLabel, !isDefaultTheme && { color: appTheme.textPrimary }]}>Your Request</Text>
          </View>
          <TextInput
            style={[styles.requestTextArea, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border, color: appTheme.textPrimary }]}
            placeholder="Describe your worksheet topic… e.g. States of Matter, Fractions, Photosynthesis"
            placeholderTextColor={isDefaultTheme ? "#94A3B8" : appTheme.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={requestInput}
            onChangeText={setRequestInput}
            editable={!generating}
          />

          {/* LEVEL & LANGUAGE */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <View style={styles.fieldHeader}>
                <View style={[styles.fieldDot, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />
                <Text style={[styles.sectionLabel, !isDefaultTheme && { color: appTheme.textPrimary }]}>Level</Text>
              </View>
              <TouchableOpacity
                style={[styles.pickerButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}
                onPress={() => !generating && setLevelModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.pickerLeft}>
                  <LinearGradient colors={isDefaultTheme ? ['#ECFEFF', '#CFFAFE'] : [appTheme.surface, appTheme.cardBg]} style={styles.pickerIconOrb}>
                    <MaterialIcons name="school" size={15} color={isDefaultTheme ? "#0891B2" : appTheme.primary} />
                  </LinearGradient>
                  <Text style={[styles.pickerButtonText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{level}</Text>
                </View>
                <MaterialIcons name="expand-more" size={20} color={isDefaultTheme ? "#94A3B8" : appTheme.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.gridCol}>
              <View style={styles.fieldHeader}>
                <View style={[styles.fieldDot, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />
                <Text style={[styles.sectionLabel, !isDefaultTheme && { color: appTheme.textPrimary }]}>Language</Text>
              </View>
              <TouchableOpacity
                style={[styles.pickerButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}
                onPress={() => !generating && setLangModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.pickerLeft}>
                  <LinearGradient colors={isDefaultTheme ? ['#ECFEFF', '#CFFAFE'] : [appTheme.surface, appTheme.cardBg]} style={styles.pickerIconOrb}>
                    <MaterialIcons name="translate" size={15} color={isDefaultTheme ? "#0891B2" : appTheme.primary} />
                  </LinearGradient>
                  <Text style={[styles.pickerButtonText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{language}</Text>
                </View>
                <MaterialIcons name="expand-more" size={20} color={isDefaultTheme ? "#94A3B8" : appTheme.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ATTACH FILE */}
          <View style={styles.fieldHeader}>
            <View style={[styles.fieldDot, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />
            <Text style={[styles.sectionLabel, !isDefaultTheme && { color: appTheme.textPrimary }]}>Attach File  <Text style={{ color: isDefaultTheme ? '#94A3B8' : appTheme.textMuted, fontWeight: '600', textTransform: 'none' }}>optional</Text></Text>
          </View>
          <TouchableOpacity
            style={[styles.fileAttachmentBox, fileName ? styles.fileAttachmentBoxActive : null, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: fileName ? appTheme.primary : appTheme.border }]}
            onPress={handleToggleMockFile}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={fileName ? (isDefaultTheme ? ['#CFFAFE', '#ECFEFF'] : [appTheme.surface, appTheme.cardBg]) : (isDefaultTheme ? ['#F1F5F9', '#F8FAFC'] : [appTheme.surface, appTheme.cardBg])}
              style={styles.fileIconOrb}
            >
              <MaterialIcons
                name={fileName ? "insert-drive-file" : "cloud-upload"}
                size={18}
                color={fileName ? (isDefaultTheme ? "#0891B2" : appTheme.primary) : (isDefaultTheme ? "#94A3B8" : appTheme.textMuted)}
              />
            </LinearGradient>
            <Text style={[styles.fileAttachmentText, fileName ? styles.fileAttachmentTextActive : null, !isDefaultTheme && { color: fileName ? appTheme.primary : appTheme.textMuted }]} numberOfLines={1}>
              {fileName ? fileName : "Tap to choose a file (Image / PDF)"}
            </Text>
            {fileName && (
              <TouchableOpacity onPress={() => setFileName('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialIcons name="close" size={17} color={isDefaultTheme ? "#94A3B8" : appTheme.textMuted} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* ── GENERATE BUTTON ── */}
          {!generating ? (
            <TouchableOpacity
              style={styles.generateBtnContainer}
              onPress={handleGenerateWorksheet}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={isDefaultTheme ? ['#0891B2', '#06B6D4', '#0284C7'] : [appTheme.primary, appTheme.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.generateBtn}
              >
                <View style={styles.generateBtnHighlight} />

                <View style={styles.generateBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={20} color="#22D3EE" />
                </View>

                <View style={styles.generateBtnDivider} />

                <View style={styles.generateBtnLabelBlock}>
                  <Text style={styles.generateBtnText} numberOfLines={1}>Generate Worksheet</Text>
                  <Text style={styles.generateBtnSubText} numberOfLines={1}>Word Bank · MCQs · Q&A · PDF Ready</Text>
                </View>

                <LinearGradient
                  colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.generateBtnArrow}
                >
                  <MaterialIcons name="double-arrow" size={16} color="#fff" />
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={[styles.generatingContainer, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.primary }]}>
              <ActivityIndicator color={isDefaultTheme ? "#0891B2" : appTheme.primary} size="small" style={{ marginRight: 10 }} />
              <Text style={[styles.generatingButtonText, !isDefaultTheme && { color: appTheme.primary }]}>Generating worksheet…</Text>
            </View>
          )}
        </View>

        {/* ── PROCESSING LOADER ── */}
        {generating && (
          <View style={[styles.loaderCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
            <View style={styles.loaderHeader}>
              <ActivityIndicator color={isDefaultTheme ? "#0891B2" : appTheme.primary} size="small" style={{ marginRight: 10 }} />
              <Text style={[styles.loaderStatus, !isDefaultTheme && { color: appTheme.textPrimary }]}>{progressStatus}</Text>
            </View>
            <View style={[styles.progressBarBg, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
              <LinearGradient
                colors={isDefaultTheme ? ['#0891B2', '#22D3EE'] : appTheme.primaryGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={[styles.loaderPercentage, !isDefaultTheme && { color: appTheme.textSecondary }]}>{progress}% Complete</Text>
          </View>
        )}
      </ScrollView>

      {/* ── LEVEL SELECTOR PICKER MODAL ── */}
      <Modal visible={levelModalVisible} transparent={true} animationType="slide">
        <PressableModalBackdrop onClose={() => setLevelModalVisible(false)}>
          <View style={[styles.pickerModalContainer, !isDefaultTheme && { backgroundColor: appTheme.cardBg }]}>
            <View style={[styles.sheetHandle, !isDefaultTheme && { backgroundColor: appTheme.border }]} />
            <Text style={[styles.pickerModalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Select Grade Level</Text>
            {['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8'].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.pickerModalItem, level === l && styles.pickerModalItemActive, !isDefaultTheme && { backgroundColor: level === l ? appTheme.surface : 'transparent' }]}
                onPress={() => {
                  setLevel(l);
                  setLevelModalVisible(false);
                }}
              >
                <Text style={[styles.pickerModalItemText, level === l && styles.pickerModalItemTextActive, !isDefaultTheme && { color: level === l ? appTheme.primary : appTheme.textPrimary }]}>{l}</Text>
                {level === l && <MaterialIcons name="check" size={18} color={isDefaultTheme ? "#0891B2" : appTheme.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </PressableModalBackdrop>
      </Modal>

      {/* ── LANGUAGE SELECTOR PICKER MODAL ── */}
      <Modal visible={langModalVisible} transparent={true} animationType="slide">
        <PressableModalBackdrop onClose={() => setLangModalVisible(false)}>
          <View style={[styles.pickerModalContainer, !isDefaultTheme && { backgroundColor: appTheme.cardBg }]}>
            <View style={[styles.sheetHandle, !isDefaultTheme && { backgroundColor: appTheme.border }]} />
            <Text style={[styles.pickerModalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Select Language</Text>
            {['English', 'Urdu', 'Punjabi', 'Sindhi', 'Pashto'].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.pickerModalItem, language === l && styles.pickerModalItemActive, !isDefaultTheme && { backgroundColor: language === l ? appTheme.surface : 'transparent' }]}
                onPress={() => {
                  setLanguage(l);
                  setLangModalVisible(false);
                }}
              >
                <Text style={[styles.pickerModalItemText, language === l && styles.pickerModalItemTextActive, !isDefaultTheme && { color: language === l ? appTheme.primary : appTheme.textPrimary }]}>{l}</Text>
                {language === l && <MaterialIcons name="check" size={18} color={isDefaultTheme ? "#0891B2" : appTheme.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </PressableModalBackdrop>
      </Modal>

    </SafeAreaView>
  );
};

// Pressable Backdrop helper to easily dismiss pickers
const PressableModalBackdrop = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return (
    <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
      <Pressable style={{ width: '100%' }}>
        {children}
      </Pressable>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ECFEFF',
  },

  // HEADER STYLE
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 12,
  },
  backBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginTop: 2,
  },
  headerBarGlow: {
    height: 3,
  },

  scrollContainer: {
    padding: 16,
    paddingBottom: 48,
    backgroundColor: 'transparent',
  },

  // AI FEATURE PILLS
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  featurePill: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.2)',
  },
  featurePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E7490',
    letterSpacing: 0.2,
  },

  // FORM CARD
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.12)',
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  fieldDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#06B6D4',
    marginRight: 6,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  requestTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.18)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    height: 60,
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  gridCol: {
    flex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFBFF',
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.16)',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 38,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerIconOrb: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  pickerButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },

  // File Upload Box
  fileAttachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 12,
  },
  fileAttachmentBoxActive: {
    backgroundColor: '#ECFEFF',
    borderStyle: 'solid',
    borderColor: '#06B6D4',
  },
  fileIconOrb: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  fileAttachmentText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#94A3B8',
    flex: 1,
  },
  fileAttachmentTextActive: {
    color: '#0891B2',
    fontWeight: '700',
  },

  // GENERATE BUTTON
  generateBtnContainer: {
    marginTop: 2,
    borderRadius: 12,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'visible',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  generateBtnHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  generateBtnIconZone: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  generateBtnDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 8,
  },
  generateBtnLabelBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 15,
  },
  generateBtnSubText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 1,
    lineHeight: 11,
    textTransform: 'uppercase',
  },
  generateBtnArrow: {
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Generating State
  generatingContainer: {
    flexDirection: 'row',
    backgroundColor: '#ECFEFF',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(6,182,212,0.25)',
  },
  generatingButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0891B2',
    letterSpacing: 0.2,
  },

  // PROCESSING LOADER CARD
  loaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loaderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  loaderStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  loaderPercentage: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textAlign: 'right',
  },

  // LIST HEADER
  viewPlanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 6,
  },
  bulletIndicator: {
    width: 5,
    height: 18,
    borderRadius: 3,
    marginRight: 9,
  },
  viewPlanTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    flex: 1,
  },
  planCountBadge: {
    backgroundColor: '#0891B2',
    borderRadius: 10,
    minWidth: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  planCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
  },

  plansListContainer: {
    gap: 12,
  },
  planItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingLeft: 0,
    paddingRight: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(6,182,212,0.14)',
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  planItemTopHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(6,182,212,0.06)',
  },
  planItemIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(6,182,212,0.18)',
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  planItemTextContent: {
    flex: 1,
  },
  planItemTopic: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0E7490',
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  planMetaRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  planMetaPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  planMetaPillTeal: {
    backgroundColor: '#ECFEFF',
    borderColor: 'rgba(6,182,212,0.2)',
  },
  planMetaPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.2,
  },

  // ── Premium Eye Button ──
  eyeBtnOuter: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(6,182,212,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,182,212,0.08)',
    marginRight: 2,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  eyeBtnCore: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  eyeBtnGloss: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  // PICKERS MODAL (Bottom Sheet Layout)
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  pickerModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 44 : 30,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 520 : '100%',
    alignSelf: 'center',
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20,
  },
  sheetHandle: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
  },
  pickerModalItemActive: {
    backgroundColor: '#ECFEFF',
  },
  pickerModalItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  pickerModalItemTextActive: {
    color: '#0891B2',
    fontWeight: '900',
  },

  // ── HIGH-FIDELITY PRINT SHEET VIEWER MODAL STYLES ──
  fullScreenModalWrapper: {
    flex: 1,
    backgroundColor: '#0E7490',
  },
  sheetSafeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  sheetNavBar: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sheetCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetNavTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  sheetDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E7490',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: '#0E7490',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sheetDownloadText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sheetPrintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06B6D4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sheetPrintText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sheetScrollContainer: {
    padding: 10,
    paddingBottom: 30,
    alignItems: 'center',
  },

  // Paper Sheet Card
  paperSheetCard: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  paperHeader: {
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#06B6D4',
    paddingBottom: 10,
  },
  paperMainTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0E7490',
    textAlign: 'center',
    marginBottom: 6,
  },
  paperBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 10,
  },
  paperMetaBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 5,
  },
  paperMetaBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  studentInfoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
  },
  studentInfoText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#334155',
  },
  studentInfoLine: {
    color: '#94A3B8',
    fontWeight: '400',
  },

  // Instructions
  instructionsContainer: {
    backgroundColor: '#ECFEFF',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3.5,
    borderLeftColor: '#06B6D4',
    marginBottom: 14,
  },
  instructionsHeading: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0E7490',
    marginBottom: 2,
  },
  instructionsBody: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 14.5,
  },

  // Section Blocks
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0E7490',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 4,
  },

  // Word Bank
  wordBankCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  wordBankTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E7490',
    marginBottom: 2,
  },
  wordBankWords: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
    lineHeight: 14.5,
    fontStyle: 'italic',
  },

  // Fill in blanks item
  questionItem: {
    marginBottom: 8,
  },
  questionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 15,
  },

  // MCQs
  mcqBlock: {
    marginBottom: 10,
  },
  mcqOptionsList: {
    marginTop: 4,
    paddingLeft: 10,
  },
  mcqOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  mcqOptionLetter: {
    fontSize: 11,
    fontWeight: '700',
    color: '#06B6D4',
  },
  mcqOptionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },

  // Short Answer
  shortAnsBlock: {
    marginBottom: 12,
  },
  answerLinesContainer: {
    marginTop: 6,
    gap: 10,
  },
  writeLine: {
    height: 1,
    backgroundColor: '#CBD5E1',
    width: '100%',
  },
});
