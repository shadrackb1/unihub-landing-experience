import { useState } from 'react';
import { 
  Loader2, Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, TrendingUp, Building2, 
  Users, MapPin, BookOpen, Calendar, CreditCard
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '@/shared/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '@/shared/lib/firebase';
import { cn } from '@/shared/lib/utils';

export const LandlordRegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    businessName: '',
    phone: '',
    whatsappNumber: '',
    nationalId: '',
    targetCampuses: '',
    estimatedProperties: '',
    reviewNote: '',
    status: 'pending'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? e.target.checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);
    
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Update profile with display name
      await updateProfile(auth.currentUser!, {
        displayName: formData.fullName
      });

      // Create landlord profile in Firestore
      await setDoc(doc(db, 'landlords', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: formData.email,
        fullName: formData.fullName,
        businessName: formData.businessName,
        phone: formData.phone,
        whatsappNumber: formData.whatsappNumber,
        nationalId: formData.nationalId,
        targetCampuses: formData.targetCampuses.split(',').map(c => c.trim()),
        estimatedProperties: parseInt(formData.estimatedProperties) || 0,
        status: 'pending',
        reviewNote: '',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setShowSuccess(true);
      // Auto-login after successful registration
      setTimeout(() => {
        // Navigate to landlord dashboard
        // In a real app, we'd redirect here
        window.location.href = '/landlord';
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Registration Successful!</h2>
            <p className="text-sm text-gray-600">
              Your application is now under review. You'll receive a WhatsApp message 
              once approved (usually within 24 hours).
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              While you wait, you can:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 pl-5">
              <li>Prepare your property photos and details</li>
              <li>Think about which ad boost package you'd like</li>
              <li>Review our listing guidelines</li>
            </ul>
          </div>
          <Link 
            to="/" 
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Landlord Registration
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Join verified landlords serving Kenyan campuses
          </p>
        </div>

        {showError && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
            <XCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-800">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Account Info */}
          {step === 1 && (
            <>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                  isLoading ? 'bg-indigo-600 bg-opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                )}
              >
                {isLoading ? 'Creating Account...' : 'Next: Profile Info'}
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </button>
            </>
          )}

          {/* Step 2: Profile Info */}
          {step === 2 && (
            <>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Business/Agency Name (optional)</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Joy Homes Real Estate"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+254 7XX XXX XXX"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+254 7XX XXX XXX (for student inquiries)"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    isLoading ? 'bg-indigo-600 bg-opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  )}
                >
                  {isLoading ? 'Saving Profile...' : 'Next: Verification'}
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </button>
              </div>
            </>
          )}

          {/* Step 3: Verification & Submission */}
          {step === 3 && (
            <>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">National ID / Passport Number</label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="12345678"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  For verification purposes only. Never shared publicly.
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Target Campus Areas</label>
                <input
                  type="text"
                  name="targetCampuses"
                  value={formData.targetCampuses}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nairobi, Juja, Kahawa, Madaraka, Thika, Kesses, Njoro, Nakuru"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated list of areas you serve
                </p>
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Estimated Number of Properties</label>
                <input
                  type="number"
                  name="estimatedProperties"
                  value={formData.estimatedProperties}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="5"
                  required
                  min="0"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Any additional notes?</label>
                <textarea
                  name="reviewNote"
                  value={formData.reviewNote}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="Any specializations, certifications, or notes for our review team..."
                />
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  By registering, you agree to provide accurate information and 
                  undergo verification to ensure student safety.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                    isLoading ? 'bg-indigo-600 bg-opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  )}
                >
                  {isLoading ? 'Submitting Application...' : 'Complete Registration'}
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </button>
              </div>
            </>
          )}
        </form>
        
        <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link 
              to="/login/landlord" 
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};