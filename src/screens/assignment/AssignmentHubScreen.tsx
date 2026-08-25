import React, { useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Pressable,
  Image,
  Animated,
  useWindowDimensions,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Rect, Path, Line, G, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

interface AssignmentHubScreenProps {
  navigation: any;
}

// ── REUSABLE MODULE ICON COMPONENT ──
interface ModuleIconProps {
  iconName: string;
  accentColor: string;
  bgColor: string;
}
const ModuleIcon: React.FC<ModuleIconProps> = ({ iconName, accentColor, bgColor }) => {
  return (
    <View style={styles.iconOuterWrapper} pointerEvents="none">
      {/* Soft background ambient glow for the icon */}
      <View style={[styles.iconInnerGlow, { backgroundColor: `${accentColor}18` }]} />
      
      {/* Main glass-like icon plate */}
      <View style={[styles.iconGlassContainer, { borderColor: `${accentColor}15` }]}>
        <LinearGradient
          colors={['#ffffff', `${accentColor}10`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <MaterialIcons name={iconName as any} size={22} color={accentColor} />
        {/* Glass reflection line */}
        <View style={styles.iconGlassShine} />
      </View>
    </View>
  );
};

// ── REUSABLE CATEGORY BADGE COMPONENT ──
interface CategoryBadgeProps {
  label: string;
  accentColor: string;
}
const CategoryBadge: React.FC<CategoryBadgeProps> = ({ label, accentColor }) => {
  return (
    <View style={[styles.badgeCapsule, { backgroundColor: `${accentColor}08`, borderColor: `${accentColor}18` }]} pointerEvents="none">
      <View style={[styles.badgeDot, { backgroundColor: accentColor }]} />
      <Text style={[styles.badgeText, { color: accentColor }]}>{label}</Text>
    </View>
  );
};

// ── REUSABLE ACTION BUTTON COMPONENT ──
interface ActionButtonProps {
  accentColor: string;
}
const ActionButton: React.FC<ActionButtonProps> = ({ accentColor }) => {
  const gradientColors = accentColor === '#F59E0B' ? ['#FBBF24', '#D97706']
                       : accentColor === '#7C3AED' ? ['#A78BFA', '#6D28D9']
                       : accentColor === '#10B981' ? ['#34D399', '#059669']
                       : ['#60A5FA', '#1D4ED8'];

  return (
    <View style={[styles.actionOrbitalTrack, { borderColor: `${accentColor}18` }]} pointerEvents="none">
      <View style={[styles.actionCircleInner, { shadowColor: accentColor }]} pointerEvents="none">
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Glass reflection line */}
        <View style={styles.btnShineLine} pointerEvents="none" />
        <MaterialIcons name="arrow-forward" size={12} color="#ffffff" />
      </View>
    </View>
  );
};

// ── REUSABLE PREMIUM CARD COMPONENT WITH SPRING ANIMATIONS ──
interface ModuleCardProps {
  item: {
    title: string;
    desc: string;
    icon: string;
    color: string;
    bgColor: string;
    badge: string;
    stats: string;
    target: string;
  };
  onPress: () => void;
}
const ModuleCard: React.FC<ModuleCardProps> = React.memo(({ item, onPress }) => {
  const { width } = useWindowDimensions();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 20,
        bounciness: 3,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 15,
        bounciness: 4,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Interpolate dynamic shadow glow projection
  const animatedShadowStyle = {
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.08, 0.16]
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 18]
    }),
    transform: Platform.OS === 'web' ? [] : [{ scale: scaleAnim }] // Disable scaling on web to prevent touchcancel in simulators
  };

  // Interpolate watermark floating parallax transform
  const animatedWatermarkStyle = {
    transform: [
      { translateY: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
      { scale: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }
    ]
  };

  const cardBgColor = item.color === '#F59E0B' ? '#FFFDF6' 
                    : item.color === '#7C3AED' ? '#FAF8FF'
                    : item.color === '#10B981' ? '#F3FDF8'
                    : '#F4F9FF';
  const cardBorderColor = `${item.color}22`;

  const renderCardWatermark = () => {
    const size = 110;
    if (item.title === 'Activity') {
      return (
        <Svg width={size} height={size} style={styles.cardWatermarkSvg}>
          {/* Concentric orbit tracks */}
          <Circle cx={size - 25} cy={size - 25} r={32} stroke={item.color} strokeWidth={1} strokeDasharray="3,3" fill="none" opacity={0.22} />
          <Circle cx={size - 25} cy={size - 25} r={18} stroke={item.color} strokeWidth={0.8} fill="none" opacity={0.16} />
          <Path d={`M 40 72 A 26 26 0 0 1 82 48`} stroke={item.color} strokeWidth={1} strokeDasharray="4,4" fill="none" opacity={0.25} />
          
          {/* Spiraling launch trajectory trail */}
          <Path d={`M 26 84 Q 44 48 76 68 T 88 34`} stroke={item.color} strokeWidth={1.2} fill="none" opacity={0.28} />
          
          {/* Tiny flying rocket arrowhead silhouette on the path */}
          <Path d="M 86 36 L 91 28 L 82 31 Z" fill={item.color} opacity={0.65} />
          
          {/* Floating space dust / sparkles */}
          <Circle cx={size - 45} cy={size - 30} r={1.5} fill={item.color} opacity={0.35} />
          <Circle cx={size - 10} cy={size - 42} r={2.5} fill={item.color} opacity={0.3} />
          <Circle cx={size - 68} cy={size - 22} r={1} fill={item.color} opacity={0.2} />

          {/* Premium four-point vector stars */}
          <Path d={`M 66 36 L 68 32 L 70 36 L 74 38 L 70 40 L 68 44 L 66 40 L 62 38 Z`} fill={item.color} opacity={0.38} />
          <Path d={`M 38 68 L 40 64 L 42 68 L 46 70 L 42 72 L 40 76 L 38 72 L 34 70 Z`} fill={item.color} opacity={0.35} />
        </Svg>
      );
    }
    if (item.title === 'Reading Coach') {
      return (
        <Svg width={size} height={size} style={styles.cardWatermarkSvg}>
          <G transform="rotate(4, 60, 65)">
            {/* Third underpage layer */}
            <Path d="M56 58 L28 58 A3 3 0 0 0 25 61 L25 84 A3 3 0 0 0 28 87 L56 87 Z" stroke={item.color} strokeWidth={1} fill="none" opacity={0.08} />
            <Path d="M56 58 L84 58 A3 3 0 0 1 87 61 L87 84 A3 3 0 0 1 84 87 L56 87 Z" stroke={item.color} strokeWidth={1} fill="none" opacity={0.08} />

            {/* Second underpage layer */}
            <Path d="M58 55 L30 55 A3 3 0 0 0 27 58 L27 81 A3 3 0 0 0 30 84 L58 84 Z" stroke={item.color} strokeWidth={1.2} fill="none" opacity={0.16} />
            <Path d="M58 55 L86 55 A3 3 0 0 1 89 58 L89 81 A3 3 0 0 1 86 84 L58 84 Z" stroke={item.color} strokeWidth={1.2} fill="none" opacity={0.16} />
            
            {/* Front main page sheet */}
            <Path d="M60 52 L32 52 A3 3 0 0 0 29 55 L29 78 A3 3 0 0 0 32 81 L60 81 Z" stroke={item.color} strokeWidth={1.5} fill="none" opacity={0.3} />
            <Path d="M60 52 L88 52 A3 3 0 0 1 91 55 L91 78 A3 3 0 0 1 88 81 L60 81 Z" stroke={item.color} strokeWidth={1.5} fill="none" opacity={0.3} />
            
            {/* Bookmark ribbon hanging down the center spine */}
            <Path d="M 59.2 52 L 59.2 87 L 61 89 L 62.8 87 L 62.8 52 Z" fill="#003d9b" opacity={0.55} />
            <Line x1={60} y1={52} x2={60} y2={81} stroke={item.color} strokeWidth={1.5} opacity={0.4} />
            
            {/* Text lines */}
            <Line x1={36} y1={59} x2={54} y2={59} stroke={item.color} strokeWidth={1.2} opacity={0.2} />
            <Line x1={36} y1={66} x2={50} y2={66} stroke={item.color} strokeWidth={1.2} opacity={0.2} />
            <Line x1={36} y1={73} x2={54} y2={73} stroke={item.color} strokeWidth={1.2} opacity={0.2} />
            <Line x1={66} y1={59} x2={84} y2={59} stroke={item.color} strokeWidth={1.2} opacity={0.2} />
            <Line x1={66} y1={66} x2={80} y2={66} stroke={item.color} strokeWidth={1.2} opacity={0.2} />
            <Line x1={66} y1={73} x2={84} y2={73} stroke={item.color} strokeWidth={1.2} opacity={0.2} />
          </G>

          {/* Floating four-point vector magic stars */}
          <Path d={`M ${size - 54} ${size - 76} L ${size - 52} ${size - 81} L ${size - 50} ${size - 76} L ${size - 45} ${size - 74} L ${size - 50} ${size - 72} L ${size - 52} ${size - 67} L ${size - 54} ${size - 72} L ${size - 59} ${size - 74} Z`} fill={item.color} opacity={0.35} />
          <Path d={`M ${size - 28} ${size - 68} L ${size - 26} ${size - 72} L ${size - 24} ${size - 68} L ${size - 20} ${size - 66} L ${size - 24} ${size - 64} L ${size - 26} ${size - 60} L ${size - 28} ${size - 64} L ${size - 32} ${size - 66} Z`} fill={item.color} opacity={0.4} />
        </Svg>
      );
    }
    if (item.title === 'MCQ Builder') {
      return (
        <Svg width={size} height={size} style={styles.cardWatermarkSvg}>
          <G transform="rotate(-6, 50, 56)">
            {/* Underlying shadow board layer */}
            <Rect x={27} y={32} width={40} height={52} rx={4} stroke={item.color} strokeWidth={1} fill="none" opacity={0.12} />
            
            {/* Main clipboard sheet */}
            <Rect x={30} y={30} width={40} height={52} rx={4} stroke={item.color} strokeWidth={1.5} fill="none" opacity={0.3} />
            
            {/* Top clip block */}
            <Rect x={45} y={26} width={10} height={4} rx={1} stroke={item.color} strokeWidth={1.2} fill="none" opacity={0.35} />
            
            {/* Question 1: text line + choices A, B, C */}
            <Line x1={36} y1={38} x2={56} y2={38} stroke={item.color} strokeWidth={1.2} opacity={0.25} />
            <Circle cx={38} cy={45} r={2} stroke={item.color} strokeWidth={1} fill="none" opacity={0.3} />
            <Circle cx={46} cy={45} r={2} fill="#0D9488" opacity={0.65} />
            <Circle cx={54} cy={45} r={2} stroke={item.color} strokeWidth={1} fill="none" opacity={0.3} />
            <Circle cx={62} cy={45} r={2} stroke={item.color} strokeWidth={1} fill="none" opacity={0.3} />
            
            {/* Question 2: text line + choices A, B, C */}
            <Line x1={36} y1={52} x2={60} y2={52} stroke={item.color} strokeWidth={1.2} opacity={0.25} />
            <Circle cx={38} cy={59} r={2} stroke={item.color} strokeWidth={1} fill="none" opacity={0.3} />
            <Circle cx={46} cy={59} r={2} stroke={item.color} strokeWidth={1} fill="none" opacity={0.3} />
            <Circle cx={54} cy={59} r={2} fill="#0D9488" opacity={0.65} />
            <Circle cx={62} cy={59} r={2} stroke={item.color} strokeWidth={1} fill="none" opacity={0.3} />

            {/* Question 3: text line + choices A, B, C */}
            <Line x1={36} y1={66} x2={50} y2={66} stroke={item.color} strokeWidth={1.2} opacity={0.25} />
            <Circle cx={38} cy={73} r={2} fill="#0D9488" opacity={0.65} />
            <Circle cx={46} cy={73} r={2} stroke={item.color} strokeWidth={1} fill="none" opacity={0.3} />
            <Circle cx={54} cy={73} r={2} stroke={item.color} strokeWidth={1} fill="none" opacity={0.3} />
          </G>
          
          {/* Floating emerald diamond particles */}
          <Path d={`M ${size - 22} ${size - 48} L ${size - 19} ${size - 51} L ${size - 22} ${size - 54} L ${size - 25} ${size - 51} Z`} fill={item.color} opacity={0.35} />
          
          {/* Floating Checkmark Badge in background */}
          <Circle cx={76} cy={72} r={6.5} stroke="#0D9488" strokeWidth={1.2} fill="none" opacity={0.28} />
          <Path d="M 73.5 72 L 75.5 74 L 78.5 70" stroke="#0D9488" strokeWidth={1.2} fill="none" opacity={0.6} />
        </Svg>
      );
    }
    // Speaking Buddy (Ultra-Luxury Glowing Studio Mic + Gradient Equalizer & Liquid Wave Sweeps)
    return (
      <Svg width={size} height={size} style={styles.cardWatermarkSvg}>
        <Defs>
          <SvgLinearGradient id="sbEqGrad1" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0%" stopColor="#003d9b" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
          </SvgLinearGradient>
          <SvgLinearGradient id="sbEqGrad2" x1="0" y1="1" x2="0" y2="0">
            <Stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#00D8F6" stopOpacity="0.9" />
          </SvgLinearGradient>
          <SvgLinearGradient id="sbWaveGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#0284C7" stopOpacity="0.1" />
            <Stop offset="50%" stopColor="#00D8F6" stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#003d9b" stopOpacity="0.2" />
          </SvgLinearGradient>
        </Defs>

        {/* Outer Pulsing Radial Ring */}
        <Circle cx={72} cy={44} r={28} stroke="#0284C7" strokeWidth={1} strokeDasharray="3,3" fill="none" opacity={0.25} />
        <Circle cx={72} cy={44} r={18} fill="#0284C7" opacity={0.08} />

        {/* Sleek Studio Condenser Microphone Capsule */}
        <G transform="rotate(8, 72, 44)">
          <Rect x={67} y={32} width={10} height={18} rx={5} stroke="#0284C7" strokeWidth={1.5} fill="none" opacity={0.65} />
          <Line x1={67} y1={38} x2={77} y2={38} stroke="#0284C7" strokeWidth={1} opacity={0.4} />
          <Line x1={67} y1={42} x2={77} y2={42} stroke="#0284C7" strokeWidth={1} opacity={0.4} />
          <Circle cx={72} cy={46} r={1} fill="#00D8F6" opacity={0.9} />
          <Path d="M 63 40 A 9 9 0 0 0 81 40" stroke="#0284C7" strokeWidth={1.5} fill="none" opacity={0.55} />
          <Line x1={72} y1={49} x2={72} y2={56} stroke="#0284C7" strokeWidth={1.5} opacity={0.55} />
          <Line x1={66} y1={56} x2={78} y2={56} stroke="#0284C7" strokeWidth={1.5} opacity={0.55} />
        </G>

        {/* 5 Gradient Equalizer Pillars (positioned left to avoid button overlap) */}
        <Rect x={18} y={48} width={3.5} height={14} rx={1.75} fill="url(#sbEqGrad1)" />
        <Rect x={25} y={40} width={3.5} height={22} rx={1.75} fill="url(#sbEqGrad2)" />
        <Rect x={32} y={32} width={4} height={30} rx={2} fill="url(#sbEqGrad1)" />
        <Rect x={39} y={38} width={3.5} height={24} rx={1.75} fill="url(#sbEqGrad2)" />
        <Rect x={46} y={44} width={3.5} height={18} rx={1.75} fill="url(#sbEqGrad1)" />

        {/* Organic Flowing Fluid Siri Wave Sweeps */}
        <Path d="M 8 72 Q 35 48 65 72 T 100 72" stroke="url(#sbWaveGrad)" strokeWidth={2} fill="none" />
        <Path d="M 4 76 Q 38 42 68 76 T 104 76" stroke="#00D8F6" strokeWidth={1} fill="none" opacity={0.3} />

        {/* Cyber Sparkle Vector Stars */}
        <Path d={`M 15 32 L 17 27 L 19 32 L 24 34 L 19 36 L 17 41 L 15 36 L 10 34 Z`} fill="#00D8F6" opacity={0.55} />
        <Path d={`M 54 22 L 55.5 18 L 57 22 L 61 23.5 L 57 25 L 55.5 29 L 54 25 L 50 23.5 Z`} fill="#0284C7" opacity={0.45} />

        {/* Ambient Floating Audio Glow Dots */}
        <Circle cx={12} cy={54} r={1.5} fill="#0284C7" opacity={0.4} />
        <Circle cx={86} cy={28} r={2} fill="#00D8F6" opacity={0.5} />
      </Svg>
    );
  };

  const cardGradientColors = item.color === '#2563EB' ? ['#ffffff', '#EFF6FF', '#DBEAFE'] 
                           : item.color === '#003d9b' ? ['#ffffff', '#F0F5FF', '#D9E6FF']
                           : item.color === '#0D9488' ? ['#ffffff', '#F0FDFA', '#CCFBF1']
                           : ['#ffffff', '#F0F9FF', '#E0F2FE'];

  const dynamicCardWidth = width >= 1024 ? '31.5%' : width >= 600 ? '48.5%' : '100%';

  return (
    <Animated.View style={[
      styles.moduleCard, 
      animatedShadowStyle, 
      { shadowColor: item.color, borderColor: cardBorderColor, width: dynamicCardWidth }
    ]}>
      <Pressable
        style={styles.cardTouchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        
        accessible={true}
        accessibilityRole="button"
      >
        {/* Dynamic Luminous Gradient Background */}
        <LinearGradient
          colors={cardGradientColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {/* Left Accent Border strip */}
        <View style={[styles.cardLeftBorder, { backgroundColor: item.color }]} pointerEvents="none" />

        {/* Subtle glass gloss top reflection */}
        <View style={styles.cardTopShine} pointerEvents="none" />

        {/* Ambient halo glow behind the icon plate */}
        <View style={[styles.iconHaloGlow1, { backgroundColor: item.color }]} pointerEvents="none" />
        <View style={[styles.iconHaloGlow2, { backgroundColor: item.color }]} pointerEvents="none" />

        {/* Dynamic Category Watermark Overlay with float animations */}
        <Animated.View style={[styles.watermarkWrapper, animatedWatermarkStyle]} pointerEvents="none">
          {renderCardWatermark()}
        </Animated.View>

        {/* Diagonal light sheen sweep across the card */}
        <View style={styles.cardLightStreak} pointerEvents="none" />

        {/* Extremely subtle color wash glow in the bottom corner */}
        <View style={[styles.cardCornerGlow, { backgroundColor: `${item.color}06` }]} pointerEvents="none" />

        {/* Card Content Wrapper to offset left padding for accent border */}
        <View style={styles.cardContentWrapper} pointerEvents="none">
          {/* Card Header Row */}
          <View style={styles.cardHeaderRow} pointerEvents="none">
            <ModuleIcon iconName={item.icon} accentColor={item.color} bgColor={item.bgColor} />
            <CategoryBadge label={item.badge} accentColor={item.color} />
          </View>

          {/* Title & Description stack */}
          <View style={styles.cardMainContent} pointerEvents="none">
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
          </View>

          {/* Card Footer Row */}
          <View style={styles.cardFooter} pointerEvents="none">
            {/* Status info pill */}
            <View style={styles.statsPill} pointerEvents="none">
              <View style={[styles.statsDot, { backgroundColor: item.color }]} pointerEvents="none" />
              <Text style={styles.statsText}>{item.stats}</Text>
            </View>
            
            <ActionButton accentColor={item.color} />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});


export const AssignmentHubScreen: React.FC<AssignmentHubScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const cardWidth = (width - 44) / 2; // Exact 2-column width with side padding 16px and 12px gap

  const modules = [
    { 
      title: 'Activity', 
      desc: 'Interactive exercises & custom tasks', 
      icon: 'rocket-launch', 
      color: '#F59E0B', // Amber
      bgColor: 'rgba(245,158,11,0.04)',
      badge: 'Interactive',
      stats: '14 Active',
      target: 'Activity'
    },
    { 
      title: 'Reading Coach', 
      desc: 'AI-assisted reading fluency & speeds', 
      icon: 'auto-stories', 
      color: '#7C3AED', // Purple
      bgColor: 'rgba(124,58,237,0.04)',
      badge: 'Fluency',
      stats: '8 Sessions',
      target: 'ReadingCoach'
    },
    { 
      title: 'MCQ Builder', 
      desc: 'Smart quiz & paper generator tool', 
      icon: 'quiz', 
      color: '#10B981', // Emerald green
      bgColor: 'rgba(16,185,129,0.04)',
      badge: 'Generator',
      stats: '12 Active',
      target: 'MCQBuilder'
    },
    { 
      title: 'Speaking Buddy', 
      desc: 'Conversational AI voice practice logs', 
      icon: 'record-voice-over', 
      color: '#003d9b',
      bgColor: 'rgba(0,61,155,0.04)',
      badge: 'AI Vocal',
      stats: '24 Logs',
      target: 'AISpeakingBuddy'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── High-Fidelity Ambient Background Glow Particles ── */}
      <View style={styles.bgGlow1} pointerEvents="none" />
      <View style={styles.bgGlow2} pointerEvents="none" />
      <View style={styles.bgGlow3} pointerEvents="none" />

      {/* Premium AppBar */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <TouchableOpacity style={styles.appBarButton} activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={20} color="#0052cc" />
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>AE</Text>
            </View>
            <View style={{ marginLeft: 2 }}>
              <Text style={styles.appBarTitle} numberOfLines={1}>Teacher Hub</Text>
              <Text style={styles.appBarSubtitle}>Assignment Portal</Text>
            </View>
          </View>
        </View>

        <View style={styles.appBarRight}>
          <TouchableOpacity style={styles.appBarIconBtn} activeOpacity={0.7}>
            <MaterialIcons name="search" size={19} color="#0052cc" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.appBarIconBtn} activeOpacity={0.7}>
            <View style={styles.notificationWrapper}>
              <MaterialIcons name="notifications-none" size={20} color="#0052cc" />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
          <View style={styles.avatarBorderRing}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP8Fes6Wf9DdkJS-k33oTvc53T3DDc43ixr_T8hwh_pr7sY__yCD2W_7u82_wSOmxr5bh8BWjPCpfyruGFXgrPxwBnxu3LTADJnrW1Pyal-Qu22X6blXtzKTJ1Qq9MSu3lKFCjAiSBqPq2uZCCOWWLFfJ_afO1UosCa0JnsAyjMZTLqPq-T2HkOCTCMpG_U0QCY9cje_vqA6rxLx33tk9UUSBSy0TQyKocGDGSGQPP-eLL9BRYsDjQTw' }}
              style={styles.profilePic}
            />
          </View>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Deep Luxury Header Banner */}
        <View style={styles.welcomeBanner}>
          <View style={styles.cardTopShine} />
          
          {/* Replicated Home Page Aurora System */}
          <View style={styles.auroraGlow1} />
          <View style={styles.auroraGlow2} />
          <View style={styles.auroraGlow3} />
          <View style={styles.lightStreak} />

          <View style={styles.dashboardCardLeft}>
            <View style={styles.portalTag}>
              <MaterialIcons name="workspace-premium" size={11} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.portalTagText}>WORKSPACE PRO</Text>
            </View>
            <Text style={styles.dashboardTitle}>Assignment Hub</Text>
            <Text style={styles.dashboardSubtitle}>Deploy & evaluate custom learning lessons</Text>
          </View>
          <View style={styles.pulseRadar}>
            <View style={styles.radarRing1} />
            <View style={styles.radarRing2} />
            <MaterialIcons name="hub" size={26} color="#fff" />
          </View>
        </View>

        {/* Section title */}
        <View style={styles.sectionHeaderRow}>
          <MaterialIcons name="auto-awesome" size={15} color="#0052cc" style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Interactive Modules</Text>
        </View>

        {/* 2-Column Responsive Grid */}
        <View style={styles.gridContainer}>
          {modules.map((item, index) => (
            <ModuleCard 
              key={index} 
              item={item} 
              onPress={() => {
                console.log('Tapped module card:', item.title, 'Target:', item.target);
                if (item.target.endsWith('Direct')) {
                  // Use root navigator for screens registered in AppNavigator
                  const rootNav = navigation.getParent() ?? navigation;
                  rootNav.navigate(item.target as never);
                } else {
                  navigation.navigate(item.target);
                }
              }}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f9ff', // Light slate-blue premium canvas background
    position: 'relative',
  },
  // Ambient radial glows in canvas background
  bgGlow1: {
    position: 'absolute',
    top: 0,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
    zIndex: 1,
  },
  bgGlow2: {
    position: 'absolute',
    bottom: 120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
    zIndex: 1,
  },
  bgGlow3: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(245, 158, 11, 0.03)',
    zIndex: 1,
  },
  // ===== PREMIUM APP BAR =====
  appBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 82, 204, 0.06)',
    zIndex: 10,
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appBarButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
  },
  appBarIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.08)',
    marginLeft: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#0052cc',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 10.5,
    letterSpacing: 0.5,
  },
  appBarTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.4,
    lineHeight: 17,
  },
  appBarSubtitle: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '700',
    letterSpacing: 0.1,
    marginTop: -1,
  },
  appBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationWrapper: {
    position: 'relative',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6.5,
    height: 6.5,
    borderRadius: 3.25,
    backgroundColor: '#ef4444',
  },
  avatarBorderRing: {
    padding: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
    marginLeft: 8,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
  },
  // ===== CONTENT LAYOUT =====
  scrollContent: {
    padding: 14,
    paddingBottom: 90,
    zIndex: 5,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },
  // ===== DEEP NAVY HEADER BANNER =====
  welcomeBanner: {
    backgroundColor: '#0C3090',
    borderRadius: 28,
    padding: 18,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#071E6E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.38)',
    borderLeftColor: 'rgba(255,255,255,0.18)',
    borderRightColor: 'rgba(255,255,255,0.07)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dashboardCardLeft: {
    flex: 1,
    marginRight: 10,
    zIndex: 2,
  },
  portalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  portalTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.6,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  dashboardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '500',
  },
  pulseRadar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  radarRing1: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  radarRing2: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  auroraGlow1: {
    position: 'absolute',
    right: -70,
    top: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(50,120,255,0.52)',
  },
  auroraGlow2: {
    position: 'absolute',
    left: -55,
    bottom: -55,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(15,55,190,0.55)',
  },
  auroraGlow3: {
    position: 'absolute',
    right: 20,
    top: 40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(80,180,255,0.13)',
  },
  lightStreak: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 80,
    height: 400,
    backgroundColor: 'rgba(255,255,255,0.045)',
    transform: [{ rotate: '-38deg' }],
  },
  // ===== GRID MODULE CARDS =====
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  moduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.05)',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
    minHeight: 140,
  },
  cardTouchable: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    position: 'relative',
  },
  cardTopShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    zIndex: 10,
  },
  cardLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4.5,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    zIndex: 11,
  },
  cardContentWrapper: {
    flex: 1,
    paddingLeft: 4,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  cardCornerGlow: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.8,
  },
  watermarkWrapper: {
    position: 'absolute',
    bottom: -10,
    right: 32,
    zIndex: 1,
  },
  cardWatermarkSvg: {
    opacity: 0.8,
  },
  iconHaloGlow1: {
    position: 'absolute',
    top: -22,
    left: -22,
    width: 84,
    height: 84,
    borderRadius: 42,
    opacity: 0.05,
  },
  iconHaloGlow2: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 52,
    height: 52,
    borderRadius: 26,
    opacity: 0.08,
  },
  cardLightStreak: {
    position: 'absolute',
    top: 0,
    left: -12,
    width: 36,
    height: 220,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    transform: [{ rotate: '-45deg' }],
    opacity: 0.05,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // ── ICON PLATE STYLING ──
  iconOuterWrapper: {
    position: 'relative',
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInnerGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  iconGlassContainer: {
    width: 38,
    height: 38,
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    overflow: 'hidden',
  },
  iconGlassShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  // ── BADGE STYLING ──
  badgeCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // ── MAIN CONTENT ──
  cardMainContent: {
    flex: 1,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.35,
  },
  cardDesc: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    lineHeight: 15,
    marginTop: 4,
  },
  // ── FOOTER STYLING ──
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 82, 204, 0.04)',
    paddingTop: 8,
    marginTop: 4,
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.03)',
  },
  statsDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  statsText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1e293b',
  },
  // ── ACTION BUTTON STYLING ──
  actionOrbitalTrack: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  btnShineLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
  },
});
