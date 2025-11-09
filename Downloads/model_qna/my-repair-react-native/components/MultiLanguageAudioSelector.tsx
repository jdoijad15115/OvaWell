import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { MultimediaService, UIEnhancements } from '../services/MultimediaService';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  testText: string;
}

const ENHANCED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    testText: 'Welcome to your AI Repair Assistant'
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    testText: 'आपके एआई रिपेयर असिस्टेंट में आपका स्वागत है'
  },
  {
    code: 'zh-CN',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    testText: '欢迎使用您的AI维修助手'
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    testText: 'AIリペアアシスタントへようこそ'
  },
  {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    testText: 'AI 수리 어시스턴트에 오신 것을 환영합니다'
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    testText: 'Bienvenido a tu Asistente de Reparación con IA'
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    testText: 'Bienvenue dans votre Assistant de Réparation IA'
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    testText: 'Willkommen bei Ihrem KI-Reparatur-Assistenten'
  }
];

interface MultiLanguageAudioSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  showTestAudio?: boolean;
  compact?: boolean;
}

export function MultiLanguageAudioSelector({ 
  selectedLanguage, 
  onLanguageChange, 
  showTestAudio = true,
  compact = false 
}: MultiLanguageAudioSelectorProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingLanguage, setPlayingLanguage] = useState<string | null>(null);

  // Animation values
  const selectorScale = useSharedValue(1);
  const menuOpacity = useSharedValue(0);
  const menuScale = useSharedValue(0.8);

  useEffect(() => {
    if (showLanguageMenu) {
      menuOpacity.value = withTiming(1, { duration: 200 });
      menuScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    } else {
      menuOpacity.value = withTiming(0, { duration: 150 });
      menuScale.value = withTiming(0.8, { duration: 150 });
    }
  }, [showLanguageMenu]);

  const currentLanguage = ENHANCED_LANGUAGES.find(lang => lang.code === selectedLanguage) || ENHANCED_LANGUAGES[0];

  const handleLanguageSelect = async (language: LanguageOption) => {
    onLanguageChange(language.code);
    setShowLanguageMenu(false);
    
    // Animate selector
    selectorScale.value = withSpring(0.95, { duration: 100 });
    setTimeout(() => {
      selectorScale.value = withSpring(1, { duration: 200 });
    }, 100);
    
    // Auto-play test audio if enabled
    if (showTestAudio) {
      await playTestAudio(language);
    }
  };

  const playTestAudio = async (language: LanguageOption) => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setPlayingLanguage(language.code);
    
    try {
      await MultimediaService.speakText(language.testText, { 
        language: language.code,
        rate: 0.8,
        pitch: 1.0
      });
    } catch (error) {
      console.log('TTS Error:', error);
    } finally {
      setIsPlaying(false);
      setPlayingLanguage(null);
    }
  };

  // Animated styles
  const selectorStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selectorScale.value }]
  }));

  const menuStyle = useAnimatedStyle(() => ({
    opacity: menuOpacity.value,
    transform: [{ scale: menuScale.value }]
  }));

  return (
    <View style={styles.container}>
      {/* Language Selector Button */}
      <Animated.View style={selectorStyle}>
        <TouchableOpacity
          style={[styles.selectorButton, compact && styles.compactSelector]}
          onPress={() => setShowLanguageMenu(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.selectorGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.flagText}>{currentLanguage.flag}</Text>
            <View style={styles.languageInfo}>
              <Text style={styles.languageName}>{currentLanguage.name}</Text>
              {!compact && (
                <Text style={styles.nativeName}>{currentLanguage.nativeName}</Text>
              )}
            </View>
            <Text style={styles.dropdownArrow}>🔽</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowLanguageMenu(false)}
          activeOpacity={1}
        >
          <Animated.View style={[styles.modalContent, menuStyle]}>
            <LinearGradient
              colors={['#f8f9fa', '#ffffff']}
              style={styles.modalGradient}
            >
              <Text style={styles.modalTitle}>🌍 Choose Language</Text>
              
              <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
                {ENHANCED_LANGUAGES.map((language, index) => (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageOption,
                      selectedLanguage === language.code && styles.selectedLanguage,
                      index === ENHANCED_LANGUAGES.length - 1 && styles.lastOption
                    ]}
                    onPress={() => handleLanguageSelect(language)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.languageContent}>
                      <Text style={styles.flagIcon}>{language.flag}</Text>
                      <View style={styles.languageDetails}>
                        <Text style={styles.optionName}>{language.name}</Text>
                        <Text style={styles.optionNativeName}>{language.nativeName}</Text>
                      </View>
                      
                      {/* Test Audio Button */}
                      {showTestAudio && (
                        <TouchableOpacity
                          style={[
                            styles.testAudioButton,
                            isPlaying && playingLanguage === language.code && styles.playingAudio
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            playTestAudio(language);
                          }}
                          disabled={isPlaying}
                        >
                          <Text style={styles.audioIcon}>
                            {isPlaying && playingLanguage === language.code ? '⏸️' : '🔊'}
                          </Text>
                        </TouchableOpacity>
                      )}
                      
                      {selectedLanguage === language.code && (
                        <Text style={styles.checkmark}>✅</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowLanguageMenu(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  selectorButton: {
    borderRadius: 25,
    overflow: 'hidden',
    ...UIEnhancements.shadows.medium,
  },
  compactSelector: {
    borderRadius: 20,
  },
  selectorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 180,
  },
  flagText: {
    fontSize: 20,
    marginRight: 10,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nativeName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '70%',
    borderRadius: 20,
    overflow: 'hidden',
    ...UIEnhancements.shadows.large,
  },
  modalGradient: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 15,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedLanguage: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  languageDetails: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  optionNativeName: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  testAudioButton: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playingAudio: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
  },
  audioIcon: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
