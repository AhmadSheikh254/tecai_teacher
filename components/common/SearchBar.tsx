import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const SearchBar = ({ value, onChangeText, placeholder = 'Search...' }: any) => {
  return (
    <View style={styles.searchWrapper}>
      <MaterialIcons name="search" size={20} color="#0284C7" style={{ marginRight: 6 }} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
      />
      {value !== '' && (
        <TouchableOpacity onPress={() => onChangeText('')} style={{ padding: 4 }}>
          <MaterialIcons name="close" size={18} color="#64748B" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
