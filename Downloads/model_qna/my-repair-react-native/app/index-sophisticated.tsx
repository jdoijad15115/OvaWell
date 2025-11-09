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
      <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sophisticated Header */}
        <LinearGradient
          colors={['#0F172A', '#1E293B', '#334155']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoIcon}>
                    <Text style={styles.logoText}>R</Text>
                  </View>
                </View>
                <View style={styles.brandInfo}>
                  <Text style={styles.brandName}>RepairCraft</Text>
                  <Text style={styles.brandTagline}>Professional Solutions</Text>
                </View>
              </View>
              <View style={[styles.statusIndicator, { backgroundColor: apiStatus.connected ? '#059669' : '#D97706' }]}>
                <View style={styles.statusDot} />
              </View>
            </View>
            
            <Text style={styles.headerDescription}>
              Expert-guided device repair with AI-powered diagnostics
            </Text>
          </View>
        </LinearGradient>

        {/* Language Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Language Preferences</Text>
            <Text style={styles.sectionSubtitle}>Choose your preferred language for guidance</Text>
          </View>
          <View style={styles.languageContainer}>
            <MultiLanguageAudioSelector 
              onLanguageChange={handleLanguageChange}
              selectedLanguage={selectedLanguage}
            />
          </View>
        </View>

        {/* Service Options */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>How can we assist you?</Text>
            <Text style={styles.sectionSubtitle}>Select the type of support you need</Text>
          </View>
          
          <View style={styles.serviceGrid}>
            <Link href="/ask" asChild>
              <TouchableOpacity style={styles.serviceCard}>
                <View style={[styles.serviceIcon, { backgroundColor: '#1E40AF' }]}>
                  <Text style={styles.serviceEmoji}>💡</Text>
                </View>
                <Text style={styles.serviceTitle}>Expert Consultation</Text>
                <Text style={styles.serviceDescription}>Get professional repair guidance and step-by-step instructions</Text>
                <View style={styles.serviceArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            </Link>

            <Link href="/detect" asChild>
              <TouchableOpacity style={styles.serviceCard}>
                <View style={[styles.serviceIcon, { backgroundColor: '#059669' }]}>
                  <Text style={styles.serviceEmoji}>🔒</Text>
                </View>
                <Text style={styles.serviceTitle}>Safety Verification</Text>
                <Text style={styles.serviceDescription}>Validate repair procedures for safety compliance</Text>
                <View style={styles.serviceArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity style={styles.serviceCard} onPress={handleEmergencyRepair}>
              <View style={[styles.serviceIcon, { backgroundColor: '#DC2626' }]}>
                <Text style={styles.serviceEmoji}>⚡</Text>
              </View>
              <Text style={styles.serviceTitle}>Priority Support</Text>
              <Text style={styles.serviceDescription}>Immediate assistance for critical repair situations</Text>
              <View style={styles.serviceArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Device Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Device Categories</Text>
            <Text style={styles.sectionSubtitle}>Select your device type for specialized support</Text>
          </View>
          <DeviceFlashCards selectedLanguage={selectedLanguage} />
        </View>

        {/* Value Propositions */}
        <View style={styles.valueSection}>
          <Text style={styles.valueTitle}>Why professionals choose RepairCraft</Text>
          
          <View style={styles.valueGrid}>
            <View style={styles.valueCard}>
              <View style={[styles.valueIcon, { backgroundColor: '#F3F4F6' }]}>
                <Text style={styles.valueEmoji}>🎯</Text>
              </View>
              <Text style={styles.valueItemTitle}>Precision Guidance</Text>
              <Text style={styles.valueDescription}>AI-powered diagnostics trained on thousands of repair scenarios</Text>
            </View>

            <View style={styles.valueCard}>
              <View style={[styles.valueIcon, { backgroundColor: '#F3F4F6' }]}>
                <Text style={styles.valueEmoji}>⚡</Text>
              </View>
              <Text style={styles.valueItemTitle}>Instant Access</Text>
              <Text style={styles.valueDescription}>Get immediate expert guidance without waiting</Text>
            </View>

            <View style={styles.valueCard}>
              <View style={[styles.valueIcon, { backgroundColor: '#F3F4F6' }]}>
                <Text style={styles.valueEmoji}>🛡️</Text>
              </View>
              <Text style={styles.valueItemTitle}>Safety Assured</Text>
              <Text style={styles.valueDescription}>Every procedure verified for safety and compliance</Text>
            </View>

            <View style={styles.valueCard}>
              <View style={[styles.valueIcon, { backgroundColor: '#F3F4F6' }]}>
                <Text style={styles.valueEmoji}>🌍</Text>
              </View>
              <Text style={styles.valueItemTitle}>Global Support</Text>
              <Text style={styles.valueDescription}>Multi-language support with local expertise</Text>
            </View>
          </View>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <LinearGradient
            colors={['#F8FAFC', '#F1F5F9']}
            style={styles.trustContainer}
          >
            <Text style={styles.trustTitle}>Trusted by repair professionals worldwide</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50,000+</Text>
                <Text style={styles.statLabel}>Professionals</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>99.2%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>24/7</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
            </View>
          </LinearGradient>
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
    paddingBottom: 40,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    gap: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoContainer: {
    position: 'relative',
  },
  logoIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    fontFamily: 'System',
  },
  brandInfo: {
    gap: 4,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    fontFamily: 'System',
  },
  brandTagline: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    fontFamily: 'System',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  headerDescription: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
    fontFamily: 'System',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    fontFamily: 'System',
  },
  languageContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
    position: 'relative',
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceEmoji: {
    fontSize: 24,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  serviceDescription: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    fontFamily: 'System',
    paddingRight: 40,
  },
  serviceArrow: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },
  valueSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#FAFAFA',
  },
  valueTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'System',
    letterSpacing: -0.3,
  },
  valueGrid: {
    gap: 24,
  },
  valueCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  valueEmoji: {
    fontSize: 20,
  },
  valueItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'System',
  },
  valueDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    fontFamily: 'System',
    flex: 1,
  },
  trustSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  trustContainer: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  trustTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'System',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'System',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: 'System',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#CBD5E1',
  },
});
