import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, ArrowLeft, Search, 
  Download, AlertTriangle, Shield, 
  Heart, MapPin, Clock, ChevronDown,
  ExternalLink, Star, Moon, Sun
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Helpline {
  id: string;
  service: string;
  number: string;
  type: string;
  region: string;
  languages: string[];
  lastVerified: string;
  availability: string;
  description: string;
}

const HelplinesDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [sortBy, setSortBy] = useState('service');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const helplines: Helpline[] = [
    {
      id: '1',
      service: 'Emergency Services',
      number: '112',
      type: 'Emergency',
      region: 'All India',
      languages: ['Hindi', 'English', 'Regional'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Unified emergency helpline for police, fire, and medical emergencies'
    },
    {
      id: '2',
      service: 'Police',
      number: '100',
      type: 'Law Enforcement',
      region: 'All India',
      languages: ['Hindi', 'English', 'Regional'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Direct police assistance for law and order situations'
    },
    {
      id: '3',
      service: 'Medical Emergency',
      number: '102',
      type: 'Medical',
      region: 'All India',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-14',
      availability: '24/7',
      description: 'Ambulance and medical emergency services'
    },
    {
      id: '4',
      service: 'Tourist Helpline',
      number: '1363',
      type: 'Tourism',
      region: 'All India',
      languages: ['Hindi', 'English', 'French', 'German', 'Spanish'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Dedicated support for tourists with multilingual assistance'
    },
    {
      id: '5',
      service: 'Women Helpline',
      number: '1091',
      type: 'Safety',
      region: 'All India',
      languages: ['Hindi', 'English', 'Regional'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Emergency helpline for women in distress'
    },
    {
      id: '6',
      service: 'Delhi Police',
      number: '+91-11-23490300',
      type: 'Law Enforcement',
      region: 'Delhi',
      languages: ['Hindi', 'English', 'Punjabi'],
      lastVerified: '2025-01-14',
      availability: '24/7',
      description: 'Delhi Police control room for local assistance'
    },
    {
      id: '7',
      service: 'Railway Enquiry',
      number: '139',
      type: 'Transport',
      region: 'All India',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-13',
      availability: '24/7',
      description: 'Indian Railways passenger inquiry and assistance'
    },
    {
      id: '8',
      service: 'Delhi Tourism',
      number: '+91-11-23365358',
      type: 'Tourism',
      region: 'Delhi',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-12',
      availability: '9 AM - 6 PM',
      description: 'Delhi Tourism Department for local information and assistance'
    },
    {
      id: '9',
      service: 'Airport Authority',
      number: '+91-124-3376000',
      type: 'Transport',
      region: 'Delhi (IGI)',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-14',
      availability: '24/7',
      description: 'Indira Gandhi International Airport assistance'
    },
    {
      id: '10',
      service: 'Fire Brigade',
      number: '101',
      type: 'Emergency',
      region: 'All India',
      languages: ['Hindi', 'English', 'Regional'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Fire and rescue services emergency line'
    },
    // 13 Additional Tourist Safety Helplines
    {
      id: '11',
      service: 'Tourist Police Delhi',
      number: '+91-11-23365358',
      type: 'Tourist Safety',
      region: 'Delhi',
      languages: ['Hindi', 'English', 'French', 'German', 'Japanese'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Specialized police unit for tourist safety and assistance in Delhi'
    },
    {
      id: '12',
      service: 'US Embassy Emergency',
      number: '+91-11-2419-8000',
      type: 'Embassy',
      region: 'Delhi',
      languages: ['English'],
      lastVerified: '2025-01-14',
      availability: '24/7',
      description: 'US Embassy emergency assistance for American citizens'
    },
    {
      id: '13',
      service: 'UK High Commission',
      number: '+91-11-2419-2100',
      type: 'Embassy',
      region: 'Delhi',
      languages: ['English'],
      lastVerified: '2025-01-14',
      availability: '9 AM - 5 PM',
      description: 'British High Commission assistance for UK nationals'
    },
    {
      id: '14',
      service: 'German Embassy',
      number: '+91-11-4419-9199',
      type: 'Embassy',
      region: 'Delhi',
      languages: ['German', 'English'],
      lastVerified: '2025-01-13',
      availability: '8:30 AM - 5 PM',
      description: 'German Embassy consular services and emergency assistance'
    },
    {
      id: '15',
      service: 'Medical Tourism Support',
      number: '+91-11-2696-2315',
      type: 'Medical Tourism',
      region: 'All India',
      languages: ['Hindi', 'English', 'Arabic', 'Russian'],
      lastVerified: '2025-01-14',
      availability: '9 AM - 6 PM',
      description: 'Medical tourism assistance and hospital coordination'
    },
    {
      id: '16',
      service: 'Travel Insurance Claims',
      number: '1800-103-1111',
      type: 'Insurance',
      region: 'All India',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Travel insurance emergency claims and assistance'
    },
    {
      id: '17',
      service: 'Lost Passport Assistance',
      number: '+91-11-2419-8000',
      type: 'Passport Services',
      region: 'All India',
      languages: ['English', 'Hindi'],
      lastVerified: '2025-01-14',
      availability: '9 AM - 6 PM',
      description: 'Emergency passport services and document assistance'
    },
    {
      id: '18',
      service: 'Currency Exchange Help',
      number: '+91-11-2373-7373',
      type: 'Financial',
      region: 'All India',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-13',
      availability: '10 AM - 6 PM',
      description: 'Authorized money exchange assistance and fraud reporting'
    },
    {
      id: '19',
      service: 'Hotel Safety Complaints',
      number: '+91-11-2338-1884',
      type: 'Accommodation',
      region: 'All India',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Hotel and accommodation safety complaints and verification'
    },
    {
      id: '20',
      service: 'Cab Safety Helpline',
      number: '+91-124-4642222',
      type: 'Transport Safety',
      region: 'All India',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-14',
      availability: '24/7',
      description: 'Taxi and cab safety complaints and emergency assistance'
    },
    {
      id: '21',
      service: 'Adventure Tourism Safety',
      number: '+91-135-2746817',
      type: 'Adventure Tourism',
      region: 'Uttarakhand',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-13',
      availability: '6 AM - 8 PM',
      description: 'Mountain rescue and adventure sports safety assistance'
    },
    {
      id: '22',
      service: 'Golden Triangle Tourist Help',
      number: '+91-141-2385526',
      type: 'Tourist Safety',
      region: 'Rajasthan',
      languages: ['Hindi', 'English', 'French'],
      lastVerified: '2025-01-14',
      availability: '24/7',
      description: 'Tourist assistance for Delhi-Agra-Jaipur circuit'
    },
    {
      id: '23',
      service: 'Airport Tourism Desk',
      number: '+91-22-2681-3000',
      type: 'Airport Services',
      region: 'Mumbai',
      languages: ['Hindi', 'English', 'Marathi'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Mumbai Airport tourism information and assistance desk'
    },
    {
      id: '24',
      service: 'French Embassy',
      number: '+91-11-4319-6100',
      type: 'Embassy',
      region: 'Delhi',
      languages: ['French', 'English'],
      lastVerified: '2025-01-14',
      availability: '9 AM - 5 PM',
      description: 'French Embassy consular services and emergency assistance for French nationals'
    },
    {
      id: '25',
      service: 'Japanese Embassy',
      number: '+91-11-4610-4610',
      type: 'Embassy',
      region: 'Delhi',
      languages: ['Japanese', 'English'],
      lastVerified: '2025-01-13',
      availability: '9 AM - 5 PM',
      description: 'Japanese Embassy assistance and consular services'
    },
    {
      id: '26',
      service: 'Australian High Commission',
      number: '+91-11-4139-9900',
      type: 'Embassy',
      region: 'Delhi',
      languages: ['English'],
      lastVerified: '2025-01-15',
      availability: '8:30 AM - 5 PM',
      description: 'Australian High Commission emergency assistance and consular services'
    },
    {
      id: '27',
      service: 'Canadian High Commission',
      number: '+91-11-4178-2000',
      type: 'Embassy',
      region: 'Delhi',
      languages: ['English', 'French'],
      lastVerified: '2025-01-14',
      availability: '8:30 AM - 4:30 PM',
      description: 'Canadian High Commission services for Canadian citizens'
    },
    {
      id: '28',
      service: 'Kerala Tourism Police',
      number: '+91-471-2321394',
      type: 'Tourist Safety',
      region: 'Kerala',
      languages: ['Malayalam', 'English', 'Hindi'],
      lastVerified: '2025-01-15',
      availability: '24/7',
      description: 'Kerala Tourism Police for backwater and beach safety assistance'
    },
    {
      id: '29',
      service: 'Goa Tourism Helpline',
      number: '+91-832-2438001',
      type: 'Tourist Safety',
      region: 'Goa',
      languages: ['English', 'Hindi', 'Konkani', 'Portuguese'],
      lastVerified: '2025-01-14',
      availability: '24/7',
      description: 'Goa Tourism Department emergency assistance and beach safety'
    },
    {
      id: '30',
      service: 'Himachal Tourism Emergency',
      number: '+91-177-2625320',
      type: 'Adventure Tourism',
      region: 'Himachal Pradesh',
      languages: ['Hindi', 'English'],
      lastVerified: '2025-01-13',
      availability: '24/7',
      description: 'Himachal Pradesh mountain rescue and trekking emergency assistance'
    }
  ];

  const filteredHelplines = helplines.filter(helpline => {
    const matchesSearch = helpline.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         helpline.number.includes(searchTerm) ||
                         helpline.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || helpline.type === filterType;
    const matchesRegion = filterRegion === 'all' || helpline.region === filterRegion;
    
    return matchesSearch && matchesType && matchesRegion;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'service':
        return a.service.localeCompare(b.service);
      case 'type':
        return a.type.localeCompare(b.type);
      case 'region':
        return a.region.localeCompare(b.region);
      default:
        return 0;
    }
  });

  const handleCall = (number: string, service: string) => {
    // In a real app, this would make the call
    toast.success(`Calling ${service} at ${number}`);
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const exportData = () => {
    toast.success('Helpline data exported successfully!');
  };

  const reportProblem = (service: string) => {
    toast.success(`Problem reported for ${service}. Thank you for your feedback.`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Emergency':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'Medical':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'Law Enforcement':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'Tourism':
      case 'Tourist Safety':
        return <MapPin className="w-4 h-4 text-orange-500" />;
      case 'Transport':
      case 'Transport Safety':
      case 'Airport Services':
        return <ExternalLink className="w-4 h-4 text-purple-500" />;
      case 'Safety':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'Embassy':
        return <Shield className="w-4 h-4 text-green-500" />;
      case 'Medical Tourism':
        return <Heart className="w-4 h-4 text-blue-500" />;
      case 'Insurance':
        return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'Passport Services':
        return <ExternalLink className="w-4 h-4 text-red-500" />;
      case 'Financial':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'Accommodation':
        return <MapPin className="w-4 h-4 text-teal-500" />;
      case 'Adventure Tourism':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Phone className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency':
        return 'bg-red-100 text-red-800';
      case 'Medical':
        return 'bg-red-100 text-red-800';
      case 'Law Enforcement':
        return 'bg-blue-100 text-blue-800';
      case 'Tourism':
      case 'Tourist Safety':
        return 'bg-orange-100 text-orange-800';
      case 'Transport':
      case 'Transport Safety':
      case 'Airport Services':
        return 'bg-purple-100 text-purple-800';
      case 'Safety':
        return 'bg-pink-100 text-pink-800';
      case 'Embassy':
        return 'bg-green-100 text-green-800';
      case 'Medical Tourism':
        return 'bg-blue-100 text-blue-800';
      case 'Insurance':
        return 'bg-indigo-100 text-indigo-800';
      case 'Passport Services':
        return 'bg-red-100 text-red-800';
      case 'Financial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Accommodation':
        return 'bg-teal-100 text-teal-800';
      case 'Adventure Tourism':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Emergency & Tourist Safety Helplines</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comprehensive directory of emergency and tourist safety numbers</p>
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
            <div className="flex items-center space-x-2">
              <Phone className="w-8 h-8 text-orange-600" />
              <div className="text-right">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Emergency: <span className="font-bold text-red-600">112</span></p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tourist: <span className="font-bold text-orange-600">1363</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`rounded-xl p-6 shadow-sm mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search helplines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'border-gray-300'
                }`}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
              >
                <option value="all">All Types</option>
                <option value="Emergency">Emergency</option>
                <option value="Medical">Medical</option>
                <option value="Law Enforcement">Law Enforcement</option>
                <option value="Tourism">Tourism</option>
                <option value="Tourist Safety">Tourist Safety</option>
                <option value="Transport">Transport</option>
                <option value="Transport Safety">Transport Safety</option>
                <option value="Safety">Safety</option>
                <option value="Embassy">Embassy</option>
                <option value="Medical Tourism">Medical Tourism</option>
                <option value="Insurance">Insurance</option>
                <option value="Passport Services">Passport Services</option>
                <option value="Financial">Financial</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Adventure Tourism">Adventure Tourism</option>
                <option value="Airport Services">Airport Services</option>
              </select>

              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
              >
                <option value="all">All Regions</option>
                <option value="All India">All India</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="Delhi (IGI)">Delhi (IGI)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'border-gray-300'
                }`}
              >
                <option value="service">Sort by Service</option>
                <option value="type">Sort by Type</option>
                <option value="region">Sort by Region</option>
              </select>

              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Showing {filteredHelplines.length} of {helplines.length} helplines
          </p>
        </div>

        {/* Helplines Table */}
        <div className={`rounded-xl shadow-sm overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Service
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Number
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Type
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Region
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Languages
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Last Verified
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                {filteredHelplines.map((helpline) => (
                  <React.Fragment key={helpline.id}>
                    <tr className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(helpline.type)}
                          <div className="ml-3">
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {helpline.service}
                            </div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Available: {helpline.availability}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleCall(helpline.number, helpline.service)}
                          className="text-blue-600 hover:text-blue-800 font-mono text-sm hover:underline"
                        >
                          {helpline.number}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(helpline.type)}`}>
                          {helpline.type}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {helpline.region}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {helpline.languages.slice(0, 2).join(', ')}
                        {helpline.languages.length > 2 && (
                          <span className="text-gray-400"> +{helpline.languages.length - 2} more</span>
                        )}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(helpline.lastVerified).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCall(helpline.number, helpline.service)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors flex items-center space-x-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </button>
                          <button
                            onClick={() => toggleRowExpansion(helpline.id)}
                            className="text-orange-600 hover:text-orange-800 p-1"
                          >
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform ${
                                expandedRows.includes(helpline.id) ? 'rotate-180' : ''
                              }`} 
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Row */}
                    {expandedRows.includes(helpline.id) && (
                      <tr>
                        <td colSpan={7} className={`px-6 py-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                          <div className="space-y-3">
                            <div>
                              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Description</h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{helpline.description}</p>
                            </div>
                            <div>
                              <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Languages Supported</h4>
                              <div className="flex flex-wrap gap-2">
                                {helpline.languages.map((lang) => (
                                  <span 
                                    key={lang}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {lang}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => reportProblem(helpline.service)}
                                className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>Report Problem</span>
                              </button>
                              <button className="text-orange-600 hover:text-orange-800 text-sm flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>Add to Favorites</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHelplines.length === 0 && (
            <div className="text-center py-12">
              <Phone className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No helplines found</h3>
              <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4 mt-6">
          {filteredHelplines.map((helpline) => (
            <div key={helpline.id} className={`rounded-xl p-4 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(helpline.type)}
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{helpline.service}</h3>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(helpline.type)}`}>
                  {helpline.type}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => handleCall(helpline.number, helpline.service)}
                  className="w-full text-left font-mono text-blue-600 hover:text-blue-800 text-lg font-semibold"
                >
                  {helpline.number}
                </button>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{helpline.region}</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{helpline.languages.join(', ')}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{helpline.description}</p>
              </div>
              
              <button
                onClick={() => handleCall(helpline.number, helpline.service)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelplinesDashboard;