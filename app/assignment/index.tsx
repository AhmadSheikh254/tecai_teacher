import React from 'react';
import { AssignmentHubScreen } from '../../src/screens/assignment/AssignmentHubScreen';

export default function AssignmentIndexPage(props: any) {
  const mockNavigation = props.navigation || { navigate: () => {}, goBack: () => {} };
  return <AssignmentHubScreen navigation={mockNavigation} />;
}
