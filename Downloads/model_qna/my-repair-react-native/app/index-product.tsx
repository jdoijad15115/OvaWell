import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Link } from 'expo-router';
import { AIService } from '../services/AIService';
import { MultimediaService } from '../services/MultimediaService';
import { DeviceFlashCards } from '../components/DeviceFlashCards';
import { MultiLanguageAudioSelector } from '../components/MultiLanguageAudioSelector';

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState({ connected: false, message: 'Checking...' });
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    const status = await AIService.getAPIStatus();
    setApiStatus(status);
  };

  const handleLanguageChange = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleEmergencyRepair = async () => {
    await MultimediaService.speakText("Emergency repair support activated", { language: selectedLanguage });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.brandName}>TechFix</Text>
            <View style={[styles.statusDot, { backgroundColor: apiStatus.connected ? '#10B981' : '#EF4444' }]} />
          </View>
          <Text style={styles.tagline}>Professional Device Repair</Text>
        </View>

        {/* Language Selector */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionLabel}>Language</Text>
          <MultiLanguageAudioSelector 
            onLanguageChange={handleLanguageChange}
            selectedLanguage={selectedLanguage}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionLabel}>What can we help you with?</Text>
          
          <View style={styles.actionGrid}>
            <Link href="/ask" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>❓</Text>
                <Text style={styles.actionTitle}>Ask Question</Text>
                <Text style={styles.actionSubtitle}>Get repair guidance</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/detect" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionIcon}>🔍</Text>
                <Text style={styles.actionTitle}>Safety Check</Text>
                <Text style={styles.actionSubtitle}>Verify repair steps</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.actionButton} onPress={handleEmergencyRepair}>
              <Text style={styles.actionIcon}>🚨</Text>
              <Text style={styles.actionTitle}>Emergency</Text>
              <Text style={styles.actionSubtitle}>Urgent repair help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Device Categories */}
        <View style={styles.devicesSection}>
          <Text style={styles.sectionLabel}>Select Your Device</Text>
          <DeviceFlashCards selectedLanguage={selectedLanguage} />
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🎯 Expert Guidance</Text>
            <Text style={styles.infoText}>Step-by-step repair instructions from certified technicians</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>⚡ Safety First</Text>
            <Text style={styles.infoText}>Built-in safety validation for all repair procedures</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>🌍 Multi-Language</Text>
            <Text style={styles.infoText}>Available in 8+ languages with audio support</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>TechFix Pro • Trusted by 50,000+ users</Text>
          <Text style={styles.footerSubtext}>Professional repair guidance at your fingertips</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  tagline: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  languageSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  quickActions: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  actionGrid: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  devicesSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  serviceInfo: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#F8FAFC',
    marginTop: 24,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});
