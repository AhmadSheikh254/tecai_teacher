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
  Platform,
  Alert,
  Clipboard
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useAppTheme } from '../../context/ThemeContext';

interface AILessonPlanScreenProps {
  navigation: any;
}

export interface GeneratedLessonPlan {
  id: string;
  topic: string;
  language: string;
  level: string;
  date: string;
  slos: string;
  learningObjectives: string[];
  materials: { material: string; quantity: string; description: string }[];
  introduction: {
    duration: string;
    content: string;
  };
  mainActivities: {
    duration: string;
    activities: { title: string; stepNumber?: number; content: string; bullets?: string[] }[];
  };
  assessment: {
    duration: string;
    description: string;
    rubric: { criteria: string; needsImprovement: string; satisfactory: string; excellent: string }[];
  };
  conclusion: {
    duration: string;
    content: string;
  };
  differentiation: {
    struggling: string;
    advanced: string;
  };
  reflection: string;
}

const LANGUAGES_LIST = ['English', 'Urdu', 'Arabic', 'Spanish', 'French', 'Chinese'];
const LEVELS_LIST = [
  'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5',
  'Grade-I', 'Grade-II', 'Grade-III', 'Grade-IV', 'Grade-V',
  'Grade-VI', 'Grade-VII', 'Grade-VIII'
];

export const AILessonPlanScreen: React.FC<AILessonPlanScreenProps> = ({ navigation }) => {
  const { theme: appTheme, themeMode } = useAppTheme();
  const isDefaultTheme = themeMode === 'light';

  // Form Input States
  const [requestInput, setRequestInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('Level 1');
  const [fileName, setFileName] = useState('');

  // Picker Modal States
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  // Generation Loading States
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Analyzing lesson request...');

  // Generated Plan State (One-time live session generation, dynamically replaces)
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedLessonPlan | null>(null);
  const [copied, setCopied] = useState(false);

  // Mock File Upload Action
  const handleToggleFile = () => {
    if (fileName) {
      setFileName('');
    } else {
      setFileName('Curriculum_Guide_Chapter.pdf');
    }
  };

  // Dynamic Generator Helper
  const createPlanData = (topic: string, lang: string, lvl: string): GeneratedLessonPlan => {
    const cleanTopic = topic.trim() || 'States of Matter';
    const lowerTopic = cleanTopic.toLowerCase();

    if (lowerTopic.includes('matter') || lowerTopic.includes('solid') || lowerTopic.includes('state')) {
      return {
        id: `plan-${Date.now()}`,
        topic: 'States of Matter',
        language: lang,
        level: lvl,
        date: 'Just now',
        slos: 'Students will be able to identify and name the three states of matter: solid, liquid, and gas. Students will be able to describe one characteristic of each state of matter.',
        learningObjectives: [
          "Define 'States of matter.'",
          'Name the three states of matter.',
          'Give an example of a solid, a liquid, and a gas.',
          'State one observable property of each state (e.g., solids keep their shape, liquids flow, gases spread out).'
        ],
        materials: [
          { material: 'Whiteboard or projector', quantity: '1', description: 'For writing and displaying information' },
          { material: 'Markers or pens', quantity: 'Assorted', description: 'For writing on whiteboard' },
          { material: 'Chart paper', quantity: '1', description: 'For displaying key terms and examples' },
          { material: 'Pictures of solids, liquids, and gases', quantity: '1 set', description: 'Clear images representing each state' },
          { material: 'Real-life examples of solids', quantity: '1-2', description: 'e.g., a book, a stone, a bottle' },
          { material: 'Real-life examples of liquids', quantity: '1-2', description: 'e.g., a bottle of water, a juice' },
          { material: 'Real-life examples of gases', quantity: '1', description: 'e.g., a deflated balloon, a fan to show air movement' },
          { material: 'Worksheet', quantity: 'As required', description: 'To reinforce learning' }
        ],
        introduction: {
          duration: '10 minutes',
          content: 'Begin by asking students to define what everything around us is made of. Guide them to the concept of "matter." Introduce the idea that matter can exist in different forms or "states." Show students the real-life examples: Ask "What is this book? Does it change shape easily? What about this water? Can it flow? What about the air around us? Can we see it, but is it taking up space?" Introduce the terms "Solid," "Liquid," and "Gas" as the three main states of matter. Write these terms on the board and display the corresponding pictures.'
        },
        mainActivities: {
          duration: '25 minutes',
          activities: [
            {
              title: 'Defining States',
              stepNumber: 1,
              content: 'Explain each state of matter using simple language and paired-life examples.',
              bullets: [
                'Solids: "A solid keeps its shape. Look at this block, it stays the same shape." Write "Solids: Keeps its shape" on the chart paper.',
                'Liquids: "A liquid can flow and take the shape of its container. This water will take the shape of this bottle." Write "Liquids: Flows, takes container shape" on chart paper.',
                'Gases: "A gas spreads out to fill any space. We cannot see air, but it is all around us." Write "Gases: Spreads out" on the chart paper.'
              ]
            },
            {
              title: 'Picture Sort',
              stepNumber: 2,
              content: 'Display the pictures of various objects. Ask students to classify if the object is a solid, liquid, or gas, and explain why using the learned characteristics. For example, "This picture is of ice. Ice is a solid because it keeps its shape." Or, "Here is a cloud. Clouds are made of tiny water droplets or ice crystals in the air, so we can think of how air relates to gas or liquid in the air." Keep the explanation simple for beginners, focusing on observable properties.'
            },
            {
              title: 'Movement Demonstration',
              stepNumber: 3,
              content: 'Have students stand up. Ask them to act like a solid (stand still), then like a liquid (move slowly and flow around each other gently), and finally like a gas (move quickly and spread out in the classroom).'
            },
            {
              title: 'Worksheet Activities',
              stepNumber: 4,
              content: 'Students will complete a worksheet with the following activities: - Match pictures of solids, liquids, and gases to their names. - Draw one example of a solid, a liquid, and a gas. - Fill in the blanks with words like "solid," "liquid," or "gas" based on simple descriptions. For example, "A chair is a _______; Water is a _______."'
            }
          ]
        },
        assessment: {
          duration: '5 minutes',
          description: 'Students will participate in a quick verbal quiz. The teacher will point to an object or picture and ask: "What state of matter is this? How do you know?"',
          rubric: [
            {
              criteria: 'Identification of State',
              needsImprovement: 'Student cannot identify the state of matter for most examples.',
              satisfactory: 'Student can identify the state of matter for most examples.',
              excellent: 'Student can correctly identify the state of matter for all examples.'
            },
            {
              criteria: 'Justification (Sample)',
              needsImprovement: 'Student cannot provide any reason for their identification.',
              satisfactory: 'Student can provide a vague basic reason (e.g., "it\'s hard" for solid).',
              excellent: 'Student can provide a simple, relevant reason based on criteria (e.g., "it keeps its shape," "it flows").'
            }
          ]
        },
        conclusion: {
          duration: '5 minutes',
          content: 'Review the three states of matter: solid, liquid, and gas. Ask students to name one thing they learned about each state. Briefly revisit the real-life examples to reinforce the concepts. Encourage students to look for examples of solids, liquids, and gases in their environment.'
        },
        differentiation: {
          struggling: 'Provide sentence starters for the worksheet. Pair them with a stronger peer during picture sorting. Focus on identifying only one characteristic for each state.',
          advanced: 'Ask them to think about changes between states (e.g., ice melting into water). Encourage them to use more descriptive words for the characteristics of each state.'
        },
        reflection: '[Space for teacher to write notes after the lesson, e.g., What went well? What could be improved? Were students engaged? Did they meet the learning objectives?]'
      };
    }

    // Generic Rich Pedagogical Generator for Any Topic
    return {
      id: `plan-${Date.now()}`,
      topic: cleanTopic,
      language: lang,
      level: lvl,
      date: 'Just now',
      slos: `Students will be able to demonstrate core conceptual understanding of ${cleanTopic}. Students will be able to apply and illustrate fundamental principles through guided inquiry and hands-on exercises.`,
      learningObjectives: [
        `Define key terminology and foundational concepts of ${cleanTopic}.`,
        `Identify and describe 3 core characteristics and operational rules of ${cleanTopic}.`,
        `Solve guided practice problems and real-world scenarios related to ${cleanTopic}.`,
        `Explain how ${cleanTopic} connects with everyday life and surrounding environments.`
      ],
      materials: [
        { material: 'Whiteboard & Markers', quantity: '1 set', description: `For illustrating key diagrams and principles of ${cleanTopic}` },
        { material: 'Visual Anchor Charts', quantity: '2 sheets', description: `High-visibility summaries of ${cleanTopic} definitions & rules` },
        { material: 'Concept Activity Cards', quantity: '1 set per pair', description: `Interactive flashcards for classification and peer discussion` },
        { material: 'Student Worksheets & Rubrics', quantity: 'Class set', description: 'Formatted practice worksheets and evaluation checklists' }
      ],
      introduction: {
        duration: '10 minutes',
        content: `Open the class with an engaging diagnostic inquiry question: "Have you ever observed ${cleanTopic} in action around you?" Elicit student prior knowledge and record responses on the board. Present the lesson's goal and connect it to familiar real-world experiences to foster intrinsic curiosity.`
      },
      mainActivities: {
        duration: '25 minutes',
        activities: [
          {
            title: 'Concept Unpacking & Direct Instruction',
            stepNumber: 1,
            content: `Introduce the foundational definition of ${cleanTopic} using clear, accessible language. Walk students through step-by-step examples while highlighting critical rules on the anchor chart. Encourage active choral response and note-taking.`
          },
          {
            title: 'Guided Pair Activity & Card Sort',
            stepNumber: 2,
            content: `Distribute the Concept Activity Cards to student pairs. Students work collaboratively to categorize scenarios, distinguish true statements, and justify their reasoning with peers.`
          },
          {
            title: 'Interactive Demonstration & Kinesthetic Practice',
            stepNumber: 3,
            content: `Conduct a brief whole-class demonstration where volunteers model key elements of ${cleanTopic}. This cements theoretical concepts into tangible, memorable sensory experiences.`
          },
          {
            title: 'Independent Application Worksheet',
            stepNumber: 4,
            content: `Students independently complete the tiered worksheet to solidify mastery, solving progressive questions ranging from simple recognition to analytical problem-solving.`
          }
        ]
      },
      assessment: {
        duration: '5 minutes',
        description: `Conduct a formative exit-ticket check. Pose two targeted questions on ${cleanTopic} to measure individual comprehension before dismissal.`,
        rubric: [
          {
            criteria: 'Conceptual Comprehension',
            needsImprovement: `Struggles to recall core definitions of ${cleanTopic}.`,
            satisfactory: `Accurately recalls and explains primary concepts of ${cleanTopic}.`,
            excellent: `Demonstrates thorough mastery and explains nuanced aspects of ${cleanTopic} confidently.`
          },
          {
            criteria: 'Application & Problem Solving',
            needsImprovement: 'Requires continuous guidance to complete basic worksheet tasks.',
            satisfactory: 'Completes standard exercises independently with minor prompts.',
            excellent: 'Applies concepts independently to both standard and novel problems with high accuracy.'
          }
        ]
      },
      conclusion: {
        duration: '5 minutes',
        content: `Summarize the 3 key takeaways of ${cleanTopic}. Invite two students to share one insight they learned today. Assign a short observational home-connection task.`
      },
      differentiation: {
        struggling: 'Provide illustrated word banks, sentence frames, and paired peer assistance for worksheet activities.',
        advanced: `Challenge advanced learners to design a mini-scenario or formulate an open-ended question demonstrating ${cleanTopic}.`
      },
      reflection: '[Space for teacher reflection: Did students achieve the SLOs? Which activity stimulated the highest engagement? What adjustments are needed for the next period?]'
    };
  };

  // Generation Action
  const handleGenerate = () => {
    if (generating) return;

    const topic = requestInput.trim() || 'States of Matter';
    setGenerating(true);
    setProgress(0);
    setProgressStatus('Analyzing lesson request...');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 15;
      if (currentProgress === 15) setProgressStatus('Synthesizing Curriculum & SLOs...');
      if (currentProgress === 45) setProgressStatus('Formulating Learning Objectives & Materials...');
      if (currentProgress === 75) setProgressStatus('Structuring Timed 4-Phase Activities...');
      if (currentProgress === 90) setProgressStatus('Generating Rubric & Differentiation...');
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        setGenerating(false);
        const newPlan = createPlanData(topic, language, level);
        setGeneratedPlan(newPlan);
      } else {
        setProgress(currentProgress);
      }
    }, 150);
  };

  const handlePrint = () => {
    Alert.alert('Print Lesson Plan', 'Lesson Plan formatted and sent to print queue as PDF document.');
  };

  const handleCopy = () => {
    if (!generatedPlan) return;
    const text = `LESSON PLAN: ${generatedPlan.topic}\nLanguage: ${generatedPlan.language} | Level: ${generatedPlan.level}\n\nSTUDENT LEARNING OUTCOMES (SLOs):\n${generatedPlan.slos}\n\nLEARNING OBJECTIVES:\n${generatedPlan.learningObjectives.map((o) => `• ${o}`).join('\n')}\n\nMATERIALS:\n${generatedPlan.materials.map((m) => `${m.material} (${m.quantity}): ${m.description}`).join('\n')}\n\nINTRODUCTION (${generatedPlan.introduction.duration}):\n${generatedPlan.introduction.content}\n\nMAIN ACTIVITIES (${generatedPlan.mainActivities.duration}):\n${generatedPlan.mainActivities.activities.map((a) => `${a.stepNumber}. ${a.title}: ${a.content}`).join('\n')}\n\nASSESSMENT (${generatedPlan.assessment.duration}):\n${generatedPlan.assessment.description}\n\nCONCLUSION (${generatedPlan.conclusion.duration}):\n${generatedPlan.conclusion.content}`;
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <SafeAreaView style={[styles.safeArea, !isDefaultTheme && { backgroundColor: appTheme.bg }]} edges={['top']}>

      {/* ── Ambient Mesh Backdrop ── */}
      {isDefaultTheme && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
          <Svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Defs>
              <SvgLinearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#3B82F6" stopOpacity={0.08} />
                <Stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.03} />
              </SvgLinearGradient>
            </Defs>
            <Circle cx="105%" cy="-5%" r="320" fill="url(#bgGlow)" />
            <Circle cx="-10%" cy="50%" r="300" fill="#2563EB" opacity={0.04} />
            <Circle cx="80%" cy="95%" r="340" fill="#60A5FA" opacity={0.05} />
          </Svg>
        </View>
      )}

      {/* ── HEADER BANNER ── */}
      <LinearGradient
        colors={isDefaultTheme ? ['#1E3A8A', '#1D4ED8', '#2563EB'] : appTheme.bannerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={{ position: 'absolute', right: -35, top: -50, width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(96, 165, 250, 0.2)' }} />
        <View style={{ position: 'absolute', left: -25, bottom: -45, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(37, 99, 235, 0.16)' }} />

        <View style={[styles.headerContent, { maxWidth: 720, width: '100%', alignSelf: 'center' }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <LinearGradient colors={['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.10)']} style={styles.headerIconBox}>
              <MaterialIcons name="assignment" size={22} color="#fff" />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>AI Lesson Plan Generator</Text>
              <Text style={styles.headerSubtitle}>Curriculum aligned · SLOs · Activities & Rubric</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Blue Accent Glow Line */}
      <LinearGradient
        colors={isDefaultTheme ? ['#60A5FA', '#93C5FD', '#3B82F6'] : [appTheme.primary, appTheme.accent, appTheme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerBarGlow}
      />

      <ScrollView contentContainerStyle={[styles.scrollContainer, { maxWidth: 720, width: '100%', alignSelf: 'center' }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ── FORM CARD ── */}
        <View style={[styles.card, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>

          {/* YOUR REQUEST */}
          <View style={styles.fieldHeader}>
            <View style={[styles.fieldDot, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />
            <Text style={[styles.sectionLabel, !isDefaultTheme && { color: appTheme.textPrimary }]}>YOUR REQUEST</Text>
          </View>
          <TextInput
            style={[styles.requestTextArea, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border, color: appTheme.textPrimary }]}
            placeholder="Describe your lesson topic… e.g. States of Matter, Fractions, Photosynthesis"
            placeholderTextColor={isDefaultTheme ? "#94A3B8" : appTheme.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={requestInput}
            onChangeText={setRequestInput}
            editable={!generating}
          />

          {/* LEVEL & LANGUAGE (SIDE BY SIDE) */}
          <View style={styles.gridRow}>
            {/* LEVEL */}
            <View style={styles.gridCol}>
              <View style={styles.fieldHeader}>
                <View style={[styles.fieldDot, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />
                <Text style={[styles.sectionLabel, !isDefaultTheme && { color: appTheme.textPrimary }]}>LEVEL</Text>
              </View>
              <TouchableOpacity
                style={[styles.pickerButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}
                onPress={() => !generating && setLevelModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.pickerLeft}>
                  <LinearGradient colors={isDefaultTheme ? ['#EFF6FF', '#DBEAFE'] : [appTheme.surface, appTheme.cardBg]} style={styles.pickerIconOrb}>
                    <MaterialIcons name="school" size={15} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} />
                  </LinearGradient>
                  <Text style={[styles.pickerButtonText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{level}</Text>
                </View>
                <MaterialIcons name="expand-more" size={20} color={isDefaultTheme ? "#94A3B8" : appTheme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* LANGUAGE */}
            <View style={styles.gridCol}>
              <View style={styles.fieldHeader}>
                <View style={[styles.fieldDot, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />
                <Text style={[styles.sectionLabel, !isDefaultTheme && { color: appTheme.textPrimary }]}>LANGUAGE</Text>
              </View>
              <TouchableOpacity
                style={[styles.pickerButton, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}
                onPress={() => !generating && setLangModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.pickerLeft}>
                  <LinearGradient colors={isDefaultTheme ? ['#EFF6FF', '#DBEAFE'] : [appTheme.surface, appTheme.cardBg]} style={styles.pickerIconOrb}>
                    <MaterialIcons name="translate" size={15} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} />
                  </LinearGradient>
                  <Text style={[styles.pickerButtonText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{language}</Text>
                </View>
                <MaterialIcons name="expand-more" size={20} color={isDefaultTheme ? "#94A3B8" : appTheme.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ATTACH FILE */}
          <View style={styles.fieldHeader}>
            <View style={[styles.fieldDot, !isDefaultTheme && { backgroundColor: appTheme.primary }]} />
            <Text style={[styles.sectionLabel, !isDefaultTheme && { color: appTheme.textPrimary }]}>
              ATTACH A FILE{'  '}
              <Text style={{ color: isDefaultTheme ? '#94A3B8' : appTheme.textMuted, fontWeight: '600', textTransform: 'none' }}>optional</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.fileAttachmentBox,
              fileName ? styles.fileAttachmentBoxActive : null,
              !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: fileName ? appTheme.primary : appTheme.border }
            ]}
            onPress={handleToggleFile}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={fileName ? (isDefaultTheme ? ['#DBEAFE', '#EFF6FF'] : [appTheme.surface, appTheme.cardBg]) : (isDefaultTheme ? ['#F1F5F9', '#F8FAFC'] : [appTheme.surface, appTheme.cardBg])}
              style={styles.fileIconOrb}
            >
              <MaterialIcons
                name={fileName ? "insert-drive-file" : "cloud-upload"}
                size={18}
                color={fileName ? (isDefaultTheme ? "#1D4ED8" : appTheme.primary) : (isDefaultTheme ? "#94A3B8" : appTheme.textMuted)}
              />
            </LinearGradient>
            <Text style={[styles.fileAttachmentText, fileName ? styles.fileAttachmentTextActive : null, !isDefaultTheme && { color: fileName ? appTheme.primary : appTheme.textMuted }]} numberOfLines={1}>
              {fileName ? fileName : "Tap to choose a file (Image / PDF)"}
            </Text>
            {fileName ? (
              <TouchableOpacity onPress={() => setFileName('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <MaterialIcons name="close" size={17} color={isDefaultTheme ? "#94A3B8" : appTheme.textMuted} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>

          {/* ── GENERATE BUTTON ── */}
          {!generating ? (
            <TouchableOpacity
              style={styles.generateBtnContainer}
              onPress={handleGenerate}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={isDefaultTheme ? ['#1E3A8A', '#1D4ED8', '#2563EB'] : [appTheme.primary, appTheme.accent, appTheme.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.generateBtn}
              >
                <View style={styles.generateBtnHighlight} />

                <View style={styles.generateBtnIconZone}>
                  <MaterialIcons name="auto-awesome" size={20} color="#93C5FD" />
                </View>

                <View style={styles.generateBtnDivider} />

                <View style={styles.generateBtnLabelBlock}>
                  <Text style={styles.generateBtnText} numberOfLines={1}>Generate Lesson Plan</Text>
                  <Text style={styles.generateBtnSubText} numberOfLines={1}>SLOs · Activities · Timings · Rubric</Text>
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
            <View style={[styles.generatingContainer, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.primary }]}>
              <ActivityIndicator color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} size="small" style={{ marginRight: 10 }} />
              <Text style={[styles.generatingButtonText, !isDefaultTheme && { color: appTheme.primary }]}>Generating Lesson Plan…</Text>
            </View>
          )}
        </View>

        {/* ── PROCESSING LOADER CARD ── */}
        {generating && (
          <View style={[styles.loaderCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>
            <View style={styles.loaderHeader}>
              <ActivityIndicator color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} size="small" style={{ marginRight: 10 }} />
              <Text style={[styles.loaderStatus, !isDefaultTheme && { color: appTheme.textPrimary }]}>{progressStatus}</Text>
            </View>
            <View style={[styles.progressBarBg, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
              <LinearGradient
                colors={isDefaultTheme ? ['#1D4ED8', '#60A5FA'] : appTheme.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress}%` as any }]}
              />
            </View>
            <Text style={[styles.loaderPercentage, !isDefaultTheme && { color: appTheme.textSecondary }]}>{progress}% Complete</Text>
          </View>
        )}

        {/* ── GENERATED LESSON PLAN RESULTS ── */}
        {generatedPlan && !generating && (
          <View style={{ marginBottom: 30 }}>
            {/* Header Title Row */}
            <View style={styles.viewPlanHeaderRow}>
              <LinearGradient colors={isDefaultTheme ? ['#1D4ED8', '#3B82F6'] : appTheme.primaryGradient} style={styles.bulletIndicator} />
              <Text style={[styles.viewPlanTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>View Lesson Plan</Text>
              <View style={[styles.planCountBadge, !isDefaultTheme && { backgroundColor: appTheme.primary }]}>
                <Text style={styles.planCountText}>Ready</Text>
              </View>
            </View>

            {/* Main Lesson Plan Document Card */}
            <View style={[styles.planCard, !isDefaultTheme && { backgroundColor: appTheme.cardBg, borderColor: appTheme.border }]}>

              {/* Document Title & Meta Header */}
              <View style={[styles.docHeader, !isDefaultTheme && { borderBottomColor: appTheme.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.docTopic, !isDefaultTheme && { color: appTheme.textPrimary }]}>{generatedPlan.topic}</Text>
                  <View style={styles.docBadgeRow}>
                    <View style={[styles.metaBadge, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                      <MaterialIcons name="translate" size={12} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.metaBadgeText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{generatedPlan.language}</Text>
                    </View>
                    <View style={[styles.metaBadge, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                      <MaterialIcons name="school" size={12} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.metaBadgeText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>{generatedPlan.level}</Text>
                    </View>
                  </View>
                </View>

                {/* Action buttons (Copy & Print) */}
                <View style={styles.docActionRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, copied && { backgroundColor: '#10B981' }, !isDefaultTheme && !copied && { backgroundColor: appTheme.surface }]}
                    onPress={handleCopy}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name={copied ? "check" : "content-copy"} size={14} color={copied ? "#fff" : (isDefaultTheme ? "#1D4ED8" : appTheme.primary)} />
                    <Text style={[styles.actionBtnText, copied && { color: '#fff' }, !isDefaultTheme && !copied && { color: appTheme.textPrimary }]}>
                      {copied ? 'Copied' : 'Copy'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: isDefaultTheme ? '#1D4ED8' : appTheme.primary }]}
                    onPress={handlePrint}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="print" size={14} color="#fff" />
                    <Text style={[styles.actionBtnText, { color: '#fff' }]}>Print</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 1. Student Learning Outcomes (SLOs) */}
              <View style={styles.docSection}>
                <View style={styles.docSectionHeader}>
                  <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>SLOs</Text>
                  </View>
                  <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Student Learning Outcomes (SLOs)</Text>
                </View>
                <View style={[styles.sloBox, !isDefaultTheme && { backgroundColor: appTheme.surface, borderLeftColor: appTheme.primary }]}>
                  <Text style={[styles.sloText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{generatedPlan.slos}</Text>
                </View>
              </View>

              {/* 2. Learning Objectives */}
              <View style={styles.docSection}>
                <View style={styles.docSectionHeader}>
                  <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>Objectives</Text>
                  </View>
                  <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Learning Objectives</Text>
                </View>
                <Text style={[styles.objIntro, !isDefaultTheme && { color: appTheme.textMuted }]}>By the end of this lesson, students will be able to:</Text>
                {generatedPlan.learningObjectives.map((obj, i) => (
                  <View key={i} style={styles.bulletRow}>
                    <LinearGradient colors={isDefaultTheme ? ['#1D4ED8', '#60A5FA'] : appTheme.primaryGradient} style={styles.bulletDot} />
                    <Text style={[styles.bulletText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{obj}</Text>
                  </View>
                ))}
              </View>

              {/* 3. Materials Needed Table */}
              <View style={styles.docSection}>
                <View style={styles.docSectionHeader}>
                  <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>Resources</Text>
                  </View>
                  <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Materials Needed</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                  <View style={[styles.tableContainer, { minWidth: 320, width: '100%' }, !isDefaultTheme && { borderColor: appTheme.border }]}>
                    {/* Table Header */}
                    <View style={[styles.tableHeaderRow, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                      <Text style={[styles.tableHeaderCell, { flex: 1.2 }, !isDefaultTheme && { color: appTheme.textPrimary }]}>Material</Text>
                      <Text style={[styles.tableHeaderCell, { flex: 0.8 }, !isDefaultTheme && { color: appTheme.textPrimary }]}>Quantity</Text>
                      <Text style={[styles.tableHeaderCell, { flex: 2 }, !isDefaultTheme && { color: appTheme.textPrimary }]}>Description</Text>
                    </View>
                    {/* Table Rows */}
                    {generatedPlan.materials.map((m, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.tableRow,
                          idx % 2 === 1 && (isDefaultTheme ? styles.tableRowAlt : { backgroundColor: 'rgba(255,255,255,0.02)' }),
                          !isDefaultTheme && { borderBottomColor: appTheme.border }
                        ]}
                      >
                        <Text style={[styles.tableCell, { flex: 1.2, fontWeight: '700' }, !isDefaultTheme && { color: appTheme.textPrimary }]}>{m.material}</Text>
                        <Text style={[styles.tableCell, { flex: 0.8 }, !isDefaultTheme && { color: appTheme.textSecondary }]}>{m.quantity}</Text>
                        <Text style={[styles.tableCell, { flex: 2 }, !isDefaultTheme && { color: appTheme.textSecondary }]}>{m.description}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* 4. Introduction */}
              <View style={styles.docSection}>
                <View style={styles.docSectionHeaderBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                      <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>Phase 1</Text>
                    </View>
                    <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Introduction</Text>
                  </View>
                  <View style={[styles.timingBadge, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <MaterialIcons name="schedule" size={13} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} style={{ marginRight: 3 }} />
                    <Text style={[styles.timingBadgeText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{generatedPlan.introduction.duration}</Text>
                  </View>
                </View>
                <View style={[styles.phaseBox, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                  <Text style={[styles.phaseContentText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{generatedPlan.introduction.content}</Text>
                </View>
              </View>

              {/* 5. Main Activities */}
              <View style={styles.docSection}>
                <View style={styles.docSectionHeaderBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                      <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>Phase 2</Text>
                    </View>
                    <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Main Activities</Text>
                  </View>
                  <View style={[styles.timingBadge, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <MaterialIcons name="schedule" size={13} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} style={{ marginRight: 3 }} />
                    <Text style={[styles.timingBadgeText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{generatedPlan.mainActivities.duration}</Text>
                  </View>
                </View>

                {generatedPlan.mainActivities.activities.map((act, aIdx) => (
                  <View key={aIdx} style={[styles.activityStepCard, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                    <View style={styles.activityStepHeaderRow}>
                      <LinearGradient colors={isDefaultTheme ? ['#1E3A8A', '#2563EB'] : appTheme.primaryGradient} style={styles.stepNumberOrb}>
                        <Text style={styles.stepNumberText}>{act.stepNumber || aIdx + 1}</Text>
                      </LinearGradient>
                      <Text style={[styles.activityTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>{act.title}</Text>
                    </View>
                    <Text style={[styles.activityBodyText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{act.content}</Text>
                    {act.bullets && act.bullets.map((b, bIdx) => (
                      <View key={bIdx} style={styles.subBulletRow}>
                        <MaterialIcons name="arrow-right" size={16} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} />
                        <Text style={[styles.subBulletText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{b}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>

              {/* 6. Assessment & Rubric */}
              <View style={styles.docSection}>
                <View style={styles.docSectionHeaderBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                      <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>Phase 3</Text>
                    </View>
                    <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Assessment & Rubric</Text>
                  </View>
                  <View style={[styles.timingBadge, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <MaterialIcons name="schedule" size={13} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} style={{ marginRight: 3 }} />
                    <Text style={[styles.timingBadgeText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{generatedPlan.assessment.duration}</Text>
                  </View>
                </View>

                <Text style={[styles.assessmentDesc, !isDefaultTheme && { color: appTheme.textSecondary }]}>{generatedPlan.assessment.description}</Text>

                {/* Rubric Table */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                  <View style={[styles.tableContainer, { minWidth: 420, width: '100%' }, !isDefaultTheme && { borderColor: appTheme.border }]}>
                    <View style={[styles.tableHeaderRow, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                      <Text style={[styles.tableHeaderCell, { flex: 1.1 }, !isDefaultTheme && { color: appTheme.textPrimary }]}>Criteria</Text>
                      <Text style={[styles.tableHeaderCell, { flex: 1.3 }, !isDefaultTheme && { color: appTheme.textPrimary }]}>Needs Impr.</Text>
                      <Text style={[styles.tableHeaderCell, { flex: 1.3 }, !isDefaultTheme && { color: appTheme.textPrimary }]}>Satisfactory</Text>
                      <Text style={[styles.tableHeaderCell, { flex: 1.3 }, !isDefaultTheme && { color: appTheme.textPrimary }]}>Excellent</Text>
                    </View>
                    {generatedPlan.assessment.rubric.map((r, rIdx) => (
                      <View
                        key={rIdx}
                        style={[
                          styles.tableRow,
                          rIdx % 2 === 1 && (isDefaultTheme ? styles.tableRowAlt : { backgroundColor: 'rgba(255,255,255,0.02)' }),
                          !isDefaultTheme && { borderBottomColor: appTheme.border }
                        ]}
                      >
                        <Text style={[styles.tableCell, { flex: 1.1, fontWeight: '700' }, !isDefaultTheme && { color: appTheme.textPrimary }]}>{r.criteria}</Text>
                        <Text style={[styles.tableCell, { flex: 1.3, fontSize: 10 }, !isDefaultTheme && { color: appTheme.textSecondary }]}>{r.needsImprovement}</Text>
                        <Text style={[styles.tableCell, { flex: 1.3, fontSize: 10 }, !isDefaultTheme && { color: appTheme.textSecondary }]}>{r.satisfactory}</Text>
                        <Text style={[styles.tableCell, { flex: 1.3, fontSize: 10, color: isDefaultTheme ? '#059669' : '#34D399', fontWeight: '600' }]}>{r.excellent}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* 7. Conclusion */}
              <View style={styles.docSection}>
                <View style={styles.docSectionHeaderBetween}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                      <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>Phase 4</Text>
                    </View>
                    <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Conclusion</Text>
                  </View>
                  <View style={[styles.timingBadge, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <MaterialIcons name="schedule" size={13} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} style={{ marginRight: 3 }} />
                    <Text style={[styles.timingBadgeText, !isDefaultTheme && { color: appTheme.textPrimary }]}>{generatedPlan.conclusion.duration}</Text>
                  </View>
                </View>
                <View style={[styles.phaseBox, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                  <Text style={[styles.phaseContentText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{generatedPlan.conclusion.content}</Text>
                </View>
              </View>

              {/* 8. Differentiation */}
              <View style={styles.docSection}>
                <View style={styles.docSectionHeader}>
                  <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>Adaptive</Text>
                  </View>
                  <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Differentiation Strategy</Text>
                </View>
                <View style={styles.diffGrid}>
                  <View style={[styles.diffCard, { borderLeftColor: '#F59E0B' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.diffTitle, { color: '#D97706' }]}>For Struggling Learners:</Text>
                    <Text style={[styles.diffText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{generatedPlan.differentiation.struggling}</Text>
                  </View>
                  <View style={[styles.diffCard, { borderLeftColor: '#10B981' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.diffTitle, { color: '#059669' }]}>For Advanced Learners:</Text>
                    <Text style={[styles.diffText, !isDefaultTheme && { color: appTheme.textSecondary }]}>{generatedPlan.differentiation.advanced}</Text>
                  </View>
                </View>
              </View>

              {/* 9. Teacher Reflection */}
              <View style={[styles.docSection, { marginBottom: 0 }]}>
                <View style={styles.docSectionHeader}>
                  <View style={[styles.sectionPill, { backgroundColor: '#EFF6FF' }, !isDefaultTheme && { backgroundColor: appTheme.surface }]}>
                    <Text style={[styles.sectionPillText, { color: '#1D4ED8' }, !isDefaultTheme && { color: appTheme.primary }]}>Notes</Text>
                  </View>
                  <Text style={[styles.docSectionHeading, !isDefaultTheme && { color: appTheme.textPrimary }]}>Teacher Reflection</Text>
                </View>
                <View style={[styles.reflectionBox, !isDefaultTheme && { backgroundColor: appTheme.surface, borderColor: appTheme.border }]}>
                  <Text style={[styles.reflectionText, !isDefaultTheme && { color: appTheme.textMuted }]}>{generatedPlan.reflection}</Text>
                </View>
              </View>

            </View>
          </View>
        )}

      </ScrollView>

      {/* ── MODAL: LEVEL SELECTOR ── */}
      <Modal visible={levelModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setLevelModalVisible(false)}>
          <View style={[styles.modalSheet, !isDefaultTheme && { backgroundColor: appTheme.cardBg }]}>
            <View style={styles.modalSheetHandle} />
            <Text style={[styles.modalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Select Level</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {LEVELS_LIST.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    level === item && (isDefaultTheme ? styles.modalOptionActive : { backgroundColor: 'rgba(59, 130, 246, 0.15)' })
                  ]}
                  onPress={() => {
                    setLevel(item);
                    setLevelModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, !isDefaultTheme && { color: appTheme.textPrimary }, level === item && { color: isDefaultTheme ? '#1D4ED8' : appTheme.primary, fontWeight: '800' }]}>
                    {item}
                  </Text>
                  {level === item && <MaterialIcons name="check-circle" size={18} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── MODAL: LANGUAGE SELECTOR ── */}
      <Modal visible={langModalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setLangModalVisible(false)}>
          <View style={[styles.modalSheet, !isDefaultTheme && { backgroundColor: appTheme.cardBg }]}>
            <View style={styles.modalSheetHandle} />
            <Text style={[styles.modalTitle, !isDefaultTheme && { color: appTheme.textPrimary }]}>Select Language</Text>
            <ScrollView style={{ maxHeight: 280 }}>
              {LANGUAGES_LIST.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    language === item && (isDefaultTheme ? styles.modalOptionActive : { backgroundColor: 'rgba(59, 130, 246, 0.15)' })
                  ]}
                  onPress={() => {
                    setLanguage(item);
                    setLangModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, !isDefaultTheme && { color: appTheme.textPrimary }, language === item && { color: isDefaultTheme ? '#1D4ED8' : appTheme.primary, fontWeight: '800' }]}>
                    {item}
                  </Text>
                  {language === item && <MaterialIcons name="check-circle" size={18} color={isDefaultTheme ? "#1D4ED8" : appTheme.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  // ── HEADER BANNER ──
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 14,
    paddingBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
  },
  headerBarGlow: {
    height: 3,
    width: '100%',
  },

  // ── FORM CARD ──
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.14)',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
    marginRight: 6,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  requestTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.18)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12.5,
    color: '#0F172A',
    fontWeight: '600',
    minHeight: 64,
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridCol: {
    flex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.16)',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 40,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerIconOrb: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  pickerButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },

  // File Upload Box
  fileAttachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(37, 99, 235, 0.25)',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 14,
  },
  fileAttachmentBoxActive: {
    backgroundColor: '#EFF6FF',
    borderStyle: 'solid',
    borderColor: '#3B82F6',
  },
  fileIconOrb: {
    width: 26,
    height: 26,
    borderRadius: 7,
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
    color: '#1D4ED8',
    fontWeight: '700',
  },

  // ── GENERATE BUTTON ──
  generateBtnContainer: {
    marginTop: 2,
    borderRadius: 12,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
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
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  generateBtnHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  generateBtnIconZone: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
  },
  generateBtnDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  generateBtnLabelBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  generateBtnSubText: {
    color: 'rgba(255, 255, 255, 0.8)',
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
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  // Generating State
  generatingContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(37, 99, 235, 0.25)',
  },
  generatingButtonText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.2,
  },

  // ── PROCESSING LOADER CARD ──
  loaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  loaderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  loaderStatus: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
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

  // ── RESULTS SECTION HEADER ──
  viewPlanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  bulletIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
  },
  viewPlanTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
  },
  planCountBadge: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  planCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },

  // ── LESSON PLAN DOCUMENT CARD ──
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.12)',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  docTopic: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  docBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  docActionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },

  // Document Sections
  docSection: {
    marginBottom: 18,
  },
  docSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  docSectionHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  sectionPillText: {
    fontSize: 9.5,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  docSectionHeading: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  timingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
  },

  // Section Content Styles
  sloBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3.5,
    borderLeftColor: '#1D4ED8',
    padding: 10,
    borderRadius: 6,
  },
  sloText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
  },
  objIntro: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
    gap: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  bulletText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    flex: 1,
    fontWeight: '500',
  },

  // Tables
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 6,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tableHeaderCell: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    alignItems: 'center',
  },
  tableRowAlt: {
    backgroundColor: '#F8FAFC',
  },
  tableCell: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 15,
  },

  // Phase Boxes
  phaseBox: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
  },
  phaseContentText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },

  // Activity Step Cards
  activityStepCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activityStepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  stepNumberOrb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  activityTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  activityBodyText: {
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 17,
  },
  subBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    gap: 2,
  },
  subBulletText: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
    lineHeight: 16,
  },
  assessmentDesc: {
    fontSize: 11.5,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 16,
  },

  // Differentiation Grid
  diffGrid: {
    gap: 8,
  },
  diffCard: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3.5,
    padding: 8,
    borderRadius: 6,
  },
  diffTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  diffText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },

  // Reflection
  reflectionBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    padding: 10,
    borderRadius: 8,
  },
  reflectionText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    lineHeight: 16,
  },

  // ── MODALS ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  modalSheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalOptionActive: {
    backgroundColor: '#EFF6FF',
  },
  modalOptionText: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '600',
  },
});
