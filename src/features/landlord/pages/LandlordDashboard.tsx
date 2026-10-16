import { useState, useEffect } from 'react';
import { 
  Loader2, Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, TrendingUp, Building2, 
  Users, MapPin, BookOpen, Calendar, CreditCard,
  PieChart, BarChart, ArrowUpRight
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth } from '@/shared/lib/firebase';
import { db } from '@/shared/lib/firebase';
import { cn } from '@/shared/lib/utils';

export const LandlordDashboard = () => {
  const [stats, setStats] = useState({
    activeListings: 0,
    totalInquiries: 0,
    pendingReviews: 0,
    monthlyEarnings: 0
  });
  
  const [recentListings, setRecentListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadLandlordData = async () => {
      try {
        setIsLoading(true);
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        
        const landlordDoc = await getDoc(doc(db, 'landlords', user.uid));
        if (!landlordDoc.exists()) throw new Error('Landlord profile not found');
        
        const landlordData = landlordDoc.data();
        
        // In a real app, we'd fetch actual stats from listings collection
        // For now, we'll use mock data
        setStats({
          activeListings: landlordData.activeListings || 3,
          totalInquiries: landlordData.totalInquiries || 24,
          pendingReviews: landlordData.pendingReviews || 0,
          monthlyEarnings: landlordData.monthlyEarnings || 0
        });
        
        setRecentListings([
          {
            id: 'prop_001',
            title: 'Spacious 2BR Near JKUAT',
            status: 'published',
            inquiries: 5,
            date: new Date(Date.now() - 2 * 86400000) // 2 days ago
          },
          {
            id: 'prop_002',
            title: 'Modern Studio Near UoN',
            status: 'featured',
            inquiries: 12,
            date: new Date(Date.now() - 5 * 86400000) // 5 days ago
          },
          {
            id: 'prop_003',
            title: 'Cozy Bedsitter Near Kenyatta Uni',
            status: 'pending',
            inquiries: 2,
            date: new Date(Date.now() - 1 * 86400000) // 1 day ago
          }
        ]);
      } catch (error) {
        console.error('Failed to load landlord data:', error);
        setShowError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLandlordData();
  }, []);

  const handleRefill = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would trigger a refill of inquiries or similar
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Refill failed:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Refill failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewListing = () => {
    // Navigate to new listing form
    window.location.href = '/landlord/listings/new';
  };

  const handleAdBoost = () => {
    // Navigate to ad boost selection
    window.location.href = '/landlord/ads';
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-zinc-200">
          <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-800">Landlord Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Online</span>
            </div>
          </div>
          
          <nav className="mt-6 space-y-2 px-4">
            <Link 
              to="/landlord/dashboard" 
              className={cn(
                'w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium',
                activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-zinc-50'
              )}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Overview
            </Link>
            
            <Link 
              to="/landlord/listings" 
              className={cn(
                'w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium',
                activeTab === 'listings' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-zinc-50'
              )}
            >
              <Users className="h-4 w-4 mr-2" />
              Listings
            </Link>
            
            <Link 
              to="/landlord/ads" 
              className={cn(
                'w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium',
                activeTab === 'ads' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-zinc-50'
              )}
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
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Active Listings</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-indigo-600">{stats.activeListings}</div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-indigo-400" />
                          <span className="text-sm text-gray-500">properties</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Total Inquiries</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-indigo-600">{stats.totalInquiries}</div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-5 w-5 text-indigo-400" />
                          <span className="text-sm text-gray-500">messages</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Reviews</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-indigo-600">{stats.pendingReviews}</div>
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                          <span className="text-sm text-gray-500">listings</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Earnings</h3>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-indigo-600">KES {stats.monthlyEarnings.toLocaleString()}</div>
                        <div className="flex items-center space-x-2">
                          <ArrowUpRight className="h-5 w-5 text-indigo-400" />
                          <span className="text-sm text-gray-500">from ads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Link 
                        to="/landlord/listings/new" 
                        className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Building2 className="h-6 w-6 text-indigo-600" />
                            <div>
                              <h3 className="font-medium text-gray-800">Add New Property</h3>
                              <p className="text-sm text-gray-500">List your first property</p>
                            </div>
                          </div>
                          <TrendingUp className="h-6 w-6 text-indigo-600" />
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleAdBoost}
                        className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-6 w-6 text-indigo-600" />
                            <div>
                              <h3 className="font-medium text-gray-800">Boost Visibility</h3>
                              <p className="text-sm text-gray-500">Get more student views</p>
                            </div>
                          </div>
                          <ArrowUpRight className="h-6 w-6 text-indigo-600" />
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {/* Listings Tab */}
              {activeTab === 'listings' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">My Properties</h2>
                    <Link 
                      to="/landlord/listings/new" 
                      className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      + New Listing
                    </Link>
                  </div>
                  
                  {recentListings.length === 0 ? (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 text-indigo-300 mb-4" />
                      <p className="text-sm text-gray-500">
                        You haven't listed any properties yet. Click above to add your first listing!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentListings.map((listing) => (
                        <div 
                          key={listing.id} 
                          className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <MapPin className="h-5 w-5" 
                                className={listing.status === 'published' ? 'text-green-500' : 
                                          listing.status === 'featured' ? 'text-indigo-500' : 
                                          listing.status === 'pending' ? 'text-yellow-500' : 'text-gray-500'}
                              />
                              <div>
                                <h3 className="font-medium text-gray-800">{listing.title}</h3>
                                <p className="text-sm text-gray-500">{listing.status === 'featured' ? 'Featured Listing' : 
                                                              listing.status === 'published' ? 'Active' : 
                                                              listing.status === 'pending' ? 'Pending Review' : 'Inactive'}</p>
                              </div>
                            </div>
                            <div className="text-right space-x-2">
                              <div className="flex items-center space-x-2">
                                <MessageCircle className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{listing.inquiries}</span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {listing.date.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {/* Ads Tab */}
              {activeTab === 'ads' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Ad Boost Campaigns</h2>
                    <Link 
                      to="/landlord/ads/new" 
                      className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      + New Campaign
                    </Link>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Boost Options</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                          <span className="text-sm font-medium text-white">7 Days</span>
                          <span className="text-sm font-medium text-white">KES 500</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Ideal for testing or short-term vacancies
                        </p>
                        <div className="flex items-center justify-between p-4 bg-indigo-100 rounded-lg">
                          <span className="text-sm font-medium text-indigo-600">14 Days</span>
                          <span className="text-sm font-medium text-indigo-600">KES 900</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Most popular - balanced reach and cost
                        </p>
                        <div className="flex items-center justify-between p-4 bg-indigo-200 rounded-lg">
                          <span className="text-sm font-medium text-indigo-600">30 Days</span>
                          <span className="text-sm font-medium text-indigo-600">KES 1,500</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Best value for long-term listings
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Active Campaigns</h3>
                      <p className="text-sm text-gray-500 text-center py-8">
                        No active campaigns yet. Boost a listing to get started!
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};