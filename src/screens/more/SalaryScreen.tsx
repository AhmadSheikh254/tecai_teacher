import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal,
  useWindowDimensions 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    setSuccessToastVisible(true);
    setTimeout(() => setSuccessToastVisible(false), 3000);
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
          <LinearGradient
            colors={['rgba(255,255,255,0.96)', 'rgba(255,241,242,0.90)']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <MaterialIcons name="arrow-back" size={26} color="#0F172A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Salary Payment</Text>
          </View>
          <TouchableOpacity style={styles.appBarIconButton} activeOpacity={0.7}>
            <MaterialIcons name="payments" size={28} color="#BE123C" />
          </TouchableOpacity>
        </View>

        {/* Success Alert Banner */}
        {successToastVisible && (
          <View style={styles.alertBanner}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
            <Text style={styles.alertBannerText}>Pay Slip PDF Downloaded Successfully!</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* MAIN PAYMENT LEDGER CARD */}
          <View style={styles.ledgerCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.96)', 'rgba(255,241,242,0.92)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {/* Top Glowing Accent Line */}
            <View style={styles.topRoseStrip} />

            {/* Portal Title Banner */}
            <View style={styles.portalTitleBox}>
              <LinearGradient
                colors={['#BE123C', '#9F1239']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <MaterialIcons name="receipt-long" size={24} color="#FFFFFF" />
              <Text style={styles.portalTitleText}>Payment Records</Text>
            </View>

            {/* Export Toolbar (Copy, CSV, Excel, PDF, Print) */}
            <View style={styles.exportToolbar}>
              <Text style={styles.exportLabel}>Export Sheet:</Text>
              <View style={styles.exportBadgeRow}>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('Copy')}>
                  <Text style={styles.exportText}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('CSV')}>
                  <Text style={styles.exportText}>CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('Excel')}>
                  <Text style={styles.exportText}>Excel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('PDF')}>
                  <Text style={styles.exportText}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.exportIconBtn} onPress={() => handleExportAlert('Print')}>
                  <Text style={styles.exportText}>Print</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Live Search Bar ("Search:") */}
            <View style={styles.searchRow}>
              <Text style={styles.searchLabel}>Search:</Text>
              <View style={styles.searchWrapper}>
                <MaterialIcons name="search" size={22} color="#BE123C" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search name, grade, amount..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
                    <MaterialIcons name="close" size={20} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Salary Record Cards */}
            <View style={styles.recordsList}>
              {filteredRecords.map((item) => (
                <View key={item.id} style={styles.recordCard}>
                  <LinearGradient
                    colors={['#FFF8F9', '#FFFBFD']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                  <View style={styles.leftRoseAccent} />

                  {/* 1. View Action + User Name + Grade Header */}
                  <View style={styles.cardHeader}>
                    <TouchableOpacity 
                      style={styles.viewActionBtn} 
                      onPress={() => setSelectedRecord(item)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#BE123C', '#9F1239']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                        start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
                        style={StyleSheet.absoluteFill}
                        pointerEvents="none"
                      />
                      <Text style={styles.viewActionText}>View</Text>
                    </TouchableOpacity>

                    <View style={styles.headerInfoCol}>
                      <Text style={styles.userNameText}>{item.userName}</Text>
                      <Text style={styles.gradeNameText}>Grade: {item.gradeName}</Text>
                    </View>
                  </View>

                  {/* 2. Financial Itemized Fields Grid (Exact Table Columns with LARGE Fonts) */}
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
                    <View style={[styles.fieldItem, styles.netSalaryItem]}>
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

            {/* Pagination Controls Footer matching Desktop Image */}
            <View style={styles.paginationRow}>
              <Text style={styles.entriesText}>Showing 1 to {filteredRecords.length} of {records.length} entries</Text>
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
        <Modal
          visible={selectedRecord !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedRecord(null)}
        >
          <View style={styles.modalBackdrop}>
            {selectedRecord && (
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#FAF7F8']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={styles.modalIconBox}>
                      <MaterialIcons name="receipt-long" size={26} color="#BE123C" />
                    </View>
                    <View>
                      <Text style={styles.modalTitle}>Salary Pay Slip</Text>
                      <Text style={styles.modalSubTitle}>{selectedRecord.createdAt}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedRecord(null)} style={styles.closeBtn}>
                    <MaterialIcons name="close" size={26} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  {/* User Name & Grade Box */}
                  <View style={styles.modalEmpBox}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalEmpName}>{selectedRecord.userName}</Text>
                      <Text style={styles.modalEmpGrade}>GRADE NAME: {selectedRecord.gradeName}</Text>
                    </View>
                  </View>

                  {/* Financial Itemization Table */}
                  <View style={styles.breakdownTable}>
                    <Text style={styles.tableTitle}>Salary Itemization Details</Text>
                    
                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>BASIC SALARY</Text>
                      <Text style={styles.tableRowValue}>{selectedRecord.basicSalary.toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>TOTAL ALLOWANCE (+)</Text>
                      <Text style={[styles.tableRowValue, { color: '#059669' }]}>+ {selectedRecord.totalAllowance.toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>TOTAL DEDUCTION (-)</Text>
                      <Text style={[styles.tableRowValue, { color: '#E11D48' }]}>- {selectedRecord.totalDeduction.toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableRow}>
                      <Text style={styles.tableRowLabel}>GROSS SALARY</Text>
                      <Text style={styles.tableRowValue}>{selectedRecord.grossSalary.toFixed(2)}</Text>
                    </View>

                    <View style={styles.tableTotalRow}>
                      <Text style={styles.tableTotalLabel}>NET SALARY</Text>
                      <Text style={styles.tableTotalValue}>PKR {selectedRecord.netSalary.toFixed(2)}</Text>
                    </View>
                  </View>

                  {/* Timestamps */}
                  <View style={{ marginTop: 18, gap: 6 }}>
                    <Text style={styles.modalTimestampText}>CREATED AT: {selectedRecord.createdAt}</Text>
                    <Text style={styles.modalTimestampText}>UPDATED AT: {selectedRecord.updatedAt}</Text>
                  </View>
                </ScrollView>

                {/* Modal Footer Download Button */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.downloadBtn} 
                    onPress={handleDownloadPaySlip}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10B981', '#059669']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <MaterialIcons name="file-download" size={24} color="#FFFFFF" />
                    <Text style={styles.downloadBtnText}>Download Pay Slip PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },

  // Glowing ambient background circles
  orb1: {
    position: 'absolute', top: -140, right: -120,
    width: 440, height: 440, borderRadius: 220,
    backgroundColor: 'rgba(251, 113, 133, 0.04)',
  },
  orb2: {
    position: 'absolute', bottom: -100, left: -120,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(225, 29, 72, 0.03)',
  },
  orb3: {
    position: 'absolute', top: '40%', right: -100,
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(254, 205, 211, 0.05)',
  },

  // App Bar Header
  appBar: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  appBarIconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(226, 232, 240, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  // Alert Banner
  alertBanner: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 10,
    elevation: 4,
  },
  alertBannerText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '900',
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },

  // Ledger Card
  ledgerCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(254, 205, 211, 0.95)',
    position: 'relative',
    overflow: 'hidden',
    gap: 12,
    elevation: 3,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  topRoseStrip: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 4,
    backgroundColor: '#BE123C',
  },
  portalTitleBox: {
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  portalTitleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },

  // Export Toolbar matching web image (Large Typography)
  exportToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  exportLabel: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#881337',
  },
  exportBadgeRow: {
    flexDirection: 'row',
    gap: 5,
  },
  exportIconBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECDD3',
    elevation: 1,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  exportText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#BE123C',
  },

  // Search Row ("Search:")
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchLabel: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(253, 164, 175, 0.9)',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '800',
  },

  // Record Cards Roster
  recordsList: {
    gap: 12,
  },
  recordCard: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(254, 205, 211, 0.7)',
    position: 'relative',
    overflow: 'hidden',
    gap: 10,
    elevation: 2,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
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
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4E6',
    paddingBottom: 8,
  },
  viewActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    elevation: 2,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  viewActionText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerInfoCol: {
    gap: 2,
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  gradeNameText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#64748B',
  },

  // Field Grid (ENLARGED FONT SIZES)
  fieldGrid: {
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 0.3,
  },
  fieldValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  netSalaryItem: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FFE4E6',
  },
  netSalaryLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#BE123C',
    letterSpacing: 0.3,
  },
  netSalaryValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
  },

  // Timestamps Footer (ENLARGED)
  timestampsFooter: {
    gap: 6,
    paddingTop: 4,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timestampLabel: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#64748B',
  },
  timestampValue: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#1E293B',
  },

  // Pagination
  paginationRow: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
    marginTop: 8,
    paddingTop: 18,
    borderTopWidth: 1.5,
    borderTopColor: '#FFE4E6',
  },
  entriesText: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#64748B',
  },
  paginationBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pageBtnDisabled: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
  },
  pageBtnTextDisabled: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#94A3B8',
  },
  pageBtnActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#BE123C',
  },
  pageBtnTextActive: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '85%',
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.95)',
    elevation: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#FFE4E6',
  },
  modalIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFF1F2',
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
  },
  modalBody: {
    padding: 22,
  },
  modalEmpBox: {
    backgroundColor: '#FFF1F2',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    marginBottom: 18,
  },
  modalEmpName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalEmpGrade: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#64748B',
    marginTop: 3,
  },
  breakdownTable: {
    gap: 14,
  },
  tableTitle: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFE4E6',
  },
  tableRowLabel: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#475569',
  },
  tableRowValue: {
    fontSize: 16.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  tableTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: '#FFF1F2',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    marginTop: 10,
  },
  tableTotalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#9F1239',
  },
  tableTotalValue: {
    fontSize: 19,
    fontWeight: '900',
    color: '#BE123C',
  },
  modalTimestampText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#64748B',
  },
  modalFooter: {
    padding: 18,
    borderTopWidth: 1.5,
    borderTopColor: '#FFE4E6',
  },
  downloadBtn: {
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
