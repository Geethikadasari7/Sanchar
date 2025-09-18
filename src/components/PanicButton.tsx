import { useState, useEffect } from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const PanicButton = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);

  // Check if current route should show panic button
  useEffect(() => {
    const checkRoute = () => {
      const currentPath = window.location.pathname;
      
      // Define routes where panic button should be visible
      const touristDashboardRoutes = [
        '/dashboard',
        '/tourist-dashboard',
        '/dashboard/',
        '/tourist-dashboard/',
        // Add any sub-routes of the tourist dashboard
        '/dashboard/profile',
        '/dashboard/emergency-contacts',
        '/dashboard/travel-history',
        '/dashboard/safety-alerts',
        '/dashboard/location-sharing',
        '/dashboard/help-center',
        '/dashboard/settings',
        // Add more dashboard routes as needed
      ];

      // Check if current path matches any tourist dashboard route
      const isInTouristDashboard = touristDashboardRoutes.some(route => 
        currentPath === route || currentPath.startsWith(route + '/')
      );

      setShouldShowButton(isInTouristDashboard);
    };

    // Check route on component mount
    checkRoute();

    // Listen for route changes (for SPAs)
    const handlePopState = () => {
      checkRoute();
    };

    window.addEventListener('popstate', handlePopState);

    // For React Router or other SPA routing libraries
    // You might need to listen to history changes differently
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(checkRoute, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(checkRoute, 0);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  const handlePanicClick = () => {
    setShowConfirm(true);
  };

  const confirmPanic = () => {
    setIsTriggered(true);
    setShowConfirm(false);
    
    // Simulate emergency alert
    toast.error('EMERGENCY ALERT SENT! Contacting authorities...', {
      duration: 5000,
      icon: '🚨',
    });
    
    // Simulate auto-call after 2 seconds
    setTimeout(() => {
      toast.success('Connecting to Emergency Helpline 112...', {
        duration: 3000,
        icon: '📞',
      });
    }, 2000);
    
    // Reset button after 10 seconds
    setTimeout(() => {
      setIsTriggered(false);
    }, 10000);
  };

  const cancelPanic = () => {
    setShowConfirm(false);
  };

  // Don't render if not in tourist dashboard
  if (!shouldShowButton) {
    return null;
  }

  return (
    <>
      {/* Panic Button */}
      <button
        onClick={handlePanicClick}
        disabled={isTriggered}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 z-50 ${
          isTriggered
            ? 'bg-red-600 animate-pulse cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700 hover:shadow-xl'
        } ${showConfirm ? 'scale-125' : ''}`}
        style={{
          boxShadow: isTriggered
            ? '0 0 30px rgba(239, 68, 68, 0.5)'
            : '0 10px 25px rgba(234, 88, 12, 0.3)',
        }}
      >
        <div className="flex items-center justify-center w-full h-full text-white">
          {isTriggered ? (
            <Phone size={24} className="animate-bounce" />
          ) : (
            <AlertTriangle size={24} />
          )}
        </div>
        
        {/* Ripple effect */}
        <div className={`absolute inset-0 rounded-full ${
          isTriggered 
            ? 'animate-ping bg-red-400'
            : 'animate-pulse bg-orange-400 opacity-30'
        }`} />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Emergency Alert
              </h3>
              
              <p className="text-gray-600 mb-6">
                This will immediately alert authorities and your emergency contacts. 
                Are you sure you want to proceed?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelPanic}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPanic}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Send Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PanicButton;