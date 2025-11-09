import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  Dimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AIService } from '../services/AIService';
import { MultimediaService, UIEnhancements } from '../services/MultimediaService';
import { DeviceFlashCards } from '../components/DeviceFlashCards';
import { MultiLanguageAudioSelector } from '../components/MultiLanguageAudioSelector';
import { AppDemoVideo } from '../components/AppDemoVideo';

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState({ connected: false, message: 'Checking...' });
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
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
    const welcomeMessages: { [key: string]: string } = {
      'en-US': 'Welcome to RepAir Pro, your professional AI repair assistant',
      'es-ES': 'Bienvenido a RepAir Pro, tu asistente profesional de reparación con IA',
      'fr-FR': 'Bienvenue dans RepAir Pro, votre assistant de réparation IA professionnel',
      'de-DE': 'Willkommen bei RepAir Pro, Ihrem professionellen KI-Reparatur-Assistenten',
      'hi-IN': 'RepAir Pro में आपका स्वागत है, आपका पेशेवर AI रिपेयर असिस्टेंट'
    };

    const message = welcomeMessages[selectedLanguage] || welcomeMessages['en-US'];
    await MultimediaService.speakText(message, { language: selectedLanguage });
  };

  const handleLanguageChange = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    await speakWelcome();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                paddingTop: 60,
                paddingHorizontal: 24,
              }
            ]}
          >
            {/* Professional Header */}
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 20,
              padding: 24,
              marginBottom: 32,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.12)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 16,
                    }}
                  >
                    <Text style={{ fontSize: 24, color: '#FFFFFF' }}>🔧</Text>
                  </LinearGradient>
                  <View>
                    <Text style={{ 
                      fontSize: 28, 
                      fontWeight: '700',
                      color: '#FFFFFF', 
                      letterSpacing: 0.5,
                    }}>
                      RepAir Pro
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#94A3B8',
                      fontWeight: '500',
                    }}>
                      AI-Powered Repair Assistant
                    </Text>
                  </View>
                </View>
                
                {/* Status Badge */}
                <View style={{
                  backgroundColor: apiStatus.connected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: apiStatus.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                }}>
                  <View style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: apiStatus.connected ? '#10B981' : '#EF4444',
                    marginRight: 6,
                  }} />
                  <Text style={{
                    color: apiStatus.connected ? '#10B981' : '#EF4444',
                    fontSize: 11,
                    fontWeight: '600',
                  }}>
                    {apiStatus.connected ? 'AI Connected' : 'Connecting'}
                  </Text>
                </View>
              </View>
              
              {/* Enhanced Language Selector */}
              <MultiLanguageAudioSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                showTestAudio={true}
                compact={false}
              />
            </View>

            {/* Professional Device Categories */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: 16,
                marginLeft: 4,
              }}>
                🛠️ Device Categories
              </Text>
              <DeviceFlashCards
                selectedLanguage={selectedLanguage}
                onDeviceSelect={(deviceType) => {
                  MultimediaService.speakText(`Selected ${deviceType} repair category`, { language: selectedLanguage });
                }}
              />
            </View>

            {/* Professional Demo Video Section */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: 16,
                marginLeft: 4,
              }}>
                🎬 Product Demo
              </Text>
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.12)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
              }}>
                <Text style={{
                  fontSize: 16,
                  color: '#94A3B8',
                  textAlign: 'center',
                  marginBottom: 16,
                }}>
                  Watch how RepAir Pro assists with device repairs
                </Text>
                <AppDemoVideo onVideoLoad={() => MultimediaService.speakText("Demo video ready", { language: selectedLanguage })} />
              </View>
            </View>

            {/* Professional Action Buttons */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: 16,
                marginLeft: 4,
              }}>
                ⚡ Quick Actions
              </Text>
              
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                gap: 16,
              }}>
                <Link href="/ask" style={{ flex: 1 }}>
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    style={{
                      padding: 20,
                      borderRadius: 16,
                      alignItems: 'center',
                      shadowColor: '#6366F1',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>🤖</Text>
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 16,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                      Ask AI
                    </Text>
                    <Text style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: 12,
                      textAlign: 'center',
                      marginTop: 4,
                    }}>
                      Get repair help
                    </Text>
                  </LinearGradient>
                </Link>

                <Link href="/detect" style={{ flex: 1 }}>
                  <LinearGradient
                    colors={['#10B981', '#059669']}
                    style={{
                      padding: 20,
                      borderRadius: 16,
                      alignItems: 'center',
                      shadowColor: '#10B981',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
                    <Text style={{
                      color: '#FFFFFF',
                      fontSize: 16,
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                      Detect Issues
                    </Text>
                    <Text style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: 12,
                      textAlign: 'center',
                      marginTop: 4,
                    }}>
                      Safety analysis
                    </Text>
                  </LinearGradient>
                </Link>
              </View>
            </View>

            {/* Professional Footer */}
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              alignItems: 'center',
            }}>
              <Text style={{
                color: '#94A3B8',
                fontSize: 14,
                textAlign: 'center',
                marginBottom: 12,
              }}>
                RepAir Pro • Advanced AI Repair Assistant
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                }}
                onPress={() => MultimediaService.speakText("Welcome to RepAir Pro, your professional AI repair assistant", { language: selectedLanguage })}
              >
                <Text style={{
                  color: '#6366F1',
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  🎤 Test Audio System
                </Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
