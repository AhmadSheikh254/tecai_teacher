import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const AssignmentDetails = ({ assignment }: any) => {
  if (!assignment) return null;
  return (
    <View style={styles.detailsBox}>
      <Text style={styles.title}>{assignment.title}</Text>
      <Text style={styles.info}>Subject: {assignment.subject}</Text>
      <Text style={styles.info}>Due Date: {assignment.dueDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsBox: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F0F9FF',
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0369A1',
  },
  info: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
});
