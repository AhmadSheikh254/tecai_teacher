import React from 'react';
import { AIToolkitScreen } from '../../src/screens/more/AIToolkitScreen';

export default function AIToolkitPage(props: any) {
  const mockNavigation = props.navigation || { navigate: () => {}, goBack: () => {} };
  return <AIToolkitScreen navigation={mockNavigation} />;
}
