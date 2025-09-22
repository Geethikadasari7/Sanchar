import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, MapPin, Battery, Signal, Shield, Phone, MessageCircle, AlertTriangle, Navigation, Wifi, WifiOff, Sun, Moon, UserCheck, UserMinus } from 'lucide-react';

interface FamilyTrackingDashboardProps {
  onBack: () => void;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    lastUpdated: string;
  };
  battery: number;
  isOnline: boolean;
  status: 'safe' | 'warning' | 'emergency';
  phone: string;
  avatar: React.ReactNode;
}

const FamilyTrackingDashboard: React.FC<FamilyTrackingDashboardProps> = ({ onBack }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Rajesh Dasari',
      relation: 'Father',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'Connaught Place, New Delhi',
        lastUpdated: '2 minutes ago'
      },
      battery: 85,
      isOnline: true,
      status: 'safe',
      phone: '+91 98765 43210',
      avatar: <UserCheck className="w-8 h-8 text-blue-600" />
    },
    {
      id: '2',
      name: 'Sunitha Dasari',
      relation: 'Mother',
      location: {
        lat: 28.6562,
        lng: 77.2410,
        address: 'Red Fort, Delhi',
        lastUpdated: '5 minutes ago'
      },
      battery: 92,
      isOnline: true,
      status: 'safe',
      phone: '+91 98765 43211',
      avatar: <UserCheck className="w-8 h-8 text-pink-600" />
    },
    {
      id: '3',
      name: 'Arjun Dasari',
      relation: 'Brother',
      location: {
        lat: 28.5355,
        lng: 77.3910,
        address: 'Akshardham Temple, Delhi',
        lastUpdated: '15 minutes ago'
      },
      battery: 45,
      isOnline: false,
      status: 'warning',
      phone: '+91 98765 43212',
      avatar: <UserMinus className="w-8 h-8 text-orange-600" />
    },
    {
      id: '4',
      name: 'Priya Dasari',
      relation: 'Sister',
      location: {
        lat: 28.6129,
        lng: 77.2295,
        address: 'India Gate, New Delhi',
        lastUpdated: '1 minute ago'
      },
      battery: 78,
      isOnline: true,
      status: 'safe',
      phone: '+91 98765 43213',
      avatar: <UserCheck className="w-8 h-8 text-purple-600" />
    }
  ]);

  const [trackingEnabled, setTrackingEnabled] = useState(true);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setFamilyMembers(prev => 
        prev.map(member => ({
          ...member,
          battery: Math.max(0, member.battery - Math.random() * 2),
          location: {
            ...member.location,
            lastUpdated: `${Math.floor(Math.random() * 10) + 1} minutes ago`
          }
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Add CSS styles to document head
  useEffect(() => {
    const styleId = 'family-tracking-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce-custom {
          animation: bounce-custom 2s infinite;
        }

        @keyframes bounce-custom {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0px);
          }
          40%, 43% {
            transform: translateY(-8px);
          }
          70% {
            transform: translateY(-4px);
          }
          90% {
            transform: translateY(-2px);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'emergency': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 dark:bg-green-900/20';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'emergency': return 'bg-red-100 dark:bg-red-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const handleLocationClick = (member: FamilyMember) => {
    const url = `https://maps.google.com/?q=${member.location.lat},${member.location.lng}`;
    window.open(url, '_blank');
  };

  const handleCallMember = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleMessageMember = (phone: string) => {
    const message = encodeURIComponent('Hi, checking on you. Are you safe?');
    window.open(`sms:${phone}?body=${message}`);
  };

  const handleEmergencyAlert = (member: FamilyMember) => {
    // Update member status to emergency
    setFamilyMembers(prev =>
      prev.map(m => m.id === member.id ? { ...m, status: 'emergency' } : m)
    );
    
    // Send emergency alert
    const alertMessage = encodeURIComponent(`🚨 FAMILY EMERGENCY ALERT 🚨\n\n${member.name} needs immediate assistance!\nLocation: ${member.location.address}\nTime: ${new Date().toLocaleString()}`);
    window.open(`sms:${member.phone}?body=${alertMessage}`);
  };

  const handleCallAllMembers = () => {
    familyMembers.forEach(member => {
      setTimeout(() => {
        window.open(`tel:${member.phone}`);
      }, 1000);
    });
  };

  const handleSendGroupAlert = () => {
    const message = encodeURIComponent('🚨 FAMILY EMERGENCY: Please confirm your safety status immediately. Reply with your location.');
    familyMembers.forEach((member, index) => {
      setTimeout(() => {
        window.open(`sms:${member.phone}?body=${message}`);
      }, index * 500);
    });
  };

  const handleShareMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const message = encodeURIComponent(`📍 My current location: https://maps.google.com/?q=${latitude},${longitude}\nSent at: ${new Date().toLocaleString()}`);
          familyMembers.forEach((member, index) => {
            setTimeout(() => {
              window.open(`sms:${member.phone}?body=${message}`);
            }, index * 500);
          });
        },
        () => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const safeMembersCount = familyMembers.filter(m => m.status === 'safe').length;
  const warningMembersCount = familyMembers.filter(m => m.status === 'warning').length;
  const emergencyMembersCount = familyMembers.filter(m => m.status === 'emergency').length;
  const onlineCount = familyMembers.filter(m => m.isOnline).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className={`mr-4 p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Family Tracking
              </h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Keep track of your family members' locations and safety
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className={`w-2 h-2 rounded-full ${trackingEnabled ? 'bg-green-500' : 'bg-gray-400'} ${trackingEnabled ? 'animate-pulse' : ''}`}></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {trackingEnabled ? 'Live Tracking' : 'Tracking Disabled'}
              </span>
            </div>
            <button
              onClick={() => setTrackingEnabled(!trackingEnabled)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                trackingEnabled
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {trackingEnabled ? 'Disable' : 'Enable'} Tracking
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} animate-pulse`}>
                  {familyMembers.length}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Members
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} animate-pulse`}>
                  {onlineCount}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Online
                </div>
              </div>
              <Wifi className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} animate-pulse`}>
                  {safeMembersCount}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Safe
                </div>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} animate-pulse`}>
                  {warningMembersCount + emergencyMembersCount}
                </div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Alerts
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Family Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {familyMembers.map((member, index) => (
            <div
              key={member.id}
              className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border-l-4 ${
                member.status === 'safe' ? 'border-green-500' :
                member.status === 'warning' ? 'border-yellow-500' : 'border-red-500'
              } transition-all duration-300 hover:scale-105 hover:shadow-2xl transform hover:-translate-y-1 fade-in-up`}
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Member Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="transform transition-all duration-300 hover:scale-110 hover:rotate-12">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {member.relation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    {member.isOnline ? (
                      <Wifi className="w-4 h-4 text-green-500 animate-pulse" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-gray-400" />
                    )}
                    {member.isOnline && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(member.status)} ${getStatusColor(member.status)} animate-pulse`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Location Info */}
              <div className="mb-4">
                <div className="flex items-start space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-orange-500 mt-0.5 animate-bounce-custom" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.location.address}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Last updated: {member.location.lastUpdated}
                    </p>
                  </div>
                </div>
              </div>

              {/* Battery & Signal */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Battery className={`w-4 h-4 ${member.battery > 20 ? 'text-green-500' : 'text-red-500'}`} />
                    {member.battery <= 20 && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {member.battery.toFixed(0)}%
                  </span>
                  <div className={`w-16 h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                    <div 
                      className={`h-full transition-all duration-300 ${
                        member.battery > 50 ? 'bg-green-500' : member.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(member.battery, 0)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Signal className="w-4 h-4 text-blue-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {member.isOnline ? 'Strong' : 'Weak'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLocationClick(member)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-1 text-sm transform active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>View Map</span>
                </button>
                <button
                  onClick={() => handleCallMember(member.phone)}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-110 transform active:scale-95"
                  title="Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMessageMember(member.phone)}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all duration-300 hover:scale-110 transform active:scale-95"
                  title="Message"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                {member.status !== 'emergency' && (
                  <button
                    onClick={() => handleEmergencyAlert(member)}
                    className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-110 transform active:scale-95"
                    title="Emergency Alert"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Actions */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border-red-500/20' : 'bg-red-50 border-red-200'} border transition-all duration-300 hover:shadow-xl`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Emergency Actions
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Quick actions in case of family emergencies
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={handleCallAllMembers}
              className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 transform active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call All Members</span>
            </button>
            <button 
              onClick={handleSendGroupAlert}
              className="bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Group Alert</span>
            </button>
            <button 
              onClick={handleShareMyLocation}
              className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 transform active:scale-95"
            >
              <MapPin className="w-4 h-4" />
              <span>Share My Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTrackingDashboard;