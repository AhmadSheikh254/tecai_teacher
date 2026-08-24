import React from 'react';
import { PresentationScreen } from '../../src/screens/more/PresentationScreen';

export default function SlidesPage(props: any) {
  const mockNavigation = props.navigation || { navigate: () => {}, goBack: () => {} };
  return <PresentationScreen navigation={mockNavigation} />;
}
