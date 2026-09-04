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
  Platform,
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



// Clean vector voice equalizer analyzer inside cards
const CardWaveformAnalyzer = ({ color }: { color: string }) => {
  return (
    <View style={styles.waveformContainer}>
      <View style={[styles.wavePillar, { height: 8, backgroundColor: color, opacity: 0.45 }]} />
      <View style={[styles.wavePillar, { height: 16, backgroundColor: color, opacity: 0.75 }]} />
      <View style={[styles.wavePillar, { height: 22, backgroundColor: color }]} />
      <View style={[styles.wavePillar, { height: 17, backgroundColor: color, opacity: 0.85 }]} />
      <View style={[styles.wavePillar, { height: 11, backgroundColor: color, opacity: 0.6 }]} />
      <View style={[styles.wavePillar, { height: 6, backgroundColor: color, opacity: 0.35 }]} />
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

  // Edit state
  const [editVisible,       setEditVisible]       = useState(false);
  const [editItem,          setEditItem]          = useState<TopicItem | null>(null);
  const [editTitle,         setEditTitle]         = useState('');
  const [editClass,         setEditClass]         = useState('');
  const [editSection,       setEditSection]       = useState('');
  const [showEditClassDD,   setShowEditClassDD]   = useState(false);
  const [showEditSectionDD, setShowEditSectionDD] = useState(false);

  // Preview screen state
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewItem,    setPreviewItem]    = useState<TopicItem | null>(null);
  const [voiceLog,       setVoiceLog]       = useState<{ sender: 'ai' | 'user'; text: string; time?: string }[]>([]);
  const [chatInput,      setChatInput]      = useState('');
  const [isListening,    setIsListening]    = useState(false);
  const [aiStatus,       setAiStatus]       = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const chatScrollRef = useRef<ScrollView>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.18, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,    duration: 500, useNativeDriver: true }),
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

  // Delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<TopicItem | null>(null);

  const handleCreate = () => {
    if (!formTopic.trim()) { Alert.alert('Required', 'Enter a Topic title.'); return; }
    if (!formClass)        { Alert.alert('Required', 'Select a Class.');      return; }
    if (!formSection)      { Alert.alert('Required', 'Select a Section.');    return; }
    setTopics([{ id: Date.now().toString(), topic: formTopic.trim(), className: formClass, section: formSection }, ...topics]);
    setFormTopic(''); setFormClass(''); setFormSection('');
    setIsCreateVisible(false);
    Alert.alert('Success ✓', 'Topic created successfully!');
  };

  const handleDelete = (item: TopicItem) => {
    setItemToDelete(item);
  };

  const openEdit = (item: TopicItem) => {
    setEditItem(item);
    setEditTitle(item.topic);
    setEditClass(item.className);
    setEditSection(item.section);
    setShowEditClassDD(false);
    setShowEditSectionDD(false);
    setEditVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) { Alert.alert('Required', 'Title cannot be empty.'); return; }
    if (!editClass)        { Alert.alert('Required', 'Select a Class.');      return; }
    if (!editSection)      { Alert.alert('Required', 'Select a Section.');    return; }
    setTopics(topics.map(t => t.id === editItem?.id ? {
      ...t,
      topic: editTitle.trim(),
      className: editClass,
      section: editSection,
    } : t));
    setEditVisible(false);
    Alert.alert('Success ✓', 'Topic updated successfully!');
  };

  const openPreview = (item: TopicItem) => {
    setPreviewItem(item);
    setVoiceLog([
      {
        sender: 'ai',
        text: `Okay, I'm ready! What are we talking about ${item.topic.toLowerCase()} today? 😊`,
        time: 'Just now'
      }
    ]);
    setChatInput('');
    setIsListening(false);
    setAiStatus('idle');
    setPreviewVisible(true);
  };

  const getSmartReply = (userText: string, topicName: string) => {
    const lower = userText.toLowerCase();
    const topicLower = topicName.toLowerCase();

    if (topicLower.includes('food')) {
      if (lower.includes('biryani') || lower.includes('pizza') || lower.includes('burger') || lower.includes('fruit') || lower.includes('favorite') || lower.includes('like')) {
        return `Yum! That sounds absolutely delicious! 😋 Why do you like it so much? Tell me more about who makes it best for you!`;
      }
      return `Food is such a wonderful topic! What is your favorite healthy meal, and what dessert do you enjoy after dinner? 🍎🍲`;
    }

    if (topicLower.includes('school')) {
      if (lower.includes('teacher') || lower.includes('friend') || lower.includes('study') || lower.includes('class') || lower.includes('favorite')) {
        return `That's great! Teachers and friends make school very special. 🏫 What is your favorite activity to do during recess?`;
      }
      return `School is full of learning adventures! Tell me, what subject do you enjoy the most and why? 📚✨`;
    }

    if (topicLower.includes('lion') || topicLower.includes('animal')) {
      return `Lions are majestic creatures, known as the King of the Jungle! 🦁 Did you know they live in groups called prides? What other wild animals do you find fascinating?`;
    }

    // Default engaging intelligent reply
    const replies = [
      `That's a wonderful thought about "${topicName}"! 🌟 Can you explain more about what you like most about it?`,
      `Excellent pronunciation and phrasing! 👏 How often do you practice or think about ${topicName.toLowerCase()}?`,
      `I love how you shared that! 💡 Let's build on that: what is something new you learned about ${topicName.toLowerCase()} recently?`
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = (typeof customText === 'string' ? customText : chatInput).trim();
    if (!textToSend) return;

    const topicName = previewItem?.topic || 'this topic';
    setChatInput('');
    setVoiceLog(prev => [...prev, { sender: 'user', text: textToSend, time: 'Just now' }]);
    setAiStatus('thinking');

    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollToEnd({ animated: true });
      }
    }, 100);

    setTimeout(() => {
      setAiStatus('speaking');
      const aiReply = getSmartReply(textToSend, topicName);
      setVoiceLog(prev => [...prev, { sender: 'ai', text: aiReply, time: 'Just now' }]);

      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollToEnd({ animated: true });
        }
      }, 100);

      setTimeout(() => {
        setAiStatus('idle');
      }, 1800);
    }, 1000);
  };

  const handleMic = () => {
    if (isListening) {
      setIsListening(false);
      setAiStatus('thinking');
      const topicName = previewItem?.topic || 'this topic';

      setTimeout(() => {
        const spokenText = `I am practicing my English speech about ${topicName}. It is very exciting to talk with Echo AI!`;
        setVoiceLog(prev => [...prev, { sender: 'user', text: spokenText, time: 'Just now' }]);

        setTimeout(() => {
          setAiStatus('speaking');
          const aiReply = `Superb fluency! 🎙️ Your tone and vocabulary on "${topicName}" sounded clear and confident. What else would you like to say?`;
          setVoiceLog(prev => [...prev, { sender: 'ai', text: aiReply, time: 'Just now' }]);
          
          setTimeout(() => {
            if (chatScrollRef.current) {
              chatScrollRef.current.scrollToEnd({ animated: true });
            }
            setAiStatus('idle');
          }, 1800);
        }, 1100);
      }, 900);
    } else {
      setIsListening(true);
      setAiStatus('listening');
    }
  };



  // ── EARLY FULL-SCREEN RETURN: PREVIEW AI SPEAKING SESSION ──
  if (previewVisible && previewItem) {
    return (
      <SafeAreaView style={styles.previewFullScreen} edges={['top']}>
        {/* ── TOP HEADER BAR (Light Clean Aesthetic Header) ── */}
        <View style={styles.previewHeaderBar}>
          <View style={styles.previewHeaderLeft}>
            <TouchableOpacity
              style={styles.previewBackBtn}
              onPress={() => {
                setPreviewVisible(false);
                setIsListening(false);
                setAiStatus('idle');
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.previewBotAvatarWrapper}>
              <LinearGradient
                colors={['#0066FF', '#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.previewBotAvatarGrad}
              >
                <MaterialIcons name="graphic-eq" size={20} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.onlineDotPulse} />
            </View>

            <View style={{ marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.previewBotTitle}>Echo AI</Text>
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineBadgeText}>Online</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── COMPACT AI VOICE & STATUS STRIP ── */}
        <View style={styles.previewStatusStrip}>
          <View style={styles.statusIndicatorBox}>
            <View
              style={[
                styles.statusPulseOrb,
                {
                  backgroundColor:
                    aiStatus === 'listening'
                      ? '#EF4444'
                      : aiStatus === 'thinking'
                      ? '#F59E0B'
                      : aiStatus === 'speaking'
                      ? '#10B981'
                      : '#0066FF',
                },
              ]}
            />
            <Text style={styles.statusStripLabel}>
              {aiStatus === 'listening'
                ? 'Listening to your voice... Speak now!'
                : aiStatus === 'thinking'
                ? 'Echo is analyzing your answer...'
                : aiStatus === 'speaking'
                ? 'Echo AI is speaking...'
                : `Ready • Topic: "${previewItem.topic}"`}
            </Text>
          </View>

          {/* Live Equalizer mini-bars */}
          <View style={styles.miniEqualizerRow}>
            {[8, 16, 24, 14, 20, 10, 22, 12].map((h, idx) => (
              <View
                key={idx}
                style={[
                  styles.miniEqualizerBar,
                  {
                    height: aiStatus === 'listening' || aiStatus === 'speaking' ? h * 1.2 : 6,
                    backgroundColor:
                      aiStatus === 'listening'
                        ? '#EF4444'
                        : aiStatus === 'speaking'
                        ? '#10B981'
                        : '#94A3B8',
                  },
                ]}
              />
            ))}
          </View>
        </View>
        {/* ── CHAT SCROLL FEED ── */}
        <ScrollView
          ref={chatScrollRef}
          style={styles.previewChatFeed}
          contentContainerStyle={styles.previewChatFeedContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Conversation Messages */}
          {voiceLog.map((msg, index) => {
            const isAI = msg.sender === 'ai';
            return (
              <View
                key={index}
                style={[
                  styles.msgBubbleRow,
                  isAI ? styles.msgBubbleRowAI : styles.msgBubbleRowUser,
                ]}
              >
                {isAI && (
                  <View style={styles.msgAiAvatarSmall}>
                    <LinearGradient
                      colors={['#0066FF', '#6366F1', '#8B5CF6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.msgAiAvatarSmallGrad}
                    >
                      <MaterialIcons name="graphic-eq" size={14} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                )}

                {isAI ? (
                  <View style={styles.msgBubbleCardAI}>
                    <View style={styles.msgBubbleHeaderAI}>
                      <View style={styles.aiNameBadge}>
                        <MaterialIcons name="graphic-eq" size={11} color="#0066FF" style={{ marginRight: 4 }} />
                        <Text style={styles.aiNameBadgeText}>Echo AI</Text>
                      </View>
                      <View style={styles.aiMsgMetaRow}>
                        {msg.time && <Text style={styles.msgTimeTextAI}>{msg.time}</Text>}
                        <TouchableOpacity style={styles.audioPlayChip} activeOpacity={0.7}>
                          <MaterialIcons name="volume-up" size={14} color="#0066FF" />
                          <Text style={styles.audioPlayText}>Listen</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.msgBodyTextAI}>{msg.text}</Text>
                  </View>
                ) : (
                  <LinearGradient
                    colors={['#0066FF', '#0047CC', '#4338CA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.msgBubbleCardUser}
                  >
                    <View style={styles.msgBubbleHeaderUser}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="person" size={13} color="rgba(255,255,255,0.85)" style={{ marginRight: 3 }} />
                        <Text style={styles.msgSenderNameUser}>You</Text>
                      </View>
                      {msg.time && <Text style={styles.msgTimeTextUser}>{msg.time}</Text>}
                    </View>

                    <Text style={styles.msgBodyTextUser}>{msg.text}</Text>
                  </LinearGradient>
                )}
              </View>
            );
          })}

          {/* Thinking animation indicator */}
          {aiStatus === 'thinking' && (
            <View style={[styles.msgBubbleRow, styles.msgBubbleRowAI]}>
              <View style={styles.msgAiAvatarSmall}>
                <LinearGradient
                  colors={['#0066FF', '#6366F1', '#8B5CF6']}
                  style={styles.msgAiAvatarSmallGrad}
                >
                  <MaterialIcons name="graphic-eq" size={14} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.thinkingCard}>
                <View style={styles.thinkingPulseDot} />
                <Text style={styles.thinkingText}>
                  Echo is composing a thoughtful reply...
                </Text>
              </View>
            </View>
          )}

          {/* Quick Suggestion Prompt Chips */}
          <View style={styles.suggestionChipsSection}>
            <View style={styles.suggestionHeaderRow}>
              <MaterialIcons name="stars" size={13} color="#6366F1" />
              <Text style={styles.suggestionChipsHeading}>SUGGESTED PROMPTS</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => handleSendMessage(`My favorite thing about ${previewItem.topic} is...`)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionChipText}>
                  💬 My favorite thing about {previewItem.topic} is...
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => handleSendMessage(`Can you ask me a question about ${previewItem.topic}?`)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionChipText}>
                  ❓ Ask me a question about {previewItem.topic}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => handleSendMessage(`How can I improve my English vocabulary for this topic?`)}
                activeOpacity={0.8}
              >
                <Text style={styles.suggestionChipText}>
                  ✨ Help me speak more fluently
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* ── BOTTOM INPUT BAR (Matching reference image + enhanced polish) ── */}
        <View style={styles.previewBottomControlBar}>
          <View style={styles.previewInputBoxContainer}>
            <TextInput
              style={styles.previewTextInputField}
              placeholder="Type your response..."
              placeholderTextColor="#94A3B8"
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={() => handleSendMessage()}
              returnKeyType="send"
            />

            {/* Mic Button */}
            <TouchableOpacity
              style={[
                styles.previewMicIconButton,
                isListening && styles.previewMicIconButtonActive,
              ]}
              onPress={handleMic}
              activeOpacity={0.8}
            >
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <MaterialIcons
                  name={isListening ? 'mic-off' : 'mic'}
                  size={20}
                  color={isListening ? '#FFFFFF' : '#0066FF'}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity
              style={styles.previewSendIconButton}
              onPress={() => handleSendMessage()}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#0066FF', '#0047CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.previewSendBtnGrad}
              >
                <MaterialIcons name="send" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.previewSendBtnLabel}>Send</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: EDIT TOPIC SCREEN ──
  if (editVisible && editItem) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* ── EDIT SCREEN HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                setEditVisible(false);
                setEditItem(null);
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={20} color="#003d9b" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Edit Conversation Topic</Text>
              <Text style={styles.headerSubtitle}>Update Voice Practice Details</Text>
            </View>
          </View>
          <View style={styles.badgePill}>
            <View style={[styles.badgeDot, { backgroundColor: '#0284C7' }]} />
            <Text style={[styles.badgePillText, { color: '#0284C7' }]}>EDIT TOPIC</Text>
          </View>
        </View>

        {/* ── SCROLLABLE FORM CONTENT ── */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.createScreenScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Card */}
          <View style={styles.createFormCard}>
            {/* Topic Title */}
            <View style={styles.formField}>
              <View style={styles.labelRow}>
                <Text style={styles.formLabel}>Topic Title</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={styles.formInput}
                placeholder="Enter topic title..."
                placeholderTextColor="#94A3B8"
                value={editTitle}
                onChangeText={setEditTitle}
              />
            </View>

            {/* Class Selection */}
            <View style={[styles.formField, { marginTop: 18 }]}>
              <View style={styles.labelRow}>
                <Text style={styles.formLabel}>Target Class</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TouchableOpacity
                style={styles.formSelectBox}
                onPress={() => {
                  setShowEditClassDD(!showEditClassDD);
                  setShowEditSectionDD(false);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.selectTextRow}>
                  <MaterialIcons name="groups" size={18} color={editClass ? '#0047CC' : '#94A3B8'} style={{ marginRight: 8 }} />
                  <Text style={[styles.formSelectText, !editClass && styles.formSelectPlaceholder]}>
                    {editClass || 'Select a class...'}
                  </Text>
                </View>
                <MaterialIcons name={showEditClassDD ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={22} color="#0047CC" />
              </TouchableOpacity>

              {showEditClassDD && (
                <View style={styles.formDropdownOptions}>
                  {CLASSES.map((c) => {
                    const isSelected = editClass === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                        onPress={() => {
                          setEditClass(c);
                          setShowEditClassDD(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>
                          {c}
                        </Text>
                        {isSelected && <MaterialIcons name="check" size={18} color="#0047CC" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Section Selection */}
            <View style={[styles.formField, { marginTop: 18 }]}>
              <View style={styles.labelRow}>
                <Text style={styles.formLabel}>Section(s)</Text>
                <Text style={styles.requiredStar}>*</Text>
                {editSection ? (
                  <Text style={styles.selectedCountText}>
                    {editSection.split(',').filter(Boolean).length} Selected
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.formSelectBox}
                onPress={() => {
                  setShowEditSectionDD(!showEditSectionDD);
                  setShowEditClassDD(false);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.selectTextRow}>
                  <MaterialIcons name="bookmark" size={18} color={editSection ? '#0047CC' : '#94A3B8'} style={{ marginRight: 8 }} />
                  <Text style={[styles.formSelectText, !editSection && styles.formSelectPlaceholder]} numberOfLines={1}>
                    {editSection ? `Section ${editSection}` : 'Select section(s)...'}
                  </Text>
                </View>
                <MaterialIcons name={showEditSectionDD ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={22} color="#0047CC" />
              </TouchableOpacity>

              {showEditSectionDD && (
                <View style={styles.formDropdownOptions}>
                  {/* Select All Option */}
                  <TouchableOpacity
                    style={[
                      styles.formDropdownItem,
                      { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
                    ]}
                    onPress={() => {
                      const currentList = editSection ? editSection.split(',').map((s) => s.trim()).filter(Boolean) : [];
                      if (currentList.length === SECTIONS.length) {
                        setEditSection('');
                      } else {
                        setEditSection(SECTIONS.join(', '));
                      }
                    }}
                  >
                    <Text style={[styles.formDropdownItemText, { fontWeight: '900', color: '#0047CC' }]}>
                      {editSection && editSection.split(',').map((s) => s.trim()).filter(Boolean).length === SECTIONS.length
                        ? '✓ Deselect All'
                        : '✦ Select All Sections'}
                    </Text>
                  </TouchableOpacity>

                  {SECTIONS.map((s) => {
                    const currentList = editSection ? editSection.split(',').map((item) => item.trim()).filter(Boolean) : [];
                    const isSelected = currentList.includes(s);
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                        onPress={() => {
                          let updated: string[];
                          if (isSelected) {
                            updated = currentList.filter((item) => item !== s);
                          } else {
                            updated = [...currentList, s];
                          }
                          setEditSection(updated.join(', '));
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>
                          Section {s}
                        </Text>
                        <MaterialIcons
                          name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                          size={19}
                          color={isSelected ? '#0047CC' : '#94A3B8'}
                        />
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={styles.doneSelectingBtn}
                    onPress={() => setShowEditSectionDD(false)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.doneSelectingText}>Done Selecting</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={[styles.modalBtnRow, { marginTop: 24 }]}>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSaveEdit} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#0066FF', '#003D9B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalSubmitGrad}
                >
                  <MaterialIcons name="check-circle" size={18} color="#fff" style={{ marginRight: 7 }} />
                  <Text style={styles.modalSubmitText}>SAVE CHANGES</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setEditVisible(false);
                  setEditItem(null);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: CREATE TOPIC SCREEN ──
  if (isCreateVisible) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* ── CREATE SCREEN HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                setIsCreateVisible(false);
                setFormTopic('');
                setFormClass('');
                setFormSection('');
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={20} color="#003d9b" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Create Conversation Topic</Text>
              <Text style={styles.headerSubtitle}>AI Voice Practice Setup</Text>
            </View>
          </View>
          <View style={styles.badgePill}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgePillText}>NEW TOPIC</Text>
          </View>
        </View>

        {/* ── SCROLLABLE FORM CONTENT (Cleanly occupies available space above fixed Bottom Navigation) ── */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.createScreenScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Card */}
          <View style={styles.createFormCard}>
            {/* Topic Title */}
            <View style={styles.formField}>
              <View style={styles.labelRow}>
                <Text style={styles.formLabel}>Topic Title</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TextInput
                style={styles.formInput}
                placeholder="Enter topic title (e.g. My School, Family)..."
                placeholderTextColor="#94A3B8"
                value={formTopic}
                onChangeText={setFormTopic}
              />
            </View>

            {/* Class Selection */}
            <View style={[styles.formField, { marginTop: 18 }]}>
              <View style={styles.labelRow}>
                <Text style={styles.formLabel}>Target Class</Text>
                <Text style={styles.requiredStar}>*</Text>
              </View>
              <TouchableOpacity
                style={styles.formSelectBox}
                onPress={() => {
                  setShowClassDD(!showClassDD);
                  setShowSectionDD(false);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.selectTextRow}>
                  <MaterialIcons name="groups" size={18} color={formClass ? '#0047CC' : '#94A3B8'} style={{ marginRight: 8 }} />
                  <Text style={[styles.formSelectText, !formClass && styles.formSelectPlaceholder]}>
                    {formClass || 'Select a class...'}
                  </Text>
                </View>
                <MaterialIcons name={showClassDD ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={22} color="#0047CC" />
              </TouchableOpacity>

              {showClassDD && (
                <View style={styles.formDropdownOptions}>
                  {CLASSES.map((c) => {
                    const isSelected = formClass === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                        onPress={() => {
                          setFormClass(c);
                          setShowClassDD(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>
                          {c}
                        </Text>
                        {isSelected && <MaterialIcons name="check" size={18} color="#0047CC" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Section Selection */}
            <View style={[styles.formField, { marginTop: 18 }]}>
              <View style={styles.labelRow}>
                <Text style={styles.formLabel}>Section(s)</Text>
                <Text style={styles.requiredStar}>*</Text>
                {formSection ? (
                  <Text style={styles.selectedCountText}>
                    {formSection.split(',').filter(Boolean).length} Selected
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.formSelectBox}
                onPress={() => {
                  setShowSectionDD(!showSectionDD);
                  setShowClassDD(false);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.selectTextRow}>
                  <MaterialIcons name="bookmark" size={18} color={formSection ? '#0047CC' : '#94A3B8'} style={{ marginRight: 8 }} />
                  <Text style={[styles.formSelectText, !formSection && styles.formSelectPlaceholder]} numberOfLines={1}>
                    {formSection ? `Section ${formSection}` : 'Select section(s)...'}
                  </Text>
                </View>
                <MaterialIcons name={showSectionDD ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={22} color="#0047CC" />
              </TouchableOpacity>

              {showSectionDD && (
                <View style={styles.formDropdownOptions}>
                  {/* Select All Option */}
                  <TouchableOpacity
                    style={[
                      styles.formDropdownItem,
                      { borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#F8FAFC' },
                    ]}
                    onPress={() => {
                      const currentList = formSection ? formSection.split(',').map((s) => s.trim()).filter(Boolean) : [];
                      if (currentList.length === SECTIONS.length) {
                        setFormSection('');
                      } else {
                        setFormSection(SECTIONS.join(', '));
                      }
                    }}
                  >
                    <Text style={[styles.formDropdownItemText, { fontWeight: '900', color: '#0047CC' }]}>
                      {formSection && formSection.split(',').map((s) => s.trim()).filter(Boolean).length === SECTIONS.length
                        ? '✓ Deselect All'
                        : '✦ Select All Sections'}
                    </Text>
                  </TouchableOpacity>

                  {SECTIONS.map((s) => {
                    const currentList = formSection ? formSection.split(',').map((item) => item.trim()).filter(Boolean) : [];
                    const isSelected = currentList.includes(s);
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                        onPress={() => {
                          let updated: string[];
                          if (isSelected) {
                            updated = currentList.filter((item) => item !== s);
                          } else {
                            updated = [...currentList, s];
                          }
                          setFormSection(updated.join(', '));
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>
                          Section {s}
                        </Text>
                        <MaterialIcons
                          name={isSelected ? 'check-box' : 'check-box-outline-blank'}
                          size={19}
                          color={isSelected ? '#0047CC' : '#94A3B8'}
                        />
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={styles.doneSelectingBtn}
                    onPress={() => setShowSectionDD(false)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.doneSelectingText}>Done Selecting</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Action Buttons (Always 100% visible and accessible above fixed bottom nav) */}
            <View style={[styles.modalBtnRow, { marginTop: 24 }]}>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreate} activeOpacity={0.85}>
                <LinearGradient
                  colors={['#0066FF', '#003D9B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalSubmitGrad}
                >
                  <MaterialIcons name="check-circle" size={18} color="#fff" style={{ marginRight: 7 }} />
                  <Text style={styles.modalSubmitText}>CREATE TOPIC</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setIsCreateVisible(false);
                  setFormTopic('');
                  setFormClass('');
                  setFormSection('');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
        <TouchableOpacity style={styles.createButtonHeader} onPress={() => setIsCreateVisible(true)} activeOpacity={0.85}>
          <LinearGradient colors={['#0066FF', '#003D9B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.createBtnGradient}>
            <MaterialIcons name="add-circle" size={19} color="#ffffff" style={{ marginRight: 5 }} />
            <Text style={styles.createBtnText}>Create</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── MINIMAL LUXURY HERO CARD ── */}
        <LinearGradient 
          colors={['#F8FAFC', '#F0F9FF', '#EEF2FF']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }} 
          style={styles.heroCard}
        >
          {/* Floating glowing subtle spheres */}
          <View pointerEvents="none" style={[styles.heroAuroraSphere, { backgroundColor: '#38BDF8', width: 200, height: 200, top: -70, right: -40, opacity: 0.12 }]} />
          <View pointerEvents="none" style={[styles.heroAuroraSphere, { backgroundColor: '#10B981', width: 120, height: 120, bottom: -40, left: 10, opacity: 0.08 }]} />

          {/* Sound waves vectors */}
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgLinearGradient id="siriWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#0284C7" stopOpacity={0} />
                <Stop offset="50%" stopColor="#0284C7" stopOpacity={0.12} />
                <Stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </SvgLinearGradient>
              <SvgLinearGradient id="siriWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#10B981" stopOpacity={0} />
                <Stop offset="50%" stopColor="#0284C7" stopOpacity={0.08} />
                <Stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Path d="M -20 50 Q 70 25 170 50 T 360 50 T 540 50" stroke="url(#siriWaveGrad1)" strokeWidth={2.4} fill="none" />
            <Path d="M 0 58 Q 90 75 180 58 T 380 58 T 580 58" stroke="url(#siriWaveGrad2)" strokeWidth={1.2} fill="none" opacity={0.6} />
          </Svg>

          {/* Active Voice wave visualizer orb */}
          <PremiumVoiceVisualizer />

          {/* Hero Content Stack */}
          <View style={styles.heroBodyLayout}>
            <Text style={styles.luxuryHeroTitle}>Vocal Studio</Text>
          </View>
        </LinearGradient>



        {/* ── LIST HEADER ── */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Conversation Topics</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length} Topics</Text>
          </View>
        </View>

        {/* ── TOPIC CARDS (WOW FACTOR REDESIGN) ── */}
        {/* ── TOPIC CARDS (MINIMAL & TEACHER-FRIENDLY REDESIGN) ── */}
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialIcons name="mic-off" size={40} color="#BFDBFE" />
            <Text style={styles.emptyTitle}>No topics found</Text>
            <Text style={styles.emptyDesc}>Tap Create to add a new speaking topic</Text>
          </View>
        ) : (
          filtered.map((item) => {
            return (
              <View key={item.id} style={styles.topicCard}>
                <View style={styles.cardBody}>
                  {/* Card Header Row */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardHeaderLeftGroup}>
                      <View style={styles.micIconBox}>
                        <LinearGradient
                          colors={['#0066FF', '#0044B2']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.micIconGrad}
                        >
                          <MaterialIcons name="mic" size={17} color="#ffffff" />
                        </LinearGradient>
                      </View>
                      
                      <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={styles.cardTopicTitle} numberOfLines={1}>{item.topic}</Text>
                      </View>
                    </View>
                    
                    {/* Equalizer Visualizer inside Pill Badge */}
                    <View style={styles.waveformBadge}>
                      <CardWaveformAnalyzer color="#0052cc" />
                    </View>
                  </View>

                  {/* Inner Metadata Cards (Class & Section) */}
                  <View style={styles.fieldsRow}>
                    <View style={styles.fieldChipClass}>
                      <View style={styles.classOrbBox}>
                        <MaterialIcons name="school" size={16} color="#0052cc" />
                      </View>
                      <View style={{ marginLeft: 9, flex: 1 }}>
                        <Text style={styles.fieldChipLabelClass}>CLASS</Text>
                        <Text style={styles.fieldChipValue} numberOfLines={1}>{item.className}</Text>
                      </View>
                    </View>

                    <View style={styles.fieldSep} />

                    <View style={styles.fieldChipSection}>
                      <View style={styles.sectionOrbBox}>
                        <MaterialIcons name="meeting-room" size={16} color="#059669" />
                      </View>
                      <View style={{ marginLeft: 9, flex: 1 }}>
                        <Text style={styles.fieldChipLabelSection}>SECTION</Text>
                        <Text style={styles.fieldChipValue} numberOfLines={1}>Section {item.section}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={styles.cardDivider} />

                  {/* Action Buttons */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.btnPreview}
                      onPress={() => openPreview(item)}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={['#0066FF', '#0044B2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <MaterialIcons name="play-arrow" size={18} color="#fff" style={{ marginRight: 4, zIndex: 2 }} />
                      <Text style={styles.btnPrimaryText}>Preview</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnEdit}
                      onPress={() => openEdit(item)}
                      activeOpacity={0.8}
                    >
                      <MaterialIcons name="edit" size={15} color="#0052cc" style={{ marginRight: 4 }} />
                      <Text style={styles.btnSecText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => handleDelete(item)}
                      activeOpacity={0.8}
                    >
                      <MaterialIcons name="delete-outline" size={16} color="#E11D48" style={{ marginRight: 4 }} />
                      <Text style={styles.btnDangerText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })
        )}

        {/* Bottom Status Pill Badge */}
        {topics.length > 0 && (
          <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 24 }}>
            <View style={{
              backgroundColor: '#F8FAFC',
              borderWidth: 1,
              borderColor: '#E2E8F0',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}>
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#475569' }}>
                All {topics.length} topics loaded
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ════ DELETE CONFIRMATION DIALOG ════ */}
      {itemToDelete && (
        <View style={styles.deleteDialogOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setItemToDelete(null)}
          />
          <View style={styles.deleteDialogBox}>
            {/* Red Alert Orb */}
            <View style={styles.deleteIconOrb}>
              <MaterialIcons name="delete-forever" size={32} color="#E11D48" />
            </View>

            <Text style={styles.deleteDialogTitle}>Delete Topic?</Text>
            <Text style={styles.deleteDialogMessage}>
              Are you sure you want to permanently delete{' '}
              <Text style={{ fontWeight: '800', color: '#0F172A' }}>"{itemToDelete.topic}"</Text>? This action cannot be undone.
            </Text>

            <View style={styles.deleteDialogActions}>
              <TouchableOpacity
                style={styles.deleteConfirmBtn}
                onPress={() => {
                  const idToRemove = itemToDelete.id;
                  setTopics(prev => prev.filter(t => t.id !== idToRemove));
                  setItemToDelete(null);
                }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#E11D48', '#BE123C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.deleteConfirmGrad}
                >
                  <MaterialIcons name="delete" size={17} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.deleteConfirmText}>Delete Permanently</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteCancelBtn}
                onPress={() => setItemToDelete(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ── PREVIEW SCREEN STYLES (MATCHING REFERENCE IMAGE + ULTRA-PREMIUM CHATGPT/GEMINI POLISH) ──
  previewFullScreen: {
    flex: 1,
    backgroundColor: '#E6F4F8', // Soft crisp blue-tint canvas inspired by reference image
  },
  previewHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', // Clean aesthetic light background
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  previewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  previewBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  previewBotAvatarWrapper: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  previewBotAvatarGrad: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
  },
  onlineDotPulse: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  previewBotTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    gap: 4,
  },
  onlineDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#10B981',
  },
  onlineBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
  },
  headerTopicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    maxWidth: 130,
  },
  headerTopicPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0052CC',
  },

  // Status Strip
  previewStatusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  statusIndicatorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusPulseOrb: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusStripLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  miniEqualizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 2.5,
  },
  miniEqualizerBar: {
    width: 2.5,
    borderRadius: 1.25,
  },

  // Chat Feed
  previewChatFeed: {
    flex: 1,
    backgroundColor: '#EAF4F8',
  },
  previewChatFeedContent: {
    padding: 16,
    paddingBottom: 24,
  },

  // Message Bubbles
  msgBubbleRow: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  msgBubbleRowAI: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  msgBubbleRowUser: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  msgAiAvatarSmall: {
    width: 32,
    height: 32,
    marginRight: 9,
    marginTop: 2,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  msgAiAvatarSmallGrad: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
  },

  // AI Message Card (Modern SaaS Luxury Box)
  msgBubbleCardAI: {
    maxWidth: '84%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderTopLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  msgBubbleHeaderAI: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  aiNameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  aiNameBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6366F1',
    letterSpacing: 0.2,
  },
  aiMsgMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  msgTimeTextAI: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  audioPlayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 10,
    gap: 3,
  },
  audioPlayText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6366F1',
  },
  msgBodyTextAI: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 22,
  },

  // User Message Card (Deep Royal Gradient)
  msgBubbleCardUser: {
    maxWidth: '84%',
    borderRadius: 20,
    borderTopRightRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 13,
    shadowColor: '#0047CC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  msgBubbleHeaderUser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    gap: 8,
  },
  msgSenderNameUser: {
    fontSize: 11,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.3,
  },
  msgTimeTextUser: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  msgBodyTextUser: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 22,
  },

  // Thinking Card
  thinkingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    gap: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  thinkingPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
  thinkingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },

  // Suggestion Chips Section
  suggestionChipsSection: {
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  suggestionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 9,
  },
  suggestionChipsHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#6366F1',
    letterSpacing: 0.6,
  },
  suggestionChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7.5,
  },
  suggestionChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },

  // Bottom Control Bar
  previewBottomControlBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.select({ ios: 32, default: 16 }),
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  previewInputBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingLeft: 16,
    paddingRight: 6,
    height: 50,
  },
  previewTextInputField: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0F172A',
    height: '100%',
    ...Platform.select({ web: { outlineStyle: 'none' } as any }),
  },
  previewMicIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  previewMicIconButtonActive: {
    backgroundColor: '#EF4444',
    borderColor: '#DC2626',
  },
  previewSendIconButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  previewSendBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 20,
  },
  previewSendBtnLabel: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  // ── MAIN LIST & CARDS STYLES ──
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#041b3c',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 1,
  },
  createButtonHeader: {
    borderRadius: 24,
    shadowColor: '#0052CC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 6,
  },
  createBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  createBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  // Create Screen Styles
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0066FF',
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0066FF',
    letterSpacing: 0.5,
  },
  createScreenScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  createFormCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  scrollContent: { paddingBottom: 40 },

  // Minimal Luxury Hero Card
  heroCard: {
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 88,
    justifyContent: 'center',
  },
  heroAuroraSphere: {
    position: 'absolute',
    borderRadius: 999,
  },
  heroBodyLayout: {
    width: '64%',
    zIndex: 2,
    justifyContent: 'center',
  },
  luxuryHeroTitle: {
    fontSize: 17.5,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },

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
    right: -10,
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

  // Topic Card (Ultra-Sharp, Compact & Modern Premium)
  topicCard: {
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 13,
    borderWidth: 1.2,
    borderColor: '#EEF2F6',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardBody: { position: 'relative' },

  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 11, justifyContent: 'space-between' },
  cardHeaderLeftGroup: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  micIconBox: {
    width: 36, height: 36, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0066FF', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
  },
  micIconGrad: { width: '100%', height: '100%', borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cardTopicTitle: { fontSize: 15.5, fontWeight: '800', color: '#0F172A', letterSpacing: -0.2 },

  // Equalizer visualizer Pill
  waveformBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveformContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 18, gap: 2 },
  wavePillar: { width: 2.8, borderRadius: 1.4 },

  // Inner Metadata Cards (Class & Section)
  fieldsRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 11 },
  fieldChipClass: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingVertical: 7.5, paddingHorizontal: 9,
    backgroundColor: '#F0F7FF',
    borderWidth: 1.2, borderColor: '#DBEAFE',
  },
  classOrbBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
  fieldChipLabelClass: { fontSize: 9, fontWeight: '800', color: '#0052cc', letterSpacing: 0.5 },

  fieldChipSection: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, paddingVertical: 7.5, paddingHorizontal: 9,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.2, borderColor: '#DCFCE7',
  },
  sectionOrbBox: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
  fieldChipLabelSection: { fontSize: 9, fontWeight: '800', color: '#059669', letterSpacing: 0.5 },

  fieldChipValue: { fontSize: 12.5, fontWeight: '900', color: '#0F172A', marginTop: 1 },
  fieldSep:       { width: 8 },

  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 11 },

  actionsRow: { flexDirection: 'row', gap: 7 },
  btnPreview: {
    flex: 1.15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 36,
    borderRadius: 9,
    overflow: 'hidden',
    shadowColor: '#0066FF', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
  },
  btnEdit: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 36,
    backgroundColor: '#F8FAFC', borderRadius: 9,
    borderWidth: 1.2, borderColor: '#CBD5E1',
  },
  btnDelete: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 36,
    backgroundColor: '#FFF1F2', borderRadius: 9,
    borderWidth: 1.2, borderColor: '#FECDD3',
  },
  btnPrimaryText: { fontSize: 12, fontWeight: '800', color: '#fff', letterSpacing: 0.2, zIndex: 2 },
  btnSecText:     { fontSize: 12, fontWeight: '800', color: '#0052cc', letterSpacing: 0.2 },
  btnDangerText:  { fontSize: 12, fontWeight: '800', color: '#E11D48', letterSpacing: 0.2 },

  // Modals
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '82%',
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
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

  // Form field styles (matching ActivityScreen design)
  formField: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requiredStar: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '900',
  },
  selectedCountText: {
    fontSize: 11,
    color: '#0047CC',
    fontWeight: '800',
    marginLeft: 'auto',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
    ...Platform.select({ web: { outlineStyle: 'none' } as any }),
  },
  formSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  selectTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  formSelectText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  formSelectPlaceholder: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 14.5,
  },
  formDropdownOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  formDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  formDropdownItemActive: {
    backgroundColor: '#EFF6FF',
  },
  formDropdownItemText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#475569',
  },
  formDropdownItemTextActive: {
    color: '#0047CC',
    fontWeight: '900',
  },
  doneSelectingBtn: {
    backgroundColor: '#0047CC',
    paddingVertical: 10,
    alignItems: 'center',
    margin: 10,
    borderRadius: 10,
  },
  doneSelectingText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12.5,
  },

  fLabel:       { fontSize: 12, fontWeight: '800', color: '#334155', marginBottom: 7, letterSpacing: 0.3 },
  fInput: {
    height: 48, borderWidth: 1.5, borderColor: '#CBD5E1',
    borderRadius: 12, paddingHorizontal: 14,
    fontSize: 14, fontWeight: '700', color: '#0F172A', backgroundColor: '#F8FAFC',
    ...Platform.select({ web: { outlineStyle: 'none' } as any }),
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

  // Delete Confirmation Dialog Styles
  deleteDialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  deleteDialogBox: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deleteIconOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFF1F2',
  },
  deleteDialogTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  deleteDialogMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 22,
    paddingHorizontal: 6,
  },
  deleteDialogActions: {
    width: '100%',
    gap: 10,
  },
  deleteConfirmBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteConfirmGrad: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deleteCancelBtn: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  deleteCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});
