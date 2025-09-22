import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Search, Plus, MapPin, 
  Calendar, Upload, Eye,
  Clock, User, Phone, AlertTriangle,
  CheckCircle, Tag, Package, Smartphone,
  Moon, Sun
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LostItem {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  date: string;
  time: string;
  contact: string;
  status: 'lost' | 'found' | 'claimed';
  reporter: string;
  officerAssigned?: string;
  imageUrl?: string;
  reward?: string;
  matchPercentage?: number;
}

const LostFoundDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'report'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);

  // Form state for reporting
  const [reportForm, setReportForm] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    date: '',
    time: '',
    contact: '',
    reward: '',
    images: [] as File[]
  });

  const categories = [
    { id: 'electronics', name: 'Electronics', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'documents', name: 'Documents', icon: <Tag className="w-4 h-4" /> },
    { id: 'jewelry', name: 'Jewelry', icon: <Package className="w-4 h-4" /> },
    { id: 'bags', name: 'Bags & Luggage', icon: <Package className="w-4 h-4" /> },
    { id: 'clothing', name: 'Clothing', icon: <Package className="w-4 h-4" /> },
    { id: 'keys', name: 'Keys', icon: <Tag className="w-4 h-4" /> },
    { id: 'other', name: 'Other', icon: <Package className="w-4 h-4" /> }
  ];

  const sampleItems: LostItem[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      category: 'electronics',
      description: 'Black iPhone 15 Pro Max with cracked screen protector. Has distinctive blue case.',
      location: 'Red Fort, Delhi',
      date: '2025-01-15',
      time: '14:30',
      contact: '+91 9876543210',
      status: 'lost',
      reporter: 'Jay Ram',
      reward: '₹5,000',
      matchPercentage: 95
    },
    {
      id: '2',
      title: 'Passport - USA',
      category: 'documents',
      description: 'US Passport, blue cover, belongs to Esha Sana. Last seen near India Gate.',
      location: 'India Gate, Delhi',
      date: '2025-01-14',
      time: '16:45',
      contact: '+91 9876543211',
      status: 'found',
      reporter: 'Tourist Police',
      officerAssigned: 'Officer Kumar'
    },
    {
      id: '3',
      title: 'Gold Wedding Ring',
      category: 'jewelry',
      description: 'Gold wedding ring with small diamond. Engraved with "S & R 2020".',
      location: 'Chandni Chowk, Delhi',
      date: '2025-01-13',
      time: '11:20',
      contact: '+91 9876543212',
      status: 'lost',
      reporter: 'Sarah Gupta',
      reward: '₹10,000',
      matchPercentage: 87
    },
    {
      id: '4',
      title: 'Black Backpack',
      category: 'bags',
      description: 'Large black hiking backpack with laptop compartment. Contains travel documents.',
      location: 'Lotus Temple, Delhi',
      date: '2025-01-12',
      time: '09:15',
      contact: '+91 9876543213',
      status: 'claimed',
      reporter: 'Dhanunjay Reddy',
      officerAssigned: 'Sushanth Singh'
    }
  ];

  const [items, setItems] = useState<LostItem[]>(sampleItems);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || item.location.includes(locationFilter);
    const matchesDate = dateFilter === 'all' || 
      (dateFilter === 'today' && item.date === new Date().toISOString().split('T')[0]) ||
      (dateFilter === 'week' && new Date(item.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesCategory && matchesLocation && matchesDate;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: LostItem = {
      id: Date.now().toString(),
      ...reportForm,
      status: 'lost',
      reporter: 'Current User' // In real app, get from auth context
    };
    
    setItems([newItem, ...items]);
    toast.success('Item reported successfully! We\'ll notify you of any matches.');
    
    // Reset form
    setReportForm({
      title: '',
      category: '',
      description: '',
      location: '',
      date: '',
      time: '',
      contact: '',
      reward: '',
      images: []
    });
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files);
      setReportForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 3) // Limit to 3 images
      }));
      toast.success(`${newImages.length} image(s) uploaded`);
    }
  };

  const claimItem = () => {
    toast.success('Claim request submitted! Officer will contact you for verification.');
  };

  const contactReporter = (contact: string) => {
    toast.success(`Calling ${contact}...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lost': return 'bg-red-100 text-red-800';
      case 'found': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lost': return <AlertTriangle className="w-4 h-4" />;
      case 'found': return <CheckCircle className="w-4 h-4" />;
      case 'claimed': return <User className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || <Package className="w-4 h-4" />;
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
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Lost & Found</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Report lost items or search for found items</p>
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
            <Search className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`rounded-xl p-4 shadow-sm mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'search'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search Items</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                activeTab === 'report'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Report Item</span>
            </button>
          </div>
        </div>

        {activeTab === 'search' ? (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className={`rounded-xl p-6 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="all">All Locations</option>
                  <option value="Red Fort">Red Fort</option>
                  <option value="India Gate">India Gate</option>
                  <option value="Chandni Chowk">Chandni Chowk</option>
                  <option value="Lotus Temple">Lotus Temple</option>
                </select>

                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={`px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                </select>
              </div>
            </div>

            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Search Results ({filteredItems.length})
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div key={item.id} className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(item.category)}
                        <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </span>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {item.description}
                    </p>

                    <div className={`space-y-2 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(item.date).toLocaleDateString()} at {item.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Reported by {item.reporter}</span>
                      </div>
                    </div>

                    {item.matchPercentage && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Match Confidence</span>
                          <span className="font-medium text-green-600">{item.matchPercentage}%</span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.matchPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {item.reward && (
                      <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm font-medium text-green-800">
                          Reward: {item.reward}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="flex-1 bg-orange-600 text-white py-2 px-3 rounded hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      {item.status === 'found' && (
                        <button
                          onClick={() => claimItem()}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Claim Item
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className={`text-center py-12 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <Search className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No items found</h3>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Try adjusting your search criteria or report the item if it's lost.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Report Form */
          <div className={`rounded-xl p-8 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Report Lost Item</h3>
            
            <form onSubmit={handleReportSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Item Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={reportForm.title}
                    onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                    placeholder="e.g., iPhone 15 Pro Max"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Category *
                  </label>
                  <select
                    required
                    value={reportForm.category}
                    onChange={(e) => setReportForm(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Detailed Description *
                  </label>
                  <textarea
                    required
                    value={reportForm.description}
                    onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Provide detailed description including color, brand, distinctive features..."
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Last Seen Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={reportForm.location}
                      onChange={(e) => setReportForm(prev => ({ ...prev, location: e.target.value }))}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., Red Fort main entrance"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={reportForm.date}
                      onChange={(e) => setReportForm(prev => ({ ...prev, date: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={reportForm.time}
                      onChange={(e) => setReportForm(prev => ({ ...prev, time: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      required
                      value={reportForm.contact}
                      onChange={(e) => setReportForm(prev => ({ ...prev, contact: e.target.value }))}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reward (Optional)
                  </label>
                  <input
                    type="text"
                    value={reportForm.reward}
                    onChange={(e) => setReportForm(prev => ({ ...prev, reward: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300'
                    }`}
                    placeholder="e.g., ₹5,000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Photos (Up to 3)
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Click to upload or drag and drop photos
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`mt-2 inline-block px-3 py-1 rounded border hover:bg-gray-50 cursor-pointer text-sm ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' 
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        Choose Photos
                      </label>
                    </div>
                    {reportForm.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {reportForm.images.map((file, index) => (
                          <div key={index} className={`text-xs p-2 rounded ${
                            isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                          }`}>
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setActiveTab('search')}
                  className={`px-6 py-2 border rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Report Item</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Item Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedItem.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {getCategoryIcon(selectedItem.category)}
                    <span className={`capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedItem.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Description</h4>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedItem.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Location</h4>
                    <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedItem.location}
                    </p>
                  </div>
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Date & Time</h4>
                    <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Clock className="w-4 h-4 mr-2" />
                      {new Date(selectedItem.date).toLocaleDateString()} at {selectedItem.time}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Contact Information</h4>
                  <button
                    onClick={() => contactReporter(selectedItem.contact)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {selectedItem.contact}
                  </button>
                </div>

                {selectedItem.reward && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">Reward Offered</h4>
                    <p className="text-green-700">{selectedItem.reward}</p>
                  </div>
                )}

                {selectedItem.officerAssigned && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">Assigned Officer</h4>
                    <p className="text-blue-700">{selectedItem.officerAssigned}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t">
                  {selectedItem.status === 'found' && (
                    <button
                      onClick={() => claimItem()}
                      className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Claim This Item
                    </button>
                  )}
                  <button
                    onClick={() => contactReporter(selectedItem.contact)}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contact Reporter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFoundDashboard;