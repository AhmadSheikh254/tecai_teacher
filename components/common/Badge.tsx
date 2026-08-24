import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Badge = ({ label, color = '#0284C7', bgColor = '#EFF6FF', borderColor = '#93C5FD' }: any) => {
  return (
    <View style={[styles.badgeContainer, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12.5,
    fontWeight: '900',
  },
});
