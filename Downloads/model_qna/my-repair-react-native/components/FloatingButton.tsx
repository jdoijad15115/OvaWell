import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withSequence,
  interpolate,
  withDelay,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, RADIUS, ANIMATIONS } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface FloatingButtonProps {
  onPress: () => void;
  icon: string;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
}

export function FloatingButton({ 
  onPress, 
  icon, 
  label, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  size = 'large'
}: FloatingButtonProps) {
  const { theme } = useTheme();
  
  // 🎭 Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  
  // 🚀 Entrance animation
  useEffect(() => {
    scale.value = withDelay(300, withSpring(1, ANIMATIONS.bouncy));
    opacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, []);

  // 🔄 Loading animation
  useEffect(() => {
    if (loading) {
      rotation.value = withSequence(
        withTiming(360, { duration: 1000 }),
        withTiming(0, { duration: 0 })
      );
    }
  }, [loading]);

  // 💫 Pulse effect when enabled
  useEffect(() => {
    if (!disabled && !loading) {
      const pulse = () => {
        pulseScale.value = withSequence(
          withTiming(1.05, { duration: 800 }),
          withTiming(1, { duration: 800 })
        );
      };
      
      pulse();
      const interval = setInterval(pulse, 2000);
      return () => clearInterval(interval);
    }
  }, [disabled, loading]);

  // ✨ Press animation
  const handlePress = () => {
    if (disabled || loading) return;
    
    glowIntensity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 400 })
    );
    scale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1, ANIMATIONS.spring)
    );
    
    setTimeout(onPress, 100);
  };

  // 🎨 Get colors based on variant
  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: theme.secondary,
          backgroundPressed: theme.secondaryDark,
          text: theme.background,
          glow: theme.secondary,
        };
      case 'accent':
        return {
          background: theme.accent,
          backgroundPressed: theme.accent,
          text: theme.background,
          glow: theme.accent,
        };
      default:
        return {
          background: theme.primary,
          backgroundPressed: theme.primaryDark,
          text: theme.background,
          glow: theme.primary,
        };
    }
  };

  // 🎨 Get sizes
  const getSizes = () => {
    switch (size) {
      case 'small':
        return { width: 48, height: 48, iconSize: 18, fontSize: 12 };
      case 'medium':
        return { width: 56, height: 56, iconSize: 24, fontSize: 14 };
      default:
        return { width: 64, height: 64, iconSize: 28, fontSize: 16 };
    }
  };

  const colors = getColors();
  const sizes = getSizes();

  // 🎨 Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pulseScale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(glowIntensity.value, [0, 1], [0.3, 0.8]),
    shadowRadius: interpolate(glowIntensity.value, [0, 1], [12, 30]),
  }));

  const styles = createStyles(theme, colors, sizes);

  return (
    <Animated.View style={[animatedStyle, glowStyle]}>
      <TouchableOpacity 
        style={styles.container}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>
          {loading ? '🔄' : icon}
        </Text>
        {label && <Text style={styles.label}>{label}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (theme: any, colors: any, sizes: any) => StyleSheet.create({
  container: {
    width: sizes.width,
    height: sizes.height,
    borderRadius: sizes.width / 2,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  icon: {
    fontSize: sizes.iconSize,
    color: colors.text,
    textShadowColor: colors.glow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  label: {
    fontSize: sizes.fontSize,
    color: colors.text,
    fontWeight: '600',
    marginTop: 2,
  },
});
