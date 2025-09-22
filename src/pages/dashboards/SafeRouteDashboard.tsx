import { useState } from 'react';
import { 
  ArrowLeft, MapPin, Navigation, Clock, 
  Shield, AlertTriangle, Users, Share2,
  Bookmark, Route, Zap, Car, RefreshCw,
  Moon, Sun
} from 'lucide-react';

interface RouteData {
  id: number;
  name: string;
  distance: string;
  duration: string;
  safetyScore: number;
  safetyBadge: string;
  incidents: number;
  crowdLevel: string;
  polylineColor: string;
  safetyFeatures: string[];
  warnings: string[];
}

const SafeRouteDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('');
  const [routeType, setRouteType] = useState<string>('safest');
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [showRoutes, setShowRoutes] = useState<boolean>(false);

  // Navigation function to go back to tourist dashboard
  const handleBackNavigation = () => {
    // Use browser's history API to go back
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history, redirect to a default page or show a message
      showToast('No previous page to go back to', 'info');
    }
  };

  const handleFindRoute = () => {
    if (!fromLocation || !toLocation) {
      showToast('Please enter both origin and destination', 'error');
      return;
    }
    
    // Generate sample routes based on the locations
    const generatedRoutes: RouteData[] = [
      {
        id: 1,
        name: 'Safest Route',
        distance: calculateDistance(fromLocation, toLocation),
        duration: calculateDuration('safe'),
        safetyScore: 95,
        safetyBadge: 'Excellent',
        incidents: 0,
        crowdLevel: 'Medium',
        polylineColor: 'green',
        safetyFeatures: ['Well-lit highways', 'CCTV coverage', 'Police checkpoints', 'Rest stops'],
        warnings: []
      },
      {
        id: 2,
        name: 'Balanced Route',
        distance: calculateDistance(fromLocation, toLocation, 0.9),
        duration: calculateDuration('balanced'),
        safetyScore: 82,
        safetyBadge: 'Good',
        incidents: 1,
        crowdLevel: 'High',
        polylineColor: 'yellow',
        safetyFeatures: ['Main highways', 'Toll booths', 'Service areas'],
        warnings: ['Heavy traffic during peak hours']
      },
      {
        id: 3,
        name: 'Fastest Route',
        distance: calculateDistance(fromLocation, toLocation, 0.85),
        duration: calculateDuration('fast'),
        safetyScore: 68,
        safetyBadge: 'Moderate',
        incidents: 3,
        crowdLevel: 'Low',
        polylineColor: 'red',
        safetyFeatures: ['Express highways', 'Less traffic'],
        warnings: ['Limited lighting in some areas', 'Avoid night travel', 'Road work zones']
      }
    ];
    
    setRoutes(generatedRoutes);
    setShowRoutes(true);
    setSelectedRoute(1); // Auto-select first route
    showToast('Routes found successfully!', 'success');
  };

  // Helper functions to generate realistic data
  const calculateDistance = (_from: string, _to: string, factor: number = 1): string => {
    // Simple distance calculation simulation
    const baseDistance = Math.floor(Math.random() * 400 + 100); // 100-500 km
    const distance = Math.floor(baseDistance * factor);
    return `${distance} km`;
  };

  const calculateDuration = (type: string): string => {
    const baseTime = Math.floor(Math.random() * 8 + 2); // 2-10 hours
    let duration: number;
    
    switch (type) {
      case 'safe':
        duration = Math.floor(baseTime * 1.2); // 20% longer for safety
        break;
      case 'balanced':
        duration = baseTime;
        break;
      case 'fast':
        duration = Math.floor(baseTime * 0.8); // 20% faster
        break;
      default:
        duration = baseTime;
    }
    
    const hours = Math.floor(duration);
    const minutes = Math.floor((duration - hours) * 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const handleSelectRoute = (routeId: number) => {
    setSelectedRoute(routeId);
    const selectedRouteData = routes.find(r => r.id === routeId);
    showToast(`Selected ${selectedRouteData?.name}`, 'success');
  };

  const shareRoute = (routeToShare: RouteData) => {
    const routeText = `Route from ${fromLocation} to ${toLocation} via ${routeToShare.name} - ${routeToShare.distance}, ${routeToShare.duration}, Safety: ${routeToShare.safetyScore}%`;
    
    if (navigator.share) {
      navigator.share({
        title: `Safe Route: ${routeToShare.name}`,
        text: routeText,
        url: window.location.href
      });
    } else {
      navigator.clipboard?.writeText(routeText);
      showToast('Route details copied to clipboard!', 'success');
    }
  };

  const saveRoute = (routeToSave: RouteData) => {
    showToast(`${routeToSave.name} from ${fromLocation} to ${toLocation} saved to favorites!`, 'success');
  };

  const openInGoogleMaps = () => {
    const origin = encodeURIComponent(fromLocation);
    const destination = encodeURIComponent(toLocation);
    const url = `https://www.google.com/maps/dir/${origin}/${destination}`;
    window.open(url, '_blank');
  };

  const showToast = (message: string, type: string) => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // In a real app, you would show an actual toast notification
  };

  const getSafetyColor = (score: number): string => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPolylineColor = (color: string): string => {
    switch (color) {
      case 'green': return 'border-green-500 bg-green-50';
      case 'yellow': return 'border-yellow-500 bg-yellow-50';
      case 'red': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getCrowdLevelColor = (level: string): string => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Dummy Map Component
  const DummyMap = ({ showRoute = false }: { showRoute?: boolean }) => {
    return (
      <div className={`h-full flex items-center justify-center relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className={`border ${isDarkMode ? 'border-gray-600' : 'border-blue-200'}`}></div>
            ))}
          </div>
        </div>
        
        {/* Map content */}
        <div className="relative z-10 text-center">
          {!showRoute ? (
            <>
              <div className="mb-6">
                <MapPin className={`w-20 h-20 mx-auto mb-4 animate-pulse ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-400'
                }`} />
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className={`w-16 h-1 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h4 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Interactive Map</h4>
              <p className={`text-sm max-w-md ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Enter your starting location and destination to see the route visualization with real-time traffic data
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <Navigation className={`w-16 h-16 mx-auto mb-4 animate-bounce ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-500'
                }`} />
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1 h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded max-w-32"></div>
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Route Calculated</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                {fromLocation} → {toLocation}
              </p>
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Safe Route</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Moderate Route</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Fast Route</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className={`absolute top-4 left-4 w-16 h-16 rounded-full opacity-30 animate-pulse ${
          isDarkMode ? 'bg-blue-400' : 'bg-blue-200'
        }`}></div>
        <div className={`absolute bottom-4 right-4 w-12 h-12 rounded-full opacity-30 animate-pulse ${
          isDarkMode ? 'bg-purple-400' : 'bg-purple-200'
        }`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute top-1/3 right-8 w-8 h-8 rounded-full opacity-30 animate-pulse ${
          isDarkMode ? 'bg-green-400' : 'bg-green-200'
        }`} style={{animationDelay: '2s'}}></div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleBackNavigation}
              className={`p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
              title="Back to Previous Page"
            >
              <ArrowLeft className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Safe Route Planner</h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Find the safest path to your destination</p>
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
            <Navigation className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Route Input Form */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl p-6 shadow-sm mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Route Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                    <input
                      type="text"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className={`w-full pl-12 pr-3 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., Chandinichowk, Jaipur"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
                    <input
                      type="text"
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      className={`w-full pl-12 pr-3 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., Redfort, Shimla"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Departure Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="datetime-local"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className={`w-full pl-12 pr-3 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Route Preference */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Route Preference</label>
                  <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <button
                      onClick={() => setRouteType('safest')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                        routeType === 'safest'
                          ? 'bg-orange-600 text-white shadow-sm'
                          : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      <span>Safest</span>
                    </button>
                    <button
                      onClick={() => setRouteType('fastest')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                        routeType === 'fastest'
                          ? 'bg-orange-600 text-white shadow-sm'
                          : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>Fastest</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleFindRoute}
                  disabled={!fromLocation || !toLocation}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors ${
                    fromLocation && toLocation
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Route className="w-5 h-5" />
                  <span>Find Safe Route</span>
                </button>
              </div>

              {/* Show route summary when routes are found */}
              {showRoutes && (
                <div className={`mt-6 p-4 border rounded-lg ${
                  isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>Route Found</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    <strong>{fromLocation}</strong> → <strong>{toLocation}</strong>
                  </p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-500' : 'text-green-600'}`}>
                    {routes.length} route options available
                  </p>
                </div>
              )}
            </div>

            {/* Live Incident Feed */}
            <div className={`rounded-xl p-6 shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Live Traffic Updates</h3>
                <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
              <div className="space-y-3">
                <div className={`flex items-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Heavy Traffic</p>
                    <p className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>NH-16 Highway - 20 min ago</p>
                  </div>
                </div>
                <div className={`flex items-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                  <Users className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Road Work</p>
                    <p className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>Vijayawada Bypass - 45 min ago</p>
                  </div>
                </div>
                <div className={`flex items-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <Car className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Weather Alert</p>
                    <p className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Light rain expected - 1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map and Routes */}
          <div className="lg:col-span-2">
            {/* Map with Route */}
            <div className={`rounded-xl p-6 shadow-sm mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {showRoutes ? `Route: ${fromLocation} → ${toLocation}` : 'Route Map'}
                </h3>
                {showRoutes && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Live Route</span>
                  </div>
                )}
              </div>
              
              <div className={`h-96 rounded-lg overflow-hidden border shadow-inner ${
                isDarkMode ? 'border-gray-700 bg-gray-700' : 'border bg-gray-100'
              }`}>
                <DummyMap showRoute={showRoutes} />
              </div>

              {/* Map Controls */}
              {showRoutes && (
                <div className="mt-4 flex items-center justify-between">
                  <div className={`flex items-center space-x-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Current Route</span>
                    </div>
                    {selectedRoute && (
                      <div className="flex items-center space-x-1">
                        <Navigation className="w-3 h-3" />
                        <span>{routes.find(r => r.id === selectedRoute)?.name}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const routeToNavigate = routes.find(r => r.id === selectedRoute) || routes[0];
                      if (routeToNavigate) openInGoogleMaps();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                  </button>
                </div>
              )}
            </div>

            {/* Route Options */}
            {showRoutes && routes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Route Options</h3>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{routes.length} routes found</span>
                </div>

                {routes.map((routeItem) => (
                  <div 
                    key={routeItem.id}
                    className={`rounded-xl p-6 shadow-sm border-2 transition-all cursor-pointer ${
                      selectedRoute === routeItem.id 
                        ? isDarkMode ? 'border-orange-500 bg-orange-900/20' : 'border-orange-500 bg-orange-50'
                        : isDarkMode ? 'border-transparent hover:border-gray-600 bg-gray-800' : 'border-transparent hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => handleSelectRoute(routeItem.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${getPolylineColor(routeItem.polylineColor)}`}></div>
                        <div>
                          <h4 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{routeItem.name}</h4>
                          <div className={`flex items-center space-x-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <span className="flex items-center">
                              <Navigation className="w-4 h-4 mr-1" />
                              {routeItem.distance}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {routeItem.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSafetyColor(routeItem.safetyScore)}`}>
                          {routeItem.safetyScore}% Safe
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{routeItem.safetyBadge}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Safety Rating</div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{routeItem.incidents}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recent Incidents</div>
                      </div>
                      <div className={`text-center p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCrowdLevelColor(routeItem.crowdLevel)}`}>
                          {routeItem.crowdLevel} Traffic
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Safety Features</h5>
                      <div className="flex flex-wrap gap-2">
                        {routeItem.safetyFeatures.map((feature, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {routeItem.warnings.length > 0 && (
                      <div className="mb-4">
                        <h5 className={`font-medium mb-2 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                          Warnings
                        </h5>
                        <div className="space-y-1">
                          {routeItem.warnings.map((warning, idx) => (
                            <div key={idx} className={`text-sm px-3 py-2 rounded ${
                              isDarkMode ? 'text-orange-300 bg-orange-900/20' : 'text-orange-700 bg-orange-50'
                            }`}>
                              {warning}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openInGoogleMaps();
                          }}
                          className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center space-x-1"
                        >
                          <Car className="w-4 h-4" />
                          <span>Navigate</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareRoute(routeItem);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveRoute(routeItem);
                          }}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>
                      
                      {selectedRoute === routeItem.id && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openInGoogleMaps();
                          }}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                        >
                          Start Navigation
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state when no routes */}
            {!showRoutes && (
              <div className={`rounded-xl p-8 shadow-sm text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className={`text-xl font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Find Your Safe Route</h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Enter any two locations in India to get multiple route options with detailed safety analysis.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className={`border rounded-lg p-4 ${
                    isDarkMode ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'
                  }`}>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-900'}`}>Example Routes:</h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                      <li>• India Gate to Red Fort</li>
                      <li>• Delhi to Jaipur</li>
                      <li>• Shimla to Rishikesh/Haridwar</li>
                      <li>• Manali to Jim Corbett National Park</li>
                      <li>• India Gate to Mathura–Vrindavan</li>
                    </ul>
                  </div>
                  <div className={`border rounded-lg p-4 ${
                    isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                  }`}>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>Safety Features:</h4>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>
                      <li>• Real-time traffic analysis</li>
                      <li>• Highway safety ratings</li>
                      <li>• Weather conditions</li>
                      <li>• Police checkpoint info</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeRouteDashboard;