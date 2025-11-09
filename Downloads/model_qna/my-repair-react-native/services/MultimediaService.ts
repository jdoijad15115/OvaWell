import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export interface SpeechOptions {
  language: string;
  voice?: string;
  rate?: number;
  pitch?: number;
}

export interface VideoPlayerProps {
  source: any;
  shouldPlay?: boolean;
  isLooping?: boolean;
  style?: any;
}

export class MultimediaService {
  private static soundObject: Audio.Sound | null = null;

  // 🎵 Audio Playback
  static async playSound(audioSource: any) {
    try {
      if (this.soundObject) {
        await this.soundObject.unloadAsync();
      }
      
      this.soundObject = new Audio.Sound();
      await this.soundObject.loadAsync(audioSource);
      await this.soundObject.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  static async stopSound() {
    try {
      if (this.soundObject) {
        await this.soundObject.stopAsync();
        await this.soundObject.unloadAsync();
        this.soundObject = null;
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  }

  // 🗣️ Text-to-Speech (Multilingual)
  static async speakText(text: string, options: SpeechOptions = { language: 'en-US' }) {
    try {
      // For web, show a message instead of speech
      if (Platform.OS === 'web') {
        console.log('🗣️ Would speak:', text, 'in language:', options.language);
        return;
      }
      
      await Speech.speak(text, {
        language: options.language,
        rate: options.rate || 0.8,
        pitch: options.pitch || 1.0,
      });
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  }

  static stopSpeech() {
    Speech.stop();
  }

  // 🌍 Language Support
  static getSupportedLanguages() {
    return [
      { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
      { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
      { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
      { code: 'de-DE', name: 'German', flag: '🇩🇪' },
      { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
      { code: 'pt-PT', name: 'Portuguese', flag: '🇵🇹' },
      { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
      { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
      { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
      { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
      { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦' },
      { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
    ];
  }

  // 🎬 Video Utilities
  static createVideoRef() {
    return { current: null };
  }

  // 📸 Image Utilities
  static getAssetPath(assetName: string, type: 'image' | 'video' | 'audio') {
    const basePath = `../assets/${type}s`;
    return `${basePath}/${assetName}`;
  }
}

// 🎨 UI Enhancement Utilities
export class UIEnhancements {
  // Enhanced gradients
  static gradients = {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'], 
    accent: ['#4facfe', '#00f2fe'],
    warm: ['#fa709a', '#fee140'],
    cool: ['#a8edea', '#fed6e3'],
    sunset: ['#d299c2', '#fef9d7'],
    tech: ['#667eea', '#764ba2'],
    ocean: ['#4facfe', '#00f2fe'],
    nature: ['#a8edea', '#fed6e3'],
  };

  static shadows = {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 10,
    },
  };

  static animations = {
    fadeIn: {
      opacity: 1,
      transform: [{ translateY: 0 }],
    },
    fadeOut: {
      opacity: 0,
      transform: [{ translateY: -10 }],
    },
    slideIn: {
      transform: [{ translateX: 0 }],
    },
    slideOut: {
      transform: [{ translateX: -300 }],
    },
  };

  static createEnhancedStyles(screenWidth: number, screenHeight: number) {
    return {
      container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
      backgroundGradient: {
        flex: 1,
        minHeight: screenHeight,
      },
      content: {
        padding: 20,
        paddingTop: 60,
      },
      header: {
        alignItems: 'center',
        marginBottom: 30,
      },
      title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 10,
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.1)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
      subtitle: {
      fontSize: 16,
      color: '#7f8c8d',
      textAlign: 'center',
      opacity: 0.8,
      marginBottom: 30,
    },
      languageSelector: {
        backgroundColor: 'rgba(44, 62, 80, 0.1)',
        padding: 12,
        borderRadius: 25,
        marginTop: 10,
        ...UIEnhancements.shadows.small,
      },
      languageText: {
        color: '#2C3E50',
        fontSize: 14,
        fontWeight: '600',
      },
      languageMenu: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 12,
        marginTop: 10,
        padding: 8,
        ...UIEnhancements.shadows.medium,
      },
      languageOption: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 2,
      },
      languageOptionText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
      },
      statusCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...UIEnhancements.shadows.small,
      },
      statusText: {
        fontSize: 14,
        fontWeight: '600',
      },
      audioIcon: {
        fontSize: 20,
      },
      videoSection: {
        marginBottom: 25,
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 15,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
      },
      videoContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        ...UIEnhancements.shadows.medium,
      },
      videoPlaceholder: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      videoText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
        marginBottom: 8,
      },
      videoSubtext: {
        fontSize: 14,
        color: '#ffffff',
        opacity: 0.9,
        textAlign: 'center',
        marginBottom: 15,
      },
      playButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 12,
        borderRadius: 25,
        ...UIEnhancements.shadows.small,
      },
      playButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
      },
      featuresContainer: {
        marginBottom: 25,
      },
      featureCard: {
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
        ...UIEnhancements.shadows.medium,
      },
      featureGradient: {
        padding: 20,
        alignItems: 'center',
        position: 'relative',
      },
      featureIcon: {
        fontSize: 40,
        marginBottom: 10,
      },
      featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
      },
      featureDescription: {
        fontSize: 14,
        color: '#ffffff',
        textAlign: 'center',
        opacity: 0.9,
        marginBottom: 15,
      },
      audioButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioButtonText: {
        fontSize: 16,
      },
      audioSection: {
        borderRadius: 15,
        overflow: 'hidden',
        ...UIEnhancements.shadows.medium,
      },
      audioGradient: {
        padding: 20,
        alignItems: 'center',
      },
      audioFeatures: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
      },
      audioFeature: {
        alignItems: 'center',
      },
      audioFeatureIcon: {
        fontSize: 24,
        marginBottom: 8,
      },
      audioFeatureText: {
        fontSize: 12,
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: '600',
      },
      testAudioButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 15,
        borderRadius: 25,
        ...UIEnhancements.shadows.small,
      },
      testAudioText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
      },
    };
  }
}
