import React, { useState, useEffect } from 'react';
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

interface FillBlanksScreenProps {
  navigation: any;
  route?: any;
}

interface FillBlanksResult {
  id: string;
  topic: string;
  date: string;
  fileName?: string;
  // Paragraph segments: array of { text, isBlank, answer?, blankNum? }
  segments: { text: string; isBlank: boolean; answer?: string; blankNum?: number }[];
  answerKey: { num: number; word: string }[];
}

// ── Progress steps ─────────────────────────────────────────────────────────────
const STEPS = [
  { pct: 12,  label: 'Reading paragraph content…' },
  { pct: 28,  label: 'Identifying key vocabulary…' },
  { pct: 48,  label: 'Removing target words…' },
  { pct: 66,  label: 'Building answer key…' },
  { pct: 85,  label: 'Formatting cloze passage…' },
  { pct: 100, label: 'Exercise ready! ✓' },
];

// ── Mock cloze passage builder ────────────────────────────────────────────────
const buildResult = (topic: string, fileName?: string): FillBlanksResult => {
  // Construct a paragraph where certain words are blanked
  const words: { word: string; replacement: string }[] = [
    { word: 'state',    replacement: '_____' },
    { word: 'form',     replacement: '_____' },
    { word: 'steam',    replacement: '_____' },
    { word: 'solid',    replacement: '_____' },
    { word: 'liquid',   replacement: '_____' },
    { word: 'gas',      replacement: '_____' },
    { word: 'pressure', replacement: '_____' },
    { word: 'melts',    replacement: '_____' },
    { word: 'vapor',    replacement: '_____' },
  ];

  // Paragraph segments (text interspersed with blanks)
  const segments: FillBlanksResult['segments'] = [
    { text: 'The ', isBlank: false },
    { text: '', isBlank: true, answer: 'state', blankNum: 1 },
    { text: ' of a substance determines its ', isBlank: false },
    { text: '', isBlank: true, answer: 'form', blankNum: 2 },
    { text: '. For example, ice, water, and ', isBlank: false },
    { text: '', isBlank: true, answer: 'steam', blankNum: 3 },
    { text: ' are all different states of the same substance, H₂O. The particles in a ', isBlank: false },
    { text: '', isBlank: true, answer: 'solid', blankNum: 4 },
    { text: ' are tightly packed and vibrate in fixed positions. In a ', isBlank: false },
    { text: '', isBlank: true, answer: 'liquid', blankNum: 5 },
    { text: ', particles are close together but can slide past each other. In a ', isBlank: false },
    { text: '', isBlank: true, answer: 'gas', blankNum: 6 },
    { text: ', particles are far apart and move randomly. Changes in temperature and ', isBlank: false },
    { text: '', isBlank: true, answer: 'pressure', blankNum: 7 },
    { text: ' can cause matter to change from one state to another. For instance, heating ice ', isBlank: false },
    { text: '', isBlank: true, answer: 'melts', blankNum: 8 },
    { text: ' it into liquid water, and further heating can turn water into ', isBlank: false },
    { text: '', isBlank: true, answer: 'vapor', blankNum: 9 },
    { text: '.', isBlank: false },
  ];

  return {
    id: Date.now().toString(),
    topic,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName,
    segments,
    answerKey: words.map((w, i) => ({ num: i + 1, word: w.word })),
  };
};

// ── Format for clipboard ──────────────────────────────────────────────────────
const formatText = (result: FillBlanksResult): string => {
  let out = `Fill in the Blanks — ${result.topic}\nDate: ${result.date}\n\n`;
  out += result.segments.map(s => s.isBlank ? `_____` : s.text).join('');
  out += `\n\nAnswer Key:\n`;
  result.answerKey.forEach(a => { out += `${a.num}. ${a.word}   `; });
  return out;
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export const FillBlanksScreen: React.FC<FillBlanksScreenProps> = ({ navigation, route }) => {
  const [requestInput, setRequestInput]     = useState('');
  const [fileName, setFileName]             = useState('');
  const [generating, setGenerating]         = useState(false);
  const [progress, setProgress]             = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [results, setResults]               = useState<FillBlanksResult[]>([]);
  const [activeResult, setActiveResult]     = useState<FillBlanksResult | null>(null);
  const [revealedIds, setRevealedIds]       = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId]             = useState<string | null>(null);

  // Reset route params when leaving screen so 'fromScreen' doesn't persist
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      navigation.setParams({ fromScreen: undefined } as any);
    });
    return unsubscribe;
  }, [navigation]);

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
          setResults(prev => [buildResult(requestInput.trim(), fileName || undefined), ...prev]);
          setGenerating(false);
          setProgress(0);
          setRequestInput('');
        }, 450);
      }
    }, 450);
  };

  const toggleReveal = (id: string) =>
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCopy = (r: FillBlanksResult) => {
    Clipboard.setString(formatText(r));
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  // ── Render paragraph with blanks (inline) ────────────────────────────────
  const renderParagraph = (result: FillBlanksResult, revealed: boolean) => (
    <Text style={styles.paragraphText}>
      {result.segments.map((seg, i) => {
        if (!seg.isBlank) return <Text key={i}>{seg.text}</Text>;
        return revealed
          ? <Text key={i} style={styles.answerInline}> {seg.answer} </Text>
          : <Text key={i} style={styles.blankInline}> _____ </Text>;
      })}
    </Text>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* Ambient blobs */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Defs>
            <SvgLinearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#7C3AED" stopOpacity={0.08} />
              <Stop offset="100%" stopColor="#4F46E5" stopOpacity={0.03} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="110%" cy="-6%" r="280" fill="url(#b1)" />
          <Circle cx="-10%" cy="48%" r="240" fill="#8B5CF6" opacity={0.05} />
          <Circle cx="88%" cy="95%" r="300" fill="#6D28D9" opacity={0.04} />
        </Svg>
      </View>

      {/* ── HEADER ── */}
      <LinearGradient
        colors={['#2E1065', '#4C1D95', '#6D28D9']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -28, top: -38, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(167,139,250,0.14)' }} />
        <View style={{ position: 'absolute', left: -18, bottom: -36, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(196,181,253,0.11)' }} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="border-color" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Fill in the Blanks</Text>
              <Text style={styles.headerSub}>AI-powered · Cloze test · Answer key included</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient colors={['#A78BFA', '#7C3AED', '#5B21B6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGlow} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── FEATURE PILLS ── */}
        <View style={styles.pillRow}>
          {['✍️ Cloze Passage', '📚 Inline Blanks', '🔑 Answer Key', '📋 Copy'].map((t, i) => (
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
              colors={fileName ? ['#EDE9FE', '#DDD6FE'] : ['#F8FAFC', '#F1F5F9']}
              style={styles.fileOrb}
            >
              <MaterialIcons
                name={fileName ? 'insert-drive-file' : 'cloud-upload'}
                size={18}
                color={fileName ? '#7C3AED' : '#94A3B8'}
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
                colors={['#3B0764', '#6D28D9', '#7C3AED']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.genBtn}
              >
                <View style={styles.genBtnHighlight} />
                <View style={styles.genBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={22} color="#fff" />
                </View>
                <View style={styles.genBtnDivider} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.genBtnText} numberOfLines={1}>Generate Fill in the Blanks</Text>
                  <Text style={styles.genBtnSub} numberOfLines={1}>AI · Cloze Passage · Answer Key</Text>
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
              <ActivityIndicator color="#7C3AED" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingText}>Generating exercise…</Text>
            </View>
          )}
        </View>

        {/* ── PROGRESS LOADER ── */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <ActivityIndicator color="#7C3AED" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#6D28D9', '#A78BFA']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={styles.loaderPct}>{progress}% Complete</Text>
          </View>
        )}

        {/* ── RESULTS SECTION HEADER ── */}
        {results.length > 0 && (
          <View style={styles.sectionHeaderRow}>
            <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>View Fill in the Blanks</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{results.length}</Text>
            </View>
          </View>
        )}

        {/* ── RESULT CARDS ── */}
        <View style={{ gap: 18 }}>
          {results.map((result) => (
            <View key={result.id} style={styles.resultCard}>

              {/* Top strip */}
              <LinearGradient colors={['#2E1065', '#7C3AED', '#A78BFA']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.resultStrip} />

              {/* Meta header */}
              <View style={styles.resultMeta}>
                <LinearGradient colors={['#EDE9FE', '#DDD6FE']} style={styles.resultIconOrb}>
                  <MaterialIcons name="border-color" size={17} color="#7C3AED" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTopic} numberOfLines={1}>{result.topic}</Text>
                  <Text style={styles.resultDate}>{result.date}{result.fileName ? ` · ${result.fileName}` : ''}</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveResult(result)} activeOpacity={0.8}>
                  <View style={styles.eyeOuter}>
                    <LinearGradient colors={['#7C3AED', '#5B21B6']} style={styles.eyeCore}>
                      <View style={styles.eyeGloss} />
                      <MaterialIcons name="remove-red-eye" size={17} color="#fff" />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>

              {/* ── CLOZE PARAGRAPH ── */}
              <View style={styles.paragraphBox}>
                {renderParagraph(result, !!revealedIds[result.id])}
              </View>

              {/* ── ANSWER KEY ROW ── */}
              <View style={styles.answerKeyRow}>
                <Text style={styles.answerKeyLabel}>Answer Key:</Text>
                <View style={styles.answerKeyWrap}>
                  {result.answerKey.map((a) => (
                    <Text key={a.num} style={styles.answerKeyItem}>
                      {a.num}. {a.word}
                    </Text>
                  ))}
                </View>
              </View>

              {/* ── ACTION BUTTONS ── */}
              {route?.params?.fromScreen === 'Activity' ? (
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                  <TouchableOpacity
                    style={[styles.copyBtn, { flex: 1, marginTop: 0 }]}
                    onPress={() => handleCopy(result)}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={copiedId === result.id ? ['#15803D', '#16A34A'] : ['#5B21B6', '#7C3AED']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.copyBtnGrad}
                    >
                      <MaterialIcons
                        name={copiedId === result.id ? 'check' : 'content-copy'}
                        size={15} color="#fff" style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.copyBtnText, { fontSize: 12.5 }]}>
                        {copiedId === result.id ? 'Copied!' : 'Copy'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.copyBtn, { flex: 1.4, marginTop: 0 }]}
                    onPress={() => {
                      const plainText = result.segments.map(s => s.isBlank ? s.answer : s.text).join('');
                      
                      // Calculate blank indices
                      const blankIndices: number[] = [];
                      let accumulatedText = "";
                      result.segments.forEach((seg) => {
                        if (seg.isBlank) {
                          const wordsBefore = accumulatedText.split(/\s+/).filter(w => w.length > 0).length;
                          blankIndices.push(wordsBefore);
                          accumulatedText += seg.answer;
                        } else {
                          accumulatedText += seg.text;
                        }
                      });

                      navigation.setParams({ fromScreen: undefined } as any);
                      navigation.navigate('Assignment', {
                        screen: 'Activity',
                        params: { 
                          generatedText: plainText,
                          blankIndices: blankIndices
                        }
                      });
                    }}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#0F766E', '#0D9488']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.copyBtnGrad}
                    >
                      <MaterialIcons name="check-circle" size={15} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={[styles.copyBtnText, { fontSize: 12.5 }]}>Use in Assignment</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.copyBtn}
                  onPress={() => handleCopy(result)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={copiedId === result.id ? ['#15803D', '#16A34A'] : ['#5B21B6', '#7C3AED']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.copyBtnGrad}
                  >
                    <MaterialIcons
                      name={copiedId === result.id ? 'check' : 'content-copy'}
                      size={16} color="#fff" style={{ marginRight: 8 }}
                    />
                    <Text style={styles.copyBtnText}>
                      {copiedId === result.id ? 'Copied!' : 'Copy Exercise'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Footer toolbar */}
              <View style={styles.resultFooter}>
                <TouchableOpacity style={styles.footerBtn} onPress={() => setActiveResult(result)}>
                  <MaterialIcons name="open-in-full" size={13} color="#7C3AED" style={{ marginRight: 4 }} />
                  <Text style={styles.footerBtnText}>Full View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerBtn} onPress={() => toggleReveal(result.id)}>
                  <MaterialIcons name={revealedIds[result.id] ? 'visibility-off' : 'vpn-key'} size={13} color="#B45309" style={{ marginRight: 4 }} />
                  <Text style={[styles.footerBtnText, { color: '#B45309' }]}>
                    {revealedIds[result.id] ? 'Hide Answers' : 'Show Answers'}
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
      <Modal visible={activeResult !== null} transparent={false} animationType="slide">
        <SafeAreaView style={styles.sheetSafe} edges={['top']}>
          <View style={styles.sheetNav}>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setActiveResult(null)} activeOpacity={0.8}>
              <MaterialIcons name="close" size={20} color="#7C3AED" />
            </TouchableOpacity>
            <Text style={styles.sheetNavTitle} numberOfLines={1}>{activeResult?.topic}</Text>
            <TouchableOpacity
              style={styles.sheetCopyBtn}
              onPress={() => { if (activeResult) handleCopy(activeResult); }}
              activeOpacity={0.8}
            >
              <MaterialIcons
                name={activeResult && copiedId === activeResult.id ? 'check' : 'content-copy'}
                size={14} color="#fff" style={{ marginRight: 4 }}
              />
              <Text style={styles.sheetCopyText}>
                {activeResult && copiedId === activeResult.id ? 'Copied!' : 'Copy'}
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
              <LinearGradient colors={['#2E1065', '#4C1D95']} style={styles.paperDocHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.paperDocIcon}>
                    <MaterialIcons name="border-color" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.paperDocTitle}>Fill in the Blanks Exercise</Text>
                    <Text style={styles.paperDocSub}>{activeResult?.date}</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Topic */}
              <View style={styles.topicRow}>
                <Text style={styles.topicLabel}>TOPIC</Text>
                <Text style={styles.topicTitle}>{activeResult?.topic}</Text>
              </View>

              {/* Instruction */}
              <View style={styles.modalInstructionBox}>
                <MaterialIcons name="info-outline" size={15} color="#7C3AED" style={{ marginRight: 8 }} />
                <Text style={styles.modalInstructionText}>
                  Fill in the blanks using the appropriate words. The answer key is provided at the end.
                </Text>
              </View>

              {/* Cloze passage (blanks, no reveal) */}
              <View style={styles.modalParagraphBox}>
                {activeResult && (
                  <Text style={styles.modalParagraphText}>
                    {activeResult.segments.map((seg, i) =>
                      seg.isBlank
                        ? <Text key={i} style={styles.modalBlankInline}> ___({seg.blankNum})___ </Text>
                        : <Text key={i}>{seg.text}</Text>
                    )}
                  </Text>
                )}
              </View>

              {/* Answer Key */}
              <View style={styles.modalAnswerKeySection}>
                <LinearGradient colors={['#3B0764', '#4C1D95']} style={styles.akHeader}>
                  <MaterialIcons name="vpn-key" size={15} color="#DDD6FE" style={{ marginRight: 8 }} />
                  <Text style={styles.akHeaderText}>Answer Key</Text>
                </LinearGradient>
                <View style={styles.akGrid}>
                  {activeResult?.answerKey.map((a) => (
                    <View key={a.num} style={styles.akItem}>
                      <Text style={styles.akNum}>{a.num}.</Text>
                      <View style={styles.akBadge}>
                        <Text style={styles.akBadgeText}>{a.word}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Modal copy button */}
              {route?.params?.fromScreen === 'Activity' ? (
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                  <TouchableOpacity
                    style={[styles.modalCopyBtn, { flex: 1, marginTop: 0 }]}
                    onPress={() => { if (activeResult) handleCopy(activeResult); }}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={activeResult && copiedId === activeResult.id ? ['#15803D', '#16A34A'] : ['#5B21B6', '#7C3AED']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.modalCopyBtnGrad}
                    >
                      <MaterialIcons
                        name={activeResult && copiedId === activeResult.id ? 'check' : 'content-copy'}
                        size={16} color="#fff" style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.modalCopyBtnText, { fontSize: 13 }]}>
                        {activeResult && copiedId === activeResult.id ? 'Copied!' : 'Copy'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalCopyBtn, { flex: 1.4, marginTop: 0 }]}
                    onPress={() => {
                      if (!activeResult) return;
                      const plainText = activeResult.segments.map(s => s.isBlank ? s.answer : s.text).join('');
                      
                      // Calculate blank indices
                      const blankIndices: number[] = [];
                      let accumulatedText = "";
                      activeResult.segments.forEach((seg) => {
                        if (seg.isBlank) {
                          const wordsBefore = accumulatedText.split(/\s+/).filter(w => w.length > 0).length;
                          blankIndices.push(wordsBefore);
                          accumulatedText += seg.answer;
                        } else {
                          accumulatedText += seg.text;
                        }
                      });

                      setActiveResult(null);
                      navigation.setParams({ fromScreen: undefined } as any);
                      navigation.navigate('Assignment', {
                        screen: 'Activity',
                        params: { 
                          generatedText: plainText,
                          blankIndices: blankIndices
                        }
                      });
                    }}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#0F766E', '#0D9488']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.modalCopyBtnGrad}
                    >
                      <MaterialIcons name="check-circle" size={16} color="#fff" style={{ marginRight: 6 }} />
                      <Text style={[styles.modalCopyBtnText, { fontSize: 13 }]}>Use in Assignment</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.modalCopyBtn}
                  onPress={() => { if (activeResult) handleCopy(activeResult); }}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={activeResult && copiedId === activeResult.id ? ['#15803D', '#16A34A'] : ['#5B21B6', '#7C3AED']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.modalCopyBtnGrad}
                  >
                    <MaterialIcons
                      name={activeResult && copiedId === activeResult.id ? 'check' : 'content-copy'}
                      size={18} color="#fff" style={{ marginRight: 10 }}
                    />
                    <Text style={styles.modalCopyBtnText}>
                      {activeResult && copiedId === activeResult.id ? 'Copied to Clipboard!' : 'Copy Full Exercise'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF8FF' },

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
    backgroundColor: '#EDE9FE', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.22)',
  },
  pillText: { fontSize: 9.5, fontWeight: '800', color: '#6D28D9' },

  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, marginBottom: 12,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 2 },
  fieldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#7C3AED', marginRight: 6 },
  fieldLabel: { fontSize: 9.5, fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.8 },

  textArea: {
    backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: 'rgba(124,58,237,0.16)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8,
    fontSize: 12, color: '#0F172A', fontWeight: '600', height: 60, marginBottom: 10,
  },

  fileBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
    borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(124,58,237,0.18)',
    borderRadius: 10, paddingHorizontal: 10, height: 36, marginBottom: 12,
  },
  fileBoxActive: { backgroundColor: '#EDE9FE', borderStyle: 'solid', borderColor: '#7C3AED' },
  fileOrb: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  fileText: { fontSize: 11.5, fontWeight: '600', color: '#94A3B8', flex: 1 },
  fileTextActive: { color: '#7C3AED', fontWeight: '700' },

  genBtnWrap: {
    borderRadius: 12, shadowColor: '#4C1D95',
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
    flexDirection: 'row', backgroundColor: '#F5F3FF', borderRadius: 12, height: 44,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.28)',
  },
  generatingText: { fontSize: 12.5, fontWeight: '800', color: '#7C3AED' },

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
    backgroundColor: '#7C3AED', borderRadius: 10, minWidth: 22, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  countBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  resultCard: {
    backgroundColor: '#fff', borderRadius: 22,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07, shadowRadius: 14, elevation: 4, overflow: 'hidden',
  },
  resultStrip: { height: 3 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 8 },
  resultIconOrb: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultTopic: { fontSize: 14.5, fontWeight: '900', color: '#2E1065', marginBottom: 3 },
  resultDate: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },

  eyeOuter: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.3)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.06)', marginLeft: 8,
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 8, elevation: 3,
  },
  eyeCore: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  eyeGloss: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', borderTopLeftRadius: 9, borderTopRightRadius: 9,
  },

  // ── CLOZE PARAGRAPH ──────────────────────────────────────────────────────
  paragraphBox: {
    backgroundColor: '#FAFAFA', borderRadius: 14, marginHorizontal: 14,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
  },
  paragraphText: {
    fontSize: 14, fontWeight: '500', color: '#1E293B', lineHeight: 26,
  },
  blankInline: {
    color: '#7C3AED', fontWeight: '900', letterSpacing: 0.5,
    textDecorationLine: 'underline', textDecorationColor: '#7C3AED',
  },
  answerInline: {
    color: '#15803D', fontWeight: '900',
    textDecorationLine: 'underline', textDecorationColor: '#15803D',
  },

  // ── ANSWER KEY INLINE ─────────────────────────────────────────────────────
  answerKeyRow: {
    paddingHorizontal: 14, paddingBottom: 12,
  },
  answerKeyLabel: {
    fontSize: 11, fontWeight: '900', color: '#4C1D95',
    textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6,
  },
  answerKeyWrap: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
  },
  answerKeyItem: {
    fontSize: 13, fontWeight: '700', color: '#334155',
    backgroundColor: '#EDE9FE', borderRadius: 7,
    paddingHorizontal: 10, paddingVertical: 4,
    overflow: 'hidden',
  },

  // COPY BUTTON
  copyBtn: {
    marginHorizontal: 14, marginBottom: 12, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#5B21B6', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
  },
  copyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 46, borderRadius: 14,
  },
  copyBtnText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 0.3 },

  resultFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FAF8FF', borderTopWidth: 1, borderTopColor: '#EDE9FE',
  },
  footerBtn: { flexDirection: 'row', alignItems: 'center' },
  footerBtnText: { fontSize: 11, fontWeight: '800', color: '#7C3AED' },

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
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#6D28D9',
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

  topicRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#EDE9FE', backgroundColor: '#FAF8FF' },
  topicLabel: { fontSize: 9.5, fontWeight: '900', color: '#7C3AED', letterSpacing: 1.2, marginBottom: 4 },
  topicTitle: { fontSize: 18, fontWeight: '900', color: '#2E1065', lineHeight: 24 },

  modalInstructionBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#F5F3FF', padding: 14, margin: 16, marginBottom: 0,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(124,58,237,0.18)',
  },
  modalInstructionText: { flex: 1, fontSize: 12.5, fontWeight: '600', color: '#4C1D95', lineHeight: 18 },

  modalParagraphBox: {
    backgroundColor: '#FAFAFA', margin: 16, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#EDE9FE',
  },
  modalParagraphText: { fontSize: 14.5, fontWeight: '500', color: '#1E293B', lineHeight: 28 },
  modalBlankInline: {
    color: '#7C3AED', fontWeight: '900',
    textDecorationLine: 'underline', textDecorationColor: '#7C3AED',
  },

  modalAnswerKeySection: { margin: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#DDD6FE' },
  akHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingVertical: 10 },
  akHeaderText: { fontSize: 13, fontWeight: '900', color: '#DDD6FE', letterSpacing: 0.5 },
  akGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 14, gap: 10, backgroundColor: '#FAF8FF' },
  akItem: { alignItems: 'center', gap: 4, minWidth: 64 },
  akNum: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  akBadge: {
    backgroundColor: '#7C3AED', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.22, shadowRadius: 4, elevation: 3,
  },
  akBadgeText: { fontSize: 12, fontWeight: '900', color: '#fff' },

  modalCopyBtn: {
    margin: 16, marginTop: 4, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#4C1D95', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 8,
  },
  modalCopyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16,
  },
  modalCopyBtnText: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.4 },
});
