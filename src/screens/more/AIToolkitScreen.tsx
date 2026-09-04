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
  useWindowDimensions,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Path, G, Line, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

interface AIToolkitScreenProps {
  navigation: any;
}

// Highly polished futuristic glowing AI core orb graphic for Hero card
const HeroAiCoreOrb = () => {
  return (
    <View style={styles.heroOrbContainer}>
      <Svg width="110" height="110" viewBox="0 0 120 120">
        <Defs>
          <SvgLinearGradient id="coreGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#00FFCC" />
            <Stop offset="40%" stopColor="#3B82F6" />
            <Stop offset="80%" stopColor="#8B5CF6" />
            <Stop offset="100%" stopColor="#EC4899" />
          </SvgLinearGradient>
          <SvgLinearGradient id="ringLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.02} />
          </SvgLinearGradient>
          <SvgLinearGradient id="sheenOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.55} />
            <Stop offset="40%" stopColor="#FFFFFF" stopOpacity={0.05} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </SvgLinearGradient>
        </Defs>

        {/* Inner Radial Background Glow */}
        <Circle cx="60" cy="60" r="32" fill="#3B82F6" opacity={0.16} />

        {/* Outer Orbit Ring 1 - Solid soft line */}
        <Circle cx="60" cy="60" r="54" stroke="url(#ringLight)" strokeWidth={1} fill="none" opacity={0.35} />
        
        {/* Orbit Ring 2 - Dash-array core glow ring */}
        <Circle cx="60" cy="60" r="46" stroke="#00FFCC" strokeWidth={1.5} strokeDasharray="4,8" fill="none" opacity={0.7} />
        
        {/* Orbit Ring 3 - Fine high-speed indicator dashes */}
        <Circle cx="60" cy="60" r="38" stroke="#60A5FA" strokeWidth={0.8} strokeDasharray="1,5" fill="none" opacity={0.5} />

        {/* Outer orbital nodes & tech particles */}
        <Circle cx="60" cy="6" r="3.5" fill="#00FFCC" />
        <Circle cx="60" cy="114" r="3.5" fill="#EC4899" />
        <Circle cx="14" cy="60" r="3" fill="#3B82F6" />
        <Circle cx="106" cy="60" r="3" fill="#FFFFFF" opacity={0.9} />
        
        {/* Micro-nodes floating inside orbit */}
        <Circle cx="28" cy="28" r="1.5" fill="#60A5FA" opacity={0.8} />
        <Circle cx="92" cy="92" r="1.5" fill="#8B5CF6" opacity={0.8} />
        <Circle cx="92" cy="28" r="1.5" fill="#00FFCC" opacity={0.8} />
        <Circle cx="28" cy="92" r="1.5" fill="#FFFFFF" opacity={0.8} />

        {/* Center 3D Glowing Core Sphere */}
        <Circle cx="60" cy="60" r="24" fill="url(#coreGlowGrad)" />
        {/* 3D Glass Sheen Top Layer */}
        <Circle cx="60" cy="60" r="24" fill="url(#sheenOverlay)" />
        {/* Center rim light reflection */}
        <Path d="M40 50 C45 40, 75 40, 80 50 C70 45, 50 45, 40 50" fill="#FFFFFF" opacity={0.25} />

        {/* Inner auto-awesome icon symbol */}
        <G transform="translate(49, 49)">
          <Path d="M11 2L9 7L4 9L9 11L11 16L13 11L18 9L13 7Z" fill="#FFFFFF" />
          <Path d="M5 15L4.2 16.8L2.4 17.6L4.2 18.4L5 20.2L5.8 18.4L7.6 17.6L5.8 16.8Z" fill="#00FFCC" />
        </G>
      </Svg>
    </View>
  );
};

// Custom functional component to render high-contrast premium SVG vector illustrations for all 13 active AI tools
const ToolIcon = ({ toolId, color }: { toolId: string; color: string }) => {
  switch (toolId) {
    case 'lesson_plan':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Rect x="7" y="5" width="18" height="22" rx="3" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Path d="M12 5 C12 3, 20 3, 20 5" fill={color} />
          <Line x1="11" y1="11" x2="21" y2="11" stroke="#94A3B8" strokeWidth={2.4} strokeLinecap="round" />
          <Line x1="11" y1="16" x2="18" y2="16" stroke="#94A3B8" strokeWidth={2.4} strokeLinecap="round" />
          <Line x1="11" y1="21" x2="21" y2="21" stroke="#94A3B8" strokeWidth={2.4} strokeLinecap="round" />
          <Circle cx="23" cy="23" r="5.5" fill="#10B981" />
          <Path d="M21 23 L22.5 24.5 L25 21.5" stroke="#FFFFFF" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </Svg>
      );
    case 'ai_assistant':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Rect x="7" y="8" width="18" height="15" rx="4" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Line x1="5" y1="15" x2="7" y2="15" stroke={color} strokeWidth={2.8} strokeLinecap="round" />
          <Line x1="25" y1="15" x2="27" y2="15" stroke={color} strokeWidth={2.8} strokeLinecap="round" />
          <Line x1="16" y1="8" x2="16" y2="4" stroke={color} strokeWidth={2.0} />
          <Circle cx="16" cy="3" r="1.8" fill="#EF4444" />
          <Circle cx="12" cy="14" r="2.6" fill="#00FFCC" />
          <Circle cx="20" cy="14" r="2.6" fill="#00FFCC" />
          <Path d="M11.5 18.5 C13 20, 19 20, 20.5 18.5" stroke={color} strokeWidth={2.0} strokeLinecap="round" fill="none" />
        </Svg>
      );
    case 'para_mcq':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Path d="M7 4 H21 L25 8 V27 C25 28.5, 23.5 28.5, 23.5 28.5 H7 C5.5 28.5, 5.5 27, 5.5 27 V5.5 C5.5 4, 7 4, 7 4" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Path d="M21 4 V8 H25" fill="#E2E8F0" stroke={color} strokeWidth={2.0} />
          <Circle cx="15.5" cy="17.5" r="6.2" fill={color} />
          <Path d="M13.8 15.5 C13.8 14.2, 17.2 14.2, 17.2 16 C17.2 17.5, 15.5 17.5, 15.5 18.8" stroke="#FFFFFF" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Circle cx="15.5" cy="21.5" r="1.0" fill="#FFFFFF" />
        </Svg>
      );
    case 'tf_gen':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Circle cx="10" cy="11" r="7.5" fill="#10B981" />
          <Path d="M7 11 L9.5 13.5 L13.5 9.5" stroke="#FFFFFF" strokeWidth={2.2} fill="none" strokeLinecap="round" />
          <Circle cx="21" cy="20" r="7.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth={1.5} />
          <Path d="M17.5 16.5 L24.5 23.5 M24.5 16.5 L17.5 23.5" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />
        </Svg>
      );
    case 'qa_builder':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Path d="M5 14 C5 9, 17 9, 17 14 C17 19, 14 19, 13 19 L9 22 V19 C5 19, 5 14, 5 14" fill="#8B5CF6" />
          <Path d="M27 18 C27 23, 15 23, 15 18 C15 13, 18 13, 19 13 L23 10 V13 C27 13, 27 18, 27 18" fill="#3B82F6" stroke="#FFFFFF" strokeWidth={1.5} />
          <Line x1="9" y1="12" x2="13" y2="12" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
          <Line x1="9" y1="15" x2="12" y2="15" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
          <Line x1="18" y1="17" x2="23" y2="17" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" />
        </Svg>
      );
    case 'worksheet':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Rect x="6" y="4" width="20" height="24" rx="2.5" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Line x1="10" y1="9" x2="22" y2="9" stroke="#E2E8F0" strokeWidth={2.2} />
          <Line x1="10" y1="14" x2="17" y2="14" stroke={color} strokeWidth={2.2} />
          <Line x1="10" y1="19" x2="22" y2="19" stroke="#E2E8F0" strokeWidth={2.2} />
          <Path d="M21 21 L28 14 L26 12 L19 19 Z" fill="#F59E0B" />
          <Path d="M19 19 L17 21 L20 20 Z" fill="#334155" />
        </Svg>
      );
    case 'chatbot':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Rect x="6" y="6" width="20" height="16" rx="3.5" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Circle cx="11" cy="14" r="1.8" fill={color} />
          <Circle cx="16" cy="14" r="1.8" fill={color} />
          <Circle cx="21" cy="14" r="1.8" fill={color} />
          <Path d="M12 22 L15 25 V22" fill={color} stroke={color} strokeWidth={1} />
        </Svg>
      );
    case 'fill_blanks':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Line x1="6" y1="9" x2="26" y2="9" stroke="#94A3B8" strokeWidth={2.4} strokeLinecap="round" />
          <Rect x="7" y="13" width="14" height="7" rx="2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth={1.8} />
          <Line x1="23" y1="16" x2="26" y2="16" stroke="#94A3B8" strokeWidth={2.4} strokeLinecap="round" />
          <Line x1="6" y1="23" x2="26" y2="23" stroke="#94A3B8" strokeWidth={2.4} strokeLinecap="round" />
        </Svg>
      );
    case 'match_maker':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Circle cx="8" cy="8" r="3.5" fill={color} />
          <Circle cx="8" cy="16" r="3.5" fill={color} />
          <Circle cx="8" cy="24" r="3.5" fill={color} />
          <Circle cx="24" cy="8" r="3.5" fill={color} />
          <Circle cx="24" cy="16" r="3.5" fill={color} />
          <Circle cx="24" cy="24" r="3.5" fill={color} />
          <Line x1="11" y1="8" x2="21" y2="16" stroke={color} strokeWidth={2.0} strokeDasharray="2,2" opacity={0.6} />
          <Line x1="11" y1="16" x2="21" y2="24" stroke={color} strokeWidth={2.0} strokeDasharray="2,2" opacity={0.6} />
          <Line x1="11" y1="24" x2="21" y2="8" stroke={color} strokeWidth={2.4} />
        </Svg>
      );
    case 'crossword':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Rect x="4" y="4" width="9" height="9" rx="1.5" fill="#FFFFFF" stroke={color} strokeWidth={2.0} />
          <Rect x="13" y="4" width="9" height="9" rx="1.5" fill="#FFFFFF" stroke={color} strokeWidth={2.0} />
          <Rect x="13" y="13" width="9" height="9" rx="1.5" fill="#FFFFFF" stroke={color} strokeWidth={2.0} />
          <Rect x="13" y="22" width="9" height="9" rx="1.5" fill="#FFFFFF" stroke={color} strokeWidth={2.0} />
          <Rect x="22" y="13" width="9" height="9" rx="1.5" fill="#FFFFFF" stroke={color} strokeWidth={2.0} />
          <SvgText x="6.2" y="11.2" fill={color} fontSize="8.5" fontWeight="bold">A</SvgText>
          <SvgText x="15.2" y="11.2" fill={color} fontSize="8.5" fontWeight="bold">I</SvgText>
        </Svg>
      );
    case 'story_book':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Path d="M16 26 C16 26, 12 21, 5 21 V6 C12 6, 16 11, 16 11 Z" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Path d="M16 26 C16 26, 20 21, 27 21 V6 C20 6, 16 11, 16 11 Z" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Line x1="16" y1="8" x2="16" y2="26" stroke={color} strokeWidth={2.6} />
          <Path d="M22 6 L23 8 L25 8 L23.5 9 L24.5 11 L22.5 10 L20.5 11 L21.5 9 L20 8 L22 8 Z" fill="#F59E0B" />
        </Svg>
      );
    case 'excel_gen':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Rect x="6" y="5" width="20" height="22" rx="2.5" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Line x1="6" y1="12" x2="26" y2="12" stroke={color} strokeWidth={1.8} />
          <Line x1="6" y1="19" x2="26" y2="19" stroke={color} strokeWidth={1.8} />
          <Line x1="13" y1="5" x2="13" y2="27" stroke={color} strokeWidth={1.8} />
          <Line x1="20" y1="5" x2="20" y2="27" stroke={color} strokeWidth={1.8} />
          <Rect x="8" y="14" width="3" height="3" fill="#217346" />
          <Rect x="15" y="7" width="3" height="3" fill="#217346" />
        </Svg>
      );
    case 'presentation':
      return (
        <Svg width="34" height="34" viewBox="0 0 32 32">
          <Line x1="16" y1="21" x2="16" y2="28" stroke={color} strokeWidth={2.4} />
          <Line x1="10" y1="28" x2="22" y2="28" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
          <Rect x="5" y="5" width="22" height="16" rx="2.5" fill="#FFFFFF" stroke={color} strokeWidth={2.4} />
          <Path d="M16 13 L21 10 A5 5 0 0 0 11 13 Z" fill={color} />
          <Circle cx="16" cy="13" r="3" fill="#FFFFFF" />
        </Svg>
      );
    default:
      return <MaterialIcons name="auto-awesome" size={24} color={color} />;
  }
};

// Custom functional component to render high-contrast subtle watermark SVGs for the background of the tool cards
const ToolWatermark = ({ toolId, color }: { toolId: string; color: string }) => {
  // Common tech dot matrix overlay
  const TechDotMatrix = () => (
    <G opacity={0.24}>
      <Circle cx="85" cy="15" r="1.5" fill={color} />
      <Circle cx="70" cy="15" r="1.5" fill={color} />
      <Circle cx="55" cy="15" r="1.5" fill={color} />
      <Circle cx="85" cy="30" r="1.5" fill={color} />
      <Circle cx="70" cy="30" r="1.5" fill={color} />
      <Circle cx="55" cy="30" r="1.5" fill={color} />
      <Circle cx="85" cy="45" r="1.5" fill={color} />
      <Circle cx="70" cy="45" r="1.5" fill={color} />
      <Circle cx="55" cy="45" r="1.5" fill={color} />
    </G>
  );

  switch (toolId) {
    case 'lesson_plan':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <Circle cx="30" cy="50" r="28" stroke={color} strokeWidth={0.8} strokeDasharray="3,4" fill="none" opacity={0.15} />
          {/* Shaded Binder Sheet - White body with color borders */}
          <Rect x="25" y="15" width="50" height="70" rx="6" fill="#FFFFFF" stroke={color} strokeWidth={2.2} />
          <Rect x="25" y="15" width="50" height="70" rx="6" fill={color} opacity={0.05} pointerEvents="none" />
          {/* Top binder loops in metal slate */}
          <Path d="M34 15 C34 9, 39 9, 39 15 M46 15 C46 9, 51 9, 51 15 M58 15 C58 9, 63 9, 63 15 M70 15 C70 9, 75 9, 75 15" fill="none" stroke="#64748B" strokeWidth={1.8} />
          {/* Written lines */}
          <Line x1="33" y1="32" x2="67" y2="32" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          <Line x1="33" y1="44" x2="58" y2="44" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          <Line x1="33" y1="56" x2="67" y2="56" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          <Line x1="33" y1="68" x2="50" y2="68" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          {/* Success checklist circular seal in Solid Green */}
          <Circle cx="66" cy="68" r="8" fill="#10B981" />
          <Path d="M62 68 L65 71 L71 65" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );
    case 'worksheet':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <Circle cx="50" cy="50" r="35" stroke={color} strokeWidth={0.7} strokeDasharray="4,6" fill="none" opacity={0.12} />
          {/* Shaded Printable Worksheet - White layout sheet */}
          <Rect x="20" y="18" width="52" height="66" rx="6" fill="#FFFFFF" stroke={color} strokeWidth={2} />
          <Rect x="20" y="18" width="52" height="66" rx="6" fill={color} opacity={0.05} pointerEvents="none" />
          <Line x1="30" y1="30" x2="62" y2="30" stroke="#94A3B8" strokeWidth={1.8} />
          <Line x1="30" y1="42" x2="50" y2="42" stroke={color} strokeWidth={2} />
          <Line x1="30" y1="54" x2="62" y2="54" stroke="#94A3B8" strokeWidth={1.8} />
          {/* Floating Pencil Graphic - Multi-colored 3D layout */}
          <G transform="translate(18, 12)">
            {/* Pencil shaft in orange-yellow */}
            <Path d="M45 45 L62 28 L72 38 L55 55 Z" fill="#F59E0B" />
            <Path d="M45 45 L62 28 L72 38 L55 55 Z" fill="none" stroke="#334155" strokeWidth={1.2} />
            {/* Pencil eraser in soft pink */}
            <Path d="M62 28 L66 24 C68 22, 71 22, 73 24 L74 25 C76 27, 76 30, 74 32 L72 38 Z" fill="#F43F5E" />
            {/* Pencil metal ring in silver */}
            <Line x1="62" y1="28" x2="72" y2="38" stroke="#94A3B8" strokeWidth={2} />
            {/* Pencil point wood tip */}
            <Path d="M45 45 L41 51 L47 47 Z" fill="#FDE047" />
            {/* Pencil black lead tip */}
            <Path d="M41 51 L39 53 L41 51 L42 50 Z" fill="#334155" stroke="#334155" strokeWidth={1.5} />
          </G>
        </Svg>
      );
    case 'chatbot':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <Circle cx="50" cy="50" r="38" stroke={color} strokeWidth={0.6} fill="none" opacity={0.1} />
          {/* Left User Bubble - Clean White with Color Border */}
          <Path d="M 15 42 Q 15 24, 38 24 Q 61 24, 61 42 Q 61 60, 48 60 L 35 73 V 60 Q 15 60, 15 42 Z" fill="#FFFFFF" stroke={color} strokeWidth={2.2} />
          {/* Right AI bubble overlap - Vibrant Color Fill with Soft Opacity */}
          <Path d="M 45 56 Q 45 42, 63 42 Q 81 42, 81 56 Q 81 70, 71 70 L 62 80 V 70 Q 45 70, 45 56 Z" fill={color} opacity={0.24} stroke={color} strokeWidth={1.8} />
          {/* Orange dialogue dots */}
          <Circle cx="28" cy="42" r="3" fill="#F97316" />
          <Circle cx="38" cy="42" r="3" fill="#F97316" />
          <Circle cx="48" cy="42" r="3" fill="#F97316" />
        </Svg>
      );
    case 'para_mcq':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <Circle cx="50" cy="50" r="32" stroke={color} strokeWidth={0.8} strokeDasharray="3,3" fill="none" opacity={0.16} />
          {/* Shaded MCQ Document - Clean White Sheet */}
          <Path d="M25 15 H65 L80 30 V85 C80 88, 77 88, 77 88 H25 C22 88, 22 85, 22 85 V18 C22 15, 25 15, 25 15" fill="#FFFFFF" stroke={color} strokeWidth={2.2} />
          <Path d="M25 15 H65 L80 30 V85 C80 88, 77 88, 77 88 H25 C22 88, 22 85, 22 85 V18 C22 15, 25 15, 25 15" fill={color} opacity={0.04} pointerEvents="none" />
          <Path d="M65 15 V30 H80" fill="#F1F5F9" stroke={color} strokeWidth={1.8} />
          
          {/* Choice Option 1 - Normal Radio */}
          <Circle cx="35" cy="46" r="4.5" stroke="#94A3B8" strokeWidth={1.8} fill="#FFFFFF" />
          <Line x1="45" y1="46" x2="68" y2="46" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          {/* Choice Option 2 - Correct Green Checked Radio */}
          <Circle cx="35" cy="58" r="4.5" stroke="#10B981" strokeWidth={1.8} fill="#DCFCE7" />
          <Circle cx="35" cy="58" r="2" fill="#10B981" />
          <Line x1="45" y1="58" x2="68" y2="58" stroke="#10B981" strokeWidth={2.2} strokeLinecap="round" />
          {/* Choice Option 3 - Normal Radio */}
          <Circle cx="35" cy="70" r="4.5" stroke="#94A3B8" strokeWidth={1.8} fill="#FFFFFF" />
          <Line x1="45" y1="70" x2="68" y2="70" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'fill_blanks':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          {/* Shaded exercise background board */}
          <Rect x="10" y="12" width="80" height="76" rx="8" fill="#FFFFFF" stroke={color} strokeWidth={1.5} />
          <Rect x="10" y="12" width="80" height="76" rx="8" fill={color} opacity={0.04} pointerEvents="none" />
          <Line x1="18" y1="26" x2="82" y2="26" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          <Line x1="18" y1="42" x2="42" y2="42" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          {/* Advanced Cloze pill design - Gold filled badge */}
          <Rect x="47" y="32" width="36" height="18" rx="9" fill="#FEF3C7" stroke="#F59E0B" strokeWidth={1.8} />
          <Line x1="56" y1="41" x2="74" y2="41" stroke="#F59E0B" strokeWidth={2} strokeLinecap="round" />
          
          <Line x1="18" y1="58" x2="82" y2="58" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          <Line x1="18" y1="74" x2="52" y2="74" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
          {/* Pill design 2 - Purple filled badge */}
          <Rect x="58" y="65" width="24" height="18" rx="9" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth={1.8} />
        </Svg>
      );
    case 'tf_gen':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <G opacity={0.9}>
            {/* Green glowing True ring with Solid fill */}
            <Circle cx="34" cy="38" r="19" fill="#E8FDF0" stroke="#10B981" strokeWidth={2.2} />
            <Path d="M26 38 L31 43 L42 32" stroke="#10B981" strokeWidth={3} fill="none" strokeLinecap="round" />
            <Circle cx="34" cy="38" r="23" stroke="#10B981" strokeWidth={0.8} strokeDasharray="3,3" fill="none" opacity={0.4} />
            
            {/* Red glowing False ring overlapping with Solid fill */}
            <Circle cx="64" cy="62" r="19" fill="#FDF2F2" stroke="#EF4444" strokeWidth={2.2} />
            <Path d="M55 53 L73 71 M73 53 L55 71" stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />
            <Circle cx="64" cy="62" r="23" stroke="#EF4444" strokeWidth={0.8} strokeDasharray="3,3" fill="none" opacity={0.4} />
          </G>
        </Svg>
      );
    case 'qa_builder':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <Circle cx="50" cy="50" r="32" stroke={color} strokeWidth={0.8} strokeDasharray="4,6" fill="none" opacity={0.12} />
          {/* Question node (Q) - Blue gradient header card */}
          <Rect x="15" y="20" width="46" height="28" rx="8" fill="#DBEAFE" stroke="#3B82F6" strokeWidth={2} />
          <SvgText x="21" y="39" fill="#1E40AF" fontSize="14" fontWeight="bold">Q</SvgText>
          <Line x1="36" y1="34" x2="52" y2="34" stroke="#1E40AF" strokeWidth={2.2} strokeLinecap="round" />
          
          {/* Answer node (A) overlapping in 3D perspective - Purple header card */}
          <Rect x="38" y="44" width="46" height="28" rx="8" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth={1.8} />
          <SvgText x="44" y="63" fill="#5B21B6" fontSize="14" fontWeight="bold">A</SvgText>
          <Line x1="59" y1="58" x2="75" y2="58" stroke="#5B21B6" strokeWidth={2.2} strokeLinecap="round" />
          
          {/* Connecting linking thread line */}
          <Path d="M45 48 C45 52, 30 40, 38 44" stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="2,3" />
        </Svg>
      );
    case 'match_maker':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <G strokeWidth={2} fill="none">
            {/* Color nodes on Left */}
            <Circle cx="25" cy="24" r="7" fill="#EFF6FF" stroke="#3B82F6" />
            <Circle cx="25" cy="50" r="7" fill="#FDF2F8" stroke="#EC4899" />
            <Circle cx="25" cy="76" r="7" fill="#FAF5FF" stroke="#8B5CF6" />
            
            {/* Color nodes on Right */}
            <Circle cx="75" cy="24" r="7" fill="#FAF5FF" stroke="#8B5CF6" />
            <Circle cx="75" cy="50" r="7" fill="#EFF6FF" stroke="#3B82F6" />
            <Circle cx="75" cy="76" r="7" fill="#FDF2F8" stroke="#EC4899" />
            
            {/* Matching paths */}
            <Path d="M33 24 L67 50" stroke="#3B82F6" strokeDasharray="3,3" />
            <Path d="M33 50 L67 76" stroke="#EC4899" strokeDasharray="3,3" />
            <Path d="M33 76 L67 24" stroke="#8B5CF6" strokeWidth={2.4} />
          </G>
        </Svg>
      );
    case 'crossword':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <G stroke={color} strokeWidth={2} fill="none" opacity={0.95}>
            {/* Grid square structure - filled with various contrast colors */}
            <Rect x="20" y="20" width="20" height="20" rx="3" fill="#FFFFFF" />
            <Rect x="40" y="20" width="20" height="20" rx="3" fill="#DBEAFE" />
            <Rect x="40" y="40" width="20" height="20" rx="3" fill="#FFFFFF" />
            <Rect x="40" y="60" width="20" height="20" rx="3" fill="#F3E8FF" />
            <Rect x="60" y="40" width="20" height="20" rx="3" fill="#FFFFFF" />
            <SvgText x="25.5" y="34.5" fill={color} stroke="none" fontSize="12" fontWeight="bold">A</SvgText>
            <SvgText x="45.5" y="34.5" fill="#1E40AF" stroke="none" fontSize="12" fontWeight="bold">I</SvgText>
          </G>
        </Svg>
      );
    case 'excel_gen':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          {/* Spreadsheet clean layout sheet */}
          <Rect x="15" y="15" width="70" height="70" rx="8" fill="#FFFFFF" stroke="#217346" strokeWidth={2.2} />
          <Line x1="15" y1="36" x2="85" y2="36" stroke="#217346" strokeWidth={1.8} />
          <Line x1="15" y1="58" x2="85" y2="58" stroke="#217346" strokeWidth={1.8} />
          <Line x1="38" y1="15" x2="38" y2="85" stroke="#217346" strokeWidth={1.8} />
          <Line x1="62" y1="15" x2="62" y2="85" stroke="#217346" strokeWidth={1.8} />
          
          {/* Excel colored visual data bars */}
          <Rect x="20" y="42" width="12" height="10" fill="#217346" opacity={0.35} />
          <Rect x="44" y="22" width="12" height="10" fill="#F59E0B" opacity={0.45} />
          <Rect x="68" y="42" width="12" height="36" fill="#3B82F6" opacity={0.3} />
        </Svg>
      );
    case 'presentation':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <Line x1="50" y1="65" x2="50" y2="88" stroke="#D24726" strokeWidth={2.8} />
          <Line x1="28" y1="88" x2="72" y2="88" stroke="#D24726" strokeWidth={2.8} strokeLinecap="round" />
          {/* Projector slide screen with White fill */}
          <Rect x="12" y="15" width="76" height="50" rx="8" fill="#FFFFFF" stroke="#D24726" strokeWidth={2.2} />
          {/* Shaded slide graph background */}
          <Path d="M12 40 Q50 30, 88 40 L88 65 L12 65 Z" fill="#FEE2E2" opacity={0.5} />
          {/* Line Chart graph inside screen */}
          <Path d="M22 48 L36 34 L52 42 L66 24 L78 30" fill="none" stroke="#D24726" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="36" cy="34" r="3" fill="#D24726" />
          <Circle cx="66" cy="24" r="3" fill="#D24726" />
        </Svg>
      );
    case 'ai_assistant':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          <Circle cx="50" cy="50" r="35" stroke={color} strokeWidth={0.6} fill="none" opacity={0.08} />
          {/* Shaded Droid body block */}
          <Rect x="20" y="25" width="60" height="50" rx="14" fill="#F8FAFC" stroke="#E28743" strokeWidth={2} />
          <Line x1="10" y1="50" x2="20" y2="50" stroke="#E28743" strokeWidth={3.5} strokeLinecap="round" />
          <Line x1="80" y1="50" x2="90" y2="50" stroke="#E28743" strokeWidth={3.5} strokeLinecap="round" />
          <Line x1="50" y1="25" x2="50" y2="12" stroke="#E28743" strokeWidth={2.2} />
          <Circle cx="50" cy="9" r="4.5" fill="#EF4444" />
          {/* Glowing blue eyes with concentric rings */}
          <Circle cx="36" cy="45" r="5" fill="#06B6D4" />
          <Circle cx="36" cy="45" r="9" stroke="#06B6D4" strokeWidth={0.8} fill="none" opacity={0.4} />
          <Circle cx="64" cy="45" r="5" fill="#06B6D4" />
          <Circle cx="64" cy="45" r="9" stroke="#06B6D4" strokeWidth={0.8} fill="none" opacity={0.4} />
          <Path d="M38 60 Q50 67, 62 60" stroke="#E28743" strokeWidth={2.5} strokeLinecap="round" fill="none" />
        </Svg>
      );
    case 'story_book':
      return (
        <Svg width="110" height="110" viewBox="0 0 100 100">
          <TechDotMatrix />
          {/* Magical orbiting gold stars */}
          <Path d="M12 25 L14 28 L17 28 L15 30 L16 33 L13 31 L11 33 L12 30 L10 28 L13 28 Z" fill="#F59E0B" />
          <Path d="M78 16 L79.5 19.5 L83 19.5 L80 21.5 L81.5 25 L78 23 L74.5 25 L76 21.5 L73 19.5 L76.5 19.5 Z" fill="#F59E0B" />
          {/* Magic open book pages with White/Slate color blocks */}
          <Path d="M50 80 C50 80, 38 66, 12 66 V18 C38 18, 50 32, 50 32 Z" fill="#FFFFFF" stroke="#8E44AD" strokeWidth={2} />
          <Path d="M50 80 C50 80, 62 66, 88 66 V18 C62 18, 50 32, 50 32 Z" fill="#F5F3FF" stroke="#8E44AD" strokeWidth={2} />
          <Line x1="50" y1="20" x2="50" y2="80" stroke="#8E44AD" strokeWidth={2.8} />
          {/* Tiny written lines in the book pages */}
          <Line x1="22" y1="34" x2="42" y2="34" stroke="#B28FCE" strokeWidth={1} />
          <Line x1="22" y1="46" x2="38" y2="46" stroke="#B28FCE" strokeWidth={1} />
          <Line x1="58" y1="34" x2="78" y2="34" stroke="#B28FCE" strokeWidth={1} />
          <Line x1="58" y1="46" x2="74" y2="46" stroke="#B28FCE" strokeWidth={1} />
        </Svg>
      );
    default:
      return null;
  }
};

export const AIToolkitScreen: React.FC<AIToolkitScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 340;

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive draft generator modal states
  const [activeTool, setActiveTool] = useState<any | null>(null);
  const [drafting, setDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState<string | null>(null);

  // Form input states inside draft modal
  const [topicInput, setTopicInput] = useState('');
  const [gradeInput, setGradeInput] = useState('Grade-II');

  // Tool-specific custom input states for professional inner details
  const [lessonFocus, setLessonFocus] = useState('Conceptual Understanding');
  const [lessonDuration, setLessonDuration] = useState('45 Mins');
  
  const [questionCount, setQuestionCount] = useState('5 Questions');
  const [difficultyLevel, setDifficultyLevel] = useState('Medium');
  
  const [storyGenre, setStoryGenre] = useState('Adventure');
  const [moralFocus, setMoralFocus] = useState('Cooperation');
  
  const [slideCount, setSlideCount] = useState('5 Slides');
  const [presentationStyle, setPresentationStyle] = useState('Creative Colorful');
  
  const [studentCount, setStudentCount] = useState('10 Students');
  const [sheetType, setSheetType] = useState('Grades Summary');

  const tools = [
    { 
      id: 'lesson_plan', 
      title: 'Lesson Plan', 
      desc: 'Full lesson with objectives, activities and timing', 
      category: 'Planning & Prep', 
      icon: 'assignment',
      color: '#0052cc',
      bg: 'rgba(0, 82, 204, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Syllabus Draft',
      code: 'TK-01',
      promptLabel: 'Topic / Lesson Concept',
      placeholder: 'e.g. Photosynthesis, Newton\'s laws of motion...',
      mockOutput: '📋 DRAFTED LESSON PLAN:\nTopic: Photosynthesis\nGrade: Grade-II\n\n1. Objectives:\n- Understand how plants make food.\n- Identify key roles of sunlight, water, and CO2.\n\n2. Hook (5 mins):\nShow a live plant and ask students where its food comes from.\n\n3. Core Activity (20 mins):\nInteractive drawing of a leaf showing absorption pathways.\n\n4. Assessment (5 mins):\n3 simple MCQ questions.'
    },
    { 
      id: 'worksheet', 
      title: 'Worksheet', 
      desc: 'Practice exercises ready to print', 
      category: 'Interactive Activities', 
      icon: 'description',
      color: '#06B6D4',
      bg: 'rgba(6, 182, 212, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Printable PDF',
      code: 'TK-02',
      promptLabel: 'Worksheet Topic & Instructions',
      placeholder: 'e.g. Two-digit addition worksheets with carryover...',
      mockOutput: '📄 PRACTICE WORKSHEET:\nName: ______________  Date: _________\n\nSolve the following additions:\n1)  24 + 18 = ___\n2)  45 + 27 = ___\n3)  56 + 19 = ___'
    },
    { 
      id: 'chatbot', 
      title: 'Chatbot', 
      desc: 'Convert text into interactive activities', 
      category: 'Interactive Activities', 
      icon: 'forum',
      color: '#FD7E14',
      bg: 'rgba(253, 126, 20, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Interactive',
      code: 'TK-03',
      promptLabel: 'Activity concept / Text content',
      placeholder: 'e.g. Roleplay dialogue practice for english greetings...',
      mockOutput: '💬 INTERACTIVE DIALOGUE BOT:\nRole: Shopkeeper & Customer\n\n- Bot: "Hello! How can I help you today?"\n- Prompt: Let student reply with greetings.'
    },
    { 
      id: 'para_mcq', 
      title: 'Paragraph to MCQs', 
      desc: 'Create MCQs from a given paragraph', 
      category: 'Assessments & Quizzes', 
      icon: 'quiz',
      color: '#D9534F',
      bg: 'rgba(217, 83, 79, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Smart Quiz',
      code: 'TK-04',
      promptLabel: 'Paste your paragraph text here',
      placeholder: 'e.g. The solar system consists of the sun and eight planets...',
      mockOutput: '📝 GENERATED MCQs:\nQ1: How many planets are in the solar system?\nA) 7\nB) 8 (Correct)\nC) 9\n\nQ2: What is at the center of our solar system?\nA) Earth\nB) Moon\nC) The Sun (Correct)'
    },
    { 
      id: 'fill_blanks', 
      title: 'Fill in Blanks', 
      desc: 'Develop engaging cloze test exercises', 
      category: 'Interactive Activities', 
      icon: 'border-color',
      color: '#7C3AED',
      bg: 'rgba(124, 58, 237, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Cloze Test',
      code: 'TK-05',
      promptLabel: 'Paste text with keywords to remove',
      placeholder: 'e.g. Plants use chlorophyll to absorb light during photosynthesis...',
      mockOutput: '✍️ CLOZE PRACTICE:\nFill in the blanks using correct terms:\n\nPlants use __________ (chlorophyll) to absorb light during __________ (photosynthesis).'
    },
    { 
      id: 'tf_gen', 
      title: 'True / False Generator', 
      desc: 'Generate intelligent True or False questions instantly', 
      category: 'Assessments & Quizzes', 
      icon: 'fact-check',
      color: '#0D9488',
      bg: 'rgba(13, 148, 136, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Fast Q&A',
      code: 'TK-06',
      promptLabel: 'Enter subject text or topic',
      placeholder: 'e.g. Water freezes at 0 degrees Celsius...',
      mockOutput: '✅ TRUE / FALSE QUESTIONS:\n1. Water freezes at 0 degrees Celsius.\n[True] / False\n\n2. Sound travels faster in a vacuum than in air.\nTrue / [False]'
    },
    { 
      id: 'match_maker', 
      title: 'AI Match Maker', 
      desc: 'Turn your content into interactive matching exercises', 
      category: 'Interactive Activities', 
      icon: 'extension',
      color: '#B59A7A',
      bg: 'rgba(181, 154, 122, 0.08)',
      cardBg: '#FAF5EC',
      tag: 'Pair Puzzle',
      code: 'TK-07',
      promptLabel: 'List of matching items (Left = Right)',
      placeholder: 'e.g. Earth = Blue Planet, Mars = Red Planet...',
      mockOutput: '🧩 MATCH THE FOLLOWING:\nColumn A        Column B\n1. Earth        A. Red Planet\n2. Mars         B. Blue Planet\n\nAnswer Key: 1-B, 2-A'
    },
    { 
      id: 'crossword', 
      title: 'AI Crossword Builder', 
      desc: 'Transform lessons into fun crossword challenges', 
      category: 'Interactive Activities', 
      icon: 'grid-on',
      color: '#EC4899',
      bg: 'rgba(236, 72, 153, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Vocabulary',
      code: 'TK-08',
      promptLabel: 'Clues and words (Word: Clue)',
      placeholder: 'e.g. SUN: Star at the center, MOON: Earth\'s satellite...',
      mockOutput: '📝 CROSSWORD PUZZLE OUTLINE:\nClues Across:\n1. Star at the center of the solar system (3 letters) -> SUN\n\nClues Down:\n2. Earth\'s natural satellite (4 letters) -> MOON'
    },
    { 
      id: 'qa_builder', 
      title: 'AI QA Builder', 
      desc: 'Turn any lesson into ready-made question and answer sets', 
      category: 'Assessments & Quizzes', 
      icon: 'question-answer',
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Lesson Prep',
      code: 'TK-09',
      promptLabel: 'Lesson text / Topic summary',
      placeholder: 'e.g. Mammals are warm-blooded vertebrates with hair...',
      mockOutput: '📋 QUESTION & ANSWER SETS:\nQ: What defines a mammal?\nA: Mammals are warm-blooded vertebrates that have hair or fur and produce milk for their young.'
    },
    { 
      id: 'excel_gen', 
      title: 'AI Excel', 
      desc: 'Generate spreadsheets and gradebooks automatically', 
      category: 'Admin & Documents', 
      icon: 'table-chart',
      color: '#217346',
      bg: 'rgba(33, 115, 70, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Spreadsheet',
      code: 'TK-10',
      promptLabel: 'List of student names / Columns needed',
      placeholder: 'e.g. Mustafa, Anusha, Faraz. Columns: Quiz 1, Quiz 2, Average.',
      mockOutput: '📊 EXCEL DATA SCHEMATIC:\n| Student Name | Quiz 1 | Quiz 2 | Average |\n|--------------|--------|--------|--------|\n| Mustafa      | 85     | 90     | 87.5   |\n| Anusha       | 92     | 96     | 94.0   |\n| Faraz        | 78     | 82     | 80.0   |'
    },
    { 
      id: 'presentation', 
      title: 'AI Presentation', 
      desc: 'Turn any topic into a ready-to-present slide deck', 
      category: 'Admin & Documents', 
      icon: 'slideshow',
      color: '#D24726',
      bg: 'rgba(210, 71, 38, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'Slide Deck',
      code: 'TK-11',
      promptLabel: 'Presentation topic & Slide count',
      placeholder: 'e.g. Water cycle process in 4 slides...',
      mockOutput: '📉 PRESENTATION SLIDES OUTLINE:\nSlide 1: Title: The Water Cycle\nSlide 2: Evaporation - Liquid water turns to vapor.\nSlide 3: Condensation - Clouds form as vapor cools.\nSlide 4: Precipitation - Rain and snow return water to Earth.'
    },
    { 
      id: 'ai_assistant', 
      title: 'AI Assistant', 
      desc: 'Chat with an assistant that knows your teaching materials', 
      category: 'Planning & Prep', 
      icon: 'smart-toy',
      color: '#E28743',
      bg: 'rgba(226, 135, 67, 0.08)',
      cardBg: '#FFFFFF',
      tag: '2-Way Chat',
      code: 'TK-12',
      promptLabel: 'Ask your assistant anything',
      placeholder: 'e.g. Create a creative homework idea for grade 2 science...',
      mockOutput: '🤖 AI ASSISTANT RESPONSE:\nHere is a creative homework activity for Grade 2 Science:\n\n"Leaf Scrapbook": Ask students to collect 3 different leaves from their neighborhood, paste them in their notebooks, and write 1 line describing the color and shape of each leaf.'
    },
    { 
      id: 'story_book', 
      title: 'AI Story Book', 
      desc: 'Age-appropriate reading content on any topic', 
      category: 'Interactive Activities', 
      icon: 'menu-book',
      color: '#8E44AD',
      bg: 'rgba(142, 68, 173, 0.08)',
      cardBg: '#FFFFFF',
      tag: 'E-Book',
      code: 'TK-13',
      promptLabel: 'Story theme / Moral lesson',
      placeholder: 'e.g. A sharing rabbit who helped his forest friends...',
      mockOutput: '📚 AI STORY: "The Sharing Rabbit"\nOnce upon a time in a green forest, there lived a rabbit named Barnaby. While others hoarded carrots, Barnaby shared his with the hungry hedgehogs. When winter arrived, all the forest animals gathered wood to keep Barnaby warm.'
    }
  ];

  // Filter tools based on search query
  const filteredTools = tools.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenTool = (tool: any) => {
    setActiveTool(tool);
    setTopicInput('');
    setDraftResult(null);
    // Reset selections to defaults
    setLessonFocus('Conceptual Understanding');
    setLessonDuration('45 Mins');
    setQuestionCount('5 Questions');
    setDifficultyLevel('Medium');
    setStoryGenre('Adventure');
    setMoralFocus('Cooperation');
    setSlideCount('5 Slides');
    setPresentationStyle('Creative Colorful');
    setStudentCount('10 Students');
    setSheetType('Grades Summary');
  };

  const handleDraftWithAI = () => {
    if (topicInput.trim() === '') {
      alert('Please fill out the prompt text!');
      return;
    }
    setDrafting(true);
    setTimeout(() => {
      setDrafting(false);
      
      let result = '';
      if (activeTool.id === 'lesson_plan') {
        result = `📋 DRAFTED LESSON PLAN:\nTopic: ${topicInput}\nGrade: ${gradeInput}\nDuration: ${lessonDuration}\nFocus Area: ${lessonFocus}\n\n1. Learning Objectives:\n- Understand primary core concepts of ${topicInput}.\n- Discuss real-world relevance based on ${lessonFocus}.\n\n2. Schedule Breakdown:\n- Interactive Intro (8 mins): Concept hooks.\n- Main Focus Study (20 mins): Deep dive into ${lessonFocus}.\n- Student Pair-Work (12 mins): Assessment practice.\n- Class Wrap-up (5 mins): Formative check.`;
      } else if (activeTool.id === 'para_mcq') {
        result = `📝 GENERATED MCQs (${questionCount} - ${difficultyLevel} Level):\nSource Paragraph: "${topicInput.substring(0, 50)}..."\n\nQ1: What is the main point of "${topicInput.substring(0, 15)}" under ${difficultyLevel} view?\nA) Option A\nB) Principal Answer (Correct)\nC) Distractor Option\n\nQ2: Which element is most important?\nA) Choice 1\nB) Choice 2\nC) Choice 3 (Correct)\n\n[Total: ${questionCount} generated questions match this schema]`;
      } else if (activeTool.id === 'story_book') {
        result = `📚 AI STORY BOOK: "The Adventure of ${topicInput}"\nGenre: ${storyGenre} | Moral Focus: ${moralFocus}\nTarget: ${gradeInput}\n\nOnce upon a time in a beautiful land, a great journey began, teaching us about ${moralFocus}. On this ${storyGenre} adventure, the characters discovered that solving problems requires ${moralFocus}. Together, they triumphed and lived happily.`;
      } else if (activeTool.id === 'presentation') {
        result = `📉 PRESENTATION OUTLINE (${slideCount} - ${presentationStyle} Theme):\nTopic: ${topicInput}\n\nSlide 1: Title: Intro to ${topicInput}\nSlide 2: Background Details & Importance\nSlide 3: Core Mechanics Deep Dive\nSlide 4: Key Objectives & Metric Summary\nSlide 5: Conclusion & Q&A\n\n[Slide deck matches theme: ${presentationStyle}]`;
      } else if (activeTool.id === 'excel_gen') {
        result = `📊 GENERATED EXCEL SCHEMATIC:\nSpreadsheet Type: ${sheetType} | Target Size: ${studentCount}\n\n| Student Name | Quiz 1 | Quiz 2 | Final Grade |\n|--------------|--------|--------|-------------|\n| Mustafa      | 88     | 90     | Pass        |\n| Anusha       | 95     | 96     | Pass        |\n| Faraz        | 72     | 78     | Pass        |\n| Alisha       | 89     | 91     | Pass        |\n\n[Generated gradebook for ${studentCount} students]`;
      } else {
        result = activeTool.mockOutput;
      }
      setDraftResult(result);
    }, 1500); // Simulate AI generation delay
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', width: '100%' }}>
      <SafeAreaView style={[styles.safeArea, { alignSelf: 'center', width: '100%', maxWidth: 720 }]} edges={['top']}>
      
      {/* ── APP HEADER ── */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={20} color="#003d9b" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Teacher Toolkit</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
          <MaterialIcons name="auto-awesome" size={20} color="#0052cc" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── GLOWING AURORA GRADIENT HERO BANNER ── */}
        <LinearGradient 
          colors={['#0A1938', '#0E2E8C', '#1D4ED8']} // richer, deeper futuristic gradient transition
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroBanner}
        >
          {/* Diagonal Glass Sheen overlay */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Subtle shine bar */}
          <View style={styles.glassTopShine} />

          {/* Floating glowing circles */}
          <View pointerEvents="none" style={[styles.heroAuroraSphere, { backgroundColor: '#38BDF8', width: 220, height: 220, top: -75, right: -40, opacity: 0.32 }]} />
          <View pointerEvents="none" style={[styles.heroAuroraSphere, { backgroundColor: '#C084FC', width: 150, height: 150, bottom: -45, left: -10, opacity: 0.2 }]} />

          {/* Wavy vector line designs */}
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgLinearGradient id="heroWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#00FFCC" stopOpacity={0} />
                <Stop offset="50%" stopColor="#00FFCC" stopOpacity={0.25} />
                <Stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Path d="M -10 90 C 40 60, 100 110, 150 90 S 240 60, 300 90" stroke="url(#heroWaveGrad)" strokeWidth={2} fill="none" opacity={0.7} />
            <Path d="M 0 95 C 50 75, 110 85, 160 75 S 250 85, 310 75" stroke="url(#heroWaveGrad)" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.5} />
          </Svg>

          {/* 3D Glowing AI Core Orb (Right side) */}
          <HeroAiCoreOrb />

          {/* Banner Text Block */}
          <View style={styles.heroTextContainer}>
            <View style={styles.heroBadge}>
              <MaterialIcons name="bolt" size={13} color="#00FFCC" style={{ marginRight: 4 }} />
              <Text style={styles.heroBadgeText}>AI AUTOPILOT</Text>
            </View>
            <Text style={styles.heroTitle}>Teacher AI Toolkit</Text>
            <Text style={styles.heroSubtitle}>
              Pick a tool, give a topic, and AI drafts it for you — lesson plans, worksheets, rubrics and more.
            </Text>
          </View>
        </LinearGradient>

        {/* ── SEARCH INPUT ── */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconBox}>
              <MaterialIcons name="search" size={18} color="#003d9b" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search AI builders..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity style={{ padding: 8 }} onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                <MaterialIcons name="close" size={16} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── AI TOOLS LIST ── */}
        <View style={styles.categorySection}>
          <View style={styles.gridRow}>
            {filteredTools.map((tool) => (
              <TouchableOpacity 
                key={tool.id} 
                style={[styles.toolCard, { shadowColor: tool.color, backgroundColor: tool.cardBg || '#FFFFFF' }]}
                activeOpacity={0.85}
                onPress={() => {
                  const noFrom = { fromScreen: undefined };
                  if (tool.id === 'lesson_plan') {
                    navigation.navigate('LessonPlan', noFrom);
                  } else if (tool.id === 'worksheet') {
                    navigation.navigate('Worksheet', noFrom);
                  } else if (tool.id === 'chatbot') {
                    navigation.navigate('Chatbot', noFrom);
                  } else if (tool.id === 'para_mcq') {
                    navigation.navigate('MCQs', noFrom);
                  } else if (tool.id === 'fill_blanks') {
                    navigation.navigate('FillBlanks', noFrom);
                  } else if (tool.id === 'tf_gen') {
                    navigation.navigate('TrueFalse', noFrom);
                  } else if (tool.id === 'match_maker') {
                    navigation.navigate('MatchColumn', noFrom);
                  } else if (tool.id === 'crossword') {
                    navigation.navigate('Crossword', noFrom);
                  } else if (tool.id === 'qa_builder') {
                    navigation.navigate('QABuilder', noFrom);
                  } else if (tool.id === 'excel_gen') {
                    navigation.navigate('ExcelGen', noFrom);
                  } else if (tool.id === 'presentation') {
                    navigation.navigate('Presentation', noFrom);
                  } else {
                    handleOpenTool(tool);
                  }
                }}
              >
                {/* Glowing shadow backdrop gradient */}
                <LinearGradient
                  colors={['#FFFFFF', tool.color + '07']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />

                {/* Floating Left Accent Bar with Gradient */}
                <LinearGradient
                  colors={[tool.color, tool.color + '33']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.leftAccentBar}
                />

                {/* Visual Watermark Design */}
                <View style={styles.cardWatermarkContainer} pointerEvents="none">
                  <ToolWatermark toolId={tool.id} color={tool.color} />
                </View>

                {/* Left Icon Orb with custom premium SVG vector graphic */}
                <View style={[styles.iconBox, { borderColor: tool.color + '30', backgroundColor: tool.bg }]}>
                  <ToolIcon toolId={tool.id} color={tool.color} />
                </View>

                {/* Metadata Content */}
                <View style={styles.toolMeta}>
                  <Text style={styles.toolName} numberOfLines={1}>{tool.title}</Text>
                </View>

                {/* Navigation arrow badge */}
                <LinearGradient
                  colors={['#FFFFFF', tool.color + '12']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.chevronWrapper, { borderColor: tool.color + '45', shadowColor: tool.color }]}
                >
                  <Svg width="30" height="30" viewBox="0 0 42 42">
                    <Circle cx="21" cy="21" r="18" stroke={tool.color} strokeWidth={0.9} strokeDasharray="2.5,3.5" opacity={0.38} fill="none" />
                    <Path d="M15 21 H27 M22 16 L27 21 L22 26" stroke={tool.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </Svg>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredTools.length === 0 && (
          <View style={styles.emptySearchContainer}>
            <MaterialIcons name="search-off" size={44} color="#CBD5E1" />
            <Text style={styles.emptySearchText}>No matching AI tools found</Text>
          </View>
        )}
      </ScrollView>

      {/* ── INTERACTIVE AI DRAFT GENERATOR MODAL ── */}
      <Modal
        visible={activeTool !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveTool(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.formContainer}>
            
            {/* Modal Header */}
            <LinearGradient colors={['#0A1F5C', '#003d9b']} style={styles.formHeader}>
              <View style={styles.formHeaderLeft}>
                <View style={[styles.modalHeaderIconBox, { backgroundColor: activeTool?.bg }]}>
                  <MaterialIcons name={activeTool?.icon as any} size={18} color={activeTool?.color} />
                </View>
                <Text style={styles.formHeaderTitle}>{activeTool?.title}</Text>
              </View>
              <TouchableOpacity onPress={() => setActiveTool(null)} style={styles.formCloseBtn} activeOpacity={0.7}>
                <MaterialIcons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
            <View style={{ height: 2, backgroundColor: '#00FFCC', opacity: 0.8 }} />

            <ScrollView contentContainerStyle={styles.formScrollContent} showsVerticalScrollIndicator={false}>
              
              {/* Tool-specific customized control panels according to type */}
              {activeTool?.id === 'lesson_plan' && (
                <>
                  {/* Focus Area Selection */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Lesson Focus Area</Text>
                    <View style={styles.gradeContainer}>
                      {['Conceptual Understanding', 'Practical Application', 'Exam Preparation'].map((f) => {
                        const active = lessonFocus === f;
                        return (
                          <TouchableOpacity 
                            key={f} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setLessonFocus(f)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive, { fontSize: 10.5 }]}>{f}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Duration Selector */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Lesson Duration</Text>
                    <View style={styles.gradeContainer}>
                      {['30 Mins', '45 Mins', '60 Mins'].map((d) => {
                        const active = lessonDuration === d;
                        return (
                          <TouchableOpacity 
                            key={d} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setLessonDuration(d)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive]}>{d}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}

              {activeTool?.id === 'para_mcq' && (
                <>
                  {/* MCQ Count Selection */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Number of MCQs</Text>
                    <View style={styles.gradeContainer}>
                      {['3 Questions', '5 Questions', '10 Questions'].map((c) => {
                        const active = questionCount === c;
                        return (
                          <TouchableOpacity 
                            key={c} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setQuestionCount(c)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive]}>{c}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Difficulty Selection */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Difficulty Level</Text>
                    <View style={styles.gradeContainer}>
                      {['Easy', 'Medium', 'Hard'].map((diff) => {
                        const active = difficultyLevel === diff;
                        return (
                          <TouchableOpacity 
                            key={diff} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setDifficultyLevel(diff)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive]}>{diff}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}

              {activeTool?.id === 'story_book' && (
                <>
                  {/* Genre Selection */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Story Genre</Text>
                    <View style={styles.gradeContainer}>
                      {['Adventure', 'Fairy Tale', 'Science Fiction'].map((g) => {
                        const active = storyGenre === g;
                        return (
                          <TouchableOpacity 
                            key={g} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setStoryGenre(g)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive, { fontSize: 10.5 }]}>{g}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Moral Focus Selection */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Moral Value Focus</Text>
                    <View style={styles.gradeContainer}>
                      {['Cooperation', 'Kindness', 'Honesty'].map((m) => {
                        const active = moralFocus === m;
                        return (
                          <TouchableOpacity 
                            key={m} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setMoralFocus(m)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive]}>{m}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}

              {activeTool?.id === 'presentation' && (
                <>
                  {/* Slide Count Selection */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Number of Slides</Text>
                    <View style={styles.gradeContainer}>
                      {['3 Slides', '5 Slides', '10 Slides'].map((s) => {
                        const active = slideCount === s;
                        return (
                          <TouchableOpacity 
                            key={s} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setSlideCount(s)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive]}>{s}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Presentation Style Theme */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Presentation Style Theme</Text>
                    <View style={styles.gradeContainer}>
                      {['Creative Colorful', 'Minimal Academic', 'Clean Professional'].map((style) => {
                        const active = presentationStyle === style;
                        return (
                          <TouchableOpacity 
                            key={style} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setPresentationStyle(style)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive, { fontSize: 10.5 }]}>{style}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}

              {activeTool?.id === 'excel_gen' && (
                <>
                  {/* Student Count */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Target Student Count</Text>
                    <View style={styles.gradeContainer}>
                      {['5 Students', '10 Students', '15 Students'].map((count) => {
                        const active = studentCount === count;
                        return (
                          <TouchableOpacity 
                            key={count} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setStudentCount(count)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive]}>{count}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  {/* Sheet Columns Type */}
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Grading Sheet Columns</Text>
                    <View style={styles.gradeContainer}>
                      {['Grades Summary', 'Weekly Attendance', 'Test Scores'].map((type) => {
                        const active = sheetType === type;
                        return (
                          <TouchableOpacity 
                            key={type} 
                            style={[styles.gradeChip, active && styles.gradeChipActive]}
                            onPress={() => setSheetType(type)}
                            activeOpacity={0.8}
                          >
                            <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive, { fontSize: 10.5 }]}>{type}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}

              {/* Prompt Topic field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{activeTool?.promptLabel} <Text style={{ color: '#E11D48' }}>*</Text></Text>
                <TextInput
                  style={styles.formTextArea}
                  multiline={true}
                  numberOfLines={4}
                  value={topicInput}
                  onChangeText={setTopicInput}
                  placeholder={activeTool?.placeholder}
                  placeholderTextColor="#94A3B8"
                  textAlignVertical="top"
                />
              </View>

              {/* Grade Level Selector */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Target Grade Level</Text>
                <View style={styles.gradeContainer}>
                  {['Grade-I', 'Grade-II', 'Grade-III'].map((g) => {
                    const active = gradeInput === g;
                    return (
                      <TouchableOpacity 
                        key={g} 
                        style={[styles.gradeChip, active && styles.gradeChipActive]}
                        onPress={() => setGradeInput(g)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.gradeChipText, active && styles.gradeChipTextActive]}>{g}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Action Submit Button */}
              <TouchableOpacity 
                style={[styles.draftBtn, { backgroundColor: activeTool?.color }]}
                onPress={handleDraftWithAI}
                disabled={drafting}
                activeOpacity={0.85}
              >
                {drafting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <LinearGradient
                    colors={[activeTool?.color || '#0052cc', '#0A1F5C']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.draftBtnGrad}
                  >
                    <MaterialIcons name="auto-awesome" size={16} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.draftBtnText}>Draft with AI</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>

              {/* AI Result Block */}
              {draftResult && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>Generated Draft:</Text>
                  <View style={styles.resultBox}>
                    <Text style={styles.resultText}>{draftResult}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.copyBtn}
                    onPress={() => alert('Draft copied to clipboard!')}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="content-copy" size={14} color="#0052cc" />
                    <Text style={styles.copyBtnText}>Copy Draft</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  </View>
);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // App Bar
  appBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 11,
    borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backButton: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0A1F5C',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  appBarIconButton: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
  },

  // Scroll Content
  scrollContent: {
    paddingBottom: 60,
  },

  // Hero Banner Gradient
  heroBanner: {
    margin: 12,
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    shadowColor: '#091E42',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  glassTopShine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  heroAuroraSphere: {
    position: 'absolute', borderRadius: 999,
  },
  heroOrbContainer: {
    position: 'absolute',
    right: 4,
    top: '50%',
    marginTop: -40,
    zIndex: 3,
  },
  heroTextContainer: {
    width: '68%',
    zIndex: 2,
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 204, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 204, 0.25)',
    borderRadius: 16, paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: 8.5, fontWeight: '900', color: '#00FFCC', letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    marginTop: 4,
  },
  heroSubtitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#E2E8F0',
    lineHeight: 14,
    marginTop: 2,
    opacity: 0.95,
  },

  // Search input
  searchSection: { paddingHorizontal: 12, marginTop: 8, marginBottom: 6 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    height: 36,
  },
  searchIconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  searchInput:   { flex: 1, height: 36, fontSize: 12.5, fontWeight: '600', color: '#0F172A' },

  // Category sections
  categorySection: {
    marginTop: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 2,
  },
  categoryHeaderBullet: {
    width: 5,
    height: 12,
    borderRadius: 2.5,
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  gridRow: {
    gap: 10,
  },

  // Tool Card
  toolCard: {
    flexDirection: 'row',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 64,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  leftAccentBar: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  cardWaveBackground: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },
  cardWatermarkContainer: {
    position: 'absolute',
    right: 40,
    top: 0,
    bottom: 0,
    width: 70,
    justifyContent: 'center',
    alignItems: 'flex-end',
    opacity: 0.12,
  },
  cardMetaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 5,
    borderWidth: 0.8,
  },
  cardMetaBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  toolMeta: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  toolName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0A1F5C',
    letterSpacing: 0.1,
  },
  toolDesc: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    lineHeight: 16,
  },
  chevronWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },

  // Empty state search
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 8,
  },
  emptySearchText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '800',
  },

  // Modal styling
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  formHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalHeaderIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  formCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
    paddingBottom: 40,
  },
  formGroup: {
    gap: 7,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  formTextArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 12,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '600',
    minHeight: 90,
  },
  gradeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  gradeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  gradeChipActive: {
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    borderColor: '#0052cc',
  },
  gradeChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  gradeChipTextActive: {
    color: '#0052cc',
    fontWeight: '800',
  },
  draftBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    height: 48,
  },
  draftBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  draftBtnText: {
    color: '#fff',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  // Results styling
  resultContainer: {
    marginTop: 16,
    gap: 8,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  resultBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  resultText: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 19,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#0052cc',
    borderRadius: 12,
    marginTop: 4,
  },
  copyBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0052cc',
  },
});
