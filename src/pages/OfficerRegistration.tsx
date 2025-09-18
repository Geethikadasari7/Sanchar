import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Upload, CheckCircle, Shield, Badge, 
  Eye, EyeOff, Building, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OfficerFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  officerId: string;
  department: string;
  rank: string;
  posting: string;
  alternateContact: string;
  officeAddress: string;
  reportingAuthority: string;
  termsConsent: boolean;
  dataConsent: boolean;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Gender is required'),
  officerId: yup.string().required('Officer ID is required'),
  department: yup.string().required('Department is required'),
  rank: yup.string().required('Rank is required'),
  posting: yup.string().required('Posting location is required'),
  alternateContact: yup.string().required('Alternate contact is required'),
  officeAddress: yup.string().required('Office address is required'),
  reportingAuthority: yup.string().required('Reporting authority is required'),
  termsConsent: yup.boolean().oneOf([true], 'You must accept the terms').required(),
  dataConsent: yup.boolean().oneOf([true], 'You must consent to data processing').required()
});

const OfficerRegistration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File}>({});
  
  const navigate = useNavigate();

  
  const { register, handleSubmit, formState: { errors } } = useForm<OfficerFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const handleFileUpload = (fieldName: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [fieldName]: file }));
    toast.success(`${file.name} uploaded successfully`);
  };

  const onSubmit: SubmitHandler<OfficerFormData> = async (_data) => {
    setIsLoading(true);
    
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setIsSubmitted(true);
      toast.success('Registration submitted successfully! Awaiting admin approval.');
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Submitted
          </h2>
          <p className="text-gray-600 mb-6">
            Your officer registration has been submitted for verification. 
            You will receive an email notification once your account is approved by the admin.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800">
              <strong>Next Steps:</strong><br />
              1. Admin will verify your credentials<br />
              2. You'll receive approval notification<br />
              3. Login to access your dashboard
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Officer Registration
          </h1>
          <p className="text-gray-600">
            Register as a Tourist Safety Officer to access the monitoring dashboard
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-orange-600" />
                Basic Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('name')}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Official Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="officer@gov.in"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('phone')}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-3 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Create strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('dateOfBirth')}
                      type="date"
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>
              </div>
            </div>

            {/* Government Verification */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Badge className="w-5 h-5 mr-2 text-orange-600" />
                Government Verification
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Officer ID *
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('officerId')}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="DEL-SUP-010124-001"
                    />
                  </div>
                  {errors.officerId && <p className="text-red-500 text-sm mt-1">{errors.officerId.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      {...register('department')}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select department</option>
                      <option value="Delhi Police">Delhi Police</option>
                      <option value="Mumbai Police">Mumbai Police</option>
                      <option value="Bangalore Police">Bangalore Police</option>
                      <option value="Tourism Department">Tourism Department</option>
                      <option value="Central Police">Central Police</option>
                      <option value="Railway Police">Railway Police</option>
                      <option value="Airport Security">Airport Security</option>
                    </select>
                  </div>
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rank *
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      {...register('rank')}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select rank</option>
                      <option value="Inspector">Inspector</option>
                      <option value="Sub-Inspector">Sub-Inspector</option>
                      <option value="Assistant Sub-Inspector">Assistant Sub-Inspector</option>
                      <option value="Head Constable">Head Constable</option>
                      <option value="Constable">Constable</option>
                      <option value="Officer">Officer</option>
                      <option value="Senior Officer">Senior Officer</option>
                    </select>
                  </div>
                  {errors.rank && <p className="text-red-500 text-sm mt-1">{errors.rank.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Posting *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('posting')}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Current posting location"
                    />
                  </div>
                  {errors.posting && <p className="text-red-500 text-sm mt-1">{errors.posting.message}</p>}
                </div>
              </div>

              {/* Document Upload */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Document Upload</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {['Government ID', 'Aadhaar/PAN', 'Service Certificate', 'Official Photo'].map((doc) => (
                    <div key={doc} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600 mt-2">{doc}</p>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(doc.toLowerCase().replace(/[^a-z0-9]/g, '_'), file);
                          }}
                          id={doc.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                        />
                        <label
                          htmlFor={doc.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                          className="mt-2 inline-block bg-white text-gray-700 px-3 py-1 rounded border hover:bg-gray-50 cursor-pointer text-sm"
                        >
                          Choose File
                        </label>
                        {uploadedFiles[doc.toLowerCase().replace(/[^a-z0-9]/g, '_')] && (
                          <p className="text-green-600 text-xs mt-1 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {uploadedFiles[doc.toLowerCase().replace(/[^a-z0-9]/g, '_')].name}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-orange-600" />
                Emergency Contact Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('alternateContact')}
                      className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Alternate phone number"
                    />
                  </div>
                  {errors.alternateContact && <p className="text-red-500 text-sm mt-1">{errors.alternateContact.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporting Authority *
                  </label>
                  <input
                    {...register('reportingAuthority')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Reporting officer name"
                  />
                  {errors.reportingAuthority && <p className="text-red-500 text-sm mt-1">{errors.reportingAuthority.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Office Address *
                  </label>
                  <textarea
                    {...register('officeAddress')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Complete office address"
                    rows={3}
                  />
                  {errors.officeAddress && <p className="text-red-500 text-sm mt-1">{errors.officeAddress.message}</p>}
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-start">
                <input
                  {...register('termsConsent')}
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I agree to the <a href="#" className="text-orange-600 hover:text-orange-700">Terms of Service</a> and <a href="#" className="text-orange-600 hover:text-orange-700">Officer Code of Conduct</a>
                </label>
              </div>
              {errors.termsConsent && <p className="text-red-500 text-sm">{errors.termsConsent.message}</p>}

              <div className="flex items-start">
                <input
                  {...register('dataConsent')}
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I consent to the processing of my official data for platform access and monitoring purposes
                </label>
              </div>
              {errors.dataConsent && <p className="text-red-500 text-sm">{errors.dataConsent.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Registration...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit for Approval</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfficerRegistration;