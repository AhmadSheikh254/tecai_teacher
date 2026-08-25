import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';

export const Card = memo(({ children, style }: any) => {
  return (
    <View style={[styles.cardContainer, style]}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
});
