// Web-compatible background wrapper
import React from 'react';
import { View, ImageBackground, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WebCompatBackgroundProps {
  children: React.ReactNode;
  style?: any;
}

export const WebCompatBackground: React.FC<WebCompatBackgroundProps> = ({ children, style }) => {
  // Always use the awesome circuit board image for both web and mobile!
  return (
    <ImageBackground
      source={require('../assets/images/circuit-bg.jpg')}
      style={[{ flex: 1 }, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
};

export default WebCompatBackground;
