import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Animated,
  useWindowDimensions,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreenComponent: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 340;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'assessments' | 'myLogs'>('overview');
  const [selectedGrade, setSelectedGrade] = useState('GRADE-II');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedSubject, setSelectedSubject] = useState('English');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(6);
  const [calDate, setCalDate] = useState(new Date(2026, 7, 1)); // Starts in August 2026

  // Live badge pulse animation
  const livePulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(livePulse, { toValue: 1.8, duration: 900, useNativeDriver: true }),
        Animated.timing(livePulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // 1. Stats
  const stats = [
    { id: 'students', count: '148', label: 'Total Students', icon: 'school', change: '+1.8%', changeBg: 'rgba(76, 175, 80, 0.12)', changeColor: '#4CAF50' },
    { id: 'teachers', count: '182', label: 'Total Teachers', icon: 'groups', change: '+2.4%', changeBg: 'rgba(76, 175, 80, 0.12)', changeColor: '#4CAF50' },
    { id: 'attendance', count: '94%', label: 'Daily Attendance', icon: 'how-to-reg', change: null },
  ];

  // 2. Quick navigation helpers
  const quickActions = [
    { label: 'Homework', icon: 'menu-book', target: 'Homework' },
    { label: 'Assign', icon: 'assignment', target: 'Assignment' },
    { label: 'Attend', icon: 'fact-check', target: 'More', params: { screen: 'Attendance' } },
    { label: 'Lesson', icon: 'import-contacts', target: 'More', params: { screen: 'LessonPlan' } },
    { label: 'Exam', icon: 'description', target: 'More', params: { screen: 'Exam' } },
  ];

  // 3. Academic progress list
  const progressData = [
    { id: '1', name: 'MUHAMMAD MUSTAFA', code: 'MM', idNum: '8647', grade: 'GRADE-II/A', score: 'C (75.0%)', progress: 0.75, color: '#FFB300' },
    { id: '2', name: 'HIRA TAHIR', code: 'HT', idNum: '8648', grade: 'GRADE-II/A', score: 'A (100.0%)', progress: 1.0, color: '#4CAF50' },
    { id: '3', name: 'ANUSHA ALAUDDIN', code: 'AA', idNum: '8649', grade: 'GRADE-II/A', score: 'B (85.0%)', progress: 0.85, color: '#2563EB' },
    { id: '4', name: 'FARAH FATIMA', code: 'FF', idNum: '8650', grade: 'GRADE-II/A', score: 'A (92.0%)', progress: 0.92, color: '#4CAF50' },
    { id: '5', name: 'HAREEM NAZ', code: 'HN', idNum: '8651', grade: 'GRADE-II/A', score: 'C (78.0%)', progress: 0.78, color: '#FFB300' },
  ];

  // 4. Reading Coach Results
  const readingCoachData = [
    { id: '1', name: 'MUHAMMAD MUSTAFA', code: 'MM', grade: 'GRADE-II/A', accuracy: '94%', speed: '65 WPM', level: 'Level II' },
    { id: '2', name: 'HIRA TAHIR', code: 'HT', grade: 'GRADE-II/A', accuracy: '98%', speed: '78 WPM', level: 'Level II' },
    { id: '3', name: 'ANUSHA ALAUDDIN', code: 'AA', grade: 'GRADE-II/A', accuracy: '88%', speed: '58 WPM', level: 'Level II' },
  ];

  // 5. Homework Progress
  const homeworkProgressData = [
    { id: '1', name: 'MUHAMMAD MUSTAFA', code: 'MM', grade: 'GRADE-II/A', status: 'Graded', date: 'Yesterday' },
    { id: '2', name: 'HIRA TAHIR', code: 'HT', grade: 'GRADE-II/A', status: 'Graded', date: 'Yesterday' },
    { id: '3', name: 'ANUSHA ALAUDDIN', code: 'AA', grade: 'GRADE-II/A', status: 'Submitted', date: '2 days ago' },
    { id: '4', name: 'FARAH FATIMA', code: 'FF', grade: 'GRADE-II/A', status: 'Graded', date: 'Yesterday' },
    { id: '5', name: 'HAREEM NAZ', code: 'HN', grade: 'GRADE-II/A', status: 'Pending', date: 'Today' },
  ];

  // 7. Exam Results
  const examData = [
    { id: '1', name: 'MUHAMMAD MUSTAFA', grade: 'GRADE-II/A', marks: '75/100', percentage: '75.0%', status: 'Pass', color: '#4CAF50' },
    { id: '2', name: 'HIRA TAHIR', grade: 'GRADE-II/A', marks: '96/100', percentage: '96.0%', status: 'Pass', color: '#4CAF50' },
    { id: '3', name: 'ANUSHA ALAUDDIN', grade: 'GRADE-II/A', marks: '84/100', percentage: '84.0%', status: 'Pass', color: '#4CAF50' },
  ];

  // 8. Notice Board
  const notices = [
    { id: '1', title: 'Independence Day Prep', category: 'Events', date: '12 Aug 2026', details: 'All teachers dress in white/green. Flag raising ceremony at 8:00 AM.', badgeBg: 'rgba(76, 175, 80, 0.12)', badgeColor: '#4CAF50' },
    { id: '2', title: 'Mid-term Exams Schedule', category: 'Exams', date: '10 Aug 2026', details: 'Mid-term date sheet published. Invigilation duties assigned to respective hubs.', badgeBg: 'rgba(239, 68, 68, 0.12)', badgeColor: '#ef4444' },
    { id: '3', title: 'Parent Teacher Meeting', category: 'Meeting', date: '08 Aug 2026', details: 'PTM for Grade-II sections to discuss Academic Progress results.', badgeBg: 'rgba(37, 99, 235, 0.12)', badgeColor: '#2563EB' },
  ];

  // 9. My Attendance Logs
  const myAttendance = [
    { date: 'Aug 06, 2026', checkIn: '07:45 AM', checkOut: '02:30 PM', status: 'On Time', color: '#4CAF50' },
    { date: 'Aug 05, 2026', checkIn: '07:42 AM', checkOut: '02:35 PM', status: 'On Time', color: '#4CAF50' },
    { date: 'Aug 04, 2026', checkIn: '07:48 AM', checkOut: '02:30 PM', status: 'On Time', color: '#4CAF50' },
    { date: 'Aug 03, 2026', checkIn: '07:55 AM', checkOut: '02:30 PM', status: 'Late Check-in', color: '#FFB300' },
  ];

  // Avatar accent colors per initial
  const avatarColors: Record<string, string> = {
    MM: '#0052cc', HT: '#0077b6', AA: '#2563EB', FF: '#4CAF50', HN: '#9c27b0',
  };

  // ===== PREMIUM SVG Attendance Donut Chart =====
  const renderAttendanceChart = () => {
    const size = 104;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const presentOffset = circumference - (circumference * 94) / 100;
    const absentOffset  = circumference - (circumference * 6)  / 100;

    return (
      <TouchableOpacity 
        style={styles.premiumCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('More', { screen: 'Attendance' })}
      >
        {/* Header */}
        <View style={styles.premiumCardHeader}>
          <View style={styles.premiumCardTitleRow}>
            <View style={styles.premiumCardIconBox}>
              <MaterialIcons name="how-to-reg" size={14} color="#0052cc" />
            </View>
            <Text style={styles.premiumCardTitle}>Student Attendance</Text>
          </View>
          <View style={styles.todayPill}>
            <MaterialIcons name="today" size={11} color="#0052cc" style={{ marginRight: 3 }} />
            <Text style={styles.todayPillText}>Today</Text>
          </View>
        </View>

        {/* Donut + Legend row */}
        <View style={styles.donutRow}>
          {/* Donut */}
          <View style={styles.donutWrapper}>
            <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
              {/* Track */}
              <Circle cx={size/2} cy={size/2} r={radius}
                stroke="rgba(0,82,204,0.07)" strokeWidth={strokeWidth} fill="none" />
              {/* Present arc */}
              <Circle cx={size/2} cy={size/2} r={radius}
                stroke="#0052cc" strokeWidth={strokeWidth}
                strokeDasharray={circumference} strokeDashoffset={presentOffset}
                strokeLinecap="round" fill="none" />
            </Svg>
            <View style={styles.donutCenter}>
              <Text style={styles.donutPct}>94%</Text>
              <Text style={styles.donutLabel}>Present</Text>
            </View>
          </View>

          {/* Legend tiles */}
          <View style={styles.legendStack}>
            {/* Present */}
            <View style={styles.legendTile}>
              <View style={[styles.legendTileIcon, { backgroundColor: 'rgba(0,82,204,0.1)' }]}>
                <MaterialIcons name="person" size={14} color="#0052cc" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.legendTileTop}>
                  <Text style={styles.legendTileTitle}>Present</Text>
                  <Text style={[styles.legendTilePct, { color: '#0052cc' }]}>94%</Text>
                </View>
                <View style={styles.legendBarTrack}>
                  <View style={[styles.legendBarFill, { width: '94%', backgroundColor: '#0052cc' }]} />
                </View>
                <Text style={styles.legendTileCount}>139 Students</Text>
              </View>
            </View>
            {/* Absent */}
            <View style={styles.legendTile}>
              <View style={[styles.legendTileIcon, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                <MaterialIcons name="person-off" size={14} color="#ef4444" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.legendTileTop}>
                  <Text style={styles.legendTileTitle}>Absent</Text>
                  <Text style={[styles.legendTilePct, { color: '#ef4444' }]}>6%</Text>
                </View>
                <View style={styles.legendBarTrack}>
                  <View style={[styles.legendBarFill, { width: '6%', backgroundColor: '#ef4444' }]} />
                </View>
                <Text style={styles.legendTileCount}>9 Students</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Event lookup helper for Real Working Teacher's Calendar
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getCalendarEventForDay = (year: number, monthIdx: number, d: number) => {
    const dt = new Date(year, monthIdx, d);
    const dayOfWeek = dt.getDay(); // 0 = Sunday

    if (dayOfWeek === 0) {
      return { title: 'Sunday Holiday 🌴', details: 'School Closed • Have a great weekend!', color: '#EF4444', icon: 'weekend', bg: '#FEF2F2' };
    }
    if (monthIdx === 7 && d === 14) {
      return { title: 'Independence Day 🇵🇰', details: 'National Holiday • Flag Hoisting Ceremony (08:00 AM)', color: '#10B981', icon: 'flag', bg: '#ECFDF5' };
    }
    if (d === 6) {
      return { title: 'Grade-II English & Staff Meeting', details: '08:00 AM: English Lecture • 01:30 PM: Departmental Meeting', color: '#0284C7', icon: 'import-contacts', bg: '#F0F9FF' };
    }
    if (d === 7) {
      return { title: 'Grade-II English Quiz', details: '09:15 AM: Vocabulary Quiz • 11:30 AM: Paper Checking', color: '#0052cc', icon: 'stars', bg: '#EEF2FF' };
    }
    if (d === 12) {
      return { title: 'School Assembly & Prep', details: '10:00 AM: Student Assembly & Rehearsal', color: '#D97706', icon: 'event', bg: '#FEF3C7' };
    }
    if (d === 18) {
      return { title: 'Mid-Term Exam Invigilation', details: '08:30 AM: Hall B Invigilation Duty (English Paper)', color: '#7C3AED', icon: 'assignment-turned-in', bg: '#F3E8FF' };
    }
    if (d === 25) {
      return { title: 'Parent Teacher Meeting', details: '10:00 AM - 01:00 PM: PTM for Grade-II Sections', color: '#DB2777', icon: 'groups', bg: '#FCE7F3' };
    }
    return {
      title: `Regular Classes (${monthNames[monthIdx]} ${d})`,
      details: '08:00 AM - 01:30 PM: Grade-II Lectures & Activity Sessions',
      color: '#0284C7',
      icon: 'class',
      bg: '#F0F9FF',
    };
  };

  // ===== REAL WORKING Teacher's Calendar =====
  const renderCalendar = () => {
    const calYear = calDate.getFullYear();
    const calMonthIndex = calDate.getMonth();
    const currentMonthLabel = `${monthNames[calMonthIndex]} ${calYear}`;

    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const totalDays = new Date(calYear, calMonthIndex + 1, 0).getDate();
    const startOffset = new Date(calYear, calMonthIndex, 1).getDay();

    const activeEvt = getCalendarEventForDay(calYear, calMonthIndex, selectedCalendarDay);

    const handlePrevMonth = () => {
      setCalDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
      setSelectedCalendarDay(1);
    };

    const handleNextMonth = () => {
      setCalDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
      setSelectedCalendarDay(1);
    };

    const daysGrid: React.ReactNode[] = [];
    for (let i = 0; i < startOffset; i++) {
      daysGrid.push(<View key={`e-${i}`} style={styles.calDayCellWrapper} />);
    }
    for (let d = 1; d <= totalDays; d++) {
      const isSel = selectedCalendarDay === d;
      const isToday = calMonthIndex === 7 && d === 7;

      daysGrid.push(
        <View key={`d-${d}`} style={styles.calDayCellWrapper}>
          <TouchableOpacity
            style={[
              styles.calDay,
              isToday && !isSel && styles.calDayToday,
              isSel && styles.calDaySelected,
            ]}
            onPress={() => setSelectedCalendarDay(d)}
            activeOpacity={0.75}
          >
            <Text style={[
              styles.calDayText,
              isToday && !isSel && styles.calDayTextToday,
              isSel && styles.calDayTextSel,
            ]}>
              {d}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.premiumCard}>
        {/* Header with Month Nav Controls */}
        <View style={styles.premiumCardHeader}>
          <View style={styles.premiumCardTitleRow}>
            <View style={styles.premiumCardIconBox}>
              <MaterialIcons name="calendar-month" size={14} color="#0052cc" />
            </View>
            <Text style={styles.premiumCardTitle}>Teacher's Calendar</Text>
          </View>

          {/* Real Interactive Month Switcher Pill */}
          <View style={styles.monthPillRow}>
            <TouchableOpacity onPress={handlePrevMonth} activeOpacity={0.7} style={styles.monthNavBtn}>
              <MaterialIcons name="chevron-left" size={16} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.monthPillText}>{currentMonthLabel}</Text>
            <TouchableOpacity onPress={handleNextMonth} activeOpacity={0.7} style={styles.monthNavBtn}>
              <MaterialIcons name="chevron-right" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekday header row */}
        <View style={styles.calWeekRow}>
          {daysOfWeek.map((d, i) => (
            <View key={i} style={styles.calWeekCell}>
              <Text style={[styles.calWeekText, (i === 0 || i === 6) && { color: '#EF4444' }]}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Days grid */}
        <View style={styles.calGrid}>{daysGrid}</View>

        {/* Event strip */}
        <TouchableOpacity
          style={[styles.calEventStrip, { backgroundColor: activeEvt.bg, borderColor: activeEvt.color + '33' }]}
          activeOpacity={0.85}
          onPress={() => Alert.alert(`${monthNames[calMonthIndex]} ${selectedCalendarDay}, ${calYear}`, `${activeEvt.title}\n\n${activeEvt.details}`)}
        >
          <View style={[styles.calEventIconOrb, { backgroundColor: activeEvt.color + '1F' }]}>
            <MaterialIcons name={activeEvt.icon as any} size={14} color={activeEvt.color} />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.calEventDate, { color: activeEvt.color }]}>{monthNames[calMonthIndex]} {selectedCalendarDay}, {calYear}</Text>
              <Text style={{ fontSize: 9, fontWeight: '800', color: activeEvt.color, opacity: 0.8 }}>Tap to view</Text>
            </View>
            <Text style={styles.calEventTitle} numberOfLines={1}>{activeEvt.title}</Text>
            <Text style={styles.calEventMsg} numberOfLines={1}>{activeEvt.details}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0f4ff', width: '100%' }}>
      <SafeAreaView style={[styles.safeArea, { alignSelf: 'center', width: '100%', maxWidth: 720 }]} edges={['top']}>
      {/* Premium Top App Bar */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <TouchableOpacity style={styles.appBarButton} activeOpacity={0.7}>
            <MaterialIcons name="menu" size={20} color="#0052cc" />
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>AE</Text>
            </View>
            <View style={{ marginLeft: 2 }}>
              <Text style={styles.appBarTitle} numberOfLines={1}>XYZ School</Text>
              <Text style={styles.appBarSubtitle}>Academic Portal</Text>
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
        {/* ====== ULTRA-PREMIUM HERO DASHBOARD CARD ====== */}
        <View style={styles.welcomeBanner}>

          {/* ── Premium Aurora Glow System ── */}
          <View style={styles.auroraGlow1} pointerEvents="none" />
          <View style={styles.auroraGlow2} pointerEvents="none" />
          <View style={styles.auroraGlow3} pointerEvents="none" />
          {/* ── Diagonal premium light streak ── */}
          <View style={styles.lightStreak} pointerEvents="none" />

          {/* ── TOP ROW ── */}
          <View style={styles.welcomeTopRow}>
            <View style={styles.datePill}>
              <View style={styles.datePillIconBox}>
                <MaterialIcons name="calendar-today" size={13} color="#fff" />
              </View>
              <Text style={styles.datePillText}>Thursday, August 6, 2026</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDotWrapper}>
                <Animated.View
                  style={[
                    styles.livePulseRing,
                    { transform: [{ scale: livePulse }], opacity: livePulse.interpolate({ inputRange: [1, 1.8], outputRange: [0.7, 0] }) },
                  ]}
                />
                <View style={styles.liveDot} />
              </View>
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          {/* ── GREETING & NAME ── */}
          <Text style={styles.welcomeGreeting}>Good Morning 👋</Text>
          <Text style={styles.welcomeTitle}>Suman Iqbal</Text>
          <Text style={styles.welcomeSubtitle}>Here's your school dashboard for today.</Text>

          {/* ── DIVIDER ── */}
          <View style={styles.bannerSeparator} />

          {/* ── PREMIUM STAT CARDS ROW ── */}
          <View style={styles.heroStatsRow}>

            {/* Students */}
            <View style={styles.heroStatCard}>
              <View style={styles.glassCardShine} />
              <View style={[styles.heroStatIconBadge, { backgroundColor: 'rgba(147,197,253,0.2)' }]}>
                <MaterialIcons name="school" size={15} color="#93c5fd" />
              </View>
              <Text style={styles.heroStatValue}>148</Text>
              <Text style={styles.heroStatLabel}>Students</Text>
              <View style={styles.heroStatBarTrack}>
                <View style={[styles.heroStatBarFill, { width: '74%', backgroundColor: '#93c5fd' }]} />
              </View>
            </View>

            {/* Attendance */}
            <TouchableOpacity 
              style={[styles.heroStatCard, styles.heroStatCardCenter]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('More', { screen: 'Attendance' })}
            >
              <View style={styles.glassCardShine} />
              <View style={[styles.heroStatIconBadge, { backgroundColor: 'rgba(52,211,153,0.2)' }]}>
                <MaterialIcons name="how-to-reg" size={15} color="#34d399" />
              </View>
              <Text style={[styles.heroStatValue, { color: '#34d399' }]}>94%</Text>
              <Text style={[styles.heroStatLabel, { fontWeight: '700' }]}>Attendance</Text>
              <View style={styles.heroStatBarTrack}>
                <View style={[styles.heroStatBarFill, { width: '94%', backgroundColor: '#34d399' }]} />
              </View>
            </TouchableOpacity>

            {/* Teachers */}
            <View style={styles.heroStatCard}>
              <View style={styles.glassCardShine} />
              <View style={[styles.heroStatIconBadge, { backgroundColor: 'rgba(196,181,253,0.2)' }]}>
                <MaterialIcons name="groups" size={15} color="#c4b5fd" />
              </View>
              <Text style={styles.heroStatValue}>182</Text>
              <Text style={styles.heroStatLabel}>Teachers</Text>
              <View style={styles.heroStatBarTrack}>
                <View style={[styles.heroStatBarFill, { width: '91%', backgroundColor: '#a78bfa' }]} />
              </View>
            </View>

          </View>
        </View>

        {/* Premium Segmented Tab Bar */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {(['overview', 'academics', 'assessments', 'myLogs'] as const).map((tab) => {
              const tabLabels = {
                overview: 'Overview',
                academics: 'Academics',
                assessments: 'Assessments & Tasks',
                myLogs: 'My Profile Logs',
              };
              const tabIcons: Record<string, any> = {
                overview: 'dashboard',
                academics: 'school',
                assessments: 'assignment',
                myLogs: 'person',
              };
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name={tabIcons[tab]} size={14} color={isActive ? '#fff' : theme.colors.onSurfaceVariant} style={{ marginRight: 5 }} />
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                    {tabLabels[tab]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* -------------------- TAB 1: OVERVIEW -------------------- */}
        {activeTab === 'overview' && (
          <View style={styles.tabContent}>
            {/* Schedule Alert Banner */}
            <View style={styles.errorBanner}>
              <View style={styles.errorBannerIconCircle}>
                <MaterialIcons name="error-outline" size={18} color="#ef4444" />
              </View>
              <Text style={styles.errorText}>No schedule fixed yet for you today.</Text>
            </View>

            {/* Attendance Donut Chart */}
            {renderAttendanceChart()}

            {/* Calendar Grid */}
            {renderCalendar()}

            {/* Notice Board */}
            <View style={styles.premiumCard}>
              <View style={styles.premiumCardHeader}>
                <View style={styles.premiumCardTitleRow}>
                  <View style={styles.premiumCardIconBox}>
                    <MaterialIcons name="campaign" size={16} color="#0052cc" />
                  </View>
                  <Text style={styles.premiumCardTitle}>Notice Board</Text>
                </View>
                <View style={styles.todayPill}>
                  <Text style={styles.todayPillText}>Bulletins</Text>
                </View>
              </View>

              <View style={{ gap: 8 }}>
                {notices.map((notice) => {
                  const categoryIcon = notice.category === 'Events' ? 'event' : notice.category === 'Exams' ? 'assignment' : 'groups';
                  return (
                    <View key={notice.id} style={[styles.noticeCard, { shadowColor: notice.badgeColor }]}>
                      <View style={[styles.noticeCardAccent, { backgroundColor: notice.badgeColor }]} />
                      <View style={styles.noticeCardBody}>
                        {/* Faint background watermark icon */}
                        <MaterialIcons name={categoryIcon} size={80} color={notice.badgeColor} style={styles.noticeWatermark} />
                        
                        <View style={styles.noticeCardTop}>
                          <View style={styles.noticeTitleRow}>
                            <View style={[styles.noticeIconCircle, { backgroundColor: `${notice.badgeColor}12` }]}>
                              <MaterialIcons name={categoryIcon} size={13} color={notice.badgeColor} />
                            </View>
                            <View style={[styles.noticeBadge, { backgroundColor: notice.badgeBg }]}>
                              <Text style={[styles.noticeCategory, { color: notice.badgeColor }]}>{notice.category}</Text>
                            </View>
                          </View>
                          <Text style={styles.noticeDate}>{notice.date}</Text>
                        </View>
                        
                        <Text style={styles.noticeTitle}>{notice.title}</Text>
                        <Text style={styles.noticeDetails}>{notice.details}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* -------------------- TAB 2: ACADEMICS -------------------- */}
        {activeTab === 'academics' && (
          <View style={styles.tabContent}>
            {/* Grade Distribution Pie Chart Card */}
            <View style={styles.premiumCard}>
              <View style={styles.premiumCardHeader}>
                <View style={styles.premiumCardTitleRow}>
                  <View style={styles.premiumCardIconBox}>
                    <MaterialIcons name="analytics" size={16} color="#0052cc" />
                  </View>
                  <Text style={styles.premiumCardTitle}>Grade Distribution</Text>
                </View>
                <View style={styles.todayPill}>
                  <Text style={styles.todayPillText}>Summary</Text>
                </View>
              </View>

              <View style={styles.pieRow}>
                {/* SVG Multi-segment Donut Pie Chart with instrumentation radar lines */}
                <View style={styles.pieWrapper}>
                  <Svg width={120} height={120} style={{ transform: [{ rotate: '-90deg' }] }}>
                    <Circle cx={60} cy={60} r={54} stroke="rgba(0,82,204,0.06)" strokeWidth={1} fill="none" />
                    
                    {/* Segment A (40%): pastel green #A7F3D0 */}
                    <Circle cx={60} cy={60} r={25} stroke="#A7F3D0" strokeWidth={50}
                      strokeDasharray="62.8 157.08" strokeDashoffset={0} fill="none" />
                    
                    {/* Segment B (20%): pastel blue #BFDBFE */}
                    <Circle cx={60} cy={60} r={25} stroke="#BFDBFE" strokeWidth={50}
                      strokeDasharray="31.4 157.08" strokeDashoffset={-62.8} fill="none" />
                    
                    {/* Segment C (40%): pastel yellow #FDE68A */}
                    <Circle cx={60} cy={60} r={25} stroke="#FDE68A" strokeWidth={50}
                      strokeDasharray="62.8 157.08" strokeDashoffset={-94.2} fill="none" />
                      
                    {/* White hairline separators aligned perfectly with slice boundaries */}
                    <Line x1={60} y1={60} x2={85} y2={60} stroke="#fff" strokeWidth={1.5} />
                    <Line x1={60} y1={60} x2={39.8} y2={74.7} stroke="#fff" strokeWidth={1.5} />
                    <Line x1={60} y1={60} x2={39.8} y2={45.3} stroke="#fff" strokeWidth={1.5} />

                    {/* Concentric inner thin HUD/instrumentation ring */}
                    <Circle cx={60} cy={60} r={24} stroke="rgba(255,255,255,0.25)" strokeWidth={0.8} strokeDasharray="2,2" fill="none" />
                  </Svg>
                </View>
 
                {/* Premium Legend Tiles */}
                <View style={styles.pieLegendList}>
                  {/* Grade A */}
                  <View style={styles.pieLegendTile}>
                    <View style={[styles.pieTileDot, { backgroundColor: '#34D399' }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pieTileTitle}>Grade A</Text>
                      <Text style={styles.pieTileSub}>2 Students</Text>
                    </View>
                    <View style={[styles.pieTileBadge, { backgroundColor: 'rgba(52,211,153,0.1)' }]}>
                      <Text style={[styles.pieTileBadgeText, { color: '#059669' }]}>40%</Text>
                    </View>
                  </View>

                  {/* Grade B */}
                  <View style={styles.pieLegendTile}>
                    <View style={[styles.pieTileDot, { backgroundColor: '#60A5FA' }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pieTileTitle}>Grade B</Text>
                      <Text style={styles.pieTileSub}>1 Student</Text>
                    </View>
                    <View style={[styles.pieTileBadge, { backgroundColor: 'rgba(96,165,250,0.1)' }]}>
                      <Text style={[styles.pieTileBadgeText, { color: '#2563EB' }]}>20%</Text>
                    </View>
                  </View>

                  {/* Grade C */}
                  <View style={styles.pieLegendTile}>
                    <View style={[styles.pieTileDot, { backgroundColor: '#FBBF24' }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.pieTileTitle}>Grade C</Text>
                      <Text style={styles.pieTileSub}>2 Students</Text>
                    </View>
                    <View style={[styles.pieTileBadge, { backgroundColor: 'rgba(251,191,36,0.1)' }]}>
                      <Text style={[styles.pieTileBadgeText, { color: '#D97706' }]}>40%</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Academic Progress Card */}
            <View style={styles.premiumCard}>
              <View style={styles.premiumCardHeader}>
                <View style={styles.premiumCardTitleRow}>
                  <View style={styles.premiumCardIconBox}>
                    <MaterialIcons name="school" size={16} color="#0052cc" />
                  </View>
                  <Text style={styles.premiumCardTitle}>Academic Progress</Text>
                </View>
                <View style={styles.todayPill}>
                  <Text style={styles.todayPillText}>GRADE-II · A</Text>
                </View>
              </View>

              {/* Styled filter pills row */}
              <View style={styles.acFiltersRow}>
                <TouchableOpacity style={styles.acFilterBtn}>
                  <MaterialIcons name="class" size={13} color="#0052cc" style={{ marginRight: 4 }} />
                  <Text style={styles.acFilterBtnText}>{selectedGrade}</Text>
                  <MaterialIcons name="arrow-drop-down" size={14} color="#0052cc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.acFilterBtn}>
                  <MaterialIcons name="group" size={13} color="#0052cc" style={{ marginRight: 4 }} />
                  <Text style={styles.acFilterBtnText}>Sec {selectedSection}</Text>
                  <MaterialIcons name="arrow-drop-down" size={14} color="#0052cc" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.acFilterBtn}>
                  <MaterialIcons name="menu-book" size={13} color="#0052cc" style={{ marginRight: 4 }} />
                  <Text style={styles.acFilterBtnText}>{selectedSubject}</Text>
                  <MaterialIcons name="arrow-drop-down" size={14} color="#0052cc" />
                </TouchableOpacity>
              </View>

              {/* Student list */}
              <View style={{ gap: 12, marginTop: 4 }}>
                {progressData.map((student, index) => {
                  const isHigh = student.progress >= 0.9;
                  const scoreColor = isHigh ? '#16a34a' : '#d97706';
                  const scoreBg = isHigh ? 'rgba(22,163,74,0.08)' : 'rgba(217,119,6,0.08)';
                  return (
                    <View key={student.id} style={styles.studentProgressCard}>
                      <View style={[styles.studentCardAccent, { backgroundColor: student.color }]} />
                      <View style={styles.studentCardInner}>
                        <View style={styles.studentHeader}>
                          <View style={styles.studentProfileRow}>
                            <Text style={styles.studentRankText}>#{index + 1}</Text>
                            <View style={[styles.avatar, { backgroundColor: `${student.color}15` }]}>
                              <Text style={[styles.avatarText, { color: student.color }]}>{student.code}</Text>
                            </View>
                            <View>
                              <Text style={styles.studentName}>{student.name}</Text>
                              <Text style={styles.studentDetails}>ID: {student.idNum} • {student.grade}</Text>
                            </View>
                          </View>
                          <View style={[styles.scoreBadge, { backgroundColor: scoreBg }]}>
                            <Text style={[styles.scoreText, { color: scoreColor }]}>{student.score}</Text>
                          </View>
                        </View>
                        <View style={styles.progressRow}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.progressText}>132/5 completed</Text>
                            <Text style={[styles.progressPctText, { color: student.color }]}>{Math.round(student.progress * 100)}%</Text>
                          </View>
                          <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${student.progress * 100}%`, backgroundColor: student.color }]} />
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Reading Coach Results Card */}
            <View style={styles.premiumCard}>
              <View style={styles.premiumCardHeader}>
                <View style={styles.premiumCardTitleRow}>
                  <View style={styles.premiumCardIconBox}>
                    <MaterialIcons name="record-voice-over" size={16} color="#0052cc" />
                  </View>
                  <Text style={styles.premiumCardTitle}>Reading Coach Results</Text>
                </View>
                <View style={[styles.todayPill, { backgroundColor: 'rgba(124,58,237,0.07)', borderColor: 'rgba(124,58,237,0.1)' }]}>
                  <Text style={[styles.todayPillText, { color: '#7c3aed' }]}>Level II</Text>
                </View>
              </View>

              <View style={{ gap: 12 }}>
                {readingCoachData.map((student) => (
                  <View key={student.id} style={styles.acMetricCard}>
                    <View style={styles.acMetricCardTop}>
                      <View style={[styles.avatar, { backgroundColor: 'rgba(0,82,204,0.08)' }]}>
                        <Text style={[styles.avatarText, { color: '#0052cc' }]}>{student.code}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.rowMainName}>{student.name}</Text>
                        <Text style={styles.rowSubName}>{student.grade} • {student.level}</Text>
                      </View>
                    </View>
                    <View style={styles.acMetricPills}>
                      <View style={[styles.acMetricPill, { backgroundColor: 'rgba(22,163,74,0.08)' }]}>
                        <Text style={styles.acMetricKey}>Accuracy</Text>
                        <Text style={[styles.acMetricVal, { color: '#16a34a' }]}>{student.accuracy}</Text>
                      </View>
                      <View style={[styles.acMetricPill, { backgroundColor: 'rgba(0,82,204,0.07)' }]}>
                        <Text style={styles.acMetricKey}>Speed</Text>
                        <Text style={[styles.acMetricVal, { color: '#0052cc' }]}>{student.speed}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* -------------------- TAB 3: ASSESSMENTS & TASKS -------------------- */}
        {activeTab === 'assessments' && (
          <View style={styles.tabContent}>
            {/* Timeline Homework Progress Card */}
            <View style={styles.premiumCard}>
              <View style={styles.premiumCardHeader}>
                <View style={styles.premiumCardTitleRow}>
                  <View style={styles.premiumCardIconBox}>
                    <MaterialIcons name="timeline" size={16} color="#0052cc" />
                  </View>
                  <Text style={styles.premiumCardTitle}>Homework Timeline</Text>
                </View>
                <View style={styles.todayPill}>
                  <Text style={styles.todayPillText}>GRADE-II · A</Text>
                </View>
              </View>

              {/* Timeline layout */}
              <View style={styles.timelineContainer}>
                {homeworkProgressData.map((item, index) => {
                  const isGraded = item.status === 'Graded';
                  const isPending = item.status === 'Pending';
                  const stateColor = isGraded ? '#16a34a' : isPending ? '#d97706' : '#0052cc';
                  const isLast = index === homeworkProgressData.length - 1;

                  return (
                    <View key={item.id} style={styles.timelineRow}>
                      {/* Left: line and node */}
                      <View style={styles.timelineLeft}>
                        <View style={[styles.timelineNode, { borderColor: stateColor }]}>
                          <View style={[styles.timelineNodeInner, { backgroundColor: stateColor }]} />
                        </View>
                        {!isLast && <View style={[styles.timelineLine, { backgroundColor: 'rgba(0,82,204,0.12)' }]} />}
                      </View>
                      
                      {/* Right: details */}
                      <View style={styles.timelineBody}>
                        <View style={styles.timelineBodyHeader}>
                          <Text style={styles.timelineTitle}>{item.name}</Text>
                          <View style={[styles.timelineBadge, { backgroundColor: `${stateColor}10` }]}>
                            <Text style={[styles.timelineBadgeText, { color: stateColor }]}>{item.status}</Text>
                          </View>
                        </View>
                        <Text style={styles.timelineSubtitle}>{item.grade} • {item.date}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Grid Exam Marks Card */}
            <View style={styles.premiumCard}>
              <View style={styles.premiumCardHeader}>
                <View style={styles.premiumCardTitleRow}>
                  <View style={styles.premiumCardIconBox}>
                    <MaterialIcons name="grid-view" size={16} color="#0052cc" />
                  </View>
                  <Text style={styles.premiumCardTitle}>First Term Exam Marks</Text>
                </View>
                <View style={styles.todayPill}>
                  <Text style={styles.todayPillText}>English</Text>
                </View>
              </View>

              {/* 2-Column Grid */}
              <View style={styles.examGrid}>
                {examData.map((exam, index) => {
                  const percentageVal = parseFloat(exam.percentage);
                  const isHigh = percentageVal >= 90;
                  const isMid = percentageVal >= 80 && !isHigh;
                  const accentColor = isHigh ? '#16a34a' : isMid ? '#0052cc' : '#d97706';

                  return (
                    <View key={exam.id} style={[styles.examGridCard, { borderTopColor: accentColor }]}>
                      {/* Initials & rank badge */}
                      <View style={styles.examGridHeader}>
                        <View style={[styles.avatar, { backgroundColor: `${accentColor}12` }]}>
                          <Text style={[styles.avatarText, { color: accentColor }]}>
                            {exam.name.split(' ').map(n => n[0]).join('')}
                          </Text>
                        </View>
                        <View style={styles.examGridRank}>
                          <Text style={styles.examGridRankText}>#{index + 1}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.examGridName} numberOfLines={1}>{exam.name}</Text>
                      
                      {/* Marks label & micro progress */}
                      <View style={styles.examGridScoreRow}>
                        <Text style={styles.examGridMarks}>{exam.marks}</Text>
                        <Text style={[styles.examGridPct, { color: accentColor }]}>{exam.percentage}</Text>
                      </View>
                      
                      <View style={styles.examGridBarBg}>
                        <View style={[styles.examGridBarFill, { width: exam.percentage as any, backgroundColor: accentColor }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* -------------------- TAB 4: MY PROFILE LOGS -------------------- */}
        {activeTab === 'myLogs' && (
          <View style={styles.tabContent}>
            {/* Calendar Strip Attendance Logs Card */}
            <View style={styles.premiumCard}>
              <View style={styles.premiumCardHeader}>
                <View style={styles.premiumCardTitleRow}>
                  <View style={styles.premiumCardIconBox}>
                    <MaterialIcons name="event-available" size={16} color="#0052cc" />
                  </View>
                  <Text style={styles.premiumCardTitle}>My Attendance Details</Text>
                </View>
                <View style={styles.todayPill}>
                  <Text style={styles.todayPillText}>Teacher Log</Text>
                </View>
              </View>

              <View style={{ gap: 12 }}>
                {myAttendance.map((log, index) => {
                  const isOnTime = log.status === 'On Time';
                  const statusColor = isOnTime ? '#16a34a' : '#d97706';
                  const dateParts = log.date.replace(',', '').split(' '); // ['Aug', '06', '2026']
                  const month = dateParts[0];
                  const day = dateParts[1];

                  return (
                    <View key={index} style={styles.calStripRow}>
                      {/* Desk calendar sheet */}
                      <View style={styles.calSheet}>
                        <View style={styles.calSheetHeader}>
                          <Text style={styles.calSheetMonth}>{month.toUpperCase()}</Text>
                        </View>
                        <View style={styles.calSheetBody}>
                          <Text style={styles.calSheetDay}>{day}</Text>
                        </View>
                      </View>

                      {/* Log details */}
                      <View style={styles.calStripBody}>
                        <Text style={styles.calStripInTime}>In: <Text style={{ color: '#0d1b3e', fontWeight: '700' }}>{log.checkIn}</Text></Text>
                        <Text style={styles.calStripOutTime}>Out: <Text style={{ color: '#0d1b3e', fontWeight: '700' }}>{log.checkOut}</Text></Text>
                      </View>

                      {/* Status */}
                      <View style={[styles.calStripStatus, { backgroundColor: isOnTime ? 'rgba(22,163,74,0.08)' : 'rgba(217,119,6,0.08)' }]}>
                        <Text style={[styles.calStripStatusText, { color: statusColor }]}>{log.status}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  </View>
);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4ff', // Premium cool off-white blue tint background
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
  },
  appBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appBarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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

  // ===== SCROLL CONTENT =====
  scrollContent: {
    padding: 14,
    paddingBottom: 90,
    gap: 12,
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
  },

  // ===== ULTRA-PREMIUM HERO DASHBOARD CARD =====
  welcomeBanner: {
    backgroundColor: '#0C3090',
    borderRadius: 20,
    padding: 12,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#071E6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderLeftColor: 'rgba(255,255,255,0.18)',
    borderRightColor: 'rgba(255,255,255,0.07)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },

  // ── Glass rim highlight — top bright strip ──
  glassTopShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  // ── AURORA GLOW 1: main bright circle top-right ──
  auroraGlow1: {
    position: 'absolute',
    right: -70,
    top: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(50,120,255,0.52)',
  },

  // ── AURORA GLOW 2: deep accent bottom-left ──
  auroraGlow2: {
    position: 'absolute',
    left: -55,
    bottom: -55,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(15,55,190,0.55)',
  },

  // ── AURORA GLOW 3: subtle electric mid-right ──
  auroraGlow3: {
    position: 'absolute',
    right: 20,
    top: 40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(80,180,255,0.13)',
  },

  // ── Diagonal premium light sweep ──
  lightStreak: {
    position: 'absolute',
    top: -60,
    right: -30,
    width: 80,
    height: 400,
    backgroundColor: 'rgba(255,255,255,0.045)',
    transform: [{ rotate: '-38deg' }],
  },

  // ── Dot mesh — subtle corner accent ──
  meshGrid: {
    position: 'absolute',
    top: 8, right: 8,
    width: 130,
    height: 100,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    padding: 10,
    opacity: 0.15,
  },
  meshDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#c8deff',
  },
  welcomeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 3,
  },
  // Date pill — glassmorphism dark blue
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,10,80,0.6)',
    paddingRight: 11,
    paddingLeft: 5,
    paddingVertical: 5,
    borderRadius: 30,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.35)',
    borderLeftColor: 'rgba(255,255,255,0.2)',
    borderRightColor: 'rgba(255,255,255,0.08)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 7,
    zIndex: 3,
  },
  datePillIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePillText: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  // LIVE badge — green gradient capsule
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14A363',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.5)',
    gap: 7,
    zIndex: 3,
  },
  liveDotWrapper: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  livePulseRing: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(52,211,153,0.5)',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
  },
  liveText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  // Greeting — gold amber
  welcomeGreeting: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FBD076',
    marginBottom: 1,
    letterSpacing: 0.1,
    zIndex: 3,
  },
  // Name — hero typography
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 2,
    letterSpacing: -0.6,
    lineHeight: 28,
    zIndex: 3,
  },
  welcomeSubtitle: {
    fontSize: 11,
    color: 'rgba(200, 225, 255, 0.72)',
    lineHeight: 14,
    fontWeight: '400',
    marginBottom: 0,
    zIndex: 3,
  },
  bannerSeparator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 4,
    zIndex: 3,
  },
  // === LIQUID GLASS STAT CARDS ===
  heroStatsRow: {
    flexDirection: 'row',
    gap: 6,
    zIndex: 3,
  },
  heroStatCard: {
    flex: 1,
    // Liquid glass base
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 6,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    // Multi-directional glass border
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.38)',
    borderLeftColor: 'rgba(255,255,255,0.2)',
    borderRightColor: 'rgba(255,255,255,0.07)',
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  heroStatCardCenter: {
    borderTopColor: 'rgba(52,211,153,0.45)',
    borderLeftColor: 'rgba(52,211,153,0.2)',
  },
  // Inner top glass shine strip
  glassCardShine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  heroStatIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    borderTopWidth: 1,
    borderLeftWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.3)',
    borderLeftColor: 'rgba(255,255,255,0.15)',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  heroStatValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
    lineHeight: 20,
    marginBottom: 1,
  },
  heroStatLabel: {
    fontSize: 10,
    color: 'rgba(220,238,255,0.92)',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  heroStatBarTrack: {
    width: '100%',
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  heroStatBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // ===== PREMIUM SEGMENTED TAB BAR =====
  tabContainer: {
    marginVertical: 2,
  },
  tabScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.12)',
  },
  tabButtonActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  tabContent: {
    gap: 14,
  },

  // ===== PREMIUM STAT CARDS =====
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 108,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
    overflow: 'hidden',
    position: 'relative',
  },
  statCardAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#0052cc',
    opacity: 0.2,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  statInfo: {
    marginTop: 4,
  },
  statCount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0d1b3e',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 1,
  },

  // ===== ERROR BANNER =====
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.12)',
    gap: 10,
  },
  errorBannerIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },

  // ===== PREMIUM CARD SECTIONS =====
  cardSection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.2,
  },
  sectionActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 82, 204, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 82, 204, 0.07)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0052cc',
  },

  // ===== PREMIUM CARD SHELL =====
  premiumCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    // Sharp blue accent bottom border
    borderBottomWidth: 2,
    borderBottomColor: '#CBD5E1',
  },
  premiumCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  premiumCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  premiumCardIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: 'rgba(0,82,204,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumCardTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.2,
  },
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,82,204,0.07)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,82,204,0.12)',
  },
  todayPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0052cc',
  },
  monthPill: {
    backgroundColor: '#0052cc',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
  },
  monthPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052cc',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 14,
    gap: 4,
  },
  monthNavBtn: {
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },

  // ===== DONUT CHART =====
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  donutWrapper: {
    position: 'relative',
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutPct: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0d1b3e',
    letterSpacing: -0.8,
  },
  donutLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.2,
  },
  // Legend tiles
  legendStack: {
    flex: 1,
    gap: 6,
  },
  legendTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendTileIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendTileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  legendTileTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0d1b3e',
  },
  legendTilePct: {
    fontSize: 11,
    fontWeight: '800',
  },
  legendBarTrack: {
    height: 3.5,
    backgroundColor: 'rgba(0,82,204,0.07)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 2,
  },
  legendBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  legendTileCount: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '500',
  },

  // ===== CALENDAR =====
  calWeekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,82,204,0.07)',
  },
  calWeekCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calWeekText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.3,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  calDayCellWrapper: {
    width: '14.2857%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  calDay: {
    width: 30,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calDaySelected: {
    backgroundColor: '#0052cc',
    shadowColor: '#0052cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  calDayToday: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  calDayText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },
  calDayTextSel: {
    color: '#fff',
    fontWeight: '900',
  },
  calDayTextToday: {
    color: '#0284C7',
    fontWeight: '800',
  },
  calEventStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    marginTop: 2,
  },
  calEventIconOrb: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calEventDate: {
    fontSize: 10,
    fontWeight: '800',
  },
  calEventTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 1,
  },
  calEventMsg: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },

  // ===== NOTICE BOARD =====
  noticeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  noticeCardAccent: {
    width: 3,
  },
  noticeCardBody: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  noticeWatermark: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    opacity: 0.04,
  },
  noticeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    zIndex: 2,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  noticeIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  noticeCategory: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  noticeDate: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '600',
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0d1b3e',
    marginBottom: 1,
    letterSpacing: -0.2,
    zIndex: 2,
  },
  noticeDetails: {
    fontSize: 10.5,
    color: '#64748b',
    lineHeight: 14,
    fontWeight: '500',
    zIndex: 2,
  },

  // ===== ACADEMICS TAB FILTERS & STUDENT PROGRESS =====
  acFiltersRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    marginTop: 2,
  },
  acFilterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 36,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.1)',
  },
  acFilterBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0052cc',
  },
  studentProgressCard: {
    backgroundColor: '#f8faff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
    flexDirection: 'row',
  },
  studentRankText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#94a3b8',
    marginRight: 6,
    alignSelf: 'center',
  },
  progressPctText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  // Metric cards
  acMetricCard: {
    backgroundColor: '#f8faff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
  },
  acMetricCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  acMetricPills: {
    flexDirection: 'row',
    gap: 6,
  },
  acMetricPill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acMetricKey: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  acMetricVal: {
    fontSize: 13,
    fontWeight: '800',
  },

  // ===== STUDENT CARDS =====
  studentsList: {
    gap: 10,
  },
  studentCard: {
    backgroundColor: '#f8faff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
    flexDirection: 'row',
  },
  studentCardAccent: {
    width: 4,
  },
  studentCardInner: {
    flex: 1,
    padding: 12,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
  },
  studentName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.2,
  },
  studentDetails: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressRow: {
    gap: 5,
  },
  progressText: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '500',
  },
  progressBarBg: {
    height: 5,
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // ===== TABLE ROWS / READING / SPEAK CARDS =====
  tableRowCard: {
    backgroundColor: '#f8faff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
  },
  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowMainName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.2,
  },
  rowSubName: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  coachMetrics: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
  },
  metricBox: {
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: 'rgba(0, 82, 204, 0.1)',
    alignSelf: 'stretch',
  },
  metricLabel: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.2,
  },

  // ===== ASSESSMENTS ROWS =====
  taskProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 82, 204, 0.06)',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  examScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 82, 204, 0.06)',
  },
  examStudentName: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0d1b3e',
    letterSpacing: -0.2,
  },
  examSubjectText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  examScoreRight: {
    alignItems: 'flex-end',
  },
  examScoreVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0d1b3e',
  },
  examScorePercent: {
    fontSize: 10.5,
    fontWeight: '700',
  },

  // ===== TEACHER PROFILE LOGS =====
  tableWrapper: {
    gap: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
    overflow: 'hidden',
  },
  tableRowAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  tableColLeft: {
    gap: 2,
    paddingLeft: 6,
  },
  tableMainText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0d1b3e',
  },
  tableSubText: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: '500',
  },
  buddyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 82, 204, 0.06)',
  },
  buddyTopic: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0d1b3e',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  buddyDate: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  buddyScores: {
    alignItems: 'flex-end',
    gap: 2,
  },
  buddyScoreText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },

  // ===== MISC =====
  actionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0d1b3e',
    marginBottom: 14,
  },
  actionsScroll: {
    gap: 14,
  },
  actionButton: {
    alignItems: 'center',
    width: 64,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 82, 204, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0d1b3e',
    textAlign: 'center',
  },

  // ===== GRADE PIE CHART =====
  pieRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 4,
  },
  pieWrapper: {
    position: 'relative',
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieTotal: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0d1b3e',
    letterSpacing: -0.5,
  },
  pieTotalLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
  },
  pieLegendList: {
    flex: 1,
    gap: 8,
  },
  pieLegendTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,82,204,0.06)',
    gap: 8,
  },
  pieTileDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pieTileTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0d1b3e',
  },
  pieTileSub: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 1,
  },
  pieTileBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pieTileBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
  },

  // ===== TIMELINE =====
  timelineContainer: {
    paddingLeft: 4,
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 48,
  },
  timelineLeft: {
    width: 20,
    alignItems: 'center',
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineNodeInner: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginVertical: 2,
  },
  timelineBody: {
    flex: 1,
    paddingBottom: 8,
    paddingLeft: 8,
  },
  timelineBodyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0d1b3e',
  },
  timelineBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 16,
  },
  timelineBadgeText: {
    fontSize: 8.5,
    fontWeight: '800',
  },
  timelineSubtitle: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },

  // ===== EXAM GRID =====
  examGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  examGridCard: {
    width: '48%',
    backgroundColor: '#f8faff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.07)',
    borderTopWidth: 3,
  },
  examGridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  examGridRank: {
    backgroundColor: 'rgba(0,82,204,0.08)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  examGridRankText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0052cc',
  },
  examGridName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0d1b3e',
    marginBottom: 6,
  },
  examGridScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  examGridMarks: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0d1b3e',
  },
  examGridPct: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  examGridBarBg: {
    height: 3.5,
    backgroundColor: 'rgba(0,82,204,0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  examGridBarFill: {
    height: '100%',
    borderRadius: 2,
  },

  // ===== CALENDAR STRIP =====
  calStripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8faff',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,82,204,0.07)',
    gap: 8,
  },
  calSheet: {
    width: 36,
    height: 38,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,82,204,0.12)',
    alignItems: 'center',
  },
  calSheetHeader: {
    width: '100%',
    height: 13,
    backgroundColor: '#0052cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calSheetMonth: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#fff',
  },
  calSheetBody: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calSheetDay: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0d1b3e',
  },
  calStripBody: {
    flex: 1,
    gap: 1,
  },
  calStripInTime: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  calStripOutTime: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  calStripStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
  },
  calStripStatusText: {
    fontSize: 8.5,
    fontWeight: '800',
  },

  // ===== WAVEFORM PRACTICE CARD =====
  waveformCard: {
    backgroundColor: '#f8faff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,82,204,0.07)',
  },
  waveformTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  waveformContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,82,204,0.05)',
  },
  waveBars: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    gap: 3,
    justifyContent: 'center',
    marginBottom: 8,
  },
  waveBar: {
    width: 3.5,
    borderRadius: 2,
  },
  waveformMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,82,204,0.06)',
    paddingTop: 8,
  },
  waveMetricBox: {
    alignItems: 'center',
  },
  waveMetricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 2,
  },
  waveMetricVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  waveMetricDivider: {
    width: 1,
    backgroundColor: 'rgba(0,82,204,0.08)',
    alignSelf: 'stretch',
  },
});

export const HomeScreen = React.memo(HomeScreenComponent);
