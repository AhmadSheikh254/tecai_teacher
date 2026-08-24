import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  useWindowDimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface MoreHubScreenProps {
  navigation: any;
}

export const MoreHubScreen: React.FC<MoreHubScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 340;

  const safeNavigate = (target: string) => {
    navigation.navigate(target);
  };

  // Fully detailed module configs with custom theme colors, subtitles, active badge tags, card backgrounds, and module coordinates
  const modules = [
    { 
      title: 'Lesson Planner', 
      icon: 'event-note', 
      target: 'LessonPlan', 
      color: '#d97706', // Gold/Amber
      bg: 'rgba(217, 119, 6, 0.1)', 
      cardBg: '#FFFBEB', // Light amber tint
      meta: 'Syllabus & Schedules', 
      badge: 'Term 1',
      code: 'SYS-LP04'
    },
    { 
      title: 'Students', 
      icon: 'groups', 
      target: 'Students', 
      color: '#059669', // Emerald Green
      bg: 'rgba(5, 150, 105, 0.1)', 
      cardBg: '#F0FDF4', // Light emerald tint
      meta: 'Class Directories', 
      badge: '48 Active',
      code: 'SYS-ST05'
    },
    { 
      title: 'Class Time Table', 
      icon: 'schedule', 
      target: 'TimeTable', 
      color: '#8b5cf6', // Violet
      bg: 'rgba(139, 92, 246, 0.1)', 
      cardBg: '#FAF5FF', // Light violet tint
      meta: 'Daily Period Slots', 
      badge: 'Today',
      code: 'SYS-TT07'
    },
    { 
      title: 'Daily Attendance', 
      icon: 'how-to-reg', 
      target: 'Attendance', 
      color: '#06b6d4', // Cyan
      bg: 'rgba(6, 182, 212, 0.1)', 
      cardBg: '#ECFEFF', // Light cyan tint
      meta: 'Roll Call Records', 
      badge: '94%',
      code: 'SYS-AT06'
    },
    { 
      title: 'Exam Management', 
      icon: 'history-edu', 
      target: 'Exam', 
      color: '#0052cc', // Royal Blue
      bg: 'rgba(0, 82, 204, 0.1)', 
      cardBg: '#F0F9FF', // Light sky tint
      meta: 'Tests & Grading', 
      badge: '2 New',
      code: 'SYS-EX02'
    },
    { 
      title: 'Salary Payment', 
      icon: 'payments', 
      target: 'Salary', 
      color: '#e11d48', // Crimson Rose
      bg: 'rgba(225, 29, 72, 0.1)', 
      cardBg: '#FFF1F2', // Light rose tint
      meta: 'Payroll & Slips', 
      badge: 'Paid',
      code: 'SYS-SL08'
    }
  ];

  // Helper to chunk elements for standard rows
  const chunkArray = (arr: any[], size: number) => {
    const chunked = [];
    for (let i = 0; i < arr.length; i += size) {
      chunked.push(arr.slice(i, i + size));
    }
    return chunked;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Ambient background glows for 3D depth */}
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />
      <View style={styles.bgGlow3} />

      {/* Upgraded Premium Header Bar */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarBorderRing}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCP8Fes6Wf9DdkJS-k33oTvc53T3DDc43ixr_T8hwh_pr7sY__yCD2W_7u82_wSOmxr5bh8BWjPCpfyruGFXgrPxwBnxu3LTADJnrW1Pyal-Qu22X6blXtzKTJ1Qq9MSu3lKFCjAiSBqPq2uZCCOWWLFfJ_afO1UosCa0JnsAyjMZTLqPq-T2HkOCTCMpG_U0QCY9cje_vqA6rxLx33tk9UUSBSy0TQyKocGDGSGQPP-eLL9BRYsDjQTw' }}
              style={styles.profilePic}
            />
            <View style={styles.activeIndicatorDot} />
          </View>
          <View style={{ marginLeft: 2 }}>
            <Text style={styles.headerWelcome}>Welcome back,</Text>
            <Text style={styles.headerTitle}>Teacher Hub</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
          <View style={styles.notificationWrapper}>
            <MaterialIcons name="notifications-none" size={24} color="#0052cc" />
            <View style={styles.notificationBadgeDot} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* FLAGSHIP FEATURE: Standalone Premium AI Card */}
        <TouchableOpacity 
          style={styles.aiCard}
          activeOpacity={0.8}
          onPress={() => safeNavigate('AIToolkit')}
        >
          {/* Layered luminous background gradients */}
          <LinearGradient
            colors={['#F1F5F9', '#E0EBFF', '#D6E4FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Diagonal sheen glare sheet */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Glowing colorful mesh layers for futuristic depth */}
          <View style={styles.aiMeshCyan} pointerEvents="none" />
          <View style={styles.aiMeshIndigo} pointerEvents="none" />
          <View style={styles.aiMeshBlue} pointerEvents="none" />

          {/* Cybernetic AI Head Watermark Graphic matching user reference */}
          <Image 
            source={require('../../../assets/ai_cyber_head.jpg')} 
            style={styles.aiCyberHeadWatermark}
            resizeMode="cover"
          />

           {/* Connected neural node network constellation */}
          <View style={styles.aiNeuralNetwork} pointerEvents="none">
            {/* Node 1 */}
            <View style={[styles.aiNode, { top: 24, right: 225 }]} />
            {/* Link 1-2 */}
            <View style={[styles.aiNodeLink, { top: 25, right: 171, width: 56, transform: [{ rotate: '5deg' }] }]} />
            {/* Node 2 */}
            <View style={[styles.aiNode, { top: 28, right: 167 }]} />
            {/* Link 2-3 */}
            <View style={[styles.aiNodeLink, { top: 62, right: 143, width: 46, transform: [{ rotate: '115deg' }] }]} />
            {/* Node 3 */}
            <View style={[styles.aiNode, { top: 92, right: 147 }]} />
            {/* Link 3-4 */}
            <View style={[styles.aiNodeLink, { top: 108, right: 149, width: 78, transform: [{ rotate: '-25deg' }] }]} />
            {/* Node 4 */}
            <View style={[styles.aiNode, { top: 122, right: 225 }]} />
            
            {/* Glowing Constellation Particles */}
            <View style={[styles.aiParticle, { top: 40, right: 315 }]} />
            <View style={[styles.aiParticle, { top: 95, right: 255, width: 4, height: 4, backgroundColor: '#00D8F6' }]} />
            <View style={[styles.aiParticle, { bottom: 35, right: 195 }]} />
            <View style={[styles.aiParticle, { bottom: 65, right: 345 }]} />
          </View>

          {/* Connected abstract node layout guides watermark */}
          <View style={styles.aiBlueprintGridH} pointerEvents="none" />
          <View style={styles.aiBlueprintGridV} pointerEvents="none" />
          
          {/* Soft background sparkles watermark */}
          <View style={styles.aiSparkWatermarkBox} pointerEvents="none">
            <MaterialIcons name="auto-awesome" size={130} color="rgba(0, 82, 204, 0.02)" />
          </View>

          {/* Left indicator accent border */}
          <View style={styles.aiLeftBorderHighlight} />

          {/* TOP ROW: Core AI Bot Icon + Top Right Info Panel */}
          <View style={styles.aiTopRow}>
            {/* Core Apple Intelligence / Gemini Glassmorphic AI Gem Icon */}
            <View style={styles.aiGemIconWrapper}>
              <LinearGradient
                colors={['#0C3090', '#0052cc', '#00D8F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              {/* Glass Top Sheen Reflection */}
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0)']}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <MaterialIcons name="auto-awesome" size={26} color="#ffffff" />
            </View>

            <View style={styles.aiTopRightMeta} />
          </View>

          {/* MIDDLE ROW: Main Title + Subtitle */}
          <View style={styles.aiTextContainer}>
            <Text style={styles.aiCardTitle}>AI Toolkit & Slides</Text>
            <View style={styles.aiSubtitleRow}>
              <MaterialIcons name="auto-awesome" size={13} color="#0052cc" />
              <Text style={styles.aiCardSubtitle}>AI Copilot & Assets</Text>
            </View>
          </View>

          {/* BOTTOM RIGHT: Glassmorphic Circular Action Button */}
          <View style={styles.aiActionOrbitalTrack}>
            <View style={styles.aiActionCircleInner}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(224, 234, 255, 0.65)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <MaterialIcons name="arrow-forward" size={16} color="#0052cc" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Module Grid Container (2-Column Grid starting from Row 2) */}
        <View style={styles.gridContainer}>
          {chunkArray(modules, 2).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((item, index) => {
                // SPECIAL DETAILED 2-COLUMN CARD 1: Exam Management
                if (item.target === 'Exam') {
                  return (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.card, styles.examGridCard]}
                      activeOpacity={0.8}
                      onPress={() => safeNavigate('Exam')}
                    >
                      {/* Luminous Light Blue Background Gradient */}
                      <LinearGradient
                        colors={['#F8FAFC', '#EFF6FF', '#E0E7FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      {/* Diagonal Glass Sheen Glare */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.55)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />

                      {/* Corner Glow Mesh */}
                      <View style={[styles.cardMeshGlow, { backgroundColor: 'rgba(0, 82, 204, 0.14)' }]} pointerEvents="none" />

                      {/* Left Accent Border Strip */}
                      <View style={[styles.gridLeftBorder, { backgroundColor: '#0052cc' }]} />

                      {/* Ultra-Premium Tilted Exam Document Illustration */}
                      <View style={styles.examGridVisualSheet} pointerEvents="none">
                        {/* Glass Sheen on Document */}
                        <LinearGradient
                          colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={StyleSheet.absoluteFill}
                          pointerEvents="none"
                        />
                        {/* Header Strip */}
                        <View style={styles.examDocHeader}>
                          <View style={styles.examDocHeaderDot} />
                          <View style={styles.examDocHeaderLine} />
                          <View style={styles.examDocScoreBadge}>
                            <Text style={styles.examDocScoreText}>A+</Text>
                          </View>
                        </View>
                        {/* Divider */}
                        <View style={styles.examDocDivider} />
                        {/* Row 1 */}
                        <View style={styles.examDocRow}>
                          <View style={[styles.examDocCheck, { backgroundColor: '#0052cc' }]}>
                            <MaterialIcons name="check" size={6} color="#fff" />
                          </View>
                          <View style={styles.examDocCapsuleFull}>
                            <View style={[styles.examDocCapsuleFill, { width: '80%', backgroundColor: '#0052cc' }]} />
                          </View>
                          <Text style={styles.examDocPercent}>80%</Text>
                        </View>
                        {/* Row 2 */}
                        <View style={styles.examDocRow}>
                          <View style={[styles.examDocCheck, { backgroundColor: 'rgba(0,82,204,0.55)' }]}>
                            <MaterialIcons name="check" size={6} color="#fff" />
                          </View>
                          <View style={styles.examDocCapsuleFull}>
                            <View style={[styles.examDocCapsuleFill, { width: '60%', backgroundColor: 'rgba(0,82,204,0.45)' }]} />
                          </View>
                          <Text style={styles.examDocPercent}>60%</Text>
                        </View>
                        {/* Row 3 */}
                        <View style={styles.examDocRow}>
                          <View style={[styles.examDocCheck, { backgroundColor: 'rgba(0,82,204,0.28)' }]}>
                            <MaterialIcons name="schedule" size={6} color="#0052cc" />
                          </View>
                          <View style={styles.examDocCapsuleFull}>
                            <View style={[styles.examDocCapsuleFill, { width: '35%', backgroundColor: 'rgba(0,82,204,0.22)' }]} />
                          </View>
                          <Text style={styles.examDocPercent}>35%</Text>
                        </View>
                      </View>

                      {/* 3x3 Dot Matrix Pattern */}
                      <View style={styles.gridDotMatrix} pointerEvents="none">
                        <View style={styles.dotRow}><View style={styles.dotBlue} /><View style={styles.dotBlue} /><View style={styles.dotBlue} /></View>
                        <View style={styles.dotRow}><View style={styles.dotBlue} /><View style={styles.dotBlue} /><View style={styles.dotBlue} /></View>
                        <View style={styles.dotRow}><View style={styles.dotBlue} /><View style={styles.dotBlue} /><View style={styles.dotBlue} /></View>
                      </View>

                      {/* Top Row: Icon Tile + System Code & Status Badge */}
                      <View style={styles.gridCardTopRow}>
                        <View style={styles.examGridIconTile}>
                          <LinearGradient
                            colors={['#0052cc', '#2563EB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                          <View style={styles.iconGlassShine} />
                          <MaterialIcons name="assignment-turned-in" size={20} color="#ffffff" />
                        </View>

                        {/* No Badge */}
                        <View style={styles.gridCardTopRight} />
                      </View>

                      {/* Bottom Row: Title Block + Halo Action Orb */}
                      <View style={styles.gridCardBottomRow}>
                        <View style={styles.gridTitleBlock}>
                          <Text style={styles.gridCardTitle} numberOfLines={1}>Exam Management</Text>
                          <Text style={styles.gridCardSubtitle} numberOfLines={1}>Tests & Grading</Text>
                        </View>

                        <View style={[styles.gridActionHalo, { borderColor: 'rgba(0, 82, 204, 0.18)' }]}>
                          <View style={styles.gridActionOrbGlass}>
                            <LinearGradient
                              colors={['rgba(255, 255, 255, 0.95)', 'rgba(224, 234, 255, 0.7)']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <MaterialIcons name="arrow-forward" size={13} color="#0052cc" />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }



                // SPECIAL DETAILED 2-COLUMN CARD 3: Lesson Planner
                if (item.target === 'LessonPlan') {
                   return (
                     <TouchableOpacity
                       key={index}
                       style={[styles.card, styles.lessonGridCard]}
                       activeOpacity={0.8}
                       onPress={() => safeNavigate('LessonPlan')}
                     >
                       {/* Amber/Gold Gradient Background */}
                       <LinearGradient
                         colors={['#FFFBEB', '#FEF3C7', '#FDE68A']}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 1 }}
                         style={StyleSheet.absoluteFill}
                       />
                       {/* Glass Sheen Glare */}
                       <LinearGradient
                         colors={['rgba(255,255,255,0.65)', 'rgba(255,255,255,0)']}
                         start={{ x: 0, y: 0 }}
                         end={{ x: 1, y: 1 }}
                         style={StyleSheet.absoluteFill}
                         pointerEvents="none"
                       />
                       {/* Corner Glow Mesh */}
                       <View style={[styles.cardMeshGlow, { backgroundColor: 'rgba(217,119,6,0.12)' }]} pointerEvents="none" />
                       {/* Left Accent Border */}
                       <View style={[styles.gridLeftBorder, { backgroundColor: '#d97706' }]} />
 
                       {/* Premium Calendar Illustration */}
                       <View style={styles.lessonCalendarSheet} pointerEvents="none">
                         <LinearGradient
                           colors={['rgba(255,255,255,0.94)', 'rgba(254,243,199,0.5)']}
                           start={{ x: 0, y: 0 }}
                           end={{ x: 0, y: 1 }}
                           style={StyleSheet.absoluteFill}
                           pointerEvents="none"
                         />
                         {/* Calendar Header */}
                         <View style={styles.lessonCalHeader}>
                           <View style={[styles.lessonCalHeaderDot, { backgroundColor: '#d97706' }]} />
                           <View style={[styles.lessonCalHeaderLine, { backgroundColor: 'rgba(217,119,6,0.25)' }]} />
                         </View>
                         {/* Divider */}
                         <View style={styles.lessonCalDivider} />
                         {/* Week grid: 5 day columns */}
                         <View style={styles.lessonCalWeekRow}>
                           {['M','T','W','T','F'].map((d, i) => (
                             <View key={i} style={[styles.lessonCalDayCell, i === 2 && { backgroundColor: '#d97706', borderColor: '#fbbf24' }]}>
                               <Text style={[styles.lessonCalDayText, i === 2 && { color: '#ffffff', fontWeight: '900' }]}>{d}</Text>
                             </View>
                           ))}
                         </View>
                         {/* Subject slots row */}
                         <View style={styles.lessonCalSlotRow}>
                           <View style={[styles.lessonCalSlot, { backgroundColor: 'rgba(217,119,6,0.18)', flex: 2 }]} />
                           <View style={[styles.lessonCalSlot, { backgroundColor: 'rgba(217,119,6,0.10)', flex: 1 }]} />
                           <View style={[styles.lessonCalSlot, { backgroundColor: 'rgba(217,119,6,0.22)', flex: 1.5 }]} />
                         </View>
                         {/* Second slots row */}
                         <View style={styles.lessonCalSlotRow}>
                           <View style={[styles.lessonCalSlot, { backgroundColor: 'rgba(217,119,6,0.10)', flex: 1 }]} />
                           <View style={[styles.lessonCalSlot, { backgroundColor: 'rgba(217,119,6,0.20)', flex: 2 }]} />
                           <View style={[styles.lessonCalSlot, { backgroundColor: 'rgba(217,119,6,0.08)', flex: 1 }]} />
                         </View>
                       </View>
 
                       {/* Dot Matrix */}
                       <View style={styles.gridDotMatrix} pointerEvents="none">
                         <View style={styles.dotRow}><View style={styles.dotOrange} /><View style={styles.dotOrange} /><View style={styles.dotOrange} /></View>
                         <View style={styles.dotRow}><View style={styles.dotOrange} /><View style={styles.dotOrange} /><View style={styles.dotOrange} /></View>
                         <View style={styles.dotRow}><View style={styles.dotOrange} /><View style={styles.dotOrange} /><View style={styles.dotOrange} /></View>
                       </View>
 
                       {/* Top Row: Icon only */}
                       <View style={styles.gridCardTopRow}>
                         <View style={styles.lessonGridIconTile}>
                           <LinearGradient
                             colors={['#d97706', '#fbbf24']}
                             start={{ x: 0, y: 0 }}
                             end={{ x: 1, y: 1 }}
                             style={StyleSheet.absoluteFill}
                           />
                           <View style={styles.iconGlassShine} />
                           <MaterialIcons name="event-note" size={20} color="#ffffff" />
                         </View>
                       </View>
 
                       {/* Bottom Row: Title + Arrow */}
                       <View style={styles.gridCardBottomRow}>
                         <View style={styles.gridTitleBlock}>
                           <Text style={styles.gridCardTitle} numberOfLines={1}>Lesson Planner</Text>
                           <Text style={styles.gridCardSubtitle} numberOfLines={1}>Syllabus & Schedules</Text>
                         </View>
                         <View style={[styles.gridActionHalo, { borderColor: 'rgba(217,119,6,0.18)' }]}>
                           <View style={styles.gridActionOrbGlass}>
                             <LinearGradient
                               colors={['rgba(255,255,255,0.95)', 'rgba(254,243,199,0.7)']}
                               start={{ x: 0, y: 0 }}
                               end={{ x: 1, y: 1 }}
                               style={StyleSheet.absoluteFill}
                             />
                             <MaterialIcons name="arrow-forward" size={13} color="#d97706" />
                           </View>
                         </View>
                       </View>
                     </TouchableOpacity>
                   );
                 }

                // SPECIAL DETAILED 2-COLUMN CARD 4: Students Roster
                if (item.target === 'Students') {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.card, styles.studentGridCard]}
                      activeOpacity={0.8}
                      onPress={() => safeNavigate('Students')}
                    >
                      {/* Emerald Gradient Background */}
                      <LinearGradient
                        colors={['#F0FDF4', '#DCFCE7', '#BBF7D0']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      {/* Glass Sheen Glare */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />
                      {/* Corner Glow Mesh */}
                      <View style={[styles.cardMeshGlow, { backgroundColor: 'rgba(5,150,105,0.12)' }]} pointerEvents="none" />
                      {/* Left Accent Border */}
                      <View style={[styles.gridLeftBorder, { backgroundColor: '#059669' }]} />

                      {/* Premium Student Network Illustration */}
                      <View style={styles.studentNetworkBg} pointerEvents="none">

                        {/* Primary connected lines perfectly aligned to node centers (signs corrected for screen space) */}
                        <View style={[styles.studentNetworkLine, { top: 38, right: 37, width: 55, transform: [{ rotate: '-27deg' }] }]} />
                        <View style={[styles.studentNetworkLine, { top: 65, right: 42, width: 52, transform: [{ rotate: '35deg' }] }]} />
                        <View style={[styles.studentNetworkLine, { top: 53, right: 16, width: 55, transform: [{ rotate: '-83deg' }] }]} />

                        {/* Secondary helper lines for detailed connection density */}
                        <View style={[styles.studentNetworkLineSub, { top: 22, right: 70, width: 34, transform: [{ rotate: '12deg' }] }]} />
                        <View style={[styles.studentNetworkLineSub, { top: 62, right: 90, width: 28, transform: [{ rotate: '-55deg' }] }]} />
                        <View style={[styles.studentNetworkLineSub, { top: 88, right: 22, width: 30, transform: [{ rotate: '-20deg' }] }]} />

                        {/* Auxiliary micro-dots */}
                        <View style={[styles.studentNetworkMiniDot, { top: 26, right: 104 }]} />
                        <View style={[styles.studentNetworkMiniDot, { top: 82, right: 112 }]} />
                        <View style={[styles.studentNetworkMiniDot, { top: 96, right: 16 }]} />

                        {/* Node 1: Top Main Active Avatar */}
                        <View style={[styles.studentNetworkNode, styles.studentNodeLarge, { top: 10, right: 24 }]}>
                          <LinearGradient
                            colors={['#ffffff', 'rgba(209,250,229,0.75)']}
                            style={StyleSheet.absoluteFill}
                          />
                          <MaterialIcons name="person" size={19} color="#059669" />
                          <View style={styles.studentNodeGlowRing} />
                        </View>

                        {/* Node 2: Left Middle Avatar */}
                        <View style={[styles.studentNetworkNode, styles.studentNodeMedium, { top: 38, right: 76 }]}>
                          <LinearGradient
                            colors={['#ffffff', 'rgba(209,250,229,0.55)']}
                            style={StyleSheet.absoluteFill}
                          />
                          <MaterialIcons name="person" size={15} color="rgba(5, 150, 105, 0.75)" />
                        </View>

                        {/* Node 3: Bottom Right Avatar */}
                        <View style={[styles.studentNetworkNode, styles.studentNodeSmall, { top: 70, right: 36 }]}>
                          <LinearGradient
                            colors={['#ffffff', 'rgba(209,250,229,0.45)']}
                            style={StyleSheet.absoluteFill}
                          />
                          <MaterialIcons name="person" size={12} color="rgba(5, 150, 105, 0.6)" />
                        </View>
                      </View>

                      {/* Dot Matrix */}
                      <View style={styles.gridDotMatrix} pointerEvents="none">
                        <View style={styles.dotRow}><View style={styles.dotGreen} /><View style={styles.dotGreen} /><View style={styles.dotGreen} /></View>
                        <View style={styles.dotRow}><View style={styles.dotGreen} /><View style={styles.dotGreen} /><View style={styles.dotGreen} /></View>
                        <View style={styles.dotRow}><View style={styles.dotGreen} /><View style={styles.dotGreen} /><View style={styles.dotGreen} /></View>
                      </View>

                      {/* Top Row: Icon tile only, no badge */}
                      <View style={styles.gridCardTopRow}>
                        <View style={styles.studentGridIconTile}>
                          <LinearGradient
                            colors={['#059669', '#10b981']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                          <View style={styles.iconGlassShine} />
                          <MaterialIcons name="groups" size={20} color="#ffffff" />
                        </View>
                        <View style={styles.gridCardTopRight} />
                      </View>

                      {/* Bottom Row: Title block + Action arrow */}
                      <View style={styles.gridCardBottomRow}>
                        <View style={styles.gridTitleBlock}>
                          <Text style={styles.gridCardTitle} numberOfLines={1}>Students</Text>
                          <Text style={styles.gridCardSubtitle} numberOfLines={1}>Class Directories</Text>
                        </View>
                        <View style={[styles.gridActionHalo, { borderColor: 'rgba(5,150,105,0.18)' }]}>
                          <View style={styles.gridActionOrbGlass}>
                            <LinearGradient
                              colors={['rgba(255, 255, 255, 0.95)', 'rgba(220, 252, 231, 0.7)']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <MaterialIcons name="arrow-forward" size={13} color="#059669" />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }

                // SPECIAL DETAILED 2-COLUMN CARD 5: Daily Attendance
                if (item.target === 'Attendance') {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.card, styles.attendanceGridCard]}
                      activeOpacity={0.8}
                      onPress={() => safeNavigate('Attendance')}
                    >
                      {/* Cyan Gradient Background */}
                      <LinearGradient
                        colors={['#ECFEFF', '#CFFAFE', '#A5F3FC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      {/* Glass Sheen Glare */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />
                      {/* Corner Glow Mesh */}
                      <View style={[styles.cardMeshGlow, { backgroundColor: 'rgba(6,182,212,0.12)' }]} pointerEvents="none" />
                      {/* Left Accent Border */}
                      <View style={[styles.gridLeftBorder, { backgroundColor: '#06b6d4' }]} />

                      {/* Premium Attendance Progress Ring Illustration */}
                      <View style={styles.attendanceProgressContainer} pointerEvents="none">
                        {/* Dotted outer helper circle */}
                        <View style={styles.attendanceProgressDots} />
                        {/* Gauge Ticks */}
                        <View style={styles.attendanceTickTop} />
                        <View style={styles.attendanceTickBottom} />
                        <View style={styles.attendanceTickLeft} />
                        <View style={styles.attendanceTickRight} />
                        {/* Semi-transparent outer ring */}
                        <View style={styles.attendanceProgressRingOuter} />
                        {/* Thin inner concentric ring */}
                        <View style={styles.attendanceProgressRingInner} />
                        {/* Active progress arc */}
                        <View style={styles.attendanceProgressArc} />
                        {/* Active arc indicator head dot at bottom right (approx end of 94% arc) */}
                        <View style={styles.attendanceProgressHeadDot} />
                        {/* Frosted glass inner core */}
                        <View style={styles.attendanceProgressCenter}>
                          <LinearGradient
                            colors={['rgba(255, 255, 255, 0.96)', 'rgba(224, 242, 254, 0.88)']}
                            style={StyleSheet.absoluteFill}
                          />
                          <Text style={styles.attendanceProgressText}>94%</Text>
                          <Text style={styles.attendanceProgressLabel}>RATE</Text>
                        </View>
                      </View>

                      {/* Dot Matrix */}
                      <View style={styles.gridDotMatrix} pointerEvents="none">
                        <View style={styles.dotRow}><View style={styles.dotCyan} /><View style={styles.dotCyan} /><View style={styles.dotCyan} /></View>
                        <View style={styles.dotRow}><View style={styles.dotCyan} /><View style={styles.dotCyan} /><View style={styles.dotCyan} /></View>
                        <View style={styles.dotRow}><View style={styles.dotCyan} /><View style={styles.dotCyan} /><View style={styles.dotCyan} /></View>
                      </View>

                      {/* Top Row: Icon tile only, no badge */}
                      <View style={styles.gridCardTopRow}>
                        <View style={styles.attendanceGridIconTile}>
                          <LinearGradient
                            colors={['#06b6d4', '#22d3ee']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                          <View style={styles.iconGlassShine} />
                          <MaterialIcons name="how-to-reg" size={20} color="#ffffff" />
                        </View>
                        <View style={styles.gridCardTopRight} />
                      </View>

                      {/* Bottom Row: Title block + Action arrow */}
                      <View style={styles.gridCardBottomRow}>
                        <View style={styles.gridTitleBlock}>
                          <Text style={styles.gridCardTitle} numberOfLines={1}>Daily Attendance</Text>
                          <Text style={styles.gridCardSubtitle} numberOfLines={1}>Roll Call Records</Text>
                        </View>
                        <View style={[styles.gridActionHalo, { borderColor: 'rgba(6,182,212,0.18)' }]}>
                          <View style={styles.gridActionOrbGlass}>
                            <LinearGradient
                              colors={['rgba(255, 255, 255, 0.95)', 'rgba(207, 250, 254, 0.7)']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <MaterialIcons name="arrow-forward" size={13} color="#06b6d4" />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }

                // SPECIAL DETAILED 2-COLUMN CARD 6: Class Time Table
                if (item.target === 'TimeTable') {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.card, styles.timetableGridCard]}
                      activeOpacity={0.8}
                      onPress={() => safeNavigate('TimeTable')}
                    >
                      {/* Violet Gradient Background */}
                      <LinearGradient
                        colors={['#FAF5FF', '#F3E8FF', '#E9D5FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      {/* Glass Sheen Glare */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />
                      {/* Corner Glow Mesh */}
                      <View style={[styles.cardMeshGlow, { backgroundColor: 'rgba(139,92,246,0.12)' }]} pointerEvents="none" />
                      {/* Left Accent Border */}
                      <View style={[styles.gridLeftBorder, { backgroundColor: '#8b5cf6' }]} />

                      {/* Premium Timeline Sheet Illustration */}
                      <View style={styles.timetableSheet} pointerEvents="none">
                        <LinearGradient
                          colors={['rgba(255, 255, 255, 0.94)', 'rgba(255, 255, 255, 0.45)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={StyleSheet.absoluteFill}
                          pointerEvents="none"
                        />
                        {/* Glare sheen */}
                        <LinearGradient
                          colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                        {/* Vertical timeline divider line */}
                        <View style={styles.timetableTimelineLine} />
                        {/* Hours list rows with premium split gradient cells */}
                        <View style={styles.timetableRow}>
                          <Text style={styles.timetableHour}>08 AM</Text>
                          <View style={styles.timetableRowDot} />
                          <View style={styles.timetableSlotWrapper}>
                            <LinearGradient
                              colors={['#c084fc', '#a855f7']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.timetableSlotSheen} />
                          </View>
                        </View>

                        <View style={styles.timetableRow}>
                          <Text style={styles.timetableHour}>09 AM</Text>
                          <View style={styles.timetableRowDot} />
                          <View style={[styles.timetableSlotWrapper, { flex: 1.5 }]}>
                            <LinearGradient
                              colors={['#a5f3fc', '#06b6d4']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.timetableSlotSheen} />
                          </View>
                          <View style={[styles.timetableSlotWrapper, { flex: 0.8 }]}>
                            <LinearGradient
                              colors={['#e0e7ff', '#c7d2fe']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                          </View>
                        </View>

                        <View style={styles.timetableRow}>
                          <Text style={styles.timetableHour}>10 AM</Text>
                          <View style={styles.timetableRowDot} />
                          <View style={[styles.timetableSlotWrapper, { flex: 1.2 }]}>
                            <LinearGradient
                              colors={['#fbcfe8', '#db2777']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.timetableSlotSheen} />
                          </View>
                          <View style={{ flex: 1 }} />
                        </View>

                        <View style={styles.timetableRow}>
                          <Text style={styles.timetableHour}>11 AM</Text>
                          <View style={styles.timetableRowDot} />
                          <View style={[styles.timetableSlotWrapper, { flex: 2.2, opacity: 0.35 }]}>
                            <LinearGradient
                              colors={['#f3e8ff', '#e9d5ff']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                          </View>
                        </View>

                        <View style={styles.timetableRow}>
                          <Text style={styles.timetableHour}>12 PM</Text>
                          <View style={styles.timetableRowDot} />
                          <View style={[styles.timetableSlotWrapper, { flex: 1.0 }]}>
                            <LinearGradient
                              colors={['#fde68a', '#f59e0b']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.timetableSlotSheen} />
                          </View>
                          <View style={[styles.timetableSlotWrapper, { flex: 1.2 }]}>
                            <LinearGradient
                              colors={['#c084fc', '#a855f7']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.timetableSlotSheen} />
                          </View>
                        </View>

                        <View style={styles.timetableRow}>
                          <Text style={styles.timetableHour}>01 PM</Text>
                          <View style={styles.timetableRowDot} />
                          <View style={[styles.timetableSlotWrapper, { flex: 1.6 }]}>
                            <LinearGradient
                              colors={['#a7f3d0', '#059669']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <View style={styles.timetableSlotSheen} />
                          </View>
                        </View>
                      </View>

                      {/* Dot Matrix */}
                      <View style={styles.gridDotMatrix} pointerEvents="none">
                        <View style={styles.dotRow}><View style={styles.dotViolet} /><View style={styles.dotViolet} /><View style={styles.dotViolet} /></View>
                        <View style={styles.dotRow}><View style={styles.dotViolet} /><View style={styles.dotViolet} /><View style={styles.dotViolet} /></View>
                        <View style={styles.dotRow}><View style={styles.dotViolet} /><View style={styles.dotViolet} /><View style={styles.dotViolet} /></View>
                      </View>

                      {/* Top Row: Icon tile only, no badge */}
                      <View style={styles.gridCardTopRow}>
                        <View style={styles.timetableGridIconTile}>
                          <LinearGradient
                            colors={['#8b5cf6', '#a78bfa']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                          <View style={styles.iconGlassShine} />
                          <MaterialIcons name="schedule" size={20} color="#ffffff" />
                        </View>
                        <View style={styles.gridCardTopRight} />
                      </View>

                      {/* Bottom Row: Title block + Action arrow */}
                      <View style={styles.gridCardBottomRow}>
                        <View style={styles.gridTitleBlock}>
                          <Text style={styles.gridCardTitle} numberOfLines={1}>Class Time Table</Text>
                          <Text style={styles.gridCardSubtitle} numberOfLines={1}>Daily Period Slots</Text>
                        </View>
                        <View style={[styles.gridActionHalo, { borderColor: 'rgba(139,92,246,0.18)' }]}>
                          <View style={styles.gridActionOrbGlass}>
                            <LinearGradient
                              colors={['rgba(255, 255, 255, 0.95)', 'rgba(243, 232, 255, 0.7)']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <MaterialIcons name="arrow-forward" size={13} color="#8b5cf6" />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }

                // SPECIAL DETAILED 2-COLUMN CARD 6: Salary Payment
                if (item.target === 'Salary') {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.card, styles.salaryGridCard]}
                      activeOpacity={0.8}
                      onPress={() => safeNavigate('Salary')}
                    >
                      {/* Rose/Pink Gradient Background */}
                      <LinearGradient
                        colors={['#FFF1F2', '#FFE4E6', '#FECDD3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      {/* Glass Sheen Glare */}
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.65)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />
                      {/* Corner Glow Mesh */}
                      <View style={[styles.cardMeshGlow, { backgroundColor: 'rgba(225,29,72,0.12)' }]} pointerEvents="none" />
                      {/* Left Accent Border */}
                      <View style={[styles.gridLeftBorder, { backgroundColor: '#e11d48' }]} />

                      {/* Premium Salary Documents & Card Illustration */}
                      <View style={styles.salaryVisualContainer} pointerEvents="none">
                        {/* Receipt Sheet */}
                        <View style={styles.salaryReceiptSheet}>
                          <LinearGradient
                            colors={['rgba(255, 255, 255, 0.94)', 'rgba(254, 226, 226, 0.5)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={StyleSheet.absoluteFill}
                            pointerEvents="none"
                          />
                          <View style={styles.salaryReceiptHeaderLine} />
                          <View style={styles.salaryReceiptLineLong} />
                          <View style={styles.salaryReceiptLineMedium} />
                          <View style={styles.salaryReceiptLineShort} />
                        </View>

                        {/* Credit Card overlapping in front */}
                        <View style={styles.salaryCreditCard}>
                          <LinearGradient
                            colors={['#e11d48', '#fb7185']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                          <View style={styles.creditCardGlassSheen} />
                          {/* Credit card chip */}
                          <View style={styles.creditCardChip}>
                            <View style={styles.chipInnerLineH} />
                            <View style={styles.chipInnerLineV} />
                          </View>
                          {/* Credit card signal icon */}
                          <View style={styles.creditCardContactless}>
                            <MaterialIcons name="wifi" size={5} color="rgba(255, 255, 255, 0.95)" style={{ transform: [{ rotate: '90deg' }] }} />
                          </View>
                          {/* Mock card number text */}
                          <Text style={styles.creditCardNumberText}>••••  ••••  ••••  8829</Text>
                          <View style={styles.creditCardMetaRow}>
                            <Text style={styles.creditCardMetaText}>PAYSLIP</Text>
                            {/* Brand circles */}
                            <View style={{ flexDirection: 'row', gap: 1.5, alignItems: 'center' }}>
                              <View style={[styles.creditCardLogoOrb, { backgroundColor: '#ffffff', opacity: 0.85 }]} />
                              <View style={[styles.creditCardLogoOrb, { backgroundColor: '#fef08a', opacity: 0.85, marginLeft: -3 }]} />
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Dot Matrix */}
                      <View style={styles.gridDotMatrix} pointerEvents="none">
                        <View style={styles.dotRow}><View style={styles.dotRose} /><View style={styles.dotRose} /><View style={styles.dotRose} /></View>
                        <View style={styles.dotRow}><View style={styles.dotRose} /><View style={styles.dotRose} /><View style={styles.dotRose} /></View>
                        <View style={styles.dotRow}><View style={styles.dotRose} /><View style={styles.dotRose} /><View style={styles.dotRose} /></View>
                      </View>

                      {/* Top Row: Icon tile only, with badge */}
                      <View style={styles.gridCardTopRow}>
                        <View style={styles.salaryGridIconTile}>
                          <LinearGradient
                            colors={['#e11d48', '#fb7185']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFill}
                          />
                          <View style={styles.iconGlassShine} />
                          <MaterialIcons name="payments" size={20} color="#ffffff" />
                        </View>
                        <View style={[styles.gridBadgePill, { backgroundColor: 'rgba(225,29,72,0.12)', borderColor: 'rgba(225,29,72,0.2)' }]}>
                          <Text style={[styles.gridBadgeText, { color: '#e11d48' }]}>Paid</Text>
                        </View>
                      </View>

                      {/* Bottom Row: Title block + Action arrow */}
                      <View style={styles.gridCardBottomRow}>
                        <View style={styles.gridTitleBlock}>
                          <Text style={styles.gridCardTitle} numberOfLines={1}>Salary Payment</Text>
                          <Text style={styles.gridCardSubtitle} numberOfLines={1}>Payroll & Slips</Text>
                        </View>
                        <View style={[styles.gridActionHalo, { borderColor: 'rgba(225,29,72,0.18)' }]}>
                          <View style={styles.gridActionOrbGlass}>
                            <LinearGradient
                              colors={['rgba(255, 255, 255, 0.95)', 'rgba(254, 226, 226, 0.7)']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={StyleSheet.absoluteFill}
                            />
                            <MaterialIcons name="arrow-forward" size={13} color="#e11d48" />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }

                // STANDARD 2-COLUMN GRID CARD for remaining modules
                return (
                  <TouchableOpacity 
                    key={index} 
                    style={[
                      styles.card, 
                      { 
                        shadowColor: item.color,
                        backgroundColor: item.cardBg, // Premium custom pastel background
                        borderLeftColor: item.color,   // Left color tag
                        borderLeftWidth: 4.5,          // Bold left accent line
                        paddingVertical: isSmallScreen ? 14 : 18,
                        paddingHorizontal: 16,
                      }
                    ]}
                    activeOpacity={0.78}
                    onPress={() => safeNavigate(item.target)}
                  >
                    {/* Glass Sheen Glare Diagonal Overlay */}
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />

                    {/* Subtle Theme Color Mesh Glow in corner */}
                    <View style={[styles.cardMeshGlow, { backgroundColor: `${item.color}15` }]} pointerEvents="none" />

                    {/* CAD Blueprint Layout Guide Lines */}
                    <View style={styles.blueprintGridH} pointerEvents="none" />
                    <View style={styles.blueprintGridV} pointerEvents="none" />

                    {/* Monospace System Coordinate Code Tag */}
                    <Text style={[styles.moduleCode, { color: `${item.color}45` }]}>{item.code}</Text>

                    {/* SVG/Vector icon watermark in corner */}
                    <View style={styles.watermarkWrapper} pointerEvents="none">
                      <MaterialIcons 
                        name={item.icon as any} 
                        size={84} 
                        color={item.color} 
                        style={styles.cardWatermark} 
                      />
                    </View>

                    {/* Top Row: Glass Icon Box + Pill Badge */}
                    <View style={styles.cardTopRow}>
                      <View style={[styles.iconContainer, { borderColor: `${item.color}25` }]}>
                        {/* Internal Glass Reflection overlay */}
                        <LinearGradient
                          colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)']}
                          style={StyleSheet.absoluteFill}
                        />
                        <MaterialIcons 
                          name={item.icon as any} 
                          size={isSmallScreen ? 20 : 22} 
                          color={item.color} 
                        />
                      </View>
                      {item.badge && (
                        <View style={[styles.cardBadge, { backgroundColor: 'rgba(255, 255, 255, 0.85)', borderColor: `${item.color}35` }]}>
                          <Text style={[styles.cardBadgeText, { color: item.color }]}>{item.badge}</Text>
                        </View>
                      )}
                    </View>

                    {/* Bottom Area: Large Title + Subtitle Description */}
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardText} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.cardMeta} numberOfLines={1}>
                        {item.meta}
                      </Text>
                    </View>

                    {/* Mini Glassmorphic Action Button */}
                    <View style={[styles.cardMiniActionButton, { borderColor: `${item.color}30` }]}>
                      <MaterialIcons name="arrow-forward" size={12} color={item.color} />
                    </View>
                  </TouchableOpacity>
                );
              })}
              {/* Invisible card placeholder to keep alignment perfect for odd items */}
              {row.length === 1 && (
                <View style={styles.cardPlaceholder} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc', // Cool bright background
  },
  // Ambient background glow effects
  bgGlow1: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
    zIndex: 1,
  },
  bgGlow2: {
    position: 'absolute',
    bottom: '20%',
    right: -120,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(124, 58, 237, 0.03)',
    zIndex: 1,
  },
  bgGlow3: {
    position: 'absolute',
    top: '40%',
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(234, 88, 12, 0.02)',
    zIndex: 1,
  },
  // AppBar Layout
  appBar: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 82, 204, 0.06)',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBorderRing: {
    padding: 2,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 82, 204, 0.15)',
    position: 'relative',
  },
  profilePic: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
  },
  activeIndicatorDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10b981', // green active indicator dot
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  headerWelcome: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#0d1b3e',
    marginTop: -2,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.08)',
  },
  notificationWrapper: {
    position: 'relative',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
  },
  // Scroll & Grid Content
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    zIndex: 5,
  },
  gridContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  // Analytics Summary Card
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.05)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
    marginBottom: 12,
  },
  statsCardTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0d1b3e',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statsCardDate: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
  },
  statsGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d1b3e',
  },
  statLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748b',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  // Premium Grid Card Style
  card: {
    width: '48%',
    borderRadius: 22, // Slightly rounder curves
    borderWidth: 1.5,
    borderColor: 'rgba(0, 82, 204, 0.08)',
    position: 'relative',
    overflow: 'hidden',
    // Strong, heavy card shadows for depth
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
    minHeight: 136, // Slightly taller for better content breathing room
    justifyContent: 'space-between',
  },
  cardPlaceholder: {
    width: '48%',
    backgroundColor: 'transparent',
  },
  // Faint background watermark
  watermarkWrapper: {
    position: 'absolute',
    right: -16,
    bottom: -16,
    zIndex: 1,
  },
  cardWatermark: {
    opacity: 0.035, // Extremely subtle so it looks professional
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 5,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff', // Clean white glass box
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  cardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
  },
  cardBadgeText: {
    fontSize: 9.2,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  cardInfo: {
    marginTop: 16,
    zIndex: 5,
    maxWidth: '82%', // Keep room for bottom right action button
  },
  cardText: {
    fontWeight: '900', // Bold/heavy card text
    color: '#0d1b3e',
    fontSize: 14.5,
    letterSpacing: 0.1,
  },
  cardMeta: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '800', // Stronger font weight for subtitle readability
    marginTop: 2,
  },
  cardMeshGlow: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cardMiniActionButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.88)', // Mini glass circular button
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  blueprintGridH: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 82, 204, 0.018)', // Very faint guide lines for engineering feel
  },
  blueprintGridV: {
    position: 'absolute',
    left: 58,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 82, 204, 0.018)',
  },
  moduleCode: {
    position: 'absolute',
    right: 14,
    top: 14,
    fontSize: 8.2,
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  aiCard: {
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 82, 204, 0.08)',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
    minHeight: 168,
    justifyContent: 'space-between',
    // Soft, natural 3D elevation shadow projection
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  aiGlowOrade: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  aiBlueprintGridH: {
    position: 'absolute',
    top: 72,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 82, 204, 0.02)',
  },
  aiBlueprintGridV: {
    position: 'absolute',
    left: 72,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 82, 204, 0.02)',
  },
  aiSparkWatermarkBox: {
    position: 'absolute',
    right: -20,
    top: -10,
    opacity: 0.8,
  },
  aiLeftBorderHighlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5.5,
    backgroundColor: '#0052cc',
    borderTopLeftRadius: 26,
    borderBottomLeftRadius: 26,
  },
  aiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  aiGemIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)', // Crisp top glass border
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 12,
  },
  aiTopRightMeta: {
    alignItems: 'flex-end',
    gap: 4,
    zIndex: 10,
  },
  aiSystemLabel: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    fontWeight: '900',
    color: '#0052cc',
    letterSpacing: 1.5,
  },
  aiActiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // High-legibility frosted glass backdrop
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
  },
  aiActiveBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginRight: 5,
  },
  aiActiveBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10b981',
    letterSpacing: 0.2,
  },
  aiTextContainer: {
    zIndex: 10,
    maxWidth: '62%', // Constrain text to the left side so it doesn't overlap background graphics
    marginTop: 16,
  },
  aiCardTitle: {
    fontWeight: '900',
    color: '#0d1b3e',
    fontSize: 19.5,
    letterSpacing: 0.15,
  },
  aiSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  aiCardSubtitle: {
    fontSize: 12.2,
    color: '#475569',
    fontWeight: '800',
  },
  aiBotGlow: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: 'rgba(0, 216, 246, 0.09)', // Brightened outer glow
  },
  aiBotBody: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0f172a', // Space black helmet
    borderWidth: 2,
    borderColor: '#00D8F6', // Neon cyan outline
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden', // Required for absolute glass shine to crop at border boundary
  },
  aiBotGlassShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', // 3D glass shine reflection
  },
  aiBotEarL: {
    position: 'absolute',
    left: -5,
    width: 7,
    height: 14,
    borderRadius: 3.5,
    backgroundColor: '#0052cc',
    borderWidth: 1.2,
    borderColor: '#00D8F6',
  },
  aiBotEarR: {
    position: 'absolute',
    right: -5,
    width: 7,
    height: 14,
    borderRadius: 3.5,
    backgroundColor: '#0052cc',
    borderWidth: 1.2,
    borderColor: '#00D8F6',
  },
  aiBotOrbitRing: {
    position: 'absolute',
    width: 70,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 216, 246, 0.38)',
    transform: [{ rotate: '-15deg' }],
  },
  aiBotVisor: {
    width: 28,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00D8F6', // Digital display face
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#00D8F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 5,
    marginTop: 4, // Center slightly lower inside helmet
  },
  aiBotEye: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },
  aiBotTelemetryLine: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#00D8F6',
    marginTop: 5,
    opacity: 0.85,
    shadowColor: '#00D8F6',
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  aiBotSpark: {
    position: 'absolute',
    top: -12,
    right: 2,
  },
  aiActionOrbitalTrack: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 82, 204, 0.15)', // Glass track halo
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  aiActionCircleInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#ffffff', // Crisp white glass top stroke
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  aiMeshCyan: {
    position: 'absolute',
    bottom: -60,
    right: 45,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 216, 246, 0.22)', // Neon cyan mesh glow
  },
  aiMeshIndigo: {
    position: 'absolute',
    top: -40,
    right: 125,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(99, 102, 241, 0.16)', // Soft indigo mesh glow
  },
  aiMeshBlue: {
    position: 'absolute',
    top: -50,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Neon blue mesh glow
  },
  aiNeuralNetwork: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  aiNode: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D8F6',
    shadowColor: '#00D8F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  aiNodeLink: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(0, 216, 246, 0.18)',
  },
  aiParticle: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#3b82f6',
    opacity: 0.45,
  },
  aiCyberHeadWatermark: {
    position: 'absolute',
    right: 60,
    bottom: -2,
    width: 175,
    height: 175,
    opacity: 0.32, // Soft translucent watermark blend with clean spacing
    zIndex: 2,
  },
  featuredCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    minHeight: 180,
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  examCard: {
    shadowColor: '#0052cc',
    borderColor: 'rgba(0, 82, 204, 0.1)',
  },
  issueCard: {
    shadowColor: '#ea580c',
    borderColor: 'rgba(234, 88, 12, 0.1)',
  },
  featuredLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  dotMatrixBox: {
    position: 'absolute',
    left: 82,
    top: 22,
    gap: 4,
    opacity: 0.45,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dotBlue: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#0052cc',
  },
  dotOrange: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#ea580c',
  },
  dotTeal: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#0d9488',
  },
  dotGreen: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#16a34a',
  },
  dotCyan: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#0891b2',
  },
  dotViolet: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#7c3aed',
  },
  dotRose: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#e11d48',
  },
  examVisualSheet: {
    position: 'absolute',
    right: 50,
    bottom: -15,
    width: 140,
    height: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.12)',
    transform: [{ rotate: '-8deg' }],
    gap: 10,
  },
  examVisualRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  examVisualLineLong: {
    height: 4,
    width: 80,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 82, 204, 0.12)',
  },
  examVisualLineMedium: {
    height: 4,
    width: 60,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 82, 204, 0.12)',
  },
  examVisualLineShort: {
    height: 4,
    width: 40,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 82, 204, 0.12)',
  },
  issueVisualTriangleBox: {
    position: 'absolute',
    right: 20,
    bottom: -15,
    opacity: 0.9,
  },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    zIndex: 10,
  },
  examIconTile: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  issueIconTile: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  iconGlassShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 24,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  featuredTopRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  systemCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredSystemCode: {
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: 1,
  },
  featuredBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  badgePillText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  featuredTitleBlock: {
    marginTop: 14,
    marginBottom: 14,
    zIndex: 10,
  },
  featuredCardTitle: {
    fontSize: 19.5,
    fontWeight: '900',
    color: '#0d1b3e',
    letterSpacing: 0.1,
  },
  featuredCardSubtitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2,
  },
  featuredBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  bottomInfoCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    maxWidth: '74%',
  },
  infoCapsuleTextCol: {
    gap: 1,
  },
  infoCapsuleTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0d1b3e',
  },
  infoCapsuleDesc: {
    fontSize: 9.8,
    fontWeight: '700',
    color: '#64748b',
  },
  featuredActionHalo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredActionBtnInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  // 2-Column Detailed Card Styles for Exam Management & Report Issues
  examGridCard: {
    padding: 14,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderColor: 'rgba(0, 82, 204, 0.16)',
  },
  issueGridCard: {
    padding: 14,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderColor: 'rgba(234, 88, 12, 0.16)',
  },
  lessonGridCard: {
    padding: 14,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderColor: 'rgba(217, 119, 6, 0.16)',
  },
  studentGridCard: {
    padding: 14,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderColor: 'rgba(5, 150, 105, 0.16)',
  },
  attendanceGridCard: {
    padding: 14,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderColor: 'rgba(6, 182, 212, 0.16)',
  },
  timetableGridCard: {
    padding: 14,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderColor: 'rgba(139, 92, 246, 0.16)',
  },
  salaryGridCard: {
    padding: 14,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderColor: 'rgba(225, 29, 72, 0.16)',
  },
  complaintGridCard: {
    padding: 14,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,
    borderColor: 'rgba(225, 29, 72, 0.16)',
  },
  gridLeftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4.5,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  gridDotMatrix: {
    position: 'absolute',
    left: 60,
    top: 14,
    gap: 4,
    opacity: 0.28,
  },
  lessonCalendarSheet: {
    position: 'absolute',
    right: 6,
    top: 24,
    width: 100,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.1)',
    transform: [{ rotate: '5deg' }],
    opacity: 0.82,
    overflow: 'hidden',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
    gap: 4,
  },
  lessonCalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lessonCalHeaderDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#d97706',
  },
  lessonCalHeaderLine: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(217, 119, 6, 0.18)',
  },
  lessonCalHeaderBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: '#d97706',
  },
  lessonCalHeaderBadgeText: {
    fontSize: 6.5,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  lessonCalDivider: {
    height: 1,
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    borderRadius: 1,
  },
  lessonCalWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 2,
  },
  lessonCalDayCell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCalDayCellActive: {
    backgroundColor: '#d97706',
  },
  lessonCalDayText: {
    fontSize: 5,
    fontWeight: '700',
    color: '#64748b',
  },
  lessonCalDayTextActive: {
    color: '#ffffff',
  },
  lessonCalSlotRow: {
    flexDirection: 'row',
    gap: 3,
  },
  lessonCalSlot: {
    height: 5,
    borderRadius: 2,
  },
  studentNetworkBg: {
    position: 'absolute',
    right: 16,
    top: 14,
    width: 120,
    height: 95,
  },
  studentNetworkCanvas: {
    position: 'absolute',
    left: 8,
    top: 4,
    width: 104,
    height: 86,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.12)',
    transform: [{ rotate: '-6deg' }],
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },
  studentNetworkLine: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: 'rgba(5, 150, 105, 0.28)',
  },
  studentNetworkLineSub: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(5, 150, 105, 0.12)',
    borderStyle: 'dashed',
  },
  studentNetworkMiniDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(5, 150, 105, 0.25)',
  },
  studentNetworkNode: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  studentNodeLarge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    zIndex: 3,
  },
  studentNodeMedium: {
    width: 26,
    height: 26,
    borderRadius: 13,
    zIndex: 2,
  },
  studentNodeSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  studentNodeGlowRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.18)',
    top: -7,
    left: -7,
  },
  attendanceProgressContainer: {
    position: 'absolute',
    right: 32,
    top: 14,
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceProgressDots: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.2,
    borderStyle: 'dashed',
    borderColor: 'rgba(6, 182, 212, 0.32)',
    opacity: 0.95,
  },
  attendanceProgressRingOuter: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: 'rgba(6, 182, 212, 0.12)',
  },
  attendanceProgressRingInner: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.15)',
  },
  attendanceProgressArc: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: '#06b6d4',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '40deg' }],
  },
  attendanceTickTop: {
    position: 'absolute',
    top: 2,
    width: 1.5,
    height: 4.5,
    backgroundColor: 'rgba(6, 182, 212, 0.5)',
  },
  attendanceTickBottom: {
    position: 'absolute',
    bottom: 2,
    width: 1.5,
    height: 4.5,
    backgroundColor: 'rgba(6, 182, 212, 0.5)',
  },
  attendanceTickLeft: {
    position: 'absolute',
    left: 2,
    width: 4.5,
    height: 1.5,
    backgroundColor: 'rgba(6, 182, 212, 0.5)',
  },
  attendanceTickRight: {
    position: 'absolute',
    right: 2,
    width: 4.5,
    height: 1.5,
    backgroundColor: 'rgba(6, 182, 212, 0.5)',
  },
  attendanceProgressHeadDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#ffffff',
    borderColor: '#06b6d4',
    borderWidth: 2,
    bottom: 14,
    right: 14,
    zIndex: 10,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  attendanceProgressCenter: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 2,
  },
  attendanceProgressText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#06b6d4',
    letterSpacing: 0.2,
    zIndex: 2,
    marginTop: 4,
  },
  attendanceProgressLabel: {
    fontSize: 5,
    fontWeight: '800',
    color: '#0891b2',
    letterSpacing: 0.5,
    zIndex: 2,
    marginTop: -2,
    marginBottom: 4,
  },
  attendanceGridIconTile: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 5,
  },
  timetableSheet: {
    position: 'absolute',
    right: 14,
    top: 10,
    width: 106,
    height: 94,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
    transform: [{ rotate: '4deg' }],
    opacity: 0.82,
    overflow: 'hidden',
    padding: 8,
    gap: 5,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },
  timetableTimelineLine: {
    position: 'absolute',
    left: 33,
    top: 6,
    bottom: 6,
    width: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  timetableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timetableHour: {
    fontSize: 5.5,
    fontWeight: '800',
    color: '#8b5cf6',
    width: 23,
    letterSpacing: 0.2,
  },
  timetableRowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8b5cf6',
    zIndex: 5,
    marginLeft: 0,
    marginRight: 6,
  },
  timetableSlot: {
    height: 5.5,
    borderRadius: 2.2,
  },
  timetableSlotWrapper: {
    flex: 2,
    height: 5.5,
    borderRadius: 2.2,
    overflow: 'hidden',
    position: 'relative',
  },
  timetableSlotSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2.2,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  timetableGridIconTile: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 5,
  },
  salaryVisualContainer: {
    position: 'absolute',
    right: 8,
    top: 14,
    width: 110,
    height: 95,
    overflow: 'visible',
  },
  salaryReceiptSheet: {
    position: 'absolute',
    left: 4,
    top: 2,
    width: 75,
    height: 68,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.1)',
    transform: [{ rotate: '-8deg' }],
    opacity: 0.85,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 4,
  },
  salaryReceiptHeaderLine: {
    height: 4,
    width: 22,
    borderRadius: 2,
    backgroundColor: 'rgba(225, 29, 72, 0.22)',
    marginBottom: 2,
  },
  salaryReceiptLineLong: {
    height: 3,
    width: 50,
    borderRadius: 1.5,
    backgroundColor: 'rgba(225, 29, 72, 0.12)',
  },
  salaryReceiptLineMedium: {
    height: 3,
    width: 40,
    borderRadius: 1.5,
    backgroundColor: 'rgba(225, 29, 72, 0.12)',
  },
  salaryReceiptLineShort: {
    height: 3,
    width: 25,
    borderRadius: 1.5,
    backgroundColor: 'rgba(225, 29, 72, 0.12)',
  },
  salaryCreditCard: {
    position: 'absolute',
    bottom: 18,
    right: 10,
    width: 62,
    height: 42,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ rotate: '8deg' }],
    overflow: 'hidden',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  creditCardGlassSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  creditCardChip: {
    width: 9,
    height: 7,
    borderRadius: 1.5,
    backgroundColor: '#fef08a',
    position: 'absolute',
    top: 9,
    left: 8,
    opacity: 0.95,
    overflow: 'hidden',
  },
  chipInnerLineH: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 0.8,
    backgroundColor: 'rgba(225, 29, 72, 0.45)',
  },
  chipInnerLineV: {
    position: 'absolute',
    left: 4,
    top: 0,
    bottom: 0,
    width: 0.8,
    backgroundColor: 'rgba(225, 29, 72, 0.45)',
  },
  creditCardContactless: {
    position: 'absolute',
    top: 9,
    left: 20,
    opacity: 0.85,
  },
  creditCardNumberText: {
    fontFamily: 'Courier',
    fontSize: 4,
    fontWeight: '900',
    color: '#ffffff',
    position: 'absolute',
    top: 20,
    left: 8,
    letterSpacing: 0.4,
    opacity: 0.95,
  },
  creditCardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 27,
    left: 8,
    right: 12,
  },
  creditCardMetaText: {
    fontSize: 3.2,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.1,
  },
  creditCardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 4,
    left: 8,
    right: 8,
  },
  creditCardHologram: {
    width: 8,
    height: 6,
    borderRadius: 1.2,
    overflow: 'hidden',
    opacity: 0.8,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  creditCardLogoOrb: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
  },
  salaryGridIconTile: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 5,
  },
  complaintVisualContainer: {
    position: 'absolute',
    right: 10,
    top: 12,
    width: 110,
    height: 95,
    overflow: 'visible',
  },
  complaintBubbleLeftWrapper: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 68,
    height: 48,
    zIndex: 2,
  },
  complaintBubbleLeft: {
    width: 66,
    height: 46,
    borderRadius: 14,
    padding: 8,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    transform: [{ rotate: '-6deg' }],
    opacity: 0.88,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    gap: 5,
    overflow: 'hidden',
  },
  complaintBubbleTailLeft: {
    position: 'absolute',
    bottom: -2.5,
    left: 16,
    width: 5,
    height: 5,
    borderWidth: 1.2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    backgroundColor: '#fda4af',
    transform: [{ rotate: '45deg' }],
    zIndex: -1,
  },
  complaintBubbleGlanceSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
  },
  complaintBubbleLineLong: {
    height: 3,
    width: 44,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  complaintBubbleLineMedium: {
    height: 3,
    width: 34,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  complaintBubbleLineShort: {
    height: 3,
    width: 22,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  complaintBubbleDiamond: {
    position: 'absolute',
    bottom: 6,
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    transform: [{ rotate: '45deg' }],
  },
  complaintBubbleRightWrapper: {
    position: 'absolute',
    right: 12,
    bottom: 18,
    width: 62,
    height: 44,
    zIndex: 1,
  },
  complaintBubbleRight: {
    width: 60,
    height: 42,
    borderRadius: 14,
    padding: 8,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    transform: [{ rotate: '8deg' }],
    opacity: 0.92,
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
    gap: 5,
    overflow: 'hidden',
  },
  complaintBubbleTailRight: {
    position: 'absolute',
    bottom: -2.5,
    right: 16,
    width: 5,
    height: 5,
    borderWidth: 1.2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    backgroundColor: '#fda4af',
    transform: [{ rotate: '45deg' }],
    zIndex: -1,
  },
  complaintGridIconTile: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#e11d48',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 5,
  },
  examGridVisualSheet: {
    position: 'absolute',
    right: 6,
    top: 14,
    width: 100,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.1)',
    transform: [{ rotate: '-7deg' }],
    opacity: 0.82,
    overflow: 'hidden',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
    gap: 4,
  },
  examDocHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  examDocHeaderDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0052cc',
  },
  examDocHeaderLine: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 82, 204, 0.18)',
  },
  examDocScoreBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 6,
    backgroundColor: '#0052cc',
  },
  examDocScoreText: {
    fontSize: 6.5,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  examDocDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 82, 204, 0.1)',
    borderRadius: 1,
  },
  examDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  examDocCheck: {
    width: 11,
    height: 11,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  examDocCapsuleFull: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  examDocCapsuleFill: {
    height: '100%',
    borderRadius: 3,
  },
  examDocPercent: {
    fontSize: 5.5,
    fontWeight: '800',
    color: '#64748b',
    width: 18,
    textAlign: 'right',
  },
  issueGridVisualTriangle: {
    position: 'absolute',
    right: 8,
    top: 24,
    opacity: 0.12,
  },
  issueGridVisualSheet: {
    position: 'absolute',
    right: 6,
    top: 14,
    width: 100,
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.12)',
    transform: [{ rotate: '7deg' }],
    opacity: 0.82,
    overflow: 'hidden',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 3,
    gap: 4,
  },
  issueDocHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  issueDocWarningBadge: {
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  issueDocHeaderLine: {
    flex: 1,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(234, 88, 12, 0.18)',
  },
  issueDocUrgentTag: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(234,88,12,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueDocUrgentText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#ea580c',
    lineHeight: 14,
  },
  issueDocDivider: {
    height: 1,
    backgroundColor: 'rgba(234, 88, 12, 0.1)',
    borderRadius: 1,
  },
  issueDocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  issueDocPriorityDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    flexShrink: 0,
  },
  issueDocCapsuleFull: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  issueDocCapsuleFill: {
    height: '100%',
    borderRadius: 3,
  },
  issueDocStatusChip: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  issueDocStatusText: {
    fontSize: 5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  // Ultra-premium vivid triangle background
  issueTriangleBg: {
    position: 'absolute',
    right: -16,
    top: -10,
    bottom: -10,
    width: 155,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 24,
  },
  issueTriangleGlassCard: {
    ...StyleSheet.absoluteFill,
    borderRadius: 24,
  },
  issueTriangleLayer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueTriangleGlassRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
  },
  issueTriangleExclamCircle: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234,88,12,0.18)',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  issueTriangleExclamText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(234,88,12,0.75)',
    lineHeight: 16,
  },
  issueTriangleSingle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  issueTriangleExclamOverlay: {
    position: 'absolute',
    bottom: 14,
    fontSize: 26,
    fontWeight: '900',
    color: 'rgba(234, 88, 12, 0.65)',
    letterSpacing: -1,
    lineHeight: 28,
  },
  issueTriangleExclamDot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    bottom: '32%',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  gridCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    zIndex: 10,
  },
  examGridIconTile: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 5,
  },
  issueGridIconTile: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 5,
  },
  lessonGridIconTile: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#d97706',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 5,
  },
  studentGridIconTile: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 5,
  },
  gridCardTopRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  gridSystemCode: {
    fontSize: 8.2,
    fontFamily: 'monospace',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  gridBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.2,
    gap: 5,
  },
  gridBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  gridTitleBlock: {
    maxWidth: '72%',
    zIndex: 10,
  },
  gridCardTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.25,
  },
  gridCardSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7c8fa8',
    marginTop: 3,
    letterSpacing: 0.1,
  },
  gridCardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  gridInfoCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    maxWidth: '74%',
  },
  gridInfoCapsuleCol: {
    gap: 0.5,
  },
  gridInfoCapsuleTitle: {
    fontSize: 9.8,
    fontWeight: '800',
    color: '#0d1b3e',
  },
  gridInfoCapsuleSub: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748b',
  },
  gridActionOrbBlue: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  gridActionOrbOrange: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  gridActionOrbGlass: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#ffffff', // Crisp top white glass stroke highlight
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  gridActionHalo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
