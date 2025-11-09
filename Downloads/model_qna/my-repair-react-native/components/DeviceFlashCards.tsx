import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MultimediaService, UIEnhancements } from '../services/MultimediaService';

interface DeviceFlashCardsProps {
  selectedLanguage: string;
  onDeviceSelect?: (deviceType: string) => void;
}

interface DeviceCardData {
  id: string;
  name: string;
  icon: string;
  color: [string, string];
  description: string;
  audioText: { [key: string]: string };
}

const DEVICE_CARDS: DeviceCardData[] = [
  {
    id: 'phone',
    name: 'Phone',
    icon: '📱',
    color: ['#6366F1', '#8B5CF6'],
    description: 'Smartphone & Mobile Device Repair',
    audioText: {
      'en-US': 'Phone repair services - Fix screens, batteries, and software issues',
      'es-ES': 'Servicios de reparación de teléfonos - Reparar pantallas, baterías y problemas de software',
      'fr-FR': 'Services de réparation de téléphone - Réparer écrans, batteries et problèmes logiciels',
      'de-DE': 'Handy-Reparaturdienste - Bildschirme, Batterien und Software-Probleme reparieren',
      'hi-IN': 'फोन रिपेयर सेवाएं - स्क्रीन, बैटरी और सॉफ्टवेयर समस्याओं को ठीक करें'
    }
  },
  {
    id: 'tablet',
    name: 'Tablet',
    icon: '📲',
    color: ['#10B981', '#059669'],
    description: 'Tablet & iPad Repair Solutions',
    audioText: {
      'en-US': 'Tablet repair services - Fix touchscreens, charging ports, and performance issues',
      'es-ES': 'Servicios de reparación de tabletas - Reparar pantallas táctiles, puertos de carga y problemas de rendimiento',
      'fr-FR': 'Services de réparation de tablettes - Réparer écrans tactiles, ports de charge et problèmes de performance',
      'de-DE': 'Tablet-Reparaturdienste - Touchscreens, Ladeanschlüsse und Leistungsprobleme reparieren',
      'it-IT': 'Servizi di riparazione tablet - Riparare touchscreen, porte di ricarica e problemi di prestazioni',
      'pt-PT': 'Serviços de reparação de tablets - Reparar touchscreens, portas de carregamento e problemas de desempenho',
      'ru-RU': 'Услуги ремонта планшетов - Ремонт сенсорных экранов, разъемов зарядки и проблем с производительностью',
      'ja-JP': 'タブレット修理サービス - タッチスクリーン、充電ポート、パフォーマンスの問題を修正',
      'ko-KR': '태블릿 수리 서비스 - 터치스크린, 충전 포트 및 성능 문제 수정',
      'zh-CN': '平板维修服务 - 修复触摸屏、充电端口和性能问题',
      'ar-SA': 'خدمات إصلاح الأجهزة اللوحية - إصلاح شاشات اللمس ومنافذ الشحن ومشاكل الأداء',
      'hi-IN': 'टैबलेट रिपेयर सेवाएं - टचस्क्रीन, चार्जिंग पोर्ट और प्रदर्शन समस्याओं को ठीक करें'
    }
  },
  {
    id: 'laptop',
    name: 'Laptop',
    icon: '💻',
    color: ['#EC4899', '#F97316'],
    description: 'Laptop & Computer Repair',
    audioText: {
      'en-US': 'Laptop repair services - Fix keyboards, screens, hard drives, and system issues',
      'es-ES': 'Servicios de reparación de portátiles - Reparar teclados, pantallas, discos duros y problemas del sistema',
      'fr-FR': 'Services de réparation d\'ordinateurs portables - Réparer claviers, écrans, disques durs et problèmes système',
      'de-DE': 'Laptop-Reparaturdienste - Tastaturen, Bildschirme, Festplatten und Systemprobleme reparieren',
      'it-IT': 'Servizi di riparazione laptop - Riparare tastiere, schermi, hard disk e problemi di sistema',
      'pt-PT': 'Serviços de reparação de laptops - Reparar teclados, telas, discos rígidos e problemas do sistema',
      'ru-RU': 'Услуги ремонта ноутбуков - Ремонт клавиатур, экранов, жестких дисков и системных проблем',
      'ja-JP': 'ラップトップ修理サービス - キーボード、画面、ハードドライブ、システムの問題を修正',
      'ko-KR': '노트북 수리 서비스 - 키보드, 화면, 하드 드라이브 및 시스템 문제 수정',
      'zh-CN': '笔记本电脑维修服务 - 修复键盘、屏幕、硬盘和系统问题',
      'ar-SA': 'خدمات إصلاح أجهزة الكمبيوتر المحمولة - إصلاح لوحات المفاتيح والشاشات والأقراص الصلبة ومشاكل النظام',
      'hi-IN': 'लैपटॉप रिपेयर सेवाएं - कीबोर्ड, स्क्रीन, हार्ड ड्राइव और सिस्टम समस्याओं को ठीक करें'
    }
  }
];

export function DeviceFlashCards({ selectedLanguage, onDeviceSelect }: DeviceFlashCardsProps) {
  const { width: screenWidth } = Dimensions.get('window');
  const animatedValues = useRef(
    DEVICE_CARDS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Stagger the animation of cards
    const animations = animatedValues.map((animValue, index) => 
      Animated.timing(animValue, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      })
    );

    Animated.stagger(100, animations).start();
  }, []);

  const handleCardPress = async (card: DeviceCardData) => {
    // Play audio description
    const audioText = card.audioText[selectedLanguage] || card.audioText['en-US'];
    await MultimediaService.speakText(audioText, { language: selectedLanguage });
    
    // Callback for device selection
    onDeviceSelect?.(card.id);
  };

  const cardWidth = (screenWidth - 60) / 3; // 3 cards with spacing

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🛠️ Device Types</Text>
      <Text style={styles.sectionSubtitle}>Tap a device to learn more</Text>
      
      <View style={styles.cardsContainer}>
        {DEVICE_CARDS.map((card, index) => {
          const animatedStyle = {
            opacity: animatedValues[index],
            transform: [
              {
                translateY: animatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              {
                scale: animatedValues[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          };

          return (
            <Animated.View key={card.id} style={[animatedStyle]}>
              <TouchableOpacity
                style={[styles.card, { width: cardWidth }]}
                onPress={() => handleCardPress(card)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={card.color}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.cardIcon}>{card.icon}</Text>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardDescription}>{card.description}</Text>
                  
                  {/* Audio indicator */}
                  <View style={styles.audioIndicator}>
                    <Text style={styles.audioIcon}>🔊</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    ...UIEnhancements.shadows.medium,
  },
  cardGradient: {
    padding: 15,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
    position: 'relative',
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 14,
  },
  audioIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioIcon: {
    fontSize: 12,
  },
});
