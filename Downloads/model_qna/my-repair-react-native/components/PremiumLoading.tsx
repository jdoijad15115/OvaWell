import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  interpolateColor,
  useDerivedValue,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, RADIUS } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface PremiumLoadingProps {
  visible: boolean;
  text?: string;
  type?: 'dots' | 'pulse' | 'wave' | 'quantum' | 'neural';
}

export function PremiumLoading({ 
  visible, 
  text = 'Processing...', 
  type = 'quantum' 
}: PremiumLoadingProps) {
  const { theme } = useTheme();
  
  // 🎭 Animation values
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  // 🚀 Main animation loop
  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { duration: 400 });
      progress.value = withRepeat(
        withTiming(1, { duration: 2000 }),
        -1,
        false
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
      progress.value = 0;
    }
  }, [visible]);

  // 🎨 Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const renderLoadingAnimation = () => {
    switch (type) {
      case 'quantum':
        return <QuantumLoader progress={progress} theme={theme} />;
      case 'neural':
        return <NeuralLoader progress={progress} theme={theme} />;
      case 'wave':
        return <WaveLoader progress={progress} theme={theme} />;
      case 'pulse':
        return <PulseLoader progress={progress} theme={theme} />;
      default:
        return <DotsLoader progress={progress} theme={theme} />;
    }
  };

  const styles = createStyles(theme);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.container, containerStyle]}>
        {renderLoadingAnimation()}
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </View>
  );
}

// 🌌 QUANTUM LOADER - Exotic particle animation
function QuantumLoader({ progress, theme }: { progress: any, theme: any }) {
  const particles = [0, 1, 2, 3, 4];
  
  return (
    <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }}>
      {particles.map((index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const delay = index * 0.2;
          const animProgress = (progress.value + delay) % 1;
          
          const size = interpolate(animProgress, [0, 0.5, 1], [4, 12, 4]);
          const opacity = interpolate(animProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
          const rotate = interpolate(progress.value, [0, 1], [0, 360]);
          
          const radius = 25;
          const angle = (index * 72) + (progress.value * 360);
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          return {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.primary,
            opacity,
            transform: [
              { translateX: x },
              { translateY: y },
              { rotate: `${rotate}deg` }
            ],
            position: 'absolute',
          };
        });
        
        return <Animated.View key={index} style={animatedStyle} />;
      })}
    </View>
  );
}

// 🧠 NEURAL LOADER - Brain-like network animation
function NeuralLoader({ progress, theme }: { progress: any, theme: any }) {
  const nodes = [0, 1, 2, 3, 4, 5];
  
  return (
    <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }}>
      {nodes.map((index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const pulse = interpolate(
            (progress.value + index * 0.15) % 1,
            [0, 0.5, 1],
            [0.5, 1.2, 0.5]
          );
          
          const opacity = interpolate(
            (progress.value + index * 0.1) % 1,
            [0, 0.3, 0.7, 1],
            [0.3, 1, 1, 0.3]
          );
          
          const positions = [
            { x: 0, y: -30 },
            { x: 26, y: -15 },
            { x: 26, y: 15 },
            { x: 0, y: 30 },
            { x: -26, y: 15 },
            { x: -26, y: -15 },
          ];
          
          return {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.accent,
            opacity,
            transform: [
              { translateX: positions[index].x },
              { translateY: positions[index].y },
              { scale: pulse }
            ],
            position: 'absolute',
          };
        });
        
        return <Animated.View key={index} style={animatedStyle} />;
      })}
    </View>
  );
}

// 🌊 WAVE LOADER
function WaveLoader({ progress, theme }: { progress: any, theme: any }) {
  const bars = [0, 1, 2, 3, 4];
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 40 }}>
      {bars.map((index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const height = interpolate(
            (progress.value + index * 0.2) % 1,
            [0, 0.5, 1],
            [8, 32, 8]
          );
          
          return {
            width: 6,
            height,
            backgroundColor: theme.secondary,
            borderRadius: 3,
            marginHorizontal: 2,
          };
        });
        
        return <Animated.View key={index} style={animatedStyle} />;
      })}
    </View>
  );
}

// 💓 PULSE LOADER
function PulseLoader({ progress, theme }: { progress: any, theme: any }) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 0.5, 1], [0.8, 1.2, 0.8]);
    const opacity = interpolate(progress.value, [0, 0.5, 1], [0.6, 1, 0.6]);
    
    return {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primary,
      transform: [{ scale }],
      opacity,
    };
  });
  
  return <Animated.View style={animatedStyle} />;
}

// ⭕ DOTS LOADER
function DotsLoader({ progress, theme }: { progress: any, theme: any }) {
  const dots = [0, 1, 2];
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {dots.map((index) => {
        const animatedStyle = useAnimatedStyle(() => {
          const scale = interpolate(
            (progress.value + index * 0.3) % 1,
            [0, 0.5, 1],
            [0.8, 1.4, 0.8]
          );
          
          return {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.accent,
            marginHorizontal: 4,
            transform: [{ scale }],
          };
        });
        
        return <Animated.View key={index} style={animatedStyle} />;
      })}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: theme.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: theme.border,
    minWidth: 120,
  },
  text: {
    marginTop: SPACING.md,
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});
