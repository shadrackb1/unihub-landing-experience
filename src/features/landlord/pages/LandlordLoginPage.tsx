// @ts-nocheck
import { useState } from 'react';
import { 
  Loader2, Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, LogIn, Users, Building2
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { signInLandlord, homeForStatus } from '@/features/landlord/services/landlordService';
import { cn } from '@/shared/lib/utils';

export const LandlordLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);
    
    try {
      const { profile } = await signInLandlord(formData.email, formData.password);

      if (profile.state === 'missing') {
        throw new Error('No landlord profile found for this account. Please register as a landlord first.');
      }
      if (profile.state === 'unavailable') {
        throw new Error(profile.message);
      }

      void navigate({ to: homeForStatus(profile.status), replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Landlord Sign In
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Access your landlord dashboard
          </p>
        </div>

        {showError && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
            <XCircle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-800">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div className="flex items-center justify-between">
            <Link 
              to="/landlord/register" 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Don't have an account? Register
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
              isLoading ? 'bg-indigo-600 bg-opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            )}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          </button>
        </form>
        
        <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
          <p className="text-sm text-gray-500">
            Forgot your password? Contact support via WhatsApp for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};