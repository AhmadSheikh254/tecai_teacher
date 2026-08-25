import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
  Pressable,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect, Line } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

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
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Active View Plan Modal State
  const [activeWorksheet, setActiveWorksheet] = useState<WorksheetData | null>(null);

  // Initial Seed Worksheets
  const [worksheets, setWorksheets] = useState<WorksheetData[]>([
    {
      id: 'ws-1',
      topic: 'States of Matter Mastery',
      language: 'English',
      level: 'Level 4',
      color: '#0D9488',
      date: 'Aug 12, 2026',
      instructions: 'Read each section carefully. For Part 1, choose the most appropriate word from the word bank to complete each sentence. For Part 2, select the best answer for each multiple-choice question. For Part 3, answer the questions concisely in the provided space.',
      wordBank: ['Solid', 'Liquid', 'Gas', 'Volume', 'Temperature', 'Particles', 'Kinetic Energy', 'Condensation', 'Evaporation', 'Sublimation'],
      fillBlanks: [
        { id: 1, question: 'In the state of matter known as ________, substances have a definite shape and a definite volume.', answer: 'Solid' },
        { id: 2, question: 'A ________ takes the shape of its container but maintains a definite volume.', answer: 'Liquid' },
        { id: 3, question: 'A ________ has no definite shape or volume; it expands to fill its container.', answer: 'Gas' },
        { id: 4, question: 'The average ________ of the ________ in a substance is directly related to its temperature.', answer: 'Kinetic Energy / Particles' },
        { id: 5, question: 'The process of a liquid turning into a gas is called ________.', answer: 'Evaporation' }
      ],
      mcqs: [
        {
          id: 1,
          question: 'Which of the following best describes the arrangement and movement of particles in a gas?',
          options: [
            'Tightly packed in a regular lattice, vibrating in fixed positions.',
            'Closely packed but able to slide past each other, with random movement.',
            'Far apart and moving rapidly and randomly, colliding frequently.'
          ],
          answerIndex: 2
        },
        {
          id: 2,
          question: 'What happens to the state of matter when heat is added to a solid, assuming no phase change yet occurs?',
          options: [
            'The particles vibrate more vigorously, increasing kinetic energy.',
            'The particles move closer together, decreasing volume.',
            'The particles lose energy and slow down.'
          ],
          answerIndex: 0
        },
        {
          id: 3,
          question: 'Which phase transition involves a solid changing directly into a gas, bypassing the liquid state?',
          options: [
            'Melting',
            'Deposition',
            'Sublimation'
          ],
          answerIndex: 2
        }
      ],
      shortAnswers: [
        { id: 1, question: 'Explain the difference in particle behavior between a liquid and a gas at the molecular level.', lines: 2 },
        { id: 2, question: 'Describe one everyday example of a substance undergoing a phase change and identify the states of matter involved.', lines: 2 }
      ]
    },
    {
      id: 'ws-2',
      topic: 'Solar System Orbits and Scale Model',
      language: 'English',
      level: 'Level 5',
      color: '#0284C7',
      date: 'Aug 12, 2026',
      instructions: 'Complete all three sections to demonstrate your understanding of planetary motion, gravitational attraction, and orbital scale.',
      wordBank: ['Gravity', 'Orbit', 'Sun', 'Elliptical', 'Asteroid Belt', 'Revolution', 'Rotation', 'Terrestrial', 'Gas Giants'],
      fillBlanks: [
        { id: 1, question: 'The principal force keeping planets in orbit around the Sun is ________.', answer: 'Gravity' },
        { id: 2, question: 'Earth takes approximately 365.25 days to complete one full ________ around the Sun.', answer: 'Revolution' },
        { id: 3, question: 'Planets travel along a curved path called an ________.', answer: 'Orbit' },
        { id: 4, question: 'The four inner planets (Mercury, Venus, Earth, Mars) are known as ________ planets.', answer: 'Terrestrial' }
      ],
      mcqs: [
        {
          id: 1,
          question: 'Which celestial body holds the highest gravitational mass in our solar system?',
          options: [
            'Jupiter',
            'The Sun',
            'Saturn'
          ],
          answerIndex: 1
        },
        {
          id: 2,
          question: 'Where is the main Asteroid Belt located in our solar system?',
          options: [
            'Between Earth and Mars',
            'Between Mars and Jupiter',
            'Beyond Neptune'
          ],
          answerIndex: 1
        }
      ],
      shortAnswers: [
        { id: 1, question: 'Why do planets closer to the Sun complete their orbits faster than planets further away?', lines: 2 }
      ]
    },
    {
      id: 'ws-3',
      topic: 'Flowers Anatomy & Plant Growth',
      language: 'English',
      level: 'Level 3',
      color: '#059669',
      date: 'Aug 11, 2026',
      instructions: 'Identify the structural organs of flowering plants and describe the biological steps involved in pollination and fertilization.',
      wordBank: ['Petal', 'Stamen', 'Pistil', 'Pollen', 'Photosynthesis', 'Stem', 'Roots', 'Nectar'],
      fillBlanks: [
        { id: 1, question: 'The male reproductive organ of a flower is called the ________.', answer: 'Stamen' },
        { id: 2, question: 'Brightly colored ________ attract bees, butterflies, and other pollinators.', answer: 'Petals' },
        { id: 3, question: 'Plants absorb water and essential soil minerals through their ________.', answer: 'Roots' }
      ],
      mcqs: [
        {
          id: 1,
          question: 'What is the primary role of pollen in flower reproduction?',
          options: [
            'To protect the seeds from birds',
            'To carry male reproductive cells to the ovary',
            'To store water for photosynthesis'
          ],
          answerIndex: 1
        }
      ],
      shortAnswers: [
        { id: 1, question: 'Describe how insects assist in the process of cross-pollination.', lines: 2 }
      ]
    }
  ]);

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
      <View style={styles.fullScreenModalWrapper}>
        <SafeAreaView style={styles.sheetSafeArea} edges={['top', 'bottom']}>
          {/* Viewer Navigation Bar */}
          <View style={styles.sheetNavBar}>
            <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setActiveWorksheet(null)} activeOpacity={0.8}>
              <MaterialIcons name="arrow-back" size={20} color="#0E7490" />
            </TouchableOpacity>

            <Text style={styles.sheetNavTitle} numberOfLines={1}>{activeWorksheet.topic}</Text>

            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.sheetDownloadBtn}
                onPress={() => Alert.alert('Download PDF', 'Worksheet PDF downloaded to your device.')}
                activeOpacity={0.8}
              >
                <MaterialIcons name="file-download" size={15} color="#fff" style={{ marginRight: 3 }} />
                <Text style={styles.sheetDownloadText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetPrintBtn}
                onPress={() => Alert.alert('Print Worksheet', 'Worksheet sent to print queue as PDF.')}
                activeOpacity={0.8}
              >
                <MaterialIcons name="print" size={15} color="#fff" style={{ marginRight: 3 }} />
                <Text style={styles.sheetPrintText}>Print</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Paper Sheet Container */}
          <ScrollView style={{ flex: 1, width: '100%' }} contentContainerStyle={styles.sheetScrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.paperSheetCard}>
              
              {/* Paper Top Title Header */}
              <View style={styles.paperHeader}>
                <Text style={styles.paperMainTitle}>{activeWorksheet.topic}</Text>
                <View style={styles.paperBadgeRow}>
                  <View style={styles.paperMetaBadge}>
                    <Text style={styles.paperMetaBadgeText}>{activeWorksheet.language}</Text>
                  </View>
                  <View style={[styles.paperMetaBadge, { backgroundColor: '#ECFEFF' }]}>
                    <Text style={[styles.paperMetaBadgeText, { color: '#0E7490' }]}>{activeWorksheet.level}</Text>
                  </View>
                </View>

                {/* Fillable Student Info Line */}
                <View style={styles.studentInfoBox}>
                  <Text style={styles.studentInfoText}>Name: <Text style={styles.studentInfoLine}>___________________________</Text></Text>
                  <Text style={styles.studentInfoText}>Date: <Text style={styles.studentInfoLine}>____________</Text></Text>
                  <Text style={styles.studentInfoText}>Score: <Text style={styles.studentInfoLine}>______</Text></Text>
                </View>
              </View>

              {/* Instructions Box */}
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsHeading}>Instructions:</Text>
                <Text style={styles.instructionsBody}>{activeWorksheet.instructions}</Text>
              </View>

              {/* PART 1: FILL IN THE BLANKS */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>Part 1: Fill in the Blanks</Text>
                
                {/* Word Bank Box */}
                <View style={styles.wordBankCard}>
                  <Text style={styles.wordBankTitle}>Word Bank:</Text>
                  <Text style={styles.wordBankWords}>{activeWorksheet.wordBank.join(', ')}</Text>
                </View>

                {/* Questions */}
                {activeWorksheet.fillBlanks.map((q) => (
                  <View key={q.id} style={styles.questionItem}>
                    <Text style={styles.questionText}>
                      <Text style={{ fontWeight: '800' }}>{q.id}. </Text>
                      {q.question}
                    </Text>
                  </View>
                ))}
              </View>

              {/* PART 2: MULTIPLE CHOICE QUESTIONS */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>Part 2: Multiple Choice Questions</Text>
                
                {activeWorksheet.mcqs.map((mcq) => (
                  <View key={mcq.id} style={styles.mcqBlock}>
                    <Text style={styles.questionText}>
                      <Text style={{ fontWeight: '800' }}>{mcq.id}. </Text>
                      {mcq.question}
                    </Text>

                    <View style={styles.mcqOptionsList}>
                      {mcq.options.map((opt, idx) => {
                        const letter = String.fromCharCode(65 + idx);
                        return (
                          <View key={idx} style={styles.mcqOptionRow}>
                            <Text style={styles.mcqOptionLetter}>•  {letter}) </Text>
                            <Text style={styles.mcqOptionText}>{opt}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>

              {/* PART 3: SHORT ANSWER QUESTIONS */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionHeading}>Part 3: Short Answer Questions</Text>

                {activeWorksheet.shortAnswers.map((sa) => (
                  <View key={sa.id} style={styles.shortAnsBlock}>
                    <Text style={styles.questionText}>
                      <Text style={{ fontWeight: '800' }}>{sa.id}. </Text>
                      {sa.question}
                    </Text>

                    <View style={styles.answerLinesContainer}>
                      <View style={styles.writeLine} />
                      <View style={styles.writeLine} />
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Ambient Mesh Backdrop ── */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Circle cx="105%" cy="-5%" r="320" fill="#06B6D4" opacity={0.07} />
          <Circle cx="-10%" cy="50%" r="300" fill="#0891B2" opacity={0.06} />
          <Circle cx="80%" cy="95%" r="340" fill="#22D3EE" opacity={0.06} />
        </Svg>
      </View>

      {/* ── HEADER BANNER ── */}
      <LinearGradient colors={['#0E7490', '#06B6D4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={{ position: 'absolute', right: -35, top: -50, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(34, 211, 238, 0.2)' }} />
        <View style={{ position: 'absolute', left: -25, bottom: -45, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(6, 182, 212, 0.16)' }} />

        <View style={styles.headerContent}>
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
      <LinearGradient colors={['#22D3EE', '#67E8F9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerBarGlow} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* ── FEATURE PILLS ── */}
        <View style={styles.pillRow}>
          {['✦ Word Bank Auto-gen', '⚡ Print-Ready PDF', '📝 Multiple Question Types'].map((t, i) => (
            <View key={i} style={styles.featurePill}>
              <Text style={styles.featurePillText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* ── FORM CARD ── */}
        <View style={styles.card}>

          {/* YOUR REQUEST */}
          <View style={styles.fieldHeader}>
            <View style={styles.fieldDot} />
            <Text style={styles.sectionLabel}>Your Request</Text>
          </View>
          <TextInput
            style={styles.requestTextArea}
            placeholder="Describe your worksheet topic… e.g. States of Matter, Fractions, Photosynthesis"
            placeholderTextColor="#94A3B8"
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
                <View style={styles.fieldDot} />
                <Text style={styles.sectionLabel}>Level</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => !generating && setLevelModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.pickerLeft}>
                  <LinearGradient colors={['#ECFEFF', '#CFFAFE']} style={styles.pickerIconOrb}>
                    <MaterialIcons name="school" size={15} color="#0891B2" />
                  </LinearGradient>
                  <Text style={styles.pickerButtonText}>{level}</Text>
                </View>
                <MaterialIcons name="expand-more" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.gridCol}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldDot} />
                <Text style={styles.sectionLabel}>Language</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => !generating && setLangModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.pickerLeft}>
                  <LinearGradient colors={['#ECFEFF', '#CFFAFE']} style={styles.pickerIconOrb}>
                    <MaterialIcons name="translate" size={15} color="#0891B2" />
                  </LinearGradient>
                  <Text style={styles.pickerButtonText}>{language}</Text>
                </View>
                <MaterialIcons name="expand-more" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ATTACH FILE */}
          <View style={styles.fieldHeader}>
            <View style={styles.fieldDot} />
            <Text style={styles.sectionLabel}>Attach File  <Text style={{ color: '#94A3B8', fontWeight: '600', textTransform: 'none' }}>optional</Text></Text>
          </View>
          <TouchableOpacity
            style={[styles.fileAttachmentBox, fileName ? styles.fileAttachmentBoxActive : null]}
            onPress={handleToggleMockFile}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={fileName ? ['#CFFAFE', '#ECFEFF'] : ['#F1F5F9', '#F8FAFC']}
              style={styles.fileIconOrb}
            >
              <MaterialIcons
                name={fileName ? "insert-drive-file" : "cloud-upload"}
                size={18}
                color={fileName ? "#0891B2" : "#94A3B8"}
              />
            </LinearGradient>
            <Text style={[styles.fileAttachmentText, fileName ? styles.fileAttachmentTextActive : null]} numberOfLines={1}>
              {fileName ? fileName : "Tap to choose a file (Image / PDF)"}
            </Text>
            {fileName && (
              <TouchableOpacity onPress={() => setFileName('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialIcons name="close" size={17} color="#94A3B8" style={{ marginLeft: 6 }} />
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
                colors={['#0891B2', '#06B6D4', '#0284C7']}
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
            <View style={styles.generatingContainer}>
              <ActivityIndicator color="#0891B2" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingButtonText}>Generating worksheet…</Text>
            </View>
          )}
        </View>

        {/* ── PROCESSING LOADER ── */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={styles.loaderHeader}>
              <ActivityIndicator color="#0891B2" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#0891B2', '#22D3EE']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={styles.loaderPercentage}>{progress}% Complete</Text>
          </View>
        )}
      </ScrollView>

      {/* ── LEVEL SELECTOR PICKER MODAL ── */}
      <Modal visible={levelModalVisible} transparent={true} animationType="slide">
        <PressableModalBackdrop onClose={() => setLevelModalVisible(false)}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.pickerModalTitle}>Select Grade Level</Text>
            {['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8'].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.pickerModalItem, level === l && styles.pickerModalItemActive]}
                onPress={() => {
                  setLevel(l);
                  setLevelModalVisible(false);
                }}
              >
                <Text style={[styles.pickerModalItemText, level === l && styles.pickerModalItemTextActive]}>{l}</Text>
                {level === l && <MaterialIcons name="check" size={18} color="#0891B2" />}
              </TouchableOpacity>
            ))}
          </View>
        </PressableModalBackdrop>
      </Modal>

      {/* ── LANGUAGE SELECTOR PICKER MODAL ── */}
      <Modal visible={langModalVisible} transparent={true} animationType="slide">
        <PressableModalBackdrop onClose={() => setLangModalVisible(false)}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.pickerModalTitle}>Select Language</Text>
            {['English', 'Urdu', 'Punjabi', 'Sindhi', 'Pashto'].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.pickerModalItem, language === l && styles.pickerModalItemActive]}
                onPress={() => {
                  setLanguage(l);
                  setLangModalVisible(false);
                }}
              >
                <Text style={[styles.pickerModalItemText, language === l && styles.pickerModalItemTextActive]}>{l}</Text>
                {language === l && <MaterialIcons name="check" size={18} color="#0891B2" />}
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
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fileAttachmentText: {
    fontSize: 13,
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
