import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  runOnJS,
  interpolate,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, RADIUS, SHADOWS, ANIMATIONS } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface PremiumCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  delay?: number;
  style?: any;
}

export function PremiumCard({ title, description, icon, onPress, delay = 0, style }: PremiumCardProps) {
  const { theme } = useTheme();
  
  // 🎭 Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const glowIntensity = useSharedValue(0);
  
  // 🚀 Entrance animation
  useEffect(() => {
    const startAnimation = () => {
      scale.value = withDelay(delay, withSpring(1, ANIMATIONS.spring));
      opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
      translateY.value = withDelay(delay, withSpring(0, ANIMATIONS.gentle));
    };
    
    startAnimation();
  }, []);

  // ✨ Glow effect on press
  const handlePress = () => {
    glowIntensity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 300 })
    );
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, ANIMATIONS.bouncy)
    );
    
    setTimeout(onPress, 150);
  };

  // 🎨 Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowIntensity.value, [0, 1], [0.2, 0.6]),
    shadowRadius: interpolate(glowIntensity.value, [0, 1], [8, 25]),
  }));

  const styles = createStyles(theme);

  return (
    <Animated.View style={[animatedStyle, glowStyle, style]}>
      <TouchableOpacity 
        style={[styles.container]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* 🌟 Background gradient effect */}
        <View style={styles.gradientBackground} />
        
        {/* 📱 Content */}
        <View style={styles.content}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* ✨ Shimmer effect overlay */}
        <View style={styles.shimmer} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.glowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.surfaceLight,
    opacity: 0.5,
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.md,
    textShadowColor: theme.glowColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: screenWidth * 0.7,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -screenWidth,
    width: screenWidth,
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: RADIUS.lg,
  },
});
