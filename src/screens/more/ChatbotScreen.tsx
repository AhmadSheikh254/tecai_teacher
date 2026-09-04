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
  Dimensions,
  Platform,
  Pressable,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

export interface ChatbotResult {
  id: string;
  topic: string;
  date: string;
  fileName?: string;
  response: {
    intro: string;
    points: { title: string; desc: string }[];
    outro: string;
  };
}

interface ChatbotScreenProps {
  navigation: any;
}

export const ChatbotScreen: React.FC<ChatbotScreenProps> = ({ navigation }) => {
  // Form States
  const [requestInput, setRequestInput] = useState('');
  const [fileName, setFileName] = useState('');

  // Generation Loading States
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Analyzing prompt details...');

  // Modal View State
  const [activeResult, setActiveResult] = useState<ChatbotResult | null>(null);
  const [results, setResults] = useState<ChatbotResult[]>([]);

  // Toggle Mock File
  const handleToggleMockFile = () => {
    if (fileName) {
      setFileName('');
    } else {
      setFileName('Respiratory_System_Notes.pdf');
    }
  };

  // Generate Action
  const handleSendPrompt = () => {
    if (generating) return;

    const topicText = requestInput.trim() || 'Classroom Teaching Strategy';
    setGenerating(true);
    setProgress(0);
    setProgressStatus('AI Assistant is processing your request...');

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 15;
        if (next === 30) setProgressStatus('Searching curriculum databases...');
        if (next === 60) setProgressStatus('Structuring pedagogical insights & activities...');
        if (next === 90) setProgressStatus('Formatting final response...');
        if (next >= 100) {
          clearInterval(interval);
          setGenerating(false);

          const newResult: ChatbotResult = {
            id: `cb-${Date.now()}`,
            topic: topicText,
            date: 'Just now',
            fileName: fileName || undefined,
            response: {
              intro: `Hello! I am ready to assist with "${topicText}". Here is a tailored plan designed for your classroom:`,
              points: [
                {
                  title: 'Classroom Strategies',
                  desc: `Engaging intro hook and step-by-step teaching strategy for ${topicText}.`
                },
                {
                  title: 'Activity Ideas',
                  desc: 'Interactive pair-work exercises, hands-on demonstrations, and group discussions.'
                },
                {
                  title: 'Explanations',
                  desc: 'Clear, age-appropriate breakdown of complex core concepts.'
                },
                {
                  title: 'Assessments',
                  desc: 'Formative quick-checks, exit tickets, and quiz questions.'
                }
              ],
              outro: 'Feel free to ask follow-up questions to refine any part of this response!'
            }
          };

          setResults((prev) => [newResult, ...prev]);
          setActiveResult(newResult);
          setRequestInput('');
          return 100;
        }
        return next;
      });
    }, 120);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Ambient Mesh Backdrop ── */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          <Circle cx="105%" cy="-5%" r="320" fill="#FB923C" opacity={0.06} />
          <Circle cx="-10%" cy="50%" r="300" fill="#FBBF24" opacity={0.05} />
          <Circle cx="80%" cy="95%" r="340" fill="#F59E0B" opacity={0.05} />
        </Svg>
      </View>

      {/* ── HEADER BANNER ── */}
      <LinearGradient colors={['#FB923C', '#F97316']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <View style={{ position: 'absolute', right: -35, top: -50, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
        <View style={{ position: 'absolute', left: -25, bottom: -45, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(254, 215, 170, 0.2)' }} />

        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.12)']} style={styles.headerIconBox}>
              <MaterialIcons name="smart-toy" size={22} color="#fff" />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>AI Assistant Chatbot</Text>
              <Text style={styles.headerSubtitle}>Instant teaching strategies · Activity ideas · Q&A answers</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      {/* Pastel Soft Glow Line */}
      <LinearGradient colors={['#FED7AA', '#FBBF24']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.headerBarGlow} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* ── FORM CARD ── */}
        <View style={styles.card}>

          {/* YOUR REQUEST */}
          <View style={styles.fieldHeader}>
            <View style={styles.fieldDot} />
            <Text style={styles.sectionLabel}>Your Request</Text>
          </View>
          <TextInput
            style={styles.requestTextArea}
            placeholder="Enter your question or request… e.g. How to explain respiratory system to grade 5?"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={requestInput}
            onChangeText={setRequestInput}
            editable={!generating}
          />

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
              colors={fileName ? ['#FFEDD5', '#FFF7ED'] : ['#F8FAFC', '#F8FAFC']}
              style={styles.fileIconOrb}
            >
              <MaterialIcons
                name={fileName ? "insert-drive-file" : "cloud-upload"}
                size={18}
                color={fileName ? "#F97316" : "#94A3B8"}
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

          {/* ── SEND BUTTON ── */}
          {!generating ? (
            <TouchableOpacity
              style={styles.generateBtnContainer}
              onPress={handleSendPrompt}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#F97316', '#FB923C', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.generateBtn}
              >
                <View style={styles.generateBtnHighlight} />

                <View style={styles.generateBtnIconZone}>
                  <MaterialIcons name="send" size={20} color="#FFF" />
                </View>

                <View style={styles.generateBtnDivider} />

                <View style={styles.generateBtnLabelBlock}>
                  <Text style={styles.generateBtnText}>Send Request</Text>
                  <Text style={styles.generateBtnSubText}>AI Analysis · Pedagogical Insights · Instant</Text>
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
              <ActivityIndicator color="#F97316" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.generatingButtonText}>AI Assistant is thinking…</Text>
            </View>
          )}
        </View>

        {/* ── PROCESSING LOADER ── */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={styles.loaderHeader}>
              <ActivityIndicator color="#F97316" size="small" style={{ marginRight: 10 }} />
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#F97316', '#FBBF24']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={styles.loaderPercentage}>{progress}% Complete</Text>
          </View>
        )}

        {/* ── GENERATED RESULT SECTION (ONE-TIME / ONLY IF GENERATED) ── */}
        {results.length > 0 && (
          <>
            <View style={styles.viewPlanHeaderRow}>
              <LinearGradient colors={['#F97316', '#F59E0B']} style={styles.bulletIndicator} />
              <Text style={styles.viewPlanTitle}>Generated Result</Text>
              <View style={styles.planCountBadge}>
                <Text style={styles.planCountText}>{results.length}</Text>
              </View>
            </View>

            {/* ── GENERATED RESULT CARDS ── */}
            <View style={styles.plansListContainer}>
              {results.map((res) => (
                <View key={res.id} style={styles.resultBoxCard}>
                  {/* Result Meta Bar */}
                  <View style={styles.resultMetaHeader}>
                    <View style={styles.botAvatarBox}>
                      <MaterialIcons name="smart-toy" size={18} color="#F97316" />
                      <View style={styles.onlineBadgeDot} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultTopicTitle} numberOfLines={1}>{res.topic}</Text>
                      <Text style={styles.resultDateText}>{res.date} {res.fileName ? `• ${res.fileName}` : ''}</Text>
                    </View>

                    {/* ── Premium Eye Button ── */}
                    <TouchableOpacity onPress={() => setActiveResult(res)} activeOpacity={0.8}>
                      <View style={styles.eyeBtnOuter}>
                        <LinearGradient
                          colors={['#F97316', '#FB923C']}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                          style={styles.eyeBtnCore}
                        >
                          <View style={styles.eyeBtnGloss} />
                          <MaterialIcons name="remove-red-eye" size={18} color="#fff" />
                        </LinearGradient>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Result Body Text Preview */}
                  <View style={styles.resultBodyPreview}>
                    <Text style={styles.resultIntroText}>{res.response.intro}</Text>
                    
                    {res.response.points.slice(0, 3).map((p, idx) => (
                      <View key={idx} style={styles.pointRow}>
                        <Text style={styles.pointTitle}>•  {p.title}: </Text>
                        <Text style={styles.pointDesc} numberOfLines={2}>{p.desc}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Action Toolbar */}
                  <View style={styles.resultFooterBar}>
                    <TouchableOpacity style={styles.footerActionBtn} onPress={() => setActiveResult(res)}>
                      <MaterialIcons name="open-in-full" size={14} color="#F97316" style={{ marginRight: 4 }} />
                      <Text style={styles.footerActionText}>Full View</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.footerActionBtn} onPress={() => Alert.alert('Copied', 'AI Response copied to clipboard.')}>
                      <MaterialIcons name="content-copy" size={14} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={[styles.footerActionText, { color: '#64748B' }]}>Copy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.footerActionBtn} onPress={() => Alert.alert('Print Queue', 'Sent to printer.')}>
                      <MaterialIcons name="print" size={14} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={[styles.footerActionText, { color: '#64748B' }]}>Print</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              ))}
            </View>
          </>
        )}

      </ScrollView>

      {/* ── FULL RESULT VIEWER MODAL ── */}
      <Modal visible={activeResult !== null} transparent={false} animationType="slide">
        <SafeAreaView style={styles.sheetSafeArea} edges={['top']}>
          {/* Modal Header */}
          <View style={styles.sheetNavBar}>
            <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setActiveResult(null)} activeOpacity={0.8}>
              <MaterialIcons name="close" size={20} color="#F97316" />
            </TouchableOpacity>

            <Text style={styles.sheetNavTitle} numberOfLines={1}>{activeResult?.topic}</Text>

            <TouchableOpacity
              style={styles.sheetPrintBtn}
              onPress={() => Alert.alert('Print Response', 'AI Chatbot Response sent to print queue as PDF.')}
              activeOpacity={0.8}
            >
              <MaterialIcons name="print" size={16} color="#fff" style={{ marginRight: 5 }} />
              <Text style={styles.sheetPrintText}>Print</Text>
            </TouchableOpacity>
          </View>

          {/* Result Full Content */}
          <ScrollView contentContainerStyle={styles.sheetScrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.paperSheetCard}>
              
              <View style={styles.paperHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={styles.modalBotAvatar}>
                    <MaterialIcons name="smart-toy" size={20} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.modalBotTitle}>AI Teaching Assistant</Text>
                    <Text style={styles.modalBotSubtitle}>{activeResult?.date}</Text>
                  </View>
                </View>
                <Text style={styles.paperMainTitle}>{activeResult?.topic}</Text>
              </View>

              {/* Response Intro */}
              <Text style={styles.modalIntroText}>{activeResult?.response.intro}</Text>

              {/* Response Bullet Points */}
              <View style={styles.modalPointsContainer}>
                {activeResult?.response.points.map((pt, idx) => (
                  <View key={idx} style={styles.modalPointCard}>
                    <Text style={styles.modalPointTitle}>•  {pt.title}:</Text>
                    <Text style={styles.modalPointDesc}>{pt.desc}</Text>
                  </View>
                ))}
              </View>

              {/* Response Outro */}
              <Text style={styles.modalOutroText}>{activeResult?.response.outro}</Text>

            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBF7',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
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
    borderColor: 'rgba(255,255,255,0.22)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
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
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.25)',
  },
  featurePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
    letterSpacing: 0.2,
  },

  // FORM CARD
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.12)',
    shadowColor: '#F97316',
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
    backgroundColor: '#F97316',
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
    borderColor: 'rgba(249, 115, 22, 0.18)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    height: 60,
    marginBottom: 10,
  },

  // File Upload Box
  fileAttachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(249, 115, 22, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 12,
  },
  fileAttachmentBoxActive: {
    backgroundColor: '#FFF7ED',
    borderStyle: 'solid',
    borderColor: '#F97316',
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
    color: '#F97316',
    fontWeight: '700',
  },

  // SEND BUTTON
  generateBtnContainer: {
    marginTop: 2,
    borderRadius: 12,
    shadowColor: '#F97316',
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
    borderColor: 'rgba(255,255,255,0.2)',
  },
  generateBtnHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  generateBtnIconZone: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  generateBtnDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.22)',
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
    color: 'rgba(255,255,255,0.85)',
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
    borderColor: 'rgba(255,255,255,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Generating State
  generatingContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(249,115,22,0.3)',
  },
  generatingButtonText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#F97316',
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
    backgroundColor: '#F97316',
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
    gap: 14,
  },

  // RESULT BOX CARD
  resultBoxCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.12)',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  resultMetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 10,
  },
  botAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  onlineBadgeDot: {
    position: 'absolute',
    top: 2, right: 2,
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  resultTopicTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#C2410C',
  },
  resultDateText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },

  // ── Premium Eye Button ──
  eyeBtnOuter: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(249,115,22,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249,115,22,0.06)',
    marginLeft: 8,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  resultBodyPreview: {
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  resultIntroText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 19,
    marginBottom: 10,
  },
  pointRow: {
    marginBottom: 6,
  },
  pointTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F97316',
    marginBottom: 2,
  },
  pointDesc: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    lineHeight: 18,
  },

  resultFooterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFBF7',
    borderTopWidth: 1,
    borderTopColor: '#FFEDD5',
  },
  footerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerActionText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#F97316',
  },

  // MODAL STYLES
  sheetSafeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  sheetNavBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetNavTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  sheetPrintBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sheetPrintText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  sheetScrollContainer: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },

  paperSheetCard: {
    width: '100%',
    maxWidth: 720,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  paperHeader: {
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#F97316',
    paddingBottom: 14,
  },
  modalBotAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modalBotTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalBotSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  paperMainTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#C2410C',
    marginTop: 6,
  },
  modalIntroText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalPointsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  modalPointCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  modalPointTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#EA580C',
    marginBottom: 4,
  },
  modalPointDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 19,
  },
  modalOutroText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
