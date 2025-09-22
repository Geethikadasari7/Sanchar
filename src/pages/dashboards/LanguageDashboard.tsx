import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Languages, Volume2, ArrowLeft, Mic, 
  Copy, Star, Book, Globe, Moon, Sun
} from 'lucide-react';
import toast from 'react-hot-toast';

const LanguageDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [translateText, setTranslateText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [activeTab, setActiveTab] = useState('greetings');
  const [isListening, setIsListening] = useState(false);

  const languages = [
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
    { code: 'bengali', name: 'Bengali', flag: '🇮🇳', native: 'বাংলা' },
    { code: 'telugu', name: 'Telugu', flag: '🇮🇳', native: 'తెలుగు' },
    { code: 'marathi', name: 'Marathi', flag: '🇮🇳', native: 'मराठी' },
    { code: 'tamil', name: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
    { code: 'gujarati', name: 'Gujarati', flag: '🇮🇳', native: 'ગુજરાતી' },
    { code: 'urdu', name: 'Urdu', flag: '🇮🇳', native: 'اردو' },
    { code: 'kannada', name: 'Kannada', flag: '🇮🇳', native: 'ಕನ್ನಡ' },
    { code: 'malayalam', name: 'Malayalam', flag: '🇮🇳', native: 'മലയാളം' },
    { code: 'punjabi', name: 'Punjabi', flag: '🇮🇳', native: 'ਪੰਜਾਬੀ' },
    { code: 'assamese', name: 'Assamese', flag: '🇮🇳', native: 'অসমীয়া' },
    { code: 'odia', name: 'Odia', flag: '🇮🇳', native: 'ଓଡ଼ିଆ' }
  ];

  const emergencyPhrases = [
    { english: 'Help!', translation: 'मदद!' },
    { english: 'Call police', translation: 'पुलिस को बुलाओ' },
    { english: 'I need a doctor', translation: 'मुझे डॉक्टर चाहिए' },
    { english: 'Emergency', translation: 'आपातकाल' },
    { english: 'I am lost', translation: 'मैं खो गया हूँ' },
    { english: 'Call ambulance', translation: 'एम्बुलेंस बुलाओ' }
  ];

  const commonPhrases = {
    greetings: [
      { english: 'Hello', translation: 'नमस्ते' },
      { english: 'Good morning', translation: 'सुप्रभात' },
      { english: 'Good evening', translation: 'शुभ संध्या' },
      { english: 'How are you?', translation: 'आप कैसे हैं?' },
      { english: 'Nice to meet you', translation: 'आपसे मिलकर खुशी हुई' },
      { english: 'Thank you', translation: 'धन्यवाद' },
      { english: 'You\'re welcome', translation: 'कोई बात नहीं' },
      { english: 'Excuse me', translation: 'माफ़ करिए' }
    ],
    directions: [
      { english: 'Where is...?', translation: '... कहाँ है?' },
      { english: 'How do I get to...?', translation: '... कैसे जाऊं?' },
      { english: 'Left', translation: 'बाएं' },
      { english: 'Right', translation: 'दाएं' },
      { english: 'Straight', translation: 'सीधे' },
      { english: 'Near', translation: 'पास' },
      { english: 'Far', translation: 'दूर' },
      { english: 'Stop here', translation: 'यहाँ रोकिए' }
    ]
  };

  const handleTranslate = () => {
    if (!translateText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }
    
    // Simulate translation
    setTranslatedText('अनुवादित पाठ यहाँ दिखाया जाएगा');
    toast.success('Text translated successfully!');
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.success('Voice input started');
      // Simulate voice recognition
      setTimeout(() => {
        setTranslateText('Hello, how are you?');
        setIsListening(false);
        toast.success('Voice input complete');
      }, 2000);
    }
  };

  const playAudio = (text: string) => {
    toast.success(`Playing audio: ${text}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard/tourist"
              className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white'
              }`}
            >
              <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </Link>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Language Assistance</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Multilingual support for your India journey</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Night Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-all ${
                isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Languages className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Language Selection */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl p-6 shadow-sm mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Language</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors border-2 ${
                      selectedLanguage === lang.code
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : isDarkMode 
                          ? 'hover:bg-gray-700 border-transparent text-gray-300' 
                          : 'hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <p className="font-medium">{lang.name}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lang.native}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className={`rounded-xl p-6 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Regional Languages</span>
                  <span className="font-semibold text-orange-600">22</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Common Phrases</span>
                  <span className="font-semibold text-orange-600">50+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Voice Support</span>
                  <span className="font-semibold text-green-600">Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Offline Mode</span>
                  <span className="font-semibold text-blue-600">Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Translator */}
            <div className={`rounded-xl p-6 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Text & Voice Translator</h3>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-orange-600" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>English → {selectedLanguage}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    English Text
                  </label>
                  <div className="relative">
                    <textarea
                      value={translateText}
                      onChange={(e) => setTranslateText(e.target.value)}
                      className={`w-full h-32 px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Type your message here..."
                    />
                    <button
                      onClick={handleVoiceInput}
                      className={`absolute bottom-3 right-3 p-2 rounded-lg transition-colors ${
                        isListening 
                          ? 'bg-red-100 text-red-600 animate-pulse' 
                          : isDarkMode 
                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleTranslate}
                    className="mt-3 w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Translate
                  </button>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Translation
                  </label>
                  <div className="relative">
                    <div className={`w-full h-32 px-3 py-2 border rounded-lg ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}>
                      <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {translatedText || 'Translation will appear here...'}
                      </p>
                    </div>
                    {translatedText && (
                      <div className="absolute bottom-3 right-3 flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(translatedText)}
                          className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                            isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <Copy className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                        </button>
                        <button
                          onClick={() => playAudio(translatedText)}
                          className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                            isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <Volume2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Phrases */}
            <div className={`border rounded-xl p-6 ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>Emergency Phrases</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emergencyPhrases.map((phrase, index) => (
                  <div key={index} className={`rounded-lg p-4 border ${isDarkMode ? 'bg-gray-800 border-red-700' : 'bg-white border-red-200'}`}>
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{phrase.english}</div>
                    <div className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{phrase.translation}</div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => playAudio(phrase.translation)}
                        className={`p-1 rounded transition-colors ${isDarkMode ? 'bg-red-800 hover:bg-red-700' : 'bg-red-100 hover:bg-red-200'}`}
                      >
                        <Volume2 className={`w-3 h-3 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(phrase.translation)}
                        className={`p-1 rounded transition-colors ${isDarkMode ? 'bg-red-800 hover:bg-red-700' : 'bg-red-100 hover:bg-red-200'}`}
                      >
                        <Copy className={`w-3 h-3 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Phrases */}
            <div className={`rounded-xl p-6 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Common Phrases</h3>
                <Book className="w-6 h-6 text-orange-600" />
              </div>

              {/* Tabs */}
              <div className={`flex space-x-1 p-1 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setActiveTab('greetings')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'greetings'
                      ? isDarkMode ? 'bg-gray-600 text-orange-400 shadow-sm' : 'bg-white text-orange-600 shadow-sm'
                      : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Greetings
                </button>
                <button
                  onClick={() => setActiveTab('directions')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'directions'
                      ? isDarkMode ? 'bg-gray-600 text-orange-400 shadow-sm' : 'bg-white text-orange-600 shadow-sm'
                      : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Directions
                </button>
              </div>

              {/* Phrase Lists */}
              <div className="grid md:grid-cols-2 gap-4">
                {commonPhrases[activeTab as keyof typeof commonPhrases].map((phrase, index) => (
                  <div key={index} className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{phrase.english}</div>
                    <div className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{phrase.translation}</div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => playAudio(phrase.translation)}
                        className={`p-1 rounded transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'}`}
                      >
                        <Volume2 className={`w-3 h-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(phrase.translation)}
                        className={`p-1 rounded transition-colors ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'}`}
                      >
                        <Copy className={`w-3 h-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageDashboard;