import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export const AssignmentFilters = ({ activeFilter, onSelectFilter }: any) => {
  const filters = ['All', 'Active', 'Pending', 'Completed'];
  return (
    <View style={styles.filterRow}>
      {filters.map((f) => (
        <TouchableOpacity
          key={f}
          style={[styles.pill, activeFilter === f && styles.activePill]}
          onPress={() => onSelectFilter(f)}
        >
          <Text style={[styles.pillText, activeFilter === f && styles.activePillText]}>{f}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  activePill: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  activePillText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
