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
            <Stop offset="50%" stopColor="#0066FF" />
            <Stop offset="100%" stopColor="#7C3AED" />
          </SvgLinearGradient>
          <SvgLinearGradient id="ringLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.8} />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.05} />
          </SvgLinearGradient>
        </Defs>

        {/* Orbit Rings */}
        <Circle cx="60" cy="60" r="50" stroke="url(#ringLight)" strokeWidth={1} fill="none" opacity={0.3} />
        <Circle cx="60" cy="60" r="42" stroke="#00FFCC" strokeWidth={1.2} strokeDasharray="3,6" fill="none" opacity={0.6} />
        <Circle cx="60" cy="60" r="34" stroke="#60A5FA" strokeWidth={0.8} strokeDasharray="4,8" fill="none" opacity={0.4} />

        {/* Outer orbital nodes */}
        <Circle cx="60" cy="10" r="3" fill="#00FFCC" />
        <Circle cx="60" cy="110" r="3" fill="#7C3AED" />
        <Circle cx="18" cy="60" r="2.5" fill="#60A5FA" />
        <Circle cx="102" cy="60" r="2.5" fill="#FFFFFF" />

        {/* Center 3D Glowing Core Sphere */}
        <Circle cx="60" cy="60" r="24" fill="url(#coreGlowGrad)" />
        <Circle cx="60" cy="60" r="24" fill="url(#ringLight)" opacity={0.15} />

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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      
      {/* ── APP HEADER ── */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <MaterialIcons name="arrow-back" size={20} color="#003d9b" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Teacher Toolkit</Text>
            <Text style={styles.headerSubtitle}>AI curriculum builders</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
          <MaterialIcons name="auto-awesome" size={20} color="#0052cc" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ── GLOWING AURORA GRADIENT HERO BANNER ── */}
        <LinearGradient 
          colors={['#0F255C', '#0C3090', '#0284C7']} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroBanner}
        >
          {/* Subtle shine bar */}
          <View style={styles.glassTopShine} />

          {/* Floating glowing circles */}
          <View pointerEvents="none" style={[styles.heroAuroraSphere, { backgroundColor: '#38BDF8', width: 220, height: 220, top: -75, right: -40, opacity: 0.28 }]} />
          <View pointerEvents="none" style={[styles.heroAuroraSphere, { backgroundColor: '#7C3AED', width: 140, height: 140, bottom: -45, left: -10, opacity: 0.15 }]} />

          {/* Wavy vector line designs */}
          <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgLinearGradient id="heroWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#00FFCC" stopOpacity={0} />
                <Stop offset="50%" stopColor="#00E5FF" stopOpacity={0.12} />
                <Stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
              </SvgLinearGradient>
            </Defs>
            <Path d="M -10 90 C 40 60, 100 110, 150 90 S 240 60, 300 90" stroke="url(#heroWaveGrad)" strokeWidth={2} fill="none" opacity={0.6} />
            <Path d="M 0 95 C 50 75, 110 85, 160 75 S 250 85, 310 75" stroke="url(#heroWaveGrad)" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.4} />
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
                style={[styles.toolCard, { borderLeftColor: tool.color, shadowColor: tool.color, backgroundColor: tool.cardBg || '#FFFFFF' }]}
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

                {/* Left Icon Orb with custom premium SVG vector graphic */}
                <View style={[styles.iconBox, { borderColor: tool.color + '30', backgroundColor: tool.bg }]}>
                  <ToolIcon toolId={tool.id} color={tool.color} />
                </View>

                {/* Metadata Content */}
                <View style={styles.toolMeta}>
                  <View style={styles.titleRow}>
                    <Text style={styles.toolName}>{tool.title}</Text>
                    <View style={[styles.cardMetaBadge, { backgroundColor: tool.color + '10', borderColor: tool.color + '20' }]}>
                      <Text style={[styles.cardMetaBadgeText, { color: tool.color }]}>{tool.tag}</Text>
                    </View>
                  </View>
                  <Text style={styles.toolDesc} numberOfLines={2}>{tool.desc}</Text>
                </View>

                {/* Navigation arrow badge */}
                <LinearGradient
                  colors={['#FFFFFF', tool.color + '12']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.chevronWrapper, { borderColor: tool.color + '45', shadowColor: tool.color }]}
                >
                  <Svg width="42" height="42" viewBox="0 0 42 42">
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
    margin: 14,
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0A1F5C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
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
    right: 8,
    top: '50%',
    marginTop: -55,
    zIndex: 3,
  },
  heroTextContainer: {
    width: '68%',
    zIndex: 2,
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontSize: 9, fontWeight: '900', color: '#00FFCC', letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#E2E8F0',
    lineHeight: 17,
    marginTop: 4,
    opacity: 0.95,
  },

  // Search input
  searchSection: { paddingHorizontal: 14, marginTop: 14, marginBottom: 8 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0',
    shadowColor: '#003d9b', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  searchIconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  searchInput:   { flex: 1, height: 44, fontSize: 13, fontWeight: '600', color: '#0F172A' },

  // Category sections
  categorySection: {
    marginTop: 14,
    paddingHorizontal: 14,
    gap: 10,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
  },
  categoryHeaderBullet: {
    width: 6,
    height: 14,
    borderRadius: 3,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridRow: {
    gap: 12,
  },

  // Tool Card
  toolCard: {
    flexDirection: 'row',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 22, // Slightly larger vertical spacing
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  cardWaveBackground: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    opacity: 0.85,
  },
  cardMetaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 7,
    borderWidth: 0.8,
  },
  cardMetaBadgeText: {
    fontSize: 9.8, // Slightly larger, clear tag font
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  iconBox: {
    width: 56, // Enlarged for ultra-prominence
    height: 56,
    borderRadius: 28, // Perfect circular orb
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  toolMeta: {
    flex: 1,
    marginLeft: 16,
    marginRight: 48, // Gutter preventing text from overlapping the enlarged chevron button
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  toolName: {
    fontSize: 18.5, // Even larger premium title
    fontWeight: '900',
    color: '#0A1F5C',
  },
  toolDesc: {
    fontSize: 14.2, // Even larger, clear description text
    color: '#475569',
    fontWeight: '600',
    lineHeight: 20, // Spacious line height
  },
  chevronWrapper: {
    width: 44, // Scaled-up prominent button size
    height: 44,
    borderRadius: 22, // Perfect circular badge
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    marginLeft: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
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
