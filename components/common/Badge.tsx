import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const Badge = memo(({ label, color = '#0284C7', bgColor = '#EFF6FF', borderColor = '#93C5FD' }: any) => {
  return (
    <View style={[styles.badgeContainer, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
  },
});
