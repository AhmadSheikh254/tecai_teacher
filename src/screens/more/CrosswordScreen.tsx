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

interface CrosswordScreenProps {
  navigation: any;
}

interface CrosswordClue {
  num: number;
  text: string;
  length: number;
  answer: string;
}

interface CrosswordSet {
  id: string;
  topic: string;
  date: string;
  fileName?: string;
  title: string;
  across: CrosswordClue[];
  down: CrosswordClue[];
}

const STEPS = [
  { pct: 15,  label: 'Reading input paragraph…' },
  { pct: 35,  label: 'Extracting key vocabulary…' },
  { pct: 55,  label: 'Generating crossword clues…' },
  { pct: 75,  label: 'Creating puzzle layout grid…' },
  { pct: 95,  label: 'Building answer sheet…' },
  { pct: 100, label: 'Crossword puzzle ready! ✓' },
];

const buildSet = (topic: string, fileName?: string): CrosswordSet => {
  const across: CrosswordClue[] = [
    { num: 1, text: 'The state of matter with a definite shape and volume.', length: 5, answer: 'SOLID' },
    { num: 3, text: 'The state of matter that takes the shape of its container but has a definite volume.', length: 6, answer: 'LIQUID' },
    { num: 5, text: 'The state of matter that has no definite shape or volume.', length: 3, answer: 'GAS' },
    { num: 7, text: 'The process of changing from a liquid to a gas.', length: 12, answer: 'VAPORIZATION' },
    { num: 9, text: 'The process of changing from a gas to a liquid.', length: 12, answer: 'CONDENSATION' },
  ];

  const down: CrosswordClue[] = [
    { num: 2, text: 'The process of changing from a solid to a liquid.', length: 7, answer: 'MELTING' },
    { num: 4, text: 'The process of changing from a liquid to a solid.', length: 8, answer: 'FREEZING' },
    { num: 6, text: 'The process of changing from a solid directly to a gas.', length: 11, answer: 'SUBLIMATION' },
    { num: 8, text: 'The process of changing from a gas directly to a solid.', length: 10, answer: 'DEPOSITION' },
    { num: 10, text: 'The state of matter composed of ionized gas.', length: 6, answer: 'PLASMA' },
  ];

  return {
    id: Date.now().toString(),
    topic,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName,
    title: 'Crossword Puzzle',
    across,
    down,
  };
};

const formatText = (set: CrosswordSet): string => {
  let out = `Crossword Puzzle — ${set.topic}\nDate: ${set.date}\n\n`;
  out += `ACROSS:\n`;
  set.across.forEach(c => { out += `${c.num}. ${c.text} (${c.length})\n`; });
  out += `\nDOWN:\n`;
  set.down.forEach(c => { out += `${c.num}. ${c.text} (${c.length})\n`; });
  out += `\nAnswer Key:\n`;
  const allClues = [...set.across, ...set.down].sort((a, b) => a.num - b.num);
  allClues.forEach(c => { out += `${c.num}. ${c.answer}\n`; });
  return out;
};

export const CrosswordScreen: React.FC<CrosswordScreenProps> = ({ navigation }) => {
  const [requestInput, setRequestInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [sets, setSets] = useState<CrosswordSet[]>([]);
  const [activeSet, setActiveSet] = useState<CrosswordSet | null>(null);
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

  const handleCopy = (set: CrosswordSet) => {
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
              <Stop offset="0%" stopColor="#EC4899" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#BE185D" stopOpacity={0.03} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="110%" cy="-6%" r="280" fill="url(#b1)" />
          <Circle cx="-10%" cy="48%" r="240" fill="#EC4899" opacity={0.05} />
          <Circle cx="88%" cy="95%" r="300" fill="#BE185D" opacity={0.04} />
        </Svg>
      </View>

      {/* HEADER */}
      <LinearGradient
        colors={['#500730', '#9D174D', '#EC4899']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -28, top: -38, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(251,207,232,0.13)' }} />
        <View style={{ position: 'absolute', left: -18, bottom: -36, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(253,242,248,0.10)' }} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="grid-on" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Crossword Builder</Text>
              <Text style={styles.headerSub}>AI-powered · Dynamic crossword clues · Answer sheet</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient colors={['#FBCFE8', '#EC4899', '#9D174D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGlow} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
              colors={fileName ? ['#FCE7F3', '#FBCFE8'] : ['#F8FAFC', '#F1F5F9']}
              style={styles.fileOrb}
            >
              <MaterialIcons
                name={fileName ? 'insert-drive-file' : 'cloud-upload'}
                size={18}
                color={fileName ? '#EC4899' : '#94A3B8'}
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
                colors={['#500730', '#9D174D', '#EC4899']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.genBtn}
              >
                <View style={styles.genBtnHighlight} />
                <View style={styles.genBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={22} color="#fff" />
                </View>
                <View style={styles.genBtnDivider} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.genBtnText} numberOfLines={1}>Generate Crossword</Text>
                  <Text style={styles.genBtnSub} numberOfLines={1}>AI · Clue Builder · Answer Key</Text>
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
              <ActivityIndicator color="#EC4899" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingText}>Generating crossword puzzle outline…</Text>
            </View>
          )}
        </View>

        {/* PROGRESS LOADER */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <ActivityIndicator color="#EC4899" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#9D174D', '#F472B6']}
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
            <LinearGradient colors={['#EC4899', '#9D174D']} style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>View Crossword</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{sets.length}</Text>
            </View>
          </View>
        )}

        {/* RESULT CARDS */}
        <View style={{ gap: 18 }}>
          {sets.map((set) => {
            const revealed = !!revealedIds[set.id];
            const allClues = [...set.across, ...set.down].sort((a, b) => a.num - b.num);
            return (
              <View key={set.id} style={styles.resultCard}>
                <LinearGradient colors={['#500730', '#EC4899', '#F472B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.resultStrip} />

                {/* Meta header */}
                <View style={styles.resultMeta}>
                  <LinearGradient colors={['#FCE7F3', '#FBCFE8']} style={styles.resultIconOrb}>
                    <MaterialIcons name="grid-on" size={17} color="#EC4899" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultTopic} numberOfLines={1}>{set.topic}</Text>
                    <Text style={styles.resultDate}>{set.date}{set.fileName ? ` · ${set.fileName}` : ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setActiveSet(set)} activeOpacity={0.8}>
                    <View style={styles.eyeOuter}>
                      <LinearGradient colors={['#EC4899', '#9D174D']} style={styles.eyeCore}>
                        <View style={styles.eyeGloss} />
                        <MaterialIcons name="remove-red-eye" size={17} color="#fff" />
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Across & Down Section */}
                <View style={styles.puzzleBlock}>
                  <Text style={styles.puzzleTitle}>{set.title}</Text>
                  
                  {/* Across */}
                  <View style={styles.clueGroup}>
                    <Text style={styles.clueGroupTitle}>ACROSS</Text>
                    {set.across.map((c) => (
                      <View key={c.num} style={styles.clueRow}>
                        <LinearGradient colors={['#9D174D', '#EC4899']} style={styles.clueNumBadge}>
                          <Text style={styles.clueNumText}>{c.num}</Text>
                        </LinearGradient>
                        <Text style={styles.clueText}>
                          {c.text} <Text style={styles.clueLengthText}>({c.length})</Text>
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Down */}
                  <View style={styles.clueGroup}>
                    <Text style={styles.clueGroupTitle}>DOWN</Text>
                    {set.down.map((c) => (
                      <View key={c.num} style={styles.clueRow}>
                        <LinearGradient colors={['#500730', '#9D174D']} style={styles.clueNumBadge}>
                          <Text style={styles.clueNumText}>{c.num}</Text>
                        </LinearGradient>
                        <Text style={styles.clueText}>
                          {c.text} <Text style={styles.clueLengthText}>({c.length})</Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Answer Key */}
                <View style={styles.answerKeyBlock}>
                  <Text style={styles.answerKeyTitle}>Answer Key:</Text>
                  <View style={styles.answerKeyGrid}>
                    {allClues.map((c) => (
                      <View key={c.num} style={styles.akRow}>
                        <Text style={styles.akNumText}>{c.num}.</Text>
                        <View style={[styles.akWordChip, revealed && styles.akWordChipRevealed]}>
                          <Text style={[styles.akWordText, revealed && styles.akWordTextRevealed]}>
                            {revealed ? c.answer : '••••••••'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Copy Button */}
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy(set)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={copiedId === set.id ? ['#15803D', '#16A34A'] : ['#9D174D', '#EC4899']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.copyBtnGrad}
                  >
                    <MaterialIcons
                      name={copiedId === set.id ? 'check' : 'content-copy'}
                      size={16} color="#fff" style={{ marginRight: 8 }}
                    />
                    <Text style={styles.copyBtnText}>
                      {copiedId === set.id ? 'Copied!' : 'Copy Crossword'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Footer toolbar */}
                <View style={styles.resultFooter}>
                  <TouchableOpacity style={styles.footerBtn} onPress={() => setActiveSet(set)}>
                    <MaterialIcons name="open-in-full" size={13} color="#EC4899" style={{ marginRight: 4 }} />
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
              <MaterialIcons name="close" size={20} color="#EC4899" />
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
              <LinearGradient colors={['#500730', '#9D174D']} style={styles.paperDocHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.paperDocIcon}>
                    <MaterialIcons name="grid-on" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.paperDocTitle}>Crossword Puzzle Sheet</Text>
                    <Text style={styles.paperDocSub}>{activeSet?.date} · Clues & Answer Key</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Topic */}
              <View style={styles.topicRow}>
                <Text style={styles.topicLabel}>TOPIC</Text>
                <Text style={styles.topicTitle}>{activeSet?.topic}</Text>
              </View>

              {/* Clues */}
              <View style={styles.modalCluesBlock}>
                <Text style={styles.modalHeading}>Across Clues</Text>
                {activeSet?.across.map((c) => (
                  <View key={c.num} style={styles.modalClueRow}>
                    <Text style={styles.modalClueLabel}>{c.num}.</Text>
                    <Text style={styles.modalClueText}>{c.text} ({c.length})</Text>
                  </View>
                ))}

                <Text style={[styles.modalHeading, { marginTop: 20 }]}>Down Clues</Text>
                {activeSet?.down.map((c) => (
                  <View key={c.num} style={styles.modalClueRow}>
                    <Text style={styles.modalClueLabel}>{c.num}.</Text>
                    <Text style={styles.modalClueText}>{c.text} ({c.length})</Text>
                  </View>
                ))}
              </View>

              {/* Answer Key */}
              <View style={styles.modalAnswerKeySection}>
                <LinearGradient colors={['#500730', '#9D174D']} style={styles.akHeader}>
                  <MaterialIcons name="vpn-key" size={15} color="#FBCFE8" style={{ marginRight: 8 }} />
                  <Text style={styles.akHeaderText}>Answer Key</Text>
                </LinearGradient>
                <View style={styles.modalAkGrid}>
                  {[...(activeSet?.across || []), ...(activeSet?.down || [])]
                    .sort((a, b) => a.num - b.num)
                    .map((c) => (
                      <View key={c.num} style={styles.modalAkItem}>
                        <Text style={styles.modalAkNum}>{c.num}.</Text>
                        <View style={styles.modalAkBadge}>
                          <Text style={styles.modalAkBadgeText}>{c.answer}</Text>
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
                  colors={activeSet && copiedId === activeSet.id ? ['#15803D', '#16A34A'] : ['#9D174D', '#EC4899']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.modalCopyBtnGrad}
                >
                  <MaterialIcons
                    name={activeSet && copiedId === activeSet.id ? 'check' : 'content-copy'}
                    size={18} color="#fff" style={{ marginRight: 10 }}
                  />
                  <Text style={styles.modalCopyBtnText}>
                    {activeSet && copiedId === activeSet.id ? 'Copied to Clipboard!' : 'Copy Full Puzzle'}
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
  safeArea: { flex: 1, backgroundColor: '#FFF5F7' },

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
    borderColor: '#FBCFE8',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  fieldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#EC4899', marginRight: 6 },
  fieldLabel: { fontSize: 10.5, fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.6 },

  textArea: {
    backgroundColor: '#FAF9FA',
    borderWidth: 1,
    borderColor: '#F5E3EC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#1A0812',
    fontWeight: '600',
    height: 60,
    marginBottom: 10,
  },

  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FA',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FBCFE8',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 12,
  },
  fileBoxActive: { backgroundColor: '#FFF0F5', borderStyle: 'solid', borderColor: '#EC4899' },
  fileOrb: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  fileText: { fontSize: 11.5, fontWeight: '600', color: '#9D174D', flex: 1 },
  fileTextActive: { color: '#EC4899', fontWeight: '700' },

  genBtnWrap: {
    marginTop: 2,
    borderRadius: 12,
    shadowColor: '#9D174D',
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
    backgroundColor: '#FFF0F5',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EC4899',
  },
  generatingText: { fontSize: 12.5, fontWeight: '800', color: '#EC4899' },

  loaderCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16,
    borderWidth: 1.5, borderColor: '#FBCFE8', marginBottom: 22,
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
    backgroundColor: '#EC4899', borderRadius: 10, minWidth: 22, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  countBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  resultCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22,
    borderWidth: 1.5, borderColor: '#FBCFE8',
    shadowColor: '#EC4899', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4, overflow: 'hidden',
  },
  resultStrip: { height: 3 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 8 },
  resultIconOrb: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultTopic: { fontSize: 15.5, fontWeight: '900', color: '#500730', marginBottom: 3 },
  resultDate: { fontSize: 11.5, fontWeight: '600', color: '#9D174D' },

  eyeOuter: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, borderColor: '#FBCFE8',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF0F5', marginLeft: 8,
    shadowColor: '#EC4899', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 8, elevation: 3,
  },
  eyeCore: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  eyeGloss: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', borderTopLeftRadius: 9, borderTopRightRadius: 9,
  },

  puzzleBlock: {
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  puzzleTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#500730',
    marginBottom: 12,
    letterSpacing: 0.4,
  },
  clueGroup: {
    marginBottom: 16,
  },
  clueGroupTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#9D174D',
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FBCFE8',
    paddingBottom: 4,
    letterSpacing: 0.5,
  },
  clueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 8,
    backgroundColor: '#FAF9FA',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F5E3EC',
  },
  clueNumBadge: {
    width: 22, height: 22, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  clueNumText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
  },
  clueText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1A0812',
    flex: 1,
    lineHeight: 18,
  },
  clueLengthText: {
    color: '#9D174D',
    fontWeight: '800',
  },

  answerKeyBlock: {
    paddingHorizontal: 14, paddingBottom: 12,
  },
  answerKeyTitle: {
    fontSize: 11.5, fontWeight: '900', color: '#500730',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
  },
  answerKeyGrid: {
    gap: 8,
  },
  akRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  akNumText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#9D174D',
    width: 24,
    textAlign: 'right',
  },
  akWordChip: {
    backgroundColor: '#FAF9FA',
    borderWidth: 1.5,
    borderColor: '#F5E3EC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 120,
  },
  akWordChipRevealed: {
    backgroundColor: '#FFF0F5',
    borderColor: '#FBCFE8',
  },
  akWordText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 2,
  },
  akWordTextRevealed: {
    color: '#C2185B',
    letterSpacing: 0.5,
  },

  copyBtn: {
    marginHorizontal: 14, marginBottom: 12, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#500730', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.24, shadowRadius: 10, elevation: 6,
  },
  copyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 46, borderRadius: 14,
  },
  copyBtnText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 0.3 },

  resultFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FFF0F5', borderTopWidth: 1.5, borderTopColor: '#FBCFE8',
  },
  footerBtn: { flexDirection: 'row', alignItems: 'center' },
  footerBtnText: { fontSize: 11.5, fontWeight: '800', color: '#9D174D' },

  sheetSafe: { flex: 1, backgroundColor: '#FFF5F7' },
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
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#EC4899',
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

  topicRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#FBCFE8', backgroundColor: '#FFF0F5' },
  topicLabel: { fontSize: 9.5, fontWeight: '900', color: '#EC4899', letterSpacing: 1.2, marginBottom: 4 },
  topicTitle: { fontSize: 18, fontWeight: '900', color: '#500730', lineHeight: 24 },

  modalCluesBlock: {
    padding: 16,
  },
  modalHeading: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#500730',
    borderBottomWidth: 1.5,
    borderBottomColor: '#FBCFE8',
    paddingBottom: 6,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalClueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  modalClueLabel: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#9D174D',
    width: 20,
  },
  modalClueText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    lineHeight: 19,
  },

  modalAnswerKeySection: { margin: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#FBCFE8' },
  akHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingVertical: 10 },
  akHeaderText: { fontSize: 13, fontWeight: '900', color: '#FBCFE8', letterSpacing: 0.5 },
  modalAkGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10, backgroundColor: '#FFF0F5' },
  modalAkItem: { alignItems: 'center', gap: 4, minWidth: 64 },
  modalAkNum: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  modalAkBadge: {
    backgroundColor: '#EC4899', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: '#EC4899', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.22, shadowRadius: 4, elevation: 3,
  },
  modalAkBadgeText: { fontSize: 12, fontWeight: '900', color: '#fff' },

  modalCopyBtn: {
    margin: 16, marginTop: 4, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#9D174D', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 8,
  },
  modalCopyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16,
  },
  modalCopyBtnText: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.4 },
});
