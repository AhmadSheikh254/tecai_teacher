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

interface ExcelGenScreenProps {
  navigation: any;
}

interface ExcelRow {
  id: number;
  name: string;
  quiz1: number;
  quiz2: number;
  average: number;
}

interface ExcelSet {
  id: string;
  topic: string;
  date: string;
  fileName?: string;
  title: string;
  headers: string[];
  rows: ExcelRow[];
}

const STEPS = [
  { pct: 15,  label: 'Analyzing spreadsheet requirements…' },
  { pct: 40,  label: 'Structuring data columns…' },
  { pct: 65,  label: 'Calculating mathematical averages…' },
  { pct: 85,  label: 'Formatting Excel sheet schema…' },
  { pct: 100, label: 'Excel sheet ready! ✓' },
];

const buildSet = (topic: string, fileName?: string): ExcelSet => {
  const rows: ExcelRow[] = [
    { id: 1, name: 'Mustafa', quiz1: 85, quiz2: 90, average: 87.5 },
    { id: 2, name: 'Anusha', quiz1: 92, quiz2: 96, average: 94.0 },
    { id: 3, name: 'Faraz', quiz1: 78, quiz2: 82, average: 80.0 },
    { id: 4, name: 'Ayesha', quiz1: 88, quiz2: 84, average: 86.0 },
    { id: 5, name: 'Zain', quiz1: 95, quiz2: 91, average: 93.0 },
  ];

  return {
    id: Date.now().toString(),
    topic,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName,
    title: 'Spreadsheet Gradebook',
    headers: ['Student Name', 'Quiz 1', 'Quiz 2', 'Average'],
    rows,
  };
};

const formatMarkdownTable = (set: ExcelSet): string => {
  let out = `Excel Spreadsheet — ${set.topic}\nDate: ${set.date}\n\n`;
  out += `| ${set.headers.join(' | ')} |\n`;
  out += `| ${set.headers.map(() => '---').join(' | ')} |\n`;
  set.rows.forEach(r => {
    out += `| ${r.name} | ${r.quiz1} | ${r.quiz2} | ${r.average.toFixed(1)} |\n`;
  });
  return out;
};

export const ExcelGenScreen: React.FC<ExcelGenScreenProps> = ({ navigation }) => {
  const [requestInput, setRequestInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [sets, setSets] = useState<ExcelSet[]>([]);
  const [activeSet, setActiveSet] = useState<ExcelSet | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleToggleFile = () =>
    setFileName(f => f ? '' : 'Student_Scores.csv');

  const handleGenerate = () => {
    if (!requestInput.trim()) {
      Alert.alert('Missing Input', 'Please enter columns or topic text.');
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

  const handleDownload = (set: ExcelSet) => {
    Alert.alert('Download Started', `${set.title}.xlsx has been downloaded to your device.`);
  };

  const handleCopy = (set: ExcelSet) => {
    Clipboard.setString(formatMarkdownTable(set));
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
              <Stop offset="0%" stopColor="#217346" stopOpacity={0.07} />
              <Stop offset="100%" stopColor="#1e6b3f" stopOpacity={0.03} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="110%" cy="-6%" r="280" fill="url(#b1)" />
          <Circle cx="-10%" cy="48%" r="240" fill="#217346" opacity={0.05} />
          <Circle cx="88%" cy="95%" r="300" fill="#1e6b3f" opacity={0.04} />
        </Svg>
      </View>

      {/* HEADER */}
      <LinearGradient
        colors={['#103822', '#1a5c38', '#217346']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -28, top: -38, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(167,243,208,0.13)' }} />
        <View style={{ position: 'absolute', left: -18, bottom: -36, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(209,250,229,0.10)' }} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="table-chart" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Excel File Generator</Text>
              <Text style={styles.headerSub}>AI-powered · Dynamic spreadsheets & gradebooks</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient colors={['#A7F3D0', '#217346', '#1a5c38']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGlow} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* INPUT CARD */}
        <View style={styles.card}>
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Your Request</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Enter student list or columns here…"
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
              colors={fileName ? ['#D1F5E9', '#A7F3D0'] : ['#F8FAFC', '#F1F5F9']}
              style={styles.fileOrb}
            >
              <MaterialIcons
                name={fileName ? 'insert-drive-file' : 'cloud-upload'}
                size={18}
                color={fileName ? '#217346' : '#94A3B8'}
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
                colors={['#103822', '#1a5c38', '#217346']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.genBtn}
              >
                <View style={styles.genBtnHighlight} />
                <View style={styles.genBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={22} color="#fff" />
                </View>
                <View style={styles.genBtnDivider} />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={styles.genBtnText} numberOfLines={1}>Generate Excel File</Text>
                  <Text style={styles.genBtnSub} numberOfLines={1}>AI · Calculations · Sheet Schema</Text>
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
              <ActivityIndicator color="#217346" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingStateText}>Generating Excel spreadsheet…</Text>
            </View>
          )}
        </View>

        {/* PROGRESS LOADER */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <ActivityIndicator color="#217346" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#1a5c38', '#6EE7B7']}
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
            <LinearGradient colors={['#217346', '#1a5c38']} style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>View Excel Sheets</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{sets.length}</Text>
            </View>
          </View>
        )}

        {/* RESULT CARDS */}
        <View style={{ gap: 18 }}>
          {sets.map((set) => (
            <View key={set.id} style={styles.resultCard}>
              <LinearGradient colors={['#103822', '#217346', '#6EE7B7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.resultStrip} />

              {/* Meta header */}
              <View style={styles.resultMeta}>
                <LinearGradient colors={['#D1F5E9', '#A7F3D0']} style={styles.resultIconOrb}>
                  <MaterialIcons name="table-chart" size={17} color="#217346" />
                  </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTopic} numberOfLines={1}>{set.topic}</Text>
                  <Text style={styles.resultDate}>{set.date}{set.fileName ? ` · ${set.fileName}` : ''}</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveSet(set)} activeOpacity={0.8}>
                  <View style={styles.eyeOuter}>
                    <LinearGradient colors={['#217346', '#1a5c38']} style={styles.eyeCore}>
                      <View style={styles.eyeGloss} />
                      <MaterialIcons name="remove-red-eye" size={17} color="#fff" />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Sheet preview table */}
              <View style={styles.sheetPreviewBlock}>
                <Text style={styles.sheetTitle}>{set.title}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
                  <View style={styles.tableContainer}>
                    {/* Headers */}
                    <View style={styles.tableHeaderRow}>
                      {set.headers.map((h, i) => (
                        <View key={i} style={[styles.tableCell, styles.tableHeaderCell, i === 0 && { width: 120 }]}>
                          <Text style={styles.tableHeaderCellText}>{h}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Rows */}
                    {set.rows.map((row) => (
                      <View key={row.id} style={styles.tableDataRow}>
                        <View style={[styles.tableCell, { width: 120 }]}>
                          <Text style={styles.tableNameText}>{row.name}</Text>
                        </View>
                        <View style={styles.tableCell}>
                          <Text style={styles.tableDataText}>{row.quiz1}</Text>
                        </View>
                        <View style={styles.tableCell}>
                          <Text style={styles.tableDataText}>{row.quiz2}</Text>
                        </View>
                        <View style={[styles.tableCell, styles.averageCell]}>
                          <Text style={styles.tableAverageText}>{row.average.toFixed(1)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Download / Copy Buttons */}
              <View style={styles.actionsBlock}>
                <TouchableOpacity
                  style={[styles.actionBtn, { flex: 1.2 }]}
                  onPress={() => handleDownload(set)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={['#1a5c38', '#217346']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.actionBtnGrad}
                  >
                    <MaterialIcons name="file-download" size={17} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.actionBtnText}>Download (.xlsx)</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, { flex: 0.8 }]}
                  onPress={() => handleCopy(set)}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={copiedId === set.id ? ['#15803D', '#16A34A'] : ['#475569', '#64748B']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={styles.actionBtnGrad}
                  >
                    <MaterialIcons
                      name={copiedId === set.id ? 'check' : 'content-copy'}
                      size={15} color="#fff" style={{ marginRight: 6 }}
                    />
                    <Text style={styles.actionBtnText}>
                      {copiedId === set.id ? 'Copied!' : 'Copy Data'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Footer toolbar */}
              <View style={styles.resultFooter}>
                <TouchableOpacity style={styles.footerBtn} onPress={() => setActiveSet(set)}>
                  <MaterialIcons name="open-in-full" size={13} color="#217346" style={{ marginRight: 4 }} />
                  <Text style={styles.footerBtnText}>Full View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerBtn} onPress={() => handleDownload(set)}>
                  <MaterialIcons name="get-app" size={13} color="#B45309" style={{ marginRight: 4 }} />
                  <Text style={[styles.footerBtnText, { color: '#B45309' }]}>Export CSV</Text>
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

      {/* FULL VIEW MODAL */}
      <Modal visible={activeSet !== null} transparent={false} animationType="slide">
        <SafeAreaView style={styles.sheetSafe} edges={['top']}>
          <View style={styles.sheetNav}>
            <TouchableOpacity style={styles.sheetClose} onPress={() => setActiveSet(null)} activeOpacity={0.8}>
              <MaterialIcons name="close" size={20} color="#217346" />
            </TouchableOpacity>
            <Text style={styles.sheetNavTitle} numberOfLines={1}>{activeSet?.topic}</Text>
            <TouchableOpacity
              style={styles.sheetDownloadBtn}
              onPress={() => { if (activeSet) handleDownload(activeSet); }}
              activeOpacity={0.8}
            >
              <MaterialIcons name="file-download" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.sheetCopyText}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetPrintBtn} onPress={() => Alert.alert('Print', 'Sent to print queue.')} activeOpacity={0.8}>
              <MaterialIcons name="print" size={14} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.sheetPrintText}>Print</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.sheetScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.paperCard}>
              <LinearGradient colors={['#103822', '#1a5c38']} style={styles.paperDocHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.paperDocIcon}>
                    <MaterialIcons name="table-chart" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.paperDocTitle}>Spreadsheet Document View</Text>
                    <Text style={styles.paperDocSub}>{activeSet?.date} · {activeSet?.rows.length} Data Rows</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Topic */}
              <View style={styles.topicRow}>
                <Text style={styles.topicLabel}>TOPIC</Text>
                <Text style={styles.topicTitle}>{activeSet?.topic}</Text>
              </View>

              {/* SpreadSheet detailed table */}
              <View style={styles.modalTableBlock}>
                <Text style={styles.modalHeading}>Spreadsheet Preview</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                  <View style={styles.modalTableContainer}>
                    <View style={styles.modalTableHeaderRow}>
                      {activeSet?.headers.map((h, i) => (
                        <View key={i} style={[styles.modalTableCell, styles.modalTableHeaderCell, i === 0 && { width: 140 }]}>
                          <Text style={styles.modalTableHeaderCellText}>{h}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {activeSet?.rows.map((row) => (
                      <View key={row.id} style={styles.modalTableDataRow}>
                        <View style={[styles.modalTableCell, { width: 140 }]}>
                          <Text style={styles.modalTableNameText}>{row.name}</Text>
                        </View>
                        <View style={styles.modalTableCell}>
                          <Text style={styles.modalTableDataText}>{row.quiz1}</Text>
                        </View>
                        <View style={styles.modalTableCell}>
                          <Text style={styles.modalTableDataText}>{row.quiz2}</Text>
                        </View>
                        <View style={[styles.modalTableCell, styles.modalAverageCell]}>
                          <Text style={styles.modalTableAverageText}>{row.average.toFixed(1)}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Modal Download button */}
              <TouchableOpacity
                style={styles.modalCopyBtn}
                onPress={() => { if (activeSet) handleDownload(activeSet); }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#1a5c38', '#217346']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.modalCopyBtnGrad}
                >
                  <MaterialIcons name="file-download" size={18} color="#fff" style={{ marginRight: 10 }} />
                  <Text style={styles.modalCopyBtnText}>Download Full Spreadsheet (.xlsx)</Text>
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
  safeArea: { flex: 1, backgroundColor: '#ECFDF5' },

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
    borderColor: '#A7F3D0',
    shadowColor: '#217346',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  fieldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#217346', marginRight: 6 },
  fieldLabel: { fontSize: 10.5, fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.6 },

  textArea: {
    backgroundColor: '#FAFDFB',
    borderWidth: 1,
    borderColor: '#D1F5E9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#0A2516',
    fontWeight: '600',
    height: 60,
    marginBottom: 10,
  },

  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFDFB',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#A7F3D0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 12,
  },
  fileBoxActive: { backgroundColor: '#E6F4EA', borderStyle: 'solid', borderColor: '#217346' },
  fileOrb: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  fileText: { fontSize: 11.5, fontWeight: '600', color: '#1a5c38', flex: 1 },
  fileTextActive: { color: '#217346', fontWeight: '700' },

  genBtnWrap: {
    marginTop: 2,
    borderRadius: 12,
    shadowColor: '#1a5c38',
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
    backgroundColor: '#E6F4EA',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#217346',
  },
  generatingStateText: { fontSize: 12.5, fontWeight: '800', color: '#217346' },

  loaderCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16,
    borderWidth: 1.5, borderColor: '#A7F3D0', marginBottom: 22,
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
    backgroundColor: '#217346', borderRadius: 10, minWidth: 22, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  countBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  resultCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22,
    borderWidth: 1.5, borderColor: '#A7F3D0',
    shadowColor: '#217346', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4, overflow: 'hidden',
  },
  resultStrip: { height: 3 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 8 },
  resultIconOrb: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultTopic: { fontSize: 15.5, fontWeight: '900', color: '#103822', marginBottom: 3 },
  resultDate: { fontSize: 11.5, fontWeight: '600', color: '#1a5c38' },

  eyeOuter: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, borderColor: '#A7F3D0',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E6F4EA', marginLeft: 8,
    shadowColor: '#217346', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 8, elevation: 3,
  },
  eyeCore: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  eyeGloss: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', borderTopLeftRadius: 9, borderTopRightRadius: 9,
  },

  sheetPreviewBlock: {
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#103822',
    marginBottom: 10,
    letterSpacing: 0.4,
  },
  tableScroll: {
    borderWidth: 1.5,
    borderColor: '#D1F5E9',
    borderRadius: 12,
    backgroundColor: '#FAFDFB',
  },
  tableContainer: {
    padding: 10,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#217346',
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tableCell: {
    width: 80,
    paddingHorizontal: 6,
  },
  tableHeaderCell: {
    justifyContent: 'center',
  },
  tableHeaderCellText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#103822',
    textTransform: 'uppercase',
  },
  tableNameText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#103822',
  },
  tableDataText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  averageCell: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingVertical: 2,
  },
  tableAverageText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1b5e20',
    textAlign: 'center',
  },

  actionsBlock: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 14,
    marginBottom: 14,
  },
  actionBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#103822',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22, shadowRadius: 8, elevation: 5,
  },
  actionBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },

  copyBtn: {
    marginHorizontal: 14, marginBottom: 12, borderRadius: 14, overflow: 'hidden',
    shadowColor: '#1a5c38', shadowOffset: { width: 0, height: 6 },
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
    backgroundColor: '#E6F4EA', borderTopWidth: 1.5, borderTopColor: '#A7F3D0',
  },
  footerBtn: { flexDirection: 'row', alignItems: 'center' },
  footerBtnText: { fontSize: 11.5, fontWeight: '800', color: '#1a5c38' },

  sheetSafe: { flex: 1, backgroundColor: '#ECFDF5' },
  sheetNav: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', gap: 8,
  },
  sheetClose: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetNavTitle: { fontSize: 14, fontWeight: '900', color: '#0F172A', flex: 1, textAlign: 'center' },
  sheetDownloadBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#217346',
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

  topicRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#A7F3D0', backgroundColor: '#E6F4EA' },
  topicLabel: { fontSize: 9.5, fontWeight: '900', color: '#217346', letterSpacing: 1.2, marginBottom: 4 },
  topicTitle: { fontSize: 18, fontWeight: '900', color: '#103822', lineHeight: 24 },

  modalTableBlock: {
    padding: 16,
  },
  modalHeading: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#103822',
    borderBottomWidth: 1.5,
    borderBottomColor: '#A7F3D0',
    paddingBottom: 6,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalTableContainer: {
    padding: 10,
    backgroundColor: '#FAFDFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1F5E9',
  },
  modalTableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#217346',
    paddingBottom: 8,
    marginBottom: 8,
  },
  modalTableDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9',
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalTableCell: {
    width: 90,
    paddingHorizontal: 8,
  },
  modalTableHeaderCell: {
    justifyContent: 'center',
  },
  modalTableHeaderCellText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#103822',
    textTransform: 'uppercase',
  },
  modalTableNameText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#103822',
  },
  modalTableDataText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  modalAverageCell: {
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    paddingVertical: 3,
  },
  modalTableAverageText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1b5e20',
    textAlign: 'center',
  },

  modalCopyBtn: {
    margin: 16, marginTop: 4, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#1a5c38', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 14, elevation: 8,
  },
  modalCopyBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, borderRadius: 16,
  },
  modalCopyBtnText: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.4 },
});
