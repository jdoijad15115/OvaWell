import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AIService } from '../services/AIService';
import { MultimediaService, UIEnhancements } from '../services/MultimediaService';
import { MultiLanguageAudioSelector } from '../components/MultiLanguageAudioSelector';

export default function DetectPage() {
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Check if API is available when component loads
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    const isHealthy = await AIService.checkHealth();
    setApiStatus(isHealthy);
  };

  const handleDetect = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please describe the issue');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await AIService.detectAnomaly(description);
      setAnalysis(result);
      
      // Auto-speak the analysis result
      if (result && result.issue) {
        setTimeout(() => {
          speakAnalysis(result.issue);
        }, 500);
      }
    } catch (error) {
      console.error('Error getting anomaly detection:', error);
      Alert.alert('Error', 'Failed to analyze the issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakAnalysis = async (text: string) => {
    setIsPlaying(true);
    try {
      await MultimediaService.speakText(text, {
        language: selectedLanguage,
        rate: 0.8,
        pitch: 1.0
      });
    } catch (error) {
      console.log('TTS Error:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View style={{ marginTop: 40, marginBottom: 30, alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: 'bold', 
            color: '#FFFFFF', 
            marginBottom: 8,
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}>
            🔍 Issue Detection
          </Text>
          <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 15 }}>
            AI-powered anomaly detection with your trained model
          </Text>
          
          {/* Enhanced Language Selector */}
          <MultiLanguageAudioSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            showTestAudio={true}
            compact={true}
          />
          
          {/* API Status Indicator */}
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginTop: 15,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            backgroundColor: apiStatus ? '#059669' : '#DC2626'
          }}>
            <View style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#FFFFFF',
              marginRight: 8
            }} />
            <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '600' }}>
              {apiStatus === null ? 'Checking...' : apiStatus ? 'AI Model Connected' : 'Demo Mode (API Offline)'}
            </Text>
          </View>
        </View>

        {/* Issue Description */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 }}>
            Describe the issue:
          </Text>
          <TextInput
            style={{
              backgroundColor: '#161B22',
              borderWidth: 1,
              borderColor: '#21262D',
              borderRadius: 12,
              padding: 15,
              color: '#FFFFFF',
              fontSize: 16,
              minHeight: 120,
              textAlignVertical: 'top'
            }}
            multiline
            numberOfLines={6}
            placeholder="Describe what's wrong: device not turning on, strange noises, error messages, etc..."
            placeholderTextColor="#6B7280"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Analyze Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#06B6D4',
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            marginBottom: 20,
            opacity: isLoading ? 0.6 : 1
          }}
          onPress={handleDetect}
          disabled={isLoading}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
            {isLoading ? 'Running Anomaly Detection...' : apiStatus ? 'Analyze with Trained Model' : 'Analyze (Demo Mode)'}
          </Text>
        </TouchableOpacity>

        {/* Analysis Results */}
        {analysis ? (
          <View style={{
            backgroundColor: '#161B22',
            borderWidth: 1,
            borderColor: '#21262D',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', flex: 1 }}>
                {analysis.issue}
              </Text>
              {!apiStatus && (
                <View style={{ 
                  backgroundColor: '#DC2626',
                  borderRadius: 10,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  marginLeft: 10
                }}>
                  <Text style={{ fontSize: 10, color: '#FFFFFF', fontWeight: '600' }}>
                    DEMO MODE
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 14, color: '#06B6D4' }}>
                Confidence: {analysis.confidence}%
              </Text>
              {analysis.isAnomaly !== undefined && (
                <Text style={{ 
                  fontSize: 12, 
                  color: analysis.isAnomaly ? '#EF4444' : '#10B981',
                  marginLeft: 15,
                  fontWeight: 'bold'
                }}>
                  {analysis.isAnomaly ? '⚠️ Anomaly' : '✅ Normal'}
                </Text>
              )}
            </View>
            
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 10 }}>
              Recommended Steps:
            </Text>
            
            {analysis.steps.map((step: string, index: number) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' }}>
                <Text style={{ color: '#06B6D4', fontWeight: 'bold', marginRight: 8, minWidth: 20 }}>
                  {index + 1}.
                </Text>
                <Text style={{ flex: 1, color: '#E6E7E8', fontSize: 14, lineHeight: 20 }}>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Back Button */}
        <Link href="/" asChild>
          <TouchableOpacity style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
            borderRadius: 15,
            padding: 16,
            alignItems: 'center',
            marginTop: 20,
            ...UIEnhancements.shadows.small,
          }}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>← Back to Home</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </LinearGradient>
  );
}
