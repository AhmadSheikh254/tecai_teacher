import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const ImageAnnotator = () => {
  return (
    <View style={styles.annotatorContainer}>
      <Text style={styles.text}>Image Annotator Canvas</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  annotatorContainer: {
    height: 250,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748B',
  },
});
