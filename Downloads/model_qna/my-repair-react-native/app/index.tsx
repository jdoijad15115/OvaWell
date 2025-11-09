import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  StyleSheet,
  Image,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AIService } from '../services/AIService';
import { MultimediaService } from '../services/MultimediaService';
import { DeviceFlashCards } from '../components/DeviceFlashCards-product';
import { MultiLanguageAudioSelector } from '../components/MultiLanguageAudioSelector';
import { ProfessionalBackground } from '../components/ProfessionalBackground';
import { AppDemoVideo } from '../components/AppDemoVideo';
import { MultimediaVideo } from '../components/MultimediaVideo';
import { SimpleVideo } from '../components/SimpleVideo';
import { WebCompatBackground } from '../components/WebCompatBackground';

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
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Web-compatible background */}
      <WebCompatBackground style={styles.backgroundImage}>
        {/* Dark overlay for content readability */}
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.8)', 'rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 0.8)']}
          style={styles.overlay}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Modern Professional Header */}
            <LinearGradient
              colors={['#374151', '#4B5563', '#6B7280']}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.brandSection}>
                <View style={styles.logoContainer}>
                  <View style={styles.logoIcon}>
                    <Text style={styles.logoText}>⚡</Text>
                  </View>
                </View>
                <View style={styles.brandInfo}>
                  <Text style={styles.brandName}>RepAIr</Text>
                  <Text style={styles.brandTagline}>Advanced Repair Solutions</Text>
                </View>
              </View>
              
              <View style={[styles.statusIndicator, { backgroundColor: apiStatus.connected ? '#10B981' : '#EF4444' }]}>
                <View style={styles.statusDot} />
              </View>
            </View>
            
            <Text style={styles.headerDescription}>
              Professional device repair guidance powered by advanced AI technology and expert knowledge.
            </Text>
          </View>
        </LinearGradient>        {/* Language Selection */}
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
                <View style={[styles.serviceIcon, { backgroundColor: '#4B5563' }]}>
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
                <View style={[styles.serviceIcon, { backgroundColor: '#6B7280' }]}>
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
              <View style={[styles.serviceIcon, { backgroundColor: '#7C2D12' }]}>
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
            <Text style={styles.sectionSubtitle}>Ask me about any device repair - I'll let you know if I can help</Text>
          </View>
          <DeviceFlashCards selectedLanguage={selectedLanguage} />
        </View>

        {/* Value Propositions */}
        <View style={styles.valueSection}>
          <View style={styles.valueSectionHeader}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueTitle}>Why professionals choose RepAIr</Text>
            </View>
          </View>
          
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

        {/* Demo Video Section - Your Qt Movie */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>See RepAIr in Action</Text>
            <Text style={styles.sectionSubtitle}>Watch our repair demo video</Text>
          </View>
          <View style={styles.videoContainer}>
            <SimpleVideo />
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
        </LinearGradient>
      </WebCompatBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 32,
    paddingTop: 80,
    paddingBottom: 50,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerContent: {
    gap: 24,
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
    width: 56,
    height: 56,
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
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    fontFamily: 'System',
  },
  brandInfo: {
    gap: 4,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    fontFamily: 'System',
  },
  brandTagline: {
    fontSize: 18,
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
    fontSize: 20,
    color: '#CBD5E1',
    lineHeight: 28,
    fontFamily: 'System',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sectionHeader: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#94A3B8',
    lineHeight: 26,
    fontFamily: 'System',
  },
  languageContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  serviceGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#475569',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  serviceIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceEmoji: {
    fontSize: 28,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
    fontFamily: 'System',
    letterSpacing: -0.2,
  },
  serviceDescription: {
    fontSize: 18,
    color: '#CBD5E1',
    lineHeight: 26,
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
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600',
  },
  valueSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: '#1E293B',
  },
  valueTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
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
    backgroundColor: '#334155',
  },
  valueEmoji: {
    fontSize: 20,
  },
  valueItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'System',
  },
  valueDescription: {
    fontSize: 14,
    color: '#CBD5E1',
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
  valueSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  valueTextContainer: {
    flex: 1,
  },
  videoContainer: {
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
  },
});
