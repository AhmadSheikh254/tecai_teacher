import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  Animated,
  useWindowDimensions,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const IssueScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Screen States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [successToastVisible, setSuccessToastVisible] = useState(false);

  // Issues Data matching desktop mockup
  const [issuesList, setIssuesList] = useState([
    {
      id: '1',
      asset: 'AC',
      grade: 'GRADE-V',
      room: 'Room 2B',
      issueDesc: 'asssas',
      status: 'Pending',
    }
  ]);

  // Form Fields States
  const [selectedAsset, setSelectedAsset] = useState('');
  const [selectedClass, setSelectedClass] = useState('GRADE-V');
  const [roomNumber, setRoomNumber] = useState('');
  const [issueText, setIssueText] = useState('');

  // Active Picker Modal State
  const [activePicker, setActivePicker] = useState<'asset' | 'class' | null>(null);

  // Skeleton Pulse Animation
  const [pulseAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.8,
            duration: 600,
            useNativeDriver: false
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: false
          })
        ])
      ).start();
    }
  }, [loading]);

  // Open form
  const handleOpenReportForm = () => {
    setSelectedAsset('');
    setSelectedClass('GRADE-V');
    setRoomNumber('');
    setIssueText('');
    setFormVisible(true);
  };

  // Submit form (Report Issue)
  const handleSubmitForm = () => {
    if (!selectedAsset || !issueText.trim()) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const newIssue = {
      id: Date.now().toString(),
      asset: selectedAsset,
      grade: selectedClass,
      room: roomNumber.trim() || '--',
      issueDesc: issueText.trim(),
      status: 'Pending',
    };

    setIssuesList(prev => [newIssue, ...prev]);
    setFormVisible(false);
    setSuccessToastVisible(true);
    setTimeout(() => {
      setSuccessToastVisible(false);
    }, 2500);
  };

  // Delete Issue Action
  const handleDeleteIssue = (id: string) => {
    Alert.alert(
      'Delete Issue',
      'Are you sure you want to delete this reported issue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setIssuesList(prev => prev.filter(item => item.id !== id));
          } 
        }
      ]
    );
  };

  // Filter reported issues
  const filteredIssues = issuesList.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.asset.toLowerCase().includes(query) ||
      item.grade.toLowerCase().includes(query) ||
      item.room.toLowerCase().includes(query) ||
      item.issueDesc.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status: string) => {
    if (status.toLowerCase() === 'resolved') {
      return { bg: 'rgba(76, 175, 80, 0.08)', text: '#4CAF50', border: 'rgba(76, 175, 80, 0.15)' };
    }
    return { bg: 'rgba(0, 188, 212, 0.08)', text: '#00BCD4', border: 'rgba(0, 188, 212, 0.15)' }; // Cyan Pending
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reported Issues</Text>
        </View>
        <TouchableOpacity style={styles.reportFABHeaderBtn} onPress={handleOpenReportForm}>
          <MaterialIcons name="add" size={18} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.reportFABBtnText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Success Toast */}
      {successToastVisible && (
        <View style={styles.toast}>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.toastText}>Issue reported successfully!</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Reported Issues Section Title */}
        <View style={styles.recordsHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialIcons name="build" size={18} color={theme.colors.onSurface} />
            <Text style={styles.recordsSectionTitle}>Reported Issues</Text>
          </View>
          {filteredIssues.length > 0 && (
            <View style={styles.exportBadgeRow}>
              <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Copied to clipboard')}>
                <MaterialIcons name="content-copy" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Exported to Excel')}>
                <MaterialIcons name="grid-on" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportIconBtn} onPress={() => alert('Exported to PDF')}>
                <MaterialIcons name="picture-as-pdf" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Search input field */}
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets, rooms or issue..."
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={18} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>

        {/* Issues List rendering */}
        {filteredIssues.length === 0 ? (
          <View style={[styles.emptyContainer, theme.shadows.level1]}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="build" size={48} color={theme.colors.outline} />
            </View>
            <Text style={styles.emptyTitle}>No Issues Reported</Text>
            <Text style={styles.emptyDesc}>No active maintenance reports found. Press "Report" to register a school maintenance issue.</Text>
          </View>
        ) : (
          <View style={styles.issuesList}>
            {filteredIssues.map((item) => {
              const statusStyle = getStatusColor(item.status);
              return (
                <View key={item.id} style={[styles.issueCard, theme.shadows.level1]}>
                  {/* Left accent colored strip */}
                  <View style={[styles.cardLeftStrip, { backgroundColor: statusStyle.text }]} />
                  
                  {/* Card Content details */}
                  <View style={styles.issueCardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.assetNameText}>{item.asset}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                      </View>
                    </View>

                    {/* Metadata Class and Room details */}
                    <View style={styles.metaRow}>
                      <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>Class: {item.grade}</Text>
                      </View>
                      <View style={styles.metaChip}>
                        <Text style={styles.metaChipText}>Room: {item.room}</Text>
                      </View>
                    </View>

                    <Text style={styles.issueDescText}>{item.issueDesc}</Text>

                    {/* Actions bar at bottom of card */}
                    <View style={styles.cardActionsRow}>
                      {item.status.toLowerCase() === 'pending' && (
                        <TouchableOpacity 
                          style={[styles.cardActionBtn, styles.resolveActionBtn]}
                          onPress={() => {
                            setIssuesList(prev => prev.map(i => i.id === item.id ? { ...i, status: 'Resolved' } : i));
                          }}
                        >
                          <MaterialIcons name="check-circle" size={14} color="#4CAF50" />
                          <Text style={styles.resolveActionText}>Resolve</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity 
                        style={[styles.cardActionBtn, styles.deleteActionBtn]}
                        onPress={() => handleDeleteIssue(item.id)}
                      >
                        <MaterialIcons name="delete" size={14} color="#EF4444" />
                        <Text style={styles.deleteActionText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* REPORT ISSUE BOTTOM MODAL SHEET */}
      <Modal
        visible={formVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFormVisible(false)}
      >
        <View style={styles.sheetBackdrop}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setFormVisible(false)} />
          <View style={[styles.sheetContainer, theme.shadows.level2]}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetHeaderTitle}>Maintenance Report</Text>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setFormVisible(false)}>
                <MaterialIcons name="close" size={22} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.formContent}>
                
                {/* Asset Dropdown select */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Asset *</Text>
                  <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('asset')}>
                    <Text style={styles.dropdownValueText}>{selectedAsset || '--Select asset--'}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={18} color={theme.colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                {/* Class Dropdown select */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Class</Text>
                  <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('class')}>
                    <Text style={styles.dropdownValueText}>{selectedClass || '--Select class--'}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={18} color={theme.colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                {/* Room TextInput */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Room</Text>
                  <TextInput
                    style={styles.formTextInput}
                    placeholder="Enter Room Number / Name (optional)"
                    placeholderTextColor={theme.colors.outline}
                    value={roomNumber}
                    onChangeText={setRoomNumber}
                  />
                </View>

                {/* Issue Description TextInput */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Issue *</Text>
                  <TextInput
                    style={styles.formTextArea}
                    placeholder="e.g. Fan not working"
                    placeholderTextColor={theme.colors.outline}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={issueText}
                    onChangeText={setIssueText}
                  />
                </View>

                {/* Action buttons */}
                <View style={styles.formActionsRow}>
                  <TouchableOpacity 
                    style={[styles.formBtn, styles.reportBtn]} 
                    onPress={handleSubmitForm}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.reportBtnText}>Report</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.formBtn, styles.cancelBtn]} 
                    onPress={() => setFormVisible(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelBtnText}>CANCEL</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* DROPDOWN PICKERS SELECTOR MODAL */}
      <Modal
        visible={activePicker !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <TouchableOpacity 
          style={styles.pickerBackdrop} 
          activeOpacity={1} 
          onPress={() => setActivePicker(null)}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerTitle}>
              Select {activePicker === 'asset' ? 'Asset' : 'Class'}
            </Text>
            
            {activePicker === 'asset' && (
              <View style={styles.pickerOptionsList}>
                {['AC', 'Fan', 'Projector', 'Whiteboard', 'Light', 'Computer'].map((a) => (
                  <TouchableOpacity 
                    key={a} 
                    style={styles.pickerOptionItem}
                    onPress={() => {
                      setSelectedAsset(a);
                      setActivePicker(null);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{a}</Text>
                    {selectedAsset === a && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activePicker === 'class' && (
              <View style={styles.pickerOptionsList}>
                {['GRADE-V', 'GRADE-II', 'Grade-I', 'Grade-III'].map((c) => (
                  <TouchableOpacity 
                    key={c} 
                    style={styles.pickerOptionItem}
                    onPress={() => {
                      setSelectedClass(c);
                      setActivePicker(null);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{c}</Text>
                    {selectedClass === c && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  appBar: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.containerMargin,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.headlineLgMobile.fontSize,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  reportFABHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052cc', // Blue Report button matching mockup color
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reportFABBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  // Success Toast styling
  toast: {
    position: 'absolute',
    top: 20,
    left: '10%',
    right: '10%',
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 5,
    zIndex: 9999,
  },
  toastText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Scroll content container
  scrollContent: {
    padding: theme.spacing.containerMargin,
    paddingBottom: 110,
    gap: 16,
  },

  // Section Header
  recordsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  recordsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  exportBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  exportIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Search input
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.full,
    height: 44,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: theme.colors.onSurface,
    fontSize: 13,
    fontWeight: '500',
  },

  // Issues Cards list
  issuesList: {
    gap: 14,
  },
  issueCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.lg,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.05)',
    overflow: 'hidden',
  },
  cardLeftStrip: {
    width: 5,
  },
  issueCardContent: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.onSurface,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.rounded.full,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 9.5,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  metaChip: {
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  metaChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
  },
  issueDescText: {
    fontSize: 12.5,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.03)',
    paddingTop: 8,
  },
  cardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  resolveActionBtn: {
    borderColor: 'rgba(76, 175, 80, 0.1)',
    backgroundColor: 'rgba(76, 175, 80, 0.04)',
  },
  resolveActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4CAF50',
  },
  deleteActionBtn: {
    borderColor: 'rgba(239, 68, 68, 0.1)',
    backgroundColor: 'rgba(239, 68, 68, 0.04)',
  },
  deleteActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Modal Sheet Layout
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 30,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.outlineVariant,
    alignSelf: 'center',
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  sheetHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  sheetCloseBtn: {
    padding: 4,
  },
  sheetScroll: {
    paddingHorizontal: 20,
  },
  formContent: {
    paddingVertical: 16,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  formDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.default,
    height: 42,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
  },
  dropdownValueText: {
    fontSize: 13,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  formTextInput: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.default,
    height: 42,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
    color: theme.colors.onSurface,
    fontSize: 13,
    fontWeight: '500',
  },
  formTextArea: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.default,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
    color: theme.colors.onSurface,
    fontSize: 13,
    fontWeight: '500',
  },
  formActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formBtn: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportBtn: {
    backgroundColor: '#0052cc', // Blue Report button matching desktop color palette
  },
  reportBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  cancelBtnText: {
    color: '#d32f2f', // Red cancel matching outline style
    fontSize: 13,
    fontWeight: '700',
  },

  // Picker Modal Styles
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
    paddingBottom: 8,
  },
  pickerOptionsList: {
    gap: 4,
  },
  pickerOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  pickerOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },

  // Empty state container
  emptyContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.xl,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.08)',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 82, 204, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 16,
  },
});
