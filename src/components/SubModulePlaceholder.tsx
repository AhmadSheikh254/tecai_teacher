import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SubModulePlaceholderProps {
  title: string;
  icon: string;
  navigation: any;
}

export const SubModulePlaceholder: React.FC<SubModulePlaceholderProps> = ({ title, icon, navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholderButton} />
      </View>

      {/* Content */}
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <MaterialIcons name={icon as any} size={48} color={theme.colors.primary} />
        </View>
        <Text style={styles.titleText}>{title} Module</Text>
        <Text style={styles.subtitleText}>
          This is the {title.toLowerCase()} screen. The premium mobile interface is being developed.
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.containerMargin,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.headlineMd.fontSize,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  placeholderButton: {
    width: 40,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  titleText: {
    fontSize: theme.typography.headlineLg.fontSize,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  subtitleText: {
    fontSize: theme.typography.bodyMd.fontSize,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderRadius: theme.rounded.md,
    marginTop: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
    fontSize: theme.typography.labelMd.fontSize,
  },
});
