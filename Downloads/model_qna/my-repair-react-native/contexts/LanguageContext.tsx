import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES, TRANSLATIONS, LanguageCode, TranslationKey } from '../constants/languages';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, section?: TranslationKey) => string;
  languages: typeof LANGUAGES;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@repair_ai_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language on app start
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage as LanguageCode);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (language: LanguageCode) => {
    try {
      setCurrentLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  // Translation function
  const t = (key: string, section: TranslationKey = 'home'): string => {
    try {
      const keys = key.split('.');
      let translation: any = TRANSLATIONS[section][currentLanguage];
      
      for (const k of keys) {
        translation = translation[k];
      }
      
      return translation || key;
    } catch (error) {
      // Fallback to English
      try {
        const keys = key.split('.');
        let fallback: any = TRANSLATIONS[section]['en'];
        
        for (const k of keys) {
          fallback = fallback[k];
        }
        
        return fallback || key;
      } catch {
        return key;
      }
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    languages: LANGUAGES,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
