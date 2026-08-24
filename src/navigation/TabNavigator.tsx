import React, { useRef, useEffect } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { createBottomTabNavigator }   from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarProps }          from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons }     from '@expo/vector-icons';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

// ─── Screens ──────────────────────────────────────────────────────────────────
import { HomeScreen }            from '../screens/home/HomeScreen';
import { HomeworkScreen }        from '../screens/homework/HomeworkScreen';
import { AssignmentHubScreen }   from '../screens/assignment/AssignmentHubScreen';
import { ActivityScreen }        from '../screens/assignment/ActivityScreen';
import { ReadingCoachScreen }    from '../screens/assignment/ReadingCoachScreen';
import { MCQBuilderScreen }      from '../screens/assignment/MCQBuilderScreen';
import { AISpeakingBuddyScreen } from '../screens/assignment/AISpeakingBuddyScreen';
import { CBTSHubScreen }         from '../screens/cbts/CBTSHubScreen';
import { QuestionBankScreen }    from '../screens/cbts/QuestionBankScreen';
import { CBTSExamScreen }        from '../screens/cbts/CBTSExamScreen';
import { MoreHubScreen }         from '../screens/more/MoreHubScreen';
import { AIToolkitScreen }       from '../screens/more/AIToolkitScreen';
import { ExamScreen }            from '../screens/more/ExamScreen';
import { IssueScreen }           from '../screens/more/IssueScreen';
import { LessonPlanScreen }      from '../screens/more/LessonPlanScreen';
import { WorksheetScreen }       from '../screens/more/WorksheetScreen';
import { ChatbotScreen }         from '../screens/more/ChatbotScreen';
import { MCQsScreen }            from '../screens/more/MCQsScreen';
import { FillBlanksScreen }      from '../screens/more/FillBlanksScreen';
import { TrueFalseScreen }       from '../screens/more/TrueFalseScreen';
import { MatchColumnScreen }     from '../screens/more/MatchColumnScreen';
import { CrosswordScreen }       from '../screens/more/CrosswordScreen';
import { QABuilderScreen }       from '../screens/more/QABuilderScreen';
import { ExcelGenScreen }        from '../screens/more/ExcelGenScreen';
import { PresentationScreen }    from '../screens/more/PresentationScreen';
import { StudentRosterScreen }   from '../screens/more/StudentRosterScreen';
import { AttendanceScreen }      from '../screens/more/AttendanceScreen';
import { TimeTableScreen }       from '../screens/more/TimeTableScreen';
import { SalaryScreen }          from '../screens/more/SalaryScreen';
import { ComplainScreen }        from '../screens/more/ComplainScreen';

// ─── Stacks ───────────────────────────────────────────────────────────────────
const AssignmentStack = createNativeStackNavigator();
const CBTSStack       = createNativeStackNavigator();
const MoreStack       = createNativeStackNavigator();
const Tab             = createBottomTabNavigator();

const AssignmentStackNavigator = () => (
  <AssignmentStack.Navigator screenOptions={{ headerShown: false }}>
    <AssignmentStack.Screen name="AssignmentHub"   component={AssignmentHubScreen} />
    <AssignmentStack.Screen name="Activity"        component={ActivityScreen} />
    <AssignmentStack.Screen name="ReadingCoach"    component={ReadingCoachScreen} />
    <AssignmentStack.Screen name="MCQBuilder"      component={MCQBuilderScreen} />
    <AssignmentStack.Screen name="AISpeakingBuddy" component={AISpeakingBuddyScreen} />
  </AssignmentStack.Navigator>
);

const CBTSStackNavigator = () => (
  <CBTSStack.Navigator screenOptions={{ headerShown: false }}>
    <CBTSStack.Screen name="CBTSHub"      component={CBTSHubScreen} />
    <CBTSStack.Screen name="QuestionBank" component={QuestionBankScreen} />
    <CBTSStack.Screen name="CBTSExam"     component={CBTSExamScreen} />
  </CBTSStack.Navigator>
);

const MoreStackNavigator = () => (
  <MoreStack.Navigator screenOptions={{ headerShown: false }}>
    <MoreStack.Screen name="MoreHub"    component={MoreHubScreen} />
    <MoreStack.Screen name="AIToolkit"  component={AIToolkitScreen} />
    <MoreStack.Screen name="Exam"       component={ExamScreen} />
    <MoreStack.Screen name="Issue"      component={IssueScreen} />
    <MoreStack.Screen name="LessonPlan" component={LessonPlanScreen} />
    <MoreStack.Screen name="Worksheet"  component={WorksheetScreen} />
    <MoreStack.Screen name="Chatbot"    component={ChatbotScreen} />
    <MoreStack.Screen name="MCQs"       component={MCQsScreen} />
    <MoreStack.Screen name="FillBlanks" component={FillBlanksScreen} />
    <MoreStack.Screen name="TrueFalse"  component={TrueFalseScreen} />
    <MoreStack.Screen name="MatchColumn" component={MatchColumnScreen} />
    <MoreStack.Screen name="Crossword"   component={CrosswordScreen} />
    <MoreStack.Screen name="QABuilder"   component={QABuilderScreen} />
    <MoreStack.Screen name="ExcelGen"    component={ExcelGenScreen} />
    <MoreStack.Screen name="Presentation" component={PresentationScreen} />
    <MoreStack.Screen name="Students"   component={StudentRosterScreen} />
    <MoreStack.Screen name="Attendance" component={AttendanceScreen} />
    <MoreStack.Screen name="TimeTable"  component={TimeTableScreen} />
    <MoreStack.Screen name="Salary"     component={SalaryScreen} />
    <MoreStack.Screen name="Complain"   component={ComplainScreen} />
  </MoreStack.Navigator>
);

// ─── Design Tokens ────────────────────────────────────────────────────────────
const BRAND     = '#0047CC';   // richer darker premium blue
const INACTIVE  = '#607390';   // stronger muted slate — clearly visible
const BAR_H     = 72;
const PILL_H    = 46;
const SAFE_B    = Platform.OS === 'ios' ? 26 : 0;

// ─── Tab Definitions ─────────────────────────────────────────────────────────
const TABS = [
  { name: 'HomeTab',    label: 'Home',       icon: 'home',                  iconActive: 'home'               },
  { name: 'Assignment', label: 'Assignment',  icon: 'clipboard-text',        iconActive: 'clipboard-check'    },
  { name: 'Homework',   label: 'Homework',   icon: 'book-open-variant',      iconActive: 'book-open-variant'  },
  { name: 'CBTS',       label: 'CBTS',       icon: 'layers',                 iconActive: 'layers'             },
  { name: 'More',       label: 'More',       icon: 'dots-horizontal-circle', iconActive: 'dots-horizontal-circle' },
] as const;

// ─── Single Tab Item with self-contained pill animation ───────────────────────
const TabItem = ({
  tab,
  focused,
  onPress,
}: {
  tab: typeof TABS[number];
  focused: boolean;
  onPress: () => void;
}) => {
  // 0 = inactive, 1 = active
  const anim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue:   focused ? 1 : 0,
      damping:   22,
      stiffness: 240,
      mass:      0.8,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  // Pill bg opacity (0 inactive → 1 active)
  const pillOpacity = anim;

  // Pill horizontal padding grows
  const pillPaddingH = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [11, 16],
  });

  // Label max-width opens up
  const labelMaxW = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 100],
  });

  // Label left margin
  const labelMarginL = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0, 7],
  });

  // Label opacity — appears after pill is half expanded
  const labelOpacity = anim.interpolate({
    inputRange:  [0, 0.5, 1],
    outputRange: [0, 0,   1],
  });

  // Icon scale
  const iconScale = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [0.85, 1.05],
  });

  const iconColor = focused ? '#fff' : INACTIVE;

  return (
    <Pressable
      onPress={onPress}
      style={styles.touchable}
      android_ripple={{ color: 'rgba(10,110,255,0.07)', borderless: true, radius: 38 }}
    >
      <Animated.View
        style={[
          styles.pill,
          { paddingHorizontal: pillPaddingH },
        ]}
      >
        {/* Gradient background — fades in/out via opacity using react-native-svg */}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { opacity: pillOpacity, borderRadius: PILL_H / 2, overflow: 'hidden' }]}
        >
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgLinearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#2979FF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#0035CC" stopOpacity="1" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#pillGrad)" />
          </Svg>
          {/* Subtle inner highlight line at top */}
          <View style={styles.pillHighlight} />
        </Animated.View>

        {/* Icon */}
        <Animated.View style={{ transform: [{ scale: iconScale }], zIndex: 1 }}>
          <MaterialCommunityIcons
            name={(focused ? tab.iconActive : tab.icon) as any}
            size={26}
            color={iconColor}
          />
        </Animated.View>

        {/* Label */}
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            {
              opacity:    labelOpacity,
              maxWidth:   labelMaxW,
              marginLeft: labelMarginL,
              zIndex:     1,
            },
          ]}
        >
          {tab.label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

// ─── Premium Tab Bar Container ────────────────────────────────────────────────
const PremiumTabBar = ({ state, navigation }: BottomTabBarProps) => (
  <View style={[styles.bar, { paddingBottom: SAFE_B, height: BAR_H + SAFE_B }]}>
    {TABS.map((tab, i) => {
      const focused = state.index === i;
      return (
        <TabItem
          key={tab.name}
          tab={tab}
          focused={focused}
          onPress={() => {
            const event = navigation.emit({
              type:              'tabPress',
              target:            state.routes[i].key,
              canPreventDefault: true,
            });
            if (tab.name === 'More') {
              navigation.navigate('More', { screen: 'MoreHub' });
            } else if (tab.name === 'Assignment') {
              navigation.navigate('Assignment', { screen: 'AssignmentHub' });
            } else if (tab.name === 'CBTS') {
              navigation.navigate('CBTS', { screen: 'CBTSHub' });
            } else {
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(tab.name);
              }
            }
          }}
        />
      );
    })}
  </View>
);

// ─── Root Navigator ───────────────────────────────────────────────────────────
export const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <PremiumTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="HomeTab"    component={HomeScreen} />
    <Tab.Screen name="Assignment" component={AssignmentStackNavigator} />
    <Tab.Screen name="Homework"   component={HomeworkScreen} />
    <Tab.Screen name="CBTS"       component={CBTSStackNavigator} />
    <Tab.Screen name="More"       component={MoreStackNavigator} />
  </Tab.Navigator>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  bar: {
    flexDirection:        'row',
    alignItems:           'center',
    justifyContent:       'space-around',
    backgroundColor:      '#FFFFFF',
    borderTopLeftRadius:  22,
    borderTopRightRadius: 22,
    // Top shadow
    shadowColor:   '#1452CC',
    shadowOffset:  { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius:  14,
    elevation:     14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(10,110,255,0.08)',
  },

  // Each tab's full touch zone
  touchable: {
    flex:           1,
    height:         BAR_H,
    alignItems:     'center',
    justifyContent: 'center',
  },

  // Self-contained pill — gradient background
  pill: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    height:         PILL_H,
    borderRadius:   PILL_H / 2,
    overflow:       'visible',
    position:       'relative',
    // Shadow beneath gradient pill
    shadowColor:    '#0035CC',
    shadowOffset:   { width: 0, height: 5 },
    shadowOpacity:  0.28,
    shadowRadius:   10,
    elevation:      6,
  },

  // Subtle white highlight strip at top of pill for glass effect
  pillHighlight: {
    position:        'absolute',
    top:             0,
    left:            12,
    right:           12,
    height:          1,
    borderRadius:    1,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  label: {
    fontSize:      13,
    fontWeight:    '600',
    color:         '#FFFFFF',
    letterSpacing: 0.1,
    overflow:      'hidden',
  },
});
