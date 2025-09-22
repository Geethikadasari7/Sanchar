import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Star, 
  MapPin, 
  Calendar,
  Heart,
  Share2,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Shield,
  CheckCircle,
  Eye,
  Navigation,
  Bed,
  Bath,
  Home,
  SlidersHorizontal,
  Train,
  Plane,
  Hotel,
  Camera,
  TreePine,
  Utensils,
  Building2Icon,
  Award,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Gift,
  Globe,
  X,
  ShoppingBag,
  Package,
  Headphones,
  BadgeCheck,
  ShieldCheckIcon,
  Sun,
  Moon,
  ChevronDown,
  Mountain,
  Palmtree,
  Church,
  Building,
  Ship,
  Fish,
  Crown
} from 'lucide-react';

interface BookingsDashboardProps {
  onBack: () => void;
}

// Dynamic image URL configuration - easily replaceable
const IMAGE_URLS = {
  // Hotels
  hotel_oberoi: 'https://i.pinimg.com/1200x/c6/8e/ac/c68eaca77408a1917b674646a9e18844.jpg',
  hotel_radisson: 'https://i.pinimg.com/736x/9f/f4/4d/9ff44d93b25137366b6748a52db25d7f.jpg',
  hotel_oberoi_amarvilas: 'https://i.pinimg.com/1200x/d2/55/cd/d255cd019d8606c4f34d9da47c805530.jpg',
  hotel_club_mahindra: 'https://i.pinimg.com/1200x/96/4b/bd/964bbdcbdd9f992816f8a90c325752f0.jpg',
  
  // Restaurants
  restaurant_karims: 'https://i.pinimg.com/736x/a8/de/d3/a8ded342ac92b01130c954832b0a7a84.jpg',
  restaurant_indian_accent: 'https://i.pinimg.com/736x/e7/1d/ef/e71defb276c5a9b8e66fad540d15bc79.jpg',
  
  // Activities
  activity_red_fort: 'https://i.pinimg.com/1200x/75/2a/55/752a5576382db942b92317f80de98b87.jpg',
  activity_cooking_class: 'https://i.pinimg.com/1200x/1f/b4/ef/1fb4ef23792876b4b36a89c7458aadb6.jpg',
  
  // Transportation
  train_rajdhani: 'https://i.pinimg.com/1200x/61/53/33/615333de6c0725c7e8dd070fa29d68d8.jpg',
  train_shatabdi: 'https://i.pinimg.com/1200x/ce/37/f6/ce37f69f570407f716605c2d3ca51444.jpg',
  taxi_ola: 'https://i.pinimg.com/1200x/e9/3a/6e/e93a6ead3f6784c21a6620d1102ea88f.jpg',
  taxi_uber: 'https://i.pinimg.com/736x/eb/85/79/eb857942a973caa234cd6dd1376b1895.jpg',
  flight_indigo: 'https://i.pinimg.com/736x/e7/10/08/e71008f8fe31dd8d6fd39ea20ddb2904.jpg',
  flight_air_india: 'https://i.pinimg.com/1200x/59/ee/cf/59eecfaf857c935b87c61a4ad58de553.jpg',
  
  // Shopping & Services
  shopping_fashion: 'https://i.pinimg.com/1200x/c9/e8/8e/c9e88e52ad0ab056e66e5b956bc786f9.jpg',
  shopping_electronics: 'https://i.pinimg.com/1200x/83/89/d6/8389d652d95f8f607eb68480a16c5fc4.jpg',
  service_ac_repair: 'https://i.pinimg.com/736x/58/6b/19/586b19f8e7774e90ed4b5193d11c9e4c.jpg',
  service_home_cleaning: 'https://i.pinimg.com/736x/5a/a0/94/5aa0941120da721047b4ca30f8753944.jpg'
};

const BookingsDashboard: React.FC<BookingsDashboardProps> = ({ onBack }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Hotels');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'partners'>('explore');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [selectedDates, setSelectedDates] = useState({
    checkIn: '2024-01-15',
    checkOut: '2024-01-18'
  });
  const [currentLocation, setCurrentLocation] = useState('New Delhi, India');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState<string>('All');

  // Major Indian cities and tourist destinations
  const indianLocations = [
    // Metro Cities
    { city: 'New Delhi', state: 'Delhi', country: 'India', popular: true, type: 'Metro' },
    { city: 'Mumbai', state: 'Maharashtra', country: 'India', popular: true, type: 'Metro' },
    { city: 'Bangalore', state: 'Karnataka', country: 'India', popular: true, type: 'Metro' },
    { city: 'Kolkata', state: 'West Bengal', country: 'India', popular: true, type: 'Metro' },
    { city: 'Chennai', state: 'Tamil Nadu', country: 'India', popular: true, type: 'Metro' },
    { city: 'Hyderabad', state: 'Telangana', country: 'India', popular: true, type: 'Metro' },
    { city: 'Pune', state: 'Maharashtra', country: 'India', popular: true, type: 'Metro' },
    
    // Tourist Destinations
    { city: 'Goa', state: 'Goa', country: 'India', popular: true, type: 'Beach' },
    { city: 'Jaipur', state: 'Rajasthan', country: 'India', popular: true, type: 'Heritage' },
    { city: 'Udaipur', state: 'Rajasthan', country: 'India', popular: true, type: 'Heritage' },
    { city: 'Agra', state: 'Uttar Pradesh', country: 'India', popular: true, type: 'Heritage' },
    { city: 'Varanasi', state: 'Uttar Pradesh', country: 'India', popular: true, type: 'Spiritual' },
    { city: 'Rishikesh', state: 'Uttarakhand', country: 'India', popular: true, type: 'Spiritual' },
    { city: 'Manali', state: 'Himachal Pradesh', country: 'India', popular: true, type: 'Hill Station' },
    { city: 'Shimla', state: 'Himachal Pradesh', country: 'India', popular: true, type: 'Hill Station' },
    { city: 'Darjeeling', state: 'West Bengal', country: 'India', popular: true, type: 'Hill Station' },
    { city: 'Ooty', state: 'Tamil Nadu', country: 'India', popular: true, type: 'Hill Station' },
    { city: 'Munnar', state: 'Kerala', country: 'India', popular: true, type: 'Hill Station' },
    { city: 'Kochi', state: 'Kerala', country: 'India', popular: true, type: 'Coastal' },
    { city: 'Alleppey', state: 'Kerala', country: 'India', popular: true, type: 'Backwaters' },
    { city: 'Mysore', state: 'Karnataka', country: 'India', popular: true, type: 'Heritage' },
    { city: 'Pushkar', state: 'Rajasthan', country: 'India', popular: true, type: 'Spiritual' },
    { city: 'Mount Abu', state: 'Rajasthan', country: 'India', popular: true, type: 'Hill Station' },
    { city: 'Hampi', state: 'Karnataka', country: 'India', popular: true, type: 'Heritage' },
    { city: 'Amritsar', state: 'Punjab', country: 'India', popular: true, type: 'Spiritual' },
    { city: 'Haridwar', state: 'Uttarakhand', country: 'India', popular: true, type: 'Spiritual' },
    { city: 'Varkala', state: 'Kerala', country: 'India', popular: true, type: 'Coastal' },
    { city: 'Pondicherry', state: 'Puducherry', country: 'India', popular: true, type: 'Coastal' },
    { city: 'Kumarakom', state: 'Kerala', country: 'India', popular: true, type: 'Backwaters' },
    { city: 'Kollam', state: 'Kerala', country: 'India', popular: true, type: 'Backwaters' },
    
    // Business Cities
    { city: 'Ahmedabad', state: 'Gujarat', country: 'India', popular: false, type: 'Business' },
    { city: 'Surat', state: 'Gujarat', country: 'India', popular: false, type: 'Business' },
    { city: 'Indore', state: 'Madhya Pradesh', country: 'India', popular: false, type: 'Business' },
    { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', popular: false, type: 'Business' },
    { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', popular: false, type: 'Business' },
    { city: 'Kanpur', state: 'Uttar Pradesh', country: 'India', popular: false, type: 'Business' },
    { city: 'Patna', state: 'Bihar', country: 'India', popular: false, type: 'Business' },
    { city: 'Chandigarh', state: 'Punjab', country: 'India', popular: false, type: 'Business' },
    { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India', popular: false, type: 'Business' }
  ];

  // Location type configurations with enhanced styling
  const locationTypes = [
    {
      key: 'All',
      label: 'All Destinations',
      icon: Globe,
      gradient: 'from-indigo-500 to-purple-600',
      hoverGradient: 'from-indigo-600 to-purple-700',
      description: 'Explore all locations',
      count: indianLocations.length
    },
    {
      key: 'Metro',
      label: 'Metro Cities',
      icon: Building,
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-600 to-cyan-600',
      description: 'Major metropolitan cities',
      count: indianLocations.filter(l => l.type === 'Metro').length
    },
    {
      key: 'Heritage',
      label: 'Heritage Sites',
      icon: Crown,
      gradient: 'from-amber-500 to-orange-500',
      hoverGradient: 'from-amber-600 to-orange-600',
      description: 'Historical & cultural sites',
      count: indianLocations.filter(l => l.type === 'Heritage').length
    },
    {
      key: 'Beach',
      label: 'Beach Destinations',
      icon: Palmtree,
      gradient: 'from-teal-400 to-blue-500',
      hoverGradient: 'from-teal-500 to-blue-600',
      description: 'Beautiful coastal beaches',
      count: indianLocations.filter(l => l.type === 'Beach').length
    },
    {
      key: 'Backwaters',
      label: 'Backwaters',
      icon: Ship,
      gradient: 'from-emerald-500 to-teal-500',
      hoverGradient: 'from-emerald-600 to-teal-600',
      description: 'Serene backwater experiences',
      count: indianLocations.filter(l => l.type === 'Backwaters').length
    },
    {
      key: 'Coastal',
      label: 'Coastal Towns',
      icon: Fish,
      gradient: 'from-cyan-400 to-blue-400',
      hoverGradient: 'from-cyan-500 to-blue-500',
      description: 'Scenic coastal destinations',
      count: indianLocations.filter(l => l.type === 'Coastal').length
    },
    {
      key: 'Spiritual',
      label: 'Spiritual Places',
      icon: Church,
      gradient: 'from-rose-400 to-pink-500',
      hoverGradient: 'from-rose-500 to-pink-600',
      description: 'Sacred & spiritual destinations',
      count: indianLocations.filter(l => l.type === 'Spiritual').length
    },
    {
      key: 'Hill Station',
      label: 'Hill Stations',
      icon: Mountain,
      gradient: 'from-green-500 to-emerald-500',
      hoverGradient: 'from-green-600 to-emerald-600',
      description: 'Scenic mountain retreats',
      count: indianLocations.filter(l => l.type === 'Hill Station').length
    }
  ];

  const filters = ['Hotels', 'Restaurants', 'Activities', 'Taxi', 'Railway', 'Flights', 'Resorts', 'Shopping', 'Services'];

  const stats = [
    { label: 'Total Bookings', value: '48,920', change: '+12.5%', icon: Calendar, color: 'text-blue-500' },
    { label: 'Partner Services', value: '1,247', change: '+18.7%', icon: Building2Icon, color: 'text-green-500' },
    { label: 'Verified Properties', value: '8,562', change: '+15.3%', icon: ShieldCheckIcon, color: 'text-purple-500' },
    { label: 'Avg Rating', value: '4.6/5', change: '+0.2', icon: Star, color: 'text-orange-500' }
  ];

  // Sample partner businesses with reasonable pricing
  const partnerBusinesses = [
    {
      id: 1,
      name: 'OYO Hotels',
      category: 'Hotels',
      logo: '🏨',
      rating: 4.2,
      properties: 12547,
      bookings: 45632,
      revenue: '₹2.1Cr',
      commission: 15,
      status: 'active',
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: 'Zomato',
      category: 'Restaurants',
      logo: '🍕',
      rating: 4.3,
      properties: 8934,
      bookings: 234567,
      revenue: '₹3.4Cr',
      commission: 12,
      status: 'active',
      verified: true,
      featured: true
    },
    {
      id: 3,
      name: 'Uber',
      category: 'Taxi',
      logo: '🚗',
      rating: 4.1,
      properties: 15000,
      bookings: 567890,
      revenue: '₹1.8Cr',
      commission: 18,
      status: 'active',
      verified: true,
      featured: true
    },
    {
      id: 4,
      name: 'IRCTC',
      category: 'Railway',
      logo: '🚂',
      rating: 3.9,
      properties: 7500,
      bookings: 123456,
      revenue: '₹2.7Cr',
      commission: 8,
      status: 'active',
      verified: true,
      featured: false
    },
    {
      id: 5,
      name: 'IndiGo',
      category: 'Flights',
      logo: '✈️',
      rating: 4.0,
      properties: 156,
      bookings: 45678,
      revenue: '₹1.2Cr',
      commission: 10,
      status: 'active',
      verified: true,
      featured: true
    },
    {
      id: 6,
      name: 'GetYourGuide',
      category: 'Activities',
      logo: '🎯',
      rating: 4.4,
      properties: 2456,
      bookings: 34567,
      revenue: '₹85L',
      commission: 20,
      status: 'active',
      verified: true,
      featured: false
    },
    {
      id: 7,
      name: 'Amazon',
      category: 'Shopping',
      logo: '🛒',
      rating: 4.5,
      properties: 50000,
      bookings: 890123,
      revenue: '₹5.6Cr',
      commission: 5,
      status: 'active',
      verified: true,
      featured: true
    },
    {
      id: 8,
      name: 'Urban Company',
      category: 'Services',
      logo: '🔧',
      rating: 4.2,
      properties: 3456,
      bookings: 67890,
      revenue: '₹1.1Cr',
      commission: 22,
      status: 'active',
      verified: true,
      featured: false
    }
  ];

  // Sample user bookings with reasonable prices and dynamic images
  const userBookings = [
    {
      id: 1,
      type: 'Hotel',
      name: 'The Oberoi Grand',
      partner: 'OYO Hotels',
      location: 'Kolkata, India',
      date: '2024-01-15 to 2024-01-18',
      amount: 4500,
      status: 'confirmed',
      bookingId: 'HTL001234',
      guests: 2,
      rooms: 1,
      image: IMAGE_URLS.hotel_oberoi,
      checkIn: '15 Jan 2024',
      checkOut: '18 Jan 2024',
      rating: 4.8,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
      cancellationPolicy: 'Free cancellation till 24 hrs before check-in'
    },
    {
      id: 2,
      type: 'Flight',
      name: 'Delhi to Mumbai',
      partner: 'IndiGo',
      location: 'DEL → BOM',
      date: '2024-01-20',
      amount: 8500,
      status: 'confirmed',
      bookingId: 'FLT005678',
      passengers: 1,
      flightNo: '6E 331',
      image: IMAGE_URLS.flight_indigo,
      departure: '14:30',
      arrival: '16:45',
      duration: '2h 15m',
      seatNo: '12A',
      class: 'Economy'
    },
    {
      id: 3,
      type: 'Restaurant',
      name: 'Karim\'s Restaurant',
      partner: 'Zomato',
      location: 'Jama Masjid, Delhi',
      date: '2024-01-12',
      amount: 650,
      status: 'completed',
      bookingId: 'RST009876',
      guests: 3,
      image: IMAGE_URLS.restaurant_karims,
      cuisine: 'Mughlai',
      rating: 4.5,
      tableNo: '15',
      time: '19:30'
    },
    {
      id: 4,
      type: 'Activity',
      name: 'Red Fort Heritage Walk',
      partner: 'GetYourGuide',
      location: 'Red Fort, Delhi',
      date: '2024-01-10',
      amount: 450,
      status: 'completed',
      bookingId: 'ACT012345',
      participants: 2,
      image: IMAGE_URLS.activity_red_fort,
      duration: '2 hours',
      guide: 'Rajesh Kumar',
      rating: 4.7
    },
    {
      id: 5,
      type: 'Taxi',
      name: 'Airport Transfer',
      partner: 'Uber',
      location: 'Hotel to IGI Airport',
      date: '2024-01-20',
      amount: 450,
      status: 'pending',
      bookingId: 'TXI067890',
      distance: '25 km',
      image: IMAGE_URLS.taxi_uber,
      pickupTime: '11:30',
      vehicleType: 'Sedan',
      driverName: 'Amit Singh'
    },
    {
      id: 6,
      type: 'Shopping',
      name: 'Electronics Purchase',
      partner: 'Amazon',
      location: 'Online Order',
      date: '2024-01-08',
      amount: 12999,
      status: 'completed',
      bookingId: 'SHP098765',
      items: 1,
      image: IMAGE_URLS.shopping_electronics,
      deliveryDate: '10 Jan 2024',
      trackingId: 'AMZ123456789'
    }
  ];

  // Enhanced booking data with reasonable prices and dynamic images
  const bookingData = {
    Hotels: [
      {
        id: 1,
        name: 'The Oberoi Grand',
        partner: 'OYO Hotels',
        location: 'Kolkata, India',
        rating: 4.8,
        reviewCount: 2847,
        price: 4500,
        originalPrice: 5200,
        discount: 13,
        image: IMAGE_URLS.hotel_oberoi,
        amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'valet'],
        features: ['Heritage Property', 'Butler Service', 'City View', 'Fine Dining'],
        rooms: 145,
        bathrooms: 3,
        area: '1200 sq ft',
        availability: 'Available',
        distance: '2.5 km from center',
        cancellation: 'Free cancellation',
        breakfast: true,
        verified: true,
        promoted: true,
        businessBadge: 'Premium Partner'
      },
      {
        id: 2,
        name: 'Radisson Blu Plaza',
        partner: 'Booking.com',
        location: 'New Delhi, India',
        rating: 4.7,
        reviewCount: 1589,
        price: 3200,
        originalPrice: 3800,
        discount: 16,
        image: IMAGE_URLS.hotel_radisson,
        amenities: ['wifi', 'restaurant', 'gym', 'parking', 'business', 'pool'],
        features: ['Business Center', 'Conference Halls', 'Airport Shuttle'],
        rooms: 238,
        bathrooms: 2,
        area: '920 sq ft',
        availability: 'Available',
        distance: '1.8 km from center',
        cancellation: 'Free cancellation',
        breakfast: true,
        verified: true,
        promoted: false,
        businessBadge: 'Trusted Partner'
      }
    ],
    Restaurants: [
      {
        id: 3,
        name: 'Karim\'s Restaurant',
        partner: 'Zomato',
        location: 'Jama Masjid, Delhi',
        rating: 4.5,
        reviewCount: 12847,
        price: 650,
        originalPrice: 800,
        discount: 19,
        image: IMAGE_URLS.restaurant_karims,
        cuisine: 'Mughlai, Indian',
        specialty: 'Kebabs & Biryani',
        availability: 'Open Now',
        distance: '3.2 km from center',
        verified: true,
        promoted: true,
        businessBadge: 'Gold Partner',
        offers: ['15% off on orders above ₹500', 'Free dessert with main course']
      },
      {
        id: 4,
        name: 'Indian Accent',
        partner: 'Dineout',
        location: 'Lodhi Road, Delhi',
        rating: 4.9,
        reviewCount: 2567,
        price: 1800,
        originalPrice: 1800,
        discount: 0,
        image: IMAGE_URLS.restaurant_indian_accent,
        cuisine: 'Contemporary Indian',
        specialty: 'Fine Dining',
        availability: 'Open Now',
        distance: '4.1 km from center',
        verified: true,
        promoted: false,
        businessBadge: 'Premium Partner'
      }
    ],
    Shopping: [
      {
        id: 15,
        name: 'Amazon Fashion',
        partner: 'Amazon',
        location: 'Online Store',
        rating: 4.3,
        reviewCount: 45678,
        price: 899,
        originalPrice: 1699,
        discount: 47,
        image: IMAGE_URLS.shopping_fashion,
        category: 'Fashion & Lifestyle',
        delivery: 'Same Day Delivery',
        availability: 'In Stock',
        verified: true,
        promoted: true,
        businessBadge: 'Mega Partner',
        offers: ['Extra 10% off with app', 'Free delivery above ₹499']
      },
      {
        id: 16,
        name: 'Flipkart Electronics',
        partner: 'Flipkart',
        location: 'Online Store',
        rating: 4.2,
        reviewCount: 23456,
        price: 12999,
        originalPrice: 15999,
        discount: 19,
        image: IMAGE_URLS.shopping_electronics,
        category: 'Electronics & Gadgets',
        delivery: 'Next Day Delivery',
        availability: 'Limited Stock',
        verified: true,
        promoted: false,
        businessBadge: 'Trusted Partner'
      }
    ],
    Services: [
      {
        id: 17,
        name: 'AC Repair Service',
        partner: 'Urban Company',
        location: 'Home Service',
        rating: 4.4,
        reviewCount: 1234,
        price: 599,
        originalPrice: 799,
        discount: 25,
        image: IMAGE_URLS.service_ac_repair,
        service: 'AC Servicing & Repair',
        duration: '45 minutes',
        availability: 'Available Today',
        verified: true,
        promoted: true,
        businessBadge: 'Verified Pro',
        warranty: '30 days service warranty'
      },
      {
        id: 18,
        name: 'Home Cleaning',
        partner: 'Urban Company',
        location: 'Home Service',
        rating: 4.6,
        reviewCount: 2345,
        price: 449,
        originalPrice: 599,
        discount: 25,
        image: IMAGE_URLS.service_home_cleaning,
        service: 'Deep Cleaning Service',
        duration: '2-3 hours',
        availability: 'Available Today',
        verified: true,
        promoted: false,
        businessBadge: 'Verified Pro'
      }
    ],
    Activities: [
      {
        id: 5,
        name: 'Red Fort Heritage Walk',
        partner: 'GetYourGuide',
        location: 'Red Fort, Delhi',
        rating: 4.6,
        reviewCount: 1432,
        price: 450,
        originalPrice: 550,
        discount: 18,
        image: IMAGE_URLS.activity_red_fort,
        duration: '2 hours',
        type: 'Cultural Tour',
        availability: 'Available Today',
        distance: '2.5 km from center',
        verified: true,
        promoted: true,
        businessBadge: 'Featured Partner'
      },
      {
        id: 6,
        name: 'Cooking Class Experience',
        partner: 'Airbnb Experiences',
        location: 'Connaught Place, Delhi',
        rating: 4.8,
        reviewCount: 698,
        price: 1200,
        originalPrice: 1400,
        discount: 14,
        image: IMAGE_URLS.activity_cooking_class,
        duration: '3 hours',
        type: 'Culinary Experience',
        availability: 'Available',
        distance: '1.5 km from center',
        verified: true,
        promoted: false,
        businessBadge: 'Trusted Host'
      }
    ],
    Railway: [
      {
        id: 7,
        name: 'Rajdhani Express',
        partner: 'IRCTC',
        route: 'Delhi - Mumbai',
        rating: 4.4,
        reviewCount: 12340,
        price: 1800,
        originalPrice: 2000,
        discount: 10,
        image: IMAGE_URLS.train_rajdhani,
        class: 'AC 2 Tier',
        duration: '16 hours',
        departure: '16:05',
        arrival: '08:35',
        availability: 'Available',
        verified: true,
        promoted: true,
        businessBadge: 'Official Partner'
      },
      {
        id: 8,
        name: 'Shatabdi Express',
        partner: 'IRCTC',
        route: 'Delhi - Agra',
        rating: 4.5,
        reviewCount: 1876,
        price: 550,
        originalPrice: 650,
        discount: 15,
        image: IMAGE_URLS.train_shatabdi,
        class: 'AC Chair Car',
        duration: '2 hours',
        departure: '06:00',
        arrival: '08:02',
        availability: 'Available',
        verified: true,
        promoted: false,
        businessBadge: 'Official Partner'
      }
    ],
    Taxi: [
      {
        id: 9,
        name: 'Ola Sedan',
        partner: 'Ola Cabs',
        type: 'Sedan',
        rating: 4.3,
        reviewCount: 18934,
        price: 199,
        originalPrice: 250,
        discount: 20,
        image: IMAGE_URLS.taxi_ola,
        capacity: '4 passengers',
        features: ['AC', 'Music System', 'Clean Interior'],
        availability: '2 mins away',
        estimated: '15 min ride',
        verified: true,
        promoted: true,
        businessBadge: 'Premium Partner'
      },
      {
        id: 10,
        name: 'Uber Premier',
        partner: 'Uber',
        type: 'Premium',
        rating: 4.6,
        reviewCount: 15672,
        price: 210,
        originalPrice: 270,
        discount: 18,
        image: IMAGE_URLS.taxi_uber,
        capacity: '4 passengers',
        features: ['AC', 'Premium Interior', 'Professional Driver'],
        availability: '4 mins away',
        estimated: '12 min ride',
        verified: true,
        promoted: false,
        businessBadge: 'Gold Partner'
      }
    ],
    Flights: [
      {
        id: 11,
        name: 'IndiGo Flight',
        partner: 'IndiGo',
        route: 'Delhi - Mumbai',
        rating: 4.2,
        reviewCount: 25432,
        price: 8500,
        originalPrice: 10000,
        discount: 15,
        image: IMAGE_URLS.flight_indigo,
        flightNo: '6E 331',
        duration: '2h 15m',
        departure: '14:30',
        arrival: '16:45',
        availability: 'Available',
        verified: true,
        promoted: true,
        businessBadge: 'Official Partner'
      },
      {
        id: 12,
        name: 'Air India Flight',
        partner: 'Air India',
        route: 'Delhi - Goa',
        rating: 4.1,
        reviewCount: 9876,
        price: 12000,
        originalPrice: 14000,
        discount: 14,
        image: IMAGE_URLS.flight_air_india,
        flightNo: 'AI 505',
        duration: '2h 30m',
        departure: '09:45',
        arrival: '12:15',
        availability: 'Available',
        verified: true,
        promoted: false,
        businessBadge: 'Official Partner'
      }
    ],
    Resorts: [
      {
        id: 13,
        name: 'The Oberoi Amarvilas',
        partner: 'Luxury Escapes',
        location: 'Agra, India',
        rating: 4.9,
        reviewCount: 1867,
        price: 8500,
        originalPrice: 10500,
        discount: 19,
        image: IMAGE_URLS.hotel_oberoi_amarvilas,
        amenities: ['pool', 'spa', 'restaurant', 'wifi', 'valet', 'garden'],
        features: ['Taj View', 'Luxury Spa', 'Fine Dining', 'Butler Service'],
        rooms: 102,
        bathrooms: 3,
        area: '1500 sq ft',
        availability: 'Available',
        distance: 'Taj Mahal view',
        cancellation: 'Free cancellation',
        verified: true,
        promoted: true,
        businessBadge: 'Luxury Partner'
      },
      {
        id: 14,
        name: 'Club Mahindra Goa',
        partner: 'Club Mahindra',
        location: 'Goa, India',
        rating: 4.6,
        reviewCount: 923,
        price: 4200,
        originalPrice: 5200,
        discount: 19,
        image: IMAGE_URLS.hotel_club_mahindra,
        amenities: ['pool', 'beach', 'restaurant', 'wifi', 'gym'],
        features: ['Beach Access', 'Water Sports', 'Kids Club'],
        rooms: 75,
        bathrooms: 2,
        area: '800 sq ft',
        availability: 'Available',
        distance: '50m from beach',
        cancellation: 'Free cancellation',
        verified: true,
        promoted: false,
        businessBadge: 'Resort Partner'
      }
    ]
  };

  const getFilterIcon = (filter: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Hotels: <Hotel className="w-4 h-4" />,
      Restaurants: <Utensils className="w-4 h-4" />,
      Activities: <Camera className="w-4 h-4" />,
      Taxi: <Car className="w-4 h-4" />,
      Railway: <Train className="w-4 h-4" />,
      Flights: <Plane className="w-4 h-4" />,
      Resorts: <TreePine className="w-4 h-4" />,
      Shopping: <ShoppingBag className="w-4 h-4" />,
      Services: <Package className="w-4 h-4" />
    };
    return icons[filter] || <Hotel className="w-4 h-4" />;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      wifi: <Wifi className="w-4 h-4" />,
      pool: <Waves className="w-4 h-4" />,
      spa: <Heart className="w-4 h-4" />,
      restaurant: <UtensilsCrossed className="w-4 h-4" />,
      gym: <Dumbbell className="w-4 h-4" />,
      parking: <Car className="w-4 h-4" />,
      business: <Coffee className="w-4 h-4" />,
      valet: <Shield className="w-4 h-4" />,
      garden: <TreePine className="w-4 h-4" />,
      beach: <Waves className="w-4 h-4" />
    };
    return icons[amenity] || <Coffee className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      confirmed: 'text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
      pending: 'text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700',
      completed: 'text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
      cancelled: 'text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'
    };
    return colors[status] || 'text-gray-500 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
  };

  const getLocationTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Metro': 'bg-blue-500 text-white shadow-lg',
      'Heritage': 'bg-purple-500 text-white shadow-lg',
      'Beach': 'bg-cyan-500 text-white shadow-lg',
      'Hill Station': 'bg-green-500 text-white shadow-lg',
      'Spiritual': 'bg-orange-500 text-white shadow-lg',
      'Business': 'bg-gray-500 text-white shadow-lg',
      'Coastal': 'bg-teal-500 text-white shadow-lg',
      'Backwaters': 'bg-emerald-500 text-white shadow-lg',
      'Wildlife': 'bg-yellow-500 text-white shadow-lg'
    };
    return colors[type] || 'bg-gray-500 text-white shadow-lg';
  };

  const toggleFavorite = (itemId: number) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleLocationSelect = (location: any) => {
    setCurrentLocation(`${location.city}, ${location.state}`);
    setShowLocationDropdown(false);
  };

  const handleLocationTypeFilter = (type: string) => {
    setSelectedLocationType(type);
  };

  const currentData = bookingData[activeFilter as keyof typeof bookingData] || [];

  const filteredBookings = bookingStatusFilter === 'All' 
    ? userBookings 
    : userBookings.filter(booking => booking.status === bookingStatusFilter.toLowerCase());

  // Filter locations by selected type
  const filteredLocations = selectedLocationType === 'All' 
    ? indianLocations 
    : indianLocations.filter(location => location.type === selectedLocationType);

  // Group locations by type for better organization
  const popularLocations = indianLocations.filter(loc => loc.popular);

  const renderPartnerCard = (partner: any) => {
    return (
      <div
        key={partner.id}
        className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="text-4xl mr-4">{partner.logo}</div>
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {partner.name}
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {partner.category}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {partner.verified && (
              <span className="bg-green-500 text-white px-3 py-2 rounded-full text-xs flex items-center font-medium shadow-lg">
                <BadgeCheck className="w-3 h-3 mr-1" />
                Trusted
              </span>
            )}
            {partner.featured && (
              <span className="bg-orange-500 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Tourist-focused information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {partner.rating}
              </span>
              <span className={`text-sm ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Rating
              </span>
            </div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {partner.properties.toLocaleString()}+ Services
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total Bookings
            </span>
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {partner.bookings.toLocaleString()}+
            </span>
          </div>

          {/* Safety & Trust indicators */}
          <div className="flex items-center space-x-3 pt-2">
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <Shield className="w-3 h-3 mr-1" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
              <Headphones className="w-3 h-3 mr-1" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
            partner.status === 'active' 
              ? 'bg-green-500 text-white shadow-lg hover:bg-green-600'
              : 'bg-gray-500 text-white shadow-lg'
          }`}>
            {partner.status === 'active' ? 'Available Now' : 'Unavailable'}
          </span>
          
          <div className="flex space-x-2">
            <button className={`p-3 rounded-xl transition-all hover:scale-105 shadow-md ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}>
              <Eye className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all hover:scale-105 shadow-lg">
              Explore Services
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingHistory = (booking: any) => {
    return (
      <div
        key={booking.id}
        className={`p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
        onClick={() => setSelectedBooking(booking)}
      >
        <div className="flex items-start space-x-4">
          <img
            src={booking.image}
            alt={booking.name}
            className="w-20 h-20 rounded-xl object-cover"
            onError={(e) => {
              // Fallback image if URL fails
              e.currentTarget.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {booking.name}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  via {booking.partner}
                </p>
              </div>
              
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center">
                <MapPin className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {booking.location}
                </span>
              </div>
              
              <div className="flex items-center">
                <Calendar className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {booking.date}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ID: {booking.bookingId}
                </span>
                
                {booking.rating && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {booking.rating}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <span className="text-xl font-bold text-orange-600">
                  ₹{booking.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingCard = (item: any) => {
    return (
      <div
        key={item.id}
        className={`rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-56 object-cover"
            onError={(e) => {
              // Fallback image if URL fails
              e.currentTarget.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
          
          {/* Overlay badges */}
          <div className="absolute top-4 left-4 flex flex-col space-y-2">
            {item.businessBadge && (
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                <Award className="w-4 h-4 mr-2" />
                {item.businessBadge}
              </span>
            )}
            {item.promoted && (
              <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Promoted
              </span>
            )}
            {item.verified && (
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verified
              </span>
            )}
            {item.discount > 0 && (
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                {item.discount}% OFF
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-3 rounded-full transition-all hover:scale-110 shadow-lg ${
                favorites.includes(item.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-all hover:scale-110 shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Availability indicator */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              {item.availability}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className={`font-bold text-xl mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.name}
              </h3>
              {item.partner && (
                <p className={`text-sm font-medium text-orange-600 mb-1`}>
                  via {item.partner}
                </p>
              )}
              <div className="flex items-center mb-2">
                <MapPin className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.location || item.route}
                </p>
              </div>
              {item.distance && (
                <div className="flex items-center mb-2">
                  <Navigation className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {item.distance}
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="flex items-center mb-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.rating}
                </span>
                <span className={`text-sm ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({item.reviewCount})
                </span>
              </div>
            </div>
          </div>
          
          {/* Category-specific details */}
          {(activeFilter === 'Hotels' || activeFilter === 'Resorts') && item.rooms && (
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Bed className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.rooms} rooms
                </span>
              </div>
              <div className="flex items-center">
                <Bath className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.bathrooms} baths
                </span>
              </div>
              <div className="flex items-center">
                <Home className={`w-4 h-4 mr-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.area}
                </span>
              </div>
            </div>
          )}

          {activeFilter === 'Restaurants' && item.cuisine && (
            <div className="mb-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Cuisine:</span> {item.cuisine}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Specialty:</span> {item.specialty}
              </p>
            </div>
          )}

          {activeFilter === 'Activities' && item.duration && (
            <div className="mb-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Duration:</span> {item.duration}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Type:</span> {item.type}
              </p>
            </div>
          )}

          {(activeFilter === 'Railway' || activeFilter === 'Flights') && item.duration && (
            <div className="mb-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Duration:</span> {item.duration}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Departure:</span> {item.departure} → <span className="font-medium">Arrival:</span> {item.arrival}
              </p>
              {item.class && (
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-medium">Class:</span> {item.class}
                </p>
              )}
            </div>
          )}

          {activeFilter === 'Taxi' && item.capacity && (
            <div className="mb-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Capacity:</span> {item.capacity}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">ETA:</span> {item.availability}
              </p>
            </div>
          )}

          {activeFilter === 'Shopping' && item.category && (
            <div className="mb-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Category:</span> {item.category}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Delivery:</span> {item.delivery}
              </p>
            </div>
          )}

          {activeFilter === 'Services' && item.service && (
            <div className="mb-4">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Service:</span> {item.service}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Duration:</span> {item.duration}
              </p>
              {item.warranty && (
                <p className={`text-sm text-green-600 dark:text-green-400`}>
                  <span className="font-medium">Warranty:</span> {item.warranty}
                </p>
              )}
            </div>
          )}
          
          {/* Offers */}
          {item.offers && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {item.offers.map((offer: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm flex items-center font-medium shadow-lg transition-all hover:scale-105"
                  >
                    <Gift className="w-3 h-3 mr-1" />
                    {offer}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Amenities */}
          {item.amenities && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {item.amenities.slice(0, 5).map((amenity: string, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm transition-all hover:scale-105 ${
                      isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getAmenityIcon(amenity)}
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
                {item.amenities.length > 5 && (
                  <span className={`px-3 py-2 rounded-full text-sm ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    +{item.amenities.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Features */}
          {item.features && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {item.features.slice(0, 3).map((feature: string, index: number) => (
                  <span
                    key={index}
                    className={`px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 ${
                      isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Pricing and booking */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                {item.originalPrice > item.price && (
                  <span className={`text-sm line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    ₹{item.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl font-bold text-orange-600">
                  ₹{item.price.toLocaleString()}
                </span>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeFilter === 'Taxi' ? 'per hour' : 
                 activeFilter === 'Activities' ? 'per person' : 
                 activeFilter === 'Shopping' ? 'per item' :
                 activeFilter === 'Services' ? 'per service' : 'per night'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button className={`p-3 rounded-xl transition-all hover:scale-105 shadow-md ${
                isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                <Eye className="w-5 h-5" />
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all hover:scale-105 shadow-lg">
                {activeFilter === 'Shopping' ? 'Add to Cart' :
                 activeFilter === 'Services' ? 'Book Service' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className={`p-3 rounded-full mr-4 transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800 text-white hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-orange-600'}`}>
                Bookings
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Book amazing experiences from trusted partners
              </p>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-all hover:scale-105 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className={`p-2 rounded-lg transition-colors relative ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
            }`}>
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`flex space-x-1 p-1 rounded-xl mb-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'
        }`}>
          {[
            { key: 'explore', label: 'Explore Services', icon: Globe },
            { key: 'bookings', label: 'My Bookings', icon: Calendar },
            { key: 'partners', label: 'Trusted Partners', icon: BadgeCheck }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all flex-1 justify-center ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white shadow-lg'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-xl transition-all hover:scale-105 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-green-500 text-xs font-medium flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </span>
              </div>
              <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'explore' && (
          <>
            {/* Enhanced Location Type Filter Buttons */}
            <div className={`p-6 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Explore by Destination Type
                </h3>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose your travel preference
                </span>
              </div>

               {/* Beautiful Location Type Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {locationTypes.map((locationType) => (
                  <button
                    key={locationType.key}
                    onClick={() => handleLocationTypeFilter(locationType.key)}
                    className={`group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      selectedLocationType === locationType.key
                        ? 'shadow-2xl scale-105'
                        : 'shadow-lg hover:shadow-2xl'
                    }`}
                  >

                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      selectedLocationType === locationType.key 
                        ? locationType.hoverGradient 
                        : locationType.gradient
                    } transition-all duration-300`} />
                    
                    {/* Button Content */}
                    <div className="relative h-full p-2 text-white flex flex-col items-center justify-center">
                      <locationType.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 mb-1" />
                      <div className="text-center">
                        <div className="font-bold text-xs leading-tight mb-1">
                          {locationType.label}
                        </div>
                        <div className="text-xs opacity-90">
                          {locationType.count}
                        </div>
                      </div>

                      {/* Hover Overlay Effect */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Active Indicator */}
                      {selectedLocationType === locationType.key && (
                        <div className="absolute top-1 right-1">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute top-0 -left-4 w-4 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-all duration-700 group-hover:left-full" />
                  </button>
                ))}
              </div>

              {/* Selected Type Description */}
              {selectedLocationType !== 'All' && (
                <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-orange-50'}`}>
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const selected = locationTypes.find(t => t.key === selectedLocationType);
                      return selected ? (
                        <>
                          <selected.icon className="w-6 h-6 text-orange-500" />
                          <div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selected.label}
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {selected.description} • {selected.count} destinations available
                            </p>
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Location & Date Selection with Enhanced Location Selector */}
            <div className={`p-6 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md border border-gray-200'
            }`}>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Enhanced Location Selector */}
                <div className="relative">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-orange-500 mr-3" />
                    <div className="flex-1">
                      <button
                        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                        className={`w-full text-left flex items-center justify-between p-3 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white hover:border-orange-500' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-orange-500 hover:bg-white'
                        }`}
                      >
                        <div>
                          <span className="font-medium">{currentLocation}</span>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Current location
                          </p>
                        </div>
                        <ChevronDown className={`w-4 h-4 transform transition-transform ${
                          showLocationDropdown ? 'rotate-180' : ''
                        }`} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Enhanced Location Dropdown */}
                  {showLocationDropdown && (
                    <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto ${
                      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                      <div className="p-4">
                        {/* Popular Tourist Destinations */}
                        <h3 className={`text-sm font-bold mb-3 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          <Star className="w-4 h-4 text-yellow-500 mr-2" />
                          Popular Tourist Destinations
                        </h3>
                        <div className="space-y-2">
                          {popularLocations.filter(location => 
                            selectedLocationType === 'All' || location.type === selectedLocationType
                          ).map((location, index) => (
                            <button
                              key={index}
                              onClick={() => handleLocationSelect(location)}
                              className={`w-full text-left p-3 rounded-xl transition-all hover:scale-[1.02] shadow-md hover:shadow-lg ${
                                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-white text-gray-900'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${getLocationTypeColor(location.type)}`}>
                                    {(() => {
                                      const typeConfig = locationTypes.find(t => t.key === location.type);
                                      return typeConfig ? <typeConfig.icon className="w-6 h-6" /> : <MapPin className="w-6 h-6" />;
                                    })()}
                                  </div>
                                  <div>
                                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {location.city}, {location.state}
                                    </div>
                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {location.country}
                                    </div>
                                  </div>
                                </div>
                                <span className={`px-3 py-2 rounded-full text-sm font-medium text-white shadow-lg ${getLocationTypeColor(location.type)}`}>
                                  {location.type}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* All Cities filtered by type */}
                        {selectedLocationType !== 'All' && (
                          <div className="mt-6">
                            <h3 className={`text-sm font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              All {selectedLocationType} Destinations
                            </h3>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                              {filteredLocations.filter(loc => !loc.popular).map((location, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleLocationSelect(location)}
                                  className={`text-left p-3 rounded-xl transition-all hover:scale-[1.02] shadow-sm hover:shadow-md ${
                                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-50 hover:bg-white text-gray-900'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                      {location.city}, {location.state}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm ${getLocationTypeColor(location.type)}`}>
                                      {location.type}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-orange-500 mr-3" />
                  <div>
                    <input
                      type="date"
                      value={selectedDates.checkIn}
                      onChange={(e) => setSelectedDates({...selectedDates, checkIn: e.target.value})}
                      className={`font-medium bg-transparent border-none outline-none ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Check-in
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-orange-500 mr-3" />
                  <div>
                    <input
                      type="date"
                      value={selectedDates.checkOut}
                      onChange={(e) => setSelectedDates({...selectedDates, checkOut: e.target.value})}
                      className={`font-medium bg-transparent border-none outline-none ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Check-out
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className={`p-6 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md border border-gray-200'
            }`}>
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search across all partner services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-16 py-4 rounded-xl border-2 transition-all focus:scale-[1.02] ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:bg-white'
                  }`}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-all hover:scale-105">
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 shadow-lg ${
                      activeFilter === filter
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                        : isDarkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    {getFilterIcon(filter)}
                    <span>{filter}</span>
                  </button>
                ))}
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-full transition-all hover:scale-105 shadow-lg ${
                    isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className={`grid md:grid-cols-4 gap-4 p-4 border-t ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Sort by
                    </label>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="rating">Rating</option>
                      <option value="price">Price</option>
                      <option value="distance">Distance</option>
                      <option value="popularity">Popularity</option>
                      <option value="partner">Partner</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Price Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="flex-1"
                      />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        ₹{priceRange[1].toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      View Mode
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          viewMode === 'grid' 
                            ? 'bg-orange-500 text-white' 
                            : isDarkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          viewMode === 'list' 
                            ? 'bg-orange-500 text-white' 
                            : isDarkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Partner Filter
                    </label>
                    <select 
                      className={`w-full p-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="all">All Partners</option>
                      <option value="featured">Featured Only</option>
                      <option value="verified">Verified Only</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Content based on active filter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeFilter}
                </h2>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {currentData.length} services available
                  </span>
                  <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                  }`}>
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
              
              <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {currentData.map((item) => renderBookingCard(item))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Bookings
              </h2>
              <div className="flex space-x-3">
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                }`}>
                  <Filter className="w-4 h-4 mr-2 inline" />
                  Filter
                </button>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                }`}>
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
              </div>
            </div>

            {/* Booking Status Tabs */}
            <div className={`flex space-x-1 p-1 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white shadow-md'
            }`}>
              {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setBookingStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 text-center ${
                    bookingStatusFilter === status
                      ? 'bg-orange-500 text-white'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Bookings List */}
            <div className="space-y-4 mb-8">
              {filteredBookings.map((booking) => renderBookingHistory(booking))}
            </div>
          </div>
        )}

        {activeTab === 'partners' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Trusted Partners
              </h2>
              <div className="flex space-x-3">
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md'
                }`}>
                  <Shield className="w-4 h-4 mr-2 inline" />
                  Safety Info
                </button>
              </div>
            </div>

            {/* Tourist-focused Partner Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Trusted Partners
                  </h3>
                  <BadgeCheck className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-green-500">
                  {partnerBusinesses.filter(p => p.verified).length}
                </p>
              </div>

              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Service Categories
                  </h3>
                  <Package className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-blue-500">
                  {[...new Set(partnerBusinesses.map(p => p.category))].length}
                </p>
              </div>

              <div className={`p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md border border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Avg Rating
                  </h3>
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold text-yellow-500">
                  {(partnerBusinesses.reduce((acc, p) => acc + p.rating, 0) / partnerBusinesses.length).toFixed(1)}
                </p>
              </div>
            </div>

            {/* Partners Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnerBusinesses.map((partner) => renderPartnerCard(partner))}
            </div>
          </div>
        )}

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`max-w-2xl w-full rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Booking Details
                  </h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Booking Image */}
                  <img
                    src={selectedBooking.image}
                    alt={selectedBooking.name}
                    className="w-full h-64 rounded-xl object-cover"
                    onError={(e) => {
                      // Fallback image if URL fails
                      e.currentTarget.src = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />

                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedBooking.name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        via {selectedBooking.partner}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedBooking.location}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                      <p className="text-2xl font-bold text-orange-600 mt-2">
                        ₹{selectedBooking.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Booking ID
                        </p>
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedBooking.bookingId}
                        </p>
                      </div>
                      
                      <div>
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Date
                        </p>
                        <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedBooking.date}
                        </p>
                      </div>

                      {selectedBooking.guests && (
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Guests
                          </p>
                          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedBooking.guests}
                          </p>
                        </div>
                      )}

                      {selectedBooking.rooms && (
                        <div>
                          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Rooms
                          </p>
                          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {selectedBooking.rooms}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  {selectedBooking.amenities && (
                    <div>
                      <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Amenities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedBooking.amenities.map((amenity: string, index: number) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm ${
                              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    {selectedBooking.status === 'confirmed' && (
                      <button className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
                        Cancel Booking
                      </button>
                    )}
                    
                    <button className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                      Contact Support
                    </button>
                    
                    {selectedBooking.status === 'completed' && (
                      <button className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                        Rate & Review
                      </button>
                    )}
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

export default BookingsDashboard;