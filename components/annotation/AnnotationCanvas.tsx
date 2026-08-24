import React from 'react';
import { StyleSheet, View } from 'react-native';

export const AnnotationCanvas = ({ children }: any) => {
  return (
    <View style={styles.canvas}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FAFAFA',
  },
});
