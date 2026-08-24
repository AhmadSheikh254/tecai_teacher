import React from 'react';
import { MoreHubScreen } from '../../src/screens/more/MoreHubScreen';

export default function MoreIndexPage(props: any) {
  const mockNavigation = props.navigation || { navigate: () => {}, goBack: () => {} };
  return <MoreHubScreen navigation={mockNavigation} />;
}
