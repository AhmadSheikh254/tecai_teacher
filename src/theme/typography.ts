import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  display: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.64,
  },
  headlineLg: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.24,
  },
  headlineMd: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  bodyLg: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMd: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  labelMd: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  headlineLgMobile: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
  },
};
