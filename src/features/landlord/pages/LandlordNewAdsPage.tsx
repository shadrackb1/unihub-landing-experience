// @ts-nocheck
import { useState } from 'react';
import { 
  Loader2, Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, TrendingUp, Building2, 
  Users, MapPin, BookOpen, Calendar, CreditCard,
  PieChart, BarChart, ArrowUpRight, Edit2, 
  DollarSign, ImagePlus, Video, Plus, Sprout as Sapling,
  FileText, ArrowLeftRight as CornerLeftRight, Zap
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { cn } from '@/shared/lib/utils';

export const LandlordNewAdsPage = () => {
  const [formData, setFormData] = useState({
    listingId: '',
    listingTitle: '',
    plan: '',
    paymentMethod: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Extract listingId from URL (in a real app, we'd use useSearchParams)
  const urlParams = new URLSearchParams(window.location.search);
  const listingIdFromUrl = urlParams.get('listingId') || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Validate required fields
      if (!formData.listingId || !formData.plan || !formData.paymentMethod) {
        throw new Error('Please fill in all required fields');
      }
      
      // In a real implementation:
      // 1. Verify the listing belongs to the current user
      // 2. Create payment instructions (M-Pesa till number, etc.)
      // 3. Save ad campaign request to Firestore with status: 'requested'
      // 4. Provide payment details to user
      
      // For demo, we'll simulate success
      setShowSuccess(true);
      // Redirect to ads page after success
      setTimeout(() => {
        window.location.href = '/landlord/ads';
      }, 2000);
    } catch (error) {
      console.error('Failed to create ad campaign:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create ad campaign');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen">
        {/* Sidebar - simplified */}
        <aside className="w-64 bg-white border-r border-zinc-200">
          <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-800">Create Ad Campaign</h1>
            </div>
          </div>
          
          <nav className="mt-6 space-y-2 px-4 pb-4">
            <Link 
              to="/landlord/ads" 
              className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium hover:bg-zinc-50"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Back to Ad Campaigns
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
            </div>
          )}
          
          {!isLoading && (
            <div className="space-y-6">
              {/* Status messages */}
              {showSuccess && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-green-800">Ad campaign created successfully!</span>
                  <p className="text-sm text-gray-500 mt-2">
                    Please complete payment via M-Pesa to activate your boost.
                    Payment details will be shown below.
                  </p>
                </div>
              )}
              
              {showError && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-red-800">{errorMessage}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Select Listing & Plan */}
                {step === 1 && (
                  <>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Select Property to Boost</label>
                      <select
                        name="listingId"
                        value={formData.listingId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select a property</option>
                        <option value="prop_001">Spacious 2BR Near JKUAT</option>
                        <option value="prop_002">Modern Studio Near UoN</option>
                        <option value="prop_003">Cozy Bedsitter Near Kenyatta Uni</option>
                      </select>
                      
                      {formData.listingId && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Selected:</p>
                          <p className="font-medium">{formData.listingTitle || 
                            (formData.listingId === 'prop_001' ? 'Spacious 2BR Near JKUAT' :
                             formData.listingId === 'prop_002' ? 'Modern Studio Near UoN' :
                             formData.listingId === 'prop_003' ? 'Cozy Bedsitter Near Kenyatta Uni' :
                             'Unknown Property')}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Boost Duration</label>
                      <select
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select boost duration</option>
                        <option value="week">7 Days - KES 500</option>
                        <option value="fortnight">14 Days - KES 900</option>
                        <option value="month">30 Days - KES 1,500</option>
                      </select>
                      
                      {formData.plan && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">
                            Selected: {formData.plan === 'week' ? '7 Days (KES 500)' : 
                                        formData.plan === 'fortnight' ? '14 Days (KES 900)' : 
                                        formData.plan === 'month' ? '30 Days (KES 1,500)' : 'Custom'}
                          </p>
                        </div>
                      )}
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
                          'w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                          isLoading ? 'bg-indigo-600 bg-opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        )}
                      >
                        {isLoading ? 'Creating Campaign...' : 'Next: Payment Instructions'}
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2: Payment Instructions */}
                {step === 2 && (
                  <>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select payment method</option>
                        <option value="mpesa">M-Pesa (Recommended)</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </div>
                    
                    {formData.paymentMethod === 'mpesa' && (
                      <>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">M-Pesa Payment Details</label>
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-indigo-600">
                              To complete your ad boost payment:
                            </p>
                            <div className="space-y-2">
                              <p className="font-medium text-gray-800">
                                Paybill: 400200
                              </p>
                              <p className="font-medium text-gray-800">
                                Account Number: UNIHUB{Math.floor(Math.random() * 10000)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              Amount: {formData.plan === 'week' ? '500' : 
                                      formData.plan === 'fortnight' ? '900' : 
                                      formData.plan === 'month' ? '1500' : '0'} KES
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              After payment, your boost will be activated within 15 minutes.
                            </p>
                          </div>
                        </div>
                      </>
                      )}
                    
                    {formData.paymentMethod === 'bank' && (
                      <>
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">Bank Transfer Details</label>
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-indigo-600">
                              To complete your ad boost payment via bank transfer:
                            </p>
                            <div className="space-y-2">
                              <p className="font-medium text-gray-800">
                                Bank: Kenya Commercial Bank
                              </p>
                              <p className="font-medium text-gray-800">
                                Account Name: UniHub Properties Ltd
                              </p>
                              <p className="font-medium text-gray-800">
                                Account Number: 0123456789
                              </p>
                              <p className="font-medium text-gray-800">
                                Branch: Nairobi HQ
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              Amount: {formData.plan === 'week' ? '500' : 
                                      formData.plan === 'fortnight' ? '900' : 
                                      formData.plan === 'month' ? '1500' : '0'} KES
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              After payment, please send the transaction ID to our WhatsApp support for verification.
                            </p>
                          </div>
                        </div>
                      </>
                      )}
                    
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
                          'w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                          isLoading ? 'bg-indigo-600 bg-opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        )}
                      >
                        {isLoading ? 'Submitting Payment Info...' : 'Complete & Activate'}
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};