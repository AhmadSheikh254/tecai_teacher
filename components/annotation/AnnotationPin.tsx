import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const AnnotationPin = ({ x, y }: any) => {
  return (
    <View style={[styles.pin, { left: x, top: y }]}>
      <MaterialIcons name="location-on" size={24} color="#EF4444" />
    </View>
  );
};

const styles = StyleSheet.create({
  pin: {
    position: 'absolute',
  },
});
