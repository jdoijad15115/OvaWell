import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ModernBackground() {
  return (
    <View style={styles.container}>
      {/* Modern gradient with multiple stops */}
      <LinearGradient
        colors={[
          '#0F172A',
          '#1E293B', 
          '#334155',
          '#475569',
          '#334155',
          '#1E293B',
          '#0F172A'
        ]}
        style={styles.baseGradient}
        locations={[0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]}
      />
      
      {/* Modern abstract shapes */}
      <View style={styles.shapesOverlay}>
        {/* Large circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        
        {/* Abstract lines */}
        <View style={[styles.abstractLine, styles.line1]} />
        <View style={[styles.abstractLine, styles.line2]} />
        <View style={[styles.abstractLine, styles.line3]} />
        
        {/* Modern rectangles */}
        <View style={[styles.rectangle, styles.rect1]} />
        <View style={[styles.rectangle, styles.rect2]} />
      </View>
      
      {/* Subtle overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(15, 23, 42, 0.3)', 'transparent']}
        style={styles.overlay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  baseGradient: {
    flex: 1,
  },
  shapesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#64748B',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -100,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -75,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    top: '40%',
    right: -20,
  },
  abstractLine: {
    position: 'absolute',
    backgroundColor: '#475569',
  },
  line1: {
    width: 2,
    height: 200,
    top: '10%',
    left: '20%',
    transform: [{ rotate: '15deg' }],
  },
  line2: {
    width: 300,
    height: 1,
    top: '30%',
    left: '30%',
    transform: [{ rotate: '-10deg' }],
  },
  line3: {
    width: 1,
    height: 150,
    bottom: '20%',
    right: '25%',
    transform: [{ rotate: '25deg' }],
  },
  rectangle: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
    opacity: 0.3,
  },
  rect1: {
    width: 60,
    height: 4,
    top: '25%',
    left: '15%',
    transform: [{ rotate: '45deg' }],
  },
  rect2: {
    width: 4,
    height: 80,
    bottom: '30%',
    right: '20%',
    transform: [{ rotate: '-30deg' }],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
