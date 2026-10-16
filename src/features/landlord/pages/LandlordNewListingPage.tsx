import { useState } from 'react';
import { 
  Loader2, Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, TrendingUp, Building2, 
  Users, MapPin, BookOpen, Calendar, CreditCard,
  PieChart, BarChart, ArrowUpRight, Edit2, 
  DollarSign, ImagePlus, Video, Plus, Sapling,
  FileText, CornerLeftRight
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '@/shared/lib/firebase';
import { db } from '@/shared/lib/firebase';
import { cn } from '@/shared/lib/utils';

export const LandlordNewListingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    campus: '',
    location: '',
    type: '',
    price: '',
    deposit: '',
    description: '',
    amenities: '',
    images: []
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // In a real implementation, we'd upload to Firebase Storage first
      // For now, we'll simulate with placeholder URLs
      const imageUrls = files.map((_, index) => 
        `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?auto=format&fit=crop&q=80&w=800`
      );
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...imageUrls] 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowError(false);
    
    try {
      // Validate required fields
      if (!formData.title || !formData.campus || !formData.location || 
          !formData.type || !formData.price || !formData.description) {
        throw new Error('Please fill in all required fields');
      }
      
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      // Create listing ID
      const listingId = `prop_${Date.now()}`;
      
      // In a real implementation, we'd:
      // 1. Upload images to Firebase Storage and get URLs
      // 2. Save listing to Firestore with status: 'pending'
      
      // For demo, we'll simulate saving
      await setDoc(doc(db, 'marketListings', listingId), {
        id: listingId,
        title: formData.title,
        campus: formData.campus,
        location: formData.location,
        type: formData.type,
        price: parseInt(formData.price) || 0,
        deposit: parseInt(formData.deposit) || 0,
        description: formData.description,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a.length > 0),
        images: formData.images.length > 0 ? formData.images : [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
        ],
        landlordId: user.uid,
        status: 'pending', // Needs admin approval
        inquiries: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setShowSuccess(true);
      // Redirect to listings page after success
      setTimeout(() => {
        window.location.href = '/landlord/listings';
      }, 2000);
    } catch (error) {
      console.error('Failed to create listing:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create listing');
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
              <h1 className="text-xl font-semibold text-gray-800">New Property Listing</h1>
            </div>
          </div>
          
          <nav className="mt-6 space-y-2 px-4 pb-4">
            <Link 
              to="/landlord/listings" 
              className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium hover:bg-zinc-50"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Back to Listings
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
                  <span className="text-green-800">Listing created successfully!</span>
                  <p className="text-sm text-gray-500 mt-2">
                    Your listing is now pending review. Once approved, it will appear in search results.
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
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Property Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Spacious 2BR Apartment Near Campus"
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Campus/Area</label>
                      <select
                        name="campus"
                        value={formData.campus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select campus area</option>
                        <option value="UoN">University of Nairobi (UoN)</option>
                        <option value="JKUAT">Jomo Kenyatta University (JKUAT)</option>
                        <option value="KU">Kenyatta University (KU)</option>
                        <option value="SU">Strathmore University (SU)</option>
                        <option value="MU">Moi University (MU)</option>
                        <option value="EGU">Egerton University (EGU)</option>
                        <option value="Thika">Thika student belt</option>
                        <option value="Nairobi">Nairobi (other areas)</option>
                        <option value="Juja">Juja</option>
                        <option value="Kahawa">Kahawa</option>
                        <option value="Madaraka">Madaraka</option>
                        <option value="Kesses">Kesses</option>
                        <option value="Njoro">Njoro</option>
                        <option value="Nakuru">Nakuru</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Specific Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., Near main gate, Opposite supermarket, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Property Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select property type</option>
                        <option value="Bedsitter">Bedsitter</option>
                        <option value="Studio">Studio</option>
                        <option value="Single room">Single room</option>
                        <option value="One bedroom">One bedroom</option>
                        <option value="Two bedroom">Two bedroom</option>
                        <option value="Three bedroom">Three bedroom</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Hostel">Hostel</option>
                      </select>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Monthly Rent (KES)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="15000"
                        required
                        min="1000"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Deposit (KES)</label>
                      <input
                        type="number"
                        name="deposit"
                        value={formData.deposit}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="15000 (optional)"
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
                          'w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                          isLoading ? 'bg-indigo-600 bg-opacity-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        )}
                      >
                        {isLoading ? 'Saving Property Info...' : 'Next: Description & Photos'}
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2: Description & Photos */}
                {step === 2 && (
                  <>
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Property Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="6"
                        placeholder="Describe the property, amenities, nearby facilities, transport links, etc."
                        required
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
                      <input
                        type="text"
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Wi-Fi, Water 24/7, Security, Parking, Gym, Laundry"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Helps students understand what's included
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">Property Photos</label>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">
                          Upload clear photos of the property (rooms, bathroom, kitchen, common areas)
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-gray-500">
                          Maximum 10 images. JPG, PNG format recommended.
                        </p>
                      </div>
                      
                      {formData.images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700">Preview:</p>
                          <div className="flex space-x-2">
                            {formData.images.slice(0, 3).map((img, index) => (
                              <img 
                                key={index} 
                                src={img} 
                                alt="Property photo" 
                                className="w-20 h-20 object-cover rounded"
                                style={{ aspectRatio: '4 / 3' }}
                              />
                            ))}
                            {formData.images.length > 3 && (
                              <div className="flex items-center justify-center w-20 h-20 bg-zinc-200 rounded text-xs">
                                +{formData.images.length - 3}
                              </div>
                            )}
                          </div>
                        )
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
                        {isLoading ? 'Creating Listing...' : 'Submit for Review'}
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </button>
                    </div>
                  </>
                )}
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
};