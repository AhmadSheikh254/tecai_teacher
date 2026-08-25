import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Path, G, Line, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const INITIAL_TOPICS = [
  { id: '1', topic: 'My School',   className: 'GRADE-V',   section: 'A' },
  { id: '2', topic: 'DSDS',        className: 'GRADE-III', section: 'A' },
  { id: '3', topic: 'lion',        className: 'GRADE-II',  section: 'A' },
  { id: '4', topic: 'Food',        className: 'GRADE-V',   section: 'A' },
  { id: '5', topic: 'School',      className: 'GRADE-II',  section: 'A' },
];

const CLASSES  = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V'];
const SECTIONS = ['A', 'B', 'C'];

interface TopicItem {
  id: string;
  topic: string;
  className: string;
  section: string;
}

// Futuristic voice wave constellation visualizer matching the reference image exactly
const PremiumVoiceVisualizer = () => {
  return (
    <View style={styles.voiceOrbWrapper}>
      {/* Underlying soft blue glow */}
      <View style={[styles.orbGlowLayer, { backgroundColor: '#38BDF8', transform: [{ scale: 1.55 }], opacity: 0.14 }]} />
      <View style={[styles.orbGlowLayer, { backgroundColor: '#0066FF', transform: [{ scale: 1.15 }], opacity: 0.09 }]} />

      <Svg width="180" height="120" viewBox="0 0 180 120" style={styles.orbSvg}>
        <Defs>
          {/* Gradients for thick glowing rings */}
          <SvgLinearGradient id="thickRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00E5FF" stopOpacity={0.9} />
            <Stop offset="50%" stopColor="#0066FF" stopOpacity={0.95} />
            <Stop offset="100%" stopColor="#0A1F5C" stopOpacity={0.4} />
          </SvgLinearGradient>

          {/* Equalizer bar vertical gradients */}
          <SvgLinearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.98} />
            <Stop offset="100%" stopColor="#93C5FD" stopOpacity={0.15} />
          </SvgLinearGradient>

          {/* Node glow shadow effect */}
          <SvgLinearGradient id="glowNode" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#00E5FF" />
          </SvgLinearGradient>
        </Defs>

        {/* 5 Overlapping curvy premium sound wave lines in background (mesh effect) */}
        <Path d="M 5 60 C 45 20, 75 100, 90 60 C 105 20, 135 100, 175 60" stroke="rgba(255,255,255,0.3)" strokeWidth={1.2} fill="none" />
        <Path d="M 5 68 C 35 40, 65 88, 90 68 C 115 48, 145 96, 175 68" stroke="rgba(0,229,255,0.22)" strokeWidth={1} fill="none" />
        <Path d="M 5 52 C 45 80, 75 22, 90 52 C 105 80, 135 22, 175 52" stroke="rgba(0,102,255,0.18)" strokeWidth={1} fill="none" />
        <Path d="M 5 56 Q 45 90, 90 56 T 175 56" stroke="rgba(255,255,255,0.15)" strokeWidth={0.8} strokeDasharray="3,3" fill="none" />
        <Path d="M 5 64 Q 45 30, 90 64 T 175 64" stroke="rgba(0,229,255,0.15)" strokeWidth={0.8} strokeDasharray="4,2" fill="none" />

        {/* Horizontal White Equalizer Waves (Left Side - Rounded, dense, and high height) */}
        <Line x1="8" y1="58" x2="8" y2="62" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.12} />
        <Line x1="12" y1="55" x2="12" y2="65" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.2} />
        <Line x1="16" y1="50" x2="16" y2="70" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
        <Line x1="20" y1="44" x2="20" y2="76" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.55} />
        <Line x1="24" y1="36" x2="24" y2="84" stroke="url(#barGrad)" strokeWidth={2.2} strokeLinecap="round" opacity={0.75} />
        <Line x1="28" y1="28" x2="28" y2="92" stroke="url(#barGrad)" strokeWidth={2.2} strokeLinecap="round" opacity={0.95} />
        <Line x1="32" y1="34" x2="32" y2="86" stroke="url(#barGrad)" strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
        <Line x1="36" y1="42" x2="36" y2="78" stroke="url(#barGrad)" strokeWidth={2.2} strokeLinecap="round" opacity={0.6} />
        <Line x1="40" y1="48" x2="40" y2="72" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
        <Line x1="44" y1="53" x2="44" y2="67" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.2} />

        {/* Horizontal White Equalizer Waves (Right Side - Rounded, dense, and high height) */}
        <Line x1="136" y1="53" x2="136" y2="67" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.2} />
        <Line x1="140" y1="48" x2="140" y2="72" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.4} />
        <Line x1="144" y1="42" x2="144" y2="78" stroke="url(#barGrad)" strokeWidth={2.2} strokeLinecap="round" opacity={0.6} />
        <Line x1="148" y1="34" x2="148" y2="86" stroke="url(#barGrad)" strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
        <Line x1="152" y1="28" x2="152" y2="92" stroke="url(#barGrad)" strokeWidth={2.2} strokeLinecap="round" opacity={0.95} />
        <Line x1="156" y1="36" x2="156" y2="84" stroke="url(#barGrad)" strokeWidth={2.2} strokeLinecap="round" opacity={0.75} />
        <Line x1="160" y1="44" x2="160" y2="76" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.55} />
        <Line x1="164" y1="50" x2="164" y2="70" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
        <Line x1="168" y1="55" x2="168" y2="65" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.2} />
        <Line x1="172" y1="58" x2="172" y2="62" stroke="url(#barGrad)" strokeWidth={2} strokeLinecap="round" opacity={0.12} />

        {/* Outer Constellation Ring 3 (Outer white/cyan glowing circle) */}
        <Circle cx="90" cy="60" r="48" stroke="rgba(255,255,255,0.75)" strokeWidth={1} fill="none" />
        
        {/* Constellation Ring 3 Glowing Nodes */}
        <Circle cx="90" cy="12" r="3.5" fill="url(#glowNode)" />
        <Circle cx="90" cy="108" r="3.5" fill="url(#glowNode)" />
        <Circle cx="138" cy="60" r="3.5" fill="url(#glowNode)" />
        <Circle cx="42" cy="60" r="3.5" fill="url(#glowNode)" />

        {/* Ring 2 (Dashed cyan ring with nodes) */}
        <Circle cx="90" cy="60" r="36" stroke="#00E5FF" strokeWidth={1.2} strokeDasharray="3,5" fill="none" opacity={0.85} />
        
        {/* Ring 2 Nodes (8 total nodes matching reference image perfectly) */}
        <Circle cx="126" cy="60" r="2.2" fill="#00E5FF" />
        <Circle cx="115.5" cy="34.5" r="2.2" fill="#00E5FF" />
        <Circle cx="90" cy="24" r="2.2" fill="#00E5FF" />
        <Circle cx="64.5" cy="34.5" r="2.2" fill="#00E5FF" />
        <Circle cx="54" cy="60" r="2.2" fill="#00E5FF" />
        <Circle cx="64.5" cy="85.5" r="2.2" fill="#00E5FF" />
        <Circle cx="90" cy="96" r="2.2" fill="#00E5FF" />
        <Circle cx="115.5" cy="85.5" r="2.2" fill="#00E5FF" />

        {/* High-tech Compass/Degree ticks for ultra-premium details */}
        <Circle cx="90" cy="60" r="30" stroke="#00E5FF" strokeWidth={0.8} strokeDasharray="1,4" fill="none" opacity={0.4} />

        {/* Ring 1 (Thick glowing blue gradient) */}
        <Circle cx="90" cy="60" r="26" stroke="url(#thickRingGrad)" strokeWidth={4} fill="none" />

        {/* Center White Orb Drop Shadow (Concentric offset circle) */}
        <Circle cx="90" cy="61.5" r="19" fill="rgba(10, 31, 92, 0.15)" />

        {/* Center White Orb (matches screenshot perfectly) */}
        <Circle cx="90" cy="60" r="19" fill="#FFFFFF" />

        {/* Ultra-Premium Miniature Studio Condenser Mic Graphic */}
        <G>
          {/* U-Shape Cradle Mount */}
          <Path d="M 83.5 54 C 83.5 62, 96.5 62, 96.5 54" stroke="#94A3B8" strokeWidth={1.3} fill="none" strokeLinecap="round" />
          
          {/* Side gold mounting knobs */}
          <Circle cx="83.5" cy="54" r="0.8" fill="#F59E0B" />
          <Circle cx="96.5" cy="54" r="0.8" fill="#F59E0B" />

          {/* Stand Stem */}
          <Rect x="89.1" y="61.5" width="1.8" height="5" rx="0.5" fill="#94A3B8" />
          {/* Stand Base */}
          <Rect x="86" y="66.5" width="8" height="1.2" rx="0.4" fill="#64748B" />
          <Rect x="87" y="65.7" width="6" height="0.8" fill="#F59E0B" />

          {/* Lower mic body (Indigo metal) */}
          <Rect x="86.5" y="54" width="7" height="7.5" rx="0.8" fill="#003D9B" />
          
          {/* Gold Collar band */}
          <Rect x="86.5" y="53" width="7" height="1" fill="#F59E0B" />

          {/* Capsule Head (Silver Metal Mesh) */}
          <Rect x="86.5" y="44" width="7" height="9" rx="3.5" fill="#E2E8F0" />
          
          {/* Fine grill mesh lines */}
          <Line x1="88.2" y1="44" x2="88.2" y2="53" stroke="#003D9B" strokeWidth={0.5} opacity={0.6} />
          <Line x1="90" y1="44" x2="90" y2="53" stroke="#003D9B" strokeWidth={0.5} opacity={0.8} />
          <Line x1="91.8" y1="44" x2="91.8" y2="53" stroke="#003D9B" strokeWidth={0.5} opacity={0.6} />
          <Line x1="86.5" y1="47" x2="93.5" y2="47" stroke="#003D9B" strokeWidth={0.5} opacity={0.6} />
          <Line x1="86.5" y1="50" x2="93.5" y2="50" stroke="#003D9B" strokeWidth={0.5} opacity={0.6} />

          {/* Shininess reflection */}
          <Rect x="87.5" y="45" width="1.2" height="7" rx="0.6" fill="#FFFFFF" opacity={0.5} />
        </G>
      </Svg>
    </View>
  );
};

// Flowing wave overlay inside topic cards
const CardWaveOverlay = ({ color }: { color: string }) => {
  return (
    <Svg width="100%" height={45} style={styles.cardWaveSvg}>
      <Defs>
        <SvgLinearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.01} />
          <Stop offset="50%" stopColor={color} stopOpacity={0.16} />
          <Stop offset="100%" stopColor={color} stopOpacity={0.01} />
        </SvgLinearGradient>
      </Defs>
      <Path d="M 0 20 C 60 5, 120 35, 180 20 C 240 5, 300 35, 360 20" stroke="url(#waveGrad)" strokeWidth={2} fill="none" />
      <Path d="M 0 25 C 60 15, 120 25, 180 15 T 360 15" stroke={color} strokeWidth={0.8} fill="none" opacity={0.1} strokeDasharray="4,4" />
    </Svg>
  );
};

// Clean vector voice equalizer analyzer inside cards
const CardWaveformAnalyzer = ({ color }: { color: string }) => {
  return (
    <View style={styles.waveformContainer}>
      <View style={[styles.wavePillar, { height: 12, backgroundColor: color }]} />
      <View style={[styles.wavePillar, { height: 22, backgroundColor: color, opacity: 0.9 }]} />
      <View style={[styles.wavePillar, { height: 32, backgroundColor: color }]} />
      <View style={[styles.wavePillar, { height: 26, backgroundColor: color, opacity: 0.8 }]} />
      <View style={[styles.wavePillar, { height: 16, backgroundColor: color, opacity: 0.6 }]} />
      <View style={[styles.wavePillar, { height: 8, backgroundColor: color, opacity: 0.4 }]} />
    </View>
  );
};

export const AISpeakingBuddyScreen = ({ navigation }: any) => {
  const [topics, setTopics]           = useState<TopicItem[]>(INITIAL_TOPICS);
  const [searchQuery, setSearchQuery] = useState('');

  // Create modal
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [formTopic,   setFormTopic]   = useState('');
  const [formClass,   setFormClass]   = useState('');
  const [formSection, setFormSection] = useState('');
  const [showClassDD,   setShowClassDD]   = useState(false);
  const [showSectionDD, setShowSectionDD] = useState(false);

  // Edit modal
  const [editVisible, setEditVisible] = useState(false);
  const [editItem,    setEditItem]    = useState<TopicItem | null>(null);
  const [editTitle,   setEditTitle]   = useState('');

  // Preview modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewItem,    setPreviewItem]    = useState<TopicItem | null>(null);
  const [voiceLog,       setVoiceLog]       = useState<{ sender: 'ai' | 'user'; text: string }[]>([]);
  const [isListening,    setIsListening]    = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle'|'listening'|'thinking'|'speaking'>('idle');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 550, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 550, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  const filtered = useMemo(() =>
    topics.filter(t =>
      t.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.section.toLowerCase().includes(searchQuery.toLowerCase())
    ), [topics, searchQuery]);

  const handleCreate = () => {
    if (!formTopic.trim()) { Alert.alert('Required', 'Enter a Topic title.'); return; }
    if (!formClass)        { Alert.alert('Required', 'Select a Class.');      return; }
    if (!formSection)      { Alert.alert('Required', 'Select a Section.');    return; }
    setTopics([{ id: Date.now().toString(), topic: formTopic.trim(), className: formClass, section: formSection }, ...topics]);
    setFormTopic(''); setFormClass(''); setFormSection('');
    setIsCreateVisible(false);
    Alert.alert('Success ✓', 'Topic created successfully!');
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Topic', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setTopics(topics.filter(t => t.id !== id)) }
    ]);
  };

  const openEdit = (item: TopicItem) => { setEditItem(item); setEditTitle(item.topic); setEditVisible(true); };
  const handleSaveEdit = () => {
    if (!editTitle.trim()) { Alert.alert('Required', 'Title cannot be empty.'); return; }
    setTopics(topics.map(t => t.id === editItem?.id ? { ...t, topic: editTitle.trim() } : t));
    setEditVisible(false);
  };

  const openPreview = (item: TopicItem) => {
    setPreviewItem(item);
    setVoiceLog([{ sender: 'ai', text: `Hello! Let's practice speaking about "${item.topic}". Press the mic to start! 🎙` }]);
    setIsListening(false);
    setAiStatus('idle');
    setPreviewVisible(true);
  };

  const handleMic = () => {
    if (isListening) {
      setIsListening(false);
      setAiStatus('thinking');
      setTimeout(() => {
        setVoiceLog(prev => [...prev, { sender: 'user', text: `I'm speaking about "${previewItem?.topic}". It is a very important topic for students.` }]);
        setTimeout(() => {
          setAiStatus('speaking');
          setVoiceLog(prev => [...prev, { sender: 'ai', text: `Excellent! Your fluency on "${previewItem?.topic}" was great. Well done! 🌟` }]);
          setTimeout(() => setAiStatus('idle'), 2000);
        }, 1200);
      }, 900);
    } else {
      setIsListening(true);
      setAiStatus('listening');
    }
  };

  // ── Dynamic Premium Color Themes ──
  const getCardTheme = (className: string) => {
    if (className.includes('GRADE-V')) {
      return {
        gradColors: ['#ffffff', '#F0F6FF', '#E1EFFF'],
        accent: '#0052cc',
        secondary: '#003d9b',
        iconBg: '#DBEAFE',
        badgeBg: 'rgba(0, 82, 204, 0.08)',
        badgeText: '#0052cc',
        border: '#B9D7FE',
        eqColor: '#1E40AF',
        accentGlow: 'rgba(37, 99, 235, 0.06)',
      };
    }
    if (className.includes('GRADE-III')) {
      return {
        gradColors: ['#ffffff', '#F2FDF5', '#DCFCE7'],
        accent: '#0D9488',
        secondary: '#0F766E',
        iconBg: '#D1FAE5',
        badgeBg: 'rgba(13, 148, 136, 0.08)',
        badgeText: '#0D9488',
        border: '#A7F3D0',
        eqColor: '#0F766E',
        accentGlow: 'rgba(13, 148, 136, 0.06)',
      };
    }
    if (className.includes('GRADE-II')) {
      return {
        gradColors: ['#ffffff', '#FAF5FF', '#F3E8FF'],
        accent: '#6366F1',
        secondary: '#4F46E5',
        iconBg: '#E0E7FF',
        badgeBg: 'rgba(99, 102, 241, 0.08)',
        badgeText: '#6366F1',
        border: '#C7D2FE',
        eqColor: '#4F46E5',
        accentGlow: 'rgba(99, 102, 241, 0.06)',
      };
    }
    return {
      gradColors: ['#ffffff', '#FFFDF5', '#FEF3C7'],
      accent: '#D97706',
      secondary: '#B45309',
      iconBg: '#FEF3C7',
      badgeBg: 'rgba(217, 119, 6, 0.08)',
      badgeText: '#D97706',
      border: '#FDE68A',
      eqColor: '#B45309',
      accentGlow: 'rgba(217, 119, 6, 0.06)',
    };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={20} color="#003d9b" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>AI Speaking Buddy</Text>
            <Text style={styles.headerSubtitle}>Voice practice management</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={() => setIsCreateVisible(true)} activeOpacity={0.85}>
          <LinearGradient colors={['#0066FF', '#003D9B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.createBtnGrad}>
            <MaterialIcons name="add-circle" size={18} color="#fff" style={{ marginRight: 5 }} />
            <Text style={styles.createBtnText}>Create</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── LUXURY ULTRA-PREMIUM HERO CARD ── */}
        <LinearGradient 
          colors={['#F4F9FF', '#E8F2FF', '#D8EAFF']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroCard}
        >
          {/* Subtle top shine */}
          <View style={styles.heroTopShine} />

          {/* Floating glowing circles */}
          <View pointerEvents="none" style={[styles.heroAuroraSphere, { backgroundColor: '#60A5FA', width: 240, height: 240, top: -85, right: -45, opacity: 0.25 }]} />
          <View pointerEvents="none" style={[styles.heroAuroraSphere, { backgroundColor: '#34D399', width: 140, height: 140, bottom: -50, left: 20, opacity: 0.12 }]} />

          {/* Sound waves vectors */}
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgLinearGradient id="siriWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#0052cc" stopOpacity={0} />
                <Stop offset="50%" stopColor="#0052cc" stopOpacity={0.16} />
                <Stop offset="100%" stopColor="#0284C7" stopOpacity={0} />
              </SvgLinearGradient>
              <SvgLinearGradient id="siriWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#34D399" stopOpacity={0} />
                <Stop offset="50%" stopColor="#0052cc" stopOpacity={0.12} />
                <Stop offset="100%" stopColor="#003d9b" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Path d="M -20 100 Q 70 65 170 100 T 360 100 T 540 100" stroke="url(#siriWaveGrad1)" strokeWidth={2.8} fill="none" />
            <Path d="M 0 108 Q 90 135 180 108 T 380 108 T 580 108" stroke="url(#siriWaveGrad2)" strokeWidth={1.2} fill="none" opacity={0.7} />
          </Svg>

          {/* Futuristic Siri/Alexa style active Voice wave visualizer orb */}
          <PremiumVoiceVisualizer />

          {/* Hero Content Stack */}
          <View style={styles.heroBodyLayout}>
            <View style={styles.heroBadge}>
              <MaterialIcons name="settings-voice" size={13} color="#0052cc" style={{ marginRight: 6 }} />
              <Text style={styles.heroBadgeText}>AI SPEECH INTELLIGENCE</Text>
            </View>

            <Text style={styles.luxuryHeroTitle}>Vocal Studio</Text>
            <Text style={styles.luxuryHeroSub}>Enhance student fluency with active audio evaluations</Text>

            {/* Dashboard stats panel (Frosted layout) */}
            <View style={styles.statsGlassPanel}>
              <View style={styles.statGlassCell}>
                <Text style={styles.statGlassNum}>{topics.length}</Text>
                <Text style={styles.statGlassLabel}>TOPICS</Text>
              </View>
              <View style={styles.statGlassSep} />
              <View style={styles.statGlassCell}>
                <Text style={[styles.statGlassNum, { color: '#0D9488' }]}>{topics.filter(t => t.className.includes('GRADE-V')).length}</Text>
                <Text style={styles.statGlassLabel}>GRADE V</Text>
              </View>
              <View style={styles.statGlassSep} />
              <View style={styles.statGlassCell}>
                <Text style={[styles.statGlassNum, { color: '#0052cc' }]}>{topics.filter(t => t.className.includes('GRADE-II')).length}</Text>
                <Text style={styles.statGlassLabel}>GRADE II</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── SEARCH ── */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconBox}>
              <MaterialIcons name="search" size={18} color="#003d9b" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search topics, class, section..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={{ padding: 8 }} onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                <MaterialIcons name="close" size={15} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── LIST HEADER ── */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Conversation Topics</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length} Topics</Text>
          </View>
        </View>

        {/* ── TOPIC CARDS (WOW FACTOR REDESIGN) ── */}
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialIcons name="mic-off" size={40} color="#BFDBFE" />
            <Text style={styles.emptyTitle}>No topics found</Text>
            <Text style={styles.emptyDesc}>Tap Create to add a new speaking topic</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const themeColors = getCardTheme(item.className);
            return (
              <View key={item.id} style={[styles.topicCard, { borderColor: themeColors.border, shadowColor: themeColors.accent }]}>
                {/* Dynamic Gradient Background */}
                <LinearGradient
                  colors={themeColors.gradColors as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />

                {/* Left accent ribbon */}
                <View style={[styles.cardAccent, { backgroundColor: themeColors.accent }]} />

                {/* Glow Overlay */}
                <View style={[styles.cardInteriorGlow, { backgroundColor: themeColors.accentGlow }]} />

                {/* Sound wave graphic background */}
                <CardWaveOverlay color={themeColors.accent} />

                <View style={styles.cardBody}>
                  {/* Card Title Header with polished layout */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardHeaderLeftGroup}>
                      {/* Premium circular mic orb with outer white border & shadow */}
                      <View style={[styles.micIconBox, { backgroundColor: '#ffffff', borderColor: themeColors.border }]}>
                        <LinearGradient
                          colors={[themeColors.accent, themeColors.secondary]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.micIconGrad}
                        >
                          <MaterialIcons name="mic" size={17} color="#ffffff" />
                        </LinearGradient>
                      </View>
                      
                      <View style={{ marginLeft: 12 }}>
                        <Text style={styles.cardTopicTitle} numberOfLines={1}>{item.topic}</Text>
                        <View style={styles.activeStatusTagRow}>
                          <View style={styles.activePulseDot} />
                          <Text style={styles.voiceLogLabel}>Vocal Practice Active</Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* Equalizer Visualizer inside Card */}
                    <CardWaveformAnalyzer color={themeColors.eqColor} />
                  </View>

                  {/* Metadata Chips (Class & Section) */}
                  <View style={styles.fieldsRow}>
                    <View style={[styles.fieldChip, { borderLeftColor: themeColors.accent, backgroundColor: '#ffffff98' }]}>
                      <View style={[styles.chipIndicatorOrb, { backgroundColor: themeColors.accent + '20' }]}>
                        <MaterialIcons name="school" size={12} color={themeColors.accent} />
                      </View>
                      <View style={{ marginLeft: 6 }}>
                        <Text style={styles.fieldChipLabel}>CLASS</Text>
                        <Text style={styles.fieldChipValue}>{item.className}</Text>
                      </View>
                    </View>

                    <View style={styles.fieldSep} />

                    <View style={[styles.fieldChip, { borderLeftColor: themeColors.secondary, backgroundColor: '#ffffff98' }]}>
                      <View style={[styles.chipIndicatorOrb, { backgroundColor: themeColors.secondary + '20' }]}>
                        <MaterialIcons name="meeting-room" size={12} color={themeColors.secondary} />
                      </View>
                      <View style={{ marginLeft: 6 }}>
                        <Text style={styles.fieldChipLabel}>SECTION</Text>
                        <Text style={styles.fieldChipValue}>Section {item.section}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Subtle Separator */}
                  <View style={[styles.cardDivider, { backgroundColor: themeColors.border + '60' }]} />

                  {/* Dynamic Action Buttons */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.btnPreview, { backgroundColor: themeColors.accent }]}
                      onPress={() => openPreview(item)}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={[themeColors.accent, themeColors.secondary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <MaterialIcons name="play-arrow" size={15} color="#fff" style={{ marginRight: 5, zIndex: 2 }} />
                      <Text style={[styles.btnPrimaryText, { zIndex: 2 }]}>Preview</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btnEdit, { borderColor: themeColors.accent + '40', backgroundColor: '#ffffff95' }]}
                      onPress={() => openEdit(item)}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons name="edit" size={14} color={themeColors.accent} style={{ marginRight: 4 }} />
                      <Text style={[styles.btnSecText, { color: themeColors.accent }]}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => handleDelete(item.id, item.topic)}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons name="delete-sweep" size={14} color="#E11D48" style={{ marginRight: 4 }} />
                      <Text style={styles.btnDangerText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ════ CREATE MODAL ════ */}
      <Modal visible={isCreateVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <LinearGradient colors={['#003d9b', '#0052cc']} style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Create Conversation Topic</Text>
              <TouchableOpacity onPress={() => { setIsCreateVisible(false); setFormTopic(''); setFormClass(''); setFormSection(''); }} style={styles.sheetCloseBtn} activeOpacity={0.7}>
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
              {/* Topic */}
              <Text style={styles.fLabel}>Topic Title <Text style={{ color: '#E11D48' }}>*</Text></Text>
              <TextInput
                style={styles.fInput}
                placeholder="Enter topic title..."
                placeholderTextColor="#94A3B8"
                value={formTopic}
                onChangeText={setFormTopic}
              />

              {/* Class */}
              <Text style={[styles.fLabel, { marginTop: 14 }]}>Class <Text style={{ color: '#E11D48' }}>*</Text></Text>
              <TouchableOpacity style={styles.fDropdown} onPress={() => { setShowClassDD(!showClassDD); setShowSectionDD(false); }} activeOpacity={0.8}>
                <Text style={[styles.fDropdownText, !formClass && { color: '#94A3B8' }]}>{formClass || 'Select Class'}</Text>
                <MaterialIcons name={showClassDD ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="#003d9b" />
              </TouchableOpacity>
              {showClassDD && (
                <View style={styles.ddList}>
                  {CLASSES.map(c => (
                    <TouchableOpacity key={c} style={styles.ddItem} onPress={() => { setFormClass(c); setShowClassDD(false); }} activeOpacity={0.7}>
                      <Text style={styles.ddText}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Section */}
              <Text style={[styles.fLabel, { marginTop: 14 }]}>Section <Text style={{ color: '#E11D48' }}>*</Text></Text>
              <TouchableOpacity style={styles.fDropdown} onPress={() => { setShowSectionDD(!showSectionDD); setShowClassDD(false); }} activeOpacity={0.8}>
                <Text style={[styles.fDropdownText, !formSection && { color: '#94A3B8' }]}>{formSection ? `Section ${formSection}` : 'Select Section'}</Text>
                <MaterialIcons name={showSectionDD ? 'arrow-drop-up' : 'arrow-drop-down'} size={24} color="#003d9b" />
              </TouchableOpacity>
              {showSectionDD && (
                <View style={styles.ddList}>
                  {SECTIONS.map(s => (
                    <TouchableOpacity key={s} style={styles.ddItem} onPress={() => { setFormSection(s); setShowSectionDD(false); }} activeOpacity={0.7}>
                      <Text style={styles.ddText}>Section {s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.modalBtnRow}>
                <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreate} activeOpacity={0.85}>
                  <LinearGradient colors={['#0066FF', '#003D9B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalSubmitGrad}>
                    <MaterialIcons name="check-circle" size={18} color="#fff" style={{ marginRight: 7 }} />
                    <Text style={styles.modalSubmitText}>CREATE TOPIC</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setIsCreateVisible(false); setFormTopic(''); setFormClass(''); setFormSection(''); }} activeOpacity={0.8}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ════ EDIT MODAL ════ */}
      <Modal visible={editVisible} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { maxHeight: 320 }]}>
            <LinearGradient colors={['#0284C7', '#0052cc']} style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Edit Topic</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)} style={styles.sheetCloseBtn} activeOpacity={0.7}>
                <MaterialIcons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <View style={{ padding: 20 }}>
              <Text style={styles.fLabel}>Topic Title</Text>
              <TextInput style={styles.fInput} value={editTitle} onChangeText={setEditTitle} />
              <View style={[styles.modalBtnRow, { marginTop: 16 }]}>
                <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSaveEdit} activeOpacity={0.85}>
                  <LinearGradient colors={['#0284C7', '#0052cc']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalSubmitGrad}>
                    <MaterialIcons name="save" size={18} color="#fff" style={{ marginRight: 7 }} />
                    <Text style={styles.modalSubmitText}>SAVE CHANGES</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setEditVisible(false)} activeOpacity={0.8}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ════ PREVIEW MODAL (PREMIUM AI SPEAKING CHATBOT REDESIGN) ════ */}
      <Modal visible={previewVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { maxHeight: '92%', height: '92%' }]}>
            
            {/* Header: Premium Glass Studio Bar */}
            <LinearGradient colors={['#0A1F5C', '#003d9b']} style={styles.sheetHeader}>
              <View style={styles.chatBotHeaderLeft}>
                <View style={styles.botAvatarContainer}>
                  {/* Glowing halo indicator */}
                  <View style={styles.botStatusHalo} />
                  <LinearGradient colors={['#00E5FF', '#0052cc']} style={styles.botAvatarGrad}>
                    <MaterialIcons name="face" size={26} color="#ffffff" />
                  </LinearGradient>
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.chatBotName}>Ayesha</Text>
                  <View style={styles.chatBotStatusRow}>
                    <View style={styles.chatBotLivePulse} />
                    <Text style={styles.chatBotStatusText}>Role-play session • Online</Text>
                  </View>
                </View>
              </View>

              <View style={styles.chatBotHeaderRight}>
                <View style={styles.sessionTopicBadge}>
                  <Text style={styles.sessionTopicText} numberOfLines={1}>{previewItem?.topic}</Text>
                </View>
                <TouchableOpacity onPress={() => setPreviewVisible(false)} style={styles.sheetCloseBtn} activeOpacity={0.7}>
                  <MaterialIcons name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {/* Siri Waveform Visualizer Display */}
            <LinearGradient colors={['#F0F6FF', '#E3EFFF']} style={styles.vizBox}>
              <View style={styles.vizContainerHeader}>
                <MaterialIcons name="graphic-eq" size={14} color="#0052cc" />
                <Text style={styles.vizHeaderText}>AI SPEECH EVALUATOR</Text>
              </View>
              <View style={styles.vizBars}>
                {[6, 15, 26, 38, 48, 38, 26, 15, 6].map((h, i) => (
                  <View key={i} style={[styles.vizBar, {
                    height: isListening ? h * 1.5 : h,
                    backgroundColor: aiStatus === 'listening' ? '#EF4444' : aiStatus === 'speaking' ? '#10B981' : '#3B82F6'
                  }]} />
                ))}
              </View>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, {
                  backgroundColor: aiStatus === 'idle' ? '#64748B' : aiStatus === 'listening' ? '#EF4444' : aiStatus === 'thinking' ? '#F59E0B' : '#10B981'
                }]} />
                <Text style={styles.statusText}>
                  {aiStatus === 'idle' ? 'Ready for your voice input' : aiStatus === 'listening' ? 'Listening... Speak now!' : aiStatus === 'thinking' ? 'AI is analyzing your accent...' : 'Ayesha is speaking...'}
                </Text>
              </View>
            </LinearGradient>

            {/* Conversation Bubbles Screen */}
            <ScrollView style={styles.chatArea} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
              {voiceLog.map((msg, i) => {
                const isAI = msg.sender === 'ai';
                return (
                  <View key={i} style={[
                    styles.chatRow,
                    isAI ? styles.aiRow : styles.userRow
                  ]}>
                    {/* Bot avatar placeholder in list */}
                    {isAI && (
                      <View style={styles.chatBubbleAvatar}>
                        <LinearGradient colors={['#EEF2FF', '#DBEAFE']} style={styles.chatBubbleAvatarGrad}>
                          <MaterialIcons name="smart-toy" size={14} color="#0052cc" />
                        </LinearGradient>
                      </View>
                    )}

                    <View style={[
                      styles.chatBubbleBox,
                      isAI ? styles.aiBubbleStyle : styles.userBubbleStyle
                    ]}>
                      {/* Speaker header tag */}
                      <Text style={[styles.bubbleHeaderLabel, isAI ? { color: '#0052cc' } : { color: '#93C5FD' }]}>
                        {isAI ? 'Ayesha (AI)' : 'You'}
                      </Text>
                      <Text style={[styles.bubbleText, isAI ? { color: '#0F172A' } : { color: '#ffffff' }]}>
                        {msg.text}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {/* Input Board panel */}
            <View style={styles.premiumInputArea}>
              
              {/* Write Response input field */}
              <View style={styles.premiumChatBar}>
                <View style={styles.inputPrefixIcon}>
                  <MaterialIcons name="keyboard" size={18} color="#64748B" />
                </View>
                <TextInput
                  style={styles.premiumChatInput}
                  placeholder="Type your response here..."
                  placeholderTextColor="#94A3B8"
                  onSubmitEditing={handleMic}
                />
                
                {/* Send Button */}
                <TouchableOpacity style={styles.premiumSendBtn} onPress={handleMic} activeOpacity={0.8}>
                  <LinearGradient colors={['#0066FF', '#003D9B']} style={styles.premiumSendBtnGrad}>
                    <MaterialIcons name="send" size={16} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Floating Pulse Microphone Control */}
              <View style={styles.premiumMicButtonSection}>
                <Text style={styles.micHintText}>
                  {isListening ? 'Tap to stop recording' : 'Press & speak about this topic'}
                </Text>
                
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity onPress={handleMic} activeOpacity={0.85} style={styles.micOuterCircleShadow}>
                    <LinearGradient
                      colors={isListening ? ['#EF4444', '#DC2626'] : ['#0066FF', '#003D9B']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.micBtn}
                    >
                      <MaterialIcons name={isListening ? 'mic-off' : 'mic'} size={28} color="#ffffff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </View>

            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 11,
    borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerButton:  { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  headerTitle:   { fontSize: 16, fontWeight: '900', color: '#0A1F5C' },
  headerSubtitle:{ fontSize: 11, fontWeight: '600', color: '#64748B', marginTop: 1 },
  createBtn:     { borderRadius: 10, overflow: 'hidden' },
  createBtnGrad: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9 },
  createBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  scrollContent: { paddingBottom: 60 },

  // Luxury Hero Card
  heroCard: {
    margin: 10, borderRadius: 16, padding: 12, overflow: 'hidden',
    position: 'relative',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 4,
  },
  heroTopShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  heroAuroraSphere: {
    position: 'absolute', borderRadius: 999,
  },
  heroBodyLayout: {
    width: '68%',
    zIndex: 2,
  },
  luxuryHeroTitle: {
    fontSize: 18, fontWeight: '900', color: '#0A1F5C',
    letterSpacing: 0.3, marginTop: 6,
  },
  luxuryHeroSub: {
    fontSize: 10, fontWeight: '700', color: '#334155',
    lineHeight: 13, marginTop: 2, opacity: 0.95,
  },

  // Stats dashboard panel on hero
  statsGlassPanel: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8,
    borderWidth: 1, borderColor: 'rgba(0, 82, 204, 0.12)',
    marginTop: 10,
  },
  statGlassCell: { flex: 1, alignItems: 'center' },
  statGlassNum:  { fontSize: 14, fontWeight: '900', color: '#0A1F5C' },
  statGlassLabel:{ fontSize: 7.5, fontWeight: '900', color: '#475569', marginTop: 1, letterSpacing: 0.4 },
  statGlassSep:  { width: 1, height: 16, backgroundColor: 'rgba(0, 82, 204, 0.15)' },

  heroBubble:   { position: 'absolute', borderRadius: 999, backgroundColor: '#fff' },
  heroTopRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 },
  heroBadge:    { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 82, 204, 0.08)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  heroBadgeText:{ fontSize: 9, fontWeight: '900', color: '#0052cc', letterSpacing: 1 },
  heroDate:     { fontSize: 11, fontWeight: '700', color: '#475569' },
  heroStatsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroStat:     { flex: 1, alignItems: 'center' },
  heroStatNum:  { fontSize: 26, fontWeight: '900', color: '#fff' },
  heroStatLabel:{ fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.55)', marginTop: 2, textAlign: 'center' },
  heroStatDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)' },
  heroBar:      { flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', gap: 2 },
  heroBarSeg:   { borderRadius: 2 },

  // Pulse live wave
  liveTagPulse: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, gap: 4
  },
  liveTagDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  liveTagText: { fontSize: 8.5, fontWeight: '900', color: '#059669' },

  // Luxury Voice Wave Visualizer Styles
  voiceOrbWrapper: {
    position: 'absolute',
    right: -24,
    top: '50%',
    marginTop: -60,
    width: 180,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  orbSvg: {
    zIndex: 4,
  },
  orbGlowLayer: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.15,
  },
  centerOrbShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  // Search
  searchSection: { paddingHorizontal: 14, marginBottom: 6 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    height: 36,
  },
  searchIconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  searchInput:   { flex: 1, height: 36, fontSize: 12.5, fontWeight: '600', color: '#0F172A' },

  // List header
  listHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, marginTop: 6, marginBottom: 8,
  },
  listTitle:  { fontSize: 13.5, fontWeight: '900', color: '#0A1F5C' },
  countBadge: { backgroundColor: '#EEF2FF', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 3 },
  countText:  { fontSize: 10, fontWeight: '800', color: '#003d9b' },

  // Empty
  emptyBox:  { alignItems: 'center', paddingVertical: 40 },
  emptyTitle:{ fontSize: 13, fontWeight: '900', color: '#94A3B8', marginTop: 10 },
  emptyDesc: { fontSize: 11, fontWeight: '600', color: '#CBD5E1', marginTop: 3 },

  // Topic Card (WOW FACTOR REDESIGNED)
  topicCard: {
    flexDirection: 'row', marginHorizontal: 14, marginBottom: 10,
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  cardAccent: { width: 4, backgroundColor: '#003d9b' },
  cardWaveSvg: { position: 'absolute', bottom: 36, left: 0, right: 0 },
  cardInteriorGlow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  cardBody:   { flex: 1, padding: 12, position: 'relative' },

  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8, justifyContent: 'space-between' },
  cardHeaderLeftGroup: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  micIconBox: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3, elevation: 1,
  },
  micIconGrad: { width: '100%', height: '100%', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  cardTopicTitle: { fontSize: 13.5, fontWeight: '900', color: '#0A1F5C' },
  activeStatusTagRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  activePulseDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#10B981', marginRight: 5 },
  voiceLogLabel: { fontSize: 9.5, color: '#64748B', fontWeight: '800' },

  // Equalizer visualizer
  waveformContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 26, gap: 3 },
  wavePillar: { width: 3, borderRadius: 1.5 },

  fieldsRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  fieldChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 10, padding: 7,
    borderWidth: 1, borderColor: 'rgba(226, 232, 240, 0.9)',
    borderLeftWidth: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02, shadowRadius: 2,
  },
  chipIndicatorOrb: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fieldChipLabel: { fontSize: 8, fontWeight: '900', color: '#94A3B8', letterSpacing: 0.4 },
  fieldChipValue: { fontSize: 11, fontWeight: '900', color: '#0A1F5C', marginTop: 1 },
  fieldSep:       { width: 6 },

  cardDivider: { height: 1, marginBottom: 10 },

  actionsRow: { flexDirection: 'row', gap: 6 },
  btnPreview: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    overflow: 'hidden',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 4, elevation: 2,
  },
  btnEdit: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1,
  },
  btnDelete: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF1F2', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: '#FECDD3',
  },
  btnPrimaryText: { fontSize: 12.5, fontWeight: '900', color: '#fff', letterSpacing: 0.2 },
  btnSecText:     { fontSize: 12.5, fontWeight: '900', letterSpacing: 0.2 },
  btnDangerText:  { fontSize: 12.5, fontWeight: '900', color: '#E11D48', letterSpacing: 0.2 },

  // Modals
  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: 'hidden', maxHeight: '92%',
    borderTopWidth: 1, borderColor: '#E2E8F0',
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  sheetTitle: { fontSize: 16, fontWeight: '900', color: '#fff' },
  sheetCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },

  fLabel:       { fontSize: 12, fontWeight: '800', color: '#334155', marginBottom: 7, letterSpacing: 0.3 },
  fInput: {
    height: 50, borderWidth: 1.5, borderColor: '#CBD5E1',
    borderRadius: 12, paddingHorizontal: 14,
    fontSize: 14, fontWeight: '600', color: '#0F172A', backgroundColor: '#F8FAFC',
  },
  fDropdown: {
    height: 50, borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 12,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: '#F8FAFC',
  },
  fDropdownText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  ddList: {
    borderWidth: 1.5, borderColor: '#003d9b', borderRadius: 12,
    overflow: 'hidden', marginTop: 4, backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  ddItem:    { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  ddText:    { fontSize: 14, fontWeight: '700', color: '#0A1F5C' },

  modalBtnRow:     { flexDirection: 'row', gap: 10, marginTop: 10 },
  modalSubmitBtn:  { flex: 1, borderRadius: 12, overflow: 'hidden' },
  modalSubmitGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 },
  modalSubmitText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 0.4 },
  modalCancelBtn:  { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { fontSize: 13, fontWeight: '800', color: '#64748B' },

  // Preview
  
  vizBars:   { flexDirection: 'row', alignItems: 'center', height: 48, marginBottom: 10 },
  vizBar:    { width: 6, borderRadius: 3, marginHorizontal: 3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText:{ fontSize: 12, fontWeight: '800', color: '#0A1F5C' },

  chatArea: { maxHeight: 200, backgroundColor: '#FAFAFA' },
  bubble:   { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10, paddingHorizontal: 14 },
  userBubble:  { justifyContent: 'flex-end' },
  aiBubble:    { justifyContent: 'flex-start' },
  aiDot: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: '#EEF2FF',
    borderWidth: 1, borderColor: '#BFDBFE',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  bubbleBox:    { maxWidth: '78%', padding: 11, borderRadius: 14 },
  aiBubbleBox:  { backgroundColor: '#EEF2FF', borderBottomLeftRadius: 4 },
  userBubbleBox:{ backgroundColor: '#003d9b', borderBottomRightRadius: 4, alignSelf: 'flex-end' },
  bubbleText:   { fontSize: 13, fontWeight: '600', color: '#0A1F5C', lineHeight: 18 },

  micArea: { alignItems: 'center', padding: 18, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#fff' },
  micHint: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 12 },
  micBtn: {
    width: 66, height: 66, borderRadius: 33,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 7,
  },

  // Premium chatbot styles
  chatBotHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  botAvatarContainer: { width: 44, height: 44, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  botStatusHalo: {
    position: 'absolute', width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: '#00E5FF', opacity: 0.8,
  },
  botAvatarGrad: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  chatBotName: { fontSize: 16, fontWeight: '900', color: '#FFFFFF' },
  chatBotStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  chatBotLivePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00FF66', marginRight: 6 },
  chatBotStatusText: { fontSize: 11, color: '#93C5FD', fontWeight: '700' },
  chatBotHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sessionTopicBadge: {
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, maxWidth: 140,
  },
  sessionTopicText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },

  vizBox: {
    padding: 22, alignItems: 'center',
    borderBottomWidth: 1.5, borderBottomColor: '#EEF2FF',
    backgroundColor: '#FFFFFF',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  vizContainerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  vizHeaderText: { fontSize: 10, fontWeight: '900', color: '#0052cc', letterSpacing: 0.5 },

  chatRow: { flexDirection: 'row', marginBottom: 16, width: '100%' },
  aiRow: { justifyContent: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  chatBubbleAvatar: { width: 28, height: 28, marginRight: 8, alignSelf: 'flex-end' },
  chatBubbleAvatarGrad: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#BFDBFE',
  },
  chatBubbleBox: {
    maxWidth: '82%', borderRadius: 16, padding: 14,
    shadowColor: '#0A1F5C', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  aiBubbleStyle: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1.5, borderColor: '#EEF2FF',
  },
  userBubbleStyle: {
    backgroundColor: '#003d9b',
    borderBottomRightRadius: 4,
  },
  bubbleHeaderLabel: { fontSize: 9.5, fontWeight: '900', marginBottom: 4, letterSpacing: 0.5 },

  premiumInputArea: {
    backgroundColor: '#FFFFFF', padding: 16,
    borderTopWidth: 1.5, borderTopColor: '#EEF2FF',
  },
  premiumChatBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 16, borderWidth: 1.5, borderColor: '#E2E8F0',
    paddingHorizontal: 12, height: 52,
    shadowColor: '#0052cc', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  inputPrefixIcon: { width: 32, alignItems: 'center', justifyContent: 'center' },
  premiumChatInput: { flex: 1, height: '100%', fontSize: 14, fontWeight: '600', color: '#0F172A' },
  premiumSendBtn: { borderRadius: 10, overflow: 'hidden', marginLeft: 8 },
  premiumSendBtnGrad: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  premiumMicButtonSection: { alignItems: 'center', marginTop: 14 },
  micHintText: { fontSize: 10.5, fontWeight: '800', color: '#64748B', marginBottom: 8, letterSpacing: 0.3 },
  micOuterCircleShadow: {
    borderRadius: 33,
    shadowColor: '#0066FF', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 12, elevation: 5,
  },
});
