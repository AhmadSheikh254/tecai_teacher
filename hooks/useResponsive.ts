import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;

  const numColumns = isDesktop ? 3 : isTablet ? 2 : 1;
  const contentMaxWidth = isDesktop ? 1200 : isTablet ? 900 : '100%';
  const horizontalPadding = isDesktop ? 28 : isTablet ? 20 : 14;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    numColumns,
    contentMaxWidth,
    horizontalPadding,
  };
};
