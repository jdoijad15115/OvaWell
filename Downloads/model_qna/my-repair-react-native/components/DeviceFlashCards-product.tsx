import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MultimediaService } from '../services/MultimediaService';

interface DeviceFlashCardsProps {
  selectedLanguage: string;
  onDeviceSelect?: (deviceType: string) => void;
}

interface DeviceCardData {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: string;
  audioText: { [key: string]: string };
}

const DEVICE_CARDS: DeviceCardData[] = [
  {
    id: 'phone',
    name: 'Smartphones',
    icon: '📱',
    description: 'Screen, battery & software repair',
    count: '2.5k+ repairs',
    audioText: {
      'en-US': 'Smartphone repair services - Fix screens, batteries, and software issues',
      'es-ES': 'Servicios de reparación de teléfonos - Reparar pantallas, baterías y problemas de software',
      'fr-FR': 'Services de réparation de téléphone - Réparer écrans, batteries et problèmes logiciels',
      'de-DE': 'Handy-Reparaturdienste - Bildschirme, Batterien und Software-Probleme reparieren',
      'hi-IN': 'फोन रिपेयर सेवाएं - स्क्रीन, बैटरी और सॉफ्टवेयर समस्याओं को ठीक करें'
    }
  },
  {
    id: 'tablet',
    name: 'Tablets',
    icon: '📲',
    description: 'Touch screen & charging issues',
    count: '1.8k+ repairs',
    audioText: {
      'en-US': 'Tablet repair services - Fix touchscreens, charging ports, and performance issues',
      'es-ES': 'Servicios de reparación de tabletas - Reparar pantallas táctiles, puertos de carga y problemas de rendimiento',
      'fr-FR': 'Services de réparation de tablettes - Réparer écrans tactiles, ports de charge et problèmes de performance',
      'de-DE': 'Tablet-Reparaturdienste - Touchscreens, Ladeanschlüsse und Leistungsprobleme reparieren',
      'hi-IN': 'टैबलेट रिपेयर सेवाएं - टचस्क्रीन, चार्जिंग पोर्ट और प्रदर्शन समस्याओं को ठीक करें'
    }
  },
  {
    id: 'laptop',
    name: 'Laptops',
    icon: '💻',
    description: 'Keyboard, screen & system repair',
    count: '3.2k+ repairs',
    audioText: {
      'en-US': 'Laptop repair services - Fix keyboards, screens, hard drives, and system issues',
      'es-ES': 'Servicios de reparación de portátiles - Reparar teclados, pantallas, discos duros y problemas del sistema',
      'fr-FR': 'Services de réparation d\'ordinateurs portables - Réparer claviers, écrans, disques durs et problèmes système',
      'de-DE': 'Laptop-Reparaturdienste - Tastaturen, Bildschirme, Festplatten und Systemprobleme reparieren',
      'hi-IN': 'लैपटॉप रिपेयर सेवाएं - कीबोर्ड, स्क्रीन, हार्ड ड्राइव और सिस्टम समस्याओं को ठीक करें'
    }
  }
];

export function DeviceFlashCards({ selectedLanguage, onDeviceSelect }: DeviceFlashCardsProps) {
  const handleCardPress = async (card: DeviceCardData) => {
    // Play audio description
    const text = card.audioText[selectedLanguage] || card.audioText['en-US'];
    await MultimediaService.speakText(text, { language: selectedLanguage });
    
    // Call selection handler if provided
    if (onDeviceSelect) {
      onDeviceSelect(card.id);
    }
  };

  return (
    <View style={styles.container}>
      {DEVICE_CARDS.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={styles.card}
          onPress={() => handleCardPress(card)}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.name}</Text>
                <Text style={styles.cardCount}>{card.count}</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>{card.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardCount: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});
