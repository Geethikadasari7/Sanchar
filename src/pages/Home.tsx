import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Shield, Clock, 
  ChevronLeft, ChevronRight, 
  Smartphone, MapPin, Languages,
  ArrowRight, Phone,
  Facebook, Instagram, Twitter, Linkedin
} from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    tourists: 0,
    safety: 0,
    monitoring: 0,
    states: 0
  });

  const scrollToHero = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroImages = [
  {
    url: 'images/Tajmahal.jpeg',
    alt: 'Taj Mahal in Agra, India â€" iconic white marble monument'
  },
  {
    url: 'images/Munnnar.jpg',
    alt: 'Munnar, Kerala â€" lush green tea plantations and misty hills'
  },
  {
    url: 'images/Gangaaarti.jpg',
    alt: 'Ganga Aarti in Varanasi â€" priests performing evening ritual with lamps on the ghats'
  },
  {
    url: 'images/Kodaikanal.jpg',
    alt: 'Kodaikanal, Tamil Nadu â€" scenic hill station with lakes and mountains'
  },
  {
    url: 'images/Bharatanatyam.png',
    alt: 'Group of dancers performing Bharatanatyam â€" traditional Indian classical dance'
  },
  {
    url: 'images/Beach.jpg',
    alt: 'Goa beach â€" golden sands, palm trees, and ocean waves at sunset'
  }
  
];


  const features = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Digital ID',
      description: 'Secure blockchain-backed digital identification for every tourist'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'AI Safety Score',
      description: 'Real-time safety assessment using advanced AI algorithms'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Geo-fencing Alerts',
      description: 'Location-based safety alerts and restricted area notifications'
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: 'Multilingual Support',
      description: '22+ Indian languages with voice translation capabilities'
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Animate stats on load
  useEffect(() => {
    const animateStats = () => {
      const targets = { tourists: 2500000, safety: 999, monitoring: 247, states: 19 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          tourists: Math.floor(targets.tourists * progress),
          safety: Math.floor(targets.safety * progress) / 10,
          monitoring: Math.floor(targets.monitoring * progress) / 10,
          states: Math.floor(targets.states * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);
    };
    
    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
{/* Hero Section */}
<section id="hero" className="relative w-screen left-1/2 transform -translate-x-1/2 h-screen overflow-hidden">
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

  {/* Image Carousel */}
  <div className="absolute inset-0">
    {heroImages.map((image, index) => (
      <div
        key={index}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          index === currentSlide ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={image.url}
          alt={image.alt}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>
    ))}
  </div>

  {/* Navigation Arrows */}
  <button
    onClick={prevSlide}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition-all"
  >
    <ChevronLeft className="w-6 h-6 text-white" />
  </button>
  <button
    onClick={nextSlide}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition-all"
  >
    <ChevronRight className="w-6 h-6 text-white" />
  </button>

  {/* Hero Content */}
  <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
    <div className="text-center text-white max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Ensuring Safety for Every Step You Take in India
      </h1>
      <p className="text-xl md:text-2xl mb-8 opacity-90">
        Advanced tourist safety platform with AI-powered monitoring and real-time assistance
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/register/tourist"
          className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center"
        >
          Register Digital ID
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
        <Link
          to="/about"
          className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center"
        >
          Explore Safety Features
        </Link>
      </div>
    </div>
  </div>

  {/* Slide Indicators */}
  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
    {heroImages.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-3 h-3 rounded-full transition-all ${
          index === currentSlide ? 'bg-orange-500' : 'bg-white bg-opacity-50'
        }`}
      />
    ))}
  </div>
</section>


      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.tourists.toLocaleString()}+
              </div>
              <div className="text-gray-600">Tourists Protected</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.safety.toFixed(1)}%
              </div>
              <div className="text-gray-600">Safety Score</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                24/7
              </div>
              <div className="text-gray-600">Real-time Monitoring</div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                <Phone className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">19+</div>
              <div className="text-gray-600">Helplines</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Safety Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology combined with local expertise to ensure your safety throughout India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl border border-orange-100 hover:shadow-lg transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4 mx-auto text-orange-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Time Alerts Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Real Time Alerts
          </h2>
          <p className="text-gray-600 text-center mb-12">
            Stay informed instantly. See alerts, severity, and recommended actions at a glance.
          </p>
          
          <div className="md:flex md:gap-6 items-start">
            {/* Alerts List */}
            <div className="md:w-1/3 space-y-4">
              {[ 
                { type: "Safety", text: "Crowd density updates in real-time", color: "bg-orange-200", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l9 4v6c0 5-3 9-9 11S3 17 3 12V6l9-4z" />
                    </svg>
                  )
                },
                { type: "Weather", text: "Weather alerts and warnings", color: "bg-blue-200", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 014-4h1l1-4 1 4h1a4 4 0 014 4 4 4 0 01-4 4H7a4 4 0 01-4-4z" />
                    </svg>
                  )
                },
                { type: "Crime", text: "Safety alerts for your location", color: "bg-red-200", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" />
                    </svg>
                  )
                },
              ].map((alert, idx) => (
                <div
                  key={idx}
                  className={`${alert.color} rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-2xl transition flex items-start gap-3`}
                >
                  {/* Icon */}
                  <div>{alert.icon}</div>
                  <div>
                    <div className="text-lg font-semibold mb-1">{alert.type}</div>
                    <p className="text-gray-700 text-sm">{alert.text}</p>
                    <p className="text-gray-500 text-xs mt-2">Updated just now</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Alert Detail Panel */}
            <div className="md:w-2/3 mt-6 md:mt-0 bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500 flex flex-col" style={{ minHeight: "350px" }}>
              {/* Homepage-Friendly Feature Boxes */}
              <div className="flex gap-4 mb-6">
                <div className="w-1/3 h-32 bg-orange-100 rounded-2xl flex flex-col items-center justify-center shadow-lg p-4 text-center">
                  <p className="text-lg font-semibold text-orange-600 mb-2">Stay Informed</p>
                  <p className="text-gray-700 text-sm">Receive real-time safety alerts instantly wherever you travel.</p>
                </div>
                <div className="w-1/3 h-32 bg-orange-100 rounded-2xl flex flex-col items-center justify-center shadow-lg p-4 text-center">
                  <p className="text-lg font-semibold text-orange-600 mb-2">Know Your Safe Zones</p>
                  <p className="text-gray-700 text-sm">Check active safe zones and navigate securely across your location.</p>
                </div>
                <div className="w-1/3 h-32 bg-orange-100 rounded-2xl flex flex-col items-center justify-center shadow-lg p-4 text-center">
                  <p className="text-lg font-semibold text-orange-600 mb-2">Share & Protect</p>
                  <p className="text-gray-700 text-sm">Keep your family updated by sharing alerts and locations seamlessly.</p>
                </div>
              </div>

              {/* How Alert System Works */}
              <div className="mt-6 flex-1">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Aggregates real-time alerts from official sources and verified channels.</li>
                  <li>Provides location-based notifications tailored to your current area.</li>
                  <li>Highlights severity levels and recommended actions for each alert type.</li>
                  <li>Allows sharing alerts with family or friends for increased safety awareness.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Family & Travel Tracking Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
            Family & Travel Tracking
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Monitor your loved ones' safety in real-time and explore confidently.
          </p>

          {/*Family-Alert Pic */}
<div className="bg-orange-50 rounded-2xl shadow-lg h-[500px] mb-6 overflow-hidden relative border-2 border-orange-300">
  <img
    src="images/FamilyTracking.jpg"
    alt="Family Tracking"
    className="w-full h-full object-cover"
  />
  {/* Simulated live markers */}
  <div className="absolute top-20 left-40 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
  <div className="absolute top-40 left-60 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
</div>


          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-orange-50 rounded-2xl p-6 shadow-lg border-l-4 border-orange-400">
              <h3 className="font-semibold mb-2 text-orange-600">Live Location</h3>
              <p className="text-gray-700 text-sm">
                View your own and family members' current location in real-time on the map.
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6 shadow-lg border-l-4 border-orange-400">
              <h3 className="font-semibold mb-2 text-orange-600">Safety Zones</h3>
              <p className="text-gray-700 text-sm">
                Set safe and restricted zones, receive notifications when entering or leaving these areas.
              </p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6 shadow-lg border-l-4 border-orange-400">
              <h3 className="font-semibold mb-2 text-orange-600">Activity History</h3>
              <p className="text-gray-700 text-sm">
                Check the historical path and movement patterns of family members for complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Explore India Safely?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust Sanchar for their safety and peace of mind
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/tourist"
              className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a
              href="https://www.figma.com/proto/0wgO9Jsz0v4QC5Ypgks9ni/ToIndia?page-id=0%3A1&node-id=16-205&viewport=1730%2C-839%2C0.34&t=ooBDt4wOFr8V1KbG-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=13%3A21"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center"
            >
              Download Mobile App
              <Smartphone className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <button onClick={scrollToHero} className="hover:text-orange-200 bg-transparent border-none cursor-pointer text-white">Home</button>
            <Link to="/about" className="hover:text-orange-200">About</Link>
            <Link to="/privacy" className="hover:text-orange-200">Privacy</Link>
            <Link to="/terms" className="hover:text-orange-200">Terms</Link>
          </div>
          <div>© 2025 Sanchar. All Rights Reserved.</div>
          <div className="flex gap-4 md:mr-8">
            <a href="https://www.instagram.com/sanchar__?igsh=MXFwb2Z5aTdmY2N2bg==" className="hover:text-orange-200 cursor-pointer p-1 rounded-full hover:bg-orange-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/sanchar__?igsh=MXFwb2Z5aTdmY2N2bg==" className="hover:text-orange-200 cursor-pointer p-1 rounded-full hover:bg-orange-700 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/sanchar__?igsh=MXFwb2Z5aTdmY2N2bg==" className="hover:text-orange-200 cursor-pointer p-1 rounded-full hover:bg-orange-700 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/sanchar__?igsh=MXFwb2Z5aTdmY2N2bg==" className="hover:text-orange-200 cursor-pointer p-1 rounded-full hover:bg-orange-700 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;