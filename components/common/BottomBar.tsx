import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const BottomBar = ({ activeTab, onTabPress }: any) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'dashboard' },
    { id: 'assignments', label: 'Assignments', icon: 'assignment' },
    { id: 'homework', label: 'Homework', icon: 'menu-book' },
    { id: 'more', label: 'More', icon: 'more-horiz' },
  ];

  return (
    <View style={styles.bottomBarContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity 
            key={tab.id} 
            style={styles.tabBtn} 
            onPress={() => onTabPress && onTabPress(tab.id)}
            activeOpacity={0.8}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={24} 
              color={isActive ? '#0284C7' : '#64748B'} 
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBarContainer: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
  },
  tabBtn: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#0284C7',
    fontWeight: '900',
  },
});
