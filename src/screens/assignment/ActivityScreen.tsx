import React, { useState, useMemo, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
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
  Platform,
  KeyboardAvoidingView,
  Image,
  ImageBackground
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Circle, Line, G, Path, Defs, Stop, Text as SvgText, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { PremiumDateTimePicker } from '../../components/PremiumDateTimePicker';

const { width } = Dimensions.get('window');

// Dynamic theme coloring for kids matching columns
const getThemeColorConfig = (themeUrl: string) => {
  if (!themeUrl) {
    return {
      headerBg: 'rgba(30, 41, 59, 0.95)',
      bodyCardBg: 'rgba(255, 255, 255, 0.85)',
      cardBorder: '#2563EB',
      accentColor: '#2563EB',
      cardTextColor: '#0F172A',
    };
  }
  if (themeUrl.includes("photo-1500627869374")) { // Windmill Grass Meadow
    return {
      headerBg: 'rgba(78, 52, 37, 0.95)',
      bodyCardBg: 'rgba(255, 255, 255, 0.85)',
      cardBorder: '#D97706',
      accentColor: '#D97706',
      cardTextColor: '#78350F',
    };
  }
  if (themeUrl.includes("photo-150631813707")) { // Space Stars
    return {
      headerBg: 'rgba(15, 23, 42, 0.95)',
      bodyCardBg: 'rgba(30, 41, 59, 0.55)',
      cardBorder: '#3B82F6',
      accentColor: '#3B82F6',
      cardTextColor: '#1E293B',
    };
  }
  if (themeUrl.includes("photo-1544551763")) { // Under the Sea
    return {
      headerBg: 'rgba(8, 47, 73, 0.95)',
      bodyCardBg: 'rgba(255, 255, 255, 0.85)',
      cardBorder: '#06B6D4',
      accentColor: '#06B6D4',
      cardTextColor: '#0E7490',
    };
  }
  if (themeUrl.includes("photo-15344476777")) { // Dinosaur Jungle
    return {
      headerBg: 'rgba(20, 83, 45, 0.95)',
      bodyCardBg: 'rgba(255, 255, 255, 0.85)',
      cardBorder: '#10B981',
      accentColor: '#10B981',
      cardTextColor: '#064E3B',
    };
  }
  if (themeUrl.includes("photo-151815667718")) { // Princess Fairy Castle
    return {
      headerBg: 'rgba(124, 58, 237, 0.95)',
      bodyCardBg: 'rgba(255, 255, 255, 0.85)',
      cardBorder: '#8B5CF6',
      accentColor: '#8B5CF6',
      cardTextColor: '#4C1D95',
    };
  }
  // Default Chalkboard Board
  return {
    headerBg: 'rgba(78, 52, 37, 0.95)',
    bodyCardBg: 'rgba(255, 255, 255, 0.85)',
    cardBorder: '#2563EB',
    accentColor: '#2563EB',
    cardTextColor: '#0F172A',
  };
};

// Real desktop dashboard data
const INITIAL_ASSIGNMENTS = [
  {
    sNo: '2479',
    title: 'Fill in the blanks',
    class: 'GRADE-II A',
    course: 'Computer',
    chapter: 'Abcd',
    topic: 'Xyz',
    teacher: 'suman',
    startDateTime: '13 May 2026, 6:48 AM',
    deadline: '14 May 2026, 11:00 AM',
    type: 'blanks'
  },
  {
    sNo: '2487',
    title: 'True and false',
    class: 'GRADE-II A',
    course: 'Computer',
    chapter: 'Abcd',
    topic: 'Xyz',
    teacher: 'suman',
    startDateTime: '13 May 2026, 6:56 AM',
    deadline: '14 May 2026, 8:55 AM',
    type: 'truefalse'
  },
  {
    sNo: '2607',
    title: 'Match the Column',
    class: 'GRADE-V A',
    course: 'English',
    chapter: 'Chapter # 1',
    topic: 'Slo # 1.1 & 1.3',
    teacher: 'suman',
    startDateTime: '14 May 2026, 4:50 AM',
    deadline: '15 May 2026, 12:00 PM',
    type: 'match'
  },
  {
    sNo: '4642',
    title: 'Vocabulary Crossword Puzzle',
    class: 'GRADE-V A',
    course: 'English',
    chapter: 'Chapter # 2',
    topic: 'Word Search & Clues',
    teacher: 'suman',
    startDateTime: '20 Jul 2026, 10:09 AM',
    deadline: '21 Jul 2026, 1:13 PM',
    type: 'crosswords'
  },
  {
    sNo: '4643',
    title: 'Mystery Detective Clue Challenge',
    class: 'GRADE-II A',
    course: 'English',
    chapter: 'Chapter 1s',
    topic: 'Rules and Responsibilities',
    teacher: 'suman',
    startDateTime: '21 Jul 2026, 10:53 AM',
    deadline: '22 Jul 2026, 1:52 PM',
    type: 'cluegames'
  },
  {
    sNo: '4644',
    title: 'Match Opposites & Synonyms',
    class: 'GRADE-II A',
    course: 'English',
    chapter: 'Chapter 1s',
    topic: 'Rules and Responsibilities',
    teacher: 'suman',
    startDateTime: '21 Jul 2026, 10:55 AM',
    deadline: '22 Jul 2026, 1:54 PM',
    type: 'match'
  },
  {
    sNo: '4645',
    title: 'Label Diagram Parts',
    class: 'GRADE-II A',
    course: 'English',
    chapter: 'Chapter 1s',
    topic: 'Rules and Responsibilities',
    teacher: 'suman',
    startDateTime: '21 Jul 2026, 10:57 AM',
    deadline: '22 Jul 2026, 1:58 PM',
    type: 'parts',
    partsImage: 'FACE',
    partsPinpoints: [
      { id: 'p1', x: 50, y: 24, name: 'hair' },
      { id: 'p2', x: 41, y: 48, name: 'eyes' },
      { id: 'p3', x: 50, y: 56, name: 'nose' },
      { id: 'p4', x: 50, y: 68, name: 'lips' }
    ]
  },
  {
    sNo: '4646',
    title: 'Fill Grammatical Blanks',
    class: 'GRADE-V A',
    course: 'English',
    chapter: 'my self',
    topic: 'myself',
    teacher: 'suman',
    startDateTime: '21 Jul 2026, 12:18 PM',
    deadline: '24 Jul 2026, 2:38 PM',
    type: 'blanks'
  },
  {
    sNo: '4647',
    title: 'True And False Statements',
    class: 'GRADE-II A',
    course: 'English',
    chapter: '—',
    topic: '—',
    teacher: 'suman',
    startDateTime: '21 Jul 2026, 12:18 PM',
    deadline: '05 Aug 2026, 5:00 PM',
    type: 'truefalse'
  },
  {
    sNo: '4958',
    title: 'Label The Plant Cell Parts',
    class: 'GRADE-II A',
    course: 'Science',
    chapter: '—',
    topic: '—',
    teacher: 'suman',
    startDateTime: '21 Jul 2026, 12:35 PM',
    deadline: '24 Jul 2026, 5:00 PM',
    type: 'parts',
    partsImage: 'PLANT',
    partsPinpoints: [
      { id: 'pc1', x: 31, y: 45, name: 'Nucleus' },
      { id: 'pc2', x: 52, y: 48, name: 'Vacuole' },
      { id: 'pc3', x: 69, y: 28, name: 'Mitochondria' }
    ]
  }
];

const EN_TO_UR_MAP: Record<string, string> = {
  'A': 'ا',
  'B': 'ب',
  'C': 'چ',
  'D': 'د',
  'E': 'ع',
  'F': 'ف',
  'G': 'گ',
  'H': 'ہ',
  'I': 'ی',
  'J': 'ج',
  'K': 'ک',
  'L': 'ل',
  'M': 'م',
  'N': 'ن',
  'O': 'و',
  'P': 'پ',
  'Q': 'ق',
  'R': 'ر',
  'S': 'س',
  'T': 'ت',
  'U': 'و',
  'V': 'و',
  'W': 'و',
  'X': 'خ',
  'Y': 'ی',
  'Z': 'ز',
};

const generateCrosswordGrid = (clues: { word: string; clue: string }[]) => {
  const grid = Array(9).fill(null).map(() => Array(9).fill(null));
  const cellCoords: { row: number; col: number; char: string; wordIndex: number; charIndex: number }[] = [];
  if (clues.length === 0) return { grid, cellCoords };

  const inBounds = (r: number, c: number) => r >= 0 && r < 9 && c >= 0 && c < 9;
  const placements: { wordIndex: number; row: number; col: number; dir: 'H' | 'V' }[] = [];

  // 1. Place the first word horizontally in the center
  const firstWord = clues[0].word.toUpperCase();
  const firstRow = 4;
  const firstCol = Math.max(0, Math.floor((9 - firstWord.length) / 2));
  
  for (let k = 0; k < firstWord.length; k++) {
    const r = firstRow;
    const c = firstCol + k;
    if (inBounds(r, c)) {
      grid[r][c] = { char: firstWord[k], wordIndex: 0, charIndex: k };
      cellCoords.push({ row: r, col: c, char: firstWord[k], wordIndex: 0, charIndex: k });
    }
  }
  placements.push({ wordIndex: 0, row: firstRow, col: firstCol, dir: 'H' });

  // 2. Place subsequent words dynamically
  for (let wIdx = 1; wIdx < clues.length; wIdx++) {
    const word = clues[wIdx].word.toUpperCase();
    let placed = false;

    // Try placing via intersection
    for (let r = 0; r < 9 && !placed; r++) {
      for (let c = 0; c < 9 && !placed; c++) {
        if (grid[r][c] !== null) {
          const gridChar = grid[r][c].char;
          const matchIndex = word.indexOf(gridChar);
          
          if (matchIndex !== -1) {
            const parentCell = grid[r][c];
            const parentPlacement = placements.find(p => p.wordIndex === parentCell.wordIndex);
            if (!parentPlacement) continue;

            const targetDir = parentPlacement.dir === 'H' ? 'V' : 'H';
            const startRow = targetDir === 'V' ? r - matchIndex : r;
            const startCol = targetDir === 'H' ? c - matchIndex : c;

            let isValid = true;
            for (let k = 0; k < word.length; k++) {
              const currRow = targetDir === 'V' ? startRow + k : startRow;
              const currCol = targetDir === 'H' ? startCol + k : startCol;

              if (!inBounds(currRow, currCol)) {
                isValid = false;
                break;
              }

              const existing = grid[currRow][currCol];
              if (existing !== null && existing.char !== word[k]) {
                isValid = false;
                break;
              }
            }

            if (isValid) {
              for (let k = 0; k < word.length; k++) {
                const currRow = targetDir === 'V' ? startRow + k : startRow;
                const currCol = targetDir === 'H' ? startCol + k : startCol;
                grid[currRow][currCol] = { char: word[k], wordIndex: wIdx, charIndex: k };
                if (!cellCoords.some(coord => coord.row === currRow && coord.col === currCol)) {
                  cellCoords.push({ row: currRow, col: currCol, char: word[k], wordIndex: wIdx, charIndex: k });
                }
              }
              placements.push({ wordIndex: wIdx, row: startRow, col: startCol, dir: targetDir });
              placed = true;
            }
          }
        }
      }
    }

    // Fallback: place horizontally in free rows
    if (!placed) {
      for (let r = 0; r < 9 && !placed; r++) {
        for (let c = 0; c <= 9 - word.length && !placed; c++) {
          let canPlace = true;
          for (let k = 0; k < word.length; k++) {
            if (grid[r][c + k] !== null) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let k = 0; k < word.length; k++) {
              grid[r][c + k] = { char: word[k], wordIndex: wIdx, charIndex: k };
              cellCoords.push({ row: r, col: c + k, char: word[k], wordIndex: wIdx, charIndex: k });
            }
            placements.push({ wordIndex: wIdx, row: r, col: c, dir: 'H' });
            placed = true;
          }
        }
      }
    }

    // Fallback: place vertically in free columns
    if (!placed) {
      for (let c = 0; c < 9 && !placed; c++) {
        for (let r = 0; r <= 9 - word.length && !placed; r++) {
          let canPlace = true;
          for (let k = 0; k < word.length; k++) {
            if (grid[r + k][c] !== null) {
              canPlace = false;
              break;
            }
          }
          if (canPlace) {
            for (let k = 0; k < word.length; k++) {
              grid[r + k][c] = { char: word[k], wordIndex: wIdx, charIndex: k };
              cellCoords.push({ row: r + k, col: c, char: word[k], wordIndex: wIdx, charIndex: k });
            }
            placements.push({ wordIndex: wIdx, row: r, col: c, dir: 'V' });
            placed = true;
          }
        }
      }
    }
  }

  return { grid, cellCoords };
};

export const ActivityScreen = ({ navigation, route }: any) => {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Form states for creating new assignment
  const [formTitle, setFormTitle] = useState('');
  const [formClass, setFormClass] = useState('');
  const [formSection, setFormSection] = useState('');
  const [formCourse, setFormCourse] = useState('');
  const [formChapter, setFormChapter] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formType, setFormType] = useState('blanks');
  const [formStart, setFormStart] = useState('13 May 2026, 09:00 AM');
  const [formDeadline, setFormDeadline] = useState('14 May 2026, 05:00 PM');

  // Crossword & Clue Game States
  const [crosswordClues, setCrosswordClues] = useState<{ id: string; word: string; type: string; clue: string }[]>([]);
  const crosswordGridData = useMemo(() => {
    return generateCrosswordGrid(crosswordClues);
  }, [crosswordClues]);
  const [clueWord, setClueWord] = useState('');
  const [clueType, setClueType] = useState('Text');
  const [clueText, setClueText] = useState('');
  const [crosswordPreviewActive, setCrosswordPreviewActive] = useState(false);
  const [crosswordSplashActive, setCrosswordSplashActive] = useState(true);
  const [crosswordLanguage, setCrosswordLanguage] = useState<'EN' | 'UR'>('EN');
  const [crosswordAnswers, setCrosswordAnswers] = useState<Record<string, string>>({}); // key: 'r,c', value: user input char
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Sound player helper
  const playSound = async (type: 'click' | 'add' | 'win' | 'error') => {
    if (isSoundMuted) return;
    try {
      const urls = {
        click: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
        add: 'https://www.soundjay.com/buttons/sounds/button-3.mp3',
        win: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-84.wav',
        error: 'https://www.soundjay.com/misc/sounds/fail-buzzer-01.mp3'
      };
      const { sound } = await Audio.Sound.createAsync({ uri: urls[type] });
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {
      console.log('Error playing sound:', e);
    }
  };

  // Date picker states
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'deadline' | null>(null);
  const [datePickerValue, setDatePickerValue] = useState('');
  const [datePickerTitle, setDatePickerTitle] = useState('');

  // Custom step states
  const [createStep, setCreateStep] = useState<'details' | 'blanks' | 'match' | 'crossword' | 'theme' | 'generate' | 'partsCreator' | 'partsLayout' | 'partsTheme' | 'truefalse'>('details');
  const [blanksText, setBlanksText] = useState('');
  const [isSelectingBlanks, setIsSelectingBlanks] = useState(false);

  // True/False Creator States
  const [tfQuestions, setTfQuestions] = useState<{ id: string; question: string; answer: 'true' | 'false' }[]>([]);
  const [tfQuestionInput, setTfQuestionInput] = useState('');
  const [tfAnswerInput, setTfAnswerInput] = useState<'true' | 'false'>('true');

  // True/False Student Player States
  const [activeTfPlayer, setActiveTfPlayer] = useState<any>(null);
  const [tfCurrentIndex, setTfCurrentIndex] = useState<number>(0);
  const [tfUserAnswers, setTfUserAnswers] = useState<Record<number, 'true' | 'false'>>({});
  const [tfQuizStage, setTfQuizStage] = useState<'welcome' | 'playing' | 'completed'>('welcome');
  const [tfScore, setTfScore] = useState<number>(0);
  const [showTfSuccessUpload, setShowTfSuccessUpload] = useState<boolean>(false);
  // Blanks state
  const skipBlankReset = useRef(false);
  const [selectedBlankIndices, setSelectedBlankIndices] = useState<number[]>([]);

  // Label the Parts (Diagram) States
  const [partsImage, setPartsImage] = useState<string>('');
  const [partsImageName, setPartsImageName] = useState<string>('NO FILE CHOSEN');
  const [partsPinpoints, setPartsPinpoints] = useState<Array<{ id: string; x: number; y: number; name: string }>>([]);
  const [partsLayoutMethod, setPartsLayoutMethod] = useState<'drag' | 'match' | 'dropdown'>('drag');
  const [showPinpointDialog, setShowPinpointDialog] = useState(false);
  const [tempPinpointCoord, setTempPinpointCoord] = useState<{ x: number; y: number } | null>(null);
  const [pinpointNameInput, setPinpointNameInput] = useState('');
  const [isGeneratingParts, setIsGeneratingParts] = useState(false);
  const [showImageSelectModal, setShowImageSelectModal] = useState(false);
  const [canvasLayout, setCanvasLayout] = useState<{ width: number; height: number }>({ width: 400, height: 320 });
  const [partsImageAspect, setPartsImageAspect] = useState<number>(1.25); // Default 400x320 SVG aspect ratio

  // Measure natural image aspect ratio whenever partsImage changes
  useEffect(() => {
    if (!partsImage) {
      setPartsImageAspect(1.25);
      return;
    }
    const norm = partsImage.trim().toUpperCase();
    if (norm === 'FACE' || norm === 'SKELETON' || norm === 'PLANT' || norm === 'PRESET_FACE') {
      setPartsImageAspect(1.25); // 400 / 320 = 1.25
      return;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).Image) {
      const img = new (window as any).Image();
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight && img.naturalHeight > 0) {
          setPartsImageAspect(img.naturalWidth / img.naturalHeight);
        }
      };
      img.onerror = () => {
        setPartsImageAspect(1.25);
      };
      img.src = partsImage;
    } else {
      Image.getSize(
        partsImage,
        (w, h) => {
          if (w && h && h > 0) {
            setPartsImageAspect(w / h);
          }
        },
        () => {
          setPartsImageAspect(1.25);
        }
      );
    }
  }, [partsImage]);

  // Helper to compute actual visible image rectangle inside container using resizeMode="contain" letterboxing
  const getImageDisplayRect = (containerWidth: number, containerHeight: number, imageAspect: number) => {
    const cWidth = containerWidth || 400;
    const cHeight = containerHeight || 300;
    const imgAspect = imageAspect || 1.25;
    const cAspect = cWidth / cHeight;
    let dispW = cWidth;
    let dispH = cHeight;
    let dispL = 0;
    let dispT = 0;

    if (imgAspect > cAspect) {
      dispW = cWidth;
      dispH = cWidth / imgAspect;
      dispL = 0;
      dispT = (cHeight - dispH) / 2;
    } else {
      dispH = cHeight;
      dispW = cHeight * imgAspect;
      dispT = 0;
      dispL = (cWidth - dispW) / 2;
    }
    return { dispL, dispT, dispW, dispH };
  };

  // Player States
  const [activePartsPlayer, setActivePartsPlayer] = useState<any>(null);
  const [playerCanvasLayout, setPlayerCanvasLayout] = useState<{ width: number; height: number }>({ width: 400, height: 300 });
  const [partsAnswers, setPartsAnswers] = useState<Record<string, string>>({}); // pinpointId -> guessedLabel
  const [partsSelectedLabel, setPartsSelectedLabel] = useState<string | null>(null);
  const [partsDropdownActiveId, setPartsDropdownActiveId] = useState<string | null>(null);
  const [partsWrongAlert, setPartsWrongAlert] = useState<boolean>(false);
  const [showPartsSuccessUpload, setShowPartsSuccessUpload] = useState<boolean>(false);

  // Match the Following state
  const [matchPairs, setMatchPairs] = useState<{ id: string; left: string; right: string }[]>([]);
  const [columnLeftText, setColumnLeftText] = useState('');
  const [columnRightText, setColumnRightText] = useState('');

  // Match gameplay states
  const [activeMatchPlayer, setActiveMatchPlayer] = useState<any>(null);
  const [matchLeftSelected, setMatchLeftSelected] = useState<number | null>(null);
  const [matchAnswers, setMatchAnswers] = useState<Record<number, number>>({});
  const [shuffledRightItems, setShuffledRightItems] = useState<{ originalIndex: number; text: string }[]>([]);
  const [leftColLayout, setLeftColLayout] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [rightColLayout, setRightColLayout] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [cardLayouts, setCardLayouts] = useState<Record<string, { y: number; h: number }>>({});
  const [showMatchSuccessUpload, setShowMatchSuccessUpload] = useState<boolean>(false);

  // Premium themes list presets with child-friendly illustrations
  const [themesList, setThemesList] = useState<string[]>([
    'https://images.unsplash.com/photo-1500627869374-13cd993b1115?w=800&auto=format&fit=crop&q=80', // Windmill Grass Meadow
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=80', // Space Stars Galaxy
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80', // Ocean fishes
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80', // Dinosaur Forest
    'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&auto=format&fit=crop&q=80', // Princess Fairy Castle
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80', // Classroom Chalkboard
  ]);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);
  const [customThemeUrl, setCustomThemeUrl] = useState('');

  // Interactive Blanks Player states
  const [activeBlanksPlayer, setActiveBlanksPlayer] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [playerFontSize, setPlayerFontSize] = useState<number>(16);
  const [playerFontFamily, setPlayerFontFamily] = useState<string>('System');
  const [isPlayerSubmitted, setIsPlayerSubmitted] = useState<boolean>(false);
  const [playerScore, setPlayerScore] = useState<string>('0/0');
  const [showSuccessUpload, setShowSuccessUpload] = useState<boolean>(false);

  useEffect(() => {
    if (skipBlankReset.current) {
      skipBlankReset.current = false;
      return;
    }
    setSelectedBlankIndices([]);
  }, [blanksText]);

  // Clear diagram parts wrong answer overlay toast after a delay
  useEffect(() => {
    if (partsWrongAlert) {
      const timer = setTimeout(() => {
        setPartsWrongAlert(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [partsWrongAlert]);

  // Shuffle label list when activePartsPlayer changes
  const [shuffledPartsLabels, setShuffledPartsLabels] = useState<string[]>([]);
  useEffect(() => {
    if (activePartsPlayer && activePartsPlayer.partsPinpoints) {
      const labels = activePartsPlayer.partsPinpoints.map((p: any) => p.name);
      // Shuffle labels
      const shuffled = [...labels];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledPartsLabels(shuffled);
    } else {
      setShuffledPartsLabels([]);
    }
  }, [activePartsPlayer]);

  // Handle custom theme add
  const handleAddCustomTheme = () => {
    if (!customThemeUrl.trim()) {
      Alert.alert('Invalid Link', 'Please enter a valid image URL.');
      return;
    }
    if (!customThemeUrl.startsWith('http://') && !customThemeUrl.startsWith('https://')) {
      Alert.alert('Invalid Link', 'URL must start with http:// or https://');
      return;
    }
    setThemesList(prev => [...prev, customThemeUrl.trim()]);
    setSelectedThemeIndex(themesList.length);
    setCustomThemeUrl('');
  };

  // Step navigation helpers
  const handleStepPrev = () => {
    if (createStep === 'blanks' || createStep === 'match' || createStep === 'crossword' || createStep === 'partsCreator' || createStep === 'truefalse') {
      setCreateStep('details');
    } else if (createStep === 'partsTheme') {
      setCreateStep('partsCreator');
    } else if (createStep === 'theme') {
      if (formType === 'blanks') {
        setCreateStep('blanks');
      } else if (formType === 'match') {
        setCreateStep('match');
      } else if (formType === 'crosswords' || formType === 'cluegames') {
        setCreateStep('crossword');
      } else if (formType === 'truefalse') {
        setCreateStep('truefalse');
      }
    } else if (createStep === 'generate') {
      if (formType === 'parts') {
        setCreateStep('partsTheme');
      } else {
        setCreateStep('theme');
      }
    }
  };

  const handleStepNext = () => {
    if (createStep === 'blanks') {
      if (!blanksText.trim()) {
        Alert.alert('Empty Content', 'Please enter some text first.');
        return;
      }
      setCreateStep('theme');
    } else if (createStep === 'match') {
      if (matchPairs.length === 0) {
        Alert.alert('Empty Matches', 'Please add at least one match pair.');
        return;
      }
      setCreateStep('theme');
    } else if (createStep === 'crossword') {
      if (crosswordClues.length < 2) {
        Alert.alert('Clues Required', 'Please add at least two clues first.');
        return;
      }
      setCreateStep('theme');
    } else if (createStep === 'truefalse') {
      if (tfQuestions.length === 0) {
        Alert.alert('Questions Required', 'Please add at least one True/False question.');
        return;
      }
      handleCreateAssignment();
    } else if (createStep === 'partsCreator') {
      if (!partsImage) {
        Alert.alert('Image Required', 'Please choose a diagram image first.');
        return;
      }
      if (partsPinpoints.length === 0) {
        Alert.alert('Pinpoints Required', 'Please click on the image to add at least one label pinpoint.');
        return;
      }
      setCreateStep('partsTheme');
    } else if (createStep === 'partsTheme') {
      setIsGeneratingParts(true);
      setTimeout(() => {
        setIsGeneratingParts(false);
        handleCreateAssignment();
      }, 1600);
    } else if (createStep === 'theme') {
      setCreateStep('generate');
    } else if (createStep === 'generate') {
      handleCreateAssignment();
    }
  };

  const handleAddMatchPair = () => {
    if (!columnLeftText.trim() || !columnRightText.trim()) {
      Alert.alert('Missing Value', 'Please fill both Left and Right columns.');
      return;
    }
    const newPair = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      left: columnLeftText.trim(),
      right: columnRightText.trim(),
    };
    setMatchPairs([...matchPairs, newPair]);
    setColumnLeftText('');
    setColumnRightText('');
  };

  const handleRemoveMatchPair = (id: string) => {
    setMatchPairs(matchPairs.filter(p => p.id !== id));
  };

  const handleAddCrosswordClue = () => {
    if (!clueWord.trim() || !clueText.trim()) {
      Alert.alert('Missing Info', 'Please fill both Word and Clue fields.');
      return;
    }
    const cleanWord = clueWord.trim().toUpperCase().replace(/[^A-Z]/g, '');
    if (cleanWord.length === 0) {
      Alert.alert('Invalid Word', 'Word must contain only English letters.');
      return;
    }
    if (cleanWord.length > 10) {
      Alert.alert('Word Too Long', 'Word must be 10 letters or less.');
      return;
    }
    const newClue = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      word: cleanWord,
      type: clueType,
      clue: clueText.trim(),
    };
    setCrosswordClues([...crosswordClues, newClue]);
    playSound('add');
    setClueWord('');
    setClueText('');
  };

  const handleRemoveCrosswordClue = (id: string) => {
    setCrosswordClues(crosswordClues.filter(c => c.id !== id));
    playSound('click');
  };

  const handleAddTfQuestion = () => {
    if (!tfQuestionInput.trim()) {
      Alert.alert('Question Required', 'Please enter a question statement.');
      return;
    }
    const newQ = {
      id: `tf-${Date.now()}`,
      question: tfQuestionInput.trim(),
      answer: tfAnswerInput,
    };
    setTfQuestions(prev => [...prev, newQ]);
    playSound('add');
    setTfQuestionInput('');
    setTfAnswerInput('true');
  };

  const handleRemoveTfQuestion = (id: string) => {
    setTfQuestions(prev => prev.filter(q => q.id !== id));
    playSound('click');
  };

  // Callback listener for AI toolkit return injection
  useEffect(() => {
    if (route?.params?.generatedText) {
      skipBlankReset.current = true;
      setBlanksText(route.params.generatedText);
      setFormType('blanks');
      setCreateStep('blanks');
      setIsCreateVisible(true);
      
      if (route?.params?.blankIndices) {
        setSelectedBlankIndices(route.params.blankIndices);
      } else {
        setSelectedBlankIndices([]);
      }
      
      // Clear route parameters so it doesn't trigger repeatedly
      navigation.setParams({ generatedText: undefined, blankIndices: undefined });
    }
  }, [route?.params?.generatedText, route?.params?.blankIndices]);

  // Dropdown options
  const classesList = ['GRADE-I', 'GRADE-II', 'GRADE-III', 'GRADE-IV', 'GRADE-V', 'GRADE-VI', 'GRADE-VII', 'GRADE-VIII', 'GRADE-IX', 'GRADE-X'];
  const sectionsList = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E'];
  const coursesList = ['Computer', 'English', 'Mathematics', 'Science', 'Social Studies', 'Urdu', 'Islamiat'];
  const typesList = ['blanks', 'match', 'crosswords', 'parts', 'truefalse', 'cluegames'];

  // Inline Selector menus
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // Filter types based on official 6 assignment formats
  const filterTypes = ['All', 'blanks', 'match', 'crosswords', 'parts', 'truefalse', 'cluegames'];

  const getTypeLabel = (type: string) => {
    if (type === 'blanks') return 'Fill In the Blanks';
    if (type === 'match') return 'Match the following';
    if (type === 'crosswords') return 'Cross Words';
    if (type === 'parts') return 'Label The Parts';
    if (type === 'truefalse') return 'True/False';
    if (type === 'cluegames') return 'Clue Games';
    return type;
  };

  const getCardBgColors = (type: string) => {
    if (type === 'blanks') return ['#ffffff', '#F0FDFA', '#D1FAE5'];
    if (type === 'match') return ['#ffffff', '#F5F3FF', '#E0E7FF'];
    if (type === 'crosswords') return ['#ffffff', '#F0F9FF', '#E0F2FE'];
    if (type === 'parts') return ['#ffffff', '#FFF1F2', '#FFE4E6'];
    if (type === 'truefalse') return ['#ffffff', '#FFFBEB', '#FEF3C7'];
    if (type === 'cluegames') return ['#ffffff', '#ECFDF5', '#D1FAE5'];
    return ['#ffffff', '#F8FAFC', '#E2E8F0'];
  };

  const getAccentColor = (type: string) => {
    if (type === 'blanks') return '#0B8A7D';
    if (type === 'match') return '#3B4FD8';
    if (type === 'crosswords') return '#0284C7';
    if (type === 'parts') return '#B0284F';
    if (type === 'truefalse') return '#B45309';
    if (type === 'cluegames') return '#059669';
    return '#003d9b';
  };

  const renderTypeWatermark = (type: string) => {
    const size = 95;
    const themeColor = getAccentColor(type);
    
    if (type === 'blanks') {
      return (
        <Svg width={size} height={size} style={styles.cardWatermark}>
          <G transform="rotate(-8, 47, 47)">
            <Rect x={18} y={18} width={58} height={58} rx={6} stroke={themeColor} strokeWidth={1.2} fill="none" opacity={0.25} />
            <Line x1={28} y1={30} x2={58} y2={30} stroke={themeColor} strokeWidth={1.2} opacity={0.16} />
            <Line x1={28} y1={42} x2={40} y2={42} stroke={themeColor} strokeWidth={1.2} opacity={0.16} />
            <Line x1={44} y1={42} x2={66} y2={42} stroke={themeColor} strokeWidth={1.2} strokeDasharray="2,2" opacity={0.3} />
            <Line x1={28} y1={54} x2={66} y2={54} stroke={themeColor} strokeWidth={1.2} opacity={0.16} />
          </G>
        </Svg>
      );
    }
    if (type === 'match') {
      return (
        <Svg width={size} height={size} style={styles.cardWatermark}>
          <G transform="rotate(10, 47, 47)">
            <Circle cx={30} cy={30} r={2.5} fill={themeColor} opacity={0.25} />
            <Circle cx={30} cy={47} r={2.5} fill={themeColor} opacity={0.25} />
            <Circle cx={30} cy={64} r={2.5} fill={themeColor} opacity={0.25} />
            <Circle cx={64} cy={30} r={2.5} fill={themeColor} opacity={0.25} />
            <Circle cx={64} cy={47} r={2.5} fill={themeColor} opacity={0.25} />
            <Circle cx={64} cy={64} r={2.5} fill={themeColor} opacity={0.25} />
            <Line x1={34} y1={30} x2={60} y2={47} stroke={themeColor} strokeWidth={1.2} strokeDasharray="2,2" opacity={0.25} />
            <Line x1={34} y1={47} x2={60} y2={64} stroke={themeColor} strokeWidth={1.2} strokeDasharray="2,2" opacity={0.25} />
            <Line x1={34} y1={64} x2={60} y2={30} stroke={themeColor} strokeWidth={1.2} strokeDasharray="2,2" opacity={0.25} />
          </G>
        </Svg>
      );
    }
    if (type === 'crosswords') {
      return (
        <Svg width={size} height={size} style={styles.cardWatermark}>
          <G transform="rotate(-6, 47, 47)">
            <Rect x={22} y={22} width={50} height={50} stroke={themeColor} strokeWidth={1.2} fill="none" opacity={0.22} />
            <Line x1={38.6} y1={22} x2={38.6} y2={72} stroke={themeColor} strokeWidth={1.2} opacity={0.2} />
            <Line x1={55.3} y1={22} x2={55.3} y2={72} stroke={themeColor} strokeWidth={1.2} opacity={0.2} />
            <Line x1={22} y1={38.6} x2={72} y2={38.6} stroke={themeColor} strokeWidth={1.2} opacity={0.2} />
            <Line x1={22} y1={55.3} x2={72} y2={55.3} stroke={themeColor} strokeWidth={1.2} opacity={0.2} />
          </G>
        </Svg>
      );
    }
    if (type === 'cluegames') {
      return (
        <Svg width={size} height={size} style={styles.cardWatermark}>
          <G transform="rotate(12, 47, 47)">
            <Circle cx={42} cy={42} r={20} stroke={themeColor} strokeWidth={1.5} fill="none" opacity={0.25} />
            <Line x1={56} y1={56} x2={72} y2={72} stroke={themeColor} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
          </G>
        </Svg>
      );
    }
    if (type === 'truefalse') {
      return (
        <Svg width={size} height={size} style={styles.cardWatermark}>
          <G transform="rotate(6, 47, 47)">
            <Circle cx={47} cy={47} r={28} stroke={themeColor} strokeWidth={1.2} fill="none" opacity={0.22} />
            <Path d="M 36 48 L 43 55 L 58 36" stroke="#10B981" strokeWidth={2.2} fill="none" opacity={0.4} />
          </G>
        </Svg>
      );
    }
    // parts / other formats
    return (
      <Svg width={size} height={size} style={styles.cardWatermark}>
        <G transform="rotate(-15, 47, 47)">
          <Circle cx={47} cy={47} r={28} stroke={themeColor} strokeWidth={1.2} fill="none" opacity={0.2} />
          <Circle cx={47} cy={47} r={16} stroke={themeColor} strokeWidth={1.2} fill="none" opacity={0.14} />
          <Line x1={47} y1={21} x2={47} y2={73} stroke={themeColor} strokeWidth={1} opacity={0.2} />
          <Line x1={21} y1={47} x2={73} y2={47} stroke={themeColor} strokeWidth={1} opacity={0.2} />
        </G>
      </Svg>
    );
  };

  // Calculate dynamic stats
  const stats = useMemo(() => {
    const total = assignments.length;
    const blanksCount = assignments.filter(a => a.type === 'blanks').length;
    const tfCount = assignments.filter(a => a.type === 'truefalse').length;
    return { total, blanksCount, tfCount };
  }, [assignments]);

  // Filtered list
  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const matchesType = selectedType === 'All' || item.type === selectedType;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        item.class.toLowerCase().includes(query) ||
        item.course.toLowerCase().includes(query) ||
        item.chapter.toLowerCase().includes(query) ||
        item.topic.toLowerCase().includes(query) ||
        getTypeLabel(item.type).toLowerCase().includes(query);
      return matchesType && matchesSearch;
    });
  }, [assignments, selectedType, searchQuery]);

  const initializeCrosswordHints = (clues: any[], gridData: any) => {
    const hints: { [key: string]: string } = {};
    if (!gridData || !gridData.cellCoords) return hints;
    
    // 1. Fair distribution: Each word receives at most 1 hint (or max 2 for words >= 6 chars)
    clues.forEach((clueObj, idx) => {
      const wordCells = gridData.cellCoords.filter((c: any) => c.wordIndex === idx);
      if (wordCells.length === 0) return;
      
      wordCells.sort((a: any, b: any) => a.charIndex - b.charIndex);
      
      const wordLength = wordCells.length;
      const maxAllowedHints = wordLength >= 6 ? 2 : 1;
      
      let added = 0;
      for (const cell of wordCells) {
        if (added >= maxAllowedHints) break;
        const key = `${cell.row},${cell.col}`;
        
        // Prefer first letter (charIndex === 0)
        if (cell.charIndex === 0 || added === 0) {
          hints[key] = cell.char;
          added++;
        }
      }
    });

    // 2. Validation Pass: Ensure NO word is fully revealed or over-hinted
    clues.forEach((clueObj, idx) => {
      const wordCells = gridData.cellCoords.filter((c: any) => c.wordIndex === idx);
      const totalLen = wordCells.length;
      if (totalLen === 0) return;

      const revealedCells = wordCells.filter((c: any) => !!hints[`${c.row},${c.col}`]);
      
      // Every word MUST have at least 2 empty unrevealed cells (or at least 1 empty for 2-letter words)
      const maxAllowedRevealed = Math.max(1, totalLen - 2);
      
      if (revealedCells.length > maxAllowedRevealed) {
        const excessCount = revealedCells.length - maxAllowedRevealed;
        const toPrune = revealedCells
          .filter((c: any) => c.charIndex !== 0) // Preserve first letter hint if possible
          .slice(-excessCount);
        
        toPrune.forEach((c: any) => {
          delete hints[`${c.row},${c.col}`];
        });
      }
    });

    return hints;
  };

  const handleCreateCrosswordAssignment = () => {
    if (!formTitle.trim()) {
      Alert.alert('Required Info', 'Please enter an assignment title');
      return false;
    }
    if (crosswordClues.length < 2) {
      Alert.alert('Clues Needed', 'Please add at least 2 clues before previewing/assigning.');
      return false;
    }
    const newAssignment = {
      sNo: Math.floor(1000 + Math.random() * 9000).toString(),
      title: formTitle,
      class: formClass,
      section: formSection,
      course: formCourse,
      chapter: formChapter.trim() || '—',
      topic: formTopic.trim() || '—',
      teacher: 'suman',
      startDateTime: formStart,
      deadline: formDeadline,
      type: formType,
      content: '',
      themeUrl: themesList[selectedThemeIndex] || '',
      matchPairs: [],
      crosswordClues: crosswordClues,
      crosswordGridData: crosswordGridData,
    };
    setAssignments([newAssignment, ...assignments]);
    
    // Reset Form fields
    setFormTitle('');
    setFormChapter('');
    setFormTopic('');
    setSelectedThemeIndex(0);
    setCustomThemeUrl('');
    Alert.alert('Success', 'Crossword assignment posted successfully!');
    return true;
  };

  const handleCanvasClick = (e: any) => {
    const nativeEvent = e.nativeEvent || {};
    let containerX: number | undefined;
    let containerY: number | undefined;

    // 1. Primary resolution: Use getBoundingClientRect on Web (Chrome/Firefox/Edge/Safari)
    // currentTarget is the container element itself, ensuring 100% accurate rect.left/rect.top subtraction
    if (e.currentTarget && typeof e.currentTarget.getBoundingClientRect === 'function') {
      const rect = e.currentTarget.getBoundingClientRect();
      const touchObj = nativeEvent.touches?.[0] || nativeEvent.changedTouches?.[0] || nativeEvent.targetTouches?.[0];
      const clientX = nativeEvent.clientX ?? touchObj?.clientX;
      const clientY = nativeEvent.clientY ?? touchObj?.clientY;
      if (clientX !== undefined && clientY !== undefined) {
        containerX = clientX - rect.left;
        containerY = clientY - rect.top;
      }
    }

    // 2. Secondary resolution: Native mobile locationX/locationY or pageX/pageY
    if (containerX === undefined || containerY === undefined || isNaN(containerX) || isNaN(containerY)) {
      containerX = nativeEvent.locationX ?? nativeEvent.pageX;
      containerY = nativeEvent.locationY ?? nativeEvent.pageY;
    }

    const validX = (containerX !== undefined && !isNaN(containerX)) ? containerX : (canvasLayout.width / 2);
    const validY = (containerY !== undefined && !isNaN(containerY)) ? containerY : (canvasLayout.height / 2);

    // Calculate normalized coordinates relative to actual visible image rect (excluding letterbox margins)
    const { dispL, dispT, dispW, dispH } = getImageDisplayRect(canvasLayout.width, canvasLayout.height, partsImageAspect);
    const imgX = validX - dispL;
    const imgY = validY - dispT;

    const normX = Math.max(0.02, Math.min(0.98, imgX / dispW));
    const normY = Math.max(0.02, Math.min(0.98, imgY / dispH));

    setTempPinpointCoord({ x: normX * 100, y: normY * 100 });
    setPinpointNameInput('');
    setShowPinpointDialog(true);
  };

  const handleCreateAssignment = () => {
    if (!formTitle.trim()) {
      Alert.alert('Required Info', 'Please enter an assignment title');
      return;
    }
    
    // Multi-step check: if details step and format is Fill in the Blanks or Match, go to next step
    if (createStep === 'details') {
      if (formType === 'blanks') {
        setCreateStep('blanks');
        return;
      }
      if (formType === 'match') {
        setCreateStep('match');
        return;
      }
      if (formType === 'crosswords' || formType === 'cluegames') {
        setCreateStep('crossword');
        return;
      }
      if (formType === 'parts') {
        setCreateStep('partsCreator');
        return;
      }
      if (formType === 'truefalse') {
        setCreateStep('truefalse');
        return;
      }
    }

    // Process blanks text if indices were selected
    let finalBlanksText = blanksText;
    if (formType === 'blanks' && selectedBlankIndices.length > 0) {
      const words = blanksText.split(/\s+/);
      const processed = words.map((word, idx) => {
        if (selectedBlankIndices.includes(idx)) {
          return '_____';
        }
        return word;
      });
      finalBlanksText = processed.join(' ');
    }

    const wordsList = blanksText.split(/\s+/).filter(w => w.length > 0);
    const newAssignment = {
      sNo: Math.floor(1000 + Math.random() * 9000).toString(),
      title: formTitle,
      class: formClass,
      section: formSection,
      course: formCourse,
      chapter: formChapter.trim() || '—',
      topic: formTopic.trim() || '—',
      teacher: 'suman',
      startDateTime: formStart,
      deadline: formDeadline,
      type: formType,
      content: formType === 'blanks' ? finalBlanksText : (formType === 'truefalse' ? `${tfQuestions.length} Questions` : ''),
      themeUrl: themesList[selectedThemeIndex] || '',
      originalWords: formType === 'blanks' ? wordsList : [],
      blankIndices: formType === 'blanks' ? selectedBlankIndices : [],
      correctAnswers: formType === 'blanks' ? selectedBlankIndices.map(idx => wordsList[idx]) : [],
      rawText: formType === 'blanks' ? blanksText : '',
      matchPairs: formType === 'match' ? matchPairs : [],
      partsImage: formType === 'parts' ? partsImage : '',
      partsPinpoints: formType === 'parts' ? partsPinpoints : [],
      partsLayoutMethod: formType === 'parts' ? partsLayoutMethod : 'drag',
      partsImageAspect: formType === 'parts' ? (partsImageAspect || 1.25) : 1.25,
      tfQuestions: formType === 'truefalse' ? tfQuestions : [],
    };

    setAssignments([newAssignment, ...assignments]);
    setIsCreateVisible(false);
    setCreateStep('details');
    
    // Launch player immediately after generate output
    if (formType === 'blanks') {
      setActiveBlanksPlayer(newAssignment);
      setUserAnswers({});
      setSelectedOption(null);
      setPlayerFontSize(16);
      setPlayerFontFamily('System');
      setIsPlayerSubmitted(false);
      setPlayerScore(`0/${selectedBlankIndices.length}`);
      setShowSuccessUpload(false);
    } else if (formType === 'match') {
      // Launch Match player immediately
      setMatchLeftSelected(null);
      setMatchAnswers({});
      setIsPlayerSubmitted(false);
      setPlayerScore(`0/${matchPairs.length}`);
      setShowMatchSuccessUpload(false);
      setCardLayouts({});
      // Shuffle right items
      const rightWithIndices = matchPairs.map((p, idx) => ({
        originalIndex: idx,
        text: p.right,
      }));
      const shuffled = [...rightWithIndices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledRightItems(shuffled);
      setActiveMatchPlayer(newAssignment);
    } else if (formType === 'parts') {
      // Launch Parts player immediately
      setPartsAnswers({});
      setPartsSelectedLabel(null);
      setPartsDropdownActiveId(null);
      setPartsWrongAlert(false);
      setIsPlayerSubmitted(false);
      setPlayerScore(`0/${partsPinpoints.length}`);
      setShowSuccessUpload(false);
      setShowPartsSuccessUpload(false);
      setActivePartsPlayer(newAssignment);
    } else if (formType === 'truefalse') {
      // Launch True/False player immediately
      setActiveTfPlayer(newAssignment);
      setTfCurrentIndex(0);
      setTfUserAnswers({});
      setTfQuizStage('welcome');
      setTfScore(0);
      setShowTfSuccessUpload(false);
    }

    // Reset Form
    setFormTitle('');
    setFormChapter('');
    setFormTopic('');
    setBlanksText('');
    setSelectedBlankIndices([]);
    setIsSelectingBlanks(false);
    setSelectedThemeIndex(0);
    setCustomThemeUrl('');
    setMatchPairs([]);
    setColumnLeftText('');
    setColumnRightText('');
    
    // Reset Parts Editor States
    setPartsImage('');
    setPartsImageName('NO FILE CHOSEN');
    setPartsPinpoints([]);
    setPartsLayoutMethod('drag');
    setTempPinpointCoord(null);
    setPinpointNameInput('');
    setIsGeneratingParts(false);
    setShowPartsSuccessUpload(false);
    setShowImageSelectModal(false);
    setShowPinpointDialog(false);

    Alert.alert('Success', 'Assignment posted successfully to class!');
  };

  const handleDelete = (sNo: string) => {
    Alert.alert(
      'Delete Assignment',
      `Are you sure you want to delete assignment #${sNo}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setAssignments(assignments.filter(a => a.sNo !== sNo));
            setIsDetailVisible(false);
          }
        }
      ]
    );
  };

  const handleEdit = (item: any) => {
    Alert.alert('Edit Assignment', `Edit configuration active for assignment #${item.sNo}`);
  };

  const handleReport = (item: any) => {
    Alert.alert('Analytics Report', `Opening performance stats report for Assignment #${item.sNo}`);
  };

  const openDetails = (item: any) => {
    setSelectedAssignment(item);
    if (item.type === 'blanks') {
      setActiveBlanksPlayer(item);
      setUserAnswers({});
      setSelectedOption(null);
      setPlayerFontSize(16);
      setPlayerFontFamily('System');
      setIsPlayerSubmitted(false);
      setPlayerScore(`0/${item.blankIndices?.length || 0}`);
      setShowSuccessUpload(false);
    } else if (item.type === 'match') {
      setMatchLeftSelected(null);
      setMatchAnswers({});
      setIsPlayerSubmitted(false);
      setPlayerScore(`0/${item.matchPairs?.length || 0}`);
      setShowMatchSuccessUpload(false);
      setCardLayouts({});
      const rightWithIndices = (item.matchPairs || []).map((p: any, idx: number) => ({
        originalIndex: idx,
        text: p.right,
      }));
      const shuffled = [...rightWithIndices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledRightItems(shuffled);
      setActiveMatchPlayer(item);
    } else if (item.type === 'parts') {
      setPartsAnswers({});
      setPartsSelectedLabel(null);
      setPartsDropdownActiveId(null);
      setPartsWrongAlert(false);
      setIsPlayerSubmitted(false);
      setPlayerScore(`0/${item.partsPinpoints?.length || 0}`);
      setShowPartsSuccessUpload(false);
      setActivePartsPlayer(item);
    } else if (item.type === 'truefalse') {
      setActiveTfPlayer(item);
      setTfCurrentIndex(0);
      setTfUserAnswers({});
      setTfQuizStage('welcome');
      setTfScore(0);
      setShowTfSuccessUpload(false);
    } else {
      setIsDetailVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 1. MOBILE HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={20} color="#003d9b" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Assignments</Text>
            <Text style={styles.headerSubtitle}>Manage & track all tasks</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButtonHeader}
          onPress={() => setIsCreateVisible(true)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#0066FF', '#003D9B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createBtnGradient}
          >
            <MaterialIcons name="add-circle" size={19} color="#ffffff" style={{ marginRight: 5 }} />
            <Text style={styles.createBtnText}>Create</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Main scroll content */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* 2. PREMIUM HERO SUMMARY CARD */}
        <LinearGradient
          colors={['#0A1F5C', '#003d9b', '#0052cc']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {/* Decorative circles */}
          <View style={[styles.bandCircle, { width: 160, height: 160, top: -60, right: -40, opacity: 0.08 }]} />
          <View style={[styles.bandCircle, { width: 90, height: 90, bottom: -30, left: -20, opacity: 0.07 }]} />
          <View style={[styles.bandCircle, { width: 55, height: 55, top: 20, right: 100, opacity: 0.06 }]} />

          {/* Top label */}
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <MaterialIcons name="bar-chart" size={12} color="#93C5FD" style={{ marginRight: 5 }} />
              <Text style={styles.heroBadgeText}>OVERVIEW</Text>
            </View>
            <Text style={styles.heroDate}>Aug 2026</Text>
          </View>

          {/* Stats row */}
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatNum}>{stats.total}</Text>
              <Text style={styles.heroStatLabel}>Total</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStat}>
              <Text style={[styles.heroStatNum, { color: '#6EE7B7' }]}>{stats.blanksCount}</Text>
              <Text style={styles.heroStatLabel}>Fill Blanks</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStat}>
              <Text style={[styles.heroStatNum, { color: '#FCD34D' }]}>{stats.tfCount}</Text>
              <Text style={styles.heroStatLabel}>True/False</Text>
            </View>

            <View style={styles.heroStatDivider} />

            <View style={styles.heroStat}>
              <Text style={[styles.heroStatNum, { color: '#C4B5FD' }]}>
                {assignments.filter(a => a.type === 'match' || a.type === 'parts').length}
              </Text>
              <Text style={styles.heroStatLabel}>Others</Text>
            </View>
          </View>

          {/* Bottom progress bar */}
          <View style={styles.heroProgressRow}>
            <View style={[styles.heroProgressSegment, { flex: stats.blanksCount, backgroundColor: '#6EE7B7' }]} />
            <View style={[styles.heroProgressSegment, { flex: stats.tfCount, backgroundColor: '#FCD34D' }]} />
            <View style={[styles.heroProgressSegment, {
              flex: assignments.filter(a => a.type === 'match' || a.type === 'parts').length,
              backgroundColor: '#C4B5FD'
            }]} />
          </View>
        </LinearGradient>

        {/* 3. FILTERS */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionHeading}>Filter by Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {filterTypes.map(type => {
              const isSelected = selectedType === type;
              const chipAccent = getAccentColor(type);
              const chipIcon =
                type === 'blanks' ? '✏' :
                type === 'match' ? '⇄' :
                type === 'crosswords' ? '⊞' :
                type === 'parts' ? '◈' :
                type === 'truefalse' ? '✓' :
                type === 'cluegames' ? '🔍' : '✦';
              const chipLabel = type === 'All' ? 'All' : getTypeLabel(type);
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    isSelected
                      ? [styles.filterChipActive, { backgroundColor: chipAccent, borderColor: chipAccent, shadowColor: chipAccent }]
                      : styles.filterChipInactive
                  ]}
                  onPress={() => setSelectedType(type)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.filterChipText,
                    isSelected ? styles.filterChipTextActive : [styles.filterChipTextInactive, { color: chipAccent }]
                  ]}>
                    {`${chipIcon}  ${chipLabel}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. SEARCH */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <View style={styles.searchIconBox}>
              <MaterialIcons name="search" size={18} color="#003d9b" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search assignments..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.searchClearBtn} onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={14} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 5. ASSIGNMENT CARD LIST */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Assignment List</Text>
            <View style={styles.counterBadge}>
              <Text style={styles.counterBadgeText}>{filteredAssignments.length} Records</Text>
            </View>
          </View>


          {filteredAssignments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="find-in-page" size={44} color="#cadaff" />
              <Text style={styles.emptyText}>No records found matching search</Text>
            </View>
          ) : (
            filteredAssignments.map(item => {
              const accent = getAccentColor(item.type);
              return (
                <View key={item.sNo} style={[styles.card, { shadowColor: accent }]}>

                   {/* ── Header Band ── */}
                  <LinearGradient
                    colors={[accent, accent + 'CC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.cardTopBand}
                  >
                    {/* Decorative circles */}
                    <View style={[styles.bandCircle, { width: 90, height: 90, bottom: -35, right: -8, opacity: 0.12 }]} />
                    <View style={[styles.bandCircle, { width: 48, height: 48, bottom: -8, right: 65, opacity: 0.1 }]} />

                    <View style={styles.bandContent}>
                      <View style={styles.bandLeft}>
                        <Text style={styles.cardTitleBand} numberOfLines={1}>{item.title}</Text>
                        <View style={styles.subtitleRow}>
                          <MaterialIcons name="school" size={11} color="rgba(255,255,255,0.75)" style={{ marginRight: 4 }} />
                          <Text style={styles.cardSubtitleBand}>{item.class}  •  {item.course}</Text>
                        </View>
                      </View>
                      <View style={styles.bandRight}>
                        <View style={styles.typePillBand}>
                          <Text style={[styles.typePillBandText, { color: accent }]}>{getTypeLabel(item.type).toUpperCase()}</Text>
                        </View>
                        <View style={styles.refPillBand}>
                          <Text style={styles.refTextBand}>#{item.sNo}</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>

                  {/* ── Body ── */}
                  <View style={styles.cardBody}>

                    {/* Chapter & Topic capsules */}
                    <View style={styles.infoRowPair}>
                      <View style={[styles.infoCapsule, { flex: 1, borderLeftColor: accent, borderLeftWidth: 3 }]}>
                        <View style={[styles.infoCapsuleIcon, { backgroundColor: accent + '15' }]}>
                          <MaterialIcons name="folder-open" size={13} color={accent} />
                        </View>
                        <View style={styles.infoCapsuleText}>
                          <Text style={[styles.infoCapsuleLabel, { color: accent + 'CC' }]}>CHAPTER</Text>
                          <Text style={styles.infoCapsuleValue} numberOfLines={1}>{item.chapter}</Text>
                        </View>
                      </View>

                      <View style={{ width: 7 }} />

                      <View style={[styles.infoCapsule, { flex: 1, borderLeftColor: accent, borderLeftWidth: 3 }]}>
                        <View style={[styles.infoCapsuleIcon, { backgroundColor: accent + '15' }]}>
                          <MaterialIcons name="book" size={13} color={accent} />
                        </View>
                        <View style={styles.infoCapsuleText}>
                          <Text style={[styles.infoCapsuleLabel, { color: accent + 'CC' }]}>TOPIC</Text>
                          <Text style={styles.infoCapsuleValue} numberOfLines={1}>{item.topic}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Teacher + Start + Deadline row */}
                    <View style={styles.teacherRowNew}>
                      <View style={[styles.teacherAvatarNew, { backgroundColor: accent + '1E', borderWidth: 1.5, borderColor: accent + '40' }]}>
                        <Text style={[styles.teacherAvatarTextNew, { color: accent }]}>
                          {item.teacher.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.teacherTextNew}>
                        <Text style={styles.teacherLabelNew}>Assigned by</Text>
                        <Text style={styles.teacherNameNew}>{item.teacher}</Text>
                      </View>
                      <View style={styles.spacer} />
                      <View style={styles.deadlineChip}>
                        <MaterialIcons name="alarm" size={10} color="#BE2F2F" style={{ marginRight: 4 }} />
                        <View>
                          <Text style={styles.deadlineChipSubLabel}>DUE</Text>
                          <Text style={styles.deadlineChipText} numberOfLines={1}>{item.deadline}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Compact date row */}
                    <View style={styles.compactDateRow}>
                      <View style={[styles.compactDateDot, { backgroundColor: accent }]} />
                      <Text style={styles.compactDateStart}>{item.startDateTime}</Text>
                      <MaterialIcons name="trending-flat" size={13} color="#CBD5E1" style={{ marginHorizontal: 6 }} />
                      <Text style={styles.compactDateDeadline}>{item.deadline}</Text>
                      <View style={[styles.compactDateDot, { backgroundColor: '#BE2F2F' }]} />
                    </View>

                    {/* Actions */}
                    <View style={styles.cardActionsNew}>
                      <TouchableOpacity
                        style={[styles.editBtnNew, { borderColor: accent + '60' }]}
                        onPress={() => handleEdit(item)}
                      >
                        <MaterialIcons name="edit" size={13} color={accent} style={{ marginRight: 5 }} />
                        <Text style={[styles.editBtnTextNew, { color: accent }]}>Edit</Text>
                      </TouchableOpacity>

                      <LinearGradient
                        colors={[accent, accent + 'CC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.detailBtnGradient}
                      >
                        <TouchableOpacity
                          style={styles.detailBtnNew}
                          onPress={() => openDetails(item)}
                        >
                          <Text style={styles.detailBtnTextNew}>View Details</Text>
                          <MaterialIcons name="arrow-forward" size={13} color="#fff" style={{ marginLeft: 6 }} />
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>

                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* 7. PAGINATION / LOAD MORE */}
        <View style={styles.paginationSection}>
          <Text style={styles.paginationInfo}>
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </Text>
          <View style={styles.paginationControls}>
            <TouchableOpacity style={[styles.pageBtn, styles.pageBtnDisabled]}>
              <Text style={styles.pageBtnTextDisabled}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.pageBtn, styles.pageBtnActive]}>
              <Text style={styles.pageBtnTextActive}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pageBtn}>
              <Text style={styles.pageBtnText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pageBtn}>
              <Text style={styles.pageBtnText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* 6. ASSIGNMENT DETAILS BOTTOM SHEET */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailVisible}
        onRequestClose={() => setIsDetailVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>

            {selectedAssignment && (() => {
              const accent = getAccentColor(selectedAssignment.type);
              return (
                <>
                  {/* Colored Header Band */}
                  <LinearGradient
                    colors={[accent, accent + 'BB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.detailBand}
                  >
                    <View style={[styles.bandCircle, { width: 90, height: 90, bottom: -35, right: -10, opacity: 0.12 }]} />
                    <View style={[styles.bandCircle, { width: 50, height: 50, top: -15, right: 60, opacity: 0.09 }]} />
                    <View style={styles.detailBandRow}>
                      <View style={styles.detailBandLeft}>
                        <View style={styles.typePillBand}>
                          <Text style={[styles.typePillBandText, { color: accent }]}>
                            {getTypeLabel(selectedAssignment.type).toUpperCase()}
                          </Text>
                        </View>
                        <Text style={styles.detailBandTitle} numberOfLines={2}>{selectedAssignment.title}</Text>
                        <Text style={styles.detailBandSub}>
                          {selectedAssignment.class}  •  {selectedAssignment.course}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.detailCloseBtn}
                        onPress={() => setIsDetailVisible(false)}
                      >
                        <MaterialIcons name="close" size={18} color="rgba(255,255,255,0.9)" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.refBandPill}>
                      <MaterialIcons name="tag" size={11} color="rgba(255,255,255,0.75)" style={{ marginRight: 3 }} />
                      <Text style={styles.refBandText}>Reference #{selectedAssignment.sNo}</Text>
                    </View>
                  </LinearGradient>

                  {/* Body */}
                  <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>

                    {/* Chapter & Topic */}
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionLabel}>📚  Content</Text>
                      <View style={styles.detailRow}>
                        <View style={[styles.detailIconBox, { backgroundColor: accent + '15' }]}>
                          <MaterialIcons name="folder-open" size={16} color={accent} />
                        </View>
                        <View style={styles.detailRowText}>
                          <Text style={styles.detailRowLabel}>Chapter</Text>
                          <Text style={styles.detailRowValue}>{selectedAssignment.chapter}</Text>
                        </View>
                      </View>
                      <View style={styles.detailDivider} />
                      <View style={styles.detailRow}>
                        <View style={[styles.detailIconBox, { backgroundColor: accent + '15' }]}>
                          <MaterialIcons name="book" size={16} color={accent} />
                        </View>
                        <View style={styles.detailRowText}>
                          <Text style={styles.detailRowLabel}>Topic</Text>
                          <Text style={styles.detailRowValue}>{selectedAssignment.topic}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Teacher & Format */}
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionLabel}>🧑‍🏫  Assignment Info</Text>
                      <View style={styles.detailRow}>
                        <View style={[styles.detailIconBox, { backgroundColor: accent + '15' }]}>
                          <MaterialIcons name="person" size={16} color={accent} />
                        </View>
                        <View style={styles.detailRowText}>
                          <Text style={styles.detailRowLabel}>Instructor</Text>
                          <Text style={styles.detailRowValue}>{selectedAssignment.teacher}</Text>
                        </View>
                      </View>
                      <View style={styles.detailDivider} />
                      <View style={styles.detailRow}>
                        <View style={[styles.detailIconBox, { backgroundColor: accent + '15' }]}>
                          <MaterialIcons name="assignment" size={16} color={accent} />
                        </View>
                        <View style={styles.detailRowText}>
                          <Text style={styles.detailRowLabel}>Task Format</Text>
                          <Text style={[styles.detailRowValue, { color: accent }]}>
                            {getTypeLabel(selectedAssignment.type)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Timeline */}
                    <View style={styles.detailSection}>
                      <Text style={styles.detailSectionLabel}>📅  Timeline</Text>
                      <View style={styles.timelineStrip}>
                        <View style={styles.timelineSide}>
                          <View style={[styles.timelineDot, { backgroundColor: accent }]} />
                          <Text style={styles.timelineTag}>Started</Text>
                          <Text style={[styles.timelineDate, { color: accent }]}>{selectedAssignment.startDateTime}</Text>
                        </View>
                        <View style={styles.timelineMid}>
                          <View style={styles.timelineLine} />
                        </View>
                        <View style={[styles.timelineSide, { alignItems: 'flex-end' }]}>
                          <View style={[styles.timelineDot, { backgroundColor: '#BE2F2F' }]} />
                          <Text style={[styles.timelineTag, { color: '#BE2F2F' }]}>Due Date</Text>
                          <Text style={[styles.timelineDate, { color: '#BE2F2F', fontWeight: '900' }]}>{selectedAssignment.deadline}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Display match pairs if Match format */}
                    {selectedAssignment.type === 'match' && selectedAssignment.matchPairs && (
                      <View style={{ marginTop: 16, borderTopWidth: 1.5, borderTopColor: '#F1F5F9', paddingTop: 16 }}>
                        <Text style={{ fontSize: 13, fontWeight: '900', color: '#1E293B', marginBottom: 10, letterSpacing: 0.5 }}>MATCHING PAIRS</Text>
                        <View style={{ borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                          {selectedAssignment.matchPairs.map((pair: any, idx: number) => (
                            <View key={pair.id || idx} style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: idx < selectedAssignment.matchPairs.length - 1 ? 1 : 0, borderBottomColor: '#E2E8F0', alignItems: 'center' }}>
                              <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: '#334155' }}>{pair.left}</Text>
                              <MaterialIcons name="compare-arrows" size={16} color="#64748B" style={{ marginHorizontal: 12 }} />
                              <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: '#334155' }}>{pair.right}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Play Match Trigger (if Match format) */}
                    {selectedAssignment.type === 'match' && (
                      <TouchableOpacity
                        style={styles.playerTriggerBtn}
                        onPress={() => {
                          const item = selectedAssignment;
                          setSelectedAssignment(null);
                          
                          // Initialize Match player states
                          setMatchLeftSelected(null);
                          setMatchAnswers({});
                          setIsPlayerSubmitted(false);
                          setPlayerScore(`0/${item.matchPairs?.length || 0}`);
                          setShowSuccessUpload(false);
                          setCardLayouts({});
                          
                          const pairs = item.matchPairs || [];
                          const rightWithIndices = pairs.map((p: any, idx: number) => ({
                            originalIndex: idx,
                            text: p.right,
                          }));
                          // Shuffle rightWithIndices
                          const shuffled = [...rightWithIndices];
                          for (let i = shuffled.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                          }
                          setShuffledRightItems(shuffled);
                          setActiveMatchPlayer(item);
                        }}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#0EA5E9', '#2563EB']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.playerTriggerGradient}
                        >
                          <MaterialIcons name="play-circle-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                          <Text style={styles.playerTriggerBtnText}>PLAY INTERACTIVE MATCH</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}

                    {/* Play Parts Trigger (if Parts format) */}
                    {selectedAssignment.type === 'parts' && (
                      <TouchableOpacity
                        style={styles.playerTriggerBtn}
                        onPress={() => {
                          const item = selectedAssignment;
                          setSelectedAssignment(null);
                          setPartsAnswers({});
                          setPartsSelectedLabel(null);
                          setPartsDropdownActiveId(null);
                          setPartsWrongAlert(false);
                          setIsPlayerSubmitted(false);
                          setPlayerScore(`0/${item.partsPinpoints?.length || 0}`);
                          setShowPartsSuccessUpload(false);
                          setActivePartsPlayer(item);
                        }}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#0EA5E9', '#2563EB']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.playerTriggerGradient}
                        >
                          <MaterialIcons name="play-circle-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                          <Text style={styles.playerTriggerBtnText}>PLAY INTERACTIVE DIAGRAM</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}

                    {/* Play Blanks Trigger (if Blanks format) */}
                    {selectedAssignment.type === 'blanks' && (
                      <TouchableOpacity
                        style={styles.playerTriggerBtn}
                        onPress={() => {
                          setSelectedAssignment(null);
                          setActiveBlanksPlayer(selectedAssignment);
                          setUserAnswers({});
                          setSelectedOption(null);
                          setPlayerFontSize(16);
                          setPlayerFontFamily('System');
                          setIsPlayerSubmitted(false);
                          setPlayerScore(`0/${selectedAssignment.blankIndices?.length || 0}`);
                          setShowSuccessUpload(false);
                        }}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#0EA5E9', '#2563EB']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.playerTriggerGradient}
                        >
                          <MaterialIcons name="play-circle-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                          <Text style={styles.playerTriggerBtnText}>PLAY INTERACTIVE BLANKS</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}

                    {/* Actions */}
                    <View style={styles.detailActions}>
                      <TouchableOpacity
                        style={styles.detailActionReport}
                        onPress={() => handleReport(selectedAssignment)}
                      >
                        <MaterialIcons name="bar-chart" size={16} color="#3B4FD8" style={{ marginRight: 6 }} />
                        <Text style={[styles.detailActionText, { color: '#3B4FD8' }]}>Report</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.detailActionEdit}
                        onPress={() => handleEdit(selectedAssignment)}
                      >
                        <MaterialIcons name="edit" size={16} color={accent} style={{ marginRight: 6 }} />
                        <Text style={[styles.detailActionText, { color: accent }]}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.detailActionDelete}
                        onPress={() => handleDelete(selectedAssignment.sNo)}
                      >
                        <MaterialIcons name="delete-outline" size={16} color="#BE2F2F" style={{ marginRight: 6 }} />
                        <Text style={[styles.detailActionText, { color: '#BE2F2F' }]}>Delete</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ height: 20 }} />
                  </ScrollView>
                </>
              );
            })()}
          </View>
        </View>
      </Modal>


      {/* CREATE ASSIGNMENT MODAL SCREEN */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCreateVisible}
        onRequestClose={() => setIsCreateVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.bottomSheet}>

            {/* Premium Background Design (Glow & Mesh) */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgLinearGradient id="modalGlow1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#2563eb" stopOpacity={0.15} />
                    <Stop offset="50%" stopColor="#60a5fa" stopOpacity={0.08} />
                    <Stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.02} />
                  </SvgLinearGradient>
                  <SvgLinearGradient id="modalGlow2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#00d8f6" stopOpacity={0.12} />
                    <Stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </SvgLinearGradient>
                  <SvgLinearGradient id="sphereGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#60a5fa" stopOpacity={0.25} />
                    <Stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
                  </SvgLinearGradient>
                  <SvgLinearGradient id="yellowSphere" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#ffb300" stopOpacity={0.2} />
                    <Stop offset="100%" stopColor="#ff8f00" stopOpacity={0.02} />
                  </SvgLinearGradient>
                </Defs>
                {/* Glowing Premium Spheres */}
                <Circle cx="15%" cy="18%" r="130" fill="url(#modalGlow1)" />
                <Circle cx="88%" cy="45%" r="180" fill="url(#modalGlow2)" />
                <Circle cx="35%" cy="75%" r="160" fill="url(#modalGlow1)" />
                
                {/* Floating kid-friendly glass spheres */}
                <Circle cx="82%" cy="15%" r="48" fill="url(#sphereGrad)" />
                <Circle cx="12%" cy="52%" r="64" fill="url(#yellowSphere)" />
                <Circle cx="85%" cy="82%" r="55" fill="url(#sphereGrad)" />
                <Circle cx="45%" cy="30%" r="30" fill="url(#sphereGrad)" />

                {/* Elegant flowing wave vectors */}
                <Path d="M -20,150 Q 80,100 160,220 T 360,180 T 560,220" stroke="#2563eb" strokeWidth={1.5} fill="none" opacity={0.16} />
                <Path d="M -40,165 Q 60,115 140,235 T 340,195 T 540,235" stroke="#60a5fa" strokeWidth={1} fill="none" opacity={0.12} />
                <Path d="M 60,320 Q 210,280 230,440 T 430,340" stroke="#00acc1" strokeWidth={1.2} fill="none" opacity={0.14} />
                <Path d="M 40,335 Q 190,295 210,455 T 410,355" stroke="#ffb300" strokeWidth={1} fill="none" opacity={0.1} />
              </Svg>
            </View>

            {/* Gradient Header Bar */}
            <LinearGradient
              colors={['#0B1B3D', '#0047CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createModalBand}
            >
              <View style={[styles.bandCircle, { width: 100, height: 100, bottom: -40, right: -10, opacity: 0.1 }]} />
              <View style={styles.createModalHeaderRow}>
                <View style={styles.createModalHeaderLeft}>
                  <View style={styles.createModalIconBox}>
                    <MaterialIcons name="add-task" size={20} color="#ffffff" />
                  </View>
                  <View>
                    <Text style={styles.createModalTitle}>Create Assignment</Text>
                    <Text style={styles.createModalSubtitle}>Assign new task to students</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.createModalCloseBtn}
                  onPress={() => {
                    setIsCreateVisible(false);
                    setShowClassDropdown(false);
                    setShowCourseDropdown(false);
                    setShowTypeDropdown(false);
                  }}
                >
                  <MaterialIcons name="close" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              
              <View style={styles.formContainer}>
                
                {createStep === 'details' ? (
                  <>
                    {/* General Info Card */}
                    <View style={styles.formCard}>
                      <View style={styles.formCardHeaderRow}>
                        <View style={[styles.formHeaderIconBox, { backgroundColor: '#EEF2FF' }]}>
                          <MaterialIcons name="assignment" size={16} color="#003d9b" />
                        </View>
                        <Text style={styles.formCardHeader}>General Information</Text>
                      </View>

                      <View style={styles.formField}>
                        <View style={styles.labelRow}>
                          <Text style={styles.formLabel}>Assignment Title</Text>
                          <Text style={styles.requiredStar}>*</Text>
                        </View>
                        <TextInput
                          style={styles.formInput}
                          placeholder="e.g. Solve linear equations"
                          placeholderTextColor="#94A3B8"
                          value={formTitle}
                          onChangeText={setFormTitle}
                        />
                      </View>

                      {/* Dropdown Assignment Type */}
                      <View style={styles.formField}>
                        <View style={styles.labelRow}>
                          <Text style={styles.formLabel}>Assignment Format</Text>
                          <Text style={styles.requiredStar}>*</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.formSelectBox}
                          onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.selectTextRow}>
                            <MaterialIcons name="style" size={16} color="#003d9b" style={{ marginRight: 8 }} />
                            <Text style={styles.formSelectText}>{getTypeLabel(formType)}</Text>
                          </View>
                          <MaterialIcons name={showTypeDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#003d9b" />
                        </TouchableOpacity>

                        {showTypeDropdown && (
                          <View style={styles.formDropdownOptions}>
                            {typesList.map(type => {
                              const isSelected = formType === type;
                              return (
                                <TouchableOpacity 
                                  key={type} 
                                  style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                                  onPress={() => {
                                    setFormType(type);
                                    setShowTypeDropdown(false);
                                  }}
                                >
                                  <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>
                                    {getTypeLabel(type)}
                                  </Text>
                                  {isSelected && <MaterialIcons name="check" size={16} color="#003d9b" />}
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Academic Target Card */}
                    <View style={styles.formCard}>
                      <View style={styles.formCardHeaderRow}>
                        <View style={[styles.formHeaderIconBox, { backgroundColor: '#F0FDF4' }]}>
                          <MaterialIcons name="school" size={16} color="#0B8A7D" />
                        </View>
                        <Text style={[styles.formCardHeader, { color: '#0B8A7D' }]}>Academic Target</Text>
                      </View>

                      {/* Dropdown Class */}
                      <View style={styles.formField}>
                        <View style={styles.labelRow}>
                          <Text style={styles.formLabel}>Target Class</Text>
                          <Text style={styles.requiredStar}>*</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.formSelectBox}
                          onPress={() => setShowClassDropdown(!showClassDropdown)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.selectTextRow}>
                            <MaterialIcons name="groups" size={16} color={formClass ? '#0B8A7D' : '#94A3B8'} style={{ marginRight: 8 }} />
                            <Text style={[styles.formSelectText, !formClass && styles.formSelectPlaceholder]}>
                              {formClass || 'Select a class...'}
                            </Text>
                          </View>
                          <MaterialIcons name={showClassDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#0B8A7D" />
                        </TouchableOpacity>

                        {showClassDropdown && (
                          <View style={styles.formDropdownOptions}>
                            {classesList.map(c => {
                              const isSelected = formClass === c;
                              return (
                                <TouchableOpacity 
                                  key={c} 
                                  style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                                  onPress={() => {
                                    setFormClass(c);
                                    setShowClassDropdown(false);
                                  }}
                                >
                                  <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>{c}</Text>
                                  {isSelected && <MaterialIcons name="check" size={16} color="#0B8A7D" />}
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>

                      {/* Dropdown Section */}
                      <View style={styles.formField}>
                        <View style={styles.labelRow}>
                          <Text style={styles.formLabel}>Section</Text>
                          <Text style={styles.requiredStar}>*</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.formSelectBox}
                          onPress={() => setShowSectionDropdown(!showSectionDropdown)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.selectTextRow}>
                            <MaterialIcons name="bookmark" size={16} color={formSection ? '#0B8A7D' : '#94A3B8'} style={{ marginRight: 8 }} />
                            <Text style={[styles.formSelectText, !formSection && styles.formSelectPlaceholder]}>
                              {formSection || 'Select a section...'}
                            </Text>
                          </View>
                          <MaterialIcons name={showSectionDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color="#0B8A7D" />
                        </TouchableOpacity>

                        {showSectionDropdown && (
                          <View style={styles.formDropdownOptions}>
                            {sectionsList.map(sec => {
                              const isSelected = formSection === sec;
                              return (
                                <TouchableOpacity
                                  key={sec}
                                  style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                                  onPress={() => {
                                    setFormSection(sec);
                                    setShowSectionDropdown(false);
                                  }}
                                >
                                  <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>{sec}</Text>
                                  {isSelected && <MaterialIcons name="check" size={16} color="#0B8A7D" />}
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>
                      <View style={styles.formField}>
                        <View style={styles.labelRow}>
                          <Text style={styles.formLabel}>Course / Subject</Text>
                          <Text style={styles.requiredStar}>*</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.formSelectBox}
                          onPress={() => setShowCourseDropdown(!showCourseDropdown)}
                          activeOpacity={0.8}
                        >
                          <View style={styles.selectTextRow}>
                            <MaterialIcons name="menu-book" size={16} color={formCourse ? '#0B8A7D' : '#94A3B8'} style={{ marginRight: 8 }} />
                            <Text style={[styles.formSelectText, !formCourse && styles.formSelectPlaceholder]}>
                              {formCourse || 'Select a subject...'}
                            </Text>
                          </View>
                          <MaterialIcons name={showCourseDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#0B8A7D" />
                        </TouchableOpacity>

                        {showCourseDropdown && (
                          <View style={styles.formDropdownOptions}>
                            {coursesList.map(course => {
                              const isSelected = formCourse === course;
                              return (
                                <TouchableOpacity 
                                  key={course} 
                                  style={[styles.formDropdownItem, isSelected && styles.formDropdownItemActive]}
                                  onPress={() => {
                                    setFormCourse(course);
                                    setShowCourseDropdown(false);
                                  }}
                                >
                                  <Text style={[styles.formDropdownItemText, isSelected && styles.formDropdownItemTextActive]}>{course}</Text>
                                  {isSelected && <MaterialIcons name="check" size={16} color="#0B8A7D" />}
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Content Structure Card */}
                    <View style={styles.formCard}>
                      <View style={styles.formCardHeaderRow}>
                        <View style={[styles.formHeaderIconBox, { backgroundColor: '#F5F3FF' }]}>
                          <MaterialIcons name="auto-stories" size={16} color="#3B4FD8" />
                        </View>
                        <Text style={[styles.formCardHeader, { color: '#3B4FD8' }]}>Content Structure</Text>
                      </View>

                      <View style={styles.formField}>
                        <Text style={styles.formLabel}>Chapter Name</Text>
                        <TextInput
                          style={styles.formInput}
                          placeholder="e.g. Chapter # 1"
                          placeholderTextColor="#94A3B8"
                          value={formChapter}
                          onChangeText={setFormChapter}
                        />
                      </View>

                      <View style={styles.formField}>
                        <Text style={styles.formLabel}>Topic Name</Text>
                        <TextInput
                          style={styles.formInput}
                          placeholder="e.g. Slo # 1.1 & 1.3"
                          placeholderTextColor="#94A3B8"
                          value={formTopic}
                          onChangeText={setFormTopic}
                        />
                      </View>
                    </View>

                    {/* Timeline Setup Card */}
                    <View style={styles.formCard}>
                      <View style={styles.formCardHeaderRow}>
                        <View style={[styles.formHeaderIconBox, { backgroundColor: '#FFFBEB' }]}>
                          <MaterialIcons name="event" size={16} color="#B45309" />
                        </View>
                        <Text style={[styles.formCardHeader, { color: '#B45309' }]}>Timeline Settings</Text>
                      </View>

                      <View style={styles.formField}>
                        <View style={styles.labelRow}>
                          <Text style={styles.formLabel}>Start Date & Time</Text>
                          <Text style={styles.requiredStar}>*</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.formSelectBox}
                          onPress={() => {
                            setDatePickerTarget('start');
                            setDatePickerValue(formStart);
                            setDatePickerTitle('Select Start Date & Time');
                            setIsDatePickerVisible(true);
                          }}
                          activeOpacity={0.8}
                        >
                          <View style={styles.selectTextRow}>
                            <MaterialIcons name="event" size={16} color="#B45309" style={{ marginRight: 8 }} />
                            <Text style={styles.formSelectText}>{formStart}</Text>
                          </View>
                          <MaterialIcons name="keyboard-arrow-down" size={20} color="#B45309" />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.formField}>
                        <View style={styles.labelRow}>
                          <Text style={styles.formLabel}>Submission Deadline</Text>
                          <Text style={styles.requiredStar}>*</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.formSelectBox}
                          onPress={() => {
                            setDatePickerTarget('deadline');
                            setDatePickerValue(formDeadline);
                            setDatePickerTitle('Select Submission Deadline');
                            setIsDatePickerVisible(true);
                          }}
                          activeOpacity={0.8}
                        >
                          <View style={styles.selectTextRow}>
                            <MaterialIcons name="event" size={16} color="#B45309" style={{ marginRight: 8 }} />
                            <Text style={styles.formSelectText}>{formDeadline}</Text>
                          </View>
                          <MaterialIcons name="keyboard-arrow-down" size={20} color="#B45309" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Post Submit Button */}
                    <TouchableOpacity 
                      style={styles.postButton}
                      onPress={handleCreateAssignment}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={(formType === 'blanks' || formType === 'match' || formType === 'parts') ? ['#0EA5E9', '#2563EB'] : ['#0066FF', '#003D9B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.postBtnGradient}
                      >
                        <MaterialIcons 
                          name={(formType === 'blanks' || formType === 'match' || formType === 'crosswords' || formType === 'cluegames' || formType === 'parts' || formType === 'truefalse') ? 'arrow-forward' : 'check-circle'} 
                          size={20} 
                          color="#ffffff" 
                          style={{ marginRight: 8 }} 
                        />
                        <Text style={styles.postButtonText}>
                          {(formType === 'blanks' || formType === 'match' || formType === 'crosswords' || formType === 'cluegames' || formType === 'parts' || formType === 'truefalse') ? 'Next' : 'Post Assignment to Class'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Multi-step Header Row */}
                    <View style={styles.blanksStepHeader}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <Text style={styles.blanksStepTitle}>
                            {formType === 'match' 
                              ? 'Create New Match' 
                              : (formType === 'crosswords' || formType === 'cluegames') 
                                ? 'Create Cross Words Game' 
                                : formType === 'parts'
                                  ? 'Label Diagram Parts'
                                  : formType === 'truefalse'
                                    ? 'Create True / False Questions'
                                    : 'Create New Blanks'}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500', marginLeft: 12, letterSpacing: 0.2 }}>
                          {formType === 'match' 
                            ? 'Step 2 of 4 — Build your matching column pairs' 
                            : (formType === 'crosswords' || formType === 'cluegames')
                              ? 'Build your clues and word grids'
                              : formType === 'parts'
                                ? (createStep === 'partsCreator'
                                    ? 'Step 2 of 3 — Choose image and click to place label pinpoints'
                                    : 'Step 3 of 3 — Select theme wallpaper')
                                : formType === 'truefalse'
                                  ? 'Step 2 of 2 — Add statements and set correct answers'
                                  : 'Step 1 of 4 — Write your text and select blanks'}
                        </Text>
                      </View>
                    </View>

                    {/* Step 1: Blanks Input & Interactive Selection */}
                    {createStep === 'blanks' && (
                      <>
                        <View style={styles.blanksCard}>
                          {/* Card Header — Electric Blue Neural Theme */}
                          <View style={styles.blanksCardHeader}>
                            <LinearGradient
                              colors={['#2563EB', '#1D4ED8', '#1E3A8A']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.blanksCardHeaderGradient}
                            >
                              <View style={styles.blanksCardHeaderInner}>
                                <View style={styles.blanksCardIconRing}>
                                  <MaterialIcons name="bolt" size={18} color="#2563EB" />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.blanksCardTitle}>Create New Blanks</Text>
                                  <Text style={styles.blanksCardSubtitle}>AI-powered text generation & parser</Text>
                                </View>
                                <View style={styles.blanksStepBadge}>
                                  <Text style={styles.blanksStepBadgeText}>Step 2/2</Text>
                                </View>
                              </View>
                            </LinearGradient>
                          </View>

                          <View style={styles.blanksCardBody}>
                            {/* ══ Neural Circuit AI Button ══ */}
                            <TouchableOpacity
                              style={styles.aiGenButton}
                              onPress={() => {
                                setIsCreateVisible(false);
                                navigation.navigate('More', {
                                  screen: 'FillBlanks',
                                  params: { fromScreen: 'Activity' }
                                });
                              }}
                              activeOpacity={0.82}
                            >
                              <LinearGradient
                                colors={['#1E3A8A', '#2563EB', '#3B82F6', '#60A5FA']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.aiGenBtnGradient}
                              >
                                <View style={styles.aiGenShineTop} />
                                <View style={styles.aiGenGlassSheen} />
                                <View style={styles.circuitH1} />
                                <View style={styles.circuitH2} />
                                <View style={styles.circuitV1} />
                                <View style={styles.circuitNode1} />
                                <View style={styles.circuitNode2} />
                                <View style={styles.circuitNode3} />
                                <View style={styles.aiGenOrbWrap}>
                                  <View style={styles.aiGenOrbGlassRing} />
                                  <LinearGradient
                                    colors={['#ffffff', '#E0F2FE', '#BAE6FD']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.aiGenOrb}
                                  >
                                    <MaterialIcons name="auto-awesome" size={24} color="#1D4ED8" />
                                  </LinearGradient>
                                </View>
                                <View style={styles.aiGenTextCol}>
                                  <Text style={styles.aiGenBtnTitle}>Generate via AI Toolkit</Text>
                                  <Text style={styles.aiGenBtnSubtitle}>Smart fill-in-the-blanks in seconds</Text>
                                </View>
                                <View style={styles.aiGenArrowPill}>
                                  <MaterialIcons name="arrow-forward" size={16} color="#2563EB" />
                                </View>
                              </LinearGradient>
                            </TouchableOpacity>

                            {/* Divider with tech scanning line */}
                            <View style={styles.blanksDividerRow}>
                              <View style={styles.blanksDividerLineLeft} />
                              <View style={styles.blanksDividerDot} />
                              <Text style={styles.blanksDividerLabel}>OR PARSE TEXT</Text>
                              <View style={styles.blanksDividerDot} />
                              <View style={styles.blanksDividerLineRight} />
                            </View>

                            {/* Conditional rendering: Interactive Selection Mode vs Text Area */}
                            {isSelectingBlanks ? (
                              <View style={styles.interactiveBlanksContainer}>
                                <View style={[styles.bracketLine, styles.bracketTopLeftH]} />
                                <View style={[styles.bracketLine, styles.bracketTopLeftV]} />
                                <View style={[styles.bracketLine, styles.bracketTopRightH]} />
                                <View style={[styles.bracketLine, styles.bracketTopRightV]} />
                                <View style={[styles.bracketLine, styles.bracketBottomLeftH]} />
                                <View style={[styles.bracketLine, styles.bracketBottomLeftV]} />
                                <View style={[styles.bracketLine, styles.bracketBottomRightH]} />
                                <View style={[styles.bracketLine, styles.bracketBottomRightV]} />

                                <View style={styles.interactiveHeader}>
                                  <MaterialIcons name="touch-app" size={14} color="#2563EB" />
                                  <Text style={styles.interactiveInstruction}>TAP WORDS TO BLANK</Text>
                                </View>

                                <ScrollView 
                                  contentContainerStyle={styles.wordsWrapper} 
                                  style={{ maxHeight: 260 }}
                                  nestedScrollEnabled={true}
                                >
                                  {blanksText.split(/\s+/).filter(w => w.length > 0).map((word, idx) => {
                                    const isSelected = selectedBlankIndices.includes(idx);
                                    return (
                                      <TouchableOpacity
                                        key={idx}
                                        style={[
                                          styles.interactiveWordChip,
                                          isSelected && styles.interactiveWordChipSelected
                                        ]}
                                        onPress={() => {
                                          if (isSelected) {
                                            setSelectedBlankIndices(selectedBlankIndices.filter(i => i !== idx));
                                          } else {
                                            setSelectedBlankIndices([...selectedBlankIndices, idx]);
                                          }
                                        }}
                                        activeOpacity={0.7}
                                      >
                                        <Text
                                          style={[
                                            styles.interactiveWordText,
                                            isSelected && styles.interactiveWordTextSelected
                                          ]}
                                        >
                                          {word}
                                        </Text>
                                      </TouchableOpacity>
                                    );
                                  })}
                                </ScrollView>
                              </View>
                            ) : (
                              <View style={styles.blanksInputWrapper}>
                                <View style={[styles.bracketLine, styles.bracketTopLeftH]} />
                                <View style={[styles.bracketLine, styles.bracketTopLeftV]} />
                                <View style={[styles.bracketLine, styles.bracketTopRightH]} />
                                <View style={[styles.bracketLine, styles.bracketTopRightV]} />
                                <View style={[styles.bracketLine, styles.bracketBottomLeftH]} />
                                <View style={[styles.bracketLine, styles.bracketBottomLeftV]} />
                                <View style={[styles.bracketLine, styles.bracketBottomRightH]} />
                                <View style={[styles.bracketLine, styles.bracketBottomRightV]} />

                                <View style={styles.inputTechHeader}>
                                  <View style={styles.techHeaderLeft}>
                                    <MaterialIcons name="code" size={12} color="#2563EB" />
                                    <Text style={styles.techHeaderTitle}>MANUAL_PARSER</Text>
                                  </View>
                                  <View style={styles.inputTerminalTag}>
                                    <MaterialIcons name="terminal" size={10} color="#2563EB" />
                                    <Text style={styles.inputTerminalTagText}>CONTEXT_BLOCK</Text>
                                  </View>
                                </View>

                                <TextInput
                                  style={styles.blanksTextArea}
                                  multiline
                                  numberOfLines={6}
                                  placeholder="Paste or type your paragraph here..."
                                  placeholderTextColor="rgba(30,41,59,0.4)"
                                  value={blanksText}
                                  onChangeText={setBlanksText}
                                  textAlignVertical="top"
                                />
                              </View>
                            )}

                            {blanksText.length > 0 && selectedBlankIndices.length === 0 && (
                              <Text style={styles.blanksCharCount}>
                                {blanksText.length} characters
                              </Text>
                            )}
                          </View>
                        </View>

                        {/* Blanks step bottom row: selected pills & select blank toggle */}
                        <View style={styles.blanksBottomContainer}>
                          <View style={styles.selectedPillsContainer}>
                            {(() => {
                              const words = blanksText.split(/\s+/).filter(w => w.length > 0);
                              const validIndices = selectedBlankIndices.filter(idx => words[idx] !== undefined);
                              if (validIndices.length === 0) return null;
                              return (
                                <View style={{ width: '100%' }}>
                                  <Text style={styles.pillsSectionLabel}>Selected Blanks:</Text>
                                  <View style={styles.selectedPillsList}>
                                    {validIndices.map((idx) => (
                                      <View key={idx} style={styles.selectedWordPill}>
                                        <Text style={styles.selectedWordPillText} numberOfLines={1}>
                                          {words[idx]}
                                        </Text>
                                        <TouchableOpacity 
                                          onPress={() => setSelectedBlankIndices(selectedBlankIndices.filter(i => i !== idx))}
                                          style={styles.selectedWordPillDelete}
                                        >
                                          <MaterialIcons name="close" size={10} color="#ffffff" />
                                        </TouchableOpacity>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              );
                            })()}
                          </View>

                          <View style={styles.selectBlankBtnWrapper}>
                            <TouchableOpacity
                              style={styles.selectBlankBtn}
                              onPress={() => {
                                if (!blanksText.trim()) {
                                  Alert.alert('Empty Content', 'Please enter or generate a paragraph first.');
                                  return;
                                }
                                setIsSelectingBlanks(!isSelectingBlanks);
                              }}
                              activeOpacity={0.8}
                            >
                              <LinearGradient
                                colors={isSelectingBlanks ? ['#10B981', '#059669'] : ['#0EA5E9', '#2563EB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.selectBlankGradient}
                              >
                                <MaterialIcons 
                                  name={isSelectingBlanks ? 'check-circle' : 'touch-app'} 
                                  size={16} 
                                  color="#fff" 
                                />
                                <Text style={styles.selectBlankBtnText}>
                                  {isSelectingBlanks ? 'Done' : 'Select Blank'}
                                </Text>
                              </LinearGradient>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Step Footer Navigation */}
                        {!isSelectingBlanks && (
                          <View style={styles.stepFooterButtons}>
                            <TouchableOpacity
                              style={[styles.stepFooterBtn, styles.stepFooterBtnPrev, { minWidth: 110 }]}
                              onPress={handleStepPrev}
                              activeOpacity={0.7}
                            >
                              <MaterialIcons name="arrow-back" size={16} color="#64748B" style={{ marginRight: 6 }} />
                              <Text style={styles.stepFooterTextPrev}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.stepFooterBtn, styles.stepFooterBtnNext, { backgroundColor: '#2563EB' }]}
                              onPress={handleStepNext}
                              activeOpacity={0.8}
                            >
                              <LinearGradient
                                colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 }}
                              />
                              <Text style={styles.stepFooterTextNext}>Next</Text>
                              <MaterialIcons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                            </TouchableOpacity>
                          </View>
                        )}
                      </>
                    )}

                    {/* Step 1.5: Match Columns Builder */}
                    {createStep === 'match' && (
                      <>
                        <View style={styles.matchCard}>
                          {/* Card Header — Electric Neural Theme */}
                          <View style={styles.blanksCardHeader}>
                            <LinearGradient
                              colors={['#2563EB', '#1D4ED8', '#1E3A8A']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.blanksCardHeaderGradient}
                            >
                              <View style={styles.blanksCardHeaderInner}>
                                <View style={[styles.blanksCardIconRing, { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' }]}>
                                  <MaterialIcons name="compare-arrows" size={20} color="#ffffff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text style={[styles.blanksCardTitle, { color: '#ffffff', fontSize: 15 }]}>Match Column Builder</Text>
                                  <Text style={[styles.blanksCardSubtitle, { color: 'rgba(255,255,255,0.82)' }]}>Add left & right matching pairs below</Text>
                                </View>
                                <View style={[styles.blanksStepBadge, { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)' }]}>
                                  <Text style={[styles.blanksStepBadgeText, { color: '#ffffff' }]}>Step 2/4</Text>
                                </View>
                              </View>
                            </LinearGradient>
                          </View>

                          <View style={styles.matchContentContainer}>

                            {/* Input row - simple two column layout with clear labels */}
                            <View style={styles.matchInputRow}>
                              <View style={[styles.matchInputCol, { marginRight: 8 }]}>
                                <Text style={styles.matchInputLabel}>Left Item</Text>
                                <TextInput
                                  style={styles.matchTextInput}
                                  placeholder="e.g. Water"
                                  placeholderTextColor="#94A3B8"
                                  value={columnLeftText}
                                  onChangeText={setColumnLeftText}
                                />
                              </View>
                              <View style={styles.matchInputCol}>
                                <Text style={styles.matchInputLabel}>Right Match</Text>
                                <View style={styles.matchInputRightWrapper}>
                                  <TextInput
                                    style={[styles.matchTextInput, { paddingRight: 36 }]}
                                    placeholder="e.g. H₂O"
                                    placeholderTextColor="#94A3B8"
                                    value={columnRightText}
                                    onChangeText={setColumnRightText}
                                  />
                                  {(columnLeftText.length > 0 || columnRightText.length > 0) && (
                                    <TouchableOpacity 
                                      style={styles.clearMatchInputs}
                                      onPress={() => {
                                        setColumnLeftText('');
                                        setColumnRightText('');
                                      }}
                                    >
                                      <MaterialIcons name="close" size={16} color="#9CA3AF" />
                                    </TouchableOpacity>
                                  )}
                                </View>
                              </View>
                              
                              {/* ADD Button - Premium */}
                              <TouchableOpacity 
                                style={[styles.addPairBtn, { marginTop: 22 }]}
                                onPress={handleAddMatchPair}
                                activeOpacity={0.75}
                              >
                                <LinearGradient
                                  colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 0, y: 1 }}
                                  style={styles.addPairBtnGrad}
                                >
                                  <MaterialIcons name="add-circle" size={22} color="#ffffff" />
                                  <Text style={styles.addPairBtnText}>ADD</Text>
                                </LinearGradient>
                              </TouchableOpacity>
                            </View>

                            {/* Pairs Table */}
                            <View style={styles.pairsTableContainer}>
                              {/* Header */}
                              <View style={[styles.pairsTableHeader, { backgroundColor: '#2563EB' }]}>
                                <Text style={[styles.pairsTableHeaderText, { flex: 1.2, color: '#ffffff' }]}>Left Item</Text>
                                <Text style={[styles.pairsTableHeaderText, { flex: 1.2, color: '#ffffff' }]}>Right Match</Text>
                                <Text style={[styles.pairsTableHeaderText, { width: 44, textAlign: 'center', color: 'rgba(255,255,255,0.75)' }]}>Del</Text>
                              </View>

                              <ScrollView 
                                style={styles.pairsTableScroll}
                                contentContainerStyle={{ paddingBottom: 12 }}
                                nestedScrollEnabled={true}
                              >
                                {matchPairs.length === 0 ? (
                                  <View style={styles.emptyPairsState}>
                                    <MaterialIcons name="playlist-add" size={40} color="#BFDBFE" />
                                    <Text style={[styles.emptyPairsText, { fontSize: 14, color: '#94A3B8' }]}>No pairs added yet.</Text>
                                    <Text style={[styles.emptyPairsText, { fontSize: 13 }]}>Fill in Left & Right above, then tap ADD.</Text>
                                  </View>
                                ) : (
                                  matchPairs.map((pair, idx) => (
                                    <View key={pair.id} style={[styles.pairTableRow, idx % 2 === 1 && { backgroundColor: '#F0F9FF' }]}>
                                      <View style={{ flex: 1.2, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' }}>
                                          <Text style={{ fontSize: 10, fontWeight: '900', color: '#1D4ED8' }}>{idx + 1}</Text>
                                        </View>
                                        <Text style={styles.pairTableCell} numberOfLines={1}>{pair.left}</Text>
                                      </View>
                                      <View style={{ flex: 1.2, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                        <MaterialIcons name="arrow-forward" size={14} color="#93C5FD" />
                                        <Text style={[styles.pairTableCell, { color: '#1E40AF' }]} numberOfLines={1}>{pair.right}</Text>
                                      </View>
                                      <TouchableOpacity 
                                        style={[styles.pairDeleteCell, { width: 44 }]}
                                        onPress={() => handleRemoveMatchPair(pair.id)}
                                      >
                                        <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' }}>
                                          <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  ))
                                )}
                              </ScrollView>
                            </View>
                          </View>

                          {/* Step Footer Navigation - Match */}
                          <View style={styles.stepFooterButtons}>
                            <TouchableOpacity
                              style={[styles.stepFooterBtn, styles.stepFooterBtnPrev, { minWidth: 110 }]}
                              onPress={handleStepPrev}
                              activeOpacity={0.7}
                            >
                              <MaterialIcons name="arrow-back" size={16} color="#64748B" style={{ marginRight: 6 }} />
                              <Text style={styles.stepFooterTextPrev}>Previous</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.stepFooterBtn, styles.stepFooterBtnNext, { backgroundColor: '#2563EB' }]}
                              onPress={handleStepNext}
                              activeOpacity={0.8}
                            >
                              <LinearGradient
                                colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 }}
                              />
                              <Text style={styles.stepFooterTextNext}>Next → Select Theme</Text>
                              <MaterialIcons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    )}

                    {/* Step 1.75: Crossword / Clue Games Builder */}
                    {createStep === 'crossword' && (
                      <>
                        {/* Clue List at the top (if clues added) */}
                        {crosswordClues.length > 0 && (
                          <ScrollView style={{ maxHeight: 200, width: '100%', marginBottom: 16 }} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
                            {crosswordClues.map((c, idx) => {
                              const isOdd = idx % 2 === 1;
                              const cardBg = isOdd ? '#f0f9ff' : '#e0f2fe';
                              const borderColor = isOdd ? '#93c5fd' : '#7dd3fc';
                              const shadowColor = '#1d4ed8';
                              const badgeBg = '#2563eb';

                              return (
                                <View 
                                  key={c.id} 
                                  style={{ 
                                    flexDirection: 'row', 
                                    backgroundColor: cardBg, 
                                    borderRadius: 20, 
                                    padding: 14, 
                                    borderWidth: 2.5, 
                                    borderColor: borderColor, 
                                    alignItems: 'center', 
                                    shadowColor: shadowColor, 
                                    shadowOffset: { width: 0, height: 5 }, 
                                    shadowOpacity: 0.1, 
                                    shadowRadius: 8, 
                                    elevation: 3 
                                  }}
                                >
                                  {/* Bouncy Circular Badge */}
                                  <View style={{ 
                                    width: 44, 
                                    height: 44, 
                                    borderRadius: 22, 
                                    backgroundColor: badgeBg, 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    marginRight: 12, 
                                    borderWidth: 2.5, 
                                    borderColor: '#ffffff',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 3 },
                                    shadowOpacity: 0.15,
                                    shadowRadius: 4,
                                    elevation: 2
                                  }}>
                                    <Text style={{ fontSize: 16, fontWeight: '900', color: '#ffffff' }}>{idx + 1}</Text>
                                  </View>

                                  <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 15, color: '#1e3a8a', fontWeight: '900', marginBottom: 2 }}>
                                      {c.word}
                                    </Text>
                                    <Text style={{ fontSize: 13, color: '#475569', fontWeight: '700' }}>
                                      Clue: <Text style={{ color: '#1d4ed8', fontWeight: '800' }}>{c.clue}</Text>
                                    </Text>
                                  </View>

                                  {/* Premium 3D Red Delete Button */}
                                  <TouchableOpacity
                                    onPress={() => handleRemoveCrosswordClue(c.id)}
                                    style={{ 
                                      width: 38, 
                                      height: 38, 
                                      borderRadius: 12, 
                                      backgroundColor: '#EF4444', 
                                      alignItems: 'center', 
                                      justifyContent: 'center',
                                      borderBottomWidth: 3.5,
                                      borderBottomColor: '#B91C1C',
                                      shadowColor: '#EF4444',
                                      shadowOffset: { width: 0, height: 3 },
                                      shadowOpacity: 0.3,
                                      shadowRadius: 5,
                                      elevation: 3
                                    }}
                                    activeOpacity={0.8}
                                  >
                                    <MaterialIcons name="delete" size={18} color="#ffffff" />
                                  </TouchableOpacity>
                                </View>
                              );
                            })}
                          </ScrollView>
                        )}

                        {/* Clue Form Input Card - Glassmorphism Design */}
                        <View style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.78)',
                          borderRadius: 24,
                          borderWidth: 1.5,
                          borderColor: 'rgba(255, 255, 255, 0.7)',
                          shadowColor: '#2563eb',
                          shadowOffset: { width: 0, height: 10 },
                          shadowOpacity: 0.08,
                          shadowRadius: 20,
                          elevation: 4,
                          overflow: 'hidden'
                        }}>
                          {/* Card Header — Beautiful Neural theme matching Blanks */}
                          <View style={{ height: 54, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8, position: 'relative' }}>
                            <LinearGradient
                              colors={['#2563eb', '#1d4ed8']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={StyleSheet.absoluteFill}
                            />
                            {/* Glossy top reflection overlay */}
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, backgroundColor: 'rgba(255,255,255,0.4)' }} />
                            <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
                            <Text style={{ fontSize: 16, fontWeight: '900', color: '#ffffff', letterSpacing: 0.5 }}>Add new Clue</Text>
                          </View>

                          <View style={{ padding: 20, gap: 18 }}>
                            {/* Word Field */}
                            <View style={styles.formField}>
                              <Text style={{ color: '#1e3a8a', fontWeight: '900', fontSize: 13, marginBottom: 6, letterSpacing: 0.2 }}>Word (Max 10 letters)*</Text>
                              <TextInput
                                style={{
                                  borderRadius: 16,
                                  borderWidth: 1.5,
                                  borderColor: 'rgba(37, 99, 235, 0.25)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                  paddingHorizontal: 16,
                                  height: 52,
                                  fontSize: 14,
                                  fontWeight: '600',
                                  color: '#0f172a'
                                }}
                                placeholder="e.g. AHMAD"
                                placeholderTextColor="#94a3b8"
                                value={clueWord}
                                onChangeText={(text) => setClueWord(text.toUpperCase().replace(/[^A-Z]/g, ''))}
                                maxLength={10}
                                autoCapitalize="characters"
                              />
                            </View>

                            {/* Clue Type Field */}
                            <View style={styles.formField}>
                              <Text style={{ color: '#1e3a8a', fontWeight: '900', fontSize: 13, marginBottom: 6, letterSpacing: 0.2 }}>Clue Type*</Text>
                              <View style={{
                                justifyContent: 'center',
                                backgroundColor: 'rgba(241, 245, 249, 0.6)',
                                borderColor: 'rgba(191, 219, 254, 0.5)',
                                borderWidth: 1.5,
                                borderRadius: 16,
                                paddingHorizontal: 16,
                                height: 52
                              }}>
                                <Text style={{ color: '#475569', fontWeight: '900', fontSize: 14 }}>Text</Text>
                              </View>
                            </View>

                            {/* Clue Text Field */}
                            <View style={styles.formField}>
                              <Text style={{ color: '#1e3a8a', fontWeight: '900', fontSize: 13, marginBottom: 6, letterSpacing: 0.2 }}>Clue *</Text>
                              <TextInput
                                style={{
                                  borderRadius: 16,
                                  borderWidth: 1.5,
                                  borderColor: 'rgba(37, 99, 235, 0.25)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                  paddingHorizontal: 16,
                                  paddingTop: 12,
                                  height: 82,
                                  fontSize: 14,
                                  fontWeight: '600',
                                  color: '#0f172a'
                                }}
                                placeholder="Enter a Clue"
                                placeholderTextColor="#94a3b8"
                                value={clueText}
                                onChangeText={setClueText}
                                multiline
                                numberOfLines={2}
                              />
                            </View>

                            {/* ADD CLUE Button - Premium 3D Toy Button */}
                            <TouchableOpacity
                              style={{ 
                                height: 54, 
                                borderRadius: 18, 
                                backgroundColor: '#1d4ed8', 
                                borderBottomWidth: 5,
                                borderBottomColor: '#0f172a',
                                shadowColor: '#1d4ed8', 
                                shadowOffset: { width: 0, height: 6 }, 
                                shadowOpacity: 0.35, 
                                shadowRadius: 10, 
                                elevation: 5,
                                marginTop: 10
                              }}
                              onPress={handleAddCrosswordClue}
                              activeOpacity={0.9}
                            >
                              <LinearGradient
                                colors={['#3b82f6', '#2563eb']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 14 }}
                              >
                                <MaterialIcons name="add" size={22} color="#ffffff" style={{ fontWeight: '900' }} />
                                <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 }}>ADD CLUE</Text>
                              </LinearGradient>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Interactive Preview & Gameplay View */}
                        {crosswordClues.length >= 2 && (
                          <View style={{ width: '100%', marginTop: 18, marginBottom: 18 }}>
                            <TouchableOpacity
                              style={{ 
                                height: 56, 
                                borderRadius: 18, 
                                backgroundColor: '#1e3a8a', 
                                borderBottomWidth: 5,
                                borderBottomColor: '#0a1d37',
                                shadowColor: '#2563eb', 
                                shadowOffset: { width: 0, height: 8 }, 
                                shadowOpacity: 0.4, 
                                shadowRadius: 12, 
                                elevation: 6 
                              }}
                              onPress={() => {
                                playSound('click');
                                const success = handleCreateCrosswordAssignment();
                                if (success) {
                                  // Pre-fill the first 2 letters of each word as hints!
                                  const hints = initializeCrosswordHints(crosswordClues, crosswordGridData);
                                  setCrosswordAnswers(hints);
                                  
                                  setCrosswordPreviewActive(true);
                                  setCrosswordSplashActive(true);
                                  setActiveCell(null);
                                }
                              }}
                              activeOpacity={0.9}
                            >
                              <LinearGradient
                                colors={['#2563eb', '#1d4ed8', '#1e3a8a']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14 }}
                              >
                                <MaterialIcons name="videogame-asset" size={24} color="#ffffff" />
                                <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16, letterSpacing: 0.5 }}>Preview Clue Game</Text>
                              </LinearGradient>
                            </TouchableOpacity>
                          </View>
                        )}
                      </>
                    )}

                    {/* Step 2: DIAGRAM PARTS CREATOR */}
                    {createStep === 'partsCreator' && (
                      <View style={{ gap: 16, width: '100%' }}>
                        {/* 1. Instruction Card */}
                        <View style={{
                          backgroundColor: '#ffffff',
                          borderRadius: 20, padding: 18, borderWidth: 1.5,
                          borderColor: '#bfdbfe',
                          shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.06, shadowRadius: 10, elevation: 2
                        }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' }}>
                              <MaterialIcons name="image" size={22} color="#2563eb" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 18, fontWeight: '900', color: '#1e3a8a' }}>Label The Diagram</Text>
                              <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748b' }}>Step 2 of 3</Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#e11d48', lineHeight: 20, marginTop: 4 }}>
                            * Click "Choose File" to select a diagram template, then tap anywhere on the canvas below to place pinpoint dots and assign names.
                          </Text>
                        </View>

                        {/* 2. Choose File / Select Image Box */}
                        <View style={{
                          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                          backgroundColor: '#eff6ff', padding: 16, borderRadius: 20,
                          borderWidth: 1.5, borderColor: '#bfdbfe', elevation: 1
                        }}>
                          <View style={{ flex: 1, marginRight: 12 }}>
                            <Text style={{ fontSize: 15, fontWeight: '900', color: '#1e3a8a' }}>
                              Diagram Image File:
                            </Text>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#4b5563', marginTop: 4 }} numberOfLines={1}>
                              {partsImageName || "No file chosen"}
                            </Text>
                          </View>
                          
                          <TouchableOpacity
                            onPress={() => { playSound('click'); setShowImageSelectModal(true); }}
                            style={{
                              backgroundColor: '#2563eb',
                              paddingVertical: 10, paddingHorizontal: 20,
                              borderRadius: 14, borderWidth: 1.2, borderColor: '#60a5fa',
                              borderBottomWidth: 3.5, borderBottomColor: '#1d4ed8'
                            }}
                            activeOpacity={0.8}
                          >
                            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>Choose File</Text>
                          </TouchableOpacity>
                        </View>

                        {/* 3. Interactive Canvas */}
                        <View
                          onLayout={(e) => {
                            const { width, height } = e.nativeEvent.layout;
                            if (width && height) {
                              setCanvasLayout({ width, height });
                            }
                          }}
                          style={{
                            width: '100%', height: 300, position: 'relative'
                          }}
                        >
                          {!partsImage ? (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12, backgroundColor: '#f8fafc', borderWidth: 1.8, borderColor: '#cbd5e1', borderRadius: 24 }}>
                              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' }}>
                                <MaterialIcons name="image" size={32} color="#94a3b8" />
                              </View>
                              <Text style={{ color: '#64748b', fontWeight: '900', fontSize: 16, textAlign: 'center', lineHeight: 22, maxWidth: 280 }}>
                                Please Select an Image to Create Labels of Diagram
                              </Text>
                              <Text style={{ color: '#94a3b8', fontSize: 13, fontWeight: '600', textAlign: 'center', maxWidth: 240 }}>
                                Choose from face, skeleton, or plant cell templates to start.
                              </Text>
                            </View>
                          ) : (
                            <>
                              {/* Background Image Touchable ONLY for click coordination detection */}
                              <TouchableOpacity
                                activeOpacity={1}
                                onPress={handleCanvasClick}
                                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                              >
                                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24, overflow: 'hidden', backgroundColor: '#f8fafc', borderWidth: 1.8, borderColor: '#cbd5e1' }} pointerEvents="none">
                                  <DiagramRenderer name={partsImage} onImageAspectMeasured={(asp) => setPartsImageAspect(asp)} />
                                </View>
                              </TouchableOpacity>

                              {(() => {
                                const { dispL, dispT, dispW, dispH } = getImageDisplayRect(canvasLayout.width, canvasLayout.height, partsImageAspect);

                                const getScreenCoords = (pin: any) => {
                                  const normX = (pin.x ?? 50) / 100;
                                  const normY = (pin.y ?? 50) / 100;
                                  const dotPxX = dispL + normX * dispW;
                                  const dotPxY = dispT + normY * dispH;
                                  const displayX = (dotPxX / (canvasLayout.width || 400)) * 100;
                                  const displayY = (dotPxY / (canvasLayout.height || 300)) * 100;
                                  return { displayX, displayY };
                                };

                                const leftPins = (partsPinpoints || [])
                                  .filter((p: any) => getScreenCoords(p).displayX < 50);
                                const rightPins = (partsPinpoints || [])
                                  .filter((p: any) => getScreenCoords(p).displayX >= 50);

                                const resolveSpacing = (pins: any[]) => {
                                  const res: Record<string, number> = {};
                                  if (pins.length === 0) return res;
                                  const sorted = [...pins].sort((a, b) => getScreenCoords(a).displayY - getScreenCoords(b).displayY);
                                  const ys = sorted.map(p => Math.max(12, Math.min(88, getScreenCoords(p).displayY)));
                                  for (let pass = 0; pass < 12; pass++) {
                                    for (let i = 0; i < ys.length - 1; i++) {
                                      if (ys[i + 1] - ys[i] < 13) {
                                        const overlap = 13 - (ys[i + 1] - ys[i]);
                                        ys[i] = Math.max(12, ys[i] - overlap / 2);
                                        ys[i + 1] = Math.min(88, ys[i + 1] + overlap / 2);
                                      }
                                    }
                                  }
                                  sorted.forEach((pin, idx) => {
                                    res[pin.id] = ys[idx];
                                  });
                                  return res;
                                };
                                const spacedYMap: Record<string, number> = {
                                  ...resolveSpacing(leftPins),
                                  ...resolveSpacing(rightPins)
                                };

                                return (
                                  <>
                                    {/* Svg Connector Lines in Editor */}
                                    <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} pointerEvents="none">
                                      {partsPinpoints.map((pin) => {
                                        const { displayX, displayY } = getScreenCoords(pin);
                                        const spacedY = spacedYMap[pin.id] || displayY;
                                        const isLeft = displayX < 50;
                                        const boxLeftPct = isLeft ? Math.max(2, displayX - 22) : Math.min(78, displayX + 4);
                                        const lineTargetX = isLeft ? boxLeftPct + 20 : boxLeftPct;
                                        return (
                                          <Line
                                            key={pin.id}
                                            x1={`${displayX}%`}
                                            y1={`${displayY}%`}
                                            x2={`${lineTargetX}%`}
                                            y2={`${spacedY}%`}
                                            stroke="#ef4444"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                          />
                                        );
                                      })}
                                    </Svg>

                                    {partsPinpoints.map((pin) => {
                                      const { displayX, displayY } = getScreenCoords(pin);
                                      const spacedY = spacedYMap[pin.id] || displayY;
                                      const isLeft = displayX < 50;
                                      const boxLeftPct = isLeft ? Math.max(2, displayX - 22) : Math.min(78, displayX + 4);
                                      return (
                                        <React.Fragment key={pin.id}>
                                          {/* Upgraded Premium Dual-Layer Radar Anchor Dot */}
                                          <View
                                            style={{
                                              position: 'absolute',
                                              left: `${displayX}%`,
                                              top: `${displayY}%`,
                                              transform: [{ translateX: -8 }, { translateY: -8 }],
                                              width: 16,
                                              height: 16,
                                              borderRadius: 8,
                                              backgroundColor: 'rgba(239, 68, 68, 0.25)',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              zIndex: 10
                                            }}
                                          >
                                            <View
                                              style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: '#ef4444',
                                                borderWidth: 1.5,
                                                borderColor: '#ffffff',
                                                shadowColor: '#ef4444',
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: 0.4,
                                                shadowRadius: 2,
                                                elevation: 3
                                              }}
                                            />
                                          </View>

                                          {/* Preview Label Box floating adjacent to pinpoint */}
                                          <View
                                            style={{
                                              position: 'absolute',
                                              left: `${boxLeftPct}%`,
                                              width: '20%',
                                              top: `${spacedY}%`,
                                              transform: [{ translateY: -16 }],
                                              backgroundColor: '#ffffff',
                                              borderWidth: 1.5,
                                              borderColor: '#10b981',
                                              borderRadius: 10,
                                              paddingVertical: 4,
                                              paddingHorizontal: 6,
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              shadowColor: '#10b981',
                                              shadowOffset: { width: 0, height: 2 },
                                              shadowOpacity: 0.1,
                                              shadowRadius: 3,
                                              elevation: 2,
                                              zIndex: 15
                                            }}
                                          >
                                            <Text 
                                              style={{ 
                                                color: '#1e293b', 
                                                fontSize: 11, 
                                                fontWeight: '800',
                                                flex: 1,
                                                textAlign: 'center',
                                                marginRight: 2
                                              }}
                                              numberOfLines={1}
                                              adjustsFontSizeToFit
                                            >
                                              {pin.name}
                                            </Text>
                                            <TouchableOpacity
                                              onPress={() => {
                                                playSound('click');
                                                setPartsPinpoints(partsPinpoints.filter(p => p.id !== pin.id));
                                              }}
                                              style={{ padding: 1 }}
                                            >
                                              <MaterialIcons name="cancel" size={13} color="#ef4444" />
                                            </TouchableOpacity>
                                          </View>
                                        </React.Fragment>
                                      );
                                    })}
                                  </>
                                );
                              })()}
                            </>
                          )}
                        </View>

                        {/* 4. Stepper Buttons */}
                        <View style={styles.stepFooterButtons}>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnPrev, { minWidth: 110 }]}
                            onPress={handleStepPrev}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons name="arrow-back" size={16} color="#64748B" style={{ marginRight: 6 }} />
                            <Text style={styles.stepFooterTextPrev}>Previous</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnNext, { backgroundColor: '#2563EB' }]}
                            onPress={handleStepNext}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 }}
                            />
                            <Text style={styles.stepFooterTextNext}>Next</Text>
                            <MaterialIcons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}


                    {/* Step: TRUE/FALSE QUESTION CREATOR (ULTRA PREMIUM MODERN CARD UI) */}
                    {createStep === 'truefalse' && (
                      <View style={{ gap: 20, width: '100%' }}>
                        {/* Main Input Form Card */}
                        <View style={{
                          backgroundColor: '#ffffff',
                          borderRadius: 26,
                          overflow: 'hidden',
                          borderWidth: 1.8,
                          borderColor: '#E2E8F0',
                          shadowColor: '#2563EB',
                          shadowOffset: { width: 0, height: 8 },
                          shadowOpacity: 0.08,
                          shadowRadius: 16,
                          elevation: 4
                        }}>
                          {/* Top Gradient Accent Bar */}
                          <LinearGradient
                            colors={['#3B82F6', '#2563EB', '#6366F1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ height: 5, width: '100%' }}
                          />

                          <View style={{ padding: 20, gap: 16 }}>
                            {/* Card Section Header */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <View style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 10,
                                  backgroundColor: '#EFF6FF',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderWidth: 1,
                                  borderColor: '#BFDBFE'
                                }}>
                                  <MaterialIcons name="edit-note" size={20} color="#2563EB" />
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: '900', color: '#1E3A8A', letterSpacing: 0.5 }}>
                                  QUESTION STATEMENT
                                </Text>
                              </View>

                              <View style={{
                                paddingVertical: 4,
                                paddingHorizontal: 10,
                                borderRadius: 12,
                                backgroundColor: '#EFF6FF',
                                borderWidth: 1,
                                borderColor: '#BFDBFE'
                              }}>
                                <Text style={{ fontSize: 11, fontWeight: '900', color: '#2563EB' }}>
                                  Statement #{tfQuestions.length + 1}
                                </Text>
                              </View>
                            </View>

                            {/* Input Field Container */}
                            <View style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              backgroundColor: '#F8FAFC',
                              borderWidth: 1.8,
                              borderColor: '#CBD5E1',
                              borderRadius: 16,
                              paddingHorizontal: 14,
                              paddingVertical: 4
                            }}>
                              <MaterialIcons name="help-outline" size={20} color="#94A3B8" style={{ marginRight: 8 }} />
                              <TextInput
                                style={{
                                  flex: 1,
                                  paddingVertical: 10,
                                  fontSize: 15,
                                  color: '#0F172A',
                                  fontWeight: '700'
                                }}
                                placeholder="Enter statement e.g. Water boils at 100°C"
                                placeholderTextColor="#94A3B8"
                                value={tfQuestionInput}
                                onChangeText={setTfQuestionInput}
                              />
                            </View>

                            {/* Correct Answer Header */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                              <MaterialIcons name="task-alt" size={16} color="#475569" />
                              <Text style={{ fontSize: 12, fontWeight: '900', color: '#475569', letterSpacing: 0.5 }}>
                                SELECT CORRECT ANSWER
                              </Text>
                            </View>

                            {/* TRUE / FALSE Choice Buttons */}
                            <View style={{ flexDirection: 'row', gap: 14 }}>
                              {/* TRUE Choice Card */}
                              <TouchableOpacity
                                style={{
                                  flex: 1,
                                  borderRadius: 18,
                                  overflow: 'hidden',
                                  borderWidth: 2,
                                  borderColor: tfAnswerInput === 'true' ? '#10B981' : '#E2E8F0',
                                  backgroundColor: tfAnswerInput === 'true' ? '#ECFDF5' : '#F8FAFC',
                                  shadowColor: tfAnswerInput === 'true' ? '#10B981' : 'transparent',
                                  shadowOffset: { width: 0, height: 4 },
                                  shadowOpacity: 0.2,
                                  shadowRadius: 8,
                                  elevation: tfAnswerInput === 'true' ? 3 : 0
                                }}
                                onPress={() => setTfAnswerInput('true')}
                                activeOpacity={0.85}
                              >
                                <View style={{
                                  paddingVertical: 14,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  gap: 8
                                }}>
                                  <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: tfAnswerInput === 'true' ? '#10B981' : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <MaterialIcons
                                      name={tfAnswerInput === 'true' ? 'check' : 'radio-button-unchecked'}
                                      size={16}
                                      color={tfAnswerInput === 'true' ? '#ffffff' : '#64748B'}
                                    />
                                  </View>
                                  <Text style={{
                                    fontSize: 16,
                                    fontWeight: '900',
                                    color: tfAnswerInput === 'true' ? '#047857' : '#64748B',
                                    letterSpacing: 0.8
                                  }}>
                                    TRUE
                                  </Text>
                                </View>
                              </TouchableOpacity>

                              {/* FALSE Choice Card */}
                              <TouchableOpacity
                                style={{
                                  flex: 1,
                                  borderRadius: 18,
                                  overflow: 'hidden',
                                  borderWidth: 2,
                                  borderColor: tfAnswerInput === 'false' ? '#F43F5E' : '#E2E8F0',
                                  backgroundColor: tfAnswerInput === 'false' ? '#FFF1F2' : '#F8FAFC',
                                  shadowColor: tfAnswerInput === 'false' ? '#F43F5E' : 'transparent',
                                  shadowOffset: { width: 0, height: 4 },
                                  shadowOpacity: 0.2,
                                  shadowRadius: 8,
                                  elevation: tfAnswerInput === 'false' ? 3 : 0
                                }}
                                onPress={() => setTfAnswerInput('false')}
                                activeOpacity={0.85}
                              >
                                <View style={{
                                  paddingVertical: 14,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  gap: 8
                                }}>
                                  <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: tfAnswerInput === 'false' ? '#F43F5E' : 'transparent',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <MaterialIcons
                                      name={tfAnswerInput === 'false' ? 'close' : 'radio-button-unchecked'}
                                      size={16}
                                      color={tfAnswerInput === 'false' ? '#ffffff' : '#64748B'}
                                    />
                                  </View>
                                  <Text style={{
                                    fontSize: 16,
                                    fontWeight: '900',
                                    color: tfAnswerInput === 'false' ? '#BE123C' : '#64748B',
                                    letterSpacing: 0.8
                                  }}>
                                    FALSE
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            {/* + ADD QUESTION Button */}
                            <TouchableOpacity
                              style={{
                                borderRadius: 16,
                                overflow: 'hidden',
                                marginTop: 4,
                                shadowColor: '#2563EB',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.3,
                                shadowRadius: 10,
                                elevation: 4
                              }}
                              onPress={handleAddTfQuestion}
                              activeOpacity={0.85}
                            >
                              <LinearGradient
                                colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                  paddingVertical: 14,
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  gap: 10,
                                  borderBottomWidth: 4,
                                  borderBottomColor: '#1E40AF'
                                }}
                              >
                                <View style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: 13,
                                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <MaterialIcons name="add" size={18} color="#ffffff" />
                                </View>
                                <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16, letterSpacing: 0.8 }}>
                                  ADD QUESTION
                                </Text>
                              </LinearGradient>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* List of Added Questions */}
                        <View style={{ gap: 12 }}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <MaterialIcons name="format-list-bulleted" size={18} color="#1E293B" />
                              <Text style={{ fontSize: 15, fontWeight: '900', color: '#1E293B', letterSpacing: 0.3 }}>
                                Added Questions ({tfQuestions.length})
                              </Text>
                            </View>

                            {tfQuestions.length > 0 && (
                              <View style={{
                                paddingVertical: 4,
                                paddingHorizontal: 10,
                                borderRadius: 12,
                                backgroundColor: '#ECFDF5',
                                borderWidth: 1,
                                borderColor: '#A7F3D0',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 4
                              }}>
                                <MaterialIcons name="check-circle" size={12} color="#047857" />
                                <Text style={{ fontSize: 11, fontWeight: '900', color: '#047857' }}>
                                  Ready to generate
                                </Text>
                              </View>
                            )}
                          </View>

                          {tfQuestions.length === 0 ? (
                            <View style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: 22,
                              padding: 24,
                              borderWidth: 1.8,
                              borderColor: '#CBD5E1',
                              borderStyle: 'dashed',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                              shadowColor: '#64748B',
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.04,
                              shadowRadius: 8
                            }}>
                              <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: '#F1F5F9',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <MaterialIcons name="playlist-add" size={24} color="#64748B" />
                              </View>
                              <Text style={{ fontSize: 14, fontWeight: '900', color: '#334155' }}>No questions added yet</Text>
                              <Text style={{ fontSize: 12, fontWeight: '600', color: '#94A3B8', textAlign: 'center' }}>
                                Enter a statement above & select TRUE or FALSE to add questions.
                              </Text>
                            </View>
                          ) : (
                            <ScrollView style={{ maxHeight: 220 }} nestedScrollEnabled showsVerticalScrollIndicator>
                              <View style={{ gap: 12 }}>
                                {tfQuestions.map((q, idx) => (
                                  <View key={q.id} style={{
                                    backgroundColor: '#ffffff',
                                    borderRadius: 18,
                                    overflow: 'hidden',
                                    borderWidth: 1.6,
                                    borderColor: '#E2E8F0',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    shadowColor: '#64748B',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.06,
                                    shadowRadius: 8,
                                    elevation: 2
                                  }}>
                                    {/* Accent Color Left Edge Bar */}
                                    <View style={{
                                      width: 5,
                                      alignSelf: 'stretch',
                                      backgroundColor: q.answer === 'true' ? '#10B981' : '#F43F5E'
                                    }} />

                                    <View style={{ flex: 1, padding: 16, marginRight: 8 }}>
                                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                        <View style={{
                                          paddingVertical: 3,
                                          paddingHorizontal: 10,
                                          borderRadius: 10,
                                          backgroundColor: '#EFF6FF',
                                          borderWidth: 1,
                                          borderColor: '#BFDBFE'
                                        }}>
                                          <Text style={{ fontSize: 13, fontWeight: '900', color: '#2563EB' }}>Q{idx + 1}</Text>
                                        </View>
                                      </View>
                                      <Text style={{ fontSize: 17, fontWeight: '900', color: '#0F172A', lineHeight: 25 }}>
                                        {q.question}
                                      </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 16 }}>
                                      <View style={{
                                        paddingVertical: 7,
                                        paddingHorizontal: 14,
                                        borderRadius: 14,
                                        backgroundColor: q.answer === 'true' ? '#ECFDF5' : '#FFF1F2',
                                        borderWidth: 1.5,
                                        borderColor: q.answer === 'true' ? '#A7F3D0' : '#FECDD3',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 5
                                      }}>
                                        <MaterialIcons
                                          name={q.answer === 'true' ? 'check-circle' : 'cancel'}
                                          size={16}
                                          color={q.answer === 'true' ? '#047857' : '#BE123C'}
                                        />
                                        <Text style={{ fontSize: 13, fontWeight: '900', color: q.answer === 'true' ? '#047857' : '#BE123C', letterSpacing: 0.5 }}>
                                          {q.answer.toUpperCase()}
                                        </Text>
                                      </View>

                                      <TouchableOpacity
                                        onPress={() => handleRemoveTfQuestion(q.id)}
                                        style={{
                                          width: 38,
                                          height: 38,
                                          borderRadius: 19,
                                          backgroundColor: '#FFF1F2',
                                          borderWidth: 1.2,
                                          borderColor: '#FECDD3',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                        }}
                                        activeOpacity={0.8}
                                      >
                                        <MaterialIcons name="delete-outline" size={20} color="#F43F5E" />
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                ))}
                              </View>
                            </ScrollView>
                          )}
                        </View>

                        {/* Step Navigation Footer */}
                        <View style={styles.stepFooterButtons}>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnPrev, { minWidth: 110 }]}
                            onPress={handleStepPrev}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons name="arrow-back" size={16} color="#64748B" style={{ marginRight: 6 }} />
                            <Text style={styles.stepFooterTextPrev}>Previous</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnNext, { backgroundColor: '#10B981' }]}
                            onPress={handleStepNext}
                            activeOpacity={0.85}
                          >
                            <LinearGradient
                              colors={['#34D399', '#10B981', '#059669']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 }}
                            />
                            <Text style={styles.stepFooterTextNext}>Generate Output</Text>
                            <MaterialIcons name="flash-on" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}


                    {/* Step 4: DIAGRAM THEME SELECTOR */}
                    {createStep === 'partsTheme' && (
                      <View style={{ gap: 14, width: '100%' }}>
                        <View style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.85)',
                          borderRadius: 20, padding: 14, borderWidth: 1.5,
                          borderColor: 'rgba(255, 255, 255, 0.9)',
                          shadowColor: '#475569', shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
                          alignItems: 'center', marginBottom: 6
                        }}>
                          <Text style={{ fontSize: 15, fontWeight: '900', color: '#1e3a8a' }}>Select Diagram Theme Background</Text>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748b', marginTop: 2 }}>Step 3 of 3</Text>
                        </View>

                        <ScrollView 
                          contentContainerStyle={styles.themesGrid} 
                          nestedScrollEnabled={true} 
                          style={{ maxHeight: 240 }}
                        >
                          {themesList.map((url, index) => {
                            const isSelected = selectedThemeIndex === index;
                            return (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.themeCard,
                                  isSelected && styles.themeCardActive
                                ]}
                                onPress={() => setSelectedThemeIndex(index)}
                                activeOpacity={0.85}
                              >
                                <Image
                                  source={{ uri: url }}
                                  style={styles.themeImage}
                                  resizeMode="cover"
                                />
                                {isSelected && (
                                  <View style={styles.themeCheckBadge}>
                                    <MaterialIcons name="check" size={11} color="#ffffff" />
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>

                        {/* Stepper Buttons */}
                        <View style={styles.stepFooterButtons}>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnPrev, { minWidth: 110 }]}
                            onPress={handleStepPrev}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons name="arrow-back" size={16} color="#64748B" style={{ marginRight: 6 }} />
                            <Text style={styles.stepFooterTextPrev}>Previous</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnNext, { backgroundColor: '#059669' }]}
                            onPress={handleStepNext}
                            activeOpacity={0.85}
                          >
                            <LinearGradient
                              colors={['#34D399', '#10B981', '#059669']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 }}
                            />
                            <Text style={styles.stepFooterTextNext}>Generate Output</Text>
                            <MaterialIcons name="flash-on" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}


                    {/* Step 2: Custom Theme Grid Selection */}
                    {createStep === 'theme' && (
                      <View style={styles.themeStepContent}>
                        {/* Custom Image URL add row */}
                        <View style={styles.addThemeRow}>
                          <TextInput
                            style={styles.addThemeInput}
                            placeholder="Add from Link"
                            placeholderTextColor="#94A3B8"
                            value={customThemeUrl}
                            onChangeText={setCustomThemeUrl}
                          />
                          <TouchableOpacity
                            style={styles.addThemeButton}
                            onPress={handleAddCustomTheme}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.addThemeButtonText}>ADD</Text>
                          </TouchableOpacity>
                        </View>

                        {/* Premium Grid of Themes */}
                        <Text style={styles.themeSectionTitle}>Choose a Premium Theme</Text>
                        <ScrollView 
                          contentContainerStyle={styles.themesGrid} 
                          nestedScrollEnabled={true} 
                          style={{ maxHeight: 280 }}
                        >
                          {themesList.map((url, index) => {
                            const isSelected = selectedThemeIndex === index;
                            return (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.themeCard,
                                  isSelected && styles.themeCardActive
                                ]}
                                onPress={() => setSelectedThemeIndex(index)}
                                activeOpacity={0.85}
                              >
                                <Image
                                  source={{ uri: url }}
                                  style={styles.themeImage}
                                  resizeMode="cover"
                                />
                                {isSelected && (
                                  <View style={styles.themeCheckBadge}>
                                    <MaterialIcons name="check" size={11} color="#ffffff" />
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>

                        {/* Step Footer Navigation */}
                        <View style={styles.stepFooterButtons}>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnPrev, { minWidth: 110 }]}
                            onPress={handleStepPrev}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons name="arrow-back" size={16} color="#64748B" style={{ marginRight: 6 }} />
                            <Text style={styles.stepFooterTextPrev}>Previous</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnNext, { backgroundColor: '#2563EB' }]}
                            onPress={handleStepNext}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 }}
                            />
                            <Text style={styles.stepFooterTextNext}>Next</Text>
                            <MaterialIcons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 6 }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    {/* Step 3: Generate Output Screen */}
                    {createStep === 'generate' && (
                      <View style={styles.generateStepContent}>

                        {/* Premium minimal header row */}
                        <View style={styles.generateTopRow}>
                          {/* Left: Icon + Title */}
                          <View style={styles.generateTopLeft}>
                            <LinearGradient
                              colors={['#1E40AF', '#2563EB', '#3B82F6']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.generateTopIcon}
                            >
                              <MaterialIcons
                                name={formType === 'match' ? 'compare-arrows' : (formType === 'crosswords' || formType === 'cluegames') ? 'grid-on' : 'auto-awesome'}
                                size={20}
                                color="#ffffff"
                              />
                            </LinearGradient>
                            <View style={{ flex: 1, minWidth: 0 }}>
                              <Text style={styles.generateTopTitle} numberOfLines={1}>
                                {formType === 'match' ? 'Match Preview' : (formType === 'crosswords' || formType === 'cluegames') ? 'Crossword Preview' : 'Assignment Preview'}
                              </Text>
                              <Text style={styles.generateTopSub} numberOfLines={1}>
                                {formType === 'match' ? `${matchPairs.length} pairs ready` : (formType === 'crosswords' || formType === 'cluegames') ? `${crosswordClues.length} clues ready` : `${selectedBlankIndices.length} blanks selected`}
                              </Text>
                            </View>
                          </View>

                          {/* Right: Ready chip */}
                          <View style={[styles.generateReadyChip, { flexShrink: 0 }]}>
                            <View style={styles.generateReadyDot} />
                            <Text style={styles.generateReadyText}>READY</Text>
                          </View>
                        </View>

                        {/* Divider */}
                        <View style={styles.generateDivider} />

                        {/* Mini Preview Card */}
                        <View style={[styles.miniPreviewContainer, (formType === 'match' || formType === 'crosswords' || formType === 'cluegames') && { height: 340 }]}>
                          <ImageBackground
                            source={{ uri: themesList[selectedThemeIndex] }}
                            style={styles.miniPreviewBg}
                            resizeMode="cover"
                          >
                            <View style={styles.miniPreviewOverlay} />
                            
                            <View style={styles.miniPreviewHeader}>
                              <Text style={styles.miniPreviewTitle}>
                                {formTitle || (formType === 'match' ? 'Match the Following' : (formType === 'crosswords' || formType === 'cluegames') ? 'Crossword Game' : 'Fill in the Blanks')}
                              </Text>
                              <View style={styles.miniPreviewScoreBadge}>
                                <Text style={styles.miniPreviewScoreText}>
                                  SCORE : 0/{formType === 'match' ? matchPairs.length : (formType === 'crosswords' || formType === 'cluegames') ? crosswordClues.length : selectedBlankIndices.length}
                                </Text>
                              </View>
                            </View>

                            {(formType === 'crosswords' || formType === 'cluegames') ? (
                              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                <LinearGradient
                                  colors={['#8B5CF6', '#6D28D9']}
                                  start={{ x: 0, y: 0 }}
                                  end={{ x: 1, y: 1 }}
                                  style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#6D28D9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}
                                >
                                  <MaterialIcons name="grid-on" size={26} color="#ffffff" />
                                </LinearGradient>
                                <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16, letterSpacing: 0.3 }}>Crossword Puzzle Ready</Text>
                                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '700' }}>{crosswordClues.length} clues successfully added</Text>
                              </View>
                            ) : formType === 'match' ? (
                              <ScrollView 
                                style={{ flex: 1, maxHeight: 160, paddingHorizontal: 12, marginTop: 8 }}
                                contentContainerStyle={{ gap: 8, paddingBottom: 12 }}
                                nestedScrollEnabled={true}
                              >
                                {matchPairs.map((pair, idx) => (
                                  <View key={pair.id} style={styles.miniPreviewMatchRow}>
                                    <View style={styles.miniPreviewMatchLeftCard}>
                                      <Text style={styles.miniPreviewMatchCardText}>{pair.left}</Text>
                                    </View>
                                    <View style={styles.miniPreviewMatchLine} />
                                    <View style={styles.miniPreviewMatchRightCard}>
                                      <Text style={styles.miniPreviewMatchCardText}>{pair.right}</Text>
                                    </View>
                                  </View>
                                ))}
                              </ScrollView>
                            ) : (
                              <>
                                <View style={styles.miniPreviewParagraphCard}>
                                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                                    {(() => {
                                      const words = blanksText.split(/\s+/).filter(w => w.length > 0);
                                      return words.map((word, idx) => {
                                        const isBlank = selectedBlankIndices.includes(idx);
                                        if (!isBlank) {
                                          return (
                                            <Text key={idx} style={styles.miniPreviewWordText}>
                                              {word}{' '}
                                            </Text>
                                          );
                                        }
                                        return (
                                          <View key={idx} style={styles.miniPreviewBlankSlot}>
                                            <Text style={styles.miniPreviewBlankText}>          </Text>
                                          </View>
                                        );
                                      });
                                    })()}
                                  </View>
                                </View>

                                {/* Word chips preview */}
                                <View style={styles.miniPreviewOptionsGrid}>
                                  {selectedBlankIndices.map((idx, i) => {
                                    const words = blanksText.split(/\s+/).filter(w => w.length > 0);
                                    return (
                                      <View key={i} style={styles.miniPreviewOptionPill}>
                                        <Text style={styles.miniPreviewOptionText}>{words[idx]}</Text>
                                      </View>
                                    );
                                  })}
                                </View>
                              </>
                            )}
                          </ImageBackground>
                        </View>

                        <View style={styles.stepFooterButtons}>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnPrev, { minWidth: 110, flex: 0 }]}
                            onPress={handleStepPrev}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons name="arrow-back" size={16} color="#64748B" style={{ marginRight: 6 }} />
                            <Text style={styles.stepFooterTextPrev}>Previous</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.stepFooterBtn, styles.stepFooterBtnNext, { flex: 1, backgroundColor: formType === 'match' ? '#1D4ED8' : '#059669', paddingHorizontal: 8 }]}
                            onPress={handleCreateAssignment}
                            activeOpacity={0.85}
                          >
                            <LinearGradient
                              colors={formType === 'match' ? ['#3B82F6', '#2563EB', '#1D4ED8'] : ['#34D399', '#10B981', '#059669']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 14 }}
                            />
                            <MaterialIcons name={formType === 'match' ? 'bolt' : 'flash-on'} size={17} color="#ffffff" style={{ marginRight: 4 }} />
                            <Text style={[styles.stepFooterTextNext, { fontSize: 12.5 }]} numberOfLines={1}>
                              {formType === 'match' ? 'Generate & Play' : 'Generate Output'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </>
                )}

              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
<Modal
        visible={crosswordPreviewActive}
        animationType="slide"
        transparent={false}
        statusBarTranslucent
        onRequestClose={() => setCrosswordPreviewActive(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f9ff' }} edges={['top', 'bottom']}>

          {/* ── HEADER BAR ── */}
          <LinearGradient
            colors={['#e0f2fe', '#f0f9ff']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{
              height: 62, flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', paddingHorizontal: 14,
              borderBottomWidth: 1.5, borderBottomColor: '#bae6fd',
              elevation: 3, shadowColor: '#93c5fd', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15, shadowRadius: 6
            }}
          >
            {/* Left: Home + Volume */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TouchableOpacity
                onPress={() => { playSound('click'); setCrosswordPreviewActive(false); }}
                style={{
                  width: 42, height: 42, borderRadius: 21,
                  backgroundColor: '#ffffff',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 1.5, borderColor: '#bae6fd',
                  borderBottomWidth: 3.5, borderBottomColor: '#93c5fd'
                }}
                activeOpacity={0.8}
              >
                <MaterialIcons name="home" size={22} color="#0284c7" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsSoundMuted(!isSoundMuted)}
                style={{
                  width: 42, height: 42, borderRadius: 21,
                  backgroundColor: '#ffffff',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 1.5, borderColor: '#bae6fd',
                  borderBottomWidth: 3.5, borderBottomColor: '#93c5fd'
                }}
                activeOpacity={0.8}
              >
                <MaterialIcons name={isSoundMuted ? 'volume-off' : 'volume-up'} size={20} color="#0284c7" />
              </TouchableOpacity>
            </View>

            {/* Center Title */}
            <Text style={{
              fontSize: 20, fontWeight: '900', color: '#0369a1', letterSpacing: 2,
              textShadowColor: 'rgba(59, 130, 246, 0.15)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4
            }}>
              CROSSWORD
            </Text>

            {/* Right: Words Left + Reveal */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{
                backgroundColor: '#fef3c7', borderRadius: 14,
                paddingHorizontal: 10, paddingVertical: 5,
                borderWidth: 1.5, borderColor: '#fde68a',
                borderBottomWidth: 3.5, borderBottomColor: '#f59e0b'
              }}>
                <Text style={{ color: '#b45309', fontWeight: '900', fontSize: 12 }}>
                  {(() => {
                    const total = crosswordGridData.cellCoords.length;
                    const solved = crosswordGridData.cellCoords.filter(c => crosswordAnswers[`${c.row},${c.col}`] === c.char).length;
                    return solved === total ? '✓ Done!' : `${total - solved} left`;
                  })()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  playSound('click');
                  const unsolved = crosswordGridData.cellCoords.filter(c => crosswordAnswers[`${c.row},${c.col}`] !== c.char);
                  if (unsolved.length > 0) {
                    const pick = unsolved[Math.floor(Math.random() * unsolved.length)];
                    setCrosswordAnswers(prev => ({ ...prev, [`${pick.row},${pick.col}`]: pick.char }));
                  }
                }}
                style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  backgroundColor: '#e0f7fa', borderRadius: 14,
                  paddingHorizontal: 10, paddingVertical: 7,
                  borderWidth: 1.5, borderColor: '#b2ebf2',
                  borderBottomWidth: 3.5, borderBottomColor: '#80deea',
                  elevation: 2
                }}
                activeOpacity={0.8}
              >
                <MaterialIcons name="lightbulb-outline" size={15} color="#00838f" />
                <Text style={{ color: '#00838f', fontWeight: '900', fontSize: 12 }}>Reveal</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* ── SPLASH SCREEN ── */}
          {crosswordSplashActive ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <LinearGradient colors={['#e0f2fe', '#f0f9ff', '#dbeafe']} style={StyleSheet.absoluteFill} />

              {/* decorative blobs */}
              <View style={{ position: 'absolute', top: '5%', right: '8%', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(37,99,235,0.04)' }} />
              <View style={{ position: 'absolute', bottom: '10%', left: '5%', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(37,99,235,0.03)' }} />
              <View style={{ position: 'absolute', top: '40%', left: '20%', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(37,99,235,0.03)' }} />

              {/* Star decorations */}
              <Text style={{ position: 'absolute', top: '14%', left: '10%', fontSize: 32, opacity: 0.4 }}>⭐</Text>
              <Text style={{ position: 'absolute', top: '18%', right: '12%', fontSize: 24, opacity: 0.3 }}>✨</Text>
              <Text style={{ position: 'absolute', bottom: '22%', right: '15%', fontSize: 28, opacity: 0.3 }}>🌟</Text>

              {/* Logo Box */}
              <View style={{
                width: 150, height: 150, borderRadius: 40,
                backgroundColor: '#ffffff',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: 1.5, borderColor: '#bae6fd',
                borderBottomWidth: 6, borderBottomColor: '#93c5fd',
                shadowColor: '#2563eb', shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
                marginBottom: 36
              }}>
                <Text style={{ fontSize: 72 }}>🔤</Text>
              </View>

              <Text style={{
                fontSize: 36, fontWeight: '900', color: '#0369a1',
                letterSpacing: 1.5, textAlign: 'center', marginBottom: 12,
                textShadowColor: 'rgba(59, 130, 246, 0.15)',
                textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 8
              }}>
                Crossword{'\n'}Adventure!
              </Text>

              <Text style={{
                fontSize: 16, color: '#0284c7', fontWeight: '700',
                textAlign: 'center', marginBottom: 52,
                paddingHorizontal: 36, lineHeight: 24
              }}>
                Solve the clues and fill the puzzle grid! 🎯
              </Text>

              {/* 3D Play Button */}
              <TouchableOpacity
                onPress={() => { playSound('click'); setCrosswordSplashActive(false); }}
                style={{
                  height: 66, width: 250, borderRadius: 22,
                  backgroundColor: '#10b981',
                  borderBottomWidth: 6, borderBottomColor: '#047857',
                  shadowColor: '#10b981', shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.25, shadowRadius: 18, elevation: 6
                }}
                activeOpacity={0.88}
              >
                <LinearGradient
                  colors={['#34d399', '#10b981']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderRadius: 16 }}
                >
                  <MaterialIcons name="play-arrow" size={34} color="#ffffff" />
                  <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 22, letterSpacing: 1.5 }}>PLAY GAME</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          ) : (
            /* ── GAMEPLAY BOARD (Portrait Layout) ── */
            <View style={{ flex: 1 }}>
              <LinearGradient colors={['#f0f9ff', '#e0f2fe', '#dbeafe']} style={StyleSheet.absoluteFill} />
              
              {/* Premium Background Graphics */}
              <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                  <Defs>
                    <SvgLinearGradient id="gameGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <Stop offset="0%" stopColor="#93c5fd" stopOpacity={0.12} />
                      <Stop offset="100%" stopColor="#e0f2fe" stopOpacity={0.01} />
                    </SvgLinearGradient>
                  </Defs>
                  <Circle cx="85%" cy="20%" r="120" fill="url(#gameGlow)" />
                  <Circle cx="15%" cy="60%" r="150" fill="url(#gameGlow)" />
                  <Circle cx="80%" cy="85%" r="100" fill="url(#gameGlow)" />
                  
                  {/* Floating abstract decorative graphics */}
                  <Circle cx="25%" cy="35%" r="6" fill="#3b82f6" opacity={0.15} />
                  <Circle cx="75%" cy="50%" r="8" fill="#3b82f6" opacity={0.12} />
                  <Circle cx="30%" cy="75%" r="5" fill="#f59e0b" opacity={0.15} />
                  
                  {/* Soft mathematical grid pattern watermark */}
                  <Path d="M0,100 L500,100 M0,200 L500,200 M0,300 L500,300 M0,400 L500,400 M0,500 L500,500 M0,600 L500,600 M0,700 L500,700" stroke="rgba(37, 99, 235, 0.04)" strokeWidth={1} />
                  <Path d="M100,0 L100,1000 M200,0 L200,1000 M300,0 L300,1000 M400,0 L400,1000" stroke="rgba(37, 99, 235, 0.04)" strokeWidth={1} />
                </Svg>
              </View>

              {/* Clue Panel (top strip) */}
              {(() => {
                const total = crosswordGridData.cellCoords.length;
                const solved = crosswordGridData.cellCoords.filter(c => crosswordAnswers[`${c.row},${c.col}`] === c.char).length;
                const isWon = total > 0 && solved === total;
                let clueText = 'Tap a cell to read its clue! 👆';
                if (activeCell) {
                  const cell = crosswordGridData.grid[activeCell.row]?.[activeCell.col];
                  if (cell) {
                    const clueObj = crosswordClues[cell.wordIndex];
                    if (clueObj) clueText = clueObj.clue;
                  }
                }
                return (
                  <View style={{
                    marginHorizontal: 14, marginTop: 14, marginBottom: 10,
                    borderRadius: 20, overflow: 'hidden',
                    borderWidth: 1.5, borderColor: isWon ? '#a5d6a7' : '#bae6fd',
                    borderBottomWidth: 4, borderBottomColor: isWon ? '#81c784' : '#93c5fd',
                    elevation: 3, shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.06, shadowRadius: 8
                  }}>
                    <LinearGradient
                      colors={isWon ? ['#e8f5e9', '#c8e6c9'] : ['#eff6ff', '#e0f2fe']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}
                    >
                      <View style={{
                        width: 40, height: 40, borderRadius: 20,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Text style={{ fontSize: 22 }}>{isWon ? '🏆' : '💡'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: '#0284c7', fontWeight: '900', marginBottom: 2 }}>
                          {isWon ? 'PUZZLE COMPLETE!' : 'CLUE'}
                        </Text>
                        <Text style={{ fontSize: 15, fontWeight: '900', color: '#1e293b', lineHeight: 20 }} numberOfLines={2}>
                          {isWon ? '🎉 Amazing! You solved the crossword!' : clueText}
                        </Text>
                      </View>
                    </LinearGradient>
                  </View>
                );
              })()}

              {/* ── 9×9 CROSSWORD GRID ── Full Width, portrait */}
              <View style={{
                marginHorizontal: 14,
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.72)',
                borderRadius: 24, padding: 12,
                borderWidth: 1.5, borderColor: '#bae6fd',
                borderBottomWidth: 5, borderBottomColor: '#93c5fd',
                elevation: 4, shadowColor: '#2563eb',
                shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16
              }}>
                {crosswordGridData.grid.map((rowArr, rIdx) => (
                  <View key={rIdx} style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
                    {rowArr.map((cell, cIdx) => {
                      if (!cell) {
                        return (
                          <View key={cIdx} style={{
                            flex: 1,
                            backgroundColor: 'rgba(59, 130, 246, 0.05)',
                            borderRadius: 7,
                            margin: 2
                          }} />
                        );
                      }
                      const val = crosswordAnswers[`${rIdx},${cIdx}`] || '';
                      const isSelected = activeCell?.row === rIdx && activeCell?.col === cIdx;
                      const total = crosswordGridData.cellCoords.length;
                      const solved = crosswordGridData.cellCoords.filter(c => crosswordAnswers[`${c.row},${c.col}`] === c.char).length;
                      const isWon = total > 0 && solved === total;
                      const isCorrect = val !== '' && val === cell.char;
                      const activeCellWordIndex = activeCell ? crosswordGridData.grid[activeCell.row]?.[activeCell.col]?.wordIndex : -1;
                      const isActiveWordCell = activeCellWordIndex !== -1 && cell.wordIndex === activeCellWordIndex;

                      const WORD_COLORS = [
                        { bg: '#f0fdf4', border: '#bbf7d0', borderBottom: '#22c55e', text: '#15803d' }, // bright pastel green
                        { bg: '#faf5ff', border: '#e9d5ff', borderBottom: '#a855f7', text: '#7e22ce' }, // bright pastel purple
                        { bg: '#fff7ed', border: '#ffedd5', borderBottom: '#f97316', text: '#c2410c' }, // bright pastel orange
                        { bg: '#fdf2f8', border: '#fce7f3', borderBottom: '#ec4899', text: '#be185d' }, // bright pastel pink
                        { bg: '#ecfeff', border: '#cffafe', borderBottom: '#06b6d4', text: '#0e7490' }, // bright pastel cyan
                        { bg: '#eff6ff', border: '#dbeafe', borderBottom: '#3b82f6', text: '#1d4ed8' }, // bright pastel blue
                      ];

                      // Base cell style
                      const cellStyle: any = {
                        flex: 1, margin: 2,
                        backgroundColor: '#ffffff',
                        borderRadius: 10,
                        alignItems: 'center', justifyContent: 'center',
                        borderWidth: 1.5, borderColor: '#e2e8f0',
                        borderBottomWidth: 3.5, borderBottomColor: '#cbd5e1',
                        elevation: 1.5
                      };

                      const textStyle: any = {
                        fontSize: 19,
                        fontWeight: '900',
                        color: '#0f172a'
                      };

                      if (isWon) {
                        cellStyle.backgroundColor = '#10b981';
                        cellStyle.borderColor = '#059669';
                        cellStyle.borderBottomColor = '#047857';
                        textStyle.color = '#ffffff';
                      } else if (isCorrect) {
                        // Apply signature candy color theme per word index
                        const colorTheme = WORD_COLORS[cell.wordIndex % WORD_COLORS.length];
                        cellStyle.backgroundColor = colorTheme.bg;
                        cellStyle.borderColor = colorTheme.border;
                        cellStyle.borderBottomColor = colorTheme.borderBottom;
                        textStyle.color = colorTheme.text;
                      } else if (val !== '') {
                        cellStyle.backgroundColor = '#fef2f2';
                        cellStyle.borderColor = '#fca5a5';
                        cellStyle.borderBottomColor = '#ef4444';
                        textStyle.color = '#ef4444';
                      } else if (isActiveWordCell) {
                        if (isSelected) {
                          cellStyle.backgroundColor = '#fef08a';
                          cellStyle.borderColor = '#f59e0b';
                          cellStyle.borderBottomColor = '#d97706';
                          cellStyle.borderBottomWidth = 4.5;
                        } else {
                          cellStyle.backgroundColor = '#fffbeb';
                          cellStyle.borderColor = '#fef08a';
                          cellStyle.borderBottomColor = '#eab308';
                        }
                      } else if (isSelected) {
                        cellStyle.backgroundColor = '#fef08a';
                        cellStyle.borderColor = '#f59e0b';
                        cellStyle.borderBottomColor = '#d97706';
                      }

                      return (
                        <TouchableOpacity
                          key={cIdx}
                          onPress={() => { playSound('click'); setActiveCell({ row: rIdx, col: cIdx }); }}
                          style={cellStyle}
                          activeOpacity={0.75}
                        >
                          <Text style={textStyle}>
                            {crosswordLanguage === 'UR'
                              ? (val ? (EN_TO_UR_MAP[val] || val) : '')
                              : val}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>

              {/* ── KEYBOARD ── */}
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.45)', // Premium translucent glassmorphism backdrop
                marginHorizontal: 16, marginTop: 12, marginBottom: 16,
                borderRadius: 24, paddingVertical: 16, paddingHorizontal: 12,
                borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.65)',
                borderBottomWidth: 4, borderBottomColor: 'rgba(15, 23, 42, 0.08)',
                shadowColor: '#475569',
                shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.06, shadowRadius: 20,
                elevation: 4
              }}>
                {/* Keyboard Header Hint */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#64748b', letterSpacing: 1.5 }}>
                    VIRTUAL KEYBOARD
                  </Text>
                </View>

                {/* Keys Row */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
                  {(() => {
                    const keys = crosswordLanguage === 'UR'
                      ? ['ا','ب','پ','ت','ٹ','ث','ج','چ','ح','خ','د','ڈ','ذ','ر','ڑ','ز','ژ','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ک','گ','ل','م','ن','و','ہ','ء','ی']
                      : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

                    // Premium, elegant black & white mechanical themes
                    const MONO_THEME = {
                      bg: 'rgba(255, 255, 255, 0.95)',
                      innerBorder: 'rgba(255, 255, 255, 0.95)',
                      bottom: '#64748b', // Elegant slate-gray tactile bezel bottom
                      text: '#0f172a'    // Crisp dark slate/black lettering
                    };

                    return keys.map((keyChar) => {
                      let actualChar = keyChar;
                      if (crosswordLanguage === 'UR') {
                        const matched = Object.keys(EN_TO_UR_MAP).find(k => EN_TO_UR_MAP[k] === keyChar);
                        actualChar = matched || 'A';
                      }

                      return (
                        <TouchableOpacity
                          key={keyChar}
                          onPress={() => {
                            playSound('click');
                            if (activeCell) {
                              setCrosswordAnswers(prev => {
                                const next = { ...prev, [`${activeCell.row},${activeCell.col}`]: actualChar };
                                const cell = crosswordGridData.grid[activeCell.row][activeCell.col];
                                if (cell) {
                                  const nextCoord = crosswordGridData.cellCoords.find(c => c.wordIndex === cell.wordIndex && c.charIndex === cell.charIndex + 1);
                                  if (nextCoord) setActiveCell({ row: nextCoord.row, col: nextCoord.col });
                                }
                                const total = crosswordGridData.cellCoords.length;
                                const solved = crosswordGridData.cellCoords.filter(c => next[`${c.row},${c.col}`] === c.char).length;
                                if (solved === total) playSound('win');
                                return next;
                              });
                            }
                          }}
                          style={{
                            width: '10.8%', aspectRatio: 1, borderRadius: 12,
                            backgroundColor: MONO_THEME.bg,
                            alignItems: 'center', justifyContent: 'center',
                            borderWidth: 1.2, borderColor: 'rgba(203, 213, 225, 0.4)',
                            borderBottomWidth: 3.5, borderBottomColor: MONO_THEME.bottom,
                            elevation: 2,
                            shadowColor: '#475569', shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.05, shadowRadius: 3
                          }}
                          activeOpacity={0.6}
                        >
                          {/* Inner Bevel Details Inset Frame */}
                          <View style={{
                            flex: 1, width: '100%', height: '100%',
                            borderRadius: 10,
                            borderWidth: 1, borderColor: MONO_THEME.innerBorder,
                            alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Text style={{ fontSize: 16, fontWeight: '800', color: MONO_THEME.text }}>{keyChar}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    });
                  })()}

                  {/* Backspace */}
                  <TouchableOpacity
                    onPress={() => {
                      playSound('click');
                      if (activeCell) {
                        setCrosswordAnswers(prev => {
                          const next = { ...prev };
                          delete next[`${activeCell.row},${activeCell.col}`];
                          const cell = crosswordGridData.grid[activeCell.row][activeCell.col];
                          if (cell) {
                            const prevCoord = crosswordGridData.cellCoords.find(c => c.wordIndex === cell.wordIndex && c.charIndex === cell.charIndex - 1);
                            if (prevCoord) setActiveCell({ row: prevCoord.row, col: prevCoord.col });
                          }
                          return next;
                        });
                      }
                    }}
                    style={{
                      width: '10.8%', aspectRatio: 1, borderRadius: 12,
                      backgroundColor: 'rgba(241, 245, 249, 0.95)', // Slate-white backspace keycap
                      alignItems: 'center', justifyContent: 'center',
                      borderWidth: 1.2, borderColor: 'rgba(203, 213, 225, 0.4)',
                      borderBottomWidth: 3.5, borderBottomColor: '#475569',
                      elevation: 2,
                      shadowColor: '#475569', shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05, shadowRadius: 3
                    }}
                    activeOpacity={0.6}
                  >
                    <View style={{
                      flex: 1, width: '100%', height: '100%',
                      borderRadius: 10,
                      borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.95)',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <MaterialIcons name="backspace" size={18} color="#334155" />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Globe Language Button */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 14 }}>
                  <TouchableOpacity
                    onPress={() => { playSound('click'); setCrosswordLanguage(crosswordLanguage === 'EN' ? 'UR' : 'EN'); }}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                      height: 38, paddingHorizontal: 20, borderRadius: 14,
                      backgroundColor: 'rgba(255, 255, 255, 0.85)',
                      borderWidth: 1.2, borderColor: 'rgba(203, 213, 225, 0.5)',
                      borderBottomWidth: 3.5, borderBottomColor: '#475569',
                      shadowColor: '#475569', shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06, shadowRadius: 4,
                      elevation: 2
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="public" size={18} color="#334155" />
                    <Text style={{ color: '#334155', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.5 }}>
                      {crosswordLanguage === 'EN' ? 'اردو کی بورڈ' : 'English Keyboard'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* ═══ INTERACTIVE BLANKS PLAYER MODAL ═══ */}
      <Modal
        visible={activeBlanksPlayer !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setActiveBlanksPlayer(null)}
      >
        {activeBlanksPlayer && (
          <ImageBackground
            source={{ uri: activeBlanksPlayer.themeUrl }}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            {/* Soft dark tinted overlay for maximum text contrast */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.45)' }} />

            <SafeAreaView style={styles.playerContainer} edges={['top', 'bottom']}>
              {/* Header Bar */}
              <View style={styles.playerHeaderBar}>
                <TouchableOpacity
                  style={styles.playerExitBtn}
                  onPress={() => setActiveBlanksPlayer(null)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="close" size={20} color="#0F172A" />
                </TouchableOpacity>
                
                <Text style={styles.playerHeaderTitle}>Fill in the Blanks</Text>
                
                <View style={styles.playerScoreBadge}>
                  <Text style={styles.playerScoreBadgeLabel}>SCORE : {playerScore}</Text>
                </View>
              </View>

              <ScrollView style={styles.playerScroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
                {/* Settings Panel */}
                <View style={styles.playerSettingsPanel}>
                  {/* Slider sizing */}
                  <View style={styles.playerSizer}>
                    <Text style={styles.playerSettingsText}>Text size ({playerFontSize}px)</Text>
                    <View style={styles.customSizerTrack}>
                      <View style={styles.customSizerLine} />
                      {[12, 14, 16, 18, 20, 22, 24].map((size) => {
                        const isCurrent = playerFontSize === size;
                        return (
                          <TouchableOpacity
                            key={size}
                            style={[
                              styles.sizerDot,
                              isCurrent && styles.sizerDotActive
                            ]}
                            onPress={() => setPlayerFontSize(size)}
                            activeOpacity={0.7}
                          >
                            <View style={[
                              styles.sizerDotInner,
                              isCurrent && styles.sizerDotInnerActive
                            ]} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <View style={styles.playerSettingsDivider} />

                  {/* Font dropdown selection */}
                  <View style={styles.playerFontSelector}>
                    <Text style={styles.playerSettingsText}>Font</Text>
                    <TouchableOpacity
                      style={styles.playerFontDropdown}
                      onPress={() => {
                        const fonts = ['System', 'serif', 'monospace'];
                        const idx = fonts.indexOf(playerFontFamily);
                        setPlayerFontFamily(fonts[(idx + 1) % fonts.length]);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.playerFontDropdownText}>
                        {playerFontFamily === 'System' ? 'Arial' : playerFontFamily}
                      </Text>
                      <MaterialIcons name="keyboard-arrow-down" size={16} color="#475569" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Instructions Bar */}
                <View style={styles.playerInstructionsBar}>
                  <View style={styles.playerInstructionIconBox}>
                    <MaterialIcons name="assignment" size={16} color="#2563EB" />
                  </View>
                  <Text style={styles.playerInstructionsText}>
                    Instructions: Tap a word at the bottom, then tap any dashed blank slot to complete the paragraph, then click Submit.
                  </Text>
                </View>

                {/* Main Paragraph Panel */}
                <View style={styles.playerMainCard}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                    {activeBlanksPlayer.originalWords.map((word: string, idx: number) => {
                      const isBlank = activeBlanksPlayer.blankIndices.includes(idx);
                      if (!isBlank) {
                        return (
                          <Text
                            key={idx}
                            style={[
                              styles.playerParagraphText,
                              { fontSize: playerFontSize, fontFamily: playerFontFamily }
                            ]}
                          >
                            {word}{' '}
                          </Text>
                        );
                      }

                      // It is a blank slot
                      const filledText = userAnswers[idx];
                      const words = activeBlanksPlayer.originalWords || [];
                      const correctAnswer = words[idx] || '';
                      const isCorrect = filledText && filledText.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

                      return (
                        <TouchableOpacity
                          key={idx}
                          disabled={isPlayerSubmitted}
                          style={[
                            styles.playerBlankSlot,
                            filledText ? styles.playerBlankSlotFilled : styles.playerBlankSlotEmpty,
                            isPlayerSubmitted && (isCorrect ? styles.playerBlankSlotCorrect : styles.playerBlankSlotIncorrect),
                            selectedOption && !filledText && styles.playerBlankSlotActive
                          ]}
                          onPress={() => {
                            if (selectedOption) {
                              setUserAnswers({ ...userAnswers, [idx]: selectedOption });
                              setSelectedOption(null);
                            } else if (filledText) {
                              const newAns = { ...userAnswers };
                              delete newAns[idx];
                              setUserAnswers(newAns);
                            }
                          }}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.playerBlankSlotText,
                              filledText ? styles.playerBlankSlotTextFilled : styles.playerBlankSlotTextEmpty,
                              isPlayerSubmitted && styles.playerBlankSlotTextSubmitted,
                              { fontSize: playerFontSize, fontFamily: playerFontFamily }
                            ]}
                            numberOfLines={1}
                          >
                            {filledText || '          '}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Selectable Word Options */}
                <Text style={styles.playerOptionsTitle}>Word Options</Text>
                <View style={styles.playerOptionsGrid}>
                  {activeBlanksPlayer.correctAnswers.map((opt: string, i: number) => {
                    const isUsed = Object.values(userAnswers).includes(opt);
                    const isSelected = selectedOption === opt;
                    return (
                      <TouchableOpacity
                        key={i}
                        disabled={isUsed || isPlayerSubmitted}
                        style={[
                          styles.playerOptionPill,
                          isSelected && styles.playerOptionPillSelected,
                          isUsed && styles.playerOptionPillUsed
                        ]}
                        onPress={() => {
                          setSelectedOption(isSelected ? null : opt);
                        }}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.playerOptionPillText,
                            isSelected && styles.playerOptionPillTextSelected,
                            isUsed && styles.playerOptionPillTextUsed
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Primary Submit Button */}
                <TouchableOpacity
                  style={styles.playerSubmitBtn}
                  onPress={() => {
                    if (isPlayerSubmitted) {
                      // Reset player
                      setUserAnswers({});
                      setSelectedOption(null);
                      setIsPlayerSubmitted(false);
                      setPlayerScore(`0/${activeBlanksPlayer.blankIndices.length}`);
                      setShowSuccessUpload(false);
                    } else {
                      // Submit answers
                      const correctCount = activeBlanksPlayer.blankIndices.reduce((acc: number, idx: number, i: number) => {
                        const ans = userAnswers[idx];
                        const words = activeBlanksPlayer.originalWords || [];
                        const correct = words[idx] || '';
                        return ans && ans.trim().toLowerCase() === correct.trim().toLowerCase() ? acc + 1 : acc;
                      }, 0);
                      setPlayerScore(`${correctCount}/${activeBlanksPlayer.blankIndices.length}`);
                      setIsPlayerSubmitted(true);
                      setShowSuccessUpload(true);
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={isPlayerSubmitted ? ['#475569', '#334155'] : ['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.playerSubmitGradient}
                  >
                    <Text style={styles.playerSubmitBtnText}>
                      {isPlayerSubmitted ? 'Try Again' : 'Submit'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>

            {/* Premium Upload Success Popup Overlay */}
            <Modal
              visible={showSuccessUpload}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowSuccessUpload(false)}
            >
              <View style={styles.successOverlay}>
                <View style={styles.successCard}>
                  <View style={styles.successIconRing}>
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.successIconRingGrad}
                    >
                      <MaterialIcons name="cloud-done" size={32} color="#ffffff" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.successTitle}>Uploaded Successfully!</Text>
                  <Text style={styles.successDesc}>
                    Your blanks assignment score ({playerScore}) has been submitted to the dashboard portal.
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.successDoneBtn}
                    onPress={() => {
                      setShowSuccessUpload(false);
                      setActiveBlanksPlayer(null); // Exit player
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      style={styles.successDoneGradient}
                    >
                      <Text style={styles.successDoneText}>Done</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ImageBackground>
        )}
      </Modal>

      {/* 5. MATCH THE FOLLOWING PLAYING MODAL */}
      <Modal
        visible={activeMatchPlayer !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setActiveMatchPlayer(null)}
      >
        {activeMatchPlayer && (() => {
          const themeConfig = getThemeColorConfig(activeMatchPlayer.themeUrl);
          const totalPairs = activeMatchPlayer.matchPairs?.length || 0;
          
          return (
            <ImageBackground
              source={{ uri: activeMatchPlayer.themeUrl }}
              style={{ flex: 1 }}
              resizeMode="cover"
            >
              {/* Soft dark tinted overlay for maximum text contrast */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.3)' }} />
              
              <SafeAreaView style={{ flex: 1 }}>
                {/* Header row with Close button & title */}
                <View style={styles.playerHeaderBar}>
                  <TouchableOpacity
                    style={styles.playerExitBtn}
                    onPress={() => setActiveMatchPlayer(null)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="close" size={20} color="#0F172A" />
                  </TouchableOpacity>

                  <Text style={styles.playerHeaderTitle} numberOfLines={1}>{activeMatchPlayer.title}</Text>
                  
                  <View style={styles.playerScoreBadge}>
                    <Text style={styles.playerScoreBadgeLabel}>SCORE : {playerScore}</Text>
                  </View>
                </View>

                <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                  {/* Premium Title Block matching Image 4/5 */}
                  <View style={[styles.matchHeaderBlock, { backgroundColor: themeConfig.headerBg }]}>
                    <Text style={styles.matchHeaderTitleText}>Match the columns</Text>
                    <Text style={styles.matchHeaderSubText}>Tap a card on the left, then find its match on the right.</Text>
                    
                    <View style={styles.matchHeaderScorePill}>
                      <View style={[styles.matchScoreDot, { backgroundColor: '#F59E0B' }]} />
                      <Text style={styles.matchHeaderScoreText}>
                        {isPlayerSubmitted ? `${playerScore} Matches Correct` : `${Object.keys(matchAnswers).length}/${totalPairs} Pairs Connected`}
                      </Text>
                    </View>
                  </View>

                  {/* Columns Grid Wrapper */}
                  <View style={[styles.matchGridContainer, { backgroundColor: themeConfig.bodyCardBg, borderColor: themeConfig.cardBorder }]}>
                    
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', position: 'relative' }}>
                      
                      {/* Left Column */}
                      <View 
                        style={{ flex: 1, marginRight: 16 }}
                        onLayout={(e) => {
                          const { x, y, width, height } = e.nativeEvent.layout;
                          setLeftColLayout({ x, y, w: width, h: height });
                        }}
                      >
                        {activeMatchPlayer.matchPairs?.map((pair: any, idx: number) => {
                          const isSelected = matchLeftSelected === idx;
                          const isMatched = matchAnswers[idx] !== undefined;
                          
                          return (
                            <TouchableOpacity
                              key={pair.id || idx}
                              style={[
                                styles.matchPlayerCard,
                                isSelected && styles.matchPlayerCardSelected,
                                isMatched && !isSelected && styles.matchPlayerCardMatched,
                              ]}
                              onLayout={(e) => {
                                const { y, height } = e.nativeEvent.layout;
                                setCardLayouts(prev => ({ ...prev, [`left-${idx}`]: { y, h: height } }));
                              }}
                              onPress={() => {
                                if (isPlayerSubmitted) return;
                                setMatchLeftSelected(idx);
                              }}
                              activeOpacity={0.8}
                            >
                              <View style={[styles.matchConnectorDot, { right: -5, backgroundColor: isSelected ? '#F59E0B' : '#3B82F6' }]} />
                              <Text style={styles.matchPlayerCardText} numberOfLines={1}>{pair.left}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {/* Right Column */}
                      <View 
                        style={{ flex: 1 }}
                        onLayout={(e) => {
                          const { x, y, width, height } = e.nativeEvent.layout;
                          setRightColLayout({ x, y, w: width, h: height });
                        }}
                      >
                        {shuffledRightItems.map((item: any, idx: number) => {
                          const isCurrentlySelectedRight = Object.values(matchAnswers).includes(item.originalIndex);
                          const matchedLeftIndex = Object.keys(matchAnswers).find(
                            (key) => matchAnswers[Number(key)] === item.originalIndex
                          );
                          
                          return (
                            <TouchableOpacity
                              key={idx}
                              style={[
                                styles.matchPlayerCard,
                                isCurrentlySelectedRight && styles.matchPlayerCardMatched,
                              ]}
                              onLayout={(e) => {
                                const { y, height } = e.nativeEvent.layout;
                                setCardLayouts(prev => ({ ...prev, [`right-${idx}`]: { y, h: height } }));
                              }}
                              onPress={() => {
                                if (isPlayerSubmitted) return;
                                if (matchLeftSelected === null) {
                                  Alert.alert('Selection Required', 'Tap a card on the left column first.');
                                  return;
                                }
                                // Connect!
                                setMatchAnswers(prev => ({
                                  ...prev,
                                  [matchLeftSelected]: item.originalIndex,
                                }));
                                setMatchLeftSelected(null); // Reset selection
                              }}
                              activeOpacity={0.8}
                            >
                              <View style={[styles.matchConnectorDot, { left: -5, backgroundColor: isCurrentlySelectedRight ? '#10B981' : '#3B82F6' }]} />
                              <Text style={styles.matchPlayerCardText} numberOfLines={1}>{item.text}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {/* SVG Overlay to draw matching lines */}
                      {leftColLayout && rightColLayout && Object.keys(cardLayouts).length > 0 && (
                        <Svg 
                          style={[StyleSheet.absoluteFill, { zIndex: 5 }]} 
                          pointerEvents="none"
                        >
                          {Object.keys(matchAnswers).map((leftIdxKey) => {
                            const leftIdx = Number(leftIdxKey);
                            const originalIndex = matchAnswers[leftIdx];
                            const rightIdx = shuffledRightItems.findIndex(
                              (item) => item.originalIndex === originalIndex
                            );
                            
                            const leftCard = cardLayouts[`left-${leftIdx}`];
                            const rightCard = cardLayouts[`right-${rightIdx}`];
                            
                            if (!leftCard || !rightCard) return null;
                            
                            const x1 = leftColLayout.w - 4;
                            const y1 = leftCard.y + leftCard.h / 2;
                            
                            const x2 = rightColLayout.x - leftColLayout.x + 4;
                            const y2 = rightCard.y + rightCard.h / 2;
                            
                            let strokeColor = '#3B82F6'; // neutral blue line
                            if (isPlayerSubmitted) {
                              const isCorrect = leftIdx === originalIndex;
                              strokeColor = isCorrect ? '#10B981' : '#EF4444';
                            }
                            
                            return (
                              <Line
                                key={leftIdxKey}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={strokeColor}
                                strokeWidth={4}
                                strokeLinecap="round"
                              />
                            );
                          })}
                        </Svg>
                      )}

                    </View>
                  </View>

                  {/* Primary Submit Button */}
                  <TouchableOpacity
                    style={styles.playerSubmitBtn}
                    onPress={() => {
                      if (isPlayerSubmitted) {
                        // Reset player to try again
                        setMatchAnswers({});
                        setMatchLeftSelected(null);
                        setIsPlayerSubmitted(false);
                        setPlayerScore(`0/${totalPairs}`);
                        setShowSuccessUpload(false);
                        
                        // Reshuffle right items
                        const rightWithIndices = activeMatchPlayer.matchPairs?.map((p: any, idx: number) => ({
                          originalIndex: idx,
                          text: p.right,
                        })) || [];
                        const shuffled = [...rightWithIndices];
                        for (let i = shuffled.length - 1; i > 0; i--) {
                          const j = Math.floor(Math.random() * (i + 1));
                          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                        }
                        setShuffledRightItems(shuffled);
                      } else {
                        // Check if all are connected
                        if (Object.keys(matchAnswers).length < totalPairs) {
                          Alert.alert('Incomplete Pairs', 'Please connect all columns before submitting.');
                          return;
                        }
                        
                        // Submit match answers
                        const correctCount = Object.keys(matchAnswers).reduce((acc, leftIdxKey) => {
                          const leftIdx = Number(leftIdxKey);
                          const originalIndex = matchAnswers[leftIdx];
                          return leftIdx === originalIndex ? acc + 1 : acc;
                        }, 0);
                        
                        setPlayerScore(`${correctCount}/${totalPairs}`);
                        setIsPlayerSubmitted(true);
                        setShowMatchSuccessUpload(true);
                      }
                    }}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={isPlayerSubmitted ? ['#64748B', '#475569'] : ['#10B981', '#059669']}
                      style={styles.playerSubmitGradient}
                    >
                      <Text style={styles.playerSubmitBtnText}>
                        {isPlayerSubmitted ? 'Try Again' : 'Submit'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </ScrollView>
              </SafeAreaView>

              {/* Upload Success Modal Sheet */}
              <Modal
                visible={showMatchSuccessUpload}
                transparent={true}
                animationType="fade"
              >
                <View style={styles.successOverlay}>
                  <View style={styles.successCard}>
                    <View style={styles.successIconRing}>
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.successIconRingGrad}
                      >
                        <MaterialIcons name="cloud-done" size={32} color="#ffffff" />
                      </LinearGradient>
                    </View>
                    <Text style={styles.successTitle}>Uploaded Successfully!</Text>
                    <Text style={styles.successDesc}>
                      Your matching column score ({playerScore}) has been submitted to the teacher portal.
                    </Text>
                    
                    <TouchableOpacity
                      style={styles.successDoneBtn}
                      onPress={() => {
                        setShowMatchSuccessUpload(false);
                        setIsPlayerSubmitted(false);
                        setMatchAnswers({});
                        setActiveMatchPlayer(null); // Exit player - full clean reset
                      }}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.successDoneGradient}
                      >
                        <Text style={styles.successDoneText}>Done</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

            </ImageBackground>
          );
        })()}
      </Modal>

      {/* ── MODAL 1: SELECT DIAGRAM IMAGE TEMPLATE ── */}
      <Modal
        visible={showImageSelectModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageSelectModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: 400,
            borderRadius: 24,
            padding: 22,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8
          }}>
            {/* Title Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#1e3a8a', letterSpacing: 0.2 }}>
                Choose Diagram File
              </Text>
              <TouchableOpacity 
                onPress={() => { playSound('click'); setShowImageSelectModal(false); }}
                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}
              >
                <MaterialIcons name="close" size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b', lineHeight: 20, marginBottom: 18 }}>
              Select one of the educational diagrams below to begin adding label pinpoints:
            </Text>

            {/* Grid or Stack of Educational Diagrams */}
            <View style={{ gap: 10 }}>
              {[
                { id: 'FACE', name: 'Human Face Template', icon: 'face', desc: 'Eyes, nose, mouth, hair, etc.' },
                { id: 'SKELETON', name: 'Human Skeleton Template', icon: 'accessibility', desc: 'Skull, ribs, limbs, joints, etc.' },
                { id: 'PLANT_CELL', name: 'Plant Cell Structure', icon: 'nature', desc: 'Vacuole, nucleus, chloroplast, etc.' },
              ].map((diagram) => (
                <TouchableOpacity
                  key={diagram.id}
                  onPress={() => {
                    playSound('click');
                    setPartsImage(diagram.id);
                    setPartsImageName(diagram.name);
                    setShowImageSelectModal(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1.5,
                    borderColor: '#e2e8f0',
                    borderBottomWidth: 4,
                    borderBottomColor: '#cbd5e1',
                    gap: 12
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#eff6ff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: '#bfdbfe'
                  }}>
                    <MaterialIcons name={diagram.icon as any} size={22} color="#2563eb" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: '#1e293b' }}>
                      {diagram.name}
                    </Text>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#64748b', marginTop: 2 }}>
                      {diagram.desc}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
                </TouchableOpacity>
              ))}

              {/* Custom file picking simulation option */}
              <TouchableOpacity
                onPress={async () => {
                  playSound('click');
                  try {
                    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (status !== 'granted') {
                      Alert.alert(
                        'Permission Denied',
                        'Sorry, we need camera roll permissions to upload a custom diagram!'
                      );
                      return;
                    }

                    const result = await ImagePicker.launchImageLibraryAsync({
                      mediaTypes: ['images'],
                      allowsEditing: true,
                      quality: 1,
                    });

                    if (!result.canceled && result.assets && result.assets.length > 0) {
                      const selectedAsset = result.assets[0];
                      setPartsImage(selectedAsset.uri);
                      setPartsImageName(selectedAsset.fileName || 'Custom Diagram Image');
                      setShowImageSelectModal(false);
                    }
                  } catch (err) {
                    Alert.alert('Error', 'Unable to pick image. Please try again.');
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#faf5ff',
                  padding: 16,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: '#f3e8ff',
                  borderBottomWidth: 4,
                  borderBottomColor: '#e9d5ff',
                  gap: 12,
                  marginTop: 4
                }}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#f5f3ff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#e9d5ff'
                }}>
                  <MaterialIcons name="add-a-photo" size={20} color="#7c3aed" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#5b21b6' }}>
                    Choose Custom File
                  </Text>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#7c3aed', marginTop: 2 }}>
                    Select any diagram image from your gallery
                  </Text>
                </View>
                <MaterialIcons name="cloud-upload" size={18} color="#c084fc" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL 2: ADD DIAGRAM PINPOINT LABEL NAME ── */}
      <Modal
        visible={showPinpointDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowPinpointDialog(false);
          setTempPinpointCoord(null);
        }}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: 380,
            borderRadius: 24,
            padding: 22,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8
          }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#1e3a8a', marginBottom: 6 }}>
              Name Your Pinpoint
            </Text>
            
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748b', lineHeight: 18, marginBottom: 16 }}>
              Enter a clear label name for the pinpoint placed at coordinates:
              <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>
                {tempPinpointCoord ? ` X: ${Math.round(tempPinpointCoord.x)}%, Y: ${Math.round(tempPinpointCoord.y)}%` : ''}
              </Text>
            </Text>

            <TextInput
              style={{
                width: '100%',
                height: 48,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: '#cbd5e1',
                paddingHorizontal: 16,
                fontSize: 15,
                color: '#1e293b',
                backgroundColor: '#f8fafc',
                marginBottom: 20,
                fontWeight: '700'
              }}
              placeholder="e.g. Nucleus, Nose, Skull, etc."
              placeholderTextColor="#94a3b8"
              value={pinpointNameInput}
              onChangeText={setPinpointNameInput}
              autoFocus={true}
            />

            <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => {
                  playSound('click');
                  setShowPinpointDialog(false);
                  setTempPinpointCoord(null);
                  setPinpointNameInput('');
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: '#f1f5f9',
                  borderWidth: 1,
                  borderColor: '#e2e8f0'
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: '#475569', fontSize: 14, fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (!pinpointNameInput.trim()) {
                    Alert.alert('Required Info', 'Please enter a label name for the pinpoint.');
                    return;
                  }
                  if (tempPinpointCoord) {
                    playSound('add');
                    const newPin = {
                      id: Date.now().toString(),
                      x: tempPinpointCoord.x,
                      y: tempPinpointCoord.y,
                      name: pinpointNameInput.trim()
                    };
                    setPartsPinpoints([...partsPinpoints, newPin]);
                    setTempPinpointCoord(null);
                    setPinpointNameInput('');
                    setShowPinpointDialog(false);
                  }
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                  backgroundColor: '#2563eb',
                  elevation: 2
                }}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>Add Pinpoint</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── MODAL 3: DIAGRAM PARTS PLAYING MODAL ── */}
      <Modal
        visible={activePartsPlayer !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setActivePartsPlayer(null)}
      >
        {activePartsPlayer && (() => {
          const themeConfig = getThemeColorConfig(activePartsPlayer.themeUrl);
          const totalPinpoints = activePartsPlayer.partsPinpoints?.length || 0;
          
          // Calculate correct answers count
          const correctCount = Object.keys(partsAnswers).filter(
            id => activePartsPlayer.partsPinpoints.find((p: any) => p.id === id)?.name === partsAnswers[id]
          ).length;
          
          return (
            <ImageBackground
              source={{ uri: activePartsPlayer.themeUrl }}
              style={{ flex: 1 }}
              resizeMode="cover"
            >
              {/* Soft dark tinted overlay for maximum text contrast */}
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.3)' }} />
              
              <SafeAreaView style={{ flex: 1 }}>
                {/* Header row with Close button & title */}
                <View style={styles.playerHeaderBar}>
                  <TouchableOpacity
                    style={styles.playerExitBtn}
                    onPress={() => setActivePartsPlayer(null)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="close" size={20} color="#0F172A" />
                  </TouchableOpacity>

                  <Text style={styles.playerHeaderTitle} numberOfLines={1}>{activePartsPlayer.title}</Text>
                  
                  <View style={styles.playerScoreBadge}>
                    <Text style={styles.playerScoreBadgeLabel}>SCORE : {correctCount}/{totalPinpoints}</Text>
                  </View>
                </View>

                <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                  {/* Premium Title Block */}
                  <View style={[styles.matchHeaderBlock, { backgroundColor: themeConfig.headerBg }]}>
                    <Text style={styles.matchHeaderTitleText}>Label the Diagram</Text>
                    <Text style={styles.matchHeaderSubText}>
                      {activePartsPlayer.partsLayoutMethod === 'drag' 
                        ? 'Tap a label pill from the tray at the bottom, then click its pinpoint dot on the canvas.'
                        : activePartsPlayer.partsLayoutMethod === 'match'
                        ? 'Tap a pinpoint dot first, then click its matching label name below.'
                        : 'Tap any pinpoint dot on the diagram and select the correct option.'}
                    </Text>
                    
                    <View style={styles.matchHeaderScorePill}>
                      <View style={[styles.matchScoreDot, { backgroundColor: '#10B981' }]} />
                      <Text style={styles.matchHeaderScoreText}>
                        {isPlayerSubmitted ? `${correctCount}/${totalPinpoints} Correctly Labeled` : `${correctCount}/${totalPinpoints} Completed`}
                      </Text>
                    </View>
                  </View>

                  {/* Interactive Diagram Canvas Card */}
                  <View style={{
                    width: '100%',
                    backgroundColor: themeConfig.bodyCardBg,
                    borderColor: themeConfig.cardBorder,
                    borderWidth: 2,
                    borderRadius: 24,
                    padding: 16,
                    alignItems: 'center',
                    marginBottom: 16,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8
                  }}>
                    <View 
                      onLayout={(e) => {
                        const { width, height } = e.nativeEvent.layout;
                        if (width && height) {
                          setPlayerCanvasLayout({ width, height });
                        }
                      }}
                      style={{ width: '100%', height: 300, position: 'relative' }}
                    >
                      {/* Diagram representation wrapper to hold rounded corners */}
                      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 20, overflow: 'hidden', backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#cbd5e1' }}>
                        <DiagramRenderer 
                          name={activePartsPlayer.partsImage || activePartsPlayer.partsImageName} 
                          onImageAspectMeasured={(asp) => {
                            if (activePartsPlayer && activePartsPlayer.partsImageAspect !== asp) {
                              activePartsPlayer.partsImageAspect = asp;
                            }
                          }}
                        />
                      </View>

                      {(() => {
                        const playerImgName = activePartsPlayer.partsImage || activePartsPlayer.partsImageName;
                        let playerAspect = activePartsPlayer.partsImageAspect || 1.25;
                        if (playerImgName && !activePartsPlayer.partsImageAspect) {
                          const pNorm = playerImgName.trim().toUpperCase();
                          if (pNorm === 'FACE' || pNorm === 'SKELETON' || pNorm === 'PLANT' || pNorm === 'PRESET_FACE') {
                            playerAspect = 1.25;
                          }
                        }

                        const pWidth = playerCanvasLayout.width || 400;
                        const pHeight = playerCanvasLayout.height || 300;
                        const { dispL, dispT, dispW, dispH } = getImageDisplayRect(pWidth, pHeight, playerAspect);

                        const getScreenCoords = (pin: any) => {
                          const normX = (pin.x ?? 50) / 100;
                          const normY = (pin.y ?? 50) / 100;
                          const dotPxX = dispL + normX * dispW;
                          const dotPxY = dispT + normY * dispH;
                          const displayX = (dotPxX / pWidth) * 100;
                          const displayY = (dotPxY / pHeight) * 100;
                          return { displayX, displayY };
                        };

                        const leftPins = (activePartsPlayer.partsPinpoints || [])
                          .filter((p: any) => getScreenCoords(p).displayX < 50);
                        const rightPins = (activePartsPlayer.partsPinpoints || [])
                          .filter((p: any) => getScreenCoords(p).displayX >= 50);

                        const resolveSpacing = (pins: any[]) => {
                          const res: Record<string, number> = {};
                          if (pins.length === 0) return res;
                          const sorted = [...pins].sort((a, b) => getScreenCoords(a).displayY - getScreenCoords(b).displayY);
                          const ys = sorted.map(p => Math.max(12, Math.min(88, getScreenCoords(p).displayY)));
                          for (let pass = 0; pass < 12; pass++) {
                            for (let i = 0; i < ys.length - 1; i++) {
                              if (ys[i + 1] - ys[i] < 13) {
                                const overlap = 13 - (ys[i + 1] - ys[i]);
                                ys[i] = Math.max(12, ys[i] - overlap / 2);
                                ys[i + 1] = Math.min(88, ys[i + 1] + overlap / 2);
                              }
                            }
                          }
                          sorted.forEach((pin, idx) => {
                            res[pin.id] = ys[idx];
                          });
                          return res;
                        };

                        const spacedYMap: Record<string, number> = {
                          ...resolveSpacing(leftPins),
                          ...resolveSpacing(rightPins)
                        };

                        return (
                          <>
                            {/* Svg Connector Lines */}
                            <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }} pointerEvents="none">
                              {activePartsPlayer.partsPinpoints?.map((pin: any) => {
                                const isCorrect = partsAnswers[pin.id] === pin.name;
                                const isActivePinpoint = partsDropdownActiveId === pin.id;
                                const { displayX, displayY } = getScreenCoords(pin);
                                const spacedY = spacedYMap[pin.id] || displayY;
                                const isLeft = displayX < 50;
                                const boxLeftPct = isLeft ? Math.max(2, displayX - 22) : Math.min(78, displayX + 4);
                                const lineTargetX = isLeft ? boxLeftPct + 20 : boxLeftPct;
                                return (
                                  <Line
                                    key={pin.id}
                                    x1={`${displayX}%`}
                                    y1={`${displayY}%`}
                                    x2={`${lineTargetX}%`}
                                    y2={`${spacedY}%`}
                                    stroke={isCorrect ? '#22c55e' : (isActivePinpoint ? '#3b82f6' : '#64748b')}
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                  />
                                );
                              })}
                            </Svg>

                            {/* Pinpoints & Textbox Labels overlay */}
                            {activePartsPlayer.partsPinpoints?.map((pin: any) => {
                              const isCorrect = partsAnswers[pin.id] === pin.name;
                              const isActivePinpoint = partsDropdownActiveId === pin.id;
                              const { displayX, displayY } = getScreenCoords(pin);
                              const spacedY = spacedYMap[pin.id] || displayY;
                              const isLeft = displayX < 50;
                              const boxLeftPct = isLeft ? Math.max(2, displayX - 22) : Math.min(78, displayX + 4);

                              const handlePress = () => {
                                playSound('click');
                                if (activePartsPlayer.partsLayoutMethod === 'drag' && partsSelectedLabel) {
                                  if (partsSelectedLabel === pin.name) {
                                    playSound('win');
                                    const newAnswers: Record<string, string> = { ...partsAnswers, [pin.id]: partsSelectedLabel as string };
                                    setPartsAnswers(newAnswers);
                                    setPartsSelectedLabel(null);
                                    
                                    // Check if finished
                                    const cCount = Object.keys(newAnswers).filter(
                                      id => activePartsPlayer.partsPinpoints.find((p: any) => p.id === id)?.name === newAnswers[id]
                                    ).length;
                                    if (cCount === totalPinpoints) {
                                      setIsPlayerSubmitted(true);
                                      setPlayerScore(`${cCount}/${totalPinpoints}`);
                                      playSound('win');
                                      setShowPartsSuccessUpload(true);
                                    }
                                  } else {
                                    playSound('error');
                                    setPartsWrongAlert(true);
                                  }
                                } else {
                                  // Open bottom sheet selector
                                  setPartsDropdownActiveId(pin.id);
                                }
                              };

                              return (
                                <React.Fragment key={pin.id}>
                                  {/* Upgraded Premium Dual-Layer Radar Anchor Dot */}
                                  <View
                                    style={{
                                      position: 'absolute',
                                      left: `${displayX}%`,
                                      top: `${displayY}%`,
                                      transform: [{ translateX: -8 }, { translateY: -8 }],
                                      width: 16,
                                      height: 16,
                                      borderRadius: 8,
                                      backgroundColor: isCorrect 
                                        ? 'rgba(34, 197, 94, 0.25)' 
                                        : (isActivePinpoint ? 'rgba(59, 130, 246, 0.28)' : 'rgba(239, 68, 68, 0.25)'),
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      zIndex: 10
                                    }}
                                  >
                                    <View
                                      style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: isCorrect ? '#22c55e' : (isActivePinpoint ? '#3b82f6' : '#ef4444'),
                                        borderWidth: 1.5,
                                        borderColor: '#ffffff',
                                        shadowColor: isCorrect ? '#22c55e' : (isActivePinpoint ? '#3b82f6' : '#ef4444'),
                                        shadowOffset: { width: 0, height: 1 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 2,
                                        elevation: 3
                                      }}
                                    />
                                  </View>

                                  {/* Label Box floating adjacent to pinpoint */}
                                  <TouchableOpacity
                                    disabled={isCorrect || isPlayerSubmitted}
                                    onPress={handlePress}
                                    style={{
                                      position: 'absolute',
                                      left: `${boxLeftPct}%`,
                                      width: '20%',
                                      top: `${spacedY}%`,
                                      transform: [{ translateY: -16 }],
                                      backgroundColor: isCorrect ? '#f0fdf4' : (isActivePinpoint ? '#eff6ff' : '#f8fafc'),
                                      borderWidth: 1.5,
                                      borderColor: isCorrect ? '#22c55e' : (isActivePinpoint ? '#3b82f6' : '#cbd5e1'),
                                      borderStyle: isCorrect ? 'solid' : 'dashed',
                                      borderRadius: 10,
                                      paddingVertical: 5,
                                      paddingHorizontal: 6,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      shadowColor: isCorrect ? '#22c55e' : '#cbd5e1',
                                      shadowOffset: { width: 0, height: 2 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 3,
                                      elevation: 2,
                                      zIndex: 15
                                    }}
                                  >
                                    <Text 
                                      style={{
                                        color: isCorrect ? '#15803d' : (isActivePinpoint ? '#1d4ed8' : '#94a3b8'),
                                        fontWeight: '900',
                                        fontSize: 11,
                                        textAlign: 'center'
                                      }}
                                    >
                                      {isCorrect ? pin.name : '?'}
                                    </Text>
                                  </TouchableOpacity>
                                </React.Fragment>
                              );
                            })}
                          </>
                        );
                      })()}
                    </View>
                  </View>

                  {/* Tray of Labels */}
                  {activePartsPlayer.partsLayoutMethod === 'drag' && (
                    <View style={{
                      width: '100%',
                      backgroundColor: themeConfig.bodyCardBg,
                      borderColor: themeConfig.cardBorder,
                      borderWidth: 2,
                      borderRadius: 20,
                      padding: 16,
                      elevation: 2
                    }}>
                      <Text style={{ fontSize: 14, fontWeight: '900', color: themeConfig.accentColor, marginBottom: 10 }}>
                        LABELS TRAY
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {shuffledPartsLabels.map((lbl, idx) => {
                          const isAlreadyUsed = Object.values(partsAnswers).includes(lbl);
                          const isSelected = partsSelectedLabel === lbl;
                          if (isAlreadyUsed) return null;
                          return (
                            <TouchableOpacity
                              key={idx}
                              onPress={() => {
                                playSound('click');
                                setPartsSelectedLabel(isSelected ? null : lbl);
                              }}
                              style={{
                                backgroundColor: isSelected ? '#3b82f6' : '#ffffff',
                                paddingVertical: 10,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                                borderWidth: 1.5,
                                borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                                borderBottomWidth: 4,
                                borderBottomColor: isSelected ? '#1d4ed8' : '#cbd5e1'
                              }}
                              activeOpacity={0.7}
                            >
                              <Text style={{ fontSize: 14, fontWeight: '900', color: isSelected ? '#ffffff' : '#334155' }}>
                                {lbl}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* Tray of Labels for Click to Match mode */}
                  {activePartsPlayer.partsLayoutMethod === 'match' && !partsDropdownActiveId && (
                    <View style={{
                      width: '100%',
                      backgroundColor: themeConfig.bodyCardBg,
                      borderColor: themeConfig.cardBorder,
                      borderWidth: 2,
                      borderRadius: 20,
                      padding: 16,
                      elevation: 2
                    }}>
                      <Text style={{ fontSize: 14, fontWeight: '900', color: themeConfig.accentColor, marginBottom: 8, textAlign: 'center' }}>
                        First, tap a red pinpoint dot on the diagram above!
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </SafeAreaView>

              {/* Mismatch Alert Overlay Toast */}
              {partsWrongAlert && (
                <View style={{
                  position: 'absolute',
                  top: '40%',
                  alignSelf: 'center',
                  backgroundColor: 'rgba(225, 29, 72, 0.95)',
                  paddingVertical: 14,
                  paddingHorizontal: 28,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 5,
                  zIndex: 9999
                }}>
                  <MaterialIcons name="error-outline" size={20} color="#ffffff" />
                  <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 16 }}>Wrong Answer!</Text>
                </View>
              )}

              {/* Upload Success Modal Sheet */}
              <Modal
                visible={showPartsSuccessUpload}
                transparent={true}
                animationType="fade"
              >
                <View style={styles.successOverlay}>
                  <View style={styles.successCard}>
                    <View style={styles.successIconRing}>
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.successIconRingGrad}
                      >
                        <MaterialIcons name="cloud-done" size={32} color="#ffffff" />
                      </LinearGradient>
                    </View>
                    <Text style={styles.successTitle}>Uploaded Successfully!</Text>
                    <Text style={styles.successDesc}>
                      Your diagram labeling score ({playerScore}) has been submitted to the teacher portal.
                    </Text>
                    
                    <TouchableOpacity
                      style={styles.successDoneBtn}
                      onPress={() => {
                        setShowPartsSuccessUpload(false);
                        setIsPlayerSubmitted(false);
                        setPartsAnswers({});
                        setActivePartsPlayer(null); // Exit player - full clean reset
                      }}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.successDoneGradient}
                      >
                        <Text style={styles.successDoneText}>Done</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* ── PREMIUM BOTTOM SHEET SELECTOR FOR PINPOINTS ── */}
              <Modal
                visible={partsDropdownActiveId !== null}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPartsDropdownActiveId(null)}
              >
                <View style={{
                  flex: 1,
                  backgroundColor: 'rgba(15, 23, 42, 0.4)',
                  justifyContent: 'flex-end',
                }}>
                  {/* Touch outside to close */}
                  <TouchableOpacity 
                    style={{ flex: 1 }} 
                    activeOpacity={1} 
                    onPress={() => setPartsDropdownActiveId(null)} 
                  />
                  
                  <View style={{
                    backgroundColor: '#ffffff',
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    padding: 24,
                    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
                    borderTopWidth: 1.5,
                    borderColor: '#e2e8f0',
                    shadowColor: '#0f172a',
                    shadowOffset: { width: 0, height: -10 },
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    elevation: 20
                  }}>
                    {/* Drag Indicator handle */}
                    <View style={{
                      width: 48,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#cbd5e1',
                      alignSelf: 'center',
                      marginBottom: 20
                    }} />

                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <View>
                        <Text style={{ fontSize: 18, fontWeight: '900', color: '#1e3a8a' }}>
                          Choose the Correct Label
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748b', marginTop: 2 }}>
                          Tap the matching term for this pinpoint
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => setPartsDropdownActiveId(null)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: '#f1f5f9',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <MaterialIcons name="close" size={20} color="#64748b" />
                      </TouchableOpacity>
                    </View>

                    {/* Grid of Options */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                      {(() => {
                        const activePinpoint = activePartsPlayer?.partsPinpoints?.find((p: any) => p.id === partsDropdownActiveId);
                        if (!activePinpoint) return null;
                        
                        return shuffledPartsLabels.map((lbl, idx) => {
                          const isAlreadyUsed = Object.entries(partsAnswers).some(
                            ([ansId, ansVal]) => ansVal === lbl && ansId !== activePinpoint.id
                          );
                          if (isAlreadyUsed) return null;
                          
                          return (
                            <TouchableOpacity
                              key={idx}
                              onPress={() => {
                                playSound('click');
                                if (lbl === activePinpoint.name) {
                                  playSound('win');
                                  const newAnswers: Record<string, string> = { ...partsAnswers, [activePinpoint.id]: lbl };
                                  setPartsAnswers(newAnswers);
                                  setPartsDropdownActiveId(null);
                                  
                                  const cCount = Object.keys(newAnswers).filter(
                                    id => activePartsPlayer.partsPinpoints.find((p: any) => p.id === id)?.name === newAnswers[id]
                                  ).length;
                                  if (cCount === totalPinpoints) {
                                    setIsPlayerSubmitted(true);
                                    setPlayerScore(`${cCount}/${totalPinpoints}`);
                                    playSound('win');
                                    setShowPartsSuccessUpload(true);
                                  }
                                } else {
                                  playSound('error');
                                  setPartsWrongAlert(true);
                                }
                              }}
                              style={{
                                backgroundColor: '#eff6ff',
                                paddingVertical: 12,
                                paddingHorizontal: 18,
                                borderRadius: 16,
                                borderWidth: 1.5,
                                borderColor: '#bfdbfe',
                                borderBottomWidth: 4,
                                borderBottomColor: '#3b82f6',
                                minWidth: '45%'
                              }}
                              activeOpacity={0.7}
                            >
                              <Text style={{ fontSize: 15, fontWeight: '800', color: '#1e40af', textAlign: 'center' }}>
                                {lbl}
                              </Text>
                            </TouchableOpacity>
                          );
                        });
                      })()}
                    </View>
                  </View>
                </View>
              </Modal>

            </ImageBackground>
          );
        })()}
      </Modal>

      {/* ── TRUE / FALSE QUIZ PLAYER MODAL (LIGHT BRIGHT PREMIUM UI) ── */}
      {activeTfPlayer && (
        <Modal
          visible={activeTfPlayer !== null}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setActiveTfPlayer(null)}
        >
          <View style={{ flex: 1, backgroundColor: '#F0F9FF' }}>
            {/* Ambient Bright Background Gradients & Floating Glass Circles */}
            <LinearGradient
              colors={['#E0F2FE', '#F0F9FF', '#EEF2FF', '#F0FDF4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View style={{ position: 'absolute', top: -60, left: -60, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(56, 189, 248, 0.25)' }} />
            <View style={{ position: 'absolute', bottom: -80, right: -60, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(167, 243, 208, 0.3)' }} />
            <View style={{ position: 'absolute', top: '40%', right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(196, 181, 253, 0.25)' }} />

            {/* Top Navbar */}
            <SafeAreaView style={{ backgroundColor: '#ffffff', borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0' }}>
              <View style={{
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: '#2563EB',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#2563EB',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 3
                  }}>
                    <MaterialIcons name="flaky" size={24} color="#ffffff" />
                  </View>
                  <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 19, letterSpacing: 0.5 }}>
                    TRUE<Text style={{ color: '#2563EB' }}>/FALSE</Text>
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    backgroundColor: '#EFF6FF',
                    borderWidth: 1.5,
                    borderColor: '#BFDBFE',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6
                  }}>
                    <MaterialIcons name="flash-on" size={16} color="#2563EB" />
                    <Text style={{ color: '#2563EB', fontSize: 12, fontWeight: '900', letterSpacing: 0.3 }}>Interactive Mode</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setActiveTfPlayer(null)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: '#F1F5F9',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#E2E8F0'
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="close" size={22} color="#475569" />
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>

            {/* Content Container (PERFECTLY VERTICALLY CENTERED - NO EMPTY SPACE) */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, paddingBottom: 40, alignItems: 'center' }}>
              {/* Top Header Card (ULTRA-PREMIUM ENHANCED INNER DESIGN) */}
              <View style={{
                width: '100%',
                maxWidth: 620,
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                overflow: 'hidden',
                borderWidth: 1.8,
                borderColor: '#BFDBFE',
                marginBottom: 20,
                shadowColor: '#2563EB',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
                elevation: 4
              }}>
                {/* Top Gradient Accent Bar */}
                <LinearGradient
                  colors={['#38BDF8', '#2563EB', '#6366F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 5, width: '100%' }}
                />

                <View style={{ padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: '#BFDBFE',
                    shadowColor: '#2563EB',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6
                  }}>
                    <MaterialIcons name="sports-esports" size={26} color="#2563EB" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <Text style={{ color: '#1E3A8A', fontWeight: '900', fontSize: 19, letterSpacing: 0.3 }}>
                        {activeTfPlayer.title || 'True or False Assignment'}
                      </Text>
                      <View style={{ backgroundColor: '#2563EB', paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10 }}>
                        <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '900' }}>TRUE/FALSE</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <MaterialIcons name="info-outline" size={14} color="#64748B" />
                      <Text style={{ color: '#475569', fontSize: 13, fontWeight: '600' }}>
                        Read each statement carefully and select TRUE or FALSE
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Stage 1: WELCOME / START SCREEN (ULTRA-PREMIUM HERO CARD WITH DETAILED INNER DESIGN) */}
              {tfQuizStage === 'welcome' && (
                <View style={{ gap: 20, width: '100%', maxWidth: 620, alignItems: 'center' }}>
                  <View style={{
                    width: '100%',
                    borderRadius: 32,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: '#BFDBFE',
                    shadowColor: '#2563EB',
                    shadowOffset: { width: 0, height: 16 },
                    shadowOpacity: 0.14,
                    shadowRadius: 30,
                    elevation: 10
                  }}>
                    <LinearGradient
                      colors={['#FFFFFF', '#F8FAFC', '#EFF6FF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={{ width: '100%' }}
                    >
                      {/* Top Gradient Accent Bar */}
                      <LinearGradient
                        colors={['#38BDF8', '#2563EB', '#6366F1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 5, width: '100%' }}
                      />

                      <View style={{ padding: 32, alignItems: 'center', gap: 22 }}>
                        {/* Inner Meta Stats Grid (3 Distinct Glass Capsules) */}
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          width: '100%',
                          flexWrap: 'wrap'
                        }}>
                          <View style={{
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 14,
                            backgroundColor: '#EFF6FF',
                            borderWidth: 1.5,
                            borderColor: '#BFDBFE',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5
                          }}>
                            <MaterialIcons name="quiz" size={15} color="#2563EB" />
                            <Text style={{ fontSize: 12, fontWeight: '900', color: '#1E3A8A' }}>
                              {(activeTfPlayer.tfQuestions || []).length} Statements
                            </Text>
                          </View>

                          <View style={{
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 14,
                            backgroundColor: '#ECFDF5',
                            borderWidth: 1.5,
                            borderColor: '#A7F3D0',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5
                          }}>
                            <MaterialIcons name="timer-off" size={15} color="#059669" />
                            <Text style={{ fontSize: 12, fontWeight: '900', color: '#065F46' }}>
                              Untimed Quiz
                            </Text>
                          </View>

                          <View style={{
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                            borderRadius: 14,
                            backgroundColor: '#FEF3C7',
                            borderWidth: 1.5,
                            borderColor: '#FDE68A',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 5
                          }}>
                            <MaterialIcons name="bolt" size={15} color="#D97706" />
                            <Text style={{ fontSize: 12, fontWeight: '900', color: '#92400E' }}>
                              Instant Score
                            </Text>
                          </View>
                        </View>

                        {/* Center Play Spotlight Stage Box */}
                        <View style={{
                          width: '100%',
                          backgroundColor: 'rgba(239, 246, 255, 0.75)',
                          borderRadius: 26,
                          padding: 24,
                          borderWidth: 1.8,
                          borderColor: '#BFDBFE',
                          alignItems: 'center',
                          gap: 14,
                          shadowColor: '#2563EB',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.06,
                          shadowRadius: 10
                        }}>
                          {/* Glowing 3D Play Ring */}
                          <View style={{
                            width: 98,
                            height: 98,
                            borderRadius: 49,
                            backgroundColor: '#DBEAFE',
                            borderWidth: 2.5,
                            borderColor: '#93C5FD',
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#2563EB',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.22,
                            shadowRadius: 14
                          }}>
                            <LinearGradient
                              colors={['#38BDF8', '#2563EB', '#1D4ED8']}
                              style={{
                                width: 76,
                                height: 76,
                                borderRadius: 38,
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#2563EB',
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 6
                              }}
                            >
                              <MaterialIcons name="play-arrow" size={52} color="#ffffff" style={{ marginLeft: 4 }} />
                            </LinearGradient>
                          </View>

                          <View style={{
                            backgroundColor: '#2563EB',
                            paddingVertical: 3,
                            paddingHorizontal: 12,
                            borderRadius: 12
                          }}>
                            <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 }}>
                              MODE: TRUE OR FALSE
                            </Text>
                          </View>
                        </View>

                        {/* Title & Description Block */}
                        <View style={{ alignItems: 'center', gap: 10 }}>
                          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 28, textAlign: 'center', letterSpacing: 0.3 }}>
                            Ready to Challenge Yourself?
                          </Text>

                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            backgroundColor: '#F8FAFC',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: '#E2E8F0'
                          }}>
                            <MaterialIcons name="touch-app" size={16} color="#64748B" />
                            <Text style={{ color: '#475569', fontSize: 14, fontWeight: '600', textAlign: 'center', maxWidth: 420 }}>
                              Test your knowledge across statements and get your score instantly.
                            </Text>
                          </View>
                        </View>

                        {/* START QUIZ Button */}
                        <TouchableOpacity
                          style={{
                            width: '100%',
                            maxWidth: 320,
                            borderRadius: 20,
                            overflow: 'hidden',
                            shadowColor: '#2563EB',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.35,
                            shadowRadius: 14,
                            elevation: 6
                          }}
                          onPress={() => {
                            playSound('click');
                            setTfQuizStage('playing');
                            setTfCurrentIndex(0);
                          }}
                          activeOpacity={0.85}
                        >
                          <LinearGradient
                            colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                              paddingVertical: 18,
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              gap: 12,
                              borderBottomWidth: 4,
                              borderBottomColor: '#1E40AF'
                            }}
                          >
                            <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 19, letterSpacing: 0.8 }}>
                              START QUIZ
                            </Text>
                            <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </View>

                  {/* Feature Stats Ribbon to Enrich & Fill Screen Gracefully */}
                  <View style={{
                    flexDirection: 'row',
                    gap: 10,
                    width: '100%',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <View style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderWidth: 1.5,
                      borderColor: '#BFDBFE',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <MaterialIcons name="flash-on" size={16} color="#2563EB" />
                      <Text style={{ fontSize: 12, fontWeight: '900', color: '#1E3A8A' }}>Interactive Mode</Text>
                    </View>

                    <View style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderWidth: 1.5,
                      borderColor: '#FDE68A',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <MaterialIcons name="emoji-events" size={16} color="#D97706" />
                      <Text style={{ fontSize: 12, fontWeight: '900', color: '#92400E' }}>Instant Scoring</Text>
                    </View>

                    <View style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 16,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderWidth: 1.5,
                      borderColor: '#A7F3D0',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <MaterialIcons name="verified" size={16} color="#059669" />
                      <Text style={{ fontSize: 12, fontWeight: '900', color: '#065F46' }}>Verified Quiz</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Stage 2: PLAYING QUESTION SCREEN */}
              {tfQuizStage === 'playing' && (
                <View style={{
                  width: '100%',
                  maxWidth: 620,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 30,
                  padding: 28,
                  borderWidth: 2,
                  borderColor: '#E2E8F0',
                  gap: 22,
                  shadowColor: '#64748B',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.08,
                  shadowRadius: 20,
                  elevation: 6
                }}>
                  {/* Category & Progress Bar */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{
                      paddingVertical: 6,
                      paddingHorizontal: 14,
                      borderRadius: 20,
                      backgroundColor: '#EFF6FF',
                      borderWidth: 1.5,
                      borderColor: '#BFDBFE'
                    }}>
                      <Text style={{ color: '#2563EB', fontSize: 13, fontWeight: '900', letterSpacing: 0.3 }}>
                        Topic: {activeTfPlayer.topic || 'General'}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: '#0F172A', fontSize: 15, fontWeight: '900' }}>
                        Question {tfCurrentIndex + 1}
                      </Text>
                      <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '700' }}>
                        / {(activeTfPlayer.tfQuestions || []).length}
                      </Text>
                    </View>
                  </View>

                  {/* Visual Progress Bar Line */}
                  <View style={{ width: '100%', height: 7, borderRadius: 4, backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                    <View style={{
                      width: `${((tfCurrentIndex + 1) / (activeTfPlayer.tfQuestions || []).length) * 100}%`,
                      height: '100%',
                      backgroundColor: '#2563EB',
                      borderRadius: 4
                    }} />
                  </View>

                  {/* Statement Card */}
                  {(() => {
                    const currentQ = (activeTfPlayer.tfQuestions || [])[tfCurrentIndex] || { question: 'No question', answer: 'true' };
                    return (
                      <>
                        <View style={{
                          backgroundColor: '#F0F9FF',
                          borderRadius: 24,
                          padding: 32,
                          minHeight: 180,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 2,
                          borderColor: '#93C5FD',
                          shadowColor: '#2563EB',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.08,
                          shadowRadius: 10
                        }}>
                          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 22, textAlign: 'center', lineHeight: 32, letterSpacing: 0.2 }}>
                            {currentQ.question}
                          </Text>
                        </View>

                        {/* TRUE / FALSE Choice Buttons (3D Gradient Buttons) */}
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                          {/* TRUE BUTTON */}
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              borderRadius: 20,
                              overflow: 'hidden',
                              shadowColor: '#10B981',
                              shadowOffset: { width: 0, height: 6 },
                              shadowOpacity: 0.35,
                              shadowRadius: 10,
                              elevation: 6
                            }}
                            onPress={() => {
                              const isCorrect = currentQ.answer === 'true';
                              playSound(isCorrect ? 'win' : 'error');
                              setTfUserAnswers(prev => ({ ...prev, [tfCurrentIndex]: 'true' }));
                              if (isCorrect) setTfScore(prev => prev + 1);

                              const totalQs = (activeTfPlayer.tfQuestions || []).length;
                              if (tfCurrentIndex + 1 >= totalQs) {
                                setTimeout(() => setTfQuizStage('completed'), 400);
                              } else {
                                setTimeout(() => setTfCurrentIndex(prev => prev + 1), 400);
                              }
                            }}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={['#34D399', '#10B981', '#059669']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={{
                                paddingVertical: 18,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                                borderBottomWidth: 4,
                                borderBottomColor: '#047857'
                              }}
                            >
                              <MaterialIcons name="check-circle" size={24} color="#ffffff" />
                              <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 18, letterSpacing: 0.8 }}>TRUE</Text>
                            </LinearGradient>
                          </TouchableOpacity>

                          {/* FALSE BUTTON */}
                          <TouchableOpacity
                            style={{
                              flex: 1,
                              borderRadius: 20,
                              overflow: 'hidden',
                              shadowColor: '#F43F5E',
                              shadowOffset: { width: 0, height: 6 },
                              shadowOpacity: 0.35,
                              shadowRadius: 10,
                              elevation: 6
                            }}
                            onPress={() => {
                              const isCorrect = currentQ.answer === 'false';
                              playSound(isCorrect ? 'win' : 'error');
                              setTfUserAnswers(prev => ({ ...prev, [tfCurrentIndex]: 'false' }));
                              if (isCorrect) setTfScore(prev => prev + 1);

                              const totalQs = (activeTfPlayer.tfQuestions || []).length;
                              if (tfCurrentIndex + 1 >= totalQs) {
                                setTimeout(() => setTfQuizStage('completed'), 400);
                              } else {
                                setTimeout(() => setTfCurrentIndex(prev => prev + 1), 400);
                              }
                            }}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={['#FB7185', '#F43F5E', '#E11D48']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={{
                                paddingVertical: 18,
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                gap: 10,
                                borderBottomWidth: 4,
                                borderBottomColor: '#BE123C'
                              }}
                            >
                              <MaterialIcons name="cancel" size={24} color="#ffffff" />
                              <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 18, letterSpacing: 0.8 }}>FALSE</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </>
                    );
                  })()}
                </View>
              )}

              {/* Stage 3: QUIZ COMPLETED / RESULTS SCREEN */}
              {tfQuizStage === 'completed' && (
                <View style={{
                  width: '100%',
                  maxWidth: 620,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 30,
                  padding: 36,
                  borderWidth: 2,
                  borderColor: '#A7F3D0',
                  alignItems: 'center',
                  gap: 24,
                  shadowColor: '#10B981',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.15,
                  shadowRadius: 20,
                  elevation: 8
                }}>
                  {/* Category Pill */}
                  <View style={{
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    backgroundColor: '#ECFDF5',
                    borderWidth: 1.5,
                    borderColor: '#A7F3D0'
                  }}>
                    <Text style={{ color: '#047857', fontSize: 13, fontWeight: '900' }}>
                      Topic: {activeTfPlayer.topic || 'General'}
                    </Text>
                  </View>

                  {/* Golden Trophy */}
                  <Text style={{ fontSize: 72 }}>🏆</Text>

                  <View style={{ alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 28, letterSpacing: 0.5 }}>
                      Quiz Completed!
                    </Text>
                    <Text style={{ color: '#475569', fontSize: 16, fontWeight: '700' }}>
                      Your Final Score: <Text style={{ color: '#059669', fontWeight: '900', fontSize: 20 }}>
                        {Math.min(tfScore, (activeTfPlayer.tfQuestions || []).length)} / {(activeTfPlayer.tfQuestions || []).length}
                      </Text>
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={{
                      width: '100%',
                      maxWidth: 260,
                      borderRadius: 20,
                      overflow: 'hidden',
                      shadowColor: '#10B981',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.4,
                      shadowRadius: 10,
                      elevation: 6
                    }}
                    onPress={() => {
                      playSound('win');
                      setShowTfSuccessUpload(true);
                    }}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#34D399', '#10B981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        paddingVertical: 16,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 10,
                        borderBottomWidth: 4,
                        borderBottomColor: '#047857'
                      }}
                    >
                      <MaterialIcons name="send" size={20} color="#ffffff" />
                      <Text style={{ color: '#ffffff', fontWeight: '900', fontSize: 17, letterSpacing: 0.5 }}>
                        Submit Score
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Success Upload Modal */}
          <Modal visible={showTfSuccessUpload} transparent animationType="fade">
            <View style={styles.successOverlay}>
              <View style={styles.successCard}>
                <View style={styles.successIconRing}>
                  <LinearGradient colors={['#10B981', '#059669']} style={styles.successIconRingGrad}>
                    <MaterialIcons name="cloud-done" size={32} color="#ffffff" />
                  </LinearGradient>
                </View>
                <Text style={styles.successTitle}>Score Submitted!</Text>
                <Text style={styles.successDesc}>
                  Your True/False Quiz score ({Math.min(tfScore, (activeTfPlayer?.tfQuestions || []).length)}/{(activeTfPlayer?.tfQuestions || []).length}) has been submitted to the teacher portal.
                </Text>

                <TouchableOpacity
                  style={styles.successDoneBtn}
                  onPress={() => {
                    setShowTfSuccessUpload(false);
                    setActiveTfPlayer(null);
                  }}
                  activeOpacity={0.8}
                >
                  <LinearGradient colors={['#10B981', '#059669']} style={styles.successDoneGradient}>
                    <Text style={styles.successDoneText}>Done</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Modal>
      )}

      <PremiumDateTimePicker
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        value={datePickerValue}
        title={datePickerTitle}
        onSelect={(val) => {
          if (datePickerTarget === 'start') {
            setFormStart(val);
          } else if (datePickerTarget === 'deadline') {
            setFormDeadline(val);
          }
        }}
      />

    </SafeAreaView>
  );
};

// ── HIGH-QUALITY RESPONSIVE VECTOR DIAGRAMS RENDERER ──
interface DiagramRendererProps {
  name: string;
  onImageAspectMeasured?: (aspect: number) => void;
}
const DiagramRenderer: React.FC<DiagramRendererProps> = ({ name, onImageAspectMeasured }) => {
  if (!name) return null;
  const normName = name.trim().toUpperCase();
  
  if (
    name.startsWith('file:') || 
    name.startsWith('content:') || 
    name.startsWith('http:') || 
    name.startsWith('https:') || 
    name.startsWith('data:') || 
    name.startsWith('blob:') ||
    name.includes('/') || 
    name.includes('\\') ||
    name.includes('.')
  ) {
    return (
      <Image 
        source={{ uri: name }} 
        style={{ width: '100%', height: '100%' }} 
        resizeMode="contain" 
        onLoad={(e) => {
          const w = e.nativeEvent?.source?.width;
          const h = e.nativeEvent?.source?.height;
          if (w && h && h > 0 && onImageAspectMeasured) {
            onImageAspectMeasured(w / h);
          }
        }}
      />
    );
  }
  if (normName === 'FACE' || normName === 'PRESET_FACE') {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 400 320" preserveAspectRatio="none">
        {/* Face Skin */}
        <Circle cx="200" cy="170" r="82" fill="#FED7AA" stroke="#F97316" strokeWidth="3" />
        
        {/* Hair */}
        <Path d="M 120 150 C 120 70, 280 70, 280 150 C 295 125, 275 55, 200 55 C 125 55, 105 125, 120 150 Z" fill="#451A03" />
        <Path d="M 116 132 Q 200 78 284 132" stroke="#451A03" strokeWidth="14" strokeLinecap="round" fill="none" />
        
        {/* Eyes */}
        <Circle cx="165" cy="155" r="15" fill="#ffffff" stroke="#334155" strokeWidth="2.5" />
        <Circle cx="165" cy="155" r="7.5" fill="#2563eb" />
        <Circle cx="167.5" cy="152.5" r="3.2" fill="#ffffff" />
        
        <Circle cx="235" cy="155" r="15" fill="#ffffff" stroke="#334155" strokeWidth="2.5" />
        <Circle cx="235" cy="155" r="7.5" fill="#2563eb" />
        <Circle cx="237.5" cy="152.5" r="3.2" fill="#ffffff" />

        {/* Eyebrows */}
        <Path d="M 148 134 Q 165 124 182 135" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <Path d="M 218 135 Q 235 124 252 134" stroke="#451A03" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        
        {/* Nose */}
        <Path d="M 200 148 Q 192 186 200 186 Q 208 186 200 186" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        
        {/* Lips / Mouth */}
        <Path d="M 175 215 Q 200 238 225 215 Q 200 219 175 215" fill="#f43f5e" stroke="#be123c" strokeWidth="2.2" />
        <Line x1="172" y1="215" x2="228" y2="215" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" />
      </Svg>
    );
  }
  if (normName === 'SKELETON' || normName === 'PRESET_SKELETON') {
    return (
      <Svg width="100%" height="100%" viewBox="0 0 400 320" preserveAspectRatio="none">
        {/* Skull */}
        <Rect x="186" y="44" width="28" height="30" rx="11" fill="#f1f5f9" stroke="#475569" strokeWidth="2.5" />
        <Rect x="191" y="68" width="18" height="11" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        <Circle cx="194" cy="56" r="3.5" fill="#475569" />
        <Circle cx="206" cy="56" r="3.5" fill="#475569" />
        
        {/* Spine */}
        <Line x1="200" y1="78" x2="200" y2="206" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
        
        {/* Ribcage */}
        <Path d="M 176 108 Q 200 114 224 108 M 171 126 Q 200 132 229 126 M 173 144 Q 200 150 227 144 M 177 162 Q 200 168 223 162" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        
        {/* Shoulders */}
        <Line x1="168" y1="100" x2="232" y2="100" stroke="#475569" strokeWidth="5.5" strokeLinecap="round" />
        <Circle cx="168" cy="100" r="4.5" fill="#475569" />
        <Circle cx="232" cy="100" r="4.5" fill="#475569" />
        
        {/* Arms */}
        <Line x1="168" y1="100" x2="152" y2="148" stroke="#475569" strokeWidth="3" />
        <Circle cx="152" cy="148" r="3.5" fill="#475569" />
        <Line x1="152" y1="148" x2="145" y2="188" stroke="#475569" strokeWidth="3" />
        
        <Line x1="232" y1="100" x2="248" y2="148" stroke="#475569" strokeWidth="3" />
        <Circle cx="248" cy="148" r="3.5" fill="#475569" />
        <Line x1="248" y1="148" x2="255" y2="188" stroke="#475569" strokeWidth="3" />
        
        {/* Pelvis */}
        <Path d="M 180 200 Q 200 216 220 200 L 214 218 L 186 218 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
        
        {/* Legs */}
        <Line x1="188" y1="218" x2="182" y2="260" stroke="#475569" strokeWidth="3.5" />
        <Circle cx="182" cy="260" r="4.2" fill="#475569" />
        <Line x1="182" y1="260" x2="178" y2="300" stroke="#475569" strokeWidth="3" />
        
        <Line x1="212" y1="218" x2="218" y2="260" stroke="#475569" strokeWidth="3.5" />
        <Circle cx="218" cy="260" r="4.2" fill="#475569" />
        <Line x1="218" y1="260" x2="222" y2="300" stroke="#475569" strokeWidth="3" />
      </Svg>
    );
  }
  // Plant Cell fallback
  return (
    <Svg width="100%" height="100%" viewBox="0 0 400 320" preserveAspectRatio="none">
      <Path d="M 120 60 L 280 60 L 340 160 L 280 260 L 120 260 L 60 160 Z" fill="#e8f5e9" stroke="#2e7d32" strokeWidth="4.5" strokeLinejoin="round" />
      <Path d="M 125 66 L 275 66 L 330 160 L 275 254 L 125 254 L 70 160 Z" fill="#f1f8e9" stroke="#81c784" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Vacuole */}
      <Path d="M 175 115 Q 235 85 275 135 Q 295 195 235 225 Q 145 215 145 165 Q 145 125 175 115 Z" fill="#e0f7fa" stroke="#4dd0e1" strokeWidth="2.5" />
      <SvgText x="195" y="165" fill="#00838f" fontSize="11" fontWeight="bold">Vacuole</SvgText>
      
      {/* Nucleus */}
      <Circle cx="125" cy="145" r="26" fill="#f3e8ff" stroke="#9c27b0" strokeWidth="2.5" />
      <Circle cx="120" cy="140" r="9.5" fill="#ba68c8" />
      
      {/* Mitochondria */}
      <Rect x="265" y="80" width="20" height="11" rx="5.5" fill="#ffebee" stroke="#e91e63" strokeWidth="1.5" transform="rotate(35, 265, 80)" />
      <Rect x="110" y="210" width="20" height="11" rx="5.5" fill="#ffebee" stroke="#e91e63" strokeWidth="1.5" transform="rotate(-25, 110, 210)" />
    </Svg>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 82, 204, 0.05)',
    zIndex: 10,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  // ===== CONTAINER =====
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  // ===== PREMIUM HERO CARD =====
  heroCard: {
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#003d9b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  heroBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#93C5FD',
    letterSpacing: 1,
  },
  heroDate: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  heroStatNum: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  heroStatLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 3,
  },
  heroProgressRow: {
    flexDirection: 'row',
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  heroProgressSegment: {
    height: '100%',
    borderRadius: 3,
    opacity: 0.85,
  },
  // Old stat card styles kept for compatibility
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'flex-start',
    gap: 4,
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  // ===== FILTERS =====
  filterSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  filterScroll: {
    gap: 8,
    paddingBottom: 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1.5,
  },
  filterChipActive: {
    backgroundColor: '#003d9b',
    borderColor: '#003d9b',
    shadowColor: '#003d9b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  filterChipInactive: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(0,0,0,0.07)',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  filterChipTextInactive: {
    color: '#64748B',
  },
  // ===== SEARCH =====
  searchSection: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 4,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '600',
  },
  searchClearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ===== LIST =====
  listSection: {
    marginBottom: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#041b3c',
  },
  counterBadge: {
    backgroundColor: 'rgba(0, 61, 155, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  counterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003d9b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 36,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.04)',
  },
  emptyText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#737685',
    marginTop: 8,
  },
  // ===== CARDS =====
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#003d9b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  cardTopBand: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  bandCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  bandContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  bandLeft: {
    flex: 1,
    marginRight: 12,
  },
  bandRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  cardTitleBand: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  cardSubtitleBand: {
    fontSize: 11.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  typePillBand: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typePillBandText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  refTextBand: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.75)',
  },
  refPillBand: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bandEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  bandEyebrowText: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.2,
  },
  cardBody: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 11,
    backgroundColor: '#ffffff',
  },
  bodySeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: -2,
  },
  // Info capsule pair row
  infoRowPair: {
    flexDirection: 'row',
  },
  infoCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    gap: 7,
  },
  infoCapsuleIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCapsuleText: {
    flex: 1,
  },
  infoCapsuleLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCapsuleValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  // Teacher row
  teacherRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teacherAvatarNew: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherAvatarTextNew: {
    fontSize: 13,
    fontWeight: '900',
  },
  teacherTextNew: {
    gap: 0,
  },
  teacherLabelNew: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  teacherNameNew: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  spacer: {
    flex: 1,
  },
  deadlineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  deadlineChipSubLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#F87171',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deadlineChipText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#C53030',
  },
  // Compact date row
  compactDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  compactDateDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  compactDateStart: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#475569',
    flex: 1,
  },
  compactDateDeadline: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#BE2F2F',
    flex: 1,
    textAlign: 'right',
    marginRight: 6,
  },
  cardActionsNew: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingTop: 2,
  },
  editBtnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: '#ffffff',
  },
  editBtnTextNew: {
    fontSize: 12,
    fontWeight: '800',
  },
  detailBtnGradient: {
    borderRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  detailBtnNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 14,
  },
  detailBtnTextNew: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleBlock: {
    flex: 1,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.4,
  },
  sNoPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  sNoPillText: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '800',
  },
  menuButton: {
    padding: 4,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748b',
  },
  headerBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#0f172a',
  },
  refText: {
    fontSize: 9.5,
    color: '#64748b',
    fontWeight: '800',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginVertical: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1.2,
    gap: 8,
  },
  infoColRight: {
    flex: 0.8,
    alignItems: 'flex-end',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 6,
    marginTop: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#000000',
  },
  teacherBadgeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  teacherAvatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 82, 204, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherAvatarTextMini: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#003d9b',
  },
  teacherLabelMini: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  teacherNameMini: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0f172a',
  },
  timelineRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  timelineDateText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
  },
  cardActionsCompact: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtnOutlineCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 61, 155, 0.15)',
  },
  actionBtnTextOutlineCompact: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#003d9b',
  },
  actionBtnPrimaryCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#003d9b',
  },
  actionBtnTextPrimaryCompact: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#ffffff',
  },
  badgeClass: {
    backgroundColor: '#EEF2FF',
  },
  badgeCourse: {
    backgroundColor: '#F3E8FF',
  },
  badgeBlue: {
    backgroundColor: '#E0F2FE',
  },
  badgeGreen: {
    backgroundColor: '#DCFCE7',
  },
  badgeYellow: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0f172a',
  },
  // ===== PAGINATION =====
  paginationSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
  },
  paginationInfo: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#737685',
  },
  paginationControls: {
    flexDirection: 'row',
    gap: 8,
  },
  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.08)',
  },
  pageBtnActive: {
    backgroundColor: '#003d9b',
    borderColor: '#003d9b',
  },
  pageBtnDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: 'rgba(0, 82, 204, 0.04)',
    opacity: 0.6,
  },
  pageBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#003d9b',
  },
  pageBtnTextActive: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  pageBtnTextDisabled: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
  },
  // ===== FAB FLOATING ACTION BUTTON =====
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#003d9b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ===== MODAL / BOTTOM SHEET =====
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 27, 60, 0.55)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#ffffff', // Clean white background
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 82, 204, 0.05)',
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#041b3c',
    letterSpacing: -0.4,
  },
  sheetSubNo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#737685',
    marginTop: 2,
  },
  closeSheetBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScroll: {
    padding: 20,
  },
  sheetTitleBlock: {
    marginBottom: 20,
  },
  sheetAssignmentName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  sheetBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sheetDetailsGrid: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.03)',
    gap: 16,
    marginBottom: 24,
  },
  sheetGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  sheetGridCol: {
    flex: 1,
    gap: 2,
  },
  sheetGridDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 4,
  },
  sheetLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#737685',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sheetValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#041b3c',
    marginTop: 2,
  },
  sheetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 30,
  },
  sheetActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  sheetBtnReport: {
    backgroundColor: 'rgba(0, 61, 155, 0.04)',
    borderColor: 'rgba(0, 61, 155, 0.08)',
  },
  sheetBtnEdit: {
    backgroundColor: 'rgba(0, 61, 155, 0.04)',
    borderColor: 'rgba(0, 61, 155, 0.08)',
  },
  sheetBtnDelete: {
    backgroundColor: 'rgba(186, 26, 26, 0.04)',
    borderColor: 'rgba(186, 26, 26, 0.08)',
  },
  sheetActionBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#003d9b',
  },
  // ===== DETAIL MODAL NEW STYLES =====
  detailBand: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  detailBandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailBandLeft: {
    flex: 1,
    marginRight: 10,
  },
  detailBandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginTop: 6,
    marginBottom: 4,
  },
  detailBandSub: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.78)',
  },
  detailCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  refBandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  refBandText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.85)',
  },
  // Detail info sections
  detailSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  detailSectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  detailIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRowText: {
    flex: 1,
  },
  detailRowLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  detailRowValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
    marginLeft: 48,
  },
  // Timeline strip
  timelineStrip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineSide: {
    flex: 1,
  },
  timelineMid: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  timelineLine: {
    height: 2,
    backgroundColor: '#E2E8F0',
    width: '100%',
    borderRadius: 1,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  timelineTag: {
    fontSize: 9,
    fontWeight: '900',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  timelineDate: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#334155',
  },
  // Detail action buttons
  detailActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  detailActionReport: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: 'rgba(59,79,216,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(59,79,216,0.15)',
  },
  detailActionEdit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  detailActionDelete: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: 'rgba(190,47,47,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(190,47,47,0.15)',
  },
  detailActionText: {
    fontSize: 12,
    fontWeight: '900',
  },
  // ===== FORM CREATION REDESIGNED =====
  createModalBand: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  createModalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createModalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createModalIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  createModalTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  createModalSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 3,
  },
  createModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    gap: 18,
    paddingBottom: 40,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderColor: '#E9F1FB',
    padding: 20,
    gap: 18,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  formCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFE6', // soft warm line
    paddingBottom: 12,
    marginBottom: 4,
  },
  formHeaderIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCardHeader: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#1E293B', // dark slate
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  formField: {
    gap: 7,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  formLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  requiredStar: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '900',
  },
  formSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  selectTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formSelectText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  formSelectPlaceholder: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  formDropdownOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#E4DEC6',
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  formDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F6F0',
  },
  formDropdownItemActive: {
    backgroundColor: '#FAF8F0',
  },
  formDropdownItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  formDropdownItemTextActive: {
    color: '#003d9b',
    fontWeight: '900',
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
  },
  postButton: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 52,
    marginTop: 8,
    shadowColor: '#0052CC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  postBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  blanksStepSubtitle: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 4,
  },
  /* ---- Create Blanks Card (premium redesign) ---- */
  blanksCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(147,197,253,0.5)',
  },
  blanksCardHeader: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(191,219,254,0.3)',
  },
  blanksCardHeaderGradient: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  blanksCardHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  blanksCardIconRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  blanksCardTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  blanksCardSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 1,
  },
  blanksStepBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  blanksStepBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  blanksCardBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: 'rgba(239,246,255,0.5)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  /* ═══ Neural Circuit AI Button ═══ */
  aiGenButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  aiGenBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 15,
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  /* Top glass shine */
  aiGenShineTop: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '45%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
  },
  /* Diagonal glass reflection streak */
  aiGenGlassSheen: {
    position: 'absolute',
    top: 0, bottom: 0, left: '25%',
    width: 35,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ skewX: '-25deg' }],
  },
  /* Refined thin circuit board design */
  circuitH1: {
    position: 'absolute',
    top: 15, right: 60,
    width: 45, height: 1,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  circuitH2: {
    position: 'absolute',
    bottom: 15, right: 65,
    width: 35, height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  circuitV1: {
    position: 'absolute',
    top: 15, right: 105,
    width: 1, height: 26,
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  /* Circuit nodes — white hot glows */
  circuitNode1: {
    position: 'absolute',
    top: 13, right: 58,
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  circuitNode2: {
    position: 'absolute',
    bottom: 13, right: 64,
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  circuitNode3: {
    position: 'absolute',
    top: 15, right: 105,
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: '#E0F2FE',
    marginTop: -2,
  },
  /* Orb wrap */
  aiGenOrbWrap: {
    position: 'relative',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Outer frosted ring */
  aiGenOrbGlassRing: {
    position: 'absolute',
    width: 50, height: 50, borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  /* Glowing brain orb */
  aiGenOrb: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  aiOrbText: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#1D4ED8',
    letterSpacing: -0.5,
  },
  aiGenOrbRing1: {
    position: 'absolute',
    width: 58, height: 58, borderRadius: 29,
    borderWidth: 1.5,
    borderColor: 'rgba(96,165,250,0.30)',
  },
  aiGenOrbRing2: {
    position: 'absolute',
    width: 68, height: 68, borderRadius: 34,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.12)',
  },
  /* Text column */
  aiGenTextCol: { flex: 1 },
  /* Blue badge */
  aiGenBadgeRow: { flexDirection: 'row', marginBottom: 4 },
  aiGenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(96,165,250,0.18)',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderWidth: 1,
    borderColor: 'rgba(147,197,253,0.40)',
    alignSelf: 'flex-start',
  },
  aiGenBadgeDot: {
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: '#60A5FA',
  },
  aiGenBadgeText: {
    fontSize: 8.5, fontWeight: '800',
    color: '#93C5FD', letterSpacing: 1.1,
  },
  /* Title */
  aiGenBtnTitle: {
    fontSize: 15, fontWeight: '900',
    color: '#ffffff', letterSpacing: 0.15,
    textShadowColor: 'rgba(255,255,255,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  /* Subtitle */
  aiGenBtnSubtitle: {
    fontSize: 11, color: '#E0F2FE',
    fontWeight: '600', marginTop: 2,
    opacity: 0.9,
  },
  /* White arrow chip */
  aiGenArrowPill: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: '#ffffff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 5,
    elevation: 4,
  },
  /* ── Legacy stubs ── */
  aiGenGoldBorder: { borderRadius: 20, overflow: 'hidden' },
  aiGenBottomGlow: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1 },
  aiGenShimmerBand: { position: 'absolute', top: 0, bottom: 0, left: '55%', width: 60, backgroundColor: 'rgba(255,255,255,0.04)' },
  aiGenStar1: { position: 'absolute', top: 8, right: 55 },
  aiGenStar2: { position: 'absolute', bottom: 8, right: 80 },
  aiGenStar3: { position: 'absolute', top: 10, right: 100 },
  aiGenOrbRing: { position: 'absolute', width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  aiGenIconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  aiGenLaunchChip: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  aiGenOuterGlow: { borderRadius: 18, padding: 1.5, overflow: 'hidden' },
  aiGenGlassHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 1 },
  aiGenGlassReflection: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1 },
  aiGenTopHighlight: { position: 'absolute', top: 0, left: 0, right: 0, height: 1 },
  aiGenIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  aiGenArrowBox: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  aiGenBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '800' },
  aiGenBtnShimmer: { position: 'absolute', top: 0, left: 0, right: 0, height: 20 },
  aiGenBtnIconWrap: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  aiGenBtnArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  aiGenTextColLegacy: { flex: 1 },
  /* Divider with tech scanning line */
  blanksDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 4,
  },
  blanksDividerLineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(37,99,235,0.25)',
  },
  blanksDividerLineRight: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(37,99,235,0.25)',
  },
  blanksDividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
    opacity: 0.7,
  },
  blanksDividerLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 1.8,
    opacity: 0.85,
  },
  /* Scanner input wrapper and brackets */
  blanksInputWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#ffffff',
  },
  bracketLine: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
    zIndex: 10,
    opacity: 0.85,
  },
  bracketTopLeftH: { top: 0, left: 0, width: 12, height: 2 },
  bracketTopLeftV: { top: 0, left: 0, width: 2, height: 12 },
  bracketTopRightH: { top: 0, right: 0, width: 12, height: 2 },
  bracketTopRightV: { top: 0, right: 0, width: 2, height: 12 },
  bracketBottomLeftH: { bottom: 0, left: 0, width: 12, height: 2 },
  bracketBottomLeftV: { bottom: 0, left: 0, width: 2, height: 12 },
  bracketBottomRightH: { bottom: 0, right: 0, width: 12, height: 2 },
  bracketBottomRightV: { bottom: 0, right: 0, width: 2, height: 12 },
  inputTechHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(147,197,253,0.25)',
  },
  techHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  techHeaderTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 1,
  },
  inputTerminalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(37,99,235,0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  inputTerminalTagText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.8,
  },
  /* Text Area - Premium double-border effect and soft inner shadow */
  blanksTextArea: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    minHeight: 180,
    lineHeight: 24,
  },
  /* Interactive Blanks Viewport */
  interactiveBlanksContainer: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 16,
    padding: 16,
    minHeight: 220,
    overflow: 'hidden',
  },
  interactiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 8,
  },
  interactiveInstruction: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#2563EB',
    letterSpacing: 1,
  },
  wordsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingBottom: 8,
  },
  interactiveWordChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    margin: 4,
  },
  interactiveWordChipSelected: {
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  interactiveWordText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },
  interactiveWordTextSelected: {
    color: '#2563EB',
    fontWeight: '800',
  },
  blanksCharCount: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 8,
    marginRight: 4,
  },
  /* Bottom Action Row */
  stepButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  prevButton: {
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  prevButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  prevButtonText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.1,
  },
  selectBlankBtn: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  selectBlankGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  selectBlankBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 18,
  },
  postButtonBlanks: {
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  postBtnGradient2: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardWatermark: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    opacity: 0.12,
  },
  /* ═══ Multi-step Blanks Setup Navigation & Views ═══ */
  blanksStepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 4,
    marginTop: 8,
  },
  blanksStepTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  blanksStepNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navPrevButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  navPrevText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  navNextButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 11,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  navNextText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  /* Blanks Step Bottom Area */
  blanksBottomContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
    width: '100%',
  },
  selectedPillsContainer: {
    flex: 1.1,
    minHeight: 50,
  },
  pillsSectionLabel: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  selectedPillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedWordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
    gap: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedWordPillText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    maxWidth: 70,
  },
  selectedWordPillDelete: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBlankBtnWrapper: {
    flex: 0.9,
    alignSelf: 'flex-end',
  },
  /* Theme Selection Step */
  themeStepContent: {
    padding: 16,
    backgroundColor: 'rgba(239,246,255,0.4)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(191,219,254,0.4)',
    marginBottom: 10,
  },
  addThemeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
    alignItems: 'center',
  },
  addThemeInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
  },
  addThemeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addThemeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  themeSectionTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 1.2,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
    paddingBottom: 12,
  },
  themeCard: {
    width: (width - 64 - 16) / 3, // fits 3 cards per row inside modal container
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#E2E8F0',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  themeCardActive: {
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  themeImage: {
    width: '100%',
    height: '100%',
  },
  themeCheckBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  /* Generate Step View */
  generateStepContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(191,219,254,0.4)',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  generateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37,99,235,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.15)',
  },
  generateHeaderTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  generateHeaderSub: {
    fontSize: 13.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  generateBannerGrad: {
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  generateBannerIconRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  generateBannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  generateBannerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  generateBannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  generateBannerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  generateOutputBtn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  generateOutputGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateOutputText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  playerTriggerBtn: {
    marginTop: 14,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  playerTriggerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  playerTriggerBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  playerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  playerHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  playerExitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  playerHeaderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  playerScoreBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playerScoreBadgeLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  playerScroll: {
    flex: 1,
  },
  playerSettingsPanel: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  playerSizer: {
    flex: 1.2,
  },
  playerSettingsText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  customSizerTrack: {
    flex: 1,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  customSizerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  sizerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  sizerDotActive: {
    backgroundColor: 'rgba(37,99,235,0.1)',
  },
  sizerDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  sizerDotInnerActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  fontSizeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4,
  },
  playerSettingsDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  playerFontSelector: {
    flex: 0.8,
  },
  playerFontDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  playerFontDropdownText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  playerInstructionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    gap: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  playerInstructionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(37,99,235,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInstructionsText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    color: '#1E40AF',
  },
  playerMainCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  playerParagraphText: {
    lineHeight: 38,
    color: '#1E293B',
    fontWeight: '500',
  },
  playerBlankSlot: {
    height: 32,
    minWidth: 90,
    marginHorizontal: 4,
    marginVertical: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    alignSelf: 'center',
  },
  playerBlankSlotEmpty: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  playerBlankSlotFilled: {
    backgroundColor: '#0D9488',
    borderRadius: 8,
  },
  playerBlankSlotActive: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  playerBlankSlotCorrect: {
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  playerBlankSlotIncorrect: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
  },
  playerBlankSlotText: {
    fontWeight: '700',
  },
  playerBlankSlotTextEmpty: {
    color: '#3B82F6',
  },
  playerBlankSlotTextFilled: {
    color: '#ffffff',
  },
  playerBlankSlotTextSubmitted: {
    color: '#ffffff',
  },
  playerOptionsTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  playerOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  playerOptionPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0D9488',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  playerOptionPillSelected: {
    backgroundColor: '#0F766E',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  playerOptionPillUsed: {
    backgroundColor: '#94A3B8',
    opacity: 0.4,
  },
  playerOptionPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  playerOptionPillTextSelected: {
    color: '#ffffff',
  },
  playerOptionPillTextUsed: {
    color: '#CBD5E1',
  },
  playerSubmitBtn: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  playerSubmitGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerSubmitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  successIconRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconRingGrad: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  successDoneBtn: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  successDoneGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successDoneText: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  /* Step Footer Navigation Buttons */
  stepFooterButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  stepFooterBtn: {
    flex: 1,
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  stepFooterBtnPrev: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#ffffff',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  stepFooterBtnNext: {
    borderWidth: 0,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 7,
  },
  stepFooterTextPrev: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  stepFooterTextNext: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  /* Mini Preview Card */
  miniPreviewContainer: {
    width: '100%',
    height: 250,
    borderRadius: 18,
    overflow: 'hidden',
    marginVertical: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  miniPreviewBg: {
    flex: 1,
    padding: 12,
  },
  miniPreviewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.4)',
  },
  miniPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  miniPreviewTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  miniPreviewScoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  miniPreviewScoreText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  miniPreviewParagraphCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 10,
    flex: 1,
    marginBottom: 8,
  },
  miniPreviewWordText: {
    fontSize: 11,
    color: '#1E293B',
    lineHeight: 18,
  },
  miniPreviewBlankSlot: {
    height: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 8,
    marginHorizontal: 2,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPreviewBlankText: {
    fontSize: 10,
  },
  miniPreviewOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
    paddingBottom: 4,
  },
  miniPreviewOptionPill: {
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  miniPreviewOptionText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  /* ---- Match Column Builder Styles ---- */
  matchCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(191,219,254,0.5)',
  },
  matchContentContainer: {
    padding: 16,
    gap: 14,
  },
  matchInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  matchInputCol: {
    flex: 1.2,
  },
  matchInputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  matchTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  matchInputRightWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  clearMatchInputs: {
    position: 'absolute',
    right: 12,
    top: 18,
    zIndex: 10,
  },
  addPairBtn: {
    marginLeft: 10,
    height: 52,
    borderRadius: 13,
    overflow: 'hidden',
    minWidth: 72,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 7,
  },
  addPairBtnGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    gap: 2,
  },
  addPairBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  pairsTableContainer: {
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  pairsTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  pairsTableHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.4,
  },
  pairsTableScroll: {
    maxHeight: 200,
  },
  pairTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF6FF',
    minHeight: 52,
  },
  pairTableCell: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  pairDeleteCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPairsState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 6,
  },
  emptyPairsText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
  },
  /* Mini Preview Match Styles */
  miniPreviewMatchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  miniPreviewMatchLeftCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(147,197,253,0.5)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  miniPreviewMatchRightCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1.5,
    borderColor: 'rgba(147,197,253,0.5)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  miniPreviewMatchCardText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  miniPreviewMatchLine: {
    width: 32,
    height: 1.5,
    backgroundColor: 'rgba(37,99,235,0.4)',
    marginHorizontal: 8,
  },
  /* ---- Match Player Screen Styles ---- */
  matchHeaderBlock: {
    width: '95%',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  matchHeaderTitleText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  matchHeaderSubText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  matchHeaderScorePill: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  matchHeaderScoreText: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  matchScoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  matchGridContainer: {
    width: '95%',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  matchPlayerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    marginVertical: 8,
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  matchPlayerCardSelected: {
    borderColor: '#F59E0B',
    borderWidth: 2.5,
    backgroundColor: '#FFFBEB',
  },
  matchPlayerCardMatched: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  matchPlayerCardText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    paddingLeft: 12,
  },
  matchConnectorDot: {
    position: 'absolute',
    alignSelf: 'center',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  /* ---- Generate Step Premium Header ---- */
  generateTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(147,197,253,0.4)',
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  generateTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  generateTopIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  generateTopTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  generateTopSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.1,
  },
  generateReadyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
  },
  generateReadyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  generateReadyText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 1.2,
  },
  generateDivider: {
    height: 1,
    backgroundColor: 'rgba(147,197,253,0.3)',
    marginVertical: 12,
    borderRadius: 1,
  },
});

