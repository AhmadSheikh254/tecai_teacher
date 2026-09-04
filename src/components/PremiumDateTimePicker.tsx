import React, { useState, useEffect } from 'react';
// @ts-ignore
import ReactDOM from 'react-dom';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Platform
} from 'react-native';
import Svg, { Circle, Path, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const ViewportModal: React.FC<{ visible: boolean; onClose: () => void; children: React.ReactNode; zIndex?: number }> = ({ visible, onClose, children, zIndex = 2000000 }) => {
  if (!visible) return null;

  if (Platform.OS === 'web' && typeof document !== 'undefined' && (ReactDOM as any)?.createPortal) {
    return (ReactDOM as any).createPortal(
      <View style={{
        position: 'fixed' as any,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw' as any,
        height: '100vh' as any,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        zIndex: zIndex,
      }}>
        {children}
      </View>,
      document.body
    );
  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent={true} onRequestClose={onClose}>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}>
        {children}
      </View>
    </Modal>
  );
};

export interface PremiumDateTimePickerProps {
  visible: boolean;
  onClose: () => void;
  value: string;
  onSelect: (newValue: string) => void;
  title?: string;
  showTime?: boolean;
  mode?: 'datetime' | 'date' | 'time';
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const PremiumDateTimePicker: React.FC<PremiumDateTimePickerProps> = ({
  visible,
  onClose,
  value,
  onSelect,
  title,
  showTime = true,
  mode = 'datetime',
}) => {
  const isTimeOnly = mode === 'time';
  const isDateOnly = mode === 'date' || (mode === 'datetime' && !showTime);
  const isDateTime = mode === 'datetime' && showTime;

  const displayTitle = title || (isTimeOnly ? 'Select Time' : isDateOnly ? 'Select Date' : 'Select Date & Time');

  // Parse initial value
  const parseInitial = () => {
    try {
      if (isTimeOnly || (!value.includes(' ') && value.includes(':')) || (value.includes(':') && (value.includes('AM') || value.includes('PM')) && !value.includes('20'))) {
        const timeParts = value.trim().split(' ');
        const [hh, mm] = (timeParts[0] || '09:00').split(':');
        return {
          day: 1,
          month: 0,
          year: 2026,
          hour: hh || '09',
          minute: mm || '00',
          ampm: timeParts[1] || 'AM'
        };
      }

      const parts = value.split(',');
      const dateParts = parts[0].trim().split(' '); // ["13", "May", "2026"]
      const timeParts = parts[1] ? parts[1].trim().split(' ') : ["09:00", "AM"];
      const [hh, mm] = (timeParts[0] || '09:00').split(':');
      
      const day = parseInt(dateParts[0], 10) || 13;
      const monthShort = dateParts[1] || 'May';
      const monthIdx = MONTHS_SHORT.indexOf(monthShort) !== -1 ? MONTHS_SHORT.indexOf(monthShort) : 4;
      const year = parseInt(dateParts[2], 10) || 2026;
      
      return {
        day,
        month: monthIdx,
        year,
        hour: hh || '09',
        minute: mm || '00',
        ampm: timeParts[1] || 'AM'
      };
    } catch (e) {
      const now = new Date();
      return {
        day: now.getDate(),
        month: now.getMonth(),
        year: now.getFullYear(),
        hour: '09',
        minute: '00',
        ampm: 'AM'
      };
    }
  };

  const parsed = parseInitial();
  
  const [currentYear, setCurrentYear] = useState(parsed.year);
  const [currentMonth, setCurrentMonth] = useState(parsed.month);
  const [selectedDay, setSelectedDay] = useState(parsed.day);
  
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedAmPm, setSelectedAmPm] = useState(parsed.ampm);

  useEffect(() => {
    if (visible) {
      const p = parseInitial();
      setCurrentYear(p.year);
      setCurrentMonth(p.month);
      setSelectedDay(p.day);
      setSelectedHour(p.hour);
      setSelectedMinute(p.minute);
      setSelectedAmPm(p.ampm);
    }
  }, [visible, value, mode]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSave = () => {
    if (isTimeOnly) {
      onSelect(`${selectedHour}:${selectedMinute} ${selectedAmPm}`);
      onClose();
      return;
    }

    const formattedDay = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    const formattedMonth = MONTHS_SHORT[currentMonth];
    const result = isDateTime 
      ? `${formattedDay} ${formattedMonth} ${currentYear}, ${selectedHour}:${selectedMinute} ${selectedAmPm}`
      : `${formattedDay} ${formattedMonth} ${currentYear}`;
    onSelect(result);
    onClose();
  };

  // Generate calendar days grid
  const renderCalendarDays = () => {
    const gridItems = [];
    
    // Empty boxes for days of previous month
    for (let i = 0; i < firstDayIndex; i++) {
      gridItems.push(<View key={`empty-${i}`} style={styles.calendarDayCellEmpty} />);
    }
    
    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = day === selectedDay;
      gridItems.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[styles.calendarDayCell, isSelected && styles.calendarDayCellActive]}
          onPress={() => setSelectedDay(day)}
          activeOpacity={0.8}
        >
          {isSelected ? (
            <LinearGradient
              colors={['#0052cc', '#003d9b']}
              style={styles.selectedDayGradient}
            >
              <Text style={styles.calendarDayTextActive}>{day}</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.calendarDayText}>{day}</Text>
          )}
        </TouchableOpacity>
      );
    }
    
    return gridItems;
  };

  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutesList = ['00', '01', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  if (!visible) return null;

  return (
    <ViewportModal visible={visible} onClose={onClose} zIndex={2000000}>
        <View style={[styles.sheetContainer, theme.shadows.level2]}>
          
          {/* Premium picker background waves */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgLinearGradient id="pickerGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#0052cc" stopOpacity={0.035} />
                  <Stop offset="100%" stopColor="#00D8F6" stopOpacity={0.015} />
                </SvgLinearGradient>
              </Defs>
              <Circle cx="10%" cy="10%" r="140" fill="url(#pickerGlow)" />
              <Circle cx="90%" cy="90%" r="160" fill="url(#pickerGlow)" />
              <Path d="M -20,120 Q 80,70 120,180 T 320,140" stroke="#0052cc" strokeWidth={0.8} fill="none" opacity={0.05} />
            </Svg>
          </View>
          
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconBox}>
                <MaterialIcons name={isTimeOnly ? "schedule" : "event-note"} size={20} color="#0052cc" />
              </View>
              <Text style={styles.headerTitle}>{displayTitle}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <MaterialIcons name="close" size={20} color="#737685" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Live Selection Preview Banner */}
            <View style={{
              backgroundColor: '#F0FDFA',
              borderWidth: 1.5,
              borderColor: '#99F6E4',
              borderRadius: 14,
              paddingVertical: 9,
              paddingHorizontal: 14,
              alignItems: 'center',
              marginBottom: 4,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: '#0D9488', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                {isTimeOnly ? 'Selected Time' : isDateOnly ? 'Selected Date' : 'Selected Date & Time'}
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#0F172A', marginTop: 2 }}>
                {isTimeOnly 
                  ? `${selectedHour}:${selectedMinute} ${selectedAmPm}`
                  : isDateOnly
                    ? `${selectedDay} ${MONTHS[currentMonth]} ${currentYear}`
                    : `${selectedDay} ${MONTHS[currentMonth]} ${currentYear}, ${selectedHour}:${selectedMinute} ${selectedAmPm}`
                }
              </Text>
            </View>

            {/* 1. CALENDAR VIEW (If not time-only) */}
            {!isTimeOnly && (
              <View style={styles.sectionCard}>
                <View style={styles.monthSelectorRow}>
                  <TouchableOpacity onPress={handlePrevMonth} style={styles.arrowBtn}>
                    <MaterialIcons name="chevron-left" size={26} color="#0F172A" />
                  </TouchableOpacity>
                  <Text style={styles.monthYearText}>{MONTHS[currentMonth]} {currentYear}</Text>
                  <TouchableOpacity onPress={handleNextMonth} style={styles.arrowBtn}>
                    <MaterialIcons name="chevron-right" size={26} color="#0F172A" />
                  </TouchableOpacity>
                </View>

                {/* Week Days Names */}
                <View style={styles.weekDaysRow}>
                  {DAYS_OF_WEEK.map((d, i) => (
                    <Text key={i} style={styles.weekDayText}>{d}</Text>
                  ))}
                </View>

                {/* Days Grid */}
                <View style={styles.daysGrid}>
                  {renderCalendarDays()}
                </View>
              </View>
            )}

            {/* 2. TIME SELECTOR (If time-only or showTime is true) */}
            {(isTimeOnly || isDateTime) && (
              <View style={styles.sectionCard}>
                <View style={styles.timeSectionHeader}>
                  <MaterialIcons name="schedule" size={17} color="#0052cc" style={{ marginRight: 6 }} />
                  <Text style={styles.timeSectionTitle}>Select Time</Text>
                </View>

                <View style={styles.timeSelectionRow}>
                  {/* Hour */}
                  <View style={styles.pickerCol}>
                    <Text style={styles.pickerLabel}>Hour</Text>
                    <View style={styles.segmentList}>
                      {hoursList.map(h => (
                        <TouchableOpacity
                          key={h}
                          style={[styles.segmentBtn, selectedHour === h && styles.segmentBtnActive]}
                          onPress={() => setSelectedHour(h)}
                        >
                          <Text style={[styles.segmentText, selectedHour === h && styles.segmentTextActive]}>{h}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Minute */}
                  <View style={styles.pickerCol}>
                    <Text style={styles.pickerLabel}>Min</Text>
                    <ScrollView style={{ maxHeight: 150 }} showsVerticalScrollIndicator={false}>
                      <View style={styles.segmentList}>
                        {minutesList.map(m => (
                          <TouchableOpacity
                            key={m}
                            style={[styles.segmentBtn, selectedMinute === m && styles.segmentBtnActive]}
                            onPress={() => setSelectedMinute(m)}
                          >
                            <Text style={[styles.segmentText, selectedMinute === m && styles.segmentTextActive]}>{m}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  {/* AM/PM */}
                  <View style={[styles.pickerCol, { flex: 0.85 }]}>
                    <Text style={styles.pickerLabel}>Period</Text>
                    <View style={styles.ampmContainer}>
                      <TouchableOpacity
                        style={[styles.ampmBtn, selectedAmPm === 'AM' && styles.ampmBtnActive]}
                        onPress={() => setSelectedAmPm('AM')}
                      >
                        <Text style={[styles.ampmText, selectedAmPm === 'AM' && styles.ampmTextActive]}>AM</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.ampmBtn, selectedAmPm === 'PM' && styles.ampmBtnActive]}
                        onPress={() => setSelectedAmPm('PM')}
                      >
                        <Text style={[styles.ampmText, selectedAmPm === 'PM' && styles.ampmTextActive]}>PM</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Save Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <LinearGradient
                  colors={['#0052cc', '#003d9b']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.saveBtnGrad}
                >
                  <MaterialIcons name="done" size={18} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.saveBtnText}>{isTimeOnly ? 'Confirm Time' : 'Confirm Date'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
    </ViewportModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(4, 27, 60, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 2000000,
  },
  backdropPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    overflow: 'hidden',
    maxHeight: '90%',
    position: 'relative',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 82, 204, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 10,
    gap: 8,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  monthSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  arrowBtn: {
    padding: 2,
  },
  monthYearText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  weekDayText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    width: 32,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDayCell: {
    width: `${100 / 7}%`,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 1,
  },
  calendarDayCellEmpty: {
    width: `${100 / 7}%`,
    height: 34,
  },
  calendarDayCellActive: {
    borderRadius: 17,
  },
  selectedDayGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  calendarDayTextActive: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
  },

  // Time Section
  timeSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeSectionTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  timeSelectionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pickerCol: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  segmentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  segmentBtn: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  segmentText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#475569',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  ampmContainer: {
    gap: 4,
  },
  ampmBtn: {
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ampmBtnActive: {
    backgroundColor: '#0052cc',
    borderColor: '#0052cc',
  },
  ampmText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#475569',
  },
  ampmTextActive: {
    color: '#ffffff',
  },

  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  cancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  saveBtn: {
    flex: 1.5,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  saveBtnGrad: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
  },
});
