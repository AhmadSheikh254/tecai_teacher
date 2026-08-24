import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const AnnotationLabel = ({ label }: any) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#0F172A',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
