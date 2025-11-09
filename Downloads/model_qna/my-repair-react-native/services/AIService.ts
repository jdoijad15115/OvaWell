// API service to connect to your trained AI model with anti-hallucination features
import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:8000' : 'http://localhost:8000';

export interface QAResponse {
  answer: string;
  confidence?: number;
  is_safe_response?: boolean;
}

export interface AnomalyResponse {
  step_text: string;
  is_anomaly: boolean;
  score: number;
}

export class AIService {
  static async askQuestion(question: string): Promise<{answer: string, confidence?: number, is_safe_response?: boolean}> {
    try {
      console.log('Making API request to:', `${API_BASE_URL}/ask`);
      
      // For web, provide demo responses
      if (Platform.OS === 'web') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        return {
          answer: "This is a demo response for web. For full AI features, please use the mobile app with our trained repair models.",
          confidence: 85,
          is_safe_response: true
        };
      }
      
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QAResponse = await response.json();
      console.log('API Response received:', data);
      
      return {
        answer: data.answer,
        confidence: data.confidence,
        is_safe_response: data.is_safe_response
      };
    } catch (error) {
      console.error('Error asking question:', error);
      
      // Enhanced fallback with confidence indicator
      return {
        answer: `I'm currently unable to connect to the AI repair assistant. For "${question}", I recommend checking your device manual or consulting with a qualified technician. Common troubleshooting steps include checking power connections, ensuring all cables are secure, and looking for any visible damage.

(Note: Using demo response - API not available)`,
        confidence: 0.7,
        is_safe_response: true
      };
    }
  }

  static async detectAnomaly(stepText: string): Promise<{
    issue: string;
    confidence: number;
    steps: string[];
    isAnomaly: boolean;
    score: number;
  }> {
    try {
      console.log('Making anomaly detection request to:', `${API_BASE_URL}/detect`);
      
      const response = await fetch(`${API_BASE_URL}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step_text: stepText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnomalyResponse = await response.json();
      
      // Convert API response to our format
      return {
        issue: data.is_anomaly ? "Potential issue detected" : "No issues found",
        confidence: Math.round(data.score * 100),
        steps: [
          data.is_anomaly ? 
            "Review this step carefully - it may not follow standard procedures" : 
            "This step appears to follow standard repair procedures"
        ],
        isAnomaly: data.is_anomaly,
        score: data.score
      };
    } catch (error) {
      console.error('Error detecting anomaly:', error);
      // Fallback demo response
      return {
        issue: "Unable to connect to anomaly detector",
        confidence: 75,
        steps: [
          "Check if the procedure follows safety guidelines",
          "Verify all tools are appropriate for the task",
          "Ensure proper sequence of operations"
        ],
        isAnomaly: false,
        score: 0.25
      };
    }
  }

  static async getAPIStatus(): Promise<{connected: boolean, message: string}> {
    try {
      console.log('Checking API status at:', `${API_BASE_URL}/health`);
      
      // For web, provide a fallback response
      if (Platform.OS === 'web') {
        return { 
          connected: true, 
          message: 'Web demo mode - AI features available on mobile app' 
        };
      }
      
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { connected: false, message: `API server error: ${response.status}` };
      }

      const data = await response.json();
      return { connected: true, message: 'Connected successfully' };
    } catch (error: any) {
      console.error('API health check failed:', error);
      if (Platform.OS === 'web') {
        return { 
          connected: true, 
          message: 'Demo mode - Full features on mobile' 
        };
      }
      return { connected: false, message: `Connection failed: ${error.message}` };
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}
