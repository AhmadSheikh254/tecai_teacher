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

interface TrueFalseScreenProps {
  navigation: any;
}

interface TFStatement {
  id: number;
  text: string;
  answer: 'True' | 'False';
}

interface TFSet {
  id: string;
  topic: string;
  date: string;
  fileName?: string;
  passage: string;
  statements: TFStatement[];
}

// ── Progress steps ────────────────────────────────────────────────────────────
const STEPS = [
  { pct: 12,  label: 'Reading paragraph content…' },
  { pct: 28,  label: 'Identifying key facts…' },
  { pct: 48,  label: 'Generating true statements…' },
  { pct: 66,  label: 'Generating false statements…' },
  { pct: 84,  label: 'Building answer key…' },
  { pct: 100, label: 'Exercise ready! ✓' },
];

// ── Format clipboard text ────────────────────────────────────────────────────
const formatText = (set: TFSet): string => {
  let out = `True / False — ${set.topic}\nDate: ${set.date}\n\n`;
  out += `Passage:\n${set.passage}\n\n`;
  set.statements.forEach(s => { out += `${s.id}. ${s.text}\n`; });
  out += `\nAnswer Key:\n`;
  set.statements.forEach(s => { out += `${s.id}. ${s.answer}\n`; });
  return out;
};

// ── Mock data builder ─────────────────────────────────────────────────────────
const buildSet = (topic: string, fileName?: string): TFSet => {
  const passage = `Vadim was going to say something in reply when he stopped to think more carefully about what the old man had said.`;

  const statements: TFStatement[] = [
    { id: 1,  text: 'Vadim was not going to say anything.',            answer: 'False' },
    { id: 2,  text: 'Vadim stopped to think.',                         answer: 'True'  },
    { id: 3,  text: 'Vadim was thinking about something new.',          answer: 'False' },
    { id: 4,  text: "Vadim's thinking was quick.",                      answer: 'False' },
    { id: 5,  text: 'The old man had said nothing.',                    answer: 'False' },
    { id: 6,  text: 'Vadim was replying to a question.',                answer: 'False' },
    { id: 7,  text: 'Vadim stopped to think after speaking.',           answer: 'False' },
    { id: 8,  text: "The old man's words were unclear.",                answer: 'False' },
    { id: 9,  text: 'Vadim was going to say something.',                answer: 'True'  },
    { id: 10, text: 'Vadim was thinking about what he himself had said.',answer: 'False' },
  ];

  return {
    id: Date.now().toString(),
    topic,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName,
    passage,
    statements,
  };
};

// ── THEME COLORS ─────────────────────────────────────────────────────────────
const C = {
  primary:   '#0D9488',
  dark:      '#134E4A',
  mid:       '#0F766E',
  light:     '#CCFBF1',
  lighter:   '#F0FDFA',
  border:    'rgba(13,148,136,0.18)',
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export const TrueFalseScreen: React.FC<TrueFalseScreenProps> = ({ navigation }) => {
  const [requestInput, setRequestInput]       = useState('');
  const [fileName, setFileName]               = useState('');
  const [generating, setGenerating]           = useState(false);
  const [progress, setProgress]               = useState(0);
  const [progressStatus, setProgressStatus]   = useState('');
  const [sets, setSets]                       = useState<TFSet[]>([]);
  const [activeSet, setActiveSet]             = useState<TFSet | null>(null);
  const [revealedIds, setRevealedIds]         = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId]               = useState<string | null>(null);

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
    }, 460);
  };

  const toggleReveal = (id: string) =>
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCopy = (set: TFSet) => {
    Clipboard.setString(formatText(set));
    setCopiedId(set.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* Ambient blobs */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Defs>
            <SvgLinearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0D9488" stopOpacity={0.07} />
              <Stop offset="100%" stopColor="#0891B2" stopOpacity={0.03} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="108%" cy="-6%" r="270" fill="url(#b1)" />
          <Circle cx="-10%" cy="50%" r="230" fill="#0D9488" opacity={0.05} />
          <Circle cx="88%" cy="94%" r="290" fill="#134E4A" opacity={0.04} />
        </Svg>
      </View>

      {/* ── HEADER ── */}
      <LinearGradient
        colors={['#134E4A', '#0F766E', '#0D9488']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -28, top: -38, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(153,246,228,0.13)' }} />
        <View style={{ position: 'absolute', left: -18, bottom: -36, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(204,251,241,0.10)' }} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="fact-check" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>True False Generator</Text>
              <Text style={styles.headerSub}>AI-powered · Smart statements · Answer key included</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient colors={['#99F6E4', '#0D9488', '#0F766E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGlow} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── FEATURE PILLS ── */}
        <View style={styles.pillRow}>
          {['✅ True / False', '📝 Passage Based', '🔑 Answer Key', '📋 Copy'].map((t, i) => (
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
              colors={fileName ? ['#CCFBF1', '#99F6E4'] : ['#F8FAFC', '#F1F5F9']}
              style={styles.fileOrb}
            >
              <MaterialIcons
                name={fileName ? 'insert-drive-file' : 'cloud-upload'}
                size={18}
                color={fileName ? '#0D9488' : '#94A3B8'}
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
                colors={['#134E4A', '#0F766E', '#0D9488']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.genBtn}
              >
                <View style={styles.genBtnHighlight} />
                <View style={styles.genBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={22} color="#fff" />
                </View>
                <View style={styles.genBtnDivider} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.genBtnText}>Generate True False</Text>
                  <Text style={styles.genBtnSub}>AI · Smart Statements · Answer Key</Text>
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
              <ActivityIndicator color="#0D9488" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingText}>Generating exercise…</Text>
            </View>
          )}
        </View>

        {/* ── PROGRESS LOADER ── */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <ActivityIndicator color="#0D9488" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#0F766E', '#5EEAD4']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={styles.loaderPct}>{progress}% Complete</Text>
          </View>
        )}

        {/* ── RESULTS HEADER ── */}
        {sets.length > 0 && (
          <View style={styles.sectionHeaderRow}>
            <LinearGradient colors={['#0D9488', '#0F766E']} style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>View True False</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{sets.length}</Text>
            </View>
          </View>
        )}

        {/* ── RESULT CARDS ── */}
        <View style={{ gap: 18 }}>
          {sets.map((set) => {
            const revealed = !!revealedIds[set.id];
            return (
              <View key={set.id} style={styles.resultCard}>

                {/* Top strip */}
                <LinearGradient colors={['#134E4A', '#0D9488', '#5EEAD4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.resultStrip} />

                {/* Meta header */}
                <View style={styles.resultMeta}>
                  <LinearGradient colors={['#CCFBF1', '#99F6E4']} style={styles.resultIconOrb}>
                    <MaterialIcons name="fact-check" size={17} color="#0D9488" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.resultTopic} numberOfLines={1}>{set.topic}</Text>
                    <Text style={styles.resultDate}>{set.date}{set.fileName ? ` · ${set.fileName}` : ''}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setActiveSet(set)} activeOpacity={0.8}>
                    <View style={styles.eyeOuter}>
                      <LinearGradient colors={['#0D9488', '#0F766E']} style={styles.eyeCore}>
                        <View style={styles.eyeGloss} />
                        <MaterialIcons name="remove-red-eye" size={17} color="#fff" />
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Passage */}
                <View style={styles.passageBox}>
                  <Text style={styles.passageText}>{set.passage}</Text>
                </View>

                {/* Statements list */}
                <View style={styles.statementsBlock}>
                  {set.statements.map((s) => {
                    const isTrue = s.answer === 'True';
                    const showAnswer = revealed;
                    return (
                      <View
                        key={s.id}
                        style={[
                          styles.statementRow,
                          showAnswer && isTrue  && styles.statementRowTrue,
                          showAnswer && !isTrue && styles.statementRowFalse,
                        ]}
                      >
                        {/* Number badge */}
                        <LinearGradient
                          colors={showAnswer
                            ? isTrue  ? ['#047857', '#059669']
                                      : ['#B91C1C', '#DC2626']
                            : ['#0F766E', '#0D9488']}
                          style={styles.statNumBadge}
                        >
                          <Text style={styles.statNumText}>{s.id}</Text>
                        </LinearGradient>

                        <Text style={[
                          styles.statementText,
                          showAnswer && isTrue  && styles.statementTextTrue,
                          showAnswer && !isTrue && styles.statementTextFalse,
                        ]}>
                          {s.text}
                        </Text>

                        {/* True/False badge (revealed) */}
                        {showAnswer && (
                          <View style={[styles.tfBadge, isTrue ? styles.tfBadgeTrue : styles.tfBadgeFalse]}>
                            <MaterialIcons
                              name={isTrue ? 'check' : 'close'}
                              size={12} color="#fff" style={{ marginRight: 3 }}
                            />
                            <Text style={styles.tfBadgeText}>{s.answer}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>

                {/* Answer Key */}
                <View style={styles.answerKeyBlock}>
                  <Text style={styles.answerKeyTitle}>Answer Key:</Text>
                  <View style={styles.answerKeyWrap}>
                    {set.statements.map((s) => (
                      <View
                        key={s.id}
                        style={[
                          styles.akChip,
                          s.answer === 'True'  ? styles.akChipTrue  : styles.akChipFalse
                        ]}
                      >
                        <Text style={[styles.akChipText, s.answer === 'True' ? styles.akChipTextTrue : styles.akChipTextFalse]}>
                          {s.id}. {s.answer}
                        </Text>
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
                    colors={copiedId === set.id ? ['#15803D', '#16A34A'] : ['#0F766E', '#0D9488']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.copyBtnGrad}
                  >
                    <MaterialIcons
                      name={copiedId === set.id ? 'check' : 'content-copy'}
                      size={16} color="#fff" style={{ marginRight: 8 }}
                    />
                    <Text style={styles.copyBtnText}>
                      {copiedId === set.id ? 'Copied!' : 'Copy Exercise'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Footer toolbar */}
                <View style={styles.resultFooter}>
                  <TouchableOpacity style={styles.footerBtn} onPress={() => setActiveSet(set)}>
                    <MaterialIcons name="open-in-full" size={13} color="#0D9488" style={{ marginRight: 4 }} />
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

      {/* ── FULL VIEW MODAL ── */}
      <Modal visible={activeSet !== null} transparent={false} animationType="slide">
        <SafeAreaView style={styles.sheetSafe} edges={['top']}>
          <View style={styles.sheetNav}>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setActiveSet(null)} activeOpacity={0.8}>
              <MaterialIcons name="close" size={20} color="#0D9488" />
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

              <LinearGradient colors={['#134E4A', '#0F766E']} style={styles.paperDocHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.paperDocIcon}>
                    <MaterialIcons name="fact-check" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.paperDocTitle}>True / False Exercise</Text>
                    <Text style={styles.paperDocSub}>{activeSet?.date} · {activeSet?.statements.length} Statements</Text>
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

              {/* Statements (with T/F label at end) */}
              <View style={styles.modalStatements}>
                <Text style={styles.modalStatementsTitle}>Statements</Text>
                {activeSet?.statements.map((s) => (
                  <View key={s.id} style={styles.modalStatRow}>
                    <LinearGradient colors={['#0F766E', '#0D9488']} style={styles.modalStatBadge}>
                      <Text style={styles.modalStatBadgeText}>{s.id}</Text>
                    </LinearGradient>
                    <Text style={styles.modalStatText}>{s.text}</Text>
                    <View style={[styles.modalTfTag, s.answer === 'True' ? styles.modalTfTagTrue : styles.modalTfTagFalse]}>
                      <Text style={[styles.modalTfTagText, s.answer === 'True' ? styles.modalTfTagTextTrue : styles.modalTfTagTextFalse]}>
                        {s.answer}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Answer Key */}
              <View style={styles.modalAnswerKeySection}>
                <LinearGradient colors={['#134E4A', '#0F766E']} style={styles.akHeader}>
                  <MaterialIcons name="vpn-key" size={15} color="#99F6E4" style={{ marginRight: 8 }} />
                  <Text style={styles.akHeaderText}>Answer Key</Text>
                </LinearGradient>
                <View style={styles.akGrid}>
                  {activeSet?.statements.map((s) => (
                    <View key={s.id} style={styles.akItem}>
                      <Text style={styles.akNum}>{s.id}.</Text>
                      <View style={[styles.akBadge, s.answer === 'True' ? styles.akBadgeTrue : styles.akBadgeFalse]}>
                        <Text style={styles.akBadgeText}>{s.answer}</Text>
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
                  colors={activeSet && copiedId === activeSet.id ? ['#15803D', '#16A34A'] : ['#0F766E', '#0D9488']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.modalCopyBtnGrad}
                >
                  <MaterialIcons
                    name={activeSet && copiedId === activeSet.id ? 'check' : 'content-copy'}
                    size={18} color="#fff" style={{ marginRight: 10 }}
                  />
                  <Text style={styles.modalCopyBtnText}>
                    {activeSet && copiedId === activeSet.id ? 'Copied to Clipboard!' : 'Copy Full Exercise'}
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

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0FDFA' },

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
  headerSub: { fontSize: 10.5, color: 'rgba(255,255,255,0.88)', fontWeight: '600', marginTop: 2 },
  headerGlow: { height: 3 },

  scroll: { padding: 16, paddingBottom: 52 },

  pillRow: { flexDirection: 'row', gap: 7, marginBottom: 14, flexWrap: 'wrap' },
  pill: {
    backgroundColor: '#CCFBF1', borderRadius: 20, paddingHorizontal: 11, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(13,148,136,0.25)',
  },
  pillText: { fontSize: 10.5, fontWeight: '800', color: '#0F766E' },

  card: {
    backgroundColor: '#fff', borderRadius: 28, padding: 22,
    borderWidth: 1, borderColor: 'rgba(13,148,136,0.1)',
    shadowColor: '#0D9488', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08, shadowRadius: 24, elevation: 5, marginBottom: 20,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7, marginTop: 4 },
  fieldDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#0D9488', marginRight: 7 },
  fieldLabel: { fontSize: 10.5, fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.9 },

  textArea: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: 'rgba(13,148,136,0.16)',
    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 13.5, color: '#0F172A', fontWeight: '600', height: 104, marginBottom: 14,
  },

  fileBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(13,148,136,0.18)',
    borderRadius: 14, paddingHorizontal: 12, height: 52, marginBottom: 20,
  },
  fileBoxActive: { backgroundColor: '#CCFBF1', borderStyle: 'solid', borderColor: '#0D9488' },
  fileOrb: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  fileText: { fontSize: 13, fontWeight: '600', color: '#94A3B8', flex: 1 },
  fileTextActive: { color: '#0D9488', fontWeight: '700' },

  genBtnWrap: {
    borderRadius: 18, shadowColor: '#0F766E',
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
    color: 'rgba(255,255,255,0.82)', fontSize: 9.5, fontWeight: '700',
    letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 3,
  },
  genBtnArrow: {
    height: 40, paddingHorizontal: 13, borderRadius: 11,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  generatingState: {
    flexDirection: 'row', backgroundColor: '#CCFBF1', borderRadius: 16, height: 56,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(13,148,136,0.28)',
  },
  generatingText: { fontSize: 14, fontWeight: '800', color: '#0D9488' },

  loaderCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16,
    borderWidth: 1.5, borderColor: '#E2E8F0', marginBottom: 22,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  loaderStatus: { fontSize: 13, fontWeight: '700', color: '#334155' },
  progressBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 3 },
  loaderPct: { fontSize: 10.5, fontWeight: '800', color: '#64748B', textAlign: 'right' },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, marginTop: 4 },
  sectionBar: { width: 5, height: 18, borderRadius: 3, marginRight: 9 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: '#1E293B', textTransform: 'uppercase', letterSpacing: 0.7, flex: 1 },
  countBadge: {
    backgroundColor: '#0D9488', borderRadius: 10, minWidth: 22, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  countBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  resultCard: {
    backgroundColor: '#fff', borderRadius: 22,
    borderWidth: 1, borderColor: 'rgba(13,148,136,0.1)',
    shadowColor: '#0D9488', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07, shadowRadius: 14, elevation: 4, overflow: 'hidden',
  },
  resultStrip: { height: 3 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 8 },
  resultIconOrb: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultTopic: { fontSize: 14.5, fontWeight: '900', color: '#134E4A', marginBottom: 3 },
  resultDate: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },

  eyeOuter: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, borderColor: 'rgba(13,148,136,0.3)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(13,148,136,0.06)', marginLeft: 8,
    shadowColor: '#0D9488', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 8, elevation: 3,
  },
  eyeCore: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  eyeGloss: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', borderTopLeftRadius: 9, borderTopRightRadius: 9,
  },

  // PASSAGE
  passageBox: {
    backgroundColor: '#F0FDFA', marginHorizontal: 14, borderRadius: 12,
    padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(13,148,136,0.15)',
    borderLeftWidth: 4, borderLeftColor: '#0D9488',
  },
  passageText: { fontSize: 13, fontWeight: '500', color: '#1E293B', lineHeight: 20, fontStyle: 'italic' },

  // STATEMENTS
  statementsBlock: { paddingHorizontal: 14, paddingBottom: 10, gap: 6 },
  statementRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: '#E2E8F0', gap: 10,
  },
  statementRowTrue:  { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  statementRowFalse: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  statNumBadge: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statNumText: { fontSize: 11, fontWeight: '900', color: '#fff' },
  statementText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#1E293B', lineHeight: 18 },
  statementTextTrue:  { color: '#166534' },
  statementTextFalse: { color: '#991B1B' },
  tfBadge: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexShrink: 0,
  },
  tfBadgeTrue:  { backgroundColor: '#16A34A' },
  tfBadgeFalse: { backgroundColor: '#DC2626' },
  tfBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  // ANSWER KEY IN CARD
  answerKeyBlock: { paddingHorizontal: 14, paddingBottom: 12 },
  answerKeyTitle: {
    fontSize: 11, fontWeight: '900', color: '#134E4A',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
  },
  answerKeyWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  akChip: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  akChipTrue:  { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  akChipFalse: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  akChipText: { fontSize: 12, fontWeight: '800' },
  akChipTextTrue:  { color: '#166534' },
  akChipTextFalse: { color: '#991B1B' },

  // COPY BUTTON
  copyBtn: {
    marginHorizontal: 14, marginBottom: 12, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#0F766E', shadowOffset: { width: 0, height: 6 },
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
    backgroundColor: '#F0FDFA', borderTopWidth: 1, borderTopColor: '#CCFBF1',
  },
  footerBtn: { flexDirection: 'row', alignItems: 'center' },
  footerBtnText: { fontSize: 11, fontWeight: '800', color: '#0D9488' },

  // MODAL
  sheetSafe: { flex: 1, backgroundColor: '#F8FAFC' },
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
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D9488',
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

  topicRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#CCFBF1', backgroundColor: '#F0FDFA' },
  topicLabel: { fontSize: 9.5, fontWeight: '900', color: '#0D9488', letterSpacing: 1.2, marginBottom: 4 },
  topicTitle: { fontSize: 18, fontWeight: '900', color: '#134E4A', lineHeight: 24 },

  modalPassageBox: {
    backgroundColor: '#F0FDFA', margin: 16, marginBottom: 0, borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: 'rgba(13,148,136,0.2)',
    borderLeftWidth: 4, borderLeftColor: '#0D9488',
  },
  modalPassageTitle: { fontSize: 9, fontWeight: '900', color: '#0D9488', letterSpacing: 1.2, marginBottom: 6 },
  modalPassageText: { fontSize: 13.5, fontWeight: '500', color: '#1E293B', lineHeight: 21, fontStyle: 'italic' },

  modalStatements: { padding: 16, gap: 10 },
  modalStatementsTitle: { fontSize: 11, fontWeight: '900', color: '#134E4A', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 },
  modalStatRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FAFAFA', borderRadius: 12,
    padding: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  modalStatBadge: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  modalStatBadgeText: { fontSize: 11.5, fontWeight: '900', color: '#fff' },
  modalStatText: { flex: 1, fontSize: 13.5, fontWeight: '600', color: '#1E293B', lineHeight: 20 },
  modalTfTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, flexShrink: 0 },
  modalTfTagTrue:  { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  modalTfTagFalse: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  modalTfTagText: { fontSize: 11.5, fontWeight: '900' },
  modalTfTagTextTrue:  { color: '#166534' },
  modalTfTagTextFalse: { color: '#991B1B' },

  modalAnswerKeySection: { margin: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#99F6E4' },
  akHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingVertical: 10 },
  akHeaderText: { fontSize: 13, fontWeight: '900', color: '#99F6E4', letterSpacing: 0.5 },
  akGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10, backgroundColor: '#F0FDFA' },
  akItem: { alignItems: 'center', gap: 4, minWidth: 56 },
  akNum: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  akBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, minWidth: 52, alignItems: 'center' },
  akBadgeTrue:  { backgroundColor: '#16A34A' },
  akBadgeFalse: { backgroundColor: '#DC2626' },
  akBadgeText: { fontSize: 12, fontWeight: '900', color: '#fff' },

  modalCopyBtn: {
    margin: 16, marginTop: 4, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#0F766E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 8,
  },
  modalCopyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16,
  },
  modalCopyBtnText: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.4 },
});
