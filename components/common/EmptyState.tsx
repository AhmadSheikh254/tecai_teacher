import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const EmptyState = ({ message = 'No records found.' }: any) => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="inbox" size={48} color="#94A3B8" />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
  },
});
