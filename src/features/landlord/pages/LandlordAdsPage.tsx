import { useState } from 'react';
import { 
  Loader2, Mail, MessageCircle, Phone, ShieldCheck, 
  CheckCircle, XCircle, TrendingUp, Building2, 
  Users, MapPin, BookOpen, Calendar, CreditCard,
  PieChart, BarChart, ArrowUpRight, Edit2, 
  DollarSign, ImagePlus, Video, Plus, Sapling,
  FileText, CornerLeftRight, Zap
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { cn } from '@/shared/lib/utils';

export const LandlordAdsPage = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([
    {
      id: 'ad_001',
      listingId: 'prop_001',
      listingTitle: 'Spacious 2BR Near JKUAT',
      plan: 'month',
      startedAt: new Date(Date.now() - 10 * 86400000), // 10 days ago
      expiresAt: new Date(Date.now() + 20 * 86400000), // 20 days from now
      cost: 1500,
      status: 'active',
      views: 1240,
      inquiries: 34
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRequestAdBoost = (listingId: string) => {
    // In a real implementation, we'd navigate to ad selection for this listing
    window.location.href = `/landlord/ads/new?listingId=${listingId}`;
  };

  const handleCancelCampaign = async (id: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, update Firestore to cancel
      setActiveCampaigns(activeCampaigns.filter(campaign => campaign.id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to cancel campaign:', error);
      setShowError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to cancel campaign');
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
              <h1 className="text-xl font-semibold text-gray-800">Ad Boost Campaigns</h1>
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
              className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium hover:bg-zinc-50"
            >
              <Users className="h-4 w-4 mr-2" />
              Listings
            </Link>
            
            <Link 
              to="/landlord/ads" 
              className="w-full flex items-center justify-start px-3 py-2 rounded-lg text-left text-sm font-medium bg-indigo-50 text-indigo-600"
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
                <h2 className="text-xl font-bold text-gray-800">Your Ad Campaigns</h2>
                <Link 
                  to="/landlord/ads/new" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  + New Campaign
                </Link>
              </div>
              
              <div className="space-y-4">
                {activeCampaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-indigo-300 mb-4" />
                    <p className="text-sm text-gray-500">
                      You don't have any active ad campaigns yet. Boost a listing to get more student views!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeCampaigns.map((campaign) => (
                      <div 
                        key={campaign.id} 
                        className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between">
                          {/* Left side - campaign info */}
                          <div className="flex-1 space-x-4">
                            <div className="flex items-center space-x-3">
                              <Zap className="h-5 w-5" 
                                className={campaign.status === 'active' ? 'text-green-500' : 
                                          campaign.status === 'paused' ? 'text-yellow-500' : 
                                          campaign.status === 'completed' ? 'text-gray-500' : 'text-red-500'}
                              />
                              <div>
                                <h3 className="font-medium text-gray-800 mb-1">Boost for: {campaign.listingTitle}</h3>
                                <p className="text-sm text-gray-500">
                                  {campaign.plan === 'week' ? '1 Week' : 
                                  campaign.plan === 'fortnight' ? '2 Weeks' : 
                                  campaign.plan === 'month' ? '1 Month' : 'Custom'}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Started: {campaign.startedAt.toLocaleDateString()} • 
                                  Expires: {campaign.expiresAt.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        
                            {/* Right side - stats and actions */}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <MessageCircle className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{campaign.views} views</span>
                              </div>
                              
                              <div className="flex items-center space-x-2 mt-2">
                                <DollarSign className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">KES {campaign.cost.toLocaleString()}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2 mt-2">
                                <ArrowUpRight className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{campaign.inquiries} inquiries</span>
                              </div>
                              
                              {campaign.status === 'active' && (
                                <button
                                  onClick={() => handleCancelCampaign(campaign.id)}
                                  className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded hover:bg-red-200"
                                >
                                  Pause
                                </button>
                              )}
                              {(campaign.status === 'paused' || campaign.status === 'completed') && (
                                <button
                                  onClick={() => handleCancelCampaign(campaign.id)}
                                  className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                                >
                                  Reactivate
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">How Ad Boosting Works</h2>
                <div className="grid gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Your Plan</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                        <span className="text-sm font-medium text-white">7 Days</span>
                        <span className="text-sm font-medium text-white">KES 500</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Great for testing or short-term availability
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-indigo-100 rounded-lg">
                        <span className="text-sm font-medium text-indigo-600">14 Days</span>
                        <span className="text-sm font-medium text-indigo-600">KES 900</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Most popular - balanced reach and value
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-indigo-200 rounded-lg">
                        <span className="text-sm font-medium text-indigo-600">30 Days</span>
                        <span className="text-sm font-medium text-indigo-600">KES 1,500</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Best value for long-term listings
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm p-6 border border-zinc-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">What You Get</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>Priority placement in search results</li>
                      <li>Featured badge on your listing</li>
                      <li>Increased visibility to students</li>
                      <li>Performance tracking (views & inquiries)</li>
                      <li>Automatic expiration - no surprises</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};