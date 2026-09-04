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

export const ComplainScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Screen States
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [successToastVisible, setSuccessToastVisible] = useState(false);
  const [editingComplain, setEditingComplain] = useState<any | null>(null);

  // List State matching desktop mockup
  const [complainsList, setComplainsList] = useState([
    {
      id: '1',
      userType: 'Guardian',
      complainAgainst: 'JAHANGIR KHAN [Role: Guardian]',
      complainType: 'dfd',
      complainDesc: 'fgf',
      complainDate: '15 Jun 2026',
      status: 'pending',
      createdAt: '15 Jun 2026 02:07 PM',
      updatedAt: '15 Jun 2026 02:07 PM',
    }
  ]);

  // Form Fields States
  const [userType, setUserType] = useState('Guardian');
  const [complainAgainst, setComplainAgainst] = useState('JAHANGIR KHAN');
  const [complainType, setComplainType] = useState('');
  const [complainDate, setComplainDate] = useState('08/06/2026'); // Today's date
  const [complainDesc, setComplainDesc] = useState('');

  // Active Picker Modal State
  const [activePicker, setActivePicker] = useState<'userType' | 'complainAgainst' | null>(null);

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

  // Open form to Create
  const handleOpenCreateForm = () => {
    setEditingComplain(null);
    setUserType('Guardian');
    setComplainAgainst('JAHANGIR KHAN');
    setComplainType('');
    setComplainDate('08/06/2026');
    setComplainDesc('');
    setFormVisible(true);
  };

  // Open form to Edit
  const handleOpenEditForm = (complain: any) => {
    setEditingComplain(complain);
    setUserType(complain.userType);
    
    // Extract name before role brackets
    const namePart = complain.complainAgainst.split(' [')[0];
    setComplainAgainst(namePart);
    
    setComplainType(complain.complainType);
    setComplainDate(complain.complainDate);
    setComplainDesc(complain.complainDesc);
    setFormVisible(true);
  };

  // Delete Complain Action
  const handleDeleteComplain = (id: string) => {
    Alert.alert(
      'Delete Complain',
      'Are you sure you want to delete this complain record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setComplainsList(prev => prev.filter(item => item.id !== id));
          } 
        }
      ]
    );
  };

  // Submit form (Create / Edit)
  const handleSubmitForm = () => {
    if (!complainType.trim() || !complainDesc.trim()) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const todayStr = '08/06/2026';
    const currentTimeStr = '08/06/2026 11:15 PM';

    if (editingComplain) {
      // Edit mode
      setComplainsList(prev => prev.map(item => {
        if (item.id === editingComplain.id) {
          return {
            ...item,
            userType,
            complainAgainst: `${complainAgainst} [Role: ${userType}]`,
            complainType,
            complainDate,
            complainDesc,
            updatedAt: currentTimeStr
          };
        }
        return item;
      }));
    } else {
      // Create mode
      const newComplain = {
        id: Date.now().toString(),
        userType,
        complainAgainst: `${complainAgainst} [Role: ${userType}]`,
        complainType,
        complainDesc,
        complainDate,
        status: 'pending',
        createdAt: currentTimeStr,
        updatedAt: currentTimeStr
      };
      setComplainsList(prev => [newComplain, ...prev]);
    }

    setFormVisible(false);
    setSuccessToastVisible(true);
    setTimeout(() => {
      setSuccessToastVisible(false);
    }, 2500);
  };

  // Filter complains
  const filteredComplains = complainsList.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.complainAgainst.toLowerCase().includes(query) ||
      item.complainType.toLowerCase().includes(query) ||
      item.complainDesc.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  const getStatusColor = (status: string) => {
    if (status === 'resolved') {
      return { bg: 'rgba(76, 175, 80, 0.08)', text: '#4CAF50', border: 'rgba(76, 175, 80, 0.15)' };
    }
    return { bg: 'rgba(255, 179, 0, 0.08)', text: '#FFB300', border: 'rgba(255, 179, 0, 0.15)' }; // Pending
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complain View</Text>
        </View>
        <TouchableOpacity style={styles.createFABHeaderBtn} onPress={handleOpenCreateForm}>
          <MaterialIcons name="add" size={18} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.createFABBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Success Toast */}
      {successToastVisible && (
        <View style={styles.toast}>
          <MaterialIcons name="check-circle" size={20} color="#fff" />
          <Text style={styles.toastText}>
            Complain {editingComplain ? 'updated' : 'registered'} successfully!
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Complain View List Title */}
        <View style={styles.recordsHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <MaterialIcons name="feedback" size={18} color={theme.colors.onSurface} />
            <Text style={styles.recordsSectionTitle}>Complain List</Text>
          </View>

        </View>

        {/* Search input field */}
        <View style={styles.searchWrapper}>
          <MaterialIcons name="search" size={20} color={theme.colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search complains, type or target..."
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

        {/* Complains Cards List rendering */}
        {filteredComplains.length === 0 ? (
          <View style={[styles.emptyContainer, theme.shadows.level1]}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="feedback" size={48} color={theme.colors.outline} />
            </View>
            <Text style={styles.emptyTitle}>No Complains Registered</Text>
            <Text style={styles.emptyDesc}>No complains matching your description were found. Press "Create" to register one.</Text>
          </View>
        ) : (
          <View style={styles.complainList}>
            {filteredComplains.map((item) => {
              const statusStyle = getStatusColor(item.status);
              return (
                <View key={item.id} style={[styles.complainCard, theme.shadows.level1]}>
                  {/* Accent colored left strip */}
                  <View style={[styles.cardLeftStrip, { backgroundColor: statusStyle.text }]} />
                  
                  {/* Card Content details */}
                  <View style={styles.complainCardContent}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.complainAgainstText}>{item.complainAgainst}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                      </View>
                    </View>

                    <Text style={styles.complainTypeText} numberOfLines={1}>Type: {item.complainType}</Text>
                    <Text style={styles.complainDescText}>{item.complainDesc}</Text>

                    <View style={styles.complainTimeRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="event" size={11} color={theme.colors.outline} style={{ marginRight: 4 }} />
                        <Text style={styles.timeText}>Date: {item.complainDate}</Text>
                      </View>
                      <Text style={styles.createdAtText}>Created: {item.createdAt}</Text>
                    </View>

                    {/* Actions bar at bottom of card */}
                    <View style={styles.cardActionsRow}>
                      <TouchableOpacity 
                        style={[styles.cardActionBtn, styles.editActionBtn]}
                        onPress={() => handleOpenEditForm(item)}
                      >
                        <MaterialIcons name="edit" size={14} color={theme.colors.primary} />
                        <Text style={styles.editActionText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.cardActionBtn, styles.deleteActionBtn]}
                        onPress={() => handleDeleteComplain(item.id)}
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

      {/* CREATE / EDIT COMPLAIN MODAL SHEET */}
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
              <Text style={styles.sheetHeaderTitle}>
                {editingComplain ? 'Edit Complain' : 'Create Complain'}
              </Text>
              <TouchableOpacity style={styles.sheetCloseBtn} onPress={() => setFormVisible(false)}>
                <MaterialIcons name="close" size={22} color={theme.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sheetScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.formContent}>
                
                {/* User Type dropdown */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>User Type *</Text>
                  <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('userType')}>
                    <Text style={styles.dropdownValueText}>{userType || '--Select Role--'}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={18} color={theme.colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                {/* Complain Against dropdown */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Complain Against *</Text>
                  <TouchableOpacity style={styles.formDropdown} onPress={() => setActivePicker('complainAgainst')}>
                    <Text style={styles.dropdownValueText}>{complainAgainst || '--Select--'}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={18} color={theme.colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                {/* Complain Type input */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Complain Type *</Text>
                  <TextInput
                    style={styles.formTextInput}
                    placeholder="Enter Complain Type"
                    placeholderTextColor={theme.colors.outline}
                    value={complainType}
                    onChangeText={setComplainType}
                  />
                </View>

                {/* Complain Date input */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Complain Date *</Text>
                  <View style={styles.dateInputWrapper}>
                    <TextInput
                      style={styles.dateInputText}
                      value={complainDate}
                      onChangeText={setComplainDate}
                      placeholder="dd/mm/yyyy"
                      placeholderTextColor={theme.colors.outline}
                    />
                    <MaterialIcons name="calendar-today" size={16} color={theme.colors.onSurfaceVariant} />
                  </View>
                </View>

                {/* Complain textarea */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Complain *</Text>
                  <TextInput
                    style={styles.formTextArea}
                    placeholder="Describe your complaint here..."
                    placeholderTextColor={theme.colors.outline}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={complainDesc}
                    onChangeText={setComplainDesc}
                  />
                </View>

                {/* Bottom Action buttons */}
                <View style={styles.formActionsRow}>
                  <TouchableOpacity 
                    style={[styles.formBtn, styles.createBtn]} 
                    onPress={handleSubmitForm}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.createBtnText}>
                      {editingComplain ? 'UPDATE' : 'CREATE'}
                    </Text>
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

      {/* OPTIONS PICKER DROPDOWN */}
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
              Select {activePicker === 'userType' ? 'User Type' : 'Complain Against'}
            </Text>
            
            {activePicker === 'userType' && (
              <View style={styles.pickerOptionsList}>
                {['Guardian', 'Teacher', 'Student', 'Staff'].map((r) => (
                  <TouchableOpacity 
                    key={r} 
                    style={styles.pickerOptionItem}
                    onPress={() => {
                      setUserType(r);
                      setActivePicker(null);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{r}</Text>
                    {userType === r && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activePicker === 'complainAgainst' && (
              <View style={styles.pickerOptionsList}>
                {['JAHANGIR KHAN', 'MUHAMMAD MUSTAFA', 'HIRA TAHIR', 'SAQIB JAVED'].map((n) => (
                  <TouchableOpacity 
                    key={n} 
                    style={styles.pickerOptionItem}
                    onPress={() => {
                      setComplainAgainst(n);
                      setActivePicker(null);
                    }}
                  >
                    <Text style={styles.pickerOptionText}>{n}</Text>
                    {complainAgainst === n && <MaterialIcons name="check" size={20} color={theme.colors.primary} />}
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
  createFABHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32', // Green Create button matching desktop color palette
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  createFABBtnText: {
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

  // Scroll Container
  scrollContent: {
    padding: theme.spacing.containerMargin,
    paddingBottom: 110,
    gap: 16,
  },

  // Header Title details
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

  // Search wrapper
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

  // Complain Cards list
  complainList: {
    gap: 14,
  },
  complainCard: {
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
  complainCardContent: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complainAgainstText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.onSurface,
    flex: 1,
    marginRight: 8,
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
    textTransform: 'capitalize',
  },
  complainTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  complainDescText: {
    fontSize: 12.5,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
    fontWeight: '500',
  },
  complainTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.03)',
    paddingTop: 8,
  },
  timeText: {
    fontSize: 10,
    color: theme.colors.outline,
    fontWeight: '600',
  },
  createdAtText: {
    fontSize: 9.5,
    color: theme.colors.outline,
    fontWeight: '500',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    justifyContent: 'flex-end',
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
  editActionBtn: {
    borderColor: 'rgba(0, 82, 204, 0.1)',
    backgroundColor: 'rgba(0, 82, 204, 0.04)',
  },
  editActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
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

  // Details Modal Sheet layout
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
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: theme.rounded.default,
    height: 42,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 82, 204, 0.15)',
  },
  dateInputText: {
    flex: 1,
    height: '100%',
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
  createBtn: {
    backgroundColor: '#2e7d32', // Green CREATE button matching desktop screenshot
  },
  createBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#d32f2f', // Red CANCEL button matching desktop screenshot
  },
  cancelBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Picker Modal styles
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
