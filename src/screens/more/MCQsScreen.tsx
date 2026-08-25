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
  Alert,
  Clipboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MCQsScreenProps {
  navigation: any;
}

interface MCQOption {
  label: string;
  text: string;
}

interface MCQQuestion {
  id: number;
  question: string;
  options: MCQOption[];
  correctIndex: number;
}

interface MCQSet {
  id: string;
  topic: string;
  date: string;
  fileName?: string;
  questions: MCQQuestion[];
}

// ─── Progress Steps ───────────────────────────────────────────────────────────
const PROGRESS_STEPS = [
  { pct: 12,  label: 'Reading paragraph content…' },
  { pct: 28,  label: 'Extracting key concepts…' },
  { pct: 48,  label: 'Drafting question stems…' },
  { pct: 66,  label: 'Generating distractor options…' },
  { pct: 82,  label: 'Validating answer keys…' },
  { pct: 95,  label: 'Formatting MCQ set…' },
  { pct: 100, label: 'MCQs ready! ✓' },
];

// ─── Option label → color map (red palette) ───────────────────────────────────
const OPT_COLORS: Record<string, string> = {
  a: '#B91C1C',
  b: '#C2410C',
  c: '#991B1B',
  d: '#9A3412',
};

// ─── Format MCQs as plain text for clipboard ─────────────────────────────────
const formatMCQsText = (set: MCQSet): string => {
  let out = `MCQs — ${set.topic}\nDate: ${set.date}\n\n`;
  set.questions.forEach((q) => {
    out += `Question ${q.id}: ${q.question}\n`;
    q.options.forEach((opt) => {
      const marker = opt.label === q.options[q.correctIndex].label ? ' ✓' : '';
      out += `  ${opt.label}) ${opt.text}${marker}\n`;
    });
    out += `\n`;
  });
  out += `Answer Key:\n`;
  set.questions.forEach((q) => {
    out += `${q.id}. ${q.options[q.correctIndex].label}\n`;
  });
  return out;
};

// ─── Mock MCQ Builder ─────────────────────────────────────────────────────────
const buildMockSet = (topic: string, fileName?: string): MCQSet => {
  const short = topic.substring(0, 30);
  const questions: MCQQuestion[] = [
    {
      id: 1,
      question: `What is the main idea described in the text about "${short}…"?`,
      options: [
        { label: 'a', text: 'It describes a historical event in detail' },
        { label: 'b', text: 'It explains the core concept of the topic' },
        { label: 'c', text: 'It provides a list of unrelated facts' },
        { label: 'd', text: 'It narrates a fictional story' },
      ],
      correctIndex: 1,
    },
    {
      id: 2,
      question: `Which term is most closely associated with "${short}…"?`,
      options: [
        { label: 'a', text: 'Abstract theoretical framework' },
        { label: 'b', text: 'Practical application model' },
        { label: 'c', text: 'Core foundational principle' },
        { label: 'd', text: 'Statistical analysis method' },
      ],
      correctIndex: 2,
    },
    {
      id: 3,
      question: `According to the paragraph, what is the primary function described?`,
      options: [
        { label: 'a', text: 'To regulate and maintain internal balance' },
        { label: 'b', text: 'To store and process information efficiently' },
        { label: 'c', text: 'To transmit signals across large distances' },
        { label: 'd', text: 'To convert energy into measurable output' },
      ],
      correctIndex: 0,
    },
    {
      id: 4,
      question: `The paragraph implies that "${short}…" is best categorized as:`,
      options: [
        { label: 'a', text: 'A rare and isolated phenomenon' },
        { label: 'b', text: 'An advanced theoretical construct' },
        { label: 'c', text: 'A universally observed process' },
        { label: 'd', text: 'A mathematical formula system' },
      ],
      correctIndex: 2,
    },
    {
      id: 5,
      question: `What does "carefully" most likely mean in this context?`,
      options: [
        { label: 'a', text: 'Quickly and without hesitation' },
        { label: 'b', text: 'Without much thought or planning' },
        { label: 'c', text: 'With great attention and thought' },
        { label: 'd', text: 'Loudly and with great energy' },
      ],
      correctIndex: 2,
    },
  ];

  return {
    id: Date.now().toString(),
    topic,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName,
    questions,
  };
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const MCQsScreen: React.FC<MCQsScreenProps> = ({ navigation }) => {

  const [requestInput, setRequestInput]   = useState('');
  const [fileName, setFileName]           = useState('');
  const [generating, setGenerating]       = useState(false);
  const [progress, setProgress]           = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [mcqSets, setMcqSets]             = useState<MCQSet[]>([]);
  const [activeSet, setActiveSet]         = useState<MCQSet | null>(null);
  const [revealedKeys, setRevealedKeys]   = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId]           = useState<string | null>(null);

  const handleToggleFile = () =>
    setFileName(f => f ? '' : 'Paragraph_Text.pdf');

  const handleGenerate = () => {
    if (!requestInput.trim()) {
      Alert.alert('Missing Input', 'Please enter your paragraph or topic text.');
      return;
    }
    setGenerating(true);
    setProgress(0);
    setProgressStatus(PROGRESS_STEPS[0].label);

    let step = 0;
    const tick = setInterval(() => {
      step += 1;
      if (step < PROGRESS_STEPS.length) {
        setProgress(PROGRESS_STEPS[step].pct);
        setProgressStatus(PROGRESS_STEPS[step].label);
      }
      if (step >= PROGRESS_STEPS.length - 1) {
        clearInterval(tick);
        setTimeout(() => {
          const set = buildMockSet(requestInput.trim(), fileName || undefined);
          setMcqSets(prev => [set, ...prev]);
          setGenerating(false);
          setProgress(0);
          setRequestInput('');
        }, 500);
      }
    }, 480);
  };

  const toggleKey = (id: string) =>
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCopy = (set: MCQSet) => {
    const text = formatMCQsText(set);
    Clipboard.setString(text);
    setCopiedId(set.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* Ambient blobs */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Defs>
            <SvgLinearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#D9534F" stopOpacity={0.07} />
              <Stop offset="100%" stopColor="#B91C1C" stopOpacity={0.03} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="108%" cy="-6%" r="280" fill="url(#b1)" />
          <Circle cx="-10%" cy="48%" r="240" fill="#EF4444" opacity={0.04} />
          <Circle cx="88%" cy="95%" r="300" fill="#B91C1C" opacity={0.04} />
        </Svg>
      </View>

      {/* ── HEADER ── */}
      <LinearGradient
        colors={['#7F1D1D', '#B91C1C', '#D9534F']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -28, top: -38, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(254,202,202,0.14)' }} />
        <View style={{ position: 'absolute', left: -18, bottom: -36, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(252,165,165,0.10)' }} />

        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="quiz" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>MCQs Generator</Text>
              <Text style={styles.headerSub}>AI-powered · Smart distractors · Answer key included</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient colors={['#FCA5A5', '#D9534F', '#B91C1C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGlow} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── FEATURE PILLS ── */}
        <View style={styles.pillRow}>
          {['📝 Paragraph to MCQs', '🎯 4-Option Format', '🔑 Answer Key', '📋 Copy MCQs'].map((t, i) => (
            <View key={i} style={styles.pill}>
              <Text style={styles.pillText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* ── FORM CARD ── */}
        <View style={styles.card}>

          {/* YOUR REQUEST */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Your Request</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Enter paragraph here…"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={requestInput}
            onChangeText={setRequestInput}
            editable={!generating}
          />

          {/* ATTACH FILE */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>
              Attach a file{'  '}
              <Text style={{ color: '#94A3B8', fontWeight: '500', textTransform: 'none' }}>optional</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.fileBox, fileName ? styles.fileBoxActive : null]}
            onPress={handleToggleFile}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={fileName ? ['#FEE2E2', '#FECACA'] : ['#F8FAFC', '#F1F5F9']}
              style={styles.fileOrb}
            >
              <MaterialIcons
                name={fileName ? 'insert-drive-file' : 'cloud-upload'}
                size={18}
                color={fileName ? '#D9534F' : '#94A3B8'}
              />
            </LinearGradient>
            <Text style={[styles.fileText, fileName ? styles.fileTextActive : null]} numberOfLines={1}>
              {fileName || 'No file chosen'}
            </Text>
            {fileName ? (
              <TouchableOpacity onPress={() => setFileName('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialIcons name="close" size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>

          {/* GENERATE BUTTON */}
          {!generating ? (
            <TouchableOpacity style={styles.genBtnWrap} onPress={handleGenerate} activeOpacity={0.85}>
              <LinearGradient
                colors={['#7F1D1D', '#B91C1C', '#D9534F']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.genBtn}
              >
                <View style={styles.genBtnHighlight} />
                <View style={styles.genBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={22} color="#fff" />
                </View>
                <View style={styles.genBtnDivider} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.genBtnText} numberOfLines={1}>Generate MCQs</Text>
                  <Text style={styles.genBtnSub} numberOfLines={1}>AI · Smart Distractors · Answer Key</Text>
                </View>
                <LinearGradient
                  colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)']}
                  start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                  style={styles.genBtnArrow}
                >
                  <MaterialIcons name="double-arrow" size={16} color="#fff" />
                </LinearGradient>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.generatingState}>
              <ActivityIndicator color="#D9534F" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingText}>Generating MCQs…</Text>
            </View>
          )}
        </View>

        {/* ── PROGRESS LOADER ── */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <ActivityIndicator color="#D9534F" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#D9534F', '#FCA5A5']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={styles.loaderPct}>{progress}% Complete</Text>
          </View>
        )}

        {/* ── RESULTS SECTION HEADER ── */}
        {mcqSets.length > 0 && (
          <View style={styles.sectionHeaderRow}>
            <LinearGradient colors={['#D9534F', '#B91C1C']} style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>View MCQs</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{mcqSets.length}</Text>
            </View>
          </View>
        )}

        {/* ── MCQ RESULT CARDS ── */}
        <View style={{ gap: 18 }}>
          {mcqSets.map((set) => (
            <View key={set.id} style={styles.resultCard}>

              {/* Top accent strip */}
              <LinearGradient colors={['#7F1D1D', '#D9534F', '#FCA5A5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.resultStrip} />

              {/* Meta header */}
              <View style={styles.resultMeta}>
                <LinearGradient colors={['#FEE2E2', '#FECACA']} style={styles.resultIconOrb}>
                  <MaterialIcons name="quiz" size={17} color="#D9534F" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTopic} numberOfLines={1}>{set.topic}</Text>
                  <Text style={styles.resultDate}>{set.date}{set.fileName ? ` · ${set.fileName}` : ''}</Text>
                </View>
                {/* Eye button */}
                <TouchableOpacity onPress={() => setActiveSet(set)} activeOpacity={0.8}>
                  <View style={styles.eyeOuter}>
                    <LinearGradient colors={['#D9534F', '#B91C1C']} style={styles.eyeCore}>
                      <View style={styles.eyeGloss} />
                      <MaterialIcons name="remove-red-eye" size={17} color="#fff" />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Questions list */}
              <View style={styles.questionsBlock}>
                {set.questions.map((q) => (
                  <View key={q.id} style={styles.questionItem}>
                    <View style={styles.qLabelRow}>
                      <LinearGradient colors={['#B91C1C', '#D9534F']} style={styles.qNumBadge}>
                        <Text style={styles.qNumText}>Q{q.id}</Text>
                      </LinearGradient>
                      <Text style={styles.qText}>{q.question}</Text>
                    </View>
                    <View style={styles.optionsList}>
                      {q.options.map((opt, oi) => {
                        const isCorrect = revealedKeys[set.id] && oi === q.correctIndex;
                        return (
                          <View key={oi} style={[styles.optRow, isCorrect && styles.optRowCorrect]}>
                            <View style={[styles.optLabelBox, { backgroundColor: OPT_COLORS[opt.label] }]}>
                              <Text style={styles.optLabelText}>{opt.label})</Text>
                            </View>
                            <Text style={[styles.optText, isCorrect && styles.optTextCorrect]} numberOfLines={1}>
                              {opt.text}
                            </Text>
                            {isCorrect && <MaterialIcons name="check-circle" size={13} color="#16A34A" style={{ marginLeft: 4 }} />}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}

                {/* Answer Key block */}
                <View style={styles.answerKeyBlock}>
                  <Text style={styles.answerKeyTitle}>Answer Key:</Text>
                  <View style={styles.answerKeyGrid}>
                    {set.questions.map((q) => (
                      <View key={q.id} style={styles.akItem}>
                        <Text style={styles.akQLabel}>{q.id}.</Text>
                        <View style={styles.akBadge}>
                          <Text style={styles.akBadgeText}>{q.options[q.correctIndex].label}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* ── COPY MCQs BUTTON ── */}
              <TouchableOpacity
                style={styles.copyMcqsBtn}
                onPress={() => handleCopy(set)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={copiedId === set.id ? ['#15803D', '#16A34A'] : ['#B91C1C', '#D9534F']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.copyMcqsBtnGrad}
                >
                  <MaterialIcons
                    name={copiedId === set.id ? 'check' : 'content-copy'}
                    size={17}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.copyMcqsBtnText}>
                    {copiedId === set.id ? 'MCQs Copied!' : 'Copy MCQs'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Footer toolbar */}
              <View style={styles.resultFooter}>
                <TouchableOpacity style={styles.footerBtn} onPress={() => setActiveSet(set)}>
                  <MaterialIcons name="open-in-full" size={13} color="#D9534F" style={{ marginRight: 4 }} />
                  <Text style={styles.footerBtnText}>Full View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerBtn} onPress={() => toggleKey(set.id)}>
                  <MaterialIcons name={revealedKeys[set.id] ? 'visibility-off' : 'vpn-key'} size={13} color="#B45309" style={{ marginRight: 4 }} />
                  <Text style={[styles.footerBtnText, { color: '#B45309' }]}>
                    {revealedKeys[set.id] ? 'Hide Key' : 'Show Key'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerBtn} onPress={() => Alert.alert('Print', 'Sent to printer.')}>
                  <MaterialIcons name="print" size={13} color="#64748B" style={{ marginRight: 4 }} />
                  <Text style={[styles.footerBtnText, { color: '#64748B' }]}>Print</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </View>

      </ScrollView>

      {/* ── FULL VIEW MODAL ── */}
      <Modal visible={activeSet !== null} transparent={false} animationType="slide">
        <SafeAreaView style={styles.sheetSafe} edges={['top']}>
          <View style={styles.sheetNav}>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setActiveSet(null)} activeOpacity={0.8}>
              <MaterialIcons name="close" size={20} color="#D9534F" />
            </TouchableOpacity>
            <Text style={styles.sheetTitle} numberOfLines={1}>{activeSet?.topic}</Text>
            <TouchableOpacity
              style={styles.sheetCopyBtn}
              onPress={() => { if (activeSet) handleCopy(activeSet); }}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={activeSet && copiedId === activeSet.id ? 'check' : 'content-copy'}
                size={14} color="#fff" style={{ marginRight: 4 }}
              />
              <Text style={styles.sheetCopyText}>
                {activeSet && copiedId === activeSet.id ? 'Copied!' : 'Copy'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetPrintBtn} onPress={() => Alert.alert('Print', 'Sent to print queue.')} activeOpacity={0.8}>
              <MaterialIcons name="print" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.sheetPrintText}>Print</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.sheetScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.paperCard}>

              {/* Doc header */}
              <LinearGradient colors={['#7F1D1D', '#B91C1C']} style={styles.paperDocHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.paperDocIcon}>
                    <MaterialIcons name="quiz" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.paperDocTitle}>AI Generated MCQs</Text>
                    <Text style={styles.paperDocSub}>{activeSet?.date} · {activeSet?.questions.length} Questions</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Topic */}
              <View style={styles.topicRow}>
                <Text style={styles.topicLabel}>TOPIC</Text>
                <Text style={styles.topicTitle}>{activeSet?.topic}</Text>
              </View>

              {/* All questions */}
              <View style={styles.fullQuestions}>
                {activeSet?.questions.map((q) => (
                  <View key={q.id} style={styles.fullQCard}>
                    <View style={styles.fullQHeader}>
                      <LinearGradient colors={['#B91C1C', '#D9534F']} style={styles.fullQBadge}>
                        <Text style={styles.fullQBadgeText}>Q{q.id}</Text>
                      </LinearGradient>
                      <Text style={styles.fullQText}>{q.question}</Text>
                    </View>
                    <View style={styles.fullOptionsList}>
                      {q.options.map((opt, oi) => {
                        const correct = oi === q.correctIndex;
                        return (
                          <View key={oi} style={[styles.fullOptRow, correct && styles.fullOptRowCorrect]}>
                            <View style={[styles.fullOptLabel, { backgroundColor: correct ? '#16A34A' : OPT_COLORS[opt.label] }]}>
                              <Text style={styles.fullOptLabelText}>{opt.label})</Text>
                            </View>
                            <Text style={[styles.fullOptText, correct && styles.fullOptTextCorrect]}>{opt.text}</Text>
                            {correct && <MaterialIcons name="check-circle" size={15} color="#16A34A" style={{ marginLeft: 8 }} />}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>

              {/* Answer Key Summary */}
              <View style={styles.answerKeySummary}>
                <LinearGradient colors={['#7F1D1D', '#B91C1C']} style={styles.akHeader}>
                  <MaterialIcons name="vpn-key" size={15} color="#FECACA" style={{ marginRight: 8 }} />
                  <Text style={styles.akHeaderText}>Answer Key</Text>
                </LinearGradient>
                <View style={styles.akGridModal}>
                  {activeSet?.questions.map((q) => (
                    <View key={q.id} style={styles.akItemModal}>
                      <Text style={styles.akQNumModal}>{q.id}.</Text>
                      <View style={styles.akBadgeModal}>
                        <Text style={styles.akBadgeModalText}>{q.options[q.correctIndex].label}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Copy button in modal */}
              <TouchableOpacity
                style={styles.modalCopyBtn}
                onPress={() => { if (activeSet) handleCopy(activeSet); }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={activeSet && copiedId === activeSet.id ? ['#15803D', '#16A34A'] : ['#B91C1C', '#D9534F']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.modalCopyBtnGrad}
                >
                  <MaterialIcons
                    name={activeSet && copiedId === activeSet.id ? 'check' : 'content-copy'}
                    size={18} color="#fff" style={{ marginRight: 10 }}
                  />
                  <Text style={styles.modalCopyBtnText}>
                    {activeSet && copiedId === activeSet.id ? 'MCQs Copied to Clipboard!' : 'Copy All MCQs'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF5F5' },

  header: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 10 },
  backBtnInner: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerIconBox: {
    width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
  },
  headerTitle: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.2 },
  headerSub: { fontSize: 9.5, color: 'rgba(255,255,255,0.88)', fontWeight: '600', marginTop: 1 },
  headerGlow: { height: 2 },

  scroll: { padding: 12, paddingBottom: 60 },

  pillRow: { flexDirection: 'row', gap: 5, marginBottom: 10, flexWrap: 'wrap' },
  pill: {
    backgroundColor: '#FEE2E2', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(217,83,79,0.22)',
  },
  pillText: { fontSize: 9.5, fontWeight: '800', color: '#B91C1C', letterSpacing: 0.1 },

  // FORM CARD
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(217,83,79,0.1)',
    shadowColor: '#D9534F', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 12,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 2 },
  fieldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D9534F', marginRight: 6 },
  fieldLabel: { fontSize: 9.5, fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.8 },

  textArea: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: 'rgba(217,83,79,0.16)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 12, color: '#0F172A', fontWeight: '600', height: 60, marginBottom: 10,
  },

  fileBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(217,83,79,0.18)',
    borderRadius: 10, paddingHorizontal: 10, height: 36, marginBottom: 12,
  },
  fileBoxActive: { backgroundColor: '#FEE2E2', borderStyle: 'solid', borderColor: '#D9534F' },
  fileOrb: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  fileText: { fontSize: 11.5, fontWeight: '600', color: '#94A3B8', flex: 1 },
  fileTextActive: { color: '#D9534F', fontWeight: '700' },

  // GENERATE BUTTON
  genBtnWrap: {
    borderRadius: 12, shadowColor: '#B91C1C',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5,
  },
  genBtn: {
    flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12,
    overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  genBtnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  genBtnIconZone: {
    width: 44, height: 48, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  genBtnDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 8 },
  genBtnText: { color: '#fff', fontSize: 12.5, fontWeight: '900', letterSpacing: 0.2, lineHeight: 15 },
  genBtnSub: {
    color: 'rgba(255,255,255,0.88)', fontSize: 8.5, fontWeight: '700',
    letterSpacing: 0.4, textTransform: 'uppercase', marginTop: 1, lineHeight: 11,
  },
  genBtnArrow: {
    height: 28, paddingHorizontal: 8, borderRadius: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  generatingState: {
    flexDirection: 'row', backgroundColor: '#FEE2E2', borderRadius: 12, height: 44,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(217,83,79,0.28)',
  },
  generatingText: { fontSize: 12.5, fontWeight: '800', color: '#D9534F' },

  // LOADER
  loaderCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 10,
    borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  loaderStatus: { fontSize: 11.5, fontWeight: '700', color: '#334155' },
  progressBg: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 2 },
  loaderPct: { fontSize: 9.5, fontWeight: '800', color: '#64748B', textAlign: 'right' },

  // SECTION HEADER
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 2 },
  sectionBar: { width: 4, height: 14, borderRadius: 2, marginRight: 7 },
  sectionTitle: { fontSize: 10.5, fontWeight: '900', color: '#1E293B', textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 },
  countBadge: {
    backgroundColor: '#D9534F', borderRadius: 8, minWidth: 18, height: 16,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  countBadgeText: { fontSize: 9.5, fontWeight: '900', color: '#fff' },

  // RESULT CARD
  resultCard: {
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(217,83,79,0.12)',
    shadowColor: '#D9534F', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, overflow: 'hidden',
  },
  resultStrip: { height: 2 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', padding: 10, paddingBottom: 6 },
  resultIconOrb: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  resultTopic: { fontSize: 13, fontWeight: '900', color: '#7F1D1D', marginBottom: 2 },
  resultDate: { fontSize: 10, fontWeight: '600', color: '#94A3B8' },

  eyeOuter: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, borderColor: 'rgba(217,83,79,0.3)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(217,83,79,0.06)', marginLeft: 8,
    shadowColor: '#D9534F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8, elevation: 3,
  },
  eyeCore: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  eyeGloss: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', borderTopLeftRadius: 9, borderTopRightRadius: 9,
  },

  // QUESTIONS
  questionsBlock: { paddingHorizontal: 14, paddingBottom: 10, gap: 14 },
  questionItem: { gap: 7 },
  qLabelRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  qNumBadge: { width: 30, height: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  qNumText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  qText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#1E293B', lineHeight: 18 },

  optionsList: { paddingLeft: 38, gap: 5 },
  optRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: '#E2E8F0',
  },
  optRowCorrect: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  optLabelBox: { width: 22, height: 22, borderRadius: 5, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  optLabelText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  optText: { fontSize: 12, fontWeight: '600', color: '#475569', flex: 1 },
  optTextCorrect: { color: '#166534', fontWeight: '700' },

  // ANSWER KEY IN CARD
  answerKeyBlock: {
    backgroundColor: '#FFF5F5', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: 'rgba(217,83,79,0.18)',
  },
  answerKeyTitle: { fontSize: 12, fontWeight: '900', color: '#991B1B', marginBottom: 8 },
  answerKeyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  akItem: { alignItems: 'center', gap: 3 },
  akQLabel: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  akBadge: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#D9534F',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D9534F', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.22, shadowRadius: 4, elevation: 3,
  },
  akBadgeText: { fontSize: 13, fontWeight: '900', color: '#fff' },

  // ── COPY MCQs BUTTON ──────────────────────────────────────────────────────
  copyMcqsBtn: {
    marginHorizontal: 14, marginBottom: 12,
    borderRadius: 14, overflow: 'hidden',
    shadowColor: '#B91C1C', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 12, elevation: 7,
  },
  copyMcqsBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderRadius: 14,
  },
  copyMcqsBtnText: {
    fontSize: 14.5, fontWeight: '900', color: '#fff', letterSpacing: 0.4,
  },

  // FOOTER TOOLBAR
  resultFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFF5F5', borderTopWidth: 1, borderTopColor: '#FEE2E2',
  },
  footerBtn: { flexDirection: 'row', alignItems: 'center' },
  footerBtnText: { fontSize: 11, fontWeight: '800', color: '#D9534F' },

  // FULL VIEW MODAL
  sheetSafe: { flex: 1, backgroundColor: '#F8FAFC' },
  sheetNav: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  sheetClose: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetTitle: { fontSize: 14, fontWeight: '900', color: '#0F172A', flex: 1, textAlign: 'center' },
  sheetCopyBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#B91C1C',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9,
  },
  sheetCopyText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  sheetPrintBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#475569',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9,
  },
  sheetPrintText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  sheetScroll: { padding: 16, paddingBottom: 48, alignItems: 'center' },

  // PAPER CARD
  paperCard: {
    width: '100%', maxWidth: 720, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  paperDocHeader: { padding: 18, paddingBottom: 14 },
  paperDocIcon: {
    width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  paperDocTitle: { fontSize: 15, fontWeight: '900', color: '#fff' },
  paperDocSub: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  topicRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#FEE2E2', backgroundColor: '#FFF5F5' },
  topicLabel: { fontSize: 9.5, fontWeight: '900', color: '#D9534F', letterSpacing: 1.2, marginBottom: 4 },
  topicTitle: { fontSize: 18, fontWeight: '900', color: '#7F1D1D', lineHeight: 24 },

  fullQuestions: { padding: 16, gap: 16 },
  fullQCard: {
    backgroundColor: '#FAFAFA', borderRadius: 16, borderWidth: 1, borderColor: '#FEE2E2', overflow: 'hidden',
  },
  fullQHeader: {
    flexDirection: 'row', alignItems: 'flex-start', padding: 14, paddingBottom: 10, gap: 10,
    backgroundColor: '#FFF5F5', borderBottomWidth: 1, borderBottomColor: '#FEE2E2',
  },
  fullQBadge: { width: 32, height: 24, borderRadius: 7, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  fullQBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  fullQText: { flex: 1, fontSize: 14, fontWeight: '800', color: '#1E293B', lineHeight: 20 },
  fullOptionsList: { padding: 12, gap: 8 },
  fullOptRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  fullOptRowCorrect: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  fullOptLabel: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 },
  fullOptLabelText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  fullOptText: { flex: 1, fontSize: 13.5, fontWeight: '600', color: '#334155', lineHeight: 19 },
  fullOptTextCorrect: { color: '#166534', fontWeight: '800' },

  answerKeySummary: { margin: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#FECACA' },
  akHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingVertical: 10 },
  akHeaderText: { fontSize: 13, fontWeight: '900', color: '#FECACA', letterSpacing: 0.5 },
  akGridModal: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 12, backgroundColor: '#FFF5F5' },
  akItemModal: { alignItems: 'center', gap: 4 },
  akQNumModal: { fontSize: 11, fontWeight: '700', color: '#64748B' },
  akBadgeModal: {
    width: 34, height: 34, borderRadius: 9, backgroundColor: '#D9534F',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#D9534F', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 3,
  },
  akBadgeModalText: { fontSize: 13, fontWeight: '900', color: '#fff' },

  // MODAL COPY BUTTON
  modalCopyBtn: {
    margin: 16, marginTop: 4, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#B91C1C', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 8,
  },
  modalCopyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16,
  },
  modalCopyBtnText: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.4 },
});
