import { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Shield, Sun,
  Languages, Compass, Search, Share2, 
  MessageCircle, Bell, Moon, Users,
  AlertTriangle, CheckCircle, Clock,
  Thermometer, Eye, Wind, Copy, X,
  Building, UserRoundSearch, FileText
} from 'lucide-react';

interface TouristDashboardProps {
  navigate: (screen: 'main' | 'bookings' | 'guide' | 'helplines' | 'language' | 'lost-found' | 'places' | 'safe-route' | 'family-tracking' | 'e-fir') => void;
}

const TouristDashboard: React.FC<TouristDashboardProps> = ({ navigate }) => {
  
  // Mock user data since we don't have the auth context
  const user = {
    name: 'Geethika Dasari',
    digitalId: 'DEL13092025-0045'
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newsIndex, setNewsIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosCountdown, setSOSCountdown] = useState(0);
  const [sosActive, setSOSActive] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const [safetyScore, setSafetyScore] = useState(93);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [currentLocation] = useState({
    name: 'Red Fort, Delhi',
    address: 'Lal Qila, Netaji Subhash Marg, Delhi, 110006',
    coordinates: { lat: 28.6562, lng: 77.2410 }
  });
  
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'safety',
      title: 'Safety Alert',
      message: 'High crowd density detected at India Gate. Consider visiting later.',
      time: '2 minutes ago',
      read: false,
      icon: '🚨',
      priority: 'high'
    },
    {
      id: 2,
      type: 'weather',
      title: 'Weather Update',
      message: 'Temperature rising to 35°C. Stay hydrated and seek shade.',
      time: '15 minutes ago',
      read: false,
      icon: '🌡️',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'travel',
      title: 'Travel Reminder',
      message: 'Your lunch reservation at Chandni Chowk is in 1 hour.',
      time: '30 minutes ago',
      read: true,
      icon: '🍽️',
      priority: 'low'
    },
    {
      id: 4,
      type: 'emergency',
      title: 'Emergency Services',
      message: 'Officer Sushanth Singh has been assigned as your safety contact.',
      time: '1 hour ago',
      read: true,
      icon: '👮',
      priority: 'medium'
    },
    {
      id: 5,
      type: 'info',
      title: 'Cultural Event',
      message: 'Traditional dance performance at Red Fort starting at 4 PM.',
      time: '2 hours ago',
      read: true,
      icon: '🎭',
      priority: 'low'
    },
    {
      id: 6,
      type: 'transport',
      title: 'Transport Alert',
      message: 'Metro delays on Blue Line. Alternative routes suggested.',
      time: '3 hours ago',
      read: true,
      icon: '🚇',
      priority: 'medium'
    }
  ]);
  const [weatherData] = useState({
    current: { temp: 28, condition: 'Sunny', icon: '☀️' },
    hourly: [
      { time: '12:00', temp: 28, condition: 'Sunny', icon: '☀️' },
      { time: '13:00', temp: 30, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '14:00', temp: 32, condition: 'Sunny', icon: '☀️' },
      { time: '15:00', temp: 31, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '16:00', temp: 29, condition: 'Cloudy', icon: '☁️' },
      { time: '17:00', temp: 27, condition: 'Partly Cloudy', icon: '⛅' }
    ],
    weekly: [
      { day: 'Today', high: 32, low: 22, condition: 'Sunny', icon: '☀️' },
      { day: 'Tomorrow', high: 30, low: 20, condition: 'Rainy', icon: '🌧️' },
      { day: 'Thu', high: 25, low: 18, condition: 'Cloudy', icon: '☁️' },
      { day: 'Fri', high: 28, low: 19, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Sat', high: 31, low: 21, condition: 'Sunny', icon: '☀️' },
      { day: 'Sun', high: 29, low: 20, condition: 'Rainy', icon: '🌧️' },
      { day: 'Mon', high: 27, low: 18, condition: 'Cloudy', icon: '☁️' }
    ],
    details: {
      uvIndex: 8,
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      pressure: 1013,
      feelsLike: 32,
      dewPoint: 18,
      sunrise: '06:15',
      sunset: '18:45'
    }
  });

  const newsItems = [
    "Hello Jay Ram, Welcome to Delhi - Stay alert in crowded areas",
    "Weather Alert: Heavy rain expected in Delhi tomorrow",
    "Festival Alert: Diwali celebrations at India Gate - Expect crowds",
    "Safety Update: All tourist areas are currently secure",
    "New Feature: Voice translation now available in Hindi"
  ];

  const emergencyContacts = [
    { service: 'Emergency Services', number: '112' },
    { service: 'Police', number: '100' },
    { service: 'Tourist Helpline', number: '1363' },
    { service: 'Women Helpline', number: '1091' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const newsTimer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(newsTimer);
  }, [newsItems.length]);

  // SOS Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sosCountdown > 0) {
      interval = setInterval(() => {
        setSOSCountdown((prev) => prev - 1);
      }, 1000);
    } else if (sosCountdown === 0 && sosActive) {
      // Trigger SOS
      triggerSOS();
    }
    return () => clearInterval(interval);
  }, [sosCountdown, sosActive]);

  const handleSOSClick = () => {
    setShowSOSModal(true);
  };

  const startSOSCountdown = () => {
    setSOSCountdown(5);
    setSOSActive(true);
    setShowSOSModal(false);
  };

  const cancelSOS = () => {
    setSOSCountdown(0);
    setSOSActive(false);
    setShowSOSModal(false);
  };

  const triggerSOS = () => {
    setSOSActive(false);
    
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendSOSAlert(latitude, longitude);
        },
        () => {
          // Fallback to preset location
          sendSOSAlert(currentLocation.coordinates.lat, currentLocation.coordinates.lng);
        }
      );
    } else {
      sendSOSAlert(currentLocation.coordinates.lat, currentLocation.coordinates.lng);
    }
  };

  const sendSOSAlert = (lat: number, lng: number) => {
    // Create emergency message
    const emergencyMessage = `🚨 EMERGENCY SOS ALERT 🚨\n\nTourist in distress!\n\nName: ${user.name}\nDigital ID: ${user.digitalId}\nLocation: ${currentLocation.name}\nCoordinates: ${lat}, ${lng}\nTime: ${new Date().toLocaleString()}\n\nImmediate assistance required!`;
    
    // Multiple SOS actions
    const actions = [
      // Call emergency services
      () => window.open('tel:112'),
      
      // Send SMS to emergency services
      () => {
        const smsMessage = encodeURIComponent(emergencyMessage);
        window.open(`sms:112?body=${smsMessage}`);
      },
      
      // Share location via WhatsApp
      () => {
        const whatsappMessage = encodeURIComponent(emergencyMessage + `\n\nGoogle Maps: https://maps.google.com/?q=${lat},${lng}`);
        window.open(`https://wa.me/?text=${whatsappMessage}`);
      },
      
      // Copy emergency info to clipboard
      () => {
        navigator.clipboard.writeText(emergencyMessage + `\n\nGoogle Maps: https://maps.google.com/?q=${lat},${lng}`);
      }
    ];

    // Execute all actions
    actions.forEach((action, index) => {
      setTimeout(() => action(), index * 500);
    });

    // Add emergency notification
    const emergencyNotification = {
      id: Date.now(),
      type: 'emergency',
      title: '🚨 SOS ACTIVATED',
      message: 'Emergency services have been contacted. Help is on the way.',
      time: 'Just now',
      read: false,
      icon: '🚨',
      priority: 'high' as const
    };

    setNotifications(prev => [emergencyNotification, ...prev]);
    
    // Show success message
    setShareStatus('🚨 SOS Alert Sent! Emergency services contacted.');
    setTimeout(() => setShareStatus(''), 10000);
  };

  const handleSafetyScoreClick = () => {
    setIsRecalculating(true);
    
    setTimeout(() => {
      const newScore = Math.floor(Math.random() * (98 - 85) + 85);
      setSafetyScore(newScore);
      setIsRecalculating(false);
    }, 2000);
  };

  const handleShareLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
            const shareText = `I'm currently at ${currentLocation.name}. Here's my location: ${locationUrl}`;
            
            if (navigator.share) {
              navigator.share({
                title: 'My Current Location',
                text: shareText,
                url: locationUrl
              });
            } else {
              // Fallback: copy to clipboard
              navigator.clipboard.writeText(shareText).then(() => {
                setShareStatus('Location copied to clipboard!');
                setTimeout(() => setShareStatus(''), 3000);
              });
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            // Fallback to preset location
            const fallbackUrl = `https://maps.google.com/?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lng}`;
            const shareText = `I'm at ${currentLocation.name}. Location: ${fallbackUrl}`;
            
            if (navigator.clipboard) {
              navigator.clipboard.writeText(shareText).then(() => {
                setShareStatus('Location copied to clipboard!');
                setTimeout(() => setShareStatus(''), 3000);
              });
            }
          }
        );
      }
      setShowShareModal(true);
    } catch (error) {
      console.error('Share error:', error);
      setShareStatus('Unable to share location');
      setTimeout(() => setShareStatus(''), 3000);
    }
  };

  const handleCopyLocationLink = () => {
    const locationUrl = `https://maps.google.com/?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lng}`;
    navigator.clipboard.writeText(locationUrl).then(() => {
      setShareStatus('Location link copied!');
      setTimeout(() => setShareStatus(''), 3000);
    });
  };

  const handleSendLocationWhatsApp = () => {
    const locationUrl = `https://maps.google.com/?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lng}`;
    const message = encodeURIComponent(`I'm currently at ${currentLocation.name}. Here's my location: ${locationUrl}`);
    window.open(`https://wa.me/?text=${message}`);
  };

  const handleSendLocationSMS = () => {
    const locationUrl = `https://maps.google.com/?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lng}`;
    const message = encodeURIComponent(`I'm at ${currentLocation.name}. My location: ${locationUrl}`);
    window.open(`sms:?body=${message}`);
  };

  const handleWeatherClick = () => {
    setShowWeatherModal(true);
  };

  const handleNotificationsClick = () => {
    setShowNotificationsModal(true);
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const quickAccessItems = [
    { 
      title: 'Language Assistance',
      icon: <Languages className="w-6 h-6" />,
      onClick: () => navigate('language'),
      color: 'bg-blue-500'
    },
    { 
      title: 'Helplines',
      icon: <Phone className="w-6 h-6" />,
      onClick: () => navigate('helplines'),
      color: 'bg-green-500'
    },
    { 
      title: 'Safe Route',
      icon: <Compass className="w-6 h-6" />,
      onClick: () => navigate('safe-route'),
      color: 'bg-purple-500'
    },
    { 
      title: 'Family Tracking',
      icon: <Users className="w-6 h-6" />,
      onClick: () => navigate('family-tracking'),
      color: 'bg-orange-500'
    },
    { 
      title: 'Lost & Found',
      icon: <Search className="w-6 h-6" />,
      onClick: () => navigate('lost-found'),
      color: 'bg-red-500'
    },
    { 
      title: 'Place Recommendations',
      icon: <MapPin className="w-6 h-6" />,
      onClick: () => navigate('places'),
      color: 'bg-indigo-500'
    },
    { 
      title: 'Bookings',
      icon: <Building className="w-6 h-6" />,
      onClick: () => navigate('bookings'),
      color: 'bg-yellow-500'
    },
    { 
      title: 'E-FIR',
      icon: <FileText className="w-6 h-6" />,
      onClick: () => navigate('e-fir'),
      color: 'bg-teal-500'
    }
  ];

  const todayItinerary = [
    { time: '09:00', activity: 'Visit Red Fort', status: 'upcoming' },
    { time: '12:00', activity: 'Lunch at Chandni Chowk', status: 'current' },
    { time: '15:00', activity: 'India Gate sightseeing', status: 'upcoming' },
    { time: '18:00', activity: 'Sunset at Raj Ghat', status: 'upcoming' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome, {user?.name}
            </h1>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={handleNotificationsClick}
              className={`p-2 rounded-lg transition-colors relative ${
              isDarkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}>
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SOS Countdown Display */}
        {sosActive && sosCountdown > 0 && (
          <div className="fixed inset-0 bg-red-600 bg-opacity-95 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-white text-8xl font-bold mb-4 animate-pulse">
                {sosCountdown}
              </div>
              <h2 className="text-white text-3xl font-bold mb-4">🚨 EMERGENCY SOS ACTIVATING 🚨</h2>
              <p className="text-white text-xl mb-8">Calling emergency services in {sosCountdown} seconds</p>
              <button
                onClick={cancelSOS}
                className="bg-white text-red-600 py-4 px-8 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Status Message */}
        {shareStatus && (
          <div className={`rounded-xl p-4 mb-4 ${
            shareStatus.includes('🚨') 
              ? (isDarkMode ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200')
              : (isDarkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200')
          }`}>
            <div className="flex items-center">
              <CheckCircle className={`w-5 h-5 mr-2 ${shareStatus.includes('🚨') ? 'text-red-500' : 'text-green-500'}`} />
              <span className={`text-sm font-medium ${
                shareStatus.includes('🚨') 
                  ? (isDarkMode ? 'text-red-400' : 'text-red-700')
                  : (isDarkMode ? 'text-green-400' : 'text-green-700')
              }`}>
                {shareStatus}
              </span>
            </div>
          </div>
        )}

        {/* Rotating News Banner */}
        <div className={`rounded-xl p-4 mb-8 overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border`}>
          <div className="flex items-center">
            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></div>
            <div className="flex-1 overflow-hidden">
              <p className={`text-sm transition-all duration-500 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {newsItems[newsIndex]}
              </p>
            </div>
          </div>
        </div>

       {/* Safety Section - 4 Square Cards Layout */}
<div className="grid md:grid-cols-4 gap-6 mb-8">
  {/* Safety Score Card */}
  <div
    className={`rounded-xl p-5 cursor-pointer transition-all hover:scale-105 hover:shadow-2xl flex flex-col justify-between ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    } shadow-lg ${isRecalculating ? "animate-pulse" : ""}`}
    onClick={handleSafetyScoreClick}
    style={{ minHeight: "220px" }}
  >
    <div className="flex items-center justify-between mb-3">
      <h3
        className={`text-base font-semibold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Safety Score
      </h3>
      <Shield className="w-5 h-5 text-green-500" />
    </div>
    <div className="relative w-20 h-20 mx-auto mb-3">
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="32"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className={isDarkMode ? "text-gray-700" : "text-gray-200"}
        />
        <circle
          cx="40"
          cy="40"
          r="32"
          stroke="#10B981"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={`${safetyScore * 2.01} 201`}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {isRecalculating ? "..." : `${safetyScore}%`}
        </span>
      </div>
    </div>
    <div className="text-center">
      <div className="flex items-center justify-center mb-1">
        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
        <span
          className={`text-sm font-medium ${
            isDarkMode ? "text-green-400" : "text-green-600"
          }`}
        >
          {isRecalculating ? "Recalculating..." : "Safe"}
        </span>
      </div>
      <p
        className={`text-xs ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {currentTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  </div>

  {/* Emergency SOS Card */}
<div
  className={`rounded-xl p-5 backdrop-blur-md transition-all hover:scale-105 hover:shadow-2xl flex flex-col justify-between cursor-pointer ${
    isDarkMode
      ? "bg-gradient-to-br from-red-900/40 to-red-800/40 border border-red-500/20"
      : "bg-gradient-to-br from-red-50 to-red-100 border border-red-200/40"
  } shadow-lg`}
  style={{ minHeight: "220px" }}
>
  <div className="flex items-center justify-between mb-3">
    <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      Emergency SOS
    </h3>
    <div className="p-2 bg-red-500 rounded-full">
      <AlertTriangle className="w-4 h-4 text-white" />
    </div>
  </div>
  
  {/* Extra emergency info */}
  <div className="space-y-2 mb-4 text-sm">
    <div className="flex items-center justify-between">
      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Nearest Police</span>
      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>1.2 km</span>
    </div>
    <div className="flex items-center justify-between">
      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Ambulance</span>
      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>108</span>
    </div>
  </div>

  {/* Bigger button */}
  <button 
    onClick={handleSOSClick}
    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-bold shadow-md text-base"
  >
    <Phone className="w-5 h-5" />
    <span>SOS Call</span>
  </button>
</div>

{/* Tourist Guide Card */}
<div
  className={`rounded-xl p-5 backdrop-blur-md transition-all hover:scale-105 hover:shadow-2xl flex flex-col justify-between cursor-pointer ${
    isDarkMode
      ? "bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/20"
      : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/40"
  } shadow-lg`}
  style={{ minHeight: "220px" }}
>
  <div className="flex items-center justify-between mb-3">
    <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      Tourist Guide
    </h3>
    <div className="p-2 bg-blue-500 rounded-full">
      <UserRoundSearch className="w-4 h-4 text-white" />
    </div>
  </div>
  
  {/* Extra guide info */}
  <div className="space-y-2 mb-4 text-sm">
    <div className="flex items-center justify-between">
      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Top Attraction</span>
      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Charminar</span>
    </div>
    <div className="flex items-center justify-between">
      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Nearby Food</span>
      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>Paradise Biryani</span>
    </div>
  </div>

  {/* Bigger button */}
  <button
    onClick={() => navigate("guide")}
    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-semibold shadow-md text-base"
  >
    <UserRoundSearch className="w-5 h-5" />
    <span>Ask Guide</span>
  </button>
</div>


  {/* Weather Card */}
  <div
    className={`rounded-xl p-5 cursor-pointer transition-all hover:scale-105 hover:shadow-2xl flex flex-col justify-between ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    } shadow-lg`}
    onClick={handleWeatherClick}
    style={{ minHeight: "220px" }}
  >
    <div className="flex items-center justify-between mb-3">
      <h3
        className={`text-base font-semibold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Weather
      </h3>
      <Sun className="w-5 h-5 text-yellow-500" />
    </div>
    <div className="text-center mb-4">
      <div
        className={`text-3xl font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        28°C
      </div>
      <div
        className={`text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Sunny
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Thermometer className="w-4 h-4 mr-2 text-red-500" />
          <span
            className={isDarkMode ? "text-gray-300" : "text-gray-700"}
          >
            UV Index
          </span>
        </div>
        <span
          className={`font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          High (8)
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Wind className="w-4 h-4 mr-2 text-blue-500" />
          <span
            className={isDarkMode ? "text-gray-300" : "text-gray-700"}
          >
            Wind
          </span>
        </div>
        <span
          className={`font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          12 km/h
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Eye className="w-4 h-4 mr-2 text-gray-500" />
          <span
            className={isDarkMode ? "text-gray-300" : "text-gray-700"}
          >
            Visibility
          </span>
        </div>
        <span
          className={`font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          10 km
        </span>
      </div>
    </div>
    <div className="mt-4 text-center">
      <span
        className={`text-xs ${
          isDarkMode ? "text-blue-400" : "text-blue-600"
        } font-medium`}
      >
        Click for detailed forecast
      </span>
    </div>
  </div>
</div>


        {/* Quick Access Grid */}
        <div className="mb-8">
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Access
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {quickAccessItems.map((item, index) => (
              <div
                key={index}
                onClick={item.onClick || (() => {})}
                className={`p-4 rounded-xl transition-all hover:scale-105 hover:shadow-lg cursor-pointer ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl'
                } group`}
              >
                <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-3 mx-auto text-white group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <p className={`text-sm font-medium text-center ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Travel Snapshot */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Current Location
            </h3>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-orange-500 mr-2" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentLocation.name}
              </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
              {currentLocation.address}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-4 h-4 text-blue-500 mr-1" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Crowd: Medium
                </span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Safe Zone
              </span>
            </div>
          </div>

          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Travel Snapshot
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Destination:</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Delhi</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Digital ID:</span>
                <span className={`text-sm font-mono font-medium ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {user?.digitalId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Assigned Officer:</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sushanth Singh</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Travel Status
            </h3>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Day 2 of 7</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>29%</span>
              </div>
              <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-2 bg-orange-500 rounded-full transition-all duration-500" style={{ width: '29%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Arrived safely
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-orange-500 mr-2" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Active itinerary
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Today's Itinerary */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Today's Itinerary
            </h3>
            <div className="space-y-3">
              {todayItinerary.map((item, index) => (
                <div key={index} className={`flex items-center p-3 rounded-lg ${
                  item.status === 'current' 
                    ? (isDarkMode ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200')
                    : (isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50')
                }`}>
                  <div className={`text-sm font-mono w-16 ${
                    item.status === 'current' 
                      ? 'text-orange-600 font-bold' 
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                  }`}>
                    {item.time}
                  </div>
                  <div className="flex-1 ml-4">
                    <span className={`text-sm font-medium ${
                      item.status === 'current' 
                        ? (isDarkMode ? 'text-orange-400' : 'text-orange-700')
                        : (isDarkMode ? 'text-gray-300' : 'text-gray-700')
                    }`}>
                      {item.activity}
                    </span>
                  </div>
                  {item.status === 'current' && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {contact.service}
                  </span>
                  <a
                    href={`tel:${contact.number}`}
                    className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-mono text-sm">{contact.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Confirmation Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Emergency SOS Alert
              </h3>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                This will immediately contact emergency services and share your location. Are you sure you want to proceed?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={startSOSCountdown}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  🚨 ACTIVATE SOS ALERT
                </button>
                
                <button
                  onClick={cancelSOS}
                  className={`w-full py-3 px-4 rounded-lg transition-colors font-semibold ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
              </div>

              <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Emergency services will be called, your location will be shared, and your emergency contacts will be notified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Location Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Share Your Location
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 text-orange-500 mr-2" />
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentLocation.name}
                </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} ml-7`}>
                {currentLocation.address}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCopyLocationLink}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Location Link</span>
              </button>
              
              <button
                onClick={handleSendLocationWhatsApp}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>
              
              <button
                onClick={handleSendLocationSMS}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Send via SMS</span>
              </button>
              
              <button
                onClick={() => {
                  const locationUrl = `https://maps.google.com/?q=${currentLocation.coordinates.lat},${currentLocation.coordinates.lng}`;
                  window.open(`mailto:?subject=My Location&body=I'm currently at ${currentLocation.name}. Here's my location: ${locationUrl}`);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Send via Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] space-y-3">
              {notifications.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      !notification.read
                        ? (isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200')
                        : (isDarkMode ? 'bg-gray-700/50 border-gray-600/30' : 'bg-gray-50 border-gray-200')
                    } hover:shadow-md`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="text-2xl">{notification.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              notification.priority === 'high' 
                                ? 'bg-red-100 text-red-700' 
                                : notification.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {notification.priority}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {notification.time}
                            </span>
                            <div className="flex items-center space-x-2">
                              {notification.type === 'safety' && (
                                <button className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200 transition-colors">
                                  View Safety Map
                                </button>
                              )}
                              {notification.type === 'weather' && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNotificationsModal(false);
                                    handleWeatherClick();
                                  }}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                >
                                  View Weather
                                </button>
                              )}
                              {notification.type === 'emergency' && (
                                <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-colors">
                                  Contact Officer
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className={`p-1 rounded hover:bg-gray-200 ${isDarkMode ? 'hover:bg-gray-600 text-gray-400' : 'text-gray-500'} ml-2`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions */}
            {notifications.some(n => n.type === 'safety' || n.type === 'emergency') && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Quick Actions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleSOSClick}
                    className="flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">Emergency Call</span>
                  </button>
                  <button 
                    onClick={handleShareLocation}
                    className="flex items-center justify-center space-x-2 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share Location</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weather Modal */}
      {showWeatherModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Weather Details
              </h3>
              <button
                onClick={() => setShowWeatherModal(false)}
                className={`p-2 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Current Weather */}
            <div className={`rounded-xl p-6 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Current Weather
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentLocation.name}
                  </p>
                </div>
                <div className="text-4xl">{weatherData.current.icon}</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.current.temp}°C
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {weatherData.current.condition}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.feelsLike}°C
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Feels like
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.humidity}%
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Humidity
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.windSpeed} km/h
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Wind Speed
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="mb-6">
              <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Hourly Forecast
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {weatherData.hourly.map((hour, index) => (
                  <div key={index} className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {hour.time}
                    </div>
                    <div className="text-2xl mb-2">{hour.icon}</div>
                    <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {hour.temp}°
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {hour.condition}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="mb-6">
              <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                7-Day Forecast
              </h4>
              <div className="space-y-2">
                {weatherData.weekly.map((day, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`font-medium w-20 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {day.day}
                      </div>
                      <div className="text-2xl">{day.icon}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {day.condition}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {day.low}°
                      </div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {day.high}°
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Details */}
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Weather Details
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      UV Index
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.uvIndex}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    High
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Eye className="w-5 h-5 text-blue-500 mr-2" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Visibility
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.visibility} km
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Wind className="w-5 h-5 text-green-500 mr-2" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Pressure
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.pressure}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    hPa
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sunrise
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.sunrise}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Moon className="w-5 h-5 text-purple-500 mr-2" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sunset
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.sunset}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <Eye className="w-5 h-5 text-cyan-500 mr-2" />
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Dew Point
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {weatherData.details.dewPoint}°C
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TouristDashboard;