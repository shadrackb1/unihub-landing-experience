import { useState } from 'react';
import { 
  Loader2, Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, TrendingUp, Building2, 
  Users, MapPin, BookOpen, Calendar, CreditCard,
  PieChart, BarChart, ArrowUpRight, Edit2, 
  DollarSign, ImagePlus, Video
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { cn } from '@/shared/lib/utils';

export const LandlordListingsPage = () => {
  const [listings, setListings] = useState([
    {
      id: 'prop_001',
      title: 'Spacious 2BR Near JKUAT',
      campus: 'JKUAT',
      location: 'Juja',
      type: 'Two Bedroom',
      price: 18000,
      deposit: 18000,
      status: 'published',
      inquiries: 5,
      adStatus: 'active',
      adExpiresAt: new Date(Date.now() + 15 * 86400000), // 15 days
      dateCreated: new Date(Date.now() - 30 * 86400000),
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
      ]
    },
    {
      id: 'prop_002',
      title: 'Modern Studio Near UoN',
      campus: 'UoN',
      location: 'Nairobi',
      type: 'Studio',
      price: 12000,
      deposit: 12000,
      status: 'featured',
      inquiries: 12,
      adStatus: 'none',
      dateCreated: new Date(Date.now() - 45 * 86400000),
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1de242407d?auto=format&fit=crop&q=80&w=800'
      ]
    },
    {
      id: 'prop_003',
      title: 'Cozy Bedsitter Near Kenyatta Uni',
      campus: 'KU',
      location: 'Kahawa',
      type: 'Bedsitter',
      price: 8000,
      deposit: 8000,
      status: 'pending',
      inquiries: 2,
      adStatus: 'requested',
      dateCreated: new Date(Date.now() - 5 * 86400000),
      images: [
        'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=800'
      ]
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangeStatus = async (id: string, newStatus: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, update Firestore
      setListings(listings.map(listing => 
        listing.id === id ? { ...listing, status: newStatus } : listing
      ));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to update status:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAdBoost = (id: string) => {
    // Navigate to ad boost selection for this listing
    window.location.href = `/landlord/ads/new?listingId=${id}`;
  };

  const handleEditListing = (id: string) => {
    window.location.href = `/landlord/listings/${id}/edit`;
  };

  const handleDeleteListing = async (id: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, delete from Firestore
      setListings(listings.filter(listing => listing.id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to delete listing:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete listing');
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
              <h1 className="text-xl font-semibold text-gray-800">My Properties</h1>
            </div>
          </div>
          
          <nav className="mt-6 space-y-2 px-4 pb-4">
            <Link 
              to="/landlord" 
              className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium hover:bg-zinc-50"
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
            
            <Link 
              to="/landlord/listings" 
              className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium bg-indigo-50 text-indigo-600"
            >
              <Users className="h-4 w-4 mr-2" />
              Listings
            </Link>
            
            <Link 
              to="/landlord/ads" 
              className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium hover:bg-zinc-50"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Ad Boosts
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
                  <span className="text-green-800">Operation successful!</span>
                </div>
              )}
              
              {showError && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500">
                  <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-red-800">{errorMessage}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">My Properties</h2>
                <Link 
                  to="/landlord/listings/new" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  + New Listing
                </Link>
              </div>
              
              <div className="space-y-4">
                {listings.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-indigo-300 mb-4" />
                    <p className="text-sm text-gray-500">
                      You haven't listed any properties yet. Click above to add your first listing!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div 
                        key={listing.id} 
                        className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between">
                          {/* Left side - property info */}
                          <div className="flex-1 space-x-4">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5" 
                                className={listing.status === 'published' ? 'text-green-500' : 
                                          listing.status === 'featured' ? 'text-indigo-500' : 
                                          listing.status === 'pending' ? 'text-yellow-500' : 'text-gray-500'}
                              />
                              <div>
                                <h3 className="font-medium text-gray-800 mb-1">{listing.title}</h3>
                                <div className="flex items-center space-x-2 text-sm">
                                  <span className="font-medium">{listing.campus}</span>
                                  <span className="text-gray-500">•</span>
                                  <span>{listing.location}</span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {listing.type} • KES {listing.price.toLocaleString()} / month
                                </p>
                                {listing.deposit && (
                                  <p className="text-xs text-gray-400">
                                    Deposit: KES {listing.deposit.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Right side - status and actions */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {listing.adStatus === 'active' && (
                                <div className="flex items-center space-x-1 bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded">
                                  <ArrowUpRight className="h-3 w-3" /> Boosted
                                </div>
                              )}
                              {listing.adStatus === 'requested' && (
                                <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded">
                                  <Loader2 className="h-3 w-3 animate-spin" /> Pending
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-2">
                              <MessageCircle className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{listing.inquiries} inquiries</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-2">
                              {listing.status === 'published' && (
                                <button
                                  onClick={() => handleRequestAdBoost(listing.id)}
                                  className="px-2 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                  Boost
                                </button>
                              )}
                              {listing.status !== 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleEditListing(listing.id)}
                                    className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-1"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteListing(listing.id)}
                                    className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                              {listing.status === 'pending' && (
                                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-600 rounded">
                                  Pending Review
                                </span>
                              )}
                              {listing.status === 'published' && (
                                <>
                                  <button
                                    onClick={() => handleChangeStatus(listing.id, 'hidden')}
                                    className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-1"
                                  >
                                    Hide
                                  </button>
                                  <button
                                    onClick={() => handleChangeStatus(listing.id, 'featured')}
                                    className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                                  >
                                    Featured
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Images preview */}
                        {listing.images && listing.images.length > 0 && (
                          <div className="mt-4">
                            <div className="flex space-x-2">
                              {listing.images.slice(0, 3).map((img, index) => (
                                <img 
                                  key={index} 
                                  src={img} 
                                  alt={listing.title} 
                                  className="w-16 h-16 object-cover rounded"
                                  style={{ aspectRatio: '4 / 3' }}
                                />
                              ))}
                              {listing.images.length > 3 && (
                                <div className="flex items-center justify-center w-16 h-16 bg-zinc-200 rounded text-xs">
                                  +{listing.images.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};