import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function TechBackground() {
  return (
    <View style={styles.container}>
      {/* Very visible gradient background */}
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#3B82F6', '#1E293B', '#0F172A']}
        style={styles.baseGradient}
        locations={[0, 0.2, 0.5, 0.8, 1]}
      />
      
      {/* Highly visible circuit pattern overlay */}
      <View style={styles.patternContainer}>
        {/* Thick horizontal lines */}
        <View style={[styles.line, styles.horizontal, { top: '20%', backgroundColor: '#3B82F6' }]} />
        <View style={[styles.line, styles.horizontal, { top: '40%', backgroundColor: '#10B981' }]} />
        <View style={[styles.line, styles.horizontal, { top: '60%', backgroundColor: '#3B82F6' }]} />
        <View style={[styles.line, styles.horizontal, { top: '80%', backgroundColor: '#10B981' }]} />
        
        {/* Thick vertical lines */}
        <View style={[styles.line, styles.vertical, { left: '20%', backgroundColor: '#3B82F6' }]} />
        <View style={[styles.line, styles.vertical, { left: '40%', backgroundColor: '#10B981' }]} />
        <View style={[styles.line, styles.vertical, { left: '60%', backgroundColor: '#3B82F6' }]} />
        <View style={[styles.line, styles.vertical, { left: '80%', backgroundColor: '#10B981' }]} />
        
        {/* Large glowing nodes */}
        <View style={[styles.node, styles.blueNode, { top: '20%', left: '20%' }]} />
        <View style={[styles.node, styles.greenNode, { top: '40%', left: '40%' }]} />
        <View style={[styles.node, styles.blueNode, { top: '60%', left: '60%' }]} />
        <View style={[styles.node, styles.greenNode, { top: '80%', left: '80%' }]} />
        
        {/* Diagonal accent lines */}
        <View style={[styles.diagonalLine, { top: '25%', left: '15%', backgroundColor: '#F59E0B' }]} />
        <View style={[styles.diagonalLine, { top: '45%', left: '35%', backgroundColor: '#EF4444' }]} />
        <View style={[styles.diagonalLine, { top: '65%', left: '55%', backgroundColor: '#8B5CF6' }]} />
      </View>
      
      {/* Subtle overlay to not completely hide content */}
      <LinearGradient
        colors={['rgba(15, 23, 42, 0.3)', 'transparent', 'rgba(15, 23, 42, 0.3)']}
        style={styles.overlayGradient}
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
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7, // Much more visible now
  },
  line: {
    position: 'absolute',
  },
  horizontal: {
    height: 3, // Much thicker
    width: '100%',
  },
  vertical: {
    width: 3, // Much thicker
    height: '100%',
  },
  diagonalLine: {
    position: 'absolute',
    width: 120,
    height: 3, // Thicker
    transform: [{ rotate: '45deg' }],
    opacity: 0.8,
  },
  node: {
    position: 'absolute',
    width: 12, // Made even larger for visibility
    height: 12,
    borderRadius: 6,
    backgroundColor: '#64748B',
  },
  blueNode: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  greenNode: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  activeNode: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, // Increased from 0.8 to 1
    shadowRadius: 6, // Increased from 4 to 6
    elevation: 8, // Increased from 4 to 8
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
