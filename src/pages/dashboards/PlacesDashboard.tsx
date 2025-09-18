import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Clock, 
  Users, Shield, Star, Plus, Filter,
  Eye, Navigation, Bookmark, Share2,
  Music, Camera, Heart, Award
} from 'lucide-react';
import toast from 'react-hot-toast';


interface Place {
  id: string;
  name: string;
  type: 'festival' | 'attraction' | 'restaurant' | 'shopping';
  image: string;
  description: string;
  location: string;
  distance: string;
  safetyLevel: number;
  crowdLevel: 'Low' | 'Medium' | 'High';
  rating: number;
  reviews: number;
  openHours?: string;
  date?: string;
  duration?: string;
  price?: string;
  culturalSignificance?: string;
  safetyTips?: string[];
  features: string[];
}

const PlacesDashboard = () => {
  const [activeTab, setActiveTab] = useState<'nearby' | 'festivals' | 'famous'>('nearby');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDistance, setFilterDistance] = useState('all');
  const [filterSafety, setFilterSafety] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const nearbyFestivals: Place[] = [
    {
      id: '1',
      name: 'Diwali Celebration at India Gate',
      type: 'festival',
      image: 'https://i.pinimg.com/1200x/21/a6/4d/21a64d31f38a9573dda7bbbdc1dc07c0.jpg',
      description: 'Grand Diwali celebration with traditional performances, fireworks, and cultural programs.',
      location: 'India Gate, Delhi',
      distance: '2.5 km',
      safetyLevel: 92,
      crowdLevel: 'High',
      rating: 4.8,
      reviews: 1250,
      date: '2025-01-20',
      duration: '6:00 PM - 10:00 PM',
      culturalSignificance: 'Festival of Lights celebrating the victory of light over darkness',
      safetyTips: ['Stay in groups', 'Keep valuables secure', 'Follow crowd control instructions'],
      features: ['Traditional Dance', 'Fireworks', 'Food Stalls', 'Cultural Programs']
    },
    {
      id: '2',
      name: 'Classical Music Festival',
      type: 'festival',
      image: 'https://i.pinimg.com/736x/f5/99/a2/f599a291c1bccf91650fa60b2fdfd350.jpg',
      description: 'Three-day classical music festival featuring renowned Indian musicians.',
      location: 'Red Fort, Delhi',
      distance: '1.8 km',
      safetyLevel: 88,
      crowdLevel: 'Medium',
      rating: 4.6,
      reviews: 890,
      date: '2025-01-25',
      duration: '7:00 PM - 11:00 PM',
      culturalSignificance: 'Celebration of Indian classical music traditions',
      safetyTips: ['Arrive early for better seating', 'Stay hydrated', 'Use designated entry/exit points'],
      features: ['Live Performances', 'Traditional Instruments', 'Cultural Workshops', 'Art Exhibition']
    }
  ];

  const famousFestivals: Place[] = [
    {
      id: '3',
      name: 'Holi Festival of Colors',
      type: 'festival',
      image: 'https://i.pinimg.com/1200x/4b/10/f1/4b10f1888e3e0c97425de555bcdb8a4e.jpg',
      description: 'The most vibrant festival of India celebrating the arrival of spring with colors.',
      location: 'Various locations across Delhi',
      distance: 'Multiple venues',
      safetyLevel: 85,
      crowdLevel: 'High',
      rating: 4.9,
      reviews: 2100,
      date: '2025-03-14',
      duration: 'All day celebration',
      culturalSignificance: 'Ancient Hindu festival celebrating love, spring, and the triumph of good over evil',
      safetyTips: ['Wear old clothes', 'Protect eyes and skin', 'Stay with groups', 'Use natural colors'],
      features: ['Color Throwing', 'Traditional Music', 'Dance Performances', 'Special Foods']
    },
    {
      id: '4',
      name: 'Durga Puja Celebration',
      type: 'festival',
      image: 'https://i.pinimg.com/1200x/b4/78/83/b478830926b0e646a5e4f2fb2b53ca28.jpg',
      description: 'Grand celebration honoring Goddess Durga with elaborate decorations and cultural programs.',
      location: 'CR Park, Delhi',
      distance: '8.5 km',
      safetyLevel: 90,
      crowdLevel: 'High',
      rating: 4.7,
      reviews: 1680,
      date: '2025-10-10',
      duration: '5 days celebration',
      culturalSignificance: 'Major Hindu festival celebrating the divine feminine power',
      safetyTips: ['Follow pandal guidelines', 'Respect religious customs', 'Keep emergency contacts handy'],
      features: ['Elaborate Pandals', 'Cultural Programs', 'Traditional Food', 'Art Exhibitions']
    }
  ];

  const recommendedPlaces: Place[] = [
    {
      id: '5',
      name: 'Red Fort (Lal Qila)',
      type: 'attraction',
      image: 'https://i.pinimg.com/736x/1b/9e/79/1b9e79f1786a93f96cd54531b431c04b.jpg',
      description: 'Historic fortified palace and UNESCO World Heritage Site, symbol of Mughal power.',
      location: 'Old Delhi',
      distance: '1.2 km',
      safetyLevel: 95,
      crowdLevel: 'Medium',
      rating: 4.5,
      reviews: 3200,
      openHours: '9:30 AM - 4:30 PM',
      price: '₹35 (Indians), ₹500 (Foreigners)',
      culturalSignificance: 'Main residence of Mughal emperors for 200 years',
      safetyTips: ['Carry water bottle', 'Wear comfortable shoes', 'Follow guide instructions'],
      features: ['Mughal Architecture', 'Museum', 'Light & Sound Show', 'Gardens']
    },
    {
      id: '6',
      name: 'Lotus Temple',
      type: 'attraction',
      image: 'https://i.pinimg.com/1200x/ad/ba/34/adba34645a5ed9db122495c894ea526c.jpg',
      description: 'Architectural marvel shaped like a lotus flower, known for its serene atmosphere.',
      location: 'Kalkaji, Delhi',
      distance: '12.8 km',
      safetyLevel: 98,
      crowdLevel: 'Low',
      rating: 4.6,
      reviews: 2800,
      openHours: '9:00 AM - 5:30 PM',
      price: 'Free entry',
      culturalSignificance: 'Bahá\'í House of Worship promoting unity of all religions',
      safetyTips: ['Maintain silence inside', 'Remove shoes before entering', 'No photography inside'],
      features: ['Modern Architecture', 'Meditation Hall', 'Gardens', 'Information Center']
    },
    {
      id: '7',
      name: 'Chandni Chowk Market',
      type: 'shopping',
      image: 'https://i.pinimg.com/1200x/bd/81/1e/bd811e64e0e5e5b6bb731732b81eb129.jpg',
      description: 'Historic market known for traditional Indian goods, street food, and vibrant atmosphere.',
      location: 'Old Delhi',
      distance: '2.1 km',
      safetyLevel: 78,
      crowdLevel: 'High',
      rating: 4.3,
      reviews: 1950,
      openHours: '10:00 AM - 8:00 PM',
      culturalSignificance: 'One of oldest and busiest markets in Old Delhi, built in 17th century',
      safetyTips: ['Keep valuables secure', 'Stay alert in crowds', 'Bargain respectfully', 'Try street food carefully'],
      features: ['Traditional Shopping', 'Street Food', 'Spice Market', 'Jewelry Shops']
    },
    {
      id: '8',
      name: 'Karim\'s Restaurant',
      type: 'restaurant',
      image: 'https://i.pinimg.com/1200x/35/08/da/3508da64dfe3352e26e5f6fb4e175509.jpg',
      description: 'Legendary Mughlai restaurant serving authentic Delhi cuisine since 1913.',
      location: 'Jama Masjid, Delhi',
      distance: '1.9 km',
      safetyLevel: 85,
      crowdLevel: 'Medium',
      rating: 4.4,
      reviews: 2400,
      openHours: '11:00 AM - 12:00 AM',
      price: '₹300-800 per person',
      culturalSignificance: 'Historic restaurant preserving traditional Mughlai cooking methods',
      safetyTips: ['Check food freshness', 'Carry hand sanitizer', 'Inform about dietary restrictions'],
      features: ['Mughlai Cuisine', 'Historic Ambiance', 'Traditional Recipes', 'Cultural Experience']
    }
  ];

  const getAllPlaces = () => {
    switch (activeTab) {
      case 'nearby':
        return nearbyFestivals;
      case 'festivals':
        return famousFestivals;
      case 'famous':
        return recommendedPlaces;
      default:
        return [];
    }
  };

  const filteredPlaces = getAllPlaces().filter(place => {
    const matchesCategory = filterCategory === 'all' || place.type === filterCategory;
    const matchesDistance = filterDistance === 'all' || 
      (filterDistance === 'near' && parseFloat(place.distance) <= 5) ||
      (filterDistance === 'far' && parseFloat(place.distance) > 5);
    const matchesSafety = filterSafety === 'all' ||
      (filterSafety === 'high' && place.safetyLevel >= 90) ||
      (filterSafety === 'medium' && place.safetyLevel >= 70 && place.safetyLevel < 90) ||
      (filterSafety === 'low' && place.safetyLevel < 70);
    
    return matchesCategory && matchesDistance && matchesSafety;
  });

  const addToItinerary = (place: Place) => {
    toast.success(`${place.name} added to your itinerary!`);
  };

  const viewOnMap = (place: Place) => {
    toast.success(`Opening ${place.name} on map...`);
  };

  const sharePlace = (place: Place) => {
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: place.description,
        url: window.location.href
      });
    } else {
      toast.success('Place details copied to clipboard!');
    }
  };

  const savePlace = (place: Place) => {
    toast.success(`${place.name} saved to favorites!`);
  };

  const getSafetyColor = (level: number) => {
    if (level >= 90) return 'text-green-600 bg-green-100';
    if (level >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'festival': return <Music className="w-4 h-4" />;
      case 'attraction': return <Camera className="w-4 h-4" />;
      case 'restaurant': return <Heart className="w-4 h-4" />;
      case 'shopping': return <Award className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard/tourist"
              className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Places & Festivals</h1>
              <p className="text-gray-600">Discover amazing places and cultural events</p>
            </div>
          </div>
          <MapPin className="w-8 h-8 text-orange-600" />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('nearby')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'nearby'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Nearby Festivals
            </button>
            <button
              onClick={() => setActiveTab('festivals')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'festivals'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Famous Festivals
            </button>
            <button
              onClick={() => setActiveTab('famous')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'famous'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Recommended Places
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              <option value="festival">Festivals</option>
              <option value="attraction">Attractions</option>
              <option value="restaurant">Restaurants</option>
              <option value="shopping">Shopping</option>
            </select>

            <select
              value={filterDistance}
              onChange={(e) => setFilterDistance(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Distances</option>
              <option value="near">Within 5 km</option>
              <option value="far">More than 5 km</option>
            </select>

            <select
              value={filterSafety}
              onChange={(e) => setFilterSafety(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Safety Levels</option>
              <option value="high">High Safety (90%+)</option>
              <option value="medium">Medium Safety (70-89%)</option>
              <option value="low">Lower Safety (&lt;70%)</option>
            </select>
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map(place => (
            <div key={place.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getSafetyColor(place.safetyLevel)}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {place.safetyLevel}%
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getCrowdColor(place.crowdLevel)}`}>
                    <Users className="w-3 h-3 mr-1" />
                    {place.crowdLevel}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => savePlace(place)}
                    className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(place.type)}
                    <h3 className="font-semibold text-gray-900 text-lg">{place.name}</h3>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {place.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{place.location}</span>
                    <span className="ml-auto font-medium">{place.distance}</span>
                  </div>

                  {place.date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{new Date(place.date).toLocaleDateString()}</span>
                    </div>
                  )}

                  {place.openHours && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{place.openHours}</span>
                    </div>
                  )}

                  {place.duration && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{place.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{place.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({place.reviews})</span>
                    </div>
                    {place.price && (
                      <span className="text-sm font-medium text-orange-600">{place.price}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {place.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                  {place.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{place.features.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => addToItinerary(place)}
                    className="flex-1 bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                  <button
                    onClick={() => setSelectedPlace(place)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => viewOnMap(place)}
                    className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No places found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters to see more results.
            </p>
          </div>
        )}

        {/* Place Detail Modal */}
        {selectedPlace && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <img
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  ×
                </button>
                <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getSafetyColor(selectedPlace.safetyLevel)}`}>
                    <Shield className="w-4 h-4 mr-1" />
                    {selectedPlace.safetyLevel}% Safe
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getCrowdColor(selectedPlace.crowdLevel)}`}>
                    <Users className="w-4 h-4 mr-1" />
                    {selectedPlace.crowdLevel} Crowd
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlace.name}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedPlace.location}
                      </div>
                      <div className="flex items-center">
                        <Navigation className="w-4 h-4 mr-1" />
                        {selectedPlace.distance}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {selectedPlace.rating} ({selectedPlace.reviews} reviews)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedPlace.description}</p>
                    </div>

                    {selectedPlace.culturalSignificance && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Cultural Significance</h3>
                        <p className="text-gray-600">{selectedPlace.culturalSignificance}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlace.features.map((feature, index) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">Quick Info</h3>
                      <div className="space-y-2 text-sm">
                        {selectedPlace.openHours && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hours:</span>
                            <span className="font-medium">{selectedPlace.openHours}</span>
                          </div>
                        )}
                        {selectedPlace.date && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{new Date(selectedPlace.date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {selectedPlace.duration && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{selectedPlace.duration}</span>
                          </div>
                        )}
                        {selectedPlace.price && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-medium text-orange-600">{selectedPlace.price}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedPlace.safetyTips && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Safety Tips</h3>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {selectedPlace.safetyTips.map((tip, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-6 border-t mt-6">
                  <button
                    onClick={() => addToItinerary(selectedPlace)}
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Itinerary</span>
                  </button>
                  <button
                    onClick={() => viewOnMap(selectedPlace)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>View on Map</span>
                  </button>
                  <button
                    onClick={() => sharePlace(selectedPlace)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
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

export default PlacesDashboard;