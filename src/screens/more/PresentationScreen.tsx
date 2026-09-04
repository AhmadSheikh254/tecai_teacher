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

interface PresentationScreenProps {
  navigation: any;
}

interface SlideItem {
  num: number;
  title: string;
  bullets: string[];
}

interface PresentationSet {
  id: string;
  topic: string;
  format: string;
  textMode: string;
  slidesCount: number;
  exportAs: string;
  additionalNotes: string;
  date: string;
  slides: SlideItem[];
}

const STEPS = [
  { pct: 15,  label: 'Analyzing presentation topic…' },
  { pct: 35,  label: 'Outlining slide structure…' },
  { pct: 60,  label: 'Generating slide content…' },
  { pct: 85,  label: 'Formatting visual layout…' },
  { pct: 100, label: 'Presentation slide deck ready! ✓' },
];

const buildMockDeck = (
  topic: string,
  format: string,
  textMode: string,
  slidesCount: number,
  exportAs: string,
  additionalNotes: string
): PresentationSet => {
  const slides: SlideItem[] = [
    {
      num: 1,
      title: 'Introduction to States of Matter',
      bullets: [
        'Matter exists in several distinct physical forms.',
        'The three most common states are Solid, Liquid, and Gas.',
        'Determined by microscopic particle arrangements and behavior.',
      ],
    },
    {
      num: 2,
      title: 'The Solid State: Structure & Motion',
      bullets: [
        'Particles are tightly packed in a fixed, orderly lattice.',
        'Strong intermolecular forces hold particles in place.',
        'Movement is restricted to vibrating in fixed positions.',
      ],
    },
    {
      num: 3,
      title: 'The Liquid State: Flow & Volume',
      bullets: [
        'Particles are close together but lack a fixed arrangement.',
        'Intermediate forces allow particles to slide and flow past each other.',
        'Maintains a definite volume but takes the shape of its container.',
      ],
    },
    {
      num: 4,
      title: 'The Gaseous State: High Energy',
      bullets: [
        'Particles are far apart with weak intermolecular attraction.',
        'Gases move rapidly, randomly, and fill any available space.',
        'Compressible shape and volume depending on temperature and pressure.',
      ],
    },
  ];

  return {
    id: Date.now().toString(),
    topic,
    format,
    textMode,
    slidesCount,
    exportAs,
    additionalNotes,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    slides,
  };
};

export const PresentationScreen: React.FC<PresentationScreenProps> = ({ navigation }) => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Presentation');
  const [textMode, setTextMode] = useState('Generate');
  const [slidesCount, setSlidesCount] = useState('');
  const [exportAs, setExportAs] = useState('PowerPoint (PPTX)');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [decks, setDecks] = useState<PresentationSet[]>([]);
  const [activeDeck, setActiveDeck] = useState<PresentationSet | null>(null);

  // Dropdown options
  const [formatOpen, setFormatOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) {
      Alert.alert('Missing Input', 'Please enter a presentation topic or outline.');
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
          const newDeck = buildMockDeck(
            topic.trim(),
            format,
            textMode,
            parseInt(slidesCount) || 8,
            exportAs,
            additionalNotes
          );
          setDecks(prev => [newDeck, ...prev]);
          setGenerating(false);
          setProgress(0);
          setTopic('');
          setAdditionalNotes('');
        }, 450);
      }
    }, 450);
  };

  const downloadDeck = (deck: PresentationSet) => {
    Alert.alert('Download Presentation', `${deck.topic}.pptx has been successfully downloaded.`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Background decoration */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Defs>
            <SvgLinearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#D24726" stopOpacity={0.07} />
              <Stop offset="100%" stopColor="#A83014" stopOpacity={0.03} />
            </SvgLinearGradient>
          </Defs>
          <Circle cx="110%" cy="-6%" r="280" fill="url(#b1)" />
          <Circle cx="-10%" cy="48%" r="240" fill="#D24726" opacity={0.05} />
          <Circle cx="88%" cy="95%" r="300" fill="#A83014" opacity={0.04} />
        </Svg>
      </View>

      {/* HEADER */}
      <LinearGradient
        colors={['#5C1605', '#A83014', '#D24726']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -28, top: -38, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,204,188,0.13)' }} />
        <View style={{ position: 'absolute', left: -18, bottom: -36, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,224,212,0.10)' }} />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.titleRow}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="slideshow" size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Presentation Generator</Text>
              <Text style={styles.headerSub}>AI-powered · Create slide decks · Export to PPTX</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient colors={['#FFAB91', '#D24726', '#A83014']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerGlow} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* INPUT CARD */}
        <View style={styles.card}>
          {/* Topic / Content */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Topic / Content</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Enter presentation topic or outline..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={topic}
            onChangeText={setTopic}
            editable={!generating}
          />

          {/* Format Selection Dropdown */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Format</Text>
          </View>
          <TouchableOpacity style={styles.dropdownSelector} onPress={() => setFormatOpen(true)}>
            <Text style={styles.dropdownText}>{format}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
          </TouchableOpacity>

          {/* Text Mode Dropdown */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Text Mode</Text>
          </View>
          <TouchableOpacity style={styles.dropdownSelector} onPress={() => setModeOpen(true)}>
            <Text style={styles.dropdownText}>{textMode}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
          </TouchableOpacity>

          {/* Desired number of slides */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Desired number of slides</Text>
          </View>
          <TextInput
            style={styles.singleLineInput}
            keyboardType="numeric"
            value={slidesCount}
            onChangeText={setSlidesCount}
            editable={!generating}
          />

          {/* Export As Dropdown */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Export As (optional)</Text>
          </View>
          <TouchableOpacity style={styles.dropdownSelector} onPress={() => setExportOpen(true)}>
            <Text style={styles.dropdownText}>{exportAs}</Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#64748B" />
          </TouchableOpacity>

          {/* Additional Instructions */}
          <View style={styles.fieldRow}>
            <View style={styles.fieldDot} />
            <Text style={styles.fieldLabel}>Additional Instructions</Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Tone, audience, or extra styling notes"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            editable={!generating}
          />

          {/* Generate Button at bottom left */}
          {!generating ? (
            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} activeOpacity={0.85}>
              <LinearGradient
                colors={['#D24726', '#A83014']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.generateBtnGrad}
              >
                <Text style={styles.generateBtnText}>Generate</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.generatingState}>
              <ActivityIndicator color="#D24726" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingStateText}>Creating slides outline…</Text>
            </View>
          )}
        </View>

        {/* PROGRESS LOADER */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <ActivityIndicator color="#D24726" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#A83014', '#FF7A59']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={styles.loaderPct}>{progress}% Complete</Text>
          </View>
        )}

        {/* RESULTS HEADER */}
        {decks.length > 0 && (
          <View style={styles.sectionHeaderRow}>
            <LinearGradient colors={['#D24726', '#A83014']} style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>View Generated Slides</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{decks.length}</Text>
            </View>
          </View>
        )}

        {/* RESULT DECK PREVIEWS */}
        <View style={{ gap: 20 }}>
          {decks.map((deck) => (
            <View key={deck.id} style={styles.resultCard}>
              <LinearGradient colors={['#5C1605', '#D24726', '#FFAB91']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.resultStrip} />
              
              {/* Meta details */}
              <View style={styles.resultMeta}>
                <LinearGradient colors={['#FCE8E6', '#FFCDD2']} style={styles.resultIconOrb}>
                  <MaterialIcons name="slideshow" size={17} color="#D24726" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTopic} numberOfLines={1}>{deck.topic}</Text>
                  <Text style={styles.resultDate}>{deck.date} · {deck.slides.length} Slides</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveDeck(deck)} activeOpacity={0.8}>
                  <View style={styles.eyeOuter}>
                    <LinearGradient colors={['#D24726', '#A83014']} style={styles.eyeCore}>
                      <View style={styles.eyeGloss} />
                      <MaterialIcons name="remove-red-eye" size={17} color="#fff" />
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Slide Previews Carousel/List */}
              <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.slideScroll}>
                <View style={styles.slideDeckRow}>
                  {deck.slides.map((slide) => (
                    <View key={slide.num} style={styles.slidePreviewCard}>
                      <LinearGradient colors={['#5C1605', '#A83014']} style={styles.slidePreviewHeader}>
                        <Text style={styles.slidePreviewTitle} numberOfLines={1}>{slide.title}</Text>
                        <View style={styles.slideNumberBadge}>
                          <Text style={styles.slideNumberText}>{slide.num}</Text>
                        </View>
                      </LinearGradient>
                      <View style={styles.slidePreviewContent}>
                        {slide.bullets.map((b, i) => (
                          <View key={i} style={styles.bulletRow}>
                            <View style={styles.bulletDot} />
                            <Text style={styles.bulletText} numberOfLines={2}>{b}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {/* Actions */}
              <View style={styles.actionsBlock}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => downloadDeck(deck)} activeOpacity={0.8}>
                  <LinearGradient colors={['#A83014', '#D24726']} style={styles.actionBtnGrad}>
                    <MaterialIcons name="get-app" size={18} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.actionBtnText}>Download PowerPoint (.pptx)</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* FORMAT MODAL */}
      <Modal visible={formatOpen} transparent={true} animationType="slide" onRequestClose={() => setFormatOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setFormatOpen(false)}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Select Format</Text>
            {['Presentation', 'Doc', 'Social'].map((item) => {
              const isSelected = format === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                  onPress={() => {
                    setFormat(item);
                    setFormatOpen(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextActive]}>{item}</Text>
                  {isSelected && <MaterialIcons name="check" size={20} color="#D24726" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* TEXT MODE MODAL */}
      <Modal visible={modeOpen} transparent={true} animationType="slide" onRequestClose={() => setModeOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModeOpen(false)}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Select Text Mode</Text>
            {['Generate', 'Condense', 'Preserve'].map((item) => {
              const isSelected = textMode === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                  onPress={() => {
                    setTextMode(item);
                    setModeOpen(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextActive]}>{item}</Text>
                  {isSelected && <MaterialIcons name="check" size={20} color="#D24726" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* EXPORT AS MODAL */}
      <Modal visible={exportOpen} transparent={true} animationType="slide" onRequestClose={() => setExportOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setExportOpen(false)}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>Export As</Text>
            {['PowerPoint (PPTX)', 'PDF'].map((item) => {
              const isSelected = exportAs === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                  onPress={() => {
                    setExportAs(item);
                    setExportOpen(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextActive]}>{item}</Text>
                  {isSelected && <MaterialIcons name="check" size={20} color="#D24726" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF5F2' },

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
    borderColor: '#FFCCBC',
    shadowColor: '#D24726',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 14,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  fieldDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#D24726', marginRight: 6 },
  fieldLabel: { fontSize: 10.5, fontWeight: '900', color: '#334155', textTransform: 'uppercase', letterSpacing: 0.6 },

  textArea: {
    backgroundColor: '#FAF9F8',
    borderWidth: 1,
    borderColor: '#FFD7CC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#2A0800',
    fontWeight: '600',
    height: 60,
    marginBottom: 10,
  },

  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF9F8',
    borderWidth: 1,
    borderColor: '#FFD7CC',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 10,
  },
  dropdownText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2A0800',
  },

  singleLineInput: {
    backgroundColor: '#FAF9F8',
    borderWidth: 1,
    borderColor: '#FFD7CC',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 12,
    fontWeight: '700',
    color: '#2A0800',
    marginBottom: 10,
  },

  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9F8',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#FFCCBC',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 12,
  },
  fileBoxActive: { backgroundColor: '#FDF2EE', borderStyle: 'solid', borderColor: '#D24726' },
  fileOrb: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  fileText: { fontSize: 11.5, fontWeight: '600', color: '#A83014', flex: 1 },
  fileTextActive: { color: '#D24726', fontWeight: '700' },

  generateBtn: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 4,
    shadowColor: '#A83014',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  generateBtnGrad: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },

  generatingState: {
    flexDirection: 'row',
    backgroundColor: '#FDF2EE',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D24726',
  },
  generatingStateText: { fontSize: 12.5, fontWeight: '800', color: '#D24726' },

  loaderCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16,
    borderWidth: 1.5, borderColor: '#FFCCBC', marginBottom: 22,
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
    backgroundColor: '#D24726', borderRadius: 10, minWidth: 22, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  countBadgeText: { fontSize: 11, fontWeight: '900', color: '#fff' },

  resultCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22,
    borderWidth: 1.5, borderColor: '#FFCCBC',
    shadowColor: '#D24726', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08, shadowRadius: 14, elevation: 4, overflow: 'hidden',
  },
  resultStrip: { height: 3 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 8 },
  resultIconOrb: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultTopic: { fontSize: 15.5, fontWeight: '900', color: '#5C1605', marginBottom: 3 },
  resultDate: { fontSize: 11.5, fontWeight: '600', color: '#A83014' },

  eyeOuter: {
    width: 42, height: 42, borderRadius: 13,
    borderWidth: 1.5, borderColor: '#FFCCBC',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FDF2EE', marginLeft: 8,
    shadowColor: '#D24726', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 8, elevation: 3,
  },
  eyeCore: {
    width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  eyeGloss: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)', borderTopLeftRadius: 9, borderTopRightRadius: 9,
  },

  slideScroll: {
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  slideDeckRow: {
    flexDirection: 'row',
    gap: 14,
    paddingBottom: 10,
  },
  slidePreviewCard: {
    width: 280,
    height: 180,
    backgroundColor: '#FFFDFD',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFD7CC',
    overflow: 'hidden',
    shadowColor: '#A83014',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  slidePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  slidePreviewTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fff',
    flex: 1,
    marginRight: 10,
  },
  slideNumberBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  slideNumberText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
  },
  slidePreviewContent: {
    padding: 12,
    gap: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D24726',
    marginTop: 6,
  },
  bulletText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3E352B',
    flex: 1,
    lineHeight: 16,
  },

  actionsBlock: {
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  actionBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#5C1605',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  actionBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },

  resultFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', gap: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#FDF2EE', borderTopWidth: 1.5, borderTopColor: '#FFCCBC',
  },
  footerBtn: { flexDirection: 'row', alignItems: 'center' },
  footerBtnText: { fontSize: 11.5, fontWeight: '800', color: '#A83014' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 34,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#5C1605',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemActive: {
    backgroundColor: '#FFF5F2',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  dropdownItemTextActive: {
    color: '#D24726',
    fontWeight: '900',
  },
});
