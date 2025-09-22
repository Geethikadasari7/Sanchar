import React, { useState } from 'react';
import { ArrowLeft, FileText, Camera, Mic, MapPin, AlertTriangle, CheckCircle, Trash2, Sun, Moon, Eye, Download, Search, Filter, Calendar, User, Phone, Navigation2, Shield, Scale, Car, Monitor, UserX, ClipboardList } from 'lucide-react';

interface EFirDashboardProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

interface IncidentType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Evidence {
  id: string;
  type: 'photo' | 'audio' | 'document';
  name: string;
  size: string;
  url?: string;
}

interface SubmittedComplaint {
  id: string;
  firNumber: string;
  incidentType: string;
  date: string;
  time: string;
  status: 'submitted' | 'under_review' | 'investigating' | 'resolved' | 'closed';
  location: string;
  description: string;
  complainantName: string;
  complainantPhone: string;
  submissionDate: string;
  lastUpdate: string;
  investigatingOfficer?: string;
  evidenceCount: number;
}

const EFirDashboard: React.FC<EFirDashboardProps> = ({ onBack, isDarkMode: propIsDarkMode = false }) => {
  const [isDarkMode, setIsDarkMode] = useState(propIsDarkMode);
  const [currentView, setCurrentView] = useState<'file_fir' | 'my_complaints'>('file_fir');
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<SubmittedComplaint | null>(null);
  
  const [formData, setFormData] = useState({
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    description: '',
    suspectDetails: '',
    witnessDetails: '',
    complainantName: '',
    complainantPhone: '',
    complainantAddress: '',
    complainantEmail: ''
  });
  
  const [evidenceFiles, setEvidenceFiles] = useState<Evidence[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firNumber, setFirNumber] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Sample submitted complaint data - only one complaint
  const [submittedComplaints] = useState<SubmittedComplaint[]>([
    {
      id: '1',
      firNumber: 'FIR20241001',
      incidentType: 'Theft',
      date: '2024-01-15',
      time: '14:30',
      status: 'investigating',
      location: 'Connaught Place, New Delhi',
      description: 'Mobile phone stolen from my bag while traveling in metro. The incident occurred during rush hour when the train was overcrowded. A person bumped into me and when I reached my destination, I realized my phone was missing from my bag.',
      complainantName: 'Rajesh Kumar',
      complainantPhone: '+91 98765 43210',
      submissionDate: '2024-01-15',
      lastUpdate: '2024-01-18',
      investigatingOfficer: 'SI Amit Sharma',
      evidenceCount: 3
    }
  ]);

  const incidentTypes: IncidentType[] = [
    { 
      id: 'theft', 
      name: 'Theft', 
      description: 'Stolen belongings, pickpocketing', 
      icon: <Shield className="w-8 h-8 text-blue-600" />
    },
    { 
      id: 'fraud', 
      name: 'Fraud', 
      description: 'Credit card fraud, scams', 
      icon: <Scale className="w-8 h-8 text-purple-600" />
    },
    { 
      id: 'assault', 
      name: 'Assault', 
      description: 'Physical or verbal assault', 
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />
    },
    { 
      id: 'harassment', 
      name: 'Harassment', 
      description: 'Sexual or mental harassment', 
      icon: <UserX className="w-8 h-8 text-orange-600" />
    },
    { 
      id: 'accident', 
      name: 'Accident', 
      description: 'Road accident, injury', 
      icon: <Car className="w-8 h-8 text-yellow-600" />
    },
    { 
      id: 'cybercrime', 
      name: 'Cyber Crime', 
      description: 'Online fraud, hacking', 
      icon: <Monitor className="w-8 h-8 text-green-600" />
    },
    { 
      id: 'other', 
      name: 'Other', 
      description: 'Any other incident', 
      icon: <ClipboardList className="w-8 h-8 text-gray-600" />
    }
  ];

  const steps = [
    { number: 1, title: 'Incident Type', description: 'Select type of incident' },
    { number: 2, title: 'Incident Details', description: 'Provide incident information' },
    { number: 3, title: 'Personal Details', description: 'Your contact information' },
    { number: 4, title: 'Evidence', description: 'Upload photos, documents' },
    { number: 5, title: 'Review & Submit', description: 'Review and submit FIR' }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      investigating: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getStatusText = (status: string) => {
    const statusTexts: { [key: string]: string } = {
      submitted: 'Submitted',
      under_review: 'Under Review',
      investigating: 'Investigating',
      resolved: 'Resolved',
      closed: 'Closed'
    };
    return statusTexts[status] || 'Unknown';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: 'photo' | 'audio' | 'document') => {
    // Simulate file upload
    const newEvidence: Evidence = {
      id: Date.now().toString(),
      type,
      name: `${type}_${Date.now()}.${type === 'photo' ? 'jpg' : type === 'audio' ? 'mp3' : 'pdf'}`,
      size: `${Math.floor(Math.random() * 1000) + 100}KB`
    };
    setEvidenceFiles(prev => [...prev, newEvidence]);
  };

  const removeEvidence = (id: string) => {
    setEvidenceFiles(prev => prev.filter(evidence => evidence.id !== id));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleInputChange('location', `${latitude}, ${longitude} (Current Location)`);
        },
        () => {
          handleInputChange('location', 'Red Fort, Delhi (Fallback Location)');
        }
      );
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedFirNumber = `FIR${Date.now().toString().slice(-8)}`;
      setFirNumber(generatedFirNumber);
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.incidentType !== '';
      case 2: return formData.incidentDate && formData.incidentTime && formData.location && formData.description;
      case 3: return formData.complainantName && formData.complainantPhone;
      default: return true;
    }
  };

  const filteredComplaints = submittedComplaints.filter(complaint => {
    const matchesSearch = complaint.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.incidentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      incidentType: '',
      incidentDate: '',
      incidentTime: '',
      location: '',
      description: '',
      suspectDetails: '',
      witnessDetails: '',
      complainantName: '',
      complainantPhone: '',
      complainantAddress: '',
      complainantEmail: ''
    });
    setEvidenceFiles([]);
    setShowSuccess(false);
    setFirNumber('');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (showSuccess) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`rounded-xl p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              E-FIR Submitted Successfully!
            </h2>
            <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your FIR has been registered with the following details:
            </p>
            <div className={`bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6`}>
              <p className={`text-xl font-bold text-blue-600 mb-2`}>
                FIR Number: {firNumber}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Date: {new Date().toLocaleDateString()}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Time: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="space-y-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • A copy of your FIR has been sent to your registered email
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • You will receive SMS updates on your complaint status
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • Investigating Officer will contact you within 24 hours
              </p>
            </div>
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => {
                  const firText = `FIR Details:\nFIR Number: ${firNumber}\nDate: ${new Date().toLocaleDateString()}\nIncident Type: ${formData.incidentType}\nLocation: ${formData.location}`;
                  navigator.clipboard.writeText(firText);
                }}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Copy FIR Details
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setCurrentView('my_complaints');
                }}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                View My Complaints
              </button>
              <button
                onClick={onBack}
                className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                E-FIR System
              </h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                File your complaint online - Fast, secure, and convenient
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
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
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex space-x-1 p-1 rounded-xl mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'
        }`}>
          <button
            onClick={() => {
              setCurrentView('file_fir');
              resetForm();
            }}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all flex-1 justify-center ${
              currentView === 'file_fir'
                ? 'bg-blue-600 text-white shadow-lg'
                : isDarkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>File New FIR</span>
          </button>
          <button
            onClick={() => setCurrentView('my_complaints')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all flex-1 justify-center ${
              currentView === 'my_complaints'
                ? 'bg-blue-600 text-white shadow-lg'
                : isDarkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eye className="w-5 h-5" />
            <span>My Complaints</span>
          </button>
        </div>

        {/* Content */}
        {currentView === 'file_fir' ? (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                      currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number 
                          ? (isDarkMode ? 'text-white' : 'text-gray-900')
                          : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                      }`}>
                        {step.title}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`hidden md:block w-full h-0.5 absolute mt-5 ${
                        currentStep > step.number ? 'bg-blue-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`} style={{ left: '50%', width: 'calc(100% - 2rem)' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg mb-8`}>
              {/* Step 1: Incident Type */}
              {currentStep === 1 && (
                <div>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Select Incident Type
                  </h3>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {incidentTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => handleInputChange('incidentType', type.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                          formData.incidentType === type.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="mb-2 flex justify-center">{type.icon}</div>
                          <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {type.name}
                          </h4>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {type.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Incident Details */}
              {currentStep === 2 && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Incident Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Date of Incident
                      </label>
                      <input
                        type="date"
                        value={formData.incidentDate}
                        onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Time of Incident
                      </label>
                      <input
                        type="time"
                        value={formData.incidentTime}
                        onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Location
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Enter incident location or coordinates"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`}
                        />
                        <button
                          onClick={getCurrentLocation}
                          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <MapPin className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Description of Incident
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Provide detailed description of what happened..."
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Suspect Details (if known)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Description of suspect(s), vehicle details, etc..."
                        value={formData.suspectDetails}
                        onChange={(e) => handleInputChange('suspectDetails', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Witness Details (if any)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Names and contact details of witnesses..."
                        value={formData.witnessDetails}
                        onChange={(e) => handleInputChange('witnessDetails', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Personal Details */}
              {currentStep === 3 && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Personal Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.complainantName}
                        onChange={(e) => handleInputChange('complainantName', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.complainantPhone}
                        onChange={(e) => handleInputChange('complainantPhone', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.complainantEmail}
                        onChange={(e) => handleInputChange('complainantEmail', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Address
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter your complete address"
                        value={formData.complainantAddress}
                        onChange={(e) => handleInputChange('complainantAddress', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Evidence */}
              {currentStep === 4 && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Upload Evidence
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <button
                        onClick={() => handleFileUpload('photo')}
                        className={`p-6 border-2 border-dashed rounded-lg transition-colors hover:border-blue-500 ${
                          isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Camera className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Upload Photos
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Images of incident scene
                        </p>
                      </button>
                      <button
                        onClick={() => handleFileUpload('document')}
                        className={`p-6 border-2 border-dashed rounded-lg transition-colors hover:border-blue-500 ${
                          isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <FileText className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Upload Documents
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Medical reports, receipts
                        </p>
                      </button>
                      <button
                        onClick={() => handleFileUpload('audio')}
                        className={`p-6 border-2 border-dashed rounded-lg transition-colors hover:border-blue-500 ${
                          isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Mic className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Upload Audio
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Voice recordings
                        </p>
                      </button>
                    </div>

                    {/* Evidence List */}
                    {evidenceFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Uploaded Files:
                        </h4>
                        {evidenceFiles.map((file) => (
                          <div
                            key={file.id}
                            className={`flex items-center justify-between p-3 border rounded-lg ${
                              isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {file.type === 'photo' && <Camera className="w-5 h-5 text-blue-500" />}
                              {file.type === 'document' && <FileText className="w-5 h-5 text-green-500" />}
                              {file.type === 'audio' && <Mic className="w-5 h-5 text-purple-500" />}
                              <div>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {file.name}
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {file.size}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeEvidence(file.id)}
                              className={`p-1 rounded hover:bg-red-100 ${isDarkMode ? 'hover:bg-red-900/20 text-red-400' : 'text-red-500'}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div>
                  <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Review & Submit
                  </h3>
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Incident Summary
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Type:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {incidentTypes.find(t => t.id === formData.incidentType)?.name || 'Not selected'}
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formData.incidentDate}
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Time:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formData.incidentTime}
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Location:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formData.location}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Description:</span>
                        <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formData.description}
                        </p>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Personal Details
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formData.complainantName}
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Phone:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formData.complainantPhone}
                          </span>
                        </div>
                        <div>
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email:</span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formData.complainantEmail || 'Not provided'}
                          </span>
                        </div>
                      </div>
                      {formData.complainantAddress && (
                        <div className="mt-3">
                          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Address:</span>
                          <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formData.complainantAddress}
                          </p>
                        </div>
                      )}
                    </div>

                    {evidenceFiles.length > 0 && (
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          Evidence Files ({evidenceFiles.length})
                        </h4>
                        <div className="space-y-2">
                          {evidenceFiles.map((file) => (
                            <div key={file.id} className="flex items-center space-x-3 text-sm">
                              {file.type === 'photo' && <Camera className="w-4 h-4 text-blue-500" />}
                              {file.type === 'document' && <FileText className="w-4 h-4 text-green-500" />}
                              {file.type === 'audio' && <Mic className="w-4 h-4 text-purple-500" />}
                              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                                {file.name} ({file.size})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`p-4 border-l-4 border-yellow-400 ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                      <div className="flex">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                        <div>
                          <h5 className={`font-medium ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                            Important Notice
                          </h5>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                            By submitting this E-FIR, you confirm that all the information provided is true and accurate to the best of your knowledge. 
                            Filing a false complaint is a punishable offense under law.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  currentStep === 1
                    ? isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    !canProceed()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !canProceed()}
                  className={`px-8 py-3 rounded-lg transition-colors ${
                    isSubmitting || !canProceed()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit E-FIR'
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          /* My Complaints View */
          <>
            {/* Search and Filter */}
            <div className={`p-6 rounded-xl mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <button className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-4">
              {filteredComplaints.length === 0 ? (
                <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg`}>
                  <FileText className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No complaints found
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {searchQuery || statusFilter !== 'all' 
                      ? 'No complaints match your current filters.' 
                      : 'You haven\'t filed any complaints yet.'}
                  </p>
                </div>
              ) : (
                filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg cursor-pointer hover:shadow-xl transition-all`}
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            FIR #{complaint.firNumber}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                            {getStatusText(complaint.status)}
                          </span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          <span className="font-medium">Type:</span> {complaint.incidentType}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-2`}>
                          {complaint.description}
                        </p>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(complaint.submissionDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {complaint.location.substring(0, 20)}...
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {complaint.complainantName}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Phone className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {complaint.complainantPhone}
                          </span>
                        </div>
                        
                        {complaint.evidenceCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <Camera className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {complaint.evidenceCount} files
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          Updated: {new Date(complaint.lastUpdate).toLocaleDateString()}
                        </span>
                        <Eye className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Complaint Detail Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-2xl w-full rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      FIR #{selectedComplaint.firNumber}
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Complaint Details
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusText(selectedComplaint.status)}
                    </span>
                    <div className="flex space-x-2">
                      <button className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                        <Download className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                        <Navigation2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Incident Type
                        </p>
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedComplaint.incidentType}
                        </p>
                      </div>
                      
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Date & Time
                        </p>
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedComplaint.date} at {selectedComplaint.time}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Location
                        </p>
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedComplaint.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Description
                    </h4>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedComplaint.description}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {selectedComplaint.complainantName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Phone className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {selectedComplaint.complainantPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Investigation Details */}
                  {selectedComplaint.investigatingOfficer && (
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Investigation Details
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Investigating Officer:
                          </span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedComplaint.investigatingOfficer}
                          </span>
                        </div>
                        <div>
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Last Update:
                          </span>
                          <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(selectedComplaint.lastUpdate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Track Status
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
                      Contact Officer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EFirDashboard;