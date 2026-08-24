import React from 'react';
import { HomeScreen } from '../../src/screens/home/HomeScreen';

export default function HomePage(props: any) {
  const mockNavigation = props.navigation || { navigate: () => {}, goBack: () => {} };
  return <HomeScreen navigation={mockNavigation} />;
}
