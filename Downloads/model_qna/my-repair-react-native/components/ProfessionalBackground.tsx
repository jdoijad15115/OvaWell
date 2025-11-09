import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function ProfessionalBackground() {
  return (
    <View style={styles.container}>
      {/* Very visible test gradient background */}
      <LinearGradient
        colors={['#1E40AF', '#3B82F6', '#60A5FA', '#3B82F6', '#1E40AF']}
        style={styles.baseGradient}
        locations={[0, 0.25, 0.5, 0.75, 1]}
      />
      
      {/* Highly visible geometric pattern */}
      <View style={styles.geometricOverlay}>
        {/* Large hexagons */}
        {Array.from({ length: 8 }).map((_, i) => (
          <View 
            key={i}
            style={[
              styles.hexagon,
              {
                top: `${10 + i * 10}%`,
                left: `${5 + (i % 2) * 25}%`,
                backgroundColor: i % 2 === 0 ? '#10B981' : '#F59E0B',
              }
            ]}
          />
        ))}
        
        {/* Visible connecting lines */}
        <View style={[styles.connectLine, { top: '20%', left: '10%', width: 120, backgroundColor: '#EF4444' }]} />
        <View style={[styles.connectLine, { top: '40%', left: '30%', width: 100, backgroundColor: '#8B5CF6' }]} />
        <View style={[styles.connectLine, { top: '60%', left: '10%', width: 120, backgroundColor: '#EF4444' }]} />
        <View style={[styles.connectLine, { top: '80%', left: '30%', width: 100, backgroundColor: '#8B5CF6' }]} />
        
        {/* Large accent dots */}
        <View style={[styles.accentDot, { top: '15%', right: '15%', backgroundColor: '#FBBF24', width: 16, height: 16, borderRadius: 8 }]} />
        <View style={[styles.accentDot, { top: '35%', right: '10%', backgroundColor: '#34D399', width: 16, height: 16, borderRadius: 8 }]} />
        <View style={[styles.accentDot, { top: '55%', right: '20%', backgroundColor: '#F472B6', width: 16, height: 16, borderRadius: 8 }]} />
        <View style={[styles.accentDot, { top: '75%', right: '15%', backgroundColor: '#A78BFA', width: 16, height: 16, borderRadius: 8 }]} />
      </View>
      
      {/* Minimal overlay - should not hide the background */}
      <LinearGradient
        colors={['transparent', 'rgba(15, 23, 42, 0.1)', 'transparent']}
        style={styles.contentOverlay}
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
  geometricOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8, // Much more visible
  },
  hexagon: {
    position: 'absolute',
    width: 32, // Larger
    height: 32, // Larger
    transform: [{ rotate: '45deg' }],
    borderRadius: 6,
  },
  connectLine: {
    position: 'absolute',
    height: 4, // Much thicker
  },
  accentDot: {
    position: 'absolute',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
