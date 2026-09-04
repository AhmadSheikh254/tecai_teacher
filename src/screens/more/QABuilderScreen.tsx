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

interface QABuilderScreenProps {
  navigation: any;
}

interface QAItem {
  id: number;
  question: string;
  answer: string;
}

interface QASet {
  id: string;
  topic: string;
  date: string;
  fileName?: string;
  title: string;
  items: QAItem[];
}

const STEPS = [
  { pct: 15,  label: 'Analyzing study material…' },
  { pct: 38,  label: 'Extracting key concepts…' },
  { pct: 60,  label: 'Formulating questions…' },
  { pct: 85,  label: 'Drafting high-quality answers…' },
  { pct: 100, label: 'Q&A Study Set ready! ✓' },
];

const buildSet = (topic: string, fileName?: string): QASet => {
  const items: QAItem[] = [
    {
      id: 1,
      question: 'What defines a mammal?',
      answer: 'Mammals are warm-blooded vertebrates that possess hair or fur, breathe air, and produce milk to feed their young.',
    },
    {
      id: 2,
      question: 'What is the main source of energy for the water cycle?',
      answer: 'The Sun is the primary source of energy that drives the water cycle by heating water, causing evaporation.',
    },
    {
      id: 3,
      question: 'How do plants make their own food?',
      answer: 'Plants convert sunlight, carbon dioxide, and water into glucose and oxygen through the process of photosynthesis.',
    },
    {
      id: 4,
      question: 'What are the three primary states of matter?',
      answer: 'The three primary states of matter are solid (fixed shape and volume), liquid (fixed volume, variable shape), and gas (variable shape and volume).',
    },
    {
      id: 5,
      question: 'What is the role of red blood cells in the human body?',
      answer: 'Red blood cells contain hemoglobin, which binds to oxygen in the lungs and transports it to tissues throughout the body.',
    },
  ];

  return {
    id: Date.now().toString(),
    topic,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName,
    title: 'Q&A Study Set',
    items,
  };
};

const formatText = (set: QASet): string => {
  let out = `Q&A Study Set — ${set.topic}\nDate: ${set.date}\n\n`;
  set.items.forEach(item => {
    out += `Q${item.id}: ${item.question}\nA${item.id}: ${item.answer}\n\n`;
  });
  return out;
};

export const QABuilderScreen: React.FC<QABuilderScreenProps> = ({ navigation }) => {
  const [requestInput, setRequestInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [sets, setSets] = useState<QASet[]>([]);
  const [activeSet, setActiveSet] = useState<QASet | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggleFile = () =>
    setFileName(f => f ? '' : 'Study_Material.pdf');

  const handleGenerate = () => {
    if (!requestInput.trim()) {
      Alert.alert('Missing Input', 'Please enter your topic or paragraph text.');
      return;
    }
    setGenerating(true);
    setProgress(0);
    setProgressStatus(STEPS[0].label);
    let step = 0;
    const tick = setInterval(() => {
      step += 1;
      if (step < STEPS.length) {
        setProgress(STEPS[step].pct);
        setProgressStatus(STEPS[step].label);
      }
      if (step >= STEPS.length - 1) {
        clearInterval(tick);
        setTimeout(() => {
          setSets(prev => [buildSet(requestInput.trim(), fileName || undefined), ...prev]);
          setGenerating(false);
          setProgress(0);
          setRequestInput('');
        }, 450);
      }
    }, 450);
  };

  const toggleReveal = (id: string) =>
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCopy = (set: QASet) => {
    Clipboard.setString(formatText(set));
    setCopiedId(set.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Background decoration */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Defs>
            <SvgLinearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#6D28D9" stopOpacity={0.03} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="110%" cy="-6%" r="280" fill="url(#b1)" />
          <Circle cx="-10%" cy="48%" r="240" fill="#8B5CF6" opacity={0.05} />
          <Circle cx="88%" cy="95%" r="300" fill="#6D28D9" opacity={0.04} />
        </Svg>
      </View>

      {/* HEADER */}
      <LinearGradient
        colors={['#2E1065', '#5B21B6', '#8B5CF6']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -28, top: -38, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(196,181,253,0.13)' }} />
        <View style={{ position: 'absolute', left: -18, bottom: -36, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(237,233,254,0.10)' }} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="question-answer" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>AI QA Builder</Text>
              <Text style={styles.headerSub}>AI-powered · Dynamic Q&A study cards · Answer key</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient colors={['#C4B5FD', '#8B5CF6', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGlow} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* INPUT CARD */}
        <View style={styles.card}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Your Request</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Enter paragraph or topic here…"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={requestInput}
            onChangeText={setRequestInput}
            editable={!generating}
          />

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
              colors={fileName ? ['#EDE9FE', '#DDD6FE'] : ['#F8FAFC', '#F1F5F9']}
              style={styles.fileOrb}
            >
              <MaterialIcons
                name={fileName ? 'insert-drive-file' : 'cloud-upload'}
                size={18}
                color={fileName ? '#8B5CF6' : '#94A3B8'}
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

          {!generating ? (
            <TouchableOpacity style={styles.genBtnWrap} onPress={handleGenerate} activeOpacity={0.85}>
              <LinearGradient
                colors={['#2E1065', '#5B21B6', '#8B5CF6']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.genBtn}
              >
                <View style={styles.genBtnHighlight} />
                <View style={styles.genBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={22} color="#fff" />
                </View>
                <View style={styles.genBtnDivider} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.genBtnText} numberOfLines={1}>Generate Q&A Sets</Text>
                  <Text style={styles.genBtnSub} numberOfLines={1}>AI · Study Cards · Key prep</Text>
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
              <ActivityIndicator color="#8B5CF6" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingText}>Generating Q&A study sheet…</Text>
            </View>
          )}
        </View>

        {/* PROGRESS LOADER */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <ActivityIndicator color="#8B5CF6" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#5B21B6', '#A78BFA']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={styles.loaderPct}>{progress}% Complete</Text>
          </View>
        )}

        {/* RESULTS HEADER */}
        {sets.length > 0 && (
          <View style={styles.sectionHeaderRow}>
            <LinearGradient colors={['#8B5CF6', '#5B21B6']} style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>View Q&A Sets</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{sets.length}</Text>
            </View>
          </View>
        )}

        {/* RESULT CARDS */}
        <View style={{ gap: 18 }}>
          {sets.map((set) => {
            const revealed = !!revealedIds[set.id];
            return (
              <View key={set.id} style={styles.resultCard}>
                <LinearGradient colors={['#2E1065', '#8B5CF6', '#C4B5FD']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.resultStrip} />

                {/* Meta header */}
                <View style={styles.resultMeta}>
                  <LinearGradient colors={['#EDE9FE', '#DDD6FE']} style={styles.resultIconOrb}>
                    <MaterialIcons name="question-answer" size={17} color="#8B5CF6" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultTopic} numberOfLines={1}>{set.topic}</Text>
                    <Text style={styles.resultDate}>{set.date}{set.fileName ? ` · ${set.fileName}` : ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setActiveSet(set)} activeOpacity={0.8}>
                    <View style={styles.eyeOuter}>
                      <LinearGradient colors={['#8B5CF6', '#5B21B6']} style={styles.eyeCore}>
                        <View style={styles.eyeGloss} />
                        <MaterialIcons name="remove-red-eye" size={17} color="#fff" />
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Q&A Cards List */}
                <View style={styles.qaBlock}>
                  <Text style={styles.puzzleTitle}>{set.title}</Text>
                  
                  {set.items.map((item) => (
                    <View key={item.id} style={styles.qaItemRow}>
                      <View style={styles.questionSection}>
                        <LinearGradient colors={['#5B21B6', '#8B5CF6']} style={styles.qaBadge}>
                          <Text style={styles.qaBadgeText}>Q{item.id}</Text>
                        </LinearGradient>
                        <Text style={styles.questionText}>{item.question}</Text>
                      </View>
                      
                      <View style={[styles.answerSection, !revealed && styles.answerSectionObscured]}>
                        <LinearGradient colors={['#475569', '#64748B']} style={styles.qaBadge}>
                          <Text style={styles.qaBadgeText}>A{item.id}</Text>
                        </LinearGradient>
                        <Text style={[styles.answerText, !revealed && styles.answerTextObscured]}>
                          {revealed ? item.answer : '•••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Copy Button */}
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy(set)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={copiedId === set.id ? ['#15803D', '#16A34A'] : ['#5B21B6', '#8B5CF6']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.copyBtnGrad}
                  >
                    <MaterialIcons
                      name={copiedId === set.id ? 'check' : 'content-copy'}
                      size={16} color="#fff" style={{ marginRight: 8 }}
                    />
                    <Text style={styles.copyBtnText}>
                      {copiedId === set.id ? 'Copied!' : 'Copy Q&A Study Set'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Footer toolbar */}
                <View style={styles.resultFooter}>
                  <TouchableOpacity style={styles.footerBtn} onPress={() => setActiveSet(set)}>
                    <MaterialIcons name="open-in-full" size={13} color="#8B5CF6" style={{ marginRight: 4 }} />
                    <Text style={styles.footerBtnText}>Full View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerBtn} onPress={() => toggleReveal(set.id)}>
                    <MaterialIcons name={revealed ? 'visibility-off' : 'vpn-key'} size={13} color="#B45309" style={{ marginRight: 4 }} />
                    <Text style={[styles.footerBtnText, { color: '#B45309' }]}>
                      {revealed ? 'Hide Answers' : 'Show Answers'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerBtn} onPress={() => Alert.alert('Print', 'Sent to printer.')}>
                    <MaterialIcons name="print" size={13} color="#64748B" style={{ marginRight: 4 }} />
                    <Text style={[styles.footerBtnText, { color: '#64748B' }]}>Print</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* FULL VIEW MODAL */}
      <Modal visible={activeSet !== null} transparent={false} animationType="slide">
        <SafeAreaView style={styles.sheetSafe} edges={['top']}>
          <View style={styles.sheetNav}>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setActiveSet(null)} activeOpacity={0.8}>
              <MaterialIcons name="close" size={20} color="#8B5CF6" />
            </TouchableOpacity>
            <Text style={styles.sheetNavTitle} numberOfLines={1}>{activeSet?.topic}</Text>
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
              <LinearGradient colors={['#2E1065', '#5B21B6']} style={styles.paperDocHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.paperDocIcon}>
                    <MaterialIcons name="question-answer" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.paperDocTitle}>Q&A Study Worksheet</Text>
                    <Text style={styles.paperDocSub}>{activeSet?.date} · {activeSet?.items.length} Question Sets</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Topic */}
              <View style={topicStyles.topicRow}>
                <Text style={topicStyles.topicLabel}>TOPIC</Text>
                <Text style={topicStyles.topicTitle}>{activeSet?.topic}</Text>
              </View>

              {/* Questions list */}
              <View style={styles.modalCluesBlock}>
                <Text style={styles.modalHeading}>Questions & Answers</Text>
                {activeSet?.items.map((item) => (
                  <View key={item.id} style={styles.modalQAItem}>
                    <View style={styles.modalQRow}>
                      <Text style={styles.modalQLabel}>Q{item.id}.</Text>
                      <Text style={styles.modalQText}>{item.question}</Text>
                    </View>
                    <View style={styles.modalARow}>
                      <Text style={styles.modalALabel}>A{item.id}.</Text>
                      <Text style={styles.modalAText}>{item.answer}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Modal copy */}
              <TouchableOpacity
                style={styles.modalCopyBtn}
                onPress={() => { if (activeSet) handleCopy(activeSet); }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={activeSet && copiedId === activeSet.id ? ['#15803D', '#16A34A'] : ['#5B21B6', '#8B5CF6']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.modalCopyBtnGrad}
                >
                  <MaterialIcons
                    name={activeSet && copiedId === activeSet.id ? 'check' : 'content-copy'}
                    size={18} color="#fff" style={{ marginRight: 10 }}
                  />
                  <Text style={styles.modalCopyBtnText}>
                    {activeSet && copiedId === activeSet.id ? 'Copied to Clipboard!' : 'Copy Study Set'}
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

const topicStyles = StyleSheet.create({
  topicRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#DDD6FE', backgroundColor: '#F5F3FF' },
  topicLabel: { fontSize: 9.5, fontWeight: '900', color: '#8B5CF6', letterSpacing: 1.2, marginBottom: 4 },
  topicTitle: { fontSize: 18, fontWeight: '900', color: '#2E1065', lineHeight: 24 },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF5FF' },

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

  scroll: { padding: 16, paddingBottom: 48 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9E3FF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  fieldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#8B5CF6', marginRight: 6 },
  fieldLabel: { fontSize: 10.5, fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.6 },

  textArea: {
    backgroundColor: '#FAF9FF',
    borderWidth: 1,
    borderColor: '#E9E3FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#1E0A3B',
    fontWeight: '600',
    height: 60,
    marginBottom: 10,
  },

  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FF',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#DDD6FE',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 12,
  },
  fileBoxActive: { backgroundColor: '#F5F3FF', borderStyle: 'solid', borderColor: '#8B5CF6' },
  fileOrb: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  fileText: { fontSize: 11.5, fontWeight: '600', color: '#5B21B6', flex: 1 },
  fileTextActive: { color: '#8B5CF6', fontWeight: '700' },

  genBtnWrap: {
    marginTop: 2,
    borderRadius: 12,
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  genBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  genBtnHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  genBtnIconZone: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  genBtnDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 8 },
  genBtnText: { color: '#fff', fontSize: 12.5, fontWeight: '900', letterSpacing: 0.2, lineHeight: 15 },
  genBtnSub: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginTop: 1,
    lineHeight: 11,
  },
  genBtnArrow: {
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  generatingState: {
    flexDirection: 'row',
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  generatingText: { fontSize: 12.5, fontWeight: '800', color: '#8B5CF6' },

  loaderCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16,
    borderWidth: 1.5, borderColor: '#E9E3FF', marginBottom: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  loaderStatus: { fontSize: 13.5, fontWeight: '700', color: '#334155' },
  progressBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  loaderPct: { fontSize: 11, fontWeight: '800', color: '#64748B', textAlign: 'right' },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, marginTop: 4 },
  sectionBar: { width: 5, height: 18, borderRadius: 3, marginRight: 9 },
  sectionTitle: { fontSize: 11.5, fontWeight: '900', color: '#1E293B', textTransform: 'uppercase', letterSpacing: 0.7, flex: 1 },
  countBadge: {
    backgroundColor: '#8B5CF6', borderRadius: 10, minWidth: 22, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  countBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  resultCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22,
    borderWidth: 1.5, borderColor: '#E9E3FF',
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4, overflow: 'hidden',
  },
  resultStrip: { height: 3 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 8 },
  resultIconOrb: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultTopic: { fontSize: 15.5, fontWeight: '900', color: '#2E1065', marginBottom: 3 },
  resultDate: { fontSize: 11.5, fontWeight: '600', color: '#5B21B6' },

  eyeOuter: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, borderColor: '#E9E3FF',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F5F3FF', marginLeft: 8,
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 8, elevation: 3,
  },
  eyeCore: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  eyeGloss: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', borderTopLeftRadius: 9, borderTopRightRadius: 9,
  },

  qaBlock: {
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 12,
  },
  puzzleTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2E1065',
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  qaItemRow: {
    backgroundColor: '#FAF9FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E9E3FF',
    gap: 10,
  },
  questionSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  answerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFDF9',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E6DFD5',
  },
  answerSectionObscured: {
    backgroundColor: '#F3F0FC',
    borderColor: '#E9E3FF',
  },
  qaBadge: {
    width: 28, height: 24, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  qaBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E1065',
    flex: 1,
    lineHeight: 20,
  },
  answerText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#3F352B',
    flex: 1,
    lineHeight: 20,
  },
  answerTextObscured: {
    color: '#A78BFA',
    letterSpacing: 1.5,
  },

  copyBtn: {
    marginHorizontal: 14, marginBottom: 12, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#2E1065', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24, shadowRadius: 10, elevation: 6,
  },
  copyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, borderRadius: 14,
  },
  copyBtnText: { fontSize: 14.5, fontWeight: '900', color: '#fff', letterSpacing: 0.3 },

  resultFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#F5F3FF', borderTopWidth: 1.5, borderTopColor: '#DDD6FE',
  },
  footerBtn: { flexDirection: 'row', alignItems: 'center' },
  footerBtnText: { fontSize: 11.5, fontWeight: '800', color: '#5B21B6' },

  sheetSafe: { flex: 1, backgroundColor: '#FAF5FF' },
  sheetNav: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', gap: 8,
  },
  sheetClose: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetNavTitle: { fontSize: 14, fontWeight: '900', color: '#0F172A', flex: 1, textAlign: 'center' },
  sheetCopyBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#8B5CF6',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9,
  },
  sheetCopyText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  sheetPrintBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#475569',
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 9,
  },
  sheetPrintText: { fontSize: 12, fontWeight: '900', color: '#fff' },
  sheetScroll: { padding: 16, paddingBottom: 48, alignItems: 'center' },

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

  modalCluesBlock: {
    padding: 16,
  },
  modalHeading: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#2E1065',
    borderBottomWidth: 1.5,
    borderBottomColor: '#DDD6FE',
    paddingBottom: 6,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalQAItem: {
    marginBottom: 16,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F0FC',
    paddingBottom: 12,
  },
  modalQRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  modalARow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  modalQLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#8B5CF6',
    width: 24,
  },
  modalALabel: {
    fontSize: 14,
    fontWeight: '900',
    color: '#475569',
    width: 24,
  },
  modalQText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E1065',
    flex: 1,
    lineHeight: 20,
  },
  modalAText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#3F352B',
    flex: 1,
    lineHeight: 20,
  },

  modalAnswerKeySection: { margin: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#DDD6FE' },
  akHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingVertical: 10 },
  akHeaderText: { fontSize: 13, fontWeight: '900', color: '#DDD6FE', letterSpacing: 0.5 },
  modalAkGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10, backgroundColor: '#F5F3FF' },
  modalAkItem: { alignItems: 'center', gap: 4, minWidth: 64 },
  modalAkNum: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  modalAkBadge: {
    backgroundColor: '#8B5CF6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.22, shadowRadius: 4, elevation: 3,
  },
  modalAkBadgeText: { fontSize: 12, fontWeight: '900', color: '#fff' },

  modalCopyBtn: {
    margin: 16, marginTop: 4, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#5B21B6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 8,
  },
  modalCopyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16,
  },
  modalCopyBtnText: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.4 },
});
