import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState({ connected: false, message: 'Checking...' });

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      if (response.ok) {
        setApiStatus({ connected: true, message: 'Connected' });
      } else {
        setApiStatus({ connected: false, message: 'API Error' });
      }
    } catch (error) {
      setApiStatus({ connected: false, message: 'Connection Failed' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Repair Assistant</Text>
          <Text style={styles.subtitle}>AI-Powered Device Repair Help</Text>
        </View>

        {/* API Status */}
        <View style={[styles.statusCard, { backgroundColor: apiStatus.connected ? '#e8f5e8' : '#fee' }]}>
          <Text style={[styles.statusText, { color: apiStatus.connected ? '#2e7d2e' : '#d32f2f' }]}>
            API Status: {apiStatus.message}
          </Text>
        </View>

        {/* Video Section Placeholder */}
        <View style={styles.videoSection}>
          <Text style={styles.sectionTitle}>App Overview</Text>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoText}>📹 Demo Video Coming Soon</Text>
            <Text style={styles.videoSubtext}>Learn how to use the repair assistant</Text>
          </View>
        </View>

        {/* Main Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <Link href="/ask" asChild>
            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>❓</Text>
              <Text style={styles.featureTitle}>Ask Questions</Text>
              <Text style={styles.featureDescription}>Get help with device repairs</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/detect" asChild>
            <TouchableOpacity style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureTitle}>Detect Issues</Text>
              <Text style={styles.featureDescription}>Identify device problems</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Audio Features */}
        <View style={styles.audioSection}>
          <Text style={styles.sectionTitle}>Audio Support</Text>
          <View style={styles.audioFeatures}>
            <Text style={styles.audioFeature}>🔊 Text-to-Speech</Text>
            <Text style={styles.audioFeature}>🌍 12 Languages</Text>
            <Text style={styles.audioFeature}>🎵 Audio Feedback</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  statusCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  videoSection: {
    marginBottom: 30,
  },
  videoPlaceholder: {
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#bdc3c7',
  },
  videoText: {
    fontSize: 18,
    color: '#34495e',
    marginBottom: 8,
  },
  videoSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  audioSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  audioFeature: {
    fontSize: 12,
    color: '#34495e',
    textAlign: 'center',
  },
});
