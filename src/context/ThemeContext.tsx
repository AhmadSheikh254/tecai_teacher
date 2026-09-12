import React, { createContext, useContext, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'midnight' | 'ocean' | 'emerald' | 'sunset';

export interface ThemeColors {
  name: string;
  isDark: boolean;
  bg: string;
  surface: string;
  surfaceVariant: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryGradient: [string, string];
  accent: string;
  accentBg: string;
  success: string;
  warning: string;
  danger: string;
  bannerGradient: [string, string];
}

export const THEME_PRESETS: Record<ThemeMode, ThemeColors> = {
  light: {
    name: 'Classic Blue (Default)',
    isDark: false,
    bg: '#f0f4ff',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF2FF',
    cardBg: '#FFFFFF',
    border: '#E2E8F0',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    primary: '#0052CC',
    primaryLight: '#EEF2FF',
    primaryGradient: ['#0A1F5C', '#0052CC'],
    accent: '#2563EB',
    accentBg: '#EFF6FF',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    bannerGradient: ['#0A1F5C', '#003D9B', '#0052CC'] as any,
  },
  dark: {
    name: 'Midnight Dark (Pro)',
    isDark: true,
    bg: '#0A0E1A',
    surface: '#111827',
    surfaceVariant: '#1A233A',
    cardBg: '#131C30',
    border: '#22304C',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#38BDF8',
    primaryLight: 'rgba(56, 189, 248, 0.16)',
    primaryGradient: ['#0284C7', '#38BDF8'],
    accent: '#818CF8',
    accentBg: 'rgba(129, 140, 248, 0.18)',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    bannerGradient: ['#0B132B', '#11224D', '#163366'] as any,
  },
  ocean: {
    name: 'Ocean Azure',
    isDark: false,
    bg: '#EBF4FF',
    surface: '#FFFFFF',
    surfaceVariant: '#E0F2FE',
    cardBg: '#FFFFFF',
    border: '#BAE6FD',
    textPrimary: '#0A2540',
    textSecondary: '#2C3E50',
    textMuted: '#5C728A',
    primary: '#0284C7',
    primaryLight: '#E0F2FE',
    primaryGradient: ['#0369A1', '#0EA5E9'],
    accent: '#06B6D4',
    accentBg: '#CFFAFE',
    success: '#0D9488',
    warning: '#D97706',
    danger: '#E11D48',
    bannerGradient: ['#075985', '#0284C7', '#0EA5E9'] as any,
  },
  emerald: {
    name: 'Emerald Forest',
    isDark: false,
    bg: '#EAF7EE',
    surface: '#FFFFFF',
    surfaceVariant: '#DCFCE7',
    cardBg: '#FFFFFF',
    border: '#A7F3D0',
    textPrimary: '#0B291B',
    textSecondary: '#2D523E',
    textMuted: '#577C68',
    primary: '#059669',
    primaryLight: '#ECFDF5',
    primaryGradient: ['#047857', '#10B981'],
    accent: '#10B981',
    accentBg: '#D1FAE5',
    success: '#059669',
    warning: '#D97706',
    danger: '#E11D48',
    bannerGradient: ['#064E3B', '#059669', '#10B981'] as any,
  },
  sunset: {
    name: 'Sunset Warmth',
    isDark: false,
    bg: '#FFF1E8',
    surface: '#FFFFFF',
    surfaceVariant: '#FFEDD5',
    cardBg: '#FFFFFF',
    border: '#FED7AA',
    textPrimary: '#2D150B',
    textSecondary: '#5C3828',
    textMuted: '#8C5E48',
    primary: '#D9531E',
    primaryLight: '#FFEDD5',
    primaryGradient: ['#C2410C', '#EA580C'],
    accent: '#EA580C',
    accentBg: '#FFE4E6',
    success: '#059669',
    warning: '#D97706',
    danger: '#E11D48',
    bannerGradient: ['#7C2D12', '#C2410C', '#EA580C'] as any,
  },
  midnight: {
    name: 'Cyber Violet (Pro)',
    isDark: true,
    bg: '#0A0618',
    surface: '#130D26',
    surfaceVariant: '#201540',
    cardBg: '#181033',
    border: '#352461',
    textPrimary: '#FFFFFF',
    textSecondary: '#D8B4FE',
    textMuted: '#9384B7',
    primary: '#A78BFA',
    primaryLight: 'rgba(167, 139, 250, 0.18)',
    primaryGradient: ['#7C3AED', '#A78BFA'],
    accent: '#C084FC',
    accentBg: 'rgba(192, 132, 252, 0.20)',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#FB7185',
    bannerGradient: ['#140B28', '#260F4D', '#3B1470'] as any,
  },
};

export interface ThemeContextType {
  themeMode: ThemeMode;
  theme: ThemeColors;
  appTheme: ThemeColors;
  isDefaultTheme: boolean;
  highContrast: boolean;
  backgroundStyle: 'clean' | 'gradient' | 'glass';
  setThemeMode: (mode: ThemeMode) => void;
  setHighContrast: (val: boolean) => void;
  setBackgroundStyle: (style: 'clean' | 'gradient' | 'glass') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  theme: THEME_PRESETS.light,
  appTheme: THEME_PRESETS.light,
  isDefaultTheme: true,
  highContrast: false,
  backgroundStyle: 'clean',
  setThemeMode: () => {},
  setHighContrast: () => {},
  setBackgroundStyle: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [backgroundStyle, setBackgroundStyle] = useState<'clean' | 'gradient' | 'glass'>('clean');

  const activeTheme = THEME_PRESETS[themeMode] || THEME_PRESETS.light;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        theme: activeTheme,
        appTheme: activeTheme,
        isDefaultTheme: themeMode === 'light',
        highContrast,
        backgroundStyle,
        setThemeMode,
        setHighContrast,
        setBackgroundStyle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
export const useTheme = useAppTheme;
