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
import { LinearGradient } from 'expo-linear-gradient';
import { AIService } from '../services/AIService';
import { MultimediaService } from '../services/MultimediaService';
import { DeviceFlashCards } from '../components/DeviceFlashCards-product';
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
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vibrant Header */}
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#D946EF']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoEmoji}>🔧</Text>
                </View>
                <View>
                  <Text style={styles.brandName}>FixGenius</Text>
                  <Text style={styles.brandTagline}>AI Repair Expert</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: apiStatus.connected ? '#10B981' : '#F59E0B' }]}>
                <Text style={styles.statusText}>{apiStatus.connected ? 'LIVE' : 'SYNC'}</Text>
              </View>
            </View>
            
            <Text style={styles.welcomeText}>
              Professional device repair guidance powered by AI
            </Text>
          </View>
        </LinearGradient>

        {/* Language Selector */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionLabel}>🌍 Choose Language</Text>
          <MultiLanguageAudioSelector 
            onLanguageChange={handleLanguageChange}
            selectedLanguage={selectedLanguage}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionLabel}>⚡ Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <Link href="/ask" asChild>
              <TouchableOpacity>
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.actionCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.actionIcon}>❓</Text>
                  <Text style={styles.actionTitle}>Ask Expert</Text>
                  <Text style={styles.actionSubtitle}>Get instant repair guidance</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>

            <Link href="/detect" asChild>
              <TouchableOpacity>
                <LinearGradient
                  colors={['#10B981', '#047857']}
                  style={styles.actionCard}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.actionIcon}>🔍</Text>
                  <Text style={styles.actionTitle}>Safety Check</Text>
                  <Text style={styles.actionSubtitle}>Verify repair safety</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity onPress={handleEmergencyRepair}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.actionCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionIcon}>🚨</Text>
                <Text style={styles.actionTitle}>Emergency</Text>
                <Text style={styles.actionSubtitle}>Urgent repair help</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Device Categories */}
        <View style={styles.devicesSection}>
          <Text style={styles.sectionLabel}>📱 Select Device Type</Text>
          <DeviceFlashCards selectedLanguage={selectedLanguage} />
        </View>

        {/* Service Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionLabel}>✨ Why Choose FixGenius?</Text>
          
          <View style={styles.featureGrid}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.featureCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureTitle}>Expert AI</Text>
              <Text style={styles.featureText}>Trained on 10,000+ repair cases</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.featureCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureTitle}>Instant Help</Text>
              <Text style={styles.featureText}>Get answers in seconds</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#06B6D4', '#0891B2']}
              style={styles.featureCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.featureIcon}>🛡️</Text>
              <Text style={styles.featureTitle}>Safety First</Text>
              <Text style={styles.featureText}>Verified safe procedures</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#EC4899', '#DB2777']}
              style={styles.featureCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.featureIcon}>🌍</Text>
              <Text style={styles.featureTitle}>Global Support</Text>
              <Text style={styles.featureText}>Available in 8+ languages</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Stats Footer */}
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={styles.statsSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.statsTitle}>Trusted Worldwide</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50K+</Text>
              <Text style={styles.statLabel}>Happy Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>AI Support</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 24,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    fontFamily: 'System',
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    fontFamily: 'System',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
    fontFamily: 'System',
  },
  languageSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  quickActions: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  actionGrid: {
    gap: 16,
  },
  actionCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    fontFamily: 'System',
  },
  devicesSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginTop: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'System',
  },
  statsSection: {
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 4,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontFamily: 'System',
  },
});
