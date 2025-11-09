import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { AIService } from '../services/AIService';

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: false, message: 'Checking...' });
  const [confidence, setConfidence] = useState<number | undefined>();
  const [isSafeResponse, setIsSafeResponse] = useState<boolean>(false);

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
    } catch (error) {
      setAnswer('Sorry, I encountered an error while processing your question.');
      setConfidence(undefined);
      setIsSafeResponse(true);
    }
    setIsLoading(false);
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
    <ScrollView style={{ flex: 1, backgroundColor: '#1a1a1a', padding: 20 }}>
      {/* Header */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: 'bold', 
          color: '#fff', 
          marginBottom: 10 
        }}>
          Ask AI Assistant
        </Text>
        
        {/* API Status */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          marginBottom: 10 
        }}>
          <View style={{ 
            width: 10, 
            height: 10, 
            borderRadius: 5, 
            backgroundColor: apiStatus.connected ? '#4CAF50' : '#F44336',
            marginRight: 8 
          }} />
          <Text style={{ 
            color: apiStatus.connected ? '#4CAF50' : '#F44336',
            fontSize: 14 
          }}>
            {apiStatus.message}
          </Text>
        </View>
        
        <Text style={{ color: '#ccc', fontSize: 16, lineHeight: 24 }}>
          Ask questions about repair procedures and get AI-powered answers from our trained model.
        </Text>
      </View>

      {/* Question Input */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ color: '#fff', fontSize: 16, marginBottom: 10 }}>
          Your Question:
        </Text>
        <TextInput
          style={{
            backgroundColor: '#333',
            color: '#fff',
            padding: 15,
            borderRadius: 10,
            fontSize: 16,
            minHeight: 100,
            textAlignVertical: 'top'
          }}
          value={question}
          onChangeText={setQuestion}
          placeholder="e.g., How do I replace a smartphone screen?"
          placeholderTextColor="#888"
          multiline
        />
      </View>

      {/* Ask Button */}
      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 30
        }}
        onPress={handleAskQuestion}
        disabled={isLoading || !question.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Ask Question
          </Text>
        )}
      </TouchableOpacity>

      {/* Answer Section */}
      {answer && (
        <View style={{
          backgroundColor: '#2a2a2a',
          padding: 20,
          borderRadius: 15,
          marginBottom: 20
        }}>
          <Text style={{ 
            color: '#fff', 
            fontSize: 18, 
            fontWeight: 'bold',
            marginBottom: 15
          }}>
            AI Response:
          </Text>
          
          {/* Confidence and Safety Indicators */}
          <View style={{ 
            flexDirection: 'row', 
            marginBottom: 15,
            flexWrap: 'wrap'
          }}>
            {confidence !== undefined && (
              <View style={{
                backgroundColor: getConfidenceColor(confidence),
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginRight: 8,
                marginBottom: 5
              }}>
                <Text style={{ 
                  color: '#fff', 
                  fontSize: 12, 
                  fontWeight: 'bold'
                }}>
                  {getConfidenceText(confidence)} ({Math.round((confidence || 0) * 100)}%)
                </Text>
              </View>
            )}
            
            {isSafeResponse && (
              <View style={{
                backgroundColor: '#FF9800',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                marginRight: 8,
                marginBottom: 5
              }}>
                <Text style={{ 
                  color: '#fff', 
                  fontSize: 12, 
                  fontWeight: 'bold'
                }}>
                  Safe Response
                </Text>
              </View>
            )}
          </View>
          
          <Text style={{ 
            color: '#fff', 
            fontSize: 16, 
            lineHeight: 24
          }}>
            {answer}
          </Text>
          
          {/* Anti-hallucination notice for low confidence */}
          {confidence !== undefined && confidence < 0.6 && (
            <View style={{
              marginTop: 15,
              padding: 10,
              backgroundColor: '#4a2424',
              borderRadius: 8,
              borderLeftWidth: 4,
              borderLeftColor: '#F44336'
            }}>
              <Text style={{
                color: '#FFB3B3',
                fontSize: 14,
                fontStyle: 'italic'
              }}>
                ⚠️ Low confidence response. Please verify this information before proceeding.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Navigation */}
      <Link href="/" style={{
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'none',
        marginTop: 20
      }}>
        ← Back to Home
      </Link>
    </ScrollView>
  );
}
