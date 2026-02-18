import { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  CheckCircle, Download, Share2, 
  Eye, EyeOff, Flag, Heart, Shield,
  ChevronLeft, ChevronRight, Copy, CreditCard,
  Camera, FileText, Globe, Scan,
  Clock, AlertCircle
} from 'lucide-react';

interface FormData {
  // Tier A & B - Basic Info
  name: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  plannedCity: string;
  arrivalDate: string;
  emergencyContact: string;
  hotelAddress: string;
  
  // Tier C-E - Verification
  bloodGroup: string;
  preferredLanguage: string;
  medicalConsent: boolean;
  criminalHistory: string;
  travelHistory: string;
  suspiciousItems: boolean;
  
  // Consent
  termsConsent: boolean;
  dataConsent: boolean;
}

const TouristRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [digitalId, setDigitalId] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({});
  const [digiLockerVerification, setDigiLockerVerification] = useState<{
    aadhaar: boolean;
    pan: boolean;
    selfie: boolean;
  }>({ aadhaar: false, pan: false, selfie: false });
  const [onfidoVerification, setOnfidoVerification] = useState<{
    passport: boolean;
    visa: boolean;
    ePassportScan: boolean;
  }>({ passport: false, visa: false, ePassportScan: false });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOnfidoVerifying, setIsOnfidoVerifying] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [redirecting, setRedirecting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    country: '',
    dateOfBirth: '',
    nationality: '',
    gender: '',
    plannedCity: '',
    arrivalDate: '',
    emergencyContact: '',
    hotelAddress: '',
    bloodGroup: '',
    preferredLanguage: '',
    medicalConsent: false,
    criminalHistory: '',
    travelHistory: '',
    suspiciousItems: false,
    termsConsent: false,
    dataConsent: false
  });

  // Check if at least one verification method is completed
  const hasDigiLockerVerification = digiLockerVerification.aadhaar && digiLockerVerification.pan && digiLockerVerification.selfie;
  const hasInternationalVerification = onfidoVerification.passport && onfidoVerification.visa;
  const hasAnyVerification = hasDigiLockerVerification || hasInternationalVerification;

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const generateDigitalId = (city: string): string => {
    const cityCode = city.substring(0, 3).toUpperCase();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${cityCode}${date}-${random}`;
  };

  const generateQRCode = async (data: {
    digitalId: string;
    name: string;
    country: string;
    emergency: string;
  }): Promise<void> => {
    try {
      const qrData = JSON.stringify({
        id: data.digitalId,
        name: data.name,
        country: data.country,
        emergency: data.emergency,
        verified: true,
        timestamp: new Date().toISOString()
      });
      
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('QR Code generation failed:', error);
    }
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'name':
        return !value ? 'Name is required' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value ? 'Email is required' : !emailRegex.test(value) ? 'Invalid email' : '';
      case 'phone':
        return !value ? 'Phone is required' : '';
      case 'password':
        return !value ? 'Password is required' : value.length < 6 ? 'Password must be at least 6 characters' : '';
      case 'country':
        return !value ? 'Country is required' : '';
      case 'dateOfBirth':
        return !value ? 'Date of birth is required' : '';
      case 'nationality':
        return !value ? 'Nationality is required' : '';
      case 'gender':
        return !value ? 'Gender is required' : '';
      case 'plannedCity':
        return !value ? 'Planned city is required' : '';
      case 'arrivalDate':
        return !value ? 'Arrival date is required' : '';
      case 'emergencyContact':
        return !value ? 'Emergency contact is required' : '';
      case 'hotelAddress':
        return !value ? 'Hotel address is required' : '';
      case 'bloodGroup':
        return !value ? 'Blood group is required' : '';
      case 'criminalHistory':
        return !value ? 'Criminal history declaration is required' : '';
      case 'medicalConsent':
        return !value ? 'Medical consent is required' : '';
      case 'suspiciousItems':
        return !value ? 'You must declare no suspicious items' : '';
      case 'termsConsent':
        return !value ? 'You must accept the terms' : '';
      case 'dataConsent':
        return !value ? 'You must consent to data processing' : '';
      default:
        return '';
    }
  };

  const validateStep = (step: number): boolean => {
    const fieldsToValidate = getFieldsForStep(step);
    const newErrors: {[key: string]: string} = {};
    let isValid = true;

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // For step 3, also validate that at least one verification method is completed
    if (step === 3) {
      if (!hasAnyVerification) {
        newErrors.verification = 'Please complete at least one verification method (DigiLocker OR International Documents)';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear verification error when user completes a verification method
    if (name === 'verification' && hasAnyVerification && errors.verification) {
      setErrors(prev => ({ ...prev, verification: '' }));
    }
  };

  const initiateDigiLockerAuth = (): void => {
    setIsVerifying(true);
    
    setTimeout(() => {
      setDigiLockerVerification({
        aadhaar: true,
        pan: true,
        selfie: true
      });
      setIsVerifying(false);
      showToast('DigiLocker verification completed successfully!');
      
      // Clear verification error if it exists
      if (errors.verification) {
        setErrors(prev => ({ ...prev, verification: '' }));
      }
    }, 3000);
  };

  const initiateOnfidoVerification = (): void => {
    setIsOnfidoVerifying(true);
    
    setTimeout(() => {
      setOnfidoVerification({
        passport: true,
        visa: true,
        ePassportScan: uploadedFiles['epassport'] ? true : false
      });
      setIsOnfidoVerifying(false);
      showToast('Document verification completed successfully!');
      
      // Clear verification error if it exists
      if (errors.verification) {
        setErrors(prev => ({ ...prev, verification: '' }));
      }
    }, 4000);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newDigitalId = generateDigitalId(formData.plannedCity);
      setDigitalId(newDigitalId);
      
      await generateQRCode({ 
        digitalId: newDigitalId,
        name: formData.name,
        country: formData.country,
        emergency: formData.emergencyContact
      });
      
      setCurrentStep(4);
      showToast('Registration successful! Digital ID generated.');
      
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = (): void => {
    setCurrentStep(prev => prev - 1);
  };

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 1:
        return ['name', 'email', 'phone', 'password', 'country', 'dateOfBirth', 'nationality', 'gender'];
      case 2:
        return ['plannedCity', 'arrivalDate', 'emergencyContact', 'hotelAddress', 'termsConsent', 'dataConsent'];
      case 3:
        return ['bloodGroup', 'medicalConsent', 'criminalHistory', 'suspiciousItems'];
      default:
        return [];
    }
  };

  const handleFileUpload = (fieldName: string, file: File): void => {
    setUploadedFiles(prev => ({ ...prev, [fieldName]: file }));
    showToast(`${file.name} uploaded successfully`);
  };

  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  const downloadDigitalId = (): void => {
    showToast('Digital ID card downloaded!');
  };

  const shareDigitalId = (): void => {
    if (navigator.share) {
      navigator.share({
        title: 'My Sanchar Digital ID',
        text: `Digital ID: ${digitalId}`,
        url: window.location.href
      });
    } else {
      copyToClipboard(digitalId);
    }
  };

  const goToDashboard = (): void => {
    setRedirecting(true);
    showToast('Redirecting to dashboard...');
    
    // Prepare user profile data to pass to dashboard
    const userProfile = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      nationality: formData.nationality,
      plannedCity: formData.plannedCity,
      arrivalDate: formData.arrivalDate,
      digitalId: digitalId,
      emergencyContact: formData.emergencyContact,
      bloodGroup: formData.bloodGroup,
      preferredLanguage: formData.preferredLanguage,
      isLoggedIn: true,
      registrationCompleted: true
    };
    
    // Store user data in localStorage for persistent login state
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    localStorage.setItem('isUserLoggedIn', 'true');
    localStorage.setItem('userDigitalId', digitalId);
    
    /* 
    NOTE FOR DASHBOARD IMPLEMENTATION:
    Your TouristDashboard.tsx should retrieve this data using:
    
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    
    Then show profile dropdown in header instead of Login/Register buttons:
    - Name: userProfile.name
    - Email: userProfile.email  
    - Phone: userProfile.phone
    - Digital ID: userProfile.digitalId
    - ID: userProfile.digitalId (shown as "ID: DEL13092025-0045" format)
    - Logout button that clears localStorage
    
    Header should check:
    if (isLoggedIn && userProfile.name) {
      // Show profile dropdown with user avatar/name
    } else {
      // Show Login/Register buttons
    }
    */
    
    setTimeout(() => {
      // Redirect to TouristDashboard.tsx component
      window.location.href = '/dashboard/tourist';
    }, 1500);
  };

  const renderStep1 = (): JSX.Element => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Basic details for your tourist profile</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              type="email"
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter your email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="+91 9876543210"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Create password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <div className="relative">
            <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select country</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              type="date"
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality *
          </label>
          <select
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select nationality</option>
            <option value="Indian">Indian</option>
            <option value="American">American</option>
            <option value="British">British</option>
            <option value="Canadian">Canadian</option>
            <option value="Australian">Australian</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Japanese">Japanese</option>
            <option value="Chinese">Chinese</option>
            <option value="Other">Other</option>
          </select>
          {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = (): JSX.Element => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Travel Details</h2>
        <p className="text-gray-600">Information about your planned visit to India</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Planned City *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={formData.plannedCity}
              onChange={(e) => handleInputChange('plannedCity', e.target.value)}
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select city</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Jaipur">Jaipur</option>
            </select>
          </div>
          {errors.plannedCity && <p className="text-red-500 text-sm mt-1">{errors.plannedCity}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arrival Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={formData.arrivalDate}
              onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
              type="date"
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          {errors.arrivalDate && <p className="text-red-500 text-sm mt-1">{errors.arrivalDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              value={formData.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
              placeholder="Emergency contact number"
            />
          </div>
          {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hotel Address *
          </label>
          <textarea
            value={formData.hotelAddress}
            onChange={(e) => handleInputChange('hotelAddress', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter hotel/accommodation address"
            rows={3}
          />
          {errors.hotelAddress && <p className="text-red-500 text-sm mt-1">{errors.hotelAddress}</p>}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-start">
          <input
            checked={formData.termsConsent}
            onChange={(e) => handleInputChange('termsConsent', e.target.checked)}
            type="checkbox"
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
          />
          <label className="ml-2 text-sm text-gray-700">
            I agree to the <a href="#" className="text-orange-600 hover:text-orange-700">Terms of Service</a> and <a href="#" className="text-orange-600 hover:text-orange-700">Privacy Policy</a>
          </label>
        </div>
        {errors.termsConsent && <p className="text-red-500 text-sm">{errors.termsConsent}</p>}

        <div className="flex items-start">
          <input
            checked={formData.dataConsent}
            onChange={(e) => handleInputChange('dataConsent', e.target.checked)}
            type="checkbox"
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
          />
          <label className="ml-2 text-sm text-gray-700">
            I consent to the processing of my personal data for safety and security purposes
          </label>
        </div>
        {errors.dataConsent && <p className="text-red-500 text-sm">{errors.dataConsent}</p>}
      </div>
    </div>
  );

  const renderStep3 = (): JSX.Element => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification & Medical</h2>
        <p className="text-gray-600">Complete at least one verification method to proceed</p>
        {errors.verification && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{errors.verification}</p>
          </div>
        )}
      </div>

      {/* Verification Status Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Choose Your Verification Method</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg border-2 transition-all ${hasDigiLockerVerification ? 'border-green-500 bg-green-50' : 'border-blue-300 bg-white'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium">DigiLocker (Indian Documents)</span>
              </div>
              {hasDigiLockerVerification && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
            <p className="text-sm text-gray-600 mt-1">Aadhaar + PAN + Selfie verification</p>
          </div>
          
          <div className={`p-4 rounded-lg border-2 transition-all ${hasInternationalVerification ? 'border-green-500 bg-green-50' : 'border-purple-300 bg-white'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="font-medium">International Documents</span>
              </div>
              {hasInternationalVerification && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
            <p className="text-sm text-gray-600 mt-1">Passport + Visa verification</p>
          </div>
        </div>
        
        <div className="text-center mt-3">
          <p className="text-sm text-gray-700">
            <strong>Choose at least one:</strong> Use DigiLocker (for Indian citizens) OR Upload Passport + Visa (for international travelers)
          </p>
        </div>
      </div>

      {/* DigiLocker Verification - Available to Everyone */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">DigiLocker Verification</h3>
              <p className="text-sm text-gray-600">For users with Indian documents (any nationality)</p>
            </div>
          </div>
          {hasDigiLockerVerification && (
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Completed
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { key: 'aadhaar', label: 'Aadhaar Card', icon: CreditCard },
            { key: 'pan', label: 'PAN Card', icon: FileText },
            { key: 'selfie', label: 'Selfie Verification', icon: Camera }
          ].map((doc) => (
            <div key={doc.key} className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 text-blue-600">
                  <doc.icon className="w-full h-full" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-2">{doc.label}</p>
                
                <div className="mb-3">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(`digilocker_${doc.key}`, file);
                    }}
                    id={`digilocker-${doc.key}`}
                  />
                  <label
                    htmlFor={`digilocker-${doc.key}`}
                    className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded border hover:bg-blue-200 cursor-pointer text-xs transition-colors"
                  >
                    Upload
                  </label>
                  {uploadedFiles[`digilocker_${doc.key}`] && (
                    <p className="text-green-600 text-xs mt-1 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {uploadedFiles[`digilocker_${doc.key}`].name.length > 15 
                        ? uploadedFiles[`digilocker_${doc.key}`].name.substring(0, 15) + '...'
                        : uploadedFiles[`digilocker_${doc.key}`].name}
                    </p>
                  )}
                </div>

                {digiLockerVerification[doc.key as keyof typeof digiLockerVerification] ? (
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-1"></div>
                    <span className="text-xs">Pending</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={initiateDigiLockerAuth}
            disabled={isVerifying || hasDigiLockerVerification}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto space-x-2"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting to DigiLocker...</span>
              </>
            ) : hasDigiLockerVerification ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>All Documents Verified</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Verify with DigiLocker</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Secure authentication through Government of India's Digital Locker
          </p>
        </div>
      </div>

      {/* OR Divider */}
      <div className="flex items-center justify-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* International Document Verification - Available to Everyone */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">International Document Verification</h3>
              <p className="text-sm text-gray-600">For all nationalities with valid passport & visa</p>
            </div>
          </div>
          {hasInternationalVerification && (
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Completed
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-white">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="w-6 h-6 text-purple-600 mr-2" />
                    <span className="text-sm font-medium">Upload your <strong>Passport</strong> (photo page)</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('passport', file);
                    }}
                    id="passport-upload"
                  />
                  <label
                    htmlFor="passport-upload"
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer text-sm transition-colors"
                  >
                    Choose File
                  </label>
                  {uploadedFiles['passport'] && (
                    <div className="mt-2">
                      <p className="text-green-600 text-xs flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {uploadedFiles['passport'].name}
                      </p>
                      {onfidoVerification.passport && (
                        <p className="text-green-600 text-xs flex items-center justify-center mt-1">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified by ICAO PKD
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-white">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CreditCard className="w-6 h-6 text-purple-600 mr-2" />
                    <span className="text-sm font-medium">Upload your <strong>Valid Visa</strong></span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('visa', file);
                    }}
                    id="visa-upload"
                  />
                  <label
                    htmlFor="visa-upload"
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer text-sm transition-colors"
                  >
                    Choose File
                  </label>
                  {uploadedFiles['visa'] && (
                    <div className="mt-2">
                      <p className="text-green-600 text-xs flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {uploadedFiles['visa'].name}
                      </p>
                      {onfidoVerification.visa && (
                        <p className="text-green-600 text-xs flex items-center justify-center mt-1">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified by Onfido
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Scan className="w-6 h-6 text-gray-600 mr-2" />
                  <span className="text-sm font-medium">Optional: Use <strong>e-Passport Scan</strong> (if supported by your passport)</span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload('epassport', file);
                  }}
                  id="epassport-scan"
                />
                <label
                  htmlFor="epassport-scan"
                  className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer text-sm transition-colors"
                >
                  Scan e-Passport
                </label>
                {uploadedFiles['epassport'] && (
                  <div className="mt-2">
                    <p className="text-green-600 text-xs flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {uploadedFiles['epassport'].name}
                    </p>
                    {onfidoVerification.ePassportScan && (
                      <p className="text-green-600 text-xs flex items-center justify-center mt-1">
                        <Shield className="w-3 h-3 mr-1" />
                        NFC Data Verified
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Verification Status:</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Passport Verification</span>
                  {onfidoVerification.passport ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  ) : uploadedFiles['passport'] ? (
                    <span className="text-yellow-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Processing
                    </span>
                  ) : (
                    <span className="text-gray-500">Pending</span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Visa Verification</span>
                  {onfidoVerification.visa ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  ) : uploadedFiles['visa'] ? (
                    <span className="text-yellow-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Processing
                    </span>
                  ) : (
                    <span className="text-gray-500">Pending</span>
                  )}
                </div>
                {uploadedFiles['epassport'] && (
                  <div className="flex items-center justify-between text-sm">
                    <span>e-Passport NFC Scan</span>
                    {onfidoVerification.ePassportScan ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Processing
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              Want faster verification? Use our secure scanner (powered by Onfido).
            </p>
          </div>
          <button
            type="button"
            onClick={initiateOnfidoVerification}
            disabled={isOnfidoVerifying || (!uploadedFiles['passport'] && !uploadedFiles['visa']) || hasInternationalVerification}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto space-x-2"
          >
            {isOnfidoVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Verifying Documents...</span>
              </>
            ) : hasInternationalVerification ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Documents Verified</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Start Verification</span>
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Secure verification using Onfido & ICAO PKD standards
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group *
          </label>
          <div className="relative">
            <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={formData.bloodGroup}
              onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Language *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={formData.preferredLanguage}
              onChange={(e) => handleInputChange('preferredLanguage', e.target.value)}
              className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select preferred language</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese (Mandarin)</option>
              <option value="Japanese">Japanese</option>
              <option value="Arabic">Arabic</option>
              <option value="Russian">Russian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Italian">Italian</option>
              <option value="Korean">Korean</option>
              <option value="Dutch">Dutch</option>
              <option value="Thai">Thai</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Helps assign guides, police, or emergency translators
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Criminal History Declaration *
          </label>
          <select
            value={formData.criminalHistory}
            onChange={(e) => handleInputChange('criminalHistory', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select option</option>
            <option value="No">No criminal history</option>
            <option value="Yes">Yes (will be reviewed)</option>
          </select>
          {errors.criminalHistory && <p className="text-red-500 text-sm mt-1">{errors.criminalHistory}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Travel to India
          </label>
          <textarea
            value={formData.travelHistory}
            onChange={(e) => handleInputChange('travelHistory', e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
            placeholder="Previous visits to India (optional)"
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-start">
          <input
            checked={formData.medicalConsent}
            onChange={(e) => handleInputChange('medicalConsent', e.target.checked)}
            type="checkbox"
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
          />
          <label className="ml-2 text-sm text-gray-700">
            I consent to emergency medical assistance and sharing of medical information with authorities if needed
          </label>
        </div>
        {errors.medicalConsent && <p className="text-red-500 text-sm">{errors.medicalConsent}</p>}

        <div className="flex items-start">
          <input
            checked={formData.suspiciousItems}
            onChange={(e) => handleInputChange('suspiciousItems', e.target.checked)}
            type="checkbox"
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
          />
          <label className="ml-2 text-sm text-gray-700">
            I declare that I am not carrying any prohibited or suspicious items
          </label>
        </div>
        {errors.suspiciousItems && <p className="text-red-500 text-sm">{errors.suspiciousItems}</p>}
      </div>
    </div>
  );

  const renderStep4 = (): JSX.Element => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
        <p className="text-gray-600">Your digital ID has been generated and is ready to use</p>
      </div>

      <div className="max-w-md mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Sanchar Digital ID</h3>
            <p className="text-orange-100 text-sm">Smart Tourist Safety & Incident Response System</p>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">{formData.name}</h4>
            <p className="text-orange-100">{formData.country}</p>
          </div>
        </div>
        
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between">
            <span className="text-orange-100">Digital ID:</span>
            <span className="font-mono font-semibold">{digitalId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-orange-100">Emergency:</span>
            <span className="font-semibold">{formData.emergencyContact}</span>
          </div>
        </div>
        
        {qrCodeUrl && (
          <div className="bg-white p-3 rounded-lg">
            <img src={qrCodeUrl} alt="QR Code" className="w-full h-32 object-contain" />
          </div>
        )}
        
        <div className="flex items-center justify-center mt-4 space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-orange-100">Blockchain Verified</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <button
          onClick={downloadDigitalId}
          className="flex-1 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
        <button
          onClick={() => copyToClipboard(digitalId)}
          className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Copy className="w-4 h-4" />
          <span>Copy ID</span>
        </button>
        <button
          onClick={shareDigitalId}
          className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={goToDashboard}
          disabled={redirecting}
          className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 flex items-center mx-auto space-x-2"
        >
          {redirecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Redirecting...</span>
            </>
          ) : (
            <span>Go to Dashboard</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-orange-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-16 mt-2 text-sm">
              <span className={currentStep >= 1 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
                Personal Info
              </span>
              <span className={currentStep >= 2 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
                Travel Details
              </span>
              <span className={currentStep >= 3 ? 'text-orange-600 font-medium' : 'text-gray-500'}>
                Verification
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={onSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {currentStep < 4 && (
              <div className="flex justify-between pt-8 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Complete Registration
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TouristRegistration;