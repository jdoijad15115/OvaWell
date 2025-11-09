import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ImageBackgroundWrapperProps {
  children: React.ReactNode;
  useImageBackground?: boolean;
  imageSource?: any;
}

export function ImageBackgroundWrapper({ 
  children, 
  useImageBackground = false, 
  imageSource 
}: ImageBackgroundWrapperProps) {
  
  // If using image background
  if (useImageBackground && imageSource) {
    return (
      <ImageBackground
        source={imageSource}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        {/* Dark overlay for better text readability */}
        <LinearGradient
          colors={[
            'rgba(15, 23, 42, 0.85)', 
            'rgba(15, 23, 42, 0.75)', 
            'rgba(15, 23, 42, 0.85)'
          ]}
          style={styles.overlay}
        >
          {children}
        </LinearGradient>
      </ImageBackground>
    );
  }

  // Default gradient background
  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#334155', '#1E293B', '#0F172A']}
      style={styles.gradientBackground}
      locations={[0, 0.25, 0.5, 0.75, 1]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: '100%',
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
  },
});
