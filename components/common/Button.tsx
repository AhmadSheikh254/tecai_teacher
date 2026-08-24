import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const Button = ({ title, onPress, variant = 'primary' }: any) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity style={styles.btnWrapper} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={isPrimary ? ['#0284C7', '#0369A1'] : ['#F8FAFC', '#E2E8F0']}
        style={StyleSheet.absoluteFill}
      />
      <Text style={[styles.btnText, { color: isPrimary ? '#FFFFFF' : '#0F172A' }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '900',
  },
});
