import React, { useState } from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  Platform,
  useWindowDimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

// Universal Full-Viewport Modal for Web & Mobile
const ViewportModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ visible, onClose, children }) => {
  if (!visible) return null;

  if (Platform.OS === 'web' && typeof document !== 'undefined' && (ReactDOM as any)?.createPortal) {
    return (ReactDOM as any).createPortal(
      <View style={styles.webModalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        {children}
      </View>,
      document.body
    );
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        {children}
      </View>
    </Modal>
  );
};

type SalaryRecord = {
  id: string;
  gradeName: string;
  userName: string;
  basicSalary: number;
  totalAllowance: number;
  totalDeduction: number;
  grossSalary: number;
  netSalary: number;
  createdAt: string;
  updatedAt: string;
};

export const SalaryScreen = ({ navigation }: any) => {
  const { width } = useWindowDimensions();

  // Search Query for payment history
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);
  const [successToastVisible, setSuccessToastVisible] = useState(false);

  // Exact Salary Record for Suman Iqbal as shown in uploaded web screenshot
  const [records] = useState<SalaryRecord[]>([
    {
      id: '1',
      gradeName: 'HHSQ',
      userName: 'Suman Iqbal',
      basicSalary: 10000.00,
      totalAllowance: 0.00,
      totalDeduction: 769.62,
      grossSalary: 10000.00,
      netSalary: 9230.38,
      createdAt: '13 Jul 2026 10:36 AM',
      updatedAt: '13 Jul 2026 10:36 AM',
    }
  ]);

  // Filter history list
  const filteredRecords = records.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.userName.toLowerCase().includes(query) ||
      item.gradeName.toLowerCase().includes(query) ||
      item.netSalary.toString().includes(query)
    );
  });

  const handleExportAlert = (format: string) => {
    alert(`Exported Payment Ledger as ${format} file.`);
  };

  const handleDownloadPaySlip = () => {
    setSelectedRecord(null);
    setSuccessToastVisible(true);
    setTimeout(() => setSuccessToastVisible(false), 3500);
  };

  const handlePrintPaySlip = () => {
    alert('Preparing print document for Suman Iqbal (Grade: HHSQ)...');
  };

  return (
    <View style={styles.root}>
      {/* ── CLEAN ULTRA-LIGHT OFF-WHITE BG GRADIENT ── */}
      <LinearGradient
        colors={['#FAFAFA', '#F8FAFC', '#FFFFFF']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Faint Ambient Background Orbs */}
      <View style={styles.orb1} pointerEvents="none" />
      <View style={styles.orb2} pointerEvents="none" />
      <View style={styles.orb3} pointerEvents="none" />

      {/* Decorative SVG Wave Lines */}
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill} pointerEvents="none">
        <Circle cx="85%" cy="12%" r="180" fill="rgba(254, 205, 211, 0.08)" />
        <Circle cx="15%" cy="88%" r="200" fill="rgba(225, 29, 72, 0.04)" />
        <Path d="M-40,240 Q160,120 380,260 T820,220" fill="none" stroke="rgba(225,29,72,0.04)" strokeWidth={1.5} />
        <Path d="M-20,380 Q180,280 400,420 T840,360" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={2} />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* App Bar Header */}
        <View style={styles.appBar}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={22} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Salary Payment</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="payments" size={22} color="#BE123C" />
          </TouchableOpacity>
        </View>

        {/* Success Alert Banner */}
        {successToastVisible && (
          <View style={styles.alertBanner}>
            <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
            <Text style={styles.alertBannerText}>Pay Slip PDF Downloaded Successfully!</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* MAIN PAYMENT LEDGER CARD */}
          <View style={styles.ledgerCard}>
            
            {/* Portal Title Banner */}
            <View style={styles.portalTitleBox}>
              <MaterialIcons name="receipt-long" size={18} color="#BE123C" />
              <Text style={styles.portalTitleText}>Payment Records</Text>
            </View>

            {/* Salary Record Cards */}
            <View style={styles.recordsList}>
              {records.map((item) => (
                <View key={item.id} style={styles.recordCard}>
                  <View style={styles.leftRoseAccent} />

                  {/* 1. View Action + User Name + Grade Header */}
                  <View style={styles.cardHeader}>
                    <TouchableOpacity 
                      style={styles.viewActionBtn} 
                      onPress={() => setSelectedRecord(item)}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="visibility" size={15} color="#FFFFFF" />
                      <Text style={styles.viewActionText}>View</Text>
                    </TouchableOpacity>

                    <View style={styles.headerInfoCol}>
                      <Text style={styles.userNameText}>{item.userName}</Text>
                      <View style={styles.gradeBadge}>
                        <Text style={styles.gradeBadgeText}>Grade: {item.gradeName}</Text>
                      </View>
                    </View>
                  </View>

                  {/* 2. Financial Itemized Fields Grid (Clear High-Contrast Table) */}
                  <View style={styles.fieldGrid}>
                    <View style={styles.fieldItem}>
                      <Text style={styles.fieldLabel}>BASIC SALARY</Text>
                      <Text style={styles.fieldValue}>{item.basicSalary.toFixed(2)}</Text>
                    </View>
                    <View style={styles.fieldItem}>
                      <Text style={styles.fieldLabel}>TOTAL ALLOWANCE</Text>
                      <Text style={[styles.fieldValue, { color: '#059669' }]}>{item.totalAllowance.toFixed(2)}</Text>
                    </View>
                    <View style={styles.fieldItem}>
                      <Text style={styles.fieldLabel}>TOTAL DEDUCTION</Text>
                      <Text style={[styles.fieldValue, { color: '#E11D48' }]}>{item.totalDeduction.toFixed(2)}</Text>
                    </View>
                    <View style={styles.fieldItem}>
                      <Text style={styles.fieldLabel}>GROSS SALARY</Text>
                      <Text style={styles.fieldValue}>{item.grossSalary.toFixed(2)}</Text>
                    </View>
                    
                    {/* NET SALARY HIGHLIGHT BOX */}
                    <View style={styles.netSalaryItem}>
                      <Text style={styles.netSalaryLabel}>NET SALARY</Text>
                      <Text style={styles.netSalaryValue}>PKR {item.netSalary.toFixed(2)}</Text>
                    </View>
                  </View>

                  {/* 3. Created At & Updated At Timestamps Footer */}
                  <View style={styles.timestampsFooter}>
                    <View style={styles.timestampRow}>
                      <Text style={styles.timestampLabel}>CREATED AT:</Text>
                      <Text style={styles.timestampValue}>{item.createdAt}</Text>
                    </View>
                    <View style={styles.timestampRow}>
                      <Text style={styles.timestampLabel}>UPDATED AT:</Text>
                      <Text style={styles.timestampValue}>{item.updatedAt}</Text>
                    </View>
                  </View>

                </View>
              ))}
            </View>

            {/* Pagination Controls Footer */}
            <View style={styles.paginationRow}>
              <Text style={styles.entriesText}>Showing 1 to {records.length} of {records.length} entries</Text>
              <View style={styles.paginationBtns}>
                <TouchableOpacity style={styles.pageBtnDisabled} disabled={true}>
                  <Text style={styles.pageBtnTextDisabled}>Previous</Text>
                </TouchableOpacity>
                <View style={styles.pageBtnActive}>
                  <Text style={styles.pageBtnTextActive}>1</Text>
                </View>
                <TouchableOpacity style={styles.pageBtnDisabled} disabled={true}>
                  <Text style={styles.pageBtnTextDisabled}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </ScrollView>

        {/* PAY SLIP DETAILED BREAKDOWN MODAL */}
        <ViewportModal
          visible={selectedRecord !== null}
          onClose={() => setSelectedRecord(null)}
        >
          {selectedRecord && (
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleRow}>
                  <View style={styles.modalIconBox}>
                    <MaterialIcons name="receipt-long" size={20} color="#BE123C" />
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.modalTitle}>Salary Pay Slip</Text>
                      <View style={styles.paidStatusBadge}>
                        <MaterialIcons name="check" size={12} color="#15803D" />
                        <Text style={styles.paidStatusText}>PAID</Text>
                      </View>
                    </View>
                    <Text style={styles.modalSubTitle}>Ref: #PAY-2026-{selectedRecord.id.padStart(4, '0')} • {selectedRecord.createdAt}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedRecord(null)} style={styles.closeBtn} activeOpacity={0.7}>
                  <MaterialIcons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

                <ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
                  {/* Teacher Info Card */}
                  <View style={styles.modalEmpBox}>
                    <View style={styles.modalEmpAvatar}>
                      <Text style={styles.modalEmpAvatarText}>
                        {selectedRecord.userName.split(' ').map((n: string) => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalEmpName}>{selectedRecord.userName}</Text>
                      <Text style={styles.modalEmpGrade}>Designation / Grade: {selectedRecord.gradeName}</Text>
                      <Text style={styles.modalEmpPaymentMode}>Payment Method: Bank Transfer</Text>
                    </View>
                  </View>

                  {/* Financial Itemization Table */}
                  <View style={styles.breakdownTable}>
                    <Text style={styles.tableTitle}>Salary Itemization Details</Text>
                    
                    <View style={styles.tableRow}>
                      <View style={styles.tableRowLabelGroup}>
                        <MaterialIcons name="account-balance-wallet" size={16} color="#64748B" />
                        <Text style={styles.tableRowLabel}>BASIC SALARY</Text>
                      </View>
                      <Text style={styles.tableRowValue}>PKR {selectedRecord.basicSalary.toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <View style={styles.tableRowLabelGroup}>
                        <MaterialIcons name="add-circle-outline" size={16} color="#059669" />
                        <Text style={styles.tableRowLabel}>TOTAL ALLOWANCE (+)</Text>
                      </View>
                      <Text style={[styles.tableRowValue, { color: '#059669' }]}>+ PKR {selectedRecord.totalAllowance.toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <View style={styles.tableRowLabelGroup}>
                        <MaterialIcons name="remove-circle-outline" size={16} color="#E11D48" />
                        <Text style={styles.tableRowLabel}>TOTAL DEDUCTION (-)</Text>
                      </View>
                      <Text style={[styles.tableRowValue, { color: '#E11D48' }]}>- PKR {selectedRecord.totalDeduction.toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <View style={styles.tableRowLabelGroup}>
                        <MaterialIcons name="calculate" size={16} color="#64748B" />
                        <Text style={styles.tableRowLabel}>GROSS SALARY</Text>
                      </View>
                      <Text style={styles.tableRowValue}>PKR {selectedRecord.grossSalary.toFixed(2)}</Text>
                    </View>

                    {/* Prominent Net Salary Highlight Box */}
                    <View style={styles.tableTotalRow}>
                      <View>
                        <Text style={styles.tableTotalLabel}>NET TAKE-HOME SALARY</Text>
                        <Text style={styles.tableTotalSubLabel}>Directly credited to account</Text>
                      </View>
                      <Text style={styles.tableTotalValue}>PKR {selectedRecord.netSalary.toFixed(2)}</Text>
                    </View>
                  </View>

                  {/* Audit Timestamps */}
                  <View style={styles.modalTimestampsBox}>
                    <View style={styles.modalTimestampRow}>
                      <Text style={styles.modalTimestampLabel}>RECORD CREATED:</Text>
                      <Text style={styles.modalTimestampValue}>{selectedRecord.createdAt}</Text>
                    </View>
                    <View style={styles.modalTimestampRow}>
                      <Text style={styles.modalTimestampLabel}>RECORD UPDATED:</Text>
                      <Text style={styles.modalTimestampValue}>{selectedRecord.updatedAt}</Text>
                    </View>
                    <View style={styles.modalTimestampRow}>
                      <Text style={styles.modalTimestampLabel}>STATUS AUDIT:</Text>
                      <Text style={[styles.modalTimestampValue, { color: '#15803D' }]}>Verified by Accounts Dept</Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Modal Footer Download & Print Buttons */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.printBtn} 
                    onPress={handlePrintPaySlip}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="print" size={18} color="#475569" />
                    <Text style={styles.printBtnText}>Print</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.downloadBtn} 
                    onPress={handleDownloadPaySlip}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="download" size={18} color="#FFFFFF" />
                    <Text style={styles.downloadBtnText}>Download Slip PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
        </ViewportModal>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  safeArea: { flex: 1, alignSelf: 'center', width: '100%', maxWidth: 720 },

  // Glowing ambient background circles (subtle)
  orb1: {
    position: 'absolute', top: -140, right: -120,
    width: 440, height: 440, borderRadius: 220,
    backgroundColor: 'rgba(251, 113, 133, 0.02)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -120,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(225, 29, 72, 0.02)',
  },
  orb3: {
    position: 'absolute', top: '40%', right: -100,
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(254, 205, 211, 0.02)',
  },

  // App Bar Header
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  appBarIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Alert Banner
  alertBanner: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
    backgroundColor: '#059669',
  },
  alertBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  scrollContent: {
    padding: 12,
    paddingBottom: 90,
    gap: 12,
  },

  // Ledger Card
  ledgerCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  portalTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  portalTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },

  // Record Cards Roster
  recordsList: {
    gap: 12,
  },
  recordCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  leftRoseAccent: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: 4,
    backgroundColor: '#BE123C',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  viewActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#BE123C',
    justifyContent: 'center',
  },
  viewActionText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerInfoCol: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  userNameText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  gradeBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gradeBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },

  // Field Grid (Clear High-Contrast Table)
  fieldGrid: {
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.3,
  },
  fieldValue: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  netSalaryItem: {
    marginTop: 4,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netSalaryLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#16A34A',
    letterSpacing: 0.5,
  },
  netSalaryValue: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#15803D',
  },

  // Timestamps Footer
  timestampsFooter: {
    gap: 4,
    paddingTop: 2,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestampLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  timestampValue: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#1E293B',
  },

  // Pagination
  paginationRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  entriesText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  paginationBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageBtnDisabled: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pageBtnTextDisabled: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#94A3B8',
  },
  pageBtnActive: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#BE123C',
  },
  pageBtnTextActive: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Modal Overlays
  webModalOverlay: {
    position: 'fixed' as any,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '88%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    zIndex: 10000,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  paidStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  paidStatusText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  modalSubTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 16,
  },
  modalEmpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  modalEmpAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEmpAvatarText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#BE123C',
  },
  modalEmpName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalEmpGrade: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 2,
  },
  modalEmpPaymentMode: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 1,
  },
  breakdownTable: {
    gap: 8,
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tableRowLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tableRowLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
  },
  tableRowValue: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  tableTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 4,
  },
  tableTotalLabel: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.3,
  },
  tableTotalSubLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 1,
  },
  tableTotalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#15803D',
  },
  modalTimestampsBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  modalTimestampRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTimestampLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  modalTimestampValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  modalFooter: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    gap: 10,
  },
  printBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  printBtnText: {
    color: '#475569',
    fontSize: 13.5,
    fontWeight: '900',
  },
  downloadBtn: {
    flex: 2,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#BE123C',
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
