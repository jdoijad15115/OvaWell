import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0D1117',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'RepAIr',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="ask" 
        options={{ 
          title: 'Ask Question',
          headerShown: true,
        }} 
      />
      <Stack.Screen 
        name="detect" 
        options={{ 
          title: 'Detect Issues',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
