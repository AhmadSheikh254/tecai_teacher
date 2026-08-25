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

import { MoreHubScreen }         from '../screens/more/MoreHubScreen';
import { AIToolkitScreen }       from '../screens/more/AIToolkitScreen';
import { ExamScreen }            from '../screens/more/ExamScreen';
import { ExamScheduleScreen }    from '../screens/more/ExamScheduleScreen';
import { ExamAttendanceScreen }  from '../screens/more/ExamAttendanceScreen';
import { ExamMarksScreen }       from '../screens/more/ExamMarksScreen';
import { ExamTermMarkScreen }    from '../screens/more/ExamTermMarkScreen';
import { ExamFinalMarkScreen }   from '../screens/more/ExamFinalMarkScreen';
import { ExamReportScreen }      from '../screens/more/ExamReportScreen';

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


// ─── Stacks ───────────────────────────────────────────────────────────────────
const AssignmentStack = createNativeStackNavigator();
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

const MoreStackNavigator = () => (
  <MoreStack.Navigator screenOptions={{ headerShown: false }}>
    <MoreStack.Screen name="MoreHub"        component={MoreHubScreen} />
    <MoreStack.Screen name="AIToolkit"      component={AIToolkitScreen} />
    <MoreStack.Screen name="Exam"           component={ExamScreen} />
    <MoreStack.Screen name="ExamSchedule"   component={ExamScheduleScreen} />
    <MoreStack.Screen name="ExamAttendance" component={ExamAttendanceScreen} />
    <MoreStack.Screen name="ExamMarks"      component={ExamMarksScreen} />
    <MoreStack.Screen name="ExamTermMark"   component={ExamTermMarkScreen} />
    <MoreStack.Screen name="ExamFinalMark"  component={ExamFinalMarkScreen} />
    <MoreStack.Screen name="ExamReport"     component={ExamReportScreen} />
    <MoreStack.Screen name="LessonPlan"     component={LessonPlanScreen} />
    <MoreStack.Screen name="Worksheet"    component={WorksheetScreen} />
    <MoreStack.Screen name="Chatbot"      component={ChatbotScreen} />
    <MoreStack.Screen name="MCQs"         component={MCQsScreen} />
    <MoreStack.Screen name="FillBlanks"   component={FillBlanksScreen} />
    <MoreStack.Screen name="TrueFalse"    component={TrueFalseScreen} />
    <MoreStack.Screen name="MatchColumn"  component={MatchColumnScreen} />
    <MoreStack.Screen name="Crossword"    component={CrosswordScreen} />
    <MoreStack.Screen name="QABuilder"    component={QABuilderScreen} />
    <MoreStack.Screen name="ExcelGen"     component={ExcelGenScreen} />
    <MoreStack.Screen name="Presentation" component={PresentationScreen} />
    <MoreStack.Screen name="Students"     component={StudentRosterScreen} />
    <MoreStack.Screen name="Attendance"   component={AttendanceScreen} />
    <MoreStack.Screen name="TimeTable"    component={TimeTableScreen} />
    <MoreStack.Screen name="Salary"       component={SalaryScreen} />
  </MoreStack.Navigator>
);

// ─── Design Tokens ────────────────────────────────────────────────────────────
const BRAND     = '#0047CC';   // richer darker premium blue
const INACTIVE  = '#607390';   // stronger muted slate — clearly visible
const BAR_H     = 56;
const PILL_H    = 38;
const SAFE_B    = Platform.OS === 'ios' ? 20 : 0;

// ─── Tab Definitions ─────────────────────────────────────────────────────────
const TABS = [
  { name: 'HomeTab',    label: 'Home',       icon: 'home',                  iconActive: 'home'               },
  { name: 'Assignment', label: 'Assignment',  icon: 'clipboard-text',        iconActive: 'clipboard-check'    },
  { name: 'Homework',   label: 'Homework',   icon: 'book-open-variant',      iconActive: 'book-open-variant'  },
  { name: 'More',       label: 'More',       icon: 'dots-horizontal-circle', iconActive: 'dots-horizontal-circle' },
] as const;

// ─── Single Tab Item with self-contained pill animation ───────────────────────
const TabItem = React.memo(({
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
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  // Scale and Opacity natively handled
  const iconColor = focused ? '#fff' : INACTIVE;

  return (
    <Pressable
      onPress={onPress}
      style={styles.touchable}
      android_ripple={{ color: 'rgba(10,110,255,0.07)', borderless: true, radius: 30 }}
    >
      <Animated.View
        style={[
          styles.pill,
          { 
            backgroundColor: focused ? '#0035CC' : 'transparent',
            paddingHorizontal: focused ? 14 : 10,
            transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] 
          },
        ]}
      >
        <MaterialCommunityIcons
          name={(focused ? tab.iconActive : tab.icon) as any}
          size={22}
          color={iconColor}
        />

        {focused && (
          <Text numberOfLines={1} style={styles.label}>
            {tab.label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
});

// ─── Premium Tab Bar Container ────────────────────────────────────────────────
const PremiumTabBar = React.memo(({ state, navigation }: BottomTabBarProps) => (
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
));

// ─── Root Navigator ───────────────────────────────────────────────────────────
export const TabNavigator = () => (
  <Tab.Navigator
    tabBar={(props) => <PremiumTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="HomeTab"    component={HomeScreen} />
    <Tab.Screen name="Assignment" component={AssignmentStackNavigator} />
    <Tab.Screen name="Homework"   component={HomeworkScreen} />
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
