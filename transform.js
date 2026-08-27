const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', '..', '..', '..', 'Desktop', 'Application', 'src', 'screens', 'assignment', 'ActivityScreen.tsx');
console.log('Target file path:', filePath);

const code = fs.readFileSync(filePath, 'utf8');
const lines = code.split(/\r?\n/);
console.log('Loaded file. Total lines:', lines.length);

// Helper function to extract lines (1-indexed, inclusive)
function getLines(start, end) {
  return lines.slice(start - 1, end).join('\n');
}

// 1. Extract details content (lines 2097 to 2351)
const detailsContent = lines.slice(2096, 2351).join('\n');

// 2. Extract create content (lines 2367 to 5298)
const createContent = lines.slice(2366, 5298).join('\n');

// 3. Extract blanks content (lines 5820 to 6086)
const blanksContent = lines.slice(5819, 6086).join('\n');

// 4. Extract match content (lines 6102 to 6378)
const matchInnerContent = lines.slice(6101, 6378).join('\n');

// 5. Extract TF player content (lines 7253 to 7962)
const tfContent = lines.slice(7252, 7962).join('\n');

console.log('Extracted details content length:', detailsContent.length);
console.log('Extracted create content length:', createContent.length);
console.log('Extracted blanks content length:', blanksContent.length);
console.log('Extracted match content length:', matchInnerContent.length);
console.log('Extracted TF content length:', tfContent.length);

// Now construct early returns block
const earlyReturns = `
  // ── EARLY FULL-SCREEN RETURN: ASSIGNMENT DETAILS ──
  if (isDetailVisible && selectedAssignment) {
    const accent = getAccentColor(selectedAssignment.type);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
          ${detailsContent}
        </View>
      </SafeAreaView>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: CREATE ASSIGNMENT ──
  if (isCreateVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }} edges={['top', 'bottom']}>
        ${createContent}
      </SafeAreaView>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: INTERACTIVE BLANKS PLAYER ──
  if (activeBlanksPlayer) {
    // Add safe guards to prevent crashes when Firestore data is incomplete
    const originalWords = activeBlanksPlayer.originalWords || [];
    const blankIndices = activeBlanksPlayer.blankIndices || [];
    const correctAnswers = activeBlanksPlayer.correctAnswers || [];
    return (
      <ImageBackground
        source={{ uri: activeBlanksPlayer.themeUrl }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.45)' }} />
        <SafeAreaView style={styles.playerContainer} edges={['top', 'bottom']}>
          <View style={styles.playerHeaderBar}>
            <TouchableOpacity style={styles.playerExitBtn} onPress={() => setActiveBlanksPlayer(null)} activeOpacity={0.7}>
              <MaterialIcons name="close" size={20} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.playerHeaderTitle}>Fill in the Blanks</Text>
            <View style={styles.playerScoreBadge}>
              <Text style={styles.playerScoreBadgeLabel}>SCORE : {playerScore}</Text>
            </View>
          </View>
          <ScrollView style={styles.playerScroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
            <View style={styles.playerSettingsPanel}>
              <View style={styles.playerSizer}>
                <Text style={styles.playerSettingsText}>Text size ({playerFontSize}px)</Text>
                <View style={styles.customSizerTrack}>
                  <View style={styles.customSizerLine} />
                  {[12, 14, 16, 18, 20, 22, 24].map((size) => {
                    const isCurrent = playerFontSize === size;
                    return (
                      <TouchableOpacity key={size} style={[styles.sizerDot, isCurrent && styles.sizerDotActive]} onPress={() => setPlayerFontSize(size)} activeOpacity={0.7}>
                        <View style={[styles.sizerDotInner, isCurrent && styles.sizerDotInnerActive]} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
              <View style={styles.playerSettingsDivider} />
              <View style={styles.playerFontSelector}>
                <Text style={styles.playerSettingsText}>Font</Text>
                <TouchableOpacity style={styles.playerFontDropdown} onPress={() => { const fonts = ['System', 'serif', 'monospace']; const idx = fonts.indexOf(playerFontFamily); setPlayerFontFamily(fonts[(idx + 1) % fonts.length]); }} activeOpacity={0.7}>
                  <Text style={styles.playerFontDropdownText}>{playerFontFamily === 'System' ? 'Arial' : playerFontFamily}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={16} color="#475569" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.playerInstructionsBar}>
              <View style={styles.playerInstructionIconBox}><MaterialIcons name="assignment" size={16} color="#2563EB" /></View>
              <Text style={styles.playerInstructionsText}>Instructions: Tap a word at the bottom, then tap any dashed blank slot to complete the paragraph, then click Submit.</Text>
            </View>
            <View style={styles.playerMainCard}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                {originalWords.map((word, idx) => {
                  const isBlank = blankIndices.includes(idx);
                  if (!isBlank) {
                    return <Text key={idx} style={[styles.playerParagraphText, { fontSize: playerFontSize, fontFamily: playerFontFamily }]}>{word}{' '}</Text>;
                  }
                  const filledText = userAnswers[idx];
                  const words2 = originalWords;
                  const correctAnswer = words2[idx] || '';
                  const isCorrect = filledText && filledText.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
                  return (
                    <TouchableOpacity key={idx} disabled={isPlayerSubmitted}
                      style={[styles.playerBlankSlot, filledText ? styles.playerBlankSlotFilled : styles.playerBlankSlotEmpty, isPlayerSubmitted && (isCorrect ? styles.playerBlankSlotCorrect : styles.playerBlankSlotIncorrect), selectedOption && !filledText && styles.playerBlankSlotActive]}
                      onPress={() => { if (selectedOption) { setUserAnswers({ ...userAnswers, [idx]: selectedOption }); setSelectedOption(null); } else if (filledText) { const n = { ...userAnswers }; delete n[idx]; setUserAnswers(n); } }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.playerBlankSlotText, filledText ? styles.playerBlankSlotTextFilled : styles.playerBlankSlotTextEmpty, isPlayerSubmitted && styles.playerBlankSlotTextSubmitted, { fontSize: playerFontSize, fontFamily: playerFontFamily }]} numberOfLines={1}>{filledText || '          '}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
            <Text style={styles.playerOptionsTitle}>Word Options</Text>
            <View style={styles.playerOptionsGrid}>
              {correctAnswers.map((opt, i) => {
                const isUsed = Object.values(userAnswers).includes(opt);
                const isSelected = selectedOption === opt;
                return (
                  <TouchableOpacity key={i} disabled={isUsed || isPlayerSubmitted} style={[styles.playerOptionPill, isSelected && styles.playerOptionPillSelected, isUsed && styles.playerOptionPillUsed]} onPress={() => setSelectedOption(isSelected ? null : opt)} activeOpacity={0.8}>
                    <Text style={[styles.playerOptionPillText, isSelected && styles.playerOptionPillTextSelected, isUsed && styles.playerOptionPillTextUsed]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.playerSubmitBtn} onPress={() => {
              if (isPlayerSubmitted) {
                setUserAnswers({}); setSelectedOption(null); setIsPlayerSubmitted(false);
                setPlayerScore(\`0/\${blankIndices.length}\`);
                setShowSuccessUpload(false);
              } else {
                const correctCount = blankIndices.reduce((acc, idx) => {
                  const ans = userAnswers[idx]; const ws = originalWords; const correct = ws[idx] || '';
                  return ans && ans.trim().toLowerCase() === correct.trim().toLowerCase() ? acc + 1 : acc;
                }, 0);
                setPlayerScore(\`\${correctCount}/\${blankIndices.length}\`);
                setIsPlayerSubmitted(true); setShowSuccessUpload(true);
              }
            }} activeOpacity={0.85}>
              <LinearGradient colors={isPlayerSubmitted ? ['#475569', '#334155'] : ['#10B981', '#059669']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.playerSubmitGradient}>
                <Text style={styles.playerSubmitBtnText}>{isPlayerSubmitted ? 'Try Again' : 'Submit'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
        <Modal visible={showSuccessUpload} transparent={true} animationType="fade" onRequestClose={() => setShowSuccessUpload(false)}>
          <View style={styles.successOverlay}>
            <View style={styles.successCard}>
              <View style={styles.successIconRing}>
                <LinearGradient colors={['#10B981', '#059669']} style={styles.successIconRingGrad}>
                  <MaterialIcons name="cloud-done" size={32} color="#ffffff" />
                </LinearGradient>
              </View>
              <Text style={styles.successTitle}>Uploaded Successfully!</Text>
              <Text style={styles.successDesc}>Your blanks assignment score ({playerScore}) has been submitted to the dashboard portal.</Text>
              <TouchableOpacity style={styles.successDoneBtn} onPress={() => { setShowSuccessUpload(false); setActiveBlanksPlayer(null); }} activeOpacity={0.8}>
                <LinearGradient colors={['#10B981', '#059669']} style={styles.successDoneGradient}>
                  <Text style={styles.successDoneText}>Done</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: MATCH THE FOLLOWING PLAYING MODAL ──
  if (activeMatchPlayer) {
    const themeConfig = getThemeColorConfig(activeMatchPlayer.themeUrl);
    const totalPairs = activeMatchPlayer.matchPairs?.length || 0;
    return (
      ${matchInnerContent}
    );
  }

  // ── EARLY FULL-SCREEN RETURN: TRUE / FALSE QUIZ PLAYER ──
  if (activeTfPlayer) {
    const tfQuestions = activeTfPlayer.tfQuestions || [];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F0F9FF' }} edges={['top', 'bottom']}>
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
          ${tfContent}
        </View>
      </SafeAreaView>
    );
  }
`;

// 6. Assemble the parts
// We insert earlyReturns right before the first line of the main return statement:
let returnIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('return (') && lines[i+1].includes('<SafeAreaView style={styles.safeArea}')) {
    returnIndex = i;
    break;
  }
}

if (returnIndex === -1) {
  console.error('Could not find main return index!');
  process.exit(1);
}

console.log('Inserting early returns at line:', returnIndex + 1);

// We need to cut out the modals from the main return tree
// We do this by replacing their lines with empty strings
// Details Modal: lines 2084 to 2357
for (let i = 2083; i < 2357; i++) {
  lines[i] = '';
}
// Create Modal: lines 2360 to 5299
for (let i = 2359; i < 5299; i++) {
  lines[i] = '';
}
// Blanks Modal: lines 5812 to 6088
for (let i = 5811; i < 6088; i++) {
  lines[i] = '';
}
// Match Modal: lines 6091 to 6381
for (let i = 6090; i < 6381; i++) {
  lines[i] = '';
}
// TF Modal: lines 7246 to 7965
for (let i = 7245; i < 7965; i++) {
  lines[i] = '';
}

// Insert earlyReturns
lines[returnIndex] = earlyReturns + '\n' + lines[returnIndex];

const finalCode = lines.join('\n');
fs.writeFileSync(filePath, finalCode, 'utf8');
console.log('Successfully wrote ActivityScreen.tsx');
