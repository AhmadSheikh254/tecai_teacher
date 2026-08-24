import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  return {
    width,
    height,
    isSmallDevice: width < 380,
    isTablet: width >= 768,
  };
};
