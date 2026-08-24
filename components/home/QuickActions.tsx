import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const QuickActions = ({ actions }: any) => {
  return (
    <View style={styles.container}>
      {actions.map((act: any, idx: number) => (
        <TouchableOpacity key={idx} style={styles.actionBtn} onPress={act.onPress}>
          <MaterialIcons name={act.icon} size={22} color="#0284C7" />
          <Text style={styles.actionText}>{act.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0369A1',
  },
});
