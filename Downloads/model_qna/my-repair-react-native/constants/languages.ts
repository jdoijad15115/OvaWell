// 🎵 MULTILINGUAL AUDIO SYSTEM
// Supports 9+ languages with AI-powered voice synthesis

export const LANGUAGES = {
  en: { name: 'English', voice: '🇺🇸', code: 'en-US' },
  hi: { name: 'हिन्दी', voice: '🇮🇳', code: 'hi-IN' },
  fr: { name: 'Français', voice: '🇫🇷', code: 'fr-FR' },
  de: { name: 'Deutsch', voice: '🇩🇪', code: 'de-DE' },
  es: { name: 'Español', voice: '🇪🇸', code: 'es-ES' },
  ur: { name: 'اردو', voice: '🇵🇰', code: 'ur-PK' },
  ko: { name: '한국어', voice: '🇰🇷', code: 'ko-KR' },
  zh: { name: '中文', voice: '🇨🇳', code: 'zh-CN' },
  ja: { name: '日本語', voice: '🇯🇵', code: 'ja-JP' },
} as const;

// 🗣️ Multilingual content for the app
export const TRANSLATIONS = {
  // 🏠 Home Page
  home: {
    en: {
      title: '🔧 Repair AI',
      subtitle: 'Your Exotic AI Repair Assistant',
      description: 'Welcome to the most advanced device repair guidance system. Experience the future of AI-powered technical support.',
      askCard: {
        title: 'Ask a Question',
        description: 'Get complete, step-by-step repair guides for any device, powered by our advanced AI neural networks.',
      },
      detectCard: {
        title: 'Detect Anomaly',
        description: 'Upload your repair steps and let our quantum-powered AI analyze them for errors, missing steps, or improvements.',
      },
      features: {
        title: '✨ Premium Features',
        audio: {
          title: 'Multilingual Audio',
          description: 'Support for 9+ languages with AI-powered voice synthesis',
        },
        neural: {
          title: 'Neural Networks',
          description: 'Advanced AI models trained on millions of repair guides',
        },
        quantum: {
          title: 'Quantum Processing',
          description: 'Ultra-fast anomaly detection with 99.7% accuracy',
        },
        themes: {
          title: 'Exotic Themes',
          description: '4 premium themes: Midnight, Arctic, Ocean, Sakura',
        },
      },
      howTo: {
        title: '🚀 How to Use',
        instructions: [
          'Select "Ask a Question" for AI-generated repair guides',
          'Choose "Detect Anomaly" to validate your own steps',
          'Enjoy premium animations and exotic themes',
          'Access multilingual audio support',
        ],
      },
      stats: {
        title: '📊 AI Performance',
        accuracy: 'Accuracy',
        response: 'Response',
        devices: 'Devices',
        languages: 'Languages',
      },
      audio: 'Welcome to Repair AI. Select "Ask a Question" to get step-by-step repair guides, or "Detect Anomaly" to check your own repair steps for errors.',
    },
    hi: {
      title: '🔧 रिपेयर एआई',
      subtitle: 'आपका विदेशी एआई रिपेयर असिस्टेंट',
      description: 'सबसे उन्नत डिवाइस मरम्मत मार्गदर्शन प्रणाली में आपका स्वागत है। एआई-संचालित तकनीकी सहायता के भविष्य का अनुभव करें।',
      askCard: {
        title: 'प्रश्न पूछें',
        description: 'हमारे उन्नत एआई न्यूरल नेटवर्क द्वारा संचालित किसी भी डिवाइस के लिए पूर्ण, चरण-दर-चरण मरम्मत गाइड प्राप्त करें।',
      },
      detectCard: {
        title: 'विसंगति का पता लगाएं',
        description: 'अपने मरम्मत चरणों को अपलोड करें और हमारे क्वांटम-संचालित एआई को त्रुटियों, लापता चरणों या सुधारों के लिए उनका विश्लेषण करने दें।',
      },
      audio: 'रिपेयर एआई में आपका स्वागत है। चरण-दर-चरण मरम्मत गाइड प्राप्त करने के लिए "प्रश्न पूछें" चुनें, या त्रुटियों के लिए अपने स्वयं के मरम्मत चरणों की जांच करने के लिए "विसंगति का पता लगाएं" चुनें।',
    },
    fr: {
      title: '🔧 Repair AI',
      subtitle: 'Votre Assistant de Réparation IA Exotique',
      description: 'Bienvenue dans le système de guidage de réparation d\'appareils le plus avancé. Découvrez l\'avenir du support technique alimenté par l\'IA.',
      askCard: {
        title: 'Poser une Question',
        description: 'Obtenez des guides de réparation complets, étape par étape, pour tout appareil, alimentés par nos réseaux de neurones IA avancés.',
      },
      detectCard: {
        title: 'Détecter une Anomalie',
        description: 'Téléchargez vos étapes de réparation et laissez notre IA quantique les analyser pour détecter erreurs, étapes manquantes ou améliorations.',
      },
      audio: 'Bienvenue sur Repair AI. Sélectionnez "Poser une question" pour obtenir des guides de réparation étape par étape, ou "Détecter une anomalie" pour vérifier vos propres étapes de réparation.',
    },
    de: {
      title: '🔧 Repair AI',
      subtitle: 'Ihr Exotischer KI-Reparatur-Assistent',
      description: 'Willkommen beim fortschrittlichsten Gerät-Reparatur-System. Erleben Sie die Zukunft der KI-gesteuerten technischen Unterstützung.',
      askCard: {
        title: 'Frage Stellen',
        description: 'Erhalten Sie vollständige, schrittweise Reparaturanleitungen für jedes Gerät, unterstützt von unseren fortschrittlichen KI-Neuronalen Netzwerken.',
      },
      detectCard: {
        title: 'Anomalie Erkennen',
        description: 'Laden Sie Ihre Reparaturschritte hoch und lassen Sie unsere quantum-gesteuerte KI sie auf Fehler, fehlende Schritte oder Verbesserungen analysieren.',
      },
      audio: 'Willkommen bei Repair AI. Wählen Sie "Frage stellen" für Schritt-für-Schritt-Reparaturanleitungen oder "Anomalie erkennen" zur Überprüfung Ihrer eigenen Reparaturschritte.',
    },
    es: {
      title: '🔧 Repair AI',
      subtitle: 'Tu Asistente de Reparación IA Exótico',
      description: 'Bienvenido al sistema de orientación de reparación de dispositivos más avanzado. Experimenta el futuro del soporte técnico impulsado por IA.',
      askCard: {
        title: 'Hacer Pregunta',
        description: 'Obtén guías de reparación completas, paso a paso, para cualquier dispositivo, impulsadas por nuestras redes neuronales de IA avanzadas.',
      },
      detectCard: {
        title: 'Detectar Anomalía',
        description: 'Sube tus pasos de reparación y deja que nuestra IA cuántica los analice en busca de errores, pasos faltantes o mejoras.',
      },
      audio: 'Bienvenido a Repair AI. Seleccione "Hacer una pregunta" para obtener guías de reparación paso a paso, o "Detectar anomalía" para verificar sus propios pasos de reparación.',
    },
    ur: {
      title: '🔧 رپیئر اے آئی',
      subtitle: 'آپ کا غیر معمولی اے آئی رپیئر اسسٹنٹ',
      description: 'انتہائی ایڈوانس ڈیوائس رپیئر گائیڈنس سسٹم میں خوش آمدید۔ اے آئی پاورڈ ٹیکنیکل سپورٹ کے مستقبل کا تجربہ کریں۔',
      askCard: {
        title: 'سوال پوچھیں',
        description: 'ہمارے ایڈوانس اے آئی نیورل نیٹ ورکس کے ذریعے کسی بھی ڈیوائس کے لیے مکمل، قدم بہ قدم رپیئر گائیڈ حاصل کریں۔',
      },
      detectCard: {
        title: 'بے قاعدگی کا پتہ لگائیں',
        description: 'اپنے رپیئر کے مراحل اپ لوڈ کریں اور ہمارے کوانٹم پاورڈ اے آئی کو غلطیوں، مفقود مراحل یا بہتری کے لیے ان کا تجزیہ کرنے دیں۔',
      },
      audio: 'رپیئر اے آئی میں خوش آمدید۔ مرحلہ وار مرمت کے رہنما اصول حاصل کرنے کے لیے "سوال پوچھیں" کو منتخب کریں، یا غلطیوں کے لیے اپنے مرمت کے مراحل کی جانچ کرنے کے لیے "بے ضابطگی کا پتہ لگائیں" کو منتخب کریں۔',
    },
    ko: {
      title: '🔧 Repair AI',
      subtitle: '당신의 이국적인 AI 수리 도우미',
      description: '가장 진보된 장치 수리 안내 시스템에 오신 것을 환영합니다. AI 기반 기술 지원의 미래를 경험해보세요.',
      askCard: {
        title: '질문하기',
        description: '우리의 고급 AI 신경망으로 구동되는 모든 장치에 대한 완전하고 단계별 수리 가이드를 받으세요.',
      },
      detectCard: {
        title: '이상 감지',
        description: '수리 단계를 업로드하고 우리의 양자 기반 AI가 오류, 누락된 단계 또는 개선사항을 분석하도록 하세요.',
      },
      audio: 'Repair AI에 오신 것을 환영합니다. 단계별 수리 가이드를 얻으려면 "질문하기"를 선택하거나, 오류가 있는지 자신의 수리 단계를 확인하려면 "이상 감지"를 선택하십시오.',
    },
    zh: {
      title: '🔧 Repair AI',
      subtitle: '您的异国AI维修助手',
      description: '欢迎使用最先进的设备维修指导系统。体验AI驱动技术支持的未来。',
      askCard: {
        title: '提问',
        description: '获得由我们先进的AI神经网络驱动的任何设备的完整、逐步维修指南。',
      },
      detectCard: {
        title: '检测异常',
        description: '上传您的维修步骤，让我们的量子驱动AI分析错误、缺失步骤或改进之处。',
      },
      audio: '欢迎使用 Repair AI。选择"提问"以获取分步维修指南，或选择"检测异常"以检查您自己的维修步骤是否有误。',
    },
    ja: {
      title: '🔧 Repair AI',
      subtitle: 'あなたのエキゾチックAI修理アシスタント',
      description: '最も高度なデバイス修理ガイダンスシステムへようこそ。AI駆動技術サポートの未来を体験してください。',
      askCard: {
        title: '質問する',
        description: '当社の高度なAIニューラルネットワークによって駆動される、あらゆるデバイスの完全なステップバイステップ修理ガイドを取得します。',
      },
      detectCard: {
        title: '異常検出',
        description: '修理手順をアップロードし、当社の量子駆動AIにエラー、欠落した手順、または改善点を分析させましょう。',
      },
      audio: 'Repair AIへようこそ。「質問する」を選択してステップバイステップの修理ガイドを入手するか、「異常を検出」を選択してご自身の修理手順にエラーがないか確認してください。',
    },
  },
  
  // 🧠 Ask Page
  ask: {
    en: {
      title: 'Ask a Question',
      placeholder: 'e.g., How do I repair \'iPad Wi-Fi Battery Replacement\'?',
      button: 'Get Answer',
      loading: 'Getting Answer...',
      instructions: 'Type your repair question in the box, for example, "How to replace iPhone 12 battery". Then, press the "Get Answer" button.',
      audio: 'Type your repair question in the box, for example, "How to replace iPhone 12 battery". Then, press the "Get Answer" button.',
    },
    hi: {
      title: 'प्रश्न पूछें',
      placeholder: 'उदाहरण: \'iPad Wi-Fi बैटरी रिप्लेसमेंट\' की मरम्मत कैसे करूं?',
      button: 'उत्तर प्राप्त करें',
      loading: 'उत्तर प्राप्त कर रहे हैं...',
      instructions: 'बॉक्स में अपना मरम्मत प्रश्न टाइप करें, उदाहरण के लिए, "iPhone 12 की बैटरी कैसे बदलें"। फिर, "उत्तर प्राप्त करें" बटन दबाएं।',
      audio: 'बॉक्स में अपना मरम्मत प्रश्न टाइप करें, उदाहरण के लिए, "आईफोन 12 की बैटरी कैसे बदलें"। फिर, "उत्तर प्राप्त करें" बटन दबाएं।',
    },
    fr: {
      title: 'Poser une Question',
      placeholder: 'ex: Comment réparer le "remplacement de batterie iPad Wi-Fi"?',
      button: 'Obtenir une Réponse',
      loading: 'Obtention de la réponse...',
      instructions: 'Tapez votre question de réparation dans la case, par exemple "Comment remplacer la batterie de l\'iPhone 12". Appuyez ensuite sur le bouton "Obtenir une réponse".',
      audio: 'Tapez votre question de réparation dans la case, par exemple, "Comment remplacer la batterie de l\'iPhone 12". Appuyez ensuite sur le bouton "Obtenir une réponse".',
    },
  },

  // 🔍 Detect Page
  detect: {
    en: {
      title: 'Detect Anomaly',
      placeholder: 'Paste your repair steps here, e.g.:
1. Remove the back cover
2. Disconnect the battery
3. Unscrew the component...',
      button: 'Detect Anomalies',
      loading: 'Analyzing...',
      instructions: 'Paste your repair steps here to check for errors, missing steps, or inconsistencies. Our AI will analyze the text and provide feedback.',
      audio: 'Paste your repair steps here to check for errors, missing steps, or inconsistencies. Our AI will analyze the text and provide feedback.',
    },
    hi: {
      title: 'विसंगति का पता लगाएं',
      placeholder: 'अपने मरम्मत चरण यहां पेस्ट करें, उदाहरण:
1. पिछला कवर हटाएं
2. बैटरी डिस्कनेक्ट करें
3. कंपोनेंट के स्क्रू हटाएं...',
      button: 'विसंगतियों का पता लगाएं',
      loading: 'विश्लेषण कर रहे हैं...',
      instructions: 'त्रुटियों, लापता चरणों या असंगतियों की जांच के लिए अपने मरम्मत चरण यहां पेस्ट करें। हमारा एआई टेक्स्ट का विश्लेषण करेगा और फीडबैक प्रदान करेगा।',
      audio: 'त्रुटियों, लापता चरणों, या असंगतियों की जांच करने के लिए अपने मरमत के चरण यहां पेस्ट करें। हमारा एआई पाठ का विश्लेषण करेगा और प्रतिक्रिया प्रदान करेगा।',
    },
    fr: {
      title: 'Détecter une Anomalie',
      placeholder: 'Collez vos étapes de réparation ici, ex:
1. Retirer le couvercle arrière
2. Déconnecter la batterie
3. Dévisser le composant...',
      button: 'Détecter les Anomalies',
      loading: 'Analyse en cours...',
      instructions: 'Collez vos étapes de réparation ici pour vérifier les erreurs, étapes manquantes ou incohérences. Notre IA analysera le texte et fournira des commentaires.',
      audio: 'Collez vos étapes de réparation ici pour vérifier les erreurs, étapes manquantes ou incohérences. Notre IA analysera le texte et fournira des commentaires.',
    },
  },
    },
  },

  // 🔍 Detect Page
  detect: {
    en: {
      title: 'Detect Anomaly',
      placeholder: 'Paste your repair steps here, e.g.:\n1. Remove the back cover\n2. Disconnect the battery\n3. Unscrew the component...',
      button: 'Detect Anomalies',
      loading: 'Analyzing...',
      instructions: 'Paste your repair steps here to check for errors, missing steps, or inconsistencies. Our AI will analyze the text and provide feedback.',
      audio: 'Paste your repair steps here to check for errors, missing steps, or inconsistencies. Our AI will analyze the text and provide feedback.',
    },
    hi: {
      title: 'विसंगति का पता लगाएं',
      placeholder: 'अपने मरम्मत चरण यहां पेस्ट करें, उदाहरण:\n1. पिछला कवर हटाएं\n2. बैटरी डिस्कनेक्ट करें\n3. कंपोनेंट के स्क्रू हटाएं...',
      button: 'विसंगतियों का पता लगाएं',
      loading: 'विश्लेषण कर रहे हैं...',
      instructions: 'त्रुटियों, लापता चरणों या असंगतियों की जांच के लिए अपने मरम्मत चरण यहां पेस्ट करें। हमारा एआई टेक्स्ट का विश्लेषण करेगा और फीडबैक प्रदान करेगा।',
      audio: 'त्रुटियों, लापता चरणों, या असंगतियों की जांच करने के लिए अपने मरम्मत के चरण यहां पेस्ट करें। हमारा एआई पाठ का विश्लेषण करेगा और प्रतिक्रिया प्रदान करेगा।',
    },
  },
};

export type LanguageCode = keyof typeof LANGUAGES;
export type TranslationKey = keyof typeof TRANSLATIONS;
