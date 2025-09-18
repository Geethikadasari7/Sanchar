import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Shield, MapPin, ChevronRight, Plane, UtensilsCrossed, Palmtree, MessageSquare, Brain, Clock, Star, TrendingUp, Globe, Search, Bot, Send, X, Minimize2, Maximize2, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

interface GuideDashboardProps {
  onBack: () => void;
  isDarkMode: boolean;
}

const GuideDashboard: React.FC<GuideDashboardProps> = ({ onBack, isDarkMode }) => {
  const [activeChat, setActiveChat] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Tourist Guide. I can help you discover the best places to visit, recommend local cuisine, plan your itinerary, and provide safety tips for your trip to Delhi. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    "Best places to visit in Delhi",
    "Traditional food recommendations", 
    "Cultural events this week",
    "Shopping destinations",
    "Historical monuments guide"
  ];

  const botResponses: { [key: string]: string[] } = {
    "best places": [
      "Delhi has amazing attractions! I recommend visiting Red Fort, India Gate, Qutub Minar, Lotus Temple, and Humayun's Tomb. Each offers unique historical and architectural significance. Would you like detailed information about any of these?",
      "For the best Delhi experience, don't miss: Old Delhi's Chandni Chowk for shopping and street food, New Delhi's Connaught Place for modern attractions, and Mehrauli Archaeological Park for history buffs!"
    ],
    "food": [
      "Delhi's food scene is incredible! Must-try dishes include: Butter Chicken at Moti Mahal, Paranthas at Paranthe Wali Gali, Chaat at Chandni Chowk, and Kebabs at Karim's. For sweets, visit Bengali Sweet House for authentic mithai!",
      "For authentic Delhi cuisine, I recommend: Street food at Chandni Chowk, fine dining at Indian Accent, traditional Dal Makhani at Bukhara, and don't forget to try the famous Kulfi at Kuremal Mohan Lal!"
    ],
    "culture": [
      "This week in Delhi: There's a classical music concert at India Habitat Centre, traditional dance performances at Kamani Auditorium, and art exhibitions at National Gallery of Modern Art. Check out the craft bazaar at Dilli Haat too!",
      "Delhi's cultural scene is vibrant! Visit during evening hours for cultural programs at Red Fort, explore the heritage walks in Mehrauli, and don't miss the Sound and Light show at Red Fort on weekends."
    ],
    "shopping": [
      "Great shopping destinations in Delhi: Connaught Place for branded items, Chandni Chowk for traditional wear, Sarojini Nagar for budget fashion, Khan Market for books and cafes, and Dilli Haat for handicrafts and regional cuisine!",
      "For the best shopping experience: Karol Bagh for electronics and clothing, Lajpat Nagar for textiles, Janpath for souvenirs, and Select City Walk mall for luxury brands and dining."
    ],
    "historical": [
      "Delhi's historical monuments are UNESCO World Heritage sites! Red Fort showcases Mughal architecture, Qutub Minar is a 73m tall victory tower, Humayun's Tomb inspired the Taj Mahal's design, and India Gate commemorates Indian soldiers.",
      "Must-visit historical sites: Jama Masjid (India's largest mosque), Raj Ghat (Gandhi's memorial), Purana Qila (Old Fort with lake), and Tughlaqabad Fort ruins. Each tells a unique story of Delhi's rich past!"
    ],
    "safety": [
      "Safety tips for Delhi: Use official pre-paid taxis or ride-sharing apps, keep copies of important documents, avoid isolated areas at night, drink bottled water, and always inform someone about your itinerary. Delhi Metro is very safe and efficient!",
      "For a safe trip: Register with your embassy, use hotel safes for valuables, be cautious with street food initially, learn basic Hindi phrases, and keep emergency numbers handy. Tourist helpline: 1363."
    ],
    "transport": [
      "Delhi has excellent transport options: Metro is fastest and most convenient, buses are economical, auto-rickshaws for short distances (use meter), and ride-sharing apps like Uber/Ola. Avoid rush hours (8-10 AM, 6-8 PM).",
      "Getting around Delhi: Delhi Metro covers most tourist spots, cycle-rickshaws in Old Delhi, hop-on hop-off tourist buses, and rental cars for day trips to Agra or Jaipur. Download Delhi Metro app for easy navigation!"
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomResponse = (category: string): string => {
    const responses = botResponses[category] || ["I'd be happy to help you with that! Could you please provide more specific details about what you're looking for?"];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('food') || message.includes('eat') || message.includes('restaurant') || message.includes('cuisine')) {
      return getRandomResponse('food');
    }
    if (message.includes('place') || message.includes('visit') || message.includes('attraction') || message.includes('sightseeing')) {
      return getRandomResponse('best places');
    }
    if (message.includes('culture') || message.includes('event') || message.includes('music') || message.includes('dance')) {
      return getRandomResponse('culture');
    }
    if (message.includes('shop') || message.includes('buy') || message.includes('market') || message.includes('mall')) {
      return getRandomResponse('shopping');
    }
    if (message.includes('historical') || message.includes('monument') || message.includes('fort') || message.includes('history')) {
      return getRandomResponse('historical');
    }
    if (message.includes('safe') || message.includes('security') || message.includes('danger') || message.includes('tip')) {
      return getRandomResponse('safety');
    }
    if (message.includes('transport') || message.includes('metro') || message.includes('bus') || message.includes('taxi') || message.includes('travel')) {
      return getRandomResponse('transport');
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to Delhi! I'm excited to help you explore this amazing city. What would you like to know about Delhi today?";
    }
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm here to make your Delhi experience unforgettable. Feel free to ask me anything else about your trip!";
    }
    
    return "That's an interesting question! I can help you with information about Delhi's attractions, food, culture, shopping, transportation, and safety tips. What specific aspect of Delhi would you like to explore?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500); // Random delay between 1.5-3 seconds
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    if (showChatbot) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setShowChatbot(true);
      setTimeout(() => {
        handleSendMessage();
      }, 500);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const historyItems = [
    {
      id: 1,
      type: 'food',
      icon: <UtensilsCrossed className="w-5 h-5" />,
      title: 'Food Recommendations',
      subtitle: 'Best places to eat traditional Delhi cuisine...',
      time: '22:29',
      category: 'Dining',
      onClick: () => handleQuickPrompt('Traditional food recommendations')
    },
    {
      id: 2,
      type: 'travel',
      icon: <Plane className="w-5 h-5" />,
      title: 'Travel Planning',
      subtitle: 'Optimal route from Red Fort to India Gate...',
      time: '21:09',
      category: 'Transport',
      onClick: () => handleQuickPrompt('Best transportation options in Delhi')
    },
    {
      id: 3,
      type: 'resort',
      icon: <Palmtree className="w-5 h-5" />,
      title: 'Accommodation',
      subtitle: 'Luxury hotels near Connaught Place...',
      time: '18:19',
      category: 'Hotels',
      onClick: () => handleQuickPrompt('Best areas to stay in Delhi')
    },
    {
      id: 4,
      type: 'culture',
      icon: <Star className="w-5 h-5" />,
      title: 'Cultural Events',
      subtitle: 'Traditional performances this weekend...',
      time: '16:45',
      category: 'Culture',
      onClick: () => handleQuickPrompt('Cultural events this week')
    },
    {
      id: 5,
      type: 'shopping',
      icon: <MapPin className="w-5 h-5" />,
      title: 'Shopping Guide',
      subtitle: 'Local markets and handicraft stores...',
      time: '14:30',
      category: 'Shopping',
      onClick: () => handleQuickPrompt('Shopping destinations')
    }
  ];

  const features = [
    {
      title: 'Smart Trip Planning',
      description: 'AI-powered itineraries tailored to your preferences',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-purple-500 to-indigo-600',
      stats: '2.4k trips planned',
      image: 'https://i.pinimg.com/736x/12/2b/21/122b210c6063d97874ff49bb88ae97f1.jpg',
      onClick: () => handleQuickPrompt('Help me plan a 3-day itinerary for Delhi')
    },
    {
      title: 'Local Recommendations',
      description: 'Discover hidden gems and authentic experiences',
      icon: <MapPin className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-600',
      stats: '15k recommendations',
      image: 'https://i.pinimg.com/1200x/a5/49/43/a549434d9e4e15a86a2c066c72006a59.jpg',
      onClick: () => handleQuickPrompt('Show me hidden gems in Delhi')
    },
    {
      title: 'Safety Assistance',
      description: 'Real-time safety tips and emergency support',
      icon: <Shield className="w-8 h-8" />,
      color: 'from-red-500 to-orange-600',
      stats: '98% safety rating',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
      onClick: () => handleQuickPrompt('Safety tips for tourists in Delhi')
    },
    {
      title: 'Cultural Insights',
      description: 'Learn about local customs and traditions',
      icon: <Globe className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      stats: '500+ cultural guides',
      image: 'https://i.pinimg.com/1200x/c2/b9/41/c2b941697c9882bc51117565218ec1ff.jpg',
      onClick: () => handleQuickPrompt('Tell me about Delhi culture and traditions')
    }
  ];

  const stats = [
    { label: 'Active Conversations', value: '1,247', trend: '+12%', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Queries Resolved', value: '94.8%', trend: '+5.2%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Response Time', value: '2.3s', trend: '-15%', icon: <Clock className="w-5 h-5" /> },
    { label: 'User Satisfaction', value: '4.9/5', trend: '+0.3', icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className={`p-3 rounded-full transition-all hover:scale-105 ${
              isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {/* Floating decorative elements */}
          <div className="absolute top-16 right-8 text-purple-200 opacity-20">
            <Bot className="w-12 h-12" />
          </div>
          <div className="absolute top-32 left-12 text-indigo-200 opacity-20">
            <Brain className="w-8 h-8" />
          </div>
        </div>

        {/* AI Tourist Guide Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-purple-900/30' : 'bg-gradient-to-br from-purple-100 to-indigo-100'} mr-4`}>
              <Bot className={`w-12 h-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className="text-left">
              <h1 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                AI Tourist Guide
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your intelligent travel companion
              </p>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-xl transition-all hover:scale-105 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <div className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {stat.icon}
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  stat.trend.startsWith('+') ? 'text-green-500' : stat.trend.startsWith('-') ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Interface */}
        <div className={`rounded-2xl p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Start a Conversation
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>AI Online</span>
              </div>
              <button
                onClick={() => setShowChatbot(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Chat</span>
              </button>
            </div>
          </div>
          
          <div className={`relative mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4`}>
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Ask me anything about your trip to Delhi..."
              value={activeChat}
              onChange={(e) => setActiveChat(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && activeChat.trim()) {
                  handleQuickPrompt(activeChat);
                  setActiveChat('');
                }
              }}
              className={`w-full pl-12 pr-4 py-3 bg-transparent border-none outline-none text-lg ${
                isDarkMode ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
            />
            {activeChat && (
              <button 
                onClick={() => {
                  handleQuickPrompt(activeChat);
                  setActiveChat('');
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="mb-4">
            <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Quick suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt)}
                  className={`px-4 py-2 rounded-full text-sm transition-all hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={feature.onClick}
              className={`rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl cursor-pointer relative overflow-hidden ${
                isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
              }`}
            >
              {/* Background Image */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-20 rounded-bl-3xl overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 rounded-2xl`}></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white`}>
                    {feature.icon}
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {feature.stats}
                  </span>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                  {feature.description}
                </p>

                <div className="flex items-center justify-between">
                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                    isDarkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}>
                    <span>Explore</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* History Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Conversations
            </h2>
            <button className={`text-sm px-4 py-2 rounded-lg transition-colors ${
              isDarkMode ? 'text-purple-400 hover:bg-gray-800' : 'text-purple-600 hover:bg-purple-50'
            }`}>
              View all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyItems.map((item) => (
              <div
                key={item.id}
                onClick={item.onClick}
                className={`rounded-xl p-4 transition-all hover:scale-105 hover:shadow-lg cursor-pointer ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow-md hover:shadow-xl'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <div className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        {item.icon}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.time}
                  </span>
                </div>
                
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                  {item.subtitle}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  </div>
                  <button className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                    isDarkMode ? 'text-purple-400 hover:bg-gray-700' : 'text-purple-600 hover:bg-purple-50'
                  }`}>
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chatbot Interface */}
      {showChatbot && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
          chatMinimized ? 'w-16 h-16' : 'w-96 h-[600px]'
        }`}>
          <div className={`rounded-2xl shadow-2xl overflow-hidden h-full ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gradient-to-r from-purple-600 to-indigo-600'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-purple-600' : 'bg-white/20'
                }`}>
                  <Bot className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-white'}`} />
                </div>
                {!chatMinimized && (
                  <div>
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-white'}`}>
                      AI Tourist Guide
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-white/80'}`}>
                      Online • Ready to help
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {!chatMinimized && (
                  <button
                    onClick={() => setChatMinimized(true)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/20'
                    }`}
                  >
                    <Minimize2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-white'}`} />
                  </button>
                )}
                {chatMinimized && (
                  <button
                    onClick={() => setChatMinimized(false)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/20'
                    }`}
                  >
                    <Maximize2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-white'}`} />
                  </button>
                )}
                <button
                  onClick={() => setShowChatbot(false)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/20'
                  }`}
                >
                  <X className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-white'}`} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            {!chatMinimized && (
              <>
                <div className={`flex-1 p-4 overflow-y-auto space-y-4 h-96 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'bot'
                          ? isDarkMode ? 'bg-purple-600' : 'bg-purple-100'
                          : isDarkMode ? 'bg-gray-600' : 'bg-blue-100'
                      }`}>
                        {message.sender === 'bot' ? (
                          <Bot className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-purple-600'}`} />
                        ) : (
                          <User className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-blue-600'}`} />
                        )}
                      </div>
                      <div className={`flex-1 max-w-xs ${
                        message.sender === 'user' ? 'text-right' : ''
                      }`}>
                        <div className={`inline-block p-3 rounded-2xl text-sm ${
                          message.sender === 'bot'
                            ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                            : isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'
                        } ${
                          message.sender === 'user' ? 'rounded-br-md' : 'rounded-bl-md'
                        }`}>
                          {message.text}
                        </div>
                        <div className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } ${message.sender === 'user' ? 'text-right' : ''}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-purple-600' : 'bg-purple-100'
                      }`}>
                        <Bot className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-purple-600'}`} />
                      </div>
                      <div className={`inline-block p-3 rounded-2xl rounded-bl-md ${
                        isDarkMode ? 'bg-gray-700' : 'bg-white'
                      }`}>
                        <div className="flex space-x-1">
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDarkMode ? 'bg-gray-400' : 'bg-gray-400'
                          }`} style={{ animationDelay: '0ms' }}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDarkMode ? 'bg-gray-400' : 'bg-gray-400'
                          }`} style={{ animationDelay: '150ms' }}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDarkMode ? 'bg-gray-400' : 'bg-gray-400'
                          }`} style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className={`p-4 border-t ${
                  isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        className={`w-full p-3 pr-12 rounded-xl border-none outline-none text-sm ${
                          isDarkMode 
                            ? 'bg-gray-700 text-white placeholder-gray-400' 
                            : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all ${
                          inputMessage.trim()
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleQuickPrompt('Best places to visit in Delhi')}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Places
                    </button>
                    <button
                      onClick={() => handleQuickPrompt('Traditional food recommendations')}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Food
                    </button>
                    <button
                      onClick={() => handleQuickPrompt('Safety tips for tourists in Delhi')}
                      className={`px-3 py-1 rounded-full text-xs transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Safety
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Chat Button (when chatbot is closed) */}
      {!showChatbot && (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default GuideDashboard;