import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const StatsCard = ({ label, value, color = '#0284C7' }: any) => {
  return (
    <View style={styles.statsCard}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statsCard: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
  },
  label: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#64748B',
  },
});
