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

interface MatchColumnScreenProps {
  navigation: any;
}

interface MatchSet {
  id: string;
  topic: string;
  date: string;
  fileName?: string;
  passage: string;
  columnA: { num: number; text: string }[];
  columnB: { letter: string; text: string }[];
  answerKey: { num: number; letter: string }[];
}

const STEPS = [
  { pct: 15,  label: 'Reading input paragraph…' },
  { pct: 35,  label: 'Analyzing key concepts…' },
  { pct: 60,  label: 'Generating Column A prompts…' },
  { pct: 80,  label: 'Shuffling Column B options…' },
  { pct: 95,  label: 'Formulating answer key…' },
  { pct: 100, label: 'Match column ready! ✓' },
];

const buildSet = (topic: string, fileName?: string): MatchSet => {
  const passage = `When you think about the three common states of matter—solid, liquid, and gas—it's important to consider the microscopic behavior of their particles. In solids, particles are tightly packed in a fixed arrangement, vibrating in place. Liquids have particles that are close together but can slide past one another, allowing them to flow. Gases, on the other hand, have particles that are far apart and move randomly at high speeds, filling any container they occupy. Understanding these differences in particle arrangement and movement is key to differentiating between these fundamental states.`;

  const columnA = [
    { num: 1, text: 'Fixed arrangement of particles' },
    { num: 2, text: 'Particles slide past each other' },
    { num: 3, text: 'Particles are far apart' },
    { num: 4, text: 'Microscopic behavior of particles' },
    { num: 5, text: 'Fundamental states of matter' },
    { num: 6, text: 'Ability to flow' },
    { num: 7, text: 'Vibrating in place' },
    { num: 8, text: 'Filling any container' },
    { num: 9, text: 'High-speed random movement' },
    { num: 10, text: 'Close together but mobile' },
  ];

  const columnB = [
    { letter: 'A', text: 'Gases' },
    { letter: 'B', text: 'Solids' },
    { letter: 'C', text: 'Liquids' },
    { letter: 'D', text: 'Key to differentiation' },
    { letter: 'E', text: 'Solids' },
    { letter: 'F', text: 'Gases' },
    { letter: 'G', text: 'Liquids' },
    { letter: 'H', text: 'Important consideration' },
    { letter: 'I', text: 'Liquids' },
    { letter: 'J', text: 'Gases' },
  ];

  const answerKey = [
    { num: 1, letter: 'B' },
    { num: 2, letter: 'C' },
    { num: 3, letter: 'A' },
    { num: 4, letter: 'H' },
    { num: 5, letter: 'D' },
    { num: 6, letter: 'C' },
    { num: 7, letter: 'B' },
    { num: 8, letter: 'A' },
    { num: 9, letter: 'J' },
    { num: 10, letter: 'I' },
  ];

  return {
    id: Date.now().toString(),
    topic,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName,
    passage,
    columnA,
    columnB,
    answerKey,
  };
};

const formatText = (set: MatchSet): string => {
  let out = `Match the Column — ${set.topic}\nDate: ${set.date}\n\n`;
  out += `Passage:\n${set.passage}\n\n`;
  out += `Column A:\n`;
  set.columnA.forEach(item => { out += `${item.num}. ${item.text}\n`; });
  out += `\nColumn B:\n`;
  set.columnB.forEach(item => { out += `${item.letter}. ${item.text}\n`; });
  out += `\nAnswer Key:\n`;
  set.answerKey.forEach(ak => { out += `${ak.num} - ${ak.letter}\n`; });
  return out;
};

export const MatchColumnScreen: React.FC<MatchColumnScreenProps> = ({ navigation }) => {
  const [requestInput, setRequestInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [sets, setSets] = useState<MatchSet[]>([]);
  const [activeSet, setActiveSet] = useState<MatchSet | null>(null);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggleFile = () =>
    setFileName(f => f ? '' : 'Paragraph_Text.pdf');

  const handleGenerate = () => {
    if (!requestInput.trim()) {
      Alert.alert('Missing Input', 'Please enter your paragraph or topic text.');
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

  const handleCopy = (set: MatchSet) => {
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
              <Stop offset="0%" stopColor="#B59A7A" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#8C7C6D" stopOpacity={0.03} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="110%" cy="-6%" r="280" fill="url(#b1)" />
          <Circle cx="-10%" cy="48%" r="240" fill="#B59A7A" opacity={0.05} />
          <Circle cx="88%" cy="95%" r="300" fill="#8C7C6D" opacity={0.04} />
        </Svg>
      </View>

      {/* HEADER */}
      <LinearGradient
        colors={['#3E352B', '#63574A', '#B59A7A']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -28, top: -38, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(217,203,179,0.13)' }} />
        <View style={{ position: 'absolute', left: -18, bottom: -36, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(230,223,213,0.10)' }} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="extension" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Match the Column</Text>
              <Text style={styles.headerSub}>AI-powered · Dynamic pairings · Cream design</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient colors={['#D9CBB6', '#B59A7A', '#8C7C6D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGlow} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Feature Pills */}
        <View style={styles.pillRow}>
          {['🧩 Matching Pairs', '🔀 Shuffled Column B', '🔑 Answer Key', '📋 Copy Pairings'].map((t, i) => (
            <View key={i} style={styles.pill}>
              <Text style={styles.pillText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* INPUT CARD */}
        <View style={styles.card}>
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
              colors={fileName ? ['#F5ECE1', '#E6DFD5'] : ['#F8FAFC', '#F1F5F9']}
              style={styles.fileOrb}
            >
              <MaterialIcons
                name={fileName ? 'insert-drive-file' : 'cloud-upload'}
                size={18}
                color={fileName ? '#B59A7A' : '#94A3B8'}
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
                colors={['#3E352B', '#63574A', '#B59A7A']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.genBtn}
              >
                <View style={styles.genBtnHighlight} />
                <View style={styles.genBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={22} color="#fff" />
                </View>
                <View style={styles.genBtnDivider} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.genBtnText}>Generate Match the Column</Text>
                  <Text style={styles.genBtnSub}>AI · Column Shuffling · Answer Key</Text>
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
              <ActivityIndicator color="#B59A7A" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingText}>Creating matching pair exercise…</Text>
            </View>
          )}
        </View>

        {/* PROGRESS LOADER */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <ActivityIndicator color="#B59A7A" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#8C7C6D', '#D9CBB6']}
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
            <LinearGradient colors={['#B59A7A', '#8C7C6D']} style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>View Match the Column</Text>
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
                <LinearGradient colors={['#3E352B', '#B59A7A', '#D9CBB6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.resultStrip} />

                {/* Meta header */}
                <View style={styles.resultMeta}>
                  <LinearGradient colors={['#FAF5EC', '#E6DFD5']} style={styles.resultIconOrb}>
                    <MaterialIcons name="extension" size={17} color="#B59A7A" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultTopic} numberOfLines={1}>{set.topic}</Text>
                    <Text style={styles.resultDate}>{set.date}{set.fileName ? ` · ${set.fileName}` : ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setActiveSet(set)} activeOpacity={0.8}>
                    <View style={styles.eyeOuter}>
                      <LinearGradient colors={['#B59A7A', '#8C7C6D']} style={styles.eyeCore}>
                        <View style={styles.eyeGloss} />
                        <MaterialIcons name="remove-red-eye" size={17} color="#fff" />
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Passage Box */}
                <View style={styles.passageBox}>
                  <Text style={styles.passageText}>{set.passage}</Text>
                </View>

                {/* Column Layout */}
                <View style={styles.matchingColumnsLayout}>
                  {/* Column A */}
                  <View style={styles.matchingColHalf}>
                    <Text style={styles.columnLabel}>Column A</Text>
                    {set.columnA.map((item) => (
                      <View key={item.num} style={styles.matchItemRow}>
                        <LinearGradient colors={['#C5A880', '#A88C62']} style={styles.itemBadge}>
                          <Text style={styles.itemBadgeText}>{item.num}</Text>
                        </LinearGradient>
                        <Text style={styles.itemText}>{item.text}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Column B */}
                  <View style={styles.matchingColHalf}>
                    <Text style={styles.columnLabel}>Column B</Text>
                    {set.columnB.map((item) => (
                      <View key={item.letter} style={styles.matchItemRow}>
                        <LinearGradient colors={['#A88C62', '#8C724A']} style={styles.itemBadgeLetter}>
                          <Text style={styles.itemBadgeText}>{item.letter}</Text>
                        </LinearGradient>
                        <Text style={styles.itemText}>{item.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Answer Key */}
                <View style={styles.answerKeyBlock}>
                  <Text style={styles.answerKeyTitle}>Answer Key:</Text>
                  <View style={styles.answerKeyWrap}>
                    {set.answerKey.map((ak) => {
                      const correctWord = set.columnB.find(b => b.letter === ak.letter)?.text || '';
                      return (
                        <View key={ak.num} style={styles.akChip}>
                          <Text style={styles.akChipText}>
                            {ak.num} - {ak.letter} {revealed && `(${correctWord})`}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* Copy Button */}
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy(set)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={copiedId === set.id ? ['#15803D', '#16A34A'] : ['#8C7C6D', '#B59A7A']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.copyBtnGrad}
                  >
                    <MaterialIcons
                      name={copiedId === set.id ? 'check' : 'content-copy'}
                      size={16} color="#fff" style={{ marginRight: 8 }}
                    />
                    <Text style={styles.copyBtnText}>
                      {copiedId === set.id ? 'Copied to Clipboard!' : 'Copy Exercise'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Footer toolbar */}
                <View style={styles.resultFooter}>
                  <TouchableOpacity style={styles.footerBtn} onPress={() => setActiveSet(set)}>
                    <MaterialIcons name="open-in-full" size={13} color="#B59A7A" style={{ marginRight: 4 }} />
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
              <MaterialIcons name="close" size={20} color="#B59A7A" />
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
              <LinearGradient colors={['#3E352B', '#63574A']} style={styles.paperDocHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.paperDocIcon}>
                    <MaterialIcons name="extension" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.paperDocTitle}>Match the Column Exercise</Text>
                    <Text style={styles.paperDocSub}>{activeSet?.date} · 10 Pairs</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Topic */}
              <View style={styles.topicRow}>
                <Text style={styles.topicLabel}>TOPIC</Text>
                <Text style={styles.topicTitle}>{activeSet?.topic}</Text>
              </View>

              {/* Passage */}
              <View style={styles.modalPassageBox}>
                <Text style={styles.modalPassageTitle}>PASSAGE</Text>
                <Text style={styles.modalPassageText}>{activeSet?.passage}</Text>
              </View>

              {/* Matching Column Display */}
              <View style={styles.modalColumnsDisplay}>
                <View style={styles.modalColHalf}>
                  <Text style={styles.modalColTitle}>Column A</Text>
                  {activeSet?.columnA.map((item) => (
                    <View key={item.num} style={styles.modalItemRow}>
                      <LinearGradient colors={['#C5A880', '#A88C62']} style={styles.modalBadge}>
                        <Text style={styles.modalBadgeText}>{item.num}</Text>
                      </LinearGradient>
                      <Text style={styles.modalItemText}>{item.text}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.modalColHalf}>
                  <Text style={styles.modalColTitle}>Column B</Text>
                  {activeSet?.columnB.map((item) => (
                    <View key={item.letter} style={styles.modalItemRow}>
                      <LinearGradient colors={['#A88C62', '#8C724A']} style={styles.modalBadgeLetter}>
                        <Text style={styles.modalBadgeText}>{item.letter}</Text>
                      </LinearGradient>
                      <Text style={styles.modalItemText}>{item.text}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Answer Key */}
              <View style={styles.modalAnswerKeySection}>
                <LinearGradient colors={['#3E352B', '#63574A']} style={styles.akHeader}>
                  <MaterialIcons name="vpn-key" size={15} color="#D9CBB6" style={{ marginRight: 8 }} />
                  <Text style={styles.akHeaderText}>Answer Key</Text>
                </LinearGradient>
                <View style={styles.akGrid}>
                  {activeSet?.answerKey.map((ak) => (
                    <View key={ak.num} style={styles.akItem}>
                      <Text style={styles.akNum}>{ak.num}.</Text>
                      <View style={styles.akBadge}>
                        <Text style={styles.akBadgeText}>{ak.letter}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Modal copy */}
              <TouchableOpacity
                style={styles.modalCopyBtn}
                onPress={() => { if (activeSet) handleCopy(activeSet); }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={activeSet && copiedId === activeSet.id ? ['#15803D', '#16A34A'] : ['#63574A', '#B59A7A']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.modalCopyBtnGrad}
                >
                  <MaterialIcons
                    name={activeSet && copiedId === activeSet.id ? 'check' : 'content-copy'}
                    size={18} color="#fff" style={{ marginRight: 10 }}
                  />
                  <Text style={styles.modalCopyBtnText}>
                    {activeSet && copiedId === activeSet.id ? 'Exercise Copied to Clipboard!' : 'Copy Full Exercise'}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4EDE4' },

  header: { paddingHorizontal: 18, paddingTop: 14, paddingBottom: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 12 },
  backBtnInner: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  headerIconBox: {
    width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    marginRight: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
  },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#fff', letterSpacing: 0.2 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.92)', fontWeight: '600', marginTop: 2 },
  headerGlow: { height: 3 },

  scroll: { padding: 16, paddingBottom: 52 },

  pillRow: { flexDirection: 'row', gap: 7, marginBottom: 14, flexWrap: 'wrap' },
  pill: {
    backgroundColor: '#FFFFFF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1.5, borderColor: '#D9CBB6',
  },
  pillText: { fontSize: 11.5, fontWeight: '800', color: '#63574A' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: 28, padding: 22,
    borderWidth: 1.5, borderColor: '#D9CBB6',
    shadowColor: '#63574A', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08, shadowRadius: 24, elevation: 5, marginBottom: 20,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 4 },
  fieldDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#B59A7A', marginRight: 8 },
  fieldLabel: { fontSize: 12, fontWeight: '900', color: '#4A3E3D', textTransform: 'uppercase', letterSpacing: 0.9 },

  textArea: {
    backgroundColor: '#FAF9F6', borderWidth: 1.5, borderColor: '#E6DFD5',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14.5, color: '#1A1510', fontWeight: '600', height: 110, marginBottom: 16,
  },

  fileBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FAF9F6',
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D9CBB6',
    borderRadius: 14, paddingHorizontal: 14, height: 56, marginBottom: 20,
  },
  fileBoxActive: { backgroundColor: '#FAF5EC', borderStyle: 'solid', borderColor: '#B59A7A' },
  fileOrb: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fileText: { fontSize: 14, fontWeight: '600', color: '#63574A', flex: 1 },
  fileTextActive: { color: '#B59A7A', fontWeight: '700' },

  genBtnWrap: {
    borderRadius: 18, shadowColor: '#3E352B',
    shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.38, shadowRadius: 20, elevation: 12,
  },
  genBtn: {
    flexDirection: 'row', alignItems: 'center', height: 64, borderRadius: 18,
    overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  genBtnHighlight: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  genBtnIconZone: {
    width: 64, height: 64, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  genBtnDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', marginRight: 14 },
  genBtnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.4 },
  genBtnSub: {
    color: 'rgba(255,255,255,0.88)', fontSize: 9.5, fontWeight: '700',
    letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 3,
  },
  genBtnArrow: {
    height: 40, paddingHorizontal: 13, borderRadius: 11,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  generatingState: {
    flexDirection: 'row', backgroundColor: '#FAF5EC', borderRadius: 16, height: 56,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#B59A7A',
  },
  generatingText: { fontSize: 14.5, fontWeight: '800', color: '#63574A' },

  loaderCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16,
    borderWidth: 1.5, borderColor: '#D9CBB6', marginBottom: 22,
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
    backgroundColor: '#B59A7A', borderRadius: 10, minWidth: 22, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  countBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  resultCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22,
    borderWidth: 1.5, borderColor: '#D9CBB6',
    shadowColor: '#63574A', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4, overflow: 'hidden',
  },
  resultStrip: { height: 3 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 8 },
  resultIconOrb: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultTopic: { fontSize: 15.5, fontWeight: '900', color: '#3E352B', marginBottom: 3 },
  resultDate: { fontSize: 11.5, fontWeight: '600', color: '#8C7C6D' },

  eyeOuter: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, borderColor: '#D9CBB6',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FAF5EC', marginLeft: 8,
    shadowColor: '#B59A7A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 8, elevation: 3,
  },
  eyeCore: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  eyeGloss: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', borderTopLeftRadius: 9, borderTopRightRadius: 9,
  },

  passageBox: {
    backgroundColor: '#FAF9F6', marginHorizontal: 14, borderRadius: 12,
    padding: 14, marginBottom: 16,
    borderWidth: 1.5, borderColor: '#E6DFD5',
    borderLeftWidth: 4, borderLeftColor: '#B59A7A',
  },
  passageText: { fontSize: 14.5, fontWeight: '600', color: '#2D251E', lineHeight: 22 },

  matchingColumnsLayout: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 16,
    marginBottom: 16,
  },
  matchingColHalf: {
    flex: 1,
    gap: 8,
  },
  columnLabel: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#3E352B',
    marginBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#B59A7A',
    paddingBottom: 4,
  },
  matchItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFDF9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E6DFD5',
    borderLeftWidth: 3,
    borderLeftColor: '#C5A880',
    shadowColor: '#63574A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  itemBadge: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  itemBadgeLetter: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  itemBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
  },
  itemText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#3E352B',
    flex: 1,
    lineHeight: 18,
  },

  answerKeyBlock: {
    paddingHorizontal: 14, paddingBottom: 12,
  },
  answerKeyTitle: {
    fontSize: 11.5, fontWeight: '900', color: '#3E352B',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
  },
  answerKeyWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  akChip: {
    backgroundColor: '#FAF5EC',
    borderColor: '#C5A880',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#C5A880',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  akChipText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4A3E3D',
  },

  copyBtn: {
    marginHorizontal: 14, marginBottom: 12, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#3E352B', shadowOffset: { width: 0, height: 6 },
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
    backgroundColor: '#FAF5EC', borderTopWidth: 1.5, borderTopColor: '#E6DFD5',
  },
  footerBtn: { flexDirection: 'row', alignItems: 'center' },
  footerBtnText: { fontSize: 11.5, fontWeight: '800', color: '#63574A' },

  sheetSafe: { flex: 1, backgroundColor: '#FAF6EE' },
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
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#B59A7A',
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

  topicRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#E6DFD5', backgroundColor: '#FAF6EE' },
  topicLabel: { fontSize: 9.5, fontWeight: '900', color: '#B59A7A', letterSpacing: 1.2, marginBottom: 4 },
  topicTitle: { fontSize: 18, fontWeight: '900', color: '#63574A', lineHeight: 24 },

  modalPassageBox: {
    backgroundColor: '#FFFDF9', margin: 16, marginBottom: 0, borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: 'rgba(181,154,122,0.2)',
    borderLeftWidth: 4, borderLeftColor: '#B59A7A',
  },
  modalPassageTitle: { fontSize: 9, fontWeight: '900', color: '#B59A7A', letterSpacing: 1.2, marginBottom: 6 },
  modalPassageText: { fontSize: 14, fontWeight: '600', color: '#1E293B', lineHeight: 22 },

  modalColumnsDisplay: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  modalColHalf: {
    flex: 1,
    gap: 8,
  },
  modalColTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#63574A',
    borderBottomWidth: 1.5,
    borderBottomColor: '#B59A7A',
    paddingBottom: 4,
    marginBottom: 4,
  },
  modalItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFDF9',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E6DFD5',
  },
  modalBadge: {
    width: 22, height: 22, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  modalBadgeLetter: {
    width: 22, height: 22, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
  },
  modalItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },

  modalAnswerKeySection: { margin: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E6DFD5' },
  akHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingVertical: 10 },
  akHeaderText: { fontSize: 13, fontWeight: '900', color: '#63574A', letterSpacing: 0.5 },
  akGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10, backgroundColor: '#FAF6EE' },
  akItem: { alignItems: 'center', gap: 4, minWidth: 56 },
  akNum: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  akBadge: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#B59A7A',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#B59A7A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.22, shadowRadius: 4, elevation: 3,
  },
  akBadgeText: { fontSize: 13, fontWeight: '900', color: '#fff' },

  modalCopyBtn: {
    margin: 16, marginTop: 4, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#63574A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 8,
  },
  modalCopyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16,
  },
  modalCopyBtnText: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.4 },
});
