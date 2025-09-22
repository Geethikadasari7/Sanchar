import { useState, useEffect } from 'react';
import { Users, AlertTriangle, Clock, TrendingUp, MapPin, Shield, Filter, Download, Search, User, Phone, MessageSquare, Eye, Zap, Target, Wifi, WifiOff, Bell, Moon, Sun, Settings, X, ChevronDown, FileText, Activity, CheckCircle, Save,  Clock3, UserCheck, Building2, Hash } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

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

interface Incident {
  id: string;
  type: 'emergency' | 'medical' | 'theft' | 'harassment' | 'lost';
  title: string;
  description: string;
  location: string;
  touristId: string;
  touristName: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedAt: string;
  resolvedAt?: string;
  assignedOfficer?: string;
}

interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident' | 'safety';
  generatedAt: string;
  summary: string;
  downloadUrl?: string;
}

interface Geofence {
  id: string;
  name: string;
  type: 'safe' | 'restricted' | 'alert';
  x: number;
  y: number;
  radius: number;
  description: string;
  isActive: boolean;
}

interface EFIR {
  id: string;
  firNumber: string;
  complainantName: string;
  complainantPhone: string;
  complainantEmail: string;
  complainantAddress: string;
  incidentType: 'theft' | 'fraud' | 'harassment' | 'assault' | 'cybercrime' | 'other';
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  description: string;
  evidenceFiles: string[];
  witnessDetails: string;
  status: 'submitted' | 'under-review' | 'investigating' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedOfficer?: string;
  submittedAt: string;
  updatedAt: string;
  digitalId?: string;
}

interface OfficerProfile {
  name: string;
  officerId: string;
  department: string;
  phone: string;
}

const OfficerDashboard = () => {
  const [user, setUser] = useState<OfficerProfile>({
    name: 'Sushanth Singh',
    officerId: 'DEL-SUP-010124-001',
    department: 'Tourist Safety Department',
    phone: '+91 9876543200'
  });

  // State variables
  const [currentView, setCurrentView] = useState('dashboard');
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

  // Modal states for Quick Actions
  const [emergencyBroadcastOpen, setEmergencyBroadcastOpen] = useState(false);
  const [createGeofenceOpen, setCreateGeofenceOpen] = useState(false);
  const [dispatchTeamOpen, setDispatchTeamOpen] = useState(false);
  const [generateReportOpen, setGenerateReportOpen] = useState(false);

  // Data states for new features
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [efirs, setEfirs] = useState<EFIR[]>([]);

  // e-FIR states
  const [selectedEfir, setSelectedEfir] = useState<EFIR | null>(null);
  const [efirDetailOpen, setEfirDetailOpen] = useState(false);
  const [efirFilter, setEfirFilter] = useState('');
  const [efirSearchTerm, setEfirSearchTerm] = useState('');

  // Form states
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [selectedEmergencyType, setSelectedEmergencyType] = useState('general');
  const [newGeofence, setNewGeofence] = useState({
    name: '',
    type: 'safe' as 'safe' | 'restricted' | 'alert',
    description: '',
    x: 50,
    y: 50,
    radius: 10
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<OfficerProfile & {
    notificationPreferences: { [key: string]: boolean }
  }>({
    name: 'Sushanth Singh',
    officerId: 'DEL-SUP-010124-001',
    department: 'Tourist Safety Department',
    phone: '+91 9876543200',
    notificationPreferences: {
      emergency: true,
      battery: true,
      geofence: true,
      offline: true
    }
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

  // Generate FIR Number
  const generateFIRNumber = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `FIR${year}${month}${day}${random}`;
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

    // Initialize geofences
    const initialGeofences: Geofence[] = [
      {
        id: '1',
        name: 'Red Fort Safe Zone',
        type: 'safe',
        x: 35,
        y: 25,
        radius: 20,
        description: 'Protected tourist area around Red Fort',
        isActive: true
      },
      {
        id: '2',
        name: 'Construction Restricted Zone',
        type: 'restricted',
        x: 65,
        y: 45,
        radius: 15,
        description: 'Active construction area - restricted access',
        isActive: true
      },
      {
        id: '3',
        name: 'Night Market Alert Zone',
        type: 'alert',
        x: 75,
        y: 60,
        radius: 12,
        description: 'High activity area requiring monitoring',
        isActive: true
      }
    ];

    setGeofences(initialGeofences);

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

    // Initialize incidents
    const initialIncidents: Incident[] = [
      {
        id: '1',
        type: 'emergency',
        title: 'Tourist Missing in Construction Zone',
        description: 'Dhanunjay Reddy has not responded for 15 minutes in high-risk area',
        location: 'Construction Zone',
        touristId: '3',
        touristName: 'Dhanunjay Reddy',
        status: 'open',
        priority: 'critical',
        reportedAt: '2025-01-08 14:30:00',
        assignedOfficer: 'Officer Kumar'
      },
      {
        id: '2',
        type: 'medical',
        title: 'Tourist Requested Medical Assistance',
        description: 'Esha Sana reported feeling unwell at Chandni Chowk',
        location: 'Chandni Chowk',
        touristId: '2',
        touristName: 'Esha Sana',
        status: 'in-progress',
        priority: 'high',
        reportedAt: '2025-01-08 13:45:00',
        assignedOfficer: 'Officer Sharma'
      },
      {
        id: '3',
        type: 'theft',
        title: 'Wallet Theft Report',
        description: 'Tourist reported wallet stolen at Red Fort Area',
        location: 'Red Fort Area',
        touristId: '1',
        touristName: 'Jay Ram',
        status: 'resolved',
        priority: 'medium',
        reportedAt: '2025-01-08 12:15:00',
        resolvedAt: '2025-01-08 13:30:00',
        assignedOfficer: 'Officer Patel'
      }
    ];

    setIncidents(initialIncidents);

    // Initialize reports
    const initialReports: Report[] = [
      {
        id: '1',
        title: 'Daily Safety Report - January 8, 2025',
        type: 'daily',
        generatedAt: '2025-01-08 16:00:00',
        summary: '24 tourists monitored, 3 incidents reported, 2 resolved'
      },
      {
        id: '2',
        title: 'Weekly Incident Analysis',
        type: 'weekly',
        generatedAt: '2025-01-07 10:00:00',
        summary: 'Analysis of 15 incidents across 7 days with recommendations'
      },
      {
        id: '3',
        title: 'Monthly Safety Assessment',
        type: 'monthly',
        generatedAt: '2025-01-01 09:00:00',
        summary: 'Comprehensive safety analysis for December 2024'
      }
    ];

    setReports(initialReports);

    // Initialize e-FIRs with generated FIR numbers
    const initialEfirs: EFIR[] = [
      {
        id: '1',
        firNumber: generateFIRNumber(),
        complainantName: 'Geethika Dasari',
        complainantPhone: '+91 9876543216',
        complainantEmail: 'geethika@email.com',
        complainantAddress: 'Hyderabad, Telangana',
        incidentType: 'theft',
        incidentDate: '2025-01-08',
        incidentTime: '14:30',
        incidentLocation: 'Red Fort, Delhi',
        description: 'My wallet containing cash, credit cards, and ID was stolen while visiting Red Fort. The incident occurred near the main entrance around 2:30 PM.',
        evidenceFiles: ['wallet_photo.jpg', 'location_screenshot.png'],
        witnessDetails: 'Security guard at entrance gate witnessed the incident',
        status: 'submitted',
        priority: 'medium',
        submittedAt: '2025-01-08 15:00:00',
        updatedAt: '2025-01-08 15:00:00',
        digitalId: 'DEL13092025-0045'
      },
      {
        id: '2',
        firNumber: generateFIRNumber(),
        complainantName: 'Jay Ram',
        complainantPhone: '+91 9876543210',
        complainantEmail: 'jayram@email.com',
        complainantAddress: 'Mumbai, Maharashtra',
        incidentType: 'harassment',
        incidentDate: '2025-01-08',
        incidentTime: '16:00',
        incidentLocation: 'Chandni Chowk, Delhi',
        description: 'Faced verbal harassment and inappropriate behavior from local vendors while shopping at Chandni Chowk market.',
        evidenceFiles: ['audio_recording.mp3'],
        witnessDetails: 'Other tourists present at the scene',
        status: 'under-review',
        priority: 'high',
        assignedOfficer: 'Officer Sharma',
        submittedAt: '2025-01-08 16:30:00',
        updatedAt: '2025-01-08 17:00:00',
        digitalId: 'RFA13092025-0001'
      },
      {
        id: '3',
        firNumber: generateFIRNumber(),
        complainantName: 'Sarah Gupta',
        complainantPhone: '+91 9876543213',
        complainantEmail: 'sarah@email.com',
        complainantAddress: 'Bangalore, Karnataka',
        incidentType: 'fraud',
        incidentDate: '2025-01-07',
        incidentTime: '12:00',
        incidentLocation: 'India Gate, Delhi',
        description: 'Was charged excessive amount by auto-rickshaw driver and given fake currency as change.',
        evidenceFiles: ['receipt.jpg', 'fake_note.jpg'],
        witnessDetails: 'None',
        status: 'investigating',
        priority: 'medium',
        assignedOfficer: 'Officer Kumar',
        submittedAt: '2025-01-07 13:00:00',
        updatedAt: '2025-01-08 10:00:00',
        digitalId: 'LTM13092025-0004'
      }
    ];

    setEfirs(initialEfirs);

    // Initialize settings form with user data
    setSettingsForm(prev => ({
      ...prev,
      ...user
    }));

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
    { time: '06:00', tourists: 120, incidents: 2, alerts: 5 },
    { time: '08:00', tourists: 250, incidents: 1, alerts: 3 },
    { time: '10:00', tourists: 380, incidents: 4, alerts: 8 },
    { time: '12:00', tourists: 450, incidents: 3, alerts: 6 },
    { time: '14:00', tourists: 420, incidents: 5, alerts: 12 },
    { time: '16:00', tourists: 390, incidents: 2, alerts: 4 },
    { time: '18:00', tourists: 320, incidents: 1, alerts: 2 },
    { time: '20:00', tourists: 180, incidents: 0, alerts: 1 }
  ];

  const incidentData = [
    { name: 'Safe', value: 75, color: '#10B981' },
    { name: 'Caution', value: 20, color: '#F59E0B' },
    { name: 'Danger', value: 5, color: '#EF4444' }
  ];

  const responseTimeData = [
    { day: 'Mon', time: 2.5 },
    { day: 'Tue', time: 1.8 },
    { day: 'Wed', time: 2.2 },
    { day: 'Thu', time: 1.9 },
    { day: 'Fri', time: 2.8 },
    { day: 'Sat', time: 2.1 },
    { day: 'Sun', time: 2.3 }
  ];

  const incidentTypeData = [
    { type: 'Medical', count: 8, color: '#EF4444' },
    { type: 'Theft', count: 5, color: '#F59E0B' },
    { type: 'Lost', count: 12, color: '#3B82F6' },
    { type: 'Harassment', count: 3, color: '#8B5CF6' },
    { type: 'Emergency', count: 2, color: '#DC2626' }
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

  // Filter e-FIRs
  const filteredEfirs = efirs.filter(efir => {
    const matchesStatusFilter = efirFilter ? efir.status === efirFilter : true;
    const matchesSearchTerm = efir.firNumber.toLowerCase().includes(efirSearchTerm.toLowerCase()) ||
                              efir.complainantName.toLowerCase().includes(efirSearchTerm.toLowerCase()) ||
                              efir.incidentType.toLowerCase().includes(efirSearchTerm.toLowerCase()) ||
                              efir.incidentLocation.toLowerCase().includes(efirSearchTerm.toLowerCase());
    return matchesStatusFilter && matchesSearchTerm;
  });

  // Event handlers for Quick Actions
  const handleEmergencyBroadcast = () => {
    if (!emergencyMessage.trim()) return;

    // Add notification for emergency broadcast
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: 'alert',
      title: 'Emergency Broadcast Sent',
      message: `${selectedEmergencyType.toUpperCase()}: ${emergencyMessage}`,
      time: 'Just now',
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setEmergencyMessage('');
    setEmergencyBroadcastOpen(false);

    alert(`Emergency broadcast sent to ${liveUsers.length} tourists!`);
  };

  const handleCreateGeofence = () => {
    if (!newGeofence.name.trim()) return;

    const geofence: Geofence = {
      id: Date.now().toString(),
      ...newGeofence,
      isActive: true
    };

    setGeofences(prev => [...prev, geofence]);
    setNewGeofence({
      name: '',
      type: 'safe',
      description: '',
      x: 50,
      y: 50,
      radius: 10
    });
    setCreateGeofenceOpen(false);

    alert(`Geofence "${geofence.name}" created successfully!`);
  };

  const handleDispatchTeam = (location: string, urgency: string) => {
    const newIncident: Incident = {
      id: Date.now().toString(),
      type: 'emergency',
      title: `Team Dispatched to ${location}`,
      description: `Emergency response team dispatched with ${urgency} priority`,
      location: location,
      touristId: '',
      touristName: 'N/A',
      status: 'in-progress',
      priority: urgency as 'low' | 'medium' | 'high' | 'critical',
      reportedAt: new Date().toISOString(),
      assignedOfficer: user.name
    };

    setIncidents(prev => [newIncident, ...prev]);
    setDispatchTeamOpen(false);

    alert(`Emergency team dispatched to ${location}!`);
  };

  const handleGenerateReport = (reportType: string) => {
    const newReport: Report = {
      id: Date.now().toString(),
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type: reportType as 'daily' | 'weekly' | 'monthly' | 'incident' | 'safety',
      generatedAt: new Date().toISOString(),
      summary: `Generated ${reportType} report with current data analysis`
    };

    setReports(prev => [newReport, ...prev]);
    setGenerateReportOpen(false);

    // Simulate report generation and download
    setTimeout(() => {
      alert(`Report generated successfully! Download started.`);
      // In a real app, this would trigger actual file download
    }, 1000);
  };

  // e-FIR handlers
  const handleEfirStatusUpdate = (efirId: string, newStatus: EFIR['status']) => {
    setEfirs(prev => prev.map(efir => 
      efir.id === efirId 
        ? { ...efir, status: newStatus, updatedAt: new Date().toISOString() }
        : efir
    ));
  };

  const handleAssignEfir = (efirId: string, officer: string) => {
    setEfirs(prev => prev.map(efir => 
      efir.id === efirId 
        ? { ...efir, assignedOfficer: officer, updatedAt: new Date().toISOString() }
        : efir
    ));
  };

  const handleEfirClick = (efir: EFIR) => {
    setSelectedEfir(efir);
    setEfirDetailOpen(true);
  };

  // Settings save handler
  const handleSaveSettings = () => {
    // Update user profile
    setUser({
      name: settingsForm.name,
      officerId: settingsForm.officerId,
      department: settingsForm.department,
      phone: settingsForm.phone
    });

    // Save monitoring settings to localStorage
    localStorage.setItem('monitoringSettings', JSON.stringify(monitoringSettings));
    localStorage.setItem('notificationPreferences', JSON.stringify(settingsForm.notificationPreferences));
    localStorage.setItem('darkMode', isDarkMode.toString());

    // Create success notification
    const successNotification: Notification = {
      id: Date.now().toString(),
      type: 'info',
      title: 'Settings Saved',
      message: 'Your preferences have been saved successfully',
      time: 'Just now',
      isRead: false
    };

    setNotifications(prev => [successNotification, ...prev]);

    alert('Settings saved successfully!');
  };

  // Event handlers for Dashboard Cards
  const handleActiveToursitsClick = () => {
    setCurrentView('tourists');
    setRiskFilter('');
    setSearchTerm('');
  };

  const handleHighRiskAlertsClick = () => {
    setCurrentView('tourists');
    setRiskFilter('High');
  };

  const handleRiskZonesClick = () => {
    setCurrentView('analytics');
  };

  const handleResponseTimeClick = () => {
    setCurrentView('analytics');
  };

  // Navigation handlers
  const handleNavigationClick = (view: string) => {
    setCurrentView(view);
  };

  // Other event handlers
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

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getEfirStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case 'theft': return '💰';
      case 'fraud': return '🎭';
      case 'harassment': return '⚠️';
      case 'assault': return '🚨';
      case 'cybercrime': return '💻';
      default: return '📋';
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

  // Render different views based on currentView
  const renderCurrentView = () => {
    switch (currentView) {
      case 'efir':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>e-FIR Management</h3>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary} w-4 h-4`} />
                    <input
                      type="text"
                      placeholder="Search e-FIRs..."
                      value={efirSearchTerm}
                      onChange={(e) => setEfirSearchTerm(e.target.value)}
                      className={`pl-10 pr-4 py-2 ${themeClasses.border} border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${themeClasses.cardBg} ${themeClasses.text}`}
                    />
                  </div>
                  <select 
                    value={efirFilter}
                    onChange={(e) => setEfirFilter(e.target.value)}
                    className={`px-4 py-2 ${themeClasses.border} border rounded-lg ${themeClasses.cardBg} ${themeClasses.text}`}
                  >
                    <option value="">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="under-review">Under Review</option>
                    <option value="investigating">Investigating</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>FIR Number</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Complainant</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Incident Type</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Location</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Status</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Priority</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Submitted</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${themeClasses.cardBg} divide-y ${themeClasses.border}`}>
                    {filteredEfirs.map((efir) => (
                      <tr key={efir.id} className={`${themeClasses.hover} cursor-pointer`} onClick={() => handleEfirClick(efir)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Hash className="w-4 h-4 text-orange-500 mr-2" />
                            <span className={`font-mono text-sm ${themeClasses.text}`}>{efir.firNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className={`font-medium ${themeClasses.text}`}>{efir.complainantName}</div>
                            <div className={`text-sm ${themeClasses.textSecondary}`}>{efir.complainantPhone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{getIncidentTypeIcon(efir.incidentType)}</span>
                            <span className={`text-sm capitalize ${themeClasses.text}`}>{efir.incidentType}</span>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${themeClasses.text}`}>{efir.incidentLocation}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEfirStatusColor(efir.status)}`}>
                            {efir.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(efir.priority)}`}>
                            {efir.priority}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${themeClasses.textSecondary}`}>
                          {new Date(efir.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEfirClick(efir);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              View
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignEfir(efir.id, user.name);
                              }}
                              className="text-orange-600 hover:text-orange-700 text-sm"
                            >
                              Assign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* e-FIR Statistics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>Total e-FIRs</p>
                    <p className={`text-3xl font-bold ${themeClasses.text}`}>{efirs.length}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>Pending Review</p>
                    <p className={`text-3xl font-bold ${themeClasses.text}`}>
                      {efirs.filter(e => e.status === 'submitted' || e.status === 'under-review').length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>Under Investigation</p>
                    <p className={`text-3xl font-bold ${themeClasses.text}`}>
                      {efirs.filter(e => e.status === 'investigating').length}
                    </p>
                  </div>
                  <Search className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>Closed Cases</p>
                    <p className={`text-3xl font-bold ${themeClasses.text}`}>
                      {efirs.filter(e => e.status === 'closed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Generated Reports</h3>
                <button
                  onClick={() => setGenerateReportOpen(true)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Generate New Report
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <div key={report.id} className={`p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <FileText className="w-8 h-8 text-orange-600" />
                      <div>
                        <h4 className={`font-semibold ${themeClasses.text}`}>{report.title}</h4>
                        <p className={`text-sm ${themeClasses.textSecondary} capitalize`}>{report.type} Report</p>
                      </div>
                    </div>
                    <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>{report.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${themeClasses.textSecondary}`}>
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </span>
                      <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Statistics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Report Generation Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { type: 'Daily', count: 30 },
                    { type: 'Weekly', count: 12 },
                    { type: 'Monthly', count: 3 },
                    { type: 'Incident', count: 25 },
                    { type: 'Safety', count: 8 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="type" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        color: isDarkMode ? '#ffffff' : '#000000'
                      }}
                    />
                    <Bar dataKey="count" fill="#ea580c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Report Summary</h3>
                <div className="space-y-4">
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={themeClasses.text}>Total Reports Generated</span>
                      <span className="text-2xl font-bold text-orange-600">{reports.length}</span>
                    </div>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>This month</p>
                  </div>
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={themeClasses.text}>Most Common Type</span>
                      <span className="text-lg font-semibold text-blue-600">Daily Reports</span>
                    </div>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>Generated automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'incidents':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Incident Management</h3>
                <div className="flex space-x-2">
                  <select className={`px-4 py-2 ${themeClasses.border} border rounded-lg ${themeClasses.cardBg} ${themeClasses.text}`}>
                    <option>All Statuses</option>
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                  <select className={`px-4 py-2 ${themeClasses.border} border rounded-lg ${themeClasses.cardBg} ${themeClasses.text}`}>
                    <option>All Priorities</option>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Incident</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Tourist</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Location</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Status</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Priority</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Reported</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeClasses.textSecondary} uppercase`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${themeClasses.cardBg} divide-y ${themeClasses.border}`}>
                    {incidents.map((incident) => (
                      <tr key={incident.id} className={themeClasses.hover}>
                        <td className="px-6 py-4">
                          <div>
                            <div className={`font-medium ${themeClasses.text}`}>{incident.title}</div>
                            <div className={`text-sm ${themeClasses.textSecondary} capitalize`}>{incident.type}</div>
                          </div>
                        </td>
                        <td className={`px-6 py-4 text-sm ${themeClasses.text}`}>{incident.touristName}</td>
                        <td className={`px-6 py-4 text-sm ${themeClasses.text}`}>{incident.location}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getIncidentStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(incident.priority)}`}>
                            {incident.priority}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${themeClasses.textSecondary}`}>
                          {new Date(incident.reportedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-700 text-sm">View</button>
                            <button className="text-orange-600 hover:text-orange-700 text-sm">Update</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Incident Statistics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Incident Types Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incidentTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {incidentTypeData.map((entry, index) => (
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
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {incidentTypeData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className={`text-sm ${themeClasses.textSecondary}`}>
                        {item.type}: {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Resolution Statistics</h3>
                <div className="space-y-4">
                  <div className={`p-4 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <span className={themeClasses.text}>Resolved Today</span>
                      <span className="text-2xl font-bold text-green-600">
                        {incidents.filter(i => i.status === 'resolved').length}
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'} rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <span className={themeClasses.text}>In Progress</span>
                      <span className="text-2xl font-bold text-yellow-600">
                        {incidents.filter(i => i.status === 'in-progress').length}
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg`}>
                    <div className="flex items-center justify-between">
                      <span className={themeClasses.text}>Open Incidents</span>
                      <span className="text-2xl font-bold text-red-600">
                        {incidents.filter(i => i.status === 'open').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Comprehensive Analytics Dashboard */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>Average Response Time</p>
                    <p className={`text-3xl font-bold ${themeClasses.text}`}>2.3m</p>
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      15% better than last week
                    </p>
                  </div>
                  <Clock3 className="w-8 h-8 text-orange-600" />
                </div>
              </div>

              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>Incident Resolution Rate</p>
                    <p className={`text-3xl font-bold ${themeClasses.text}`}>94%</p>
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Above target (90%)
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>Tourist Satisfaction</p>
                    <p className={`text-3xl font-bold ${themeClasses.text}`}>4.8/5</p>
                    <p className="text-green-600 text-sm flex items-center mt-1">
                      <UserCheck className="w-4 h-4 mr-1" />
                      Excellent rating
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Weekly Response Time Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="day" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
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
                      dataKey="time" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
                <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Activity & Incidents Correlation</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={activityData}>
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
                    <Area type="monotone" dataKey="tourists" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="incidents" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Zone Analytics */}
            <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Risk Zone Performance</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {riskZones.map((zone) => (
                  <div key={zone.id} className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-semibold ${themeClasses.text}`}>{zone.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor((zone.level.charAt(0).toUpperCase() + zone.level.slice(1)) as 'Low' | 'Medium' | 'High')}`}>
                        {zone.level.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-sm ${themeClasses.textSecondary}`}>Incidents:</span>
                        <span className={`font-medium ${zone.incidentCount > 2 ? 'text-red-600' : 'text-green-600'}`}>
                          {zone.incidentCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${themeClasses.textSecondary}`}>Tourists:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {liveUsers.filter(user => 
                            Math.sqrt(Math.pow(user.x - zone.x, 2) + Math.pow(user.y - zone.y, 2)) < zone.radius
                          ).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${zone.level === 'high' ? 'bg-red-600' : zone.level === 'medium' ? 'bg-yellow-600' : 'bg-green-600'}`}
                          style={{ width: `${100 - (zone.incidentCount * 20)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Geofence Management */}
            <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Active Geofences</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {geofences.map((geofence) => (
                  <div key={geofence.id} className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-semibold ${themeClasses.text}`}>{geofence.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          geofence.type === 'safe' ? 'bg-green-100 text-green-800' :
                          geofence.type === 'restricted' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {geofence.type}
                        </span>
                        {geofence.isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm ${themeClasses.textSecondary} mb-3`}>{geofence.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-sm ${themeClasses.textSecondary}`}>Radius:</span>
                        <span className={`text-sm font-medium ${themeClasses.text}`}>{geofence.radius} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${themeClasses.textSecondary}`}>Status:</span>
                        <span className={`text-sm font-medium ${geofence.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {geofence.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-colors duration-300`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-6`}>Officer Settings</h3>

              {/* Officer Information */}
              <div className="space-y-6">
                <div>
                  <h4 className={`text-lg font-medium ${themeClasses.text} mb-4`}>Profile Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Full Name</label>
                      <input
                        type="text"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text} focus:ring-orange-500 focus:border-orange-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Officer ID</label>
                      <input
                        type="text"
                        value={settingsForm.officerId}
                        className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text} bg-gray-100 cursor-not-allowed`}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Department</label>
                      <input
                        type="text"
                        value={settingsForm.department}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, department: e.target.value }))}
                        className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text} focus:ring-orange-500 focus:border-orange-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Phone Number</label>
                      <input
                        type="tel"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text} focus:ring-orange-500 focus:border-orange-500`}
                      />
                    </div>
                  </div>
                </div>

                {/* Monitoring Preferences */}
                <div className={`${themeClasses.border} border-t pt-6`}>
                  <h4 className={`text-lg font-medium ${themeClasses.text} mb-4`}>Monitoring Preferences</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Default Monitoring Range (km)</label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={monitoringSettings.range}
                        onChange={(e) => updateMonitoringSettings({
                          ...monitoringSettings,
                          range: parseInt(e.target.value)
                        })}
                        className="w-full accent-orange-600"
                      />
                      <div className="flex justify-between text-xs text-orange-600 mt-1">
                        <span>1km</span>
                        <span>{monitoringSettings.range}km</span>
                        <span>50km</span>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Primary Location</label>
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
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className={`${themeClasses.border} border-t pt-6`}>
                  <h4 className={`text-lg font-medium ${themeClasses.text} mb-4`}>Notification Settings</h4>
                  <div className="space-y-4">
                    {[
                      { id: 'emergency', label: 'Emergency Alerts', description: 'Critical incidents requiring immediate attention' },
                      { id: 'battery', label: 'Low Battery Warnings', description: 'Tourist device battery below 20%' },
                      { id: 'geofence', label: 'Geofence Violations', description: 'Tourist entering/leaving designated areas' },
                      { id: 'offline', label: 'Offline Notifications', description: 'Tourist goes offline for extended periods' }
                    ].map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${themeClasses.text}`}>{setting.label}</p>
                          <p className={`text-sm ${themeClasses.textSecondary}`}>{setting.description}</p>
                        </div>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settingsForm.notificationPreferences[setting.id]}
                            onChange={(e) => setSettingsForm(prev => ({
                              ...prev,
                              notificationPreferences: {
                                ...prev.notificationPreferences,
                                [setting.id]: e.target.checked
                              }
                            }))}
                            className="sr-only"
                          />
                          <div className={`relative w-14 h-8 rounded-full transition-colors ${settingsForm.notificationPreferences[setting.id] ? 'bg-orange-600' : 'bg-gray-300'}`}>
                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settingsForm.notificationPreferences[setting.id] ? 'transform translate-x-6' : ''}`}></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className={`${themeClasses.border} border-t pt-6`}>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleSaveSettings}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Settings</span>
                    </button>
                    <span className={`text-sm ${themeClasses.textSecondary}`}>
                      All changes will be saved and applied immediately
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tourists':
        // This will show the tourist monitoring table (filtered view if needed)
        return (
          <div className="space-y-6">
            {/* Tourist Monitoring Table */}
            <div className={`${themeClasses.cardBg} rounded-xl shadow-sm transition-colors duration-300`}>
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
          </div>
        );

      default:
        // Default dashboard view with tourist table included
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105`}
                onClick={handleActiveToursitsClick}
              >
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

              <div 
                className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105`}
                onClick={handleHighRiskAlertsClick}
              >
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

              <div 
                className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105`}
                onClick={handleRiskZonesClick}
              >
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

              <div 
                className={`${themeClasses.cardBg} rounded-xl p-6 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105`}
                onClick={handleResponseTimeClick}
              >
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
                    <button 
                      onClick={() => setEmergencyBroadcastOpen(true)}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Emergency Broadcast</span>
                    </button>
                    <button 
                      onClick={() => setCreateGeofenceOpen(true)}
                      className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Target className="w-4 h-4" />
                      <span>Create Geofence</span>
                    </button>
                    <button 
                      onClick={() => setDispatchTeamOpen(true)}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Dispatch Team</span>
                    </button>
                    <button 
                      onClick={() => setGenerateReportOpen(true)}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
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
                    <button 
                      onClick={() => setCurrentView('analytics')}
                      className="w-full text-orange-600 hover:text-orange-800 text-sm font-medium"
                    >
                      View All Zones →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tourist Monitoring Table - Added to Live Dashboard */}
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
          </>
        );
    }
  };

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
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-orange-100">Officer ID: {user.officerId}</p>
                <p className="text-orange-100">{user.department}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-orange-100">Contact</p>
              <p className="font-semibold">{user.phone}</p>
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
              <button 
                onClick={() => handleNavigationClick('dashboard')}
                className={`pb-2 px-1 font-medium transition-colors ${
                  currentView === 'dashboard' 
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : `${themeClasses.textSecondary} hover:text-orange-600`
                }`}
              >
                Live Dashboard
              </button>
              <button 
                onClick={() => handleNavigationClick('efir')}
                className={`pb-2 px-1 transition-colors ${
                  currentView === 'efir' 
                    ? 'text-orange-600 border-b-2 border-orange-600 font-medium'
                    : `${themeClasses.textSecondary} hover:text-orange-600`
                }`}
              >
                e-FIR
              </button>
              <button 
                onClick={() => handleNavigationClick('reports')}
                className={`pb-2 px-1 transition-colors ${
                  currentView === 'reports' 
                    ? 'text-orange-600 border-b-2 border-orange-600 font-medium'
                    : `${themeClasses.textSecondary} hover:text-orange-600`
                }`}
              >
                Reports
              </button>
              <button 
                onClick={() => handleNavigationClick('incidents')}
                className={`pb-2 px-1 transition-colors ${
                  currentView === 'incidents' 
                    ? 'text-orange-600 border-b-2 border-orange-600 font-medium'
                    : `${themeClasses.textSecondary} hover:text-orange-600`
                }`}
              >
                Incidents
              </button>
              <button 
                onClick={() => handleNavigationClick('analytics')}
                className={`pb-2 px-1 transition-colors ${
                  currentView === 'analytics' 
                    ? 'text-orange-600 border-b-2 border-orange-600 font-medium'
                    : `${themeClasses.textSecondary} hover:text-orange-600`
                }`}
              >
                Analytics
              </button>
              <button 
                onClick={() => handleNavigationClick('settings')}
                className={`pb-2 px-1 transition-colors ${
                  currentView === 'settings' 
                    ? 'text-orange-600 border-b-2 border-orange-600 font-medium'
                    : `${themeClasses.textSecondary} hover:text-orange-600`
                }`}
              >
                Settings
              </button>
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

        {/* Render current view */}
        {renderCurrentView()}

        {/* e-FIR Detail Modal */}
        {efirDetailOpen && selectedEfir && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`${themeClasses.cardBg} rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-2xl font-semibold ${themeClasses.text}`}>e-FIR Details</h3>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>FIR Number: {selectedEfir.firNumber}</p>
                </div>
                <button
                  onClick={() => setEfirDetailOpen(false)}
                  className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                >
                  <X className={`w-6 h-6 ${themeClasses.textSecondary}`} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Complainant Information */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Complainant Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Name</label>
                      <p className={`font-medium ${themeClasses.text}`}>{selectedEfir.complainantName}</p>
                    </div>
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Phone</label>
                      <p className={`font-medium ${themeClasses.text}`}>{selectedEfir.complainantPhone}</p>
                    </div>
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Email</label>
                      <p className={`font-medium ${themeClasses.text}`}>{selectedEfir.complainantEmail}</p>
                    </div>
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Address</label>
                      <p className={`font-medium ${themeClasses.text}`}>{selectedEfir.complainantAddress}</p>
                    </div>
                    {selectedEfir.digitalId && (
                      <div>
                        <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Digital ID</label>
                        <p className={`font-mono text-sm ${themeClasses.text} bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded`}>
                          {selectedEfir.digitalId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Incident Information */}
                <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>Incident Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Type</label>
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getIncidentTypeIcon(selectedEfir.incidentType)}</span>
                        <p className={`font-medium capitalize ${themeClasses.text}`}>{selectedEfir.incidentType}</p>
                      </div>
                    </div>
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Date & Time</label>
                      <p className={`font-medium ${themeClasses.text}`}>
                        {new Date(selectedEfir.incidentDate).toLocaleDateString()} at {selectedEfir.incidentTime}
                      </p>
                    </div>
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Location</label>
                      <p className={`font-medium ${themeClasses.text}`}>{selectedEfir.incidentLocation}</p>
                    </div>
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEfirStatusColor(selectedEfir.status)}`}>
                        {selectedEfir.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div>
                      <label className={`text-sm font-medium ${themeClasses.textSecondary}`}>Priority</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedEfir.priority)}`}>
                        {selectedEfir.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Incident Description</h4>
                <p className={`${themeClasses.text} leading-relaxed`}>{selectedEfir.description}</p>
              </div>

              {/* Evidence & Witnesses */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Evidence Files</h4>
                  {selectedEfir.evidenceFiles.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEfir.evidenceFiles.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span className={`text-sm ${themeClasses.text}`}>{file}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${themeClasses.textSecondary}`}>No evidence files uploaded</p>
                  )}
                </div>

                <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Witness Details</h4>
                  <p className={`text-sm ${themeClasses.text}`}>
                    {selectedEfir.witnessDetails || 'No witness information provided'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Update Status</label>
                    <select
                      value={selectedEfir.status}
                      onChange={(e) => handleEfirStatusUpdate(selectedEfir.id, e.target.value as EFIR['status'])}
                      className={`px-3 py-2 ${themeClasses.border} border rounded-lg ${themeClasses.cardBg} ${themeClasses.text}`}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under-review">Under Review</option>
                      <option value="investigating">Investigating</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>Assign Officer</label>
                    <input
                      type="text"
                      value={selectedEfir.assignedOfficer || ''}
                      onChange={(e) => handleAssignEfir(selectedEfir.id, e.target.value)}
                      placeholder="Officer name"
                      className={`px-3 py-2 ${themeClasses.border} border rounded-lg ${themeClasses.cardBg} ${themeClasses.text}`}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => window.open(`tel:${selectedEfir.complainantPhone}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Complainant</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className={`mt-6 p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Timeline</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className={`text-sm ${themeClasses.text}`}>
                      Submitted: {new Date(selectedEfir.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className={`text-sm ${themeClasses.text}`}>
                      Last Updated: {new Date(selectedEfir.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* Emergency Broadcast Modal */}
        {emergencyBroadcastOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${themeClasses.cardBg} rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Emergency Broadcast</h3>
                <button
                  onClick={() => setEmergencyBroadcastOpen(false)}
                  className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                >
                  <X className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Alert Type
                  </label>
                  <select
                    value={selectedEmergencyType}
                    onChange={(e) => setSelectedEmergencyType(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text}`}
                  >
                    <option value="general">General Alert</option>
                    <option value="weather">Weather Warning</option>
                    <option value="security">Security Alert</option>
                    <option value="evacuation">Evacuation Notice</option>
                    <option value="medical">Medical Emergency</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Message
                  </label>
                  <textarea
                    value={emergencyMessage}
                    onChange={(e) => setEmergencyMessage(e.target.value)}
                    placeholder="Enter emergency message..."
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text} resize-none`}
                  />
                </div>

                <div className={`p-3 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg`}>
                  <p className="text-red-600 text-sm">
                    This will send an immediate alert to all {liveUsers.length} active tourists.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setEmergencyBroadcastOpen(false)}
                    className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.text} hover:${themeClasses.hover} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmergencyBroadcast}
                    disabled={!emergencyMessage.trim()}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Send Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Geofence Modal */}
        {createGeofenceOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${themeClasses.cardBg} rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Create Geofence</h3>
                <button
                  onClick={() => setCreateGeofenceOpen(false)}
                  className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                >
                  <X className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Zone Name
                  </label>
                  <input
                    type="text"
                    value={newGeofence.name}
                    onChange={(e) => setNewGeofence({...newGeofence, name: e.target.value})}
                    placeholder="Enter zone name..."
                    className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Zone Type
                  </label>
                  <select
                    value={newGeofence.type}
                    onChange={(e) => setNewGeofence({...newGeofence, type: e.target.value as 'safe' | 'restricted' | 'alert'})}
                    className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text}`}
                  >
                    <option value="safe">Safe Zone</option>
                    <option value="restricted">Restricted Zone</option>
                    <option value="alert">Alert Zone</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Description
                  </label>
                  <textarea
                    value={newGeofence.description}
                    onChange={(e) => setNewGeofence({...newGeofence, description: e.target.value})}
                    placeholder="Describe the zone purpose..."
                    rows={3}
                    className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text} resize-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Radius: {newGeofence.radius} units
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={newGeofence.radius}
                    onChange={(e) => setNewGeofence({...newGeofence, radius: parseInt(e.target.value)})}
                    className="w-full accent-orange-600"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setCreateGeofenceOpen(false)}
                    className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.text} hover:${themeClasses.hover} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGeofence}
                    disabled={!newGeofence.name.trim()}
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Create Zone
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dispatch Team Modal */}
        {dispatchTeamOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${themeClasses.cardBg} rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Dispatch Emergency Team</h3>
                <button
                  onClick={() => setDispatchTeamOpen(false)}
                  className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                >
                  <X className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Location
                  </label>
                  <select className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.cardBg} ${themeClasses.text}`}>
                    <option value="Red Fort Area">Red Fort Area</option>
                    <option value="Chandni Chowk">Chandni Chowk</option>
                    <option value="Construction Zone">Construction Zone</option>
                    <option value="Lotus Temple">Lotus Temple</option>
                    <option value="India Gate">India Gate</option>
                    <option value="Market Area">Market Area</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['low', 'medium', 'high', 'critical'].map((level) => (
                      <button
                        key={level}
                        className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                          level === 'critical' ? 'bg-red-600 text-white border-red-600' :
                          level === 'high' ? 'bg-orange-600 text-white border-orange-600' :
                          level === 'medium' ? 'bg-yellow-600 text-white border-yellow-600' :
                          'bg-green-600 text-white border-green-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`p-3 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-lg`}>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className={`text-sm ${themeClasses.text}`}>Available Teams: 4</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock3 className="w-4 h-4 text-blue-600" />
                    <span className={`text-sm ${themeClasses.textSecondary}`}>Estimated Response: 3-5 minutes</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setDispatchTeamOpen(false)}
                    className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.text} hover:${themeClasses.hover} transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDispatchTeam('Red Fort Area', 'high')}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Dispatch Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Report Modal */}
        {generateReportOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${themeClasses.cardBg} rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${themeClasses.text}`}>Generate Report</h3>
                <button
                  onClick={() => setGenerateReportOpen(false)}
                  className={`p-2 rounded-lg ${themeClasses.hover} transition-colors`}
                >
                  <X className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Report Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { type: 'daily', label: 'Daily Report', desc: 'Today\'s tourist activity and incidents' },
                      { type: 'weekly', label: 'Weekly Report', desc: 'Past 7 days summary' },
                      { type: 'monthly', label: 'Monthly Report', desc: 'Comprehensive monthly analysis' },
                      { type: 'incident', label: 'Incident Report', desc: 'Detailed incident analysis' },
                      { type: 'safety', label: 'Safety Assessment', desc: 'Risk zones and safety metrics' }
                    ].map((report) => (
                      <button
                        key={report.type}
                        onClick={() => handleGenerateReport(report.type)}
                        className={`w-full text-left p-3 rounded-lg border ${themeClasses.border} ${themeClasses.hover} transition-colors`}
                      >
                        <div className={`font-medium ${themeClasses.text}`}>{report.label}</div>
                        <div className={`text-sm ${themeClasses.textSecondary}`}>{report.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setGenerateReportOpen(false)}
                  className={`w-full px-4 py-2 rounded-lg ${themeClasses.border} border ${themeClasses.text} hover:${themeClasses.hover} transition-colors`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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