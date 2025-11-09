import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { LANGUAGES, LanguageCode } from '../constants/languages';
import { SPACING, RADIUS } from '../constants/theme';

interface AudioPlayerProps {
  text: string;
  currentLanguage?: LanguageCode;
  showLanguageSelector?: boolean;
  autoPlay?: boolean;
}

export function AudioPlayer({ 
  text, 
  currentLanguage = 'en', 
  showLanguageSelector = true,
  autoPlay = false 
}: AudioPlayerProps) {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(currentLanguage);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🎭 Animation values
  const playButtonScale = useSharedValue(1);
  const audioWaveAnimation = useSharedValue(0);
  const glowIntensity = useSharedValue(0);

  // 🔊 Audio wave animation
  useEffect(() => {
    if (isPlaying) {
      audioWaveAnimation.value = withRepeat(
        withTiming(1, { duration: 1000 }),
        -1,
        true
      );
      glowIntensity.value = withTiming(1, { duration: 300 });
    } else {
      audioWaveAnimation.value = withTiming(0, { duration: 200 });
      glowIntensity.value = withTiming(0, { duration: 300 });
    }
  }, [isPlaying]);

  // 🎵 Text-to-Speech function (simulated)
  const playAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsLoading(true);
    playButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    try {
      // Simulate API call to text-to-speech service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoading(false);
      setIsPlaying(true);
      
      // Simulate audio duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
      
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Audio Error', 'Unable to play audio. Please try again.');
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    setIsLoading(false);
  };

  // 🎨 Animated styles
  const playButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
    shadowOpacity: interpolate(glowIntensity.value, [0, 1], [0.2, 0.6]),
    shadowRadius: interpolate(glowIntensity.value, [0, 1], [4, 15]),
  }));

  const waveStyle = useAnimatedStyle(() => {
    const scale = interpolate(audioWaveAnimation.value, [0, 1], [0.8, 1.2]);
    const opacity = interpolate(audioWaveAnimation.value, [0, 1], [0.3, 1]);
    
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* 🎵 Audio Control Section */}
      <View style={styles.audioSection}>
        <Animated.View style={[playButtonStyle]}>
          <TouchableOpacity 
            style={[
              styles.playButton, 
              { backgroundColor: isPlaying ? theme.accent : theme.primary }
            ]}
            onPress={playAudio}
            disabled={isLoading}
          >
            <Text style={styles.playIcon}>
              {isLoading ? '🔄' : isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* 🌊 Audio Visualization */}
        <View style={styles.visualizer}>
          {[0, 1, 2, 3, 4].map((index) => (
            <AudioBar 
              key={index} 
              index={index} 
              isPlaying={isPlaying} 
              theme={theme} 
            />
          ))}
        </View>

        <View style={styles.audioInfo}>
          <Text style={styles.audioText}>
            🎵 {LANGUAGES[selectedLanguage].voice} {LANGUAGES[selectedLanguage].name}
          </Text>
          {isPlaying && (
            <Animated.View style={waveStyle}>
              <Text style={styles.playingText}>Playing audio...</Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* 🌐 Language Selector */}
      {showLanguageSelector && (
        <View style={styles.languageSection}>
          <Text style={styles.languageTitle}>🗣️ Select Language</Text>
          <View style={styles.languageGrid}>
            {Object.entries(LANGUAGES).map(([code, lang]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.languageButton,
                  selectedLanguage === code && styles.selectedLanguage,
                  { borderColor: selectedLanguage === code ? theme.primary : theme.border }
                ]}
                onPress={() => setSelectedLanguage(code as LanguageCode)}
              >
                <Text style={styles.languageFlag}>{lang.voice}</Text>
                <Text style={[
                  styles.languageName,
                  { color: selectedLanguage === code ? theme.primary : theme.textSecondary }
                ]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 📝 Text Preview */}
      <View style={styles.textSection}>
        <Text style={styles.textLabel}>Audio Text:</Text>
        <Text style={styles.textPreview} numberOfLines={3}>
          {text}
        </Text>
      </View>
    </View>
  );
}

// 🎵 Audio Bar Component for Visualization
function AudioBar({ index, isPlaying, theme }: any) {
  const height = useSharedValue(8);

  useEffect(() => {
    if (isPlaying) {
      const delay = index * 150;
      height.value = withRepeat(
        withSequence(
          withTiming(20, { duration: 400 }),
          withTiming(8, { duration: 400 })
        ),
        -1,
        false
      );
    } else {
      height.value = withTiming(8, { duration: 200 });
    }
  }, [isPlaying, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    backgroundColor: theme.accent,
  }));

  return (
    <Animated.View style={[{
      width: 4,
      borderRadius: 2,
      marginHorizontal: 2,
    }, animatedStyle]} />
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: theme.border,
    marginVertical: SPACING.md,
  },
  audioSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playIcon: {
    fontSize: 20,
    color: theme.background,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    height: 24,
  },
  audioInfo: {
    flex: 1,
  },
  audioText: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '600',
  },
  playingText: {
    fontSize: 12,
    color: theme.accent,
    fontStyle: 'italic',
    marginTop: 2,
  },
  languageSection: {
    marginBottom: SPACING.md,
  },
  languageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: SPACING.sm,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    backgroundColor: theme.surfaceLight,
  },
  selectedLanguage: {
    backgroundColor: theme.primaryLight + '20',
  },
  languageFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  languageName: {
    fontSize: 12,
    fontWeight: '500',
  },
  textSection: {
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: SPACING.md,
  },
  textLabel: {
    fontSize: 12,
    color: theme.textMuted,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  textPreview: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 18,
  },
});
