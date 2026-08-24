import { colors } from './colors';
import { spacing } from './spacing';
import { rounded } from './rounded';
import { typography } from './typography';

export { colors, spacing, rounded, typography };

export const theme = {
  colors,
  spacing,
  rounded,
  typography,
  shadows: {
    level1: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
    },
    level2: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
      elevation: 6,
    },
  },
};
