import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens and tab navigator
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { TabNavigator } from './TabNavigator';
import { AISpeakingBuddyScreen } from '../screens/assignment/AISpeakingBuddyScreen';
import { useAppTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { theme: appTheme } = useAppTheme();

  const navTheme = {
    ...DefaultTheme,
    dark: appTheme.isDark,
    colors: {
      ...DefaultTheme.colors,
      background: appTheme.bg,
      card: appTheme.surface,
      text: appTheme.textPrimary,
      border: appTheme.border,
      primary: appTheme.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: appTheme.bg },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="AISpeakingBuddyDirect" component={AISpeakingBuddyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
