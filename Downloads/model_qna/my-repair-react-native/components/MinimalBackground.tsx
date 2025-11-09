import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function MinimalBackground() {
  return (
    <View style={styles.container}>
      {/* Clean minimal gradient */}
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        style={styles.baseGradient}
        locations={[0, 0.5, 1]}
      />
      
      {/* Subtle texture overlay */}
      <View style={styles.textureOverlay}>
        {/* Minimal dots pattern */}
        {Array.from({ length: 20 }).map((_, i) => (
          <View 
            key={i}
            style={[
              styles.dot,
              {
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                opacity: Math.random() * 0.3 + 0.1,
              }
            ]}
          />
        ))}
      </View>
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
  textureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dot: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#64748B',
    borderRadius: 1,
  },
});
