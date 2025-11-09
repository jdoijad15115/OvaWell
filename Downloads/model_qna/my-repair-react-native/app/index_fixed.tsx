import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  ImageBackground,
  Dimensions,
  Image
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Video } from 'expo-av';
import { AIService } from '../services/AIService';
import { MultimediaService, UIEnhancements } from '../services/MultimediaService';

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState({ connected: false, message: 'Checking...' });
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  useEffect(() => {
    checkAPIStatus();
    animateEntry();
    speakWelcome();
  }, []);

  const checkAPIStatus = async () => {
    const status = await AIService.getAPIStatus();
    setApiStatus(status);
  };

  const animateEntry = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const speakWelcome = async () => {
    const languages = MultimediaService.getSupportedLanguages();
    
    const welcomeMessages: { [key: string]: string } = {
      'en-US': 'Welcome to AI Repair Assistant. Your intelligent repair companion.',
      'es-ES': 'Bienvenido al Asistente de Reparación con IA.',
      'fr-FR': 'Bienvenue à l\'Assistant de Réparation IA.',
      'de-DE': 'Willkommen beim KI-Reparatur-Assistenten.',
      'it-IT': 'Benvenuto nell\'Assistente di Riparazione IA.',
      'pt-PT': 'Bem-vindo ao Assistente de Reparo IA.',
      'ru-RU': 'Добро пожаловать в ИИ-помощник по ремонту.',
      'ja-JP': 'AI修理アシスタントへようこそ。',
      'ko-KR': 'AI 수리 도우미에 오신 것을 환영합니다.',
      'zh-CN': '欢迎使用AI维修助手。',
      'ar-SA': 'مرحباً بك في مساعد الإصلاح بالذكاء الاصطناعي.',
      'hi-IN': 'AI मरम्मत सहायक में आपका स्वागत है।',
    };

    setTimeout(() => {
      MultimediaService.speakText(
        welcomeMessages[selectedLanguage] || welcomeMessages['en-US'],
        { language: selectedLanguage, rate: 0.9 }
      );
    }, 1500);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageMenu(false);
    speakWelcome();
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Background Image - Now Visible */}
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=1200&fit=crop&crop=center' }}
        style={{ 
          position: 'absolute', 
          width: screenWidth, 
          height: screenHeight, 
          opacity: 0.2  // Increased opacity to make it more visible
        }}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Header with Language Selector */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              marginTop: 40,
              marginBottom: 30,
            }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              {/* Language Selector */}
              <TouchableOpacity
                onPress={() => setShowLanguageMenu(!showLanguageMenu)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text style={{ color: '#fff', marginRight: 5, fontSize: 16 }}>
                  {MultimediaService.getSupportedLanguages().find(l => l.code === selectedLanguage)?.flag || '🌍'}
                </Text>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                  {MultimediaService.getSupportedLanguages().find(l => l.code === selectedLanguage)?.name.split(' ')[0] || 'English'}
                </Text>
              </TouchableOpacity>

              {/* API Status */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.25)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: apiStatus.connected ? '#4CAF50' : '#F44336',
                  marginRight: 8,
                }} />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>
                  {apiStatus.message}
                </Text>
              </View>
            </View>

            {/* Language Menu */}
            {showLanguageMenu && (
              <View style={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 15,
                padding: 10,
                marginBottom: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
              }}>
                {MultimediaService.getSupportedLanguages().map((lang) => (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => handleLanguageChange(lang.code)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 15,
                      borderRadius: 10,
                      backgroundColor: selectedLanguage === lang.code ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    }}
                  >
                    <Text style={{ fontSize: 18, marginRight: 12 }}>{lang.flag}</Text>
                    <Text style={{
                      fontSize: 16,
                      color: selectedLanguage === lang.code ? '#667eea' : '#333',
                      fontWeight: selectedLanguage === lang.code ? '600' : '400',
                    }}>
                      {lang.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* App Title */}
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              <Text style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
                textShadowColor: 'rgba(0,0,0,0.3)',
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}>
                🔧 RepAIr Assistant
              </Text>
              <Text style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                marginTop: 8,
                fontStyle: 'italic',
              }}>
                AI-Powered Repair Assistant with Multimedia
              </Text>
            </View>
          </Animated.View>

          {/* Demo Video Section - Now Prominently Displayed */}
          <Animated.View style={{
            opacity: fadeAnim,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 15,
            padding: 20,
            marginBottom: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#fff',
              marginBottom: 15,
              textAlign: 'center',
            }}>
              📹 App Demo Video
            </Text>
            
            {/* Video Container - Made More Prominent */}
            <View style={{
              height: 200,
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: 'rgba(255,255,255,0.4)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <Text style={{ fontSize: 64, marginBottom: 15 }}>🎬</Text>
              <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', fontWeight: 'bold' }}>
                Demo Video Coming Soon!
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
                See the AI repair assistant in action
              </Text>
              <TouchableOpacity style={{
                marginTop: 15,
                backgroundColor: 'rgba(255,255,255,0.3)',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.5)',
              }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
                  📹 Add Your Demo Video Here
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Feature Cards */}
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Ask Questions Card */}
            <Link href="/ask" asChild>
              <TouchableOpacity style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 20,
                padding: 25,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                  <Text style={{ fontSize: 28, marginRight: 15 }}>🤖</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#fff',
                      marginBottom: 5,
                    }}>
                      Ask Questions
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 20,
                    }}>
                      Get AI-powered answers with multilingual TTS
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }}>→</Text>
                </View>
              </TouchableOpacity>
            </Link>

            {/* Detect Issues Card */}
            <Link href="/detect" asChild>
              <TouchableOpacity style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 20,
                padding: 25,
                marginBottom: 30,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                  <Text style={{ fontSize: 28, marginRight: 15 }}>🔍</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: '#fff',
                      marginBottom: 5,
                    }}>
                      Detect Issues
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: 20,
                    }}>
                      AI-powered analysis with audio feedback
                    </Text>
                  </View>
                  <Text style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)' }}>→</Text>
                </View>
              </TouchableOpacity>
            </Link>
          </Animated.View>

          {/* Statistics */}
          <Animated.View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
            opacity: fadeAnim,
          }}>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
              marginRight: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
                1000+
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                Problems Solved
              </Text>
            </View>
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: 20,
              alignItems: 'center',
              marginLeft: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
                95%
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center' }}>
                Accuracy Rate
              </Text>
            </View>
          </Animated.View>

          {/* Audio Features Info */}
          <Animated.View style={{
            opacity: fadeAnim,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 15,
            padding: 20,
            marginBottom: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#fff',
              marginBottom: 10,
              textAlign: 'center',
            }}>
              🔊 Audio Features
            </Text>
            <Text style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
              lineHeight: 20,
            }}>
              • Multilingual Text-to-Speech (12 languages){'\n'}
              • Auto-speak high confidence responses{'\n'}
              • Manual audio controls for all answers
            </Text>
          </Animated.View>

          {/* Footer */}
          <View style={{
            alignItems: 'center',
            paddingVertical: 20,
            marginBottom: 40,
          }}>
            <Text style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
            }}>
              🚀 Enhanced with Multimedia Features
            </Text>
            <Text style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              textAlign: 'center',
              marginTop: 5,
            }}>
              Built with React Native & Expo
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
