import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Clock, TrendingUp, MapPin, Shield, Filter, Download, Search, User, Phone, MessageSquare, Eye, Zap, Target, Wifi, WifiOff, Bell, Moon, Sun, Settings, X, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  x: number;
  y: number;
  status: 'safe' | 'caution' | 'danger';
  lastSeen: string;
  isOnline: boolean;
  location: string;
  batteryLevel: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  sancharId: string;
}

interface RiskZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  level: 'low' | 'medium' | 'high';
  name: string;
  incidentCount: number;
}

interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface MonitoringSettings {
  location: string;
  range: number; // in km
}

const OfficerDashboard = () => {
  const user = { name: 'Sushanth Singh', officerId: 'DEL-SUP-010124-001', department: 'Tourist Safety Department', phone: '+91 9876543200' };
  
  // State variables
  const [selectedTourists, setSelectedTourists] = useState<string[]>([]);
  const [liveUsers, setLiveUsers] = useState<User[]>([]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [riskFilter, setRiskFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // New state variables
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [monitoringControlOpen, setMonitoringControlOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [monitoringSettings, setMonitoringSettings] = useState<MonitoringSettings>({
    location: 'Delhi Central',
    range: 5
  });

  // Generate Sanchar Digital ID
  const generateSancharId = (location: string, index: number): string => {
    const locationCodes: { [key: string]: string } = {
      'Red Fort Area': 'RFA',
      'Chandni Chowk': 'CCK',
      'Construction Zone': 'CZN',
      'Lotus Temple': 'LTM',
      'India Gate': 'IGT',
      'Market Area': 'MKT'
    };
    
    const locationCode = locationCodes[location] || 'DEL';
    const today = new Date();
    const dateStr = today.getDate().toString().padStart(2, '0') + 
                   (today.getMonth() + 1).toString().padStart(2, '0') + 
                   today.getFullYear();
    const uniqueCode = (index + 1).toString().padStart(4, '0');
    
    return `${locationCode}${dateStr}-${uniqueCode}`;
  };

  // Initialize data
  useEffect(() => {
    const staticUsers: User[] = [
      {
        id: '1',
        name: 'Jay Ram',
        phone: '+91 9876543210',
        avatar: '👨',
        x: 35,
        y: 25,
        status: 'safe',
        lastSeen: 'now',
        isOnline: true,
        location: 'Red Fort Area',
        batteryLevel: 85,
        riskLevel: 'Low',
        sancharId: generateSancharId('Red Fort Area', 0)
      },
      {
        id: '2',
        name: 'Esha Sana',
        phone: '+91 9876543211',
        avatar: '👩',
        x: 55,
        y: 40,
        status: 'caution',
        lastSeen: '2m ago',
        isOnline: true,
        location: 'Chandni Chowk',
        batteryLevel: 45,
        riskLevel: 'Medium',
        sancharId: generateSancharId('Chandni Chowk', 1)
      },
      {
        id: '3',
        name: 'Dhanunjay Reddy',
        phone: '+91 9876543212',
        avatar: '👨‍💼',
        x: 65,
        y: 45,
        status: 'danger',
        lastSeen: '5m ago',
        isOnline: false,
        location: 'Construction Zone',
        batteryLevel: 20,
        riskLevel: 'High',
        sancharId: generateSancharId('Construction Zone', 2)
      },
      {
        id: '4',
        name: 'Sarah Gupta',
        phone: '+91 9876543213',
        avatar: '👩‍🦱',
        x: 20,
        y: 55,
        status: 'safe',
        lastSeen: '1m ago',
        isOnline: true,
        location: 'Lotus Temple',
        batteryLevel: 92,
        riskLevel: 'Low',
        sancharId: generateSancharId('Lotus Temple', 3)
      },
      {
        id: '5',
        name: 'Arun Mishra',
        phone: '+91 9876543214',
        avatar: '👨‍🎓',
        x: 45,
        y: 35,
        status: 'safe',
        lastSeen: 'now',
        isOnline: true,
        location: 'India Gate',
        batteryLevel: 67,
        riskLevel: 'Low',
        sancharId: generateSancharId('India Gate', 4)
      },
      {
        id: '6',
        name: 'Aadhya Sri',
        phone: '+91 9876543215',
        avatar: '👩‍💻',
        x: 75,
        y: 60,
        status: 'caution',
        lastSeen: '3m ago',
        isOnline: true,
        location: 'Market Area',
        batteryLevel: 55,
        riskLevel: 'Medium',
        sancharId: generateSancharId('Market Area', 5)
      }
    ];

    setLiveUsers(staticUsers);

    const zones: RiskZone[] = [
      { id: '1', x: 25, y: 30, radius: 15, level: 'high', name: 'Crowded Market', incidentCount: 3 },
      { id: '2', x: 65, y: 45, radius: 20, level: 'medium', name: 'Construction Zone', incidentCount: 1 },
      { id: '3', x: 40, y: 60, radius: 12, level: 'low', name: 'Tourist Hotspot', incidentCount: 0 },
      { id: '4', x: 75, y: 25, radius: 18, level: 'medium', name: 'Event Area', incidentCount: 2 },
      { id: '5', x: 15, y: 70, radius: 14, level: 'high', name: 'Dark Alley', incidentCount: 4 }
    ];

    setRiskZones(zones);

    // Initialize notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'alert',
        title: 'High Risk Alert',
        message: 'Dhanunjay Reddy entered a high-risk zone',
        time: '2 minutes ago',
        isRead: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'Low Battery Warning',
        message: 'Esha Sana has low battery (45%)',
        time: '5 minutes ago',
        isRead: false
      },
      {
        id: '3',
        type: 'info',
        title: 'New Tourist Check-in',
        message: 'Arun Mishra checked in at India Gate',
        time: '10 minutes ago',
        isRead: true
      }
    ];

    setNotifications(initialNotifications);

    // Slow updates every 30 seconds for subtle position changes
    const interval = setInterval(() => {
      setLiveUsers((prevUsers: User[]) => 
        prevUsers.map((user: User) => ({
          ...user,
          x: Math.max(5, Math.min(95, user.x + (Math.random() - 0.5) * 3)),
          y: Math.max(5, Math.min(95, user.y + (Math.random() - 0.5) * 3)),
          batteryLevel: Math.max(10, user.batteryLevel - Math.floor(Math.random() * 2)),
          lastSeen: user.isOnline ? 'now' : `${Math.floor(Math.random() * 10) + 1}m ago`
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const activityData = [
    { time: '06:00', tourists: 120 },
    { time: '08:00', tourists: 250 },
    { time: '10:00', tourists: 380 },
    { time: '12:00', tourists: 450 },
    { time: '14:00', tourists: 420 },
    { time: '16:00', tourists: 390 },
    { time: '18:00', tourists: 320 },
    { time: '20:00', tourists: 180 }
  ];

  const incidentData = [
    { name: 'Safe', value: 75, color: '#10B981' },
    { name: 'Caution', value: 20, color: '#F59E0B' },
    { name: 'Danger', value: 5, color: '#EF4444' }
  ];

  // Filter tourists based on monitoring settings
  const filteredTourists = liveUsers.filter(user => {
    const matchesRiskFilter = riskFilter ? user.riskLevel === riskFilter : true;
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.phone.includes(searchTerm) ||
                             user.sancharId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRiskFilter && matchesSearchTerm;
  });

  // Event handlers
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleSelectTourist = (id: string) => {
    setSelectedTourists(prev => 
      prev.includes(id) 
        ? prev.filter(tId => tId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTourists.length === filteredTourists.length && filteredTourists.length > 0) {
      setSelectedTourists([]);
    } else {
      setSelectedTourists(filteredTourists.map(user => user.id));
    }
  };

  const handleAlertFiltered = () => {
    filteredTourists.forEach(user => sendAlert(user.id));
    alert(`${filteredTourists.length} tourists with ${riskFilter} risk level alerted!`);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const sendAlert = (userId: string) => {
    console.log(`Sending alert to user ${userId}`);
  };

  const callUser = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const messageUser = (userId: string) => {
    console.log(`Opening message thread with user ${userId}`);
  };

  const dispatchTeam = (location: string) => {
    console.log(`Dispatching team to ${location}`);
  };

  const updateMonitoringSettings = (newSettings: MonitoringSettings) => {
    setMonitoringSettings(newSettings);
  };

  // Utility functions
  const getRiskColor = (level: 'Low' | 'Medium' | 'High') => {
    if (isDarkMode) {
      switch (level) {
        case 'High': return 'bg-red-900 text-red-200';
        case 'Medium': return 'bg-yellow-900 text-yellow-200';
        case 'Low': return 'bg-green-900 text-green-200';
        default: return 'bg-gray-700 text-gray-300';
      }
    } else {
      switch (level) {
        case 'High': return 'bg-red-100 text-red-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const getStatusColor = (status: 'safe' | 'caution' | 'danger') => {
    switch (status) {
      case 'danger': return 'text-red-600';
      case 'caution': return 'text-yellow-600';
      case 'safe': return 'text-green-600';
      default: return isDarkMode ? 'text-gray-300' : 'text-gray-600';
    }
  };

  const getUserStatusColor = (status: 'safe' | 'caution' | 'danger') => {
    switch (status) {
      case 'safe': return 'border-green-500 bg-green-500';
      case 'caution': return 'border-yellow-500 bg-yellow-500';
      case 'danger': return 'border-red-500 bg-red-500';
      default: return 'border-gray-500 bg-gray-500';
    }
  };

  const getRiskZoneColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return 'rgba(239, 68, 68, 0.4)';
      case 'medium': return 'rgba(245, 158, 11, 0.4)';
      case 'low': return 'rgba(34, 197, 94, 0.4)';
      default: return 'rgba(156, 163, 175, 0.4)';
    }
  };


  const getNotificationIcon = (type: 'alert' | 'warning' | 'info') => {
    switch (type) {
      case 'alert': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  // Theme classes
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
  };

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Officer ID Card */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name || 'Officer Name'}</h2>
                <p className="text-orange-100">Officer ID: {user?.officerId || 'OFF001'}</p>
                <p className="text-orange-100">{user?.department || 'Tourist Safety Department'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-100">Contact</p>
              <p className="font-semibold">{user?.phone || '+91 9876543200'}</p>
              <div className="flex items-center justify-end space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-orange-100 text-sm">On Duty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar with new controls */}
        <div className={`${themeClasses.cardBg} rounded-xl shadow-sm p-4 mb-8 ${themeClasses.border} border transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <nav className="flex space-x-8">
              <a href="#" className="text-orange-600 border-b-2 border-orange-600 pb-2 px-1 font-medium">
                Live Dashboard
              </a>
              <a href="#" className={`${themeClasses.textSecondary} hover:text-orange-600 pb-2 px-1 transition-colors`}>
                Reports
              </a>
              <a href="#" className={`${themeClasses.textSecondary} hover:text-orange-600 pb-2 px-1 transition-colors`}>
                Incidents
              </a>
              <a href="#" className={`${themeClasses.textSecondary} hover:text-orange-600 pb-2 px-1 transition-colors`}>
                Analytics
              </a>
              <a href="#" className={`${themeClasses.textSecondary} hover:text-orange-600 pb-2 px-1 transition-colors`}>
                Settings
              </a>
            </nav>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Monitoring Location Info */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
                <MapPin className="w-4 h-4 text-orange-600" />
                <span className={themeClasses.text}>{monitoringSettings.location}</span>
                <span className={themeClasses.textSecondary}>({monitoringSettings.range}km)</span>
              </div>

              {/* Officer Monitoring Control */}
              <div className="relative">
                <button
                  onClick={() => setMonitoringControlOpen(true)}
                  className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                  title="Monitoring Settings"
                >
                  <Settings className={`w-5 h-5 ${themeClasses.text}`} />
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2 rounded-lg ${themeClasses.hover} transition-colors relative`}
                  title="Notifications"
                >
                  <Bell className={`w-5 h-5 ${themeClasses.text}`} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className={`absolute right-0 mt-2 w-80 ${themeClasses.cardBg} rounded-lg shadow-lg ${themeClasses.border} border z-30`}>
                    <div className={`p-4 ${themeClasses.border} border-b`}>
                      <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Notifications</h3>
                      <p className={`text-sm ${themeClasses.textSecondary}`}>{unreadNotifications} unread</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 ${themeClasses.border} border-b ${themeClasses.hover} cursor-pointer ${
                            !notification.isRead ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50') : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold ${themeClasses.text} ${!notification.isRead ? 'font-bold' : ''}`}>
                                {notification.title}
                              </p>
                              <p className={`text-sm ${themeClasses.textSecondary}`}>{notification.message}</p>
                              <p className="text-xs text-orange-600 mt-1">{notification.time}</p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Monitoring Control Modal */}
        {monitoringControlOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${themeClasses.cardBg} rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Monitoring Settings</h3>
                <button
                  onClick={() => setMonitoringControlOpen(false)}
                  className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                >
                  <X className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Location Selector */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Monitoring Location
                  </label>
                  <div className="relative">
                    <select
                      value={monitoringSettings.location}
                      onChange={(e) => updateMonitoringSettings({
                        ...monitoringSettings,
                        location: e.target.value
                      })}
                      className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text} focus:ring-orange-500 focus:border-orange-500`}
                    >
                      <option value="Delhi Central">Delhi Central</option>
                      <option value="Red Fort Area">Red Fort Area</option>
                      <option value="Chandni Chowk">Chandni Chowk</option>
                      <option value="Lotus Temple">Lotus Temple</option>
                      <option value="India Gate">India Gate</option>
                      <option value="Connaught Place">Connaught Place</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${themeClasses.textSecondary}`} />
                  </div>
                </div>

                {/* Range Selector */}
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Monitoring Range: {monitoringSettings.range} km
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm ${themeClasses.textSecondary}`}>1km</span>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={monitoringSettings.range}
                      onChange={(e) => updateMonitoringSettings({
                        ...monitoringSettings,
                        range: parseInt(e.target.value)
                      })}
                      className="flex-1 accent-orange-600"
                    />
                    <span className={`text-sm ${themeClasses.textSecondary}`}>20km</span>
                  </div>
                  <div className="flex justify-between text-xs text-orange-600 mt-1">
                    <span>Close Range</span>
                    <span>Wide Range</span>
                  </div>
                </div>

                {/* Coverage Info */}
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Coverage Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={themeClasses.textSecondary}>Active Tourists:</span>
                      <span className={`ml-2 font-semibold ${themeClasses.text}`}>
                        {liveUsers.filter(u => u.isOnline).length}
                      </span>
                    </div>
                    <div>
                      <span className={themeClasses.textSecondary}>Risk Zones:</span>
                      <span className={`ml-2 font-semibold ${themeClasses.text}`}>
                        {riskZones.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={() => setMonitoringControlOpen(false)}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm`}>Active Tourists</p>
                <p className={`text-3xl font-bold ${themeClasses.text}`}>{liveUsers.filter(u => u.isOnline).length}</p>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from yesterday
                </p>
              </div>
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm`}>High Risk Alerts</p>
                <p className={`text-3xl font-bold ${themeClasses.text}`}>{liveUsers.filter(u => u.status === 'danger').length}</p>
                <p className="text-red-600 text-sm flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Needs attention
                </p>
              </div>
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-red-900' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm`}>Risk Zones</p>
                <p className={`text-3xl font-bold ${themeClasses.text}`}>{riskZones.filter(z => z.level === 'high').length}</p>
                <p className={`${themeClasses.textSecondary} text-sm flex items-center mt-1`}>
                  <Target className="w-4 h-4 mr-1" />
                  High risk areas
                </p>
              </div>
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'} rounded-lg flex items-center justify-center`}>
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.textSecondary} text-sm`}>Response Time</p>
                <p className={`text-3xl font-bold ${themeClasses.text}`}>2.3m</p>
                <p className="text-green-600 text-sm flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Improved 25%
                </p>
              </div>
              <div className={`w-12 h-12 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Real-time Interactive Map */}
          <div className={`lg:col-span-2 ${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Live Tourist Tracking</h3>
                <p className={`text-sm ${themeClasses.textSecondary}`}>Real-time locations and risk assessment</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} px-3 py-1 rounded-full`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 text-sm font-medium">Live</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Eye className={`w-4 h-4 ${themeClasses.textSecondary}`} />
                  <span className={themeClasses.textSecondary}>{liveUsers.length} tourists</span>
                </div>
              </div>
            </div>
            
            <div className={`relative h-[600px] rounded-lg overflow-hidden border-2 ${themeClasses.border}`}>
              {/* Google Maps Embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14043.205291651468!2d77.2177004!3d28.632601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1dc8eaa0cddd%3A0x1f3a5c5cb50a540!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1694690000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
              />

              {/* Risk Zones Overlay */}
              {riskZones.map((zone) => (
                <div
                  key={zone.id}
                  className="absolute rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 cursor-pointer"
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.radius}%`,
                    height: `${zone.radius * 0.75}%`,
                    backgroundColor: getRiskZoneColor(zone.level),
                    border: `2px solid ${zone.level === 'high' ? '#ef4444' : zone.level === 'medium' ? '#f59e0b' : '#22c55e'}`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${zone.name} - ${zone.incidentCount} incidents`}
                  onClick={() => dispatchTeam(zone.name)}
                >
                  <div className="text-center">
                    <div className={`text-xs font-bold ${
                      zone.level === 'high' ? 'text-red-700' : 
                      zone.level === 'medium' ? 'text-yellow-700' : 
                      'text-green-700'
                    }`}>
                      {zone.level.toUpperCase()}
                    </div>
                    <div className="text-xs opacity-75">{zone.incidentCount}</div>
                  </div>
                </div>
              ))}

              {/* Live User Avatars */}
              {liveUsers.map((user) => (
                <div
                  key={user.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-[30000ms] ease-in-out cursor-pointer group z-20"
                  style={{ left: `${user.x}%`, top: `${user.y}%` }}
                  onClick={() => handleUserClick(user)}
                >
                  <div 
                    className={`w-12 h-12 rounded-full border-3 flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-125 shadow-lg ${getUserStatusColor(user.status)}`}
                    title={`${user.name} - ${user.status}`}
                  >
                    <span className="filter drop-shadow-sm">{user.avatar}</span>
                  </div>
                  
                  <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
                    {user.isOnline ? (
                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(user.riskLevel)}`}>
                    {user.riskLevel}
                  </div>

                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                    <div className={`${themeClasses.cardBg} rounded-lg shadow-xl p-4 min-w-max border-2 ${themeClasses.border}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-4 h-4 rounded-full ${getUserStatusColor(user.status)}`}></div>
                        <div>
                          <div className={`font-semibold ${themeClasses.text}`}>{user.name}</div>
                          <div className={`text-xs ${themeClasses.textSecondary}`}>{user.location}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                        <div className="flex items-center space-x-1">
                          {user.isOnline ? (
                            <Wifi className="w-3 h-3 text-green-500" />
                          ) : (
                            <WifiOff className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={themeClasses.textSecondary}>{user.lastSeen}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={`text-xs ${themeClasses.textSecondary}`}>ID: {user.sancharId}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            callUser(user.phone);
                          }}
                        >
                          Call
                        </button>
                        <button 
                          className="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            sendAlert(user.id);
                          }}
                        >
                          Alert
                        </button>
                        <button 
                          className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            messageUser(user.id);
                          }}
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Control Panel */}
              <div className={`absolute top-4 left-4 ${themeClasses.cardBg} rounded-lg shadow-xl ${themeClasses.border} border p-4 max-w-xs z-10`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`text-sm font-semibold ${themeClasses.text}`}>Delhi Tourism Safety</h4>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-xs ${themeClasses.textSecondary}`}>Live</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className={themeClasses.textSecondary}>Active Tourists:</span>
                    <span className="font-semibold text-blue-600">{liveUsers.filter(u => u.isOnline).length}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className={themeClasses.textSecondary}>High Risk Areas:</span>
                    <span className="font-semibold text-red-600">{riskZones.filter(z => z.level === 'high').length}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className={themeClasses.textSecondary}>Response Teams:</span>
                    <span className="font-semibold text-green-600">4 Available</span>
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className={`absolute top-4 right-4 ${themeClasses.cardBg} rounded-lg shadow-lg ${themeClasses.border} border z-10`}>
                <div className="flex flex-col">
                  <button className={`p-2 ${themeClasses.hover} ${themeClasses.border} border-b`}>
                    <div className={`w-5 h-5 flex items-center justify-center ${themeClasses.textSecondary} font-bold text-lg`}>+</div>
                  </button>
                  <button className={`p-2 ${themeClasses.hover}`}>
                    <div className={`w-5 h-5 flex items-center justify-center ${themeClasses.textSecondary} font-bold text-lg`}>−</div>
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div className={`absolute bottom-4 right-4 ${themeClasses.cardBg}/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10`}>
                <h4 className={`text-sm font-semibold ${themeClasses.text} mb-2`}>Risk Levels</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className={`text-xs ${themeClasses.textSecondary}`}>Safe ({liveUsers.filter(u => u.status === 'safe').length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className={`text-xs ${themeClasses.textSecondary}`}>Caution ({liveUsers.filter(u => u.status === 'caution').length})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className={`text-xs ${themeClasses.textSecondary}`}>Danger ({liveUsers.filter(u => u.status === 'danger').length})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Selected User Panel */}
          <div className="space-y-6">
            {selectedUser && (
              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm border-l-4 border-orange-500 transition-colors duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Tourist Details</h3>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className={`${themeClasses.textSecondary} hover:text-red-600`}
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full border-3 flex items-center justify-center text-xl ${getUserStatusColor(selectedUser.status)}`}>
                      <span>{selectedUser.avatar}</span>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text}`}>{selectedUser.name}</h4>
                      <p className={`text-sm ${themeClasses.textSecondary}`}>{selectedUser.location}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <span className={themeClasses.textSecondary}>Status:</span>
                      <span className={`ml-2 font-medium capitalize ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div>
                      <span className={themeClasses.textSecondary}>Risk:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getRiskColor(selectedUser.riskLevel)}`}>
                        {selectedUser.riskLevel}
                      </span>
                    </div>
                    <div>
                      <span className={themeClasses.textSecondary}>Sanchar ID:</span>
                      <span className={`ml-2 font-mono text-xs ${themeClasses.text} bg-opacity-20 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>
                        {selectedUser.sancharId}
                      </span>
                    </div>
                    <div>
                      <span className={themeClasses.textSecondary}>Last Seen:</span>
                      <span className={`ml-2 font-medium ${themeClasses.text}`}>{selectedUser.lastSeen}</span>
                    </div>
                  </div>
                  
                  <div className={`grid grid-cols-3 gap-2 pt-4 ${themeClasses.border} border-t`}>
                    <button 
                      onClick={() => callUser(selectedUser.phone)}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Call</span>
                    </button>
                    <button 
                      onClick={() => sendAlert(selectedUser.id)}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>Alert</span>
                    </button>
                    <button 
                      onClick={() => messageUser(selectedUser.id)}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Emergency Broadcast</span>
                </button>
                <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Create Geofence</span>
                </button>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Dispatch Team</span>
                </button>
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
              </div>
            </div>

            {/* Risk Zone Summary */}
            <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Risk Zone Status</h3>
              <div className="space-y-3">
                {riskZones.slice(0, 3).map((zone) => (
                  <div key={zone.id} className={`flex items-center justify-between p-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div>
                      <div className={`font-medium ${themeClasses.text}`}>{zone.name}</div>
                      <div className={`text-xs ${themeClasses.textSecondary}`}>{zone.incidentCount} incidents</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor((zone.level.charAt(0).toUpperCase() + zone.level.slice(1)) as 'Low' | 'Medium' | 'High')}`}>
                      {zone.level}
                    </span>
                  </div>
                ))}
                <button className="w-full text-orange-600 hover:text-orange-800 text-sm font-medium">
                  View All Zones →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tourist Monitoring Table */}
        <div className={`${themeClasses.cardBg} rounded-xl shadow-sm mb-8 transition-colors duration-300`}>
          <div className={`p-6 ${themeClasses.border} border-b`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Tourist Monitoring</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary} w-4 h-4`} />
                  <input
                    type="text"
                    placeholder="Search tourists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 ${themeClasses.border} border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${themeClasses.cardBg} ${themeClasses.text}`}
                  />
                </div>

                <div className="relative">
                  <button
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                    className={`flex items-center space-x-2 px-4 py-2 ${themeClasses.border} border rounded-lg ${themeClasses.hover} transition-colors`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className={themeClasses.text}>Filter</span>
                    {riskFilter && (
                      <span className={`ml-1 px-2 py-0.5 ${isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-800'} text-xs rounded-full`}>
                        {riskFilter}
                      </span>
                    )}
                  </button>

                  {filterMenuOpen && (
                    <div className={`absolute mt-2 right-0 w-40 ${themeClasses.cardBg} ${themeClasses.border} border rounded-lg shadow-lg z-20`}>
                      {(['High', 'Medium', 'Low'] as const).map(level => (
                        <button
                          key={level}
                          onClick={() => {
                            setRiskFilter(level);
                            setFilterMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 ${themeClasses.hover} transition-colors ${
                            riskFilter === level ? (isDarkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-50 text-orange-600') : themeClasses.text
                          }`}
                        >
                          {level} Risk ({liveUsers.filter(u => u.riskLevel === level).length})
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setRiskFilter('');
                          setFilterMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 ${themeClasses.hover} text-sm ${themeClasses.textSecondary} ${themeClasses.border} border-t`}
                      >
                        Clear Filter
                      </button>
                    </div>
                  )}
                </div>

                <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {riskFilter && (
              <div className={`flex items-center justify-between mt-4 p-3 ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-50'} rounded-lg`}>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                    Showing {filteredTourists.length} tourists with {riskFilter} risk level
                  </span>
                  {selectedTourists.length > 0 && (
                    <span className={`text-sm ${themeClasses.textSecondary}`}>
                      ({selectedTourists.length} selected)
                    </span>
                  )}
                </div>
                <button
                  onClick={handleAlertFiltered}
                  disabled={filteredTourists.length === 0}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Alert All Filtered ({filteredTourists.length})
                </button>
              </div>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedTourists.length === filteredTourists.length && filteredTourists.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>Tourist</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>Location</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>Risk Level</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>Sanchar Digital ID</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>Last Seen</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`${themeClasses.cardBg} divide-y ${themeClasses.border}`}>
                {filteredTourists.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`${themeClasses.hover} transition-colors ${
                      riskFilter && user.riskLevel === riskFilter ? (isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50') : ''
                    } ${selectedTourists.includes(user.id) ? (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        checked={selectedTourists.includes(user.id)}
                        onChange={() => handleSelectTourist(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mr-3 ${getUserStatusColor(user.status)}`}>
                          <span className="text-lg">{user.avatar}</span>
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${themeClasses.text}`}>{user.name}</div>
                          <div className={`text-xs ${themeClasses.textSecondary}`}>{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeClasses.text}`}>
                      <div className="flex items-center">
                        <MapPin className={`w-4 h-4 ${themeClasses.textSecondary} mr-1`} />
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.isOnline ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        ) : (
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        )}
                        <span className={`text-sm font-medium capitalize ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(user.riskLevel)}`}>
                        {user.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-mono text-xs ${themeClasses.text} ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} px-2 py-1 rounded`}>
                        {user.sancharId}
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeClasses.textSecondary}`}>
                      {user.lastSeen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => callUser(user.phone)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Call
                        </button>
                        <button 
                          onClick={() => sendAlert(user.id)}
                          className="text-orange-600 hover:text-orange-900 transition-colors"
                        >
                          Alert
                        </button>
                        <button 
                          onClick={() => handleUserClick(user)}
                          className="text-purple-600 hover:text-purple-900 transition-colors"
                        >
                          Track
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTourists.length === 0 && (
              <div className="text-center py-8">
                <p className={themeClasses.textSecondary}>
                  {searchTerm || riskFilter ? 'No tourists match your search criteria.' : 'No tourists found.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
            <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Tourist Activity Today</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="time" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="tourists" 
                  stroke="#ea580c" 
                  strokeWidth={3}
                  dot={{ fill: '#ea580c', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
            <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Safety Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incidentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: isDarkMode ? '#ffffff' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {incidentData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className={`text-sm ${themeClasses.textSecondary} font-medium`}>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside handler for dropdowns */}
      {(notificationsOpen || filterMenuOpen) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setNotificationsOpen(false);
            setFilterMenuOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default OfficerDashboard;