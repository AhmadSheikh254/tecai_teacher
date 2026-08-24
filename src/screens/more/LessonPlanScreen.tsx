import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Platform,
  Pressable
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Path, Line, G } from 'react-native-svg';

// Custom interfaces for Lesson Plan data structures
interface MaterialItem {
  name: string;
  quantity: string;
  desc: string;
}

interface AssessmentRow {
  criteria: string;
  excellent: string;
  good: string;
  needsImp: string;
}

interface LessonPlan {
  id: string;
  topic: string;
  language: string;
  level: string;
  color?: string; // Dynamic color theme configuration for premium aesthetic
  fileName?: string;
  slos: string[];
  objectives: string[];
  materials: MaterialItem[];
  introduction: string;
  mainActivities: {
    title: string;
    duration: string;
    details: string;
  }[];
  worksheet: string[];
  assessment: AssessmentRow[];
}

export const LessonPlanScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  // Form states
  const [requestInput, setRequestInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('Level 4');
  const [fileName, setFileName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('Initializing AI Model...');

  // Picker modals toggles
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(false);

  // Active viewing state
  const [activePlan, setActivePlan] = useState<LessonPlan | null>(null);

  // Pre-seeded high-fidelity mock data lesson plans
  const [plans, setPlans] = useState<LessonPlan[]>([
    {
      id: 'demo_flowers',
      topic: 'Flowers Anatomy and Pollination',
      language: 'English',
      level: 'Level 4',
      color: '#0047CC', // Restored Original Brand Blue
      fileName: 'science_curriculum_reference.pdf',
      slos: [
        'Identify and label the primary parts of a flower (Petals, Sepal, Pistil, Stamen).',
        'Understand the role of flowers in plant reproduction.',
        'Explain how insects and wind assist in the pollination process.'
      ],
      objectives: [
        'Students will be able to dissect a flower and identify its internal reproductive organs with 90% accuracy.',
        'Students will draw and label a complete diagram of a flower.',
        'Students will explain the difference between self-pollination and cross-pollination.'
      ],
      materials: [
        { name: 'Fresh Hibiscus or Lilies', quantity: '1 per pair', desc: 'Large flowers with clear reproductive parts for easy dissection.' },
        { name: 'Magnifying Glasses', quantity: '1 per student', desc: 'For viewing pollen grains and internal ovules.' },
        { name: 'Dissection Worksheets & Plastic Scalpels', quantity: '1 set per pair', desc: 'Guided diagram sheet to place parts and label them.' },
        { name: 'Colored Glitter & Cotton Swabs', quantity: 'Assorted', desc: 'To simulate pollen transfer in pollination roleplay.' }
      ],
      introduction: 'Begin the lesson by showing a vibrant bouquet of flowers. Ask the students: "Why are flower petals so brightly colored? Is it just to look pretty?" Guide the discussion towards attracting pollinators like bees, butterflies, and hummingbirds. Explain that flowers are the reproductive centers of plants.',
      mainActivities: [
        {
          title: 'Activity 1: Flower Dissection Lab',
          duration: '15 Mins',
          details: 'In pairs, students use plastic tools to carefully separate the sepal, petals, stamen (filament & anther), and pistil (stigma, style, ovary) of their flower. They tape each part onto their worksheet diagram and write its primary function.'
        },
        {
          title: 'Activity 2: Pollination Simulation Roleplay',
          duration: '10 Mins',
          details: 'Using glitter on paper flowers (representing pollen) and cotton swabs (representing bee legs), students transfer "pollen" from flower A to flower B. They observe how easily pollen clings to surfaces and discuss the mechanic of fertilization.'
        }
      ],
      worksheet: [
        'Anatomy Lab: Fill out labeled boxes for the dissected parts of the flower.',
        'Sequence Ordering: Arrange the steps of pollination from insect arrival to seed formation.',
        'Critical Thinking: Write a short paragraph explaining what would happen to apple trees if all bees vanished.'
      ],
      assessment: [
        {
          criteria: 'Anatomy Labeling',
          excellent: 'Accurately identifies and correctly positions all parts on the dissection board.',
          good: 'Identifies most parts correctly with minor mislabeling.',
          needsImp: 'Fails to locate key reproductive parts or leaves them blank.'
        },
        {
          criteria: 'Pollination Mechanic',
          excellent: 'Clearly explains the step-by-step process of pollination and insect involvement.',
          good: 'Describes pollination but misses the role of fertilization or wind vectors.',
          needsImp: 'Shows poor understanding of how pollen moves between flowers.'
        }
      ]
    },
    {
      id: 'demo_matter',
      topic: 'States of Matter and Phase Changes',
      language: 'English',
      level: 'Level 4',
      color: '#0047CC', // Restored Original Brand Blue
      fileName: 'WhatsApp Image 2026-08-10 at 12.44.42 PM.jpeg',
      slos: [
        'Differentiate between Solids, Liquids, and Gases based on particle structure.',
        'Describe properties of matter (shape, volume, compressibility).',
        'Observe and explain phase transitions (melting, freezing, condensation, evaporation).'
      ],
      objectives: [
        'Students will draw particle arrangements of solids, liquids, and gases.',
        'Students will measure and record temperature during water phase transitions.',
        'Students will define melting point and boiling point.'
      ],
      materials: [
        { name: 'Ice Cubes & Hot Plate', quantity: '1 set per class', desc: 'To visually demonstrate transitions from solid to liquid to gas.' },
        { name: 'Clear Plastic Beakers', quantity: '3 per group', desc: 'Representing containers for solid, liquid, and gas samples.' },
        { name: 'Balloons & Squeeze Bottles', quantity: 'Assorted', desc: 'To show gas shape/volume compressibility experiments.' }
      ],
      introduction: 'Hold up an ice cube. Ask: "What state of matter is this?" Drop it into a cup. Heat it until it melts, and eventually turns to steam. Ask: "Did the water vanish, or did it change form?" Introduce the concept that temperature changes molecular speeds, driving phase shifts.',
      mainActivities: [
        {
          title: 'Activity 1: Molecule Movement Simulation',
          duration: '15 Mins',
          details: 'Take students to an open area. Ask them to link arms tightly and vibrate in place (solid). Then tell them to hold hands loosely and slide past each other (liquid). Finally, tell them to release hands and run freely in all directions (gas).'
        },
        {
          title: 'Activity 2: Phase Transition Lab',
          duration: '10 Mins',
          details: 'Groups observe ice melting in beakers. They measure water temperature every 2 minutes and chart the phase transition plateau on a simple line graph, noting when it stays at 0°C during the melting process.'
        }
      ],
      worksheet: [
        'Graphing Activity: Label the phase change diagram (solid -> liquid -> gas) with correct temperature lines.',
        'Properties Matrix: Fill in shapes, volumes, and compressibilities of solids, liquids, and gases.',
        'Everyday Science: Identify condensation in real life (e.g. morning dew or soda cup sweat).'
      ],
      assessment: [
        {
          criteria: 'Particle Drawings',
          excellent: 'Correctly draws tight grid patterns for solid, floating circles for liquid, and scattered ones for gas.',
          good: 'Draws particle arrangements with minor structural errors.',
          needsImp: 'Shows no distinction in molecular density between states.'
        },
        {
          criteria: 'Phase Charting',
          excellent: 'Accurately logs and explains temperature plateaus during transitions.',
          good: 'Logs temperatures but struggles to explain why temperature remains flat during state transition.',
          needsImp: 'Incomplete data log sheets or incorrect graphing trends.'
        }
      ]
    },
    {
      id: 'demo_solar',
      topic: 'Solar System Orbits and Scale Model',
      language: 'English',
      level: 'Level 5',
      color: '#0047CC', // Restored Original Brand Blue
      fileName: 'solar_system_guide.pdf',
      slos: [
        'Name the eight planets in order of distance from the Sun.',
        'Explain planetary orbits and the role of gravity in keeping planets aligned.',
        'Appreciate the vast relative scale of planets and distances between them.'
      ],
      objectives: [
        'Students will sequence planets using a mnemonic device.',
        'Students will build a physical scale model of planetary sizes.',
        'Students will calculate relative years on different planets.'
      ],
      materials: [
        { name: 'Fruity Scale Models (Grapefruit, Cherry, Peppercorn)', quantity: '1 set', desc: 'Representing Sun, Jupiter, Earth, and Mercury to show size relationships.' },
        { name: '50-Meter Measuring Tape', quantity: '2 rolls', desc: 'To lay out relative distance models in the school corridor.' },
        { name: 'Planet Fact Profile Cards', quantity: '8 cards', desc: 'Contains gravity strength, temperatures, and orbital speeds for reference.' }
      ],
      introduction: 'Darken the classroom. Shine a bright flashlight (the Sun) on a globe (the Earth). Spin the globe and orbit it around the light. Ask: "Why does it get colder or warmer, and why does a year take 365 days?" Explain gravitational pull.',
      mainActivities: [
        {
          title: 'Activity 1: Planet Corridor Scale Walk',
          duration: '15 Mins',
          details: 'Students walk down the main school hallway, placing representing markers at relative steps (e.g., Mercury at 1 step, Earth at 2.5 steps, Jupiter at 13 steps). Demonstrates how empty space is in the outer solar system.'
        },
        {
          title: 'Activity 2: Gravity Jump Lab',
          duration: '10 Mins',
          details: 'Students calculate how high they can jump on Mars, Jupiter, or the Moon compared to Earth by multiplying their average jump height by planetary gravity indices. They record findings on a chart.'
        }
      ],
      worksheet: [
        'Planetary Sequencing: Write down the order of planets from closest to furthest from the Sun.',
        'Mnemonic Challenge: Invent a new creative sentence to remember the planets (e.g., My Very Educated Mother...).',
        'Gravity Assessment: Summarize why gas giants have higher gravitational strengths.'
      ],
      assessment: [
        {
          criteria: 'Planetary Ordering',
          excellent: 'Correctly sequences all planets and places Asteroid belt correctly.',
          good: 'Sequences planets but swaps positions of Venus/Mercury or Uranus/Neptune.',
          needsImp: 'Confuses outer and inner planets completely.'
        },
        {
          criteria: 'Scale Concept Recall',
          excellent: 'Accurately describes size scale gaps (e.g. Jupiter vs. Earth) and distance spacing differences.',
          good: 'Understands size differences but doesn\'t grasp how far outer planets are spaced.',
          needsImp: 'Draws all planets as identical size spheres with equal spacing.'
        }
      ]
    }
  ]);

  // Handle mock file attachment toggle
  const handleToggleMockFile = () => {
    if (fileName) {
      setFileName('');
    } else {
      setFileName('WhatsApp Image 2026-08-10 at 12.44.42 PM.jpeg');
    }
  };

  // Run mock generation progress simulation
  const handleGenerateLessonPlan = () => {
    if (requestInput.trim() === '') {
      alert('Please enter a lesson plan topic or request!');
      return;
    }

    setGenerating(true);
    setProgress(0);
    setProgressStatus('Initializing AI Core Model...');

    // Progress bar simulation interval
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Add generated plan to state list
            const newPlan: LessonPlan = {
              id: 'plan_' + Date.now(),
              topic: requestInput,
              language: language,
              level: level,
              fileName: fileName || undefined,
              slos: [
                `Analyze primary fundamentals and core mechanics of "${requestInput}".`,
                `Identify critical parameters and key elements within the topic.`,
                `Apply theoretical frameworks of "${requestInput}" to practical grade-appropriate contexts.`
              ],
              objectives: [
                `Students will formulate an explanatory diagram modeling ${requestInput}.`,
                `Students will discuss three practical applications in small groups.`,
                `Students will complete a diagnostic quiz with at least 80% marks.`
              ],
              materials: [
                { name: 'Teacher Visual Reference Slide deck', quantity: '1 set', desc: 'Visual aids detailing key concept points.' },
                { name: 'Student Workspace Handout Sheets', quantity: '1 per student', desc: 'Activity guides, definitions, and questions.' },
                { name: 'Interactive Group Activity Kit', quantity: 'Assorted', desc: 'Materials to support hands-on tasks.' }
              ],
              introduction: `Begin the class by raising a thought-provoking challenge or daily scenario related to "${requestInput}". Encourage student brainstorming and connect their responses directly to the learning goals of the lesson.`,
              mainActivities: [
                {
                  title: 'Activity 1: Structured Exploration',
                  duration: '15 Mins',
                  details: `Groups investigate basic configurations of ${requestInput}. Students log variables on worksheets and discuss observations with peers.`
                },
                {
                  title: 'Activity 2: Concept Synthesis',
                  duration: '10 Mins',
                  details: 'Class combines observations to construct a unified summary grid on the main white board. Teacher clarifies misconceptions.'
                }
              ],
              worksheet: [
                `Data Log: Match key vocabulary definitions related to ${requestInput}.`,
                `Graphic Organizer: Draw and fill in the components of the core concept.`,
                `Exit Ticket: Answer three formative review questions.`
              ],
              assessment: [
                {
                  criteria: 'Conceptual Clarity',
                  excellent: 'Demonstrates master-level grasp of all core principles.',
                  good: 'Explains primary concepts with minor definitions gaps.',
                  needsImp: 'Shows significant confusion or repeats basic descriptions.'
                },
                {
                  criteria: 'Worksheet Completion',
                  excellent: 'Completes all sections with highly detailed answers.',
                  good: 'Completes most sections with basic matching accuracy.',
                  needsImp: 'Leaves major sections blank or displays multiple errors.'
                }
              ]
            };

            setPlans((prevPlans) => [newPlan, ...prevPlans]);
            setGenerating(false);
            setRequestInput('');
            setFileName('');
            
            // Auto open the newly generated plan in view mode!
            setActivePlan(newPlan);
          }, 400);
          return 100;
        }

        // Adjust status label based on percentage
        if (next < 25) {
          setProgressStatus('Drafting Learning Outcomes (SLOs)...');
        } else if (next < 50) {
          setProgressStatus('Formulating Lesson Objectives...');
        } else if (next < 75) {
          setProgressStatus('Assembling Materials and Resource Tables...');
        } else {
          setProgressStatus('Constructing Grading Assessment Rubrics...');
        }
        return next;
      });
    }, 120);
  };
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      {/* ── Ambient mesh background ── */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          {/* top-right deep navy */}
          <Circle cx="105%" cy="-2%"  r="340" fill="#1B3270" opacity={0.07} />
          {/* mid-left indigo */}
          <Circle cx="-8%"  cy="45%" r="300" fill="#3730A3" opacity={0.055} />
          {/* bottom-center royal blue */}
          <Circle cx="55%"  cy="100%" r="380" fill="#1E40AF" opacity={0.065} />
          {/* small accent top-left */}
          <Circle cx="20%"  cy="18%" r="120" fill="#6366F1" opacity={0.04} />
        </Svg>
      </View>

      {/* ── HEADER ── */}
      <LinearGradient colors={['#0D1B4B', '#0047CC']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.header}>
        {/* decorative orbs */}
        <View style={{position:'absolute', right:-40, top:-60, width:180, height:180, borderRadius:90, backgroundColor:'rgba(99,102,241,0.18)'}} />
        <View style={{position:'absolute', left:-20, bottom:-40, width:120, height:120, borderRadius:60, backgroundColor:'rgba(14,165,233,0.14)'}} />

        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
            <View style={styles.backBtnInner}>
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            {/* Icon badge */}
            <LinearGradient colors={['rgba(255,255,255,0.25)','rgba(255,255,255,0.08)']} style={styles.headerIconBox}>
              <Svg width="20" height="20" viewBox="0 0 32 32">
                <Rect x="7" y="4" width="18" height="24" rx="3.5" fill="#fff" opacity={0.92}/>
                <Path d="M12 4 C12 2.2, 20 2.2, 20 4" fill="#0047CC"/>
                <Line x1="11" y1="11" x2="21" y2="11" stroke="#0047CC" strokeWidth={2.2} strokeLinecap="round"/>
                <Line x1="11" y1="16" x2="18" y2="16" stroke="#0047CC" strokeWidth={2.2} strokeLinecap="round"/>
                <Line x1="11" y1="21" x2="21" y2="21" stroke="#0047CC" strokeWidth={2.2} strokeLinecap="round"/>
              </Svg>
            </LinearGradient>

            <View style={{flex:1}}>
              <Text style={styles.headerTitle}>Lesson Plan Generator</Text>
              <Text style={styles.headerSubtitle}>AI-powered · Grade-aligned · Curriculum ready</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
      {/* cyan accent bar */}
      <LinearGradient colors={['#00FFCC','#0047CC']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.headerBarGlow}/>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* ── AI FEATURE PILLS ── */}
        <View style={styles.pillRow}>
          {['✦ Multilingual','⚡ Instant Draft','📋 Rubric Auto-gen'].map((t,i) => (
            <View key={i} style={styles.featurePill}>
              <Text style={styles.featurePillText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* ── FORM CARD ── */}
        <View style={styles.card}>

          {/* YOUR REQUEST */}
          <View style={styles.fieldHeader}>
            <View style={styles.fieldDot}/>
            <Text style={styles.sectionLabel}>Your Request</Text>
          </View>
          <TextInput
            style={styles.requestTextArea}
            placeholder="Describe your lesson topic…  e.g. Solar System, Photosynthesis"
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={requestInput}
            onChangeText={setRequestInput}
            editable={!generating}
          />

          {/* LANGUAGE & LEVEL */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldDot}/>
                <Text style={styles.sectionLabel}>Language</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => !generating && setLangModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.pickerLeft}>
                  <LinearGradient colors={['#EEF2FF','#E0E7FF']} style={styles.pickerIconOrb}>
                    <MaterialIcons name="translate" size={15} color="#0047CC"/>
                  </LinearGradient>
                  <Text style={styles.pickerButtonText}>{language}</Text>
                </View>
                <MaterialIcons name="expand-more" size={20} color="#94A3B8"/>
              </TouchableOpacity>
            </View>

            <View style={styles.gridCol}>
              <View style={styles.fieldHeader}>
                <View style={styles.fieldDot}/>
                <Text style={styles.sectionLabel}>Level</Text>
              </View>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => !generating && setLevelModalVisible(true)}
                activeOpacity={0.8}
              >
                <View style={styles.pickerLeft}>
                  <LinearGradient colors={['#EEF2FF','#E0E7FF']} style={styles.pickerIconOrb}>
                    <MaterialIcons name="school" size={15} color="#0047CC"/>
                  </LinearGradient>
                  <Text style={styles.pickerButtonText}>{level}</Text>
                </View>
                <MaterialIcons name="expand-more" size={20} color="#94A3B8"/>
              </TouchableOpacity>
            </View>
          </View>

          {/* ATTACH FILE */}
          <View style={styles.fieldHeader}>
            <View style={styles.fieldDot}/>
            <Text style={styles.sectionLabel}>Attach File  <Text style={{color:'#94A3B8',fontWeight:'600',textTransform:'none'}}>optional</Text></Text>
          </View>
          <TouchableOpacity
            style={[styles.fileAttachmentBox, fileName ? styles.fileAttachmentBoxActive : null]}
            onPress={handleToggleMockFile}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={fileName ? ['#DBEAFE','#EFF6FF'] : ['#F1F5F9','#F8FAFC']}
              style={styles.fileIconOrb}
            >
              <MaterialIcons
                name={fileName ? "insert-drive-file" : "cloud-upload"}
                size={18}
                color={fileName ? "#0047CC" : "#94A3B8"}
              />
            </LinearGradient>
            <Text style={[styles.fileAttachmentText, fileName ? styles.fileAttachmentTextActive : null]} numberOfLines={1}>
              {fileName ? fileName : "Tap to choose a file (Image / PDF)"}
            </Text>
            {fileName && (
              <TouchableOpacity onPress={() => setFileName('')} hitSlop={{top:8,bottom:8,left:8,right:8}}>
                <MaterialIcons name="close" size={17} color="#94A3B8" style={{marginLeft:6}}/>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* ── GENERATE BUTTON ── */}
          {!generating ? (
            <TouchableOpacity
              style={styles.generateBtnContainer}
              onPress={handleGenerateLessonPlan}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#152960', '#1E3A99', '#2B50CC']}
                start={{x:0, y:0}}
                end={{x:1, y:1}}
                style={styles.generateBtn}
              >
                {/* top highlight */}
                <View style={styles.generateBtnHighlight} />

                {/* Icon zone */}
                <View style={styles.generateBtnIconZone}>
                  <MaterialIcons name="auto-fix-high" size={20} color="#fff" />
                </View>

                {/* Divider */}
                <View style={styles.generateBtnDivider} />

                {/* Label */}
                <View style={styles.generateBtnLabelBlock}>
                  <Text style={styles.generateBtnText}>Generate Lesson Plan</Text>
                  <Text style={styles.generateBtnSubText}>AI · Multilingual · Grade-ready</Text>
                </View>

                {/* Premium arrow pill */}
                <LinearGradient
                  colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.08)']}
                  start={{x:0, y:0}}
                  end={{x:0, y:1}}
                  style={styles.generateBtnArrow}
                >
                  <MaterialIcons name="double-arrow" size={16} color="#fff" />
                </LinearGradient>

              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.generatingContainer}>
              <ActivityIndicator color="#0047CC" size="small" style={{marginRight:10}}/>
              <Text style={styles.generatingButtonText}>Generating your plan…</Text>
            </View>
          )}
        </View>

        {/* ── PROCESSING LOADER ── */}
        {generating && (
          <View style={styles.loaderCard}>
            <View style={styles.loaderHeader}>
              <ActivityIndicator color="#0047CC" size="small" style={{marginRight:10}}/>
              <Text style={styles.loaderStatus}>{progressStatus}</Text>
            </View>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#0047CC','#0EA5E9']}
                start={{x:0,y:0}} end={{x:1,y:0}}
                style={[styles.progressBarFill, {width:`${progress}%` as any}]}
              />
            </View>
            <Text style={styles.loaderPercentage}>{progress}% Complete</Text>
          </View>
        )}

        {/* ── PLANS LIST HEADER ── */}
        <View style={styles.viewPlanHeaderRow}>
          <LinearGradient colors={['#0047CC','#0EA5E9']} style={styles.bulletIndicator}/>
          <Text style={styles.viewPlanTitle}>Generated Lesson Plans</Text>
          <View style={styles.planCountBadge}>
            <Text style={styles.planCountText}>{plans.length}</Text>
          </View>
        </View>

        {/* ── PLANS CARDS ── */}
        <View style={styles.plansListContainer}>
          {plans.map((p, index) => (
            <TouchableOpacity
              key={p.id}
              style={styles.planItemCard}
              onPress={() => setActivePlan(p)}
              activeOpacity={0.86}
            >

              {/* subtle top highlight */}
              <View style={styles.planItemTopHighlight}/>

              {/* premium icon orb */}
              <LinearGradient
                colors={['#EBF2FF','#DBEAFE','#C8D9F7']}
                start={{x:0,y:0}} end={{x:1,y:1}}
                style={styles.planItemIconWrapper}
              >
                <View style={styles.planItemIconInner}>
                  <MaterialIcons name="description" size={22} color="#1E40AF"/>
                </View>
              </LinearGradient>

              {/* text */}
              <View style={styles.planItemTextContent}>
                <Text style={styles.planItemTopic} numberOfLines={1}>{p.topic}</Text>
                <View style={styles.planMetaRow}>
                  <View style={styles.planMetaPill}>
                    <MaterialIcons name="language" size={9} color="#4B6CB7" style={{marginRight:3}}/>
                    <Text style={styles.planMetaPillText}>{p.language}</Text>
                  </View>
                  <View style={[styles.planMetaPill, styles.planMetaPillBlue]}>
                    <MaterialIcons name="school" size={9} color="#1B3270" style={{marginRight:3}}/>
                    <Text style={[styles.planMetaPillText,{color:'#1B3270'}]}>{p.level}</Text>
                  </View>
                </View>
              </View>

              {/* ── Premium Eye Button ── */}
              <View style={styles.eyeBtnOuter}>
                <LinearGradient
                  colors={['#1B3270','#2563EB']}
                  start={{x:0,y:0}} end={{x:1,y:1}}
                  style={styles.eyeBtnCore}
                >
                  {/* inner gloss highlight */}
                  <View style={styles.eyeBtnGloss}/>
                  <MaterialIcons name="remove-red-eye" size={18} color="#fff"/>
                </LinearGradient>
              </View>

            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>


      {/* LANGUAGE SELECTOR PICKER MODAL */}
      <Modal visible={langModalVisible} transparent={true} animationType="slide">
        <PressableModalBackdrop onClose={() => setLangModalVisible(false)}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.pickerModalTitle}>Select Language</Text>
            {['English', 'Urdu', 'Punjabi', 'Sindhi', 'Pashto'].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.pickerModalItem, language === l && styles.pickerModalItemActive]}
                onPress={() => {
                  setLanguage(l);
                  setLangModalVisible(false);
                }}
              >
                <Text style={[styles.pickerModalItemText, language === l && styles.pickerModalItemTextActive]}>{l}</Text>
                {language === l && <MaterialIcons name="check" size={18} color="#003d9b" />}
              </TouchableOpacity>
            ))}
          </View>
        </PressableModalBackdrop>
      </Modal>

      {/* LEVEL SELECTOR PICKER MODAL */}
      <Modal visible={levelModalVisible} transparent={true} animationType="slide">
        <PressableModalBackdrop onClose={() => setLevelModalVisible(false)}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.pickerModalTitle}>Select Level</Text>
            {['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8'].map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.pickerModalItem, level === l && styles.pickerModalItemActive]}
                onPress={() => {
                  setLevel(l);
                  setLevelModalVisible(false);
                }}
              >
                <Text style={[styles.pickerModalItemText, level === l && styles.pickerModalItemTextActive]}>{l}</Text>
                {level === l && <MaterialIcons name="check" size={18} color="#003d9b" />}
              </TouchableOpacity>
            ))}
          </View>
        </PressableModalBackdrop>
      </Modal>

      {/* ── HIGH FIDELITY DETAILED LESSON PLAN VIEWER (SCREENSHOT 3 STYLE) ── */}
      <Modal visible={activePlan !== null} transparent={true} animationType="slide">
        <View style={styles.viewerBackdrop}>
          <SafeAreaView style={styles.viewerContainer} edges={['top', 'bottom']}>
            
            {/* Viewer Top Action Bar */}
            <View style={styles.viewerTopBar}>
              <TouchableOpacity 
                style={styles.viewerCloseBtn} 
                onPress={() => setActivePlan(null)}
                activeOpacity={0.7}
              >
                <MaterialIcons name="arrow-back" size={20} color="#0A1F5C" />
                <Text style={styles.viewerCloseText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.printBtn} 
                onPress={() => alert('Print command initialized! Loading printer preview...')}
                activeOpacity={0.7}
              >
                <MaterialIcons name="print" size={15} color="#003d9b" style={{ marginRight: 5 }} />
                <Text style={styles.printBtnText}>Print</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.viewerScrollContent} showsVerticalScrollIndicator={false}>
              
              {/* Clean Sheet Paper Layout */}
              <View style={styles.paperSheet}>
                
                {/* Sheet Title */}
                <Text style={styles.sheetHeaderTitle}>Lesson Plan: {activePlan?.topic}</Text>
                <View style={styles.sheetMetaRow}>
                  <Text style={styles.sheetMetaText}>Target: {activePlan?.level} • Language: {activePlan?.language}</Text>
                  {activePlan?.fileName && (
                    <Text style={styles.sheetMetaFile}>Reference File: {activePlan.fileName}</Text>
                  )}
                </View>
                <View style={styles.sheetDivider} />

                {/* 1. SLOs */}
                <Text style={styles.sheetSectionTitle}>1. Student Learning Outcomes (SLOs)</Text>
                {activePlan?.slos.map((item, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}

                {/* 2. Objectives */}
                <Text style={styles.sheetSectionTitle}>2. Learning Objectives</Text>
                {activePlan?.objectives.map((item, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>*</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}

                {/* 3. Materials Needed */}
                <Text style={styles.sheetSectionTitle}>3. Materials Needed</Text>
                
                {/* Table Header */}
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Material</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Quantity</Text>
                  <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Description</Text>
                </View>
                {/* Table Rows */}
                {activePlan?.materials.map((m, idx) => (
                  <View key={idx} style={[styles.tableDataRow, idx % 2 === 1 && { backgroundColor: '#F8FAFC' }]}>
                    <Text style={[styles.tableDataCell, { flex: 1.5, fontWeight: '700' }]}>{m.name}</Text>
                    <Text style={[styles.tableDataCell, { flex: 1 }]}>{m.quantity}</Text>
                    <Text style={[styles.tableDataCell, { flex: 2, color: '#475569' }]}>{m.desc}</Text>
                  </View>
                ))}

                {/* 4. Introduction */}
                <Text style={styles.sheetSectionTitle}>4. Introduction (10 minutes)</Text>
                <Text style={styles.sheetParagraphText}>{activePlan?.introduction}</Text>

                {/* 5. Main Activities */}
                <Text style={styles.sheetSectionTitle}>5. Main Activities (25 minutes)</Text>
                {activePlan?.mainActivities.map((act, idx) => (
                  <View key={idx} style={styles.activityBox}>
                    <View style={styles.activityTitleRow}>
                      <Text style={styles.activityTitleText}>{act.title}</Text>
                      <Text style={styles.activityDurationText}>{act.duration}</Text>
                    </View>
                    <Text style={styles.sheetParagraphText}>{act.details}</Text>
                  </View>
                ))}

                {/* 6. Worksheet Activities */}
                <Text style={styles.sheetSectionTitle}>6. Worksheet Activities</Text>
                {activePlan?.worksheet.map((item, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>-</Text>
                    <Text style={styles.bulletText}>{item}</Text>
                  </View>
                ))}

                {/* 7. Assessment */}
                <Text style={styles.sheetSectionTitle}>7. Assessment Rubric</Text>
                
                {/* Rubric Headers */}
                <View style={styles.rubricHeaderRow}>
                  <Text style={[styles.rubricHeaderCell, { flex: 1.2 }]}>Criteria</Text>
                  <Text style={[styles.rubricHeaderCell, { flex: 1.5 }]}>Excellent (3)</Text>
                  <Text style={[styles.rubricHeaderCell, { flex: 1.5 }]}>Good (2)</Text>
                  <Text style={[styles.rubricHeaderCell, { flex: 1.5 }]}>Needs Improvement (1)</Text>
                </View>
                {/* Rubric Rows */}
                {activePlan?.assessment.map((r, idx) => (
                  <View key={idx} style={[styles.rubricDataRow, idx % 2 === 1 && { backgroundColor: '#F8FAFC' }]}>
                    <Text style={[styles.rubricDataCell, { flex: 1.2, fontWeight: '700', color: '#0A1F5C' }]}>{r.criteria}</Text>
                    <Text style={[styles.rubricDataCell, { flex: 1.5, color: '#059669' }]}>{r.excellent}</Text>
                    <Text style={[styles.rubricDataCell, { flex: 1.5, color: '#D97706' }]}>{r.good}</Text>
                    <Text style={[styles.rubricDataCell, { flex: 1.5, color: '#DC2626' }]}>{r.needsImp}</Text>
                  </View>
                ))}

              </View>

            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

// Pressable Backdrop helper to easily dismiss pickers
const PressableModalBackdrop = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => {
  return (
    <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
      <Pressable style={{ width: '100%' }}>
        {children}
      </Pressable>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EBF0FB',
  },

  // HEADER STYLE
  header: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 12,
  },
  backBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginTop: 2,
  },
  headerBarGlow: {
    height: 3,
  },

  scrollContainer: {
    padding: 16,
    paddingBottom: 48,
    backgroundColor: 'transparent',
  },

  // AI FEATURE PILLS
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  featurePill: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(27,50,112,0.12)',
  },
  featurePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1B3270',
    letterSpacing: 0.2,
  },

  // FORM CARD
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(27, 50, 112, 0.08)',
    shadowColor: '#1B3270',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 6,
    marginBottom: 20,
  },
  // FIELD HEADER
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },
  fieldDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#0047CC',
    marginRight: 7,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  requestTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(0, 71, 204, 0.12)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    height: 88,
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridCol: {
    flex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFBFF',
    borderWidth: 1.5,
    borderColor: 'rgba(0,71,204,0.14)',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 52,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pickerIconOrb: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  pickerButtonText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E293B',
  },

  // File Upload Box
  fileAttachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 71, 204, 0.18)',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 54,
    marginBottom: 22,
  },
  fileAttachmentBoxActive: {
    backgroundColor: '#EFF6FF',
    borderStyle: 'solid',
    borderColor: '#0047CC',
  },
  fileIconOrb: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fileAttachmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    flex: 1,
  },
  fileAttachmentTextActive: {
    color: '#0047CC',
    fontWeight: '700',
  },

  // ── GENERATE BUTTON ──
  generateBtnContainer: {
    marginTop: 6,
    borderRadius: 18,
    shadowColor: '#0D1F55',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 16,
    overflow: 'visible',
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  generateBtnHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  generateBtnIconZone: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.09)',
  },
  generateBtnDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 14,
  },
  generateBtnLabelBlock: {
    flex: 1,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '900',
    letterSpacing: 0.6,
    lineHeight: 20,
  },
  generateBtnSubText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  generateBtnArrow: {
    height: 40,
    paddingHorizontal: 13,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  // Generating State
  generatingContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,71,204,0.2)',
  },
  generatingButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0047CC',
    letterSpacing: 0.2,
  },

  // PROCESSING LOADER CARD
  loaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loaderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  loaderStatus: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
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

  // LIST HEADER
  viewPlanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 6,
  },
  bulletIndicator: {
    width: 5,
    height: 18,
    borderRadius: 3,
    marginRight: 9,
  },
  viewPlanTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    flex: 1,
  },
  planCountBadge: {
    backgroundColor: '#0047CC',
    borderRadius: 10,
    minWidth: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  planCountText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
  },

  plansListContainer: {
    gap: 12,
  },
  planItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingLeft: 0,
    paddingRight: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(27,50,112,0.1)',
    shadowColor: '#1B3270',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  planItemTopHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  planItemIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(30,64,175,0.15)',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  planItemIconInner: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planItemTextContent: {
    flex: 1,
  },
  planItemTopic: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F1F56',
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  planMetaRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  planMetaPill: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(27,50,112,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  planMetaPillBlue: {
    backgroundColor: 'rgba(27,50,112,0.08)',
    borderColor: 'rgba(27,50,112,0.18)',
  },
  planMetaPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B6CB7',
    letterSpacing: 0.2,
  },
  // Modern icon-only action button (KEPT for legacy reference)
  planItemActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B3270',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  // ── Premium Eye Button ──
  eyeBtnOuter: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(37,99,235,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37,99,235,0.06)',
    marginRight: 2,
    shadowColor: '#1B3270',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  eyeBtnCore: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  eyeBtnGloss: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  // PICKERS MODAL (Bottom Sheet Layout)
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)', // Slightly darker dim overlay
    justifyContent: 'flex-end', // Align to bottom
  },
  pickerModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 44 : 30, // Extra safe space for bottom notch/insets
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 520 : '100%', // Max width container limit on web browser
    alignSelf: 'center',
    shadowColor: '#0A1F5C',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 20,
  },
  sheetHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerModalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0A1F5C',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  pickerModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pickerModalItemActive: {
    backgroundColor: 'rgba(0, 71, 204, 0.06)',
  },
  pickerModalItemText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  pickerModalItemTextActive: {
    color: '#003d9b',
  },

  // VIEWER SCREEN LAYOUT
  viewerBackdrop: {
    flex: 1,
    backgroundColor: '#0A1F5C',
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  viewerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  viewerCloseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  viewerCloseText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0A1F5C',
    marginLeft: 4,
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#003d9b',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  printBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#003d9b',
  },

  viewerScrollContent: {
    padding: 16,
  },
  paperSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  sheetHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0A1F5C',
    textAlign: 'center',
    lineHeight: 24,
  },
  sheetMetaRow: {
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  sheetMetaText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  sheetMetaFile: {
    fontSize: 11,
    fontWeight: '600',
    color: '#003d9b',
    backgroundColor: 'rgba(0, 61, 155, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 5,
  },
  sheetDivider: {
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  sheetSectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sheetParagraphText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    lineHeight: 18.5,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 10,
  },
  bulletDot: {
    fontSize: 14,
    fontWeight: '900',
    color: '#003d9b',
    marginRight: 8,
    width: 8,
    textAlign: 'center',
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    lineHeight: 18,
  },

  // Table styling (Materials Section)
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: '900',
    color: '#1E293B',
    textTransform: 'uppercase',
  },
  tableDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  tableDataCell: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '600',
    paddingRight: 6,
  },

  activityBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#003d9b',
    marginBottom: 8,
    marginTop: 4,
  },
  activityTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  activityTitleText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0A1F5C',
    flex: 1,
    marginRight: 8,
  },
  activityDurationText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    backgroundColor: '#003d9b',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },

  // Rubric / Assessment styles
  rubricHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#94A3B8',
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  rubricHeaderCell: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0F172A',
    textTransform: 'uppercase',
    paddingRight: 4,
  },
  rubricDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  rubricDataCell: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    paddingRight: 6,
  }
});
