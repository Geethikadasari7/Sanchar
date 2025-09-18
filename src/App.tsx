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
import { AuthProvider } from './context/AuthContext';

// 404 Not Found component
const NotFound = () => (
  <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-center">
    <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
    <p className="text-lg text-gray-600 mb-2">
      The page you're looking for doesn't exist.
    </p>
    <p className="text-sm text-gray-500">
      Current path: {window.location.pathname}
    </p>
    <button 
      onClick={() => window.history.back()} 
      className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
    >
      Go Back
    </button>
  </div>
);

function App() {
  console.log('App component rendering...');

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/tourist" element={<TouristRegistration />} />
              <Route path="/register/officer" element={<OfficerRegistration />} />

              {/* Tourist Dashboard wrapper handles navigate */}
              <Route path="/dashboard/tourist" element={<TouristDashboardWrapper />} />

              <Route path="/dashboard/officer" element={<OfficerDashboard />} />
              <Route path="/dashboard/language" element={<LanguageDashboard />} />
              <Route path="/dashboard/helplines" element={<HelplinesDashboard />} />
              <Route path="/dashboard/safe-route" element={<SafeRouteDashboard />} />
              <Route path="/dashboard/lost-found" element={<LostFoundDashboard />} />
              <Route path="/dashboard/places" element={<PlacesDashboard />} />

              {/* FIX: Pass required props */}
              <Route
                path="/dashboard/bookings"
                element={
                  <BookingsDashboard
                    onBack={() => window.history.back()}
                    isDarkMode={false}
                  />
                }
              />
              <Route
                path="/dashboard/contact-guide"
                element={
                  <GuideDashboard
                    onBack={() => window.history.back()}
                    isDarkMode={false}
                  />
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

// Wrapper to inject navigate into TouristDashboard
function TouristDashboardWrapper() {
  const navigate = useNavigate();

  return (
    <TouristDashboard
      navigate={(screen) => {
        switch (screen) {
          case 'bookings':
            navigate('/dashboard/bookings');
            break;
          case 'guide':
            navigate('/dashboard/contact-guide');
            break;
          case 'helplines':
            navigate('/dashboard/helplines');
            break;
          case 'language':
            navigate('/dashboard/language');
            break;
          case 'lost-found':
            navigate('/dashboard/lost-found');
            break;
          case 'places':
            navigate('/dashboard/places');
            break;
          case 'safe-route':
            navigate('/dashboard/safe-route');
            break;
          default:
            navigate('/dashboard/tourist');
        }
      }}
    />
  );
}

export default App;