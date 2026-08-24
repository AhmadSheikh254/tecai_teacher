import React from 'react';
import { HomeworkScreen } from '../../src/screens/homework/HomeworkScreen';

export default function HomeworkIndexPage(props: any) {
  const mockNavigation = props.navigation || { navigate: () => {}, goBack: () => {} };
  return <HomeworkScreen navigation={mockNavigation} />;
}
