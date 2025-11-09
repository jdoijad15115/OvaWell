import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AIService } from '../services/AIService';
import { MultimediaService } from '../services/MultimediaService';
import { MultiLanguageAudioSelector } from '../components/MultiLanguageAudioSelector';

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: false, message: 'Checking...' });
  const [confidence, setConfidence] = useState<number | undefined>();
  const [isSafeResponse, setIsSafeResponse] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    const status = await AIService.getAPIStatus();
    setApiStatus(status);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await AIService.askQuestion(question);
      setAnswer(response.answer);
      setConfidence(response.confidence);
      setIsSafeResponse(response.is_safe_response || false);
      
      // Auto-speak the answer if it's a confident response
      if (response.confidence && response.confidence >= 0.7) {
        setTimeout(() => {
          speakAnswer(response.answer);
        }, 500);
      }
    } catch (error) {
      setAnswer('Sorry, I encountered an error while processing your question.');
      setConfidence(undefined);
      setIsSafeResponse(true);
    }
    setIsLoading(false);
  };

  const speakAnswer = async (text: string) => {
    try {
      await MultimediaService.speakText(text, { language: selectedLanguage });
    } catch (error) {
      console.error('Failed to speak answer:', error);
    }
  };

  const getConfidenceColor = (conf?: number) => {
    if (!conf) return '#666';
    if (conf >= 0.8) return '#4CAF50'; // Green
    if (conf >= 0.6) return '#FF9800'; // Orange  
    return '#F44336'; // Red
  };

  const getConfidenceText = (conf?: number) => {
    if (!conf) return '';
    if (conf >= 0.8) return 'High Confidence';
    if (conf >= 0.6) return 'Medium Confidence';
    return 'Low Confidence';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      
      {/* Purple circuit board background image */}
      <ImageBackground
        source={require('../assets/images/circuit-bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark overlay for content readability */}
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.8)', 'rgba(15, 23, 42, 0.9)', 'rgba(15, 23, 42, 0.8)']}
          style={styles.overlay}
        >
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Header */}
            <LinearGradient
              colors={['#374151', '#4B5563', '#6B7280']}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>🤖 Ask AI Assistant</Text>
                
                {/* Enhanced Language Selector */}
                <View style={styles.languageSelectorContainer}>
                  <MultiLanguageAudioSelector
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                    showTestAudio={true}
                    compact={true}
                  />
                </View>
                
                {/* API Status */}
                <View style={[styles.statusContainer, { backgroundColor: apiStatus.connected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }]}>
                  <View style={[styles.statusDot, { backgroundColor: apiStatus.connected ? '#22C55E' : '#EF4444' }]} />
                  <Text style={styles.statusText}>
                    {apiStatus.connected ? '🟢 AI Model Connected' : '🔴 Connection Issue'}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Main Content */}
            <View style={styles.mainContent}>
              <Text style={styles.description}>
                Ask questions about electronics repair and get AI-powered answers with confidence scoring.
              </Text>

              {/* Question Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Your Question:</Text>
                <TextInput
                  style={styles.textInput}
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Ask about electronics repair (e.g., How to fix a broken phone screen?)"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Ask Button */}
              <TouchableOpacity
                style={[styles.askButton, { opacity: isLoading || !question.trim() ? 0.6 : 1 }]}
                onPress={handleAskQuestion}
                disabled={isLoading || !question.trim()}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.askButtonText}>🚀 Ask Question</Text>
                )}
              </TouchableOpacity>

              {/* Answer Section */}
              {answer && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerTitle}>AI Response:</Text>
                  
                  {/* Confidence and Safety Indicators */}
                  <View style={styles.indicatorsContainer}>
                    {confidence !== undefined && (
                      <View style={[styles.confidenceIndicator, { backgroundColor: getConfidenceColor(confidence) }]}>
                        <Text style={styles.indicatorText}>
                          {getConfidenceText(confidence)} ({Math.round((confidence || 0) * 100)}%)
                        </Text>
                      </View>
                    )}
                    
                    {isSafeResponse && (
                      <View style={styles.safetyIndicator}>
                        <Text style={styles.indicatorText}>⚠️ Verify Information</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.answerText}>{answer}</Text>
                  
                  {/* Audio Controls */}
                  <TouchableOpacity
                    style={styles.speakButton}
                    onPress={() => speakAnswer(answer)}
                  >
                    <Text style={styles.speakButtonText}>🔊 Listen to Answer</Text>
                  </TouchableOpacity>
                  
                  {/* Safety Warning for Low Confidence */}
                  {confidence !== undefined && confidence < 0.6 && (
                    <View style={styles.warningContainer}>
                      <Text style={styles.warningText}>
                        ⚠️ Low confidence response. Please verify this information before proceeding.
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Navigation */}
              <Link href="/" style={styles.backLink}>
                ← Back to Home
              </Link>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    width: '100%',
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  languageSelectorContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  description: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  askButton: {
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  answerContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  answerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  confidenceIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  safetyIndicator: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  answerText: {
    color: '#F1F5F9',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  speakButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  speakButtonText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600',
  },
  warningContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  warningText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
  },
  backLink: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 12,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    textDecorationLine: 'none',
    marginTop: 20,
    fontWeight: '600',
    overflow: 'hidden',
  },
});
