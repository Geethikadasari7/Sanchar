import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PanicButton from './components/PanicButton';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import TouristRegistration from './pages/TouristRegistration';
import OfficerRegistration from './pages/OfficerRegistration';
import TouristDashboard from './pages/TouristDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import LanguageDashboard from './pages/dashboards/LanguageDashboard';
import HelplinesDashboard from './pages/dashboards/HelplinesDashboard';
import SafeRouteDashboard from './pages/dashboards/SafeRouteDashboard';
import LostFoundDashboard from './pages/dashboards/LostFoundDashboard';
import PlacesDashboard from './pages/dashboards/PlacesDashboard';
import GuideDashboard from './pages/dashboards/GuideDashboard';
import BookingsDashboard from './pages/dashboards/BookingsDashboard';
import FamilyTrackingDashboard from './pages/dashboards/FamilyTrackingDashboard';
import EFirDashboard from './pages/dashboards/EFirDashboard';
import { AuthProvider } from './context/AuthContext';

// 404 Not Found component
const NotFound: React.FC = () => {
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-2">
        The page you're looking for doesn't exist.
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Current path: {window.location.pathname}
      </p>
      <button 
        onClick={handleGoBack}
        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

// Wrapper to inject navigate into TouristDashboard
const TouristDashboardWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (screen: string) => {
    const routes: Record<string, string> = {
      'bookings': '/dashboard/bookings',
      'guide': '/dashboard/contact-guide',
      'helplines': '/dashboard/helplines',
      'language': '/dashboard/language',
      'lost-found': '/dashboard/lost-found',
      'places': '/dashboard/places',
      'safe-route': '/dashboard/safe-route',
      'family-tracking': '/dashboard/family-tracking',
      'e-fir': '/dashboard/e-fir'
    };

    const targetRoute = routes[screen];
    if (targetRoute) {
      navigate(targetRoute);
    } else {
      console.warn(`Unknown navigation screen: ${screen}`);
      navigate('/dashboard/tourist');
    }
  };

  return <TouristDashboard navigate={handleNavigation} />;
};

// Dashboard wrapper component for consistent onBack behavior
interface DashboardWrapperProps {
  children: React.ReactElement;
  includeDarkMode?: boolean;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children, includeDarkMode = true }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/dashboard/tourist');
    }
  };

  const props: any = { onBack: handleBack };
  if (includeDarkMode) {
    props.isDarkMode = false;
  }

  return React.cloneElement(children, props);
};

function App(): React.ReactElement {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/tourist" element={<TouristRegistration />} />
              <Route path="/register/officer" element={<OfficerRegistration />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard/tourist" element={<TouristDashboardWrapper />} />
              <Route path="/dashboard/officer" element={<OfficerDashboard />} />
              
              {/* Feature Dashboards - Simple ones without props */}
              <Route path="/dashboard/language" element={<LanguageDashboard />} />
              <Route path="/dashboard/helplines" element={<HelplinesDashboard />} />
              <Route path="/dashboard/safe-route" element={<SafeRouteDashboard />} />
              <Route path="/dashboard/lost-found" element={<LostFoundDashboard />} />
              <Route path="/dashboard/places" element={<PlacesDashboard />} />

              {/* Feature Dashboards - With props using wrapper */}
              <Route
                path="/dashboard/family-tracking"
                element={
                  <DashboardWrapper includeDarkMode={false}>
                    <FamilyTrackingDashboard onBack={() => {}} />
                  </DashboardWrapper>
                }
              />
              <Route
                path="/dashboard/e-fir"
                element={
                  <DashboardWrapper>
                    <EFirDashboard onBack={() => {}} isDarkMode={false} />
                  </DashboardWrapper>
                }
              />
              <Route
                path="/dashboard/bookings"
                element={
                  <DashboardWrapper includeDarkMode={false}>
                    <BookingsDashboard onBack={() => {}} />
                  </DashboardWrapper>
                }
              />
              <Route
                path="/dashboard/contact-guide"
                element={
                  <DashboardWrapper includeDarkMode={false}>
                    <GuideDashboard onBack={() => {}} />
                  </DashboardWrapper>
                }
              />

              {/* Catch all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <PanicButton />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;