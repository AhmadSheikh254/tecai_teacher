const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'screens', 'homework', 'HomeworkScreen.tsx');
const code = fs.readFileSync(filePath, 'utf8');
const lines = code.split(/\r?\n/);

let viewContent = lines.slice(711, 802).join('\n');
viewContent = viewContent.replace('style={styles.modalBackdrop}', 'style={{ flex: 1, backgroundColor: "#ffffff" }}');
viewContent = viewContent.replace('style={styles.formContainer}', 'style={{ flex: 1, backgroundColor: "#ffffff" }}');
viewContent = viewContent.replace('style={styles.formHeader}', 'style={[styles.formHeader, { paddingTop: 36 }]}');

let createContent = lines.slice(811, 962).join('\n');
createContent = createContent.replace('style={styles.modalBackdrop}', 'style={{ flex: 1, backgroundColor: "#ffffff" }}');
createContent = createContent.replace('style={styles.formContainer}', 'style={{ flex: 1, backgroundColor: "#ffffff" }}');
createContent = createContent.replace('style={styles.formHeader}', 'style={[styles.formHeader, { paddingTop: 36 }]}');

const earlyReturns = `
  // ── EARLY FULL-SCREEN RETURN: VIEW HOMEWORK DETAILS ──
  if (viewModalVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignSelf: 'center', width: '100%', maxWidth: 500 }} edges={['top', 'bottom']}>
        ${viewContent}
      </SafeAreaView>
    );
  }

  // ── EARLY FULL-SCREEN RETURN: CREATE/POST HOMEWORK ──
  if (createModalVisible) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignSelf: 'center', width: '100%', maxWidth: 500 }} edges={['top', 'bottom']}>
        ${createContent}
      </SafeAreaView>
    );
  }
`;

let returnIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('return (') && lines[i+1].includes('safeArea')) {
    returnIndex = i;
    break;
  }
}

for (let i = 705; i < 803; i++) {
  lines[i] = '';
}
for (let i = 805; i < 963; i++) {
  lines[i] = '';
}

lines[returnIndex] = earlyReturns + '\n' + lines[returnIndex];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<SafeAreaView style={styles.safeArea} edges={[\'top\']}>')) {
    lines[i] = lines[i].replace('<SafeAreaView style={styles.safeArea} edges={[\'top\']}>', '<SafeAreaView style={[styles.safeArea, { alignSelf: \'center\', width: \'100%\', maxWidth: 500 }]} edges={[\'top\']}>');
  }
}

const finalCode = lines.join('\n');
fs.writeFileSync('HomeworkScreen_test.tsx', finalCode, 'utf8');
console.log('Wrote test file.');
